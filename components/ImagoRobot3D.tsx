"use client";

import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, animated, config } from "@react-spring/three";

type ColorTheme = "blue" | "green" | "orange";

interface ColorPalette {
  primary: string;
  accent: string;
  facePanel: string;
  eyesGlow: string;
}

const COLOR_THEMES: Record<ColorTheme, ColorPalette> = {
  blue: {
    primary: "#4A90E2",
    accent: "#F1C40F",
    facePanel: "#111111",
    eyesGlow: "#00FFCC"
  },
  green: {
    primary: "#2ECC71",
    accent: "#E74C3C",
    facePanel: "#111111",
    eyesGlow: "#A3FFCE"
  },
  orange: {
    primary: "#F39C12",
    accent: "#2980B9",
    facePanel: "#111111",
    eyesGlow: "#00E6FF"
  }
};

interface ImagoRobot3DProps {
  size?: number;
  autoRotate?: boolean;
  smile?: boolean;
  sad?: boolean;
  crying?: boolean;
  blink?: boolean;
  smileIntensity?: number;
  colorTheme?: ColorTheme;
  transparent?: boolean;
  bodyRotation?: number;
  bodyPositionY?: number;
  bodyPositionZ?: number;
  headNeckRotation?: { x: number; y: number; z: number };
  headCenterRotation?: { x: number; y: number; z: number };
  leftShoulderRotation?: { x: number; y: number; z: number };
  leftElbowRotation?: { x: number; y: number; z: number };
  rightShoulderRotation?: { x: number; y: number; z: number };
  rightElbowRotation?: { x: number; y: number; z: number };
  leftHipRotation?: { x: number; y: number; z: number };
  leftKneeRotation?: { x: number; y: number; z: number };
  rightHipRotation?: { x: number; y: number; z: number };
  rightKneeRotation?: { x: number; y: number; z: number };
  holdPen?: boolean;
}

// Imago Robot Head Component
function ImagoRobotHead({ smile = false, sad = false, crying = false, blink = false, smileIntensity = 1, colors }: { smile?: boolean; sad?: boolean; crying?: boolean; blink?: boolean; smileIntensity?: number; colors: ColorPalette }) {
  return (
    <group position={[0, 0, 0]} scale={[0.75, 0.75, 0.75]}>
      {/* Main Helmet - ellipsoid (wider horizontally) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow scale={[1.4, 1.2, 1]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color={colors.primary}
          metalness={0.15}
          roughness={0.35}
        />
      </mesh>

      {/* Left Ear Panel */}
      <group position={[-0.9, 0, 0]}>
        {/* Ear panel box */}
        <RoundedBox args={[0.15, 0.25, 0.2]} radius={0.04} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial
            color={colors.accent}
            metalness={0.2}
            roughness={0.5}
          />
        </RoundedBox>

        {/* Stripes on ear (x3) - thin horizontal lines */}
        {/* Top stripe */}
        <mesh position={[-0.08, 0.06, 0]} castShadow>
          <boxGeometry args={[0.02, 0.03, 0.12]} />
          <meshStandardMaterial
            color={colors.primary}
            metalness={0.1}
            roughness={0.4}
          />
        </mesh>

        {/* Middle stripe */}
        <mesh position={[-0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.03, 0.12]} />
          <meshStandardMaterial
            color={colors.primary}
            metalness={0.1}
            roughness={0.4}
          />
        </mesh>

        {/* Bottom stripe */}
        <mesh position={[-0.08, -0.06, 0]} castShadow>
          <boxGeometry args={[0.02, 0.03, 0.12]} />
          <meshStandardMaterial
            color={colors.primary}
            metalness={0.1}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Right Ear Panel */}
      <group position={[0.9, 0, 0]}>
        {/* Ear panel box */}
        <RoundedBox args={[0.15, 0.25, 0.2]} radius={0.04} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial
            color={colors.accent}
            metalness={0.2}
            roughness={0.5}
          />
        </RoundedBox>

        {/* Stripes on ear (x3) - thin horizontal lines */}
        {/* Top stripe */}
        <mesh position={[ 0.08, 0.06, 0]} castShadow>
          <boxGeometry args={[0.02, 0.03, 0.12]} />
          <meshStandardMaterial
            color={colors.primary}
            metalness={0.1}
            roughness={0.4}
          />
        </mesh>

        {/* Middle stripe */}
        <mesh position={[ 0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.03, 0.12]} />
          <meshStandardMaterial
            color={colors.primary}
            metalness={0.1}
            roughness={0.4}
          />
        </mesh>

        {/* Bottom stripe */}
        <mesh position={[ 0.08, -0.06, 0]} castShadow>
          <boxGeometry args={[0.02, 0.03, 0.12]} />
          <meshStandardMaterial
            color={colors.primary}
            metalness={0.1}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Face Screen */}
      <RoundedBox args={[1.0, 0.7, 0.7]} radius={0.25} smoothness={4} position={[0, 0, 0.3]} castShadow receiveShadow>
        <meshStandardMaterial
          color={colors.facePanel}
          metalness={0.6}
          roughness={0.5}
        />
      </RoundedBox>

      {/* Eyes - Open or Closed */}
      {!blink ? (
        <>
          {/* Left Eye - Open */}
          <mesh position={[-0.18, 0.05, 0.61]} castShadow>
            <sphereGeometry args={[0.08, 32, 32]} />
            <meshStandardMaterial
              color={colors.eyesGlow}
              metalness={0.1}
              roughness={0.3}
              emissive={colors.eyesGlow}
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Right Eye - Open */}
          <mesh position={[0.18, 0.05, 0.61]} castShadow>
            <sphereGeometry args={[0.08, 32, 32]} />
            <meshStandardMaterial
              color={colors.eyesGlow}
              metalness={0.1}
              roughness={0.3}
              emissive={colors.eyesGlow}
              emissiveIntensity={0.5}
            />
          </mesh>
        </>
      ) : (
        <>
          {/* Left Eye - Closed (horizontal line) */}
          <mesh position={[-0.18, 0.05, 0.61]} castShadow>
            <boxGeometry args={[0.12, 0.02, 0.02]} />
            <meshStandardMaterial
              color={colors.eyesGlow}
              metalness={0.1}
              roughness={0.3}
              emissive={colors.eyesGlow}
              emissiveIntensity={0.4}
            />
          </mesh>

          {/* Right Eye - Closed (horizontal line) */}
          <mesh position={[0.18, 0.05, 0.61]} castShadow>
            <boxGeometry args={[0.12, 0.02, 0.02]} />
            <meshStandardMaterial
              color={colors.eyesGlow}
              metalness={0.1}
              roughness={0.3}
              emissive={colors.eyesGlow}
              emissiveIntensity={0.4}
            />
          </mesh>
        </>
      )}

      {/* Smile - smooth curved line */}
      {smile && (
        <mesh position={[0, -0.18, 0.65]} castShadow>
          <tubeGeometry
            args={[
              new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(-0.24, 0, 0),  // Left point
                new THREE.Vector3(0, -0.08 * smileIntensity, 0),  // Control point (bottom of curve - smile intensity)
                new THREE.Vector3(0.24, 0, 0)    // Right point
              ),
              20,      // tubular segments
              0.025,   // radius (thickness)
              8,       // radial segments
              false    // closed
            ]}
          />
          <meshStandardMaterial
            color={colors.eyesGlow}
            metalness={0.1}
            roughness={0.3}
            emissive={colors.eyesGlow}
            emissiveIntensity={0.6 * smileIntensity}
          />
        </mesh>
      )}

      {/* Sad - smooth curved line (inverted) */}
      {sad && (
        <mesh position={[0, -0.18, 0.65]} castShadow>
          <tubeGeometry
            args={[
              new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(-0.24, 0, 0),  // Left point
                new THREE.Vector3(0, 0.08, 0),   // Control point (top of curve - sad)
                new THREE.Vector3(0.24, 0, 0)    // Right point
              ),
              20,      // tubular segments
              0.025,   // radius (thickness)
              8,       // radial segments
              false    // closed
            ]}
          />
          <meshStandardMaterial
            color={colors.eyesGlow}
            metalness={0.1}
            roughness={0.3}
            emissive={colors.eyesGlow}
            emissiveIntensity={0.6}
          />
        </mesh>
      )}

      {/* Crying - sad face with tears */}
      {crying && (
        <>
          {/* Sad mouth */}
          <mesh position={[0, -0.18, 0.65]} castShadow>
            <tubeGeometry
              args={[
                new THREE.QuadraticBezierCurve3(
                  new THREE.Vector3(-0.24, 0, 0),  // Left point
                  new THREE.Vector3(0, 0.08, 0),   // Control point (top of curve - sad)
                  new THREE.Vector3(0.24, 0, 0)    // Right point
                ),
                20,      // tubular segments
                0.025,   // radius (thickness)
                8,       // radial segments
                false    // closed
              ]}
            />
            <meshStandardMaterial
              color="#5dcea0"
              metalness={0.1}
              roughness={0.3}
              emissive="#5dcea0"
              emissiveIntensity={0.6}
            />
          </mesh>

          {/* Left tear */}
          <mesh position={[-0.18, -0.05, 0.62]} castShadow>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial
              color="#4a9eff"
              metalness={0.3}
              roughness={0.2}
              emissive="#4a9eff"
              emissiveIntensity={0.4}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Right tear */}
          <mesh position={[0.18, -0.05, 0.62]} castShadow>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial
              color="#4a9eff"
              metalness={0.3}
              roughness={0.2}
              emissive="#4a9eff"
              emissiveIntensity={0.4}
              transparent
              opacity={0.8}
            />
          </mesh>
        </>
      )}

      {/* Neutral - straight line */}
      {!smile && !sad && !crying && (
        <mesh position={[0, -0.18, 0.65]} castShadow>
          <boxGeometry args={[0.35, 0.03, 0.02]} />
          <meshStandardMaterial
            color={colors.eyesGlow}
            metalness={0.1}
            roughness={0.3}
            emissive={colors.eyesGlow}
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {/* Antenna (single, centered) */}
      <group position={[0, 0.7, 0]}>
        {/* Antenna stick */}
        <mesh position={[0, 0.125, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.25, 16]} />
          <meshStandardMaterial
            color={colors.accent}
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>

        {/* Ball on top */}
        <mesh position={[0, 0.31, 0]} castShadow>
          <sphereGeometry args={[0.06, 32, 32]} />
          <meshStandardMaterial
            color={colors.accent}
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>
      </group>
    </group>
  );
}

// Imago Robot Neck Component
function ImagoRobotNeck({
  headNeckRotation = { x: 0, y: 0, z: 0 },
  headCenterRotation = { x: 0, y: 0, z: 0 },
  smile = false,
  sad = false,
  crying = false,
  blink = false,
  smileIntensity = 1,
  colors
}: {
  headNeckRotation?: { x: number; y: number; z: number };
  headCenterRotation?: { x: number; y: number; z: number };
  smile?: boolean;
  sad?: boolean;
  crying?: boolean;
  blink?: boolean;
  smileIntensity?: number;
  colors: ColorPalette;
}) {
  return (
    <group position={[0, 0.425, 0]}>
      {/* Neck cylinder */}
      <mesh position={[0, -0.125, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.25, 32]} />
        <meshStandardMaterial
          color={colors.accent}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      {/* Rotation 1: At neck top - rotates whole head around neck connection */}
      <group position={[0, 0, 0]} rotation={[
        THREE.MathUtils.degToRad(headNeckRotation.x),
        THREE.MathUtils.degToRad(headNeckRotation.y),
        THREE.MathUtils.degToRad(headNeckRotation.z)
      ]}>
        {/* Rotation 2: At head center - rotates head around its own center */}
        <group position={[0, 0.425, 0]} rotation={[
          THREE.MathUtils.degToRad(headCenterRotation.x),
          THREE.MathUtils.degToRad(headCenterRotation.y),
          THREE.MathUtils.degToRad(headCenterRotation.z)
        ]}>
          <ImagoRobotHead smile={smile} sad={sad} crying={crying} blink={blink} smileIntensity={smileIntensity} colors={colors} />
        </group>
      </group>
    </group>
  );
}

// Imago Robot Torso Component
function ImagoRobotTorso({ colors }: { colors: ColorPalette }) {
  return (
    <>
      {/* Main Torso - center panel */}
      <RoundedBox args={[0.8, 0.75, 0.4]} radius={0.08} smoothness={4} position={[0, -0.2, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color={colors.primary}
          metalness={0.1}
          roughness={0.4}
        />
      </RoundedBox>

      {/* Waist Belt */}
      <RoundedBox args={[0.85, 0.12, 0.45]} radius={0.04} smoothness={4} position={[0, -0.58, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color={colors.accent}
          metalness={0.3}
          roughness={0.4}
        />
      </RoundedBox>
    </>
  );
}

// Imago Robot Arms Component
function ImagoRobotArms({
  leftShoulderRotation = { x: 0, y: 0, z: 0 },
  leftElbowRotation = { x: 0, y: 0, z: 0 },
  rightShoulderRotation = { x: 0, y: 0, z: 0 },
  rightElbowRotation = { x: 0, y: 0, z: 0 },
  holdPen = false,
  colorTheme,
  colors
}: {
  leftShoulderRotation?: { x: number; y: number; z: number };
  leftElbowRotation?: { x: number; y: number; z: number };
  rightShoulderRotation?: { x: number; y: number; z: number };
  rightElbowRotation?: { x: number; y: number; z: number };
  holdPen?: boolean;
  colorTheme: ColorTheme;
  colors: ColorPalette;
}) {
  // Smooth animations for left arm
  const leftShoulderSpring = useSpring({
    rotation: [
      THREE.MathUtils.degToRad(leftShoulderRotation.x),
      THREE.MathUtils.degToRad(leftShoulderRotation.y),
      THREE.MathUtils.degToRad(leftShoulderRotation.z)
    ],
    config: config.gentle
  });

  const leftElbowSpring = useSpring({
    rotation: [
      THREE.MathUtils.degToRad(leftElbowRotation.x),
      THREE.MathUtils.degToRad(leftElbowRotation.y),
      THREE.MathUtils.degToRad(leftElbowRotation.z)
    ],
    config: config.gentle
  });

  // Smooth animations for right arm
  const rightShoulderSpring = useSpring({
    rotation: [
      THREE.MathUtils.degToRad(rightShoulderRotation.x),
      THREE.MathUtils.degToRad(rightShoulderRotation.y),
      THREE.MathUtils.degToRad(rightShoulderRotation.z)
    ],
    config: config.gentle
  });

  const rightElbowSpring = useSpring({
    rotation: [
      THREE.MathUtils.degToRad(rightElbowRotation.x),
      THREE.MathUtils.degToRad(rightElbowRotation.y),
      THREE.MathUtils.degToRad(rightElbowRotation.z)
    ],
    config: config.gentle
  });

  return (
    <>
      {/* Left Arm Group */}
      <group position={[-0.5, 0, 0]}>
        {/* Upper Arm Group - rotates around shoulder */}
        <animated.group position={[0, -0.05, 0]} rotation={leftShoulderSpring.rotation as any}>
          {/* Shoulder joint ball */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshStandardMaterial
              color={colors.accent}
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>

          {/* Upper arm cylinder */}
          <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
            <meshStandardMaterial
              color={colors.primary}
              metalness={0.1}
              roughness={0.4}
            />
          </mesh>

          {/* Forearm Group - rotates around elbow */}
          <animated.group position={[0, -0.35, 0]} rotation={leftElbowSpring.rotation as any}>
            {/* Elbow joint ball */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.09, 32, 32]} />
              <meshStandardMaterial
                color={colors.accent}
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>

            {/* Forearm cylinder */}
            <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
              <meshStandardMaterial
                color={colors.primary}
                metalness={0.2}
                roughness={0.5}
              />
            </mesh>

            {/* Hand - mitten shape */}
            <mesh position={[0, -0.45, 0]} castShadow receiveShadow scale={[1, 1.4, 0.8]}>
              <sphereGeometry args={[0.09, 32, 32]} />
              <meshStandardMaterial
                color={colors.accent}
                metalness={0.1}
                roughness={0.4}
              />
            </mesh>

            {/* Notebook - attached to left hand (ONLY for blue theme) */}
            {holdPen && colorTheme === "blue" && (
              <group position={[0, -0.5, 0.1]} rotation={[THREE.MathUtils.degToRad(-10), 0, THREE.MathUtils.degToRad(-20)]}>
                {/* Notebook cover - brown/leather color */}
                <mesh position={[0, 0, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.18, 0.25, 0.02]} />
                  <meshStandardMaterial
                    color="#8B4513"
                    metalness={0.1}
                    roughness={0.7}
                  />
                </mesh>

                {/* Notebook pages - white/cream */}
                <mesh position={[0, 0, 0.011]} castShadow>
                  <boxGeometry args={[0.16, 0.23, 0.015]} />
                  <meshStandardMaterial
                    color="#F5F5DC"
                    metalness={0}
                    roughness={0.9}
                  />
                </mesh>

                {/* Notebook spiral binding - silver */}
                {[...Array(8)].map((_, i) => (
                  <mesh key={i} position={[-0.08, 0.1 - i * 0.03, 0.02]} castShadow>
                    <torusGeometry args={[0.01, 0.003, 8, 16]} />
                    <meshStandardMaterial
                      color="#C0C0C0"
                      metalness={0.8}
                      roughness={0.2}
                    />
                  </mesh>
                ))}
              </group>
            )}
          </animated.group>
        </animated.group>
      </group>

      {/* Right Arm Group */}
      <group position={[0.5, 0, 0]}>
        {/* Upper Arm Group - rotates around shoulder */}
        <animated.group position={[0, -0.05, 0]} rotation={rightShoulderSpring.rotation as any}>
          {/* Shoulder joint ball */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshStandardMaterial
              color={colors.accent}
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>

          {/* Upper arm cylinder */}
          <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
            <meshStandardMaterial
              color={colors.primary}
              metalness={0.1}
              roughness={0.4}
            />
          </mesh>

          {/* Forearm Group - rotates around elbow */}
          <animated.group position={[0, -0.35, 0]} rotation={rightElbowSpring.rotation as any}>
            {/* Elbow joint ball */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.09, 32, 32]} />
              <meshStandardMaterial
                color={colors.accent}
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>

            {/* Forearm cylinder */}
            <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
              <meshStandardMaterial
                color={colors.primary}
                metalness={0.2}
                roughness={0.5}
              />
            </mesh>

            {/* Hand - mitten shape */}
            <mesh position={[0, -0.45, 0]} castShadow receiveShadow scale={[1, 1.4, 0.8]}>
              <sphereGeometry args={[0.09, 32, 32]} />
              <meshStandardMaterial
                color={colors.accent}
                metalness={0.1}
                roughness={0.4}
              />
            </mesh>

            {/* Pen - attached to right hand (ONLY for blue theme) */}
            {holdPen && colorTheme === "blue" && (
              <group position={[0, -0.5, 0]} rotation={[0, 0, THREE.MathUtils.degToRad(15)]}>
                {/* Pen body - blue cylinder */}
                <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.015, 0.015, 0.3, 16]} />
                  <meshStandardMaterial
                    color="#1E3A8A"
                    metalness={0.3}
                    roughness={0.5}
                  />
                </mesh>

                {/* Pen tip - black cone */}
                <mesh position={[0, -0.31, 0]} castShadow receiveShadow rotation={[Math.PI, 0, 0]}>
                  <coneGeometry args={[0.02, 0.04, 16]} />
                  <meshStandardMaterial
                    color="#000000"
                    metalness={0.8}
                    roughness={0.2}
                  />
                </mesh>

                {/* Pen cap - gold/yellow top */}
                <mesh position={[0, 0.01, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.02, 0.015, 0.04, 16]} />
                  <meshStandardMaterial
                    color="#F1C40F"
                    metalness={0.7}
                    roughness={0.3}
                  />
                </mesh>
              </group>
            )}
          </animated.group>
        </animated.group>
      </group>
    </>
  );
}

// Imago Robot Pelvis Component
function ImagoRobotPelvis({ colors }: { colors: ColorPalette }) {
  return (
    <>
      {/* Main Pelvis - rounded box shield shape matching body style */}
      <RoundedBox args={[0.8, 0.3, 0.4]} radius={0.15} smoothness={4} position={[0, -0.7, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color={colors.primary}
          metalness={0.1}
          roughness={0.4}
        />
      </RoundedBox>
    </>
  );
}

// Imago Robot Legs Component
function ImagoRobotLegs({
  leftHipRotation = { x: 0, y: 0, z: 0 },
  leftKneeRotation = { x: 0, y: 0, z: 0 },
  rightHipRotation = { x: 0, y: 0, z: 0 },
  rightKneeRotation = { x: 0, y: 0, z: 0 },
  colors
}: {
  leftHipRotation?: { x: number; y: number; z: number };
  leftKneeRotation?: { x: number; y: number; z: number };
  rightHipRotation?: { x: number; y: number; z: number };
  rightKneeRotation?: { x: number; y: number; z: number };
  colors: ColorPalette;
}) {
  return (
    <>
      {/* Left Leg Group */}
      <group position={[-0.15, -0.6, 0]}>
        {/* Upper Leg Group - rotates around hip */}
        <group position={[0, -0.25, 0]} rotation={[
          THREE.MathUtils.degToRad(leftHipRotation.x),
          THREE.MathUtils.degToRad(leftHipRotation.y),
          THREE.MathUtils.degToRad(leftHipRotation.z)
        ]}>
          {/* Hip joint ball */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial
              color={colors.accent}
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>

          {/* Upper leg/thigh cylinder */}
          <mesh position={[0, -0.25, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.4, 16]} />
            <meshStandardMaterial
              color={colors.primary}
              metalness={0.2}
              roughness={0.5}
            />
          </mesh>

          {/* Lower Leg Group - rotates around knee */}
          <group position={[0, -0.375, 0]} rotation={[
            THREE.MathUtils.degToRad(leftKneeRotation.x),
            THREE.MathUtils.degToRad(leftKneeRotation.y),
            THREE.MathUtils.degToRad(leftKneeRotation.z)
          ]}>
            {/* Knee joint ball */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.14, 32, 32]} />
              <meshStandardMaterial
                color={colors.accent}
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>

            {/* Lower leg cylinder - bell-bottomed */}
            <mesh position={[0, -0.25, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.12, 0.09, 0.45, 16]} />
              <meshStandardMaterial
                color={colors.primary}
                metalness={0.1}
                roughness={0.3}
              />
            </mesh>

            {/* Foot - boot shape */}
            <mesh position={[0, -0.525, 0.08]} castShadow receiveShadow scale={[1, 0.6, 1.2]}>
              <sphereGeometry args={[0.14, 32, 32]} />
              <meshStandardMaterial
                color={colors.accent}
                metalness={0.1}
                roughness={0.4}
              />
            </mesh>
          </group>
        </group>
      </group>

      {/* Right Leg Group */}
      <group position={[0.15, -0.6, 0]}>
        {/* Upper Leg Group - rotates around hip */}
        <group position={[0, -0.25, 0]} rotation={[
          THREE.MathUtils.degToRad(rightHipRotation.x),
          THREE.MathUtils.degToRad(rightHipRotation.y),
          THREE.MathUtils.degToRad(rightHipRotation.z)
        ]}>
          {/* Hip joint ball */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial
              color={colors.accent}
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>

          {/* Upper leg/thigh cylinder */}
          <mesh position={[0, -0.25, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.4, 16]} />
            <meshStandardMaterial
              color={colors.primary}
              metalness={0.2}
              roughness={0.5}
            />
          </mesh>

          {/* Lower Leg Group - rotates around knee */}
          <group position={[0, -0.375, 0]} rotation={[
            THREE.MathUtils.degToRad(rightKneeRotation.x),
            THREE.MathUtils.degToRad(rightKneeRotation.y),
            THREE.MathUtils.degToRad(rightKneeRotation.z)
          ]}>
            {/* Knee joint ball */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.14, 32, 32]} />
              <meshStandardMaterial
                color={colors.accent}
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>

            {/* Lower leg cylinder - bell-bottomed */}
            <mesh position={[0, -0.25, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.12, 0.09, 0.45, 16]} />
              <meshStandardMaterial
                color={colors.primary}
                metalness={0.1}
                roughness={0.3}
              />
            </mesh>

            {/* Foot - boot shape */}
            <mesh position={[0, -0.525, 0.08]} castShadow receiveShadow scale={[1, 0.6, 1.2]}>
              <sphereGeometry args={[0.14, 32, 32]} />
              <meshStandardMaterial
                color={colors.accent}
                metalness={0.1}
                roughness={0.4}
              />
            </mesh>
          </group>
        </group>
      </group>
    </>
  );
}

// Imago Robot Component
function ImagoRobot({
  headNeckRotation,
  headCenterRotation,
  leftShoulderRotation,
  leftElbowRotation,
  rightShoulderRotation,
  rightElbowRotation,
  leftHipRotation,
  leftKneeRotation,
  rightHipRotation,
  rightKneeRotation,
  smile,
  sad,
  crying,
  blink,
  smileIntensity,
  holdPen,
  colorTheme,
  colors
}: {
  headNeckRotation?: { x: number; y: number; z: number };
  headCenterRotation?: { x: number; y: number; z: number };
  leftShoulderRotation?: { x: number; y: number; z: number };
  leftElbowRotation?: { x: number; y: number; z: number };
  rightShoulderRotation?: { x: number; y: number; z: number };
  rightElbowRotation?: { x: number; y: number; z: number };
  leftHipRotation?: { x: number; y: number; z: number };
  leftKneeRotation?: { x: number; y: number; z: number };
  rightHipRotation?: { x: number; y: number; z: number };
  rightKneeRotation?: { x: number; y: number; z: number };
  smile?: boolean;
  sad?: boolean;
  crying?: boolean;
  blink?: boolean;
  smileIntensity?: number;
  holdPen?: boolean;
  colorTheme: ColorTheme;
  colors: ColorPalette;
}) {
  return (
    <group>
      <ImagoRobotNeck
        headNeckRotation={headNeckRotation}
        headCenterRotation={headCenterRotation}
        smile={smile}
        sad={sad}
        crying={crying}
        blink={blink}
        smileIntensity={smileIntensity}
        colors={colors}
      />
      <ImagoRobotTorso colors={colors} />
      <ImagoRobotArms
        leftShoulderRotation={leftShoulderRotation}
        leftElbowRotation={leftElbowRotation}
        rightShoulderRotation={rightShoulderRotation}
        rightElbowRotation={rightElbowRotation}
        holdPen={holdPen}
        colorTheme={colorTheme}
        colors={colors}
      />
      <ImagoRobotPelvis colors={colors} />
      <ImagoRobotLegs
        leftHipRotation={leftHipRotation}
        leftKneeRotation={leftKneeRotation}
        rightHipRotation={rightHipRotation}
        rightKneeRotation={rightKneeRotation}
        colors={colors}
      />
    </group>
  );
}

// Imago Robot Scene Component
function ImagoRobotScene({
  autoRotate,
  bodyRotation = 0,
  bodyPositionY = 0.5,
  bodyPositionZ = 0,
  headNeckRotation,
  headCenterRotation,
  leftShoulderRotation,
  leftElbowRotation,
  rightShoulderRotation,
  rightElbowRotation,
  leftHipRotation,
  leftKneeRotation,
  rightHipRotation,
  rightKneeRotation,
  smile,
  sad,
  crying,
  blink,
  smileIntensity,
  holdPen,
  colorTheme,
  colors,
  showGround = true
}: {
  autoRotate: boolean;
  bodyRotation?: number;
  bodyPositionY?: number;
  bodyPositionZ?: number;
  headNeckRotation?: { x: number; y: number; z: number };
  headCenterRotation?: { x: number; y: number; z: number };
  leftShoulderRotation?: { x: number; y: number; z: number };
  leftElbowRotation?: { x: number; y: number; z: number };
  rightShoulderRotation?: { x: number; y: number; z: number };
  rightElbowRotation?: { x: number; y: number; z: number };
  leftHipRotation?: { x: number; y: number; z: number };
  leftKneeRotation?: { x: number; y: number; z: number };
  rightHipRotation?: { x: number; y: number; z: number };
  rightKneeRotation?: { x: number; y: number; z: number };
  smile?: boolean;
  sad?: boolean;
  crying?: boolean;
  blink?: boolean;
  smileIntensity?: number;
  holdPen?: boolean;
  colorTheme: ColorTheme;
  colors: ColorPalette;
  showGround?: boolean;
}) {
  const bodyRotationSpring = useSpring({
    rotation: THREE.MathUtils.degToRad(bodyRotation),
    config: config.gentle
  });

  const bodyPositionSpring = useSpring({
    positionY: bodyPositionY,
    positionZ: bodyPositionZ,
    config: config.gentle
  });
  return (
    <>
      {/* Camera Setup */}
      <PerspectiveCamera
        makeDefault
        position={[0, 2, 8]}
        fov={45}
        near={0.1}
        far={1000}
      />

      {/* Lighting Setup */}
      {/* Ambient Light */}
      <ambientLight intensity={0.5} color="#ffffff" />

      {/* Directional Light */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.0}
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

      {/* Point Light - front left */}
      <pointLight
        position={[-3, 3, 5]}
        intensity={0.4}
        color="#a8d8ff"
        distance={15}
      />

      {/* Point Light - right */}
      <pointLight
        position={[4, 2, 3]}
        intensity={0.3}
        color="#ffd4a8"
        distance={12}
      />

      {/* OrbitControls */}
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

      {/* Imago Robot */}
      <animated.group position-y={bodyPositionSpring.positionY as any} position-z={bodyPositionSpring.positionZ as any} rotation-y={bodyRotationSpring.rotation as any}>
        <ImagoRobot
          headNeckRotation={headNeckRotation}
          headCenterRotation={headCenterRotation}
          leftShoulderRotation={leftShoulderRotation}
          leftElbowRotation={leftElbowRotation}
          rightShoulderRotation={rightShoulderRotation}
          rightElbowRotation={rightElbowRotation}
          leftHipRotation={leftHipRotation}
          leftKneeRotation={leftKneeRotation}
          rightHipRotation={rightHipRotation}
          rightKneeRotation={rightKneeRotation}
          smile={smile}
          sad={sad}
          crying={crying}
          blink={blink}
          smileIntensity={smileIntensity}
          holdPen={holdPen}
          colorTheme={colorTheme}
          colors={colors}
        />
      </animated.group>

      {/* Ground plane - optional */}
      {showGround && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#e8e8e8" />
        </mesh>
      )}
    </>
  );
}

export default function ImagoRobot3D({
  size = 400,
  autoRotate = false,
  smile = false,
  sad = false,
  crying = false,
  blink = false,
  smileIntensity = 1,
  colorTheme = "blue",
  transparent = false,
  bodyRotation = 0,
  bodyPositionY = 0.5,
  bodyPositionZ = 0,
  headNeckRotation,
  headCenterRotation,
  leftShoulderRotation,
  leftElbowRotation,
  rightShoulderRotation,
  rightElbowRotation,
  leftHipRotation,
  leftKneeRotation,
  rightHipRotation,
  rightKneeRotation,
  holdPen = false
}: ImagoRobot3DProps) {
  const colors = COLOR_THEMES[colorTheme];

  return (
    <div style={{ width: size, height: size, borderRadius: transparent ? 0 : 8, overflow: "hidden" }}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: transparent,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
        style={{ background: transparent ? "transparent" : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}
      >
        <ImagoRobotScene
          autoRotate={autoRotate}
          bodyRotation={bodyRotation}
          bodyPositionY={bodyPositionY}
          bodyPositionZ={bodyPositionZ}
          headNeckRotation={headNeckRotation}
          headCenterRotation={headCenterRotation}
          leftShoulderRotation={leftShoulderRotation}
          leftElbowRotation={leftElbowRotation}
          rightShoulderRotation={rightShoulderRotation}
          rightElbowRotation={rightElbowRotation}
          leftHipRotation={leftHipRotation}
          leftKneeRotation={leftKneeRotation}
          rightHipRotation={rightHipRotation}
          rightKneeRotation={rightKneeRotation}
          smile={smile}
          sad={sad}
          crying={crying}
          blink={blink}
          smileIntensity={smileIntensity}
          holdPen={holdPen}
          colorTheme={colorTheme}
          colors={colors}
          showGround={!transparent}
        />
      </Canvas>
    </div>
  );
}
