import { db, storage, auth } from './firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useContext } from 'react'
import { UserContext } from './userContext'

// const firebaseData = {
//   //取得登入者的個人檔案
//   async getLoggedInfo() {
//     const userUid = useContext(UserContext)
//     const docRef = doc(db, 'users', userUid)
//     const docSnap = await getDoc(docRef)
//     if (docSnap.exists()) {
//       const userData = docSnap.data()
//       const userDataInfo = userData
//     }
//   },
// }

export default firebaseData
