"use client";

import { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { latLngToVector3 } from "@/lib/map/coords";
import { categories } from "@/lib/map/categories";
import type { Marker } from "@/lib/map/types";
import { useI18n } from "@/lib/i18n/context";

interface GlobeCanvasProps {
  markers: Marker[];
  onMarkerClick?: (marker: Marker) => void;
}

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const gridRef = useRef<THREE.Mesh>(null);
  const atmosphereRefs = useRef<THREE.Mesh[]>([]);

  useFrame(() => {
    const speed = 0.0008;
    if (meshRef.current) {
      meshRef.current.rotation.y += speed;
    }
    if (gridRef.current) {
      gridRef.current.rotation.y += speed;
    }
    atmosphereRefs.current.forEach((mesh) => {
      if (mesh) mesh.rotation.y += speed;
    });
  });

  return (
    <group>
      {/* Main Earth sphere - dark base */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#0B1014"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Subtle grid lines - NASA Blue Marble style */}
      <mesh ref={gridRef}>
        <sphereGeometry args={[2.005, 48, 48]} />
        <meshBasicMaterial
          color="#00E5E0"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Inner atmosphere layer */}
      <mesh 
        ref={(el) => { if (el) atmosphereRefs.current[0] = el; }}
        scale={[1.02, 1.02, 1.02]}
      >
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#00E5E0"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Mid atmosphere with glow */}
      <mesh 
        ref={(el) => { if (el) atmosphereRefs.current[1] = el; }}
        scale={[1.08, 1.08, 1.08]}
      >
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#00E5E0"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer atmosphere glow */}
      <mesh 
        ref={(el) => { if (el) atmosphereRefs.current[2] = el; }}
        scale={[1.15, 1.15, 1.15]}
      >
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#00E5E0"
          transparent
          opacity={0.025}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Light rim effect */}
      <mesh scale={[1.22, 1.22, 1.22]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#C3FDFC"
          transparent
          opacity={0.015}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Soft outer halo */}
      <mesh scale={[1.35, 1.35, 1.35]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#00E5E0"
          transparent
          opacity={0.008}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

interface MarkerPointProps {
  marker: Marker;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
  isHovered: boolean;
}

function MarkerPoint({
  marker,
  onClick,
  onHover,
  isHovered,
}: MarkerPointProps) {
  const { t } = useI18n();
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const position = latLngToVector3(marker.lat, marker.lng, 2.06);
  const category = categories[marker.category];
  const color = useMemo(() => new THREE.Color(category.color), [category.color]);

  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      // Smooth pulsing animation
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
      const glowPulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.3;
      meshRef.current.scale.setScalar(isHovered ? 1.8 : pulse);
      glowRef.current.scale.setScalar(isHovered ? 4 : 3 * glowPulse);
    }
  });

  return (
    <group position={position}>
      {/* Outer glow aura */}
      <mesh ref={glowRef} scale={[3, 3, 3]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={isHovered ? 0.4 : 0.25}
        />
      </mesh>

      {/* Mid glow */}
      <mesh scale={[2, 2, 2]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.3}
        />
      </mesh>

      {/* Main marker core */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Tooltip on hover */}
      {isHovered && (
        <Html distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div
            className="px-4 py-2.5 bg-[#0B1014]/95 backdrop-blur-md border border-[#00E5E0]/40 
                        rounded-xl shadow-[0_0_20px_#00E5E040] text-white text-sm whitespace-nowrap"
          >
            <div className="font-semibold">{marker.title}</div>
            <div className="text-xs mt-1" style={{ color: category.color }}>
              {category.icon} {t(category.nameKey)}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function GlobeMarkers({
  markers,
  onMarkerClick,
}: {
  markers: Marker[];
  onMarkerClick?: (marker: Marker) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      {markers.map((marker) => (
        <MarkerPoint
          key={marker.id}
          marker={marker}
          onClick={() => onMarkerClick?.(marker)}
          onHover={(hovered) => setHoveredId(hovered ? marker.id : null)}
          isHovered={hoveredId === marker.id}
        />
      ))}
    </>
  );
}

function AutoRotateControls() {
  const { gl } = useThree();
  const controlsRef = useRef<React.ElementRef<typeof OrbitControls>>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const idleTimeoutRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    const handleStart = () => {
      setIsInteracting(true);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };

    const handleEnd = () => {
      idleTimeoutRef.current = setTimeout(() => {
        setIsInteracting(false);
      }, 3000);
    };

    gl.domElement.addEventListener("pointerdown", handleStart);
    gl.domElement.addEventListener("pointerup", handleEnd);
    gl.domElement.addEventListener("wheel", handleStart);

    return () => {
      gl.domElement.removeEventListener("pointerdown", handleStart);
      gl.domElement.removeEventListener("pointerup", handleEnd);
      gl.domElement.removeEventListener("wheel", handleStart);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [gl]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={true}
      enablePan={false}
      autoRotate={!isInteracting}
      autoRotateSpeed={0.3}
      minDistance={3.5}
      maxDistance={8}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI - Math.PI / 4}
      enableDamping
      dampingFactor={0.03}
    />
  );
}

function LoadingFallback() {
  const { t } = useI18n();
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-[#00E5E0] animate-pulse text-lg">{t("loading.globe")}</div>
    </div>
  );
}

export default function GlobeCanvas({
  markers,
  onMarkerClick,
}: GlobeCanvasProps) {
  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: "transparent" }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 3, 5]} intensity={0.6} color="#FFFFFF" />
          <pointLight position={[-5, -3, -5]} intensity={0.4} color="#00E5E0" />
          <pointLight position={[3, 2, -3]} intensity={0.2} color="#C3FDFC" />

          <Globe />
          <GlobeMarkers markers={markers} onMarkerClick={onMarkerClick} />

          <Stars
            radius={100}
            depth={50}
            count={3000}
            factor={4}
            saturation={0}
            fade
            speed={0.3}
          />

          <AutoRotateControls />
        </Canvas>
      </Suspense>
    </motion.div>
  );
}
