import React, { useState, useEffect } from 'react'
import './App.css'
import { createGlobalStyle } from 'styled-components'
import Header from './components/Header'
import { UserContext } from './utils/userContext'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
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
  const auth = getAuth()

  const equipments = {
    水壺: 水壺,
  }
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName !== null) {
          setUserName(user.displayName)
        }
        setUserUid(user.uid)
      } else {
      }
    })
  }, [])

  const value = {
    userUid,
  }
  console.log(userUid)

  return (
    <>
      <UserContext.Provider value={userUid}>
        <GlobalStyle />
        <Header />
        <Outlet />
      </UserContext.Provider>
    </>
  )
}

export default App
