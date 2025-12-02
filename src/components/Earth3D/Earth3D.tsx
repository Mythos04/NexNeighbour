"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

const NEIGHBOR_POINTS_COUNT = 20;

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create a gradient material for the Earth
  const earthMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0F6D70"),
      roughness: 0.8,
      metalness: 0.1,
    });
  }, []);

  // Slow auto-rotation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      {/* Main Earth sphere */}
      <mesh ref={meshRef} material={earthMaterial}>
        <sphereGeometry args={[2, 64, 64]} />
      </mesh>
      
      {/* Atmosphere glow */}
      <mesh scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#0F6D70"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Connection points representing neighbors */}
      {[...Array(NEIGHBOR_POINTS_COUNT)].map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / NEIGHBOR_POINTS_COUNT);
        const theta = Math.sqrt(NEIGHBOR_POINTS_COUNT * Math.PI) * phi;
        const x = 2 * Math.cos(theta) * Math.sin(phi);
        const y = 2 * Math.sin(theta) * Math.sin(phi);
        const z = 2 * Math.cos(phi);
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        );
      })}
    </group>
  );
}

export default function Earth3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <pointLight position={[-5, -3, -5]} intensity={0.3} color="#0F6D70" />
        
        <Earth />
        
        <Stars
          radius={100}
          depth={50}
          count={1500}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
