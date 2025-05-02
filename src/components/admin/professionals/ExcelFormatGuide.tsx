
import React from 'react';

const ExcelFormatGuide: React.FC = () => {
  return (
    <div className="mt-6 bg-blue-50 p-4 rounded border border-blue-200">
      <h3 className="font-medium text-blue-800 mb-2">פורמט קובץ Excel לייבוא</h3>
      <p className="text-sm text-blue-600 mb-2">
        הקובץ צריך להכיל את העמודות הבאות (עמודות מסומנות ב-* הן חובה):
      </p>
      <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
        <li>name* - שם בעל המקצוע</li>
        <li>profession* - תחום מקצועי</li>
        <li>location* - אזור עבודה</li>
        <li>phone_number* - מספר טלפון</li>
        <li>specialties - התמחויות (מופרדות בפסיקים)</li>
        <li>about - תיאור</li>
        <li>rating - דירוג (מספר בין 0-5)</li>
        <li>company_name - שם חברה</li>
        <li>work_hours - שעות עבודה</li>
        <li>certifications - תעודות והסמכות (מופרדות בפסיקים)</li>
        <li>experience_years - שנות ניסיון</li>
      </ul>
    </div>
  );
};

export default ExcelFormatGuide;
