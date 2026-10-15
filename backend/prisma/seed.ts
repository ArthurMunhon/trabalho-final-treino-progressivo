import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando a seed do banco de dados...');

    // 1. Criar um Personal Trainer padr  ão
    const personal = await prisma.personal.upsert({
        where: { email: 'carlos@fittrack.com' },
        update: {},
        create: {
            nome: 'Carlos Personal',
            email: 'carlos@fittrack.com',
            senha: 'hash-da-senha-123',
        },
    });

    // 2. Criar um Aluno padrão
    const aluno = await prisma.aluno.upsert({
        where: { email: 'marcos@exemplo.com' },
        update: {},
        create: {
            nome: 'Marcos Vinicius',
            email: 'marcos@exemplo.com',
            senha: 'hash-da-senha-123',
        },
    });

    // 3. Criar Exercícios iniciais
    const exercicio1 = await prisma.exercicio.create({
        data: {
            nome: 'Supino reto com barra',
            grupoMuscular: 'peito',
        },
    });

    const exercicio2 = await prisma.exercicio.create({
        data: {
            nome: 'Puxada alta',
            grupoMuscular: 'costas',
        },
    });

    // 4. Criar uma Ficha de Treino ligando o Aluno, o Personal e um Item (Exercício)
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