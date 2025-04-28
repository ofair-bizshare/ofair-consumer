
import { setSuperAdmin } from '@/utils/admin/setSuperAdmin';

// Execute the function
setSuperAdmin('info@ofair.co.il')
  .then(result => {
    console.log(result.message);
  })
  .catch(error => {
    console.error('Failed to set super admin:', error);
  });
