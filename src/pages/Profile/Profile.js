import { useNavigate } from 'react-router-dom'
import { Divide } from '../../css/style'
import React, { useState, useEffect, useRef, useContext } from 'react'
import { db } from '../../utils/firebase'
import { doc, updateDoc, onSnapshot } from 'firebase/firestore'
import Map from '../Map/Map'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { UserContext } from '../../utils/userContext'
import hiking from './Vision.png'
import mountain from './Done.png'
import equipments from '../../equipments/equipments'
import remove from './Remove.png'
import logo from './Mountain.png'
import trekking from './Trekking.png'

const Wrapper = styled.div`
  max-width: calc(1320px - 40px);
  padding: 70px 20px 120px;
  @media screen and (max-width: 1279px) {
    padding: 40px 0px 60px;
  }
  @media screen and (max-width: 767px) {
    padding: 20px 0px 40px;
  }
  margin: 0 auto;
  font-family: Poppins;
`
const ProfileWrapper = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.15);
  width: 100px;
  height: 100px;
  margin: 40px auto;
  position: relative;
  @media screen and (max-width: 767px) {
    margin: 80px auto 40px auto;
  }
`
const PersonPhoto = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;

  position: relative;
  bottom: 20px;
  right: -10px;
`
const PersonName = styled.div`
  font-size: 20px;
  margin-bottom: 32px;
  width: 25px;
  height: 3px;
  border-radius: 20px;
  background-color: #ac6947;
  position: relative;
  top: -35px;
  left: -10px;
  @media screen and (max-width: 767px) {
    top: -20px;
    font-size: 16px;
  }
`
const CardDivide = styled(Divide)`
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #f6ead6;
  }
  &::-webkit-scrollbar-track {
    box-shadow: transparent;
  }
`
const ToolWrapper = styled(Divide)`
  width: calc(100% - 400px);
  justify-content: flex-start;
  @media screen and (max-width: 1279px) {
    width: calc(100% - 200px);
  }
  @media screen and (max-width: 767px) {
    width: 100%;
  }
  margin: 0 auto;
  flex-wrap: wrap;
  max-height: 300px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #f6ead6;
  }
  &::-webkit-scrollbar-track {
    box-shadow: transparent;
  }
`
const Flex = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
`
const CategoryDivide = styled.div`
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3) inset;
  padding: 32px;
  max-height: 1200px;
  @media screen and (max-width: 1279px) {
    padding: 24px;
  }
  @media screen and (max-width: 767px) {
    padding: 18px;
  }
`
const ActivityCard = styled(Link)`
  color: #f6ead6;
  border-radius: 8px;
  width: 31%;
  margin: 20px 1%;
  aspect-ratio: 1/0.75;
  padding: 16px 20px;
  background-color: rgba(246, 234, 214, 0.2);
  &:last-child {
    margin-right: auto;
  }
  @media screen and (max-width: 1279px) {
    width: 48%;
    margin-bottom: 14px;
  }
  @media screen and (max-width: 767px) {
    width: 100%;
    margin-bottom: 14px;
    padding: 12px;
  }
`
const ActivityTitle = styled.div`
  font-size: 24px;
  text-align: center;
  font-weight: 500;
  margin-bottom: 12px;
  @media screen and (max-width: 1279px) {
    font-size: 20px;
  }
  @media screen and (max-width: 767px) {
    font-size: 16px;
    margin-bottom: 8px;
  }
`
const ActivityLink = styled(Link)`
  border-radius: 12px;
  background-color: rgba(34, 35, 34, 0.5);
  position: absolute;
  top: 0;
  width: 100%;
  height: 0%;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.2s;
`
const GroupLink = styled(Link)`
  text-align: center;
  font-size: 24px;
  font-weight: 800;
  color: #f6ead6;
  z-index: 10;
  opacity: 0;

  transition: all 0.3s;
  @media screen and (max-width: 1279px) {
    font-size: 20px;
  }
  @media screen and (max-width: 767px) {
    font-size: 14px;
  }
`
const ActivityImage = styled.div`
  background-position: center;
  background-size: cover;
  aspect-ratio: 1/0.75;

  width: 100%;
  border-radius: 12px;

  transition: all 0.3s;

  &:hover {
    ${ActivityLink} {
      height: 100%;
    }
    ${GroupLink} {
      opacity: 1;
    }
  }
`
const Content = styled.div`
  position: relative;
`
const DateRange = styled.div`
  font-size: 14px;
  margin-bottom: 12px;
  font-weight: 400px;
  @media screen and (max-width: 1279px) {
    margin-bottom: 8px;
  }
  @media screen and (max-width: 576px) {
    font-size: 12px;
  }
`
const ToolDivide = styled(Divide)`
  width: calc(100% / 3);
  justify-content: space-evenly;
  margin-bottom: 12px;
  @media screen and (max-width: 1279px) {
    justify-content: center;
  }
  @media screen and (max-width: 767px) {
    width: calc(100% / 2);
  }
`
const Category = styled.div`
  width: calc(100% / 4);
  text-align: center;
  padding: 12px;
  font-size: 20px;
  letter-spacing: 2px;
  cursor: pointer;
  padding-bottom: 4px;
  border-bottom: 2px solid #b99362;
  transition: all 0.3s;

  opacity: ${(props) => (props.$isActive ? 1 : 0.5)};
  @media screen and (max-width: 767px) {
    font-size: 14px;
    letter-spacing: 1px;
    white-space: no-wrap;
    padding: 12px 0;
  }
`
const Tools = styled.div`
  margin: 0 auto;
  text-align: center;
  position: relative;
`
const ToolInput = styled.input`
  width: 180px;
  background-color: #f6ead6;
  margin-top: 30px;
  height: 50px;
  padding: 12px;
  color: #222322;
  font-size: 20px;

  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  @media screen and (max-width: 767px) {
    font-size: 16px;
    height: 40px;
  }
`
const AddToolBtn = styled.button`
  color: #f6ead6;
  padding: 12px;
  letter-spacing: 2px;
  font-weight: 600;
  background-color: #ac6947;

  position: absolute;
  top: 33px;
  left: 55%;

  box-shadow: 7px 10px 15px -8px rgba(0, 0, 0, 0.71);
  @media screen and (max-width: 767px) {
    top: 30px;
    height: 40px;
  }
`
const Note = styled.p`
  color: #f6ead6;
  font-size: 14px;
  margin-top: 12px;
`
const IconTitle = styled.div`
  font-size: 20px;
  margin-right: 12px;
  @media (max-width: 1279px) {
    font-size: 14px;
    margin-right: 8px;
    width: 30px;
  }
`
const IconImage = styled.div`
  width: 50px;
  height: 50px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media screen and (max-width: 767px) {
    width: 40px;
    height: 40px;
  }
`
const IconWrapper = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #222322;
`
const shakeAnimation = keyframes`
  0% { transform: translate(0px, 1px) rotate(0deg); }
  100% { transform: translate(0px, -2px) rotate(-1deg); }

`
const Delete = styled.div`
  width: 20px;
  height: 20px;
  background-size: cover;
  background-image: url(${remove});

  cursor: pointer;

  &:hover {
    animation-name: ${shakeAnimation};
    animation-duration: 0.5s;
    animation-iteration-count: infinite;
  }
`
const DefaultMsg = styled.div`
  font-size: 20px;
  text-align: center;
  margin-top: 10px;
  letter-spacing: 2px;
  font-weight: 400;
  margin: 0 auto;
  @media screen and (max-width: 1279px) {
    font-size: 16px;
  }
  @media screen and (max-width: 576px) {
    font-size: 14px;
  }
`
const BeALeader = styled(Link)`
  background-color: transparent;
  width: 220px;
  padding-bottom: 3px;
  margin: 0 auto;
  margin-top: 20px;
  color: #b99362;
  font-weight: 500;
  font-size: 24px;
  text-align: center;
  letter-spacing: 2px;
  border-bottom: none;
  transition: all 0.3s;
  &:hover {
    color: #b99362;
    border-bottom: 2px solid #b99362;
  }
  @media screen and (max-width: 1279px) {
    font-size: 20px;
  }
  @media screen and (max-width: 767px) {
    width: 150px;
    font-size: 16px;
  }
`
const DefaultImg = styled.img`
  width: 450px;
  height: 450px;
  margin: 0 auto;
  object-fit: cover;
  @media screen and (max-width: 767px) {
    width: calc(100% - 20px);
    height: calc(100% - 20px);
  }
`
const NoteBtn = styled.div`
  cursor: pointer;
  background-image: url(${trekking});
  background-size: contain;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  max-width: calc(1320px - 40px);
  position: fixed;
  font-family: Poppins;
  transition: all 0.3s;
  z-index: 99;
  right: 0;
  top: 25%;
  &:hover {
    border: 1px solid #b99362;
  }
  @media screen and (max-width: 1279px) {
    top: 15%;
  }
  @media screen and (max-width: 767px) {
    width: 40px;
    height: 40px;
  }
`
const PreviewArea = styled.div`
  position: absolute;
  padding: 20px;
  right: 20%;
  transform: translateX(-20%);
  background-color: rgba(34, 35, 34, 0.8);
  width: 400px;
  height: auto;
  border-radius: 24px;
  @media screen and (max-width: 576px) {
    right: 10%;
    transform: translateX(-10%);
    width: 280px;
    padding: 10px;
  }
`
const Lists = styled.ul`
  padding-left: 0;
  @media screen and (max-width: 1279px) {
    font-size: 14px;
  }
`
const List = styled.li`
  margin-bottom: 12px;
`
const LoadingBackground = styled.div`
  position: fixed;
  z-index: 999;
  background-color: rgba(34, 35, 34, 0.8);
  width: 100vw;
  height: 100vh;
  top: 0;
  display: ${(props) => (props.loading ? 'block' : 'none')};
`
const move = keyframes`
  0%,
   {
    left: 0;
    transform:rotate(0deg)
  }
  25%{
    left:300px;
    transform:rotate(20deg)
  }
  50% {
    transform:rotate(0deg)
    left: 80%;
  }
  55%{
    transform:rotate(0deg)
    left: 90%;
  }
  70%{
    transform:rotate(0deg)
    left: 75%;
  }
  100%{
    left: 0%;
    transform:rotate(-360deg)
  }
`
const LoadingStyle = styled.span`
  font-family: 'Rubik Moonrocks', cursive;
  font-size: 60px;
  text-transform: uppercase;
  letter-spacing: 5px;
  position: absolute;
  top: 50%;
  left: 25%;
  color: #b99362;
  background-clip: text;
  &:before {
    content: '';
    z-index: 99;
    width: 80px;
    height: 80px;
    background-image: url(${logo});
    background-size: cover;
    border-radius: 50%;
    position: absolute;
    top: -30%;
    left: 0;
    mix-blend-mode: difference;
    animation: ${move} 3s ease-in-out infinite;
  }
`
function Profile() {
  const [getUserData, setGetUserData] = useState()
  const [tabIndex, setTabIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [isPreview, setIsPreview] = useState(true)
  const [loading, setLoading] = useState(false)
  const value = useContext(UserContext)
  const equipmentSearch = useRef()
  const navigate = useNavigate()
  useEffect(() => {
    async function getDBInfo() {
      if (value.userAuth === null) {
        value.alertPopup()
        value.setAlertContent('您尚未登入')
        navigate('/')
      } else {
        setLoading(true)
        const unsub = onSnapshot(doc(db, 'users', value.userUid), (doc) => {
          const data = doc.data()
          setGetUserData(data)
        })
        setTimeout(() => setLoading(false), 2000)
      }
    }
    getDBInfo()
  }, [value.userAuth, value.userUid])

  async function addTool() {
    if (equipmentSearch.current.value === '') {
      value.alertPopup()
      value.setAlertContent('請輸入登山裝備')
    } else {
      getUserData.equipment.push(equipmentSearch.current.value)
      equipmentSearch.current.value = ''
      try {
        const docRef = doc(db, 'users', value.userUid)
        const updateEquipment = await updateDoc(docRef, {
          equipment: getUserData.equipment,
        })
      } catch (error) {
        console.log('資料更新失敗')
      }
    }
  }

  async function deleteEquipment(key) {
    let deleteTools = getUserData.equipment.filter(
      (item, index) => index !== key,
    )
    const newTools = deleteTools
    try {
      const docRef = doc(db, 'users', value.userUid)
      const updateEquipment = await updateDoc(docRef, { equipment: newTools })
    } catch (error) {
      console.log('資料更新失敗')
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      addTool()
    }
  }

  return (
    <>
      <LoadingBackground loading={loading}>
        <LoadingStyle></LoadingStyle>
      </LoadingBackground>
      <Wrapper>
        {getUserData && (
          <>
            <ProfileWrapper>
              <PersonName>{getUserData?.name}</PersonName>
              <PersonPhoto src={getUserData?.photoURL} alt="userphoto" />
            </ProfileWrapper>
          </>
        )}
        <CategoryDivide>
          <NoteBtn
            onMouseEnter={() => setIsPreview(true)}
            onMouseLeave={() => setIsPreview(false)}
          >
            {isPreview && (
              <PreviewArea>
                <Lists>
                  {currentPage === 0 && (
                    <>
                      <List>√ 按下發起活動成為主揪，邀請朋友一起來爬山吧</List>
                      <List>
                        √ 發起過的活動都會保存於此，可隨時修改相關資訊
                      </List>
                    </>
                  )}
                  {currentPage === 1 && (
                    <>
                      <List>√ 你曾經加入過的群組資訊皆會保留於此</List>
                    </>
                  )}
                  {currentPage === 2 && (
                    <>
                      <List>√ 輸入你所有的裝備，讓夥伴知道</List>
                      <List>√ 進入群組後也可查看夥伴所擁有的裝備</List>
                    </>
                  )}
                  {currentPage === 3 && (
                    <>
                      <List>√ 點選縣市查看推薦登山清單</List>
                      <List>√ 可點選山的名稱註記完登</List>
                    </>
                  )}
                </Lists>
              </PreviewArea>
            )}
          </NoteBtn>
          <Divide>
            {['發起的團', '加入的團', '登山裝備', '高山地圖'].map(
              (text, index) => (
                <Category
                  $isActive={index === tabIndex}
                  key={index}
                  onClick={() => {
                    setTabIndex(index)
                    setCurrentPage(index)
                  }}
                >
                  {text}
                </Category>
              ),
            )}
          </Divide>
          {currentPage === 0 && (
            <>
              <BeALeader to="/activity">點我發起活動吧!</BeALeader>
              <CardDivide
                justifyContent="center"
                flexWrap="wrap"
                maxHeight="600px"
              >
                {getUserData?.leadGroup.length > 0 ? (
                  Object.values(getUserData.leadGroup).map((item, index) => {
                    return (
                      <ActivityCard
                        key={index}
                        to={`/activity/${item.groupID}`}
                      >
                        <ActivityTitle>{item.groupName}</ActivityTitle>
                        <Divide justifyContent="flex-start">
                          <DateRange>
                            日期：
                            {item.startDate} ~ {item.endDate}
                          </DateRange>
                        </Divide>
                        <Content>
                          <ActivityImage
                            style={{
                              backgroundImage: `url(${
                                item.groupPhoto !== undefined
                                  ? item.groupPhoto
                                  : mountain
                              })`,
                            }}
                          >
                            <ActivityLink to={`/activity/${item.groupID}`}>
                              <GroupLink to={`/activity/${item.groupID}`}>
                                前往這座山
                              </GroupLink>
                            </ActivityLink>
                          </ActivityImage>
                        </Content>
                      </ActivityCard>
                    )
                  })
                ) : (
                  <Flex>
                    <DefaultMsg>目前尚無發起群組</DefaultMsg>
                    <DefaultImg style={{ cursor: 'pointer' }} src={hiking} />
                  </Flex>
                )}
              </CardDivide>
            </>
          )}
          {currentPage === 1 && (
            <CardDivide
              justifyContent="center"
              flexWrap="wrap"
              maxHeight="600px"
            >
              {getUserData?.joinGroup.length > 0 ? (
                Object.values(getUserData.joinGroup).map((item, index) => {
                  return (
                    <ActivityCard key={index} to={`/activity/${item.groupID}`}>
                      <ActivityTitle>{item.groupName}</ActivityTitle>
                      <Divide justifyContent="flex-start">
                        <DateRange>
                          日期：
                          {item.startDate} ~ {item.endDate}
                        </DateRange>
                      </Divide>
                      <Content>
                        <ActivityImage
                          style={{
                            backgroundImage: `url(${
                              item.groupPhoto !== undefined
                                ? item.groupPhoto
                                : mountain
                            })`,
                          }}
                        >
                          <ActivityLink to={`/activity/${item.groupID}`}>
                            <GroupLink to={`/activity/${item.groupID}`}>
                              前往這座山
                            </GroupLink>
                          </ActivityLink>
                        </ActivityImage>
                      </Content>
                    </ActivityCard>
                  )
                })
              ) : (
                <Flex>
                  <DefaultMsg>目前尚無參加群組</DefaultMsg>
                  <DefaultImg src={hiking} />
                </Flex>
              )}
            </CardDivide>
          )}
          {currentPage === 2 && (
            <>
              <Tools>
                <ToolInput
                  type="text"
                  ref={equipmentSearch}
                  onKeyDown={onKeyDown}
                />
                <AddToolBtn onClick={addTool}>加入清單</AddToolBtn>
                <Note>【請輸入你所擁有的裝備清單】</Note>
                <ToolWrapper>
                  {getUserData?.equipment.length > 0 ? (
                    getUserData.equipment.map((item, index) => {
                      return (
                        <ToolDivide key={index}>
                          <IconTitle>{item}</IconTitle>
                          <IconWrapper>
                            <IconImage
                              style={{
                                backgroundImage: `url(${
                                  equipments[item] ? equipments[item] : logo
                                })`,
                              }}
                            ></IconImage>
                          </IconWrapper>
                          <Delete onClick={() => deleteEquipment(index)} />
                        </ToolDivide>
                      )
                    })
                  ) : (
                    <DefaultMsg>目前尚無清單</DefaultMsg>
                  )}
                </ToolWrapper>
              </Tools>
            </>
          )}
          {currentPage === 3 && (
            <>
              <Map />
            </>
          )}
        </CategoryDivide>
      </Wrapper>
    </>
  )
}

export default Profile
