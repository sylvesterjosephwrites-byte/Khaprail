// Subtle, fully static decorative background for the hero — scattered tile
// silhouettes (curved khaprail profile, flat square, hexagon, fish-scale
// scallop) at low opacity. Pure SVG, hand-placed instances, no animation and
// no per-frame cost alongside the hero's 3D canvas.
type TileShape = "arc" | "square" | "hex" | "scallop"

interface ShapeInstance {
  shape: TileShape
  x: number
  y: number
  size: number
  rotation: number
  opacity: number
  /** Right-side shapes that would otherwise sit awkwardly once the layout stacks on mobile. */
  desktopOnly?: boolean
}

// Hand-placed across a 1600x800 canvas: denser/larger toward the corners and
// edges, sparse and small directly behind the headline's typical position
// (roughly x 60-820, y 150-650) so text contrast is never affected.
const SHAPES: ShapeInstance[] = [
  { shape: "arc", x: 80, y: 90, size: 70, rotation: -12, opacity: 0.1 },
  { shape: "hex", x: 1520, y: 80, size: 60, rotation: 15, opacity: 0.08, desktopOnly: true },
  { shape: "square", x: 60, y: 700, size: 55, rotation: 20, opacity: 0.09 },
  { shape: "scallop", x: 1540, y: 720, size: 65, rotation: -8, opacity: 0.1, desktopOnly: true },
  { shape: "arc", x: 1470, y: 650, size: 50, rotation: 35, opacity: 0.07, desktopOnly: true },
  { shape: "hex", x: 150, y: 760, size: 45, rotation: -25, opacity: 0.08 },
  { shape: "square", x: 950, y: 120, size: 40, rotation: 10, opacity: 0.07, desktopOnly: true },
  { shape: "scallop", x: 1250, y: 180, size: 45, rotation: 5, opacity: 0.08, desktopOnly: true },
  { shape: "hex", x: 1100, y: 700, size: 42, rotation: 40, opacity: 0.07, desktopOnly: true },
  { shape: "arc", x: 1350, y: 380, size: 38, rotation: -20, opacity: 0.06, desktopOnly: true },
  { shape: "square", x: 1550, y: 400, size: 35, rotation: -15, opacity: 0.06, desktopOnly: true },
  { shape: "hex", x: 40, y: 380, size: 30, rotation: 8, opacity: 0.05 },
  { shape: "scallop", x: 780, y: 55, size: 28, rotation: 0, opacity: 0.05 },
  { shape: "square", x: 40, y: 180, size: 25, rotation: 30, opacity: 0.05 },
]

function ShapePath({ shape }: { shape: TileShape }) {
  switch (shape) {
    case "arc":
      return (
        <path d="M -18 14 C -18 -10 -8 -22 0 -22 C 8 -22 18 -10 18 14 L 12 14 C 12 -6 6 -16 0 -16 C -6 -16 -12 -6 -12 14 Z" />
      )
    case "square":
      return <rect x={-16} y={-16} width={32} height={32} rx={4} />
    case "hex":
      return <polygon points="18,0 9,15.6 -9,15.6 -18,0 -9,-15.6 9,-15.6" />
    case "scallop":
      return <path d="M -16 -8 A 16 16 0 0 1 16 -8 Z" />
  }
}

export function HeroTilePattern({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1600 800"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {SHAPES.map((s, i) => (
        <g
          key={i}
          transform={`translate(${s.x} ${s.y}) rotate(${s.rotation}) scale(${s.size / 20})`}
          opacity={s.opacity}
          className={s.desktopOnly ? "hidden fill-primary sm:block" : "fill-primary"}
        >
          <ShapePath shape={s.shape} />
        </g>
      ))}
    </svg>
  )
}
