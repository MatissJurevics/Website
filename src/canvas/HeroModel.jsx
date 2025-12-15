import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { createNoise3D } from 'simplex-noise';
import * as THREE from 'three';

const Terrain = () => {
    const mesh = useRef();
    const noise3D = useMemo(() => createNoise3D(), []);

    // Create geometry with high segment count for smooth wave
    const geometry = useMemo(() => new THREE.PlaneGeometry(15, 15, 64, 64), []);

    useFrame((state) => {
        if (mesh.current) {
            const time = state.clock.getElapsedTime();
            const positions = mesh.current.geometry.attributes.position;

            for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);
                // Animate z-axis with noise based on x, y and time
                // Frequency: how "zoomed in" the noise is (0.3)
                // Amplitude: height of waves (1.5)
                const z = noise3D(x * 0.3, y * 0.3, time * 0.2) * 1.5;
                positions.setZ(i, z);
            }
            positions.needsUpdate = true;

            // Slight rotation for perspective
            mesh.current.rotation.x = -Math.PI / 3;
            mesh.current.rotation.z += 0.001;
        }
    });

    return (
        <mesh ref={mesh} geometry={geometry}>
            {/* Wireframe material options */}
            <meshStandardMaterial
                color="#333"
                wireframe={true}
                wireframeLinewidth={1.5}
            />
        </mesh>
    );
};

const HeroModel = () => {
    return (
        <div style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
            <Canvas
                shadows
                camera={{ position: [0, 5, 10], fov: 45 }}
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />

                    <Terrain />

                    {/* Fog to fade edges into background color */}
                    <fog attach="fog" args={['#e4e4e4', 5, 20]} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default HeroModel;
