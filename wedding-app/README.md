Wedding Invitation App

A full-stack personalized digital wedding invitation web app built with **React + Vite**, **Tailwind CSS**, **Framer Motion**, and **Supabase**.

---

## 🚀 Features

| Feature | Detail |
|---|---|
| 🫙 **Envelope opener** | Animated wax-sealed envelope intro per guest |
| 🪙 **Scratch-to-reveal date** | Gold canvas scratch cards for Day/Month/Year |
| 🎯 **Personalized URLs** | Each guest gets `/invite/their-name` |
| 🌸 **Falling petals + blobs** | Animated watercolor background & petals |
| 📖 **Our Story timeline** | 4-step scroll-animated timeline |
| 💍 **Event cards** | Nikah + Reception, tap to open Google Maps |
| 🗺️ **Venue with map** | Embedded map + directions button |
| ⏱️ **Live countdown** | Real-time countdown to wedding day |
| ✅ **3-step RSVP** | Yes/No → Guest count +/- → Confirmation |
| ❓ **FAQ accordion** | Animated expand/collapse questions |
| 📞 **Get in Touch** | Maps / Call / WhatsApp / Share buttons |
| 🍔 **Hamburger nav** | Slide-in drawer with section links |
| 📊 **Host Dashboard** | Overview, All Invitees, Add/Import tabs |
| 👥 **Attendance tracker** | See who's coming with head count |
| 💬 **WhatsApp share** | Send personalized invite links via WA |

---

## 📦 Install & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → Create a new project
2. Go to **SQL Editor** and run this:

```sql
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  attending BOOLEAN NOT NULL,
  guest_count INTEGER DEFAULT 1,
  responded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_guests"  ON guests FOR SELECT USING (true);
CREATE POLICY "public_insert_guests" ON guests FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_rsvps"   ON rsvps FOR SELECT USING (true);
CREATE POLICY "public_insert_rsvps" ON rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_rsvps" ON rsvps FOR UPDATE USING (true);
CREATE POLICY "public_delete_rsvps" ON rsvps FOR DELETE USING (true);
```

3. Go to **Settings → API**, copy:
   - **Project URL**
   - **anon / public key**

### 3. Create `.env` file
```bash
cp .env.example .env
```
Edit `.env`:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### 4. Run the app
```bash
npm run dev
```

---

## 🗺️ Routes

| Route | Description |
|---|---|
| `/` | Home / landing |
| `/invite/:slug` | Guest's personalized invitation |
| `/dashboard` | Host dashboard (no login required) |

---

## 📋 How to Use

### Adding Guests
1. Go to `/dashboard` → **Add** tab
2. Enter guest name + optional WhatsApp number
3. Click **Add Guest** → a unique URL is created: `/invite/guest-name`

### Sharing Invitations
- Dashboard → **Invitees** tab → click **WA** button next to a guest
- Or click **Copy** to copy their personal link

### Tracking RSVPs
- Dashboard → **Overview** tab shows:
  - ✅ Who's attending (with name + head count)
  - ❌ Who declined
  - ⏳ Who hasn't responded yet
  - 🧑‍🤝‍🧑 Total heads attending

---

## 🛠️ Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| react-router-dom | 6 | Routing |
| framer-motion | 11 | Animations |
| @supabase/supabase-js | 2 | Database |
| Tailwind CSS | 3 | Styling |
| Vite | 5 | Build tool |

### Install command:
```bash
npm install react react-dom react-router-dom framer-motion @supabase/supabase-js
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer typescript @types/react @types/react-dom
```

---

## 🌐 Deploy (Free)

### Vercel (recommended)
```bash
npm install -g vercel
vercel
# Add env vars in Vercel dashboard → Settings → Environment Variables
```

### Netlify
```bash
npm run build
# Drag dist/ folder to netlify.com/drop
# Add env vars in Netlify → Site settings → Environment variables
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Backgrounds.tsx      # Petals + watercolor blobs
│   ├── CoupleIllustration.tsx  # SVG couple art
│   ├── Countdown.tsx        # Live countdown timer
│   ├── FloralCorner.tsx     # SVG floral decorations
│   ├── Reveal.tsx           # Scroll-reveal wrapper
│   └── RSVPFlow.tsx         # 3-step RSVP (matches sample images)
├── lib/
│   └── supabase.ts          # DB client + types + SQL
├── pages/
│   ├── Home.tsx             # Landing / redirect
│   ├── InvitePage.tsx       # Full invitation (all sections)
│   └── Dashboard.tsx        # Host dashboard
├── index.css                # Global styles + animations
└── main.tsx                 # App entry + router
```
