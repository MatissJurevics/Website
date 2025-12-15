import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { createNoise3D } from 'simplex-noise';
import * as THREE from 'three';

const Terrain = () => {
    const mesh = useRef();
    const noise3D = useMemo(() => createNoise3D(), []);

    // Create geometry with HIGHER segment count for smoother, denser wave like the reference
    const geometry = useMemo(() => new THREE.PlaneGeometry(20, 20, 100, 100), []);

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
        }
    });

    return (
        <mesh ref={mesh} geometry={geometry}>
            <meshBasicMaterial
                color="#000000"
                wireframe={true}
                transparent={true}
                opacity={0.15}
            />
        </mesh>
    );
};

const HeroModel = () => {
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
                    <fog attach="fog" args={['#e4e4e4', 5, 20]} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default HeroModel;
