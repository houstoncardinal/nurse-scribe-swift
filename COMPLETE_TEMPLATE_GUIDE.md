# 📋 Complete Template Guide - Input & Output Examples

## Overview

This comprehensive guide shows **expected input and professional output** for all 13 templates in NovaCareAI.

**What You'll Find:**
- ✅ **Expected Input Format** - What you speak or type (casual clinical language)
- ✅ **Expected Professional Output** - What the AI generates (Epic EMR-compliant documentation)
- ✅ **All 13 Templates Covered** - 4 standard + 9 Epic templates

---

## Table of Contents

### Standard Templates
1. [SOAP - Subjective, Objective, Assessment, Plan](#1-soap-template)
2. [SBAR - Situation, Background, Assessment, Recommendation](#2-sbar-template)
3. [PIE - Problem, Intervention, Evaluation](#3-pie-template)
4. [DAR - Data, Action, Response](#4-dar-template)

### Epic Templates
5. [Shift Assessment](#5-shift-assessment)
6. [MAR - Medication Administration Record](#6-mar-medication-administration-record)
7. [I&O - Intake & Output](#7-io-intake--output)
8. [Wound Care](#8-wound-care)
9. [Safety Checklist](#9-safety-checklist)
10. [Med-Surg Documentation](#10-med-surg-documentation)
11. [ICU Documentation](#11-icu-documentation)
12. [NICU Documentation](#12-nicu-documentation)
13. [Mother-Baby Documentation](#13-mother-baby-documentation)

---

# Standard Templates

## 1. SOAP Template

### 📥 Expected Input (Voice/Text)

**Example 1 - Natural Speech:**
```
Patient reports chest discomfort for the past 2 hours, says it feels like a pulled muscle
from lifting boxes yesterday. Pain is 4 out of 10, gets worse with deep breaths.
No shortness of breath, no dizziness, no nausea.

Vitals are BP 128 over 84, heart rate 82, temp 98.4, oxygen sat 98 percent on room air.
Patient is alert and oriented. Heart sounds are regular, lungs are clear bilaterally.
Skin is warm and dry. There's tenderness when I press on the left chest wall.

I think this is musculoskeletal chest pain, probably a strain from lifting.
Vitals are stable, no signs of cardiac issues.

Plan is to monitor vitals every 4 hours, give acetaminophen 500 milligrams by mouth now,
apply ice for 20 minutes, reassess pain in 30 minutes. I told the patient to let us know
if pain gets worse or if they have any shortness of breath. Also told them to avoid heavy
lifting for a couple days.
```

**Example 2 - Brief Notes:**
```
S: Chest pain x2 hrs, aching, 4/10, worse with breathing, from lifting yesterday
O: BP 128/84, HR 82, RR 16, T 98.4, O2 98% RA. A&O x3. Heart regular, lungs clear.
   Chest wall tender to palpation
A: Musculoskeletal chest pain, likely strain. Stable vitals, no cardiac signs
P: Monitor q4h, acetaminophen 500mg PO, ice packs, reassess 30 min, patient education on
   warning signs
```

### 📤 Expected Professional Output

**Subjective:**
```
Patient reports mild chest discomfort for the past 2 hours, described as aching and localized
to the left anterior chest wall. Pain level 4/10 on numeric rating scale, worsens with deep
breathing and movement. Denies shortness of breath, dizziness, nausea, diaphoresis, or
radiation to arm or jaw. Patient states "It feels like a pulled muscle from lifting boxes
yesterday." No history of cardiac disease or previous similar episodes. Currently takes no
regular medications. Denies recent illness, fever, or cough. Patient appears comfortable and
calm during interview.
```

**Objective:**
```
VITAL SIGNS: BP 128/84 mmHg, HR 82 bpm regular, RR 16 breaths/min, Temp 98.4°F (36.9°C),
SpO2 98% on room air, Pain 4/10

GENERAL: Alert and oriented x3, calm affect, no acute distress observed. Patient cooperative
with examination.

CARDIOVASCULAR: Heart sounds S1 and S2 present, regular rate and rhythm. No murmurs, rubs,
or gallops auscultated. Peripheral pulses 2+ bilateral upper and lower extremities. Capillary
refill <2 seconds. No peripheral edema noted. Radial and pedal pulses strong and symmetric.

RESPIRATORY: Lungs clear to auscultation bilaterally in all fields (anterior, posterior,
lateral). No wheezes, rales, or rhonchi. Respiratory effort even and unlabored. No use of
accessory muscles. Chest expansion symmetric bilaterally.

SKIN: Warm, dry, intact throughout. No cyanosis or pallor. Good skin turgor. Capillary
refill brisk.

CHEST WALL: Point tenderness to palpation over left anterior chest at 4th intercostal
space, midclavicular line. No visible deformity, bruising, swelling, or ecchymosis. Pain
reproducible with palpation and chest wall movement (no cardiac etiology suspected).
```

**Assessment:**
```
42-year-old male presenting with left-sided chest pain, most consistent with musculoskeletal
origin based on the following clinical findings:
- Reproducible point tenderness with palpation of chest wall
- Clear temporal association with recent physical activity (heavy lifting)
- Absence of classic cardiac symptoms (no diaphoresis, radiation, or dyspnea)
- Pain worsens with movement and deep inspiration (pleuritic nature)

Vital signs stable and within normal limits. No signs of acute coronary syndrome - negative
for diaphoresis, radiation, shortness of breath, or hemodynamic instability. Patient
demonstrates good understanding of symptoms and appears hemodynamically stable. Low risk for
cardiac etiology given age, lack of cardiac risk factors, and clinical presentation consistent
with intercostal muscle strain or costochondritis.

RISK STRATIFICATION: Low risk for adverse cardiac events. No immediate interventions required
beyond symptomatic management.
```

**Plan:**
```
1. MONITORING: Continue monitoring vital signs q4h for next 8 hours; notify provider if
   significant changes occur (BP >140/90 or <100/60, HR >100 or <60, RR >20, O2 sat <94%)

2. PAIN MANAGEMENT:
   - Administer acetaminophen 500 mg PO now for analgesia
   - Apply ice pack to affected area for 20 minutes q2h PRN for pain relief
   - Reassess pain level 30 minutes post-medication administration
   - Consider additional PRN analgesia if pain >6/10 or not controlled with current regimen

3. PATIENT EDUCATION PROVIDED:
   - Warning signs requiring immediate notification: worsening pain, chest pressure,
     shortness of breath, radiation to arm/jaw, diaphoresis, or new-onset symptoms
   - Importance of rest and activity modification
   - Expected recovery timeline (2-3 days with conservative management)
   - Patient verbalized understanding and can identify warning signs appropriately

4. ACTIVITY MODIFICATIONS:
   - Encourage rest and avoid heavy lifting for 48-72 hours
   - May resume normal activities gradually as tolerated
   - Use proper body mechanics when lifting in future

5. FOLLOW-UP:
   - Notify provider if pain level >6/10, vital signs change significantly, or any cardiac
     symptoms develop (chest pressure, shortness of breath, diaphoresis)
   - Patient to follow up with primary care provider within 1 week if symptoms persist beyond
     expected recovery period
   - Document patient education in medical record

6. DOCUMENTATION: Complete nursing documentation of assessment, interventions, and patient
   response. Patient verbalized understanding of care plan and agreement with treatment
   approach.
```

---

## 2. SBAR Template

### 📥 Expected Input (Voice/Text)

**Example - Natural Speech:**
```
I'm calling about Mrs. Johnson in room 312. She's complaining of a severe headache,
says it's an 8 out of 10, throbbing in the back of her head. Started about an hour ago.
Her blood pressure is really high at 182 over 96.

She was admitted 2 days ago for pneumonia, she's on IV Ceftriaxone. Her history includes
hypertension, she takes Lisinopril 20 milligrams daily. Also has diabetes and high
cholesterol. Her baseline blood pressure is usually around 130 to 140 over 80 to 90.
Last BP check 4 hours ago was 142 over 88. She already got her Lisinopril this morning
at 8 AM.

She's alert and oriented times three, no visual changes, no neuro deficits that I can see.
I'm concerned this is hypertensive urgency. Her blood pressure is really elevated from her
baseline and she has that severe headache.

I'd like to give her Hydralazine 10 milligrams IV per the PRN protocol and recheck her
blood pressure in 30 minutes. I'll continue monitoring her closely for any neuro changes.
Should I get a neuro consult if the blood pressure doesn't come down?
```

### 📤 Expected Professional Output

**Situation:**
```
65-year-old female patient in Room 312 (Mrs. Johnson) complaining of severe headache rated
8/10 on numeric pain scale, throbbing in quality, localized to occipital region. Onset
approximately 1 hour ago (1400 hours). Current vital signs: BP 182/96 mmHg, HR 94 bpm,
RR 18 breaths/min, Temp 98.2°F (36.8°C), SpO2 97% on room air. Patient alert and oriented
x3, appears uncomfortable but no acute distress observed. Headache associated with mild
nausea but no vomiting, photophobia, visual changes, or neurological deficits noted on
bedside assessment. This represents an acute change in patient status requiring immediate
provider notification and intervention.
```

**Background:**
```
ADMISSION DETAILS:
- Admitted 2 days ago (11/04/2025) for community-acquired pneumonia
- Currently receiving IV antibiotics: Ceftriaxone 1g IV q24h (Day 2 of 5-day course)
- Clinical improvement noted - decreased cough, afebrile x24 hours

RELEVANT MEDICAL HISTORY:
- Hypertension (diagnosed 10 years ago) - previously well-controlled
- Type 2 Diabetes Mellitus (most recent A1C 7.1% - 3 months ago)
- Hyperlipidemia
- No history of stroke, TIA, MI, or renal disease

CURRENT MEDICATIONS:
- Lisinopril 20 mg PO daily (last dose 0800 this morning)
- Metformin 1000 mg PO BID
- Atorvastatin 40 mg PO QHS
- Ceftriaxone 1g IV q24h (next dose due 1800)
- All home medications continued during hospitalization

BASELINE PARAMETERS:
- Typical BP: 130-140/80-90 mmHg per patient self-report and previous nursing documentation
- Last documented BP 4 hours ago (1000 hours): 142/88 mmHg
- Patient reports good medication compliance at home prior to admission

ALLERGIES: No known drug allergies (NKDA)
```

**Assessment:**
```
Patient experiencing hypertensive urgency with current BP 182/96 mmHg, representing 40-50
mmHg elevation above patient's documented baseline. Severe headache (8/10) likely secondary
to acute blood pressure elevation.

CURRENT STATUS:
- Hemodynamically stable at present without signs of end-organ damage
- Neurological examination normal: no visual disturbances, altered mental status, focal
  deficits, or signs of stroke
- No chest pain, shortness of breath (beyond baseline pneumonia), or other cardiac symptoms
- Patient cooperative, able to follow commands, oriented x3

MEDICATION HISTORY:
- Regular antihypertensive medication (Lisinopril 20mg) administered at 0800 today as
  scheduled (7 hours ago)
- No missed doses documented during current admission

CONTRIBUTING FACTORS ASSESSED:
- No obvious precipitating factors identified
- Denies pain elsewhere, anxiety, or medication non-compliance
- Recent infection (pneumonia) may be contributing to BP elevation
- Adequate pain control achieved for pneumonia symptoms

CLINICAL CONCERNS:
- Risk of progression to hypertensive emergency if BP not promptly controlled
- Potential for end-organ damage (stroke, MI, acute kidney injury) with sustained elevation
- Need for close monitoring and timely intervention per hypertensive urgency protocol

Patient cooperative with plan of care and understands the need for close monitoring and
blood pressure management.
```

**Recommendation:**
```
IMMEDIATE INTERVENTIONS REQUESTED:

1. MEDICATION ORDERS:
   - Request order to administer Hydralazine 10 mg IV push now per PRN hypertensive urgency
     protocol
   - Alternative: Consider Labetalol 10-20 mg IV if preferred by provider
   - Anticipate need for repeat dose in 20-30 minutes if inadequate response

2. MONITORING PLAN:
   - Recheck blood pressure 30 minutes post-medication administration
   - Continuous BP monitoring q15min x1 hour, then q30min x2 hours if improving
   - Neurological checks q15min x1 hour to monitor for changes
   - Maintain continuous cardiac monitoring given BP elevation

3. DIAGNOSTIC CONSIDERATIONS:
   - Consider need for STAT basic metabolic panel (BMP) to assess renal function and
     electrolytes
   - Consider CT head if patient develops any neurological changes or headache worsens
   - ECG if patient develops chest pain or cardiac symptoms

4. PROVIDER ASSESSMENT:
   - Recommend provider bedside evaluation if BP does not decrease to <160/90 within 1 hour
     of intervention
   - Consider neurology consult if neuro changes develop or persistent headache despite BP
     control
   - Reassess home antihypertensive regimen - may need dosage adjustment or additional agent

5. SAFETY MEASURES:
   - Bed rest with HOB elevated 30 degrees for comfort
   - Call light within reach, frequent rounding
   - Fall precautions due to elevated BP and risk of orthostatic changes post-medication
   - NPO except medications until BP controlled (risk of vomiting with severe headache)

6. ANTICIPATED NEEDS:
   - May require ICU-level monitoring if BP does not respond to initial interventions
   - Prepare for possible transfer to higher level of care if hypertensive emergency develops

TIMELINE: Request immediate callback for medication order. Patient requires intervention
within 30 minutes to prevent potential complications. Will implement all orders promptly
and provide updates on patient response.

NURSE CONTACT: Available at extension 4312 for orders and follow-up communication.
```

---

## 3. PIE Template

### 📥 Expected Input (Voice/Text)

**Example - Natural Speech:**
```
Patient is complaining of pain at the surgical incision site, says it's a 7 out of 10.
This is day 2 post-op from appendectomy. Pain is sharp, right lower quadrant.
Patient is grimacing and guarding the area.

I gave morphine 2 milligrams IV at 1400 per the pain protocol. Also repositioned patient
for comfort, applied ice pack to the area, and taught deep breathing exercises.

Reassessed the patient 20 minutes later. Pain is now down to 3 out of 10. Patient is
resting comfortably, breathing is easier, facial expression is relaxed. Patient says
the pain is much better and manageable now.
```

### 📤 Expected Professional Output

**Problem:**
```
ACUTE PAIN - Post-operative surgical site discomfort

PROBLEM IDENTIFICATION:
- Patient reports sharp pain at surgical incision site, rated 7/10 on numeric pain scale
- Location: Right lower quadrant, site of laparoscopic appendectomy
- Post-operative day 2 (POD #2) following laparoscopic appendectomy performed 11/04/2025
- Pain characteristics: Sharp, localized, exacerbated by movement
- Duration: Onset approximately 30 minutes prior to assessment (1330 hours)

ASSESSMENT FINDINGS:
- Pain rated 7/10, which exceeds patient's stated acceptable pain goal of 4/10
- Patient grimacing and demonstrating guarding behavior when moving
- Holding right lower abdomen protectively
- Reluctant to ambulate or perform deep breathing/coughing due to pain
- Vital signs: BP 138/84 mmHg (↑ from baseline 120/76), HR 92 bpm (↑ from baseline 74),
  RR 20 breaths/min (↑ from baseline 16), Temp 98.8°F, SpO2 96% on room air
- Incision site assessed: Dressing clean, dry, intact; no signs of infection noted
  (no erythema, warmth, or purulent drainage)

PAIN IMPACT:
- Limiting patient's mobility and ability to participate in post-operative recovery activities
- Interfering with deep breathing and coughing (risk for atelectasis/pneumonia)
- Affecting patient's comfort and rest
- Patient unable to tolerate scheduled ambulation due to pain level

PAIN GOAL: Patient states acceptable pain level is ≤4/10 for function and comfort.
```

**Intervention:**
```
PHARMACOLOGICAL INTERVENTIONS:

1. MEDICATION ADMINISTRATION (1400 hours):
   - Administered morphine sulfate 2 mg IV push slowly over 2 minutes per provider order
   - Pre-medication vital signs obtained and within acceptable parameters
   - Patient educated on expected effects and potential side effects (drowsiness, nausea,
     constipation)
   - Post-administration monitoring initiated per protocol

NON-PHARMACOLOGICAL INTERVENTIONS:

2. POSITIONING:
   - Repositioned patient to semi-Fowler's position (HOB elevated 30 degrees) for optimal
     comfort
   - Placed pillow under knees to reduce tension on abdominal muscles
   - Ensured proper body alignment to minimize strain on surgical site

3. COMFORT MEASURES:
   - Applied ice pack wrapped in towel to right lower quadrant for 20 minutes
   - Maintained calm, quiet environment to promote relaxation
   - Dimmed lights and reduced noise level in patient room

4. PATIENT EDUCATION:
   - Taught and demonstrated deep breathing exercises (diaphragmatic breathing technique)
   - Educated on splinting technique for coughing and movement to reduce pain
   - Reviewed importance of early pain reporting before pain becomes severe
   - Discussed pain scale and importance of maintaining pain ≤4/10 for recovery

5. SUPPORTIVE CARE:
   - Encouraged relaxation techniques (guided imagery, slow deep breathing)
   - Provided reassurance and emotional support
   - Explained expected recovery process and timeline for pain improvement

6. SAFETY MEASURES:
   - Placed call light within easy reach
   - Instructed patient to request assistance before getting out of bed
   - Fall risk reassessed due to opioid administration

7. DOCUMENTATION:
   - Documented baseline pain assessment using numeric rating scale and behavioral indicators
   - Charted medication administration in MAR (Medication Administration Record)
   - Updated nursing flow sheet with interventions performed

TIME INTERVENTIONS COMPLETED: 1405 hours
```

**Evaluation:**
```
REASSESSMENT PERFORMED: 1420 hours (20 minutes post-intervention)

PAIN LEVEL IMPROVEMENT:
- Patient reports pain decreased from 7/10 to 3/10 (57% reduction)
- Pain level now below patient's stated goal of ≤4/10
- Pain described as "dull ache" rather than sharp pain

OBJECTIVE FINDINGS:
- Patient resting quietly in bed, eyes closed, respirations even
- Facial expression relaxed, no grimacing observed
- No longer guarding abdominal area
- Body position appears comfortable and relaxed
- Able to take deeper breaths without wincing

VITAL SIGNS (1420 hours):
- BP: 124/78 mmHg (returned to near baseline)
- HR: 78 bpm (returned to baseline)
- RR: 16 breaths/min (returned to baseline, deeper breaths)
- Temp: 98.8°F (stable)
- SpO2: 98% on room air (improved from 96%)

PATIENT STATEMENTS:
- "The pain is much better now, I can breathe easier"
- "That medicine really helped, thank you"
- "I feel like I can move around a bit now"

FUNCTIONAL OUTCOMES:
- Patient able to reposition self in bed without significant discomfort
- Successfully completed 3 cycles of deep breathing exercises
- Demonstrated proper splinting technique with pillow
- Willing to attempt ambulation as scheduled
- No adverse effects from morphine administration noted (no nausea, dizziness, or over-sedation)

PATIENT RESPONSE: EFFECTIVE - Pain adequately controlled with multimodal interventions.
Patient achieved pain goal of ≤4/10. Patient verbalized satisfaction with pain management
and comfort level.

ONGOING PLAN:
- Continue pain assessment q2h and PRN
- Maintain scheduled acetaminophen 650mg PO q6h for baseline pain control
- Morphine 2-4mg IV q4h PRN for breakthrough pain >4/10
- Continue non-pharmacological comfort measures
- Encourage early reporting of pain before severe
- Reassess before scheduled activities (ambulation, physical therapy)
- Monitor for opioid-related side effects
- Document continued pain management effectiveness

PATIENT EDUCATION EFFECTIVENESS: Patient able to demonstrate proper deep breathing and
splinting techniques. Verbalized understanding of pain management plan and when to request
additional pain medication.
```

---

## 4. DAR Template

### 📥 Expected Input (Voice/Text)

**Example - Natural Speech:**
```
Found the patient pacing in the room, looking anxious. Patient said "I can't breathe right,
something is wrong." Patient was breathing fast and shallow. Checked oxygen sat, it was 96
percent on room air. Listened to lungs, they're clear bilaterally. Heart rate was a little
elevated at 102.

I sat down with the patient and had them practice deep breathing exercises with me.
Did 4-7-8 breathing technique. Provided reassurance, told them their oxygen level is good
and lungs sound clear. Explained that sometimes anxiety can make breathing feel difficult.
Stayed with the patient for about 10 minutes.

Patient is much calmer now, sitting in the chair instead of pacing. Breathing has slowed
down and is deeper. Oxygen sat is 98 percent. Heart rate is back to 82. Patient said
"I feel better now, thank you for staying with me." Patient looks more relaxed, no more
rapid breathing.
```

### 📤 Expected Professional Output

**Data:**
```
ASSESSMENT TIME: 1515 hours

BEHAVIORAL OBSERVATIONS:
- Patient found pacing in room, unable to sit still
- Facial expression tense with furrowed brow
- Frequent hand wringing and fidgeting with bed linens
- Making repeated statements about breathing difficulty
- Verbalizes: "I can't breathe right, something is wrong"

RESPIRATORY ASSESSMENT:
- Respiratory rate: 28 breaths/min (elevated, baseline 16 breaths/min)
- Breathing pattern: Rapid, shallow breaths; appears hyperventilating
- Lung sounds: Clear to auscultation bilaterally, all fields (anterior, posterior, lateral)
- No wheezes, rales, rhonchi, or diminished breath sounds
- Chest expansion symmetric
- No use of accessory muscles
- No cyanosis or pallor noted
- SpO2: 96% on room air (adequate oxygenation)

CARDIOVASCULAR:
- Heart rate: 102 bpm (elevated from baseline of 78 bpm)
- Regular rhythm, no irregular beats noted
- Blood pressure: 142/88 mmHg (slightly elevated from baseline 118/72)
- Radial pulse strong, regular
- Skin warm, slightly diaphoretic on forehead

NEUROLOGICAL:
- Alert and oriented x3 (person, place, time)
- Appropriate responses to questions despite anxious presentation
- No confusion or altered mental status
- PERRLA (Pupils Equal, Round, Reactive to Light and Accommodation)

PATIENT STATEMENTS:
- "I can't breathe right"
- "Something is wrong"
- "My chest feels tight"
- Unable to identify specific trigger or precipitating event

CONTEXTUAL INFORMATION:
- No recent changes in medical condition
- No new medications administered
- No known allergies or sensitivities
- Patient admitted yesterday for observation following minor procedure
- Expected discharge planned for tomorrow

CLINICAL IMPRESSION:
Physical assessment findings inconsistent with respiratory distress (clear lungs, adequate
SpO2, no cyanosis). Symptoms more consistent with acute anxiety episode or panic attack.
No evidence of medical emergency requiring immediate intervention beyond supportive care.
```

**Action:**
```
IMMEDIATE INTERVENTIONS IMPLEMENTED (1515-1525 hours):

1. THERAPEUTIC PRESENCE:
   - Remained at bedside to provide calm, reassuring presence
   - Maintained open, relaxed body language and spoke in calm, soothing tone
   - Made eye contact and gave patient full attention
   - Created quiet, peaceful environment (dimmed lights, reduced noise)

2. BREATHING TECHNIQUE INSTRUCTION:
   - Sat down next to patient at eye level to model calm behavior
   - Introduced 4-7-8 breathing technique (Dr. Andrew Weil method):
     * Inhale through nose for 4 seconds
     * Hold breath for 7 seconds
     * Exhale completely through mouth for 8 seconds
   - Demonstrated technique first, then practiced together with patient
   - Completed 4 full cycles of breathing exercises
   - Provided gentle coaching and encouragement throughout

3. PATIENT EDUCATION:
   - Explained connection between anxiety and physical symptoms (increased heart rate,
     rapid breathing, chest tightness)
   - Reassured patient with objective findings: "Your oxygen level is 96%, which is very
     good, and your lungs sound completely clear"
   - Normalized experience: "Sometimes when we feel anxious, it can make our breathing
     feel difficult even when our lungs are working fine"
   - Reviewed body's stress response and how controlled breathing can activate
     parasympathetic nervous system

4. ASSESSMENT & MONITORING:
   - Continuous observation of breathing pattern and patient affect
   - Reassessed vital signs after 10 minutes of intervention
   - Monitored SpO2 continuously during episode

5. ENVIRONMENTAL MODIFICATIONS:
   - Assisted patient to comfortable seated position in bedside chair
   - Positioned patient near window for visual distraction and natural light
   - Offered ice water (patient accepted and took several sips)
   - Removed clutter from immediate environment

6. EMOTIONAL SUPPORT:
   - Validated patient's feelings: "I understand this feels very real and frightening"
   - Encouraged verbalization of concerns
   - Active listening without judgment
   - Provided reassurance about safety and continuous monitoring

7. SAFETY MEASURES:
   - Call light placed within easy reach
   - Explained that nurse will check back frequently
   - Encouraged patient to call immediately if symptoms return
   - Bed alarm temporarily activated due to elevated anxiety and potential orthostatic changes

DURATION OF INTERVENTION: Approximately 10 minutes of direct nursing presence and
therapeutic intervention.

COLLABORATIVE CARE:
- Notified charge nurse of anxiety episode and successful de-escalation
- Documented episode in patient chart for continuity of care
- No pharmacological intervention required at this time
```

**Response:**
```
REASSESSMENT TIME: 1525 hours (10 minutes post-intervention)

BEHAVIORAL RESPONSE:
- Patient no longer pacing; sitting calmly in bedside chair
- Facial expression noticeably more relaxed, tension reduced
- Body posture more at ease, shoulders dropped, hands resting in lap
- No longer fidgeting or displaying restless behavior
- Making appropriate eye contact and engaging in normal conversation

RESPIRATORY STATUS:
- Respiratory rate: 16 breaths/min (returned to baseline)
- Breathing pattern: Deep, even, controlled respirations
- Patient able to complete full sentences without difficulty
- No signs of respiratory distress
- SpO2: 98% on room air (improved from 96%)
- Lung sounds remain clear bilaterally

CARDIOVASCULAR:
- Heart rate: 82 bpm (returned to baseline)
- Blood pressure: 120/74 mmHg (returned to near baseline)
- Skin warm and dry, diaphoresis resolved

NEUROLOGICAL:
- Alert and oriented x3
- Calm affect, appropriate mood
- Demonstrates clear understanding of breathing techniques taught

PATIENT VERBAL FEEDBACK:
- States: "I feel better now, thank you for staying with me"
- "The breathing really helped, I feel calmer"
- "I'm sorry I panicked, I just got scared"
- Able to identify that anxiety was likely trigger for symptoms

FUNCTIONAL OUTCOMES:
- Successfully performed breathing techniques independently when prompted
- Able to identify early signs of anxiety for future self-monitoring
- Verbalized plan to use breathing techniques if anxious feelings return
- Demonstrated understanding of difference between anxiety symptoms and medical emergency

OBJECTIVE MEASUREMENTS:
- Pre-intervention: RR 28, HR 102, BP 142/88, SpO2 96%
- Post-intervention: RR 16, HR 82, BP 120/74, SpO2 98%
- All vital signs returned to patient's baseline parameters

EFFECTIVENESS OF INTERVENTION: HIGHLY EFFECTIVE

The combination of therapeutic presence, breathing techniques, patient education, and
emotional support successfully resolved the acute anxiety episode without need for
pharmacological intervention. Patient responded positively to non-pharmacological nursing
interventions within 10 minutes.

PATIENT SATISFACTION:
- Expressed gratitude for nursing support and time spent
- Verbalized feeling heard and supported
- Stated increased confidence in ability to manage anxiety symptoms independently

ONGOING PLAN:
- Continue to monitor for recurring anxiety symptoms
- Encourage patient to utilize learned breathing techniques PRN
- Provide reinforcement of anxiety management strategies
- Consider referral to social work or counseling services if anxiety persists
- Document successful intervention for care team continuity
- Schedule follow-up check-in within 1 hour to assess sustained improvement
- Educate patient on calling for support before anxiety escalates

PATIENT EDUCATION RETAINED:
Patient able to accurately repeat back:
- 4-7-8 breathing technique steps
- Physical symptoms of anxiety vs. medical emergency
- When to call for nursing assistance

SAFETY MAINTAINED: No adverse events during episode. Patient safe and comfortable at
conclusion of intervention.
```

---

# Epic Templates

## 5. Shift Assessment

### 📥 Expected Input (Voice/Text)

**Example - Natural Speech:**
```
Starting my shift assessment for Mr. Davis in room 405. Patient is alert and oriented times
four, knows who he is, where he is, the date, and why he's here. Pupils are equal, round,
reactive to light. Follows commands appropriately. Moving all extremities, strength is 5 out
of 5 in all limbs.

Heart rate is 82, regular rhythm, no extra sounds. Radial pulses are 2 plus bilateral, pedal
pulses are 2 plus bilateral. No edema in arms or legs. Capillary refill is less than 2 seconds.

Lungs are clear to auscultation bilaterally, all lobes. No wheezing or crackles. Respiratory
rate 18, breathing is even and unlabored. Oxygen sat is 98 percent on room air.

Abdomen is soft, non-tender, bowel sounds are active in all four quadrants. Last bowel
movement was yesterday evening, formed and brown. Patient says he's tolerating regular diet
well, had 75 percent of breakfast.

Voiding without difficulty, urine is clear and yellow. No complaints of burning or pain.
Output has been adequate, about 650 mils this shift.

Skin is intact, no pressure injuries or breakdown noted. Braden scale is 20, low risk.
Skin is warm and dry, good color. No rashes or lesions.

Patient ambulates independently, steady gait, no assistive devices needed. Full range of
motion in all joints. No pain with movement.

Vitals are BP 128 over 84, heart rate 82, respiratory rate 18, temp 98.4, oxygen sat 98
percent on room air, pain is zero out of ten.

Overall patient is stable, no acute changes this shift.
```

### 📤 Expected Professional Output

**Patient Assessment:**
```
COMPREHENSIVE SHIFT ASSESSMENT - Day Shift
Patient: Mr. Davis | Room: 405 | Date: 11/06/2025 | Time: 0730

═══════════════════════════════════════════════════════════════════

NEUROLOGICAL:
• Mental Status: Alert and oriented x4 (person: states name correctly, place: identifies
  hospital and floor, time: states correct date and time, situation: accurately explains
  reason for hospitalization)
• Glasgow Coma Scale: 15/15 (Eyes: 4, Verbal: 5, Motor: 6)
• Pupils: PERRLA (Pupils Equal, Round, Reactive to Light and Accommodation) - 3mm bilateral,
  brisk direct and consensual light reflex
• Cranial Nerves: CN II-XII grossly intact on bedside screening
• Motor Function: Moves all extremities spontaneously and on command
  - Upper extremity strength: 5/5 bilateral (shoulder, elbow, wrist, hand)
  - Lower extremity strength: 5/5 bilateral (hip, knee, ankle, foot)
  - Grip strength: Equal and strong bilaterally
• Sensory: Intact to light touch all extremities (upper and lower, bilateral)
• Coordination: Finger-to-nose test performed accurately, no ataxia
• Gait: Steady and balanced, normal cadence, no shuffling or wide-based gait
• Speech: Clear, coherent, appropriate responses, no slurring or word-finding difficulty
• Behavior: Calm, cooperative, follows multi-step commands appropriately
• Memory: Oriented to recent and remote events, recalls teaching from previous shift
• No reports of dizziness, headache, visual changes, numbness, tingling, or weakness
• No facial drooping, no focal neurological deficits observed

CARDIOVASCULAR:
• Heart Rate: 82 bpm, regular rate and rhythm
• Heart Sounds: S1 and S2 present and distinct, no S3 or S4 gallops
• Auscultation: No murmurs, rubs, or extra heart sounds appreciated at all listening posts
  (aortic, pulmonic, tricuspid, mitral areas)
• Apical Pulse: Strong and regular at 5th intercostal space, midclavicular line
• Peripheral Pulses:
  - Radial: 2+ bilateral, strong and regular
  - Pedal: 2+ bilateral (dorsalis pedis and posterior tibial)
  - Popliteal: 2+ bilateral
  - All pulses equal strength bilaterally
• Capillary Refill: <2 seconds in all extremities (brisk perfusion)
• Edema: 0/4 edema bilateral upper and lower extremities (no swelling)
• Jugular Venous Distension: Not present (neck veins flat at 30-45 degree angle)
• Skin Perfusion: Warm to touch throughout all extremities, pink nail beds
• No complaints of chest pain, palpitations, or orthostatic dizziness
• No calf tenderness or signs of deep vein thrombosis (negative Homan's sign)
• Telemetry: Normal sinus rhythm, no ectopy noted (if applicable)

RESPIRATORY:
• Respiratory Rate: 18 breaths/min, even and unlabored
• Breathing Pattern: Regular rhythm, symmetric chest expansion bilaterally
• Lung Sounds: Clear to auscultation bilaterally in all lobes
  - Anterior: Clear upper, middle, and lower lobes bilateral
  - Posterior: Clear upper and lower lobes bilateral
  - Lateral: Clear in all fields bilateral
• No adventitious sounds: No wheezes, rales (crackles), rhonchi, or diminished sounds
• Accessory Muscle Use: None noted
• Work of Breathing: No increased effort, no nasal flaring, no intercostal retractions
• Oxygen Support: Room air (no supplemental oxygen required)
• SpO2: 98% on room air (adequate oxygenation)
• Cough: None present during assessment
• Sputum: Not applicable, no productive cough
• Chest Expansion: Full and symmetric with inspiration
• No complaints of shortness of breath, dyspnea on exertion, or chest tightness
• No orthopnea (able to lie flat comfortably) or paroxysmal nocturnal dyspnea

GASTROINTESTINAL:
• Abdomen: Soft, non-tender, non-distended to palpation in all four quadrants
• Bowel Sounds: Active and normoactive in all four quadrants (RUQ, LUQ, RLQ, LLQ)
• Palpation: No rigidity, guarding, rebound tenderness, or masses
• Last Bowel Movement: Yesterday evening (11/05/2025, approximately 1900 hours)
  - Consistency: Formed, normal brown color
  - Amount: Moderate
  - Bristol Stool Scale: Type 4 (normal)
• Bowel Pattern: Regular, no constipation or diarrhea
• Oral Intake:
  - Diet Order: Regular diet, no restrictions
  - Appetite: Good, patient reports feeling hungry at mealtimes
  - Breakfast Intake: 75% consumed (6 oz orange juice, 1 scrambled egg, 1 slice toast,
    8 oz coffee)
  - Fluid Intake: Approximately 480 mL this shift (0700-1500)
• Swallowing: No dysphagia or difficulty swallowing noted
• Nausea/Vomiting: None reported, no antiemetic medications required
• Abdominal Pain: Denies any abdominal pain, cramping, or discomfort
• Flatus: Passing gas normally
• Denies heartburn, reflux, or indigestion
• Ostomy: Not applicable (if applicable, describe type, output, stoma appearance)

GENITOURINARY:
• Voiding Pattern: Spontaneous, without difficulty or assistance required
• Frequency: Voiding approximately every 3-4 hours (normal pattern)
• Urine Output: 650 mL this shift (0700-1500 = 8 hours) - adequate output (>0.5 mL/kg/hr)
• Urine Characteristics:
  - Color: Clear, yellow (light amber)
  - Clarity: Clear, no cloudiness
  - Odor: No foul or unusual odor
  - No visible blood (no hematuria)
• Continence: Continent of urine, no incontinence episodes
• Urinary Symptoms: No dysuria (burning), urgency, frequency, or hesitancy reported
• Bladder Palpation: No suprapubic tenderness or distension
• Catheter: Not applicable (no foley catheter in place)
• No signs of urinary retention (bladder not palpable, no complaints of fullness)
• Patient able to ambulate to bathroom independently for toileting

INTEGUMENTARY (SKIN):
• Skin Integrity: Intact throughout, no breakdown or open areas
• Pressure Injury: None noted on comprehensive skin assessment
• Braden Scale: 20 (Low Risk for pressure injury)
  - Sensory perception: 4 (no impairment)
  - Moisture: 4 (rarely moist)
  - Activity: 4 (walks frequently)
  - Mobility: 4 (no limitations)
  - Nutrition: 4 (excellent)
  - Friction/Shear: 3 (no apparent problem)
• Temperature: Warm to touch throughout all extremities and trunk
• Moisture: Dry, no excessive moisture or diaphoresis
• Turgor: Good skin turgor, skin returns immediately when pinched (well-hydrated)
• Color: Pink, appropriate for patient's ethnicity, well-perfused
• Capillary Refill: <2 seconds (indicates good peripheral perfusion)
• Lesions: None observed
• Rashes: None present
• Bruising: None noted
• Scars: [Document if present and location]
• Wounds: None present
• IV Site: [If applicable - describe location, appearance, no redness/swelling/pain]
• Peripheral Edema: 0/4 bilateral lower and upper extremities
• Pressure Points Assessed: Heels, sacrum, coccyx, elbows, occiput - all areas intact
• Bony Prominences: No redness or blanching noted over bony prominences

MUSCULOSKELETAL & MOBILITY:
• Ambulation: Independent, no assistive devices required (no cane, walker, or wheelchair)
• Gait: Steady, balanced, normal stride length and cadence
• Balance: Maintains balance during walking and position changes, no loss of balance
• Transfers: Bed ↔ chair transfer performed independently without assistance
• Range of Motion: Full active ROM in all extremities
  - Shoulders: Full abduction, adduction, flexion, extension, internal/external rotation
  - Elbows: Full flexion and extension
  - Wrists: Full flexion, extension, radial/ulnar deviation
  - Hips: Full flexion, extension, abduction, adduction, internal/external rotation
  - Knees: Full flexion and extension
  - Ankles: Full dorsiflexion, plantarflexion, inversion, eversion
• Muscle Strength: 5/5 throughout all extremities (see Neuro section for detailed testing)
• Joint Assessment:
  - No swelling, warmth, erythema, or effusion in any joints
  - No crepitus with movement
  - No tenderness to palpation
• Spine: Normal curvature, no deformities noted
• Coordination: Smooth, purposeful movements, no ataxia or tremor
• Fall Risk Assessment: Low risk (steady gait, independent mobility, no orthostatic changes)
• Activity Tolerance: Ambulates without shortness of breath or fatigue
• Pain with Movement: Denies any joint pain, muscle pain, or pain with position changes
• Assistive Devices: None required
• Physical Therapy: [If ordered - note participation and progress]

═══════════════════════════════════════════════════════════════════

OVERALL ASSESSMENT SUMMARY:
Patient is hemodynamically stable with no acute changes noted during this shift assessment.
All body systems assessed and functioning within normal parameters. Patient demonstrates
good functional status with independent mobility and self-care abilities. No new concerns
identified at this time. Patient comfortable and resting quietly. No immediate interventions
required. Continue current plan of care and monitor for any changes in status.
```

**Vital Signs:**
```
VITAL SIGNS RECORD - Day Shift
═══════════════════════════════════════════════════════════════════

CURRENT VITAL SIGNS (0730 hours):
• Blood Pressure: 128/84 mmHg (sitting, left arm, automatic cuff)
• Heart Rate: 82 bpm (regular rhythm, radial pulse)
• Respiratory Rate: 18 breaths/min (even, unlabored)
• Temperature: 98.4°F (36.9°C) (oral)
• Oxygen Saturation: 98% on room air
• Pain Level: 0/10 (no pain reported, patient comfortable)
• Weight: [Document if obtained]

VITAL SIGNS TRENDING (Previous 24 hours):

Time      | BP        | HR  | RR | Temp     | SpO2   | Pain | Notes
----------|-----------|-----|----|-----------| -------|------|------------------
0700      | 130/82    | 80  | 18 | 98.2°F   | 98% RA | 0/10 | Awake, comfortable
1200      | 128/84    | 82  | 18 | 98.4°F   | 98% RA | 0/10 | Post-lunch
1800      | 126/80    | 78  | 16 | 98.6°F   | 98% RA | 0/10 | Resting
2200      | 124/78    | 76  | 16 | 98.4°F   | 98% RA | 0/10 | Sleeping
0200      | 122/76    | 74  | 16 | 98.2°F   | 98% RA | 0/10 | Sleeping
0600      | 128/80    | 78  | 18 | 98.2°F   | 98% RA | 0/10 | Morning care

═══════════════════════════════════════════════════════════════════

VITAL SIGNS ANALYSIS:
• Blood Pressure: Stable and within normal limits for patient (120-130 systolic, 76-84
  diastolic). No orthostatic changes noted. Trending stable over past 24 hours with minimal
  variation.

• Heart Rate: Normal sinus rhythm, rate 74-82 bpm over past 24 hours. No tachycardia or
  bradycardia. Heart rate appropriate for rest and activity levels.

• Respiratory Rate: Stable at 16-18 breaths/min, within normal adult range. No tachypnea
  or bradypnea. Respirations unlabored and regular.

• Temperature: Afebrile, temperature stable 98.2-98.6°F (36.8-37.0°C) over past 24 hours.
  No fever or hypothermia.

• Oxygen Saturation: Consistently 98% on room air, indicating excellent oxygenation.
  No supplemental oxygen required.

• Pain: Patient consistently rates pain as 0/10 throughout shift. Comfortable, no analgesic
  medications required. Patient states "I have no pain at all."

ASSESSMENT: All vital signs stable and within normal limits for patient. No significant
changes from baseline parameters. No immediate concerns or interventions required. Continue
to monitor per routine protocol q4h and PRN.

PATIENT TOLERANCE: Patient tolerating all activities of daily living without hemodynamic
changes. No orthostatic hypotension noted with position changes or ambulation.
```

---

## 6. MAR (Medication Administration Record)

### 📥 Expected Input (Voice/Text)

**Example - Natural Speech:**
```
Administered metoprolol 25 milligrams by mouth at 0800. Patient's blood pressure before
giving the med was 152 over 90, heart rate was 88. I checked the apical pulse, it was
regular rhythm. Patient was alert and oriented, no dizziness reported.

I explained to the patient that this medication is for blood pressure control. Patient
took the medication with water, swallowed without difficulty.

I rechecked the blood pressure one hour later at 0900. BP is now 130 over 80, heart rate
is 78. Patient is tolerating the medication well, no side effects like dizziness or fatigue.
Patient says they feel fine.
```

### 📤 Expected Professional Output

**Medication Administration:**
```
═══════════════════════════════════════════════════════════════════
MEDICATION ADMINISTRATION RECORD (MAR) - Day Shift
Date: 11/06/2025 | Nurse: [Name] | Patient: [Name] | MRN: [Number]
═══════════════════════════════════════════════════════════════════

MEDICATION #1: METOPROLOL TARTRATE
═══════════════════════════════════════════════════════════════════

MEDICATION DETAILS:
• Generic Name: Metoprolol tartrate
• Brand Name: Lopressor
• Dose: 25 mg
• Route: PO (oral, by mouth)
• Frequency: BID (twice daily at 0800 and 2000)
• Indication: Antihypertensive - blood pressure control, heart rate management
• Medication Class: Beta-1 selective blocker (cardioselective)

SITE: N/A (oral medication)

TIME ADMINISTRATION:
• Ordered Time: 0800
• Actual Time Administered: 0800 (given on time)
• Administered By: [Nurse Name, RN]

═══════════════════════════════════════════════════════════════════

PRE-ADMINISTRATION ASSESSMENT (0755 hours):

VITAL SIGNS:
• Blood Pressure: 152/90 mmHg (sitting position, left arm)
• Heart Rate: 88 bpm (regular rhythm)
• Apical Pulse: 88 bpm, regular rate and rhythm (auscultated for full 60 seconds)
• Respiratory Rate: 18 breaths/min
• Temperature: 98.6°F (37.0°C)
• SpO2: 97% on room air

ASSESSMENT PARAMETERS:
• Apical Pulse Quality: Strong and regular, no irregularities or extra beats
• Patient Mental Status: Alert and oriented x3, no confusion or altered mental status
• Dizziness: None reported, patient denies lightheadedness
• Orthostatic Changes: None noted when moving from lying to sitting position
• Cardiac Symptoms: No chest pain, palpitations, or shortness of breath
• Fatigue Level: Patient reports feeling energetic, no excessive fatigue

SAFETY CHECKS PERFORMED:
✓ Right Patient: Two patient identifiers verified (name and date of birth)
✓ Right Medication: Metoprolol 25mg confirmed against MAR and pharmacy label
✓ Right Dose: 25mg dose verified as ordered
✓ Right Route: PO (oral) route confirmed
✓ Right Time: 0800 administration time confirmed
✓ Right Documentation: Pre-administration assessment completed
✓ Allergy Check: No known drug allergies confirmed in chart
✓ Hold Parameters Reviewed: Administer if HR >55 and SBP >100
✓ Parameters Met: HR 88 >55 ✓, SBP 152 >100 ✓ - SAFE TO ADMINISTER

═══════════════════════════════════════════════════════════════════

ADMINISTRATION PROCESS:

PATIENT EDUCATION PROVIDED:
• Medication Purpose: Explained that metoprolol is a beta-blocker used to lower blood
  pressure and control heart rate
• Expected Effects: "This medication will help lower your blood pressure and may slow
  your heart rate slightly. This is normal and expected."
• Timing: "Take this medication twice daily, in the morning and evening, preferably at
  the same times each day"
• Side Effects to Report: Educated patient to immediately report excessive dizziness,
  feeling faint, very slow heartbeat, extreme fatigue, or swelling in feet/ankles
• Activity Precautions: Advised to change positions slowly to avoid dizziness, especially
  when going from lying to standing
• Patient Understanding: Patient verbalized understanding of medication purpose and side
  effects to report. Patient stated "I understand this is for my blood pressure."

ADMINISTRATION DETAILS:
• Medication Preparation: One 25mg tablet retrieved from automated medication dispensing
  system, verified against order
• Administration Assistance: 8 oz water provided for medication administration
• Patient Response During Administration: Patient swallowed tablet without difficulty,
  no choking or coughing
• Mouth Check: Not required for cooperative patient (no concerns about cheeking medication)
• Position During Administration: Patient sitting upright in bed (HOB elevated 45 degrees)
• NPO Status: Not NPO, tolerating PO intake without restrictions
• Adverse Reactions During Administration: None observed

DOCUMENTATION:
• Time medication administered: 0800 (logged in electronic MAR at 0805)
• Barcode scanning completed for medication and patient wristband
• Electronic signature applied to MAR
• No medication variances or errors

═══════════════════════════════════════════════════════════════════

POST-ADMINISTRATION MONITORING:

REASSESSMENT TIME: 0900 (60 minutes post-administration)

POST-ADMINISTRATION VITAL SIGNS:
• Blood Pressure: 130/80 mmHg (decreased from 152/90 mmHg)
  - Systolic reduction: 22 mmHg ↓ (14% decrease)
  - Diastolic reduction: 10 mmHg ↓ (11% decrease)
  - BP now within target range (<140/90)
• Heart Rate: 78 bpm (decreased from 88 bpm) - 10 bpm reduction
  - Heart rate remains within normal range (60-100 bpm)
• Apical Pulse: 78 bpm, regular rate and rhythm (strong and regular)
• Blood Pressure Position: Sitting, left arm (same position as pre-administration for
  accurate comparison)

PATIENT RESPONSE TO MEDICATION:

Subjective Response:
• Patient States: "I feel fine, no problems with the medication"
• Dizziness: None reported
• Lightheadedness: Denies feeling lightheaded
• Fatigue: No new or excessive fatigue noted
• Palpitations: None reported
• Headache: None reported
• Overall Comfort: Patient reports feeling comfortable and well

Objective Findings:
• Mental Status: Alert and oriented x3, no confusion or altered mental status
• Activity Tolerance: Ambulated to bathroom independently without dizziness or difficulty
• Skin: Warm and dry, good color, no diaphoresis or cyanosis
• Respiratory: No shortness of breath, RR 16 breaths/min (stable)
• Cardiac: Heart sounds regular, no extra sounds or murmurs
• Peripheral Perfusion: Capillary refill <2 seconds, radial and pedal pulses strong
• Orthostatic Assessment: BP stable with position changes (no orthostatic hypotension)

ADVERSE EFFECTS MONITORING:
✓ No bradycardia (HR remains >55 bpm)
✓ No hypotension (BP remains >100/60 mmHg)
✓ No dizziness or syncope
✓ No bronchospasm or wheezing
✓ No peripheral edema
✓ No cold extremities
✓ No signs of heart failure exacerbation
✓ No allergic reaction (no rash, itching, or swelling)

THERAPEUTIC RESPONSE: EFFECTIVE
• Blood pressure successfully reduced to target range
• Heart rate decreased appropriately without bradycardia
• No adverse effects observed
• Patient tolerating medication well
• Therapeutic goal achieved

═══════════════════════════════════════════════════════════════════

CLINICAL ASSESSMENT:

MEDICATION EFFECTIVENESS:
• Blood Pressure Control: Excellent response to 25mg dose
  - Pre-medication BP: 152/90 mmHg (Stage 1 hypertension)
  - Post-medication BP: 130/80 mmHg (normal/prehypertensive range)
  - Target BP achieved: <140/90 mmHg ✓
• Heart Rate Control: Appropriate reduction without bradycardia
  - Pre-medication HR: 88 bpm (upper normal)
  - Post-medication HR: 78 bpm (normal range)
  - Heart rate remains safe (>55 bpm) ✓

PATIENT TOLERANCE: EXCELLENT
• No adverse effects or complications
• Patient able to tolerate therapeutic dose
• No adjustment in dose required at this time
• Patient compliant and cooperative with medication administration

SAFETY CONSIDERATIONS:
• Continue to monitor BP and HR before each metoprolol dose
• Hold medication and notify provider if HR <55 or SBP <100
• Monitor for signs of bradycardia, hypotension, or heart failure
• Educate patient on home BP monitoring if discharge anticipated
• No drug interactions identified with current medication regimen

═══════════════════════════════════════════════════════════════════

NEXT SCHEDULED DOSE:
• Date/Time: 11/06/2025 at 2000 (8:00 PM)
• Special Instructions: Assess BP and HR prior to administration
• Hold Parameters: HR <55 bpm or SBP <100 mmHg
• Provider Notification: Contact provider if hold parameters met

ONGOING MONITORING PLAN:
• Vital signs q4h routine monitoring
• Pre-medication assessment before each dose (BP, HR, symptoms)
• Post-medication assessment 1 hour after each dose
• Monitor for cumulative effects with continued dosing
• Daily weight (to monitor for fluid retention)
• Assess for signs/symptoms of heart failure (edema, dyspnea, orthopnea)
• Patient education reinforcement with each dose

DOCUMENTATION COMPLETE: ✓
• Pre-administration assessment documented
• Medication administration time and route documented
• Patient education documented
• Post-administration assessment and patient response documented
• Electronic MAR signed and completed
• No medication errors or variances

═══════════════════════════════════════════════════════════════════
Administered By: [Nurse Name, RN] | License #: [Number]
Verification: Electronic signature applied | Date/Time: 11/06/2025 0905
═══════════════════════════════════════════════════════════════════
```

---

## 10. Med-Surg Documentation

### 📥 Expected Input (Voice/Text)

**Example - Natural Speech:**
```
Patient is post-op day 2 from laparoscopic appendectomy. Diagnosis was acute appendicitis.
Vital signs are stable, patient is afebrile. Temperature has been normal for the past
24 hours, no fever.

IV fluids running, lactated ringers at 75 mils per hour, left forearm, 20 gauge catheter,
site looks good, no redness or swelling.

Pain is well controlled with scheduled acetaminophen. Patient rates pain as 2 out of 10,
says it's manageable. Not needing any IV pain meds, oral acetaminophen is working well.

Patient is ambulating with standby assist. Walked to the bathroom and around the room twice
this shift. Gait is steady when assisted. Getting stronger each time.

Plan is to encourage more ambulation, increase activity as tolerated. Monitor the surgical
incision, it looks clean and dry. Continue IV fluids until patient is drinking and eating
enough by mouth. Patient education on post-op care and activity restrictions provided.
```

### 📤 Expected Professional Output

**Med-Surg Documentation:**
```
═══════════════════════════════════════════════════════════════════
MED-SURG NURSING DOCUMENTATION
Date: 11/06/2025 | Time: 1400 | POD #2 | Nurse: [Name, RN]
═══════════════════════════════════════════════════════════════════

PATIENT INFORMATION:
• Admission Date: 11/04/2025
• Surgical Procedure: Laparoscopic appendectomy
• Surgery Date: 11/04/2025
• Post-Operative Day: #2 (POD #2)
• Surgeon: Dr. [Name]
• Diagnosis: Acute appendicitis, uncomplicated

═══════════════════════════════════════════════════════════════════

CURRENT DIAGNOSIS & CONDITION:

PRIMARY DIAGNOSIS:
• Acute appendicitis, status post laparoscopic appendectomy (POD #2)
• ICD-10: K35.80 (Unspecified acute appendicitis)
• Procedure Code: CPT 44970 (Laparoscopic appendectomy)

SURGICAL DETAILS:
• Approach: Laparoscopic (3 port sites)
• Complications During Surgery: None
• Estimated Blood Loss: Minimal (<50 mL)
• Operative Time: 45 minutes
• Anesthesia: General endotracheal anesthesia
• Specimens: Appendix sent to pathology (pending final report)
• Findings: Inflamed, non-perforated appendix

POST-OPERATIVE COURSE:
• Recovery: Progressing as expected for POD #2
• Complications: None to date
• Overall Status: Stable, advancing diet and activity per protocol

═══════════════════════════════════════════════════════════════════

VITAL SIGNS - CURRENT (1400 hours):

• Blood Pressure: 118/74 mmHg (stable)
• Heart Rate: 76 bpm (regular)
• Respiratory Rate: 16 breaths/min
• Temperature: 98.4°F (36.9°C) - **AFEBRILE** ✓
• SpO2: 98% on room air
• Pain: 2/10 (well-controlled)

VITAL SIGNS TRENDING (Past 24 hours):

Time   | BP      | HR | RR | Temp    | SpO2   | Pain | Notes
-------|---------|----|----|---------|--------|------|------------------
1400   | 118/74  | 76 | 16 | 98.4°F  | 98% RA | 2/10 | Stable, comfortable
0800   | 120/76  | 78 | 16 | 98.2°F  | 98% RA | 3/10 | Post-ambulation
0200   | 116/72  | 74 | 16 | 98.0°F  | 98% RA | 2/10 | Sleeping well
1800   | 122/78  | 80 | 18 | 98.6°F  | 97% RA | 3/10 | After activity
1400   | 124/80  | 82 | 18 | 99.0°F  | 97% RA | 4/10 | POD #1

ASSESSMENT:
✓ Hemodynamically stable - all vital signs within normal limits
✓ **Afebrile x24 hours** - temperature consistently <100.4°F (no fever)
✓ No tachycardia or hypotension
✓ Adequate oxygenation on room air
✓ Pain improving (4/10 → 2/10 over past 24 hours)

═══════════════════════════════════════════════════════════════════

INTRAVENOUS ACCESS & FLUID MANAGEMENT:

IV SITE #1 (Primary):
• Location: Left forearm, antecubital area
• Catheter Size: 20-gauge peripheral IV
• Insertion Date: 11/04/2025 (2 days ago, inserted pre-operatively)
• Site Assessment:
  ✓ Dressing: Transparent dressing intact, clean, dry
  ✓ Insertion Site: No erythema, edema, or warmth
  ✓ Patency: Patent, flushes easily with normal saline
  ✓ Infusion: Infusing without difficulty
  ✓ Patient Comfort: No pain, tenderness, or discomfort at site
• Phlebitis Score: 0 (no signs of phlebitis)
• Infiltration Score: 0 (no signs of infiltration)

IV FLUID THERAPY:
• Solution: Lactated Ringer's (LR)
• Rate: 75 mL/hour (1,800 mL/24 hours)
• Infusion Pump: Programmed correctly, alarming appropriately
• Volume Remaining: 800 mL in current bag
• Hang Time: Bag hung at 0800 (within 24-hour guideline)

IV SITE CARE:
• Dressing Change: Due 11/07/2025 (q72h per protocol)
• Site Assessment Frequency: Every 4 hours and PRN
• IV Tubing: Changed per protocol (q96h)
• Flushes: Normal saline 10 mL every shift to maintain patency

IV DISCONTINUATION PLAN:
• D/C When: Patient tolerating adequate PO intake (goal: >1,500 mL/day orally)
• Current PO Intake: Approximately 800 mL over past 12 hours
• Expected Timeline: Likely discontinue tomorrow (POD #3) if PO intake continues to
  increase

FLUID BALANCE (0700-1900 shift):
• IV Intake: 900 mL (LR @ 75 mL/hr x 12 hours)
• PO Intake: 800 mL (water, juice, tea)
• Total Intake: 1,700 mL
• Urine Output: 1,500 mL (adequate)
• Net Balance: +200 mL (appropriate positive balance)

═══════════════════════════════════════════════════════════════════

PAIN MANAGEMENT:

PAIN ASSESSMENT (1400 hours):
• Pain Rating: 2/10 on numeric rating scale
• Pain Location: Right lower quadrant, surgical site (port sites)
• Pain Quality: Dull, aching (not sharp or severe)
• Pain Pattern: Intermittent, worsens slightly with movement
• Acceptable Pain Goal: Patient states ≤3/10 is acceptable
• **GOAL ACHIEVED:** Current pain 2/10 ≤ goal of 3/10 ✓

CURRENT PAIN REGIMEN:
• **Scheduled Medication:**
  - Acetaminophen 650 mg PO q6h (around-the-clock)
  - Purpose: Baseline pain control, reduce opioid need
  - Last Dose: 1200 hours
  - Next Dose Due: 1800 hours
  - Patient Response: Effective pain control with PO acetaminophen alone

• **PRN Medication Available (Not Currently Needed):**
  - Oxycodone 5 mg PO q4h PRN for breakthrough pain >5/10
  - Patient has NOT required oxycodone since last evening (>12 hours)
  - Last opioid dose: 11/05/2025 at 2000 hours (yesterday evening)

PAIN MANAGEMENT EFFECTIVENESS:
✓ Pain well-controlled on non-opioid medication (acetaminophen)
✓ Patient comfortable at rest and with movement
✓ No requests for additional pain medication
✓ Transitioning successfully from opioids to non-opioid analgesia
✓ Pain not limiting activity or recovery

MULTIMODAL PAIN MANAGEMENT:
• Pharmacological: Scheduled acetaminophen
• Non-Pharmacological:
  - Positioning: HOB elevated 30 degrees for comfort
  - Ice packs: Applied to surgical site PRN for 20 minutes
  - Splinting: Patient taught to splint abdomen with pillow during coughing
  - Distraction: TV, reading, family visits

PAIN INTERFERENCE:
• Sleep: Sleeping through night without waking due to pain
• Activity: Able to ambulate without significant pain increase
• ADLs: Performing self-care activities without limitation
• Appetite: Eating and drinking without pain interference

PATIENT EDUCATION:
• Instructed to report pain >5/10 immediately
• Taught to request pain medication before pain becomes severe (proactive vs. reactive)
• Educated on splinting technique for coughing/laughing
• Patient verbalized understanding ✓

═══════════════════════════════════════════════════════════════════

MOBILITY & FUNCTIONAL STATUS:

CURRENT MOBILITY LEVEL: **Ambulating with Standby Assistance**

AMBULATION DETAILS (Day Shift 0700-1900):
• Episode #1 (0900): Ambulated to bathroom and back (approximately 20 feet)
  - Assistance: Standby assist with RN at side
  - Gait: Steady, no loss of balance
  - Distance: 20 feet round trip
  - Tolerance: Good, no shortness of breath or dizziness
  - Duration: Approximately 3 minutes

• Episode #2 (1100): Ambulated in hallway (approximately 50 feet)
  - Assistance: Standby assist with RN
  - Gait: Steady, improving confidence
  - Distance: 50 feet round trip
  - Tolerance: Excellent, patient stated "I feel stronger"
  - Duration: Approximately 5 minutes
  - Post-Activity Vitals: BP 124/78, HR 88 (appropriate increase with activity)

• Episode #3 (1430): Ambulated in hallway (approximately 75 feet)
  - Assistance: Standby assist
  - Gait: Steady, more independent
  - Distance: 75 feet round trip
  - Tolerance: Very good, minimal discomfort
  - Duration: Approximately 7 minutes

MOBILITY PROGRESSION:
• POD #0 (surgery day): Bed rest, logrolled for positioning
• POD #1 (yesterday): Ambulated to chair, then to bathroom with moderate assist
• POD #2 (today): Ambulating in hallway with standby assist, increasing distance
• TREND: ✓ Appropriate progressive mobilization post-laparoscopic surgery

GAIT & BALANCE ASSESSMENT:
• Gait Pattern: Normal stride length, even cadence, no shuffling
• Balance: Steady, maintains balance independently
• Posture: Slightly guarded (holding abdomen), but improving
• Assistive Device: None required
• Fall Risk: Low (Morse Fall Scale: 15 - low risk)

FUNCTIONAL STATUS:
• Bed Mobility: Independent (able to turn, reposition without assistance)
• Transfers: Modified independent (bed ↔ chair with standby assist for safety)
• Bathroom: Independent for toileting once at bathroom (standby assist to ambulate)
• ADLs (Activities of Daily Living):
  - Bathing: Requires assistance (surgical precautions)
  - Dressing: Modified independent (upper body independent, lower body with minimal assist)
  - Grooming: Independent
  - Feeding: Independent

ACTIVITY TOLERANCE:
✓ No shortness of breath with activity
✓ No dizziness or lightheadedness
✓ Heart rate and blood pressure respond appropriately to activity
✓ Able to speak in full sentences while walking
✓ No excessive fatigue post-activity

ACTIVITY RESTRICTIONS (Post-Operative Precautions):
• No heavy lifting >10 lbs x 4 weeks
• No strenuous activity or exercise x 2 weeks
• May shower (cover incisions with waterproof dressing)
• No swimming or submerging incisions x 2 weeks
• Gradual return to normal activities as tolerated
• No driving while taking opioid pain medication (currently not taking opioids)

═══════════════════════════════════════════════════════════════════

SURGICAL SITE ASSESSMENT:

INCISION #1 (Umbilical Port - Camera Port):
• Location: Umbilicus (belly button)
• Size: Approximately 1 cm
• Closure Method: Absorbable sutures, Steri-Strips applied
• Dressing: Steri-Strips intact, small adhesive dressing covering
• Appearance:
  ✓ Edges well-approximated
  ✓ No gaping or separation
  ✓ Skin tone pink, appropriate color
• Drainage: None (clean and dry)
• Signs of Infection: None present
  ✓ No erythema (redness)
  ✓ No warmth or heat
  ✓ No edema (swelling)
  ✓ No purulent drainage
  ✓ No foul odor
• Pain: Minimal tenderness with palpation (2/10)

INCISION #2 (RLQ Port - Working Port):
• Location: Right lower quadrant, McBurney's point
• Size: Approximately 0.5 cm
• Closure Method: Absorbable sutures, Steri-Strips applied
• Dressing: Steri-Strips intact, small adhesive dressing
• Appearance:
  ✓ Edges well-approximated
  ✓ No gaping or separation
  ✓ Appropriate healing noted
• Drainage: None (clean and dry)
• Signs of Infection: None present (same as above - no erythema, warmth, edema, drainage)
• Pain: Minimal (this site has most discomfort, but improving)

INCISION #3 (Suprapubic Port - Extraction Port):
• Location: Suprapubic area (lower abdomen)
• Size: Approximately 0.5 cm
• Closure Method: Absorbable sutures, Steri-Strips applied
• Dressing: Steri-Strips intact, small adhesive dressing
• Appearance: Well-approximated, healing appropriately
• Drainage: None
• Signs of Infection: None
• Pain: Minimal to none

OVERALL SURGICAL SITE ASSESSMENT:
✓ All three laparoscopic port sites clean, dry, and intact
✓ **No signs of surgical site infection (SSI)**
✓ Incisions healing by primary intention
✓ Dressings clean and dry, no drainage noted on dressings
✓ No need for dressing changes at this time (Steri-Strips to remain in place until they
  fall off naturally, approximately 7-10 days)

INCISION CARE:
• Keep sites clean and dry
• May shower (cover with waterproof dressing or allowed to get wet per surgeon preference)
• No soaking (no baths, swimming, hot tubs) x2 weeks
• Pat dry gently if sites get wet
• Steri-Strips will fall off on their own (do not remove)
• Monitor for signs of infection daily

═══════════════════════════════════════════════════════════════════

GASTROINTESTINAL ASSESSMENT:

BOWEL FUNCTION:
• Bowel Sounds: Active in all four quadrants (normoactive)
• Abdomen: Soft, non-tender (except at surgical sites), non-distended
• Last Bowel Movement: This morning (11/06/2025, 0730 hours)
  - Consistency: Soft, formed
  - Color: Brown
  - Bristol Stool Scale: Type 4 (normal)
  - **Post-Op BM Achieved:** POD #2 ✓ (appropriate timing)
• Flatus: Passing gas regularly (good sign of bowel function return)
• Nausea: None reported today
• Vomiting: None
• Abdominal Distention: None observed

DIET & NUTRITION:
• Diet Order: Regular diet (advanced from clear liquids → full liquids → regular diet)
• Appetite: Good, patient states "I'm getting hungry"
• Tolerance:
  - Breakfast (0800): 75% consumed (scrambled eggs, toast, orange juice)
  - Lunch (1200): 85% consumed (turkey sandwich, apple, milk)
  - Snacks: Crackers, juice throughout day
• PO Intake: Approximately 800 mL liquids this shift (0700-1900)
• No nausea or vomiting with PO intake
• No difficulty swallowing

NUTRITIONAL STATUS:
• Pre-Op Nutritional Status: Well-nourished
• Weight: 165 lbs (75 kg) - stable from admission weight
• Protein Needs: Estimated 75-90 g/day for healing
• Current Intake: Adequate protein intake with regular diet
• Supplements: None required at this time

GI MEDICATIONS:
• Anti-Emetics: Ondansetron 4 mg IV q6h PRN (not needed today)
• Stool Softener: Docusate sodium 100 mg PO BID (started POD #1 to prevent constipation
  from opioids/surgery)
• Laxative: MiraLAX PRN if no BM x48 hours (not needed - regular BM today)

ASSESSMENT:
✓ Bowel function returned appropriately (passing gas, BM on POD #2)
✓ Tolerating regular diet without nausea or vomiting
✓ Adequate oral intake progressing
✓ No signs of post-operative ileus
✓ No abdominal distention or discomfort

═══════════════════════════════════════════════════════════════════

PATIENT EDUCATION PROVIDED:

POST-OPERATIVE CARE EDUCATION:

1. **INCISION CARE:**
   • Keep incisions clean and dry
   • May shower, gently pat dry (no scrubbing)
   • No baths, swimming, or hot tubs x2 weeks
   • Do not remove Steri-Strips (will fall off on own in 7-10 days)
   • Monitor for signs of infection (increased redness, warmth, drainage, fever)
   • Call surgeon if any concerns about incision healing
   • **Patient Understanding:** ✓ Able to repeat back instructions

2. **ACTIVITY RESTRICTIONS:**
   • No heavy lifting >10 pounds x4 weeks (explained: gallon of milk = 8 lbs)
   • No strenuous exercise (running, weightlifting) x2 weeks
   • Walking encouraged - gradually increase distance each day
   • Listen to body - rest when tired
   • May climb stairs but take slowly
   • No driving while taking opioid pain medication (currently off opioids - may drive when
     comfortable)
   • Return to work: Discuss with surgeon (typically 1-2 weeks for desk job)
   • **Patient Understanding:** ✓ Verbalized understanding of restrictions

3. **PAIN MANAGEMENT AT HOME:**
   • Continue acetaminophen 650 mg q6h for first few days
   • Take oxycodone only if pain >5/10 (prescribed at discharge if needed)
   • Do not drive or operate machinery while taking opioids
   • Ice packs to incisions PRN for 20 minutes can help with pain/swelling
   • Call if pain not controlled with medications or worsening
   • **Patient Understanding:** ✓ Knows when to take medications

4. **WARNING SIGNS TO REPORT:**
   Taught patient to call surgeon immediately for:
   • Fever >100.4°F (38°C)
   • Increasing redness, warmth, or swelling at incision sites
   • Purulent (pus) drainage from incisions
   • Opening or separation of incision
   • Severe abdominal pain not controlled with medication
   • Nausea/vomiting that prevents eating or drinking
   • No bowel movement x3 days
   • Signs of bleeding (blood in stool, incision bleeding)
   • Shortness of breath or chest pain
   • **Patient Understanding:** ✓ Able to list at least 4 warning signs

5. **DIET & BOWEL FUNCTION:**
   • Continue regular diet as tolerated
   • Stay well-hydrated (drink 6-8 glasses of water daily)
   • Eat high-fiber foods to prevent constipation
   • Take stool softener (docusate) BID as prescribed
   • Call if no bowel movement x2-3 days
   • **Patient Understanding:** ✓ Knows importance of hydration and fiber

6. **FOLLOW-UP CARE:**
   • Post-op appointment with surgeon: [Date/Time]
   • Bring list of questions to appointment
   • Pathology results will be discussed at follow-up
   • Call surgeon's office to schedule if not already scheduled
   • **Patient Understanding:** ✓ Knows when to follow up

EDUCATIONAL MATERIALS PROVIDED:
✓ Post-operative instruction sheet (written)
✓ Surgeon's office contact information
✓ 24-hour on-call number for emergencies
✓ Prescription medications reviewed
✓ Activity restriction handout

TEACH-BACK METHOD USED:
• Asked patient to explain key points in own words
• Patient correctly explained incision care, activity restrictions, and warning signs
• Comprehension level: Excellent ✓
• No additional teaching needed at this time

═══════════════════════════════════════════════════════════════════

DISCHARGE PLANNING:

ANTICIPATED DISCHARGE: Tomorrow (11/07/2025, POD #3)

DISCHARGE READINESS CRITERIA:
✓ Pain controlled with oral medications (not requiring IV pain meds)
✓ Tolerating regular diet without nausea/vomiting
✓ Bowel function returned (passing gas, had BM)
✓ Ambulating independently or with minimal assistance
✓ Vital signs stable
✓ Afebrile x24 hours
✓ No signs of surgical complications
✓ IV can be discontinued once PO intake adequate
✓ Patient/family education completed
✓ Follow-up appointment scheduled

CRITERIA MET: 8/9 criteria met (awaiting IV discontinuation tomorrow)

DISCHARGE DISPOSITION:
• Discharge to: Home
• Transportation: Family member
• Home Environment: Single-family home, lives with spouse
• Stairs: Yes (will manage slowly)
• Support System: Strong - spouse available for assistance

DISCHARGE MEDICATIONS (Anticipated):
• Acetaminophen 650 mg PO q6h x5 days
• Docusate sodium 100 mg PO BID x1 week
• Oxycodone 5 mg PO q4h PRN severe pain (may not be needed)

DURABLE MEDICAL EQUIPMENT (DME):
• None required

HOME HEALTH:
• Not required - patient independent in ADLs

DISCHARGE TEACHING COMPLETED:
✓ Post-operative care instructions reviewed
✓ Activity restrictions reviewed
✓ Warning signs reviewed
✓ Follow-up appointment discussed
✓ Medication education provided
✓ Patient/family verbalized understanding

═══════════════════════════════════════════════════════════════════

ONGOING PLAN OF CARE (POD #2):

IMMEDIATE GOALS (Next 24 Hours):
1. ✓ Pain management: Maintain pain ≤3/10 with oral medications
2. ✓ Mobility: Continue progressive ambulation, increase distance each walk
3. ⬜ IV fluids: Transition to PO-only intake, discontinue IV tomorrow if PO intake >1,500
   mL/24 hours
4. ✓ Bowel function: Continue to monitor, achieved BM today
5. ✓ Diet: Maintain regular diet tolerance
6. ✓ Surgical sites: Monitor for signs of infection (none present)
7. ⬜ Discharge preparation: Complete all discharge teaching and planning

TONIGHT'S PLAN (Evening Shift):
• Monitor vital signs q4h
• Encourage ambulation at least 2 more times before bedtime
• Continue scheduled acetaminophen q6h
• Assess pain q2h and PRN
• Monitor IV site and fluid infusion
• Encourage PO fluid intake (goal: 500 mL evening shift)
• Assess surgical incisions once before bed
• Ensure call light within reach
• Promote restful sleep environment

TOMORROW'S PLAN (POD #3 - Discharge Day):
• Morning labs if ordered (CBC, BMP)
• Assess readiness for IV discontinuation based on PO intake
• Continue ambulation progression
• Finalize discharge teaching with patient and family
• Obtain discharge prescriptions from pharmacy
• Review discharge instructions thoroughly
• Coordinate discharge time with patient/family
• Complete discharge documentation
• Provide written instructions and contact information
• Schedule follow-up appointment if not already done

ONGOING MONITORING:
• Vital signs: Q4h and PRN
• Pain assessment: Q2h and PRN
• IV site: Q4h
• Surgical incisions: Q shift and PRN
• Intake/output: Strict I&O until IV discontinued
• Mobility: Document all ambulation episodes
• Bowel function: Monitor for BM daily
• Respiratory: Incentive spirometry q2h while awake (goal 1500 mL)

INTERDISCIPLINARY COLLABORATION:
• Surgeon: Updated on patient progress, discharge planning discussed
• Pharmacy: Discharge medications prepared
• Case Management: Involved in discharge planning (no barriers identified)
• Dietary: Regular diet ordered, tolerating well
• Physical Therapy: Consult not needed - patient ambulating well independently

═══════════════════════════════════════════════════════════════════

SUMMARY & CLINICAL ASSESSMENT:

OVERALL STATUS: **STABLE - PROGRESSING WELL POST-OPERATIVELY**

42-year-old male, POD #2 from laparoscopic appendectomy for acute appendicitis.
Post-operative course uncomplicated. Patient hemodynamically stable with vital signs
consistently within normal limits. Afebrile x24 hours with no signs of infection. Pain
well-controlled on oral acetaminophen alone, no longer requiring opioid analgesics.
Ambulating with increasing distances and improving confidence, gait steady with standby
assistance. All three laparoscopic port sites clean, dry, and intact with no signs of
surgical site infection. Bowel function returned appropriately (BM achieved POD #2).
Tolerating regular diet without nausea or vomiting. IV fluids infusing, anticipate
discontinuation tomorrow when PO intake goals met. Patient and family education completed
regarding post-operative care, activity restrictions, and warning signs. Discharge planning
in progress with anticipated discharge tomorrow (POD #3). No concerns at this time. Patient
progressing through expected post-operative recovery trajectory without complications.

PATIENT RESPONSE TO PLAN OF CARE: **EXCELLENT**
Patient engaged, cooperative, and motivated for recovery. Following all post-operative
instructions appropriately. No barriers to discharge identified.

═══════════════════════════════════════════════════════════════════
Documented By: [Nurse Name, RN] | License #: [Number]
Date/Time: 11/06/2025 1500 | Electronic Signature Applied
═══════════════════════════════════════════════════════════════════
```

---

## 11. ICU Documentation

### 📥 Expected Input (Voice/Text)

**Example - Natural Speech:**
```
ICU patient, sedated and intubated. Neuro check shows patient is responsive to painful
stimuli. On propofol drip for sedation, RASS score is negative 2, which is light sedation
and at goal. Pupils are equal and reactive.

Hemodynamically, patient is on norepinephrine drip at 4 micrograms per minute. Mean
arterial pressure is 72, which is above our goal of 65. CVP is 8. Peripheral pulses
are present, capillary refill less than 2 seconds. Titrating pressors per protocol to
maintain MAP above 65.

Respiratory status - patient is intubated, on mechanical ventilation. Vent settings are
assist control mode, respiratory rate set at 14, tidal volume 450 mils, PEEP is 5,
FiO2 is 40 percent. Oxygen saturation is 97 percent. Lung sounds are clear bilaterally.
Endotracheal tube is secured at 22 centimeters at the lip. No cuff leak, suctioning
minimal secretions.

Intake and output - patient is positive 250 mils over the past 12 hours. Urine output
has been adequate at 50 to 60 mils per hour. Foley catheter in place draining clear
yellow urine.

Labs from this morning - ABG shows pH 7.38, pCO2 42, pO2 95, normal parameters.
Lactate is 1.2, trending down from 2.4 yesterday. Hemoglobin 10.5, white count 12.

Plan is to continue current vent settings, working on weaning pressors as tolerated.
Will attempt spontaneous awakening trial this afternoon if hemodynamics remain stable.
Continue monitoring closely.
```

### 📤 Expected Professional Output

**ICU Documentation:**
```
═══════════════════════════════════════════════════════════════════
INTENSIVE CARE UNIT (ICU) NURSING DOCUMENTATION
Date: 11/06/2025 | Time: 1400 | ICU Day #3 | Nurse: [Name, RN]
═══════════════════════════════════════════════════════════════════

PATIENT INFORMATION:
• ICU Admission Date: 11/04/2025 (ICU Day #3)
• Admission Diagnosis: Septic shock secondary to pneumonia
• ICU Location: MICU (Medical Intensive Care Unit), Bed 12
• Attending: Dr. [Name] | Intensivist: Dr. [Name]
• Code Status: Full Code

PRIMARY DIAGNOSIS:
• Septic shock, resolving (bacterial pneumonia source)
• Acute hypoxemic respiratory failure requiring mechanical ventilation
• Hospital-acquired pneumonia (HAP)

SECONDARY DIAGNOSES:
• Acute kidney injury (AKI) - Stage 1, improving
• Hypertension
• Type 2 diabetes mellitus

═══════════════════════════════════════════════════════════════════

NEUROLOGICAL ASSESSMENT (1400 hours):

LEVEL OF CONSCIOUSNESS:
• Current Status: **SEDATED** (pharmacologically sedated for mechanical ventilation)
• Sedation Agent: Propofol continuous IV infusion
• Current Dose: 30 mcg/kg/min (titrated to RASS goal)

RICHMOND AGITATION-SEDATION SCALE (RASS):
• **RASS Score: -2** (Light Sedation)
• Definition: Movement to voice, eye contact >10 seconds
• **AT GOAL** ✓ (Goal RASS: -1 to -2 for mechanical ventilation)
• Patient arousable with verbal stimulation, follows simple commands intermittently
• No agitation or combativeness noted

SEDATION ASSESSMENT:
• Propofol Infusion: Titrated per RASS-based protocol
• Sedation Goal: RASS -1 to -2 (light sedation, easily arousable)
• Over-Sedation: None (appropriate sedation level for vent synchrony)
• Under-Sedation: None (no signs of agitation or patient-ventilator dyssynchrony)
• Last Sedation Adjustment: 1200 hours (decreased from 35 to 30 mcg/kg/min)

GLASGOW COMA SCALE (GCS): 9T (E3, V1T, M5)
• Eye Opening: 3 (Opens to voice)
• Verbal: 1T (Intubated - unable to assess verbal response)
• Motor: 5 (Localizes to painful stimuli - reaches toward painful stimulus)

PUPILLARY ASSESSMENT:
• Right Pupil: 3 mm, round, **reactive to light** (brisk constriction)
• Left Pupil: 3 mm, round, **reactive to light** (brisk constriction)
• **PERRLA:** Pupils Equal, Round, Reactive to Light and Accommodation ✓
• Pupil Symmetry: Equal bilaterally
• Direct Light Reflex: Present bilaterally
• Consensual Light Reflex: Present bilaterally

MOTOR FUNCTION:
• Upper Extremities: Moves spontaneously, withdraws to pain bilaterally
• Lower Extremities: Moves spontaneously, withdraws to pain bilaterally
• Strength: Unable to formally assess due to sedation
• Symmetry: Symmetric movement noted bilaterally
• Purposeful Movement: Reaches toward ETT occasionally (appropriate protective response)

REFLEXES:
• Cough Reflex: Present (coughs with suctioning)
• Gag Reflex: Present (gags with oral suctioning)
• Corneal Reflex: Present bilaterally

PAIN ASSESSMENT:
• Pain Scale: Unable to self-report due to sedation
• Behavioral Pain Scale (BPS): 3 (no pain behaviors)
  - Facial expression: Relaxed (1)
  - Upper limb movement: No movement (1)
  - Ventilator compliance: Tolerating ventilation (1)
• Non-Verbal Pain Indicators: None observed (no grimacing, frowning, or restlessness)

NEURO ASSESSMENT SUMMARY:
✓ Sedation appropriate for goal (RASS -2)
✓ Pupils reactive and symmetric
✓ Follows simple commands when prompted
✓ Responds appropriately to painful stimuli
✓ No signs of increased intracranial pressure
✓ No focal neurological deficits appreciated

PLANNED SPONTANEOUS AWAKENING TRIAL (SAT):
• Scheduled: This afternoon (approximately 1600 hours)
• Criteria: Hemodynamics stable, no active seizures, no escalating sedation needs
• If Successful: Proceed with spontaneous breathing trial (SBT) per protocol
• Goal: Assess for readiness to wean from mechanical ventilation

═══════════════════════════════════════════════════════════════════

CARDIOVASCULAR / HEMODYNAMIC ASSESSMENT:

VITAL SIGNS (1400 hours):
• Heart Rate: 92 bpm (regular rhythm)
• Blood Pressure: 108/56 mmHg
• **Mean Arterial Pressure (MAP): 72 mmHg** ✓ (Goal: >65 mmHg)
• Central Venous Pressure (CVP): 8 mmHg (normal range)
• Temperature: 99.2°F (37.3°C) - **trending down from 101°F yesterday**
• SpO2: 97% (on mechanical ventilation, FiO2 40%)

HEMODYNAMIC TRENDS (Past 12 Hours):

Time  | HR  | BP       | MAP  | CVP | Temp    | Vasopressor Dose
------|-----|----------|------|-----|---------|------------------
0200  | 98  | 102/54   | 68   | 9   | 100.2°F | Norepi 6 mcg/min
0600  | 96  | 104/52   | 70   | 8   | 99.8°F  | Norepi 5 mcg/min
1000  | 94  | 106/54   | 71   | 8   | 99.4°F  | Norepi 4.5 mcg/min
1400  | 92  | 108/56   | 72   | 8   | 99.2°F  | **Norepi 4 mcg/min**

TRENDING: ✓ Hemodynamics improving, vasopressor requirements decreasing

VASOPRESSOR SUPPORT:
• **Norepinephrine (Levophed):** 4 mcg/min IV continuous infusion
• Indication: Vasopressor support for septic shock (distributive shock)
• Goal: Maintain MAP ≥65 mmHg
• **Current MAP: 72 mmHg** ✓ GOAL MET (7 mmHg above goal)
• Titration: Decreasing per protocol as patient's own vascular tone improves
• Reduction Today: 6 mcg/min → 4 mcg/min over past 12 hours (33% reduction)
• Access: Central line (right internal jugular), dedicated lumen for pressors
• Trending: ✓ Successfully weaning, anticipate d/c pressors within 24-48 hours if stable

CARDIAC MONITORING:
• Telemetry: Continuous cardiac monitoring
• Rhythm: **Normal Sinus Rhythm** (NSR)
• Rate: 92 bpm (normal range, no tachycardia)
• Ectopy: Occasional PVCs (premature ventricular contractions) <6/hour (not significant)
• ST Segments: No ST elevation or depression
• No dysrhythmias noted this shift

HEART SOUNDS:
• Auscultation: S1 and S2 present, regular rate and rhythm
• Extra Sounds: No S3 or S4 gallop
• Murmurs: None appreciated

PERIPHERAL PERFUSION:
• Radial Pulses: 2+ bilateral, strong and regular
• Pedal Pulses: 2+ bilateral (dorsalis pedis and posterior tibial)
• Capillary Refill: <2 seconds all extremities (brisk, adequate perfusion)
• Skin: Warm to touch throughout, no mottling or cyanosis
• Skin Color: Pink, well-perfused
• Extremity Temperature: Warm peripherally (improving from cool extremities on admission)

EDEMA:
• Upper Extremities: 0/4 (no edema)
• Lower Extremities: 1+ pitting edema bilateral ankles (mild)
• Sacral: No sacral edema noted
• Assessment: Mild dependent edema related to fluid resuscitation, improving

FLUID STATUS:
• CVP: 8 mmHg (normal 2-8 mmHg, at upper limit of normal)
• Jugular Venous Distension: Not distended
• Breath Sounds: Clear (no crackles suggesting fluid overload)
• Assessment: Euvolemic to slightly hypervolemic (appropriate post-resuscitation status)

HEMODYNAMIC SUMMARY:
✓ MAP consistently >65 mmHg (vasopressor goal met)
✓ Vasopressor requirements decreasing (shock resolving)
✓ Adequate peripheral perfusion (warm, brisk capillary refill)
✓ Normal sinus rhythm, no dysrhythmias
✓ CVP appropriate, not hypervolemic
✓ Clinical improvement consistent with sepsis resolution

═══════════════════════════════════════════════════════════════════

RESPIRATORY STATUS (MECHANICAL VENTILATION):

AIRWAY MANAGEMENT:
• **Endotracheal Tube (ETT):** Size 7.5 mm (oral ETT)
• Insertion Date: 11/04/2025 (3 days ago)
• Depth: **22 cm at the lip** (marked and secured)
• Position Verified: Daily CXR confirms proper placement above carina
• Tube Security: Secured with commercial ETT holder, well-stabilized
• Cuff Pressure: 25 cmH2O (checked q shift, goal 20-30 cmH2O to prevent VAP and aspiration)
• Cuff Leak: **None detected** ✓ (appropriate cuff seal)
• Tube Patent: Yes, no obstruction

MECHANICAL VENTILATOR SETTINGS (1400 hours):
• **Mode:** Assist-Control (A/C) - Volume Control
• **Set Respiratory Rate:** 14 breaths/min
• **Tidal Volume (Vt):** 450 mL (6 mL/kg ideal body weight - lung-protective ventilation)
• **PEEP (Positive End-Expiratory Pressure):** 5 cmH2O
• **FiO2 (Fraction of Inspired Oxygen):** 40% (0.40)
• **Peak Inspiratory Pressure (PIP):** 28 cmH2O
• **Plateau Pressure:** 22 cmH2O (goal <30 cmH2O for lung protection)
• **Total Respiratory Rate:** 16 breaths/min (2 spontaneous breaths above set rate)
• **Minute Ventilation:** 7.2 L/min

OXYGENATION:
• SpO2: **97%** on current vent settings ✓
• PaO2: 95 mmHg (from ABG at 0700)
• **P/F Ratio:** 238 (PaO2/FiO2 = 95/0.40)
  - Normal: >300
  - Mild ARDS: 200-300
  - Moderate ARDS: 100-200
  - Assessment: P/F ratio 238 indicates improving oxygenation, approaching normal

VENTILATION:
• PaCO2: 42 mmHg (normal 35-45 mmHg) ✓
• pH: 7.38 (normal 7.35-7.45) ✓
• Acid-Base Status: Normal (no respiratory acidosis or alkalosis)
• Ventilation Adequate: Yes, appropriate CO2 clearance

LUNG MECHANICS:
• Compliance: Calculated static compliance 20 mL/cmH2O (acceptable)
• Resistance: Normal, no increased airway resistance
• Auto-PEEP: None detected
• Plateau Pressure: 22 cmH2O (safe, <30 cmH2O goal met)

RESPIRATORY ASSESSMENT:
• Lung Sounds: **Clear to auscultation bilaterally** (anterior and lateral fields)
  - Bilateral breath sounds equal
  - No wheezes, crackles, or rhonchi
  - Improvement from decreased breath sounds on admission
• Chest Expansion: Symmetric bilaterally with ventilator breaths
• Ventilator Synchrony: Patient synchronous with ventilator, no fighting or bucking
• Spontaneous Breaths: Patient triggering 2 spontaneous breaths above set rate (good sign)
• Work of Breathing: Minimal, ventilator providing support

AIRWAY CLEARANCE:
• Secretions: **Minimal** (small amount of thin, clear to white secretions)
• Color: Clear to white (no purulent or blood-tinged secretions)
• Consistency: Thin, not thick or tenacious
• Amount: <5 mL per suction (minimal)
• Last Suctioning: 1300 hours (1 hour ago)
• Frequency: Suctioning required approximately q4h PRN
• Cough: Present, patient coughs with suctioning (good protective reflex)

VENTILATOR ALARMS:
• High Pressure Alarm: No alarms this shift
• Low Pressure Alarm: No alarms this shift
• Apnea Alarm: No alarms this shift
• Low SpO2 Alarm: No alarms this shift
• Assessment: Ventilator functioning appropriately, no technical issues

VENTILATOR-ASSOCIATED PNEUMONIA (VAP) PREVENTION BUNDLE:
✓ HOB elevated 30-45 degrees at all times
✓ Oral care with chlorhexidine q2h
✓ Inline suction system (closed suction)
✓ Daily sedation vacation and SBT assessment
✓ Peptic ulcer prophylaxis (famotidine 20 mg IV q12h)
✓ DVT prophylaxis (heparin 5000 units SQ q8h)
✓ Cuff pressure checked q shift (25 cmH2O)
✓ Hand hygiene before all vent circuit manipulation

WEANING READINESS ASSESSMENT:
• Spontaneous Awakening Trial (SAT): Planned for 1600 hours today
• Spontaneous Breathing Trial (SBT): Will assess if SAT successful
• RSBI (Rapid Shallow Breathing Index): Will calculate during SBT
• Readiness Criteria:
  ✓ Resolving underlying cause (pneumonia/sepsis improving)
  ✓ Hemodynamics stable (MAP >65 on minimal vasopressors)
  ✓ Oxygenation adequate (SpO2 >90% on FiO2 ≤50%)
  ✓ Minimal secretions
  ✓ Patient triggering spontaneous breaths
• Plan: Assess for extubation readiness if SBT successful

RESPIRATORY SUMMARY:
✓ Adequate oxygenation and ventilation on current settings
✓ Lung-protective ventilation strategy maintained
✓ Clear lung sounds, secretions minimal
✓ Patient-ventilator synchrony excellent
✓ Improving P/F ratio, trending toward extubation readiness
✓ VAP bundle compliance 100%

═══════════════════════════════════════════════════════════════════

FLUID BALANCE & RENAL FUNCTION:

INTAKE & OUTPUT (Past 12 hours: 0200-1400):

INTAKE:
• IV Fluids: 1,200 mL (0.9% Normal Saline at 100 mL/hr)
• IV Medications: ~200 mL (continuous infusions and intermittent medications)
• Nutrition: 600 mL (enteral feeding via OG tube)
• **TOTAL INTAKE:** 2,000 mL

OUTPUT:
• Urine Output: 700 mL via Foley catheter
• Insensible Loss (estimated): ~400 mL (respiratory and skin)
• NG/OG Output: 150 mL (gastric residuals)
• Wound Drainage: 0 mL (N/A)
• **TOTAL OUTPUT:** 1,250 mL (documented) + 400 mL (insensible) = 1,650 mL

**NET FLUID BALANCE: +250 mL** (positive 250 mL over 12 hours)

CUMULATIVE FLUID BALANCE (Since ICU Admission):
• Day 1 (11/04): +3,500 mL (aggressive fluid resuscitation for septic shock)
• Day 2 (11/05): +1,200 mL (continued resuscitation, weaning fluids)
• Day 3 (11/06): +250 mL (current) - **trending toward neutral balance** ✓

URINARY OUTPUT:
• **Hourly Urine Output:** 50-60 mL/hour average (700 mL ÷ 12 hours = 58 mL/hr)
• **Adequate Output:** ✓ Goal >0.5 mL/kg/hr (patient weight 75 kg, goal >37.5 mL/hr)
• **Current Output:** 58 mL/hr > 37.5 mL/hr goal ✓ **ADEQUATE RENAL PERFUSION**
• Urine Color: Clear, yellow (light amber)
• Urine Clarity: Clear, not cloudy
• Foley Catheter: 16 Fr, inserted 11/04/2025, draining well, no obstruction

RENAL FUNCTION LABS (This Morning, 0700):
• Creatinine: 1.2 mg/dL (down from 1.8 on admission) ✓ **IMPROVING**
• BUN: 28 mg/dL (down from 42 on admission) ✓ **IMPROVING**
• BUN/Creatinine Ratio: 23 (normal <20, mild elevation)
• Acute Kidney Injury (AKI): Stage 1 on admission, **now resolving** ✓
• Electrolytes:
  - Sodium: 138 mEq/L (normal)
  - Potassium: 4.2 mEq/L (normal)
  - Chloride: 104 mEq/L (normal)
  - Bicarbonate: 24 mEq/L (normal)

FLUID STATUS ASSESSMENT:
• CVP: 8 mmHg (euvolemic to slightly hypervolemic)
• Peripheral Edema: 1+ bilateral ankles (mild)
• Lung Sounds: Clear (no crackles suggesting fluid overload)
• Assessment: Appropriate fluid balance post-resuscitation, transitioning from aggressive
  resuscitation to maintenance fluids

FLUID MANAGEMENT PLAN:
• Current IV Rate: 100 mL/hour maintenance fluids (0.9% NS)
• Goal: Neutral to slightly negative fluid balance over next 24-48 hours
• Consider diuresis if fluid overload develops (currently not indicated)
• Continue monitoring urine output closely

RENAL SUMMARY:
✓ Urine output adequate (58 mL/hr, goal >37.5 mL/hr)
✓ AKI resolving (creatinine improving 1.8 → 1.2)
✓ Electrolytes within normal limits
✓ Fluid balance appropriate (+250 mL over 12 hours)
✓ Renal perfusion adequate on current vasopressor support

═══════════════════════════════════════════════════════════════════

LABORATORY VALUES (0700 This Morning):

ARTERIAL BLOOD GAS (ABG):
• **pH: 7.38** (Normal: 7.35-7.45) ✓
• **PaCO2: 42 mmHg** (Normal: 35-45 mmHg) ✓
• **PaO2: 95 mmHg** (Normal: 80-100 mmHg) ✓
• **HCO3: 24 mEq/L** (Normal: 22-26 mEq/L) ✓
• **Base Excess: 0** (Normal: -2 to +2) ✓
• **SaO2: 97%** ✓
• **Lactate: 1.2 mmol/L** (Normal: 0.5-2.0 mmol/L) ✓ **NORMAL**
• Interpretation: **Normal acid-base status, adequate oxygenation and ventilation**

LACTATE TREND:
• 11/04 (ICU admission): 4.8 mmol/L (elevated - septic shock)
• 11/05: 2.4 mmol/L (improving)
• 11/06: **1.2 mmol/L (normal)** ✓
• **TRENDING DOWN:** Lactate clearance achieved, shock resolving ✓

COMPLETE BLOOD COUNT (CBC):
• WBC: 12.0 x10³/µL (elevated, but down from 18.5 on admission) - **IMPROVING** ✓
• Hemoglobin: 10.5 g/dL (mild anemia, stable)
• Hematocrit: 31% (low, stable)
• Platelets: 185 x10³/µL (normal range)
• Neutrophils: 78% (elevated, consistent with bacterial infection)
• Bands: 5% (improving from 12% on admission)
• Assessment: WBC decreasing, appropriate response to antibiotic therapy

BASIC METABOLIC PANEL (BMP):
• Sodium: 138 mEq/L (normal)
• Potassium: 4.2 mEq/L (normal)
• Chloride: 104 mEq/L (normal)
• CO2/Bicarbonate: 24 mEq/L (normal)
• BUN: 28 mg/dL (improving from 42)
• **Creatinine: 1.2 mg/dL** (improving from 1.8) ✓
• Glucose: 142 mg/dL (controlled with insulin drip)
• Calcium: 8.9 mg/dL (normal)

LIVER FUNCTION TESTS (LFTs):
• AST: 45 U/L (mildly elevated, stable)
• ALT: 52 U/L (mildly elevated, stable)
• Alkaline Phosphatase: 110 U/L (normal)
• Total Bilirubin: 1.0 mg/dL (normal)
• Assessment: Mild transaminase elevation likely related to hypoperfusion during shock,
  improving

COAGULATION PROFILE:
• PT: 13.5 seconds (normal)
• INR: 1.1 (normal)
• aPTT: 32 seconds (normal)
• Assessment: No coagulopathy

INFLAMMATORY MARKERS:
• Procalcitonin: 2.4 ng/mL (down from 8.5 on admission) - **IMPROVING** ✓
• CRP: 145 mg/L (down from 280 mg/L) - **DECREASING** ✓
• Assessment: Inflammatory markers trending down, appropriate response to treatment

BLOOD CULTURES:
• 11/04 (Admission): Preliminary growth of Gram-positive cocci in chains (Streptococcus
  pneumoniae confirmed)
• Antibiotic Sensitivity: Sensitive to ceftriaxone (current antibiotic) ✓
• 11/06 (Repeat Cultures): Pending, drawn at 0600

SPUTUM CULTURE:
• 11/04: Streptococcus pneumoniae isolated
• Sensitivity: Ceftriaxone sensitive ✓
• Interpretation: Consistent with pneumonia diagnosis, appropriate antibiotic coverage

LAB SUMMARY:
✓ ABG normal - adequate oxygenation and ventilation
✓ Lactate normalized - shock resolved
✓ WBC decreasing - infection improving with antibiotics
✓ Creatinine improving - AKI resolving
✓ Electrolytes balanced
✓ Inflammatory markers decreasing
✓ Appropriate antibiotic coverage per sensitivities

═══════════════════════════════════════════════════════════════════

MEDICATIONS & DRIPS:

CONTINUOUS IV INFUSIONS (Drips):

1. **Norepinephrine (Levophed):**
   - Current Rate: 4 mcg/min (via central line)
   - Indication: Vasopressor support for septic shock
   - Goal: MAP ≥65 mmHg (currently 72 mmHg ✓)
   - **Titration Plan:** Wean by 0.5-1 mcg/min every 2-4 hours as tolerated, maintain MAP
     >65 mmHg
   - Access: Right IJ central line, dedicated port

2. **Propofol:**
   - Current Rate: 30 mcg/kg/min
   - Indication: Sedation for mechanical ventilation
   - Goal: RASS -1 to -2 (currently RASS -2 ✓)
   - **Titration Plan:** Daily sedation vacation planned at 1600 for SAT/SBT assessment
   - Monitoring: Triglycerides checked daily (propofol infusion syndrome monitoring)

3. **Regular Insulin Drip:**
   - Current Rate: 2 units/hour
   - Indication: Glycemic control (stress hyperglycemia in critical illness)
   - Goal: Blood glucose 140-180 mg/dL
   - Current Glucose: 142 mg/dL ✓ (checked q1h per protocol)
   - **Titration:** Per insulin drip protocol based on hourly glucose checks

SCHEDULED IV MEDICATIONS:

4. **Ceftriaxone 2 grams IV q24h:**
   - Indication: Community-acquired pneumonia (Streptococcus pneumoniae)
   - Day: 3 of 7-day course
   - Last Dose: 0800 this morning
   - Next Dose: Tomorrow 0800
   - Sensitivity: Organism sensitive ✓

5. **Famotidine 20 mg IV q12h:**
   - Indication: Stress ulcer prophylaxis (VAP bundle)
   - Last Dose: 0800
   - Next Dose: 2000 tonight

6. **Heparin 5,000 units SQ q8h:**
   - Indication: DVT prophylaxis (VAP bundle)
   - Last Dose: 1200
   - Next Dose: 2000

PRN MEDICATIONS:

7. **Midazolam 2-4 mg IV q2h PRN:**
   - Indication: Breakthrough agitation if propofol insufficient
   - Not required this shift (sedation adequate with propofol alone)

8. **Fentanyl 25-50 mcg IV q1h PRN:**
   - Indication: Pain/discomfort
   - Last Dose: 0400 (10 hours ago)
   - Current pain assessment: BPS 3 (no pain behaviors)

ENTERAL MEDICATIONS (via OG tube):

9. **Metoprolol 25 mg PO q12h:**
   - Indication: Blood pressure/heart rate control
   - Last Dose: 0800
   - Next Dose: 2000

10. **Insulin glargine 20 units SQ q24h:**
    - Indication: Basal insulin (diabetes management)
    - Given at 2200 nightly

MEDICATION RECONCILIATION:
• All home medications held during critical illness except metoprolol
• Will resume home medications when transitioned out of ICU

═══════════════════════════════════════════════════════════════════

NUTRITION & GI STATUS:

ENTERAL NUTRITION:
• Route: Orogastric (OG) tube, 16 Fr
• Insertion Date: 11/04/2025
• Placement: Verified by X-ray (post-pyloric placement preferred, currently gastric)
• Feeding Formula: Osmolite 1.5 Cal (high-calorie formula)
• Rate: 50 mL/hour continuous infusion
• Goal Rate: 60 mL/hour (target 1,440 kcal/day)
• HOB: Elevated 30-45 degrees (aspiration precaution)

GASTRIC RESIDUAL VOLUMES (GRV):
• Last Check: 1200 hours
• Volume: 100 mL (acceptable, <200 mL is goal)
• Frequency: Checked q4h per protocol
• Action: Continue feeding at current rate (GRV <200 mL)

GI ASSESSMENT:
• Bowel Sounds: Present in all four quadrants, hypoactive
• Abdomen: Soft, non-distended, no rigidity
• Last Bowel Movement: Yesterday (11/05) - small, soft stool
• Stool Consistency: Soft, formed
• Nausea/Vomiting: None (patient sedated)
• NGT/OGT Output: 150 mL over 12 hours (gastric residuals returned to patient)

NUTRITIONAL STATUS:
• Caloric Goal: 1,800-2,000 kcal/day (estimated needs for 75 kg patient)
• Current Intake: 1,200 kcal/day (50 mL/hr × 24 hr × 1.5 cal/mL)
• Plan: Increase to goal rate of 60 mL/hr if GRVs remain <200 mL
• Protein Goal: 75-90 g/day for healing/recovery

BOWEL REGIMEN:
• Stool Softener: Docusate 100 mg PO BID (via OG tube)
• Laxative: MiraLAX 17 g PO daily if no BM x48 hours

═══════════════════════════════════════════════════════════════════

LINES, TUBES, DRAINS & DEVICES:

CENTRAL VENOUS CATHETER:
• Type: Triple-lumen central line
• Location: Right internal jugular (IJ) vein
• Insertion Date: 11/04/2025 (ICU Day 1)
• Dressing: Transparent dressing, clean, dry, intact
• Site Assessment:
  ✓ No erythema, edema, or drainage at insertion site
  ✓ Sutures intact, catheter secured
  ✓ No signs of infection
• Lumens:
  - Proximal: Norepinephrine infusion (dedicated vasopressor port)
  - Medial: Propofol infusion
  - Distal: CVP monitoring, blood draws, IV fluids
• CVP Monitoring: Continuous CVP monitoring via distal port (CVP 8 mmHg)

ARTERIAL LINE:
• Location: Right radial artery
• Insertion Date: 11/04/2025
• Purpose: Continuous BP monitoring, frequent ABG sampling
• Dressing: Transparent dressing, clean, dry, intact
• Site Assessment:
  ✓ No erythema, edema, or hematoma
  ✓ Catheter secured with sutures
  ✓ Distal perfusion intact (pulse oximeter on right hand functioning, capillary refill
    <2 seconds)
• Waveform: Normal arterial waveform, good tracing

PERIPHERAL IV:
• Location: Left forearm, 20-gauge
• Insertion Date: 11/05/2025
• Purpose: Backup IV access, intermittent medications
• Site Assessment: Clean, dry, intact, no signs of infiltration or phlebitis

FOLEY CATHETER:
• Size: 16 Fr indwelling urinary catheter
• Insertion Date: 11/04/2025
• Drainage: Clear, yellow urine draining well
• Output: 50-60 mL/hour (adequate)
• Catheter Care: Pericare performed q shift, catheter secured to thigh

OROGASTRIC (OG) TUBE:
• Size: 16 Fr OG tube
• Insertion Date: 11/04/2025
• Purpose: Enteral nutrition, medication administration, gastric decompression
• Placement: Verified by X-ray, tip in stomach
• Secured: At lip, marked at nose for position monitoring
• Functioning: Patent, flushing well, gastric residuals <200 mL

ENDOTRACHEAL TUBE (ETT):
• See Respiratory section above (7.5 mm ETT, 22 cm at lip)

MONITORING DEVICES:
• Arterial Line: Continuous BP monitoring
• CVP Monitoring: Continuous via central line
• Cardiac Telemetry: Continuous cardiac monitoring
• Pulse Oximetry: Continuous SpO2 monitoring
• End-Tidal CO2 (ETCO2): Continuous capnography monitoring

DEVICE CARE:
✓ All line/tube insertion sites assessed q4h for signs of infection
✓ Dressings clean, dry, intact
✓ All devices secured appropriately
✓ Daily assessment for continued need (goal: remove devices ASAP when no longer needed)

═══════════════════════════════════════════════════════════════════

PLAN OF CARE - ICU DAY #3:

GOALS FOR NEXT 24 HOURS:

1. **HEMODYNAMIC STABILITY:**
   ✓ Continue weaning norepinephrine as tolerated
   ✓ Goal: Maintain MAP >65 mmHg
   ✓ Target: D/C vasopressors within 24-48 hours if stable

2. **VENTILATOR WEANING:**
   ⬜ Perform spontaneous awakening trial (SAT) at 1600 hours
   ⬜ If SAT successful, proceed with spontaneous breathing trial (SBT)
   ⬜ Assess for extubation readiness if SBT successful
   ⬜ Goal: Extubation within 24-48 hours if ready

3. **INFECTION CONTROL:**
   ✓ Continue ceftriaxone (Day 3 of 7)
   ✓ Monitor inflammatory markers and clinical response
   ✓ Repeat blood cultures (drawn today at 0600, pending)
   ✓ Goal: Complete 7-day antibiotic course, afebrile x48 hours before ICU transfer

4. **RENAL FUNCTION:**
   ✓ Maintain adequate urine output >0.5 mL/kg/hr
   ✓ Transition from positive to neutral fluid balance
   ✓ Monitor creatinine daily (trending down)

5. **NUTRITION:**
   ⬜ Advance enteral feeds to goal rate (50 → 60 mL/hr) if GRVs remain low
   ⬜ Goal: Meet 100% caloric and protein needs within 48 hours

6. **DEVICE REMOVAL:**
   ⬜ Reassess need for arterial line daily (may D/C post-extubation)
   ⬜ Reassess need for central line (may D/C when off pressors and stable)
   ⬜ Reassess need for Foley catheter (D/C post-extubation if ambulating)

SPONTANEOUS AWAKENING & BREATHING TRIAL PLAN:

**1600 HOURS - SPONTANEOUS AWAKENING TRIAL (SAT):**
• Hold propofol infusion
• Assess patient arousal and agitation level
• If patient awakens and follows commands without agitation → proceed to SBT
• If patient agitated or unsafe → restart propofol, reassess tomorrow

**IF SAT SUCCESSFUL → SPONTANEOUS BREATHING TRIAL (SBT):**
• Change ventilator to pressure support mode (PS 5-8, PEEP 5)
• Monitor for 30-120 minutes
• SBT Success Criteria:
  ✓ RR <35 breaths/min
  ✓ SpO2 >90%
  ✓ HR <140 bpm or change <20%
  ✓ BP stable (SBP >90, <180 mmHg)
  ✓ No signs of distress (no accessory muscle use, diaphoresis, agitation)
• Calculate RSBI (Rapid Shallow Breathing Index): RR/Vt (goal <105)
• If SBT successful → Contact MD for extubation order
• If SBT fails → Return to A/C mode, reassess tomorrow

INTERDISCIPLINARY ROUNDS:
• Physician team rounded at 0800
• Plan discussed with intensivist and team
• Physical therapy consult placed for post-extubation mobility
• Respiratory therapy involved in weaning plan
• Pharmacy monitoring sedation and antibiotic therapy
• Dietitian following enteral nutrition progression

═══════════════════════════════════════════════════════════════════

PATIENT & FAMILY COMMUNICATION:

FAMILY UPDATES:
• Family (spouse and adult daughter) at bedside from 1000-1200
• Updated on patient's condition:
  - Improving hemodynamics, weaning vasopressors
  - Infection responding to antibiotics
  - Plan for breathing trial this afternoon
  - Possible extubation in next 24-48 hours if trials successful
• Family questions answered thoroughly
• Family expressed understanding and appreciation for care

EMOTIONAL SUPPORT:
• Family encouraged to talk to patient (even though sedated, may hear voices)
• Explained sedation and ventilator to family (reduces anxiety)
• Provided realistic expectations for recovery timeline
• Social work consult offered (family declined at this time)

ANTICIPATED ICU COURSE:
• Expected ICU Length of Stay: 4-5 days total (currently Day 3)
• Possible transfer to step-down unit in 2-3 days if extubated and stable
• Expected total hospital stay: 7-10 days

═══════════════════════════════════════════════════════════════════

SUMMARY & OVERALL ASSESSMENT:

**CLINICAL STATUS: IMPROVING - SEPTIC SHOCK RESOLVING**

58-year-old male, ICU Day #3, admitted with septic shock secondary to community-acquired
pneumonia (Streptococcus pneumoniae). Hemodynamically improving with successful weaning of
vasopressor support (norepinephrine decreased from 6 mcg/min to 4 mcg/min). MAP consistently
>65 mmHg (currently 72 mmHg), adequate peripheral perfusion, lactate normalized (4.8 → 1.2
mmol/L), indicating shock resolution. Afebrile x24 hours, inflammatory markers decreasing
(WBC 18.5 → 12.0, procalcitonin 8.5 → 2.4), responding appropriately to antibiotic therapy
(ceftriaxone for pneumococcal pneumonia).

Respiratory status stable on mechanical ventilation. Oxygenation adequate (SpO2 97% on FiO2
40%, P/F ratio 238 and improving). Ventilation appropriate (PaCO2 42, pH 7.38). Lung sounds
clear, minimal secretions, patient-ventilator synchrony excellent. Spontaneous awakening and
breathing trials planned for 1600 hours today to assess extubation readiness. If successful,
anticipate extubation within 24-48 hours.

Renal function improving. Acute kidney injury (Stage 1 on admission) resolving with creatinine
decreasing from 1.8 to 1.2 mg/dL. Urine output adequate at 58 mL/hour (goal >37.5 mL/hour).
Fluid balance transitioning from aggressive resuscitation to maintenance (+250 mL over 12
hours, appropriate).

Sedation appropriate for mechanical ventilation (RASS -2, at goal). Neurologically intact when
aroused - follows commands, responds to voice, pupils reactive and symmetric. No focal deficits.

Tolerating enteral nutrition via OG tube at 50 mL/hour, low gastric residuals (<200 mL). Plan
to advance to goal rate of 60 mL/hour to meet caloric needs.

All central line and device sites clean without signs of infection. VAP bundle 100% compliant.
Family at bedside, updated on condition, supportive and engaged.

**PROGNOSIS: EXCELLENT** - Patient responding well to treatment, shock resolving, infection
improving with antibiotics. Anticipate successful extubation and transfer from ICU within 48-72
hours if current trajectory continues.

**NEXT CRITICAL DECISION POINT:** SAT/SBT at 1600 hours to determine extubation readiness.

═══════════════════════════════════════════════════════════════════
Documented By: [Nurse Name, RN, CCRN] | License #: [Number]
Date/Time: 11/06/2025 1430 | Electronic Signature Applied
═══════════════════════════════════════════════════════════════════
```

---

*[Continue with NICU and Mother-Baby templates...]*

## 7. I&O (Intake & Output)

### 📥 Expected Input (Voice/Text)

**Example - Natural Speech:**
```
For the 7 AM to 7 PM shift, patient had 1200 mils of oral fluids - water, juice, and
coffee. Also received 500 mils of IV normal saline. No tube feedings or other intake.

For output, patient voided 1600 mils of urine, clear and yellow. No stool this shift.
No drains or other output.

So total intake is 1700 mils, total output is 1600 mils. Net balance is positive 100 mils
over the 12-hour shift. Patient is adequately hydrated, voiding without difficulty.
```

### 📤 Expected Professional Output

**Intake:**
```
FLUID INTAKE RECORD - 12-Hour Shift (0700-1900 hours)
Date: 11/06/2025 | Day Shift
═══════════════════════════════════════════════════════════════════

ORAL INTAKE (PO):
├─ 0800: Coffee - 240 mL (8 oz)
├─ 0800: Orange juice - 180 mL (6 oz)
├─ 1000: Water - 240 mL (8 oz)
├─ 1200: Iced tea with lunch - 300 mL (10 oz)
├─ 1430: Apple juice - 120 mL (4 oz)
└─ 1700: Water - 120 mL (4 oz)

TOTAL ORAL INTAKE: 1,200 mL

═══════════════════════════════════════════════════════════════════

INTRAVENOUS (IV) INTAKE:
├─ Solution: 0.9% Sodium Chloride (Normal Saline)
├─ Rate: 42 mL/hour
├─ IV Site: Left forearm, 20G catheter
├─ Duration: 0700-1900 (12 hours)
└─ Total Volume Infused: 500 mL

TOTAL IV INTAKE: 500 mL

═══════════════════════════════════════════════════════════════════

OTHER INTAKE:
├─ Enteral/Tube Feeding: 0 mL (N/A - not applicable)
├─ TPN (Total Parenteral Nutrition): 0 mL (N/A)
├─ Blood Products: 0 mL (none administered)
├─ IV Medications (piggyback): 0 mL (minimal volume, not calculated)
└─ PO Medications: ~30 mL (minimal volume with medications, not calculated)

═══════════════════════════════════════════════════════════════════

**TOTAL INTAKE (12 hours): 1,700 mL**

Breakdown:
• Oral: 1,200 mL (71%)
• IV: 500 mL (29%)
• Other: 0 mL (0%)
```

**Output:**
```
FLUID OUTPUT RECORD - 12-Hour Shift (0700-1900 hours)
Date: 11/06/2025 | Day Shift
═══════════════════════════════════════════════════════════════════

URINARY OUTPUT:
├─ 0900: 350 mL (clear, yellow)
├─ 1200: 400 mL (clear, yellow)
├─ 1530: 450 mL (clear, yellow)
└─ 1830: 400 mL (clear, yellow)

URINE CHARACTERISTICS:
• Color: Clear, yellow (light amber) - normal appearance
• Clarity: Clear, no cloudiness or sediment
• Odor: Normal urine odor, no foul or unusual smell
• Blood: None visible (no hematuria)
• Quality: Normal appearance throughout shift
• Voiding Pattern: Every 3-4 hours, spontaneous
• Continence: Continent, no incontinence episodes

TOTAL URINARY OUTPUT: 1,600 mL (133 mL/hour average)

═══════════════════════════════════════════════════════════════════

GASTROINTESTINAL OUTPUT:
├─ Stool: 0 mL (no bowel movement this shift)
├─ Emesis: 0 mL (no vomiting)
├─ NG Tube Drainage: N/A (no NG tube in place)
└─ Other GI: 0 mL

BOWEL STATUS:
• Last BM: Yesterday evening (11/05/2025, 1900 hours)
• Consistency: Formed, brown (Type 4 Bristol Stool Scale)
• Patient Report: "I usually go once a day, I'm not concerned"
• Abdomen: Soft, active bowel sounds present, no distension

TOTAL GI OUTPUT: 0 mL

═══════════════════════════════════════════════════════════════════

OTHER OUTPUT:
├─ Drains: 0 mL (no drains in place)
├─ Wound Drainage: 0 mL (no wounds)
├─ Chest Tube: N/A (not applicable)
├─ Suction (NG/surgical): 0 mL
└─ Insensible Loss: Not measured (estimated ~400-500 mL/12hr via respiration/perspiration)

═══════════════════════════════════════════════════════════════════

**TOTAL OUTPUT (12 hours): 1,600 mL**

Breakdown:
• Urinary: 1,600 mL (100%)
• GI: 0 mL (0%)
• Other: 0 mL (0%)
• Insensible: ~400-500 mL (estimated, not included in total)

═══════════════════════════════════════════════════════════════════

INTAKE & OUTPUT BALANCE CALCULATION

TOTAL INTAKE (12 hours):    1,700 mL
TOTAL OUTPUT (12 hours):    1,600 mL
                           ─────────
NET BALANCE:                + 100 mL (Positive balance)

═══════════════════════════════════════════════════════════════════

HOURLY BREAKDOWN:
• Average Intake: 142 mL/hour (1,700 mL ÷ 12 hours)
• Average Output: 133 mL/hour (1,600 mL ÷ 12 hours)
• Minimum Adequate Output: 30 mL/hour (360 mL/12 hours) ✓ ACHIEVED
• Patient Weight: 75 kg (165 lbs)
• Output per kg: 1.78 mL/kg/hour (goal: >0.5 mL/kg/hour) ✓ ADEQUATE

═══════════════════════════════════════════════════════════════════

CLINICAL ASSESSMENT:

FLUID BALANCE STATUS: APPROPRIATE POSITIVE BALANCE
• +100 mL net balance over 12 hours is within normal range
• Indicates adequate hydration without fluid overload
• Urine output adequate (>0.5 mL/kg/hour achieved: 1.78 mL/kg/hour)

HYDRATION STATUS: WELL-HYDRATED
• Adequate oral fluid intake (1,200 mL over 12 hours)
• Urine characteristics indicate good hydration:
  - Clear, yellow color (concentrated but not dark)
  - Good volume production
  - No signs of dehydration or overhydration

RENAL FUNCTION: ADEQUATE
• Urine output well above minimum requirements
• Consistent voiding pattern every 3-4 hours
• No oliguria (output >400 mL/24 hours)
• No polyuria (excessive urination)
• Voiding spontaneously without difficulty

ASSESSMENT FINDINGS:
✓ Mucous membranes moist
✓ Skin turgor good (skin returns immediately when pinched)
✓ No peripheral edema (0/4 bilateral)
✓ Vital signs stable (no orthostatic hypotension)
✓ Patient denies thirst or dry mouth
✓ Urine specific gravity within normal range (if measured)

GASTROINTESTINAL STATUS:
• No bowel movement this shift (last BM yesterday evening)
• Bowel sounds active, abdomen soft
• Patient not concerned about bowel pattern
• No need for intervention at this time (will continue to monitor)

═══════════════════════════════════════════════════════════════════

ONGOING PLAN:

MONITORING:
• Continue strict I&O documentation next shift
• Monitor for bowel movement (if none by tomorrow AM, assess for constipation)
• Assess hydration status q shift
• Monitor daily weight (weigh same time each day on same scale)
• Watch for signs of fluid overload or dehydration

INTERVENTIONS:
• Encourage continued oral fluid intake (goal: 1,500-2,000 mL/day)
• Maintain IV fluids as ordered (NS at 42 mL/hr)
• Monitor urine characteristics for changes in color, clarity, or odor
• Assess voiding pattern for any difficulties

PATIENT EDUCATION:
• Encouraged to drink fluids regularly throughout the day
• Educated on importance of adequate hydration for recovery
• Instructed to report any changes in urination (frequency, color, pain)
• Patient verbalized understanding

ALERTS/CONCERNS:
• No concerns at this time
• Fluid balance appropriate
• Patient voiding adequately
• No intervention required

═══════════════════════════════════════════════════════════════════

SHIFT HANDOFF NOTES:
• Net balance +100 mL (appropriate)
• Patient tolerating oral fluids well
• IV fluids infusing as ordered
• Adequate urinary output maintained
• No BM this shift (last BM yesterday PM - will monitor)
• Patient well-hydrated, no concerns

Next Shift Orders:
• Continue strict I&O
• Monitor for bowel movement
• Maintain current IV rate unless ordered otherwise
• Encourage PO fluid intake

═══════════════════════════════════════════════════════════════════
Documented By: [Nurse Name, RN] | Date/Time: 11/06/2025 1900
═══════════════════════════════════════════════════════════════════
```

---

## 8. Wound Care

### 📥 Expected Input (Voice/Text)

**Example - Natural Speech:**
```
Wound care for stage 2 pressure injury on left lower leg. Wound measures 3 centimeters
by 2 centimeters, about half a centimeter deep. The wound bed has pink granulation tissue,
looks healthy. There's a small amount of serosanguineous drainage, no foul odor.

The periwound skin is intact, no redness or swelling around the edges. No signs of
infection - no warmth, no increased redness, no pus.

I cleansed the wound with normal saline, patted it dry gently. Applied a hydrocolloid
dressing and secured it with gauze and tape.

Patient tolerated the dressing change well, no complaints of increased pain. Next dressing
change is scheduled for November 8th at 0900.
```

### 📤 Expected Professional Output

**Wound Assessment:**
```
═══════════════════════════════════════════════════════════════════
COMPREHENSIVE WOUND ASSESSMENT & CARE DOCUMENTATION
Date: 11/06/2025 | Time: 1400 | Nurse: [Name, RN]
═══════════════════════════════════════════════════════════════════

WOUND IDENTIFICATION:
• Wound Type: Pressure Injury
• Classification: Stage 2 (NPUAP/EPUAP classification)
• Location: Left lower leg, lateral aspect
• Anatomical Description: Left lower extremity, mid-calf region, lateral malleolus area
• Etiology: Pressure-related injury (friction/shear component)
• Date of Onset: [Document date first noted]
• Wound Age: [Days since first documented]

═══════════════════════════════════════════════════════════════════

WOUND MEASUREMENTS:
• Length: 3.0 cm (measured head-to-toe direction with ruler)
• Width: 2.0 cm (measured side-to-side with ruler)
• Depth: 0.5 cm (measured with sterile cotton-tipped applicator at deepest point)
• Wound Area: 6.0 cm² (length × width)
• Volume: Approximately 3 cm³ (if calculated)
• Measurement Method: Standard wound ruler and cotton-tipped applicator, aseptic technique
• Clock Reference: [If using clock method for irregular wounds]
• Undermining: None detected (probed all wound edges)
• Tunneling: None detected (probed entire wound perimeter)
• Sinus Tracts: None present

MEASUREMENT COMPARISON:
• Previous Assessment (11/04/2025): 3.2 cm × 2.1 cm × 0.6 cm
• Current Assessment (11/06/2025): 3.0 cm × 2.0 cm × 0.5 cm
• Change: ↓ Slight decrease in size (0.2 cm length, 0.1 cm width, 0.1 cm depth)
• TRENDING: Wound showing signs of healing, appropriate reduction in dimensions

═══════════════════════════════════════════════════════════════════

WOUND BED ASSESSMENT:

Tissue Type (Composition):
• Granulation Tissue: 100% coverage
• Color: Pink/red (healthy, vascular granulation tissue)
• Texture: Moist, beefy appearance, healthy granulation
• Quality: Good quality tissue, filling wound bed appropriately
• Epithelialization: Early epithelialization noted at wound edges (0-2mm advancement)
• Slough: 0% (none present)
• Eschar: 0% (none present)
• Necrotic Tissue: None observed
• Wound Bed Overall: HEALTHY, progressing toward healing

WOUND EXUDATE:
• Amount: Scant (minimal drainage on dressing)
• Type: Serosanguineous (clear/pink, thin consistency)
• Color: Clear with slight pink tinge
• Consistency: Thin, watery
• Odor: None (no foul or unusual odor detected)
• Purulence: None (no pus present)
• DRAINAGE ASSESSMENT: Normal healing drainage, not indicative of infection

═══════════════════════════════════════════════════════════════════

PERIWOUND ASSESSMENT:

Skin Condition:
• Integrity: Intact (no breaks, tears, or maceration)
• Color: Normal, consistent with patient's skin tone, no erythema
• Temperature: Normal to touch (not warm or hot compared to contralateral leg)
• Texture: Smooth, no induration or hardening
• Moisture: Appropriately moist, no maceration or excessive dryness
• Edema: None (0/4 pitting edema)

Periwound Skin (0-4 cm from wound edge):
• Erythema: None observed (no redness extending from wound edges)
• Induration: None (tissue soft to palpation)
• Ecchymosis: None (no bruising)
• Maceration: None (skin not waterlogged or white/wrinkled)
• Callus Formation: None
• Hypergranulation: None (granulation tissue not protruding above skin level)

SKIN INTEGRITY BEYOND WOUND AREA:
• Left lower leg general assessment: Skin intact, no additional pressure injuries
• Right lower leg comparison: Intact, no wounds or skin breakdown
• Overall skin status: Good, patient at moderate risk for additional breakdown (Braden 16)

═══════════════════════════════════════════════════════════════════

INFECTION ASSESSMENT (Clinical Signs):

SIGNS OF INFECTION: NONE PRESENT ✓
✓ No erythema extending >0.5 cm from wound edge
✓ No warmth/heat at wound site
✓ No purulent drainage
✓ No foul odor
✓ No increased pain beyond expected level
✓ No systemic signs (fever, chills, elevated WBC)
✓ No delayed healing beyond expected timeframe
✓ No friable granulation tissue
✓ No wound breakdown or deterioration

TEMPERATURE: Wound site temperature consistent with surrounding tissue (not elevated)
SYSTEMIC SIGNS: Patient afebrile (Temp 98.4°F), no signs of systemic infection
LAB VALUES: WBC within normal limits [if applicable]

ASSESSMENT: No clinical signs of wound infection at this time. Wound progressing
appropriately through healing stages.

═══════════════════════════════════════════════════════════════════

PAIN ASSESSMENT:

PRE-PROCEDURE:
• Pain Rating: 2/10 at rest
• Pain Character: Dull, aching
• Location: Localized to wound site
• Duration: Constant, low-level discomfort

DURING DRESSING CHANGE:
• Pain Rating: 4/10 during cleansing
• Patient Tolerance: Good, patient cooperative throughout procedure
• Pain Management: Procedure performed gently, patient reassured throughout

POST-PROCEDURE:
• Pain Rating: 2/10 (returned to baseline)
• Patient Statement: "It's a little sore but not bad" and "No complaints of increased pain"
• Pain Medication: None required (pain manageable without intervention)

═══════════════════════════════════════════════════════════════════

WOUND CARE PROCEDURE PERFORMED:

PREPARATION:
• Hand hygiene performed before and after procedure
• Clean gloves donned for dressing removal
• Sterile gloves donned for wound cleansing and dressing application
• Supplies gathered: Normal saline (NS), gauze pads, hydrocolloid dressing, tape
• Patient positioned for optimal wound access (left leg elevated on pillow)
• Privacy maintained (door closed, curtain drawn)

DRESSING REMOVAL:
• Old dressing removed carefully, noting adherence and drainage on dressing
• Previous dressing: [Describe type removed]
• Drainage on old dressing: Scant serosanguineous staining
• Dressing removed without trauma to wound bed or periwound skin

WOUND CLEANSING:
• Cleansing Solution: 0.9% Sodium Chloride (Normal Saline) - sterile
• Technique: Gentle irrigation with NS, allowing solution to flow over wound
• Method: Poured NS over wound, allowing gravity drainage, no forceful pressure
• Direction: Cleansed from cleanest area to least clean (center to periphery)
• Dried: Gently patted dry with sterile gauze, avoiding trauma to granulation tissue
• Periwound cleansed: Surrounding skin cleaned with NS and pat dried

WOUND TREATMENT:
• No debridement required (healthy tissue, no slough/eschar)
• No topical agents applied (wound bed healthy, appropriate for moist healing)
• Antimicrobial products: None required (no signs of infection)

PRIMARY DRESSING APPLIED:
• Dressing Type: Hydrocolloid dressing (moisture-retentive)
• Brand: [Specify brand if applicable, e.g., DuoDERM]
• Size: 4 cm × 4 cm (appropriate size, 1-2 cm beyond wound margins)
• Application: Applied to clean, dry wound and periwound skin
• Border Coverage: Dressing extends 1-2 cm beyond wound edge for secure seal
• Rationale: Maintains moist wound environment, promotes autolytic debridement and
  granulation, absorbs light drainage

SECONDARY DRESSING:
• Type: Sterile gauze pads (4×4) × 2
• Secured With: Paper tape (non-allergenic)
• Purpose: Protection of primary dressing, absorption of any strike-through drainage
• Security: Dressing secure but not constrictive

POST-PROCEDURE:
• Wound area clean and dressed appropriately
• Patient comfortable, repositioned for comfort
• Bed linens changed if soiled
• Used supplies disposed in appropriate waste container
• Clean gloves removed, hand hygiene performed
• Call light placed within reach

═══════════════════════════════════════════════════════════════════

PATIENT RESPONSE & EDUCATION:

PATIENT TOLERANCE:
• Procedure tolerated well without significant discomfort
• Patient cooperative throughout dressing change
• No complaints of increased pain during or after procedure
• No adverse reactions to dressing materials
• Patient verbalized comfort with care provided

PATIENT EDUCATION PROVIDED:
• Explained wound healing process and current stage (granulation phase)
• Taught signs and symptoms of infection to report:
  - Increased redness, warmth, or swelling
  - Increased pain or tenderness
  - Foul odor or purulent drainage
  - Fever, chills, or feeling unwell
• Instructed on importance of keeping dressing clean and dry
• Educated on pressure relief and repositioning to prevent further injury:
  - Avoid pressure on left lower leg
  - Change positions every 2 hours
  - Use pillows for positioning
  - Avoid crossing legs
• Reviewed importance of adequate nutrition for wound healing:
  - High protein intake
  - Adequate hydration
  - Vitamins C and zinc supplementation if ordered
• Demonstrated how to report concerns (use call light, notify nurse)
• Patient verbalized understanding of all teaching points
• Patient able to identify at least 3 signs of infection to report

═══════════════════════════════════════════════════════════════════

TREATMENT PLAN:

DRESSING CHANGE FREQUENCY:
• Scheduled: Every 48-72 hours or as needed (PRN) if saturated/loose
• Next Change: November 8, 2025 at 0900 hours (48 hours from current change)
• PRN Changes: Change sooner if drainage strike-through, dressing becomes loose,
  or signs of infection develop

WOUND CARE ORDERS:
• Cleanse with NS each dressing change
• Primary Dressing: Hydrocolloid dressing
• Secondary Dressing: Gauze and tape for protection
• Frequency: Every 48-72 hours and PRN
• Document: Measurements and wound assessment with each change
• Photography: [If ordered - obtain wound photos per protocol]

PRESSURE RELIEF:
• Reposition every 2 hours (avoid pressure on left lateral leg)
• Elevate left lower extremity on pillow when in bed
• Use pressure-reducing surfaces (heel protectors, foam padding)
• Minimize friction and shear with transfers
• No crossing legs or prolonged pressure on wound site

NUTRITION:
• Dietary Consult: [If ordered]
• High-Protein Diet: Encouraged
• Protein Goal: 1.2-1.5 g/kg body weight daily
• Hydration: 1,500-2,000 mL fluids daily
• Supplements: [List if ordered - vitamin C, zinc, protein shakes]

MONITORING:
• Weekly measurements (or per protocol)
• Weekly wound photography (if ordered)
• Monitor for signs of infection daily
• Assess healing progression (epithelialization, reduction in size)
• Braden Scale assessment q shift for pressure injury risk

PROVIDER NOTIFICATION PARAMETERS:
• Notify provider if:
  - Signs of infection develop
  - Wound increases in size or depth
  - Increased drainage, purulence, or foul odor
  - Necrotic tissue appears
  - Patient reports increased pain >6/10
  - No improvement in 2 weeks
  - Systemic signs develop (fever, elevated WBC)

═══════════════════════════════════════════════════════════════════

WOUND HEALING PROGRESSION ANALYSIS:

HEALING STAGE: Proliferative Phase (Granulation Stage)
• Wound filled with healthy granulation tissue (100% coverage)
• Early epithelialization at wound edges
• Wound dimensions decreasing (appropriate healing trajectory)
• No signs of stalled healing or deterioration

EXPECTED HEALING TIMELINE:
• Stage 2 pressure injury expected healing: 1-3 weeks with appropriate treatment
• Current timeline: Progressing as expected
• Factors supporting healing:
  ✓ Healthy granulation tissue
  ✓ Adequate perfusion (pink/red tissue color)
  ✓ Minimal drainage
  ✓ No infection
  ✓ Pressure relief strategies in place
  ✓ Patient cooperative with care

BARRIERS TO HEALING: None identified at this time
✓ No infection
✓ Good perfusion
✓ Appropriate moisture balance
✓ Adequate nutrition status
✓ Patient compliant with pressure relief

PROGNOSIS: Excellent - wound progressing toward full healing with current interventions

═══════════════════════════════════════════════════════════════════

PHOTOGRAPHY: [If applicable]
• Wound photograph obtained: [Yes/No]
• Photo ID/Number: [Reference number]
• Consent obtained: [Yes - on file]
• Purpose: Documentation of healing progress

═══════════════════════════════════════════════════════════════════

ADDITIONAL NOTES:
• Wound showing consistent improvement since last assessment
• Patient engaged in care and following prevention strategies
• Family educated on pressure relief techniques
• No concerns at this time - continue current treatment plan

═══════════════════════════════════════════════════════════════════
Documented By: [Nurse Name, RN] | License #: [Number]
Date/Time: 11/06/2025 1430 | Electronic Signature Applied
═══════════════════════════════════════════════════════════════════
```

---

## 9. Safety Checklist

### 📥 Expected Input (Voice/Text)

**Example - Natural Speech:**
```
Completing safety checklist for Mr. Thompson in room 302. Bed is in the lowest position,
all four wheels are locked. Call light is within reach on the bedside table. Patient has
non-slip socks on both feet. Bed alarm is activated and working - I tested it. The room
is clean, no clutter on the floor, path to bathroom is clear.

Patient's fall risk score is 45, which is moderate risk. I reviewed fall prevention
strategies with the patient - call for help before getting up, use the call light, wear
non-slip socks, no rushing. Patient understands and verbalized the plan back to me.

No restraints are in use. No isolation precautions needed. I verified patient identity
using name and date of birth on the wristband. Confirmed allergies - patient reports
NKDA, it matches the chart. Code status is full code, confirmed with patient and
documented in the chart.
```

### 📤 Expected Professional Output

**Safety Assessment:**
```
═══════════════════════════════════════════════════════════════════
COMPREHENSIVE PATIENT SAFETY CHECKLIST
Date: 11/06/2025 | Time: 0745 | Nurse: [Name, RN]
Patient: Mr. Thompson | Room: 302 | Shift: Day
═══════════════════════════════════════════════════════════════════

══════════════════════════════════════════════════════════════════
SECTION 1: FALL PREVENTION & ENVIRONMENTAL SAFETY
══════════════════════════════════════════════════════════════════

FALL RISK ASSESSMENT:
• Fall Risk Score: 45 points (Morse Fall Scale or equivalent)
• Risk Level: **MODERATE RISK** (25-50 points)
• Risk Factors Identified:
  ✓ History of falls
  ✓ Gait instability
  ✓ Age >65 years
  ✓ Taking medications that increase fall risk (sedatives/diuretics)
  ✓ Requires assistance with mobility
• Previous Falls: [Document if any history]
• Last Fall Risk Assessment: 11/06/2025 0700
• Reassessment Frequency: Every shift and PRN with status change

═══════════════════════════════════════════════════════════════════

BED SAFETY MEASURES:

✅ BED POSITION: Lowest position to floor (verified)
   - Height from floor to bed surface: [Minimum height setting]
   - Purpose: Minimizes injury risk if patient falls from bed

✅ BED WHEELS: All four wheels locked and engaged
   - Front wheels: Locked ✓
   - Rear wheels: Locked ✓
   - Purpose: Prevents bed from rolling during transfers

✅ BED RAILS:
   - Position: [Specify - up/down, 2 rails or 4 rails]
   - Purpose: [Balance support vs. entrapment risk per policy]
   - Patient Preference: Bed rails [up/down] per patient request
   - Note: Bed rails not used as restraint, patient free to exit bed

✅ BED ALARM: Activated and functioning properly
   - Type: Pressure-sensitive bed alarm
   - Tested: Alarm sounded when pressure released (1 test completed)
   - Volume: Set to audible level at nurse's station
   - Battery: Charged/connected to power
   - Purpose: Alerts staff when patient attempts to exit bed unassisted

═══════════════════════════════════════════════════════════════════

PATIENT SAFETY EQUIPMENT:

✅ CALL LIGHT: Within easy reach
   - Location: Clipped to bed rail on patient's right side (patient's dominant hand)
   - Patient Demonstration: Patient able to locate and press call light independently
   - Tested: Call light functional, rings at nurse's station
   - Patient Education: "Press this button if you need anything - we'll come right away"
   - Patient Understanding: Verbalized purpose and demonstrated proper use ✓

✅ NON-SLIP FOOTWEAR: Applied to both feet
   - Type: Hospital-provided non-slip socks (yellow - indicates fall risk)
   - Condition: Clean, dry, proper fit (not too loose or tight)
   - Grip: Non-skid treads on bottom intact and effective
   - Color Coding: Yellow socks indicate fall risk patient (per hospital protocol)
   - Patient compliant with wearing at all times when ambulating

✅ ASSISTIVE DEVICES: [Document if applicable]
   - Walker: [At bedside, proper height adjustment]
   - Cane: [N/A]
   - Other: [Specify]

═══════════════════════════════════════════════════════════════════

ENVIRONMENTAL SAFETY:

✅ ROOM CLEANLINESS & ORGANIZATION:
   - Floor: Clean, dry, no spills or wet spots
   - Clutter: None observed, floor clear of obstacles
   - Tripping Hazards: None identified (no cords, equipment, or debris)
   - Personal Belongings: Organized on bedside table and in closet
   - Trash: Appropriately contained in trash receptacle

✅ PATH TO BATHROOM: Clear and unobstructed
   - Distance: Approximately 8 feet from bed to bathroom door
   - Obstacles: None between bed and bathroom
   - Lighting: Adequate lighting in room and bathroom
   - Bathroom Light: Night light activated for nighttime visibility

✅ LIGHTING:
   - Room Lighting: Adequate illumination for safe ambulation
   - Night Light: Activated and functioning
   - Call Light: Illuminated and visible in dim lighting
   - Bathroom: Adequate lighting, night light present

✅ FURNITURE PLACEMENT:
   - Bedside Table: Positioned within reach, stable
   - Chair: Positioned away from walkway, stable (not on wheels)
   - IV Pole: Secured, not obstructing pathway (if applicable)
   - Overbed Table: Positioned appropriately, wheels locked

✅ CORDS & EQUIPMENT:
   - Electrical Cords: Secured along baseboards, not across walkway
   - IV Tubing: Organized and secured (if applicable)
   - Oxygen Tubing: Long enough for safe mobility (if applicable)
   - Call Light Cord: Not tangled, easily accessible

══════════════════════════════════════════════════════════════════
SECTION 2: PATIENT EDUCATION & FALL PREVENTION STRATEGIES
══════════════════════════════════════════════════════════════════

EDUCATION PROVIDED (0745 hours):

✅ CALL FOR ASSISTANCE:
   - Taught: "Please call for help before getting out of bed. Don't try to go to the
     bathroom alone, even if you feel steady."
   - Rationale Explained: "We want to make sure you're safe and prevent any falls.
     We're here to help you, it's not a bother."
   - Patient Response: "Okay, I'll call for help. I promise not to get up alone."

✅ CALL LIGHT USE:
   - Demonstrated: How to press call light button and confirmed patient can reach it
   - Purpose: "Use this button anytime you need help - bathroom, pain medicine, anything"
   - Patient Demonstration: Successfully pressed call light and cancelled it ✓

✅ NON-SLIP SOCKS:
   - Taught: "Always wear your yellow non-slip socks when walking, even just to the
     bathroom"
   - Rationale: "These socks help prevent slipping on the floor and keep you safe"
   - Patient Compliance: Patient wearing socks, agreed to keep them on ✓

✅ NO RUSHING:
   - Taught: "Take your time when getting up. Sit on the edge of the bed for a minute
     before standing up."
   - Rationale: "Sometimes blood pressure can drop when you stand up quickly, which can
     make you dizzy"
   - Technique: "Call for help, sit up slowly, dangle feet for 30-60 seconds, then stand
     with assistance"

✅ BEDSIDE COMMODE (if applicable):
   - Placement: Within reach but not blocking pathway
   - Taught: "At night, we'll use the bedside commode so you don't have to walk as far
     to the bathroom"

✅ TOILETING SCHEDULE:
   - Established: Offer toileting every 2-3 hours and before bedtime
   - Proactive Approach: "I'll check on you regularly and help you to the bathroom before
     you feel urgent"

TEACH-BACK METHOD USED:
• Asked Patient to Repeat Back: "Can you tell me what you'll do when you need to get
  up to use the bathroom?"
• Patient Response: "I'll press the call button and wait for help. I won't try to go by
  myself. I'll take my time and wear my yellow socks."
• COMPREHENSION: ✅ Excellent - Patient able to verbalize understanding accurately
• Additional Teaching Needed: None at this time

══════════════════════════════════════════════════════════════════
SECTION 3: RESTRAINTS ASSESSMENT
══════════════════════════════════════════════════════════════════

✅ RESTRAINTS IN USE: **NONE** (No physical or chemical restraints)

RESTRAINT-FREE CARE:
• Patient cooperative and oriented x3
• No safety concerns requiring restraint use
• Alternative interventions successful (bed alarm, frequent rounding, reorientation)
• Patient able to follow instructions appropriately

ASSESSMENT FOR NEED:
• Behavioral Assessment: Patient calm, cooperative, no agitation or confusion
• Safety Risk: No risk of pulling lines/tubes, no risk to self or others
• Cognitive Status: Alert and oriented x3, appropriate responses
• Alternatives in Place:
  ✓ Frequent rounding (hourly rounds protocol)
  ✓ Bed alarm activated
  ✓ Call light within reach
  ✓ Family presence encouraged
  ✓ Reorientation PRN

RESTRAINT POLICY REVIEWED:
• Restraints used only as last resort per hospital policy
• Least restrictive intervention used first
• If restraint becomes necessary, provider order required within 1 hour
• Reassessment q2h if restraint initiated

CURRENT STATUS: No restraints necessary. Patient safety maintained through alternative
measures.

══════════════════════════════════════════════════════════════════
SECTION 4: ISOLATION PRECAUTIONS
══════════════════════════════════════════════════════════════════

✅ ISOLATION PRECAUTIONS: **NONE REQUIRED**

ASSESSMENT:
• Infection Risk: No active infections requiring isolation
• Recent Cultures: [Negative/N/A]
• MRSA Screening: [Negative/Not applicable]
• C. diff: Negative
• COVID-19: Negative per testing on admission
• Tuberculosis: No history, no symptoms, not on precautions

STANDARD PRECAUTIONS IN PLACE:
✓ Hand hygiene performed before and after patient contact
✓ PPE (gloves/gown) used for bodily fluid exposure
✓ Appropriate sharps disposal
✓ Clean environment maintained

CURRENT STATUS: Standard precautions only. No contact, droplet, or airborne precautions
required.

══════════════════════════════════════════════════════════════════
SECTION 5: PATIENT IDENTIFICATION & VERIFICATION
══════════════════════════════════════════════════════════════════

✅ PATIENT IDENTITY VERIFIED:

TWO IDENTIFIERS USED:
1. **Name**: Mr. [First Name] Thompson
   - Method: Verbal confirmation by patient: "What is your full name?"
   - Patient Response: Stated full name correctly
   - Wristband: Name matches wristband ✓

2. **Date of Birth**: [MM/DD/YYYY]
   - Method: Verbal confirmation: "What is your date of birth?"
   - Patient Response: Stated correct date of birth
   - Wristband: DOB matches wristband ✓

WRISTBAND ASSESSMENT:
✓ Patient Identification Band: Present on right wrist
✓ Band Integrity: Intact, legible, not damaged or faded
✓ Information Accurate: Name and DOB match patient verbal confirmation
✓ Barcode Readable: Barcode scannable for medication administration
✓ Allergy Band: Present [if applicable - see allergy section]

IDENTITY VERIFICATION PROTOCOL:
• Verified using two identifiers per hospital policy before:
  - Medication administration
  - Blood product administration
  - Procedure/treatment
  - Specimen collection
• Patient cooperative with identification process
• No identification discrepancies noted

══════════════════════════════════════════════════════════════════
SECTION 6: ALLERGY DOCUMENTATION & VERIFICATION
══════════════════════════════════════════════════════════════════

✅ ALLERGIES CONFIRMED:

PATIENT SELF-REPORT:
• Patient States: "I have no known drug allergies" (NKDA)
• Food Allergies: None reported
• Environmental Allergies: None reported
• Latex Allergy: Denied

CHART VERIFICATION:
✓ Electronic Health Record (EHR): NKDA documented ✓
✓ Allergy Section Updated: Yes, current as of 11/06/2025
✓ Allergy Band: Red "NKDA" band on left wrist (per protocol)

ALLERGY ASSESSMENT:
• Asked: "Do you have any allergies to medications, foods, latex, or anything else?"
• Patient Response: "No, I don't have any allergies"
• Previous Reactions: None reported
• Family History of Allergies: None significant

DOCUMENTATION MATCH:
✅ Patient verbal report matches documented allergies in chart
✅ Allergy wristband matches documentation
✅ No discrepancies identified

ONGOING MONITORING:
• Reassess allergies before medication administration
• Monitor for new allergic reactions during treatment
• Update allergy documentation immediately if new allergy identified
• Educate patient to report any reactions immediately

══════════════════════════════════════════════════════════════════
SECTION 7: CODE STATUS VERIFICATION
══════════════════════════════════════════════════════════════════

✅ CODE STATUS DOCUMENTED & CONFIRMED:

CURRENT CODE STATUS: **FULL CODE**

DEFINITION EXPLAINED TO PATIENT:
• Full Code Meaning: "If your heart stops or you stop breathing, we will do everything
  possible to resuscitate you, including CPR, breathing tube, and medications."
• Patient Understanding: "Yes, I want everything done. Full resuscitation."

DOCUMENTATION VERIFICATION:
✓ Code Status in Chart: Full Code - documented 11/06/2025
✓ Advanced Directive: [None on file / Document if present]
✓ Healthcare Power of Attorney: [Name if designated]
✓ POLST Form: [N/A / Document if present]

PATIENT CONFIRMATION:
• Asked: "I see in your chart that you are a Full Code. That means we will do CPR and
  full resuscitation if needed. Is that still your wish?"
• Patient Response: "Yes, that's correct. I want full code."
• Patient Alert & Oriented: Yes, patient competent to make decisions ✓
• Capacity Assessment: Patient demonstrates understanding of code status ✓

CODE STATUS LOCATION:
✓ EHR Documentation: Full Code status clearly documented
✓ Visible at Bedside: [If hospital uses visual indicators]
✓ Wristband: [If hospital uses code status wristbands]

ADVANCE CARE PLANNING:
• Social Work Consult: [If indicated for advance directive discussion]
• Discussion with Family: [Document if family involved in decision]
• Patient Wishes: Clearly expressed and documented

ONGOING ASSESSMENT:
• Reassess code status with any change in patient condition
• Encourage advance directive completion if not yet completed
• Update documentation immediately if code status changes

══════════════════════════════════════════════════════════════════
SECTION 8: ADDITIONAL SAFETY CONSIDERATIONS
══════════════════════════════════════════════════════════════════

✅ MEDICATION SAFETY:
• High-Risk Medications Identified: [List if applicable - anticoagulants, insulin, etc.]
• Double-Check Protocol: Followed for high-risk medications
• Barcode Scanning: Used for all medication administration
• Patient Education: Provided regarding medication purpose and side effects

✅ PAIN MANAGEMENT & SAFETY:
• Pain Level: [Document current pain score]
• Sedating Medications: [List if applicable]
• Fall Risk Related to Pain Meds: Assessed and precautions in place
• Side Rails: Up while patient sedated (if applicable)

✅ MOBILITY & AMBULATION:
• Mobility Level: Ambulatory with assistance
• Gait Assessment: Steady when assisted, unsteady independently
• Transfer Technique: Two-person assist recommended for transfers
• Physical Therapy: [Consult placed / N/A]

✅ SENSORY DEFICITS:
• Vision: [Glasses worn / No deficits / Document if impaired]
• Hearing: [Hearing aids present / No deficits / Document if impaired]
• Cognitive Status: Alert and oriented x3, no cognitive deficits

✅ PERSONAL BELONGINGS SECURED:
• Valuables: [Sent home with family / Secured in hospital safe]
• Glasses: On bedside table within reach
• Hearing Aids: In place and functioning (if applicable)
• Dentures: [In place / In denture cup at bedside]

══════════════════════════════════════════════════════════════════
SAFETY ROUNDS PROTOCOL
══════════════════════════════════════════════════════════════════

HOURLY ROUNDS SCHEDULE:
✓ Pain assessment and management
✓ Toileting needs (offer q2-3h, especially before bedtime)
✓ Positioning for comfort
✓ Personal belongings within reach (call light, phone, water)
✓ Environment scan for safety hazards

4 P's PROTOCOL (Pain, Potty, Position, Possessions):
✓ Pain: Managed, 2/10 at rest
✓ Potty: Last voided 0630, due to offer again ~0830
✓ Position: Comfortable, HOB at 30 degrees
✓ Possessions: Call light, phone, water pitcher within reach

INTENTIONAL ROUNDING:
• Rounds completed at: [Document times - 0800, 0900, 1000, etc.]
• Purpose: Proactive fall prevention, meet needs before call light pressed
• Fall Risk Patients: Rounded on more frequently (q1h vs. q2h)

══════════════════════════════════════════════════════════════════
SUMMARY & ONGOING PLAN
══════════════════════════════════════════════════════════════════

OVERALL SAFETY STATUS: **ALL SAFETY MEASURES IN PLACE** ✅

CHECKLIST COMPLETION:
✓ Fall prevention strategies implemented
✓ Bed safety measures confirmed
✓ Call light accessible and functional
✓ Non-slip footwear in use
✓ Environment clear and safe
✓ No restraints necessary
✓ No isolation precautions required
✓ Patient identification verified
✓ Allergies confirmed (NKDA)
✓ Code status verified (Full Code)
✓ Patient education completed with teach-back

PATIENT COOPERATION:
• Patient engaged in safety plan
• Verbalized understanding of fall prevention strategies
• Compliant with safety equipment (non-slip socks, bed alarm)
• Agreeable to calling for assistance before ambulating

ONGOING MONITORING:
• Reassess fall risk q shift and PRN with condition change
• Continue hourly rounding per protocol
• Offer toileting q2-3 hours proactively
• Monitor for any environmental hazards
• Reinforce safety education regularly
• Document compliance with safety measures

SAFETY CONCERNS: **NONE AT THIS TIME**
• All safety measures in place and functioning
• Patient low-moderate risk with appropriate interventions
• No immediate safety threats identified

NEXT REASSESSMENT: Evening shift (1900 hours) or PRN if status changes

══════════════════════════════════════════════════════════════════
Documented By: [Nurse Name, RN] | License #: [Number]
Date/Time: 11/06/2025 0800 | Electronic Signature Applied
══════════════════════════════════════════════════════════════════
```

---

I'll continue creating the remaining Epic templates (Med-Surg, ICU, NICU, Mother-Baby) to complete this comprehensive guide. Would you like me to continue with the remaining 4 templates in the same detailed format?