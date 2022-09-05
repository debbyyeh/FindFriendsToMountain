import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { db, storage } from '../../utils/firebase'
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  setDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { Link } from 'react-router-dom'
import memberDefault from './memberDefault.png'
import accommodation from './accommodation.png'
import Car from './Car.png'
import itinerary from './itinerary.png'
const Divide = styled.div`
  display: flex;
`
const Private = styled.div`
  width: 20%;
`
const Public = styled.div`
  width: 80%;
  display: flex;
`
const PublicArea = styled.div`
  width: calc(100% / 4);
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
const LocationIntro = styled.textarea`
  border: 1px solid white;
  height: 300px;
  width: 300px;
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

const ActivityContent = () => {
  let url = window.location.href
  const newUrl = url.split('http://localhost:3000/Activity/')
  const groupID = newUrl[1]
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
  const [password, setPassword] = useState()
  const [currentName, setCurrentName] = useState()
  const [welcome, setWelcome] = useState(false)
  const [ownerName, setOwnerName] = useState()
  const [visitorUid, setVisitorUid] = useState()
  const [visitorInfo, setVisitorInfo] = useState()
  const [visitorName, setVisitorName] = useState()
  const [member, setMember] = useState()
  //總床位
  const [allBedArr, setAllBedArr] = useState([])
  //每一組床位的資訊
  const [bedInfo, setBedInfo] = useState()

  useEffect(() => {
    getvisitorInfo()
    testAuth()
    async function getGroupInfo() {
      const id = groupID
      setContentID(groupID)
      try {
        const docRef = doc(db, 'groupLists', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const userData = docSnap.data()
          setGroupData(userData)
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
          setContentData(Data)
        }
      } catch {
        console.log('No such document!')
      }
    }
    getGroupInfo()
    getContentInfo()
  }, [groupID])

  console.log(contentData)

  //取得進入頁面的人的資料
  async function getvisitorInfo() {
    const visitorData = doc(db, 'users', makeLogin.uid)
    const visitorSnap = await getDoc(visitorData)
    if (visitorSnap.exists()) {
      const visitorData = visitorSnap.data()
      const nowvisitorName = visitorData.name
      setVisitorName(nowvisitorName)
    }
  }

  //驗證
  async function testAuth() {
    const testRef = doc(db, 'groupLists', groupID)
    const testSnap = await getDoc(testRef)
    const groupContent = doc(db, 'groupContents', groupID)

    if (testSnap.exists()) {
      const testInfo = testSnap.data()
      //取到群組的密碼
      const testPassword = testInfo.groupPassword
      const owner = testInfo.groupOwner
      const currentGroupName = testInfo.groupName
      // if (groupSnap.exists()) {
      //   const groupMember = groupSnap.data()
      //   const memberLog = groupMember
      // }

      if (makeLogin.uid !== owner) {
        setAuth(true)
        setPassword(testPassword)
        setVisitorUid(makeLogin.uid)
        setOwnerName(owner)
        setCurrentName(currentGroupName)
      } else {
        setAuth(false)
        setContent(true)
      }
    }
  }

  async function testBtn() {
    if (authRef.current.value !== password) {
      alert('驗證碼錯誤')
    } else {
      setAuth(false)
      setWelcome(true)
      //取到他的資訊
      const visitorData = doc(db, 'users', visitorUid)
      const visitorSnap = await getDoc(visitorData)
      if (visitorSnap.exists()) {
        const visitorData = visitorSnap.data()
        const getvisitorInfo = {
          visitorName: visitorData.name,
          visitorPic: visitorData.photoURL,
          isLogged: true,
          //通過驗證
        }
        setVisitorInfo(getvisitorInfo)
      }
    }
  }

  async function join() {
    setWelcome(false)
    setContent(true)
    const groupContent = doc(db, 'groupContents', groupID)
    const groupSnap = await getDoc(groupContent)
    //更新群組的member
    if (groupSnap.exists()) {
      const groupData = groupSnap.data()
      const oldmemberList = groupData.memberList
      let newMember = []
      const newMemberInfo = visitorInfo
      newMember.push(visitorInfo, ...oldmemberList)
      const updateMember = await updateDoc(groupContent, {
        memberList: newMember,
      })
      setMember(newMember)
    }
    //更新自己的joinlist
    const visitorData = doc(db, 'users', visitorUid)
    const visitorSnap = await getDoc(visitorData)
    if (visitorSnap.exists()) {
      console.log(visitorSnap.data())
      const visitorDataInfo = visitorSnap.data()
      const oldjoinList = visitorDataInfo.joinGroup
      let newjoinList = []
      const joinInfo = {
        groupID: groupID,
        groupName: currentName,
      }
      newjoinList.push(joinInfo, ...oldjoinList)
      const updatejoinGroup = await updateDoc(visitorData, {
        joinGroup: newjoinList,
      })
    }
  }

  function addOneBed() {
    setAddBed((current) => !current)
  }

  //選帳篷後送回data 按下新增
  async function addBedList() {
    //輸入的帳篷名稱跟人數送回data後再渲染
    setBedContent(true)
    const beddocRef = doc(db, 'groupContents', contentID)
    const docSnap = await getDoc(beddocRef)
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data()) //取到groupcontent
      const groupInfo = docSnap.data()
      const oldBedLists = groupInfo.bedLists //[]
      const newBedList = {
        bedName: addNameRef.current.value,
        bedLen: addNumberRef.current.value,
        bedNameLists: [],
      }
      let newList = []
      newList.push(newBedList, ...oldBedLists)
      console.log(newBedList)
      setBedInfo(newList)

      //更新
      const updateBedList = await updateDoc(beddocRef, {
        bedLists: newList,
      })
    }
  }

  async function deleteBed(key) {
    let deleteBeds = bedInfo.filter((item, index) => index !== key)
    const newBeds = deleteBeds
    setBedInfo(newBeds)
    try {
      const beddocRef = doc(db, 'groupContents', contentID)
      const updateBed = await updateDoc(beddocRef, {
        bedLists: newBeds,
      })
    } catch (error) {
      console.log('資料更新失敗')
    }
  }

  console.log(auth)

  return (
    <>
      {auth && (
        <>
          <div>請輸入驗證碼</div>
          <input ref={authRef} />
          <button onClick={testBtn}>驗證</button>
        </>
      )}
      {welcome && (
        <>
          <div>歡迎加入{currentName}的群組</div>
          <button onClick={join}>確定加入</button>
          <Link to="/profile">考慮一下，回個人頁面</Link>
        </>
      )}

      <div>這是群組第二頁</div>
      {content && (
        <>
          <button>開始編輯</button>
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
                  <div>景點簡介</div>
                  <LocationIntro value={groupData.groupIntro} />
                  <div>團員</div>
                  {/* {member ? (
                    Object.values(member).map((item, index) => {
                      return (
                        <div key={index}>
                          <div>name:{item.visitorName}</div>
                          <MemberPic src={item.visitorPic} />
                          <div>ID:{item.groupID}</div>
                        </div>
                      )
                    })
                  ) : (
                    <MemberDefault></MemberDefault>
                  )} */}
                  {contentData.memberList !== undefined ? (
                    Object.values(contentData.memberList).map((item, index) => {
                      return (
                        <div key={index}>
                          <div>name:{item.visitorName}</div>
                          <MemberPic src={item.visitorPic} />
                          <div>ID:{item.groupID}</div>
                        </div>
                      )
                    })
                  ) : (
                    <MemberDefault></MemberDefault>
                  )}
                </>
              )}
            </Private>

            <Public>
              <PublicArea>
                <AreaTitle>
                  <img src={itinerary} />
                  <div>行程規劃</div>
                </AreaTitle>
              </PublicArea>
              <PublicArea>
                <AreaTitle>
                  <img src={accommodation} />
                  <div>住宿分配</div>
                  <AddOne onClick={addOneBed}>+</AddOne>
                </AreaTitle>
                {addBed && (
                  <>
                    <AddingName
                      type="text"
                      ref={addNameRef}
                      placeholder="名稱:Debby的帳篷"
                    />
                    <AddingNumber
                      type="text"
                      ref={addNumberRef}
                      placeholder="容納人數"
                    />
                    <AddingInputBtn onClick={addBedList}>新增</AddingInputBtn>
                  </>
                )}
                {bedInfo &&
                  Object.values(bedInfo).map((bed, index) => {
                    return (
                      <BedContent key={index}>
                        <Display>
                          <BedTitle>{bed.bedName}</BedTitle>
                          <Delete onClick={() => deleteBed(index)}>x</Delete>
                        </Display>
                        <BedDisplay>
                          <BedList>{index}</BedList>
                        </BedDisplay>
                      </BedContent>
                    )
                  })}

                {/* {bedContent && (
              <BedContent>

                <BedIcon />
                <Display>
                  <BedList />
                  <BedList />
                  <BedList />
                </Display>
              </BedContent>
            )} */}
              </PublicArea>
              <PublicArea>
                <AreaTitle>
                  <img src={Car} />
                  <div>車子分配</div>
                  <AddOne>+</AddOne>
                </AreaTitle>
              </PublicArea>
              <PublicArea>待討論事項</PublicArea>
            </Public>
          </Divide>
        </>
      )}
    </>
  )
}

export default ActivityContent
