import { createSignal } from 'solid-js'
import type { Component } from 'solid-js'
import { useStore } from '@nanostores/solid'
import { Play, Pause } from 'lucide-solid'
import { createAudio } from '@solid-primitives/audio'
import { $currentPlayingSrc, $audioPlaying, $player } from '~/stores/audio'

const PlayController: Component = () => {
  const audioPlaying = useStore($audioPlaying)
  const currentPlayingSrc = useStore($currentPlayingSrc)
  const [audio, controls] = createAudio(currentPlayingSrc, audioPlaying)
  const onTogglePlay = () => {
    $audioPlaying.set(!audioPlaying())
  }
  $player.set(audio.player)

  return (
    <div
      class="flex items-center gap-1 cursor-pointer"
      onClick={onTogglePlay}
      onKeyDown={(e) => e.key === 'Enter' && onTogglePlay()}
    >
      { audioPlaying() ? <Play size={18} /> : <Pause size={18} /> }
      <p>正在播放：透露 - 五月天</p>
    </div>
  )
}

export default PlayController
