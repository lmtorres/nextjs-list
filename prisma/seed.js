const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const teamData = [
  {
    name: 'New York Mets',
    players: {
      create: [
        {
          name: 'Jacob deGrom',
          description: 'Pitcher',
        },
        {
          name: 'Max Scherzer',
          description: 'Pitcher',
        },
        {
          name: 'Pete Alonso',
          description: 'First Baseman',
        },
        {
          name: 'Edwin Díaz',
          description: 'Closer',
        },
        {
          name: 'Francisco Lindor',
          description: 'Shortstop',
        },
        {
          name: 'Starling Marte',
          description: 'Outfielder',
        },
      ],
    },
  },
  {
    name: 'Los Angeles Dodgers',
    players: {
      create: [
        {
          name: 'Clayton Kershaw',
          description: 'Pitcher',
        },
        {
          name: 'Walker Buehler',
          description: 'Pitcher',
        },
        {
          name: 'Freddie Freeman',
          description: 'First Baseman',
        },
        {
          name: 'Craig Kimbrel',
          description: 'Closer',
        },
        {
          name: 'Trea Turner',
          description: 'Shortstop',
        },
        {
          name: 'Mookie Betts',
          description: 'Outfielder',
        },
      ],
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const t of teamData) {
    const team = await prisma.team.create({
      data: t,
    })
    console.log(`Created team with id: ${team.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
