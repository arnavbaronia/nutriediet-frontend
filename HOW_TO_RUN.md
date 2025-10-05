# 🚀 How to Run the Frontend Application

## Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Backend API running (on localhost:8080 or deployed)

---

## Quick Start

### 1. **Install Dependencies**
```bash
cd /Users/ishitagupta/Documents/Personal/frontend
npm install
```

This will install all required packages from `package.json`.

---

### 2. **Configure Environment Variables**

The frontend uses environment variables to configure the API base URL.

**For Development (local backend):**
```bash
# .env file already exists with:
REACT_APP_API_BASE_URL=http://localhost:8080
```

**For Production (deployed backend):**
Edit `.env` and change to:
```bash
REACT_APP_API_BASE_URL=https://nutriediet-go.onrender.com
```

---

### 3. **Run Development Server**

```bash
npm start
```

This will:
- Start the React development server
- Open the app in your browser at `http://localhost:3000`
- Enable hot-reload (changes reflect automatically)
- Show compilation errors in the console

**Expected output:**
```
Compiled successfully!

You can now view the app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

---

### 4. **Build for Production** (Optional)

```bash
npm run build
```

This will:
- Create an optimized production build in the `build/` folder
- Minify and bundle all JavaScript/CSS
- Optimize images and assets
- Generate static files ready for deployment

**Output:**
- `build/` directory with production-ready files
- Can be deployed to any static hosting (Netlify, Vercel, etc.)

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server (port 3000) |
| `npm run build` | Build production bundle |
| `npm test` | Run tests (if configured) |
| `npm run eject` | ⚠️ Eject from Create React App (irreversible) |

---

## Environment-Specific Setup

### Development (Local Backend)
```bash
# .env
REACT_APP_API_BASE_URL=http://localhost:8080

# Then run
npm start
```

### Production (Deployed Backend)
```bash
# .env
REACT_APP_API_BASE_URL=https://nutriediet-go.onrender.com

# Then build
npm run build
```

### Staging (if needed)
```bash
# .env
REACT_APP_API_BASE_URL=https://staging-nutriediet-go.onrender.com

# Then build
npm run build
```

---

## Accessing the Application

Once running, you can access:

**Home Page**: `http://localhost:3000`  
**Admin Login**: `http://localhost:3000/admin-login`  
**Client Login**: `http://localhost:3000/login`  
**Signup**: `http://localhost:3000/signup`

---

## Troubleshooting

### Port Already in Use
If port 3000 is taken:
```bash
# Option 1: Use a different port
PORT=3001 npm start

# Option 2: Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Fails
```bash
# Clear build cache
rm -rf build/
npm run build
```

### API Connection Issues
1. Check `.env` file has correct `REACT_APP_API_BASE_URL`
2. Verify backend is running
3. Check browser console for CORS errors
4. Verify backend allows frontend origin

---

## Development Workflow

### Typical Workflow:
```bash
# 1. Navigate to frontend directory
cd /Users/ishitagupta/Documents/Personal/frontend

# 2. Make sure backend is running (in another terminal)
cd /Users/ishitagupta/Documents/Personal/nutriediet-go
./nutriediet-go  # or go run main.go

# 3. Start frontend dev server
npm start

# 4. Open browser to http://localhost:3000
# 5. Make changes to code - they'll hot-reload automatically
```

---

## Deployment

### Option 1: Static Hosting (Netlify, Vercel, etc.)

```bash
# 1. Build for production
npm run build

# 2. Deploy the 'build' folder
# - Netlify: drag & drop build/ folder
# - Vercel: import from GitHub
```

### Option 2: Docker (if needed)

```dockerfile
# Dockerfile example
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Notes

- **Development**: Use `npm start` for local development with hot-reload
- **Production**: Use `npm run build` to create optimized production files
- **Environment Variables**: Must start with `REACT_APP_` to be accessible
- **Backend Required**: Frontend needs the Go backend API to be running
- **CORS**: Make sure backend allows requests from `http://localhost:3000` in development

---

## Related Files

- `.env` - Environment configuration
- `package.json` - Dependencies and scripts
- `src/api/axiosInstance.js` - API client configuration
- `src/utils/constants.js` - API endpoints and constants
- `public/_redirects` - Netlify redirect rules

---

**Need Help?** Check the browser console (F12) for errors or network issues.

