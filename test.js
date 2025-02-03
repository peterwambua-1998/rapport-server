const crypto = require('crypto');

function generateEncryptionKey() {
    // Generate 32 random bytes using Node's cryptographically secure RNG
    const key = crypto.randomBytes(32);
    // Convert to hex format
    const hexKey = key.toString('hex');
    return hexKey;
}

// Generate and log the key
const key = generateEncryptionKey();
console.log('Your 32-byte encryption key in hex format:');
console.log(key);