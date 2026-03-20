const axios = require('axios');

async function testAuth() {
  try {
    // First login to get token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'teacher@test.com',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('Token obtained:', token.substring(0, 50) + '...');
    
    // Now try to create a course with the token
    const courseData = {
      title: 'Test Course',
      description: 'This is a test course',
      category: 'Web Development',
      difficulty: 'beginner',
      status: 'draft',
      lessons: []
    };
    
    const courseResponse = await axios.post('http://localhost:5000/api/courses', courseData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Course created successfully:', courseResponse.data);
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testAuth();
