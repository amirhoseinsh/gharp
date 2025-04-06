import React from "react";
import { AbsoluteFill, Sequence, Video, staticFile, Img } from "remotion";
import useVideoDuration from "./useVideoDuration";
import overlays from "../public/overlays.json";
import subtitles from "../public/subtitles.json";
import VideoConfig from "../videoConfig.json"; // {introUsed, outroUsed, introFrames, mainFrames, outroFrames, mainVideo, ...}

const fps = 24;

export const MyComposition: React.FC = () => {
  const {
    introUsed,
    outroUsed,
    introFrames,
    mainFrames,
    outroFrames,
    mainVideo,
    // srtFile, etc., if needed
  } = VideoConfig;

  // 1) Load metadata for main video
  const mainDurationSecs = useVideoDuration(staticFile(mainVideo));
  // If the main video's duration isn't ready yet, skip rendering
  if (!mainDurationSecs || mainDurationSecs <= 0) {
    return null;
  }

  // Keyframe animations (popUp / fadeInOut)
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
              style={{
                marginTop: 40,
                color: "#fff",
              }}
              className="english-font text-4xl font-bold"
            >
              Hackers and Painters
            </div>
            <div
              style={{
                marginTop: 30,
                color: "#fff",
              }}
              className="persian-font text-4xl font-bold"
            >
              هکرها و نقاش‌ها
            </div>
          </AbsoluteFill>
        </Sequence>
      )}

      {/* MAIN VIDEO: starts after introFrames, lasts mainFrames */}
      <Sequence from={introFrames} durationInFrames={mainFrames}>
        <Video src={staticFile(mainVideo)} />
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
              style={{ width: 120, height: "auto" }}
              alt="Outro Logo"
            />
            <div
              style={{
                marginTop: 40,
                color: "#f1f1f1",
              }}
              className="english-font text-4xl font-bold"
            >
              Hackers and Painters
            </div>
            <div
              style={{
                marginTop: 30,
                color: "#f1f1f1",
              }}
              className="persian-font text-4xl font-bold"
            >
              هکرها و نقاش‌ها
            </div>
            <div
              style={{
                marginTop: 60,
                color: "#f1f1f1",
              }}
              className="persian-font text-2xl font-bold"
            >
              پادکست X شتاب‌دهی مهارت
            </div>
          </AbsoluteFill>
        </Sequence>
      )}

      {/* Overlay Boxes (from overlays.json) */}
      {overlays.map((overlay, index) => (
        <Sequence
          key={index}
          from={overlay.timestamp * fps}
          durationInFrames={100}
        >
          <div dir="rtl" className="absolute top-0 right-0 m-16 mt-32">
            <div className="pop-up rounded-lg shadow-2xl overflow-hidden w-[600px]">
              <div className="bg-[#7846e3] px-6 py-4">
                <h1 className="text-white text-3xl font-bold">
                  {overlay.word}
                </h1>
              </div>
              <div className="bg-[#010101] px-6 py-4">
                <p className="text-white text-xl">{overlay.description}</p>
              </div>
            </div>
          </div>
        </Sequence>
      ))}

      {/* Fade-in Logo over main video */}
      <Sequence from={introFrames} durationInFrames={mainFrames - introFrames}>
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

      {/* Subtitles (from subtitles.json) */}
      {subtitles.map((sub) => {
        const start = Math.floor(sub.start * fps);
        const end = Math.floor(sub.end * fps);

        // Offset by introFrames if there's an intro
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
                <p className="text-4xl persian-font">{sub.text}</p>
                <div className="mt-10">
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
