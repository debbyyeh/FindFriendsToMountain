import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useRef, useContext } from 'react'
import { db, storage, auth } from '../../utils/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { UserContext } from '../../utils/userContext'
import Map from '../Map/Map'
import hiking from './Vision.png'
import mountain from './Done.png'
import equipments from '../../equipments/equipments'
import remove from './Remove.png'
import logo from './Mountain.png'

const Wrapper = styled.div`
  max-width: calc(1320px - 40px);
  padding-left: 20px;
  padding-right: 20px;
  margin: 0 auto;
  font-family: Poppins;
`
const ProfileWrapper = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.15);
  width: 100px;
  height: 100px;
  margin: 0 auto;
  position: relative;
  margin-bottom: 60px;
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
`
const Divide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const ToolWrapper = styled(Divide)`
  width: 600px;
  margin: 0 auto;
  flex-wrap: wrap;
`
const Flex = styled.div`
  display: flex;
  flex-direction: column;
`
const CategoryDivide = styled.div`
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3) inset;
  padding: 32px;
  max-height: 1200px;
  overflow: overlay;
`
const CardWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`

const ActivityCard = styled.div`
  border-radius: 8px;
  width: 32%;
  margin-top: 30px;
  margin-bottom: 20px;
  aspect-ratio: 1/1;
  padding: 16px 20px;
  background-color: rgba(246, 234, 214, 0.2);
  @media screen and (max-width: 768px) {
    width: 48%;
    margin-bottom: 14px;
  }
  @media screen and (max-width: 767px) {
    width: 100%;
    margin-bottom: 14px;
  }
`
const ActivityTitle = styled.div`
  font-size: 24px;
  text-align: center;
  font-weight: 700;
  margin-bottom: 12px;
  @media screen and (max-width: 768px) {
    font-size: 20px;
  }
`
const ActivityLink = styled.div`
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
  font-size: 14px;
  font-weight: 400px;
  letter-spacing: 2px;
  @media screen and(max-width:1280px) {
    margin-bottom: 8px;
  }
`
const ToolDivide = styled(Divide)`
  width: 200px;
  margin-bottom: 12px;
`

const Category = styled.div`
  width: calc(100% / 4);
  text-align: center;
  padding: 12px;
  font-size: 28px;
  letter-spacing: 2px;
  cursor: pointer;
  padding-bottom: 4px;
  border-bottom: 2px solid #875839;
  transition: all 0.3s;

  opacity: ${(props) => (props.$isActive ? 1 : 0.2)};
  text-shadow: ${(props) =>
    props.$isActive ? '1px 1px 20px #F6EAD6' : 'none'};
`
const Tools = styled.div`
  width: calc(100% - 20px);
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
  font-size: 24px;

  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
`
const AddToolBtn = styled.button`
  color: #222322;
  padding: 12px;
  font-weight: 700;
  background-color: #ac6947;

  position: absolute;
  top: 33px;
  left: 55%;

  box-shadow: 7px 10px 15px -8px rgba(0, 0, 0, 0.71);
`
const Note = styled.p`
  color: #5e7e68;
  font-size: 14px;
  margin-top: 12px;
`
const Equipment = styled.div`
  margin-top: 40px;
`
const IconTitle = styled.div`
  font-size: 20px;
  margin-right: 12px;
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
  padding-top: 30px;
  letter-spacing: 2px;
  font-weight: 400;
`
const BeALeader = styled.button`
  background-color: transparent;
  width: 100%;

  color: #ac6947;
  font-weight: 700;
  font-size: 28px;
  text-align: center;
  letter-spacing: 2px;
`
const DefaultImg = styled.img`
  width: 450px;
  height: 450px;
  margin: 0 auto;
  object-fit: cover;
`

function Profile() {
  const [getUserData, setGetUserData] = useState()
  const [joinGroup, setJoinGroup] = useState([])
  const [leadGroup, setLeadGroup] = useState([])
  const [tools, setTools] = useState([])
  const [isActive, setIsActive] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const value = useContext(UserContext)
  const equipmentSearch = useRef()
  const navigate = useNavigate()
  useEffect(() => {
    async function getDBInfo() {
      try {
        const docRef = doc(db, 'users', value.userUid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const userData = docSnap.data()
          setGetUserData(userData)
          setJoinGroup(userData.joinGroup)
          setLeadGroup(userData.leadGroup)

          setTools(userData.equipment)
        }
      } catch {
        console.log('No such document!')
      }
    }
    getDBInfo()

    //得到群組的圖片
    async function getMountainData() {
      try {
        const docRef = doc(db, 'users', value.userUid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const userData = docSnap.data()
          setGetUserData(userData)
          setJoinGroup(userData.joinGroup)
          setLeadGroup(userData.leadGroup)
          setTools(userData.equipment)
        }
      } catch {
        console.log('No such document!')
      }
    }
  }, [value.userUid])
  console.log(value.userUid)
  console.log(leadGroup)
  async function addTool() {
    if (equipmentSearch.current.value == '') {
      alert('請輸入中文登山裝備')
    } else {
      tools.push(equipmentSearch.current.value)
      setTools([...tools])
      equipmentSearch.current.value = ''
      try {
        const docRef = doc(db, 'users', value.userUid)
        const updateEquipment = await updateDoc(docRef, { equipment: tools })
      } catch (erroe) {
        console.log('資料更新失敗')
      }
    }
  }

  async function deleteEquipment(key) {
    let deleteTools = tools.filter((item, index) => index !== key)
    const newTools = deleteTools
    setTools(deleteTools)
    try {
      const docRef = doc(db, 'users', value.userUid)
      const updateEquipment = await updateDoc(docRef, { equipment: newTools })
      console.log(updateEquipment)
    } catch (error) {
      console.log('資料更新失敗')
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      addTool()
    }
  }
  function addActivity() {
    console.log('click')
    navigate('/activity')
  }

  return (
    <>
      <Wrapper>
        {getUserData && (
          <>
            <ProfileWrapper>
              <PersonName>{getUserData.name}</PersonName>
              <PersonPhoto src={getUserData.photoURL} alt="userphoto" />
            </ProfileWrapper>
          </>
        )}
        <CategoryDivide>
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
          {currentPage == 0 && (
            <CardWrapper>
              {leadGroup.length > 0 ? (
                Object.values(leadGroup).map((item, index) => {
                  console.log(item)
                  return (
                    <>
                      <ActivityCard key={index}>
                        <ActivityTitle>{item.groupName}</ActivityTitle>
                        <Divide>
                          <DateRange>{item.startDate} - </DateRange>
                          <DateRange>{item.endDate}</DateRange>
                        </Divide>
                        <Content>
                          <ActivityImage
                            style={{
                              backgroundImage: `url(${
                                item.groupPhoto != undefined
                                  ? item.groupPhoto
                                  : mountain
                              })`,
                            }}
                          >
                            <ActivityLink>
                              {' '}
                              <GroupLink to={`/activity/${item.groupID}`}>
                                前往這座山
                              </GroupLink>
                            </ActivityLink>
                          </ActivityImage>
                        </Content>
                      </ActivityCard>
                    </>
                  )
                })
              ) : (
                <Flex>
                  <DefaultMsg>目前尚無發起群組</DefaultMsg>
                  <DefaultImg src={hiking} />
                </Flex>
              )}
              <BeALeader onClick={addActivity}>快來發起活動吧!</BeALeader>
            </CardWrapper>
          )}
          {currentPage == 1 && (
            <CardWrapper>
              {joinGroup.length > 0 ? (
                Object.values(joinGroup).map((item, index) => {
                  return (
                    <ActivityCard key={index}>
                      <ActivityTitle>{item.groupName}</ActivityTitle>
                      <Divide>
                        <DateRange>{item.startDate} - </DateRange>
                        <DateRange>{item.endDate}</DateRange>
                      </Divide>
                      <Content>
                        <ActivityImage
                          style={{
                            backgroundImage: `url(${
                              item.groupPhoto != undefined
                                ? item.groupPhoto
                                : mountain
                            })`,
                          }}
                        >
                          <ActivityLink>
                            {' '}
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
            </CardWrapper>
          )}
          {currentPage == 2 && (
            <>
              <Tools>
                <ToolInput
                  type="text"
                  ref={equipmentSearch}
                  onKeyDown={onKeyDown}
                />
                <AddToolBtn onClick={addTool}>加入清單</AddToolBtn>
                <Note>請輸入你所擁有的裝備清單!</Note>
                <ToolWrapper>
                  {tools.length > 0 ? (
                    tools.map((item, index) => {
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
          {currentPage == 3 && (
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
