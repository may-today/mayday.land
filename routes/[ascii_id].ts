import { list } from '~/data/ascii'

export default eventHandler((event) => {
  const id = getRouterParam(event, 'ascii_id')
  const ascii = list[id]
  if (!ascii) {
    return '404'
  }
  return ascii
})