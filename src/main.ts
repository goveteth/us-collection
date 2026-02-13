import { logger } from '@/helpers/logger'

import { getUserscripts } from './helpers/scripts'

getUserscripts().then((userscripts) => {
  const matchedUserscripts = userscripts.filter((item) => item.matched)

  const scriptLines = userscripts.map((item) => {
    const status = item.matched ? '🟢' : '🔴'
    const name = item.script.displayName
    return `${status} ${name}`
  })

  const printInfo = [
    '',
    ...scriptLines,
  ].join('\n')

  logger.debug(printInfo)

  matchedUserscripts.forEach((item) => {
    item.script()
  })
})
