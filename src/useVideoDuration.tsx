import { useState, useEffect } from "react";

function useVideoDuration(src: string): number {
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = src;
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [src]);

  return duration;
}

export default useVideoDuration;
