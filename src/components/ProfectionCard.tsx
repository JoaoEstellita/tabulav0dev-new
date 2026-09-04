import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../hooks/useAuth'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { computeProfection, type ProfectionResult } from '../astro/profections'
import { profectionHouseText, profectionLordBlurb, type ProfLang } from '../data/profectionReadings'

// Ano profeccional (helenístico): a casa que "se acende" no ano + o senhor do ano.
// Espelho ocidental da Dasha védica — dá à Previsão uma espinha de timing anual.

const PLANET_PT: Record<string, Record<ProfLang, string>> = {
  sun: { 'pt-BR': 'Sol', 'en-US': 'Sun', 'es-ES': 'Sol', 'it-IT': 'Sole' },
  moon: { 'pt-BR': 'Lua', 'en-US': 'Moon', 'es-ES': 'Luna', 'it-IT': 'Luna' },
  mercury: { 'pt-BR': 'Mercúrio', 'en-US': 'Mercury', 'es-ES': 'Mercurio', 'it-IT': 'Mercurio' },
  venus: { 'pt-BR': 'Vênus', 'en-US': 'Venus', 'es-ES': 'Venus', 'it-IT': 'Venere' },
  mars: { 'pt-BR': 'Marte', 'en-US': 'Mars', 'es-ES': 'Marte', 'it-IT': 'Marte' },
  jupiter: { 'pt-BR': 'Júpiter', 'en-US': 'Jupiter', 'es-ES': 'Jupiter', 'it-IT': 'Giove' },
  saturn: { 'pt-BR': 'Saturno', 'en-US': 'Saturn', 'es-ES': 'Saturno', 'it-IT': 'Saturno' },
}

const SIGN_NAMES: Record<ProfLang, string[]> = {
  'pt-BR': ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'],
  'en-US': ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
  'es-ES': ['Aries', 'Tauro', 'Geminis', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'],
  'it-IT': ['Ariete', 'Toro', 'Gemelli', 'Cancro', 'Leone', 'Vergine', 'Bilancia', 'Scorpione', 'Sagittario', 'Capricorno', 'Acquario', 'Pesci'],
}

const asLang = (l: string): ProfLang =>
  l === 'en-US' || l === 'es-ES' || l === 'it-IT' ? l : 'pt-BR'

export default function ProfectionCard() {
  const { user } = useAuth()
  const { language } = useAppLanguage()
  const lang = asLang(language)
  const [prof, setProf] = useState<ProfectionResult | null>(null)

  useEffect(() => {
    let alive = true
    if (!user?.uid) return
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      const d: any = snap.data() || {}
      const asc = typeof d?.natalAscDeg === 'number' ? d.natalAscDeg : null
      const birth = d?.birthDate || d?.birthData?.birthDate || null
      if (!alive) return
      if (asc == null || !birth) { setProf(null); return }
      setProf(computeProfection(birth, asc))
    }).catch(() => { if (alive) setProf(null) })
    return () => { alive = false }
  }, [user?.uid])

  if (!prof) return null
  const house = profectionHouseText(prof.house, lang)
  if (!house) return null

  const sign = SIGN_NAMES[lang][prof.signIndex]
  const lordName = PLANET_PT[prof.timeLordEn]?.[lang] || prof.timeLordPt
  const lordBlurb = profectionLordBlurb(prof.timeLordEn, lang)
  const monthSign = SIGN_NAMES[lang][prof.monthSignIndex]

  const L = {
    tag: { 'pt-BR': 'Seu ano profeccional', 'en-US': 'Your profection year', 'es-ES': 'Tu ano profeccional', 'it-IT': 'Il tuo anno profettizio' }[lang],
    age: { 'pt-BR': `${prof.ageYears} anos`, 'en-US': `age ${prof.ageYears}`, 'es-ES': `${prof.ageYears} anos`, 'it-IT': `${prof.ageYears} anni` }[lang],
    houseLabel: { 'pt-BR': `Casa ${prof.house}`, 'en-US': `House ${prof.house}`, 'es-ES': `Casa ${prof.house}`, 'it-IT': `Casa ${prof.house}` }[lang],
    lordLabel: { 'pt-BR': 'Senhor do ano', 'en-US': 'Lord of the year', 'es-ES': 'Senor del ano', 'it-IT': 'Signore dell anno' }[lang],
    triggers: {
      'pt-BR': `Os trânsitos a ${lordName} marcam os gatilhos do ano.`,
      'en-US': `Transits to ${lordName} mark the year's triggers.`,
      'es-ES': `Los transitos a ${lordName} marcan los disparadores del ano.`,
      'it-IT': `I transiti a ${lordName} segnano gli inneschi dell anno.`,
    }[lang],
    month: {
      'pt-BR': `Este mês acende a Casa ${prof.monthHouse} (${monthSign}).`,
      'en-US': `This month lights up House ${prof.monthHouse} (${monthSign}).`,
      'es-ES': `Este mes enciende la Casa ${prof.monthHouse} (${monthSign}).`,
      'it-IT': `Questo mese accende la Casa ${prof.monthHouse} (${monthSign}).`,
    }[lang],
  }

  return (
    <View style={s.card}>
      <View style={s.headRow}>
        <Text style={s.tag}>🕰️ {L.tag}</Text>
        <Text style={s.age}>{L.age}</Text>
      </View>
      <Text style={s.title}>{house.title}</Text>
      <Text style={s.sub}>{L.houseLabel} · {sign}</Text>
      <Text style={s.body}>{house.body}</Text>
      <View style={s.lordBox}>
        <Text style={s.lordLabel}>{L.lordLabel}: <Text style={s.lordName}>{lordName}</Text></Text>
        <Text style={s.lordBlurb}>{lordBlurb}</Text>
        <Text style={s.triggers}>{L.triggers}</Text>
      </View>
      <Text style={s.month}>{L.month}</Text>
    </View>
  )
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#161728', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,215,0,0.22)',
    padding: 18, marginHorizontal: 16, marginBottom: 14,
  },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tag: { color: '#FFD700', fontSize: 12, fontWeight: '800', letterSpacing: 0.4, textTransform: 'uppercase' },
  age: { color: '#6E6F8C', fontSize: 12, fontWeight: '600' },
  title: { color: '#EDEBF7', fontSize: 18, fontWeight: '800', marginBottom: 2 },
  sub: { color: '#9A9CB8', fontSize: 13, fontWeight: '600', marginBottom: 10 },
  body: { color: '#C9CBE0', fontSize: 14, lineHeight: 21 },
  lordBox: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  lordLabel: { color: '#9A9CB8', fontSize: 13, fontWeight: '600' },
  lordName: { color: '#FFD700', fontWeight: '800' },
  lordBlurb: { color: '#C9CBE0', fontSize: 13.5, lineHeight: 20, marginTop: 4 },
  triggers: { color: '#8E8FB0', fontSize: 12.5, fontStyle: 'italic', marginTop: 6 },
  month: { color: '#9A9CB8', fontSize: 13, marginTop: 12 },
})
