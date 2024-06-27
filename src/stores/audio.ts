import { atom } from 'nanostores'

export const $currentPlayingSrc = atom('assets/login.mp3')
export const $audioPlaying = atom(false)
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
