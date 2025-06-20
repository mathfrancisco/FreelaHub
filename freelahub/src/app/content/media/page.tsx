'use client'

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/lib/supabase/supabase';
import { toast } from 'sonner';
import {
    Upload,
    Search,
    Grid,
    List,
    Folder,
    Image,
    Video,
    FileText,
    Download,
    Trash2,
    Eye,
    Copy,
    File,
    RotateCw,
    Star,
    Heart,
    X,
    AlertCircle,
    CheckCircle,
    Clock,
    Loader2,
    Sparkles,
} from 'lucide-react';
import {geminiAI} from "@/lib/ai/gemini-client";
import { AuthGuard } from '@/components/auth/auth-guard';
import { AppLayout } from '@/components/layout/app-layout';
import {AIAnalysisResult, MediaCategory, MediaFile, UploadProgress} from "@/lib/types";

const MediaLibrarySystem = () => {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [categories, setCategories] = useState<MediaCategory[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showFileDetails, setShowFileDetails] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    // Initialize component
    useEffect(() => {
        initializeComponent();
    }, []);

    const initializeComponent = async () => {
        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('Usuário não autenticado');
                return;
            }

            setUserId(user.id);
            await Promise.all([
                loadMediaFiles(user.id),
                loadCategories(user.id)
            ]);
        } catch (error) {
            console.error('Error initializing component:', error);
            toast.error('Erro ao carregar biblioteca de mídia');
        } finally {
            setIsLoading(false);
        }
    };

    const loadMediaFiles = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('media_files')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setFiles(data || []);
        } catch (error) {
            console.error('Error loading media files:', error);
            toast.error('Erro ao carregar arquivos');
        }
    };

    const loadCategories = async (userId: string) => {
        try {
            // Get categories with file counts
            const { data, error } = await supabase
                .from('media_files')
                .select('category')
                .eq('user_id', userId);

            if (error) throw error;

            // Count categories
            const categoryCount = (data || []).reduce((acc: any, file) => {
                if (file.category) {
                    acc[file.category] = (acc[file.category] || 0) + 1;
                }
                return acc;
            }, {});

            // Create category objects
            const categoriesData = Object.entries(categoryCount).map(([name, count], index) => ({
                id: `cat-${index}`,
                name,
                color: getCategoryColor(name),
                count: count as number
            }));

            setCategories(categoriesData);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const getCategoryColor = (category: string): string => {
        const colors = {
            'Instagram': '#E91E63',
            'LinkedIn': '#0077B5',
            'Facebook': '#1877F2',
            'Twitter': '#1DA1F2',
            'Logos': '#9C27B0',
            'Documentos': '#FF9800',
            'Videos': '#F44336',
            'Imagens': '#4CAF50'
        };
        return colors[category as keyof typeof colors] || '#6B7280';
    };

    // Upload functionality with AI analysis
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (!userId) {
            toast.error('Usuário não autenticado');
            return;
        }

        setShowUploadModal(true);

        for (const file of acceptedFiles) {
            const uploadId = `upload-${Date.now()}-${Math.random()}`;

            // Initialize upload progress
            setUploadProgress(prev => [...prev, {
                id: uploadId,
                filename: file.name,
                progress: 0,
                status: 'uploading'
            }]);

            try {
                // Upload file to Supabase Storage
                const fileExt = file.name.split('.').pop();
                const fileName = `${userId}/${uploadId}.${fileExt}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('media-files')
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) throw uploadError;

                // Update progress
                setUploadProgress(prev => prev.map(p =>
                    p.id === uploadId ? { ...p, progress: 50, status: 'processing' } : p
                ));

                // Get file URL
                const { data: { publicUrl } } = supabase.storage
                    .from('media-files')
                    .getPublicUrl(fileName);

                let aiAnalysis: AIAnalysisResult | null = null;

                // Analyze image with AI if it's an image
                if (file.type.startsWith('image/')) {
                    try {
                        setUploadProgress(prev => prev.map(p =>
                            p.id === uploadId ? { ...p, progress: 75, status: 'analyzing' } : p
                        ));

                        // Convert file to base64 for AI analysis
                        const base64 = await fileToBase64(file);
                        aiAnalysis = await geminiAI.analyzeImage(base64.split(',')[1], `Marketing content for ${file.name}`);

                    } catch (aiError) {
                        console.error('AI analysis error:', aiError);
                        // Continue without AI analysis
                    }
                }

                // Get image dimensions if it's an image
                let dimensions: { width: number; height: number } | undefined;
                if (file.type.startsWith('image/')) {
                    dimensions = await getImageDimensions(file);
                }

                // Save file metadata to database
                const { data: dbData, error: dbError } = await supabase
                    .from('media_files')
                    .insert({
                        user_id: userId,
                        filename: fileName,
                        original_name: file.name,
                        file_type: file.type,
                        file_url: publicUrl,
                        file_size: file.size,
                        metadata: {
                            width: dimensions?.width,
                            height: dimensions?.height,
                            ai_analysis: aiAnalysis,
                            description: aiAnalysis?.description,
                            alt_text: aiAnalysis?.suggestedCaption
                        },
                        tags: aiAnalysis?.hashtags || [],
                        color_palette: aiAnalysis?.colorPalette || [],
                        dimensions: dimensions,
                        is_favorite: false,
                        usage_count: 0
                    })
                    .select()
                    .single();

                if (dbError) throw dbError;

                // Update files list
                setFiles(prev => [dbData, ...prev]);

                // Complete upload
                setUploadProgress(prev => prev.map(p =>
                    p.id === uploadId ? {
                        ...p,
                        progress: 100,
                        status: 'completed',
                        aiAnalysis
                    } : p
                ));

                toast.success(`${file.name} carregado com sucesso!`);

            } catch (error) {
                console.error('Upload error:', error);
                setUploadProgress(prev => prev.map(p =>
                    p.id === uploadId ? { ...p, status: 'error' } : p
                ));
                toast.error(`Erro ao carregar ${file.name}`);
            }
        }

        // Clean up completed uploads after 3 seconds
        setTimeout(() => {
            setUploadProgress(prev => prev.filter(p => p.status !== 'completed'));
            if (uploadProgress.every(p => p.status === 'completed' || p.status === 'error')) {
                setShowUploadModal(false);
            }
        }, 3000);

    }, [userId, uploadProgress]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
            'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.webm'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxSize: 50 * 1024 * 1024, // 50MB
        multiple: true
    });

    // Utility functions
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
        return new Promise((resolve) => {
            // @ts-ignore
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };
            img.src = URL.createObjectURL(file);
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <Image className="h-5 w-5" />;
        if (type.startsWith('video/')) return <Video className="h-5 w-5" />;
        if (type.startsWith('audio/')) return <File className="h-5 w-5" />;
        return <FileText className="h-5 w-5" />;
    };

    const toggleFavorite = async (fileId: string) => {
        try {
            const file = files.find(f => f.id === fileId);
            if (!file) return;

            const { error } = await supabase
                .from('media_files')
                .update({ is_favorite: !file.is_favorite })
                .eq('id', fileId);

            if (error) throw error;

            setFiles(prev => prev.map(f =>
                f.id === fileId ? { ...f, is_favorite: !f.is_favorite } : f
            ));

            toast.success(file.is_favorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('Erro ao atualizar favorito');
        }
    };

    const deleteFile = async (fileId: string) => {
        try {
            const file = files.find(f => f.id === fileId);
            if (!file) return;

            // Delete from storage
            const { error: storageError } = await supabase.storage
                .from('media-files')
                .remove([file.filename]);

            if (storageError) throw storageError;

            // Delete from database
            const { error: dbError } = await supabase
                .from('media_files')
                .delete()
                .eq('id', fileId);

            if (dbError) throw dbError;

            setFiles(prev => prev.filter(f => f.id !== fileId));
            setSelectedFiles(prev => prev.filter(id => id !== fileId));

            if (selectedFile?.id === fileId) {
                setSelectedFile(null);
                setShowFileDetails(false);
            }

            toast.success('Arquivo excluído com sucesso');
        } catch (error) {
            console.error('Error deleting file:', error);
            toast.error('Erro ao excluir arquivo');
        }
    };

    const downloadFile = async (file: MediaFile) => {
        try {
            const { data, error } = await supabase.storage
                .from('media-files')
                .download(file.filename);

            if (error) throw error;

            const url = URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.original_name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success('Download iniciado');
        } catch (error) {
            console.error('Error downloading file:', error);
            toast.error('Erro ao fazer download');
        }
    };

    const regenerateAIAnalysis = async (file: MediaFile) => {
        if (!file.file_type.startsWith('image/')) {
            toast.error('Análise de IA disponível apenas para imagens');
            return;
        }

        try {
            toast.loading('Analisando imagem com IA...');

            // Download image and convert to base64
            const { data, error } = await supabase.storage
                .from('media-files')
                .download(file.filename);

            if (error) throw error;

            const base64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(data);
            });

            const aiAnalysis = await geminiAI.analyzeImage(
                base64.split(',')[1],
                `Marketing content analysis for ${file.original_name}`
            );

            // Update file with new analysis
            const { error: updateError } = await supabase
                .from('media_files')
                .update({
                    metadata: {
                        ...file.metadata,
                        ai_analysis: aiAnalysis,
                        description: aiAnalysis.description,
                        alt_text: aiAnalysis.suggestedCaption
                    },
                    tags: aiAnalysis.hashtags,
                    color_palette: aiAnalysis.colorPalette
                })
                .eq('id', file.id);

            if (updateError) throw updateError;

            // Update local state
            setFiles(prev => prev.map(f =>
                f.id === file.id ? {
                    ...f,
                    metadata: {
                        ...f.metadata,
                        ai_analysis: aiAnalysis,
                        description: aiAnalysis.description,
                        alt_text: aiAnalysis.suggestedCaption
                    },
                    tags: aiAnalysis.hashtags,
                    color_palette: aiAnalysis.colorPalette
                } : f
            ));

            if (selectedFile?.id === file.id) {
                setSelectedFile(prev => prev ? {
                    ...prev,
                    metadata: {
                        ...prev.metadata,
                        ai_analysis: aiAnalysis,
                        description: aiAnalysis.description,
                        alt_text: aiAnalysis.suggestedCaption
                    },
                    tags: aiAnalysis.hashtags,
                    color_palette: aiAnalysis.colorPalette
                } : null);
            }

            toast.success('Análise de IA atualizada com sucesso!');
        } catch (error) {
            console.error('Error regenerating AI analysis:', error);
            toast.error('Erro ao analisar imagem');
        }
    };

    // Filter files based on search and category
    const filteredFiles = files.filter(file => {
        const matchesSearch = file.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = !selectedCategory || file.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Carregando biblioteca de mídia...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthGuard>
            <AppLayout>
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Biblioteca de Mídia</h1>
                        <p className="text-gray-600 mt-1">Gerencie e analise seus arquivos com IA</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                            >
                                <Grid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                        >
                            <Upload className="h-4 w-4" />
                            <span>Upload</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
                    <div className="p-4">
                        {/* Search */}
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Buscar arquivos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Categories */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Categorias</h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left ${!selectedCategory ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                                >
                                    <span className="text-sm">Todos os arquivos</span>
                                    <span className="text-xs text-gray-500">{files.length}</span>
                                </button>
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.name)}
                                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left ${selectedCategory === category.name ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: category.color }}
                                            />
                                            <span className="text-sm">{category.name}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">{category.count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Ações Rápidas</h3>
                            <div className="space-y-2">
                                <button className="w-full flex items-center space-x-2 p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <Star className="h-4 w-4" />
                                    <span>Favoritos</span>
                                </button>
                                <button className="w-full flex items-center space-x-2 p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <Clock className="h-4 w-4" />
                                    <span>Recentes</span>
                                </button>
                                <button className="w-full flex items-center space-x-2 p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <Sparkles className="h-4 w-4" />
                                    <span>Analisados por IA</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    {/* Upload Area */}
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-colors cursor-pointer ${
                            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                        <input {...getInputProps()} />
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">
                            {isDragActive ? 'Solte os arquivos aqui' : 'Arraste arquivos ou clique para selecionar'}
                        </p>
                        <p className="text-sm text-gray-500">
                            Suporta imagens, vídeos, PDFs e documentos até 50MB
                        </p>
                        <p className="text-xs text-blue-600 mt-2">
                            ✨ Análise automática de imagens com IA
                        </p>
                    </div>

                    {/* Files Display */}
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredFiles.map(file => (
                                <div
                                    key={file.id}
                                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
                                >
                                    <div className="relative">
                                        {file.file_type.startsWith('image/') ? (
                                            <img
                                                src={file.file_url}
                                                alt={file.metadata?.alt_text || file.original_name}
                                                className="w-full h-32 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                                                {getFileIcon(file.file_type)}
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="flex space-x-1">
                                                {file.metadata?.ai_analysis && (
                                                    <div className="p-1 bg-purple-500 text-white rounded-full">
                                                        <Sparkles className="h-3 w-3" />
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => toggleFavorite(file.id)}
                                                    className={`p-1 rounded-full ${file.is_favorite ? 'bg-red-500 text-white' : 'bg-white text-gray-600'} hover:bg-red-500 hover:text-white`}
                                                >
                                                    <Heart className="h-3 w-3" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedFile(file);
                                                        setShowFileDetails(true);
                                                    }}
                                                    className="p-1 bg-white text-gray-600 rounded-full hover:bg-gray-100"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-medium text-sm text-gray-900 truncate">{file.original_name}</h4>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-gray-500">{formatFileSize(file.file_size)}</span>
                                            <span className="text-xs text-gray-500">{file.file_type.split('/')[1]?.toUpperCase()}</span>
                                        </div>
                                        {file.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {file.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {file.tags.length > 2 && (
                                                    <span className="text-xs text-gray-400">+{file.tags.length - 2}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-sm font-medium text-gray-700">
                                <div className="col-span-5">Nome</div>
                                <div className="col-span-2">Tipo</div>
                                <div className="col-span-2">Tamanho</div>
                                <div className="col-span-2">Modificado</div>
                                <div className="col-span-1">Ações</div>
                            </div>
                            {filteredFiles.map(file => (
                                <div key={file.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50">
                                    <div className="col-span-5 flex items-center space-x-3">
                                        ```javascript
                                        {getFileIcon(file.file_type)}
                                        <span
                                            onClick={() => {
                                                setSelectedFile(file);
                                                setShowFileDetails(true);
                                            }}
                                            className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600 truncate"
                                        >
                                            {file.original_name}
                                        </span>
                                        {file.metadata?.ai_analysis && <Sparkles className="h-4 w-4 text-purple-500"  />}
                                    </div>
                                    <div className="col-span-2 text-sm text-gray-600">{file.file_type.split('/')[1]?.toUpperCase()}</div>
                                    <div className="col-span-2 text-sm text-gray-600">{formatFileSize(file.file_size)}</div>
                                    <div className="col-span-2 text-sm text-gray-600">{new Date(file.updated_at).toLocaleDateString()}</div>
                                    <div className="col-span-1">
                                        <div className="relative">
                                            {/* Simplified actions for list view, more in details panel */}
                                            <button
                                                onClick={() => deleteFile(file.id)}
                                                className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredFiles.length === 0 && !isLoading && (
                        <div className="text-center py-16">
                            <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">Nenhum arquivo encontrado</h3>
                            <p className="text-sm text-gray-500 mt-1">Tente ajustar sua busca ou filtros.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* File Details Panel */}
            {showFileDetails && selectedFile && (
                <div className="fixed inset-0 z-30">
                    <div onClick={() => setShowFileDetails(false)} className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"></div>
                    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-gray-200 shadow-xl z-40 transform transition-transform ease-in-out duration-300 translate-x-0">
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Detalhes do Arquivo</h2>
                                <button onClick={() => setShowFileDetails(false)} className="p-2 rounded-full hover:bg-gray-100"><X className="h-5 w-5" /></button>
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="mb-6">
                                    {selectedFile.file_type.startsWith('image/') ? (
                                        <img src={selectedFile.file_url} alt={selectedFile.original_name} className="w-full rounded-lg object-contain max-h-64 bg-gray-100" />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center rounded-lg">
                                            {React.cloneElement(getFileIcon(selectedFile.file_type), { className: "h-16 w-16 text-gray-500" })}
                                            <span className="mt-2 text-sm text-gray-600">{selectedFile.original_name}</span>
                                        </div>
                                    )}
                                </div>

                                {/* AI Analysis Section */}
                                {selectedFile.metadata?.ai_analysis ? (
                                    <div className="mb-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Sparkles className="h-5 w-5 text-purple-600" />
                                            <h3 className="text-md font-semibold text-purple-800">Análise de IA</h3>
                                        </div>
                                        <div className="space-y-3 text-sm">
                                            <p><strong className="text-gray-600">Descrição:</strong> <span className="text-gray-800">{selectedFile.metadata.ai_analysis.description}</span></p>
                                            <p><strong className="text-gray-600">Legenda Sugerida:</strong> <span className="text-gray-800">{selectedFile.metadata.ai_analysis.suggestedCaption}</span></p>
                                            <div>
                                                <strong className="text-gray-600 block mb-1">Tags Sugeridas:</strong>
                                                <div className="flex flex-wrap gap-2">{selectedFile.tags.map(tag => <span key={tag} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{tag}</span>)}</div>
                                            </div>
                                            <div>
                                                <strong className="text-gray-600 block mb-1">Paleta de Cores:</strong>
                                                <div className="flex flex-wrap gap-2">{selectedFile.color_palette?.map(color => <div key={color} className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: color }} title={color}></div>)}</div>
                                            </div>
                                        </div>
                                        <button onClick={() => regenerateAIAnalysis(selectedFile)} className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"><RotateCw className="h-3 w-3" /><span>Regerar Análise</span></button>
                                    </div>
                                ) : (
                                    selectedFile.file_type.startsWith('image/') && (
                                        <button onClick={() => regenerateAIAnalysis(selectedFile)} className="w-full flex items-center justify-center space-x-2 p-3 text-left text-sm text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg mb-6"><Sparkles className="h-4 w-4" /><span>Analisar com IA</span></button>
                                    )
                                )}

                                {/* File Information */}
                                <div className="space-y-2 text-sm">
                                    <h3 className="text-md font-semibold text-gray-800 border-b pb-2 mb-3">Informações</h3>
                                    <div className="flex justify-between"><span className="text-gray-500">Nome:</span> <span className="font-medium text-gray-800 text-right truncate">{selectedFile.original_name}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Tipo:</span> <span className="font-medium text-gray-800">{selectedFile.file_type}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Tamanho:</span> <span className="font-medium text-gray-800">{formatFileSize(selectedFile.file_size)}</span></div>
                                    {selectedFile.dimensions && <div className="flex justify-between"><span className="text-gray-500">Dimensões:</span> <span className="font-medium text-gray-800">{selectedFile.dimensions.width} x {selectedFile.dimensions.height} px</span></div>}
                                    <div className="flex justify-between"><span className="text-gray-500">Criado em:</span> <span className="font-medium text-gray-800">{new Date(selectedFile.created_at).toLocaleString()}</span></div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-wrap gap-2">
                                <button onClick={() => downloadFile(selectedFile)} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"><Download className="h-4 w-4" /><span>Download</span></button>
                                <button onClick={() => navigator.clipboard.writeText(selectedFile.file_url)} className="bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-gray-300"><Copy className="h-4 w-4" /></button>
                                <button onClick={() => deleteFile(selectedFile.id)} className="bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-red-100 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-end sm:items-center justify-center">
                    <div className="bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-lg m-0 sm:m-4 max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold">Uploads</h2>
                            <button onClick={() => setShowUploadModal(false)} className="p-2 rounded-full hover:bg-gray-100"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {uploadProgress.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Arraste arquivos para a área de upload.</p>
                            ) : (
                                <div className="space-y-4">
                                    {uploadProgress.map(upload => (
                                        <div key={upload.id} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-sm font-medium text-gray-800 truncate w-3/4">{upload.filename}</p>
                                                <span className="text-sm font-semibold">{Math.round(upload.progress)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 my-1">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${
                                                        upload.status === 'error' ? 'bg-red-500' :
                                                            upload.status === 'completed' ? 'bg-green-500' : 'bg-blue-600'
                                                    }`}
                                                    style={{ width: `${upload.progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    {upload.status === 'uploading' && <Loader2 className="h-3 w-3 animate-spin" />}
                                                    {upload.status === 'processing' && <Loader2 className="h-3 w-3 animate-spin" />}
                                                    {upload.status === 'analyzing' && <Sparkles className="h-3 w-3 text-purple-500" />}
                                                    {upload.status === 'completed' && <CheckCircle className="h-3 w-3 text-green-500" />}
                                                    {upload.status === 'error' && <AlertCircle className="h-3 w-3 text-red-500" />}
                                                    <span className="capitalize">{upload.status === 'completed' ? 'Completo' : upload.status === 'error' ? 'Erro' : `${upload.status}...`}</span>
                                                </div>
                                                {upload.aiAnalysis && <span className="text-purple-500 font-medium">Análise de IA concluída</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
            </AppLayout>
        </AuthGuard>
    );
};
export default MediaLibrarySystem;


