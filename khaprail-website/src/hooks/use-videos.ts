import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Video } from "@/types/video"

interface UseVideosResult {
  videos: Video[]
  isLoading: boolean
  error: string | null
}

/**
 * Reads the admin-editable `videos` table. Honestly empty until real
 * workshop/installation video links are supplied — see 00-PROGRESS.md.
 */
export function useVideos(limit?: number): UseVideosResult {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(() => supabase !== null)
  const [error, setError] = useState<string | null>(() =>
    supabase ? null : "Supabase project not configured yet"
  )

  useEffect(() => {
    if (!supabase) return

    let cancelled = false
    let query = supabase.from("videos").select("id, title, video_url, thumbnail_url, sort_order").order("sort_order", { ascending: true })
    if (limit) query = query.limit(limit)

    query.then(({ data, error: queryError }) => {
      if (cancelled) return
      if (queryError) {
        setError(queryError.message)
      } else {
        setVideos(data ?? [])
      }
      setIsLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [limit])

  return { videos, isLoading, error }
}
