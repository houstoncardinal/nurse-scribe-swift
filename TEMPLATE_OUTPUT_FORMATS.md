# Clinical Note Template Output Formats
## Complete Specification for AI-Generated Nursing Documentation

---

## Table of Contents
1. [SOAP Note Format](#soap-note-format)
2. [SBAR Handoff Format](#sbar-handoff-format)
3. [PIE Note Format](#pie-note-format)
4. [Epic Comprehensive Format](#epic-comprehensive-format)
5. [Formatting Rules](#formatting-rules)
6. [Clinical Content Requirements](#clinical-content-requirements)

---

## SOAP Note Format

### Structure
```
Subjective: [Patient's reported symptoms, complaints, and history]

Objective: [Measurable observations, vital signs, physical exam findings]

Assessment: [Clinical interpretation, diagnosis, and evaluation]

Plan: [Treatment plan, interventions, and follow-up care]
```

### Example Output
```
Subjective: Patient reports acute chest pain onset 2 hours ago, described as crushing, substernal, radiating to left arm. Pain level 7/10. Denies shortness of breath, nausea, or diaphoresis. Patient states "It feels like pressure on my chest." History of hypertension, currently taking Lisinopril 10mg daily.

Objective: VS: BP 152/94 mmHg, HR 98 bpm regular, RR 18 breaths/min, Temp 98.6°F (37°C), SpO2 96% on room air. Cardiovascular: S1, S2 present, no murmurs. Respiratory: Clear bilaterally, no adventitious sounds. Neuro: Alert and oriented x3, no focal deficits. Skin: Warm, dry, no cyanosis or diaphoresis. 12-lead ECG: Normal sinus rhythm, no ST segment changes. Troponin: 0.02 ng/mL (within normal limits).

Assessment: 58-year-old male presenting with atypical chest pain, likely non-cardiac origin given negative cardiac markers and normal ECG. Differential includes costochondritis, GERD, or anxiety-related chest discomfort. Patient hemodynamically stable with well-controlled pain.

Plan: Continue cardiac monitoring for 4 hours. Administer Maalox 30mL PO for possible GERD. Obtain repeat troponin in 3 hours. Educate patient on warning signs of cardiac emergency. Consult with provider if pain worsens or cardiac markers elevate. Discharge planning to include outpatient GI evaluation and stress test if symptoms persist. Patient verbalized understanding of care plan.
```

### Required Elements
- **Subjective:** Chief complaint, HPI, OLDCARTS (Onset, Location, Duration, Character, Aggravating/Alleviating factors, Radiation, Timing, Severity), patient quotes
- **Objective:** Complete vital signs with units, physical exam findings by system, relevant lab/test results
- **Assessment:** Clinical reasoning, differential diagnosis, patient stability assessment
- **Plan:** Specific interventions with time/dose/route, monitoring parameters, patient education, follow-up

---

## SBAR Handoff Format

### Structure
```
Situation: [Current patient status and immediate concern]

Background: [Relevant history, context, and recent events]

Assessment: [Clinical evaluation and findings]

Recommendation: [Specific actions and interventions needed]
```

### Example Output
```
Situation: 72-year-old female patient in Room 214, post-op day 2 from total hip replacement, experiencing increased pain not relieved by scheduled medications. Current pain level 8/10, up from baseline 4/10. Patient alert and oriented, vital signs stable except elevated HR 105 bpm.

Background: Patient underwent left total hip arthroplasty 2 days ago for severe osteoarthritis. PMH includes Type 2 diabetes (A1C 7.2%), hypertension controlled on Metoprolol 50mg BID. Allergies: Codeine (nausea). Current pain regimen: Oxycodone 5mg PO q4h PRN, last dose given 3 hours ago with minimal relief. Patient has been ambulating with PT twice daily without complications until today. Latest vitals: BP 138/82, HR 105, RR 20, Temp 99.1°F, SpO2 97% RA. Surgical site: Clean, dry, intact, no signs of infection.

Assessment: Patient's increased pain appears disproportionate to expected post-operative course. Pain is localized to surgical site with radiation to thigh. No erythema, warmth, or drainage noted at incision. Pedal pulses intact bilaterally. Patient denies chest pain, shortness of breath, or calf tenderness. Concerned about inadequate pain control affecting mobility and recovery. CBC from this morning shows WBC 10.2 (normal), no left shift.

Recommendation: Request provider evaluation for possible adjustment to pain management protocol. Consider increasing Oxycodone dose to 10mg or adding NSAID if not contraindicated. Apply ice to affected area. Elevate leg when in bed. Monitor vital signs q2h for next 6 hours. Continue neurovascular checks q4h. Notify provider immediately if pain worsens, fever develops, or signs of DVT appear. Document pain reassessment 30 minutes after any intervention.
```

### Required Elements
- **Situation:** Patient identifier, location, primary concern, current vital signs
- **Background:** Diagnosis, PMH, medications, allergies, recent procedures/changes
- **Assessment:** Your clinical evaluation, trend analysis, red flags identified
- **Recommendation:** Specific requests, monitoring parameters, escalation criteria

---

## PIE Note Format

### Structure
```
Problem: [Identified nursing diagnosis or patient issue]

Intervention: [Nursing actions taken to address the problem]

Evaluation: [Patient's response and outcomes]
```

### Example Output
```
Problem: Acute Pain (8/10) related to surgical incision post-appendectomy as evidenced by patient verbalization, facial grimacing, and guarding behavior. Patient unable to ambulate or perform deep breathing exercises due to pain intensity.

Intervention: Administered Morphine 4mg IV push at 1400 per provider order. Positioned patient in semi-Fowler's position with pillow support to surgical site. Applied cold pack to right lower quadrant for 20 minutes. Educated patient on splinting technique for cough and movement. Implemented relaxation breathing exercises with patient. Dimmed room lights and minimized environmental stimuli. Assessed pain level using 0-10 numeric scale. Monitored vital signs: BP 128/76, HR 88, RR 16, SpO2 98%. Monitored for adverse medication effects including respiratory depression, nausea, or hypotension.

Evaluation: Pain reassessed at 1430 (30 minutes post-medication): Patient reports pain decreased to 4/10. Facial expression relaxed, no grimacing observed. Patient able to turn in bed and perform incentive spirometry with minimal discomfort. Vital signs remain stable: BP 124/74, HR 82, RR 14, SpO2 99%. No adverse medication effects noted. Patient verbalized understanding of splinting technique and demonstrated proper use. Plan to continue q4h pain assessments and maintain multimodal pain management approach. Patient expressed satisfaction with current pain control and able to rest comfortably.
```

### Required Elements
- **Problem:** NANDA-approved nursing diagnosis when applicable, specific symptoms, impact on patient
- **Intervention:** All actions taken with time/dose/route, patient education provided
- **Evaluation:** Measurable outcomes, patient response, effectiveness of interventions, next steps

---

## Epic Comprehensive Format

### Structure
```
Patient Assessment:
[Head-to-toe assessment by systems]

Medication Administration:
[MAR documentation with times, doses, routes, responses]

Intake & Output:
[Detailed I&O with calculations and net balance]

Treatments & Procedures:
[Wound care, line/tube care, procedures performed]

Care Plans:
[Active nursing diagnoses, interventions, goals]

Communication:
[SBAR handoffs, provider notifications, family updates]

Safety & Risk:
[Fall risk, restraints, safety interventions]

Labs & Results:
[Specimens collected, critical results, notifications]

Narrative Notes:
[Significant events, condition changes, additional documentation]
```

### Example Output
```
SHIFT ASSESSMENT - Day Shift (0700-1500)
Unit: Med-Surg | Date: 11/04/2025 | RN: [Name]

Patient Assessment:
NEURO: Alert and oriented x3 (person, place, time). PERRLA 3mm bilaterally. Follows commands appropriately. No focal neurological deficits. Strength 5/5 in all extremities. Sensation intact. No dizziness or headache reported.

CARDIAC: Regular rate and rhythm. S1, S2 present, no murmurs, rubs, or gallops. Apical pulse 78 bpm. Radial pulses 2+ bilaterally. No peripheral edema. Cap refill <2 seconds. Telemetry monitoring: NSR, no ectopy noted.

RESPIRATORY: Respirations even and unlabored at 16 breaths/min. Lungs clear to auscultation bilaterally in all fields. No wheezes, rales, or rhonchi. SpO2 97% on room air. No use of accessory muscles. Incentive spirometry 1500mL (goal 2000mL).

GI/NUTRITION: Abdomen soft, non-tender, non-distended. Bowel sounds active x4 quadrants. Last BM yesterday evening (formed, brown). Tolerating regular diet. Oral intake: 480mL fluids this shift. No nausea or vomiting.

GU: Voiding spontaneously without difficulty. Urine clear, yellow. Output: 850mL this shift. No dysuria, urgency, or frequency reported.

SKIN: Skin warm, dry, intact. No pressure injuries noted. Braden Scale: 20 (Low Risk). Surgical incision right hip: Clean, dry, intact. Staples in place. No erythema, drainage, or signs of infection. Mild surrounding bruising noted (expected post-op finding).

MUSCULOSKELETAL: Ambulated 50 feet in hallway with walker and 1-person assist at 0900. Steady gait, no loss of balance. Pain 3/10 with movement, relieved with rest. ROM limited in right hip per post-op protocol.

VITAL SIGNS:
0700: BP 132/78, HR 76, RR 18, Temp 98.4°F (36.9°C), SpO2 97% RA, Pain 2/10
1200: BP 128/74, HR 78, RR 16, Temp 98.6°F (37°C), SpO2 98% RA, Pain 3/10

Medication Administration:
0800 - Metoprolol 50mg PO - Given with water. Pre-administration: HR 76, BP 132/78. Post (1hr): HR 72, BP 124/72. Patient tolerated well, no adverse effects.
0800 - Metformin 500mg PO - Given with breakfast. Patient educated on taking with food. No GI upset reported.
0900 - Oxycodone 5mg PO - Given for surgical pain 4/10. Pain reassessed at 0930: Decreased to 2/10. Patient reports adequate relief.
1000 - Enoxaparin 40mg SubQ - Administered to right abdomen. Site: No bleeding, bruising, or hematoma. Patient educated on DVT prevention.
1200 - Docusate 100mg PO - Given to prevent constipation from opioid use. Patient verbalized understanding.

Intake & Output (0700-1500):
INTAKE:
- Oral: 480mL (juice 240mL, water 240mL)
- IV: 500mL NS at 63mL/hr
- Total Intake: 980mL

OUTPUT:
- Urine: 850mL
- Surgical drain: 15mL serosanguineous
- Total Output: 865mL

NET BALANCE: +115mL (Positive balance appropriate for post-op hydration)

Treatments & Procedures:
0730 - Surgical dressing assessment: Right hip incision clean, dry, intact. No reinforcement needed.
0900 - Sequential compression devices applied to bilateral lower extremities. Devices cycling properly.
0900 - Physical therapy session: Ambulation training with walker, 50 feet, steady gait.
1300 - Incentive spirometry coaching: Achieved 1500mL (goal 2000mL). Will continue q2h while awake.

Care Plans:
1. Acute Pain (Post-Operative): Multimodal pain management implemented. Pain controlled 2-3/10 at rest, 4-5/10 with activity. Patient satisfied with current regimen.
2. Impaired Physical Mobility: PT twice daily. Progressing well with walker. Goal: Independent ambulation 100 feet by discharge.
3. Risk for Infection: Surgical site monitored q shift. Prophylactic antibiotics completed. No signs of infection.
4. Risk for DVT: Enoxaparin 40mg SubQ daily, SCDs in place, early mobilization encouraged.

Communication:
0730 - SBAR handoff received from night shift RN. Patient rested well overnight, pain controlled.
1100 - Provider notified of patient's progress. Order received to advance activity as tolerated.
1300 - Family visit: Daughter present. Updated on mother's recovery. Discharge planning discussed.
1430 - SBAR handoff given to evening shift: Patient stable, pain controlled, ambulating with assist.

Safety & Risk:
Fall Risk Assessment (Morse Fall Scale): 45 points - Moderate Risk
Interventions: Bed in low position, call light within reach, non-slip socks applied, hourly rounding, bed alarm activated at night, 1-person assist for ambulation.
No restraints in use.
Patient identification verified with 2 identifiers before all medications and procedures.

Labs & Results:
0600 - CBC collected: WBC 9.8, Hgb 11.2, Hct 33.8, Plt 245 (slight decrease from pre-op, within expected range)
0600 - BMP collected: Na 138, K 4.2, Cl 102, CO2 24, BUN 18, Cr 0.9, Glucose 112 (stable)
No critical values. Provider notified of results at 0830.

Narrative Notes:
Patient continues to recover well from right total hip arthroplasty on post-op day 3. Pain management effective with current regimen. Patient participated actively in physical therapy and achieved ambulation goal of 50 feet with walker and minimal assistance. Surgical site healing appropriately with no signs of complications. Patient educated on DVT prevention, importance of mobility, and pain management expectations. Family involved and supportive. Discharge planning in progress - targeting discharge in 2 days pending continued progress with PT and pain control. Patient verbalized understanding of all teaching and expressed confidence in recovery process.
```

### Required Elements for Each Section
**Patient Assessment:** Full head-to-toe by all systems (neuro, cardiac, respiratory, GI, GU, skin, musculoskeletal), vital signs with times and values
**Medication Administration:** Time, medication name, dose, route, site (if applicable), pre/post assessments, patient response, any PRN follow-up
**Intake & Output:** All sources of intake (oral, IV, enteral, parenteral), all sources of output (urine, drains, emesis, wounds), net balance calculation
**Treatments & Procedures:** Wound assessments with staging, dressing changes, line/tube care with site assessment
**Care Plans:** Active NANDA diagnoses, specific interventions, measurable goals, progress evaluation
**Communication:** SBAR format for handoffs, provider notifications with time and response, family updates
**Safety & Risk:** Fall risk score and interventions, restraint documentation if applicable, safety measures
**Labs & Results:** Specimen details (time, type, site), results with normal ranges, critical value notifications
**Narrative:** Significant events, changes in condition, provider communications, patient education effectiveness

---

## Formatting Rules

### 1. Section Headers
- **Always use plain text with colon format:** `Section Name: content`
- **Never use markdown headers:** ~~`## Section Name`~~
- **Capitalize first letter** of each section name
- **Add blank line** between sections for readability

### 2. Content Organization
- Use **paragraph format** for narrative sections
- Use **bullet points** (dash format) for lists only when appropriate
- Include **specific measurements** with units
- Use **medical abbreviations** correctly and consistently
- Always include **timestamps** for time-sensitive information

### 3. Clinical Language
- **Professional medical terminology** throughout
- **Objective, factual statements** in Objective/Assessment sections
- **Patient quotes** in Subjective sections when relevant
- **Specific measurements** instead of vague descriptors (e.g., "BP 130/80" not "blood pressure normal")
- **Action-oriented** language in Plan/Intervention sections

### 4. Data Presentation
**Vital Signs Format:**
```
BP 132/78 mmHg, HR 76 bpm, RR 18 breaths/min, Temp 98.6°F (37°C), SpO2 97% on room air, Pain 3/10
```

**Medication Format:**
```
Time - Medication Dose Route - Assessment/Response
0800 - Metoprolol 50mg PO - Pre: HR 76, BP 132/78. Post (1hr): HR 72, BP 124/72. Tolerated well.
```

**I&O Format:**
```
Intake: Oral 480mL, IV 500mL = Total 980mL
Output: Urine 850mL, Drain 15mL = Total 865mL
Balance: +115mL
```

---

## Clinical Content Requirements

### Essential Components (ALL Templates)
1. **Patient Identification:** Age, gender, relevant demographics
2. **Chief Complaint/Reason for Note:** Primary issue being addressed
3. **Vital Signs:** Complete set with units and timestamp
4. **Assessment Findings:** Objective, measurable observations
5. **Clinical Reasoning:** Interpretation of findings
6. **Interventions:** Specific actions taken with details
7. **Patient Response:** Measurable outcomes of interventions
8. **Safety Considerations:** Risk assessments, fall prevention, etc.
9. **Patient Education:** What was taught and patient understanding
10. **Follow-up Plan:** Next steps and monitoring requirements

### Epic-Specific Additional Requirements
11. **Shift Timeline:** Indicate shift phase (Start/Mid/End of shift)
12. **Unit-Specific Focus:** Med-Surg, ICU, NICU, or Mother-Baby specific elements
13. **MAR Precision:** Exact times, doses, routes, sites, responses for all medications
14. **Complete I&O:** All sources tracked with net balance calculation
15. **SBAR Handoff:** Structured communication for shift changes
16. **NANDA Diagnoses:** Use approved nursing diagnoses when applicable
17. **Flowsheet Data:** Quantifiable, trend-able data points
18. **Safety Compliance:** Fall risk scores, restraint documentation, infection control
19. **Provider Communication:** Time of notification, content, response
20. **Legal Documentation:** Objective language, no assumptions, complete and accurate

### Quality Indicators
✅ **Complete:** All required sections present and filled
✅ **Specific:** Uses measurements, times, and precise descriptors
✅ **Clinical:** Demonstrates nursing judgment and critical thinking
✅ **Actionable:** Clear interventions and follow-up plans
✅ **Professional:** Proper medical terminology and grammar
✅ **Compliant:** Meets Epic/regulatory documentation standards
✅ **Patient-Centered:** Focuses on patient status, response, and outcomes
✅ **Legal:** Objective, factual, complete, and timely

---

## AI Generation Instructions

When generating clinical notes, the AI MUST:

1. **Follow exact formatting** as specified above for each template type
2. **Include all required elements** for the chosen template
3. **Use specific, measurable data** instead of vague terms
4. **Maintain clinical accuracy** in all medical content
5. **Ensure Epic compliance** for Epic templates (all 10 sections, shift timeline, unit focus)
6. **Provide actionable content** in Plan/Recommendation/Intervention sections
7. **Use professional medical language** throughout
8. **Include patient education** and verify understanding
9. **Document safety measures** and risk assessments
10. **Structure content logically** within each section

---

*This document serves as the authoritative specification for all AI-generated clinical nursing documentation within the Raha system.*
