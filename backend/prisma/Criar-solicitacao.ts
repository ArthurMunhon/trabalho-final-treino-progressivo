// Cria um pedido de teste (como se o aluno tivesse pedido pelo app).
// Uso: npx tsx prisma/criar-solicitacao.ts <emailDoPersonal> <emailDoAluno>
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';

try {
  process.loadEnvFile('.env');
} catch {}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const [emailPersonal, emailAluno] = process.argv.slice(2);
  if (!emailPersonal || !emailAluno) {
    throw new Error(
      'Uso: npx tsx prisma/criar-solicitacao.ts <emailPersonal> <emailAluno>',
    );
  }

  const personal = await prisma.personal.findUniqueOrThrow({
    where: { email: emailPersonal },
  });

  // Aluno SEM personal (personalId vazio) até o pedido ser aceito
  const aluno = await prisma.aluno.upsert({
    where: { email: emailAluno },
    update: {},
    create: {
      nome: emailAluno.split('@')[0],
      email: emailAluno,
      senha: await hash('123456', 10),
    },
  });

  await prisma.solicitacao.upsert({
    where: {
      alunoId_personalId: { alunoId: aluno.id, personalId: personal.id },
    },
    update: {},
    create: { alunoId: aluno.id, personalId: personal.id },
  });

  console.log('Solicitação criada!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
