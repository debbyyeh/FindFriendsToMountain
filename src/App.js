import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import { createGlobalStyle } from 'styled-components'
import Header from './components/Header'
import { UserContext } from './utils/userContext'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from './utils/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import PoppinsRegular from './fonts/Poppins-Regular.ttf'
import PoppinsBold from './fonts/Poppins-Bold.ttf'
import PoppinsThin from './fonts/Poppins-Light.ttf'

import { Link, Routes, Route, Outlet, BrowserRouter } from 'react-router-dom'

const GlobalStyle = createGlobalStyle`
    @font-face {
    font-family: Poppins;
    src: url(${PoppinsRegular}) format('opentype');
    font-weight: normal;
  }
  @font-face {
    font-family: Poppins;
    src: url(${PoppinsBold}) format('opentype');
    font-weight: bold;
  }
  @font-face {
    font-family: Poppins;
    src: url(${PoppinsThin}) format('opentype');
    font-weight: light;
  }
  @font-face {
    font-family: Poppins;
    src: url(${PoppinsRegular}) format('opentype');
    font-weight: normal;
  }
  body {
    background-color: rgb(48,61,48); 
    color:  #F6EAD6;
    margin:0 auto;
    font-family:Poppins;
    font-weight:500;
    letter-spacing:1px;
    &::-webkit-scrollbar-button {
      display: none;
      /* background: transparent;
      border-radius: 4px; */
    }
    &::-webkit-scrollbar-track-piece {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: rgba(0,0,0,0.4);
      border: 1px solid slategrey
    }
    &::-webkit-scrollbar-track {
      box-shadow: transparent;
    }
  }
  * {
    box-sizing: border-box;
  }
  li{
    list-style-type:none;
  }
  a{
    display:block;
    text-decoration:none;
    color:#222322;
  }
  input{
    background-color:transparent;
    outline:none;
    cursor:pointer;
    background:transparent;
    border:none;
  }
  button{
    background-color:transparent;
    outline:none;
    border:none;
    cursor:pointer;
  }
  #root{
    min-height:100vh;
    padding: 70px 0px 120px;
    @media screen and (max-width: 767px) {
      padding: 40px 0px 60px;
    };
  }

`

const App = () => {
  const [userUid, setUserUid] = useState()
  const [userName, setUserName] = useState()
  const navigate = useNavigate()
  const auth = getAuth()

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
    }
  }

  const value = {
    userUid,
    userName,
  }

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
