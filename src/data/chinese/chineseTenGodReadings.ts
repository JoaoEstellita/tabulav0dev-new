// Significado dos DEZ DEUSES (Ten Gods) do BaZi — a relação entre o Day Master e
// cada energia do mapa. Lente = evolução de consciência (dom + lição), sem determinismo.
// es-ES sem tildes; it-IT sem acentos.
import type { TenGodKey } from '../../astro/chinese/types'

type Lang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'
function L(l: string): Lang { return (l === 'en-US' || l === 'es-ES' || l === 'it-IT') ? l : 'pt-BR' }

const READ: Record<TenGodKey, Record<Lang, string>> = {
  'bi-jian': {
    'pt-BR': 'Energia de igual pra igual: autonomia, identidade e cooperação entre pares. Ensina a firmar o próprio lugar sem competir por tudo e a colaborar sem se diluir.',
    'en-US': 'Peer-to-peer energy: autonomy, identity and cooperation among equals. It teaches you to hold your ground without competing over everything.',
    'es-ES': 'Energia de igual a igual: autonomia, identidad y cooperacion entre pares. Ensena a afirmar el propio lugar sin competir por todo.',
    'it-IT': 'Energia alla pari: autonomia, identita e cooperazione tra pari. Insegna a tenere il proprio posto senza competere per tutto.',
  },
  'jie-cai': {
    'pt-BR': 'Impulso de competir e conquistar por conta própria: coragem e iniciativa, mas também disputa e impaciência. Ensina a canalizar a força em vez de gastá-la em rivalidade.',
    'en-US': 'Drive to compete and win on your own: courage and initiative, but also rivalry and impatience. It teaches you to channel the force instead of spending it on rivalry.',
    'es-ES': 'Impulso de competir y conquistar por cuenta propia: coraje e iniciativa, pero tambien disputa e impaciencia. Ensena a canalizar la fuerza en vez de gastarla en rivalidad.',
    'it-IT': 'Spinta a competere e conquistare da soli: coraggio e iniziativa, ma anche rivalita e impazienza. Insegna a incanalare la forza invece di sprecarla nella rivalita.',
  },
  'shi-shen': {
    'pt-BR': 'Criatividade que flui com leveza: expressão, prazer e generosidade. Ensina a produzir a partir do gosto genuíno, sem culpa e sem se perder no excesso.',
    'en-US': 'Creativity that flows with ease: expression, pleasure and generosity. It teaches you to create from genuine taste, without guilt or excess.',
    'es-ES': 'Creatividad que fluye con ligereza: expresion, placer y generosidad. Ensena a crear desde el gusto genuino, sin culpa ni exceso.',
    'it-IT': 'Creativita che scorre con leggerezza: espressione, piacere e generosita. Insegna a creare dal gusto genuino, senza colpa ne eccesso.',
  },
  'shang-guan': {
    'pt-BR': 'Talento brilhante que quebra o padrão: originalidade, crítica e rebeldia criativa. Ensina a usar o dom sem arrogância e a respeitar limites sem apagar o brilho.',
    'en-US': 'Brilliant talent that breaks the mold: originality, critique and creative rebellion. It teaches you to use the gift without arrogance and to respect limits without dimming your shine.',
    'es-ES': 'Talento brillante que rompe el molde: originalidad, critica y rebeldia creativa. Ensena a usar el don sin arrogancia y a respetar limites sin apagar el brillo.',
    'it-IT': 'Talento brillante che rompe lo schema: originalita, critica e ribellione creativa. Insegna a usare il dono senza arroganza e a rispettare i limiti senza spegnere la luce.',
  },
  'pian-cai': {
    'pt-BR': 'Faro para oportunidade e ganho circunstancial: dinamismo, generosidade e jogo. Ensina a colher a chance sem virar refém do risco e da dispersão.',
    'en-US': 'A nose for opportunity and windfall gain: dynamism, generosity and play. It teaches you to seize the chance without becoming a hostage to risk and scattering.',
    'es-ES': 'Olfato para la oportunidad y la ganancia circunstancial: dinamismo, generosidad y juego. Ensena a tomar la ocasion sin volverse rehen del riesgo.',
    'it-IT': 'Fiuto per l\'opportunita e il guadagno circostanziale: dinamismo, generosita e gioco. Insegna a cogliere l\'occasione senza diventare ostaggio del rischio.',
  },
  'zheng-cai': {
    'pt-BR': 'Construção estável de recursos: trabalho firme, responsabilidade e valor concreto. Ensina a prosperar com constância e a não confundir segurança com apego.',
    'en-US': 'Steady building of resources: firm work, responsibility and concrete value. It teaches you to prosper with consistency and not mistake security for attachment.',
    'es-ES': 'Construccion estable de recursos: trabajo firme, responsabilidad y valor concreto. Ensena a prosperar con constancia y a no confundir seguridad con apego.',
    'it-IT': 'Costruzione stabile di risorse: lavoro saldo, responsabilita e valore concreto. Insegna a prosperare con costanza e a non confondere sicurezza con attaccamento.',
  },
  'qi-sha': {
    'pt-BR': 'Força que enfrenta o desafio de frente: coragem, ação sob pressão e autoridade. Ensina a dominar o próprio ímpeto e a usar o poder a serviço, não do controle.',
    'en-US': 'Force that meets the challenge head-on: courage, action under pressure and authority. It teaches you to master your own drive and use power in service, not control.',
    'es-ES': 'Fuerza que enfrenta el desafio de frente: coraje, accion bajo presion y autoridad. Ensena a dominar el propio impetu y usar el poder al servicio, no del control.',
    'it-IT': 'Forza che affronta la sfida a viso aperto: coraggio, azione sotto pressione e autorita. Insegna a dominare il proprio impeto e usare il potere al servizio, non al controllo.',
  },
  'zheng-guan': {
    'pt-BR': 'Ordem, responsabilidade e respeito às regras: disciplina, ética e autocomando. Ensina a estruturar sem enrijecer e a liderar pelo exemplo.',
    'en-US': 'Order, responsibility and respect for rules: discipline, ethics and self-command. It teaches you to structure without hardening and to lead by example.',
    'es-ES': 'Orden, responsabilidad y respeto a las reglas: disciplina, etica y autocomando. Ensena a estructurar sin endurecer y a liderar con el ejemplo.',
    'it-IT': 'Ordine, responsabilita e rispetto delle regole: disciplina, etica e autocontrollo. Insegna a strutturare senza irrigidirsi e a guidare con l\'esempio.',
  },
  'pian-yin': {
    'pt-BR': 'Mente que percebe o invisível: intuição, estudo profundo e mundo interior. Ensina a confiar na percepção sutil sem se isolar do concreto.',
    'en-US': 'A mind that senses the invisible: intuition, deep study and inner world. It teaches you to trust subtle perception without isolating from the concrete.',
    'es-ES': 'Mente que percibe lo invisible: intuicion, estudio profundo y mundo interior. Ensena a confiar en la percepcion sutil sin aislarse de lo concreto.',
    'it-IT': 'Mente che percepisce l\'invisibile: intuizione, studio profondo e mondo interiore. Insegna a fidarsi della percezione sottile senza isolarsi dal concreto.',
  },
  'zheng-yin': {
    'pt-BR': 'Nutrição, aprendizado e apoio: sabedoria que acolhe, base emocional e formação. Ensina a receber e a cuidar sem se anular no papel de suporte.',
    'en-US': 'Nourishment, learning and support: wisdom that shelters, emotional ground and formation. It teaches you to receive and care without erasing yourself in the supporting role.',
    'es-ES': 'Nutricion, aprendizaje y apoyo: sabiduria que acoge, base emocional y formacion. Ensena a recibir y a cuidar sin anularse en el rol de soporte.',
    'it-IT': 'Nutrimento, apprendimento e sostegno: saggezza che accoglie, base emotiva e formazione. Insegna a ricevere e a prendersi cura senza annullarsi nel ruolo di supporto.',
  },
}

/** Interpretação de um dos Dez Deuses (Ten Gods). */
export function tenGodReading(k: TenGodKey, l: string): string {
  return READ[k]?.[L(l)] || READ[k]?.['pt-BR'] || ''
}
