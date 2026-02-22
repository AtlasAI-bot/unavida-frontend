# Quick Start Guide - Chapter Reader

## 🚀 Getting Started in 5 Minutes

### 1. Check Build Status
```bash
cd /Users/atlas/.openclaw/workspace/unavida-frontend
npm run build
# Should output: "Compiled successfully"
```

### 2. Start Development Server
```bash
npm run dev
# Opens at http://localhost:3000
```

### 3. Navigate to Chapter Reader
```
URL: http://localhost:3000/reader/ch1_intro_to_pharmacology
```

### 4. Test Features
- [ ] Click sections in left sidebar
- [ ] Read content in main area
- [ ] Add a note in right sidebar
- [ ] Bookmark a section
- [ ] Check progress bar updates
- [ ] Test mobile (resize window to 375px)

## 📂 Project Structure
```
unavida-frontend/
├── src/
│   ├── components/
│   │   ├── ChapterReader.jsx      ← Main component
│   │   ├── ChapterNav.jsx         ← Left sidebar
│   │   ├── ChapterTools.jsx       ← Right sidebar
│   │   ├── VideoPlayer.jsx        ← Ready for video
│   │   └── MedicalDiagram.jsx     ← Ready for images
│   ├── hooks/
│   │   └── useChapterProgress.js  ← Progress tracking
│   ├── data/
│   │   └── CHAPTER_1_UNAVIDA_PRODUCTION.json
│   └── context/
│       └── StudentProgressContext.jsx (Enhanced)
└── build/                          ← Generated after npm run build
```

## ✨ Key Features
- ✅ 33,147 words of Chapter 1 content
- ✅ 12 sections with smooth navigation
- ✅ Notes, bookmarks, and highlights
- ✅ Progress tracking (% complete, time spent)
- ✅ Mobile responsive
- ✅ localStorage persistence

## 🔧 Common Tasks

### Deploy to Vercel
```bash
npm run build
vercel --prod
# Copy the URL from output
```

### Add Notes (as Student)
1. Go to `/reader/ch1_intro_to_pharmacology`
2. Right sidebar → Notes tab
3. Type note → Click "Save Note"
4. Note persists automatically

### Reset Progress
```js
// In browser console:
localStorage.removeItem('unavida_progress');
location.reload();
```

### View Progress Data
```js
// In browser console:
console.log(JSON.parse(localStorage.getItem('unavida_progress')));
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page | Check console (F12) for errors |
| Notes not saving | Clear localStorage, then reload |
| Sidebar not opening on mobile | Check browser zoom is 100% |
| Build fails | Delete node_modules, run npm install |
| JSON not loading | Verify file in src/data/ |

## 📊 Content Overview
- **Total Words**: 33,147
- **Sections**: 12
- **Estimated Reading**: 180 minutes
- **Study Time**: 240 minutes
- **Learning Outcomes**: 10
- **Glossary Terms**: 50+

## 🎯 Next: Deployment

See **DEPLOYMENT_GUIDE.md** for step-by-step production deployment.

## 📚 Full Documentation
- **CHAPTER_READER_IMPLEMENTATION.md** - Technical architecture
- **DEPLOYMENT_GUIDE.md** - Deployment & monitoring
- **CHAPTER_READER_COMPLETION_SUMMARY.md** - Complete project overview

---

**Ready to deploy?** → `vercel --prod`
**Need help?** → See DEPLOYMENT_GUIDE.md
