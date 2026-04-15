import React from 'react';
import { motion } from 'framer-motion';
import { InteractiveImageAccordion } from '../ui/interactive-image-accordion';
import { createPageUrl } from '@/utils';
import { fadeUp } from '@/hooks/useFluidReveal';

// Core offerings — 5 pillars, no deviation
const servicesData = [
  {
      id: 1,
          title: 'RAG-Powered Knowledge Systems',
              panelClass: 'bg-gradient-to-br from-[#0c1929] via-[#132f4c] to-[#0a1628]',
                  linkTo: createPageUrl('ServiceDetail') + '?service=rag-knowledge-systems'
                    },
                      {
                          id: 2,
                              title: 'Agentic Workflow Engines',
                                  panelClass: 'bg-gradient-to-br from-[#0d3d38] via-[#0f766e] to-[#0a2e2a]',
                                      linkTo: createPageUrl('ServiceDetail') + '?service=agentic-workflow-engines'
                                        },
                                          {
                                              id: 3,
                                                  title: 'Human Capital Management Platform',
                                                      panelClass: 'bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0c4a6e]',
                                                          linkTo: createPageUrl('ServiceDetail') + '?service=hcm-platform'
                                                            },
                                                              {
                                                                  id: 4,
                                                                      title: 'Signal Intelligence & AI-Powered Insights',
                                                                          panelClass: 'bg-gradient-to-br from-[#18181b] via-[#27272a] to-[#1c1917]',
                                                                              linkTo: createPageUrl('ServiceDetail') + '?service=signal-intelligence'
                                                                                },
                                                                                  {
                                                                                      id: 5,
                                                                                          title: 'Customized AI Agents',
                                                                                              panelClass: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b]',
                                                                                                  linkTo: createPageUrl('ServiceDetail') + '?service=ai-agents'
                                                                                                    },
                                                                                                    ];

                                                                                                    export default function ServicesAccordion() {
                                                                                                      return (
                                                                                                          <motion.section
                                                                                                                id="services"
                                                                                                                      className="bg-[#060a14] text-white"
                                                                                                                            variants={fadeUp}
                                                                                                                                  initial="hidden"
                                                                                                                                        whileInView="visible"
                                                                                                                                              viewport={{ once: true, margin: '-100px' }}
                                                                                                                                                    custom={0}
                                                                                                                                                        >
                                                                                                                                                              <InteractiveImageAccordion
                                                                                                                                                                      items={servicesData}
                                                                                                                                                                              title={
                                                                                                                                                                                        <>
                                                                                                                                                                                                    Production{' '}
                                                                                                                                                                                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
                                                                                                                                                                                                                              AI Systems
                                                                                                                                                                                                                                          </span>
                                                                                                                                                                                                                                                      {' '}Built & Deployed
                                                                                                                                                                                                                                                                </>
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                subtitle="We build production AI systems and deploy them in your environment. RAG knowledge bases, agentic workflows, workforce intelligence, signal analytics, and domain-trained AI agents. Built. Deployed. Running."
                                                                                                                                                                                                                                                                                        ctaText="Talk to Our Team"
                                                                                                                                                                                                                                                                                                ctaHref="mailto:sales@catalystappliedai.com?subject=Request%20for%20Information"
                                                                                                                                                                                                                                                                                                        defaultActiveIndex={0}
                                                                                                                                                                                                                                                                                                                className="bg-[#060a14] text-white"
                                                                                                                                                                                                                                                                                                                      />
                                                                                                                                                                                                                                                                                                                          </motion.section>
                                                                                                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                                                                                                            }