import { Show, createSignal, onMount } from 'solid-js'
import type { Component } from 'solid-js'

interface Props {
  onFinish: () => void
}

const Hero: Component<Props> = (props) => {
  const [showState0, setShowState0] = createSignal(false)
  const [showState1, setShowState1] = createSignal(false)
  const [showState2, setShowState2] = createSignal(false)
  const [showState3, setShowState3] = createSignal(false)
  const [showState4, setShowState4] = createSignal(false)

  onMount(() => {
    setTimeout(() => {
      setShowState0(true)
    }, 500)
    setTimeout(() => {
      setShowState1(true)
    }, 1000)
    setTimeout(() => {
      setShowState2(true)
    }, 1500)
    setTimeout(() => {
      setShowState3(true)
    }, 2000)
    setTimeout(() => {
      setShowState4(true)
      props.onFinish()
    }, 2500)
  })

  return (
    <div class="px-4 font-mono text-xs sm:text-sm whitespace-pre text-center">
      <p> </p>
      <Show when={showState0()}>
        <p>{"           ::::::::::'.d$N.^''...:::db.^'::::::::::.     "}</p>
        <p>{"          .::::::::: *#' ::::::::'z$$$$$bo.'''::::::     "}</p>
        <p>{"          :::::::''..-:::::::: 'u$$$$$$$$$$$$bu ':::     "}</p>
        <p>{"         ::::::'.:::::::"}<span class={showState1() ? '' : 'text-transparent'}>{":::'.ud$$$$$$$$$$$$$$$$$  :'     "}</span></p>
      </Show>
      <Show when={showState1()}>
        <p>{"         ::::: ::::::::' .ud$$$$$$$$$$$$$$$&eeuJ> :      "}</p>
        <p>{"       . '::::::::::: xd$$$$R'Lued$$$$$$$$$$$$$$>.:      "}</p>
        <p>{"     ::::.::::::::::. 9$$$$Fz$$$$$$$$$$$$$$$$F'' .:      "}</p>
        <p>{"    ::::::::::::::::::'$$"}<span class={showState2() ? '' : 'text-transparent'}>{"$$u$$$F' ''$$$$$$$$.ut  '::     "}</span></p>
      </Show>
      <Show when={showState2()}>
        <p>{"    :::::::::::::::::::'$$$$$FsKxL. 9$$$$$$$edNeo :::    "}</p>
        <p>{"    :::::::::::::::::::'$$$$$FsKxL. 9$$$$$$$edNeo :::    "}</p>
        <p>{"     ':::::::::::::::::: 4$$$$$b$euud$$$$$$$$$$$$$  : %%%"}</p>
        <p>{"%:%: '::: ::::::::"}<span class={showState3() ? '' : 'text-transparent'}>{":::::: $$$$$$$$$$$$$$$$$$?$$$$$>  %%%% "}</span></p>
      </Show>
      <Show when={showState3()}>
        <p>{"%%%%%     ::::::::::::: .$$$$$$$$$$$$$$$$I$u$$$$$> %%%%  "}</p>
        <p>{"%%%%%%%:  ::::::::::::' d$$$$$$$$$$$$$$$R???'7$$F %%%%   "}</p>
        <p>{" % %%%%%%  ::::::::::'.$$$$$$$$$$$$$b.-m$$* d$$F %%%'    "}</p>
        <p>{"     %%%%%.  :::::::: t$$$$$$$$$"}<span class={showState4() ? '' : 'text-transparent'}>{"$$$$$$bu..o$$$'.%%'      "}</span></p>
      </Show>
      <Show when={showState4()}>
        <p>{"      '%%%%%%.   :::: '$$$$$$$$$$$$$$$$$$$$$F':%%        "}</p>
        <p>{"      's.'%%%%%%%%::.  $$$$$$$$o.''???$$R?F.:%%%         "}</p>
        <p>{"        '$eu  %%%%%%% '$$$$$$$$$$$$er /%%%%%%%/          "}</p>
        <p>{"          '?$$eu. %%% t$$$$$$$$$$$$$! %%%%%%%%           "}</p>
      </Show>
    </div>
  )
}

export default Hero
