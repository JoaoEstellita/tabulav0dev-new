import { TimezoneService } from '../timezone/TimezoneService'
import UserService from '../firebase/UserService'
import type { HouseSystem } from '../../astro/houseSystem'
import { normalizeHouseSystem, DEFAULT_HOUSE_SYSTEM } from '../../astro/houseSystem'

export interface NatalAscResult {
	ascendant: number
	midheaven: number
	cusps: number[]
	approximate: boolean
	timeZoneId?: string
}

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://tabulav0dev-backend.vercel.app'

export class NatalAscService {
	/**
	 * ⚠️ O sistema de casas NUNCA pode vir hardcoded aqui.
	 *
	 * Os dois métodos tinham `= 'whole-sign'` como padrão enquanto
	 * `DEFAULT_HOUSE_SYSTEM` é 'placidus' — e o onboarding ainda passava
	 * 'whole-sign' explicitamente. Resultado: TODO usuário tinha as cúspides
	 * gravadas em Casas Inteiras, qualquer que fosse a preferência dele, e a
	 * roda desenhava casas de 30° iguais.
	 *
	 * Não é detalhe de exibição: a casa muda a leitura de cada planeta. Um Sol
	 * na Casa 2 em Placidus pode cair na 3 em Casas Inteiras, e a interpretação
	 * inteira vai junto — sem nada acusar, porque os dois resultados são
	 * plausíveis.
	 */
	static async computeNatalAsc(birthDate: string, birthTime: string, latitude: number, longitude: number, system: HouseSystem = DEFAULT_HOUSE_SYSTEM): Promise<NatalAscResult> {
		// Resolve timezone histórico no dia do nascimento (00:00 UTC)
		const [y, m, d] = birthDate.split('-').map(n => parseInt(n, 10))
		// Meio-dia UTC para evitar bordas de DST
		const ts = Math.floor(Date.UTC(y, (m - 1), d, 12, 0, 0) / 1000)
		let tz: { offsetSec: number; timeZoneId?: string } | null = null
		try {
			const tzData = await TimezoneService.resolveOffsetSeconds(latitude, longitude, ts)
			// Só usa se offsetSec for um número válido (inclui 0 = UTC+0, ex: Londres)
			if (tzData && typeof tzData.offsetSec === 'number' && tzData.offsetSec !== undefined) {
				tz = tzData
			}
		} catch { /* timezone service falhou — usar natalISO com UTC calculado por longitude */ }
		const approximate = !tz
		const hh = parseInt(birthTime.split(':')[0] || '12', 10)
		const mm = parseInt(birthTime.split(':')[1] || '00', 10)

		// Converte hora local → UTC para enviar ao backend
		let natalUTCDate: Date
		if (tz && typeof tz.offsetSec === 'number') {
			natalUTCDate = new Date(Date.UTC(y, (m - 1), d, hh - tz.offsetSec / 3600, mm, 0))
		} else {
			// Aproximação por longitude: offset = lon/15 (negativo para oeste)
			// UTC = local - offset, ex: BRT UTC-3 → lon=-43.17 → offset=-2.9h → UTC = local+3
			const approxOffsetHours = longitude / 15
			natalUTCDate = new Date(Date.UTC(y, (m - 1), d, hh - Math.round(approxOffsetHours), mm, 0))
		}

		const body = {
			datetimeISO: new Date().toISOString(),
			lat: latitude,
			lon: longitude,
			includeHouses: true,
			system: normalizeHouseSystem(system),
			// Envia como ISO UTC (sem ambiguidade de timezone)
			natalISO: natalUTCDate.toISOString(),
			natalLat: latitude,
			natalLon: longitude,
			bodies: ['Sun'],
			debug: false,
		}

	const resp = await fetch(`${BACKEND_URL}/api/astro/positions`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		})
		if (!resp.ok) throw new Error(`backend ${resp.status}`)
		const json = await resp.json()
		const natal = json?.natal?.houses || json?.houses
		if (!natal?.ascendant || !Array.isArray(natal?.cusps)) throw new Error('natal houses unavailable')
		return {
			ascendant: Number(natal.ascendant),
			midheaven: Number(natal.midheaven),
			cusps: natal.cusps.map((c: any) => Number(c)),
			approximate,
			timeZoneId: tz?.timeZoneId
		}
	}

	static async computeAndPersist(userId: string, birthDate: string, birthTime: string, latitude: number, longitude: number, system: HouseSystem = DEFAULT_HOUSE_SYSTEM) {
		try {
			const result = await this.computeNatalAsc(birthDate, birthTime, latitude, longitude, system)
			await UserService.saveNatalAsc(userId, {
				natalAscDeg: result.ascendant,
				natalMcDeg: result.midheaven,
				natalCusps: result.cusps,
				natalSystem: normalizeHouseSystem(system),
				natalApproximate: result.approximate,
				natalTimeZoneId: result.timeZoneId,
			})
			return result
		} catch (e) {
			console.warn('⚠️ Falha ao calcular/persistir ASC natal:', (e as Error)?.message || e)
			throw e
		}
	}
}

export default NatalAscService



