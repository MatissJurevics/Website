import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

const Device = (props) => {
    const mesh = useRef();

    // Rotate based on mouse position (simplified for now, logic can be in global state or event)
    useFrame((state) => {
        if (mesh.current) {
            // Gentle idle rotation
            mesh.current.rotation.y += 0.002;

            // Mouse interaction (lerp to mouse x/y)
            const t = state.clock.getElapsedTime();
            mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, Math.cos(t / 2) / 8 + state.mouse.y / 4, 0.1);
            mesh.current.rotation.z = THREE.MathUtils.lerp(mesh.current.rotation.z, Math.sin(t / 4) / 8, 0.1);
            mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, state.mouse.x / 4, 0.1);
        }
    });

    return (
        <group {...props} dispose={null}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Main Body - Industrial Grey Box */}
                <mesh ref={mesh}>
                    <boxGeometry args={[2, 3, 0.5]} />
                    <meshStandardMaterial color="#d4d4d4" roughness={0.4} metalness={0.1} />

                    {/* Screen / Detail */}
                    <mesh position={[0, 0.8, 0.26]}>
                        <planeGeometry args={[1.5, 0.8]} />
                        <meshBasicMaterial color="#111" />
                    </mesh>

                    {/* Orange Dial -- Teenage Engineering signature */}
                    <mesh position={[0.5, -0.5, 0.3]} rotation={[1.57, 0, 0]}>
                        <cylinderGeometry args={[0.2, 0.2, 0.2, 32]} />
                        <meshStandardMaterial color="#ff4d00" />
                    </mesh>

                    {/* Buttons */}
                    <mesh position={[-0.5, -0.5, 0.3]} rotation={[1.57, 0, 0]}>
                        <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
                        <meshStandardMaterial color="#333" />
                    </mesh>
                    <mesh position={[-0.5, -0.9, 0.3]} rotation={[1.57, 0, 0]}>
                        <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
                        <meshStandardMaterial color="#333" />
                    </mesh>
                </mesh>
            </Float>
        </group>
    );
};

const HeroModel = () => {
    return (
        <div style={{ width: '100%', height: '80vh', position: 'relative', marginTop: 0, zIndex: 0 }}>
            <Canvas shadows dpr={[1, 2]}>
                <Suspense fallback={null}>
                    {/* Orthographic Camera for schematic look */}
                    <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={150} />

                    <ambientLight intensity={1.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <spotLight position={[-10, 15, 10]} angle={0.3} penumbra={1} castShadow intensity={2} shadow-bias={-0.0001} />

                    <Device position={[0, 0, 0]} />

                    {/* Environment for reflections */}
                    <Environment preset="city" />
                    <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.25} far={10} color="#000" />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default HeroModel;
