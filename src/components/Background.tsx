"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Generate positions outside of component to avoid impure function error during render
function generatePositions(count: number): Float32Array {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
}

// Pre-computed once at module-level (not during render)
const PARTICLE_POSITIONS = generatePositions(5000);

function ParticleBackground() {
    const ref = useRef<THREE.Points>(null!);

    useFrame((_state, delta) => {
        ref.current.rotation.x -= delta / 15;
        ref.current.rotation.y -= delta / 20;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={PARTICLE_POSITIONS} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#6366f1"
                    size={0.015}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.35}
                />
            </Points>
        </group>
    );
}

const Background = () => {
    return (
        <div className="fixed inset-0 z-[-1] bg-background" aria-hidden="true">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <ParticleBackground />
            </Canvas>
        </div>
    );
};

export default Background;
