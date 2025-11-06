# ⚡ Quick Start - Get Running in 3 Minutes

## 1️⃣ Add Your OpenAI API Key

Edit `.env` file and replace these two lines:

```bash
OPENAI_API_KEY=sk-your-actual-key-here
VITE_OPENAI_API_KEY=sk-your-actual-key-here
```

**Don't have a key?** Get one here: https://platform.openai.com/api-keys

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Start the App

```bash
npm run dev
```

Or for full AI features with serverless functions:

```bash
npm install -g netlify-cli
netlify dev
```

## 4️⃣ Open Browser

- **Vite**: http://localhost:5173
- **Netlify**: http://localhost:8888

---

## ✅ Test It Works

1. Click the **microphone** button
2. Say: "Patient reports chest pain, BP 120 over 80, alert and oriented"
3. Stop recording
4. Watch AI generate a SOAP note! 🎉

---

## 🆘 Not Working?

**"API key not configured"**
→ Make sure you edited `.env` and restarted the server

**Voice not recording**
→ Allow microphone access + use Chrome/Edge browser

**AI not generating**
→ Use `netlify dev` instead of `npm run dev`

**Still stuck?**
→ Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env` | Your API keys (keep secret!) |
| `src/pages/MVPApp.tsx` | Main app component |
| `netlify/functions/generate-note.ts` | AI backend |
| `src/lib/templatePlaceholders.ts` | Template definitions |

---

## 🚀 What You Can Do

✅ Voice-to-text clinical notes
✅ 13 Epic-compliant templates (SOAP, SBAR, PIE, DAR, etc.)
✅ AI-enhanced medical terminology
✅ ICD-10 code suggestions
✅ Real-time note preview
✅ Export to PDF/Word/Text
✅ HIPAA-compliant documentation

---

## 📚 Need More Help?

- **Full Setup Guide**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Expected Outputs**: [EXPECTED_AI_OUTPUTS.md](EXPECTED_AI_OUTPUTS.md)
- **Template Formats**: [TEMPLATE_OUTPUT_FORMATS.md](TEMPLATE_OUTPUT_FORMATS.md)

---

**You're ready to go! Happy documenting!** 🩺✨
