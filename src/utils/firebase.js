import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAtgC93YHzJ1A1mhqiujfB04p1oo8UJ_VE',
  authDomain: 'find-friends-to-mountain.firebaseapp.com',
  databaseURL:
    'https://find-friends-to-mountain-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'find-friends-to-mountain',
  storageBucket: 'find-friends-to-mountain.appspot.com',
  messagingSenderId: '820356531337',
  appId: '1:820356531337:web:90bbf6d282c35fc930f258',
  measurementId: 'G-CTRZ6ZZ9JK',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export default firebaseConfig
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)
