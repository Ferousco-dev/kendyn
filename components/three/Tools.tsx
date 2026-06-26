"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const steel = { color: "#b6bcc4", metalness: 1, roughness: 0.28 } as const;
const darkSteel = { color: "#6f757d", metalness: 1, roughness: 0.35 } as const;

interface PartSpec {
  /** resting place once assembled (local to the tools group) */
  home: [number, number, number];
  homeRot: [number, number, number];
  /** scattered position when exploded */
  away: [number, number, number];
  awayRot: [number, number, number];
  bobAmp: number;
  bobFreq: number;
}

const PARTS: Record<string, PartSpec> = {
  wrench: {
    home: [-0.85, 0.1, 0],
    homeRot: [0, 0, 0.45],
    away: [-3.4, 2.2, -1.6],
    awayRot: [1.2, 0.8, 2.2],
    bobAmp: 0.05,
    bobFreq: 0.7,
  },
  bolt: {
    home: [0, 0.62, 0],
    homeRot: [0, 0, 0],
    away: [1.8, 3.2, -2.4],
    awayRot: [2.2, 0.4, 1.1],
    bobAmp: 0.04,
    bobFreq: 0.9,
  },
  nut: {
    home: [0, 0.08, 0],
    homeRot: [0, 0.3, 0],
    away: [3.2, 1.4, -1.2],
    awayRot: [0.8, 2.4, 0.5],
    bobAmp: 0.03,
    bobFreq: 1.1,
  },
  socket: {
    home: [0.85, 0.12, 0.1],
    homeRot: [0, 0, -0.2],
    away: [2.6, 2.8, 1.4],
    awayRot: [1.6, 1.2, 0.9],
    bobAmp: 0.05,
    bobFreq: 0.8,
  },
  screwdriver: {
    home: [-0.1, -0.45, 0.35],
    homeRot: [0, 0, -1.1],
    away: [-2.4, 1.6, 1.8],
    awayRot: [0.5, 1.8, 2.6],
    bobAmp: 0.06,
    bobFreq: 0.65,
  },
};

function usePartMotion(spec: PartSpec, assemblyRef: React.RefObject<number>) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const raw = assemblyRef.current ?? 0;
    // engineered ease — fast approach, precise settle
    const t = 1 - Math.pow(1 - raw, 3);
    const bob =
      Math.sin(clock.elapsedTime * spec.bobFreq * Math.PI) *
      spec.bobAmp *
      (1 - t * 0.7);
    g.position.set(
      THREE.MathUtils.lerp(spec.away[0], spec.home[0], t),
      THREE.MathUtils.lerp(spec.away[1], spec.home[1], t) + bob,
      THREE.MathUtils.lerp(spec.away[2], spec.home[2], t)
    );
    g.rotation.set(
      THREE.MathUtils.lerp(spec.awayRot[0], spec.homeRot[0], t),
      THREE.MathUtils.lerp(spec.awayRot[1], spec.homeRot[1], t),
      THREE.MathUtils.lerp(spec.awayRot[2], spec.homeRot[2], t)
    );
  });
  return ref;
}

/**
 * Five industrial tools that drift scattered in the dark, then slide
 * together with mechanical precision as `assemblyRef.current` → 1:
 * the bolt drops into the nut, the socket and wrench close in around it.
 */
export function ToolsModel({
  assemblyRef,
}: {
  assemblyRef: React.RefObject<number>;
}) {
  const wrench = usePartMotion(PARTS.wrench, assemblyRef);
  const bolt = usePartMotion(PARTS.bolt, assemblyRef);
  const nut = usePartMotion(PARTS.nut, assemblyRef);
  const socket = usePartMotion(PARTS.socket, assemblyRef);
  const screwdriver = usePartMotion(PARTS.screwdriver, assemblyRef);

  return (
    <group>
      {/* open-end wrench */}
      <group ref={wrench}>
        <mesh castShadow>
          <capsuleGeometry args={[0.055, 0.9, 8, 16]} />
          <meshPhysicalMaterial {...steel} />
        </mesh>
        <mesh position={[0, 0.55, 0]} rotation={[0, 0, 0.5]}>
          <torusGeometry args={[0.14, 0.05, 12, 24, 4.4]} />
          <meshPhysicalMaterial {...steel} />
        </mesh>
        <mesh position={[0, -0.55, 0]} rotation={[0, 0, Math.PI + 0.5]}>
          <torusGeometry args={[0.11, 0.045, 12, 24, 4.4]} />
          <meshPhysicalMaterial {...steel} />
        </mesh>
      </group>

      {/* bolt — hex head + threaded shaft */}
      <group ref={bolt}>
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.12, 6]} />
          <meshPhysicalMaterial {...darkSteel} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.55, 16]} />
          <meshPhysicalMaterial {...steel} />
        </mesh>
        {/* thread grooves */}
        {[-0.18, -0.28, -0.38, -0.48].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.071, 0.008, 6, 20]} />
            <meshStandardMaterial color="#5c6168" metalness={1} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* hex nut */}
      <group ref={nut}>
        <mesh castShadow>
          <cylinderGeometry args={[0.19, 0.19, 0.14, 6]} />
          <meshPhysicalMaterial {...steel} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.085, 0.085, 0.15, 16]} />
          <meshStandardMaterial color="#0b0d11" roughness={0.8} />
        </mesh>
      </group>

      {/* impact socket */}
      <group ref={socket}>
        <mesh castShadow>
          <cylinderGeometry args={[0.13, 0.15, 0.42, 24]} />
          <meshPhysicalMaterial color="#3a3e44" metalness={0.9} roughness={0.45} />
        </mesh>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.06, 24]} />
          <meshStandardMaterial color="#82888f" metalness={1} roughness={0.35} />
        </mesh>
      </group>

      {/* screwdriver */}
      <group ref={screwdriver}>
        <mesh castShadow>
          <capsuleGeometry args={[0.075, 0.34, 8, 16]} />
          <meshPhysicalMaterial
            color="#1a1d22"
            metalness={0.2}
            roughness={0.4}
            clearcoat={0.8}
          />
        </mesh>
        {/* grip rings */}
        {[-0.1, 0, 0.1].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.077, 0.008, 6, 20]} />
            <meshStandardMaterial color="#3a3e44" roughness={0.5} />
          </mesh>
        ))}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.55, 12]} />
          <meshPhysicalMaterial {...steel} />
        </mesh>
        <mesh position={[0, 0.74, 0]}>
          <coneGeometry args={[0.028, 0.06, 12]} />
          <meshPhysicalMaterial {...steel} />
        </mesh>
      </group>
    </group>
  );
}
