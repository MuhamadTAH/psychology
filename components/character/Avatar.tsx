"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { useConfiguratorStore } from "@/utils-lib/character-store";
import { Asset } from "./Asset";
import { Group, Skeleton } from "three";

export const Avatar = (props: any) => {
  const group = useRef<Group>(null);
  const { nodes } = useGLTF("/models/Armature.glb") as any;
  const { animations } = useGLTF("/models/Poses.glb") as any;
  const customization = useConfiguratorStore((state) => state.customization);
  const { actions } = useAnimations(animations, group);
  const pose = useConfiguratorStore((state) => state.pose);

  useEffect(() => {
    if (actions[pose]) {
      actions[pose]?.fadeIn(0.2).play();
      return () => {
        actions[pose]?.fadeOut(0.2).stop();
      };
    }
  }, [actions, pose]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          {Object.keys(customization).map(
            (key) =>
              customization[key]?.asset?.assetUrl && (
                <Suspense key={customization[key].asset!._id} fallback={null}>
                  <Asset
                    categoryName={key}
                    url={customization[key].asset!.assetUrl}
                    skeleton={nodes.Plane?.skeleton as Skeleton}
                  />
                </Suspense>
              )
          )}
        </group>
      </group>
    </group>
  );
};
