import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import { createGlobalStyle } from 'styled-components'
import Header from './components/Header'
import { UserContext } from './utils/userContext'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from './utils/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import 水壺 from './tools/水壺.png'

import { Link, Routes, Route, Outlet, BrowserRouter } from 'react-router-dom'

const GlobalStyle = createGlobalStyle`
  @font-face{
    font-family:'poppins';
  } 
  * {
    box-sizing: border-box;
  }
  li{
    list-style-type:none;
  }
  input{
    background-color:transparent;
    outline:none;
    cursor:pointer;
  }
  button{
    background-color:transparent;
    outline:none;
    cursor:pointer;
  }
`

const App = () => {
  const [userUid, setUserUid] = useState()
  const [userName, setUserName] = useState()
  const navigate = useNavigate()
  const auth = getAuth()

  const equipments = {
    水壺: 水壺,
  }
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName !== null) {
          setUserName(user.displayName)
          console.log(user)
        }
        setUserUid(user.uid)
      } else {
        navigate('/')
      }
    })
    getUserName()
  }, [userUid])

  //拿到firebase資料
  async function getUserName() {
    if (userUid) {
      try {
        const docRef = doc(db, 'users', userUid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const userData = docSnap.data()
          setUserName(userData.name)
        }
      } catch {
        console.log('No such document!')
      }
      console.log(userName)
    }
  }

  const value = {
    userUid,
    userName,
  }
  console.log(userUid, userName)

  return (
    <>
      <UserContext.Provider value={value}>
        <GlobalStyle />
        <Header />
        <Outlet />
      </UserContext.Provider>
    </>
  )
}

export default App
