export default defineEventHandler(async (_event) => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { app, nitro, ...env } = useRuntimeConfig()

  return env
})
