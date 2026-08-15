import { describe, expect, it } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { lerLiterais } from '../catalogo.mjs'
import {
  opcoesDoDia, bancoDeAssuntos, acharOpcao, idDoAssunto, formatosDoAssunto,
} from '../pautas.mjs'
import { falaComQuemLe } from '../educativo.mjs'

const FRONTEND = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')

const [ps, an, orbes, nn] = await Promise.all([
  lerLiterais(path.join(FRONTEND, 'src/data/planetInSignOverridesPtBR.ts'), [
    'PLANET_IN_SIGN_PTBR_OVERRIDES',
  ]),
  lerLiterais(path.join(FRONTEND, 'src/data/natalPlanetAspectOverridesPtBR.ts'), [
    'NATAL_PLANET_ASPECT_PTBR_OVERRIDES',
  ]),
  lerLiterais(path.join(FRONTEND, 'src/astro/aspect-config.ts'), ['PLANET_ASPECT_ORBS']),
  lerLiterais(path.join(FRONTEND, 'src/data/lunarNodeSignOverridesPtBR.ts'), [
    'LUNAR_NODE_SIGN_PTBR_OVERRIDES',
  ]),
])

const DEPS = {
  catalogos: {
    planetaNoSigno: ps.PLANET_IN_SIGN_PTBR_OVERRIDES,
    aspectoNatal: an.NATAL_PLANET_ASPECT_PTBR_OVERRIDES,
    noduloPorSigno: nn.LUNAR_NODE_SIGN_PTBR_OVERRIDES,
  },
  orbes: orbes.PLANET_ASPECT_ORBS,
}

const meioDia = (d) => new Date(`${d}T12:00:00Z`)

/**
 * A editorial nasceu listando o mesmo evento repetido por ângulo de publicação —
 * "Mercúrio entra em Leão" na véspera e no dia, "Eclipse solar" quatro vezes — e
 * o João disse o que era: aquilo não são opções, é a mesma coisa várias vezes.
 */
describe('opções de um dia', () => {
  /**
   * A agenda passou a ter SÓ o que acontece no dia.
   *
   * Antes trazia tudo, e "Marte em Câncer" — que vale seis semanas — aparecia
   * em 21 dias seguidos: 96 linhas para 27 assuntos distintos. O resto foi para
   * `bancoDeAssuntos`, e a agenda ficou legitimamente curta ou vazia.
   */
  /**
   * A regra é DATA, não natureza.
   *
   * O teste exigia `natureza === 'evento'` para tudo na agenda, e isso confundia
   * duas coisas. A agenda existe para separar o que acontece num dia do que vale
   * semanas — o critério é ter data. A natureza é outra coisa: diz se a peça
   * anuncia um acontecimento ou explica um conceito, e o João foi explícito de
   * que a lua fora de curso é EDUCATIVA mesmo tendo hora marcada.
   *
   * O que continua proibido é o que não tem data nenhuma: educativo de posição,
   * conceito e recurso vivem no banco.
   */
  it('a agenda só traz o que tem data', () => {
    for (const dia of ['2026-08-08', '2026-08-12', '2026-08-15', '2026-08-30']) {
      for (const o of opcoesDoDia(meioDia(dia), DEPS)) {
        expect(['educativo', 'conceito', 'recurso'], `${dia} ${o.titulo}`)
          .not.toContain(o.tipo)
        expect(o.angulo, `${dia} ${o.titulo}`).toMatch(/Acontece hoje/)
      }
    }
  })

  it('a mesma posição não aparece em dias seguidos', () => {
    const vistos = {}
    for (let i = 0; i < 21; i++) {
      const d = new Date(Date.UTC(2026, 7, 13 + i, 12))
      for (const o of opcoesDoDia(d, DEPS)) {
        // véspera e dia do mesmo evento são o mesmo id, e isso é deliberado;
        // o que não pode é a posição vigente voltando todo dia
        vistos[o.id] = (vistos[o.id] || 0) + 1
      }
    }
    for (const [id, n] of Object.entries(vistos)) {
      expect(n, `${id} apareceu ${n} vezes em 21 dias`).toBeLessThanOrEqual(4)
    }
  })

  it('os títulos não se repetem dentro do mesmo dia', () => {
    for (const dia of ['2026-08-08', '2026-08-12', '2026-08-15']) {
      const ops = opcoesDoDia(meioDia(dia), DEPS)
      const titulos = ops.map((o) => o.titulo)
      expect(new Set(titulos).size, `${dia}: ${titulos.join(' | ')}`).toBe(titulos.length)
    }
  })

  it('os ids não se repetem dentro do mesmo dia', () => {
    for (const dia of ['2026-08-08', '2026-08-12', '2026-08-15']) {
      const ids = opcoesDoDia(meioDia(dia), DEPS).map((o) => o.id)
      expect(new Set(ids).size, dia).toBe(ids.length)
    }
  })

  // A pauta guarda o id e o gerador o procura no dia seguinte. Id instável
  // significa escolha do João sumindo sem aviso.
  it('o id é estável entre duas chamadas', () => {
    const d = meioDia('2026-08-12')
    const a = opcoesDoDia(d, DEPS).map((o) => o.id)
    const b = opcoesDoDia(d, DEPS).map((o) => o.id)
    expect(a).toEqual(b)
  })

  it('o banco oferece educativos distintos, e mais que a agenda oferecia', () => {
    const banco = bancoDeAssuntos(meioDia('2026-08-15'), DEPS)
    const educativos = banco.filter((o) => o.tipo === 'educativo')
    expect(educativos.length).toBeGreaterThanOrEqual(2)
    expect(new Set(educativos.map((o) => o.titulo)).size).toBe(educativos.length)
  })

  it('o banco traz conceitos e recursos, que nunca chegavam à editorial', () => {
    const banco = bancoDeAssuntos(meioDia('2026-08-15'), DEPS)
    expect(banco.some((o) => o.tipo === 'conceito')).toBe(true)
    expect(banco.some((o) => o.tipo === 'recurso')).toBe(true)
    // a lua fora de curso entra como condicional: usa a do dia em que sair
    const lua = banco.find((o) => o.id === 'luaVazia')
    expect(lua.condicional).toBe(true)
    expect(lua.formatos).toEqual(['story'])
  })

  it('nenhum id se repete dentro do banco', () => {
    const ids = bancoDeAssuntos(meioDia('2026-08-15'), DEPS).map((o) => o.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  /**
   * O ASPECTO VOLTOU, E SÓ NO DIA EM QUE FECHA.
   *
   * Ele era excluído em bloco, e o motivo estava certo: dentro do orbe ele fica
   * por semanas, então Plutão sextil Netuno sairia seis vezes num mês. O que
   * resolve não é excluir, é exigir o instante — o aspecto perfaz uma vez.
   *
   * Este teste guarda a propriedade que importa: o mesmo par não aparece em dois
   * dias. Se a regra voltar a ser "está dentro do orbe", ele quebra.
   */
  it('o aspecto só aparece no dia em que fecha exato', () => {
    const diasDoPar = {}
    for (let i = 0; i < 21; i++) {
      const d = new Date(Date.UTC(2026, 7, 13 + i, 12))
      for (const o of opcoesDoDia(d, DEPS)) {
        if (o.tipo !== 'aspecto') continue
        diasDoPar[o.id] = (diasDoPar[o.id] || 0) + 1
      }
    }
    for (const [par, vezes] of Object.entries(diasDoPar)) {
      expect(vezes, `${par} apareceu ${vezes}x em 21 dias`).toBe(1)
    }
  })

  /** Aspecto entre dois lentos descreve uma geração, não um dia. */
  it('e sempre com um corpo pessoal no par', () => {
    const PESSOAIS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars']
    for (let i = 0; i < 21; i++) {
      const d = new Date(Date.UTC(2026, 7, 13 + i, 12))
      for (const o of opcoesDoDia(d, DEPS)) {
        if (o.tipo !== 'aspecto') continue
        const a = o.evento.aspecto
        expect(
          PESSOAIS.includes(a.agente) || PESSOAIS.includes(a.alvo),
          `${a.agente} ${a.aspecto} ${a.alvo}`
        ).toBe(true)
      }
    }
  })

  /**
   * O que o assunto comporta, e nada além.
   *
   * Devolvia `['reel']` para tudo, da fase do vídeo diário. Como o Estúdio monta
   * as caixinhas a partir deste array, o João abriu a editorial e viu uma opção
   * só — e era o formato que tinha saído da produção: "no editorial não tem mais
   * os carrosséis?".
   *
   * O vídeo não aparece porque saiu do automático enquanto o template é refeito.
   */
  it('nenhum assunto oferece vídeo enquanto ele está fora do automático', () => {
    for (const o of opcoesDoDia(meioDia('2026-08-12'), DEPS)) {
      expect(o.formatos, o.titulo).not.toContain('reel')
      expect(o.formatos.length, o.titulo).toBeGreaterThan(0)
    }
  })

  it('só o eclipse comporta carrossel', () => {
    expect(formatosDoAssunto({ tipo: 'eclipse' })).toEqual(['post', 'carrossel', 'story'])
    expect(formatosDoAssunto({ tipo: 'fase' })).toEqual(['post', 'story'])
    expect(formatosDoAssunto({ tipo: 'ingresso', corpo: 'Mars' })).toEqual(['post', 'story'])

    // treze slides sobre a Lua fora de curso seria carrossel por carrossel
    expect(formatosDoAssunto({ tipo: 'educativo' })).toEqual(['post'])
    // "quando for lua fora de curso tem que ser educativo, mas pode ser em
    // formato de Storie": dura horas, e o story dura vinte e quatro
    expect(formatosDoAssunto({ tipo: 'lua_fora_de_curso' })).toEqual(['story'])
    // Plutão muda de signo uma vez por geração, e ninguém reconhece o nome
    expect(formatosDoAssunto({ tipo: 'ingresso', corpo: 'Pluto' })).toEqual(['post'])
  })

  it('acharOpcao devolve null quando o id não existe mais', () => {
    const ops = opcoesDoDia(meioDia('2026-08-12'), DEPS)
    expect(acharOpcao(ops, 'educativo:natal:inexistente')).toBeNull()
    expect(acharOpcao(ops, '')).toBeNull()
    expect(acharOpcao(ops, ops[0].id)).toBe(ops[0])
  })

  it('o id carrega o tipo, para ser legível no JSON da pauta', () => {
    expect(idDoAssunto({ tipo: 'ingresso', corpo: 'Venus', signo: 'Libra' }))
      .toBe('ingresso:Venus:Libra')
    expect(idDoAssunto({ tipo: 'educativo', chave: 'natal:venus_in_libra' }))
      .toBe('educativo:natal:venus_in_libra')
  })
})

/**
 * O defeito que passou despercebido por um dia inteiro em producao.
 *
 * A regra "sem segunda pessoa" sempre existiu, e a verificacao que a sustentava
 * estava quebrada: `\bvocê\b` NUNCA casa em JavaScript, porque `\b` so reconhece
 * `[A-Za-z0-9_]` como caractere de palavra e `ê` nao e um deles. A auditoria
 * dava zero e o card publicava "quando você lidera" com naturalidade.
 */
describe('segunda pessoa', () => {
  it('o regex pega o que o \b nao pegava', () => {
    expect(falaComQuemLe('quando você lidera sem precisar')).toBe(true)
    expect(falaComQuemLe('a necessidade de reconhecimento')).toBe(false)
    expect(falaComQuemLe('Sua determinacao permite agir')).toBe(true)
    expect(falaComQuemLe('o seu mapa')).toBe(true)
    // nao pode pegar palavra que apenas CONTEM o pronome
    expect(falaComQuemLe('a seiva sobe pela raiz')).toBe(false)
    expect(falaComQuemLe('suave e constante')).toBe(false)
  })

  it('nenhum assunto oferecido fala com quem le', () => {
    for (const dia of ['2026-08-08', '2026-08-15', '2026-11-01', '2026-11-15']) {
      for (const o of opcoesDoDia(meioDia(dia), DEPS)) {
        const texto = o.evento?.texto || ''
        expect(falaComQuemLe(texto), `${dia} — ${o.titulo}`).toBe(false)
      }
    }
  })
})

/**
 * Estados e posicoes que rodam num ritmo diferente do ceu de eventos. Sem eles
 * o pool repetia: planeta-em-signo fica disponivel o mes inteiro.
 */
describe('assuntos de ritmo proprio', () => {
  it('retrogradacao em curso vira assunto, com data de fim', () => {
    const ops = bancoDeAssuntos(meioDia('2026-11-01'), DEPS)
    const retro = ops.filter((o) => o.tipo === 'retrogradacao')
    expect(retro.length).toBeGreaterThan(0)
    for (const r of retro) {
      // o banco não carrega o objeto do evento: ele vai para o Storage como
      // JSON, e o que importa na tela é a linha com o prazo
      expect(r.angulo, r.titulo).toMatch(/faltam \d+ dias/)
    }
  })

  // Urano, Netuno e Plutao passam ~5 meses por ano retrogrados: como assunto
  // diario virariam ruido permanente, igual ao aspecto entre dois lentos.
  it('so Mercurio, Venus e Marte contam como retrogrado', () => {
    for (const dia of ['2026-08-07', '2026-11-01']) {
      for (const o of opcoesDoDia(meioDia(dia), DEPS)) {
        if (o.tipo !== 'retrogradacao') continue
        expect(['Mercury', 'Venus', 'Mars'], o.titulo).toContain(o.evento.corpo)
      }
    }
  })

  it('grau critico so em 0 e 29', () => {
    for (const dia of ['2026-08-07', '2026-09-01', '2026-10-01']) {
      for (const o of opcoesDoDia(meioDia(dia), DEPS)) {
        if (o.tipo !== 'grau_critico') continue
        expect([0, 29], o.titulo).toContain(o.evento.grau)
      }
    }
  })

  // `SearchMoonNode` devolve ora o ascendente ora o descendente, e sem olhar o
  // `kind` o signo parecia pular de Leao para Aquario sem nada ter se movido.
  it('o eixo dos nodulos e consistente entre datas proximas', () => {
    const a = opcoesDoDia(meioDia('2026-11-01'), DEPS).find((o) => o.tipo === 'nodulos')
    const b = opcoesDoDia(meioDia('2026-11-08'), DEPS).find((o) => o.tipo === 'nodulos')
    if (!a || !b) return // signo sem texto utilizavel
    expect(a.evento.norte.signo).toBe(b.evento.norte.signo)
  })

  it('o Norte e sempre oposto ao Sul', () => {
    const n = opcoesDoDia(meioDia('2026-11-01'), DEPS).find((o) => o.tipo === 'nodulos')
    if (!n) return
    const SIG = ['Áries','Touro','Gêmeos','Câncer','Leão','Virgem','Libra','Escorpião','Sagitário','Capricórnio','Aquário','Peixes']
    const iN = SIG.indexOf(n.evento.norte.signo)
    const iS = SIG.indexOf(n.evento.sul.signo)
    expect((iN + 6) % 12).toBe(iS)
  })
})

/**
 * "Preciso saber se nesse dia o planeta vai entrar no signo, ou se é só um post
 * explicativo, com pormenores para eu saber qual escolher."
 *
 * O João viu três linhas iguais — "Vênus em Libra", "Marte em Câncer", "Júpiter
 * em Leão", todas com "O que significa num mapa natal" — e não tinha como
 * escolher. Eram as três explicativas.
 */
describe('a editorial diz o que cada assunto é', () => {
  const doDia = (dia) => opcoesDoDia(meioDia(dia), DEPS)

  it('separa o que acontece no dia do que é explicação', () => {
    for (const o of doDia('2026-08-23')) {
      expect(o.natureza, o.titulo).toBe('evento')
    }
    const ingresso = doDia('2026-08-23').find((o) => o.tipo === 'ingresso')
    expect(ingresso.natureza).toBe('evento')

    // o educativo saiu da agenda e vive no banco
    expect(doDia('2026-08-23').some((o) => o.tipo === 'educativo')).toBe(false)
    const noBanco = bancoDeAssuntos(meioDia('2026-08-23'), DEPS)
      .find((o) => o.tipo === 'educativo')
    expect(noBanco.natureza).toBe('explicativo')
  })

  it('o ingresso de hoje traz a hora', () => {
    const hoje = doDia('2026-08-23').find((o) => o.tipo === 'ingresso' && o.evento.diasFalta === 0)
    expect(hoje.angulo).toMatch(/Acontece hoje às \d{2}h\d{2}/)
    expect(hoje.angulo).toContain('entra no signo')
  })

  /**
   * A lua fora de curso está nos DOIS lugares, e são conteúdos diferentes.
   *
   * No banco ela é o aviso condicional, que diz "quando houver" e usa a janela
   * do dia em que for sorteado. Na agenda ela é a linha do dia, com a janela
   * real, porque ela tem hora de começo e de fim como qualquer evento.
   *
   * O que ela NÃO é: natureza 'evento'. "Quando for lua fora de curso tem que
   * ser educativo, mas pode ser em formato de Storie."
   */
  it('a lua fora de curso é condicional no banco e datada na agenda', () => {
    const lua = bancoDeAssuntos(meioDia('2026-08-13'), DEPS).find((o) => o.id === 'luaVazia')
    expect(lua.angulo).toContain('Quando houver no dia')
    expect(lua.formatos).toEqual(['story'])

    const naAgenda = doDia('2026-08-13').find((o) => o.tipo === 'lua_fora_de_curso')
    expect(naAgenda, '13/08 tem lua fora de curso').toBeTruthy()
    expect(naAgenda.natureza).toBe('explicativo')
    expect(naAgenda.formatos).toEqual(['story'])
    // a janela real, com hora, e não a frase condicional do banco
    expect(naAgenda.angulo).toMatch(/das \d+h\d+.* às \d+h\d+/)
  })

  /** Dizer "sem data para acabar" de Marte em Câncer seria mentira. */
  it('o explicativo não promete posição eterna', () => {
    for (const o of doDia('2026-08-13').filter((x) => x.tipo === 'educativo')) {
      expect(o.angulo).toMatch(/^Explicativo/)
      expect(o.angulo).not.toMatch(/sem data para acabar/)
    }
  })

  it('nenhum assunto sai com o subtítulo genérico de antes', () => {
    for (const dia of ['2026-08-13', '2026-08-23']) {
      for (const o of doDia(dia)) {
        expect(o.angulo, `${dia} ${o.titulo}`).not.toBe('O que significa num mapa natal')
      }
    }
  })
})
