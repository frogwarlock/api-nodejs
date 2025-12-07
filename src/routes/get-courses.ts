import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'  
import { db } from '../database/client.ts'
import { courses, enrollments } from '../database/schema.ts'
import { ilike, asc, and, SQL, eq, count } from 'drizzle-orm'
import z from 'zod'

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {

    server.get('/courses', {
        schema: {
            tags: ['courses'],
            summary: 'Get all courses',
            description: 'Essa rota busca todos os cursos no banco de dados.',
            querystring: z.object({
                search: z.string().optional(),
                orderBy: z.enum(['title', 'id']).optional().default('id'),
                page: z.coerce.number().optional().default(1),
            }),
            response: {
                200: z.object({ // se eu digo que ele só retorna um objeto ele reclama que estou retornando um array, então eu defino que esse objeto tem uma propriedade que é um array
                    courses: z.array(z.object({
                        id: z.uuid(),
                        title: z.string(),
                        enrollments: z.number(),
                    })
                ),
                total: z.number()
                }).describe('Cursos encontrados com sucesso.')
            }
        }
    }, async (request, reply) => {
        const { search, orderBy, page } = request.query

        const conditions: SQL[] = []

        if (search) {
            conditions.push(ilike(courses.title, `%${search}%`))
        }

        const [result, total] = await Promise.all([
            db
                .select({
                    id: courses.id,
                    title: courses.title,
                    enrollments: count(enrollments.id),
                }   
                ).from(courses)
                .leftJoin(enrollments, eq(courses.id, enrollments.courseId))
                .orderBy(asc(courses[orderBy]))
                .limit(10)
                .offset((page - 1) * 10) // pag atual, - 1 pq a primeira página é 1, e multiplica pela qtde de itens por página
                .where(and(...conditions))
                .groupBy(courses.id),
            db.$count(courses, and(...conditions))
        ])

        //inerjoin dois lados existam

        return reply.send({courses: result, total} )
    })

}

// Paginação
// offset: busca x componentes primeiro e mostra os x - y , é como se ele buscasse tudo e depois cortasse.
// cursor-based: ele busca por alguma coluna ordenável, da pra usar o uuid nas versões mais novas. Mais performatico que o offset se existirem muitos registros.