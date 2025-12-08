<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

# Desafio Node.js (Fastify + Zod)

API em Node.js usando Fastify com validação via Zod, documentação OpenAPI e UI via Scalar.

## Setup

- Pré-requisitos: Node.js 18+, npm ou pnpm
- Instalação:
  ```bash
  npm install
  # ou
  pnpm install
  ```

## Migrações

Este projeto não usa banco de dados por padrão.

- Se adicionar um ORM (ex.: Prisma), documente aqui:
  - Configurar `.env`
  - Criar schema
  - Executar migrações
  - Atualizar rotas para persistência

## Execução

- Desenvolvimento:
  ```bash
  NODE_ENV=development node server.ts
  # ou com tsx/ts-node (se configurado):
  NODE_ENV=development tsx server.ts
  ```
- Servidor: `http://localhost:3333`

## Documentação

- OpenAPI habilitada quando `NODE_ENV=development`.
- Scalar (UI): `http://localhost:3333/docs`

## Fluxo da Aplicação

```mermaid
flowchart TD
    A[Cliente HTTP] -->|Request| B[Fastify Server]
    B --> C[Validator Compiler - Zod]
    C -->|Validação OK| D{Roteamento}
    C -->|Validação Falha| E[Retorna 400 Bad Request]

    D -->|POST /courses| F[createCourseRoute]
    D -->|GET /courses| G[getCoursesRoute]
    D -->|GET /courses/:id| H[getCourseByIdRoute]

    F --> I[Armazena Curso na Lista]
    I --> J[Serializer Compiler - Zod]
    J --> K[Retorna 201 Created]

    G --> L[Busca Todos os Cursos]
    L --> M[Serializer Compiler - Zod]
    M --> N[Retorna 200 OK com Lista]

    H --> O{Curso Existe?}
    O -->|Sim| P[Serializer Compiler - Zod]
    O -->|Não| Q[Retorna 404 Not Found]
    P --> R[Retorna 200 OK com Curso]

    K --> A
    N --> A
    R --> A
    E --> A
    Q --> A

    style B fill:#2ea44f
    style C fill:#0969da
    style J fill:#0969da
    style M fill:#0969da
    style P fill:#0969da
    style E fill:#cf222e
    style Q fill:#cf222e
```

## Endpoints

### Cursos

#### POST `/courses`

Cria um novo curso.

**Request Body:**

```json
{
  "title": "Node.js Básico",
  "description": "Introdução ao Node.js"
}
```

**Response:** `201 Created`

```json
{
  "id": "1",
  "title": "Node.js Básico",
  "description": "Introdução ao Node.js"
}
```

**Erros:**

- `400 Bad Request` - Dados inválidos (title ou description ausentes/inválidos)

---

#### GET `/courses`

Lista todos os cursos cadastrados.

**Response:** `200 OK`

```json
[
  {
    "id": "1",
    "title": "Node.js Básico",
    "description": "Introdução ao Node.js"
  },
  {
    "id": "2",
    "title": "TypeScript Avançado",
    "description": "Conceitos avançados de TypeScript"
  }
]
```

---

#### GET `/courses/:id`

Obtém um curso específico por ID.

**Parâmetros de Rota:**

- `id` (string) - ID do curso

**Response:** `200 OK`

```json
{
  "id": "1",
  "title": "Node.js Básico",
  "description": "Introdução ao Node.js"
}
```

**Erros:**

- `404 Not Found` - Curso não encontrado
- `400 Bad Request` - ID inválido

---

**Observação:** Todos os endpoints utilizam `validatorCompiler` (validação de entrada) e `serializerCompiler` (serialização de saída) com Zod para garantir consistência e type-safety.

## Dicas

- Defina `NODE_ENV=development` para ver Swagger/Scalar.
- Ajuste a porta em `server.listen({ port: 3333 })` conforme necessidade.
- Use logs do Pino (com pino-pretty) para desenvolvimento.
- Mantenha schemas Zod sincronizados com a OpenAPI para evitar inconsistências.

## Estrutura (resumo)

- `server.ts` — Fastify, Zod, Swagger, Scalar e registro de rotas.
- `src/routes/create-course.ts` — criação de curso.
- `src/routes/get-courses.ts` — listagem de cursos.
- `src/routes/get-course-by-id.ts` — obter curso por ID.
