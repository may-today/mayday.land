import type { Component } from 'solid-js'
import { createSignal, Show, onMount } from 'solid-js'
import { v4 as uuidv4 } from 'uuid'
import type { User } from '~/types'
import Username from './Username'

const preservedName = ['guest', 'admin', 'root']

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
      id: localStorage.getItem('maydayland_uuid') || uuidv4(),
      name: name(),
      nameType: Math.floor(Math.random() * 12),
      suffix: generateSuffix(),
    }
    if (preservedName.includes(user.name)) {
      user.name = '胡萝卜'
      localStorage.removeItem('maydayland_name')
    } else {
      localStorage.setItem('maydayland_name', user.name)
      localStorage.setItem('maydayland_uuid', user.id)
    }
    setFinalUser(user)
    props.onSubmit(user)
  }

  return (
    <form class="px-4" onSubmit={handleSubmit}>
      <span>正在播放：透露 - 五月天</span>
      <p>
        <label for="name">
          <span>请输入代号（试用请输入'</span>
          <span class="ansi-cyan">guest</span>
          <span>'）：</span>
        </label>
        <input
          id="name"
          type="text"
          class="bg-transparent focus:outline-none caret-sky-500 w-[240px]"
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
          autofocus
          required
          maxLength={18}
          autocomplete="off"
          enterkeyhint="done"
          readOnly={!!finalUser() || undefined}
        />
      </p>
      <Show when={!!finalUser()}>
        <p>
          <span>代号为 </span>
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
