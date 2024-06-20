import { Title } from '@solidjs/meta'
import pc from 'picocolors'
import Ansi from '~/components/Ansi'

export default function Home() {
  return (
    <main class="w-screen h-screen h-[100dvh] bg-black text-white px-4 py-2 whitespace-pre-wrap">
      <Title>MaydayLand</Title>
      <Ansi text={`欢迎光临 ${pc.red('5525 回到那一天')}（目前共有${pc.cyan(55255)}人上线）`} />
      <Ansi text={`请输入代号（试用请输入\'${pc.cyan('guest')}\'，注册请输入\'${pc.cyan('new')}\'）：mayday`} />
      <Ansi text={`请输入密码：`} />
      {/* <Ansi text={`           ::::::::::'.d$N.^''...:::db.^'::::::::::.           `} />
      <Ansi text={`          .::::::::: *#' ::::::::'z$$$$$bo.'''::::::           `} />
      <Ansi text={`          :::::::''..-:::::::: 'u$$$$$$$$$$$$bu ':::           `} />
      <Ansi text={`         ::::::'.::::::::::'.ud$$$$$$$$$$$$$$$$$  :'           `} /> */}
    </main>
  )
}
