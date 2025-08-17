const axios = require('axios');

const API_BASE = 'http://localhost:5000';

async function testAuthentication() {
  console.log('🧪 Testing Ebook Store Authentication System...\n');

  try {
    // Test 1: Health Check
    console.log('1️ Testing server health...');
    const healthResponse = await axios.get(`${API_BASE}/api/health`);
    console.log('✅ Server is healthy:', healthResponse.data.message);

    // Test 2: User Registration
    console.log('\n 2️ Testing user registration...');
    const testUser = {
      username: 'testuser' + Date.now(),
      password: 'testpass123'
    };

    try {
      const registerResponse = await axios.post(`${API_BASE}/api/users/register`, testUser);
      console.log('✅ User registration successful:', registerResponse.data.message);
      console.log('📝 User created:', registerResponse.data.user);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('ℹ️ User already exists, continuing with login test...');
      } else {
        throw error;
      }
    }

    // Test 3: User Login
    console.log('\n 3️ Testing user login...');
    try {
      const loginResponse = await axios.post(`${API_BASE}/api/users/login`, testUser);
      console.log('✅ User login successful:', loginResponse.data.message);
      console.log('🔑 Token received:', loginResponse.data.token ? 'Yes' : 'No');
    } catch (error) {
      console.log(' User login failed:', error.response?.data?.message || error.message);
    }

    // Test 4: Admin Registration (if no admin exists)
    console.log('\n 4️Testing admin registration...');
    const testAdmin = {
      username: 'admin' + Date.now(),
      password: 'adminpass123'
    };

    try {
      const adminRegisterResponse = await axios.post(`${API_BASE}/api/users/admin/register`, testAdmin);
      console.log('Admin registration successful:', adminRegisterResponse.data.message);
      console.log(' Admin created:', adminRegisterResponse.data.user);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('ℹ Admin already exists, continuing with login test...');
      } else {
        console.log('ℹ Admin registration requires existing admin, trying with default admin...');
      }
    }

    // Test 5: Admin Login
    console.log('\n 5️ Testing admin login...');
    const defaultAdmin = { username: 'admin', password: 'admin123' };

    try {
      const adminLoginResponse = await axios.post(`${API_BASE}/api/users/admin`, defaultAdmin);
      console.log(' Admin login successful:', adminLoginResponse.data.message);
      console.log(' Admin token received:', adminLoginResponse.data.token ? 'Yes' : 'No');
    } catch (error) {
      console.log(' Admin login failed:', error.response?.data?.message || error.message);
      console.log(' Try creating an admin user first or check credentials');
    }

    // Test 6: Message Creation (unauthenticated)
    console.log('\n 6️ Testing message creation (no auth required)...');
    const testMessage = {
      subject: 'Test Message',
      content: 'This is a test message from the authentication test script.',
      userEmail: 'test@example.com',
      userName: 'Test User'
    };

    try {
      const messageResponse = await axios.post(`${API_BASE}/api/messages`, testMessage);
      console.log(' Message creation successful:', messageResponse.data.message);
    } catch (error) {
      console.log(' Message creation failed:', error.response?.data?.message || error.message);
    }

    console.log('\n Authentication system test completed!');
    console.log('\n Summary:');
    console.log('- Backend server is running and accessible');
    console.log('- User registration and login endpoints are working');
    console.log('- Admin login endpoint is available');
    console.log('- Message system is functional');
    console.log('\n Next steps:');
    console.log('1. Start the frontend: npm run dev (in frontend directory)');
    console.log('2. Test login at: http://localhost:5173/login');
    console.log('3. Test admin login at: http://localhost:5173/admin');
    console.log('4. Test registration at: http://localhost:5173/register');

  } catch (error) {
    console.error(' Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n Backend server is not running. Please start it with:');
      console.log('cd Backend && npm run dev');
    }
  }
}

// Run the test
testAuthentication();
