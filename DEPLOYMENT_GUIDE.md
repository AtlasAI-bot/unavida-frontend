# Deployment & Integration Guide

## Pre-Deployment Checklist

### ✅ Files Created/Modified
- [x] `src/components/ChapterReader.jsx` - Main reader component (16 KB)
- [x] `src/components/ChapterNav.jsx` - Left sidebar navigation (7 KB)
- [x] `src/components/ChapterTools.jsx` - Right sidebar study tools (14 KB)
- [x] `src/components/VideoPlayer.jsx` - Video player component (7.6 KB)
- [x] `src/components/MedicalDiagram.jsx` - Diagram viewer with zoom (3.8 KB)
- [x] `src/hooks/useChapterProgress.js` - Progress tracking hook (6.5 KB)
- [x] `src/data/CHAPTER_1_UNAVIDA_PRODUCTION.json` - Chapter content (111 KB)
- [x] `src/context/StudentProgressContext.jsx` - Enhanced with new methods
- [x] Build successful (npm run build passes)

### ✅ Build Status
```
✓ Compiled successfully
✓ File sizes: 101.58 KB + 21.24 KB gzip
✓ No errors or warnings
✓ Ready for production deployment
```

## Local Testing

### 1. Development Server

```bash
cd /Users/atlas/.openclaw/workspace/unavida-frontend

# Start dev server
npm run dev

# Expected output:
# > react-scripts start
# The app is running at http://localhost:3000/
```

### 2. Navigate to Chapter Reader

```
URL: http://localhost:3000/reader/ch1_intro_to_pharmacology
```

### 3. Test Features

#### Navigation (Left Sidebar)
- [ ] Click each section - content updates
- [ ] Mobile toggle works
- [ ] Sections show word count and duration
- [ ] Course info displays correctly
- [ ] Learning outcomes preview shows

#### Main Content
- [ ] All 33,147 words load and display
- [ ] Headers are properly formatted
- [ ] Content blocks render with correct colors
- [ ] Lists and tables display correctly
- [ ] Progress bar updates as you scroll
- [ ] Next/Previous buttons work

#### Study Tools (Right Sidebar)
- [ ] **Notes Tab**:
  - [ ] Can type and save notes
  - [ ] Notes persist after refresh
  - [ ] Can see timestamp
  - [ ] Can delete notes
  
- [ ] **Bookmarks Tab**:
  - [ ] Can bookmark section
  - [ ] Bookmark appears in list
  - [ ] Can remove bookmark
  
- [ ] **Highlights Tab**:
  - [ ] Can select color
  - [ ] Can add highlight
  - [ ] Color displays correctly
  - [ ] Can delete highlight
  
- [ ] **Learning Outcomes Tab**:
  - [ ] Shows 10 outcomes
  - [ ] Bloom level displays
  - [ ] Key vocabulary shows

#### Progress Tracking
- [ ] Section counter shows correct numbers
- [ ] Progress bar fills as you advance
- [ ] Time spent increments
- [ ] Progress saved to localStorage

#### Mobile Responsiveness
- [ ] Resize to mobile width (375px)
- [ ] Sidebars collapse
- [ ] Content is readable
- [ ] Buttons are touch-friendly
- [ ] Toggle buttons appear

## Vercel Deployment

### Step 1: Connect Repository

```bash
cd /Users/atlas/.openclaw/workspace/unavida-frontend

# If not already connected:
git init
git add .
git commit -m "Add complete chapter reader implementation"
git remote add origin https://github.com/your-org/unavida-frontend.git
git push -u origin main
```

### Step 2: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 3: Build for Production

```bash
npm run build

# Verify build output:
# Build folder size: ~500KB
# Contains: index.html, static/js, static/css, static/media
```

### Step 4: Deploy to Vercel

```bash
# First deployment (interactive):
vercel

# Follow prompts:
# ✔ Set up and deploy "unavida-frontend"? yes
# ✔ Which scope? (your Vercel account)
# ✔ Link to existing project? (yes if exists, no if new)
# ✔ Build command: npm run build
# ✔ Output directory: build

# Subsequent deployments:
vercel --prod

# Expected output:
# ✓ Production: https://unavida-frontend.vercel.app
```

### Step 5: Verify Deployment

```bash
# Test production URL:
curl -I https://unavida-frontend.vercel.app/reader/ch1_intro_to_pharmacology

# Check in browser:
https://unavida-frontend.vercel.app/reader/ch1_intro_to_pharmacology
```

## Environment Variables

### Production (.env.production)
```
REACT_APP_API_URL=https://api.unavida.io
REACT_APP_CHAPTER_API_ENDPOINT=/api/chapters
```

### Development (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CHAPTER_API_ENDPOINT=/api/chapters
```

## Performance Optimizations

### Already Implemented
- ✅ Code splitting (React.lazy if needed)
- ✅ Gzip compression enabled
- ✅ CSS minification
- ✅ JS minification
- ✅ Tree shaking

### Can Add
- [ ] Image optimization (webp format)
- [ ] Video lazy loading
- [ ] Virtual scrolling for very long content
- [ ] Service Worker for offline mode
- [ ] CDN for media assets

## Monitoring & Analytics

### Add Google Analytics

```bash
npm install @react-google-analytics
```

Add to `index.jsx`:
```jsx
import ReactGA from 'react-ga4';

ReactGA.initialize('G-YOUR_TRACKING_ID');
ReactGA.pageview(window.location.pathname);
```

### Track Custom Events

```jsx
// In ChapterReader.jsx
const trackSectionChange = (sectionId) => {
  ReactGA.event({
    category: 'Reading',
    action: 'Section Changed',
    label: sectionId
  });
};
```

## Backend API Integration

### Current State
- ✅ Frontend complete and standalone
- ✅ localStorage persistence working
- ⚠️ Backend API integration ready but not required

### To Connect Backend

1. **Update ChapterReader.jsx**:

```jsx
useEffect(() => {
  const fetchChapter = async () => {
    try {
      const response = await fetch(
        `/api/chapters/${chapterId}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      const data = await response.json();
      setChapterData(data.chapter);
    } catch (error) {
      console.error('Failed to fetch chapter:', error);
      // Fallback to local JSON
      setChapterData(chapterData);
    }
  };

  fetchChapter();
}, [chapterId]);
```

2. **Sync Progress to Backend**:

```jsx
useEffect(() => {
  const syncProgress = async () => {
    try {
      await fetch(
        `/api/chapters/${chapterId}/progress`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            currentSection,
            timeSpent,
            notes: progress.notes,
            bookmarks: progress.bookmarks
          })
        }
      );
    } catch (error) {
      console.error('Failed to sync progress:', error);
    }
  };

  // Sync every 30 seconds
  const interval = setInterval(syncProgress, 30000);
  return () => clearInterval(interval);
}, [chapterId, currentSection, timeSpent]);
```

## Troubleshooting

### Build Issues

**Error: "Cannot find module CHAPTER_1_UNAVIDA_PRODUCTION.json"**
```bash
# Solution: Ensure JSON is in src/data/
cp /Users/atlas/.openclaw/workspace/CHAPTER_1_UNAVIDA_PRODUCTION.json \
   src/data/
npm run build
```

**Error: "Failed to compile - CSS syntax error"**
```bash
# Solution: Check Tailwind config
npm install -S tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run build
```

### Runtime Issues

**Notes not saving:**
- Check browser console for localStorage errors
- Verify `useStudentProgress` context is provided
- Check localStorage quota isn't exceeded

**Bookmarks appear but don't persist:**
- Verify `localStorage` is enabled
- Check storage quota
- Try clearing browser cache and localStorage

**Sidebar not opening on mobile:**
- Check z-index values
- Verify media queries are correct
- Test in actual mobile browser (not just resized desktop)

## Rollback Plan

### If Issues Found in Production

```bash
# Revert to previous version
git revert HEAD
npm run build
vercel --prod

# Or rollback on Vercel dashboard:
# 1. Go to Vercel.com → Project
# 2. Click "Deployments" tab
# 3. Find previous working deployment
# 4. Click "..." → "Promote to Production"
```

## Success Indicators

After deployment, verify:

- ✅ Page loads in < 3 seconds
- ✅ All 12 sections accessible
- ✅ Notes save and persist
- ✅ Progress bar updates smoothly
- ✅ Mobile view is responsive
- ✅ No console errors or warnings
- ✅ Lighthouse score > 80 (Performance)
- ✅ All interactive elements work

## Post-Deployment

### 1. Notify Users

```
"Chapter Reader now live at: 
https://unavida-frontend.vercel.app/reader/ch1_intro_to_pharmacology"
```

### 2. Monitor Performance

- Check Vercel Analytics dashboard
- Review error logs daily for 1 week
- Monitor user feedback

### 3. Plan Enhancements

Based on usage:
- [ ] Add video integration
- [ ] Add medical diagrams
- [ ] Expand glossary
- [ ] Add quiz integration
- [ ] Dark mode support

## Support Resources

- **Documentation**: `CHAPTER_READER_IMPLEMENTATION.md`
- **API Reference**: `/api/chapters` (backend docs)
- **Vercel Docs**: https://vercel.com/docs
- **React Docs**: https://react.dev

---

**Version**: 1.0.0
**Last Updated**: 2026-02-19
**Status**: ✅ Ready for Deployment
