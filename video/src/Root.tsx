import { Composition } from "remotion";
import { Demo, DURATION } from "./Demo";
import { DemoPhone, PHONE_DURATION } from "./DemoPhone";
import { SETUP_DURATION, SetupDemo } from "./SetupDemo";
import { Social } from "./Social";

export const Root = () => (
  <>
    <Composition id="Demo" component={Demo} durationInFrames={DURATION} fps={30} width={1280} height={720} />
    <Composition id="DemoPhone" component={DemoPhone} durationInFrames={PHONE_DURATION} fps={30} width={1280} height={800} />
    <Composition id="Social" component={Social} durationInFrames={PHONE_DURATION} fps={30} width={1280} height={640} />
    <Composition id="SetupDemo" component={SetupDemo} durationInFrames={SETUP_DURATION} fps={30} width={1280} height={800} />
  </>
);
