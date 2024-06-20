import { } from 'solid-js'
import type { Component } from 'solid-js'
import Convert from 'ansi-to-html'

interface AnsiProps {
  text: string
}

const convert = new Convert({
  colors: {
    0: '#333333',
    1: '#e47474',
    2: '#66b395',
    3: '#aa5500',
    4: '#7098d4',
    5: '#b290ba',
    6: '#6ab8c0',
    7: '#dddddd',
    8: '#666666',
    9: '#f48484',
    10: '#76c3a5',
    11: '#f2d98e',
    12: '#80a8e4',
    13: '#c2a0ca',
    14: '#7ac8d0',
    15: '#f6f6f6'
  },
})

const Ansi: Component<AnsiProps> = (props) => {
  return (
    <p class="whitespace-pre-wrap" innerHTML={convert.toHtml(props.text)} />
  )
}

export default Ansi