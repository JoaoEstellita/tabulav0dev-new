import type { AppLanguage } from '../i18n/appI18n'

type TransitOverrideMap = Record<string, string>

export const TRANSIT_CATALOG_I18N_OVERRIDES: Partial<Record<AppLanguage, TransitOverrideMap>> = {
  'en-US': {
    'transit:jupiter|conjuncao|meio_do_ceu':
      'Jupiter conjunct Midheaven can increase visibility and open room for professional growth. This cycle favors recognition when direction is clear, execution is consistent, and expectations stay realistic. Avoid overpromising and consolidate progress in practical steps.',
    'transit:jupiter|sextil|meio_do_ceu':
      'Jupiter sextile Midheaven supports agreements and momentum for career development. This phase tends to be favorable for expansion with strategy and focus on priorities. Small, well-executed decisions can produce meaningful medium-term impact.',
    'transit:jupiter|trigono|meio_do_ceu':
      'Jupiter trine Midheaven improves flow in public and professional goals. Recognition is more likely when technical quality is paired with clear communication. Use this phase to build sustainable growth without excess confidence.',
    'transit:saturn|quadratura|saturn':
      'Saturn square Saturn marks a period of structural review and maturity. Pressure may arise to adjust timelines, limits, and responsibilities more objectively. Gains come from simplifying commitments and reinforcing what truly sustains your plan.',
    'transit:saturn|sextil|sun':
      'Saturn sextile Sun supports discipline, stability, and consistent progress. This phase helps translate intention into results through routine and criteria. Advances may come in smaller but steadier steps.',
    'transit:saturn|trigono|sun':
      'Saturn trine Sun reinforces focus, consistency, and practical confidence in decisions. This period tends to support consolidation of goals with less dispersion. Prioritize essentials and keep a sustainable pace.',
    'transit:saturn|oposicao|uranus':
      'Saturn opposition Uranus brings tension between stability and the need for change. This cycle asks for balance between preserving structure and opening room for smart adjustments. Avoid extremes and move with controlled experiments.',
    'transit:saturn|quadratura|uranus':
      'Saturn square Uranus signals friction between control and renewal. Discomfort may appear around old rules or changes that move too fast. Best use of this phase is to reorganize processes without breaking what still works.',
    'transit:saturn|sextil|mars':
      'Saturn sextile Mars favors disciplined action and efficient execution. Energy tends to perform better when priorities are organized and impulsive reactions are reduced. Good period to complete demanding tasks with consistency.',
    'transit:saturn|trigono|mars':
      'Saturn trine Mars strengthens productivity, persistence, and long-range strategy. This phase helps convert effort into concrete results with less waste. Direct energy to clear and measurable goals.',
    'transit:saturn|sextil|saturn':
      'Saturn sextile Saturn supports consolidation and maturity of important structures. The period favors reviewing processes, contracts, and responsibilities with pragmatism. Gradual adjustments can build a more stable foundation.',
    'transit:saturn|trigono|saturn':
      'Saturn trine Saturn indicates functional stability and good organizational capacity. It is easier to keep discipline and complete stages with quality. Use the period to consolidate fundamentals and reduce operational noise.',
    'transit:sun|oposicao|pluto':
      'Sun opposition Pluto intensifies themes of control, personal power, and real priorities. This cycle may expose polarities that ask for a conscious stance with less reactivity. Focus on what is essential with firmness and no unnecessary confrontation.',
    'transit:saturn|oposicao|mars':
      'Saturn opposition Mars can create a sense of braking or delay in execution. This phase asks to calibrate force and timing, avoiding both impulsiveness and total blockage. Tactical planning and consistency help recover traction safely.',
    'transit:saturn|quadratura|mercury':
      'Saturn square Mercury demands precision in communication and review of assumptions. Extra mental pressure, delays, or need for details may arise. Validate information, simplify messages, and progress in stages.',
    'transit:saturn|quadratura|sun':
      'Saturn square Sun raises responsibility and tests consistency. The period can feel more demanding, asking focus on essentials and reduction of excess. Structure, rest, and clear priorities prevent unproductive strain.',
    'transit:saturn|sextil|venus':
      'Saturn sextile Venus supports mature choices in relationships, agreements, and values. This phase favors sustainable commitment with less idealization and more practical coherence. Good period to align expectations and strengthen reliable bonds.',
    'transit:saturn|trigono|venus':
      'Saturn trine Venus reinforces affective and financial stability through criteria. There is a tendency to prefer quality, consistency, and long-term agreements. Use the cycle to consolidate what has real value in your routine.',
    'transit:saturn|sextil|jupiter':
      'Saturn sextile Jupiter combines expansion with strategic realism. The period favors growth with planning while preserving structural safety. Move with concrete goals, clear deadlines, and periodic reviews.',
    'transit:saturn|trigono|jupiter':
      'Saturn trine Jupiter supports consistent growth with balance between vision and execution. This phase tends to ease solid progress when method and patience are present. Structure opportunities in stages for durable results.',
    'transit:pluto|ingress|house_10':
      'Pluto entering House 10 tends to begin a deep repositioning cycle in career, reputation, and public direction. This phase often asks for more authentic choices and less compromise with paths that no longer fit. Move with medium-term strategy and pace your visibility to what you can sustain.',
    'transit:pluto|ingress|house_4':
      'Pluto entering House 4 tends to deepen themes around emotional foundations, family, and home structure. This cycle may expose old patterns that no longer support inner safety with quality. Best use of the phase is to reorganize your foundations with calm, firmness, and clearer boundaries.',
    'transit:saturn|ingress|house_10':
      'Saturn entering House 10 marks a professional consolidation phase through responsibility, consistency, and criteria. The tendency is to reduce dispersion, prioritize concrete delivery, and align expectations with real process. Use this period to build reputation with sustainable, predictable steps.',
    'transit:saturn|ingress|house_6':
      'Saturn entering House 6 supports reorganization of routine, daily work, and functional health through method. This cycle tends to ask for simple discipline, steadier rhythms, and cuts in recurring overload patterns. Small repeated adjustments can produce meaningful medium-term gains.',
    'transit:jupiter|ingress|house_2':
      'Jupiter entering House 2 tends to broaden opportunities around resources, values, and material safety. This phase favors growth when planning, risk criteria, and result tracking are present. Expansion with practical structure is usually more productive than enthusiasm without method.',
    'transit:jupiter|ingress|house_11':
      'Jupiter entering House 11 opens a favorable window for networks, collaboration, and future-oriented collective projects. This cycle tends to expand useful connections when goals are clear and reciprocity is real. Prioritize reliable alliances and turn contacts into concrete cooperation.',
    'transit:uranus|ingress|house_7':
      'Uranus entering House 7 tends to renew partnership dynamics, agreements, and key relationships. This period may ask for more autonomy, flexibility, and direct conversations about expectations on both sides. Conscious adjustments help avoid reactive breaks and support relational evolution.',
    'transit:neptune|ingress|house_12':
      'Neptune entering House 12 tends to increase sensitivity, intuition, and inner closure processes. This phase can heighten subtle perception and asks for discernment between intuition and idealization. Rest routines, silence, and mental hygiene help stabilize this cycle.',
    'transit:mars|ingress|house_10':
      'Mars entering House 10 raises drive to act in career and occupy space more visibly. The energy favors initiative when direction is clear and pacing is regulated to avoid burnout. Execute by priorities and convert urgency into measurable progress.',
    'transit:sun|ingress|house_10':
      'Sun entering House 10 highlights public goals, responsibility, and professional direction. This phase tends to support visibility when you combine presence, consistency, and clear communication. Focus on essentials and use exposure to reinforce coherent positioning.',
    'transit:pluto|conjuncao|meio_do_ceu':
      'Pluto conjunct Midheaven concentrates transformative pressure on career direction and public image. This phase tends to require deeper choices about authority, vocation, and long-term positioning. Move strategically and consistently, avoiding extreme reactions to short-term pressure.',
    'transit:pluto|oposicao|fundo_do_ceu':
      'Pluto opposite Imum Coeli can activate tension between public demands and emotional foundations. This cycle often asks for rebalancing ambition, home life, and inner safety. Use practical boundaries and pacing to protect both performance and personal stability.',
    'transit:pluto|trigono|jupiter':
      'Pluto trine Jupiter favors growth with depth, strategic vision, and meaningful repositioning. Opportunities tend to expand when focus stays on quality and long-term sustainability. Prioritize structural advances over fast gains without foundation.',
    'transit:pluto|sesquiquadratura|moon':
      'Pluto sesquiquadrate Moon can heighten emotional sensitivity and reactive patterns in family themes. This phase asks for conscious regulation before acting from pressure. Small routine adjustments and clearer emotional language reduce internal strain.',
    'transit:pluto|sesquiquadratura|mars':
      'Pluto sesquiquadrate Mars increases tension between urgency and control. The cycle may trigger impatience or power friction when priorities are unclear. Channel energy into essential tasks and avoid confrontations that do not create real progress.',
    'transit:saturn|conjuncao|neptune':
      'Saturn conjunct Neptune combines realism with sensitivity, asking ideals to become practical structure. This period favors separating useful intuition from diffuse expectations through method and criteria. Turn inspiration into concrete steps with regular follow-up.',
    'transit:mercury|semiquadratura|pluto':
      'Mercury semisquare Pluto intensifies analytical focus and can increase mental rigidity. This phase asks for care with reactive communication, suspicion, and premature conclusions. Validate facts, simplify messages, and stay open to revising assumptions.',
    'transit:sun|semissextil|neptune':
      'Sun semisextile Neptune expands subtle perception and imagination while requiring clearer direction. The phase can support creative refinement when practical criteria remain active. Keep priorities organized and verify details to reduce dispersion.',
    'transit:moon|ingress|house_4':
      'Moon entering House 4 highlights emotional grounding, family bonds, and home atmosphere. This cycle tends to increase sensitivity to domestic context and belonging needs. Favor rest, simple home adjustments, and supportive conversations.',
    'transit:sun|ingress|house_4':
      'Sun entering House 4 illuminates home, family, and internal security foundations. The phase supports attention to emotional basics and practical organization of private life. Small choices in boundaries and routine can improve stability quickly.',
    'transit:mars|ingress|house_4':
      'Mars entering House 4 raises initiative and intensity in domestic and family matters. This period can be productive for resolving home tasks, with risk of friction if urgency dominates. Direct energy to practical fixes and keep sensitive talks objective.',
    'transit:jupiter|ingress|house_4':
      'Jupiter entering House 4 tends to expand focus on home, family, and emotional belonging. The phase may favor environmental improvements and supportive household agreements. Expand with planning so domestic growth remains sustainable over time.',
    'transit:saturn|ingress|house_4':
      'Saturn entering House 4 marks a phase of consolidating emotional foundations and family structure. The cycle asks for clearer domestic responsibilities, boundaries, and priorities. Consistent realistic adjustments strengthen inner and household stability.',
    'transit:saturn|oposicao|jupiter':
      'Saturn opposite Jupiter asks you to calibrate expansion with concrete limits. This phase may expose either over-optimism or excessive rigidity, requiring balance between vision and execution. Review goals, timing, and resources to grow safely.',
    'transit:moon|oposicao|jupiter':
      'Moon opposite Jupiter can amplify emotional reactions and short-term expectations. This cycle favors moderating excess and returning to realistic choices. Brief pauses and clearer priorities help avoid dispersion.',
    'transit:saturn|oposicao|pluto':
      'Saturn opposite Pluto intensifies tests around structure, power, and resilience. The cycle asks for maturity to sustain deep changes without impulsive rupture. Move in stages with strategy and clear boundaries.',
    'transit:sun|quadratura|moon':
      'Sun square Moon can create friction between conscious intention and emotional need. This phase asks for alignment between what you want to do and what your inner rhythm can sustain. Simple routine and communication adjustments reduce conflict.',
    'transit:saturn|sextil|neptune':
      'Saturn sextile Neptune supports turning intuition into practical structure. This phase helps shape sensitive ideas through method and consistency. Build inspiration into small verifiable steps.',
    'transit:saturn|trigono|neptune':
      'Saturn trine Neptune sustains balance between sensitivity and realism. This period favors consolidating long-term visions with discipline and criteria. Good timing to structure creative or spiritual projects practically.',
    'transit:sun|sextil|moon':
      'Sun sextile Moon supports integration between intention and emotion. This phase tends to improve flow in conversations, routine adjustments, and daily choices. Use it to align internal and external priorities.',
    'transit:sun|trigono|moon':
      'Sun trine Moon strengthens coherence between identity and emotional needs. This period often supports stable organization of important choices. Use it to consolidate habits that sustain continuity.',
    'transit:saturn|sextil|ascendente':
      'Saturn sextile Ascendant favors grounded posture, focus, and self-management. This phase supports steady progress when discipline and boundaries are clear. Small commitments kept consistently build trust.',
    'transit:saturn|trigono|ascendente':
      'Saturn trine Ascendant reinforces maturity, presence, and stable pacing. This period helps organize responsibilities without unnecessary overload. Keep consistency and prioritize durable foundations.',
    'transit:saturn|oposicao|saturn':
      'Saturn opposite Saturn marks a review point for long-term structures. This cycle may expose real limits in older models and ask for objective reorganization. Focus on essentials and recalculate commitments for continuity.',
    'transit:moon|sextil|saturn':
      'Moon sextile Saturn helps regulate emotions with practicality and steadiness. This phase favors mature conversations and better emotional routine management. Good period to reinforce supportive structure.',
    'transit:moon|trigono|saturn':
      'Moon trine Saturn favors emotional stability and balanced responsibility. This cycle supports prudent decisions without emotional hardening. Use the moment to consolidate healthy agreements and limits.',
    'transit:moon|quadratura|mars':
      'Moon square Mars can increase irritability and emotional impulsiveness. This phase asks for care with quick reactions in daily friction. Slow down, breathe before acting, and direct energy into concrete tasks.',
    'transit:moon|conjuncao|uranus':
      'Moon conjunct Uranus raises emotional need for freedom and rapid change. This cycle may bring mood shifts and surprises in close interactions. Flexibility with clear limits helps maintain balance.',
    'transit:moon|oposicao|mars':
      'Moon opposite Mars can heighten reactivity in relationships and immediate choices. This phase asks you to calibrate impulse with listening to avoid unnecessary wear. Prioritize objective dialogue and strategic pauses.',
    'transit:moon|conjuncao|mars':
      'Moon conjunct Mars increases affective intensity and urgency to act. This period can be productive for resolving pending matters, with risk of emotional haste. Channel energy into short actions and avoid reactive disputes.',
    'transit:saturn|quadratura|moon':
      'Saturn square Moon may increase emotional pressure and need for containment. This cycle asks for simple discipline, emotional structure, and adequate recovery. Organize supportive routines to prevent inner overload.',
    'transit:moon|quadratura|jupiter':
      'Moon square Jupiter can inflate expectations and mood oscillation around outcomes. This phase asks for moderation to avoid emotional overreach. Reassess priorities and stay with what is viable now.',
    'transit:uranus|sextil|moon':
      'Uranus sextile Moon favors emotional renewal with more lightness and creativity. This period helps test new habits without abrupt rupture. Small conscious changes can quickly improve wellbeing.',
    'transit:uranus|trigono|moon':
      'Uranus trine Moon supports updating emotional patterns with autonomy. This phase tends to open room for more authentic daily choices. Use flexibility to adjust routine and bonds responsibly.',
    'transit:pluto|oposicao|venus':
      'Pluto opposite Venus intensifies themes of bonds, value, and reciprocity. This cycle may expose attachment or control dynamics requiring conscious repositioning. Seek more authentic agreements with clear boundaries.',
    'transit:uranus|conjuncao|saturn':
      'Uranus conjunct Saturn combines disruption and structure, asking old models to update. This phase favors innovation with responsibility rather than destructive rupture. Progressive adjustments tend to work better than abrupt turns.',
    'transit:uranus|sextil|mercury':
      'Uranus sextile Mercury favors fresh ideas, fast connections, and smart mental adjustments. This phase tends to support innovation in communication without losing functionality. Test new approaches, then validate impact before scaling.',
    'transit:uranus|trigono|mercury':
      'Uranus trine Mercury improves clarity to think beyond old patterns with more flow. This period supports agile learning, intellectual creativity, and process updates. Turn insights into practical steps to secure real gains.',
    'transit:sun|oposicao|neptune':
      'Sun opposition Neptune can increase confusion between objective focus and idealization. This cycle asks you to separate subtle perception from expectations without evidence. Simplify priorities and verify facts before deciding.',
    'transit:moon|oposicao|mercury':
      'Moon opposition Mercury can intensify conflict between emotional reaction and rational interpretation. This phase asks for care with impulsive messages and quick conclusions. Pause, organize what you feel, then communicate clearly.',
    'transit:saturn|oposicao|mercury':
      'Saturn opposition Mercury brings a test of mental and communicational consistency. The period may demand more review, criteria, and patience with timing or feedback. Structure arguments with data and advance in verifiable steps.',
    'transit:sun|conjuncao|pluto':
      'Sun conjunct Pluto intensifies focus, control themes, and the need for authenticity. This cycle supports deep change when choices are conscious and strategic. Direct energy to essentials and avoid unproductive power disputes.',
    'transit:uranus|oposicao|mercury':
      'Uranus opposition Mercury can bring mental disruption, unexpected information, and perspective shifts. This phase asks for flexibility without losing criteria in fact evaluation. Revise plans quickly, but keep final decisions grounded.',
    'transit:pluto|quadratura|jupiter':
      'Pluto square Jupiter can magnify ambition and pressure growth limits. This cycle asks you to calibrate expansion with strategic depth and responsibility. Avoid excess and prioritize sustainable long-term progress.',
    'transit:uranus|conjuncao|meio_do_ceu':
      'Uranus conjunct Midheaven tends to accelerate professional repositioning and shifts in public image. This phase favors career innovation when experimentation has clear direction. Update positioning without breaking essential structure.',
    'transit:uranus|quadratura|moon':
      'Uranus square Moon can increase emotional instability and immediate need for freedom. This phase asks for routine and relational adjustments to reduce reactivity. Small conscious changes usually work better than abrupt cuts.',
    'transit:jupiter|sextil|sun':
      'Jupiter sextile Sun supports practical confidence, growth vision, and broader decisions. This cycle tends to help progress when enthusiasm is paired with criteria. Use opportunities with planning to sustain results.',
    'transit:jupiter|trigono|sun':
      'Jupiter trine Sun increases flow to expand goals with stronger inner confidence. This phase can ease recognition and progress when focus stays on essentials. Use the moment to consolidate gains without overpacing.',
    'transit:uranus|conjuncao|ascendente':
      'Uranus conjunct Ascendant tends to mark personal repositioning and changes in your style of action. This period favors authenticity, autonomy, and identity updates in daily life. Renew how you present yourself with responsible freedom.',
    'transit:pluto|sextil|mars':
      'Pluto sextile Mars strengthens determination, strategy, and depth of action. This cycle favors reducing dispersion and focusing on high-impact tasks. Direct energy precisely to avoid unnecessary wear.',
    'transit:pluto|trigono|mars':
      'Pluto trine Mars increases execution power and persistence for meaningful change. This phase tends to support consistent action with less reactivity and more strategic intention. Move in stages and consolidate structural gains.',
    'transit:pluto|quadratura|moon':
      'Pluto square Moon can intensify emotional vulnerability and security themes. This cycle asks for emotional regulation and review of old protective patterns. Clear conversations and supportive routines help maintain stability.',
    'transit:moon|conjuncao|sun':
      'Moon conjunct Sun marks an emotional reset point and intention alignment. This phase supports simple priority adjustments and openness to new action cycles. Define one short consistent step to give direction to the day.',
    'transit:pluto|sextil|sun':
      'Pluto sextile Sun favors inner strengthening and more authentic repositioning. This cycle can support deeper choices without dramatic rupture. Focus effort on what has long-term value.',
    'transit:pluto|trigono|sun':
      'Pluto trine Sun increases concentration, purpose clarity, and consistency of direction. This phase tends to support grounded and sustainable transformation. Use the period to consolidate identity and direction with maturity.',
    'transit:saturn|oposicao|ascendente':
      'Saturn opposition Ascendant can test limits in relationships, agreements, and shared responsibility. This cycle asks for mature posture, listening, and clearer boundaries. Realistic adjustments in coexistence tend to reduce friction and improve stability.',
    'transit:pluto|conjuncao|mars':
      'Pluto conjunct Mars intensifies willpower, competitiveness, and the urge to act with force. This cycle asks for self-regulation to avoid impulsive conflict and energy waste. Channel intensity into structural goals and strategic choices.',
    'transit:sun|oposicao|uranus':
      'Sun opposition Uranus can bring rhythm breaks, reaction to limits, and urgent need for freedom. This phase asks for flexibility with responsibility to avoid abrupt decisions. Reassess priorities and adjust direction without losing coherence.',
    'transit:uranus|quadratura|sun':
      'Uranus square Sun signals tension between current identity and need for change. The cycle can bring restlessness, impatience, and desire to flip everything quickly. Innovate in stages to preserve foundation and gain stable autonomy.',
    'transit:saturn|oposicao|sun':
      'Saturn opposition Sun raises external pressure and tests personal consistency. The period may require more discipline, boundary adjustment, and focus on essentials. Build sustainable routines and move with criteria, without excessive self-criticism.',
    'transit:saturn|quadratura|venus':
      'Saturn square Venus can trigger review of affective expectations and material values. This cycle asks for emotional maturity, clear boundaries, and more realistic choices. Strengthen reciprocity and reduce draining agreements.',
    'transit:sun|conjuncao|mercury':
      'Sun conjunct Mercury favors mental clarity, communication focus, and objective decisions. This phase tends to support important conversations, study, and idea organization. Prioritize simple messages aligned with essentials.',
    'transit:jupiter|conjuncao|moon':
      'Jupiter conjunct Moon expands sensitivity, emotional support, and sense of inner nourishment. This cycle can favor affective openness and broader understanding of emotional needs. Avoid emotional excess and keep balance in choices.',
    'transit:jupiter|oposicao|pluto':
      'Jupiter opposition Pluto can magnify disputes around vision, control, and power decisions. This period asks you to calibrate ambition with ethics, depth, and limits. Consistent growth comes from strategy, not extreme moves.',
    'transit:neptune|quadratura|venus':
      'Neptune square Venus can bring affective idealization and confusion about value and reciprocity. This cycle asks for discernment between intuition and projection. Observe concrete signals before formalizing emotional or financial agreements.',
    'transit:saturn|sextil|moon':
      'Saturn sextile Moon helps stabilize emotions through routine and affective responsibility. This phase favors mature conversations and better inner time management. Small care habits bring security and continuity.',
    'transit:saturn|trigono|moon':
      'Saturn trine Moon favors emotional consistency, sobriety, and confidence in everyday choices. The cycle tends to support stable agreements and healthy boundaries. Use this period to consolidate your emotional base with simplicity.',
    'transit:venus|conjuncao|jupiter':
      'Venus conjunct Jupiter expands pleasure, generosity, and opportunities for harmony in relationships. This phase favors encounters, agreements, and a more positive relational climate. Use the flow with moderation to avoid overextension.',
    'transit:uranus|sextil|venus':
      'Uranus sextile Venus favors affective and financial renewal with more lightness and creativity. The cycle supports value updates and new relationship formats. Innovate consciously to preserve both freedom and reciprocity.',
    'transit:uranus|trigono|venus':
      'Uranus trine Venus eases update of relationships, tastes, and value choices with natural flow. This phase tends to increase authenticity without unnecessary rupture. Test new ways of exchange with balance.',
    'transit:jupiter|quadratura|moon':
      'Jupiter square Moon can amplify emotional oscillation and expectation of immediate response. This cycle asks for moderation to avoid overreaction in feelings and decisions. Adjust pace, prioritize essentials, and keep affective realism.',
    'transit:neptune|quadratura|moon':
      'Neptune square Moon can increase sensitivity, emotional fog, and difficulty defining inner boundaries. This phase asks for rest, mental hygiene, and reality checks before reacting. Strengthen grounding routines to reduce emotional confusion.',
    'transit:moon|ingress|house_2':
      'Moon entering House 2 highlights material security, personal value, and practical stability needs in daily life. This phase favors reviewing spending, comfort, and practical priorities with greater sensitivity. Small financial adjustments and simple organization tend to bring more calm.',
    'transit:saturn|quadratura|pluto':
      'Saturn square Pluto can pressure deep structures, boundaries, and long-term commitments. This phase asks for strategic patience, realistic pacing, and careful resource management. Focus on sustainable rebuilding instead of forceful control moves.',
    'transit:jupiter|quadratura|ascendente':
      'Jupiter square Ascendant may amplify visibility and confidence, with risk of overextension in your image or promises. This phase works best with clear limits and practical consistency. Expand with criteria so growth remains reliable.',
    'transit:jupiter|quadratura|mars':
      'Jupiter square Mars can increase drive and ambition while reducing tactical precision. This cycle asks you to balance momentum with method and timing. Channel enthusiasm into measurable steps and avoid unnecessary friction.',
    'transit:pluto|conjuncao|sun':
      'Pluto conjunct Sun intensifies identity, direction, and personal power themes. This phase tends to demand authentic choices and deeper alignment with what truly matters. Move with strategy, discipline, and emotional regulation.',
    'transit:pluto|quadratura|mars':
      'Pluto square Mars can raise pressure, impatience, and control conflicts in action. This cycle asks for disciplined execution and careful use of force. Prioritize essential tasks and avoid reactive confrontations.',
    'transit:saturn|conjuncao|jupiter':
      'Saturn conjunct Jupiter combines expansion with structure and long-range planning. The period favors realistic growth, objective priorities, and stronger execution criteria. Build in stages to preserve sustainability.',
    'transit:saturn|sextil|uranus':
      'Saturn sextile Uranus supports innovation with consistency and operational grounding. This phase helps update systems without breaking what still works. Test changes in controlled steps and keep clear metrics.',
    'transit:saturn|trigono|uranus':
      'Saturn trine Uranus facilitates stable modernization and intelligent process renewal. The cycle favors practical innovation with low disruption. Consolidate improvements through method, cadence, and review.',
    'transit:uranus|sextil|mars':
      'Uranus sextile Mars boosts initiative, agility, and tactical experimentation. This phase tends to favor smart adjustments and faster execution with awareness. Keep focus on useful innovation, not pure acceleration.',
    'transit:uranus|trigono|mars':
      'Uranus trine Mars improves decisive action with flexibility and creative problem-solving. The cycle supports productive change when priorities are explicit. Use momentum to unlock practical progress.',
    'transit:jupiter|oposicao|saturn':
      'Jupiter opposition Saturn highlights tension between expansion and limits. This phase asks for balance between vision and feasibility in current commitments. Recalibrate goals, deadlines, and resource allocation.',
    'transit:neptune|conjuncao|meio_do_ceu':
      'Neptune conjunct Midheaven can increase sensitivity around vocation, image, and professional meaning. This phase asks for discernment between inspiration and projection. Keep direction clear and validate decisions with concrete signals.',
    'transit:saturn|sextil|meio_do_ceu':
      'Saturn sextile Midheaven supports professional consolidation through consistency and responsibility. This cycle favors stable growth built on quality execution. Strengthen positioning with realistic commitments.',
    'transit:saturn|trigono|meio_do_ceu':
      'Saturn trine Midheaven reinforces reputation, structure, and long-term career direction. The period tends to reward method, reliability, and disciplined delivery. Keep focus on fundamentals and sustainable progress.',
    'transit:uranus|conjuncao|sun':
      'Uranus conjunct Sun tends to accelerate identity updates and personal repositioning. This phase can increase need for autonomy and experimental choices. Innovate with responsibility to avoid abrupt instability.',
    'transit:jupiter|oposicao|neptune':
      'Jupiter opposition Neptune can amplify idealization, diffuse expectations, and optimism without verification. This cycle asks for clearer criteria and fact-checking before major decisions. Keep inspiration grounded in practical reality.',
    'transit:jupiter|quadratura|neptune':
      'Jupiter square Neptune may increase enthusiasm with reduced clarity around limits. This phase asks for discernment between meaningful vision and wishful projection. Review assumptions and pace expansion prudently.',
    'transit:pluto|conjuncao|saturn':
      'Pluto conjunct Saturn deepens structural transformation and responsibility themes. The cycle can demand mature decisions about control, endurance, and what must be rebuilt. Move in stages with strategy and clear boundaries.',
    'transit:pluto|oposicao|jupiter':
      'Pluto opposition Jupiter can intensify disputes around scale, power, and strategic direction. This phase asks for ethical expansion and realistic calibration of ambition. Prioritize durable influence over immediate magnitude.',
    'transit:saturn|quadratura|mars':
      'Saturn square Mars may create friction between urgency and constraints in execution. This cycle asks for discipline, timing, and reduction of impulsive effort. Convert pressure into methodical action.',
    'transit:jupiter|quadratura|venus':
      'Jupiter square Venus can increase pleasure-seeking and optimism in relational or financial choices. This phase favors moderation and clear value criteria. Expand with balance to avoid excess and regret.',
    'transit:neptune|quadratura|saturn':
      'Neptune square Saturn can test certainty, structure, and tolerance for ambiguity. This phase asks you to refine expectations and rebuild plans with realistic flexibility. Combine intuition with objective verification.',
    'transit:pluto|oposicao|sun':
      'Pluto opposition Sun can activate strong polarity around identity, authority, and personal direction. This cycle asks for conscious use of power and deeper alignment with core priorities. Avoid all-or-nothing reactions.',
    'transit:pluto|oposicao|mars':
      'Pluto opposition Mars may intensify competitive pressure and conflict dynamics in action. This phase asks for self-regulation and strategic restraint under stress. Direct force toward constructive outcomes.',
    'transit:pluto|quadratura|mercury':
      'Pluto square Mercury can intensify thinking, suspicion, and communicational rigidity. This cycle asks for evidence-based analysis and cleaner dialogue. Recheck assumptions before committing to strong conclusions.',
  },
  'es-ES': {
    'transit:jupiter|conjuncao|meio_do_ceu':
      'Jupiter en conjuncion al Medio Cielo puede aumentar visibilidad y abrir espacio para crecimiento profesional. Este ciclo favorece reconocimiento cuando hay direccion clara, ejecucion constante y expectativas realistas. Evita prometer de mas y consolida avances por etapas.',
    'transit:jupiter|sextil|meio_do_ceu':
      'Jupiter en sextil al Medio Cielo facilita acuerdos e impulso para evolucion profesional. Esta fase suele favorecer expansion con estrategia y foco en prioridades. Decisiones pequenas y bien ejecutadas pueden generar impacto relevante a medio plazo.',
    'transit:jupiter|trigono|meio_do_ceu':
      'Jupiter en trigono al Medio Cielo mejora fluidez en metas publicas y profesionales. El reconocimiento es mas probable cuando calidad tecnica y comunicacion clara van juntas. Aprovecha la fase para crecimiento sostenible, sin exceso de confianza.',
    'transit:saturn|quadratura|saturn':
      'Saturno en cuadratura con Saturno marca un periodo de revision estructural y madurez. Puede surgir presion para ajustar plazos, limites y responsabilidades con mas objetividad. La ganancia llega al simplificar compromisos y reforzar lo que sostiene tu plan.',
    'transit:saturn|sextil|sun':
      'Saturno en sextil al Sol favorece disciplina, estabilidad y progreso constante. Esta fase ayuda a convertir intencion en resultado mediante rutina y criterio. Los avances pueden venir en pasos mas pequenos, pero firmes.',
    'transit:saturn|trigono|sun':
      'Saturno en trigono al Sol refuerza foco, constancia y confianza practica en decisiones. Este periodo suele apoyar consolidacion de metas con menos dispersion. Prioriza lo esencial y manten un ritmo sostenible.',
    'transit:saturn|oposicao|uranus':
      'Saturno en oposicion a Urano trae tension entre estabilidad y necesidad de cambio. Este ciclo pide equilibrio entre conservar estructura y abrir espacio para ajustes inteligentes. Evita extremos y avanza con experimentos controlados.',
    'transit:saturn|quadratura|uranus':
      'Saturno en cuadratura a Urano senala friccion entre control y renovacion. Puede aparecer incomodidad con reglas antiguas o con cambios demasiado rapidos. El mejor uso de la fase es reorganizar procesos sin romper lo que aun funciona.',
    'transit:saturn|sextil|mars':
      'Saturno en sextil a Marte favorece accion disciplinada y ejecucion eficiente. La energia rinde mejor cuando se ordenan prioridades y se reducen impulsos. Buen periodo para cerrar tareas exigentes con constancia.',
    'transit:saturn|trigono|mars':
      'Saturno en trigono a Marte fortalece productividad, persistencia y estrategia de largo plazo. Esta fase ayuda a transformar esfuerzo en resultado concreto con menor desgaste. Dirige energia a metas claras y medibles.',
    'transit:saturn|sextil|saturn':
      'Saturno en sextil a Saturno apoya consolidacion y madurez de estructuras importantes. El periodo favorece revisar procesos, acuerdos y responsabilidades con pragmatismo. Ajustes graduales pueden crear una base mas estable.',
    'transit:saturn|trigono|saturn':
      'Saturno en trigono a Saturno indica estabilidad funcional y buena capacidad organizativa. Hay mas facilidad para sostener disciplina y completar etapas con calidad. Usa el periodo para consolidar fundamentos y reducir ruido operativo.',
    'transit:sun|oposicao|pluto':
      'Sol en oposicion a Pluto intensifica temas de control, poder personal y prioridades reales. Este ciclo puede exponer polaridades que piden una postura mas consciente y menos reactiva. Enfocate en lo esencial con firmeza y sin confrontaciones innecesarias.',
    'transit:saturn|oposicao|mars':
      'Saturno en oposicion a Marte puede generar sensacion de freno o demora en la ejecucion. Esta fase pide calibrar fuerza y tiempo, evitando tanto impulso como bloqueo total. Planificacion tactica y constancia ayudan a recuperar traccion.',
    'transit:saturn|quadratura|mercury':
      'Saturno en cuadratura a Mercurio exige precision en comunicacion y revision de supuestos. Puede haber mayor exigencia mental, demoras o necesidad de detalle extra. Valida informacion, simplifica mensajes y avanza por etapas.',
    'transit:saturn|quadratura|sun':
      'Saturno en cuadratura al Sol aumenta sentido de responsabilidad y prueba de consistencia. El periodo puede sentirse mas exigente y pedir foco en lo esencial con recorte de excesos. Estructura, descanso y prioridades claras evitan desgaste inutil.',
    'transit:saturn|sextil|venus':
      'Saturno en sextil a Venus favorece elecciones maduras en vinculos, acuerdos y valores. Esta fase apoya compromiso sostenible con menos idealizacion y mas coherencia practica. Buen momento para alinear expectativas y fortalecer lazos confiables.',
    'transit:saturn|trigono|venus':
      'Saturno en trigono a Venus refuerza estabilidad afectiva y financiera mediante criterio. Hay tendencia a preferir calidad, constancia y acuerdos de largo plazo. Usa el ciclo para consolidar lo que tiene valor real en tu rutina.',
    'transit:saturn|sextil|jupiter':
      'Saturno en sextil a Jupiter combina expansion con realismo estrategico. El periodo favorece crecimiento con planificacion sin perder seguridad de base. Avanza con metas concretas, plazos claros y revisiones periodicas.',
    'transit:saturn|trigono|jupiter':
      'Saturno en trigono a Jupiter sostiene crecimiento constante con equilibrio entre vision y ejecucion. Esta fase suele facilitar progreso solido cuando hay metodo y paciencia. Estructura oportunidades por etapas para resultados duraderos.',
    'transit:pluto|ingress|house_10':
      'Pluton en ingreso a Casa 10 tiende a iniciar un ciclo de reposicionamiento profundo en carrera, reputacion y direccion publica. Esta fase suele pedir decisiones mas autenticas y menos concesion a caminos que ya no encajan. Avanza con estrategia de medio plazo y regula tu exposicion segun tu capacidad real.',
    'transit:pluto|ingress|house_4':
      'Pluton en ingreso a Casa 4 tiende a profundizar temas de base emocional, familia y estructura del hogar. Este ciclo puede revelar patrones antiguos que ya no sostienen seguridad interna con calidad. El mejor uso de la fase es reorganizar fundamentos con calma, firmeza y limites mas claros.',
    'transit:saturn|ingress|house_10':
      'Saturno en ingreso a Casa 10 marca una fase de consolidacion profesional mediante responsabilidad, constancia y criterio. La tendencia es reducir dispersion, priorizar entrega concreta y alinear expectativas con proceso real. Usa este periodo para construir reputacion con pasos sostenibles.',
    'transit:saturn|ingress|house_6':
      'Saturno en ingreso a Casa 6 favorece reorganizacion de rutina, trabajo diario y salud funcional con metodo. Este ciclo suele pedir disciplina simple, ritmos mas estables y recorte de sobrecarga recurrente. Pequenos ajustes repetidos pueden generar mejora relevante a medio plazo.',
    'transit:jupiter|ingress|house_2':
      'Jupiter en ingreso a Casa 2 tiende a ampliar oportunidades sobre recursos, valores y seguridad material. Esta fase favorece crecimiento cuando hay planificacion, criterio de riesgo y seguimiento de resultados. La expansion con estructura practica suele rendir mejor que entusiasmo sin metodo.',
    'transit:jupiter|ingress|house_11':
      'Jupiter en ingreso a Casa 11 abre ventana favorable para redes, colaboracion y proyectos colectivos de futuro. Este ciclo tiende a ampliar conexiones utiles cuando hay objetivo claro y reciprocidad real. Prioriza alianzas confiables y transforma contactos en cooperacion concreta.',
    'transit:uranus|ingress|house_7':
      'Urano en ingreso a Casa 7 tiende a renovar dinamicas de pareja, acuerdos y vinculos importantes. Este periodo puede pedir mas autonomia, flexibilidad y conversacion directa sobre expectativas de ambos lados. Ajustes conscientes ayudan a evitar rupturas reactivas y favorecen evolucion del vinculo.',
    'transit:neptune|ingress|house_12':
      'Neptuno en ingreso a Casa 12 tiende a ampliar sensibilidad, intuicion y procesos de cierre interno. Esta fase puede aumentar percepcion sutil y pide discernimiento para separar intuicion de idealizacion. Rutinas de descanso, silencio e higiene mental ayudan a estabilizar el ciclo.',
    'transit:mars|ingress|house_10':
      'Marte en ingreso a Casa 10 aumenta impulso para actuar en carrera y ocupar espacio con mayor visibilidad. La energia favorece iniciativa cuando hay direccion clara y regulacion del ritmo para evitar desgaste. Ejecuta por prioridades y convierte urgencia en progreso medible.',
    'transit:sun|ingress|house_10':
      'Sol en ingreso a Casa 10 ilumina metas publicas, responsabilidad y direccion profesional. Este momento tiende a favorecer visibilidad cuando combinas presencia, constancia y mensaje claro. Enfocate en lo esencial y usa la exposicion para reforzar posicionamiento coherente.',
    'transit:pluto|conjuncao|meio_do_ceu':
      'Pluton en conjuncion al Medio Cielo concentra presion de transformacion en carrera e imagen publica. Esta fase suele pedir decisiones mas profundas sobre autoridad, vocacion y posicionamiento profesional. Avanza con estrategia y constancia, evitando extremos por presion momentanea.',
    'transit:pluto|oposicao|fundo_do_ceu':
      'Pluton en oposicion al Fondo del Cielo puede activar tension entre exigencias externas y base emocional. Este ciclo suele pedir reequilibrar ambicion, hogar y seguridad interna. Usa limites practicos y mejor gestion del ritmo para sostener rendimiento y bienestar.',
    'transit:pluto|trigono|jupiter':
      'Pluton en trigono con Jupiter favorece crecimiento con profundidad, vision estrategica y reposicionamiento inteligente. Las oportunidades tienden a ampliarse cuando hay foco en calidad y sostenibilidad a largo plazo. Prioriza avances estructurales frente a ganancias rapidas sin base.',
    'transit:pluto|sesquiquadratura|moon':
      'Pluton en sesquicuadratura con Luna puede aumentar sensibilidad emocional y reactividad en temas familiares. Esta fase pide regular respuesta antes de actuar bajo presion. Pequenos ajustes de rutina y comunicacion emocional clara reducen desgaste interno.',
    'transit:pluto|sesquiquadratura|mars':
      'Pluton en sesquicuadratura con Marte incrementa tension entre urgencia de actuar y necesidad de control. El ciclo puede activar impaciencia o choques de fuerza si faltan prioridades claras. Canaliza energia en tareas esenciales y evita confrontaciones improductivas.',
    'transit:saturn|conjuncao|neptune':
      'Saturno en conjuncion con Neptuno combina realismo y sensibilidad, pidiendo convertir ideal en estructura concreta. Este periodo favorece separar intuicion util de expectativas difusas mediante metodo y criterio. Transforma inspiracion en pasos practicos con seguimiento regular.',
    'transit:mercury|semiquadratura|pluto':
      'Mercurio en semicuadratura con Pluton intensifica foco mental y puede aumentar rigidez de pensamiento. La fase pide cuidado con comunicacion reactiva, sospecha excesiva y conclusiones apresuradas. Verifica datos, simplifica mensajes y mantente abierto a revisar supuestos.',
    'transit:sun|semissextil|neptune':
      'Sol en semisextil con Neptuno amplifica percepcion sutil e imaginacion, con necesidad de direccion mas clara. La fase puede favorecer creatividad si se mantiene criterio practico activo. Ordena prioridades y revisa detalles para evitar dispersion.',
    'transit:moon|ingress|house_4':
      'Luna en ingreso a Casa 4 destaca necesidades de contencion, familia y clima del hogar. Este ciclo tiende a aumentar sensibilidad al contexto domestico y al sentido de pertenencia. Favorece descanso, ajustes simples en casa y conversaciones de apoyo.',
    'transit:sun|ingress|house_4':
      'Sol en ingreso a Casa 4 ilumina hogar, familia y bases internas de seguridad. La fase favorece atencion a fundamentos emocionales y organizacion de la vida privada. Pequenas decisiones sobre limites y rutina pueden aumentar estabilidad rapidamente.',
    'transit:mars|ingress|house_4':
      'Marte en ingreso a Casa 4 eleva iniciativa e intensidad en asuntos domesticos y familiares. El periodo puede ser productivo para resolver pendientes de casa, con riesgo de friccion si domina la prisa. Dirige energia a ajustes practicos y manten tono objetivo en dialogos sensibles.',
    'transit:jupiter|ingress|house_4':
      'Jupiter en ingreso a Casa 4 tiende a ampliar foco en hogar, familia y pertenencia emocional. Esta fase puede favorecer mejoras del entorno y acuerdos familiares de apoyo. Expande con planificacion para sostener crecimiento domestico en el tiempo.',
    'transit:saturn|ingress|house_4':
      'Saturno en ingreso a Casa 4 marca fase de consolidacion de base emocional y estructura familiar. El ciclo pide ordenar responsabilidades domesticas, limites y prioridades afectivas con mayor madurez. Ajustes constantes y realistas fortalecen seguridad interna y estabilidad cotidiana.',
    'transit:saturn|oposicao|jupiter':
      'Saturno en oposicion a Jupiter pide calibrar expansion con limites concretos. Esta fase puede mostrar exceso de optimismo o rigidez, y requiere equilibrio entre vision y ejecucion. Revisa metas, tiempos y recursos para crecer con seguridad.',
    'transit:moon|oposicao|jupiter':
      'Luna en oposicion a Jupiter puede amplificar reaccion emocional y expectativa inmediata. El ciclo favorece moderar excesos y volver a decisiones realistas. Pausas breves y prioridades claras ayudan a evitar dispersion.',
    'transit:saturn|oposicao|pluto':
      'Saturno en oposicion a Pluton intensifica pruebas de estructura, poder y resistencia. Esta fase pide madurez para sostener cambios profundos sin ruptura impulsiva. Avanza por etapas con estrategia y limites definidos.',
    'transit:sun|quadratura|moon':
      'Sol en cuadratura con Luna puede generar friccion entre voluntad consciente y necesidad emocional. Esta fase pide alinear lo que quieres hacer con el ritmo interno disponible. Ajustes simples de rutina y comunicacion reducen conflicto.',
    'transit:saturn|sextil|neptune':
      'Saturno en sextil a Neptuno favorece traducir intuicion en estructura practica. Esta fase ayuda a dar forma a ideas sensibles con metodo y constancia. Convierte inspiracion en pasos pequenos y verificables.',
    'transit:saturn|trigono|neptune':
      'Saturno en trigono a Neptuno sostiene equilibrio entre sensibilidad y realismo. El periodo favorece consolidar vision de largo plazo con disciplina y criterio. Buen momento para estructurar proyectos creativos o espirituales con base practica.',
    'transit:sun|sextil|moon':
      'Sol en sextil con Luna facilita integracion entre voluntad y emocion. Esta fase mejora fluidez en conversaciones, ajustes de rutina y decisiones cotidianas. Aprovecha para alinear prioridades internas y externas.',
    'transit:sun|trigono|moon':
      'Sol en trigono con Luna refuerza coherencia entre identidad y necesidades emocionales. El periodo suele traer mayor estabilidad para organizar elecciones importantes. Aprovecha para consolidar habitos sostenibles.',
    'transit:saturn|sextil|ascendente':
      'Saturno en sextil al Ascendente favorece postura solida, foco y autogestion. Esta fase apoya avances constantes cuando hay disciplina y limites claros. Pequenos compromisos sostenidos construyen confianza.',
    'transit:saturn|trigono|ascendente':
      'Saturno en trigono al Ascendente fortalece madurez, presencia y ritmo estable. El periodo facilita ordenar responsabilidades sin sobrecarga innecesaria. Mantener constancia ayuda a consolidar base duradera.',
    'transit:saturn|oposicao|saturn':
      'Saturno en oposicion a Saturno marca un punto de revision de estructuras de largo plazo. El ciclo puede evidenciar limites reales en modelos antiguos y pedir reorganizacion objetiva. Enfocate en lo esencial y recalibra compromisos.',
    'transit:moon|sextil|saturn':
      'Luna en sextil a Saturno ayuda a regular emociones con practicidad y sobriedad. Esta fase favorece conversaciones maduras y mejor organizacion afectiva cotidiana. Buen momento para reforzar estructura de apoyo.',
    'transit:moon|trigono|saturn':
      'Luna en trigono a Saturno favorece estabilidad emocional y responsabilidad equilibrada. El ciclo facilita decisiones prudentes sin endurecimiento excesivo. Usa el momento para consolidar acuerdos y limites saludables.',
    'transit:moon|quadratura|mars':
      'Luna en cuadratura con Marte puede aumentar irritacion e impulsividad emocional. La fase pide cuidado con reacciones rapidas en roces diarios. Baja velocidad, respira y canaliza energia en tareas concretas.',
    'transit:moon|conjuncao|uranus':
      'Luna en conjuncion con Urano aumenta necesidad de libertad emocional y cambio rapido. Este ciclo puede traer variaciones de humor y sorpresas en vinculos cercanos. Flexibilidad con limites claros ayuda a sostener equilibrio.',
    'transit:moon|oposicao|mars':
      'Luna en oposicion a Marte puede elevar reactividad en relaciones y decisiones inmediatas. La fase pide calibrar impulso y escucha para evitar desgaste innecesario. Prioriza dialogo objetivo y pausas estrategicas.',
    'transit:moon|conjuncao|mars':
      'Luna en conjuncion con Marte aumenta intensidad afectiva y urgencia por actuar. El periodo puede ser productivo para resolver pendientes, con riesgo de prisa emocional. Dirige energia a acciones cortas y evita discusiones reactivas.',
    'transit:saturn|quadratura|moon':
      'Saturno en cuadratura con Luna puede elevar exigencia emocional y necesidad de contencion. El ciclo pide cuidar base afectiva con disciplina simple y descanso suficiente. Organiza rutinas de soporte para evitar sobrecarga interna.',
    'transit:moon|quadratura|jupiter':
      'Luna en cuadratura con Jupiter puede inflar expectativas y oscilacion emocional frente a resultados. Esta fase pide moderacion para evitar exceso afectivo o decisorio. Revisa prioridades y mantente en lo viable ahora.',
    'transit:uranus|sextil|moon':
      'Urano en sextil con Luna favorece renovacion emocional con mas ligereza y creatividad. El periodo ayuda a probar habitos nuevos sin ruptura brusca. Pequenos cambios conscientes mejoran bienestar rapidamente.',
    'transit:uranus|trigono|moon':
      'Urano en trigono con Luna facilita actualizar patrones emocionales con autonomia. Esta fase abre espacio para elecciones mas autenticas en lo cotidiano. Usa la flexibilidad para ajustar rutina y vinculos con responsabilidad.',
    'transit:pluto|oposicao|venus':
      'Pluton en oposicion a Venus intensifica temas de vinculo, valor personal y reciprocidad. El ciclo puede mostrar dinamicas de apego y control que piden reposicionamiento consciente. Busca acuerdos mas autenticos con limites claros.',
    'transit:uranus|conjuncao|saturn':
      'Urano en conjuncion a Saturno combina renovacion y estructura, y pide actualizar modelos antiguos. Esta fase favorece innovar con responsabilidad sin destruir lo que aun funciona. Ajustes progresivos suelen rendir mejor que giros bruscos.',
    'transit:uranus|sextil|mercury':
      'Urano en sextil con Mercurio favorece ideas nuevas, conexiones rapidas y ajustes mentales inteligentes. Esta fase tiende a impulsar innovacion en comunicacion sin perder funcionalidad. Prueba enfoques distintos y valida impacto antes de escalar.',
    'transit:uranus|trigono|mercury':
      'Urano en trigono con Mercurio aporta claridad para pensar fuera del patron con mas fluidez. El periodo favorece aprendizaje agil, creatividad intelectual y actualizacion de procesos. Convierte insights en pasos practicos para consolidar avance real.',
    'transit:sun|oposicao|neptune':
      'Sol en oposicion a Neptuno puede aumentar confusion entre foco objetivo e idealizacion. Este ciclo pide separar percepcion sensible de expectativas sin base concreta. Simplifica prioridades y confirma datos antes de decidir.',
    'transit:moon|oposicao|mercury':
      'Luna en oposicion a Mercurio puede acentuar conflicto entre reaccion emocional y lectura racional. La fase pide cuidado con mensajes impulsivos y conclusiones inmediatas. Haz una pausa, ordena lo que sientes y comunica con claridad.',
    'transit:saturn|oposicao|mercury':
      'Saturno en oposicion a Mercurio trae prueba de consistencia mental y comunicacional. El periodo puede exigir mas revision, criterio y paciencia con tiempos o respuestas. Estructura argumentos con datos y avanza por etapas verificables.',
    'transit:sun|conjuncao|pluto':
      'Sol en conjuncion con Pluton intensifica foco, control y necesidad de autenticidad. Este ciclo favorece cambios profundos cuando actuas con consciencia y estrategia. Dirige energia a lo esencial y evita disputas de poder improductivas.',
    'transit:uranus|oposicao|mercury':
      'Urano en oposicion a Mercurio puede traer rupturas de ideas, noticias inesperadas y cambios de perspectiva. La fase pide flexibilidad sin perder criterio al evaluar hechos. Revisa planes rapido, pero decide con base objetiva.',
    'transit:pluto|quadratura|jupiter':
      'Pluton en cuadratura con Jupiter puede ampliar ambicion y tensionar limites de crecimiento. Este ciclo pide calibrar expansion con profundidad estrategica y responsabilidad. Evita excesos y prioriza avances sostenibles a largo plazo.',
    'transit:uranus|conjuncao|meio_do_ceu':
      'Urano en conjuncion al Medio Cielo tiende a acelerar reposicionamiento profesional y cambio de imagen publica. La fase favorece innovacion de carrera cuando hay experimentacion con direccion clara. Actualiza posicionamiento sin romper estructura esencial.',
    'transit:uranus|quadratura|moon':
      'Urano en cuadratura con Luna puede aumentar inestabilidad emocional y necesidad inmediata de libertad. La fase pide ajustar rutina afectiva para reducir reactividad en hogar y vinculos cercanos. Cambios pequenos y conscientes suelen funcionar mejor que cortes bruscos.',
    'transit:jupiter|sextil|sun':
      'Jupiter en sextil al Sol favorece confianza practica, vision de crecimiento y decisiones mas amplias. Este ciclo tiende a apoyar avances cuando entusiasmo y criterio van juntos. Aprovecha oportunidades con planificacion para sostener resultados.',
    'transit:jupiter|trigono|sun':
      'Jupiter en trigono al Sol aumenta fluidez para expandir metas con mayor seguridad interna. La fase puede facilitar reconocimiento y progreso cuando hay foco en lo esencial. Usa el momento para consolidar avances sin exceder el ritmo.',
    'transit:uranus|conjuncao|ascendente':
      'Urano en conjuncion al Ascendente tiende a marcar reposicionamiento personal y cambio en el estilo de accion. Este periodo favorece autenticidad, autonomia y ajustes de identidad en lo cotidiano. Renueva tu forma de presentarte con libertad responsable.',
    'transit:pluto|sextil|mars':
      'Pluton en sextil con Marte fortalece determinacion, estrategia y capacidad de actuar con profundidad. El ciclo favorece reducir dispersion y enfocar tareas de alto impacto. Dirige energia con precision para evitar desgaste innecesario.',
    'transit:pluto|trigono|mars':
      'Pluton en trigono con Marte amplifica fuerza de ejecucion y persistencia para cambios relevantes. La fase tiende a favorecer accion constante, con menos reaccion impulsiva y mas intencion estrategica. Avanza por etapas y consolida ganancia estructural.',
    'transit:pluto|quadratura|moon':
      'Pluton en cuadratura con Luna puede intensificar vulnerabilidad emocional y temas de seguridad afectiva. El ciclo pide regular reactividad y revisar patrones antiguos de proteccion. Conversaciones claras y rutina de apoyo ayudan a sostener estabilidad.',
    'transit:moon|conjuncao|sun':
      'Luna en conjuncion con Sol marca un punto de reinicio emocional y alineacion de intencion. Esta fase favorece ajustes simples de prioridad y apertura a nuevos ciclos de accion. Define un paso corto y constante para dar direccion al dia.',
    'transit:pluto|sextil|sun':
      'Pluton en sextil al Sol favorece fortalecimiento interno y reposicionamiento mas autentico. Este ciclo puede apoyar decisiones profundas sin ruptura dramatica. Enfoca esfuerzo en lo que tiene valor a largo plazo.',
    'transit:pluto|trigono|sun':
      'Pluton en trigono al Sol amplifica concentracion, claridad de proposito y consistencia de rumbo. La fase tiende a favorecer transformaciones bien sostenidas. Usa el periodo para consolidar identidad y direccion con madurez.',
    'transit:saturn|oposicao|ascendente':
      'Saturno en oposicion al Ascendente puede probar limites en relaciones, acuerdos y responsabilidades compartidas. El ciclo pide postura madura, escucha y definicion clara de fronteras. Ajustes realistas de convivencia suelen reducir friccion y mejorar estabilidad.',
    'transit:pluto|conjuncao|mars':
      'Pluton en conjuncion con Marte intensifica voluntad, competitividad y necesidad de actuar con fuerza. El ciclo pide autocontrol para evitar conflictos impulsivos y desgaste de energia. Canaliza intensidad en metas estructurales y decisiones estrategicas.',
    'transit:sun|oposicao|uranus':
      'Sol en oposicion a Urano puede traer ruptura de ritmo, reaccion a limites y deseo de libertad inmediata. La fase pide flexibilidad con responsabilidad para evitar decisiones bruscas. Revisa prioridades y ajusta rumbo sin perder coherencia.',
    'transit:uranus|quadratura|sun':
      'Urano en cuadratura al Sol senala tension entre identidad actual y necesidad de cambio. El ciclo puede generar inquietud, impaciencia y ganas de cambiar todo de golpe. Innova por etapas para preservar base y ganar autonomia estable.',
    'transit:saturn|oposicao|sun':
      'Saturno en oposicion al Sol aumenta exigencia externa y prueba de consistencia personal. El periodo puede requerir mas disciplina, ajuste de limites y foco en lo esencial. Estructura rutinas sostenibles y avanza con criterio, sin autocritica excesiva.',
    'transit:saturn|quadratura|venus':
      'Saturno en cuadratura con Venus puede traer revision de expectativas afectivas y valores materiales. El ciclo pide madurez emocional, limites claros y elecciones mas realistas. Fortalece lo reciproco y reduce acuerdos que drenan energia.',
    'transit:sun|conjuncao|mercury':
      'Sol en conjuncion con Mercurio favorece claridad mental, foco comunicativo y decision objetiva. La fase tiende a apoyar conversaciones importantes, estudio y organizacion de ideas. Prioriza mensajes simples alineados con lo esencial.',
    'transit:jupiter|conjuncao|moon':
      'Jupiter en conjuncion con Luna amplifica sensibilidad, contencion y percepcion de apoyo emocional. El ciclo puede favorecer apertura afectiva y vision mas amplia de necesidades internas. Evita excesos emocionales y mantén equilibrio en elecciones.',
    'transit:jupiter|oposicao|pluto':
      'Jupiter en oposicion a Pluton puede ampliar disputas de vision, control y poder de decision. El periodo pide calibrar ambicion con etica, profundidad y sentido de limite. El crecimiento consistente llega por estrategia, no por extremos.',
    'transit:neptune|quadratura|venus':
      'Neptuno en cuadratura con Venus puede generar idealizacion afectiva y confusion sobre valor y reciprocidad. El ciclo pide discernimiento para diferenciar intuicion de proyeccion. Observa senales concretas antes de cerrar acuerdos emocionales o financieros.',
    'transit:saturn|sextil|moon':
      'Saturno en sextil con Luna ayuda a estabilizar emociones mediante rutina y responsabilidad afectiva. La fase favorece conversaciones maduras y mejor gestion del tiempo interno. Pequenos habitos de cuidado traen seguridad y continuidad.',
    'transit:saturn|trigono|moon':
      'Saturno en trigono con Luna favorece consistencia emocional, sobriedad y confianza en decisiones cotidianas. El ciclo tiende a apoyar acuerdos estables y limites saludables. Usa el periodo para consolidar base afectiva con simplicidad.',
    'transit:venus|conjuncao|jupiter':
      'Venus en conjuncion con Jupiter amplifica placer, generosidad y oportunidades de armonia en vinculos. La fase favorece encuentros, acuerdos y clima relacional mas positivo. Aprovecha el flujo con moderacion para evitar excesos.',
    'transit:uranus|sextil|venus':
      'Urano en sextil con Venus favorece renovacion afectiva y financiera con mas ligereza y creatividad. El ciclo apoya ajustes de valor personal y nuevos formatos de vinculo. Innova con consciencia para sostener libertad y reciprocidad.',
    'transit:uranus|trigono|venus':
      'Urano en trigono con Venus facilita actualizar relaciones, gustos y elecciones de valor con naturalidad. La fase tiende a ampliar autenticidad sin ruptura innecesaria. Prueba nuevas formas de intercambio con equilibrio.',
    'transit:jupiter|quadratura|moon':
      'Jupiter en cuadratura con Luna puede ampliar oscilacion emocional y expectativa de respuesta inmediata. El ciclo pide moderacion para evitar exageros en reacciones y decisiones. Ajusta ritmo, prioriza lo esencial y mantén realismo afectivo.',
    'transit:neptune|quadratura|moon':
      'Neptuno en cuadratura con Luna puede aumentar sensibilidad, niebla emocional y dificultad para definir limites internos. La fase pide descanso, higiene mental y verificacion de realidad antes de reaccionar. Fortalece rutina de centrado para reducir confusion afectiva.',
    'transit:moon|ingress|house_2':
      'Luna en ingreso a Casa 2 destaca seguridad material, valor personal y necesidades de estabilidad practica en lo cotidiano. La fase favorece revisar gastos, confort y prioridades practicas con mayor sensibilidad. Pequenos ajustes financieros y organizacion simple suelen traer mas calma.',
    'transit:saturn|quadratura|pluto':
      'Saturno en cuadratura con Pluton puede presionar estructuras profundas, limites y compromisos de largo plazo. Esta fase pide paciencia estrategica, ritmo realista y gestion cuidadosa de recursos. Prioriza reconstruccion sostenible en lugar de control forzado.',
    'transit:jupiter|quadratura|ascendente':
      'Jupiter en cuadratura al Ascendente puede ampliar visibilidad y confianza, con riesgo de sobreextender imagen o promesas. Esta fase funciona mejor con limites claros y consistencia practica. Expande con criterio para sostener resultados.',
    'transit:jupiter|quadratura|mars':
      'Jupiter en cuadratura con Marte puede aumentar impulso y ambicion, pero bajar precision tactica. El ciclo pide equilibrar velocidad con metodo y timing. Convierte entusiasmo en pasos medibles y evita friccion innecesaria.',
    'transit:pluto|conjuncao|sun':
      'Pluton en conjuncion con Sol intensifica temas de identidad, direccion y poder personal. Esta fase suele pedir elecciones mas autenticas y alineacion profunda con lo esencial. Avanza con estrategia, disciplina y regulacion emocional.',
    'transit:pluto|quadratura|mars':
      'Pluton en cuadratura con Marte puede elevar presion, impaciencia y conflictos de control en la accion. Este ciclo pide ejecucion disciplinada y uso consciente de la fuerza. Prioriza tareas esenciales y evita confrontaciones reactivas.',
    'transit:saturn|conjuncao|jupiter':
      'Saturno en conjuncion con Jupiter combina expansion y estructura con mirada de largo plazo. El periodo favorece crecimiento realista, prioridades objetivas y criterio de ejecucion. Construye por etapas para mantener sostenibilidad.',
    'transit:saturn|sextil|uranus':
      'Saturno en sextil a Urano favorece innovacion con consistencia y base operativa. Esta fase ayuda a actualizar sistemas sin romper lo que aun funciona. Prueba cambios de forma controlada y con metricas claras.',
    'transit:saturn|trigono|uranus':
      'Saturno en trigono a Urano facilita modernizacion estable y renovacion inteligente de procesos. El ciclo favorece innovacion practica con baja disrupcion. Consolida mejoras con metodo y seguimiento.',
    'transit:uranus|sextil|mars':
      'Urano en sextil con Marte impulsa iniciativa, agilidad y experimentacion tactica. Esta fase suele favorecer ajustes inteligentes y ejecucion mas rapida con consciencia. Mantén foco en innovacion util, no en aceleracion vacia.',
    'transit:uranus|trigono|mars':
      'Urano en trigono con Marte mejora accion decidida con flexibilidad y resolucion creativa. El ciclo apoya cambios productivos cuando las prioridades estan claras. Usa el impulso para desbloquear progreso practico.',
    'transit:jupiter|oposicao|saturn':
      'Jupiter en oposicion a Saturno muestra tension entre expansion y limites. Esta fase pide equilibrio entre vision y viabilidad en compromisos actuales. Recalibra metas, plazos y distribucion de recursos.',
    'transit:neptune|conjuncao|meio_do_ceu':
      'Neptuno en conjuncion al Medio Cielo puede aumentar sensibilidad sobre vocacion, imagen y sentido profesional. Esta fase pide discernimiento entre inspiracion y proyeccion. Mantén direccion clara y valida decisiones con señales concretas.',
    'transit:saturn|sextil|meio_do_ceu':
      'Saturno en sextil al Medio Cielo favorece consolidacion profesional por constancia y responsabilidad. Este ciclo apoya crecimiento estable basado en calidad de ejecucion. Refuerza posicionamiento con compromisos realistas.',
    'transit:saturn|trigono|meio_do_ceu':
      'Saturno en trigono al Medio Cielo refuerza reputacion, estructura y direccion de carrera a largo plazo. El periodo suele recompensar metodo, fiabilidad y entrega disciplinada. Sostén foco en fundamentos y progreso estable.',
    'transit:uranus|conjuncao|sun':
      'Urano en conjuncion con Sol tiende a acelerar cambios de identidad y reposicionamiento personal. Esta fase puede aumentar necesidad de autonomia y decisiones experimentales. Innova con responsabilidad para evitar inestabilidad brusca.',
    'transit:jupiter|oposicao|neptune':
      'Jupiter en oposicion a Neptuno puede ampliar idealizacion y expectativas difusas sin verificacion. Este ciclo pide criterios claros y chequeo de hechos antes de decisiones grandes. Mantén inspiracion con base practica.',
    'transit:jupiter|quadratura|neptune':
      'Jupiter en cuadratura con Neptuno puede aumentar entusiasmo con menor claridad sobre limites reales. Esta fase pide discernir entre vision con fundamento y proyeccion optimista. Revisa supuestos y regula ritmo de expansion.',
    'transit:pluto|conjuncao|saturn':
      'Pluton en conjuncion con Saturno profundiza transformacion estructural y responsabilidades clave. El ciclo puede exigir decisiones maduras sobre control, resistencia y reconstruccion necesaria. Avanza por etapas con estrategia y limites claros.',
    'transit:pluto|oposicao|jupiter':
      'Pluton en oposicion a Jupiter puede intensificar disputas sobre escala, poder y direccion estrategica. Esta fase pide expansion etica y calibracion realista de la ambicion. Prioriza influencia sostenible sobre magnitud inmediata.',
    'transit:saturn|quadratura|mars':
      'Saturno en cuadratura con Marte puede generar friccion entre urgencia y restriccion en la ejecucion. Este ciclo pide disciplina, timing y reduccion de esfuerzo impulsivo. Convierte presion en accion metodica.',
    'transit:jupiter|quadratura|venus':
      'Jupiter en cuadratura con Venus puede aumentar busqueda de placer y optimismo en elecciones afectivas o financieras. Esta fase favorece moderacion y criterio de valor mas claro. Expande con equilibrio para evitar excesos.',
    'transit:neptune|quadratura|saturn':
      'Neptuno en cuadratura con Saturno puede tensionar certezas, estructura y tolerancia a la ambiguedad. Esta fase pide ajustar expectativas y reconstruir planes con flexibilidad realista. Combina intuicion con verificacion objetiva.',
    'transit:pluto|oposicao|sun':
      'Pluton en oposicion al Sol puede activar polaridad fuerte sobre identidad, autoridad y direccion personal. Este ciclo pide uso consciente del poder y alineacion profunda con prioridades reales. Evita respuestas de todo o nada.',
    'transit:pluto|oposicao|mars':
      'Pluton en oposicion a Marte puede intensificar presion competitiva y dinamicas de conflicto al actuar. Esta fase pide autorregulacion y contencion estrategica bajo estres. Dirige fuerza hacia resultados constructivos.',
    'transit:pluto|quadratura|mercury':
      'Pluton en cuadratura con Mercurio puede intensificar pensamiento, sospecha y rigidez comunicativa. Este ciclo pide analisis basado en evidencia y dialogo mas limpio. Revisa supuestos antes de conclusiones tajantes.',
  },
  'it-IT': {
    'transit:jupiter|conjuncao|meio_do_ceu':
      'Giove in congiunzione al Medio Cielo puo aumentare visibilita e aprire spazio a crescita professionale. Questo ciclo favorisce riconoscimento quando direzione, costanza e aspettative restano realistiche. Evita promesse eccessive e consolida progressi per fasi.',
    'transit:jupiter|sextil|meio_do_ceu':
      'Giove in sestile al Medio Cielo facilita accordi e slancio per evoluzione professionale. La fase tende a favorire espansione con strategia e priorita chiare. Piccole decisioni ben eseguite possono avere impatto concreto nel medio periodo.',
    'transit:jupiter|trigono|meio_do_ceu':
      'Giove in trigono al Medio Cielo migliora fluidita negli obiettivi pubblici e professionali. Il riconoscimento e piu probabile quando qualita tecnica e comunicazione chiara procedono insieme. Usa la fase per crescita sostenibile senza eccesso di fiducia.',
    'transit:saturn|quadratura|saturn':
      'Saturno in quadratura con Saturno indica un periodo di revisione strutturale e maturazione. Puo emergere pressione per regolare tempi, limiti e responsabilita con maggiore oggettivita. Il guadagno arriva semplificando impegni e rafforzando le basi reali.',
    'transit:saturn|sextil|sun':
      'Saturno in sestile al Sole favorisce disciplina, stabilita e progresso costante. Questa fase aiuta a tradurre intenzione in risultato con routine e criterio. I passi possono essere piccoli, ma piu solidi.',
    'transit:saturn|trigono|sun':
      'Saturno in trigono al Sole rafforza focus, costanza e fiducia pratica nelle decisioni. Il periodo tende a sostenere consolidamento degli obiettivi con meno dispersione. Dai priorita all essenziale e mantieni un ritmo sostenibile.',
    'transit:saturn|oposicao|uranus':
      'Saturno in opposizione a Urano porta tensione tra stabilita e bisogno di cambiamento. Questo ciclo chiede equilibrio tra preservare struttura e aprire spazio ad aggiustamenti intelligenti. Evita estremi e procedi con esperimenti controllati.',
    'transit:saturn|quadratura|uranus':
      'Saturno in quadratura a Urano segnala attrito tra controllo e rinnovamento. Puoi avvertire disagio verso regole vecchie o cambi troppo rapidi. Il miglior uso della fase e riorganizzare processi senza rompere cio che funziona.',
    'transit:saturn|sextil|mars':
      'Saturno in sestile a Marte favorisce azione disciplinata ed esecuzione efficiente. L energia rende meglio quando le priorita sono ordinate e l impulso viene regolato. Buon periodo per completare compiti impegnativi con costanza.',
    'transit:saturn|trigono|mars':
      'Saturno in trigono a Marte rafforza produttivita, perseveranza e strategia di lungo periodo. Questa fase aiuta a trasformare sforzo in risultato concreto con meno dispersione. Dirigi energia verso obiettivi chiari e misurabili.',
    'transit:saturn|sextil|saturn':
      'Saturno in sestile a Saturno sostiene consolidamento e maturita di strutture importanti. Il periodo favorisce revisione pragmatica di processi, accordi e responsabilita. Aggiustamenti graduali possono creare basi piu stabili.',
    'transit:saturn|trigono|saturn':
      'Saturno in trigono a Saturno indica stabilita funzionale e buona capacita organizzativa. Diventa piu semplice mantenere disciplina e completare tappe con qualita. Usa il periodo per consolidare fondamenta e ridurre rumore operativo.',
    'transit:sun|oposicao|pluto':
      'Sole in opposizione a Plutone intensifica temi di controllo, potere personale e priorita reali. Questo ciclo puo mostrare polarita che chiedono una postura piu consapevole e meno reattiva. Concentrati sull essenziale con fermezza e senza scontri inutili.',
    'transit:saturn|oposicao|mars':
      'Saturno in opposizione a Marte puo dare sensazione di freno o ritardo nell esecuzione. La fase chiede di calibrare forza e tempi, evitando sia impulso sia blocco totale. Pianificazione tattica e costanza aiutano a recuperare trazione.',
    'transit:saturn|quadratura|mercury':
      'Saturno in quadratura a Mercurio richiede precisione nella comunicazione e revisione delle ipotesi. Possono emergere maggiore pressione mentale, ritardi o bisogno di dettagli extra. Verifica informazioni, semplifica messaggi e avanza per fasi.',
    'transit:saturn|quadratura|sun':
      'Saturno in quadratura al Sole aumenta senso di responsabilita e test di coerenza. Il periodo puo risultare piu esigente, chiedendo focus sull essenziale e taglio degli eccessi. Struttura, riposo e priorita chiare evitano usura improduttiva.',
    'transit:saturn|sextil|venus':
      'Saturno in sestile a Venere favorisce scelte mature in relazioni, accordi e valori. La fase sostiene impegno sostenibile con meno idealizzazione e piu coerenza pratica. Buon periodo per allineare aspettative e rafforzare legami affidabili.',
    'transit:saturn|trigono|venus':
      'Saturno in trigono a Venere rafforza stabilita affettiva e finanziaria attraverso criterio. C e tendenza a preferire qualita, costanza e accordi di lungo periodo. Usa il ciclo per consolidare cio che ha valore reale nella routine.',
    'transit:saturn|sextil|jupiter':
      'Saturno in sestile a Giove unisce espansione e realismo strategico. Il periodo favorisce crescita con pianificazione senza perdere sicurezza di base. Avanza con obiettivi concreti, scadenze chiare e revisioni periodiche.',
    'transit:saturn|trigono|jupiter':
      'Saturno in trigono a Giove sostiene crescita costante con equilibrio tra visione ed esecuzione. Questa fase tende a facilitare progresso solido quando metodo e pazienza sono presenti. Struttura opportunita per fasi per risultati durevoli.',
    'transit:pluto|ingress|house_10':
      'Plutone in ingresso in Casa 10 tende ad avviare un ciclo di riposizionamento profondo su carriera, reputazione e direzione pubblica. Questa fase chiede spesso scelte piu autentiche e meno compromessi con percorsi non piu coerenti. Procedi con strategia di medio periodo e calibra l esposizione in modo sostenibile.',
    'transit:pluto|ingress|house_4':
      'Plutone in ingresso in Casa 4 tende ad approfondire temi di base emotiva, famiglia e struttura della casa. Questo ciclo puo mostrare schemi antichi che non sostengono piu sicurezza interiore con qualita. Il miglior uso della fase e riorganizzare fondamenta con calma, fermezza e confini piu chiari.',
    'transit:saturn|ingress|house_10':
      'Saturno in ingresso in Casa 10 indica una fase di consolidamento professionale attraverso responsabilita, costanza e criterio. La tendenza e ridurre dispersione, dare priorita a consegne concrete e allineare aspettative al processo reale. Usa il periodo per costruire reputazione con passi sostenibili e prevedibili.',
    'transit:saturn|ingress|house_6':
      'Saturno in ingresso in Casa 6 favorisce riorganizzazione di routine, lavoro quotidiano e salute funzionale con metodo. Questa fase tende a chiedere disciplina semplice, ritmi piu stabili e riduzione del sovraccarico ricorrente. Piccoli aggiustamenti ripetuti possono produrre miglioramento rilevante nel medio periodo.',
    'transit:jupiter|ingress|house_2':
      'Giove in ingresso in Casa 2 tende ad ampliare opportunita su risorse, valori e sicurezza materiale. La fase favorisce crescita quando sono presenti pianificazione, criterio di rischio e monitoraggio dei risultati. Espansione con struttura pratica tende a rendere piu di entusiasmo senza metodo.',
    'transit:jupiter|ingress|house_11':
      'Giove in ingresso in Casa 11 apre una finestra favorevole per reti, collaborazione e progetti collettivi orientati al futuro. Questo ciclo tende ad ampliare connessioni utili quando obiettivi e reciprocita sono chiari. Dai priorita ad alleanze affidabili e trasforma contatti in cooperazione concreta.',
    'transit:uranus|ingress|house_7':
      'Urano in ingresso in Casa 7 tende a rinnovare dinamiche di relazione, accordi e legami importanti. Questo periodo puo chiedere piu autonomia, flessibilita e dialogo diretto sulle aspettative di entrambe le parti. Aggiustamenti consapevoli aiutano a evitare rotture reattive e favoriscono evoluzione del legame.',
    'transit:neptune|ingress|house_12':
      'Nettuno in ingresso in Casa 12 tende ad ampliare sensibilita, intuizione e processi di chiusura interiore. Questa fase puo aumentare percezioni sottili e richiede discernimento tra intuizione e idealizzazione. Routine di riposo, silenzio e igiene mentale aiutano a stabilizzare il ciclo.',
    'transit:mars|ingress|house_10':
      'Marte in ingresso in Casa 10 aumenta la spinta ad agire nella carriera e occupare spazio con piu visibilita. L energia favorisce iniziativa quando direzione e chiara e il ritmo e regolato per evitare usura. Esegui per priorita e trasforma urgenza in progresso misurabile.',
    'transit:sun|ingress|house_10':
      'Sole in ingresso in Casa 10 mette in luce obiettivi pubblici, responsabilita e direzione professionale. Questa fase tende a favorire visibilita quando unisci presenza, coerenza e comunicazione chiara. Concentrati sull essenziale e usa l esposizione per rafforzare un posizionamento coerente.',
    'transit:pluto|conjuncao|meio_do_ceu':
      'Plutone in congiunzione al Medio Cielo concentra spinta trasformativa su carriera e immagine pubblica. Questa fase tende a richiedere scelte piu profonde su autorita, vocazione e posizionamento a lungo termine. Avanza con strategia e continuita, evitando reazioni estreme alla pressione del momento.',
    'transit:pluto|oposicao|fundo_do_ceu':
      'Plutone in opposizione al Fondo Cielo puo attivare tensione tra richieste esterne e base emotiva. Questo ciclo chiede spesso di riequilibrare ambizione, casa e sicurezza interiore. Usa confini pratici e gestione del ritmo per proteggere rendimento e stabilita personale.',
    'transit:pluto|trigono|jupiter':
      'Plutone in trigono con Giove favorisce crescita con profondita, visione strategica e riposizionamento intelligente. Le opportunita tendono ad ampliarsi quando il focus resta su qualita e sostenibilita di lungo periodo. Dai priorita a progressi strutturali piu che a guadagni rapidi senza base.',
    'transit:pluto|sesquiquadratura|moon':
      'Plutone in sesquiquadratura con Luna puo aumentare sensibilita emotiva e reattivita nei temi familiari. Questa fase chiede regolazione consapevole prima di reagire sotto pressione. Piccoli aggiustamenti di routine e linguaggio emotivo piu chiaro riducono usura interna.',
    'transit:pluto|sesquiquadratura|mars':
      'Plutone in sesquiquadratura con Marte aumenta tensione tra urgenza di agire e bisogno di controllo. Il ciclo puo attivare impazienza o attriti di potere quando le priorita non sono chiare. Convoglia energia su compiti essenziali ed evita scontri improduttivi.',
    'transit:saturn|conjuncao|neptune':
      'Saturno in congiunzione con Nettuno unisce realismo e sensibilita, chiedendo di tradurre l ideale in struttura concreta. Il periodo favorisce separare intuizione utile da aspettative diffuse con metodo e criterio. Trasforma ispirazione in passi pratici con verifica regolare.',
    'transit:mercury|semiquadratura|pluto':
      'Mercurio in semiquadratura con Plutone intensifica concentrazione mentale e puo aumentare rigidita di pensiero. La fase richiede attenzione a comunicazione reattiva, sospetto e conclusioni premature. Verifica fatti, semplifica messaggi e resta aperto a rivedere ipotesi.',
    'transit:sun|semissextil|neptune':
      'Sole in semisestile con Nettuno amplia percezione sottile e immaginazione, con bisogno di direzione piu chiara. La fase puo favorire creativita se resta attivo il criterio pratico. Mantieni priorita ordinate e controlla i dettagli per evitare dispersione.',
    'transit:moon|ingress|house_4':
      'Luna in ingresso in Casa 4 evidenzia bisogno di radicamento emotivo, famiglia e clima domestico. Questo ciclo tende ad aumentare sensibilita verso contesto di casa e appartenenza. Favorisce riposo, piccoli aggiustamenti domestici e dialoghi di supporto.',
    'transit:sun|ingress|house_4':
      'Sole in ingresso in Casa 4 illumina casa, famiglia e basi interne di sicurezza. La fase favorisce attenzione ai fondamenti emotivi e organizzazione della vita privata. Piccole scelte su confini e routine possono aumentare stabilita in tempi brevi.',
    'transit:mars|ingress|house_4':
      'Marte in ingresso in Casa 4 aumenta iniziativa e intensita nelle questioni domestiche e familiari. Il periodo puo essere produttivo per risolvere arretrati di casa, con rischio di attrito se prevale la fretta. Dirigi energia su aggiustamenti pratici e mantieni tono oggettivo nei dialoghi sensibili.',
    'transit:jupiter|ingress|house_4':
      'Giove in ingresso in Casa 4 tende ad ampliare focus su casa, famiglia e senso di appartenenza emotiva. Questa fase puo favorire miglioramenti dell ambiente e accordi familiari di supporto. Espandi con pianificazione per rendere la crescita domestica sostenibile nel tempo.',
    'transit:saturn|ingress|house_4':
      'Saturno in ingresso in Casa 4 indica una fase di consolidamento della base emotiva e della struttura familiare. Il ciclo chiede di ordinare responsabilita domestiche, confini e priorita affettive con maggiore maturita. Aggiustamenti costanti e realistici rafforzano sicurezza interiore e stabilita quotidiana.',
    'transit:saturn|oposicao|jupiter':
      'Saturno in opposizione a Giove chiede di calibrare espansione e limiti concreti. Questa fase puo mostrare eccesso di ottimismo o rigidita, e richiede equilibrio tra visione ed esecuzione. Rivedi obiettivi, tempi e risorse per crescere in modo sicuro.',
    'transit:moon|oposicao|jupiter':
      'Luna in opposizione a Giove puo amplificare reattivita emotiva e aspettative immediate. Il ciclo favorisce moderazione e ritorno a scelte realistiche. Pause brevi e priorita piu chiare aiutano a ridurre dispersione.',
    'transit:saturn|oposicao|pluto':
      'Saturno in opposizione a Plutone intensifica test su struttura, potere e resilienza. Questa fase chiede maturita per sostenere cambiamenti profondi senza rotture impulsive. Procedi per tappe con strategia e confini definiti.',
    'transit:sun|quadratura|moon':
      'Sole in quadratura con Luna puo creare attrito tra intenzione cosciente e bisogno emotivo. La fase chiede allineamento tra cio che vuoi fare e il ritmo interno disponibile. Aggiustamenti semplici di routine e comunicazione riducono tensione.',
    'transit:saturn|sextil|neptune':
      'Saturno in sestile a Nettuno favorisce tradurre intuizione in struttura pratica. Questa fase aiuta a dare forma concreta a idee sensibili con metodo e continuita. Trasforma ispirazione in piccoli passi verificabili.',
    'transit:saturn|trigono|neptune':
      'Saturno in trigono a Nettuno sostiene equilibrio tra sensibilita e realismo. Il periodo favorisce consolidare visioni di lungo periodo con disciplina e criterio. Buon momento per strutturare progetti creativi o spirituali in modo pratico.',
    'transit:sun|sextil|moon':
      'Sole in sestile con Luna facilita integrazione tra volonta ed emozione. Questa fase tende a migliorare fluidita in dialoghi, aggiustamenti di routine e scelte quotidiane. Usala per allineare priorita interne ed esterne.',
    'transit:sun|trigono|moon':
      'Sole in trigono con Luna rafforza coerenza tra identita e bisogni emotivi. Il periodo porta spesso maggiore stabilita nell organizzare scelte importanti. Approfittane per consolidare abitudini sostenibili.',
    'transit:saturn|sextil|ascendente':
      'Saturno in sestile all Ascendente favorisce postura solida, focus e autogestione. Questa fase sostiene progresso costante quando disciplina e confini sono chiari. Piccoli impegni mantenuti nel tempo costruiscono fiducia.',
    'transit:saturn|trigono|ascendente':
      'Saturno in trigono all Ascendente rafforza maturita, presenza e ritmo stabile. Il periodo aiuta a organizzare responsabilita senza sovraccarico inutile. Costanza e priorita corrette consolidano basi durevoli.',
    'transit:saturn|oposicao|saturn':
      'Saturno in opposizione a Saturno segna un punto di revisione delle strutture di lungo periodo. Il ciclo puo mostrare limiti reali dei modelli precedenti e richiedere riorganizzazione oggettiva. Concentrati sull essenziale e ricalibra gli impegni.',
    'transit:moon|sextil|saturn':
      'Luna in sestile a Saturno aiuta a regolare emozioni con praticita e sobrietaa. Questa fase favorisce dialoghi maturi e migliore organizzazione affettiva quotidiana. Buon momento per rafforzare struttura di supporto.',
    'transit:moon|trigono|saturn':
      'Luna in trigono a Saturno favorisce stabilita emotiva e responsabilita equilibrata. Il ciclo facilita decisioni prudenti senza irrigidimento eccessivo. Usa il momento per consolidare accordi e confini sani.',
    'transit:moon|quadratura|mars':
      'Luna in quadratura con Marte puo aumentare irritabilita e impulsivita emotiva. La fase richiede attenzione a reazioni rapide nei conflitti quotidiani. Riduci velocita, respira e convoglia energia in compiti concreti.',
    'transit:moon|conjuncao|uranus':
      'Luna in congiunzione con Urano aumenta bisogno di liberta emotiva e cambiamento rapido. Questo ciclo puo portare oscillazioni d umore e sorprese nei legami vicini. Flessibilita con confini chiari aiuta a mantenere equilibrio.',
    'transit:moon|oposicao|mars':
      'Luna in opposizione a Marte puo aumentare reattivita in relazioni e scelte immediate. La fase chiede di calibrare impulso e ascolto per evitare usura inutile. Priorita a dialogo oggettivo e pause strategiche.',
    'transit:moon|conjuncao|mars':
      'Luna in congiunzione con Marte aumenta intensita affettiva e urgenza di agire. Il periodo puo essere produttivo per risolvere arretrati, con rischio di fretta emotiva. Dirigi energia in azioni brevi ed evita discussioni reattive.',
    'transit:saturn|quadratura|moon':
      'Saturno in quadratura con Luna puo aumentare pressione emotiva e bisogno di contenimento. Il ciclo chiede cura della base affettiva con disciplina semplice e recupero adeguato. Organizza routine di supporto per evitare sovraccarico interno.',
    'transit:moon|quadratura|jupiter':
      'Luna in quadratura con Giove puo gonfiare aspettative e oscillazioni emotive sui risultati. Questa fase richiede moderazione per evitare eccessi affettivi o decisionali. Rivedi priorita e resta su cio che e fattibile ora.',
    'transit:uranus|sextil|moon':
      'Urano in sestile con Luna favorisce rinnovamento emotivo con piu leggerezza e creativita. Il periodo aiuta a sperimentare nuove abitudini senza rotture brusche. Piccoli cambiamenti consapevoli migliorano rapidamente il benessere.',
    'transit:uranus|trigono|moon':
      'Urano in trigono con Luna facilita aggiornare schemi emotivi con maggiore autonomia. Questa fase apre spazio a scelte quotidiane piu autentiche. Usa la flessibilita per regolare routine e legami in modo responsabile.',
    'transit:pluto|oposicao|venus':
      'Plutone in opposizione a Venere intensifica temi di legame, valore personale e reciprocita. Il ciclo puo mostrare dinamiche di attaccamento o controllo da riposizionare con consapevolezza. Cerca accordi piu autentici con confini chiari.',
    'transit:uranus|conjuncao|saturn':
      'Urano in congiunzione a Saturno combina rinnovamento e struttura, chiedendo aggiornamento dei modelli precedenti. Questa fase favorisce innovazione responsabile senza distruggere cio che ancora funziona. Aggiustamenti progressivi rendono piu dei cambi bruschi.',
    'transit:uranus|sextil|mercury':
      'Urano in sestile con Mercurio favorisce idee nuove, connessioni rapide e aggiustamenti mentali intelligenti. Questa fase tende a sostenere innovazione nella comunicazione senza perdere funzionalita. Prova approcci diversi e valida l impatto prima di scalare.',
    'transit:uranus|trigono|mercury':
      'Urano in trigono con Mercurio migliora chiarezza per pensare fuori schema con piu fluidita. Il periodo favorisce apprendimento agile, creativita intellettuale e aggiornamento dei processi. Trasforma gli insight in passi pratici per consolidare risultati reali.',
    'transit:sun|oposicao|neptune':
      'Sole in opposizione a Nettuno puo aumentare confusione tra focus oggettivo e idealizzazione. Questo ciclo chiede di distinguere percezione sottile da aspettative senza base concreta. Semplifica priorita e verifica i fatti prima di decidere.',
    'transit:moon|oposicao|mercury':
      'Luna in opposizione a Mercurio puo accentuare conflitto tra reazione emotiva e lettura razionale. La fase richiede cura con messaggi impulsivi e conclusioni immediate. Fai una pausa, ordina cio che senti e comunica con chiarezza.',
    'transit:saturn|oposicao|mercury':
      'Saturno in opposizione a Mercurio porta un test di coerenza mentale e comunicativa. Il periodo puo richiedere piu revisione, criterio e pazienza con tempi o risposte. Struttura argomenti con dati e avanza per fasi verificabili.',
    'transit:sun|conjuncao|pluto':
      'Sole in congiunzione con Plutone intensifica focus, controllo e bisogno di autenticita. Questo ciclo favorisce cambi profondi quando agisci con consapevolezza e strategia. Dirigi energia sull essenziale ed evita conflitti di potere improduttivi.',
    'transit:uranus|oposicao|mercury':
      'Urano in opposizione a Mercurio puo portare rotture di idee, notizie inattese e cambi di prospettiva. La fase chiede flessibilita senza perdere criterio nella valutazione dei fatti. Rivedi i piani rapidamente, ma decidi su basi oggettive.',
    'transit:pluto|quadratura|jupiter':
      'Plutone in quadratura con Giove puo ampliare ambizione e mettere sotto pressione i limiti di crescita. Questo ciclo chiede di calibrare espansione con profondita strategica e responsabilita. Evita eccessi e dai priorita a progressi sostenibili di lungo periodo.',
    'transit:uranus|conjuncao|meio_do_ceu':
      'Urano in congiunzione al Medio Cielo tende ad accelerare riposizionamento professionale e cambio d immagine pubblica. La fase favorisce innovazione di carriera quando sperimentazione e direzione sono chiare. Aggiorna il posizionamento senza rompere la struttura essenziale.',
    'transit:uranus|quadratura|moon':
      'Urano in quadratura con Luna puo aumentare instabilita emotiva e bisogno immediato di liberta. La fase chiede di regolare routine affettiva per ridurre reattivita in casa e nei legami vicini. Piccoli cambiamenti consapevoli funzionano meglio di tagli bruschi.',
    'transit:jupiter|sextil|sun':
      'Giove in sestile al Sole favorisce fiducia pratica, visione di crescita e decisioni piu ampie. Questo ciclo tende a sostenere avanzamenti quando entusiasmo e criterio procedono insieme. Sfrutta opportunita con pianificazione per rendere i risultati stabili.',
    'transit:jupiter|trigono|sun':
      'Giove in trigono al Sole aumenta fluidita nell espansione degli obiettivi con piu sicurezza interiore. La fase puo facilitare riconoscimento e progresso quando il focus resta sull essenziale. Usa il momento per consolidare avanzamenti senza forzare il ritmo.',
    'transit:uranus|conjuncao|ascendente':
      'Urano in congiunzione all Ascendente tende a segnare riposizionamento personale e cambiamento nello stile d azione. Questo periodo favorisce autenticita, autonomia e aggiornamenti di identita nella routine. Rinnova il modo di presentarti con liberta responsabile.',
    'transit:pluto|sextil|mars':
      'Plutone in sestile con Marte rafforza determinazione, strategia e capacita di agire con profondita. Il ciclo favorisce ridurre dispersione e concentrarsi su compiti ad alto impatto. Dirigi energia con precisione per evitare usura inutile.',
    'transit:pluto|trigono|mars':
      'Plutone in trigono con Marte amplia forza esecutiva e perseveranza per cambiamenti rilevanti. La fase tende a favorire azione costante, con meno reattivita e piu intenzione strategica. Procedi per fasi e consolida guadagno strutturale.',
    'transit:pluto|quadratura|moon':
      'Plutone in quadratura con Luna puo intensificare vulnerabilita emotiva e temi di sicurezza affettiva. Il ciclo chiede regolazione della reattivita e revisione di schemi protettivi antichi. Dialoghi chiari e routine di supporto aiutano a mantenere stabilita.',
    'transit:moon|conjuncao|sun':
      'Luna in congiunzione con Sole segna un punto di reset emotivo e allineamento d intenzione. La fase favorisce aggiustamenti semplici di priorita e apertura a nuovi cicli d azione. Definisci un passo breve e costante per dare direzione alla giornata.',
    'transit:pluto|sextil|sun':
      'Plutone in sestile al Sole favorisce rafforzamento interiore e riposizionamento piu autentico. Questo ciclo puo sostenere scelte profonde senza rottura drammatica. Concentrati su cio che ha valore nel lungo periodo.',
    'transit:pluto|trigono|sun':
      'Plutone in trigono al Sole aumenta concentrazione, chiarezza di scopo e coerenza di direzione. La fase tende a favorire trasformazioni ben ancorate e sostenibili. Usa il periodo per consolidare identita e rotta con maturita.',
    'transit:saturn|oposicao|ascendente':
      'Saturno in opposizione all Ascendente puo testare limiti in relazioni, accordi e responsabilita condivise. Il ciclo richiede postura matura, ascolto e confini piu chiari. Aggiustamenti realistici nella convivenza tendono a ridurre attrito e migliorare stabilita.',
    'transit:pluto|conjuncao|mars':
      'Plutone in congiunzione con Marte intensifica volonta, competitivita e bisogno di agire con forza. Il ciclo richiede autocontrollo per evitare conflitti impulsivi e spreco di energia. Convoglia intensita verso obiettivi strutturali e decisioni strategiche.',
    'transit:sun|oposicao|uranus':
      'Sole in opposizione a Urano puo portare rottura di ritmo, reazione ai limiti e desiderio immediato di liberta. La fase richiede flessibilita con responsabilita per evitare decisioni brusche. Rivedi priorita e correggi rotta senza perdere coerenza.',
    'transit:uranus|quadratura|sun':
      'Urano in quadratura al Sole segnala tensione tra identita attuale e bisogno di cambiamento. Il ciclo puo generare inquietudine, impazienza e desiderio di cambiare tutto subito. Innova per fasi per preservare base e guadagnare autonomia stabile.',
    'transit:saturn|oposicao|sun':
      'Saturno in opposizione al Sole aumenta pressione esterna e test di coerenza personale. Il periodo puo richiedere piu disciplina, regolazione dei limiti e focus sull essenziale. Struttura routine sostenibili e avanza con criterio, senza autocritica eccessiva.',
    'transit:saturn|quadratura|venus':
      'Saturno in quadratura con Venere puo portare revisione di aspettative affettive e valori materiali. Il ciclo richiede maturita emotiva, confini chiari e scelte piu realistiche. Rafforza cio che e reciproco e riduci accordi che drenano energia.',
    'transit:sun|conjuncao|mercury':
      'Sole in congiunzione con Mercurio favorisce chiarezza mentale, focus comunicativo e decisione oggettiva. La fase tende a sostenere conversazioni importanti, studio e organizzazione delle idee. Dai priorita a messaggi semplici e centrati sull essenziale.',
    'transit:jupiter|conjuncao|moon':
      'Giove in congiunzione con Luna amplia sensibilita, accoglienza e percezione di supporto emotivo. Il ciclo puo favorire apertura affettiva e visione piu ampia dei bisogni interiori. Evita eccessi emotivi e mantieni equilibrio nelle scelte.',
    'transit:jupiter|oposicao|pluto':
      'Giove in opposizione a Plutone puo ampliare conflitti di visione, controllo e potere decisionale. Il periodo richiede calibrare ambizione con etica, profondita e senso del limite. La crescita stabile nasce da strategia, non da mosse estreme.',
    'transit:neptune|quadratura|venus':
      'Nettuno in quadratura con Venere puo generare idealizzazione affettiva e confusione su valore e reciprocita. Il ciclo richiede discernimento per distinguere intuizione da proiezione. Osserva segnali concreti prima di accordi emotivi o finanziari.',
    'transit:saturn|sextil|moon':
      'Saturno in sestile con Luna aiuta a stabilizzare emozioni tramite routine e responsabilita affettiva. La fase favorisce dialoghi maturi e migliore gestione del tempo interiore. Piccole abitudini di cura portano sicurezza e continuita.',
    'transit:saturn|trigono|moon':
      'Saturno in trigono con Luna favorisce coerenza emotiva, sobrietaa e fiducia nelle scelte quotidiane. Il ciclo tende a sostenere accordi stabili e limiti salutari. Usa il periodo per consolidare base affettiva con semplicita.',
    'transit:venus|conjuncao|jupiter':
      'Venere in congiunzione con Giove amplia piacere, generosita e opportunita di armonia nei legami. La fase favorisce incontri, accordi e clima relazionale piu positivo. Sfrutta il flusso con moderazione per evitare eccessi.',
    'transit:uranus|sextil|venus':
      'Urano in sestile con Venere favorisce rinnovamento affettivo e finanziario con piu leggerezza e creativita. Il ciclo sostiene aggiornamenti di valore personale e nuovi formati di legame. Innova con consapevolezza per mantenere liberta e reciprocita.',
    'transit:uranus|trigono|venus':
      'Urano in trigono con Venere facilita aggiornare relazioni, gusti e scelte di valore con naturalezza. La fase tende ad ampliare autenticita senza rotture inutili. Sperimenta nuovi modi di scambio con equilibrio.',
    'transit:jupiter|quadratura|moon':
      'Giove in quadratura con Luna puo ampliare oscillazione emotiva e aspettativa di risposta immediata. Il ciclo richiede moderazione per evitare eccessi nelle reazioni e nelle decisioni. Regola ritmo, priorita essenziale e realismo affettivo.',
    'transit:neptune|quadratura|moon':
      'Nettuno in quadratura con Luna puo aumentare sensibilita, nebbia emotiva e difficolta nel definire confini interiori. La fase richiede riposo, igiene mentale e verifica della realta prima di reagire. Rafforza routine di centratura per ridurre confusione affettiva.',
    'transit:moon|ingress|house_2':
      'Luna in ingresso in Casa 2 evidenzia sicurezza materiale, valore personale e bisogni di stabilita pratica nella quotidianita. La fase favorisce rivedere spese, comfort e priorita pratiche con maggiore sensibilita. Piccoli aggiustamenti finanziari e organizzazione semplice tendono a portare piu calma.',
    'transit:saturn|quadratura|pluto':
      'Saturno in quadratura con Plutone puo mettere pressione su strutture profonde, confini e impegni di lungo periodo. Questa fase richiede pazienza strategica, ritmo realistico e gestione attenta delle risorse. Dai priorita a una ricostruzione sostenibile invece che al controllo forzato.',
    'transit:jupiter|quadratura|ascendente':
      'Giove in quadratura all Ascendente puo ampliare visibilita e fiducia, con rischio di sovraesposizione o promesse eccessive. Questa fase funziona meglio con limiti chiari e coerenza pratica. Espandi con criterio per mantenere risultati affidabili.',
    'transit:jupiter|quadratura|mars':
      'Giove in quadratura con Marte puo aumentare slancio e ambizione, ma ridurre precisione tattica. Il ciclo richiede equilibrio tra velocita, metodo e tempi. Trasforma entusiasmo in passi misurabili ed evita attriti inutili.',
    'transit:pluto|conjuncao|sun':
      'Plutone in congiunzione con Sole intensifica temi di identita, direzione e potere personale. Questa fase tende a chiedere scelte piu autentiche e allineamento profondo con l essenziale. Avanza con strategia, disciplina e regolazione emotiva.',
    'transit:pluto|quadratura|mars':
      'Plutone in quadratura con Marte puo alzare pressione, impazienza e conflitti di controllo nell azione. Il ciclo richiede esecuzione disciplinata e uso consapevole della forza. Concentrati sui compiti essenziali ed evita scontri reattivi.',
    'transit:saturn|conjuncao|jupiter':
      'Saturno in congiunzione con Giove unisce espansione e struttura con visione di lungo periodo. Il periodo favorisce crescita realistica, priorita oggettive e criteri piu forti di esecuzione. Costruisci per fasi per mantenere sostenibilita.',
    'transit:saturn|sextil|uranus':
      'Saturno in sestile a Urano favorisce innovazione con continuita e base operativa solida. Questa fase aiuta ad aggiornare sistemi senza rompere cio che funziona ancora. Testa i cambiamenti in modo controllato e con metriche chiare.',
    'transit:saturn|trigono|uranus':
      'Saturno in trigono a Urano facilita modernizzazione stabile e rinnovo intelligente dei processi. Il ciclo favorisce innovazione pratica con bassa discontinuita. Consolida miglioramenti con metodo e revisione costante.',
    'transit:uranus|sextil|mars':
      'Urano in sestile con Marte aumenta iniziativa, agilita e sperimentazione tattica. Questa fase tende a favorire aggiustamenti intelligenti e azione piu rapida con consapevolezza. Mantieni focus su innovazione utile, non su accelerazione cieca.',
    'transit:uranus|trigono|mars':
      'Urano in trigono con Marte migliora azione decisa con flessibilita e problem solving creativo. Il ciclo sostiene cambiamenti produttivi quando le priorita sono esplicite. Usa slancio per sbloccare progresso concreto.',
    'transit:jupiter|oposicao|saturn':
      'Giove in opposizione a Saturno evidenzia tensione tra espansione e limiti. Questa fase richiede equilibrio tra visione e fattibilita negli impegni correnti. Ricalibra obiettivi, scadenze e distribuzione delle risorse.',
    'transit:neptune|conjuncao|meio_do_ceu':
      'Nettuno in congiunzione al Medio Cielo puo aumentare sensibilita su vocazione, immagine e senso professionale. Questa fase richiede discernimento tra ispirazione e proiezione. Mantieni direzione chiara e valida decisioni con segnali concreti.',
    'transit:saturn|sextil|meio_do_ceu':
      'Saturno in sestile al Medio Cielo favorisce consolidamento professionale attraverso costanza e responsabilita. Il ciclo sostiene crescita stabile basata su qualita di esecuzione. Rafforza il posizionamento con impegni realistici.',
    'transit:saturn|trigono|meio_do_ceu':
      'Saturno in trigono al Medio Cielo rafforza reputazione, struttura e direzione professionale di lungo periodo. Il periodo tende a premiare metodo, affidabilita e consegna disciplinata. Mantieni il focus sui fondamentali.',
    'transit:uranus|conjuncao|sun':
      'Urano in congiunzione con Sole tende ad accelerare aggiornamenti identitari e riposizionamento personale. Questa fase puo aumentare bisogno di autonomia e scelte sperimentali. Innova con responsabilita per evitare instabilita improvvisa.',
    'transit:jupiter|oposicao|neptune':
      'Giove in opposizione a Nettuno puo ampliare idealizzazione e aspettative diffuse senza verifica concreta. Il ciclo richiede criteri piu chiari e controllo dei fatti prima di decisioni importanti. Mantieni ispirazione con base pratica.',
    'transit:jupiter|quadratura|neptune':
      'Giove in quadratura con Nettuno puo aumentare entusiasmo con minore chiarezza sui limiti reali. Questa fase richiede distinguere tra visione fondata e proiezione ottimistica. Rivedi ipotesi e regola il ritmo di espansione.',
    'transit:pluto|conjuncao|saturn':
      'Plutone in congiunzione con Saturno approfondisce trasformazione strutturale e responsabilita centrali. Il ciclo puo richiedere decisioni mature su controllo, tenuta e ricostruzione necessaria. Procedi per fasi con strategia e confini netti.',
    'transit:pluto|oposicao|jupiter':
      'Plutone in opposizione a Giove puo intensificare conflitti su scala, potere e direzione strategica. Questa fase richiede espansione etica e calibrazione realistica dell ambizione. Dai priorita a influenza sostenibile, non a grandezza immediata.',
    'transit:saturn|quadratura|mars':
      'Saturno in quadratura con Marte puo creare attrito tra urgenza e restrizione nell esecuzione. Questo ciclo richiede disciplina, timing e riduzione dello sforzo impulsivo. Trasforma pressione in azione metodica.',
    'transit:jupiter|quadratura|venus':
      'Giove in quadratura con Venere puo aumentare ricerca di piacere e ottimismo in scelte affettive o finanziarie. Questa fase favorisce moderazione e criteri di valore piu chiari. Espandi con equilibrio per evitare eccessi.',
    'transit:neptune|quadratura|saturn':
      'Nettuno in quadratura con Saturno puo mettere in tensione certezze, struttura e tolleranza all ambiguita. Questa fase richiede rivedere aspettative e ricostruire piani con flessibilita realistica. Unisci intuizione e verifica oggettiva.',
    'transit:pluto|oposicao|sun':
      'Plutone in opposizione al Sole puo attivare forte polarita su identita, autorita e direzione personale. Questo ciclo richiede uso consapevole del potere e allineamento profondo con priorita reali. Evita reazioni estreme.',
    'transit:pluto|oposicao|mars':
      'Plutone in opposizione a Marte puo intensificare pressione competitiva e dinamiche conflittuali nell azione. Questa fase richiede autoregolazione e contenimento strategico sotto stress. Dirigi la forza verso risultati costruttivi.',
    'transit:pluto|quadratura|mercury':
      'Plutone in quadratura con Mercurio puo intensificare pensiero, sospetto e rigidita comunicativa. Questo ciclo richiede analisi basata su evidenze e dialogo piu pulito. Ricontrolla ipotesi prima di conclusioni drastiche.',
  },
}
