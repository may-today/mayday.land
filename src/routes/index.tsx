import { Show, For, onMount, createSignal, createResource, onCleanup } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Title } from '@solidjs/meta'
import { createAsync, cache } from '@solidjs/router'
import { createMediaQuery } from '@solid-primitives/media'
import {
  makeHeartbeatWS,
  createReconnectingWS,
  type WSMessage,
} from '@solid-primitives/websocket'
import pc from 'picocolors'
import Header from '~/components/Header'
import Login from '~/components/Login'
import Hero from '~/components/Hero'
import HeroInfo from '~/components/HeroInfo'
import SendBox from '~/components/SendBox'
import type { User } from '~/types'

const getInitialCount = async () => {
  return 0
  // const response = await fetch('http://192.168.31.140:3000/count')
  // return Number(await response.text())
}

// export const route = {
//   load: () => getInitialCount(),
// }

export default function Page() {
  const [user, setUser] = createSignal<User | null>(null)
  const [anim1Finished, setAnim1Finished] = createSignal(false)
  const [anim2Finished, setAnim2Finished] = createSignal(false)
  const [initialCount, { refetch }] = createResource(getInitialCount)
  const [messages, setMessages] = createStore<WSMessage[]>([])
  const [ws, setWs] = createSignal<WebSocket | null>(null)
  const isLargerThanSm = createMediaQuery('(min-width: 640px)', false)

  // const timer = setInterval(() => {
  //   refetch()
  // }, 5000)
  // onCleanup(() => clearInterval(timer))

  const currentOnline = () => {
    return initialCount() || 0
  }

  onMount(() => {
    // const ws = makeHeartbeatWS(
    //   createReconnectingWS('ws://192.168.31.140:3000/ws', undefined, {
    //     retries: 10,
    //   }),
    //   { message: '__PING__', interval: 3000, wait: 1000 },
    // )
    // ws.addEventListener('message', (event) => {
    //   console.log('message', event)
    //   setMessages(messages.length, event.data)
    // })
    // setWs(ws)
  })

  const onSendText = async (text: string) => {
    console.log('send', text)
    // ws()?.send(text)
    return true
  }

  return (
    <main class="flex flex-col w-screen h-[100svh] bg-black whitespace-pre-wrap overflow-hidden">
      <Title>MaydayLand</Title>
      <Header>
        <span>（目前共有</span>
        <span class="ansi-cyan">{currentOnline()}</span>
        <span>人上线）</span>
      </Header>
      <div class="flex-1 overflow-y-scroll overflow-x-hidden">
        <Login onSubmit={setUser} />
        <Show when={!!user()}>
          <div class="flex flex-col sm:flex-row">
            <Hero onFinish={() => setAnim1Finished(true)} />
            <Show when={isLargerThanSm() || anim1Finished()}>
              <HeroInfo onFinish={() => setAnim2Finished(true)} />
            </Show>
          </div>
        </Show>
        {/* 
        <div onClick={() => {
          ws()?.send('hello')
        }}>send</div>
        <div onClick={() => {
          ws()?.send('ping')
        }}>ping</div>
        <For each={messages}>
          {(message) => (
            <div>{message}</div>
          )}
        </For> */}
      </div>
      <Show when={!!user()}>
        <SendBox user={user()!} onSend={onSendText} />
      </Show>
    </main>
  )
}
