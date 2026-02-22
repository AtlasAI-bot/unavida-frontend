# Build & Deployment Guide - UnaVida Frontend

Complete guide for building and deploying the UnaVida frontend application.

## 🔨 Development Build

### Setup

```bash
# Install dependencies
npm install

# Install specific versions if needed
npm install react@18.2.0 react-dom@18.2.0
npm install react-router-dom@6.20.0
npm install -D tailwindcss@3.3.6 postcss@8.4.32 autoprefixer@10.4.16
```

### Run Development Server

```bash
npm run dev
```

Opens at: `http://localhost:3000`

### Hot Reload

Changes automatically reload in browser during development.

## 🏗 Production Build

### Build Command

```bash
npm run build
```

### Build Output

```
build/
├── index.html              # Main HTML file
├── static/
│   ├── js/                 # Optimized JavaScript bundles
│   │   ├── main.[hash].js
│   │   ├── [other chunks]
│   │   └── [runtime].js
│   └── css/                # Optimized CSS
│       └── main.[hash].css
├── favicon.ico
└── manifest.json           # PWA manifest (optional)
```

### Build Optimizations

The build process includes:
- ✅ Minification of JS and CSS
- ✅ Code splitting by route
- ✅ Asset optimization
- ✅ Tree shaking (unused code removal)
- ✅ Source maps for debugging
- ✅ Production mode React (no dev warnings)

### Build Size

Expected bundle sizes:
- Main bundle: ~150-200 KB (gzipped: ~40-50 KB)
- CSS: ~30-50 KB (gzipped: ~8-12 KB)

## 📦 Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod
```

### Option 3: Docker

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
```

Build and run:

```bash
# Build Docker image
docker build -t unavida-frontend:1.0.0 .

# Run container
docker run -p 3000:3000 unavida-frontend:1.0.0

# Push to registry
docker tag unavida-frontend:1.0.0 myregistry/unavida-frontend:1.0.0
docker push myregistry/unavida-frontend:1.0.0
```

### Option 4: Traditional Server (Nginx)

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Copy build files to server**
   ```bash
   scp -r build/* user@server:/var/www/unavida-frontend/
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name unavida.example.com;

       root /var/www/unavida-frontend;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # Enable gzip compression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript;
   }
   ```

4. **Enable HTTPS with Let's Encrypt**
   ```bash
   sudo certbot certonly --webroot -w /var/www/unavida-frontend -d unavida.example.com
   ```

### Option 5: AWS S3 + CloudFront

```bash
# Build
npm run build

# Create S3 bucket (one-time)
aws s3 mb s3://unavida-frontend

# Deploy to S3
aws s3 sync build/ s3://unavida-frontend/ --delete

# Invalidate CloudFront cache (if using CloudFront)
aws cloudfront create-invalidation \
  --distribution-id E1234ABCD \
  --paths "/*"
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy UnaVida Frontend

on:
  push:
    branches:
      - main
      - develop

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests (optional)
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.REACT_APP_API_URL }}
      
      - name: Deploy to Vercel
        uses: vercel/vercel-action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          github-comment: false
```

### GitLab CI/CD Example

Create `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  image: node:18
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - build/
  only:
    - main
    - develop

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add openssh-client
    - mkdir -p ~/.ssh
    - echo "$DEPLOY_KEY" | tr -d '\r' > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa
    - ssh-keyscan -H "$DEPLOY_HOST" >> ~/.ssh/known_hosts
    - scp -r build/* $DEPLOY_USER@$DEPLOY_HOST:/var/www/unavida-frontend/
  only:
    - main
```

## ✅ Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] API endpoints verified
- [ ] Error handling tested
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] CORS settings correct
- [ ] SSL certificates valid
- [ ] Database backups scheduled
- [ ] Monitoring/logging set up
- [ ] Backup plan in place
- [ ] Documentation updated

## 🔐 Production Configuration

### Environment Variables

Create `.env.production`:

```
REACT_APP_NAME=UnaVida
REACT_APP_VERSION=1.0.0
REACT_APP_API_URL=https://api.unavida.example.com
REACT_APP_ENV=production
REACT_APP_ANALYTICS_ID=UA-XXXXXXXXX-X
```

### Security Headers

Configure on your server:

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
Referrer-Policy: strict-origin-when-cross-origin
```

### CORS Configuration

Backend should allow:

```javascript
res.header('Access-Control-Allow-Origin', 'https://unavida.example.com');
res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
res.header('Access-Control-Allow-Credentials', 'true');
```

## 📊 Monitoring & Analytics

### Application Performance Monitoring (APM)

```javascript
// Add to src/index.js
if (process.env.NODE_ENV === 'production') {
  // Example: Sentry for error tracking
  import Sentry from "@sentry/react";
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.REACT_APP_ENV
  });
}
```

### User Analytics

```javascript
// Add Google Analytics
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## 🔄 Rollback Procedure

If deployment has issues:

```bash
# Identify last stable build
git log --oneline -n 10

# Rollback to previous commit
git revert <commit-hash>
git push

# Or rebuild from specific tag
git checkout v1.0.0
npm run build
# Deploy again
```

## 📈 Performance Optimization

### Lighthouse Audit

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://unavida.example.com --view
```

### Key Metrics

- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **CLS** (Cumulative Layout Shift): < 0.1
- **FID** (First Input Delay): < 100ms

### Optimization Tips

1. **Code Splitting**: Already configured
2. **Lazy Loading**: Add React.lazy() for routes
3. **Image Optimization**: Compress images, use WebP
4. **Caching**: Set proper cache headers
5. **CDN**: Use CloudFront or Cloudflare
6. **Compression**: Enable gzip on server

## 🧪 Testing Before Deploy

```bash
# Build locally
npm run build

# Test with production server
npm start
# or
npx serve -s build -l 3000

# Visit http://localhost:3000
# Test all features
# Check browser console for errors
# Test on mobile devices
```

## 📝 Deployment Log Template

Create `DEPLOYMENT_LOG.md`:

```markdown
# Deployment Log

## Deployment #1 - 2026-02-18
- **Version**: 1.0.0
- **Environment**: Production
- **Deployed by**: Atlas AI
- **Duration**: 5 minutes
- **Changes**: 
  - Initial release
  - Netflix-style UI
  - Flashcards, Quiz, Glossary
- **Status**: ✅ Success
- **Issues**: None

## Deployment #2 - [Date]
...
```

## 📞 Emergency Contacts

- DevOps: [contact]
- Backend Team: [contact]
- Database Admin: [contact]

---

**Deployment Ready** ✅ - Follow this guide for successful deployments
