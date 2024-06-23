import type { Component } from 'solid-js'
import clsx from 'clsx'

interface Props {
  onClickScrollTop: () => void
  hasUnreadMessage: boolean
}

const ScrollToBottom: Component<Props> = (props) => {
  return (
    <div
      class={clsx([
        'px-4 py-1 border-t border-zinc-700 text-center',
        'cursor-pointer bg-black hover:bg-zinc-800 transition-colors',
        props.hasUnreadMessage && 'bg-cyan-900 hover:bg-cyan-800',
      ])}
      onClick={props.onClickScrollTop}
      onKeyDown={(e) => e.key === 'Enter' && props.onClickScrollTop()}
    >
      滚动到底部
    </div>
  )
}

export default ScrollToBottom
