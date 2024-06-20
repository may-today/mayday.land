import Convert from 'ansi-to-html'

const convert = new Convert()
export const parseAnsi = (ansi: string) => convert.toHtml(ansi)
