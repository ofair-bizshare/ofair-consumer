
import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { initializeStorageBuckets, listBuckets } from '@/services/admin/utils/storageUtils';

interface StorageInitializerProps {
  requiredBuckets?: string[];
  onStatusChange?: (status: { initialized: boolean; missingBuckets: string[] }) => void;
}

const StorageInitializer: React.FC<StorageInitializerProps> = ({ 
  requiredBuckets = ['professionals', 'articles', 'images'],
  onStatusChange
}) => {
  const [bucketStatus, setBucketStatus] = useState<Record<string, boolean>>({});
  const [initializing, setInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const checkBuckets = async () => {
    try {
      console.log('Checking storage buckets...');
      const buckets = await listBuckets();
      console.log('Available buckets:', buckets);
      
      // Convert buckets to lowercase for case-insensitive comparison
      const lowerCaseBuckets = buckets.map(name => name.toLowerCase());
      
      const status: Record<string, boolean> = {};
      const missingBuckets: string[] = [];
      
      for (const bucket of requiredBuckets) {
        const exists = lowerCaseBuckets.includes(bucket.toLowerCase());
        status[bucket] = exists;
        if (!exists) {
          missingBuckets.push(bucket);
        }
      }
      
      setBucketStatus(status);
      
      if (onStatusChange) {
        onStatusChange({
          initialized: missingBuckets.length === 0,
          missingBuckets
        });
      }
      
      return missingBuckets.length === 0;
    } catch (err) {
      console.error('Error checking buckets:', err);
      setError('שגיאה בבדיקת מצב תיקיות האחסון');
      return false;
    }
  };
  
  const handleInitialize = async () => {
    try {
      setInitializing(true);
      setError(null);
      
      await initializeStorageBuckets();
      await checkBuckets();
    } catch (err) {
      console.error('Error initializing storage buckets:', err);
      setError('שגיאה באתחול תיקיות האחסון');
    } finally {
      setInitializing(false);
    }
  };
  
  useEffect(() => {
    checkBuckets();
    // Run only once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const missingBuckets = Object.entries(bucketStatus)
    .filter(([_, exists]) => !exists)
    .map(([name]) => name);
    
  const allBucketsExist = missingBuckets.length === 0;
  
  if (allBucketsExist && Object.keys(bucketStatus).length > 0) {
    return (
      <Alert variant="success" className="mb-4">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>תיקיות אחסון תקינות</AlertTitle>
        <AlertDescription>
          כל תיקיות האחסון הנדרשות קיימות ומוכנות לשימוש.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert variant="warning" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>חסרות תיקיות אחסון</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <div>
          חסרות תיקיות אחסון: {missingBuckets.join(', ')}
        </div>
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleInitialize} 
            disabled={initializing}
          >
            {initializing ? 'מאתחל תיקיות...' : 'אתחל תיקיות אחסון'}
          </Button>
        </div>
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default StorageInitializer;
