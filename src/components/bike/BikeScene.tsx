import { useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import { PARTS } from "./parts";
import {
  useMaterials,
  Wheel,
  Disc,
  Frame,
  Engine,
  Swingarm,
  Fork,
  Tank,
  Seat,
  Tail,
  Nose,
  Screen,
  Winglet,
  Bars,
} from "./BikeParts";

type ProgressRef = MutableRefObject<number>;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function Bike({ progress }: { progress: ProgressRef }) {
  const mats = useMaterials();
  const group = useRef<THREE.Group>(null);
  const refs = useRef<Record<string, THREE.Group | null>>({});
  const smoothed = useRef(0);

  const content: Record<string, React.ReactNode> = {
    frame: <Frame mats={mats} />,
    engine: <Engine mats={mats} />,
    swingarm: <Swingarm mats={mats} />,
    forkL: <Fork mats={mats} />,
    forkR: <Fork mats={mats} />,
    wheelF: <Wheel mats={mats} />,
    wheelR: <Wheel mats={mats} />,
    discF: <Disc mats={mats} />,
    discR: <Disc mats={mats} />,
    exhaust: (
      <mesh material={mats.titanium} rotation={[0, 0, Math.PI / 2 - 0.12]}>
        <cylinderGeometry args={[0.11, 0.08, 0.85, 32]} />
      </mesh>
    ),
    tank: <Tank mats={mats} />,
    seat: <Seat mats={mats} />,
    tail: <Tail mats={mats} />,
    nose: <Nose mats={mats} />,
    screen: <Screen mats={mats} />,
    winglet: <Winglet mats={mats} />,
    bars: <Bars mats={mats} />,
  };

  useFrame((state, delta) => {
    // critically damped follow for buttery motion
    smoothed.current += (progress.current - smoothed.current) * Math.min(1, delta * 5.5);
    const p = smoothed.current;
    const t = state.clock.elapsedTime;

    for (const part of PARTS) {
      const el = refs.current[part.id];
      if (!el) continue;
      // staggered assembly window
      const local = clamp01((p - part.order * 0.55) / 0.42);
      const e = easeInOut(local);
      const k = 1 - e; // 1 = fully exploded

      const float = Math.sin(t * 0.9 + part.order * 9) * 0.035 * k;
      const spread = k * 0.6;
      el.position.set(
        part.to[0] + part.offset[0] * spread,
        part.to[1] + part.offset[1] * spread + float,
        part.to[2] + part.offset[2] * spread,
      );
      el.rotation.set(part.spin[0] * k, part.spin[1] * k, part.spin[2] * k);
    }

    // wheels spin once assembled
    const spin = clamp01((p - 0.82) / 0.18);
    for (const id of ["wheelF", "wheelR", "discF", "discR"]) {
      const el = refs.current[id];
      if (el) el.rotation.z -= spin * delta * 5;
    }

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(-0.62, -0.16, easeInOut(p));
      group.current.position.y = -0.15 + (1 - p) * 0.08;
    }

    // locked camera with subtle cinematic drift
    const cam = state.camera;
    const px = (state.pointer.x || 0) * 0.22;
    const py = (state.pointer.y || 0) * 0.12;
    const targetX = 0.35 + Math.sin(t * 0.18) * 0.18 + px;
    const targetY = 0.55 - p * 0.22 + Math.sin(t * 0.24) * 0.06 + py;
    const targetZ = 10.8 - p * 2.2;
    cam.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), Math.min(1, delta * 2.2));
    cam.lookAt(0, 0.02, 0);
  });

  return (
    <group ref={group} scale={0.95}>
      {PARTS.map((part) => (
        <group
          key={part.id}
          ref={(el) => {
            refs.current[part.id] = el;
          }}
        >
          {content[part.id]}
        </group>
      ))}
    </group>
  );
}

function Studio() {
  return (
    <>
      <Environment resolution={512}>
        {/* key softbox */}
        <Lightformer intensity={12} position={[3, 4, 3]} scale={[8, 10, 1]} form="rect" />
        {/* rim strips */}
        <Lightformer intensity={22} position={[-5, 1.5, -2]} scale={[0.4, 10, 1]} form="rect" />
        <Lightformer intensity={20} position={[5, 1.2, -3]} scale={[0.4, 10, 1]} form="rect" />
        <Lightformer intensity={4} position={[0, -4, 0]} scale={[12, 12, 1]} rotation={[Math.PI / 2, 0, 0]} form="rect" />
      </Environment>
      <ambientLight intensity={0.55} />
      <spotLight
        position={[4, 7, 4]}
        angle={0.45}
        penumbra={1}
        intensity={420}
        color="#eaf2ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight position={[-6, 2, -4]} angle={0.7} penumbra={1} intensity={260} color="#7fb6ff" />
      <pointLight position={[0, -2, 3]} intensity={26} color="#ffd9b0" />
      <ContactShadows
        position={[0, -1.15, 0]}
        opacity={0.75}
        scale={14}
        blur={3.2}
        far={4}
        resolution={1024}
        color="#000000"
      />
      {/* volumetric haze */}
      <mesh position={[0, 0.4, -3.2]}>
        <planeGeometry args={[24, 12]} />
        <meshBasicMaterial color="#0b1016" transparent opacity={0.45} />
      </mesh>
      <fog attach="fog" args={["#050506", 13, 24]} />
    </>
  );
}

export default function BikeScene({ progress }: { progress: ProgressRef }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.25;
      }}
      camera={{ position: [0.35, 0.6, 10.8], fov: 34 }}
    >
      <Studio />
      <Bike progress={progress} />
    </Canvas>
  );
}
