"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  id?: string;
  question: string;
  answer: string;
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 text-left space-y-3">
      {items.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.id || index}
            className={`border rounded-2xl transition-all overflow-hidden ${
              isOpen ? "bg-blue-50/30 border-blue-200" : "bg-slate-50/50 border-slate-100 hover:border-slate-200"
            }`}
          >
            <button
              onClick={() => toggle(index)}
              className="w-full text-left p-4 md:p-5 flex items-center justify-between gap-4 font-bold text-sm md:text-base text-slate-900 focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <span>{faq.question}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-blue-600" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pl-13 text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line border-t border-slate-100/60 pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
