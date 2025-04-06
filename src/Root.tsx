// RemotionRoot.tsx
import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Overlay";
import videoConfig from "../videoConfig.json"; // Path to the generated file
import { Subtitle } from "./Subtitle";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Overlay"
        component={MyComposition}
        durationInFrames={videoConfig.totalFrames + 2}
        fps={videoConfig.fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="Subtitle"
        component={Subtitle}
        durationInFrames={videoConfig.mainFrames + videoConfig.introFrames}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
