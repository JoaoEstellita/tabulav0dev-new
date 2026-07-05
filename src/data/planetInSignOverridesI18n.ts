// Catálogo i18n: Planeta no Signo Natal
// 360 entradas: 10 planetas × 12 signos × 3 idiomas (en-US, es-ES, it-IT)
// Regras:
//   en-US — sem "will", presente simples
//   es-ES — sem acentos (sin tildes)
//   it-IT — sem acentos e sem apóstrofos

import type { AppLanguage } from '../i18n/appI18n'

export const PLANET_IN_SIGN_I18N_OVERRIDES: Partial<Record<AppLanguage, Record<string, string>>> = {

  'en-US': {
    // ─── Sun ─────────────────────────────────────────────────────────────────
    'natal:sun_in_aries':
      'Identity is built through direct action, initiative, and the drive to be first. A pioneering spirit values autonomy above security and tends to act before reflecting. The sense of self grows stronger when there are real challenges to overcome and concrete results to achieve.',

    'natal:sun_in_taurus':
      'Identity is anchored in constancy, material stability, and sensory pleasure. Self-worth grows through what is built with effort and patience, not through what comes suddenly or is inherited. Abrupt change provokes resistance, yet determination in the face of obstacles is one of the greatest strengths of this placement.',

    'natal:sun_in_gemini':
      'Identity expresses itself through intellectual curiosity and the ability to communicate ideas with fluency and versatility. There is a genuine need for variety and mental stimulation that can make consistency a real challenge. Contact with different people and perspectives continually feeds the sense of self.',

    'natal:sun_in_cancer':
      'Identity is deeply intertwined with roots, emotional memory, and the sense of belonging. Emotional intuition is sharp and serves as a compass in the most important decisions of life. The need for inner security is the axis around which the whole personality organizes and expresses itself.',

    'natal:sun_in_leo':
      'Identity manifests through creative expression, human warmth, and a genuine desire for recognition. Natural generosity is real, yet there is significant sensitivity to judgment and to the indifference of others. The sense of purpose grows stronger when there is room to shine without competing for attention.',

    'natal:sun_in_virgo':
      'Identity is built through usefulness, careful analysis, and attention to detail. Perfectionism can be both a strength and a source of excessive self-criticism applied to oneself and others. Self-worth deepens when the work accomplished contributes concretely to something larger.',

    'natal:sun_in_libra':
      'Identity is defined in relation to the other — the sense of self emerges in the mirror of relationships and exchanges. The instinct for fairness and harmony is genuine, but it can make solitary decision-making a slow process. A refined aesthetic sense is a direct and consistent expression of the personality.',

    'natal:sun_in_scorpio':
      'Identity is marked by emotional depth, intensity, and the need for authenticity in relationships. Superficiality holds no appeal; what matters is what remains hidden, true, and lasting. The capacity to regenerate after periods of crisis is one of the strongest marks of this placement.',

    'natal:sun_in_sagittarius':
      'Identity is oriented toward the search for meaning, expansion, and the freedom to explore horizons. Natural enthusiasm opens doors and inspires others, though commitment to a single path can be an internal challenge. The philosophy of life is taken seriously and tends to evolve with accumulated experience.',

    'natal:sun_in_capricorn':
      'Identity is built through gradual achievement, discipline, and respect earned over time. Authority comes from what is proven in practice, not from immediate prestige or inherited titles. Maturity usually brings more openness and lightness than the formative years suggest.',

    'natal:sun_in_aquarius':
      'Identity expresses itself through originality, independent thinking, and a sense of belonging to something collective and larger than the self. The need for intellectual freedom is non-negotiable, and any imposition is felt as a violation. Behind the apparent emotional coolness lies a genuine commitment to ideals and causes.',

    'natal:sun_in_pisces':
      'Identity is porous, empathetic, and capable of deeply absorbing the surrounding environment. Imagination and spiritual sensitivity are real strengths, though they can blur the boundary between self and other. The path of self-knowledge involves learning to distinguish what is truly one’s own from projection or fusion with the surroundings.',

    // ─── Moon ────────────────────────────────────────────────────────────────
    'natal:moon_in_aries':
      'Emotional needs express themselves quickly, directly, and with little mediation between feeling and response. Emotional reactivity is intense, yet emotions pass with a speed similar to their arrival. Taking action and having initiative provides emotional security; prolonged inertia is felt as real discomfort.',

    'natal:moon_in_taurus':
      'Emotional needs center on stability, physical comfort, and predictability in bonds. There is deep loyalty toward beloved people and places, along with natural resistance to abrupt emotional change. Contact with nature, daily rituals, and sensory pleasures consistently nourish inner balance.',

    'natal:moon_in_gemini':
      'Emotional needs express themselves through verbal exchange, socializing, and constant intellectual stimulation. Emotional processing happens through dialogue; talking about feelings helps to understand and organize inner emotions. Emotional variety is natural and does not indicate superficiality, but rather a particular way of staying connected to the world.',

    'natal:moon_in_cancer':
      'Emotional needs are deep, instinctive, and strongly tied to the family core and the sense of belonging. Emotional memory is powerful, and feelings from the past remain active and influential in the present. Caring for others is a natural form of emotional expression and a source of mutual nourishment.',

    'natal:moon_in_leo':
      'Emotional needs include recognition, genuine appreciation, and space for authentic self-expression. Emotional generosity is real, but there is also significant sensitivity to disinterest or indifference from others. Pride serves as a shield — vulnerability is shared only when enough trust is established.',

    'natal:moon_in_virgo':
      'Emotional needs organize themselves around order, usefulness, and the feeling of competence. Care for others expresses itself in practical gestures and attention to detail rather than open displays of affection. Emotional self-criticism can be intense; learning to treat one’s own feelings with the same kindness offered to others is a path of growth.',

    'natal:moon_in_libra':
      'Emotional needs find fulfillment in relational harmony and the absence of open conflict. The instinct for balance is strong but can lead to suppressing personal needs in the name of peace. Aesthetically pleasant environments and relationships based on genuine reciprocity nourish emotional well-being.',

    'natal:moon_in_scorpio':
      'Emotional needs are intense, demanding, and hard to satisfy through surface-level interaction. Emotional surrender is total once trust is established, but betrayal or disappointment can leave lasting marks. The capacity to dive into the depths of the psyche is a strength that, used consciously, generates real transformation.',

    'natal:moon_in_sagittarius':
      'Emotional needs express themselves through freedom, movement, and the search for meaning in lived experience. Emotional confinement feels suffocating; room to explore is a real need, not a passing whim. Natural optimism serves as emotional protection and a source of resilience in adversity.',

    'natal:moon_in_capricorn':
      'Emotional needs are contained, discreet, and rarely expressed spontaneously or openly. Responsibility and self-sufficiency are valued, yet they can mask a deep need for validation that is seldom voiced. Emotional maturity usually brings greater openness to vulnerability over time.',

    'natal:moon_in_aquarius':
      'Emotional needs express themselves unconventionally, with emphasis on friendship, freedom, and belonging to groups. The emotional coolness perceived by others is often a way of preserving independence, not an absence of feeling. Emotional intensity appears with force when deep values or ideals are threatened.',

    'natal:moon_in_pisces':
      'Emotional needs are diffuse, empathetic, and intensely permeable to the experience of others. Sensitivity is extraordinary, which can be both a gift and a vulnerability in emotionally heavy environments. Periodic retreat, creativity, and spirituality are natural and necessary ways of restoring inner balance.',

    // ─── Mercury ─────────────────────────────────────────────────────────────
    'natal:mercury_in_aries':
      'Thinking is fast, direct, and oriented toward immediate action. There is little tolerance for detours — communication goes straight to the point, sometimes without the filters that soften impact. Mental agility is a real strength, though impatience with slower reasoning can cut ideas short before they fully mature.',

    'natal:mercury_in_taurus':
      'Thinking is methodical, concrete, and oriented toward practical, lasting applications. Before expressing an idea, there is a natural tendency to process it internally for a considerable time. Once a conclusion forms, it changes with difficulty — intellectual consistency is valued more than novelty.',

    'natal:mercury_in_gemini':
      'Thinking is agile, associative, and able to move between multiple topics with ease and pleasure. Communication is a natural delight, and contact with different points of view feeds mental elaboration. The mind can scatter when there is not enough stimulation to keep it engaged and in motion.',

    'natal:mercury_in_cancer':
      'Thinking is intuitive, memory-driven, and strongly colored by the emotions of the moment. Ideas often arise from subjective impressions and from acute sensitivity to the emotional climate of the environment. Imagination is fertile, though objectivity can suffer when there is strong emotional involvement with the subject.',

    'natal:mercury_in_leo':
      'Thinking is dramatic, creative, and geared toward communicating with impact and presence. There is a natural sense of narrative — ideas are presented in ways that capture the listener’s attention. Intellectual pride may surface when ideas are questioned, but the ability to inspire with words is genuine.',

    'natal:mercury_in_virgo':
      'Thinking is analytical, precise, and oriented toward clearly separating the essential from the superfluous. There is a natural ability to spot inconsistencies and to organize complex information in an accessible, clear way. Self-criticism applied to one’s own reasoning can be intense, making it hard to accept imperfection as a natural part of the process.',

    'natal:mercury_in_libra':
      'Thinking develops best in dialogue — the exchange of ideas is central to mental elaboration. A natural instinct to see every side of a question produces balanced analysis, but also difficulty reaching final conclusions. Communication is diplomatic by nature and considerate in tone.',

    'natal:mercury_in_scorpio':
      'Thinking is investigative, penetrating, and rarely satisfied with superficial or conventional answers. There is a natural capacity to identify hidden motivations and to read between the lines with precision. Communication can be blunt to the point of brutality or strategically reserved — it rarely occupies the middle ground.',

    'natal:mercury_in_sagittarius':
      'Thinking is expansive, philosophical, and oriented toward the big picture rather than concrete detail. There is genuine enthusiasm in the exchange of ideas and a tendency to generalize from broad patterns of experience. Attention to detail can be a growth area, especially when precision is required.',

    'natal:mercury_in_capricorn':
      'Thinking is structured, pragmatic, and oriented toward concrete, verifiable results. Communication is economical — what is necessary gets said, without excess or unnecessary ornament. Intellectual depth comes from the patience to build solid reasoning and the ability to stay focused on long-term goals.',

    'natal:mercury_in_aquarius':
      'Thinking is original, nonlinear, and oriented toward unexpected connections between distant fields. There is genuine pleasure in questioning established premises and exploring ideas that challenge common sense. Communication can be brilliant and stimulating, yet it may lack the emotional dimension that eases connection with the listener.',

    'natal:mercury_in_pisces':
      'Thinking is symbolic, intuitive, and often organized in images and metaphors before conceptual words. The line between fact and imagination can be fluid, which feeds creativity but demands attention to precision when it matters. Communication is empathetic and poetically attuned to the emotional state of the listener.',

    // ─── Venus ───────────────────────────────────────────────────────────────
    'natal:venus_in_aries':
      'Affection expresses itself directly, enthusiastically, and without prolonged detours. Attraction tends to be immediate and intense, with little tolerance for games or lingering relational ambiguity. Spontaneity and honesty are highly valued — what fascinates does not surrender without some degree of genuine challenge.',

    'natal:venus_in_taurus':
      'Relational values are anchored in loyalty, sensory comfort, and trust built over time. There is genuine pleasure in experiences that engage the five senses — food, music, touch, natural beauty. Possessiveness can arise when the bond feels threatened or insecure.',

    'natal:venus_in_gemini':
      'Relational values include intellectual stimulation, lightness, and the freedom to explore different forms of connection. Conversation is central — without quality verbal exchange, affection naturally cools over time. Versatility in love can be mistaken for superficiality, yet it reflects genuine curiosity about the other.',

    'natal:venus_in_cancer':
      'Relational values organize themselves around protection, mutual care, and deep emotional intimacy. Affection expresses itself through concrete gestures of care — nourishment, constant presence, remembering the details that matter to the other. Sensitivity to rejection is high, which can lead to withdrawal when emotional safety is lacking.',

    'natal:venus_in_leo':
      'Relational values include genuine admiration, open displays of affection, and the feeling of being special and unique to the one who is loved. Generosity in love is real, but there is an implicit expectation of consistent reciprocity and recognition. Relational drama can arise when attention is divided or pride is wounded.',

    'natal:venus_in_virgo':
      'Relational values express themselves through acts of service, attention to detail, and a genuine willingness to improve the other person’s life. Affection is rarely declared grandly — it shows in practical, consistent gestures over time. Criticism can emerge as a form of care, but it needs moderation so it is not felt as rejection.',

    'natal:venus_in_libra':
      'Relational values center on reciprocity, harmony, and the beauty of connection between two people. A refined aesthetic sensitivity extends to the choice of partners and shared environments. Open conflict is skillfully avoided, though the cost may be difficulty expressing personal needs directly.',

    'natal:venus_in_scorpio':
      'Relational values demand depth, intensity, and a surrender that goes beyond the surface of everyday interaction. Attraction is often intense and magnetic, yet trust is granted cautiously and tested over time. Possessiveness and jealousy arise when emotional investment is high; the loyalty expected matches the loyalty offered.',

    'natal:venus_in_sagittarius':
      'Relational values include freedom, shared adventure, and room to grow independently within the bond. Attraction tends toward people who expand horizons and bring fresh perspectives on the world. Commitment is possible, but it requires that the partnership neither imprison nor limit personal exploration.',

    'natal:venus_in_capricorn':
      'Relational values express themselves through serious commitment, gradual building, and reliability demonstrated in action. Affection may seem cold at first — not because it is absent, but because it shows through concrete acts and consistent presence. Loyalty runs deep, as do the expectations of seriousness from the partner.',

    'natal:venus_in_aquarius':
      'Relational values include intellectual friendship, genuine respect for each person’s individuality, and space for the unusual. Conventional relationships may not fully satisfy; there is attraction to connections that challenge habitual molds of what a relationship should be. Emotional coolness may be perceived where, in reality, an unconventional way of loving exists.',

    'natal:venus_in_pisces':
      'Relational values are marked by compassion, romantic surrender, and sensitivity to the spiritual and emotional beauty of the other. A tendency toward idealization can create expectations hard to sustain in the daily reality of bonds. The capacity for unconditional love is real, but it requires discernment so as not to dissolve entirely into the other.',

    // ─── Mars ────────────────────────────────────────────────────────────────
    'natal:mars_in_aries':
      'The energy of action is direct, intense, and immediate — the body acts before the mind finishes processing the situation. Assertiveness comes naturally, and there is no room for indecision when the impulse is strong. Impatience with obstacles can lead to unnecessary conflict, but the courage to begin rarely fails.',

    'natal:mars_in_taurus':
      'The energy of action is slow to start but extraordinarily persistent and resilient once in motion. Motivation is tied to tangible, lasting goals, not to the adrenaline of novelty or the unexpected. Conflict is avoided whenever possible, but once the limit is reached, the reaction is firm and hard to reverse.',

    'natal:mars_in_gemini':
      'The energy of action is versatile, curious, and spread across multiple projects and fronts at once. Motivation comes from intellectual stimulation and dynamism — monotonous tasks quickly drain enthusiasm. The word is a powerful instrument of action; argumentation and persuasion are natural, effective skills.',

    'natal:mars_in_cancer':
      'The energy of action is deeply connected to the emotional state of the present moment. When there is security and emotional motivation, the capacity to care and protect is extraordinary and sustained. In conflict, behavior can swing between defensive withdrawal and indirect reactions that express more than they appear to.',

    'natal:mars_in_leo':
      'The energy of action is theatrical, generous, and oriented toward leaving a visible, lasting mark. There is genuine pleasure in leading and in accomplishing feats that generate admiration and recognition. Ego can inflame conflict — the need to be right and to feel respected can turn small disagreements into matters of honor.',

    'natal:mars_in_virgo':
      'The energy of action is meticulous, oriented toward efficiency, and applied with careful discernment. There is a natural ability to identify the bottleneck in any system and act directly on it. Perfectionism can slow execution, but what gets done with this placement tends to be solid and well finished.',

    'natal:mars_in_libra':
      'The energy of action activates more easily in partnership than in solitary, independent effort. There is a tendency to postpone decisions and actions until the fairest, most balanced path is clearly identified. Direct conflict is uncomfortable by nature — the preferred strategy is negotiation and finding reasonable terms.',

    'natal:mars_in_scorpio':
      'The energy of action is concentrated, strategic, and driven by a determination that rarely yields before reaching its goal. Intensity is a constant mark — there is no middle ground with Mars in Scorpio. Conflict is taken seriously, with long memory for alliances and betrayals alike.',

    'natal:mars_in_sagittarius':
      'The energy of action is enthusiastic, expansive, and uninterested in externally imposed restrictions or limits. Motivation comes from a broad vision of the destination, not from the concrete, immediate steps that lead there. Impulsiveness can produce brilliant beginnings followed by fading interest before completion.',

    'natal:mars_in_capricorn':
      'The energy of action is contained, strategic, and consistently oriented toward the long term. Every step is calculated in relation to the final goal — impulsiveness has no place in this position. Ambition is real and enduring; what is decided upon is rarely abandoned before it is achieved.',

    'natal:mars_in_aquarius':
      'The energy of action is activated by collective causes, by innovation, and by contexts that challenge the established status quo. There is instinctive resistance to any authority not legitimized by reason or consensus. Rebellion can be constructive when channeled into genuine, sustainable transformation.',

    'natal:mars_in_pisces':
      'The energy of action is diffuse, instinctive, and guided more by inner impulses than by rational, structured plans. Motivation sustains itself best when a dimension of service or spiritual purpose is involved. Direct aggression is rare — conflict tends to be avoided or sublimated into creative activity.',

    // ─── Jupiter ─────────────────────────────────────────────────────────────
    'natal:jupiter_in_aries':
      'Expansion happens through initiative, pioneering spirit, and the ability to act before others. There is a natural gift for seeing opportunity where others see obstacles and acting on it with confidence. Excess can come from impulsiveness or from overestimating one’s strength before assessing available resources.',

    'natal:jupiter_in_taurus':
      'Expansion happens through consistency, gradual accumulation, and deep connection with material and natural resources. There is a natural talent for recognizing what holds lasting value and investing in it with patience and discernment. Excess can appear as accumulation beyond need or resistance to letting go of what no longer serves.',

    'natal:jupiter_in_gemini':
      'Expansion happens through knowledge, communication, and the multiplication of connections and perspectives. There is a natural capacity to absorb information from diverse sources and synthesize it in an accessible, inspiring way. The challenge lies in deepening rather than merely broadening — excess can show up as intellectual dispersion.',

    'natal:jupiter_in_cancer':
      'Expansion happens through care, family, and emotional connection with roots and belonging. Natural generosity expresses itself in welcoming others and creating nurturing, safe environments. Excess can appear as overprotectiveness or difficulty allowing loved ones to grow on their own.',

    'natal:jupiter_in_leo':
      'Expansion happens through creative expression, natural leadership, and the genuine impact generated in others. A natural magnetism attracts recognition and collaborators willing to join ambitious projects. Excess can appear as arrogance or an exaggerated need for admiration and centrality.',

    'natal:jupiter_in_virgo':
      'Expansion happens through service, continuous improvement of systems, and the practical application of knowledge. There is a natural ability to see where systems can become more efficient and to implement improvements methodically. Excess can manifest as perfectionism that blocks progress or constant criticism of what could be different.',

    'natal:jupiter_in_libra':
      'Expansion happens through relationships, strategic partnerships, and the capacity to build bridges between different parties. There is a natural gift for diplomacy and for finding solutions that satisfy multiple interests at once. Excess can appear as dependence on external validation or difficulty taking clear positions.',

    'natal:jupiter_in_scorpio':
      'Expansion happens through depth, transformation, and the capacity to touch what lies hidden in processes and people. There is a natural aptitude for investigation, for handling crises, and for finding resources where others see no possibilities. Excess can manifest as obsession with control or difficulty trusting natural processes.',

    'natal:jupiter_in_sagittarius':
      'Expansion flows naturally and abundantly — this is one of the placements of greatest affinity for Jupiter. There is genuine optimism, openness to the world, and a capacity to turn experience into applicable wisdom. Excess can appear as promises larger than the capacity to deliver or flight from immediate consequences.',

    'natal:jupiter_in_capricorn':
      'Expansion happens through discipline, reputation built over time, and strategic long-term investment. Growth is rarely fast, but it tends to be solid, resilient, and respected. Excess can appear as a conservatism that blocks opportunities outside familiar paths.',

    'natal:jupiter_in_aquarius':
      'Expansion happens through innovation, networked collaboration, and commitment to ideas that benefit collectives. There is a natural capacity to see beyond the current paradigm and inspire large-scale change in social structures. Excess can appear as detachment from individual needs in the name of abstract causes.',

    'natal:jupiter_in_pisces':
      'Expansion happens through compassion, spirituality, and genuine openness to the mystery of existence. Natural generosity reaches beyond the limits of the ego, with a capacity for connection with something larger and more encompassing. Excess can appear as escapism, loose boundaries, or difficulty distinguishing genuine faith from self-deception.',

    // ─── Saturn ──────────────────────────────────────────────────────────────
    'natal:saturn_in_aries':
      'Discipline needs to be developed in the area of autonomous action and personal assertiveness. The challenge of this generation is learning to lead without trampling and to act with consistency without depending on the adrenaline of the moment. Maturity brings a more conscious, planned, and sustained capacity for initiative.',

    'natal:saturn_in_taurus':
      'Discipline is developed in the area of resources, self-worth, and material security. This generation tends to carry limiting beliefs about scarcity or unworthiness that need to be questioned and transformed. Over time, a mature relationship with material goods and with the recognition of one’s own value is built.',

    'natal:saturn_in_gemini':
      'Discipline is developed in the area of communication, learning, and structured thinking. This generation may face intellectual insecurity or difficulty communicating ideas clearly in the early years. With consistent practice, a mind capable of sustaining complex reasoning and communicating it precisely takes shape.',

    'natal:saturn_in_cancer':
      'Discipline is developed in the area of emotions, family, and care for others and oneself. This generation may have learned that showing vulnerability is risky, creating patterns of emotional restraint that are hard to soften. Maturing means learning to nurture oneself with the same responsibility devoted to the outside world.',

    'natal:saturn_in_leo':
      'Discipline is developed in the area of self-expression, creativity, and authentic leadership. This generation may feel blocks around shining or taking center stage, often from fear of external judgment. Over time, a genuine authority develops that does not depend on constant validation from others.',

    'natal:saturn_in_virgo':
      'Discipline is developed in the area of service, health, and the continuous refinement of oneself and of systems. This generation may carry extremely high demands toward itself and those around it. Maturity brings the understanding that perfection is a process, not a final state, and that caring for the body is also caring for the soul.',

    'natal:saturn_in_libra':
      'Discipline is developed in the area of relationships, justice, and the balance between giving and receiving. This generation faces the challenge of building partnerships based on real reciprocity, not merely the appearance of harmony. Over time, one learns to negotiate fairly and to hold personal boundaries within meaningful bonds.',

    'natal:saturn_in_scorpio':
      'Discipline is developed in the area of power, transformation, and deep emotional intimacy. This generation may carry fears tied to loss of control, betrayal, or crises of psychic renewal. Over time, an extraordinary capacity develops to move through crises without being destroyed in the process.',

    'natal:saturn_in_sagittarius':
      'Discipline is developed in the area of beliefs, personal philosophy, and the search for authentic meaning. This generation deeply questions inherited religious or philosophical structures, needing to build a worldview of its own. Over time, a wisdom develops that unites freedom of thought with real responsibility.',

    'natal:saturn_in_capricorn':
      'Discipline is developed in Saturn’s own domain, making this placement particularly demanding regarding concrete results and the sense of duty. This generation tends to have a serious relationship with authority, responsibility, and achievement over time. With maturity, rigor can transform into genuine, consistent practical wisdom.',

    'natal:saturn_in_aquarius':
      'Discipline is developed in the area of collective structures, responsible innovation, and freedom within systems. This generation faces the tension between the need to transform the established and the risk of chaos through irresponsible change. Over time, one learns to reform without destroying and to innovate without neglecting those who depend on structure.',

    'natal:saturn_in_pisces':
      'Discipline is developed in the area of spirituality, compassion with boundaries, and the structure of the inner life. This generation may struggle to structure its spiritual life or to distinguish genuine responsibility from diffuse guilt. With maturity, a grounded spirituality develops that coexists with reality without dissolving into it.',

    // ─── Uranus ──────────────────────────────────────────────────────────────
    'natal:uranus_in_aries':
      'The generation with Uranus in Aries carries a collective drive for radical liberation from authority and for pioneering at any cost. The individual need for freedom of action is intense, and resistance to any form of external control is striking. Innovation happens through the force of individuality and the courage to inaugurate what does not yet exist.',

    'natal:uranus_in_taurus':
      'The generation with Uranus in Taurus questions established structures of value, property, and the relationship with natural resources. Individually, there can be tension between the desire for stability and the need for change in the material foundations of life. Innovation happens slowly but radically — transforming what seemed immutable in economic and natural foundations.',

    'natal:uranus_in_gemini':
      'The generation with Uranus in Gemini brings a rupture in models of communication, education, and information exchange. The thinking of this generation is marked by nonconformity with dominant narratives and by a curiosity that refuses ready-made answers. Innovation happens through language and the accelerated multiplication of forms of expression and connection.',

    'natal:uranus_in_cancer':
      'The generation with Uranus in Cancer questions traditional family structures and conventional forms of belonging. Individually, there can be swings between the need for roots and the impulse to redefine what home and family mean. Innovation happens in emotional foundations and in collective models of care and protection.',

    'natal:uranus_in_leo':
      'The generation with Uranus in Leo brings a rupture in models of leadership, creativity, and self-expression. There is a drive for authenticity that refuses imposed roles and a creative expression that defies aesthetic and cultural conventions. Innovation happens through the radical originality of self-expression and the refusal of creative conformity.',

    'natal:uranus_in_virgo':
      'The generation with Uranus in Virgo brings a rupture in models of work, health, and collective service. There is a tendency to question established health systems and to seek alternative approaches to efficiency and care. Innovation happens through the details and through transformations in everyday processes and practices.',

    'natal:uranus_in_libra':
      'The generation with Uranus in Libra questions the structures of marriage, legal partnerships, and social agreements. There is a need for relationships that respect each person’s individuality and resistance to bonds based on rigid traditional roles. Innovation happens in forms of association, in justice, and in the contracts that regulate shared life.',

    'natal:uranus_in_scorpio':
      'The generation with Uranus in Scorpio brings a rupture in structures of power, sexuality, and deep collective transformation. There is a particular intensity in the search for emotional authenticity and resistance to conventional forms of control and domination. Innovation happens in the depths — where others do not dare to look or question.',

    'natal:uranus_in_sagittarius':
      'The generation with Uranus in Sagittarius questions religious, philosophical, and educational structures established for centuries. There is a strong drive for freedom of belief and for life philosophies that challenge the boundaries of the conventional. Innovation happens in expanding the horizons of what can be collectively believed, explored, and experienced.',

    'natal:uranus_in_capricorn':
      'The generation with Uranus in Capricorn brings a rupture in institutional, governmental, and corporate structures. There is tension between ambition within the established order and the drive to transform power structures from the inside out. Innovation happens through the reorganization of hierarchies and of forms of authority and collective responsibility.',

    'natal:uranus_in_aquarius':
      'Uranus in Aquarius inhabits its natural domain, intensifying the search for collective freedom, technological innovation, and deep social transformation. Nonconformity with any limitation on free thought is striking in this generation. Innovation happens through vision of the future and the capacity to build networks that transform social and political structures.',

    'natal:uranus_in_pisces':
      'The generation with Uranus in Pisces brings a rupture in spiritual structures and in the collective relationship with the invisible and the transcendent. There is openness to unconventional forms of spirituality and heightened sensitivity to shifts in the collective currents of the unconscious. Innovation happens through the dissolution of boundaries between the sacred and the everyday.',

    // ─── Neptune ─────────────────────────────────────────────────────────────
    'natal:neptune_in_aries':
      'The generation with Neptune in Aries carries a spirituality tied to action, heroism, and the ideal of the warrior who acts for the collective good. The collective dreams of this generation involve the fight for a more authentic world and the belief in the individual’s power to change the course of things. The temptation is fanaticism — excessive idealization of one’s own cause as superior to others.',

    'natal:neptune_in_taurus':
      'The generation with Neptune in Taurus carries a spirituality tied to the earth, material beauty, and the belief that abundance is sacred. The collective dreams of this generation involve the search for a more harmonious relationship with natural resources and the ideal of a prosperity that genuinely nourishes. The temptation is materializing the spiritual or excessively spiritualizing the material.',

    'natal:neptune_in_gemini':
      'The generation with Neptune in Gemini carries a spirituality tied to language, ideas, and the multiplicity of perspectives and narratives. The collective dreams of this generation involve universal communication and the belief in the power of words to transform collective reality. The temptation is confusion between myth and reality or the proliferation of narratives with no anchor in the concrete.',

    'natal:neptune_in_cancer':
      'The generation with Neptune in Cancer carries a spirituality tied to home, nation, and bonds of blood and affection. The collective dreams of this generation involve an ideal of protection and belonging, with nostalgia for the past as a lost paradise. The temptation is emotional nationalism or the dissolution of the self into the needs of family and group.',

    'natal:neptune_in_leo':
      'The generation with Neptune in Leo carries a spirituality tied to creativity, charisma, and the ideal of the hero who inspires the masses. The collective dreams of this generation involve glamour, spectacle, and belief in the transformative power of artistic and personal expression. The temptation is the illusion of grandeur or confusing fame with real transcendence.',

    'natal:neptune_in_virgo':
      'The generation with Neptune in Virgo carries a spirituality tied to service, collective health, and the pursuit of perfection. The collective dreams of this generation involve an ideal of healing and of refining the social fabric. The temptation is a perfectionism that paralyzes or the dissolution of identity in tireless service to others.',

    'natal:neptune_in_libra':
      'The generation with Neptune in Libra carries a spirituality tied to harmony, justice, and the ideal of universal love. The collective dreams of this generation involve a more balanced world and belief in the power of diplomacy, art, and mediation. The temptation is relational illusion or the dissolution of personal boundaries in the name of superficial harmony.',

    'natal:neptune_in_scorpio':
      'The generation with Neptune in Scorpio carries a spirituality tied to transformation, the occult, and the dissolution of collective taboos. The collective dreams of this generation involve exploring the shadowy territories of the psyche and belief in crisis as a path of deep renewal. The temptation is escapism through substances or fascination with the abyss.',

    'natal:neptune_in_sagittarius':
      'The generation with Neptune in Sagittarius carries a spirituality tied to the search for meaning, ecumenism, and openness to spiritual traditions from the whole world. The collective dreams of this generation involve the belief that all spiritual traditions point toward a greater, universal truth. The temptation is syncretism without depth or escape from reality through spiritual ideals.',

    'natal:neptune_in_capricorn':
      'The generation with Neptune in Capricorn carries a spirituality tied to structures of power and the ideal of an authority that genuinely serves the collective good. The collective dreams of this generation involve reforming existing structures from within, with responsibility and vision. The temptation is the dilution of ethical boundaries in the name of efficiency or ambition.',

    'natal:neptune_in_aquarius':
      'The generation with Neptune in Aquarius carries a spirituality tied to technology, networks, and the ideal of a deeply interconnected humanity. The collective dreams of this generation involve belief in the transformative potential of information shared freely among all. The temptation is the dissolution of individual identity into collective narratives or confusion between virtuality and reality.',

    'natal:neptune_in_pisces':
      'Neptune in Pisces inhabits its natural domain, intensifying the dissolution of collective boundaries and the search for transcendence. The dreams of this generation involve universal compassion, the crisis of structures that fragment humanity, and the longing for an embodied, genuine spirituality. The temptation is the collapse of the distinction between empathy and fusion, or between authentic faith and comfortable illusion.',

    // ─── Pluto ───────────────────────────────────────────────────────────────
    'natal:pluto_in_aries':
      'The generation with Pluto in Aries brought deep transformations to the concepts of individuality, leadership, and personal power. The force of the self was both the engine and the battlefield of the collective transformations of that historical era. As a generational archetype, it carries the drive toward regeneration through radical action and confrontation with structures that limit autonomy.',

    'natal:pluto_in_taurus':
      'The generation with Pluto in Taurus witnessed and generated deep transformations in economic structures and in the relationship with land and natural resources. Power and wealth were concentrated, questioned, and redistributed in ways that redrew the social and productive map. As an archetype, it carries the essential tension between accumulation and renewal of fundamental resources.',

    'natal:pluto_in_gemini':
      'The generation with Pluto in Gemini deeply transformed the structures of communication, information, and collective transport. The proliferation of new languages, media, and ideologies characterized and defined that era in striking ways. As an archetype, it carries the transformative power of ideas and the risk of propaganda and the fragmentation of collective discourse.',

    'natal:pluto_in_cancer':
      'The generation with Pluto in Cancer lived through deep transformations in the concepts of nation, family, and collective belonging. World wars and mass displacement redrew the boundaries of home and collective identity irreversibly. As an archetype, it carries the intensity of attachment to roots and the destructive and regenerative power of emotional and national forces.',

    'natal:pluto_in_leo':
      'The generation with Pluto in Leo deeply transformed structures of power, leadership, and individual expression on a global scale. The cult of personality, the rise of mass stars, and wars of ego characterized that era in previously unknown ways. As an archetype, it carries the drive to affirm the self beyond any limit and the risk of collective narcissism.',

    'natal:pluto_in_virgo':
      'The generation with Pluto in Virgo deeply transformed the structures of health, work, and service to the collective. The revolution in health services, the questioning of working conditions, and the emergence of ecological awareness marked this generation definitively. As an archetype, it carries the drive toward systemic refinement and the tension between serving and destroying oneself in service.',

    'natal:pluto_in_libra':
      'The generation with Pluto in Libra deeply transformed the structures of marriage, justice, and partnership in every dimension. The rise in separations, the emergence of new relationship models, and transformations in family law marked that era visibly and lastingly. As an archetype, it carries the tension between the ideal of harmony and the need to honor personal boundaries.',

    'natal:pluto_in_scorpio':
      'The generation with Pluto in Scorpio grew up amid radical transformations in the themes of death, sexuality, and power on a collective scale. The HIV/AIDS epidemic, the sexual revolution, and crises of political power defined the backdrop of this generation intensely. As an archetype, it carries intimacy with transformation and the capacity to look into the abyss without turning away.',

    'natal:pluto_in_sagittarius':
      'The generation with Pluto in Sagittarius grew up amid deep transformations in religious and philosophical structures and in the geopolitical boundaries of the world. Accelerated globalization, religious fundamentalism, and the clash of civilizations marked that era with force and urgency. As an archetype, it carries both the drive to transcend boundaries and the risk of ideological fanaticism.',

    'natal:pluto_in_capricorn':
      'The generation with Pluto in Capricorn witnesses the deep transformation of institutional structures — governments, corporations, financial systems, and established hierarchies. The crisis of trust in institutions and the concentration of power that precedes restructuring define this ongoing era. As an archetype, it carries both the weight of collapse and the potential for rebuilding on more solid, fairer foundations.',

    'natal:pluto_in_aquarius':
      'The generation with Pluto in Aquarius moves through the deep transformation of collective structures, technology, and the network systems that organize humanity. Artificial intelligence, changes in the social contract, and the redistribution of power between individuals and collectives define this unfolding era at increasing speed. As an archetype, it carries the potential for unprecedented collective freedom and the risk of equally unprecedented surveillance.',

    'natal:pluto_in_pisces':
      'As a prospective archetype, Pluto in Pisces promises a deep transformation of spiritual structures and of the collective relationship with the unconscious and the transcendent. The dissolution of the boundaries separating forms of life and consciousness may be both the greatest achievement and the greatest risk of this era to come. The invitation of this era is to integrate spiritual depth with collective responsibility for the shared world.',
  },

  'es-ES': {
    // Regra: sem acentos (sin tildes)
    // ─── Sol ─────────────────────────────────────────────────────────────────
    'natal:sun_in_aries':
      'La identidad se construye mediante la accion directa, la iniciativa y el impulso de ser el primero. Hay un espiritu pionero que valora la autonomia por encima de la seguridad y tiende a actuar antes de reflexionar. El sentido de si mismo se fortalece cuando hay desafios reales que superar y resultados concretos que conquistar.',

    'natal:sun_in_taurus':
      'La identidad se ancla en la constancia, la estabilidad material y el placer sensorial. El sentido del propio valor crece por lo construido con esfuerzo y paciencia, no por lo heredado o conseguido de forma repentina. Los cambios bruscos provocan resistencia, pero la determinacion ante los obstaculos es una de las mayores fuerzas de esta posicion.',

    'natal:sun_in_gemini':
      'La identidad se expresa mediante la curiosidad intelectual y la capacidad de comunicar ideas con fluidez y versatilidad. Hay una necesidad genuina de variedad y estimulo mental que puede convertir la constancia en un desafio real. El contacto con personas y perspectivas diferentes alimenta continuamente el sentido de si mismo.',

    'natal:sun_in_cancer':
      'La identidad esta profundamente entrelazada con las raices, la memoria afectiva y el sentido de pertenencia. La intuicion emocional es aguda y sirve de brujula en las decisiones mas importantes de la vida. La necesidad de seguridad interior es el eje en torno al cual toda la personalidad se organiza y se expresa.',

    'natal:sun_in_leo':
      'La identidad se manifiesta mediante la expresion creativa, la calidez humana y el deseo genuino de ser reconocido. La generosidad natural es real, pero hay una sensibilidad significativa al juicio y a la indiferencia ajenos. El sentido de proposito se fortalece cuando hay espacio para brillar sin necesidad de competir por la atencion.',

    'natal:sun_in_virgo':
      'La identidad se construye mediante la utilidad, el analisis cuidadoso y la atencion a los detalles. El perfeccionismo puede ser tanto una fuerza como una fuente de autocritica excesiva aplicada a si mismo y a los demas. El sentido del propio valor se profundiza cuando el trabajo realizado contribuye de forma concreta a algo mayor.',

    'natal:sun_in_libra':
      'La identidad se define en relacion con el otro — el sentido de si mismo emerge en el espejo de las relaciones y los intercambios. El instinto por la equidad y la armonia es genuino, pero puede hacer de la toma de decisiones solitarias un proceso lento. El gusto estetico refinado es una expresion directa y consistente de la personalidad.',

    'natal:sun_in_scorpio':
      'La identidad esta marcada por la profundidad emocional, la intensidad y la necesidad de autenticidad en las relaciones. La superficialidad no tiene atractivo; lo que importa es lo oculto, lo verdadero y lo duradero. La capacidad de regenerarse tras periodos de crisis es una de las marcas mas fuertes de esta posicion.',

    'natal:sun_in_sagittarius':
      'La identidad se orienta por la busqueda de sentido, la expansion y la libertad de explorar horizontes. Hay un entusiasmo natural que abre puertas e inspira a otros, pero el compromiso con un unico camino puede ser un desafio interno. La filosofia de vida se toma en serio y tiende a evolucionar con las experiencias acumuladas.',

    'natal:sun_in_capricorn':
      'La identidad se construye mediante la conquista gradual, la disciplina y el respeto ganado a lo largo del tiempo. La autoridad viene de lo probado en la practica, no del prestigio inmediato ni del titulo heredado. La madurez suele traer mas apertura y ligereza de lo que los anos de formacion sugieren.',

    'natal:sun_in_aquarius':
      'La identidad se expresa mediante la originalidad, el pensamiento independiente y el sentido de pertenencia a algo colectivo y mayor que el yo. La necesidad de libertad intelectual es innegociable y cualquier imposicion se siente como una violacion. Detras de la aparente frialdad emocional hay un compromiso genuino con ideales y causas.',

    'natal:sun_in_pisces':
      'La identidad es porosa, empatica y capaz de absorber profundamente el ambiente que la rodea. La imaginacion y la sensibilidad espiritual son fuerzas reales, pero pueden difuminar la frontera entre el yo y el otro. El camino de autoconocimiento pasa por aprender a distinguir lo propio de lo que es proyeccion o fusion con el entorno.',

    // ─── Luna ────────────────────────────────────────────────────────────────
    'natal:moon_in_aries':
      'Las necesidades emocionales se expresan de forma rapida, directa y con poca mediacion entre el sentimiento y la respuesta. La reactividad emocional es intensa, pero las emociones pasan con una velocidad similar a la de su llegada. La sensacion de actuar y tener iniciativa da seguridad emocional; la inercia prolongada se siente como un malestar real.',

    'natal:moon_in_taurus':
      'Las necesidades emocionales se centran en la estabilidad, el confort fisico y la previsibilidad de los vinculos. Hay una lealtad profunda hacia las personas y los ambientes queridos, junto con resistencia natural a los cambios emocionales bruscos. El contacto con la naturaleza, los rituales cotidianos y los placeres sensoriales alimentan consistentemente el equilibrio interior.',

    'natal:moon_in_gemini':
      'Las necesidades emocionales se expresan mediante el intercambio verbal, la socializacion y la estimulacion intelectual constante. El procesamiento emocional pasa por el dialogo; hablar de lo que se siente ayuda a comprender y organizar las emociones internas. La variedad emocional es natural y no indica superficialidad, sino una forma particular de mantener el vinculo con el mundo.',

    'natal:moon_in_cancer':
      'Las necesidades emocionales son profundas, instintivas y fuertemente ligadas al nucleo familiar y al sentido de pertenencia. La memoria afectiva es poderosa y las emociones del pasado siguen activas e influyentes en el presente. El cuidado de los demas es una forma natural de expresion emocional y fuente de nutricion mutua.',

    'natal:moon_in_leo':
      'Las necesidades emocionales incluyen reconocimiento, aprecio genuino y espacio para expresarse con autenticidad. La generosidad emocional es real, pero tambien hay una sensibilidad significativa al desinteres o a la indiferencia de los demas. El orgullo sirve de escudo — la vulnerabilidad se comparte solo cuando hay confianza suficientemente establecida.',

    'natal:moon_in_virgo':
      'Las necesidades emocionales se organizan en torno al orden, la utilidad y la sensacion de competencia. El cuidado de los demas se expresa en gestos practicos y atencion a los detalles mas que en demostraciones afectivas abiertas. La autocritica emocional puede ser intensa; aprender a tratar los propios sentimientos con la misma gentileza dedicada a los demas es un camino de madurez.',

    'natal:moon_in_libra':
      'Las necesidades emocionales se realizan en la armonia relacional y la ausencia de conflicto abierto. El instinto por el equilibrio es fuerte, pero puede llevar a suprimir las propias necesidades en nombre de la paz. Los ambientes esteticamente agradables y las relaciones basadas en reciprocidad genuina alimentan el bienestar emocional.',

    'natal:moon_in_scorpio':
      'Las necesidades emocionales son intensas, exigentes y dificiles de satisfacer desde la superficie de las interacciones. La entrega emocional es total cuando hay confianza establecida, pero la traicion o la decepcion pueden dejar marcas duraderas. La capacidad de sumergirse en las profundidades de la propia psique es una fuerza que, usada conscientemente, genera transformacion real.',

    'natal:moon_in_sagittarius':
      'Las necesidades emocionales se expresan mediante la libertad, el movimiento y la busqueda de sentido en las experiencias vividas. El confinamiento emocional se siente sofocante; el espacio para explorar es una necesidad real, no un capricho pasajero. El optimismo natural sirve de proteccion emocional y fuente de resiliencia ante las adversidades.',

    'natal:moon_in_capricorn':
      'Las necesidades emocionales son contenidas, discretas y raramente expresadas de forma espontanea o abierta. La responsabilidad y la autosuficiencia se valoran, pero pueden enmascarar una necesidad profunda de validacion que rara vez se verbaliza. La madurez emocional suele traer mas apertura a la vulnerabilidad con el tiempo.',

    'natal:moon_in_aquarius':
      'Las necesidades emocionales se expresan de forma no convencional, con enfasis en la amistad, la libertad y el sentido de pertenencia a grupos. La frialdad emocional percibida por los demas es frecuentemente una forma de mantener la independencia, no ausencia de sentimiento. La intensidad emocional aparece con fuerza cuando valores profundos o ideales se ven amenazados.',

    'natal:moon_in_pisces':
      'Las necesidades emocionales son difusas, empaticas y permeables a la experiencia ajena de forma intensa. La sensibilidad es extraordinaria, lo que puede ser tanto un don como una vulnerabilidad ante ambientes emocionalmente pesados. El recogimiento periodico, la creatividad y la espiritualidad son formas naturales y necesarias de recargar el equilibrio interno.',

    // ─── Mercurio ────────────────────────────────────────────────────────────
    'natal:mercury_in_aries':
      'El pensamiento es rapido, directo y orientado a la accion inmediata. Hay poca tolerancia a los rodeos — la comunicacion va directa al punto, a veces sin los filtros que suavizarian el impacto. La agilidad mental es una fuerza real, pero la impaciencia con razonamientos lentos puede cortar ideas antes de que maduren completamente.',

    'natal:mercury_in_taurus':
      'El pensamiento es metodico, concreto y orientado a aplicaciones practicas y duraderas. Antes de expresar una idea, hay una tendencia natural a procesarla internamente durante un tiempo considerable. Una vez formada una conclusion, cambia con dificultad — la consistencia intelectual se valora mas que la novedad.',

    'natal:mercury_in_gemini':
      'El pensamiento es agil, asociativo y capaz de transitar entre multiples temas con facilidad y placer. La comunicacion es un placer natural y el contacto con diferentes puntos de vista alimenta la propia elaboracion mental. La mente puede dispersarse cuando falta estimulo suficiente para mantenerla comprometida y en movimiento.',

    'natal:mercury_in_cancer':
      'El pensamiento es intuitivo, orientado por la memoria y fuertemente tenido por las emociones del momento. Las ideas nacen frecuentemente de impresiones subjetivas y de una sensibilidad aguda al clima emocional del ambiente. La imaginacion es fertil, pero la objetividad puede verse perjudicada cuando hay fuerte implicacion afectiva con el tema.',

    'natal:mercury_in_leo':
      'El pensamiento es dramatico, creativo y orientado a comunicar con impacto y presencia. Hay un sentido natural de narrativa — las ideas se presentan de forma que captura la atencion del interlocutor. La vanidad intelectual puede surgir cuando las propias ideas son cuestionadas, pero la capacidad de inspirar con palabras es genuina.',

    'natal:mercury_in_virgo':
      'El pensamiento es analitico, preciso y orientado a distinguir lo esencial de lo superfluo con claridad. Hay una capacidad natural de identificar inconsistencias y de organizar informacion compleja de forma accesible y clara. La autocritica aplicada al propio razonamiento puede ser intensa, generando dificultad para aceptar la imperfeccion como parte natural del proceso.',

    'natal:mercury_in_libra':
      'El pensamiento se desarrolla mejor cuando hay dialogo — el intercambio de ideas es parte central del proceso de elaboracion mental. Hay un instinto natural para ver todos los lados de una cuestion, resultando en analisis equilibrados pero tambien en dificultad para llegar a conclusiones definitivas. La comunicacion es diplomatica por naturaleza y considerada en el tono.',

    'natal:mercury_in_scorpio':
      'El pensamiento es investigativo, penetrante y poco satisfecho con respuestas superficiales o convencionales. Hay una capacidad natural de identificar motivaciones ocultas y de leer entre lineas con precision. La comunicacion puede ser directa hasta la brutalidad o estrategicamente reservada — rara vez ocupa el termino medio.',

    'natal:mercury_in_sagittarius':
      'El pensamiento es expansivo, filosofico y orientado al cuadro general mas que a los detalles concretos. Hay entusiasmo genuino en el intercambio de ideas y una tendencia a generalizar con base en patrones amplios de experiencia. El cuidado con los detalles puede ser un punto de desarrollo, especialmente cuando la precision es necesaria.',

    'natal:mercury_in_capricorn':
      'El pensamiento es estructurado, pragmatico y orientado a resultados concretos y verificables. La comunicacion es economica — se dice lo necesario, sin excesos ni ornamentos innecesarios. La profundidad intelectual viene de la paciencia para construir razonamientos solidos y de la capacidad de mantener el foco en objetivos de largo plazo.',

    'natal:mercury_in_aquarius':
      'El pensamiento es original, no lineal y orientado a conexiones inesperadas entre campos distantes. Hay un placer genuino en cuestionar premisas establecidas y en explorar ideas que desafian el sentido comun. La comunicacion puede ser brillante y estimulante, pero puede prescindir de una dimension emocional que facilite la conexion con quien escucha.',

    'natal:mercury_in_pisces':
      'El pensamiento es simbolico, intuitivo y frecuentemente organizado en imagenes y metaforas antes que en palabras conceptuales. La distincion entre hecho e imaginacion puede ser fluida, lo que alimenta la creatividad pero exige atencion a la precision cuando es necesaria. La comunicacion es empatica y poeticamente sensible al estado emocional del interlocutor.',

    // ─── Venus ───────────────────────────────────────────────────────────────
    'natal:venus_in_aries':
      'El afecto se expresa de forma directa, entusiasta y sin rodeos prolongados. La atraccion tiende a ser inmediata e intensa, con poca tolerancia a juegos o ambiguedades relacionales que se extienden. La espontaneidad y la honestidad se valoran mucho — lo que fascina no se entrega sin algun grado de desafio genuino.',

    'natal:venus_in_taurus':
      'Los valores relacionales se anclan en la lealtad, el confort sensorial y la confianza construida a lo largo del tiempo. Hay un placer genuino en las experiencias que involucran los cinco sentidos — gastronomia, musica, tacto, belleza natural. La posesividad puede surgir cuando el vinculo se siente amenazado o inseguro.',

    'natal:venus_in_gemini':
      'Los valores relacionales incluyen el estimulo intelectual, la ligereza y la libertad de explorar diferentes formas de conexion. La conversacion es central — sin intercambio verbal de calidad, el afecto se enfria naturalmente con el tiempo. La versatilidad en el amor puede confundirse con superficialidad, pero refleja una curiosidad genuina por el otro.',

    'natal:venus_in_cancer':
      'Los valores relacionales se organizan en torno a la proteccion, el cuidado mutuo y la intimidad emocional profunda. El afecto se expresa mediante gestos de cuidado concretos — nutricion, presencia constante, memoria de los detalles importantes para el otro. La sensibilidad a los rechazos es alta, lo que puede generar retraimiento cuando no hay suficiente seguridad emocional.',

    'natal:venus_in_leo':
      'Los valores relacionales incluyen admiracion genuina, demostraciones afectivas abiertas y la sensacion de ser especial y unico para quien se ama. La generosidad en el amor es real, pero hay una expectativa implicita de reciprocidad y reconocimiento consistente. El drama relacional puede surgir cuando la atencion se divide o el orgullo resulta herido.',

    'natal:venus_in_virgo':
      'Los valores relacionales se expresan mediante actos de servicio, atencion a los detalles y disposicion genuina a mejorar la vida del otro. El afecto rara vez se declara con grandiosidad — se manifiesta en gestos practicos y consistentes a lo largo del tiempo. La critica puede surgir como forma de cuidado, pero necesita moderacion para no sentirse como rechazo.',

    'natal:venus_in_libra':
      'Los valores relacionales se centran en la reciprocidad, la armonia y la belleza de la conexion entre dos personas. Hay una sensibilidad estetica refinada que se extiende a la eleccion de parejas y ambientes de convivencia. El conflicto abierto se evita con destreza, pero el costo puede ser la dificultad de expresar necesidades personales de forma directa.',

    'natal:venus_in_scorpio':
      'Los valores relacionales exigen profundidad, intensidad y una entrega que va mas alla de la superficie de las interacciones cotidianas. La atraccion es frecuentemente intensa y magnetica, pero la confianza se concede con cautela y se pone a prueba con el tiempo. La posesividad y los celos surgen cuando hay alta inversion emocional; la lealtad esperada es del mismo nivel que la ofrecida.',

    'natal:venus_in_sagittarius':
      'Los valores relacionales incluyen libertad, aventura compartida y espacio para crecer de forma independiente dentro del vinculo. La atraccion tiende a dirigirse hacia personas que expanden horizontes y traen novedad de perspectiva y de mundo. El compromiso es posible, pero exige que la pareja no aprisione ni limite la exploracion personal.',

    'natal:venus_in_capricorn':
      'Los valores relacionales se expresan mediante el compromiso serio, la construccion gradual y la fiabilidad demostrada en acciones. El afecto puede parecer frio a primera vista — no porque este ausente, sino porque se demuestra con actos concretos y presencia consistente. La lealtad es profunda, asi como las expectativas de seriedad de la pareja.',

    'natal:venus_in_aquarius':
      'Los valores relacionales incluyen amistad intelectual, respeto genuino por la individualidad de cada uno y espacio para lo inusual. Las relaciones convencionales pueden no satisfacer plenamente; hay atraccion por conexiones que desafien los moldes habituales de lo que una relacion debe ser. La frialdad emocional puede percibirse donde existe, en realidad, una forma no convencional de amar.',

    'natal:venus_in_pisces':
      'Los valores relacionales estan marcados por la compasion, la entrega romantica y una sensibilidad a la belleza espiritual y emocional del otro. La propension a la idealizacion puede crear expectativas dificiles de sostener en la realidad cotidiana de los vinculos. La capacidad de amar incondicionalmente es real, pero requiere discernimiento para no perderse enteramente en el otro.',

    // ─── Marte ───────────────────────────────────────────────────────────────
    'natal:mars_in_aries':
      'La energia de accion es directa, intensa e inmediata — el cuerpo actua antes de que la mente termine de procesar la situacion. La asertividad viene naturalmente y no hay espacio para la indecision cuando el impulso es fuerte. La impaciencia con los obstaculos puede llevar a conflictos innecesarios, pero el coraje de iniciar rara vez falta.',

    'natal:mars_in_taurus':
      'La energia de accion es lenta para comenzar, pero extraordinariamente persistente y resistente una vez iniciada. La motivacion esta ligada a objetivos tangibles y duraderos, no a la adrenalina de la novedad o lo imprevisto. El conflicto se evita siempre que es posible, pero cuando se alcanza el limite, la reaccion es firme y dificil de revertir.',

    'natal:mars_in_gemini':
      'La energia de accion es versatil, curiosa y distribuida en multiples proyectos y frentes simultaneamente. La motivacion viene de la estimulacion intelectual y el dinamismo — las tareas monotonas drenan rapidamente el entusiasmo. La palabra es un instrumento de accion poderoso; la argumentacion y la persuasion son habilidades naturales y eficaces.',

    'natal:mars_in_cancer':
      'La energia de accion esta profundamente conectada al estado emocional del momento presente. Cuando hay seguridad y motivacion afectiva, la capacidad de cuidar y proteger es extraordinaria y sostenida. En los conflictos, el comportamiento puede oscilar entre la retirada defensiva y reacciones indirectas que expresan mas de lo que parecen.',

    'natal:mars_in_leo':
      'La energia de accion es teatral, generosa y orientada a dejar una marca visible y duradera. Hay un placer genuino en liderar y en realizar hazanas que generen admiracion y reconocimiento. El ego puede inflamar los conflictos — la necesidad de tener razon y de no ser irrespetado puede transformar desacuerdos pequenos en cuestiones de honor.',

    'natal:mars_in_virgo':
      'La energia de accion es meticulosa, orientada a la eficiencia y aplicada con discernimiento cuidadoso. Hay una capacidad natural de identificar el cuello de botella de cualquier sistema y de actuar directamente sobre el. El perfeccionismo puede retrasar la ejecucion, pero lo que se hace con esta posicion tiende a ser solido y bien acabado.',

    'natal:mars_in_libra':
      'La energia de accion se activa mas facilmente en pareja que de forma solitaria e independiente. Hay una tendencia a aplazar decisiones y acciones hasta que el camino mas justo y equilibrado sea claramente identificado. El conflicto directo es incomodo por naturaleza — la estrategia preferida es la negociacion y el encuentro de terminos razonables.',

    'natal:mars_in_scorpio':
      'La energia de accion es concentrada, estrategica y orientada por una determinacion que rara vez se rinde antes de alcanzar el objetivo propuesto. La intensidad es una marca constante — no hay termino medio cuando Marte esta en Escorpio. El conflicto se toma en serio, con larga memoria tanto para alianzas como para traiciones.',

    'natal:mars_in_sagittarius':
      'La energia de accion es entusiasta, expansiva y poco interesada en restricciones o limites impuestos externamente. La motivacion viene de una vision amplia de adonde se quiere llegar, no de los pasos concretos e inmediatos que separan del objetivo. La impulsividad puede generar comienzos brillantes seguidos de declives de interes antes de la conclusion.',

    'natal:mars_in_capricorn':
      'La energia de accion es contenida, estrategica y orientada al largo plazo de forma consistente. Cada paso se calcula en funcion del objetivo final — la impulsividad no tiene espacio en esta posicion. La ambicion es real y duradera; lo que se decide alcanzar rara vez se abandona antes de conquistarlo.',

    'natal:mars_in_aquarius':
      'La energia de accion se activa con causas colectivas, innovaciones y contextos que desafien el statu quo establecido. Hay resistencia instintiva a cualquier forma de autoridad que no haya sido legitimada por la razon o el consenso. La rebeldia puede ser constructiva cuando se canaliza hacia transformaciones genuinas y sostenibles.',

    'natal:mars_in_pisces':
      'La energia de accion es difusa, instintiva y guiada mas por impulsos internos que por planes racionales y estructurados. La motivacion se sostiene mejor cuando hay una dimension de servicio o de proposito espiritual involucrada. La agresividad directa es rara — el conflicto tiende a evitarse o sublimarse en actividad creativa.',

    // ─── Jupiter ─────────────────────────────────────────────────────────────
    'natal:jupiter_in_aries':
      'La expansion ocurre mediante la iniciativa, el pionerismo y la capacidad de actuar antes que los demas. Hay una aptitud natural para ver oportunidades donde otros ven obstaculos y actuar sobre ellas con confianza. El exceso puede venir de la impulsividad o de la sobreestimacion de las propias fuerzas antes de evaluar los recursos disponibles.',

    'natal:jupiter_in_taurus':
      'La expansion ocurre mediante la consistencia, la acumulacion gradual y la conexion profunda con los recursos materiales y naturales. Hay un talento natural para identificar lo que tiene valor duradero e invertir en ello con paciencia y discernimiento. El exceso puede aparecer como acumulacion mas alla de lo necesario o resistencia a soltar lo que ya no sirve.',

    'natal:jupiter_in_gemini':
      'La expansion ocurre mediante el conocimiento, la comunicacion y la multiplicacion de conexiones y perspectivas. Hay una capacidad natural de absorber informacion de fuentes diversas y sintetizarla de forma accesible e inspiradora. El desafio esta en profundizar en vez de solo ampliar — el exceso puede manifestarse como dispersion intelectual.',

    'natal:jupiter_in_cancer':
      'La expansion ocurre mediante el cuidado, la familia y la conexion emocional con raices y pertenencia. Hay una generosidad natural que se expresa en la acogida del otro y en la creacion de ambientes nutritivos y seguros. El exceso puede surgir como proteccionismo exagerado o dificultad para permitir el crecimiento autonomo de quien se ama.',

    'natal:jupiter_in_leo':
      'La expansion ocurre mediante la expresion creativa, el liderazgo natural y el impacto genuino que se genera en los demas. Hay un magnetismo natural que atrae reconocimiento y colaboradores dispuestos a embarcarse en proyectos ambiciosos. El exceso puede aparecer como arrogancia o necesidad exagerada de admiracion y centralidad.',

    'natal:jupiter_in_virgo':
      'La expansion ocurre mediante el servicio, la mejora continua de los sistemas y la aplicacion practica del conocimiento. Hay una capacidad natural de identificar donde los sistemas pueden ser mas eficientes y de implementar mejoras de forma metodica. El exceso puede manifestarse como perfeccionismo que impide el avance o critica excesiva de lo que podria ser diferente.',

    'natal:jupiter_in_libra':
      'La expansion ocurre mediante las relaciones, las alianzas estrategicas y la capacidad de crear puentes entre diferentes partes. Hay una aptitud natural para la diplomacia y para encontrar soluciones que satisfagan diferentes intereses al mismo tiempo. El exceso puede surgir como dependencia de validacion externa o dificultad para tomar posiciones claras.',

    'natal:jupiter_in_scorpio':
      'La expansion ocurre mediante la profundidad, la transformacion y la capacidad de tocar lo oculto en los procesos y las personas. Hay una aptitud natural para la investigacion, para manejar crisis y para encontrar recursos donde otros no ven posibilidades. El exceso puede manifestarse como obsesion por el control o dificultad para confiar en los procesos naturales.',

    'natal:jupiter_in_sagittarius':
      'La expansion ocurre de forma natural y abundante — esta es una de las posiciones de mayor afinidad para Jupiter. Hay un optimismo genuino, una apertura al mundo y una capacidad de transformar experiencias en sabiduria aplicable. El exceso puede aparecer como promesas mayores que la capacidad de cumplir o huida de las consecuencias inmediatas.',

    'natal:jupiter_in_capricorn':
      'La expansion ocurre mediante la disciplina, la reputacion construida con el tiempo y la inversion estrategica en el largo plazo. El crecimiento rara vez es rapido, pero tiende a ser solido, resistente y respetado. El exceso puede aparecer como un conservadurismo que impide aprovechar oportunidades fuera de los caminos conocidos.',

    'natal:jupiter_in_aquarius':
      'La expansion ocurre mediante la innovacion, la colaboracion en red y el compromiso con ideas que beneficien a colectividades. Hay una capacidad natural de ver mas alla del paradigma vigente y de inspirar cambios de gran escala en las estructuras sociales. El exceso puede aparecer como distanciamiento de las necesidades individuales en nombre de causas abstractas.',

    'natal:jupiter_in_pisces':
      'La expansion ocurre mediante la compasion, la espiritualidad y la apertura genuina al misterio de la existencia. Hay una generosidad natural que va mas alla de los limites del ego, con una capacidad de conexion con algo mayor y mas abarcador. El exceso puede aparecer como escapismo, limites laxos o dificultad para distinguir fe genuina de autoengano.',

    // ─── Saturno ─────────────────────────────────────────────────────────────
    'natal:saturn_in_aries':
      'La disciplina necesita desarrollarse en el area de la accion autonoma y la asertividad personal. El desafio de esta generacion es aprender a liderar sin atropellar y a actuar con consistencia sin depender de la adrenalina del momento. La madurez trae una capacidad de iniciativa mas consciente, planificada y sostenida.',

    'natal:saturn_in_taurus':
      'La disciplina se desarrolla en el area de los recursos, el valor propio y la seguridad material. Esta generacion tiende a cargar creencias limitantes sobre escasez o indignidad que necesitan ser cuestionadas y transformadas. Con el tiempo, se construye una relacion madura con los bienes materiales y con el reconocimiento del propio valor.',

    'natal:saturn_in_gemini':
      'La disciplina se desarrolla en el area de la comunicacion, el aprendizaje y el pensamiento estructurado. Esta generacion puede enfrentar inseguridad intelectual o dificultad para comunicar ideas con claridad en los primeros anos. Con la practica consistente, se desarrolla una mente capaz de sostener razonamientos complejos y comunicarlos con precision.',

    'natal:saturn_in_cancer':
      'La disciplina se desarrolla en el area de las emociones, la familia y el cuidado del otro y de si mismo. Esta generacion puede haber aprendido que mostrar vulnerabilidad es arriesgado, creando patrones de contencion emocional dificiles de aliviar. La madurez pasa por aprender a nutrirse a si mismo con la misma responsabilidad dedicada al mundo exterior.',

    'natal:saturn_in_leo':
      'La disciplina se desarrolla en el area de la autoexpresion, la creatividad y el liderazgo autentico. Esta generacion puede sentir bloqueos en la capacidad de brillar o de ocupar el centro de la atencion, muchas veces por miedo al juicio externo. Con el tiempo, se desarrolla una autoridad genuina que no depende de la validacion constante de los demas.',

    'natal:saturn_in_virgo':
      'La disciplina se desarrolla en el area del servicio, la salud y el perfeccionamiento continuo de si mismo y de los sistemas. Esta generacion puede cargar exigencias extremadamente altas consigo misma y con los demas. La madurez trae la comprension de que la perfeccion es un proceso, no un estado final, y que el cuidado del cuerpo es tambien cuidado del alma.',

    'natal:saturn_in_libra':
      'La disciplina se desarrolla en el area de las relaciones, la justicia y el equilibrio entre dar y recibir. Esta generacion enfrenta el desafio de construir alianzas basadas en reciprocidad real, no solo en apariencia de armonia. Con el tiempo, se aprende a negociar de forma justa y a mantener los propios limites dentro de los vinculos significativos.',

    'natal:saturn_in_scorpio':
      'La disciplina se desarrolla en el area del poder, la transformacion y la intimidad emocional profunda. Esta generacion puede cargar miedos ligados a la perdida de control, la traicion o las crisis de renovacion psiquica. Con el tiempo, se desarrolla una capacidad extraordinaria de atravesar crisis sin destruirse en el proceso.',

    'natal:saturn_in_sagittarius':
      'La disciplina se desarrolla en el area de las creencias, la filosofia personal y la busqueda de significado autentico. Esta generacion cuestiona profundamente las estructuras religiosas o filosoficas heredadas, necesitando construir una vision de mundo propia. Con el tiempo, se desarrolla una sabiduria que une libertad de pensamiento con responsabilidad real.',

    'natal:saturn_in_capricorn':
      'La disciplina se desarrolla en el propio dominio de Saturno, haciendo esta posicion particularmente exigente en cuanto a resultados concretos y sentido del deber. Esta generacion tiende a tener una relacion seria con la autoridad, la responsabilidad y la conquista a lo largo del tiempo. Con la madurez, el rigor puede transformarse en sabiduria practica genuina y consistente.',

    'natal:saturn_in_aquarius':
      'La disciplina se desarrolla en el area de las estructuras colectivas, la innovacion responsable y la libertad dentro de los sistemas. Esta generacion enfrenta la tension entre la necesidad de transformar lo establecido y el riesgo de caos por el cambio irresponsable. Con el tiempo, se aprende a reformar sin destruir y a innovar sin descuidar a quienes dependen de la estructura.',

    'natal:saturn_in_pisces':
      'La disciplina se desarrolla en el area de la espiritualidad, la compasion con limites y la estructura de la vida interior. Esta generacion puede sentir dificultad para estructurar la vida espiritual o para distinguir responsabilidad genuina de culpa difusa. Con la madurez, se desarrolla una espiritualidad madura que convive con la realidad sin disolverse en ella.',

    // ─── Urano ───────────────────────────────────────────────────────────────
    'natal:uranus_in_aries':
      'La generacion con Urano en Aries trae un impulso colectivo por la liberacion radical de la autoridad y por el pionerismo a cualquier costo. La necesidad individual de libertad de accion es intensa y la resistencia a cualquier forma de control externo es marcada. La innovacion se da por la fuerza de la individualidad y el coraje de inaugurar lo que aun no existe.',

    'natal:uranus_in_taurus':
      'La generacion con Urano en Tauro cuestiona las estructuras establecidas de valor, propiedad y relacion con los recursos naturales. Individualmente, puede haber tension entre el deseo de estabilidad y la necesidad de cambio en los fundamentos materiales de la vida. La innovacion se da de forma lenta pero radical — transforma lo que parecia inmutable en las bases economicas y naturales.',

    'natal:uranus_in_gemini':
      'La generacion con Urano en Geminis trae una ruptura en los modelos de comunicacion, educacion e intercambio de informacion. El pensamiento de esta generacion esta marcado por un inconformismo con las narrativas dominantes y por una curiosidad que no acepta respuestas hechas. La innovacion se da por el lenguaje y la multiplicacion acelerada de las formas de expresion y conexion.',

    'natal:uranus_in_cancer':
      'La generacion con Urano en Cancer cuestiona las estructuras familiares tradicionales y las formas convencionales de pertenencia. Individualmente, puede haber oscilaciones entre la necesidad de raices y el impulso de redefinir lo que es hogar y familia. La innovacion se da en las bases afectivas y en los modelos colectivos de cuidado y proteccion.',

    'natal:uranus_in_leo':
      'La generacion con Urano en Leo trae una ruptura en los modelos de liderazgo, creatividad y autoexpresion. Hay un impulso por la autenticidad que no acepta papeles impuestos y por una expresion creativa que desafia convenciones esteticas y culturales. La innovacion se da por la originalidad radical de la autoexpresion y el rechazo al conformismo creativo.',

    'natal:uranus_in_virgo':
      'La generacion con Urano en Virgo trae una ruptura en los modelos de trabajo, salud y servicio colectivo. Hay una tendencia a cuestionar sistemas establecidos de salud y a buscar enfoques alternativos de eficiencia y cuidado. La innovacion se da por los detalles y las transformaciones en los procesos y las practicas cotidianas.',

    'natal:uranus_in_libra':
      'La generacion con Urano en Libra cuestiona las estructuras del matrimonio, las alianzas legales y los acuerdos sociales. Hay una necesidad de relaciones que respeten la individualidad de cada uno y resistencia a vinculos basados en papeles tradicionales rigidos. La innovacion se da en las formas de asociacion, de justicia y en los contratos que regulan la convivencia.',

    'natal:uranus_in_scorpio':
      'La generacion con Urano en Escorpio trae una ruptura en las estructuras de poder, sexualidad y transformacion colectiva profunda. Hay una intensidad particular en la busqueda de autenticidad emocional y una resistencia a las formas convencionales de control y dominacion. La innovacion se da en las profundidades — donde otros no se atreven a mirar o cuestionar.',

    'natal:uranus_in_sagittarius':
      'La generacion con Urano en Sagitario cuestiona las estructuras religiosas, filosoficas y educativas establecidas por siglos. Hay un impulso fuerte por la libertad de creencia y por filosofias de vida que desafien las fronteras de lo convencional. La innovacion se da en la expansion de los horizontes de lo que es posible creer, explorar y experimentar colectivamente.',

    'natal:uranus_in_capricorn':
      'La generacion con Urano en Capricornio trae una ruptura en las estructuras institucionales, gubernamentales y corporativas. Hay una tension entre la ambicion por lo establecido y el impulso de transformar las estructuras de poder desde dentro hacia fuera. La innovacion se da por la reorganizacion de las jerarquias y de las formas de autoridad y responsabilidad colectiva.',

    'natal:uranus_in_aquarius':
      'Urano en Acuario habita su dominio natural, intensificando la busqueda de libertad colectiva, innovacion tecnologica y transformacion social profunda. El inconformismo con cualquier forma de limitacion al pensamiento libre es marcado en esta generacion. La innovacion se da por la vision del futuro y la capacidad de crear redes que transformen estructuras sociales y politicas.',

    'natal:uranus_in_pisces':
      'La generacion con Urano en Piscis trae una ruptura en las estructuras espirituales y en la relacion colectiva con lo invisible y lo trascendente. Hay una apertura a formas no convencionales de espiritualidad y una sensibilidad aguda a los cambios en las corrientes colectivas del inconsciente. La innovacion se da por la disolucion de las fronteras entre lo sagrado y lo cotidiano.',

    // ─── Neptuno ─────────────────────────────────────────────────────────────
    'natal:neptune_in_aries':
      'La generacion con Neptuno en Aries carga una espiritualidad ligada a la accion, el heroismo y el ideal del guerrero que actua por el bien colectivo. Los suenos colectivos de esta generacion pasan por la lucha por un mundo mas autentico y la creencia en el poder del individuo de cambiar el curso de las cosas. La tentacion es el fanatismo — la idealizacion excesiva de la propia causa como superior a las demas.',

    'natal:neptune_in_taurus':
      'La generacion con Neptuno en Tauro carga una espiritualidad ligada a la tierra, la belleza material y la creencia de que la abundancia es sagrada. Los suenos colectivos pasan por la busqueda de una relacion mas armoniosa con los recursos naturales y el ideal de una prosperidad que genuinamente nutre. La tentacion es la materializacion de lo espiritual o la espiritualizacion excesiva de lo material.',

    'natal:neptune_in_gemini':
      'La generacion con Neptuno en Geminis carga una espiritualidad ligada al lenguaje, las ideas y la multiplicidad de perspectivas y narrativas. Los suenos colectivos pasan por la comunicacion universal y la creencia en el poder de las palabras de transformar la realidad colectiva. La tentacion es la confusion entre mito y realidad o la proliferacion de narrativas sin anclaje en lo concreto.',

    'natal:neptune_in_cancer':
      'La generacion con Neptuno en Cancer carga una espiritualidad ligada al hogar, la nacion y los lazos de sangre y afecto. Los suenos colectivos pasan por un ideal de proteccion y pertenencia, con nostalgia del pasado como paraiso perdido. La tentacion es el nacionalismo emocional o la disolucion de los limites del yo en las necesidades de la familia y el grupo.',

    'natal:neptune_in_leo':
      'La generacion con Neptuno en Leo carga una espiritualidad ligada a la creatividad, el carisma y el ideal del heroe que inspira masas. Los suenos colectivos pasan por el glamour, el espectaculo y la creencia en el poder transformador de la expresion artistica y personal. La tentacion es la ilusion de grandeza o la confusion entre fama y trascendencia real.',

    'natal:neptune_in_virgo':
      'La generacion con Neptuno en Virgo carga una espiritualidad ligada al servicio, la salud colectiva y la busqueda de perfeccion. Los suenos colectivos pasan por un ideal de cura y de perfeccionamiento del tejido social. La tentacion es el perfeccionismo que paraliza o la disolucion de la identidad en el servicio incansable a los demas.',

    'natal:neptune_in_libra':
      'La generacion con Neptuno en Libra carga una espiritualidad ligada a la armonia, la justicia y el ideal del amor universal. Los suenos colectivos pasan por un mundo mas equilibrado y la creencia en el poder de la diplomacia, el arte y la mediacion. La tentacion es la ilusion relacional o la disolucion de los limites personales en nombre de la armonia superficial.',

    'natal:neptune_in_scorpio':
      'La generacion con Neptuno en Escorpio carga una espiritualidad ligada a la transformacion, el ocultismo y la disolucion de tabues colectivos. Los suenos colectivos pasan por la exploracion de los territorios sombrios de la psique y la creencia en el poder de la crisis como camino de renovacion profunda. La tentacion es el escapismo por las sustancias o la fascinacion con el abismo.',

    'natal:neptune_in_sagittarius':
      'La generacion con Neptuno en Sagitario carga una espiritualidad ligada a la busqueda de sentido, el ecumenismo y la apertura a espiritualidades del mundo entero. Los suenos colectivos pasan por la creencia de que todas las tradiciones espirituales apuntan a una verdad mayor y universal. La tentacion es el sincretismo sin profundidad o la fuga de la realidad por el ideal espiritual.',

    'natal:neptune_in_capricorn':
      'La generacion con Neptuno en Capricornio carga una espiritualidad ligada a las estructuras de poder y el ideal de una autoridad que genuinamente sirve al bien colectivo. Los suenos colectivos pasan por la reforma de las estructuras existentes desde dentro, con responsabilidad y vision. La tentacion es la dilucion de las fronteras eticas en nombre de la eficiencia o la ambicion.',

    'natal:neptune_in_aquarius':
      'La generacion con Neptuno en Acuario carga una espiritualidad ligada a la tecnologia, las redes y el ideal de una humanidad profundamente interconectada. Los suenos colectivos pasan por la creencia en el potencial transformador de la informacion compartida libremente entre todos. La tentacion es la disolucion de la identidad individual en las narrativas colectivas o la confusion entre virtualidad y realidad.',

    'natal:neptune_in_pisces':
      'Neptuno en Piscis habita su dominio natural, intensificando la disolucion de fronteras colectivas y la busqueda de trascendencia. Los suenos de esta generacion pasan por la compasion universal, la crisis de las estructuras que fragmentan a la humanidad y el anhelo de una espiritualidad encarnada y genuina. La tentacion es el colapso de la distincion entre empatia y fusion o entre fe autentica e ilusion comoda.',

    // ─── Pluton ──────────────────────────────────────────────────────────────
    'natal:pluto_in_aries':
      'La generacion con Pluton en Aries trajo transformaciones profundas en los conceptos de individualidad, liderazgo y poder personal. La fuerza del yo fue tanto el motor como el campo de batalla de las transformaciones colectivas de esa era historica. Como arquetipo generacional, carga el impulso de regeneracion por la accion radical y el enfrentamiento con las estructuras que limitan la autonomia.',

    'natal:pluto_in_taurus':
      'La generacion con Pluton en Tauro presencio y genero transformaciones profundas en las estructuras economicas y en la relacion con la tierra y los recursos naturales. El poder y la riqueza fueron concentrados, cuestionados y redistribuidos de formas que redisenaron el mapa social y productivo. Como arquetipo, carga la tension esencial entre acumulacion y renovacion de los recursos fundamentales.',

    'natal:pluto_in_gemini':
      'La generacion con Pluton en Geminis transformo profundamente las estructuras de comunicacion, informacion y transporte colectivo. La proliferacion de nuevos lenguajes, medios e ideologias caracterizo y definio esa era de forma marcada. Como arquetipo, carga el poder transformador de las ideas y el riesgo de la propaganda y la fragmentacion del discurso colectivo.',

    'natal:pluto_in_cancer':
      'La generacion con Pluton en Cancer vivio transformaciones profundas en los conceptos de nacion, familia y pertenencia colectiva. Guerras mundiales y desplazamientos masivos redisenaron las fronteras del hogar y la identidad colectiva de forma irreversible. Como arquetipo, carga la intensidad del apego a las raices y el poder destructor y regenerador de las fuerzas afectivas y nacionales.',

    'natal:pluto_in_leo':
      'La generacion con Pluton en Leo transformo profundamente las estructuras de poder, liderazgo y expresion individual a escala global. El culto a la personalidad, el surgimiento de las estrellas de masas y las guerras de ego caracterizaron esa era de formas hasta entonces desconocidas. Como arquetipo, carga el impulso de afirmar el yo mas alla de cualquier limite y el riesgo del narcisismo colectivo.',

    'natal:pluto_in_virgo':
      'La generacion con Pluton en Virgo transformo profundamente las estructuras de salud, trabajo y servicio a la colectividad. La revolucion en los servicios de salud, el cuestionamiento de las condiciones de trabajo y la emergencia de la conciencia ecologica marcaron a esa generacion de forma definitiva. Como arquetipo, carga el impulso de perfeccionamiento sistemico y la tension entre servir y destruirse en el servicio.',

    'natal:pluto_in_libra':
      'La generacion con Pluton en Libra transformo profundamente las estructuras del matrimonio, la justicia y las alianzas en todas las dimensiones. El aumento de las separaciones, el surgimiento de nuevos modelos de relacion y las transformaciones en el derecho de familia marcaron esa era de forma visible y duradera. Como arquetipo, carga la tension entre el ideal de armonia y la necesidad de honrar los propios limites.',

    'natal:pluto_in_scorpio':
      'La generacion con Pluton en Escorpio crecio en medio de transformaciones radicales en los temas de muerte, sexualidad y poder a escala colectiva. La epidemia de VIH/SIDA, la revolucion sexual y las crisis de poder politico definieron el telon de fondo de esta generacion de forma intensa. Como arquetipo, carga una intimidad con la transformacion y una capacidad de mirar al abismo sin desviar la mirada.',

    'natal:pluto_in_sagittarius':
      'La generacion con Pluton en Sagitario crecio en medio de transformaciones profundas en las estructuras religiosas, filosoficas y en las fronteras geopoliticas del mundo. La globalizacion acelerada, el fundamentalismo religioso y el choque de civilizaciones marcaron esa era con fuerza y urgencia. Como arquetipo, carga tanto el impulso de trascender fronteras como el riesgo del fanatismo ideologico.',

    'natal:pluto_in_capricorn':
      'La generacion con Pluton en Capricornio presencia la transformacion profunda de las estructuras institucionales — gobiernos, corporaciones, sistemas financieros y jerarquias establecidas. La crisis de confianza en las instituciones y la concentracion de poder que precede a la reestructuracion definen esa era en curso. Como arquetipo, carga tanto el peso del colapso como el potencial de reconstruccion sobre bases mas solidas y justas.',

    'natal:pluto_in_aquarius':
      'La generacion con Pluton en Acuario atraviesa la transformacion profunda de las estructuras colectivas, la tecnologia y los sistemas de red que organizan a la humanidad. La inteligencia artificial, los cambios en el contrato social y la redistribucion del poder entre individuos y colectivos definen esta era en curso con velocidad creciente. Como arquetipo, carga el potencial de una libertad colectiva sin precedentes y el riesgo de una vigilancia igualmente sin precedentes.',

    'natal:pluto_in_pisces':
      'Como arquetipo prospectivo, Pluton en Piscis promete una transformacion profunda en las estructuras espirituales y en la relacion colectiva con el inconsciente y lo trascendente. La disolucion de las fronteras que separan las formas de vida y de conciencia puede ser tanto la mayor conquista como el mayor riesgo de esta era por venir. La invitacion de esta era es integrar la profundidad espiritual con la responsabilidad colectiva por el mundo compartido.',
  },

  'it-IT': {
    // Regra: sem acentos e sem apóstrofos
    // ─── Sole ────────────────────────────────────────────────────────────────
    'natal:sun_in_aries':
      'La identita si costruisce attraverso la azione diretta, la iniziativa e la spinta a essere il primo. Uno spirito pioniere valorizza la autonomia sopra la sicurezza e tende ad agire prima di riflettere. Il senso di se si rafforza quando ci sono sfide reali da superare e risultati concreti da conquistare.',

    'natal:sun_in_taurus':
      'La identita si ancora nella costanza, nella stabilita materiale e nel piacere sensoriale. Il senso del proprio valore cresce con quanto viene costruito con impegno e pazienza, non con quanto arriva in modo improvviso o ereditato. I cambiamenti bruschi provocano resistenza, ma la determinazione davanti agli ostacoli e una delle maggiori forze di questa posizione.',

    'natal:sun_in_gemini':
      'La identita si esprime attraverso la curiosita intellettuale e la capacita di comunicare idee con fluidita e versatilita. Esiste un bisogno genuino di varieta e stimolo mentale che puo rendere la costanza una sfida reale. Il contatto con persone e prospettive diverse alimenta continuamente il senso di se.',

    'natal:sun_in_cancer':
      'La identita e profondamente intrecciata con le radici, la memoria affettiva e il senso di appartenenza. La intuizione emotiva e acuta e serve da bussola nelle decisioni piu importanti della vita. Il bisogno di sicurezza interiore e il perno attorno al quale tutta la personalita si organizza e si esprime.',

    'natal:sun_in_leo':
      'La identita si manifesta attraverso la espressione creativa, il calore umano e il desiderio genuino di essere riconosciuto. La generosita naturale e reale, ma esiste una sensibilita significativa al giudizio e alla indifferenza altrui. Il senso di scopo si rafforza quando esiste spazio per brillare senza dover competere per la attenzione.',

    'natal:sun_in_virgo':
      'La identita si costruisce attraverso la utilita, la analisi attenta e la cura dei dettagli. Il perfezionismo puo essere sia una forza sia una fonte di autocritica eccessiva applicata a se stessi e agli altri. Il senso del proprio valore si approfondisce quando il lavoro svolto contribuisce in modo concreto a qualcosa di piu grande.',

    'natal:sun_in_libra':
      'La identita si definisce in relazione con gli altri — il senso di se emerge nello specchio delle relazioni e degli scambi. Lo istinto per la equita e la armonia e genuino, ma puo rendere lento il processo di decisione solitaria. Il gusto estetico raffinato e una espressione diretta e coerente della personalita.',

    'natal:sun_in_scorpio':
      'La identita e segnata dalla profondita emotiva, dalla intensita e dal bisogno di autenticita nelle relazioni. La superficialita non ha attrattiva; cio che conta e quanto rimane nascosto, vero e duraturo. La capacita di rigenerarsi dopo periodi di crisi e uno dei segni piu forti di questa posizione.',

    'natal:sun_in_sagittarius':
      'La identita si orienta verso la ricerca di senso, la espansione e la liberta di esplorare orizzonti. Un entusiasmo naturale apre porte e ispira gli altri, ma il impegno verso un unico cammino puo essere una sfida interna. La filosofia di vita viene presa sul serio e tende a evolvere con le esperienze accumulate.',

    'natal:sun_in_capricorn':
      'La identita si costruisce attraverso la conquista graduale, la disciplina e il rispetto guadagnato nel tempo. La autorita nasce da quanto viene provato nella pratica, non dal prestigio immediato o dal titolo ereditato. La maturita porta di solito piu apertura e leggerezza di quanto gli anni di formazione suggeriscano.',

    'natal:sun_in_aquarius':
      'La identita si esprime attraverso la originalita, il pensiero indipendente e il senso di appartenenza a qualcosa di collettivo e piu grande del proprio io. Il bisogno di liberta intellettuale non e negoziabile e ogni imposizione viene sentita come una violazione. Dietro la apparente freddezza emotiva esiste un impegno genuino verso ideali e cause.',

    'natal:sun_in_pisces':
      'La identita e porosa, empatica e capace di assorbire profondamente lo ambiente circostante. La immaginazione e la sensibilita spirituale sono forze reali, ma possono rendere sfumato il confine tra il proprio io e gli altri. Il cammino di conoscenza di se passa dallo imparare a distinguere cio che e proprio da cio che e proiezione o fusione con il contesto.',

    // ─── Luna ────────────────────────────────────────────────────────────────
    'natal:moon_in_aries':
      'I bisogni emotivi si esprimono in modo rapido, diretto e con poca mediazione tra il sentimento e la risposta. La reattivita emotiva e intensa, ma le emozioni passano con una velocita simile a quella del loro arrivo. La sensazione di agire e di avere iniziativa da sicurezza emotiva; la inerzia prolungata viene sentita come disagio reale.',

    'natal:moon_in_taurus':
      'I bisogni emotivi si centrano sulla stabilita, sul comfort fisico e sulla prevedibilita dei legami. Esiste una lealta profonda verso le persone e gli ambienti amati, insieme a una resistenza naturale ai cambiamenti emotivi bruschi. Il contatto con la natura, i rituali quotidiani e i piaceri sensoriali alimentano con costanza lo equilibrio interiore.',

    'natal:moon_in_gemini':
      'I bisogni emotivi si esprimono attraverso lo scambio verbale, la socializzazione e la stimolazione intellettuale costante. La elaborazione emotiva passa dal dialogo; parlare di cio che si sente aiuta a comprendere e organizzare le emozioni interne. La varieta emotiva e naturale e non indica superficialita, ma un modo particolare di mantenere il legame con il mondo.',

    'natal:moon_in_cancer':
      'I bisogni emotivi sono profondi, istintivi e fortemente legati al nucleo familiare e al senso di appartenenza. La memoria affettiva e potente e le emozioni del passato restano attive e influenti nel presente. Prendersi cura degli altri e una forma naturale di espressione emotiva e fonte di nutrimento reciproco.',

    'natal:moon_in_leo':
      'I bisogni emotivi includono riconoscimento, apprezzamento genuino e spazio per esprimersi con autenticita. La generosita emotiva e reale, ma esiste anche una sensibilita significativa al disinteresse o alla indifferenza degli altri. Lo orgoglio serve da scudo — la vulnerabilita viene condivisa solo quando esiste fiducia sufficientemente stabilita.',

    'natal:moon_in_virgo':
      'I bisogni emotivi si organizzano attorno allo ordine, alla utilita e alla sensazione di competenza. La cura degli altri si esprime in gesti pratici e attenzione ai dettagli piu che in dimostrazioni affettive aperte. La autocritica emotiva puo essere intensa; imparare a trattare i propri sentimenti con la stessa gentilezza dedicata agli altri e un cammino di maturazione.',

    'natal:moon_in_libra':
      'I bisogni emotivi si realizzano nella armonia relazionale e nella assenza di conflitto aperto. Lo istinto per lo equilibrio e forte, ma puo portare a sopprimere i propri bisogni in nome della pace. Ambienti esteticamente gradevoli e relazioni basate su reciprocita genuina alimentano il benessere emotivo.',

    'natal:moon_in_scorpio':
      'I bisogni emotivi sono intensi, esigenti e difficili da soddisfare attraverso la superficie delle interazioni. La resa emotiva e totale quando esiste fiducia stabilita, ma il tradimento o la delusione possono lasciare segni duraturi. La capacita di immergersi nelle profondita della propria psiche e una forza che, usata con coscienza, genera trasformazione reale.',

    'natal:moon_in_sagittarius':
      'I bisogni emotivi si esprimono attraverso la liberta, il movimento e la ricerca di senso nelle esperienze vissute. Il confinamento emotivo viene sentito come soffocante; lo spazio per esplorare e un bisogno reale, non un capriccio passeggero. Lo ottimismo naturale serve da protezione emotiva e fonte di resilienza davanti alle avversita.',

    'natal:moon_in_capricorn':
      'I bisogni emotivi sono contenuti, discreti e raramente espressi in modo spontaneo o aperto. La responsabilita e la autosufficienza vengono valorizzate, ma possono mascherare un bisogno profondo di conferma che raramente viene verbalizzato. La maturazione emotiva porta di solito piu apertura alla vulnerabilita nel corso del tempo.',

    'natal:moon_in_aquarius':
      'I bisogni emotivi si esprimono in modo non convenzionale, con enfasi sulla amicizia, sulla liberta e sul senso di appartenenza ai gruppi. La freddezza emotiva percepita dagli altri e spesso un modo di mantenere la indipendenza, non assenza di sentimento. La intensita emotiva appare con forza quando valori profondi o ideali vengono minacciati.',

    'natal:moon_in_pisces':
      'I bisogni emotivi sono diffusi, empatici e permeabili in modo intenso alla esperienza altrui. La sensibilita e straordinaria, il che puo essere sia un dono sia una vulnerabilita in ambienti emotivamente pesanti. Il ritiro periodico, la creativita e la spiritualita sono modi naturali e necessari di ricaricare lo equilibrio interno.',

    // ─── Mercurio ────────────────────────────────────────────────────────────
    'natal:mercury_in_aries':
      'Il pensiero e rapido, diretto e orientato alla azione immediata. Esiste poca tolleranza per i giri di parole — la comunicazione va dritta al punto, a volte senza i filtri che ne attenuerebbero lo impatto. La agilita mentale e una forza reale, ma la impazienza verso ragionamenti lenti puo troncare idee prima che maturino del tutto.',

    'natal:mercury_in_taurus':
      'Il pensiero e metodico, concreto e orientato ad applicazioni pratiche e durature. Prima di esprimere una idea, esiste una tendenza naturale a elaborarla internamente per un tempo considerevole. Una volta formata una conclusione, cambia con difficolta — la coerenza intellettuale viene valorizzata piu della novita.',

    'natal:mercury_in_gemini':
      'Il pensiero e agile, associativo e capace di muoversi tra molti temi con facilita e piacere. La comunicazione e un piacere naturale e il contatto con punti di vista diversi alimenta la propria elaborazione mentale. La mente puo disperdersi quando manca stimolo sufficiente per mantenerla impegnata e in movimento.',

    'natal:mercury_in_cancer':
      'Il pensiero e intuitivo, guidato dalla memoria e fortemente colorato dalle emozioni del momento. Le idee nascono spesso da impressioni soggettive e da una sensibilita acuta al clima emotivo dello ambiente. La immaginazione e fertile, ma la oggettivita puo risentirne quando esiste un forte coinvolgimento affettivo con il tema.',

    'natal:mercury_in_leo':
      'Il pensiero e drammatico, creativo e rivolto a comunicare con impatto e presenza. Esiste un senso naturale di narrazione — le idee vengono presentate in modo da catturare la attenzione di chi ascolta. La vanita intellettuale puo emergere quando le proprie idee vengono messe in discussione, ma la capacita di ispirare con le parole e genuina.',

    'natal:mercury_in_virgo':
      'Il pensiero e analitico, preciso e orientato a distinguere con chiarezza lo essenziale dal superfluo. Esiste una capacita naturale di individuare incoerenze e di organizzare informazioni complesse in modo accessibile e chiaro. La autocritica applicata al proprio ragionamento puo essere intensa, generando difficolta ad accettare la imperfezione come parte naturale del processo.',

    'natal:mercury_in_libra':
      'Il pensiero si sviluppa meglio nel dialogo — lo scambio di idee e parte centrale del processo di elaborazione mentale. Esiste uno istinto naturale a vedere tutti i lati di una questione, con analisi equilibrate ma anche difficolta ad arrivare a conclusioni definitive. La comunicazione e diplomatica per natura e attenta nel tono.',

    'natal:mercury_in_scorpio':
      'Il pensiero e investigativo, penetrante e poco soddisfatto da risposte superficiali o convenzionali. Esiste una capacita naturale di individuare motivazioni nascoste e di leggere tra le righe delle situazioni con precisione. La comunicazione puo essere diretta fino alla brutalita o strategicamente riservata — raramente occupa la via di mezzo.',

    'natal:mercury_in_sagittarius':
      'Il pensiero e espansivo, filosofico e orientato al quadro generale piu che ai dettagli concreti. Esiste entusiasmo genuino nello scambio di idee e una tendenza a generalizzare in base a schemi ampi di esperienza. La cura dei dettagli puo essere un punto di sviluppo, specialmente quando la precisione e necessaria.',

    'natal:mercury_in_capricorn':
      'Il pensiero e strutturato, pragmatico e orientato a risultati concreti e verificabili. La comunicazione e economica — si dice il necessario, senza eccessi o ornamenti superflui. La profondita intellettuale nasce dalla pazienza di costruire ragionamenti solidi e dalla capacita di mantenere il focus su obiettivi a lungo termine.',

    'natal:mercury_in_aquarius':
      'Il pensiero e originale, non lineare e orientato a connessioni inattese tra campi distanti. Esiste un piacere genuino nel mettere in discussione premesse consolidate e nello esplorare idee che sfidano il senso comune. La comunicazione puo essere brillante e stimolante, ma puo mancare di una dimensione emotiva che faciliti la connessione con chi ascolta.',

    'natal:mercury_in_pisces':
      'Il pensiero e simbolico, intuitivo e spesso organizzato in immagini e metafore prima che in parole concettuali. La distinzione tra fatto e immaginazione puo essere fluida, il che alimenta la creativita ma richiede attenzione alla precisione quando serve. La comunicazione e empatica e poeticamente sensibile allo stato emotivo di chi ascolta.',

    // ─── Venere ──────────────────────────────────────────────────────────────
    'natal:venus_in_aries':
      'Lo affetto si esprime in modo diretto, entusiasta e senza lunghi giri di parole. La attrazione tende a essere immediata e intensa, con poca tolleranza per giochi o ambiguita relazionali che si prolungano. La spontaneita e la onesta vengono molto valorizzate — cio che affascina non si concede senza un certo grado di sfida genuina.',

    'natal:venus_in_taurus':
      'I valori relazionali si ancorano nella lealta, nel comfort sensoriale e nella fiducia costruita nel tempo. Esiste un piacere genuino nelle esperienze che coinvolgono i cinque sensi — gastronomia, musica, tatto, bellezza naturale. La possessivita puo emergere quando il legame viene sentito come minacciato o insicuro.',

    'natal:venus_in_gemini':
      'I valori relazionali includono lo stimolo intellettuale, la leggerezza e la liberta di esplorare forme diverse di connessione. La conversazione e centrale — senza scambio verbale di qualita, lo affetto si raffredda naturalmente con il tempo. La versatilita in amore puo essere scambiata per superficialita, ma riflette una curiosita genuina verso gli altri.',

    'natal:venus_in_cancer':
      'I valori relazionali si organizzano attorno alla protezione, alla cura reciproca e alla intimita emotiva profonda. Lo affetto si esprime con gesti di cura concreti — nutrimento, presenza costante, memoria dei dettagli importanti per la persona amata. La sensibilita ai rifiuti e alta, il che puo generare ritiro quando manca sicurezza emotiva sufficiente.',

    'natal:venus_in_leo':
      'I valori relazionali includono ammirazione genuina, dimostrazioni affettive aperte e la sensazione di essere speciale e unico per chi si ama. La generosita in amore e reale, ma esiste una aspettativa implicita di reciprocita e riconoscimento costante. Il dramma relazionale puo emergere quando la attenzione viene divisa o lo orgoglio viene ferito.',

    'natal:venus_in_virgo':
      'I valori relazionali si esprimono con atti di servizio, attenzione ai dettagli e disponibilita genuina a migliorare la vita della persona amata. Lo affetto raramente viene dichiarato con grandiosita — si manifesta in gesti pratici e costanti nel tempo. La critica puo emergere come forma di cura, ma richiede moderazione per non essere sentita come rifiuto.',

    'natal:venus_in_libra':
      'I valori relazionali si centrano sulla reciprocita, sulla armonia e sulla bellezza della connessione tra due persone. Una sensibilita estetica raffinata si estende alla scelta dei partner e degli ambienti condivisi. Il conflitto aperto viene evitato con destrezza, ma il costo puo essere la difficolta di esprimere in modo diretto i propri bisogni.',

    'natal:venus_in_scorpio':
      'I valori relazionali esigono profondita, intensita e una resa che va oltre la superficie delle interazioni quotidiane. La attrazione e spesso intensa e magnetica, ma la fiducia viene concessa con cautela e messa alla prova nel tempo. La possessivita e la gelosia emergono quando lo investimento emotivo e alto; la lealta attesa e dello stesso livello di quella offerta.',

    'natal:venus_in_sagittarius':
      'I valori relazionali includono liberta, avventura condivisa e spazio per crescere in modo indipendente dentro il legame. La attrazione tende a dirigersi verso persone che espandono orizzonti e portano prospettive nuove sul mondo. Il impegno e possibile, ma richiede che il legame non imprigioni ne limiti la esplorazione personale.',

    'natal:venus_in_capricorn':
      'I valori relazionali si esprimono attraverso il impegno serio, la costruzione graduale e la affidabilita dimostrata nelle azioni. Lo affetto puo sembrare freddo a prima vista — non perche sia assente, ma perche viene dimostrato con atti concreti e presenza costante. La lealta e profonda, cosi come le aspettative di serieta verso il partner.',

    'natal:venus_in_aquarius':
      'I valori relazionali includono amicizia intellettuale, rispetto genuino per la individualita di ciascuno e spazio per cio che e insolito. Le relazioni convenzionali possono non soddisfare pienamente; esiste attrazione per connessioni che sfidano i modelli abituali di cio che una relazione dovrebbe essere. La freddezza emotiva puo essere percepita dove esiste, in realta, un modo non convenzionale di amare.',

    'natal:venus_in_pisces':
      'I valori relazionali sono segnati dalla compassione, dalla resa romantica e da una sensibilita verso la bellezza spirituale ed emotiva della persona amata. La tendenza alla idealizzazione puo creare aspettative difficili da sostenere nella realta quotidiana dei legami. La capacita di amare senza condizioni e reale, ma richiede discernimento per non perdersi interamente negli altri.',

    // ─── Marte ───────────────────────────────────────────────────────────────
    'natal:mars_in_aries':
      'La energia di azione e diretta, intensa e immediata — il corpo agisce prima che la mente finisca di elaborare la situazione. La assertivita viene naturale e non esiste spazio per la indecisione quando lo impulso e forte. La impazienza verso gli ostacoli puo portare a conflitti inutili, ma il coraggio di iniziare raramente manca.',

    'natal:mars_in_taurus':
      'La energia di azione e lenta a partire, ma straordinariamente persistente e resistente una volta avviata. La motivazione e legata a obiettivi tangibili e duraturi, non alla adrenalina della novita o dello imprevisto. Il conflitto viene evitato quando possibile, ma quando il limite viene raggiunto, la reazione e ferma e difficile da invertire.',

    'natal:mars_in_gemini':
      'La energia di azione e versatile, curiosa e distribuita su molti progetti e fronti allo stesso tempo. La motivazione nasce dalla stimolazione intellettuale e dal dinamismo — i compiti monotoni prosciugano rapidamente lo entusiasmo. La parola e uno strumento di azione potente; la argomentazione e la persuasione sono abilita naturali ed efficaci.',

    'natal:mars_in_cancer':
      'La energia di azione e profondamente connessa allo stato emotivo del momento presente. Quando esistono sicurezza e motivazione affettiva, la capacita di curare e proteggere e straordinaria e duratura. Nei conflitti, il comportamento puo oscillare tra il ritiro difensivo e reazioni indirette che esprimono piu di quanto sembrino.',

    'natal:mars_in_leo':
      'La energia di azione e teatrale, generosa e orientata a lasciare un segno visibile e duraturo. Esiste un piacere genuino nel guidare e nel compiere imprese che generino ammirazione e riconoscimento. Lo ego puo infiammare i conflitti — il bisogno di avere ragione e di non essere mancati di rispetto puo trasformare piccoli disaccordi in questioni di onore.',

    'natal:mars_in_virgo':
      'La energia di azione e meticolosa, orientata alla efficienza e applicata con discernimento attento. Esiste una capacita naturale di individuare il collo di bottiglia di qualsiasi sistema e di agire direttamente su di esso. Il perfezionismo puo rallentare la esecuzione, ma quanto viene fatto con questa posizione tende a essere solido e ben rifinito.',

    'natal:mars_in_libra':
      'La energia di azione si attiva piu facilmente in coppia che in modo solitario e indipendente. Esiste una tendenza a rimandare decisioni e azioni finche il cammino piu giusto ed equilibrato non sia chiaramente individuato. Il conflitto diretto e scomodo per natura — la strategia preferita e la negoziazione e la ricerca di termini ragionevoli.',

    'natal:mars_in_scorpio':
      'La energia di azione e concentrata, strategica e guidata da una determinazione che raramente si arrende prima di raggiungere lo obiettivo. La intensita e un segno costante — non esiste via di mezzo quando Marte e in Scorpione. Il conflitto viene preso sul serio, con lunga memoria sia per le alleanze sia per i tradimenti.',

    'natal:mars_in_sagittarius':
      'La energia di azione e entusiasta, espansiva e poco interessata a restrizioni o limiti imposti dallo esterno. La motivazione nasce da una visione ampia di dove si vuole arrivare, non dai passi concreti e immediati che separano dallo obiettivo. La impulsivita puo generare inizi brillanti seguiti da cali di interesse prima della conclusione.',

    'natal:mars_in_capricorn':
      'La energia di azione e contenuta, strategica e orientata al lungo termine in modo coerente. Ogni passo viene calcolato in funzione dello obiettivo finale — la impulsivita non ha spazio in questa posizione. La ambizione e reale e duratura; cio che si decide di raggiungere raramente viene abbandonato prima della conquista.',

    'natal:mars_in_aquarius':
      'La energia di azione viene attivata da cause collettive, da innovazioni e da contesti che sfidano lo status quo consolidato. Esiste resistenza istintiva a qualsiasi forma di autorita non legittimata dalla ragione o dal consenso. La ribellione puo essere costruttiva quando canalizzata verso trasformazioni genuine e sostenibili.',

    'natal:mars_in_pisces':
      'La energia di azione e diffusa, istintiva e guidata piu da impulsi interni che da piani razionali e strutturati. La motivazione si sostiene meglio quando esiste una dimensione di servizio o di scopo spirituale coinvolta. La aggressivita diretta e rara — il conflitto tende a essere evitato o sublimato in attivita creativa.',

    // ─── Giove ───────────────────────────────────────────────────────────────
    'natal:jupiter_in_aries':
      'La espansione avviene attraverso la iniziativa, lo spirito pioniere e la capacita di agire prima degli altri. Esiste una attitudine naturale a vedere opportunita dove gli altri vedono ostacoli e ad agire su di esse con fiducia. Lo eccesso puo nascere dalla impulsivita o dalla sopravvalutazione delle proprie forze prima di valutare le risorse disponibili.',

    'natal:jupiter_in_taurus':
      'La espansione avviene attraverso la costanza, la accumulazione graduale e la connessione profonda con le risorse materiali e naturali. Esiste un talento naturale nel riconoscere cio che ha valore duraturo e nello investire in esso con pazienza e discernimento. Lo eccesso puo apparire come accumulo oltre il necessario o resistenza a lasciare andare cio che non serve piu.',

    'natal:jupiter_in_gemini':
      'La espansione avviene attraverso la conoscenza, la comunicazione e la moltiplicazione di connessioni e prospettive. Esiste una capacita naturale di assorbire informazioni da fonti diverse e di sintetizzarle in modo accessibile e ispiratore. La sfida sta nello approfondire invece di soltanto ampliare — lo eccesso puo manifestarsi come dispersione intellettuale.',

    'natal:jupiter_in_cancer':
      'La espansione avviene attraverso la cura, la famiglia e la connessione emotiva con radici e appartenenza. Esiste una generosita naturale che si esprime nello accogliere gli altri e nel creare ambienti nutrienti e sicuri. Lo eccesso puo emergere come protezione esagerata o difficolta a permettere la crescita autonoma di chi si ama.',

    'natal:jupiter_in_leo':
      'La espansione avviene attraverso la espressione creativa, la leadership naturale e lo impatto genuino generato negli altri. Un magnetismo naturale attira riconoscimento e collaboratori disposti a imbarcarsi in progetti ambiziosi. Lo eccesso puo apparire come arroganza o bisogno esagerato di ammirazione e centralita.',

    'natal:jupiter_in_virgo':
      'La espansione avviene attraverso il servizio, il miglioramento continuo dei sistemi e la applicazione pratica della conoscenza. Esiste una capacita naturale di individuare dove i sistemi possono essere piu efficienti e di implementare miglioramenti in modo metodico. Lo eccesso puo manifestarsi come perfezionismo che blocca il progresso o critica eccessiva di cio che potrebbe essere diverso.',

    'natal:jupiter_in_libra':
      'La espansione avviene attraverso le relazioni, le alleanze strategiche e la capacita di creare ponti tra parti diverse. Esiste una attitudine naturale alla diplomazia e alla ricerca di soluzioni che soddisfino interessi diversi allo stesso tempo. Lo eccesso puo emergere come dipendenza dalla conferma esterna o difficolta a prendere posizioni chiare.',

    'natal:jupiter_in_scorpio':
      'La espansione avviene attraverso la profondita, la trasformazione e la capacita di toccare cio che resta nascosto nei processi e nelle persone. Esiste una attitudine naturale alla investigazione, alla gestione delle crisi e alla scoperta di risorse dove gli altri non vedono possibilita. Lo eccesso puo manifestarsi come ossessione per il controllo o difficolta a fidarsi dei processi naturali.',

    'natal:jupiter_in_sagittarius':
      'La espansione avviene in modo naturale e abbondante — questa e una delle posizioni di maggiore affinita per Giove. Esiste un ottimismo genuino, una apertura verso il mondo e una capacita di trasformare le esperienze in saggezza applicabile. Lo eccesso puo apparire come promesse piu grandi della capacita di mantenerle o fuga dalle conseguenze immediate.',

    'natal:jupiter_in_capricorn':
      'La espansione avviene attraverso la disciplina, la reputazione costruita nel tempo e lo investimento strategico nel lungo periodo. La crescita raramente e rapida, ma tende a essere solida, resistente e rispettata. Lo eccesso puo apparire come un conservatorismo che impedisce di cogliere opportunita fuori dai cammini conosciuti.',

    'natal:jupiter_in_aquarius':
      'La espansione avviene attraverso la innovazione, la collaborazione in rete e il impegno verso idee che beneficiano le collettivita. Esiste una capacita naturale di vedere oltre il paradigma vigente e di ispirare cambiamenti su larga scala nelle strutture sociali. Lo eccesso puo apparire come distacco dai bisogni individuali in nome di cause astratte.',

    'natal:jupiter_in_pisces':
      'La espansione avviene attraverso la compassione, la spiritualita e la apertura genuina verso il mistero della esistenza. Esiste una generosita naturale che va oltre i limiti dello ego, con una capacita di connessione con qualcosa di piu grande e ampio. Lo eccesso puo apparire come evasione, confini deboli o difficolta a distinguere la fede genuina dallo autoinganno.',

    // ─── Saturno ─────────────────────────────────────────────────────────────
    'natal:saturn_in_aries':
      'La disciplina deve essere sviluppata nella area della azione autonoma e della assertivita personale. La sfida di questa generazione e imparare a guidare senza travolgere e ad agire con costanza senza dipendere dalla adrenalina del momento. La maturita porta una capacita di iniziativa piu consapevole, pianificata e duratura.',

    'natal:saturn_in_taurus':
      'La disciplina viene sviluppata nella area delle risorse, del valore personale e della sicurezza materiale. Questa generazione tende a portare convinzioni limitanti su scarsita o indegnita che devono essere messe in discussione e trasformate. Con il tempo, si costruisce una relazione matura con i beni materiali e con il riconoscimento del proprio valore.',

    'natal:saturn_in_gemini':
      'La disciplina viene sviluppata nella area della comunicazione, dello apprendimento e del pensiero strutturato. Questa generazione puo affrontare insicurezza intellettuale o difficolta a comunicare idee con chiarezza nei primi anni. Con la pratica costante, si sviluppa una mente capace di sostenere ragionamenti complessi e di comunicarli con precisione.',

    'natal:saturn_in_cancer':
      'La disciplina viene sviluppata nella area delle emozioni, della famiglia e della cura degli altri e di se stessi. Questa generazione puo avere imparato che mostrare vulnerabilita e rischioso, creando schemi di contenimento emotivo difficili da sciogliere. La maturazione passa dallo imparare a nutrire se stessi con la stessa responsabilita dedicata al mondo esterno.',

    'natal:saturn_in_leo':
      'La disciplina viene sviluppata nella area della espressione di se, della creativita e della leadership autentica. Questa generazione puo sentire blocchi nella capacita di brillare o di occupare il centro della scena, spesso per paura del giudizio esterno. Con il tempo, si sviluppa una autorita genuina che non dipende dalla conferma costante degli altri.',

    'natal:saturn_in_virgo':
      'La disciplina viene sviluppata nella area del servizio, della salute e del perfezionamento continuo di se stessi e dei sistemi. Questa generazione puo portare richieste estremamente alte verso se stessa e verso gli altri. La maturita porta la comprensione che la perfezione e un processo, non uno stato finale, e che la cura del corpo e anche cura della anima.',

    'natal:saturn_in_libra':
      'La disciplina viene sviluppata nella area delle relazioni, della giustizia e dello equilibrio tra dare e ricevere. Questa generazione affronta la sfida di costruire legami basati su reciprocita reale, non solo su apparenza di armonia. Con il tempo, si impara a negoziare in modo giusto e a mantenere i propri confini dentro i legami significativi.',

    'natal:saturn_in_scorpio':
      'La disciplina viene sviluppata nella area del potere, della trasformazione e della intimita emotiva profonda. Questa generazione puo portare paure legate alla perdita di controllo, al tradimento o alle crisi di rinnovamento psichico. Con il tempo, si sviluppa una capacita straordinaria di attraversare crisi senza distruggersi nel processo.',

    'natal:saturn_in_sagittarius':
      'La disciplina viene sviluppata nella area delle convinzioni, della filosofia personale e della ricerca di significato autentico. Questa generazione mette profondamente in discussione le strutture religiose o filosofiche ereditate, dovendo costruire una visione del mondo propria. Con il tempo, si sviluppa una saggezza che unisce liberta di pensiero e responsabilita reale.',

    'natal:saturn_in_capricorn':
      'La disciplina viene sviluppata nel dominio stesso di Saturno, rendendo questa posizione particolarmente esigente riguardo a risultati concreti e senso del dovere. Questa generazione tende ad avere una relazione seria con autorita, responsabilita e conquista nel corso del tempo. Con la maturita, il rigore puo trasformarsi in saggezza pratica genuina e costante.',

    'natal:saturn_in_aquarius':
      'La disciplina viene sviluppata nella area delle strutture collettive, della innovazione responsabile e della liberta dentro i sistemi. Questa generazione affronta la tensione tra il bisogno di trasformare il consolidato e il rischio di caos per il cambiamento irresponsabile. Con il tempo, si impara a riformare senza distruggere e a innovare senza trascurare chi dipende dalla struttura.',

    'natal:saturn_in_pisces':
      'La disciplina viene sviluppata nella area della spiritualita, della compassione con confini e della struttura della vita interiore. Questa generazione puo sentire difficolta a strutturare la vita spirituale o a distinguere responsabilita genuina da colpa diffusa. Con la maturita, si sviluppa una spiritualita solida che convive con la realta senza dissolversi in essa.',

    // ─── Urano ───────────────────────────────────────────────────────────────
    'natal:uranus_in_aries':
      'La generazione con Urano in Ariete porta una spinta collettiva verso la liberazione radicale dalla autorita e verso il pionierismo a qualunque costo. Il bisogno individuale di liberta di azione e intenso e la resistenza a ogni forma di controllo esterno e marcata. La innovazione avviene attraverso la forza della individualita e il coraggio di inaugurare cio che ancora non esiste.',

    'natal:uranus_in_taurus':
      'La generazione con Urano in Toro mette in discussione le strutture consolidate di valore, proprieta e relazione con le risorse naturali. Individualmente, puo esistere tensione tra il desiderio di stabilita e il bisogno di cambiamento nelle fondamenta materiali della vita. La innovazione avviene in modo lento ma radicale — trasforma cio che sembrava immutabile nelle basi economiche e naturali.',

    'natal:uranus_in_gemini':
      'La generazione con Urano in Gemelli porta una rottura nei modelli di comunicazione, educazione e scambio di informazione. Il pensiero di questa generazione e segnato da un anticonformismo verso le narrazioni dominanti e da una curiosita che non accetta risposte preconfezionate. La innovazione avviene attraverso il linguaggio e la moltiplicazione accelerata delle forme di espressione e connessione.',

    'natal:uranus_in_cancer':
      'La generazione con Urano in Cancro mette in discussione le strutture familiari tradizionali e le forme convenzionali di appartenenza. Individualmente, possono esistere oscillazioni tra il bisogno di radici e la spinta a ridefinire cio che e casa e famiglia. La innovazione avviene nelle basi affettive e nei modelli collettivi di cura e protezione.',

    'natal:uranus_in_leo':
      'La generazione con Urano in Leone porta una rottura nei modelli di leadership, creativita ed espressione di se. Esiste una spinta verso la autenticita che non accetta ruoli imposti e verso una espressione creativa che sfida le convenzioni estetiche e culturali. La innovazione avviene attraverso la originalita radicale della espressione personale e il rifiuto del conformismo creativo.',

    'natal:uranus_in_virgo':
      'La generazione con Urano in Vergine porta una rottura nei modelli di lavoro, salute e servizio collettivo. Esiste una tendenza a mettere in discussione i sistemi consolidati di salute e a cercare approcci alternativi di efficienza e cura. La innovazione avviene attraverso i dettagli e le trasformazioni nei processi e nelle pratiche quotidiane.',

    'natal:uranus_in_libra':
      'La generazione con Urano in Bilancia mette in discussione le strutture del matrimonio, delle unioni legali e degli accordi sociali. Esiste un bisogno di relazioni che rispettino la individualita di ciascuno e resistenza a legami basati su ruoli tradizionali rigidi. La innovazione avviene nelle forme di associazione, di giustizia e nei contratti che regolano la convivenza.',

    'natal:uranus_in_scorpio':
      'La generazione con Urano in Scorpione porta una rottura nelle strutture di potere, sessualita e trasformazione collettiva profonda. Esiste una intensita particolare nella ricerca di autenticita emotiva e una resistenza alle forme convenzionali di controllo e dominio. La innovazione avviene nelle profondita — dove gli altri non osano guardare o interrogare.',

    'natal:uranus_in_sagittarius':
      'La generazione con Urano in Sagittario mette in discussione le strutture religiose, filosofiche ed educative consolidate da secoli. Esiste una spinta forte verso la liberta di credo e verso filosofie di vita che sfidino le frontiere del convenzionale. La innovazione avviene nella espansione degli orizzonti di cio che e possibile credere, esplorare e sperimentare collettivamente.',

    'natal:uranus_in_capricorn':
      'La generazione con Urano in Capricorno porta una rottura nelle strutture istituzionali, governative e aziendali. Esiste una tensione tra la ambizione verso il consolidato e la spinta a trasformare le strutture di potere dallo interno verso lo esterno. La innovazione avviene attraverso la riorganizzazione delle gerarchie e delle forme di autorita e responsabilita collettiva.',

    'natal:uranus_in_aquarius':
      'Urano in Aquario abita il suo dominio naturale, intensificando la ricerca di liberta collettiva, innovazione tecnologica e trasformazione sociale profonda. Lo anticonformismo verso ogni forma di limitazione al pensiero libero e marcato in questa generazione. La innovazione avviene attraverso la visione del futuro e la capacita di creare reti che trasformino le strutture sociali e politiche.',

    'natal:uranus_in_pisces':
      'La generazione con Urano in Pesci porta una rottura nelle strutture spirituali e nella relazione collettiva con lo invisibile e il trascendente. Esiste una apertura a forme non convenzionali di spiritualita e una sensibilita acuta ai cambiamenti nelle correnti collettive dello inconscio. La innovazione avviene attraverso la dissoluzione dei confini tra il sacro e il quotidiano.',

    // ─── Nettuno ─────────────────────────────────────────────────────────────
    'natal:neptune_in_aries':
      'La generazione con Nettuno in Ariete porta una spiritualita legata alla azione, allo eroismo e allo ideale del guerriero che agisce per il bene collettivo. I sogni collettivi di questa generazione passano dalla lotta per un mondo piu autentico e dalla fiducia nel potere dello individuo di cambiare il corso delle cose. La tentazione e il fanatismo — la idealizzazione eccessiva della propria causa come superiore alle altre.',

    'natal:neptune_in_taurus':
      'La generazione con Nettuno in Toro porta una spiritualita legata alla terra, alla bellezza materiale e alla convinzione che la abbondanza sia sacra. I sogni collettivi passano dalla ricerca di una relazione piu armoniosa con le risorse naturali e dallo ideale di una prosperita che nutre in modo genuino. La tentazione e la materializzazione dello spirituale o la spiritualizzazione eccessiva del materiale.',

    'natal:neptune_in_gemini':
      'La generazione con Nettuno in Gemelli porta una spiritualita legata al linguaggio, alle idee e alla molteplicita di prospettive e narrazioni. I sogni collettivi passano dalla comunicazione universale e dalla fiducia nel potere delle parole di trasformare la realta collettiva. La tentazione e la confusione tra mito e realta o la proliferazione di narrazioni senza ancoraggio nel concreto.',

    'natal:neptune_in_cancer':
      'La generazione con Nettuno in Cancro porta una spiritualita legata alla casa, alla nazione e ai legami di sangue e affetto. I sogni collettivi passano da uno ideale di protezione e appartenenza, con nostalgia del passato come paradiso perduto. La tentazione e il nazionalismo emotivo o la dissoluzione dei confini del proprio io nei bisogni della famiglia e del gruppo.',

    'natal:neptune_in_leo':
      'La generazione con Nettuno in Leone porta una spiritualita legata alla creativita, al carisma e allo ideale dello eroe che ispira le masse. I sogni collettivi passano dal glamour, dallo spettacolo e dalla fiducia nel potere trasformatore della espressione artistica e personale. La tentazione e la illusione di grandezza o la confusione tra fama e trascendenza reale.',

    'natal:neptune_in_virgo':
      'La generazione con Nettuno in Vergine porta una spiritualita legata al servizio, alla salute collettiva e alla ricerca di perfezione. I sogni collettivi passano da uno ideale di guarigione e di perfezionamento del tessuto sociale. La tentazione e il perfezionismo che paralizza o la dissoluzione della identita nel servizio instancabile agli altri.',

    'natal:neptune_in_libra':
      'La generazione con Nettuno in Bilancia porta una spiritualita legata alla armonia, alla giustizia e allo ideale dello amore universale. I sogni collettivi passano da un mondo piu equilibrato e dalla fiducia nel potere della diplomazia, della arte e della mediazione. La tentazione e la illusione relazionale o la dissoluzione dei confini personali in nome della armonia superficiale.',

    'natal:neptune_in_scorpio':
      'La generazione con Nettuno in Scorpione porta una spiritualita legata alla trasformazione, allo occulto e alla dissoluzione di tabu collettivi. I sogni collettivi passano dalla esplorazione dei territori oscuri della psiche e dalla fiducia nel potere della crisi come cammino di rinnovamento profondo. La tentazione e la evasione attraverso le sostanze o la fascinazione con lo abisso.',

    'natal:neptune_in_sagittarius':
      'La generazione con Nettuno in Sagittario porta una spiritualita legata alla ricerca di senso, allo ecumenismo e alla apertura verso le spiritualita del mondo intero. I sogni collettivi passano dalla convinzione che tutte le tradizioni spirituali indichino una verita piu grande e universale. La tentazione e il sincretismo senza profondita o la fuga dalla realta attraverso lo ideale spirituale.',

    'natal:neptune_in_capricorn':
      'La generazione con Nettuno in Capricorno porta una spiritualita legata alle strutture di potere e allo ideale di una autorita che serve in modo genuino il bene collettivo. I sogni collettivi passano dalla riforma delle strutture esistenti dallo interno, con responsabilita e visione. La tentazione e la diluizione dei confini etici in nome della efficienza o della ambizione.',

    'natal:neptune_in_aquarius':
      'La generazione con Nettuno in Aquario porta una spiritualita legata alla tecnologia, alle reti e allo ideale di una umanita profondamente interconnessa. I sogni collettivi passano dalla fiducia nel potenziale trasformatore della informazione condivisa liberamente tra tutti. La tentazione e la dissoluzione della identita individuale nelle narrazioni collettive o la confusione tra virtualita e realta.',

    'natal:neptune_in_pisces':
      'Nettuno in Pesci abita il suo dominio naturale, intensificando la dissoluzione dei confini collettivi e la ricerca di trascendenza. I sogni di questa generazione passano dalla compassione universale, dalla crisi delle strutture che frammentano la umanita e dal desiderio di una spiritualita incarnata e genuina. La tentazione e il collasso della distinzione tra empatia e fusione o tra fede autentica e illusione comoda.',

    // ─── Plutone ─────────────────────────────────────────────────────────────
    'natal:pluto_in_aries':
      'La generazione con Plutone in Ariete ha portato trasformazioni profonde nei concetti di individualita, leadership e potere personale. La forza del proprio io e stata sia il motore sia il campo di battaglia delle trasformazioni collettive di quella era storica. Come archetipo generazionale, porta la spinta alla rigenerazione attraverso la azione radicale e il confronto con le strutture che limitano la autonomia.',

    'natal:pluto_in_taurus':
      'La generazione con Plutone in Toro ha assistito e generato trasformazioni profonde nelle strutture economiche e nella relazione con la terra e le risorse naturali. Il potere e la ricchezza sono stati concentrati, messi in discussione e ridistribuiti in modi che hanno ridisegnato la mappa sociale e produttiva. Come archetipo, porta la tensione essenziale tra accumulo e rinnovamento delle risorse fondamentali.',

    'natal:pluto_in_gemini':
      'La generazione con Plutone in Gemelli ha trasformato profondamente le strutture di comunicazione, informazione e trasporto collettivo. La proliferazione di nuovi linguaggi, media e ideologie ha caratterizzato e definito quella era in modo marcato. Come archetipo, porta il potere trasformatore delle idee e il rischio della propaganda e della frammentazione del discorso collettivo.',

    'natal:pluto_in_cancer':
      'La generazione con Plutone in Cancro ha vissuto trasformazioni profonde nei concetti di nazione, famiglia e appartenenza collettiva. Guerre mondiali e spostamenti di massa hanno ridisegnato i confini della casa e della identita collettiva in modo irreversibile. Come archetipo, porta la intensita dello attaccamento alle radici e il potere distruttore e rigeneratore delle forze affettive e nazionali.',

    'natal:pluto_in_leo':
      'La generazione con Plutone in Leone ha trasformato profondamente le strutture di potere, leadership ed espressione individuale su scala globale. Il culto della personalita, la nascita delle stelle di massa e le guerre di ego hanno caratterizzato quella era in forme fino ad allora sconosciute. Come archetipo, porta la spinta ad affermare il proprio io oltre ogni limite e il rischio del narcisismo collettivo.',

    'natal:pluto_in_virgo':
      'La generazione con Plutone in Vergine ha trasformato profondamente le strutture di salute, lavoro e servizio alla collettivita. La rivoluzione nei servizi sanitari, la messa in discussione delle condizioni di lavoro e la nascita della coscienza ecologica hanno segnato questa generazione in modo definitivo. Come archetipo, porta la spinta al perfezionamento sistemico e la tensione tra servire e distruggersi nel servizio.',

    'natal:pluto_in_libra':
      'La generazione con Plutone in Bilancia ha trasformato profondamente le strutture del matrimonio, della giustizia e delle unioni in tutte le dimensioni. Lo aumento delle separazioni, la nascita di nuovi modelli di relazione e le trasformazioni nel diritto di famiglia hanno segnato quella era in modo visibile e duraturo. Come archetipo, porta la tensione tra lo ideale di armonia e il bisogno di onorare i propri confini.',

    'natal:pluto_in_scorpio':
      'La generazione con Plutone in Scorpione e cresciuta in mezzo a trasformazioni radicali nei temi di morte, sessualita e potere su scala collettiva. La epidemia di HIV/AIDS, la rivoluzione sessuale e le crisi di potere politico hanno definito lo sfondo di questa generazione in modo intenso. Come archetipo, porta una intimita con la trasformazione e una capacita di guardare lo abisso senza distogliere lo sguardo.',

    'natal:pluto_in_sagittarius':
      'La generazione con Plutone in Sagittario e cresciuta in mezzo a trasformazioni profonde nelle strutture religiose, filosofiche e nelle frontiere geopolitiche del mondo. La globalizzazione accelerata, il fondamentalismo religioso e lo scontro di civilta hanno segnato quella era con forza e urgenza. Come archetipo, porta sia la spinta a trascendere le frontiere sia il rischio del fanatismo ideologico.',

    'natal:pluto_in_capricorn':
      'La generazione con Plutone in Capricorno assiste alla trasformazione profonda delle strutture istituzionali — governi, aziende, sistemi finanziari e gerarchie consolidate. La crisi di fiducia nelle istituzioni e la concentrazione di potere che precede la ristrutturazione definiscono questa era in corso. Come archetipo, porta sia il peso del collasso sia il potenziale di ricostruzione su basi piu solide e giuste.',

    'natal:pluto_in_aquarius':
      'La generazione con Plutone in Aquario attraversa la trasformazione profonda delle strutture collettive, della tecnologia e dei sistemi di rete che organizzano la umanita. La intelligenza artificiale, i cambiamenti nel contratto sociale e la ridistribuzione del potere tra individui e collettivi definiscono questa era in corso con velocita crescente. Come archetipo, porta il potenziale di una liberta collettiva senza precedenti e il rischio di una sorveglianza altrettanto senza precedenti.',

    'natal:pluto_in_pisces':
      'Come archetipo prospettico, Plutone in Pesci promette una trasformazione profonda nelle strutture spirituali e nella relazione collettiva con lo inconscio e il trascendente. La dissoluzione dei confini che separano le forme di vita e di coscienza puo essere sia la piu grande conquista sia il piu grande rischio di questa era a venire. Lo invito di questa era e integrare la profondita spirituale con la responsabilita collettiva per il mondo condiviso.',
  },
}
