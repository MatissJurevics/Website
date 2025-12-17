import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import * as d3 from 'd3-geo';
import * as topojson from 'topojson-client';

// Helper to convert Lat/Lon to Vector3
const calcPosFromLatLonRad = (lat, lon, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    return [x, y, z];
};

const GlobeMesh = () => {
    const groupRef = useRef();
    const [bordersTexture, setBordersTexture] = useState(null);

    // Detect mobile device and reduce polygon count accordingly
    const isMobile = useMemo(() => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               (window.innerWidth <= 768);
    }, []);

    // Generate Borders Texture using D3
    useEffect(() => {
        const generateTexture = async () => {
            try {
                // Fetch World Topology (small 110m res)
                const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
                const world = await response.json();
                const countries = topojson.feature(world, world.objects.countries);

                // Setup Offscreen Canvas
                const canvas = document.createElement('canvas');
                canvas.width = 2048;
                canvas.height = 1024;
                const context = canvas.getContext('2d');

                // D3 Projection (Equirectangular matches UV map of Sphere)
                const projection = d3.geoEquirectangular()
                    .fitSize([2048, 1024], countries)
                    .translate([1024, 512]);

                const path = d3.geoPath(projection, context);

                // Draw
                context.strokeStyle = '#ffffff'; // White borders
                context.lineWidth = 2; // Thicker lines
                context.beginPath();
                path(countries);
                context.stroke();

                // Create Texture
                const texture = new THREE.CanvasTexture(canvas);
                texture.needsUpdate = true;
                setBordersTexture(texture);
            } catch (err) {
                console.error("Failed to load globe data", err);
            }
        };

        generateTexture();
    }, []);

    // Ireland Coordinates
    const irelandPos = useMemo(() => calcPosFromLatLonRad(53.35, -6.26, 2.02), []);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.05; // Gentle Auto-rotation
        }
    });

    // Reduce segment counts for mobile devices
    const baseSphereSegments = isMobile ? 24 : 64; // Reduce from 64x64 to 24x24 on mobile
    const wireframeSegments = isMobile ? 16 : 32; // Reduce from 32x32 to 16x16 on mobile
    const markerSegments = isMobile ? 8 : 16; // Reduce from 16x16 to 8x8 on mobile
    const ringSegments = isMobile ? 16 : 32; // Reduce from 32 to 16 on mobile

    return (
        <group ref={groupRef}>
            {/* 1. Base Dark Sphere (blocks background stars/wireframe from showing through backface) */}
            <mesh>
                <sphereGeometry args={[1.95, baseSphereSegments, baseSphereSegments]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* 2. Light Wireframe Sphere - Outer Cage */}
            <mesh>
                <sphereGeometry args={[2.0, wireframeSegments, wireframeSegments]} />
                <meshBasicMaterial
                    color="#444"
                    wireframe={true}
                    transparent
                    opacity={0.15}
                />
            </mesh>

            {/* 3. Borders Sphere (Texture) */}
            {bordersTexture && (
                <mesh>
                    <sphereGeometry args={[2.01, baseSphereSegments, baseSphereSegments]} />
                    <meshBasicMaterial
                        map={bordersTexture}
                        transparent={true}
                        opacity={0.8}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>
            )}

            {/* Ireland Marker */}
            <mesh position={irelandPos}>
                <sphereGeometry args={[0.04, markerSegments, markerSegments]} />
                <meshBasicMaterial color="#ff4d00" />
            </mesh>
            <mesh position={irelandPos}>
                <ringGeometry args={[0.06, 0.09, ringSegments]} />
                <meshBasicMaterial color="#ff4d00" side={THREE.DoubleSide} transparent opacity={0.6} />
            </mesh>
        </group>
    );
};

const Globe = () => {
    return (
        <div style={{ width: '100%', height: '100%', minHeight: '400px', cursor: 'grab' }}>
            <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} />

                <GlobeMesh />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 1.5}
                />
            </Canvas>
        </div>
    );
};

export default Globe;
