import React, { useContext, useState, useEffect } from 'react'
import Logo from './Mountain.png'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../utils/userContext'
import { getAuth, signOut } from 'firebase/auth'

const Wrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`
const Divide = styled.div`
  display: flex;
  align-items: center;
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
`
const LogoIcon = styled(Link)`
  display: block;
  background-image: url(${Logo});
  width: 90px;
  height: 90px;
  background-repeat: no-repeat;
  background-size: contain;
`
const LoginClick = styled(Link)`
  color: white;
  margin-right: 20px;
  text-decoration: none;
`
const FindMyGroup = styled.div`
  cursor: pointer;
`
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
  async function findMyGroup() {}
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
            <LogoIcon to="/" />
            <Link to="LogIn" />
          </IconCircle>

          {isLogged && (
            <>
              <LoginClick to="profile">回到個人頁面</LoginClick>
              <FindMyGroup onClick={findMyGroup}>查看我加入的群組</FindMyGroup>
              <button onClick={logOut}>登出</button>
            </>
          )}
        </Divide>
      </Wrapper>
    </>
  )
}

export default Header
