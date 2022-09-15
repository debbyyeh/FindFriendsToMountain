import { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { UserContext } from '../../utils/userContext'
import backgroundImage from './backgroundImage.png'
import flag from './flag.png'

const LoginClick = styled(Link)`
  font-weight: 900;
  font-size: 40px;

  position: absolute;
  bottom: 20px;
  right: 240px;
`
const Wrapper = styled.div`
  max-width: 1280px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  margin: -60px auto 0 auto;
  height: 1000px;
`
const Background = styled.div`
  z-index: 10;
  background-image: url(${backgroundImage});
  background-position: center center;
  background-size: cover;

  height: 800px;

  position: relative;

  ${'' /* &:hover {
    transform: rotate(-2deg);
    transition: 1s;
  } */}
`
const HoverBackground = styled.div`
  margin: 0 auto;

  position: absolute;
  bottom: -150px;
  right: 0;
`
const HomeTitle = styled.div`
  font-size: 68px;
`

const PageIcon = styled.div`
  background-image: url(${flag});
  width: 80px;
  height: 80px;

  position: absolute;
  bottom: 40px;
  right: 400px;
`

function Home() {
  const value = useContext(UserContext)
  const [isLogged, setIsLogged] = useState(false)
  useEffect(() => {
    if (value.userUid !== undefined) {
      setIsLogged(true)
    }
  }, [value.userUid])

  return (
    <>
      <Wrapper>
        <Background>
          <PageIcon></PageIcon>
          {!isLogged && <LoginClick to="login">登入頁面</LoginClick>}
          <HoverBackground>
            <HomeTitle>找山遊</HomeTitle>
          </HoverBackground>
        </Background>
      </Wrapper>
    </>
  )
}

export default Home
