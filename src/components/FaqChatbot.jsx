import React, { useState, useMemo, useRef, useEffect, useId, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ChevronRight, Search, Send, RotateCcw } from 'lucide-react';
import { contactUrl } from '@/utils';
import { intents, matchIntent } from '@/components/faqIntents';

const AVATAR_SRC = '/chatbot-avatar.png';
const RESPONSE_DELAY_MS = 300;
const MAX_TOPIC_LENGTH = 80;
const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const WELCOME_MESSAGE = {
    type: 'bot',
    text: 'Hello. I am the Catalyst FAQ Guide, an automated FAQ search. Pick a question below or type your own.'
};

const truncate = (text, max) => (text.length > max ? text.slice(0, max) : text);

// Render message text with **bold** markers. Output is React elements only
// (strings are escaped by React); never switch this to raw HTML injection,
// because user-typed text is echoed back into the chat.
function renderText(text) {
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
        if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={i} className="text-blue-400 font-semibold">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        return part;
    });
}

function ContactLinks({ question, direct, onNavigate }) {
    return (
        <div className="mt-2 space-y-1">
            <Link
                to={contactUrl(truncate(question, MAX_TOPIC_LENGTH))}
                onClick={onNavigate}
                className="inline-block text-blue-300 underline underline-offset-2 hover:text-blue-200 font-medium"
            >
                Send this question
            </Link>
            {direct && (
                <p className="text-xs text-slate-300">
                    <a className="text-blue-300 underline underline-offset-2 hover:text-blue-200" href="mailto:sales@catalystappliedai.com">
                        sales@catalystappliedai.com
                    </a>
                    {' | '}
                    <a className="text-blue-300 underline underline-offset-2 hover:text-blue-200" href="tel:+15024168342">
                        +1-502-416-8342
                    </a>
                </p>
            )}
        </div>
    );
}

export default function FaqChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [chatInput, setChatInput] = useState('');
    const [pending, setPending] = useState(0);
    const [showFaqs, setShowFaqs] = useState(true);
    const [messages, setMessages] = useState([WELCOME_MESSAGE]);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const launcherRef = useRef(null);
    const panelRef = useRef(null);
    const timeoutsRef = useRef([]);
    const wasOpenRef = useRef(false);

    const uid = useId();
    const searchId = `${uid}-search`;
    const inputId = `${uid}-message`;
    const titleId = `${uid}-title`;
    const isTyping = pending > 0;

    const filteredFaqs = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        const suggestable = intents.filter((faq) => faq.id !== 'meta');
        if (!query) return suggestable;
        return suggestable.filter(
            (faq) => faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const clearTimers = useCallback(() => {
        timeoutsRef.current.forEach((id) => clearTimeout(id));
        timeoutsRef.current = [];
    }, []);

    const closePanel = useCallback(() => setIsOpen(false), []);

    // Clear pending timers on unmount.
    useEffect(() => clearTimers, [clearTimers]);

    // Auto-scroll to the newest message.
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Focus management: input on open, launcher on close.
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            wasOpenRef.current = true;
        } else if (wasOpenRef.current) {
            wasOpenRef.current = false;
            launcherRef.current?.focus();
        }
    }, [isOpen]);

    // Escape closes the panel.
    useEffect(() => {
        if (!isOpen) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') closePanel();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, closePanel]);

    // Simple focus trap: Tab cycles within the panel.
    const handlePanelKeyDown = (e) => {
        if (e.key !== 'Tab' || !panelRef.current) return;
        // Recomputed on every keydown: framer-motion adds tabindex="0" to
        // disabled motion buttons, and the visible set changes as the UI does.
        const items = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter(
            (el) =>
                !el.disabled &&
                el.tabIndex >= 0 &&
                el.getAttribute('aria-hidden') !== 'true' &&
                el.offsetParent !== null
        );
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && (active === last || !panelRef.current.contains(active))) {
            e.preventDefault();
            first.focus();
        }
    };

    const respond = (build) => {
        setPending((n) => n + 1);
        const id = setTimeout(() => {
            timeoutsRef.current = timeoutsRef.current.filter((t) => t !== id);
            setPending((n) => Math.max(0, n - 1));
            setMessages((prev) => [...prev, build()]);
        }, RESPONSE_DELAY_MS);
        timeoutsRef.current.push(id);
    };

    const botMessageFor = (result, question) => ({
        type: 'bot',
        text: result.answer,
        question: result.contact ? question : null,
        direct: result.direct
    });

    const handleFaqClick = (faq) => {
        setMessages((prev) => [...prev, { type: 'user', text: faq.question }]);
        setSearchQuery('');
        setShowFaqs(false);
        respond(() =>
            botMessageFor(
                { answer: faq.answer, contact: Boolean(faq.contact), direct: Boolean(faq.direct) },
                faq.question
            )
        );
    };

    const handleSendMessage = () => {
        const text = chatInput.trim();
        if (!text) return;
        setMessages((prev) => [...prev, { type: 'user', text }]);
        setChatInput('');
        setShowFaqs(false);
        respond(() => botMessageFor(matchIntent(text), text));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const resetChat = () => {
        clearTimers();
        setPending(0);
        setMessages([WELCOME_MESSAGE]);
        setSearchQuery('');
        setChatInput('');
        setShowFaqs(true);
        inputRef.current?.focus();
    };

    const canSend = chatInput.trim().length > 0;

    return (
        <>
            {/* Launcher */}
            <motion.button
                ref={launcherRef}
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Close FAQ guide' : 'Open FAQ guide'}
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-16 h-16 rounded-full shadow-lg shadow-blue-500/25 flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
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
                            <X className="w-6 h-6 text-white" aria-hidden="true" />
                        </motion.div>
                    ) : (
                        <motion.img
                            key="avatar"
                            src={AVATAR_SRC}
                            width={128}
                            height={128}
                            alt="Catalyst FAQ Guide"
                            className="w-full h-full object-cover"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        />
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        onKeyDown={handlePanelKeyDown}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[calc(100dvh-7rem)] pb-[env(safe-area-inset-bottom)] bg-[#060a14] rounded-2xl shadow-2xl border border-blue-500/15 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                                        <img
                                            src={AVATAR_SRC}
                                            width={128}
                                            height={128}
                                            alt="Catalyst FAQ Guide"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h2 id={titleId} className="text-white font-semibold text-base leading-tight">Catalyst FAQ Guide</h2>
                                        <p className="text-blue-100 text-xs">Automated FAQ search. Not a live agent.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    {messages.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={resetChat}
                                            className="text-white/70 hover:text-white transition-colors p-1"
                                            aria-label="Reset conversation"
                                            title="Reset conversation"
                                        >
                                            <RotateCcw className="w-4 h-4" aria-hidden="true" />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={closePanel}
                                        className="text-white/70 hover:text-white transition-colors p-1"
                                        aria-label="Close FAQ guide"
                                        title="Close FAQ guide"
                                    >
                                        <X className="w-5 h-5" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 max-h-80"
                            aria-live="polite"
                            aria-relevant="additions text"
                        >
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex items-end gap-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.type === 'bot' && (
                                        <img
                                            src={AVATAR_SRC}
                                            width={128}
                                            height={128}
                                            alt=""
                                            className="w-7 h-7 rounded-full object-cover shrink-0"
                                            loading="lazy"
                                        />
                                    )}
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                            msg.type === 'user'
                                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md break-words'
                                                : 'bg-slate-800 text-slate-200 rounded-bl-md'
                                        }`}
                                    >
                                        {renderText(msg.text)}
                                        {msg.question && (
                                            <ContactLinks question={msg.question} direct={msg.direct} onNavigate={closePanel} />
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="flex items-end gap-2">
                                    <img
                                        src={AVATAR_SRC}
                                        width={128}
                                        height={128}
                                        alt=""
                                        className="w-7 h-7 rounded-full object-cover shrink-0"
                                        loading="lazy"
                                    />
                                    <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-md">
                                        <span className="sr-only">Searching FAQs</span>
                                        <div className="flex gap-1.5" aria-hidden="true">
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggested questions */}
                        <AnimatePresence>
                            {showFaqs && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-blue-500/10 overflow-hidden shrink-0"
                                >
                                    <div className="p-3 bg-[#0d1425]/50">
                                        <div className="relative mb-2">
                                            <label htmlFor={searchId} className="sr-only">
                                                Search FAQs
                                            </label>
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                                            <input
                                                id={searchId}
                                                type="text"
                                                placeholder="Search FAQs..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-9 pr-4 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400 mb-1.5">
                                            {searchQuery
                                                ? `${filteredFaqs.length} result${filteredFaqs.length !== 1 ? 's' : ''}`
                                                : 'Suggested questions:'}
                                        </p>
                                        <div className="space-y-1 max-h-28 overflow-y-auto">
                                            {filteredFaqs.length > 0 ? (
                                                filteredFaqs.slice(0, 8).map((faq) => (
                                                    <button
                                                        type="button"
                                                        key={faq.id}
                                                        onClick={() => handleFaqClick(faq)}
                                                        className="w-full text-left p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-xs flex items-center justify-between group transition-colors"
                                                    >
                                                        <span className="truncate pr-2">{faq.question}</span>
                                                        <ChevronRight className="w-3.5 h-3.5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" aria-hidden="true" />
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="text-slate-400 text-xs text-center py-1">No matches found</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Input */}
                        <div className="border-t border-blue-500/10 p-3 bg-[#0a1020] shrink-0">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowFaqs((v) => !v)}
                                    aria-pressed={showFaqs}
                                    aria-label={showFaqs ? 'Hide suggestions' : 'Show suggestions'}
                                    title={showFaqs ? 'Hide suggestions' : 'Show suggestions'}
                                    className={`shrink-0 p-2 rounded-lg transition-colors ${
                                        showFaqs ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                    }`}
                                >
                                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                                </button>
                                <label htmlFor={inputId} className="sr-only">
                                    Type your question
                                </label>
                                <input
                                    id={inputId}
                                    ref={inputRef}
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your question..."
                                    className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                                <motion.button
                                    type="button"
                                    onClick={handleSendMessage}
                                    disabled={!canSend}
                                    aria-label="Send"
                                    className={`shrink-0 p-2.5 rounded-xl transition-all ${
                                        canSend
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    }`}
                                    whileHover={canSend ? { scale: 1.05 } : {}}
                                    whileTap={canSend ? { scale: 0.95 } : {}}
                                >
                                    <Send className="w-4 h-4" aria-hidden="true" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
