import Fastify from 'fastify'
import alunoRoutes from './routes/alunoRoutes.js'

const app = Fastify({
  logger: true
})

app.register(alunoRoutes)

export default app