# Milltrack HRM

মিল/কারখানার জন্য HRM (Employee, Department, Holiday, Shift, Bonus, Gazette, Salary, User Access) সফটওয়্যার। React + Vite দিয়ে তৈরি, নিজে হোস্ট করা যায় এমন সম্পূর্ণ স্ট্যান্ডঅ্যালোন প্রজেক্ট।

ডেটা এখন **Supabase**-এ (ফ্রি, শেয়ার্ড ডেটাবেস) সেভ হয় — অফিসের সবাই, যেকোনো ব্রাউজার/ডিভাইস থেকে একই ডেটা দেখবে ও এডিট করবে। সেটআপ ধাপ নিচে "৪. শেয়ার্ড ডেটাবেস (Supabase)" অংশে দেওয়া আছে — এটা না করা পর্যন্ত অ্যাপ চলবে কিন্তু ডেটা সেভ/শেয়ার হবে না (শুধু ডেমো সিড ডেটা দেখাবে)।

Demo লগইন: `admin` / `admin123` (Admin) অথবা `hr.rahim` / `hr12345` (HR Manager)

---

## ১. নিজের কম্পিউটারে রান করা (ডেভেলপমেন্ট)

আগে [Node.js](https://nodejs.org) (v18 বা তার বেশি) ইনস্টল থাকতে হবে।

```bash
cd milltrack-hrm
npm install
npm run dev
```

টার্মিনালে একটা লোকাল লিংক দেখাবে (যেমন `http://localhost:5173`) — ব্রাউজারে ওটা খুললেই সফটওয়্যার চলবে।

---

## ২. প্রোডাকশন বিল্ড বানানো

```bash
npm run build
```

এতে একটা `dist/` ফোল্ডার তৈরি হবে — এই ফোল্ডারের ভেতরের সবকিছুই হলো আপনার **চূড়ান্ত ওয়েবসাইট** (HTML, CSS, JS)। এই `dist` ফোল্ডারটাই হোস্টিংয়ে আপলোড করবেন।

```bash
npm run preview   # বিল্ড হওয়া ভার্সন লোকালি চেক করার জন্য
```

---

## ৩. নিজের ডোমেইনে হোস্ট করা — কয়েকটা অপশন

### অপশন A — সবচেয়ে সহজ ও ফ্রি: Vercel / Netlify
1. এই প্রজেক্টটা GitHub-এ পুশ করুন (অথবা Vercel/Netlify-তে সরাসরি ফোল্ডার ড্র্যাগ-ড্রপ করেও দেওয়া যায়)।
2. [vercel.com](https://vercel.com) বা [netlify.com](https://netlify.com)-এ অ্যাকাউন্ট খুলে "New Project/Site" → রিপো সিলেক্ট করুন।
3. Build command: `npm run build`, Output directory: `dist` — এটুকু বসিয়ে দিলেই ওরা নিজে থেকে বিল্ড করে একটা লিংক দেবে।
4. Settings থেকে "Add Domain" দিয়ে আপনার নিজের কেনা ডোমেইন (যেমন `hrm.yourcompany.com`) যোগ করে DNS-এ ওদের দেওয়া CNAME/A রেকর্ড বসিয়ে দিলেই নিজের ডোমেইনে চলে যাবে।

### অপশন B — নিজের cPanel/শেয়ার্ড হোস্টিং
1. লোকালি `npm run build` চালান।
2. `dist/` ফোল্ডারের ভেতরের সবকিছু cPanel-এর File Manager দিয়ে `public_html/` (বা যে ডোমেইনের ফোল্ডার) এ আপলোড করুন।
3. এটা একটা Single Page App, তাই `public_html/.htaccess` ফাইলে এই লাইনগুলো যোগ করুন যাতে পেজ রিফ্রেশে ৪০৪ এরর না আসে:
   ```
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

### অপশন C — নিজের VPS (Ubuntu ইত্যাদি)
`dist/` ফোল্ডারটা Nginx দিয়ে সার্ভ করুন:
```nginx
server {
  listen 80;
  server_name yourdomain.com;
  root /var/www/milltrack-hrm/dist;
  index index.html;
  location / {
    try_files $uri /index.html;
  }
}
```

---

## ৪. শেয়ার্ড ডেটাবেস (Supabase) — সবার জন্য একই ডেটা

এই ভার্সনে ডেটা এখন **Supabase**-এ (ফ্রি) শেয়ার্ডভাবে থাকে — অফিসের যে কেউ, যেকোনো ব্রাউজার/ডিভাইস থেকে লগইন করলে সবাই একই Employee/Department/Salary ডেটা দেখবে ও আপডেট করবে। শুধু লগইন সেশনটা প্রতিটা ব্রাউজারে আলাদা থাকে (একজনের লগইন অন্যজনকে লগআউট করে দেবে না)।

### ধাপ ১ — ফ্রি Supabase প্রজেক্ট বানান
1. [supabase.com](https://supabase.com) → "Start your project" → GitHub দিয়ে সাইন আপ করুন
2. "New Project" → নাম দিন (যেমন `milltrack-hrm`), একটা ডেটাবেস পাসওয়ার্ড দিন (মনে রাখুন), Region সিলেক্ট করুন → Create — ১-২ মিনিট সময় নেবে সেটআপ হতে

### ধাপ ২ — টেবিল তৈরি করুন
1. বাম মেনু থেকে **SQL Editor** এ যান → "New query"
2. এই প্রজেক্টের `supabase-setup.sql` ফাইলের পুরো কন্টেন্ট কপি-পেস্ট করে **Run** চাপুন — এতে ডেটা রাখার টেবিল ও পারমিশন তৈরি হয়ে যাবে

### ধাপ ৩ — API Key কপি করুন
1. বাম মেনু থেকে **Project Settings → API** এ যান
2. `Project URL` এবং `anon public` key — এই দুইটা কপি করুন

### ধাপ ৪ — প্রজেক্টে key বসান
- **লোকালি রান করলে:** প্রজেক্টের মূল ফোল্ডারে `.env` নামে একটা ফাইল বানিয়ে এভাবে বসান (`.env.example` ফাইলটা দেখুন):
  ```
  VITE_SUPABASE_URL=https://xxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=xxxxxxxx
  ```
- **Netlify/Vercel-এ হোস্ট করলে:** Site settings → "Environment variables" এ গিয়ে `VITE_SUPABASE_URL` ও `VITE_SUPABASE_ANON_KEY` নামে দুটো এন্ট্রি যোগ করুন, তারপর "Redeploy" করুন

ব্যস — এরপর থেকে সব ব্রাউজার/ডিভাইস থেকে একই ডেটা দেখা যাবে।

### নিরাপত্তা নোট
`supabase-setup.sql`-এর পলিসি সবাইকে (anon key থাকা যে কাউকে) পড়া-লেখার অনুমতি দেয় — ছোট/অভ্যন্তরীণ টিমের জন্য এটা ঠিক আছে, কিন্তু ইন্টারনেটে পুরোপুরি পাবলিক করলে অন্য কেউ চাইলে ডেটাবেসে সরাসরি লিখতে পারবে (আপনার login page বাইপাস করে)। এটা আরও কঠোর করতে চাইলে (যেমন Supabase Auth দিয়ে real user-login যুক্ত করা) — বলবেন, সেটাও করে দিতে পারি।


---

## ফাইল গঠন
```
milltrack-hrm/
├── index.html
├── package.json
├── vite.config.js
├── .env.example        ← Supabase key বসানোর নমুনা
├── supabase-setup.sql   ← Supabase-এ একবার Run করার SQL
└── src/
    ├── main.jsx
    ├── supabaseClient.js ← Supabase কানেকশন
    └── App.jsx           ← মূল সফটওয়্যারের সব কোড এখানে
```
