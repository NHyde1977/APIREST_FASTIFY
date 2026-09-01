import alunoController from '../controllers/alunoController.js'

async function alunoRoutes(fastify) {
  fastify.get('/alunos', alunoController.index)

  fastify.get('/alunos/:id', alunoController.show)

  fastify.post('/alunos', alunoController.store)

  fastify.put('/alunos/:id', alunoController.update)

  fastify.delete('/alunos/:id', alunoController.delete)
}

export default alunoRoutes