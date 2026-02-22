# UnaVida Frontend - Quick Start Guide

Get up and running with the UnaVida pharmacology learning platform in minutes.

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
cd unavida-frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
```
http://localhost:3000
```

## 🎯 First Steps

### Explore Features
- **Home Page**: Browse textbooks Netflix-style
- **Chapter Reader**: Click any chapter to read
- **Flashcards**: Study pharmacology terms
- **Quiz**: Test your knowledge
- **Glossary**: Look up terms on the right sidebar

### Test Data
The app comes with mock data:
- **2 Textbooks**: NUR1100, NUR2110
- **4 Chapters**: Intro, Drugs, Cardiovascular, Neuro
- **50+ Flashcards**: Common pharmacology terms
- **8 Quiz Questions**: Multiple choice, calculation
- **24 Glossary Terms**: Searchable definitions

## 📱 Testing

### Desktop
```bash
# Development
npm run dev
# Open http://localhost:3000
```

### Mobile
```bash
# Get your machine IP
ipconfig getifaddr en0  # Mac
# or
hostname -I  # Linux

# Open http://<YOUR_IP>:3000 on mobile
```

### Production Build
```bash
# Build optimized version
npm run build

# Test production build locally
npm start
# or
npx serve -s build -l 3000
```

## 🔧 Common Tasks

### Add New Flashcards
Edit `src/components/Flashcards.jsx`:

```javascript
const mockFlashcards = [
  {
    id: 11,
    question: 'New Term',
    answer: 'New Definition'
  },
  // ... rest
];
```

### Add Quiz Questions
Edit `src/components/Quiz.jsx`:

```javascript
const mockQuestions = [
  {
    questionNumber: 9,
    type: 'multiple_choice',
    question: 'Your question?',
    options: {
      A: 'Option A',
      B: 'Option B',
      C: 'Option C',
      D: 'Option D'
    },
    correctAnswer: 'B',
    rationale: 'Explanation...'
  },
  // ... rest
];
```

### Add Glossary Terms
Edit `src/components/Glossary.jsx`:

```javascript
const glossaryItems = [
  {
    id: 25,
    term: 'New Term',
    definition: 'Definition here',
    category: 'Category'
  },
  // ... rest
];
```

### Customize Colors
Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#YOUR_COLOR',
      // ... more colors
    }
  }
}
```

## 🌐 Deployment Checklist

- [ ] `npm run build` completes without errors
- [ ] Test build locally: `npm start`
- [ ] All features work on mobile and desktop
- [ ] Update `.env.production` with real API URLs
- [ ] Configure backend endpoints
- [ ] Test authentication flow
- [ ] Check browser console for errors
- [ ] Verify responsive design
- [ ] Test on multiple browsers
- [ ] Deploy to hosting platform

## 📊 Project Structure

```
src/
├── components/          # React components
│   ├── Home.jsx        # Netflix-style browse
│   ├── ChapterReader   # Main reader interface
│   ├── Flashcards      # Flashcard viewer
│   ├── Quiz            # Quiz module
│   └── Glossary        # Glossary sidebar
├── context/            # State management
│   └── StudentProgressContext.jsx
├── hooks/              # Custom hooks
│   └── useChapterData.js
├── App.jsx             # Main app component
└── index.js            # Entry point
```

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tailwind Styles Not Loading
```bash
# Rebuild Tailwind CSS
npx tailwindcss -i ./src/index.css -o ./src/output.css
```

### Build Fails
```bash
# Check for syntax errors
npm run dev  # Better error messages

# Clear build cache
rm -rf build node_modules/.cache

# Rebuild
npm run build
```

## 💡 Tips & Tricks

### Faster Development
- Use Chrome DevTools for debugging
- Install React DevTools browser extension
- Use `console.log()` for quick debugging
- Check localStorage: `localStorage.getItem('unavida_progress')`

### Keyboard Shortcuts
- `Ctrl+Shift+J` - Open DevTools
- `Ctrl+K` - Quick search (extensible)
- `Escape` - Close dialogs/sidebars

### Browser DevTools
1. **Elements Tab**: Inspect HTML structure
2. **Console Tab**: Check for errors
3. **Network Tab**: Monitor API calls
4. **Storage Tab**: View localStorage
5. **React DevTools**: Inspect component tree

## 🚀 Next Steps

1. **Customize**: Modify colors, content, components
2. **Connect Backend**: Update API endpoints in `.env`
3. **Add Features**: Video player, collaboration, etc.
4. **Deploy**: Follow BUILD.md for deployment options
5. **Monitor**: Set up analytics and error tracking

## 📞 Support Resources

- **README.md**: Full documentation
- **INTEGRATION.md**: Backend integration guide
- **BUILD.md**: Deployment guide
- **Tailwind Docs**: https://tailwindcss.com
- **React Docs**: https://react.dev

## 🎓 Learning Resources

### React
- [React Official Tutorial](https://react.dev/learn)
- [React Router Documentation](https://reactrouter.com)

### Tailwind CSS
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com)

### JavaScript
- [MDN Web Docs](https://developer.mozilla.org)
- [ES6+ Features](https://es6-features.org)

## ✅ Success Indicators

Your setup is complete when:
- ✅ `npm run dev` starts without errors
- ✅ Home page loads with featured content
- ✅ Can click chapter to open reader
- ✅ Flashcards flip on click
- ✅ Quiz shows feedback
- ✅ Glossary is searchable
- ✅ Bookmarks/notes save to localStorage
- ✅ Progress bar updates
- ✅ Mobile menu works on smaller screens
- ✅ Dark theme is consistent

---

**Ready to Build!** 🚀 Follow this guide, then read README.md for deeper documentation.

Need more help? Check the troubleshooting section or read the full guides.
