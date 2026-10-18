import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Badge, Bubble, C, Outro, sans, serif, StatusBar, useSpring } from "./DemoPhone";

const mono = "'SF Mono', Menlo, monospace";
const peach = "linear-gradient(180deg, #ffcf9e, #ffab6b)";
const PROMPT = "Set up claude-in-flight for me by following https://raw.githubusercontent.com/masonarditi/claude-in-flight/master/docs/agent-setup.md step by step.";
const MSG = "ask claude code to add a hello line to the README in my-app";

const STEPS = [
  { at: 75, len: 255, title: "Paste one prompt into Claude Code", sub: "It clones the repo, deploys the relay, and creates the database." },
  { at: 330, len: 290, title: "Create the Claude task", sub: "One form on claude.ai: Opus, Full network, API trigger." },
  { at: 620, len: 180, title: "Claude Code finishes the deploy", sub: "It saves your routine URL and token, then checks everything." },
  { at: 800, len: 150, title: "Add one network secret", sub: "So Claude can report results back to your relay." },
  { at: 950, len: 150, title: "Connect your agent", sub: "Add the relay as an MCP server in Poke or any iMessage agent." },
  { at: 1100, len: 200, title: "Text it", sub: "Code from 34,000 ft. For free." },
];
const END = 1300;
export const SETUP_DURATION = END + 90;

const typed = (text: string, from: number, to: number, frame: number) =>
  text.slice(0, Math.max(0, Math.ceil(((frame - from) / (to - from)) * text.length)));

const Appear = ({ at, children, style }: { at: number; children: React.ReactNode; style?: React.CSSProperties }) => {
  const p = useSpring(at);
  return useCurrentFrame() < at ? null : <div style={{ opacity: p, transform: `translateY(${(1 - p) * 10}px)`, ...style }}>{children}</div>;
};

const Window = ({ dark, url, children }: { dark?: boolean; url?: string; children: React.ReactNode }) => (
  <div style={{ width: 960, height: 556, borderRadius: 16, overflow: "hidden", background: dark ? "#0f1116" : "#fff", border: `1px solid ${dark ? "#262a33" : "#e4e3de"}`,
    boxShadow: "0 30px 80px rgba(0,0,0,0.14)", display: "flex", flexDirection: "column", fontFamily: sans }}>
    <div style={{ height: 40, flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", background: dark ? "#171a21" : "#f4f3ef", borderBottom: `1px solid ${dark ? "#262a33" : "#e4e3de"}` }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />)}
      {url ? <div style={{ marginLeft: 18, width: 420, height: 24, borderRadius: 7, background: "#fff", border: "1px solid #e4e3de", fontSize: 13, color: C.dim, display: "flex", alignItems: "center", padding: "0 10px" }}>{url}</div>
        : <div style={{ flex: 1, textAlign: "center", fontSize: 13, color: "#8e8e93", marginRight: 60 }}>Terminal: claude</div>}
    </div>
    <div style={{ flex: 1, position: "relative", padding: 28 }}>{children}</div>
  </div>
);

const Cursor = ({ keys }: { keys: [number, number, number, boolean?][] }) => {
  const frame = useCurrentFrame();
  const opts = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.inOut(Easing.cubic) };
  const x = interpolate(frame, keys.map((k) => k[0]), keys.map((k) => k[1]), opts);
  const y = interpolate(frame, keys.map((k) => k[0]), keys.map((k) => k[2]), opts);
  const click = keys.find((k) => k[3] && frame >= k[0] && frame < k[0] + 10);
  const r = click ? interpolate(frame - click[0], [0, 10], [4, 26]) : 0;
  return (
    <>
      {click && <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, background: "rgba(10,132,255,0.25)" }} />}
      <svg width="22" height="28" viewBox="0 0 22 28" style={{ position: "absolute", left: x - 3, top: y - 2, filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" }}>
        <path d="M3 2 L3 22 L8 17 L12 26 L15.5 24.5 L11.5 15.5 L18 15.5 Z" fill="#111" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </>
  );
};

const Check = ({ at, text, color = "#30d158" }: { at: number; text: string; color?: string }) => (
  <Appear at={at} style={{ fontFamily: mono, fontSize: 17, color: "#e6e6ea", margin: "7px 0" }}><span style={{ color }}>✓</span> {text}</Appear>
);

const Field = ({ label, at, children, ring }: { label: string; at: number; children: React.ReactNode; ring?: [number, number] }) => {
  const frame = useCurrentFrame();
  const on = ring && frame >= ring[0] && frame < ring[1];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 12 }}>
      <div style={{ width: 170, fontSize: 15, color: "#55554f", fontWeight: 600 }}>{label}</div>
      <div style={{ flex: 1, minHeight: 40, borderRadius: 10, border: `1.5px solid ${on ? C.blue : "#e2e1dc"}`, boxShadow: on ? "0 0 0 4px rgba(10,132,255,0.15)" : "none",
        display: "flex", alignItems: "center", padding: "6px 12px", fontSize: 15, color: C.ink, background: "#fff" }}>
        <Appear at={at}>{children}</Appear>
      </div>
    </div>
  );
};

const Copy = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" style={{ marginLeft: "auto" }}><rect x="5" y="5" width="9" height="9" rx="2" fill="none" stroke="#8e8e93" strokeWidth="1.5" /><path d="M3 11 V3 a1 1 0 0 1 1 -1 H11" fill="none" stroke="#8e8e93" strokeWidth="1.5" /></svg>
);

const Title = () => {
  const p = useSpring(4);
  return (
    <AbsoluteFill style={{ background: C.bg, justifyContent: "center", alignItems: "center", gap: 20, opacity: p }}>
      <Badge size={84} />
      <div style={{ fontFamily: serif, fontSize: 72, color: C.ink, letterSpacing: -1 }}>Set up in <span style={{ background: peach, WebkitBackgroundClip: "text", color: "transparent", fontStyle: "italic", paddingRight: 6 }}>5 minutes</span></div>
      <div style={{ fontFamily: sans, fontSize: 20, color: C.dim }}>claude-in-flight</div>
    </AbsoluteFill>
  );
};

const Caption = () => {
  const frame = useCurrentFrame();
  const i = STEPS.findLastIndex((s) => frame >= s.at);
  if (i < 0 || frame >= END) return null;
  const s = STEPS[i];
  const p = interpolate(frame - s.at, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 34, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: sans }}>
      <div style={{ display: "flex", gap: 8 }}>
        {STEPS.map((_, j) => <div key={j} style={{ width: j === i ? 26 : 8, height: 8, borderRadius: 4, background: j <= i ? "#ffab6b" : "#e2e1dc" }} />)}
      </div>
      <div style={{ opacity: p, transform: `translateY(${(1 - p) * 8}px)`, textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.6, color: C.dim, marginTop: 6 }}>STEP {i + 1} OF {STEPS.length}</div>
        <div style={{ fontFamily: serif, fontSize: 38, color: C.ink, letterSpacing: -0.5, marginTop: 4 }}>{s.title}</div>
        <div style={{ fontSize: 17, color: "#6b6a65", marginTop: 4 }}>{s.sub}</div>
      </div>
    </div>
  );
};

const Stage = ({ len, children }: { len: number; children: React.ReactNode }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10, len - 10, len], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 30, opacity: o }}>{children}</AbsoluteFill>;
};

const Step1 = () => {
  const frame = useCurrentFrame();
  const t = typed(PROMPT, 10, 85, frame);
  return (
    <Window dark>
      <div style={{ fontFamily: mono, fontSize: 15, color: "#7d7f88", marginBottom: 14 }}>✻ Welcome to Claude Code</div>
      <div style={{ fontFamily: mono, fontSize: 17, lineHeight: 1.5, color: "#f2f2f5", border: "1px solid #343846", borderRadius: 10, padding: "10px 14px" }}>
        <span style={{ color: "#ffab6b" }}>&gt; </span>{t}{frame < 92 && <span style={{ background: "#f2f2f5", opacity: Math.floor(frame / 8) % 2 ? 0 : 1 }}>&nbsp;</span>}
      </div>
      <div style={{ marginTop: 18 }}>
        <Check at={100} text="Cloned claude-in-flight" />
        <Check at={125} text="Linked your Vercel project" />
        <Check at={150} text="Created Upstash Redis (free)" />
        <Check at={175} text="Generated a relay key (kept off-screen)" />
        <Appear at={210} style={{ fontFamily: mono, fontSize: 17, color: "#ffb67c", marginTop: 16 }}>→ Your turn: create the Claude task at claude.ai/code/routines</Appear>
      </div>
    </Window>
  );
};

const Step2 = () => {
  const frame = useCurrentFrame();
  const apiOn = frame >= 175;
  return (
    <div style={{ position: "relative" }}>
      <Window url="claude.ai/code/routines">
        <div style={{ fontFamily: serif, fontSize: 26, color: C.ink, marginBottom: 16 }}>New task</div>
        <Field label="Instructions" at={18} ring={[12, 40]}><span style={{ color: "#55554f" }}>You are my remote coding agent. I send tasks from my phone…</span></Field>
        <Field label="Model" at={0} ring={[55, 100]}>{frame >= 62 ? <b>Opus</b> : <span style={{ color: C.dim }}>Default</span>}</Field>
        <Field label="Repository" at={98} ring={[92, 128]}><span style={{ padding: "3px 10px", borderRadius: 8, background: "#f1f0ec" }}>my-app</span></Field>
        <Field label="Cloud environment" at={138} ring={[132, 168]}>Network access: <b style={{ marginLeft: 6 }}>Full</b></Field>
        <Field label="Trigger" at={0} ring={[170, 200]}>
          <div style={{ display: "flex", borderRadius: 8, background: "#f1f0ec", padding: 3 }}>
            {["Schedule", "API"].map((o) => <div key={o} style={{ padding: "4px 14px", borderRadius: 6, fontSize: 14, background: (o === "API") === apiOn ? "#fff" : "transparent", fontWeight: (o === "API") === apiOn ? 700 : 400, boxShadow: (o === "API") === apiOn ? "0 1px 3px rgba(0,0,0,0.12)" : "none" }}>{o}</div>)}
          </div>
        </Field>
        <Appear at={212} style={{ marginTop: 6, borderRadius: 12, border: "1px solid #e2e1dc", background: "#faf9f6", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><b style={{ width: 70 }}>Fire URL</b><span style={{ fontFamily: mono, color: "#55554f" }}>https://api.anthropic.com/v1/claude_code/routines/trig_…</span><Copy /></div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><b style={{ width: 70 }}>Token</b><span style={{ fontFamily: mono, color: "#55554f" }}>sk-ant-oat01-••••••••••••••••</span><Copy /></div>
          <Appear at={252} style={{ color: "#1f9d55", fontWeight: 600 }}>Copied ✓ Paste them back into Claude Code</Appear>
        </Appear>
      </Window>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <Cursor keys={[[0, 760, 420], [12, 520, 128, true], [55, 330, 180, true], [92, 330, 232, true], [132, 400, 284, true], [170, 300, 336, true], [205, 300, 336], [240, 905, 410, true], [262, 905, 440, true], [290, 905, 440]]} />
      </div>
    </div>
  );
};

const Step3 = () => (
  <Window dark>
    <div style={{ fontFamily: mono, fontSize: 15, color: "#7d7f88", marginBottom: 8 }}>&gt; done, here's the URL and token</div>
    <Check at={10} text="Saved routine URL and token" />
    <Check at={40} text="Deployed https://claude-in-flight.vercel.app" />
    <Appear at={75} style={{ marginTop: 18, width: 420, borderRadius: 12, background: "#fff", padding: "14px 18px", fontFamily: sans, color: C.ink }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>✈️ claude-in-flight · Config</div>
      {["ROUTINE_URL", "ROUTINE_TOKEN", "RELAY_KEY", "Upstash Redis", "Push results to Poke"].map((k, i) => (
        <Appear key={k} at={85 + i * 10} style={{ fontSize: 15, margin: "4px 0" }}>✅ {k}</Appear>
      ))}
    </Appear>
  </Window>
);

const Modal = ({ url, title, children }: { url: string; title: string; children: React.ReactNode }) => (
  <Window url={url}>
    <div style={{ position: "absolute", inset: 0, background: "rgba(17,17,17,0.04)" }} />
    <div style={{ position: "relative", width: 640, margin: "8px auto 0", borderRadius: 14, background: "#fff", border: "1px solid #e2e1dc", boxShadow: "0 12px 40px rgba(0,0,0,0.1)", padding: "20px 24px" }}>
      <div style={{ fontFamily: serif, fontSize: 24, marginBottom: 14, color: C.ink }}>{title}</div>
      {children}
    </div>
  </Window>
);

const Button = ({ text, done, at }: { text: string; done: string; at: number }) => {
  const frame = useCurrentFrame();
  const ok = frame >= at;
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 14, marginTop: 6 }}>
      <Appear at={at}><span style={{ color: "#1f9d55", fontWeight: 600, fontSize: 15 }}>{done}</span></Appear>
      <div style={{ padding: "9px 18px", borderRadius: 10, background: ok ? "#1f9d55" : C.ink, color: "#fff", fontSize: 15, fontWeight: 600 }}>{ok ? "✓" : text}</div>
    </div>
  );
};

const Step4 = () => (
  <div style={{ position: "relative" }}>
    <Modal url="claude.ai/code · Cloud environment" title="Add secret">
      <Field label="Secret type" at={8}>Bearer</Field>
      <Field label="Allowed websites" at={22}><span style={{ padding: "3px 10px", borderRadius: 8, background: "#f1f0ec", fontFamily: mono, fontSize: 14 }}>claude-in-flight.vercel.app</span></Field>
      <Field label="Path prefix" at={40}><span style={{ fontFamily: mono }}>/api/result</span></Field>
      <Field label="Value" at={58}>••••••••••••••••••••••••</Field>
      <Button text="Add" done="Claude never sees the key" at={98} />
    </Modal>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}><Cursor keys={[[0, 640, 470], [60, 700, 400], [92, 750, 371, true], [150, 750, 371]]} /></div>
  </div>
);

const Step5 = () => (
  <div style={{ position: "relative" }}>
    <Modal url="your iMessage agent · Integrations" title="Add MCP server">
      <Field label="Name" at={8}>Claude Code</Field>
      <Field label="Server URL" at={24}><span style={{ fontFamily: mono, fontSize: 14 }}>https://claude-in-flight.vercel.app/api/mcp</span></Field>
      <Field label="API key" at={42}>••••••••••••••••••••••••</Field>
      <Button text="Create" done="Connected ✓ 2 tools" at={92} />
    </Modal>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}><Cursor keys={[[0, 640, 430], [55, 700, 360], [86, 750, 319, true], [150, 750, 319]]} /></div>
  </div>
);

const Msg = ({ at, children }: { at: number; children: React.ReactNode }) => {
  const p = useSpring(at);
  return useCurrentFrame() < at ? null : <div style={{ display: "flex", flexDirection: "column", opacity: p, maxHeight: p * 120, transform: `translateY(${(1 - p) * 16}px)` }}>{children}</div>;
};

const Step6 = () => {
  const frame = useCurrentFrame();
  const t = frame < 66 ? typed(MSG, 8, 58, frame) : "";
  return (
    <div style={{ width: 340, height: 556, borderRadius: 54, padding: 4, background: "linear-gradient(135deg,#d8d3cd,#8f8a84 45%,#cfcac4 70%,#7e7974)", boxShadow: "0 30px 70px rgba(0,0,0,0.16)" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 46, background: "#0b0b0c", padding: 9 }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 38, background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column", fontFamily: sans, color: C.ink, transformOrigin: "top" }}>
          <StatusBar />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, paddingBottom: 6, borderBottom: "1px solid #f0f0f2" }}>
            <Badge size={40} />
            <div style={{ fontSize: 11.5, fontWeight: 600 }}>Claude in Flight ›</div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 8px 6px", transform: "scale(0.9)", transformOrigin: "bottom" }}>
            <Msg at={66}><Bubble me text={MSG} /></Msg>
            <Msg at={100}><Bubble text="on it ✈️ started task 7c1e" /></Msg>
            <Msg at={128}><div style={{ alignSelf: "center", fontSize: 11, color: C.dim, margin: "6px 0" }}>30 seconds later</div></Msg>
            <Msg at={145}><Bubble text="claude-in-flight works ✅ opened PR #1 in my-app" /></Msg>
          </div>
          <div style={{ margin: "0 10px 14px", minHeight: 32, borderRadius: 16, border: "1px solid #dcdce0", display: "flex", alignItems: "center", padding: "4px 12px", fontSize: 13.5, color: t ? C.ink : "#a1a1a6", overflow: "hidden", whiteSpace: "nowrap", direction: t.length > 30 ? "rtl" : "ltr" }}>
            {t || "iMessage"}
          </div>
        </div>
      </div>
    </div>
  );
};

const Sfx = () => {
  const s = STEPS;
  const ticks = (from: number, to: number) => Array.from({ length: Math.floor((to - from) / 3) }, (_, i) => from + i * 3);
  const cues: [string, number, number][] = [
    ...ticks(s[0].at + 10, s[0].at + 85).map((f): [string, number, number] => ["tick", f, 0.1]),
    ["send", s[0].at + 90, 0.35],
    ...[100, 125, 150, 175].map((f): [string, number, number] => ["receive", s[0].at + f, 0.18]),
    ...[12, 55, 92, 132, 170, 240, 262].map((f): [string, number, number] => ["tick", s[1].at + f, 0.25]),
    ["receive", s[1].at + 212, 0.22],
    ...[10, 40, 75].map((f): [string, number, number] => ["receive", s[2].at + f, 0.18]),
    ["tick", s[3].at + 92, 0.25], ["receive", s[3].at + 98, 0.22],
    ["tick", s[4].at + 86, 0.25], ["receive", s[4].at + 92, 0.22],
    ...ticks(s[5].at + 8, s[5].at + 58).map((f): [string, number, number] => ["tick", f, 0.1]),
    ["send", s[5].at + 66, 0.35], ["receive", s[5].at + 100, 0.3], ["receive", s[5].at + 145, 0.3],
    ["outro", END, 0.6],
  ];
  return <>{cues.map(([name, at, volume], i) => <Sequence key={i} from={at} durationInFrames={55}><Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} /></Sequence>)}</>;
};

const scenes = [Step1, Step2, Step3, Step4, Step5, Step6];

export const SetupDemo = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Sfx />
    <Sequence durationInFrames={STEPS[0].at}><Title /></Sequence>
    {STEPS.map((s, i) => {
      const Scene = scenes[i];
      return <Sequence key={i} from={s.at} durationInFrames={s.len}><Stage len={s.len}><Scene /></Stage></Sequence>;
    })}
    <Caption />
    <Sequence from={END}><Outro /></Sequence>
  </AbsoluteFill>
);
