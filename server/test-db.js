const { Client } = require('pg');

const client = new Client({
  user: 'brainbase_admin',
  host: '127.0.0.1', // We use IP instead of 'localhost' to force IPv4
  database: 'brainbase_db',
  password: 'securepassword123',
  port: 5440,
});

console.log("Attempting raw connection to 127.0.0.1:5440...");

client.connect()
  .then(() => {
    console.log("✅ SUCCESS: Raw connection established!");
    return client.end();
  })
  .catch(err => {
    console.error("❌ FAILURE:", err.message);
    console.error("Detail:", err);
  });