import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';

try {
  process.loadEnvFile('.env');
} catch {}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // troque pelo e-mail com que você criou a conta de personal
  const personal = await prisma.personal.findUniqueOrThrow({
    //adicionar email do personal!!
    where: { email: 'oothavio23@gmail.com' },
  });

  const senhaHash = await hash('123456', 10);

  await prisma.aluno.upsert({
    where: { email: 'oothavio23@gmail.com' },
    update: { personalId: personal.id },
    create: {
      nome: 'Othavio',
      email: 'oothavio23@gmail.com',
      senha: senhaHash,
      personalId: personal.id,
    },
  });

  console.log('Aluno adicionado!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
