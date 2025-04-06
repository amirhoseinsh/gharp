import React, { useRef, useEffect, useState } from "react";
import { AbsoluteFill, Sequence, Video, staticFile, Img } from "remotion";
import { motion } from "framer-motion"; // <-- Import framer-motion
import useVideoDuration from "./useVideoDuration";
import overlays from "../public/overlays.json";
import subtitles from "../public/subtitles.json";
import VideoConfig from "../videoConfig.json"; // { introUsed, outroUsed, introFrames, mainFrames, outroFrames, mainVideo, ... }

const fps = 24;

export const MyComposition: React.FC = () => {
  const {
    introUsed,
    outroUsed,
    introFrames,
    mainFrames,
    outroFrames,
    mainVideo,
  } = VideoConfig;

  // Load metadata for the main video
  const mainDurationSecs = useVideoDuration(staticFile(mainVideo));
  if (!mainDurationSecs || mainDurationSecs <= 0) {
    return null; // If we don't have main video metadata yet, skip rendering
  }

  // We'll place our narrator animation for 90 frames (~3.75s)
  // starting right after the intro (or at 0 if no intro).
  const narratorDuration = 140;
  const narratorFrom = introUsed ? introFrames : 0;

  // Simple global keyframes (popUp / fadeInOut) if still used
  const styleSheet = `
    @keyframes popUp {
      0%   { transform: scale(0.5); opacity: 0; }
      60%  { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(1); }
    }
    .pop-up {
      animation: popUp 0.5s ease-out forwards;
    }

    @keyframes fadeInOut {
      0%   { opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 1; }
      100% { opacity: 0; }
    }
  `;

  return (
    <AbsoluteFill>
      <style>{styleSheet}</style>

      {/* INTRO (optional) */}
      {introUsed && (
        <Sequence durationInFrames={introFrames}>
          <AbsoluteFill
            style={{
              backgroundColor: "black",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Img
              src={staticFile("logo.png")}
              style={{ width: 120, height: "auto" }}
              alt="Intro Logo"
            />
            <div
              style={{ marginTop: 40, color: "#fff" }}
              className="english-font text-4xl font-bold"
            >
              Hackers and Painters
            </div>
            <div
              style={{ marginTop: 30, color: "#fff" }}
              className="persian-font text-4xl font-bold"
            >
              هکرها و نقاش‌ها
            </div>
          </AbsoluteFill>
        </Sequence>
      )}

      {/* MAIN VIDEO */}
      <Sequence from={introFrames} durationInFrames={mainFrames}>
        <Video src={staticFile(mainVideo)} />
      </Sequence>

      {/* 
        ******* NARRATOR ANIMATION *******
        Overlays on top of main video, 
        starts immediately after intro.
      */}
      <Sequence from={narratorFrom} durationInFrames={narratorDuration}>
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start", // place items on the left
            justifyContent: "flex-end", // place items at the bottom
            padding: 40, // margin from bottom-left corner
          }}
        >
          <NarratorAnimation />
        </AbsoluteFill>
      </Sequence>

      {/* OUTRO (optional) */}
      {outroUsed && (
        <Sequence
          from={introFrames + mainFrames}
          durationInFrames={outroFrames}
        >
          <AbsoluteFill
            style={{
              backgroundColor: "black",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Img
              src={staticFile("logo.png")}
              style={{ width: 128, height: "auto" }}
              alt="Outro Logo"
            />
            <div
              style={{ marginTop: 40, color: "#f1f1f1" }}
              className="english-font text-5xl font-bold"
            >
              Hackers and Painters
            </div>
            <div
              style={{ marginTop: 30, color: "#f1f1f1" }}
              className="persian-font text-5xl font-bold"
            >
              هکرها و نقاش‌ها
            </div>
          </AbsoluteFill>
        </Sequence>
      )}

      {/* Overlay Boxes */}
      {overlays.map((overlay, index) => (
        <Sequence
          key={index}
          from={introFrames + overlay.timestamp * fps}
          durationInFrames={120}
        >
          <div dir="rtl" className="absolute top-0 right-0 m-16 mt-32">
            <div className="pop-up rounded-lg shadow-2xl overflow-hidden w-[600px]">
              <div className="bg-[#7846e3] px-6 py-4">
                <h1 className="text-white text-4xl font-bold">
                  {overlay.word}
                </h1>
              </div>
              <div className="bg-[#010101] px-6 py-4">
                <p className="text-white text-2xl">{overlay.description}</p>
              </div>
            </div>
          </div>
        </Sequence>
      ))}

      {/* Fade-in Logo (example) */}
      <Sequence from={introFrames} durationInFrames={mainFrames}>
        <div className="absolute top-0 left-0 m-16">
          <Img
            src={staticFile("logo.png")}
            alt="Floating Logo"
            style={{
              width: 80,
              height: "auto",
              animation: `fadeInOut ${mainDurationSecs}s ease-in-out forwards`,
            }}
          />
        </div>
      </Sequence>

      {/* Subtitles */}
      {subtitles.map((sub) => {
        const start = Math.floor(sub.start * fps);
        const end = Math.floor(sub.end * fps);
        const fromFrame = introFrames + start;
        const endFrame = introFrames + end;
        if (endFrame <= fromFrame) return null;

        const dur = endFrame - fromFrame;
        if (dur <= 0) return null;

        return (
          <Sequence key={sub.id} from={fromFrame} durationInFrames={dur}>
            <div
              style={{
                position: "absolute",
                bottom: "10%",
                width: "100%",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: "4px",
                }}
              >
                <p dir="rtl" className="text-4xl persian-font mx-24">
                  {sub.text}
                </p>
                <div className="mt-10 ">
                  <span
                    className="
                      text-2xl 
                      bg-gradient-to-r 
                      from-pink-500
                      to-yellow-300
                      bg-clip-text
                      text-transparent 
                      english-font
                    "
                  >
                    @HackersandPainters
                  </span>
                </div>
              </div>
            </div>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * NarratorAnimation:
 * - Shows a spinning circle with the logo (2s).
 * - Then expands a rectangle (1s) that displays the narrator name.
 */

const NarratorAnimation: React.FC = () => {
  const { hasNarrator, narratorNames } = VideoConfig;
  if (!hasNarrator || !narratorNames || narratorNames.length === 0) {
    return null;
  }

  // Combine names with " - " separator
  const narratorText = `Speaker(s): ${narratorNames.join(" - ")}`;

  // Reference to measure text width
  const textRef = useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = useState<number>(-1);

  useEffect(() => {
    if (textRef.current) {
      // Measure width (include padding if needed)
      setTextWidth(textRef.current.offsetWidth);
    }
  }, [narratorText]);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* 1) Spinning Circle */}
      <motion.div
        style={{
          width: 160,
          height: 160,
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          backgroundColor: "#7846e3",
          alignItems: "center",
          justifyContent: "center",
        }}
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ duration: 3, ease: "easeInOut" }}
      >
        <Img
          src={staticFile("logo.png")}
          style={{ width: 80, height: "auto" }}
          alt="Narrator Logo"
        />
      </motion.div>

      {/* Hidden element to measure narrator text width */}
      <span
        ref={textRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
          fontSize: 24,
          fontWeight: "bold",
          fontFamily: "sans-serif",
          padding: "0 12px",
        }}
      >
        {narratorText}
      </span>

      {/* 2) Expanding Rectangle next to the circle */}
      <motion.div
        style={{
          width: 0,
          height: 50,
          marginLeft: -10,
          // padding: "0 12px",
          boxSizing: "border-box",
          backgroundColor: "#7846e3",
          color: "#fff",
          fontSize: 24,
          fontWeight: "bold",
          whiteSpace: "nowrap",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          borderRadius: 8,
        }}
        initial={{ width: 0 }}
        animate={{ width: textWidth }}
        transition={{ delay: 2, duration: 1, ease: "easeOut" }}
      >
        <span style={{ marginLeft: 10 }}>{narratorText}</span>
      </motion.div>
    </div>
  );
};

// export default NarratorAnimation;
