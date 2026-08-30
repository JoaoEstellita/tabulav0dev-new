// Conteúdo do Guia de uso do app — organizado por aba, recurso a recurso.
// Consumido por AppGuideModal. Regras i18n: es-ES sem tildes, it-IT sem acentos,
// en-US sem "will". Mantém completo mas conciso (1-2 frases por recurso).

export type GuideLang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'
type L = Record<GuideLang, string>
const L = (pt: string, en: string, es: string, it: string): L => ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it })

export type GuideEntry = { icon: string; title: L; body: L }
export type GuideTab = { key: string; icon: string; label: L; intro: L; entries: GuideEntry[] }

export const APP_GUIDE: GuideTab[] = [
  {
    key: 'perfil',
    icon: 'person',
    label: L('Perfil', 'Profile', 'Perfil', 'Profilo'),
    intro: L(
      'Sua tela inicial: o céu de hoje aplicado à sua vida.',
      'Your home screen: today\'s sky applied to your life.',
      'Tu pantalla inicial: el cielo de hoy aplicado a tu vida.',
      'La tua schermata iniziale: il cielo di oggi applicato alla tua vita.'),
    entries: [
      {
        icon: 'happy-outline',
        title: L('Cabeçalho e foto', 'Header and photo', 'Encabezado y foto', 'Intestazione e foto'),
        body: L(
          'No topo aparecem seu Sol, Lua e Ascendente. Toque na foto para trocá-la.',
          'The top shows your Sun, Moon and Ascendant. Tap the photo to change it.',
          'Arriba aparecen tu Sol, Luna y Ascendente. Toca la foto para cambiarla.',
          'In alto vedi Sole, Luna e Ascendente. Tocca la foto per cambiarla.'),
      },
      {
        icon: 'grid-outline',
        title: L('8 Áreas da vida', '8 Life areas', '8 Areas de la vida', '8 Aree della vita'),
        body: L(
          'Cada card mostra como o céu de hoje mexe numa parte da sua vida. Toque para abrir a leitura completa.',
          'Each card shows how today\'s sky affects one part of your life. Tap to open the full reading.',
          'Cada tarjeta muestra como el cielo de hoy afecta una parte de tu vida. Toca para abrir la lectura completa.',
          'Ogni card mostra come il cielo di oggi tocca una parte della tua vita. Tocca per la lettura completa.'),
      },
      {
        icon: 'planet-outline',
        title: L('Céu de hoje (roda)', 'Today\'s sky (wheel)', 'Cielo de hoy (rueda)', 'Cielo di oggi (ruota)'),
        body: L(
          'A roda cruza seu mapa natal com os trânsitos de agora. Toque num aspecto para entender o que ele ativa.',
          'The wheel overlays your natal chart with current transits. Tap an aspect to see what it activates.',
          'La rueda cruza tu carta natal con los transitos de ahora. Toca un aspecto para ver que activa.',
          'La ruota incrocia la tua carta natale con i transiti attuali. Tocca un aspetto per capire cosa attiva.'),
      },
      {
        icon: 'swap-vertical-outline',
        title: L('Comparação de trânsitos', 'Transit comparison', 'Comparacion de transitos', 'Confronto transiti'),
        body: L(
          'Planeta a planeta, mostra o que cada trânsito de hoje está ativando no seu mapa.',
          'Planet by planet, it shows what each of today\'s transits activates in your chart.',
          'Planeta a planeta, muestra que activa cada transito de hoy en tu carta.',
          'Pianeta per pianeta, mostra cosa attiva ogni transito di oggi nella tua carta.'),
      },
      {
        icon: 'notifications-outline',
        title: L('Notificações', 'Notifications', 'Notificaciones', 'Notifiche'),
        body: L(
          'Ative o banner para receber o status do dia no seu celular.',
          'Turn on the banner to get your daily status on your phone.',
          'Activa el banner para recibir el estado del dia en tu telefono.',
          'Attiva il banner per ricevere lo stato del giorno sul telefono.'),
      },
      {
        icon: 'logo-whatsapp',
        title: L('Astrólogo no WhatsApp', 'Astrologer on WhatsApp', 'Astrologo en WhatsApp', 'Astrologo su WhatsApp'),
        body: L(
          'Pelo banner você conversa com seu astrólogo por WhatsApp: tire dúvidas e peça leituras.',
          'Through the banner you chat with your astrologer on WhatsApp: ask questions and request readings.',
          'Por el banner hablas con tu astrologo en WhatsApp: preguntas y pides lecturas.',
          'Dal banner parli col tuo astrologo su WhatsApp: fai domande e chiedi letture.'),
      },
    ],
  },
  {
    key: 'mapa',
    icon: 'compass',
    label: L('Mapa', 'Chart', 'Mapa', 'Mappa'),
    intro: L(
      'Todos os seus mapas num lugar — alterne no seletor do topo.',
      'All your charts in one place — switch from the top selector.',
      'Todos tus mapas en un lugar — cambia en el selector de arriba.',
      'Tutte le tue mappe in un posto — cambia dal selettore in alto.'),
    entries: [
      {
        icon: 'globe-outline',
        title: L('Ocidental × Védico', 'Western vs Vedic', 'Occidental vs Vedico', 'Occidentale vs Vedico'),
        body: L(
          'Troque entre a astrologia ocidental e a védica (indiana) no topo da tela.',
          'Switch between Western and Vedic (Indian) astrology at the top of the screen.',
          'Cambia entre astrologia occidental y vedica (india) arriba en la pantalla.',
          'Passa tra astrologia occidentale e vedica (indiana) in cima allo schermo.'),
      },
      {
        icon: 'planet-outline',
        title: L('Mapa Natal', 'Natal Chart', 'Carta Natal', 'Carta Natale'),
        body: L(
          'Sua roda de nascimento: planetas, casas e aspectos. Toque em cada um para a interpretação.',
          'Your birth wheel: planets, houses and aspects. Tap any of them for the interpretation.',
          'Tu rueda de nacimiento: planetas, casas y aspectos. Toca cada uno para la interpretacion.',
          'La tua ruota di nascita: pianeti, case e aspetti. Tocca ognuno per l\'interpretazione.'),
      },
      {
        icon: 'sunny-outline',
        title: L('Trânsitos do dia', 'Daily transits', 'Transitos del dia', 'Transiti del giorno'),
        body: L(
          'A bi-roda dos trânsitos de agora sobre o seu natal, com a grade de aspectos. Toque numa célula para a leitura.',
          'The bi-wheel of current transits over your natal, with the aspect grid. Tap a cell for the reading.',
          'La bi-rueda de los transitos de ahora sobre tu natal, con la grilla de aspectos. Toca una celda para la lectura.',
          'La doppia ruota dei transiti attuali sul natale, con la griglia aspetti. Tocca una cella per la lettura.'),
      },
      {
        icon: 'star-outline',
        title: L('Retorno Solar', 'Solar Return', 'Retorno Solar', 'Ritorno Solare'),
        body: L(
          'O mapa do seu ano, a partir do aniversário. Recurso para assinantes.',
          'The chart of your year, from your birthday. A subscriber feature.',
          'El mapa de tu ano, desde el cumpleanos. Funcion para suscriptores.',
          'La mappa del tuo anno, dal compleanno. Funzione per abbonati.'),
      },
      {
        icon: 'moon-outline',
        title: L('Retorno Lunar', 'Lunar Return', 'Retorno Lunar', 'Ritorno Lunare'),
        body: L(
          'O mapa do mês, quando a Lua volta ao ponto de nascimento. Tema do ciclo mensal.',
          'The chart of the month, when the Moon returns to your birth point. The monthly cycle theme.',
          'El mapa del mes, cuando la Luna vuelve a tu punto de nacimiento. El tema del ciclo mensual.',
          'La mappa del mese, quando la Luna torna al punto di nascita. Il tema del ciclo mensile.'),
      },
      {
        icon: 'sparkles-outline',
        title: L('Pontos e sensíveis', 'Points and sensitives', 'Puntos y sensibles', 'Punti e sensibili'),
        body: L(
          'Lilith, nódulos lunares, Parte da Fortuna e os pontos angulares (Asc, MC, Dsc, IC) com seus significados.',
          'Lilith, lunar nodes, Part of Fortune and the angular points (Asc, MC, Dsc, IC) with their meanings.',
          'Lilith, nodos lunares, Parte de la Fortuna y los puntos angulares (Asc, MC, Dsc, IC) con sus significados.',
          'Lilith, nodi lunari, Parte della Fortuna e i punti angolari (Asc, MC, Dsc, IC) coi loro significati.'),
      },
    ],
  },
  {
    key: 'grupos',
    icon: 'people',
    label: L('Grupos', 'Groups', 'Grupos', 'Gruppi'),
    intro: L(
      'Reúna pessoas e veja como vocês combinam — sinastria e o dia de cada um.',
      'Gather people and see how you match — synastry and each person\'s day.',
      'Reune personas y ve como combinan — sinastria y el dia de cada uno.',
      'Riunisci persone e vedi come combinate — sinastria e la giornata di ognuno.'),
    entries: [
      {
        icon: 'albums-outline',
        title: L('Abas de grupos', 'Group tabs', 'Pestanas de grupos', 'Schede gruppi'),
        body: L(
          'A barra do topo lista seus grupos com o número de membros. Toque para trocar de grupo; role para ver mais.',
          'The top bar lists your groups with member counts. Tap to switch groups; scroll to see more.',
          'La barra de arriba lista tus grupos con el numero de miembros. Toca para cambiar; desliza para ver mas.',
          'La barra in alto elenca i tuoi gruppi col numero di membri. Tocca per cambiare; scorri per vederne altri.'),
      },
      {
        icon: 'add-circle-outline',
        title: L('Criar ou entrar', 'Create or join', 'Crear o entrar', 'Crea o entra'),
        body: L(
          'No "+" você cria um grupo novo ou entra em um por código de convite.',
          'Under "+" you create a new group or join one with an invite code.',
          'En el "+" creas un grupo nuevo o entras en uno con codigo de invitacion.',
          'Nel "+" crei un gruppo nuovo o entri con un codice di invito.'),
      },
      {
        icon: 'share-social-outline',
        title: L('Convidar pessoas', 'Invite people', 'Invitar personas', 'Invita persone'),
        body: L(
          'Compartilhe o convite do grupo. A pessoa entra com consentimento — ninguém é adicionado sem aceitar.',
          'Share the group invite. The person joins with consent — no one is added without accepting.',
          'Comparte la invitacion del grupo. La persona entra con consentimiento — nadie se agrega sin aceptar.',
          'Condividi l\'invito del gruppo. La persona entra col consenso — nessuno viene aggiunto senza accettare.'),
      },
      {
        icon: 'eye-outline',
        title: L('Perfil de monitoramento', 'Managed profile', 'Perfil de seguimiento', 'Profilo monitorato'),
        body: L(
          'Crie um perfil para acompanhar alguém que não tem o app (um parente, por exemplo) usando os dados de nascimento.',
          'Create a profile to follow someone who does not have the app (a relative, say) from their birth data.',
          'Crea un perfil para seguir a alguien que no tiene la app (un familiar) con sus datos de nacimiento.',
          'Crea un profilo per seguire chi non ha l\'app (un parente) dai suoi dati di nascita.'),
      },
      {
        icon: 'search-outline',
        title: L('Encontrar usuário', 'Find a user', 'Encontrar usuario', 'Trova utente'),
        body: L(
          'Busque pessoas do app pelo nome e peça amizade direto dali.',
          'Search app users by name and ask to be friends right there.',
          'Busca personas de la app por nombre y pide amistad ahi mismo.',
          'Cerca persone dell\'app per nome e chiedi amicizia da li.'),
      },
      {
        icon: 'pulse-outline',
        title: L('Status dos membros', 'Member status', 'Estado de los miembros', 'Stato dei membri'),
        body: L(
          'Veja o status do dia e as 8 áreas de cada membro que escolheu compartilhar.',
          'See the daily status and the 8 life areas of each member who chose to share.',
          'Ve el estado del dia y las 8 areas de cada miembro que decidio compartir.',
          'Vedi lo stato del giorno e le 8 aree di ogni membro che ha scelto di condividere.'),
      },
      {
        icon: 'git-compare-outline',
        title: L('Sinastria do grupo', 'Group synastry', 'Sinastria del grupo', 'Sinastria del gruppo'),
        body: L(
          'A matriz cruza todas as duplas e o "você × membro". Expanda para a roda de sinastria, a grade de aspectos, o % de afinidade e o Guna Milan (védico).',
          'The matrix crosses every pair and "you vs member". Expand for the synastry wheel, aspect grid, affinity % and Guna Milan (Vedic).',
          'La matriz cruza todas las parejas y "tu vs miembro". Expande para la rueda de sinastria, la grilla, el % de afinidad y el Guna Milan (vedico).',
          'La matrice incrocia tutte le coppie e "tu vs membro". Espandi per la ruota di sinastria, la griglia, il % di affinita e il Guna Milan (vedico).'),
      },
      {
        icon: 'planet-outline',
        title: L('Mapa completo do membro', 'Member full chart', 'Mapa completo del miembro', 'Mappa completa del membro'),
        body: L(
          'Em cada membro, "Ver mapa completo" abre a roda natal dele, só leitura.',
          'On each member, "View full chart" opens their natal wheel, read-only.',
          'En cada miembro, "Ver mapa completo" abre su rueda natal, solo lectura.',
          'Su ogni membro, "Vedi mappa completa" apre la sua ruota natale, sola lettura.'),
      },
      {
        icon: 'alert-circle-outline',
        title: L('Alertas do grupo', 'Group alerts', 'Alertas del grupo', 'Avvisi del gruppo'),
        body: L(
          'O grupo avisa quando alguém entra numa fase crítica ou muito favorável — pelo app e pelo WhatsApp.',
          'The group alerts you when someone enters a critical or very favorable phase — in the app and on WhatsApp.',
          'El grupo avisa cuando alguien entra en una fase critica o muy favorable — en la app y por WhatsApp.',
          'Il gruppo avvisa quando qualcuno entra in una fase critica o molto favorevole — nell\'app e su WhatsApp.'),
      },
    ],
  },
  {
    key: 'match',
    icon: 'heart',
    label: L('Match', 'Match', 'Match', 'Match'),
    intro: L(
      'Descubra com quem você combina — afinidade real por sinastria.',
      'Discover who you match with — real affinity from synastry.',
      'Descubre con quien combinas — afinidad real por sinastria.',
      'Scopri con chi combini — affinita reale dalla sinastria.'),
    entries: [
      {
        icon: 'albums-outline',
        title: L('Descobrir (baralho)', 'Discover (deck)', 'Descubrir (mazo)', 'Scopri (mazzo)'),
        body: L(
          'Um card por vez, ordenado por afinidade e proximidade. Use ✖️ passar, 🤝 pedir amizade ou ❤️ dar Match. Match mútuo libera o contato.',
          'One card at a time, ranked by affinity and distance. Use ✖️ pass, 🤝 ask friendship or ❤️ Match. A mutual Match opens contact.',
          'Una tarjeta a la vez, por afinidad y cercania. Usa ✖️ pasar, 🤝 pedir amistad o ❤️ dar Match. El Match mutuo abre el contacto.',
          'Una card alla volta, per affinita e vicinanza. Usa ✖️ passa, 🤝 chiedi amicizia o ❤️ Match. Il Match reciproco apre il contatto.'),
      },
      {
        icon: 'analytics-outline',
        title: L('Afinidade e sinastria', 'Affinity and synastry', 'Afinidad y sinastria', 'Affinita e sinastria'),
        body: L(
          'No card, "ver aspectos" mostra o que flui e o que atrita, a roda de sinastria e a grade completa (se a pessoa deixou aberta).',
          'On the card, "see aspects" shows what flows and what clashes, the synastry wheel and the full grid (if the person left it open).',
          'En la tarjeta, "ver aspectos" muestra lo que fluye y lo que roza, la rueda de sinastria y la grilla completa (si la persona la dejo abierta).',
          'Nella card, "vedi aspetti" mostra cosa scorre e cosa attrita, la ruota di sinastria e la griglia completa (se la persona l\'ha lasciata aperta).'),
      },
      {
        icon: 'options-outline',
        title: L('Filtros e busca', 'Filters and search', 'Filtros y busqueda', 'Filtri e ricerca'),
        body: L(
          'Filtre por cidade, idade, distância e interesses. Em "Buscar" você acha alguém pelo nome.',
          'Filter by city, age, distance and interests. Under "Search" you find someone by name.',
          'Filtra por ciudad, edad, distancia e intereses. En "Buscar" encuentras a alguien por nombre.',
          'Filtra per citta, eta, distanza e interessi. In "Cerca" trovi qualcuno per nome.'),
      },
      {
        icon: 'people-circle-outline',
        title: L('Conexões', 'Connections', 'Conexiones', 'Connessioni'),
        body: L(
          'Seus matches 💘 e amizades 🤝 ficam aqui. Em cada um: ver a sinastria, abrir o WhatsApp ou criar um grupo com a pessoa.',
          'Your matches 💘 and friends 🤝 live here. On each: view synastry, open WhatsApp or create a group with them.',
          'Tus matches 💘 y amistades 🤝 estan aqui. En cada uno: ver la sinastria, abrir WhatsApp o crear un grupo con la persona.',
          'I tuoi match 💘 e amicizie 🤝 sono qui. Su ognuno: vedi la sinastria, apri WhatsApp o crea un gruppo con la persona.'),
      },
      {
        icon: 'create-outline',
        title: L('Seu perfil do Match', 'Your Match profile', 'Tu perfil del Match', 'Il tuo profilo Match'),
        body: L(
          'Em "Perfil": fotos, interesses, bio, gênero e preferência. Ali também ficam os controles de privacidade (busca, baralho e sinastria visível).',
          'Under "Profile": photos, interests, bio, gender and preference. Privacy controls (search, deck and synastry visibility) are there too.',
          'En "Perfil": fotos, intereses, bio, genero y preferencia. Ahi tambien estan los controles de privacidad (busqueda, mazo y sinastria visible).',
          'In "Profilo": foto, interessi, bio, genere e preferenza. Li ci sono anche i controlli di privacy (ricerca, mazzo e sinastria visibile).'),
      },
    ],
  },
  {
    key: 'previsoes',
    icon: 'calendar',
    label: L('Previsões', 'Forecast', 'Pronostico', 'Previsioni'),
    intro: L(
      'O que vem pela frente — seus trânsitos dos próximos dias e semanas.',
      'What is ahead — your transits for the coming days and weeks.',
      'Lo que viene — tus transitos de los proximos dias y semanas.',
      'Cosa arriva — i tuoi transiti dei prossimi giorni e settimane.'),
    entries: [
      {
        icon: 'time-outline',
        title: L('Janela de tempo', 'Time window', 'Ventana de tiempo', 'Finestra temporale'),
        body: L(
          'Escolha ver por dia ou por semana para olhar mais perto ou mais longe.',
          'Choose a daily or weekly view to look closer or further ahead.',
          'Elige ver por dia o por semana para mirar mas cerca o mas lejos.',
          'Scegli la vista giornaliera o settimanale per guardare piu vicino o piu lontano.'),
      },
      {
        icon: 'filter-outline',
        title: L('Filtro por área', 'Filter by area', 'Filtro por area', 'Filtro per area'),
        body: L(
          'Toque numa das 8 áreas para focar. Cada área mostra o movimento e o nível de atenção do período.',
          'Tap one of the 8 areas to focus. Each area shows the movement and attention level for the period.',
          'Toca una de las 8 areas para enfocar. Cada area muestra el movimiento y el nivel de atencion del periodo.',
          'Tocca una delle 8 aree per concentrarti. Ogni area mostra il movimento e il livello di attenzione del periodo.'),
      },
      {
        icon: 'trending-up-outline',
        title: L('Eventos e trânsitos', 'Events and transits', 'Eventos y transitos', 'Eventi e transiti'),
        body: L(
          'Cada card traz um trânsito com a data, a intensidade e o que ele tende a mexer.',
          'Each card shows a transit with its date, intensity and what it tends to stir.',
          'Cada tarjeta trae un transito con la fecha, la intensidad y lo que tiende a mover.',
          'Ogni card porta un transito con data, intensita e cosa tende a smuovere.'),
      },
      {
        icon: 'hourglass-outline',
        title: L('Timing', 'Timing', 'Timing', 'Tempistica'),
        body: L(
          'Cada evento diz "hoje", "em X dias" ou "há X dias" — para você se preparar na hora certa.',
          'Each event says "today", "in X days" or "X days ago" — so you can prepare at the right time.',
          'Cada evento dice "hoy", "en X dias" o "hace X dias" — para prepararte en el momento justo.',
          'Ogni evento dice "oggi", "tra X giorni" o "X giorni fa" — cosi ti prepari al momento giusto.'),
      },
    ],
  },
  {
    key: 'config',
    icon: 'settings',
    label: L('Ajustes', 'Settings', 'Ajustes', 'Impostazioni'),
    intro: L(
      'Ajuste o app do seu jeito — dados, notificações, plano e privacidade.',
      'Set the app your way — data, notifications, plan and privacy.',
      'Ajusta la app a tu manera — datos, notificaciones, plan y privacidad.',
      'Regola l\'app come vuoi — dati, notifiche, piano e privacy.'),
    entries: [
      {
        icon: 'calendar-number-outline',
        title: L('Dados de nascimento e mapa', 'Birth data and chart', 'Datos de nacimiento y mapa', 'Dati di nascita e mappa'),
        body: L(
          'Corrija data, hora e local de nascimento, recalcule o mapa natal e escolha o sistema de casas.',
          'Fix birth date, time and place, recalculate the natal chart and choose the house system.',
          'Corrige fecha, hora y lugar de nacimiento, recalcula la carta natal y elige el sistema de casas.',
          'Correggi data, ora e luogo di nascita, ricalcola la carta natale e scegli il sistema delle case.'),
      },
      {
        icon: 'notifications-outline',
        title: L('Notificações', 'Notifications', 'Notificaciones', 'Notifiche'),
        body: L(
          'Escolha o que recebe e quando: status do dia, alertas de grupo e lembretes.',
          'Choose what you get and when: daily status, group alerts and reminders.',
          'Elige que recibes y cuando: estado del dia, alertas de grupo y recordatorios.',
          'Scegli cosa ricevi e quando: stato del giorno, avvisi di gruppo e promemoria.'),
      },
      {
        icon: 'card-outline',
        title: L('Assinatura', 'Subscription', 'Suscripcion', 'Abbonamento'),
        body: L(
          'Veja seu plano, o que os recursos premium liberam e gerencie a cobrança.',
          'See your plan, what premium features unlock and manage billing.',
          'Ve tu plan, que desbloquean las funciones premium y gestiona el cobro.',
          'Vedi il piano, cosa sbloccano le funzioni premium e gestisci la fatturazione.'),
      },
      {
        icon: 'logo-whatsapp',
        title: L('Astrólogo no WhatsApp', 'Astrologer on WhatsApp', 'Astrologo en WhatsApp', 'Astrologo su WhatsApp'),
        body: L(
          'Ative e gerencie o atendimento por WhatsApp direto daqui.',
          'Turn on and manage the WhatsApp assistant right from here.',
          'Activa y gestiona la atencion por WhatsApp desde aqui.',
          'Attiva e gestisci l\'assistenza WhatsApp da qui.'),
      },
      {
        icon: 'language-outline',
        title: L('Idioma', 'Language', 'Idioma', 'Lingua'),
        body: L(
          'Troque o idioma do app entre português, inglês, espanhol e italiano.',
          'Switch the app language among Portuguese, English, Spanish and Italian.',
          'Cambia el idioma de la app entre portugues, ingles, espanol e italiano.',
          'Cambia la lingua dell\'app tra portoghese, inglese, spagnolo e italiano.'),
      },
      {
        icon: 'help-buoy-outline',
        title: L('Ajuda e este guia', 'Help and this guide', 'Ayuda y esta guia', 'Aiuto e questa guida'),
        body: L(
          'Reabra este guia quando quiser, veja o FAQ, fale com o suporte ou mande feedback.',
          'Reopen this guide anytime, read the FAQ, contact support or send feedback.',
          'Reabre esta guia cuando quieras, ve el FAQ, contacta soporte o envia feedback.',
          'Riapri questa guida quando vuoi, leggi il FAQ, contatta il supporto o invia feedback.'),
      },
    ],
  },
]
