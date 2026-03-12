import React from "react";
import {Composition} from "remotion";
import {RevSprintStudioDemo, TOTAL_FRAMES} from "./RevSprintStudioDemo";

export const Root: React.FC = () => {
  return (
    <Composition
      id="RevSprintStudioDemo"
      component={RevSprintStudioDemo}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
