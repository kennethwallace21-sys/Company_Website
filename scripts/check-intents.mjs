// Regression check for the FAQ intent matcher.
// Run with: npm run test:intents
// matchIntent returns an object ({ id, answer, contact, direct }); the check
// compares result.id. Use `not:` to assert an id that must NOT be returned.
import { matchIntent } from '../src/components/faqIntents.js';

const CASES = [
    { input: 'What security certifications do you hold?', expect: 'compliance' },
    { input: 'Do you hold SOC 2 Type II?', expect: 'compliance' },
    { input: 'Can you help us with a capability statement?', expect: 'start' },
    { input: 'Do you undergo third-party audits?', expect: 'compliance' },
    { input: 'Can I see your capabilities?', expect: 'about' },
    { input: 'Can we book a call later this week?', expect: 'start' },
    { input: 'Are you FedRAMP authorized?', expect: 'compliance' },
    { input: 'Can you work with CUI data?', expect: 'compliance' },
    { input: 'Do you offer training for our staff?', expect: 'training' },
    { input: 'What is your pricing model?', expect: 'pricing' },
    { input: 'Where do I send the RFP?', expect: 'start' },
    { input: 'Is the data hosted in the US?', expect: 'deployment' },
    { input: 'I would like to schedule a demo.', expect: 'start' },
    { input: 'Is this a bot?', expect: 'meta' },
    { input: 'Do you encrypt data in transit?', expect: 'security' },
    { input: 'Can you sign a BAA?', expect: 'compliance' },
    { input: 'Can you give me a sample of your work?', expect: 'references' },
    { input: 'How much storage do you provide?', not: 'pricing' },
    { input: 'What do you sell?', expect: 'about' },
    { input: 'Who is this for?', expect: 'about' },
    { input: 'Where does my data go?', expect: 'deployment' },
    { input: 'What is the first step?', expect: 'start' },
    { input: 'Are you a small business?', expect: 'team' },
    { input: 'What is Operational Intelligence?', expect: 'signals' },
    { input: 'Do you offer custom integrations?', expect: 'integrations' },
    { input: 'thanks', expect: 'thanks' },
    { input: 'hello', expect: 'greeting' }
];

const rows = CASES.map(({ input, expect, not }) => {
    const got = matchIntent(input)?.id;
    const ok = expect !== undefined ? got === expect : got !== not;
    return { ok, input, wanted: expect !== undefined ? expect : `not ${not}`, got };
});

const pad = (s, n) => String(s).padEnd(n);
const wInput = Math.max(5, ...rows.map((r) => r.input.length));
const wWant = Math.max(8, ...rows.map((r) => r.wanted.length));
console.log(`${pad('', 4)} ${pad('Input', wInput)}  ${pad('Expected', wWant)}  Got`);
for (const r of rows) {
    console.log(`${pad(r.ok ? 'PASS' : 'FAIL', 4)} ${pad(r.input, wInput)}  ${pad(r.wanted, wWant)}  ${r.got}`);
}

const failed = rows.filter((r) => !r.ok);
console.log(`\n${rows.length - failed.length}/${rows.length} passed`);
if (failed.length > 0) {
    process.exitCode = 1;
}
