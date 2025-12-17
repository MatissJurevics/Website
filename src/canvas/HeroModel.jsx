import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { createNoise3D } from 'simplex-noise';
import * as THREE from 'three';

const Terrain = () => {
    const mesh = useRef();
    const materialRef = useRef();
    const noise3D = useMemo(() => createNoise3D(), []);

    // Detect mobile device and reduce polygon count accordingly
    const isMobile = useMemo(() => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               (window.innerWidth <= 768);
    }, []);

    // Create geometry with reduced segment count for mobile devices
    const segments = isMobile ? 40 : 100; // Reduce from 100x100 to 40x40 on mobile (84% reduction)
    const geometry = useMemo(() => new THREE.PlaneGeometry(20, 20, segments, segments), [segments]);

    useFrame((state) => {
        if (mesh.current) {
            const time = state.clock.getElapsedTime();
            const positions = mesh.current.geometry.attributes.position;

            for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);
                // Smoother noise settings
                const z = noise3D(x * 0.15, y * 0.15, time * 0.15) * 2;
                positions.setZ(i, z);
            }
            positions.needsUpdate = true;

            // Slight rotation
            mesh.current.rotation.x = -Math.PI / 2.5;
            mesh.current.rotation.z += 0.0005;

            // Entrance animation logic (simple lerp for opacity)
            // We start opacity at 0 in the material and lerp to 0.15
            // Ideally use a spring or GSAP, but lerp is cheap and easy here
            if (materialRef.current) {
                materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, 0.15, 0.02);
            }
        }
    });

    return (
        <mesh ref={mesh} geometry={geometry}>
            <meshBasicMaterial
                ref={materialRef}
                color="#000000"
                wireframe={true}
                transparent={true}
                opacity={0} // Start invisible for animation
            />
        </mesh>
    );
};

const HeroModel = () => {
    // Detect dark mode for fog color
    const fogColor = useMemo(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? '#0a0a0a' : '#e4e4e4';
    }, []);

    return (
        <div style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
            <Canvas
                shadows
                camera={{ position: [0, 5, 8], fov: 55 }}
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />

                    <Terrain />

                    {/* Fog to fade edges into background color */}
                    <fog attach="fog" args={[fogColor, 5, 20]} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default HeroModel;
