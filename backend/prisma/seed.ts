// backend/prisma/seed.ts
// Rodar na pasta backend:  npx tsx prisma/seed.ts
// Pode rodar várias vezes sem duplicar dados.
// Login de teste: carlos@fittrack.com / 123456

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

  // Senha de todos os usuários de teste: 123456 (salva como hash, nunca em texto)
  const senhaHash = await hash('123456', 10);

  // 1. Personal trainer
  const personal = await prisma.personal.upsert({
    where: { email: 'carlos@fittrack.com' },
    update: { senha: senhaHash }, // atualiza se já existia com senha antiga
    create: {
      nome: 'Carlos Personal',
      email: 'carlos@fittrack.com',
      senha: senhaHash,
    },
  });

  // 2. Aluno principal
  const aluno = await prisma.aluno.upsert({
    where: { email: 'marcos@exemplo.com' },
    update: { personalId: personal.id },
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
      update: { personalId: personal.id },
      create: {
        nome,
        email,
        senha: senhaHash,
        personalId: personal.id,
      },
    });
  }

  // 3. Exercícios (só cria se ainda não existir um com o mesmo nome)
  // 3. Exercícios (catálogo global, inseridos de uma vez)
  const catalogo: Record<string, string[]> = {
    peito: [
      'Supino reto com barra',
      'Supino reto com halteres',
      'Supino inclinado com barra',
      'Supino inclinado com halteres',
      'Supino declinado com barra',
      'Supino declinado com halteres',
      'Supino na máquina',
      'Supino articulado',
      'Crucifixo reto com halteres',
      'Crucifixo inclinado com halteres',
      'Crucifixo na máquina (peck deck)',
      'Crossover na polia alta',
      'Crossover na polia baixa',
      'Crossover na polia média',
      'Flexão de braços',
      'Flexão de braços inclinada',
      'Flexão de braços declinada',
      'Flexão diamante',
      'Pullover com halter',
      'Mergulho nas paralelas (foco peito)',
    ],
    costas: [
      'Puxada alta',
      'Puxada alta pegada aberta',
      'Puxada alta pegada fechada',
      'Puxada alta pegada supinada',
      'Puxada alta com triângulo',
      'Puxada atrás da nuca',
      'Barra fixa pronada',
      'Barra fixa supinada',
      'Barra fixa com pegada neutra',
      'Barra fixa assistida',
      'Remada curvada com barra',
      'Remada curvada supinada',
      'Remada unilateral com halter (serrote)',
      'Remada baixa na polia',
      'Remada baixa com triângulo',
      'Remada cavalinho',
      'Remada na máquina',
      'Remada articulada',
      'Remada alta',
      'Pulldown com corda',
      'Pulldown com braços estendidos',
      'Levantamento terra',
      'Remada invertida',
    ],
    ombro: [
      'Desenvolvimento com barra',
      'Desenvolvimento com halteres',
      'Desenvolvimento Arnold',
      'Desenvolvimento na máquina',
      'Desenvolvimento atrás da nuca',
      'Elevação lateral com halteres',
      'Elevação lateral na polia',
      'Elevação lateral na máquina',
      'Elevação frontal com halteres',
      'Elevação frontal com barra',
      'Elevação frontal na polia',
      'Crucifixo inverso com halteres',
      'Crucifixo inverso na máquina',
      'Face pull',
      'Remada alta com barra',
      'Remada alta com halteres',
    ],
    trapezio: [
      'Encolhimento com barra',
      'Encolhimento com halteres',
      'Encolhimento na máquina',
      'Encolhimento na barra Smith',
    ],
    biceps: [
      'Rosca direta com barra reta',
      'Rosca direta com barra W',
      'Rosca alternada com halteres',
      'Rosca simultânea com halteres',
      'Rosca martelo',
      'Rosca martelo na corda',
      'Rosca concentrada',
      'Rosca Scott com barra',
      'Rosca Scott com halter',
      'Rosca Scott na máquina',
      'Rosca inclinada com halteres',
      'Rosca na polia baixa',
      'Rosca na polia alta (bíceps na polia)',
      'Rosca 21',
      'Rosca inversa',
      'Rosca spider',
    ],
    triceps: [
      'Tríceps pulley com barra reta',
      'Tríceps pulley com corda',
      'Tríceps pulley com barra V',
      'Tríceps pulley invertido',
      'Tríceps testa com barra',
      'Tríceps testa com halteres',
      'Tríceps francês com halter',
      'Tríceps francês na polia',
      'Tríceps coice com halter',
      'Tríceps coice na polia',
      'Tríceps banco',
      'Mergulho nas paralelas (foco tríceps)',
      'Supino fechado',
      'Tríceps na máquina',
    ],
    antebraco: [
      'Rosca de punho com barra',
      'Rosca de punho inversa',
      'Rosca de punho com halteres',
      'Farmer walk',
      'Rolo de punho (wrist roller)',
    ],
    quadriceps: [
      'Agachamento livre',
      'Agachamento frontal',
      'Agachamento no Smith',
      'Agachamento hack',
      'Agachamento búlgaro',
      'Agachamento sumô',
      'Agachamento com salto',
      'Agachamento goblet',
      'Leg press 45°',
      'Leg press horizontal',
      'Cadeira extensora',
      'Afundo com halteres',
      'Afundo com barra',
      'Afundo caminhando',
      'Passada',
      'Step-up no banco',
      'Sissy squat',
    ],
    posterior: [
      'Mesa flexora',
      'Cadeira flexora',
      'Flexora em pé',
      'Stiff com barra',
      'Stiff com halteres',
      'Levantamento terra romeno',
      'Levantamento terra unilateral',
      'Good morning',
      'Flexão nórdica',
    ],
    gluteo: [
      'Elevação pélvica com barra',
      'Elevação pélvica na máquina',
      'Ponte de glúteo',
      'Glúteo na polia (coice)',
      'Coice na máquina',
      'Coice com caneleira',
      'Abdução de quadril em pé na polia',
      'Agachamento sumô com halter',
      'Hiperextensão de quadril',
      'Cadeira abdutora',
      'Abdução com elástico',
    ],
    adutores: ['Cadeira adutora', 'Adução na polia', 'Adução deitado'],
    panturrilha: [
      'Panturrilha em pé na máquina',
      'Panturrilha sentado',
      'Panturrilha no leg press',
      'Panturrilha no degrau',
      'Panturrilha unilateral com halter',
      'Panturrilha no Smith',
    ],
    abdomen: [
      'Abdominal supra',
      'Abdominal infra',
      'Abdominal remador',
      'Abdominal na máquina',
      'Abdominal na polia (crunch)',
      'Abdominal oblíquo',
      'Abdominal bicicleta',
      'Elevação de pernas deitado',
      'Elevação de pernas na barra fixa',
      'Elevação de joelhos no apoio',
      'Prancha frontal',
      'Prancha lateral',
      'Roda abdominal',
      'Russian twist',
      'Mountain climber',
      'Dead bug',
    ],
    lombar: [
      'Extensão lombar no banco',
      'Hiperextensão lombar',
      'Superman',
      'Bird dog',
    ],
    cardio: [
      'Esteira',
      'Bicicleta ergométrica',
      'Elíptico',
      'Remo ergométrico',
      'Escada (stair climber)',
      'Corda naval',
      'Pular corda',
      'Burpee',
      'Polichinelo',
    ],
  };

  // Transforma o objeto em lista [{ nome, grupoMuscular }] e insere tudo numa chamada só
  await prisma.exercicio.createMany({
    data: Object.entries(catalogo).flatMap(([grupoMuscular, nomes]) =>
      nomes.map((nome) => ({ nome, grupoMuscular })),
    ),
  });

  // A ficha do aluno usa este exercício
  const exercicio1 = await prisma.exercicio.findFirstOrThrow({
    where: { nome: 'Supino reto com barra' },
  });
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
