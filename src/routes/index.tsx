import { Show, For, createSignal, createResource, createEffect, onCleanup } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
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
import Footer from '~/components/Footer'
import Alert from '~/components/Alert'
import type { User, Message } from '~/types'

// const countApi = 'http://localhost:3000/count'
// const wsServerPrefix = 'ws://localhost:3000/ws'
const countApi = 'https://maydayland-server-tn.ddiu.site/count'
const wsServerPrefix = 'wss://maydayland-server-tn.ddiu.site/ws'
const maxMessageHistoryLength = 6

const getInitialCount = async () => {
  const response = await fetch(countApi)
  return Number(await response.text())
}

export default function Page() {
  let scrollRef: HTMLDivElement
  const [initialCount] = createResource(getInitialCount)
  const [messages, setMessages] = createStore<Message[]>([])
  const [user, setUser] = createSignal<User | null>(null)
  const [currentAlertMessage, setCurrentAlertMessage] = createSignal('')
  const [currentConnectError, setCurrentConnectError] = createSignal(false)
  const [onlineCount, setOnlineCount] = createSignal(-1)
  const [anim1Finished, setAnim1Finished] = createSignal(false)
  const [anim2Finished, setAnim2Finished] = createSignal(false)
  const [hasUnreadMessage, setHasUnreadMessage] = createSignal(false)
  const [ws, setWs] = createSignal<WebSocket | null>(null)
  const isLargerThanSm = createMediaQuery('(min-width: 640px)', false)

  let audioSource: AudioBufferSourceNode | null = null;

  // Audio playback
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();


  function stopAudio() {
    if (audioSource) {
      audioSource.stop();
      audioSource = null; // 停止后清除 source 对象
    }
  }

  function playAudio(url, loop = false) {
    return new Promise((resolve, reject) => {
      stopAudio(); // 停止当前音频
      fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          audioSource = audioContext.createBufferSource();
          audioSource.buffer = audioBuffer;
          audioSource.loop = loop;
          audioSource.connect(audioContext.destination);
          audioSource.start(0);
          audioSource.onended = resolve; // Resolve the promise when audio playback is finished
        })
        .catch(err => {
          console.error('Error with decoding audio data', err);
          reject(err);
        });
    });
  }

  function playRemainingAudio() {
    playAudio('assets/login_finished.mp3').then(() => {
        playAudio('assets/chat.mp3', true); // 循环播放 chat.mp3
    });
  }

  document.addEventListener('click', function() {
    playAudio('assets/login.mp3', true);
  }, { once: true });
  
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
  onCleanup(() => {
    ws()?.close()
  })

  const addMessage = (message: Message) => {
    setMessages(produce((messages) => {
      messages.push(message)
      if (messages.length > maxMessageHistoryLength) {
        messages.shift()
      }
    }))
    if (message.user === 'server') {
      setCurrentAlertMessage(message.message)
    }
    if (isScrollToBottom()) {
      instantScrollToBottomThrottle(scrollRef)
    } else {
      setHasUnreadMessage(true)
    }
  }

  const instantScrollToBottomThrottle = leading(throttle, (element: HTMLDivElement, force = false) => {
    (isScrollToBottom() || force) && element.scrollTo({ top: element.scrollHeight })
  }, 300)

  const currentOnline = () => {
    if (onlineCount() >= 0) {
      return onlineCount()
    }
    return initialCount() || 0
  }

  const onUserChange = (newUser: User) => {
    setUser(newUser)
    connectWs(newUser)
    playRemainingAudio();
  }

  const onSendText = async (text: string) => {
    ws()?.send(text)
    return true
  }

  const onClickScrollTop = () => {
    scrollRef.scrollTo({ top: scrollRef.scrollHeight, behavior: 'smooth' })
  }

  const onAnimFinished = () => {
    setAnim2Finished(true)
    setTimeout(() => {
      instantScrollToBottomThrottle(scrollRef, true)
    }, 500)
  }

  const connectWs = (user: User) => {
    const serverUrl = `${wsServerPrefix}?user=${JSON.stringify(user)}`
    const ws = makeHeartbeatWS(
      createReconnectingWS(serverUrl, undefined, {
        retries: 5,
      }),
      { message: '__PING__', interval: 3000, wait: 1000 },
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
      addMessage(message)
    })
    ws.addEventListener('open', () => {
      setWs(ws)
      setCurrentConnectError(false)
    })
    ws.addEventListener('close', () => {
      setWs(null)
      !currentConnectError() && addMessage({ user: 'local_warn', message: '连接已断开' })
    })
    ws.addEventListener('error', () => {
      setWs(null)
      !currentConnectError() && addMessage({ user: 'local_err', message: '连接失败！' })
      setCurrentConnectError(true)
    })
  }

  return (
    <main class="flex flex-col w-screen h-[100svh] bg-black whitespace-pre-wrap overflow-hidden">
      <Title>MaydayLand·「透露」聊天室</Title>
      <Header>
        <span>（目前共有</span>
        <span class="ansi-cyan">{currentOnline()}</span>
        <span>人上线）</span>
      </Header>
      <div class="relative flex-1 overflow-y-scroll overflow-x-hidden pb-4" ref={scrollRef!}>
        <Login onSubmit={onUserChange} />
        <Show when={!!user()}>
          <div class="flex flex-col sm:flex-row mb-4">
            <Hero
              onFinish={() => setAnim1Finished(true)}
              onUpdate={() => instantScrollToBottomThrottle(scrollRef)}
            />
            <Show when={isLargerThanSm() || anim1Finished()}>
              <HeroInfo
                onFinish={onAnimFinished}
                onUpdate={() => instantScrollToBottomThrottle(scrollRef)}
              />
            </Show>
          </div>
          <Show when={anim2Finished()}>
            <div class="px-4">
              <For each={messages}>
                {(message) => <MessageCom message={message} />}
              </For>
            </div>
          </Show>
        </Show>
      </div>
      <Show when={!!user() && anim2Finished()}>
        <Show when={!isScrollToBottom()}>
          <ScrollToBottom
            onClickScrollTop={onClickScrollTop}
            hasUnreadMessage={hasUnreadMessage()}
          />
        </Show>
        <SendBox user={user()!} onSend={onSendText} />
        <Show when={currentAlertMessage()}>
          <Alert message={currentAlertMessage()} />
        </Show>
      </Show>
      <Footer/>
    </main>
  )
}
