
// This file now uses localStorage instead of Firebase
import { getItem, setItem } from './localStorage';

// Mock Firebase app object
const app = {
  name: 'localStorage-mock',
  options: {}
};

// Mock Firestore
const db = {
  name: 'localStorage-mock-db'
};

// Mock Auth
const auth = {
  name: 'localStorage-mock-auth',
  currentUser: { uid: 'local-user' }
};

// Initialize with default data if not present
if (!localStorage.getItem('vehicles')) {
  setItem('vehicles', []);
}

if (!localStorage.getItem('bookings')) {
  setItem('bookings', []);
}

export { app, db, auth };
