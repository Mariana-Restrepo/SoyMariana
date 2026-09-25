import type { CategoryKey } from '@soymariana/content';
import type { CategoryFilter } from '@soymariana/core';
import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import { useState } from 'react';

import { InquiryProvider } from '@/app/inquiry';
import { FloatingCta } from '@/components/layout/FloatingCta';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { AboutSection } from '@/sections/about/AboutSection';
import { CategoriesSection } from '@/sections/categories/CategoriesSection';
import { CollectionSection } from '@/sections/collection/CollectionSection';
import { Hero } from '@/sections/hero/Hero';
import { MetricsSection } from '@/sections/metrics/MetricsSection';
import { VideosSection } from '@/sections/videos/VideosSection';
import { WorkSection } from '@/sections/work/WorkSection';

export function App() {
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const seeCollection = (category: CategoryKey) => {
    setFilter(category);
    document.getElementById('coleccion')?.scrollIntoView();
  };

  return (
    // reducedMotion="user": con prefers-reduced-motion se quitan los desplazamientos animados.
    <MotionConfig reducedMotion="user">
      {/* LazyMotion + domAnimation: solo se carga el motor de animación de DOM (mucho más liviano que el completo). */}
      <LazyMotion features={domAnimation} strict>
        <InquiryProvider>
          <a
            href="#main"
            className="fixed left-3 top-3 z-[70] -translate-y-24 rounded-pill bg-ink px-4 py-2.5 text-white transition-transform focus:translate-y-0"
          >
            Saltar al contenido
          </a>
          <Header />
          <main id="main">
            <Hero />
            <VideosSection />
            <CategoriesSection onSeeCollection={seeCollection} />
            <CollectionSection filter={filter} onFilterChange={setFilter} />
            <AboutSection />
            <MetricsSection />
            <WorkSection />
          </main>
          <Footer />
          <FloatingCta />
        </InquiryProvider>
      </LazyMotion>
    </MotionConfig>
  );
}
