/**
 * MongoDB Connection Test Script
 * 
 * This script tests the MongoDB connection directly without Express.
 * Run it with: node test-mongodb-connection.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function testMongoConnection() {
  console.log('\n=== MongoDB Connection Test ===');

  // Check environment variables
  if (!process.env.MONGO_URI) {
    console.error('❌ ERROR: MONGO_URI environment variable is not defined');
    console.log('Make sure you have a .env file with MONGO_URI defined');
    process.exit(1);
  }

  console.log('✅ MONGO_URI is defined');

  try {
    console.log('Attempting to connect to MongoDB...');

    // Connect with basic options first
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout for faster feedback
    });

    console.log('✅ Connected to MongoDB successfully!');
    console.log(`Database: ${mongoose.connection.db.databaseName}`);

    // Test basic operations
    try {
      console.log('\nTesting database operations:');

      // Ping command
      console.log('- Testing ping...');
      const pingResult = await mongoose.connection.db.admin().ping();
      console.log(`  ✅ Ping successful: ${JSON.stringify(pingResult)}`);

      // List collections
      console.log('- Listing collections...');
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`  ✅ Found ${collections.length} collections`);
      collections.forEach(collection => {
        console.log(`    - ${collection.name}`);
      });

      console.log('\n✅ All database tests passed successfully!');
    } catch (opError) {
      console.error(`❌ Database operation error: ${opError.message}`);
    }

  } catch (error) {
    console.error('\n❌ MongoDB connection failed:');
    console.error(`Error: ${error.message}`);

    // Provide more detailed diagnostics
    if (error.name === 'MongoParseError') {
      console.error('This appears to be an issue with your connection string format.');
      // Parse and display a sanitized version of the URI for debugging
      try {
        const sanitizedUri = process.env.MONGO_URI
          .replace(/:([^:@]+)@/, ':***@') // Hide password
          .replace(/\/([^/?]+)(\?|$)/, '/***$2'); // Hide database name
        console.error(`Sanitized URI format: ${sanitizedUri}`);
      } catch (e) {
        console.error('Could not parse connection string for analysis');
      }
    } else if (error.name === 'MongoNetworkError') {
      console.error('This appears to be a network connectivity issue.');
      console.error('Possible causes:');
      console.error('1. Your network connection is down');
      console.error('2. The MongoDB server is not accessible from your current network');
      console.error('3. IP access restrictions on your MongoDB Atlas cluster');
      console.error('4. Firewall blocking outgoing connections');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('failed to connect')) {
      console.error('Could not resolve the hostname or server is not responding.');
      console.error('Check that your MongoDB host is correct and the service is running.');
    } else if (error.message.includes('Authentication failed')) {
      console.error('Username or password is incorrect.');
    }
  } finally {
    // Close connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('\nDatabase connection closed.');
    }

    process.exit(0);
  }
}

testMongoConnection().catch(err => {
  console.error('Unhandled error in test script:', err);
  process.exit(1);
});
