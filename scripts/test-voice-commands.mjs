import assert from 'node:assert';
import { parseVoiceCommand, VOICE_LANGUAGES } from '../src/utils/voiceCommands.ts';

console.log('🎤 STARTING VOICEPRINT VOICE COMMANDS UNIT TESTS...\n');

// 1. Language Definitions
console.log('1. Testing Voice Language Definitions...');
assert.strictEqual(VOICE_LANGUAGES.length, 3, 'Must support 3 languages (English, Hindi, Telugu)');
assert.strictEqual(VOICE_LANGUAGES[0].code, 'en-US');
assert.strictEqual(VOICE_LANGUAGES[1].code, 'hi-IN');
assert.strictEqual(VOICE_LANGUAGES[2].code, 'te-IN');
console.log('   ✓ Supported languages verified: English (en-US), Hindi (hi-IN), Telugu (te-IN).');

// 2. Six Required Natural Voice Commands
console.log('\n2. Testing 6 Primary Natural Voice Commands...');

// Command 1: "Explain GoDuet."
const cmd1 = parseVoiceCommand('Explain GoDuet.');
assert.strictEqual(cmd1.type, 'question');
assert.ok(cmd1.query.includes('GoDuet'), 'Must route to GoDuet query');
console.log('   ✓ "Explain GoDuet." -> Correctly mapped to GoDuet architectural query.');

// Command 2: "Show me my projects."
const cmd2 = parseVoiceCommand('Show me my projects.');
assert.strictEqual(cmd2.type, 'navigation');
assert.strictEqual(cmd2.targetId, '#experiments');
console.log('   ✓ "Show me my projects." -> Correctly mapped to #experiments navigation.');

// Command 3: "Explain the encryption system."
const cmd3 = parseVoiceCommand('Explain the encryption system.');
assert.strictEqual(cmd3.type, 'question');
assert.ok(cmd3.query.includes('encryption') || cmd3.query.includes('AES-256-GCM'));
console.log('   ✓ "Explain the encryption system." -> Correctly mapped to AES-256-GCM query.');

// Command 4: "Tell me how I use Wispr Flow."
const cmd4 = parseVoiceCommand('Tell me how I use Wispr Flow.');
assert.strictEqual(cmd4.type, 'question');
assert.ok(cmd4.query.includes('Wispr Flow'));
console.log('   ✓ "Tell me how I use Wispr Flow." -> Correctly mapped to Wispr Flow velocity query.');

// Command 5: "Explain the technology stack."
const cmd5 = parseVoiceCommand('Explain the technology stack.');
assert.strictEqual(cmd5.type, 'question');
assert.ok(cmd5.query.includes('technology stack'));
console.log('   ✓ "Explain the technology stack." -> Correctly mapped to tech stack query.');

// Command 6: "Go to the contact section."
const cmd6 = parseVoiceCommand('Go to the contact section.');
assert.strictEqual(cmd6.type, 'navigation');
assert.strictEqual(cmd6.targetId, '#contact');
console.log('   ✓ "Go to the contact section." -> Correctly mapped to #contact navigation.');

// 3. Section Navigation Suite
console.log('\n3. Testing Comprehensive Section Navigation...');
const navigationTests = [
  { text: 'Go to origin', target: '#origin' },
  { text: 'Show origin story', target: '#origin' },
  { text: 'Open experiments', target: '#experiments' },
  { text: 'Go to voice lab', target: '#voice-lab' },
  { text: 'Open growth arena', target: '#growth-arena' },
  { text: 'Go to ask me', target: '#ask-me' },
  { text: 'Go to next chapter', target: '#next-chapter' },
  { text: 'Go to contact', target: '#contact' },
  { text: 'Go to top', target: '#home' },
];

for (const t of navigationTests) {
  const result = parseVoiceCommand(t.text);
  assert.strictEqual(result.type, 'navigation', `Command "${t.text}" must be navigation`);
  assert.strictEqual(result.targetId, t.target, `Command "${t.text}" must target ${t.target}`);
}
console.log(`   ✓ All ${navigationTests.length} navigation voice commands verified.`);

// 4. Confirmation-Guarded Commands
console.log('\n4. Testing Confirmation-Guarded Destructive/Change Actions...');
const protectedCommands = [
  'reset conversation',
  'clear chat',
  'clear history',
  'clear contact message',
  'reset form'
];

for (const p of protectedCommands) {
  const result = parseVoiceCommand(p);
  assert.strictEqual(result.type, 'confirmation_required', `Command "${p}" must require confirmation`);
  assert.ok(result.actionName.length > 0);
  assert.ok(result.description.length > 0);
}
console.log(`   ✓ All ${protectedCommands.length} protected actions require explicit confirmation before execution.`);

// 5. General Recruiter Queries
console.log('\n5. Testing General Spoken Queries...');
const general = parseVoiceCommand('What is your biggest product failure?');
assert.strictEqual(general.type, 'general_query');
assert.strictEqual(general.query, 'What is your biggest product failure?');
console.log('   ✓ General recruiter queries passed through cleanly for Gemma 4 synthesis.');

console.log('\n============================================================');
console.log('🎉 ALL VOICE COMMAND UNIT TESTS PASSED (100%)!');
console.log('============================================================\n');
