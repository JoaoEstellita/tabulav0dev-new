import * as Astronomy from 'astronomy-engine'

const OBLIQUITY_DEG = 23.4392911
const toRad = d => d*Math.PI/180
const toDeg = r => r*180/Math.PI
const norm360 = d => ((d%360)+360)%360

function computeAscMc(dateUTC, latDeg, lonDeg){
  const lstHours = Astronomy.SiderealTime(dateUTC, lonDeg)
  const theta = toRad(lstHours*15)
  const eps = toRad(OBLIQUITY_DEG)
  const phi = toRad(latDeg)
  const mc = norm360(toDeg(Math.atan2(Math.sin(theta)/Math.cos(eps), Math.cos(theta))))
  const sinA = Math.sin(theta)
  const cosA = Math.cos(theta)
  const num = 1
  const den = Math.cos(eps) * Math.tan(phi) + (Math.sin(eps) * (sinA / cosA))
  let asc = toDeg(Math.atan2(num, den)); if (asc < 0) asc += 360; asc = norm360(asc)
  return { asc, mc }
}

function lonToRa(lambdaDeg){
  const lam = toRad(norm360(lambdaDeg))
  const eps = toRad(OBLIQUITY_DEG)
  return Math.atan2(Math.sin(lam)*Math.cos(eps), Math.cos(lam))
}
function raToLon(raRad){
  const eps = toRad(OBLIQUITY_DEG)
  let lam = Math.atan2(Math.sin(raRad)*Math.cos(eps), Math.cos(raRad))
  if (lam < 0) lam += 2*Math.PI
  return norm360(toDeg(lam))
}
function semiArc(decRad, latRad){
  const val = -Math.tan(latRad)*Math.tan(decRad)
  const clamped = Math.max(-1, Math.min(1, val))
  return Math.acos(clamped)
}
function solveAngle(f, lo, hi, tol=1e-6, maxIter=60){
  let a=lo,b=hi,fa=f(a),fb=f(b)
  for(let i=0;i<maxIter;i++){
    const m=0.5*(a+b); const fm=f(m)
    if (Math.abs(fm) < tol) return m
    if (fa*fm <= 0){ b=m; fb=fm } else { a=m; fa=fm }
  }
  return 0.5*(a+b)
}

function computePlacidusCusps(dateUTC, latDeg, lonDeg, ascDeg, mcDeg){
  if (Math.abs(latDeg) >= 66){
    return { cusps: Array.from({length:12},(_,i)=>norm360(ascDeg+30*i)), asc:ascDeg, mc:mcDeg, approximate:true }
  }
  const lstHours = Astronomy.SiderealTime(dateUTC, lonDeg)
  const RAMC = ((lstHours*15)%360+360)%360
  const eps = toRad(OBLIQUITY_DEG)
  const lat = toRad(latDeg)

  const raFromLon = (lon)=>{
    const L = toRad(lon)
    const a = Math.atan2(Math.sin(L)*Math.cos(eps), Math.cos(L))
    let A = toDeg(a); if (A<0) A+=360; return A
  }
  const decFromLon = (lon)=>{
    const L = toRad(lon)
    return toDeg(Math.asin(Math.sin(eps)*Math.sin(L)))
  }
  const H0FromDec = (dec)=>{
    const D = toRad(dec)
    const val = -Math.tan(lat)*Math.tan(D)
    const clamped = Math.max(-1, Math.min(1, val))
    return toDeg(Math.acos(clamped))
  }
  const normalize = d=>((d%360)+360)%360
  function solveCusp(base, k, sign, seed){
    const f = (lon)=>{
      const ra = raFromLon(lon)
      const dec = decFromLon(lon)
      const H0 = H0FromDec(dec)
      const target = normalize(base + sign*k*H0)
      let diff = normalize(ra - target)
      if (diff > 180) diff -= 360
      return diff
    }
    let x0 = normalize(seed)
    let x1 = normalize(seed + (sign>0?+5:-5))
    let y0 = f(x0), y1 = f(x1)
    for (let i=0;i<40;i++){
      if (Math.abs(y1 - y0) < 1e-9) break
      const x2 = normalize(x1 - y1*(x1 - x0)/(y1 - y0))
      const y2 = f(x2)
      x0 = x1; y0 = y1
      x1 = x2; y1 = y2
      if (Math.abs(y1) < 1e-4) break
    }
    return normalize(x1)
  }
  const normalizeDeg = normalize
  const asc = normalizeDeg(ascDeg), mc = normalizeDeg(mcDeg)
  const dsc = normalizeDeg(asc + 180), ic = normalizeDeg(mc + 180)
  const span = (a,b)=> normalizeDeg(b - a)
  const along = (a,b,frac)=> normalizeDeg(a + frac*span(a,b))
  const seed12 = along(mc, asc, 2/3)
  const seed11 = along(mc, asc, 1/3)
  const seed9  = along(dsc, mc, 1/3)
  const seed8  = along(dsc, mc, 2/3)
  // Calibração: 11 = 1/3 leste; 12 = 2/3 leste; 9 = 2/3 oeste; 8 = 1/3 oeste
  const c11 = solveCusp(RAMC, 1/3, +1, seed11)
  const c12 = solveCusp(RAMC, 2/3, +1, seed12)
  const c9  = solveCusp(RAMC, 2/3, -1, seed9)
  const c8  = solveCusp(RAMC, 1/3, -1, seed8)
  const c5 = normalizeDeg(c11+180), c6 = normalizeDeg(c12+180), c3 = normalizeDeg(c9+180), c2 = normalizeDeg(c8+180)
  const c7 = normalizeDeg(asc+180)
  const cusps = [normalizeDeg(asc), c2, c3, normalizeDeg(ic), c5, c6, c7, c8, c9, normalizeDeg(mc), c11, c12]
  for(let i=0;i<12;i++){
    const a=cusps[i], b=cusps[(i+1)%12]
    const arc = ((b - a + 360) % 360)
    if (arc <= 0 || arc >= 180){
      return { cusps: Array.from({length:12},(_,i)=>normalizeDeg(asc+30*i)), asc:ascDeg, mc:mcDeg, approximate:true }
    }
  }
  return { cusps, asc: ascDeg, mc: mcDeg, approximate:false }
}

function withinArcCCW(a,b,x,eps=1e-9){
  const span = ((b - a + 360) % 360)
  const dx = ((x - a + 360) % 360)
  return dx > -eps && dx < span - eps
}

function assignHouses(cusps, planetLongitudes){
  const epsDeg = 0.03
  const result = {}
  for (const [name,L] of Object.entries(planetLongitudes)){
    let found = 12
    for(let i=0;i<12;i++){
      const a=cusps[i], b=cusps[(i+1)%12]
      const distA = Math.abs(((L - a + 360) % 360))
      const distB = Math.abs(((L - b + 360) % 360))
      if (distA < epsDeg){ found = i+1; break }
      if (distB < epsDeg){ found = ((i+1)%12)+1; break }
      if (withinArcCCW(a,b,L,1e-9)){ found = i+1; break }
    }
    result[name] = found
  }
  return result
}

function getPlanetLongitudes(dateUTC){
  const bodies = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto']
  const res = {}
  for (const name of bodies){
    const body = Astronomy.Body[name]
    const geo = Astronomy.GeoVector(body, dateUTC, false)
    const ecl = Astronomy.Ecliptic(geo)
    res[name] = norm360(ecl.elon)
  }
  return res
}

function fmtDeg(d){
  return d.toFixed(4)
}

async function run(){
  const lat = -22.9068, lon = -43.1729
  const natalUTC = new Date('1989-04-10T09:59:00Z')
  const transitUTC = new Date('2025-08-08T23:59:00Z')

  for (const [label, date] of [['Natal', natalUTC], ['Trânsito', transitUTC]]){
    const { asc, mc } = computeAscMc(date, lat, lon)
    const plac = computePlacidusCusps(date, lat, lon, asc, mc)
    const planets = getPlanetLongitudes(date)
    const houses = assignHouses(plac.cusps, planets)
    console.log(`\n=== ${label} ===`)
    console.log('ASC/MC:', { asc: fmtDeg(plac.asc), mc: fmtDeg(plac.mc), approximate: plac.approximate })
    console.log('Cusps:')
    plac.cusps.forEach((c,i)=> console.log(`C${i+1}: ${fmtDeg(c)}`))
    console.log('Planetas → Casa:')
    Object.entries(planets).forEach(([p,L])=>{
      console.log(`${p}: ${fmtDeg(L)} → Casa ${houses[p]}`)
    })
  }
}

run().catch(console.error)


