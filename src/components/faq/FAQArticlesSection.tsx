
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const FAQArticlesSection = () => {
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
        <BookOpen className="mr-2 h-5 w-5 text-teal-500" />
        מאמרים מומלצים
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">איך לבחור קבלן שיפוצים מהימן</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-4 pb-4">
            <p className="text-sm text-gray-600">10 שאלות שחייבים לשאול לפני שבוחרים קבלן שיפוצים. מדריך מקיף להימנע מטעויות יקרות.</p>
            <Button variant="link" className="text-teal-600 p-0 h-auto mt-2">קרא עוד</Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">מדריך להערכת הצעות מחיר</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-4 pb-4">
            <p className="text-sm text-gray-600">איך לבחון ולהשוות הצעות מחיר בצורה נכונה, ולהבין מה באמת כלול בהן.</p>
            <Button variant="link" className="text-teal-600 p-0 h-auto mt-2">קרא עוד</Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">5 סימנים לאמינות בעל מקצוע</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-4 pb-4">
            <p className="text-sm text-gray-600">הסימנים שאתם צריכים לחפש כדי לוודא שבעל המקצוע אמין, מקצועי ומתאים לפרויקט שלכם.</p>
            <Button variant="link" className="text-teal-600 p-0 h-auto mt-2">קרא עוד</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQArticlesSection;
