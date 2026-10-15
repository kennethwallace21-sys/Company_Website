import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ChevronRight, Search, Send, RotateCcw } from 'lucide-react';

const faqs = [
    {
        question: "Can you deploy in AWS GovCloud, on-premise, or air-gapped environments?",
        answer: "Yes. We support three deployment models: managed secure cloud, client cloud tenant (including AWS GovCloud and Azure Government), and fully air-gapped on-premises hardware (such as NVIDIA NIM/DGX). Your proprietary data never leaves your defined perimeter.",
        keywords: ['govcloud', 'gov cloud', 'aws', 'airgap', 'air gap', 'air-gap', 'on-prem', 'on-premise', 'onprem', 'premise', 'deploy', 'deployment', 'where', 'hardware', 'tenant', 'perimeter', 'infrastructure']
    },
    {
        question: "What exactly does Catalyst Applied AI do?",
        answer: "We build production AI systems and deploy them inside your environment: Agentic AI Assistants, Signals & Intelligence, and Custom RAG Systems. We focus on measurable business ROI, not hype.",
        keywords: ['what do you do', 'what you do', 'overview', 'about catalyst', 'who are you', 'company', 'service', 'services', 'offer', 'offerings']
    },
    {
        question: "What are your Agentic AI Assistants?",
        answer: "Custom autonomous agents (such as AIVA for HR) featuring duplex voice capabilities. We build agents that execute multi-step workflows, manage complex tasks, and coordinate with internal systems to reduce repetitive operational overhead.",
        keywords: ['agent', 'agents', 'agentic', 'aiva', 'assistant', 'voice', 'duplex', 'workflow', 'automate', 'chatbot', 'bot']
    },
    {
        question: "What is Signals & Intelligence?",
        answer: "An operational intelligence system that turns raw enterprise data into actionable narratives, predictive insights, and automated recommendations for executive decision-making.",
        keywords: ['signal', 'signals', 'intelligence', 'narrative', 'data', 'analytics', 'dashboard', 'operational', 'predictive']
    },
    {
        question: "What are Custom RAG Systems?",
        answer: "Tailor-made Retrieval-Augmented Generation systems that connect securely to your proprietary documents. Your team gets cited, hallucination-free answers without your data ever leaving your secure environment.",
        keywords: ['rag', 'retrieval', 'knowledge', 'document', 'search', 'vector', 'documents', 'unstructured', 'citation']
    },
    {
        question: "What government registrations and compliance standards do you meet?",
        answer: "Catalyst Applied AI is a registered entity on SAM.gov (NAICS 541715, 541511), an NVIDIA Inception program member, and builds architectures that adhere to strict government and regulated enterprise data sovereignty requirements.",
        keywords: ['sam.gov', 'sam', 'naics', 'government', 'fedramp', 'compliance', 'regulated', 'certifications', 'ciso', '541715', '541511']
    },
    {
        question: "Is my data used to train public models like ChatGPT?",
        answer: "Never. We deploy private models inside your dedicated perimeter with strict trust layers. Your data is never exposed to public foundation model providers.",
        keywords: ['security', 'secure', 'safe', 'safety', 'privacy', 'nda', 'confidential', 'chatgpt', 'public model', 'train', 'training', 'leak', 'protect', 'data safe']
    },
    {
        question: "How do you prevent AI hallucinations?",
        answer: "We use strict Grounded AI architectures and retrieval verification. The AI is restricted to citing verifiable excerpts from your indexed internal records and explicit guardrails.",
        keywords: ['hallucinate', 'hallucination', 'hallucinations', 'accuracy', 'accurate', 'wrong', 'lies', 'invent', 'guardrail', 'guardrails']
    },
    {
        question: "What is the 'Discovery & Diagnostic' service?",
        answer: "It is a short scoping engagement where we map exactly where AI can save you the most time and money in your current workflows, and end with a concrete build plan.",
        keywords: ['discovery', 'diagnostic', 'scoping', 'roadmap', 'assessment', 'audit', 'strategy', 'plan', 'timeline', 'how long']
    },
    {
        question: "How do I get started?",
        answer: "The best way is to book a free ROI Assessment through our Contact page or call us directly at +1-502-416-8342.",
        keywords: ['get started', 'start', 'begin', 'contact', 'reach', 'email', 'call', 'talk', 'hire', 'sales', 'roi assessment', 'book']
    },
    {
        question: "Do you offer custom integrations?",
        answer: "Yes. We connect AI solutions directly into your existing enterprise systems (ERP, CRM, databases, APIs, and custom software stacks).",
        keywords: ['integrate', 'integration', 'connect', 'api', 'salesforce', 'database', 'crm', 'erp', 'existing system']
    },
    {
        question: "Where are you located?",
        answer: "Catalyst Applied AI is based in Louisville, Kentucky, USA, and serves enterprise and government clients nationwide.",
        keywords: ['location', 'located', 'where are you', 'kentucky', 'louisville', 'office', 'remote', 'onsite', 'on-site']
    }
];

// Keyword and semantic scoring to find the best FAQ answer for a user message
function findBestMatch(userMessage) {
    const msg = userMessage.toLowerCase().trim();

    // Greetings
    const greetings = ['hi', 'hello', 'hey', 'howdy', 'good morning', 'good afternoon', 'good evening', 'whats up', "what's up", 'sup'];
    if (greetings.some(g => msg === g || msg.startsWith(g + ' ') || msg.startsWith(g + '!'))) {
        return "Hi there! 👋 I'm the Catalyst FAQ Guide. I can help answer questions about our GovCloud/on-prem deployments, custom products, security, and services. What would you like to know?";
    }

    // Thanks
    const thanks = ['thank', 'thanks', 'thx', 'appreciate', 'ty'];
    if (thanks.some(t => msg.includes(t))) {
        return "You're welcome! 😊 Is there anything else I can help you find?";
    }

    // Bye
    const byes = ['bye', 'goodbye', 'see you', 'later', 'take care'];
    if (byes.some(b => msg.includes(b))) {
        return "Goodbye! 👋 If you have more questions or want to discuss a deployment, don't hesitate to reach out to our team at sales@catalystappliedai.com. Have a great day!";
    }

    // Check keyword lists per FAQ item
    let topFaq = null;
    let topScore = 0;

    for (const faq of faqs) {
        let score = 0;
        for (const kw of faq.keywords) {
            if (msg.includes(kw)) {
                // Longer keyword match gives higher score
                score += kw.includes(' ') ? 5 : 3;
            }
        }
        if (faq.question.toLowerCase().includes(msg)) {
            score += 10;
        }
        if (score > topScore) {
            topScore = score;
            topFaq = faq;
        }
    }

    if (topFaq && topScore >= 3) {
        return topFaq.answer;
    }

    // Fallback: weighted scoring with question match priority
    const stopWords = new Set([
        'what', 'which', 'who', 'whom', 'where', 'when', 'why', 'how',
        'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'into', 'about', 'can', 'you', 'your',
        'i', 'me', 'my', 'we', 'our', 'they', 'them', 'their', 'it', 'its',
        'this', 'that', 'these', 'those', 'there', 'here', 'some', 'any', 'all',
        'tell', 'know', 'please', 'want', 'need', 'like', 'also', 'just', 'more',
        'give', 'get', 'got', 'provide', 'provided'
    ]);

    const msgWords = msg.split(/\s+/)
        .map(w => w.replace(/[^a-z0-9]/g, ''))
        .filter(w => w.length > 2 && !stopWords.has(w));

    let bestScore = 0;
    let bestAnswer = null;

    for (const faq of faqs) {
        const qLower = faq.question.toLowerCase();
        let score = 0;

        for (const word of msgWords) {
            // Heavy weight for matching in the question
            if (qLower.includes(word)) {
                score += 5;
            }
            // Light weight for matching in the answer
            else if (faq.answer.toLowerCase().includes(word)) {
                score += 1;
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestAnswer = faq.answer;
        }
    }

    if (bestScore >= 4) {
        return bestAnswer;
    }

    // Fallback
    return "Great question! I don't have a specific answer for that, but our team would love to help. You can reach us at **sales@catalystappliedai.com** or call **502-416-8342** to talk through what you need. You can also browse the suggested questions below! 👇";
}

export default function FaqChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showFaqs, setShowFaqs] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [messages, setMessages] = useState([
        { type: 'bot', text: "Hi! 👋 I'm the Catalyst FAQ Guide. Search our frequently asked questions below or ask about our GovCloud/on-prem deployments, custom products, and services!" }
    ]);

    const filteredFaqs = useMemo(() => {
        if (!searchQuery.trim()) return faqs;
        const query = searchQuery.toLowerCase();
        return faqs.filter(faq => 
            faq.question.toLowerCase().includes(query) || 
            faq.answer.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    // Auto-scroll to bottom when new messages appear
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const handleFaqClick = (faq) => {
        setMessages(prev => [
            ...prev,
            { type: 'user', text: faq.question },
        ]);
        setSelectedFaq(faq);
        setSearchQuery('');
        setShowFaqs(false);

        // Simulate typing delay
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [
                ...prev,
                { type: 'bot', text: faq.answer }
            ]);
        }, 600 + Math.random() * 400);
    };

    const handleSendMessage = () => {
        const text = chatInput.trim();
        if (!text) return;

        setMessages(prev => [...prev, { type: 'user', text }]);
        setChatInput('');
        setShowFaqs(false);

        // Simulate typing
        setIsTyping(true);
        setTimeout(() => {
            const response = findBestMatch(text);
            setIsTyping(false);
            setMessages(prev => [...prev, { type: 'bot', text: response }]);
        }, 800 + Math.random() * 600);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const resetChat = () => {
        setMessages([
            { type: 'bot', text: "Hi! 👋 I'm the Catalyst FAQ Guide. Search our frequently asked questions below or ask about our GovCloud/on-prem deployments, custom products, and services!" }
        ]);
        setSelectedFaq(null);
        setSearchQuery('');
        setChatInput('');
        setShowFaqs(true);
    };

    // Render message text with bold markdown (**text**)
    // SECURITY NOTE: This is safe from XSS because React escapes string children
    // by default. Do NOT change this to use dangerouslySetInnerHTML: if you do,
    // user-typed chatbot input becomes an XSS injection vector.
    const renderText = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-blue-400 font-semibold">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <>
            {/* Chat Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg shadow-blue-500/25 flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center"
                        >
                            <X className="w-6 h-6 text-white" />
                        </motion.div>
                    ) : (
                        <motion.img
                            key="avatar"
                            src="/chatbot.jpg"
                            alt="Chat with us"
                            className="w-full h-full object-cover"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        />
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-[#060a14] rounded-2xl shadow-2xl border border-blue-500/15 overflow-hidden flex flex-col"
                    style={{ maxHeight: 'calc(100vh - 120px)' }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                                    <img src="/chatbot.jpg" alt="AI Assistant" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Catalyst FAQ Guide</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <p className="text-blue-100 text-xs">Knowledge Base • Instant Answers</p>
                                    </div>
                                </div>
                            </div>
                            {messages.length > 1 && (
                                <button
                                    onClick={resetChat}
                                    className="text-white/60 hover:text-white transition-colors p-1"
                                    title="Reset conversation"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ maxHeight: '320px' }}>
                        {/* Background logo watermark */}
                        {messages.length <= 1 && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '60px' }}>
                                <img src="/logo.jpg" alt="" className="w-24 h-24 object-contain opacity-10 rounded-xl" loading="lazy" />
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`flex items-end gap-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.type === 'bot' && (
                                    <img src="/chatbot.jpg" alt="" className="w-7 h-7 rounded-full object-cover shrink-0" loading="lazy" />
                                )}
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                        msg.type === 'user'
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md'
                                            : 'bg-slate-800 text-slate-200 rounded-bl-md'
                                    }`}
                                >
                                    {renderText(msg.text)}
                                </div>
                            </motion.div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-end gap-2"
                            >
                                <img src="/chatbot.jpg" alt="" className="w-7 h-7 rounded-full object-cover shrink-0" loading="lazy" />
                                <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-md">
                                    <div className="flex gap-1.5">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggested FAQs (toggle) */}
                    <AnimatePresence>
                    {showFaqs && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-blue-500/10 overflow-hidden shrink-0"
                        >
                            <div className="p-3 bg-[#0d1425]/50">
                                {/* Search */}
                                <div className="relative mb-2">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search FAQs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mb-1.5">
                                    {searchQuery ? `${filteredFaqs.length} result${filteredFaqs.length !== 1 ? 's' : ''}` : 'Suggested questions:'}
                                </p>
                                <div className="space-y-1 max-h-28 overflow-y-auto">
                                    {filteredFaqs.length > 0 ? (
                                        filteredFaqs.slice(0, 8).map((faq, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleFaqClick(faq)}
                                                className="w-full text-left p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-xs flex items-center justify-between group transition-colors"
                                            >
                                                <span className="truncate pr-2">{faq.question}</span>
                                                <ChevronRight className="w-3.5 h-3.5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-slate-500 text-xs text-center py-1">No matches found</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>

                    {/* Chat Input */}
                    <div className="border-t border-blue-500/10 p-3 bg-[#0a1020] shrink-0">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowFaqs(!showFaqs)}
                                className={`shrink-0 p-2 rounded-lg transition-colors ${showFaqs ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
                                title={showFaqs ? 'Hide suggestions' : 'Show suggestions'}
                            >
                                <MessageCircle className="w-4 h-4" />
                            </button>
                            <input
                                ref={inputRef}
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message..."
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <motion.button
                                onClick={handleSendMessage}
                                disabled={!chatInput.trim()}
                                className={`shrink-0 p-2.5 rounded-xl transition-all ${
                                    chatInput.trim()
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                                        : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                }`}
                                whileHover={chatInput.trim() ? { scale: 1.05 } : {}}
                                whileTap={chatInput.trim() ? { scale: 0.95 } : {}}
                            >
                                <Send className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </>
    );
}
