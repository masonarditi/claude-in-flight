import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";

const C = { bg: "#0b0d12", blue: "#0a84ff", gray: "#2a2a2e", green: "#34c759", text: "#f5f5f7", dim: "#8e8e93" };
const font = "-apple-system, 'SF Pro Display', system-ui, sans-serif";

const useIn = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 16, mass: 0.6 } });
};

const Fade = ({ children, duration }: { children: React.ReactNode; duration: number }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, duration - 8, duration], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity, background: C.bg, fontFamily: font, color: C.text }}>{children}</AbsoluteFill>;
};

const Bubble = ({ from, text, at }: { from: "me" | "agent"; text: string; at: number }) => {
  const p = useIn(at);
  const me = from === "me";
  return (
    <div style={{ alignSelf: me ? "flex-end" : "flex-start", maxWidth: 520, padding: "14px 20px", borderRadius: 24, fontSize: 26, lineHeight: 1.3,
      background: me ? C.blue : C.gray, opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${0.9 + p * 0.1})` }}>
      {text}
    </div>
  );
};

const Typing = ({ from, to }: { from: number; to: number }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame > to) return null;
  return (
    <div style={{ alignSelf: "flex-start", background: C.gray, borderRadius: 24, padding: "18px 22px", display: "flex", gap: 8 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: C.dim, opacity: 0.4 + 0.6 * Math.abs(Math.sin((frame + i * 6) / 6)) }} />
      ))}
    </div>
  );
};

const Note = ({ text, at }: { text: string; at: number }) => (
  <div style={{ alignSelf: "center", color: C.dim, fontSize: 20, opacity: useIn(at) }}>{text}</div>
);

const Chat = () => (
  <Fade duration={270}>
    <div style={{ position: "absolute", top: 36, width: "100%", textAlign: "center", fontSize: 22, color: C.dim }}>
      ✈️ 34,000 ft · Wi-Fi: messaging only
    </div>
    <div style={{ position: "absolute", inset: "100px 220px 40px", display: "flex", flexDirection: "column", gap: 16, justifyContent: "flex-end" }}>
      <Bubble from="me" text="ask claude code to add dark mode to the settings page in my-app" at={15} />
      <Typing from={50} to={80} />
      <Bubble from="agent" text="on it ✈️ started task 3f9a2c" at={80} />
      <Note text="· 6 minutes later ·" at={130} />
      <Bubble from="agent" text="done ✅ dark mode added to settings, tests pass" at={155} />
      <Bubble from="agent" text="PR #42 → github.com/you/my-app/pull/42" at={180} />
      <Bubble from="me" text="🙌" at={215} />
    </div>
  </Fade>
);

const nodes = ["You\niMessage", "Your agent\nPoke & co.", "Relay\nVercel", "Claude Code\ncloud routine"];

const Flow = () => {
  const frame = useCurrentFrame();
  const back = useIn(70);
  return (
    <Fade duration={150}>
      <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontSize: 44, fontWeight: 700 }}>How it works</div>
      <div style={{ position: "absolute", top: 260, left: 70, right: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {nodes.map((n, i) => {
          const p = useIn(i * 12);
          const [title, sub] = n.split("\n");
          return (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 230, padding: "26px 0", borderRadius: 20, textAlign: "center", border: `2px solid ${i === 3 ? C.green : C.blue}`,
                opacity: p, transform: `scale(${0.8 + p * 0.2})` }}>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{title}</div>
                <div style={{ fontSize: 20, color: C.dim, marginTop: 6 }}>{sub}</div>
              </div>
              {i < 3 && <div style={{ fontSize: 34, color: C.blue, opacity: interpolate(frame, [i * 12 + 8, i * 12 + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>→</div>}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 470, width: "100%", textAlign: "center", fontSize: 28, color: C.green, opacity: back }}>
        ← summary + PR link, texted back to you
      </div>
    </Fade>
  );
};

const steps = ["Create a Claude task with an API trigger", "Deploy the relay in one click", "Add one network secret", "Add the MCP server to your agent"];

const Setup = () => (
  <Fade duration={150}>
    <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", fontSize: 44, fontWeight: 700 }}>Set up in ~10 minutes</div>
    <div style={{ position: "absolute", top: 230, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", gap: 28 }}>
      {steps.map((s, i) => {
        const p = useIn(10 + i * 14);
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 32, opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: C.blue, display: "grid", placeItems: "center", fontWeight: 700 }}>{i + 1}</div>
            {s}
          </div>
        );
      })}
    </div>
  </Fade>
);

const End = () => {
  const p = useIn(0);
  return (
    <Fade duration={90}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 18, opacity: p }}>
        <div style={{ fontSize: 72, fontWeight: 800 }}>✈️ claude-in-flight</div>
        <div style={{ fontSize: 30, color: C.dim }}>github.com/masonarditi/claude-in-flight</div>
        <div style={{ fontSize: 20, color: C.dim }}>Unofficial · MIT</div>
      </AbsoluteFill>
    </Fade>
  );
};

export const DURATION = 270 + 150 + 150 + 90;

export const Demo = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Sequence durationInFrames={270}><Chat /></Sequence>
    <Sequence from={270} durationInFrames={150}><Flow /></Sequence>
    <Sequence from={420} durationInFrames={150}><Setup /></Sequence>
    <Sequence from={570} durationInFrames={90}><End /></Sequence>
  </AbsoluteFill>
);
