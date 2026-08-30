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
]
