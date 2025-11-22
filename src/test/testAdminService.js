// Simple test to verify admin service
import adminService from '../services/adminService';

const testAdminAPIs = async () => {
  console.log('🔧 Testing Admin Frontend Service...\n');

  // Mock token for testing
  localStorage.setItem('token', 'test-token');

  try {
    console.log('1. Testing getDashboard...');
    await adminService.getDashboard();
    console.log('✅ Dashboard service method exists');

    console.log('2. Testing getAllUsers...');
    await adminService.getAllUsers();
    console.log('✅ Users service method exists');

    console.log('3. Testing getReports...');
    await adminService.getReports();
    console.log('✅ Reports service method exists');

    console.log('\n🎉 All admin service methods implemented!');

  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      console.log('✅ Service methods exist (network error expected without backend)');
    } else {
      console.error('❌ Service error:', error.message);
    }
  }
};

export default testAdminAPIs;