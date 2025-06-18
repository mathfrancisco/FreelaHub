import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface SelectProps {
    value?: string
    onValueChange?: (value: string) => void
    disabled?: boolean
    children: React.ReactNode
}

interface SelectTriggerProps {
    children: React.ReactNode
    className?: string
}

interface SelectValueProps {
    placeholder?: string
    className?: string
}

interface SelectContentProps {
    children: React.ReactNode
    className?: string
}

interface SelectItemProps {
    value: string
    children: React.ReactNode
    className?: string
}

// Context para compartilhar estado entre componentes
const SelectContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    disabled?: boolean
}>({
    isOpen: false,
    setIsOpen: () => {}
})

// Componente principal Select
export function Select({ value, onValueChange, disabled, children }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen, disabled }}>
            <div className="relative">
                {children}
            </div>
        </SelectContext.Provider>
    )
}

// Trigger do Select
export function SelectTrigger({ children, className = '' }: SelectTriggerProps) {
    const { isOpen, setIsOpen, disabled } = React.useContext(SelectContext)
    const triggerRef = useRef<HTMLButtonElement>(null)

    const handleClick = () => {
        if (!disabled) {
            setIsOpen(!isOpen)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
        } else if (e.key === 'Escape') {
            setIsOpen(false)
        }
    }

    // Fechar quando clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, setIsOpen])

    return (
        <button
            ref={triggerRef}
            type="button"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={`
        flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm 
        ring-offset-background placeholder:text-muted-foreground 
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
        >
      <span className="flex-1 text-left">
        {children}
      </span>
            <ChevronDown
                className={`h-4 w-4 opacity-50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
        </button>
    )
}

// Value do Select (placeholder/valor selecionado)
export function SelectValue({ placeholder, className = '' }: SelectValueProps) {
    const { value } = React.useContext(SelectContext)

    return (
        <span className={`block truncate ${className}`}>
      {value || placeholder}
    </span>
    )
}

// Content do Select (dropdown)
export function SelectContent({ children, className = '' }: SelectContentProps) {
    const { isOpen } = React.useContext(SelectContext)
    const contentRef = useRef<HTMLDivElement>(null)

    if (!isOpen) return null

    return (
        <div
            ref={contentRef}
            className={`
        absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md 
        animate-in fade-in-0 zoom-in-95
        ${className}
      `}
            role="listbox"
        >
            <div className="max-h-60 overflow-auto">
                {children}
            </div>
        </div>
    )
}

// Item do Select
export function SelectItem({ value, children, className = '' }: SelectItemProps) {
    const { value: selectedValue, onValueChange, setIsOpen } = React.useContext(SelectContext)
    const isSelected = selectedValue === value

    const handleClick = () => {
        onValueChange?.(value)
        setIsOpen(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
        }
    }

    return (
        <div
            role="option"
            aria-selected={isSelected}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            className={`
        relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm 
        outline-none hover:bg-accent hover:text-accent-foreground 
        focus:bg-accent focus:text-accent-foreground
        data-[disabled]:pointer-events-none data-[disabled]:opacity-50
        ${isSelected ? 'bg-accent text-accent-foreground' : ''}
        ${className}
      `}
        >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
            <span className="truncate">{children}</span>
        </div>
    )
}

// Exemplo de uso
export default function SelectExample() {
    const [selectedValue, setSelectedValue] = useState('')
    const [selectedPlatform, setSelectedPlatform] = useState('')

    const contentTypes = [
        { value: 'post', label: 'Post' },
        { value: 'article', label: 'Artigo' },
        { value: 'video', label: 'Vídeo' },
        { value: 'image', label: 'Imagem' },
        { value: 'story', label: 'Story' }
    ]

    const platforms = [
        { value: 'instagram', label: 'Instagram', icon: '📷' },
        { value: 'facebook', label: 'Facebook', icon: '👥' },
        { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
        { value: 'linkedin', label: 'LinkedIn', icon: '💼' }
    ]

    return (
        <div className="max-w-md mx-auto p-6 space-y-6 bg-white">
            <h2 className="text-2xl font-bold mb-6">Componente Select</h2>

            {/* Select básico */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Conteúdo</label>
                <Select value={selectedValue} onValueChange={setSelectedValue}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo de conteúdo" />
                    </SelectTrigger>
                    <SelectContent>
                        {contentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {selectedValue && (
                    <p className="text-sm text-gray-600">Selecionado: {selectedValue}</p>
                )}
            </div>

            {/* Select com ícones */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Plataforma</label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione uma plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                        {platforms.map((platform) => (
                            <SelectItem key={platform.value} value={platform.value}>
                                <div className="flex items-center gap-2">
                                    <span>{platform.icon}</span>
                                    <span>{platform.label}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {selectedPlatform && (
                    <p className="text-sm text-gray-600">
                        Plataforma selecionada: {platforms.find(p => p.value === selectedPlatform)?.label}
                    </p>
                )}
            </div>

            {/* Select desabilitado */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Select Desabilitado</label>
                <Select disabled>
                    <SelectTrigger>
                        <SelectValue placeholder="Este select está desabilitado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="test">Teste</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Demonstração de estado */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Estado Atual:</h3>
                <pre className="text-sm">
          {JSON.stringify({
              contentType: selectedValue,
              platform: selectedPlatform
          }, null, 2)}
        </pre>
            </div>
        </div>
    )
}