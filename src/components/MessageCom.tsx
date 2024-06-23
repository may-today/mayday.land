import type { Component } from 'solid-js'
import type { Message } from '~/types'
import Username from './Username'

interface Props {
  message: Message
}

const classDict = {
  local_warn: 'ansi-yellow',
  local_err: 'ansi-red',
  server: 'ansi-green',
  server_ping: 'ansi-cyan',
}

const MessageCom: Component<Props> = (props) => {
  return (
    <p>
      {typeof props.message.user === 'string' && (
        <span class={classDict[props.message.user]}>{props.message.message}</span>
      )}
      {typeof props.message.user === 'object' && (
        <>
          <Username user={props.message.user} />：
          {props.message.message}
        </>
      )}
    </p>
  )
}

export default MessageCom
