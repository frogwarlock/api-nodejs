import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'  
import { db } from '../database/client.ts'
import { courses } from '../database/schema.ts'
import z from 'zod'

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {

    server.get('/courses', {
        schema: {
            tags: ['courses'],
            summary: 'Get all courses',
            description: 'Essa rota busca todos os cursos no banco de dados.',
            response: {
                200: z.object({ // se eu digo que ele só retorna um objeto ele reclama que estou retornando um array, então eu defino que esse objeto tem uma propriedade que é um array
                    courses: z.array(z.object({
                        id: z.uuid(),
                        title: z.string(),
                    }))
                }).describe('Cursos encontrados com sucesso.')
            }
        }
    }, async (request, reply) => {
        const result = await db.select({
            id: courses.id,
            title: courses.title
        }
        ).from(courses)

        return reply.send({courses: result} )
    })

}