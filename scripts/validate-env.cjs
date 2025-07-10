#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * Ensures all required Firebase configuration variables are properly set
 * Note: Firebase client-side API keys are safe to expose and are not secret
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_ENV_VARS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const OPTIONAL_ENV_VARS = [
  'VITE_FIREBASE_MEASUREMENT_ID',
  'VITE_RECAPTCHA_SITE_KEY',
  'NODE_ENV'
];

console.log('🔍 Validating Firebase Configuration Variables...\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  console.log('💡 Please create a .env file in the project root and add your Firebase configuration.');
  console.log('📖 See SECURITY.md for setup instructions.');
  process.exit(1);
}

// Parse .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

// Validate required variables
let hasErrors = false;
const missingVars = [];
const emptyVars = [];

REQUIRED_ENV_VARS.forEach(varName => {
  if (!(varName in envVars)) {
    missingVars.push(varName);
    hasErrors = true;
  } else if (!envVars[varName] || envVars[varName] === '') {
    emptyVars.push(varName);
    hasErrors = true;
  }
});

// Display results
if (hasErrors) {
  if (missingVars.length > 0) {
    console.error(`❌ Missing required configuration variables:`);
    missingVars.forEach(v => console.error(`   - ${v}`));
    console.log('');
  }
  
  if (emptyVars.length > 0) {
    console.error(`❌ Empty required configuration variables:`);
    emptyVars.forEach(v => console.error(`   - ${v}`));
    console.log('');
  }
  
  console.log('💡 Please update your .env file with the missing/empty values.');
  console.log('📖 See SECURITY.md for detailed setup instructions.');
  process.exit(1);
} else {
  console.log('✅ All required configuration variables are set!');
  
  // Check optional variables
  const setOptional = OPTIONAL_ENV_VARS.filter(v => envVars[v] && envVars[v] !== '');
  if (setOptional.length > 0) {
    console.log(`✅ Optional variables set: ${setOptional.join(', ')}`);
  }
  
  console.log('\n🎉 Your Firebase configuration is ready!');
  console.log('🚀 You can now run your development server.');
}

// Configuration status
console.log('\n🔧 Configuration Status:');

// Check if .env is in .gitignore
const gitignorePath = path.join(process.cwd(), '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  if (gitignoreContent.includes('.env')) {
    console.log('✅ .env is properly ignored by Git');
  } else {
    console.warn('⚠️  .env should be added to .gitignore for consistency');
  }
} else {
  console.warn('⚠️  .gitignore file not found');
}

// Check for old credentials.json
const credentialsPath = path.join(process.cwd(), 'src', 'credentials.json');
if (fs.existsSync(credentialsPath)) {
  console.warn('⚠️  Old credentials.json file still exists - consider removing it');
} else {
  console.log('✅ No old credential files found');
}

// Security reminder
console.log('\n🛡️  Security Reminder:');
console.log('✅ Firebase client API keys are safe to expose (they are public identifiers)');
console.log('🔒 Real security comes from Firebase Security Rules and Authentication');
console.log('📖 Read FIREBASE_SECURITY_EXPLAINED.md for complete security details');