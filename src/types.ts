export interface User {
  id: string
  name: string
  nameType: number
  suffix: string
}

export interface Message {
  user: User | 'local_warn' | 'local_err' | 'server' | 'server_ping' | 'server_error'
  message: string
}
