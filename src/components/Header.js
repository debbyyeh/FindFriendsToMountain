import React, { useContext, useState, useEffect } from 'react'
import Logo from './Mountain.png'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
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
`

const IconCircle = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #ac6947;
  z-index: 100;
  position: relative;
  @media screen and (max-width: 1280px) {
    width: 80px;
    height: 80px;
  }
  @media screen and (max-width: 767px) {
    width: 40px;
    height: 40px;
  }
`
const LogoIcon = styled(Link)`
  display: block;
  background-image: url(${Logo});
  width: 90px;
  height: 90px;
  background-repeat: no-repeat;
  background-size: contain;
  @media screen and (max-width: 1280px) {
    width: 60px;
    height: 60px;
  }
  @media screen and (max-width: 767px) {
    width: 30px;
    height: 30px;
  }
`
const LoginClick = styled(Link)`
  color: #f6ead6;
  margin-left: 20px;
  font-size: 20px;
  opacity: 0.5;
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
  @media screen and (max-width: 767px) {
    font-size: 14px;
  }
`
const Btn = styled.button`
  color: #f6ead6;
  margin-left: 12px;
  font-size: 20px;
  opacity: 0.5;
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
  @media screen and (max-width: 767px) {
    font-size: 14px;
  }
`
// const LogoText = styled.div`
//   position: absolute;
//   bottom: -31px;
//   left: 74px;
//   font-size: 24px;
//   font-weight: 800;
//   transform: rotate(-18deg);
// `
// const LogoSecond = styled(LogoText)`
//   left: 100px;
//   transform: rotate(-37deg);
//   bottom: -16px;
// `
// const LogoThird = styled(LogoText)`
//   left: 117px;
//   bottom: 15px;
//   transform: rotate(-67deg);
// `

function Header() {
  const navigate = useNavigate()
  const value = useContext(UserContext)
  const [isLogged, setIsLogged] = useState()
  const auth = getAuth()
  useEffect(() => {
    if (value.userUid !== undefined) {
      setIsLogged(true)
    }
  }, [value.userUid])
  function logOut() {
    signOut(auth)
      .then(() => {
        window.location.reload()
        window.alert('登出成功，將重新整理一次頁面！')
      })
      .catch((error) => {
        console.log('登出失敗')
      })
    window.localStorage.removeItem('token')
    navigate('/')
    setIsLogged(false)
  }
  return (
    <>
      <Wrapper>
        <Divide>
          <IconCircle>
            {/* <LogoText>找</LogoText>
            <LogoSecond>山</LogoSecond>
            <LogoThird>遊</LogoThird> */}
            <LogoIcon to="/" />
            <Link to="LogIn" />
          </IconCircle>

          {isLogged && (
            <>
              <LoginClick to="profile">回到個人頁面</LoginClick>
              <Btn onClick={logOut}>登出</Btn>
            </>
          )}
        </Divide>
      </Wrapper>
    </>
  )
}

export default Header
