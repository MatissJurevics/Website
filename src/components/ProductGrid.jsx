import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectModal from './ProjectModal';
import '../styles/variables.css';

gsap.registerPlugin(ScrollTrigger);



const REPO_LIST = [
    'MatissJurevics/Gene-AI',
    'MatissJurevics/movesync',
    'MatissJurevics/script-server',
];

const ProductGrid = () => {
    const gridRef = useRef(null);
    const titleRef = useRef(null);
    const itemRefs = useRef([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchRepos = async () => {
            const promises = REPO_LIST.map(async (repoName, index) => {
                try {
                    const res = await fetch(`https://api.github.com/repos/${repoName}`);
                    if (!res.ok) throw new Error('Fetch failed');
                    const data = await res.json();
                    return {
                        id: index + 1,
                        name: data.name,
                        desc: data.description || data.language || 'No description',
                        price: `★ ${data.stargazers_count}`,
                        language: data.language,
                        url: data.html_url,
                        raw: data
                    };
                } catch (e) {
                    console.warn(`Failed to load ${repoName}`, e);
                    // Fallback or skip
                    return {
                        id: index + 1,
                        name: repoName.split('/')[1],
                        desc: 'Loading Error',
                        price: 'NT',
                        url: '#'
                    };
                }
            });

            const results = await Promise.all(promises);

            // Add Manual Gumroad Project
            const manualProject = {
                id: 'wireframe', // unique string ID to avoid collision
                name: 'Wireframe UI Kit',
                desc: 'Web Design Resource',
                price: '$29',
                url: 'https://saetom.gumroad.com/l/WireframeUIKit',
                image: '/images/wireframe_kit.png',
                details: `
                    A comprehensive Wireframe UI Kit designed to speed up your prototyping workflow.
                    Includes over 100+ customizable components, varying layouts, and responsive patterns.
                    Perfect for designers and developers looking to create high-fidelity wireframes quickly.
                `
            };

            setProducts([manualProject, ...results]);
        };

        fetchRepos();
    }, []);

    useEffect(() => {
        if (!products.length) return; // Wait for data

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
    }, [products]);

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
        <>
            <section id="work" ref={gridRef} style={{
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
                        <h2 className="uppercase" style={{ fontSize: '2rem', margin: 0 }}>Selected Work</h2>
                        <span className="mono" style={{ fontSize: '0.9rem', color: '#666' }}>DESIGN / CODE</span>
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
                                onClick={() => setSelectedProject(p)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', zIndex: 2 }}>
                                    <span className="mono" style={{ fontSize: '0.8rem', color: '#ff4d00' }}>
                                        {typeof p.id === 'number' ? `0${p.id}` : 'NEW'}
                                    </span>
                                    <div className="indicator" style={{
                                        width: '8px',
                                        height: '8px',
                                        background: '#ccc',
                                        borderRadius: '50%'
                                    }}></div>
                                </div>

                                {/* Product Image or Placeholder */}
                                <div className="product-img" style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '3rem',
                                    color: '#e0e0e0',
                                    fontWeight: 800,
                                    userSelect: 'none',
                                    textAlign: 'center',
                                    wordBreak: 'break-word',
                                    lineHeight: 1.2,
                                    overflow: 'hidden'
                                }}>
                                    {p.image ? (
                                        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        p.name.substring(0, 10)
                                    )}
                                </div>

                                <div style={{ zIndex: 2 }}>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666' }}>
                                        <span style={{ maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.desc}</span>
                                        <span>{p.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal */}
            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </>
    );
};

export default ProductGrid;
