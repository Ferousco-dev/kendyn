"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import { noiseTexture, mottleTexture, sidewallTexture } from "@/lib/textures";

const fract = (n: number) => n - Math.floor(n);

/**
 * True tyre cross-section, bead to bead: flat crown, rounded shoulder,
 * bulged sidewall, bead seat. Lathed around the axle — no more donut.
 * [radius from axle, axial offset]
 */
const PROFILE: [number, number][] = [
  [0.52, -0.24],
  [0.545, -0.275],
  [0.575, -0.3],
  [0.63, -0.318],
  [0.7, -0.345],
  [0.8, -0.368],
  [0.92, -0.375],
  [1.02, -0.355],
  [1.1, -0.305],
  [1.125, -0.24],
  [1.135, 0],
  [1.125, 0.24],
  [1.1, 0.305],
  [1.02, 0.355],
  [0.92, 0.375],
  [0.8, 0.368],
  [0.7, 0.345],
  [0.63, 0.318],
  [0.575, 0.3],
  [0.545, 0.275],
  [0.52, 0.24],
];

const LUG_COUNT = 24;

/* main lug rows form the staggered centre chevron; cap rows are the
   shoulder teeth that wrap down toward the sidewall */
const LUG_ROWS = [
  { z: -0.14, yaw: 0.5, phase: 0, r: 1.13 },
  { z: 0.14, yaw: -0.5, phase: 0.5, r: 1.13 },
] as const;

const CAP_ROWS = [
  { z: -0.318, yaw: 0.5, phase: 0, pitch: 0.55, r: 1.02 },
  { z: 0.318, yaw: -0.5, phase: 0.5, pitch: -0.55, r: 1.02 },
] as const;

/**
 * Heavy industrial tyre modelled on real deep-lug casings: marbled rubber
 * on the lug faces, smooth dark sidewall with molded lettering, concentric
 * bead ridges, steel rim. Spins about its axle — slow and heavy.
 */
export function TyreModel({
  spinSpeed = 0.12,
  detail = true,
  yaw = 0.42,
}: {
  spinSpeed?: number;
  detail?: boolean;
  yaw?: number;
}) {
  const wheel = useRef<THREE.Group>(null!);

  const maps = useMemo(() => {
    const rough = noiseTexture(256, 170, 50);
    rough.repeat.set(8, 2);
    const lugMottle = mottleTexture(512, "#1c1c1c");
    lugMottle.repeat.set(1.5, 1.5);
    const steelRough = noiseTexture(256, 90, 50);
    steelRough.repeat.set(3, 3);
    return { rough, lugMottle, steelRough, sidewall: sidewallTexture() };
  }, []);

  const casingGeom = useMemo(() => {
    const pts = PROFILE.map(([r, z]) => new THREE.Vector2(r, z));
    const g = new THREE.LatheGeometry(pts, 160);
    g.rotateX(Math.PI / 2); // lathe axis → wheel axle (z)
    return g;
  }, []);

  const lugGeom = useMemo(() => new RoundedBoxGeometry(0.22, 0.13, 0.36, 2, 0.025), []);
  const capGeom = useMemo(() => new RoundedBoxGeometry(0.2, 0.18, 0.16, 2, 0.025), []);

  const casingMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#131313",
        roughness: 0.6,
        roughnessMap: maps.rough,
        metalness: 0,
        clearcoat: 0.06,
        clearcoatRoughness: 0.8,
        envMapIntensity: 0.55,
      }),
    [maps]
  );

  const lugMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#d8d8d8", // tints the mottle map, keeps marbling visible
        map: maps.lugMottle,
        roughness: 0.72,
        roughnessMap: maps.rough,
        metalness: 0,
        envMapIntensity: 0.5,
      }),
    [maps]
  );

  const steel = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#b7bbc1",
        metalness: 1,
        roughness: 0.32,
        roughnessMap: maps.steelRough,
        envMapIntensity: 1.1,
      }),
    [maps]
  );

  useFrame((_, dt) => {
    if (wheel.current) wheel.current.rotation.z -= spinSpeed * dt;
  });

  const placeRow = (
    node: THREE.InstancedMesh | null,
    row: { z: number; yaw: number; phase: number; r: number; pitch?: number }
  ) => {
    if (!node) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < LUG_COUNT; i++) {
      const theta = ((i + row.phase) / LUG_COUNT) * Math.PI * 2;
      const jitter = 0.96 + fract(i * 0.61803 + row.z * 7) * 0.07;
      dummy.position.set(Math.cos(theta) * row.r, Math.sin(theta) * row.r, row.z);
      // Euler XYZ = Rz(align) · Ry(chevron) · Rx(shoulder pitch) — local composition
      dummy.rotation.set(row.pitch ?? 0, row.yaw, theta + Math.PI / 2);
      dummy.scale.set(jitter, 1, 1);
      dummy.updateMatrix();
      node.setMatrixAt(i, dummy.matrix);
    }
    node.instanceMatrix.needsUpdate = true;
  };

  return (
    <group rotation={[0, yaw, 0]}>
      <group ref={wheel}>
        {/* casing */}
        <mesh geometry={casingGeom} material={casingMat} castShadow receiveShadow />

        {/* main tread lugs — staggered chevron */}
        {LUG_ROWS.map((row) => (
          <instancedMesh
            key={`lug${row.z}`}
            args={[lugGeom, lugMat, LUG_COUNT]}
            castShadow
            ref={(node) => placeRow(node, row)}
          />
        ))}

        {/* shoulder caps wrapping toward the sidewall */}
        {detail &&
          CAP_ROWS.map((row) => (
            <instancedMesh
              key={`cap${row.z}`}
              args={[capGeom, lugMat, LUG_COUNT]}
              castShadow
              ref={(node) => placeRow(node, row)}
            />
          ))}

        {/* concentric bead ridges */}
        {detail &&
          [1, -1].map((side) =>
            [
              [0.58, 0.302],
              [0.62, 0.318],
              [0.66, 0.333],
            ].map(([r, z]) => (
              <mesh key={`${side}${r}`} position={[0, 0, side * z]} material={casingMat}>
                <torusGeometry args={[r, 0.011, 8, 96]} />
              </mesh>
            ))
          )}

        {/* molded sidewall lettering */}
        {detail &&
          [0.377, -0.377].map((z) => (
            <mesh key={z} position={[0, 0, z]} rotation={[z < 0 ? Math.PI : 0, 0, 0]}>
              <ringGeometry args={[0.8, 1.01, 96]} />
              <meshStandardMaterial
                map={maps.sidewall}
                transparent
                depthWrite={false}
                roughness={0.55}
                color="#9a9a9a"
                polygonOffset
                polygonOffsetFactor={-1}
              />
            </mesh>
          ))}

        {/* steel rim — barrel, face, lips */}
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]} material={steel}>
          <cylinderGeometry args={[0.51, 0.51, 0.44, 64, 1, true]} />
        </mesh>
        <mesh castShadow position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]} material={steel}>
          <cylinderGeometry args={[0.51, 0.47, 0.05, 64]} />
        </mesh>
        {[0.22, -0.22].map((z) => (
          <mesh key={z} position={[0, 0, z]} castShadow material={steel}>
            <torusGeometry args={[0.52, 0.022, 12, 64]} />
          </mesh>
        ))}

        {/* hub + bolt circle */}
        <mesh position={[0, 0, 0.13]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.17, 0.19, 0.09, 32]} />
          <meshPhysicalMaterial color="#5d6166" metalness={1} roughness={0.45} />
        </mesh>
        {detail &&
          Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0.135]}
                rotation={[Math.PI / 2, 0, a]}
              >
                <cylinderGeometry args={[0.026, 0.026, 0.05, 6]} />
                <meshPhysicalMaterial color="#7c8187" metalness={1} roughness={0.4} />
              </mesh>
            );
          })}
        <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.04, 32]} />
          <meshPhysicalMaterial color="#9ba0a6" metalness={1} roughness={0.3} />
        </mesh>
        {/* valve stem */}
        {detail && (
          <mesh position={[0.4, -0.12, 0.2]} rotation={[Math.PI / 2.4, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.014, 0.07, 8]} />
            <meshStandardMaterial color="#202327" roughness={0.6} />
          </mesh>
        )}
      </group>
    </group>
  );
}
