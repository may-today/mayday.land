import { atom } from 'nanostores'

export const $currentPlayingSrc = atom('')
export const $audioPlaying = atom(true)
export const $player = atom<HTMLAudioElement | null>(null)

export const setAudio = (src: string, loop = false) => {
  const player = $player.get()
  $currentPlayingSrc.set(src)
  if (player) {
    player.loop = loop
  }
}

export const setAudioCallback = (src: string, callback: () => void) => {
  const player = $player.get()
  $currentPlayingSrc.set(src)
  if (player) {
    player.loop = false
    player.addEventListener('ended', callback)
  }
}
