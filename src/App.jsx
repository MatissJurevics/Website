import React, { useEffect, useRef } from 'react';
import Header from './components/Header';
import HeroModel from './canvas/HeroModel';
import ProductGrid from './components/ProductGrid';
import InfoTabs from './components/InfoTabs';
import Footer from './components/Footer';
import './index.css';
import './styles/variables.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis'

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef()

  useEffect(() => {
    // Lenis setup
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Hero Text Animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.5
      })
        .from(".hero-subtitle", {
          y: 20,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        }, "-=1");

    });

    return () => {
      lenis.destroy()
      ctx.revert();
    }
  }, [])

  return (
    <div className="App">
      <Header />

      <main>
        {/* Hero Section */}
        <section style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          paddingTop: '60px'
        }}>
          <HeroModel />

          <div style={{
            position: 'relative', // Changed to relative to sit on top of canvas if needed, or maintain z-index structure
            zIndex: 10,
            pointerEvents: 'none',
            textAlign: 'center',
            color: 'var(--text-main, #000)' // Adapts to dark mode
          }}>
            <div style={{ overflow: 'hidden' }}>
              <h1 className="hero-title" style={{
                fontSize: '8rem',
                fontWeight: '900',
                lineHeight: '0.8',
                zIndex: 10,
                letterSpacing: '-0.05em',
                textTransform: 'uppercase'
              }}>
                Matiss <br /> Jurevics
              </h1>
            </div>
            <p className="hero-subtitle" style={{
              marginTop: '30px',
              fontSize: '1.2rem',
              fontFamily: 'monospace',
              letterSpacing: '0.1em'
            }}>
              Creative Developer / Designer
            </p>
          </div>
        </section>

        {/* Product Grid Section */}
        <ProductGrid />
        <InfoTabs />

        <Footer />
      </main>
    </div>
  );
}

export default App;
