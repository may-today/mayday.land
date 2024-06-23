import { createSignal, Show } from 'solid-js'
import type { Component } from 'solid-js'
import { Info } from 'lucide-solid'
import clsx from 'clsx'

const Footer: Component = () => {
  const [showFooter, setShowFooter] = createSignal(false)
  return (
    <>
      <div
        class={clsx([
          'absolute bottom-2 right-2',
          'flex items-center justify-center w-6 h-6',
          'bg-transparent border border-zinc-800 rounded-md',
          'transition-colors hover:bg-zinc-900 cursor-pointer',
        ])}
        onClick={() => setShowFooter(!showFooter())}
        onKeyPress={(e) => e.key === 'Enter' && setShowFooter(!showFooter())}
      >
        <Info size={12} class="opacity-70" />
      </div>
      <Show when={showFooter()}>
        <div
          class="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setShowFooter(!showFooter())}
          onKeyPress={(e) => e.key === 'Enter' && setShowFooter(!showFooter())}
        >
          <div class="absolute bottom-10 right-2 flex flex-col space-y-2 px-4 py-2 border border-zinc-800 rounded-md text-xs">
            <h1>MaydayLand·「透露」聊天室</h1>
            <div>
              <p>制作: <a class="text-sky-200" target="_blank" rel="noreferrer" href="https://ddiu.io">Diu</a></p>
              <p>源代码: <a class="text-sky-200" target="_blank" rel="noreferrer" href="https://github.com/may-today/mayday.land">may-today/mayday.land</a></p>
            </div>
            <div>
              <p>部分ascii字符画来自: ringomango</p>
              <p>字体: Cubic-11</p>
            </div>
          </div>
        </div>
      </Show>
    </>
  )
}

export default Footer
