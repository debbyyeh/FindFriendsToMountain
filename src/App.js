import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import styled, { createGlobalStyle } from 'styled-components'
import Header from './components/Header'
import { UserContext } from './utils/userContext'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from './utils/firebase'
import { doc, getDoc } from 'firebase/firestore'
import PoppinsRegular from './fonts/Poppins-Regular.ttf'
import PoppinsBold from './fonts/Poppins-Bold.ttf'
import PoppinsThin from './fonts/Poppins-Light.ttf'
import error from './utils/Error.png'
import { Outlet } from 'react-router-dom'

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
    border-radius:0;
  }
  button{
    background-color:transparent;
    outline:none;
    border:none;
    cursor:pointer;
  }
  #root{
    min-height:100vh;
  }

`

const AlertContentInfo = styled.div`
  font-family: Poppins;
  color: #f6ead6;
  font-size: 16px;
  letter-spacing: 2px;
  font-weight: 500;
`

const AlertContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
`
const AlertBox = styled.div`
  position: fixed;
  left: -350px;
  top: 70%;
  z-index: 999;
  cursor: pointer;
  border: 1px solid rgba(241, 142, 6, 0.81);
  background-color: rgba(220, 128, 1, 0.16);
  width: 250px;
  height: 60px;
  padding: 0 12px;
  box-shadow: 10px 10px 12px rgba(0, 0, 0, 0.2);
  animation-name: ${(props) => (props.$alert ? 'slideIn' : 'null')};
  animation-duration: 4s;
  @keyframes slideIn {
    0% {
      left: 0px;
    }
    15% {
      left: 100px;
    }
    85% {
      left: 80px;
    }
    100% {
      left: 0px;
    }
  }
  &:hover {
    ${AlertContent} {
      color: white !important ;
    }
  }
  &:hover {
    background-color: rgba(220, 128, 1, 0.33);
  }
`
const AlertImg = styled.div`
  background-image: url(${error});
  background-size: cover;
  width: 32px;
  height: 32px;
`
const AlertIcon = styled.div`
  position: relative;
  margin-right: 20px;
`

const App = () => {
  const [userUid, setUserUid] = useState()
  const [userName, setUserName] = useState()
  const [userAuth, setUserAuth] = useState()
  const [alert, setAlert] = useState(false)
  const [warning, setWarning] = useState(false)
  const [alertContent, setAlertContent] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserAuth(user)
        setUserUid(user.uid)
      } else {
        setUserAuth(null)
        navigate('/login')
      }
    })
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
    getUserName()
  }, [])

  function alertPopup() {
    setAlert(true)
    setTimeout(() => {
      setAlert(false)
    }, 4000)
  }

  const value = {
    userUid,
    userName,
    userAuth,
    alert,
    setAlert,
    setWarning,
    alertPopup,
    setAlertContent,
  }

  return (
    <UserContext.Provider value={value}>
      <GlobalStyle />
      <AlertBox $alert={alert} $warning={warning}>
        <AlertContent>
          <AlertIcon>
            <AlertImg />
          </AlertIcon>
          <AlertContentInfo>{alertContent}</AlertContentInfo>
        </AlertContent>
      </AlertBox>
      <Header />
      <Outlet />
    </UserContext.Provider>
  )
}

export default App
