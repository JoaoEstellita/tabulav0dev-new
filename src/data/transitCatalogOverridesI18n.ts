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
},
  'es-ES': {
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
},
  'it-IT': {
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
},
}
