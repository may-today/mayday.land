import { createSignal } from 'solid-js'
import type { Component } from 'solid-js'
import type { User } from '~/types'
import Username from './Username'

const maxMessageLength = 32
const messageWaitTimeSec = 20

interface Props {
  user: User
  onSend: (text: string) => Promise<boolean>
}

const SendBox: Component<Props> = (props) => {
  const [inputText, setInputText] = createSignal('')
  const [waitTime, setWaitTime] = createSignal(0)

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    if (waitTime() > 0) return
    const result = await props.onSend(inputText())
    if (result) {
      setInputText('')
      setWaitTime(messageWaitTimeSec)
      let timer = null as null | Timer
      timer = setInterval(() => {
        setWaitTime((t) => t - 1)
        if (waitTime() <= 0) {
          setWaitTime(0)
          // @ts-expect-error
          clearInterval(timer)
        }
      }, 1000)
    }
  }

  return (
    <form
      class="flex sm:items-center flex-col sm:flex-row px-4 py-2 border-t border-zinc-700 bg-black"
      onSubmit={handleSubmit}
    >
      <label for="text" class="mr-10 sm:mr-0">
        <Username user={props.user} />
        <span class="ansi-white mx-2">$</span>
      </label>
      { waitTime() > 0 && (
        <div class="px-1 border border-zinc-700 text-sm mr-2">{waitTime()}s</div>
      )}
      <input
        id="text"
        type="text"
        class="flex-1 height-full bg-transparent focus:outline-none caret-sky-500 mr-10"
        value={inputText()}
        onInput={(e) => setInputText(e.currentTarget.value)}
        autofocus
        required
        maxLength={maxMessageLength}
        autocomplete="off"
        enterkeyhint="send"
      />
    </form>
  )
}

export default SendBox
