import 'dotenv/config'
import { buildApp } from './app.js'

const port = Number(process.env.PORT ?? 3333)

async function main() {
  const app = await buildApp()
  await app.listen({ port, host: '0.0.0.0' })
  app.log.info(`Documentation: http://localhost:${port}/docs`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
