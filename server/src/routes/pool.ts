import { FastifyInstance } from "fastify"
import ShortUniqueId from "short-unique-id"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function poolRoutes(fastify: FastifyInstance) {
  fastify.get('/pools/count', async () => {
    const count = await prisma.pool.count()
    
    return { count }
  })

  fastify.post('/pools', async (request, response) => {
    const createPoolBody = z.object({
      title: z.string(),
    })

    const { title } = createPoolBody.parse(request.body)

    const genarate = new ShortUniqueId({ length: 6 });
    const code = String(genarate()).toUpperCase();

    try {
      await request.jwtVerify();

      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,

          participants : {
            create: {
              userId: request.user.sub,
            }
          }
        }
      })
    } catch {
      await prisma.pool.create({
        data: {
          title,
          code,
        }
      })
    }

    return response.status(201).send({ code })
  })

  fastify.post('/pools/join', {
    onRequest: [authenticate]
  }, async (request, response) => {
    const joinPoolBody = z.object({
      code: z.string(),
    })

    const { code } = joinPoolBody.parse(request.body);

    const pool = await prisma.pool.findUnique({
      where: {
        code,
      },
      include: {
        participants: {
          where: {
            userId: request.user.sub,
          }
        },
      }
    })

    if(!pool) {
      return response.status(404).send({ 
        message: 'Pool not found' 
      })
    }

    if(pool.participants.length > 0) {
      return response.status(400).send({ 
        message: 'You are already in this pool' 
      })
    }

    if(!pool.ownerId) {
      await prisma.pool.update({
        where: {
          id: pool.id,
        },
        data: {
          ownerId: request.user.sub,
        }
      })
    }

    await prisma.participant.create({
      data: {
        userId: request.user.sub,
        poolId: pool.id,
      }
    })

    return response.status(201).send();
  })

  fastify.get('/pools', {
    onRequest: [authenticate]
  }, async (request) => {
    const pools = await prisma.pool.findMany({
      where: {
        participants: {
          some: {
            userId: request.user.sub,
          }
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          }
        },
        participants: {
          select: {
            id: true,
            user: {
              select: {
                avatarUrl: true,
              }
            }
          },
          take: 4,
        },
        _count: {
          select: {
            participants: true,
          }
        }
      }
    })

    return { pools }
  })

  fastify.get('/pools/:id', {
    onRequest: [authenticate]
  }, async (request) => {
    const getPoolParams = z.object({
      id: z.string(),
    })

    const { id } = getPoolParams.parse(request.params);

    const pools = await prisma.pool.findUnique({
      where: {
        id
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          }
        },
        participants: {
          select: {
            id: true,
            user: {
              select: {
                avatarUrl: true,
              }
            }
          },
          take: 4,
        },
        _count: {
          select: {
            participants: true,
          }
        }
      }
    })

    return { pools }
  })
}
