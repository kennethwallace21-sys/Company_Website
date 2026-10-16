// Single source for the six Services offerings. Navbar (Services mega menu), Footer
// (Services column), ServicesAccordion and ServiceDetail all read from this list, and
// scripts/check-offerings.mjs (npm run test:offerings) checks that every ServiceDetail
// link in src/, index.html and public/sitemap.xml points at a slug defined here and
// that the dormant JSON-LD and sitemap blocks match it (`--write` regenerates them).
//
// Plain data only (no JSX, no imports, no top-level calls) so the Node check script
// can import it and the bundler can drop it while SHOW_SERVICES is false.
// `icon` is a lucide-react icon name, mapped to the component in Navbar.
// The list order is the display order everywhere, including ServiceDetail prev/next.

export const SERVICE_GROUPS = ['Architecture', 'Engineering', 'Automation & Enablement'];

export const offerings = [
    {
        slug: 'discovery-diagnostic',
        title: 'Discovery & Diagnostic',
        blurb: 'A short scoping engagement that maps where AI pays off in your workflows and ends with a concrete build plan',
        tagline: 'Scoping engagement',
        image: '/services/discovery-diagnostic.jpg',
        icon: 'Search',
        group: 'Architecture',
        detail: {
            heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80',
            description: 'Our Discovery & Diagnostic engagement is a short, focused scoping sprint. We map your workflows, data, and processes to find the highest-impact places for AI, and you walk away with a concrete build plan.',
            benefits: [
                'Identify top ROI opportunities in your workflows',
                'Get a tailored AI readiness assessment',
                'Forecast impact: time saved, costs reduced',
                'Walk away with a concrete, actionable build plan'
            ],
            process: [
                { step: 1, title: 'Assessment', description: 'We conduct in-depth interviews and process analysis' },
                { step: 2, title: 'Analysis', description: 'Our team identifies automation opportunities and ROI potential' },
                { step: 3, title: 'Build Plan', description: 'You receive a prioritized, ready-to-build plan' },
                { step: 4, title: 'Handoff', description: 'We walk through the plan and the recommended next steps' }
            ],
            stats: [
                { value: 'Efficiency', label: 'Cost optimization focus' },
                { value: 'Speed', label: 'Rapid assessment process' },
                { value: 'Quality', label: 'Client-centered approach' }
            ]
        }
    },
    {
        slug: 'custom-ai-solutions',
        title: 'Custom AI Solutions',
        blurb: 'Turn complex problems into working AI tools',
        tagline: 'Bespoke AI builds',
        image: '/services/custom-ai-solutions.jpg',
        icon: 'Cpu',
        group: 'Engineering',
        detail: {
            heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&q=80',
            description: 'We build bespoke AI solutions tailored to your specific business challenges. From generative AI applications to predictive models, we create tools that integrate seamlessly with your existing workflows.',
            benefits: [
                'Build generative AI apps for content & insights',
                'Develop predictive models for forecasting',
                'Create AI agents for repetitive tasks',
                'Engineer solutions tailored to your workflows'
            ],
            process: [
                { step: 1, title: 'Discovery', description: 'Deep dive into your specific requirements' },
                { step: 2, title: 'Design', description: 'Architecture and solution design' },
                { step: 3, title: 'Development', description: 'Agile build with regular demos' },
                { step: 4, title: 'Deployment', description: 'Production rollout with training' }
            ],
            stats: [
                { value: 'Custom', label: 'Tailored solutions' },
                { value: 'Agile', label: 'Flexible development' },
                { value: 'Excellence', label: 'Quality-driven results' }
            ]
        }
    },
    {
        slug: 'workflow-automation',
        title: 'Workflow Automation',
        blurb: 'Faster processes, fewer mistakes, and more time for growth',
        tagline: 'Process streamlining',
        image: '/services/workflow-automation.jpg',
        icon: 'Zap',
        group: 'Automation & Enablement',
        detail: {
            heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80',
            description: 'Transform your business operations with intelligent workflow automation. We embed AI into your existing tools to eliminate manual tasks, reduce errors, and accelerate your processes.',
            benefits: [
                'Embed AI into CRM, ERP, and tools you use',
                'Automate email, ticketing, and scheduling',
                'Orchestrate multi-step workflows',
                'Reduce manual errors and speed up cycles'
            ],
            process: [
                { step: 1, title: 'Mapping', description: 'Document current workflows and pain points' },
                { step: 2, title: 'Design', description: 'Create optimized automation architecture' },
                { step: 3, title: 'Integration', description: 'Connect systems and implement automations' },
                { step: 4, title: 'Optimization', description: 'Monitor and continuously improve' }
            ],
            stats: [
                { value: 'Efficiency', label: 'Time-saving focus' },
                { value: 'Scale', label: 'Comprehensive automation' },
                { value: 'Precision', label: 'Accuracy-driven' }
            ]
        }
    },
    {
        slug: 'data-engineering',
        title: 'Data Engineering',
        blurb: 'Build the foundation for reliable, usable data powering every AI decision',
        tagline: 'Data pipeline design',
        image: '/services/data-engineering.jpg',
        icon: 'Database',
        group: 'Engineering',
        detail: {
            heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80',
            description: 'Strong AI requires strong data foundations. We design and build the data infrastructure that enables reliable AI solutions, from secure architecture to real-time dashboards.',
            benefits: [
                'Design secure, scalable data architecture',
                'Create ETL/ELT pipelines and API integrations',
                'Clean, structure, and label data for accuracy',
                'Implement dashboards for real-time insights'
            ],
            process: [
                { step: 1, title: 'Assess', description: 'Assess current data infrastructure' },
                { step: 2, title: 'Architecture', description: 'Design scalable data systems' },
                { step: 3, title: 'Build', description: 'Implement pipelines and integrations' },
                { step: 4, title: 'Validate', description: 'Ensure data quality and governance' }
            ],
            stats: [
                { value: 'Scalable', label: 'Enterprise-ready' },
                { value: 'Robust', label: 'Reliable platforms' }
            ]
        }
    },
    {
        slug: 'ai-implementation',
        title: 'AI Tools Implementation',
        blurb: 'Deploy safe, scalable enterprise-grade AI tools with confidence',
        tagline: 'Platform rollout',
        image: '/services/ai-implementation.jpg',
        icon: 'Layout',
        group: 'Architecture',
        detail: {
            heroImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&q=80',
            description: 'Leverage leading AI platforms without the complexity. We implement enterprise AI tools with proper security, compliance, and governance guardrails built in from day one.',
            benefits: [
                'Integrate leading AI platforms into your stack',
                'Configure security and compliance guardrails',
                'Build prompt libraries and workflow templates',
                'Ensure seamless adoption without disruption'
            ],
            process: [
                { step: 1, title: 'Selection', description: 'Choose the right AI tools for your needs' },
                { step: 2, title: 'Configuration', description: 'Set up security and compliance' },
                { step: 3, title: 'Integration', description: 'Connect with existing systems' },
                { step: 4, title: 'Rollout', description: 'Phased deployment with support' }
            ]
        }
    },
    {
        slug: 'training-support',
        title: 'Training & Enablement',
        blurb: 'Empower your team to use and lead with AI confidently',
        tagline: 'Team upskilling',
        image: '/services/training-support.jpg',
        icon: 'GraduationCap',
        group: 'Automation & Enablement',
        detail: {
            heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80',
            description: 'Technology is only as good as the people using it. Our training programs demystify AI and give your team the skills and confidence to leverage AI in their daily work.',
            benefits: [
                'Plain-language training that demystifies AI',
                'Step-by-step workshops for daily work',
                'Confidence building for your entire team',
                'Live sessions with Q&A and ongoing support'
            ],
            process: [
                { step: 1, title: 'Assessment', description: 'Evaluate current skill levels' },
                { step: 2, title: 'Curriculum', description: 'Design role-based training programs' },
                { step: 3, title: 'Delivery', description: 'Interactive workshops and hands-on labs' },
                { step: 4, title: 'Support', description: 'Ongoing coaching and resources' }
            ]
        }
    }
];

export const DEFAULT_SERVICE_SLUG = 'discovery-diagnostic';

// Exact slug match only, so inherited names like "constructor" never resolve.
// (A find, not a top-level lookup table, so the list tree-shakes out of the
// bundle when SHOW_SERVICES is false.)
export function getOffering(slug) {
    return offerings.find((o) => o.slug === slug) ?? null;
}

export function serviceDetailPath(slug) {
    return `/ServiceDetail?service=${slug}`;
}
