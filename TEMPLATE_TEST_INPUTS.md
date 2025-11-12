# Template Test Inputs & Expected Outputs

## Traditional Templates

### 1. SOAP Note

**Test Input:**
```
Patient came in complaining about chest pain that started about 2 hours ago, says it's like a pressure feeling, denies any shortness of breath or dizziness. When I checked his vitals his blood pressure was 140 over 90, heart rate was 88, oxygen saturation 98 percent on room air, temperature 98.6. Patient is alert and oriented, appears in mild discomfort but not in acute distress. Did an EKG and it showed normal sinus rhythm. Based on the presentation and normal EKG I'm thinking this is likely musculoskeletal chest pain, not cardiac. Gave him acetaminophen 500 milligrams by mouth and we'll reassess his pain level in 30 minutes, told him to let us know right away if pain gets worse or if he develops any new symptoms.
```

**Expected Output:**
```
Subjective: Patient reports chest pain onset 2 hours ago, describes as pressure feeling. Denies shortness of breath or dizziness.

Objective: BP 140/90 mmHg, HR 88 bpm, O2 saturation 98% on room air, Temperature 98.6°F. Patient alert and oriented x3, appears in mild discomfort. EKG: normal sinus rhythm.

Assessment: Chest pain likely musculoskeletal in origin. No acute cardiac concerns based on presentation and normal EKG.

Plan: Administered acetaminophen 500mg PO. Reassess pain level in 30 minutes. Patient instructed to report immediately if pain worsens or new symptoms develop.
```

---

### 2. SBAR Handoff

**Test Input:**
```
This is about the patient in room 302, his blood pressure has been climbing, last check was 165 over 95 and he's complaining of a headache now. He's a 68 year old male with history of hypertension and diabetes, admitted 2 days ago for chest pain workup. Been on his home meds but pressures trending up over the last 4 hours. I'm concerned this could be hypertensive urgency. I think we need to notify Dr. Smith right away and consider starting IV labetalol. We should increase vital sign checks to every 30 minutes and keep him on continuous monitoring.
```

**Expected Output:**
```
Situation: Patient in room 302 with elevated blood pressure 165/95 mmHg, reporting headache.

Background: 68-year-old male with history of hypertension and diabetes. Admitted 2 days ago for chest pain evaluation. Currently on home antihypertensive medications. Blood pressure trending upward over past 4 hours.

Assessment: Concern for hypertensive urgency requiring immediate intervention. Patient symptomatic with headache.

Recommendation: Notify Dr. Smith immediately. Consider initiating IV labetalol. Increase vital sign monitoring to every 30 minutes. Maintain continuous cardiac monitoring.
```

---

### 3. PIE Note

**Test Input:**
```
Patient has severe lower back pain, says it's an 8 out of 10, really sharp especially when he tries to move. At 2pm I gave him morphine 4 milligrams IV as ordered, helped him reposition to a more comfortable position with pillows for support, and applied a heating pad to the lower back area. Checked back at 2:30pm and his pain is down to a 3 out of 10, he's able to rest now, breathing is relaxed, no adverse effects from the morphine.
```

**Expected Output:**
```
Problem: Acute lower back pain rated 8/10, sharp quality, exacerbated by movement.

Intervention: Administered morphine 4mg IV at 1400 per order. Repositioned patient with pillow support for comfort. Applied heat therapy to lower back area.

Evaluation: At 1430, pain decreased to 3/10. Patient resting comfortably with relaxed breathing. No adverse effects from medication noted. Multimodal pain management effective.
```

---

### 4. DAR Note

**Test Input:**
```
Found the patient with blood pressure 135 over 88, heart rate 94, respiratory rate 22 breaths per minute, oxygen sat 95 percent on room air, temperature 99.2. Patient told me she was having some trouble breathing. I elevated the head of the bed to 45 degrees, started oxygen at 2 liters nasal cannula, and did a complete respiratory assessment including lung sounds. Twenty minutes later patient says breathing is much easier, oxygen sat improved to 98 percent, respiratory rate came down to 16, she looks more comfortable and relaxed now.
```

**Expected Output:**
```
Data: BP 135/88 mmHg, HR 94 bpm, RR 22 breaths/min, O2 saturation 95% on room air, Temperature 99.2°F. Patient reports dyspnea.

Action: Elevated head of bed to 45 degrees. Initiated oxygen therapy at 2L via nasal cannula. Completed comprehensive respiratory assessment including auscultation of lung sounds.

Response: At 20 minutes post-intervention: Patient reports improved breathing. O2 saturation increased to 98%. Respiratory rate decreased to 16 breaths/min. Patient appears more comfortable and relaxed.
```

---

## Epic EMR Templates

### 5. Epic: Shift Assessment

**Test Input:**
```
Patient is alert and oriented times three, knows where she is and what day it is. Lungs are clear bilaterally when I listened, no wheezing or crackles. Heart sounds regular, no murmurs. Abdomen is soft and non-tender, bowel sounds active in all four quadrants. She's been voiding okay, no issues with the bathroom. Skin is intact, no redness or breakdown anywhere. Changed the dressing on her right forearm surgical site, looks clean and dry, no drainage. Pain level is 2 out of 10, very well controlled with the Tylenol she's getting. Plan is to continue current care and reassess in 4 hours.
```

**Expected Output:**
```
SHIFT ASSESSMENT

Patient Status: Alert and oriented x3
Neuro: No deficits noted, oriented to person, place, and time
Respiratory: Lungs clear bilaterally, no wheezes or crackles
Cardiac: Regular rate and rhythm, no murmurs
GI: Abdomen soft, non-tender, bowel sounds active in all quadrants
GU: Voiding without difficulty
Skin/Wound: Skin intact, no breakdown. Right forearm surgical dressing changed, clean and dry, no drainage
Pain: 2/10, well controlled with acetaminophen
Interventions: Dressing change completed, pain management effective
Plan: Continue current care plan, reassess in 4 hours
```

---

### 6. Epic: MAR (Medication Administration)

**Test Input:**
```
Gave Lisinopril 10 milligrams by mouth this morning at 9am. Before giving it I checked his blood pressure and it was 148 over 92. Patient took the medication without any problems, swallowed it fine with water. Checked his BP again about an hour later at 10am and it was down to 136 over 84. He's tolerating it well, no complaints of dizziness or any side effects. Will continue to monitor his pressure throughout the shift.
```

**Expected Output:**
```
MEDICATION ADMINISTRATION RECORD (MAR)

Medication: Lisinopril
Dose: 10mg
Route: PO (oral)
Time Administered: 9am
Pre-Administration Assessment: BP 148/92 mmHg
Post-Administration Assessment: BP 136/84 mmHg at 10am (1 hour post)
Patient Response: Tolerated well, no adverse reactions noted. No dizziness or side effects reported.
Follow-Up: Continue monitoring blood pressure per protocol throughout shift
```

---

### 7. Epic: Intake & Output

**Test Input:**
```
Patient drank 600 milliliters of water and juice over the shift so far. She also got 150 milliliters of IV normal saline. For output, she urinated 700 milliliters, urine was clear yellow color, no problems voiding. Everything looks good, she's staying well hydrated.
```

**Expected Output:**
```
INTAKE & OUTPUT SUMMARY

Oral Intake: 600ml (water and juice)
IV Fluids: 150ml (normal saline)
Total Intake: 750ml
Urine Output: 700ml (clear, yellow)
Stool/Other Output: None documented
Net Balance: +50ml
Notes: Patient maintaining adequate hydration. Voiding without difficulty. Urine characteristics within normal limits.
```

---

### 8. Epic: Wound Care

**Test Input:**
```
Changed the dressing on the patient's right leg wound today around 2pm. It's located on the mid calf area on the outside part. When I measured it the wound was about 3 centimeters long and maybe 2 centimeters wide, looks a little smaller than last time. There's some pinkish drainage on the old dressing, maybe moderate amount, but no bad smell which is good. The wound bed itself looks healthy, it's pink with good granulation tissue forming. The edges are coming together nicely. The skin around the wound looks fine, no redness or breakdown. Patient said it hurt about a 2 out of 10 when I was cleaning it. I put a new hydrocolloid dressing on it and secured it with some tape. Plan is to check it again in 8 hours on the next shift.
```

**Expected Output:**
```
WOUND CARE DOCUMENTATION

Location: Right leg, mid-calf lateral aspect
Measurements: 3cm x 2cm (decreased from previous assessment)
Wound Bed: Pink with good granulation tissue
Drainage: Moderate serosanguinous drainage
Odor: None noted
Wound Edges: Approximating well
Periwound Skin: Intact, no erythema or breakdown
Pain Level: 2/10
Dressing: Hydrocolloid dressing applied
Patient Tolerance: Procedure tolerated well
Plan: Check it again in 8 hours on the next shift
```

---

### 9. Epic: Safety Checklist

**Test Input:**
```
Made sure the bed is in the lowest position. Call light is right next to the patient within easy reach. Both side rails are up. Patient has non-slip socks on both feet. Bed alarm is activated and I tested it to make sure it's working. Patient is moderate fall risk based on the assessment. Talked with the patient and family about fall prevention, they understand to call for help before getting up.
```

**Expected Output:**
```
SAFETY CHECKLIST

Bed Position: Lowest position
Call Light: Within reach
Side Rails: Up
Non-Slip Socks: Applied
Bed Alarm: Activated
Fall Risk: Moderate
Comments: Safety measures in place and verified. Patient and family educated on fall prevention, verbalize understanding to call for assistance before mobilizing.
```

---

### 10. Epic: Med-Surg Unit

**Test Input:**
```
Patient is post-op day 2 after appendectomy. Temperature has been normal, no fever today. He's been walking in the hallway with minimal help, did about 100 feet this morning. Eating a regular diet, finished most of his lunch with no nausea. Pain is well controlled at 3 out of 10 with the oral pain meds. Encouraged him to keep walking and do his incentive spirometer exercises. Plan is to continue advancing activity and hopefully discharge tomorrow if everything stays stable.
```

**Expected Output:**
```
MED-SURG UNIT PROGRESS NOTE

Post-Op Status: Post-op day 2 after appendectomy
Temperature: Afebrile, no fever noted today
Mobility: Ambulating with minimal assistance, 100 feet in hallway this morning
Diet: Tolerating regular diet, good oral intake, no nausea
Pain: 3/10, well controlled with oral analgesics
Interventions: Encouraged continued ambulation and incentive spirometry exercises
Plan: Continue advancing activity as tolerated. Potential discharge tomorrow if condition remains stable.
```

---

### 11. Epic: ICU Unit

**Test Input:**
```
Patient is still intubated on the ventilator, FiO2 is at 40 percent, PEEP is 5, settings are stable. Getting Propofol for sedation, keeping him at a RASS of negative 1, comfortable but arousable. Heart rhythm is normal sinus, blood pressure is stable, MAP is running around 72 with Levophed at 0.08 micrograms per kilogram per minute. Making good urine output, about 50 milliliters per hour. No changes to the vent settings planned, continuing current drips and monitoring closely.
```

**Expected Output:**
```
ICU DAILY NOTE

Ventilation: Intubated, FiO2 40%, PEEP 5, settings stable
Sedation: Propofol infusion, RASS -1 (comfortable but arousable)
Cardiac: Normal sinus rhythm, hemodynamically stable
Hemodynamics: MAP 72 mmHg maintained with Levophed 0.08 mcg/kg/min
Drips/Infusions: Levophed 0.08 mcg/kg/min
Output: Adequate urine output 50ml/hr
Plan: Continue current ventilator settings and vasopressor support. Maintain intensive monitoring and supportive care.
```

---

### 12. Epic: NICU Unit

**Test Input:**
```
Baby is 34 weeks gestational age. In the isolette, temperature control is good, baby's temp is stable at 36.8 celsius. Fed 25 milliliters of formula through the NG tube this morning, took it well, no residuals when I checked. Abdomen is soft, no distension. Oxygen saturation is 98 percent on room air, breathing comfortably, no distress. Parents were here for morning care, did skin to skin for about 45 minutes, great bonding. Weight is up 30 grams from yesterday, now 1850 grams. Continue feeds every 3 hours and keep monitoring vitals.
```

**Expected Output:**
```
NICU PROGRESS NOTE

Gestational Age: 34 weeks
Temperature Control: Isolette maintaining thermal stability, infant temperature 36.8°C stable
Feeding: Fed 25ml formula through the NG tube this morning, took it well, no residuals when I checked. Abdomen is soft, no distension
Oxygen Status: Oxygen saturation is 98 percent on room air, breathing comfortably, no distress
Activity: Resting appropriately for gestational age. Parents present for care, skin-to-skin contact 45 minutes.
Weight: 1850g (up 30g from previous day)
Plan: Continue feeding schedule Q3H. Maintain current monitoring. Encourage continued parental involvement.
```

---

### 13. Epic: Mother-Baby Unit

**Test Input:**
```
Mom is doing great, walking around the room without help. Breastfeeding every 2 to 3 hours, baby latching well. Checked her fundus and it's firm, at the belly button, no concerns. Lochia is moderate, bright red, no clots. She says pain is only 1 out of 10, very minimal. Baby is eating well, getting good feeds, lots of wet diapers and had two good stools today. Cord looks clean and dry, did care on it this morning. Taught mom and dad about safe sleep practices, they understand not to put blankets or toys in the crib. Both bonding really well with the baby.
```

**Expected Output:**
```
MOTHER-BABY UNIT NOTE

Maternal Status: Mom is doing great, walking around the room without help. Breastfeeding every 2 to 3 hours, baby latching well
Fundus: Firm, at umbilicus, no concerns
Lochia: Moderate rubra (bright red), no clots
Maternal Pain: 1/10
Newborn Status: Baby is eating well, getting good feeds, lots of wet diapers and had two good stools today
Cord Care: Cord looks clean and dry, did care on it this morning
Education: Taught mom and dad about safe sleep practices, they understand not to put blankets or toys in the crib
Bonding: Appropriate parent-infant bonding observed. Both parents bonding well with baby.
Plan: Continue routine postpartum care and breastfeeding support. Monitor maternal and newborn status.
```

---

## Testing Instructions

1. **Navigate to your app** at http://localhost:8081/
2. **For each template:**
   - Select the template from the dropdown
   - Copy the test input above
   - Paste into the text input area (or use voice to speak it)
   - Click "Generate Note"
   - Compare output with expected output above

3. **What to verify:**
   - ✅ All key information extracted correctly
   - ✅ Professional medical terminology used
   - ✅ No emojis in output
   - ✅ Proper structure and formatting
   - ✅ Measurements and values accurate
   - ✅ Sections properly organized

## Note

The outputs shown are ideal AI-generated results. If using fallback mode (when OpenAI is unavailable), the output will be similar but may be slightly less refined in wording while still capturing all the key data points accurately.
