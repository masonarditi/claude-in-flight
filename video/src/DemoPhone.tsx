import { AbsoluteFill, Audio, getInputProps, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { siAmericanairlines, siDelta, siSouthwestairlines, siUnitedairlines } from "simple-icons";
import { svgPathBbox } from "svg-path-bbox";

export const C = { bg: "#fbfbfa", blue: "#0a84ff", gray: "#e9e9eb", ink: "#111", dim: "#8e8e93", orange: "#d97757" };
const AIRLINES: { icon: { title: string; path: string }; crop?: number[] }[] = [
  { icon: siUnitedairlines }, { icon: siDelta, crop: [0, 10.15, 4.2, 3.7] }, { icon: siAmericanairlines }, { icon: siSouthwestairlines },
];

export const Badge = ({ size }: { size: number }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: "linear-gradient(180deg, #ffcf9e, #ffab6b)", display: "grid", placeItems: "center", fontSize: size * 0.5 }}>✈️</div>
);
export const sans = "-apple-system, 'SF Pro Text', system-ui, sans-serif";
export const serif = "'New York', 'Iowan Old Style', Georgia, serif";

const ME1 = "ask claude code to add dark mode to the settings page in my-app";
const ME2 = "you're goated";
const ME3 = "now make goon bot";
const T = { type1: 12, send1: 80, dots1: [96, 140], agent1: 140, note: 190, dots2: [206, 250], agent2: 250, photo: 272, agent3: 312, type2: 345, send2: 375, type3: 400, send3: 432, cut: 447 };
export const PHONE_DURATION = 447 + 90;

export const useSpring = (at: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping: 18, mass: 0.7 } });
};

const Tail = ({ color, me }: { color: string; me: boolean }) => (
  <svg width="14" height="18" viewBox="0 0 14 18" style={{ position: "absolute", bottom: 0, [me ? "right" : "left"]: -5, transform: me ? undefined : "scaleX(-1)" }}>
    <path d="M0 0 L0 17 Q4 18 14 18 Q7 14 6 0 Z" fill={color} />
  </svg>
);

const Row = ({ at, until = Infinity, h = 120, children }: { at: number; until?: number; h?: number; children: React.ReactNode }) => {
  const frame = useCurrentFrame();
  const p = useSpring(at);
  if (frame < at || frame >= until) return null;
  return (
    <div style={{ maxHeight: p * h, opacity: p, transform: `translateY(${(1 - p) * 24}px)`, display: "flex", flexDirection: "column" }}>
      {children}
    </div>
  );
};

export const Bubble = ({ me, text, tail = true }: { me?: boolean; text: string; tail?: boolean }) => (
  <div style={{ alignSelf: me ? "flex-end" : "flex-start", position: "relative", maxWidth: 236, margin: "3px 4px", padding: "8px 13px", borderRadius: 19,
    fontSize: 15.5, lineHeight: 1.3, background: me ? C.blue : C.gray, color: me ? "#fff" : C.ink }}>
    {text}
    {tail && <Tail color={me ? C.blue : C.gray} me={!!me} />}
  </div>
);

const Dots = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ alignSelf: "flex-start", position: "relative", margin: "3px 4px", padding: "12px 14px", borderRadius: 19, background: C.gray, display: "flex", gap: 5 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: 4, background: "#8a8a8f", opacity: 0.35 + 0.65 * Math.abs(Math.sin((frame - i * 5) / 7)) }} />
      ))}
      <Tail color={C.gray} me={false} />
    </div>
  );
};

const Setting = ({ label, on, value }: { label: string; on?: boolean; value?: string }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 10px", borderRadius: 10, background: "#1d2028", fontSize: 11, color: "#e8e8ec" }}>
    {label}
    {value ? <span style={{ color: "#8e8e93" }}>{value} ›</span> : (
      <div style={{ width: 30, height: 18, borderRadius: 9, background: on ? "#34c759" : "#3a3a3f", padding: 2, display: "flex", justifyContent: on ? "flex-end" : "flex-start" }}>
        <div style={{ width: 14, height: 14, borderRadius: 7, background: "#fff" }} />
      </div>
    )}
  </div>
);

const Shot = () => (
  <div style={{ alignSelf: "flex-start", margin: "3px 4px", width: 196, height: 252, borderRadius: 18, overflow: "hidden", background: "#0f1116", border: "1px solid #e2e2e6",
    display: "flex", flexDirection: "column", gap: 7, padding: "12px 10px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#8e8e93" }}><span>my-app</span><span>localhost:3000/settings</span></div>
    <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "4px 2px 2px" }}>Settings</div>
    <Setting label="Dark mode" on />
    <Setting label="Notifications" on />
    <Setting label="Language" value="English" />
    <Setting label="Account" value="Mason" />
    <div style={{ marginTop: "auto", alignSelf: "center", fontSize: 9, color: "#5d5d63" }}>screenshot · 9:42 AM</div>
  </div>
);

const Center = ({ text }: { text: string }) => (
  <div style={{ alignSelf: "center", fontSize: 11.5, color: C.dim, margin: "10px 0 6px" }}>{text}</div>
);

export const StatusBar = () => (
  <div style={{ height: 54, position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px 0 34px", fontSize: 15, fontWeight: 600 }}>
    <span>9:41</span>
    <div style={{ position: "absolute", left: "50%", top: 11, transform: "translateX(-50%)", width: 100, height: 30, borderRadius: 16, background: "#000" }} />
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <svg width="18" height="12" viewBox="0 0 18 12">{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 5} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="1" fill="#000" />)}</svg>
      <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5 L5.6 8.8 A3.4 3.4 0 0 1 10.4 8.8 Z M3.2 6.4 A6.8 6.8 0 0 1 12.8 6.4 L11.6 7.6 A5.1 5.1 0 0 0 4.4 7.6 Z M0.8 4 A10.2 10.2 0 0 1 15.2 4 L14 5.2 A8.5 8.5 0 0 0 2 5.2 Z" fill="#000" /></svg>
      <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
        <div style={{ width: 24, height: 12, borderRadius: 4, border: "1.2px solid #999", padding: 1.5 }}><div style={{ width: "100%", height: "100%", borderRadius: 2, background: "#000" }} /></div>
        <div style={{ width: 1.5, height: 4, borderRadius: 1, background: "#999" }} />
      </div>
    </div>
  </div>
);

const Circle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 38, height: 38, borderRadius: 19, background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.12)", display: "grid", placeItems: "center" }}>{children}</div>
);

const Header = () => (
  <div style={{ height: 92, display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "4px 16px 0" }}>
    <Circle><svg width="11" height="18" viewBox="0 0 11 18"><path d="M9 2 L2 9 L9 16" stroke="#000" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></Circle>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ borderRadius: 26, boxShadow: "0 1px 6px rgba(0,0,0,0.1)" }}><Badge size={52} /></div>
      <div style={{ marginTop: -6, padding: "3px 10px", borderRadius: 12, background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.12)", fontSize: 12.5, fontWeight: 600 }}>Claude in Flight ›</div>
    </div>
    <Circle><svg width="22" height="15" viewBox="0 0 22 15"><rect x="1" y="1.5" width="13.5" height="12" rx="3" stroke="#000" strokeWidth="1.8" fill="none" /><path d="M15.5 6 L20.5 3 L20.5 12 L15.5 9 Z" stroke="#000" strokeWidth="1.8" fill="none" strokeLinejoin="round" /></svg></Circle>
  </div>
);

const InputBar = () => {
  const frame = useCurrentFrame();
  const typing = ([text, from, to]: [string, number, number]) => frame >= from && frame < to ? text.slice(0, Math.ceil((frame - from) * (text.length / (to - from - 6)))) : "";
  const typed = [[ME1, T.type1, T.send1], [ME2, T.type2, T.send2], [ME3, T.type3, T.send3]].map((m) => typing(m as [string, number, number])).join("");
  return (
    <div style={{ height: 66, display: "flex", alignItems: "center", gap: 8, padding: "0 12px 14px" }}>
      <div style={{ width: 36, height: 36, borderRadius: 18, background: "#f1f1f3", display: "grid", placeItems: "center", fontSize: 24, fontWeight: 300, color: "#444" }}>+</div>
      <div style={{ flex: 1, minHeight: 36, borderRadius: 18, border: "1px solid #dcdce0", display: "flex", alignItems: "center", padding: "6px 12px", fontSize: 15, color: typed ? C.ink : "#a1a1a6", overflow: "hidden" }}>
        <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", direction: typed.length > 26 ? "rtl" : "ltr", textAlign: "left" }}>{typed || "iMessage"}</span>
        <svg width="12" height="18" viewBox="0 0 12 18" style={{ marginLeft: 6 }}><rect x="3.5" y="1" width="5" height="10" rx="2.5" fill="#8e8e93" /><path d="M1 8.5 A5 5 0 0 0 11 8.5 M6 13.5 V17" stroke="#8e8e93" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
      </div>
    </div>
  );
};

const Phone = () => {
  return (
    <div style={{ position: "relative", width: 344, height: 712, borderRadius: 62, padding: 4, background: "linear-gradient(135deg,#d8d3cd,#8f8a84 45%,#cfcac4 70%,#7e7974)", boxShadow: "0 40px 90px rgba(0,0,0,0.18)" }}>
      {[[-3, 120, 26], [-3, 168, 52], [-3, 230, 52], [341, 190, 80]].map(([x, y, h], i) => (
        <div key={i} style={{ position: "absolute", left: x, top: y, width: 6, height: h, borderRadius: 3, background: "#9c968f" }} />
      ))}
      <div style={{ width: "100%", height: "100%", borderRadius: 58, background: "#0b0b0c", padding: 10 }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 48, background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column", fontFamily: sans, color: C.ink, position: "relative" }}>
          <StatusBar />
          <Header />
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 10px" }}>
            <Row at={T.send1 - 2} h={40}><Center text="Today 9:41 AM" /></Row>
            <Row at={T.send1}><Bubble me text={ME1} /></Row>
            <Row at={T.dots1[0]} until={T.dots1[1]} h={50}><Dots /></Row>
            <Row at={T.agent1}><Bubble text="on it ✈️ started task 3f9a2c" /></Row>
            <Row at={T.note} h={40}><Center text="30 seconds later" /></Row>
            <Row at={T.dots2[0]} until={T.dots2[1]} h={50}><Dots /></Row>
            <Row at={T.agent2}><Bubble text="done ✅ dark mode added to settings, tests pass" tail={false} /></Row>
            <Row at={T.photo} h={270}><Shot /></Row>
            <Row at={T.agent3}><Bubble text="opened PR #42 in my-app ↗" /></Row>
            <Row at={T.send2} h={60}><Bubble me text={ME2} tail={false} /></Row>
            <Row at={T.send3} h={60}><Bubble me text={ME3} /></Row>
          </div>
          <InputBar />
          <div style={{ position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", width: 120, height: 5, borderRadius: 3, background: "#000" }} />
        </div>
      </div>
    </div>
  );
};

const Airline = ({ icon, crop, at }: { icon: { title: string; path: string }; crop?: number[]; at: number }) => {
  const p = useSpring(at);
  const [x0, y0, x1, y1] = svgPathBbox(icon.path);
  const [x, y, w, h] = crop ?? [x0, y0, x1 - x0, y1 - y0];
  const r = w / h;
  return (
    <svg width={Math.sqrt(1500 * r)} height={Math.sqrt(1500 / r)} viewBox={`${x} ${y} ${w} ${h}`} style={{ opacity: p * 0.75, transform: `translateY(${(1 - p) * 10}px)` }}>
      <title>{icon.title}</title>
      <path d={icon.path} fill="#55554f" />
    </svg>
  );
};

export const Outro = () => {
  const p = useSpring(4);
  return (
    <AbsoluteFill style={{ background: "#0b0d12", justifyContent: "center", alignItems: "center", gap: 18, fontFamily: sans, color: "#f5f5f7" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: p, transform: `scale(${0.92 + p * 0.08})` }}>
        <Badge size={84} />
        <div style={{ fontSize: 72, fontWeight: 800 }}>claude-in-flight</div>
      </div>
      <div style={{ fontSize: 30, color: C.dim, opacity: p }}>github.com/masonarditi/claude-in-flight</div>
    </AbsoluteFill>
  );
};

const Main = () => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: sans, flexDirection: "row", alignItems: "center", padding: "0 110px 0 100px", justifyContent: "space-between" }}>
    <div style={{ width: 600, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ fontFamily: serif, fontSize: 64, lineHeight: 1.05, color: C.ink, letterSpacing: -1 }}>
        Code from 34,000 ft.<br /><span style={{ background: "linear-gradient(180deg, #ffb67c, #ff9852)", WebkitBackgroundClip: "text", color: "transparent", fontStyle: "italic", paddingRight: 6 }}>For free.</span>
      </div>
      <div style={{ fontFamily: serif, fontSize: 24, lineHeight: 1.4, color: "#55554f" }}>
        Text Claude Code over free in-flight messaging. No Wi‑Fi to buy, and way faster than plane Wi‑Fi.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, color: C.dim }}>WORKS ON</div>
        <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
          {AIRLINES.map((a, i) => <Airline key={a.icon.title} {...a} at={20 + i * 8} />)}
          <span style={{ fontSize: 14, color: C.dim }}>& more</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, fontSize: 17, color: C.ink }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: C.blue, display: "grid", placeItems: "center" }}>
          <svg width="18" height="16" viewBox="0 0 18 16"><path d="M1 8 H16 M10 2 L16 8 L10 14" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        github.com/masonarditi/claude-in-flight
      </div>
    </div>
    <Phone />
  </AbsoluteFill>
);

const Sfx = () => {
  const dir = (getInputProps() as { sfx?: string }).sfx ?? "sfx";
  const tickVolume = dir === "sfx" ? 0.15 : 0.6;
  const ticks = [[T.type1, T.send1], [T.type2, T.send2], [T.type3, T.send3]].flatMap(([from, to]) => Array.from({ length: Math.floor((to - 6 - from) / 3) }, (_, i) => from + i * 3));
  const cues: [string, number, number][] = [
    ...ticks.map((f): [string, number, number] => ["tick", f, tickVolume]),
    ...[T.send1, T.send2, T.send3].map((f): [string, number, number] => ["send", f, 0.5]),
    ...[T.agent1, T.agent2, T.photo, T.agent3].map((f): [string, number, number] => ["receive", f, 0.45]),
    ["outro", T.cut, 0.8],
  ];
  return <>{cues.map(([name, at, volume], i) => <Sequence key={i} from={at} durationInFrames={55}><Audio src={staticFile(`${dir}/${name}.wav`)} volume={volume} /></Sequence>)}</>;
};

export const DemoPhone = () => (
  <AbsoluteFill>
    <Sfx />
    <Sequence durationInFrames={T.cut}><Main /></Sequence>
    <Sequence from={T.cut}><Outro /></Sequence>
  </AbsoluteFill>
);
