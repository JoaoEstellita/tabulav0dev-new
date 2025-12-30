# Frontend Astro Contract

This document describes the expected contract between frontend and backend
for astro calculations.

## Backend Response (preferred)
The frontend prefers `positions` and `natal.houses` when available:

- `positions[]` with `{ body, lon, lat, dist, speed, house, retrograde }`
- `houses` with `{ system, systemEffective, cusps, ascendant, midheaven, approximate }`
- `natal.houses` same shape as `houses`

## Backward Compatibility
If `positions` is missing, the frontend falls back to:
- `planets[]` with `{ name, position, house }`
- `natalHouses` (top-level)

## House System Resolution
When assigning planet houses on the client, the priority is:
1) `houses.system` (user-selected)
2) `houses.systemEffective` (effective system used)
3) `__userHouseSystem` (global fallback)

## Cache Invalidation
Local cache is invalidated when:
- birth data changes
- house system changes
