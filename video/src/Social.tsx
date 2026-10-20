import { AbsoluteFill } from "remotion";
import { C, DemoPhone } from "./DemoPhone";

export const Social = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <div style={{ position: "absolute", left: 128, top: 0, width: 1280, height: 800, transform: "scale(0.8)", transformOrigin: "top left" }}>
      <DemoPhone />
    </div>
  </AbsoluteFill>
);
