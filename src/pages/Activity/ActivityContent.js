content

import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { db, storage } from '../../utils/firebase'
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  setDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import memberDefault from './memberDefault.png'

import equipments from '../../equipments/equipments'
import TodoList from '../../components/Todolist/TodoList'
import Itinerary from '../../components/Itinerary/Itinerary'
import Cars from '../../components/Car/Cars'
import Accommodation from '../../components/Accommodation/Accommodation'
const Divide = styled.div`
  display: flex;
`
const Private = styled.div`
  width: 20%;
  margin-right: 10%;
`
const Public = styled.div`
  width: 70%;
  ${'' /* display: flex; */}
`
const PublicArea = styled.div`
  width: calc(100% / 2);
`
const AreaTitle = styled.div`
  display: flex;
  align-items: center;
`
const MemberDefault = styled.div`
  background-image: url(${memberDefault});
  background-size: cover;
  border-radius: 50%;
  width: 60px;
  height: 60px;
`
const MemberPic = styled.img`
  border-radius: 50%;
  width: 60px;
  height: 60px;
  object-fit: cover;
`
const LocationIntro = styled.div`
  border: 1px solid white;
  height: 300px;
  width: 200px;
`
const AddOne = styled.div`
  font-size: 18px;
  border-radius: 50%;
  border: 1px solid white;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
`
const Display = styled.div`
  display: flex;
`
const BedDisplay = styled.ul`
  display: flex;
`
const BedTitle = styled.div``

const Delete = styled(AddOne)`
  font-size: 14px;
  width: 20px;
  height: 20px;
`
const BedContent = styled.div`
  width: 90%;
  border: 1px solid white;
`
const BedIcon = styled.img`
  width: 30px;
  height: 30px;
  object-fit: cover;
`
const BedList = styled.li`
  border: 1px solid withTheme;
  width: calc(100% / 3);
  text-align: center;
`
const AddingInput = styled(BedContent)``
const AddingInputBtn = styled(BedContent)`
  width: 20%;
  cursor: pointer;
`
const AddingName = styled.input`
  background-color: transparent;
  color: white;
`
const AddingNumber = styled.input`
  background-color: transparent;
  color: white;
`
const IconImage = styled.div`
  width: 40px;
  height: 40px;
  background-size: cover;
`

const ActiveBackground = styled.div`
  width: 10%;
  height: 10%;
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;

  display: ${(props) => (props.isActive ? 'block' : 'none')};
`

const ActivePost = styled.div`
  position: fixed;
  width: 10%;
  height: 10%;
  z-index: 100;
`

const Discussion = styled.div`
  display: flex;
`

const Line = styled.div`
  width: 100%;
  height: 10px;
  background-color: black;
  margin-top: 12px;
  margin-bottom: 12px;
`

const ActivityContent = () => {
  let url = window.location.href
  const newUrl = url.split('/activity/')
  const groupID = newUrl[1]
  const [isActive, setIsActive] = useState(false)
  const [contentID, setContentID] = useState()
  const [contentInfo, setContentInfo] = useState()
  const makeLogin = JSON.parse(window.localStorage.getItem('token'))
  const [groupData, setGroupData] = useState()
  const [contentData, setContentData] = useState()
  const addNameRef = useRef()
  const addNumberRef = useRef()
  const authRef = useRef()
  const [addBed, setAddBed] = useState(false)
  const [bedContent, setBedContent] = useState()
  const [bedList, setBedList] = useState()
  const [auth, setAuth] = useState(false)
  const [content, setContent] = useState(false)
  const [ownerName, setOwnerName] = useState()
  const [visitorUid, setVisitorUid] = useState()
  const [join, setJoin] = useState() //visitor個人資料
  const [member, setMember] = useState() //更新群組名單
  const [profile, setProfile] = useState() //點選大頭貼的個人資料
  const navigate = useNavigate()

  useEffect(() => {
    if (makeLogin == undefined) {
      alert('您尚未登入會員')
      navigate('/login')
    } else {
      getGroupInfo()
      getContentInfo()
      testAuth()
    }

    async function getGroupInfo() {
      const id = groupID
      setContentID(groupID)
      try {
        const docRef = doc(db, 'groupLists', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const userData = docSnap.data()
          setGroupData(userData)
          setOwnerName(userData.groupOwner)
        }
      } catch {
        console.log('No such document!')
      }
    }
    async function getContentInfo() {
      const id = groupID
      try {
        const docRef = doc(db, 'groupContents', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const Data = docSnap.data()
          const memberData = Data.memberList
          setContentData(Data)
          setMember(memberData)
        }
      } catch {
        console.log('No such document!')
      }
    }
    const unsub = onSnapshot(doc(db, 'groupContents', groupID), (doc) => {
      const data = doc.data()
      const memberData = data.memberList
      setMember(memberData)
    })
  }, [groupID, contentID])

  async function testAuth() {
    const groupContent = doc(db, 'groupContents', groupID)
    const groupDoc = await getDoc(groupContent)
    const groupOwnerInfo = groupDoc.data()
    const currgroupOwner = groupOwnerInfo.groupOwner
    const currMember = groupOwnerInfo.memberList
    //取得memberlist裡面的where

    if (makeLogin.uid == currgroupOwner) {
      setAuth(false)
      setContent(true)
    } else if (makeLogin.uid !== currgroupOwner) {
      let secondTest = currMember.filter((memberID, index) => {
        if (memberID.joinID.includes(makeLogin.uid)) {
          window.alert('歡迎回來')
          setAuth(false)
          setContent(true)
        } else {
          setAuth(true)
          const joinData = doc(db, 'users', makeLogin.uid)
          const joinSnap = getDoc(joinData)
          if (joinSnap.exists()) {
            const getjoinData = joinSnap.data()
            setJoin(getjoinData)
          }
        }
      })
    }
  }
  //FIXME
  async function testBtn() {
    if (authRef.current.value !== groupData.groupPassword) {
      alert('驗證碼錯誤')
    } else {
      alert('驗證成功')
      setAuth(false)
      setContent(true)
      //取得他的資料，更新個人joinlist
      const joinData = doc(db, 'users', makeLogin.uid)
      const groupContent = doc(db, 'groupContents', groupData.groupID)
      const oldjoinList = join.joinGroup
      console.log(oldjoinList)
      let newjoinList = []
      const joinInfo = {
        groupID: groupData.groupID,
        groupName: groupData.groupName,
      }
      newjoinList.push(joinInfo, ...oldjoinList)
      const updatejoinGroup = await updateDoc(joinData, {
        joinGroup: newjoinList,
      })
      const oldmemberList = contentData.memberList
      let newMember = []
      const newMemberInfo = {
        joinName: join.name,
        joinPic: join.photoURL,
        joinID: join.id,
        isLogged: true,
      }
      console.log(newMemberInfo)
      newMember.push(newMemberInfo, ...oldmemberList)
      const updateMember = await updateDoc(groupContent, {
        memberList: newMember,
      })
    }
  }

  function addOneBed() {
    setAddBed((current) => !current)
  }

  async function seeTheProfile(index) {
    setIsActive(true)
    const profileID = member[index].joinID
    console.log(profileID)
    try {
      const docRef = doc(db, 'users', profileID)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const userData = docSnap.data()
        setProfile(userData)
      }
    } catch {
      console.log('No such document!')
    }
  }

  return (
    <>
      {auth && (
        <>
          <div>歡迎加入，請輸入驗證碼</div>
          <input ref={authRef} />
          <button onClick={testBtn}>驗證</button>
        </>
      )}
      <div>這是群組第二頁</div>
      {content && (
        <>
          <Divide>
            <Private>
              主揪可編輯區
              {groupData && (
                <>
                  <div>團名{groupData.groupName}</div>
                  <div>
                    地點
                    {groupData.groupCity}|<span>{groupData.groupMountain}</span>
                  </div>
                  <div>團主版規</div>
                  <LocationIntro value={groupData.groupIntro} />
                  <div>團員</div>
                  {member.length > 0 ? (
                    Object.values(member).map((item, index) => {
                      return (
                        <div key={index} id={index}>
                          <div>name:{item.joinName}</div>
                          <MemberPic
                            src={item.joinPic}
                            onClick={() => seeTheProfile(index)}
                          />
                        </div>
                      )
                    })
                  ) : (
                    <MemberDefault></MemberDefault>
                  )}

                  <ActiveBackground isActive={isActive}>
                    <ActivePost
                      onClick={(e) => {
                        setIsActive(false)
                      }}
                      isActive={isActive}
                    >
                      {profile && <div>這是{profile.name}的清單</div>}
                      {profile && profile.equipment.length > 0 ? (
                        profile.equipment.map((item, index) => {
                          return (
                            <>
                              <Divide key={index}>
                                <div>{item}</div>
                                <IconImage
                                  style={{
                                    backgroundImage: `url(${equipments[item]})`,
                                  }}
                                ></IconImage>
                              </Divide>
                            </>
                          )
                        })
                      ) : (
                        <p>目前尚無清單</p>
                      )}
                    </ActivePost>
                  </ActiveBackground>
                </>
              )}
            </Private>

            <Public>
              <Accommodation />
              <Line />
              <Cars />
            </Public>
          </Divide>
          <TodoList />
          <Itinerary />
        </>
      )}
    </>
  )
}

export default ActivityContent
