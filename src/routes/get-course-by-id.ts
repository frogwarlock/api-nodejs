import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../database/client.ts'
import { courses } from '../database/schema.ts'
import z, { check } from 'zod'
import { desc, eq } from 'drizzle-orm'
import { checkRequestJwt } from './hooks/check-request-jwt.ts'
import { getAuthenticatedUserFromRequest } from '../utils/get-authenticated-user-from-request.ts'

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {

    server.get('/courses/:id', {
        preHandler: [
            checkRequestJwt,
        ],
        schema: {
            tags: ['courses'],
            summary: 'Get course by ID',
            description: 'Essa rota busca um curso no banco de dados pelo seu ID.',
            params: z.object({
                id: z.uuid(),

            }),
            response: {
                200: z.object({
                    course: z.object({
                        id: z.uuid(),
                        title: z.string(),
                        description: z.string().nullable(),
                    })
                }).describe('Curso encontrado com sucesso.'),
                404: z.undefined().describe('Curso não encontrado.')
            }
        }
    }, async (request, reply) => {
        const user = getAuthenticatedUserFromRequest(request)

        const courseId = request.params.id

        const result = await db
            .select()
            .from(courses)
            .where(eq(courses.id, courseId))
        
        if (result.length === 0) {
            return reply.status(404).send()
        }

        return reply.status(200).send({
            course: {
                id: result[0].id,
                title: result[0].title,
                description: result[0].description ?? null,
            }
        })
            
    })
   
}