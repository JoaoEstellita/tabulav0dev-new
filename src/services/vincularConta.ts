import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { temMapaCompleto, deveFundir, type PerfilPendente } from './regrasDeFusao'

// reexportado: quem funde e quem decide moram em arquivos diferentes, e o
// chamador não precisa saber disso
export { temMapaCompleto, deveFundir }
export type { PerfilPendente }

/**
 * Fundir a conta anônima do quiz na conta definitiva.
 *
 * ── O PROBLEMA ─────────────────────────────────────────────────────────────
 *
 * O João perguntou: "não teria problema da pessoa abrir o app com a conta
 * criada, mas depois se for logar em outro lugar ter dificuldade de logar na
 * própria conta?". Teria, e é o modo de falhar mais provável do quiz.
 *
 * O quiz roda ANTES do login, senão não é funil — pedir Google antes de
 * entregar qualquer coisa é atrito na porta. Então ele grava numa conta
 * anônima do Firebase. Três desfechos:
 *
 * 1. A pessoa loga com Google no mesmo aparelho. `linkWithCredential` PROMOVE o
 *    mesmo uid a conta Google. Nada é movido, nada se funde, nada se perde,
 *    porque o identificador não muda. É o caso comum e não passa por aqui.
 *
 * 2. Aquele Google JÁ TEM conta. O Firebase lança
 *    `auth/credential-already-in-use` e o link falha. Sem tratamento, a pessoa
 *    fica com duas contas e o mapa na errada. É para isso que este módulo
 *    existe.
 *
 * 3. A pessoa loga em outro aparelho. A conta anônima ficou no navegador
 *    antigo, e nada aqui alcança — quem resolve é o token de claim, no mesmo
 *    formato do `/vincular?t=` do WhatsApp.
 *
 * ── A REGRA DE DESEMPATE ───────────────────────────────────────────────────
 *
 * Mapa completo nunca é sobrescrito. É a mesma regra do backend
 * (`claim-wa-onboarding.js`, `mergeIntoUser`, teste `alreadyComplete`), e ela
 * existe porque o acidente caro é a pessoa perder a carta que já tinha por
 * causa de um quiz respondido às pressas. Na dúvida, o antigo ganha.
 */

/** O que sobreviveu da conta anônima, ou `null` quando não havia mapa. */
export async function lerPerfilPendente(uid: string): Promise<PerfilPendente | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    if (!snap.exists()) return null
    const d = snap.data() as PerfilPendente
    return temMapaCompleto(d) ? d : null
  } catch {
    // leitura é best-effort: falhar aqui não pode impedir o login
    return null
  }
}

/**
 * Grava o pendente na conta definitiva, se ela ainda não tiver mapa.
 *
 * @returns `true` quando fundiu de fato.
 */
export async function fundirNaConta(
  uidDestino: string,
  pendente: PerfilPendente | null
): Promise<boolean> {
  if (!pendente) return false
  try {
    const ref = doc(db, 'users', uidDestino)
    const snap = await getDoc(ref)
    const destino = (snap.exists() ? snap.data() : null) as PerfilPendente | null

    if (!deveFundir(pendente, destino)) return false

    await setDoc(
      ref,
      {
        fullName: pendente.fullName ?? null,
        birthDate: pendente.birthDate ?? null,
        birthTime: pendente.birthTime ?? null,
        birthLocation: pendente.birthLocation ?? null,
        birthDataComplete: true,
        // de onde veio, para dar para auditar quando alguém reclamar de mapa
        // trocado — sem isso a investigação começa do zero
        fundidoDeQuiz: true,
        fundidoEm: new Date().toISOString(),
      },
      { merge: true }
    )
    return true
  } catch (erro) {
    console.warn('Falha ao fundir perfil do quiz:', erro)
    return false
  }
}
