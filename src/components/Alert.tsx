import { createSignal, Show, onMount } from 'solid-js'
import type { Component } from 'solid-js'

interface Props {
  message: string
}

const Alert: Component<Props> = (props) => {
  const [showAlert, setShowAlert] = createSignal(false)

  onMount(() => {
    if (sessionStorage.getItem('maydayland_alert')) {
      return
    }
    setTimeout(() => {
      setShowAlert(true)
      sessionStorage.setItem('maydayland_alert', '1')
    }, 1500)
  })

  const closeAlert = (e: Event) => {
    e.preventDefault()
    setShowAlert(false)
  }

  return (
    <Show when={showAlert()}>
      <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
        <div class="flex flex-col items-center space-y-4 px-6 py-4 max-w-md m-6 border border-zinc-800 bg-zinc-950 rounded-md z-30">
          <h1 class="text-center">「透露」聊天室须知</h1>
          <div class="text-sm">
            <p>{props.message}</p>
          </div>
          <div
            class="inline-block bg-zinc-800 border border-zinc-600 px-4 py-1 cursor-pointer hover:bg-zinc-700"
            onClick={closeAlert}
            onKeyPress={(e) => e.key === 'Enter' && closeAlert}
          >
            我知道了
          </div>
        </div>
      </div>
    </Show>
  )
}

export default Alert
