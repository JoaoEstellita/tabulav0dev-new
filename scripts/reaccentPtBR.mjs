/**
 * Reacentua os catálogos curados pt-BR.
 *
 * POR QUE EXISTE
 * O corpus curado (`transitCatalogOverridesPtBR`, 724 entradas) foi escrito sem
 * acentos e vence o catálogo base por precedência correta. Num app pago de
 * astrologia em português, "pressao sobre comunicacoes" lê como máquina.
 *
 * COMO É SEGURO
 * 1. As regras NÃO reescrevem texto. Elas propõem candidatos sobre o vocabulário
 *    do corpus; a tabela resultante é revisada uma vez por humano e congelada em
 *    scripts/data/ptbrAccentMap.json. O rewrite consome só a tabela congelada.
 * 2. A troca acontece por SPAN do AST do TypeScript, nunca por regex de arquivo
 *    inteiro: as CHAVES contêm 'oposicao', 'venus', 'jupiter', e acentuar cego
 *    corromperia 724 chaves.
 * 3. Invariante que fecha a conta: para todo valor alterado,
 *    deaccent(novo) === deaccent(antigo). Prova que o passe só ADICIONOU
 *    diacrítico — nenhuma palavra trocada, nenhuma pontuação mexida.
 *
 * USO
 *   node scripts/reaccentPtBR.mjs                 # dry-run (padrão)
 *   node scripts/reaccentPtBR.mjs --propose       # gera o mapa candidato p/ revisão
 *   node scripts/reaccentPtBR.mjs --write         # aplica o mapa congelado
 *   node scripts/reaccentPtBR.mjs --sample=10     # diff de N entradas
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const raiz = path.resolve(__dirname, '..')

/** Allowlist fixa. Sem glob e sem caminho por CLI: isto roda pouquíssimas vezes. */
const ALVOS = [
  'src/data/transitCatalogOverridesPtBR.ts',
  'src/data/chironInHouseOverridesPtBR.ts',
  'src/data/chironAspectOverridesPtBR.ts',
  'src/data/natalPlanetInHouseOverridesPtBR.ts',
]

/** Corpus JÁ acentuado do próprio repo — a fonte do dicionário. Não invento lista. */
const FONTES_ACENTUADAS = [
  'src/data/planetInSignOverridesPtBR.ts',
  'src/data/signInHouseOverridesPtBR.ts',
  'src/data/signInMidheavenOverridesPtBR.ts',
  'src/data/natalPlanetAspectOverridesPtBR.ts',
  'src/data/natalRulerInHouseOverridesPtBR.ts',
  'src/data/lunarNodeHouseOverridesPtBR.ts',
  'src/data/lunarNodeSignOverridesPtBR.ts',
  'src/data/transitTitlesPtBR.ts',
  'src/data/transitAphorismsPtBR.ts',
  // O catalogo BASE: 2816 entradas, ~99% acentuadas, mesmo dominio e mesmo
  // vocabulario. E a maior fonte de verdade ortografica que o repo ja tem —
  // ficava parada porque o override sem acento vence por precedencia.
  'src/data/transitCatalogPtBR.ts',
]

const MAPA = path.join(__dirname, 'data', 'ptbrAccentMap.json')

// ─── normalização ──────────────────────────────────────────────────────────────

/** NFD + remove ç. É a base do invariante de segurança. */
function deaccent(v) {
  return String(v || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'C')
}

const ehPalavra = (w) => /^[A-Za-zÀ-ÿ]+$/.test(w)

// ─── camada 1: sufixos determinísticos (SÓ geram candidato) ────────────────────

/**
 * Cada regra é ancorada no fim da palavra.
 *
 * Regras DELIBERADAMENTE ausentes, porque colidem com formas verbais corretas
 * sem acento — o erro seria invisível e sairia para o cliente:
 *   -encia  → 'evidencia', 'influencia', 'gerencia' são 3ª pessoa do singular.
 *             "A fase evidencia tensões" tem que continuar sem acento.
 *   -ancia  → 'financia'.
 *   -aria   → 'beneficiaria' é o condicional de beneficiar, não 'beneficiária'.
 *   -oria   → 'diretoria', 'categoria', 'maioria' não levam acento nenhum.
 *   -ico    → 'eu pratico', 'eu critico', 'eu publico'.
 */
const REGRAS_SUFIXO = [
  // -ção é a regra. A UNICA excecao e depois de "l" (balcão, falcão); depois de
  // "r" a cedilha continua (proporção, porção, torção) e depois de "n" tambem
  // (conjunção, função).
  { re: /(?<!l)cao$/, para: 'ção' },
  { re: /(?<!l)coes$/, para: 'ções' },
  { re: /avel$/, para: 'ável' },
  { re: /ivel$/, para: 'ível' },
  { re: /aveis$/, para: 'áveis' },
  { re: /iveis$/, para: 'íveis' },
  { re: /orio$/, para: 'ório' },
  { re: /orios$/, para: 'órios' },
  { re: /ario$/, para: 'ário' },
  { re: /arios$/, para: 'ários' },
  // Genericas, DEPOIS das de cedilha: em portugues nao existe palavra terminada
  // em "-ao"/"-oes" atono sem til (a unica excecao e a preposicao "ao", que esta
  // em AMBIGUAS). Cobre -sao, -xao, -tao, -gao e os futuros do indicativo
  // ("conseguirao" -> "conseguirao" -> "conseguirão") de uma vez so.
  { re: /oes$/, para: 'ões' },
  { re: /ao$/, para: 'ão' },
]

function candidatoPorSufixo(palavra) {
  const w = palavra.toLowerCase()
  // Advérbio em -mente perde o acento do adjetivo: agradável → agradavelmente.
  if (w.endsWith('mente')) return null
  for (const { re, para } of REGRAS_SUFIXO) {
    if (re.test(w)) return w.replace(re, para)
  }
  return null
}

// ─── camada 2: dicionário extraído do corpus já acentuado ──────────────────────

function valoresDoArquivo(rel) {
  const abs = path.join(raiz, rel)
  if (!fs.existsSync(abs)) return []
  const src = fs.readFileSync(abs, 'utf8')
  const sf = ts.createSourceFile(abs, src, ts.ScriptTarget.Latest, true)
  const out = []
  const visit = (node) => {
    if (
      ts.isStringLiteral(node)
      && node.parent
      && ts.isPropertyAssignment(node.parent)
      && node.parent.initializer === node
    ) {
      out.push({ text: node.text, start: node.getStart(sf), end: node.getEnd() })
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return out
}

function lexicoAcentuado() {
  const porForma = new Map() // deaccent(minúsculo) -> Set(formas vistas)
  for (const rel of FONTES_ACENTUADAS) {
    for (const { text } of valoresDoArquivo(rel)) {
      // Descarta o verbo com pronome enclitico ANTES de tokenizar: em
      // "ampliá-la" o acento pertence a enclise, e aprender "amplia" -> "ampliá"
      // faria o script acentuar o verbo solto ("amplia possibilidades"), que
      // esta correto sem acento.
      const limpo = text.replace(/[A-Za-zÀ-ÿ]+-l[oa]s?/g, ' ')
      for (const w of limpo.split(/[^A-Za-zÀ-ÿ]+/)) {
        if (!w || !ehPalavra(w)) continue
        const chave = deaccent(w).toLowerCase()
        if (!porForma.has(chave)) porForma.set(chave, new Set())
        porForma.get(chave).add(w.toLowerCase())
      }
    }
  }
  return porForma
}

/**
 * Palavras que existem nos DOIS estados em português e só o contexto resolve.
 * Ficam fora do mapa de propósito — um "à" errado é erro de português visível
 * num produto pago, pior do que a falta do acento.
 */
const AMBIGUAS = new Set([
  'e', 'a', 'as', 'o', 'os', 'esta', 'estas', 'este', 'tem', 'por', 'para',
  'pode', 'sera', 'so', 'ate', 'mais', 'em', 'de', 'da', 'do', 'que', 'se',
  'na', 'no', 'ao', 'com', 'sem', 'entre', 'onde', 'forma', 'momento',
])

/**
 * Decisões tomadas à mão depois de LER todas as ocorrências de cada uma no
 * corpus. Entram aqui as que nenhuma regra e nenhum léxico resolveu, e cuja
 * leitura eu confirmei ser sempre a mesma neste corpus.
 *
 * Ficam DE FORA, apesar de parecerem óbvias:
 *   negligencia — aqui é verbo ("enquanto negligencia os próprios")
 *   pratica, influencia, seria, vem, este — as duas leituras convivem
 *   ideia/ideias — sem acento na ortografia vigente
 */
/**
 * Fora do mapa por decisao explicita, mesmo que alguma camada as proponha.
 * Todas sao VERBO neste corpus ("amplia possibilidades", "suporta com
 * seguranca") e estao corretas sem acento.
 */
/**
 * Trechos preservados literalmente. Sao os casos em que a palavra tem as duas
 * leituras no corpus e a maioria pede acento: mapeia-se a palavra e protege-se
 * a excecao, em vez de abrir mao das 21 ocorrencias certas por causa de 1.
 *   "se pratica" — unico uso VERBAL de "pratica" no corpus inteiro
 *   ("espiritualidade tambem se pratica lavando a louca"); as outras 21 sao o
 *   substantivo/adjetivo "prática".
 */
const PROTEGIDAS = ['se pratica']

const BLOQUEADAS = new Set(['amplia', 'canaliza', 'processa', 'suporta', 'incomoda', 'faze', 'mante', 'estaavel'])

const MANUAIS = {
  transito: 'trânsito', // 100% precedido de artigo: "o transito de poucos dias"
  trigono: 'trígono',
  medio: 'médio',
  magico: 'mágico', // "pensamento magico"
  artistico: 'artístico',
  mantem: 'mantém',
  reinicio: 'reinício', // "ponto de reinicio emocional"
  evidencia: 'evidência', // as 4 ocorrências sao substantivo ("em evidencia")
  experiencia: 'experiência', // "a camada mais simbolica da experiencia"
  // cedilha
  forca: 'força', // as duas leituras (verbo e substantivo) levam cedilha
  reforca: 'reforça',
  forcar: 'forçar',
  forcada: 'forçada',
  forcadas: 'forçadas',
  forcando: 'forçando',
  // -ência / -ância que só existem como substantivo (nao ha verbo homografo)
  coerencia: 'coerência',
  exigencia: 'exigência',
  pendencias: 'pendências',
  revisoes: 'revisões',
  carencia: 'carência',
  complacencia: 'complacência',
  confluencia: 'confluência',
  contingencia: 'contingência',
  convergencia: 'convergência',
  divergencia: 'divergência',
  equivalencia: 'equivalência',
  interdependencia: 'interdependência',
  dependencias: 'dependências',
  autoconsciencia: 'autoconsciência',
  elegancia: 'elegância',
  prudencia: 'prudência',
  relevancia: 'relevância',
  ressonancia: 'ressonância',
  resistencias: 'resistências',
  referencias: 'referências',
  desperdicio: 'desperdício',
  danca: 'dança',
  autenticos: 'autênticos',
  // Proparoxitonas em -ico/-ica que nem o lexico nem a derivacao alcancaram
  // (nenhuma das 4 formas aparecia no corpus acentuado). Ficam de FORA os
  // homografos verbais da mesma terminacao: intensifica, amplifica, fica,
  // indica, aplica, implica, justifica, significa, rica(s), pico.
  tatica: 'tática',
  automatica: 'automática',
  automaticas: 'automáticas',
  performatico: 'performático',
  diagnostico: 'diagnóstico',
  terapeutica: 'terapêutica',
  sistemicos: 'sistêmicos',
  metricas: 'métricas',
  mecanicas: 'mecânicas',
  harmonicas: 'harmônicas',
  energetico: 'energético',
  drasticas: 'drásticas',
  cronica: 'crônica',
  cientificas: 'científicas',
  ciclica: 'cíclica',
  caotica: 'caótica',
  // Particípio dos verbos em -uir: o "u" fica em hiato e leva acento. NAO da
  // para virar regra — "fluido", "cuidado" e "ingenuidade" tem a mesma sequencia
  // de letras e sao corretos SEM acento.
  concluido: 'concluído',
  construida: 'construída',
  construidas: 'construídas',
  construido: 'construído',
  construidos: 'construídos',
  reconstruido: 'reconstruído',
  distribuido: 'distribuído',
  destruido: 'destruído',
  diluida: 'diluída',
  excluidos: 'excluídos',
  atribuido: 'atribuído',
  incluido: 'incluído',
  substituido: 'substituído',
}

/**
 * Ênclise: o verbo ganha acento ao receber -lo/-la ("realizar" + "a" =
 * "realizá-la"). O mapa é por palavra e o hífen separa os tokens, entao esses
 * casos passariam batido. São 6 no corpus inteiro, todos de verbo em -ar.
 */
const ENCLISES = {
  'concretiza-lo': 'concretizá-lo',
  'entrega-lo': 'entregá-lo',
  'implementa-los': 'implementá-los',
  'questiona-la': 'questioná-la',
  'realiza-la': 'realizá-la',
  'sustenta-lo': 'sustentá-lo',
}

// ─── proposta do mapa ──────────────────────────────────────────────────────────

function propor() {
  const lexico = lexicoAcentuado()
  const tipos = new Map() // palavra sem acento -> ocorrências

  for (const rel of ALVOS) {
    for (const { text } of valoresDoArquivo(rel)) {
      for (const w of text.split(/[^A-Za-zÀ-ÿ]+/)) {
        if (!w || !ehPalavra(w)) continue
        const baixa = w.toLowerCase()
        // já acentuada, nada a fazer
        if (deaccent(baixa) !== baixa) continue
        tipos.set(baixa, (tipos.get(baixa) || 0) + 1)
      }
    }
  }

  const mapa = {}
  const ambiguas = []
  const desconhecidas = []

  for (const [palavra, n] of [...tipos].sort((a, b) => b[1] - a[1])) {
    // Decisao humana vence regra e lexico.
    if (BLOQUEADAS.has(palavra)) { ambiguas.push([palavra, n]); continue }
    if (MANUAIS[palavra]) { mapa[palavra] = MANUAIS[palavra]; continue }
    if (AMBIGUAS.has(palavra)) { ambiguas.push([palavra, n]); continue }

    const doLexico = lexico.get(palavra)
    if (doLexico) {
      const formas = [...doLexico]
      const acentuadas = formas.filter((f) => deaccent(f) !== f)
      // A forma SEM acento também aparece no corpus correto → ambígua de verdade.
      if (acentuadas.length === 1 && formas.length === 1) {
        mapa[palavra] = acentuadas[0]
        continue
      }
      if (acentuadas.length >= 1 && formas.includes(palavra)) {
        ambiguas.push([palavra, n]); continue
      }
      if (acentuadas.length === 1) { mapa[palavra] = acentuadas[0]; continue }
      if (acentuadas.length > 1) { ambiguas.push([palavra, n]); continue }
    }

    const porSufixo = candidatoPorSufixo(palavra)
    if (porSufixo && porSufixo !== palavra) { mapa[palavra] = porSufixo; continue }

    desconhecidas.push([palavra, n])
  }

  // Deriva variantes de genero/numero: se o lexico ensinou "academicos" ->
  // "acadêmicos", entao "academica" -> "acadêmica" segue pelo mesmo padrao. O
  // lexico e esparso e quase sempre traz so uma das quatro formas.
  // Respeita AMBIGUAS/BLOQUEADAS: "pratico"->"prático" NAO gera "pratica",
  // porque "pratica" tambem e verbo.
  // Numero (o<->os, a<->as) e sempre seguro. Troca de GENERO so em -ico/-ica,
  // que sao adjetivos: fora dai ela cria verbo a partir de substantivo —
  // "inicio"->"início" geraria "inicia"->"inícia", e "inicia" e verbo.
  const NUMERO = [['o', 'os'], ['os', 'o'], ['a', 'as'], ['as', 'a']]
  const GENERO = [['o', 'a'], ['a', 'o'], ['os', 'as'], ['as', 'os']]
  const ehAdjetivoIco = (w) => /(ico|ica|icos|icas)$/.test(w)
  let derivadas = 0
  // Dois passes: o lexico costuma trazer so uma das quatro formas, e a segunda
  // volta alcanca as de segunda ordem (academicos -> academico -> academica).
  for (let passe = 0; passe < 2; passe++)
  for (const [plano, acentuado] of Object.entries({ ...mapa })) {
    const regras = ehAdjetivoIco(plano) ? [...NUMERO, ...GENERO] : NUMERO
    for (const [de, para] of regras) {
      if (!plano.endsWith(de) || !acentuado.endsWith(de)) continue
      const variantePlana = plano.slice(0, -de.length) + para
      if (mapa[variantePlana] || AMBIGUAS.has(variantePlana) || BLOQUEADAS.has(variantePlana)) continue
      if (!tipos.has(variantePlana)) continue // so o que existe no corpus
      mapa[variantePlana] = acentuado.slice(0, -de.length) + para
      derivadas++
    }
  }

  return { mapa, ambiguas, desconhecidas, totalTipos: tipos.size, derivadas }
}

// ─── aplicação ─────────────────────────────────────────────────────────────────

const MASCARA = (i) => ` P${i} `

function aplicarNoTexto(texto, mapa) {
  let base = texto
  // Com fronteira de palavra: sem ela, "se pratica" casaria dentro de
  // "ba|se pratica" e protegeria justamente o que deveria ser acentuado.
  PROTEGIDAS.forEach((frase, i) => {
    base = base.replace(new RegExp(`\\b${frase}\\b`, 'g'), MASCARA(i))
  })
  for (const [de, para] of Object.entries(ENCLISES)) base = base.split(de).join(para)
  const mapeado = base.replace(/[A-Za-zÀ-ÿ]+/g, (w) => {
    const alvo = mapa[w.toLowerCase()]
    if (!alvo) return w
    // preserva a caixa original
    if (w[0] === w[0].toUpperCase() && w.slice(1) === w.slice(1).toLowerCase()) {
      return alvo[0].toUpperCase() + alvo.slice(1)
    }
    if (w === w.toUpperCase() && w.length > 1) return alvo.toUpperCase()
    return alvo
  })
  return desmascarar(mapeado)
}

  // fecha aplicarNoTexto devolvendo o texto ja desmascarado
function desmascarar(texto) {
  let out = texto
  PROTEGIDAS.forEach((frase, i) => { out = out.split(MASCARA(i)).join(frase) })
  return out
}

function aplicarNoArquivo(rel, mapa, { write, sample }) {
  const abs = path.join(raiz, rel)
  const original = fs.readFileSync(abs, 'utf8')
  const spans = valoresDoArquivo(rel)
  let saida = original
  let alterados = 0
  const amostras = []

  // de trás para a frente: assim os offsets anteriores continuam válidos
  for (let i = spans.length - 1; i >= 0; i--) {
    const { text, start, end } = spans[i]
    const novo = aplicarNoTexto(text, mapa)
    if (novo === text) continue

    // INVARIANTE: só pode ter ganhado diacrítico.
    if (deaccent(novo) !== deaccent(text)) {
      throw new Error(
        `INVARIANTE VIOLADA em ${rel} offset ${start}\n  antes: ${text}\n  depois: ${novo}`,
      )
    }

    const literalOriginal = original.slice(start, end)
    const aspas = literalOriginal[0]
    const literalNovo = aspas + novo.split(aspas).join('\\' + aspas) + aspas
    saida = saida.slice(0, start) + literalNovo + saida.slice(end)
    alterados++
    if (amostras.length < sample) amostras.push({ antes: text, depois: novo })
  }

  if (write && alterados) fs.writeFileSync(abs, saida, 'utf8')
  return { rel, alterados, total: spans.length, amostras, saida, original }
}

// ─── CLI ───────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const flag = (n) => args.some((a) => a === `--${n}` || a.startsWith(`--${n}=`))
const valor = (n, d) => {
  const a = args.find((x) => x.startsWith(`--${n}=`))
  return a ? a.split('=')[1] : d
}

if (flag('propose')) {
  const { mapa, ambiguas, desconhecidas, totalTipos, derivadas } = propor()
  fs.mkdirSync(path.dirname(MAPA), { recursive: true })
  fs.writeFileSync(MAPA, JSON.stringify(mapa, null, 2) + '\n', 'utf8')
  console.log(`tipos sem acento no corpus: ${totalTipos}`)
  console.log(`mapa proposto: ${Object.keys(mapa).length} palavras (${derivadas} derivadas por genero/numero) -> ${MAPA}`)
  console.log(`\nAMBIGUAS (fora do mapa de proposito): ${ambiguas.length}`)
  console.log(ambiguas.slice(0, 25).map(([w, n]) => `  ${w} (${n})`).join('\n'))
  console.log(`\nNAO RECONHECIDAS (revisar a mao): ${desconhecidas.length}`)
  const dir = path.dirname(MAPA)
  fs.writeFileSync(path.join(dir, '_revisar-desconhecidas.txt'),
    desconhecidas.map(([w, n]) => `${n}\t${w}`).join('\n') + '\n', 'utf8')
  fs.writeFileSync(path.join(dir, '_revisar-ambiguas.txt'),
    ambiguas.map(([w, n]) => `${n}\t${w}`).join('\n') + '\n', 'utf8')
  console.log(`  -> ${path.join(dir, '_revisar-desconhecidas.txt')}`)
  process.exit(0)
}

if (!fs.existsSync(MAPA)) {
  console.error(`Mapa nao encontrado: ${MAPA}\nRode antes: node scripts/reaccentPtBR.mjs --propose`)
  process.exit(1)
}

const mapa = JSON.parse(fs.readFileSync(MAPA, 'utf8'))
const write = flag('write')
const sample = Number(valor('sample', 0))

console.log(write ? '=== APLICANDO ===' : '=== DRY-RUN (use --write para gravar) ===')
let totalAlterados = 0
for (const rel of ALVOS) {
  const r = aplicarNoArquivo(rel, mapa, { write, sample })
  totalAlterados += r.alterados
  console.log(`${r.rel}: ${r.alterados}/${r.total} valores`)
  for (const a of r.amostras) {
    console.log(`   - ${a.antes.slice(0, 90)}`)
    console.log(`   + ${a.depois.slice(0, 90)}`)
  }
}
console.log(`\ntotal de valores alterados: ${totalAlterados}`)

if (write) {
  // Idempotência: rodar de novo tem que dar zero. Pega regras que brigam entre si.
  let resto = 0
  for (const rel of ALVOS) resto += aplicarNoArquivo(rel, mapa, { write: false, sample: 0 }).alterados
  console.log(resto === 0 ? 'idempotente: 2o passe = 0 mudancas' : `FALHA DE IDEMPOTENCIA: ${resto}`)
  if (resto !== 0) process.exit(1)
}
