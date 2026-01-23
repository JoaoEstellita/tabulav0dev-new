export type MoonSvgKey =
  | 'new'
  | 'waxingCrescent'
  | 'firstQuarter'
  | 'waxingGibbous'
  | 'full'
  | 'waningGibbous'
  | 'lastQuarter'
  | 'waningCrescent'

const DARK = '#0F111A'
const LIGHT = '#F6F1D1'
const STROKE = '#E9E2B8'

export const MOON_SVGS: Record<MoonSvgKey, string> = {
  new: `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9" fill="${DARK}" stroke="${STROKE}" stroke-width="1" />
</svg>`,
  waxingCrescent: `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9" fill="${DARK}" stroke="${STROKE}" stroke-width="1" />
  <path d="M12 3a9 9 0 0 0 0 18c1.8 0 3.5-.5 5-1.4-2.9-.6-5-3.6-5-7.6 0-3.9 2.1-7 5-7.6-1.5-.9-3.2-1.4-5-1.4z" fill="${LIGHT}"/>
</svg>`,
  firstQuarter: `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9" fill="${DARK}" stroke="${STROKE}" stroke-width="1" />
  <path d="M12 3a9 9 0 0 1 0 18z" fill="${LIGHT}"/>
</svg>`,
  waxingGibbous: `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9" fill="${DARK}" stroke="${STROKE}" stroke-width="1" />
  <path d="M12 3a9 9 0 0 1 0 18c-1.8 0-3.5-.5-5-1.4 2.9-.6 5-3.6 5-7.6 0-3.9-2.1-7-5-7.6 1.5-.9 3.2-1.4 5-1.4z" fill="${LIGHT}"/>
</svg>`,
  full: `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9" fill="${LIGHT}" stroke="${STROKE}" stroke-width="1" />
</svg>`,
  waningGibbous: `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9" fill="${DARK}" stroke="${STROKE}" stroke-width="1" />
  <path d="M12 3a9 9 0 0 0 0 18c1.8 0 3.5-.5 5-1.4-2.9-.6-5-3.6-5-7.6 0-3.9 2.1-7 5-7.6-1.5-.9-3.2-1.4-5-1.4z" fill="${LIGHT}" transform="scale(-1,1) translate(-24,0)"/>
</svg>`,
  lastQuarter: `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9" fill="${DARK}" stroke="${STROKE}" stroke-width="1" />
  <path d="M12 3a9 9 0 0 0 0 18z" fill="${LIGHT}" transform="scale(-1,1) translate(-24,0)"/>
</svg>`,
  waningCrescent: `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9" fill="${DARK}" stroke="${STROKE}" stroke-width="1" />
  <path d="M12 3a9 9 0 0 1 0 18c-1.8 0-3.5-.5-5-1.4 2.9-.6 5-3.6 5-7.6 0-3.9-2.1-7-5-7.6 1.5-.9 3.2-1.4 5-1.4z" fill="${LIGHT}"/>
</svg>`
}

export const getMoonSvg = (key: MoonSvgKey | null) => {
  if (!key) return MOON_SVGS.new
  return MOON_SVGS[key] || MOON_SVGS.new
}
