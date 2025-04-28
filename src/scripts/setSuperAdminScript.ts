
import { setSuperAdmin } from '@/utils/admin/setSuperAdmin';
import { clearAllAdminCaches } from '@/services/admin/utils/adminCache';

// Get email from command line arguments
const args = process.argv.slice(2);
const email = args[0];

if (!email) {
  console.error('Error: Email argument is required');
  console.error('Usage: npx tsx src/scripts/setSuperAdminScript.ts email@example.com');
  process.exit(1);
}

// Clear any cached admin data first
try {
  clearAllAdminCaches();
  console.log('Admin caches cleared successfully');
} catch (error) {
  console.error('Failed to clear admin caches:', error);
}

// Execute the function
console.log(`Attempting to set super admin access for: ${email}`);
setSuperAdmin(email)
  .then(result => {
    console.log(result.message);
    
    if (result.success) {
      console.log('Super admin access has been granted successfully');
      console.log('Please refresh your browser and check admin access again');
    } else {
      console.error('Failed to set super admin:', result.message);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Failed to set super admin:', error);
    process.exit(1);
  });
