import pc from 'picocolors'
import { list } from '~/data/ascii'

export default eventHandler((event) => {
  return Object.keys(list).map(key => {
    return `curl ${pc.cyan(`mayday.land/${key}`)}`
  }).join('\n')
})