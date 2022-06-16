import prisma from '../../../lib/prisma'
import { getSession } from "next-auth/react"

export default async function handle(req, res) {
  const session = await getSession({ req })
  if (session) {
    const playerId = req.query.id

    if (req.method === 'PUT') {
      handlePUT(req, res)
    } else if (req.method === 'DELETE') {
      handleDELETE(playerId, res)
    } else {
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      )
    }
  } else {
    throw new Error(
      `User is not authenticated.`
    )
  }

}

// PUT /api/player/:id
async function handlePUT(req, res) {
  const playerId = req.query.id
  const { name, description, team } = req.body
  try {
    // find or create the team information first
    const updatedTeam = await prisma.team.upsert({
      where: {
        name: team.label
      },
      update: {},
      create: {
        name: team.label
      }
    })
    // update the player information
    const player = await prisma.player.update({
      where: { id: Number(playerId) },
      data: {
        name: name,
        description: description,
        teamId: updatedTeam.id
      }
    })
    res.json(player)
  } catch (error) {
    console.error(error);
  }
}

// DELETE /api/player/:id
async function handleDELETE(playerId, res) {
  try {
    const player = await prisma.player.delete({
      where: { id: Number(playerId) },
    })
    res.json(player)
  } catch (error) {
    console.error(error);
  }
}
