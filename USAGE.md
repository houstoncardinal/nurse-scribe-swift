# NovaCare - Usage Guide

## Quick Start: 60-Second Demo Path

Follow this workflow to create your first clinical note:

### 1. **Dictate** (Click Start Recording)
   - Click the "Start Recording" button
   - Speak your clinical observations naturally
   - Example: "Patient reports chest pain, rated 7 out of 10. Blood pressure is 140 over 90. Heart rate 88. Started on nitroglycerin sublingual. Patient feeling better after intervention."
   - Click "Stop Recording" when done

### 2. **Redact PHI** (Protect Patient Privacy)
   - Review the transcript in the PHI Protection panel
   - Toggle "Redact potential patient names" if needed
   - Click "Redact PHI" button
   - The system will automatically mask:
     - Phone numbers → `[PHONE]`
     - Dates → `[DATE]`
     - Email addresses → `[EMAIL]`
     - Medical Record Numbers → `[MRN]`
     - Street addresses → `[ADDRESS]`
     - Potential names → `[NAME]`

### 3. **Compose** (Generate Structured Note)
   - Select your preferred note format:
     - **SOAP** - Subjective, Objective, Assessment, Plan
     - **SBAR** - Situation, Background, Assessment, Recommendation
     - **PIE** - Problem, Intervention, Evaluation
   - Click "Compose Note"
   - AI will structure your dictation into the selected format
   - See estimated time saved vs manual entry

### 4. **Export** (Get Your Note)
   - **Clipboard**: Copy directly to paste into your EHR
   - **TXT**: Download as plain text file
   - **PDF**: Download formatted PDF with metadata

---

## Privacy & Security

### No-PHI Pilot Mode
- **All processing happens locally** in your browser
- **No audio recordings** are stored anywhere
- **No transcripts** are sent to servers until AFTER redaction
- **PHI is stripped** before any AI processing

### What Gets Redacted
The system uses pattern matching to identify and redact:
- Phone numbers (all common formats)
- Dates (MM/DD/YYYY, YYYY-MM-DD, Jan 15 2024, etc.)
- Email addresses
- Medical Record Numbers (MRN: 12345, Patient ID: 67890)
- Street addresses (123 Main St, etc.)
- Potential patient names (capitalized word sequences)

### Validation
After redaction, the system validates that no obvious PHI patterns remain before allowing AI composition.

---

## AI Modes

### With OpenAI API Key (Real AI)
1. Add `VITE_OPENAI_API_KEY` to your environment
2. System uses GPT-4o-mini for intelligent note composition
3. Structured, contextual, clinically appropriate output
4. Model: `gpt-4o-mini`

### Without API Key (Mock Mode)
1. Deterministic mock generator creates reasonable notes
2. Distributes content across template sections
3. Good for testing workflow and UI
4. Add API key for production-quality composition

---

## Clinical Note Templates

### SOAP Note
**Best for:** Comprehensive patient encounters, follow-ups
- **Subjective:** Patient's reported symptoms, concerns, history
- **Objective:** Measurable observations, vital signs, exam findings
- **Assessment:** Clinical interpretation and diagnosis
- **Plan:** Treatment plan, interventions, follow-up

### SBAR
**Best for:** Handoffs, critical communications, escalations
- **Situation:** Current patient status and immediate concern
- **Background:** Relevant history, medications, context
- **Assessment:** Clinical evaluation and findings
- **Recommendation:** Suggested actions and interventions

### PIE Note
**Best for:** Problem-focused nursing documentation
- **Problem:** Identified patient problem or nursing diagnosis
- **Intervention:** Nursing actions taken to address the problem
- **Evaluation:** Patient's response to interventions and outcomes

---

## Browser Compatibility

### Supported Browsers (Web Speech API)
- ✅ **Chrome** (Desktop & Mobile) - Recommended
- ✅ **Microsoft Edge** (Desktop & Mobile)
- ✅ **Safari** (Desktop & Mobile)
- ⚠️ **Firefox** - Limited support (may require flag)

### Required Permissions
- **Microphone access** for dictation
- Browser will prompt on first use

---

## Time Savings

### Typical Manual Documentation
- Average: **7 minutes** per comprehensive note
- Includes typing, formatting, review

### NovaCare-Assisted
- Average: **1.5 minutes** total
- Includes dictation (30-45s) + review + export (45s)
- **~5.5 minutes saved per note**

### Projected Efficiency Gains
- 10 notes/shift = **55 minutes saved**
- 5 shifts/week = **4.5 hours saved weekly**
- 50 weeks/year = **225 hours saved annually**

---

## Troubleshooting

### "Speech recognition is not supported"
- Use Chrome, Edge, or Safari
- Update browser to latest version
- Check browser flags (Firefox)

### "Microphone access denied"
- Allow microphone in browser settings
- Check system microphone permissions
- Try refreshing the page

### Poor transcription accuracy
- Speak clearly and at moderate pace
- Reduce background noise
- Use medical terminology naturally
- Review and edit transcript before composing

### Export not working
- Complete full workflow first (dictate → redact → compose)
- Check browser download permissions
- Try different export format

---

## Best Practices

1. **Review transcripts** before redaction - Speech recognition isn't perfect
2. **Enable name redaction** unless you're certain no names were mentioned
3. **Use consistent medical terminology** for better AI composition
4. **Review composed notes** before exporting - AI needs human oversight
5. **Keep dictations focused** on one patient encounter at a time
6. **Save frequently** by exporting after each note

---

## Technical Details

- **Frontend:** React 18 + TypeScript + Vite
- **UI Framework:** Tailwind CSS + shadcn/ui
- **Speech Recognition:** Web Speech API (browser native)
- **Redaction:** Rules-based pattern matching (client-side)
- **AI:** OpenAI GPT-4o-mini (when configured)
- **Export:** jsPDF for PDF generation

---

## Future Roadmap

- [ ] Custom redaction patterns
- [ ] Template customization
- [ ] Multi-language support
- [ ] Offline mode with IndexedDB
- [ ] Voice commands for hands-free operation
- [ ] Integration with major EHR systems
- [ ] Mobile native apps (iOS/Android)

---

## Support & Feedback

For issues, questions, or feature requests:
- Review this documentation
- Check console for error messages
- Provide detailed steps to reproduce issues

---

**Remember:** This is a pilot/demo version. Always review AI-generated clinical content before use in patient care.
