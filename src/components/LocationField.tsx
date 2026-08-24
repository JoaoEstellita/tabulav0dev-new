// Campo de local por SELEÇÃO (não texto livre): escolhe o país (bandeira, num
// modal) e depois a cidade (autocomplete filtrado pelo país). Só emite quando a
// cidade é selecionada da lista — garante coords válidas (sem erro de digitação).
// Reutilizável: cidade atual e local de nascimento nas Configurações.
import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import LocationService, { type LocationSuggestion, type CountryOption } from '../services/LocationService'

export type PickedLocation = {
  city: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
  displayName: string
}

interface LocationFieldProps {
  value?: PickedLocation | null
  language?: string
  placeholder?: string
  onChange: (loc: PickedLocation) => void
}

export default function LocationField({ value, language = 'pt-BR', placeholder, onChange }: LocationFieldProps) {
  const [country, setCountry] = useState<CountryOption | null>(null)
  const [countryModal, setCountryModal] = useState(false)
  const [countryQuery, setCountryQuery] = useState('')
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([])

  const [cityQuery, setCityQuery] = useState(value?.displayName || '')
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [picked, setPicked] = useState(!!value)

  // País inicial: a partir do value (countryCode) ou BR.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const all = await LocationService.getSupportedCountries('', language)
      if (cancelled) return
      setCountryOptions(all)
      const initCode = (value?.countryCode || 'BR').toUpperCase()
      const found = all.find((c) => c.code === initCode) || null
      setCountry(found)
    })()
    return () => { cancelled = true }
  }, [language])

  const loadCountries = useCallback(async (q: string) => {
    setCountryOptions(await LocationService.getSupportedCountries(q, language))
  }, [language])

  const pickCountry = useCallback(async (c: CountryOption) => {
    setCountry(c)
    setCountryModal(false)
    setCountryQuery('')
    // Ao trocar de país, limpa a cidade e recarrega sugestões iniciais do país.
    setCityQuery('')
    setPicked(false)
    try {
      const s = await LocationService.searchLocations('', c.code, language)
      setSuggestions(s)
      setShowSuggestions(true)
    } catch { setSuggestions([]) }
  }, [language])

  const onCityChange = useCallback(async (text: string) => {
    setCityQuery(text)
    setPicked(false)
    setShowSuggestions(true)
    try {
      const s = await LocationService.searchLocations(text, country?.code || 'BR', language)
      setSuggestions(s)
    } catch { /* mantém sugestões anteriores */ }
  }, [country?.code, language])

  const pickCity = useCallback((loc: LocationSuggestion) => {
    setCityQuery(loc.displayName)
    setShowSuggestions(false)
    setPicked(true)
    onChange({
      city: loc.city,
      country: loc.country || country?.name || '',
      countryCode: (country?.code || 'BR').toUpperCase(),
      latitude: loc.latitude,
      longitude: loc.longitude,
      displayName: loc.displayName,
    })
  }, [country, onChange])

  return (
    <View>
      {/* Seletor de país */}
      <TouchableOpacity style={styles.countryBtn} onPress={() => { setCountryModal(true); loadCountries('') }}>
        <View style={styles.countryLeft}>
          <Ionicons name="globe-outline" size={18} color="#FFD700" />
          <Text style={styles.countryText}>{country ? `${country.flag} ${country.name}` : 'País'}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#FFD700" />
      </TouchableOpacity>

      {/* Campo cidade */}
      <View style={styles.cityRow}>
        <Ionicons name="location-outline" size={18} color="#888" style={{ marginRight: 6 }} />
        <TextInput
          style={styles.cityInput}
          placeholder={placeholder || 'Cidade (selecione da lista)'}
          placeholderTextColor="#888"
          value={cityQuery}
          onChangeText={onCityChange}
          onFocus={() => { if (suggestions.length) setShowSuggestions(true) }}
        />
        {picked ? <Ionicons name="checkmark-circle" size={18} color="#4ADE80" /> : null}
      </View>

      {showSuggestions && suggestions.length > 0 ? (
        <View style={styles.suggestions}>
          {suggestions.slice(0, 8).map((item, idx) => (
            <TouchableOpacity key={`${item.latitude}-${item.longitude}-${idx}`} style={styles.suggestionItem} onPress={() => pickCity(item)}>
              <Text style={styles.suggestionText}>{item.displayName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      {!picked && cityQuery.length > 0 ? (
        <Text style={styles.hint}>Selecione uma cidade da lista para confirmar.</Text>
      ) : null}

      {/* Modal de países */}
      <Modal visible={countryModal} animationType="slide" transparent onRequestClose={() => setCountryModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o país</Text>
              <TouchableOpacity onPress={() => setCountryModal(false)} style={styles.modalClose}>
                <Ionicons name="close" size={18} color="#FFD700" />
              </TouchableOpacity>
            </View>
            <View style={styles.cityRow}>
              <Ionicons name="search" size={18} color="#FFD700" style={{ marginRight: 6 }} />
              <TextInput
                style={styles.cityInput}
                placeholder="Buscar país"
                placeholderTextColor="#8E8E93"
                value={countryQuery}
                onChangeText={(t) => { setCountryQuery(t); loadCountries(t) }}
              />
            </View>
            <FlatList
              data={countryOptions}
              keyExtractor={(item) => item.code}
              style={styles.countryList}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.countryOption} onPress={() => pickCountry(item)}>
                  <Text style={styles.countryOptionText}>{item.flag}  {item.name}</Text>
                  {country?.code === item.code ? <Ionicons name="checkmark" size={18} color="#4ADE80" /> : null}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  countryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#2A2A3E', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 8,
  },
  countryLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  countryText: { color: '#E6E6E6', fontSize: 15 },
  cityRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#2A2A3E', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 4,
  },
  cityInput: { flex: 1, color: '#E6E6E6', fontSize: 15, paddingVertical: 10 },
  suggestions: { backgroundColor: '#1E1E32', borderRadius: 10, marginTop: 4, overflow: 'hidden' },
  suggestionItem: { paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  suggestionText: { color: '#D0D0D8', fontSize: 14 },
  hint: { color: '#9A9CB8', fontSize: 12, marginTop: 5, marginLeft: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#15152D', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, maxHeight: '75%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  modalTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  modalClose: { padding: 4 },
  countryList: { marginTop: 10 },
  countryOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 13, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  countryOptionText: { color: '#E6E6E6', fontSize: 15 },
})
