// Catálogo do RETORNO SOLAR: signo no Ascendente do RS = o "tom do ano".
// O Ascendente do Retorno Solar colore a atmosfera geral dos próximos doze meses:
// a postura, o clima e a lente pela qual a pessoa vive o ciclo.
// Chave normalizada: srasc:{signo}  (aries, touro, gemeos, cancer, leao, virgem,
// libra, escorpiao, sagitario, capricornio, aquario, peixes)
// Regras i18n: en-US sem "will" futuro; es-ES sem tildes; it-IT sem acentos.

export const SOLAR_RETURN_ASCENDANT_PTBR_OVERRIDES: Record<string, string> = {
  'srasc:aries':
    'Com Ascendente em Áries no Retorno Solar, o ano ganha um tom de iniciativa, coragem e começos. Há mais energia para agir por conta própria, abrir caminhos e afirmar a vontade. É um ciclo para tomar a frente, arriscar e viver com vigor — cuidando da impaciência.',
  'srasc:touro':
    'Com Ascendente em Touro no Retorno Solar, o ano se veste de estabilidade, prazer e construção paciente. Há um convite a desacelerar, valorizar o concreto e cuidar da segurança material e do corpo. É um ciclo para firmar bases sólidas e desfrutar do que traz conforto.',
  'srasc:gemeos':
    'Com Ascendente em Gêmeos no Retorno Solar, o ano fica curioso, comunicativo e versátil. Aprender, conversar, circular e conectar ideias tende a marcar o ritmo dos meses. É um ciclo para se abrir a novidades e à troca — cuidando para não se dispersar.',
  'srasc:cancer':
    'Com Ascendente em Câncer no Retorno Solar, o ano se torna mais sensível, acolhedor e voltado ao emocional. Lar, família e o cuidado com quem se ama ganham importância. É um ciclo para nutrir vínculos íntimos e honrar as próprias necessidades de proteção.',
  'srasc:leao':
    'Com Ascendente em Leão no Retorno Solar, o ano pede brilho, expressão e presença. Há impulso para se mostrar com autenticidade, criar e ocupar o palco da própria vida. É um ciclo para exercer a generosidade, a criatividade e o orgulho saudável de ser quem se é.',
  'srasc:virgem':
    'Com Ascendente em Virgem no Retorno Solar, o ano se organiza em torno do cuidado, do detalhe e do aprimoramento. Rotina, saúde e a qualidade do que se faz pedem atenção prática. É um ciclo para ajustar, servir e refinar — cuidando do excesso de crítica.',
  'srasc:libra':
    'Com Ascendente em Libra no Retorno Solar, o ano busca harmonia, beleza e relação. Parcerias, diplomacia e o equilíbrio com o outro ficam em primeiro plano. É um ciclo para cultivar acordos justos e cercar-se do que é agradável e estético.',
  'srasc:escorpiao':
    'Com Ascendente em Escorpião no Retorno Solar, o ano ganha intensidade, profundidade e poder de transformação. Há um mergulho no que é essencial, oculto ou verdadeiro, longe da superfície. É um ciclo para se renovar por dentro e usar a força para regenerar o que precisa mudar.',
  'srasc:sagitario':
    'Com Ascendente em Sagitário no Retorno Solar, o ano se abre à expansão, ao otimismo e à busca de sentido. Viagens, estudos e horizontes amplos convidam a crescer para fora do cotidiano. É um ciclo para aventurar-se, acreditar e ampliar a visão de mundo.',
  'srasc:capricornio':
    'Com Ascendente em Capricórnio no Retorno Solar, o ano pede seriedade, foco e construção de longo prazo. Responsabilidade, carreira e a disciplina para subir degraus ficam em evidência. É um ciclo para assumir o comando com maturidade e edificar algo duradouro.',
  'srasc:aquario':
    'Com Ascendente em Aquário no Retorno Solar, o ano ganha originalidade, liberdade e senso coletivo. Há impulso para inovar, romper padrões e se conectar a grupos e causas. É um ciclo para pensar diferente, colaborar e afirmar a própria autenticidade.',
  'srasc:peixes':
    'Com Ascendente em Peixes no Retorno Solar, o ano se torna mais sensível, intuitivo e espiritual. Sonho, compaixão e uma abertura ao invisível permeiam o clima dos meses. É um ciclo para se entregar ao fluxo, criar e cuidar da alma — mantendo alguns limites.',
}

export const SOLAR_RETURN_ASCENDANT_I18N_OVERRIDES: Record<string, Record<string, string>> = {
  'en-US': {
    'srasc:aries':
      'With an Aries Ascendant in the Solar Return, the year takes on a tone of initiative, courage and beginnings. There is more energy to act on your own, open paths and assert your will. It is a cycle to take the lead, take risks and live with vigor — while tempering impatience.',
    'srasc:touro':
      'With a Taurus Ascendant in the Solar Return, the year dresses itself in stability, pleasure and patient building. There is an invitation to slow down, value the concrete and tend to material security and the body. It is a cycle to firm up solid ground and enjoy what brings comfort.',
    'srasc:gemeos':
      'With a Gemini Ascendant in the Solar Return, the year turns curious, communicative and versatile. Learning, talking, circulating and connecting ideas tend to set the pace of the months. It is a cycle to open to novelty and exchange — while taking care not to scatter.',
    'srasc:cancer':
      'With a Cancer Ascendant in the Solar Return, the year becomes more sensitive, nurturing and emotionally attuned. Home, family and care for those you love gain importance. It is a cycle to nourish intimate bonds and honor your own needs for protection.',
    'srasc:leao':
      'With a Leo Ascendant in the Solar Return, the year asks for shine, expression and presence. There is an urge to show yourself with authenticity, create and take the stage of your own life. It is a cycle to exercise generosity, creativity and a healthy pride in being who you are.',
    'srasc:virgem':
      'With a Virgo Ascendant in the Solar Return, the year organizes around care, detail and refinement. Routine, health and the quality of what you do ask for practical attention. It is a cycle to adjust, serve and refine — while easing off excess self-criticism.',
    'srasc:libra':
      'With a Libra Ascendant in the Solar Return, the year seeks harmony, beauty and relationship. Partnerships, diplomacy and balance with the other come to the foreground. It is a cycle to cultivate fair agreements and surround yourself with what is pleasant and aesthetic.',
    'srasc:escorpiao':
      'With a Scorpio Ascendant in the Solar Return, the year gains intensity, depth and transformative power. There is a dive into what is essential, hidden or true, far from the surface. It is a cycle to renew yourself within and use strength to regenerate what needs to change.',
    'srasc:sagitario':
      'With a Sagittarius Ascendant in the Solar Return, the year opens to expansion, optimism and the search for meaning. Travel, study and wide horizons invite you to grow beyond the everyday. It is a cycle to venture out, believe and broaden your worldview.',
    'srasc:capricornio':
      'With a Capricorn Ascendant in the Solar Return, the year asks for seriousness, focus and long-term building. Responsibility, career and the discipline to climb steps stand out. It is a cycle to take command with maturity and build something lasting.',
    'srasc:aquario':
      'With an Aquarius Ascendant in the Solar Return, the year gains originality, freedom and a collective sense. There is an urge to innovate, break patterns and connect with groups and causes. It is a cycle to think differently, collaborate and assert your own authenticity.',
    'srasc:peixes':
      'With a Pisces Ascendant in the Solar Return, the year becomes more sensitive, intuitive and spiritual. Dream, compassion and an openness to the invisible pervade the mood of the months. It is a cycle to surrender to the flow, create and tend the soul — while keeping some boundaries.',
  },
  'es-ES': {
    'srasc:aries':
      'Con Ascendente en Aries en el Retorno Solar, el ano toma un tono de iniciativa, coraje y comienzos. Hay mas energia para actuar por cuenta propia, abrir caminos y afirmar la voluntad. Es un ciclo para tomar la delantera, arriesgar y vivir con vigor, moderando la impaciencia.',
    'srasc:touro':
      'Con Ascendente en Tauro en el Retorno Solar, el ano se viste de estabilidad, placer y construccion paciente. Hay una invitacion a desacelerar, valorar lo concreto y cuidar la seguridad material y el cuerpo. Es un ciclo para afirmar bases solidas y disfrutar de lo que trae confort.',
    'srasc:gemeos':
      'Con Ascendente en Geminis en el Retorno Solar, el ano se vuelve curioso, comunicativo y versatil. Aprender, conversar, circular y conectar ideas tiende a marcar el ritmo de los meses. Es un ciclo para abrirte a novedades y al intercambio, cuidando de no dispersarte.',
    'srasc:cancer':
      'Con Ascendente en Cancer en el Retorno Solar, el ano se vuelve mas sensible, acogedor y volcado a lo emocional. Hogar, familia y el cuidado de quien amas ganan importancia. Es un ciclo para nutrir vinculos intimos y honrar tus propias necesidades de proteccion.',
    'srasc:leao':
      'Con Ascendente en Leo en el Retorno Solar, el ano pide brillo, expresion y presencia. Hay impulso para mostrarte con autenticidad, crear y ocupar el escenario de tu propia vida. Es un ciclo para ejercer la generosidad, la creatividad y el orgullo sano de ser quien eres.',
    'srasc:virgem':
      'Con Ascendente en Virgo en el Retorno Solar, el ano se organiza en torno al cuidado, el detalle y el perfeccionamiento. Rutina, salud y la calidad de lo que haces piden atencion practica. Es un ciclo para ajustar, servir y refinar, cuidando el exceso de critica.',
    'srasc:libra':
      'Con Ascendente en Libra en el Retorno Solar, el ano busca armonia, belleza y relacion. Las relaciones, la diplomacia y el equilibrio con el otro pasan a primer plano. Es un ciclo para cultivar acuerdos justos y rodearte de lo que es agradable y estetico.',
    'srasc:escorpiao':
      'Con Ascendente en Escorpio en el Retorno Solar, el ano gana intensidad, profundidad y poder de transformacion. Hay una inmersion en lo esencial, lo oculto o lo verdadero, lejos de la superficie. Es un ciclo para renovarte por dentro y usar la fuerza para regenerar lo que debe cambiar.',
    'srasc:sagitario':
      'Con Ascendente en Sagitario en el Retorno Solar, el ano se abre a la expansion, el optimismo y la busqueda de sentido. Viajes, estudios y horizontes amplios invitan a crecer mas alla de lo cotidiano. Es un ciclo para aventurarte, creer y ampliar la vision del mundo.',
    'srasc:capricornio':
      'Con Ascendente en Capricornio en el Retorno Solar, el ano pide seriedad, foco y construccion de largo plazo. Responsabilidad, carrera y la disciplina para subir peldanos quedan en evidencia. Es un ciclo para asumir el mando con madurez y edificar algo duradero.',
    'srasc:aquario':
      'Con Ascendente en Acuario en el Retorno Solar, el ano gana originalidad, libertad y sentido colectivo. Hay impulso para innovar, romper patrones y conectarte con grupos y causas. Es un ciclo para pensar distinto, colaborar y afirmar tu propia autenticidad.',
    'srasc:peixes':
      'Con Ascendente en Piscis en el Retorno Solar, el ano se vuelve mas sensible, intuitivo y espiritual. Sueno, compasion y una apertura a lo invisible impregnan el clima de los meses. Es un ciclo para entregarte al flujo, crear y cuidar el alma, manteniendo algunos limites.',
  },
  'it-IT': {
    'srasc:aries':
      'Con Ascendente in Ariete nel Ritorno Solare, l anno prende un tono di iniziativa, coraggio e inizi. C e piu energia per agire in proprio, aprire strade e affermare la volonta. E un ciclo per prendere il comando, rischiare e vivere con vigore, temperando l impazienza.',
    'srasc:touro':
      'Con Ascendente in Toro nel Ritorno Solare, l anno si veste di stabilita, piacere e costruzione paziente. C e un invito a rallentare, valorizzare il concreto e curare la sicurezza materiale e il corpo. E un ciclo per consolidare basi solide e godere di cio che porta conforto.',
    'srasc:gemeos':
      'Con Ascendente in Gemelli nel Ritorno Solare, l anno diventa curioso, comunicativo e versatile. Imparare, conversare, circolare e connettere idee tende a dettare il ritmo dei mesi. E un ciclo per aprirti alle novita e allo scambio, badando a non disperderti.',
    'srasc:cancer':
      'Con Ascendente in Cancro nel Ritorno Solare, l anno diventa piu sensibile, accogliente e rivolto all emotivo. Casa, famiglia e la cura di chi ami guadagnano importanza. E un ciclo per nutrire legami intimi e onorare i tuoi bisogni di protezione.',
    'srasc:leao':
      'Con Ascendente in Leone nel Ritorno Solare, l anno chiede brillare, espressione e presenza. C e slancio a mostrarti con autenticita, creare e occupare il palco della tua vita. E un ciclo per esercitare generosita, creativita e un sano orgoglio di essere chi sei.',
    'srasc:virgem':
      'Con Ascendente in Vergine nel Ritorno Solare, l anno si organizza intorno alla cura, al dettaglio e al perfezionamento. Routine, salute e la qualita di cio che fai chiedono attenzione pratica. E un ciclo per aggiustare, servire e affinare, moderando l eccesso di critica.',
    'srasc:libra':
      'Con Ascendente in Bilancia nel Ritorno Solare, l anno cerca armonia, bellezza e relazione. Le relazioni, la diplomazia e l equilibrio con l altro passano in primo piano. E un ciclo per coltivare accordi giusti e circondarti di cio che e piacevole ed estetico.',
    'srasc:escorpiao':
      'Con Ascendente in Scorpione nel Ritorno Solare, l anno guadagna intensita, profondita e potere di trasformazione. C e un immersione in cio che e essenziale, nascosto o vero, lontano dalla superficie. E un ciclo per rinnovarti dentro e usare la forza per rigenerare cio che deve cambiare.',
    'srasc:sagitario':
      'Con Ascendente in Sagittario nel Ritorno Solare, l anno si apre all espansione, all ottimismo e alla ricerca di senso. Viaggi, studi e orizzonti ampi invitano a crescere oltre il quotidiano. E un ciclo per avventurarti, credere e ampliare la visione del mondo.',
    'srasc:capricornio':
      'Con Ascendente in Capricorno nel Ritorno Solare, l anno chiede serieta, concentrazione e costruzione a lungo termine. Responsabilita, carriera e la disciplina per salire gradini restano in evidenza. E un ciclo per assumere il comando con maturita ed edificare qualcosa di duraturo.',
    'srasc:aquario':
      'Con Ascendente in Acquario nel Ritorno Solare, l anno guadagna originalita, liberta e senso collettivo. C e slancio a innovare, rompere schemi e connetterti a gruppi e cause. E un ciclo per pensare in modo diverso, collaborare e affermare la tua autenticita.',
    'srasc:peixes':
      'Con Ascendente in Pesci nel Ritorno Solare, l anno diventa piu sensibile, intuitivo e spirituale. Sogno, compassione e un apertura all invisibile permeano il clima dei mesi. E un ciclo per abbandonarti al flusso, creare e curare l anima, mantenendo alcuni confini.',
  },
}
