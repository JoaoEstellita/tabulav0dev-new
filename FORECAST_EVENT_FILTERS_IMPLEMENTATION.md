# Forecast Event Filters - Implementation Log

## Objective
Add day-event filters and sorting on `Forecast` page with UX similar to Profile modal chips, and persist per user.

## Scope
- Page: `src/screens/forecast/ForecastScreen.tsx`
- Data source: `selectedEventsRaw` (events of selected day)
- Persistence:
  - Local: `AsyncStorage`
  - Remote: Firestore `users/{uid}.preferences.forecastEventFilters`

## Filter Model
- Key prefix: `forecast_event_filters_v1`
- State fields:
  - `transitKinds`: `planet_planet | planet_house`
  - `aspects`
  - `dignities`: `domicile_exalted | debilitated | neutral | unknown`
  - `houseStrengths`: `angular | succedent | cadent | unknown`
  - `conditions`: `retrograde | stationary | applying | separating | exact`
  - `impacts`: `UP | DOWN | MIXED`
  - `domains`
  - `sortBy`: `impact_desc | recent_desc | peak_near | intensity_desc | orb_asc`

## UX/Behavior
- Added horizontal chips in day events section:
  - Transit, Aspect, Dignity, House Strength, Conditions, Sorting
- Added active filters counter.
- Added clear-all action.
- Added modal for category options.
- Filter options are dynamic from selected day events.
- Sorting applies after filtering.

## Persistence Rules
- Load order:
  1. Local (AsyncStorage)
  2. Remote (Firestore)
- Conflict resolution:
  - Keep state with higher `updatedAt`.
- Save target:
  - Both local + remote
- Guard:
  - Save only after hydration completes (`filtersHydrated`) to avoid overwriting saved state at startup.

## Delivered in this step
- Filter state/types/constants.
- Option inference functions.
- Filtering/sorting pipeline.
- Modal + chips UI integration.
- Missing styles completed.
- Hydration guard applied.

## Remaining checks
- Run TypeScript check for this screen and dependent references.
- Manual QA:
  - Select date with/without events
  - Toggle each category
  - Change sort and verify order
  - Reload app and verify persistence
  - Login with same user on another device/browser and verify remote persistence

## Risks / Notes
- Conditions, dignity, and house strength rely on fallback inference because not all events provide explicit fields.
- Labels still use fallback literal strings where translation keys are missing.

## Next Enhancements
- Persist selected modal category (optional).
- Add per-category badge counts in chips.
- Add i18n keys for all new labels and keep fallback only for safety.
- Optionally add `impacts` and `domains` chips if product wants more granular filtering.
