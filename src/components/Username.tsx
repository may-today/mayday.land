import type { Component } from 'solid-js'
import type { User } from '~/types'

interface Props {
  user: User
}

const colors = [
  'ansi-red',
  'ansi-green',
  'ansi-yellow',
  'ansi-blue',
  'ansi-magenta',
  'ansi-cyan',
]

const Username: Component<Props> = (props) => {
  return (
    <span class={colors[props.user.nameType] || 'ansi-white'}>
      {props.user.name}<span class="opacity-80">#{props.user.suffix}</span>
    </span>
  )
}

export default Username
