"use client";

// Tela de montar a ficha:
//   ESQUERDA: catálogo de exercícios (filtro + cartões para arrastar)
//   DIREITA : a ficha do aluno (área onde se solta os cartões)
// Usa só o "arrastar e soltar" do próprio navegador, sem biblioteca.

import { useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import type { Exercicio } from "@/lib/exercicios";
import type { Aluno } from "@/lib/alunos";
import { tipoDoExercicio } from "@/lib/tipos-ficha";
import type { CampoNumerico, ItemNaTela, ItemParaSalvar, TipoExercicio } from "@/lib/tipos-ficha";
import { salvarFicha } from "@/app/treinos/acoes";
import CartaoExercicio from "./Cartaoexercicio";
import ItemDaFicha from "./Itemdaficha";

type Mensagem = { tipo: "ok" | "erro"; texto: string };

export default function ConstrutorFicha({
                                            alunos,
                                            exercicios,
                                        }: {
    alunos: Aluno[];
    exercicios: Exercicio[];
}) {
    const [alunoId, setAlunoId] = useState("");
    const [itens, setItens] = useState<ItemNaTela[]>([]);
    const [busca, setBusca] = useState("");
    const [grupo, setGrupo] = useState(""); // "" = todos
    const [nomeLivre, setNomeLivre] = useState("");
    const [tipoLivre, setTipoLivre] = useState<TipoExercicio>("forca");
    const [sobre, setSobre] = useState(false); // true enquanto algo é arrastado por cima da ficha
    const [mensagem, setMensagem] = useState<Mensagem | null>(null);
    const [salvando, iniciar] = useTransition();
    const proximoUid = useRef(1); // gera um número único para cada item da tela

    // Valores iniciais de cada tipo (o personal ajusta depois)
    function padroes(tipo: TipoExercicio) {
        return tipo === "cardio"
            ? { series: "", repeticoes: "", carga: "", duracao: "30", velocidade: "", inclinacao: "" }
            : { series: "4", repeticoes: "10", carga: "0", duracao: "", velocidade: "", inclinacao: "" };
    }

    // ---------- Catálogo filtrado ----------
    const grupos = useMemo(
        () => [...new Set(exercicios.map((e) => e.grupoMuscular))].sort(),
        [exercicios],
    );

    const filtrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        return exercicios.filter(
            (e) =>
                (grupo === "" || e.grupoMuscular === grupo) &&
                (termo === "" || e.nome.toLowerCase().includes(termo)),
        );
    }, [exercicios, busca, grupo]);

    const idsNaFicha = new Set(itens.map((i) => i.exercicioId).filter(Boolean));

    // ---------- Mexer na ficha ----------
    function adicionarDoCatalogo(ex: Exercicio) {
        if (idsNaFicha.has(ex.id)) return; // não repete o mesmo exercício
        setMensagem(null);
        setItens((atual) => [
            ...atual,
            {
                uid: proximoUid.current++,
                exercicioId: ex.id,
                nome: ex.nome,
                grupoMuscular: ex.grupoMuscular,
                personalizado: false,
                tipo: tipoDoExercicio(ex),
                ...padroes(tipoDoExercicio(ex)),
            },
        ]);
    }

    function adicionarPersonalizado() {
        const nome = nomeLivre.trim();
        if (nome === "") return;
        setMensagem(null);
        setItens((atual) => [
            ...atual,
            {
                uid: proximoUid.current++,
                nome,
                personalizado: true,
                tipo: tipoLivre,
                ...padroes(tipoLivre),
            },
        ]);
        setNomeLivre("");
    }

    function mudarCampo(uid: number, campo: CampoNumerico, valor: string) {
        setItens((atual) => atual.map((i) => (i.uid === uid ? { ...i, [campo]: valor } : i)));
    }

    function remover(uid: number) {
        setItens((atual) => atual.filter((i) => i.uid !== uid));
    }

    // Troca o item de lugar com o vizinho (-1 sobe, +1 desce)
    function mover(indice: number, direcao: -1 | 1) {
        setItens((atual) => {
            const destino = indice + direcao;
            if (destino < 0 || destino >= atual.length) return atual;
            const copia = [...atual];
            [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
            return copia;
        });
    }

    // ---------- Arrastar e soltar ----------
    function aoSoltar(e: React.DragEvent) {
        e.preventDefault(); // sem isto o navegador tenta abrir o conteúdo arrastado
        setSobre(false);
        const id = e.dataTransfer.getData("text/plain"); // o id guardado no onDragStart
        const exercicio = exercicios.find((x) => x.id === id);
        if (exercicio) adicionarDoCatalogo(exercicio);
    }

    // ---------- Salvar ----------
    function salvar() {
        if (alunoId === "") return setMensagem({ tipo: "erro", texto: "Escolha o aluno." });
        if (itens.length === 0) {
            return setMensagem({ tipo: "erro", texto: "Arraste ao menos um exercício para a ficha." });
        }

        // Converte o texto dos campos em número e confere (cada tipo tem os seus campos)
        const paraEnviar: ItemParaSalvar[] = [];
        for (const item of itens) {
            const identificacao = item.personalizado
                ? { nomePersonalizado: item.nome }
                : { exercicioId: item.exercicioId };

            if (item.tipo === "cardio") {
                const duracao = Number(item.duracao);
                // Campo vazio = não informado (fica de fora)
                const velocidade = item.velocidade === "" ? undefined : Number(item.velocidade);
                const inclinacao = item.inclinacao === "" ? undefined : Number(item.inclinacao);

                if (!Number.isInteger(duracao) || duracao < 1 || duracao > 300) {
                    return setMensagem({ tipo: "erro", texto: `${item.nome}: tempo de 1 a 300 minutos.` });
                }
                if (velocidade !== undefined && !(velocidade >= 0.1 && velocidade <= 40)) {
                    return setMensagem({ tipo: "erro", texto: `${item.nome}: velocidade de 0,1 a 40 km/h.` });
                }
                if (inclinacao !== undefined && !(inclinacao >= 0 && inclinacao <= 40)) {
                    return setMensagem({ tipo: "erro", texto: `${item.nome}: inclinação de 0 a 40%.` });
                }

                paraEnviar.push({
                    ...identificacao,
                    tipo: "cardio",
                    duracaoMin: duracao,
                    ...(velocidade !== undefined ? { velocidadeKmh: velocidade } : {}),
                    ...(inclinacao !== undefined ? { inclinacaoPct: inclinacao } : {}),
                });
            } else {
                const series = Number(item.series);
                const repeticoes = Number(item.repeticoes);
                const carga = Number(item.carga === "" ? "0" : item.carga);

                if (!Number.isInteger(series) || series < 1 || series > 20) {
                    return setMensagem({ tipo: "erro", texto: `${item.nome}: séries de 1 a 20.` });
                }
                if (!Number.isInteger(repeticoes) || repeticoes < 1 || repeticoes > 100) {
                    return setMensagem({ tipo: "erro", texto: `${item.nome}: repetições de 1 a 100.` });
                }
                if (Number.isNaN(carga) || carga < 0 || carga > 1000) {
                    return setMensagem({ tipo: "erro", texto: `${item.nome}: carga de 0 a 1000 kg.` });
                }

                paraEnviar.push({
                    ...identificacao,
                    tipo: "forca",
                    seriesAlvo: series,
                    repeticoesAlvo: repeticoes,
                    cargaSugerida: carga,
                });
            }
        }

        setMensagem(null);
        iniciar(async () => {
            const resultado = await salvarFicha({ alunoId, itens: paraEnviar });
            if (resultado.ok) {
                setMensagem({ tipo: "ok", texto: "Ficha salva com sucesso!" });
                setItens([]); // limpa para montar a próxima
            } else {
                setMensagem({ tipo: "erro", texto: resultado.erro });
            }
        });
    }

    // ---------- Tela ----------
    if (alunos.length === 0) {
        return (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center">
                <p className="text-lg font-semibold">Você ainda não tem alunos</p>
                <p className="mt-1 text-sm text-zinc-400">
                    Quando um aluno for aceito por você, ele aparece aqui para você montar a ficha.
                </p>
                <Link
                    href="/alunos"
                    className="mt-6 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200"
                >
                    Ver alunos
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Escolha do aluno */}
            <label className="block max-w-sm text-sm text-zinc-400">
                Aluno
                <select
                    value={alunoId}
                    onChange={(e) => setAlunoId(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-zinc-500"
                >
                    <option value="">Selecione o aluno...</option>
                    {alunos.map((a) => (
                        <option key={a.id} value={a.id}>
                            {a.nome}
                        </option>
                    ))}
                </select>
            </label>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* ESQUERDA: catálogo */}
                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Exercícios</h2>

                    <input
                        type="search"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar exercício"
                        className="block w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-zinc-500"
                    />

                    {/* Filtro por grupo muscular */}
                    <div className="flex flex-wrap gap-2">
                        {["", ...grupos].map((g) => (
                            <button
                                key={g || "todos"}
                                type="button"
                                onClick={() => setGrupo(g)}
                                className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${
                                    grupo === g
                                        ? "bg-white text-black"
                                        : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                                }`}
                            >
                                {g === "" ? "Todos" : g}
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        {filtrados.map((ex) => (
                            <CartaoExercicio
                                key={ex.id}
                                exercicio={ex}
                                jaNaFicha={idsNaFicha.has(ex.id)}
                                onAdicionar={() => adicionarDoCatalogo(ex)}
                            />
                        ))}
                    </div>
                    {filtrados.length === 0 && (
                        <p className="text-sm text-zinc-500">Nenhum exercício encontrado.</p>
                    )}

                    {/* Exercício que não está na lista */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            adicionarPersonalizado();
                        }}
                        className="rounded-xl border border-dashed border-zinc-700 p-3"
                    >
                        <label className="block text-xs text-zinc-400">
                            Não achou? Digite um exercício personalizado
                            <div className="mt-1 flex gap-2">
                                <select
                                    value={tipoLivre}
                                    onChange={(e) => setTipoLivre(e.target.value as TipoExercicio)}
                                    aria-label="Tipo do exercício personalizado"
                                    className="shrink-0 rounded-lg border border-zinc-800 bg-black px-2 text-sm text-white outline-none focus:border-zinc-500"
                                >
                                    <option value="forca">Força</option>
                                    <option value="cardio">Cardio</option>
                                </select>
                                <input
                                    value={nomeLivre}
                                    onChange={(e) => setNomeLivre(e.target.value)}
                                    maxLength={80}
                                    placeholder="Nome do exercício"
                                    className="block w-full rounded-lg border border-zinc-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-zinc-500"
                                />
                                <button
                                    type="submit"
                                    disabled={nomeLivre.trim() === ""}
                                    className="shrink-0 rounded-lg bg-white px-3 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-40"
                                >
                                    Adicionar
                                </button>
                            </div>
                        </label>
                    </form>
                </section>

                {/* DIREITA: a ficha (área de soltar) */}
                <section
                    onDragOver={(e) => e.preventDefault()} // obrigatório para permitir soltar aqui
                    onDragEnter={() => setSobre(true)}
                    onDragLeave={(e) => {
                        // só apaga o destaque se saiu da área toda (e não de um filho)
                        if (!e.currentTarget.contains(e.relatedTarget as Node)) setSobre(false);
                    }}
                    onDrop={aoSoltar}
                    className={`space-y-3 rounded-2xl border-2 border-dashed p-4 transition-colors ${
                        sobre ? "border-white bg-zinc-900" : "border-zinc-800"
                    }`}
                >
                    <h2 className="text-lg font-semibold">
                        Ficha{" "}
                        <span className="text-sm font-normal text-zinc-500">
              ({itens.length} {itens.length === 1 ? "exercício" : "exercícios"})
            </span>
                    </h2>

                    {itens.length === 0 ? (
                        <p className="py-10 text-center text-sm text-zinc-500">
                            Arraste os exercícios para cá (ou use o botão +).
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {itens.map((item, indice) => (
                                <ItemDaFicha
                                    key={item.uid}
                                    item={item}
                                    posicao={indice + 1}
                                    total={itens.length}
                                    onMudar={(campo, valor) => mudarCampo(item.uid, campo, valor)}
                                    onRemover={() => remover(item.uid)}
                                    onSubir={() => mover(indice, -1)}
                                    onDescer={() => mover(indice, 1)}
                                />
                            ))}
                        </ul>
                    )}

                    {mensagem && (
                        <p
                            role="status"
                            className={`text-sm ${mensagem.tipo === "ok" ? "text-green-400" : "text-red-400"}`}
                        >
                            {mensagem.texto}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={salvar}
                        disabled={salvando}
                        className="w-full rounded-full bg-white py-2.5 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-50"
                    >
                        {salvando ? "Salvando..." : "Salvar ficha"}
                    </button>
                </section>
            </div>
        </div>
    );
}