import React, { useEffect, useRef } from 'react';
import Header from './components/Header';
import HeroModel from './canvas/HeroModel';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import './styles/index.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis'

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef()

  useEffect(() => {
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

    return () => {
      lenis.destroy()
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
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            zIndex: 1,
            pointerEvents: 'none'
          }}>
            <h1 style={{
              fontSize: '8rem',
              fontWeight: '900',
              lineHeight: '0.8',
              color: '#000',
              letterSpacing: '-0.05em'
            }}>
              OP-1 <br /> FIELD
            </h1>
            <p style={{
              marginTop: '20px',
              fontSize: '1.2rem',
              maxWidth: '300px',
              fontFamily: 'monospace'
            }}>
              The portable synthesizer. Refined, reshaped, reborn.
            </p>
          </div>

          <HeroModel />
        </section>

        {/* Product Grid Section */}
        <ProductGrid />

        <Footer />
      </main>
    </div>
  );
}

export default App;
