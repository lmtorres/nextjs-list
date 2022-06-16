import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
  const { name, description, team } = req.body
  const result = await prisma.team.upsert({
    where: {
      name: team.label
    },
    update: {
      players: {
        create: [
          {
            name: name,
            description: description
          }
        ]
      }
    },
    create: {
      name: team.label,
      players: {
        create: [
          {
            name: name,
            description: description
          }
        ]
      }
    }
  })
  res.json(result)
}
