import dotenv from 'dotenv';
import { adminAuth } from '../src/lib/firebase/admin';

dotenv.config({ path: '.env.local' });

const [uid, role] = process.argv.slice(2);

if (!uid || !role) {
  console.error('Usage: npm run set-claims -- <uid> <admin|agent>');
  process.exit(1);
}

if (role !== 'admin' && role !== 'agent') {
  console.error('Role must be either "admin" or "agent".');
  process.exit(1);
}

const claims = {
  role,
  roles: {
    [role]: true,
  },
  admin: role === 'admin',
  agent: role === 'agent',
};

adminAuth()
  .setCustomUserClaims(uid, claims)
  .then(() => {
    console.log(`Custom claims set for ${uid}:`, claims);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to set custom claims:', error);
    process.exit(1);
  });
