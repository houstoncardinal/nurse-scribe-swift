/**
 * Epic Export Formats
 * Converts notes to Epic EMR-compatible formats
 */

import { 
  EpicTemplateType,
  ShiftPhase,
  UnitType,
  ShiftAssessmentTemplate,
  MARTemplate,
  IOTemplate,
  WoundCareTemplate,
  SafetyChecklistTemplate
} from './epicTemplates';

export interface EpicExportOptions {
  format: 'text' | 'json' | 'xml' | 'hl7';
  includeMetadata?: boolean;
  includeTimestamps?: boolean;
  compressWhitespace?: boolean;
}

export interface EpicExportResult {
  content: string;
  format: string;
  size: number;
  timestamp: string;
}

class EpicExportFormatsService {
  /**
   * Export note to Epic-compatible format
   */
  public exportToEpic(
    note: any,
    template: EpicTemplateType,
    options: EpicExportOptions = { format: 'text' }
  ): EpicExportResult {
    let content: string;

    switch (options.format) {
      case 'json':
        content = this.exportToJSON(note, template, options);
        break;
      case 'xml':
        content = this.exportToXML(note, template, options);
        break;
      case 'hl7':
        content = this.exportToHL7(note, template, options);
        break;
      case 'text':
      default:
        content = this.exportToText(note, template, options);
        break;
    }

    return {
      content,
      format: options.format,
      size: content.length,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Export to plain text format (Epic standard)
   */
  private exportToText(
    note: any,
    template: EpicTemplateType,
    options: EpicExportOptions
  ): string {
    let output = '';

    // Add header
    if (options.includeMetadata) {
      output += this.generateTextHeader(note, template);
      output += '\n' + '='.repeat(80) + '\n\n';
    }

    // Template-specific formatting
    switch (template) {
      case 'shift-assessment':
        output += this.formatShiftAssessmentText(note);
        break;
      case 'mar':
        output += this.formatMARText(note);
        break;
      case 'io':
        output += this.formatIOText(note);
        break;
      case 'wound-care':
        output += this.formatWoundCareText(note);
        break;
      case 'safety-checklist':
        output += this.formatSafetyChecklistText(note);
        break;
      case 'med-surg':
      case 'icu':
      case 'nicu':
      case 'mother-baby':
        output += this.formatUnitSpecificText(note, template);
        break;
      default:
        output += this.formatGenericText(note);
        break;
    }

    // Add footer
    if (options.includeMetadata) {
      output += '\n' + '='.repeat(80) + '\n';
      output += this.generateTextFooter(note);
    }

    return options.compressWhitespace ? this.compressWhitespace(output) : output;
  }

  /**
   * Export to JSON format
   */
  private exportToJSON(
    note: any,
    template: EpicTemplateType,
    options: EpicExportOptions
  ): string {
    const epicNote = {
      template,
      timestamp: new Date().toISOString(),
      ...note
    };

    if (options.includeMetadata) {
      epicNote.metadata = {
        exportedAt: new Date().toISOString(),
        exportedBy: 'Nurse Scribe AI',
        version: '2.0',
        epicCompliant: true
      };
    }

    return JSON.stringify(epicNote, null, 2);
  }

  /**
   * Export to XML format (Epic HL7 CDA)
   */
  private exportToXML(
    note: any,
    template: EpicTemplateType,
    options: EpicExportOptions
  ): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<ClinicalDocument xmlns="urn:hl7-org:v3">\n';
    
    if (options.includeMetadata) {
      xml += '  <typeId root="2.16.840.1.113883.1.3" extension="POCD_HD000040"/>\n';
      xml += '  <templateId root="2.16.840.1.113883.10.20.22.1.1"/>\n';
      xml += `  <id root="${this.generateUUID()}"/>\n`;
      xml += '  <code code="34133-9" codeSystem="2.16.840.1.113883.6.1" displayName="Nursing Note"/>\n';
      xml += `  <effectiveTime value="${this.formatHL7DateTime(new Date())}"/>\n`;
    }

    xml += '  <component>\n';
    xml += '    <structuredBody>\n';

    // Add sections based on template
    xml += this.generateXMLSections(note, template);

    xml += '    </structuredBody>\n';
    xml += '  </component>\n';
    xml += '</ClinicalDocument>';

    return xml;
  }

  /**
   * Export to HL7 v2 format
   */
  private exportToHL7(
    note: any,
    template: EpicTemplateType,
    options: EpicExportOptions
  ): string {
    const timestamp = this.formatHL7DateTime(new Date());
    let hl7 = '';

    // MSH segment (Message Header)
    hl7 += `MSH|^~\\&|NURSE_SCRIBE|FACILITY|EPIC|EPIC|${timestamp}||MDM^T02|${this.generateMessageID()}|P|2.5\r`;

    // EVN segment (Event Type)
    hl7 += `EVN|T02|${timestamp}\r`;

    // PID segment (Patient Identification) - placeholder
    hl7 += 'PID|1||PATIENT_ID^^^FACILITY^MR||DOE^JOHN||19800101|M\r';

    // PV1 segment (Patient Visit)
    hl7 += 'PV1|1|I|UNIT^ROOM^BED||||ATTENDING_ID^ATTENDING^NAME|||||||||||VISIT_ID\r';

    // TXA segment (Document Notification)
    hl7 += `TXA|1|CN|TX|||${timestamp}|||DOC_ID||||||||AV\r`;

    // OBX segments (Observation/Result) - note content
    const noteLines = this.formatNoteForHL7(note, template);
    noteLines.forEach((line, index) => {
      hl7 += `OBX|${index + 1}|TX|NOTE||${this.escapeHL7(line)}||||F\r`;
    });

    return hl7;
  }

  // Text formatting methods
  private formatShiftAssessmentText(note: any): string {
    let output = 'SHIFT ASSESSMENT\n\n';

    if (note.shiftPhase) {
      output += `Shift Phase: ${note.shiftPhase}\n\n`;
    }

    // Patient Assessment
    output += 'PATIENT ASSESSMENT\n';
    output += '-'.repeat(40) + '\n';
    if (note.patientAssessment) {
      output += this.formatSystemAssessment(note.patientAssessment);
    }
    output += '\n';

    // Vital Signs
    output += 'VITAL SIGNS\n';
    output += '-'.repeat(40) + '\n';
    if (note.vitalSigns || note.patientAssessment?.vitalSigns) {
      output += this.formatVitalSigns(note.vitalSigns || note.patientAssessment?.vitalSigns);
    }
    output += '\n';

    // Medications
    if (note.medications || note.medicationAdministration) {
      output += 'MEDICATIONS\n';
      output += '-'.repeat(40) + '\n';
      output += this.formatMedications(note.medications || note.medicationAdministration?.medications);
      output += '\n';
    }

    // I&O
    if (note.intakeOutput) {
      output += 'INTAKE & OUTPUT\n';
      output += '-'.repeat(40) + '\n';
      output += this.formatIntakeOutput(note.intakeOutput);
      output += '\n';
    }

    // Safety
    if (note.safety) {
      output += 'SAFETY CHECKS\n';
      output += '-'.repeat(40) + '\n';
      output += note.safety + '\n\n';
    }

    // Narrative
    if (note.narrative) {
      output += 'NARRATIVE\n';
      output += '-'.repeat(40) + '\n';
      output += note.narrative + '\n';
    }

    return output;
  }

  private formatMARText(note: any): string {
    let output = 'MEDICATION ADMINISTRATION RECORD (MAR)\n\n';

    if (note.shift) {
      output += `Shift: ${note.shift}\n\n`;
    }

    if (note.medications && Array.isArray(note.medications)) {
      note.medications.forEach((med: any, index: number) => {
        output += `Medication ${index + 1}:\n`;
        output += `  Name: ${med.medicationName || med.name}\n`;
        output += `  Dose: ${med.dose}\n`;
        output += `  Route: ${med.route}\n`;
        if (med.site) output += `  Site: ${med.site}\n`;
        output += `  Time: ${med.time}\n`;
        if (med.preAssessment) output += `  Pre-Assessment: ${med.preAssessment}\n`;
        if (med.postAssessment) output += `  Post-Assessment: ${med.postAssessment}\n`;
        output += `  Patient Response: ${med.patientResponse || 'Tolerated well'}\n`;
        if (med.adverseReactions) output += `  Adverse Reactions: ${med.adverseReactions}\n`;
        output += '\n';
      });
    }

    return output;
  }

  private formatIOText(note: any): string {
    let output = 'INTAKE & OUTPUT RECORD\n\n';

    if (note.shift) {
      output += `Shift: ${note.shift}\n`;
    }
    if (note.startTime) output += `Start Time: ${note.startTime}\n`;
    if (note.endTime) output += `End Time: ${note.endTime}\n`;
    output += '\n';

    if (note.intake) {
      output += 'INTAKE:\n';
      Object.entries(note.intake).forEach(([type, amount]) => {
        if (type !== 'total') {
          output += `  ${type.charAt(0).toUpperCase() + type.slice(1)}: ${amount} mL\n`;
        }
      });
      output += `  TOTAL INTAKE: ${note.intake.total} mL\n\n`;
    }

    if (note.output) {
      output += 'OUTPUT:\n';
      Object.entries(note.output).forEach(([type, amount]) => {
        if (type !== 'total' && type !== 'drains') {
          output += `  ${type.charAt(0).toUpperCase() + type.slice(1)}: ${amount} mL\n`;
        }
      });
      if (note.output.drains && Array.isArray(note.output.drains)) {
        note.output.drains.forEach((drain: any) => {
          output += `  ${drain.location}: ${drain.amount} mL (${drain.type})\n`;
        });
      }
      output += `  TOTAL OUTPUT: ${note.output.total} mL\n\n`;
    }

    if (note.balance !== undefined) {
      output += `FLUID BALANCE: ${note.balance >= 0 ? '+' : ''}${note.balance} mL\n\n`;
    }

    if (note.notes) {
      output += `Notes: ${note.notes}\n`;
    }

    return output;
  }

  private formatWoundCareText(note: any): string {
    let output = 'WOUND CARE DOCUMENTATION\n\n';

    output += `Location: ${note.location || 'Not specified'}\n`;
    output += `Stage: ${note.stage || 'Not specified'}\n`;

    if (note.size) {
      output += `Size: ${note.size.length} x ${note.size.width}`;
      if (note.size.depth) output += ` x ${note.size.depth}`;
      output += ` ${note.size.unit || 'cm'}\n`;
    }

    if (note.drainage) {
      output += '\nDRAINAGE:\n';
      output += `  Type: ${note.drainage.type}\n`;
      output += `  Amount: ${note.drainage.amount}\n`;
      output += `  Color: ${note.drainage.color}\n`;
      output += `  Odor: ${note.drainage.odor}\n`;
    }

    if (note.woundBed) {
      output += '\nWOUND BED:\n';
      output += `  Tissue: ${note.woundBed.tissue}\n`;
      output += `  Granulation: ${note.woundBed.percentGranulation}%\n`;
      output += `  Slough: ${note.woundBed.percentSlough}%\n`;
      output += `  Eschar: ${note.woundBed.percentEschar}%\n`;
    }

    if (note.periwound) {
      output += '\nPERIWOUND:\n';
      output += `  Condition: ${note.periwound.condition}\n`;
      output += `  Description: ${note.periwound.description}\n`;
    }

    output += `\nDressing Type: ${note.dressingType || 'Not specified'}\n`;

    if (note.interventions && Array.isArray(note.interventions)) {
      output += '\nINTERVENTIONS:\n';
      note.interventions.forEach((intervention: string) => {
        output += `  - ${intervention}\n`;
      });
    }

    output += `\nPatient Response: ${note.patientResponse || 'Tolerated well'}\n`;
    output += `Next Dressing Change: ${note.nextDressingChange || 'Per protocol'}\n`;
    output += `Photo Taken: ${note.photographTaken ? 'Yes' : 'No'}\n`;

    return output;
  }

  private formatSafetyChecklistText(note: any): string {
    let output = 'SAFETY CHECKLIST\n\n';

    if (note.fallRisk) {
      output += 'FALL RISK:\n';
      output += `  Score: ${note.fallRisk.score}\n`;
      output += `  Level: ${note.fallRisk.level}\n`;
      if (note.fallRisk.interventions) {
        output += '  Interventions:\n';
        note.fallRisk.interventions.forEach((intervention: string) => {
          output += `    - ${intervention}\n`;
        });
      }
      output += '\n';
    }

    if (note.restraints) {
      output += 'RESTRAINTS:\n';
      output += `  In Use: ${note.restraints.inUse ? 'Yes' : 'No'}\n`;
      if (note.restraints.inUse) {
        output += `  Type: ${note.restraints.type}\n`;
        output += `  Reason: ${note.restraints.reason}\n`;
        output += `  Order Verified: ${note.restraints.orderVerified ? 'Yes' : 'No'}\n`;
      }
      output += '\n';
    }

    if (note.isolation) {
      output += 'ISOLATION:\n';
      output += `  Required: ${note.isolation.required ? 'Yes' : 'No'}\n`;
      if (note.isolation.required) {
        output += `  Type: ${note.isolation.type}\n`;
        if (note.isolation.ppeUsed) {
          output += `  PPE Used: ${note.isolation.ppeUsed.join(', ')}\n`;
        }
      }
      output += '\n';
    }

    if (note.patientIdentification) {
      output += 'PATIENT IDENTIFICATION:\n';
      output += `  Verified: ${note.patientIdentification.verified ? 'Yes' : 'No'}\n`;
      output += `  Method: ${note.patientIdentification.method}\n\n`;
    }

    if (note.allergies && Array.isArray(note.allergies)) {
      output += `Allergies: ${note.allergies.join(', ')}\n\n`;
    }

    output += `Code Status: ${note.codeStatus || 'Not specified'}\n\n`;

    if (note.notes) {
      output += `Additional Notes: ${note.notes}\n`;
    }

    return output;
  }

  private formatUnitSpecificText(note: any, template: EpicTemplateType): string {
    let output = `${template.toUpperCase()} UNIT DOCUMENTATION\n\n`;

    // Add sections from note
    if (note.sections) {
      Object.entries(note.sections).forEach(([sectionName, section]: [string, any]) => {
        output += `${sectionName.toUpperCase()}\n`;
        output += '-'.repeat(40) + '\n';
        if (section.content) {
          output += section.content + '\n\n';
        } else if (typeof section === 'string') {
          output += section + '\n\n';
        }
      });
    }

    return output;
  }

  private formatGenericText(note: any): string {
    let output = '';

    if (note.sections) {
      Object.entries(note.sections).forEach(([sectionName, section]: [string, any]) => {
        output += `${sectionName.toUpperCase()}\n`;
        output += '-'.repeat(40) + '\n';
        if (section.content) {
          output += section.content + '\n\n';
        } else if (typeof section === 'string') {
          output += section + '\n\n';
        }
      });
    }

    return output;
  }

  // Helper formatting methods
  private formatSystemAssessment(assessment: any): string {
    let output = '';
    const systems = ['neuro', 'cardiac', 'respiratory', 'gi', 'gu', 'skin', 'musculoskeletal'];
    
    systems.forEach(system => {
      if (assessment[system]) {
        output += `${system.charAt(0).toUpperCase() + system.slice(1)}: ${assessment[system]}\n`;
      }
    });

    return output;
  }

  private formatVitalSigns(vitals: any): string {
    if (!vitals) return 'Not documented\n';

    let output = '';
    if (vitals.bp) output += `BP: ${vitals.bp} mmHg\n`;
    if (vitals.hr) output += `HR: ${vitals.hr} bpm\n`;
    if (vitals.rr) output += `RR: ${vitals.rr} breaths/min\n`;
    if (vitals.temp) output += `Temp: ${vitals.temp}°F\n`;
    if (vitals.spo2) output += `SpO2: ${vitals.spo2}%\n`;
    if (vitals.pain) output += `Pain: ${vitals.pain}/10\n`;
    if (vitals.weight) output += `Weight: ${vitals.weight}\n`;

    return output;
  }

  private formatMedications(medications: any): string {
    if (!medications || !Array.isArray(medications)) return 'None documented\n';

    let output = '';
    medications.forEach((med: any, index: number) => {
      output += `${index + 1}. ${med.name || med.medicationName}`;
      if (med.dose) output += ` ${med.dose}`;
      if (med.route) output += ` ${med.route}`;
      if (med.time) output += ` at ${med.time}`;
      output += '\n';
    });

    return output;
  }

  private formatIntakeOutput(io: any): string {
    let output = '';
    
    if (io.intake) {
      output += `Total Intake: ${io.intake.total || 0} mL\n`;
    }
    if (io.output) {
      output += `Total Output: ${io.output.total || 0} mL\n`;
    }
    if (io.balance !== undefined) {
      output += `Balance: ${io.balance >= 0 ? '+' : ''}${io.balance} mL\n`;
    }

    return output;
  }

  // XML generation methods
  private generateXMLSections(note: any, template: EpicTemplateType): string {
    let xml = '';

    if (note.sections) {
      Object.entries(note.sections).forEach(([sectionName, section]: [string, any]) => {
        xml += '      <section>\n';
        xml += `        <title>${this.escapeXML(sectionName)}</title>\n`;
        xml += '        <text>\n';
        const content = section.content || section;
        xml += `          ${this.escapeXML(content)}\n`;
        xml += '        </text>\n';
        xml += '      </section>\n';
      });
    }

    return xml;
  }

  // HL7 formatting methods
  private formatNoteForHL7(note: any, template: EpicTemplateType): string[] {
    const lines: string[] = [];
    
    if (note.sections) {
      Object.entries(note.sections).forEach(([sectionName, section]: [string, any]) => {
        lines.push(`${sectionName}:`);
        const content = section.content || section;
        if (typeof content === 'string') {
          content.split('\n').forEach(line => {
            if (line.trim()) lines.push(line.trim());
          });
        }
        lines.push('');
      });
    }

    return lines;
  }

  // Utility methods
  private generateTextHeader(note: any, template: EpicTemplateType): string {
    let header = `Epic EMR Export - ${template.toUpperCase()}\n`;
    header += `Generated: ${new Date().toLocaleString()}\n`;
    if (note.timestamp) {
      header += `Note Date: ${new Date(note.timestamp).toLocaleString()}\n`;
    }
    return header;
  }

  private generateTextFooter(note: any): string {
    return `\nEnd of Epic EMR Export\nExported by Nurse Scribe AI v2.0`;
  }

  private compressWhitespace(text: string): string {
    return text.replace(/\n{3,}/g, '\n\n').trim();
  }

  private escapeXML(text: string): string {
    if (typeof text !== 'string') return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private escapeHL7(text: string): string {
    if (typeof text !== 'string') return '';
    return text
      .replace(/\|/g, '\\F\\')
      .replace(/\^/g, '\\S\\')
      .replace(/&/g, '\\T\\')
      .replace(/~/g, '\\R\\')
      .replace(/\\/g, '\\E\\');
  }

  private formatHL7DateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private generateMessageID(): string {
    return `MSG${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
}

// Export singleton instance
export const epicExportFormatsService = new EpicExportFormatsService();

export default epicExportFormatsService;
