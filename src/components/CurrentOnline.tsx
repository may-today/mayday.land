import type { Component } from 'solid-js'

import pc from 'picocolors'
import Ansi from './Ansi'

interface Props {
  count: number
}

const CurrentOnline: Component<Props> = (props) => {
  return (
    <Ansi text={`（目前共有${pc.cyan(props.count)}人上线）`} />
  )
}

export default CurrentOnline
