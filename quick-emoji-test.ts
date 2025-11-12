/**
 * Quick test to verify emoji formatting in templates
 */

import { enhancedAIService } from './src/lib/enhancedAIService';

async function testEmojiFormat() {
  console.log('Testing SOAP template with emoji format...\n');

  const soapTest = await enhancedAIService.generateNote({
    template: 'SOAP',
    input: 'Patient reports chest pain for 2 hours. BP 140/90, HR 88, O2 sat 98%. EKG normal.',
    context: {
      chiefComplaint: 'Chest pain'
    }
  });

  console.log('SOAP Note Output:');
  Object.entries(soapTest.sections).forEach(([section, data]) => {
    console.log(`\n${section}:`);
    console.log(data.content);
  });

  console.log('\n\n=================================\n');
  console.log('Testing Epic MAR template with emoji format...\n');

  const marTest = await enhancedAIService.generateNote({
    template: 'mar',
    input: 'Administered Lisinopril 10mg PO at 0900. Patient tolerated well.',
    context: {}
  });

  console.log('MAR Output:');
  Object.entries(marTest.sections).forEach(([section, data]) => {
    console.log(`\n${section}:`);
    console.log(data.content);
  });

  console.log('\n\n=================================\n');
  console.log('Testing Epic Shift Assessment template...\n');

  const shiftTest = await enhancedAIService.generateNote({
    template: 'shift-assessment',
    input: 'Patient alert and oriented x3. Lungs clear bilaterally. Pain 3/10 managed with Tylenol.',
    context: {}
  });

  console.log('Shift Assessment Output:');
  Object.entries(shiftTest.sections).forEach(([section, data]) => {
    console.log(`\n${section}:`);
    console.log(data.content);
  });
}

testEmojiFormat().then(() => {
  console.log('\n\nEmoji format test complete!');
  process.exit(0);
}).catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});
