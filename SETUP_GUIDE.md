# 🚀 Quick Setup Guide for NovaCareAI

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- OpenAI API account (required)
- Supabase account (optional)
- ElevenLabs account (optional)

---

## 🔑 Step 1: Get Your OpenAI API Key (REQUIRED)

1. **Go to OpenAI Platform**: https://platform.openai.com/api-keys
2. **Sign in** or create a free account
3. **Click** "Create new secret key"
4. **Name it**: "NovaCareAI Local Dev"
5. **Copy the key** (starts with `sk-...`) - you won't see it again!
6. **Set usage limits** (recommended):
   - Go to: https://platform.openai.com/account/billing/limits
   - Set monthly limit: $5-10 for testing (you'll likely use <$1/month)

---

## ⚙️ Step 2: Configure Environment Variables

1. **Open the `.env` file** in the project root (already created for you)

2. **Add your OpenAI key** to BOTH variables:
   ```bash
   OPENAI_API_KEY=sk-your-actual-key-here
   VITE_OPENAI_API_KEY=sk-your-actual-key-here
   ```

3. **(Optional) Add Supabase credentials** for user authentication:
   ```bash
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```

4. **(Optional) Add ElevenLabs key** for voice features:
   ```bash
   VITE_ELEVENLABS_API_KEY=sk-xxxxx
   ```

5. **Save the file**

---

## 📦 Step 3: Install Dependencies

```bash
npm install
```

---

## 🏃 Step 4: Start Development Server

**Option A: Standard Vite Dev Server** (frontend only)
```bash
npm run dev
```

**Option B: Netlify Dev** (frontend + serverless functions)
```bash
# Install Netlify CLI globally (one time)
npm install -g netlify-cli

# Start dev server with functions
netlify dev
```

**Recommended**: Use **Option B (netlify dev)** for full AI functionality

---

## 🧪 Step 5: Test the Application

1. **Open browser**: http://localhost:8888 (Netlify) or http://localhost:5173 (Vite)

2. **Test Voice Recording**:
   - Click the microphone button
   - Allow microphone access
   - Speak a sample note
   - Stop recording
   - Wait for AI to process

3. **Test Manual Input**:
   - Click "Type Note"
   - Enter sample clinical text
   - Click "Generate Note"

---

## 🔍 Troubleshooting

### "API key not configured" error
- ✅ Restart dev server after editing `.env`
- ✅ Verify `.env` is in project root
- ✅ Check key doesn't have extra spaces
- ✅ Ensure key starts with `sk-`

### AI not generating notes
- ✅ Use `netlify dev` (not just `npm run dev`)
- ✅ Verify OpenAI key is valid and has credits
- ✅ Check browser console for errors

---

## 💰 Cost Estimation

- **Per note**: ~$0.001 (0.1 cents)
- **100 notes**: ~$0.10
- **1,000 notes**: ~$1.00

Set usage limits at: https://platform.openai.com/account/billing

---

Happy coding! 🩺✨
