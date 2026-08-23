import { useEffect, useRef, useState } from "react"

// Pauses the 3D canvas's render loop once the hero scrolls out of view, so
// the decorative tile doesn't keep spending GPU/battery for the rest of the
// session after a visitor scrolls past it.
export function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.1,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, inView }
}
