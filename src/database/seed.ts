import { db } from "./client.ts";
import { courses, enrollments, users } from "./schema.ts";
import { fakerPT_BR as faker } from '@faker-js/faker'

async function seed() {
    const usersInsert = await db.insert(users).values([
        {name: faker.person.fullName(), email: faker.internet.email()},
        {name: faker.person.fullName(), email: faker.internet.email()},
        {name: faker.person.fullName(), email: faker.internet.email()},
        {name: faker.person.fullName(), email: faker.internet.email()},
        {name: faker.person.fullName(), email: faker.internet.email()},
        {name: faker.person.fullName(), email: faker.internet.email()}
    ]).returning();

    const coursesInsert = await db.insert(courses).values([
        {title: 'Introdução ao Node.js', description: 'Aprenda os conceitos básicos do Node.js e como construir aplicações escaláveis.'},
        {title: 'Fastify para Iniciantes', description: 'Curso completo sobre Fastify, um framework web rápido e eficiente para Node.js.'},
        {title: 'Validação com Zod', description: 'Aprenda a validar dados de forma simples e eficaz usando a biblioteca Zod.'},
        {title: 'Documentação OpenAPI', description: 'Crie documentações interativas para suas APIs utilizando o padrão OpenAPI.'},
        {title: 'UI com Scalar', description: 'Desenvolva interfaces de usuário modernas e responsivas com Scalar.'}
    ]).returning();

    await db.insert(enrollments).values([
        {userId: usersInsert[0].id, courseId: coursesInsert[0].id},
        {userId: usersInsert[0].id, courseId: coursesInsert[1].id},
        {userId: usersInsert[1].id, courseId: coursesInsert[2].id}, 
    ])  
}

seed();