const axios = require('axios');

async function createTeacher() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test Teacher',
      email: 'teacher@test.com',
      password: '123456',
      role: 'teacher'
    });
    
    console.log('Teacher created successfully:', response.data);
    
    // Now login to get the token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'teacher@test.com',
      password: '123456'
    });
    
    console.log('Login successful. Token:', loginResponse.data.token);
    console.log('Use these credentials to login:');
    console.log('Email: teacher@test.com');
    console.log('Password: 123456');
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

createTeacher();
