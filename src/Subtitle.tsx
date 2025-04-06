import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import subtitles from "../public/K2-subtitles.json"; // Parsed SRT -> JSON
import useVideoDuration from "./useVideoDuration"; // Hook to get main video length
import { staticFile } from "remotion";

const fps = 24;

export const Subtitle: React.FC = () => {
  // Suppose K2.mp4 starts at 10s in the final composition
  // (e.g. an intro video plays in the first 10s)
  const INTRO_SECONDS = 10;
  const INTRO_FRAMES = INTRO_SECONDS * fps;

  // If you want the subtitle times to be offset by 10s, we’ll add INTRO_FRAMES
  // to each subtitle's frame range.

  // Example: If sub.start=0ms => it appears at composition frame=INTRO_FRAMES.

  const k2DurationInSeconds = useVideoDuration(staticFile("K2.mp4"));
  const k2DurationInFrames = k2DurationInSeconds
    ? Math.floor(k2DurationInSeconds * fps)
    : 0;

  // If the main video length isn’t known yet, skip rendering to avoid invalid sequences.
  if (k2DurationInFrames <= 0) {
    return null;
  }

  return (
    <AbsoluteFill style={{ direction: 'rtl', backgroundColor: "#fff" }}>
      {subtitles.map((sub) => {
        // Convert SRT times (ms) to frames
        let startFrame = Math.floor((sub.start)  * fps);
        let endFrame = Math.floor((sub.end ) * fps);

        // If your SRT is timed exactly for K2.mp4,
        // you probably want to offset by the intro:
        startFrame += INTRO_FRAMES;
        endFrame += INTRO_FRAMES;

        // Ensure frames are not negative
        if (startFrame < 0) startFrame = 0;
        if (endFrame <= startFrame) {
          // Zero or negative duration => skip
          return null;
        }

        const durationInFrames = endFrame - startFrame;
        if (durationInFrames <= 0) {
          return null;
        }

        // Also clamp to not exceed the composition length if you want:
        // e.g. maxFrame = INTRO_FRAMES + k2DurationInFrames
        // but typically you can let it go if your SRT is correct.

        return (
          <Sequence
            key={sub.id}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
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
                {sub.text}
              </div>
            </div>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
