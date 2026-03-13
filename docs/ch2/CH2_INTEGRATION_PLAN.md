# Chapter 2 Integration Plan
## Pharmacokinetics - How the Body Processes Drugs

**Document Version:** 1.0  
**Created:** March 11, 2026  
**Status:** Ready for Implementation  
**Target Integration Timeline:** 2–3 weeks (phased rollout)

---

## 1. PROJECT OVERVIEW

### Scope
Integrate Chapter 2 (Pharmacokinetics) into the UnaVida frontend application, following the established architecture from Chapter 1. This plan outlines:
- File edit locations and structure
- Section ID mapping and naming conventions
- Content organization and data structure
- Placeholder strategy for phased content delivery
- QA validation checklist
- Deployment procedure

### Key Deliverables
- Chapter 2 JSON data file (`CHAPTER_2_PHARMACOKINETICS_PRODUCTION.json`)
- Component updates (ChapterReader, ChapterNav, section video/image maps)
- Media asset directories and placeholder structure
- QA validation suite
- Deployment checklist and rollback procedures

### Success Criteria
✅ Chapter 2 loads and renders without errors  
✅ All 10 sections navigate correctly with Previous/Next buttons  
✅ Progress tracking works across sections  
✅ Media placeholders (videos, images) are present and properly referenced  
✅ Notes, bookmarks, and highlights persist correctly  
✅ QA checks pass all validation tests  
✅ Zero console errors in production build

---

## 2. FILE STRUCTURE & EDIT LOCATIONS

### A. Data Files

#### Primary Chapter Data File
**Location:** `/src/data/CHAPTER_2_PHARMACOKINETICS_PRODUCTION.json`

**Structure:**
```json
{
  "chapter": {
    "id": "ch2_pharmacokinetics",
    "number": 2,
    "title": "Pharmacokinetics — The Journey of a Drug Through the Body",
    "course": "NUR1100",
    "courseTitle": "Fundamentals of Pharmacology",
    "estimatedMinutes": 180,
    "difficultyLevel": "Intermediate",
    "prerequisites": ["ch1_intro_to_pharmacology"],
    "learningObjectives": [
      {
        "id": "lo_ch2_01",
        "text": "Define the four core processes of pharmacokinetics (absorption, distribution, metabolism, excretion) and explain their clinical significance in drug efficacy and safety.",
        "bloomsLevel": "Remember"
      },
      // ... 7 more objectives
    ],
    "keyTakeaways": [
      "ADME is the foundation: Absorption, Distribution, Metabolism, Excretion",
      "Bioavailability varies by route: IV (100%) vs oral (30–80%)",
      // ... 7 more takeaways
    ],
    "sections": [
      {
        "id": "sec2_0_overview",
        "number": "2.1",
        "title": "Overview: Pharmacokinetics in Context",
        "duration": 45,
        "wordCount": 950,
        "objectives": [
          // Section-specific learning objectives
        ],
        "keyTerms": [
          "Pharmacokinetics",
          "ADME framework",
          "Therapeutic window",
          // ...
        ],
        "content": [
          {
            "type": "heading",
            "level": "h2",
            "text": "Overview: Pharmacokinetics in Context"
          },
          {
            "type": "narrative",
            "text": "Pharmacokinetics is what the body does to the drug..."
          },
          {
            "type": "definition",
            "term": "Pharmacokinetics",
            "definition": "The scientific study of how the body absorbs, distributes, metabolizes, and excretes drugs..."
          },
          {
            "type": "clinical_example",
            "heading": "Clinical Scenario: Digoxin Monitoring",
            "text": "A patient with heart failure is prescribed digoxin..."
          },
          {
            "type": "callout_safety",
            "text": "⚠️ Safety Alert: A small change in digoxin dose can shift patient from therapeutic to toxic levels..."
          },
          // ... more content blocks
        ],
        "relatedMedia": {
          "videos": ["ch2_v1_adme_overview"],
          "diagrams": ["ch2_im1_adme_process"],
          "images": []
        }
      },
      // ... 9 more sections (sec2_1 through sec2_9)
    ],
    "glossary": [
      {
        "term": "Absorption",
        "definition": "The process by which a drug moves from the site of administration into the bloodstream or body tissues.",
        "relatedSections": ["sec2_1_absorption"]
      },
      // ... 40+ glossary terms
    ],
    "references": [
      {
        "id": "ref_ch2_01",
        "citation": "Katzung, B. G., & Trevor, A. J. (2021). Basic & Clinical Pharmacology (15th ed.). McGraw-Hill.",
        "chapter": 1,
        "page": "22–45"
      }
      // ... more references
    ]
  }
}
```

**File Size:** ~250–300 KB (estimated, comparable to Chapter 1)
**Creation Method:** 
- Start with placeholder structure
- Gradually fill content from `CH2_STRUCTURE_DRAFT.md`
- Use content blocks that match Chapter 1 patterns

#### Backup File
**Location:** `/src/data/CHAPTER_2_PHARMACOKINETICS_PRODUCTION.backup.json`
- Created before any edits; serves as rollback point

---

### B. Component Files

#### 1. **ChapterReader.jsx** (EDIT)
**Location:** `/src/components/ChapterReader.jsx`  
**Lines to Modify:** ~40–60 (distributed across file)

**Edit 1:** Import statement (line ~10)
```javascript
// CURRENT:
import chapterData from '../data/CHAPTER_1_UNAVIDA_PRODUCTION.json';

// ADD: Dynamic chapter loading
import chapterData1 from '../data/CHAPTER_1_UNAVIDA_PRODUCTION.json';
import chapterData2 from '../data/CHAPTER_2_PHARMACOKINETICS_PRODUCTION.json';

// In component, extract chapter ID from URL params and select correct data:
const chapterId = params.chapterId; // e.g., "ch1_intro", "ch2_pharmacokinetics"
const chapterData = chapterId.startsWith('ch2') ? chapterData2 : chapterData1;
```

**Edit 2:** Update `sectionVideoMap` (line ~65)
```javascript
const sectionVideoMap = {
  // ... existing ch1 mappings ...
  sec2_0_overview: 'https://unavida-videos.s3.us-east-2.amazonaws.com/[PLACEHOLDER_VIDEO_URL]',
  sec2_1_absorption: 'https://unavida-videos.s3.us-east-2.amazonaws.com/[PLACEHOLDER_VIDEO_URL]',
  sec2_2_factors_absorption: 'https://unavida-videos.s3.us-east-2.amazonaws.com/[PLACEHOLDER_VIDEO_URL]',
  sec2_3_distribution: 'https://unavida-videos.s3.us-east-2.amazonaws.com/[PLACEHOLDER_VIDEO_URL]',
  sec2_4_metabolism: 'https://unavida-videos.s3.us-east-2.amazonaws.com/[PLACEHOLDER_VIDEO_URL]',
  sec2_5_excretion: 'https://unavida-videos.s3.us-east-2.amazonaws.com/[PLACEHOLDER_VIDEO_URL]',
  sec2_6_halflife: 'https://unavida-videos.s3.us-east-2.amazonaws.com/[PLACEHOLDER_VIDEO_URL]',
  sec2_7_special_populations: 'https://unavida-videos.s3.us-east-2.amazonaws.com/[PLACEHOLDER_VIDEO_URL]',
  sec2_8_enzyme_interactions: 'https://unavida-videos.s3.us-east-2.amazonaws.com/[PLACEHOLDER_VIDEO_URL]',
  sec2_9_clinical_application: 'https://unavida-videos.s3.us-east-2.amazonaws.com/[PLACEHOLDER_VIDEO_URL]',
};
```

**Edit 3:** Update `sectionIllustrationMap` (line ~90–140)
```javascript
const sectionIllustrationMap = {
  // ... existing ch1 mappings ...
  sec2_0_overview: [
    '/images/ch2/section-2-0/PLACEHOLDER_CH2_S2_0_v01.png',
    '/images/ch2/section-2-0/ADME_Pipeline.png',
    '/images/ch2/section-2-0/Therapeutic_Window.png',
  ],
  sec2_1_absorption: [
    '/images/ch2/section-2-1/PLACEHOLDER_CH2_S2_1_v01.png',
    '/images/ch2/section-2-1/Routes_of_Administration.png',
  ],
  // ... continue for all 10 sections ...
};
```

**Total Edits:** ~3 major edits (import, videoMap, illustrationMap)

#### 2. **ChapterNav.jsx** (EDIT)
**Location:** `/src/components/ChapterNav.jsx`  
**Lines to Modify:** Conditional rendering based on chapter ID

**Edit:** Add Chapter 2 TOC rendering logic
```javascript
// In the section rendering logic:
const renderSections = () => {
  if (chapterId.startsWith('ch2')) {
    return (
      <div className="space-y-3">
        <SectionItem id="sec2_0_overview" number="2.1" title="Pharmacokinetics Overview" duration={45} />
        <SectionItem id="sec2_1_absorption" number="2.2" title="Absorption: Getting Drugs In" duration={50} />
        <SectionItem id="sec2_2_factors_absorption" number="2.3" title="Factors Affecting Absorption" duration={50} />
        <SectionItem id="sec2_3_distribution" number="2.4" title="Drug Distribution" duration={55} />
        <SectionItem id="sec2_4_metabolism" number="2.5" title="Drug Metabolism" duration={60} />
        <SectionItem id="sec2_5_excretion" number="2.6" title="Drug Excretion" duration={50} />
        <SectionItem id="sec2_6_halflife" number="2.7" title="Half-Life & Steady State" duration={55} />
        <SectionItem id="sec2_7_special_populations" number="2.8" title="Special Populations" duration={60} />
        <SectionItem id="sec2_8_enzyme_interactions" number="2.9" title="Enzyme Interactions" duration={50} />
        <SectionItem id="sec2_9_clinical_application" number="2.10" title="Clinical Application & Dosing" duration={60} />
      </div>
    );
  }
  // ... existing ch1 logic
};
```

---

### C. Public Assets Directory Structure

**Location:** `/public/images/ch2/`

```
/public/images/ch2/
├── section-2-0/               # Overview section images
│   ├── PLACEHOLDER_CH2_S2_0_v01.png
│   ├── ADME_Pipeline.png
│   ├── Therapeutic_Window.png
│   └── [REAL_IMAGES_TO_BE_ADDED]
├── section-2-1/               # Absorption section
│   ├── PLACEHOLDER_CH2_S2_1_v01.png
│   ├── Routes_of_Administration.png
│   └── [REAL_IMAGES_TO_BE_ADDED]
├── section-2-2/               # Factors affecting absorption
├── section-2-3/               # Distribution
├── section-2-4/               # Metabolism
├── section-2-5/               # Excretion
├── section-2-6/               # Half-life
├── section-2-7/               # Special populations
├── section-2-8/               # Enzyme interactions
└── section-2-9/               # Clinical application
```

**Placeholder Strategy for Images:**
- Create solid-color placeholder PNG files (500×500px minimum, 72 DPI)
- Use gradient: light blue to dark blue (indicates pharmacokinetics theme)
- Filename convention: `PLACEHOLDER_CH2_S[section_number]_v01.png`
- Each section folder should have 2–3 placeholders initially
- Real images are swapped in during Phase 2 without code changes

---

## 3. SECTION ID MAPPING & NAMING CONVENTION

### Naming Convention
All section IDs follow the pattern: `sec[CHAPTER]_[SECTION_INDEX]_[SHORT_SLUG]`

### Chapter 2 Section Mapping

| Section # | Internal ID | URL-Safe | Title | Duration | Word Count | Status |
|-----------|------------|----------|-------|----------|-----------|--------|
| 2.1 | `sec2_0_overview` | `ch2/2-1-overview` | Pharmacokinetics Overview | 45 min | ~950 words | Placeholder |
| 2.2 | `sec2_1_absorption` | `ch2/2-2-absorption` | Absorption: Routes & Bioavailability | 50 min | ~1,200 words | Placeholder |
| 2.3 | `sec2_2_factors_absorption` | `ch2/2-3-factors` | Factors Affecting Absorption | 50 min | ~1,000 words | Placeholder |
| 2.4 | `sec2_3_distribution` | `ch2/2-4-distribution` | Drug Distribution & Protein Binding | 55 min | ~1,100 words | Placeholder |
| 2.5 | `sec2_4_metabolism` | `ch2/2-5-metabolism` | Drug Metabolism (Phase I/II/III) | 60 min | ~1,300 words | Placeholder |
| 2.6 | `sec2_5_excretion` | `ch2/2-6-excretion` | Drug Excretion & Renal Function | 50 min | ~1,000 words | Placeholder |
| 2.7 | `sec2_6_halflife` | `ch2/2-7-halflife` | Half-Life, Steady-State & Accumulation | 55 min | ~1,200 words | Placeholder |
| 2.8 | `sec2_7_special_populations` | `ch2/2-8-special-pop` | Pharmacokinetics in Special Populations | 60 min | ~1,300 words | Placeholder |
| 2.9 | `sec2_8_enzyme_interactions` | `ch2/2-9-enzymes` | Enzyme Induction & Drug Interactions | 50 min | ~1,100 words | Placeholder |
| 2.10 | `sec2_9_clinical_application` | `ch2/2-10-clinical` | Clinical Application & Dosing Adjustments | 60 min | ~1,200 words | Placeholder |

**Total Expected Content:** 12,000–14,000 words

---

## 4. PLACEHOLDER STRATEGY

### Phase 1: Structural Placeholders (Week 1)
**Goal:** Get Chapter 2 loading and navigable without actual content

**Deliverables:**
1. Minimal JSON file with all section IDs, titles, and durations
2. 2–3 placeholder paragraphs per section (neutral filler text)
3. Placeholder images (gradient PNGs, 500×500px)
4. Placeholder video URLs (non-functional but syntactically valid)

**Example Placeholder Content:**
```json
{
  "type": "narrative",
  "text": "[CONTENT PLACEHOLDER: Section 2.1 detailed explanation of pharmacokinetics overview will be added here. This includes definition, ADME framework, therapeutic window concept, and introductory clinical scenario.]"
}
```

**Benefits:**
- QA team can test navigation, progress tracking, UI rendering
- Component links are functional
- No console errors from missing content
- Ready for parallel content writing

### Phase 2: Full Narrative Content (Week 2)
**Goal:** Replace placeholders with complete text from `CH2_STRUCTURE_DRAFT.md`

**Process:**
1. Copy narrative text from structure draft into each section's `content` array
2. Wrap in appropriate block types (narrative, definition, clinical_example, callout_safety)
3. Update `wordCount` field for each section
4. Verify all internal cross-references and glossary terms exist

### Phase 3: Media & Assets (Week 2–3)
**Goal:** Replace placeholder images and video URLs with real assets

**Process:**
1. Convert diagrams (from Figma/design files) to PNG images
2. Upload to S3 and obtain URLs
3. Replace placeholder image paths in `sectionIllustrationMap`
4. Replace placeholder video URLs with S3 links
5. Verify all media loads and renders correctly

### Phase 4: Final Content Polish (Week 3)
**Goal:** Review, refine, and optimize all content

**Process:**
1. Verify learning objectives align with content
2. Ensure glossary terms are all defined
3. Check clinical examples for accuracy and relevance
4. Validate readability and tone consistency
5. Perform full QA suite

---

## 5. DATA STRUCTURE VALIDATION

### JSON Schema Rules

**Section Object Requirements:**
```javascript
{
  id: "sec2_X_slug",              // Required: unique, must match sectionIdPattern
  number: "2.X",                  // Required: chapter.section format
  title: "string",                // Required: 3–80 characters
  duration: number,               // Required: minutes (30–90)
  wordCount: number,              // Required: estimated word count
  objectives: string[],           // Required: 2–5 section-specific objectives
  keyTerms: string[],             // Required: 5–15 key vocabulary terms
  content: ContentBlock[],         // Required: 5–20 content blocks per section
  relatedMedia: {
    videos: string[],             // Optional: IDs of related videos
    diagrams: string[],           // Optional: IDs of related diagrams
    images: string[]              // Optional: IDs of additional images
  }
}
```

**Content Block Types:**
- `narrative`: Body text (primary content)
- `definition`: Key term + definition
- `clinical_example`: Real-world scenario
- `callout_safety`: ⚠️ Safety/exam alert
- `table`: Structured data (Routes of admin, CYP450 inducers, etc.)
- `list`: Bulleted or numbered list
- `image`: Embedded diagram/illustration
- `video`: Embedded video player

**Validation Checks:**
1. All section IDs match pattern `sec2_[0-9]_[a-z_]+`
2. All video URLs are S3 links (HTTPS, unavida-videos bucket)
3. All image paths start with `/images/ch2/`
4. No duplicate section IDs
5. Section numbers are sequential (2.1–2.10)
6. Total word count is within expected range (12,000–14,000)
7. All glossary terms referenced in content are defined
8. All learning objectives are unique and measurable (Bloom's taxonomy)

---

## 6. COMPONENT INTEGRATION CHECKLIST

### ChapterReader.jsx
- [ ] Import `CHAPTER_2_PHARMACOKINETICS_PRODUCTION.json`
- [ ] Add conditional logic to select correct chapter data based on `chapterId` param
- [ ] Update `sectionVideoMap` with all 10 section IDs
- [ ] Update `sectionIllustrationMap` with all 10 sections (placeholder paths)
- [ ] Verify video player component handles missing/placeholder URLs gracefully
- [ ] Test Previous/Next button navigation across all 10 sections
- [ ] Verify progress bar calculates correctly for 10 sections

### ChapterNav.jsx
- [ ] Add Chapter 2 TOC rendering in conditional block
- [ ] Ensure all 10 section IDs are clickable
- [ ] Verify section completion checkmarks work
- [ ] Test mobile collapsible behavior with new sections

### App.jsx
- [ ] Verify `/reader/ch2_pharmacokinetics` route is accessible
- [ ] Confirm route guards (ProtectedRoute) work correctly

### Data File Validation
- [ ] JSON parses without errors
- [ ] All required fields present for chapter object
- [ ] All 10 sections have required fields (id, number, title, duration, content)
- [ ] No duplicate IDs across sections or glossary
- [ ] Glossary terms (40+) are comprehensive
- [ ] References list is complete and formatted

---

## 7. QA VALIDATION SUITE

### A. Functional Testing

#### Content Loading
- [ ] Chapter 2 loads without console errors
- [ ] All section content renders on first load
- [ ] JSON parse succeeds (no syntax errors)
- [ ] No 404 errors for image placeholders
- [ ] Video player appears (even if video URL is placeholder)

#### Navigation
- [ ] TOC correctly displays all 10 sections with numbering (2.1–2.10)
- [ ] Clicking section in TOC jumps to correct section
- [ ] Previous button disabled on section 2.1
- [ ] Next button disabled on section 2.10
- [ ] Previous/Next buttons navigate in correct order
- [ ] Section title updates when navigating

#### Progress Tracking
- [ ] Initial load sets progress to 0%
- [ ] Scrolling through section increments progress bar
- [ ] Completion % updates as sections are marked complete
- [ ] Marking section complete via checkbox persists on reload
- [ ] Overall chapter completion shows % (e.g., 40% = 4/10 sections)

#### Study Tools
- [ ] Notes: Can add note to any section, persists to localStorage
- [ ] Bookmarks: Can bookmark any section, appears in bookmarks list
- [ ] Highlights: Can highlight text, color options work (5 colors)
- [ ] Learning Outcomes: All chapter objectives display in right sidebar
- [ ] Glossary: All ~40+ terms are searchable and appear in right panel

#### Accessibility
- [ ] Page zoom (100%–200%) works without layout breaking
- [ ] Font size adjustment works (12px–24px)
- [ ] Dark/Light theme toggle doesn't break readability
- [ ] Keyboard navigation works (Tab, Enter, Arrow keys)
- [ ] Screen reader (VoiceOver/NVDA) can navigate content

### B. Content Quality Checks

#### Text Quality
- [ ] Spell check: No obvious typos (use automated tool or manual review)
- [ ] Grammar: Sentences are grammatically correct and professional
- [ ] Tone: Matches Chapter 1 voice (clinical, accessible, narrative-driven)
- [ ] Length: Each section is within target word count ±10%

#### Learning Objectives
- [ ] 8 chapter-level objectives provided
- [ ] Each objective uses action verb (Define, Explain, Analyze, Apply, etc.)
- [ ] Objectives are measurable and testable
- [ ] No overlap/duplication between objectives

#### Clinical Examples
- [ ] At least one clinical scenario per section
- [ ] Examples use realistic patient cases
- [ ] Examples connect to pharmacokinetics concepts being taught
- [ ] Examples are scenario-based (not just lists)

#### Safety Alerts
- [ ] At least one ⚠️ safety callout per chapter
- [ ] Safety alerts highlight critical nursing implications
- [ ] Alerts are concise (<100 words)
- [ ] Alerts relate directly to section topic

#### Glossary
- [ ] 40+ terms defined
- [ ] Definitions are concise (1–2 sentences)
- [ ] Related sections linked for each term
- [ ] No circular definitions

### C. Visual & Media Tests

#### Image Rendering
- [ ] All placeholder images display without broken links
- [ ] Images scale correctly on mobile/tablet/desktop
- [ ] Image alt text is descriptive (for accessibility)

#### Video Placeholder
- [ ] Video player component appears in appropriate sections
- [ ] Placeholder video URL doesn't cause console errors
- [ ] Video player is responsive (doesn't overflow on mobile)

#### Styling & Layout
- [ ] Two-column layout (TOC + content) displays correctly on desktop
- [ ] Single-column layout displays correctly on mobile (<768px)
- [ ] Sidebars (TOC, tools) collapse/expand properly on mobile
- [ ] Header (title, progress bar) doesn't scroll off screen
- [ ] Code blocks (if any) have proper styling and scrolling

### D. Cross-Browser Testing

- [ ] Chrome/Chromium (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Mobile Safari (iOS 14+)
- [ ] Chrome Mobile (Android 10+)

**Test Checklist for Each Browser:**
- [ ] Page loads without errors
- [ ] Navigation works smoothly
- [ ] No layout shifts or broken styling
- [ ] Videos/images render correctly
- [ ] localStorage persistence works (notes, bookmarks, highlights)
- [ ] Print preview shows content correctly (use browser print dialog)

### E. Performance Testing

- [ ] First Contentful Paint <2s (using Lighthouse)
- [ ] Largest Contentful Paint <4s
- [ ] Cumulative Layout Shift <0.1
- [ ] JSON file load time <500ms
- [ ] No memory leaks (Chrome DevTools Memory profiler)
- [ ] Smooth scrolling (60 FPS target, no jank)

**Tools:**
- Google Lighthouse (run audit in DevTools)
- WebPageTest.org (third-party performance audit)
- Chrome DevTools Performance tab

### F. Security Testing

- [ ] No hardcoded API keys or secrets in code
- [ ] S3 bucket is private (URLs are signed or public with proper permissions)
- [ ] localStorage data (notes, bookmarks) doesn't contain sensitive info
- [ ] No XSS vulnerabilities (content is properly escaped in React)
- [ ] CORS headers allow requests from app domain

### G. Integration Testing

- [ ] Chapter 2 works correctly after Chapter 1 (no state conflicts)
- [ ] Switching between Chapter 1 and 2 doesn't lose user progress
- [ ] User progress is saved separately for each chapter
- [ ] Glossary from both chapters can be searched without conflicts
- [ ] Notes/bookmarks/highlights don't leak across chapters

---

## 8. DEPLOY CHECKLIST

### Pre-Deployment (24 hours before)

#### Code Review
- [ ] All edits to ChapterReader.jsx reviewed and approved
- [ ] All edits to ChapterNav.jsx reviewed and approved
- [ ] JSON schema validated (use online JSON schema validator)
- [ ] No console warnings or errors in dev build
- [ ] Git commits are atomic and well-documented

#### Final QA
- [ ] Full QA suite executed and passed (Section 7)
- [ ] Cross-browser testing completed (at least 3 major browsers)
- [ ] Mobile testing completed (iOS and Android)
- [ ] Performance audit passed (Lighthouse >90)
- [ ] Security checklist passed (Section 7.F)

#### Documentation
- [ ] Update INTEGRATION.md with Chapter 2 routing info
- [ ] Update CHAPTER_READER_IMPLEMENTATION.md to include Chapter 2 architecture
- [ ] Create `CHAPTER_2_READER_GUIDE.md` (user-facing, how to use Chapter 2)
- [ ] Add Chapter 2 to docs/README.md

#### Build Preparation
- [ ] `npm run build` completes without errors or warnings
- [ ] Build output is <5MB (if significantly larger, investigate bundle)
- [ ] All assets are included in build output
- [ ] Sourcemaps are generated (for debugging)

### Deployment (Production)

#### Vercel Deployment (Primary)
1. [ ] Push code to main branch (after PR approval)
2. [ ] Vercel auto-deploys (check dashboard for success)
3. [ ] Verify deployment URL loads without errors
4. [ ] Run smoke tests on deployed version:
   - [ ] Load Chapter 2 reader
   - [ ] Navigate through all sections
   - [ ] Add note, bookmark, highlight
   - [ ] Reload page and verify persistence
5. [ ] Check Vercel analytics for errors (Sentry integration if available)

#### S3 Media Assets (If New)
1. [ ] Upload all image assets to `unavida-videos` S3 bucket (correct folder)
2. [ ] Verify file permissions (public or pre-signed URLs)
3. [ ] Test image URLs are accessible (curl or browser)
4. [ ] Verify video URLs are accessible (curl --head to check headers)

#### DNS & Routing
1. [ ] Confirm `/reader/ch2_pharmacokinetics` route is live
2. [ ] Test from multiple locations (use VPN for geo-diversity)
3. [ ] Verify HTTPS certificate is valid (no warnings)

### Post-Deployment (1–4 hours after)

#### Monitoring
- [ ] Check Vercel dashboard for build status (green)
- [ ] Monitor error logs for 2 hours (Sentry, LogRocket, or Vercel logs)
- [ ] Check user feedback in Slack/Discord for issues
- [ ] Monitor performance metrics (Lighthouse, Core Web Vitals)

#### Production Smoke Tests
- [ ] Load Chapter 2 from production URL
- [ ] Verify section renders correctly
- [ ] Test Previous/Next navigation
- [ ] Verify videos/images load
- [ ] Add/save/delete notes
- [ ] Check localStorage for persistence
- [ ] Test on mobile device (physical device, not emulator)

#### Rollback Plan (If Issues Found)
1. Revert code to previous commit: `git revert <commit-hash>`
2. Run `git push` (triggers Vercel auto-deploy of previous version)
3. Notify team of rollback via Slack
4. Document issue in GitHub issue tracker
5. Schedule post-mortem within 24 hours

**Rollback SLA:** <10 minutes from detection to live revert

### Post-Deployment (Day 1–3)

#### User Communication
- [ ] Send message to students: "Chapter 2 is now available!"
- [ ] Include URL: `/reader/ch2_pharmacokinetics`
- [ ] Share study guide or key takeaways
- [ ] Encourage feedback (form or email)

#### User Feedback Collection
- [ ] Monitor Slack/Discord for user issues
- [ ] Create GitHub issue for each reported bug
- [ ] Prioritize by severity (critical > high > medium > low)
- [ ] Assign to team for fixes

#### Content Monitoring
- [ ] Verify no dead links in section content
- [ ] Confirm all glossary terms are clickable
- [ ] Check that clinical examples display correctly
- [ ] Test video playback on slow connections (use Lighthouse throttling)

---

## 9. INTEGRATION MILESTONES & TIMELINE

### Week 1: Structural Setup
**Monday–Wednesday**
- [ ] Create JSON data file with all section IDs and placeholder content
- [ ] Update ChapterReader.jsx (import, video/image maps)
- [ ] Update ChapterNav.jsx (TOC rendering)
- [ ] Create image directory structure and upload placeholder images
- [ ] Basic QA: Navigation, rendering, no console errors

**Thursday–Friday**
- [ ] Initial content writing (Phase 2 begins)
- [ ] Create placeholder images (gradient PNGs)
- [ ] Full functional testing (all 10 sections load)
- [ ] Fix any bugs found during testing

### Week 2: Full Content Integration
**Monday–Wednesday**
- [ ] Complete narrative content writing for all 10 sections
- [ ] Replace all placeholder text with real content
- [ ] Verify glossary terms (40+) are all defined
- [ ] Update learning objectives with final wording
- [ ] Content QA: spelling, grammar, tone, accuracy

**Thursday–Friday**
- [ ] Begin Phase 3 media asset collection
- [ ] Design/create diagrams (ADME, Protein Binding, CYP450, etc.)
- [ ] Start video recording (if in-house)
- [ ] Update image paths in sectionIllustrationMap
- [ ] Test image loading

### Week 3: Polish & Deployment
**Monday–Tuesday**
- [ ] Complete all media assets (images, videos)
- [ ] Replace all placeholder URLs with real S3 URLs
- [ ] Full QA suite execution (Section 7)
- [ ] Cross-browser testing and bug fixes
- [ ] Performance audit (Lighthouse >90)

**Wednesday**
- [ ] Final code review and approval
- [ ] Documentation updates
- [ ] Build production version (`npm run build`)
- [ ] Staging environment testing

**Thursday**
- [ ] Deploy to production (Vercel)
- [ ] Post-deployment smoke tests
- [ ] Monitor for 4+ hours

**Friday**
- [ ] User communication and feedback collection
- [ ] Day 1 monitoring and issue triage
- [ ] Begin work on any critical issues

---

## 10. RISK MITIGATION

### High-Risk Areas

#### Risk 1: JSON File Syntax Errors
**Impact:** Chapter 2 fails to load  
**Mitigation:**
- Use JSON formatter/validator before committing
- Automated JSON schema validation in CI/CD (if available)
- Test JSON parsing in dev console before deployment

#### Risk 2: Missing Media Assets
**Impact:** Broken image/video links in UI  
**Mitigation:**
- Use placeholder images initially
- Track all missing assets in GitHub issue
- S3 URLs validated with curl before deployment

#### Risk 3: Progress Tracking Bugs
**Impact:** User progress lost or shows incorrect %  
**Mitigation:**
- Test progress bar with all 10 sections during QA
- Verify localStorage persistence with DevTools
- Manual testing on multiple devices

#### Risk 4: Content Overflow or Layout Breaking
**Impact:** Text doesn't fit, sidebars collapse unexpectedly  
**Mitigation:**
- Test on multiple screen sizes (mobile, tablet, desktop)
- Use CSS media queries to ensure responsive behavior
- Lighthouse audit for layout shift

#### Risk 5: Cross-Chapter State Conflicts
**Impact:** Chapter 1 and 2 progress/notes interfere  
**Mitigation:**
- Namespace localStorage keys by chapter (`unavida:ch1:notes`, `unavida:ch2:notes`)
- Test switching between Chapter 1 and 2
- Verify independent progress tracking for each chapter

#### Risk 6: Slow Initial Load (Large JSON)
**Impact:** Users see spinner for >2 seconds  
**Mitigation:**
- Monitor file size (target <300KB)
- Use Lighthouse throttling to test on slow 3G
- Consider lazy-loading sections if needed (advanced)

---

## 11. TESTING ENVIRONMENT SETUP

### Local Development
```bash
# Start dev server
npm run dev
# Navigate to http://localhost:3000/reader/ch2_pharmacokinetics

# Check console for errors (F12 -> Console tab)
# Check Network tab for failed requests
# Check Application tab for localStorage persistence
```

### Staging Environment (Vercel Preview)
```bash
# Create feature branch
git checkout -b ch2-integration

# Push to GitHub
git push origin ch2-integration

# Vercel auto-creates preview URL
# Test at https://unavida-frontend-[branch].vercel.app/reader/ch2_pharmacokinetics
```

### Production
```bash
# Merge to main and push
git checkout main
git merge ch2-integration
git push origin main

# Vercel auto-deploys to production
# Verify at https://unavida-frontend.vercel.app/reader/ch2_pharmacokinetics
```

---

## 12. ROLLBACK PROCEDURES

### If Critical Bug Found (Pre-User Release)

**Step 1: Identify Issue**
- Verify in logs/console
- Reproduce on multiple browsers/devices
- Assess severity (critical vs. non-critical)

**Step 2: Rollback Code**
```bash
# Find previous stable commit
git log --oneline | head -5

# Revert to previous version
git revert <commit-hash>
git push origin main
```

**Step 3: Notify Team**
- Slack: "@channel Chapter 2 deployment rolled back due to [issue]"
- Create GitHub issue to track root cause
- Assign to engineer for post-mortem

**Step 4: Redeploy After Fix**
- Fix issue in feature branch
- Test thoroughly before merging
- Deploy with smaller rollout (50% traffic if Vercel supports A/B testing)

### If Data Corruption Found (Post-User Release)

**Step 1: Backup Current Data**
```bash
# Backup JSON file
cp src/data/CHAPTER_2_PHARMACOKINETICS_PRODUCTION.json src/data/CHAPTER_2_PHARMACOKINETICS_PRODUCTION.backup.corrupt.json
```

**Step 2: Restore from Backup**
```bash
# Use pre-deployment backup
cp src/data/CHAPTER_2_PHARMACOKINETICS_PRODUCTION.backup.json src/data/CHAPTER_2_PHARMACOKINETICS_PRODUCTION.json
```

**Step 3: Redeploy**
```bash
git add src/data/
git commit -m "Restore Chapter 2 from backup"
git push origin main
```

---

## 13. SUCCESS METRICS

### Quantitative Metrics (Post-Launch)

| Metric | Target | Measurement |
|--------|--------|------------|
| Chapter 2 Page Load Time | <2s (First Contentful Paint) | Lighthouse audit |
| Zero Console Errors | 0 errors on first load | Browser DevTools Console |
| Section Navigation Success Rate | 100% (all 10 sections load) | Manual testing + Sentry tracking |
| User Progress Persistence | 100% data saved correctly | localStorage inspection |
| Cross-Browser Compatibility | Pass on 5+ major browsers | Manual testing |
| Lighthouse Performance Score | >90 | Lighthouse audit |

### Qualitative Metrics (Post-Launch)

- [ ] User feedback is positive (>4/5 stars if rated)
- [ ] No critical issues reported in first week
- [ ] Student completion rate >60% (by end of course)
- [ ] Teacher feedback indicates content clarity
- [ ] No accessibility complaints (screen readers, etc.)

---

## 14. CONTACTS & ESCALATION

### Team Assignments

| Role | Name | Slack | Responsibility |
|------|------|-------|-----------------|
| Content Lead | [Name] | @content-lead | Writing, editing, glossary |
| Frontend Engineer | [Name] | @frontend | ChapterReader updates, components |
| QA Lead | [Name] | @qa-lead | Testing, QA suite execution |
| DevOps/Deployment | [Name] | @devops | Vercel, S3, monitoring |
| Product Manager | [Name] | @pm | Timeline, priorities, user feedback |

### Escalation Path

**Issue Level 1 (Non-critical, can wait):**
- Post in #ch2-integration Slack channel
- Assign to appropriate team member

**Issue Level 2 (Important, should fix soon):**
- Tag @frontend or @content-lead
- Create GitHub issue (High priority)
- Update in sprint board

**Issue Level 3 (Critical, blocks deployment):**
- Mention @pm and @devops in Slack
- Call/video sync immediately
- Consider rollback

---

## 15. APPENDIX: REFERENCE LINKS

### Component Files
- ChapterReader.jsx: `/src/components/ChapterReader.jsx`
- ChapterNav.jsx: `/src/components/ChapterNav.jsx`
- App.jsx: `/src/App.jsx`

### Data Files
- Chapter 1 Reference: `/src/data/CHAPTER_1_UNAVIDA_PRODUCTION.json`
- Chapter 2 (New): `/src/data/CHAPTER_2_PHARMACOKINETICS_PRODUCTION.json`

### Documentation
- CHAPTER_READER_IMPLEMENTATION.md (existing Chapter 1 guide)
- INTEGRATION.md (app architecture overview)
- BUILD.md (build/deployment guide)

### External Resources
- React Docs: https://react.dev
- Vercel Deployment: https://vercel.com/docs
- AWS S3: https://docs.aws.amazon.com/s3/

---

## 16. SIGN-OFF

**Prepared by:** [Your Name]  
**Date:** March 11, 2026  
**Status:** Ready for Implementation

**Approvals:**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Content Lead | _____ | _____ | _____ |
| Frontend Lead | _____ | _____ | _____ |
| QA Lead | _____ | _____ | _____ |
| Product Manager | _____ | _____ | _____ |

---

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Mar 11, 2026 | [Author] | Initial integration plan created |

---

**End of Integration Plan**
