import type { UserConfig } from '@commitlint/types'

const config: UserConfig = {
  // ref: https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional
  // ref: https://www.conventionalcommits.org/en/v1.0.0/#summary
  extends: ['@commitlint/config-conventional'],
  // [Question] how to extend and override config-conventional settings:
  // https://github.com/conventional-changelog/commitlint/issues/2232
  parserPreset: {
    parserOpts: {
      headerPattern: /^(?:([^\w\s]{1,2})\s+)?(\w+)(?:\((.*)\))?: (.*)$/,
      headerCorrespondence: ['emoji', 'type', 'scope', 'subject'],
    },
  },
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
      ],
    ],
  },
}

export default config
