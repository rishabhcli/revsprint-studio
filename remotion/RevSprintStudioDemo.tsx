import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Accent = {
  primary: string;
  secondary: string;
  glow: string;
  card: string;
};

type Scene = {
  slug: string;
  durationInFrames: number;
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  footer: string;
  asset?: string;
  mode: "image" | "notes" | "system" | "finale";
  accent: Accent;
};

const shell = "#07141d";
const ink = "#f3f7fb";
const panelShadow = "0 30px 70px rgba(0, 0, 0, 0.34)";
const fontFamily = "\"Avenir Next\", \"Segoe UI\", sans-serif";
const displayFamily =
  "\"Avenir Next Condensed\", \"Franklin Gothic Medium\", \"Arial Narrow\", sans-serif";

const accents = {
  focus: {
    primary: "#0d1f2d",
    secondary: "#8df4d5",
    glow: "rgba(141,244,213,0.22)",
    card: "rgba(10, 26, 38, 0.88)",
  },
  study: {
    primary: "#11243a",
    secondary: "#9ec5ff",
    glow: "rgba(158,197,255,0.22)",
    card: "rgba(10, 27, 41, 0.9)",
  },
  warm: {
    primary: "#20192a",
    secondary: "#ffb780",
    glow: "rgba(255,183,128,0.22)",
    card: "rgba(24, 18, 31, 0.9)",
  },
};

const scenes: Scene[] = [
  {
    slug: "intro",
    durationInFrames: 360,
    eyebrow: "Dev Season of Code Demo",
    title: "RevSprint Studio turns scattered commercial notes into a six-week go-to-market sprint.",
    body:
      "The product starts from messy founder notes, pipeline signals, and positioning gaps, then reshapes them into a live sprint board, channel plays, and an exportable commercial brief.",
    bullets: [
      "Local-first GTM planning",
      "Prioritized plays scored for impact, confidence, and effort",
      "Static architecture that is easy to inspect and deploy",
    ],
    footer: "RevSprint Studio walkthrough",
    asset: "remotion/revsprint-full.jpg",
    mode: "image",
    accent: accents.focus,
  },
  {
    slug: "problem",
    durationInFrames: 420,
    eyebrow: "The planning gap",
    title: "Early teams already have customer signal. The real problem is that it lives in too many disconnected fragments.",
    body:
      "Call notes, objections, partnership ideas, budget pressure, and rough messaging drafts accumulate across docs and chats. RevSprint Studio starts from that reality instead of asking a team to rebuild everything inside a heavyweight CRM.",
    bullets: [
      "Raw notes become ranked commercial plays",
      "The six-week plan becomes visible immediately",
      "The output is reusable for founder syncs and advisor reviews",
    ],
    footer: "Notes become a plan",
    mode: "notes",
    accent: accents.warm,
  },
  {
    slug: "hero",
    durationInFrames: 390,
    eyebrow: "Commercial sprint",
    title: "The planner converts freeform GTM input into a believable six-week operating roadmap.",
    body:
      "The point is not to generate more admin. It is to give a founder or revenue lead one coherent view of what to test next, what channel motion deserves attention, and how the team should pace the sprint.",
    bullets: [
      "Message angles and channel plays stay tied to the plan",
      "Weekly pacing helps avoid random GTM thrash",
      "The system feels ready from the first launch",
    ],
    footer: "Revenue momentum",
    asset: "remotion/revsprint-hero.jpg",
    mode: "image",
    accent: accents.study,
  },
  {
    slug: "board",
    durationInFrames: 390,
    eyebrow: "Execution board",
    title: "Teams can move the sprint as market feedback changes without losing the structure.",
    body:
      "Plays flow across a board that keeps commercial pressure visible while staying readable. The board feels like a real operating surface for GTM work instead of a decorative dashboard.",
    bullets: [
      "Backlog, active motion, and closed wins stay separate",
      "Priority and owner context remain legible on every card",
      "The board complements the roadmap instead of replacing it",
    ],
    footer: "Live execution surface",
    asset: "remotion/revsprint-board.jpg",
    mode: "image",
    accent: accents.focus,
  },
  {
    slug: "brief",
    durationInFrames: 390,
    eyebrow: "Action brief",
    title: "The exported brief keeps the sprint ready for a founder review, advisor sync, or next planning pass.",
    body:
      "That matters because commercial planning needs something portable, not just a screen. RevSprint Studio keeps the summary, top bets, and next actions aligned with the live workspace.",
    bullets: [
      "Useful for team and advisor check-ins",
      "Helps another person or agent pick up the context fast",
      "Keeps the output valuable beyond one session",
    ],
    footer: "Portable commercial context",
    asset: "remotion/revsprint-full.jpg",
    mode: "image",
    accent: accents.warm,
  },
  {
    slug: "system",
    durationInFrames: 330,
    eyebrow: "Practical by design",
    title: "The architecture stays intentionally simple: static, local-first, offline-capable, and easy to host.",
    body:
      "The app runs fully in the browser, keeps its state locally, and deploys as static files. That keeps the demo resilient and makes the product easy to verify end to end.",
    bullets: [
      "No backend or secrets required",
      "Service worker keeps the shell available offline",
      "Static output is ready for straightforward hosting",
    ],
    footer: "Fast to review and extend",
    asset: "remotion/revsprint-icon.svg",
    mode: "system",
    accent: accents.study,
  },
  {
    slug: "finale",
    durationInFrames: 300,
    eyebrow: "Closing",
    title: "RevSprint Studio makes go-to-market planning feel concrete instead of chaotic.",
    body:
      "It is a compact, credible product for early teams: a planner, board, brief, and rhythm layer that starts from the messy commercial signals they already have.",
    bullets: [
      "Six-week GTM roadmap",
      "Execution board",
      "Reusable commercial brief",
    ],
    footer: "RevSprint Studio",
    asset: "remotion/revsprint-thumbnail.jpg",
    mode: "finale",
    accent: accents.focus,
  },
];

export const TOTAL_FRAMES = scenes.reduce((sum, scene) => sum + scene.durationInFrames, 0);

const sceneOffsets = scenes.reduce<Array<Scene & {from: number}>>((acc, scene) => {
  const from = acc.length === 0 ? 0 : acc[acc.length - 1].from + acc[acc.length - 1].durationInFrames;
  acc.push({...scene, from});
  return acc;
}, []);

const rawNotes = [
  "Outbound conversion is flat even though demos are increasing.",
  "Partner pilot interest is strong but the offer is still too broad.",
  "The founder keeps rewriting positioning instead of testing one story.",
  "Content ideas exist, but nothing maps clearly to one ICP motion.",
  "Budget is tight so each channel play needs a stronger confidence score.",
  "The advisor review should focus on the top bets, not every loose note.",
];

const fadeInOut = (frame: number, duration: number) => {
  const fadeIn = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [duration - 24, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return fadeIn * fadeOut;
};

const progressForFrame = (frame: number) =>
  interpolate(frame, [0, TOTAL_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const shellStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: shell,
  fontFamily,
  color: ink,
  position: "relative",
  overflow: "hidden",
};

const FloatingOrbs: React.FC<{accent: Accent; frame: number}> = ({accent, frame}) => {
  const travel = interpolate(frame, [0, TOTAL_FRAMES], [0, 160]);
  return (
    <>
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            width: 320 + index * 120,
            height: 320 + index * 120,
            borderRadius: 999,
            background:
              index % 2 === 0
                ? `radial-gradient(circle, ${accent.glow} 0%, rgba(255,255,255,0) 72%)`
                : `radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 72%)`,
            top: -80 + index * 180,
            left: index % 2 === 0 ? -80 + travel * 0.12 : 1180 - travel * 0.08,
            filter: "blur(8px)",
          }}
        />
      ))}
    </>
  );
};

const SceneCard: React.FC<{scene: Scene; localFrame: number}> = ({scene, localFrame}) => {
  const {fps} = useVideoConfig();
  const opacity = fadeInOut(localFrame, scene.durationInFrames);
  const cardLift = spring({
    fps,
    frame: localFrame,
    config: {damping: 18, stiffness: 95},
  });

  return (
    <div
      style={{
        width: 720,
        background: scene.accent.card,
        borderRadius: 34,
        padding: "42px 46px",
        boxShadow: panelShadow,
        backdropFilter: "blur(18px)",
        opacity,
        transform: `translateY(${(1 - cardLift) * 48}px) scale(${0.96 + cardLift * 0.04})`,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          fontSize: 24,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: scene.accent.secondary,
          marginBottom: 18,
          fontWeight: 700,
        }}
      >
        {scene.eyebrow}
      </div>
      <div
        style={{
          fontFamily: displayFamily,
          fontSize: 58,
          lineHeight: 1.02,
          fontWeight: 700,
          marginBottom: 20,
        }}
      >
        {scene.title}
      </div>
      <div
        style={{
          fontSize: 28,
          lineHeight: 1.4,
          color: "rgba(243,247,251,0.88)",
          marginBottom: 28,
        }}
      >
        {scene.body}
      </div>
      <div style={{display: "grid", gap: 14, marginBottom: 28}}>
        {scene.bullets.map((bullet, index) => (
          <div
            key={bullet}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 24,
              opacity: interpolate(localFrame, [20 + index * 10, 40 + index * 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: scene.accent.secondary,
                boxShadow: `0 0 0 10px ${scene.accent.glow}`,
              }}
            />
            <span>{bullet}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          fontSize: 20,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "rgba(243,247,251,0.56)",
        }}
      >
        {scene.footer}
      </div>
    </div>
  );
};

const NotesVisual: React.FC<{localFrame: number; accent: Accent}> = ({localFrame, accent}) => {
  return (
    <div
      style={{
        width: 720,
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 18,
      }}
    >
      {rawNotes.map((note, index) => {
        const enter = interpolate(localFrame, [index * 6, index * 6 + 24], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={note}
            style={{
              minHeight: 168,
              borderRadius: 28,
              padding: 24,
              background: "rgba(255,255,255,0.08)",
              border: `1px solid ${accent.glow}`,
              boxShadow: panelShadow,
              transform: `translateY(${(1 - enter) * 28}px) rotate(${(index % 2 === 0 ? -1 : 1) * (1 - enter) * 3}deg)`,
              opacity: enter,
            }}
          >
            <div
              style={{
                fontSize: 15,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: accent.secondary,
                marginBottom: 12,
              }}
            >
              Student signal
            </div>
            <div style={{fontSize: 26, lineHeight: 1.3}}>{note}</div>
          </div>
        );
      })}
    </div>
  );
};

const SceneVisual: React.FC<{scene: Scene; localFrame: number}> = ({scene, localFrame}) => {
  if (scene.mode === "notes") {
    return <NotesVisual localFrame={localFrame} accent={scene.accent} />;
  }

  const scale = 1.03 + spring({
    fps: 30,
    frame: localFrame,
    config: {damping: 14, stiffness: 90},
  }) * 0.02;

  return (
    <div
      style={{
        width: 820,
        height: 620,
        borderRadius: 36,
        overflow: "hidden",
        position: "relative",
        boxShadow: panelShadow,
        border: "1px solid rgba(255,255,255,0.08)",
        background: scene.mode === "system" ? "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))" : undefined,
      }}
    >
      {scene.asset ? (
        <Img
          src={staticFile(scene.asset)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: scene.mode === "system" ? "contain" : "cover",
            transform: `scale(${scale})`,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            scene.mode === "finale"
              ? "linear-gradient(180deg, rgba(7,20,29,0.08), rgba(7,20,29,0.72))"
              : "linear-gradient(180deg, rgba(7,20,29,0.02), rgba(7,20,29,0.28))",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "auto 24px 24px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 22px",
          borderRadius: 22,
          background: "rgba(7,20,29,0.58)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(14px)",
        }}
      >
        <div style={{fontSize: 20, letterSpacing: "0.14em", textTransform: "uppercase", color: scene.accent.secondary}}>
          {scene.footer}
        </div>
        <div style={{fontSize: 18, color: "rgba(243,247,251,0.7)"}}>
          {scene.slug.replaceAll("-", " ")}
        </div>
      </div>
    </div>
  );
};

const ProgressRail: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = progressForFrame(frame);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 10,
        background: "rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          background: "linear-gradient(90deg, #8df4d5, #9ec5ff, #ffb780)",
        }}
      />
    </div>
  );
};

export const RevSprintStudioDemo: React.FC = () => {
  return (
    <AbsoluteFill style={shellStyle}>
      <FloatingOrbs accent={accents.focus} frame={useCurrentFrame()} />
      <Audio src={staticFile("remotion/narration.mp3")} />
      {sceneOffsets.map((scene) => (
        <Sequence key={scene.slug} from={scene.from} durationInFrames={scene.durationInFrames}>
          <SceneLayout scene={scene} />
        </Sequence>
      ))}
      <ProgressRail />
    </AbsoluteFill>
  );
};

const SceneLayout: React.FC<{scene: Scene & {from: number}}> = ({scene}) => {
  const frame = useCurrentFrame() - scene.from;
  const opacity = fadeInOut(frame, scene.durationInFrames);

  return (
    <AbsoluteFill
      style={{
        padding: "86px 92px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        opacity,
      }}
    >
      <SceneCard scene={scene} localFrame={frame} />
      <SceneVisual scene={scene} localFrame={frame} />
    </AbsoluteFill>
  );
};
