import { createSignal, Show, onMount } from 'solid-js'
import type { Component } from 'solid-js'
import type { User } from '~/types'
import Username from './Username'

interface Props {
  user: User
  onSend: (text: string) => Promise<boolean>
}

const SendBox: Component<Props> = (props) => {
  const [inputText, setInputText] = createSignal('')

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    const result = await props.onSend(inputText())
    if (result) {
      setInputText('')
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
      <input
        id="text"
        type="text"
        class="flex-1 height-full bg-transparent focus:outline-none caret-sky-500 mr-10"
        value={inputText()}
        onInput={(e) => setInputText(e.currentTarget.value)}
        autofocus
        required
        maxLength={32}
        autocomplete="off"
        enterkeyhint="send"
      />
    </form>
  )
}

export default SendBox
