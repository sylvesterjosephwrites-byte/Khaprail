import { Suspense, useEffect, useRef, useState, type ElementRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { TileMesh } from "./tile-mesh"
import { prefersReducedMotion } from "./webgl-support"

const RESUME_AUTOROTATE_DELAY_MS = 2500
// autoRotateSpeed=2 is three.js's documented "30s per revolution at 60fps" —
// scaled up for the requested ~20s/revolution.
const AUTO_ROTATE_SPEED = 3

interface TileSceneProps {
  /** Stops the render loop when the hero has scrolled out of view. */
  paused?: boolean
}

export default function TileScene({ paused = false }: TileSceneProps) {
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null)
  const [autoRotate, setAutoRotate] = useState(() => !prefersReducedMotion())
  const resumeTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    function handleStart() {
      window.clearTimeout(resumeTimer.current)
      setAutoRotate(false)
    }
    function handleEnd() {
      if (prefersReducedMotion()) return
      resumeTimer.current = window.setTimeout(() => setAutoRotate(true), RESUME_AUTOROTATE_DELAY_MS)
    }

    controls.addEventListener("start", handleStart)
    controls.addEventListener("end", handleEnd)
    return () => {
      controls.removeEventListener("start", handleStart)
      controls.removeEventListener("end", handleEnd)
      window.clearTimeout(resumeTimer.current)
    }
  }, [])

  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.6, 3.2], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <hemisphereLight args={["#fff3e6", "#3b2a20", 0.4]} />
      <directionalLight position={[3, 4, 2]} intensity={1.4} color="#fff1e0" />
      <directionalLight position={[-3, 1, -2]} intensity={0.35} color="#a9c8ff" />
      <Suspense fallback={null}>
        <TileMesh />
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate={autoRotate}
        autoRotateSpeed={AUTO_ROTATE_SPEED}
        makeDefault
      />
    </Canvas>
  )
}
