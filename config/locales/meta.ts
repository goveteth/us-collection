import { description } from '../../package.json'

const _localesMeta = {
  name: {
    en: 'govet-us-collection',
  },
  description: {
    en: description,
  },
  author: {
    en: 'goveteth',
  },
}

export const localesMeta = {
  name: {
    ..._localesMeta.name,
  },
  description: {
    ..._localesMeta.description,
  },
  author: {
    ..._localesMeta.author,
  },
}
