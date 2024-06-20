type UserData = {
  createdAt: number
}

let userCount = 0

const server = Bun.serve<UserData>({
  fetch(req, server) {
    const url = new URL(req.url)
    if (url.pathname === '/ws') {
      const success = server.upgrade(req, {
        data: {
          createdAt: Date.now(),
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
      console.log('[ws] open', ws)
      userCount++
      ws.send(JSON.stringify({ user: 'server', message: `Welcome to the server ${ws.data}!` }))
      ws.subscribe('chat')
      ws.publish('chat', JSON.stringify({ user: 'server', message: `${ws.data} joined!` }))
    },
    async message(ws, message) {
      console.log(ws.data)
      console.log('[ws] message', ws, message)
      if (message === '__PING__') {
        ws.send(JSON.stringify({ user: 'server_ping', message: userCount }))
      } else {
        const _message = {
          user: ws.toString(),
          message: message,
        }
        server.publish('chat', JSON.stringify(_message))
      }
    },
    close(ws, event) {
      console.log('[ws] close', ws, event)
      userCount--
      if (userCount < 0) {
        userCount = 0
      }
    },
  },
});