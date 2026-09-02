import Fastify from 'fastify'
import alunoRoutes from './routes/alunoRoutes.js'
import pool from './database/connection.js'


const app = Fastify({
  logger: true
})

app.register(alunoRoutes, {
  prefix: '/api/alunos'
})


app.setErrorHandler((error, request, reply) => {
  request.log.error(error)

  if (error.validation) {
    return reply.code(400).send({
      message: 'Dados inválidos',
      errors: error.validation
    })
  }

  return reply.code(500).send({
    message: 'Erro interno do servidor'
  })
})

app.addHook('onClose', async () => {
  await pool.end()
})

export default app