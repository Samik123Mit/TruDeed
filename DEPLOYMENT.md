# TruDeed Deployment Guide

Complete instructions for deploying TruDeed to production on Vercel (frontend) and Railway (backend).

## Option 1: Vercel + Railway (Recommended)

### Frontend Deployment (Vercel)

**Step 1: Connect to Vercel**
```bash
npm i -g vercel
vercel --prod
```

Or connect via Vercel dashboard:
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repository: `https://github.com/Samik123Mit/TruDeed`
4. Vercel auto-detects Next.js configuration
5. Click "Deploy"

**Step 2: Configure Environment Variables**

In Vercel Dashboard → Settings → Environment Variables, add:

```
NEXT_PUBLIC_API_URL=https://trudeed-api.railway.app
```

**Deployment Result:**
- Frontend automatically deploys at every git push
- Live URL: `https://trudeed-[random].vercel.app`
- CI/CD pipeline included

### Backend Deployment (Railway)

**Step 1: Create Railway Account**
- Go to https://railway.app
- Sign up with GitHub

**Step 2: Deploy Backend**
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

Or via Railway Dashboard:
1. Create new project on Railway
2. Connect GitHub repo
3. Select "Docker" as deployment method
4. Railway reads `railway.json` and deploys

**Step 3: Configure Environment Variables**

In Railway Project → Variables:
```
DATABASE_URL=sqlite:///./app.db
```

**Step 4: Get Backend URL**
Railway provides public URL automatically:
- Format: `https://trudeed-api-production-[hash].railway.app`
- Copy this and add to Vercel environment variables

**Deployment Result:**
- Backend auto-deployed at every git push
- API endpoint live and accessible
- Database persisted in Railway

---

## Option 2: Docker Compose (Self-Hosted)

### AWS EC2 / Google Cloud VM

**Step 1: Launch VM**
```bash
# On your VM (Ubuntu 20.04+)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**Step 2: Deploy**
```bash
git clone https://github.com/Samik123Mit/TruDeed.git
cd TruDeed
docker-compose up -d
```

**Step 3: Configure Nginx (Optional)**
```bash
sudo apt install nginx
# Configure reverse proxy for SSL
```

---

## Option 3: Render

### Render Deployment (Full Stack)

**Frontend on Render:**
1. Go to https://render.com
2. Create "Web Service"
3. Connect GitHub repository
4. Build command: `pnpm build`
5. Start command: `pnpm start`

**Backend on Render:**
1. Create "Web Service" for backend
2. Build command: Auto-detected from Dockerfile
3. Start command: Auto-detected

---

## Production Checklist

- [ ] Environment variables configured
- [ ] Database initialized on production server
- [ ] CORS configured for API endpoints
- [ ] SSL/TLS certificates enabled
- [ ] Backend and frontend URLs linked
- [ ] CDN configured for static assets
- [ ] Monitoring and logging enabled
- [ ] Backup strategy in place

## Post-Deployment Verification

```bash
# Test frontend
curl https://trudeed-[random].vercel.app

# Test backend health
curl https://trudeed-api.railway.app/health

# Test full pipeline
# Upload document via web interface
# Verify fraud detection works end-to-end
```

## Performance Optimization

**Frontend (Vercel):**
- Edge Functions enabled by default
- Image optimization active
- Static regeneration configured

**Backend (Railway):**
- Auto-scaling enabled
- Database connection pooling active
- Gzip compression enabled

## Monitoring & Logging

**Vercel:**
- Analytics dashboard at https://vercel.com/dashboard
- Real-time logs in deployment view
- Automatic error tracking

**Railway:**
- Logs available in project dashboard
- Metrics for CPU, memory, network
- Deployment history tracked

## Cost Estimation

**Vercel (Frontend):**
- Hobby: Free tier (sufficient for hackathon)
- Production: ~$20/month for Pro tier

**Railway (Backend):**
- Pay-as-you-go pricing
- ~$5-15/month for low-traffic MVP
- Free trial credits available

## Rollback Procedure

**Vercel:**
- Go to Deployments tab
- Click deployment date
- Click "Redeploy"

**Railway:**
- Go to Deployments
- Select previous deployment
- Click "Redeploy"

## Custom Domain Setup

**Vercel:**
1. Domain Settings → Add Domain
2. Add DNS records (provided by Vercel)
3. Enable SSL (automatic)

**Railway:**
1. In project settings, add custom domain
2. Update DNS records
3. SSL auto-provisioned

## Support & Troubleshooting

- Vercel docs: https://vercel.com/docs
- Railway docs: https://docs.railway.app
- GitHub issues: https://github.com/Samik123Mit/TruDeed/issues

---

**Deployment Status:** Ready for production  
**Last Updated:** 2024-05-24  
**Estimated Deployment Time:** 5-10 minutes
