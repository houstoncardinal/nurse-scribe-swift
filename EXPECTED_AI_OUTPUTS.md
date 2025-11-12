# Expected AI Output Examples for RahaAI Templates

## Overview
This document shows the **expected AI-processed output** for each template type after the user submits voice recording or manual text input.

**Key Points:**
- ✅ Placeholders appear in the input field (with emojis)
- ✅ AI output is **plain text** without emojis (professional clinical documentation)
- ✅ Output follows Epic nursing documentation standards
- ✅ Each section displays in a separate card in the Draft Preview

---

## 1. SOAP (Subjective, Objective, Assessment, Plan)

### Input Placeholder (what user sees in textarea):
```
🩺 Subjective: Patient reports mild chest discomfort for the past 2 hours. Denies shortness of breath, dizziness, or nausea.
📊 Objective: BP 128/84, HR 82, Temp 98.4°F, SpO2 98%. Skin warm and dry.
🧠 Assessment: Chest pain likely musculoskeletal. No acute distress.
🗓 Plan: Monitor vitals, provide acetaminophen 500 mg PO, reassess in 30 mins, notify provider if pain worsens.
```

### Expected AI Output (processed in Draft Preview):

**Subjective:**
```
Patient reports mild chest discomfort for the past 2 hours, described as aching and localized to the left anterior chest wall. Pain level 4/10, worsens with deep breathing and movement. Denies shortness of breath, dizziness, nausea, diaphoresis, or radiation to arm/jaw. States "It feels like a pulled muscle from lifting boxes yesterday." No history of cardiac disease or previous episodes. Currently takes no regular medications. Denies recent illness, fever, or cough.
```

**Objective:**
```
VS: BP 128/84 mmHg, HR 82 bpm regular, RR 16 breaths/min, Temp 98.4°F (36.9°C), SpO2 98% on room air, Pain 4/10

GENERAL: Alert and oriented x3, calm, no acute distress observed.

CARDIOVASCULAR: Heart sounds S1, S2 present, regular rate and rhythm. No murmurs, rubs, or gallops. Peripheral pulses 2+ bilateral. Capillary refill <2 seconds. No peripheral edema.

RESPIRATORY: Lungs clear to auscultation bilaterally in all fields. No wheezes, rales, or rhonchi. Respiratory effort even and unlabored. No use of accessory muscles.

SKIN: Warm, dry, intact. No cyanosis or pallor. Good skin turgor.

CHEST WALL: Tenderness to palpation over left anterior chest at 4th intercostal space. No visible deformity, bruising, or swelling. Pain reproduced with palpation and chest wall movement.
```

**Assessment:**
```
42-year-old male presenting with left-sided chest pain, likely musculoskeletal in origin based on reproducible tenderness with palpation, association with recent physical activity, and absence of cardiac symptoms. Vital signs stable and within normal limits. No signs of acute coronary syndrome - negative for diaphoresis, radiation, shortness of breath, or hemodynamic instability. Patient demonstrates good understanding of symptoms and is hemodynamically stable. Low risk for cardiac etiology given age, lack of risk factors, and clinical presentation consistent with chest wall strain.
```

**Plan:**
```
1. Continue monitoring vital signs q4h for next 8 hours
2. Administer acetaminophen 500 mg PO now for pain management
3. Apply ice pack to affected area for 20 minutes q2h PRN
4. Educate patient on warning signs requiring immediate notification: worsening pain, shortness of breath, chest pressure, radiation to arm/jaw, diaphoresis
5. Reassess pain level in 30 minutes post-medication administration
6. Encourage rest and avoid heavy lifting for 48-72 hours
7. Notify provider if pain level >6/10, vital signs change significantly, or any cardiac symptoms develop
8. Document patient education and verbalized understanding
9. Patient to follow up with primary care provider within 1 week if symptoms persist
10. Patient verbalized understanding of care plan and agrees with treatment
```

---

## 2. SBAR (Situation, Background, Assessment, Recommendation)

### Input Placeholder:
```
⚡ Situation: Patient c/o headache rated 8/10.
📚 Background: Hx of hypertension, on lisinopril. BP now 182/96.
🧠 Assessment: Hypertensive episode, patient alert/oriented, no visual changes.
💡 Recommendation: Administer PRN hydralazine per protocol, recheck BP in 30 minutes.
```

### Expected AI Output:

**Situation:**
```
65-year-old female patient in Room 312 complaining of severe headache rated 8/10, throbbing in quality, localized to occipital region. Onset approximately 1 hour ago. Current vital signs: BP 182/96 mmHg, HR 94 bpm, RR 18 breaths/min, Temp 98.2°F, SpO2 97% on room air. Patient alert and oriented x3, appears uncomfortable but no acute distress. Headache associated with mild nausea but no vomiting, visual changes, or neurological deficits noted.
```

**Background:**
```
Patient admitted 2 days ago for pneumonia, currently on IV antibiotics (Ceftriaxone 1g IV q24h). Medical history significant for:
- Hypertension (diagnosed 10 years ago)
- Type 2 diabetes (A1C 7.1%)
- Hyperlipidemia

Current home medications include Lisinopril 20mg PO daily, Metformin 1000mg PO BID, Atorvastatin 40mg PO QHS. All home medications continued during hospitalization. Baseline BP typically 130-140/80-90 per patient report. Last documented BP 4 hours ago: 142/88 mmHg. No known allergies. Patient reports medication compliance prior to admission. No recent changes to antihypertensive regimen. Denies history of stroke, MI, or renal disease.
```

**Assessment:**
```
Patient experiencing hypertensive urgency with BP 182/96 mmHg, elevated 40-50 mmHg above baseline. Headache likely related to acute blood pressure elevation. Currently hemodynamically stable without signs of end-organ damage - no visual changes, chest pain, shortness of breath, altered mental status, or neurological deficits. Patient's regular antihypertensive medication (Lisinopril 20mg) was administered at 0800 this morning. No obvious precipitating factors identified - denies pain, anxiety, or medication non-compliance. Concerned about potential progression to hypertensive emergency if BP not controlled. Patient cooperative and understands situation.
```

**Recommendation:**
```
1. Request provider order for PRN hydralazine 10-20mg IV per hypertensive urgency protocol
2. Administer antihypertensive medication as ordered
3. Recheck blood pressure in 30 minutes post-medication administration
4. Continue BP monitoring every 15-30 minutes until <160/90 or per provider orders
5. Monitor for adverse effects including hypotension, reflex tachycardia, or headache worsening
6. Maintain patient on bed rest with head of bed elevated 30 degrees
7. Provide quiet, dimly lit environment to minimize stimulation
8. Notify provider immediately if:
   - BP remains >180/100 after intervention
   - Patient develops chest pain, shortness of breath, visual changes, or altered mental status
   - Systolic BP drops >30 mmHg from baseline
9. Consider ordering stat BMP to assess electrolytes and renal function if not done today
10. Continue IV hydration at current rate unless provider advises otherwise
11. Document all interventions, patient response, and ongoing assessments
```

---

## 3. PIE (Problem, Intervention, Evaluation)

### Input Placeholder:
```
🚨 Problem: Acute pain at surgical incision site rated 7/10.
💊 Intervention: Administered morphine 2 mg IV.
📈 Evaluation: Pain decreased to 3/10 within 20 minutes, patient resting comfortably.
```

### Expected AI Output:

**Problem:**
```
Acute post-operative pain at right lower quadrant surgical incision site (laparoscopic appendectomy, post-op day 1) rated 7/10 on numeric pain scale. Patient describes pain as sharp and constant, worsening with movement, coughing, and deep breathing. Pain significantly limiting patient's ability to ambulate, perform incentive spirometry, and participate in post-operative care activities. Patient exhibiting facial grimacing, guarding behavior, and reluctance to move in bed. Vital signs show HR 98 bpm (elevated from baseline 72 bpm), BP 142/86 mmHg (slightly elevated from baseline 120/75 mmHg). Patient last received pain medication (oxycodone 5mg PO) 6 hours ago with minimal relief. Patient rates previous pain management regimen as inadequate. Surgical dressing clean, dry, intact with no signs of infection - no erythema, drainage, or unusual warmth at incision site. Pain appears consistent with expected post-operative discomfort but current intensity interfering with recovery goals.
```

**Intervention:**
```
1430: Conducted comprehensive pain assessment using numeric rating scale, PQRST method (Provocation, Quality, Radiation, Severity, Timing), and behavioral indicators. Patient confirmed sharp, localized pain at surgical site without radiation, worsening with movement.

1430: Verified active provider order for morphine sulfate 2-4mg IV push PRN for severe pain. Reviewed patient allergies (none documented), last dose administration (none given), and contraindications.

1435: Administered morphine sulfate 2mg via IV push slowly over 2 minutes into existing peripheral IV line (right forearm, 20G, patent, no signs of infiltration). Pre-administration vital signs: BP 142/86 mmHg, HR 98 bpm, RR 18 breaths/min, SpO2 97% on room air.

1435: Positioned patient in semi-Fowler's position (30-degree elevation) with pillow support to surgical site for comfort. Assisted patient with splinting technique for coughing and movement.

1440: Applied cold pack to right lower quadrant (over dressing) for 20 minutes to reduce inflammation and provide additional pain relief.

1440: Implemented environmental modifications: dimmed room lights, minimized noise, ensured call light within reach.

1445: Educated patient on:
- Importance of pain control for healing and preventing complications
- Splinting technique for coughing, turning, and ambulation
- Deep breathing exercises to prevent atelectasis
- Expected pain trajectory and when to request additional medication
- Signs of complications requiring immediate notification (fever, increased drainage, worsening pain despite medication)

1445-1455: Monitored patient continuously for adverse medication effects including respiratory depression (RR <10), hypotension (SBP <90 mmHg), excessive sedation, nausea/vomiting, or allergic reaction. Pulse oximetry remained on continuous monitoring.

1450: Encouraged and coached incentive spirometry use - patient achieved 750mL (goal 1500mL) with less discomfort using splinting technique.
```

**Evaluation:**
```
1455: Pain reassessment (20 minutes post-medication administration): Patient reports pain decreased from 7/10 to 3/10. Facial expression relaxed, no grimacing observed. Patient able to turn in bed with minimal discomfort when using splinting technique. Successfully performed incentive spirometry reaching 1000mL without significant pain (improvement from 750mL). States "I feel so much better now, the pain is much more manageable."

1455: Post-intervention vital signs: BP 128/78 mmHg (decreased from 142/86), HR 84 bpm (decreased from 98), RR 14 breaths/min (within normal limits), SpO2 98% on room air (stable). No respiratory depression noted - respiratory rate and depth appropriate. Patient alert and oriented x3, conversing appropriately, no signs of excessive sedation (Richmond Agitation-Sedation Scale: 0 - alert and calm).

1455: Adverse effects assessment: No nausea, vomiting, pruritus, or signs of allergic reaction observed. Patient denies dizziness or lightheadedness. No signs of hypotension. Peripheral IV site intact without redness, swelling, or infiltration.

1455: Patient verbalized understanding of:
- Pain management plan and when to request additional medication
- Proper use of splinting technique (demonstrated correctly)
- Importance of incentive spirometry and ambulation for recovery
- Warning signs requiring immediate nurse notification

1500: Patient resting comfortably in semi-Fowler's position, eyes closed, even respirations. Pain controlled at 3/10, patient expresses satisfaction with current pain management. Goal pain level achieved (<4/10 for rest, <6/10 for activity).

PLAN MOVING FORWARD:
- Continue multimodal pain management approach combining pharmacological and non-pharmacological interventions
- Reassess pain level q4h and PRN
- Encourage use of PCA or PRN medication before pain becomes severe (maintain <5/10)
- Schedule regular repositioning q2h
- Ambulate patient this evening with pain medication administered 30 minutes prior
- Continue incentive spirometry q1h while awake with goal 1500mL
- Monitor for medication side effects, particularly with subsequent opioid doses
- Document pain assessments, interventions, and patient response in flowsheet
- Consider consulting pain management team if pain remains poorly controlled despite current regimen

Patient currently meeting pain management goals. Intervention effective in reducing pain and facilitating participation in post-operative recovery activities. Will continue to monitor and adjust plan as needed.
```

---

## 4. DAR (Data, Action, Response)

### Input Placeholder:
```
📊 Data: Patient found anxious, pacing room, stating "I can't breathe right." SpO2 96%.
⚙️ Action: Instructed patient on deep-breathing techniques, provided reassurance.
✅ Response: Patient calmer, breathing normalized, states "I feel better now."
```

### Expected AI Output:

**Data:**
```
1645: Patient observed pacing room, wringing hands, and demonstrating rapid shallow breathing pattern. Patient approached nurse stating "I can't breathe right, something is wrong, I feel like I'm suffocating." Appeared visibly anxious with wide eyes, restless movements, and pressured speech.

VITAL SIGNS:
- SpO2: 96% on room air (within normal limits)
- RR: 28 breaths/min (tachypneic, baseline 16-18)
- HR: 110 bpm (tachycardic, baseline 72-80)
- BP: 152/92 mmHg (elevated from baseline 128/78)
- Temp: 98.6°F (afebrile)

RESPIRATORY ASSESSMENT:
- Breathing pattern: Rapid, shallow, irregular
- Chest expansion: Symmetric, paradoxical breathing noted
- Lung sounds: Clear bilaterally, no wheezes, rales, or rhonchi
- No use of accessory muscles
- No cyanosis, pallor, or diaphoresis
- No cough or sputum production
- Denies chest pain or pressure

CARDIOVASCULAR:
- Regular tachycardic rhythm
- Peripheral pulses strong and regular
- Capillary refill <2 seconds
- No peripheral edema

ANXIETY ASSESSMENT:
- Patient reports feeling "panicky" and "out of control"
- States recent family stressor (daughter's illness)
- History of anxiety disorder, currently prescribed sertraline 50mg daily
- Denies suicidal ideation or hallucinations
- Oriented x4 (person, place, time, situation)
- Appropriate affect aside from anxiety
- Reports previous panic attacks with similar presentation
- Last panic attack approximately 2 months ago

Patient denies:
- Chest pain or pressure
- Dizziness or syncope
- Nausea or vomiting
- Recent trauma or injury
- New medications or allergies
- Fever or signs of infection
```

**Action:**
```
1645-1650: IMMEDIATE INTERVENTIONS:
1. Remained with patient, provided calm, reassuring presence
2. Moved patient to quiet area, assisted to seated position in comfortable chair
3. Spoke in calm, slow, reassuring tone
4. Validated patient's feelings: "I understand you're feeling frightened. I'm here to help you."

1650-1655: BREATHING RETRAINING:
5. Instructed patient on controlled breathing technique (4-7-8 method):
   - Breathe in through nose for 4 counts
   - Hold breath for 7 counts
   - Exhale slowly through mouth for 8 counts
6. Demonstrated breathing technique, coached patient through 3 cycles
7. Encouraged patient to place one hand on chest, one on abdomen for diaphragmatic awareness
8. Guided patient to focus on slow, deep breaths from diaphragm

1655: GROUNDING TECHNIQUES:
9. Implemented 5-4-3-2-1 grounding technique:
   - Name 5 things you can see
   - Name 4 things you can touch
   - Name 3 things you can hear
   - Name 2 things you can smell
   - Name 1 thing you can taste
10. Encouraged patient to describe surroundings in detail

1655-1700: SAFETY & MONITORING:
11. Continued pulse oximetry monitoring - remained 95-96%
12. Monitored vital signs q5min during episode
13. Assessed for signs of respiratory distress or medical emergency (none found)
14. Maintained close observation for safety

1700: EDUCATION & SUPPORT:
15. Educated patient about anxiety/panic attack physiology:
    - Explained hyperventilation and its effects
    - Reassured that SpO2 normal, breathing adequate despite feeling
    - Normalized experience: "What you're experiencing is frightening but not dangerous"
16. Discussed triggers: explored recent stressors (daughter's illness mentioned)
17. Reviewed coping strategies patient has used successfully in past

1702: MEDICATION CONSIDERATION:
18. Reviewed patient's medication administration record
19. Confirmed patient took scheduled sertraline 50mg PO this morning at 0800
20. Verified PRN anxiolytic available: lorazepam 0.5mg PO PRN anxiety (last dose 3 days ago)
21. Discussed PRN medication option with patient
22. Patient preferred to try non-pharmacological interventions first
23. Documented patient's preference and agreement to reassess

1705: ENVIRONMENTAL MODIFICATIONS:
24. Dimmed room lights
25. Ensured quiet environment, minimized stimulation
26. Provided cool washcloth for forehead
27. Offered water and encouraged small sips
28. Ensured call light within easy reach

1705-1715: CONTINUED SUPPORT:
29. Remained at bedside, continued coaching through breathing exercises
30. Facilitated discussion about coping mechanisms
31. Encouraged patient to verbalize feelings and concerns
32. Active listening, therapeutic communication techniques employed
33. Contacted family (daughter) per patient request for additional support
```

**Response:**
```
1720: COMPREHENSIVE REASSESSMENT (35 minutes post-intervention):

VITAL SIGNS - NORMALIZED:
- SpO2: 97% on room air (stable, improved from 96%)
- RR: 16 breaths/min (returned to baseline, decreased from 28)
- HR: 78 bpm (returned to baseline, decreased from 110)
- BP: 132/80 mmHg (improved from 152/92)

RESPIRATORY STATUS:
- Breathing pattern: Regular, even, appropriate depth
- No tachypnea or dyspnea observed
- Patient breathing in sync with coaching (4-7-8 technique)
- Demonstrates proper diaphragmatic breathing technique independently
- Lung sounds remain clear bilaterally
- No signs of respiratory distress

ANXIETY ASSESSMENT:
- Patient appears visibly calmer
- Facial expression relaxed, no furrowed brow
- Body posture: Relaxed, seated comfortably, no longer pacing
- Hands resting calmly, no wringing or fidgeting
- Speech: Calm pace, appropriate volume, no pressured quality
- Eye contact: Appropriate and sustained
- States "I feel so much better now. Thank you for staying with me."
- Patient able to identify that episode was panic attack, not medical emergency
- Reports feeling "back in control" and "grounded"

BEHAVIORAL OBSERVATIONS:
- No longer pacing or demonstrating restless behavior
- Sitting quietly, reading magazine
- Smiling, engaging in conversation appropriately
- Demonstrates normal affect
- Oriented x4, thought process organized and coherent

PATIENT EDUCATION OUTCOMES:
Patient able to:
✓ Demonstrate 4-7-8 breathing technique independently and correctly
✓ Verbalize understanding of panic attack symptoms vs. medical emergency
✓ Identify personal anxiety triggers (family stress)
✓ Recall grounding techniques taught during episode
✓ Explain when to request PRN medication vs. using coping strategies
✓ List warning signs requiring nurse notification (chest pain, true dyspnea, altered mental status)

COPING STRATEGY EFFECTIVENESS:
- Patient successfully self-soothed using breathing technique when mild anxiety recurred at 1715
- Utilized grounding technique independently
- Expressed confidence in ability to manage future anxiety episodes
- Verbalized appreciation for non-pharmacological approach
- States will continue breathing exercises as needed

SAFETY:
- No PRN anxiolytic medication required
- Patient remained safe throughout episode
- No falls, injuries, or adverse events
- Call light within reach, patient aware to call if anxiety returns
- Bed in low position, non-slip socks on

FAMILY SUPPORT:
- Daughter contacted per patient request
- Spoke with patient via phone, provided emotional support
- Plans to visit this evening
- Patient states feeling reassured after conversation

DOCUMENTATION & FOLLOW-UP:
- Episode documented in chart with full assessment, interventions, and outcomes
- Provider notified of anxiety episode and effective management with non-pharmacological interventions
- Plan to monitor patient q2h for remainder of shift
- PRN lorazepam available if needed, patient aware
- Reinforced that patient should request medication if coping strategies insufficient
- Patient verbalized understanding and agreement with plan

IMMEDIATE PLAN:
1. Continue to monitor patient q2h for signs of recurring anxiety
2. Check in with patient after family visit to assess emotional status
3. Reinforce breathing and grounding techniques as needed
4. Ensure patient has quiet, calm environment for evening
5. Encourage patient to use call light if anxiety symptoms return
6. Consider referral to social work or chaplain services for additional support regarding family stressor
7. Recommend discussing anxiety management with provider during rounds tomorrow
8. Document patient's preferred coping strategies in care plan for nursing staff continuity

OUTCOME:
Intervention highly effective. Patient successfully returned to baseline emotional and physiological status using non-pharmacological interventions. Patient equipped with coping tools for future anxiety episodes. No adverse events. Will continue monitoring and supportive care.
```

---

## 5. Epic: Shift Assessment

### Input Placeholder:
```
🩺 Neuro: Alert, oriented x4, PERRLA.
💓 CV: HR 80, regular rhythm, no edema.
🌬 Resp: Lungs clear, RR 18.
🍽 GI: Abdomen soft, non-tender, active bowel sounds.
🚻 GU: Voiding without difficulty.
🦵 Skin: Intact, warm, dry.
🛏 Mobility: Ambulates independently.
🗓 Summary: No acute changes this shift.
```

### Expected AI Output:

**Complete Shift Assessment - Day Shift (0700-1500)**
**Date: 11/04/2025 | Unit: Med-Surg 4th Floor | RN: [Name]**

```
PATIENT IDENTIFICATION:
Location: Room 412 Bed A
Shift: Day (0700-1500)

NEUROLOGICAL:
Alert and oriented x4 (person, place, time, situation). Appropriate responses to questions. PERRLA (Pupils Equal, Round, Reactive to Light and Accommodation) - bilateral 3mm, brisk reaction. Cranial nerves II-XII grossly intact. Follows commands appropriately and consistently. Motor strength 5/5 in all extremities (upper and lower bilateral). Sensation intact to light touch all extremities. Gait steady and balanced. No dizziness, headache, or visual changes reported. Glasgow Coma Scale: 15 (E4, V5, M6). No focal neurological deficits noted.

CARDIOVASCULAR:
Heart rate 80 bpm, regular rate and rhythm. S1 and S2 heart sounds present, no S3 or S4. No murmurs, rubs, or gallops auscultated. Apical pulse palpable at 5th intercostal space, midclavicular line. Radial pulses 2+ bilateral, pedal pulses 2+ bilateral. Capillary refill <2 seconds all extremities. No peripheral edema in upper or lower extremities (0/4 bilaterally). No jugular venous distension. Skin warm to touch, pink, good perfusion. No chest pain, palpitations, or orthostatic symptoms reported. Telemetry monitoring: Normal sinus rhythm, no ectopy noted.

RESPIRATORY:
Respiratory rate 18 breaths/min, even and unlabored. Lung sounds clear to auscultation bilaterally in all lobes (anterior, posterior, lateral). No wheezes, rales, rhonchi, or diminished sounds. Symmetric chest expansion. Breathing pattern regular and appropriate. No use of accessory muscles. No cough, shortness of breath, or dyspnea reported. SpO2 97% on room air. No supplemental oxygen required. Incentive spirometry 1500mL (goal met). No history of respiratory distress this shift.

GASTROINTESTINAL/NUTRITION:
Abdomen soft, non-tender, non-distended to palpation in all four quadrants. Bowel sounds active x4 quadrants, normoactive. No rigidity, guarding, or rebound tenderness. Last bowel movement yesterday evening (formed, brown, normal consistency). No nausea, vomiting, diarrhea, or constipation reported. Tolerating regular diet without difficulty. Appetite good - consumed 75% of breakfast, 80% of lunch. Oral intake: 480mL this shift (juice 240mL, water 240mL). No dysphagia or difficulty swallowing. No abdominal pain or cramping. Denies heartburn or reflux.

GENITOURINARY:
Voiding spontaneously without difficulty or assistance. Urine clear, yellow, no foul odor. Output: 850mL this shift (adequate for intake). No dysuria, urgency, frequency, or hesitancy reported. No hematuria or pyuria observed. Continent of urine. No suprapubic tenderness or bladder distention. No signs of urinary retention. Denies burning or discomfort with urination.

INTEGUMENTARY (SKIN):
Skin intact throughout, no breakdown or pressure injuries noted. Braden Scale: 20 (Low Risk). Skin warm, dry to touch, good skin turgor. Color pink, appropriate for ethnicity. No rashes, lesions, or unusual marks. Surgical incision right hip: Clean, dry, intact. Staples in place and well-approximated. No erythema, drainage, edema, or signs of infection noted at incision site. Mild surrounding bruising (expected post-operative finding, improving from yesterday). No redness, swelling, or warmth. Capillary refill <2 seconds, peripheral perfusion adequate.

MUSCULOSKELETAL/MOBILITY:
Ambulates independently without assistive devices for short distances (<50 feet). Uses walker for longer distances and hallway ambulation per post-operative protocol. Ambulated 50 feet in hallway with walker and standby assist at 0900. Gait steady, no loss of balance. Demonstrates proper weight-bearing technique. ROM limited in right hip per post-operative restrictions (no hip flexion >90 degrees, no adduction past midline, no internal rotation). Follows hip precautions consistently. Upper extremity strength 5/5 bilateral. Transfers bed to chair independently. Pain 3/10 with movement, relieved with rest. No joint swelling or warmth. Steady gait, no ataxia or shuffling.

PAIN ASSESSMENT:
Current pain level: 2/10 at rest, 3/10 with movement
Location: Right hip surgical site
Quality: Aching, dull
Frequency: Intermittent, worsens with activity
Alleviating factors: Rest, ice, medication
Aggravating factors: Movement, ambulation, transfers
Pain management: Oxycodone 5mg PO PRN effective, last dose at 0900
Acceptable pain level per patient: <4/10

SAFETY ASSESSMENT:
Fall Risk (Morse Fall Scale): 45 points - Moderate Risk
Interventions implemented:
✓ Bed in lowest position
✓ Call light within reach and patient demonstrates proper use
✓ Non-slip socks applied
✓ Bed alarm activated during sleeping hours
✓ Standby assist for ambulation
✓ Hourly rounding schedule maintained
✓ Environment free of clutter and tripping hazards
✓ Adequate lighting
✓ Bathroom equipped with grab bars
Patient educated on fall prevention strategies and demonstrates understanding.

VITAL SIGNS TRENDING:
0700: BP 132/78, HR 76, RR 18, Temp 98.4°F (36.9°C), SpO2 97% RA, Pain 2/10
1200: BP 128/74, HR 78, RR 16, Temp 98.6°F (37°C), SpO2 98% RA, Pain 3/10

SHIFT SUMMARY:
Patient stable throughout day shift. No acute changes in condition. All vital signs within normal limits and stable. Patient participating actively in post-operative recovery plan. Tolerating oral diet and fluids well. Pain controlled with current medication regimen. Ambulation progressing as expected for post-op day 3 from right total hip arthroplasty. No complications noted. Patient cooperative with care and demonstrates understanding of discharge planning. Family involved and supportive. Continue current plan of care.
```

---

## 6. Epic: Medication Administration Record (MAR)

### Input Placeholder:
```
💊 Medication: Metoprolol 25 mg PO
🕐 Time Given: 0800
👩‍⚕️ Route: Oral
⚙️ Purpose: BP control
📈 Response: BP decreased from 152/90 to 130/80, HR stable at 78.
```

### Expected AI Output:

**Medication Administration Documentation - Day Shift**
**Date: 11/04/2025 | Patient Room: 412A**

```
MEDICATION #1:
Time: 0800
Medication: Metoprolol tartrate 25 mg PO
Route: Oral
Site: N/A (oral medication)
Purpose/Indication: Blood pressure control, heart rate management

PRE-ADMINISTRATION ASSESSMENT (0755):
- Vital Signs: BP 152/90 mmHg, HR 88 bpm, RR 16 breaths/min
- Apical pulse: 88 bpm, regular rhythm
- Patient alert and oriented x3
- No dizziness or lightheadedness reported
- Patient sitting upright in bed

VERIFICATION:
✓ Medication order verified in MAR
✓ Right patient (2 identifiers: name, DOB)
✓ Right medication (metoprolol tartrate 25mg)
✓ Right dose (25mg)
✓ Right route (PO)
✓ Right time (scheduled 0800)
✓ Allergy check: No known drug allergies
✓ Medication not contraindicated (HR >60, SBP >100)

ADMINISTRATION:
Given with 4oz water. Patient swallowed without difficulty. No coughing or choking. Observed patient take medication.

POST-ADMINISTRATION ASSESSMENT (0900 - 60 minutes post):
- Vital Signs: BP 130/80 mmHg (decreased 22/10 mmHg), HR 78 bpm (decreased 10 bpm), RR 16 breaths/min
- Apical pulse: 78 bpm, regular rhythm, no ectopy
- Blood pressure reduction appropriate and within therapeutic range
- Patient denies dizziness, lightheadedness, or weakness
- No signs of hypotension or bradycardia
- Patient tolerating medication well

PATIENT RESPONSE:
Medication effective. Blood pressure decreased from 152/90 to 130/80 mmHg. Heart rate stable at 78 bpm. Patient reports feeling well, no adverse effects. No complaints of fatigue, dizziness, or other side effects. Therapeutic goal achieved.

ADVERSE REACTIONS: None noted

---

MEDICATION #2:
Time: 0800
Medication: Metformin 500 mg PO
Route: Oral
Site: N/A (oral medication)
Purpose/Indication: Type 2 diabetes management, glycemic control

PRE-ADMINISTRATION ASSESSMENT (0755):
- Blood glucose: 142 mg/dL (acceptable for administration)
- Patient alert and oriented x3
- Breakfast tray present at bedside
- No nausea or GI upset reported
- Kidney function within normal limits per last BMP (Cr 0.9 mg/dL)

VERIFICATION:
✓ Medication order verified in MAR
✓ Right patient (2 identifiers: name, DOB)
✓ Right medication (metformin 500mg)
✓ Right dose (500mg)
✓ Right route (PO)
✓ Right time (scheduled 0800 with breakfast)
✓ Allergy check: No known drug allergies
✓ Blood glucose >70 mg/dL (safe to administer)

ADMINISTRATION:
Given with food (breakfast). Patient swallowed with orange juice without difficulty. Encouraged patient to eat breakfast to prevent GI upset.

PATIENT EDUCATION:
- Reinforced importance of taking with food to minimize GI side effects
- Reminded patient to report any nausea, vomiting, or abdominal discomfort
- Discussed signs of hypoglycemia and hyperglycemia
- Patient verbalized understanding

POST-ADMINISTRATION ASSESSMENT (1 hour post):
- No GI upset, nausea, or discomfort reported
- Patient consumed 75% of breakfast
- No signs of hypoglycemia (blood glucose recheck at 1100: 118 mg/dL)

PATIENT RESPONSE:
Medication tolerated well. No GI upset or adverse effects. Patient ate breakfast appropriately. Blood glucose trending toward target range.

ADVERSE REACTIONS: None noted

---

MEDICATION #3:
Time: 0900
Medication: Oxycodone 5 mg PO
Route: Oral
Site: N/A (oral medication)
Purpose/Indication: Pain management (PRN for surgical pain >4/10)

PRE-ADMINISTRATION ASSESSMENT (0855):
- Pain level: 6/10 at surgical site (right hip)
- Pain described as aching, worse with movement
- Vital Signs: BP 128/74, HR 82, RR 16, SpO2 98% RA
- Respiratory rate adequate (>12 breaths/min)
- Patient alert, no sedation (RASS 0)
- Last oxycodone dose: 6 hours ago (0300)

VERIFICATION:
✓ PRN order verified: Oxycodone 5mg PO q4h PRN pain >4/10
✓ Right patient (2 identifiers)
✓ Right medication (oxycodone 5mg)
✓ Right dose (5mg)
✓ Right route (PO)
✓ Right time (q4h interval met, 6 hours since last dose)
✓ Allergy check: No known drug allergies
✓ Respiratory rate >12 (safe to administer opioid)
✓ No signs of excessive sedation

ADMINISTRATION:
Given with 4oz water at patient's request for pain. Patient swallowed without difficulty.

PATIENT EDUCATION:
- Advised patient about potential side effects: drowsiness, dizziness, nausea, constipation
- Instructed to use call light before getting out of bed
- Reminded not to drive or operate machinery
- Encouraged to request medication before pain becomes severe
- Discussed importance of pain control for recovery

POST-ADMINISTRATION ASSESSMENT (0930 - 30 minutes post):
- Pain level: 3/10 (decreased from 6/10)
- Vital Signs: BP 124/72, HR 78, RR 14, SpO2 99% RA
- Respiratory status: No respiratory depression (RR 14, adequate depth)
- Sedation level: Minimal (RASS 0, alert and conversant)
- Facial expression relaxed, no grimacing
- Patient able to turn in bed with minimal discomfort

PATIENT RESPONSE:
Medication highly effective. Pain decreased from 6/10 to 3/10 within 30 minutes. Patient reports adequate pain relief and satisfaction with pain management. No adverse effects noted. Respiratory status stable. Patient resting comfortably.

ADVERSE REACTIONS: None noted. No nausea, vomiting, pruritus, or excessive sedation.

PAIN REASSESSMENT PLAN: Continue q4h PRN pain assessments and offer medication as needed. Encourage patient to request medication before pain level exceeds 5/10.

---

MEDICATION #4:
Time: 1000
Medication: Enoxaparin (Lovenox) 40 mg subcutaneous
Route: Subcutaneous injection
Site: Right abdomen
Purpose/Indication: DVT prophylaxis post-operative

PRE-ADMINISTRATION ASSESSMENT (0955):
- No signs of active bleeding
- No hematoma at previous injection sites
- Platelet count: 245,000/μL (within normal limits)
- No contraindications to anticoagulation
- Site assessment: Right abdomen skin intact, no bruising

VERIFICATION:
✓ Medication order verified: Enoxaparin 40mg SubQ daily
✓ Right patient (2 identifiers)
✓ Right medication (enoxaparin 40mg pre-filled syringe)
✓ Right dose (40mg)
✓ Right route (SubQ)
✓ Right time (scheduled 1000)
✓ Allergy check: No known drug allergies
✓ No bleeding precautions in place
✓ Medication not expired, stored properly

ADMINISTRATION TECHNIQUE:
1. Performed hand hygiene
2. Identified injection site: right abdomen, 2 inches from umbilicus
3. Cleaned site with alcohol swab, allowed to dry
4. Pinched skin fold, inserted needle at 90-degree angle
5. Injected medication slowly
6. Withdrew needle, applied gentle pressure (no massage)
7. Disposed of needle in sharps container
8. Documented injection site in MAR rotation chart

PATIENT EDUCATION:
- Explained purpose: prevent blood clots after surgery
- Advised to report any signs of bleeding: blood in stool/urine, nosebleeds, unusual bruising
- Discussed injection site rotation to prevent skin irritation
- Patient verbalized understanding

POST-ADMINISTRATION ASSESSMENT (15 minutes post):
- Injection site: No bleeding, bruising, or hematoma formation
- Skin intact, slight redness (expected, resolving)
- No signs of allergic reaction
- Patient denies discomfort at injection site

PATIENT RESPONSE:
Medication administered successfully. Injection well-tolerated. No immediate adverse effects. Site assessment within normal limits.

ADVERSE REACTIONS: None noted

---

MEDICATION #5:
Time: 1200
Medication: Docusate sodium (Colace) 100 mg PO
Route: Oral
Site: N/A (oral medication)
Purpose/Indication: Stool softener, prevent constipation related to opioid use

PRE-ADMINISTRATION ASSESSMENT (1155):
- Last bowel movement: Yesterday evening
- No abdominal pain, nausea, or cramping
- Abdomen soft, non-distended
- Active bowel sounds present
- Patient on opioid pain medication (constipation risk)

VERIFICATION:
✓ Medication order verified: Docusate 100mg PO BID
✓ Right patient (2 identifiers)
✓ Right medication (docusate sodium 100mg)
✓ Right dose (100mg)
✓ Right route (PO)
✓ Right time (scheduled 1200)
✓ Allergy check: No known drug allergies
✓ No bowel obstruction symptoms

ADMINISTRATION:
Given with 8oz water (full glass). Patient swallowed without difficulty.

PATIENT EDUCATION:
- Explained purpose: prevent constipation from pain medication
- Encouraged adequate fluid intake (2000mL/day minimum)
- Advised to increase dietary fiber when able
- Instructed to report if no bowel movement within 3 days
- Discussed importance of mobility for bowel function
- Patient verbalized understanding

PATIENT RESPONSE:
Medication taken as ordered. Patient tolerating well. No adverse effects.

ADVERSE REACTIONS: None noted

---

SHIFT SUMMARY:
All scheduled and PRN medications administered as ordered. No medication errors. All medications tolerated well with no adverse reactions. Patient demonstrates understanding of medication purposes and side effects. Pain adequately controlled. Vital signs stable. DVT prophylaxis maintained. Bowel regimen in place to prevent opioid-related constipation. Continue current medication regimen per orders.
```

---

## 7. Epic: Intake & Output (I&O)

### Input Placeholder:
```
💧 Intake: 1200 mL PO fluids, 500 mL IV NS.
🚽 Output: 1600 mL urine, clear yellow.
⚖️ Balance: +100 mL over 12 hours.
📊 Notes: Adequate hydration, voiding without difficulty.
```

### Expected AI Output:

**Intake & Output Record - Day Shift (0700-1500)**
**Date: 11/04/2025 | Patient: Room 412A | 8-Hour Shift Total**

```
═══════════════════════════════════════════════════════════════
INTAKE SOURCES
═══════════════════════════════════════════════════════════════

ORAL INTAKE:
0800 - Breakfast fluids (coffee 180mL, orange juice 120mL) = 300mL
0900 - Water = 120mL
1100 - Water = 240mL
1200 - Lunch fluids (iced tea 180mL, water 120mL) = 300mL
1400 - Water = 240mL
─────────────────────────────────────────────────────────────
TOTAL ORAL INTAKE: 1200mL

INTRAVENOUS INTAKE:
0700-1500 - 0.9% Normal Saline at 63 mL/hr x 8 hours = 504mL
─────────────────────────────────────────────────────────────
TOTAL IV INTAKE: 504mL

IV ACCESS:
Site: Right forearm peripheral IV, 20G
Status: Patent, no signs of infiltration or phlebitis
Insertion date: 11/02/2025
Site assessment: No redness, swelling, or tenderness

ENTERAL INTAKE:
None this shift
─────────────────────────────────────────────────────────────
TOTAL ENTERAL INTAKE: 0mL

PARENTERAL NUTRITION (TPN/PPN):
None this shift
─────────────────────────────────────────────────────────────
TOTAL PARENTERAL INTAKE: 0mL

BLOOD PRODUCTS:
None this shift
─────────────────────────────────────────────────────────────
TOTAL BLOOD PRODUCTS: 0mL

OTHER INTAKE (medications with significant fluid):
None requiring documentation
─────────────────────────────────────────────────────────────
TOTAL OTHER INTAKE: 0mL

═══════════════════════════════════════════════════════════════
TOTAL INTAKE (ALL SOURCES): 1704mL
═══════════════════════════════════════════════════════════════


═══════════════════════════════════════════════════════════════
OUTPUT SOURCES
═══════════════════════════════════════════════════════════════

URINE OUTPUT:
0800 - Voided 250mL (clear, yellow, no odor)
1000 - Voided 320mL (clear, yellow, no odor)
1200 - Voided 280mL (clear, yellow, no odor)
1400 - Voided 310mL (clear, yellow, no odor)
1445 - Voided 240mL (clear, yellow, no odor)
─────────────────────────────────────────────────────────────
TOTAL URINE OUTPUT: 1400mL

Urine Characteristics:
- Color: Clear yellow (normal)
- Clarity: Clear, no sediment
- Odor: None/normal
- No hematuria, pyuria, or dysuria noted
- Continent, voiding spontaneously without difficulty

STOOL OUTPUT:
1030 - Formed brown stool (estimated 200mL equivalent)
─────────────────────────────────────────────────────────────
TOTAL STOOL OUTPUT: 200mL

Stool Characteristics:
- Consistency: Formed
- Color: Brown (normal)
- No blood, mucus, or abnormal findings
- No diarrhea or constipation

EMESIS/VOMITUS:
None this shift
─────────────────────────────────────────────────────────────
TOTAL EMESIS: 0mL

NASOGASTRIC (NG) TUBE:
None this shift (no NG tube in place)
─────────────────────────────────────────────────────────────
TOTAL NG OUTPUT: 0mL

SURGICAL DRAINS:
Site: Right hip (Jackson-Pratt drain)
0800 - Emptied: 25mL serosanguineous drainage
1400 - Emptied: 30mL serosanguineous drainage
─────────────────────────────────────────────────────────────
TOTAL DRAIN OUTPUT: 55mL

Drain Characteristics:
- Type: Jackson-Pratt (JP) drain, right hip surgical site
- Color: Serosanguineous (pink-tinged, blood and serous fluid)
- Consistency: Thin, watery
- Odor: None
- Drain patent and functioning properly
- Insertion site: Clean, dry, intact, no signs of infection
- Output decreasing appropriately (expected post-op trend)

WOUND OUTPUT:
None - Surgical dressing clean, dry, intact
─────────────────────────────────────────────────────────────
TOTAL WOUND OUTPUT: 0mL

CHEST TUBE:
None this shift (no chest tube in place)
─────────────────────────────────────────────────────────────
TOTAL CHEST TUBE OUTPUT: 0mL

OTHER OUTPUT:
None this shift
─────────────────────────────────────────────────────────────
TOTAL OTHER OUTPUT: 0mL

═══════════════════════════════════════════════════════════════
TOTAL OUTPUT (ALL SOURCES): 1655mL
═══════════════════════════════════════════════════════════════


═══════════════════════════════════════════════════════════════
NET FLUID BALANCE CALCULATION
═══════════════════════════════════════════════════════════════

Total Intake:    1704mL
Total Output:  - 1655mL
─────────────────────────────────────────────────────────────
NET BALANCE:    +49mL (POSITIVE)

INTERPRETATION:
Net positive balance of +49mL over 8-hour day shift is within acceptable range for post-operative patient. Indicates appropriate fluid homeostasis. Patient adequately hydrated. Urine output adequate (>30mL/hr average = 175mL/hr this shift). No signs of fluid overload or dehydration.

═══════════════════════════════════════════════════════════════


═══════════════════════════════════════════════════════════════
CLINICAL ASSESSMENT & NOTES
═══════════════════════════════════════════════════════════════

HYDRATION STATUS:
✓ Adequate oral fluid intake (1200mL over 8 hours)
✓ IV fluids infusing as ordered (NS 63mL/hr)
✓ Urine output within normal limits (>0.5mL/kg/hr)
✓ Urine color and clarity normal
✓ Patient denies thirst, dry mouth, or dizziness
✓ Mucous membranes moist
✓ Skin turgor good
✓ No signs of dehydration

RENAL FUNCTION:
✓ Adequate urine output (average 175mL/hr - exceeds minimum 30mL/hr)
✓ Clear yellow urine indicates good concentration ability
✓ No dysuria, frequency, or urgency
✓ Voiding spontaneously without difficulty
✓ No signs of urinary retention or bladder distention
✓ Last BMP (11/03/2025): BUN 18, Cr 0.9 - within normal limits

FLUID OVERLOAD ASSESSMENT:
✓ No peripheral edema (0/4 bilateral)
✓ No jugular venous distension
✓ Lungs clear bilaterally
✓ No dyspnea or orthopnea
✓ No sudden weight gain
✓ Net positive balance minimal (+49mL) - not concerning

DRAIN FUNCTION (Right Hip JP):
✓ Drain patent and functioning properly
✓ Output decreasing trend (55mL this shift vs. 95mL night shift)
✓ Serosanguineous drainage expected post-op day 3
✓ No purulent, foul-smelling, or excessive drainage
✓ Insertion site clean without signs of infection
✓ Consider drain removal per provider if output <30mL/24hrs

BOWEL FUNCTION:
✓ Bowel movement this shift (formed, brown, normal)
✓ Abdomen soft, non-tender
✓ Active bowel sounds present
✓ Tolerating regular diet
✓ No nausea, vomiting, or diarrhea
✓ Bowel regimen effective (docusate BID)

PATIENT EDUCATION PROVIDED:
- Encouraged continued oral fluid intake (goal 2000mL/day)
- Explained importance of hydration for healing and preventing complications
- Instructed to report decreased urine output, dark urine, or inability to void
- Discussed signs of dehydration and fluid overload
- Patient verbalized understanding

═══════════════════════════════════════════════════════════════
24-HOUR INTAKE & OUTPUT TREND (Rolling Total)
═══════════════════════════════════════════════════════════════

Night Shift (2300-0700):  Intake 1450mL | Output 1380mL | Balance +70mL
Day Shift (0700-1500):    Intake 1704mL | Output 1655mL | Balance +49mL
Evening Shift (1500-2300): [Pending completion]

CUMULATIVE 16-HOUR BALANCE: +119mL (positive - acceptable range)

═══════════════════════════════════════════════════════════════
PLAN & RECOMMENDATIONS
═══════════════════════════════════════════════════════════════

1. Continue IV NS at 63mL/hr as ordered
2. Encourage oral fluid intake minimum 1500mL per shift
3. Continue accurate I&O monitoring q shift
4. Monitor drain output - notify provider if increase or change in character
5. Reassess hydration status q4h
6. Notify provider if:
   - Urine output <30mL/hr for 2 consecutive hours
   - Net positive balance >1000mL/24hrs
   - Signs of fluid overload develop
   - Drain output increases or becomes purulent
7. Continue voiding spontaneously - no catheter needed
8. Maintain current bowel regimen
9. Consider discontinuing IV fluids if oral intake remains adequate and patient meets discharge criteria

═══════════════════════════════════════════════════════════════

NEXT SHIFT REPORT:
Patient maintaining appropriate fluid balance. Adequate oral and IV intake. Urine output excellent. Surgical drain output minimal and decreasing. No concerns with fluid status. Continue current plan.
```

---

## Summary Table: Template Placeholders vs. AI Output

| Template | Placeholder (Input Field) | AI Output Length | Sections |
|----------|--------------------------|------------------|----------|
| **SOAP** | 4 emoji lines (concise) | 4 detailed paragraphs | S, O, A, P |
| **SBAR** | 4 emoji lines (concise) | 4 comprehensive sections | S, B, A, R |
| **PIE** | 3 emoji lines (concise) | 3 in-depth narratives | P, I, E |
| **DAR** | 3 emoji lines (concise) | 3 detailed sections | D, A, R |
| **Shift Assessment** | 8 emoji bullet points | Full head-to-toe assessment | Neuro, CV, Resp, GI, GU, Skin, Mobility, Summary |
| **MAR** | 5 emoji fields | Complete medication documentation | Med, Time, Route, Purpose, Response, Pre/Post assessments |
| **I&O** | 4 emoji summaries | Comprehensive intake/output with calculations | Intake sources, Output sources, Balance, Clinical notes |
| **Wound Care** | 5 emoji fields | Full wound assessment and care plan | Location, Size, Description, Treatment, Next change |
| **Safety Checklist** | 6 emoji checks | Complete safety documentation | Fall risk, Call light, Socks, Alarms, Environment, Education |
| **Med-Surg** | 6 emoji fields | Unit-specific comprehensive note | Diagnosis, Vitals, IV, Pain, Mobility, Plan |
| **ICU** | 6 emoji fields | Critical care documentation | Neuro, CV, Resp, I&O, Labs, Plan with drips/vents |
| **NICU** | 6 emoji fields | Neonatal care documentation | Age/Weight, Resp support, CV, Feeding, I&O, Plan |
| **Mother-Baby** | 6 emoji fields | Maternal & newborn documentation | Mother assessment, Newborn assessment, Vitals, Feeding, Education |

---

## Key Differences: Placeholder vs. Output

### Placeholders (What User Sees/Types):
- ✨ **Emojis included** for visual guidance
- 📝 **Concise examples** to show structure
- 🎯 **Quick reference** for what to include
- 💡 **Friendly and approachable**

### AI Output (What Appears in Draft Preview):
- 📋 **NO emojis** - professional clinical documentation
- 📊 **Comprehensive and detailed** content
- 🏥 **Epic-compliant** formatting
- ⚕️ **Clinically accurate** with proper medical terminology
- ✅ **Meets regulatory standards** (HIPAA, Joint Commission)
- 📈 **Includes all required elements** for billing and legal documentation

---

## Implementation Note

Your app's current structure is **perfect**:

1. **Input phase**: Users see emoji-based placeholders ([templatePlaceholders.ts](src/lib/templatePlaceholders.ts))
2. **AI processing**: [generate-note.ts](netlify/functions/generate-note.ts) creates professional plain-text output
3. **Draft preview**: [MVPDraftScreen.tsx](src/components/MVPDraftScreen.tsx) displays each section in separate cards with preserved formatting

✅ Everything is working as designed!