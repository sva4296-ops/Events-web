import { useId, type ReactNode } from "react";

import { type CoverDecoration, type CoverTheme } from "@/lib/coverThemes";

/** Every cover is drawn in this box and cropped to fill (slice), so any size works. */
const W = 160;
const H = 100;

/** A cover drawn in code: gradient, two glows, one decoration (the app's components/CoverArt.tsx). */
export function CoverArt({
  theme,
  harmonize,
  plain = false,
  className,
  children,
}: {
  theme: CoverTheme;
  /** Pull the base colors 22% toward the accent, as the app's harmonizeCoverTheme does for picked themes. */
  harmonize: boolean;
  /** Gradient and glows only: a decoration turns into a smudge at thumbnail size. */
  plain?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const id = useId();
  const stop = (color: string) =>
    harmonize ? `color-mix(in srgb, ${color} 78%, var(--accent-fill))` : color;
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 size-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: stop(theme.colors[0]) }} />
            <stop offset="0.55" style={{ stopColor: stop(theme.colors[1]) }} />
            <stop offset="1" style={{ stopColor: stop(theme.colors[2]) }} />
          </linearGradient>
          {theme.glows.map(([color], index) => (
            <radialGradient key={index} id={`${id}-glow-${index}`} cx="50%" cy="50%" r="50%">
              <stop offset="0" style={{ stopColor: color, stopOpacity: 0.75 }} />
              <stop offset="1" style={{ stopColor: color, stopOpacity: 0 }} />
            </radialGradient>
          ))}
        </defs>
        <rect x="0" y="0" width={W} height={H} fill={`url(#${id}-bg)`} />
        {theme.glows.map(([, x, y], index) => (
          <circle key={index} cx={x * W} cy={y * H} r={52} fill={`url(#${id}-glow-${index})`} />
        ))}
        {plain ? null : <Decoration kind={theme.decoration} ink={theme.ink} />}
      </svg>
      {children}
    </div>
  );
}

function Sparkle({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  const k = r * 0.22;
  return (
    <path
      d={`M${x} ${y - r} L${x + k} ${y - k} L${x + r} ${y} L${x + k} ${y + k} L${x} ${y + r} L${x - k} ${y + k} L${x - r} ${y} L${x - k} ${y - k} Z`}
      fill={fill}
    />
  );
}

function Decoration({ kind, ink }: { kind: CoverDecoration; ink: string }) {
  const stroke = { stroke: ink, fill: 'none', strokeLinecap: 'round' as const };
  switch (kind) {
    case 'rings':
      return (
        <g opacity={0.6}>
          {[10, 18, 26, 34].map((r) => (
            <circle key={r} cx={120} cy={35} r={r} {...stroke} strokeWidth={0.6} />
          ))}
          <circle cx={120} cy={35} r={4} fill={ink} />
        </g>
      );
    case 'confetti':
      return (
        <g opacity={0.85}>
          {[
            [20, 18, '#FFD166'], [42, 30, ink], [70, 14, '#FF8FB5'], [105, 26, '#FFD166'],
            [130, 12, ink], [145, 36, '#FF8FB5'], [30, 50, '#FF8FB5'], [118, 52, ink],
          ].map(([x, y, c], i) => (
            <rect key={i} x={x as number} y={y as number} width={4} height={1.6} rx={0.8} fill={c as string} transform={`rotate(${i * 37} ${x} ${y})`} />
          ))}
        </g>
      );
    case 'sparkles':
      return (
        <g>
          <Sparkle x={128} y={30} r={11} fill={ink} />
          <Sparkle x={38} y={62} r={7} fill={ink} />
          <path d="M96 16v8M92 20h8M140 64v6M137 67h6" stroke={ink} strokeWidth={1} opacity={0.5} />
        </g>
      );
    case 'bars':
      return (
        <g>
          {[22, 34, 16, 40, 28, 12].map((h, i) => (
            <rect key={i} x={112 + i * 7} y={78 - h} width={3.5} height={h} rx={1.5} fill={ink} opacity={0.8} />
          ))}
        </g>
      );
    case 'disco':
      return (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={110} y1={34} x2={30 + i * 14} y2={100} stroke={ink} strokeWidth={0.5} opacity={0.35} />
          ))}
          <circle cx={110} cy={34} r={14} fill="#D9D4F5" opacity={0.9} />
          <path d="M96 34h28M110 20v28M100 26h20M100 42h20M103 21v26M117 21v26" stroke="#8C84C8" strokeWidth={0.6} />
          <Sparkle x={24} y={22} r={5} fill={ink} />
        </g>
      );
    case 'neon':
      return (
        <g>
          <rect x={104} y={14} width={44} height={22} rx={11} {...stroke} strokeWidth={1.6} />
          <path d="M20 78 Q32 66 44 78 T68 78 T92 78" stroke="#D07CFF" strokeWidth={1.6} fill="none" />
        </g>
      );
    case 'fireworks':
      return (
        <g>
          {[[40, 26, 12], [118, 20, 14], [86, 48, 6]].map(([cx, cy, r], i) => (
            <g key={i}>
              {Array.from({ length: 12 }, (_, k) => {
                const a = (k / 12) * Math.PI * 2;
                return (
                  <line
                    key={k}
                    x1={cx! + Math.cos(a) * r! * 0.35}
                    y1={cy! + Math.sin(a) * r! * 0.35}
                    x2={cx! + Math.cos(a) * r!}
                    y2={cy! + Math.sin(a) * r!}
                    stroke={i === 2 ? '#FF7FB0' : ink}
                    strokeWidth={0.7}
                  />
                );
              })}
            </g>
          ))}
        </g>
      );
    case 'tree':
      return (
        <g>
          <path d="M128 18 L144 46 H136 L148 66 H108 L120 46 H112 Z" {...stroke} strokeWidth={1} />
          {[[30, 20], [56, 40], [20, 60], [80, 18], [92, 62]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.3} fill={ink} />
          ))}
        </g>
      );
    case 'moon':
      return (
        <g>
          <circle cx={118} cy={30} r={14} fill={ink} />
          <circle cx={124} cy={26} r={12} fill="#2B1638" opacity={0.55} />
        </g>
      );
    case 'wedrings':
      // Two linked wedding rings.
      return (
        <g opacity={0.7}>
          <circle cx={68} cy={50} r={20} {...stroke} strokeWidth={0.9} />
          <circle cx={92} cy={50} r={20} {...stroke} strokeWidth={0.9} />
        </g>
      );
    case 'hearts': {
      const heart = (x: number, y: number, k: number) =>
        `M${x} ${y + 6 * k} C${x - 10 * k} ${y - 2 * k} ${x - 6 * k} ${y - 10 * k} ${x} ${y - 4 * k} C${x + 6 * k} ${y - 10 * k} ${x + 10 * k} ${y - 2 * k} ${x} ${y + 6 * k} Z`;
      return (
        <g opacity={0.85}>
          <path d={heart(124, 34, 2)} {...stroke} strokeWidth={1} />
          <path d={heart(146, 60, 0.9)} fill={ink} opacity={0.6} />
          <path d={heart(98, 56, 0.7)} {...stroke} strokeWidth={0.8} />
        </g>
      );
    }
    case 'flags':
      // Festival bunting: a string of little pennants.
      return (
        <g opacity={0.85}>
          <path d="M10 14 Q80 34 150 14" {...stroke} strokeWidth={0.7} />
          {[22, 40, 58, 76, 94, 112, 130].map((x, i) => {
            const y = 14 + 20 * Math.sin(((x - 10) / 140) * Math.PI) * 0.7;
            return <path key={x} d={`M${x - 5} ${y} L${x + 5} ${y} L${x} ${y + 9} Z`} fill={ink} opacity={i % 2 === 0 ? 0.9 : 0.5} />;
          })}
        </g>
      );
    case 'gold':
      return (
        <g>
          <line x1={0} y1={18} x2={W} y2={18} stroke={ink} strokeWidth={0.4} opacity={0.6} />
          <line x1={0} y1={84} x2={W} y2={84} stroke={ink} strokeWidth={0.4} opacity={0.6} />
          <line x1={0} y1={87} x2={W} y2={87} stroke={ink} strokeWidth={0.4} opacity={0.4} />
          <path d="M80 10 l3 3 -3 3 -3 -3 Z" fill={ink} />
        </g>
      );
    case 'crescent':
      return (
        <g>
          <path d="M130 16 A16 16 0 1 0 146 40 A12 12 0 1 1 130 16 Z" {...stroke} strokeWidth={1} />
          <circle cx={40} cy={30} r={1.2} fill={ink} />
          <circle cx={70} cy={56} r={1} fill={ink} />
        </g>
      );
    case 'balloons':
      return (
        <g opacity={0.9}>
          <circle cx={120} cy={30} r={9} fill="#FFC0D4" />
          <circle cx={136} cy={40} r={8} fill="#B9E3FF" />
          <path d="M120 39 Q118 55 122 70 M136 48 Q138 60 132 72" stroke={ink} strokeWidth={0.6} fill="none" />
        </g>
      );
    case 'leaf':
      return (
        <g>
          <path d="M118 70 Q120 36 146 22 Q144 56 118 70 Z" {...stroke} strokeWidth={1} />
          <path d="M118 70 Q130 48 146 22" {...stroke} strokeWidth={0.6} />
        </g>
      );
    case 'sun':
      return (
        <g>
          <circle cx={80} cy={54} r={14} fill="#FFF3DA" />
          <rect x={0} y={62} width={W} height={38} fill="#1E6A86" opacity={0.85} />
          <path d="M0 72 Q20 68 40 72 T80 72 T120 72 T160 72 M0 84 Q20 80 40 84 T80 84 T120 84 T160 84" stroke={ink} strokeWidth={0.6} fill="none" opacity={0.6} />
        </g>
      );
    case 'aurora':
      return (
        <g opacity={0.55}>
          <path d="M0 40 Q40 10 80 34 T160 20" stroke="#3FE0B0" strokeWidth={8} fill="none" />
          <path d="M0 56 Q50 30 90 50 T160 40" stroke="#8E5CFF" strokeWidth={6} fill="none" />
        </g>
      );
    case 'grid':
      return (
        <g opacity={0.5}>
          {[20, 40, 60, 80, 100, 120, 140].map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} stroke={ink} strokeWidth={0.3} />
          ))}
          {[20, 40, 60, 80].map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} stroke={ink} strokeWidth={0.3} />
          ))}
          <path d="M10 80 L50 58 L80 68 L120 36 L150 44" stroke="#FFFFFF" strokeWidth={1.2} fill="none" />
        </g>
      );
    case 'cap':
      return (
        <g>
          <path d="M120 22 L146 32 L120 42 L94 32 Z" fill={ink} />
          <path d="M106 37 V48 Q120 56 134 48 V37" fill={ink} opacity={0.85} />
          <line x1={146} y1={32} x2={146} y2={48} stroke={ink} strokeWidth={1} />
        </g>
      );
    case 'plate':
      return (
        <g opacity={0.6}>
          <circle cx={124} cy={34} r={18} {...stroke} strokeWidth={0.9} />
          <circle cx={124} cy={34} r={12} {...stroke} strokeWidth={0.6} />
          <path d="M18 70 Q60 60 100 78" {...stroke} strokeWidth={0.6} />
        </g>
      );
    case 'arch':
      return (
        <g opacity={0.75}>
          <path d="M104 86 V40 A24 24 0 0 1 152 40 V86" {...stroke} strokeWidth={1} />
          <path d="M112 86 V42 A16 16 0 0 1 144 42 V86" {...stroke} strokeWidth={0.6} />
          <circle cx={128} cy={22} r={1.4} fill={ink} />
        </g>
      );
    case 'petals':
      return (
        <g opacity={0.8}>
          {[0, 72, 144, 216, 288].map((angle) => (
            <path
              key={angle}
              d="M128 34 C122 24 122 16 128 10 C134 16 134 24 128 34 Z"
              {...stroke}
              strokeWidth={0.8}
              transform={`rotate(${angle} 128 34)`}
            />
          ))}
          <circle cx={128} cy={34} r={2.2} fill={ink} />
          <path d="M30 70 C34 64 40 64 44 70 C40 76 34 76 30 70 Z" {...stroke} strokeWidth={0.7} />
        </g>
      );
    case 'stars':
      return (
        <g>
          {[[30, 18, 1.2], [52, 40, 0.8], [76, 14, 1], [104, 30, 1.4], [136, 16, 0.9], [148, 46, 1.1], [20, 52, 0.7], [120, 58, 0.8]].map(
            ([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} fill={ink} opacity={0.85} />
            ),
          )}
          <Sparkle x={124} y={28} r={6} fill={ink} />
        </g>
      );
    case 'waves':
      return (
        <g opacity={0.6}>
          {[52, 62, 72, 82].map((y) => (
            <path key={y} d={`M0 ${y} Q20 ${y - 6} 40 ${y} T80 ${y} T120 ${y} T160 ${y}`} {...stroke} strokeWidth={0.8} />
          ))}
        </g>
      );
    case 'candle':
      return (
        <g>
          <rect x={122} y={40} width={12} height={36} rx={2} {...stroke} strokeWidth={1} />
          <path d="M128 38 C124 32 126 26 128 22 C130 26 132 32 128 38 Z" fill={ink} />
          <circle cx={128} cy={30} r={12} fill={ink} opacity={0.12} />
        </g>
      );
    case 'dots':
      return (
        <g opacity={0.7}>
          {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: 6 }, (_, col) => (
              <circle key={`${row}-${col}`} cx={100 + col * 10} cy={14 + row * 10} r={1.4} fill={ink} />
            )),
          )}
        </g>
      );
    case 'glass':
      return (
        <g opacity={0.85}>
          <path d="M118 18 H138 C138 32 134 40 128 40 C122 40 118 32 118 18 Z" {...stroke} strokeWidth={1} />
          <path d="M128 40 V62 M120 62 H136" {...stroke} strokeWidth={1} />
          <path d="M120 28 C124 30 132 30 136 28" {...stroke} strokeWidth={0.6} />
        </g>
      );
    case 'drop':
      return (
        <g opacity={0.8}>
          <path d="M128 14 C136 28 142 36 142 46 A14 14 0 0 1 114 46 C114 36 120 28 128 14 Z" {...stroke} strokeWidth={1} />
          <path d="M122 46 A6 6 0 0 0 128 52" {...stroke} strokeWidth={0.7} />
          <circle cx={40} cy={60} r={1.2} fill={ink} />
          <circle cx={58} cy={30} r={0.9} fill={ink} />
        </g>
      );
    case 'table':
      // A bistro table with two chairs, side view, and a little lamp above.
      return (
        <g opacity={0.85}>
          <path d="M108 56 H148 M128 56 V80 M120 80 H136" {...stroke} strokeWidth={1.2} />
          <path d="M98 46 V80 M98 62 H108 V80" {...stroke} strokeWidth={1} />
          <path d="M158 46 V80 M158 62 H148 V80" {...stroke} strokeWidth={1} />
          <path d="M128 14 V28 M120 34 Q128 24 136 34 Z" {...stroke} strokeWidth={0.9} />
          <circle cx={128} cy={38} r={6} fill={ink} opacity={0.15} />
          <path d="M122 56 V50 H126 V56 M130 56 V48 H134 V56" {...stroke} strokeWidth={0.7} />
        </g>
      );
    case 'rise':
      // A sun on the horizon with a few rays: hope, dusk. No water (that's 'sun', the beach).
      return (
        <g opacity={0.85}>
          <path d="M100 70 A28 28 0 0 1 156 70 Z" fill={ink} opacity={0.35} />
          <path d="M88 70 H168" {...stroke} strokeWidth={1} />
          {[-60, -30, 0, 30, 60].map((angle) => (
            <line
              key={angle}
              x1={128 + Math.sin((angle * Math.PI) / 180) * 34}
              y1={70 - Math.cos((angle * Math.PI) / 180) * 34}
              x2={128 + Math.sin((angle * Math.PI) / 180) * 42}
              y2={70 - Math.cos((angle * Math.PI) / 180) * 42}
              stroke={ink}
              strokeWidth={1}
              strokeLinecap="round"
            />
          ))}
        </g>
      );
    case 'line':
      return (
        <g>
          <circle cx={124} cy={30} r={14} {...stroke} strokeWidth={0.8} />
          <line x1={24} y1={70} x2={70} y2={70} stroke={ink} strokeWidth={0.8} />
        </g>
      );
  }
}

