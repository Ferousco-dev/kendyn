"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { noiseTexture, batteryLabelTexture } from "@/lib/textures";

/**
 * Long-format heavy-duty truck battery, built from the client's reference
 * shot: black polypropylene case with a stepped lid, eight vent caps, red
 * positive terminal cover, lead negative post, rope carry handles on the
 * ends and the HD label on the face. Engineered — no neon.
 */
export function BatteryModel({
  energy = 0.3,
  energyRef,
}: {
  energy?: number;
  /** scroll-driven override, read per-frame without re-rendering */
  energyRef?: React.RefObject<number>;
}) {
  const eye = useRef<THREE.MeshStandardMaterial>(null!);
  const warmth = useRef<THREE.PointLight>(null!);

  const maps = useMemo(
    () => ({
      caseRough: noiseTexture(256, 175, 60),
      label: batteryLabelTexture(),
    }),
    []
  );
  maps.caseRough.repeat.set(4, 2);

  const caseMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#15161a",
        roughness: 0.5,
        roughnessMap: maps.caseRough,
        metalness: 0,
        clearcoat: 0.18,
        clearcoatRoughness: 0.65,
        envMapIntensity: 0.55,
      }),
    [maps]
  );

  const lidMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#0e0f12",
        roughness: 0.55,
        roughnessMap: maps.caseRough,
        metalness: 0,
        clearcoat: 0.12,
        envMapIntensity: 0.5,
      }),
    [maps]
  );

  const ropeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a1b1e",
        roughness: 0.9,
        metalness: 0,
      }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const e = energyRef?.current ?? energy;
    const pulse = 0.75 + Math.sin(t * 1.1) * 0.25;
    if (eye.current) eye.current.emissiveIntensity = 0.25 + pulse * e * 1.1;
    if (warmth.current) warmth.current.intensity = pulse * e * 1.4;
  });

  return (
    <group>
      {/* case */}
      <RoundedBox args={[1.75, 0.95, 0.85]} radius={0.04} smoothness={4} castShadow receiveShadow>
        <primitive object={caseMat} attach="material" />
      </RoundedBox>

      {/* bottom ledge + stepped tabs along the front foot */}
      <RoundedBox args={[1.79, 0.1, 0.89]} radius={0.03} smoothness={2} position={[0, -0.44, 0]} castShadow>
        <primitive object={lidMat} attach="material" />
      </RoundedBox>
      {[-0.66, -0.44, -0.22, 0, 0.22, 0.44, 0.66].map((x) => (
        <mesh key={x} position={[x, -0.38, 0.443]} castShadow>
          <boxGeometry args={[0.13, 0.08, 0.025]} />
          <primitive object={lidMat} attach="material" />
        </mesh>
      ))}

      {/* stepped lid */}
      <RoundedBox args={[1.77, 0.12, 0.87]} radius={0.03} smoothness={2} position={[0, 0.52, 0]} castShadow>
        <primitive object={lidMat} attach="material" />
      </RoundedBox>
      <RoundedBox args={[1.45, 0.1, 0.6]} radius={0.03} smoothness={2} position={[0, 0.61, -0.04]} castShadow>
        <primitive object={lidMat} attach="material" />
      </RoundedBox>

      {/* eight vent caps */}
      {[-0.595, -0.425, -0.255, -0.085, 0.085, 0.255, 0.425, 0.595].map((x) => (
        <mesh key={x} position={[x, 0.675, -0.04]} castShadow>
          <cylinderGeometry args={[0.05, 0.055, 0.04, 20]} />
          <primitive object={caseMat} attach="material" />
        </mesh>
      ))}

      {/* positive terminal — red cover, front-left like the reference */}
      <group position={[-0.68, 0.62, 0.26]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.072, 0.105, 0.14, 24]} />
          <meshPhysicalMaterial color="#a8352a" roughness={0.45} clearcoat={0.3} />
        </mesh>
        <mesh position={[0, 0.075, 0]}>
          <cylinderGeometry args={[0.052, 0.072, 0.035, 24]} />
          <meshPhysicalMaterial color="#a8352a" roughness={0.45} clearcoat={0.3} />
        </mesh>
      </group>
      {/* negative terminal — bare lead post */}
      <group position={[0.68, 0.6, 0.26]}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.08, 0.05, 24]} />
          <primitive object={lidMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.046, 0.054, 0.09, 24]} />
          <meshPhysicalMaterial color="#8f959b" metalness={0.85} roughness={0.45} />
        </mesh>
      </group>

      {/* charge indicator eye on the lid */}
      <mesh position={[0.42, 0.585, 0.22]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.015, 16]} />
        <meshStandardMaterial
          ref={eye}
          color="#0d1f12"
          emissive="#41c46a"
          emissiveIntensity={0.4}
          roughness={0.25}
        />
      </mesh>

      {/* rope carry handles hanging on each end */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.885, 0.18, 0]}>
          {/* mounting lugs */}
          {[-0.16, 0.16].map((z) => (
            <mesh key={z} position={[0, 0.18, z]} castShadow>
              <boxGeometry args={[0.05, 0.1, 0.06]} />
              <primitive object={lidMat} attach="material" />
            </mesh>
          ))}
          {/* hanging rope loop */}
          <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]} castShadow>
            <torusGeometry args={[0.16, 0.026, 10, 28, Math.PI]} />
            <primitive object={ropeMat} attach="material" />
          </mesh>
        </group>
      ))}

      {/* moulded ribs under the handles */}
      {[-0.878, 0.878].map((x) =>
        [-0.26, -0.13, 0, 0.13, 0.26].map((z) => (
          <mesh key={`${x}${z}`} position={[x, -0.05, z]} castShadow>
            <boxGeometry args={[0.012, 0.66, 0.05]} />
            <primitive object={caseMat} attach="material" />
          </mesh>
        ))
      )}

      {/* HD label on the face */}
      <mesh position={[0, -0.02, 0.428]}>
        <planeGeometry args={[1.35, 0.56]} />
        <meshStandardMaterial map={maps.label} roughness={0.6} />
      </mesh>

      {/* faint internal warmth, story-driven */}
      <pointLight
        ref={warmth}
        color="#ffd9a0"
        intensity={0}
        distance={2.4}
        decay={2}
        position={[0, 0.2, 0.5]}
      />
    </group>
  );
}
