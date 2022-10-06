import React, { useContext, useState, useEffect } from 'react'
import Logo from './Mountain.png'
import styled from 'styled-components'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { UserContext } from '../utils/userContext'
import { getAuth, signOut } from 'firebase/auth'

const Wrapper = styled.div`
  max-width: calc(1320px - 40px);
  padding-left: 20px;
  padding-right: 20px;
  margin: 0 auto;
  font-family: Poppins;
`
const Divide = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: absolute;
  top: 50px;
  z-index: 999;
  @media screen and (max-width: 767px) {
    top: 20px;
  }
`
const IconCircle = styled.div`
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #ac6947;
  z-index: 100;
  position: relative;
  @media screen and (max-width: 1280px) {
    width: 50px;
    height: 50px;
  }
`
const LogoIcon = styled(Link)`
  display: block;
  background-image: url(${Logo});
  width: 30px;
  height: 30px;
  background-repeat: no-repeat;
  background-size: contain;
`
const LoginClick = styled(Link)`
  color: #f6ead6;
  margin-left: 20px;
  font-size: 20px;
  opacity: 0.5;
  z-index: 100;
  line-height: 20px;
  &:after {
    content: '';
    border-bottom: 2px solid #ac6947;
    margin: auto;
    position: relative;
    top: 5px;
    width: 0%;
    display: block;
    transition: all 0.3s;
  }
  &:hover {
    opacity: 1;
    &:after {
      width: 100%;
    }
  }
  @media screen and (max-width: 1279px) {
    font-size: 14px;
  }
`
const Btn = styled.button`
  color: #f6ead6;
  margin-left: 12px;
  font-size: 20px;
  opacity: 0.5;
  z-index: 100;
  line-height: 20px;
  &:after {
    content: '';
    border-bottom: 2px solid #ac6947;
    margin: auto;
    position: relative;
    top: 5px;
    width: 0;
    display: block;
    transition: all 0.3s;
  }
  &:hover {
    opacity: 1;
    &:after {
      width: 100%;
    }
  }
  @media screen and (max-width: 1279px) {
    font-size: 14px;
  }
`

function Header() {
  const navigate = useNavigate()
  const value = useContext(UserContext)
  const [isLogged, setIsLogged] = useState(false)
  const auth = getAuth()
  const location = useLocation()
  useEffect(() => {
    if (value.userUid !== undefined) {
      setIsLogged(true)
    }
  }, [value.userUid])
  function logOut() {
    signOut(auth)
      .then(() => {
        window.location.reload()
        value.alertPopup()
        value.setAlertContent('登出成功，將重新整理一次頁面')
      })
      .catch((error) => {
        console.log('登出失敗')
      })
    navigate('/')
    setIsLogged(false)
  }
  return (
    <>
      <Wrapper>
        <Divide>
          <IconCircle>
            <LogoIcon to="/" />
            <Link to="LogIn" />
          </IconCircle>
          {isLogged == true ? (
            location.pathname == '/' || location.pathname == '/profile' ? (
              <>
                <LoginClick to="activity">發起活動</LoginClick>
                <Btn onClick={logOut}>登出</Btn>
              </>
            ) : (
              <>
                <LoginClick to="profile">回到個人頁面</LoginClick>
                <Btn onClick={logOut}>登出</Btn>
              </>
            )
          ) : null}
        </Divide>
      </Wrapper>
    </>
  )
}

export default Header
