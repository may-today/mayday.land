import { Show, createSignal, onMount } from 'solid-js'
import type { Component } from 'solid-js'

interface Props {
  onFinish: () => void
  onUpdate: () => void
}

const HeroInfo: Component<Props> = (props) => {
  const [showState0, setShowState0] = createSignal(false)
  const [showState1, setShowState1] = createSignal(false)
  const [showState2, setShowState2] = createSignal(false)
  const [showState3, setShowState3] = createSignal(false)
  const [showState4, setShowState4] = createSignal(false)

  onMount(() => {
    setTimeout(() => {
      setShowState0(true)
      props.onUpdate()
    }, 500)
    setTimeout(() => {
      setShowState1(true)
      props.onUpdate()
    }, 1000)
    setTimeout(() => {
      setShowState2(true)
      props.onUpdate()
    }, 1500)
    setTimeout(() => {
      setShowState3(true)
      props.onUpdate()
    }, 2000)
    setTimeout(() => {
      setShowState4(true)
      props.onUpdate()
      props.onFinish()
    }, 2500)
  })

  return (
    <div class="px-4 font-mono text-sm whitespace-pre text-center !leading-snug">
      <p class="text-transparent">  ******************************  </p>
      <Show when={showState0()}>
        <p>{"      #      "}</p>
        <p>{"#    # #    #"}</p>
        <p>{"# ## #  # ###"}</p>
        <p>{"#   ##"}<span class={showState1() ? '' : 'text-transparent'}>{"  ##  #"}</span></p>
      </Show>
      <Show when={showState1()}>
        <p>{"#   # ## #  #"}</p>
        <p>{"# ##  ##  ###"}</p>
        <p>{" "}</p>
        <p class="ansi-red">{"欢 迎 光 临"}</p>
      </Show>
      <Show when={showState2()}>
        <p class="ansi-cyan">{"5525回到那一天 BBS 站"}</p>
        <p class="ansi-yellow">{"Welcome to #5525 LIVE TOUR"}</p>
        <p class="ansi-cyan">{"******************************"}</p>
        <p class="ansi-green">{"Since 1997"}<span class={showState3() ? '' : 'text-transparent'}>{".3.29"}</span></p>
      </Show>
      <Show when={showState3()}>
        <p>{"本站开放 "}<span class="ansi-yellow">5521-5525</span>{" 等五个port"}</p>
        <p>{"欢迎多加利用"}</p>
        <p>{" "}</p>
      </Show>
      <Show when={showState4()}>
        <p class="ansi-cyan">{"       ┌—————┐     ┌————┐   "}</p>
        <p class="ansi-cyan">{"┌————┐ |┌———┐|     |    |   "}</p>
        <p class="ansi-cyan">{"|    └—┘└———┘└——┐  |     \\  "}</p>
        <p class="ansi-cyan">{"|               |  |      \\ "}</p>
        <p class="ansi-cyan">{"|               └——┘       \\"}</p>
      </Show>
    </div>
  )
}

export default HeroInfo
