import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAzPhzv0_7Ebo7pogIeBg8ImZ5MCHMvOI8',
  authDomain: 'cp-analytics-31724.firebaseapp.com',
  projectId: 'cp-analytics-31724',
  storageBucket: 'cp-analytics-31724.firebasestorage.app',
  messagingSenderId: '630662753704',
  appId: '1:630662753704:web:ec1e36ea7353d6c7a4019d',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

githubProvider.addScope('user:email');

export default app;