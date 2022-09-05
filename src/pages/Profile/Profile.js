import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'
import { db, storage, auth } from '../../utils/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
// import Activity from '../Activity/Activity'
import 水壺 from './水壺.png'
import 鍋子 from './鍋子.jpg'
import 睡袋 from './睡袋.png'
import remove from './Remove.png'

//裝備清單[]

const PersonPhoto = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`
const Divide = styled.div`
  display: flex;
  align-items: center;
`
const Group = styled.div`
  width: 50%;
`
const Tools = styled.div`
  border: 1px solid white;
  width: 400px;
  height: 400px;
`

const Equipment = styled.div`
  margin-top: 40px;
`
const IconImage = styled.div`
  width: 40px;
  height: 40px;
  background-size: cover;
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

function Profile() {
  const [personalData, setPersonalData] = useState()
  const [getUserData, setGetUserData] = useState()
  const [joinGroup, setJoinGroup] = useState([])
  const [leadGroup, setLeadGroup] = useState([])
  const [tools, setTools] = useState([])
  const [login, setLogin] = useState()
  const equipmentSearch = useRef()
  const navigate = useNavigate()
  const jwtToken = JSON.parse(window.localStorage.getItem('token'))
  const equipments = {
    水壺: 水壺,
    鍋子: 鍋子,
    睡袋: 睡袋,
  }
  useEffect(() => {
    if (jwtToken !== null) {
      setLogin(true)
      setPersonalData(jwtToken.uid)
    }
    async function getDBInfo() {
      const id = personalData
      try {
        const docRef = doc(db, 'users', id)
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
  }, [personalData])

  console.log(leadGroup)
  async function logOut() {
    window.localStorage.removeItem('token')
    navigate('/')
  }
  async function addTool() {
    if (equipmentSearch.current.value == '') {
      alert('請輸入中文登山裝備')
    } else {
      tools.push(equipmentSearch.current.value)
      setTools([...tools])
      equipmentSearch.current.value = ''

      try {
        const docRef = doc(db, 'users', personalData)
        const updateEquipment = await updateDoc(docRef, { equipment: tools })
        console.log(updateEquipment)
      } catch (erroe) {
        console.log('資料更新失敗')
      }
    }
  }

  async function deleteEquipment(key) {
    let deleteTools = tools.filter((item, index) => index !== key)
    console.log(deleteTools)
    const newTools = deleteTools
    setTools(deleteTools)
    try {
      const docRef = doc(db, 'users', personalData)
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
    navigate('/Activity')
  }

  return (
    <>
      <div>個人頁面</div>
      {/* <button onClick={getDBInfo}>click</button> */}
      {getUserData && (
        <>
          <div>{getUserData.name}</div>
          <PersonPhoto src={getUserData.photoURL} alt="userphoto" />
        </>
      )}
      <button onClick={logOut}>登出</button>
      <Divide>
        <Group>
          <div>我的登山群組</div>
          {leadGroup.length > 0 ? (
            Object.values(leadGroup).map((item, index) => {
              return (
                <div key={index}>
                  <div>name:{item.groupName}</div>
                  <Link to={`/Activity/${item.groupID}`}>
                    ID:{item.groupID}
                  </Link>
                </div>
              )
            })
          ) : (
            <div>目前尚無發起群組</div>
          )}
          <button onClick={addActivity}>我要發起活動</button>
        </Group>
        <Group>
          <div>參加的群組列表</div>
          {joinGroup.length > 0 ? (
            Object.values(joinGroup).map((item, index) => {
              return (
                <div key={index}>
                  <div>name:{item.groupName}</div>
                  <Link to={`/Activity/${item.groupID}`}>
                    ID:{item.groupID}
                  </Link>
                </div>
              )
            })
          ) : (
            <div>目前尚無參加群組</div>
          )}
        </Group>
      </Divide>
      <Equipment>個人的裝備列表</Equipment>
      <input type="text" ref={equipmentSearch} onKeyDown={onKeyDown} />
      <button onClick={addTool}>加入清單</button>
      <Tools>
        清單列表
        {tools.length > 0 ? (
          tools.map((item, index) => {
            return (
              <Divide key={index}>
                <div>{item}</div>
                <IconImage
                  style={{
                    backgroundImage: `url(${equipments[item]})`,
                  }}
                ></IconImage>
                <Delete onClick={() => deleteEquipment(index)} />
              </Divide>
            )
          })
        ) : (
          <p>目前尚無清單</p>
        )}
      </Tools>
    </>
  )
}

export default Profile
