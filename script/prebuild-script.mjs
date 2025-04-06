#!/usr/bin/env node
/* eslint-env node */

import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

// Helper function to get video duration in seconds using ffprobe
function getVideoDurationInSeconds(videoPath) {
  // `-v error` => Only show errors
  // `-show_entries format=duration` => show only the duration
  // `-of default=noprint_wrappers=1:nokey=1` => print only the raw numeric value
  const probe = spawnSync("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    videoPath,
  ]);

  if (probe.error) {
    throw new Error(`Failed to run ffprobe on ${videoPath}: ${probe.error}`);
  }

  const stderr = probe.stderr.toString().trim();
  if (stderr) {
    console.warn(`ffprobe stderr for ${videoPath}:`, stderr);
  }

  const output = probe.stdout.toString().trim();
  const duration = parseFloat(output);

  if (isNaN(duration)) {
    throw new Error(
      `Could not parse duration from ffprobe output for ${videoPath}: "${output}"`,
    );
  }

  return duration;
}

async function main() {
  try {
    const fps = 24;
    // Paths to your videos in `public/` or wherever they live
    const introPath = path.join(process.cwd(), "public", "intro.mp4");
    const mainPath = path.join(process.cwd(), "public", "K2.mp4");
    const outroPath = path.join(process.cwd(), "public", "outro.mp4");

    // Get durations in seconds
    const introDurationSecs = getVideoDurationInSeconds(introPath);
    const mainDurationSecs = getVideoDurationInSeconds(mainPath);
    const outroDurationSecs = getVideoDurationInSeconds(outroPath);

    // Convert to frames
    const introFrames = Math.floor(introDurationSecs * fps);
    const mainFrames = Math.floor(mainDurationSecs * fps);
    const outroFrames = Math.floor(outroDurationSecs * fps);
    const totalFrames = introFrames + mainFrames + outroFrames;

    const config = {
      introFrames,
      mainFrames,
      outroFrames,
      totalFrames,
      fps,
    };

    // Write a JSON config for your Remotion root
    fs.writeFileSync(
      path.join(process.cwd(), "videoConfig.json"),
      JSON.stringify(config, null, 2),
      "utf-8",
    );

    console.log("Wrote videoConfig.json:", config);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
