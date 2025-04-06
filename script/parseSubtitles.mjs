#!/usr/bin/env node
/* eslint-env node */
import fs from "fs";
import path from "path";
import parseSRT from "parse-srt";

async function main() {
  try {
    // Where your .srt file lives
    const srtPath = path.join(process.cwd(), "public", "K2.srt");
    const srtContent = fs.readFileSync(srtPath, "utf8");

    // Parse SRT into array of {id, start, end, text} (start/end in ms)
    const parsed = parseSRT(srtContent);

    // Save parsed array to JSON for reuse
    const jsonPath = path.join(process.cwd(), "public", "K2-subtitles.json");
    fs.writeFileSync(jsonPath, JSON.stringify(parsed, null, 2), "utf8");

    console.log(`Parsed subtitles saved to: ${jsonPath}`);
  } catch (err) {
    console.error("Failed to parse and save SRT:", err);
    process.exit(1);
  }
}

main();
