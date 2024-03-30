import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/vite'],
  rollup: {
    emitCJS: true,
  },
})
