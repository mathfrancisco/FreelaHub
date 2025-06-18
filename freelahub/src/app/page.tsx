'use client'

import LandingHeader from "@/components/layout/home/landingHeader";
import HeroSection from "@/components/layout/home/heroSection";
import FeaturesSection from "@/components/layout/home/featuresSection";
import CtaSection from "@/components/layout/home/ctaSection";
import Footer from "@/components/layout/home/footer";

export default function HomePage() {
    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: '#0f172a' }}>
            <LandingHeader />
            <main>
                <HeroSection />
                <FeaturesSection />
                <CtaSection />
            </main>
            <Footer />
        </div>
    )
}