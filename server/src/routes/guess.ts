import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count()

    return { count }
  })

  fastify.post('/pools/:poolId/games/:gameId/guesses', {
    onRequest: [authenticate]
  }, async (request, response) => {
    const CreateGuessParams = z.object({
      poolId: z.string(),
      gameId: z.string(),
    })

    const CreateGuessBody = z.object({
      firstTeamPoints: z.string(),
      secondTeamPoints: z.string(),
    })

    const { poolId, gameId } = CreateGuessParams.parse(request.params);
    const { firstTeamPoints, secondTeamPoints } = CreateGuessBody.parse(request.body);

    const participant = await prisma.participant.findUnique({
      where: {
        userId_poolId: {
          userId: request.user.sub,
          poolId,
        }
      }
    })

    if(!participant) {
      return response.status(400).send({
        message: 'You are not a participant of this pool'
      })
    }

    const guess = await prisma.guess.findUnique({
      where: {
        participantId_gameId: {
          participantId: participant.id,
          gameId,
        }
      }
    })

    if(guess) {
      return response.status(400).send({
        message: 'You already made a guess for this game'
      })
    }
    
    const game = await prisma.game.findUnique({
      where: {
        id: gameId
      }
    })

    if(!game) {
      return response.status(400).send({
        message: 'Game not found'
      })
    }

    // if(game.date < new Date()){
    //   return response.status(400).send({
    //     message: 'Game already started'
    //   })
    // }

    await prisma.guess.create({
      data: {
        gameId,
        participantId: participant.id,
        firstTeamPoints: parseInt(firstTeamPoints),
        secondTeamPoints: parseInt(secondTeamPoints),
      }
    })

    return response.status(201).send()
  })
}
