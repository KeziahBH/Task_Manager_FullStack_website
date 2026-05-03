const axios = require('axios');
axios.post('https://taskmanager-backend-605005713835.us-central1.run.app/api/auth/register', {
  name: "Test User",
  email: "test@test.com",
  password: "password123"
}).then(r => console.log("SUCCESS:", r.data)).catch(e => console.error("ERROR:", e.response?.data || e.message));
