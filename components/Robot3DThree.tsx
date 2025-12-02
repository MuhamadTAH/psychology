"use client";

import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls, RoundedBox } from "@react-three/drei";
import { Robot3DMood } from "./Robot3D";

interface Robot3DThreeProps {
  size?: number;
  mood?: Robot3DMood;
  blink?: boolean;
  rotation?: number;
  autoRotate?: boolean;
}

// Robot Head Component
function RobotHead() {
  return (
    <group position={[0, 0.5, 0]}>
      {/* Main Head Box - rounded corners */}
      <RoundedBox args={[1.3, 1.15, 0.5]} radius={0.1} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial
          color="#4A90E2"
          metalness={0.1}
          roughness={0.4}
        />
      </RoundedBox>

      {/* Head top highlight (lighter blue) */}
      <RoundedBox args={[1.15, 0.15, 0.45]} radius={0.05} smoothness={4} position={[0, 0.5, 0]} castShadow>
        <meshStandardMaterial
          color="#6FA8E8"
          metalness={0.05}
          roughness={0.3}
          transparent
          opacity={0.8}
        />
      </RoundedBox>

      {/* Head bottom shadow (darker blue) */}
      <RoundedBox args={[1.15, 0.15, 0.45]} radius={0.05} smoothness={4} position={[0, -0.5, 0]} castShadow>
        <meshStandardMaterial
          color="#3A7BC8"
          metalness={0.15}
          roughness={0.5}
        />
      </RoundedBox>

      {/* Left side panel (dark vent) */}
      <mesh position={[-0.55, 0, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.08]} />
        <meshStandardMaterial
          color="#2E5A8C"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Right side panel (dark vent) */}
      <mesh position={[0.55, 0, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.08]} />
        <meshStandardMaterial
          color="#2E5A8C"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Face screen (light grey/white) - with rounded corners */}
      <RoundedBox args={[0.9, 0.7, 0.05]} radius={0.08} smoothness={4} position={[0, 0, 0.26]} castShadow>
        <meshStandardMaterial
          color="#f5f5f5"
          metalness={0.1}
          roughness={0.3}
        />
      </RoundedBox>

      {/* Screen border (lighter frame) - with rounded corners */}
      <RoundedBox args={[0.95, 0.75, 0.03]} radius={0.09} smoothness={4} position={[0, 0, 0.285]} castShadow>
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.2}
          roughness={0.3}
          transparent
          opacity={0.8}
        />
      </RoundedBox>

      {/* Antenna (single, centered) */}
      <group position={[0, 0.8, 0]}>
        {/* Antenna stick */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.25, 16]} />
          <meshStandardMaterial
            color="#0a3d4d"
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>

        {/* Ball on top */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.06, 32, 32]} />
          <meshStandardMaterial
            color="#0a3d4d"
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Left Eye */}
      <group position={[-0.2, 0.1, 0.32]}>
        {/* Outer white sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.1}
            roughness={0.3}
          />
        </mesh>
        {/* Pupil */}
        <mesh position={[0, 0, 0.02]} castShadow>
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.2}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Right Eye */}
      <group position={[0.2, 0.1, 0.32]}>
        {/* Outer white sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.1}
            roughness={0.3}
          />
        </mesh>
        {/* Pupil */}
        <mesh position={[0, 0, 0.02]} castShadow>
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.2}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Mouth with simple lips */}
      <group position={[0, -0.15, 0.32]}>
        {/* Upper lip - flat ellipsoid */}
        <mesh position={[0, 0.02, 0]} castShadow scale={[1.8, 0.35, 0.15]}>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshStandardMaterial
            color="#ff6b6b"
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>
        {/* Lower lip - flat ellipsoid, slightly fuller */}
        <mesh position={[0, -0.03, 0]} castShadow scale={[1.8, 0.4, 0.15]}>
          <sphereGeometry args={[0.08, 32, 32]} />
          <meshStandardMaterial
            color="#ff5252"
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>
      </group>
    </group>
  );
}

// Robot Arms Component
function RobotArms() {
  return (
    <>
      {/* Left Arm Group */}
      <group position={[-0.5, 0, 0]}>
        {/* Upper arm - blue */}
        <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
          <meshStandardMaterial
            color="#4A90E2"
            metalness={0.1}
            roughness={0.4}
          />
        </mesh>

        {/* Elbow joint */}
        <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.09, 32, 32]} />
          <meshStandardMaterial
            color="#2E5A8C"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Forearm - dark blue */}
        <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
          <meshStandardMaterial
            color="#4A90E2"
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>

        {/* Hand - ellipsoid mitten shape */}
        <mesh position={[0, -0.85, 0]} castShadow receiveShadow scale={[1, 1.2, 0.8]}>
          <sphereGeometry args={[0.09, 32, 32]} />
          <meshStandardMaterial
            color="#2E5A8C"
            metalness={0.1}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Right Arm Group */}
      <group position={[0.5, 0, 0]}>
        {/* Upper arm - blue */}
        <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
          <meshStandardMaterial
            color="#4A90E2"
            metalness={0.1}
            roughness={0.4}
          />
        </mesh>

        {/* Elbow joint */}
        <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.09, 32, 32]} />
          <meshStandardMaterial
            color="#2E5A8C"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Forearm - dark blue */}
        <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
          <meshStandardMaterial
            color="#4A90E2"
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>

        {/* Hand - ellipsoid mitten shape */}
        <mesh position={[0, -0.85, 0]} castShadow receiveShadow scale={[1, 1.2, 0.8]}>
          <sphereGeometry args={[0.09, 32, 32]} />
          <meshStandardMaterial
            color="#2E5A8C"
            metalness={0.1}
            roughness={0.4}
          />
        </mesh>
      </group>
    </>
  );
}

// Robot Legs Component
function RobotLegs() {
  return (
    <>
      {/* Left Leg Group */}
      <group position={[-0.15, -0.8, 0]}>
        {/* Upper leg - blue */}
        <mesh position={[0, -0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.5, 16]} />
          <meshStandardMaterial
            color="#4A90E2"
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>

        {/* Knee joint */}
        <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.11, 32, 32]} />
          <meshStandardMaterial
            color="#2E5A8C"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Lower leg - bell-bottomed (cone shape) */}
        <mesh position={[0, -0.75, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.11, 0.08, 0.5, 16]} />
          <meshStandardMaterial
            color="#4A90E2"
            metalness={0.1}
            roughness={0.3}
          />
        </mesh>

        {/* Foot - boot shape */}
        <mesh position={[0, -1.05, 0.08]} castShadow receiveShadow scale={[1.5, 0.8, 1.6]}>
          <sphereGeometry args={[0.14, 32, 32]} />
          <meshStandardMaterial
            color="#4A90E2"
            metalness={0.1}
            roughness={0.4}
          />
        </mesh>

        {/* Toe section - darker front */}
        <mesh position={[0.05, -1.05, 0.18]} castShadow receiveShadow scale={[1, 0.9, 1]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial
            color="#2E5A8C"
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>
      </group>

      {/* Right Leg Group */}
      <group position={[0.15, -0.8, 0]}>
        {/* Upper leg - blue */}
        <mesh position={[0, -0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.5, 16]} />
          <meshStandardMaterial
            color="#4A90E2"
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>

        {/* Knee joint */}
        <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.11, 32, 32]} />
          <meshStandardMaterial
            color="#2E5A8C"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Lower leg - bell-bottomed (cone shape) */}
        <mesh position={[0, -0.75, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.11, 0.08, 0.5, 16]} />
          <meshStandardMaterial
            color="#4A90E2"
            metalness={0.1}
            roughness={0.3}
          />
        </mesh>

        {/* Foot - boot shape */}
        <mesh position={[0, -1.05, 0.08]} castShadow receiveShadow scale={[1.5, 0.8, 1.6]}>
          <sphereGeometry args={[0.14, 32, 32]} />
          <meshStandardMaterial
            color="#4A90E2"
            metalness={0.1}
            roughness={0.4}
          />
        </mesh>

        {/* Toe section - darker front */}
        <mesh position={[0.05, -1.05, 0.18]} castShadow receiveShadow scale={[1, 0.9, 1]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial
            color="#2E5A8C"
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>
      </group>
    </>
  );
}

// Robot Body/Torso Component
function RobotBody() {
  return (
    <>
      {/* Neck */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
        <meshStandardMaterial
          color="#2E5A8C"
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      {/* Main Torso - rounded box */}
      <RoundedBox args={[0.8, 0.75, 0.4]} radius={0.08} smoothness={4} position={[0, -0.35, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color="#4A90E2"
          metalness={0.1}
          roughness={0.4}
        />
      </RoundedBox>

      {/* Chest panel */}
      <RoundedBox args={[0.55, 0.45, 0.06]} radius={0.06} smoothness={4} position={[0, -0.3, 0.22]} castShadow>
        <meshStandardMaterial
          color="#f5f5f5"
          metalness={0.2}
          roughness={0.3}
        />
      </RoundedBox>

      {/* Center badge/emblem */}
      <mesh position={[0, -0.3, 0.26]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial
          color="#6FA8E8"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Side panels - left */}
      <RoundedBox args={[0.1, 0.6, 0.35]} radius={0.04} smoothness={4} position={[-0.45, -0.35, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color="#2E5A8C"
          metalness={0.2}
          roughness={0.5}
        />
      </RoundedBox>

      {/* Side panels - right */}
      <RoundedBox args={[0.1, 0.6, 0.35]} radius={0.04} smoothness={4} position={[0.45, -0.35, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color="#2E5A8C"
          metalness={0.2}
          roughness={0.5}
        />
      </RoundedBox>

      {/* Waist belt */}
      <mesh position={[0, -0.73, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.08, 32]} />
        <meshStandardMaterial
          color="#2E5A8C"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
    </>
  );
}

// Robot Component (will build piece by piece)
function Robot() {
  return (
    <group>
      <RobotHead />
      <RobotBody />
      <RobotArms />
      <RobotLegs />
    </group>
  );
}

// Robot Scene Component
function RobotScene({ autoRotate }: { autoRotate: boolean }) {
  return (
    <>
      {/* Camera Setup - Step 2 */}
      <PerspectiveCamera
        makeDefault
        position={[0, 2, 8]}
        fov={45}
        near={0.1}
        far={1000}
      />

      {/* Lighting Setup - Step 3 */}
      {/* Ambient Light - Soft overall illumination */}
      <ambientLight intensity={0.4} color="#ffffff" />

      {/* Directional Light - Main light source with shadows */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        color="#ffffff"
      />

      {/* Point Light - Optional highlight from front-left */}
      <pointLight
        position={[-3, 3, 5]}
        intensity={0.5}
        color="#a8d8ff"
        distance={15}
      />

      {/* Point Light - Optional highlight from right */}
      <pointLight
        position={[4, 2, 3]}
        intensity={0.3}
        color="#ffd4a8"
        distance={12}
      />

      {/* OrbitControls - Step 4 (Mouse drag to rotate) */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={15}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        autoRotate={autoRotate}
        autoRotateSpeed={2}
        target={[0, 0, 0]}
      />

      {/* Robot - Phase 3 (Head complete) */}
      <group position={[0, -1, 0]}>
        <Robot />
      </group>

      {/* Ground plane to receive shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>
    </>
  );
}

export default function Robot3DThree({
  size = 400,
  mood = "neutral",
  blink = false,
  rotation = 0,
  autoRotate = false
}: Robot3DThreeProps) {
  return (
    <div style={{ width: size, height: size, borderRadius: 8, overflow: "hidden" }}>
      {/* Canvas Setup - Step 1 (Enhanced) */}
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]} // Pixel ratio for retina displays
        style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}
      >
        <RobotScene autoRotate={autoRotate} />
      </Canvas>
    </div>
  );
}
