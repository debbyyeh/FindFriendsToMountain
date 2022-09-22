import { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { UserContext } from '../../utils/userContext'
import background from './background.jpg'
import 南湖 from './南湖.jpg'
import 南湖A from './南湖大山.jpg'
import 玉山 from './玉山.jpg'
import 桃源谷 from './桃源谷.jpg'
import 大同 from './大同大禮.jpg'
import flag from './flag.png'

const LoginClick = styled(Link)`
  display: block;
  font-weight: 900;
  font-size: 24px;
  color: #f6ead6;
  z-index: 100;
  @media screen and (max-width: 1279px) {
    font-size: 16px;
  }
  @media screen and (max-width: 576px) {
    font-size: 14px;
  }
`
const Wrapper = styled.div`
  max-width: calc(1320px - 40px);
  padding-left: 20px;
  padding-right: 20px;
  margin: 0 auto;
  font-family: Poppins;
  overflow: hidee;
`
const Background = styled.div`
  font-family: Poppins;
  background-color: #222322;
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  overflow: hidden;
`
const BackgroundPic = styled.div`
  background-image: url(${background});
  position: absolute;
  top: 50%;
  left: 45%;
  transform: translate(-45%, -50%);
  background-size: cover;
  background-position: center;
  width: 650px;
  height: 850px;
  box-shadow: 0 4px 8px rgb(48, 61, 48, 0.8);
  z-index: 10;
  padding: 40px 32px;
  @media screen and (max-width: 1280px) {
    width: 650px;
    height: 550px;
    left: 40%;
  }
  @media screen and (max-width: 900px) {
    width: 450px;
    height: 650px;
    left: 30%;
  }
`
const BackgroundLine = styled.div`
  position: absolute;
  padding: 20px;
  height: 25%;
  width: 5%;
  right: -50px;
  top: 50%;
  transform: translateY(-50%);
  ${'' /* background-color: rgb(48, 61, 48); */}
  @media screen and (max-width: 1280px) {
    top: 40%;
    transform: translateY(-40%);
  }
`

const BgBall = styled.div`
  border-radius: 50%;
  width: 150px;
  height: 150px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 80%;
  right: 20%;
  background-color: rgb(48, 61, 48);
  @media screen and (max-width: 1280px) {
    width: 120px;
    height: 120px;
    right: 12%;
  }
`
const BgBallA = styled(BgBall)`
  top: -60px;
  left: -330px;
  width: 600px;
  height: 600px;
  @media screen and (max-width: 900px) {
    top: -75px;
    left: 330px;
    width: 400px;
    height: 400px;
  }
`

const HomeTitle = styled.div`
  font-size: 60px;
  color: white;
  letter-spacing: 2px;
  line-height: 60px;
  @media screen and (max-width: 1280px) {
    font-size: 40px;
    line-height: 40px;
  }
`
const Typing = styled.div``
const TypeWrapper = styled.div`
  ${Typing} {
    line-height: 60px;
    height: 60px;
    overflow: hidden;
    ${'' /* @media screen and (max-width: 1280px) {
      line-height: 60px;
      height: 60px;
    } */}
  }
`
const typing = keyframes`
  100%,
  80% {
    left:calc(100% + 50px);
  }
  40%{
    left:5px;
  }
  0% {
    left:0px;
  }
`
const slide = keyframes`
  100%{
    top:-60px;
  }
`
// const slideSmall = keyframes`
//   100%{
//     top:-60px;
//   }
// `
const TypingText = styled.div`
  font-weight: 900;
  margin-left: 20px;
  color: transparent;
  background-image: linear-gradient(#b99362, #e4e4d9);
  -webkit-background-clip: text;
  background-clip: text;
  position: relative;
  background-color: #222322;
  animation: ${slide} 12s steps(3) infinite;
  ${'' /* @media screen and (max-width: 1279px) {
    margin-left: 10px;
    animation: ${slideSmall} 12s steps(3) infinite;
  } */}

  &:after {
    content: '';
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    border-left: 10px solid white;
    background-color: #222322;

    animation: ${typing} 3s steps(10) infinite;
  }
`
const TypingContent = styled.span``
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
      <Background>
        <BgBall>
          {!isLogged ? (
            <LoginClick to="login">登入頁面</LoginClick>
          ) : (
            <LoginClick to="profile">回到個人頁面</LoginClick>
          )}
        </BgBall>
        <BgBallA></BgBallA>
        <BackgroundPic>
          <BackgroundLine>
            <HomeTitle>
              Find Friends
              <Divide>
                <TypingContent>To</TypingContent>
                <TypeWrapper>
                  <Typing>
                    <TypingText>
                      <TypingContent>mountains</TypingContent>
                    </TypingText>
                    <TypingText>
                      <TypingContent>一起找山遊</TypingContent>
                    </TypingText>
                  </Typing>
                </TypeWrapper>
              </Divide>
            </HomeTitle>
          </BackgroundLine>
        </BackgroundPic>

        {/* <PhotoContent
          position="absolute"
          width="200px"
          height="300px"
          top="60%"
          left="30%"
          src={南湖}
        />
        <PhotoContent
          position="absolute"
          width="200px"
          height="300px"
          top="60%"
          left="50%"
          src={玉山}
        /> */}
        {/* <PhotoContent
          position="absolute"
          width="200px"
          height="300px"
          top="60%"
          left="70%"
          src={background}
        /> */}
      </Background>
      {/* </Wrapper> */}
    </>
  )
}

export default Home
