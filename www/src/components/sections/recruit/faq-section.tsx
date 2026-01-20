'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    id: 1,
    question: 'What is Draftr?',
    answer:
      'Draftr is a cloud-based design tool that helps you create stunning designs and prototypes effortlessly.',
  },
  {
    id: 2,
    question: 'Do I need to install anything to use Draftr?',
    answer:
      'No, Draftr is completely cloud-based. You can access it from any browser without any downloads or installations.',
  },
  {
    id: 3,
    question: 'Can I collaborate with others in real time?',
    answer:
      'Yes! Draftr supports real-time collaboration, allowing your team to work together seamlessly.',
  },
  {
    id: 4,
    question: 'Is there a free version of Draftr?',
    answer:
      'Yes, we offer a free version with basic features. You can upgrade to premium for advanced functionality.',
  },
  {
    id: 5,
    question: 'What kind of export options does Draftr support?',
    answer:
      'Draftr supports various export formats including PNG, SVG, PDF, and can generate code for developers.',
  },
];

export function FAQSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          FAQ
        </h2>

        <Accordion
          type="single"
          collapsible
          className="max-w-3xl mx-auto space-y-4"
        >
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={`item-${faq.id}`}
              className="bg-gray-50 rounded-2xl px-6 border-0"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

