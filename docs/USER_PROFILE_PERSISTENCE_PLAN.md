# UnaVida User Profile Persistence Plan

## Goal
Move student learning data from browser-only storage to user-bound cloud storage so progress follows users across devices.

## Product Decision
- **Source of truth:** Backend database (per authenticated user)
- **Client storage:** Local cache only (fast UX + offline tolerance)
- **Sync strategy:** Fetch on login, write-through on changes, periodic/background sync

---

## Scope (Phase 1)
Persist these entities per user:

1. **Bookmarks**
2. **Highlights / Notes**
3. **Reading progress** (chapter/section completion, last section, time spent)
4. **Quiz progress** (attempts, scores)
5. **Flashcard progress** (studied/mastered)

---

## Data Model (PostgreSQL)

### users
- `id` (uuid, pk)
- `email` (unique)
- `name`
- `role` (`student|instructor|admin`)
- `created_at`, `updated_at`

### user_bookmarks
- `id` (uuid, pk)
- `user_id` (fk -> users.id)
- `course_code` (e.g., `NUR1100`)
- `chapter_id` (e.g., `ch1`)
- `section_id` (e.g., `sec1_6_pk_vs_pd`)
- `label` (optional)
- `created_at`, `updated_at`
- **unique:** (`user_id`, `course_code`, `chapter_id`, `section_id`, `label`)

### user_highlights
- `id` (uuid, pk)
- `user_id` (fk)
- `course_code`
- `chapter_id`
- `section_id`
- `text`
- `color` (`orange|yellow|green`)
- `priority` (`High|Medium|Low`)
- `created_at`, `updated_at`

### user_reading_progress
- `id` (uuid, pk)
- `user_id` (fk)
- `course_code`
- `chapter_id`
- `last_section_id`
- `completed_sections` (jsonb)
- `total_time_spent_sec` (int)
- `percent_complete` (numeric)
- `created_at`, `updated_at`
- **unique:** (`user_id`, `course_code`, `chapter_id`)

### user_quiz_attempts
- `id` (uuid, pk)
- `user_id` (fk)
- `course_code`
- `chapter_id`
- `quiz_id`
- `score_percent`
- `answers` (jsonb)
- `attempted_at`

### user_flashcard_progress
- `id` (uuid, pk)
- `user_id` (fk)
- `course_code`
- `chapter_id`
- `stats` (jsonb)  // studied, mastered, streak, etc.
- `updated_at`
- **unique:** (`user_id`, `course_code`, `chapter_id`)

---

## API Contract (v1)

All endpoints require JWT auth; user inferred from token.

### Bookmarks
- `GET /api/v1/me/bookmarks?courseCode=&chapterId=`
- `POST /api/v1/me/bookmarks`
- `PATCH /api/v1/me/bookmarks/:id`
- `DELETE /api/v1/me/bookmarks/:id`

### Highlights
- `GET /api/v1/me/highlights?courseCode=&chapterId=`
- `POST /api/v1/me/highlights`
- `PATCH /api/v1/me/highlights/:id`
- `DELETE /api/v1/me/highlights/:id`

### Reading progress
- `GET /api/v1/me/progress/reading?courseCode=&chapterId=`
- `PUT /api/v1/me/progress/reading` (upsert)

### Quiz progress
- `GET /api/v1/me/progress/quiz?courseCode=&chapterId=`
- `POST /api/v1/me/progress/quiz/attempt`

### Flashcard progress
- `GET /api/v1/me/progress/flashcards?courseCode=&chapterId=`
- `PUT /api/v1/me/progress/flashcards` (upsert)

### Sync bootstrap
- `GET /api/v1/me/snapshot?courseCode=`
  - returns bookmarks + highlights + progress in one payload

---

## Frontend Sync Flow

1. User signs in
2. App calls `GET /api/v1/me/snapshot?courseCode=NUR1100`
3. App hydrates local state + localStorage cache
4. On user action (add bookmark, edit highlight, etc.):
   - optimistic UI update
   - API write
   - rollback if write fails
5. Background refresh every 2-5 minutes (or on focus)
6. On logout: clear local cache

---

## Migration Strategy (Current Local Data -> Cloud)

On first authenticated session:
1. Read local keys (`unavida:bookmarks`, `unavida:annotations`, legacy `unavida_progress`)
2. Transform into API payload format
3. Send one-time import endpoint:
   - `POST /api/v1/me/import-local-data`
4. Mark migration flag in localStorage: `unavida:migrated=true`

---

## Security + Integrity
- JWT required on all `/me/*` endpoints
- Row-level ownership checks (`user_id` must match token user)
- Input validation with schema (zod/joi)
- Rate limit write endpoints
- Soft-delete optional for auditability

---

## Build Order (Recommended)

### Step A (Now)
- Finalize API contract + DB schema ✅ (this doc)

### Step B
- Implement backend tables + `/api/v1/me/snapshot`
- Implement bookmarks/highlights CRUD first

### Step C
- Update Workbook + Reader to use API with local fallback

### Step D
- Add reading/quiz/flashcard progress sync

### Step E
- Add one-time migration endpoint for existing local users

---

## Why This Order
- Keeps Phase 3 UI momentum
- Avoids rework by freezing contract now
- Delivers user-visible cross-device value quickly (bookmarks/highlights first)
