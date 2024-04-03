import antfu from '@antfu/eslint-config'

export default antfu({
  isInEditor: false,
  rules: {
    'style/eol-last': 'warn',
  },
})
