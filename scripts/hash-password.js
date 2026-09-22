// Usage: node scripts/hash-password.js "your-chosen-password"
// Prints a bcrypt hash to paste into the ADMIN_PASSWORD_HASH env var on Vercel.
const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.js "your-chosen-password"');
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  console.log(hash);
});
