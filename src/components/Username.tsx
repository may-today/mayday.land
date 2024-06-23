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
  'text-blue-300',
  'text-violet-300',
  'text-pink-300',
  'text-emerald-300',
  'text-orange-300',
  'text-lime-300',
]

const Username: Component<Props> = (props) => {
  return (
    <span class={colors[props.user.nameType] || 'ansi-white'}>
      {props.user.name}<span class="opacity-65">#{props.user.suffix}</span>
    </span>
  )
}

export default Username
