"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/lib/theme";

function GlobeMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.12;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  const color = theme === "dark" ? "#3b82f6" : "#0066ff";
  const emissive = theme === "dark" ? "#1d4ed8" : "#2563eb";

  return (
    <>
      <Stars radius={80} depth={40} count={800} factor={3} saturation={0} fade speed={0.4} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color={color} />
      <pointLight position={[-5, -5, -3]} intensity={0.5} color="#8b5cf6" />

      <mesh ref={meshRef}>
        <Sphere args={[1.2, 64, 64]}>
          <MeshDistortMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={0.15}
            distort={0.25}
            speed={1.5}
            roughness={0.4}
            metalness={0.2}
            wireframe={false}
            transparent
            opacity={0.9}
          />
        </Sphere>
      </mesh>

      {/* Grid lines overlay */}
      <mesh ref={meshRef} rotation={[0, 0, 0]}>
        <Sphere args={[1.22, 24, 24]}>
          <meshBasicMaterial color={color} wireframe transparent opacity={0.06} />
        </Sphere>
      </mesh>
    </>
  );
}

export default function Globe3D({ size = 180 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, flexShrink: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <GlobeMesh />
      </Canvas>
    </div>
  );
}