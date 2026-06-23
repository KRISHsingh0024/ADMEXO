import SoftAurora from '@/components/SoftAurora';
import Hero from '@/components/Hero';
import LeadForm from '@/components/LeadForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="main-viewport-container">
      {/* Background soft aurora layer */}
      <SoftAurora
        speed={0.6}
        scale={1.5}
        brightness={0.85}
        color1="#3b82f6" /* electric deep blue */
        color2="#a855f7" /* electric purple */
        noiseFrequency={2.5}
        noiseAmplitude={1.0}
        bandHeight={0.5}
        bandSpread={1.0}
        octaveDecay={0.1}
        layerOffset={0.0}
        colorSpeed={1.0}
        enableMouseInteraction={true}
        mouseInfluence={0.25}
      />
      
      {/* Scrollable contents wrapper */}
      <div className="scrollable-content-wrapper">
        <Hero />
        
        <section id="lead-generation-form-section" className="lead-form-section">
          <div className="section-container">
            <LeadForm />
          </div>
        </section>
        
        <Footer />
      </div>
    </main>
  );
}
