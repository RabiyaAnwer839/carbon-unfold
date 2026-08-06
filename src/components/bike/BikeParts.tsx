import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

export function useMaterials() {
  return useMemo(() => {
    const carbon = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0e1012"),
      metalness: 0.25,
      roughness: 0.62,
      clearcoat: 0.55,
      clearcoatRoughness: 0.45,
      envMapIntensity: 0.55,
    });
    const titanium = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#71777d"),
      metalness: 1,
      roughness: 0.46,
      envMapIntensity: 0.85,
    });
    const darkMetal = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1c1f22"),
      metalness: 0.9,
      roughness: 0.55,
      envMapIntensity: 0.6,
    });
    const rubber = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0b0b0d"),
      metalness: 0.02,
      roughness: 0.96,
      envMapIntensity: 0.25,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0e1114"),
      metalness: 0.2,
      roughness: 0.08,
      transmission: 0.6,
      thickness: 0.4,
      transparent: true,
      opacity: 0.7,
    });
    const emissive = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0a0a0a"),
      emissive: new THREE.Color("#7fd3ff"),
      emissiveIntensity: 2.4,
      roughness: 0.3,
      metalness: 0.4,
    });
    return { carbon, titanium, darkMetal, rubber, glass, emissive };
  }, []);
}

type M = ReturnType<typeof useMaterials>;

export function Wheel({ mats }: { mats: M }) {
  const spokes = [0, 1, 2, 3, 4];
  return (
    <group>
      <mesh material={mats.rubber} castShadow receiveShadow>
        <torusGeometry args={[0.5, 0.115, 24, 96]} />
      </mesh>
      <mesh material={mats.darkMetal}>
        <torusGeometry args={[0.4, 0.04, 16, 72]} />
      </mesh>
      <mesh material={mats.titanium} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.26, 32]} />
      </mesh>
      {spokes.map((i) => (
        <mesh
          key={i}
          material={mats.darkMetal}
          rotation={[0, 0, (i / spokes.length) * Math.PI * 2]}
        >
          <boxGeometry args={[0.045, 0.78, 0.05]} />
        </mesh>
      ))}
    </group>
  );
}

export function Disc({ mats }: { mats: M }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh material={mats.titanium}>
        <cylinderGeometry args={[0.3, 0.3, 0.012, 48]} />
      </mesh>
      <mesh material={mats.darkMetal} position={[0.26, 0.05, 0.06]}>
        <boxGeometry args={[0.1, 0.09, 0.14]} />
      </mesh>
    </group>
  );
}

export function Frame({ mats }: { mats: M }) {
  return (
    <group>
      {/* main spar */}
      <RoundedBox args={[2.1, 0.24, 0.5]} radius={0.09} smoothness={4} material={mats.carbon} />
      {/* headstock */}
      <mesh material={mats.titanium} position={[1.06, 0.06, 0]} rotation={[0, 0, -0.42]}>
        <cylinderGeometry args={[0.11, 0.11, 0.42, 24]} />
      </mesh>
      {/* subframe rails */}
      {[0.16, -0.16].map((z) => (
        <mesh key={z} material={mats.titanium} position={[-1.1, 0.16, z]} rotation={[0, 0, 0.22]}>
          <cylinderGeometry args={[0.035, 0.035, 0.8, 16]} />
        </mesh>
      ))}
      {/* pivot plate */}
      <RoundedBox
        args={[0.42, 0.5, 0.56]}
        radius={0.07}
        smoothness={4}
        position={[-0.9, -0.12, 0]}
        material={mats.carbon}
      />
    </group>
  );
}

export function Engine({ mats }: { mats: M }) {
  return (
    <group>
      <RoundedBox args={[1.0, 0.62, 0.56]} radius={0.1} smoothness={4} material={mats.darkMetal} />
      {[0.22, 0.0, -0.22].map((y, i) => (
        <mesh key={i} material={mats.titanium} position={[0.06, y, 0]}>
          <boxGeometry args={[1.02, 0.05, 0.62]} />
        </mesh>
      ))}
      <mesh material={mats.emissive} position={[0, -0.05, 0.3]}>
        <boxGeometry args={[0.5, 0.03, 0.02]} />
      </mesh>
      <mesh material={mats.titanium} rotation={[Math.PI / 2, 0, 0]} position={[-0.42, -0.22, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.62, 32]} />
      </mesh>
    </group>
  );
}

export function Swingarm({ mats }: { mats: M }) {
  return (
    <group>
      {[0.2, -0.2].map((z) => (
        <mesh key={z} material={mats.titanium} position={[0, 0, z]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[1.3, 0.13, 0.09]} />
        </mesh>
      ))}
      <mesh material={mats.darkMetal} rotation={[Math.PI / 2, 0, 0]} position={[0.55, 0.05, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.48, 24]} />
      </mesh>
      <mesh material={mats.darkMetal} position={[0.3, 0.36, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.055, 0.055, 0.55, 20]} />
      </mesh>
    </group>
  );
}

export function Fork({ mats }: { mats: M }) {
  return (
    <group rotation={[0, 0, -0.42]}>
      <mesh material={mats.titanium}>
        <cylinderGeometry args={[0.055, 0.055, 0.95, 24]} />
      </mesh>
      <mesh material={mats.darkMetal} position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.42, 24]} />
      </mesh>
    </group>
  );
}

export function Tank({ mats }: { mats: M }) {
  return (
    <group>
      <RoundedBox args={[1.05, 0.42, 0.62]} radius={0.19} smoothness={6} material={mats.carbon} />
      <mesh material={mats.titanium} position={[-0.3, 0.22, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.04, 32]} />
      </mesh>
    </group>
  );
}

export function Seat({ mats }: { mats: M }) {
  return (
    <RoundedBox args={[0.78, 0.16, 0.4]} radius={0.07} smoothness={5} material={mats.carbon} />
  );
}

export function Tail({ mats }: { mats: M }) {
  return (
    <group rotation={[0, 0, 0.24]}>
      <RoundedBox args={[0.66, 0.2, 0.34]} radius={0.08} smoothness={5} material={mats.carbon} />
      <mesh material={mats.emissive} position={[-0.32, 0.03, 0]}>
        <boxGeometry args={[0.03, 0.07, 0.24]} />
      </mesh>
    </group>
  );
}

export function Nose({ mats }: { mats: M }) {
  return (
    <group rotation={[0, 0, -0.2]}>
      <RoundedBox args={[0.5, 0.46, 0.5]} radius={0.16} smoothness={6} material={mats.carbon} />
      <mesh material={mats.emissive} position={[0.24, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.11, 0.06, 32]} />
      </mesh>
    </group>
  );
}

export function Screen({ mats }: { mats: M }) {
  return (
    <mesh material={mats.glass} rotation={[0, 0, -0.6]}>
      <boxGeometry args={[0.38, 0.02, 0.36]} />
    </mesh>
  );
}

export function Winglet({ mats }: { mats: M }) {
  return (
    <group>
      {[0.34, -0.34].map((z) => (
        <mesh key={z} material={mats.carbon} position={[0, 0, z]} rotation={[0, 0, 0.12]}>
          <boxGeometry args={[0.34, 0.03, 0.24]} />
        </mesh>
      ))}
    </group>
  );
}

export function Bars({ mats }: { mats: M }) {
  return (
    <group>
      <mesh material={mats.titanium} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.72, 20]} />
      </mesh>
      {[0.3, -0.3].map((z) => (
        <mesh key={z} material={mats.darkMetal} position={[0.03, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.16, 20]} />
        </mesh>
      ))}
    </group>
  );
}
