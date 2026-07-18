import { useCallback, useState } from 'react'

type ShareState = 'idle' | 'copied' | 'shared' | 'failed'

/**
 * Web Share API with a clipboard fallback. On desktop (no navigator.share) the
 * link is copied and the caller shows a "Link copied" confirmation.
 */
export function useShare(payload: { title: string; text: string }) {
  const [state, setState] = useState<ShareState>('idle')

  const share = useCallback(async () => {
    const urlObj = new URL(window.location.href)
    urlObj.hash = 'invitation'
    const url = urlObj.toString()

    if (navigator.share) {
      try {
        await navigator.share({ title: payload.title, text: payload.text, url })
        setState('shared')
        window.setTimeout(() => setState('idle'), 2000)
        return
      } catch (err) {
        // User dismissed the sheet — not an error worth surfacing
        if (err instanceof Error && err.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(`${payload.text} ${url}`)
      setState('copied')
    } catch {
      setState('failed')
    }
    window.setTimeout(() => setState('idle'), 2200)
  }, [payload.title, payload.text])

  return { share, state }
}
