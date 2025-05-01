
import React, { useEffect, useState } from 'react';
import { checkAndCreateRequiredBuckets } from '@/services/admin/utils/storageUtils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const AdminStorageInitializer: React.FC = () => {
  const [status, setStatus] = useState<{
    checking: boolean;
    success: boolean;
    error: string | null;
    bucketStatus: Record<string, boolean>;
  }>({
    checking: true,
    success: false,
    error: null,
    bucketStatus: {}
  });

  useEffect(() => {
    const initStorage = async () => {
      try {
        console.log('Initializing storage buckets from AdminStorageInitializer...');
        const bucketStatus = await checkAndCreateRequiredBuckets();
        
        const allBucketsExist = Object.values(bucketStatus).every(status => status === true);
        
        setStatus({
          checking: false,
          success: allBucketsExist,
          error: allBucketsExist ? null : 'One or more required storage buckets could not be initialized',
          bucketStatus
        });
      } catch (error) {
        console.error('Error initializing storage buckets:', error);
        setStatus({
          checking: false,
          success: false,
          error: 'Error initializing storage buckets',
          bucketStatus: {}
        });
      }
    };
    
    initStorage();
  }, []);

  if (status.checking) {
    return null; // Don't show anything during initialization
  }
  
  if (status.success) {
    return null; // Don't show anything on success
  }
  
  return (
    <Alert variant={status.error ? "destructive" : "default"} className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>התראת מערכת אחסון</AlertTitle>
      <AlertDescription>
        {status.error || 'תיקיות האחסון אותחלו בהצלחה'}
        <div className="mt-2">
          {Object.entries(status.bucketStatus).map(([bucket, exists]) => (
            <div key={bucket} className="flex items-center">
              {exists ? 
                <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" /> : 
                <AlertCircle className="h-3 w-3 text-red-500 mr-1" />}
              <span className="text-sm">
                {bucket}: {exists ? 'מוכן' : 'חסר'}
              </span>
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default AdminStorageInitializer;
