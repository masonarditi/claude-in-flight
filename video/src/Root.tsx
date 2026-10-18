import { Composition } from "remotion";
import { Demo, DURATION } from "./Demo";

export const Root = () => (
  <Composition id="Demo" component={Demo} durationInFrames={DURATION} fps={30} width={1280} height={720} />
);
