
import { setSuperAdmin } from '@/utils/admin/setSuperAdmin';
import { clearAllAdminCaches } from '@/services/admin/utils/adminCache';

// Clear any cached admin data first
try {
  clearAllAdminCaches();
  console.log('Admin caches cleared successfully');
} catch (error) {
  console.error('Failed to clear admin caches:', error);
}

// Execute the function
setSuperAdmin('info@ofair.co.il')
  .then(result => {
    console.log(result.message);
    console.log('Please refresh your browser and check admin access again');
  })
  .catch(error => {
    console.error('Failed to set super admin:', error);
  });
