# Integration Guide - UnaVida Frontend

This document provides detailed instructions for integrating the UnaVida frontend with your backend API.

## 📡 API Endpoints Required

### 1. Chapters Endpoint
**GET** `/api/chapters/{chapterId}`

Returns chapter data with full structure:

```json
{
  "chapter": {
    "metadata": {
      "id": "ch1_intro",
      "title": "Chapter 1: Introduction to Pharmacology",
      "subtitle": "Foundations...",
      "courseCode": "NUR1100",
      "courseName": "Pharmacology I",
      "estimatedReadingTime": 180,
      "estimatedStudyTime": 240,
      "wordCount": 33147
    },
    "learningOutcomes": [ /* array */ ],
    "sections": [
      {
        "id": "sec1",
        "title": "Section Title",
        "subsections": [
          {
            "id": "subsec1",
            "title": "Subsection",
            "content": "Full text content..."
          }
        ]
      }
    ],
    "flashcards": [
      {
        "id": "card-1",
        "question": "Term",
        "answer": "Definition",
        "difficulty": "medium"
      }
    ],
    "quizzes": [
      {
        "questions": [
          {
            "questionNumber": 1,
            "type": "multiple_choice",
            "question": "Question text",
            "options": {
              "A": "Option A",
              "B": "Option B",
              "C": "Option C",
              "D": "Option D"
            },
            "correctAnswer": "B",
            "rationale": "Explanation..."
          }
        ]
      }
    ]
  }
}
```

### 2. Textbooks Endpoint (Optional)
**GET** `/api/textbooks`

Returns list of available textbooks:

```json
{
  "textbooks": [
    {
      "id": "NUR1100",
      "title": "Pharmacology I",
      "description": "...",
      "icon": "💊",
      "chapters": [
        {
          "id": "ch1_intro",
          "title": "Chapter 1: Introduction",
          "description": "...",
          "duration": "180 min"
        }
      ]
    }
  ]
}
```

### 3. Student Progress Endpoints
**GET** `/api/student/{studentId}/progress`

```json
{
  "progress": {
    "bookmarks": [ /* array */ ],
    "notes": { /* object */ },
    "readingPosition": { /* object */ },
    "completedSections": [ /* array */ ],
    "lastAccessed": { /* object */ }
  }
}
```

**POST** `/api/student/{studentId}/progress`

Updates student progress:

```json
{
  "bookmarks": [ /* array */ ],
  "notes": { /* object */ },
  "readingPosition": { /* object */ },
  "completedSections": [ /* array */ ],
  "lastAccessed": { /* object */ }
}
```

## 🔧 Implementation Steps

### Step 1: Update API Client

Create `src/services/api.js`:

```javascript
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const apiClient = {
  // Chapters
  async getChapter(chapterId) {
    const res = await fetch(`${API_BASE}/chapters/${chapterId}`);
    if (!res.ok) throw new Error('Failed to fetch chapter');
    return res.json();
  },

  async getTextbooks() {
    const res = await fetch(`${API_BASE}/textbooks`);
    if (!res.ok) throw new Error('Failed to fetch textbooks');
    return res.json();
  },

  // Progress
  async getProgress(studentId) {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/student/${studentId}/progress`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch progress');
    return res.json();
  },

  async updateProgress(studentId, progressData) {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE}/student/${studentId}/progress`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(progressData)
    });
    if (!res.ok) throw new Error('Failed to update progress');
    return res.json();
  }
};
```

### Step 2: Update useChapterData Hook

Modify `src/hooks/useChapterData.js`:

```javascript
import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';

export const useChapterData = (chapterId) => {
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChapterData = async () => {
      try {
        const data = await apiClient.getChapter(chapterId);
        setChapterData(data);
      } catch (err) {
        setError(err.message);
        // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    loadChapterData();
  }, [chapterId]);

  return { chapterData, loading, error };
};
```

### Step 3: Update StudentProgressContext

Modify `src/context/StudentProgressContext.jsx` to sync with backend:

```javascript
export const StudentProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(null);
  const [studentId, setStudentId] = useState(null);

  // Load initial progress
  useEffect(() => {
    const loadProgress = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      
      const student = JSON.parse(localStorage.getItem('student'));
      setStudentId(student?.id);

      try {
        const { progress } = await apiClient.getProgress(student.id);
        setProgress(progress);
      } catch (err) {
        console.error('Failed to load progress:', err);
      }
    };

    loadProgress();
  }, []);

  // Sync progress to backend
  useEffect(() => {
    if (!progress || !studentId) return;

    const syncProgress = async () => {
      try {
        await apiClient.updateProgress(studentId, progress);
      } catch (err) {
        console.error('Failed to sync progress:', err);
      }
    };

    // Debounce sync
    const timeout = setTimeout(syncProgress, 2000);
    return () => clearTimeout(timeout);
  }, [progress, studentId]);

  // ... rest of implementation
};
```

### Step 4: Add Authentication

Create `src/services/auth.js`:

```javascript
export const authService = {
  async login(email, password) {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('student', JSON.stringify(data.student));
    return data;
  },

  async logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('student');
  },

  getToken() {
    return localStorage.getItem('auth_token');
  },

  getStudent() {
    return JSON.parse(localStorage.getItem('student'));
  }
};
```

### Step 5: Create ProtectedRoute Component

Create `src/components/ProtectedRoute.jsx`:

```javascript
import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth';

export const ProtectedRoute = ({ children }) => {
  const token = authService.getToken();
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};
```

### Step 6: Update App.jsx

```javascript
import { ProtectedRoute } from './components/ProtectedRoute';

export function App() {
  return (
    <StudentProgressProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/reader/:chapterId"
            element={
              <ProtectedRoute>
                <ChapterReader />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </StudentProgressProvider>
  );
}
```

## 🔒 Authentication Integration

### JWT Token Handling

```javascript
// In API calls, include Authorization header
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
};
```

### Token Refresh

```javascript
// Auto-refresh token when expired
export const createAuthInterceptor = (fetch) => {
  return async (url, options) => {
    let response = await fetch(url, options);
    
    if (response.status === 401) {
      // Token expired, refresh it
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (refreshRes.ok) {
        const { token } = await refreshRes.json();
        localStorage.setItem('auth_token', token);
        
        // Retry original request with new token
        options.headers['Authorization'] = `Bearer ${token}`;
        response = await fetch(url, options);
      }
    }
    
    return response;
  };
};
```

## 📊 Analytics Integration (Optional)

```javascript
// In App.jsx
import { useEffect } from 'react';

export function App() {
  useEffect(() => {
    // Track page views
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID');
    }
  }, []);

  // ... rest
}
```

## 🧪 Testing API Integration

### Mock API Server

For development, use JSON Server:

```bash
npm install -g json-server

# Create db.json with mock data
# Run: json-server --watch db.json --port 3001
```

Update `.env`:
```
REACT_APP_API_URL=http://localhost:3001
```

## 🚀 Deployment Checklist

- [ ] Update `.env` with production API URL
- [ ] Add CORS headers to backend
- [ ] Configure SSL/TLS certificates
- [ ] Set up authentication properly
- [ ] Test all API endpoints
- [ ] Configure database backups
- [ ] Set up error logging
- [ ] Configure rate limiting
- [ ] Add request validation
- [ ] Test on staging environment

## 🔍 Debugging Tips

```javascript
// Enable verbose logging
localStorage.setItem('DEBUG_UNAVIDA', 'true');

// Check localStorage
console.log(JSON.parse(localStorage.getItem('unavida_progress')));

// Monitor network requests
// Use Chrome DevTools Network tab or:
window.fetch = ((originalFetch) => {
  return (...args) => {
    console.log('Request:', args);
    return originalFetch(...args).then(res => {
      console.log('Response:', res);
      return res;
    });
  };
})(window.fetch);
```

## 📞 Support

For integration issues:
1. Check API endpoint responses match expected format
2. Verify authentication tokens are present
3. Check CORS settings on backend
4. Review browser console for errors
5. Enable debug logging as shown above

---

**Integration Complete** ✅ when all endpoints are connected and tested
