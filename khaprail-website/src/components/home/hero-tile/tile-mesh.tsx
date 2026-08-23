import { useMemo } from "react"
import * as THREE from "three"

// A procedural curved khaprail (barrel-style) roof tile — no real .glb asset
// exists yet, so this builds a convincing clay tile directly: an arc cross-
// section with wall thickness, extruded along the tile's length.
const OUTER_RADIUS = 1
const WALL_THICKNESS = 0.16
const ARCH_DEGREES = 140
const TILE_LENGTH = 2.4

function buildTileGeometry() {
  const innerRadius = OUTER_RADIUS - WALL_THICKNESS
  const archRad = THREE.MathUtils.degToRad(ARCH_DEGREES)
  const startAngle = Math.PI / 2 - archRad / 2
  const endAngle = Math.PI / 2 + archRad / 2

  const shape = new THREE.Shape()
  shape.absarc(0, 0, OUTER_RADIUS, startAngle, endAngle, false)
  shape.lineTo(innerRadius * Math.cos(endAngle), innerRadius * Math.sin(endAngle))
  shape.absarc(0, 0, innerRadius, endAngle, startAngle, true)
  shape.closePath()

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: TILE_LENGTH,
    bevelEnabled: false,
    curveSegments: 24,
  })
  geometry.center()
  return geometry
}

// Cheap canvas-generated speckle texture instead of a downloaded image —
// keeps the decoration self-contained and modest in size, per the
// performance constraint, while avoiding a flat/plastic-looking material.
function buildClayTexture() {
  const size = 256
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  ctx.fillStyle = "#c96a3d"
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 3500; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const dark = Math.random() > 0.5
    ctx.fillStyle = dark
      ? `rgba(59, 42, 32, ${(Math.random() * 0.1).toFixed(3)})`
      : `rgba(232, 179, 133, ${(Math.random() * 0.1).toFixed(3)})`
    ctx.fillRect(x, y, 1.4, 1.4)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 3)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function TileMesh() {
  const geometry = useMemo(() => buildTileGeometry(), [])
  const texture = useMemo(() => buildClayTexture(), [])

  return (
    <mesh geometry={geometry} rotation={[0.35, 0.25, 0.12]} scale={0.62}>
      <meshStandardMaterial
        map={texture ?? undefined}
        color={texture ? "#ffffff" : "#c96a3d"}
        roughness={0.88}
        metalness={0.04}
      />
    </mesh>
  )
}
