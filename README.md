# Hackers and Painters Video Generator

[English](README.md) | [فارسی](README-fa.md)

A specialized video composition tool built for HackersAndPainters Instagram reels, powered by Remotion framework. This tool automates the creation of educational tech content with professional overlays, subtitles, and branding.

🌐 Website: [hackersandpainters.xyz](https://hackersandpainters.xyz)
📸 Instagram: [@hackersandpainters](https://instagram.com/hackersandpainters)

## Prerequisites

- Node.js (latest LTS version)
- ffmpeg installed and available in your system PATH
- npm or yarn

## Technologies

- 🎬 Built with [Remotion](https://www.remotion.dev/) - React framework for video generation
- ⚛️ React and TypeScript for component-based video composition
- 🎨 Tailwind CSS for styling
- 🎭 Framer Motion for smooth animations

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Configure your video (this will create videoConfig.json):
```bash
npm run hp
```

You'll be prompted for:
- SRT subtitle file name (place in public/ folder)
- Main video file name (place in public/ folder)
- Intro/Outro preferences (none, intro only, outro only, or both)
- Narrator information (optional)

3. Start the Remotion preview:
```bash
npm run dev
```

## Project Structure

- `public/` - Place your assets here:
  - Main video file (e.g., K2.mp4)
  - Subtitle file (e.g., K2.srt)
  - logo.png (for intro/outro)
  - overlays.json (for custom overlay definitions)

## Features

- ⚡ Optimized for Instagram Reels format
- 🎭 Smooth narrator animation with branded colors
- 📝 Bilingual subtitle support (Persian/English)
- 🎨 Custom educational overlays
- 🎬 Optional branded intro/outro sequences
- 🔄 HackersAndPainters watermark and branding

## Configuration

The `npm run hp` script will generate a `videoConfig.json` file with your preferences. This includes:
- Video FPS settings
- Intro/Outro durations
- Main video path
- Subtitle configuration
- Narrator settings

## Building

To render the final video:

```bash
npm run build
```

## Customization

- Modify `src/Overlay.tsx` for visual changes
- Update `public/overlays.json` for custom overlay content
- Adjust styles in the stylesheet section of Overlay.tsx

## License

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This project is open source and available under the MIT License.
