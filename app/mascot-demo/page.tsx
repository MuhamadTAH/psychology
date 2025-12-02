"use client";
import React, { useState } from "react";
import RobotMascot, { Subject, Mood } from "@/components/RobotMascot";
import RobotHead from "@/components/RobotHead";
import BabyRobot from "@/components/BabyRobot";
import Robot3D, { Robot3DMood } from "@/components/Robot3D";
import ShortRobot3D from "@/components/ShortRobot3D";
import Robot3DSide from "@/components/Robot3DSide";
import Robot3DRotatable from "@/components/Robot3DRotatable";
import Robot3DThree from "@/components/Robot3DThree";
import ImagoRobot3D from "@/components/ImagoRobot3D";

export default function MascotDemo() {
  const [subject, setSubject] = useState<Subject>("default");
  const [mood, setMood] = useState<Mood>("idle");
  const [blink, setBlink] = useState(false);
  const [robot3DMood, setRobot3DMood] = useState<Robot3DMood>("neutral");
  const [wave, setWave] = useState(false);
  const [animatedHappy, setAnimatedHappy] = useState(false);
  const [shortRobotMood, setShortRobotMood] = useState<Robot3DMood>("neutral");
  const [shortRobotBlink, setShortRobotBlink] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [smile, setSmile] = useState(false);
  const [sad, setSad] = useState(false);
  const [crying, setCrying] = useState(false);
  const [imagoBlink, setImagoBlink] = useState(false);
  const [smileIntensity, setSmileIntensity] = useState(0);
  const [headNeckRotation, setHeadNeckRotation] = useState({ x: 0, y: 0, z: 0 });
  const [headCenterRotation, setHeadCenterRotation] = useState({ x: 0, y: 0, z: 0 });
  const [leftShoulderRotation, setLeftShoulderRotation] = useState({ x: 0, y: 0, z: 0 });
  const [leftElbowRotation, setLeftElbowRotation] = useState({ x: 0, y: 0, z: 0 });
  const [rightShoulderRotation, setRightShoulderRotation] = useState({ x: 0, y: 0, z: 0 });
  const [rightElbowRotation, setRightElbowRotation] = useState({ x: 0, y: 0, z: 0 });
  const [leftHipRotation, setLeftHipRotation] = useState({ x: 0, y: 0, z: 0 });
  const [leftKneeRotation, setLeftKneeRotation] = useState({ x: 0, y: 0, z: 0 });
  const [rightHipRotation, setRightHipRotation] = useState({ x: 0, y: 0, z: 0 });
  const [rightKneeRotation, setRightKneeRotation] = useState({ x: 0, y: 0, z: 0 });
  const [bodyRotation, setBodyRotation] = useState(0);
  const [bodyPositionY, setBodyPositionY] = useState(0.5);
  const [bodyPositionZ, setBodyPositionZ] = useState(0);
  const [colorTheme, setColorTheme] = useState<"blue" | "green" | "orange">("blue");
  const [holdPen, setHoldPen] = useState(false);

  const startImagoStep = () => {
    // Phase one
    setRightKneeRotation({ x: 19, y: 0, z: 0 });
    setLeftKneeRotation({ x: 0, y: 0, z: 0 });
    setLeftShoulderRotation({ x: -10, y: 0, z: 0 });
    setRightShoulderRotation({ x: 0, y: 0, z: 0 });

    // Phase two
    setTimeout(() => {
      setRightKneeRotation({ x: 0, y: 0, z: 0 });
      setLeftKneeRotation({ x: 19, y: 0, z: 0 });
      setLeftShoulderRotation({ x: 0, y: 0, z: 0 });
      setRightShoulderRotation({ x: -10, y: 0, z: 0 });
    }, 400);

    // Return to neutral
    setTimeout(() => {
      setRightKneeRotation({ x: 0, y: 0, z: 0 });
      setLeftKneeRotation({ x: 0, y: 0, z: 0 });
      setLeftShoulderRotation({ x: 0, y: 0, z: 0 });
      setRightShoulderRotation({ x: 0, y: 0, z: 0 });
    }, 800);
  };

  const startImagoWalk = () => {
    const currentZ = bodyPositionZ;

    // Phase 1 - Move forward 0.5 units
    setRightKneeRotation({ x: 19, y: 0, z: 0 });
    setLeftKneeRotation({ x: 0, y: 0, z: 0 });
    setLeftShoulderRotation({ x: -10, y: 0, z: 0 });
    setRightShoulderRotation({ x: 0, y: 0, z: 0 });
    setBodyPositionZ(currentZ + 0.5);

    // Phase 2 - Move forward another 0.5 units
    setTimeout(() => {
      setRightKneeRotation({ x: 0, y: 0, z: 0 });
      setLeftKneeRotation({ x: 19, y: 0, z: 0 });
      setLeftShoulderRotation({ x: 0, y: 0, z: 0 });
      setRightShoulderRotation({ x: -10, y: 0, z: 0 });
      setBodyPositionZ(currentZ + 1);
    }, 500);

    // Return to neutral (legs and arms)
    setTimeout(() => {
      setRightKneeRotation({ x: 0, y: 0, z: 0 });
      setLeftKneeRotation({ x: 0, y: 0, z: 0 });
      setLeftShoulderRotation({ x: 0, y: 0, z: 0 });
      setRightShoulderRotation({ x: 0, y: 0, z: 0 });
    }, 1000);
  };

  const startImagoJump = () => {
    // Jump up
    setBodyPositionY(2.5);

    // Come back down
    setTimeout(() => {
      setBodyPositionY(0.5);
    }, 800);
  };

  const startImagoSpin = () => {
    // Rotate 360 degrees
    setBodyRotation(360);

    // Reset to 0 after animation completes
    setTimeout(() => {
      setBodyRotation(0);
    }, 2000);
  };

  const startImagoWave = () => {
    // Enable smile and start from 0 intensity
    setSmile(true);
    setSad(false);
    setCrying(false);
    setSmileIntensity(0);

    // Step 1: Raise arm - Shoulder Z = 90°, Elbow = 40°
    // Animate smile intensity from 0 to 1 as shoulder goes from 0 to 90
    setRightShoulderRotation({ x: 0, y: 0, z: 90 });
    setRightElbowRotation({ x: 0, y: 0, z: 40 });

    // Gradually increase smile intensity (0 to 1 over 300ms)
    let currentIntensity = 0;
    const intensityInterval = setInterval(() => {
      currentIntensity += 0.1;
      if (currentIntensity >= 1) {
        currentIntensity = 1;
        clearInterval(intensityInterval);
      }
      setSmileIntensity(currentIntensity);
    }, 30);

    // Step 2: Wave 3 times (elbow 40° -> 107° -> 40°) - starts immediately after raise
    // First wave
    setTimeout(() => {
      setRightElbowRotation({ x: 0, y: 0, z: 107 });
    }, 300);
    setTimeout(() => {
      setRightElbowRotation({ x: 0, y: 0, z: 40 });
    }, 700);

    // Second wave
    setTimeout(() => {
      setRightElbowRotation({ x: 0, y: 0, z: 107 });
    }, 1100);
    setTimeout(() => {
      setRightElbowRotation({ x: 0, y: 0, z: 40 });
    }, 1500);

    // Third wave
    setTimeout(() => {
      setRightElbowRotation({ x: 0, y: 0, z: 107 });
    }, 1900);
    setTimeout(() => {
      setRightElbowRotation({ x: 0, y: 0, z: 40 });
    }, 2300);

    // Return to neutral position and remove smile
    setTimeout(() => {
      setRightShoulderRotation({ x: 0, y: 0, z: 0 });
      setRightElbowRotation({ x: 0, y: 0, z: 0 });
      setSmile(false);
      setSmileIntensity(0);
    }, 2800);
  };

  const startHappyWave = () => {
    // Start wave and animated happy transition
    setWave(true);
    setAnimatedHappy(true);

    // First blink at 25% (1 second into 4s animation)
    setTimeout(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200); // Blink for 200ms
    }, 1000);

    // Second blink at 75% (3 seconds into 4s animation)
    setTimeout(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200); // Blink for 200ms
    }, 3000);

    // Stop wave at end (4 seconds)
    setTimeout(() => {
      setWave(false);
      setAnimatedHappy(false);
      setRobot3DMood("neutral");
    }, 4000);
  };

  const startWritingAnimation = () => {
    // Enable pen and notebook
    setHoldPen(true);

    // Move to writing position based on plan.md
    // Neck Rotation X 32 deg
    setHeadNeckRotation({ x: 32, y: 0, z: 0 });

    // Left Arm: Shoulder Y 38, Elbow X -82
    setLeftShoulderRotation({ x: 0, y: 38, z: 0 });
    setLeftElbowRotation({ x: -82, y: 0, z: 0 });

    // Right arm: Shoulder X -4 Y -58, Elbow X -97 Y -4
    setRightShoulderRotation({ x: -4, y: -58, z: 0 });
    setRightElbowRotation({ x: -97, y: -4, z: 0 });

    // Simulate writing motion - small elbow movements
    let writeCount = 0;
    const writeInterval = setInterval(() => {
      if (writeCount % 2 === 0) {
        setRightElbowRotation({ x: -95, y: -4, z: 0 });
      } else {
        setRightElbowRotation({ x: -97, y: -4, z: 0 });
      }
      writeCount++;

      if (writeCount >= 10) {
        clearInterval(writeInterval);
        // Return to neutral after 5 seconds total
        setTimeout(() => {
          setHeadNeckRotation({ x: 0, y: 0, z: 0 });
          setLeftShoulderRotation({ x: 0, y: 0, z: 0 });
          setLeftElbowRotation({ x: 0, y: 0, z: 0 });
          setRightShoulderRotation({ x: 0, y: 0, z: 0 });
          setRightElbowRotation({ x: 0, y: 0, z: 0 });
          setHoldPen(false);
        }, 1000);
      }
    }, 300);
  };

  const startThinkingMode = () => {
    // Thinking pose - hand on chin
    // Right arm raised to chin level
    setRightShoulderRotation({ x: 0, y: 0, z: 90 });
    setRightElbowRotation({ x: 0, y: 0, z: 90 });

    // Head tilted slightly
    setHeadNeckRotation({ x: 15, y: 0, z: 0 });

    // Subtle head movement - thinking motion
    let thinkCount = 0;
    const thinkInterval = setInterval(() => {
      if (thinkCount % 2 === 0) {
        setHeadNeckRotation({ x: 15, y: 5, z: 0 });
      } else {
        setHeadNeckRotation({ x: 15, y: -5, z: 0 });
      }
      thinkCount++;

      if (thinkCount >= 8) {
        clearInterval(thinkInterval);
        // Return to neutral
        setTimeout(() => {
          setHeadNeckRotation({ x: 0, y: 0, z: 0 });
          setRightShoulderRotation({ x: 0, y: 0, z: 0 });
          setRightElbowRotation({ x: 0, y: 0, z: 0 });
        }, 500);
      }
    }, 500);
  };

  return (
    <div style={{ padding: 24, minHeight: "100vh", background: "#f0f2f5" }}>
      <h2 style={{ marginBottom: 24, fontSize: 28, fontWeight: "bold" }}>Mascot Demo</h2>

      {/* Imago Robot - NEW */}
      <div style={{ marginBottom: 48 }}>
        <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: "bold" }}>Imago Robot 3D (Building from imago.png)</h3>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          <ImagoRobot3D
            size={400}
            autoRotate={autoRotate}
            smile={smile}
            sad={sad}
            crying={crying}
            blink={imagoBlink}
            smileIntensity={smileIntensity}
            bodyRotation={bodyRotation}
            bodyPositionY={bodyPositionY}
            bodyPositionZ={bodyPositionZ}
            colorTheme={colorTheme}
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
            holdPen={holdPen}
          />
          <div>
            <p style={{ marginBottom: 12, fontSize: 14, color: "#666" }}>
              <strong>New robot based on imago.png design</strong><br />
              Dual rotation system: Neck pivot + Head center
            </p>

            {/* Emotion Buttons */}
            <div style={{ marginBottom: 16, padding: 12, background: "#dcfce7", borderRadius: 8 }}>
              <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: "bold" }}>Expressions</h4>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <button
                  onClick={() => {
                    setSmile(true);
                    setSad(false);
                    setCrying(false);
                  }}
                  style={{ padding: "8px 16px", fontSize: 14, borderRadius: 6, background: smile ? "#16a34a" : "#6b7280", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", flex: 1 }}
                >
                  😊 Smile
                </button>
                <button
                  onClick={() => {
                    setSad(true);
                    setSmile(false);
                    setCrying(false);
                  }}
                  style={{ padding: "8px 16px", fontSize: 14, borderRadius: 6, background: sad ? "#dc2626" : "#6b7280", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", flex: 1 }}
                >
                  😢 Sad
                </button>
                <button
                  onClick={() => {
                    setCrying(true);
                    setSmile(false);
                    setSad(false);
                  }}
                  style={{ padding: "8px 16px", fontSize: 14, borderRadius: 6, background: crying ? "#06b6d4" : "#6b7280", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", flex: 1 }}
                >
                  😭 Crying
                </button>
              </div>
              <button
                onClick={() => {
                  setSmile(false);
                  setSad(false);
                  setCrying(false);
                }}
                style={{ padding: "8px 16px", fontSize: 14, borderRadius: 6, background: (!smile && !sad && !crying) ? "#3b82f6" : "#6b7280", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", width: "100%", marginBottom: 8 }}
              >
                😐 Neutral
              </button>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <button
                  onClick={() => setImagoBlink(!imagoBlink)}
                  style={{ padding: "8px 16px", fontSize: 14, borderRadius: 6, background: imagoBlink ? "#f59e0b" : "#3b82f6", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", flex: 1 }}
                >
                  {imagoBlink ? "👁️ Open Eyes" : "😑 Blink"}
                </button>
                <button
                  onClick={startImagoWave}
                  style={{ padding: "8px 16px", fontSize: 14, borderRadius: 6, background: "#8b5cf6", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", flex: 1 }}
                >
                  👋 Wave Hello
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <button
                  onClick={startImagoSpin}
                  style={{ padding: "8px 16px", fontSize: 14, borderRadius: 6, background: "#10b981", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", flex: 1 }}
                >
                  🔄 Spin 360°
                </button>
                <button
                  onClick={startImagoJump}
                  style={{ padding: "8px 16px", fontSize: 14, borderRadius: 6, background: "#f59e0b", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", flex: 1 }}
                >
                  ⬆️ Jump Up
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <button
                  onClick={startWritingAnimation}
                  style={{ padding: "8px 16px", fontSize: 14, borderRadius: 6, background: "#3b82f6", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", flex: 1 }}
                >
                  ✍️ Start Writing
                </button>
                <button
                  onClick={startThinkingMode}
                  style={{ padding: "8px 16px", fontSize: 14, borderRadius: 6, background: "#8b5cf6", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", flex: 1 }}
                >
                  🤔 Think Mode
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <button
                  onClick={() => setColorTheme("blue")}
                  style={{ padding: "8px 16px", fontSize: 14, borderRadius: 6, background: colorTheme === "blue" ? "#4A90E2" : "#6b7280", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", flex: 1 }}
                >
                  🔵 Blue
                </button>
                <button
                  onClick={() => setColorTheme("green")}
                  style={{ padding: "8px 16px", fontSize: 14, borderRadius: 6, background: colorTheme === "green" ? "#2ECC71" : "#6b7280", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", flex: 1 }}
                >
                  🟢 Green
                </button>
                <button
                  onClick={() => setColorTheme("orange")}
                  style={{ padding: "8px 16px", fontSize: 14, borderRadius: 6, background: colorTheme === "orange" ? "#F39C12" : "#6b7280", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", flex: 1 }}
                >
                  🟠 Orange
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <button
                  onClick={startImagoWalk}
                  style={{ padding: "8px 16px", fontSize: 14, borderRadius: 6, background: "#8b5cf6", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", flex: 1 }}
                >
                  🚶 Walk Step
                </button>
                <button
                  onClick={() => setHoldPen(!holdPen)}
                  style={{ padding: "8px 16px", fontSize: 14, borderRadius: 6, background: holdPen ? "#10b981" : "#6b7280", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", flex: 1 }}
                >
                  {holdPen ? "✏️ Drop Pen" : "✏️ Hold Pen"}
                </button>
              </div>
            </div>

            {/* Neck Rotation Controls */}
            <div style={{ marginBottom: 16, padding: 12, background: "#e0f2fe", borderRadius: 8 }}>
              <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: "bold" }}>Neck Rotation (around neck top)</h4>
              <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                <label style={{ fontSize: 12, fontWeight: "bold", width: 60 }}>X (pitch):</label>
                <input
                  type="number"
                  value={headNeckRotation.x}
                  onChange={(e) => setHeadNeckRotation({ ...headNeckRotation, x: Number(e.target.value) })}
                  style={{ width: 80, padding: "4px 8px", fontSize: 14, borderRadius: 4, border: "1px solid #ccc" }}
                />
                <span style={{ fontSize: 12, color: "#666" }}>degrees</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                <label style={{ fontSize: 12, fontWeight: "bold", width: 60 }}>Y (yaw):</label>
                <input
                  type="number"
                  value={headNeckRotation.y}
                  onChange={(e) => setHeadNeckRotation({ ...headNeckRotation, y: Number(e.target.value) })}
                  style={{ width: 80, padding: "4px 8px", fontSize: 14, borderRadius: 4, border: "1px solid #ccc" }}
                />
                <span style={{ fontSize: 12, color: "#666" }}>degrees</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: "bold", width: 60 }}>Z (roll):</label>
                <input
                  type="number"
                  value={headNeckRotation.z}
                  onChange={(e) => setHeadNeckRotation({ ...headNeckRotation, z: Number(e.target.value) })}
                  style={{ width: 80, padding: "4px 8px", fontSize: 14, borderRadius: 4, border: "1px solid #ccc" }}
                />
                <span style={{ fontSize: 12, color: "#666" }}>degrees</span>
              </div>
              <button
                onClick={() => setHeadNeckRotation({ x: 0, y: 0, z: 0 })}
                style={{ marginTop: 8, padding: "4px 12px", fontSize: 12, borderRadius: 4, background: "#3b82f6", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
              >
                Reset Neck
              </button>
            </div>

            {/* Head Center Rotation Controls */}
            <div style={{ marginBottom: 16, padding: 12, background: "#fef3c7", borderRadius: 8 }}>
              <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: "bold" }}>Head Center Rotation (around head center)</h4>
              <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                <label style={{ fontSize: 12, fontWeight: "bold", width: 60 }}>X (pitch):</label>
                <input
                  type="number"
                  value={headCenterRotation.x}
                  onChange={(e) => setHeadCenterRotation({ ...headCenterRotation, x: Number(e.target.value) })}
                  style={{ width: 80, padding: "4px 8px", fontSize: 14, borderRadius: 4, border: "1px solid #ccc" }}
                />
                <span style={{ fontSize: 12, color: "#666" }}>degrees</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                <label style={{ fontSize: 12, fontWeight: "bold", width: 60 }}>Y (yaw):</label>
                <input
                  type="number"
                  value={headCenterRotation.y}
                  onChange={(e) => setHeadCenterRotation({ ...headCenterRotation, y: Number(e.target.value) })}
                  style={{ width: 80, padding: "4px 8px", fontSize: 14, borderRadius: 4, border: "1px solid #ccc" }}
                />
                <span style={{ fontSize: 12, color: "#666" }}>degrees</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: "bold", width: 60 }}>Z (roll):</label>
                <input
                  type="number"
                  value={headCenterRotation.z}
                  onChange={(e) => setHeadCenterRotation({ ...headCenterRotation, z: Number(e.target.value) })}
                  style={{ width: 80, padding: "4px 8px", fontSize: 14, borderRadius: 4, border: "1px solid #ccc" }}
                />
                <span style={{ fontSize: 12, color: "#666" }}>degrees</span>
              </div>
              <button
                onClick={() => setHeadCenterRotation({ x: 0, y: 0, z: 0 })}
                style={{ marginTop: 8, padding: "4px 12px", fontSize: 12, borderRadius: 4, background: "#f59e0b", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
              >
                Reset Head
              </button>
            </div>

            {/* Left Arm Controls */}
            <div style={{ marginBottom: 16, padding: 12, background: "#dbeafe", borderRadius: 8 }}>
              <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: "bold" }}>Left Arm</h4>
              <p style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>Shoulder:</p>
              <div style={{ display: "flex", gap: 4, marginBottom: 4, fontSize: 11 }}>
                <input type="number" value={leftShoulderRotation.x} onChange={(e) => setLeftShoulderRotation({ ...leftShoulderRotation, x: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="X" />
                <input type="number" value={leftShoulderRotation.y} onChange={(e) => setLeftShoulderRotation({ ...leftShoulderRotation, y: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="Y" />
                <input type="number" value={leftShoulderRotation.z} onChange={(e) => setLeftShoulderRotation({ ...leftShoulderRotation, z: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="Z" />
              </div>
              <p style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>Elbow:</p>
              <div style={{ display: "flex", gap: 4, marginBottom: 4, fontSize: 11 }}>
                <input type="number" value={leftElbowRotation.x} onChange={(e) => setLeftElbowRotation({ ...leftElbowRotation, x: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="X" />
                <input type="number" value={leftElbowRotation.y} onChange={(e) => setLeftElbowRotation({ ...leftElbowRotation, y: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="Y" />
                <input type="number" value={leftElbowRotation.z} onChange={(e) => setLeftElbowRotation({ ...leftElbowRotation, z: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="Z" />
              </div>
            </div>

            {/* Right Arm Controls */}
            <div style={{ marginBottom: 16, padding: 12, background: "#dbeafe", borderRadius: 8 }}>
              <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: "bold" }}>Right Arm</h4>
              <p style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>Shoulder:</p>
              <div style={{ display: "flex", gap: 4, marginBottom: 4, fontSize: 11 }}>
                <input type="number" value={rightShoulderRotation.x} onChange={(e) => setRightShoulderRotation({ ...rightShoulderRotation, x: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="X" />
                <input type="number" value={rightShoulderRotation.y} onChange={(e) => setRightShoulderRotation({ ...rightShoulderRotation, y: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="Y" />
                <input type="number" value={rightShoulderRotation.z} onChange={(e) => setRightShoulderRotation({ ...rightShoulderRotation, z: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="Z" />
              </div>
              <p style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>Elbow:</p>
              <div style={{ display: "flex", gap: 4, marginBottom: 4, fontSize: 11 }}>
                <input type="number" value={rightElbowRotation.x} onChange={(e) => setRightElbowRotation({ ...rightElbowRotation, x: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="X" />
                <input type="number" value={rightElbowRotation.y} onChange={(e) => setRightElbowRotation({ ...rightElbowRotation, y: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="Y" />
                <input type="number" value={rightElbowRotation.z} onChange={(e) => setRightElbowRotation({ ...rightElbowRotation, z: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="Z" />
              </div>
            </div>

            {/* Left Leg Controls */}
            <div style={{ marginBottom: 16, padding: 12, background: "#fef9c3", borderRadius: 8 }}>
              <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: "bold" }}>Left Leg</h4>
              <p style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>Hip:</p>
              <div style={{ display: "flex", gap: 4, marginBottom: 4, fontSize: 11 }}>
                <input type="number" value={leftHipRotation.x} onChange={(e) => setLeftHipRotation({ ...leftHipRotation, x: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="X" />
                <input type="number" value={leftHipRotation.y} onChange={(e) => setLeftHipRotation({ ...leftHipRotation, y: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="Y" />
                <input type="number" value={leftHipRotation.z} onChange={(e) => setLeftHipRotation({ ...leftHipRotation, z: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="Z" />
              </div>
              <p style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>Knee:</p>
              <div style={{ display: "flex", gap: 4, marginBottom: 4, fontSize: 11 }}>
                <input type="number" value={leftKneeRotation.x} onChange={(e) => setLeftKneeRotation({ ...leftKneeRotation, x: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="X" />
                <input type="number" value={leftKneeRotation.y} onChange={(e) => setLeftKneeRotation({ ...leftKneeRotation, y: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="Y" />
                <input type="number" value={leftKneeRotation.z} onChange={(e) => setLeftKneeRotation({ ...leftKneeRotation, z: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="Z" />
              </div>
            </div>

            {/* Right Leg Controls */}
            <div style={{ marginBottom: 16, padding: 12, background: "#fef9c3", borderRadius: 8 }}>
              <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: "bold" }}>Right Leg</h4>
              <p style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>Hip:</p>
              <div style={{ display: "flex", gap: 4, marginBottom: 4, fontSize: 11 }}>
                <input type="number" value={rightHipRotation.x} onChange={(e) => setRightHipRotation({ ...rightHipRotation, x: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="X" />
                <input type="number" value={rightHipRotation.y} onChange={(e) => setRightHipRotation({ ...rightHipRotation, y: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="Y" />
                <input type="number" value={rightHipRotation.z} onChange={(e) => setRightHipRotation({ ...rightHipRotation, z: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="Z" />
              </div>
              <p style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>Knee:</p>
              <div style={{ display: "flex", gap: 4, marginBottom: 4, fontSize: 11 }}>
                <input type="number" value={rightKneeRotation.x} onChange={(e) => setRightKneeRotation({ ...rightKneeRotation, x: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="X" />
                <input type="number" value={rightKneeRotation.y} onChange={(e) => setRightKneeRotation({ ...rightKneeRotation, y: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="Y" />
                <input type="number" value={rightKneeRotation.z} onChange={(e) => setRightKneeRotation({ ...rightKneeRotation, z: Number(e.target.value) })} style={{ width: 50, padding: "2px 4px", fontSize: 11, borderRadius: 4, border: "1px solid #ccc" }} placeholder="Z" />
              </div>
            </div>

            {/* Reset All Button */}
            <div style={{ padding: 12, background: "#f3f4f6", borderRadius: 8 }}>
              <button
                onClick={() => {
                  setHeadNeckRotation({ x: 0, y: 0, z: 0 });
                  setHeadCenterRotation({ x: 0, y: 0, z: 0 });
                  setLeftShoulderRotation({ x: 0, y: 0, z: 0 });
                  setLeftElbowRotation({ x: 0, y: 0, z: 0 });
                  setRightShoulderRotation({ x: 0, y: 0, z: 0 });
                  setRightElbowRotation({ x: 0, y: 0, z: 0 });
                  setLeftHipRotation({ x: 0, y: 0, z: 0 });
                  setLeftKneeRotation({ x: 0, y: 0, z: 0 });
                  setRightHipRotation({ x: 0, y: 0, z: 0 });
                  setRightKneeRotation({ x: 0, y: 0, z: 0 });
                }}
                style={{ padding: "6px 16px", fontSize: 13, borderRadius: 4, background: "#dc2626", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", width: "100%" }}
              >
                Reset All Rotations
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr style={{ margin: "32px 0", border: "1px solid #ccc" }} />

      {/* Real 3D Robot with Three.js */}
      <div style={{ marginBottom: 48 }}>
        <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: "bold" }}>Real 3D Robot (Three.js) - Head Complete ✅</h3>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          <Robot3DThree size={400} autoRotate={autoRotate} />
          <div>
            <p style={{ marginBottom: 12, fontSize: 14, color: "#666" }}>
              <strong>Controls:</strong><br />
              • Left-click + drag to rotate<br />
              • Scroll to zoom<br />
              • Right-click + drag disabled
            </p>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={autoRotate}
                  onChange={(e) => setAutoRotate(e.target.checked)}
                  style={{ marginRight: 8, cursor: "pointer", width: 18, height: 18 }}
                />
                <span style={{ fontWeight: "bold" }}>Auto Rotate</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <hr style={{ margin: "32px 0", border: "1px solid #ccc" }} />

      {/* Robot Head Only */}
      <div style={{ marginBottom: 48 }}>
        <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: "bold" }}>Full Robot (from imago.png)</h3>
        <RobotHead size={200} />
      </div>

      <hr style={{ margin: "32px 0", border: "1px solid #ccc" }} />

      {/* Baby Robot */}
      <div style={{ marginBottom: 48 }}>
        <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: "bold" }}>Baby Robot</h3>
        <BabyRobot size={200} />
      </div>

      <hr style={{ margin: "32px 0", border: "1px solid #ccc" }} />

      {/* 3D Style Robot */}
      <div style={{ marginBottom: 48 }}>
        <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: "bold" }}>3D Style Robot</h3>
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <Robot3D size={200} blink={blink} mood={robot3DMood} wave={wave} animatedHappy={animatedHappy} />
          <div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontWeight: "bold", marginRight: 8 }}>Mood: </label>
              <button
                onClick={() => setRobot3DMood("neutral")}
                style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: robot3DMood === "neutral" ? "#3b82f6" : "#9ca3af", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", marginRight: 8 }}
              >
                Neutral
              </button>
              <button
                onClick={() => setRobot3DMood("happy")}
                style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: robot3DMood === "happy" ? "#16a34a" : "#9ca3af", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", marginRight: 8 }}
              >
                Happy
              </button>
              <button
                onClick={() => setRobot3DMood("sad")}
                style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: robot3DMood === "sad" ? "#dc2626" : "#9ca3af", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", marginRight: 8 }}
              >
                Sad
              </button>
              <button
                onClick={() => setRobot3DMood("surprised")}
                style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: robot3DMood === "surprised" ? "#f59e0b" : "#9ca3af", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", marginRight: 8 }}
              >
                Surprised
              </button>
              <button
                onClick={() => setRobot3DMood("begging")}
                style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: robot3DMood === "begging" ? "#a855f7" : "#9ca3af", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", marginRight: 8 }}
              >
                Begging
              </button>
              <button
                onClick={() => setRobot3DMood("crying")}
                style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: robot3DMood === "crying" ? "#06b6d4" : "#9ca3af", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
              >
                Crying
              </button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <button
                onClick={() => setBlink(!blink)}
                style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: "#3b82f6", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", marginRight: 8 }}
              >
                {blink ? "Open Eyes" : "Blink"}
              </button>
              <button
                onClick={() => setWave(!wave)}
                style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: "#8b5cf6", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
              >
                {wave ? "Stop Wave" : "Wave Hello"}
              </button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <button
                onClick={startHappyWave}
                style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: "#10b981", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
              >
                Happy Wave + Blinks
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr style={{ margin: "32px 0", border: "1px solid #ccc" }} />

      {/* 3D Robot Rotatable (0° to 45°) */}
      <div style={{ marginBottom: 48 }}>
        <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: "bold" }}>3D Robot - Rotatable (0° to 45°)</h3>
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <Robot3DRotatable size={200} rotation={rotation} />
          <div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontWeight: "bold", marginRight: 8, display: "block", marginBottom: 8 }}>
                Rotation: {rotation}°
              </label>
              <input
                type="range"
                min="0"
                max="45"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                style={{ width: "300px", cursor: "pointer" }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <button
                onClick={() => setRotation(0)}
                style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: "#3b82f6", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", marginRight: 8 }}
              >
                Front (0°)
              </button>
              <button
                onClick={() => setRotation(45)}
                style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: "#16a34a", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
              >
                3/4 View (45°)
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr style={{ margin: "32px 0", border: "1px solid #ccc" }} />

      {/* 3D Robot Side View (90°) */}
      <div style={{ marginBottom: 48 }}>
        <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: "bold" }}>3D Robot - Side View (90°)</h3>
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <Robot3DSide size={200} />
        </div>
      </div>

      <hr style={{ margin: "32px 0", border: "1px solid #ccc" }} />

      {/* Short 3D Style Robot */}
      <div style={{ marginBottom: 48 }}>
        <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: "bold" }}>Short 3D Style Robot</h3>
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <ShortRobot3D size={200} blink={shortRobotBlink} mood={shortRobotMood} />
          <div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontWeight: "bold", marginRight: 8 }}>Mood: </label>
              <button
                onClick={() => setShortRobotMood("neutral")}
                style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: shortRobotMood === "neutral" ? "#3b82f6" : "#9ca3af", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", marginRight: 8 }}
              >
                Neutral
              </button>
              <button
                onClick={() => setShortRobotMood("happy")}
                style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: shortRobotMood === "happy" ? "#16a34a" : "#9ca3af", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", marginRight: 8 }}
              >
                Happy
              </button>
              <button
                onClick={() => setShortRobotMood("sad")}
                style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: shortRobotMood === "sad" ? "#dc2626" : "#9ca3af", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", marginRight: 8 }}
              >
                Sad
              </button>
              <button
                onClick={() => setShortRobotMood("surprised")}
                style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: shortRobotMood === "surprised" ? "#f59e0b" : "#9ca3af", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", marginRight: 8 }}
              >
                Surprised
              </button>
              <button
                onClick={() => setShortRobotMood("begging")}
                style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: shortRobotMood === "begging" ? "#a855f7" : "#9ca3af", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", marginRight: 8 }}
              >
                Begging
              </button>
              <button
                onClick={() => setShortRobotMood("crying")}
                style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: shortRobotMood === "crying" ? "#06b6d4" : "#9ca3af", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
              >
                Crying
              </button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <button
                onClick={() => setShortRobotBlink(!shortRobotBlink)}
                style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: "#3b82f6", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
              >
                {shortRobotBlink ? "Open Eyes" : "Blink"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr style={{ margin: "32px 0", border: "1px solid #ccc" }} />

      <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: "bold" }}>Original Robot Mascot</h3>
      <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
        <RobotMascot subject={subject} mood={mood} size={220} />
        <div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: "bold", marginRight: 8 }}>Subject: </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              style={{ padding: "6px 12px", fontSize: 16, borderRadius: 6 }}
            >
              <option value="default">Default</option>
              <option value="math">Math</option>
              <option value="science">Science</option>
              <option value="english">English</option>
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: "bold", marginRight: 8 }}>Mood: </label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value as Mood)}
              style={{ padding: "6px 12px", fontSize: 16, borderRadius: 6 }}
            >
              <option value="idle">Idle</option>
              <option value="thinking">Thinking</option>
              <option value="happy">Happy</option>
              <option value="excited">Excited</option>
              <option value="sad">Sad</option>
            </select>
          </div>

          <div>
            <button
              onClick={() => setMood("happy")}
              style={{ padding: "8px 16px", fontSize: 16, borderRadius: 6, background: "#16a34a", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
            >
              Celebrate
            </button>
            <button
              onClick={() => setMood("thinking")}
              style={{ marginLeft: 8, padding: "8px 16px", fontSize: 16, borderRadius: 6, background: "#0ea5e9", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
            >
              Think
            </button>
            <button
              onClick={() => setMood("sad")}
              style={{ marginLeft: 8, padding: "8px 16px", fontSize: 16, borderRadius: 6, background: "#dc2626", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
            >
              Sad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
