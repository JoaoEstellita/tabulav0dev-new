// Leitura do TRÂNSITO CHINÊS do ANO — relação do animal do ano com o natal.
// Lente = evolução de consciência (aprendizado ativo). es-ES sem tildes; it sem acentos.
import type { YearRelation } from '../../astro/chinese/chineseTransit'

type Lang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'
function L(l: string): Lang { return (l === 'en-US' || l === 'es-ES' || l === 'it-IT') ? l : 'pt-BR' }

const RELATION: Record<YearRelation, Record<Lang, string>> = {
  same: {
    'pt-BR': 'É o ano do SEU signo (Ben Ming Nian). Tradicionalmente pede cautela e renovação — virar a página, cuidar da saúde e não forçar. Ótimo pra recomeços conscientes.',
    'en-US': 'It is the year of YOUR sign (Ben Ming Nian). Traditionally it asks for caution and renewal — turn the page, tend to health, don\'t force. Great for conscious restarts.',
    'es-ES': 'Es el ano de TU signo (Ben Ming Nian). Tradicionalmente pide cautela y renovacion — pasar la pagina, cuidar la salud y no forzar. Optimo para recomienzos conscientes.',
    'it-IT': 'E l\'anno del TUO segno (Ben Ming Nian). Tradizionalmente chiede cautela e rinnovamento — voltare pagina, curare la salute e non forzare. Ottimo per ripartenze consapevoli.',
  },
  'secret-friend': {
    'pt-BR': 'O animal do ano é seu amigo secreto (Liu He) — ano de apoio, alianças e portas que se abrem com mais facilidade. Bom pra construir vínculos e fechar acordos.',
    'en-US': 'The year animal is your secret friend (Liu He) — a year of support, alliances and doors that open more easily. Good for building bonds and closing deals.',
    'es-ES': 'El animal del ano es tu amigo secreto (Liu He) — ano de apoyo, alianzas y puertas que se abren con mas facilidad. Bueno para vinculos y acuerdos.',
    'it-IT': 'L\'animale dell\'anno e il tuo amico segreto (Liu He) — anno di sostegno, alleanze e porte che si aprono piu facilmente. Buono per legami e accordi.',
  },
  ally: {
    'pt-BR': 'O ano forma trígono de aliados (San He) com você — harmonia, fluxo e sorte em projetos coletivos. A energia joga a favor; avance no que é colaborativo.',
    'en-US': 'The year forms an ally trine (San He) with you — harmony, flow and luck in collective projects. Energy is on your side; advance what is collaborative.',
    'es-ES': 'El ano forma trigono de aliados (San He) contigo — armonia, fluidez y suerte en proyectos colectivos. La energia juega a favor; avanza en lo colaborativo.',
    'it-IT': 'L\'anno forma un trigono di alleati (San He) con te — armonia, flusso e fortuna nei progetti collettivi. L\'energia gioca a favore; avanza nel collaborativo.',
  },
  clash: {
    'pt-BR': 'O animal do ano choca com o seu (Chong) — ano de movimento, mudança e imprevisto. Não é "ruim": é empurrão pra sair da zona de conforto. Evite decisões precipitadas e conflitos, e canalize a energia em mudança consciente.',
    'en-US': 'The year animal clashes with yours (Chong) — a year of movement, change and the unexpected. Not "bad": it is a push out of the comfort zone. Avoid rash decisions and conflict; channel the energy into conscious change.',
    'es-ES': 'El animal del ano choca con el tuyo (Chong) — ano de movimiento, cambio e imprevisto. No es "malo": es un empujon fuera de la zona de confort. Evita decisiones precipitadas y conflictos; canaliza la energia en cambio consciente.',
    'it-IT': 'L\'animale dell\'anno si scontra col tuo (Chong) — anno di movimento, cambiamento e imprevisto. Non e "male": e una spinta fuori dalla zona di comfort. Evita decisioni affrettate e conflitti; incanala l\'energia nel cambiamento consapevole.',
  },
  harm: {
    'pt-BR': 'O ano forma dano (Hai) com você — atritos sutis e mal-entendidos pedem paciência e clareza nos combinados. Cuide da saúde e das palavras; o que se alinha agora evita ruído depois.',
    'en-US': 'The year forms harm (Hai) with you — subtle friction and misunderstandings ask for patience and clear agreements. Tend to health and words; aligning now avoids noise later.',
    'es-ES': 'El ano forma dano (Hai) contigo — fricciones sutiles y malentendidos piden paciencia y claridad en los acuerdos. Cuida la salud y las palabras.',
    'it-IT': 'L\'anno forma danno (Hai) con te — attriti sottili e malintesi chiedono pazienza e chiarezza negli accordi. Cura la salute e le parole.',
  },
  neutral: {
    'pt-BR': 'Ano neutro em relação ao seu signo — sem reforço nem atrito marcado. O rumo depende mais das suas escolhas do que do ciclo do ano.',
    'en-US': 'A neutral year for your sign — neither boosted nor strained. The direction depends more on your choices than on the year\'s cycle.',
    'es-ES': 'Ano neutral para tu signo — sin refuerzo ni tension marcada. El rumbo depende mas de tus decisiones que del ciclo del ano.',
    'it-IT': 'Anno neutro per il tuo segno — ne rafforzato ne teso. La direzione dipende piu dalle tue scelte che dal ciclo dell\'anno.',
  },
}

export function yearRelationReading(relation: YearRelation, lang: string): string {
  return RELATION[relation]?.[L(lang)] || RELATION.neutral[L(lang)]
}

// ── Compatibilidade de animais na SINASTRIA (2 pessoas) ──────────────────────
const COMPAT: Record<YearRelation, Record<Lang, string>> = {
  same: {
    'pt-BR': 'Mesmo animal — profunda identificação: se entendem no instinto. Cuidado só pra não competir pelo mesmo espaço.',
    'en-US': 'Same animal — deep identification: you get each other instinctively. Just watch out not to compete for the same space.',
    'es-ES': 'Mismo animal — identificacion profunda: se entienden por instinto. Cuidado con competir por el mismo espacio.',
    'it-IT': 'Stesso animale — identificazione profonda: vi capite d\'istinto. Attenti solo a non competere per lo stesso spazio.',
  },
  'secret-friend': {
    'pt-BR': 'Amigos secretos (Liu He) — a dupla mais harmoniosa do zodíaco chinês: apoio natural, lealdade e cumplicidade.',
    'en-US': 'Secret friends (Liu He) — the most harmonious pair in the Chinese zodiac: natural support, loyalty and complicity.',
    'es-ES': 'Amigos secretos (Liu He) — la pareja mas armoniosa del zodiaco chino: apoyo natural, lealtad y complicidad.',
    'it-IT': 'Amici segreti (Liu He) — la coppia piu armoniosa dello zodiaco cinese: sostegno naturale, lealta e complicita.',
  },
  ally: {
    'pt-BR': 'Trígono de aliados (San He) — sintonia de valores e ritmo: parceria que flui e prospera junta.',
    'en-US': 'Ally trine (San He) — alignment of values and rhythm: a partnership that flows and thrives together.',
    'es-ES': 'Trigono de aliados (San He) — sintonia de valores y ritmo: una sociedad que fluye y prospera junta.',
    'it-IT': 'Trigono di alleati (San He) — sintonia di valori e ritmo: una coppia che scorre e prospera insieme.',
  },
  clash: {
    'pt-BR': 'Choque (Chong) — atração intensa e movimento, mas com fricção: crescem se traduzirem a diferença em vez de disputar.',
    'en-US': 'Clash (Chong) — intense attraction and movement, but with friction: you grow by translating the difference rather than competing.',
    'es-ES': 'Choque (Chong) — atraccion intensa y movimiento, pero con friccion: crecen si traducen la diferencia en vez de competir.',
    'it-IT': 'Scontro (Chong) — attrazione intensa e movimento, ma con attrito: crescete traducendo la differenza invece di competere.',
  },
  harm: {
    'pt-BR': 'Dano (Hai) — afinidade com ruídos sutis: funciona com comunicação clara e menos suposição.',
    'en-US': 'Harm (Hai) — affinity with subtle noise: it works with clear communication and less assumption.',
    'es-ES': 'Dano (Hai) — afinidad con ruidos sutiles: funciona con comunicacion clara y menos suposicion.',
    'it-IT': 'Danno (Hai) — affinita con rumori sottili: funziona con comunicazione chiara e meno supposizioni.',
  },
  neutral: {
    'pt-BR': 'Relação neutra entre os animais — nem forte afinidade nem atrito; a base vem dos outros pilares do BaZi.',
    'en-US': 'Neutral animal relation — neither strong affinity nor friction; the base comes from the other BaZi pillars.',
    'es-ES': 'Relacion neutral entre los animales — ni fuerte afinidad ni friccion; la base viene de los otros pilares del BaZi.',
    'it-IT': 'Relazione neutra tra gli animali — ne forte affinita ne attrito; la base viene dagli altri pilastri del BaZi.',
  },
}
export function animalCompatReading(relation: YearRelation, lang: string): string {
  return COMPAT[relation]?.[L(lang)] || COMPAT.neutral[L(lang)]
}
