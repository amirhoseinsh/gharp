#!/usr/bin/env node
/* eslint-env node */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import inquirer from "inquirer";
import parseSRT from "parse-srt";

const fps = 24;

// Helper to run ffprobe and get video duration in seconds
function getVideoDurationInSeconds(videoPath) {
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
    // === 1) Prompt for SRT filename
    const { srtFile } = await inquirer.prompt([
      {
        type: "input",
        name: "srtFile",
        message: "Enter the name of the SRT file (in public/):",
        default: "K2.srt",
      },
    ]);

    const srtPath = path.join(process.cwd(), "public", srtFile);
    if (!fs.existsSync(srtPath)) {
      console.error(`SRT file not found: ${srtPath}`);
      process.exit(1);
    }

    // Parse SRT => JSON
    const srtContent = fs.readFileSync(srtPath, "utf8");
    const parsedSubtitles = parseSRT(srtContent);

    // Always write to public/subtitles.json
    const subtitlesJsonPath = path.join(
      process.cwd(),
      "public",
      "subtitles.json",
    );
    fs.writeFileSync(
      subtitlesJsonPath,
      JSON.stringify(parsedSubtitles, null, 2),
      "utf8",
    );
    console.log(`Parsed subtitles saved to: ${subtitlesJsonPath}`);

    // === 2) Prompt for Main Video name
    const { mainVideo } = await inquirer.prompt([
      {
        type: "input",
        name: "mainVideo",
        message: "Enter the name of the main video file (in public/):",
        default: "K2.mp4",
      },
    ]);

    // Validate the main video file
    const mainPath = path.join(process.cwd(), "public", mainVideo);
    if (!fs.existsSync(mainPath)) {
      console.error(`Main video not found: ${mainPath}`);
      process.exit(1);
    }

    // === 3) Prompt for black intro/outro usage
    const { introOutroChoice } = await inquirer.prompt([
      {
        type: "list",
        name: "introOutroChoice",
        message: "Select which black screen segments you want (3s each):",
        choices: [
          { name: "None", value: "none" },
          { name: "Intro only (3s)", value: "intro" },
          { name: "Outro only (3s)", value: "outro" },
          { name: "Both intro & outro (3s each)", value: "both" },
        ],
        default: "none",
      },
    ]);

    // === 4) Prompt if there's a narrator and get name(s)
    const { hasNarrator } = await inquirer.prompt([
      {
        type: "confirm",
        name: "hasNarrator",
        message: "Does the video have a narrator (or multiple narrators)?",
        default: false,
      },
    ]);

    let narratorNames = [];
    if (hasNarrator) {
      const { narratorsInput } = await inquirer.prompt([
        {
          type: "input",
          name: "narratorsInput",
          message: "Enter the narrator's name(s), comma-separated if multiple:",
          default: "John Doe",
        },
      ]);

      // Convert comma-separated names to array, trimming extra spaces
      narratorNames = narratorsInput
        .split(",")
        .map((name) => name.trim())
        .filter((n) => n.length > 0);
    }

    // 5) Get main video duration
    const mainDurationSecs = getVideoDurationInSeconds(mainPath);
    const mainFrames = Math.floor(mainDurationSecs * fps);

    // By default, 0 for both intro/outro
    let introUsed = false;
    let outroUsed = false;
    let introFrames = 0;
    let outroFrames = 0;

    if (introOutroChoice === "intro" || introOutroChoice === "both") {
      introUsed = true;
      introFrames = 3 * fps; // 3s
    }
    if (introOutroChoice === "outro" || introOutroChoice === "both") {
      outroUsed = true;
      outroFrames = 3 * fps; // 3s
    }

    const totalFrames = introFrames + mainFrames + outroFrames;

    // Collect everything into a config object
    const config = {
      fps,
      mainVideo,
      srtFile,
      srtJson: "subtitles.json",
      introUsed,
      outroUsed,
      introFrames,
      mainFrames,
      outroFrames,
      totalFrames,
      hasNarrator,
      narratorNames, // array of string(s)
    };

    // Write videoConfig.json
    const configPath = path.join(process.cwd(), "videoConfig.json");
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
    console.log("Wrote videoConfig.json:", config);
  } catch (err) {
    console.error("Error in hp script:", err);
    process.exit(1);
  }
}

main();
