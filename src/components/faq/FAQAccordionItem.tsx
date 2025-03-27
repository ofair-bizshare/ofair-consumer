
import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface FAQAccordionItemProps {
  value: string;
  question: string;
  children: React.ReactNode;
}

const FAQAccordionItem = ({ value, question, children }: FAQAccordionItemProps) => {
  return (
    <AccordionItem value={value} className="border-b border-gray-200">
      <AccordionTrigger className="text-lg font-medium py-4 hover:text-blue-700">{question}</AccordionTrigger>
      <AccordionContent className="text-gray-700 pb-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default FAQAccordionItem;
