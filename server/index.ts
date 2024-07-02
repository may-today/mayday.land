import type { User, Message } from '~/types'
import { tmsCheck } from './tms'

type UserData = {
  user: User
  ip: string
}

const maxMessageLength = 32
const messageWaitTime = 20 * 1000

let userCount = 0
const userSendTimeMap = new Map<string, number>()

const genTime = () => {
  const date = new Date()
  const dd = [date.getHours(), date.getMinutes(), date.getSeconds()].map((n) => n.toString().padStart(2, '0'))
  return dd.join(':')
}

const server = Bun.serve<UserData>({
  fetch(req, server) {
    const url = new URL(req.url)
    const params = url.searchParams
    if (url.pathname === '/ws') {
      const userString = params.get('user') || '{}'
      let user = {} as Partial<User>
      try {
        user = JSON.parse(userString)
      } catch (e) { }
      if (!user.name || !user.nameType) {
        return new Response('User info error', { status: 400 })
      }
      const ip = req.headers.get('x-forwarded-for')
      const success = server.upgrade(req, {
        data: {
          user,
          ip,
        }
      })
      return success
        ? undefined
        : new Response('WebSocket upgrade error', { status: 400 })
    }
    if (url.pathname === '/count') {
      const res = new Response(userCount.toString())
      res.headers.set('Access-Control-Allow-Origin', '*')
      res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      return res
    }
    return new Response('Hello, world!')
  },
  websocket: {
    maxPayloadLength: 1024 * 20,
    async open(ws) {
      userCount++
      ws.send(JSON.stringify({ user: 'server', message: `Hi ${ws.data.user.name}#${ws.data.user.suffix}，欢迎加入「透露」聊天室！` }))
      const userPass = ws.data.user.name === '胡萝卜' || await tmsCheck(ws.data.user.name)
      if (!userPass) {
        ws.send(JSON.stringify({ user: 'server_error', message: '这个代号不合适，换一个吧' }))
        return
      }
      ws.subscribe('chat')
    },
    async message(ws, message) {
      if (message === '__PING__') {
        ws.send(JSON.stringify({ user: 'server_ping', message: userCount }))
        return
      }
      if (typeof message !== 'string') {
        return
      }
      const _message = {
        user: ws.data.user,
        message: message.slice(0, maxMessageLength),
      } as Message
      console.log(`[ws] ${genTime()} ${ws.data.ip} ${ws.data.user?.id} ${ws.data.user?.name}#${ws.data.user?.suffix}: ${_message.message}`)
      const lastSendTime = userSendTimeMap.get(ws.data.user.id) || 0
      const currentTime = Date.now()
      if (currentTime - lastSendTime < messageWaitTime) {
        ws.send(JSON.stringify({ user: 'server_error', message: '消息发送太快了' }))
        return
      }
      userSendTimeMap.set(ws.data.user.id, currentTime)
      if (_message.message.length >= 4) {
        const pass = await tmsCheck(message)
        if (!pass) {
          _message.message = '***'
        }
      }
      server.publish('chat', JSON.stringify(_message))
    },
    close(ws, event) {
      userCount--
      if (userCount < 0) {
        userCount = 0
      }
      userSendTimeMap.delete(ws.data.user.id)
    },
  },
});
