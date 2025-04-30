import React, { useState } from 'react';
import { Upload, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { uploadProfessionalsFromExcel } from '@/services/admin/professionals';
import * as XLSX from 'xlsx';

interface ExcelProfessional {
  name: string;
  profession: string;
  location: string;
  specialties: string;
  phoneNumber: string;
  about: string;
  rating?: number;
  company_name?: string;
  work_hours?: string;
  certifications?: string;
  experience_years?: number;
}

const ProfessionalsExcelUploader = ({ onUploaded }: { onUploaded: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<ExcelProfessional[]>([]);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      parseExcel(selectedFile);
    }
  };

  const parseExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json<ExcelProfessional>(worksheet);
        
        // Set preview data (first 5 rows)
        setPreviewData(jsonData.slice(0, 5));
        
        if (jsonData.length === 0) {
          setError('הקובץ ריק או אינו בפורמט המתאים');
        } else {
          // Check for required fields
          const requiredFields = ['name', 'profession', 'location', 'phoneNumber'];
          const missingFields = [];
          
          for (const field of requiredFields) {
            if (!jsonData[0].hasOwnProperty(field)) {
              missingFields.push(field);
            }
          }
          
          if (missingFields.length > 0) {
            setError(`חסרים שדות נדרשים בקובץ: ${missingFields.join(', ')}`);
          }
        }
      } catch (error) {
        console.error('Error parsing Excel:', error);
        setError('שגיאה בקריאת הקובץ. וודא שהקובץ הוא Excel תקין');
        setPreviewData([]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          const jsonData = XLSX.utils.sheet_to_json<ExcelProfessional>(worksheet);
          
          // Process each professional using our new function
          const result = await uploadProfessionalsFromExcel(jsonData);
          
          if (result.success) {
            setSuccess(true);
            setFile(null);
            setPreviewData([]);
            onUploaded(); // Refresh the professionals list
          } else {
            setError(result.error || 'שגיאה בהעלאת הנתונים');
          }
        } catch (error) {
          console.error('Error processing Excel file:', error);
          setError('שגיאה בעיבוד קובץ האקסל');
        } finally {
          setUploading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error uploading Excel:', error);
      setError('שגיאה בהעלאת הקובץ');
      setUploading(false);
    }
  };

  const handleResetUpload = () => {
    setFile(null);
    setPreviewData([]);
    setError(null);
    setSuccess(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="mr-2" size={20} />
          העלאת בעלי מקצוע מקובץ Excel
        </CardTitle>
        <CardDescription>העלה קובץ Excel המכיל רשימת בעלי מקצוע</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>שגיאה</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700">העלאה הושלמה בהצלחה</AlertTitle>
            <AlertDescription>בעלי המקצוע נוספו למערכת בהצלחה</AlertDescription>
          </Alert>
        )}
        
        {!success && (
          <>
            <div className="mb-6">
              <input
                type="file"
                id="excel-upload"
                accept=".xlsx, .xls"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="excel-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="mb-2 text-gray-400" size={32} />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-bold">לחץ להעלאת קובץ</span> או גרור לכאן
                  </p>
                  <p className="text-xs text-gray-500">Excel (.xlsx, .xls)</p>
                </div>
                {file && <p className="text-sm text-blue-600">{file.name}</p>}
              </label>
            </div>
            
            {previewData.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2 text-gray-700">תצוגה מקדימה (5 שורות ראשונות):</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-right border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-2 border">שם</th>
                        <th className="p-2 border">מקצוע</th>
                        <th className="p-2 border">אזור</th>
                        <th className="p-2 border">טלפון</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 border">{row.name}</td>
                          <td className="p-2 border">{row.profession}</td>
                          <td className="p-2 border">{row.location}</td>
                          <td className="p-2 border">{row.phoneNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {success ? (
          <Button variant="outline" onClick={handleResetUpload}>
            העלאה חדשה
          </Button>
        ) : (
          <>
            <Button variant="outline" className="ml-2" onClick={handleResetUpload}>
              נקה
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading || !!error}
              className="flex items-center"
            >
              {uploading ? 'מעלה...' : 'העלה בעלי מקצוע'}
              {!uploading && <Upload className="mr-2" size={16} />}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfessionalsExcelUploader;
