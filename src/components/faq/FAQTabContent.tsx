
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Accordion } from '@/components/ui/accordion';
import FAQAccordionItem from './FAQAccordionItem';

interface FAQTabContentProps {
  value: string;
  items: {
    id: string;
    question: string;
    answer: React.ReactNode;
  }[];
}

const FAQTabContent = ({ value, items }: FAQTabContentProps) => {
  return (
    <TabsContent value={value} className="mt-0">
      <Accordion type="single" collapsible className="w-full">
        {items.map((item) => (
          <FAQAccordionItem key={item.id} value={item.id} question={item.question}>
            {item.answer}
          </FAQAccordionItem>
        ))}
      </Accordion>
    </TabsContent>
  );
};

export default FAQTabContent;
