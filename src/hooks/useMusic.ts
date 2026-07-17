import { useCallback, useEffect, useRef, useState } from 'react'

interface UseMusicOptions {
  src: string
  volume?: number
  loop?: boolean
}

interface UseMusicReturn {
  isPlaying: boolean
  /** False when the file is missing or the format is unsupported */
  isAvailable: boolean
  toggle: () => void
  play: () => void
  pause: () => void
}

const FADE_MS = 900
const FADE_STEPS = 30

/**
 * Background audio with gentle fades.
 *
 * Never autoplays on its own — `play()` must be called from a user gesture, or
 * the browser will reject it. If the source 404s or can't decode, `isAvailable`
 * goes false and the caller hides the control instead of erroring.
 */
export function useMusic({ src, volume = 0.3, loop = true }: UseMusicOptions): UseMusicReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef<number | undefined>(undefined)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    const audio = new Audio(src)
    audio.loop = loop
    audio.preload = 'none' // don't spend bytes until the user asks for sound
    audio.volume = 0
    audioRef.current = audio

    const onError = () => {
      setIsAvailable(false)
      setIsPlaying(false)
    }
    const onEnded = () => !loop && setIsPlaying(false)

    audio.addEventListener('error', onError)
    audio.addEventListener('ended', onEnded)

    return () => {
      window.clearInterval(fadeRef.current)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('ended', onEnded)
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [src, loop])

  const fadeTo = useCallback((target: number, onDone?: () => void) => {
    const audio = audioRef.current
    if (!audio) return
    window.clearInterval(fadeRef.current)

    const from = audio.volume
    const delta = (target - from) / FADE_STEPS
    let step = 0

    fadeRef.current = window.setInterval(() => {
      step += 1
      const next = from + delta * step
      audio.volume = Math.min(1, Math.max(0, next))
      if (step >= FADE_STEPS) {
        window.clearInterval(fadeRef.current)
        audio.volume = Math.min(1, Math.max(0, target))
        onDone?.()
      }
    }, FADE_MS / FADE_STEPS)
  }, [])

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.preload = 'auto'
    const promise = audio.play()
    if (promise) {
      promise
        .then(() => {
          setIsPlaying(true)
          fadeTo(volume)
        })
        .catch(() => {
          // Blocked (no gesture yet) or undecodable — stay silent, stay honest
          setIsPlaying(false)
        })
    }
  }, [fadeTo, volume])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    fadeTo(0, () => {
      audio.pause()
      setIsPlaying(false)
    })
  }, [fadeTo])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, pause, play])

  // Duck the audio when the guest tabs away; resume when they return
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current
      if (!audio || !isPlaying) return
      if (document.hidden) audio.pause()
      else void audio.play().catch(() => setIsPlaying(false))
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [isPlaying])

  return { isPlaying, isAvailable, toggle, play, pause }
}
