import { Composition } from "remotion";
import { Demo, DURATION } from "./Demo";
import { DemoPhone, PHONE_DURATION } from "./DemoPhone";

export const Root = () => (
  <>
    <Composition id="Demo" component={Demo} durationInFrames={DURATION} fps={30} width={1280} height={720} />
    <Composition id="DemoPhone" component={DemoPhone} durationInFrames={PHONE_DURATION} fps={30} width={1280} height={800} />
  </>
);
