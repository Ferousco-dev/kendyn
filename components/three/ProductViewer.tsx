"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { ProductCategory } from "@/lib/data";
import { TyreModel } from "./Tyre";
import { BatteryModel } from "./Battery";
import { ToolsModel } from "./Tools";

function AssembledTools() {
  const assembled = useRef(1);
  return (
    <group scale={1.15} position={[0, -0.1, 0]}>
      <ToolsModel assemblyRef={assembled} />
    </group>
  );
}

function SlowTurn({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.25;
  });
  return <group ref={g}>{children}</group>;
}

/**
 * Standalone 3D inspector used inside the product modal — drag to rotate,
 * scroll/pinch to zoom. Mounted only while the modal is open.
 */
export function ProductViewer({ category }: { category: ProductCategory }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.6, 4.2], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.25} />
      <spotLight position={[4, 6, 4]} angle={0.6} penumbra={1} intensity={160} color="#fff4e0" />
      <pointLight position={[-5, 2, -3]} intensity={50} color="#5d7cff" />
      <Suspense fallback={null}>
        <SlowTurn>
          {category === "tyre" && (
            <group position={[0, 0, 0]}>
              <TyreModel spinSpeed={0.12} />
            </group>
          )}
          {category === "battery" && (
            <group position={[0, -0.05, 0]} scale={1.05}>
              <BatteryModel energy={0.85} />
            </group>
          )}
          {category === "tool" && <AssembledTools />}
        </SlowTurn>
        <ContactShadows position={[0, -1.45, 0]} opacity={0.55} scale={9} blur={2.6} far={3} />
        <Environment resolution={256} frames={1}>
          <Lightformer
            form="rect"
            intensity={3.5}
            position={[0, 5, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[10, 2, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.8}
            position={[-5, 1, 1]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[6, 1, 1]}
            color="#bcd0ff"
          />
        </Environment>
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={2.2}
        maxDistance={7}
        maxPolarAngle={Math.PI * 0.62}
      />
    </Canvas>
  );
}
