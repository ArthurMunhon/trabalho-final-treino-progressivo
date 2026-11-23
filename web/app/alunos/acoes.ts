"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { deletarAluno } from "./alunos";
import { aceitarSolicitacao, recusarSolicitacao } from "./solicitacoes";

export async function aceitar(id: string) {
    await aceitarSolicitacao(id);
    revalidatePath("/alunos");
}

export async function recusar(id: string) {
    await recusarSolicitacao(id);
    revalidatePath("/alunos");
}

export async function excluirAluno(id: string) {
    let deuCerto = true;
    try {
        await deletarAluno(id);
    } catch {
        deuCerto = false;
    }
    if (!deuCerto) redirect(`/alunos/${id}?erro=1`);
    revalidatePath("/alunos");
    redirect("/alunos");
}
