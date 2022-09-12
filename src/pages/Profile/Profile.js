import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useRef, useContext } from 'react'
import { db, storage, auth } from '../../utils/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { UserContext } from '../../utils/userContext'
import Map from '../Map/Map'
import hiking from './Vision.png'
import equipments from '../../equipments/equipments'
import remove from './Remove.png'

const Wrapper = styled.div`
  width: calc(1280px - 30px);
  margin: 0 auto;
`

const PersonPhoto = styled.img`
  width: 100px;
  height: 100px;
`
const Divide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const ToolDivide = styled(Divide)`
  width: 250px;

  margin-bottom: 12px;
`
const CategoryDivide = styled.div`
  box-shadow: 5px 5px 1px rgba(0, 0, 0, 0.2);
  height: 600px;
`
const Category = styled.div`
  width: calc(100% / 4);
  text-align: center;
  padding: 12px;
  font-size: 20px;

  cursor: pointer;
`
const Group = styled.div`
  width: 50%;
`
const Tools = styled.div`
  width: calc(100%-20px);
  margin: 0 auto;
  text-align: center;
`
const ToolInput = styled.input`
  margin-top: 50px;
  border: none;
  border-bottom: 2px solid white;
  height: 30px;
  padding: 12px;
  color: white;
  font-size: 20px;
`
const AddToolBtn = styled.button`
  color: white;
  padding: 12px;
  border: 1px solid white;
`
const Equipment = styled.div`
  margin-top: 40px;
`
const IconTitle = styled.div`
  font-size: 20px;
  margin-right: 12px;
`
const IconImage = styled.div`
  width: 60px;
  height: 60px;
  background-size: contain;
  background-repeat: no-repeat;
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
  padding-top: 50px;
`
const BeALeader = styled.button`
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;

  color: rgb(194, 173, 62);
  font-weight: 900;
  font-size: 30px;
  text-align: center;
  cursor: pointer;
`
const DefaultImg = styled.img`
  width: 450px;
  height: 450px;
  margin: 0 auto;
  object-cover: cover;
`

function Profile() {
  const [getUserData, setGetUserData] = useState()
  const [joinGroup, setJoinGroup] = useState([])
  const [leadGroup, setLeadGroup] = useState([])
  const [tools, setTools] = useState([])
  const [isActive, setIsActive] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState()
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
  }, [value.userUid])
  console.log(value.userUid)

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
      <div>個人頁面</div>
      <Wrapper>
        {getUserData && (
          <>
            <div>{getUserData.name}</div>
            <PersonPhoto src={getUserData.photoURL} alt="userphoto" />
          </>
        )}
        <CategoryDivide>
          <Divide>
            {['我發起的登山團', '加入的登山團', '我的登山裝備', '高山地圖'].map(
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
            <>
              {leadGroup.length > 0 ? (
                Object.values(leadGroup).map((item, index) => {
                  return (
                    <div key={index}>
                      <div>name:{item.groupName}</div>
                      <Link to={`/activity/${item.groupID}`}>
                        ID:{item.groupID}
                      </Link>
                    </div>
                  )
                })
              ) : (
                <>
                  <DefaultMsg>目前尚無發起群組</DefaultMsg>
                  <DefaultImg src={hiking} />
                </>
              )}
              <BeALeader onClick={addActivity}>快來發起活動吧!</BeALeader>
            </>
          )}
          {currentPage == 1 && (
            <>
              {joinGroup.length > 0 ? (
                Object.values(joinGroup).map((item, index) => {
                  return (
                    <div key={index}>
                      <div>name:{item.groupName}</div>
                      <Link to={`/activity/${item.groupID}`}>
                        ID:{item.groupID}
                      </Link>
                    </div>
                  )
                })
              ) : (
                <>
                  <DefaultMsg>目前尚無參加群組</DefaultMsg>
                  <DefaultImg src={hiking} />
                </>
              )}
            </>
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
                <Divide>
                  {tools.length > 0 ? (
                    tools.map((item, index) => {
                      return (
                        <ToolDivide key={index}>
                          <IconTitle>{item}</IconTitle>
                          <IconImage
                            style={{
                              backgroundImage: `url(${equipments[item]})`,
                            }}
                          ></IconImage>
                          <Delete onClick={() => deleteEquipment(index)} />
                        </ToolDivide>
                      )
                    })
                  ) : (
                    <DefaultMsg>目前尚無清單</DefaultMsg>
                  )}
                </Divide>
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
