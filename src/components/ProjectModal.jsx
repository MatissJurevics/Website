import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const ProjectModal = ({ project, onClose }) => {
    const modalRef = useRef(null);
    const overlayRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animation In
            gsap.fromTo(overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.5, ease: "power2.out" }
            );

            gsap.fromTo(contentRef.current,
                { y: 100, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.5, delay: 0.1, ease: "power3.out" }
            );
        }, modalRef);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        return () => {
            ctx.revert();
            document.body.style.overflow = ''; // Restore scroll
        };
    }, []);

    const handleClose = () => {
        // Animation Out manually before unmounting
        gsap.to(contentRef.current, { y: 50, opacity: 0, duration: 0.3, ease: "power2.in" });
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, onComplete: onClose });
    };

    if (!project) return null;

    return (
        <div ref={modalRef} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto'
        }}>
            {/* Overlay */}
            <div
                ref={overlayRef}
                onClick={handleClose}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(5px)',
                    cursor: 'pointer'
                }}
            />

            {/* Modal Content */}
            <div ref={contentRef} style={{
                width: '90%',
                maxWidth: '1000px',
                height: '80vh',
                background: '#e4e4e4',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column', // Stack on mobile, row on desktop (handled below)
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                {/* Close Button */}
                <button onClick={handleClose} style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    zIndex: 10,
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#000',
                    fontWeight: 'bold'
                }}>
                    ✕
                </button>

                <div style={{ display: 'flex', height: '100%', flexDirection: 'row' }}>
                    {/* Left: Image / Visual */}
                    <div style={{
                        flex: '1.5',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRight: '1px solid #ccc',
                        overflow: 'hidden'
                    }}>
                        {project.image ? (
                            <img src={project.image} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <h1 style={{ fontSize: '8vw', color: '#f0f0f0', fontWeight: '900' }}>
                                {project.name ? project.name.substring(0, 2).toUpperCase() : 'MJ'}
                            </h1>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div style={{
                        flex: '1',
                        padding: '60px 40px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        overflowY: 'auto'
                    }}>
                        <div>
                            <span className="mono" style={{ color: '#ff4d00', marginBottom: '10px', display: 'block' }}>
                                {project.price}
                            </span>
                            <h2 className="uppercase" style={{ fontSize: '3rem', lineHeight: 1, marginBottom: '20px' }}>
                                {project.name}
                            </h2>
                            <p style={{ fontSize: '1.1rem', color: '#444', marginBottom: '40px', lineHeight: 1.6 }}>
                                {project.details || project.desc || "No details available."}
                            </p>

                            <div className="mono" style={{ fontSize: '0.9rem', color: '#666' }}>
                                <h4 style={{ color: '#000', marginBottom: '10px' }}>Type</h4>
                                <p>{project.language || 'Design / Resource'}</p>
                            </div>
                        </div>

                        <button style={{
                            alignSelf: 'flex-start',
                            background: '#000',
                            color: '#fff',
                            border: 'none',
                            padding: '15px 30px',
                            textTransform: 'uppercase',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            marginTop: '40px',
                            transition: 'background 0.2s'
                        }}
                            onMouseEnter={(e) => e.target.style.background = '#ff4d00'}
                            onMouseLeave={(e) => e.target.style.background = '#000'}
                            onClick={() => window.open(project.url, '_blank')}
                        >
                            View Live
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
