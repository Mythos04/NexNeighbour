"use client";

import { useRef, useState, useEffect, Suspense } from "react";
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
  const atmosphereRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      {/* Main Earth sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#0B1014"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Grid lines */}
      <mesh>
        <sphereGeometry args={[2.01, 32, 32]} />
        <meshBasicMaterial
          color="#00E5E0"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef} scale={[1.15, 1.15, 1.15]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#00E5E0"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer glow */}
      <mesh scale={[1.25, 1.25, 1.25]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#00E5E0"
          transparent
          opacity={0.03}
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
  const position = latLngToVector3(marker.lat, marker.lng, 2.05);
  const category = categories[marker.category];
  const color = new THREE.Color(category.color);

  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing animation
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(isHovered ? 1.5 : pulse);
    }
  });

  return (
    <group position={position}>
      {/* Glow effect */}
      <mesh scale={[2.5, 2.5, 2.5]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>

      {/* Main marker */}
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
            className="px-3 py-2 bg-[#0B1014]/95 backdrop-blur-sm border border-[#00E5E0]/30 
                        rounded-lg shadow-xl text-white text-sm whitespace-nowrap"
          >
            <div className="font-medium">{marker.title}</div>
            <div className="text-xs text-[#00E5E0]">
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
      autoRotateSpeed={0.5}
      minDistance={3.5}
      maxDistance={8}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI - Math.PI / 4}
      enableDamping
      dampingFactor={0.05}
    />
  );
}

function LoadingFallback() {
  const { t } = useI18n();
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-[#00E5E0] animate-pulse">{t("loading.globe")}</div>
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
      transition={{ duration: 1 }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: "transparent" }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 3, 5]} intensity={0.8} />
          <pointLight position={[-5, -3, -5]} intensity={0.3} color="#00E5E0" />

          <Globe />
          <GlobeMarkers markers={markers} onMarkerClick={onMarkerClick} />

          <Stars
            radius={100}
            depth={50}
            count={2000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />

          <AutoRotateControls />
        </Canvas>
      </Suspense>
    </motion.div>
  );
}
