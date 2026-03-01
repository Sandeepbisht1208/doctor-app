# Deployment Guide: Doctor Service System

This guide outlines how to move your application from your local computer to a live production environment.

## 1. Backend (Node.js API)
The backend needs a server to run 24/7.
- **Recommended Platforms**: Railway.app, Render.com, or a DigitalOcean Droplet.
- **Database**: 
    1. Provision a **PostgreSQL** database on your hosting provider.
    2. Run migrations: `npx knex migrate:latest --env production`
- **Environment Variables**: Set these in your hosting dashboard:
    - `NODE_ENV=production`
    - `PORT=5000`
    - `DATABASE_URL=your_postgres_connection_string`
    - `JWT_SECRET=a_very_long_random_string`
    - `EXPO_PROJECT_ID=your_id`

## 2. Admin Dashboard (Vite Web App)
The admin panel is a static web app.
- **Recommended Platforms**: Vercel, Netlify, or GitHub Pages.
- **Build Step**:
    1. Navigate to `admin-app`.
    2. Create an `.env` file with: `VITE_API_URL=https://your-backend-url.com/api`
    3. Run: `npm run build`
    4. Upload the contents of the `dist` folder to your provider.

## 3. User Mobile App (Android APK)
Since you are using EAS Build, you have two modes:

### **Internal Testing (Already configured)**
- Use the `preview` profile: `eas build -p android --profile preview`
- **Crucial**: Update `user-app/src/services/api.js` to point to your **Production Backend URL** before building.

### **Google Play Store (Production)**
- Use the `production` profile: `eas build -p android --profile production`
- This generates an `.aab` file for the store.

---

### 💡 Quick Checklist before Go-Live:
- [ ] Change `localhost` to your real domain in `api.js`.
- [ ] Ensure `JWT_SECRET` is strong and unique.
- [ ] Run `npx knex migrate:latest` on the production database.
- [ ] Verify CORS settings in `app.js` allow your Admin Dashboard domain.

**The system is engineered to scale!** 🚀
