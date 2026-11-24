"use server";
// Server action do botão "Excluir ficha".

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { deletarFicha } from "./fichas";

export async function excluirFicha(fichaId: string, alunoId: string) {
    let deuCerto = true;
    try {
        await deletarFicha(fichaId);
    } catch {
        deuCerto = false; // ex.: ficha já tem treino registrado (o back-end recusa)
    }

    revalidatePath("/fichas");
    // redirect() fora do try/catch (ele funciona lançando uma exceção interna)
    redirect(deuCerto ? `/fichas?aluno=${alunoId}` : `/fichas?aluno=${alunoId}&erro=1`);
}