'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "What is Guess the Elo?",
    answer: "Guess the Elo is a game where you watch chess moves and try to guess the rating of the players based on their decisions and playing style."
  },
  {
    question: "What is Guess the Eval?",
    answer: "Guess the Eval challenges you to analyze chess positions and predict the engine evaluation, helping you think like a chess engine."
  },
  {
    question: "How accurate do I need to be?",
    answer: "The closer you are to the actual rating or evaluation, the more points you'll score. Don't worry about being exact - it's about developing your intuition!"
  },
  {
    question: "Can I practice specific rating ranges?",
    answer: "Yes! You can customize your practice sessions to focus on specific rating ranges and improve your ability to identify playing strengths."
  }
];

export function FAQSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto relative">
            Everything you need to know about our chess analysis challenges
            <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg px-6 overflow-hidden"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6 text-lg font-semibold">
                  <span className="text-white hover:text-blue-400 transition-colors">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-6 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}