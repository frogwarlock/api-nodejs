import { test, expect } from  'vitest';
import  request from 'supertest';
import { server } from '../app.ts';
import { MakeCourse } from '../tests/factories/make-course.ts';

test('get course by id succefully', async () => {
    await server.ready()

    const course = await MakeCourse()

    const response = await request(server.server)
        .get(`/courses/${course.id}`)
    
        expect(response.status).toEqual(200)
        expect(response.body).toEqual({
            course: {
                id: expect.any(String),
                title: expect.any(String),
                description: null,
            }
        })
    })

test('return 404 when course not found', async () => {
    
  const nonExistingId = 'c4e5e9c2-7f3a-4b9a-9e5e-2f6d8a3b1c74'

  const response = await request(server.server)
    .get(`/courses/${nonExistingId}`)

  expect(response.status).toEqual(404)
})