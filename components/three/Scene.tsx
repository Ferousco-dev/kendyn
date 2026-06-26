"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  MeshReflectorMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { scrollState, pointerState, phase, easeInOut } from "@/lib/store";
import { TyreModel } from "./Tyre";
import { BatteryModel } from "./Battery";
import { ToolsModel } from "./Tools";

/* stage marks */
const TYRE_POS = new THREE.Vector3(0.4, 1.165, 0);
const BATTERY_POS = new THREE.Vector3(3.6, 0.675, -0.3);

/* ── camera keyframes: one continuous tracking shot ─────────────── */
const CAMERA_KEYS: { p: number; pos: THREE.Vector3; look: THREE.Vector3 }[] = [
  { p: 0.0, pos: new THREE.Vector3(0.25, 1.28, 4.15), look: new THREE.Vector3(0.4, 1.12, 0) }, // hero — tyre fills the frame
  { p: 0.05, pos: new THREE.Vector3(0.25, 1.28, 4.15), look: new THREE.Vector3(0.4, 1.12, 0) },
  { p: 0.26, pos: new THREE.Vector3(-0.75, 1.05, 2.75), look: new THREE.Vector3(0.35, 1.2, 0) }, // slow move in, slight orbit
  { p: 0.46, pos: new THREE.Vector3(0.5, 3.0, 0.6), look: new THREE.Vector3(0.1, 1.15, -0.75) }, // tread macro — steep over the crown, the band fills the frame
  { p: 0.55, pos: new THREE.Vector3(1.7, 1.35, 3.1), look: new THREE.Vector3(1.8, 1.05, -0.1) }, // pan right through darkness
  { p: 0.68, pos: new THREE.Vector3(2.65, 1.1, 2.1), look: new THREE.Vector3(3.6, 0.72, -0.3) }, // the battery, revealed
  { p: 0.84, pos: new THREE.Vector3(2.95, 1.65, 1.35), look: new THREE.Vector3(3.62, 0.78, -0.3) }, // terminals, from above
  { p: 1.0, pos: new THREE.Vector3(2.0, 1.55, 6.9), look: new THREE.Vector3(2.0, 1.0, 0) }, // the two-shot
];

function sampleCamera(p: number, outPos: THREE.Vector3, outLook: THREE.Vector3) {
  let i = 0;
  while (i < CAMERA_KEYS.length - 2 && CAMERA_KEYS[i + 1].p < p) i++;
  const a = CAMERA_KEYS[i];
  const b = CAMERA_KEYS[i + 1];
  const t = easeInOut(THREE.MathUtils.clamp((p - a.p) / (b.p - a.p), 0, 1));
  outPos.lerpVectors(a.pos, b.pos, t);
  outLook.lerpVectors(a.look, b.look, t);
}

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();
const _lookCurrent = new THREE.Vector3(0.4, 1.12, 0);

/**
 * The film camera: scroll drives the dolly, the intro adds a slow settle,
 * the cursor adds a barely-perceptible operator drift. Heavy damping —
 * nothing snaps.
 */
function Rig({ introRef }: { introRef: React.RefObject<number> }) {
  const { camera } = useThree();
  useFrame((_, dt) => {
    const p = scrollState.progress;
    const intro = introRef.current ?? 1;
    sampleCamera(p, _pos, _look);

    // the camera starts further out and settles in as the tyre emerges
    const settle = 1 - easeInOut(intro);
    _pos.z += settle * 1.3;
    _pos.y += settle * 0.22;

    _pos.x += pointerState.x * 0.07;
    _pos.y += pointerState.y * 0.045;

    const k = 1 - Math.exp(-dt * 3.2);
    camera.position.lerp(_pos, k);
    _lookCurrent.lerp(_look, k);
    camera.lookAt(_lookCurrent);
  });
  return null;
}

function TargetedSpot({
  lightRef,
  position,
  target,
  ...props
}: {
  lightRef: React.RefObject<THREE.SpotLight | null>;
  position: [number, number, number];
  target: [number, number, number];
  angle?: number;
  penumbra?: number;
  intensity?: number;
  color?: string;
  castShadow?: boolean;
}) {
  useEffect(() => {
    const light = lightRef.current;
    if (!light) return;
    light.target.position.set(...target);
    light.target.updateMatrixWorld();
  }, [lightRef, target]);
  return <spotLight ref={lightRef} position={position} {...props} />;
}

/**
 * Studio lighting with a script: everything fades up from black, a single
 * source sweeps across the rubber, and as the story moves to the battery
 * the key dims and a second lamp finds it in the dark.
 */
function CinematicLights({
  introRef,
  quality,
}: {
  introRef: React.RefObject<number>;
  quality: boolean;
}) {
  const key = useRef<THREE.SpotLight>(null);
  const sweep = useRef<THREE.SpotLight>(null);
  const rim = useRef<THREE.SpotLight>(null);
  const batterySpot = useRef<THREE.SpotLight>(null);
  const fill = useRef<THREE.PointLight>(null!);
  const ambient = useRef<THREE.AmbientLight>(null!);
  const startRef = useRef<number | null>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (startRef.current === null) startRef.current = t;
    const introRaw = THREE.MathUtils.clamp((t - startRef.current) / 3.4, 0, 1);
    introRef.current = introRaw;
    const intro = easeInOut(introRaw);

    const p = scrollState.progress;
    const eBattery = easeInOut(phase(p, 0.48, 0.64));
    const eFinale = easeInOut(phase(p, 0.86, 1));
    const tyreLevel = intro * (1 - eBattery * 0.78 + eFinale * 0.65);

    if (key.current) key.current.intensity = 170 * tyreLevel;
    if (rim.current) rim.current.intensity = 110 * intro * (1 - eBattery * 0.45 + eFinale * 0.35);
    if (fill.current) fill.current.intensity = 18 * intro;
    if (ambient.current) ambient.current.intensity = 0.13 * intro;
    if (batterySpot.current)
      batterySpot.current.intensity = 160 * intro * Math.max(eBattery, eFinale * 0.8);

    // the light sweep across the tyre as it emerges
    if (sweep.current) {
      const s = phase(introRaw, 0.18, 0.95);
      sweep.current.position.x = THREE.MathUtils.lerp(-4.5, 6, easeInOut(s));
      sweep.current.intensity = Math.sin(Math.PI * s) * 150;
    }
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0} />
      {/* key — warm studio lamp on the tyre */}
      <TargetedSpot
        lightRef={key}
        position={[3.2, 5.8, 3.6]}
        target={[0.4, 1.1, 0]}
        angle={0.5}
        penumbra={1}
        intensity={0}
        color="#fff3e2"
        castShadow={quality}
      />
      {/* rim/back light — the edge that makes rubber read as rubber */}
      <TargetedSpot
        lightRef={rim}
        position={[-2.6, 4.2, -4.8]}
        target={[0.6, 1.4, 0]}
        angle={0.55}
        penumbra={1}
        intensity={0}
        color="#e7edf6"
      />
      {/* the battery's lamp, dark until the story arrives */}
      <TargetedSpot
        lightRef={batterySpot}
        position={[4.8, 5.2, 2.4]}
        target={[3.6, 0.72, -0.3]}
        angle={0.42}
        penumbra={1}
        intensity={0}
        color="#fff1dd"
        castShadow={quality}
      />
      {/* intro sweep */}
      <TargetedSpot
        lightRef={sweep}
        position={[-4.5, 3.4, 3.2]}
        target={[0.4, 1.2, 0]}
        angle={0.38}
        penumbra={1}
        intensity={0}
        color="#ffffff"
      />
      <pointLight ref={fill} position={[-4.5, 2.2, 4.5]} intensity={0} color="#d9e1ec" />

      {/* static reflection environment — softboxes and a ring, studio style */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.4}
          position={[0, 6, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[14, 3, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={1.3}
          position={[-7, 2.4, 1]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[9, 1.6, 1]}
          color="#dfe6f0"
        />
        <Lightformer
          form="rect"
          intensity={0.9}
          position={[7, 1.8, -1]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[9, 1.2, 1]}
          color="#f4efe6"
        />
        <Lightformer
          form="ring"
          intensity={1.1}
          position={[0.5, 2.4, 7.5]}
          scale={4}
          color="#ffffff"
        />
      </Environment>
    </>
  );
}

/** Battery's energy follows the story; the meshes themselves never move. */
function StoryState() {
  const energyRef = useRef(0.1);
  const assembled = useRef(1); // tools rest fully assembled — a still life, not a gimmick
  useFrame(() => {
    const p = scrollState.progress;
    energyRef.current = 0.12 + easeInOut(phase(p, 0.55, 0.8)) * 0.88;
  });
  return (
    <>
      <group position={BATTERY_POS} rotation={[0, -0.38, 0]}>
        <BatteryModel energyRef={energyRef} />
      </group>
      {/* workshop tools laid at the foot of the plinth, caught by the same lamp */}
      <group position={[4.7, 0.14, 0.75]} rotation={[-Math.PI / 2.15, 0, 0.7]} scale={0.85}>
        <ToolsModel assemblyRef={assembled} />
      </group>
    </>
  );
}

function Stage({ quality }: { quality: boolean }) {
  return (
    <group>
      {/* studio floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[30, 64]} />
        {quality ? (
          <MeshReflectorMaterial
            blur={[300, 80]}
            resolution={1024}
            mixBlur={1}
            mixStrength={18}
            roughness={0.95}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#0a0b0d"
            metalness={0.4}
            mirror={0.38}
          />
        ) : (
          <meshStandardMaterial color="#0a0b0d" roughness={0.92} metalness={0.25} />
        )}
      </mesh>

      {/* grounding occlusion under both objects */}
      {quality && (
        <ContactShadows
          position={[1.9, 0.001, 0]}
          opacity={0.62}
          scale={11}
          blur={2.3}
          far={2.6}
          frames={1}
          resolution={512}
        />
      )}

      {/* battery plinth */}
      <mesh position={[3.6, 0.1, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[2.35, 0.2, 1.3]} />
        <meshPhysicalMaterial color="#101216" metalness={0.55} roughness={0.5} />
      </mesh>
    </group>
  );
}

/**
 * A product film that happens to scroll: the tyre emerges from darkness
 * under a sweeping lamp, the camera tracks in like a dolly, and the story
 * hands the light to the battery before the closing two-shot.
 */
export default function Scene({
  isMobile,
}: {
  isMobile: boolean;
  reducedMotion: boolean;
}) {
  const quality = !isMobile;
  const introRef = useRef(0);
  return (
    <Canvas
      shadows={quality}
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0.25, 1.5, 5.5], fov: 38, near: 0.1, far: 60 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#08090b"]} />
      <fog attach="fog" args={["#08090b", 9, 26]} />
      <CinematicLights introRef={introRef} quality={quality} />
      <group position={TYRE_POS}>
        <TyreModel spinSpeed={0.12} detail={quality} />
      </group>
      <StoryState />
      <Stage quality={quality} />
      <Rig introRef={introRef} />
    </Canvas>
  );
}
