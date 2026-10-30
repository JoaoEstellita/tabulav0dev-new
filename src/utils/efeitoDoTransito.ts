import type { AppLanguage } from './astro/pt'

/**
 * O que acontece quando um trânsito toca um ponto do mapa.
 *
 * Existe porque a síntese estava dizendo coisas como "o Sol em atrito e a Lua
 * em fluxo", e depois comentando o próprio texto: "o dia fica dividido entre os
 * dois — e isso é informação, não contradição". Meta-comentário não informa
 * nada; só ocupa espaço parecendo inteligente.
 *
 * "Em atrito" também não informa: diz a GEOMETRIA, não o efeito. O que a pessoa
 * precisa saber é o que fica difícil e o que fica fácil. Aqui cada ponto tem
 * uma frase para quando é pressionado e outra para quando é favorecido —
 * concretas, no presente, sem promessa.
 *
 * Regra de escrita: oração curta, sujeito concreto, verbo no presente. Nada de
 * "pode ser que", "tende a" ou "é hora de".
 *
 * ⚠️ E nada de VEREDICTO. A primeira versão decretava resultados sobre a
 * pessoa — "a imagem que você passa incomoda", "o controle vira disputa", "a
 * ação esbarra e irrita". Relatado na tela: ficou forte demais. Lidas todo dia,
 * uma depois da outra, essas frases fazem o app soar como quem repreende.
 *
 * O ajuste não é suavizar com "pode ser que" — isso tira a assertividade sem
 * devolver informação. É dizer O QUE MUDA E EM RELAÇÃO A QUÊ: "encontra mais
 * resistência que o normal" afirma com a mesma firmeza, descreve o mecanismo em
 * vez de julgar quem lê, e situa o dia contra a linha de base da pessoa — que é
 * justamente o que um trânsito significa.
 *
 * Vale para os dois lados: o `facil` prometia demais ("as portas abrem com
 * facilidade"). Promessa que não se cumpre custa confiança igual.
 */

type Par = Record<AppLanguage, string>
interface EfeitoDoPonto {
  /** Como o ponto é chamado numa frase ("a sua imaginação"). */
  nome: Par
  /** Quando recebe aspecto tenso. */
  tenso: Par
  /** Quando recebe aspecto harmônico. */
  facil: Par
  /**
   * Quando recebe os DOIS ao mesmo tempo.
   *
   * ⚠️ Sem este terceiro texto, a frase colava `tenso` e `facil` com um "mas"
   * — e como os dois foram escritos como espelhos ("mais obstáculo que o
   * normal" / "menos obstáculo que o normal"), o resultado era absurdo:
   *
   *     "Agir encontra mais obstáculo do que de costume — mas agir
   *      encontra menos obstáculo do que de costume."
   *
   * Colar funcionava só por acaso, quando os dois lados falavam de sujeitos
   * diferentes ("a clareza custa mais… mas a intuição fica mais afiada").
   * Quando o sujeito era o mesmo, a frase se desdizia.
   *
   * A situação é real e comum — um trânsito pressiona o ponto enquanto outro
   * o favorece. Então ela merece texto próprio, que descreve a DIVISÃO em vez
   * de empilhar duas afirmações opostas.
   */
  misto: Par
  /**
   * A SEGUNDA LINHA de cada um dos tres casos acima.
   *
   * ⚠️ POR QUE EXISTE. As frases de cima dizem O QUE muda ("a mudanca abre
   * tanto quanto desorganiza") e param ali. Lidas na tela, uma atras da outra,
   * elas sao bonitas e vagas: a pessoa entende que ha uma tensao, nao entende o
   * que fazer com ela nem como aquilo aparece no dia. Esta linha e a diferenca
   * entre uma frase de efeito e uma leitura.
   *
   * ⚠️ MESMAS REGRAS da linha de cima, e elas pesam MAIS aqui porque ha mais
   * espaco para escorregar: presente, sujeito concreto, sem "pode ser que" /
   * "tende a" / "e hora de"; NENHUM veredito sobre a pessoa — descreve o
   * MECANISMO contra a linha de base dela ("mais que o normal"); e o lado
   * `facil` NAO promete resultado, porque promessa que nao se cumpre custa
   * confianca igual a repreensao.
   *
   * ⚠️ Ela COMPLEMENTA, nunca repete a manchete com outras palavras. Se a
   * segunda linha pudesse substituir a primeira, uma das duas esta sobrando.
   */
  detalhe: { tenso: Par; facil: Par; misto: Par }
}

const E = (pt: string, en: string, es: string, it: string): Par =>
  ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it })

const PONTOS: Record<string, EfeitoDoPonto> = {
  sun: {
    nome: E('a sua vitalidade', 'your vitality', 'tu vitalidad', 'la tua vitalita'),
    tenso: E('o que você quer fazer encontra mais resistência que o normal', 'what you want to do meets more resistance than usual', 'lo que quieres hacer encuentra mas resistencia que lo normal', 'cio che vuoi fare incontra piu resistenza del solito'),
    facil: E('o que você quer fazer encontra menos atrito que o normal', 'what you want to do meets less friction than usual', 'lo que quieres hacer encuentra menos roce que lo normal', 'cio che vuoi fare incontra meno attrito del solito'),
    misto: E('a vontade avança numa frente e trava em outra', 'your drive moves on one front and stalls on another', 'la voluntad avanza en un frente y se traba en otro', 'la volonta avanza su un fronte e si blocca su un altro'),
    detalhe: {
      tenso: E('O esforço de sempre não basta hoje: o mesmo passo pede mais insistência e cansa antes.', 'Your usual effort is not enough today: the same step asks for more push and tires you sooner.', 'El esfuerzo de siempre no alcanza hoy: el mismo paso pide mas insistencia y cansa antes.', 'Lo sforzo di sempre oggi non basta: lo stesso passo chiede piu insistenza e stanca prima.'),
      facil: E('O que depende de você anda com o empurrão de sempre, e sobra energia para o passo seguinte.', 'What depends on you moves with your usual push, and there is energy left for the next step.', 'Lo que depende de ti avanza con el empuje de siempre, y sobra energia para el paso siguiente.', 'Cio che dipende da te avanza con la spinta di sempre, e resta energia per il passo seguente.'),
      misto: E('Uma parte do dia responde ao seu impulso e outra resiste a ele; o que decide não é o tamanho do esforço, é onde ele entra.', 'Part of the day answers your drive and part resists it; what decides is not how hard you push but where you push.', 'Una parte del dia responde a tu impulso y otra se resiste; lo que decide no es el tamano del esfuerzo, sino donde entra.', 'Una parte del giorno risponde al tuo slancio e un altra resiste; a decidere non e quanto spingi, ma dove.'),
    },
  },
  moon: {
    nome: E('o seu humor', 'your mood', 'tu animo', 'il tuo umore'),
    tenso: E('o humor muda mais rápido do que você consegue acompanhar', 'your mood shifts faster than you can keep up with', 'el animo cambia mas rapido de lo que puedes seguir', 'l umore cambia piu in fretta di quanto riesci a seguire'),
    facil: E('o humor acompanha o que você faz, sem puxar para outro lado', 'your mood follows what you do, without pulling elsewhere', 'el animo acompana lo que haces, sin tirar para otro lado', 'l umore accompagna cio che fai, senza tirare altrove'),
    misto: E('o humor oscila entre acompanhar e pesar', 'your mood swings between following along and weighing down', 'el animo oscila entre acompanar y pesar', 'l umore oscilla tra accompagnare e pesare'),
    detalhe: {
      tenso: E('A reação chega antes da leitura da situação, e o que parece enorme agora costuma encolher em poucas horas.', 'Your reaction arrives before you have read the situation, and what feels huge now usually shrinks within hours.', 'La reaccion llega antes que la lectura de la situacion, y lo que parece enorme ahora suele encogerse en pocas horas.', 'La reazione arriva prima della lettura della situazione, e cio che sembra enorme ora di solito si riduce in poche ore.'),
      facil: E('O que você sente e o que você faz apontam para o mesmo lado, e decidir custa menos.', 'What you feel and what you do point the same way, and deciding costs less.', 'Lo que sientes y lo que haces apuntan al mismo lado, y decidir cuesta menos.', 'Cio che senti e cio che fai puntano dalla stessa parte, e decidere costa meno.'),
      misto: E('Em alguns momentos o sentir empurra junto, em outros puxa para trás; o dia pede ajuste de ritmo, não mais força.', 'At times your feelings push along with you, at times they pull back; the day asks for a change of pace, not more force.', 'A ratos el sentir empuja contigo, a ratos tira hacia atras; el dia pide ajuste de ritmo, no mas fuerza.', 'A tratti il sentire spinge con te, a tratti tira indietro; il giorno chiede un cambio di ritmo, non piu forza.'),
    },
  },
  mercury: {
    nome: E('a sua comunicação', 'your communication', 'tu comunicacion', 'la tua comunicazione'),
    tenso: E('conversas e raciocínio pedem mais atenção que o normal', 'talking and thinking need more care than usual', 'conversar y razonar piden mas atencion que lo normal', 'parlare e ragionare chiedono piu attenzione del solito'),
    facil: E('as ideias saem mais claras do que de costume', 'ideas come out clearer than usual', 'las ideas salen mas claras que de costumbre', 'le idee escono piu chiare del solito'),
    misto: E('algumas conversas fluem e outras travam', 'some conversations flow and others get stuck', 'algunas conversaciones fluyen y otras se traban', 'alcune conversazioni scorrono e altre si bloccano'),
    detalhe: {
      tenso: E('Mensagens e combinados saem com mais ruído do que você imagina: vale repetir o essencial e confirmar o que ficou entendido.', 'Messages and arrangements carry more noise than you think: repeat what matters and confirm what landed.', 'Mensajes y acuerdos salen con mas ruido del que imaginas: conviene repetir lo esencial y confirmar lo que se entendio.', 'Messaggi e accordi escono con piu rumore di quanto immagini: conviene ripetere l essenziale e confermare cio che e arrivato.'),
      facil: E('Explicar, escrever e combinar exigem menos voltas — bom dia para o assunto que você adiava por preguiça de explicar.', 'Explaining, writing and settling things take fewer detours — a good day for the topic you kept postponing because explaining it felt heavy.', 'Explicar, escribir y acordar exigen menos vueltas: buen dia para el asunto que aplazabas por pereza de explicarlo.', 'Spiegare, scrivere e accordarsi richiedono meno giri: buona giornata per l argomento che rimandavi per pigrizia di spiegarlo.'),
      misto: E('Com umas pessoas o assunto anda sozinho; com outras, a mesma frase trava. A diferença está no interlocutor, não no que você diz.', 'With some people the subject moves on its own; with others the same sentence jams. The difference is the listener, not your words.', 'Con unas personas el asunto avanza solo; con otras, la misma frase se traba. La diferencia esta en el interlocutor, no en lo que dices.', 'Con certe persone l argomento va da solo; con altre la stessa frase si inceppa. La differenza e l interlocutore, non cio che dici.'),
    },
  },
  venus: {
    nome: E('os seus afetos', 'your affections', 'tus afectos', 'i tuoi affetti'),
    tenso: E('as trocas afetivas exigem mais esforço que o normal', 'affectionate exchanges take more effort than usual', 'los intercambios afectivos exigen mas esfuerzo que lo normal', 'gli scambi affettivi richiedono piu sforzo del solito'),
    facil: E('as trocas afetivas acontecem com menos esforço', 'affectionate exchanges happen with less effort', 'los intercambios afectivos ocurren con menos esfuerzo', 'gli scambi affettivi avvengono con meno sforzo'),
    misto: E('o afeto corre fácil de um lado e cobra do outro', 'affection flows easily on one side and asks a lot on the other', 'el afecto corre facil de un lado y cobra del otro', 'l affetto scorre facile da un lato e chiede molto dall altro'),
    detalhe: {
      tenso: E('Gestos de aproximação custam mais e são lidos com mais aspereza do que você pretendia; o afeto não sumiu, só não está fluindo sozinho.', 'Gestures of closeness cost more and land harsher than you meant; the affection has not gone, it just is not flowing on its own.', 'Los gestos de acercamiento cuestan mas y se leen con mas aspereza de la que pretendias; el afecto no desaparecio, solo no fluye solo.', 'I gesti di avvicinamento costano di piu e arrivano piu ruvidi di quanto volevi; l affetto non e sparito, solo non scorre da solo.'),
      facil: E('Aproximar-se custa pouco e agrada mais que o normal — serve para quem você ama e para quem você precisa dizer sim.', 'Getting closer costs little and lands better than usual — good for the people you love and for the ones you need to say yes to.', 'Acercarse cuesta poco y agrada mas que lo normal: sirve para quien amas y para quien necesitas decirle que si.', 'Avvicinarsi costa poco e piace piu del solito: vale per chi ami e per chi devi dire di si.'),
      misto: E('Uma relação devolve na mesma moeda e outra pede mais do que dá; o dia mostra a diferença entre as duas com clareza incomum.', 'One relationship gives back in kind and another asks more than it gives; the day shows the difference with unusual clarity.', 'Una relacion devuelve en la misma moneda y otra pide mas de lo que da; el dia muestra la diferencia con claridad poco comun.', 'Una relazione ricambia e un altra chiede piu di quanto dia; il giorno mostra la differenza con chiarezza insolita.'),
    },
  },
  mars: {
    nome: E('a sua ação', 'your drive to act', 'tu accion', 'la tua azione'),
    tenso: E('agir encontra mais obstáculo do que de costume', 'acting meets more obstacles than usual', 'actuar encuentra mas obstaculos que de costumbre', 'agire incontra piu ostacoli del solito'),
    facil: E('agir encontra menos obstáculo do que de costume', 'acting meets fewer obstacles than usual', 'actuar encuentra menos obstaculos que de costumbre', 'agire incontra meno ostacoli del solito'),
    misto: E('a ação rende numa frente e esbarra em outra', 'action pays off on one front and bumps on another', 'la accion rinde en un frente y tropieza en otro', 'l azione rende su un fronte e urta su un altro'),
    detalhe: {
      tenso: E('Começar pede mais empurrão e as coisas emperram no meio; pressa aqui custa retrabalho, e a irritação aparece rápido.', 'Starting takes more push and things jam midway; rushing here costs rework, and irritation shows up fast.', 'Empezar pide mas empuje y las cosas se atascan a mitad; la prisa aqui cuesta retrabajo, y la irritacion aparece rapido.', 'Iniziare chiede piu spinta e le cose si inceppano a meta; la fretta qui costa rilavorazione, e l irritazione arriva in fretta.'),
      facil: E('O que exige iniciativa anda: é dia de atacar a pendência que precisa de energia, não de paciência.', 'Whatever needs initiative moves: a day to take on the task that needs energy, not the one that needs patience.', 'Lo que exige iniciativa avanza: es dia de atacar el pendiente que necesita energia, no paciencia.', 'Cio che richiede iniziativa avanza: e giorno per affrontare la cosa che chiede energia, non pazienza.'),
      misto: E('Uma linha de trabalho rende bem enquanto outra emperra — e insistir na que trava rouba o tempo da que anda.', 'One line of work pays off while another jams — and pushing the stuck one steals time from the one that moves.', 'Una linea de trabajo rinde bien mientras otra se atasca, e insistir en la trabada le roba tiempo a la que avanza.', 'Una linea di lavoro rende mentre un altra si blocca, e insistere su quella bloccata ruba tempo a quella che va.'),
    },
  },
  jupiter: {
    nome: E('a sua expansão', 'your sense of expansion', 'tu expansion', 'la tua espansione'),
    tenso: E('o impulso de ampliar pede mais critério que o normal', 'the urge to expand needs more judgement than usual', 'el impulso de ampliar pide mas criterio que lo normal', 'la spinta ad ampliare chiede piu criterio del solito'),
    facil: E('ampliar custa menos esforço do que de costume', 'expanding takes less effort than usual', 'ampliar cuesta menos esfuerzo que de costumbre', 'ampliare costa meno sforzo del solito'),
    misto: E('ampliar vem fácil, mas pede critério', 'expanding comes easily, but needs judgement', 'ampliar viene facil, pero pide criterio', 'ampliare viene facile, ma chiede criterio'),
    detalhe: {
      tenso: E('A oportunidade parece maior do que é, e o entusiasmo pede conferência: o excesso aqui não vem de ambição, vem de pressa.', 'The opportunity looks bigger than it is, and the enthusiasm needs checking: the overreach here comes from haste, not ambition.', 'La oportunidad parece mayor de lo que es, y el entusiasmo pide comprobacion: el exceso aqui no viene de ambicion, viene de prisa.', 'L occasione sembra piu grande di quello che e, e l entusiasmo chiede verifica: l eccesso qui non viene dall ambizione, ma dalla fretta.'),
      facil: E('Ampliar — propor, pedir, mostrar o que faz — encontra mais porta aberta que o normal.', 'Expanding — proposing, asking, showing your work — meets more open doors than usual.', 'Ampliar (proponer, pedir, mostrar lo que haces) encuentra mas puertas abiertas que lo normal.', 'Ampliare, cioe proporre, chiedere, mostrare cio che fai, trova piu porte aperte del solito.'),
      misto: E('A chance aparece com facilidade e nem toda ela vale a pena; o dia favorece quem escolhe, não quem aceita tudo.', 'Chances show up easily and not all of them are worth it; the day favours choosing, not accepting everything.', 'La oportunidad aparece con facilidad y no toda vale la pena; el dia favorece a quien elige, no a quien acepta todo.', 'L occasione arriva con facilita e non tutta vale la pena; il giorno favorisce chi sceglie, non chi accetta tutto.'),
    },
  },
  saturn: {
    nome: E('a sua estrutura', 'your structure', 'tu estructura', 'la tua struttura'),
    tenso: E('compromissos e limites pesam mais que o normal', 'commitments and limits weigh more than usual', 'compromisos y limites pesan mas que lo normal', 'impegni e limiti pesano piu del solito'),
    facil: E('o que você constrói se sustenta com menos esforço', 'what you build holds up with less effort', 'lo que construyes se sostiene con menos esfuerzo', 'cio che costruisci si regge con meno sforzo'),
    misto: E('a estrutura sustenta e cobra ao mesmo tempo', 'structure holds and demands at the same time', 'la estructura sostiene y cobra al mismo tiempo', 'la struttura sostiene e chiede allo stesso tempo'),
    detalhe: {
      tenso: E('Prazos, cobranças e limites aparecem juntos e parecem definitivos; não são — mas hoje pesam, e empurrar contra eles custa caro.', 'Deadlines, demands and limits show up together and look final; they are not — but today they weigh, and pushing against them costs.', 'Plazos, exigencias y limites aparecen juntos y parecen definitivos; no lo son, pero hoy pesan, y empujar contra ellos sale caro.', 'Scadenze, richieste e limiti arrivano insieme e sembrano definitivi; non lo sono, ma oggi pesano, e spingere contro costa caro.'),
      facil: E('O que é feito com método se fixa: bom dia para fechar, assinar e organizar o que estava solto.', 'What you do with method sticks: a good day to close, sign and tidy what was loose.', 'Lo hecho con metodo se fija: buen dia para cerrar, firmar y ordenar lo que estaba suelto.', 'Cio che fai con metodo si fissa: buona giornata per chiudere, firmare e mettere in ordine cio che era sciolto.'),
      misto: E('O que já está construído segura você e cobra manutenção ao mesmo tempo; são a mesma estrutura, não duas forças opostas.', 'What you have already built holds you up and asks for upkeep at once; it is the same structure, not two opposing forces.', 'Lo que ya esta construido te sostiene y cobra mantenimiento a la vez; es la misma estructura, no dos fuerzas opuestas.', 'Cio che hai gia costruito ti sostiene e chiede manutenzione insieme; e la stessa struttura, non due forze opposte.'),
    },
  },
  uranus: {
    nome: E('a sua inquietação', 'your restlessness', 'tu inquietud', 'la tua inquietudine'),
    tenso: E('o imprevisto desorganiza a rotina mais que o normal', 'the unexpected disrupts routine more than usual', 'lo imprevisto desorganiza la rutina mas que lo normal', 'l imprevisto disorganizza la routine piu del solito'),
    facil: E('mudanças acontecem com menos sobressalto que o normal', 'changes happen with less of a jolt than usual', 'los cambios ocurren con menos sobresalto que lo normal', 'i cambiamenti avvengono con meno scossa del solito'),
    misto: E('a mudança abre tanto quanto desorganiza', 'change opens as much as it disrupts', 'el cambio abre tanto como desorganiza', 'il cambiamento apre quanto disorganizza'),
    detalhe: {
      tenso: E('O que estava combinado muda de última hora e a vontade de romper algo cresce; decisão tomada nesse impulso costuma ser revista depois.', 'Settled plans change at the last minute and the urge to break something grows; a decision made on that impulse usually gets revisited.', 'Lo acordado cambia a ultima hora y crece la gana de romper algo; la decision tomada en ese impulso suele revisarse despues.', 'Cio che era stabilito cambia all ultimo e cresce la voglia di rompere qualcosa; una decisione presa su quell impulso di solito viene rivista.'),
      facil: E('A novidade entra sem bagunçar o resto: dia bom para testar outro jeito de fazer o que já é rotina.', 'Something new comes in without unsettling the rest: a good day to try another way of doing the routine thing.', 'La novedad entra sin desordenar el resto: buen dia para probar otra forma de hacer lo que ya es rutina.', 'La novita entra senza scompigliare il resto: buona giornata per provare un altro modo di fare cio che e gia routine.'),
      misto: E('O mesmo movimento que abre uma saída nova derruba uma rotina que funcionava; o ganho é real e o custo também.', 'The same move that opens a new way out knocks over a routine that worked; the gain is real and so is the cost.', 'El mismo movimiento que abre una salida nueva tumba una rutina que funcionaba; la ganancia es real y el costo tambien.', 'Lo stesso movimento che apre una via nuova abbatte una routine che funzionava; il guadagno e reale e il costo pure.'),
    },
  },
  neptune: {
    nome: E('a sua imaginação', 'your imagination', 'tu imaginacion', 'la tua immaginazione'),
    tenso: E('a clareza custa mais e o cansaço aparece antes', 'clarity costs more and tiredness shows up earlier', 'la claridad cuesta mas y el cansancio aparece antes', 'la chiarezza costa di piu e la stanchezza arriva prima'),
    facil: E('a intuição fica mais afiada que o normal', 'intuition gets sharper than usual', 'la intuicion se afina mas que lo normal', 'l intuito si affina piu del solito'),
    misto: E('a intuição fica afiada enquanto a clareza se perde', 'intuition sharpens while clarity blurs', 'la intuicion se afina mientras la claridad se pierde', 'l intuito si affina mentre la chiarezza si perde'),
    detalhe: {
      tenso: E('Detalhes escapam, o cansaço vem antes da hora e o que é dito soa mais vago do que foi; não é dia de letra miúda.', 'Details slip, tiredness comes early and what is said sounds vaguer than it was; not a day for fine print.', 'Los detalles se escapan, el cansancio llega antes de hora y lo dicho suena mas vago de lo que fue; no es dia de letra pequena.', 'I dettagli sfuggono, la stanchezza arriva prima e cio che viene detto suona piu vago di quanto fosse; non e giornata da caratteri piccoli.'),
      facil: E('A percepção pega o que o raciocínio ainda não alcançou — serve para criar, para ouvir e para sentir o clima de um lugar.', 'Perception catches what reasoning has not reached yet — good for making things, for listening, and for reading a room.', 'La percepcion capta lo que el razonamiento aun no alcanza: sirve para crear, para escuchar y para sentir el clima de un lugar.', 'La percezione coglie cio che il ragionamento non ha ancora raggiunto: serve per creare, per ascoltare e per sentire il clima di un posto.'),
      misto: E('Você capta o não dito com precisão e erra o detalhe objetivo; confie no palpite sobre pessoas e confira o número duas vezes.', 'You catch the unsaid precisely and miss the hard detail; trust the hunch about people and check the number twice.', 'Captas lo no dicho con precision y fallas el detalle objetivo; confia en la corazonada sobre personas y revisa el numero dos veces.', 'Cogli il non detto con precisione e sbagli il dettaglio concreto; fidati dell intuizione sulle persone e ricontrolla il numero.'),
    },
  },
  pluto: {
    nome: E('o seu poder pessoal', 'your personal power', 'tu poder personal', 'il tuo potere personale'),
    tenso: E('questões de controle aparecem mais que o normal', 'control issues come up more than usual', 'los temas de control aparecen mas que lo normal', 'le questioni di controllo emergono piu del solito'),
    facil: E('a sua força se concentra melhor onde importa', 'your strength gathers better where it matters', 'tu fuerza se concentra mejor donde importa', 'la tua forza si concentra meglio dove conta'),
    misto: E('a força se concentra onde importa e vira disputa onde não', 'strength gathers where it matters and turns into a dispute where it does not', 'la fuerza se concentra donde importa y se vuelve disputa donde no', 'la forza si concentra dove conta e diventa disputa dove no'),
    detalhe: {
      tenso: E('Questões de quem manda em quê vêm à tona, inclusive onde não precisavam; forçar aqui aprofunda a disputa em vez de encerrá-la.', 'Questions of who controls what surface, including where they did not need to; forcing here deepens the dispute instead of ending it.', 'Las cuestiones de quien manda en que salen a la superficie, incluso donde no hacia falta; forzar aqui ahonda la disputa en vez de cerrarla.', 'Le questioni di chi comanda su cosa vengono a galla, anche dove non serviva; forzare qui approfondisce il conflitto invece di chiuderlo.'),
      facil: E('Dá para ir fundo numa coisa só e terminar o que exige intensidade — serve para o assunto que você vinha evitando.', 'You can go deep on one thing and finish what takes intensity — good for the matter you have been avoiding.', 'Se puede ir a fondo en una sola cosa y terminar lo que exige intensidad: sirve para el asunto que venias evitando.', 'Puoi andare a fondo su una cosa sola e finire cio che richiede intensita: vale per la questione che stavi evitando.'),
      misto: E('A mesma intensidade que resolve o essencial transforma o secundário em queda de braço; escolher onde aplicá-la é o trabalho do dia.', 'The same intensity that settles what matters turns the side issue into an arm-wrestle; choosing where to aim it is the work of the day.', 'La misma intensidad que resuelve lo esencial convierte lo secundario en pulso; elegir donde aplicarla es el trabajo del dia.', 'La stessa intensita che risolve l essenziale trasforma il secondario in braccio di ferro; scegliere dove metterla e il lavoro del giorno.'),
    },
  },
  meio_do_ceu: {
    nome: E('a sua carreira', 'your career', 'tu carrera', 'la tua carriera'),
    tenso: E('a carreira exige e expõe mais que o normal', 'career demands and exposes more than usual', 'la carrera exige y expone mas que lo normal', 'la carriera chiede ed espone piu del solito'),
    facil: E('a carreira anda com menos atrito que o normal', 'career moves with less friction than usual', 'la carrera avanza con menos roce que lo normal', 'la carriera avanza con meno attrito del solito'),
    misto: E('a carreira anda e cobra ao mesmo tempo', 'career moves and demands at the same time', 'la carrera avanza y cobra al mismo tiempo', 'la carriera avanza e chiede allo stesso tempo'),
    detalhe: {
      tenso: E('O que você faz fica mais visível e mais julgado que o normal, e o erro pequeno chama atenção desproporcional.', 'What you do is more visible and more judged than usual, and a small slip draws outsized attention.', 'Lo que haces queda mas visible y mas juzgado que lo normal, y el error pequeno llama una atencion desproporcionada.', 'Cio che fai e piu visibile e piu giudicato del solito, e l errore piccolo attira un attenzione sproporzionata.'),
      facil: E('O trabalho aparece para quem decide: dia de mostrar, de propor e de deixar registrado o que foi feito.', 'The work reaches the people who decide: a day to show it, to propose, and to put on record what you did.', 'El trabajo llega a quien decide: dia de mostrar, de proponer y de dejar registrado lo hecho.', 'Il lavoro arriva a chi decide: giorno per mostrare, proporre e mettere a verbale cio che hai fatto.'),
      misto: E('O avanço vem acompanhado de mais exigência — é reconhecimento e conta a pagar na mesma entrega.', 'The step forward comes with more demand — it is recognition and a bill to pay in the same delivery.', 'El avance viene con mas exigencia: es reconocimiento y cuenta a pagar en la misma entrega.', 'L avanzamento arriva con piu richieste: e riconoscimento e conto da pagare nella stessa consegna.'),
    },
  },
  ascendente: {
    nome: E('a sua presença', 'your presence', 'tu presencia', 'la tua presenza'),
    tenso: E('o jeito como você aparece encontra mais resistência que o normal', 'the way you come across meets more resistance than usual', 'la forma en que apareces encuentra mas resistencia que lo normal', 'il modo in cui ti presenti incontra piu resistenza del solito'),
    facil: E('o jeito como você aparece abre caminho com mais facilidade', 'the way you come across opens doors more easily', 'la forma en que apareces abre camino con mas facilidad', 'il modo in cui ti presenti apre strada piu facilmente'),
    misto: E('a sua presença abre portas com uns e incomoda outros', 'your presence opens doors with some and grates on others', 'tu presencia abre puertas con unos y incomoda a otros', 'la tua presenza apre porte con alcuni e infastidisce altri'),
    detalhe: {
      tenso: E('Quem recebe você lê com mais rispidez do que pretendia, e explicar-se resolve menos do que mudar o tom.', 'People read you harsher than you meant, and explaining yourself helps less than changing your tone.', 'Quien te recibe lee con mas aspereza de la que pretendias, y explicarte resuelve menos que cambiar el tono.', 'Chi ti riceve legge piu ruvido di quanto volevi, e spiegarti risolve meno che cambiare il tono.'),
      facil: E('Você é recebido antes de precisar argumentar — vale para entrevista, primeira conversa e pedido difícil.', 'People receive you before you need to argue — good for an interview, a first conversation, a hard ask.', 'Te reciben antes de que necesites argumentar: vale para entrevista, primera conversacion y peticion dificil.', 'Ti accolgono prima che tu debba argomentare: vale per un colloquio, un primo incontro, una richiesta difficile.'),
      misto: E('O mesmo jeito que conquista uma parte das pessoas irrita a outra; não é desajuste seu, é a plateia que está dividida.', 'The same manner that wins some people over irritates the rest; it is not you being off, it is a split audience.', 'La misma forma que conquista a unas personas irrita a otras; no es desajuste tuyo, es el publico que esta dividido.', 'Lo stesso modo che conquista una parte delle persone irrita l altra; non sei tu fuori registro, e il pubblico diviso.'),
    },
  },
  northnode: {
    nome: E('a sua direção', 'your direction', 'tu direccion', 'la tua direzione'),
    tenso: E('o rumo fica menos nítido que o normal', 'the path gets less clear than usual', 'el rumbo queda menos nitido que lo normal', 'la rotta risulta meno nitida del solito'),
    facil: E('o rumo fica mais nítido que o normal', 'the path gets clearer than usual', 'el rumbo queda mas nitido que lo normal', 'la rotta risulta piu nitida del solito'),
    misto: E('o rumo clareia num ponto e confunde em outro', 'the path clears at one point and confuses at another', 'el rumbo se aclara en un punto y confunde en otro', 'la rotta si chiarisce in un punto e confonde in un altro'),
    detalhe: {
      tenso: E('O rumo some de vista e a pergunta "para onde isso vai" fica sem resposta; não é dia de decidir o longo prazo.', 'The path drops out of sight and the question "where is this going" has no answer; not a day to settle the long term.', 'El rumbo se pierde de vista y la pregunta "a donde va esto" queda sin respuesta; no es dia de decidir el largo plazo.', 'La rotta sparisce dalla vista e la domanda "dove sta andando" resta senza risposta; non e giorno per decidere il lungo termine.'),
      facil: E('Fica mais fácil perceber qual passo pertence ao caminho e qual é só distração.', 'It gets easier to tell which step belongs to the path and which is just distraction.', 'Resulta mas facil percibir que paso pertenece al camino y cual es solo distraccion.', 'Diventa piu facile capire quale passo appartiene al percorso e quale e solo distrazione.'),
      misto: E('Uma parte do caminho aparece nítida enquanto o resto embaça — siga o trecho visível, sem exigir o mapa inteiro.', 'Part of the path shows clearly while the rest blurs — follow the visible stretch without demanding the whole map.', 'Una parte del camino aparece nitida mientras el resto se difumina: sigue el tramo visible sin exigir el mapa entero.', 'Una parte del percorso appare nitida mentre il resto sfuma: segui il tratto visibile senza pretendere tutta la mappa.'),
    },
  },
  // ⚠️ DSC e IC faltavam, e o motor os EMITE: no dado de produção de 13/10, 3
  // dos 6 usuários tinham trânsito a IC e 3 a DSC. Sem entrada aqui,
  // `efeitoNoPonto` devolvia null e `sinteseDoDia` fazia `continue` — a frase
  // sumia do "Seu dia" sem deixar rastro. (No WhatsApp era pior: saía "Hoje
  // Mercúrio pressiona DSC", com a sigla crua e sem leitura.)
  //
  // Os quatro ângulos são dois EIXOS: quem mexe no Ascendente mexe no
  // Descendente, e quem mexe no Meio do Céu mexe no Fundo do Céu. Cada ponta
  // tem leitura própria porque o que a pessoa sente é diferente — a presença
  // dela x o encontro com o outro; o que aparece x o que sustenta.
  descendente: {
    nome: E('as suas relações', 'your relationships', 'tus relaciones', 'le tue relazioni'),
    tenso: E('lidar com o outro exige mais do que o normal', 'dealing with other people takes more than usual', 'tratar con el otro exige mas que lo normal', 'avere a che fare con l altro chiede piu del solito'),
    facil: E('o encontro com o outro acontece com menos esforço', 'meeting other people happens with less effort', 'el encuentro con el otro sucede con menos esfuerzo', 'l incontro con l altro avviene con meno sforzo'),
    misto: E('uma relação acolhe enquanto outra cobra', 'one relationship welcomes while another demands', 'una relacion acoge mientras otra cobra', 'una relazione accoglie mentre un altra chiede'),
    detalhe: {
      tenso: E('O outro ocupa mais espaço do que você gostaria, e ceder ou bater de frente custam o mesmo; combinar o limite custa menos.', 'The other person takes more room than you would like, and giving in or pushing back cost the same; naming the limit costs less.', 'El otro ocupa mas espacio del que quisieras, y ceder o chocar de frente cuestan lo mismo; acordar el limite cuesta menos.', 'L altro occupa piu spazio di quanto vorresti, e cedere o opporsi costano uguale; concordare il limite costa meno.'),
      facil: E('O encontro rende: conversa, acordo e pedido chegam mais longe acompanhados do que sozinhos.', 'Meeting people pays off: a talk, a deal, a request go further with company than alone.', 'El encuentro rinde: conversacion, acuerdo y peticion llegan mas lejos acompanados que solos.', 'L incontro rende: una conversazione, un accordo, una richiesta arrivano piu lontano in compagnia che da soli.'),
      misto: E('Uma pessoa dá apoio e outra apresenta a conta no mesmo dia; a tentação é tratar as duas igual, e cada uma pede coisa diferente.', 'One person gives support and another hands you the bill on the same day; the temptation is to treat them alike, and each asks something different.', 'Una persona da apoyo y otra presenta la cuenta el mismo dia; la tentacion es tratarlas igual, y cada una pide algo distinto.', 'Una persona da sostegno e un altra presenta il conto lo stesso giorno; la tentazione e trattarle uguale, e ognuna chiede una cosa diversa.'),
    },
  },
  fundo_do_ceu: {
    nome: E('a sua base', 'your foundation', 'tu base', 'la tua base'),
    tenso: E('o lado de casa e das raízes pesa mais que o normal', 'home and roots weigh more than usual', 'el lado de casa y de las raices pesa mas que lo normal', 'il lato di casa e delle radici pesa piu del solito'),
    facil: E('a vida em casa dá mais sustentação que de costume', 'life at home gives more support than usual', 'la vida en casa da mas sustento que de costumbre', 'la vita in casa da piu sostegno del solito'),
    misto: E('a base sustenta de um lado e cobra do outro', 'the foundation holds on one side and demands on the other', 'la base sostiene de un lado y cobra del otro', 'la base sostiene da un lato e chiede dall altro'),
    detalhe: {
      tenso: E('Casa, família e o assunto antigo que mora aí pesam mais e roubam energia do resto do dia.', 'Home, family and the old matter that lives there weigh more and drain the rest of the day.', 'Casa, familia y el asunto viejo que vive ahi pesan mas y roban energia al resto del dia.', 'Casa, famiglia e la vecchia questione che abita li pesano di piu e rubano energia al resto della giornata.'),
      facil: E('Ficar em casa devolve descanso em vez de consumir — bom dia para resolver o doméstico e para não sair.', 'Staying in gives rest back instead of taking it — a good day to sort the domestic things and to skip going out.', 'Quedarse en casa devuelve descanso en vez de consumir: buen dia para resolver lo domestico y para no salir.', 'Restare a casa restituisce riposo invece di consumarlo: buona giornata per sistemare il domestico e per non uscire.'),
      misto: E('O mesmo lugar que apoia é o que cobra presença; o descanso existe, mas vem com tarefa junto.', 'The same place that supports you is the one asking you to show up; the rest is there, but it comes with chores attached.', 'El mismo lugar que apoya es el que cobra presencia; el descanso existe, pero viene con tarea incluida.', 'Lo stesso posto che ti sostiene e quello che chiede presenza; il riposo c e, ma arriva con dei compiti.'),
    },
  },
}

const chave = (alvo: string): string =>
  String(alvo || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/g, '')

/** Aceita as grafias que chegam do motor e do catálogo. */
const ALIAS: Record<string, string> = {
  meiodoceu: 'meio_do_ceu', midheaven: 'meio_do_ceu', mc: 'meio_do_ceu',
  ascendant: 'ascendente', asc: 'ascendente',
  nodonorte: 'northnode', northnode: 'northnode', nortenode: 'northnode',
  // O motor emite as siglas: no dado de produção vieram como 'DSC' e 'IC'.
  dsc: 'descendente', descendant: 'descendente', descendente: 'descendente',
  ic: 'fundo_do_ceu', imumcoeli: 'fundo_do_ceu', fundodoceu: 'fundo_do_ceu', fondocielo: 'fundo_do_ceu',
}

function achar(alvo: string): EfeitoDoPonto | null {
  const k = chave(alvo)
  return PONTOS[ALIAS[k] || k] || null
}

/** "a sua imaginação" — como o ponto entra numa frase. */
export function nomeDoPonto(alvo: string, idioma: AppLanguage = 'pt-BR'): string | null {
  return achar(alvo)?.nome[idioma] || null
}

/**
 * O efeito concreto, no presente.
 *
 * `natureza` vem do aspecto: tenso pressiona, harmônico facilita. A conjunção
 * não tem natureza própria — quem decide é o planeta que transita, e isso é
 * resolvido antes de chegar aqui.
 */
/**
 * A SEGUNDA LINHA — como o efeito aparece no dia, e o que fazer com isso.
 *
 * ⚠️ Devolve `null` quando o ponto nao tem texto, e quem chama tem de aceitar
 * isso sem sumir com a frase inteira: a manchete sozinha continua valendo. Foi
 * o `if (!efeitoBruto) continue` que ja fez uma frase inteira desaparecer da
 * tela sem deixar rastro quando faltou um alvo.
 */
export function detalheDoPonto(
  alvo: string,
  natureza: 'tenso' | 'facil' | 'misto',
  idioma: AppLanguage = 'pt-BR',
): string | null {
  const p = achar(alvo)
  if (!p?.detalhe) return null
  return p.detalhe[natureza]?.[idioma] || null
}

export function efeitoNoPonto(
  alvo: string,
  natureza: 'tenso' | 'facil' | 'misto',
  idioma: AppLanguage = 'pt-BR',
): string | null {
  const p = achar(alvo)
  if (!p) return null
  const par = natureza === 'tenso' ? p.tenso : natureza === 'facil' ? p.facil : p.misto
  return par[idioma] || null
}
