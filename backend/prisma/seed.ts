// backend/prisma/seed.ts
// Rodar na pasta backend:  npx tsx prisma/seed.ts
// Pode rodar várias vezes sem duplicar dados.

import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';

// tsx não lê o .env sozinho; carrega a DATABASE_URL daqui
try {
  process.loadEnvFile('.env');
} catch {
  // se o .env não existir, usa as variáveis do sistema
}

// Prisma 7 exige um adaptador do Postgres
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando a seed do banco de dados...');

  // Mesmo hash que o AuthService usa no cadastro; senha de teste de todos: 123456
  const senhaHash = await hash('123456', 10);

  // 1. Personal trainer
  const personal = await prisma.personal.upsert({
    where: { email: 'carlos@fittrack.com' },
    update: { senha: senhaHash }, // garante o hash mesmo se ele ja existia com senha antiga
    create: {
      nome: 'Carlos Personal',
      email: 'carlos@fittrack.com',
      senha: senhaHash,
    },
  });

  // 2. Aluno
  const aluno = await prisma.aluno.upsert({
    where: { email: 'marcos@exemplo.com' },
    update: { senha: senhaHash }, // idem: ele foi criado antes do hash
    create: {
      nome: 'Marcos Vinicius',
      email: 'marcos@exemplo.com',
      senha: senhaHash,
      personalId: personal.id, // aluno pertence ao Carlos
    },
  });

  // 2b. Mais alunos, pra testar busca e paginação (9 por página => 15 dá 2 páginas)
  const outrosAlunos = [
    ['Ana Beatriz', 'ana.beatriz@exemplo.com'],
    ['Bruno Almeida', 'bruno.almeida@exemplo.com'],
    ['Camila Souza', 'camila.souza@exemplo.com'],
    ['Daniel Ferreira', 'daniel.ferreira@exemplo.com'],
    ['Eduarda Lima', 'eduarda.lima@exemplo.com'],
    ['Felipe Costa', 'felipe.costa@exemplo.com'],
    ['Gabriela Rocha', 'gabriela.rocha@exemplo.com'],
    ['Henrique Martins', 'henrique.martins@exemplo.com'],
    ['Isabela Nunes', 'isabela.nunes@exemplo.com'],
    ['José Carlos', 'jose.carlos@exemplo.com'],
    ['Karina Duarte', 'karina.duarte@exemplo.com'],
    ['Lucas Pereira', 'lucas.pereira@exemplo.com'],
    ['Marina Silva', 'marina.silva@exemplo.com'],
    ['Marcos Paulo', 'marcos.paulo@exemplo.com'],
  ];

  for (const [nome, email] of outrosAlunos) {
    await prisma.aluno.upsert({
      where: { email },
      update: {},
      create: {
        nome,
        email,
        senha: senhaHash,
        personalId: personal.id,
      },
    });
  }

  // 3. Exercícios (só cria se ainda não existir um com o mesmo nome)
  async function garantirExercicio(nome: string, grupoMuscular: string) {
    const existente = await prisma.exercicio.findFirst({ where: { nome } });
    return (
      existente ?? prisma.exercicio.create({ data: { nome, grupoMuscular } })
    );
  }

  const exercicio1 = await garantirExercicio('Supino reto com barra', 'peito');
  await garantirExercicio('Puxada alta', 'costas');

  // 4. Ficha do aluno (só cria se ele ainda não tiver nenhuma)
  const fichaExistente = await prisma.ficha.findFirst({
    where: { alunoId: aluno.id },
  });

  if (!fichaExistente) {
    await prisma.ficha.create({
      data: {
        alunoId: aluno.id,
        personalId: personal.id,
        itens: {
          create: [
            {
              exercicioId: exercicio1.id,
              ordem: 1,
              seriesAlvo: 4,
              repeticoesAlvo: 10,
              cargaSugerida: 40,
            },
          ],
        },
      },
    });
  }

  console.log('Seed finalizada com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao rodar a seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
