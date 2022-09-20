import { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { UserContext } from '../../utils/userContext'
import background from './background.jpg'
import 南湖 from './南湖.jpg'
import 南湖A from './南湖大山.jpg'
import 玉山 from './玉山.jpg'
import 桃源谷 from './桃源谷.jpg'
import 大同 from './大同大禮.jpg'
import flag from './flag.png'

const LoginClick = styled(Link)`
  font-weight: 900;
  font-size: 40px;
  color: white;
`
const Wrapper = styled.div`
  max-width: 1280px;
`
const Background = styled.div`
  background-image: url(${background});
  background-position: center center;
  background-size: cover;
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  width: 80%;
  opacity: 0.8;
  overflow-x: hidden;
  z-index: -1;
`
const HoverBackground = styled.div`
  z-index: 100;
  position: absolute;
  top: 50%;
  left: 10%;
  width: 600px;
  height: 600px;
  background-color: rgba(0, 0, 0, 0.25);
  transform: translate(0%, -50%);
  background-color: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(5px);
  z-index: 999;

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`
const HomeTitle = styled.div`
  font-size: 80px;
  color: white;
  letter-spacing: 6px;
`
const Divide = styled.div`
  display: flex;
  align-items: center;
`

const PageIcon = styled.div`
  background-image: url(${flag});
  width: 80px;
  height: 80px;
  margin-right: 12px;
`

const PhotoContent = styled.img`
  position: ${(props) => props.position || 'none'};
  width: ${(props) => props.width || 'none'};
  height: ${(props) => props.height || 'none'};
  left: ${(props) => props.left || 'none'};
  top: ${(props) => props.top || 'none'};
  bottom: ${(props) => props.bottom || 'none'};
  background-size: cover;
  z-index: 999;
  object-fit: cover;
  ${'' /* box-shadow: 5px 10px 8px #888888; */}
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
        <HoverBackground>
          <HomeTitle>找山遊</HomeTitle>
          <Divide>
            <PageIcon></PageIcon>
            {!isLogged && <LoginClick to="login">登入頁面</LoginClick>}
          </Divide>
        </HoverBackground>

        <Background>
          <PhotoContent
            position="absolute"
            width="800px"
            height="650px"
            bottom="300px"
            left="20%"
            src={大同}
          />
          <PhotoContent
            position="absolute"
            width="800px"
            height="900px"
            top="20%"
            left="20%"
            src={南湖}
          />
          <PhotoContent
            position="absolute"
            width="800px"
            height="500px"
            top="10%"
            left="50%"
            src={南湖A}
          />
          <PhotoContent
            position="absolute"
            width="800px"
            height="900px"
            top="65%"
            left="50%"
            src={桃源谷}
          />
          <PhotoContent
            position="absolute"
            width="1200px"
            height="600px"
            top="25%"
            left="80%"
            src={玉山}
          />
        </Background>
      </Wrapper>
    </>
  )
}

export default Home
