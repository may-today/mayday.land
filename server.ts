import type { User, Message } from '~/types'

type UserData = {
  user: User
}

let userCount = 0

const server = Bun.serve<UserData>({
  fetch(req, server) {
    const url = new URL(req.url)
    const params = url.searchParams
    if (url.pathname === '/ws') {
      const userString = params.get('user') || '{}'
      let user = {} as Partial<User>
      try {
        user = JSON.parse(userString)
      } catch (e) {}
      if (!user.name || !user.nameType) {
        return new Response('User info error', { status: 400 })
      }
      const success = server.upgrade(req, {
        data: {
          user,
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
    open(ws) {
      userCount++
      ws.send(JSON.stringify({ user: 'server', message: `Hi ${ws.data.user.name}#${ws.data.user.suffix}，欢迎加入「透露」聊天室！` }))
      ws.subscribe('chat')
    },
    async message(ws, message) {
      if (message === '__PING__') {
        ws.send(JSON.stringify({ user: 'server_ping', message: userCount }))
        return
      }
      const _message = {
        user: ws.data.user,
        message,
      } as Message
      console.log('[ws]', ws.data.user?.name, message)
      server.publish('chat', JSON.stringify(_message))
    },
    close(ws, event) {
      userCount--
      if (userCount < 0) {
        userCount = 0
      }
    },
  },
});
