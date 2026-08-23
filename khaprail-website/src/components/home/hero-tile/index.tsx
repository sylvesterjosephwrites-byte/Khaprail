import { lazy, Suspense, useEffect, useState } from "react"
import { TileIllustration } from "./tile-illustration"
import { useInView } from "./use-in-view"
import { hasWebGLSupport } from "./webgl-support"

// The R3F/three.js scene is its own lazy chunk — it's a meaningful amount of
// JS, so it must never block first paint of the hero's text/CTAs.
const TileScene = lazy(() => import("./tile-scene"))

interface HeroTileProps {
  className?: string
}

// Decorative, interactive 3D preview of a khaprail roof tile for the
// homepage hero. Purely visual (not informational), so it's hidden from
// assistive tech rather than announced as content to interact with.
export function HeroTile({ className }: HeroTileProps) {
  const [webglReady, setWebglReady] = useState(false)
  const { ref, inView } = useInView<HTMLDivElement>()

  useEffect(() => {
    setWebglReady(hasWebGLSupport())
  }, [])

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {webglReady ? (
        <Suspense fallback={<TileIllustration className="h-full w-full" />}>
          <TileScene paused={!inView} />
        </Suspense>
      ) : (
        <TileIllustration className="h-full w-full" />
      )}
    </div>
  )
}
