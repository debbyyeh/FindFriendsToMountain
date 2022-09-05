import React from 'react'
import Logo from './Mountain.png'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'

const LogoIcon = styled(Link)`
  display: block;
  background-image: url(${Logo});
  width: 90px;
  height: 90px;
  background-repeat: no-repeat;
  background-size: contain;
`
function Header() {
  const navigate = useNavigate()
  const makeLogin = JSON.parse(window.localStorage.getItem('token'))
  function backToProfile() {
    navigate('/profile')
  }
  return (
    <>
      <LogoIcon to="/" />
      <Link to="LogIn" />

      {makeLogin && (
        <>
          {' '}
          <div onClick={backToProfile}>回到個人頁面</div>
        </>
      )}
    </>
  )
}

export default Header
