"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConfiguratorStore } from "@/md/lib/character-store";
import { useEffect } from "react";
import { UI } from "@/components/character/UI";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import dynamic from "next/dynamic";

const Experience = dynamic(
  () => import("@/components/character/Experience").then((mod) => ({ default: mod.Experience })),
  { ssr: false }
);

const DEFAULT_CAMERA_POSITION: [number, number, number] = [-1, 1, 5];

export default function CharacterPage() {
  const groups = useQuery(api.characterCustomization.getCustomizationGroups);
  const setCategories = useConfiguratorStore((state) => state.setCategories);

  useEffect(() => {
    if (groups) {
      setCategories(groups as any);
    }
  }, [groups, setCategories]);

  return (
    <div className="h-screen w-full">
      <UI />
      <Canvas
        camera={{
          position: DEFAULT_CAMERA_POSITION,
          fov: 45,
        }}
        gl={{
          preserveDrawingBuffer: true,
        }}
        shadows
      >
        <color attach="background" args={["#130f30"]} />
        <fog attach="fog" args={["#130f30", 10, 40]} />
        <group position-y={-1}>
          <Experience />
        </group>
        <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={1.2} intensity={1.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
