import type { Unidade } from './tipos'

/**
 * OS CINCO ÂNGULOS, um verbete cada.
 *
 * ⚠️ EXISTEM PARA DAR DESTINO AO "VER A FUNDO". O glossário tem `conjuncao`,
 * `quadratura` e os outros desde sempre, e tocar neles não levava a lugar
 * nenhum — a lição 7 declara esses termos, mas lição serve à busca, e o
 * aprofundamento de um termo é sempre um verbete.
 *
 * ⚠️ CADA UM MOSTRA O CÍRCULO INTEIRO com o seu ângulo aceso. Ver 90° aceso
 * entre o sextil e o trígono ensina que a quadratura fica na metade do
 * caminho; desenhado sozinho, o ângulo perderia a escala.
 */
export const VERBETES_ASPECTOS: Unidade[] = [
  {
    id: 'aspecto-conjuncao',
    tipo: 'verbete',
    categoria: 'aspecto',
    titulo: {
      'pt-BR': 'Conjunção',
      'en-US': 'Conjunction',
      'es-ES': 'Conjuncion',
      'it-IT': 'Congiunzione',
    },
    resumo: {
      'pt-BR': '0°: os dois no mesmo ponto. Viram uma coisa só.',
      'en-US': '0°: both at the same point. They become one thing.',
      'es-ES': '0°: los dos en el mismo punto. Se vuelven una sola cosa.',
      'it-IT': '0°: i due nello stesso punto. Diventano una cosa sola.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'angulos-dos-aspectos',
      foco: 'conjuncao',
      descricao: {
        'pt-BR': 'O circulo dos angulos com o de 0 graus aceso e os demais apagados, para mostrar onde ele cai entre os outros.',
        'en-US': 'The circle of angles with the 0-degree one lit and the others dimmed, to show where it falls among them.',
        'es-ES': 'El circulo de los angulos con el de 0 grados encendido y los demas apagados, para mostrar donde cae entre ellos.',
        'it-IT': 'Il cerchio degli angoli con quello di 0 gradi acceso e gli altri spenti, per mostrare dove cade tra loro.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Dois planetas colados no mesmo grau não conversam — eles se fundem. O assunto de um passa a vir sempre junto com o do outro, e fica difícil separar onde termina um. É o aspecto mais forte de todos, e o único cujo tom depende inteiramente de QUAIS planetas são.',
        'en-US': 'Two planets glued at the same degree do not converse — they merge. The subject of one always arrives with the other, and it gets hard to tell where one ends. It is the strongest aspect of all, and the only one whose tone depends entirely on WHICH planets they are.',
        'es-ES': 'Dos planetas pegados en el mismo grado no conversan: se funden. El asunto de uno pasa a venir siempre con el del otro, y cuesta separar donde termina uno. Es el aspecto mas fuerte de todos, y el unico cuyo tono depende enteramente de CUALES planetas son.',
        'it-IT': 'Due pianeti incollati allo stesso grado non conversano: si fondono. L argomento di uno arriva sempre con quello dell altro, e diventa difficile separare dove finisce uno. E l aspetto piu forte di tutti, e l unico il cui tono dipende interamente da QUALI pianeti siano.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'Vênus com Júpiter é generosidade. Marte com Saturno é freio no impulso. O ângulo é o mesmo; o resultado, nada parecido.',
        'en-US': 'Venus with Jupiter is generosity. Mars with Saturn is a brake on impulse. The angle is the same; the result, nothing alike.',
        'es-ES': 'Venus con Jupiter es generosidad. Marte con Saturno es freno al impulso. El angulo es el mismo; el resultado, nada parecido.',
        'it-IT': 'Venere con Giove e generosita. Marte con Saturno e freno all impulso. L angolo e lo stesso; il risultato, per nulla simile.',
      },
    }],
    termos: ['conjuncao'],
    verTambem: ['licao-07-aspecto-conversa', 'conceito-orbe'],
    minutos: 1,
  },
  {
    id: 'aspecto-sextil',
    tipo: 'verbete',
    categoria: 'aspecto',
    titulo: {
      'pt-BR': 'Sextil',
      'en-US': 'Sextile',
      'es-ES': 'Sextil',
      'it-IT': 'Sestile',
    },
    resumo: {
      'pt-BR': '60°: colaboram, se você der o primeiro passo.',
      'en-US': '60°: they cooperate, if you take the first step.',
      'es-ES': '60°: colaboran, si das el primer paso.',
      'it-IT': '60°: collaborano, se fai il primo passo.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'angulos-dos-aspectos',
      foco: 'sextil',
      descricao: {
        'pt-BR': 'O circulo dos angulos com o de 60 graus aceso e os demais apagados, para mostrar onde ele cai entre os outros.',
        'en-US': 'The circle of angles with the 60-degree one lit and the others dimmed, to show where it falls among them.',
        'es-ES': 'El circulo de los angulos con el de 60 grados encendido y los demas apagados, para mostrar donde cae entre ellos.',
        'it-IT': 'Il cerchio degli angoli con quello di 60 gradi acceso e gli altri spenti, per mostrare dove cade tra loro.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Sessenta graus é um encaixe que funciona, mas não sozinho. O sextil oferece uma facilidade que só aparece quando alguém a usa — é talento disponível, não talento em uso. Por isso passa despercebido com mais frequência que qualquer outro aspecto.',
        'en-US': 'Sixty degrees is a fit that works, but not on its own. The sextile offers an ease that only shows when someone uses it — it is talent available, not talent in use. That is why it goes unnoticed more often than any other aspect.',
        'es-ES': 'Sesenta grados es un encaje que funciona, pero no solo. El sextil ofrece una facilidad que solo aparece cuando alguien la usa: es talento disponible, no talento en uso. Por eso pasa desapercibido mas que cualquier otro aspecto.',
        'it-IT': 'Sessanta gradi e un incastro che funziona, ma non da solo. Il sestile offre una facilita che appare solo quando qualcuno la usa: e talento disponibile, non talento in uso. Per questo passa inosservato piu di ogni altro aspetto.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'A porta está aberta. Ela não te empurra para dentro.',
        'en-US': 'The door is open. It does not push you through.',
        'es-ES': 'La puerta esta abierta. No te empuja adentro.',
        'it-IT': 'La porta e aperta. Non ti spinge dentro.',
      },
    }],
    termos: ['sextil'],
    verTambem: ['licao-07-aspecto-conversa', 'conceito-orbe'],
    minutos: 1,
  },
  {
    id: 'aspecto-quadratura',
    tipo: 'verbete',
    categoria: 'aspecto',
    titulo: {
      'pt-BR': 'Quadratura',
      'en-US': 'Square',
      'es-ES': 'Cuadratura',
      'it-IT': 'Quadrato',
    },
    resumo: {
      'pt-BR': '90°: atrito que obriga a resolver.',
      'en-US': '90°: friction that forces a solution.',
      'es-ES': '90°: roce que obliga a resolver.',
      'it-IT': '90°: attrito che obbliga a risolvere.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'angulos-dos-aspectos',
      foco: 'quadratura',
      descricao: {
        'pt-BR': 'O circulo dos angulos com o de 90 graus aceso e os demais apagados, para mostrar onde ele cai entre os outros.',
        'en-US': 'The circle of angles with the 90-degree one lit and the others dimmed, to show where it falls among them.',
        'es-ES': 'El circulo de los angulos con el de 90 grados encendido y los demas apagados, para mostrar donde cae entre ellos.',
        'it-IT': 'Il cerchio degli angoli con quello di 90 gradi acceso e gli altri spenti, per mostrare dove cade tra loro.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Noventa graus é tensão de ângulo reto: dois planetas querendo coisas diferentes ao mesmo tempo, sem acordo possível. Dói, e é o aspecto que mais produz — porque o desconforto não deixa a pessoa parada. Quase toda obra feita tem uma quadratura embaixo.',
        'en-US': 'Ninety degrees is right-angle tension: two planets wanting different things at once, with no possible deal. It hurts, and it is the aspect that produces most — because discomfort does not let a person stay put. Almost every work made has a square underneath.',
        'es-ES': 'Noventa grados es tension de angulo recto: dos planetas queriendo cosas distintas al mismo tiempo, sin acuerdo posible. Duele, y es el aspecto que mas produce, porque la incomodidad no deja a la persona quieta. Casi toda obra hecha tiene una cuadratura debajo.',
        'it-IT': 'Novanta gradi e tensione ad angolo retto: due pianeti che vogliono cose diverse allo stesso tempo, senza accordo possibile. Fa male, ed e l aspetto che produce di piu, perche il disagio non lascia fermi. Quasi ogni opera fatta ha un quadrato sotto.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'A quadratura não é um defeito do mapa. É o lugar onde a vida pede movimento.',
        'en-US': 'The square is not a flaw in the chart. It is where life asks for movement.',
        'es-ES': 'La cuadratura no es un defecto de la carta. Es donde la vida pide movimiento.',
        'it-IT': 'Il quadrato non e un difetto della carta. E dove la vita chiede movimento.',
      },
    }, {
      tipo: 'cuidado',
      texto: {
        'pt-BR': 'Esta tela mostra quadratura o tempo todo, e é a confusão mais cara de quem começa ler isso como ameaça. Ver a lição 7.',
        'en-US': 'This app shows squares constantly, and the costliest beginner mistake is reading that as a threat. See lesson 7.',
        'es-ES': 'Esta pantalla muestra cuadraturas todo el tiempo, y la confusion mas cara de quien empieza es leer eso como amenaza. Ver la leccion 7.',
        'it-IT': 'Questa schermata mostra quadrati di continuo, e la confusione piu costosa di chi inizia e leggerlo come minaccia. Vedi la lezione 7.',
      },
    }],
    termos: ['quadratura'],
    verTambem: ['licao-07-aspecto-conversa', 'conceito-orbe'],
    minutos: 1,
  },
  {
    id: 'aspecto-trigono',
    tipo: 'verbete',
    categoria: 'aspecto',
    titulo: {
      'pt-BR': 'Trígono',
      'en-US': 'Trine',
      'es-ES': 'Trigono',
      'it-IT': 'Trigono',
    },
    resumo: {
      'pt-BR': '120°: flui tão bem que você nem nota.',
      'en-US': '120°: it flows so well you barely notice.',
      'es-ES': '120°: fluye tan bien que ni lo notas.',
      'it-IT': '120°: scorre cosi bene che non te ne accorgi.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'angulos-dos-aspectos',
      foco: 'trigono',
      descricao: {
        'pt-BR': 'O circulo dos angulos com o de 120 graus aceso e os demais apagados, para mostrar onde ele cai entre os outros.',
        'en-US': 'The circle of angles with the 120-degree one lit and the others dimmed, to show where it falls among them.',
        'es-ES': 'El circulo de los angulos con el de 120 grados encendido y los demas apagados, para mostrar donde cae entre ellos.',
        'it-IT': 'Il cerchio degli angoli con quello di 120 gradi acceso e gli altri spenti, per mostrare dove cade tra loro.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Cento e vinte graus é o encaixe mais confortável que existe: os dois planetas querem a mesma coisa e se ajudam sem esforço nenhum. O problema é exatamente esse — o que nunca custou, raramente se desenvolve. Talento de trígono costuma ser o que a pessoa menos trabalhou.',
        'en-US': 'A hundred and twenty degrees is the most comfortable fit there is: the two planets want the same thing and help each other with no effort at all. That is precisely the problem — what never cost anything rarely gets developed. Trine talent tends to be what a person worked on least.',
        'es-ES': 'Ciento veinte grados es el encaje mas comodo que existe: los dos planetas quieren lo mismo y se ayudan sin ningun esfuerzo. El problema es justo ese: lo que nunca costo rara vez se desarrolla. El talento de trigono suele ser lo que la persona menos trabajo.',
        'it-IT': 'Centoventi gradi e l incastro piu comodo che esista: i due pianeti vogliono la stessa cosa e si aiutano senza alcuno sforzo. Il problema e proprio questo: cio che non e mai costato raramente si sviluppa. Il talento da trigono tende a essere cio su cui la persona ha lavorato meno.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'O trígono dá de graça. Por isso é o talento que mais se desperdiça.',
        'en-US': 'The trine gives for free. That is why it is the most wasted talent.',
        'es-ES': 'El trigono da gratis. Por eso es el talento que mas se desperdicia.',
        'it-IT': 'Il trigono da gratis. Per questo e il talento piu sprecato.',
      },
    }],
    termos: ['trigono'],
    verTambem: ['licao-07-aspecto-conversa', 'conceito-orbe'],
    minutos: 1,
  },
  {
    id: 'aspecto-oposicao',
    tipo: 'verbete',
    categoria: 'aspecto',
    titulo: {
      'pt-BR': 'Oposição',
      'en-US': 'Opposition',
      'es-ES': 'Oposicion',
      'it-IT': 'Opposizione',
    },
    resumo: {
      'pt-BR': '180°: um de frente para o outro, puxando para lados contrários.',
      'en-US': '180°: face to face, pulling opposite ways.',
      'es-ES': '180°: uno enfrente del otro, tirando a lados contrarios.',
      'it-IT': '180°: uno di fronte all altro, tirando da parti opposte.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'angulos-dos-aspectos',
      foco: 'oposicao',
      descricao: {
        'pt-BR': 'O circulo dos angulos com o de 180 graus aceso e os demais apagados, para mostrar onde ele cai entre os outros.',
        'en-US': 'The circle of angles with the 180-degree one lit and the others dimmed, to show where it falls among them.',
        'es-ES': 'El circulo de los angulos con el de 180 grados encendido y los demas apagados, para mostrar donde cae entre ellos.',
        'it-IT': 'Il cerchio degli angoli con quello di 180 gradi acceso e gli altri spenti, per mostrare dove cade tra loro.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Cento e oitenta graus é o extremo da roda: os dois planetas se enxergam inteiros e puxam em direções opostas. Diferente da quadratura, aqui não há como ignorar — o conflito é explícito, e costuma aparecer através de OUTRAS pessoas, que encarnam o lado que você não assume.',
        'en-US': 'A hundred and eighty degrees is the extreme of the wheel: the two planets see each other whole and pull opposite ways. Unlike the square, there is no ignoring it here — the conflict is explicit, and it tends to show up through OTHER people, who embody the side you do not own.',
        'es-ES': 'Ciento ochenta grados es el extremo de la rueda: los dos planetas se ven enteros y tiran en direcciones opuestas. A diferencia de la cuadratura, aqui no hay como ignorarlo: el conflicto es explicito, y suele aparecer a traves de OTRAS personas, que encarnan el lado que no asumes.',
        'it-IT': 'Centottanta gradi e l estremo della ruota: i due pianeti si vedono interi e tirano in direzioni opposte. A differenza del quadrato, qui non si puo ignorare: il conflitto e esplicito, e tende a comparire attraverso ALTRE persone, che incarnano il lato che non assumi.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'O que você não reconhece em si costuma aparecer na pessoa à sua frente.',
        'en-US': 'What you do not recognise in yourself tends to show up in the person facing you.',
        'es-ES': 'Lo que no reconoces en ti suele aparecer en la persona frente a ti.',
        'it-IT': 'Cio che non riconosci in te tende a comparire nella persona davanti a te.',
      },
    }, {
      tipo: 'cuidado',
      texto: {
        'pt-BR': 'A saída não é escolher um lado. É achar o ponto em que os dois cabem.',
        'en-US': 'The way out is not picking a side. It is finding the point where both fit.',
        'es-ES': 'La salida no es elegir un lado. Es hallar el punto donde caben los dos.',
        'it-IT': 'La via d uscita non e scegliere un lato. E trovare il punto in cui entrambi stanno.',
      },
    }],
    termos: ['oposicao'],
    verTambem: ['licao-07-aspecto-conversa', 'conceito-orbe'],
    minutos: 1,
  },
]
