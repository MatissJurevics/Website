import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/variables.css';

gsap.registerPlugin(ScrollTrigger);

const products = [
    { id: 1, name: 'TX-6', desc: 'Portable Mixer', price: '$1199' },
    { id: 2, name: 'CM-15', desc: 'Field Microphone', price: '$1199' },
    { id: 3, name: 'TP-7', desc: 'Field Recorder', price: '$1499' },
    { id: 4, name: 'OB-4', desc: 'Magic Radio', price: '$649' },
    { id: 5, name: 'OD-11', desc: 'Cloud Speaker', price: '$999' },
    { id: 6, name: 'EP-133', desc: 'K.O. II', price: '$299' },
];

const ProductGrid = () => {
    const gridRef = useRef(null);
    const titleRef = useRef(null);
    const itemRefs = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate Title
            gsap.from(titleRef.current, {
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });

            // Animate Grid Items
            itemRefs.current.forEach((item, i) => {
                if (!item) return;
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                    },
                    y: 100,
                    opacity: 0,
                    duration: 0.8,
                    delay: i % 2 * 0.1, // Stagger slightly based on column
                    ease: "power3.out"
                });
            });

        }, gridRef);

        return () => ctx.revert();
    }, []);

    const onEnter = ({ currentTarget }) => {
        gsap.to(currentTarget, { backgroundColor: '#fff', scale: 0.98, duration: 0.3 });
        gsap.to(currentTarget.querySelector('.product-img'), { scale: 1.1, duration: 0.3 });
        gsap.to(currentTarget.querySelector('.indicator'), { backgroundColor: '#ff4d00', scale: 1.5, duration: 0.3 });
    };

    const onLeave = ({ currentTarget }) => {
        gsap.to(currentTarget, { backgroundColor: '#f5f5f5', scale: 1, duration: 0.3 });
        gsap.to(currentTarget.querySelector('.product-img'), { scale: 1, duration: 0.3 });
        gsap.to(currentTarget.querySelector('.indicator'), { backgroundColor: '#ccc', scale: 1, duration: 0.3 });
    };

    return (
        <section id="products" ref={gridRef} style={{
            padding: '100px 20px',
            background: '#fff',
            minHeight: '100vh'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{
                    marginBottom: '60px',
                    borderBottom: '1px solid #000',
                    paddingBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline'
                }} ref={titleRef}>
                    <h2 className="uppercase" style={{ fontSize: '2rem', margin: 0 }}>Field System</h2>
                    <span className="mono" style={{ fontSize: '0.9rem', color: '#666' }}>ENGINEERING / AUDIO</span>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '2px', // Tight gap for grid lines effect
                    background: '#ccc', // Color of grid lines
                    border: '1px solid #ccc'
                }}>
                    {products.map((p, i) => (
                        <div
                            key={p.id}
                            ref={el => itemRefs.current[i] = el}
                            className="product-item"
                            style={{
                                background: '#f5f5f5',
                                height: '450px',
                                padding: '30px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={onEnter}
                            onMouseLeave={onLeave}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', zIndex: 2 }}>
                                <span className="mono" style={{ fontSize: '0.8rem', color: '#ff4d00' }}>00{p.id}</span>
                                <div className="indicator" style={{
                                    width: '8px',
                                    height: '8px',
                                    background: '#ccc',
                                    borderRadius: '50%'
                                }}></div>
                            </div>

                            {/* Placeholder for Product Image */}
                            <div className="product-img" style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '5rem',
                                color: '#e0e0e0',
                                fontWeight: 800,
                                userSelect: 'none'
                            }}>
                                TE
                            </div>

                            <div style={{ zIndex: 2 }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{p.name}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666' }}>
                                    <span>{p.desc}</span>
                                    <span>{p.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductGrid;
