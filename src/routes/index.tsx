import { Show, For, createSignal, createResource, createEffect } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Title } from '@solidjs/meta'
import { createMediaQuery } from '@solid-primitives/media'
import {
  makeHeartbeatWS,
  createReconnectingWS,
} from '@solid-primitives/websocket'
import { createScrollPosition } from '@solid-primitives/scroll'
import { leading, throttle } from '@solid-primitives/scheduled'
import destr from 'destr'
import Header from '~/components/Header'
import Login from '~/components/Login'
import Hero from '~/components/Hero'
import HeroInfo from '~/components/HeroInfo'
import SendBox from '~/components/SendBox'
import MessageCom from '~/components/MessageCom'
import ScrollToBottom from '~/components/ScrollToBottom'
import type { User, Message } from '~/types'

const countApi = 'http://192.168.31.140:3000/count'
const wsServerPrefix = 'ws://192.168.31.140:3000/ws'

const getInitialCount = async () => {
  const response = await fetch(countApi)
  return Number(await response.text())
}

export default function Page() {
  let scrollRef: HTMLDivElement
  const [initialCount] = createResource(getInitialCount)
  const [messages, setMessages] = createStore<Message[]>([])
  const [user, setUser] = createSignal<User | null>(null)
  const [onlineCount, setOnlineCount] = createSignal(-1)
  const [anim1Finished, setAnim1Finished] = createSignal(false)
  const [anim2Finished, setAnim2Finished] = createSignal(false)
  const [hasUnreadMessage, setHasUnreadMessage] = createSignal(false)
  const [ws, setWs] = createSignal<WebSocket | null>(null)
  const isLargerThanSm = createMediaQuery('(min-width: 640px)', false)

  const scroll = createScrollPosition(() => scrollRef)
  const isScrollToBottom = () => {
    if (!scrollRef) {
      return false
    }
    return scroll.y + scrollRef.clientHeight >= scrollRef.scrollHeight - 100
  }
  createEffect(() => {
    if (isScrollToBottom()) {
      setHasUnreadMessage(false)
    }
  }, [isScrollToBottom])


  const instantScrollToBottomThrottle = leading(throttle, (element: HTMLDivElement) => {
    element.scrollTo({ top: element.scrollHeight })
  }, 250)

  const currentOnline = () => {
    if (onlineCount() >= 0) {
      return onlineCount()
    }
    return initialCount() || 0
  }

  const onUserChange = (newUser: User) => {
    setUser(newUser)
    connectWs(newUser)
  }

  const onSendText = async (text: string) => {
    ws()?.send(text)
    return true
  }

  const onClickScrollTop = () => {
    scrollRef.scrollTo({ top: scrollRef.scrollHeight, behavior: 'smooth' })
  }

  const connectWs = (user: User) => {
    const serverUrl = `${wsServerPrefix}?user=${JSON.stringify(user)}`
    const ws = makeHeartbeatWS(
      createReconnectingWS(serverUrl, undefined, {
        retries: 5,
      }),
      { message: '__PING__', interval: 5000, wait: 1000 },
    )
    ws.addEventListener('message', (event) => {
      const message = destr<Message>(event.data)
      if (!message) {
        return
      }
      if (message.user === 'server_ping') {
        setOnlineCount(Number(message.message))
        return
      }
      console.log('message', message)
      setMessages(messages.length, message)
      if (isScrollToBottom()) {
        instantScrollToBottomThrottle(scrollRef)
      } else {
        setHasUnreadMessage(true)
      }
    })
    ws.addEventListener('open', () => {
      setWs(ws)
    })
    ws.addEventListener('close', () => {
      setWs(null)
    })
  }

  return (
    <main class="flex flex-col w-screen h-[100svh] bg-black whitespace-pre-wrap overflow-hidden">
      <Title>MaydayLand</Title>
      <Header>
        <span>（目前共有</span>
        <span class="ansi-cyan">{currentOnline()}</span>
        <span>人上线）</span>
        {JSON.stringify(isScrollToBottom())}
        {scroll.y}
      </Header>
      <div class="relative flex-1 overflow-y-scroll overflow-x-hidden pb-4" ref={scrollRef!}>
        <Login onSubmit={onUserChange} />
        <Show when={!!user()}>
          <div class="flex flex-col sm:flex-row">
            <Hero onFinish={() => setAnim1Finished(true)} />
            <Show when={isLargerThanSm() || anim1Finished()}>
              <HeroInfo onFinish={() => setAnim2Finished(true)} />
            </Show>
          </div>
          <Show when={anim2Finished()}>
            <div class="px-4 mt-4">
              <Show when={!ws()}>
                <p class="ansi-red">连接失败！</p>
              </Show>
              <For each={messages}>
                {(message) => <MessageCom message={message} />}
              </For>
            </div>
          </Show>
        </Show>
      </div>
      <Show when={!!user() && anim2Finished() && ws()}>
        <Show when={!isScrollToBottom()}>
          <ScrollToBottom
            onClickScrollTop={onClickScrollTop}
            hasUnreadMessage={hasUnreadMessage()}
          />
        </Show>
        <SendBox user={user()!} onSend={onSendText} />
      </Show>
    </main>
  )
}
