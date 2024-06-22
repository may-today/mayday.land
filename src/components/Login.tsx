import type { Component } from 'solid-js'
import { createSignal, Show, onMount } from 'solid-js'
import type { User } from '~/types'
import Username from './Username'

const preservedName = ['guest', 'new', 'admin', 'root']

interface Props {
  onSubmit: (user: User) => void
}

const Login: Component<Props> = (props) => {
  const [name, setName] = createSignal('')
  const [finalUser, setFinalUser] = createSignal<User | null>(null)

  onMount(() => {
    const storedName = localStorage.getItem('maydayland_name')
    if (storedName) {
      setName(storedName)
    }
  })

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    const user: User = {
      name: name(),
      nameType: Math.floor(Math.random() * 12),
      suffix: generateSuffix(),
    }
    if (preservedName.includes(user.name)) {
      user.name = 'test'
    }
    setFinalUser(user)
    localStorage.setItem('maydayland_name', user.name)
    props.onSubmit(user)
  }

  return (
    <form class="px-4" onSubmit={handleSubmit}>
      <p>
        <label for="name">
          <span>请输入代号（试用请输入'</span>
          <span class="ansi-cyan">guest</span>
          <span>'，注册请输入'</span>
          <span class="ansi-cyan">new</span>
          <span>'）：</span>
        </label>
        <input
          id="name"
          type="text"
          class="bg-transparent focus:outline-none caret-sky-500"
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
          autofocus
          required
          autocomplete='off'
          readOnly={!!finalUser() || undefined}
        />
      </p>
      <Show when={!!finalUser()}>
        <p>
          <span>您的代号为 </span>
          <Username user={finalUser()!} />
        </p>
      </Show>
    </form>
  )
}

const generateSuffix = () => {
  return Math.floor(Math.random() * 10000).toString().padStart(4, '0')
}

export default Login
