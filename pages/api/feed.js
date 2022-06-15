import prisma from '../../lib/prisma'

export default async function handle(req, res) {
  const players = await prisma.player.findMany({
    include: { team: true },
  })
  res.json(players)
}
