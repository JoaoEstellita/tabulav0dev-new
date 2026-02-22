import type { AppLanguage } from '../i18n/appI18n'

type TransitOverrideMap = Record<string, string>

export const TRANSIT_CATALOG_I18N_OVERRIDES: Partial<Record<AppLanguage, TransitOverrideMap>> = {
  'en-US': {
    'transit:mercury|conjuncao|ascendente':
      'Mercury conjunct Ascendant tends to increase verbal clarity, mental mobility, and response speed. This phase favors presentations, key conversations, and personal positioning adjustments. Organize core messages and keep communication objective to reduce noise.',
    'transit:mercury|conjuncao|jupiter':
      'Mercury conjunct Jupiter expands contextual vision and idea range, supporting strategy and learning. This cycle works best when broad perspective is paired with clear prioritization criteria. Convert insight into practical plans with verifiable stages.',
    'transit:mercury|conjuncao|mars':
      'Mercury conjunct Mars accelerates thinking and decisions, increasing argumentative drive and immediate response. This phase supports execution when focus and priority order are clear. Avoid rushed conclusions and validate facts before closing agreements.',
    'transit:mercury|conjuncao|meio_do_ceu':
      'Mercury conjunct Midheaven supports visibility through communication, strategy, and professional narrative control. This period tends to open room to align public image with objective delivery. Keep messaging simple and consistent to strengthen credibility.',
    'transit:mercury|conjuncao|mercury':
      'Mercury conjunct Mercury marks a high-activity mental window for idea review and criteria updates. This phase favors study, writing, and decision-process reorganization. Structure information by relevance to avoid cognitive overload.',
    'transit:mercury|conjuncao|moon':
      'Mercury conjunct Moon brings thought and emotion closer, favoring clearer and more supportive dialogue. This cycle can help name feelings and adjust expectations in daily life. Keep active listening to balance sensitivity and objectivity.',
    'transit:mercury|conjuncao|neptune':
      'Mercury conjunct Neptune expands intuitive cognition and symbolic reading, with risk of ambiguity in concrete data. This phase favors creativity and subtle perception when practical verification is present. Document agreements and review details to prevent misunderstandings.',
    'transit:mercury|conjuncao|pluto':
      'Mercury conjunct Pluto intensifies investigative focus and analytical depth around sensitive themes. This cycle favors root diagnosis and strategic reframing with clear criteria. Avoid rigid discourse and stay open to revising hypotheses.',
    'transit:mercury|conjuncao|saturn':
      'Mercury conjunct Saturn favors structured thinking, intellectual discipline, and objective communication. This phase supports planning, contract review, and method definition. Work with clear timelines and precise language to sustain trust.',
    'transit:mercury|conjuncao|sun':
      'Mercury conjunct Sun reinforces mental clarity and alignment between intention and expression. This period favors decisions when priorities are clearly defined and communicated. Use this phase to clarify direction and cut dispersion.',
    'transit:mercury|conjuncao|uranus':
      'Mercury conjunct Uranus accelerates mental innovation and openness to unconventional ideas. This phase favors breakthroughs when fast intuition is paired with objective validation. Test hypotheses in short cycles before scaling changes.',
    'transit:mercury|conjuncao|venus':
      'Mercury conjunct Venus favors diplomacy, reconciliation, and exchange quality in important conversations. This cycle tends to ease agreements when values and limits are explicit. Invest in kind communication without losing assertiveness.',
    'transit:mercury|quadratura|ascendente':
      'Mercury square Ascendant can increase communication friction and tone mismatch in interactions. This phase asks for expression adjustment to keep clarity without escalating tension. Simplify messages and confirm mutual understanding.',
    'transit:mercury|quadratura|jupiter':
      'Mercury square Jupiter tends to expand ideas without equivalent precision in criteria. This cycle asks for balance between broad vision and detail verification before deciding. Avoid large promises without a clear operational plan.',
    'transit:mercury|quadratura|mars':
      'Mercury square Mars can accelerate speech and argumentation, increasing verbal reactivity risk. This phase asks for strategic pauses to reduce unproductive conflict. Reorder priorities and respond with objectivity instead of impulse.',
    'transit:mercury|quadratura|meio_do_ceu':
      'Mercury square Midheaven can tension public narrative and consistency of professional positioning. This period asks for message, timeline, and delivery alignment. Small communication adjustments usually reduce image noise.',
    'transit:mercury|quadratura|mercury':
      'Mercury square Mercury can bring conflict between mental references, decision pace, and data organization. This phase asks for methodical premise review to prevent rework. Prioritize essentials and validate key interpretations before closing.',
    'transit:mercury|quadratura|moon':
      'Mercury square Moon can create friction between logic and sensitivity in daily matters. This cycle asks for translating emotion into clear language to reduce relational noise. Combine listening and objectivity to stabilize delicate conversations.',
    'transit:mercury|quadratura|neptune':
      'Mercury square Neptune can increase context confusion, assumptions, and detail errors. This phase asks for confirming facts, dates, and responsibilities before final agreements. Write commitments down to reduce ambiguity.',
    'transit:mercury|quadratura|pluto':
      'Mercury square Pluto intensifies narrative control and rigidity in interpretation disputes. This cycle asks for analytical rigor without paranoia or unnecessary confrontation. Focus on verifiable evidence and keep openness to nuance.',
    'transit:mercury|quadratura|saturn':
      'Mercury square Saturn can bring mental pressure, heavy decisions, and constrained communication. This phase asks for method, patience, and explicit criteria to unlock progress. Break problems into blocks and move in short stages.',
    'transit:mercury|quadratura|sun':
      'Mercury square Sun can tension directional clarity and how priorities are communicated. This period asks to align intention, language, and execution plan with greater consistency. Revisit your core narrative before announcing key decisions.',
    'transit:mercury|quadratura|uranus':
      'Mercury square Uranus can trigger abrupt idea shifts and oscillation between insight and noise. This phase asks to contain rupture impulses without suppressing innovation. Validate experiments on a small scale and preserve continuity criteria.',
    'transit:mercury|quadratura|venus':
      'Mercury square Venus can tension diplomacy and directness in affective or value-based conversations. This cycle asks to negotiate form and content to preserve connection without omitting essentials. Adjust expectations and language to sustain reciprocity.',
    'transit:mars|sextil|ascendente':
      'Mars sextile Ascendant favors initiative with better posture and pacing calibration. This phase tends to support direct action without unnecessary confrontation. Channel energy into objective decisions and consistent execution.',
    'transit:mars|sextil|jupiter':
      'Mars sextile Jupiter combines courage and strategy, favoring progress with opportunity awareness. This cycle tends to perform best when enthusiasm is paired with practical planning. Prioritize high-return fronts and track progress in stages.',
    'transit:mars|sextil|mars':
      'Mars sextile Mars reinforces initiative flow and focused action capacity. This phase favors productivity when priorities are clear and properly sequenced. Use the momentum to complete relevant pending tasks without dispersion.',
    'transit:mars|sextil|mercury':
      'Mars sextile Mercury favors assertive communication and faster decisions with good clarity. This cycle tends to support negotiations and follow-through when arguments are well structured. Keep objectivity with active listening to preserve alignment.',
    'transit:mars|sextil|moon':
      'Mars sextile Moon helps integrate action and emotion with lower reactivity. This phase favors routine adjustments and practical response to affective demands in daily life. Maintain sustainable pacing to preserve well-being and continuity.',
    'transit:mars|sextil|neptune':
      'Mars sextile Neptune favors turning intuition into practical movement with more flow. This cycle tends to support applied creativity when goals are minimally clear. Structure short steps to avoid energy dispersion.',
    'transit:mars|sextil|pluto':
      'Mars sextile Pluto strengthens determination, strategic focus, and deep action capacity. This phase favors structural change without requiring abrupt rupture. Direct intensity toward core goals and consolidate long-range consistency.',
    'transit:mars|sextil|saturn':
      'Mars sextile Saturn combines drive and discipline, favoring efficient execution. This cycle tends to open room for steady progress when method and priority move together. Advance in stages to consolidate sustainable outcomes.',
    'transit:mars|sextil|uranus':
      'Mars sextile Uranus favors practical innovation and route adjustment agility without losing base stability. This phase tends to support smart change when testing and validation criteria are present. Experiment with focus and scale only what works.',
    'transit:mars|sextil|venus':
      'Mars sextile Venus favors initiative in relationships and agreements with better balance between desire and cooperation. This cycle tends to ease approach dynamics when limits and expectations are clear. Combine assertiveness and diplomacy to strengthen exchanges.',
    'transit:mars|trigono|ascendente':
      'Mars trine Ascendant favors direct action with good timing and posture calibration. This phase tends to increase confidence for personal initiatives with lower friction. Use this flow to execute priorities with objectivity and consistency.',
    'transit:mars|trigono|jupiter':
      'Mars trine Jupiter combines initiative and expansion in a productive rhythm. This cycle tends to support progress when enthusiasm is linked to practical strategy. Direct energy toward meaningful goals and keep progress reviews active.',
    'transit:mars|trigono|mars':
      'Mars trine Mars reinforces execution drive and directional clarity. This phase usually favors productivity when priorities are well defined. Use the momentum to close open fronts without scattering energy.',
    'transit:mars|trigono|mercury':
      'Mars trine Mercury favors clarity for decisions and firm communication. This cycle tends to support negotiations and follow-through when arguments are objective. Keep active listening to sustain alignment in exchanges.',
    'transit:mars|trigono|moon':
      'Mars trine Moon favors integration between willpower and emotional sensitivity in daily life. This phase tends to support practical response without losing emotional care. Simple pacing adjustments can increase inner stability.',
    'transit:mars|trigono|neptune':
      'Mars trine Neptune favors turning intuition into action with better flow. This cycle tends to support applied creativity when goals have minimum clarity. Organize short steps to preserve continuity and reduce dispersion.',
    'transit:mars|trigono|pluto':
      'Mars trine Pluto increases determination, depth, and strategic change capacity. This phase tends to support structural decisions when action is guided by criteria. Direct intensity to essentials and consolidate long-term outcomes.',
    'transit:mars|trigono|saturn':
      'Mars trine Saturn combines discipline and initiative in an efficient way. This cycle tends to support sustainable progress when method and priority move together. Advance by stages to strengthen consistency.',
    'transit:mars|trigono|uranus':
      'Mars trine Uranus favors practical innovation without requiring abrupt rupture. This phase tends to open room for testing new solutions with solid risk control. Experiment with criteria and scale only what proves useful.',
    'transit:mars|trigono|venus':
      'Mars trine Venus favors affective initiative and cooperation in key agreements. This cycle tends to ease approach when desire and reciprocity are balanced. Use assertiveness with tact to strengthen bonds.',
    'transit:jupiter|conjuncao|meio_do_ceu':
      'Jupiter conjunct Midheaven can increase visibility and open room for professional growth. This cycle favors recognition when direction is clear, execution is consistent, and expectations stay realistic. Avoid overpromising and consolidate progress in practical steps.',
    'transit:jupiter|sextil|meio_do_ceu':
      'Jupiter sextile Midheaven supports agreements and momentum for career development. This phase tends to be favorable for expansion with strategy and focus on priorities. Small, well-executed decisions can produce meaningful medium-term impact.',
    'transit:jupiter|trigono|meio_do_ceu':
      'Jupiter trine Midheaven improves flow in public and professional goals. Recognition is more likely when technical quality is paired with clear communication. Use this phase to build sustainable growth without excess confidence.',
    'transit:jupiter|conjuncao|neptune':
      'Jupiter conjunct Neptune expands imagination and long-range vision, with risk of idealization when criteria are weak. This phase favors inspiration when subtle perception is translated into practical, verifiable goals. Avoid broad promises without an execution plan and keep objective review cycles.',
    'transit:jupiter|conjuncao|pluto':
      'Jupiter conjunct Pluto intensifies growth ambition and the need for strategic repositioning. This cycle tends to support major advances when analysis is deep and long-range focus is clear. Direct expansion toward what is essential and reduce power-driven impulse moves.',
    'transit:jupiter|conjuncao|saturn':
      'Jupiter conjunct Saturn combines expansion and structure in the same decision point. This phase favors consistent growth when broad vision meets method, timing, and governance. Organize priorities in stages to convert opportunity into sustainable results.',
    'transit:jupiter|conjuncao|uranus':
      'Jupiter conjunct Uranus accelerates innovation and openness to new directions. The period may bring unconventional opportunities, asking for flexibility with responsible risk management. Test new paths with criteria and validation before scaling.',
    'transit:jupiter|oposicao|ascendente':
      'Jupiter opposite Ascendant may amplify relational demands and public exposure, pressuring personal balance. This phase asks you to align expectations between what you offer and what you can sustain with quality. Negotiate limits clearly to preserve cooperation and consistency.',
    'transit:jupiter|oposicao|mercury':
      'Jupiter opposite Mercury tends to amplify ideas and discourse, with risk of overconfidence in interpretation. This cycle favors learning when broad vision is balanced with objective verification. Revisit assumptions, simplify communication, and refine what is truly viable.',
    'transit:jupiter|oposicao|moon':
      'Jupiter opposite Moon may increase emotional fluctuation and expectation of immediate response. This phase asks for affective moderation to avoid exaggerated pacing and decisions. Balance inner care with practical priorities in daily life.',
    'transit:jupiter|oposicao|sun':
      'Jupiter opposite Sun can tension expansion drive against real limits of energy and context. The period asks for calibration of ambition, schedule, and resources so image and delivery stay coherent. More stable growth comes from selective focus and progressive execution.',
    'transit:jupiter|oposicao|venus':
      'Jupiter opposite Venus amplifies desire for pleasure, concession, and reciprocal validation. This phase asks for value calibration to avoid affective or financial excess. Prioritize choices that preserve balance between immediate satisfaction and sustainability.',
    'transit:jupiter|oposicao|uranus':
      'Jupiter opposite Uranus can bring fast swings between enthusiasm and plan disruption. This cycle asks for freedom with criteria, so consistency is not replaced by constant novelty. Make strategic adjustments without abandoning what already sustains results.',
    'transit:jupiter|oposicao|mars':
      'Jupiter opposite Mars can raise ambition and action pace beyond what context can sustain. This cycle asks for courage calibrated by strategy to avoid wear from excessive impulse. Direct energy to objective goals with staged execution and progress review.',
    'transit:jupiter|oposicao|meio_do_ceu':
      'Jupiter opposite Midheaven can tension public visibility against personal grounding and practical limits. This phase asks for alignment between projection, delivery, and sustainable capacity. Positioning adjustments tend to work better than abrupt moves.',
    'transit:jupiter|quadratura|meio_do_ceu':
      'Jupiter square Midheaven may amplify professional expectations without matching operational structure. The period asks for review of promises, timelines, and priorities to reduce strategic dispersion. More solid growth comes from selective focus and consistent execution.',
    'transit:jupiter|ingress|house_6':
      'Jupiter entering House 6 expands opportunities to improve routine, organization, and daily efficiency. This phase favors method upgrades when expansion is matched with simple discipline. Small accumulated gains can produce meaningful medium-term impact.',
    'transit:jupiter|ingress|house_7':
      'Jupiter entering House 7 expands opportunities for cooperation, agreements, and key relationship exchanges. This cycle favors alliances when expectations and boundaries are clearly negotiated. Prioritize concrete reciprocity to convert goodwill into stable outcomes.',
    'transit:jupiter|ingress|house_8':
      'Jupiter entering House 8 expands themes of shared resources, trust, and deeper transformation. This phase favors strategic reorganization when transparency and criteria support commitments. Move forward with clarity on risks, responsibilities, and timing.',
    'transit:jupiter|ingress|house_9':
      'Jupiter entering House 9 expands learning horizons, worldview, and long-range planning perspective. The period favors study and repertoire growth when new knowledge is applied practically. Turn insights into executable direction.',
    'transit:jupiter|ingress|house_12':
      'Jupiter entering House 12 expands closure processes, inner meaning, and quiet reprioritization. This phase favors maturation when introspection is paired with practical daily grounding. Use the period to clear excess and prepare a new cycle with greater clarity.',
    'transit:jupiter|oposicao|jupiter':
      'Jupiter opposite Jupiter can amplify extremes between confidence and overexpectation. This phase asks you to calibrate ambition with clear criteria to avoid promises beyond current delivery capacity. More stable growth comes from selective focus and realistic target review.',
    'transit:jupiter|quadratura|jupiter':
      'Jupiter square Jupiter tends to tension expansion pace and risk decisions. The cycle can trigger acceleration on too many fronts at once, reducing execution quality. Prioritize essentials and move in blocks to sustain consistent outcomes.',
    'transit:jupiter|quadratura|mercury':
      'Jupiter square Mercury may increase mental dispersion and overconfidence in quick conclusions. This phase asks for premise review, simpler messaging, and fact-checking before final decisions. Use broad vision with method to reduce strategic noise.',
    'transit:jupiter|quadratura|pluto':
      'Jupiter square Pluto intensifies ambition and may push all-or-nothing moves. This cycle asks for long-range strategy to avoid wear from excessive force. Direct growth toward structural change with clear governance.',
    'transit:jupiter|quadratura|saturn':
      'Jupiter square Saturn activates conflict between expansion drive and real operational limits. This phase asks for scope, timing, and resource adjustments to preserve consistency. Balancing boldness with discipline usually yields more sustainable progress.',
    'transit:jupiter|quadratura|sun':
      'Jupiter square Sun can inflate performance and visibility expectations beyond healthy pacing. The cycle asks for calibration between protagonism and real execution capacity. Focus on what produces concrete impact without scattering energy.',
    'transit:jupiter|quadratura|uranus':
      'Jupiter square Uranus can alternate enthusiasm and plan disruption in short intervals. This phase asks for freedom with criteria to avoid replacing consistency with permanent novelty. Innovate by iteration and validate each adjustment before scaling.',
    'transit:jupiter|sextil|ascendente':
      'Jupiter sextile Ascendant favors social confidence, useful contacts, and a more receptive presence. The cycle tends to support opportunities when posture and boundaries stay clear. Use the phase to broaden reach with authenticity and measure.',
    'transit:jupiter|sextil|jupiter':
      'Jupiter sextile Jupiter favors gradual expansion with a better sense of opportunity quality. The period tends to be productive for study, strategy, and medium-term repositioning. Grow with planning to consolidate durable gains.',
    'transit:jupiter|sextil|mars':
      'Jupiter sextile Mars combines initiative and growth vision with lower execution friction. This phase supports action guided by clear priorities and objective targets. Direct energy toward high-return fronts and keep progress reviews active.',
    'transit:jupiter|sextil|mercury':
      'Jupiter sextile Mercury favors communication, learning, and decisions with broader context clarity. The cycle supports strategic conversations and practical idea organization. Use the moment to unlock pending themes with objective language.',
    'transit:jupiter|sextil|moon':
      'Jupiter sextile Moon tends to expand emotional support and a more constructive reading of events. This phase favors reconciling sensitivity with daily pragmatism. Small routine adjustments can bring relief and greater stability.',
    'transit:jupiter|sextil|neptune':
      'Jupiter sextile Neptune favors inspiration with stronger practical application potential. This cycle tends to support long-range vision when intuition is balanced with criteria. Turn perceptions into verifiable actions and adjust course with regular review.',
    'transit:jupiter|sextil|pluto':
      'Jupiter sextile Pluto favors growth with depth, strategic focus, and conscious repositioning. This phase tends to support high-impact decisions when shortcuts are avoided and execution is staged. Prioritize structural changes that sustain durable outcomes.',
    'transit:jupiter|sextil|saturn':
      'Jupiter sextile Saturn combines expansion and discipline in a productive rhythm. This cycle tends to ease progress when broad vision meets method, timing, and clear priorities. Grow with criteria to consolidate gains without overload.',
    'transit:jupiter|sextil|uranus':
      'Jupiter sextile Uranus favors innovation with good potential for gradual implementation. This phase tends to open unconventional opportunities without demanding abrupt rupture. Test novelty with simple metrics and scale only what proves useful.',
    'transit:jupiter|sextil|venus':
      'Jupiter sextile Venus favors harmonization in relationships, agreements, and value choices. This cycle tends to expand cooperation when reciprocity and boundaries are clear. Use the flow to strengthen bonds and prioritize exchange quality.',
    'transit:jupiter|trigono|ascendente':
      'Jupiter trine Ascendant tends to amplify social confidence, visibility, and pathway opening. This phase favors outreach and presence when authenticity is matched with measure. Use the momentum to consolidate an image aligned with real delivery.',
    'transit:jupiter|trigono|jupiter':
      'Jupiter trine Jupiter supports broad expansion with better rhythm and perspective. This cycle tends to favor learning, strategic planning, and medium-term growth steps. Keep practical criteria so opportunities become consistent gains.',
    'transit:jupiter|trigono|mars':
      'Jupiter trine Mars combines initiative and momentum with greater execution fluency. This phase tends to support assertive action when priorities are clear and effort is well directed. Channel energy into high-impact fronts and maintain progression review.',
    'transit:jupiter|trigono|mercury':
      'Jupiter trine Mercury favors communication, synthesis, and decision-making with contextual clarity. This cycle tends to support meaningful conversations and practical organization of ideas. Use the phase to align vision and execution in objective language.',
    'transit:jupiter|trigono|moon':
      'Jupiter trine Moon tends to increase emotional integration and a constructive response to daily demands. This phase favors well-being when sensitivity is combined with pragmatic organization. Small adjustments can produce stable relief and greater inner balance.',
    'transit:jupiter|trigono|neptune':
      'Jupiter trine Neptune favors inspiration, symbolic understanding, and meaning-oriented direction. This cycle tends to support subtle perception when grounded in practical criteria. Translate intuition into concrete steps and keep periodic reality checks.',
    'transit:jupiter|trigono|pluto':
      'Jupiter trine Pluto favors deep transformation with strategic expansion and sustained focus. This phase tends to support major repositioning when action is deliberate and structural. Prioritize essential moves with long-range consistency.',
    'transit:jupiter|trigono|saturn':
      'Jupiter trine Saturn favors consistent growth grounded in practical structure and timing discipline. This cycle tends to unite broad vision with execution method, supporting steadier progress with less waste. Organize priorities in stages to consolidate sustainable results.',
    'transit:jupiter|trigono|uranus':
      'Jupiter trine Uranus favors innovation with fluid adaptation and less need for abrupt disruption. This phase tends to open original opportunities when experimentation is paired with criteria and responsible scaling. Balance freedom and continuity to keep tangible progress.',
    'transit:jupiter|trigono|venus':
      'Jupiter trine Venus favors harmonization in relationships, agreements, and daily value choices. This cycle tends to expand cooperation and goodwill when expectations and boundaries are clear. Use the phase to strengthen quality exchanges with measure and consistency.',
    'transit:mars|conjuncao|ascendente':
      'Mars conjunct Ascendant increases initiative drive and the need for personal assertion. This phase tends to favor direct action when priorities are organized and reactivity is reduced. Channel energy into clear moves with focus and self-regulation.',
    'transit:mars|conjuncao|jupiter':
      'Mars conjunct Jupiter amplifies courage, ambition, and momentum toward expansion. This cycle supports progress when boldness is paired with strategy and practical pacing. Adjust rhythm and scope to avoid overconfidence in execution.',
    'transit:mars|conjuncao|mars':
      'Mars conjunct Mars intensifies initiative energy and competitive tone in daily life. This phase tends to increase urgency to act, asking for discipline to keep consistency. Direct strength toward objective goals and reduce impulsive wear.',
    'transit:mars|conjuncao|mercury':
      'Mars conjunct Mercury accelerates thinking, communication, and decision speed. This cycle favors objectivity when assumptions are reviewed and messaging is clear. Avoid rushed conclusions and keep criteria in sensitive conversations.',
    'transit:mars|conjuncao|moon':
      'Mars conjunct Moon can raise emotional reactivity and demand for immediate response. This phase asks for balance between emotional expression and self-control to avoid unnecessary conflict. Brief pauses before acting help preserve clarity and connection.',
    'transit:mars|conjuncao|neptune':
      'Mars conjunct Neptune combines action impulse with expanded imagination and sensitivity. This cycle favors applied creativity when intuition is grounded in practical steps. Increase criteria so energy is not dispersed in undefined goals.',
    'transit:mars|conjuncao|pluto':
      'Mars conjunct Pluto intensifies willpower, strategic depth, and pattern-breaking capacity. This phase tends to strengthen high-impact decisions when direction is clear and self-control is active. Use intensity responsibly to avoid power-driven conflict.',
    'transit:mars|conjuncao|saturn':
      'Mars conjunct Saturn combines execution force and structural limits in the same point. This cycle may ask for active patience to convert pressure into consistent progress. Move in stages with method to reduce friction and waste.',
    'transit:mars|conjuncao|sun':
      'Mars conjunct Sun reinforces protagonism, initiative, and the will to lead your own agenda. This phase favors assertive action when intensity is balanced with real priorities. Focus on essentials to convert impulse into concrete results.',
    'transit:mars|conjuncao|uranus':
      'Mars conjunct Uranus accelerates change and raises the need for freedom in action. This cycle may open unconventional opportunities, asking for fast response with criteria. Innovate with safety to avoid impulsive breaks.',
    'transit:mars|conjuncao|venus':
      'Mars conjunct Venus amplifies magnetism, desire, and the need to align affection with action. This phase favors meaningful approach when boundaries and expectations are explicit. Balance intensity with listening to preserve exchange quality.',
    'transit:mars|oposicao|jupiter':
      'Mars opposite Jupiter can amplify conquest drive beyond what context can support. This phase asks for balance between courage and criteria to avoid excessive execution risk. Adjust scope and pacing to sustain quality outcomes.',
    'transit:mars|oposicao|mars':
      'Mars opposite Mars tends to activate conflict of rhythm, will, and direction between opposite poles. This cycle asks for intensity regulation to reduce friction and energy waste. Focus on common objectives and avoid reactive confrontation.',
    'transit:mars|oposicao|meio_do_ceu':
      'Mars opposite Midheaven may tension public ambition against stability of personal foundations. This phase asks for alignment between external priorities and real energy capacity. Reorganize schedule and responsibilities to preserve long-range consistency.',
    'transit:mars|oposicao|mercury':
      'Mars opposite Mercury can increase mental haste, reactive debate, and listening difficulty. This cycle asks to slow conclusions and qualify arguments before deciding. Objective communication and strategic pauses reduce noise and conflict.',
    'transit:mars|oposicao|moon':
      'Mars opposite Moon may raise emotional irritation and demand for immediate response in close bonds. This phase asks for balance between assertiveness and care to avoid relational wear. Regulate inner pace before acting on sensitive themes.',
    'transit:mars|oposicao|neptune':
      'Mars opposite Neptune can alternate impulse and doubt, with risk of dispersion in unclear goals. This cycle asks to convert intuition into simple, verifiable planning so direction remains realistic. Avoid impulsive action without context and priority checks.',
    'transit:mars|oposicao|pluto':
      'Mars opposite Pluto intensifies power dynamics, control themes, and resistance in key processes. This phase asks for self-regulation so tension is not converted into unproductive confrontation. Direct force toward strategy and structural adjustment, not conflict escalation.',
    'transit:mars|oposicao|saturn':
      'Mars opposite Saturn can create a braking feeling between action drive and operational limits. This cycle asks for active patience, method, and staged progression to reduce frustration. Organized persistence tends to work better than haste.',
    'transit:mars|oposicao|sun':
      'Mars opposite Sun may tension protagonism, authority, and personal assertion style. This phase asks for calibrated intensity to sustain cooperation without losing directional firmness. Act with clear objectives and lower need to prove force.',
    'transit:mars|oposicao|uranus':
      'Mars opposite Uranus can bring rapid reversals and rupture impulse under pressure. This cycle asks for freedom with criteria so strategy is not replaced by immediate reaction. Fast adjustments work better when contingency planning exists.',
    'transit:mars|oposicao|venus':
      'Mars opposite Venus may increase polarity between desire, affection, and negotiation style in closeness. This phase asks to align expectations and boundaries to avoid oscillation between approach and conflict. Active listening and clear agreements strengthen exchange quality.',
    'transit:mars|quadratura|ascendente':
      'Mars square Ascendant can increase irritation, haste, and posture friction in interactions. This phase asks you to adjust assertion style so clarity is preserved without escalation. Act with objective intent and reduce automatic reaction.',
    'transit:mars|quadratura|jupiter':
      'Mars square Jupiter tends to amplify impulse and risk beyond what context can sustain. This cycle asks to calibrate ambition with criteria to avoid overbetting execution. Prioritize core goals and move in verifiable blocks.',
    'transit:mars|quadratura|mars':
      'Mars square Mars intensifies friction between will, pacing, and action direction. This phase can raise competitiveness and wear when priorities are not coordinated. Use disciplined focus to convert tension into productivity.',
    'transit:mars|quadratura|mercury':
      'Mars square Mercury can accelerate speech and thinking while reducing listening quality and precision. This cycle asks for argument review and less impulse-based conclusions. Simple communication and fact validation reduce noise and rework.',
    'transit:mars|quadratura|moon':
      'Mars square Moon can increase emotional swings and defensive response in sensitive topics. This phase asks you to regulate reactivity before deciding or confronting. Short pauses and support routines help maintain balance.',
    'transit:mars|quadratura|neptune':
      'Mars square Neptune can mix urgency and ambiguity, creating energy dispersion. This cycle asks to convert intuition into concrete planning with short stages. Avoid acting without checking objective, context, and real limits.',
    'transit:mars|quadratura|pluto':
      'Mars square Pluto intensifies power tension, control themes, and force of will. This phase asks for self-regulation so pressure is not turned into unproductive confrontation. Direct intensity toward structural adjustment and consistent strategy.',
    'transit:mars|quadratura|saturn':
      'Mars square Saturn can bring frustration between action drive and operational restriction. This cycle asks for active patience, method, and sustainable pacing to reduce wear. Staged progress tends to work better than haste.',
    'transit:mars|quadratura|sun':
      'Mars square Sun may tension protagonism, authority, and leadership style. This phase asks for balance between firmness and cooperation to preserve efficiency. Focus on objective delivery with less ego dispute.',
    'transit:mars|quadratura|uranus':
      'Mars square Uranus can trigger rhythm breaks and abrupt-change impulse. This cycle asks for innovation with criteria to avoid reactive decisions. Progressive adjustments with contingency planning preserve outcomes.',
    'transit:mars|quadratura|venus':
      'Mars square Venus may tension desire, affection, and reciprocity expectations. This phase asks for clearer boundaries and practical negotiation to avoid relational oscillation. Active listening and simple agreements improve bond quality.',
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
    'transit:jupiter|conjuncao|ascendente':
      'Jupiter conjunct Ascendant can amplify presence, confidence, and willingness to initiate personal moves. This phase supports visibility when enthusiasm is paired with clear direction. Avoid overpromising and keep image aligned with real delivery.',
    'transit:jupiter|conjuncao|jupiter':
      'Jupiter conjunct Jupiter marks a window of expansion and broader perspective. This cycle favors growth when wide goals are translated into practical steps. Prioritize opportunities that match your current capacity.',
    'transit:jupiter|conjuncao|mars':
      'Jupiter conjunct Mars increases initiative, courage, and drive to accelerate decisions. This phase tends to work best with tactical focus and paced execution. Channel energy into concrete goals to avoid dispersion through excess action.',
    'transit:jupiter|conjuncao|mercury':
      'Jupiter conjunct Mercury expands mental range, learning, and communication capacity. The period favors study, agreements, and planning with a wider view. Structure arguments clearly to turn insight into useful outcomes.',
    'transit:jupiter|conjuncao|sun':
      'Jupiter conjunct Sun strengthens confidence, direction, and openness to growth cycles. This phase supports protagonism when intention is matched by consistent execution. Use visibility with criteria to consolidate durable progress.',
    'transit:jupiter|conjuncao|venus':
      'Jupiter conjunct Venus supports harmonization in relationships, values, and wellbeing choices. This cycle can broaden affective and financial opportunities when reciprocity and limits are present. Use the flow with moderation to preserve long-term quality.',
    'transit:jupiter|ingress|house_1':
      'Jupiter entering House 1 tends to begin a phase of personal expansion, initiative, and repositioning. The period supports posture, image, and direction changes with broader perspective. Move with authenticity and keep focus on sustainable progress.',
    'transit:jupiter|ingress|house_3':
      'Jupiter entering House 3 can expand communication, learning, and local exchanges. This phase supports study, strategic conversations, and broader circulation of ideas. Organize priorities so information becomes practical decisions.',
    'transit:jupiter|ingress|house_5':
      'Jupiter entering House 5 tends to increase creativity, personal expression, and openness to joyful experiences. The cycle supports authorial projects, romance, and authentic initiatives. Use enthusiasm with criteria to keep continuity and quality.',
    'transit:jupiter|ingress|house_10':
      'Jupiter entering House 10 can open a growth phase in career, reputation, and public goals. This window tends to favor progress when strategic vision is paired with consistent execution. Prioritize key deliveries and consolidate authority through observable results.',
    'transit:saturn|conjuncao|ascendente':
      'Saturn conjunct Ascendant marks a phase of personal repositioning with more sobriety and responsibility. This cycle asks for reviewing posture, boundaries, and self-presentation in daily life. Consolidate long-term choices through discipline and consistent self-management.',
    'transit:saturn|conjuncao|meio_do_ceu':
      'Saturn conjunct Midheaven tends to concentrate focus on career, reputation, and public commitments. The phase supports structuring goals when delivery remains consistent and criteria stay clear. Prioritize essentials and reinforce authority through concrete results.',
    'transit:saturn|conjuncao|sun':
      'Saturn conjunct Sun can increase internal pressure and the need to reorganize personal direction. This cycle asks for maturity, focus on essentials, and sustainable pacing to consolidate progress. Work with realistic goals and steady daily execution.',
    'transit:saturn|conjuncao|moon':
      'Saturn conjunct Moon tends to bring emotional sobriety and a review of security needs. This phase asks to strengthen care routines, boundaries, and affective stability in daily life. Small consistent adjustments help reduce internal overload.',
    'transit:saturn|conjuncao|mercury':
      'Saturn conjunct Mercury raises mental demand, focus, and the need to structure thought with method. The cycle favors disciplined study, premise review, and objective communication. Organize information by priority before deciding.',
    'transit:saturn|conjuncao|venus':
      'Saturn conjunct Venus can ask for maturity in bonds, values, and wellbeing choices. This phase supports clarifying reciprocity and boundaries to protect what has real quality. Invest in what is consistent and avoid idealization or excess.',
    'transit:saturn|conjuncao|mars':
      'Saturn conjunct Mars combines action drive with a need for technique and pacing control. The cycle asks for efficiency, consistency, and lower reactivity to preserve energy. Channel force into clearly defined steps and verifiable goals.',
    'transit:saturn|conjuncao|saturn':
      'Saturn conjunct Saturn marks a structural maturation cycle and a review of core responsibilities. This phase asks for simplifying priorities, recalibrating goals, and sustaining what truly matters. Consistent decisions now tend to strengthen the long term.',
    'transit:saturn|ingress|house_1':
      'Saturn entering House 1 starts a phase of personal redefinition with more discipline and responsibility. The period supports consolidating identity and direction through concrete daily choices. Move with consistency and healthy boundaries.',
    'transit:saturn|ingress|house_3':
      'Saturn entering House 3 asks for organizing mental routine, communication, and study with method. The phase supports consistent learning, objective agreements, and less dispersion. Structure schedule and messaging to gain practical clarity.',
    'transit:saturn|ingress|house_5':
      'Saturn entering House 5 can bring maturity to creativity, romance, and personal expression. The cycle favors quality and continuity when process commitment and clear limits are present. Build joy with responsibility and intention.',
    'transit:uranus|conjuncao|moon':
      'Uranus conjunct Moon tends to intensify the need for emotional freedom and updates in affective habits. This phase can bring mood fluctuation and unexpected routine changes. Regulate internal pace and adjust support routines gradually.',
    'transit:uranus|conjuncao|mercury':
      'Uranus conjunct Mercury expands mental restlessness, new ideas, and the urge to review assumptions quickly. The cycle supports intellectual innovation when method helps prioritize what matters. Turn insight into practical and measurable experiments.',
    'transit:uranus|conjuncao|venus':
      'Uranus conjunct Venus can accelerate reviews in relationships, values, and pleasure choices. This phase supports authenticity and new exchange formats when boundaries are clear. Innovate consciously to preserve reciprocity and stability.',
    'transit:uranus|conjuncao|mars':
      'Uranus conjunct Mars increases action impulse, urgency for change, and fast response to limits. The cycle works best when energy is channeled with strategy and objective focus. Reduce reactivity and execute in short validated steps.',
    'transit:uranus|conjuncao|jupiter':
      'Uranus conjunct Jupiter tends to expand future vision with a strong drive for experimentation. This phase supports new opportunities when risk is calibrated with criteria. Grow by iteration rather than all-in moves.',
    'transit:uranus|conjuncao|uranus':
      'Uranus conjunct Uranus marks a structural renewal cycle in identity and life direction. The phase can ask for deep repositioning toward present authenticity. Move with flexibility while keeping practical stability.',
    'transit:uranus|ingress|house_1':
      'Uranus entering House 1 starts a phase of personal repositioning, autonomy, and posture change. The period supports updating identity and action style with more authenticity. Renew your presence without losing consistency.',
    'transit:uranus|ingress|house_3':
      'Uranus entering House 3 expands mental movement, idea exchange, and communication pattern review. The phase supports fast learning and new local connection formats. Organize information flow to avoid dispersion.',
    'transit:uranus|ingress|house_5':
      'Uranus entering House 5 can open a freer creativity phase with changes in pleasure and personal expression. The cycle supports trying new languages with authentic intention. Innovate while maintaining affective responsibility and continuity.',
    'transit:uranus|ingress|house_10':
      'Uranus entering House 10 tends to open a turning point in career, reputation, and public direction. The phase supports professional updating when boldness is paired with strategy. Reposition goals and test new routes with objective metrics.',
  
    'transit:neptune|ingress|house_1':
      'Neptune entering House 1 can increase sensitivity in self-image, boundaries, and personal direction. This phase asks for clarity in identity choices so inspiration does not become confusion. Keep routines simple and verify decisions through concrete behavior.',
    'transit:neptune|ingress|house_3':
      'Neptune entering House 3 can expand imagination, symbolic thinking, and subtle communication. The cycle asks for extra discernment with messages, assumptions, and interpretations. Organize information flow and confirm key details before deciding.',
    'transit:neptune|ingress|house_5':
      'Neptune entering House 5 may heighten creativity, romantic idealization, and emotional projection. This phase supports artistic expression when expectations are grounded in reality. Use inspiration with practical limits to preserve consistency.',
    'transit:neptune|ingress|house_10':
      'Neptune entering House 10 can activate questions about vocation, meaning, and public positioning. The period favors purpose alignment but asks for realism in goals and exposure. Validate direction with observable milestones and clear agreements.',
    'transit:neptune|conjuncao|sun':
      'Neptune conjunct Sun can amplify sensitivity, imagination, and search for meaning in personal direction. This phase asks for clear identity references so inspiration does not dissolve focus. Keep commitments realistic and review assumptions before major decisions.',
    'transit:neptune|conjuncao|moon':
      'Neptune conjunct Moon may increase emotional permeability, empathy, and subjective perception. The cycle asks for emotional boundaries and clear routines to avoid overload or confusion. Rest, grounding, and direct communication help preserve stability.',
    'transit:neptune|conjuncao|mercury':
      'Neptune conjunct Mercury can broaden symbolic thinking and intuition, while reducing mental precision. This phase asks for careful communication and verification of facts before conclusions. Write priorities clearly and avoid decisions based only on impression.',
    'transit:neptune|conjuncao|venus':
      'Neptune conjunct Venus can heighten idealization in relationships, values, and pleasure choices. The cycle favors sensitivity and refinement when reciprocity and limits stay explicit. Observe concrete signals before emotional or financial commitments.',
    'transit:neptune|conjuncao|mars':
      'Neptune conjunct Mars can blur initiative, pace, and use of force in action. This phase asks for intentional rhythm, clear priorities, and disciplined execution. Channel energy into few essential goals to reduce dispersion.',
    'transit:neptune|conjuncao|jupiter':
      'Neptune conjunct Jupiter can expand vision and spirituality, with risk of overexpectation. The period asks for balancing faith and realism so growth remains sustainable. Keep plans anchored in evidence, timing, and resource limits.',
    'transit:neptune|conjuncao|saturn':
      'Neptune conjunct Saturn can test structures by confronting certainty with sensitivity and ambiguity. This phase asks for flexible planning and clear criteria to avoid rigidity or escape patterns. Rebuild foundations gradually with realistic checkpoints.',
    'transit:neptune|conjuncao|neptune':
      'Neptune conjunct Neptune marks a long-cycle sensitivity reset around meaning, intuition, and projection. The phase can dissolve old references and ask for subtler forms of orientation. Keep practical anchors active while inner vision is reorganized.',
    'transit:neptune|conjuncao|ascendente':
      'Neptune conjunct Ascendant can soften personal boundaries and alter how your presence is perceived. This phase asks for coherence between image, intention, and concrete actions. Clarify limits and communicate expectations explicitly to reduce noise.',

    // ── Mars completion ────────────────────────────────────────────────────
    'transit:mars|sextil|sun':
      'Mars sextile Sun favors initiative with a clear read of personal direction and available energy. This cycle tends to support focused action when will and real priority are integrated. Use this moment to advance concrete goals with objectivity.',
    'transit:mars|sextil|meio_do_ceu':
      'Mars sextile Midheaven favors career initiative with good pacing and directional alignment. This cycle tends to support strategic moves when focus is placed on visibility goals. Execute by priority and track progress with clear criteria.',
    'transit:mars|trigono|sun':
      'Mars trine Sun reinforces flow between initiative and sense of direction. This phase tends to favor progress with less reactivity and more conscious intent. Focus on essentials and consolidate results with consistency.',
    'transit:mars|trigono|meio_do_ceu':
      'Mars trine Midheaven expands readiness to act on professional goals with good energy management. This phase supports career progress when direction is clear and consistent. Consolidate results by executing in objective stages.',
    'transit:mars|oposicao|ascendente':
      'Mars opposite Ascendant can raise posture tension and confrontational impulse in daily interactions. This phase asks for regulating intensity to preserve objectivity without losing firmness. Act with clear intent and reduce automatic reactions.',
    'transit:mars|ingress|house_1':
      'Mars entering House 1 increases personal energy, initiative, and the need to assert your own direction. This phase favors progress when focus and rhythm control prevent impulsiveness. Execute by priorities and monitor energy levels.',
    'transit:mars|ingress|house_2':
      'Mars entering House 2 intensifies drive to act on resources, values, and material security. This period may bring urgency to resolve financial or material matters with more force. Channel energy into practical adjustments with clear risk criteria.',
    'transit:mars|ingress|house_3':
      'Mars entering House 3 accelerates communication, study, and local movement. This phase can bring more assertive speech, with risk of impatience in tone. Channel energy into productive conversations and avoid impulsive responses.',
    'transit:mars|ingress|house_5':
      'Mars entering House 5 increases creative energy, expressive drive, and readiness for personal projects. This cycle favors initiative when focus is organized and affective risk is moderate. Channel impulse into creation with continuity.',
    'transit:mars|ingress|house_6':
      'Mars entering House 6 increases readiness to handle pending tasks and reorganize work routines. This period favors efficiency when method and priorities are clearly defined. Avoid excessive overload and track available energy.',
    'transit:mars|ingress|house_7':
      'Mars entering House 7 intensifies partnership dynamics, negotiation, and limit alignment in relationships. This cycle can bring greater assertiveness in agreements, with friction risk if listening is lacking. Adjust posture to preserve cooperation without dropping firmness.',
    'transit:mars|ingress|house_8':
      'Mars entering House 8 intensifies drive to deal with shared resources, trust, and inner transformation. This phase favors action on deep pending matters when there is criteria and transparency. Advance carefully and avoid confrontations by force.',
    'transit:mars|ingress|house_9':
      'Mars entering House 9 expands initiative to study, plan, and broaden long-range perspective. This period favors action in education or expansion projects when objectives are clear. Use energy to translate vision into concrete plans.',
    'transit:mars|ingress|house_11':
      'Mars entering House 11 increases readiness to engage networks, collective projects, and future goals. This phase favors leadership in collaborations when focus and real reciprocity are present. Channel energy toward alliances with purpose and concrete return.',
    'transit:mars|ingress|house_12':
      'Mars entering House 12 can trigger inner drive to resolve old matters and organize closure processes. This cycle favors quiet, preparatory action when criteria and adequate rest are in place. Avoid rushing and respect the recovery rhythm.',

    // ── Mercury sextile ────────────────────────────────────────────────────
    'transit:mercury|sextil|sun':
      'Mercury sextile Sun favors integration between mental clarity and sense of direction. This phase tends to support decisions and communications aligned with real priorities. Use this moment to organize key messages and advance with consistency.',
    'transit:mercury|sextil|moon':
      'Mercury sextile Moon eases translation of emotion into clear, adaptable language in daily life. This cycle tends to support caring conversations with more objectivity. Use the moment to name needs and adjust expectations with active listening.',
    'transit:mercury|sextil|mercury':
      'Mercury sextile Mercury favors mental fluency, idea review, and quick information connections. This phase tends to support study, writing, and process organization with more agility. Take advantage to unblock pending matters with objective language.',
    'transit:mercury|sextil|venus':
      'Mercury sextile Venus favors diplomacy, value expression, and conversation with relational elegance. This cycle tends to ease agreements when form and content are balanced. Use this phase to strengthen exchanges with kindness without losing assertiveness.',
    'transit:mercury|sextil|mars':
      'Mercury sextile Mars favors quick decisions, assertive argumentation, and objective communication. This cycle tends to support negotiations when focus is clear and listening is active. Advance with clarity in strategic conversations and avoid rushed responses.',
    'transit:mercury|sextil|jupiter':
      'Mercury sextile Jupiter favors expanded repertoire, learning, and broader contextual vision. This phase tends to ease negotiations and planning when detail and big picture align. Convert good insights into concrete plans.',
    'transit:mercury|sextil|saturn':
      'Mercury sextile Saturn favors organized thinking, precise communication, and methodical planning. This cycle tends to support contract and agreement review with more pragmatism. Structure information by priority before deciding.',
    'transit:mercury|sextil|uranus':
      'Mercury sextile Uranus favors new ideas, quick mental connections, and openness to revising processes. This phase tends to support communicational innovation when validation criteria are present. Test different approaches with focus and measure impact before scaling.',
    'transit:mercury|sextil|neptune':
      'Mercury sextile Neptune favors subtle perception, creative communication, and reading of subjective contexts. This cycle tends to support inspiration when grounded in verifiable facts. Record key ideas and confirm understanding before closing agreements.',
    'transit:mercury|sextil|pluto':
      'Mercury sextile Pluto favors analytical depth and strategic communication with clearer objectives. This cycle tends to support investigation and premise reframing with criteria. Direct focus to essentials and stay open to revising hypotheses.',
    'transit:mercury|sextil|ascendente':
      'Mercury sextile Ascendant favors expressive clarity and better reading of social interactions. This phase tends to ease alignment of personal positioning with direct communication. Take the opportunity to organize messages and adjust posture with objectivity.',
    'transit:mercury|sextil|meio_do_ceu':
      'Mercury sextile Midheaven favors professional communication, narrative alignment, and positioning clarity. This cycle tends to support progress in image and delivery when messages are consistent. Prioritize strategic conversations with focus and precision.',

    // ── Mercury trine ──────────────────────────────────────────────────────
    'transit:mercury|trigono|sun':
      'Mercury trine Sun reinforces coherence between thought, intention, and how direction is communicated. This period tends to support decisions when priorities are clear and well articulated. Use this phase to consolidate your core narrative and reduce dispersion.',
    'transit:mercury|trigono|moon':
      'Mercury trine Moon favors balance between emotion and reason in daily communication. This phase tends to ease delicate conversations with more naturalness and listening. Take the opportunity to align inner needs with external goals in a simple way.',
    'transit:mercury|trigono|mercury':
      'Mercury trine Mercury reinforces mental clarity, decision agility, and strong ideational connections. This cycle tends to ease study, writing, and plan organization with more fluency. Convert organized repertoire into practical and verifiable progress.',
    'transit:mercury|trigono|venus':
      'Mercury trine Venus favors harmony in value conversations, natural diplomacy, and exchange quality. This phase tends to ease relational and financial agreements with less friction. Invest in warm communication without dropping clarity and assertiveness.',
    'transit:mercury|trigono|mars':
      'Mercury trine Mars favors objectivity, firm argumentation, and agile decision-making. This cycle tends to ease negotiations when message and logic align. Advance with clarity and keep active listening to sustain alignment.',
    'transit:mercury|trigono|jupiter':
      'Mercury trine Jupiter favors synthesis between detail and broad vision, with gains for learning and strategy. This phase tends to support productive conversations and long-range planning. Convert good perception into practical plans with verifiable stages.',
    'transit:mercury|trigono|saturn':
      'Mercury trine Saturn reinforces structured thinking, precise communication, and decision-making method. This cycle tends to support information organization and planning with more solidity. Prioritize essentials and document agreements to sustain continuity.',
    'transit:mercury|trigono|uranus':
      'Mercury trine Uranus eases mental innovation and openness to revising certainties with more fluency. This phase tends to favor quick insights when prioritization criteria are present. Turn new ideas into practical, measurable experiments.',
    'transit:mercury|trigono|neptune':
      'Mercury trine Neptune favors integration between intuition and communication with more naturalness. This cycle tends to support applied creativity when facts and contexts are verified. Record key perceptions and confirm details before deciding.',
    'transit:mercury|trigono|pluto':
      'Mercury trine Pluto expands analytical depth and capacity to reformulate strategy with criteria. This phase tends to ease root diagnosis and communication of structural changes. Direct focus to essentials and stay open to new perspectives.',
    'transit:mercury|trigono|ascendente':
      'Mercury trine Ascendant favors natural expression, clear positioning, and good reception in interactions. This cycle tends to support important conversations with less communication effort. Take advantage of the flow to strengthen relevant alignments.',
    'transit:mercury|trigono|meio_do_ceu':
      'Mercury trine Midheaven reinforces professional narrative clarity and consistent public positioning. This phase tends to ease visibility when communication and delivery are aligned. Prioritize strategic messages and advance with objectivity and coherence.',

    // ── Mercury opposition ─────────────────────────────────────────────────
    'transit:mercury|oposicao|sun':
      'Mercury opposite Sun can tension intention and how direction is communicated, creating noise between plan and execution. This period asks for premise revision and core message alignment before important decisions. Simplify the narrative and validate priorities with clarity.',
    'transit:mercury|oposicao|moon':
      'Mercury opposite Moon can amplify conflict between emotional needs and objective communication. This cycle asks for care with impulsive messages and hasty interpretations in daily life. Pause, organize what you feel, and communicate with more calm and precision.',
    'transit:mercury|oposicao|mercury':
      'Mercury opposite Mercury can activate divergence in references, reasoning pace, and decision criteria. This phase asks for methodical premise review to avoid rework from communicational noise. Validate key interpretations before closing agreements.',
    'transit:mercury|oposicao|venus':
      'Mercury opposite Venus can tension diplomacy and frankness in affective or value-based conversations. This cycle asks for balancing form and content to preserve connection without omitting essentials. Adjust expectations and language to sustain reciprocity.',
    'transit:mercury|oposicao|mars':
      'Mercury opposite Mars can increase speech speed and argumentation with drop in listening and precision. This phase asks for care with reactive responses and rushed conclusions in sensitive conversations. Confirm facts, simplify messages, and advance with objectivity.',
    'transit:mercury|oposicao|jupiter':
      'Mercury opposite Jupiter can expand discourse and broad vision with less detail verification criteria. This cycle asks for balancing idea enthusiasm with practical checking before deciding. Simplify and prioritize what is truly viable now.',
    'transit:mercury|oposicao|saturn':
      'Mercury opposite Saturn can tension mental pacing and communication style with greater structural demand. This phase asks for method, patience, and explicit criteria to avoid decision paralysis. Organize arguments and document agreements calmly.',
    'transit:mercury|oposicao|uranus':
      'Mercury opposite Uranus can bring rapid idea shifts and tension between innovation and consistency. This cycle asks for containing communicational rupture impulses without suppressing openness to new ideas. Validate new approaches before scaling and preserve continuity.',
    'transit:mercury|oposicao|neptune':
      'Mercury opposite Neptune can increase ambiguity, assumptions, and lack of clarity in important data. This phase asks for confirming facts, dates, and responsibilities with more rigor before concluding. Document agreements in writing and validate mutual understanding.',
    'transit:mercury|oposicao|pluto':
      'Mercury opposite Pluto can intensify narrative control, rigid perspectives, and tension in interpretation disputes. This cycle asks for analytical rigor without unnecessary confrontation. Focus on verifiable evidence and keep openness to nuance.',
    'transit:mercury|oposicao|ascendente':
      'Mercury opposite Ascendant can bring tone mismatch, expression, and context misreading in daily interactions. This phase asks for adjusting communication style to preserve clarity without escalating unnecessary tension. Simplify messages and confirm mutual understanding.',
    'transit:mercury|oposicao|meio_do_ceu':
      'Mercury opposite Midheaven can tension professional communication and consistency of public positioning. This period asks for narrative, timeline, and delivery alignment review. Small communication adjustments tend to reduce image noise.',

    // ── Mercury ingress ────────────────────────────────────────────────────
    'transit:mercury|ingress|house_1':
      'Mercury entering House 1 expands personal communication clarity and mental agility about identity and direction. This phase favors better articulation of what you want and how you present yourself. Organize key messages and use the period to align speech with action.',
    'transit:mercury|ingress|house_2':
      'Mercury entering House 2 activates mental focus on resources, values, and material security decisions. This cycle favors reviewing finances, contracts, and value criteria with more clarity. Organize information and prioritize what truly sustains stability.',
    'transit:mercury|ingress|house_3':
      'Mercury entering House 3 intensifies mental activity, local exchanges, and the need for precise communication. This phase favors rapid learning, writing, and strategic conversations in the nearby environment. Organize information flow and prioritize high-impact messages.',
    'transit:mercury|ingress|house_4':
      'Mercury entering House 4 activates reflection on emotional foundation, family, and home structure. This period favors mature conversations about limits, cohabitation, and affective security. Organize domestic matters and align expectations with those who share your space.',
    'transit:mercury|ingress|house_5':
      'Mercury entering House 5 expands creative expression, pleasure-related ideas, and more spontaneous communication. This phase favors personal projects, romances, and exchanges with more lightness and authenticity. Use the moment to articulate what you are creating with clarity and intent.',
    'transit:mercury|ingress|house_6':
      'Mercury entering House 6 activates attention to detail, operational routine, and daily work processes. This cycle favors reviewing methods, instructions, and technical communications with more precision. Organize tasks, deadlines, and priorities to reduce noise and rework.',
    'transit:mercury|ingress|house_7':
      'Mercury entering House 7 expands focus on partnership conversations, agreements, and expectation alignment in relationships. This phase favors clear negotiation and commitment review with others. Use the period to name limits and strengthen the relational foundation.',
    'transit:mercury|ingress|house_8':
      'Mercury entering House 8 activates investigative thinking and focus on trust, shared resources, and transformation. This cycle favors background research, deep agreement review, and communication of sensitive truths. Advance with criteria and openness.',
    'transit:mercury|ingress|house_9':
      'Mercury entering House 9 expands mental repertoire, curiosity about worldview, and long-range planning. This phase favors study, writing about broad ideas, and meaningful conversations. Organize new knowledge into perspective applicable to the present.',
    'transit:mercury|ingress|house_10':
      'Mercury entering House 10 activates professional communication, positioning strategy, and public message clarity. This period favors aligning image narrative with concrete deliveries. Prioritize strategic conversations and consistent messages to strengthen credibility.',
    'transit:mercury|ingress|house_11':
      'Mercury entering House 11 activates idea flow in networks, collective projects, and shared future vision. This phase favors exchanges with groups, collaborations, and strategic brainstorming. Organize contributions and prioritize conversations with clear result objectives.',
    'transit:mercury|ingress|house_12':
      'Mercury entering House 12 expands inner reflection, processing of old patterns, and subtle context reading. This cycle favors introspective writing, pending matter organization, and silent premise review. Use the period to integrate learning before communicating new directions.',

    // ── Venus conjunction ──────────────────────────────────────────────────
    'transit:venus|conjuncao|sun':
      'Venus conjunct Sun reinforces personal expression of value, affection, and the need for daily harmony. This phase favors alignment between what you want to offer and what you can sustain authentically. Use the moment to strengthen your image with balance between openness and limits.',
    'transit:venus|conjuncao|moon':
      'Venus conjunct Moon amplifies emotional sensitivity and the need for comfort, care, and affective connection. This cycle can ease warm exchanges when expectations and limits are clear. Prioritize what brings well-being with moderation and reciprocity criteria.',
    'transit:venus|conjuncao|mercury':
      'Venus conjunct Mercury favors diplomatic communication, affective expression, and conversation with more elegance. This cycle tends to ease agreements when values and positions are well articulated. Invest in clear, kind language to strengthen bonds and mutual understanding.',
    'transit:venus|conjuncao|venus':
      'Venus conjunct Venus reinforces personal values, aesthetic sensibility, and sensitivity to relationships and pleasure. This phase can amplify the need for harmonization and recognition in bonds. Use the moment to align what you appreciate with what genuinely sustains well-being.',
    'transit:venus|conjuncao|mars':
      'Venus conjunct Mars combines attraction, desire, and the need to align affection with action. This phase favors connections when limits and expectations are clear between parties. Balance intensity with listening to preserve exchange quality.',
    'transit:venus|conjuncao|saturn':
      'Venus conjunct Saturn combines affection and responsibility, calling for maturity in value and bond choices. This cycle favors clear limit definition and sustainable reciprocity. Invest in what is consistent and reduce agreements that drain more than they sustain.',
    'transit:venus|conjuncao|uranus':
      'Venus conjunct Uranus can open reviews in relationships, values, and pleasure choices with less attachment to patterns. This phase favors authenticity and new exchange formats when limits are clear. Innovate consciously to preserve reciprocity and stability.',
    'transit:venus|conjuncao|neptune':
      'Venus conjunct Neptune can amplify idealization in bonds, aesthetics, and affective and financial choices. This cycle favors sensitivity and openness when discernment about expectations is clear. Stay grounded in concrete signals before making or deepening agreements.',
    'transit:venus|conjuncao|pluto':
      'Venus conjunct Pluto intensifies attachment dynamics, value, and the need for depth in important bonds. This phase can activate themes of control or transformation in relationships. Advance with clear limits and honest openness to what needs to change.',
    'transit:venus|conjuncao|ascendente':
      'Venus conjunct Ascendant amplifies charm, sociability, and openness to connect and harmonize relationships. This phase tends to ease positive first impressions when limits are clear. Use the moment to expand your network with authenticity and measure.',
    'transit:venus|conjuncao|meio_do_ceu':
      'Venus conjunct Midheaven favors public recognition through quality, aesthetics, and good relationship skills. This cycle tends to open career opportunities linked to image and collaboration. Use the visibility to strengthen positioning with authenticity and criteria.',

    // ── Venus sextile ──────────────────────────────────────────────────────
    'transit:venus|sextil|sun':
      'Venus sextile Sun favors expression of personal value, well-being, and relational openness with more naturalness. This cycle tends to ease recognition and connection when authenticity and moderation are present. Use the moment to strengthen your image with balance and coherence.',
    'transit:venus|sextil|moon':
      'Venus sextile Moon favors integration between sensitivity and the need for affective connection in daily life. This phase tends to amplify care and lightness in bonds with less reactivity. Small gestures of attention can improve exchange quality consistently.',
    'transit:venus|sextil|mercury':
      'Venus sextile Mercury favors diplomatic conversations, affective expression, and communication with more elegance. This cycle tends to ease agreements when values and positions are well articulated. Invest in gentle and assertive language to strengthen understanding.',
    'transit:venus|sextil|venus':
      'Venus sextile Venus favors harmonization in relationships, pleasure choices, and value expression with more flow. This phase tends to amplify well-being and relational openness when reciprocity and limits are present. Take advantage to strengthen quality bonds with measure and consistency.',
    'transit:venus|sextil|mars':
      'Venus sextile Mars favors initiative in relationships and agreements with good balance between desire and cooperation. This cycle tends to ease connections when limits and expectations are clear. Combine assertiveness and diplomacy to strengthen meaningful exchanges.',
    'transit:venus|sextil|jupiter':
      'Venus sextile Jupiter favors relational expansion, openness to new bonds, and pleasure experiences with criteria. This phase tends to ease social opportunities when moderation and clear reciprocity are present. Take advantage of the flow to consolidate quality connections.',
    'transit:venus|sextil|saturn':
      'Venus sextile Saturn favors mature bond, value, and sustainable commitment choices. This cycle tends to support affective stability when limit clarity and realistic expectations are present. Invest in what has real grounding and strengthen what sustains quality over time.',
    'transit:venus|sextil|uranus':
      'Venus sextile Uranus favors affective and financial renewal with more lightness and openness to new formats. This cycle supports value and bond adjustments with creativity and criteria. Innovate consciously to maintain authenticity and reciprocity.',
    'transit:venus|sextil|neptune':
      'Venus sextile Neptune favors aesthetic sensitivity, empathic openness, and subtler connection in bonds. This phase tends to support creative inspiration and affective opening when practical discernment is present. Stay grounded in facts to avoid scenario idealization.',
    'transit:venus|sextil|pluto':
      'Venus sextile Pluto favors relational depth and value revision with clearer strategic focus. This cycle tends to support positive transformations in bonds when openness and limit criteria are present. Prioritize what has real long-term consistency and value.',
    'transit:venus|sextil|ascendente':
      'Venus sextile Ascendant favors natural charm, social openness, and ease in first interactions. This phase tends to support new contacts and existing bond strengthening with authenticity. Use the moment to expand presence with balance and limit clarity.',
    'transit:venus|sextil|meio_do_ceu':
      'Venus sextile Midheaven favors professional recognition through relational quality and strategic sensitivity. This cycle tends to support progress in image and collaboration when criteria and consistency are present. Prioritize value connections to strengthen positioning.',

    // ── Venus trine ────────────────────────────────────────────────────────
    'transit:venus|trigono|sun':
      'Venus trine Sun reinforces coherence between personal value, well-being, and how you present yourself daily. This period tends to ease recognition and connection when authenticity and moderation are present. Use this phase to consolidate your image with balance and limit clarity.',
    'transit:venus|trigono|moon':
      'Venus trine Moon favors harmony between emotional sensitivity and the need for affective connection. This phase tends to amplify care and relational stability with less reactivity. Small attentiveness adjustments can improve well-being and exchange quality.',
    'transit:venus|trigono|mercury':
      'Venus trine Mercury favors harmony in value conversations, natural diplomacy, and more fluid communication. This cycle tends to ease relational and financial agreements with less friction. Invest in gentle and assertive expression to strengthen bond quality.',
    'transit:venus|trigono|venus':
      'Venus trine Venus reinforces expression of personal values and affective well-being with more flow and integrity. This phase tends to amplify pleasure and relational openness when limit clarity is present. Use the moment to strengthen bonds and choices that sustain quality over time.',
    'transit:venus|trigono|mars':
      'Venus trine Mars favors affective initiative and cooperation in important agreements with less friction. This cycle tends to ease connection when desire and reciprocity are balanced. Use assertiveness with care to strengthen and expand bonds.',
    'transit:venus|trigono|jupiter':
      'Venus trine Jupiter favors relational expansion, agreement harmonization, and openness to more pleasure with moderation. This phase tends to amplify well-being when clear reciprocity and limit criteria are present. Use the flow to consolidate quality connections with real value.',
    'transit:venus|trigono|saturn':
      'Venus trine Saturn favors affective and financial stability grounded in maturity and consistency. This cycle tends to ease long-term agreements when values and limits are well defined. Invest in what has real grounding and long-term sustainability.',
    'transit:venus|trigono|uranus':
      'Venus trine Uranus eases updating of relationships, values, and pleasure choices with lightness and authenticity. This phase tends to amplify openness without requiring unnecessary rupture. Innovate consciously to maintain reciprocity and stability.',
    'transit:venus|trigono|neptune':
      'Venus trine Neptune favors aesthetic sensitivity, empathy, and subtler connection in affective bonds. This cycle tends to support applied creativity and emotional openness with good discernment. Stay practically grounded to translate inspiration into real experience.',
    'transit:venus|trigono|pluto':
      'Venus trine Pluto favors positive transformation in bonds, value depth, and choice revision with clarity. This phase tends to support relational growth when openness and conscious limits are present. Prioritize what has real long-term consistency and value.',
    'transit:venus|trigono|ascendente':
      'Venus trine Ascendant favors naturalness in relationships, social openness, and good reception of personal image. This cycle tends to ease contacts and partnerships with lightness and authenticity. Use the phase to expand presence and strengthen bonds with balance and clarity.',
    'transit:venus|trigono|meio_do_ceu':
      'Venus trine Midheaven reinforces professional recognition through relational quality and strategic sensitivity. This phase tends to ease progress in image and collaboration with less friction. Prioritize quality connections and deliveries to consolidate positioning.',

    // ── Venus opposition ───────────────────────────────────────────────────
    'transit:venus|oposicao|sun':
      'Venus opposite Sun can tension the need for recognition and how value is expressed daily. This period asks for aligning what you want to offer with what you can sustain with quality. Calibrate expectations and negotiate limits with clarity.',
    'transit:venus|oposicao|moon':
      'Venus opposite Moon can amplify oscillation between connection needs and emotional sensitivity in bonds. This phase asks for moderating affective expectations to avoid proximity and distance fluctuation. Align what you need with what is available daily.',
    'transit:venus|oposicao|mercury':
      'Venus opposite Mercury can tension diplomacy and frankness in value and bond conversations. This cycle asks for balancing listening and objectivity to avoid relational misunderstandings. Adjust form and content to preserve connection without omitting essentials.',
    'transit:venus|oposicao|venus':
      'Venus opposite Venus can amplify conflict between personal values and others values in important agreements. This phase asks for revising reciprocity expectations with more realism and openness. Negotiate limits with clarity to sustain quality exchange.',
    'transit:venus|oposicao|mars':
      'Venus opposite Mars can tension desire, affection, and how proximity and autonomy are negotiated. This phase asks for calibrating initiative and receptivity to avoid oscillation between connection and conflict. Active listening and clear agreements strengthen exchange quality.',
    'transit:venus|oposicao|jupiter':
      'Venus opposite Jupiter can amplify desire for pleasure and reciprocity expectations beyond the viable. This cycle asks for moderating affective concessions to avoid excess or later frustration. Review with criteria and prioritize quality over quantity.',
    'transit:venus|oposicao|saturn':
      'Venus opposite Saturn can bring revision of affective expectations and values with more structural demand. This cycle asks for emotional maturity and realistic bond choices. Strengthen what is reciprocal and reduce agreements that drain more than sustain.',
    'transit:venus|oposicao|uranus':
      'Venus opposite Uranus can bring instability in relationships and oscillation between freedom and connection needs. This phase asks for negotiating autonomy and reciprocity with clarity to avoid reactive ruptures. Adjust bonds with authenticity and limit criteria.',
    'transit:venus|oposicao|neptune':
      'Venus opposite Neptune can amplify idealization, projection, and confusion about value and reciprocity in bonds. This cycle asks for discernment to separate intuition from wishful expectation. Observe concrete signals before establishing or deepening affective agreements.',
    'transit:venus|oposicao|pluto':
      'Venus opposite Pluto can intensify attachment, control, and power dynamics in important bonds. This phase asks for conscious limit posture to avoid conflict escalation over value or dependency. Advance with clear boundaries and openness to what needs to change.',
    'transit:venus|oposicao|ascendente':
      'Venus opposite Ascendant can tension the balance between recognition needs and external relational demands. This phase asks for calibrating what you offer with what you can sustain with quality. Negotiate limits with clarity to preserve cooperation.',
    'transit:venus|oposicao|meio_do_ceu':
      'Venus opposite Midheaven can tension public projection and relationship quality in professional contexts. This cycle asks for aligning image, affective base, and exposure limits. Adjust recognition expectations and prioritize quality over visibility.',

    // ── Venus square ───────────────────────────────────────────────────────
    'transit:venus|quadratura|sun':
      'Venus square Sun can tension value expression and personal recognition needs. This period asks for calibrating affective and social return expectations with more criteria. Focus on delivery quality and authenticity to strengthen real value grounding.',
    'transit:venus|quadratura|moon':
      'Venus square Moon can amplify affective sensitivity and oscillation between comfort and reciprocity needs. This phase asks for moderation to avoid excessive emotional demands. Align what you need with what is available and strengthen limits with gentleness.',
    'transit:venus|quadratura|mercury':
      'Venus square Mercury can tension diplomacy and frankness in value and bond conversations. This cycle asks for balancing expression and listening to avoid misunderstandings that wear down relationships. Adjust language and expectations to maintain reciprocity.',
    'transit:venus|quadratura|venus':
      'Venus square Venus can activate internal conflict between what you value and what you are actually choosing. This phase asks for revising well-being and relational priorities with more realism. Simplify choices and focus on what brings real consistency.',
    'transit:venus|quadratura|mars':
      'Venus square Mars can tension desire and cooperation in relationships, with risk of oscillation between connection and conflict. This phase asks for aligning expectations and limits to sustain exchange quality. Active listening and direct agreements help preserve the bond.',
    'transit:venus|quadratura|jupiter':
      'Venus square Jupiter can amplify desire for pleasure, spending, or affective concession beyond the ideal. This phase asks for balance between immediate well-being and long-term value. Review choices with criteria and maintain reciprocity in relationships.',
    'transit:venus|quadratura|saturn':
      'Venus square Saturn can bring revision of affective and value expectations with more structural demand. This cycle asks for emotional maturity, clear limits, and more realistic choices. Strengthen what is reciprocal and reduce agreements that drain energy.',
    'transit:venus|quadratura|uranus':
      'Venus square Uranus can bring instability in relationships, values, and pleasure choices with immediate freedom needs. This phase asks for negotiating autonomy and reciprocity to avoid reactive rupture. Adjust bonds with authenticity and limit criteria.',
    'transit:venus|quadratura|neptune':
      'Venus square Neptune can generate affective idealization and confusion about value and reciprocity in bonds. This cycle asks for discernment to separate intuition from projected expectation. Observe concrete signals before broadening or establishing emotional agreements.',
    'transit:venus|quadratura|pluto':
      'Venus square Pluto can intensify attachment, jealousy, and control needs in important relationships. This phase asks for conscious limit posture to avoid conflict escalation over power or value. Advance with openness to what needs to change without forcing results.',
    'transit:venus|quadratura|ascendente':
      'Venus square Ascendant can tension social recognition needs and how you present yourself in bonds. This cycle asks for calibrating openness and limits to avoid excessive concession or distance. Adjust posture with authenticity and reciprocity criteria.',
    'transit:venus|quadratura|meio_do_ceu':
      'Venus square Midheaven can tension professional relationships and public image with affective or aesthetic expectations. This period asks for separating bonds from career with more criteria. Prioritize what is congruent with your goals and strengthen real value grounding.',

    // ── Venus ingress ──────────────────────────────────────────────────────
    'transit:venus|ingress|house_1':
      'Venus entering House 1 amplifies natural charm, harmonization needs, and openness to new connections. This phase favors personal value expression with more authenticity and presence. Use the moment to cultivate relationships with balance and limit clarity.',
    'transit:venus|ingress|house_2':
      'Venus entering House 2 amplifies attention to resources, personal values, and pleasure and security experiences. This cycle favors reviewing what truly matters materially and affectively. Prioritize choices that sustain well-being with criteria and consistency.',
    'transit:venus|ingress|house_3':
      'Venus entering House 3 favors harmonic conversations, diplomatic expression, and idea exchanges with more lightness. This period amplifies openness to learning and communicating with affection and care. Take advantage to strengthen local relationships and conversations that matter.',
    'transit:venus|ingress|house_4':
      'Venus entering House 4 favors harmonization of the home environment, emotional comfort, and family relationship quality. This phase tends to amplify desire for peace and care at home. Small cohabitation and environment adjustments can bring more well-being.',
    'transit:venus|ingress|house_5':
      'Venus entering House 5 amplifies pleasure, creative expression, and openness to romance and affection with more authenticity. This cycle favors personal expression projects, encounters, and choices that bring joy. Use the moment with moderation and reciprocity criteria.',
    'transit:venus|ingress|house_6':
      'Venus entering House 6 favors daily routine harmonization, work relationships, and functional well-being. This phase can amplify pleasure in daily tasks when organization and criteria are present. Small environment and work dynamic adjustments tend to bring more lightness.',
    'transit:venus|ingress|house_7':
      'Venus entering House 7 amplifies relational openness, partnership desire, and harmonization needs in agreements. This cycle favors new bonds and existing relationship strengthening when clear reciprocity is present. Prioritize cooperation and limit definition with gentleness.',
    'transit:venus|ingress|house_8':
      'Venus entering House 8 amplifies bond depth, shared resource themes, and trust needs. This phase can favor real intimacy when openness and conscious limits are present. Advance with criteria and clarity in deep agreements and value choices.',
    'transit:venus|ingress|house_9':
      'Venus entering House 9 amplifies openness to learning, vision expansion, and pleasure in cultural and long-range connections. This cycle favors travel, study, and connections that broaden affective perspective. Use the period to cultivate what expands meaning and experience quality.',
    'transit:venus|ingress|house_10':
      'Venus entering House 10 favors professional recognition through relational quality, aesthetics, and good positioning. This phase can amplify collaboration and visibility opportunities with criteria. Strengthen image with authenticity and cultivate value relationships in the career environment.',
    'transit:venus|ingress|house_11':
      'Venus entering House 11 favors harmonization in networks, collaborations, and shared future projects. This cycle amplifies openness to new bonds and quality connections with purpose. Prioritize alliances with real reciprocity and contribute with authenticity.',
    'transit:venus|ingress|house_12':
      'Venus entering House 12 amplifies inner sensitivity, affective rest needs, and quiet closure processes. This phase favors self-care, relationship refinement, and revision of what sustains real well-being. Use the period to integrate relational learning.',
},
  'es-ES': {
    'transit:mercury|conjuncao|ascendente':
      'Mercurio en conjuncion al Ascendente tiende a aumentar claridad verbal, movilidad mental y rapidez de respuesta. Esta fase favorece presentaciones, conversaciones clave y ajustes de posicion personal. Organiza mensajes centrales y manten comunicacion objetiva para reducir ruido.',
    'transit:mercury|conjuncao|jupiter':
      'Mercurio en conjuncion con Jupiter amplia vision de contexto y repertorio de ideas, con apoyo para estrategia y aprendizaje. Este ciclo funciona mejor cuando la perspectiva amplia se combina con criterio de prioridad. Convierte insight en plan practico con etapas verificables.',
    'transit:mercury|conjuncao|mars':
      'Mercurio en conjuncion con Marte acelera pensamiento y decisiones, elevando impulso de respuesta inmediata. Esta fase favorece ejecucion cuando enfoque y orden de prioridades estan claros. Evita conclusiones rapidas y valida hechos antes de cerrar acuerdos.',
    'transit:mercury|conjuncao|meio_do_ceu':
      'Mercurio en conjuncion al Medio Cielo favorece visibilidad por comunicacion, estrategia y narrativa profesional. Este periodo tiende a abrir espacio para alinear imagen publica y entrega objetiva. Mantener mensajes simples y consistentes fortalece credibilidad.',
    'transit:mercury|conjuncao|mercury':
      'Mercurio en conjuncion con Mercurio marca ventana de alta actividad mental para revisar ideas y criterios. Esta fase favorece estudio, escritura y reorganizacion de decisiones. Estructura informacion por relevancia para evitar sobrecarga cognitiva.',
    'transit:mercury|conjuncao|moon':
      'Mercurio en conjuncion con Luna acerca pensamiento y emocion, favoreciendo dialogos mas claros y empaticos. Este ciclo puede facilitar nombrar sentimientos y ajustar expectativas diarias. Mantener escucha activa equilibra sensibilidad y objetividad.',
    'transit:mercury|conjuncao|neptune':
      'Mercurio en conjuncion con Neptuno amplia intuicion mental y lectura simbolica, con riesgo de ambiguedad en datos concretos. Esta fase favorece creatividad cuando hay verificacion practica. Registra acuerdos y revisa detalles para evitar malentendidos.',
    'transit:mercury|conjuncao|pluto':
      'Mercurio en conjuncion con Pluton intensifica foco investigativo y profundidad analitica en temas sensibles. Este ciclo favorece diagnostico de raiz y reformulacion estrategica con criterio. Evita rigidez discursiva y manten apertura para revisar hipotesis.',
    'transit:mercury|conjuncao|saturn':
      'Mercurio en conjuncion con Saturno favorece pensamiento estructurado, disciplina intelectual y comunicacion precisa. Esta fase apoya planificacion, revision de acuerdos y definicion de metodo. Trabaja con plazos claros y lenguaje objetivo para sostener confianza.',
    'transit:mercury|conjuncao|sun':
      'Mercurio en conjuncion al Sol refuerza claridad mental y alineacion entre intencion y expresion. Este periodo favorece decisiones cuando prioridades estan definidas y comunicadas con simplicidad. Usa la fase para aclarar direccion y reducir dispersion.',
    'transit:mercury|conjuncao|uranus':
      'Mercurio en conjuncion con Urano acelera innovacion mental y apertura a ideas fuera de patron. Esta fase favorece breakthroughs cuando intuicion rapida y validacion objetiva avanzan juntas. Prueba hipotesis en ciclos cortos antes de escalar cambios.',
    'transit:mercury|conjuncao|venus':
      'Mercurio en conjuncion con Venus favorece diplomacia, conciliacion y calidad de intercambio en conversaciones importantes. Este ciclo suele facilitar acuerdos cuando valores y limites estan claros. Invierte en comunicacion amable sin perder firmeza.',
    'transit:mercury|quadratura|ascendente':
      'Mercurio en cuadratura al Ascendente puede aumentar friccion comunicativa y desajuste de tono en interacciones. Esta fase pide ajustar forma de expresion para mantener claridad sin escalar tension. Simplifica mensajes y confirma entendimiento mutuo.',
    'transit:mercury|quadratura|jupiter':
      'Mercurio en cuadratura con Jupiter tiende a ampliar ideas sin la misma precision de criterio. Este ciclo pide equilibrar vision amplia con verificacion de detalles antes de decidir. Evita promesas extensas sin plan operativo claro.',
    'transit:mercury|quadratura|mars':
      'Mercurio en cuadratura con Marte puede acelerar habla y debate, elevando riesgo de reactividad verbal. Esta fase pide pausas estrategicas para reducir conflicto improductivo. Reordena prioridades y responde con objetividad, no por impulso.',
    'transit:mercury|quadratura|meio_do_ceu':
      'Mercurio en cuadratura al Medio Cielo puede tensionar narrativa publica y consistencia de posicion profesional. Este periodo pide revisar mensajes, plazos y coherencia entre discurso y entrega. Ajustes simples de comunicacion reducen ruido de imagen.',
    'transit:mercury|quadratura|mercury':
      'Mercurio en cuadratura con Mercurio puede traer conflicto entre referencias mentales, ritmo de decision y organizacion de datos. Esta fase pide revisar premisas con metodo para evitar retrabajo. Prioriza lo esencial y valida interpretaciones clave.',
    'transit:mercury|quadratura|moon':
      'Mercurio en cuadratura con Luna puede generar friccion entre logica y sensibilidad en temas cotidianos. Este ciclo pide traducir emocion a lenguaje claro para reducir ruido relacional. Combina escucha y objetividad para estabilizar conversaciones delicadas.',
    'transit:mercury|quadratura|neptune':
      'Mercurio en cuadratura con Neptuno puede aumentar confusion de contexto, suposiciones y fallos de detalle. Esta fase pide confirmar hechos, fechas y responsabilidades antes de cerrar acuerdos. Documenta compromisos por escrito para reducir ambiguedad.',
    'transit:mercury|quadratura|pluto':
      'Mercurio en cuadratura con Pluton intensifica control narrativo y rigidez en disputas de interpretacion. Este ciclo pide rigor analitico sin paranoia ni confrontacion innecesaria. Enfoca evidencia verificable y manten apertura a matices.',
    'transit:mercury|quadratura|saturn':
      'Mercurio en cuadratura con Saturno puede traer presion mental, peso decisorio y comunicacion trabada. Esta fase pide metodo, paciencia y criterios explicitos para destrabar avances. Divide problemas en bloques y avanza en etapas cortas.',
    'transit:mercury|quadratura|sun':
      'Mercurio en cuadratura al Sol puede tensionar claridad de direccion y forma de comunicar prioridades. Este periodo pide alinear intencion, lenguaje y plan de accion con mayor coherencia. Revisa narrativa central antes de comunicar decisiones clave.',
    'transit:mercury|quadratura|uranus':
      'Mercurio en cuadratura con Urano puede generar cambios bruscos de idea y oscilacion entre insight y ruido. Esta fase pide contener impulso de ruptura sin bloquear innovacion. Valida experimentos en pequena escala y preserva criterio de continuidad.',
    'transit:mercury|quadratura|venus':
      'Mercurio en cuadratura con Venus puede tensionar diplomacia y franqueza en dialogos afectivos o de valor. Este ciclo pide negociar forma y contenido para preservar vinculo sin omitir puntos esenciales. Ajusta expectativas y lenguaje para sostener reciprocidad.',
    'transit:mars|sextil|ascendente':
      'Marte en sextil al Ascendente favorece iniciativa con mejor calibracion de postura y ritmo. Esta fase tiende a facilitar accion directa sin confrontacion innecesaria. Canaliza energia en decisiones objetivas y ejecucion consistente.',
    'transit:mars|sextil|jupiter':
      'Marte en sextil con Jupiter combina coraje y estrategia, favoreciendo avances con lectura de oportunidad. Este ciclo suele rendir mejor cuando entusiasmo se combina con plan practico. Prioriza frentes de mayor retorno y sigue progreso por etapas.',
    'transit:mars|sextil|mars':
      'Marte en sextil con Marte refuerza fluidez de iniciativa y capacidad de accion enfocada. Esta fase favorece productividad cuando prioridades estan claras y bien secuenciadas. Usa el impulso para cerrar pendientes relevantes sin dispersion.',
    'transit:mars|sextil|mercury':
      'Marte en sextil con Mercurio favorece comunicacion asertiva y decisiones mas agiles con buena claridad. Este ciclo tiende a facilitar negociaciones y avances cuando argumentos estan bien estructurados. Mantener objetividad y escucha ayuda al alineamiento.',
    'transit:mars|sextil|moon':
      'Marte en sextil con Luna ayuda a integrar accion y emocion con menor reactividad. Esta fase favorece ajustes de rutina y respuesta practica a demandas afectivas del dia a dia. Mantener ritmo sostenible preserva bienestar y continuidad.',
    'transit:mars|sextil|neptune':
      'Marte en sextil con Neptuno favorece transformar intuicion en movimiento practico con mayor fluidez. Este ciclo tiende a apoyar creatividad aplicada cuando objetivos estan minimamente claros. Estructura pasos cortos para evitar dispersion de energia.',
    'transit:mars|sextil|pluto':
      'Marte en sextil con Pluton refuerza determinacion, foco estrategico y capacidad de accion profunda. Esta fase favorece cambios estructurales sin necesidad de ruptura brusca. Dirige intensidad a metas centrales y consolida consistencia a largo plazo.',
    'transit:mars|sextil|saturn':
      'Marte en sextil con Saturno combina impulso y disciplina, favoreciendo ejecucion eficiente. Este ciclo tiende a abrir espacio para progreso constante cuando metodo y prioridad avanzan juntos. Avanza por etapas para consolidar resultados sostenibles.',
    'transit:mars|sextil|uranus':
      'Marte en sextil con Urano favorece innovacion practica y agilidad para ajustar ruta sin perder base. Esta fase tiende a apoyar cambios inteligentes cuando hay criterio de prueba y validacion. Experimenta con foco y escala solo lo que funciona.',
    'transit:mars|sextil|venus':
      'Marte en sextil con Venus favorece iniciativa en relaciones y acuerdos con mejor equilibrio entre deseo y cooperacion. Este ciclo tiende a facilitar acercamientos cuando limites y expectativas estan claros. Combina asertividad y diplomacia para fortalecer intercambios.',
    'transit:mars|trigono|ascendente':
      'Marte en trigono al Ascendente favorece accion directa con buena lectura de tiempo y postura. Esta fase tiende a aumentar confianza para iniciar movimientos personales con menos friccion. Usa este flujo para ejecutar prioridades con objetividad y constancia.',
    'transit:mars|trigono|jupiter':
      'Marte en trigono con Jupiter combina iniciativa y expansion en ritmo productivo. Este ciclo tiende a favorecer avances cuando entusiasmo y estrategia practica van juntos. Dirige energia a metas relevantes y revisa progreso por etapas.',
    'transit:mars|trigono|mars':
      'Marte en trigono con Marte refuerza impulso de ejecucion y sentido de direccion. Esta fase suele favorecer productividad cuando prioridades estan bien definidas. Aprovecha para cerrar frentes abiertos sin dispersar energia.',
    'transit:mars|trigono|mercury':
      'Marte en trigono con Mercurio favorece claridad para decidir y comunicar con firmeza. Este ciclo tiende a facilitar negociaciones y avances cuando argumentos son objetivos. Mantener escucha activa ayuda al alineamiento.',
    'transit:mars|trigono|moon':
      'Marte en trigono con la Luna favorece integracion entre voluntad y sensibilidad en la rutina. Esta fase tiende a facilitar respuesta practica sin perder cuidado emocional. Ajustes simples de ritmo pueden aumentar estabilidad interna.',
    'transit:mars|trigono|neptune':
      'Marte en trigono con Neptuno favorece transformar intuicion en accion con mas fluidez. Este ciclo tiende a apoyar creatividad aplicada cuando hay claridad minima de objetivos. Organiza pasos cortos para sostener continuidad y reducir dispersion.',
    'transit:mars|trigono|pluto':
      'Marte en trigono con Pluton amplifica determinacion, profundidad y capacidad de cambio estrategico. Esta fase tiende a favorecer decisiones estructurales cuando accion y criterio van juntos. Dirige intensidad a lo esencial y consolida resultados de largo plazo.',
    'transit:mars|trigono|saturn':
      'Marte en trigono con Saturno combina disciplina e iniciativa de forma eficiente. Este ciclo tiende a facilitar progreso sostenible cuando metodo y prioridad avanzan juntos. Avanza por etapas para reforzar consistencia.',
    'transit:mars|trigono|uranus':
      'Marte en trigono con Urano favorece innovacion practica sin exigir ruptura brusca. Esta fase tiende a abrir espacio para probar soluciones nuevas con buen control de riesgo. Experimenta con criterio y escala lo que demuestra utilidad.',
    'transit:mars|trigono|venus':
      'Marte en trigono con Venus favorece iniciativa afectiva y cooperacion en acuerdos importantes. Este ciclo tiende a facilitar acercamientos cuando deseo y reciprocidad estan equilibrados. Usa asertividad con tacto para fortalecer vinculos.',
    'transit:jupiter|conjuncao|meio_do_ceu':
      'Jupiter en conjuncion al Medio Cielo puede aumentar visibilidad y abrir espacio para crecimiento profesional. Este ciclo favorece reconocimiento cuando hay direccion clara, ejecucion constante y expectativas realistas. Evita prometer de mas y consolida avances por etapas.',
    'transit:jupiter|sextil|meio_do_ceu':
      'Jupiter en sextil al Medio Cielo facilita acuerdos e impulso para evolucion profesional. Esta fase suele favorecer expansion con estrategia y foco en prioridades. Decisiones pequenas y bien ejecutadas pueden generar impacto relevante a medio plazo.',
    'transit:jupiter|trigono|meio_do_ceu':
      'Jupiter en trigono al Medio Cielo mejora fluidez en metas publicas y profesionales. El reconocimiento es mas probable cuando calidad tecnica y comunicacion clara van juntas. Aprovecha la fase para crecimiento sostenible, sin exceso de confianza.',
    'transit:jupiter|conjuncao|neptune':
      'Jupiter en conjuncion con Neptuno amplifica imaginacion y vision de futuro, con riesgo de idealizacion cuando faltan criterios. Esta fase favorece inspiracion si conviertes percepcion sutil en objetivos concretos y verificables. Evita promesas amplias sin plan de ejecucion y manten revisiones objetivas.',
    'transit:jupiter|conjuncao|pluto':
      'Jupiter en conjuncion con Pluton intensifica ambicion de crecimiento y necesidad de reposicionamiento estrategico. Este ciclo suele apoyar avances relevantes cuando hay analisis profundo y foco de largo plazo. Dirige expansion a lo esencial y reduce movimientos por impulso de poder.',
    'transit:jupiter|conjuncao|saturn':
      'Jupiter en conjuncion con Saturno combina expansion y estructura en el mismo punto de decision. Esta fase favorece crecimiento consistente cuando vision amplia se une a metodo, plazo y gobernanza. Organiza prioridades por etapas para convertir oportunidad en resultado sostenible.',
    'transit:jupiter|conjuncao|uranus':
      'Jupiter en conjuncion con Urano acelera innovacion y apertura a nuevas direcciones. El periodo puede traer oportunidades fuera del patron y pide flexibilidad con gestion responsable del riesgo. Prueba caminos nuevos con criterio y validacion antes de escalar.',
    'transit:jupiter|oposicao|ascendente':
      'Jupiter en oposicion al Ascendente puede amplificar demandas relacionales y exposicion publica, tensionando el equilibrio personal. Esta fase pide ajustar expectativas entre lo que ofreces y lo que puedes sostener con calidad. Negocia limites con claridad para preservar cooperacion y consistencia.',
    'transit:jupiter|oposicao|mercury':
      'Jupiter en oposicion a Mercurio tiende a ampliar ideas y discurso, con riesgo de exceso de confianza en la interpretacion. Este ciclo favorece aprendizaje cuando vision amplia se equilibra con verificacion objetiva. Revisa premisas, simplifica mensajes y refina lo verdaderamente viable.',
    'transit:jupiter|oposicao|moon':
      'Jupiter en oposicion a la Luna puede aumentar oscilacion emocional y expectativa de respuesta inmediata. Esta fase pide moderacion afectiva para evitar exageraciones de ritmo y decision. Equilibra autocuidado interno con prioridades practicas de la rutina.',
    'transit:jupiter|oposicao|sun':
      'Jupiter en oposicion al Sol puede tensionar impulso de expansion con limites reales de energia y contexto. El periodo pide calibrar ambicion, agenda y recursos para mantener coherencia entre imagen y entrega. Un crecimiento mas estable surge de foco selectivo y ejecucion progresiva.',
    'transit:jupiter|oposicao|venus':
      'Jupiter en oposicion a Venus amplifica deseo de placer, concesion y expectativa de reciprocidad. Esta fase pide calibrar valor y medida para evitar excesos afectivos o financieros. Prioriza elecciones que sostengan equilibrio entre satisfaccion inmediata y sostenibilidad.',
    'transit:jupiter|oposicao|uranus':
      'Jupiter en oposicion a Urano puede traer giros rapidos entre entusiasmo y ruptura de plan. Este ciclo pide libertad con criterio para no cambiar consistencia por novedad constante. Haz ajustes estrategicos sin abandonar lo que ya sostiene resultados.',
    'transit:jupiter|oposicao|mars':
      'Jupiter en oposicion a Marte puede elevar ambicion y ritmo de accion mas alla de lo sostenible por el contexto. Este ciclo pide calibrar valentia con estrategia para evitar desgaste por exceso de impulso. Dirige energia a objetivos concretos con etapas y revision de avance.',
    'transit:jupiter|oposicao|meio_do_ceu':
      'Jupiter en oposicion al Medio Cielo puede tensionar visibilidad publica con equilibrio personal y limites practicos. Esta fase pide alinear proyeccion, entrega y capacidad real para sostener resultados de calidad. Ajustes de posicionamiento suelen funcionar mejor que movimientos bruscos.',
    'transit:jupiter|quadratura|meio_do_ceu':
      'Jupiter en cuadratura al Medio Cielo puede ampliar expectativas profesionales sin la misma proporcion de estructura operativa. El periodo pide revisar promesas, plazos y prioridades para evitar dispersion estrategica. El crecimiento mas solido llega con foco selectivo y ejecucion constante.',
    'transit:jupiter|ingress|house_6':
      'Jupiter en ingreso a Casa 6 amplifica oportunidades de mejora en rutina, organizacion y eficiencia diaria. Esta fase favorece ajustes de metodo cuando expansion y disciplina simple avanzan juntas. Pequenas mejoras acumuladas pueden generar impacto relevante a medio plazo.',
    'transit:jupiter|ingress|house_7':
      'Jupiter en ingreso a Casa 7 amplifica oportunidades de cooperacion, acuerdos e intercambios en vinculos importantes. Este ciclo favorece alianzas cuando expectativas y limites estan bien negociados. Prioriza reciprocidad concreta para convertir buena voluntad en resultados estables.',
    'transit:jupiter|ingress|house_8':
      'Jupiter en ingreso a Casa 8 amplifica temas de recursos compartidos, confianza y transformacion profunda. Esta fase favorece reorganizacion estrategica cuando hay transparencia y criterio en compromisos. Avanza con claridad sobre riesgos, responsabilidades y plazos.',
    'transit:jupiter|ingress|house_9':
      'Jupiter en ingreso a Casa 9 amplifica horizonte de aprendizaje, vision de mundo y planificacion de largo alcance. El periodo favorece estudio y expansion de repertorio cuando hay aplicacion practica. Convierte conocimiento nuevo en direccion ejecutable.',
    'transit:jupiter|ingress|house_12':
      'Jupiter en ingreso a Casa 12 amplifica procesos de cierre, sentido interno y reorganizacion silenciosa de prioridades. Esta fase favorece maduracion cuando introspeccion y practicidad cotidiana se combinan. Usa el periodo para limpiar excesos y preparar un nuevo ciclo con mayor claridad.',
    'transit:jupiter|oposicao|jupiter':
      'Jupiter en oposicion con Jupiter puede ampliar extremos entre confianza y exceso de expectativa. Esta fase pide calibrar ambicion con criterio para evitar promesas por encima de la capacidad real de entrega. Un crecimiento mas estable llega con foco selectivo y revision realista de metas.',
    'transit:jupiter|quadratura|jupiter':
      'Jupiter en cuadratura con Jupiter tiende a tensionar expansion, ritmo y decisiones de riesgo. El ciclo puede activar aceleracion en demasiados frentes a la vez y bajar calidad de ejecucion. Prioriza lo esencial y avanza por bloques para sostener resultados consistentes.',
    'transit:jupiter|quadratura|mercury':
      'Jupiter en cuadratura con Mercurio puede aumentar dispersion mental y confianza excesiva en conclusiones rapidas. Esta fase pide revisar premisas, simplificar mensajes y verificar hechos antes de decidir. Usa vision amplia con metodo para reducir ruido estrategico.',
    'transit:jupiter|quadratura|pluto':
      'Jupiter en cuadratura con Pluton intensifica ambicion y puede empujar movimientos de todo o nada. Este ciclo pide estrategia de largo plazo para evitar desgaste por exceso de fuerza. Dirige crecimiento a cambios estructurales con gobernanza clara.',
    'transit:jupiter|quadratura|saturn':
      'Jupiter en cuadratura con Saturno activa conflicto entre impulso de expansion y limites operativos reales. Esta fase pide ajustar alcance, plazos y recursos para mantener consistencia. Equilibrar audacia y disciplina suele producir progreso mas sostenible.',
    'transit:jupiter|quadratura|sun':
      'Jupiter en cuadratura al Sol puede inflar expectativas de rendimiento y exposicion mas alla de un ritmo saludable. El ciclo pide calibrar protagonismo con capacidad real de ejecucion. Enfocate en impacto concreto sin dispersar energia.',
    'transit:jupiter|quadratura|uranus':
      'Jupiter en cuadratura con Urano puede alternar entusiasmo y ruptura de plan en poco tiempo. Esta fase pide libertad con criterio para no cambiar consistencia por novedad permanente. Innova por iteracion y valida cada ajuste antes de escalar.',
    'transit:jupiter|sextil|ascendente':
      'Jupiter en sextil al Ascendente favorece confianza social, apertura de contactos y presencia mas receptiva. El ciclo suele apoyar oportunidades cuando postura y limites estan claros. Usa la fase para ampliar alcance con autenticidad y medida.',
    'transit:jupiter|sextil|jupiter':
      'Jupiter en sextil con Jupiter favorece expansion gradual y mejor lectura de oportunidad. El periodo suele ser productivo para estudio, estrategia y reposicionamiento de medio plazo. Crece con planificacion para consolidar ganancias duraderas.',
    'transit:jupiter|sextil|mars':
      'Jupiter en sextil con Marte combina iniciativa y vision de crecimiento con menos friccion de ejecucion. Esta fase favorece accion orientada por prioridades y objetivos claros. Dirige energia a frentes de alto retorno y mant?n revisiones de avance.',
    'transit:jupiter|sextil|mercury':
      'Jupiter en sextil con Mercurio favorece comunicacion, aprendizaje y decisiones con mayor claridad de contexto. El ciclo apoya conversaciones estrategicas y organizacion practica de ideas. Aprovecha para destrabar temas pendientes con lenguaje objetivo.',
    'transit:jupiter|sextil|moon':
      'Jupiter en sextil con la Luna tiende a ampliar contencion emocional y lectura mas constructiva de situaciones. Esta fase favorece reconciliar sensibilidad y pragmatismo en la rutina. Pequenos ajustes diarios pueden traer alivio y estabilidad.',
    'transit:jupiter|sextil|neptune':
      'Jupiter en sextil con Neptuno favorece inspiracion con mayor potencial de aplicacion practica. Este ciclo suele apoyar vision de largo plazo cuando la intuicion se equilibra con criterio. Convierte percepciones en acciones verificables y ajusta rumbo con revision periodica.',
    'transit:jupiter|sextil|pluto':
      'Jupiter en sextil con Pluton favorece crecimiento con profundidad, foco estrategico y reposicionamiento consciente. Esta fase suele apoyar decisiones de impacto cuando evitas atajos y avanzas por etapas. Prioriza cambios estructurales que sostengan resultados duraderos.',
    'transit:jupiter|sextil|saturn':
      'Jupiter en sextil con Saturno combina expansion y disciplina en un ritmo productivo. Este ciclo suele facilitar avances cuando vision amplia se une a metodo, plazo y prioridad clara. Crece con criterio para consolidar ganancias sin sobrecarga.',
    'transit:jupiter|sextil|uranus':
      'Jupiter en sextil con Urano favorece innovacion con buen potencial de implementacion gradual. Esta fase suele abrir oportunidades fuera del patron sin exigir ruptura brusca. Prueba novedades con metricas simples y escala solo lo que demuestra utilidad.',
    'transit:jupiter|sextil|venus':
      'Jupiter en sextil con Venus favorece armonizacion en relaciones, acuerdos y decisiones de valor. Este ciclo suele ampliar cooperacion cuando reciprocidad y limites estan claros. Aprovecha el flujo para fortalecer vinculos y priorizar calidad de intercambio.',
    'transit:jupiter|trigono|ascendente':
      'Jupiter en trigono al Ascendente tiende a ampliar confianza social, visibilidad y apertura de caminos. Esta fase favorece expansion de presencia cuando autenticidad se combina con medida. Usa el impulso para consolidar una imagen coherente con tu entrega real.',
    'transit:jupiter|trigono|jupiter':
      'Jupiter en trigono con Jupiter favorece expansion amplia con mejor ritmo y perspectiva. Este ciclo suele apoyar aprendizaje, planeacion estrategica y crecimiento de medio plazo. Mantener criterio practico ayuda a convertir oportunidades en ganancias consistentes.',
    'transit:jupiter|trigono|mars':
      'Jupiter en trigono con Marte combina iniciativa y empuje con mayor fluidez de ejecucion. Esta fase suele apoyar accion afirmativa cuando prioridades y direccion son claras. Dirige energia a frentes de alto impacto y mant?n revision de progreso.',
    'transit:jupiter|trigono|mercury':
      'Jupiter en trigono con Mercurio favorece comunicacion, sintesis y decisiones con claridad de contexto. Este ciclo suele apoyar conversaciones relevantes y organizacion practica de ideas. Aprovecha la fase para alinear vision y ejecucion en lenguaje objetivo.',
    'transit:jupiter|trigono|moon':
      'Jupiter en trigono con la Luna tiende a aumentar integracion emocional y respuesta constructiva ante demandas cotidianas. Esta fase favorece bienestar cuando sensibilidad y pragmatismo se combinan. Pequenos ajustes pueden traer alivio estable y mayor equilibrio interno.',
    'transit:jupiter|trigono|neptune':
      'Jupiter en trigono con Neptuno favorece inspiracion, comprension simbolica y orientacion con sentido. Este ciclo suele apoyar percepcion sutil cuando se mantiene anclaje practico. Traduce intuicion en pasos concretos y sost?n chequeos de realidad periodicos.',
    'transit:jupiter|trigono|pluto':
      'Jupiter en trigono con Pluton favorece transformacion profunda con expansion estrategica y foco sostenido. Esta fase suele apoyar reposicionamientos de impacto cuando la accion es deliberada y estructural. Prioriza movimientos esenciales con consistencia de largo plazo.',
    'transit:jupiter|trigono|saturn':
      'Jupiter en trigono con Saturno favorece crecimiento consistente con base practica y buen criterio de tiempo. Este ciclo suele unir vision amplia y disciplina de ejecucion, facilitando avances con menos desgaste. Organiza prioridades por etapas para consolidar resultados sostenibles.',
    'transit:jupiter|trigono|uranus':
      'Jupiter en trigono con Urano favorece innovacion con adaptacion fluida y menor necesidad de ruptura brusca. Esta fase suele abrir oportunidades originales cuando pruebas con criterio y escalas con responsabilidad. Equilibra libertad y continuidad para mantener progreso tangible.',
    'transit:jupiter|trigono|venus':
      'Jupiter en trigono con Venus favorece armonizacion en vinculos, acuerdos y decisiones de valor cotidianas. Este ciclo suele ampliar cooperacion y buena voluntad cuando expectativas y limites estan claros. Aprovecha la fase para fortalecer intercambios de calidad con medida y constancia.',
    'transit:mars|conjuncao|ascendente':
      'Marte en conjuncion al Ascendente aumenta impulso de accion y necesidad de afirmacion personal. Esta fase suele favorecer iniciativa directa cuando ordenas prioridades y reduces reactividad. Canaliza energia en movimientos claros con foco y autocontrol.',
    'transit:mars|conjuncao|jupiter':
      'Marte en conjuncion con Jupiter amplifica coraje, ambicion y empuje de expansion. Este ciclo favorece avances cuando audacia y estrategia van juntas con ritmo realista. Ajusta velocidad y alcance para evitar exceso de confianza en la ejecucion.',
    'transit:mars|conjuncao|mars':
      'Marte en conjuncion con Marte intensifica energia de iniciativa y tono competitivo en la rutina. Esta fase suele aumentar urgencia de actuar y pedir disciplina para sostener consistencia. Dirige fuerza a metas objetivas y reduce desgaste impulsivo.',
    'transit:mars|conjuncao|mercury':
      'Marte en conjuncion con Mercurio acelera pensamiento, comunicacion y ritmo de decision. Este ciclo favorece objetividad cuando revisas premisas y aclaras mensajes. Evita conclusiones rapidas y mant?n criterio en conversaciones sensibles.',
    'transit:mars|conjuncao|moon':
      'Marte en conjuncion con la Luna puede elevar reactividad emocional y necesidad de respuesta inmediata. Esta fase pide equilibrio entre expresion afectiva y autocontrol para evitar conflictos innecesarios. Pausas breves antes de actuar ayudan a sostener claridad y vinculo.',
    'transit:mars|conjuncao|neptune':
      'Marte en conjuncion con Neptuno combina impulso de accion con imaginacion y sensibilidad amplias. Este ciclo favorece creatividad aplicada cuando la intuicion se ancla en pasos practicos. Refuerza criterio para no dispersar energia en metas difusas.',
    'transit:mars|conjuncao|pluto':
      'Marte en conjuncion con Pluton intensifica voluntad, profundidad estrategica y capacidad de romper patrones. Esta fase suele potenciar decisiones de impacto cuando hay direccion clara y autocontrol. Usa la intensidad con responsabilidad para evitar choques de poder.',
    'transit:mars|conjuncao|saturn':
      'Marte en conjuncion con Saturno combina fuerza de ejecucion y limite estructural en el mismo punto. Este ciclo puede pedir paciencia activa para transformar presion en progreso consistente. Avanza por etapas con metodo para reducir friccion y desperdicio.',
    'transit:mars|conjuncao|sun':
      'Marte en conjuncion al Sol refuerza protagonismo, iniciativa y voluntad de liderar tu agenda. Esta fase favorece accion afirmativa cuando intensidad y prioridad real se equilibran. Enfocate en lo esencial para convertir impulso en resultado concreto.',
    'transit:mars|conjuncao|uranus':
      'Marte en conjuncion con Urano acelera cambios y aumenta necesidad de libertad en la accion. Este ciclo puede abrir oportunidades fuera del patron, pidiendo respuesta rapida con criterio. Innova con seguridad para evitar rupturas por impulso.',
    'transit:mars|conjuncao|venus':
      'Marte en conjuncion con Venus amplifica magnetismo, deseo y necesidad de alinear afecto y accion. Esta fase favorece acercamientos cuando limites y expectativas estan claros. Equilibra intensidad con escucha para sostener calidad en los intercambios.',
    'transit:mars|oposicao|jupiter':
      'Marte en oposicion con Jupiter puede ampliar impulso de conquista mas alla de lo que el contexto soporta. Esta fase pide equilibrar coraje y criterio para evitar riesgo excesivo en ejecucion. Ajusta alcance y ritmo para sostener resultados de calidad.',
    'transit:mars|oposicao|mars':
      'Marte en oposicion con Marte tiende a activar disputa de ritmo, voluntad y direccion entre polos opuestos. Este ciclo pide regular intensidad para reducir friccion y desgaste energetico. Enfocate en objetivos comunes y evita confrontacion reactiva.',
    'transit:mars|oposicao|meio_do_ceu':
      'Marte en oposicion al Medio Cielo puede tensionar ambicion publica y estabilidad de la base personal. Esta fase pide alinear prioridades externas con capacidad real de energia y rutina. Reorganiza agenda y responsabilidades para mantener consistencia.',
    'transit:mars|oposicao|mercury':
      'Marte en oposicion con Mercurio puede aumentar prisa mental, debate reactivo y dificultad para escuchar. Este ciclo pide frenar conclusiones y mejorar argumentos antes de decidir. Comunicacion objetiva y pausas estrategicas reducen ruido y conflicto.',
    'transit:mars|oposicao|moon':
      'Marte en oposicion con la Luna puede elevar irritacion emocional y necesidad de respuesta inmediata en vinculos cercanos. Esta fase pide equilibrio entre firmeza y cuidado para evitar desgaste relacional. Regula ritmo interno antes de actuar en temas sensibles.',
    'transit:mars|oposicao|neptune':
      'Marte en oposicion con Neptuno puede alternar impulso y duda, con riesgo de dispersion en metas poco claras. Este ciclo pide convertir intuicion en un plan simple y verificable para sostener direccion realista. Evita actuar por impulso sin revisar contexto y prioridad.',
    'transit:mars|oposicao|pluto':
      'Marte en oposicion con Pluton intensifica dinamicas de poder, control y resistencia en procesos clave. Esta fase pide autocontrol para no convertir tension en confrontacion improductiva. Dirige fuerza a estrategia y ajuste estructural, no a escalada de conflicto.',
    'transit:mars|oposicao|saturn':
      'Marte en oposicion con Saturno puede generar sensacion de freno entre impulso de accion y limite operativo. Este ciclo pide paciencia activa, metodo y avance por etapas para reducir frustracion. La persistencia ordenada suele rendir mejor que la prisa.',
    'transit:mars|oposicao|sun':
      'Marte en oposicion al Sol puede tensionar protagonismo, autoridad y forma de afirmacion personal. Esta fase pide calibrar intensidad para sostener cooperacion sin perder firmeza. Actua con objetivo claro y menor necesidad de demostrar fuerza.',
    'transit:mars|oposicao|uranus':
      'Marte en oposicion con Urano puede traer giros rapidos e impulso de ruptura bajo presion. Este ciclo pide libertad con criterio para no cambiar estrategia por reaccion inmediata. Ajustes veloces funcionan mejor cuando existe plan de contingencia.',
    'transit:mars|oposicao|venus':
      'Marte en oposicion con Venus puede aumentar polaridad entre deseo, afecto y modo de negociar cercania. Esta fase pide alinear expectativas y limites para evitar oscilacion entre acercamiento y conflicto. Escucha activa y acuerdos claros fortalecen la calidad del vinculo.',
    'transit:mars|quadratura|ascendente':
      'Marte en cuadratura al Ascendente puede aumentar irritacion, prisa y friccion de postura en interacciones. Esta fase pide ajustar forma de afirmarte para sostener claridad sin escalar conflicto. Actua con objetivo y reduce reaccion automatica.',
    'transit:mars|quadratura|jupiter':
      'Marte en cuadratura con Jupiter tiende a ampliar impulso y riesgo mas alla de lo que el contexto sostiene. Este ciclo pide calibrar ambicion con criterio para evitar apuestas excesivas en ejecucion. Prioriza metas centrales y avanza por bloques verificables.',
    'transit:mars|quadratura|mars':
      'Marte en cuadratura con Marte intensifica friccion entre voluntad, ritmo y direccion de accion. Esta fase puede elevar competitividad y desgaste cuando no hay coordinacion de prioridades. Usa enfoque disciplinado para convertir tension en productividad.',
    'transit:mars|quadratura|mercury':
      'Marte en cuadratura con Mercurio puede acelerar habla y pensamiento con menor escucha y precision. Este ciclo pide revisar argumentos y reducir conclusiones por impulso. Comunicacion simple y validacion de hechos reducen ruido y retrabajo.',
    'transit:mars|quadratura|moon':
      'Marte en cuadratura con la Luna puede elevar oscilacion emocional y respuesta defensiva en temas sensibles. Esta fase pide regular reactividad antes de decidir o confrontar. Pausas cortas y rutina de soporte ayudan a sostener equilibrio.',
    'transit:mars|quadratura|neptune':
      'Marte en cuadratura con Neptuno puede mezclar urgencia e indefinicion, generando dispersion de energia. Este ciclo pide convertir intuicion en plan concreto con etapas breves. Evita actuar sin revisar objetivo, contexto y limite real.',
    'transit:mars|quadratura|pluto':
      'Marte en cuadratura con Pluton intensifica tension de poder, control y fuerza de voluntad. Esta fase pide autocontrol para no convertir presion en confrontacion improductiva. Dirige intensidad a ajuste estructural y estrategia consistente.',
    'transit:mars|quadratura|saturn':
      'Marte en cuadratura con Saturno puede traer frustracion entre impulso de accion y restriccion operativa. Este ciclo pide paciencia activa, metodo y ritmo sostenible para reducir desgaste. El progreso por etapas suele rendir mejor que la prisa.',
    'transit:mars|quadratura|sun':
      'Marte en cuadratura al Sol puede tensionar protagonismo, autoridad y forma de liderar accion. Esta fase pide equilibrio entre firmeza y cooperacion para mantener eficiencia. Enfocate en entrega objetiva con menos disputa de ego.',
    'transit:mars|quadratura|uranus':
      'Marte en cuadratura con Urano puede traer rupturas de ritmo e impulso de cambio abrupto. Este ciclo pide innovar con criterio para evitar decisiones reactivas. Ajustes progresivos con plan de contingencia preservan resultados.',
    'transit:mars|quadratura|venus':
      'Marte en cuadratura con Venus puede tensionar deseo, afecto y expectativa de reciprocidad. Esta fase pide alinear limites y negociacion clara para evitar oscilacion relacional. Escucha activa y acuerdos simples mejoran la calidad del vinculo.',
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
    'transit:jupiter|conjuncao|ascendente':
      'Jupiter en conjuncion al Ascendente puede ampliar presencia, confianza y disposicion para iniciar movimientos personales. Esta fase favorece visibilidad cuando entusiasmo y direccion clara van juntos. Evita prometer de mas y alinea imagen con entrega real.',
    'transit:jupiter|conjuncao|jupiter':
      'Jupiter en conjuncion con Jupiter marca una ventana de expansion y reposicionamiento de vision. Este ciclo favorece crecimiento cuando metas amplias se convierten en pasos practicos. Prioriza oportunidades alineadas con tu capacidad actual.',
    'transit:jupiter|conjuncao|mars':
      'Jupiter en conjuncion con Marte aumenta iniciativa, valentia e impulso para acelerar decisiones. Esta fase suele rendir mejor con foco tactico y control del ritmo. Canaliza energia en objetivos concretos para evitar dispersion por exceso de accion.',
    'transit:jupiter|conjuncao|mercury':
      'Jupiter en conjuncion con Mercurio amplia repertorio mental, aprendizaje y capacidad de comunicar ideas. El periodo favorece estudio, acuerdos y planificacion con vision mas amplia. Estructura argumentos con claridad para convertir intuicion en resultado util.',
    'transit:jupiter|conjuncao|sun':
      'Jupiter en conjuncion al Sol fortalece confianza, direccion y apertura a nuevos ciclos de crecimiento. Esta fase apoya protagonismo cuando intencion y practica se mantienen coherentes. Usa la visibilidad con criterio para consolidar avances reales.',
    'transit:jupiter|conjuncao|venus':
      'Jupiter en conjuncion con Venus favorece armonizacion de vinculos, valores y decisiones de bienestar. Este ciclo tiende a ampliar oportunidades afectivas y financieras cuando hay reciprocidad y limites claros. Aprovecha el flujo con moderacion para sostener calidad a largo plazo.',
    'transit:jupiter|ingress|house_1':
      'Jupiter en ingreso a Casa 1 inaugura una fase de expansion personal, con mas iniciativa y deseo de reposicionamiento. El periodo favorece cambios de postura, imagen y direccion de vida con horizonte mas amplio. Avanza con autenticidad y foco sostenible.',
    'transit:jupiter|ingress|house_3':
      'Jupiter en ingreso a Casa 3 amplia comunicacion, aprendizaje e intercambios con el entorno cercano. Esta fase favorece estudios, conversaciones estrategicas y circulacion de ideas con mayor alcance. Organiza prioridades para transformar informacion en decisiones utiles.',
    'transit:jupiter|ingress|house_5':
      'Jupiter en ingreso a Casa 5 aumenta creatividad, expresion personal y apertura a experiencias placenteras. El ciclo favorece proyectos de autoria, romances e iniciativas autenticas. Usa entusiasmo con criterio para mantener continuidad y calidad.',
    'transit:jupiter|ingress|house_10':
      'Jupiter en ingreso a Casa 10 tiende a abrir una fase de crecimiento en carrera, reputacion y objetivos publicos. Esta ventana favorece avances cuando vision estrategica y ejecucion constante van juntas. Prioriza entregas clave y consolida autoridad con resultados observables.',
    'transit:saturn|conjuncao|ascendente':
      'Saturno en conjuncion al Ascendente marca una fase de reposicionamiento personal con mayor sobriedad y responsabilidad. Este ciclo pide revisar postura, limites y forma de presentarte en lo cotidiano. Consolida decisiones de largo plazo con disciplina y constancia.',
    'transit:saturn|conjuncao|meio_do_ceu':
      'Saturno en conjuncion al Medio Cielo tiende a concentrar foco en carrera, reputacion y compromisos publicos. La fase favorece estructurar metas cuando la entrega es constante y el criterio es claro. Prioriza lo esencial y fortalece autoridad con resultados concretos.',
    'transit:saturn|conjuncao|sun':
      'Saturno en conjuncion al Sol puede aumentar exigencia interna y necesidad de reorganizar direccion personal. Este ciclo pide madurez, foco en lo esencial y ritmo sostenible para consolidar avances. Trabaja con metas realistas y ejecucion diaria consistente.',
    'transit:saturn|conjuncao|moon':
      'Saturno en conjuncion con Luna tiende a traer sobriedad emocional y revision de necesidades de seguridad. La fase pide reforzar rutina de cuidado, limites y estabilidad afectiva en lo cotidiano. Ajustes pequenos y constantes ayudan a reducir sobrecarga interna.',
    'transit:saturn|conjuncao|mercury':
      'Saturno en conjuncion con Mercurio aumenta exigencia mental, foco y necesidad de ordenar el pensamiento con metodo. El ciclo favorece estudio disciplinado, revision de premisas y comunicacion objetiva. Organiza informacion por prioridad antes de decidir.',
    'transit:saturn|conjuncao|venus':
      'Saturno en conjuncion con Venus puede pedir madurez en vinculos, valores y decisiones de bienestar. Esta fase favorece definir reciprocidad y limites claros para proteger lo que tiene calidad real. Invierte en lo consistente y evita idealizacion o exceso.',
    'transit:saturn|conjuncao|mars':
      'Saturno en conjuncion con Marte combina impulso de accion con necesidad de tecnica y control de ritmo. El ciclo pide eficiencia, constancia y menor reactividad para preservar energia. Canaliza fuerza en etapas definidas y objetivos verificables.',
    'transit:saturn|conjuncao|saturn':
      'Saturno en conjuncion con Saturno marca un ciclo de maduracion estructural y revision de responsabilidades centrales. Esta fase pide simplificar prioridades, recalibrar metas y sostener lo que realmente importa. Decisiones consistentes ahora fortalecen el largo plazo.',
    'transit:saturn|ingress|house_1':
      'Saturno en ingreso a Casa 1 inicia una fase de redefinicion personal con mas disciplina y responsabilidad. El periodo favorece consolidar identidad y direccion mediante elecciones concretas en lo cotidiano. Avanza con constancia y limites saludables.',
    'transit:saturn|ingress|house_3':
      'Saturno en ingreso a Casa 3 pide ordenar rutina mental, comunicacion y estudio con metodo. Esta fase favorece aprendizaje consistente, acuerdos objetivos y menos dispersion. Estructura agenda y mensajes para ganar claridad practica.',
    'transit:saturn|ingress|house_5':
      'Saturno en ingreso a Casa 5 puede traer madurez para creatividad, romances y expresion personal. El ciclo favorece calidad y continuidad cuando hay compromiso con el proceso y limites claros. Construye disfrute con responsabilidad e intencion.',
    'transit:uranus|conjuncao|moon':
      'Urano en conjuncion con Luna tiende a intensificar necesidad de libertad emocional y actualizacion de habitos afectivos. Esta fase puede traer oscilacion de humor y cambios inesperados en la rutina. Regula el ritmo interno y ajusta soporte de forma gradual.',
    'transit:uranus|conjuncao|mercury':
      'Urano en conjuncion con Mercurio amplia inquietud mental, ideas nuevas y deseo de revisar certezas rapidamente. El ciclo favorece innovacion intelectual cuando existe metodo para priorizar lo esencial. Convierte intuicion en experimentos practicos y medibles.',
    'transit:uranus|conjuncao|venus':
      'Urano en conjuncion con Venus puede acelerar revision de vinculos, valores y decisiones de placer. Esta fase favorece autenticidad y nuevos formatos de intercambio cuando hay limites claros. Innova con consciencia para sostener reciprocidad y estabilidad.',
    'transit:uranus|conjuncao|mars':
      'Urano en conjuncion con Marte aumenta impulso de accion, urgencia de cambio y respuesta rapida a limites. El ciclo funciona mejor cuando energia se canaliza con estrategia y foco objetivo. Reduce reactividad y ejecuta en pasos cortos validados.',
    'transit:uranus|conjuncao|jupiter':
      'Urano en conjuncion con Jupiter tiende a ampliar vision de futuro con fuerte deseo de experimentacion. Esta fase favorece oportunidades nuevas cuando el riesgo esta calibrado con criterio. Crece por iteracion, no por apuestas extremas.',
    'transit:uranus|conjuncao|uranus':
      'Urano en conjuncion con Urano marca un ciclo de renovacion estructural de identidad y direccion de vida. La fase puede pedir reposicionamiento profundo hacia autenticidad actual. Avanza con flexibilidad y base practica.',
    'transit:uranus|ingress|house_1':
      'Urano en ingreso a Casa 1 inicia fase de reposicionamiento personal, autonomia y cambio de postura. El periodo favorece actualizar identidad y forma de actuar con mayor autenticidad. Renueva presencia sin perder consistencia.',
    'transit:uranus|ingress|house_3':
      'Urano en ingreso a Casa 3 amplia movimiento mental, intercambio de ideas y revision de patrones de comunicacion. La fase favorece aprendizaje rapido y nuevos formatos de conexion local. Organiza flujo de informacion para evitar dispersion.',
    'transit:uranus|ingress|house_5':
      'Urano en ingreso a Casa 5 puede abrir una fase mas libre de creatividad, con cambios en placer y expresion personal. El ciclo favorece probar lenguajes nuevos con intencion autentica. Innova manteniendo responsabilidad afectiva y continuidad.',
    'transit:uranus|ingress|house_10':
      'Urano en ingreso a Casa 10 tiende a abrir un punto de giro en carrera, reputacion y direccion publica. La fase favorece actualizacion profesional cuando audacia y estrategia van juntas. Reposiciona metas y prueba nuevas rutas con metricas objetivas.',
  
    'transit:neptune|ingress|house_1':
      'Neptuno en ingreso a Casa 1 puede aumentar sensibilidad en identidad, limites y direccion personal. Esta fase pide mayor claridad en decisiones de imagen para que inspiracion no derive en confusion. Sostener rutina simple y referencias concretas ayuda a mantener coherencia.',
    'transit:neptune|ingress|house_3':
      'Neptuno en ingreso a Casa 3 puede ampliar imaginacion, lectura simbolica y comunicacion subjetiva. El ciclo pide mayor discernimiento con mensajes, suposiciones e interpretaciones. Organiza flujo de informacion y confirma datos clave antes de decidir.',
    'transit:neptune|ingress|house_5':
      'Neptuno en ingreso a Casa 5 puede intensificar creatividad, idealizacion romantica y proyeccion afectiva. Esta fase favorece expresion artistica cuando las expectativas se mantienen realistas. Usa inspiracion con limites practicos para sostener continuidad.',
    'transit:neptune|ingress|house_10':
      'Neptuno en ingreso a Casa 10 puede activar preguntas sobre vocacion, sentido y posicion publica. El periodo favorece alineacion de proposito, pero pide realismo en metas y exposicion. Valida direccion con hitos observables y acuerdos claros.',
    'transit:neptune|conjuncao|sun':
      'Neptuno en conjuncion con Sol puede ampliar sensibilidad, imaginacion y busqueda de sentido en la direccion personal. Esta fase pide referencias claras de identidad para que inspiracion no diluya el foco. Mant?n compromisos realistas y revisa supuestos antes de decisiones mayores.',
    'transit:neptune|conjuncao|moon':
      'Neptuno en conjuncion con Luna puede elevar permeabilidad emocional, empatia y lectura subjetiva del entorno. El ciclo pide limites afectivos y rutina clara para evitar sobrecarga o confusion. Descanso, enraizamiento y comunicacion directa ayudan a estabilizar.',
    'transit:neptune|conjuncao|mercury':
      'Neptuno en conjuncion con Mercurio puede ampliar pensamiento simbolico e intuicion, reduciendo precision mental. Esta fase pide cuidado en comunicacion y verificacion de hechos antes de concluir. Escribe prioridades con claridad y evita decidir solo por impresion.',
    'transit:neptune|conjuncao|venus':
      'Neptuno en conjuncion con Venus puede aumentar idealizacion en vinculos, valores y decisiones de placer. El ciclo favorece sensibilidad y refinamiento cuando reciprocidad y limites son explicitos. Observa se?ales concretas antes de compromisos afectivos o financieros.',
    'transit:neptune|conjuncao|mars':
      'Neptuno en conjuncion con Marte puede difuminar iniciativa, ritmo y uso de fuerza en la accion. Esta fase pide cadencia intencional, prioridades claras y ejecucion disciplinada. Canaliza energia en pocos objetivos esenciales para reducir dispersion.',
    'transit:neptune|conjuncao|jupiter':
      'Neptuno en conjuncion con Jupiter puede ampliar vision y espiritualidad, con riesgo de expectativa excesiva. El periodo pide equilibrar confianza con realismo para que la expansion sea sostenible. Mant?n planes anclados en evidencia, timing y recursos.',
    'transit:neptune|conjuncao|saturn':
      'Neptuno en conjuncion con Saturno puede poner a prueba estructuras al confrontar certeza con sensibilidad y ambiguedad. Esta fase pide planificacion flexible y criterio claro para evitar rigidez o evasi?n. Reconstruye bases gradualmente con controles realistas.',
    'transit:neptune|conjuncao|neptune':
      'Neptuno en conjuncion con Neptuno marca un reajuste de ciclo largo en sentido, intuicion y proyeccion. La fase puede disolver referencias antiguas y pedir formas mas sutiles de orientacion. Conserva anclajes practicos mientras reorganizas vision interna.',
    'transit:neptune|conjuncao|ascendente':
      'Neptuno en conjuncion al Ascendente puede volver mas porosos los limites personales y cambiar la percepcion de tu presencia. Esta fase pide coherencia entre imagen, intencion y accion concreta. Aclara limites y comunica expectativas para reducir ruido.',

    // ── Mars completion ────────────────────────────────────────────────────
    'transit:mars|sextil|sun':
      'Marte en sextil al Sol favorece iniciativa con lectura clara de direccion personal y energia disponible. Este ciclo tiende a apoyar accion enfocada cuando voluntad y prioridad real estan integradas. Usa el momento para avanzar objetivos concretos con objetividad.',
    'transit:mars|sextil|meio_do_ceu':
      'Marte en sextil al Medio Cielo favorece iniciativa profesional con buen ritmo y alineacion de direccion. Este ciclo tiende a apoyar movimientos estrategicos cuando el foco esta en metas de visibilidad. Ejecuta por prioridad y rastrea avance con criterios claros.',
    'transit:mars|trigono|sun':
      'Marte en trigono al Sol refuerza flujo entre iniciativa y sentido de direccion. Esta fase tiende a favorecer avance con menos reactividad y mas intencion consciente. Concentra en lo esencial y consolida resultados con consistencia.',
    'transit:mars|trigono|meio_do_ceu':
      'Marte en trigono al Medio Cielo amplia disposicion para actuar sobre metas profesionales con buen manejo de energia. Esta fase apoya avance profesional cuando la direccion es clara y consistente. Consolida resultados ejecutando en etapas objetivas.',
    'transit:mars|oposicao|ascendente':
      'Marte en oposicion al Ascendente puede elevar tension de postura e impulso confrontacional en interacciones diarias. Esta fase pide regular intensidad para preservar objetividad sin perder firmeza. Actua con intencion clara y reduce reacciones automaticas.',
    'transit:mars|ingress|house_1':
      'Marte en ingreso en la Casa 1 aumenta energia personal, iniciativa y necesidad de afirmar tu propia direccion. Esta fase favorece avance cuando foco y control de ritmo previenen impulsividad. Ejecuta por prioridades y monitorea niveles de energia.',
    'transit:mars|ingress|house_2':
      'Marte en ingreso en la Casa 2 intensifica el impulso de actuar sobre recursos, valores y seguridad material. Este periodo puede traer urgencia para resolver asuntos financieros o materiales con mas fuerza. Canaliza energia en ajustes practicos con criterios de riesgo claros.',
    'transit:mars|ingress|house_3':
      'Marte en ingreso en la Casa 3 acelera comunicacion, estudio y movimiento local. Esta fase puede traer discurso mas asertivo, con riesgo de impaciencia en tono. Canaliza energia en conversaciones productivas y evita respuestas impulsivas.',
    'transit:mars|ingress|house_5':
      'Marte en ingreso en la Casa 5 aumenta energia creativa, impulso expresivo y disposicion para proyectos personales. Este ciclo favorece iniciativa cuando el foco esta organizado y el riesgo afectivo es moderado. Canaliza impulso en creacion con continuidad.',
    'transit:mars|ingress|house_6':
      'Marte en ingreso en la Casa 6 aumenta disposicion para atender pendientes y reorganizar rutinas de trabajo. Este periodo favorece eficiencia cuando metodo y prioridades estan bien definidos. Evita sobrecarga excesiva y rastrea energia disponible.',
    'transit:mars|ingress|house_7':
      'Marte en ingreso en la Casa 7 intensifica dinamicas de asociacion, negociacion y alineacion de limites en relaciones. Este ciclo puede traer mas asertividad en acuerdos, con riesgo de friccion si falta escucha. Ajusta postura para preservar cooperacion sin bajar firmeza.',
    'transit:mars|ingress|house_8':
      'Marte en ingreso en la Casa 8 intensifica impulso de atender recursos compartidos, confianza y transformacion interna. Esta fase favorece accion sobre asuntos profundos pendientes cuando hay criterio y transparencia. Avanza con cuidado y evita confrontaciones por fuerza.',
    'transit:mars|ingress|house_9':
      'Marte en ingreso en la Casa 9 amplia iniciativa de estudiar, planificar y ampliar perspectiva de largo alcance. Este periodo favorece accion en proyectos de educacion o expansion cuando los objetivos son claros. Usa energia para traducir vision en planes concretos.',
    'transit:mars|ingress|house_11':
      'Marte en ingreso en la Casa 11 aumenta disposicion para actuar en redes, proyectos colectivos y metas futuras. Esta fase favorece liderazgo en colaboraciones cuando foco y reciprocidad real estan presentes. Canaliza energia en alianzas con proposito y retorno concreto.',
    'transit:mars|ingress|house_12':
      'Marte en ingreso en la Casa 12 puede activar impulso interno de resolver asuntos antiguos y organizar procesos de cierre. Este ciclo favorece accion tranquila y preparatoria cuando hay criterio y descanso adecuado. Evita apresurar y respeta el ritmo de recuperacion.',

    // ── Mercury sextil ────────────────────────────────────────────────────
    'transit:mercury|sextil|sun':
      'Mercurio en sextil al Sol favorece integracion entre claridad mental y sentido de direccion. Esta fase tiende a apoyar decisiones y comunicaciones alineadas con prioridades reales. Usa el momento para organizar mensajes clave y avanzar con consistencia.',
    'transit:mercury|sextil|moon':
      'Mercurio en sextil con Luna facilita traduccion de emocion en lenguaje claro y adaptable en la vida diaria. Este ciclo tiende a apoyar conversaciones cuidadosas con mas objetividad. Usa el momento para nombrar necesidades y ajustar expectativas con escucha activa.',
    'transit:mercury|sextil|mercury':
      'Mercurio en sextil con Mercurio favorece fluidez mental, revision de ideas y conexiones rapidas de informacion. Esta fase tiende a apoyar estudio, escritura y organizacion de procesos con mas agilidad. Aprovecha para desbloquear pendientes con lenguaje objetivo.',
    'transit:mercury|sextil|venus':
      'Mercurio en sextil con Venus favorece diplomacia, expresion de valores y conversacion con elegancia relacional. Este ciclo tiende a facilitar acuerdos cuando forma y contenido estan equilibrados. Usa esta fase para reforzar intercambios con amabilidad sin perder asertividad.',
    'transit:mercury|sextil|mars':
      'Mercurio en sextil con Marte favorece decisiones rapidas, argumentacion asertiva y comunicacion objetiva. Este ciclo tiende a apoyar negociaciones cuando el foco es claro y la escucha esta activa. Avanza con claridad en conversaciones estrategicas y evita respuestas apresuradas.',
    'transit:mercury|sextil|jupiter':
      'Mercurio en sextil con Jupiter favorece vision de contexto amplia con criterios de detalle accesibles. Este ciclo tiende a apoyar aprendizaje y planificacion cuando optimismo es balanceado con rigor. Traduce ideas amplias en planes verificables con etapas claras.',
    'transit:mercury|sextil|saturn':
      'Mercurio en sextil con Saturno favorece organizacion de informacion, estructura de argumentos y comunicacion clara. Esta fase tiende a apoyar decisiones cuando metodo y practica van juntos. Estructura pendientes por relevancia y avanza con criterios verificables.',
    'transit:mercury|sextil|uranus':
      'Mercurio en sextil con Urano favorece innovacion en ideas y apertura a nuevas conexiones de informacion. Este ciclo tiende a apoyar creatividad cuando curiosidad y foco operativo estan activos. Testa enfoques nuevos antes de escalar y mantien continuidad en proyectos clave.',
    'transit:mercury|sextil|neptune':
      'Mercurio en sextil con Neptuno favorece intuicion, lectura simbolica y conexion entre logica y sensibilidad. Esta fase tiende a apoyar creatividad e insight cuando hay verificacion practica de datos. Documenta percepciones relevantes y contrasta con evidencia antes de concluir.',
    'transit:mercury|sextil|pluto':
      'Mercurio en sextil con Pluton favorece profundidad analitica, revision de supuestos y precision en investigacion. Este ciclo tiende a apoyar toma de decision estrategica cuando rigor y apertura coexisten. Usa el periodo para revisar temas complejos con metodo y enfoque claro.',
    'transit:mercury|sextil|ascendente':
      'Mercurio en sextil al Ascendente favorece comunicacion personal fluida y posicionamiento mas claro. Esta fase tiende a apoyar conversaciones, presentaciones y ajustes de imagen con agilidad. Organiza mensajes y usa el periodo para reforzar coherencia entre expresion e intencion.',
    'transit:mercury|sextil|meio_do_ceu':
      'Mercurio en sextil al Medio Cielo favorece comunicacion estrategica y posicionamiento profesional con mas fluidez. Esta fase tiende a apoyar visibilidad cuando narrativa y entrega estan alineadas. Organiza mensajes clave y mantien consistencia en la comunicacion publica.',

    // ── Mercury trigono ───────────────────────────────────────────────────
    'transit:mercury|trigono|sun':
      'Mercurio en trigono al Sol refuerza fluidez entre pensamiento y sentido de direccion personal. Esta fase tiende a favorecer comunicacion con mas intencion y menos friccion. Usa el periodo para organizar ideas prioritarias y articular direccion con claridad.',
    'transit:mercury|trigono|moon':
      'Mercurio en trigono con Luna favorece integracion natural entre pensamiento y sensibilidad emocional. Este ciclo tiende a apoyar conversaciones con mayor empatia y comprension mutua. Aprovecha la facilidad del periodo para nombrar lo que importa con calma.',
    'transit:mercury|trigono|mercury':
      'Mercurio en trigono con Mercurio facilita fluidez mental, memoria y procesamiento de informacion con menos friccion. Esta fase tiende a apoyar aprendizaje, escritura y revision de criterios con buen ritmo. Organiza prioridades y avanza en pendientes intelectuales con metodo.',
    'transit:mercury|trigono|venus':
      'Mercurio en trigono con Venus favorece comunicacion armonizadora, diplomacia y expresion de afecto con elegancia. Este ciclo tiende a facilitar conversaciones afectivas o de valor con mas fluidez. Aprovecha el periodo para fortalecer vinculos con claridad y cuidado mutuo.',
    'transit:mercury|trigono|mars':
      'Mercurio en trigono con Marte favorece comunicacion asertiva con buen ritmo y eficiencia de ejecucion. Esta fase tiende a apoyar conversaciones productivas cuando pensamiento y accion van alineados. Avanza en negociaciones y decisiones con claridad y foco operativo.',
    'transit:mercury|trigono|jupiter':
      'Mercurio en trigono con Jupiter favorece vision estrategica, expansion de ideas y fluidez en aprendizaje. Este ciclo tiende a apoyar planificacion cuando amplitud de perspectiva va con criterio de detalle. Traduce insight en planes con etapas verificables y realistas.',
    'transit:mercury|trigono|saturn':
      'Mercurio en trigono con Saturno favorece pensamiento estructurado, planificacion clara y decisiones con criterio solido. Esta fase tiende a apoyar organizacion y documentacion con mayor precision. Consolida aprendizajes y avanza en responsabilidades con metodo firme.',
    'transit:mercury|trigono|uranus':
      'Mercurio en trigono con Urano facilita apertura a ideas nuevas y conexiones inesperadas con enfoque productivo. Este ciclo tiende a apoyar creatividad cuando innovacion y continuidad se equilibran. Testa perspectivas originales y documenta aprendizajes antes de escalar.',
    'transit:mercury|trigono|neptune':
      'Mercurio en trigono con Neptuno favorece imaginacion, intuicion y lectura sutil de contextos. Esta fase tiende a apoyar expresion creativa cuando verificacion de datos es parte del proceso. Documenta insights con precision para separar percepcion de evidencia.',
    'transit:mercury|trigono|pluto':
      'Mercurio en trigono con Pluton favorece profundidad de analisis, revision de supuestos y toma de decision estrategica. Este ciclo tiende a apoyar investigacion y comunicacion con mas poder de conviccion. Usa el periodo para profundizar en temas clave con rigor y apertura.',
    'transit:mercury|trigono|ascendente':
      'Mercurio en trigono al Ascendente favorece comunicacion personal fluida, presentaciones claras y posicionamiento efectivo. Esta fase tiende a facilitar expresion autentica con buen impacto en el entorno. Usa el periodo para articular mensajes prioritarios con coherencia y precision.',
    'transit:mercury|trigono|meio_do_ceu':
      'Mercurio en trigono al Medio Cielo favorece comunicacion estrategica fluida y construccion de narrativa profesional. Esta fase tiende a facilitar visibilidad cuando imagen y entrega estan bien alineadas. Mantien mensajes simples, consistentes y orientados a resultados.',

    // ── Mercury oposicao ──────────────────────────────────────────────────
    'transit:mercury|oposicao|sun':
      'Mercurio en oposicion al Sol puede tensionar intencion y forma de comunicar direccion, generando ruido entre plan y ejecucion. El periodo pide revisar premisas y alinear mensaje central antes de decisiones importantes. Simplifica narrativa y valida prioridades con claridad.',
    'transit:mercury|oposicao|moon':
      'Mercurio en oposicion con Luna puede ampliar conflicto entre necesidad emocional y comunicacion objetiva. El ciclo pide cuidado con mensajes impulsivos e interpretaciones precipitadas en el cotidiano. Pausa, organiza lo que sientes y comunica con mas calma y precision.',
    'transit:mercury|oposicao|mercury':
      'Mercurio en oposicion con Mercurio puede activar divergencia de referencias, ritmo de razonamiento y criterios de decision. La fase pide revisar premisas con metodo para evitar retrabajos por ruido comunicacional. Valida interpretaciones clave antes de cerrar acuerdos.',
    'transit:mercury|oposicao|venus':
      'Mercurio en oposicion con Venus puede tensionar diplomacia y franqueza en conversaciones afectivas o de valor. El ciclo pide equilibrar forma y contenido para preservar vinculo sin omitir puntos esenciales. Ajusta expectativa y lenguaje para sostener reciprocidad.',
    'transit:mercury|oposicao|mars':
      'Mercurio en oposicion con Marte puede aumentar velocidad de habla y argumentacion con caida de escucha y precision. La fase pide cuidado con respuestas reactivas y conclusiones precipitadas en conversaciones sensibles. Confirma hechos, simplifica mensajes y avanza con objetividad.',
    'transit:mercury|oposicao|jupiter':
      'Mercurio en oposicion con Jupiter puede ampliar discurso y vision amplia con menos criterio de verificacion de detalle. El ciclo pide equilibrar entusiasmo de idea con chequeo practico antes de decidir. Simplifica y prioriza lo que es realmente viable ahora.',
    'transit:mercury|oposicao|saturn':
      'Mercurio en oposicion con Saturno puede tensionar ritmo mental y forma de comunicar con mayor exigencia estructural. La fase pide metodo, paciencia y criterios explicitos para evitar trabamiento decisorio. Organiza argumentos y documenta acuerdos con calma.',
    'transit:mercury|oposicao|uranus':
      'Mercurio en oposicion con Urano puede traer oscilacion rapida de idea y tension entre innovacion y consistencia. El ciclo pide contener impulsos de ruptura comunicacional sin sofocar apertura a lo nuevo. Valida enfoques nuevos antes de escalar y mantien continuidad.',
    'transit:mercury|oposicao|neptune':
      'Mercurio en oposicion con Neptuno puede aumentar ambiguedad, suposiciones y falta de claridad en datos importantes. La fase pide confirmar hechos, fechas y responsabilidades con mas rigor antes de concluir. Documenta acuerdos por escrito y valida comprension reciproca.',
    'transit:mercury|oposicao|pluto':
      'Mercurio en oposicion con Pluton puede intensificar control narrativo, rigidez de punto de vista y tension en disputas de interpretacion. El ciclo pide rigor analitico sin confrontacion innecesaria. Enfoca en evidencia verificable y mantien apertura a la matiz.',
    'transit:mercury|oposicao|ascendente':
      'Mercurio en oposicion al Ascendente puede traer desencuentro de tono, expresion y lectura de contexto en interacciones cotidianas. La fase pide ajustar forma de comunicar para preservar claridad sin elevar tension innecesaria. Simplifica mensajes y confirma comprension mutua.',
    'transit:mercury|oposicao|meio_do_ceu':
      'Mercurio en oposicion al Medio Cielo puede tensionar comunicacion profesional y consistencia de posicionamiento publico. El periodo pide revisar narrativa, plazos y alineacion entre discurso y entrega. Ajustes simples de comunicacion tienden a reducir ruido de imagen.',

    // ── Mercury ingress ───────────────────────────────────────────────────
    'transit:mercury|ingress|house_1':
      'Mercurio en ingreso en la Casa 1 amplia claridad de comunicacion personal y rapidez de razonamiento sobre identidad y direccion. La fase favorece articular mejor lo que quieres y como te presentas. Organiza mensajes clave y usa el periodo para alinear discurso con accion.',
    'transit:mercury|ingress|house_2':
      'Mercurio en ingreso en la Casa 2 intensifica razonamiento sobre recursos, valores y decisiones de seguridad material. El ciclo favorece revisar y organizar informacion financiera con mas criterio. Documenta prioridades y avanza en temas economicos con metodologia clara.',
    'transit:mercury|ingress|house_3':
      'Mercurio en ingreso en la Casa 3 amplifica comunicacion, estudio rapido e intercambio local de informacion. Esta fase favorece conversaciones, escritura y conexiones en el entorno cercano. Usa el periodo para organizar mensajes, estudiar y fortalecer redes locales.',
    'transit:mercury|ingress|house_4':
      'Mercurio en ingreso en la Casa 4 enfoca razonamiento en contexto de hogar, familia y bases de vida. El ciclo favorece conversaciones sobre acuerdos domesticos y organizacion del entorno. Documenta decisiones relevantes sobre convivencia y planificacion familiar.',
    'transit:mercury|ingress|house_5':
      'Mercurio en ingreso en la Casa 5 amplifica ideas creativas, comunicacion espontanea y proyectos expresivos. Esta fase favorece intercambio de ideas con mas naturalidad y buen riesgo narrativo. Canaliza fluidez hacia proyectos creativos y conversaciones con impacto personal.',
    'transit:mercury|ingress|house_6':
      'Mercurio en ingreso en la Casa 6 intensifica atencion en rutinas, metodologia de trabajo y organizacion de salud. El ciclo favorece revisar procesos, documentar procedimientos y mejorar comunicacion funcional. Usa el periodo para priorizar eficiencia sin sobrecargar la agenda.',
    'transit:mercury|ingress|house_7':
      'Mercurio en ingreso en la Casa 7 amplia atencion en dialogos de alianza, negociacion y alineacion en relaciones. Esta fase favorece conversaciones clave con socios, parejas y otros significativos. Clarifica expectativas y documenta acuerdos para evitar ruido posterior.',
    'transit:mercury|ingress|house_8':
      'Mercurio en ingreso en la Casa 8 intensifica investigacion, analisis profundo y comunicacion sobre temas de confianza. El ciclo favorece revisar recursos compartidos, acuerdos tacitos e informacion estrategica. Documenta con precision y avanza en pendientes sensibles con criterio.',
    'transit:mercury|ingress|house_9':
      'Mercurio en ingreso en la Casa 9 amplifica curiosidad intelectual, aprendizaje de largo alcance y expresion de vision. Esta fase favorece estudio, filosofia y conexion con perspectivas mas amplias. Usa el periodo para integrar aprendizajes y compartir vision con claridad y fundamento.',
    'transit:mercury|ingress|house_10':
      'Mercurio en ingreso en la Casa 10 amplia enfoque en comunicacion estrategica, narrativa publica y gestion de imagen profesional. El ciclo favorece presentaciones y alineacion de discurso con resultados. Mantien mensajes concisos y coherentes con tu trayectoria.',
    'transit:mercury|ingress|house_11':
      'Mercurio en ingreso en la Casa 11 amplifica intercambio de ideas en redes, grupos y proyectos colectivos. Esta fase favorece conversaciones con apertura a nuevas perspectivas y colaboraciones con proposito. Usa el periodo para articular vision compartida y organizar objetivos colectivos.',
    'transit:mercury|ingress|house_12':
      'Mercurio en ingreso en la Casa 12 intensifica procesamiento interno, reflexion profunda y revision de supuestos implicitos. El ciclo favorece estudio introspectivo y preparacion silenciosa de ideas para nuevos ciclos. Documenta aprendizajes internos y evita decidir solo desde suposiciones.',

    // ── Venus conjuncao ───────────────────────────────────────────────────
    'transit:venus|conjuncao|sun':
      'Venus en conjuncion con el Sol amplifica necesidad de expresar valores personales con autenticidad y presencia. Este ciclo puede favorecer apertura a experiencias de placer, creatividad y conexion afectiva con mas integridad. Aprovecha para alinear elecciones con lo que mas valoras.',
    'transit:venus|conjuncao|moon':
      'Venus en conjuncion con Luna puede ampliar sensibilidad emocional, necesidad de afecto y confort relacional. El ciclo favorece cuidar de si y nutrir vinculos cuando claridad de limites esta presente. Usa el periodo para cultivar bienestar afectivo con equilibrio y reciprocidad.',
    'transit:venus|conjuncao|mercury':
      'Venus en conjuncion con Mercurio favorece comunicacion armoniosa, expresion de afecto en palabras y diplomacia relacional. Este ciclo tiende a facilitar intercambios cuando belleza de forma y claridad de contenido se combinan. Usa el periodo para fortalecer dialogos con cuidado y elegancia.',
    'transit:venus|conjuncao|venus':
      'Venus en conjuncion con Venus marca un momento de reajuste de valores, estetica y prioridades afectivas. Este ciclo tiende a ampliar conciencia de lo que trae placer y satisfaccion real. Usa el periodo para revisar elecciones relacionales y materiales con criterio y autenticidad.',
    'transit:venus|conjuncao|mars':
      'Venus en conjuncion con Marte puede intensificar dinamismo afectivo, atraccion y necesidad de expresar deseo con mas directness. Este ciclo favorece equilibrio entre armonia y asertividad en las relaciones. Avanza con claridad de intencion y cuida la reciprocidad en vinculos.',
    'transit:venus|conjuncao|saturn':
      'Venus en conjuncion con Saturno puede llevar a revisar vinculos y recursos bajo criterios de durabilidad y responsabilidad. El ciclo tiende a valorar calidad sobre cantidad en relaciones y elecciones de valor. Consolida lo que tiene fundamento real y suelta lo que ya no sirve.',
    'transit:venus|conjuncao|uranus':
      'Venus en conjuncion con Urano puede traer apertura a conexiones nuevas, valores atipicos y cambios en estetica o relaciones. Este ciclo favorece experimentacion cuando limites claros previenen impulsividad. Abraza la novedad con criterio y mantien coherencia de valores.',
    'transit:venus|conjuncao|neptune':
      'Venus en conjuncion con Neptuno puede ampliar idealizacion, sensibilidad estetica y busqueda de conexion profunda en vinculos. El ciclo favorece refinamiento cuando reciprocidad y limites concretos estan presentes. Valida senales reales antes de compromisos afectivos o financieros.',
    'transit:venus|conjuncao|pluto':
      'Venus en conjuncion con Pluton puede intensificar vinculos, atracciones y procesos de transformacion en el campo de valores. El ciclo tiende a revelar dinamicas de poder y dependencia en relaciones. Avanza con transparencia y claridad de limites en compromisos profundos.',
    'transit:venus|conjuncao|ascendente':
      'Venus en conjuncion al Ascendente amplifica encanto personal, apertura relacional y necesidad de armonia en la presencia. Esta fase favorece nuevas conexiones y fortalecimiento de vinculos cuando autenticidad guia la expresion. Cultiva relaciones con equilibrio y claridad de limite.',
    'transit:venus|conjuncao|meio_do_ceu':
      'Venus en conjuncion al Medio Cielo puede abrir oportunidades de colaboracion, reconocimiento profesional y visibilidad por calidad relacional. Este ciclo favorece proyectos con estetica y posicionamiento cuando criterio acompana apertura. Fortalece imagen con autenticidad y cooperacion.',

    // ── Venus sextil ──────────────────────────────────────────────────────
    'transit:venus|sextil|sun':
      'Venus en sextil al Sol favorece armonia entre expresion personal y valores afectivos. Este ciclo tiende a facilitar aperturas relacionales cuando autenticidad y presencia se alinean. Usa el periodo para fortalecer conexiones con integridad y apertura.',
    'transit:venus|sextil|moon':
      'Venus en sextil con Luna favorece equilibrio entre necesidad emocional y apertura relacional. Este ciclo tiende a apoyar cuidado de si y de vinculos con mas naturalidad. Usa el momento para cultivar bienestar afectivo con calma y reciprocidad.',
    'transit:venus|sextil|mercury':
      'Venus en sextil con Mercurio favorece comunicacion elegante, diplomacia e intercambio de valores con fluidez. Este ciclo tiende a facilitar conversaciones significativas y acuerdos con buen tono relacional. Aprovecha para articular lo que valoras con claridad y cuidado.',
    'transit:venus|sextil|venus':
      'Venus en sextil con Venus favorece sintonia con propios valores, estetica y preferencias afectivas. Este ciclo tiende a apoyar elecciones de placer y confort cuando criterio y autenticidad guian. Usa el periodo para revisar prioridades relacionales y cultivar lo que sustenta bienestar.',
    'transit:venus|sextil|mars':
      'Venus en sextil con Marte favorece combinacion de armonia y asertividad en vinculos y proyectos creativos. Este ciclo tiende a facilitar accion con cuidado relacional sin perder fuerza de direccion. Avanza en iniciativas combinando apertura y enfoque.',
    'transit:venus|sextil|jupiter':
      'Venus en sextil con Jupiter favorece expansion de experiencias afectivas, estetica y disfrute con criterio. Este ciclo tiende a apoyar generosidad cuando reciprocidad y limites estan activos. Aprovecha para cultivar relaciones con calidad y vision de largo plazo.',
    'transit:venus|sextil|saturn':
      'Venus en sextil con Saturno favorece valorar la estabilidad, responsabilidad y durabilidad en relaciones y elecciones. Este ciclo tiende a apoyar compromisos solidos cuando claridad de limite y esfuerzo conjunto estan presentes. Consolida lo que tiene base real con criterio y paciencia.',
    'transit:venus|sextil|uranus':
      'Venus en sextil con Urano favorece apertura a conexiones atipicas, renovacion estetica y valores de libertad. Este ciclo tiende a facilitar experimentacion cuando limites claros previenen exceso de impulsividad. Explora nuevas preferencias con apertura y fundamento.',
    'transit:venus|sextil|neptune':
      'Venus en sextil con Neptuno favorece sensibilidad estetica, empatia profunda y refinamiento de valores. Este ciclo tiende a apoyar creatividad e intuicion afectiva cuando verificacion practica es parte del proceso. Cultiva conexion con mas apertura y claridad de senales concretas.',
    'transit:venus|sextil|pluto':
      'Venus en sextil con Pluton favorece profundidad de vinculo, transformacion de valores y perspectiva renovada en relaciones. Este ciclo tiende a facilitar procesos de cambio cuando transparencia y claridad de limite estan presentes. Avanza en compromisos profundos con consciencia y criterio.',
    'transit:venus|sextil|ascendente':
      'Venus en sextil al Ascendente favorece proyeccion de encanto natural y apertura relacional con mas fluidez. Este ciclo tiende a facilitar nuevas conexiones y fortalecimiento de vinculos existentes. Usa el periodo para cultivar presencia relacional con autenticidad y equilibrio.',
    'transit:venus|sextil|meio_do_ceu':
      'Venus en sextil al Medio Cielo favorece visibilidad profesional por calidad relacional, estetica y colaboracion. Este ciclo tiende a abrir espacio para conexiones con proposito en el ambiente de carrera. Fortalece imagen con autenticidad y cultiva relaciones de valor estrategico.',

    // ── Venus trigono ─────────────────────────────────────────────────────
    'transit:venus|trigono|sun':
      'Venus en trigono al Sol refuerza fluidez entre valores personales y expresion autentica. Este ciclo tiende a favorecer relaciones y elecciones de placer con mas integridad. Aprovecha el periodo para cultivar lo que sustenta bienestar real con coherencia.',
    'transit:venus|trigono|moon':
      'Venus en trigono con Luna favorece integracion natural entre necesidad emocional y apertura relacional. Este ciclo tiende a facilitar cuidado de si y de vinculos con fluidez y reciprocidad. Usa el momento para cultivar afecto con autenticidad y calma.',
    'transit:venus|trigono|mercury':
      'Venus en trigono con Mercurio favorece comunicacion armonizadora, expresion de afecto y elegancia relacional. Este ciclo tiende a facilitar conversaciones significativas con mas fluidez y cuidado mutuo. Aprovecha para fortalecer dialogos y acuerdos con calidad.',
    'transit:venus|trigono|venus':
      'Venus en trigono con Venus favorece sintonia profunda con valores propios, estetica y elecciones de placer. Este ciclo tiende a facilitar revision de prioridades afectivas con mas claridad y autenticidad. Usa el periodo para consolidar lo que aporta bienestar real.',
    'transit:venus|trigono|mars':
      'Venus en trigono con Marte favorece dinamismo relacional con equilibrio entre armonia y asertividad. Este ciclo tiende a facilitar accion en vinculos cuando cuidado y firmeza se complementan. Avanza en proyectos creativos y relaciones con fluidez e intencion.',
    'transit:venus|trigono|jupiter':
      'Venus en trigono con Jupiter favorece generosidad, expansion de experiencias de placer y relaciones con vision amplia. Este ciclo tiende a facilitar abundancia afectiva y material cuando criterio acompana apertura. Cultiva conexiones con calidad y perspectiva de largo plazo.',
    'transit:venus|trigono|saturn':
      'Venus en trigono con Saturno favorece solidez en vinculos, responsabilidad afectiva y valorar lo duradero. Este ciclo tiende a facilitar compromisos estables cuando claridad de limite y esfuerzo mutuo estan presentes. Consolida relaciones y valores con consciencia y paciencia.',
    'transit:venus|trigono|uranus':
      'Venus en trigono con Urano favorece apertura a conexiones innovadoras, libertad expresiva y renovacion de valores. Este ciclo tiende a facilitar experimentacion con criterio y limites claros. Explora nuevas formas de relacion y estetica con apertura e integridad.',
    'transit:venus|trigono|neptune':
      'Venus en trigono con Neptuno favorece sensibilidad estetica profunda, empatia y refinamiento de valores. Este ciclo tiende a facilitar creatividad e intuicion afectiva cuando verificacion practica acompana la apertura. Cultiva conexion sutil con mas discernimiento y claridad.',
    'transit:venus|trigono|pluto':
      'Venus en trigono con Pluton favorece transformacion profunda de valores y revitalizacion de vinculos con mas autenticidad. Este ciclo tiende a facilitar procesos de cambio cuando hay transparencia y voluntad de profundizar. Avanza en compromisos con consciencia e integridad.',
    'transit:venus|trigono|ascendente':
      'Venus en trigono al Ascendente favorece proyeccion de presencia armoniosa y apertura relacional fluida. Este ciclo tiende a facilitar nuevas conexiones y fortalecimiento de vinculos con mas naturalidad. Usa el periodo para cultivar imagen relacional con autenticidad y equilibrio.',
    'transit:venus|trigono|meio_do_ceu':
      'Venus en trigono al Medio Cielo favorece visibilidad profesional por calidad relacional y estetica con fluidez. Este ciclo tiende a abrir oportunidades de colaboracion con proposito y buen posicionamiento. Fortalece imagen con autenticidad y cultiva relaciones de valor en carrera.',

    // ── Venus oposicao ────────────────────────────────────────────────────
    'transit:venus|oposicao|sun':
      'Venus en oposicion al Sol puede tensionar valores personales con necesidad de reconocimiento y expresion afectiva. El ciclo pide equilibrar deseo de armonia con autenticidad de direccion propia. Avanza con claridad de prioridades sin ceder excesivamente en puntos esenciales.',
    'transit:venus|oposicao|moon':
      'Venus en oposicion con Luna puede ampliar tension entre necesidad emocional y expectativas relacionales. El ciclo pide cuidado con proyeccion afectiva y suposiciones en vinculos cercanos. Comunica necesidades con calma y valida comprension mutua antes de concluir.',
    'transit:venus|oposicao|mercury':
      'Venus en oposicion con Mercurio puede tensionar forma de comunicar y contenido en conversaciones afectivas o de valor. El ciclo pide equilibrar elegancia relacional y claridad de mensaje sin perder ninguna. Ajusta tono y lenguaje para sostener dialogo con calidad.',
    'transit:venus|oposicao|venus':
      'Venus en oposicion con Venus puede activar tension entre valores propios y expectativas del entorno relacional. El ciclo pide revisar prioridades afectivas y materiales con criterio propio. Avanza sin ceder en lo esencial ni imponer sin escuchar.',
    'transit:venus|oposicao|mars':
      'Venus en oposicion con Marte puede ampliar tension entre deseo de armonia y dinamismo asertivo en relaciones. El ciclo pide calibrar intensidad y reciprocidad para avanzar sin exceso de confrontacion o evasion. Busca equilibrio entre apertura y firmeza.',
    'transit:venus|oposicao|jupiter':
      'Venus en oposicion con Jupiter puede ampliar expectativas afectivas o de disfrute con menos criterio de limite. El ciclo pide equilibrar generosidad y expansividad con evaluacion practica de lo que es sostenible. Avanza con apertura y con anclaje en realidad.',
    'transit:venus|oposicao|saturn':
      'Venus en oposicion con Saturno puede tensionar deseo de conexion y placer con exigencia de responsabilidad y estructura. El ciclo pide equilibrar necesidad afectiva con compromisos practicos sin sofocar ninguno. Consolida con paciencia y honestidad de expectativas.',
    'transit:venus|oposicao|uranus':
      'Venus en oposicion con Urano puede traer tension entre necesidad de estabilidad relacional e impulso de libertad o cambio. El ciclo pide contener ruptura apresurada sin sofocar renovacion necesaria. Valida lo que es persistente antes de transformar y mantien dialogo abierto.',
    'transit:venus|oposicao|neptune':
      'Venus en oposicion con Neptuno puede ampliar idealizacion en vinculos y expectativas poco ancladas en realidad. El ciclo pide contrastar percepcion con evidencia concreta antes de compromisos. Busca reciprocidad real y evita decisiones solo por entusiasmo afectivo.',
    'transit:venus|oposicao|pluto':
      'Venus en oposicion con Pluton puede intensificar dinamicas de poder, dependencia o control en vinculos y valores. El ciclo pide claridad de limite y revision de lo que mueve las elecciones profundas. Avanza con transparencia y sin ceder en puntos de integridad propios.',
    'transit:venus|oposicao|ascendente':
      'Venus en oposicion al Ascendente puede traer tension entre imagen relacional y expectativas del entorno. El ciclo pide revisar como te presentas y que comunicas en relaciones cercanas. Ajusta postura con autenticidad y claridad de limite para sostener vinculos sin ceder en exceso.',
    'transit:venus|oposicao|meio_do_ceu':
      'Venus en oposicion al Medio Cielo puede tensionar dinamica afectiva con demandas profesionales o de imagen. El ciclo pide equilibrar inversion en relaciones y en proyeccion de carrera con criterio claro. Ajusta prioridades para sostener calidad en ambos dominios sin sacrificar ninguno.',

    // ── Venus quadratura ──────────────────────────────────────────────────
    'transit:venus|quadratura|sun':
      'Venus en cuadratura al Sol puede generar tension entre valores propios y expresion de identidad. El ciclo pide calibrar deseo de armonia con autenticidad de direccion sin excesiva concesion. Avanza con criterio propio y revisa elecciones bajo luz de lo que genuinamente valoras.',
    'transit:venus|quadratura|moon':
      'Venus en cuadratura con Luna puede ampliar tension entre necesidad emocional y elecciones afectivas o de placer. El ciclo pide cuidado con decisiones motivadas por estado emocional transitorio. Pausa, evalua con calma y comunica necesidades con claridad.',
    'transit:venus|quadratura|mercury':
      'Venus en cuadratura con Mercurio puede tensionar diplomacia y franqueza en conversaciones de valor o relacionales. El ciclo pide equilibrar forma elegante y contenido claro sin perder ninguno. Ajusta mensaje y tono para sostener dialogo con calidad y honestidad.',
    'transit:venus|quadratura|venus':
      'Venus en cuadratura con Venus puede activar conflicto interno sobre valores, placer y prioridades relacionales. El ciclo pide revisar lo que realmente sustenta bienestar y soltar lo que ya no encaja. Avanza con autenticidad de criterio propio.',
    'transit:venus|quadratura|mars':
      'Venus en cuadratura con Marte puede ampliar tension entre armonia y asertividad en relaciones y proyectos. El ciclo pide calibrar apertura y firmeza para avanzar sin exceso de confrontacion ni de evasion. Busca equilibrio entre cuidado relacional y direccion clara.',
    'transit:venus|quadratura|jupiter':
      'Venus en cuadratura con Jupiter puede ampliar expectativas de placer y expansion con menos criterio de limite. El ciclo pide equilibrar apertura a disfrute con evaluacion practica de lo que es sostenible. Avanza con generosidad anclada en realidad y criterio claro.',
    'transit:venus|quadratura|saturn':
      'Venus en cuadratura con Saturno puede tensionar deseo de conexion y placer con exigencia estructural. El ciclo pide equilibrar necesidad afectiva y responsabilidad sin negar ninguno. Consolida con paciencia y honestidad de expectativas en vinculos y valores.',
    'transit:venus|quadratura|uranus':
      'Venus en cuadratura con Urano puede traer tension entre estabilidad relacional e impulso de ruptura o cambio abrupto. El ciclo pide contener reaccion impulsiva sin bloquear renovacion necesaria. Valida con calma antes de tomar decisiones con impacto en vinculos.',
    'transit:venus|quadratura|neptune':
      'Venus en cuadratura con Neptuno puede ampliar idealizacion y falta de anclaje en relaciones o decisiones de valor. El ciclo pide contrastar percepcion con evidencia concreta y revisar suposiciones. Avanza con criterio claro y evita compromisos basados solo en expectativa.',
    'transit:venus|quadratura|pluto':
      'Venus en cuadratura con Pluton puede intensificar dinamicas de poder, posesividad o transformacion forzada en vinculos. El ciclo pide claridad de limite y revision consciente de lo que mueve las elecciones profundas. Avanza con transparencia y sin ceder en integridad propia.',
    'transit:venus|quadratura|ascendente':
      'Venus en cuadratura al Ascendente puede traer tension entre imagen relacional y como te perciben en el entorno. El ciclo pide revisar como te presentas y que comunicas en relaciones cotidianas. Ajusta con autenticidad y claridad para sostener vinculos sin exceso de adaptacion.',
    'transit:venus|quadratura|meio_do_ceu':
      'Venus en cuadratura al Medio Cielo puede tensionar dinamica relacional con posicionamiento profesional. El ciclo pide equilibrar inversion en vinculos y en carrera con criterio claro de prioridades. Ajusta elecciones para sostener calidad en ambos dominios con criterio.',

    // ── Venus ingress ─────────────────────────────────────────────────────
    'transit:venus|ingress|house_1':
      'Venus en ingreso en la Casa 1 amplifica encanto natural, necesidad de armonia y apertura a nuevas conexiones. Esta fase favorece expresion de valores personales con mas autenticidad y presencia. Usa el momento para cultivar relaciones con equilibrio y claridad de limite.',
    'transit:venus|ingress|house_2':
      'Venus en ingreso en la Casa 2 amplifica atencion en recursos, valores personales y experiencias de placer y seguridad. Este ciclo favorece revisar lo que realmente importa material y afectivamente. Prioriza elecciones que sustenten bienestar con criterio y consistencia.',
    'transit:venus|ingress|house_3':
      'Venus en ingreso en la Casa 3 favorece conversaciones armonicas, expresion diplomatica e intercambio de ideas con mas ligereza. Este periodo amplifica apertura a aprender y comunicar con afecto y cuidado. Aprovecha para fortalecer relaciones locales y conversaciones que importan.',
    'transit:venus|ingress|house_4':
      'Venus en ingreso en la Casa 4 favorece armonizacion del entorno del hogar, confort emocional y calidad de relaciones familiares. Esta fase tiende a amplificar deseo de paz y cuidado en casa. Pequenos ajustes de convivencia y entorno pueden traer mas bienestar.',
    'transit:venus|ingress|house_5':
      'Venus en ingreso en la Casa 5 amplifica placer, expresion creativa y apertura al romance y afecto con mas autenticidad. Este ciclo favorece proyectos de expresion personal, encuentros y elecciones que traen alegria. Usa el momento con moderacion y criterio de reciprocidad.',
    'transit:venus|ingress|house_6':
      'Venus en ingreso en la Casa 6 favorece armonizacion de rutinas diarias, relaciones de trabajo y bienestar funcional. Esta fase puede amplificar placer en tareas cotidianas cuando organizacion y criterio estan presentes. Pequenos ajustes de entorno y dinamica de trabajo tienden a traer mas ligereza.',
    'transit:venus|ingress|house_7':
      'Venus en ingreso en la Casa 7 amplifica apertura relacional, deseo de asociacion y necesidad de armonia en acuerdos. Este ciclo favorece nuevos vinculos y fortalecimiento de relaciones existentes cuando hay reciprocidad clara. Prioriza cooperacion y definicion de limite con gentileza.',
    'transit:venus|ingress|house_8':
      'Venus en ingreso en la Casa 8 amplifica profundidad de vinculo, temas de recursos compartidos y necesidad de confianza. Esta fase puede favorecer intimidad real cuando apertura y limites conscientes estan presentes. Avanza con criterio y claridad en acuerdos profundos y elecciones de valor.',
    'transit:venus|ingress|house_9':
      'Venus en ingreso en la Casa 9 amplifica apertura al aprendizaje, expansion de vision y placer en conexiones culturales y de largo alcance. Este ciclo favorece viajes, estudio y conexiones que amplian perspectiva afectiva. Usa el periodo para cultivar lo que expande sentido y calidad de experiencia.',
    'transit:venus|ingress|house_10':
      'Venus en ingreso en la Casa 10 favorece reconocimiento profesional por calidad relacional, estetica y buen posicionamiento. Esta fase puede amplificar oportunidades de colaboracion y visibilidad con criterio. Fortalece imagen con autenticidad y cultiva relaciones de valor en el entorno de carrera.',
    'transit:venus|ingress|house_11':
      'Venus en ingreso en la Casa 11 favorece armonizacion en redes, colaboraciones y proyectos futuros compartidos. Este ciclo amplifica apertura a nuevos vinculos y conexiones de calidad con proposito. Prioriza alianzas con reciprocidad real y contribuye con autenticidad.',
    'transit:venus|ingress|house_12':
      'Venus en ingreso en la Casa 12 amplifica sensibilidad interna, necesidad de descanso afectivo y procesos de cierre tranquilo. Esta fase favorece autocuidado, refinamiento de relaciones y revision de lo que sustenta bienestar real. Usa el periodo para integrar aprendizajes relacionales.',
},
  'it-IT': {
    'transit:mercury|conjuncao|ascendente':
      "Mercurio in congiunzione con l'Ascendente tende ad aumentare chiarezza verbale, agilita mentale e rapidita di risposta. Questa fase favorisce presentazioni, dialoghi chiave e aggiustamenti di posizione personale. Organizza i messaggi principali e mantieni comunicazione oggettiva.",
    'transit:mercury|conjuncao|jupiter':
      'Mercurio in congiunzione con Giove amplia visione di contesto e repertorio di idee, con supporto a strategia e apprendimento. Questo ciclo funziona meglio quando prospettiva ampia e criteri di priorita procedono insieme. Trasforma insight in piano pratico con tappe verificabili.',
    'transit:mercury|conjuncao|mars':
      'Mercurio in congiunzione con Marte accelera pensiero e decisioni, aumentando impulso di risposta immediata. Questa fase favorisce esecuzione quando focus e ordine delle priorita sono chiari. Evita conclusioni affrettate e verifica i fatti prima di chiudere accordi.',
    'transit:mercury|conjuncao|meio_do_ceu':
      'Mercurio in congiunzione con il Medio Cielo favorisce visibilita tramite comunicazione, strategia e narrativa professionale. Questo periodo tende ad aprire spazio per allineare immagine pubblica e consegna oggettiva. Messaggi semplici e coerenti rafforzano credibilita.',
    'transit:mercury|conjuncao|mercury':
      'Mercurio in congiunzione con Mercurio segnala finestra di alta attivita mentale per rivedere idee e criteri. Questa fase favorisce studio, scrittura e riordino dei processi decisionali. Struttura le informazioni per rilevanza per evitare sovraccarico cognitivo.',
    'transit:mercury|conjuncao|moon':
      'Mercurio in congiunzione con Luna avvicina pensiero ed emozione, favorendo dialoghi piu chiari ed empatici. Questo ciclo puo facilitare la nominazione dei vissuti e l aggiustamento delle aspettative quotidiane. Mantieni ascolto attivo per bilanciare sensibilita e oggettivita.',
    'transit:mercury|conjuncao|neptune':
      'Mercurio in congiunzione con Nettuno amplia intuizione mentale e lettura simbolica, con rischio di ambiguita nei dati concreti. Questa fase favorisce creativita se accompagnata da verifica pratica. Registra gli accordi e rivedi i dettagli per ridurre fraintendimenti.',
    'transit:mercury|conjuncao|pluto':
      'Mercurio in congiunzione con Plutone intensifica focus investigativo e profondita analitica su temi sensibili. Questo ciclo favorisce diagnosi di radice e rifocalizzazione strategica con criterio. Evita rigidita discorsiva e resta aperto alla revisione delle ipotesi.',
    'transit:mercury|conjuncao|saturn':
      'Mercurio in congiunzione con Saturno favorisce pensiero strutturato, disciplina intellettuale e comunicazione precisa. Questa fase sostiene pianificazione, revisione accordi e definizione di metodo. Lavora con tempi chiari e linguaggio accurato per sostenere fiducia.',
    'transit:mercury|conjuncao|sun':
      'Mercurio in congiunzione con Sole rafforza chiarezza mentale e allineamento tra intenzione ed espressione. Questo periodo favorisce decisioni quando le priorita sono definite e comunicate con semplicita. Usa la fase per chiarire direzione e ridurre dispersione.',
    'transit:mercury|conjuncao|uranus':
      'Mercurio in congiunzione con Urano accelera innovazione mentale e apertura a idee fuori schema. Questa fase favorisce breakthrough quando intuizione rapida e validazione oggettiva avanzano insieme. Testa ipotesi in cicli brevi prima di scalare cambiamenti.',
    'transit:mercury|conjuncao|venus':
      'Mercurio in congiunzione con Venere favorisce diplomazia, conciliazione e qualita dello scambio nei dialoghi importanti. Questo ciclo tende a facilitare accordi quando valori e limiti sono espliciti. Investi in comunicazione gentile senza perdere assertivita.',
    'transit:mercury|quadratura|ascendente':
      "Mercurio in quadratura all'Ascendente puo aumentare frizione comunicativa e disallineamento di tono nelle interazioni. Questa fase chiede di regolare la forma espressiva per mantenere chiarezza senza escalation. Semplifica messaggi e conferma comprensione reciproca.",
    'transit:mercury|quadratura|jupiter':
      'Mercurio in quadratura con Giove tende ad ampliare idee senza la stessa precisione di criterio. Questo ciclo chiede equilibrio tra visione ampia e verifica dei dettagli prima di decidere. Evita promesse estese senza piano operativo chiaro.',
    'transit:mercury|quadratura|mars':
      'Mercurio in quadratura con Marte puo accelerare parola e dibattito, aumentando rischio di reattivita verbale. Questa fase chiede pause strategiche per ridurre conflitto improduttivo. Riordina priorita e rispondi con oggettivita, non per impulso.',
    'transit:mercury|quadratura|meio_do_ceu':
      'Mercurio in quadratura con il Medio Cielo puo tensionare narrativa pubblica e coerenza del posizionamento professionale. Questo periodo chiede revisione di messaggi, tempi e allineamento tra discorso e consegna. Piccoli aggiustamenti comunicativi riducono rumore di immagine.',
    'transit:mercury|quadratura|mercury':
      'Mercurio in quadratura con Mercurio puo creare conflitto tra riferimenti mentali, ritmo decisionale e organizzazione dei dati. Questa fase chiede revisione metodica delle premesse per evitare rilavorazioni. Dai priorita all essenziale e valida le interpretazioni chiave.',
    'transit:mercury|quadratura|moon':
      'Mercurio in quadratura con Luna puo generare attrito tra logica e sensibilita nei temi quotidiani. Questo ciclo chiede di tradurre emozione in linguaggio chiaro per ridurre rumore relazionale. Combina ascolto e oggettivita per stabilizzare dialoghi delicati.',
    'transit:mercury|quadratura|neptune':
      'Mercurio in quadratura con Nettuno puo aumentare confusione di contesto, supposizioni ed errori di dettaglio. Questa fase chiede conferma di fatti, date e responsabilita prima di chiudere accordi. Documenta gli impegni per iscritto per ridurre ambiguita.',
    'transit:mercury|quadratura|pluto':
      'Mercurio in quadratura con Plutone intensifica controllo narrativo e rigidita nelle dispute interpretative. Questo ciclo chiede rigore analitico senza paranoia o confronto inutile. Concentrati su evidenza verificabile e mantieni apertura alle sfumature.',
    'transit:mercury|quadratura|saturn':
      'Mercurio in quadratura con Saturno puo portare pressione mentale, peso decisionale e comunicazione piu bloccata. Questa fase chiede metodo, pazienza e criteri espliciti per sbloccare avanzamenti. Dividi problemi in blocchi e avanza per tappe brevi.',
    'transit:mercury|quadratura|sun':
      'Mercurio in quadratura con Sole puo tensionare chiarezza di direzione e modo di comunicare priorita. Questo periodo chiede allineare intenzione, linguaggio e piano d azione con maggiore coerenza. Rivedi narrativa centrale prima di comunicare decisioni importanti.',
    'transit:mercury|quadratura|uranus':
      'Mercurio in quadratura con Urano puo generare cambi bruschi di idea e oscillazione tra insight e rumore. Questa fase chiede contenere impulso di rottura senza bloccare innovazione. Valida esperimenti su scala ridotta e preserva criterio di continuita.',
    'transit:mercury|quadratura|venus':
      'Mercurio in quadratura con Venere puo tensionare diplomazia e franchezza nei dialoghi affettivi o di valore. Questo ciclo chiede negoziare forma e contenuto per preservare il legame senza omettere punti essenziali. Regola aspettative e linguaggio per sostenere reciprocita.',
    'transit:mars|sextil|ascendente':
      "Marte in sestile all'Ascendente favorisce iniziativa con migliore calibrazione di postura e ritmo. Questa fase tende a facilitare azione diretta senza confronto inutile. Incanala energia in decisioni oggettive ed esecuzione coerente.",
    'transit:mars|sextil|jupiter':
      'Marte in sestile con Giove combina coraggio e strategia, favorendo avanzamenti con lettura di opportunita. Questo ciclo rende meglio quando entusiasmo e accompagnato da piano pratico. Dai priorita ai fronti a maggior ritorno e monitora progressi per fasi.',
    'transit:mars|sextil|mars':
      'Marte in sestile con Marte rafforza fluidita di iniziativa e capacita di azione focalizzata. Questa fase favorisce produttivita quando priorita sono chiare e ben sequenziate. Usa lo slancio per chiudere pendenze rilevanti senza dispersione.',
    'transit:mars|sextil|mercury':
      'Marte in sestile con Mercurio favorisce comunicazione assertiva e decisioni piu rapide con buona chiarezza. Questo ciclo tende a facilitare negoziazioni e avanzamento quando argomenti sono ben strutturati. Mantieni oggettivita e ascolto per preservare allineamento.',
    'transit:mars|sextil|moon':
      'Marte in sestile con Luna aiuta a integrare azione ed emozione con minore reattivita. Questa fase favorisce aggiustamenti di routine e risposta pratica alle richieste affettive quotidiane. Mantieni ritmo sostenibile per proteggere benessere e continuita.',
    'transit:mars|sextil|neptune':
      'Marte in sestile con Nettuno favorisce trasformare intuizione in movimento pratico con maggiore fluidita. Questo ciclo tende a sostenere creativita applicata quando obiettivi sono almeno chiari. Struttura passi brevi per evitare dispersione energetica.',
    'transit:mars|sextil|pluto':
      'Marte in sestile con Plutone rafforza determinazione, focus strategico e capacita di azione profonda. Questa fase favorisce cambiamenti strutturali senza richiedere rottura brusca. Dirigi intensita su obiettivi centrali e consolida coerenza di lungo periodo.',
    'transit:mars|sextil|saturn':
      'Marte in sestile con Saturno combina impulso e disciplina, favorendo esecuzione efficiente. Questo ciclo tende ad aprire spazio per progresso costante quando metodo e priorita procedono insieme. Avanza per fasi per consolidare risultati sostenibili.',
    'transit:mars|sextil|uranus':
      'Marte in sestile con Urano favorisce innovazione pratica e agilita nel correggere rotta senza perdere base. Questa fase tende a sostenere cambi intelligenti quando esistono criteri di test e validazione. Sperimenta con focus e scala solo cio che funziona.',
    'transit:mars|sextil|venus':
      'Marte in sestile con Venere favorisce iniziativa in relazioni e accordi con equilibrio migliore tra desiderio e cooperazione. Questo ciclo tende a facilitare avvicinamenti quando limiti e aspettative sono chiari. Combina assertivita e diplomazia per rafforzare scambi.',
    'transit:mars|trigono|ascendente':
      "Marte in trigono all Ascendente favorisce azione diretta con buon senso del tempo e della postura. Questa fase tende ad aumentare fiducia per avviare movimenti personali con meno attrito. Usa questo flusso per eseguire priorita con obiettivita e costanza.",
    'transit:mars|trigono|jupiter':
      'Marte in trigono con Giove combina iniziativa ed espansione in ritmo produttivo. Questo ciclo tende a favorire avanzamenti quando entusiasmo e strategia pratica procedono insieme. Dirigi energia verso obiettivi rilevanti e monitora progressi per fasi.',
    'transit:mars|trigono|mars':
      'Marte in trigono con Marte rafforza impulso esecutivo e senso di direzione. Questa fase tende a favorire produttivita quando priorita sono ben definite. Sfrutta lo slancio per chiudere fronti aperti senza disperdere energia.',
    'transit:mars|trigono|mercury':
      'Marte in trigono con Mercurio favorisce chiarezza nelle decisioni e comunicazione ferma. Questo ciclo tende a facilitare negoziazioni e avanzamenti quando argomenti sono oggettivi. Mantieni ascolto attivo per sostenere allineamento negli scambi.',
    'transit:mars|trigono|moon':
      'Marte in trigono con Luna favorisce integrazione tra volonta e sensibilita nella routine. Questa fase tende a facilitare risposte pratiche senza perdere cura emotiva. Piccoli aggiustamenti di ritmo possono aumentare stabilita interiore.',
    'transit:mars|trigono|neptune':
      'Marte in trigono con Nettuno favorisce trasformare intuizione in azione con maggiore fluidita. Questo ciclo tende a sostenere creativita applicata quando obiettivi hanno chiarezza minima. Organizza passi brevi per mantenere continuita e ridurre dispersione.',
    'transit:mars|trigono|pluto':
      'Marte in trigono con Plutone amplia determinazione, profondita e capacita di cambiamento strategico. Questa fase tende a favorire decisioni strutturali quando azione e criterio procedono insieme. Dirigi intensita verso essenziale e consolida risultati di lungo periodo.',
    'transit:mars|trigono|saturn':
      'Marte in trigono con Saturno combina disciplina e iniziativa in modo efficiente. Questo ciclo tende a facilitare progresso sostenibile quando metodo e priorita procedono insieme. Avanza per fasi per rafforzare coerenza.',
    'transit:mars|trigono|uranus':
      'Marte in trigono con Urano favorisce innovazione pratica senza richiedere rottura brusca. Questa fase tende ad aprire spazio per testare soluzioni nuove con buon controllo del rischio. Sperimenta con criterio ed espandi solo cio che dimostra utilita.',
    'transit:mars|trigono|venus':
      'Marte in trigono con Venere favorisce iniziativa affettiva e cooperazione in accordi importanti. Questo ciclo tende a facilitare avvicinamenti quando desiderio e reciprocita sono in equilibrio. Usa assertivita con tatto per rafforzare legami.',
    'transit:jupiter|conjuncao|meio_do_ceu':
      'Giove in congiunzione al Medio Cielo puo aumentare visibilita e aprire spazio a crescita professionale. Questo ciclo favorisce riconoscimento quando direzione, costanza e aspettative restano realistiche. Evita promesse eccessive e consolida progressi per fasi.',
    'transit:jupiter|sextil|meio_do_ceu':
      'Giove in sestile al Medio Cielo facilita accordi e slancio per evoluzione professionale. La fase tende a favorire espansione con strategia e priorita chiare. Piccole decisioni ben eseguite possono avere impatto concreto nel medio periodo.',
    'transit:jupiter|trigono|meio_do_ceu':
      'Giove in trigono al Medio Cielo migliora fluidita negli obiettivi pubblici e professionali. Il riconoscimento e piu probabile quando qualita tecnica e comunicazione chiara procedono insieme. Usa la fase per crescita sostenibile senza eccesso di fiducia.',
    'transit:jupiter|conjuncao|neptune':
      'Giove in congiunzione con Nettuno amplia immaginazione e visione di lungo periodo, con rischio di idealizzazione quando mancano criteri. Questa fase favorisce ispirazione se traduci la percezione sottile in obiettivi pratici e verificabili. Evita promesse ampie senza piano esecutivo e mantieni revisioni oggettive.',
    'transit:jupiter|conjuncao|pluto':
      'Giove in congiunzione con Plutone intensifica ambizione di crescita e bisogno di riposizionamento strategico. Questo ciclo tende a favorire avanzamenti rilevanti quando analisi profonda e focus di lungo termine sono presenti. Dirigi espansione su cio che e essenziale e riduci mosse impulsive di potere.',
    'transit:jupiter|conjuncao|saturn':
      'Giove in congiunzione con Saturno combina espansione e struttura nello stesso punto decisionale. Questa fase favorisce crescita coerente quando visione ampia incontra metodo, tempi e governance. Organizza priorita per fasi per trasformare opportunita in risultati sostenibili.',
    'transit:jupiter|conjuncao|uranus':
      'Giove in congiunzione con Urano accelera innovazione e apertura a direzioni nuove. Il periodo puo portare opportunita fuori schema e richiede flessibilita con gestione responsabile del rischio. Sperimenta strade nuove con criterio e validazione prima di scalare.',
    'transit:jupiter|oposicao|ascendente':
      'Giove in opposizione all Ascendente puo amplificare richieste relazionali ed esposizione pubblica, mettendo pressione sull equilibrio personale. Questa fase chiede di allineare aspettative tra cio che offri e cio che puoi sostenere con qualita. Negozia confini con chiarezza per preservare cooperazione e coerenza.',
    'transit:jupiter|oposicao|mercury':
      'Giove in opposizione a Mercurio tende ad ampliare idee e discorso, con rischio di eccessiva fiducia nell interpretazione. Questo ciclo favorisce apprendimento quando visione ampia e verifica oggettiva restano in equilibrio. Rivedi premesse, semplifica messaggi e affina cio che e davvero praticabile.',
    'transit:jupiter|oposicao|moon':
      'Giove in opposizione alla Luna puo aumentare oscillazione emotiva e aspettativa di risposta immediata. Questa fase chiede moderazione affettiva per evitare eccessi di ritmo e decisione. Bilancia cura interiore e priorita pratiche della routine.',
    'transit:jupiter|oposicao|sun':
      'Giove in opposizione al Sole puo mettere in tensione impulso espansivo e limiti reali di energia e contesto. Il periodo chiede di calibrare ambizione, agenda e risorse per mantenere coerenza tra immagine e consegna. Una crescita piu stabile nasce da focus selettivo ed esecuzione progressiva.',
    'transit:jupiter|oposicao|venus':
      'Giove in opposizione a Venere amplifica desiderio di piacere, concessione e aspettativa di reciprocita. Questa fase chiede di calibrare valore e misura per evitare eccessi affettivi o finanziari. Privilegia scelte che mantengano equilibrio tra soddisfazione immediata e sostenibilita.',
    'transit:jupiter|oposicao|uranus':
      'Giove in opposizione a Urano puo portare oscillazioni rapide tra entusiasmo e rottura del piano. Questo ciclo chiede liberta con criterio per non sostituire la coerenza con novita continua. Fai aggiustamenti strategici senza abbandonare cio che gia sostiene risultati.',
    'transit:jupiter|oposicao|mars':
      'Giove in opposizione a Marte puo aumentare ambizione e ritmo d azione oltre la capacita reale del contesto. Questo ciclo chiede di calibrare coraggio e strategia per evitare usura da impulso eccessivo. Dirigi energia su obiettivi concreti con fasi e revisioni di avanzamento.',
    'transit:jupiter|oposicao|meio_do_ceu':
      'Giove in opposizione al Medio Cielo puo mettere in tensione visibilita pubblica, equilibrio personale e limiti pratici. Questa fase chiede allineamento tra proiezione, consegna e capacita sostenibile. Aggiustamenti di posizionamento tendono a funzionare meglio di mosse brusche.',
    'transit:jupiter|quadratura|meio_do_ceu':
      'Giove in quadratura al Medio Cielo puo ampliare aspettative professionali senza pari struttura operativa. Il periodo chiede revisione di promesse, tempi e priorita per evitare dispersione strategica. Una crescita piu solida nasce da focus selettivo ed esecuzione costante.',
    'transit:jupiter|ingress|house_6':
      'Giove in ingresso in Casa 6 amplia opportunita di miglioramento in routine, organizzazione ed efficienza quotidiana. Questa fase favorisce aggiornamenti di metodo quando espansione e disciplina semplice procedono insieme. Piccoli guadagni accumulati possono generare impatto concreto nel medio periodo.',
    'transit:jupiter|ingress|house_7':
      'Giove in ingresso in Casa 7 amplia opportunita di cooperazione, accordi e scambi in relazioni importanti. Questo ciclo favorisce alleanze quando aspettative e confini sono negoziati con chiarezza. Privilegia reciprocita concreta per trasformare buona volonta in risultati stabili.',
    'transit:jupiter|ingress|house_8':
      'Giove in ingresso in Casa 8 amplia temi di risorse condivise, fiducia e trasformazione profonda. Questa fase favorisce riorganizzazione strategica quando trasparenza e criterio sostengono gli impegni. Procedi con chiarezza su rischi, responsabilita e tempi.',
    'transit:jupiter|ingress|house_9':
      'Giove in ingresso in Casa 9 amplia orizzonte di apprendimento, visione del mondo e pianificazione di lungo periodo. Il periodo favorisce studio ed espansione del repertorio quando c e applicazione pratica. Trasforma nuova conoscenza in direzione eseguibile.',
    'transit:jupiter|ingress|house_12':
      'Giove in ingresso in Casa 12 amplia processi di chiusura, senso interiore e riprioritizzazione silenziosa. Questa fase favorisce maturazione quando introspezione e praticita quotidiana restano insieme. Usa il periodo per ridurre eccessi e preparare un nuovo ciclo con maggiore chiarezza.',
    'transit:jupiter|oposicao|jupiter':
      'Giove in opposizione con Giove puo amplificare gli estremi tra fiducia ed eccesso di aspettativa. Questa fase chiede di calibrare ambizione e criterio per evitare promesse oltre la reale capacita di consegna. Una crescita piu stabile nasce da focus selettivo e revisione realistica degli obiettivi.',
    'transit:jupiter|quadratura|jupiter':
      'Giove in quadratura con Giove tende a mettere in tensione espansione, ritmo e scelte di rischio. Il ciclo puo attivare accelerazione su troppi fronti insieme, riducendo la qualita esecutiva. Dai priorita all essenziale e procedi per blocchi per mantenere risultati coerenti.',
    'transit:jupiter|quadratura|mercury':
      'Giove in quadratura con Mercurio puo aumentare dispersione mentale e fiducia eccessiva in conclusioni rapide. Questa fase chiede revisione delle premesse, messaggi piu semplici e verifica dei fatti prima di decidere. Usa visione ampia con metodo per ridurre rumore strategico.',
    'transit:jupiter|quadratura|pluto':
      'Giove in quadratura con Plutone intensifica ambizione e puo spingere mosse da tutto-o-niente. Questo ciclo chiede strategia di lungo periodo per evitare usura da eccesso di forza. Dirigi crescita verso cambiamenti strutturali con governance chiara.',
    'transit:jupiter|quadratura|saturn':
      'Giove in quadratura con Saturno attiva conflitto tra impulso espansivo e limiti operativi reali. Questa fase chiede aggiustamenti di scopo, tempi e risorse per mantenere coerenza. Bilanciare audacia e disciplina tende a produrre progresso piu sostenibile.',
    'transit:jupiter|quadratura|sun':
      'Giove in quadratura al Sole puo gonfiare aspettative di prestazione ed esposizione oltre un ritmo sano. Il ciclo chiede di calibrare protagonismo e reale capacita esecutiva. Concentrati su cio che genera impatto concreto senza disperdere energia.',
    'transit:jupiter|quadratura|uranus':
      'Giove in quadratura con Urano puo alternare entusiasmo e rottura di piano in poco tempo. Questa fase chiede liberta con criterio per non sostituire la coerenza con novita continua. Innova per iterazioni e valida ogni aggiustamento prima di scalare.',
    'transit:jupiter|sextil|ascendente':
      'Giove in sestile all Ascendente favorisce fiducia sociale, apertura di contatti e presenza piu ricettiva. Il ciclo tende a sostenere opportunita quando postura e confini sono chiari. Usa la fase per ampliare raggio d azione con autenticita e misura.',
    'transit:jupiter|sextil|jupiter':
      'Giove in sestile con Giove favorisce espansione graduale e migliore lettura delle opportunita. Il periodo tende a essere produttivo per studio, strategia e riposizionamento nel medio termine. Cresci con pianificazione per consolidare guadagni durevoli.',
    'transit:jupiter|sextil|mars':
      'Giove in sestile con Marte combina iniziativa e visione di crescita con minore attrito esecutivo. Questa fase favorisce azione guidata da priorita chiare e obiettivi concreti. Dirigi energia verso fronti ad alto ritorno e mantieni revisioni di avanzamento.',
    'transit:jupiter|sextil|mercury':
      'Giove in sestile con Mercurio favorisce comunicazione, apprendimento e decisioni con maggiore chiarezza di contesto. Il ciclo sostiene conversazioni strategiche e organizzazione pratica delle idee. Sfrutta il momento per sbloccare temi in sospeso con linguaggio oggettivo.',
    'transit:jupiter|sextil|moon':
      'Giove in sestile con la Luna tende ad ampliare sostegno emotivo e una lettura piu costruttiva degli eventi. Questa fase favorisce conciliare sensibilita e pragmatismo nella routine. Piccoli aggiustamenti quotidiani possono portare sollievo e stabilita.',
    'transit:jupiter|sextil|neptune':
      'Giove in sestile con Nettuno favorisce ispirazione con maggiore potenziale di applicazione pratica. Questo ciclo tende a sostenere visione di lungo periodo quando intuizione e criterio restano in equilibrio. Trasforma percezioni in azioni verificabili e correggi rotta con revisioni regolari.',
    'transit:jupiter|sextil|pluto':
      'Giove in sestile con Plutone favorisce crescita con profondita, focus strategico e riposizionamento consapevole. Questa fase tende a sostenere decisioni di impatto quando eviti scorciatoie e procedi per fasi. Dai priorita a cambiamenti strutturali che mantengano risultati duraturi.',
    'transit:jupiter|sextil|saturn':
      'Giove in sestile con Saturno combina espansione e disciplina in un ritmo produttivo. Questo ciclo tende a facilitare progressi quando visione ampia incontra metodo, tempi e priorita chiare. Cresci con criterio per consolidare guadagni senza sovraccarico.',
    'transit:jupiter|sextil|uranus':
      'Giove in sestile con Urano favorisce innovazione con buon potenziale di implementazione graduale. Questa fase tende ad aprire opportunita fuori standard senza richiedere rotture brusche. Testa novita con metriche semplici e scala solo cio che dimostra utilita.',
    'transit:jupiter|sextil|venus':
      'Giove in sestile con Venere favorisce armonizzazione in relazioni, accordi e scelte di valore. Questo ciclo tende ad ampliare cooperazione quando reciprocita e confini sono chiari. Usa il flusso per rafforzare legami e priorizzare qualita dello scambio.',
    'transit:jupiter|trigono|ascendente':
      'Giove in trigono all Ascendente tende ad ampliare fiducia sociale, visibilita e apertura di percorsi. Questa fase favorisce espansione della presenza quando autenticita e misura procedono insieme. Usa lo slancio per consolidare un immagine coerente con la tua consegna reale.',
    'transit:jupiter|trigono|jupiter':
      'Giove in trigono con Giove favorisce espansione ampia con ritmo e prospettiva migliori. Questo ciclo tende a sostenere apprendimento, pianificazione strategica e crescita nel medio periodo. Mantenere criterio pratico aiuta a trasformare opportunita in guadagni consistenti.',
    'transit:jupiter|trigono|mars':
      'Giove in trigono con Marte combina iniziativa e slancio con maggiore fluidita esecutiva. Questa fase tende a sostenere azione affermativa quando priorita e direzione sono chiare. Dirigi energia verso fronti ad alto impatto e mantieni revisione dei progressi.',
    'transit:jupiter|trigono|mercury':
      'Giove in trigono con Mercurio favorisce comunicazione, sintesi e decisioni con chiarezza di contesto. Questo ciclo tende a sostenere conversazioni rilevanti e organizzazione pratica delle idee. Sfrutta la fase per allineare visione ed esecuzione con linguaggio oggettivo.',
    'transit:jupiter|trigono|moon':
      'Giove in trigono con la Luna tende ad aumentare integrazione emotiva e risposta costruttiva alle richieste quotidiane. Questa fase favorisce benessere quando sensibilita e pragmatismo si integrano. Piccoli aggiustamenti possono portare sollievo stabile e maggiore equilibrio interiore.',
    'transit:jupiter|trigono|neptune':
      'Giove in trigono con Nettuno favorisce ispirazione, comprensione simbolica e orientamento di senso. Questo ciclo tende a sostenere percezione sottile quando resta ancorata a criteri pratici. Traduci intuizione in passi concreti e mantieni verifiche di realta periodiche.',
    'transit:jupiter|trigono|pluto':
      'Giove in trigono con Plutone favorisce trasformazione profonda con espansione strategica e focus sostenuto. Questa fase tende a sostenere riposizionamenti di impatto quando l azione e deliberata e strutturale. Dai priorita a movimenti essenziali con coerenza di lungo periodo.',
    'transit:jupiter|trigono|saturn':
      'Giove in trigono con Saturno favorisce crescita consistente con base pratica e buon senso dei tempi. Questo ciclo tende a unire visione ampia e disciplina esecutiva, facilitando progressi con minore dispersione. Organizza priorita per fasi per consolidare risultati sostenibili.',
    'transit:jupiter|trigono|uranus':
      'Giove in trigono con Urano favorisce innovazione con adattamento fluido e minore bisogno di rotture brusche. Questa fase tende ad aprire opportunita originali quando sperimentazione e criterio restano insieme. Bilancia liberta e continuita per mantenere progresso concreto.',
    'transit:jupiter|trigono|venus':
      'Giove in trigono con Venere favorisce armonizzazione in relazioni, accordi e scelte di valore quotidiane. Questo ciclo tende ad ampliare cooperazione e buona disposizione quando aspettative e confini sono chiari. Usa la fase per rafforzare scambi di qualita con misura e coerenza.',
    'transit:mars|conjuncao|ascendente':
      'Marte in congiunzione all Ascendente aumenta impulso d azione e bisogno di affermazione personale. Questa fase tende a favorire iniziativa diretta quando priorita e reattivita sono ben regolate. Canalizza energia in mosse chiare con focus e autocontrollo.',
    'transit:mars|conjuncao|jupiter':
      'Marte in congiunzione con Giove amplifica coraggio, ambizione e slancio espansivo. Questo ciclo favorisce progressi quando audacia e strategia procedono insieme con ritmo realistico. Regola velocita e scopo per evitare eccesso di fiducia esecutiva.',
    'transit:mars|conjuncao|mars':
      'Marte in congiunzione con Marte intensifica energia d iniziativa e tono competitivo nella routine. Questa fase tende ad aumentare urgenza d azione, chiedendo disciplina per mantenere coerenza. Dirigi forza verso obiettivi chiari e riduci usura impulsiva.',
    'transit:mars|conjuncao|mercury':
      'Marte in congiunzione con Mercurio accelera pensiero, comunicazione e ritmo decisionale. Questo ciclo favorisce oggettivita quando premesse e messaggi vengono rivisti con cura. Evita conclusioni affrettate e mantieni criterio nei dialoghi sensibili.',
    'transit:mars|conjuncao|moon':
      'Marte in congiunzione con la Luna puo aumentare reattivita emotiva e richiesta di risposta immediata. Questa fase chiede equilibrio tra espressione affettiva e autocontrollo per evitare conflitti inutili. Brevi pause prima di agire aiutano a mantenere chiarezza e legame.',
    'transit:mars|conjuncao|neptune':
      'Marte in congiunzione con Nettuno combina impulso d azione con immaginazione e sensibilita ampliate. Questo ciclo favorisce creativita applicata quando intuizione resta ancorata a passi pratici. Rafforza criterio per non disperdere energia in obiettivi poco definiti.',
    'transit:mars|conjuncao|pluto':
      'Marte in congiunzione con Plutone intensifica volonta, profondita strategica e capacita di rompere schemi. Questa fase tende a potenziare decisioni di impatto quando direzione e autocontrollo sono presenti. Usa intensita con responsabilita per evitare scontri di potere.',
    'transit:mars|conjuncao|saturn':
      'Marte in congiunzione con Saturno combina forza esecutiva e limite strutturale nello stesso punto. Questo ciclo puo richiedere pazienza attiva per trasformare pressione in progresso coerente. Avanza per fasi con metodo per ridurre attrito e spreco.',
    'transit:mars|conjuncao|sun':
      'Marte in congiunzione al Sole rafforza protagonismo, iniziativa e volonta di guidare la tua agenda. Questa fase favorisce azione affermativa quando intensita e priorita reali sono equilibrate. Concentrati sull essenziale per convertire impulso in risultato concreto.',
    'transit:mars|conjuncao|uranus':
      'Marte in congiunzione con Urano accelera cambiamento e aumenta bisogno di liberta nell azione. Questo ciclo puo aprire opportunita fuori schema, chiedendo risposte rapide ma con criterio. Innova in sicurezza per evitare rotture impulsive.',
    'transit:mars|conjuncao|venus':
      'Marte in congiunzione con Venere amplifica magnetismo, desiderio e bisogno di allineare affetto e azione. Questa fase favorisce avvicinamenti quando confini e aspettative sono chiari. Bilancia intensita e ascolto per mantenere qualita negli scambi.',
    'transit:mars|oposicao|jupiter':
      'Marte in opposizione con Giove puo amplificare impulso di conquista oltre quanto il contesto sostiene. Questa fase chiede equilibrio tra coraggio e criterio per evitare rischio esecutivo eccessivo. Regola scopo e ritmo per mantenere risultati di qualita.',
    'transit:mars|oposicao|mars':
      'Marte in opposizione con Marte tende ad attivare conflitto di ritmo, volonta e direzione tra poli opposti. Questo ciclo chiede regolazione dell intensita per ridurre attrito e dispersione energetica. Concentrati su obiettivi comuni ed evita confronto reattivo.',
    'transit:mars|oposicao|meio_do_ceu':
      'Marte in opposizione al Medio Cielo puo mettere in tensione ambizione pubblica e stabilita della base personale. Questa fase chiede allineamento tra priorita esterne e reale capacita energetica. Riorganizza agenda e responsabilita per mantenere coerenza nel tempo.',
    'transit:mars|oposicao|mercury':
      'Marte in opposizione con Mercurio puo aumentare fretta mentale, dibattito reattivo e difficolta di ascolto. Questo ciclo chiede di rallentare le conclusioni e qualificare gli argomenti prima di decidere. Comunicazione oggettiva e pause strategiche riducono rumore e conflitto.',
    'transit:mars|oposicao|moon':
      'Marte in opposizione con la Luna puo aumentare irritazione emotiva e richiesta di risposta immediata nei legami vicini. Questa fase chiede equilibrio tra assertivita e cura per evitare usura relazionale. Regola ritmo interno prima di agire su temi sensibili.',
    'transit:mars|oposicao|neptune':
      'Marte in opposizione con Nettuno puo alternare impulso e dubbio, con rischio di dispersione in obiettivi poco chiari. Questo ciclo chiede di tradurre intuizione in piano semplice e verificabile per mantenere direzione realistica. Evita azioni impulsive senza controllo di contesto e priorita.',
    'transit:mars|oposicao|pluto':
      'Marte in opposizione con Plutone intensifica dinamiche di potere, controllo e resistenza nei processi chiave. Questa fase chiede autocontrollo per non trasformare tensione in confronto improduttivo. Dirigi forza su strategia e aggiustamento strutturale, non su escalation del conflitto.',
    'transit:mars|oposicao|saturn':
      'Marte in opposizione con Saturno puo dare sensazione di freno tra impulso d azione e limite operativo. Questo ciclo chiede pazienza attiva, metodo e avanzamento per fasi per ridurre frustrazione. La perseveranza organizzata tende a funzionare meglio della fretta.',
    'transit:mars|oposicao|sun':
      'Marte in opposizione al Sole puo mettere in tensione protagonismo, autorita e stile di affermazione personale. Questa fase chiede intensita calibrata per sostenere cooperazione senza perdere fermezza di direzione. Agisci con obiettivo chiaro e minore bisogno di dimostrare forza.',
    'transit:mars|oposicao|uranus':
      'Marte in opposizione con Urano puo portare cambi rapidi e impulso di rottura sotto pressione. Questo ciclo chiede liberta con criterio per non sostituire strategia con reazione immediata. Aggiustamenti veloci funzionano meglio con piano di contingenza.',
    'transit:mars|oposicao|venus':
      'Marte in opposizione con Venere puo aumentare polarita tra desiderio, affetto e modalita di negoziare vicinanza. Questa fase chiede allineamento di aspettative e confini per evitare oscillazione tra avvicinamento e conflitto. Ascolto attivo e accordi chiari rafforzano la qualita dello scambio.',
    'transit:mars|quadratura|ascendente':
      'Marte in quadratura all Ascendente puo aumentare irritazione, fretta e attrito di postura nelle interazioni. Questa fase chiede di regolare lo stile assertivo per mantenere chiarezza senza escalation. Agisci con intenzione oggettiva e riduci reazione automatica.',
    'transit:mars|quadratura|jupiter':
      'Marte in quadratura con Giove tende ad ampliare impulso e rischio oltre quanto il contesto sostiene. Questo ciclo chiede calibrare ambizione e criterio per evitare scommesse eccessive in esecuzione. Dai priorita agli obiettivi centrali e procedi per blocchi verificabili.',
    'transit:mars|quadratura|mars':
      'Marte in quadratura con Marte intensifica attrito tra volonta, ritmo e direzione dell azione. Questa fase puo aumentare competitivita e usura quando le priorita non sono coordinate. Usa focus disciplinato per convertire tensione in produttivita.',
    'transit:mars|quadratura|mercury':
      'Marte in quadratura con Mercurio puo accelerare parola e pensiero con minore ascolto e precisione. Questo ciclo chiede revisione degli argomenti e meno conclusioni impulsive. Comunicazione semplice e verifica dei fatti riducono rumore e rilavorazioni.',
    'transit:mars|quadratura|moon':
      'Marte in quadratura con la Luna puo aumentare oscillazione emotiva e risposta difensiva nei temi sensibili. Questa fase chiede di regolare reattivita prima di decidere o confrontare. Brevi pause e routine di supporto aiutano a mantenere equilibrio.',
    'transit:mars|quadratura|neptune':
      'Marte in quadratura con Nettuno puo mescolare urgenza e indefinizione, creando dispersione energetica. Questo ciclo chiede di tradurre intuizione in piano concreto con fasi brevi. Evita azioni senza verificare obiettivo, contesto e limite reale.',
    'transit:mars|quadratura|pluto':
      'Marte in quadratura con Plutone intensifica tensione di potere, controllo e forza di volonta. Questa fase chiede autocontrollo per non trasformare pressione in confronto improduttivo. Dirigi intensita verso aggiustamento strutturale e strategia coerente.',
    'transit:mars|quadratura|saturn':
      'Marte in quadratura con Saturno puo portare frustrazione tra impulso d azione e restrizione operativa. Questo ciclo chiede pazienza attiva, metodo e ritmo sostenibile per ridurre usura. Il progresso per fasi tende a funzionare meglio della fretta.',
    'transit:mars|quadratura|sun':
      'Marte in quadratura al Sole puo mettere in tensione protagonismo, autorita e stile di guida. Questa fase chiede equilibrio tra fermezza e cooperazione per mantenere efficienza. Concentrati su consegna oggettiva con minore disputa di ego.',
    'transit:mars|quadratura|uranus':
      'Marte in quadratura con Urano puo portare rotture di ritmo e impulso di cambiamento brusco. Questo ciclo chiede innovazione con criterio per evitare decisioni reattive. Aggiustamenti progressivi con piano di contingenza preservano i risultati.',
    'transit:mars|quadratura|venus':
      'Marte in quadratura con Venere puo mettere in tensione desiderio, affetto e aspettativa di reciprocita. Questa fase chiede allineare confini e negoziazione chiara per evitare oscillazione relazionale. Ascolto attivo e accordi semplici migliorano la qualita del legame.',
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
    'transit:jupiter|conjuncao|ascendente':
      'Giove in congiunzione all Ascendente puo ampliare presenza, fiducia e disponibilita ad avviare movimenti personali. Questa fase favorisce visibilita quando entusiasmo e direzione chiara procedono insieme. Evita promesse eccessive e mantieni coerenza con la consegna reale.',
    'transit:jupiter|conjuncao|jupiter':
      'Giove in congiunzione con Giove segna una finestra di espansione e riposizionamento della visione. Questo ciclo favorisce crescita quando obiettivi ampi diventano passi pratici. Dai priorita a opportunita compatibili con la tua capacita attuale.',
    'transit:jupiter|conjuncao|mars':
      'Giove in congiunzione con Marte aumenta iniziativa, coraggio e spinta ad accelerare decisioni. Questa fase tende a funzionare meglio con focus tattico e ritmo regolato. Convoglia energia su obiettivi concreti per evitare dispersione da eccesso di azione.',
    'transit:jupiter|conjuncao|mercury':
      'Giove in congiunzione con Mercurio amplia repertorio mentale, apprendimento e capacita comunicativa. Il periodo favorisce studio, accordi e pianificazione con visione piu ampia. Struttura argomenti con chiarezza per trasformare intuizione in risultato utile.',
    'transit:jupiter|conjuncao|sun':
      'Giove in congiunzione al Sole rafforza fiducia, direzione e apertura a nuovi cicli di crescita. Questa fase supporta protagonismo quando intenzione ed esecuzione restano coerenti. Usa visibilita con criterio per consolidare progressi reali.',
    'transit:jupiter|conjuncao|venus':
      'Giove in congiunzione con Venere favorisce armonizzazione di relazioni, valori e scelte di benessere. Il ciclo tende ad ampliare opportunita affettive e finanziarie quando reciprocita e limiti sono chiari. Sfrutta il flusso con moderazione per mantenere qualita nel lungo periodo.',
    'transit:jupiter|ingress|house_1':
      'Giove in ingresso in Casa 1 inaugura una fase di espansione personale, con piu iniziativa e desiderio di riposizionamento. Il periodo favorisce cambi di postura, immagine e direzione con orizzonte piu ampio. Avanza con autenticita e focus sostenibile.',
    'transit:jupiter|ingress|house_3':
      'Giove in ingresso in Casa 3 amplia comunicazione, apprendimento e scambi con l ambiente vicino. Questa fase favorisce studio, conversazioni strategiche e circolazione di idee con maggiore portata. Organizza priorita per trasformare informazione in decisioni utili.',
    'transit:jupiter|ingress|house_5':
      'Giove in ingresso in Casa 5 aumenta creativita, espressione personale e apertura a esperienze piacevoli. Il ciclo favorisce progetti autoriali, romance e iniziative autentiche. Usa entusiasmo con criterio per mantenere continuita e qualita.',
    'transit:jupiter|ingress|house_10':
      'Giove in ingresso in Casa 10 tende ad aprire una fase di crescita in carriera, reputazione e obiettivi pubblici. Questa finestra favorisce avanzamenti quando visione strategica ed esecuzione costante lavorano insieme. Dai priorita a consegne chiave e consolida autorevolezza con risultati osservabili.',
    'transit:saturn|conjuncao|ascendente':
      'Saturno in congiunzione all Ascendente segna una fase di riposizionamento personale con maggiore sobrieta e responsabilita. Questo ciclo chiede di rivedere postura, confini e modo di presentarti nella quotidianita. Consolida scelte di lungo periodo con disciplina e continuita.',
    'transit:saturn|conjuncao|meio_do_ceu':
      'Saturno in congiunzione al Medio Cielo tende a concentrare focus su carriera, reputazione e impegni pubblici. La fase favorisce strutturare obiettivi quando consegna e criterio restano costanti. Dai priorita all essenziale e rafforza autorevolezza con risultati concreti.',
    'transit:saturn|conjuncao|sun':
      'Saturno in congiunzione al Sole puo aumentare pressione interna e bisogno di riorganizzare direzione personale. Questo ciclo richiede maturita, focus sull essenziale e ritmo sostenibile per consolidare progressi. Lavora con obiettivi realistici ed esecuzione quotidiana coerente.',
    'transit:saturn|conjuncao|moon':
      'Saturno in congiunzione con Luna tende a portare sobrieta emotiva e revisione dei bisogni di sicurezza. La fase richiede rafforzare routine di cura, confini e stabilita affettiva nel quotidiano. Piccoli aggiustamenti costanti aiutano a ridurre sovraccarico interno.',
    'transit:saturn|conjuncao|mercury':
      'Saturno in congiunzione con Mercurio aumenta richiesta mentale, focus e bisogno di organizzare pensiero con metodo. Il ciclo favorisce studio disciplinato, revisione delle premesse e comunicazione oggettiva. Ordina informazioni per priorita prima di decidere.',
    'transit:saturn|conjuncao|venus':
      'Saturno in congiunzione con Venere puo chiedere maturita in legami, valori e scelte di benessere. La fase favorisce chiarire reciprocita e limiti per proteggere cio che ha qualita reale. Investi nel coerente ed evita idealizzazione o eccesso.',
    'transit:saturn|conjuncao|mars':
      'Saturno in congiunzione con Marte combina spinta d azione con bisogno di tecnica e controllo del ritmo. Il ciclo richiede efficienza, costanza e minore reattivita per preservare energia. Convoglia forza in fasi definite e obiettivi verificabili.',
    'transit:saturn|conjuncao|saturn':
      'Saturno in congiunzione con Saturno segna un ciclo di maturazione strutturale e revisione delle responsabilita centrali. La fase richiede semplificare priorita, ricalibrare obiettivi e sostenere cio che conta davvero. Decisioni coerenti ora rafforzano il lungo periodo.',
    'transit:saturn|ingress|house_1':
      'Saturno in ingresso in Casa 1 avvia una fase di ridefinizione personale con piu disciplina e responsabilita. Il periodo favorisce consolidare identita e direzione tramite scelte concrete quotidiane. Avanza con costanza e confini salutari.',
    'transit:saturn|ingress|house_3':
      'Saturno in ingresso in Casa 3 chiede di organizzare routine mentale, comunicazione e studio con metodo. Questa fase favorisce apprendimento consistente, accordi oggettivi e minore dispersione. Struttura agenda e messaggi per ottenere chiarezza pratica.',
    'transit:saturn|ingress|house_5':
      'Saturno in ingresso in Casa 5 puo portare maturita a creativita, romance ed espressione personale. Il ciclo favorisce qualita e continuita quando processo e limiti sono chiari. Costruisci piacere con responsabilita e intenzione.',
    'transit:uranus|conjuncao|moon':
      'Urano in congiunzione con Luna tende a intensificare bisogno di liberta emotiva e aggiornamento delle abitudini affettive. Questa fase puo portare oscillazioni d umore e cambiamenti inattesi nella routine. Regola il ritmo interno e aggiorna il supporto in modo graduale.',
    'transit:uranus|conjuncao|mercury':
      'Urano in congiunzione con Mercurio amplia irrequietezza mentale, idee nuove e desiderio di rivedere convinzioni rapidamente. Il ciclo favorisce innovazione intellettuale quando il metodo aiuta a dare priorita all essenziale. Trasforma insight in esperimenti pratici e misurabili.',
    'transit:uranus|conjuncao|venus':
      'Urano in congiunzione con Venere puo accelerare revisioni in relazioni, valori e scelte di piacere. La fase favorisce autenticita e nuovi formati di scambio quando i confini sono chiari. Innova con consapevolezza per mantenere reciprocita e stabilita.',
    'transit:uranus|conjuncao|mars':
      'Urano in congiunzione con Marte aumenta impulso d azione, urgenza di cambiamento e risposta rapida ai limiti. Il ciclo funziona meglio quando energia e incanalata con strategia e focus oggettivo. Riduci reattivita ed esegui in passi brevi validati.',
    'transit:uranus|conjuncao|jupiter':
      'Urano in congiunzione con Giove tende ad ampliare visione futura con forte spinta alla sperimentazione. Questa fase favorisce nuove opportunita quando il rischio e calibrato con criterio. Cresci per iterazione, evitando mosse estreme.',
    'transit:uranus|conjuncao|uranus':
      'Urano in congiunzione con Urano segna un ciclo di rinnovamento strutturale dell identita e della direzione di vita. La fase puo richiedere riposizionamento profondo verso autenticita attuale. Avanza con flessibilita e base pratica.',
    'transit:uranus|ingress|house_1':
      'Urano in ingresso in Casa 1 avvia una fase di riposizionamento personale, autonomia e cambio di postura. Il periodo favorisce aggiornare identita e stile d azione con maggiore autenticita. Rinnova presenza senza perdere coerenza.',
    'transit:uranus|ingress|house_3':
      'Urano in ingresso in Casa 3 amplia movimento mentale, scambio di idee e revisione dei pattern comunicativi. La fase favorisce apprendimento rapido e nuovi formati di connessione locale. Organizza il flusso informativo per evitare dispersione.',
    'transit:uranus|ingress|house_5':
      'Urano in ingresso in Casa 5 puo aprire una fase piu libera di creativita, con cambiamenti in piacere ed espressione personale. Il ciclo favorisce sperimentare linguaggi nuovi con intenzione autentica. Innova mantenendo responsabilita affettiva e continuita.',
    'transit:uranus|ingress|house_10':
      'Urano in ingresso in Casa 10 tende ad aprire un punto di svolta in carriera, reputazione e direzione pubblica. La fase favorisce aggiornamento professionale quando audacia e strategia procedono insieme. Riposiziona obiettivi e testa nuove rotte con metriche oggettive.',
  
    'transit:neptune|ingress|house_1':
      'Nettuno in ingresso in Casa 1 puo aumentare sensibilita su identita, confini e direzione personale. Questa fase chiede piu chiarezza nelle scelte di immagine per evitare confusione. Mantenere routine semplice e riferimenti concreti aiuta a sostenere coerenza.',
    'transit:neptune|ingress|house_3':
      'Nettuno in ingresso in Casa 3 puo ampliare immaginazione, lettura simbolica e comunicazione soggettiva. Il ciclo chiede maggiore discernimento con messaggi, supposizioni e interpretazioni. Organizza il flusso informativo e conferma i dettagli prima di decidere.',
    'transit:neptune|ingress|house_5':
      'Nettuno in ingresso in Casa 5 puo intensificare creativita, idealizzazione romantica e proiezione affettiva. Questa fase favorisce espressione artistica quando aspettative restano realistiche. Usa ispirazione con limiti pratici per mantenere continuita.',
    'transit:neptune|ingress|house_10':
      'Nettuno in ingresso in Casa 10 puo attivare domande su vocazione, senso e posizionamento pubblico. Il periodo favorisce allineamento di scopo, ma richiede realismo in obiettivi ed esposizione. Valida direzione con tappe osservabili e accordi chiari.',
    'transit:neptune|conjuncao|sun':
      'Nettuno in congiunzione con Sole puo ampliare sensibilita, immaginazione e ricerca di senso nella direzione personale. Questa fase richiede riferimenti identitari chiari per evitare perdita di focus. Mantieni impegni realistici e verifica le ipotesi prima di scelte importanti.',
    'transit:neptune|conjuncao|moon':
      'Nettuno in congiunzione con Luna puo aumentare permeabilita emotiva, empatia e lettura soggettiva del contesto. Il ciclo richiede confini affettivi e routine chiare per evitare sovraccarico o confusione. Riposo, centratura e comunicazione diretta favoriscono stabilita.',
    'transit:neptune|conjuncao|mercury':
      'Nettuno in congiunzione con Mercurio puo ampliare pensiero simbolico e intuizione, riducendo precisione mentale. Questa fase richiede attenzione nella comunicazione e verifica dei fatti prima delle conclusioni. Scrivi priorita in modo chiaro ed evita decisioni basate solo su impressioni.',
    'transit:neptune|conjuncao|venus':
      'Nettuno in congiunzione con Venere puo aumentare idealizzazione in relazioni, valori e scelte di piacere. Il ciclo favorisce sensibilita e raffinatezza quando reciprocita e limiti restano espliciti. Osserva segnali concreti prima di impegni affettivi o finanziari.',
    'transit:neptune|conjuncao|mars':
      'Nettuno in congiunzione con Marte puo rendere meno chiari iniziativa, ritmo e uso della forza nell azione. Questa fase richiede cadenza intenzionale, priorita chiare ed esecuzione disciplinata. Convoglia energia su pochi obiettivi essenziali per ridurre dispersione.',
    'transit:neptune|conjuncao|jupiter':
      'Nettuno in congiunzione con Giove puo ampliare visione e spiritualita, con rischio di aspettative eccessive. Il periodo richiede equilibrio tra fiducia e realismo per mantenere espansione sostenibile. Tieni i piani ancorati a evidenze, timing e risorse.',
    'transit:neptune|conjuncao|saturn':
      'Nettuno in congiunzione con Saturno puo mettere alla prova strutture confrontando certezza con sensibilita e ambiguita. Questa fase richiede pianificazione flessibile e criteri chiari per evitare rigidita o fuga. Ricostruisci basi gradualmente con verifiche realistiche.',
    'transit:neptune|conjuncao|neptune':
      'Nettuno in congiunzione con Nettuno segna un riallineamento di ciclo lungo su senso, intuizione e proiezione. La fase puo dissolvere riferimenti vecchi e chiedere orientamento piu sottile. Mantieni ancoraggi pratici attivi mentre riorganizzi visione interiore.',
    'transit:neptune|conjuncao|ascendente':
      'Nettuno in congiunzione all Ascendente puo rendere piu porosi i confini personali e modificare la percezione della tua presenza. Questa fase richiede coerenza tra immagine, intenzione e azione concreta. Chiarisci limiti e aspettative per ridurre rumore relazionale.',

    // ── Mars completion ────────────────────────────────────────────────────
    'transit:mars|sextil|sun':
      'Marte in sextile al Sole favorisce iniziativa con lettura chiara di direzione personale e energia disponibile. Questo ciclo tende a supportare azione focalizzata quando volonta e priorita reale sono integrate. Usa il momento per avanzare obiettivi concreti con obiettivita.',
    'transit:mars|sextil|meio_do_ceu':
      'Marte in sextile al Medio Cielo favorisce iniziativa professionale con buon ritmo e allineamento di direzione. Questo ciclo tende a supportare mosse strategiche quando il focus e su obiettivi di visibilita. Esegui per priorita e monitora avanzamento con criteri chiari.',
    'transit:mars|trigono|sun':
      'Marte in trigono al Sole rafforza il flusso tra iniziativa e senso di direzione. Questa fase tende a favorire avanzamento con meno reattivita e piu intenzione consapevole. Concentrati sull essenziale e consolida risultati con consistenza.',
    'transit:mars|trigono|meio_do_ceu':
      'Marte in trigono al Medio Cielo amplia la disponibilita ad agire sugli obiettivi professionali con buona gestione energetica. Questa fase supporta avanzamento professionale quando la direzione e chiara e consistente. Consolida risultati eseguendo in tappe obiettive.',
    'transit:mars|oposicao|ascendente':
      'Marte in opposizione all Ascendente puo aumentare tensione di postura e impulso confrontazionale nelle interazioni quotidiane. Questa fase chiede di regolare intensita per preservare obiettivita senza perdere fermezza. Agisci con intenzione chiara e riduci reazioni automatiche.',
    'transit:mars|ingress|house_1':
      'Marte in ingresso nella Casa 1 aumenta energia personale, iniziativa e necessita di affermare la propria direzione. Questa fase favorisce avanzamento quando focus e controllo del ritmo prevengono impulsivita. Esegui per priorita e monitora livelli di energia.',
    'transit:mars|ingress|house_2':
      'Marte in ingresso nella Casa 2 intensifica la spinta ad agire su risorse, valori e sicurezza materiale. Questo periodo puo portare urgenza di risolvere questioni finanziarie o materiali con piu forza. Canalizza energia in aggiustamenti pratici con criteri di rischio chiari.',
    'transit:mars|ingress|house_3':
      'Marte in ingresso nella Casa 3 accelera comunicazione, studio e movimento locale. Questa fase puo portare discorso piu assertivo, con rischio di impazienza nel tono. Canalizza energia in conversazioni produttive ed evita risposte impulsive.',
    'transit:mars|ingress|house_5':
      'Marte in ingresso nella Casa 5 aumenta energia creativa, impulso espressivo e disponibilita per progetti personali. Questo ciclo favorisce iniziativa quando il focus e organizzato e il rischio affettivo e moderato. Canalizza impulso nella creazione con continuita.',
    'transit:mars|ingress|house_6':
      'Marte in ingresso nella Casa 6 aumenta disponibilita a gestire pendenze e riorganizzare routine lavorative. Questo periodo favorisce efficienza quando metodo e priorita sono ben definite. Evita sovraccarico eccessivo e monitora energia disponibile.',
    'transit:mars|ingress|house_7':
      'Marte in ingresso nella Casa 7 intensifica dinamiche di partnership, negoziazione e allineamento di limiti nelle relazioni. Questo ciclo puo portare maggiore assertivita negli accordi, con rischio di attrito se manca ascolto. Adatta postura per preservare cooperazione senza cedere fermezza.',
    'transit:mars|ingress|house_8':
      'Marte in ingresso nella Casa 8 intensifica la spinta a gestire risorse condivise, fiducia e trasformazione interna. Questa fase favorisce azione su questioni profonde pendenti quando ci sono criterio e trasparenza. Avanza con cura ed evita confronti forzati.',
    'transit:mars|ingress|house_9':
      'Marte in ingresso nella Casa 9 amplia iniziativa di studiare, pianificare e ampliare prospettiva di lungo raggio. Questo periodo favorisce azione in progetti educativi o di espansione quando gli obiettivi sono chiari. Usa energia per tradurre visione in piani concreti.',
    'transit:mars|ingress|house_11':
      'Marte in ingresso nella Casa 11 aumenta disponibilita a impegnarsi in reti, progetti collettivi e obiettivi futuri. Questa fase favorisce leadership nelle collaborazioni quando focus e reciprocita reale sono presenti. Canalizza energia verso alleanze con scopo e ritorni concreti.',
    'transit:mars|ingress|house_12':
      'Marte in ingresso nella Casa 12 puo attivare impulso interiore di risolvere questioni vecchie e organizzare processi di chiusura. Questo ciclo favorisce azione tranquilla e preparatoria quando ci sono criterio e riposo adeguato. Evita precipitare e rispetta il ritmo di recupero.',

    // ── Mercury sextile ────────────────────────────────────────────────────
    'transit:mercury|sextil|sun':
      'Mercurio in sextile al Sole favorisce integrazione tra chiarezza mentale e senso di direzione. Questa fase tende a supportare decisioni e comunicazioni allineate con priorita reali. Usa il momento per organizzare messaggi chiave e avanzare con consistenza.',
    'transit:mercury|sextil|moon':
      'Mercurio in sextile con la Luna facilita la traduzione di emozione in linguaggio chiaro e adattabile nella vita quotidiana. Questo ciclo tende a supportare conversazioni attente con piu obiettivita. Usa il momento per nominare bisogni e aggiustare aspettative con ascolto attivo.',
    'transit:mercury|sextil|mercury':
      'Mercurio in sextile con Mercurio favorisce fluidita mentale, revisione di idee e connessioni rapide di informazione. Questa fase tende a supportare studio, scrittura e organizzazione di processi con piu agilita. Approfitta per sbloccare pendenze con linguaggio obiettivo.',
    'transit:mercury|sextil|venus':
      'Mercurio in sextile con Venere favorisce diplomazia, espressione di valori e conversazione con eleganza relazionale. Questo ciclo tende a facilitare accordi quando forma e contenuto sono bilanciati. Usa questa fase per rafforzare scambi con gentilezza senza perdere assertivita.',
    'transit:mercury|sextil|mars':
      'Mercurio in sextile con Marte favorisce decisioni rapide, argomentazione assertiva e comunicazione obiettiva. Questo ciclo tende a supportare negoziazioni quando il focus e chiaro e l ascolto e attivo. Avanza con chiarezza in conversazioni strategiche ed evita risposte affrettate.',
    'transit:mercury|sextil|jupiter':
      'Mercurio in sextile con Giove favorisce visione di contesto ampia con criteri di dettaglio accessibili. Questo ciclo tende a supportare apprendimento e pianificazione quando ottimismo e bilanciato con rigore. Traduci idee ampie in piani verificabili con tappe chiare.',
    'transit:mercury|sextil|saturn':
      'Mercurio in sextile con Saturno favorisce organizzazione di informazioni, struttura di argomenti e comunicazione chiara. Questa fase tende a supportare decisioni quando metodo e pratica procedono insieme. Struttura pendenze per rilevanza e avanza con criteri verificabili.',
    'transit:mercury|sextil|uranus':
      'Mercurio in sextile con Urano favorisce innovazione nelle idee e apertura a nuove connessioni informative. Questo ciclo tende a supportare creativita quando curiosita e focus operativo sono attivi. Testa approcci nuovi prima di scalare e mantieni continuita nei progetti chiave.',
    'transit:mercury|sextil|neptune':
      'Mercurio in sextile con Nettuno favorisce intuizione, lettura simbolica e connessione tra logica e sensibilita. Questa fase tende a supportare creativita e insight quando c e verifica pratica dei dati. Documenta percezioni rilevanti e confronta con evidenza prima di concludere.',
    'transit:mercury|sextil|pluto':
      'Mercurio in sextile con Plutone favorisce profondita analitica, revisione di assunti e precisione nella ricerca. Questo ciclo tende a supportare decisioni strategiche quando rigore e apertura coesistono. Usa il periodo per rivedere temi complessi con metodo e focus chiaro.',
    'transit:mercury|sextil|ascendente':
      'Mercurio in sextile all Ascendente favorisce comunicazione personale fluida e posizionamento piu chiaro. Questa fase tende a supportare conversazioni, presentazioni e aggiustamenti di immagine con agilita. Organizza messaggi e usa il periodo per rafforzare coerenza tra espressione e intenzione.',
    'transit:mercury|sextil|meio_do_ceu':
      'Mercurio in sextile al Medio Cielo favorisce comunicazione strategica e posizionamento professionale con piu fluidita. Questa fase tende a supportare visibilita quando narrativa e consegna sono allineate. Organizza messaggi chiave e mantieni consistenza nella comunicazione pubblica.',

    // ── Mercury trigono ───────────────────────────────────────────────────
    'transit:mercury|trigono|sun':
      'Mercurio in trigono al Sole rafforza la fluidita tra pensiero e senso di direzione personale. Questa fase tende a favorire comunicazione con piu intenzione e meno attrito. Usa il periodo per organizzare idee prioritarie e articolare direzione con chiarezza.',
    'transit:mercury|trigono|moon':
      'Mercurio in trigono con la Luna favorisce integrazione naturale tra pensiero e sensibilita emotiva. Questo ciclo tende a supportare conversazioni con maggiore empatia e comprensione reciproca. Approfitta della facilita del periodo per nominare cio che conta con calma.',
    'transit:mercury|trigono|mercury':
      'Mercurio in trigono con Mercurio facilita fluidita mentale, memoria e elaborazione di informazioni con meno attrito. Questa fase tende a supportare apprendimento, scrittura e revisione di criteri con buon ritmo. Organizza priorita e avanza in pendenze intellettuali con metodo.',
    'transit:mercury|trigono|venus':
      'Mercurio in trigono con Venere favorisce comunicazione armonizzante, diplomazia ed espressione di affetto con eleganza. Questo ciclo tende a facilitare conversazioni affettive o di valore con piu fluidita. Approfitta del periodo per rafforzare legami con chiarezza e cura reciproca.',
    'transit:mercury|trigono|mars':
      'Mercurio in trigono con Marte favorisce comunicazione assertiva con buon ritmo ed efficienza esecutiva. Questa fase tende a supportare conversazioni produttive quando pensiero e azione sono allineati. Avanza in negoziazioni e decisioni con chiarezza e focus operativo.',
    'transit:mercury|trigono|jupiter':
      'Mercurio in trigono con Giove favorisce visione strategica, espansione di idee e fluidita nell apprendimento. Questo ciclo tende a supportare pianificazione quando ampiezza di prospettiva va con criterio di dettaglio. Traduci insight in piani con tappe verificabili e realistiche.',
    'transit:mercury|trigono|saturn':
      'Mercurio in trigono con Saturno favorisce pensiero strutturato, pianificazione chiara e decisioni con criterio solido. Questa fase tende a supportare organizzazione e documentazione con maggiore precisione. Consolida apprendimenti e avanza nelle responsabilita con metodo fermo.',
    'transit:mercury|trigono|uranus':
      'Mercurio in trigono con Urano facilita apertura a idee nuove e connessioni inaspettate con focus produttivo. Questo ciclo tende a supportare creativita quando innovazione e continuita si equilibrano. Testa prospettive originali e documenta apprendimenti prima di scalare.',
    'transit:mercury|trigono|neptune':
      'Mercurio in trigono con Nettuno favorisce immaginazione, intuizione e lettura sottile di contesti. Questa fase tende a supportare espressione creativa quando verifica dei dati fa parte del processo. Documenta insight con precisione per separare percezione da evidenza.',
    'transit:mercury|trigono|pluto':
      'Mercurio in trigono con Plutone favorisce profondita di analisi, revisione di assunti e decisioni strategiche. Questo ciclo tende a supportare ricerca e comunicazione con piu potere di convinzione. Usa il periodo per approfondire temi chiave con rigore e apertura.',
    'transit:mercury|trigono|ascendente':
      'Mercurio in trigono all Ascendente favorisce comunicazione personale fluida, presentazioni chiare e posizionamento efficace. Questa fase tende a facilitare espressione autentica con buon impatto nell ambiente. Usa il periodo per articolare messaggi prioritari con coerenza e precisione.',
    'transit:mercury|trigono|meio_do_ceu':
      'Mercurio in trigono al Medio Cielo favorisce comunicazione strategica fluida e costruzione di narrativa professionale. Questa fase tende a facilitare visibilita quando immagine e consegna sono ben allineate. Mantieni messaggi semplici, consistenti e orientati ai risultati.',

    // ── Mercury oposicao ──────────────────────────────────────────────────
    'transit:mercury|oposicao|sun':
      'Mercurio in opposizione al Sole puo tensionare intenzione e forma di comunicare direzione, generando rumore tra piano e esecuzione. Il periodo chiede di rivedere premesse e allineare messaggio centrale prima di decisioni importanti. Semplifica narrativa e valida priorita con chiarezza.',
    'transit:mercury|oposicao|moon':
      'Mercurio in opposizione con la Luna puo amplificare conflitto tra bisogno emotivo e comunicazione obiettiva. Il ciclo chiede cura con messaggi impulsivi e interpretazioni affrettate nel quotidiano. Fermati, organizza cio che senti e comunica con piu calma e precisione.',
    'transit:mercury|oposicao|mercury':
      'Mercurio in opposizione con Mercurio puo attivare divergenza di riferimenti, ritmo di ragionamento e criteri decisionali. La fase chiede di rivedere premesse con metodo per evitare rilavorazione da rumore comunicativo. Valida interpretazioni chiave prima di chiudere accordi.',
    'transit:mercury|oposicao|venus':
      'Mercurio in opposizione con Venere puo tensionare diplomazia e franchezza in conversazioni affettive o di valore. Il ciclo chiede di bilanciare forma e contenuto per preservare legame senza omettere punti essenziali. Aggiusta aspettativa e linguaggio per sostenere reciprocita.',
    'transit:mercury|oposicao|mars':
      'Mercurio in opposizione con Marte puo aumentare velocita di eloquio e argomentazione con calo di ascolto e precisione. La fase chiede cura con risposte reattive e conclusioni affrettate in conversazioni sensibili. Conferma fatti, semplifica messaggi e avanza con obiettivita.',
    'transit:mercury|oposicao|jupiter':
      'Mercurio in opposizione con Giove puo amplificare discorso e visione ampia con meno criterio di verifica del dettaglio. Il ciclo chiede di bilanciare entusiasmo di idea con controllo pratico prima di decidere. Semplifica e dai priorita a cio che e concretamente fattibile ora.',
    'transit:mercury|oposicao|saturn':
      'Mercurio in opposizione con Saturno puo tensionare ritmo mentale e forma di comunicare con maggiore esigenza strutturale. La fase chiede metodo, pazienza e criteri espliciti per evitare blocco decisionale. Organizza argomenti e documenta accordi con calma.',
    'transit:mercury|oposicao|uranus':
      'Mercurio in opposizione con Urano puo portare oscillazione rapida di idea e tensione tra innovazione e consistenza. Il ciclo chiede di contenere impulsi di rottura comunicativa senza soffocare apertura al nuovo. Valida approcci nuovi prima di scalare e mantieni continuita.',
    'transit:mercury|oposicao|neptune':
      'Mercurio in opposizione con Nettuno puo aumentare ambiguita, supposizioni e mancanza di chiarezza in dati importanti. La fase chiede di confermare fatti, date e responsabilita con piu rigore prima di concludere. Documenta accordi per iscritto e valida comprensione reciproca.',
    'transit:mercury|oposicao|pluto':
      'Mercurio in opposizione con Plutone puo intensificare controllo narrativo, rigidita di punto di vista e tensione in dispute interpretative. Il ciclo chiede rigore analitico senza confronto inutile. Concentrati su evidenza verificabile e mantieni apertura alla sfumatura.',
    'transit:mercury|oposicao|ascendente':
      'Mercurio in opposizione all Ascendente puo portare disaccordo di tono, espressione e lettura di contesto nelle interazioni quotidiane. La fase chiede di adattare forma di comunicare per preservare chiarezza senza elevare tensione inutile. Semplifica messaggi e conferma comprensione reciproca.',
    'transit:mercury|oposicao|meio_do_ceu':
      'Mercurio in opposizione al Medio Cielo puo tensionare comunicazione professionale e consistenza di posizionamento pubblico. Il periodo chiede di rivedere narrativa, scadenze e allineamento tra discorso e consegna. Piccoli aggiustamenti di comunicazione tendono a ridurre rumore di immagine.',

    // ── Mercury ingress ───────────────────────────────────────────────────
    'transit:mercury|ingress|house_1':
      'Mercurio in ingresso nella Casa 1 amplia chiarezza di comunicazione personale e rapidita di ragionamento su identita e direzione. La fase favorisce articolare meglio cio che vuoi e come ti presenti. Organizza messaggi chiave e usa il periodo per allineare discorso con azione.',
    'transit:mercury|ingress|house_2':
      'Mercurio in ingresso nella Casa 2 intensifica ragionamento su risorse, valori e decisioni di sicurezza materiale. Il ciclo favorisce rivedere e organizzare informazioni finanziarie con piu criterio. Documenta priorita e avanza in temi economici con metodologia chiara.',
    'transit:mercury|ingress|house_3':
      'Mercurio in ingresso nella Casa 3 amplifica comunicazione, studio rapido e scambio locale di informazioni. Questa fase favorisce conversazioni, scrittura e connessioni nell ambiente vicino. Usa il periodo per organizzare messaggi, studiare e rafforzare reti locali.',
    'transit:mercury|ingress|house_4':
      'Mercurio in ingresso nella Casa 4 concentra ragionamento nel contesto di casa, famiglia e basi di vita. Il ciclo favorisce conversazioni su accordi domestici e organizzazione dell ambiente. Documenta decisioni rilevanti sulla convivenza e pianificazione familiare.',
    'transit:mercury|ingress|house_5':
      'Mercurio in ingresso nella Casa 5 amplifica idee creative, comunicazione spontanea e progetti espressivi. Questa fase favorisce scambio di idee con piu naturalezza e buon rischio narrativo. Canalizza fluidita verso progetti creativi e conversazioni con impatto personale.',
    'transit:mercury|ingress|house_6':
      'Mercurio in ingresso nella Casa 6 intensifica attenzione su routine, metodologia lavorativa e organizzazione della salute. Il ciclo favorisce rivedere processi, documentare procedure e migliorare comunicazione funzionale. Usa il periodo per dare priorita a efficienza senza sovraccaricare l agenda.',
    'transit:mercury|ingress|house_7':
      'Mercurio in ingresso nella Casa 7 amplia attenzione su dialoghi di alleanza, negoziazione e allineamento nelle relazioni. Questa fase favorisce conversazioni chiave con soci, partner e figure significative. Chiarisci aspettative e documenta accordi per evitare rumore successivo.',
    'transit:mercury|ingress|house_8':
      'Mercurio in ingresso nella Casa 8 intensifica ricerca, analisi profonda e comunicazione su temi di fiducia. Il ciclo favorisce rivedere risorse condivise, accordi taciti e informazioni strategiche. Documenta con precisione e avanza in pendenze sensibili con criterio.',
    'transit:mercury|ingress|house_9':
      'Mercurio in ingresso nella Casa 9 amplifica curiosita intellettuale, apprendimento di lungo raggio ed espressione di visione. Questa fase favorisce studio, filosofia e connessione con prospettive piu ampie. Usa il periodo per integrare apprendimenti e condividere visione con chiarezza e fondamento.',
    'transit:mercury|ingress|house_10':
      'Mercurio in ingresso nella Casa 10 amplia focus su comunicazione strategica, narrativa pubblica e gestione dell immagine professionale. Il ciclo favorisce presentazioni e allineamento del discorso con i risultati. Mantieni messaggi concisi e coerenti con la tua traiettoria.',
    'transit:mercury|ingress|house_11':
      'Mercurio in ingresso nella Casa 11 amplifica scambio di idee in reti, gruppi e progetti collettivi. Questa fase favorisce conversazioni con apertura a nuove prospettive e collaborazioni con scopo. Usa il periodo per articolare visione condivisa e organizzare obiettivi collettivi.',
    'transit:mercury|ingress|house_12':
      'Mercurio in ingresso nella Casa 12 intensifica elaborazione interna, riflessione profonda e revisione di assunti impliciti. Il ciclo favorisce studio introspettivo e preparazione silenziosa di idee per nuovi cicli. Documenta apprendimenti interni ed evita decidere solo da supposizioni.',

    // ── Venus conjuncao ───────────────────────────────────────────────────
    'transit:venus|conjuncao|sun':
      'Venere in congiunzione con il Sole amplifica necessita di esprimere valori personali con autenticita e presenza. Questo ciclo puo favorire apertura a esperienze di piacere, creativita e connessione affettiva con piu integrita. Approfitta per allineare scelte a cio che valorizzi davvero.',
    'transit:venus|conjuncao|moon':
      'Venere in congiunzione con la Luna puo ampliare sensibilita emotiva, bisogno di affetto e comfort relazionale. Il ciclo favorisce cura di se e nutrimento di legami quando chiarezza di limiti e presente. Usa il periodo per coltivare benessere affettivo con equilibrio e reciprocita.',
    'transit:venus|conjuncao|mercury':
      'Venere in congiunzione con Mercurio favorisce comunicazione armoniosa, espressione di affetto nelle parole e diplomazia relazionale. Questo ciclo tende a facilitare scambi quando bellezza di forma e chiarezza di contenuto si combinano. Usa il periodo per rafforzare dialoghi con cura ed eleganza.',
    'transit:venus|conjuncao|venus':
      'Venere in congiunzione con Venere segna un momento di riallineamento di valori, estetica e priorita affettive. Questo ciclo tende ad ampliare consapevolezza di cio che porta piacere e soddisfazione reale. Usa il periodo per rivedere scelte relazionali e materiali con criterio e autenticita.',
    'transit:venus|conjuncao|mars':
      'Venere in congiunzione con Marte puo intensificare dinamismo affettivo, attrazione e bisogno di esprimere desiderio con piu direttezza. Questo ciclo favorisce equilibrio tra armonia e assertivita nelle relazioni. Avanza con chiarezza di intenzione e cura la reciprocita nei legami.',
    'transit:venus|conjuncao|saturn':
      'Venere in congiunzione con Saturno puo portare a rivedere legami e risorse sotto criteri di durata e responsabilita. Il ciclo tende a valorizzare qualita su quantita nelle relazioni e scelte di valore. Consolida cio che ha fondamento reale e lascia andare cio che non serve piu.',
    'transit:venus|conjuncao|uranus':
      'Venere in congiunzione con Urano puo portare apertura a connessioni nuove, valori atipici e cambiamenti in estetica o relazioni. Questo ciclo favorisce sperimentazione quando limiti chiari prevengono impulsivita. Abbraccia la novita con criterio e mantieni coerenza di valori.',
    'transit:venus|conjuncao|neptune':
      'Venere in congiunzione con Nettuno puo ampliare idealizzazione, sensibilita estetica e ricerca di connessione profonda nei legami. Il ciclo favorisce raffinamento quando reciprocita e limiti concreti sono presenti. Valida segnali reali prima di impegni affettivi o finanziari.',
    'transit:venus|conjuncao|pluto':
      'Venere in congiunzione con Plutone puo intensificare legami, attrazioni e processi di trasformazione nel campo dei valori. Il ciclo tende a rivelare dinamiche di potere e dipendenza nelle relazioni. Avanza con trasparenza e chiarezza di limiti in impegni profondi.',
    'transit:venus|conjuncao|ascendente':
      'Venere in congiunzione all Ascendente amplifica charme personale, apertura relazionale e bisogno di armonia nella presenza. Questa fase favorisce nuove connessioni e rafforzamento di legami quando autenticita guida l espressione. Coltiva relazioni con equilibrio e chiarezza di limite.',
    'transit:venus|conjuncao|meio_do_ceu':
      'Venere in congiunzione al Medio Cielo puo aprire opportunita di collaborazione, riconoscimento professionale e visibilita per qualita relazionale. Questo ciclo favorisce progetti con estetica e posizionamento quando criterio accompagna apertura. Rafforza immagine con autenticita e cooperazione.',

    // ── Venus sextil ──────────────────────────────────────────────────────
    'transit:venus|sextil|sun':
      'Venere in sextile al Sole favorisce armonia tra espressione personale e valori affettivi. Questo ciclo tende a facilitare aperture relazionali quando autenticita e presenza si allineano. Usa il periodo per rafforzare connessioni con integrita e apertura.',
    'transit:venus|sextil|moon':
      'Venere in sextile con la Luna favorisce equilibrio tra bisogno emotivo e apertura relazionale. Questo ciclo tende a supportare cura di se e dei legami con piu naturalezza. Usa il momento per coltivare benessere affettivo con calma e reciprocita.',
    'transit:venus|sextil|mercury':
      'Venere in sextile con Mercurio favorisce comunicazione elegante, diplomazia e scambio di valori con fluidita. Questo ciclo tende a facilitare conversazioni significative e accordi con buon tono relazionale. Approfitta per articolare cio che valorizzi con chiarezza e cura.',
    'transit:venus|sextil|venus':
      'Venere in sextile con Venere favorisce sintonia con propri valori, estetica e preferenze affettive. Questo ciclo tende a supportare scelte di piacere e comfort quando criterio e autenticita guidano. Usa il periodo per rivedere priorita relazionali e coltivare cio che sostiene benessere.',
    'transit:venus|sextil|mars':
      'Venere in sextile con Marte favorisce combinazione di armonia e assertivita in legami e progetti creativi. Questo ciclo tende a facilitare azione con cura relazionale senza perdere forza di direzione. Avanza nelle iniziative combinando apertura e focus.',
    'transit:venus|sextil|jupiter':
      'Venere in sextile con Giove favorisce espansione di esperienze affettive, estetica e piacere con criterio. Questo ciclo tende a supportare generosita quando reciprocita e limiti sono attivi. Approfitta per coltivare relazioni con qualita e visione di lungo periodo.',
    'transit:venus|sextil|saturn':
      'Venere in sextile con Saturno favorisce valorizzare stabilita, responsabilita e durata nelle relazioni e scelte. Questo ciclo tende a supportare impegni solidi quando chiarezza di limite e sforzo congiunto sono presenti. Consolida cio che ha base reale con criterio e pazienza.',
    'transit:venus|sextil|uranus':
      'Venere in sextile con Urano favorisce apertura a connessioni atipiche, rinnovamento estetico e valori di liberta. Questo ciclo tende a facilitare sperimentazione quando limiti chiari prevengono eccesso di impulsivita. Esplora nuove preferenze con apertura e fondamento.',
    'transit:venus|sextil|neptune':
      'Venere in sextile con Nettuno favorisce sensibilita estetica, empatia profonda e raffinamento di valori. Questo ciclo tende a supportare creativita e intuizione affettiva quando verifica pratica e parte del processo. Coltiva connessione con piu apertura e chiarezza di segnali concreti.',
    'transit:venus|sextil|pluto':
      'Venere in sextile con Plutone favorisce profondita di legame, trasformazione di valori e prospettiva rinnovata nelle relazioni. Questo ciclo tende a facilitare processi di cambiamento quando trasparenza e chiarezza di limite sono presenti. Avanza in impegni profondi con consapevolezza e criterio.',
    'transit:venus|sextil|ascendente':
      'Venere in sextile all Ascendente favorisce proiezione di charme naturale e apertura relazionale con piu fluidita. Questo ciclo tende a facilitare nuove connessioni e rafforzamento di legami esistenti. Usa il periodo per coltivare presenza relazionale con autenticita e equilibrio.',
    'transit:venus|sextil|meio_do_ceu':
      'Venere in sextile al Medio Cielo favorisce visibilita professionale per qualita relazionale, estetica e collaborazione. Questo ciclo tende ad aprire spazio per connessioni con scopo nell ambiente professionale. Rafforza immagine con autenticita e coltiva relazioni di valore strategico.',

    // ── Venus trigono ─────────────────────────────────────────────────────
    'transit:venus|trigono|sun':
      'Venere in trigono al Sole rafforza la fluidita tra valori personali ed espressione autentica. Questo ciclo tende a favorire relazioni e scelte di piacere con piu integrita. Approfitta del periodo per coltivare cio che sostiene benessere reale con coerenza.',
    'transit:venus|trigono|moon':
      'Venere in trigono con la Luna favorisce integrazione naturale tra bisogno emotivo e apertura relazionale. Questo ciclo tende a facilitare cura di se e dei legami con fluidita e reciprocita. Usa il momento per coltivare affetto con autenticita e calma.',
    'transit:venus|trigono|mercury':
      'Venere in trigono con Mercurio favorisce comunicazione armonizzante, espressione di affetto ed eleganza relazionale. Questo ciclo tende a facilitare conversazioni significative con piu fluidita e cura reciproca. Approfitta per rafforzare dialoghi e accordi con qualita.',
    'transit:venus|trigono|venus':
      'Venere in trigono con Venere favorisce sintonia profonda con valori propri, estetica e scelte di piacere. Questo ciclo tende a facilitare revisione di priorita affettive con piu chiarezza e autenticita. Usa il periodo per consolidare cio che apporta benessere reale.',
    'transit:venus|trigono|mars':
      'Venere in trigono con Marte favorisce dinamismo relazionale con equilibrio tra armonia e assertivita. Questo ciclo tende a facilitare azione nei legami quando cura e fermezza si completano. Avanza in progetti creativi e relazioni con fluidita e intenzione.',
    'transit:venus|trigono|jupiter':
      'Venere in trigono con Giove favorisce generosita, espansione di esperienze di piacere e relazioni con visione ampia. Questo ciclo tende a facilitare abbondanza affettiva e materiale quando criterio accompagna apertura. Coltiva connessioni con qualita e prospettiva di lungo periodo.',
    'transit:venus|trigono|saturn':
      'Venere in trigono con Saturno favorisce solidita nei legami, responsabilita affettiva e valorizzare il duraturo. Questo ciclo tende a facilitare impegni stabili quando chiarezza di limite e sforzo reciproco sono presenti. Consolida relazioni e valori con consapevolezza e pazienza.',
    'transit:venus|trigono|uranus':
      'Venere in trigono con Urano favorisce apertura a connessioni innovative, liberta espressiva e rinnovamento di valori. Questo ciclo tende a facilitare sperimentazione con criterio e limiti chiari. Esplora nuove forme di relazione ed estetica con apertura e integrita.',
    'transit:venus|trigono|neptune':
      'Venere in trigono con Nettuno favorisce sensibilita estetica profonda, empatia e raffinamento di valori. Questo ciclo tende a facilitare creativita e intuizione affettiva quando verifica pratica accompagna l apertura. Coltiva connessione sottile con piu discernimento e chiarezza.',
    'transit:venus|trigono|pluto':
      'Venere in trigono con Plutone favorisce trasformazione profonda di valori e rivitalizzazione di legami con piu autenticita. Questo ciclo tende a facilitare processi di cambiamento quando c e trasparenza e volonta di andare in fondo. Avanza in impegni con consapevolezza e integrita.',
    'transit:venus|trigono|ascendente':
      'Venere in trigono all Ascendente favorisce proiezione di presenza armoniosa e apertura relazionale fluida. Questo ciclo tende a facilitare nuove connessioni e rafforzamento di legami con piu naturalezza. Usa il periodo per coltivare immagine relazionale con autenticita e equilibrio.',
    'transit:venus|trigono|meio_do_ceu':
      'Venere in trigono al Medio Cielo favorisce visibilita professionale per qualita relazionale ed estetica con fluidita. Questo ciclo tende ad aprire opportunita di collaborazione con scopo e buon posizionamento. Rafforza immagine con autenticita e coltiva relazioni di valore in carriera.',

    // ── Venus oposicao ────────────────────────────────────────────────────
    'transit:venus|oposicao|sun':
      'Venere in opposizione al Sole puo tensionare valori personali con bisogno di riconoscimento ed espressione affettiva. Il ciclo chiede di bilanciare desiderio di armonia con autenticita di propria direzione. Avanza con chiarezza di priorita senza cedere eccessivamente su punti essenziali.',
    'transit:venus|oposicao|moon':
      'Venere in opposizione con la Luna puo ampliare tensione tra bisogno emotivo e aspettative relazionali. Il ciclo chiede cura con proiezione affettiva e supposizioni nei legami vicini. Comunica bisogni con calma e valida comprensione reciproca prima di concludere.',
    'transit:venus|oposicao|mercury':
      'Venere in opposizione con Mercurio puo tensionare forma di comunicare e contenuto in conversazioni affettive o di valore. Il ciclo chiede di bilanciare eleganza relazionale e chiarezza del messaggio senza perdere nessuna. Adatta tono e linguaggio per sostenere dialogo con qualita.',
    'transit:venus|oposicao|venus':
      'Venere in opposizione con Venere puo attivare tensione tra valori propri e aspettative dell ambiente relazionale. Il ciclo chiede di rivedere priorita affettive e materiali con criterio proprio. Avanza senza cedere sull essenziale ne imporre senza ascolto.',
    'transit:venus|oposicao|mars':
      'Venere in opposizione con Marte puo ampliare tensione tra desiderio di armonia e dinamismo assertivo nelle relazioni. Il ciclo chiede di calibrare intensita e reciprocita per avanzare senza eccesso di confronto o evasione. Cerca equilibrio tra apertura e fermezza.',
    'transit:venus|oposicao|jupiter':
      'Venere in opposizione con Giove puo amplificare aspettative affettive o di piacere con meno criterio di limite. Il ciclo chiede di bilanciare generosita ed espansivita con valutazione pratica di cio che e sostenibile. Avanza con apertura e con ancoraggio alla realta.',
    'transit:venus|oposicao|saturn':
      'Venere in opposizione con Saturno puo tensionare desiderio di connessione e piacere con esigenza di responsabilita e struttura. Il ciclo chiede di bilanciare bisogno affettivo con impegni pratici senza soffocare nessuno. Consolida con pazienza e onesta nelle aspettative.',
    'transit:venus|oposicao|uranus':
      'Venere in opposizione con Urano puo portare tensione tra bisogno di stabilita relazionale e impulso di liberta o cambiamento. Il ciclo chiede di contenere rottura affrettata senza soffocare rinnovamento necessario. Valida cio che e persistente prima di trasformare e mantieni dialogo aperto.',
    'transit:venus|oposicao|neptune':
      'Venere in opposizione con Nettuno puo ampliare idealizzazione nei legami e aspettative poco ancorate alla realta. Il ciclo chiede di confrontare percezione con evidenza concreta prima di impegni. Cerca reciprocita reale ed evita decisioni solo per entusiasmo affettivo.',
    'transit:venus|oposicao|pluto':
      'Venere in opposizione con Plutone puo intensificare dinamiche di potere, dipendenza o controllo nei legami e valori. Il ciclo chiede chiarezza di limite e revisione di cio che muove le scelte profonde. Avanza con trasparenza e senza cedere su punti di propria integrita.',
    'transit:venus|oposicao|ascendente':
      'Venere in opposizione all Ascendente puo portare tensione tra immagine relazionale e aspettative dell ambiente. Il ciclo chiede di rivedere come ti presenti e cosa comunichi nelle relazioni vicine. Adatta postura con autenticita e chiarezza di limite per sostenere legami senza cedere in eccesso.',
    'transit:venus|oposicao|meio_do_ceu':
      'Venere in opposizione al Medio Cielo puo tensionare dinamica affettiva con richieste professionali o di immagine. Il ciclo chiede di bilanciare investimento in relazioni e in proiezione professionale con criterio chiaro. Adatta priorita per sostenere qualita in entrambi i domini senza sacrificare nessuno.',

    // ── Venus quadratura ──────────────────────────────────────────────────
    'transit:venus|quadratura|sun':
      'Venere in quadratura al Sole puo generare tensione tra valori propri ed espressione di identita. Il ciclo chiede di calibrare desiderio di armonia con autenticita di direzione senza concessione eccessiva. Avanza con criterio proprio e rivedi scelte alla luce di cio che valorizzi davvero.',
    'transit:venus|quadratura|moon':
      'Venere in quadratura con la Luna puo ampliare tensione tra bisogno emotivo e scelte affettive o di piacere. Il ciclo chiede cura con decisioni motivate da stato emotivo transitorio. Fermati, valuta con calma e comunica bisogni con chiarezza.',
    'transit:venus|quadratura|mercury':
      'Venere in quadratura con Mercurio puo tensionare diplomazia e franchezza in conversazioni di valore o relazionali. Il ciclo chiede di bilanciare forma elegante e contenuto chiaro senza perdere nessuno. Adatta messaggio e tono per sostenere dialogo con qualita e onesta.',
    'transit:venus|quadratura|venus':
      'Venere in quadratura con Venere puo attivare conflitto interno su valori, piacere e priorita relazionali. Il ciclo chiede di rivedere cio che sostiene davvero benessere e lasciare andare cio che non si adatta piu. Avanza con autenticita di proprio criterio.',
    'transit:venus|quadratura|mars':
      'Venere in quadratura con Marte puo ampliare tensione tra armonia e assertivita nelle relazioni e progetti. Il ciclo chiede di calibrare apertura e fermezza per avanzare senza eccesso di confronto ne di evasione. Cerca equilibrio tra cura relazionale e direzione chiara.',
    'transit:venus|quadratura|jupiter':
      'Venere in quadratura con Giove puo ampliare aspettative di piacere ed espansione con meno criterio di limite. Il ciclo chiede di bilanciare apertura al piacere con valutazione pratica di cio che e sostenibile. Avanza con generosita ancorata alla realta e criterio chiaro.',
    'transit:venus|quadratura|saturn':
      'Venere in quadratura con Saturno puo tensionare desiderio di connessione e piacere con esigenza strutturale. Il ciclo chiede di bilanciare bisogno affettivo e responsabilita senza negare nessuno. Consolida con pazienza e onesta nelle aspettative in legami e valori.',
    'transit:venus|quadratura|uranus':
      'Venere in quadratura con Urano puo portare tensione tra stabilita relazionale e impulso di rottura o cambiamento brusco. Il ciclo chiede di contenere reazione impulsiva senza bloccare rinnovamento necessario. Valida con calma prima di prendere decisioni con impatto sui legami.',
    'transit:venus|quadratura|neptune':
      'Venere in quadratura con Nettuno puo ampliare idealizzazione e mancanza di ancoraggio in relazioni o decisioni di valore. Il ciclo chiede di confrontare percezione con evidenza concreta e rivedere supposizioni. Avanza con criterio chiaro ed evita impegni basati solo su aspettativa.',
    'transit:venus|quadratura|pluto':
      'Venere in quadratura con Plutone puo intensificare dinamiche di potere, possessivita o trasformazione forzata nei legami. Il ciclo chiede chiarezza di limite e revisione consapevole di cio che muove le scelte profonde. Avanza con trasparenza e senza cedere sulla propria integrita.',
    'transit:venus|quadratura|ascendente':
      'Venere in quadratura all Ascendente puo portare tensione tra immagine relazionale e come sei percepito nell ambiente. Il ciclo chiede di rivedere come ti presenti e cosa comunichi nelle relazioni quotidiane. Adatta con autenticita e chiarezza per sostenere legami senza eccesso di adattamento.',
    'transit:venus|quadratura|meio_do_ceu':
      'Venere in quadratura al Medio Cielo puo tensionare dinamica relazionale con posizionamento professionale. Il ciclo chiede di bilanciare investimento nei legami e in carriera con criterio chiaro di priorita. Adatta scelte per sostenere qualita in entrambi i domini con criterio.',

    // ── Venus ingress ─────────────────────────────────────────────────────
    'transit:venus|ingress|house_1':
      'Venere in ingresso nella Casa 1 amplifica charme naturale, necessita di armonia e apertura a nuove connessioni. Questa fase favorisce espressione di valori personali con piu autenticita e presenza. Usa il momento per coltivare relazioni con equilibrio e chiarezza di limite.',
    'transit:venus|ingress|house_2':
      'Venere in ingresso nella Casa 2 amplifica attenzione su risorse, valori personali ed esperienze di piacere e sicurezza. Questo ciclo favorisce rivedere cio che conta davvero materialmente e affettivamente. Dai priorita a scelte che sostengono benessere con criterio e consistenza.',
    'transit:venus|ingress|house_3':
      'Venere in ingresso nella Casa 3 favorisce conversazioni armoniose, espressione diplomatica e scambi di idee con piu leggerezza. Questo periodo amplifica apertura ad apprendere e comunicare con affetto e cura. Approfitta per rafforzare relazioni locali e conversazioni che contano.',
    'transit:venus|ingress|house_4':
      'Venere in ingresso nella Casa 4 favorisce armonizzazione dell ambiente domestico, comfort emotivo e qualita delle relazioni familiari. Questa fase tende ad amplificare desiderio di pace e cura in casa. Piccoli aggiustamenti di convivenza e ambiente possono portare piu benessere.',
    'transit:venus|ingress|house_5':
      'Venere in ingresso nella Casa 5 amplifica piacere, espressione creativa e apertura al romanticismo e affetto con piu autenticita. Questo ciclo favorisce progetti di espressione personale, incontri e scelte che portano gioia. Usa il momento con moderazione e criterio di reciprocita.',
    'transit:venus|ingress|house_6':
      'Venere in ingresso nella Casa 6 favorisce armonizzazione delle routine quotidiane, relazioni lavorative e benessere funzionale. Questa fase puo amplificare piacere nelle attivita quotidiane quando organizzazione e criterio sono presenti. Piccoli aggiustamenti di ambiente e dinamica lavorativa tendono a portare piu leggerezza.',
    'transit:venus|ingress|house_7':
      'Venere in ingresso nella Casa 7 amplifica apertura relazionale, desiderio di partnership e bisogno di armonia negli accordi. Questo ciclo favorisce nuovi legami e rafforzamento delle relazioni esistenti quando c e reciprocita chiara. Dai priorita a cooperazione e definizione di limite con gentilezza.',
    'transit:venus|ingress|house_8':
      'Venere in ingresso nella Casa 8 amplifica profondita di legame, temi di risorse condivise e bisogno di fiducia. Questa fase puo favorire vera intimita quando apertura e limiti consapevoli sono presenti. Avanza con criterio e chiarezza in accordi profondi e scelte di valore.',
    'transit:venus|ingress|house_9':
      'Venere in ingresso nella Casa 9 amplifica apertura all apprendimento, espansione di visione e piacere in connessioni culturali e di lungo raggio. Questo ciclo favorisce viaggi, studio e connessioni che ampliano prospettiva affettiva. Usa il periodo per coltivare cio che espande senso e qualita dell esperienza.',
    'transit:venus|ingress|house_10':
      'Venere in ingresso nella Casa 10 favorisce riconoscimento professionale per qualita relazionale, estetica e buon posizionamento. Questa fase puo amplificare opportunita di collaborazione e visibilita con criterio. Rafforza immagine con autenticita e coltiva relazioni di valore nell ambiente professionale.',
    'transit:venus|ingress|house_11':
      'Venere in ingresso nella Casa 11 favorisce armonizzazione in reti, collaborazioni e progetti futuri condivisi. Questo ciclo amplifica apertura a nuovi legami e connessioni di qualita con scopo. Dai priorita ad alleanze con reciprocita reale e contribuisci con autenticita.',
    'transit:venus|ingress|house_12':
      'Venere in ingresso nella Casa 12 amplifica sensibilita interiore, bisogno di riposo affettivo e processi di chiusura tranquilla. Questa fase favorisce cura di se, raffinamento delle relazioni e revisione di cio che sostiene benessere reale. Usa il periodo per integrare apprendimenti relazionali.',
},
}
