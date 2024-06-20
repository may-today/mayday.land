import type { APIEvent } from '@solidjs/start/server'
import text from '../data/toulou'

export async function GET({ params }: APIEvent) {
  return text
}