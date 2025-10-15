/**
 * Client-side PHI redaction engine
 * No data leaves the browser - all processing is local
 */

export interface RedactionResult {
  redactedText: string;
  redactionCount: number;
  patterns: {
    phones: number;
    dates: number;
    emails: number;
    mrn: number;
    addresses: number;
    names: number;
  };
}

const REDACTION_PATTERNS = {
  // Phone numbers: (555) 123-4567, 555-123-4567, 555.123.4567
  phone: /\b(\+?1[-.]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/gi,
  
  // Dates: 01/15/2024, 2024-01-15, Jan 15 2024
  date: /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-]\d{2,4}\b|\b\d{4}[\/\-](0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])\b|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}\b/gi,
  
  // Email addresses
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
  
  // MRN patterns: MRN: 12345, MRN#12345, Patient ID: 67890
  mrn: /\b(MRN|Patient\s+ID|Medical\s+Record\s+(Number|#)?)[\s:#]*\d{4,10}\b/gi,
  
  // Street addresses: 123 Main St, 45 Oak Avenue
  address: /\b\d{1,5}\s+([A-Z][a-z]+\s+){1,3}(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Court|Ct|Way|Place|Pl)\.?\b/gi,
  
  // Name-like patterns (capitalized words, 2-4 words in sequence)
  // More conservative to avoid false positives
  name: /\b[A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}(\s+[A-Z][a-z]{2,})?\b/g,
};

const REDACTION_LABELS = {
  phone: '[PHONE]',
  date: '[DATE]',
  email: '[EMAIL]',
  mrn: '[MRN]',
  address: '[ADDRESS]',
  name: '[NAME]',
};

/**
 * Redact PHI from text using pattern matching
 * @param text - The text to redact
 * @param includeNames - Whether to redact potential names (can have false positives)
 * @returns Redacted text and statistics
 */
export function redactPHI(text: string, includeNames: boolean = true): RedactionResult {
  let redactedText = text;
  const patterns = {
    phones: 0,
    dates: 0,
    emails: 0,
    mrn: 0,
    addresses: 0,
    names: 0,
  };

  // Apply each redaction pattern
  redactedText = redactedText.replace(REDACTION_PATTERNS.phone, (match) => {
    patterns.phones++;
    return REDACTION_LABELS.phone;
  });

  redactedText = redactedText.replace(REDACTION_PATTERNS.date, (match) => {
    patterns.dates++;
    return REDACTION_LABELS.date;
  });

  redactedText = redactedText.replace(REDACTION_PATTERNS.email, (match) => {
    patterns.emails++;
    return REDACTION_LABELS.email;
  });

  redactedText = redactedText.replace(REDACTION_PATTERNS.mrn, (match) => {
    patterns.mrn++;
    return REDACTION_LABELS.mrn;
  });

  redactedText = redactedText.replace(REDACTION_PATTERNS.address, (match) => {
    patterns.addresses++;
    return REDACTION_LABELS.address;
  });

  if (includeNames) {
    // More conservative name redaction - skip common medical terms
    const medicalTerms = new Set([
      'Blood Pressure', 'Heart Rate', 'Respiratory Rate', 'Pain Scale',
      'Normal Saline', 'Blood Sugar', 'White Blood', 'Red Blood',
    ]);

    redactedText = redactedText.replace(REDACTION_PATTERNS.name, (match) => {
      if (medicalTerms.has(match)) {
        return match; // Don't redact medical terms
      }
      patterns.names++;
      return REDACTION_LABELS.name;
    });
  }

  const redactionCount = Object.values(patterns).reduce((sum, count) => sum + count, 0);

  return {
    redactedText,
    redactionCount,
    patterns,
  };
}

/**
 * Validate that text has been properly redacted
 * @param text - Text to validate
 * @returns True if no obvious PHI patterns remain
 */
export function validateRedaction(text: string): boolean {
  // Check for remaining PHI patterns (except names which are too ambiguous)
  const hasPhone = REDACTION_PATTERNS.phone.test(text);
  const hasEmail = REDACTION_PATTERNS.email.test(text);
  const hasMRN = REDACTION_PATTERNS.mrn.test(text);
  
  return !hasPhone && !hasEmail && !hasMRN;
}
