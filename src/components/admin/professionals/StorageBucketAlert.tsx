
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface StorageBucketAlertProps {
  bucketStatus: Record<string, boolean>;
}

const StorageBucketAlert: React.FC<StorageBucketAlertProps> = ({ bucketStatus }) => {
  if (Object.keys(bucketStatus).length === 0 || bucketStatus.professionals) {
    return null;
  }

  return (
    <Alert variant="warning" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>חסרות תיקיות אחסון</AlertTitle>
      <AlertDescription>
        תיקיית אחסון 'professionals' חסרה. מערכת תנסה ליצור אותה אוטומטית.
      </AlertDescription>
    </Alert>
  );
};

export default StorageBucketAlert;
