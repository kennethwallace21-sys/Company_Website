// FAQ intents and a pure, React-free matcher for the Catalyst FAQ Guide.
//
// Matching rules:
//  - The message is lowercased and split into tokens on anything that is not a
//    letter or digit.
//  - A keyword matches only as a whole token or a whole contiguous phrase of
//    tokens. There is no substring matching.
//  - Keywords are tokenized the same way, so "on-prem" and "on prem" are equal
//    and "sam.gov" is the phrase [sam, gov].
//  - An intent's score is the sum of the token counts of its matched keywords
//    (a multi-word phrase outweighs a single word). At least one hit is
//    required. Ties go to the intent listed first.
//  - Greeting, thanks and goodbye detection runs only for messages of 4 or
//    fewer tokens that match no FAQ intent.
//
// Answers use **bold** markers, rendered as React <strong> elements by the
// component. They must stay truthful: nothing here claims a certification or
// an authorization.

export const FALLBACK_TEXT =
    'I do not have a verified answer for that. Send it to our team and a person will reply.';

export const CERTIFICATION_DISCLAIMER =
    'This site does not claim any certification or authorization, such as FedRAMP, CMMC or SOC 2. We deploy into environments where your organization holds the authorization, and we map controls to the framework you name during scoping. Ask us about a specific requirement.';

export const intents = [
    {
        id: 'meta',
        question: 'Is this a bot or a person?',
        answer:
            'This is an automated FAQ search, not a live agent or an AI model. For a person, use the contact page or email sales@catalystappliedai.com.',
        contact: true,
        keywords: [
            'is this a bot', 'are you a bot', 'are you human', 'are you a real person', 'is this ai',
            'is this automated', 'are you an ai'
        ]
    },
    {
        id: 'deployment',
        question: 'Can you deploy in AWS GovCloud, on-premises, or air-gapped environments?',
        answer:
            'We deploy into the environment you choose: your own cloud tenant (including AWS GovCloud and Azure Government), on-premises or air-gapped hardware, or a managed environment Catalyst operates. In your tenant or on premises, your data stays in the environment you operate. Tell us your residency and network requirements and we confirm the right model during scoping.',
        keywords: [
            'govcloud', 'gov cloud', 'aws', 'azure', 'airgap', 'airgapped', 'air gap', 'air gapped', 'air-gapped',
            'on-prem', 'on prem', 'onprem', 'on-premise', 'on premise', 'on-premises', 'on premises',
            'premise', 'premises', 'deploy', 'deployed', 'deployment', 'deployments', 'hosted', 'hosting', 'host',
            'hardware', 'tenant', 'perimeter', 'infrastructure', 'cloud', 'residency', 'dgx', 'nvidia nim',
            'in the us', 'within the us',
            'where does my data go', 'data go', 'data stored'
        ]
    },
    {
        id: 'about',
        question: 'What does Catalyst Applied AI do?',
        answer:
            'We build three AI products for enterprise and public sector teams: **Agentic AI Assistants** that carry out multi-step work, **Operational Intelligence** for plain-language reporting on operational data, and **Custom RAG Systems** that answer from your documents with citations. We deploy them in the environment you choose.',
        keywords: [
            'what do you do', 'what you do', 'overview', 'about catalyst', 'who are you', 'service', 'services',
            'product', 'products', 'offerings', 'capabilities', 'solutions', 'what is catalyst',
            'sell', 'what do you offer', 'who is this for', 'what does catalyst', 'catalyst applied ai do'
        ]
    },
    {
        id: 'agents',
        question: 'What are your Agentic AI Assistants?',
        answer:
            'Assistants, such as AIVA for HR, that carry out multi-step work across your internal systems, with optional two-way voice. Each one is scoped to the systems and permissions you approve.',
        keywords: [
            'agent', 'agents', 'agentic', 'aiva', 'assistant', 'assistants', 'voice', 'duplex', 'workflow',
            'workflows', 'automate', 'automation', 'chatbot', 'chatbots', 'bots'
        ]
    },
    {
        id: 'signals',
        question: 'What is Operational Intelligence?',
        answer:
            'Plain-language reporting on your operational data: summaries, trends, flagged exceptions and suggested next steps for program and operations leaders.',
        keywords: [
            'signal', 'signals', 'intelligence', 'narrative', 'narratives', 'analytics', 'dashboard', 'dashboards',
            'predictive', 'insights', 'forecast', 'forecasting',
            'operational intelligence', 'operational reporting'
        ]
    },
    {
        id: 'rag',
        question: 'What are Custom RAG Systems?',
        answer:
            'Retrieval-augmented generation over your own documents. Answers cite the passages they came from so people can check the source. This reduces incorrect answers but does not eliminate them, so we also design in guardrails and recommend human review for consequential decisions.',
        keywords: [
            'rag', 'retrieval', 'knowledge base', 'knowledge', 'document', 'documents', 'vector', 'unstructured',
            'citation', 'citations', 'cited', 'grounded', 'hallucinate', 'hallucination', 'hallucinations',
            'accuracy', 'accurate', 'guardrail', 'guardrails'
        ]
    },
    {
        id: 'registrations',
        question: 'What government registrations do you have?',
        contact: true,
        answer:
            'This site does not list federal registrations. Contact us with your requirements. Catalyst is a member of the NVIDIA Inception program for startups. We deploy into environments you control, where your organization holds the authorization, and we map controls to the framework you name, for example NIST SP 800-53 or 800-171, during scoping.',
        keywords: [
            'sam gov', 'sam', 'naics', '541715', '541511', 'government', 'federal', 'gsa', 'inception',
            'nvidia', 'registered', 'registration', 'registrations'
        ]
    },
    {
        id: 'compliance',
        question: 'Are you FedRAMP, CMMC, SOC 2, or otherwise certified?',
        answer: CERTIFICATION_DISCLAIMER,
        contact: true,
        keywords: [
            'fedramp', 'cmmc', 'nist', 'soc', 'soc2', 'iso', 'hipaa', 'itar', 'cui', 'fisma', 'il4', 'il5',
            'stig', 'pci', 'gdpr', 'clearance', 'clearances', 'cleared', 'certification', 'certifications',
            'certified', 'certificate', 'accreditation', 'accredited', 'authorized', 'authorization', 'ato',
            'audit', 'audits', 'audited', 'third party', 'compliance', 'compliant', '800 53', '800 171',
            'baa', 'business associate'
        ]
    },
    {
        id: 'security',
        question: 'How is my data protected? Is it used to train public models?',
        answer:
            'Our practices: encryption in transit, least-privilege access, and deployment into customer-controlled environments. We do not train public models on customer data.',
        keywords: [
            'security', 'secure', 'safe', 'safety', 'privacy', 'private', 'confidential', 'encrypt', 'encrypted', 'encryption', 'in transit', 'at rest',
            'chatgpt', 'openai', 'public model', 'public models', 'leak', 'protect', 'protected', 'least privilege',
            'access control', 'rbac', 'train on', 'trained on', 'train models'
        ]
    },
    {
        id: 'pricing',
        question: 'How much does it cost?',
        answer:
            'Pricing is set per engagement. The scoping step ends in a written plan with scope, timeline and cost.',
        contact: true,
        keywords: [
            'price', 'prices', 'pricing', 'cost', 'costs', 'budget', 'quote', 'rates', 'fee', 'fees', 'expensive',
            'pilot', 'pilots', 'statement of work', 'sow', 'proposal', 'estimate',
            'how much does', 'how much is', 'how much do you charge'
        ]
    },
    {
        id: 'start',
        question: 'How do I get started or contact you?',
        answer:
            'Use the contact page, email sales@catalystappliedai.com, or call +1-502-416-8342. Tell us the use case, the data involved and where the system has to run, and we will come back with next steps.',
        contact: true,
        direct: true,
        keywords: [
            'get started', 'getting started', 'start', 'begin', 'contact', 'reach', 'email', 'call', 'phone',
            'talk to someone', 'talk to sales', 'talk to a person',
            'hire', 'sales', 'book', 'meeting', 'demo', 'consultation', 'rfp', 'rfq', 'rfi', 'solicitation',
            'schedule a demo', 'book a demo', 'request a demo', 'set up a demo', 'schedule a call',
            'capability statement', 'capabilities statement',
            'roi assessment', 'assessment', 'discovery', 'diagnostic', 'scoping',
            'first step', 'next step'
        ]
    },
    {
        id: 'timeline',
        question: 'How long does a project take?',
        answer:
            'Timelines depend on scope and the environment you deploy into. We start with a short scoping step that ends in a written build plan, and that plan includes a timeline.',
        contact: true,
        keywords: [
            'timeline', 'timelines', 'how long', 'duration', 'timeframe', 'turnaround', 'weeks', 'months',
            'time to deploy', 'time frame', 'schedule'
        ]
    },
    {
        id: 'integrations',
        question: 'Do you offer custom integrations?',
        answer:
            'Yes. We connect AI systems into your existing stack, such as ERP, CRM, databases, APIs, and custom software. For specific requirements such as single sign-on, tell us which systems and identity provider you use and we confirm what is needed during scoping.',
        keywords: [
            'integrate', 'integrates', 'integration', 'integrations', 'connect', 'api', 'apis', 'salesforce',
            'database', 'databases', 'crm', 'erp', 'existing system', 'existing systems', 'sso', 'saml', 'okta',
            'single sign on', 'active directory', 'sharepoint', 'custom integrations'
        ]
    },
    {
        id: 'training',
        question: 'Do you offer training for our staff?',
        answer:
            'Yes. User training and handover can be included in an engagement. Tell us who needs to be trained and on what, and we scope it together with the rest of the work.',
        contact: true,
        keywords: [
            'training', 'enablement', 'staff', 'onboarding', 'workshop', 'workshops', 'upskill', 'upskilling',
            'handover', 'train our team', 'train my team', 'train our staff', 'train staff'
        ]
    },
    {
        id: 'support',
        question: 'What support do you provide after launch?',
        answer:
            'Ongoing support and maintenance are set per engagement. Tell us what you need after go-live and we confirm what is included during scoping.',
        contact: true,
        keywords: [
            'maintenance', 'sla', 'slas', 'ongoing', 'post launch', 'after launch', 'after deployment',
            'after go live', 'technical support', 'customer support', 'help desk', 'support plan', 'support options'
        ]
    },
    {
        id: 'team',
        question: 'Who are you and where are you located?',
        answer:
            'Catalyst Applied AI, LLC is based in Louisville, Kentucky, USA, and builds for enterprise and public sector organizations.',
        keywords: [
            'location', 'located', 'where are you', 'kentucky', 'louisville', 'office', 'headquarters', 'hq', 'team',
            'company', 'founder', 'founders', 'leadership', 'about us',
            'small business'
        ]
    },
    {
        id: 'references',
        question: 'Do you have case studies or references?',
        answer:
            'We do not publish customer names or case studies on this site. Contact us to discuss what is possible for your use case.',
        contact: true,
        keywords: [
            'case study', 'case studies', 'reference', 'references', 'customer', 'customers', 'client references', 'other clients', 'past clients',
            'clients', 'testimonial', 'testimonials', 'portfolio', 'past performance',
            'sample', 'samples', 'sample of your work', 'examples of your work'
        ]
    }
];

const SMALL_TALK = [
    {
        id: 'thanks',
        answer: 'You are welcome. Is there anything else I can help you find?',
        keywords: ['thanks', 'thank', 'thx', 'appreciate', 'cheers']
    },
    {
        id: 'bye',
        answer:
            'Goodbye. If you have more questions or want to discuss a deployment, reach our team at sales@catalystappliedai.com.',
        keywords: ['bye', 'goodbye', 'see you', 'take care']
    },
    {
        id: 'greeting',
        answer:
            'Hello. I am the Catalyst FAQ Guide, an automated FAQ search. Ask about deployment, our products, security, or pricing, or pick a question below.',
        keywords: ['hi', 'hello', 'hey', 'howdy', 'good morning', 'good afternoon', 'good evening', 'whats up', 'what s up']
    }
];

export function tokenize(text) {
    return String(text || '')
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean);
}

function compile(list) {
    return list.map((item) => ({
        ...item,
        compiled: item.keywords.map((kw) => tokenize(kw)).filter((t) => t.length > 0)
    }));
}

const COMPILED_INTENTS = compile(intents);
const COMPILED_SMALL_TALK = compile(SMALL_TALK);

function hasPhrase(tokens, phrase) {
    if (phrase.length === 1) return tokens.includes(phrase[0]);
    for (let i = 0; i + phrase.length <= tokens.length; i++) {
        let ok = true;
        for (let j = 0; j < phrase.length; j++) {
            if (tokens[i + j] !== phrase[j]) {
                ok = false;
                break;
            }
        }
        if (ok) return true;
    }
    return false;
}

function score(tokens, item) {
    let total = 0;
    for (const phrase of item.compiled) {
        if (hasPhrase(tokens, phrase)) total += phrase.length;
    }
    return total;
}

/**
 * Resolve a user message to an intent.
 * @param {string} message
 * @returns {{id: string, answer: string, contact: boolean, direct: boolean} | {id: 'fallback', answer: string, contact: true, direct: true}}
 */
export function matchIntent(message) {
    const tokens = tokenize(message);

    let best = null;
    let bestScore = 0;
    for (const item of COMPILED_INTENTS) {
        const s = score(tokens, item);
        if (s > bestScore) {
            best = item;
            bestScore = s;
        }
    }
    if (best) {
        return { id: best.id, answer: best.answer, contact: Boolean(best.contact), direct: Boolean(best.direct) };
    }

    if (tokens.length > 0 && tokens.length <= 4) {
        for (const item of COMPILED_SMALL_TALK) {
            if (score(tokens, item) > 0) {
                return { id: item.id, answer: item.answer, contact: false, direct: false };
            }
        }
    }

    return { id: 'fallback', answer: FALLBACK_TEXT, contact: true, direct: true };
}
