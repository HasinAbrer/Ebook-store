const admin = require('./src/config/firebase');

const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address as an argument.');
  process.exit(1);
}

async function setAdminClaim(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
    console.log(`Successfully set admin claim for ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error setting admin claim:', error);
    process.exit(1);
  }
}

setAdminClaim(email);
