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
      'Saturn square natal Saturn exposes tension between current structure and the need for genuine maturation. This phase tends to reveal where timelines, limits, and responsibilities no longer serve what you are trying to build, making the weight of that misalignment more visible. What are you maintaining out of habit that is no longer producing real results?',
    'transit:saturn|sextil|sun':
      'Saturn sextile Sun opens room for consolidating personal goals with sharper method and clearer purpose. This phase tends to reveal what needs structure to move from potential into real results. Which commitments have you been postponing for lack of method, not lack of will?',
    'transit:saturn|trigono|sun':
      'Saturn trine Sun favors a consistent work cycle, with less friction between who you want to be and what you can sustain in practice. Long-term goals become easier to execute when identity and method are aligned. What do you want to consolidate while this flow is available?',
    'transit:saturn|oposicao|uranus':
      'Saturn opposition natal Uranus activates a direct conflict between what needs stability and what demands urgent renewal. The polarity may show as inner resistance: part of you wants to preserve what works, another part knows the current model is already outdated. What can you renew in stages without needing to break everything at once?',
    'transit:saturn|quadratura|uranus':
      'Saturn square natal Uranus creates friction between the drive to break from what is obsolete and the fear of destabilizing what still produces results. This phase tends to intensify discomfort with old routines while fast changes also feel risky — a standoff that calls for strategy. What is the smallest change you could start now to signal that renewal has already begun?',
    'transit:saturn|sextil|mars':
      'Saturn sextile Mars favors channeling drive into strategy, creating windows for action with technique and less wasted energy. This cycle tends to reward pairing the courage to start with execution planning. What demanding project do you have available to structure in stages now?',
    'transit:saturn|trigono|mars':
      'Saturn trine Mars joins persistence and method, creating conditions for quality execution without the friction typical of tense aspects. Long-duration or physically demanding projects tend to flow with more regularity and less wear. This cycle favors what calls for both vigor and patience at the same time.',
    'transit:saturn|sextil|saturn':
      'Saturn sextile natal Saturn opens a favorable cycle for reviewing self-management, timelines, and commitments without the pressure of tense aspects. This period invites questioning which responsibilities still make sense and which need restructuring with more clarity. Which part of how you organize your life is asking for an update, not just optimization?',
    'transit:saturn|trigono|saturn':
      'Saturn trine natal Saturn points to a phase of good structural functioning, where it is easier to sustain method and complete stages. The flow invites starting something long-term that previously seemed too big to begin. Use this moment to initiate what calls for consistency, not just maintain what already works.',
    'transit:sun|oposicao|pluto':
      'Sun opposition Pluto intensifies themes of control, personal power, and real priorities. This cycle may expose polarities that ask for a conscious stance with less reactivity. Focus on what is essential with firmness and no unnecessary confrontation.',
    'transit:saturn|oposicao|mars':
      'Saturn opposition natal Mars may create a sense of external braking on action, as if each step requires more preparation or validation than usual. The tension tends to expose where force and technique are misaligned — drive without strategy tends to struggle more in this cycle. What in your current execution is asking for more planning, not more effort?',
    'transit:saturn|quadratura|mercury':
      'Saturn square natal Mercury may slow communication, overload thinking, and expose where reasoning or mental processes need structural revision. This phase raises the demand for precision — delays in decisions and rework in messages signal that the conceptual foundation needs to be stronger. Which of your assumptions about this situation have you not yet questioned rigorously enough?',
    'transit:saturn|quadratura|sun':
      'Saturn square natal Sun may create a sense of ceiling or external limit on personal initiatives, as if the context demands more than the available energy. The friction tends to reveal where identity still depends on external validation or ideal conditions to advance. Which part of your plan can move forward without needing everything to be perfect first?',
    'transit:saturn|sextil|venus':
      'Saturn sextile Venus supports building bonds with more discernment and less idealization, making it easier to recognize what has genuine reciprocity. This phase invites reviewing affective or financial agreements with a more mature eye and better-calibrated expectations. Which agreement deserves an honest look at what each party actually delivers?',
    'transit:saturn|trigono|venus':
      'Saturn trine Venus eases building more solid foundations in relationships and finances, with a natural preference for quality and long-term commitments. This cycle tends to align affective and material investments with what actually sustains value over time. Which long-term choices have you been postponing for lack of certainty?',
    'transit:saturn|sextil|jupiter':
      'Saturn sextile Jupiter opens a window for turning broad vision into executable plans, tempering optimism with practical criteria. This cycle supports staged growth without the excesses that typically accompany Jupiter without Saturn as anchor. What could you start now that needs both boldness and method?',
    'transit:saturn|trigono|jupiter':
      'Saturn trine Jupiter creates one of the most favorable cycles for grounded growth, where expansion and method align naturally. Medium and long-term projects tend to advance with more traction and less wear than at other times. What real opportunity is waiting only for structure and execution commitment?',
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
      'Saturn opposite natal Jupiter tensions expansion and limit at the same decision point, exposing where optimism and reality diverge. This phase may reveal projects that grew without enough structure — or where excess caution is holding back what already has a foundation to advance. What needs to be cut so that what truly has potential can grow with more solidity?',
    'transit:moon|oposicao|jupiter':
      'Moon opposite Jupiter can amplify emotional reactions and short-term expectations. This cycle favors moderating excess and returning to realistic choices. Brief pauses and clearer priorities help avoid dispersion.',
    'transit:saturn|oposicao|pluto':
      'Saturn opposite natal Pluto activates a confrontation between current structure and the need for deeper transformation. This phase may expose where personal power and control are at stake — resistance to change tends to manifest as rigidity or as collapse of what was not solid enough. What are you defending that you already know needs to be transformed?',
    'transit:sun|quadratura|moon':
      'Sun square Moon can create friction between conscious intention and emotional need. This phase asks for alignment between what you want to do and what your inner rhythm can sustain. Simple routine and communication adjustments reduce conflict.',
    'transit:saturn|sextil|neptune':
      'Saturn sextile Neptune offers form and method to creative ideas or intuitions that tend to escape execution for lack of grounding. This phase makes it easier to separate genuine vision from fantasy, allowing progress on sensitive projects in verifiable steps. Which creative project do you already know is viable, but have not yet translated into structure?',
    'transit:saturn|trigono|neptune':
      'Saturn trine Neptune makes it easier to give structure to what is subtle, intuitive, or creative, without losing the essence of what inspires. This cycle tends to make once-nebulous projects more executable, with less confusion between vision and fantasy. What dimension of your life that seems intangible could receive a concrete shape now?',
    'transit:sun|sextil|moon':
      'Sun sextile Moon supports integration between intention and emotion. This phase tends to improve flow in conversations, routine adjustments, and daily choices. Use it to align internal and external priorities.',
    'transit:sun|trigono|moon':
      'Sun trine Moon strengthens coherence between identity and emotional needs. This period often supports stable organization of important choices. Use it to consolidate habits that sustain continuity.',
    'transit:saturn|sextil|ascendente':
      'Saturn sextile Ascendant supports consolidating how you handle responsibilities and present yourself to the world, with more groundedness and intentionality. This phase tends to make it easier to build consistent presence where identity and conduct are aligned. Where do you want your conduct to be more recognized and reliable?',
    'transit:saturn|trigono|ascendente':
      'Saturn trine Ascendant supports expressing yourself with natural maturity, making it easier to sustain a consistent stance and hold responsibilities with authority. This phase creates less friction between intention and behavior, favoring presence growth with minimal additional effort. What habit or posture have you been trying to solidify that still feels artificial?',
    'transit:saturn|oposicao|saturn':
      'Saturn opposite natal Saturn marks a midcycle turning point — a confrontation between the structure that has been built and what it can actually sustain. This phase tends to reveal where foundations are solid and where they need objective reformulation, without romanticization. What have you built so far that deserves to be carried forward, and what needs to be rebuilt on new ground?',
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
      'Saturn square natal Moon may intensify a sense of emotional weight and daily limitation, as if affective needs and concrete responsibilities are in direct conflict. This phase tends to reveal where self-care has been neglected or where overload is compressing the inner space needed for balance. What are you carrying emotionally that could be distributed, negotiated, or released?',
    'transit:moon|quadratura|jupiter':
      'Moon square Jupiter can inflate expectations and mood oscillation around outcomes. This phase asks for moderation to avoid emotional overreach. Reassess priorities and stay with what is viable now.',
    'transit:uranus|sextil|moon':
      'Uranus sextile Moon favors emotional renewal with more lightness and creativity. This period helps test new habits without abrupt rupture. Small conscious changes can quickly improve wellbeing.',
    'transit:uranus|trigono|moon':
      'Uranus trine Moon supports updating emotional patterns with autonomy. This phase tends to open room for more authentic daily choices. Use flexibility to adjust routine and bonds responsibly.',
    'transit:pluto|oposicao|venus':
      'Pluto opposite natal Venus may intensify themes of power, attachment, and reciprocity in bonds, where what once seemed stable shows tension between what is genuine and what is merely a convenience arrangement. This phase tends to surface dependency or control dynamics in affective and financial relationships, making it harder to sustain arrangements that are not mutually viable. What in an important relationship or agreement do you know is not fair, but have been avoiding confronting directly?',
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
      'Saturn opposition natal Mercury may slow communication and intensify mental demands, making it harder to organize thoughts and transmit them clearly. This phase tends to reveal where analytical or argumentative foundations are weak — decisions that depend on conceptual clarity become slower or contested. Which point in your reasoning about this situation have you not yet reviewed with enough depth?',
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
      'Pluto sextile natal Mars creates an opening to act with depth and strategy, where execution force may be directed toward high-impact transformations with less friction than in tense aspects. This phase facilitates projects that demand both vigor and persistence — the type of task that calls for real commitment, not just immediate energy. What project or change available to you now would benefit from intense focus and structured execution?',
    'transit:pluto|trigono|mars':
      'Pluto trine natal Mars facilitates deep and persistent action, where execution force meets strategic intention without the friction of tense aspects. This phase creates conditions for well-grounded transformations, where effort accumulates toward structural and long-term results. What change have you been postponing because it seemed too large — and finds now the right moment to begin?',
    'transit:pluto|quadratura|moon':
      'Pluto square natal Moon may intensify emotional vulnerabilities and reveal where affective protective mechanisms are operating automatically or excessively. This phase tends to bring inherited patterns to the surface — ones that once regulated emotional security but now generate more cost than stability. What in your emotional protective patterns serves an older version of you, and what could you release to gain more inner space now?',
    'transit:moon|conjuncao|sun':
      'Moon conjunct Sun marks an emotional reset point and intention alignment. This phase supports simple priority adjustments and openness to new action cycles. Define one short consistent step to give direction to the day.',
    'transit:pluto|sextil|sun':
      'Pluto sextile natal Sun facilitates inner strengthening and identity repositioning with more authenticity, where what no longer corresponds to who you have become may be released without dramatic rupture. This phase favors deep decisions that emerge from genuine clarity, not from crisis. What part of who you were do you still carry out of habit — and what inner clarity do you already have to release what is no longer real?',
    'transit:pluto|trigono|sun':
      'Pluto trine natal Sun facilitates identity transformation with fluidity, where what needs to be released can be released and what needs to emerge finds favorable conditions to consolidate. This phase favors clarity of purpose and actions aligned with what is genuine, without the friction of tense aspects. What aspect of your identity or direction is ready to be consolidated with more intentionality now?',
    'transit:saturn|oposicao|ascendente':
      'Saturn opposition natal Ascendant may intensify tension in close relationships, revealing where personal limits or shared arrangements need objective revision. This phase tends to surface what the other person expects — asking you to decide what you can sustain without compromising your own coherence. What do you need to renegotiate in relationships that has been left unspoken for too long?',
    'transit:pluto|conjuncao|mars':
      'Pluto conjunct natal Mars amplifies the force of action with an intensity that can serve high-impact projects as much as it can escalate conflict through excess willpower. This phase tends to reveal where the power of action is being used constructively or destructively — the difference often comes down to clarity of direction. Where are you directing the intensity of action that this cycle makes available?',
    'transit:sun|oposicao|uranus':
      'Sun opposition Uranus can bring rhythm breaks, reaction to limits, and urgent need for freedom. This phase asks for flexibility with responsibility to avoid abrupt decisions. Reassess priorities and adjust direction without losing coherence.',
    'transit:uranus|quadratura|sun':
      'Uranus square Sun signals tension between current identity and need for change. The cycle can bring restlessness, impatience, and desire to flip everything quickly. Innovate in stages to preserve foundation and gain stable autonomy.',
    'transit:saturn|oposicao|sun':
      'Saturn opposition natal Sun activates external pressure and a test of personal authenticity, creating friction between who you are and what the context demands. This phase may reveal where identity depends on validation to advance — the strain often comes from trying to please and perform at the same time. What are you doing out of obligation that could be done from genuine choice, or simply discontinued?',
    'transit:saturn|quadratura|venus':
      'Saturn square natal Venus may expose friction in relationships or around personal values, making it more visible what is unsustainable in affective or financial arrangements. This phase tends to reduce tolerance for what drains energy — idealization becomes harder to maintain, which can bring both clarity and discomfort. What are you still sustaining out of fear of losing something that has already lost its real value for you?',
    'transit:sun|conjuncao|mercury':
      'Sun conjunct Mercury favors mental clarity, communication focus, and objective decisions. This phase tends to support important conversations, study, and idea organization. Prioritize simple messages aligned with essentials.',
    'transit:jupiter|conjuncao|moon':
      'Jupiter conjunct Moon expands sensitivity, emotional support, and sense of inner nourishment. This cycle can favor affective openness and broader understanding of emotional needs. Avoid emotional excess and keep balance in choices.',
    'transit:jupiter|oposicao|pluto':
      'Jupiter opposition Pluto can magnify disputes around vision, control, and power decisions. This period asks you to calibrate ambition with ethics, depth, and limits. Consistent growth comes from strategy, not extreme moves.',
    'transit:neptune|quadratura|venus':
      'Neptune square Venus can bring affective idealization and confusion about value and reciprocity. This cycle asks for discernment between intuition and projection. Observe concrete signals before formalizing emotional or financial agreements.',
    'transit:saturn|sextil|moon':
      'Saturn sextile Moon opens room for translating emotional needs into more stable and conscious affective routines. This phase makes it easier to distinguish genuine feeling from habitual reactivity, making care more structured. What emotional pattern do you want to turn into a conscious choice rather than an automatic reaction?',
    'transit:saturn|trigono|moon':
      'Saturn trine Moon supports balancing emotional life and concrete responsibilities with less inner cost than tense cycles. This cycle tends to offer serenity and clarity for making affective decisions with more maturity. What decision in relationships or care routines have you been postponing out of fear of discomfort?',
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
      'Pluto conjunct natal Sun initiates a transformation of identity where what once sustained self-image comes under question or becomes unsustainable. This phase tends to accelerate the shedding of what is superficial or performative — pressure for authenticity increases, with less tolerance for what is not genuine. What have you been maintaining in your image that no longer corresponds to who you are becoming?',
    'transit:pluto|quadratura|mars':
      'Pluto square Mars can raise pressure, impatience, and control conflicts in action. This cycle asks for disciplined execution and careful use of force. Prioritize essential tasks and avoid reactive confrontations.',
    'transit:saturn|conjuncao|jupiter':
      'Saturn conjunct Jupiter combines expansion with structure and long-range planning. The period favors realistic growth, objective priorities, and stronger execution criteria. Build in stages to preserve sustainability.',
    'transit:saturn|sextil|uranus':
      'Saturn sextile Uranus creates conditions for renewing routines or structures incrementally, without the rupture risk of tense aspects. This phase supports practical innovations where new methods can be tested without compromising what already sustains results. Which change have you been avoiding out of fear of disrupting what is working?',
    'transit:saturn|trigono|uranus':
      'Saturn trine Uranus makes it easy to modernize processes and structures naturally, without the friction of tenser aspects. This cycle tends to make previously risky changes more viable with simple planning and gradual execution. Which update do you already know is necessary, but have been waiting for the right moment?',
    'transit:uranus|sextil|mars':
      'Uranus sextile Mars boosts initiative, agility, and tactical experimentation. This phase tends to favor smart adjustments and faster execution with awareness. Keep focus on useful innovation, not pure acceleration.',
    'transit:uranus|trigono|mars':
      'Uranus trine Mars improves decisive action with flexibility and creative problem-solving. The cycle supports productive change when priorities are explicit. Use momentum to unlock practical progress.',
    'transit:jupiter|oposicao|saturn':
      'Jupiter opposition Saturn highlights tension between expansion and limits. This phase asks for balance between vision and feasibility in current commitments. Recalibrate goals, deadlines, and resource allocation.',
    'transit:neptune|conjuncao|meio_do_ceu':
      'Neptune conjunct Midheaven can increase sensitivity around vocation, image, and professional meaning. This phase asks for discernment between inspiration and projection. Keep direction clear and validate decisions with concrete signals.',
    'transit:saturn|sextil|meio_do_ceu':
      'Saturn sextile Midheaven opens a window for consolidating professional reputation through objective deliveries and more grounded long-term decisions. This phase favors career progress that depends on demonstrating responsibility, not just visibility. What professional step can you take now that will build lasting foundation?',
    'transit:saturn|trigono|meio_do_ceu':
      'Saturn trine Midheaven supports career progress with less friction, where method and credibility align more naturally. This cycle favors long-term positioning and tends to generate recognition when delivery is consistent and direction is clear. What level of commitment to your career are you ready to sustain going forward?',
    'transit:uranus|conjuncao|sun':
      'Uranus conjunct Sun tends to accelerate identity updates and personal repositioning. This phase can increase need for autonomy and experimental choices. Innovate with responsibility to avoid abrupt instability.',
    'transit:jupiter|oposicao|neptune':
      'Jupiter opposition Neptune can amplify idealization, diffuse expectations, and optimism without verification. This cycle asks for clearer criteria and fact-checking before major decisions. Keep inspiration grounded in practical reality.',
    'transit:jupiter|quadratura|neptune':
      'Jupiter square Neptune may increase enthusiasm with reduced clarity around limits. This phase asks for discernment between meaningful vision and wishful projection. Review assumptions and pace expansion prudently.',
    'transit:pluto|conjuncao|saturn':
      'Pluto conjunct Saturn deepens structural transformation and responsibility themes. The cycle can demand mature decisions about control, endurance, and what must be rebuilt. Move in stages with strategy and clear boundaries.',
    'transit:pluto|oposicao|jupiter':
      'Pluto opposition natal Jupiter may amplify conflicts between growth ambition and the need for power or control, where expansion and strategic depth become difficult to align. This phase tends to reveal where growth is being sought without sufficient ethical foundation or where the desired scale exceeds the capacity to sustain the result. What do you want to build that needs more depth and less scale to become truly solid and lasting?',
    'transit:saturn|quadratura|mars':
      'Saturn square natal Mars may create friction between the drive to act and obstacles of rhythm, technique, or context — action becomes more costly and more resisted than usual. This phase tends to expose where strategy and execution are misaligned: energy available, but direction or preparation insufficient. What are you trying to force that would respond better to a more tactical and gradual approach?',
    'transit:jupiter|quadratura|venus':
      'Jupiter square Venus can increase pleasure-seeking and optimism in relational or financial choices. This phase favors moderation and clear value criteria. Expand with balance to avoid excess and regret.',
    'transit:neptune|quadratura|saturn':
      'Neptune square Saturn can test certainty, structure, and tolerance for ambiguity. This phase asks you to refine expectations and rebuild plans with realistic flexibility. Combine intuition with objective verification.',
    'transit:pluto|oposicao|sun':
      'Pluto opposition natal Sun may activate power and authenticity disputes in important relationships, where the other person functions as a mirror of something not yet integrated internally. This phase tends to expose where personal identity is being negotiated or lost in response to external expectations, with growing pressure to recover internal coherence. What are you letting others define about you that you need to reclaim with more awareness and firmness?',
    'transit:pluto|oposicao|mars':
      'Pluto opposition natal Mars may intensify conflict potential through willpower, where drive to act meets external resistance that tensions or reflects back with equal intensity. This phase tends to reveal where the impulse to act is more about control than genuine direction — which increases friction with whoever or whatever does not yield easily. What in your way of acting is generating more resistance than results, and what does that say about the direction you have chosen?',
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
      'Neptune conjunct natal Sun amplifies identity sensitivity and may create a more intense search for meaning, making it harder to know where intuition ends and idealization begins. This phase tends to dissolve established direction — which can be both deep renewal and drift without an anchor. What in your current search is genuinely yours, and what is the expectation of who you should be?',
    'transit:neptune|conjuncao|moon':
      'Neptune conjunct natal Moon intensifies emotional life and affective permeability, making it easier to sense others\' needs but harder to discern what is genuinely your own. This phase may bring refinement of empathy or, without an anchor, confusion between what you feel and what you absorb from the environment. What part of what you are feeling now is yours, and what part is an echo of your surroundings that you need to let pass through without holding on?',
    'transit:neptune|conjuncao|mercury':
      'Neptune conjunct natal Mercury broadens intuition and symbolic reading of reality, making thinking more associative and less linear. This phase may enhance creativity and subtle perception — but also increases the risk of confusion around details, deadlines, and concrete agreements. Where are you trusting intuition that has not yet been verified, and where is that verification needed to move forward with more solidity?',
    'transit:neptune|conjuncao|venus':
      'Neptune conjunct natal Venus may amplify idealization in bonds and values, making it harder to perceive what is genuine affection and what is projection of how things should be. This phase can bring aesthetic openness and affective sensitivity or, without discernment, involvements built on expectation rather than real reciprocity. What in a bond or value choice do you prefer to idealize rather than observe more closely?',
    'transit:neptune|conjuncao|mars':
      'Neptune conjunct natal Mars may reduce the sharpness of action, making it harder to sustain execution without energy dispersing in multiple or poorly defined directions. This phase tends to require that the impulse to act meets very clear intention — without it, the cycle produces effort without traction or enthusiasm that fades before materializing results. What is the most concrete action you can commit to today, without needing total clarity to begin?',
    'transit:neptune|conjuncao|jupiter':
      'Neptune conjunct natal Jupiter amplifies the search for meaning and expansion, with a risk of inflating expectations well beyond what concrete facts support. This phase may bring genuine vision and openness or build an optimistic narrative far larger than what can actually be realized now. What in your current expansion has a verifiable foundation, and what is just optimism that has not yet been tested by reality?',
    'transit:neptune|conjuncao|saturn':
      'Neptune conjunct natal Saturn tensions structure and sensitivity on the same axis, where what needs form meets what resists being contained. This phase may dissolve routines that have become mechanical — an invitation to rebuild method with more flexibility, but with the risk of losing the anchor that still sustains results. What in your current organization needs more sensitivity, and what needs more firmness to avoid dissolving?',
    'transit:neptune|conjuncao|neptune':
      'Neptune conjunct Neptune marks a long-cycle sensitivity reset around meaning, intuition, and projection. The phase can dissolve old references and ask for subtler forms of orientation. Keep practical anchors active while inner vision is reorganized.',
    'transit:neptune|conjuncao|ascendente':
      'Neptune conjunct natal Ascendant may progressively alter self-image and the boundaries of the self, making it harder to distinguish who one is from what is projected or what the environment expects. This phase may bring renewal of presence and dissolution of old masks or, without an anchor, confusion about identity and boundaries. What in your way of presenting yourself to the world is no longer entirely true, and what is trying to emerge with more authenticity?',

    // ── Mars completion ────────────────────────────────────────────────────
    'transit:mars|sextil|sun':
      'Mars sextile Sun favors initiative with a clear read of personal direction and available energy. This cycle tends to support focused action when will and real priority are integrated. Use this moment to advance concrete goals with objectivity.',
    'transit:mars|sextil|meio_do_ceu':
      'Mars sextile Midheaven favors career initiative with good pacing and directional alignment. This cycle tends to support strategic moves when focus is placed on visibility goals. Execute by priority and track progress with clear criteria.',
    'transit:mars|conjuncao|meio_do_ceu':
      'Mars conjunct Midheaven intensifies the drive to act on career and public visibility. This phase supports positioning initiatives when energy is channeled with strategy and without excessive haste. Advance on concrete professional goals, prioritizing consistent delivery over execution speed.',
    'transit:mars|quadratura|meio_do_ceu':
      'Mars square Midheaven may create friction between the impulse to act and the demands of professional life or reputation. This phase tends to surface where execution pace and external expectations are out of sync. Reduce dispersion, prioritize what has direct impact, and avoid unnecessary confrontations in the work environment.',
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
    'transit:sun|conjuncao|ascendente':
      'Sun conjunct natal Ascendant marks the start of a new annual cycle of personal expression and projection into the world. Vitality, presence and the need for clarity about who you are tend to be heightened during this period. Invest in defining what you want to project in this cycle.',
    'transit:sun|conjuncao|jupiter':
      'Sun conjunct natal Jupiter expands confidence, the drive for growth and openness to new possibilities. The cycle supports expansive initiatives when there is discernment about what truly deserves investment. Avoid excessive enthusiasm without grounding in what is realistic.',
    'transit:sun|conjuncao|mars':
      'Sun conjunct natal Mars intensifies available energy, the impulse to act and the capacity for focused effort. The cycle tends to strengthen determination and readiness to face challenges with decisiveness. Channel this force with clear direction to avoid impulsiveness.',
    'transit:sun|conjuncao|meio_do_ceu':
      'Sun conjunct natal Midheaven illuminates the professional path and expands public visibility. The period tends to favor recognition and opportunities related to social position and career. Define clearly what you want to show and what you intend to achieve.',
    'transit:sun|conjuncao|moon':
      'Sun conjunct natal Moon creates convergence between conscious identity and the inner emotional world. The cycle favors alignment between what you feel and what you want to build, reducing internal conflict. Use this period to integrate personal needs with the life direction you are pursuing.',
    'transit:sun|conjuncao|neptune':
      'Sun conjunct natal Neptune expands sensitivity, creativity and receptivity to what lies beyond the ordinary. The cycle favors artistic work, spiritual practices and empathy, but may temporarily reduce practical clarity. Maintain concrete anchors while exploring what is more subtle.',
    'transit:sun|conjuncao|saturn':
      'Sun conjunct natal Saturn calls attention to structure, responsibility and the weight of what still needs to be consolidated. The cycle invites honest assessment of what has been built and strengthening of what remains fragile. Meet demands as an opportunity for genuine maturity.',
    'transit:sun|conjuncao|sun':
      'Sun conjunct natal Sun marks the solar return, the beginning of a complete new annual cycle of identity and purpose. The moment invites review of the past year and clear definition of what to cultivate in the next twelve months. Set intentions with awareness of what is truly a priority.',
    'transit:sun|conjuncao|uranus':
      'Sun conjunct natal Uranus ignites the impulse to break from convention and express personal uniqueness. The cycle may bring sudden changes or an intense desire to alter what is established. Embrace originality with strategy to avoid unnecessary instability.',
    'transit:sun|conjuncao|venus':
      'Sun conjunct natal Venus highlights pleasure, aesthetics, creativity and what genuinely attracts and satisfies. The cycle tends to amplify ease of connection, affective expression and appreciation of what is beautiful and valuable. Invest in activities that nurture real satisfaction and quality relationships.',
    'transit:sun|ingress|house_1':
      'Sun transiting the 1st house highlights identity, physical presence and how you present yourself to the world. Vitality and the desire for direct personal expression tend to be in the foreground during this period. A good window to reaffirm who you are and what you want to project in this cycle.',
    'transit:sun|ingress|house_2':
      'Sun transiting the 2nd house brings attention to material resources, personal values and what is truly useful and valuable to you. The cycle favors review of finances and clarity about what sustains security and wellbeing. Prioritize material decisions with discernment and alignment with what genuinely matters.',
    'transit:sun|ingress|house_3':
      'Sun transiting the 3rd house illuminates communication, learning and everyday exchanges with the immediate environment. Curiosity, mobility and the drive to connect ideas and people tend to be heightened. A good cycle for writing, studying and strengthening nearby networks of contact.',
    'transit:sun|ingress|house_5':
      'Sun transiting the 5th house highlights creativity, playful expression, romance and the genuine pleasure of being who you are. The cycle favors artistic projects, recreational activities and affective connections with more authenticity. A good moment to cultivate what brings joy and express talents with confidence.',
    'transit:sun|ingress|house_6':
      'Sun transiting the 6th house brings focus to work, health, routines and the processes that sustain daily life. The cycle favors attention to detail, to the body and to the efficiency of daily habits. Adjust routines that support productivity and wellbeing in a consistent way.',
    'transit:sun|ingress|house_7':
      'Sun transiting the 7th house illuminates partnerships, relationships and what emerges through significant contact with others. Greater clarity about commitments, cooperation and what is sought in important relationships tends to come forward. A good window to address partnership themes with openness and honesty.',
    'transit:sun|ingress|house_8':
      'Sun transiting the 8th house deepens questions of transformation, shared resources and bonds of trust. Themes such as inheritance, joint investments and what needs to be released or renewed may come to the surface. A period favorable for insight about what is hidden and for genuine renewal processes.',
    'transit:sun|ingress|house_9':
      'Sun transiting the 9th house expands the focus to philosophy, travel, higher education and broader worldviews. Curiosity about the unknown and the drive to go beyond the familiar tend to be heightened. A good moment to study, travel and revisit beliefs with an open mind.',
    'transit:sun|ingress|house_11':
      'Sun transiting the 11th house highlights groups, social networks, collective projects and the ideals that guide the future. Connections with people of similar values and participation in collective initiatives may become relevant. A good window to collaborate, review long-term goals and strengthen alliances.',
    'transit:sun|ingress|house_12':
      'Sun transiting the 12th house invites a period of introspection, withdrawal and contact with what usually remains outside everyday awareness. Inner life, contemplative practices and behind-the-scenes work tend to become more important. A good moment to integrate experiences and process what still needs closure.',
    'transit:sun|oposicao|ascendente':
      'Sun opposite natal Ascendant coincides with the transit through the Descendant, bringing light to relationships and what others mirror back. The period tends to highlight agreements, partnerships and how identity expresses itself in relational context. A good window to revisit commitments with honesty and openness.',
    'transit:sun|oposicao|jupiter':
      'Sun opposite natal Jupiter may amplify tendencies toward excess or confidence out of proportion with what is realistically viable. The cycle invites checking whether optimism is grounded in solid foundations or only in momentary enthusiasm. Balance expansion and moderation to avoid promises beyond your capacity.',
    'transit:sun|oposicao|mars':
      'Sun opposite natal Mars may bring tension between personal will and external forces that offer resistance. Direct conflicts or competitions may become visible during this cycle. Channel energy assertively, without reactivity, to move through this period with less depletion.',
    'transit:sun|oposicao|meio_do_ceu':
      'Sun opposite natal Midheaven transits the IC, directing attention to private life, family and roots. The period invites assessing how the personal foundation sustains or limits public projection. A good moment to tend to the domestic environment and strengthen internal emotional support.',
    'transit:sun|oposicao|mercury':
      'Sun opposite natal Mercury may bring reversals in communications, perspectives or relevant information. Others may present viewpoints that contradict or challenge what seemed settled. Listen with openness and review conclusions before taking a definitive position.',
    'transit:sun|oposicao|moon':
      'Sun opposite natal Moon may create tension between emotional needs and the conscious direction of life. What you feel and what you want to accomplish may seem in conflict during this cycle. A good window for greater awareness of your own needs and how they relate to your objectives.',
    'transit:sun|oposicao|saturn':
      'Sun opposite natal Saturn brings assessment of limits, unresolved responsibilities and the weight of what still needs to be addressed. The cycle may reveal where structure is fragile or where discipline has been postponed. Meeting demands with honesty is the most productive path at this time.',
    'transit:sun|oposicao|sun':
      'Sun opposite natal Sun marks the midpoint of the annual cycle, bringing light to what was initiated at the solar return. The period tends to highlight relationships and what others reflect about your own path. A good window to assess the progress of the personal cycle with clarity.',
    'transit:sun|oposicao|venus':
      'Sun opposite natal Venus may create tension between what pleases and what is necessary, between pleasure and responsibility. Relationships or financial matters may require attention and review during this cycle. Clarity about what is genuinely valued helps make decisions with greater discernment.',
    'transit:sun|quadratura|ascendente':
      'Sun square natal Ascendant may bring friction between personal identity and expectations of the immediate context. The cycle invites adjustments in how you present yourself or in your relationship with the nearby environment. A good window to identify where personal expression calls for more authenticity.',
    'transit:sun|quadratura|jupiter':
      'Sun square natal Jupiter may amplify impulses toward expansion without sufficient grounding in what is realistically viable. Overconfidence, promises beyond capacity or disproportionate spending may emerge as challenges. Use discernment to separate what has foundation from what is only enthusiasm.',
    'transit:sun|quadratura|mars':
      'Sun square natal Mars generates friction between the will to act and the resistances the context offers. Conflict, impatience and energetic depletion may arise if action is forced without clear direction. Channel the pressure toward resolving concrete obstacles rather than reacting impulsively.',
    'transit:sun|quadratura|meio_do_ceu':
      'Sun square natal Midheaven creates tension between inner personal development and the demands of the professional or public path. Career, reputation or life direction choices may feel more demanding and less obvious during this period. Review whether external objectives reflect genuine values and needs before acting.',
    'transit:sun|quadratura|mercury':
      'Sun square natal Mercury may bring pressure on communications, decisions or processing of important information. Misunderstandings, cognitive overload or difficulty articulating thoughts may arise during this cycle. Slow down before communicating and verify what has been understood.',
    'transit:sun|quadratura|neptune':
      'Sun square natal Neptune may create confusion between what is real and what is idealized or projected. Clarity of perception may be temporarily compromised, making it prudent to verify before deciding. Work with creativity and intuition while maintaining solid practical anchors.',
    'transit:sun|quadratura|pluto':
      'Sun square natal Pluto puts power dynamics, control and transformations that resist being ignored in evidence. The cycle may bring confrontations with what is hidden or with forces operating behind the scenes. Honesty about what needs to change is the foundation for moving through this period with integrity.',
    'transit:sun|quadratura|saturn':
      'Sun square natal Saturn creates pressure between desires for expression and structural limitations or unfulfilled responsibilities. The cycle may feel heavy, with obstacles that require patience and discipline. Treat restrictions as information about what needs to be strengthened.',
    'transit:sun|quadratura|sun':
      'Sun square natal Sun activates a tension point in the annual cycle, bringing challenges related to identity and personal expression. The moment may reveal conflicts between who you want to be and what the context allows or requires. A good window to adjust course and realign direction with authenticity.',
    'transit:sun|quadratura|uranus':
      'Sun square natal Uranus may bring unexpected disruptions, abrupt changes or impulses of rebellion against the established. The desire for rupture may be intense, but without planning it may result in unnecessary instability. Integrate the need for change with a more strategic approach.',
    'transit:sun|quadratura|venus':
      'Sun square natal Venus may generate tension in relationships, financial matters or in what genuinely brings satisfaction. Decisions related to pleasure, money or affection may require more attention and care during this cycle. Review what is being valued and whether it aligns with real needs.',
    'transit:sun|sextil|ascendente':
      'Sun sextile natal Ascendant creates a moment of more fluid personal expression aligned with the environment. Identity finds natural channels of projection without great resistance or excessive effort. A good moment for initiatives involving presence, visibility and communication of what you represent.',
    'transit:sun|sextil|jupiter':
      'Sun sextile natal Jupiter favors optimism, openness to opportunity and a sense of accessible expansion. The cycle supports growth when there is willingness to move in the direction of what has been glimpsed. The confidence that arises tends to be well-grounded when applied with discernment.',
    'transit:sun|sextil|mars':
      'Sun sextile natal Mars makes energy available for focused action with fluidity and without the depletion of conflict. Personal initiatives, physical projects and assertion of will find good support during this cycle. A good moment to set in motion what has been in planning.',
    'transit:sun|sextil|meio_do_ceu':
      'Sun sextile natal Midheaven supports professional visibility and alignment between identity and career objectives. The cycle may open space for recognition or opportunities related to public position. A good moment to position yourself clearly about what you offer and what you seek.',
    'transit:sun|sextil|mercury':
      'Sun sextile natal Mercury favors mental clarity, ease of communication and efficient processing of information. Articulation of ideas tends to flow with greater naturalness, facilitating negotiations and exchanges. A good period for writing, learning or conducting important conversations.',
    'transit:sun|sextil|neptune':
      'Sun sextile natal Neptune opens space for creativity, intuition and sensitivity more receptive to what is not immediately visible. The cycle favors artistic work, contemplative practices and connection with what goes beyond the ordinary. Use imagination with intentionality as a productive tool.',
    'transit:sun|sextil|pluto':
      'Sun sextile natal Pluto favors access to depth and resources that are not normally mobilized with ease. The cycle supports significant changes conducted with focus and intention, without the resistance of tension aspects. A good window for working personal transformation with less friction.',
    'transit:sun|sextil|saturn':
      'Sun sextile natal Saturn supports productive discipline, effective structure and responsibility that energizes rather than burdens. Long-term projects, commitments and consistent work find good backing during this cycle. A favorable moment to consolidate what has been built with real effort.',
    'transit:sun|sextil|sun':
      'Sun sextile natal Sun creates a favorable window for personal expression and for activating the potential of the current annual cycle. Identity finds fluidity and the capacity to move toward what matters tends to be accessible. A good moment for initiatives that express who you are being right now.',
    'transit:sun|sextil|uranus':
      'Sun sextile natal Uranus favors originality, innovation and openness to perspectives outside the usual. The cycle supports creative changes and expression of what is singular without generating unnecessary disruption. A good moment to experiment, explore what is different and trust innovative intuition.',
    'transit:sun|sextil|venus':
      'Sun sextile natal Venus favors pleasure, creativity and affective connections with more ease and naturalness. Social exchanges, aesthetic projects and expression of what pleases tend to flow well during this cycle. A good moment to invest in relationships, art and activities that nurture genuine satisfaction.',
    'transit:sun|trigono|ascendente':
      'Sun trine natal Ascendant favors authentic expression and a presence in the world that finds natural resonance. Identity and how you are perceived tend to be well aligned during this cycle. A good moment to present yourself, lead personal projects and affirm direction with confidence.',
    'transit:sun|trigono|jupiter':
      'Sun trine natal Jupiter favors expansion, confidence and the sense that the path is open for real growth. Opportunities that arrive during this cycle tend to have genuine foundation and meet receptivity. A good moment to amplify what is working and take initiatives with optimism.',
    'transit:sun|trigono|mars':
      'Sun trine natal Mars brings available energy, courage and the capacity to act with clarity and purpose. Personal initiatives and projects requiring drive find good ground during this cycle. A favorable window for concrete achievements, assertive decisions and work that demands vigor.',
    'transit:sun|trigono|meio_do_ceu':
      'Sun trine natal Midheaven supports harmony between identity and professional path, with possible recognition and clarity of direction. The cycle favors career progression when there is effort and alignment with what you want to build. A good moment for initiatives that increase visibility with authenticity.',
    'transit:sun|trigono|mercury':
      'Sun trine natal Mercury favors clarity of thought, effective communication and connection between intention and expression. Ideas flow more easily and articulating what you think tends to be heightened during this cycle. A good moment for presenting projects, having important conversations and developing concepts.',
    'transit:sun|trigono|neptune':
      'Sun trine natal Neptune supports creativity, spirituality and a sensitivity that enriches perception of daily life. The cycle favors contact with the transcendent, whether in art, contemplation or empathy. A propitious window for integrating the subtler dimension of experience with practical life.',
    'transit:sun|trigono|pluto':
      'Sun trine natal Pluto favors deep transformation conducted with focus and intention, without the friction of tension aspects. The cycle may facilitate significant renewal in areas where real change was needed. A good moment for deepening what matters and releasing what has lost meaning.',
    'transit:sun|trigono|saturn':
      'Sun trine natal Saturn favors maturity, productive structure and the sense that effort meets concrete results. Projects requiring discipline and commitment tend to progress well during this cycle. A good window to consolidate what has been built and take on responsibilities with confidence.',
    'transit:sun|trigono|sun':
      'Sun trine natal Sun creates a moment of fluidity and inner alignment, with personal expression finding good conditions for flourishing. This point in the annual cycle favors initiatives, creativity and connection with one\'s own purpose. A good window to advance in projects that express who you are becoming.',
    'transit:sun|trigono|uranus':
      'Sun trine natal Uranus favors originality, freedom of expression and openness to what is singular and innovative. Changes during this cycle tend to be creative and well received, without the shock of forced disruptions. A good moment to explore what is authentic and different, trusting what emerges.',
    'transit:sun|trigono|venus':
      'Sun trine natal Venus brings harmony, pleasure and the sense that affective and creative connections are well sustained. The cycle favors artistic expression, relationships and the capacity to enjoy what life offers. A good window to cultivate beauty, affection and what genuinely satisfies.',
    'transit:moon|conjuncao|ascendente':
      'Moon conjunct natal Ascendant intensifies emotional expression and receptivity in direct contact with the environment. The period tends to make the internal state more visibly present in interaction and communication. A good window to notice how emotions shape first impressions.',
    'transit:moon|conjuncao|jupiter':
      'Moon conjunct natal Jupiter expands the emotional world, generosity and the need to find meaning in everyday experiences. The cycle favors genuine emotional optimism and openness to what nurtures real wellbeing. Observe whether excess enthusiasm obscures more fundamental needs.',
    'transit:moon|conjuncao|meio_do_ceu':
      'Moon conjunct natal Midheaven makes the emotional state more visibly linked to professional trajectory and public reputation. The cycle may bring moments when personal life and public image intersect more evidently. A good window to integrate emotional needs with career objectives.',
    'transit:moon|conjuncao|mercury':
      'Moon conjunct natal Mercury creates a link between the emotional world and mental processing, making feelings more articulable. The cycle favors deep conversations, reflective writing and expression of what normally remains internal. A good window to name and understand what is being felt.',
    'transit:moon|conjuncao|moon':
      'Moon conjunct natal Moon, the monthly lunar return, restarts the emotional and instinctive cycle of the month. The period invites review of the needs for care, comfort and belonging that guide automatic responses. A good moment to notice what this cycle\'s emotions are pointing toward.',
    'transit:moon|conjuncao|neptune':
      'Moon conjunct natal Neptune amplifies emotional permeability and receptivity to what is subtle, imaginative or spiritual. The cycle favors deep empathy, creativity and contact with what transcends the ordinary, but may dissolve boundaries. Maintain discernment about what belongs to you and what belongs to others.',
    'transit:moon|conjuncao|pluto':
      'Moon conjunct natal Pluto plunges the emotional world into depth, intensity and the need to transform what has stagnated. The cycle may bring intense feelings or confrontations with what is normally suppressed. A good window to work with what is hidden honestly and with care.',
    'transit:moon|conjuncao|saturn':
      'Moon conjunct natal Saturn may bring emotional weight, a sense of affective restriction or responsibilities that limit the natural flow of feelings. The cycle invites emotional maturity, honest assessment of real needs and structuring of how to care for oneself. A good moment to strengthen the emotional foundation with discernment.',
    'transit:moon|conjuncao|venus':
      'Moon conjunct natal Venus harmonizes the emotional world with pleasure, aesthetics and the need for quality affective connection. The cycle favors genuine satisfaction in relationships, creative activities and environments that nurture wellbeing. A good window to cultivate what genuinely pleases and nourishes emotionally.',
    'transit:moon|ingress|house_1':
      'Moon transiting the 1st house intensifies emotional expression and makes internal reactions more visibly present in daily life. The period favors self-awareness and direct contact with how the emotional state affects presence. A good window to notice what emotions reveal about current needs.',
    'transit:moon|ingress|house_3':
      'Moon transiting the 3rd house activates the emotional world through communication, learning and everyday exchanges. The period favors conversations charged with meaning and more attentive to what is felt. A good window to express what is internal and to receive what those nearby want to share.',
    'transit:moon|ingress|house_5':
      'Moon transiting the 5th house intensifies the need for creative expression, pleasure and affective connections that nurture authenticity. The cycle favors playful activities, artistic expression and relationships with more affection and reciprocity. A good period to cultivate what genuinely delights and satisfies emotionally.',
    'transit:moon|ingress|house_6':
      'Moon transiting the 6th house activates the emotional world through routine, work and care for the body. The period favors attention to what the body needs and to how emotions influence health and daily efficiency. A good window to adjust habits that support emotional and physical wellbeing.',
    'transit:moon|ingress|house_7':
      'Moon transiting the 7th house intensifies the need for connection, partnership and emotional receptivity in relating with others. The period favors greater sensitivity in relationships and clarity about what is sought in the bond. A good window to tend to significant relationships with attention and openness.',
    'transit:moon|ingress|house_8':
      'Moon transiting the 8th house takes the emotional world into zones of depth, transformation and real intimacy. The cycle favors contact with what lies beneath the surface, including fears, attachments and needs for renewal. A period of greater emotional intensity that can be well used with internal honesty.',
    'transit:moon|ingress|house_9':
      'Moon transiting the 9th house directs the emotional world toward the search for meaning, expanded perspective and the need to go beyond the familiar. The cycle favors emotional curiosity, openness to what is different and contact with what expands the sense of purpose. A good period to nourish belief and worldview with real experience.',
    'transit:moon|ingress|house_10':
      'Moon transiting the 10th house connects the emotional world to the professional path and public image. The period may make emotions more visibly present in the work and career context. A good window to notice how affective needs influence professional objectives and decisions.',
    'transit:moon|ingress|house_11':
      'Moon transiting the 11th house directs the emotional world toward groups, networks of belonging and collective ideals. The cycle favors the need for connection with community, friends and causes that resonate with personal values. A good moment to nurture collective relationships and notice what belonging nourishes.',
    'transit:moon|ingress|house_12':
      'Moon transiting the 12th house takes the emotional world into zones of withdrawal, quiet processing and contact with what does not normally emerge in daily awareness. The cycle favors emotional rest, dreams and contemplative practices. A good period to integrate feelings before a new lunar cycle begins.',
    'transit:moon|oposicao|ascendente':
      'Moon opposite natal Ascendant, transiting the Descendant, amplifies emotional receptivity in relationships and what the other mirrors about one\'s own needs. The cycle may make affective projections and what is expected from connection with others more visible. A good window to balance self-care and relational care.',
    'transit:moon|oposicao|meio_do_ceu':
      'Moon opposite natal Midheaven, transiting the IC, intensifies inner life, family roots and what sustains emotionally. The cycle may bring tension between internal affective needs and demands of public or professional life. A good window to tend to the emotional foundation without neglecting external responsibilities.',
    'transit:moon|oposicao|moon':
      'Moon opposite natal Moon, the midpoint of the lunar cycle, illuminates what was activated at the monthly reset. The period may surface needs that were underground and confront the emotional state with the external environment. A good window to assess how much this cycle\'s emotions are being acknowledged.',
    'transit:moon|oposicao|neptune':
      'Moon opposite natal Neptune may create tension between concrete emotional needs and a very fluid inner world that is difficult to anchor. The cycle may bring affective confusion, projections or heightened sensitivity to the environment. A good window to maintain emotional discernment without denying the depth of what is felt.',
    'transit:moon|oposicao|pluto':
      'Moon opposite natal Pluto may bring emotional intensity, confrontation with what was suppressed and the need to transform stagnant affective patterns. The cycle may reveal power dynamics in relationships or internal forces that ask for recognition. A good window to work with what needs renewal in the emotional world.',
    'transit:moon|oposicao|saturn':
      'Moon opposite natal Saturn may bring emotional coolness, a sense of affective limitation or the weight of responsibilities that inhibit the natural flow of feelings. The cycle invites assessing what is being contained or denied and what structure actually supports real care. A good window to balance emotional maturity with genuine receptivity.',
    'transit:moon|oposicao|sun':
      'Moon opposite natal Sun corresponds to the personal full moon, bringing illumination about emotional needs in relation to conscious objectives. The period may make visible the conflicts between what is felt and what is sought to be accomplished. A good window to integrate intention and emotion with more awareness.',
    'transit:moon|oposicao|uranus':
      'Moon opposite natal Uranus may bring emotional instability, abrupt shifts in mood or the need to break from the familiar. The cycle may reveal tension between the need for security and the desire for freedom in the affective world. A good window to welcome the need for novelty without compromising the emotional support needed.',
    'transit:moon|oposicao|venus':
      'Moon opposite natal Venus may create tension between what is felt emotionally and what is considered pleasant or aesthetically satisfying. The cycle may reveal conflicts between genuine affective needs and what presents itself as attractive. A good window to distinguish what truly nourishes from what merely pleases superficially.',
    'transit:moon|quadratura|ascendente':
      'Moon square natal Ascendant may bring friction between the inner emotional world and how that state projects onto the environment. The cycle may make it more challenging to maintain coherence between what is felt and how one appears to the world. A good window to identify where emotional expression calls for more authenticity.',
    'transit:moon|quadratura|meio_do_ceu':
      'Moon square natal Midheaven may bring tension between affective needs and the demands of career or public image. The cycle invites assessing how much the emotional world is being integrated or ignored in the professional path. A good window to adjust the relationship between inner life and external objectives.',
    'transit:moon|quadratura|mercury':
      'Moon square natal Mercury may create friction between the emotional world and the process of thought and communication. The cycle may make it harder to articulate feelings with precision or to integrate logic and emotion. A good window to slow down and find words that truly name what is being experienced.',
    'transit:moon|quadratura|moon':
      'Moon square natal Moon activates a tension point in the monthly cycle, revealing conflicts between emotional needs and the current context. The period may bring emotional instability or difficulty maintaining affective balance. A good window to identify what needs adjustment in how one\'s own needs are being tended to.',
    'transit:moon|quadratura|neptune':
      'Moon square natal Neptune may create emotional confusion, difficulty distinguishing what belongs to oneself from what belongs to others, or heightened sensitivity. The cycle invites greater affective discernment and avoiding decisions based only on fluid emotional states. A good window to work with what is felt with care and grounding.',
    'transit:moon|quadratura|pluto':
      'Moon square natal Pluto may bring emotional intensity, confrontation with deep affective patterns or the need for transformation that can no longer be postponed. The cycle invites honesty about what is being suppressed or denied in the emotional world. A good window to work with what needs transforming with courage and care.',
    'transit:moon|quadratura|saturn':
      'Moon square natal Saturn may bring heaviness, emotional coolness or a feeling of restriction that inhibits the flow of feelings. The cycle invites assessing where emotional rigidity or excess control is preventing real receptivity. A good window to balance maturity and emotional openness.',
    'transit:moon|quadratura|sun':
      'Moon square natal Sun creates tension between the inner emotional world and the conscious direction of life. The cycle may reveal conflicts between what is felt and what is sought to be built, asking for integration. A good window to acknowledge emotional needs without letting them dominate long-term decisions.',
    'transit:moon|quadratura|uranus':
      'Moon square natal Uranus may bring emotional instability, abrupt mood shifts or an impulsive need to break from the routine. The cycle invites welcoming the need for novelty without acting reactively or impulsively. A good window to find creative ways to include what is different in the emotional routine.',
    'transit:moon|quadratura|venus':
      'Moon square natal Venus may generate tension between genuine affective needs and what seems pleasant or aesthetically satisfying. The cycle may reveal conflicts in relationships or dissatisfaction with what was sought for superficial pleasure. A good window to distinguish what truly nourishes from what only pleases momentarily.',
    'transit:moon|sextil|ascendente':
      'Moon sextile natal Ascendant creates a window of more fluid emotional expression that is well received by the environment. The cycle favors receptivity, authenticity and ease of connection through presence. A good moment to share what is felt and to build affective bridges with the surroundings.',
    'transit:moon|sextil|jupiter':
      'Moon sextile natal Jupiter favors emotional wellbeing, generosity and a sense that affective needs can be met with more ease. The cycle supports genuine optimism and openness to experiences that expand the sense of satisfaction. A good moment to nourish what expands the inner world with discernment.',
    'transit:moon|sextil|mars':
      'Moon sextile natal Mars makes emotional energy available for action with more fluidity and less conflict between feeling and initiative. The cycle favors affective assertiveness and the capacity to act from what is felt. A good moment to set in motion what had been emotionally held back.',
    'transit:moon|sextil|meio_do_ceu':
      'Moon sextile natal Midheaven favors alignment between the emotional world and the professional path. The cycle supports career decisions that take genuine personal needs into account and nurture wellbeing. A good moment to integrate what is felt with what is sought to be built professionally.',
    'transit:moon|sextil|mercury':
      'Moon sextile natal Mercury favors the articulation of the emotional world in more fluid words and thoughts. The cycle supports reflective conversations, expressive writing and cognitive processing of feelings. A good moment to name what is being lived and to find those who know how to listen.',
    'transit:moon|sextil|moon':
      'Moon sextile natal Moon creates a window of emotional fluidity and natural alignment between internal needs and the context. The cycle favors receptivity, care for oneself and those nearby without great resistances. A good moment to notice what nourishes and to cultivate what sustains affective wellbeing.',
    'transit:moon|sextil|neptune':
      'Moon sextile natal Neptune favors sensitivity, intuition and openness to what is subtle and transcendent in the emotional world. The cycle supports creativity, empathy and contemplative practices that nourish inner life. A good moment to work with the imaginative and spiritual world with intentionality.',
    'transit:moon|sextil|pluto':
      'Moon sextile natal Pluto favors access to emotional depth with more ease and less resistance than in tension aspects. The cycle supports processes of affective transformation conducted with focus and intention. A good moment to work with what is hidden in the emotional world with courage and care.',
    'transit:moon|sextil|sun':
      'Moon sextile natal Sun creates a favorable window for alignment between the emotional world and the conscious direction of life. The cycle favors integration between what is felt and what is sought to be realized, with less internal conflict. A good moment to make decisions that honor both affective needs and long-term objectives.',
    'transit:moon|sextil|uranus':
      'Moon sextile natal Uranus favors openness to novelty, emotional creativity and the willingness to include what is different in the affective world. The cycle supports changes in the emotional field that are well received and do not generate unnecessary disruption. A good moment to explore new ways of caring for oneself and relating.',
    'transit:moon|sextil|venus':
      'Moon sextile natal Venus favors emotional harmony, pleasure and affective connections with more naturalness and genuine satisfaction. The cycle supports nurturing relationships, aesthetic activities and an expanded sense of wellbeing. A good moment to cultivate what genuinely pleases and nourishes in the affective world.',
    'transit:moon|trigono|ascendente':
      'Moon trine natal Ascendant favors authentic emotional expression and receptivity in the environment in a natural and well-received way. The cycle facilitates connection, affective presence and alignment between what is felt and how one appears. A good moment to cultivate relationships with authenticity and care.',
    'transit:moon|trigono|jupiter':
      'Moon trine natal Jupiter favors emotional wellbeing, generosity and the sense that the inner world is expanding with foundation. The cycle facilitates genuine satisfaction, affective optimism and openness to enriching experiences. A good moment to nourish what amplifies the sense of meaning and quality of life.',
    'transit:moon|trigono|mars':
      'Moon trine natal Mars favors emotional assertiveness, energy available to act from what is felt and the capacity to defend needs without conflict. The cycle facilitates integration between action and the affective world. A good moment to set in motion what had been held back through hesitation.',
    'transit:moon|trigono|meio_do_ceu':
      'Moon trine natal Midheaven favors harmony between the emotional world and the professional path, with the possibility that affective needs are sustained by career. The cycle facilitates decisions that integrate inner life and external objectives. A good moment to advance professionally in a way aligned with who you are.',
    'transit:moon|trigono|mercury':
      'Moon trine natal Mercury favors fluid articulation of the emotional world in thought and communication. The cycle facilitates expressing feelings with precision and integrating logic and emotion. A good moment for meaningful conversations, reflective writing and emotional processing through language.',
    'transit:moon|trigono|moon':
      'Moon trine natal Moon creates a moment of emotional fluidity and natural alignment between the internal rhythm and the lunar cycle. The cycle facilitates receptivity, self-care and affective wellbeing with more naturalness. A good moment to notice what the emotional world is asking for and to respond with gentleness.',
    'transit:moon|trigono|neptune':
      'Moon trine natal Neptune favors sensitivity, intuition and connection with what is subtle and transcendent in a fluid and productive way. The cycle facilitates creativity, empathy and contemplative practices that nourish inner life. A good moment to work with the imaginative world with openness and intentionality.',
    'transit:moon|trigono|pluto':
      'Moon trine natal Pluto favors deep emotional transformation conducted with focus and intention, without the friction of tension aspects. The cycle facilitates affective renewal and access to what was hidden in the emotional world. A good moment to deepen what matters and release what has lost affective value.',
    'transit:moon|trigono|sun':
      'Moon trine natal Sun favors alignment between the emotional world and the conscious direction of life, with natural integration between what is felt and what is sought to be realized. The cycle facilitates wellbeing, coherent decisions and the sense that inner and outer are in harmony. A good moment to advance with confidence.',
    'transit:moon|trigono|uranus':
      'Moon trine natal Uranus favors openness to the new in the emotional world, with creative changes that are well integrated. The cycle facilitates affective renewal, innovation in self-care and receptivity to the unexpected without loss of stability. A good moment to explore what is different and authentic in the emotional field.',
    'transit:moon|trigono|venus':
      'Moon trine natal Venus favors harmony, pleasure and affective connections sustained with naturalness and genuine satisfaction. The cycle facilitates emotional wellbeing, creative expression and nurturing relationships. A good moment to cultivate what genuinely pleases and nourishes, with openness and reciprocity.',

    // Saturn — missing entries
    'transit:saturn|conjuncao|pluto':
      'Saturn conjunct natal Pluto combines structure and transformative power in a cycle of deep and lasting reconfigurations. The period may require definitive decisions about what must be eliminated or consolidated on more solid foundations. A moment of confrontation with what has been postponed and now demands structural resolution.',
    'transit:saturn|conjuncao|uranus':
      'Saturn conjunct natal Uranus creates creative tension between the need for order and the impulse toward rupture and renewal. The period may bring concrete changes in areas where old structures no longer accommodate the new. A cycle of reformulation that calls for equanimity between what needs to be preserved and what needs to be released.',
    'transit:saturn|ingress|house_2':
      'Saturn ingressing into House 2 initiates a cycle of deep revision of financial habits and the values that sustain material life. The period invites building economic security consistently, eliminating unfounded expenses and developing financial self-discipline. A good window to create more solid material foundations aligned with what truly holds value.',
    'transit:saturn|ingress|house_7':
      'Saturn ingressing into House 7 initiates a cycle of seriousness and responsibility in intimate partnerships and long-term bonds. The period may bring challenges requiring genuine maturity and commitment in relationships, revealing where solid foundations are lacking. A good window to consolidate genuine partnerships or to recognize those that no longer sustain the necessary exchange.',
    'transit:saturn|ingress|house_8':
      'Saturn ingressing into House 8 initiates a cycle of confrontation with issues of sharing, transformation and resources involving other people. The period invites reorganizing shared financial agreements and addressing what has been avoided in the field of deep transformation. A good window to establish more conscious foundations in relationships of interdependence.',
    'transit:saturn|ingress|house_9':
      'Saturn ingressing into House 9 initiates a cycle of revision of beliefs, worldview and commitments to long-term learning. The period invites building a more structured philosophy of life, replacing vague beliefs with deeper understanding. A good window to commit to serious studies, continuing education or expansion grounded in real foundations.',
    'transit:saturn|ingress|house_11':
      'Saturn ingressing into House 11 initiates a cycle of revision of collective bonds, social networks and long-term objectives. The period invites assessing with maturity which groups and ideals truly sustain the path and which are merely comfortable on the surface. A good window to build more solid connections and commit to collective goals with genuine responsibility.',
    'transit:saturn|ingress|house_12':
      'Saturn ingressing into House 12 initiates a cycle of confrontation with what has been repressed, avoided or left in the background of inner life. The period may bring a sense of withdrawal or seclusion that, well used, becomes space for deep revision and organization of the subjective world. A good window to work with what exists in the shadows and to build more integrated psychological foundations.',
    'transit:saturn|oposicao|meio_do_ceu':
      'Saturn opposite natal Midheaven points to tension between the external demands of career and the needs for groundedness and domestic life. The period may bring confrontations between professional ambition and what sustains the inner world. A good window to assess whether the external trajectory is aligned with the foundations that support the path.',
    'transit:saturn|oposicao|moon':
      'Saturn opposite natal Moon tends to create friction between rational structure and the deepest emotional needs. The period may bring a sense of emotional restriction, emotional distance or difficulty in caring for oneself with the same attention given to external responsibilities. A good window to recognize where discipline has replaced care and to seek greater integration.',
    'transit:saturn|oposicao|neptune':
      'Saturn opposite natal Neptune tensions the line between what is real and what is idealized, requiring discernment about where fantasy replaces concrete action. The period may reveal disappointments in areas where there was excessive projection or escape from reality. A good window to consolidate what has substance and to release what is nothing more than unfounded illusion.',
    'transit:saturn|oposicao|venus':
      'Saturn opposite natal Venus tends to bring friction in relationships, affective expression or the relationship with pleasure and abundance. The period may reveal misalignments between what is desired and what real commitments offer. A good window to honestly assess what in relationships needs more structure and what simply no longer corresponds to what is needed.',
    'transit:saturn|quadratura|ascendente':
      'Saturn square natal Ascendant may create friction between the need for internal structure and the way one presents to the external world. The period tends to reveal where public identity and private identity are in conflict, requiring adjustments toward authenticity. A good window to work on coherence between who one is and how one appears in spaces of contact.',
    'transit:saturn|quadratura|jupiter':
      'Saturn square natal Jupiter creates tension between the impulse toward expansion and the limits that reality imposes. The period may bring frustrations when optimism exceeds what can be sustained with available resources. A good window to calibrate ambitions with what is feasible and to transform enthusiasm into concrete and sustainable plans.',
    'transit:saturn|quadratura|meio_do_ceu':
      'Saturn square natal Midheaven may bring significant challenges in the professional trajectory, revealing where the career foundations need revision. The period invites confronting unrealistic expectations about public life and building the path with more structural honesty. A good window to realign external objectives with what truly sustains the journey.',
    'transit:saturn|quadratura|neptune':
      'Saturn square natal Neptune creates tension between the need for form and definition and the impulse toward dissolution and transcendence. The period may reveal where the lack of limits is generating confusion or where excessive rigidity is stifling creativity and spirituality. A good window to find structures that accommodate what is subtle without losing clarity.',
    'transit:saturn|sextil|mercury':
      'Saturn sextile natal Mercury favors disciplined thinking, precise communication and the ability to organize ideas with clarity and authority. The cycle facilitates rigorous learning, structured writing and intellectual planning. A good moment to commit to mental projects requiring consistency and analytical depth.',
    'transit:saturn|sextil|pluto':
      'Saturn sextile natal Pluto favors the constructive use of power, with the ability to transform structures deeply and sustainably. The cycle facilitates reorganization of life areas that needed renewal without the friction of tense aspects. A good moment to consolidate changes that arose from previous transformative processes.',
    'transit:saturn|trigono|mercury':
      'Saturn trine natal Mercury favors mental clarity, the ability to communicate with authority and the skill to organize thoughts and projects efficiently. The cycle facilitates commitment to demanding learning and the expression of ideas with maturity and precision. A good moment to advance in intellectual projects with consistency and focus.',
    'transit:saturn|trigono|pluto':
      'Saturn trine natal Pluto favors the transformation of deep structures in a constructive way and with a sense of purpose. The cycle facilitates the consolidation of significant changes that require durability and clear intention. A good moment to build what should endure on foundations that have undergone genuine renewal.',

    // Uranus — missing entries
    'transit:uranus|conjuncao|neptune':
      'Uranus conjunct natal Neptune combines the impulse for disruption with transcendent sensitivity, creating a cycle of transformations that involve both the concrete and the imaginative. The period may bring unexpected changes in spirituality, creativity or perceptions about what is real. A moment of openness to what has no fixed form, with potential for deep renewal in the field of intuition and expanded consciousness.',
    'transit:uranus|conjuncao|pluto':
      'Uranus conjunct natal Pluto combines sudden rupture and profound transformation in a cycle of radical and potentially irreversible reconfigurations. The period may bring abrupt changes in areas where power, destruction and renewal were already at work. A moment of maximum intensity where the old must give way to the entirely new.',
    'transit:uranus|ingress|house_2':
      'Uranus ingressing into House 2 initiates a cycle of disruptions and innovations in financial life and value systems. The period may bring abrupt changes in income, new ways of generating or managing resources, or radical revisions of what is considered valuable. A good window to experiment with new models of sustainability and release attachments to fixed forms of material security.',
    'transit:uranus|ingress|house_4':
      'Uranus ingressing into House 4 initiates a cycle of unexpected changes in domestic life, family or the sense of home. The period may bring relocations, family restructurings or deep revisions of what it means to belong and have roots. A good window to release inherited family patterns and create new ways of inhabiting and grounding oneself.',
    'transit:uranus|ingress|house_6':
      'Uranus ingressing into House 6 initiates a cycle of innovations and interruptions in daily routine, work and health habits. The period may bring abrupt changes in employment, new work methodologies or the need to reformulate everyday practices. A good window to experiment with freer and more inventive approaches to organizing practical life.',
    'transit:uranus|ingress|house_8':
      'Uranus ingressing into House 8 initiates a cycle of unexpected changes in areas of transformation, shared resources and what is hidden. The period may bring disruptions in inheritances, debts, financial partnerships or in the process of inner transformation itself. A good window to release power structures that no longer correspond to what one truly is.',
    'transit:uranus|ingress|house_9':
      'Uranus ingressing into House 9 initiates a cycle of radical renewal in beliefs, worldview and pathways of expansion. The period may bring rupture with dogmas, openness to unconventional philosophies or abrupt changes in travel or education plans. A good window to question what has been taken as truth and open oneself to broader and more original perspectives.',
    'transit:uranus|ingress|house_11':
      'Uranus ingressing into House 11 initiates a cycle of renewal in social groups, affinity networks and collective objectives. The period may bring changes in social circles, entry into innovative communities or a redefinition of the ideals guiding the future. A good window to connect with people and causes that open new horizons and break habitual molds.',
    'transit:uranus|ingress|house_12':
      'Uranus ingressing into House 12 initiates a cycle of ruptures and renewals in the subjective world, unconscious processes and what has been repressed. The period may bring unexpected irruptions of hidden material or liberating insights about limiting patterns. A good window to work with inner life with openness to the unexpected and without attachment to fixed forms of identity.',
    'transit:uranus|oposicao|ascendente':
      'Uranus opposite natal Ascendant tends to bring disturbances from the external environment that force revisions in self-perception and the way one presents. The period may reveal tension between the need for individual freedom and the demands of relationships. A good window to notice where the external environment is signaling the need for renewal in how one positions in the world.',
    'transit:uranus|oposicao|jupiter':
      'Uranus opposite natal Jupiter may bring excess optimism or uncontrolled expansion in areas lacking solid foundations. The period may reveal tension between the desire for rapid growth and the reality of existing limits. A good window to calibrate enthusiasm with discernment and transform impulses for expansion into feasible plans.',
    'transit:uranus|oposicao|mars':
      'Uranus opposite natal Mars may bring unexpected conflicts, disruptive impulses or reactions from others that challenge the habitual way of acting and asserting oneself. The period may reveal tension between the need for autonomy and the demands arriving from outside. A good window to work with assertiveness flexibly and without excessive reactivity.',
    'transit:uranus|oposicao|meio_do_ceu':
      'Uranus opposite natal Midheaven may bring abrupt changes in the professional trajectory or public image, with disruptions arising from domestic areas or the past. The period may reveal tension between inner security and the demands of the external world. A good window to revisit the foundations of the path and verify whether the public direction still makes sense.',
    'transit:uranus|oposicao|moon':
      'Uranus opposite natal Moon may bring emotional instability, ruptures in affective patterns or an urgent need for freedom in the emotional field. The period may reveal tension between the familiar and the new in the inner world. A good window to notice where inherited affective patterns are asking for renewal.',
    'transit:uranus|oposicao|neptune':
      'Uranus opposite natal Neptune may create disruptions in the field of spirituality, creativity or the illusions one lives by. The period may reveal tension between the need for concrete awakening and the attachment to fantasies or altered states of consciousness. A good window to work with intuition more discerningly and without losing clarity about the real.',
    'transit:uranus|oposicao|pluto':
      'Uranus opposite natal Pluto may bring confrontations between disruptive force and transformative power in an intense and potentially destabilizing way. The period may reveal tension between abrupt rupture and gradual, deep transformation. A good window to distinguish what needs to change quickly from what needs to be transformed with more care and intention.',
    'transit:uranus|oposicao|saturn':
      'Uranus opposite natal Saturn creates tension between the impulse toward freedom and innovation and the need for structure, limits and responsibility. The period may reveal conflict between the desire to break with the established and what still needs continuity. A good window to integrate the new without destroying what still sustains and holds value.',
    'transit:uranus|oposicao|sun':
      'Uranus opposite natal Sun may bring disruptions in the expression of identity, with external provocations that challenge the sense of who one is. The period may reveal tension between the need for authenticity and the expectations arriving from outside. A good window to revisit what defines the core of identity and to renew personal expression with more originality.',
    'transit:uranus|oposicao|uranus':
      'Uranus opposite natal Uranus marks the peak of the Uranian cycle, with tension between who one has been and who one is becoming in the field of originality and freedom. The period may bring abrupt revisions in life direction and in how one expresses their own singularity. A good window to embrace the need for renewal without losing the thread of the lived trajectory.',
    'transit:uranus|oposicao|venus':
      'Uranus opposite natal Venus may bring unexpected disruptions in relationships, affective life or the relationship with pleasure and values. The period may reveal tension between the need for emotional freedom and the attachment to established ways of relating. A good window to revisit what in relationships is still genuine and what needs renewal or release.',
    'transit:uranus|quadratura|ascendente':
      'Uranus square natal Ascendant may create friction between the need for inner renewal and how that is expressed or received in the environment. The period may bring conflicts between the impulse to be different and external expectations. A good window to work with authenticity maturely, without explosions that damage important relationships.',
    'transit:uranus|quadratura|jupiter':
      'Uranus square natal Jupiter may generate excess and impulsivity, with a tendency to take risks hastily or to expand without clear limits. The period may bring friction between exaggerated optimism and the concrete reality of consequences. A good window to channel enthusiasm with more discernment and without bets that exceed what is sustainable.',
    'transit:uranus|quadratura|mars':
      'Uranus square natal Mars may bring impulsivity, reactivity or unexpected conflicts requiring careful management of assertive energy. The period may create friction between the desire to act freely and radically and the demands for coherence and consistency. A good window to work with will more equanimously, channeling energy creatively without losing focus.',
    'transit:uranus|quadratura|meio_do_ceu':
      'Uranus square natal Midheaven may bring significant disruptions in the professional trajectory, with unexpected changes that challenge the established direction. The period may create tension between the public path and inner needs for renewal and freedom. A good window to revisit career objectives and verify whether they still correspond to what truly drives growth.',
    'transit:uranus|quadratura|mercury':
      'Uranus square natal Mercury may bring accelerated thinking, disruptive communication or abrupt changes in the field of ideas and information. The period may create friction between brilliant insights and the difficulty of implementing them consistently. A good window to channel intellectual creativity with more patience and without rushing conclusions.',
    'transit:uranus|quadratura|neptune':
      'Uranus square natal Neptune may create friction between the impulse toward awakening and the desire to remain in states of transcendence or illusion. The period may bring confusion between genuine insight and creative escape from reality. A good window to work with spirituality and creativity with more clarity and without losing grounding in the real.',
    'transit:uranus|quadratura|pluto':
      'Uranus square natal Pluto may generate periods of strong tension between the need for rupture and the process of deep transformation, with possible crises that force radical renewals. The period may bring conflict between what needs to change immediately and what needs a slower, deeper process. A good window to work with change intentionally and without excessive reactivity.',
    'transit:uranus|quadratura|saturn':
      'Uranus square natal Saturn creates friction between the impulse to break with structures and the need to maintain foundations, commitments and continuity. The period may bring conflict between the desire for total freedom and the concrete responsibilities that still need to be honored. A good window to integrate innovation within structures that still sustain, without destroying what holds lasting value.',
    'transit:uranus|quadratura|uranus':
      'Uranus square natal Uranus marks a phase of friction between the current expression of one\'s own singularity and what still needs to be released or renewed. The period may bring tension between who one has been and who one is becoming in the field of authenticity and freedom. A good window to revisit one\'s own trajectory with openness to what needs to be reformulated.',
    'transit:uranus|quadratura|venus':
      'Uranus square natal Venus may bring unexpected disruptions in relationships or affective life, with the need to revise habitual ways of loving and valuing. The period may create friction between the need for emotional freedom and established affective attachments. A good window to question what in relationships truly nourishes and what needs renewal.',
    'transit:uranus|sextil|ascendente':
      'Uranus sextile natal Ascendant favors renewal in the way one presents to the world, with openness to changes that express singularity more authentically. The cycle facilitates creative adjustments in self-image and in the way one interacts with the environment. A good moment to experiment with new ways of positioning without the weight of habitual expectations.',
    'transit:uranus|sextil|jupiter':
      'Uranus sextile natal Jupiter favors creative expansion, openness to new perspectives and opportunities that arrive unexpectedly but receptively. The cycle facilitates combinations of optimism and innovation that open unusual paths. A good moment to invest in original projects with calibrated optimism and openness to the improbable.',
    'transit:uranus|sextil|meio_do_ceu':
      'Uranus sextile natal Midheaven favors innovations in career, openness to new professional directions and the ability to stand out through originality. The cycle facilitates creative changes in the trajectory that arrive with more fluidity than friction. A good moment to present innovative ideas, explore new roles or reposition the professional image.',
    'transit:uranus|sextil|neptune':
      'Uranus sextile natal Neptune favors the creative combination of intuition and innovation, with insights that unite the concrete and the transcendent productively. The cycle facilitates expansive creativity, renewed spirituality and perceptions that open new possibilities. A good moment to work on creative or spiritual projects with openness to the unexpected and the inspiring.',
    'transit:uranus|sextil|pluto':
      'Uranus sextile natal Pluto favors creative transformations that arrive with genuine renewal and without the friction of tense aspects. The cycle facilitates deep changes that are integrated with more fluidity and intentionality. A good moment to consolidate transformations that were underway and to innovate in areas where power and renewal meet.',
    'transit:uranus|sextil|saturn':
      'Uranus sextile natal Saturn favors the creative integration of innovation and structure, with the ability to bring the new without destroying what still sustains. The cycle facilitates consistent reforms, planned changes and the renewal of structures with more skill and less resistance. A good moment to modernize what already exists with creativity and responsibility.',
    'transit:uranus|sextil|sun':
      'Uranus sextile natal Sun favors renewal of personal expression, openness to new ways of existing and the ability to innovate in the way one presents to the world. The cycle facilitates experimentation, authenticity and the discovery of original aspects of one\'s own identity. A good moment to express who one is in uncommon ways and to welcome what is singular without resistance.',
    'transit:uranus|sextil|uranus':
      'Uranus sextile natal Uranus favors moments of renewal in the expression of one\'s own singularity, with openness to the new and the ability to integrate changes with fluidity. The cycle facilitates creative adjustments in the life trajectory that arrive with more ease than imposition. A good moment to welcome the unexpected and transform the different into a productive resource.',
    'transit:uranus|trigono|ascendente':
      'Uranus trine natal Ascendant favors fluid renewal in the way one presents and interacts with the world, with expression of singularity that is well received by the environment. The cycle facilitates creative changes in self-image and in the way one initiates contacts. A good moment to experiment with new social roles and present more authentic and original versions of oneself.',
    'transit:uranus|trigono|jupiter':
      'Uranus trine natal Jupiter favors creative expansion and openness to innovative opportunities that arrive unexpectedly and receptively. The cycle facilitates growth through original paths, with a productive combination of enthusiasm and openness to the new. A good moment to invest in projects that depart from the conventional and to reap the fruits of previous changes.',
    'transit:uranus|trigono|meio_do_ceu':
      'Uranus trine natal Midheaven favors innovations in career and public trajectory that arrive with fluidity and openness. The cycle facilitates new professional directions, expression of originality in work and openness to positions that value singularity. A good moment to renew the professional direction creatively and without significant resistance.',
    'transit:uranus|trigono|neptune':
      'Uranus trine natal Neptune favors the creative union of intuition and innovation, with insights that connect the concrete and the transcendent fluidly. The cycle facilitates expanded creativity, renewed spirituality and perceptions that open unexpected horizons. A good moment to work on projects that combine sensitivity and originality with genuine openness and production.',
    'transit:uranus|trigono|pluto':
      'Uranus trine natal Pluto favors deep and creative transformations that arrive with more fluidity than in tense aspects. The cycle facilitates significant structural renewals that are well integrated and constructive. A good moment to consolidate changes that came from transformative processes and to innovate in areas of power and renewal with clear intention.',
    'transit:uranus|trigono|saturn':
      'Uranus trine natal Saturn favors the fluid integration of innovation and structure, with the ability to renew the established without breaking what still sustains. The cycle facilitates creative reforms, modernization of structures and changes that arrive with less resistance than usual. A good moment to bring the new with consistency and to innovate within limits that still make sense.',
    'transit:uranus|trigono|sun':
      'Uranus trine natal Sun favors renewal of personal expression and the discovery of more authentic and original ways of existing and affirming oneself in the world. The cycle facilitates creative experimentation, innovations in identity and expression of what is singular without significant friction. A good moment to explore new dimensions of who one is and to welcome what is different and genuine.',
    'transit:uranus|trigono|uranus':
      'Uranus trine natal Uranus favors moments of fluid renewal in the expression of one\'s own singularity, with natural integration of arriving changes. The cycle facilitates creative adjustments in the life trajectory that are well received and well integrated. A good moment to advance toward what is authentic and original, with less resistance and more openness.',

    // Neptune — missing entries
    'transit:neptune|conjuncao|pluto':
      'Neptune conjunct natal Pluto creates a confluence between dissolution and deep transformation, potentially bringing slow and pervasive changes in areas of renewal and power. The period may intensify sensitivity to what is being destroyed and recreated in the depths of life. A cycle of openness to the transcendent in the context of structural transformations, with the possibility of significant spiritual renewal.',
    'transit:neptune|conjuncao|uranus':
      'Neptune conjunct natal Uranus creates a confluence between dissolution and the impulse toward rupture, generating heightened sensitivity to what needs to be released creatively and unpredictably. The period may bring unexpected inspirations, insights combining the transcendent and the innovative, or confusion before changes that have no defined form. A cycle of openness to the new with fluidity and without need for excessive control.',
    'transit:neptune|ingress|house_2':
      'Neptune ingressing into House 2 initiates a cycle of dissolution of the boundaries between the material and the spiritual, with the possibility of financial confusion or, conversely, creative inspiration generating resources. The period invites revision of the relationship with material security and with the values sustaining life. A good window to build a more fluid relationship with money and to identify what holds genuine value beyond the tangible.',
    'transit:neptune|ingress|house_4':
      'Neptune ingressing into House 4 initiates a cycle of sensitization of domestic life, family and the inner world. The period may bring idealization of family, confusion about what constitutes home, or openness to a more spiritual and porous intimate life. A good window to dissolve rigid family patterns and to create a living environment more permeable to what is subtle and nurturing.',
    'transit:neptune|ingress|house_6':
      'Neptune ingressing into House 6 initiates a cycle of heightened sensitivity in routine, work and health habits. The period may bring confusion in daily life, difficulty maintaining schedules or, positively, a more dedicated and spiritualized orientation in work. A good window to introduce care practices that integrate the physical and the subtle, such as meditation, therapeutic art or service with genuine dedication.',
    'transit:neptune|ingress|house_7':
      'Neptune ingressing into House 7 initiates a cycle of idealization and sensitivity in intimate relationships and partnerships. The period may bring relational bonds with strong romantic charge, confusion about limits in relationships or the development of deep empathy with others. A good window to cultivate relationships with more presence and care, discerning what is genuine from what is idealized projection.',
    'transit:neptune|ingress|house_8':
      'Neptune ingressing into House 8 initiates a cycle of dissolution of the boundaries between self and other in the field of intimacy, shared resources and what is hidden. The period may bring heightened sensitivity to the intangible in deep exchanges, or confusion in heavily charged financial and emotional relationships. A good window to deepen spirituality in contact with cycles of loss, transformation and renewal.',
    'transit:neptune|ingress|house_9':
      'Neptune ingressing into House 9 initiates a cycle of expanded spirituality, openness to the transcendent and heightened sensitivity in beliefs and worldview. The period may bring devotion to spiritual practices, openness to mysticism and syncretism, or confusion between genuine faith and doctrinal escapism. A good window to explore the sacred with openness and to build a worldview that integrates the subtle and the lived.',
    'transit:neptune|ingress|house_11':
      'Neptune ingressing into House 11 initiates a cycle of idealization and sensitivity in social groups, affinity networks and collective objectives. The period may bring inspiration for humanitarian causes, confusion about where one socially belongs, or deep connections with creative and spiritual communities. A good window to distinguish groups that genuinely nurture from those that offer only the illusion of belonging.',
    'transit:neptune|oposicao|ascendente':
      'Neptune opposite natal Ascendant may create confusion in self-perception and in how one is seen by others, with a tendency to dissolve the contours of public identity. The period may reveal tension between the need for clarity about who one is and the dissolution of personal boundaries. A good window to work with limits more consciously and to distinguish what is genuine from what is projection from the environment.',
    'transit:neptune|oposicao|jupiter':
      'Neptune opposite natal Jupiter may amplify the tendency toward excess optimism, unfounded beliefs or expansion through illusory paths. The period may reveal tension between the desire for growth and the dissolution of the foundations that would sustain it. A good window to distinguish genuine faith from naivety and to verify whether expansion projects have concrete substance.',
    'transit:neptune|oposicao|mars':
      'Neptune opposite natal Mars may dissolve clarity in action, generating confusion about what one wants or difficulty acting with defined direction and force. The period may reveal tension between the desire to act and the fog surrounding motivations. A good window to investigate what truly motivates action and to act with more discernment about when to advance and when to wait.',
    'transit:neptune|oposicao|meio_do_ceu':
      'Neptune opposite natal Midheaven may create confusion about professional direction or public image, with a tendency toward dissolution of career identity contours. The period may reveal tension between the external trajectory and a more spiritual or subjective calling emerging from within. A good window to listen to what the inner world is asking and to reorient public life in a way more aligned with what is deep and genuine.',
    'transit:neptune|oposicao|mercury':
      'Neptune opposite natal Mercury may create confusion in thinking, communications and the way of processing information. The period may bring misunderstandings, difficulty concentrating or a heightened sensitivity that makes discernment more challenging. A good window to practice careful verification of information and to distinguish genuine intuition from projected fantasy.',
    'transit:neptune|oposicao|moon':
      'Neptune opposite natal Moon may bring hypersensitivity, confusion in affective patterns or dissolution of the boundaries between one\'s own inner world and that of others. The period may reveal tension between real affective needs and what is idealized or projected. A good window to identify where emotion is in contact with what is genuine and where it is being colored by fantasy or expectation.',
    'transit:neptune|oposicao|neptune':
      'Neptune opposite natal Neptune marks a moment of tension between what has been built in the field of spirituality and creativity and what has not yet found form. The period may bring revisions in beliefs, ideals and the relationship with the transcendent. A good window to assess which illusions have served their purpose and which visions still deserve to be nourished with more clarity and intention.',
    'transit:neptune|oposicao|pluto':
      'Neptune opposite natal Pluto creates tension between dissolution and transformative power, potentially generating confusion about processes requiring clarity and definitive decision. The period may reveal how the spiritual or creative field is being infiltrated by unrecognized power dynamics. A good window to distinguish genuine surrender from escape and to work with what transforms without losing contact with reality.',
    'transit:neptune|oposicao|saturn':
      'Neptune opposite natal Saturn creates tension between dissolution and structure, with possible friction between the desire to transcend limits and the need for order and responsibility. The period may reveal where illusions are eroding what should be sustained with rigor. A good window to verify whether what is called spirituality is truly a path of growth or a refined way of avoiding what needs to be built.',
    'transit:neptune|oposicao|sun':
      'Neptune opposite natal Sun may create confusion in identity, with a tendency to dissolve the contours of who one is in the face of the expectations and projections of the environment. The period may reveal tension between one\'s own will and what the environment projects or expects. A good window to practice greater clarity about who one truly is, distinguishing the authentic core from impressions arriving from outside.',
    'transit:neptune|oposicao|uranus':
      'Neptune opposite natal Uranus creates tension between the impulse to awaken and renew and the tendency toward dissolution and confusion. The period may reveal where the desire for freedom is being sabotaged by illusion or where transcendence is being used as an escape from reality. A good window to integrate creativity and renewal with more clarity about what is genuinely new and what is merely fanciful.',
    'transit:neptune|oposicao|venus':
      'Neptune opposite natal Venus may idealize relationships, creating expectations that exceed what real relationships can offer. The period may reveal tension between the idealized romantic love and concrete bonds with their imperfections and limits. A good window to appreciate what relationships genuinely offer and to cultivate affection with more presence and less projection.',
    'transit:neptune|quadratura|ascendente':
      'Neptune square natal Ascendant may create confusion about public identity and the way one is perceived by the environment. The period may bring difficulty establishing clear boundaries between one\'s own inner world and what the environment projects. A good window to work on clarity in self-presentation and to identify where identity is being diluted by external expectations.',
    'transit:neptune|quadratura|jupiter':
      'Neptune square natal Jupiter may amplify optimism to the point of losing contact with what is feasible, with a tendency to expand through foggy paths or to believe in projects without real grounding. The period may create friction between the desire for growth and the lack of clarity about the means. A good window to verify whether planned expansions have concrete substance and to calibrate faith with practical discernment.',
    'transit:neptune|quadratura|mars':
      'Neptune square natal Mars may create friction between the will to act and confusion about what one truly wants or should do. The period may bring wear from action in vague directions, difficulty maintaining assertive focus or energy that disperses before reaching its goal. A good window to strengthen clarity of intention before acting and to distinguish genuine impulse from reactivity seeking escape.',
    'transit:neptune|quadratura|meio_do_ceu':
      'Neptune square natal Midheaven may create confusion in professional direction, with idealization of the public role or difficulty discerning the path most aligned with real capacities. The period may bring friction between what one desires to be in public life and what the world effectively demands. A good window to align ambitions with what is concrete and achievable, without losing the dream that anchors the direction.',
    'transit:neptune|quadratura|mercury':
      'Neptune square natal Mercury may create confusion in thinking, misunderstandings in communication and difficulty maintaining logical reasoning consistently. The period may bring misinformation, magical thinking or difficulty discerning the real from projection. A good window to check information rigorously and to distinguish creative intuition from baseless daydreaming.',
    'transit:neptune|quadratura|neptune':
      'Neptune square natal Neptune creates friction between the spiritual or creative ideal cultivated and what has not yet found authentic expression. The period may reveal where beliefs and ideals need revision and where illusion has been confused with genuine vision. A good window to honestly confront what is real aspiration and what is merely comfortable fantasy.',
    'transit:neptune|quadratura|pluto':
      'Neptune square natal Pluto creates friction between dissolution and transformative power, potentially generating confusion in transformation processes requiring clarity about what must be released. The period may reveal where spirituality or creativity is being used to avoid confronting what needs to change more definitively. A good window to work through transformation without fleeing from what it concretely implies.',
    'transit:neptune|quadratura|sun':
      'Neptune square natal Sun may create friction between the expression of identity and the tendency to dissolve the contours of who one is. The period may bring confusion about one\'s own objectives, difficulty maintaining direction or a sense that the path dissolves before being traveled. A good window to strengthen contact with what is genuinely one\'s own and to act from that foundation with more clarity and consistency.',
    'transit:neptune|quadratura|uranus':
      'Neptune square natal Uranus creates friction between dissolution and rupture, potentially generating confusion in areas where the unexpected and the intangible combine. The period may reveal where the need for freedom is being lived chaotically or where creativity is losing its guiding thread. A good window to channel the impulse for renewal with more intentionality and without dispersion.',
    'transit:neptune|sextil|ascendente':
      'Neptune sextile natal Ascendant favors heightened sensitivity in the way one presents to the world, with the ability to adapt expression to different contexts with empathy and fluidity. The cycle facilitates openness, receptivity and presence that genuinely touches others. A good moment to explore more creative and intuitive ways of positioning in the world without losing the substance of who one is.',
    'transit:neptune|sextil|jupiter':
      'Neptune sextile natal Jupiter favors expansion through spiritual, creative or intuition-inspired paths guided by faith in something greater. The cycle facilitates growth in areas that combine openness and imagination with generosity and a sense of purpose. A good moment to invest in esoteric studies, creative projects of great vision or activities combining personal development and collective contribution.',
    'transit:neptune|sextil|mars':
      'Neptune sextile natal Mars favors inspired action, with the ability to act from a more subtle motivation aligned with what is felt as true and urgent. The cycle facilitates creative, artistic or spiritual projects requiring energy directed with intention. A good moment to act from deep values and to find strength in something beyond immediate self-interest.',
    'transit:neptune|sextil|meio_do_ceu':
      'Neptune sextile natal Midheaven favors creative, spiritual or humanitarian vocations in professional life, with openness to paths combining sensitivity and contribution. The cycle facilitates public recognition coming from activities that genuinely touch people. A good moment to explore professional directions that integrate the subtle, the artistic or care for others as a central part of the work.',
    'transit:neptune|sextil|mercury':
      'Neptune sextile natal Mercury favors creative imagination, poetic communication and the ability to intuit what lies beyond the literal and the logical. The cycle facilitates creative writing, symbolic thinking and expression that connects the conscious with the more subtle. A good moment to work with language more expressively, to write, create or communicate from intuition and sensitivity.',
    'transit:neptune|sextil|moon':
      'Neptune sextile natal Moon favors expanded emotional sensitivity, affective intuition and receptivity to the subtle in relationships and the inner world. The cycle facilitates genuine empathy, creativity nourished by emotions and a more fluid relationship with one\'s own affective world. A good moment to cultivate practices that connect the emotional and the spiritual, such as meditation, expressive art or dream work.',
    'transit:neptune|sextil|neptune':
      'Neptune sextile natal Neptune favors a moment of openness to the transcendent with fluidity and without the tensions of more friction-bearing aspects. The cycle facilitates spirituality, creativity and connection with the intangible in a nurturing and productive way. A good moment to deepen spiritual practices, expand artistic sensitivity and work with what inspires without losing contact with the concrete.',
    'transit:neptune|sextil|pluto':
      'Neptune sextile natal Pluto favors transformation that deepens through the spiritual, with the ability to access what is hidden in a creative and revealing way. The cycle facilitates renewal arising from deeper layers of being, with openness to the transcendent in the process of change. A good moment to work with the unconscious, art or spirituality as genuine paths of transformation.',
    'transit:neptune|sextil|saturn':
      'Neptune sextile natal Saturn favors the creative combination of sensitivity and structure, with the ability to give form to what is inspired without losing the discipline needed to concretize it. The cycle facilitates projects combining vision and achievement, with openness to the subtle within sustaining forms. A good moment to work with art, spirituality or care with the consistency that makes the vision achievable.',
    'transit:neptune|sextil|sun':
      'Neptune sextile natal Sun favors more sensitive, creative personal expression connected with something greater than the immediate ego. The cycle facilitates a sense of purpose involving contribution, beauty or transcendence, with openness to more fluid ways of being who one is. A good moment to explore how identity can express itself through artistic, spiritual or service-oriented paths.',
    'transit:neptune|sextil|uranus':
      'Neptune sextile natal Uranus favors the creative combination of intuition and innovation, with insights arriving unexpectedly but productively and easily leveraged. The cycle facilitates openness to the new with more receptivity and less rupture. A good moment to work on original projects with sensitivity and to let inspiration guide creativity without need for excessive control.',
    'transit:neptune|sextil|venus':
      'Neptune sextile natal Venus favors heightened aesthetic sensitivity, affection idealized productively and openness to the beautiful and nurturing in relationships and creativity. The cycle facilitates love expressed with gentleness, art born from emotion and affective connections permeated by complicity. A good moment to cultivate what is beautiful, affective and inspired with genuine openness and presence.',
    'transit:neptune|trigono|ascendente':
      'Neptune trine natal Ascendant favors heightened sensitivity in the way one presents to the world, with fluidity, empathy and a presence that genuinely touches others. The cycle facilitates more creative and intuitive expression of identity, with openness to showing vulnerability without losing substance. A good moment to let sensitivity be a visible part of who one is, with openness and confidence.',
    'transit:neptune|trigono|jupiter':
      'Neptune trine natal Jupiter favors spiritual, creative and humanitarian expansion with fluidity and a sense of purpose. The cycle facilitates growth through paths combining faith, imagination and openness to what is greater than the self. A good moment to invest in high-vision projects, spiritual practices and activities connecting personal development with collective contribution.',
    'transit:neptune|trigono|mars':
      'Neptune trine natal Mars favors inspired action, with the ability to act from deep motivations aligned with spiritual or creative values. The cycle facilitates artistic, humanitarian or spiritual projects requiring directed energy and clear intention. A good moment to act from what is felt as true and to find strength in something beyond immediate self-interest.',
    'transit:neptune|trigono|meio_do_ceu':
      'Neptune trine natal Midheaven favors the expression of creative, spiritual or humanitarian vocations in the professional trajectory with fluency and recognition. The cycle facilitates career directions integrating sensitivity, art and care for others in a productive and well-received way. A good moment to advance in paths combining the subtle and the professional with naturalness and genuine satisfaction.',
    'transit:neptune|trigono|mercury':
      'Neptune trine natal Mercury favors creative imagination, poetic communication and intuition that connects the conscious with the more subtle and symbolic. The cycle facilitates creative writing, imaginative thinking and expression that goes beyond the literal with fluidity. A good moment to work with language more expressively and to communicate from intuition with openness and naturalness.',
    'transit:neptune|trigono|moon':
      'Neptune trine natal Moon favors deep emotional sensitivity, affective intuition and receptivity that welcomes the subtle in the inner world and in relationships. The cycle facilitates genuine empathy, creativity nourished by emotions and connection with what is beautiful and transcendent in the affective field. A good moment to cultivate practices integrating the emotional and the spiritual with fluidity and openness.',
    'transit:neptune|trigono|neptune':
      'Neptune trine natal Neptune favors a moment of openness to the transcendent with natural fluidity and without resistance. The cycle facilitates spirituality, creativity and connection with the intangible in a productive and well-integrated way. A good moment to deepen spiritual practices, expand artistic sensitivity and let what inspires express itself with more freedom and naturalness.',
    'transit:neptune|trigono|pluto':
      'Neptune trine natal Pluto favors deep transformation mediated by spiritual sensitivity and openness to the transcendent. The cycle facilitates access to what was hidden in a more fluid way and without the friction of tense aspects. A good moment to work with the unconscious, art or spirituality as genuine paths of transformation with a sense of purpose.',
    'transit:neptune|trigono|saturn':
      'Neptune trine natal Saturn favors the fluid combination of sensitivity and structure, with the ability to give form to what is inspired in a consistent and enduring way. The cycle facilitates projects combining vision and achievement, with openness to the transcendent within sustaining forms. A good moment to work with art, spirituality or care with the consistency that makes the vision achievable.',
    'transit:neptune|trigono|sun':
      'Neptune trine natal Sun favors more sensitive, creative personal expression connected with something greater than the immediate ego, with fluidity and naturalness. The cycle facilitates a sense of purpose involving contribution, beauty or transcendence, in a well-integrated and nurturing way. A good moment to explore how identity can express itself through artistic, spiritual or service-oriented paths with openness and confidence.',
    'transit:neptune|trigono|uranus':
      'Neptune trine natal Uranus favors the creative combination of intuition and innovation, with insights arriving unexpectedly but fluidly and well integrated. The cycle facilitates openness to the new with receptivity and without excessive rupture. A good moment to work on original projects with sensitivity and to let inspiration guide creativity naturally and with genuine output.',
    'transit:neptune|trigono|venus':
      'Neptune trine natal Venus favors heightened aesthetic sensitivity, affection expressed with beauty and openness to the nurturing in relationships and creativity. The cycle facilitates love that includes spiritual dimensions, art born from emotion and affective connections permeated by complicity and inspiration. A good moment to cultivate what is beautiful, affective and inspired with genuine presence and fluidity.',

    // Pluto — missing entries
    'transit:pluto|conjuncao|ascendente':
      'Pluto conjunct natal Ascendant begins a transformation in how you present yourself and how you are perceived, making it progressively harder to maintain an identity that does not match what is emerging internally. This phase may bring more intense presence, but also confrontation with what was constructed as social mask over time. What in your way of presenting yourself to the world is no longer you and needs to be dismantled to make space for who you are becoming?',
    'transit:pluto|conjuncao|jupiter':
      'Pluto conjunct natal Jupiter amplifies growth and expansion impulses with a depth that can serve long-term projects as much as power-seeking without real foundation. This phase tends to reveal where ambition is genuine and where it is merely the need to occupy space or control outcomes. What do you want to expand that has genuine foundation, and what are you seeking out of a need for security disguised as growth?',
    'transit:pluto|conjuncao|mercury':
      'Pluto conjunct natal Mercury deepens the way of thinking, investigating, and communicating, with less tolerance for superficial answers or partial truths. This phase tends to intensify investigative reasoning and make it harder to accept explanations that do not reach the root of the matter. What narrative about yourself or your situation have you maintained without questioning it with the depth it requires?',
    'transit:pluto|conjuncao|moon':
      'Pluto conjunct natal Moon transforms the emotional world from the inside out, bringing inherited affective patterns to the surface that were asking to be revised or ended. This phase may intensify needs for security while at the same time showing that the habitual ways of obtaining it no longer work. What in your emotional life have you been avoiding revisiting that is now asking for attention?',
    'transit:pluto|conjuncao|neptune':
      'Pluto conjunct natal Neptune transforms spiritual life, creativity and the relationship with the transcendent in a way that profoundly destabilizes previous illusions. The period may bring confrontation with what was fantasy or escapism, opening space for a more authentic and less idealized spirituality. A moment of transformation in the field of the sacred and the imaginative, with dissolution of what was not genuine.',
    'transit:pluto|conjuncao|uranus':
      'Pluto conjunct natal Uranus combines deep transformation and the impulse toward rupture in a cycle of radical and potentially irreversible changes. The period may bring abrupt breaks in old structures that could no longer contain what needed to express itself. A moment of transformation that occurs through ruptures, with potential for liberation of patterns that were blocking necessary renewal.',
    'transit:pluto|conjuncao|venus':
      'Pluto conjunct natal Venus transforms affective life and personal values, making it harder to sustain relationships or agreements that do not correspond to what is genuinely desired. This phase may bring bonds of great intensity or revelations about what truly matters — with less tolerance for what is habitual but not satisfying. What do you continue valuing out of fear of losing something that has already lost its real meaning for you?',
    'transit:pluto|ingress|house_1':
      'Pluto ingressing into House 1 initiates a cycle of radical transformation of identity, self-image and the way of positioning in the world. The period may bring a more intense and magnetic presence, confrontation with one\'s own shadows and the need to rebuild who one is from something deeper and more authentic. A good window to begin genuine self-discovery work, eliminating what was mask and cultivating what is substance.',
    'transit:pluto|ingress|house_2':
      'Pluto ingressing into House 2 initiates a cycle of deep transformation in financial life, values and the relationship with material security. The period may bring crises or radical reorganizations in resources, revealing what truly sustains life and what was sustained by fear or attachment. A good window to rebuild the relationship with money and abundance from more authentic and transformed values.',
    'transit:pluto|ingress|house_3':
      'Pluto ingressing into House 3 initiates a cycle of deep transformation in the way of thinking, communicating and perceiving the immediate environment. The period may bring intensity in relationships with siblings and neighbors, radical changes in studies or communication, and the need to go to the core of issues rather than remaining on the surface. A good window to transform the way of processing and expressing what is thought.',
    'transit:pluto|ingress|house_5':
      'Pluto ingressing into House 5 initiates a cycle of transformation in creative expression, romantic relationships and the relationship with pleasure and authenticity. The period may bring intensity in affective and creative experiences, revelations about what truly nourishes play and joy, or confrontation with dependency patterns in the affective field. A good window to renew the relationship with creativity and what is loved in a deeper and more genuine way.',
    'transit:pluto|ingress|house_6':
      'Pluto ingressing into House 6 initiates a cycle of deep transformation in routine, work and health habits. The period may bring crises or radical reorganizations in daily life, confrontation with power dynamics in the work environment or the need to transform habits that undermine wellbeing. A good window to renew the way of serving, organizing practical life and caring for health with more intentionality.',
    'transit:pluto|ingress|house_7':
      'Pluto ingressing into House 7 initiates a cycle of deep transformation in intimate partnerships and long-term bonds. The period may bring revelations about what is hidden in relationships, power and control dynamics, or the need to rebuild the foundations of the most important relationships. A good window to transform the way of relating, eliminating what was illusion and deepening what is genuine.',
    'transit:pluto|ingress|house_8':
      'Pluto ingressing into House 8 initiates a cycle of intensification of themes of transformation, intimacy, death, inheritance and shared resources. The period may bring confrontation with what is deepest and most shadowy in the psyche, revelations in areas of intimacy and power, or radical transformations in what is shared with others. A good window to deepen psychological work and to renew the way of dealing with what requires total surrender.',
    'transit:pluto|ingress|house_9':
      'Pluto ingressing into House 9 initiates a cycle of deep transformation in beliefs, worldview and the philosophical or religious systems sustaining life. The period may bring crises of faith, confrontation with dogmas or radical renewal of the worldview. A good window to go to the core of questions of meaning and to build a more authentic philosophy of life, eliminating inherited beliefs never examined.',
    'transit:pluto|ingress|house_11':
      'Pluto ingressing into House 11 initiates a cycle of transformation in social groups, affinity networks and collective objectives. The period may bring revelations about power dynamics in groups of belonging, the need to eliminate bonds that are not genuine or radical transformation of the ideals guiding the future. A good window to renew alliances and to commit to causes of real substance and depth.',
    'transit:pluto|ingress|house_12':
      'Pluto ingressing into House 12 initiates a cycle of confrontation with what is hidden, repressed or living in the shadows of the psyche. The period may bring irruptions from the unconscious, confrontation with patterns operating below consciousness or the need to transform what has been avoided through fear. A good window to work the shadows with courage, eliminate what blocks inner life and renew the foundations of the subjective world.',
    'transit:pluto|oposicao|ascendente':
      'Pluto opposite natal Ascendant may bring intense encounters that force confrontation with one\'s own shadows reflected in others, with power dynamics in relationships and with what was hidden in self-image. The period may reveal tension between the need for control and genuine openness to being transformed by contact with others. A good window to work bonds with more awareness of what is projected and what is hidden.',
    'transit:pluto|oposicao|meio_do_ceu':
      'Pluto opposite natal Midheaven may bring transformations in life\'s foundations — in family, home and the deep psyche — that shake the public and professional trajectory. The period may reveal tension between the need to control the external direction and what emerges from the deepest roots. A good window to revisit what sustains the path and to transform foundations into something more conscious and solid.',
    'transit:pluto|oposicao|mercury':
      'Pluto opposite natal Mercury may bring intense confrontations in the field of ideas, communications and the way of processing reality, with a tendency toward revelations that shake certainties. The period may reveal tension between the will to control the narrative and the need to open to uncomfortable truths. A good window to investigate more deeply and to use words with more integrity and responsibility.',
    'transit:pluto|oposicao|moon':
      'Pluto opposite natal Moon may bring intense confrontations in the emotional world, revelations about hidden affective patterns or tension between the need for security and the impulse toward deep transformation. The period may reveal where control is being exercised in the affective field and where genuine surrender is being blocked. A good window to face what was repressed emotionally and to renew affective life with more authenticity.',
    'transit:pluto|oposicao|neptune':
      'Pluto opposite natal Neptune creates tension between transformative power and dissolution, with possible crises in the spiritual or creative field requiring confrontation with what was illusion. The period may reveal where spirituality or creativity is being used to avoid real transformation. A good window to deepen inner life with more honesty and to distinguish genuine vision from projection without substance.',
    'transit:pluto|oposicao|pluto':
      'Pluto opposite natal Pluto marks a moment of confrontation between the power that has been built and what still needs to be transformed in the depths of the psyche. The period may bring tension between what one wants to maintain and what life demands be eliminated or renewed. A good window to work with one\'s own shadows with maturity and to recognize where power is being exercised or denied unconsciously.',
    'transit:pluto|oposicao|saturn':
      'Pluto opposite natal Saturn creates tension between transformative power and the structures, limits and responsibilities of Saturn. The period may bring confrontations with authorities, crises in structures that seemed solid or the need to rebuild foundations from something deeper. A good window to transform what was rigid without destroying what still holds value and to rebuild with more integrity.',
    'transit:pluto|oposicao|uranus':
      'Pluto opposite natal Uranus creates tension between deep transformation and sudden rupture, with possible crises requiring both discernment and radical openness. The period may reveal conflict between what needs to change slowly and deeply and what wants to break abruptly. A good window to integrate the impulses of renewal and transformation without polarizing into extremes.',
    'transit:pluto|quadratura|ascendente':
      'Pluto square natal Ascendant may create intense friction between the need for transformation of identity and internal or external resistance to that change. The period may bring power conflicts in the immediate environment, confrontation with one\'s own shadow in how one presents, or tension between what one wants to show and what needs to be revealed. A good window to work authenticity with courage and without manipulation.',
    'transit:pluto|quadratura|meio_do_ceu':
      'Pluto square natal Midheaven may bring crises or confrontations in the professional trajectory, with revelations about power dynamics, control or ambition that need to be examined. The period may create tension between what one wants to achieve in public life and what internal or family foundations do or do not support. A good window to transform the relationship with ambition and to build the professional path from greater integrity.',
    'transit:pluto|quadratura|neptune':
      'Pluto square natal Neptune creates friction between transformative power and dissolution, with possible crises in the spiritual or creative field requiring confrontation with illusions. The period may reveal where fantasy or escapism is preventing real transformation. A good window to deepen spiritual and creative life with more honesty and to eliminate what was merely projection without substance.',
    'transit:pluto|quadratura|pluto':
      'Pluto square natal Pluto marks a moment of intense friction between the power that has been built and what still needs to be transformed, with crises revealing where control is being exercised unconsciously. The period may bring confrontations with one\'s own shadow and with power and manipulation dynamics operating below consciousness. A good window to honestly examine what needs to be eliminated and to rebuild with more integrity and depth.',
    'transit:pluto|quadratura|saturn':
      'Pluto square natal Saturn creates friction between the impulse toward radical transformation and the need to maintain structure and responsibility. The period may bring confrontations with authorities, crises in structures that seemed solid or tension between what needs to change and what needs to be carefully preserved. A good window to work transformation without destroying what still sustains and to rebuild with more integrity.',
    'transit:pluto|quadratura|sun':
      'Pluto square natal Sun may create intense friction between the expression of identity and the impulse toward radical transformation, with confrontations that challenge the sense of who one is. The period may bring power conflicts, confrontation with one\'s own shadow or tension between the will for control and the need to surrender to the transformative process. A good window to examine what in identity needs renewal and to act with more integrity and depth.',
    'transit:pluto|quadratura|uranus':
      'Pluto square natal Uranus creates friction between deep transformation and abrupt rupture, with possible crises combining the unexpected and the profound in a destabilizing way. The period may reveal tension between what needs to change slowly and what explodes into ruptures without preparation. A good window to work changes with more intentionality and to integrate the unexpected without losing the guiding thread of necessary transformation.',
    'transit:pluto|quadratura|venus':
      'Pluto square natal Venus may bring crises in relationships, revelations about power, control or dependency dynamics in the affective field or confrontation with what is truly desired versus what presents itself as desirable. The period may create friction between what is familiar in the affective field and what needs to be transformed for relationships to be more authentic. A good window to renew affective life and values with more depth and honesty.',
    'transit:pluto|sextil|ascendente':
      'Pluto sextile natal Ascendant favors renewal of identity with access to a deeper and more magnetic force that integrates constructively. The cycle facilitates transformations in self-image and the way of presenting that arrive with more fluidity and less friction than in tense aspects. A good moment to work what needs to be renewed in identity with courage and clear intention.',
    'transit:pluto|sextil|jupiter':
      'Pluto sextile natal Jupiter favors growth through paths that integrate depth, power and integrity, with the ability to expand without losing contact with what is substantial. The cycle facilitates opportunities that arrive through working with what is deep and transformative. A good moment to invest in high-impact projects born from genuine values and real courage.',
    'transit:pluto|sextil|meio_do_ceu':
      'Pluto sextile natal Midheaven favors constructive transformations in the professional trajectory, with access to a deeper and more magnetic influence in public life. The cycle facilitates changes in the path that arrive with less friction and more intentionality. A good moment to advance in directions requiring courage and depth, leveraging the transformative potential to consolidate a more powerful and authentic trajectory.',
    'transit:pluto|sextil|mercury':
      'Pluto sextile natal Mercury favors investigative thinking, communication with depth and the ability to go to the core of issues with clarity and force. The cycle facilitates research, writing that reveals what is hidden and the use of words with genuine influence. A good moment to work with information in depth, investigate hidden truths and communicate what needs to be said with courage and precision.',
    'transit:pluto|sextil|moon':
      'Pluto sextile natal Moon favors access to the deep emotional world with more ease and less resistance than in tense aspects. The cycle facilitates processes of affective transformation conducted with intention and care. A good moment to work inherited emotional patterns with courage, opening space for a more integrated and profound affective life.',
    'transit:pluto|sextil|neptune':
      'Pluto sextile natal Neptune favors transformation that deepens through the spiritual and creative, with access to deeper layers of inner life in a productive way. The cycle facilitates work with the unconscious, the sacred and the imaginative constructively. A good moment to deepen spiritual and creative practices that touch what is deepest and most transformative.',
    'transit:pluto|sextil|pluto':
      'Pluto sextile natal Pluto favors moments of access to one\'s own transformative potential with more fluidity and less resistance. The cycle facilitates processes of deep renewal that arrive with more ability to leverage. A good moment to work what needs to be transformed in the psyche with clear intention and constructive courage.',
    'transit:pluto|sextil|saturn':
      'Pluto sextile natal Saturn favors the constructive integration of transformative power and structure, with the ability to renew the established without destroying what still sustains. The cycle facilitates deep reforms, elimination of what is obsolete and consolidation of what is essential. A good moment to transform with rigor and responsibility, building on renewed foundations with more integrity.',
    'transit:pluto|sextil|uranus':
      'Pluto sextile natal Uranus favors the constructive combination of deep transformation and innovation, with the ability to renew structures profoundly and creatively. The cycle facilitates changes that arrive with less friction and more intentionality. A good moment to innovate in areas calling for real transformation, leveraging the renewal potential constructively and without unnecessary destruction.',
    'transit:pluto|sextil|venus':
      'Pluto sextile natal Venus favors constructive transformations in affective life and values, with access to a depth that enriches relationships. The cycle facilitates the deepening of genuine bonds and the elimination of what was superficial without the trauma of tense aspects. A good moment to renew the affective field and values with more depth and intentionality.',
    'transit:pluto|trigono|ascendente':
      'Pluto trine natal Ascendant favors deep renewal of identity that arrives with more fluidity and natural integration. The cycle facilitates transformations in self-image and the way of presenting that are well received and produce more authentic and magnetic presence. A good moment to work what needs to be renewed in who one is in a deep and constructive way, with courage and openness.',
    'transit:pluto|trigono|meio_do_ceu':
      'Pluto trine natal Midheaven favors deep transformations in the professional trajectory that arrive with fluidity and potential for real impact. The cycle facilitates changes in the public path that are well integrated and constructive, with access to a more magnetic influence. A good moment to renew the professional direction with depth and to consolidate a trajectory of greater substance and authenticity.',
    'transit:pluto|trigono|mercury':
      'Pluto trine natal Mercury favors deep investigative thinking, communication that goes to the core of issues and the ability to reveal what is hidden constructively. The cycle facilitates research, writing with impact and the use of words with genuine influence, without the friction of tense aspects. A good moment to work with information in depth and to communicate truths with courage and precision.',
    'transit:pluto|trigono|moon':
      'Pluto trine natal Moon favors deep emotional transformation that arrives with more fluidity and less resistance, with access to what was hidden in the affective field. The cycle facilitates renewal of inherited emotional patterns and deepening of inner life constructively. A good moment to work the emotional world with courage and intention, opening space for a more integrated and authentic affective life.',
    'transit:pluto|trigono|neptune':
      'Pluto trine natal Neptune favors deep transformation mediated by the spiritual and creative, with fluid access to what is hidden in the deepest layers of inner life. The cycle facilitates work with the unconscious, the sacred and the imaginative constructively and well integrated. A good moment to deepen spiritual and creative practices that produce genuine renewal with a sense of purpose.',
    'transit:pluto|trigono|pluto':
      'Pluto trine natal Pluto favors moments of access to one\'s own transformative potential with natural fluidity and constructive openness. The cycle facilitates processes of deep renewal that arrive with more ease of integration. A good moment to work what needs to be transformed in the psyche with clear intention, courage and genuine output, leveraging the potential with awareness.',
    'transit:pluto|trigono|saturn':
      'Pluto trine natal Saturn favors the fluid integration of transformative power and structure, with the ability to renew the established and build on deeper foundations. The cycle facilitates deep reforms that arrive with less resistance, elimination of what is obsolete and consolidation of what is essential. A good moment to build with depth and rigor what should endure, on foundations renewed with integrity.',
    'transit:pluto|trigono|uranus':
      'Pluto trine natal Uranus favors the fluid combination of deep transformation and innovation, with the ability to renew structures radically but in a well-integrated way. The cycle facilitates changes that arrive with more fluidity and constructive output. A good moment to innovate in areas calling for real renewal, leveraging the potential of creative transformation with openness and intentionality.',
    'transit:pluto|trigono|venus':
      'Pluto trine natal Venus favors constructive transformations in affective life and values that arrive with fluidity and genuine depth. The cycle facilitates the deepening of authentic bonds and the natural elimination of what was superficial. A good moment to renew the affective field and values with more depth and satisfaction, cultivating what is genuine with openness and real presence.',

    // Moon — conjunction
    'transit:moon|conjuncao|mercury':
      'Moon conjunct natal Mercury brings emotion and reasoning closer together, supporting more honest expression of what is felt. This brief transit tends to amplify intuition in communication and receptiveness to environmental cues. A good moment for meaningful conversations, personal journaling, and decisions that call for both logic and inner perception.',
    'transit:moon|conjuncao|venus':
      'Moon conjunct natal Venus intensifies the need for affection, harmony, and pleasant exchanges. This brief transit tends to heighten aesthetic sensitivity and the desire to nurture and be nurtured. An opportune moment for emotional bonds, creative activity, and anything that feeds pleasure and inner well-being.',
    'transit:moon|conjuncao|jupiter':
      'Moon conjunct natal Jupiter amplifies the need for meaning and belonging, making it easy to confuse genuine enthusiasm with emotional exaggeration. Your expectations may grow faster than reality can confirm — and that gap can generate proportional disappointment. Use the impulse to move forward on something already planned, while keeping a concrete measure of what is actually possible now.',
    'transit:moon|conjuncao|saturn':
      'Moon conjunct natal Saturn may bring temporary emotional weight, a sense of limitation, or a greater need for structure. This brief transit tends to surface pending responsibilities and the impact of past choices. A more serious moment that invites practical adjustments and honest recognition of what needs to be organized.',
    'transit:moon|conjuncao|neptune':
      'Moon conjunct natal Neptune intensifies sensitivity, intuition, and openness to subtle perceptions. This brief transit may bring vivid dreams, amplified empathy, and a need for creative withdrawal. A good moment for art, meditation, and inner work, while staying alert to idealization and scattered energy.',
    'transit:moon|conjuncao|pluto':
      'Moon conjunct natal Pluto may bring emotions with a compulsive quality — an intense desire for truth, depth, or definitive resolution of something that has been nagging. The risk is reacting externally to what is essentially an internal transformation: the intensity calls for processing, not immediate action. Allow yourself to feel the weight without needing to resolve everything now — clarity tends to come after the intensity subsides.',
    'transit:moon|conjuncao|ascendente':
      'Moon conjunct natal Ascendant intensifies emotional expression and its impact on the surrounding environment. This brief transit tends to amplify interpersonal sensitivity and the need for recognition. A moment of greater emotional visibility: what is felt tends to be perceived by others with more clarity.',
    'transit:moon|conjuncao|meio_do_ceu':
      'Moon conjunct natal Midheaven brings emotional and public life closer together, potentially surfacing personal themes in professional settings. This brief transit tends to heighten sensitivity around career, reputation, and how you are perceived. A good moment to consciously align emotional needs with professional direction.',

    // Moon — opposition
    'transit:moon|oposicao|sun':
      'Moon opposing natal Sun creates tension between emotional need and conscious will, calling for balance between feeling and action. This brief transit tends to highlight conflicts between what is desired internally and what is projected outward. A moment of review: what the ego wants may not be what the emotional field truly needs.',
    'transit:moon|oposicao|venus':
      'Moon opposing natal Venus may create tension between what you need affectively and what you can actually ask for or receive. There is a risk of giving more than you feel, or of waiting for the other person to guess what was never said. A moment to name your real need in close relationships — without projecting neediness or pretending everything is fine when it is not.',
    'transit:moon|oposicao|saturn':
      'Moon opposing natal Saturn tends to create a conflict between the need for warmth and the demand for functionality — what you feel may seem like an obstacle in the face of what you need to accomplish. There is a risk of suppressing legitimate emotions to appear more competent or responsible than you actually feel. A moment to recognize that caring for yourself is not an escape from responsibilities — it is what sustains the capacity to fulfill them.',
    'transit:moon|oposicao|uranus':
      'Moon opposing natal Uranus may bring sudden emotional instability or an urgent need for change and freedom. This brief transit tends to create unpredictability in reactions and difficulty maintaining emotional routines. A good moment to observe what is calling for renewal, without making abrupt decisions on impulse.',
    'transit:moon|oposicao|neptune':
      'Moon opposing natal Neptune may create confusion between what you actually feel and what you wish you felt — or what you think you should feel. The risk is projecting hope onto situations or people who have not yet shown enough clarity to sustain it. Use the period to ask yourself: what is real here, and what is my need for things to be different from what they are?',
    'transit:moon|oposicao|pluto':
      'Moon opposing natal Pluto may awaken a controlling impulse or a need to dominate situations when emotion becomes too intense to bear. The pairing tends to reveal power dynamics in close relationships — who holds more influence, who yields, who carries resentment. Ask yourself: are you reacting to what is happening now, or to an old pattern that this situation has stirred up?',
    'transit:moon|oposicao|ascendente':
      'Moon opposing natal Ascendant creates tension between your own emotional needs and the demands of the environment or relationships. This brief transit tends to highlight the imbalance between what you need and what others expect. A moment to review limits: giving to others cannot come at the cost of your own inner sustenance.',
    'transit:moon|oposicao|meio_do_ceu':
      'Moon opposing natal Midheaven may create tension between emotional or domestic life and the demands of public and professional life. This brief transit tends to surface where personal foundation and external reputation pull in opposite directions. A moment to align what is cared for internally with what is projected to the world.',

    // Moon — square
    'transit:moon|quadratura|sun':
      'Moon square natal Sun creates friction between emotional need and the expression of personal will. This brief transit tends to highlight where feeling and the impulse to act are in conflict. A moment to slow down before acting: adjusting the inner course may be more effective than forcing an external decision.',
    'transit:moon|quadratura|mercury':
      'Moon square natal Mercury may create a conflict between what you want to express and what your logic allows out — the heart wants to say what the mind is still trying to organize. The risk is concluding that people do not understand you when, in fact, you yourself are still processing what you feel. Before communicating something important, allow yourself to feel first — clarity comes after processing, not before.',
    'transit:moon|quadratura|venus':
      'Moon square natal Venus may create friction between emotional need and the value or harmony sought in relationships. This brief transit tends to surface dissatisfactions in exchanges or unmet expectations. A moment to review what you truly want in bonds, without projecting frustration onto those nearby.',
    'transit:moon|quadratura|saturn':
      'Moon square natal Saturn may bring emotional heaviness, a sense of blockage, or conflict between feeling and fulfilling obligations. This brief transit tends to highlight where rigidity or excessive self-criticism interferes with well-being. A moment to honor what is legitimate to feel without yielding to disproportionate self-demand.',
    'transit:moon|quadratura|uranus':
      'Moon square natal Uranus may bring emotional impatience and an urgent desire to break from what feels stagnant — even when the direction of change is not yet clear. You may sense that something needs to shift without knowing exactly what, and that tends to generate irritation with what is nearby. Observe what triggers the most internal agitation: those points usually indicate where genuine renewal is needed, not where impulsive action helps.',
    'transit:moon|quadratura|neptune':
      'Moon square natal Neptune may make it hard to separate what you feel from what you imagine, fear, or wish were true — internal boundaries become porous. There is a tendency to escape into distraction, fantasy, or idealization as a response to a difficult reality that is not yet ready to be faced. Create small physical anchors in daily life — walks, simple routines — before any decision that involves heightened emotion.',
    'transit:moon|quadratura|pluto':
      'Moon square natal Pluto may bring an impulse to control situations or people as an unconscious way of not losing control over what is felt. Emotional intensity may generate disproportionate reactions to small provocations — what irritates now is rarely only what it appears to be. Ask yourself: am I reacting to the present, or to an old fear that this situation has simply awakened?',
    'transit:moon|quadratura|ascendente':
      'Moon square natal Ascendant creates friction between inner emotional needs and the way you present yourself to the world. This brief transit tends to highlight misalignment between what is felt and what is projected. A moment to review the social mask: authenticity tends to be more effective than image adjustment.',
    'transit:moon|quadratura|meio_do_ceu':
      'Moon square natal Midheaven may create tension between emotional life and the demands of professional or public life. This brief transit tends to make it harder to separate what is felt from what is expected in a work context. A moment to set clear limits between personal space and professional delivery.',

    // Moon — trine
    'transit:moon|trigono|sun':
      'Moon trine natal Sun supports integration between emotional life and conscious expression, creating fluidity between feeling and acting. This brief transit sustains authenticity and greater inner coherence. A good moment for decisions calling for alignment between will and need, personal initiatives, and genuine self-care.',
    'transit:moon|trigono|mercury':
      'Moon trine natal Mercury supports empathic communication, clear expression of feelings, and easier understanding of what others mean. This brief transit sustains fluidity between intuition and reasoning. A good moment for important conversations, creative writing, and decisions that call for both logic and sensitivity.',
    'transit:moon|trigono|venus':
      'Moon trine natal Venus supports emotional harmony, pleasure in exchanges, and greater ease in nurturing and being nurtured. This brief transit sustains emotional well-being and openness to what is beautiful and enjoyable. A good moment for strengthening bonds, creative activities, and anything that nourishes the affective field.',
    'transit:moon|trigono|mars':
      'Moon trine natal Mars supports action driven by genuine motivation, with physical and emotional energy aligned. This brief transit sustains practical initiative with less inner resistance. A good moment to start projects, exercise, and any activity that calls for both courage and sensitivity.',
    'transit:moon|trigono|jupiter':
      'Moon trine natal Jupiter supports emotional openness, moderate optimism, and greater ease in seeing what is possible. This brief transit sustains the willingness to learn and expand without losing balance. A good moment for sharing ideas, planning ahead, and nurturing connections that feed personal growth.',
    'transit:moon|trigono|uranus':
      'Moon trine natal Uranus supports openness to the new without generating emotional instability. This brief transit sustains creativity, intuition, and willingness to try different paths. A good moment for unexpected ideas, light routine changes, and connections that stimulate perspectives outside the usual pattern.',
    'transit:moon|trigono|neptune':
      'Moon trine natal Neptune supports heightened sensitivity, refined intuition, and contact with creative and spiritual dimensions. This brief transit sustains deep empathy and openness to subtle perceptions. A good moment for artistic activities, meditation, lucid dreams, and connections that touch something deeper than the everyday.',
    'transit:moon|trigono|pluto':
      'Moon trine natal Pluto supports contact with deep emotions in a fluid, less threatening way. This brief transit sustains the ability to process what is usually hard to access. A good moment for self-knowledge, meaningful intimate conversations, and any process calling for emotional courage without excess intensity.',
    'transit:moon|trigono|ascendente':
      'Moon trine natal Ascendant supports authentic presence and greater ease in expressing who you are to the world. This brief transit sustains empathy in interactions and receptiveness from the environment. A good moment for personal presentations, important encounters, and any situation calling for genuine presence.',
    'transit:moon|trigono|meio_do_ceu':
      'Moon trine natal Midheaven supports integration between emotional life and professional direction, with greater ease in acting with purpose. This brief transit sustains receptiveness from the public and leadership. A good moment to share projects, strengthen reputation, and align what you feel with what you deliver.',

    // Moon — sextile
    'transit:moon|sextil|sun':
      'Moon sextile natal Sun opens a window of fluidity between emotional life and expression of identity. This brief transit invites small actions aligned with what is wanted and what is felt. A good moment for personal initiatives that need genuine inner motivation to get started.',
    'transit:moon|sextil|mercury':
      'Moon sextile natal Mercury opens space for more fluid communication and receptiveness to emotionally nuanced information. This brief transit invites conversations, study, and exchanges that combine reasoning and sensitivity. A good moment for important dialogues, creative writing, and resolving pending matters that need clarity and empathy.',
    'transit:moon|sextil|venus':
      'Moon sextile natal Venus opens space for pleasant emotional exchanges and moments of care around what is beautiful and meaningful. This brief transit invites cultivating harmony in relationships and pleasure in daily activities. A good moment to strengthen bonds, engage in creative activities, and small gestures of affection that make a difference.',
    'transit:moon|sextil|mars':
      'Moon sextile natal Mars opens space for initiatives driven by genuine motivation and practical use of available energy. This brief transit invites concrete action in something that matters emotionally. A good moment to start personal projects, exercise, and channel willingness into activities with a clear purpose.',
    'transit:moon|sextil|jupiter':
      'Moon sextile natal Jupiter opens a window of moderate optimism and ease in connecting with what nurtures growth. This brief transit invites expanding perspectives and exploring possibilities with curiosity. A good moment to learn something new, plan trips or studies, and cultivate connections that feed a vision of the future.',
    'transit:moon|sextil|uranus':
      'Moon sextile natal Uranus opens space for light renewal and receptiveness to what is unexpected or different from the usual. This brief transit invites creative flexibility and novelty without instability. A good moment for experiments, routine adjustments, and connections with people who broaden perspective.',
    'transit:moon|sextil|neptune':
      'Moon sextile natal Neptune opens space for refined sensitivity, intuition, and contact with creative or spiritual dimensions. This brief transit invites openness to subtle perceptions and deep empathy. A good moment for art, meditation, dreams, and any activity that nourishes the inner field with lightness.',
    'transit:moon|sextil|pluto':
      'Moon sextile natal Pluto opens a window of access to deeper emotions without generating excessive intensity. This brief transit invites reflection on what needs to be transformed with care and intention. A good moment for self-knowledge, depth conversations, and any gentle emotional clearing process.',
    'transit:moon|sextil|ascendente':
      'Moon sextile natal Ascendant opens space for greater authenticity in presence and ease of interpersonal connection. This brief transit invites spontaneous interactions and more genuine expression of who you are. A good moment for encounters, presentations, and any situation calling for receptive presence without excessive defenses.',
    'transit:moon|sextil|meio_do_ceu':
      'Moon sextile natal Midheaven opens a window for aligning emotional life with professional direction in a natural way. This brief transit invites visibility actions that require little effort when the timing is right. A good moment for conversations with leadership, sharing projects, and discreet positioning moves.',
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
      'Saturno en cuadratura al propio Saturno natal expone tension entre la estructura actual y la necesidad de madurez real. Esta fase suele revelar donde los plazos, limites y responsabilidades ya no sirven a lo que quieres construir, haciendo mas evidente el peso de ese desalineamiento. Que estas manteniendo por habito que ya no esta produciendo resultados reales?',
    'transit:saturn|sextil|sun':
      'Saturno en sextil al Sol abre espacio para consolidar proyectos personales con mas rigor y claridad de proposito. Esta fase tiende a revelar lo que necesita estructura para dejar de ser potencial y convertirse en resultado. Que compromisos has estado postergando por falta de metodo, no de voluntad?',
    'transit:saturn|trigono|sun':
      'Saturno en trigono al Sol favorece un ciclo de trabajo constante, con menos friccion entre quien quieres ser y lo que logras sostener en la practica. Las metas de largo plazo se vuelven mas faciles cuando identidad y metodo estan alineados. Que quieres consolidar mientras este flujo esta disponible?',
    'transit:saturn|oposicao|uranus':
      'Saturno en oposicion a Urano natal activa un conflicto directo entre lo que necesita estabilidad y lo que exige renovacion urgente. La polaridad puede manifestarse como resistencia interna: una parte quiere preservar lo que funciona, otra sabe que el modelo actual ya esta obsoleto. Que puedes renovar en etapas, sin necesidad de romper todo de una vez?',
    'transit:saturn|quadratura|uranus':
      'Saturno en cuadratura a Urano natal genera friccion entre el impulso de romper con lo obsoleto y el temor de desestabilizar lo que aun produce resultados. Esta fase suele escalar la incomodidad con rutinas antiguas mientras los cambios rapidos tambien parecen arriesgados — un impasse que pide estrategia. Cual es el cambio mas pequeno que podrias iniciar ahora para indicar que la renovacion ya comenzo?',
    'transit:saturn|sextil|mars':
      'Saturno en sextil a Marte favorece convertir impulso en estrategia, creando ventanas para la accion con tecnica y menor desgaste. Este ciclo suele rendir mas cuando combinas valentia para iniciar con planificacion de ejecucion. Que proyecto exigente tienes disponible para estructurar en etapas ahora?',
    'transit:saturn|trigono|mars':
      'Saturno en trigono a Marte une persistencia y metodo, creando condiciones para ejecucion de calidad sin la friccion de los aspectos de tension. Proyectos de larga duracion o fisicamente exigentes tienden a fluir con mas regularidad y menor desgaste. Este ciclo favorece lo que pide tanto vigor como paciencia al mismo tiempo.',
    'transit:saturn|sextil|saturn':
      'Saturno en sextil al propio Saturno natal abre un ciclo favorable para revisar autogestion, plazos y compromisos sin la presion de los aspectos de tension. El momento invita a cuestionar que responsabilidades aun tienen sentido y cuales necesitan reestructuracion con mayor claridad. Que parte de tu modo de organizarte esta pidiendo actualizacion, no solo optimizacion?',
    'transit:saturn|trigono|saturn':
      'Saturno en trigono al propio Saturno natal indica una fase de buen funcionamiento estructural, con mayor facilidad para sostener metodo y completar etapas. El flujo invita a iniciar algo de larga duracion que antes parecia demasiado grande para comenzar. Usa el momento para empezar lo que pide constancia, no solo mantener lo que ya funciona.',
    'transit:sun|oposicao|pluto':
      'Sol en oposicion a Pluto intensifica temas de control, poder personal y prioridades reales. Este ciclo puede exponer polaridades que piden una postura mas consciente y menos reactiva. Enfocate en lo esencial con firmeza y sin confrontaciones innecesarias.',
    'transit:saturn|oposicao|mars':
      'Saturno en oposicion a Marte natal puede generar sensacion de freno externo en la accion, como si cada paso pidiera mas preparacion o validacion de lo habitual. La tension suele mostrar donde fuerza y tecnica estan desalineadas — el impulso sin estrategia sufre mas en este ciclo. Que en tu ejecucion actual esta pidiendo mas planificacion, no mas esfuerzo?',
    'transit:saturn|quadratura|mercury':
      'Saturno en cuadratura a Mercurio natal puede frenar la comunicacion, sobrecargar el pensamiento y mostrar donde argumentos o procesos mentales necesitan revision estructural. Esta fase aumenta la exigencia de precision — demoras en decisiones y retrabajo de mensajes son senal de que la base conceptual necesita ser mas solida. Que supuesto tuyo sobre esta situacion todavia no has cuestionado con suficiente rigor?',
    'transit:saturn|quadratura|sun':
      'Saturno en cuadratura al Sol natal puede crear sensacion de techo o limite externo sobre iniciativas personales, como si el contexto exigiera mas de la energia disponible. La friccion suele revelar donde la identidad aun depende de aprobacion externa o condiciones ideales para avanzar. Que parte de tu plan puede moverse sin necesitar que todo este perfecto primero?',
    'transit:saturn|sextil|venus':
      'Saturno en sextil a Venus favorece construir vinculos con mas criterio y menos idealizacion, facilitando reconocer lo que tiene reciprocidad genuina. La fase invita a revisar acuerdos afectivos o financieros con una mirada mas madura y expectativas mejor calibradas. Que acuerdo merece un examen honesto sobre lo que cada parte realmente aporta?',
    'transit:saturn|trigono|venus':
      'Saturno en trigono a Venus facilita construir bases mas solidas en relaciones y finanzas, con preferencia natural por calidad y compromisos de largo plazo. El ciclo tiende a alinear inversiones afectivas y materiales con lo que realmente sostiene valor en el tiempo. Que elecciones de largo plazo has estado postergando por falta de certeza?',
    'transit:saturn|sextil|jupiter':
      'Saturno en sextil a Jupiter abre una ventana para canalizar el impulso de expansion en plan ejecutable, atemperando el optimismo con criterio practico. Este ciclo apoya crecimiento en etapas, sin los excesos que suelen acompanar a Jupiter sin el anclaje de Saturno. Que podrias iniciar ahora que necesita tanto audacia como metodo?',
    'transit:saturn|trigono|jupiter':
      'Saturno en trigono a Jupiter crea uno de los ciclos mas favorables para crecer con base, donde expansion y metodo se alinean de forma natural. Los proyectos de medio y largo plazo tienden a avanzar con mas traccion y menos desgaste que en otros momentos. Que oportunidad real esta esperando solo estructura y compromiso de ejecucion?',
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
      'Saturno en oposicion a Jupiter natal tensiona expansion y limite en el mismo punto de decision, mostrando donde optimismo y realidad divergen. Esta fase puede revelar proyectos que crecieron sin estructura suficiente — o donde el exceso de cautela esta frenando lo que ya tiene base para avanzar. Que necesita cortarse para que lo que realmente tiene potencial pueda crecer con mas solidez?',
    'transit:moon|oposicao|jupiter':
      'Luna en oposicion a Jupiter puede amplificar reaccion emocional y expectativa inmediata. El ciclo favorece moderar excesos y volver a decisiones realistas. Pausas breves y prioridades claras ayudan a evitar dispersion.',
    'transit:saturn|oposicao|pluto':
      'Saturno en oposicion a Pluton natal activa el enfrentamiento entre la estructura actual y la necesidad de transformacion mas profunda. Esta fase puede mostrar donde el poder personal y el control estan en juego — la resistencia al cambio suele manifestarse como rigidez o como colapso de lo que no era suficientemente solido. Que estas defendiendo que ya sabes que necesita transformarse?',
    'transit:sun|quadratura|moon':
      'Sol en cuadratura con Luna puede generar friccion entre voluntad consciente y necesidad emocional. Esta fase pide alinear lo que quieres hacer con el ritmo interno disponible. Ajustes simples de rutina y comunicacion reducen conflicto.',
    'transit:saturn|sextil|neptune':
      'Saturno en sextil a Neptuno ofrece forma y metodo a ideas creativas o intuiciones que suelen escapar de la ejecucion por falta de anclaje. La fase facilita separar vision genuina de fantasia, haciendo posible avanzar en proyectos sensibles con pasos verificables. Que proyecto creativo ya sabes que es viable, pero todavia no has traducido en estructura?',
    'transit:saturn|trigono|neptune':
      'Saturno en trigono a Neptuno facilita dar estructura a lo que es sutil, intuitivo o creativo, sin perder la esencia de lo que inspira. El ciclo tiende a volver mas ejecutables proyectos antes nebulosos, con menos confusion entre vision y fantasia. Que dimension de tu vida que parece intangible podria recibir una forma concreta ahora?',
    'transit:sun|sextil|moon':
      'Sol en sextil con Luna facilita integracion entre voluntad y emocion. Esta fase mejora fluidez en conversaciones, ajustes de rutina y decisiones cotidianas. Aprovecha para alinear prioridades internas y externas.',
    'transit:sun|trigono|moon':
      'Sol en trigono con Luna refuerza coherencia entre identidad y necesidades emocionales. El periodo suele traer mayor estabilidad para organizar elecciones importantes. Aprovecha para consolidar habitos sostenibles.',
    'transit:saturn|sextil|ascendente':
      'Saturno en sextil al Ascendente favorece consolidar la forma en que gestionas responsabilidades y te presentas al mundo, con mas solidez e intencionalidad. La fase tiende a facilitar construir presencia con coherencia entre quien eres y como actuas. Donde deseas que tu conducta sea mas reconocida y coherente?',
    'transit:saturn|trigono|ascendente':
      'Saturno en trigono al Ascendente facilita expresar madurez de forma natural, haciendo mas sencillo sostener una postura coherente y responsabilidades con autoridad. La fase genera menos friccion entre intencion y conducta, favoreciendo un crecimiento de presencia con poco esfuerzo adicional. Que habito o postura has intentado consolidar pero que todavia parece artificial?',
    'transit:saturn|oposicao|saturn':
      'Saturno en oposicion al propio Saturno natal marca un punto de medio ciclo — un enfrentamiento entre la estructura construida y lo que realmente puede sostener. Esta fase tiende a revelar donde los fundamentos son solidos y donde necesitan reformulacion objetiva, sin romanticismos. Que has construido hasta aqui que merece seguir adelante, y que necesita reconstruirse sobre nuevas bases?',
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
      'Saturno en cuadratura a la Luna natal puede intensificar la sensacion de peso emocional y limitacion en lo cotidiano, como si las necesidades afectivas y las responsabilidades concretas estuvieran en conflicto directo. Esta fase tiende a mostrar donde el autocuidado fue descuidado o donde la sobrecarga comprime el espacio interno necesario. Que estas cargando emocionalmente que podria distribuirse, negociarse o soltarse?',
    'transit:moon|quadratura|jupiter':
      'Luna en cuadratura con Jupiter puede inflar expectativas y oscilacion emocional frente a resultados. Esta fase pide moderacion para evitar exceso afectivo o decisorio. Revisa prioridades y mantente en lo viable ahora.',
    'transit:uranus|sextil|moon':
      'Urano en sextil con Luna favorece renovacion emocional con mas ligereza y creatividad. El periodo ayuda a probar habitos nuevos sin ruptura brusca. Pequenos cambios conscientes mejoran bienestar rapidamente.',
    'transit:uranus|trigono|moon':
      'Urano en trigono con Luna facilita actualizar patrones emocionales con autonomia. Esta fase abre espacio para elecciones mas autenticas en lo cotidiano. Usa la flexibilidad para ajustar rutina y vinculos con responsabilidad.',
    'transit:pluto|oposicao|venus':
      'Pluton en oposicion a Venus natal puede intensificar temas de poder, apego y reciprocidad en los vinculos, donde lo que antes parecia estable muestra tension entre lo genuino y lo que es solo un acuerdo de conveniencia. Esta fase tiende a mostrar dinamicas de dependencia o control en relaciones afectivas y financieras, haciendo mas dificil sostener acuerdos que no son mutuamente sostenibles. Que en una relacion o acuerdo importante sabes que no es justo, pero has evitado confrontar directamente?',
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
      'Saturno en oposicion a Mercurio natal puede frenar la comunicacion e intensificar la exigencia mental, dificultando organizar pensamientos y transmitirlos con fluidez. La fase suele mostrar donde la base analitica o argumentativa es debil — las decisiones que dependen de claridad conceptual se vuelven mas lentas o cuestionadas. Que punto de tu razonamiento sobre esta situacion todavia no has revisado con profundidad suficiente?',
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
      'Pluton en sextil con Marte natal crea una apertura para actuar con profundidad y estrategia, donde la fuerza de ejecucion puede dirigirse a transformaciones de alto impacto con menos friccion que en los aspectos tensos. La fase facilita proyectos que exigen tanto vigor como persistencia — el tipo de tarea que pide compromiso real, no solo energia inmediata. Que proyecto o cambio tienes disponible ahora que se beneficiaria de foco intenso y ejecucion estructurada?',
    'transit:pluto|trigono|mars':
      'Pluton en trigono con Marte natal facilita la accion profunda y persistente, donde la fuerza de ejecucion encuentra intencion estrategica sin la friccion de los aspectos tensos. La fase crea condiciones para transformaciones bien ancladas, donde el esfuerzo se acumula hacia un resultado estructural y de largo plazo. Que cambio has postergado por parecer demasiado grande encuentra ahora el momento correcto para comenzar?',
    'transit:pluto|quadratura|moon':
      'Pluton en cuadratura con la Luna natal puede intensificar vulnerabilidades emocionales y revelar donde los mecanismos de proteccion afectiva operan de forma automatica o excesiva. La fase tiende a traer a la superficie patrones heredados que regulaban la seguridad emocional — pero que ahora generan mas costo que estabilidad. Que en tus patrones de proteccion emocional sirve a una version mas antigua de ti, y que podrias soltar para tener mas espacio interno ahora?',
    'transit:moon|conjuncao|sun':
      'Luna en conjuncion con Sol marca un punto de reinicio emocional y alineacion de intencion. Esta fase favorece ajustes simples de prioridad y apertura a nuevos ciclos de accion. Define un paso corto y constante para dar direccion al dia.',
    'transit:pluto|sextil|sun':
      'Pluton en sextil al Sol natal facilita el fortalecimiento interno y el reposicionamiento de identidad con mas autenticidad, donde lo que ya no corresponde a lo que te has convertido puede cerrarse sin necesidad de ruptura dramatica. La fase favorece decisiones profundas que emergen de claridad genuina, no de crisis. Que parte de quien fuiste aun llevas por habito — y que claridad interna ya tienes para soltar lo que ya no es real?',
    'transit:pluto|trigono|sun':
      'Pluton en trigono al Sol natal facilita la transformacion de la identidad con fluidez, donde lo que necesita cerrarse puede cerrarse y lo que necesita emerger encuentra condiciones favorables para consolidarse. La fase favorece claridad de proposito y acciones alineadas con lo genuino, sin la friccion de los aspectos tensos. Que aspecto de tu identidad o direccion esta listo para ser consolidado con mas intencionalidad ahora?',
    'transit:saturn|oposicao|ascendente':
      'Saturno en oposicion al Ascendente natal puede intensificar tension en relaciones cercanas, revelando donde los limites personales o los acuerdos de convivencia necesitan revision objetiva. Esta fase tiende a traer confrontaciones con lo que el otro espera — pidiendo que decidas que puedes sostener sin sacrificar tu propia coherencia. Que necesitas renegociar en relaciones que fue dejado implicito por demasiado tiempo?',
    'transit:pluto|conjuncao|mars':
      'Pluton en conjuncion a Marte natal amplifica la fuerza de accion con una intensidad que puede servir tanto a proyectos de alto impacto como escalar conflictos por exceso de fuerza de voluntad. Esta fase tiende a revelar donde el poder de actuar se usa de forma constructiva o destructiva — la diferencia a menudo esta en la claridad de la direccion. Hacia donde estas dirigiendo la intensidad de accion que este ciclo pone a tu disposicion?',
    'transit:sun|oposicao|uranus':
      'Sol en oposicion a Urano puede traer ruptura de ritmo, reaccion a limites y deseo de libertad inmediata. La fase pide flexibilidad con responsabilidad para evitar decisiones bruscas. Revisa prioridades y ajusta rumbo sin perder coherencia.',
    'transit:uranus|quadratura|sun':
      'Urano en cuadratura al Sol senala tension entre identidad actual y necesidad de cambio. El ciclo puede generar inquietud, impaciencia y ganas de cambiar todo de golpe. Innova por etapas para preservar base y ganar autonomia estable.',
    'transit:saturn|oposicao|sun':
      'Saturno en oposicion al Sol natal activa presion externa y una prueba de autenticidad personal, creando tension entre quien eres y lo que el contexto exige. Esta fase puede mostrar donde la identidad depende de validacion para avanzar — el desgaste suele venir de intentar agradar y actuar a la vez. Que estas haciendo por obligacion que podria hacerse desde eleccion genuina, o simplemente descontinuarse?',
    'transit:saturn|quadratura|venus':
      'Saturno en cuadratura a Venus natal puede exponer friccion en relaciones o en torno a los propios valores, haciendo mas evidente lo que es insostenible en acuerdos afectivos o financieros. Esta fase tiende a reducir la tolerancia con lo que drena energia — las idealizaciones se hacen mas dificiles de sostener, lo que puede generar tanto claridad como incomodidad. Que sigues sosteniendo por miedo a perder algo que ya perdio su valor real para ti?',
    'transit:sun|conjuncao|mercury':
      'Sol en conjuncion con Mercurio favorece claridad mental, foco comunicativo y decision objetiva. La fase tiende a apoyar conversaciones importantes, estudio y organizacion de ideas. Prioriza mensajes simples alineados con lo esencial.',
    'transit:jupiter|conjuncao|moon':
      'Jupiter en conjuncion con Luna amplifica sensibilidad, contencion y percepcion de apoyo emocional. El ciclo puede favorecer apertura afectiva y vision mas amplia de necesidades internas. Evita excesos emocionales y mantén equilibrio en elecciones.',
    'transit:jupiter|oposicao|pluto':
      'Jupiter en oposicion a Pluton puede ampliar disputas de vision, control y poder de decision. El periodo pide calibrar ambicion con etica, profundidad y sentido de limite. El crecimiento consistente llega por estrategia, no por extremos.',
    'transit:neptune|quadratura|venus':
      'Neptuno en cuadratura con Venus puede generar idealizacion afectiva y confusion sobre valor y reciprocidad. El ciclo pide discernimiento para diferenciar intuicion de proyeccion. Observa senales concretas antes de cerrar acuerdos emocionales o financieros.',
    'transit:saturn|sextil|moon':
      'Saturno en sextil con Luna abre espacio para traducir necesidades emocionales en rutina afectiva mas estable y consciente. La fase facilita distinguir lo que es sentimiento genuino de lo que es reactividad de habito, haciendo el cuidado mas estructurado. Que patron emocional quieres transformar en eleccion consciente, no en reaccion automatica?',
    'transit:saturn|trigono|moon':
      'Saturno en trigono con Luna facilita el equilibrio entre vida emocional y responsabilidades concretas, con menor costo interno que en los ciclos de tension. El ciclo suele ofrecer serenidad y claridad para tomar decisiones afectivas con mas madurez. Que decision en relaciones o rutina de cuidado has estado postergando por miedo al malestar?',
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
      'Pluton en conjuncion al Sol natal inicia un ciclo de transformacion de la identidad donde lo que antes sostenia la autoimagen pasa a ser cuestionado o se vuelve insostenible. Esta fase suele acelerar el corte de lo que es superficial o de actuacion — la presion por autenticidad aumenta, con menos tolerancia hacia lo que no es genuino. Que has estado manteniendo en tu imagen que ya no corresponde a quien te estas convirtiendo?',
    'transit:pluto|quadratura|mars':
      'Pluton en cuadratura con Marte puede elevar presion, impaciencia y conflictos de control en la accion. Este ciclo pide ejecucion disciplinada y uso consciente de la fuerza. Prioriza tareas esenciales y evita confrontaciones reactivas.',
    'transit:saturn|conjuncao|jupiter':
      'Saturno en conjuncion con Jupiter combina expansion y estructura con mirada de largo plazo. El periodo favorece crecimiento realista, prioridades objetivas y criterio de ejecucion. Construye por etapas para mantener sostenibilidad.',
    'transit:saturn|sextil|uranus':
      'Saturno en sextil a Urano crea condiciones para renovar rutinas o estructuras de forma incremental, sin el riesgo de ruptura de los aspectos de tension. La fase facilita innovaciones practicas, donde nuevos metodos pueden probarse sin comprometer lo que ya sostiene resultados. Que cambio has estado postergando por miedo a desestabilizar lo que funciona?',
    'transit:saturn|trigono|uranus':
      'Saturno en trigono a Urano facilita modernizar procesos y estructuras con naturalidad, sin la friccion de los aspectos mas tensos. El ciclo tiende a volver mas viables cambios antes arriesgados cuando hay planificacion sencilla y ejecucion gradual. Que actualizacion ya sabes que es necesaria, pero has estado esperando el momento adecuado?',
    'transit:uranus|sextil|mars':
      'Urano en sextil con Marte impulsa iniciativa, agilidad y experimentacion tactica. Esta fase suele favorecer ajustes inteligentes y ejecucion mas rapida con consciencia. Mantén foco en innovacion util, no en aceleracion vacia.',
    'transit:uranus|trigono|mars':
      'Urano en trigono con Marte mejora accion decidida con flexibilidad y resolucion creativa. El ciclo apoya cambios productivos cuando las prioridades estan claras. Usa el impulso para desbloquear progreso practico.',
    'transit:jupiter|oposicao|saturn':
      'Jupiter en oposicion a Saturno muestra tension entre expansion y limites. Esta fase pide equilibrio entre vision y viabilidad en compromisos actuales. Recalibra metas, plazos y distribucion de recursos.',
    'transit:neptune|conjuncao|meio_do_ceu':
      'Neptuno en conjuncion al Medio Cielo puede aumentar sensibilidad sobre vocacion, imagen y sentido profesional. Esta fase pide discernimiento entre inspiracion y proyeccion. Mantén direccion clara y valida decisiones con señales concretas.',
    'transit:saturn|sextil|meio_do_ceu':
      'Saturno en sextil al Medio Cielo abre una ventana para consolidar reputacion profesional con entregas objetivas y decisiones de largo plazo mas solidas. La fase facilita avances en carrera que dependen de demostrar responsabilidad, no solo visibilidad. Que paso profesional puedes dar ahora que construira una base duradera?',
    'transit:saturn|trigono|meio_do_ceu':
      'Saturno en trigono al Medio Cielo facilita avanzar en la trayectoria profesional con menos friccion, donde metodo y credibilidad se alinean de forma mas natural. El ciclo apoya posicionamientos de largo plazo y tiende a generar reconocimiento cuando hay consistencia en la entrega y claridad de direccion. Que nivel de compromiso con tu carrera estas listo para sostener de aqui en adelante?',
    'transit:uranus|conjuncao|sun':
      'Urano en conjuncion con Sol tiende a acelerar cambios de identidad y reposicionamiento personal. Esta fase puede aumentar necesidad de autonomia y decisiones experimentales. Innova con responsabilidad para evitar inestabilidad brusca.',
    'transit:jupiter|oposicao|neptune':
      'Jupiter en oposicion a Neptuno puede ampliar idealizacion y expectativas difusas sin verificacion. Este ciclo pide criterios claros y chequeo de hechos antes de decisiones grandes. Mantén inspiracion con base practica.',
    'transit:jupiter|quadratura|neptune':
      'Jupiter en cuadratura con Neptuno puede aumentar entusiasmo con menor claridad sobre limites reales. Esta fase pide discernir entre vision con fundamento y proyeccion optimista. Revisa supuestos y regula ritmo de expansion.',
    'transit:pluto|conjuncao|saturn':
      'Pluton en conjuncion con Saturno profundiza transformacion estructural y responsabilidades clave. El ciclo puede exigir decisiones maduras sobre control, resistencia y reconstruccion necesaria. Avanza por etapas con estrategia y limites claros.',
    'transit:pluto|oposicao|jupiter':
      'Pluton en oposicion a Jupiter natal puede ampliar conflictos entre ambicion de crecimiento y necesidad de poder o control, donde expansion y profundidad estrategica se vuelven dificiles de alinear. Esta fase tiende a revelar donde el crecimiento se busca sin base etica suficiente o donde la escala deseada supera la capacidad de sostener el resultado. Que quieres construir que necesita mas profundidad y menos escala para volverse solido y duradero?',
    'transit:saturn|quadratura|mars':
      'Saturno en cuadratura a Marte natal puede generar friccion entre el impulso de actuar y los obstaculos de ritmo, tecnica o contexto — la accion se vuelve mas costosa y mas resistida de lo normal. Esta fase tiende a mostrar donde estrategia y ejecucion estan desalineadas: energia disponible, pero direccion o preparacion insuficientes. Que estas intentando forzar que responderia mejor a un enfoque mas tactico y gradual?',
    'transit:jupiter|quadratura|venus':
      'Jupiter en cuadratura con Venus puede aumentar busqueda de placer y optimismo en elecciones afectivas o financieras. Esta fase favorece moderacion y criterio de valor mas claro. Expande con equilibrio para evitar excesos.',
    'transit:neptune|quadratura|saturn':
      'Neptuno en cuadratura con Saturno puede tensionar certezas, estructura y tolerancia a la ambiguedad. Esta fase pide ajustar expectativas y reconstruir planes con flexibilidad realista. Combina intuicion con verificacion objetiva.',
    'transit:pluto|oposicao|sun':
      'Pluton en oposicion al Sol natal puede activar disputas de poder y autenticidad en relaciones importantes, donde el otro funciona como espejo de algo que aun no ha sido integrado internamente. Esta fase tiende a mostrar donde la identidad personal esta siendo negociada o perdida en respuesta a expectativas externas, con presion creciente para recuperar coherencia interna. Que estas dejando que otros definan sobre ti que necesitas retomar con mas conciencia y firmeza?',
    'transit:pluto|oposicao|mars':
      'Pluton en oposicion a Marte natal puede elevar el potencial de conflicto por fuerza de voluntad, donde la energia de accion encuentra resistencia externa que la tensiona o la refleja con igual intensidad. Esta fase tiende a revelar donde el impulso de actuar es mas sobre control que sobre direccion genuina — lo que aumenta la friccion con quien o lo que no cede facilmente. Que en tu forma de actuar esta generando mas resistencia que resultado, y que dice eso sobre la direccion elegida?',
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
      'Neptuno en conjuncion con el Sol natal amplifica la sensibilidad de identidad y puede crear una busqueda mas intensa de sentido, haciendo mas dificil saber donde termina la intuicion y donde empieza la idealizacion. La fase tiende a disolver contornos de direccion establecida — lo que puede ser tanto renovacion profunda como dispersion sin ancla. Que hay en tu busqueda actual que es genuinamente tuyo, y que es expectativa de como deberias ser?',
    'transit:neptune|conjuncao|moon':
      'Neptuno en conjuncion con la Luna natal intensifica la vida emocional y la permeabilidad afectiva, haciendo mas facil captar las necesidades de otros pero mas dificil discernir lo que es genuinamente propio. La fase puede traer refinamiento de empatia o, sin ancla, confusion entre lo que se siente y lo que se absorbe del entorno. Que parte de lo que sientes ahora es tuya, y que parte es eco del entorno que necesitas dejar pasar sin retener?',
    'transit:neptune|conjuncao|mercury':
      'Neptuno en conjuncion con Mercurio natal amplia la intuicion y la lectura simbolica de la realidad, haciendo el pensamiento mas asociativo y menos lineal. La fase puede potenciar creatividad y percepcion sutil — pero tambien aumenta el riesgo de confusion en detalles, plazos y acuerdos concretos. Donde confias en intuicion que aun no fue verificada, y donde esa verificacion es necesaria para avanzar con mas solidez?',
    'transit:neptune|conjuncao|venus':
      'Neptuno en conjuncion con Venus natal puede amplificar la idealizacion en vinculos y valores, haciendo mas dificil percibir lo que es afecto genuino y lo que es proyeccion de como deberian ser las cosas. La fase puede traer apertura estetica y sensibilidad afectiva o, sin discernimiento, vinculos construidos sobre expectativa mas que sobre reciprocidad real. Que en un vinculo o eleccion de valor prefieres idealizar en lugar de observar con mas atencion?',
    'transit:neptune|conjuncao|mars':
      'Neptuno en conjuncion con Marte natal puede reducir la nitidez de la accion, dificultando sostener fuerza de ejecucion sin que la energia se disperse en direcciones multiples o mal definidas. La fase tiende a exigir que el impulso de actuar encuentre intencion muy clara — sin ella, el ciclo produce esfuerzo sin traccion o entusiasmo que desaparece antes de materializar resultados. Cual es la accion mas concreta que puedes comprometer hoy, sin depender de claridad total para empezar?',
    'transit:neptune|conjuncao|jupiter':
      'Neptuno en conjuncion con Jupiter natal amplifica la busqueda de sentido y expansion, con riesgo de inflar expectativas muy por encima de lo que los hechos concretos sostienen. La fase puede traer vision genuina y apertura o construir una narrativa optimista mucho mayor de lo que puede realizarse ahora. Que en tu expansion actual tiene fundamento verificable, y que es solo optimismo que aun no fue probado por la realidad?',
    'transit:neptune|conjuncao|saturn':
      'Neptuno en conjuncion con Saturno natal tensa estructura y sensibilidad en un mismo eje, donde lo que necesita forma encuentra lo que resiste ser contenido. La fase puede disolver rutinas que se volvieron mecanicas — una invitacion a reconstruir metodo con mas flexibilidad, pero con riesgo de perder el ancla que aun sostiene resultados. Que en tu organizacion actual necesita mas sensibilidad, y que necesita mas firmeza para no disolverse?',
    'transit:neptune|conjuncao|neptune':
      'Neptuno en conjuncion con Neptuno marca un reajuste de ciclo largo en sentido, intuicion y proyeccion. La fase puede disolver referencias antiguas y pedir formas mas sutiles de orientacion. Conserva anclajes practicos mientras reorganizas vision interna.',
    'transit:neptune|conjuncao|ascendente':
      'Neptuno en conjuncion con el Ascendente natal puede alterar progresivamente la autoimagen y los limites del yo, haciendo mas dificil distinguir quien se es de lo que se proyecta o de lo que el entorno espera. La fase puede traer renovacion de presencia y disolucion de mascaras antiguas o, sin ancla, confusion sobre identidad y limites. Que en tu forma de presentarte al mundo ya no es del todo verdadero, y que esta intentando emerger con mas autenticidad?',

    // ── Mars completion ────────────────────────────────────────────────────
    'transit:mars|sextil|sun':
      'Marte en sextil al Sol favorece iniciativa con lectura clara de direccion personal y energia disponible. Este ciclo tiende a apoyar accion enfocada cuando voluntad y prioridad real estan integradas. Usa el momento para avanzar objetivos concretos con objetividad.',
    'transit:mars|sextil|meio_do_ceu':
      'Marte en sextil al Medio Cielo favorece iniciativa profesional con buen ritmo y alineacion de direccion. Este ciclo tiende a apoyar movimientos estrategicos cuando el foco esta en metas de visibilidad. Ejecuta por prioridad y rastrea avance con criterios claros.',
    'transit:mars|conjuncao|meio_do_ceu':
      'Marte en conjuncion al Medio Cielo intensifica el impulso de actuar en carrera y visibilidad publica. Esta fase favorece iniciativas de posicionamiento cuando la energia se canaliza con estrategia y sin prisa excesiva. Avanza en metas profesionales concretas priorizando consistencia de entrega sobre velocidad de ejecucion.',
    'transit:mars|quadratura|meio_do_ceu':
      'Marte en cuadratura al Medio Cielo puede crear friccion entre el impulso de accion y las exigencias de la vida profesional o la reputacion. Esta fase tiende a evidenciar donde el ritmo de ejecucion y la expectativa externa estan descalibrados. Reduce dispersion, prioriza lo que tiene impacto directo y evita confrontaciones innecesarias en el entorno laboral.',
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
    'transit:sun|conjuncao|ascendente':
      'El Sol en conjuncion al Ascendente natal marca el inicio de un nuevo ciclo anual de expresion personal y proyeccion en el mundo. La vitalidad, la presencia y la necesidad de claridad sobre quien eres tienden a acentuarse durante este periodo. Invierte en definir lo que deseas proyectar en este ciclo.',
    'transit:sun|conjuncao|jupiter':
      'El Sol en conjuncion a Jupiter natal amplia la confianza, la disposicion para el crecimiento y la apertura a nuevas posibilidades. El ciclo favorece iniciativas de expansion cuando hay discernimiento sobre lo que realmente merece inversion. Evita el exceso de entusiasmo sin anclaje en lo que es viable.',
    'transit:sun|conjuncao|mars':
      'El Sol en conjuncion a Marte natal intensifica la energia disponible, el impulso de actuar y la capacidad de sostener esfuerzo focalizado. El ciclo tiende a fortalecer la determinacion y la disposicion para enfrentar desafios con decision. Canaliza la fuerza con direccion clara para evitar la precipitacion.',
    'transit:sun|conjuncao|meio_do_ceu':
      'El Sol en conjuncion al Medio Cielo natal ilumina la trayectoria profesional y amplia la visibilidad publica. El periodo tiende a favorecer reconocimiento y oportunidades relacionadas con la posicion social y la carrera. Define con claridad lo que deseas mostrar y lo que pretendes alcanzar.',
    'transit:sun|conjuncao|moon':
      'El Sol en conjuncion a la Luna natal crea convergencia entre identidad consciente y mundo emocional interno. El ciclo favorece alineacion entre lo que se siente y lo que se quiere construir, reduciendo conflictos internos. Usa el periodo para integrar necesidades personales con la direccion de vida que estas siguiendo.',
    'transit:sun|conjuncao|neptune':
      'El Sol en conjuncion a Neptuno natal amplia sensibilidad, creatividad y receptividad para lo que va mas alla de lo ordinario. El ciclo favorece el trabajo artistico, practicas espirituales y empatia, pero puede reducir temporalmente la claridad practica. Mantiene anclajes concretos mientras exploras lo mas sutil.',
    'transit:sun|conjuncao|saturn':
      'El Sol en conjuncion a Saturno natal llama la atencion hacia la estructura, la responsabilidad y el peso de lo que aun necesita consolidarse. El ciclo invita a una evaluacion honesta de lo construido y al fortalecimiento de lo que esta fragil. Enfrenta las exigencias como oportunidad de madurez genuina.',
    'transit:sun|conjuncao|sun':
      'El Sol en conjuncion al Sol natal marca el retorno solar, el inicio de un nuevo ciclo anual de identidad y proposito. El momento invita a revisar el ano anterior y a definir con claridad lo que se desea cultivar en los proximos doce meses. Establece intenciones con consciencia sobre lo que es realmente prioritario.',
    'transit:sun|conjuncao|uranus':
      'El Sol en conjuncion a Urano natal enciende el impulso de ruptura con lo convencional y de expresion de la singularidad personal. El ciclo puede traer cambios abruptos o un intenso deseo de alterar lo establecido. Abraza la originalidad con estrategia para evitar inestabilidad innecesaria.',
    'transit:sun|conjuncao|venus':
      'El Sol en conjuncion a Venus natal destaca el placer, la estetica, la creatividad y lo que genuinamente atrae y satisface. El ciclo tiende a ampliar la facilidad de conexion, la expresion afectiva y la apreciacion de lo bello y valioso. Invierte en actividades que nutran satisfaccion real y relaciones de calidad.',
    'transit:sun|ingress|house_1':
      'El Sol transitando por la Casa 1 destaca la identidad, la presencia fisica y la forma en que te presentas al mundo. La vitalidad y el deseo de expresion personal directa tienden a estar en primer plano. Buen momento para reafirmar quien eres y lo que deseas proyectar en este ciclo.',
    'transit:sun|ingress|house_2':
      'El Sol transitando por la Casa 2 trae atencion hacia los recursos materiales, los valores personales y lo que es realmente util y valioso para ti. El ciclo favorece la revision de finanzas y la claridad sobre lo que sostiene seguridad y bienestar. Prioriza decisiones materiales con criterio y alineacion con lo que genuinamente importa.',
    'transit:sun|ingress|house_3':
      'El Sol transitando por la Casa 3 ilumina la comunicacion, el aprendizaje y los intercambios cotidianos con el entorno mas inmediato. La curiosidad, la movilidad y la disposicion para conectar ideas y personas tienden a acentuarse. Buen ciclo para escribir, estudiar y fortalecer redes de contacto cercanas.',
    'transit:sun|ingress|house_5':
      'El Sol transitando por la Casa 5 destaca la creatividad, la expresion ludica, el romance y el placer genuino de ser quien eres. El ciclo favorece proyectos artisticos, actividades recreativas y conexiones afectivas con mas autenticidad. Buen momento para cultivar lo que trae alegria y expresar talentos con confianza.',
    'transit:sun|ingress|house_6':
      'El Sol transitando por la Casa 6 trae foco al trabajo, la salud, las rutinas y los procesos que sostienen el cotidiano. El ciclo favorece la atencion a los detalles, al cuerpo y a la eficiencia de los habitos diarios. Ajusta rutinas que sostienen productividad y bienestar de forma consistente.',
    'transit:sun|ingress|house_7':
      'El Sol transitando por la Casa 7 ilumina las asociaciones, las relaciones y lo que emerge a traves del contacto significativo con el otro. El periodo favorece mayor claridad sobre compromisos, cooperacion y lo que se busca en relaciones importantes. Buen momento para abordar temas de asociacion con apertura y honestidad.',
    'transit:sun|ingress|house_8':
      'El Sol transitando por la Casa 8 profundiza cuestiones de transformacion, recursos compartidos y vinculos de confianza. El ciclo puede traer a la superficie temas como herencias, inversiones conjuntas y lo que necesita liberarse o renovarse. Un periodo favorable para el insight sobre lo oculto y para procesos de renovacion real.',
    'transit:sun|ingress|house_9':
      'El Sol transitando por la Casa 9 expande el foco hacia la filosofia, los viajes, la educacion superior y visiones de mundo mas amplias. La curiosidad por lo desconocido y la disposicion para ir mas alla de lo familiar tienden a estar elevadas. Buen momento para estudiar, viajar y revisar creencias con mente abierta.',
    'transit:sun|ingress|house_11':
      'El Sol transitando por la Casa 11 destaca grupos, redes sociales, proyectos colectivos y los ideales que orientan el futuro. Las conexiones con personas de valores similares y la participacion en iniciativas colectivas pueden ganar relevancia. Buena ventana para colaborar, revisar metas a largo plazo y fortalecer alianzas.',
    'transit:sun|ingress|house_12':
      'El Sol transitando por la Casa 12 invita a un periodo de introspeccion, recogimiento y contacto con lo que normalmente queda fuera de la consciencia cotidiana. La vida interior, las practicas contemplativas y el trabajo entre bastidores tienden a ganar importancia. Buen momento para integrar experiencias y procesar lo que aun necesita cierre.',
    'transit:sun|oposicao|ascendente':
      'El Sol en oposicion al Ascendente natal coincide con el transito por el Descendente, trayendo luz a las relaciones y lo que el otro espeja. El periodo tiende a destacar acuerdos, asociaciones y como la identidad se expresa en el contexto relacional. Buena ventana para revisar compromisos con honestidad y apertura.',
    'transit:sun|oposicao|jupiter':
      'El Sol en oposicion a Jupiter natal puede amplificar tendencias al exceso o a una confianza desproporcionada respecto a lo que es realisticamente viable. El ciclo invita a verificar si el optimismo tiene base solida o solo entusiasmo momentaneo. Equilibra expansion y moderacion para evitar promesas mas alla de tu capacidad.',
    'transit:sun|oposicao|mars':
      'El Sol en oposicion a Marte natal puede traer tension entre la voluntad propia y las fuerzas externas que ofrecen resistencia. Conflictos directos o competencias pueden ganar visibilidad durante este ciclo. Canaliza la energia de forma asertiva, sin reactividad, para atravesar el periodo con menos desgaste.',
    'transit:sun|oposicao|meio_do_ceu':
      'El Sol en oposicion al Medio Cielo natal transita por el Fondo del Cielo, dirigiendo la atencion a la vida privada, la familia y las raices. El periodo invita a evaluar como la base personal sostiene o limita la proyeccion publica. Buen momento para cuidar el entorno domestico y fortalecer el soporte emocional interno.',
    'transit:sun|oposicao|mercury':
      'El Sol en oposicion a Mercurio natal puede traer giros en comunicaciones, perspectivas o informacion relevante. Otros pueden presentar puntos de vista que contradicen o desafian lo que parecia establecido. Escucha con apertura y revisa conclusiones antes de tomar una posicion definitiva.',
    'transit:sun|oposicao|moon':
      'El Sol en oposicion a la Luna natal puede crear tension entre necesidades emocionales y la direccion consciente de vida. Lo que se siente y lo que se quiere realizar pueden parecer en conflicto durante este ciclo. Buena ventana para mayor consciencia de las propias necesidades y como se relacionan con tus objetivos.',
    'transit:sun|oposicao|saturn':
      'El Sol en oposicion a Saturno natal trae evaluacion de limites, responsabilidades no resueltas y el peso de lo que aun necesita enfrentarse. El ciclo puede revelar donde la estructura esta fragil o donde la disciplina ha sido postergada. Afrontar las exigencias con honestidad es el camino mas productivo en este momento.',
    'transit:sun|oposicao|sun':
      'El Sol en oposicion al Sol natal marca el punto medio del ciclo anual, trayendo luz sobre lo que fue iniciado en el retorno solar. El periodo tiende a destacar las relaciones y lo que el otro refleja sobre tu propia trayectoria. Buena ventana para evaluar el progreso del ciclo personal con claridad.',
    'transit:sun|oposicao|venus':
      'El Sol en oposicion a Venus natal puede crear tension entre lo que agrada y lo que es necesario, entre el placer y la responsabilidad. Relaciones o asuntos financieros pueden pedir atencion y revision durante este ciclo. La claridad sobre lo que se valora genuinamente ayuda a tomar decisiones con mayor discernimiento.',
    'transit:sun|quadratura|ascendente':
      'El Sol en cuadratura al Ascendente natal puede traer friccion entre la identidad personal y las expectativas del contexto inmediato. El ciclo invita a ajustes en la forma de presentarse o en la relacion con el entorno proximo. Buena ventana para identificar donde la expresion personal pide mas autenticidad.',
    'transit:sun|quadratura|jupiter':
      'El Sol en cuadratura a Jupiter natal puede amplificar impulsos de expansion sin suficiente anclaje en lo que es realisticamente viable. Exceso de confianza, promesas mas alla de la capacidad o gastos desproporcionados pueden surgir como desafios. Usa el discernimiento para separar lo que tiene fundamento de lo que es solo entusiasmo.',
    'transit:sun|quadratura|mars':
      'El Sol en cuadratura a Marte natal genera friccion entre la voluntad de actuar y las resistencias que el contexto ofrece. Conflicto, impaciencia y desgaste energetico pueden surgir si la accion es forzada sin direccion clara. Canaliza la presion hacia resolver obstaculos concretos en lugar de reaccionar de forma impulsiva.',
    'transit:sun|quadratura|meio_do_ceu':
      'El Sol en cuadratura al Medio Cielo natal crea tension entre el desarrollo personal interno y las demandas de la trayectoria profesional. Las elecciones de carrera, reputacion o direccion de vida pueden sentirse mas exigentes durante este periodo. Revisa si los objetivos externos reflejan valores y necesidades genuinas antes de actuar.',
    'transit:sun|quadratura|mercury':
      'El Sol en cuadratura a Mercurio natal puede traer presion sobre comunicaciones, decisiones o el procesamiento de informacion importante. Malentendidos, sobrecarga cognitiva o dificultad para articular pensamientos pueden surgir durante este ciclo. Desacelera antes de comunicar y verifica lo que ha sido entendido.',
    'transit:sun|quadratura|neptune':
      'El Sol en cuadratura a Neptuno natal puede crear confusion entre lo que es real y lo que es idealizado o proyectado. La claridad de percepcion puede estar temporalmente comprometida, haciendo prudente verificar antes de decidir. Trabaja con creatividad e intuicion mientras mantienes anclajes practicos solidos.',
    'transit:sun|quadratura|pluto':
      'El Sol en cuadratura a Pluton natal pone en evidencia dinamicas de poder, control y transformaciones que piden atencion. El ciclo puede traer confrontaciones con lo que esta oculto o con fuerzas que operan entre bastidores. La honestidad sobre lo que necesita cambiar es la base para atravesar este periodo con integridad.',
    'transit:sun|quadratura|saturn':
      'El Sol en cuadratura a Saturno natal crea presion entre los deseos de expresion y las limitaciones estructurales o responsabilidades no cumplidas. El ciclo puede sentirse pesado, con obstaculos que exigen paciencia y disciplina. Trata las restricciones como informacion sobre lo que necesita fortalecerse.',
    'transit:sun|quadratura|sun':
      'El Sol en cuadratura al Sol natal activa un punto de tension en el ciclo anual, trayendo desafios relacionados con la identidad y la expresion personal. El momento puede revelar conflictos entre quien quieres ser y lo que el contexto permite o exige. Buena ventana para ajustar el rumbo y realinear la direccion con autenticidad.',
    'transit:sun|quadratura|uranus':
      'El Sol en cuadratura a Urano natal puede traer disrupciones inesperadas, cambios abruptos o impulsos de rebeldia contra lo establecido. El deseo de ruptura puede ser intenso, pero sin planificacion puede resultar en inestabilidad innecesaria. Integra la necesidad de cambio con un enfoque mas estrategico.',
    'transit:sun|quadratura|venus':
      'El Sol en cuadratura a Venus natal puede generar tension en relaciones, asuntos financieros o en lo que genuinamente trae satisfaccion. Las decisiones relacionadas con el placer, el dinero o el afecto pueden pedir mas atencion y cuidado durante este ciclo. Revisa lo que se esta valorando y si esta alineado con necesidades reales.',
    'transit:sun|sextil|ascendente':
      'El Sol en sextil al Ascendente natal crea un momento de expresion personal mas fluida y alineada con el entorno. La identidad encuentra canales naturales de proyeccion sin gran resistencia ni esfuerzo excesivo. Buen momento para iniciativas que impliquen presencia, visibilidad y comunicacion de lo que representas.',
    'transit:sun|sextil|jupiter':
      'El Sol en sextil a Jupiter natal favorece el optimismo, la apertura a oportunidades y una sensacion de expansion accesible. El ciclo apoya el crecimiento cuando hay disposicion para moverse en la direccion de lo vislumbrado. La confianza que surge tiende a estar bien fundamentada cuando se aplica con criterio.',
    'transit:sun|sextil|mars':
      'El Sol en sextil a Marte natal pone energia disponible para la accion enfocada con fluidez y sin el desgaste del conflicto. Las iniciativas personales, los proyectos fisicos y la afirmacion de la voluntad encuentran buen soporte durante este ciclo. Buen momento para poner en movimiento lo que estaba en planificacion.',
    'transit:sun|sextil|meio_do_ceu':
      'El Sol en sextil al Medio Cielo natal apoya la visibilidad profesional y el alineamiento entre identidad y objetivos de carrera. El ciclo puede abrir espacio para reconocimiento u oportunidades relacionadas con la posicion publica. Buen momento para posicionarse con claridad sobre lo que ofreces y lo que buscas.',
    'transit:sun|sextil|mercury':
      'El Sol en sextil a Mercurio natal favorece la claridad mental, la facilidad de comunicacion y el procesamiento eficiente de informacion. La articulacion de ideas tiende a fluir con mayor naturalidad, facilitando negociaciones e intercambios. Buen periodo para escribir, aprender o conducir conversaciones importantes.',
    'transit:sun|sextil|neptune':
      'El Sol en sextil a Neptuno natal abre espacio para la creatividad, la intuicion y una sensibilidad mas receptiva a lo que no es inmediatamente visible. El ciclo favorece el trabajo artistico, las practicas contemplativas y la conexion con lo que va mas alla de lo ordinario. Usa la imaginacion con intencionalidad como herramienta productiva.',
    'transit:sun|sextil|pluto':
      'El Sol en sextil a Pluton natal favorece el acceso a profundidad y recursos que normalmente no se movilizan con facilidad. El ciclo apoya cambios significativos conducidos con foco e intencion, sin la resistencia de los aspectos de tension. Buena ventana para trabajar la transformacion personal con menos friccion.',
    'transit:sun|sextil|saturn':
      'El Sol en sextil a Saturno natal apoya la disciplina productiva, la estructura eficaz y la responsabilidad que energiza en lugar de pesar. Los proyectos a largo plazo, los compromisos y el trabajo consistente encuentran buen respaldo durante este ciclo. Momento favorable para consolidar lo que ha sido construido con esfuerzo real.',
    'transit:sun|sextil|sun':
      'El Sol en sextil al Sol natal crea una ventana favorable para la expresion personal y para activar el potencial del ciclo anual en curso. La identidad encuentra fluidez y la capacidad de moverse hacia lo que importa tiende a estar accesible. Buen momento para iniciativas que expresen quien estas siendo ahora.',
    'transit:sun|sextil|uranus':
      'El Sol en sextil a Urano natal favorece la originalidad, la innovacion y la apertura a perspectivas fuera de lo habitual. El ciclo apoya cambios creativos y la expresion de lo singular sin generar disrupciones innecesarias. Buen momento para experimentar, explorar lo diferente y confiar en la intuicion innovadora.',
    'transit:sun|sextil|venus':
      'El Sol en sextil a Venus natal favorece el placer, la creatividad y las conexiones afectivas con mas facilidad y naturalidad. Los intercambios sociales, los proyectos esteticos y la expresion de lo que agrada tienden a fluir bien durante este ciclo. Buen momento para invertir en relaciones, arte y actividades que nutran satisfaccion genuina.',
    'transit:sun|trigono|ascendente':
      'El Sol en trigono al Ascendente natal favorece la expresion autentica y una presencia en el mundo que encuentra resonancia natural. La identidad y la forma en que eres percibido tienden a estar bien alineadas durante este ciclo. Buen momento para presentarte, liderar proyectos personales y afirmar tu direccion con confianza.',
    'transit:sun|trigono|jupiter':
      'El Sol en trigono a Jupiter natal favorece la expansion, la confianza y la sensacion de que el camino esta abierto para el crecimiento real. Las oportunidades que llegan durante este ciclo tienden a tener fundamento genuino y a encontrar receptividad. Buen momento para ampliar lo que esta funcionando y asumir iniciativas con optimismo.',
    'transit:sun|trigono|mars':
      'El Sol en trigono a Marte natal trae energia disponible, coraje y la capacidad de actuar con claridad y proposito. Las iniciativas personales y los proyectos que requieren disposicion encuentran buen terreno durante este ciclo. Ventana favorable para logros concretos, decisiones asertivas y trabajo que exige vigor.',
    'transit:sun|trigono|meio_do_ceu':
      'El Sol en trigono al Medio Cielo natal apoya la armonia entre identidad y trayectoria profesional, con posible reconocimiento y claridad de direccion. El ciclo favorece la progresion en la carrera cuando hay esfuerzo y alineacion con lo que se quiere construir. Buen momento para iniciativas que aumenten la visibilidad con autenticidad.',
    'transit:sun|trigono|mercury':
      'El Sol en trigono a Mercurio natal favorece la claridad de pensamiento, la comunicacion eficaz y la conexion entre intencion y expresion. Las ideas fluyen con mas facilidad y la articulacion de lo que se piensa tiende a estar elevada durante este ciclo. Buen momento para presentar proyectos, tener conversaciones importantes y desarrollar conceptos.',
    'transit:sun|trigono|neptune':
      'El Sol en trigono a Neptuno natal apoya la creatividad, la espiritualidad y una sensibilidad que enriquece la percepcion del cotidiano. El ciclo favorece el contacto con lo trascendente, ya sea en el arte, la contemplacion o la empatia. Ventana propicia para integrar la dimension mas sutil de la experiencia con la vida practica.',
    'transit:sun|trigono|pluto':
      'El Sol en trigono a Pluton natal favorece la transformacion profunda conducida con foco e intencion, sin las fricciones de los aspectos de tension. El ciclo puede facilitar renovacion significativa en areas donde habia necesidad de cambio real. Buen momento para profundizar lo que importa y liberar lo que ha perdido significado.',
    'transit:sun|trigono|saturn':
      'El Sol en trigono a Saturno natal favorece la madurez, la estructura productiva y la sensacion de que el esfuerzo encuentra resultados concretos. Los proyectos que requieren disciplina y compromiso tienden a progresar bien durante este ciclo. Buena ventana para consolidar lo construido y asumir responsabilidades con confianza.',
    'transit:sun|trigono|sun':
      'El Sol en trigono al Sol natal crea un momento de fluidez y alineamiento interno, con la expresion personal encontrando buenas condiciones para florecer. Este punto del ciclo anual favorece iniciativas, creatividad y conexion con el propio proposito. Buena ventana para avanzar en proyectos que expresen quien estas llegando a ser.',
    'transit:sun|trigono|uranus':
      'El Sol en trigono a Urano natal favorece la originalidad, la libertad de expresion y la apertura a lo que es singular e innovador. Los cambios durante este ciclo tienden a ser creativos y bien recibidos, sin el choque de disrupciones forzadas. Buen momento para explorar lo que es autentico y diferente, confiando en lo que emerge.',
    'transit:sun|trigono|venus':
      'El Sol en trigono a Venus natal trae armonia, placer y la sensacion de que las conexiones afectivas y creativas estan bien sostenidas. El ciclo favorece la expresion artistica, las relaciones y la capacidad de disfrutar lo que la vida ofrece. Buena ventana para cultivar belleza, afecto y lo que genuinamente satisface.',
    'transit:moon|conjuncao|ascendente':
      'La Luna en conjuncion al Ascendente natal intensifica la expresion emocional y la receptividad en el contacto directo con el entorno. El periodo tiende a hacer el estado interno mas visiblemente presente en la interaccion y la comunicacion. Buena ventana para notar como las emociones moldean la primera impresion.',
    'transit:moon|conjuncao|jupiter':
      'La Luna en conjuncion a Jupiter natal amplia la necesidad de sentido y pertenencia, haciendo facil confundir entusiasmo genuino con exageracion emocional. Tus expectativas pueden crecer mas rapido de lo que la realidad puede confirmar — y eso puede generar decepcion proporcional. Aprovecha el impulso para avanzar en algo planificado, manteniendo una medida concreta de lo que es posible ahora.',
    'transit:moon|conjuncao|meio_do_ceu':
      'La Luna en conjuncion al Medio Cielo natal hace el estado emocional mas visiblemente ligado a la trayectoria profesional y la reputacion publica. El ciclo puede traer momentos en que vida personal e imagen publica se cruzan de forma mas evidente. Buena ventana para integrar necesidades emocionales con objetivos de carrera.',
    'transit:moon|conjuncao|mercury':
      'La Luna en conjuncion a Mercurio natal crea un vinculo entre el mundo emocional y el procesamiento mental, haciendo los sentimientos mas articulables. El ciclo favorece conversaciones profundas, escritura reflexiva y expresion de lo que normalmente permanece interno. Buena ventana para nombrar y comprender lo que se esta sintiendo.',
    'transit:moon|conjuncao|moon':
      'La Luna en conjuncion a la Luna natal, el retorno lunar mensual, reinicia el ciclo emocional e instintivo del mes. El periodo invita a revisar las necesidades de cuidado, confort y pertenencia que guian las respuestas automaticas. Buen momento para percibir a donde apuntan las emociones de este ciclo.',
    'transit:moon|conjuncao|neptune':
      'La Luna en conjuncion a Neptuno natal amplia la permeabilidad emocional y la receptividad hacia lo sutil, imaginativo o espiritual. El ciclo favorece empatia profunda, creatividad y contacto con lo que trasciende lo ordinario, pero puede disolver limites. Mantiene discernimiento sobre lo que es tuyo y lo que es del otro.',
    'transit:moon|conjuncao|pluto':
      'La Luna en conjuncion a Pluton natal puede traer emociones con calidad compulsiva — un deseo intenso de verdad, profundidad o resolucion definitiva de algo que incomoda. El riesgo es reaccionar externamente a lo que es esencialmente una transformacion interna: la intensidad pide procesamiento, no accion inmediata. Permitete sentir el peso sin necesitar resolverlo todo ahora — la claridad tiende a llegar despues de que la intensidad cede.',
    'transit:moon|conjuncao|saturn':
      'La Luna en conjuncion a Saturno natal puede traer peso emocional, sensacion de restriccion afectiva o responsabilidades que limitan el flujo natural de sentimientos. El ciclo invita a madurez emocional, evaluacion honesta de necesidades reales y estructuracion del autocuidado. Buen momento para fortalecer la base emocional con criterio.',
    'transit:moon|conjuncao|venus':
      'La Luna en conjuncion a Venus natal armoniza el mundo emocional con el placer, la estetica y la necesidad de conexion afectiva de calidad. El ciclo favorece satisfaccion genuina en relaciones, actividades creativas y entornos que nutren el bienestar. Buena ventana para cultivar lo que genuinamente agrada y alimenta emocionalmente.',
    'transit:moon|ingress|house_1':
      'La Luna transitando por la Casa 1 intensifica la expresion emocional y hace las reacciones internas mas visiblemente presentes en el dia a dia. El periodo favorece la autoconsciencia y el contacto directo con como el estado emocional afecta la presencia. Buena ventana para notar lo que las emociones revelan sobre las necesidades actuales.',
    'transit:moon|ingress|house_3':
      'La Luna transitando por la Casa 3 activa el mundo emocional a traves de la comunicacion, el aprendizaje y los intercambios cotidianos. El periodo favorece conversaciones cargadas de significado y mas atentas a lo que se siente. Buena ventana para expresar lo que es interno y para recibir lo que los proximos quieren compartir.',
    'transit:moon|ingress|house_5':
      'La Luna transitando por la Casa 5 intensifica la necesidad de expresion creativa, placer y conexiones afectivas que nutren autenticidad. El ciclo favorece actividades ludicas, expresion artistica y relaciones con mas afecto y reciprocidad. Buen periodo para cultivar lo que genuinamente alegra y satisface emocionalmente.',
    'transit:moon|ingress|house_6':
      'La Luna transitando por la Casa 6 activa el mundo emocional a traves de la rutina, el trabajo y el cuidado del cuerpo. El periodo favorece la atencion a lo que el cuerpo necesita y a como las emociones influyen en la salud y la eficiencia diaria. Buena ventana para ajustar habitos que sostienen bienestar emocional y fisico.',
    'transit:moon|ingress|house_7':
      'La Luna transitando por la Casa 7 intensifica la necesidad de conexion, asociacion y receptividad emocional en la relacion con el otro. El periodo favorece mayor sensibilidad en las relaciones y claridad sobre lo que se busca en el vinculo. Buena ventana para atender relaciones significativas con atencion y apertura.',
    'transit:moon|ingress|house_8':
      'La Luna transitando por la Casa 8 lleva el mundo emocional hacia zonas de profundidad, transformacion e intimidad real. El ciclo favorece el contacto con lo que esta debajo de la superficie, incluyendo miedos, apegos y necesidades de renovacion. Un periodo de mayor intensidad emocional que puede aprovecharse bien con honestidad interna.',
    'transit:moon|ingress|house_9':
      'La Luna transitando por la Casa 9 dirige el mundo emocional hacia la busqueda de significado, expansion de perspectiva y necesidad de ir mas alla de lo familiar. El ciclo favorece curiosidad emocional, apertura hacia lo diferente y contacto con lo que amplia el sentido de proposito. Buen periodo para nutrir la vision de mundo con experiencia real.',
    'transit:moon|ingress|house_10':
      'La Luna transitando por la Casa 10 conecta el mundo emocional a la trayectoria profesional y la imagen publica. El periodo puede hacer las emociones mas visiblemente presentes en el contexto de trabajo y carrera. Buena ventana para notar como las necesidades afectivas influyen en objetivos y decisiones profesionales.',
    'transit:moon|ingress|house_11':
      'La Luna transitando por la Casa 11 dirige el mundo emocional hacia grupos, redes de pertenencia e ideales colectivos. El ciclo favorece la necesidad de conexion con la comunidad, amigos y causas que resuenan con valores personales. Buen momento para nutrir relaciones colectivas y percibir lo que el sentido de pertenencia alimenta.',
    'transit:moon|ingress|house_12':
      'La Luna transitando por la Casa 12 lleva el mundo emocional hacia zonas de recogimiento, procesamiento silencioso y contacto con lo que normalmente no emerge en la consciencia cotidiana. El ciclo favorece descanso emocional, suenos y practicas contemplativas. Buen periodo para integrar sentimientos antes de que comience un nuevo ciclo lunar.',
    'transit:moon|oposicao|ascendente':
      'La Luna en oposicion al Ascendente natal, transitando por el Descendente, amplia la receptividad emocional en las relaciones y lo que el otro espeja sobre las propias necesidades. El ciclo puede hacer mas visibles las proyecciones afectivas y lo que se espera de la conexion con el otro. Buena ventana para equilibrar autocuidado y cuidado relacional.',
    'transit:moon|oposicao|meio_do_ceu':
      'La Luna en oposicion al Medio Cielo natal, transitando por el Fondo del Cielo, intensifica la vida interior, las raices familiares y lo que sostiene emocionalmente. El ciclo puede traer tension entre necesidades afectivas internas y demandas de la vida publica o profesional. Buena ventana para cuidar la base emocional sin descuidar responsabilidades externas.',
    'transit:moon|oposicao|moon':
      'La Luna en oposicion a la Luna natal, el punto medio del ciclo lunar, ilumina lo que fue activado en la vuelta del ciclo mensual. El periodo puede traer a la superficie necesidades que estaban subterraneas y confrontar el estado emocional con el entorno externo. Buena ventana para evaluar en que medida las emociones de este ciclo estan siendo reconocidas.',
    'transit:moon|oposicao|neptune':
      'La Luna en oposicion a Neptuno natal puede crear confusion entre lo que realmente sientes y lo que desearias sentir — o lo que crees que deberias sentir. El riesgo es proyectar esperanza en situaciones o personas que aun no han mostrado suficiente claridad para sustentarla. Usa el periodo para preguntarte: que es real aqui, y que es mi necesidad de que las cosas sean diferentes de lo que son?',
    'transit:moon|oposicao|pluto':
      'La Luna en oposicion a Pluton natal puede despertar impulso de control o necesidad de dominar situaciones cuando la emocion es demasiado intensa para soportar. El par tiende a revelar dinamicas de poder en relaciones cercanas — quien tiene mas influencia, quien cede, quien guarda resentimientos. Preguntate: estas reaccionando a lo que ocurre ahora o a un patron antiguo que esta situacion desperto?',
    'transit:moon|oposicao|saturn':
      'La Luna en oposicion a Saturno natal tiende a crear conflicto entre la necesidad de acogimiento y la exigencia de funcionalidad — lo que sientes puede parecer un estorbo ante lo que debes cumplir. Hay riesgo de suprimir emociones legitimas para parecer mas competente o responsable de lo que te sientes. Momento de reconocer que cuidarte no es huir de las responsabilidades — es lo que sostiene la capacidad de cumplirlas.',
    'transit:moon|oposicao|sun':
      'La Luna en oposicion al Sol natal corresponde a la luna llena del ciclo personal, trayendo iluminacion sobre necesidades emocionales en relacion con los objetivos conscientes. El periodo puede hacer mas visibles los conflictos entre lo que se siente y lo que se quiere realizar. Buena ventana para integrar intencion y emocion con mas consciencia.',
    'transit:moon|oposicao|uranus':
      'La Luna en oposicion a Urano natal puede traer inestabilidad emocional, cambios abruptos de humor o necesidad de ruptura con lo familiar. El ciclo puede revelar tension entre necesidad de seguridad y deseo de libertad en el mundo afectivo. Buena ventana para acoger la necesidad de novedad sin comprometer el soporte emocional necesario.',
    'transit:moon|oposicao|venus':
      'La Luna en oposicion a Venus natal puede crear tension entre lo que necesitas afectivamente y lo que puedes pedir o recibir. Hay riesgo de dar mas de lo que sientes o de esperar que el otro adivine lo que no fue dicho. Momento de nombrar tu necesidad real en relaciones cercanas — sin proyectar carencia ni fingir que todo esta bien cuando no lo esta.',
    'transit:moon|quadratura|ascendente':
      'La Luna en cuadratura al Ascendente natal puede traer friccion entre el mundo emocional interno y como ese estado se proyecta en el entorno. El ciclo puede hacer mas desafiante mantener coherencia entre lo que se siente y como uno aparece ante el mundo. Buena ventana para identificar donde la expresion emocional pide mas autenticidad.',
    'transit:moon|quadratura|meio_do_ceu':
      'La Luna en cuadratura al Medio Cielo natal puede traer tension entre necesidades afectivas y las demandas de la carrera o la imagen publica. El ciclo invita a evaluar cuanto el mundo emocional esta siendo integrado o ignorado en la trayectoria profesional. Buena ventana para ajustar la relacion entre vida interior y objetivos externos.',
    'transit:moon|quadratura|mercury':
      'La Luna en cuadratura a Mercurio natal puede crear conflicto entre lo que quieres expresar y lo que tu logica deja salir — el corazon quiere decir lo que la mente aun esta intentando organizar. El riesgo es concluir que las personas no te entienden cuando, en realidad, tu mismo estas procesando lo que sientes. Antes de comunicar algo importante, permitete sentir primero — la claridad llega despues del procesamiento, no antes.',
    'transit:moon|quadratura|moon':
      'La Luna en cuadratura a la Luna natal activa un punto de tension en el ciclo mensual, revelando conflictos entre necesidades emocionales y el contexto actual. El periodo puede traer inestabilidad emocional o dificultad para mantener el equilibrio afectivo. Buena ventana para identificar lo que necesita ajuste en la forma de atender las propias necesidades.',
    'transit:moon|quadratura|neptune':
      'La Luna en cuadratura a Neptuno natal puede hacer dificil separar lo que sientes de lo que imaginas, lo que temes o lo que deseas que fuera verdad — los limites internos se vuelven porosos. Hay tendencia de escapar en distraccion, sueno o idealizacion como respuesta a una realidad incomoda que aun no esta lista para ser enfrentada. Crea pequenas anclas fisicas en el dia a dia — caminatas, rutinas simples — antes de cualquier decision que involucre emocion elevada.',
    'transit:moon|quadratura|pluto':
      'La Luna en cuadratura a Pluton natal puede traer impulso de controlar situaciones o personas como forma inconsciente de no perder el control sobre lo que se siente. La intensidad emocional puede generar reacciones desproporcionadas a provocaciones pequenas — lo que irrita ahora raramente es solo lo que parece ser. Preguntate: estoy reaccionando al presente o a un miedo antiguo que esta situacion simplemente desperto?',
    'transit:moon|quadratura|saturn':
      'La Luna en cuadratura a Saturno natal puede traer peso, frialdad emocional o una sensacion de restriccion que inhibe el flujo de sentimientos. El ciclo invita a evaluar donde la rigidez emocional o el exceso de control impide la receptividad real. Buena ventana para equilibrar madurez y apertura emocional.',
    'transit:moon|quadratura|sun':
      'La Luna en cuadratura al Sol natal crea tension entre el mundo emocional interno y la direccion consciente de vida. El ciclo puede revelar conflictos entre lo que se siente y lo que se quiere construir, pidiendo integracion. Buena ventana para reconocer necesidades emocionales sin dejar que dominen las decisiones a largo plazo.',
    'transit:moon|quadratura|uranus':
      'La Luna en cuadratura a Urano natal puede traer impaciencia emocional y ganas urgentes de romper con lo que parece estancado — aunque la direccion del cambio todavia no este clara. Puedes saber que algo necesita cambiar sin saber exactamente que, y eso tiende a generar irritacion con lo que esta cerca. Observa lo que provoca mas agitacion interna: esos puntos suelen indicar donde la renovacion genuina es necesaria, no donde la accion impulsiva ayuda.',
    'transit:moon|quadratura|venus':
      'La Luna en cuadratura a Venus natal puede generar tension entre necesidades afectivas genuinas y lo que parece agradable o esteticamente satisfactorio. El ciclo puede revelar conflictos en relaciones o insatisfaccion con lo que se busco por placer superficial. Buena ventana para distinguir lo que nutre de verdad de lo que solo agrada momentaneamente.',
    'transit:moon|sextil|ascendente':
      'La Luna en sextil al Ascendente natal crea una ventana de expresion emocional mas fluida y bien recibida por el entorno. El ciclo favorece receptividad, autenticidad y facilidad de conexion a traves de la presencia. Buen momento para compartir lo que se siente y para crear puentes afectivos con el entorno.',
    'transit:moon|sextil|jupiter':
      'La Luna en sextil a Jupiter natal favorece bienestar emocional, generosidad y la sensacion de que las necesidades afectivas pueden satisfacerse con mas facilidad. El ciclo apoya optimismo genuino y apertura hacia experiencias que amplian la satisfaccion. Buen momento para nutrir lo que expande el mundo interior con criterio.',
    'transit:moon|sextil|mars':
      'La Luna en sextil a Marte natal pone energia emocional disponible para la accion con mas fluidez y menos conflicto entre sentimiento e iniciativa. El ciclo favorece asertividad afectiva y la capacidad de actuar a partir de lo que se siente. Buen momento para poner en movimiento lo que habia sido contenido emocionalmente.',
    'transit:moon|sextil|meio_do_ceu':
      'La Luna en sextil al Medio Cielo natal favorece alineamiento entre el mundo emocional y la trayectoria profesional. El ciclo apoya decisiones de carrera que toman en cuenta necesidades personales genuinas y que nutren el bienestar. Buen momento para integrar lo que se siente con lo que se busca construir profesionalmente.',
    'transit:moon|sextil|mercury':
      'La Luna en sextil a Mercurio natal favorece la articulacion del mundo emocional en palabras y pensamientos mas fluidos. El ciclo apoya conversaciones reflexivas, escritura expresiva y procesamiento cognitivo de sentimientos. Buen momento para nombrar lo que se esta viviendo y para encontrar quien sepa escuchar.',
    'transit:moon|sextil|moon':
      'La Luna en sextil a la Luna natal crea una ventana de fluidez emocional y alineamiento natural entre las necesidades internas y el contexto. El ciclo favorece receptividad, cuidado de si y de los proximos sin grandes resistencias. Buen momento para percibir lo que nutre y para cultivar lo que sostiene el bienestar afectivo.',
    'transit:moon|sextil|neptune':
      'La Luna en sextil a Neptuno natal favorece sensibilidad, intuicion y apertura hacia lo sutil y trascendente en el mundo emocional. El ciclo apoya creatividad, empatia y practicas contemplativas que alimentan la vida interior. Buen momento para trabajar el mundo imaginativo y espiritual con intencionalidad.',
    'transit:moon|sextil|pluto':
      'La Luna en sextil a Pluton natal favorece el acceso a la profundidad emocional con mas facilidad y menos resistencia que en aspectos de tension. El ciclo apoya procesos de transformacion afectiva conducidos con foco e intencion. Buen momento para trabajar lo que esta oculto en el mundo emocional con coraje y cuidado.',
    'transit:moon|sextil|sun':
      'La Luna en sextil al Sol natal crea una ventana favorable para el alineamiento entre el mundo emocional y la direccion consciente de vida. El ciclo favorece integracion entre lo que se siente y lo que se busca realizar, con menos conflicto interno. Buen momento para tomar decisiones que honren tanto las necesidades afectivas como los objetivos a largo plazo.',
    'transit:moon|sextil|uranus':
      'La Luna en sextil a Urano natal favorece apertura hacia la novedad, creatividad emocional y disposicion para incluir lo diferente en el mundo afectivo. El ciclo apoya cambios en el campo emocional que son bien recibidos y no generan disrupciones innecesarias. Buen momento para explorar nuevas formas de cuidar de si y relacionarse.',
    'transit:moon|sextil|venus':
      'La Luna en sextil a Venus natal favorece armonia emocional, placer y conexiones afectivas con mas naturalidad y satisfaccion genuina. El ciclo apoya relaciones nutritivas, actividades esteticas y un sentido ampliado de bienestar. Buen momento para cultivar lo que genuinamente agrada y nutre en el mundo afectivo.',
    'transit:moon|trigono|ascendente':
      'La Luna en trigono al Ascendente natal favorece expresion emocional autentica y receptividad en el entorno de forma natural y bien recibida. El ciclo facilita conexion, presencia afectiva y alineamiento entre lo que se siente y como se aparece. Buen momento para cultivar relaciones con autenticidad y cuidado.',
    'transit:moon|trigono|jupiter':
      'La Luna en trigono a Jupiter natal favorece bienestar emocional, generosidad y la sensacion de que el mundo interior esta en expansion con fundamento. El ciclo facilita satisfaccion genuina, optimismo afectivo y apertura a experiencias enriquecedoras. Buen momento para nutrir lo que amplia el sentido de proposito y calidad de vida.',
    'transit:moon|trigono|mars':
      'La Luna en trigono a Marte natal favorece asertividad emocional, energia disponible para actuar a partir de lo que se siente y capacidad de defender necesidades sin conflicto. El ciclo facilita la integracion entre accion y mundo afectivo. Buen momento para poner en movimiento lo que habia sido contenido por hesitacion.',
    'transit:moon|trigono|meio_do_ceu':
      'La Luna en trigono al Medio Cielo natal favorece armonia entre el mundo emocional y la trayectoria profesional, con posibilidad de que necesidades afectivas sean sostenidas por la carrera. El ciclo facilita decisiones que integran vida interior y objetivos externos. Buen momento para avanzar profesionalmente de forma alineada con quien eres.',
    'transit:moon|trigono|mercury':
      'La Luna en trigono a Mercurio natal favorece articulacion fluida del mundo emocional en pensamiento y comunicacion. El ciclo facilita expresar sentimientos con precision e integrar logica y emocion. Buen momento para conversaciones significativas, escritura reflexiva y procesamiento emocional a traves del lenguaje.',
    'transit:moon|trigono|moon':
      'La Luna en trigono a la Luna natal crea un momento de fluidez emocional y alineamiento natural entre el ritmo interno y el ciclo lunar. El ciclo facilita receptividad, autocuidado y bienestar afectivo con mas naturalidad. Buen momento para percibir lo que el mundo emocional esta pidiendo y para responder con gentileza.',
    'transit:moon|trigono|neptune':
      'La Luna en trigono a Neptuno natal favorece sensibilidad, intuicion y conexion con lo sutil y trascendente de forma fluida y productiva. El ciclo facilita creatividad, empatia y practicas contemplativas que nutren la vida interior. Buen momento para trabajar el mundo imaginativo con apertura e intencionalidad.',
    'transit:moon|trigono|pluto':
      'La Luna en trigono a Pluton natal favorece transformacion emocional profunda conducida con foco e intencion, sin las fricciones de los aspectos de tension. El ciclo facilita renovacion afectiva y acceso a lo que estaba oculto en el mundo emocional. Buen momento para profundizar lo que importa y liberar lo que perdio valor afectivo.',
    'transit:moon|trigono|sun':
      'La Luna en trigono al Sol natal favorece alineamiento entre el mundo emocional y la direccion consciente de vida, con integracion natural entre lo que se siente y lo que se quiere realizar. El ciclo facilita bienestar, decisiones coherentes y la sensacion de que interior y exterior estan en armonia. Buen momento para avanzar con confianza.',
    'transit:moon|trigono|uranus':
      'La Luna en trigono a Urano natal favorece apertura hacia lo nuevo en el mundo emocional, con cambios creativos que son bien integrados. El ciclo facilita renovacion afectiva, innovacion en el autocuidado y receptividad hacia lo inesperado sin perder estabilidad. Buen momento para explorar lo que es diferente y autentico en el campo emocional.',
    'transit:moon|trigono|venus':
      'La Luna en trigono a Venus natal favorece armonia, placer y conexiones afectivas sostenidas con naturalidad y satisfaccion genuina. El ciclo facilita bienestar emocional, expresion creativa y relaciones nutritivas. Buen momento para cultivar lo que genuinamente agrada y nutre, con apertura y reciprocidad.',

    // Saturn — entradas faltantes
    'transit:saturn|conjuncao|pluto':
      'Saturno en conjuncion a Pluton natal combina estructura y poder transformador en un ciclo de reconfiguraciones profundas y duraderas. El periodo puede exigir decisiones definitivas sobre lo que debe eliminarse o consolidarse en bases mas solidas. Un momento de confrontacion con lo que ha sido aplazado y ahora pide resolucion estructural.',
    'transit:saturn|conjuncao|uranus':
      'Saturno en conjuncion a Urano natal crea tension creativa entre la necesidad de orden y el impulso hacia la ruptura y renovacion. El periodo puede traer cambios concretos en areas donde las estructuras antiguas ya no contienen lo nuevo. Un ciclo de reformulacion que pide ecuanimidad entre lo que debe mantenerse y lo que debe liberarse.',
    'transit:saturn|ingress|house_2':
      'Saturno en ingreso a la Casa 2 inicia un ciclo de revision profunda de los habitos financieros y de los valores que sostienen la vida material. El periodo invita a construir seguridad economica de forma consistente, eliminando gastos sin fundamento y desarrollando autodisciplina financiera. Buena ventana para crear bases materiales mas solidas alineadas con lo que verdaderamente tiene valor.',
    'transit:saturn|ingress|house_7':
      'Saturno en ingreso a la Casa 7 inicia un ciclo de seriedad y responsabilidad en las parejas intimas y los vinculos de larga duracion. El periodo puede traer desafios que exigen madurez y compromiso genuino en las relaciones, revelando donde faltan bases solidas. Buena ventana para consolidar asociaciones genuinas o para reconocer las que ya no sostienen el intercambio necesario.',
    'transit:saturn|ingress|house_8':
      'Saturno en ingreso a la Casa 8 inicia un ciclo de confrontacion con asuntos de intercambio, transformacion y recursos que involucran a otras personas. El periodo invita a reorganizar acuerdos financieros compartidos y a enfrentar lo que se ha evitado en el campo de las transformaciones profundas. Buena ventana para establecer bases mas conscientes en relaciones de interdependencia.',
    'transit:saturn|ingress|house_9':
      'Saturno en ingreso a la Casa 9 inicia un ciclo de revision de las creencias, la vision del mundo y los compromisos con el aprendizaje de largo plazo. El periodo invita a construir una filosofia de vida mas estructurada, reemplazando creencias vagas por comprension profundizada. Buena ventana para comprometerse con estudios serios, formacion continua o expansion basada en fundamentos reales.',
    'transit:saturn|ingress|house_11':
      'Saturno en ingreso a la Casa 11 inicia un ciclo de revision de los vinculos colectivos, las redes sociales y los objetivos a largo plazo. El periodo invita a evaluar con madurez que grupos e ideales sostienen genuinamente el camino y cuales son solo comodas en la superficie. Buena ventana para construir conexiones mas solidas y comprometerse con metas colectivas con responsabilidad genuina.',
    'transit:saturn|ingress|house_12':
      'Saturno en ingreso a la Casa 12 inicia un ciclo de confrontacion con lo que ha sido reprimido, evitado o dejado en segundo plano de la vida interior. El periodo puede traer una sensacion de clausura o recogimiento que, bien aprovechada, se convierte en espacio para revision profunda y organizacion del mundo subjetivo. Buena ventana para trabajar con lo que existe en las sombras y construir bases psicologicas mas integradas.',
    'transit:saturn|oposicao|meio_do_ceu':
      'Saturno en oposicion al Medio Cielo natal senala tension entre las demandas externas de la carrera y las necesidades de arraigo y vida domestica. El periodo puede traer confrontaciones entre ambicion profesional y lo que sostiene el mundo interior. Buena ventana para evaluar si la trayectoria externa esta alineada con las bases que dan soporte al camino.',
    'transit:saturn|oposicao|moon':
      'Saturno en oposicion a la Luna natal tiende a crear friccion entre la estructura racional y las necesidades emocionales mas profundas. El periodo puede traer sensacion de restriccion afectiva, distancia emocional o dificultad para cuidarse con la misma atencion que se dedica a las responsabilidades externas. Buena ventana para reconocer donde la disciplina ha reemplazado al cuidado y buscar mayor integracion.',
    'transit:saturn|oposicao|neptune':
      'Saturno en oposicion a Neptuno natal tensa la linea entre lo real y lo idealizado, exigiendo discernimiento sobre donde la fantasia reemplaza la accion concreta. El periodo puede revelar decepciones en areas donde hubo proyeccion excesiva o evasion de la realidad. Buena ventana para consolidar lo que tiene sustancia y liberar lo que no es mas que ilusion sin fundamento.',
    'transit:saturn|oposicao|venus':
      'Saturno en oposicion a Venus natal tiende a traer friccion en las relaciones, la expresion afectiva o la relacion con el placer y la abundancia. El periodo puede revelar desalineaciones entre lo que se desea y lo que los compromisos reales ofrecen. Buena ventana para evaluar con honestidad que en las relaciones necesita mas estructura y que simplemente ya no corresponde a lo que se necesita.',
    'transit:saturn|quadratura|ascendente':
      'Saturno en cuadratura al Ascendente natal puede crear friccion entre la necesidad de estructura interna y la forma en que se presenta al mundo externo. El periodo tiende a revelar donde la identidad publica y la identidad privada estan en conflicto, exigiendo ajustes de autenticidad. Buena ventana para trabajar la coherencia entre quien se es y como se aparece en los espacios de contacto.',
    'transit:saturn|quadratura|jupiter':
      'Saturno en cuadratura a Jupiter natal crea tension entre el impulso de expansion y los limites que la realidad impone. El periodo puede traer frustraciones cuando el optimismo supera lo que es posible sostener con los recursos disponibles. Buena ventana para calibrar las ambiciones con lo que es factible y transformar el entusiasmo en plan concreto y sostenible.',
    'transit:saturn|quadratura|meio_do_ceu':
      'Saturno en cuadratura al Medio Cielo natal puede traer desafios significativos en la trayectoria profesional, revelando donde las bases de la carrera necesitan revision. El periodo invita a confrontar expectativas poco realistas sobre la vida publica y a construir el camino con mas honestidad estructural. Buena ventana para realinear objetivos externos con lo que verdaderamente sostiene el recorrido.',
    'transit:saturn|quadratura|neptune':
      'Saturno en cuadratura a Neptuno natal crea tension entre la necesidad de forma y definicion y el impulso hacia la disolucion y trascendencia. El periodo puede revelar donde la falta de limites genera confusion o donde la rigidez excesiva sofoca la creatividad y la espiritualidad. Buena ventana para encontrar estructuras que acojan lo sutil sin perder claridad.',
    'transit:saturn|sextil|mercury':
      'Saturno en sextil a Mercurio natal favorece el pensamiento disciplinado, la comunicacion precisa y la capacidad de organizar ideas con claridad y autoridad. El ciclo facilita el aprendizaje riguroso, la escritura estructurada y la planificacion intelectual. Buen momento para comprometerse con proyectos mentales que exigen consistencia y profundidad analitica.',
    'transit:saturn|sextil|pluto':
      'Saturno en sextil a Pluton natal favorece el uso constructivo del poder, con capacidad de transformar estructuras de forma profunda y sostenible. El ciclo facilita la reorganizacion de areas de la vida que necesitaban renovacion sin las fricciones de los aspectos de tension. Buen momento para consolidar cambios surgidos de procesos transformadores anteriores.',
    'transit:saturn|trigono|mercury':
      'Saturno en trigono a Mercurio natal favorece claridad mental, capacidad de comunicar con autoridad y habilidad para organizar pensamientos y proyectos de forma eficiente. El ciclo facilita el compromiso con aprendizajes exigentes y la expresion de ideas con madurez y precision. Buen momento para avanzar en proyectos intelectuales con consistencia y enfoque.',
    'transit:saturn|trigono|pluto':
      'Saturno en trigono a Pluton natal favorece la transformacion de estructuras profundas de forma constructiva y con sentido de proposito. El ciclo facilita la consolidacion de cambios significativos que exigen durabilidad e intencion clara. Buen momento para construir lo que debe perdurar sobre bases que han pasado por renovacion genuina.',

    // Urano — entradas faltantes
    'transit:uranus|conjuncao|neptune':
      'Urano en conjuncion a Neptuno natal combina el impulso de ruptura con sensibilidad trascendente, creando un ciclo de transformaciones que involucran tanto lo concreto como lo imaginativo. El periodo puede traer cambios inesperados en la espiritualidad, la creatividad o las percepciones sobre lo real. Un momento de apertura a lo que no tiene forma definida, con posibilidad de renovacion profunda en el campo de la intuicion y la conciencia ampliada.',
    'transit:uranus|conjuncao|pluto':
      'Urano en conjuncion a Pluton natal combina ruptura repentina y transformacion profunda en un ciclo de reconfiguraciones radicales y potencialmente irreversibles. El periodo puede traer cambios abruptos en areas donde el poder, la destruccion y la renovacion ya estaban actuando. Un momento de maxima intensidad donde lo antiguo debe ceder espacio a lo totalmente nuevo.',
    'transit:uranus|ingress|house_2':
      'Urano en ingreso a la Casa 2 inicia un ciclo de disrupciones e innovaciones en la vida financiera y los sistemas de valores. El periodo puede traer cambios abruptos en los ingresos, nuevas formas de generar o administrar recursos, o revisiones radicales de lo que se considera valioso. Buena ventana para experimentar nuevos modelos de sustentabilidad y soltar apegos a formas fijas de seguridad material.',
    'transit:uranus|ingress|house_4':
      'Urano en ingreso a la Casa 4 inicia un ciclo de cambios inesperados en la vida domestica, familiar o en el sentido de hogar. El periodo puede traer relocalizaciones, reestructuraciones familiares o revisiones profundas de lo que significa pertenecer y tener raices. Buena ventana para liberar patrones familiares heredados y crear nuevas formas de habitar y arraigarse.',
    'transit:uranus|ingress|house_6':
      'Urano en ingreso a la Casa 6 inicia un ciclo de innovaciones e interrupciones en la rutina diaria, el trabajo y los habitos de salud. El periodo puede traer cambios abruptos en el empleo, nuevas metodologias de trabajo o la necesidad de reformular las practicas cotidianas. Buena ventana para experimentar enfoques mas libres e inventivos en la organizacion de la vida practica.',
    'transit:uranus|ingress|house_8':
      'Urano en ingreso a la Casa 8 inicia un ciclo de cambios inesperados en areas de transformacion, recursos compartidos y lo que esta oculto. El periodo puede traer disrupciones en herencias, deudas, asociaciones financieras o en el propio proceso de transformacion interior. Buena ventana para liberar estructuras de poder que ya no corresponden a lo que se es de verdad.',
    'transit:uranus|ingress|house_9':
      'Urano en ingreso a la Casa 9 inicia un ciclo de renovacion radical en las creencias, la vision del mundo y los caminos de expansion. El periodo puede traer ruptura con dogmas, apertura a filosofias poco convencionales o cambios abruptos en los planes de viaje o formacion. Buena ventana para cuestionar lo que se ha tomado como verdad y abrirse a perspectivas mas amplias y originales.',
    'transit:uranus|ingress|house_11':
      'Urano en ingreso a la Casa 11 inicia un ciclo de renovacion en los grupos sociales, las redes de afinidad y los objetivos colectivos. El periodo puede traer cambios en los circulos de convivencia, entrada en comunidades innovadoras o redefinicion de los ideales que guian el futuro. Buena ventana para conectarse con personas y causas que abren nuevos horizontes y rompen los moldes habituales.',
    'transit:uranus|ingress|house_12':
      'Urano en ingreso a la Casa 12 inicia un ciclo de rupturas y renovaciones en el mundo subjetivo, los procesos inconscientes y lo que ha sido reprimido. El periodo puede traer irrupciones inesperadas de material oculto o insights liberadores sobre patrones limitantes. Buena ventana para trabajar la vida interior con apertura a lo inesperado y sin apego a formas fijas de identidad.',
    'transit:uranus|oposicao|ascendente':
      'Urano en oposicion al Ascendente natal tiende a traer perturbaciones del entorno externo que fuerzan revisiones en la autopercepcion y la forma de presentarse. El periodo puede revelar tension entre la necesidad de libertad individual y las demandas de las relaciones. Buena ventana para percibir donde el entorno senala la necesidad de renovacion en la forma de posicionarse en el mundo.',
    'transit:uranus|oposicao|jupiter':
      'Urano en oposicion a Jupiter natal puede traer exceso de optimismo o expansion descontrolada en areas donde faltan bases solidas. El periodo puede revelar tension entre el deseo de crecimiento rapido y la realidad de los limites existentes. Buena ventana para calibrar el entusiasmo con discernimiento y transformar los impulsos de expansion en planes factibles.',
    'transit:uranus|oposicao|mars':
      'Urano en oposicion a Marte natal puede traer conflictos inesperados, impulsos disruptivos o reacciones de otros que desafian la forma habitual de actuar y afirmarse. El periodo puede revelar tension entre la necesidad de autonomia y las demandas que llegan desde fuera. Buena ventana para trabajar la asertividad con flexibilidad y sin reactividad excesiva.',
    'transit:uranus|oposicao|meio_do_ceu':
      'Urano en oposicion al Medio Cielo natal puede traer cambios abruptos en la trayectoria profesional o la imagen publica, con disrupciones provenientes de areas domesticas o del pasado. El periodo puede revelar tension entre seguridad interior y las exigencias del mundo externo. Buena ventana para revisar las bases del camino y verificar si la direccion publica aun tiene sentido.',
    'transit:uranus|oposicao|moon':
      'Urano en oposicion a la Luna natal puede traer inestabilidad emocional, rupturas en los patrones afectivos o una necesidad urgente de libertad en el campo emocional. El periodo puede revelar tension entre lo familiar y lo nuevo en el mundo interno. Buena ventana para notar donde los patrones afectivos heredados piden renovacion.',
    'transit:uranus|oposicao|neptune':
      'Urano en oposicion a Neptuno natal puede crear disrupciones en el campo de la espiritualidad, la creatividad o las ilusiones con las que se vive. El periodo puede revelar tension entre la necesidad de despertar concreto y el apego a fantasias o estados alterados de conciencia. Buena ventana para trabajar la intuicion con mas discernimiento y sin perder claridad sobre lo real.',
    'transit:uranus|oposicao|pluto':
      'Urano en oposicion a Pluton natal puede traer confrontaciones entre fuerza disruptiva y poder transformador de manera intensa y potencialmente desestabilizadora. El periodo puede revelar tension entre la ruptura abrupta y la transformacion gradual y profunda. Buena ventana para distinguir lo que necesita cambiar rapidamente de lo que necesita un proceso mas lento y profundo.',
    'transit:uranus|oposicao|saturn':
      'Urano en oposicion a Saturno natal crea tension entre el impulso hacia la libertad e innovacion y la necesidad de estructura, limites y responsabilidad. El periodo puede revelar conflicto entre el deseo de romper con lo establecido y lo que aun necesita continuidad. Buena ventana para integrar lo nuevo sin destruir lo que aun sostiene y tiene valor.',
    'transit:uranus|oposicao|sun':
      'Urano en oposicion al Sol natal puede traer disrupciones en la expresion de la identidad, con provocaciones externas que desafian el sentido de quien se es. El periodo puede revelar tension entre la necesidad de autenticidad y las expectativas que llegan desde fuera. Buena ventana para revisar lo que define el nucleo de la identidad y renovar la expresion personal con mas originalidad.',
    'transit:uranus|oposicao|uranus':
      'Urano en oposicion a Urano natal marca el pico del ciclo uraniano, con tension entre quien se ha sido y quien se esta volviendo en el campo de la originalidad y la libertad. El periodo puede traer revisiones abruptas en la direccion de vida y en como se expresa la propia singularidad. Buena ventana para acoger la necesidad de renovacion sin perder el hilo conductor de la trayectoria vivida.',
    'transit:uranus|oposicao|venus':
      'Urano en oposicion a Venus natal puede traer disrupciones inesperadas en las relaciones, la vida afectiva o la relacion con el placer y los valores. El periodo puede revelar tension entre la necesidad de libertad emocional y el apego a formas establecidas de relacionarse. Buena ventana para revisar lo que en las relaciones aun es genuino y lo que necesita renovacion o liberacion.',
    'transit:uranus|quadratura|ascendente':
      'Urano en cuadratura al Ascendente natal puede crear friccion entre la necesidad de renovacion interna y la forma en que esto se expresa o es recibido en el entorno. El periodo puede traer conflictos entre el impulso de ser diferente y las expectativas externas. Buena ventana para trabajar la autenticidad con madurez, sin explosiones que daanen relaciones importantes.',
    'transit:uranus|quadratura|jupiter':
      'Urano en cuadratura a Jupiter natal puede generar exceso e impulsividad, con tendencia a tomar riesgos de forma apresurada o a expandirse sin limites claros. El periodo puede traer friccion entre el optimismo exagerado y la realidad concreta de las consecuencias. Buena ventana para canalizar el entusiasmo con mas discernimiento y sin apuestas que superen lo sostenible.',
    'transit:uranus|quadratura|mars':
      'Urano en cuadratura a Marte natal puede traer impulsividad, reactividad o conflictos inesperados que requieren manejo cuidadoso de la energia asertiva. El periodo puede crear friccion entre el deseo de actuar de forma libre y radical y las demandas de coherencia y consistencia. Buena ventana para trabajar la voluntad con mas equilibrio, canalizando la energia de forma creativa sin perder el foco.',
    'transit:uranus|quadratura|meio_do_ceu':
      'Urano en cuadratura al Medio Cielo natal puede traer disrupciones significativas en la trayectoria profesional, con cambios inesperados que desafian la direccion establecida. El periodo puede crear tension entre el camino publico y las necesidades internas de renovacion y libertad. Buena ventana para revisar los objetivos de carrera y verificar si aun corresponden a lo que impulsa genuinamente el crecimiento.',
    'transit:uranus|quadratura|mercury':
      'Urano en cuadratura a Mercurio natal puede traer pensamiento acelerado, comunicacion disruptiva o cambios abruptos en el campo de las ideas y la informacion. El periodo puede crear friccion entre insights brillantes y la dificultad de implementarlos con consistencia. Buena ventana para canalizar la creatividad intelectual con mas paciencia y sin apresurar conclusiones.',
    'transit:uranus|quadratura|neptune':
      'Urano en cuadratura a Neptuno natal puede crear friccion entre el impulso de despertar y el deseo de permanecer en estados de trascendencia o ilusion. El periodo puede traer confusion entre el insight genuino y la huida creativa de la realidad. Buena ventana para trabajar la espiritualidad y la creatividad con mas claridad y sin perder el anclaje en lo real.',
    'transit:uranus|quadratura|pluto':
      'Urano en cuadratura a Pluton natal puede generar periodos de fuerte tension entre la necesidad de ruptura y el proceso de transformacion profunda, con posibles crisis que fuerzan renovaciones radicales. El periodo puede traer conflicto entre lo que necesita cambiar de inmediato y lo que necesita un proceso mas lento y profundo. Buena ventana para trabajar el cambio con intencionalidad y sin reactividad excesiva.',
    'transit:uranus|quadratura|saturn':
      'Urano en cuadratura a Saturno natal crea friccion entre el impulso de romper con las estructuras y la necesidad de mantener bases, compromisos y continuidad. El periodo puede traer conflicto entre el deseo de libertad total y las responsabilidades concretas que aun deben honrarse. Buena ventana para integrar la innovacion dentro de las estructuras que aun sostienen, sin destruir lo que tiene valor duradero.',
    'transit:uranus|quadratura|uranus':
      'Urano en cuadratura a Urano natal marca una fase de friccion entre la expresion actual de la propia singularidad y lo que aun necesita ser liberado o renovado. El periodo puede traer tension entre quien se ha sido y quien se esta volviendo en el campo de la autenticidad y la libertad. Buena ventana para revisar la propia trayectoria con apertura a lo que necesita reformularse.',
    'transit:uranus|quadratura|venus':
      'Urano en cuadratura a Venus natal puede traer disrupciones inesperadas en las relaciones o la vida afectiva, con necesidad de revisar las formas habituales de amar y valorar. El periodo puede crear friccion entre la necesidad de libertad emocional y los apegos afectivos establecidos. Buena ventana para cuestionar lo que en las relaciones aun nutre de verdad y lo que necesita renovacion.',
    'transit:uranus|sextil|ascendente':
      'Urano en sextil al Ascendente natal favorece la renovacion en la forma de presentarse al mundo, con apertura a cambios que expresan la singularidad de forma mas autentica. El ciclo facilita ajustes creativos en la autoimagen y en la forma de interactuar con el entorno. Buen momento para experimentar nuevas formas de posicionarse sin el peso de las expectativas habituales.',
    'transit:uranus|sextil|jupiter':
      'Urano en sextil a Jupiter natal favorece la expansion creativa, la apertura a nuevas perspectivas y las oportunidades que llegan de forma inesperada pero receptiva. El ciclo facilita combinaciones de optimismo e innovacion que abren caminos poco comunes. Buen momento para apostar por proyectos originales con optimismo calibrado y apertura a lo improbable.',
    'transit:uranus|sextil|meio_do_ceu':
      'Urano en sextil al Medio Cielo natal favorece innovaciones en la carrera, apertura a nuevas direcciones profesionales y la capacidad de destacarse por la originalidad. El ciclo facilita cambios creativos en la trayectoria que llegan con mas fluidez que friccion. Buen momento para presentar ideas innovadoras, explorar nuevas funciones o reposicionar la imagen profesional.',
    'transit:uranus|sextil|neptune':
      'Urano en sextil a Neptuno natal favorece la combinacion creativa de intuicion e innovacion, con insights que unen lo concreto y lo trascendente de forma productiva. El ciclo facilita creatividad expansiva, espiritualidad renovada y percepciones que abren nuevas posibilidades. Buen momento para trabajar proyectos creativos o espirituales con apertura a lo inesperado y lo inspirador.',
    'transit:uranus|sextil|pluto':
      'Urano en sextil a Pluton natal favorece transformaciones creativas que llegan con renovacion genuina y sin las fricciones de los aspectos de tension. El ciclo facilita cambios profundos que se integran con mas fluidez e intencionalidad. Buen momento para consolidar transformaciones que estaban en curso e innovar en areas donde el poder y la renovacion se encuentran.',
    'transit:uranus|sextil|saturn':
      'Urano en sextil a Saturno natal favorece la integracion creativa de innovacion y estructura, con capacidad de traer lo nuevo sin destruir lo que aun sostiene. El ciclo facilita reformas consistentes, cambios planificados y la renovacion de estructuras con mas habilidad y menos resistencia. Buen momento para modernizar lo que ya existe con creatividad y responsabilidad.',
    'transit:uranus|sextil|sun':
      'Urano en sextil al Sol natal favorece la renovacion de la expresion personal, la apertura a nuevas formas de existir y la capacidad de innovar en la manera de presentarse al mundo. El ciclo facilita la experimentacion, la autenticidad y el descubrimiento de aspectos originales de la propia identidad. Buen momento para expresar quien se es de formas poco comunes y acoger lo singular sin resistencia.',
    'transit:uranus|sextil|uranus':
      'Urano en sextil a Urano natal favorece momentos de renovacion en la expresion de la propia singularidad, con apertura a lo nuevo y capacidad de integrar cambios con fluidez. El ciclo facilita ajustes creativos en la trayectoria de vida que llegan con mas facilidad que imposicion. Buen momento para acoger lo inesperado y transformar lo diferente en recurso productivo.',
    'transit:uranus|trigono|ascendente':
      'Urano en trigono al Ascendente natal favorece la renovacion fluida en la forma de presentarse e interactuar con el mundo, con expresion de la singularidad que es bien recibida por el entorno. El ciclo facilita cambios creativos en la autoimagen y en la forma de iniciar contactos. Buen momento para experimentar nuevos roles sociales y presentar versiones mas autenticas y originales de uno mismo.',
    'transit:uranus|trigono|jupiter':
      'Urano en trigono a Jupiter natal favorece la expansion creativa y la apertura a oportunidades innovadoras que llegan de forma inesperada y receptiva. El ciclo facilita el crecimiento por caminos originales, con combinacion productiva de entusiasmo y apertura a lo nuevo. Buen momento para apostar por proyectos que se alejan de lo convencional y cosechar los frutos de cambios anteriores.',
    'transit:uranus|trigono|meio_do_ceu':
      'Urano en trigono al Medio Cielo natal favorece innovaciones en la carrera y la trayectoria publica que llegan con fluidez y apertura. El ciclo facilita nuevas direcciones profesionales, expresion de originalidad en el trabajo y apertura a posiciones que valoran la singularidad. Buen momento para renovar la direccion profesional de forma creativa y sin resistencias significativas.',
    'transit:uranus|trigono|neptune':
      'Urano en trigono a Neptuno natal favorece la union creativa de intuicion e innovacion, con insights que conectan lo concreto y lo trascendente de forma fluida. El ciclo facilita creatividad ampliada, espiritualidad renovada y percepciones que abren horizontes inesperados. Buen momento para trabajar proyectos que combinan sensibilidad y originalidad con apertura genuina.',
    'transit:uranus|trigono|pluto':
      'Urano en trigono a Pluton natal favorece transformaciones profundas y creativas que llegan con mas fluidez que en los aspectos de tension. El ciclo facilita renovaciones estructurales significativas que son bien integradas y constructivas. Buen momento para consolidar cambios surgidos de procesos transformadores e innovar en areas de poder y renovacion con intencion clara.',
    'transit:uranus|trigono|saturn':
      'Urano en trigono a Saturno natal favorece la integracion fluida de innovacion y estructura, con capacidad de renovar lo establecido sin romper lo que aun sostiene. El ciclo facilita reformas creativas, modernizacion de estructuras y cambios que llegan con menos resistencia que lo habitual. Buen momento para traer lo nuevo con consistencia e innovar dentro de limites que aun tienen sentido.',
    'transit:uranus|trigono|sun':
      'Urano en trigono al Sol natal favorece la renovacion de la expresion personal y el descubrimiento de formas mas autenticas y originales de existir y afirmarse en el mundo. El ciclo facilita la experimentacion creativa, innovaciones en la identidad y expresion de lo singular sin fricciones significativas. Buen momento para explorar nuevas dimensiones de quien se es y acoger lo diferente y genuino.',
    'transit:uranus|trigono|uranus':
      'Urano en trigono a Urano natal favorece momentos de renovacion fluida en la expresion de la propia singularidad, con integracion natural de los cambios que llegan. El ciclo facilita ajustes creativos en la trayectoria de vida que son bien recibidos e integrados. Buen momento para avanzar hacia lo autentico y original, con menos resistencia y mas apertura.',

    // Neptuno — entradas faltantes
    'transit:neptune|conjuncao|pluto':
      'Neptuno en conjuncion a Pluton natal crea una confluencia entre disolucion y transformacion profunda, pudiendo traer cambios lentos y penetrantes en areas de renovacion y poder. El periodo puede intensificar la sensibilidad a lo que se destruye y recrea en las profundidades de la vida. Un ciclo de apertura a lo trascendente en el contexto de transformaciones estructurales, con posibilidad de renovacion espiritual significativa.',
    'transit:neptune|conjuncao|uranus':
      'Neptuno en conjuncion a Urano natal crea una confluencia entre disolucion e impulso de ruptura, generando sensibilidad ampliada hacia lo que necesita liberarse de forma creativa e imprevisible. El periodo puede traer inspiraciones inesperadas, insights que combinan lo trascendente y lo innovador, o confusion ante cambios que no tienen forma definida. Un ciclo de apertura a lo nuevo con fluidez y sin necesidad de control excesivo.',
    'transit:neptune|ingress|house_2':
      'Neptuno en ingreso a la Casa 2 inicia un ciclo de disolucion de los limites entre lo material y lo espiritual, con posibilidad de confusion financiera o de inspiracion creativa generadora de recursos. El periodo invita a revisar la relacion con la seguridad material y con los valores que sostienen la vida. Buena ventana para construir una relacion mas fluida con el dinero e identificar lo que tiene valor genuino mas alla de lo tangible.',
    'transit:neptune|ingress|house_4':
      'Neptuno en ingreso a la Casa 4 inicia un ciclo de sensibilizacion de la vida domestica, familiar y del mundo interior. El periodo puede traer idealizacion de la familia, confusion sobre lo que constituye el hogar, o apertura a una vida intima mas espiritual y porosa. Buena ventana para disolver patrones familiares rigidos y crear un ambiente de vida mas permeable a lo sutil y nutritivo.',
    'transit:neptune|ingress|house_6':
      'Neptuno en ingreso a la Casa 6 inicia un ciclo de sensibilidad aumentada en la rutina, el trabajo y los habitos de salud. El periodo puede traer confusion en el cotidiano, dificultad para mantener horarios o, positivamente, una orientacion mas dedicada y espiritualizada en el trabajo. Buena ventana para introducir practicas de cuidado que integren lo fisico y lo sutil, como meditacion, arte terapeutico o servicio con donacion genuina.',
    'transit:neptune|ingress|house_7':
      'Neptuno en ingreso a la Casa 7 inicia un ciclo de idealizacion y sensibilidad en las relaciones intimas y las asociaciones. El periodo puede traer vinculos con fuerte carga romantica, confusion sobre los limites en las relaciones o el desarrollo de empatia profunda con los demas. Buena ventana para cultivar relaciones con mas presencia y cuidado, discerniendo lo genuino de lo proyectado idealmente.',
    'transit:neptune|ingress|house_8':
      'Neptuno en ingreso a la Casa 8 inicia un ciclo de disolucion de las fronteras entre el yo y el otro en el campo de la intimidad, los recursos compartidos y lo que esta oculto. El periodo puede traer sensibilidad ampliada hacia lo intangible en los intercambios profundos, o confusion en relaciones financieras y emocionales de gran carga. Buena ventana para profundizar la espiritualidad en contacto con los ciclos de perdida, transformacion y renovacion.',
    'transit:neptune|ingress|house_9':
      'Neptuno en ingreso a la Casa 9 inicia un ciclo de espiritualidad ampliada, apertura a lo trascendente y sensibilidad elevada en las creencias y la vision del mundo. El periodo puede traer devocion a practicas espirituales, apertura al misticismo y sincretismo, o confusion entre fe genuina y escapismo doctrinal. Buena ventana para explorar lo sagrado con apertura y construir una cosmovision que integre lo sutil y lo vivido.',
    'transit:neptune|ingress|house_11':
      'Neptuno en ingreso a la Casa 11 inicia un ciclo de idealizacion y sensibilidad en los grupos sociales, las redes de afinidad y los objetivos colectivos. El periodo puede traer inspiracion para causas humanitarias, confusion sobre donde se pertenece socialmente, o conexiones profundas con comunidades creativas y espirituales. Buena ventana para distinguir grupos que nutren genuinamente de los que ofrecen solo la ilusion de pertenencia.',
    'transit:neptune|oposicao|ascendente':
      'Neptuno en oposicion al Ascendente natal puede crear confusion en la autopercepcion y en la forma en que se es visto por los demas, con tendencia a disolver los contornos de la identidad publica. El periodo puede revelar tension entre la necesidad de claridad sobre quien se es y la disolucion de los limites personales. Buena ventana para trabajar los limites de forma mas consciente y distinguir lo genuino de lo que es proyeccion del entorno.',
    'transit:neptune|oposicao|jupiter':
      'Neptuno en oposicion a Jupiter natal puede amplificar la tendencia al exceso de optimismo, las creencias sin fundamento real o la expansion por caminos ilusorios. El periodo puede revelar tension entre el deseo de crecimiento y la disolucion de las bases que lo sustentarian. Buena ventana para distinguir fe genuina de ingenuidad y verificar si los proyectos de expansion tienen sustancia concreta.',
    'transit:neptune|oposicao|mars':
      'Neptuno en oposicion a Marte natal puede disolver la claridad en la accion, generando confusion sobre lo que se quiere o dificultad para actuar con direccion y fuerza definidas. El periodo puede revelar tension entre el deseo de actuar y la neblina que envuelve las motivaciones. Buena ventana para investigar lo que de verdad motiva las acciones y para actuar con mas discernimiento sobre cuando avanzar y cuando esperar.',
    'transit:neptune|oposicao|meio_do_ceu':
      'Neptuno en oposicion al Medio Cielo natal puede crear confusion sobre la direccion profesional o la imagen publica, con tendencia a la disolucion de los contornos de la identidad de carrera. El periodo puede revelar tension entre la trayectoria externa y un llamado mas espiritual o subjetivo que emerge del interior. Buena ventana para escuchar lo que el mundo interno pide y reorientar la vida publica de forma mas alineada con lo profundo y genuino.',
    'transit:neptune|oposicao|mercury':
      'Neptuno en oposicion a Mercurio natal puede crear confusion en el pensamiento, las comunicaciones y la forma de procesar informacion. El periodo puede traer malentendidos, dificultad de concentracion o una sensibilidad elevada que hace el discernimiento mas desafiante. Buena ventana para practicar la verificacion cuidadosa de la informacion y distinguir intuicion genuina de fantasia proyectada.',
    'transit:neptune|oposicao|moon':
      'Neptuno en oposicion a la Luna natal puede traer hipersensibilidad emocional, confusion en los patrones afectivos o disolucion de las fronteras entre el propio mundo interno y el de los demas. El periodo puede revelar tension entre las necesidades afectivas reales y lo que se idealiza o proyecta. Buena ventana para identificar donde la emocion esta en contacto con lo genuino y donde esta coloreada por fantasia o expectativa.',
    'transit:neptune|oposicao|neptune':
      'Neptuno en oposicion a Neptuno natal marca un momento de tension entre lo que se ha construido en el campo de la espiritualidad y la creatividad y lo que aun no ha encontrado forma. El periodo puede traer revisiones en las creencias, los ideales y la relacion con lo trascendente. Buena ventana para evaluar que ilusiones ya cumplieron su papel y que visiones merecen ser alimentadas con mas claridad e intencion.',
    'transit:neptune|oposicao|pluto':
      'Neptuno en oposicion a Pluton natal crea tension entre disolucion y poder transformador, pudiendo generar confusion sobre procesos que exigen claridad y decision definitiva. El periodo puede revelar en que medida el campo espiritual o creativo esta siendo infiltrado por dinamicas de poder no reconocidas. Buena ventana para distinguir la entrega genuina de la huida y trabajar con lo que se transforma sin perder el contacto con la realidad.',
    'transit:neptune|oposicao|saturn':
      'Neptuno en oposicion a Saturno natal crea tension entre disolucion y estructura, con posible friccion entre el deseo de trascender los limites y la necesidad de orden y responsabilidad. El periodo puede revelar donde las ilusiones estan erosionando lo que deberia sostenerse con rigor. Buena ventana para verificar si lo que se llama espiritualidad es realmente un camino de crecimiento o una forma de evitar lo que necesita construirse.',
    'transit:neptune|oposicao|sun':
      'Neptuno en oposicion al Sol natal puede crear confusion en la identidad, con tendencia a disolver los contornos del sentido de quien se es ante las expectativas y proyecciones del entorno. El periodo puede revelar tension entre la propia voluntad y lo que el ambiente proyecta o espera. Buena ventana para practicar mayor claridad sobre quien se es de verdad, distinguiendo el nucleo autentico de las impresiones que llegan desde fuera.',
    'transit:neptune|oposicao|uranus':
      'Neptuno en oposicion a Urano natal crea tension entre el impulso de despertar y renovar y la tendencia a la disolucion y la confusion. El periodo puede revelar donde el deseo de libertad esta siendo saboteado por la ilusion o donde la trascendencia se usa como fuga de la realidad. Buena ventana para integrar creatividad y renovacion con mas claridad sobre lo que es genuinamente nuevo y lo que es meramente fantasioso.',
    'transit:neptune|oposicao|venus':
      'Neptuno en oposicion a Venus natal puede idealizar las relaciones, creando expectativas que superan lo que los vinculos reales pueden ofrecer. El periodo puede revelar tension entre el amor romantico idealizado y los vinculos concretos con sus imperfecciones y limites. Buena ventana para apreciar lo que las relaciones genuinamente ofrecen y cultivar el afecto con mas presencia y menos proyeccion.',
    'transit:neptune|quadratura|ascendente':
      'Neptuno en cuadratura al Ascendente natal puede crear confusion sobre la identidad publica y la forma en que se es percibido por el entorno. El periodo puede traer dificultad para establecer limites claros entre el propio mundo interno y lo que el ambiente proyecta. Buena ventana para trabajar la claridad en la autopresentacion e identificar donde la identidad esta siendo diluida por expectativas externas.',
    'transit:neptune|quadratura|jupiter':
      'Neptuno en cuadratura a Jupiter natal puede amplificar el optimismo hasta perder el contacto con lo factible, con tendencia a expandirse por caminos nebulosos o a creer en proyectos sin fundamentacion real. El periodo puede crear friccion entre el deseo de crecimiento y la falta de claridad sobre los medios. Buena ventana para verificar si las expansiones planeadas tienen sustancia concreta y calibrar la fe con discernimiento practico.',
    'transit:neptune|quadratura|mars':
      'Neptuno en cuadratura a Marte natal puede crear friccion entre la voluntad de actuar y la confusion sobre lo que realmente se quiere o debe hacer. El periodo puede traer desgaste por la accion en direcciones vagas, dificultad para mantener el foco asertivo o energia que se dispersa antes de alcanzar el objetivo. Buena ventana para fortalecer la claridad de intencion antes de actuar y distinguir el impulso genuino de la reactividad que busca escapar.',
    'transit:neptune|quadratura|meio_do_ceu':
      'Neptuno en cuadratura al Medio Cielo natal puede crear confusion en la direccion profesional, con idealizacion del rol publico o dificultad para discernir el camino mas alineado con las capacidades reales. El periodo puede traer friccion entre lo que se desea ser en la vida publica y lo que el mundo efectivamente demanda. Buena ventana para alinear ambiciones con lo concreto y alcanzable, sin perder el sueno que ancla la direccion.',
    'transit:neptune|quadratura|mercury':
      'Neptuno en cuadratura a Mercurio natal puede crear confusion en el pensamiento, malentendidos en la comunicacion y dificultad para mantener el razonamiento logico de forma consistente. El periodo puede traer desinformacion, pensamiento magico o dificultad para discernir lo real de lo proyectado. Buena ventana para verificar la informacion con rigor y distinguir la intuicion creativa del ensonamiento sin sustancia.',
    'transit:neptune|quadratura|neptune':
      'Neptuno en cuadratura a Neptuno natal crea friccion entre el ideal espiritual o creativo que se cultiva y lo que aun no ha encontrado expresion autentica. El periodo puede revelar donde las creencias e ideales necesitan revision y donde la ilusion ha sido confundida con vision genuina. Buena ventana para confrontar honestamente lo que es aspiracion real y lo que es solo fantasia confortable.',
    'transit:neptune|quadratura|pluto':
      'Neptuno en cuadratura a Pluton natal crea friccion entre disolucion y poder transformador, pudiendo generar confusion en procesos de transformacion que exigen claridad sobre lo que debe liberarse. El periodo puede revelar donde la espiritualidad o la creatividad se usa para evitar el enfrentamiento con lo que necesita cambiar de forma mas definitiva. Buena ventana para trabajar la transformacion sin huir de lo que implica concretamente.',
    'transit:neptune|quadratura|sun':
      'Neptuno en cuadratura al Sol natal puede crear friccion entre la expresion de la identidad y la tendencia a disolver los contornos del sentido de quien se es. El periodo puede traer confusion sobre los propios objetivos, dificultad para mantener la direccion o la sensacion de que el camino se disuelve antes de ser recorrido. Buena ventana para fortalecer el contacto con lo genuinamente propio y actuar desde esa base con mas claridad y consistencia.',
    'transit:neptune|quadratura|uranus':
      'Neptuno en cuadratura a Urano natal crea friccion entre disolucion y ruptura, pudiendo generar confusion en areas donde lo inesperado y lo intangible se combinan. El periodo puede revelar donde la necesidad de libertad se vive de forma caotica o donde la creatividad esta perdiendo el hilo conductor. Buena ventana para canalizar el impulso de renovacion con mas intencionalidad y sin dispersion.',
    'transit:neptune|sextil|ascendente':
      'Neptuno en sextil al Ascendente natal favorece sensibilidad elevada en la forma de presentarse al mundo, con capacidad de adaptar la expresion a diferentes contextos con empatia y fluidez. El ciclo facilita apertura, receptividad y una presencia que toca genuinamente a los demas. Buen momento para explorar formas mas creativas e intuitivas de posicionarse en el mundo sin perder la sustancia de quien se es.',
    'transit:neptune|sextil|jupiter':
      'Neptuno en sextil a Jupiter natal favorece la expansion por caminos espirituales, creativos o inspirados por la intuicion y la fe en algo mayor. El ciclo facilita el crecimiento en areas que combinan apertura e imaginacion con generosidad y sentido de proposito. Buen momento para invertir en estudios esotericos, proyectos creativos de gran vision o actividades que combinan desarrollo personal y contribucion colectiva.',
    'transit:neptune|sextil|mars':
      'Neptuno en sextil a Marte natal favorece la accion inspirada, con capacidad de actuar desde una motivacion mas sutil y alineada con lo que se siente como verdadero y urgente. El ciclo facilita proyectos creativos, artisticos o espirituales que requieren energia dirigida con intencion. Buen momento para actuar desde valores profundos y encontrar la fuerza en algo que va mas alla del interes inmediato.',
    'transit:neptune|sextil|meio_do_ceu':
      'Neptuno en sextil al Medio Cielo natal favorece vocaciones creativas, espirituales o humanitarias en la vida profesional, con apertura a caminos que combinan sensibilidad y contribucion. El ciclo facilita el reconocimiento publico proveniente de actividades que tocan genuinamente a las personas. Buen momento para explorar direcciones profesionales que integren lo sutil, lo artistico o el cuidado del otro como parte central del trabajo.',
    'transit:neptune|sextil|mercury':
      'Neptuno en sextil a Mercurio natal favorece la imaginacion creativa, la comunicacion poetica y la capacidad de intuir lo que esta mas alla de lo literal y lo logico. El ciclo facilita la escritura creativa, el pensamiento simbolico y la expresion que conecta lo consciente con lo mas sutil. Buen momento para trabajar con el lenguaje de forma mas expresiva, escribir, crear o comunicar desde la intuicion y la sensibilidad.',
    'transit:neptune|sextil|moon':
      'Neptuno en sextil a la Luna natal favorece la sensibilidad emocional ampliada, la intuicion afectiva y la receptividad hacia lo sutil en las relaciones y el mundo interno. El ciclo facilita la empatia genuina, la creatividad nutrida por las emociones y una relacion mas fluida con el propio mundo afectivo. Buen momento para cultivar practicas que conecten lo emocional y lo espiritual, como meditacion, arte expresivo o trabajo con los suenos.',
    'transit:neptune|sextil|neptune':
      'Neptuno en sextil a Neptuno natal favorece un momento de apertura a lo trascendente con fluidez y sin las tensiones de los aspectos de mayor friccion. El ciclo facilita la espiritualidad, la creatividad y la conexion con lo intangible de forma nutritiva y productiva. Buen momento para profundizar practicas espirituales, expandir la sensibilidad artistica y trabajar con lo que inspira sin perder el contacto con lo concreto.',
    'transit:neptune|sextil|pluto':
      'Neptuno en sextil a Pluton natal favorece la transformacion que se profundiza a traves de lo espiritual, con capacidad de acceder a lo oculto de forma creativa y reveladora. El ciclo facilita la renovacion que surge de capas mas profundas del ser, con apertura a lo trascendente en el proceso de cambio. Buen momento para trabajar el inconsciente, el arte o la espiritualidad como vias genuinas de transformacion.',
    'transit:neptune|sextil|saturn':
      'Neptuno en sextil a Saturno natal favorece la combinacion creativa de sensibilidad y estructura, con capacidad de dar forma a lo inspirado sin perder la disciplina necesaria para concretarlo. El ciclo facilita proyectos que combinan vision y realizacion, con apertura a lo sutil dentro de formas que sostienen. Buen momento para trabajar el arte, la espiritualidad o el cuidado con la consistencia que hace la vision realizable.',
    'transit:neptune|sextil|sun':
      'Neptuno en sextil al Sol natal favorece una expresion personal mas sensible, creativa y conectada con algo mayor que el ego inmediato. El ciclo facilita un sentido de proposito que involucra contribucion, belleza o trascendencia, con apertura a formas mas fluidas de ser quien se es. Buen momento para explorar como la identidad puede expresarse a traves de vias artisticas, espirituales o de servicio.',
    'transit:neptune|sextil|uranus':
      'Neptuno en sextil a Urano natal favorece la combinacion creativa de intuicion e innovacion, con insights que llegan de formas inesperadas pero productivas y facilmente aprovechadas. El ciclo facilita la apertura a lo nuevo con mas receptividad y menos ruptura. Buen momento para trabajar proyectos originales con sensibilidad y dejar que la inspiracion guie la creatividad sin necesidad de control excesivo.',
    'transit:neptune|sextil|venus':
      'Neptuno en sextil a Venus natal favorece la sensibilidad estetica elevada, el afecto idealizado de forma productiva y la apertura a lo bello y nutritivo en las relaciones y la creatividad. El ciclo facilita el amor que se expresa con gentileza, el arte que nace de la emocion y las conexiones afectivas permeadas de complicidad. Buen momento para cultivar lo bello, afectivo e inspirado con apertura y presencia genuina.',
    'transit:neptune|trigono|ascendente':
      'Neptuno en trigono al Ascendente natal favorece la sensibilidad elevada en la forma de presentarse al mundo, con fluidez, empatia y una presencia que toca genuinamente a los demas. El ciclo facilita la expresion mas creativa e intuitiva de la identidad, con apertura a mostrar vulnerabilidad sin perder sustancia. Buen momento para dejar que la sensibilidad sea parte visible de quien se es, con apertura y confianza.',
    'transit:neptune|trigono|jupiter':
      'Neptuno en trigono a Jupiter natal favorece la expansion espiritual, creativa y humanitaria con fluidez y sentido de proposito. El ciclo facilita el crecimiento por caminos que combinan fe, imaginacion y apertura a lo que es mayor que el yo. Buen momento para invertir en proyectos de gran vision, practicas espirituales y actividades que conectan el desarrollo personal con la contribucion colectiva.',
    'transit:neptune|trigono|mars':
      'Neptuno en trigono a Marte natal favorece la accion inspirada, con capacidad de actuar desde motivaciones profundas alineadas con valores espirituales o creativos. El ciclo facilita proyectos artisticos, humanitarios o espirituales que requieren energia dirigida e intencion clara. Buen momento para actuar desde lo que se siente como verdadero y encontrar la fuerza en algo que va mas alla del interes inmediato.',
    'transit:neptune|trigono|meio_do_ceu':
      'Neptuno en trigono al Medio Cielo natal favorece la expresion de vocaciones creativas, espirituales o humanitarias en la trayectoria profesional con fluencia y reconocimiento. El ciclo facilita direcciones de carrera que integran sensibilidad, arte y cuidado del otro de forma productiva y bien recibida. Buen momento para avanzar en caminos que combinan lo sutil y lo profesional con naturalidad y satisfaccion genuina.',
    'transit:neptune|trigono|mercury':
      'Neptuno en trigono a Mercurio natal favorece la imaginacion creativa, la comunicacion poetica y la intuicion que conecta lo consciente con lo mas sutil y simbolico. El ciclo facilita la escritura creativa, el pensamiento imaginativo y la expresion que va mas alla de lo literal con fluidez. Buen momento para trabajar con el lenguaje de forma mas expresiva y comunicar desde la intuicion con apertura y naturalidad.',
    'transit:neptune|trigono|moon':
      'Neptuno en trigono a la Luna natal favorece la sensibilidad emocional profunda, la intuicion afectiva y la receptividad que acoge lo sutil en el mundo interno y en las relaciones. El ciclo facilita la empatia genuina, la creatividad alimentada por las emociones y la conexion con lo bello y trascendente en el campo afectivo. Buen momento para cultivar practicas que integren lo emocional y lo espiritual con fluidez y apertura.',
    'transit:neptune|trigono|neptune':
      'Neptuno en trigono a Neptuno natal favorece un momento de apertura a lo trascendente con fluidez natural y sin resistencia. El ciclo facilita la espiritualidad, la creatividad y la conexion con lo intangible de forma productiva y bien integrada. Buen momento para profundizar practicas espirituales, expandir la sensibilidad artistica y dejar que lo que inspira se exprese con mas libertad y naturalidad.',
    'transit:neptune|trigono|pluto':
      'Neptuno en trigono a Pluton natal favorece la transformacion profunda mediada por la sensibilidad espiritual y la apertura a lo trascendente. El ciclo facilita el acceso a lo que estaba oculto de forma mas fluida y sin los attriti de los aspectos de tension. Buen momento para trabajar el inconsciente, el arte o la espiritualidad como vias genuinas de transformacion con sentido de proposito.',
    'transit:neptune|trigono|saturn':
      'Neptuno en trigono a Saturno natal favorece la combinacion fluida de sensibilidad y estructura, con capacidad de dar forma a lo inspirado de manera consistente y duradera. El ciclo facilita proyectos que combinan vision y realizacion, con apertura a lo trascendente dentro de formas que sostienen. Buen momento para trabajar el arte, la espiritualidad o el cuidado con la consistencia que hace la vision realizable.',
    'transit:neptune|trigono|sun':
      'Neptuno en trigono al Sol natal favorece una expresion personal mas sensible, creativa y conectada con algo mayor que el ego inmediato, con fluidez y naturalidad. El ciclo facilita un sentido de proposito que involucra contribucion, belleza o trascendencia, de forma bien integrada y nutritiva. Buen momento para explorar como la identidad puede expresarse a traves de vias artisticas, espirituales o de servicio, con apertura y confianza.',
    'transit:neptune|trigono|uranus':
      'Neptuno en trigono a Urano natal favorece la combinacion creativa de intuicion e innovacion, con insights que llegan de formas inesperadas pero fluidas y bien integradas. El ciclo facilita la apertura a lo nuevo con receptividad y sin ruptura excesiva. Buen momento para trabajar proyectos originales con sensibilidad y dejar que la inspiracion guie la creatividad con naturalidad y produccion genuina.',
    'transit:neptune|trigono|venus':
      'Neptuno en trigono a Venus natal favorece la sensibilidad estetica elevada, el afecto que se expresa con belleza y la apertura a lo nutritivo en las relaciones y la creatividad. El ciclo facilita el amor que incluye dimensiones espirituales, el arte que nace de la emocion y las conexiones afectivas permeadas de complicidad e inspiracion. Buen momento para cultivar lo bello, afectivo e inspirado con presencia genuina y fluidez.',
    // Pluton — entradas faltantes
    'transit:pluto|conjuncao|ascendente':
      'Pluton en conjuncion al Ascendente natal inicia una transformacion de la forma de presentarse y ser percibido, haciendo cada vez mas dificil sostener una identidad que no corresponda a lo que esta emergiendo internamente. Esta fase puede traer presencia mas intensa, pero tambien confrontacion con lo que fue construido como mascara social a lo largo del tiempo. Que en tu forma de presentarte al mundo ya no eres tu y necesita deshacerse para dar espacio a quien te estas convirtiendo?',
    'transit:pluto|conjuncao|jupiter':
      'Pluton en conjuncion a Jupiter natal amplifica los impulsos de crecimiento y expansion con una profundidad que puede servir tanto a proyectos de largo alcance como a busquedas de poder sin base real. Esta fase suele revelar donde la ambicion es genuina y donde es solo la necesidad de ocupar espacio o controlar resultados. Que quieres expandir que tiene base genuina, y que estas buscando por necesidad de seguridad disfrazada de crecimiento?',
    'transit:pluto|conjuncao|mercury':
      'Pluton en conjuncion a Mercurio natal profundiza el modo de pensar, investigar y comunicar, con menor tolerancia para respuestas superficiales o verdades parciales. Esta fase tiende a intensificar el razonamiento investigativo y hace mas dificil aceptar explicaciones que no llegan al fondo del asunto. Que narrativa sobre ti mismo o sobre tu situacion has mantenido sin cuestionarla con la profundidad que exige?',
    'transit:pluto|conjuncao|moon':
      'Pluton en conjuncion a la Luna natal transforma el mundo emocional desde adentro, trayendo a la superficie patrones afectivos heredados que pedian ser revisados o cerrados. Esta fase puede intensificar necesidades de seguridad y al mismo tiempo mostrar que las formas habituales de obtenerla ya no funcionan. Que en tu vida emocional has evitado revisitar que ahora esta pidiendo atencion?',
    'transit:pluto|conjuncao|neptune':
      'Pluton en conjuncion a Neptuno natal transforma la vida espiritual, creativa y la relacion con lo trascendente de forma profunda y potencialmente desestabilizadora de las ilusiones anteriores. El periodo puede traer confrontacion con lo que era fantasia o escapismo, abriendo espacio para una espiritualidad mas autentica y menos idealizada. Un momento de transformacion en el campo de lo sagrado y lo imaginativo, con disolucion de lo que no era genuino.',
    'transit:pluto|conjuncao|uranus':
      'Pluton en conjuncion a Urano natal combina transformacion profunda e impulso de ruptura en un ciclo de cambios radicales y potencialmente irreversibles. El periodo puede traer rupturas abruptas de estructuras antiguas que ya no podian contener lo que necesitaba expresarse. Un momento de transformacion que ocurre por rupturas, con potencial de liberacion de patrones que bloqueaban la renovacion necesaria.',
    'transit:pluto|conjuncao|venus':
      'Pluton en conjuncion a Venus natal transforma la vida afectiva y los propios valores, haciendo mas dificil sostener relaciones o acuerdos que no correspondan a lo que genuinamente se desea. Esta fase puede traer vinculos de gran intensidad o revelaciones sobre lo que realmente importa — con menos tolerancia hacia lo habitual pero no satisfactorio. Que sigues valorando por miedo a perder algo que ya perdio su sentido real para ti?',
    'transit:pluto|ingress|house_1':
      'Pluton en ingreso a la Casa 1 inicia un ciclo de transformacion radical de la identidad, la autoimagen y la forma de posicionarse en el mundo. El periodo puede traer una presencia mas intensa y magnetica, confrontacion con las propias sombras y necesidad de reconstruir quien se es desde algo mas profundo y autentico. Una buena ventana para iniciar un trabajo de autodescubrimiento real, eliminando lo que era mascara y cultivando lo que es sustancia.',
    'transit:pluto|ingress|house_2':
      'Pluton en ingreso a la Casa 2 inicia un ciclo de transformacion profunda en la vida financiera, los valores y la relacion con la seguridad material. El periodo puede traer crisis o reorganizaciones radicales en los recursos, revelando lo que verdaderamente sustenta la vida y lo que era sostenido por miedo o apego. Una buena ventana para reconstruir la relacion con el dinero y la abundancia desde valores mas autenticos y transformados.',
    'transit:pluto|ingress|house_3':
      'Pluton en ingreso a la Casa 3 inicia un ciclo de transformacion profunda en la forma de pensar, comunicar y percibir el entorno inmediato. El periodo puede traer intensidad en las relaciones con hermanos y vecinos, cambios radicales en los estudios o la comunicacion, y necesidad de ir al fondo de las cuestiones en vez de permanecer en la superficie. Una buena ventana para transformar el modo de procesar y expresar lo que es pensado.',
    'transit:pluto|ingress|house_5':
      'Pluton en ingreso a la Casa 5 inicia un ciclo de transformacion en la expresion creativa, los romances y la relacion con el placer y la autenticidad. El periodo puede traer intensidad en las experiencias afectivas y creativas, revelaciones sobre lo que verdaderamente nutre el juego y la alegria, o confrontacion con patrones de dependencia en el campo afectivo. Una buena ventana para renovar la relacion con la creatividad y con lo que se ama de forma mas profunda y genuina.',
    'transit:pluto|ingress|house_6':
      'Pluton en ingreso a la Casa 6 inicia un ciclo de transformacion profunda en la rutina, el trabajo y los habitos de salud. El periodo puede traer crisis o reorganizaciones radicales en el cotidiano, confrontacion con dinamicas de poder en el entorno laboral o necesidad de transformar habitos que perjudican el bienestar. Una buena ventana para renovar el modo de servir, de organizar la vida practica y de cuidar la salud con mas intencionalidad.',
    'transit:pluto|ingress|house_7':
      'Pluton en ingreso a la Casa 7 inicia un ciclo de transformacion profunda en las asociaciones intimas y los vinculos de larga duracion. El periodo puede traer revelaciones sobre lo que esta oculto en las relaciones, dinamicas de poder y control, o necesidad de reconstruir los cimientos de los relacionamientos mas importantes. Una buena ventana para transformar la forma de relacionarse, eliminando lo que era ilusion y profundizando lo que es genuino.',
    'transit:pluto|ingress|house_8':
      'Pluton en ingreso a la Casa 8 inicia un ciclo de intensificacion de los temas de transformacion, intimidad, muerte, herencia y recursos compartidos. El periodo puede traer confrontacion con lo que es mas profundo y sombrio en la psique, revelaciones en areas de intimidad y poder, o transformaciones radicales en lo que se comparte con el otro. Una buena ventana para profundizar el trabajo psicologico y para renovar la forma de tratar lo que exige entrega total.',
    'transit:pluto|ingress|house_9':
      'Pluton en ingreso a la Casa 9 inicia un ciclo de transformacion profunda en las creencias, la vision del mundo y los sistemas filosoficos o religiosos que sustentan la vida. El periodo puede traer crisis de fe, confrontacion con dogmas o renovacion radical de la cosmovision. Una buena ventana para ir al fondo de las cuestiones de sentido y para construir una filosofia de vida mas autentica, eliminando lo que era creencia heredada sin examen.',
    'transit:pluto|ingress|house_11':
      'Pluton en ingreso a la Casa 11 inicia un ciclo de transformacion en los grupos sociales, las redes de afinidad y los objetivos colectivos. El periodo puede traer revelaciones sobre dinamicas de poder en los grupos de pertenencia, necesidad de eliminar vinculos que no son genuinos o transformacion radical de los ideales que guian el futuro. Una buena ventana para renovar las alianzas y para comprometerse con causas que tengan sustancia y profundidad real.',
    'transit:pluto|ingress|house_12':
      'Pluton en ingreso a la Casa 12 inicia un ciclo de confrontacion con lo que esta oculto, reprimido o viviendo en las sombras de la psique. El periodo puede traer irrupciones del inconsciente, confrontacion con patrones que operan por debajo de la conciencia o necesidad de transformar lo que ha sido evitado por miedo. Una buena ventana para trabajar las sombras con coraje, eliminar lo que bloquea la vida interior y renovar los cimientos del mundo subjetivo.',
    'transit:pluto|oposicao|ascendente':
      'Pluton en oposicion al Ascendente natal puede traer encuentros intensos que fuerzan confrontacion con las propias sombras reflejadas en el otro, con dinamicas de poder en los relacionamientos y con lo que estaba oculto en la autoimagen. El periodo puede revelar tension entre la necesidad de control y la apertura genuina para ser transformado por el contacto con los otros. Una buena ventana para trabajar los vinculos con mas conciencia sobre lo que se proyecta y lo que se esconde.',
    'transit:pluto|oposicao|meio_do_ceu':
      'Pluton en oposicion al Medio del Cielo natal puede traer transformaciones en las fundaciones de la vida — en la familia, el hogar y la psique profunda — que sacuden la trayectoria publica y profesional. El periodo puede revelar tension entre la necesidad de control sobre la direccion externa y lo que emerge de las raices mas profundas. Una buena ventana para revisar lo que sustenta el camino y para transformar las fundaciones en algo mas consciente y solido.',
    'transit:pluto|oposicao|mercury':
      'Pluton en oposicion a Mercurio natal puede traer confrontaciones intensas en el campo de las ideas, las comunicaciones y la forma de procesar la realidad, con tendencia a revelaciones que sacuden certezas. El periodo puede revelar tension entre la voluntad de controlar el discurso y la necesidad de abrirse a verdades incomodas. Una buena ventana para investigar con mas profundidad y para usar la palabra con mas integridad y responsabilidad.',
    'transit:pluto|oposicao|moon':
      'Pluton en oposicion a la Luna natal puede traer confrontaciones intensas en el mundo emocional, revelaciones sobre patrones afectivos ocultos o tension entre la necesidad de seguridad y el impulso de transformacion profunda. El periodo puede revelar donde el control esta siendo ejercido en el campo afectivo y donde la entrega genuina esta siendo bloqueada. Una buena ventana para enfrentar lo que fue reprimido en el campo de las emociones y para renovar la vida afectiva con mas autenticidad.',
    'transit:pluto|oposicao|neptune':
      'Pluton en oposicion a Neptuno natal crea tension entre poder transformador y disolucion, con posibilidad de crisis en el campo espiritual o creativo que exigen confrontacion con lo que era ilusion. El periodo puede revelar donde la espiritualidad o la creatividad esta siendo usada para evitar la transformacion real. Una buena ventana para profundizar la vida interior con mas honestidad y para distinguir la vision genuina de la proyeccion sin sustancia.',
    'transit:pluto|oposicao|pluto':
      'Pluton en oposicion a Pluton natal marca un momento de confrontacion entre el poder que se construyo y lo que aun necesita ser transformado en el fondo de la psique. El periodo puede traer tension entre lo que se quiere mantener y lo que la vida exige que sea eliminado o renovado. Una buena ventana para trabajar con las propias sombras con madurez y para reconocer donde el poder esta siendo ejercido o negado de forma no consciente.',
    'transit:pluto|oposicao|saturn':
      'Pluton en oposicion a Saturno natal crea tension entre el poder transformador y las estructuras, limites y responsabilidades de Saturno. El periodo puede traer confrontaciones con autoridades, crisis en estructuras que parecian solidas o necesidad de reconstruir bases desde algo mas profundo. Una buena ventana para transformar lo que estaba rigido sin destruir lo que aun tiene valor y para reconstruir con mas integridad.',
    'transit:pluto|oposicao|uranus':
      'Pluton en oposicion a Urano natal crea tension entre transformacion profunda y ruptura repentina, con posibilidad de crisis que exigen tanto discernimiento como apertura radical. El periodo puede revelar conflicto entre lo que necesita cambiar de forma lenta y profunda y lo que quiere romper de forma abrupta. Una buena ventana para integrar los impulsos de renovacion y transformacion sin polarizar en extremos.',
    'transit:pluto|quadratura|ascendente':
      'Pluton en cuadratura al Ascendente natal puede crear friccion intensa entre la necesidad de transformacion de la identidad y la resistencia interna o externa a ese cambio. El periodo puede traer conflictos de poder en el entorno proximo, confrontacion con la propia sombra o tension entre lo que se quiere mostrar y lo que necesita ser revelado. Una buena ventana para trabajar la autenticidad con coraje y sin manipulacion.',
    'transit:pluto|quadratura|meio_do_ceu':
      'Pluton en cuadratura al Medio del Cielo natal puede traer crisis o confrontaciones en la trayectoria profesional, con revelaciones sobre dinamicas de poder, control o ambicion que necesitan ser examinadas. El periodo puede crear tension entre lo que se quiere conquistar en la vida publica y lo que las fundaciones internas o familiares sustentan o no. Una buena ventana para transformar la relacion con la ambicion y para construir el camino profesional desde mayor integridad.',
    'transit:pluto|quadratura|neptune':
      'Pluton en cuadratura a Neptuno natal crea friccion entre poder transformador y disolucion, con posibilidad de crisis en el campo espiritual o creativo que exigen confrontacion con ilusiones. El periodo puede revelar donde la fantasia o el escapismo esta impidiendo la transformacion real. Una buena ventana para profundizar la vida espiritual y creativa con mas honestidad y para eliminar lo que era solo proyeccion sin sustancia.',
    'transit:pluto|quadratura|pluto':
      'Pluton en cuadratura a Pluton natal marca un momento de friccion intensa entre el poder que se construyo y lo que aun necesita ser transformado, con crisis que revelan donde el control esta siendo ejercido de forma no consciente. El periodo puede traer confrontaciones con la propia sombra y con dinamicas de poder y manipulacion que operan por debajo de la conciencia. Una buena ventana para examinar honestamente lo que necesita ser eliminado y para reconstruir con mas integridad y profundidad.',
    'transit:pluto|quadratura|saturn':
      'Pluton en cuadratura a Saturno natal crea friccion entre el impulso de transformacion radical y la necesidad de mantener estructura y responsabilidad. El periodo puede traer confrontaciones con autoridades, crisis en estructuras que parecian solidas o tension entre lo que necesita cambiar y lo que necesita ser preservado con cuidado. Una buena ventana para trabajar la transformacion sin destruir lo que aun sustenta y para reconstruir con mas integridad.',
    'transit:pluto|quadratura|sun':
      'Pluton en cuadratura al Sol natal puede crear friccion intensa entre la expresion de la identidad y el impulso de transformacion radical, con confrontaciones que desafian el sentido de quien se es. El periodo puede traer conflictos de poder, confrontacion con la propia sombra o tension entre la voluntad de control y la necesidad de entrega al proceso transformador. Una buena ventana para examinar lo que en la identidad necesita ser renovado y para actuar con mas integridad y profundidad.',
    'transit:pluto|quadratura|uranus':
      'Pluton en cuadratura a Urano natal crea friccion entre transformacion profunda y ruptura abrupta, con posibilidad de crisis que combinan lo inesperado y lo profundo de forma desestabilizadora. El periodo puede revelar tension entre lo que necesita cambiar lentamente y lo que explota en rupturas sin preparacion. Una buena ventana para trabajar los cambios con mas intencionalidad y para integrar lo inesperado sin perder el hilo conductor de la transformacion necesaria.',
    'transit:pluto|quadratura|venus':
      'Pluton en cuadratura a Venus natal puede traer crisis en los relacionamientos, revelaciones sobre dinamicas de poder, control o dependencia en el campo afectivo o confrontacion con lo que genuinamente se desea versus lo que se presenta como deseable. El periodo puede crear friccion entre lo que es familiar en el campo afectivo y lo que necesita ser transformado para que las relaciones sean mas autenticas. Una buena ventana para renovar la vida afectiva y los valores con mas profundidad y honestidad.',
    'transit:pluto|sextil|ascendente':
      'Pluton en sextil al Ascendente natal favorece la renovacion de la identidad con acceso a una fuerza mas profunda y magnetica que se integra de forma constructiva. El ciclo facilita transformaciones en la autoimagen y en la forma de presentarse que llegan con mas fluidez y menos fricciones que en los aspectos de tension. Un buen momento para trabajar lo que necesita ser renovado en la identidad con coraje e intencion clara.',
    'transit:pluto|sextil|jupiter':
      'Pluton en sextil a Jupiter natal favorece el crecimiento por caminos que integran profundidad, poder e integridad, con capacidad de expandirse sin perder el contacto con lo sustancial. El ciclo facilita oportunidades que llegan por el trabajo con lo que es profundo y transformador. Un buen momento para invertir en proyectos de gran impacto que nacen de valores genuinos y de coraje real.',
    'transit:pluto|sextil|meio_do_ceu':
      'Pluton en sextil al Medio del Cielo natal favorece transformaciones constructivas en la trayectoria profesional, con acceso a una influencia mas profunda y magnetica en la vida publica. El ciclo facilita cambios en el camino que llegan con menos friccion y mas intencionalidad. Un buen momento para avanzar en direcciones que exigen coraje y profundidad, aprovechando el potencial transformador para consolidar una trayectoria mas poderosa y autentica.',
    'transit:pluto|sextil|mercury':
      'Pluton en sextil a Mercurio natal favorece el pensamiento investigativo, la comunicacion con profundidad y la capacidad de ir al fondo de las cuestiones con claridad y fuerza. El ciclo facilita la investigacion, la escritura que revela lo que esta oculto y el uso de la palabra con influencia genuina. Un buen momento para trabajar con informaciones en profundidad, investigar verdades ocultas y comunicar lo que necesita ser dicho con coraje y precision.',
    'transit:pluto|sextil|moon':
      'Pluton en sextil a la Luna natal favorece el acceso al mundo emocional profundo con mas facilidad y menos resistencia que en los aspectos de tension. El ciclo facilita procesos de transformacion afectiva conducidos con intencion y cuidado. Un buen momento para trabajar los patrones emocionales heredados con coraje, abriendo espacio para una vida afectiva mas integrada y profunda.',
    'transit:pluto|sextil|neptune':
      'Pluton en sextil a Neptuno natal favorece la transformacion que se profundiza por lo espiritual y lo creativo, con acceso a capas mas profundas de la vida interior de forma productiva. El ciclo facilita el trabajo con el inconsciente, lo sagrado y lo imaginativo de forma constructiva. Un buen momento para profundizar practicas espirituales y creativas que toquen lo mas profundo y transformador.',
    'transit:pluto|sextil|pluto':
      'Pluton en sextil a Pluton natal favorece momentos de acceso al propio potencial de transformacion con mas fluidez y menos resistencia. El ciclo facilita procesos de renovacion profunda que llegan con mas capacidad de aprovechamiento. Un buen momento para trabajar lo que necesita ser transformado en la psique con intencion clara y coraje constructivo.',
    'transit:pluto|sextil|saturn':
      'Pluton en sextil a Saturno natal favorece la integracion constructiva de poder de transformacion y estructura, con capacidad de renovar lo establecido sin destruir lo que aun sustenta. El ciclo facilita reformas profundas, eliminacion de lo que es obsoleto y consolidacion de lo que es esencial. Un buen momento para transformar con rigor y responsabilidad, construyendo sobre bases renovadas con mas integridad.',
    'transit:pluto|sextil|uranus':
      'Pluton en sextil a Urano natal favorece la combinacion constructiva de transformacion profunda e innovacion, con capacidad de renovar estructuras de forma profunda y creativa. El ciclo facilita cambios que llegan con menos friccion y mas intencionalidad. Un buen momento para innovar en areas que piden transformacion real, aprovechando el potencial de renovacion de forma constructiva y sin destruccion innecesaria.',
    'transit:pluto|sextil|venus':
      'Pluton en sextil a Venus natal favorece transformaciones constructivas en la vida afectiva y los valores, con acceso a una profundidad que enriquece los relacionamientos. El ciclo facilita la profundizacion de los vinculos genuinos y la eliminacion de lo que era superficial sin el trauma de los aspectos de tension. Un buen momento para renovar el campo afectivo y los valores con mas profundidad e intencionalidad.',
    'transit:pluto|trigono|ascendente':
      'Pluton en trigono al Ascendente natal favorece la renovacion profunda de la identidad que llega con mas fluidez e integracion natural. El ciclo facilita transformaciones en la autoimagen y en la forma de presentarse que son bien recibidas y producen una presencia mas autentica y magnetica. Un buen momento para trabajar lo que necesita ser renovado en quien se es de forma profunda y constructiva, con coraje y apertura.',
    'transit:pluto|trigono|meio_do_ceu':
      'Pluton en trigono al Medio del Cielo natal favorece transformaciones profundas en la trayectoria profesional que llegan con fluidez y potencial de impacto real. El ciclo facilita cambios en el camino publico que son bien integrados y constructivos, con acceso a una influencia mas magnetica. Un buen momento para renovar la direccion profesional con profundidad y para consolidar una trayectoria de mayor sustancia y autenticidad.',
    'transit:pluto|trigono|mercury':
      'Pluton en trigono a Mercurio natal favorece el pensamiento investigativo profundo, la comunicacion que va al fondo de las cuestiones y la capacidad de revelar lo que esta oculto de forma constructiva. El ciclo facilita la investigacion, la escritura con impacto y el uso de la palabra con influencia genuina, sin las fricciones de los aspectos de tension. Un buen momento para trabajar con informaciones en profundidad y para comunicar verdades con coraje y precision.',
    'transit:pluto|trigono|moon':
      'Pluton en trigono a la Luna natal favorece la transformacion emocional profunda que llega con mas fluidez y menos resistencia, con acceso a lo que estaba oculto en el campo afectivo. El ciclo facilita la renovacion de los patrones emocionales heredados y la profundizacion de la vida interior de forma constructiva. Un buen momento para trabajar el mundo emocional con coraje e intencion, abriendo espacio para una vida afectiva mas integrada y autentica.',
    'transit:pluto|trigono|neptune':
      'Pluton en trigono a Neptuno natal favorece la transformacion profunda mediada por lo espiritual y lo creativo, con acceso fluido a lo que esta oculto en las capas mas profundas de la vida interior. El ciclo facilita el trabajo con el inconsciente, lo sagrado y lo imaginativo de forma constructiva y bien integrada. Un buen momento para profundizar practicas espirituales y creativas que produzcan renovacion real con sentido de proposito.',
    'transit:pluto|trigono|pluto':
      'Pluton en trigono a Pluton natal favorece momentos de acceso al propio potencial de transformacion con fluidez natural y apertura constructiva. El ciclo facilita procesos de renovacion profunda que llegan con mas facilidad de integracion. Un buen momento para trabajar lo que necesita ser transformado en la psique con intencion clara, coraje y produccion genuina, aprovechando el potencial con conciencia.',
    'transit:pluto|trigono|saturn':
      'Pluton en trigono a Saturno natal favorece la integracion fluida de poder de transformacion y estructura, con capacidad de renovar lo establecido y construir sobre bases mas profundas. El ciclo facilita reformas profundas que llegan con menos resistencia, eliminacion de lo que es obsoleto y consolidacion de lo que es esencial. Un buen momento para construir con profundidad y rigor lo que debe durar, sobre fundaciones renovadas con integridad.',
    'transit:pluto|trigono|uranus':
      'Pluton en trigono a Urano natal favorece la combinacion fluida de transformacion profunda e innovacion, con capacidad de renovar estructuras de forma radical pero bien integrada. El ciclo facilita cambios que llegan con mas fluidez y produccion constructiva. Un buen momento para innovar en areas que piden renovacion real, aprovechando el potencial de transformacion creativa con apertura e intencionalidad.',
    'transit:pluto|trigono|venus':
      'Pluton en trigono a Venus natal favorece transformaciones constructivas en la vida afectiva y los valores que llegan con fluidez y profundidad genuina. El ciclo facilita la profundizacion de los vinculos genuinos y la eliminacion natural de lo que era superficial. Un buen momento para renovar el campo afectivo y los valores con mas profundidad y satisfaccion, cultivando lo que es genuino con apertura y presencia real.',

    // Luna — conjuncion
    'transit:moon|conjuncao|mercury':
      'Luna en conjuncion a Mercurio natal acerca emocion y razonamiento, favoreciendo expresion mas honesta de lo que se siente. El transito de pocos dias tiende a ampliar la intuicion en la comunicacion y la receptividad a mensajes del entorno. Buen momento para conversaciones relevantes, registros personales y decisiones que piden equilibrio entre logica y percepcion interior.',
    'transit:moon|conjuncao|venus':
      'Luna en conjuncion a Venus natal intensifica la necesidad de afecto, armonia e intercambios agradables. El transito de pocos dias suele ampliar la sensibilidad estetica y el deseo de cuidar y ser cuidado. Momento oportuno para vinculos afectivos, creatividad y actividades que alimentan el placer y el bienestar interno.',
    'transit:moon|conjuncao|jupiter':
      'Luna en conjuncion a Jupiter natal amplia la necesidad de sentido y pertenencia, haciendo facil confundir entusiasmo genuino con exageracion emocional. Tus expectativas pueden crecer mas rapido de lo que la realidad puede confirmar — y eso puede generar decepcion proporcional. Aprovecha el impulso para avanzar en algo planificado, manteniendo una medida concreta de lo que es posible concretar ahora.',
    'transit:moon|conjuncao|saturn':
      'Luna en conjuncion a Saturno natal puede traer peso emocional temporal, sensacion de limitacion o mayor necesidad de estructura. El transito de pocos dias tiende a evidenciar responsabilidades pendientes y el impacto de elecciones pasadas. Momento de mayor seriedad que invita a ajustes practicos y reconocimiento honesto de lo que necesita ser organizado.',
    'transit:moon|conjuncao|neptune':
      'Luna en conjuncion a Neptuno natal intensifica sensibilidad, intuicion y apertura a percepciones sutiles. El transito de pocos dias puede traer suenos vividos, empatia ampliada y necesidad de recogimiento creativo. Buen momento para contacto con el arte, meditacion y procesos interiores, con atencion para no idealizar situaciones ni dispersar energia.',
    'transit:moon|conjuncao|pluto':
      'Luna en conjuncion a Pluton natal puede traer emociones con calidad compulsiva — un deseo intenso de verdad, profundidad o resolucion definitiva de algo que incomoda. El riesgo es reaccionar externamente a lo que es esencialmente una transformacion interna: la intensidad pide procesamiento, no accion inmediata. Permitete sentir el peso sin necesitar resolverlo todo ahora — la claridad tiende a llegar despues de que la intensidad cede.',
    'transit:moon|conjuncao|ascendente':
      'Luna en conjuncion al Ascendente natal intensifica la expresion emocional y su impacto en el entorno. El transito de pocos dias tiende a ampliar la sensibilidad interpersonal y la necesidad de reconocimiento. Momento de mayor visibilidad emocional: lo que se siente tiende a ser percibido por los demas con mas claridad.',
    'transit:moon|conjuncao|meio_do_ceu':
      'Luna en conjuncion al Medio Cielo natal acerca vida emocional y vida publica, pudiendo traer visibilidad a temas personales. El transito de pocos dias tiende a ampliar sensibilidad en torno a carrera, reputacion y como eres percibido. Buen momento para alinear necesidades emocionales con direccion profesional de forma mas consciente.',

    // Luna — oposicion
    'transit:moon|oposicao|sun':
      'Luna en oposicion al Sol natal crea tension entre necesidad emocional y voluntad consciente, pidiendo equilibrio entre sentir y actuar. El transito de pocos dias tiende a evidenciar conflictos entre lo que se desea internamente y lo que se proyecta al mundo. Momento de revision: lo que el ego quiere puede no ser lo que el campo emocional realmente necesita.',
    'transit:moon|oposicao|venus':
      'Luna en oposicion a Venus natal puede crear tension entre lo que necesitas afectivamente y lo que puedes pedir o recibir. Hay riesgo de dar mas de lo que sientes o de esperar que el otro adivine lo que no fue dicho. Momento de nombrar tu necesidad real en relaciones cercanas — sin proyectar carencia ni fingir que todo esta bien cuando no lo esta.',
    'transit:moon|oposicao|saturn':
      'Luna en oposicion a Saturno natal tiende a crear conflicto entre la necesidad de acogimiento y la exigencia de funcionalidad — lo que sientes puede parecer un estorbo ante lo que debes cumplir. Hay riesgo de suprimir emociones legitimas para parecer mas competente o responsable de lo que te sientes. Momento de reconocer que cuidarte no es huir de las responsabilidades — es lo que sostiene la capacidad de cumplirlas.',
    'transit:moon|oposicao|uranus':
      'Luna en oposicion a Urano natal puede traer inestabilidad emocional repentina o necesidad urgente de cambio y libertad. El transito de pocos dias tiende a crear imprevisibilidad en reacciones y dificultad de mantener rutina emocional estable. Buen momento para observar lo que pide renovacion, sin tomar decisiones abruptas por impulso.',
    'transit:moon|oposicao|neptune':
      'Luna en oposicion a Neptuno natal puede crear confusion entre lo que realmente sientes y lo que desearias sentir — o lo que crees que deberias sentir. El riesgo es proyectar esperanza en situaciones o personas que aun no han mostrado suficiente claridad para sustentarla. Usa el periodo para preguntarte: que es real aqui, y que es mi necesidad de que las cosas sean diferentes de lo que son?',
    'transit:moon|oposicao|pluto':
      'Luna en oposicion a Pluton natal puede despertar impulso de control o necesidad de dominar situaciones cuando la emocion es demasiado intensa para soportar. El par tiende a revelar dinamicas de poder en relaciones cercanas — quien tiene mas influencia, quien cede, quien guarda resentimientos. Preguntate: estas reaccionando a lo que ocurre ahora o a un patron antiguo que esta situacion desperto?',
    'transit:moon|oposicao|ascendente':
      'Luna en oposicion al Ascendente natal crea tension entre necesidades emocionales propias y demandas del entorno o las relaciones. El transito de pocos dias tiende a evidenciar desequilibrio entre lo que necesitas y lo que los demas esperan. Momento de revision de limites: dar a los demas no puede costar la propia sustentacion interna.',
    'transit:moon|oposicao|meio_do_ceu':
      'Luna en oposicion al Medio Cielo natal puede crear tension entre vida emocional o familiar y exigencias de la vida publica y profesional. El transito de pocos dias tiende a evidenciar donde base personal y reputacion externa jalan en direcciones opuestas. Momento de alinear lo que se cuida internamente con lo que se proyecta al mundo.',

    // Luna — cuadratura
    'transit:moon|quadratura|sun':
      'Luna en cuadratura al Sol natal crea friccion entre necesidad emocional y expresion de la voluntad personal. El transito de pocos dias tiende a evidenciar donde sentimiento e impulso de accion estan en conflicto. Momento de desacelerar antes de actuar: ajustar el curso interno puede ser mas eficaz que forzar una decision externa.',
    'transit:moon|quadratura|mercury':
      'Luna en cuadratura a Mercurio natal puede crear conflicto entre lo que quieres expresar y lo que tu logica deja salir — el corazon quiere decir lo que la mente aun esta intentando organizar. El riesgo es concluir que las personas no te entienden cuando, en realidad, tu mismo estas procesando lo que sientes. Antes de comunicar algo importante, permitete sentir primero — la claridad llega despues del procesamiento, no antes.',
    'transit:moon|quadratura|venus':
      'Luna en cuadratura a Venus natal puede crear friccion entre necesidad afectiva y patron de valor o armonia que se busca en las relaciones. El transito de pocos dias tiende a evidenciar insatisfacciones en intercambios o expectativas no atendidas. Momento de revisar lo que realmente quieres en vinculos, sin proyectar frustracion en quienes estan cerca.',
    'transit:moon|quadratura|saturn':
      'Luna en cuadratura a Saturno natal puede traer peso emocional, sensacion de bloqueo o conflicto entre sentir y cumplir obligaciones. El transito de pocos dias tiende a evidenciar donde rigidez o autocritica excesiva interfieren en el bienestar. Momento de acoger lo que es legitimo sentir sin ceder a autoexigencias desproporcionadas.',
    'transit:moon|quadratura|uranus':
      'Luna en cuadratura a Urano natal puede traer impaciencia emocional y ganas urgentes de romper con lo que parece estancado — aunque la direccion del cambio todavia no este clara. Puedes saber que algo necesita cambiar sin saber exactamente que, y eso tiende a generar irritacion con lo que esta cerca. Observa lo que provoca mas agitacion interna: esos puntos suelen indicar donde la renovacion genuina es necesaria, no donde la accion impulsiva ayuda.',
    'transit:moon|quadratura|neptune':
      'Luna en cuadratura a Neptuno natal puede hacer dificil separar lo que sientes de lo que imaginas, lo que temes o lo que deseas que fuera verdad — los limites internos se vuelven porosos. Hay tendencia de escapar en distraccion, sueno o idealizacion como respuesta a una realidad incomoda que aun no esta lista para ser enfrentada. Crea pequenas anclas fisicas en el dia a dia — caminatas, rutinas simples — antes de cualquier decision que involucre emocion elevada.',
    'transit:moon|quadratura|pluto':
      'Luna en cuadratura a Pluton natal puede traer impulso de controlar situaciones o personas como forma inconsciente de no perder el control sobre lo que se siente. La intensidad emocional puede generar reacciones desproporcionadas a provocaciones pequenas — lo que irrita ahora raramente es solo lo que parece ser. Preguntate: estoy reaccionando al presente o a un miedo antiguo que esta situacion simplemente desperto?',
    'transit:moon|quadratura|ascendente':
      'Luna en cuadratura al Ascendente natal crea friccion entre necesidades emocionales internas y la forma en que te presentas al mundo. El transito de pocos dias tiende a evidenciar desalineacion entre lo que se siente y lo que se proyecta. Momento de revisar la mascara social: la autenticidad tiende a ser mas eficaz que el ajuste de imagen.',
    'transit:moon|quadratura|meio_do_ceu':
      'Luna en cuadratura al Medio Cielo natal puede crear tension entre vida emocional y demandas de la vida profesional o publica. El transito de pocos dias tiende a generar dificultad de separar lo que se siente de lo que se espera en el contexto de trabajo. Momento de crear limites claros entre espacio personal y espacio de entrega profesional.',

    // Luna — trigono
    'transit:moon|trigono|sun':
      'Luna en trigono al Sol natal favorece integracion entre vida emocional y expresion consciente, creando fluidez entre sentir y actuar. El transito de pocos dias sustenta autenticidad y mayor coherencia interna. Buen momento para decisiones que piden alineacion entre voluntad y necesidad, iniciativas personales y reconocimiento de lo que importa de verdad.',
    'transit:moon|trigono|mercury':
      'Luna en trigono a Mercurio natal favorece comunicacion empatica, expresion clara de los sentimientos y comprension mas facil de lo que el otro quiere decir. El transito de pocos dias sustenta fluidez entre intuicion y razonamiento. Buen momento para conversaciones importantes, escritura creativa y decisiones que piden tanto logica como sensibilidad.',
    'transit:moon|trigono|venus':
      'Luna en trigono a Venus natal favorece armonia afectiva, placer en los intercambios y mayor facilidad de cuidar y ser cuidado. El transito de pocos dias sustenta bienestar emocional y apertura a lo que es bello y agradable. Buen momento para fortalecer vinculos, actividades creativas y cualquier cosa que nutra el campo afectivo.',
    'transit:moon|trigono|mars':
      'Luna en trigono a Marte natal favorece accion movida por motivacion genuina, con energia fisica y emocional alineadas. El transito de pocos dias sustenta iniciativa practica con menos resistencia interna. Buen momento para iniciar proyectos, ejercicio fisico y cualquier actividad que necesite tanto coraje como sensibilidad.',
    'transit:moon|trigono|jupiter':
      'Luna en trigono a Jupiter natal favorece apertura emocional, optimismo moderado y mayor facilidad de ver lo que es posible. El transito de pocos dias sustenta disposicion para aprender y expandir sin perder equilibrio. Buen momento para compartir ideas, planear el futuro y nutrir conexiones que alimentan crecimiento personal.',
    'transit:moon|trigono|uranus':
      'Luna en trigono a Urano natal favorece apertura a lo nuevo sin generar inestabilidad emocional. El transito de pocos dias sustenta creatividad, intuicion y disposicion para experimentar caminos diferentes. Buen momento para ideas inesperadas, cambios leves de rutina y conexiones que estimulan perspectivas fuera del patron habitual.',
    'transit:moon|trigono|neptune':
      'Luna en trigono a Neptuno natal favorece sensibilidad elevada, intuicion refinada y contacto con dimensiones creativas y espirituales. El transito de pocos dias sustenta empatia profunda y apertura a percepciones sutiles. Buen momento para actividades artisticas, meditacion, suenos lucidos y conexiones que tocan algo mas profundo que lo cotidiano.',
    'transit:moon|trigono|pluto':
      'Luna en trigono a Pluton natal favorece contacto con emociones profundas de forma fluida y menos amenazadora. El transito de pocos dias sustenta capacidad de procesar lo que normalmente es dificil de acceder. Buen momento para autoconocimiento, conversaciones intimas relevantes y cualquier proceso que pida coraje emocional sin exceso de intensidad.',
    'transit:moon|trigono|ascendente':
      'Luna en trigono al Ascendente natal favorece autenticidad en la presencia y mayor facilidad de expresar quien eres ante el mundo. El transito de pocos dias sustenta empatia en las interacciones y receptividad del entorno. Buen momento para presentaciones personales, encuentros importantes y cualquier situacion que pida presencia genuina.',
    'transit:moon|trigono|meio_do_ceu':
      'Luna en trigono al Medio Cielo natal favorece integracion entre vida emocional y direccion profesional, con mas facilidad de actuar con proposito. El transito de pocos dias sustenta receptividad del publico y la liderazgo. Buen momento para comunicar proyectos, fortalecer reputacion y alinear lo que sientes con lo que entregas.',

    // Luna — sextil
    'transit:moon|sextil|sun':
      'Luna en sextil al Sol natal abre una ventana de fluidez entre vida emocional y expresion de la identidad. El transito de pocos dias invita a pequeñas acciones alineadas con lo que se quiere y lo que se siente. Buen momento para iniciativas personales que necesitan motivacion interior genuina para ponerse en marcha.',
    'transit:moon|sextil|mercury':
      'Luna en sextil a Mercurio natal abre espacio para comunicacion mas fluida y receptividad a informacion con matiz emocional. El transito de pocos dias invita a conversaciones, estudio e intercambios que combinan razonamiento y sensibilidad. Buen momento para dialogos importantes, escritura creativa y resolucion de pendientes que necesitan claridad y empatia.',
    'transit:moon|sextil|venus':
      'Luna en sextil a Venus natal abre espacio para intercambios afectivos agradables y momentos de cuidado con lo que es bello y significativo. El transito de pocos dias invita a cultivar armonia en las relaciones y placer en las actividades del dia. Buen momento para fortalecer vinculos, actividades creativas y pequenas actitudes de afecto que hacen diferencia.',
    'transit:moon|sextil|mars':
      'Luna en sextil a Marte natal abre espacio para iniciativas movidas por motivacion genuina y uso practico de la energia disponible. El transito de pocos dias invita a accion concreta en algo que importa emocionalmente. Buen momento para iniciar proyectos personales, ejercitar el cuerpo y canalizar disposicion en actividades con proposito claro.',
    'transit:moon|sextil|jupiter':
      'Luna en sextil a Jupiter natal abre una ventana de optimismo moderado y facilidad de conectar con lo que nutre el crecimiento. El transito de pocos dias invita a expandir perspectivas y explorar posibilidades con curiosidad. Buen momento para aprender algo nuevo, planear viajes o estudios y cultivar conexiones que alimentan vision de futuro.',
    'transit:moon|sextil|uranus':
      'Luna en sextil a Urano natal abre espacio para renovacion leve y receptividad a lo inesperado o diferente del patron. El transito de pocos dias invita a flexibilidad creativa y novedad sin inestabilidad. Buen momento para experimentos, cambios de rutina y conexiones con personas que amplian perspectiva.',
    'transit:moon|sextil|neptune':
      'Luna en sextil a Neptuno natal abre espacio para sensibilidad refinada, intuicion y contacto con dimensiones creativas o espirituales. El transito de pocos dias invita a apertura para percepciones sutiles y empatia profunda. Buen momento para arte, meditacion, suenos y cualquier actividad que nutra el campo interior con levedad.',
    'transit:moon|sextil|pluto':
      'Luna en sextil a Pluton natal abre una ventana de acceso a emociones mas profundas sin que eso genere intensidad excesiva. El transito de pocos dias invita a reflexion sobre lo que necesita ser transformado con cuidado e intencion. Buen momento para autoconocimiento, conversaciones de profundidad y cualquier proceso de limpieza emocional suave.',
    'transit:moon|sextil|ascendente':
      'Luna en sextil al Ascendente natal abre espacio para mayor autenticidad en la presencia y facilidad de conexion interpersonal. El transito de pocos dias invita a interacciones espontaneas y expresion mas genuina de quien eres. Buen momento para encuentros, presentaciones y cualquier situacion que pida presencia receptiva y sin defensas excesivas.',
    'transit:moon|sextil|meio_do_ceu':
      'Luna en sextil al Medio Cielo natal abre una ventana para alinear vida emocional con direccion profesional de forma natural. El transito de pocos dias invita a acciones de visibilidad que no cuestan mucho esfuerzo cuando el momento es el adecuado. Buen momento para conversaciones con liderazgo, compartir proyectos y movimientos discretos de posicionamiento.',
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
      'Saturno in quadratura al proprio Saturno natale espone tensione tra la struttura attuale e il bisogno di maturazione reale. Questa fase tende a rivelare dove scadenze, limiti e responsabilita non servono piu a cio che vuoi costruire, rendendo piu evidente il peso di questo disallineamento. Cosa stai mantenendo per abitudine che non produce piu risultati reali?',
    'transit:saturn|sextil|sun':
      'Saturno in sestile al Sole apre spazio per consolidare obiettivi personali con piu rigore e chiarezza di proposito. Questa fase tende a rivelare cio che ha bisogno di struttura per trasformarsi da potenziale in risultato reale. Quali impegni hai rimandato per mancanza di metodo, non di volonta?',
    'transit:saturn|trigono|sun':
      'Saturno in trigono al Sole favorisce un ciclo di lavoro costante, con meno attrito tra chi vuoi essere e cio che riesci a sostenere in pratica. Gli obiettivi di lungo periodo diventano piu semplici da realizzare quando identita e metodo sono allineati. Cosa vuoi consolidare mentre questo flusso e disponibile?',
    'transit:saturn|oposicao|uranus':
      'Saturno in opposizione a Urano natale attiva un conflitto diretto tra cio che ha bisogno di stabilita e cio che esige rinnovamento urgente. La polarita puo manifestarsi come resistenza interiore: una parte vuole preservare cio che funziona, un altra sa che il modello attuale e gia obsoleto. Cosa puoi rinnovare per fasi, senza dover rompere tutto in una volta?',
    'transit:saturn|quadratura|uranus':
      'Saturno in quadratura a Urano natale genera attrito tra l impulso di rompere con cio che e obsoleto e il timore di destabilizzare cio che ancora produce risultati. Questa fase tende a intensificare il disagio con le routine vecchie mentre i cambiamenti rapidi appaiono anche rischiosi — un impasse che chiede strategia. Qual e il cambiamento piu piccolo che potresti avviare adesso per segnalare che il rinnovamento e gia cominciato?',
    'transit:saturn|sextil|mars':
      'Saturno in sestile a Marte favorisce trasformare slancio in strategia, creando finestre per l azione con tecnica e meno dispersione. Il ciclo tende a rendere di piu quando si unisce coraggio di iniziare e pianificazione dell esecuzione. Quale progetto impegnativo hai disponibile per strutturare in tappe ora?',
    'transit:saturn|trigono|mars':
      'Saturno in trigono a Marte unisce persistenza e metodo, creando condizioni per un esecuzione di qualita senza l attrito tipico degli aspetti di tensione. Progetti di lunga durata o fisicamente impegnativi tendono a fluire con piu regolarita e meno usura. Questo ciclo favorisce cio che richiede sia vigore sia pazienza allo stesso tempo.',
    'transit:saturn|sextil|saturn':
      'Saturno in sestile al proprio Saturno natale apre un ciclo favorevole per rivedere autogestione, scadenze e impegni senza la pressione degli aspetti di tensione. Il periodo invita a interrogarsi su quali responsabilita abbiano ancora senso e quali richiedano ristrutturazione con maggiore chiarezza. Quale parte del tuo modo di organizzarti chiede un aggiornamento, non solo ottimizzazione?',
    'transit:saturn|trigono|saturn':
      'Saturno in trigono al proprio Saturno natale indica una fase di buon funzionamento strutturale, con maggiore facilita nel sostenere metodo e completare tappe. Il flusso invita ad avviare qualcosa di lunga durata che prima sembrava troppo grande per cominciare. Usa il momento per iniziare cio che richiede costanza, non solo mantenere cio che gia funziona.',
    'transit:sun|oposicao|pluto':
      'Sole in opposizione a Plutone intensifica temi di controllo, potere personale e priorita reali. Questo ciclo puo mostrare polarita che chiedono una postura piu consapevole e meno reattiva. Concentrati sull essenziale con fermezza e senza scontri inutili.',
    'transit:saturn|oposicao|mars':
      'Saturno in opposizione a Marte natale puo creare sensazione di freno esterno nell azione, come se ogni passo richiedesse piu preparazione o validazione del solito. La tensione tende a mostrare dove forza e tecnica sono disallineate — lo slancio senza strategia soffre di piu in questo ciclo. Cosa nella tua esecuzione attuale chiede piu pianificazione, non piu sforzo?',
    'transit:saturn|quadratura|mercury':
      'Saturno in quadratura a Mercurio natale puo rallentare la comunicazione, sovraccaricare il pensiero e mostrare dove argomenti o processi mentali necessitano revisione strutturale. Questa fase aumenta l esigenza di precisione — ritardi nelle decisioni e rilavoro dei messaggi segnalano che la base concettuale deve essere piu solida. Quale tua ipotesi su questa situazione non hai ancora messo abbastanza in discussione?',
    'transit:saturn|quadratura|sun':
      'Saturno in quadratura al Sole natale puo creare sensazione di soffitto o limite esterno sulle iniziative personali, come se il contesto esigesse piu dell energia disponibile. L attrito tende a rivelare dove l identita dipende ancora da approvazione esterna o condizioni ideali per avanzare. Quale parte del tuo piano puo muoversi senza aspettare che tutto sia perfetto?',
    'transit:saturn|sextil|venus':
      'Saturno in sestile a Venere favorisce costruire legami con piu discernimento e meno idealizzazione, rendendo piu facile riconoscere cio che ha reciprocita genuina. La fase invita a rivedere accordi affettivi o finanziari con sguardo piu maturo e aspettative meglio calibrate. Quale accordo merita un esame onesto su cio che ciascuna parte porta davvero?',
    'transit:saturn|trigono|venus':
      'Saturno in trigono a Venere facilita costruire basi piu solide in relazioni e finanze, con preferenza naturale per qualita e impegni di lungo periodo. Il ciclo tende ad allineare investimenti affettivi e materiali con cio che sostiene davvero valore nel tempo. Quali scelte di lungo periodo hai rimandato per mancanza di certezza?',
    'transit:saturn|sextil|jupiter':
      'Saturno in sestile a Giove apre una finestra per incanalare l espansione in piano eseguibile, temperando l ottimismo con criteri pratici. Il ciclo sostiene una crescita per tappe senza gli eccessi che di solito accompagnano Giove senza l ancora di Saturno. Cosa potresti iniziare adesso che richiede sia audacia sia metodo?',
    'transit:saturn|trigono|jupiter':
      'Saturno in trigono a Giove crea uno dei cicli piu favorevoli per crescere con base, dove espansione e metodo si allineano in modo naturale. I progetti di medio e lungo periodo tendono ad avanzare con piu trazione e meno usura rispetto ad altri momenti. Quale opportunita reale attende solo struttura e impegno di esecuzione?',
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
      'Saturno in opposizione a Giove natale mette in tensione espansione e limite nello stesso punto decisionale, mostrando dove ottimismo e realta divergono. Questa fase puo rivelare progetti cresciuti senza struttura sufficiente — o dove l eccesso di cautela frena cio che ha gia basi per avanzare. Cosa deve essere tagliato perche cio che ha davvero potenziale cresca con piu solidita?',
    'transit:moon|oposicao|jupiter':
      'Luna in opposizione a Giove puo amplificare reattivita emotiva e aspettative immediate. Il ciclo favorisce moderazione e ritorno a scelte realistiche. Pause brevi e priorita piu chiare aiutano a ridurre dispersione.',
    'transit:saturn|oposicao|pluto':
      'Saturno in opposizione a Plutone natale attiva il confronto tra la struttura attuale e il bisogno di trasformazione piu profonda. Questa fase puo mostrare dove potere personale e controllo sono in gioco — la resistenza al cambiamento tende a manifestarsi come rigidita o come crollo di cio che non era abbastanza solido. Cosa stai difendendo che gia sai avere bisogno di trasformazione?',
    'transit:sun|quadratura|moon':
      'Sole in quadratura con Luna puo creare attrito tra intenzione cosciente e bisogno emotivo. La fase chiede allineamento tra cio che vuoi fare e il ritmo interno disponibile. Aggiustamenti semplici di routine e comunicazione riducono tensione.',
    'transit:saturn|sextil|neptune':
      'Saturno in sestile a Nettuno offre forma e metodo a idee creative o intuizioni che tendono a sfuggire all esecuzione per mancanza di ancoraggio. La fase facilita separare visione genuina da fantasia, rendendo possibile avanzare su progetti sensibili con tappe verificabili. Quale progetto creativo sai gia che e fattibile, ma non hai ancora tradotto in struttura?',
    'transit:saturn|trigono|neptune':
      'Saturno in trigono a Nettuno facilita dare struttura a cio che e sottile, intuitivo o creativo, senza perdere l essenza di cio che ispira. Il ciclo tende a rendere piu eseguibili progetti prima nebulosi, con meno confusione tra visione e fantasia. Quale dimensione della tua vita che sembra intangibile potrebbe ricevere una forma concreta ora?',
    'transit:sun|sextil|moon':
      'Sole in sestile con Luna facilita integrazione tra volonta ed emozione. Questa fase tende a migliorare fluidita in dialoghi, aggiustamenti di routine e scelte quotidiane. Usala per allineare priorita interne ed esterne.',
    'transit:sun|trigono|moon':
      'Sole in trigono con Luna rafforza coerenza tra identita e bisogni emotivi. Il periodo porta spesso maggiore stabilita nell organizzare scelte importanti. Approfittane per consolidare abitudini sostenibili.',
    'transit:saturn|sextil|ascendente':
      'Saturno in sestile all Ascendente favorisce consolidare il modo in cui gestisci le responsabilita e ti presenti al mondo, con piu solidita e intenzionalita. La fase tende a rendere piu semplice costruire presenza con coerenza tra chi sei e come agisci. Dove desideri che la tua condotta sia piu riconosciuta e coerente?',
    'transit:saturn|trigono|ascendente':
      'Saturno in trigono all Ascendente facilita esprimersi con maturita naturale, rendendo piu semplice sostenere postura coerente e responsabilita con autorita. La fase genera meno attrito tra intenzione e comportamento, favorendo crescita di presenza con poco sforzo aggiuntivo. Quale abitudine o postura stai cercando di consolidare ma che sembra ancora artificiale?',
    'transit:saturn|oposicao|saturn':
      'Saturno in opposizione al proprio Saturno natale segna un punto di meta ciclo — un confronto tra la struttura costruita e cio che riesce davvero a sostenere. Questa fase tende a rivelare dove le fondamenta sono solide e dove necessitano riformulazione oggettiva, senza romanticismi. Cosa hai costruito finora che merita di continuare, e cosa deve essere ricostruito su nuove basi?',
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
      'Saturno in quadratura alla Luna natale puo intensificare la sensazione di peso emotivo e limitazione nella quotidianita, come se bisogni affettivi e responsabilita concrete fossero in conflitto diretto. Questa fase tende a mostrare dove la cura di se e stata trascurata o dove il sovraccarico comprime lo spazio interiore necessario. Cosa stai portando emotivamente che potrebbe essere distribuito, negoziato o lasciato andare?',
    'transit:moon|quadratura|jupiter':
      'Luna in quadratura con Giove puo gonfiare aspettative e oscillazioni emotive sui risultati. Questa fase richiede moderazione per evitare eccessi affettivi o decisionali. Rivedi priorita e resta su cio che e fattibile ora.',
    'transit:uranus|sextil|moon':
      'Urano in sestile con Luna favorisce rinnovamento emotivo con piu leggerezza e creativita. Il periodo aiuta a sperimentare nuove abitudini senza rotture brusche. Piccoli cambiamenti consapevoli migliorano rapidamente il benessere.',
    'transit:uranus|trigono|moon':
      'Urano in trigono con Luna facilita aggiornare schemi emotivi con maggiore autonomia. Questa fase apre spazio a scelte quotidiane piu autentiche. Usa la flessibilita per regolare routine e legami in modo responsabile.',
    'transit:pluto|oposicao|venus':
      'Plutone in opposizione a Venere natale puo intensificare temi di potere, attaccamento e reciprocita nei legami, dove cio che prima sembrava stabile mostra tensione tra cio che e genuino e cio che e solo un accordo di convenienza. Questa fase tende a rivelare dinamiche di dipendenza o controllo in relazioni affettive e finanziarie, rendendo piu difficile sostenere accordi che non sono mutuamente sostenibili. Cosa in una relazione o accordo importante sai che non e giusto, ma hai evitato di affrontare direttamente?',
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
      'Saturno in opposizione a Mercurio natale puo rallentare la comunicazione e intensificare l esigenza mentale, rendendo piu difficile organizzare i pensieri e trasmetterli con fluidita. La fase tende a mostrare dove la base analitica o argomentativa e debole — le decisioni che dipendono da chiarezza concettuale diventano piu lente o contestate. Quale punto del tuo ragionamento su questa situazione non hai ancora esaminato con profondita sufficiente?',
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
      'Plutone in sestile con Marte natale crea un apertura per agire con profondita e strategia, dove la forza esecutiva puo essere diretta verso trasformazioni ad alto impatto con meno attrito rispetto agli aspetti di tensione. La fase facilita progetti che richiedono sia vigore che persistenza — il tipo di compito che chiede impegno reale, non solo energia immediata. Quale progetto o cambiamento hai disponibile ora che si gioverebbe di un focus intenso e di un esecuzione strutturata?',
    'transit:pluto|trigono|mars':
      'Plutone in trigono con Marte natale facilita l azione profonda e persistente, dove la forza esecutiva incontra l intenzione strategica senza l attrito degli aspetti di tensione. La fase crea condizioni per trasformazioni ben radicate, dove lo sforzo si accumula verso risultati strutturali e di lungo periodo. Quale cambiamento hai rimandato perche sembrava troppo grande — e trova ora il momento giusto per cominciare?',
    'transit:pluto|quadratura|moon':
      'Plutone in quadratura con la Luna natale puo intensificare le vulnerabilita emotive e rivelare dove i meccanismi di protezione affettiva operano in modo automatico o eccessivo. La fase tende a portare in superficie schemi ereditati che regolavano la sicurezza emotiva — ma che ora generano piu costo che stabilita. Cosa nei tuoi schemi di protezione emotiva serve a una versione piu antica di te, e cosa potresti lasciare andare per avere piu spazio interiore ora?',
    'transit:moon|conjuncao|sun':
      'Luna in congiunzione con Sole segna un punto di reset emotivo e allineamento d intenzione. La fase favorisce aggiustamenti semplici di priorita e apertura a nuovi cicli d azione. Definisci un passo breve e costante per dare direzione alla giornata.',
    'transit:pluto|sextil|sun':
      'Plutone in sestile al Sole natale facilita il rafforzamento interiore e il riposizionamento dell identita con piu autenticita, dove cio che non corrisponde piu a cio che si e diventati puo essere chiuso senza necessita di rottura drammatica. La fase favorisce decisioni profonde che emergono da chiarezza genuina, non da crisi. Quale parte di chi eri porti ancora per abitudine — e quale chiarezza interiore hai gia per lasciare andare cio che non e piu reale?',
    'transit:pluto|trigono|sun':
      'Plutone in trigono al Sole natale facilita la trasformazione dell identita con fluidita, dove cio che deve essere chiuso puo essere chiuso e cio che deve emergere trova condizioni favorevoli per consolidarsi. La fase favorisce chiarezza di scopo e azioni allineate con cio che e genuino, senza l attrito degli aspetti di tensione. Quale aspetto della tua identita o direzione e pronto per essere consolidato con piu intenzionalita ora?',
    'transit:saturn|oposicao|ascendente':
      'Saturno in opposizione all Ascendente natale puo intensificare tensione nelle relazioni vicine, rivelando dove i confini personali o gli accordi di convivenza necessitano revisione oggettiva. Questa fase tende a portare confronti con cio che l altro si aspetta — chiedendo che tu decida cosa puoi sostenere senza sacrificare la tua coerenza. Cosa devi rinegoziare in relazioni che e rimasto implicito per troppo tempo?',
    'transit:pluto|conjuncao|mars':
      'Plutone in congiunzione a Marte natale amplifica la forza di azione con una intensita che puo servire sia a progetti ad alto impatto sia a escalare conflitti per eccesso di forza di volonta. Questa fase tende a rivelare dove il potere di agire viene usato in modo costruttivo o distruttivo — la differenza spesso sta nella chiarezza di direzione. Dove stai dirigendo l intensita di azione che questo ciclo mette a disposizione?',
    'transit:sun|oposicao|uranus':
      'Sole in opposizione a Urano puo portare rottura di ritmo, reazione ai limiti e desiderio immediato di liberta. La fase richiede flessibilita con responsabilita per evitare decisioni brusche. Rivedi priorita e correggi rotta senza perdere coerenza.',
    'transit:uranus|quadratura|sun':
      'Urano in quadratura al Sole segnala tensione tra identita attuale e bisogno di cambiamento. Il ciclo puo generare inquietudine, impazienza e desiderio di cambiare tutto subito. Innova per fasi per preservare base e guadagnare autonomia stabile.',
    'transit:saturn|oposicao|sun':
      'Saturno in opposizione al Sole natale attiva pressione esterna e una prova di autenticita personale, creando tensione tra chi sei e cio che il contesto esige. Questa fase puo mostrare dove l identita dipende da validazione per avanzare — l usura viene spesso dal tentare di compiacere e di recitare allo stesso tempo. Cosa stai facendo per obbligo che potrebbe farsi da scelta genuina, o semplicemente interrompersi?',
    'transit:saturn|quadratura|venus':
      'Saturno in quadratura a Venere natale puo esporre attrito in relazioni o attorno ai propri valori, rendendo piu evidente cio che e insostenibile negli accordi affettivi o finanziari. Questa fase tende a ridurre la tolleranza per cio che drena energia — le idealizzazioni diventano piu difficili da sostenere, il che puo generare sia chiarezza sia disagio. Cosa stai ancora sostenendo per paura di perdere qualcosa che ha gia perso il suo valore reale per te?',
    'transit:sun|conjuncao|mercury':
      'Sole in congiunzione con Mercurio favorisce chiarezza mentale, focus comunicativo e decisione oggettiva. La fase tende a sostenere conversazioni importanti, studio e organizzazione delle idee. Dai priorita a messaggi semplici e centrati sull essenziale.',
    'transit:jupiter|conjuncao|moon':
      'Giove in congiunzione con Luna amplia sensibilita, accoglienza e percezione di supporto emotivo. Il ciclo puo favorire apertura affettiva e visione piu ampia dei bisogni interiori. Evita eccessi emotivi e mantieni equilibrio nelle scelte.',
    'transit:jupiter|oposicao|pluto':
      'Giove in opposizione a Plutone puo ampliare conflitti di visione, controllo e potere decisionale. Il periodo richiede calibrare ambizione con etica, profondita e senso del limite. La crescita stabile nasce da strategia, non da mosse estreme.',
    'transit:neptune|quadratura|venus':
      'Nettuno in quadratura con Venere puo generare idealizzazione affettiva e confusione su valore e reciprocita. Il ciclo richiede discernimento per distinguere intuizione da proiezione. Osserva segnali concreti prima di accordi emotivi o finanziari.',
    'transit:saturn|sextil|moon':
      'Saturno in sestile con Luna apre spazio per tradurre bisogni emotivi in routine affettive piu stabili e consapevoli. La fase facilita distinguere cio che e sentimento genuino da cio che e reattivita abitudinale, rendendo la cura piu strutturata. Quale schema emotivo vuoi trasformare in scelta consapevole, non in reazione automatica?',
    'transit:saturn|trigono|moon':
      'Saturno in trigono con Luna facilita l equilibrio tra vita emotiva e responsabilita concrete, con minor costo interiore rispetto ai cicli di tensione. Il ciclo offre spesso serenita e chiarezza per prendere decisioni affettive con piu maturita. Quale decisione in relazioni o routine di cura hai rimandato per paura del disagio?',
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
      'Plutone in congiunzione al Sole natale avvia un ciclo di trasformazione dell identita in cui cio che prima sosteneva l immagine di se viene messo in discussione o diventa insostenibile. Questa fase tende ad accelerare il taglio di cio che e superficiale o di performance — la pressione per l autenticita aumenta, con meno tolleranza per cio che non e genuino. Cosa hai mantenuto nella tua immagine che non corrisponde piu a chi stai diventando?',
    'transit:pluto|quadratura|mars':
      'Plutone in quadratura con Marte puo alzare pressione, impazienza e conflitti di controllo nell azione. Il ciclo richiede esecuzione disciplinata e uso consapevole della forza. Concentrati sui compiti essenziali ed evita scontri reattivi.',
    'transit:saturn|conjuncao|jupiter':
      'Saturno in congiunzione con Giove unisce espansione e struttura con visione di lungo periodo. Il periodo favorisce crescita realistica, priorita oggettive e criteri piu forti di esecuzione. Costruisci per fasi per mantenere sostenibilita.',
    'transit:saturn|sextil|uranus':
      'Saturno in sestile a Urano crea condizioni per rinnovare routine o strutture in modo incrementale, senza il rischio di rottura degli aspetti di tensione. La fase facilita innovazioni pratiche, dove nuovi metodi possono essere testati senza compromettere cio che gia sostiene risultati. Quale cambiamento hai evitato per paura di destabilizzare cio che funziona?',
    'transit:saturn|trigono|uranus':
      'Saturno in trigono a Urano rende semplice modernizzare processi e strutture con naturalezza, senza l attrito degli aspetti piu tesi. Il ciclo tende a rendere piu praticabili cambiamenti prima rischiosi con pianificazione semplice ed esecuzione graduale. Quale aggiornamento sai gia che e necessario, ma hai atteso il momento giusto?',
    'transit:uranus|sextil|mars':
      'Urano in sestile con Marte aumenta iniziativa, agilita e sperimentazione tattica. Questa fase tende a favorire aggiustamenti intelligenti e azione piu rapida con consapevolezza. Mantieni focus su innovazione utile, non su accelerazione cieca.',
    'transit:uranus|trigono|mars':
      'Urano in trigono con Marte migliora azione decisa con flessibilita e problem solving creativo. Il ciclo sostiene cambiamenti produttivi quando le priorita sono esplicite. Usa slancio per sbloccare progresso concreto.',
    'transit:jupiter|oposicao|saturn':
      'Giove in opposizione a Saturno evidenzia tensione tra espansione e limiti. Questa fase richiede equilibrio tra visione e fattibilita negli impegni correnti. Ricalibra obiettivi, scadenze e distribuzione delle risorse.',
    'transit:neptune|conjuncao|meio_do_ceu':
      'Nettuno in congiunzione al Medio Cielo puo aumentare sensibilita su vocazione, immagine e senso professionale. Questa fase richiede discernimento tra ispirazione e proiezione. Mantieni direzione chiara e valida decisioni con segnali concreti.',
    'transit:saturn|sextil|meio_do_ceu':
      'Saturno in sestile al Medio Cielo apre una finestra per consolidare la reputazione professionale con consegne oggettive e decisioni di lungo periodo piu solide. La fase favorisce avanzamenti di carriera che dipendono dal dimostrare responsabilita, non solo visibilita. Quale passo professionale puoi compiere adesso che costruira una base duratura?',
    'transit:saturn|trigono|meio_do_ceu':
      'Saturno in trigono al Medio Cielo facilita avanzare nella traiettoria professionale con meno attrito, dove metodo e credibilita si allineano in modo piu naturale. Il ciclo sostiene posizionamenti di lungo periodo e tende a generare riconoscimento quando la consegna e coerente e la direzione e chiara. Quale livello di impegno con la tua carriera sei pronto a sostenere d ora in avanti?',
    'transit:uranus|conjuncao|sun':
      'Urano in congiunzione con Sole tende ad accelerare aggiornamenti identitari e riposizionamento personale. Questa fase puo aumentare bisogno di autonomia e scelte sperimentali. Innova con responsabilita per evitare instabilita improvvisa.',
    'transit:jupiter|oposicao|neptune':
      'Giove in opposizione a Nettuno puo ampliare idealizzazione e aspettative diffuse senza verifica concreta. Il ciclo richiede criteri piu chiari e controllo dei fatti prima di decisioni importanti. Mantieni ispirazione con base pratica.',
    'transit:jupiter|quadratura|neptune':
      'Giove in quadratura con Nettuno puo aumentare entusiasmo con minore chiarezza sui limiti reali. Questa fase richiede distinguere tra visione fondata e proiezione ottimistica. Rivedi ipotesi e regola il ritmo di espansione.',
    'transit:pluto|conjuncao|saturn':
      'Plutone in congiunzione con Saturno approfondisce trasformazione strutturale e responsabilita centrali. Il ciclo puo richiedere decisioni mature su controllo, tenuta e ricostruzione necessaria. Procedi per fasi con strategia e confini netti.',
    'transit:pluto|oposicao|jupiter':
      'Plutone in opposizione a Giove natale puo amplificare conflitti tra ambizione di crescita e bisogno di potere o controllo, dove espansione e profondita strategica diventano difficili da allineare. Questa fase tende a rivelare dove la crescita viene cercata senza una base etica sufficiente o dove la scala desiderata supera la capacita di sostenere il risultato. Cosa vuoi costruire che ha bisogno di piu profondita e meno scala per diventare davvero solido e duraturo?',
    'transit:saturn|quadratura|mars':
      'Saturno in quadratura a Marte natale puo generare attrito tra l impulso di agire e gli ostacoli di ritmo, tecnica o contesto — l azione diventa piu costosa e piu resistita del normale. Questa fase tende a mostrare dove strategia ed esecuzione sono disallineate: energia disponibile, ma direzione o preparazione insufficienti. Cosa stai cercando di forzare che risponderebbe meglio a un approccio piu tattico e graduale?',
    'transit:jupiter|quadratura|venus':
      'Giove in quadratura con Venere puo aumentare ricerca di piacere e ottimismo in scelte affettive o finanziarie. Questa fase favorisce moderazione e criteri di valore piu chiari. Espandi con equilibrio per evitare eccessi.',
    'transit:neptune|quadratura|saturn':
      'Nettuno in quadratura con Saturno puo mettere in tensione certezze, struttura e tolleranza all ambiguita. Questa fase richiede rivedere aspettative e ricostruire piani con flessibilita realistica. Unisci intuizione e verifica oggettiva.',
    'transit:pluto|oposicao|sun':
      'Plutone in opposizione al Sole natale puo attivare dispute di potere e autenticita in relazioni importanti, dove l altro funziona da specchio di qualcosa che non e ancora stato integrato internamente. Questa fase tende a mostrare dove l identita personale viene negoziata o persa in risposta ad aspettative esterne, con pressione crescente per recuperare coerenza interiore. Cosa stai lasciando che altri definiscano di te che devi riprendere con piu consapevolezza e fermezza?',
    'transit:pluto|oposicao|mars':
      'Plutone in opposizione a Marte natale puo elevare il potenziale di conflitto per forza di volonta, dove l energia di azione incontra resistenza esterna che la mette in tensione o la riflette con uguale intensita. Questa fase tende a rivelare dove l impulso di agire e piu sul controllo che sulla direzione genuina — il che aumenta l attrito con chi o cio che non cede facilmente. Cosa nel tuo modo di agire sta generando piu resistenza che risultati, e cosa dice della direzione che hai scelto?',
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
      'Nettuno in congiunzione con il Sole natale amplifica la sensibilita di identita e puo creare una ricerca piu intensa di senso, rendendo piu difficile capire dove finisce l intuizione e dove inizia l idealizzazione. La fase tende a dissolvere i contorni della direzione stabilita — il che puo essere sia rinnovamento profondo che dispersione senza ancoraggio. Cosa nella tua ricerca attuale e genuinamente tuo, e cosa e aspettativa su come dovresti essere?',
    'transit:neptune|conjuncao|moon':
      'Nettuno in congiunzione con la Luna natale intensifica la vita emotiva e la permeabilita affettiva, rendendo piu facile cogliere i bisogni degli altri ma piu difficile discernere cio che e genuinamente proprio. La fase puo portare raffinamento dell empatia o, senza ancoraggio, confusione tra cio che si sente e cio che si assorbe dall ambiente. Quale parte di cio che stai sentendo ora e tua, e quale parte e eco dell ambiente che devi lasciare attraversare senza trattenere?',
    'transit:neptune|conjuncao|mercury':
      'Nettuno in congiunzione con Mercurio natale amplia l intuizione e la lettura simbolica della realta, rendendo il pensiero piu associativo e meno lineare. La fase puo potenziare creativita e percezione sottile — ma aumenta anche il rischio di confusione in dettagli, scadenze e accordi concreti. Dove ti stai affidando a un intuizione non ancora verificata, e dove quella verifica e necessaria per procedere con piu solidita?',
    'transit:neptune|conjuncao|venus':
      'Nettuno in congiunzione con Venere natale puo amplificare l idealizzazione in legami e valori, rendendo piu difficile percepire cosa e affetto genuino e cosa e proiezione di come le cose dovrebbero essere. La fase puo portare apertura estetica e sensibilita affettiva o, senza discernimento, coinvolgimenti costruiti sull aspettativa piu che sulla reciprocita reale. Cosa in un legame o scelta di valore preferisci idealizzare invece di osservare con piu attenzione?',
    'transit:neptune|conjuncao|mars':
      'Nettuno in congiunzione con Marte natale puo ridurre la nitidezza dell azione, rendendo piu difficile sostenere la forza esecutiva senza che l energia si disperda in direzioni multiple o mal definite. La fase tende a richiedere che l impulso di agire incontri un intenzione molto chiara — senza di essa, il ciclo produce sforzo senza trazione o entusiasmo che svanisce prima di materializzare risultati. Quale e l azione piu concreta che puoi impegnarti a fare oggi, senza dipendere da chiarezza totale per iniziare?',
    'transit:neptune|conjuncao|jupiter':
      'Nettuno in congiunzione con Giove natale amplifica la ricerca di senso e l espansione, con il rischio di gonfiare aspettative ben oltre cio che i fatti concreti supportano. La fase puo portare visione genuina e apertura o costruire una narrativa ottimistica molto piu grande di cio che puo essere realizzato ora. Cosa nella tua espansione attuale ha un fondamento verificabile, e cosa e solo ottimismo che non e ancora stato testato dalla realta?',
    'transit:neptune|conjuncao|saturn':
      'Nettuno in congiunzione con Saturno natale mette in tensione struttura e sensibilita sullo stesso asse, dove cio che ha bisogno di forma incontra cio che resiste a essere contenuto. La fase puo dissolvere routine diventate meccaniche — un invito a ricostruire il metodo con piu flessibilita, ma con il rischio di perdere l ancora che ancora sostiene i risultati. Cosa nella tua organizzazione attuale ha bisogno di piu sensibilita, e cosa ha bisogno di piu fermezza per non dissolversi?',
    'transit:neptune|conjuncao|neptune':
      'Nettuno in congiunzione con Nettuno segna un riallineamento di ciclo lungo su senso, intuizione e proiezione. La fase puo dissolvere riferimenti vecchi e chiedere orientamento piu sottile. Mantieni ancoraggi pratici attivi mentre riorganizzi visione interiore.',
    'transit:neptune|conjuncao|ascendente':
      'Nettuno in congiunzione con l Ascendente natale puo alterare progressivamente l immagine di se e i confini dell io, rendendo piu difficile distinguere chi si e da cio che si proietta o da cio che l ambiente si aspetta. La fase puo portare rinnovamento della presenza e dissoluzione di vecchie maschere o, senza ancoraggio, confusione su identita e confini. Cosa nel tuo modo di presentarti al mondo non e piu del tutto vero, e cosa sta cercando di emergere con piu autenticita?',

    // ── Mars completion ────────────────────────────────────────────────────
    'transit:mars|sextil|sun':
      'Marte in sextile al Sole favorisce iniziativa con lettura chiara di direzione personale e energia disponibile. Questo ciclo tende a supportare azione focalizzata quando volonta e priorita reale sono integrate. Usa il momento per avanzare obiettivi concreti con obiettivita.',
    'transit:mars|sextil|meio_do_ceu':
      'Marte in sextile al Medio Cielo favorisce iniziativa professionale con buon ritmo e allineamento di direzione. Questo ciclo tende a supportare mosse strategiche quando il focus e su obiettivi di visibilita. Esegui per priorita e monitora avanzamento con criteri chiari.',
    'transit:mars|conjuncao|meio_do_ceu':
      'Marte in congiunzione al Medio Cielo intensifica l impulso ad agire sulla carriera e la visibilita pubblica. Questa fase favorisce iniziative di posizionamento quando l energia e canalizzata con strategia e senza eccessiva fretta. Avanza su obiettivi professionali concreti privilegiando consistenza di risultato sulla velocita di esecuzione.',
    'transit:mars|quadratura|meio_do_ceu':
      'Marte in quadratura al Medio Cielo puo creare attrito tra l impulso ad agire e le esigenze della vita professionale o della reputazione. Questa fase tende a evidenziare dove il ritmo di esecuzione e le aspettative esterne sono disallineati. Riduci dispersione, dai priorita a cio che ha impatto diretto ed evita confronti inutili nell ambiente di lavoro.',
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
    'transit:sun|conjuncao|ascendente':
      'Il Sole in congiunzione al Ascendente natale segna l inizio di un nuovo ciclo annuale di espressione personale e proiezione nel mondo. La vitalita, la presenza e il bisogno di chiarezza su chi sei tendono ad accentuarsi durante questo periodo. Investi nel definire cio che desideri proiettare in questo ciclo.',
    'transit:sun|conjuncao|jupiter':
      'Il Sole in congiunzione a Giove natale amplia la fiducia, la disposizione alla crescita e l apertura verso nuove possibilita. Il ciclo favorisce iniziative di espansione quando vi e discernimento su cio che merita davvero investimento. Evita l entusiasmo eccessivo senza ancorarsi a cio che e realistico.',
    'transit:sun|conjuncao|mars':
      'Il Sole in congiunzione a Marte natale intensifica l energia disponibile, lo slancio ad agire e la capacita di sostenere sforzo focalizzato. Il ciclo tende a rafforzare la determinazione e la disponibilita ad affrontare le sfide con decisione. Canalizza la forza con direzione chiara per evitare impulsivita.',
    'transit:sun|conjuncao|meio_do_ceu':
      'Il Sole in congiunzione al Medio Cielo natale illumina il percorso professionale e amplia la visibilita pubblica. Il periodo tende a favorire riconoscimento e opportunita legate alla posizione sociale e alla carriera. Definisci con chiarezza cosa vuoi mostrare e cosa intendi raggiungere.',
    'transit:sun|conjuncao|moon':
      'Il Sole in congiunzione alla Luna natale crea convergenza tra identita consapevole e mondo emotivo interno. Il ciclo favorisce l allineamento tra cio che si sente e cio che si vuole costruire, riducendo i conflitti interni. Usa il periodo per integrare i bisogni personali con la direzione di vita che stai seguendo.',
    'transit:sun|conjuncao|neptune':
      'Il Sole in congiunzione a Nettuno natale amplia sensibilita, creativita e ricettivita verso cio che va oltre l ordinario. Il ciclo favorisce il lavoro artistico, le pratiche spirituali e l empatia, ma puo ridurre temporaneamente la chiarezza pratica. Mantieni ancoraggi concreti mentre esplori cio che e piu sottile.',
    'transit:sun|conjuncao|saturn':
      'Il Sole in congiunzione a Saturno natale richiama l attenzione sulla struttura, la responsabilita e il peso di cio che ancora deve essere consolidato. Il ciclo invita a una valutazione onesta di cio che e stato costruito e al rafforzamento di cio che e fragile. Affronta le esigenze come opportunita di maturita genuina.',
    'transit:sun|conjuncao|sun':
      'Il Sole in congiunzione al Sole natale segna il ritorno solare, l inizio di un nuovo ciclo annuale completo di identita e scopo. Il momento invita a rivedere l anno precedente e a definire con chiarezza cosa coltivare nei prossimi dodici mesi. Stabilisci intenzioni con consapevolezza di cio che e davvero prioritario.',
    'transit:sun|conjuncao|uranus':
      'Il Sole in congiunzione a Urano natale accende lo slancio verso la rottura con il convenzionale e l espressione della singolarita personale. Il ciclo puo portare cambiamenti bruschi o un intenso desiderio di alterare cio che e stabilito. Abbraccia l originalita con strategia per evitare instabilita non necessaria.',
    'transit:sun|conjuncao|venus':
      'Il Sole in congiunzione a Venere natale evidenzia piacere, estetica, creativita e cio che attrae e soddisfa genuinamente. Il ciclo tende ad amplificare la facilita di connessione, l espressione affettiva e l apprezzamento di cio che e bello e prezioso. Investi in attivita che nutrono soddisfazione reale e relazioni di qualita.',
    'transit:sun|ingress|house_1':
      'Il Sole in transito per la Casa 1 evidenzia l identita, la presenza fisica e il modo in cui ti presenti al mondo. La vitalita e il desiderio di espressione personale diretta tendono a essere in primo piano. Buona finestra per riaffermare chi sei e cosa vuoi proiettare in questo ciclo.',
    'transit:sun|ingress|house_2':
      'Il Sole in transito per la Casa 2 porta attenzione verso le risorse materiali, i valori personali e cio che e davvero utile e prezioso per te. Il ciclo favorisce la revisione delle finanze e la chiarezza su cio che sostiene sicurezza e benessere. Dai priorita alle decisioni materiali con criterio e allineamento a cio che conta genuinamente.',
    'transit:sun|ingress|house_3':
      'Il Sole in transito per la Casa 3 illumina la comunicazione, l apprendimento e gli scambi quotidiani con l ambiente piu immediato. La curiosita, la mobilita e la disponibilita a connettere idee e persone tendono ad accentuarsi. Buon ciclo per scrivere, studiare e rafforzare le reti di contatto vicine.',
    'transit:sun|ingress|house_5':
      'Il Sole in transito per la Casa 5 evidenzia la creativita, l espressione ludica, il romanticismo e il genuino piacere di essere se stessi. Il ciclo favorisce progetti artistici, attivita ricreative e connessioni affettive con piu autenticita. Buon momento per coltivare cio che porta gioia ed esprimere talenti con fiducia.',
    'transit:sun|ingress|house_6':
      'Il Sole in transito per la Casa 6 porta il focus sul lavoro, la salute, le routine e i processi che sostengono il quotidiano. Il ciclo favorisce l attenzione ai dettagli, al corpo e all efficienza delle abitudini quotidiane. Adatta le routine che sostengono produttivita e benessere in modo coerente.',
    'transit:sun|ingress|house_7':
      'Il Sole in transito per la Casa 7 illumina le partnership, le relazioni e cio che emerge attraverso il contatto significativo con l altro. Il periodo favorisce maggiore chiarezza su impegni, cooperazione e cio che si cerca in relazioni importanti. Buon momento per affrontare temi di partnership con apertura e onesta.',
    'transit:sun|ingress|house_8':
      'Il Sole in transito per la Casa 8 approfondisce le questioni di trasformazione, risorse condivise e legami di fiducia. Il ciclo puo portare in superficie temi come eredita, investimenti congiunti e cio che deve essere rilasciato o rinnovato. Un periodo favorevole per l intuizione su cio che e nascosto e per processi di rinnovamento reale.',
    'transit:sun|ingress|house_9':
      'Il Sole in transito per la Casa 9 espande il focus verso la filosofia, i viaggi, l istruzione superiore e visioni del mondo piu ampie. La curiosita per l ignoto e la disponibilita ad andare oltre il familiare tendono ad essere elevate. Buon momento per studiare, viaggiare e rivisitare le credenze con mente aperta.',
    'transit:sun|ingress|house_11':
      'Il Sole in transito per la Casa 11 evidenzia gruppi, reti sociali, progetti collettivi e gli ideali che orientano il futuro. Le connessioni con persone di valori simili e la partecipazione in iniziative collettive possono guadagnare rilevanza. Buona finestra per collaborare, rivedere obiettivi a lungo termine e rafforzare alleanze.',
    'transit:sun|ingress|house_12':
      'Il Sole in transito per la Casa 12 invita a un periodo di introspezione, raccoglimento e contatto con cio che normalmente resta fuori dalla coscienza quotidiana. La vita interiore, le pratiche contemplative e il lavoro dietro le quinte tendono a guadagnare importanza. Buon momento per integrare esperienze e processare cio che necessita ancora chiusura.',
    'transit:sun|oposicao|ascendente':
      'Il Sole in opposizione al Ascendente natale coincide con il transito per il Discendente, portando luce nelle relazioni e in cio che l altro rispecchia. Il periodo tende a evidenziare accordi, partnership e come l identita si esprime nel contesto relazionale. Buona finestra per riesaminare gli impegni con onesta e apertura.',
    'transit:sun|oposicao|jupiter':
      'Il Sole in opposizione a Giove natale puo amplificare tendenze all eccesso o a una fiducia sproporzionata rispetto a cio che e realisticamente fattibile. Il ciclo invita a verificare se l ottimismo ha basi solide o solo entusiasmo momentaneo. Bilancia espansione e moderazione per evitare promesse al di la della capacita.',
    'transit:sun|oposicao|mars':
      'Il Sole in opposizione a Marte natale puo portare tensione tra la volonta personale e le forze esterne che offrono resistenza. Conflitti diretti o competizioni possono guadagnare visibilita durante questo ciclo. Canalizza l energia in modo assertivo, senza reattivita, per attraversare il periodo con meno esaurimento.',
    'transit:sun|oposicao|meio_do_ceu':
      'Il Sole in opposizione al Medio Cielo natale transita per il Fondo del Cielo, dirigendo l attenzione alla vita privata, alla famiglia e alle radici. Il periodo invita a valutare come la base personale sostiene o limita la proiezione pubblica. Buon momento per prendersi cura del ambiente domestico e rafforzare il supporto emotivo interno.',
    'transit:sun|oposicao|mercury':
      'Il Sole in opposizione a Mercurio natale puo portare cambiamenti nelle comunicazioni, nelle prospettive o in informazioni rilevanti. Altri possono presentare punti di vista che contraddicono o mettono in discussione cio che sembrava stabilito. Ascolta con apertura e rivedi le conclusioni prima di prendere una posizione definitiva.',
    'transit:sun|oposicao|moon':
      'Il Sole in opposizione alla Luna natale puo creare tensione tra i bisogni emotivi e la direzione consapevole della vita. Cio che si sente e cio che si vuole realizzare possono sembrare in conflitto durante questo ciclo. Buona finestra per una maggiore consapevolezza dei propri bisogni e di come si relazionano ai tuoi obiettivi.',
    'transit:sun|oposicao|saturn':
      'Il Sole in opposizione a Saturno natale porta valutazione dei limiti, responsabilita irrisolte e il peso di cio che ancora deve essere affrontato. Il ciclo puo rivelare dove la struttura e fragile o dove la disciplina e stata rinviata. Affrontare le esigenze con onesta e il percorso piu produttivo in questo momento.',
    'transit:sun|oposicao|sun':
      'Il Sole in opposizione al Sole natale segna il punto medio del ciclo annuale, portando luce su cio che fu iniziato al ritorno solare. Il periodo tende a evidenziare le relazioni e cio che l altro riflette del tuo stesso percorso. Buona finestra per valutare il progresso del ciclo personale con chiarezza.',
    'transit:sun|oposicao|venus':
      'Il Sole in opposizione a Venere natale puo creare tensione tra cio che piace e cio che e necessario, tra piacere e responsabilita. Le relazioni o le questioni finanziarie possono richiedere attenzione e revisione durante questo ciclo. La chiarezza su cio che si valorizza genuinamente aiuta a prendere decisioni con maggiore discernimento.',
    'transit:sun|quadratura|ascendente':
      'Il Sole in quadratura al Ascendente natale puo portare attrito tra l identita personale e le aspettative del contesto immediato. Il ciclo invita ad aggiustamenti nel modo di presentarsi o nel rapporto con l ambiente vicino. Buona finestra per identificare dove l espressione personale richiede piu autenticita.',
    'transit:sun|quadratura|jupiter':
      'Il Sole in quadratura a Giove natale puo amplificare gli impulsi di espansione senza sufficiente ancoraggio a cio che e realisticamente fattibile. Eccesso di fiducia, promesse oltre la capacita o spese sproporzionate possono emergere come sfide. Usa il discernimento per separare cio che ha fondamento da cio che e solo entusiasmo.',
    'transit:sun|quadratura|mars':
      'Il Sole in quadratura a Marte natale genera attrito tra la volonta di agire e le resistenze che il contesto offre. Conflitto, impazienza ed esaurimento energetico possono emergere se l azione e forzata senza direzione chiara. Canalizza la pressione verso la risoluzione di ostacoli concreti invece di reagire impulsivamente.',
    'transit:sun|quadratura|meio_do_ceu':
      'Il Sole in quadratura al Medio Cielo natale crea tensione tra lo sviluppo personale interno e le richieste del percorso professionale. Le scelte di carriera, reputazione o direzione di vita possono sembrare piu impegnative durante questo periodo. Rivedi se gli obiettivi esterni riflettono valori e bisogni genuini prima di agire.',
    'transit:sun|quadratura|mercury':
      'Il Sole in quadratura a Mercurio natale puo portare pressione sulle comunicazioni, le decisioni o l elaborazione di informazioni importanti. Malintesi, sovraccarico cognitivo o difficolta ad articolare pensieri possono emergere durante questo ciclo. Rallenta prima di comunicare e verifica cio che e stato compreso.',
    'transit:sun|quadratura|neptune':
      'Il Sole in quadratura a Nettuno natale puo creare confusione tra cio che e reale e cio che e idealizzato o proiettato. La chiarezza percettiva puo essere temporaneamente compromessa, rendendo prudente verificare prima di decidere. Lavora con creativita e intuizione mantenendo ancoraggi pratici solidi.',
    'transit:sun|quadratura|pluto':
      'Il Sole in quadratura a Plutone natale mette in evidenza le dinamiche di potere, controllo e trasformazioni che chiedono attenzione. Il ciclo puo portare confronti con cio che e nascosto o con forze che operano dietro le quinte. L onesta su cio che deve cambiare e la base per attraversare questo periodo con integrita.',
    'transit:sun|quadratura|saturn':
      'Il Sole in quadratura a Saturno natale crea pressione tra i desideri di espressione e i limiti strutturali o le responsabilita non adempiute. Il ciclo puo sembrare pesante, con ostacoli che richiedono pazienza e disciplina. Tratta le restrizioni come informazioni su cio che deve essere rafforzato.',
    'transit:sun|quadratura|sun':
      'Il Sole in quadratura al Sole natale attiva un punto di tensione nel ciclo annuale, portando sfide legate all identita e all espressione personale. Il momento puo rivelare conflitti tra chi vuoi essere e cio che il contesto permette o richiede. Buona finestra per correggere la rotta e riallineare la direzione con autenticita.',
    'transit:sun|quadratura|uranus':
      'Il Sole in quadratura a Urano natale puo portare interruzioni inaspettate, cambiamenti bruschi o impulsi di ribellione contro lo stabilito. Il desiderio di rottura puo essere intenso, ma senza pianificazione puo risultare in instabilita non necessaria. Integra il bisogno di cambiamento con un approccio piu strategico.',
    'transit:sun|quadratura|venus':
      'Il Sole in quadratura a Venere natale puo generare tensione nelle relazioni, nelle questioni finanziarie o in cio che porta genuinamente soddisfazione. Le decisioni legate al piacere, al denaro o all affetto possono richiedere piu attenzione e cura durante questo ciclo. Rivedi cio che si sta valorizzando e se e allineato ai bisogni reali.',
    'transit:sun|sextil|ascendente':
      'Il Sole in sextile al Ascendente natale crea un momento di espressione personale piu fluida e allineata con l ambiente. L identita trova canali naturali di proiezione senza grande resistenza o sforzo eccessivo. Buon momento per iniziative che coinvolgono presenza, visibilita e comunicazione di cio che rappresenti.',
    'transit:sun|sextil|jupiter':
      'Il Sole in sextile a Giove natale favorisce ottimismo, apertura alle opportunita e una sensazione di espansione accessibile. Il ciclo supporta la crescita quando vi e disponibilita a muoversi nella direzione di cio che e stato intravisto. La fiducia che emerge tende ad essere ben fondata quando applicata con criterio.',
    'transit:sun|sextil|mars':
      'Il Sole in sextile a Marte natale mette a disposizione energia per l azione focalizzata con fluidita e senza l esaurimento del conflitto. Le iniziative personali, i progetti fisici e l affermazione della volonta trovano buon supporto durante questo ciclo. Buon momento per mettere in moto cio che era in pianificazione.',
    'transit:sun|sextil|meio_do_ceu':
      'Il Sole in sextile al Medio Cielo natale supporta la visibilita professionale e l allineamento tra identita e obiettivi di carriera. Il ciclo puo aprire spazio per riconoscimento od opportunita legate alla posizione pubblica. Buon momento per posizionarsi con chiarezza su cio che si offre e si cerca.',
    'transit:sun|sextil|mercury':
      'Il Sole in sextile a Mercurio natale favorisce la chiarezza mentale, la facilita di comunicazione e l elaborazione efficiente delle informazioni. L articolazione delle idee tende a scorrere con maggiore naturalezza, facilitando negoziazioni e scambi. Buon periodo per scrivere, apprendere o condurre conversazioni importanti.',
    'transit:sun|sextil|neptune':
      'Il Sole in sextile a Nettuno natale apre spazio per la creativita, l intuizione e una sensibilita piu ricettiva a cio che non e immediatamente visibile. Il ciclo favorisce il lavoro artistico, le pratiche contemplative e la connessione con cio che va oltre l ordinario. Usa l immaginazione con intenzionalita come strumento produttivo.',
    'transit:sun|sextil|pluto':
      'Il Sole in sextile a Plutone natale favorisce l accesso alla profondita e a risorse che normalmente non vengono mobilitate con facilita. Il ciclo supporta cambiamenti significativi condotti con focus e intenzione, senza la resistenza degli aspetti di tensione. Buona finestra per lavorare la trasformazione personale con meno attrito.',
    'transit:sun|sextil|saturn':
      'Il Sole in sextile a Saturno natale supporta la disciplina produttiva, la struttura efficace e la responsabilita che energizza invece di gravare. I progetti a lungo termine, gli impegni e il lavoro costante trovano buon supporto durante questo ciclo. Momento favorevole per consolidare cio che e stato costruito con vero impegno.',
    'transit:sun|sextil|sun':
      'Il Sole in sextile al Sole natale crea una finestra favorevole per l espressione personale e per attivare il potenziale del ciclo annuale in corso. L identita trova fluidita e la capacita di muoversi verso cio che conta tende ad essere accessibile. Buon momento per iniziative che esprimano chi sei adesso.',
    'transit:sun|sextil|uranus':
      'Il Sole in sextile a Urano natale favorisce originalita, innovazione e apertura verso prospettive fuori dal abituale. Il ciclo supporta cambiamenti creativi e l espressione di cio che e singolare senza generare interruzioni non necessarie. Buon momento per sperimentare, esplorare il diverso e fidarsi dell intuizione innovativa.',
    'transit:sun|sextil|venus':
      'Il Sole in sextile a Venere natale favorisce piacere, creativita e connessioni affettive con piu facilita e naturalezza. Gli scambi sociali, i progetti estetici e l espressione di cio che piace tendono a scorrere bene durante questo ciclo. Buon momento per investire in relazioni, arte e attivita che nutrono soddisfazione genuina.',
    'transit:sun|trigono|ascendente':
      'Il Sole in trigono al Ascendente natale favorisce l espressione autentica e una presenza nel mondo che trova risonanza naturale. L identita e il modo in cui sei percepito tendono ad essere ben allineati durante questo ciclo. Buon momento per presentarti, guidare progetti personali e affermare la tua direzione con fiducia.',
    'transit:sun|trigono|jupiter':
      'Il Sole in trigono a Giove natale favorisce l espansione, la fiducia e la sensazione che il percorso sia aperto per una crescita reale. Le opportunita che arrivano durante questo ciclo tendono ad avere fondamento genuino e a trovare ricettivita. Buon momento per ampliare cio che funziona e intraprendere iniziative con ottimismo.',
    'transit:sun|trigono|mars':
      'Il Sole in trigono a Marte natale porta energia disponibile, coraggio e la capacita di agire con chiarezza e scopo. Le iniziative personali e i progetti che richiedono disponibilita trovano buon terreno durante questo ciclo. Finestra favorevole per realizzazioni concrete, decisioni assertive e lavoro che richiede vigore.',
    'transit:sun|trigono|meio_do_ceu':
      'Il Sole in trigono al Medio Cielo natale supporta l armonia tra identita e percorso professionale, con possibile riconoscimento e chiarezza di direzione. Il ciclo favorisce la progressione nella carriera quando vi e sforzo e allineamento con cio che si vuole costruire. Buon momento per iniziative che aumentano la visibilita con autenticita.',
    'transit:sun|trigono|mercury':
      'Il Sole in trigono a Mercurio natale favorisce la chiarezza di pensiero, la comunicazione efficace e la connessione tra intenzione ed espressione. Le idee scorrono con piu facilita e l articolazione di cio che si pensa tende ad essere elevata durante questo ciclo. Buon momento per presentare progetti, avere conversazioni importanti e sviluppare concetti.',
    'transit:sun|trigono|neptune':
      'Il Sole in trigono a Nettuno natale supporta la creativita, la spiritualita e una sensibilita che arricchisce la percezione del quotidiano. Il ciclo favorisce il contatto con il trascendente, che sia nell arte, nella contemplazione o nell empatia. Finestra propizia per integrare la dimensione piu sottile dell esperienza con la vita pratica.',
    'transit:sun|trigono|pluto':
      'Il Sole in trigono a Plutone natale favorisce la trasformazione profonda condotta con focus e intenzione, senza gli attriti degli aspetti di tensione. Il ciclo puo facilitare il rinnovamento significativo in aree dove vi era bisogno di cambiamento reale. Buon momento per approfondire cio che conta e rilasciare cio che ha perso significato.',
    'transit:sun|trigono|saturn':
      'Il Sole in trigono a Saturno natale favorisce maturita, struttura produttiva e la sensazione che lo sforzo incontri risultati concreti. I progetti che richiedono disciplina e impegno tendono a progredire bene durante questo ciclo. Buona finestra per consolidare cio che e stato costruito e assumere responsabilita con fiducia.',
    'transit:sun|trigono|sun':
      'Il Sole in trigono al Sole natale crea un momento di fluidita e allineamento interno, con l espressione personale che trova buone condizioni per fiorire. Questo punto del ciclo annuale favorisce iniziative, creativita e connessione con il proprio scopo. Buona finestra per avanzare in progetti che esprimano chi stai diventando.',
    'transit:sun|trigono|uranus':
      'Il Sole in trigono a Urano natale favorisce originalita, liberta di espressione e apertura verso cio che e singolare e innovativo. I cambiamenti durante questo ciclo tendono ad essere creativi e ben accolti, senza lo shock di interruzioni forzate. Buon momento per esplorare cio che e autentico e diverso, fidandosi di cio che emerge.',
    'transit:sun|trigono|venus':
      'Il Sole in trigono a Venere natale porta armonia, piacere e la sensazione che le connessioni affettive e creative siano ben sostenute. Il ciclo favorisce l espressione artistica, le relazioni e la capacita di godere cio che la vita offre. Buona finestra per coltivare bellezza, affetto e cio che soddisfa genuinamente.',
    'transit:moon|conjuncao|ascendente':
      'La Luna in congiunzione al Ascendente natale intensifica l espressione emotiva e la ricettivita nel contatto diretto con l ambiente. Il periodo tende a rendere lo stato interno piu visibilmente presente nell interazione e nella comunicazione. Buona finestra per notare come le emozioni plasmano la prima impressione.',
    'transit:moon|conjuncao|jupiter':
      'La Luna in congiunzione a Giove natale amplia il bisogno di senso e appartenenza, rendendo facile confondere entusiasmo genuino con esagerazione emotiva. Le tue aspettative possono crescere piu velocemente di quanto la realta possa confermare — e questo puo generare delusione proporzionale. Usa l impulso per avanzare in qualcosa di gia pianificato, mantenendo una misura concreta di cio che e possibile ora.',
    'transit:moon|conjuncao|meio_do_ceu':
      'La Luna in congiunzione al Medio Cielo natale rende lo stato emotivo piu visibilmente legato al percorso professionale e alla reputazione pubblica. Il ciclo puo portare momenti in cui vita personale e immagine pubblica si incrociano in modo piu evidente. Buona finestra per integrare bisogni emotivi con obiettivi di carriera.',
    'transit:moon|conjuncao|mercury':
      'La Luna in congiunzione a Mercurio natale crea un legame tra il mondo emotivo e l elaborazione mentale, rendendo i sentimenti piu articolabili. Il ciclo favorisce conversazioni profonde, scrittura riflessiva e l espressione di cio che normalmente rimane interno. Buona finestra per nominare e comprendere cio che si sta sentendo.',
    'transit:moon|conjuncao|moon':
      'La Luna in congiunzione alla Luna natale, il ritorno lunare mensile, riavvia il ciclo emotivo e istintivo del mese. Il periodo invita a rivedere i bisogni di cura, conforto e appartenenza che guidano le risposte automatiche. Buon momento per notare dove stanno puntando le emozioni di questo ciclo.',
    'transit:moon|conjuncao|neptune':
      'La Luna in congiunzione a Nettuno natale amplia la permeabilita emotiva e la ricettivita verso cio che e sottile, immaginativo o spirituale. Il ciclo favorisce empatia profonda, creativita e contatto con cio che trascende l ordinario, ma puo dissolvere i confini. Mantieni discernimento su cio che e tuo e cio che e dell altro.',
    'transit:moon|conjuncao|pluto':
      'La Luna in congiunzione a Plutone natale puo portare emozioni con qualita compulsiva — un desiderio intenso di verita, profondita o risoluzione definitiva di qualcosa che disturba. Il rischio e reagire esternamente a cio che e essenzialmente una trasformazione interna: l intensita chiede elaborazione, non azione immediata. Permettiti di sentire il peso senza dover risolvere tutto ora — la chiarezza tende ad arrivare dopo che l intensita passa.',
    'transit:moon|conjuncao|saturn':
      'La Luna in congiunzione a Saturno natale puo portare peso emotivo, sensazione di restrizione affettiva o responsabilita che limitano il flusso naturale dei sentimenti. Il ciclo invita a maturita emotiva, valutazione onesta dei bisogni reali e strutturazione della cura di se. Buon momento per rafforzare la base emotiva con criterio.',
    'transit:moon|conjuncao|venus':
      'La Luna in congiunzione a Venere natale armonizza il mondo emotivo con il piacere, l estetica e il bisogno di connessione affettiva di qualita. Il ciclo favorisce soddisfazione genuina nelle relazioni, attivita creative e ambienti che nutrono il benessere. Buona finestra per coltivare cio che genuinamente piace e alimenta emotivamente.',
    'transit:moon|ingress|house_1':
      'La Luna in transito per la Casa 1 intensifica l espressione emotiva e rende le reazioni interne piu visibilmente presenti nella vita quotidiana. Il periodo favorisce l autoconsapevolezza e il contatto diretto con come lo stato emotivo influenza la presenza. Buona finestra per notare cio che le emozioni rivelano sui bisogni attuali.',
    'transit:moon|ingress|house_3':
      'La Luna in transito per la Casa 3 attiva il mondo emotivo attraverso la comunicazione, l apprendimento e gli scambi quotidiani. Il periodo favorisce conversazioni cariche di significato e piu attente a cio che si sente. Buona finestra per esprimere cio che e interno e per ricevere cio che i vicini vogliono condividere.',
    'transit:moon|ingress|house_5':
      'La Luna in transito per la Casa 5 intensifica il bisogno di espressione creativa, piacere e connessioni affettive che nutrono l autenticita. Il ciclo favorisce attivita ludiche, espressione artistica e relazioni con piu affetto e reciprocita. Buon periodo per coltivare cio che genuinamente rallegra e soddisfa emotivamente.',
    'transit:moon|ingress|house_6':
      'La Luna in transito per la Casa 6 attiva il mondo emotivo attraverso la routine, il lavoro e la cura del corpo. Il periodo favorisce l attenzione a cio di cui il corpo ha bisogno e a come le emozioni influenzano la salute e l efficienza quotidiana. Buona finestra per adattare abitudini che sostengono il benessere emotivo e fisico.',
    'transit:moon|ingress|house_7':
      'La Luna in transito per la Casa 7 intensifica il bisogno di connessione, partnership e ricettivita emotiva nel rapporto con l altro. Il periodo favorisce maggiore sensibilita nelle relazioni e chiarezza su cio che si cerca nel legame. Buona finestra per prendersi cura delle relazioni significative con attenzione e apertura.',
    'transit:moon|ingress|house_8':
      'La Luna in transito per la Casa 8 porta il mondo emotivo nelle zone di profondita, trasformazione e vera intimita. Il ciclo favorisce il contatto con cio che sta sotto la superficie, inclusi timori, attaccamenti e bisogni di rinnovamento. Un periodo di maggiore intensita emotiva che puo essere ben utilizzato con onesta interna.',
    'transit:moon|ingress|house_9':
      'La Luna in transito per la Casa 9 dirige il mondo emotivo verso la ricerca di significato, l espansione della prospettiva e il bisogno di andare oltre il familiare. Il ciclo favorisce curiosita emotiva, apertura verso il diverso e contatto con cio che amplia il senso di scopo. Buon periodo per nutrire la visione del mondo con esperienza reale.',
    'transit:moon|ingress|house_10':
      'La Luna in transito per la Casa 10 connette il mondo emotivo al percorso professionale e all immagine pubblica. Il periodo puo rendere le emozioni piu visibilmente presenti nel contesto di lavoro e carriera. Buona finestra per notare come i bisogni affettivi influenzano obiettivi e decisioni professionali.',
    'transit:moon|ingress|house_11':
      'La Luna in transito per la Casa 11 dirige il mondo emotivo verso gruppi, reti di appartenenza e ideali collettivi. Il ciclo favorisce il bisogno di connessione con la comunita, gli amici e le cause che risuonano con i valori personali. Buon momento per nutrire le relazioni collettive e notare cosa alimenta il senso di appartenenza.',
    'transit:moon|ingress|house_12':
      'La Luna in transito per la Casa 12 porta il mondo emotivo nelle zone di raccoglimento, elaborazione silenziosa e contatto con cio che normalmente non emerge nella coscienza quotidiana. Il ciclo favorisce riposo emotivo, sogni e pratiche contemplative. Buon periodo per integrare sentimenti prima che inizi un nuovo ciclo lunare.',
    'transit:moon|oposicao|ascendente':
      'La Luna in opposizione al Ascendente natale, in transito per il Discendente, amplia la ricettivita emotiva nelle relazioni e cio che l altro specchia sui propri bisogni. Il ciclo puo rendere piu visibili le proiezioni affettive e cio che si aspetta dalla connessione con l altro. Buona finestra per bilanciare cura di se e cura relazionale.',
    'transit:moon|oposicao|meio_do_ceu':
      'La Luna in opposizione al Medio Cielo natale, in transito per il Fondo del Cielo, intensifica la vita interiore, le radici familiari e cio che sostiene emotivamente. Il ciclo puo portare tensione tra bisogni affettivi interni e le richieste della vita pubblica o professionale. Buona finestra per prendersi cura della base emotiva senza trascurare le responsabilita esterne.',
    'transit:moon|oposicao|moon':
      'La Luna in opposizione alla Luna natale, il punto medio del ciclo lunare, illumina cio che fu attivato alla svolta del ciclo mensile. Il periodo puo portare in superficie bisogni che erano sotterranei e confrontare lo stato emotivo con l ambiente esterno. Buona finestra per valutare quanto le emozioni di questo ciclo stiano venendo riconosciute.',
    'transit:moon|oposicao|neptune':
      'La Luna in opposizione a Nettuno natale puo creare confusione tra cio che senti davvero e cio che vorresti sentire — o cio che credi di dover sentire. Il rischio e proiettare speranza su situazioni o persone che non hanno ancora mostrato sufficiente chiarezza per sostenerla. Usa il periodo per chiederti: cosa e reale qui, e cosa e il mio bisogno che le cose siano diverse da cio che sono?',
    'transit:moon|oposicao|pluto':
      'La Luna in opposizione a Plutone natale puo risvegliare impulso di controllo o bisogno di dominare situazioni quando l emozione diventa troppo intensa da sopportare. Il par tende a rivelare dinamiche di potere nelle relazioni vicine — chi ha piu influenza, chi cede, chi trattiene risentimenti. Chiediti: stai reagendo a cio che accade ora o a un vecchio schema che questa situazione ha risvegliato?',
    'transit:moon|oposicao|saturn':
      'La Luna in opposizione a Saturno natale tende a creare conflitto tra il bisogno di accoglienza e l esigenza di funzionalita — cio che senti puo sembrare un ostacolo di fronte a cio che devi compiere. C e rischio di sopprimere emozioni legittime per apparire piu competente o responsabile di quanto ti senti. Momento per riconoscere che prenderti cura di te non e fuggire dalle responsabilita — e cio che sostiene la capacita di adempierle.',
    'transit:moon|oposicao|sun':
      'La Luna in opposizione al Sole natale corrisponde alla luna piena del ciclo personale, portando illuminazione sui bisogni emotivi in relazione agli obiettivi consapevoli. Il periodo puo rendere piu visibili i conflitti tra cio che si sente e cio che si vuole realizzare. Buona finestra per integrare intenzione ed emozione con piu consapevolezza.',
    'transit:moon|oposicao|uranus':
      'La Luna in opposizione a Urano natale puo portare instabilita emotiva, cambiamenti bruschi di umore o necessita di rottura con il familiare. Il ciclo puo rivelare tensione tra bisogno di sicurezza e desiderio di liberta nel mondo affettivo. Buona finestra per accogliere il bisogno di novita senza compromettere il supporto emotivo necessario.',
    'transit:moon|oposicao|venus':
      'La Luna in opposizione a Venere natale puo creare tensione tra cio che hai bisogno affettivamente e cio che riesci a chiedere o ricevere. C e rischio di dare piu di quanto senti o di aspettare che l altro indovini cio che non e stato detto. Momento di nominare il tuo vero bisogno nelle relazioni vicine — senza proiettare mancanza ne fingere che tutto vada bene quando non e cosi.',
    'transit:moon|quadratura|ascendente':
      'La Luna in quadratura al Ascendente natale puo portare attrito tra il mondo emotivo interno e come quello stato si proietta nell ambiente. Il ciclo puo rendere piu difficile mantenere coerenza tra cio che si sente e come si appare al mondo. Buona finestra per identificare dove l espressione emotiva chiede piu autenticita.',
    'transit:moon|quadratura|meio_do_ceu':
      'La Luna in quadratura al Medio Cielo natale puo portare tensione tra bisogni affettivi e le richieste della carriera o dell immagine pubblica. Il ciclo invita a valutare quanto il mondo emotivo viene integrato o ignorato nel percorso professionale. Buona finestra per aggiustare il rapporto tra vita interiore e obiettivi esterni.',
    'transit:moon|quadratura|mercury':
      'La Luna in quadratura a Mercurio natale puo creare conflitto tra cio che vuoi esprimere e cio che la tua logica lascia uscire — il cuore vuole dire cio che la mente sta ancora cercando di organizzare. Il rischio e concludere che le persone non ti capiscono quando, in realta, tu stesso stai ancora elaborando cio che senti. Prima di comunicare qualcosa di importante, permettiti di sentire prima — la chiarezza viene dopo l elaborazione, non prima.',
    'transit:moon|quadratura|moon':
      'La Luna in quadratura alla Luna natale attiva un punto di tensione nel ciclo mensile, rivelando conflitti tra bisogni emotivi e il contesto attuale. Il periodo puo portare instabilita emotiva o difficolta a mantenere l equilibrio affettivo. Buona finestra per identificare cosa necessita aggiustamento nel modo di prendersi cura dei propri bisogni.',
    'transit:moon|quadratura|neptune':
      'La Luna in quadratura a Nettuno natale puo rendere difficile separare cio che senti da cio che immagini, da cio che temi o da cio che vorresti fosse vero — i confini interni diventano porosi. C e tendenza a fuggire in distrazione, sogno o idealizzazione come risposta a una realta scomoda che non e ancora pronta per essere affrontata. Crea piccole ancore fisiche nella vita quotidiana — passeggiate, routine semplici — prima di qualsiasi decisione che coinvolga emozione elevata.',
    'transit:moon|quadratura|pluto':
      'La Luna in quadratura a Plutone natale puo portare impulso di controllare situazioni o persone come forma inconscia di non perdere il controllo su cio che si sente. L intensita emotiva puo generare reazioni sproporzionate a piccole provocazioni — cio che irrita ora raramente e solo cio che sembra essere. Chiediti: sto reagendo al presente o a una vecchia paura che questa situazione ha semplicemente risvegliato?',
    'transit:moon|quadratura|saturn':
      'La Luna in quadratura a Saturno natale puo portare pesantezza, freddezza emotiva o una sensazione di restrizione che inibisce il flusso dei sentimenti. Il ciclo invita a valutare dove la rigidita emotiva o l eccesso di controllo impedisce la ricettivita reale. Buona finestra per bilanciare maturita e apertura emotiva.',
    'transit:moon|quadratura|sun':
      'La Luna in quadratura al Sole natale crea tensione tra il mondo emotivo interno e la direzione consapevole della vita. Il ciclo puo rivelare conflitti tra cio che si sente e cio che si vuole costruire, chiedendo integrazione. Buona finestra per riconoscere i bisogni emotivi senza lasciare che dominino le decisioni a lungo termine.',
    'transit:moon|quadratura|uranus':
      'La Luna in quadratura a Urano natale puo portare impazienza emotiva e urgente voglia di rompere con cio che sembra stagnante — anche quando la direzione del cambiamento non e ancora chiara. Puoi sapere che qualcosa deve cambiare senza sapere esattamente cosa, e questo tende a generare irritazione con cio che e vicino. Osserva cosa provoca piu agitazione interna: quei punti di solito indicano dove il rinnovamento genuino e necessario, non dove l azione impulsiva aiuta.',
    'transit:moon|quadratura|venus':
      'La Luna in quadratura a Venere natale puo generare tensione tra bisogni affettivi genuini e cio che sembra piacevole o esteticamente soddisfacente. Il ciclo puo rivelare conflitti nelle relazioni o insoddisfazione per cio che e stato cercato per piacere superficiale. Buona finestra per distinguere cio che nutre davvero da cio che piace solo momentaneamente.',
    'transit:moon|sextil|ascendente':
      'La Luna in sextile al Ascendente natale crea una finestra di espressione emotiva piu fluida e ben accolta dall ambiente. Il ciclo favorisce ricettivita, autenticita e facilita di connessione attraverso la presenza. Buon momento per condividere cio che si sente e per creare ponti affettivi con l entorno.',
    'transit:moon|sextil|jupiter':
      'La Luna in sextile a Giove natale favorisce benessere emotivo, generosita e la sensazione che i bisogni affettivi possano essere soddisfatti con piu facilita. Il ciclo supporta ottimismo genuino e apertura verso esperienze che ampliano la soddisfazione. Buon momento per nutrire cio che espande il mondo interiore con criterio.',
    'transit:moon|sextil|mars':
      'La Luna in sextile a Marte natale mette a disposizione energia emotiva per l azione con piu fluidita e meno conflitto tra sentimento e iniziativa. Il ciclo favorisce asertivita affettiva e la capacita di agire a partire da cio che si sente. Buon momento per mettere in moto cio che era stato emotivamente trattenuto.',
    'transit:moon|sextil|meio_do_ceu':
      'La Luna in sextile al Medio Cielo natale favorisce l allineamento tra il mondo emotivo e il percorso professionale. Il ciclo supporta decisioni di carriera che tengono conto dei bisogni personali genuini e che nutrono il benessere. Buon momento per integrare cio che si sente con cio che si cerca di costruire professionalmente.',
    'transit:moon|sextil|mercury':
      'La Luna in sextile a Mercurio natale favorisce l articolazione del mondo emotivo in parole e pensieri piu fluidi. Il ciclo supporta conversazioni riflessive, scrittura espressiva e l elaborazione cognitiva dei sentimenti. Buon momento per nominare cio che si sta vivendo e per trovare chi sappia ascoltare.',
    'transit:moon|sextil|moon':
      'La Luna in sextile alla Luna natale crea una finestra di fluidita emotiva e allineamento naturale tra i bisogni interni e il contesto. Il ciclo favorisce ricettivita, cura di se e di chi e vicino senza grandi resistenze. Buon momento per notare cio che nutre e per coltivare cio che sostiene il benessere affettivo.',
    'transit:moon|sextil|neptune':
      'La Luna in sextile a Nettuno natale favorisce sensibilita, intuizione e apertura verso il sottile e il trascendente nel mondo emotivo. Il ciclo supporta creativita, empatia e pratiche contemplative che nutrono la vita interiore. Buon momento per lavorare il mondo immaginativo e spirituale con intenzionalita.',
    'transit:moon|sextil|pluto':
      'La Luna in sextile a Plutone natale favorisce l accesso alla profondita emotiva con piu facilita e meno resistenza rispetto agli aspetti di tensione. Il ciclo supporta processi di trasformazione affettiva condotti con focus e intenzione. Buon momento per lavorare cio che e nascosto nel mondo emotivo con coraggio e cura.',
    'transit:moon|sextil|sun':
      'La Luna in sextile al Sole natale crea una finestra favorevole per l allineamento tra il mondo emotivo e la direzione consapevole della vita. Il ciclo favorisce l integrazione tra cio che si sente e cio che si cerca di realizzare, con meno conflitto interno. Buon momento per prendere decisioni che onorano sia i bisogni affettivi sia gli obiettivi a lungo termine.',
    'transit:moon|sextil|uranus':
      'La Luna in sextile a Urano natale favorisce apertura verso la novita, creativita emotiva e disponibilita a includere il diverso nel mondo affettivo. Il ciclo supporta cambiamenti nel campo emotivo che sono ben accolti e non generano interruzioni non necessarie. Buon momento per esplorare nuovi modi di prendersi cura di se e di relazionarsi.',
    'transit:moon|sextil|venus':
      'La Luna in sextile a Venere natale favorisce armonia emotiva, piacere e connessioni affettive con piu naturalezza e soddisfazione genuina. Il ciclo supporta relazioni nutritive, attivita estetiche e un senso ampliato di benessere. Buon momento per coltivare cio che genuinamente piace e nutre nel mondo affettivo.',
    'transit:moon|trigono|ascendente':
      'La Luna in trigono al Ascendente natale favorisce l espressione emotiva autentica e la ricettivita nell ambiente in modo naturale e ben accolto. Il ciclo facilita connessione, presenza affettiva e allineamento tra cio che si sente e come si appare. Buon momento per coltivare relazioni con autenticita e cura.',
    'transit:moon|trigono|jupiter':
      'La Luna in trigono a Giove natale favorisce benessere emotivo, generosita e la sensazione che il mondo interiore sia in espansione con fondamento. Il ciclo facilita soddisfazione genuina, ottimismo affettivo e apertura verso esperienze arricchenti. Buon momento per nutrire cio che amplia il senso di significato e qualita di vita.',
    'transit:moon|trigono|mars':
      'La Luna in trigono a Marte natale favorisce asertivita emotiva, energia disponibile per agire a partire da cio che si sente e capacita di difendere i bisogni senza conflitto. Il ciclo facilita l integrazione tra azione e mondo affettivo. Buon momento per mettere in moto cio che era stato trattenuto dall esitazione.',
    'transit:moon|trigono|meio_do_ceu':
      'La Luna in trigono al Medio Cielo natale favorisce armonia tra il mondo emotivo e il percorso professionale, con la possibilita che i bisogni affettivi vengano sostenuti dalla carriera. Il ciclo facilita decisioni che integrano vita interiore e obiettivi esterni. Buon momento per avanzare professionalmente in modo allineato con chi si e.',
    'transit:moon|trigono|mercury':
      'La Luna in trigono a Mercurio natale favorisce l articolazione fluida del mondo emotivo in pensiero e comunicazione. Il ciclo facilita l espressione dei sentimenti con precisione e l integrazione di logica ed emozione. Buon momento per conversazioni significative, scrittura riflessiva e l elaborazione emotiva attraverso il linguaggio.',
    'transit:moon|trigono|moon':
      'La Luna in trigono alla Luna natale crea un momento di fluidita emotiva e allineamento naturale tra il ritmo interno e il ciclo lunare. Il ciclo facilita ricettivita, cura di se e benessere affettivo con piu naturalezza. Buon momento per notare cosa chiede il mondo emotivo e per rispondere con gentilezza.',
    'transit:moon|trigono|neptune':
      'La Luna in trigono a Nettuno natale favorisce sensibilita, intuizione e connessione con il sottile e il trascendente in modo fluido e produttivo. Il ciclo facilita creativita, empatia e pratiche contemplative che nutrono la vita interiore. Buon momento per lavorare il mondo immaginativo con apertura e intenzionalita.',
    'transit:moon|trigono|pluto':
      'La Luna in trigono a Plutone natale favorisce la trasformazione emotiva profonda condotta con focus e intenzione, senza gli attriti degli aspetti di tensione. Il ciclo facilita il rinnovamento affettivo e l accesso a cio che era nascosto nel mondo emotivo. Buon momento per approfondire cio che conta e liberare cio che ha perso valore affettivo.',
    'transit:moon|trigono|sun':
      'La Luna in trigono al Sole natale favorisce l allineamento tra il mondo emotivo e la direzione consapevole della vita, con integrazione naturale tra cio che si sente e cio che si vuole realizzare. Il ciclo facilita benessere, decisioni coerenti e la sensazione che interno ed esterno siano in armonia. Buon momento per avanzare con fiducia.',
    'transit:moon|trigono|uranus':
      'La Luna in trigono a Urano natale favorisce apertura verso il nuovo nel mondo emotivo, con cambiamenti creativi che vengono ben integrati. Il ciclo facilita il rinnovamento affettivo, l innovazione nella cura di se e la ricettivita verso l inaspettato senza perdere stabilita. Buon momento per esplorare cio che e diverso e autentico nel campo emotivo.',
    'transit:moon|trigono|venus':
      'La Luna in trigono a Venere natale favorisce armonia, piacere e connessioni affettive sostenute con naturalezza e soddisfazione genuina. Il ciclo facilita benessere emotivo, espressione creativa e relazioni nutritive. Buon momento per coltivare cio che genuinamente piace e nutre, con apertura e reciprocita.',

    // Saturn — voci mancanti
    'transit:saturn|conjuncao|pluto':
      'Saturno in congiunzione a Plutone natale combina struttura e potere trasformatore in un ciclo di riconfigurazioni profonde e durature. Il periodo puo esigere decisioni definitive su cio che deve essere eliminato o consolidato su basi piu solide. Un momento di confronto con cio che e stato rimandato e che ora richiede risoluzione strutturale.',
    'transit:saturn|conjuncao|uranus':
      'Saturno in congiunzione a Urano natale crea tensione creativa tra la necessita di ordine e l impulso verso la rottura e il rinnovamento. Il periodo puo portare cambiamenti concreti in aree dove le vecchie strutture non contengono piu il nuovo. Un ciclo di riformulazione che chiede equanimita tra cio che deve essere mantenuto e cio che deve essere liberato.',
    'transit:saturn|ingress|house_2':
      'Saturno in ingresso nella Casa 2 avvia un ciclo di revisione profonda delle abitudini finanziarie e dei valori che sostengono la vita materiale. Il periodo invita a costruire sicurezza economica in modo consistente, eliminando spese senza fondamento e sviluppando autodisciplina finanziaria. Buona finestra per creare basi materiali piu solide allineate con cio che ha davvero valore.',
    'transit:saturn|ingress|house_7':
      'Saturno in ingresso nella Casa 7 avvia un ciclo di serieta e responsabilita nelle partnership intime e nei legami di lunga durata. Il periodo puo portare sfide che richiedono maturita e impegno genuino nelle relazioni, rivelando dove mancano basi solide. Buona finestra per consolidare partnership autentiche o per riconoscere quelle che non sostengono piu lo scambio necessario.',
    'transit:saturn|ingress|house_8':
      'Saturno in ingresso nella Casa 8 avvia un ciclo di confronto con questioni di condivisione, trasformazione e risorse che coinvolgono altre persone. Il periodo invita a riorganizzare accordi finanziari condivisi e ad affrontare cio che e stato evitato nel campo delle trasformazioni profonde. Buona finestra per stabilire basi piu consapevoli nelle relazioni di interdipendenza.',
    'transit:saturn|ingress|house_9':
      'Saturno in ingresso nella Casa 9 avvia un ciclo di revisione delle credenze, della visione del mondo e degli impegni verso l apprendimento di lungo periodo. Il periodo invita a costruire una filosofia di vita piu strutturata, sostituendo credenze vaghe con comprensione approfondita. Buona finestra per impegnarsi in studi seri, formazione continua o espansione basata su fondamenta reali.',
    'transit:saturn|ingress|house_11':
      'Saturno in ingresso nella Casa 11 avvia un ciclo di revisione dei legami collettivi, delle reti sociali e degli obiettivi a lungo termine. Il periodo invita a valutare con maturita quali gruppi e ideali sostengono genuinamente il percorso e quali sono solo confortevoli in superficie. Buona finestra per costruire connessioni piu solide e impegnarsi verso mete collettive con responsabilita genuina.',
    'transit:saturn|ingress|house_12':
      'Saturno in ingresso nella Casa 12 avvia un ciclo di confronto con cio che e stato represso, evitato o lasciato in secondo piano nella vita interiore. Il periodo puo portare una sensazione di clausura o raccoglimento che, ben sfruttata, diventa spazio per revisione profonda e organizzazione del mondo soggettivo. Buona finestra per lavorare con cio che esiste nelle ombre e costruire basi psicologiche piu integrate.',
    'transit:saturn|oposicao|meio_do_ceu':
      'Saturno in opposizione al Medio Cielo natale indica tensione tra le domande esterne della carriera e le necessita di radicamento e vita domestica. Il periodo puo portare confronti tra ambizione professionale e cio che sostiene il mondo interiore. Buona finestra per valutare se la traiettoria esterna e allineata con le basi che supportano il percorso.',
    'transit:saturn|oposicao|moon':
      'Saturno in opposizione alla Luna natale tende a creare attrito tra la struttura razionale e le necessita emotive piu profonde. Il periodo puo portare sensazione di restrizione affettiva, distanza emotiva o difficolta nel prendersi cura di se con la stessa attenzione riservata alle responsabilita esterne. Buona finestra per riconoscere dove la disciplina ha sostituito la cura e cercare maggiore integrazione.',
    'transit:saturn|oposicao|neptune':
      'Saturno in opposizione a Nettuno natale tende la linea tra cio che e reale e cio che e idealizzato, richiedendo discernimento su dove la fantasia sostituisce l azione concreta. Il periodo puo rivelare delusioni in aree dove c era proiezione eccessiva o fuga dalla realta. Buona finestra per consolidare cio che ha sostanza e liberare cio che non e che illusione senza fondamento.',
    'transit:saturn|oposicao|venus':
      'Saturno in opposizione a Venere natale tende a portare attrito nelle relazioni, nell espressione affettiva o nel rapporto con il piacere e l abbondanza. Il periodo puo rivelare disallineamenti tra cio che si desidera e cio che gli impegni reali offrono. Buona finestra per valutare con onesta cosa nelle relazioni ha bisogno di piu struttura e cosa non corrisponde piu a cio che si necessita.',
    'transit:saturn|quadratura|ascendente':
      'Saturno in quadratura al Ascendente natale puo creare attrito tra la necessita di struttura interna e il modo in cui ci si presenta al mondo esterno. Il periodo tende a rivelare dove l identita pubblica e l identita privata sono in conflitto, richiedendo aggiustamenti verso l autenticita. Buona finestra per lavorare la coerenza tra chi si e e come ci si mostra negli spazi di contatto.',
    'transit:saturn|quadratura|jupiter':
      'Saturno in quadratura a Giove natale crea tensione tra l impulso verso l espansione e i limiti che la realta impone. Il periodo puo portare frustrazioni quando l ottimismo supera cio che e possibile sostenere con le risorse disponibili. Buona finestra per calibrare le ambizioni con cio che e fattibile e trasformare l entusiasmo in piano concreto e sostenibile.',
    'transit:saturn|quadratura|meio_do_ceu':
      'Saturno in quadratura al Medio Cielo natale puo portare sfide significative nella traiettoria professionale, rivelando dove le basi della carriera necessitano revisione. Il periodo invita a confrontare aspettative poco realistiche sulla vita pubblica e a costruire il percorso con piu onesta strutturale. Buona finestra per riallineare obiettivi esterni con cio che davvero sostiene il cammino.',
    'transit:saturn|quadratura|neptune':
      'Saturno in quadratura a Nettuno natale crea tensione tra la necessita di forma e definizione e l impulso verso la dissoluzione e la trascendenza. Il periodo puo rivelare dove la mancanza di limiti genera confusione o dove la rigidita eccessiva soffoca creativita e spiritualita. Buona finestra per trovare strutture che accolgano il sottile senza perdere chiarezza.',
    'transit:saturn|sextil|mercury':
      'Saturno in sestile a Mercurio natale favorisce pensiero disciplinato, comunicazione precisa e capacita di organizzare idee con chiarezza e autorita. Il ciclo facilita l apprendimento rigoroso, la scrittura strutturata e la pianificazione intellettuale. Buon momento per impegnarsi in progetti mentali che richiedono consistenza e profondita analitica.',
    'transit:saturn|sextil|pluto':
      'Saturno in sestile a Plutone natale favorisce l uso costruttivo del potere, con capacita di trasformare strutture in modo profondo e sostenibile. Il ciclo facilita la riorganizzazione di aree della vita che avevano bisogno di rinnovamento senza gli attriti degli aspetti di tensione. Buon momento per consolidare cambiamenti emersi da processi trasformatori precedenti.',
    'transit:saturn|trigono|mercury':
      'Saturno in trigono a Mercurio natale favorisce chiarezza mentale, capacita di comunicare con autorita e abilita nell organizzare pensieri e progetti in modo efficiente. Il ciclo facilita l impegno in apprendimenti esigenti e l espressione di idee con maturita e precisione. Buon momento per avanzare in progetti intellettuali con consistenza e focus.',
    'transit:saturn|trigono|pluto':
      'Saturno in trigono a Plutone natale favorisce la trasformazione di strutture profonde in modo costruttivo e con senso di scopo. Il ciclo facilita il consolidamento di cambiamenti significativi che richiedono durata e intenzione chiara. Buon momento per costruire cio che deve durare su basi che hanno attraversato rinnovamento genuino.',

    // Urano — voci mancanti
    'transit:uranus|conjuncao|neptune':
      'Urano in congiunzione a Nettuno natale combina l impulso di rottura con la sensibilita trascendente, creando un ciclo di trasformazioni che coinvolgono sia il concreto che l immaginativo. Il periodo puo portare cambiamenti inaspettati nella spiritualita, nella creativita o nelle percezioni sulla realta. Un momento di apertura a cio che non ha forma definita, con possibilita di rinnovamento profondo nel campo dell intuizione e della coscienza ampliata.',
    'transit:uranus|conjuncao|pluto':
      'Urano in congiunzione a Plutone natale combina rottura improvvisa e trasformazione profonda in un ciclo di riconfigurazioni radicali e potenzialmente irreversibili. Il periodo puo portare cambiamenti bruschi in aree dove potere, distruzione e rinnovamento gia agivano. Un momento di massima intensita dove il vecchio deve cedere spazio al totalmente nuovo.',
    'transit:uranus|ingress|house_2':
      'Urano in ingresso nella Casa 2 avvia un ciclo di disruzioni e innovazioni nella vita finanziaria e nei sistemi di valori. Il periodo puo portare cambiamenti bruschi nel reddito, nuove forme di generare o gestire risorse, o revisioni radicali di cio che si considera prezioso. Buona finestra per sperimentare nuovi modelli di sostenibilita e lasciare andare attaccamenti a forme fisse di sicurezza materiale.',
    'transit:uranus|ingress|house_4':
      'Urano in ingresso nella Casa 4 avvia un ciclo di cambiamenti inaspettati nella vita domestica, familiare o nel senso di casa. Il periodo puo portare trasferimenti, ristrutturazioni familiari o revisioni profonde di cosa significa appartenere e avere radici. Buona finestra per liberare pattern familiari ereditati e creare nuovi modi di abitare e radicarsi.',
    'transit:uranus|ingress|house_6':
      'Urano in ingresso nella Casa 6 avvia un ciclo di innovazioni e interruzioni nella routine quotidiana, nel lavoro e nelle abitudini di salute. Il periodo puo portare cambiamenti bruschi nell impiego, nuove metodologie di lavoro o la necessita di riformulare le pratiche quotidiane. Buona finestra per sperimentare approcci piu liberi e inventivi nell organizzazione della vita pratica.',
    'transit:uranus|ingress|house_8':
      'Urano in ingresso nella Casa 8 avvia un ciclo di cambiamenti inaspettati in aree di trasformazione, risorse condivise e cio che e nascosto. Il periodo puo portare disruzioni in eredita, debiti, partnership finanziarie o nel processo stesso di trasformazione interiore. Buona finestra per liberare strutture di potere che non corrispondono piu a cio che si e davvero.',
    'transit:uranus|ingress|house_9':
      'Urano in ingresso nella Casa 9 avvia un ciclo di rinnovamento radicale nelle credenze, nella visione del mondo e nei percorsi di espansione. Il periodo puo portare rottura con dogmi, apertura a filosofie non convenzionali o cambiamenti bruschi nei piani di viaggio o formazione. Buona finestra per mettere in discussione cio che e stato preso come verita e aprirsi a prospettive piu ampie e originali.',
    'transit:uranus|ingress|house_11':
      'Urano in ingresso nella Casa 11 avvia un ciclo di rinnovamento nei gruppi sociali, nelle reti di affinita e negli obiettivi collettivi. Il periodo puo portare cambiamenti nei circoli di frequentazione, ingresso in comunita innovative o ridefinizione degli ideali che guidano il futuro. Buona finestra per connettersi con persone e cause che aprono nuovi orizzonti e rompono i soliti schemi.',
    'transit:uranus|ingress|house_12':
      'Urano in ingresso nella Casa 12 avvia un ciclo di rotture e rinnovamenti nel mondo soggettivo, nei processi inconsci e in cio che e stato represso. Il periodo puo portare irruzioni inaspettate di materiale nascosto o insight liberatori su pattern limitanti. Buona finestra per lavorare la vita interiore con apertura all inaspettato e senza attaccamento a forme fisse di identita.',
    'transit:uranus|oposicao|ascendente':
      'Urano in opposizione al Ascendente natale tende a portare perturbazioni dall ambiente esterno che forzano revisioni nell autopercepzione e nel modo di presentarsi. Il periodo puo rivelare tensione tra la necessita di liberta individuale e le richieste delle relazioni. Buona finestra per notare dove l entorno segnala la necessita di rinnovamento nel modo di posizionarsi nel mondo.',
    'transit:uranus|oposicao|jupiter':
      'Urano in opposizione a Giove natale puo portare eccesso di ottimismo o espansione incontrollata in aree dove mancano basi solide. Il periodo puo rivelare tensione tra il desiderio di crescita rapida e la realta dei limiti esistenti. Buona finestra per calibrare l entusiasmo con discernimento e trasformare gli impulsi di espansione in piani fattibili.',
    'transit:uranus|oposicao|mars':
      'Urano in opposizione a Marte natale puo portare conflitti inaspettati, impulsi dirompenti o reazioni altrui che sfidano il modo abituale di agire e affermarsi. Il periodo puo rivelare tensione tra la necessita di autonomia e le richieste che arrivano dall esterno. Buona finestra per lavorare l assertivita con flessibilita e senza reattivita eccessiva.',
    'transit:uranus|oposicao|meio_do_ceu':
      'Urano in opposizione al Medio Cielo natale puo portare cambiamenti bruschi nella traiettoria professionale o nell immagine pubblica, con disruzioni provenienti da aree domestiche o dal passato. Il periodo puo rivelare tensione tra sicurezza interiore e le esigenze del mondo esterno. Buona finestra per rivisitare le fondamenta del percorso e verificare se la direzione pubblica ha ancora senso.',
    'transit:uranus|oposicao|moon':
      'Urano in opposizione alla Luna natale puo portare instabilita emotiva, rotture nei pattern affettivi o un urgente bisogno di liberta nel campo delle emozioni. Il periodo puo rivelare tensione tra il familiare e il nuovo nel mondo interno. Buona finestra per notare dove i pattern affettivi ereditati chiedono rinnovamento.',
    'transit:uranus|oposicao|neptune':
      'Urano in opposizione a Nettuno natale puo creare disruzioni nel campo della spiritualita, della creativita o delle illusioni con cui si vive. Il periodo puo rivelare tensione tra la necessita di risveglio concreto e l attaccamento a fantasie o stati alterati di coscienza. Buona finestra per lavorare l intuizione con piu discernimento e senza perdere chiarezza sul reale.',
    'transit:uranus|oposicao|pluto':
      'Urano in opposizione a Plutone natale puo portare confronti tra forza dirompente e potere trasformatore in modo intenso e potenzialmente destabilizzante. Il periodo puo rivelare tensione tra rottura brusca e trasformazione graduale e profonda. Buona finestra per distinguere cio che deve cambiare rapidamente da cio che ha bisogno di un processo piu lento e profondo.',
    'transit:uranus|oposicao|saturn':
      'Urano in opposizione a Saturno natale crea tensione tra l impulso verso la liberta e l innovazione e la necessita di struttura, limiti e responsabilita. Il periodo puo rivelare conflitto tra il desiderio di rompere con il consolidato e cio che ha ancora bisogno di continuita. Buona finestra per integrare il nuovo senza distruggere cio che ancora sostiene e ha valore.',
    'transit:uranus|oposicao|sun':
      'Urano in opposizione al Sole natale puo portare disruzioni nell espressione dell identita, con provocazioni esterne che sfidano il senso di chi si e. Il periodo puo rivelare tensione tra la necessita di autenticita e le aspettative che arrivano dall esterno. Buona finestra per rivisitare cio che definisce il nucleo dell identita e rinnovare l espressione personale con piu originalita.',
    'transit:uranus|oposicao|uranus':
      'Urano in opposizione a Urano natale segna il picco del ciclo uraniano, con tensione tra chi si e stati e chi si sta diventando nel campo dell originalita e della liberta. Il periodo puo portare revisioni brusche nella direzione di vita e nel modo di esprimere la propria singolarita. Buona finestra per accogliere la necessita di rinnovamento senza perdere il filo conduttore della traiettoria vissuta.',
    'transit:uranus|oposicao|venus':
      'Urano in opposizione a Venere natale puo portare disruzioni inaspettate nelle relazioni, nella vita affettiva o nel rapporto con il piacere e i valori. Il periodo puo rivelare tensione tra la necessita di liberta emotiva e l attaccamento a forme consolidate di relazionarsi. Buona finestra per rivisitare cio che nelle relazioni e ancora genuino e cio che necessita rinnovamento o liberazione.',
    'transit:uranus|quadratura|ascendente':
      'Urano in quadratura al Ascendente natale puo creare attrito tra la necessita di rinnovamento interno e il modo in cui questo si esprime o viene ricevuto nell ambiente. Il periodo puo portare conflitti tra l impulso di essere diversi e le aspettative esterne. Buona finestra per lavorare l autenticita con maturita, senza esplosioni che danneggino relazioni importanti.',
    'transit:uranus|quadratura|jupiter':
      'Urano in quadratura a Giove natale puo generare eccesso e impulsivita, con tendenza a prendere rischi in modo affrettato o ad espandersi senza limiti chiari. Il periodo puo portare attrito tra l ottimismo esagerato e la realta concreta delle conseguenze. Buona finestra per canalizzare l entusiasmo con piu discernimento e senza scommesse che superino cio che e sostenibile.',
    'transit:uranus|quadratura|mars':
      'Urano in quadratura a Marte natale puo portare impulsivita, reattivita o conflitti inaspettati che richiedono una gestione attenta dell energia assertiva. Il periodo puo creare attrito tra il desiderio di agire liberamente e radicalmente e le richieste di coerenza e consistenza. Buona finestra per lavorare la volonta con piu equilibrio, canalizzando l energia in modo creativo senza perdere il focus.',
    'transit:uranus|quadratura|meio_do_ceu':
      'Urano in quadratura al Medio Cielo natale puo portare disruzioni significative nella traiettoria professionale, con cambiamenti inaspettati che sfidano la direzione stabilita. Il periodo puo creare tensione tra il percorso pubblico e le necessita interiori di rinnovamento e liberta. Buona finestra per rivisitare gli obiettivi di carriera e verificare se corrispondono ancora a cio che spinge genuinamente la crescita.',
    'transit:uranus|quadratura|mercury':
      'Urano in quadratura a Mercurio natale puo portare pensiero accelerato, comunicazione dirompente o cambiamenti bruschi nel campo delle idee e delle informazioni. Il periodo puo creare attrito tra insight brillanti e la difficolta di implementarli con consistenza. Buona finestra per canalizzare la creativita intellettuale con piu pazienza e senza affrettare conclusioni.',
    'transit:uranus|quadratura|neptune':
      'Urano in quadratura a Nettuno natale puo creare attrito tra l impulso di risveglio e il desiderio di rimanere in stati di trascendenza o illusione. Il periodo puo portare confusione tra insight genuino e fuga creativa dalla realta. Buona finestra per lavorare spiritualita e creativita con piu chiarezza e senza perdere l ancoraggio nel reale.',
    'transit:uranus|quadratura|pluto':
      'Urano in quadratura a Plutone natale puo generare periodi di forte tensione tra la necessita di rottura e il processo di trasformazione profonda, con possibili crisi che forzano rinnovamenti radicali. Il periodo puo portare conflitto tra cio che deve cambiare immediatamente e cio che ha bisogno di un processo piu lento e profondo. Buona finestra per lavorare il cambiamento con intenzionalita e senza reattivita eccessiva.',
    'transit:uranus|quadratura|saturn':
      'Urano in quadratura a Saturno natale crea attrito tra l impulso di rompere con le strutture e la necessita di mantenere basi, impegni e continuita. Il periodo puo portare conflitto tra il desiderio di liberta totale e le responsabilita concrete che ancora devono essere onorate. Buona finestra per integrare l innovazione all interno delle strutture che ancora sostengono, senza distruggere cio che ha valore duraturo.',
    'transit:uranus|quadratura|uranus':
      'Urano in quadratura a Urano natale segna una fase di attrito tra l espressione attuale della propria singolarita e cio che ancora deve essere liberato o rinnovato. Il periodo puo portare tensione tra chi si e stati e chi si sta diventando nel campo dell autenticita e della liberta. Buona finestra per rivisitare la propria traiettoria con apertura a cio che deve essere riformulato.',
    'transit:uranus|quadratura|venus':
      'Urano in quadratura a Venere natale puo portare disruzioni inaspettate nelle relazioni o nella vita affettiva, con necessita di rivedere i modi abituali di amare e valorizzare. Il periodo puo creare attrito tra la necessita di liberta emotiva e gli attaccamenti affettivi consolidati. Buona finestra per chiedersi cosa nelle relazioni nutre davvero e cosa ha bisogno di rinnovamento.',
    'transit:uranus|sextil|ascendente':
      'Urano in sestile al Ascendente natale favorisce il rinnovamento nel modo di presentarsi al mondo, con apertura a cambiamenti che esprimono la singolarita in modo piu autentico. Il ciclo facilita aggiustamenti creativi nell immagine di se e nel modo di interagire con l ambiente. Buon momento per sperimentare nuovi modi di posizionarsi senza il peso delle aspettative abituali.',
    'transit:uranus|sextil|jupiter':
      'Urano in sestile a Giove natale favorisce l espansione creativa, l apertura a nuove prospettive e le opportunita che arrivano in modo inaspettato ma ricettivo. Il ciclo facilita combinazioni di ottimismo e innovazione che aprono percorsi insoliti. Buon momento per investire in progetti originali con ottimismo calibrato e apertura all improbabile.',
    'transit:uranus|sextil|meio_do_ceu':
      'Urano in sestile al Medio Cielo natale favorisce innovazioni nella carriera, apertura a nuove direzioni professionali e la capacita di distinguersi attraverso l originalita. Il ciclo facilita cambiamenti creativi nella traiettoria che arrivano con piu fluidita che attrito. Buon momento per presentare idee innovative, esplorare nuovi ruoli o riposizionare l immagine professionale.',
    'transit:uranus|sextil|neptune':
      'Urano in sestile a Nettuno natale favorisce la combinazione creativa di intuizione e innovazione, con insight che uniscono il concreto e il trascendente in modo produttivo. Il ciclo facilita creativita espansiva, spiritualita rinnovata e percezioni che aprono nuove possibilita. Buon momento per lavorare su progetti creativi o spirituali con apertura all inaspettato e all ispirante.',
    'transit:uranus|sextil|pluto':
      'Urano in sestile a Plutone natale favorisce trasformazioni creative che arrivano con rinnovamento genuino e senza gli attriti degli aspetti di tensione. Il ciclo facilita cambiamenti profondi che si integrano con piu fluidita e intenzionalita. Buon momento per consolidare trasformazioni in corso e innovare in aree dove potere e rinnovamento si incontrano.',
    'transit:uranus|sextil|saturn':
      'Urano in sestile a Saturno natale favorisce l integrazione creativa di innovazione e struttura, con la capacita di portare il nuovo senza distruggere cio che ancora sostiene. Il ciclo facilita riforme consistenti, cambiamenti pianificati e il rinnovamento delle strutture con piu abilita e meno resistenza. Buon momento per modernizzare cio che esiste gia con creativita e responsabilita.',
    'transit:uranus|sextil|sun':
      'Urano in sestile al Sole natale favorisce il rinnovamento dell espressione personale, l apertura a nuovi modi di esistere e la capacita di innovare nel modo di presentarsi al mondo. Il ciclo facilita la sperimentazione, l autenticita e la scoperta di aspetti originali della propria identita. Buon momento per esprimere chi si e in modi non convenzionali e accogliere cio che e singolare senza resistenza.',
    'transit:uranus|sextil|uranus':
      'Urano in sestile a Urano natale favorisce momenti di rinnovamento nell espressione della propria singolarita, con apertura al nuovo e capacita di integrare i cambiamenti con fluidita. Il ciclo facilita aggiustamenti creativi nella traiettoria di vita che arrivano con piu facilita che imposizione. Buon momento per accogliere l inaspettato e trasformare il diverso in risorsa produttiva.',
    'transit:uranus|trigono|ascendente':
      'Urano in trigono al Ascendente natale favorisce il rinnovamento fluido nel modo di presentarsi e interagire con il mondo, con espressione della singolarita ben ricevuta dall ambiente. Il ciclo facilita cambiamenti creativi nell immagine di se e nel modo di iniziare i contatti. Buon momento per sperimentare nuovi ruoli sociali e presentare versioni piu autentiche e originali di se stessi.',
    'transit:uranus|trigono|jupiter':
      'Urano in trigono a Giove natale favorisce l espansione creativa e l apertura a opportunita innovative che arrivano in modo inaspettato e ricettivo. Il ciclo facilita la crescita attraverso percorsi originali, con combinazione produttiva di entusiasmo e apertura al nuovo. Buon momento per investire in progetti che si allontanano dal convenzionale e raccogliere i frutti di cambiamenti precedenti.',
    'transit:uranus|trigono|meio_do_ceu':
      'Urano in trigono al Medio Cielo natale favorisce innovazioni nella carriera e nella traiettoria pubblica che arrivano con fluidita e apertura. Il ciclo facilita nuove direzioni professionali, espressione di originalita nel lavoro e apertura a posizioni che valorizzano la singolarita. Buon momento per rinnovare la direzione professionale in modo creativo e senza resistenze significative.',
    'transit:uranus|trigono|neptune':
      'Urano in trigono a Nettuno natale favorisce l unione creativa di intuizione e innovazione, con insight che connettono il concreto e il trascendente in modo fluido. Il ciclo facilita creativita ampliata, spiritualita rinnovata e percezioni che aprono orizzonti inaspettati. Buon momento per lavorare su progetti che combinano sensibilita e originalita con apertura genuina e produzione reale.',
    'transit:uranus|trigono|pluto':
      'Urano in trigono a Plutone natale favorisce trasformazioni profonde e creative che arrivano con piu fluidita che negli aspetti di tensione. Il ciclo facilita rinnovamenti strutturali significativi che vengono ben integrati e sono costruttivi. Buon momento per consolidare cambiamenti emersi da processi trasformatori e innovare in aree di potere e rinnovamento con intenzione chiara.',
    'transit:uranus|trigono|saturn':
      'Urano in trigono a Saturno natale favorisce l integrazione fluida di innovazione e struttura, con la capacita di rinnovare il consolidato senza rompere cio che ancora sostiene. Il ciclo facilita riforme creative, modernizzazione delle strutture e cambiamenti che arrivano con meno resistenza del solito. Buon momento per portare il nuovo con consistenza e innovare all interno di limiti che hanno ancora senso.',
    'transit:uranus|trigono|sun':
      'Urano in trigono al Sole natale favorisce il rinnovamento dell espressione personale e la scoperta di modi piu autentici e originali di esistere e affermarsi nel mondo. Il ciclo facilita la sperimentazione creativa, innovazioni nell identita e l espressione di cio che e singolare senza attriti significativi. Buon momento per esplorare nuove dimensioni di chi si e e accogliere cio che e diverso e genuino.',
    'transit:uranus|trigono|uranus':
      'Urano in trigono a Urano natale favorisce momenti di rinnovamento fluido nell espressione della propria singolarita, con integrazione naturale dei cambiamenti che arrivano. Il ciclo facilita aggiustamenti creativi nella traiettoria di vita che vengono ben accolti e integrati. Buon momento per avanzare verso cio che e autentico e originale, con meno resistenza e piu apertura.',

    // Nettuno — voci mancanti
    'transit:neptune|conjuncao|pluto':
      'Nettuno in congiunzione a Plutone natale crea una confluenza tra dissoluzione e trasformazione profonda, portando cambiamenti lenti e pervasivi in aree di rinnovamento e potere. Il periodo puo intensificare la sensibilita a cio che viene distrutto e ricreato nelle profondita della vita. Un ciclo di apertura al trascendente nel contesto di trasformazioni strutturali, con possibilita di rinnovamento spirituale significativo.',
    'transit:neptune|conjuncao|uranus':
      'Nettuno in congiunzione a Urano natale crea una confluenza tra dissoluzione e impulso di rottura, generando sensibilita ampliata verso cio che deve essere liberato in modo creativo e imprevedibile. Il periodo puo portare ispirazioni inaspettate, insight che combinano il trascendente e l innovativo, o confusione davanti a cambiamenti senza forma definita. Un ciclo di apertura al nuovo con fluidita e senza bisogno di controllo eccessivo.',
    'transit:neptune|ingress|house_2':
      'Nettuno in ingresso nella Casa 2 avvia un ciclo di dissoluzione dei confini tra il materiale e lo spirituale, con possibilita di confusione finanziaria o di ispirazione creativa generatrice di risorse. Il periodo invita a rivedere il rapporto con la sicurezza materiale e con i valori che sostengono la vita. Buona finestra per costruire un rapporto piu fluido con il denaro e identificare cio che ha valore genuino oltre il tangibile.',
    'transit:neptune|ingress|house_4':
      'Nettuno in ingresso nella Casa 4 avvia un ciclo di sensibilizzazione della vita domestica, familiare e del mondo interiore. Il periodo puo portare idealizzazione della famiglia, confusione su cio che costituisce la casa, o apertura a una vita intima piu spirituale e porosa. Buona finestra per dissolvere pattern familiari rigidi e creare un ambiente di vita piu permeabile a cio che e sottile e nutritivo.',
    'transit:neptune|ingress|house_6':
      'Nettuno in ingresso nella Casa 6 avvia un ciclo di sensibilita aumentata nella routine, nel lavoro e nelle abitudini di salute. Il periodo puo portare confusione nel quotidiano, difficolta nel mantenere gli orari o, positivamente, un orientamento piu dedicato e spiritualizzato nel lavoro. Buona finestra per introdurre pratiche di cura che integrino il fisico e il sottile, come meditazione, arte terapeutica o servizio con donazione genuina.',
    'transit:neptune|ingress|house_7':
      'Nettuno in ingresso nella Casa 7 avvia un ciclo di idealizzazione e sensibilita nelle relazioni intime e nelle partnership. Il periodo puo portare legami con forte carica romantica, confusione sui limiti nelle relazioni o lo sviluppo di empatia profonda verso gli altri. Buona finestra per coltivare relazioni con piu presenza e cura, discernendo cio che e genuino da cio che e proiezione idealizzata.',
    'transit:neptune|ingress|house_8':
      'Nettuno in ingresso nella Casa 8 avvia un ciclo di dissoluzione dei confini tra se e l altro nel campo dell intimita, delle risorse condivise e di cio che e nascosto. Il periodo puo portare sensibilita ampliata verso l intangibile negli scambi profondi, o confusione in relazioni finanziarie ed emotive di grande carica. Buona finestra per approfondire la spiritualita nel contatto con i cicli di perdita, trasformazione e rinnovamento.',
    'transit:neptune|ingress|house_9':
      'Nettuno in ingresso nella Casa 9 avvia un ciclo di spiritualita ampliata, apertura al trascendente e sensibilita elevata nelle credenze e nella visione del mondo. Il periodo puo portare devozione a pratiche spirituali, apertura al misticismo e sincretismo, o confusione tra fede genuina ed escapismo dottrinario. Buona finestra per esplorare il sacro con apertura e costruire una cosmologia che integri il sottile e il vissuto.',
    'transit:neptune|ingress|house_11':
      'Nettuno in ingresso nella Casa 11 avvia un ciclo di idealizzazione e sensibilita nei gruppi sociali, nelle reti di affinita e negli obiettivi collettivi. Il periodo puo portare ispirazione per cause umanitarie, confusione su dove si appartiene socialmente, o connessioni profonde con comunita creative e spirituali. Buona finestra per distinguere i gruppi che nutrono genuinamente da quelli che offrono solo l illusione di appartenenza.',
    'transit:neptune|oposicao|ascendente':
      'Nettuno in opposizione al Ascendente natale puo creare confusione nell autopercepzione e nel modo in cui si viene visti dagli altri, con tendenza a dissolvere i contorni dell identita pubblica. Il periodo puo rivelare tensione tra la necessita di chiarezza su chi si e e la dissoluzione dei confini personali. Buona finestra per lavorare i limiti in modo piu consapevole e distinguere cio che e genuino da cio che e proiezione dell entorno.',
    'transit:neptune|oposicao|jupiter':
      'Nettuno in opposizione a Giove natale puo amplificare la tendenza all eccesso di ottimismo, alle credenze senza fondamento reale o all espansione attraverso percorsi illusori. Il periodo puo rivelare tensione tra il desiderio di crescita e la dissoluzione delle basi che la sostenterebbero. Buona finestra per distinguere fede genuina da ingenuita e verificare se i progetti di espansione hanno sostanza concreta.',
    'transit:neptune|oposicao|mars':
      'Nettuno in opposizione a Marte natale puo dissolvere la chiarezza nell azione, generando confusione su cio che si vuole o difficolta ad agire con direzione e forza definite. Il periodo puo rivelare tensione tra il desiderio di agire e la nebbia che avvolge le motivazioni. Buona finestra per investigare cosa motiva davvero le azioni e per agire con piu discernimento su quando avanzare e quando attendere.',
    'transit:neptune|oposicao|meio_do_ceu':
      'Nettuno in opposizione al Medio Cielo natale puo creare confusione sulla direzione professionale o sull immagine pubblica, con tendenza alla dissoluzione dei contorni dell identita di carriera. Il periodo puo rivelare tensione tra la traiettoria esterna e una vocazione piu spirituale o soggettiva che emerge dall interno. Buona finestra per ascoltare cio che il mondo interno chiede e riorientare la vita pubblica in modo piu allineato con cio che e profondo e genuino.',
    'transit:neptune|oposicao|mercury':
      'Nettuno in opposizione a Mercurio natale puo creare confusione nel pensiero, nelle comunicazioni e nel modo di elaborare le informazioni. Il periodo puo portare incomprensioni, difficolta di concentrazione o una sensibilita elevata che rende il discernimento piu impegnativo. Buona finestra per praticare la verifica attenta delle informazioni e distinguere l intuizione genuina dalla fantasia proiettata.',
    'transit:neptune|oposicao|moon':
      'Nettuno in opposizione alla Luna natale puo portare ipersensibilita emotiva, confusione nei pattern affettivi o dissoluzione dei confini tra il proprio mondo interno e quello degli altri. Il periodo puo rivelare tensione tra i reali bisogni affettivi e cio che viene idealizzato o proiettato. Buona finestra per identificare dove l emozione e in contatto con cio che e genuino e dove e colorata da fantasia o aspettativa.',
    'transit:neptune|oposicao|neptune':
      'Nettuno in opposizione a Nettuno natale segna un momento di tensione tra cio che e stato costruito nel campo della spiritualita e della creativita e cio che non ha ancora trovato forma. Il periodo puo portare revisioni nelle credenze, negli ideali e nel rapporto con il trascendente. Buona finestra per valutare quali illusioni hanno gia compiuto il loro scopo e quali visioni meritano ancora di essere nutrite con piu chiarezza e intenzione.',
    'transit:neptune|oposicao|pluto':
      'Nettuno in opposizione a Plutone natale crea tensione tra dissoluzione e potere trasformatore, potendo generare confusione su processi che richiedono chiarezza e decisione definitiva. Il periodo puo rivelare in che misura il campo spirituale o creativo viene infiltrato da dinamiche di potere non riconosciute. Buona finestra per distinguere la resa genuina dalla fuga e lavorare con cio che si trasforma senza perdere il contatto con la realta.',
    'transit:neptune|oposicao|saturn':
      'Nettuno in opposizione a Saturno natale crea tensione tra dissoluzione e struttura, con possibile attrito tra il desiderio di trascendere i limiti e la necessita di ordine e responsabilita. Il periodo puo rivelare dove le illusioni stanno erodendo cio che dovrebbe essere sostenuto con rigore. Buona finestra per verificare se cio che si chiama spiritualita e davvero un percorso di crescita o un modo raffinato di evitare cio che deve essere costruito.',
    'transit:neptune|oposicao|sun':
      'Nettuno in opposizione al Sole natale puo creare confusione nell identita, con tendenza a dissolvere i contorni del senso di chi si e davanti alle aspettative e proiezioni dell entorno. Il periodo puo rivelare tensione tra la propria volonta e cio che l ambiente proietta o si aspetta. Buona finestra per praticare maggiore chiarezza su chi si e davvero, distinguendo il nucleo autentico dalle impressioni che arrivano dall esterno.',
    'transit:neptune|oposicao|uranus':
      'Nettuno in opposizione a Urano natale crea tensione tra l impulso di risveglio e rinnovamento e la tendenza alla dissoluzione e alla confusione. Il periodo puo rivelare dove il desiderio di liberta viene sabotato dall illusione o dove la trascendenza viene usata come fuga dalla realta. Buona finestra per integrare creativita e rinnovamento con piu chiarezza su cio che e genuinamente nuovo e cio che e solo fantasioso.',
    'transit:neptune|oposicao|venus':
      'Nettuno in opposizione a Venere natale puo idealizzare le relazioni, creando aspettative che superano cio che i legami reali possono offrire. Il periodo puo rivelare tensione tra l amore romantico idealizzato e i vincoli concreti con le loro imperfezioni e limiti. Buona finestra per apprezzare cio che le relazioni genuinamente offrono e coltivare l affetto con piu presenza e meno proiezione.',
    'transit:neptune|quadratura|ascendente':
      'Nettuno in quadratura al Ascendente natale puo creare confusione sull identita pubblica e sul modo in cui si viene percepiti dall entorno. Il periodo puo portare difficolta nel stabilire confini chiari tra il proprio mondo interno e cio che l ambiente proietta. Buona finestra per lavorare la chiarezza nella autopresentazione e identificare dove l identita viene diluita da aspettative esterne.',
    'transit:neptune|quadratura|jupiter':
      'Nettuno in quadratura a Giove natale puo amplificare l ottimismo fino a perdere il contatto con cio che e fattibile, con tendenza ad espandersi attraverso percorsi nebulosi o a credere in progetti senza fondamento reale. Il periodo puo creare attrito tra il desiderio di crescita e la mancanza di chiarezza sui mezzi. Buona finestra per verificare se le espansioni pianificate hanno sostanza concreta e calibrare la fede con discernimento pratico.',
    'transit:neptune|quadratura|mars':
      'Nettuno in quadratura a Marte natale puo creare attrito tra la volonta di agire e la confusione su cosa si voglia davvero o si debba fare. Il periodo puo portare logoramento per l azione in direzioni vaghe, difficolta nel mantenere il focus assertivo o energia che si disperde prima di raggiungere l obiettivo. Buona finestra per rafforzare la chiarezza di intenzione prima di agire e distinguere l impulso genuino dalla reattivita che cerca una via di fuga.',
    'transit:neptune|quadratura|meio_do_ceu':
      'Nettuno in quadratura al Medio Cielo natale puo creare confusione nella direzione professionale, con idealizzazione del ruolo pubblico o difficolta nel discernere il percorso piu allineato con le capacita reali. Il periodo puo portare attrito tra cio che si desidera essere nella vita pubblica e cio che il mondo effettivamente richiede. Buona finestra per allineare le ambizioni con cio che e concreto e realizzabile, senza perdere il sogno che ancora la direzione.',
    'transit:neptune|quadratura|mercury':
      'Nettuno in quadratura a Mercurio natale puo creare confusione nel pensiero, incomprensioni nella comunicazione e difficolta nel mantenere il ragionamento logico con consistenza. Il periodo puo portare disinformazione, pensiero magico o difficolta nel discernere il reale dalla proiezione. Buona finestra per verificare le informazioni con rigore e distinguere l intuizione creativa dal vaneggiamento senza sostanza.',
    'transit:neptune|quadratura|neptune':
      'Nettuno in quadratura a Nettuno natale crea attrito tra l ideale spirituale o creativo coltivato e cio che non ha ancora trovato espressione autentica. Il periodo puo rivelare dove le credenze e gli ideali hanno bisogno di revisione e dove l illusione e stata confusa con visione genuina. Buona finestra per confrontarsi onestamente con cio che e aspirazione reale e cio che e solo fantasia confortevole.',
    'transit:neptune|quadratura|pluto':
      'Nettuno in quadratura a Plutone natale crea attrito tra dissoluzione e potere trasformatore, potendo generare confusione in processi di trasformazione che richiedono chiarezza su cio che deve essere liberato. Il periodo puo rivelare dove la spiritualita o la creativita viene usata per evitare il confronto con cio che deve cambiare in modo piu definitivo. Buona finestra per lavorare la trasformazione senza fuggire da cio che implica concretamente.',
    'transit:neptune|quadratura|sun':
      'Nettuno in quadratura al Sole natale puo creare attrito tra l espressione dell identita e la tendenza a dissolvere i contorni del senso di chi si e. Il periodo puo portare confusione sui propri obiettivi, difficolta nel mantenere la direzione o la sensazione che il percorso si dissolva prima di essere percorso. Buona finestra per rafforzare il contatto con cio che e genuinamente proprio e agire da quella base con piu chiarezza e consistenza.',
    'transit:neptune|quadratura|uranus':
      'Nettuno in quadratura a Urano natale crea attrito tra dissoluzione e rottura, potendo generare confusione in aree dove l inaspettato e l intangibile si combinano. Il periodo puo rivelare dove la necessita di liberta viene vissuta in modo caotico o dove la creativita sta perdendo il filo conduttore. Buona finestra per canalizzare l impulso di rinnovamento con piu intenzionalita e senza dispersione.',
    'transit:neptune|sextil|ascendente':
      'Nettuno in sestile al Ascendente natale favorisce sensibilita elevata nel modo di presentarsi al mondo, con capacita di adattare l espressione a diversi contesti con empatia e fluidita. Il ciclo facilita apertura, ricettivita e una presenza che tocca genuinamente gli altri. Buon momento per esplorare modi piu creativi e intuitivi di posizionarsi nel mondo senza perdere la sostanza di chi si e.',
    'transit:neptune|sextil|jupiter':
      'Nettuno in sestile a Giove natale favorisce l espansione attraverso percorsi spirituali, creativi o ispirati dall intuizione e dalla fede in qualcosa di piu grande. Il ciclo facilita la crescita in aree che combinano apertura e immaginazione con generosita e senso di scopo. Buon momento per investire in studi esoterici, progetti creativi di grande visione o attivita che combinano sviluppo personale e contributo collettivo.',
    'transit:neptune|sextil|mars':
      'Nettuno in sestile a Marte natale favorisce l azione ispirata, con la capacita di agire da una motivazione piu sottile e allineata con cio che si sente come vero e urgente. Il ciclo facilita progetti creativi, artistici o spirituali che richiedono energia diretta con intenzione. Buon momento per agire da valori profondi e trovare la forza in qualcosa che va oltre l interesse immediato.',
    'transit:neptune|sextil|meio_do_ceu':
      'Nettuno in sestile al Medio Cielo natale favorisce vocazioni creative, spirituali o umanitarie nella vita professionale, con apertura a percorsi che combinano sensibilita e contributo. Il ciclo facilita il riconoscimento pubblico proveniente da attivita che toccano genuinamente le persone. Buon momento per esplorare direzioni professionali che integrino il sottile, l artistico o la cura dell altro come parte centrale del lavoro.',
    'transit:neptune|sextil|mercury':
      'Nettuno in sestile a Mercurio natale favorisce l immaginazione creativa, la comunicazione poetica e la capacita di intuire cio che va oltre il letterale e il logico. Il ciclo facilita la scrittura creativa, il pensiero simbolico e l espressione che connette il conscio con il piu sottile. Buon momento per lavorare con il linguaggio in modo piu espressivo, scrivere, creare o comunicare dall intuizione e dalla sensibilita.',
    'transit:neptune|sextil|moon':
      'Nettuno in sestile alla Luna natale favorisce la sensibilita emotiva ampliata, l intuizione affettiva e la ricettivita verso il sottile nelle relazioni e nel mondo interno. Il ciclo facilita l empatia genuina, la creativita nutrita dalle emozioni e un rapporto piu fluido con il proprio mondo affettivo. Buon momento per coltivare pratiche che connettono l emotivo e lo spirituale, come meditazione, arte espressiva o lavoro con i sogni.',
    'transit:neptune|sextil|neptune':
      'Nettuno in sestile a Nettuno natale favorisce un momento di apertura al trascendente con fluidita e senza le tensioni degli aspetti di maggiore attrito. Il ciclo facilita la spiritualita, la creativita e la connessione con l intangibile in modo nutritivo e produttivo. Buon momento per approfondire pratiche spirituali, espandere la sensibilita artistica e lavorare con cio che ispira senza perdere il contatto con il concreto.',
    'transit:neptune|sextil|pluto':
      'Nettuno in sestile a Plutone natale favorisce la trasformazione che si approfondisce attraverso lo spirituale, con la capacita di accedere a cio che e nascosto in modo creativo e rivelatore. Il ciclo facilita il rinnovamento che emerge da strati piu profondi dell essere, con apertura al trascendente nel processo di cambiamento. Buon momento per lavorare l inconscio, l arte o la spiritualita come vie genuine di trasformazione.',
    'transit:neptune|sextil|saturn':
      'Nettuno in sestile a Saturno natale favorisce la combinazione creativa di sensibilita e struttura, con la capacita di dare forma a cio che e ispirato senza perdere la disciplina necessaria a concretizzarlo. Il ciclo facilita progetti che combinano visione e realizzazione, con apertura al sottile all interno di forme che sostengono. Buon momento per lavorare l arte, la spiritualita o la cura con la consistenza che rende la visione realizzabile.',
    'transit:neptune|sextil|sun':
      'Nettuno in sestile al Sole natale favorisce un espressione personale piu sensibile, creativa e connessa a qualcosa di piu grande dell ego immediato. Il ciclo facilita un senso di scopo che coinvolge contributo, bellezza o trascendenza, con apertura a modi piu fluidi di essere chi si e. Buon momento per esplorare come l identita possa esprimersi attraverso vie artistiche, spirituali o di servizio.',
    'transit:neptune|sextil|uranus':
      'Nettuno in sestile a Urano natale favorisce la combinazione creativa di intuizione e innovazione, con insight che arrivano in modi inaspettati ma produttivi e facilmente valorizzati. Il ciclo facilita l apertura al nuovo con piu ricettivita e meno rottura. Buon momento per lavorare su progetti originali con sensibilita e lasciare che l ispirazione guidi la creativita senza bisogno di controllo eccessivo.',
    'transit:neptune|sextil|venus':
      'Nettuno in sestile a Venere natale favorisce la sensibilita estetica elevata, l affetto idealizzato in modo produttivo e l apertura al bello e nutritivo nelle relazioni e nella creativita. Il ciclo facilita l amore che si esprime con gentilezza, l arte che nasce dall emozione e le connessioni affettive permeate di complicita. Buon momento per coltivare cio che e bello, affettivo e ispirato con apertura e presenza genuina.',
    'transit:neptune|trigono|ascendente':
      'Nettuno in trigono al Ascendente natale favorisce sensibilita elevata nel modo di presentarsi al mondo, con fluidita, empatia e una presenza che tocca genuinamente gli altri. Il ciclo facilita l espressione piu creativa e intuitiva dell identita, con apertura a mostrare vulnerabilita senza perdere sostanza. Buon momento per lasciare che la sensibilita sia una parte visibile di chi si e, con apertura e fiducia.',
    'transit:neptune|trigono|jupiter':
      'Nettuno in trigono a Giove natale favorisce l espansione spirituale, creativa e umanitaria con fluidita e senso di scopo. Il ciclo facilita la crescita attraverso percorsi che combinano fede, immaginazione e apertura a cio che e maggiore del se. Buon momento per investire in progetti di grande visione, pratiche spirituali e attivita che connettono lo sviluppo personale con il contributo collettivo.',
    'transit:neptune|trigono|mars':
      'Nettuno in trigono a Marte natale favorisce l azione ispirata, con la capacita di agire da motivazioni profonde allineate con valori spirituali o creativi. Il ciclo facilita progetti artistici, umanitari o spirituali che richiedono energia diretta e intenzione chiara. Buon momento per agire da cio che si sente come vero e trovare la forza in qualcosa che va oltre l interesse immediato.',
    'transit:neptune|trigono|meio_do_ceu':
      'Nettuno in trigono al Medio Cielo natale favorisce l espressione di vocazioni creative, spirituali o umanitarie nella traiettoria professionale con fluenza e riconoscimento. Il ciclo facilita direzioni di carriera che integrano sensibilita, arte e cura dell altro in modo produttivo e ben ricevuto. Buon momento per avanzare in percorsi che combinano il sottile e il professionale con naturalezza e soddisfazione genuina.',
    'transit:neptune|trigono|mercury':
      'Nettuno in trigono a Mercurio natale favorisce l immaginazione creativa, la comunicazione poetica e l intuizione che connette il conscio con il piu sottile e simbolico. Il ciclo facilita la scrittura creativa, il pensiero immaginativo e l espressione che va oltre il letterale con fluidita. Buon momento per lavorare con il linguaggio in modo piu espressivo e comunicare dall intuizione con apertura e naturalezza.',
    'transit:neptune|trigono|moon':
      'Nettuno in trigono alla Luna natale favorisce la sensibilita emotiva profonda, l intuizione affettiva e la ricettivita che accoglie il sottile nel mondo interno e nelle relazioni. Il ciclo facilita l empatia genuina, la creativita alimentata dalle emozioni e la connessione con cio che e bello e trascendente nel campo affettivo. Buon momento per coltivare pratiche che integrano l emotivo e lo spirituale con fluidita e apertura.',
    'transit:neptune|trigono|neptune':
      'Nettuno in trigono a Nettuno natale favorisce un momento di apertura al trascendente con fluidita naturale e senza resistenza. Il ciclo facilita la spiritualita, la creativita e la connessione con l intangibile in modo produttivo e ben integrato. Buon momento per approfondire pratiche spirituali, espandere la sensibilita artistica e lasciare che cio che ispira si esprima con piu liberta e naturalezza.',
    'transit:neptune|trigono|pluto':
      'Nettuno in trigono a Plutone natale favorisce la trasformazione profonda mediata dalla sensibilita spirituale e dall apertura al trascendente. Il ciclo facilita l accesso a cio che era nascosto in modo piu fluido e senza gli attriti degli aspetti di tensione. Buon momento per lavorare l inconscio, l arte o la spiritualita come vie genuine di trasformazione con senso di scopo.',
    'transit:neptune|trigono|saturn':
      'Nettuno in trigono a Saturno natale favorisce la combinazione fluida di sensibilita e struttura, con la capacita di dare forma a cio che e ispirato in modo consistente e duraturo. Il ciclo facilita progetti che combinano visione e realizzazione, con apertura al trascendente all interno di forme che sostengono. Buon momento per lavorare l arte, la spiritualita o la cura con la consistenza che rende la visione realizzabile.',
    'transit:neptune|trigono|sun':
      'Nettuno in trigono al Sole natale favorisce un espressione personale piu sensibile, creativa e connessa a qualcosa di piu grande dell ego immediato, con fluidita e naturalezza. Il ciclo facilita un senso di scopo che coinvolge contributo, bellezza o trascendenza, in modo ben integrato e nutritivo. Buon momento per esplorare come l identita possa esprimersi attraverso vie artistiche, spirituali o di servizio con apertura e fiducia.',
    'transit:neptune|trigono|uranus':
      'Nettuno in trigono a Urano natale favorisce la combinazione creativa di intuizione e innovazione, con insight che arrivano in modi inaspettati ma fluidi e ben integrati. Il ciclo facilita l apertura al nuovo con ricettivita e senza rottura eccessiva. Buon momento per lavorare su progetti originali con sensibilita e lasciare che l ispirazione guidi la creativita con naturalezza e output genuino.',
    'transit:neptune|trigono|venus':
      'Nettuno in trigono a Venere natale favorisce la sensibilita estetica elevata, l affetto che si esprime con bellezza e l apertura al nutritivo nelle relazioni e nella creativita. Il ciclo facilita l amore che include dimensioni spirituali, l arte che nasce dall emozione e le connessioni affettive permeate di complicita e ispirazione. Buon momento per coltivare cio che e bello, affettivo e ispirato con presenza genuina e fluidita.',
    // Plutone — voci mancanti
    'transit:pluto|conjuncao|ascendente':
      'Plutone in congiunzione all Ascendente natale avvia una trasformazione del modo di presentarsi e di essere percepiti, rendendo progressivamente piu difficile mantenere un identita che non corrisponda a cio che sta emergendo internamente. Questa fase puo portare una presenza piu intensa, ma anche confronto con cio che e stato costruito come maschera sociale nel tempo. Cosa nel tuo modo di presentarti al mondo non sei piu tu e deve essere disfatto per fare spazio a chi stai diventando?',
    'transit:pluto|conjuncao|jupiter':
      'Plutone in congiunzione a Giove natale amplifica gli impulsi di crescita ed espansione con una profondita che puo servire sia a progetti di lungo alcance sia a ricerche di potere senza base reale. Questa fase tende a rivelare dove l ambizione e genuina e dove e solo la necessita di occupare spazio o controllare i risultati. Cosa vuoi espandere che ha base genuina, e cosa stai cercando per necessita di sicurezza travestita da crescita?',
    'transit:pluto|conjuncao|mercury':
      'Plutone in congiunzione a Mercurio natale approfondisce il modo di pensare, investigare e comunicare, con minore tolleranza per risposte superficiali o verita parziali. Questa fase tende a intensificare il ragionamento investigativo e a rendere piu difficile accettare spiegazioni che non arrivano al fondo della questione. Quale narrazione su te stesso o sulla tua situazione hai mantenuto senza metterla in discussione con la profondita che esige?',
    'transit:pluto|conjuncao|moon':
      'Plutone in congiunzione alla Luna natale trasforma il mondo emotivo dall interno, portando in superficie schemi affettivi ereditati che chiedevano di essere rivisti o chiusi. Questa fase puo intensificare i bisogni di sicurezza e allo stesso tempo mostrare che i modi abituali di ottenerla non funzionano piu. Cosa nella tua vita emotiva hai evitato di riesaminare che sta ora chiedendo attenzione?',
    'transit:pluto|conjuncao|neptune':
      'Plutone in congiunzione con Nettuno natale trasforma la vita spirituale, creativa e il rapporto con il trascendente in modo profondo e potenzialmente destabilizzante delle illusioni precedenti. Il periodo puo portare confronto con cio che era fantasia o escapismo, aprendo spazio a una spiritualita piu autentica e meno idealizzata. Un momento di trasformazione nel campo del sacro e dell immaginativo, con dissoluzione di cio che non era genuino.',
    'transit:pluto|conjuncao|uranus':
      'Plutone in congiunzione con Urano natale combina trasformazione profonda e impulso alla rottura in un ciclo di cambiamenti radicali e potenzialmente irreversibili. Il periodo puo portare rotture improvvise di strutture antiche che non potevano piu contenere cio che aveva bisogno di esprimersi. Un momento di trasformazione che avviene per rotture, con potenziale di liberazione da pattern che bloccavano il rinnovamento necessario.',
    'transit:pluto|conjuncao|venus':
      'Plutone in congiunzione a Venere natale trasforma la vita affettiva e i propri valori, rendendo piu difficile sostenere relazioni o accordi che non corrispondano a cio che si desidera genuinamente. Questa fase puo portare legami di grande intensita o rivelazioni su cio che conta davvero — con meno tolleranza per cio che e abituale ma non soddisfacente. Cosa continui a valorizzare per paura di perdere qualcosa che ha gia perso il suo valore reale per te?',
    'transit:pluto|ingress|house_1':
      'Plutone in ingresso nella Casa 1 avvia un ciclo di trasformazione radicale dell identita, dell immagine di se e del modo di posizionarsi nel mondo. Il periodo puo portare una presenza piu intensa e magnetica, confronto con le proprie ombre e la necessita di ricostruire chi si e partendo da qualcosa di piu profondo e autentico. Una buona finestra per avviare un vero lavoro di auto-scoperta, eliminando cio che era maschera e coltivando cio che e sostanza.',
    'transit:pluto|ingress|house_2':
      'Plutone in ingresso nella Casa 2 avvia un ciclo di profonda trasformazione nella vita finanziaria, nei valori e nel rapporto con la sicurezza materiale. Il periodo puo portare crisi o riorganizzazioni radicali nelle risorse, rivelando cio che sostenta davvero la vita e cio che era sostenuto dalla paura o dall attaccamento. Una buona finestra per ricostruire il rapporto con il denaro e l abbondanza a partire da valori piu autentici e trasformati.',
    'transit:pluto|ingress|house_3':
      'Plutone in ingresso nella Casa 3 avvia un ciclo di profonda trasformazione nel modo di pensare, comunicare e percepire l ambiente immediato. Il periodo puo portare intensita nelle relazioni con fratelli e vicini, cambiamenti radicali negli studi o nella comunicazione, e la necessita di andare in fondo alle questioni invece di restare in superficie. Una buona finestra per trasformare il modo di processare ed esprimere cio che si pensa.',
    'transit:pluto|ingress|house_5':
      'Plutone in ingresso nella Casa 5 avvia un ciclo di trasformazione nell espressione creativa, nelle relazioni romantiche e nel rapporto con il piacere e l autenticita. Il periodo puo portare intensita nelle esperienze affettive e creative, rivelazioni su cio che davvero nutre il gioco e la gioia, o confronto con pattern di dipendenza nel campo affettivo. Una buona finestra per rinnovare il rapporto con la creativita e con cio che si ama in modo piu profondo e genuino.',
    'transit:pluto|ingress|house_6':
      'Plutone in ingresso nella Casa 6 avvia un ciclo di profonda trasformazione nella routine, nel lavoro e nelle abitudini di salute. Il periodo puo portare crisi o riorganizzazioni radicali nel quotidiano, confronto con dinamiche di potere nell ambiente lavorativo o necessita di trasformare abitudini che nuociono al benessere. Una buona finestra per rinnovare il modo di servire, organizzare la vita pratica e prendersi cura della salute con maggiore intenzionalita.',
    'transit:pluto|ingress|house_7':
      'Plutone in ingresso nella Casa 7 avvia un ciclo di profonda trasformazione nelle partnership intime e nei legami duraturi. Il periodo puo portare rivelazioni su cio che e nascosto nelle relazioni, dinamiche di potere e controllo, o la necessita di ricostruire le fondamenta delle relazioni piu importanti. Una buona finestra per trasformare il modo di relazionarsi, eliminando cio che era illusione e approfondendo cio che e genuino.',
    'transit:pluto|ingress|house_8':
      'Plutone in ingresso nella Casa 8 avvia un ciclo di intensificazione dei temi di trasformazione, intimita, morte, eredita e risorse condivise. Il periodo puo portare confronto con cio che e piu profondo e oscuro nella psiche, rivelazioni nelle aree di intimita e potere, o trasformazioni radicali in cio che si condivide con l altro. Una buona finestra per approfondire il lavoro psicologico e rinnovare il modo di affrontare cio che richiede resa totale.',
    'transit:pluto|ingress|house_9':
      'Plutone in ingresso nella Casa 9 avvia un ciclo di profonda trasformazione nelle credenze, nella visione del mondo e nei sistemi filosofici o religiosi che sostengono la vita. Il periodo puo portare crisi di fede, confronto con dogmi o rinnovamento radicale della cosmovisione. Una buona finestra per andare in fondo alle questioni di senso e per costruire una filosofia di vita piu autentica, eliminando cio che era credenza ereditata senza esame.',
    'transit:pluto|ingress|house_11':
      'Plutone in ingresso nella Casa 11 avvia un ciclo di trasformazione nei gruppi sociali, nelle reti di affinita e negli obiettivi collettivi. Il periodo puo portare rivelazioni sulle dinamiche di potere nei gruppi di appartenenza, la necessita di eliminare legami non genuini o trasformazione radicale degli ideali che guidano il futuro. Una buona finestra per rinnovare le alleanze e impegnarsi con cause che abbiano sostanza e profondita reale.',
    'transit:pluto|ingress|house_12':
      'Plutone in ingresso nella Casa 12 avvia un ciclo di confronto con cio che e nascosto, represso o che vive nelle ombre della psiche. Il periodo puo portare irruzioni dall inconscio, confronto con pattern che operano al di sotto della coscienza o necessita di trasformare cio che e stato evitato per paura. Una buona finestra per lavorare le ombre con coraggio, eliminare cio che blocca la vita interiore e rinnovare le fondamenta del mondo soggettivo.',
    'transit:pluto|oposicao|ascendente':
      'Plutone in opposizione all Ascendente natale puo portare incontri intensi che forzano il confronto con le proprie ombre riflesse nell altro, con dinamiche di potere nelle relazioni e con cio che era nascosto nell immagine di se. Il periodo puo rivelare tensione tra la necessita di controllo e l apertura genuina a essere trasformati dal contatto con gli altri. Una buona finestra per lavorare i legami con maggiore consapevolezza su cio che si proietta e su cio che si nasconde.',
    'transit:pluto|oposicao|meio_do_ceu':
      'Plutone in opposizione al Medio Cielo natale puo portare trasformazioni nelle fondamenta della vita — nella famiglia, nel focolare e nella psiche profonda — che scuotono la traiettoria pubblica e professionale. Il periodo puo rivelare tensione tra la necessita di controllo sulla direzione esterna e cio che emerge dalle radici piu profonde. Una buona finestra per riesaminare cio che sostiene il cammino e per trasformare le fondamenta in qualcosa di piu consapevole e solido.',
    'transit:pluto|oposicao|mercury':
      'Plutone in opposizione a Mercurio natale puo portare confronti intensi nel campo delle idee, delle comunicazioni e del modo di processare la realta, con tendenza a rivelazioni che scuotono le certezze. Il periodo puo rivelare tensione tra la volonta di controllare il discorso e la necessita di aprirsi a verita scomode. Una buona finestra per investigare con piu profondita e per usare la parola con piu integrita e responsabilita.',
    'transit:pluto|oposicao|moon':
      'Plutone in opposizione alla Luna natale puo portare confronti intensi nel mondo emotivo, rivelazioni su pattern affettivi nascosti o tensione tra il bisogno di sicurezza e l impulso verso una trasformazione profonda. Il periodo puo rivelare dove il controllo viene esercitato nel campo affettivo e dove la resa genuina viene bloccata. Una buona finestra per affrontare cio che e stato represso nel campo emotivo e per rinnovare la vita affettiva con maggiore autenticita.',
    'transit:pluto|oposicao|neptune':
      'Plutone in opposizione a Nettuno natale crea tensione tra potere trasformativo e dissoluzione, con possibile crisi nel campo spirituale o creativo che esigono confronto con cio che era illusione. Il periodo puo rivelare dove la spiritualita o la creativita viene usata per evitare la trasformazione reale. Una buona finestra per approfondire la vita interiore con piu onesta e per distinguere la visione genuina dalla proiezione senza sostanza.',
    'transit:pluto|oposicao|pluto':
      'Plutone in opposizione a Plutone natale segna un momento di confronto tra il potere che e stato costruito e cio che deve ancora essere trasformato nel profondo della psiche. Il periodo puo portare tensione tra cio che si vuole mantenere e cio che la vita esige sia eliminato o rinnovato. Una buona finestra per lavorare con le proprie ombre con maturita e per riconoscere dove il potere viene esercitato o negato in modo non consapevole.',
    'transit:pluto|oposicao|saturn':
      'Plutone in opposizione a Saturno natale crea tensione tra il potere trasformativo e le strutture, i limiti e le responsabilita di Saturno. Il periodo puo portare confronti con le autorita, crisi in strutture che sembravano solide o la necessita di ricostruire le basi a partire da qualcosa di piu profondo. Una buona finestra per trasformare cio che era rigido senza distruggere cio che ha ancora valore e per ricostruire con piu integrita.',
    'transit:pluto|oposicao|uranus':
      'Plutone in opposizione a Urano natale crea tensione tra trasformazione profonda e rottura improvvisa, con possibile crisi che richiedono sia discernimento che apertura radicale. Il periodo puo rivelare conflitto tra cio che ha bisogno di cambiare lentamente e in profondita e cio che vuole rompersi bruscamente. Una buona finestra per integrare gli impulsi di rinnovamento e trasformazione senza polarizzare agli estremi.',
    'transit:pluto|quadratura|ascendente':
      'Plutone in quadratura all Ascendente natale puo creare frizione intensa tra la necessita di trasformazione dell identita e la resistenza interna o esterna a quel cambiamento. Il periodo puo portare conflitti di potere nell ambiente immediato, confronto con la propria ombra o tensione tra cio che si vuole mostrare e cio che deve essere rivelato. Una buona finestra per lavorare l autenticita con coraggio e senza manipolazione.',
    'transit:pluto|quadratura|meio_do_ceu':
      'Plutone in quadratura al Medio Cielo natale puo portare crisi o confronti nella traiettoria professionale, con rivelazioni sulle dinamiche di potere, controllo o ambizione che devono essere esaminate. Il periodo puo creare tensione tra cio che si vuole raggiungere nella vita pubblica e cio che le fondamenta interne o familiari sostengono o meno. Una buona finestra per trasformare il rapporto con l ambizione e per costruire il percorso professionale con maggiore integrita.',
    'transit:pluto|quadratura|neptune':
      'Plutone in quadratura a Nettuno natale crea frizione tra potere trasformativo e dissoluzione, con possibile crisi nel campo spirituale o creativo che esigono confronto con illusioni. Il periodo puo rivelare dove la fantasia o l escapismo impedisce la trasformazione reale. Una buona finestra per approfondire la vita spirituale e creativa con piu onesta e per eliminare cio che era solo proiezione senza sostanza.',
    'transit:pluto|quadratura|pluto':
      'Plutone in quadratura a Plutone natale segna un momento di frizione intensa tra il potere che e stato costruito e cio che deve ancora essere trasformato, con crisi che rivelano dove il controllo viene esercitato in modo non consapevole. Il periodo puo portare confronti con la propria ombra e con le dinamiche di potere e manipolazione che operano al di sotto della coscienza. Una buona finestra per esaminare onestamente cio che deve essere eliminato e per ricostruire con piu integrita e profondita.',
    'transit:pluto|quadratura|saturn':
      'Plutone in quadratura a Saturno natale crea frizione tra l impulso verso la trasformazione radicale e la necessita di mantenere struttura e responsabilita. Il periodo puo portare confronti con le autorita, crisi in strutture che sembravano solide o tensione tra cio che deve cambiare e cio che deve essere preservato con cura. Una buona finestra per lavorare la trasformazione senza distruggere cio che ancora sostiene e per ricostruire con piu integrita.',
    'transit:pluto|quadratura|sun':
      'Plutone in quadratura al Sole natale puo creare frizione intensa tra l espressione dell identita e l impulso verso la trasformazione radicale, con confronti che sfidano il senso di chi si e. Il periodo puo portare conflitti di potere, confronto con la propria ombra o tensione tra la volonta di controllo e la necessita di cedere al processo trasformativo. Una buona finestra per esaminare cosa nell identita necessita rinnovamento e per agire con piu integrita e profondita.',
    'transit:pluto|quadratura|uranus':
      'Plutone in quadratura a Urano natale crea frizione tra trasformazione profonda e rottura brusca, con possibile crisi che combinano l inatteso e il profondo in modo destabilizzante. Il periodo puo rivelare tensione tra cio che ha bisogno di cambiare lentamente e cio che esplode in rotture senza preparazione. Una buona finestra per lavorare i cambiamenti con piu intenzionalita e per integrare l inatteso senza perdere il filo conduttore della trasformazione necessaria.',
    'transit:pluto|quadratura|venus':
      'Plutone in quadratura a Venere natale puo portare crisi nelle relazioni, rivelazioni sulle dinamiche di potere, controllo o dipendenza nel campo affettivo o confronto con cio che si desidera genuinamente rispetto a cio che si presenta come desiderabile. Il periodo puo creare frizione tra cio che e familiare nel campo affettivo e cio che deve essere trasformato affinche le relazioni siano piu autentiche. Una buona finestra per rinnovare la vita affettiva e i valori con piu profondita e onesta.',
    'transit:pluto|sextil|ascendente':
      'Plutone in sestile all Ascendente natale favorisce il rinnovamento dell identita con accesso a una forza piu profonda e magnetica che si integra in modo costruttivo. Il ciclo facilita trasformazioni nell immagine di se e nel modo di presentarsi che arrivano con maggiore fluidita e meno frizione rispetto agli aspetti di tensione. Un buon momento per lavorare cio che deve essere rinnovato nell identita con coraggio e intenzione chiara.',
    'transit:pluto|sextil|jupiter':
      'Plutone in sestile a Giove natale favorisce la crescita attraverso percorsi che integrano profondita, potere e integrita, con la capacita di espandersi senza perdere il contatto con cio che e sostanziale. Il ciclo facilita opportunita che arrivano lavorando con cio che e profondo e trasformativo. Un buon momento per investire in progetti di grande impatto nati da valori genuini e da un coraggio reale.',
    'transit:pluto|sextil|meio_do_ceu':
      'Plutone in sestile al Medio Cielo natale favorisce trasformazioni costruttive nella traiettoria professionale, con accesso a una influenza piu profonda e magnetica nella vita pubblica. Il ciclo facilita cambiamenti nel percorso che arrivano con meno frizione e piu intenzionalita. Un buon momento per avanzare in direzioni che richiedono coraggio e profondita, sfruttando il potenziale trasformativo per consolidare una traiettoria piu potente e autentica.',
    'transit:pluto|sextil|mercury':
      'Plutone in sestile a Mercurio natale favorisce il pensiero investigativo, la comunicazione in profondita e la capacita di andare al fondo delle questioni con chiarezza e forza. Il ciclo facilita la ricerca, la scrittura che rivela cio che e nascosto e l uso della parola con influenza genuina. Un buon momento per lavorare con le informazioni in profondita, investigare verita nascoste e comunicare cio che deve essere detto con coraggio e precisione.',
    'transit:pluto|sextil|moon':
      'Plutone in sestile alla Luna natale favorisce l accesso al mondo emotivo profondo con maggiore facilita e meno resistenza rispetto agli aspetti di tensione. Il ciclo facilita processi di trasformazione affettiva condotti con intenzione e cura. Un buon momento per lavorare i pattern emotivi ereditati con coraggio, aprendo spazio per una vita affettiva piu integrata e profonda.',
    'transit:pluto|sextil|neptune':
      'Plutone in sestile a Nettuno natale favorisce la trasformazione che si approfondisce attraverso il spirituale e il creativo, con accesso a strati piu profondi della vita interiore in modo produttivo. Il ciclo facilita il lavoro con l inconscio, il sacro e l immaginativo in modo costruttivo. Un buon momento per approfondire pratiche spirituali e creative che tocchino cio che e piu profondo e trasformativo.',
    'transit:pluto|sextil|pluto':
      'Plutone in sestile a Plutone natale favorisce momenti di accesso al proprio potenziale trasformativo con maggiore fluidita e minore resistenza. Il ciclo facilita processi di profondo rinnovamento che arrivano con piu capacita di valorizzazione. Un buon momento per lavorare cio che deve essere trasformato nella psiche con intenzione chiara e coraggio costruttivo.',
    'transit:pluto|sextil|saturn':
      'Plutone in sestile a Saturno natale favorisce l integrazione costruttiva di potere trasformativo e struttura, con la capacita di rinnovare l esistente senza distruggere cio che ancora sostiene. Il ciclo facilita riforme profonde, eliminazione di cio che e obsoleto e consolidamento di cio che e essenziale. Un buon momento per trasformare con rigore e responsabilita, costruendo su basi rinnovate con maggiore integrita.',
    'transit:pluto|sextil|uranus':
      'Plutone in sestile a Urano natale favorisce la combinazione costruttiva di trasformazione profonda e innovazione, con la capacita di rinnovare le strutture in modo profondo e creativo. Il ciclo facilita cambiamenti che arrivano con meno frizione e piu intenzionalita. Un buon momento per innovare in aree che richiedono una vera trasformazione, sfruttando il potenziale di rinnovamento in modo costruttivo e senza distruzione inutile.',
    'transit:pluto|sextil|venus':
      'Plutone in sestile a Venere natale favorisce trasformazioni costruttive nella vita affettiva e nei valori, con accesso a una profondita che arricchisce le relazioni. Il ciclo facilita l approfondimento dei legami genuini e l eliminazione di cio che era superficiale senza il trauma degli aspetti di tensione. Un buon momento per rinnovare il campo affettivo e i valori con piu profondita e intenzionalita.',
    'transit:pluto|trigono|ascendente':
      'Plutone in trigono all Ascendente natale favorisce il profondo rinnovamento dell identita che arriva con maggiore fluidita e integrazione naturale. Il ciclo facilita trasformazioni nell immagine di se e nel modo di presentarsi che sono ben accolte e producono una presenza piu autentica e magnetica. Un buon momento per lavorare cio che deve essere rinnovato in chi si e in modo profondo e costruttivo, con coraggio e apertura.',
    'transit:pluto|trigono|meio_do_ceu':
      'Plutone in trigono al Medio Cielo natale favorisce profonde trasformazioni nella traiettoria professionale che arrivano con fluidita e potenziale di impatto reale. Il ciclo facilita cambiamenti nel percorso pubblico che sono ben integrati e costruttivi, con accesso a una influenza piu magnetica. Un buon momento per rinnovare la direzione professionale con profondita e per consolidare una traiettoria di maggiore sostanza e autenticita.',
    'transit:pluto|trigono|mercury':
      'Plutone in trigono a Mercurio natale favorisce il pensiero investigativo profondo, la comunicazione che va al fondo delle questioni e la capacita di rivelare cio che e nascosto in modo costruttivo. Il ciclo facilita la ricerca, la scrittura con impatto e l uso della parola con influenza genuina, senza le frizioni degli aspetti di tensione. Un buon momento per lavorare con le informazioni in profondita e per comunicare verita con coraggio e precisione.',
    'transit:pluto|trigono|moon':
      'Plutone in trigono alla Luna natale favorisce la profonda trasformazione emotiva che arriva con piu fluidita e meno resistenza, con accesso a cio che era nascosto nel campo affettivo. Il ciclo facilita il rinnovamento dei pattern emotivi ereditati e l approfondimento della vita interiore in modo costruttivo. Un buon momento per lavorare il mondo emotivo con coraggio e intenzione, aprendo spazio per una vita affettiva piu integrata e autentica.',
    'transit:pluto|trigono|neptune':
      'Plutone in trigono a Nettuno natale favorisce la profonda trasformazione mediata dal spirituale e dal creativo, con accesso fluido a cio che e nascosto negli strati piu profondi della vita interiore. Il ciclo facilita il lavoro con l inconscio, il sacro e l immaginativo in modo costruttivo e ben integrato. Un buon momento per approfondire pratiche spirituali e creative che producano un rinnovamento reale con senso di scopo.',
    'transit:pluto|trigono|pluto':
      'Plutone in trigono a Plutone natale favorisce momenti di accesso al proprio potenziale trasformativo con fluidita naturale e apertura costruttiva. Il ciclo facilita processi di profondo rinnovamento che arrivano con maggiore facilita di integrazione. Un buon momento per lavorare cio che deve essere trasformato nella psiche con intenzione chiara, coraggio e output genuino, sfruttando il potenziale con consapevolezza.',
    'transit:pluto|trigono|saturn':
      'Plutone in trigono a Saturno natale favorisce l integrazione fluida di potere trasformativo e struttura, con la capacita di rinnovare l esistente e costruire su basi piu profonde. Il ciclo facilita riforme profonde che arrivano con meno resistenza, eliminazione di cio che e obsoleto e consolidamento di cio che e essenziale. Un buon momento per costruire con profondita e rigore cio che dovrebbe durare, su fondamenta rinnovate con integrita.',
    'transit:pluto|trigono|uranus':
      'Plutone in trigono a Urano natale favorisce la combinazione fluida di trasformazione profonda e innovazione, con la capacita di rinnovare le strutture in modo radicale ma ben integrato. Il ciclo facilita cambiamenti che arrivano con piu fluidita e output costruttivo. Un buon momento per innovare in aree che richiedono un vero rinnovamento, sfruttando il potenziale di trasformazione creativa con apertura e intenzionalita.',
    'transit:pluto|trigono|venus':
      'Plutone in trigono a Venere natale favorisce trasformazioni costruttive nella vita affettiva e nei valori che arrivano con fluidita e profondita genuina. Il ciclo facilita l approfondimento dei legami autentici e l eliminazione naturale di cio che era superficiale. Un buon momento per rinnovare il campo affettivo e i valori con piu profondita e soddisfazione, coltivando cio che e genuino con apertura e presenza reale.',

    // Luna — congiunzione
    'transit:moon|conjuncao|mercury':
      'Luna in congiunzione a Mercurio natale avvicina emozione e ragionamento, favorendo un espressione piu onesta di cio che si prova. Il transito di pochi giorni tende ad amplificare l intuizione nella comunicazione e la ricettivita ai messaggi dell ambiente. Buon momento per conversazioni rilevanti, annotazioni personali e decisioni che chiedono equilibrio tra logica e percezione interiore.',
    'transit:moon|conjuncao|venus':
      'Luna in congiunzione a Venere natale intensifica il bisogno di affetto, armonia e scambi piacevoli. Il transito di pochi giorni tende ad ampliare la sensibilita estetica e il desiderio di prendersi cura e essere curati. Momento opportuno per legami affettivi, creativita e attivita che alimentano piacere e benessere interno.',
    'transit:moon|conjuncao|jupiter':
      'Luna in congiunzione a Giove natale amplia il bisogno di senso e appartenenza, rendendo facile confondere entusiasmo genuino con esagerazione emotiva. Le tue aspettative possono crescere piu velocemente di quanto la realta possa confermare — e questo puo generare delusione proporzionale. Sfrutta lo slancio per avanzare in qualcosa di gia pianificato, mantenendo una misura concreta di cio che e possibile ora.',
    'transit:moon|conjuncao|saturn':
      'Luna in congiunzione a Saturno natale puo portare peso emotivo temporaneo, sensazione di limitazione o maggiore bisogno di struttura. Il transito di pochi giorni tende a evidenziare responsabilita in sospeso e l impatto di scelte passate. Momento di maggiore serieta che invita ad aggiustamenti pratici e riconoscimento onesto di cio che deve essere organizzato.',
    'transit:moon|conjuncao|neptune':
      'Luna in congiunzione a Nettuno natale intensifica sensibilita, intuizione e apertura a percezioni sottili. Il transito di pochi giorni puo portare sogni vividi, empatia amplificata e necessita di raccoglimento creativo. Buon momento per il contatto con arte, meditazione e processi interiori, con attenzione a non idealizzare situazioni ne disperdere energia.',
    'transit:moon|conjuncao|pluto':
      'Luna in congiunzione a Plutone natale puo portare emozioni con qualita compulsiva — un desiderio intenso di verita, profondita o risoluzione definitiva di qualcosa che disturba. Il rischio e reagire esternamente a cio che e essenzialmente una trasformazione interna: l intensita chiede elaborazione, non azione immediata. Permettiti di sentire il peso senza dover risolvere tutto ora — la chiarezza tende ad arrivare dopo che l intensita passa.',
    'transit:moon|conjuncao|ascendente':
      'Luna in congiunzione all Ascendente natale intensifica l espressione emotiva e il suo impatto sull ambiente circostante. Il transito di pochi giorni tende ad amplificare la sensibilita interpersonale e il bisogno di riconoscimento. Momento di maggiore visibilita emotiva: cio che si prova tende a essere percepito dagli altri con piu chiarezza.',
    'transit:moon|conjuncao|meio_do_ceu':
      'Luna in congiunzione al Medio Cielo natale avvicina vita emotiva e vita pubblica, potendo portare visibilita a temi personali. Il transito di pochi giorni tende ad amplificare la sensibilita attorno a carriera, reputazione e come si viene percepiti. Buon momento per allineare i bisogni emotivi con la direzione professionale in modo piu consapevole.',

    // Luna — opposizione
    'transit:moon|oposicao|sun':
      'Luna in opposizione al Sole natale crea tensione tra bisogno emotivo e volonta consapevole, chiedendo equilibrio tra sentire e agire. Il transito di pochi giorni tende a evidenziare conflitti tra cio che si desidera internamente e cio che si proietta verso il mondo. Momento di revisione: cio che vuole l ego potrebbe non essere cio di cui il campo emotivo ha davvero bisogno.',
    'transit:moon|oposicao|venus':
      'Luna in opposizione a Venere natale puo creare tensione tra cio che hai bisogno affettivamente e cio che riesci a chiedere o ricevere. C e rischio di dare piu di quanto senti o di aspettare che l altro indovini cio che non e stato detto. Momento di nominare il tuo vero bisogno nelle relazioni vicine — senza proiettare mancanza ne fingere che tutto vada bene quando non e cosi.',
    'transit:moon|oposicao|saturn':
      'Luna in opposizione a Saturno natale tende a creare conflitto tra il bisogno di accoglienza e l esigenza di funzionalita — cio che senti puo sembrare un ostacolo di fronte a cio che devi compiere. C e rischio di sopprimere emozioni legittime per apparire piu competente o responsabile di quanto ti senti. Momento per riconoscere che prenderti cura di te non e fuggire dalle responsabilita — e cio che sostiene la capacita di adempierle.',
    'transit:moon|oposicao|uranus':
      'Luna in opposizione a Urano natale puo portare instabilita emotiva improvvisa o un urgente bisogno di cambiamento e liberta. Il transito di pochi giorni tende a creare imprevedibilita nelle reazioni e difficolta a mantenere routine emotive stabili. Buon momento per osservare cio che chiede rinnovamento, senza prendere decisioni brusche per impulso.',
    'transit:moon|oposicao|neptune':
      'Luna in opposizione a Nettuno natale puo creare confusione tra cio che senti davvero e cio che vorresti sentire — o cio che credi di dover sentire. Il rischio e proiettare speranza su situazioni o persone che non hanno ancora mostrato sufficiente chiarezza per sostenerla. Usa il periodo per chiederti: cosa e reale qui, e cosa e il mio bisogno che le cose siano diverse da cio che sono?',
    'transit:moon|oposicao|pluto':
      'Luna in opposizione a Plutone natale puo risvegliare impulso di controllo o bisogno di dominare situazioni quando l emozione diventa troppo intensa da sopportare. Il par tende a rivelare dinamiche di potere nelle relazioni vicine — chi ha piu influenza, chi cede, chi trattiene risentimenti. Chiediti: stai reagendo a cio che accade ora o a un vecchio schema che questa situazione ha risvegliato?',
    'transit:moon|oposicao|ascendente':
      'Luna in opposizione all Ascendente natale crea tensione tra i propri bisogni emotivi e le richieste dell ambiente o delle relazioni. Il transito di pochi giorni tende a evidenziare lo squilibrio tra cio di cui hai bisogno e cio che gli altri si aspettano. Momento di revisione dei limiti: dare agli altri non puo costare il proprio sostegno interno.',
    'transit:moon|oposicao|meio_do_ceu':
      'Luna in opposizione al Medio Cielo natale puo creare tensione tra vita emotiva o familiare ed esigenze della vita pubblica e professionale. Il transito di pochi giorni tende a evidenziare dove base personale e reputazione esterna tirano in direzioni opposte. Momento per allineare cio che si cura internamente con cio che si proietta al mondo.',

    // Luna — quadratura
    'transit:moon|quadratura|sun':
      'Luna in quadratura al Sole natale crea attrito tra bisogno emotivo ed espressione della volonta personale. Il transito di pochi giorni tende a evidenziare dove sentimento e impulso all azione sono in conflitto. Momento di rallentare prima di agire: aggiustare il corso interno puo essere piu efficace che forzare una decisione esterna.',
    'transit:moon|quadratura|mercury':
      'Luna in quadratura a Mercurio natale puo creare conflitto tra cio che vuoi esprimere e cio che la tua logica lascia uscire — il cuore vuole dire cio che la mente sta ancora cercando di organizzare. Il rischio e concludere che le persone non ti capiscono quando, in realta, tu stesso stai ancora elaborando cio che senti. Prima di comunicare qualcosa di importante, permettiti di sentire prima — la chiarezza viene dopo l elaborazione, non prima.',
    'transit:moon|quadratura|venus':
      'Luna in quadratura a Venere natale puo creare attrito tra bisogno affettivo e il modello di valore o armonia cercato nelle relazioni. Il transito di pochi giorni tende a evidenziare insoddisfazioni negli scambi o aspettative non soddisfatte. Momento per rivedere cio che vuoi davvero nei legami, senza proiettare frustrazione su chi ti e vicino.',
    'transit:moon|quadratura|saturn':
      'Luna in quadratura a Saturno natale puo portare peso emotivo, sensazione di blocco o conflitto tra sentire e adempiere agli obblighi. Il transito di pochi giorni tende a evidenziare dove rigidita o autocritica eccessiva interferiscono con il benessere. Momento per accogliere cio che e legittimo sentire senza cedere a autoesigenze sproporzionate.',
    'transit:moon|quadratura|uranus':
      'Luna in quadratura a Urano natale puo portare impazienza emotiva e urgente voglia di rompere con cio che sembra stagnante — anche quando la direzione del cambiamento non e ancora chiara. Puoi sapere che qualcosa deve cambiare senza sapere esattamente cosa, e questo tende a generare irritazione con cio che e vicino. Osserva cosa provoca piu agitazione interna: quei punti di solito indicano dove il rinnovamento genuino e necessario, non dove l azione impulsiva aiuta.',
    'transit:moon|quadratura|neptune':
      'Luna in quadratura a Nettuno natale puo rendere difficile separare cio che senti da cio che immagini, da cio che temi o da cio che vorresti fosse vero — i confini interni diventano porosi. C e tendenza a fuggire in distrazione, sogno o idealizzazione come risposta a una realta scomoda che non e ancora pronta per essere affrontata. Crea piccole ancore fisiche nella vita quotidiana — passeggiate, routine semplici — prima di qualsiasi decisione che coinvolga emozione elevata.',
    'transit:moon|quadratura|pluto':
      'Luna in quadratura a Plutone natale puo portare impulso di controllare situazioni o persone come forma inconscia di non perdere il controllo su cio che si sente. L intensita emotiva puo generare reazioni sproporzionate a piccole provocazioni — cio che irrita ora raramente e solo cio che sembra essere. Chiediti: sto reagendo al presente o a una vecchia paura che questa situazione ha semplicemente risvegliato?',
    'transit:moon|quadratura|ascendente':
      'Luna in quadratura all Ascendente natale crea attrito tra bisogni emotivi interni e il modo in cui ci si presenta al mondo. Il transito di pochi giorni tende a evidenziare il disallineamento tra cio che si prova e cio che si proietta. Momento per rivedere la maschera sociale: l autenticita tende a essere piu efficace dell aggiustamento di immagine.',
    'transit:moon|quadratura|meio_do_ceu':
      'Luna in quadratura al Medio Cielo natale puo creare tensione tra vita emotiva e le esigenze della vita professionale o pubblica. Il transito di pochi giorni tende a rendere difficile separare cio che si prova da cio che e atteso nel contesto lavorativo. Momento per creare limiti chiari tra spazio personale e spazio di consegna professionale.',

    // Luna — trigono
    'transit:moon|trigono|sun':
      'Luna in trigono al Sole natale favorisce l integrazione tra vita emotiva ed espressione consapevole, creando fluidita tra sentire e agire. Il transito di pochi giorni sostiene autenticita e maggiore coerenza interna. Buon momento per decisioni che chiedono allineamento tra volonta e bisogno, iniziative personali e cura di cio che conta davvero.',
    'transit:moon|trigono|mercury':
      'Luna in trigono a Mercurio natale favorisce la comunicazione empatica, l espressione chiara dei sentimenti e la comprensione piu facile di cio che l altro vuol dire. Il transito di pochi giorni sostiene fluidita tra intuizione e ragionamento. Buon momento per conversazioni importanti, scrittura creativa e decisioni che chiedono sia logica sia sensibilita.',
    'transit:moon|trigono|venus':
      'Luna in trigono a Venere natale favorisce armonia affettiva, piacere negli scambi e maggiore facilita di prendersi cura e essere curati. Il transito di pochi giorni sostiene il benessere emotivo e l apertura a cio che e bello e piacevole. Buon momento per rafforzare legami, attivita creative e tutto cio che nutre il campo affettivo.',
    'transit:moon|trigono|mars':
      'Luna in trigono a Marte natale favorisce l azione mossa da motivazione genuina, con energia fisica ed emotiva allineate. Il transito di pochi giorni sostiene l iniziativa pratica con meno resistenza interna. Buon momento per iniziare progetti, fare esercizio fisico e qualsiasi attivita che richieda sia coraggio sia sensibilita.',
    'transit:moon|trigono|jupiter':
      'Luna in trigono a Giove natale favorisce apertura emotiva, ottimismo moderato e maggiore facilita di vedere cio che e possibile. Il transito di pochi giorni sostiene la disponibilita ad apprendere e a espandersi senza perdere equilibrio. Buon momento per condividere idee, pianificare il futuro e nutrire connessioni che alimentano la crescita personale.',
    'transit:moon|trigono|uranus':
      'Luna in trigono a Urano natale favorisce l apertura al nuovo senza generare instabilita emotiva. Il transito di pochi giorni sostiene creativita, intuizione e disponibilita a sperimentare percorsi diversi. Buon momento per idee inattese, leggeri cambiamenti di routine e connessioni che stimolano prospettive fuori dal solito schema.',
    'transit:moon|trigono|neptune':
      'Luna in trigono a Nettuno natale favorisce sensibilita elevata, intuizione raffinata e contatto con dimensioni creative e spirituali. Il transito di pochi giorni sostiene empatia profonda e apertura a percezioni sottili. Buon momento per attivita artistiche, meditazione, sogni lucidi e connessioni che toccano qualcosa di piu profondo del quotidiano.',
    'transit:moon|trigono|pluto':
      'Luna in trigono a Plutone natale favorisce il contatto con emozioni profonde in modo fluido e meno minaccioso. Il transito di pochi giorni sostiene la capacita di elaborare cio che normalmente e difficile da raggiungere. Buon momento per autoconoscenza, conversazioni intime rilevanti e qualsiasi processo che chieda coraggio emotivo senza eccesso di intensita.',
    'transit:moon|trigono|ascendente':
      'Luna in trigono all Ascendente natale favorisce autenticita nella presenza e maggiore facilita di esprimere chi si e al mondo. Il transito di pochi giorni sostiene empatia nelle interazioni e ricettivita dell ambiente. Buon momento per presentazioni personali, incontri importanti e qualsiasi situazione che chieda presenza genuina.',
    'transit:moon|trigono|meio_do_ceu':
      'Luna in trigono al Medio Cielo natale favorisce l integrazione tra vita emotiva e direzione professionale, con maggiore facilita di agire con scopo. Il transito di pochi giorni sostiene la ricettivita del pubblico e della leadership. Buon momento per comunicare progetti, rafforzare la reputazione e allineare cio che si prova con cio che si consegna.',

    // Luna — sestile
    'transit:moon|sextil|sun':
      'Luna in sestile al Sole natale apre una finestra di fluidita tra vita emotiva ed espressione dell identita. Il transito di pochi giorni invita a piccole azioni allineate con cio che si vuole e cio che si prova. Buon momento per iniziative personali che necessitano di motivazione interiore genuina per partire.',
    'transit:moon|sextil|mercury':
      'Luna in sestile a Mercurio natale apre spazio per comunicazione piu fluida e ricettivita a informazioni con sfumatura emotiva. Il transito di pochi giorni invita a conversazioni, studio e scambi che combinano ragionamento e sensibilita. Buon momento per dialoghi importanti, scrittura creativa e risoluzione di questioni pendenti che richiedono chiarezza ed empatia.',
    'transit:moon|sextil|venus':
      'Luna in sestile a Venere natale apre spazio per scambi affettivi piacevoli e momenti di cura attorno a cio che e bello e significativo. Il transito di pochi giorni invita a coltivare armonia nelle relazioni e piacere nelle attivita quotidiane. Buon momento per rafforzare legami, attivita creative e piccoli gesti di affetto che fanno la differenza.',
    'transit:moon|sextil|mars':
      'Luna in sestile a Marte natale apre spazio per iniziative mosse da motivazione genuina e uso pratico dell energia disponibile. Il transito di pochi giorni invita all azione concreta in qualcosa che conta emotivamente. Buon momento per iniziare progetti personali, fare esercizio fisico e canalizzare la disponibilita in attivita con scopo chiaro.',
    'transit:moon|sextil|jupiter':
      'Luna in sestile a Giove natale apre una finestra di ottimismo moderato e facilita di connettersi con cio che nutre la crescita. Il transito di pochi giorni invita ad ampliare le prospettive e a esplorare possibilita con curiosita. Buon momento per imparare qualcosa di nuovo, pianificare viaggi o studi e coltivare connessioni che alimentano la visione del futuro.',
    'transit:moon|sextil|uranus':
      'Luna in sestile a Urano natale apre spazio per rinnovamento leggero e ricettivita a cio che e inatteso o diverso dal solito. Il transito di pochi giorni invita a flessibilita creativa e novita senza instabilita. Buon momento per esperimenti, cambiamenti di routine e connessioni con persone che ampliano la prospettiva.',
    'transit:moon|sextil|neptune':
      'Luna in sestile a Nettuno natale apre spazio per sensibilita raffinata, intuizione e contatto con dimensioni creative o spirituali. Il transito di pochi giorni invita all apertura a percezioni sottili e all empatia profonda. Buon momento per arte, meditazione, sogni e qualsiasi attivita che nutra il campo interiore con leggerezza.',
    'transit:moon|sextil|pluto':
      'Luna in sestile a Plutone natale apre una finestra di accesso a emozioni piu profonde senza che cio generi intensita eccessiva. Il transito di pochi giorni invita a riflessione su cio che deve essere trasformato con cura e intenzione. Buon momento per autoconoscenza, conversazioni di profondita e qualsiasi processo di pulizia emotiva leggera.',
    'transit:moon|sextil|ascendente':
      'Luna in sestile all Ascendente natale apre spazio per maggiore autenticita nella presenza e facilita di connessione interpersonale. Il transito di pochi giorni invita a interazioni spontanee e all espressione piu genuina di se stessi. Buon momento per incontri, presentazioni e qualsiasi situazione che chieda presenza ricettiva e senza eccessive difese.',
    'transit:moon|sextil|meio_do_ceu':
      'Luna in sestile al Medio Cielo natale apre una finestra per allineare vita emotiva e direzione professionale in modo naturale. Il transito di pochi giorni invita ad azioni di visibilita che non costano molto sforzo quando il momento e quello giusto. Buon momento per conversazioni con la leadership, condivisione di progetti e movimenti discreti di posizionamento.',
},
}
