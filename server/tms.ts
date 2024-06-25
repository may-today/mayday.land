import crypto from 'node:crypto'

const ENDPOINT = Bun.env.TMS_ENDPOINT || ''
const SECRET_ID = Bun.env.TMS_SECRET_ID || ''
const SECRET_KEY = Bun.env.TMS_SECRET_KEY || ''
const BIZ_TYPE = Bun.env.TMS_BIZ_TYPE || ''

const _sortParams = (params: Record<string, string | number>) => {
  let strParam = ''
  const keys = Object.keys(params)
  keys.sort()
  for (const k in keys) {
    strParam += `&${keys[k]}=${params[keys[k]]}`
  }
  return strParam.slice(1)
}

const _sha1 = (secretKey: string, strsign: string) => {
  const signMethodMap = { HmacSHA1: 'sha1' }
  const hmac = crypto.createHmac(signMethodMap.HmacSHA1, secretKey || '')
  return hmac.update(Buffer.from(strsign, 'utf8')).digest('base64')
}

const _genSignature = (params: Record<string, string | number>) => {
  const method = 'POST'
  const path = '/'
  const strParam = _sortParams(params)
  const strSign = `${method}${ENDPOINT}${path}?${strParam}`
  return _sha1(SECRET_KEY, strSign)
}

const _utf8ToB64 = (str: string) => {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      // @ts-expect-error
      return String.fromCharCode(`0x${p1}`)
    })
  )
}

export const tmsCheck = async (content: string) => {
  const Region = 'ap-shanghai'
  const Action = 'TextModeration'
  const Version = '2020-12-29'
  const Timestamp = Math.round(Date.now() / 1000)
  const Nonce = Math.round(Math.random() * 65535)
  const base64Content = _utf8ToB64(content)

  const params = {
    Action,
    Region,
    Timestamp,
    Nonce,
    SecretId: SECRET_ID,
    Version,
    Content: base64Content,
    BizType: BIZ_TYPE,
  } as Record<string, string | number>

  const signature = _genSignature(params)
  params.Signature = signature

  const response = await fetch(`https://${ENDPOINT}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    body: Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join('&'),
  })
  const data = await response.json()

  if (!response.ok || !data.Response || !data.Response.Suggestion) {
    console.error('[TMS] check Error:', content)
    return true
  }
  if (data.Response.Suggestion === 'Pass') {
    return true
  }
  if (data.Response.Suggestion === 'Review') {
    const label = data.Response.Label
    console.warn(`[TMS] check Review (${label})`, content)
    return false
  }
  if (data.Response.Suggestion === 'Block') {
    const label = data.Response.Label
    console.error(`[TMS] check Block (${label})`, content)
    return false
  }
  return true
}
