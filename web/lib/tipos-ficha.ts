// lib/tipos-ficha.ts
// Tipos compartilhados entre a tela (cliente) e o servidor.
// Não tem "server-only" de propósito: só descreve o formato dos dados.

// Força (musculação) usa séries, repetições e carga.
// Cardio usa tempo, velocidade e inclinação.
export type TipoExercicio = "forca" | "cardio";

// Descobre o tipo de um exercício do catálogo.
// Usa o campo "tipo" do back-end; se ele não vier (ainda não foi criado no banco),
// considera cardio quem tem o grupo muscular "cardio".
export function tipoDoExercicio(ex: { tipo?: TipoExercicio; grupoMuscular: string }): TipoExercicio {
    if (ex.tipo === "forca" || ex.tipo === "cardio") return ex.tipo;
    return ex.grupoMuscular.trim().toLowerCase() === "cardio" ? "cardio" : "forca";
}

// Um exercício dentro da ficha: OU vem do catálogo (exercicioId),
// OU é um nome digitado pelo personal (nomePersonalizado). Nunca os dois.
// Só os campos do tipo dele são preenchidos; os outros ficam de fora.
export type ItemParaSalvar = {
    exercicioId?: string;
    nomePersonalizado?: string;
    tipo: TipoExercicio;
    // força
    seriesAlvo?: number;
    repeticoesAlvo?: number;
    cargaSugerida?: number;
    // cardio
    duracaoMin?: number;
    velocidadeKmh?: number;
    inclinacaoPct?: number;
};

export type FichaParaSalvar = {
    alunoId: string;
    itens: ItemParaSalvar[];
};

export type ResultadoSalvar = { ok: true } | { ok: false; erro: string };

// Um exercício como aparece na tela enquanto o personal monta a ficha.
// Os números ficam como TEXTO para o campo aceitar ficar vazio enquanto digita;
// só viram número na hora de salvar.
export type ItemNaTela = {
    uid: number;            // identificador só da tela (para a lista do React)
    exercicioId?: string;   // preenchido se veio do catálogo
    nome: string;           // nome mostrado (do catálogo ou digitado)
    grupoMuscular?: string; // só existe para os do catálogo
    personalizado: boolean; // true = o personal digitou o nome
    tipo: TipoExercicio;
    // força
    series: string;
    repeticoes: string;
    carga: string;
    // cardio
    duracao: string;        // minutos
    velocidade: string;     // km/h (pode ficar vazio)
    inclinacao: string;     // % (pode ficar vazio)
};

export type CampoNumerico =
    | "series"
    | "repeticoes"
    | "carga"
    | "duracao"
    | "velocidade"
    | "inclinacao";