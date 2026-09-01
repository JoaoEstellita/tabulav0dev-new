// Tzolkin Dreamspell — tipos. Dados matemáticos separados de traduções/interpretações.

export type ColorKey = 'red' | 'white' | 'blue' | 'yellow'

export interface GalacticTone {
  number: number // 1..13
  key: string
  namePt: string
  nameEn: string
  essencePt: string; essenceEn: string
  powerPt: string; powerEn: string
  actionPt: string; actionEn: string
}

export interface TzolkinSeal {
  number: number // 1..20
  key: string
  namePt: string; nameEn: string
  color: ColorKey
  powerPt: string; powerEn: string
  actionPt: string; actionEn: string
  essencePt: string; essenceEn: string
}

export interface OraclePosition { kin: number; seal: number; tone: number }

export interface FifthForceOracle {
  destiny: OraclePosition
  guide: OraclePosition
  analog: OraclePosition
  antipode: OraclePosition
  occult: OraclePosition
}

export interface Wavespell { index: number; position: number; rulingSeal: number; startKin: number }

export interface Castle { index: number; key: string; startKin: number; endKin: number }

export type EarthFamilyKey = 'portal' | 'polar' | 'cardinal' | 'core' | 'signal'

export interface TzolkinKin {
  kin: number // 1..260
  seal: number // 1..20
  tone: number // 1..13
  colorIndex: number // 0..3
  isHunabKuLeapDay: boolean
}

export interface TzolkinProfile extends TzolkinKin {
  oracle: FifthForceOracle
  wavespell: Wavespell
  castle: Castle
  earthFamily: EarthFamilyKey
}
