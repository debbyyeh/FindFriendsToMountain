import React, { useState, useEffect, useRef, useContext } from 'react'
import styled, { keyframes } from 'styled-components'
import { db, storage } from '../../utils/firebase'
import {
  Divide,
  Text,
  InfoInput,
  FileLabel,
  SrcImage,
  Btn,
} from '../../css/style'
import { doc, getDoc, updateDoc, onSnapshot, setDoc } from 'firebase/firestore'
import ReactTooltip from 'react-tooltip'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useNavigate, useParams } from 'react-router-dom'
import memberDefault from './memberDefault.png'
import logo from './Mountain.png'
import lock from './Lock.png'
import edit from './Edit.png'
import done from './done.png'
import close from './Close.png'
import message from './Messaging.png'
import equipments from '../../equipments/equipments'
import TodoList from '../../components/Todolist/TodoList'
import Itinerary from '../../components/Itinerary/Itinerary'
import Cars from '../../components/Car/Cars'
import Accommodation from '../../components/Accommodation/Accommodation'
import { UserContext } from '../../utils/userContext'

const BackCover = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.5;
  @media screen and (max-width: 1279px) {
    height: 480px;
  }
  @media screen and (max-width: 767px) {
    height: 360px;
  }
`
const MainInfo = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 24px;
  padding: 14px;
  position: absolute;
  left: 50%;
  top: 90%;
  transform: translate(-50%, -90%);
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 576px) {
    width: 90%;
    padding: 8;
  }
`

const Wrapper = styled.div`
  max-width: calc(1320px - 40px);
  margin: 0 auto;
  font-family: Poppins;
  padding: 70px 20px 120px;
  @media screen and (max-width: 1279px) {
    padding: 40px 20px 60px;
  }
  @media screen and (max-width: 767px) {
    padding: 20px 20px 40px;
  }
`
const NewWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 560px;
  @media screen and (max-width: 1279px) {
    height: 480px;
  }
  @media screen and (max-width: 767px) {
    height: 360px;
  }
`
const MemberDefault = styled.div`
  background-image: url(${memberDefault});
  background-size: cover;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin-top: 8px;
`
const MemberPic = styled.img`
  cursor: pointer;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-top: 8px;
`
const IconImage = styled.div`
  width: 40px;
  height: 40px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media screen and (max-width: 1279px) {
    width: 30px;
    height: 30px;
  }
`
const IconWrapper = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #222322;
  @media screen and (max-width: 1279px) {
    width: 40px;
    height: 40px;
  }
`
const Icon = styled.div`
  cursor: pointer;
  width: 20px;
  height: 20px;
  background-size: contain;
  border: none;
  border-radius: 50%;
  transition: all 0.3s;
  &:hover {
    border: 1px solid #b99362;
  }
`
const EditBtn = styled.button`
  border-radius: 0;
  font-size: ${(props) => props.fontSize || '14px'};
  width: ${(props) => props.width || '120px'};
  color: ${(props) => props.color || '#F6EAD6'};
  border: ${(props) => props.border || 'none'};
  border-radius: ${(props) => props.borderRadius || 'none'};
  padding: ${(props) => props.padding || 'none'};
  margin-top: ${(props) => props.marginTop || 'none'};
  margin-bottom: ${(props) => props.marginBottom || 'none'};
  margin-left: ${(props) => props.marginLeft || 'none'};
  opacity: 0.5;
  &:after {
    content: '';
    border-bottom: 2px solid #b99362;
    margin: auto;
    position: relative;
    top: 5px;
    width: 0%;
    display: block;
    transition: all 0.3s;
  }
  &:hover {
    opacity: 1;
    &:after {
      width: 100%;
    }
  }
  @media screen and (max-width: 767px) {
    width: ${(props) => props.mobile_width || props.width};
    font-size: ${(props) => props.mobile_fontSize || props.fontSize};
    padding: ${(props) => props.mobile_padding || props.padding};
    margin-top: ${(props) => props.mobile_marginTop || props.marginTop};
    margin-bottom: ${(props) =>
      props.mobile_marginBottom || props.marginBottom};
    margin-left: ${(props) => props.mobile_marginLeft || 'none'};
  }
`
const DateInput = styled.input`
  width: 150px;
  height: 40px;
  font-size: 20px;
  color: #f6ead6;
  border-bottom: 1px solid #f6ead6;
  @media screen and (max-width: 1279px) {
    font-size: 20px;
  }
  @media screen and (max-width: 767px) {
    font-size: 14px;
    width: 100px;
  }
`
const FileInput = styled.input``
const PopupWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.9);
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
`
const PopContent = styled.div`
  z-index: 100;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`
const PopImage = styled.div`
  background-image: url(${lock});
  background-size: cover;
  width: 90px;
  height: 90px;
  @media screen and (max-width: 1279px) {
    width: 70px;
    height: 70px;
  }
`
const NewIntroWrapper = styled.textarea`
  font-size: 16px;
  line-height: 25px;
  letter-spacing: 1px;
  width: 100%;
  min-height: 200px;
  resize: none;
  text-align: left;
  color: #f6ead6;
  background: transparent;
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
  @media screen and (max-width: 1279px) {
    font-size: 14px;
  }
`
const NoteBox = styled.div`
  position: relative;
  padding: 10px;
  width: 100%;
  height: auto;
  border: 1px solid #f6ead6;
  border-radius: 5px;
  display: inline-block;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  &:before {
    position: absolute;
    width: 0;
    content: '';
    border: 10px solid transparent;
    top: 8px;
    border-left-color: #f6ead6;
    right: -20px;
  }
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
    left:600px;
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
const MBmove = keyframes`
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
    @media screen and (max-width: 767px) {
      animation: ${MBmove} 3s ease-in-out infinite;
    }
  }
`
const Bar = styled.div`
  display: flex;
  justify-content: flex-start;
  @media screen and (max-width: 1279px) {
    max-width: 100%;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      height: 1px;
    }
    &::-webkit-scrollbar-button {
      display: none;
    }
    &::-webkit-scrollbar-track-piece {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: transparent;
      border: 1px solid #f6ead6;
    }
    &::-webkit-scrollbar-track {
      box-shadow: transparent;
    }
  }
`
const BarDivide = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  @media screen and (max-width: 767px) {
    max-width: calc(100% - 30px);
    margin: 0 auto;
    overflow-x: scroll;
    &::-webkit-scrollbar {
      height: 1px;
    }
    &::-webkit-scrollbar-button {
      display: none;
    }
    &::-webkit-scrollbar-track-piece {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: rgba(0, 0, 0, 0.2);
      border: 1px solid #f6ead6;
    }
    &::-webkit-scrollbar-track {
      box-shadow: transparent;
    }
  }
`
const Category = styled.div`
  width: calc(100% / 3);
  text-align: center;
  padding: 12px;
  font-size: 20px;
  letter-spacing: 2px;
  cursor: pointer;
  padding-bottom: 4px;
  border-bottom: 2px solid #b99362;
  transition: all 0.3s;

  opacity: ${(props) => (props.$isActive ? 1 : 0.2)};
  @media screen and (max-width: 767px) {
    font-size: 16px;
    letter-spacing: 1px;
    white-space: no-wrap;
    padding: 12px 0;
  }
`
const ScrollDivide = styled.a`
  display: block;
  position: fixed;
  right: 20px;
  top: calc(90% - 40px);
  z-index: 3;
  border: 1px solid #f6ead6;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #875839;
  }
  &:active {
    background-color: #875839;
  }
  @media screen and (max-width: 767px) {
    width: 50px;
    height: 50px;
  }
`
const Scroll = styled.div`
  background-image: url(${message});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 50px;
  height: 50px;
  margin: 0 auto;
  cursor: pointer;
  position: relative;
  @media screen and (max-width: 767px) {
    width: 30px;
    height: 30px;
  }
`
const ActivityContent = () => {
  const urlID = useParams()
  const [contentData, setContentData] = useState()
  const authRef = useRef()
  const [auth, setAuth] = useState(false)
  const [content, setContent] = useState()
  const [latestContentsData, setLatestContentsData] = useState()
  const [profile, setProfile] = useState()
  const [ownerAuth, setOwnerAuth] = useState()
  const [memberAuth, setMemberAuth] = useState()
  const [online, setOnline] = useState(false)
  const [todoAlert, setTodoAlert] = useState(false)
  const [ownerProfile, setOwnerProfile] = useState()
  const [isEditable, setIsEditable] = useState(false)
  const [isNote, setIsNote] = useState(false)
  const newNameRef = useRef()
  const newCityRef = useRef()
  const newMountainRef = useRef()
  const newIntro = useRef()
  const newPassword = useRef()
  const [newStart, setNewStart] = useState()
  const [newEnd, setNewEnd] = useState()
  const [images, setImages] = useState()
  const [imageURLs, setImageURLs] = useState()
  const [downloadUrl, setDownloadUrl] = useState()
  const [loading, setLoading] = useState(false)
  const [introData, setIntroData] = useState('')
  const [tabIndex, setTabIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const navigate = useNavigate()
  const value = useContext(UserContext)

  const groupContentRef = doc(db, 'groupContents', urlID.id)

  useEffect(() => {
    if (value.userAuth === null) {
      value.alertPopup()
      value.setAlertContent('您尚未登入會員')
      navigate('/login')
    } else {
      testAuth()
    }
    async function getContentInfo() {
      try {
        const docSnap = await getDoc(groupContentRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setContentData(data)
        }
      } catch {
        console.log('No such document!')
      }
    }
    getContentInfo()
    getOwnerProfile()
    editFunction()
      .then((res) => {
        setLoading(true)
      })
      .finally(() => {
        setLoading(false)
      })
    const unsub = onSnapshot(groupContentRef, (doc) => {
      const data = doc.data()
      if (data === undefined) {
        value.alertPopup()
        value.setAlertContent('網址頁面不存在，將導回首頁')
        setTimeout(() => navigate('/'), 1500)
      } else {
        setLatestContentsData(data)
        setIntroData(data.groupIntro)
        console.log(data.todoList.length, contentData?.todoList.length)
        if (data?.todoList.length - contentData?.todoList.length > 0) {
          setTodoAlert(true)
          value.alertPopup()
          value.setAlertContent('新訊息')
          console.log(online)
          if (online) {
            setTodoAlert(false)
          }
        }
      }
    })
  }, [value.userAuth, urlID.id])

  async function testAuth() {
    const groupDoc = await getDoc(groupContentRef)
    if (groupDoc.exists()) {
      const groupOwnerInfo = groupDoc.data()
      const currgroupOwner = groupOwnerInfo.groupOwner
      const currMember = groupOwnerInfo.memberList
      if (value.userUid === currgroupOwner) {
        setAuth(false)
        setContent(true)
        setOwnerAuth(value.userUid)
        getOwnerProfile(currgroupOwner)
      } else if (value.userUid !== currgroupOwner) {
        setOwnerAuth(null)
        if (currMember.length === 0) {
          setAuth(true)
          setContent(false)
          setMemberAuth(value.userUid)
          getOwnerProfile(currgroupOwner)
        } else if (currMember.length !== 0) {
          function isSecondTime(person) {
            return person.joinID === value.userUid
          }
          if (currMember.find(isSecondTime) !== undefined) {
            setAuth(false)
            getOwnerProfile(currgroupOwner)
            value.alertPopup()
            value.setAlertContent('歡迎回來')
            setContent(true)
            setMemberAuth(value.userUid)
          } else {
            setAuth(true)
            setContent(true)
            getOwnerProfile(currgroupOwner)
          }
        }
      }
    }
  }

  async function getOwnerProfile(currgroupOwner) {
    try {
      const docRef = doc(db, 'users', currgroupOwner)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        setOwnerProfile(data)
      }
    } catch {
      console.log('No such document!')
    }
  }

  async function testBtn() {
    if (authRef.current.value !== contentData.groupPassword) {
      value.alertPopup()
      value.setAlertContent('驗證碼錯誤')
    } else {
      value.alertPopup()
      value.setAlertContent('驗證成功')
      setAuth(false)
      setContent(true)
      setMemberAuth(value.userUid)
      updateTheGroup()
    }
  }

  async function getJoinerData() {
    const joinData = doc(db, 'users', value.userUid)
    const joinSnap = await getDoc(joinData)
    if (joinSnap.exists()) {
      try {
        const getjoinData = joinSnap.data()
        const oldjoinList = await getjoinData.joinGroup
        let newjoinList = []
        const joinInfo = {
          groupID: urlID.id,
          groupName: contentData.groupName,
          groupPhoto: contentData.groupPhoto,
          startDate: newStart ? newStart : contentData.startDate,
          endDate: newEnd ? newEnd : contentData.endDate,
        }
        newjoinList.push(joinInfo, ...oldjoinList)
        const updatejoinGroup = await updateDoc(joinData, {
          joinGroup: newjoinList,
        })
      } catch {
        console.log('No such document!')
      }
    }
  }
  async function updateMemberList() {
    const joinData = doc(db, 'users', value.userUid)
    const joinSnap = await getDoc(joinData)
    const memberSnap = await getDoc(groupContentRef)
    if (memberSnap.exists() && joinSnap.exists()) {
      const joinPic = joinSnap.data()
      const joinPicURL = joinPic.photoURL
      let newMember = []
      const newMemberInfo = {
        joinName: value.userName,
        joinPic: joinPicURL,
        joinID: value.userUid,
        isLogged: true,
      }
      newMember.push(newMemberInfo, ...contentData.memberList)
      const updateMember = await updateDoc(groupContentRef, {
        memberList: newMember,
      })
    }
  }
  async function updateTheGroup() {
    const newPromise = [getJoinerData(), updateMemberList()]
    await Promise.all(newPromise)
  }
  async function seeTheProfile(index) {
    const profileID = latestContentsData.memberList[index].joinID
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
  function getPhotoInfo(e) {
    setImages([...e.target.files])
    const newImageUrls = URL.createObjectURL(e.target.files[0])
    setImageURLs(newImageUrls)
  }
  async function editFunction() {
    setLoading(true)
    const newPromise = [sendUpdateInfo(), editGroupInfo(), findMemberData()]
    await Promise.all(newPromise)
    setLoading(false)
    setIsEditable(false)
    setImages(undefined)
  }
  async function sendUpdateInfo() {
    const docSnap = await getDoc(groupContentRef)
    if (images !== undefined) {
      const imageRef = ref(storage, `images/${urlID.id}_登山團封面照`)
      await uploadBytes(imageRef, images[0])
      let url = await getDownloadURL(imageRef)
      setDownloadUrl(url)
      if (docSnap.exists()) {
        const updateLeadGroup = await setDoc(
          groupContentRef,
          {
            groupPhoto: url,
            groupName: newNameRef.current.value,
            groupPassword: newPassword.current.value,
            groupCity: newCityRef.current.value,
            startDate:
              newStart === undefined ? contentData.startDate : newStart,
            endDate: newEnd === undefined ? contentData.endDate : newEnd,
            groupMountain: newMountainRef.current.value,
          },
          { merge: true },
        )
        setIsEditable(false)
      }
    } else {
      try {
        if (docSnap.exists()) {
          const updateLeadGroup = await setDoc(
            groupContentRef,
            {
              groupName: newNameRef.current.value,
              groupCity: newCityRef.current.value,
              startDate:
                newStart === undefined ? contentData.startDate : newStart,
              endDate: newEnd === undefined ? contentData.endDate : newEnd,
              groupMountain: newMountainRef.current.value,
              groupPassword: newPassword.current.value,
            },
            { merge: true },
          )
        }
      } catch {
        console.log('No such document!')
      }
    }
  }
  async function editGroupInfo() {
    try {
      const docRef = doc(db, 'users', ownerAuth)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const userData = docSnap.data()
        const oldLeadGroup = userData.leadGroup
        let index = oldLeadGroup.findIndex((c) => c.groupID === urlID.id)
        const leadGroupInfo = {
          groupID: urlID.id,
          groupName: newNameRef.current.value
            ? newNameRef.current.value
            : latestContentsData.groupName,
          groupPhoto: downloadUrl ? downloadUrl : latestContentsData.groupPhoto,
          startDate: newStart ? newStart : latestContentsData.startDate,
          endDate: newEnd ? newEnd : latestContentsData.endDate,
        }
        oldLeadGroup.splice(index, 1, leadGroupInfo)
        const updateLeadGroup = await updateDoc(docRef, {
          leadGroup: oldLeadGroup,
        })
      }
    } catch {
      console.log('No such document!')
    }
  }
  async function findMemberData() {
    if (latestContentsData?.memberList.length === 0) {
      return
    } else {
      let thisID
      latestContentsData?.memberList.map((list, index) => {
        thisID = latestContentsData.memberList[index].joinID
      })
      const thisIDRef = doc(db, 'users', thisID)
      const getRef = await getDoc(thisIDRef)
      if (getRef.exists()) {
        const getRefData = getRef.data()
        const getJoinData = getRefData.joinGroup
        let eachIndex = getJoinData.findIndex((c) => c.groupID === urlID.id)
        const joinGroupInfo = {
          groupID: urlID.id,
          groupName: newNameRef.current.value
            ? newNameRef.current.value
            : latestContentsData.groupName,
          groupPhoto:
            downloadUrl !== undefined
              ? downloadUrl
              : latestContentsData.groupPhoto,
          startDate: newStart ? newStart : latestContentsData.startDate,
          endDate: newEnd ? newEnd : latestContentsData.endDate,
        }
        getJoinData.splice(eachIndex, 1, joinGroupInfo)
        const updatejoinGroup = await updateDoc(thisIDRef, {
          joinGroup: getJoinData,
        })
      }
    }
  }
  async function checkNote() {
    try {
      const docSnap = await getDoc(groupContentRef)
      if (docSnap.exists()) {
        const updateLeadGroup = setDoc(
          groupContentRef,
          {
            groupIntro: newIntro.current.value,
          },
          { merge: true },
        )
      }
      setIntroData(newIntro.current.value)
      setIsNote(false)
    } catch {
      console.log('No such document!')
    }
  }
  return (
    <>
      {auth && (
        <>
          <PopupWrapper>
            <PopContent>
              <PopImage />
              <Text
                fontSize="32px"
                tablet_fontSize="20px"
                margin="0px 0px 30px 0px"
              >
                歡迎加入，請輸入驗證碼
              </Text>
              <InfoInput
                ref={authRef}
                width="200px"
                borderBottom="1px solid #f6ead6"
                backgroundColor="none"
                color="#F6EAD6"
                fontSize="24px"
                boxShadow="none"
              />
              <Btn width="200px" margin="20px auto 20px" onClick={testBtn}>
                驗證
              </Btn>
            </PopContent>
          </PopupWrapper>
        </>
      )}
      <LoadingBackground loading={loading}>
        <LoadingStyle></LoadingStyle>
      </LoadingBackground>
      {content && (
        <>
          <NewWrapper>
            {contentData && (
              <>
                {ownerAuth !== null && isEditable ? (
                  <>
                    <BackCover
                      style={{
                        border: '1px solid white',
                        backgroundImage: `url(${
                          imageURLs ? imageURLs : latestContentsData.groupPhoto
                        })`,
                      }}
                    >
                      <FileLabel>
                        選擇照片
                        <FileInput
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={getPhotoInfo}
                          style={{ display: 'none' }}
                        />
                      </FileLabel>
                    </BackCover>
                    <MainInfo>
                      <Divide
                        justifyContent="center"
                        marginBottom="12px"
                        mobile_justifyContent="flex-start"
                      >
                        <Text
                          fontSize="24px"
                          fontWeight="400"
                          tablet_fontSize="20px"
                          mobile_fontSize="16px"
                        >
                          團名：
                        </Text>
                        <InfoInput
                          backgroundColor="transparent"
                          width="300px"
                          mobile_width="200px"
                          fontSize="20px"
                          tablet_fontSize="20px"
                          mobile_fontSize="16px"
                          boxShadow="none"
                          color="#F6EAD6"
                          borderBottom="1px solid #F6EAD6"
                          mobile_height="30px"
                          ref={newNameRef}
                          defaultValue={
                            latestContentsData.groupName
                              ? latestContentsData.groupName
                              : contentData.groupName
                          }
                        />
                      </Divide>
                      <Divide marginBottom="12px">
                        <Text
                          margin="0px 0px 0px 0px"
                          fontSize="24px"
                          fontWeight="400"
                          tablet_fontSize="20px"
                          mobile_fontSize="16px"
                          mobile_margin="0 0 0 0"
                        >
                          地點：
                        </Text>
                        <Divide>
                          <InfoInput
                            backgroundColor="transparent"
                            width="150px"
                            mobile_width="100px"
                            fontSize="20px"
                            tablet_fontSize="20px"
                            mobile_fontSize="16px"
                            boxShadow="none"
                            color="#F6EAD6"
                            borderBottom="1px solid #F6EAD6"
                            mobile_height="30px"
                            ref={newCityRef}
                            defaultValue={
                              latestContentsData.groupCity
                                ? latestContentsData.groupCity
                                : contentData.groupCity
                            }
                          />
                          <InfoInput
                            backgroundColor="transparent"
                            width="150px"
                            mobile_width="120px"
                            fontSize="20px"
                            tablet_fontSize="20px"
                            mobile_fontSize="16px"
                            boxShadow="none"
                            color="#F6EAD6"
                            borderBottom="1px solid #F6EAD6"
                            mobile_height="30px"
                            ref={newMountainRef}
                            defaultValue={
                              latestContentsData.groupMountain
                                ? latestContentsData.groupMountain
                                : contentData.groupMountain
                            }
                          />
                        </Divide>
                      </Divide>
                      <Divide marginBottom="12px">
                        <Text
                          fontSize="24px"
                          fontWeight="400"
                          tablet_fontSize="20px"
                          mobile_fontSize="16px"
                        >
                          日期：
                        </Text>
                        <DateInput
                          type="date"
                          style={{ colorScheme: 'dark' }}
                          onChange={(e) => setNewStart(e.target.value)}
                          defaultValue={
                            latestContentsData.startDate
                              ? latestContentsData.startDate
                              : contentData.startDate
                          }
                        />
                        <DateInput
                          type="date"
                          style={{ colorScheme: 'dark', cursor: 'pointer' }}
                          onChange={(e) => setNewEnd(e.target.value)}
                          defaultValue={
                            latestContentsData.endDate
                              ? latestContentsData.endDate
                              : contentData.endDate
                          }
                        />
                      </Divide>
                      <Divide marginBottom="12px">
                        <Text fontSize="16px" fontWeight="400">
                          群組密碼：
                        </Text>
                        <InfoInput
                          ref={newPassword}
                          backgroundColor="transparent"
                          width="150px"
                          mobile_width="120px"
                          fontSize="16px"
                          boxShadow="none"
                          color="#F6EAD6"
                          borderBottom="1px solid #F6EAD6"
                          mobile_height="30px"
                          defaultValue={
                            latestContentsData.groupPassword
                              ? latestContentsData.groupPassword
                              : contentData.groupPassword
                          }
                        />
                      </Divide>
                      <Divide flexDirection="column">
                        <Divide justiftContent="space-between">
                          <EditBtn
                            width="120px"
                            mobile_width="80px"
                            color="#B99362"
                            padding="8px 12px"
                            mobile_padding="8px"
                            mobile_fontSize="12px"
                            style={{
                              opacity: '1',
                            }}
                            onClick={() => setIsEditable(false)}
                          >
                            取消修改
                          </EditBtn>
                          <EditBtn
                            width="120px"
                            mobile_width="80px"
                            color="#B99362"
                            padding="8px 12px"
                            mobile_padding="8px"
                            mobile_fontSize="12px"
                            style={{
                              opacity: '1',
                            }}
                            onClick={editFunction}
                          >
                            確認修改
                          </EditBtn>
                        </Divide>
                      </Divide>
                    </MainInfo>
                  </>
                ) : (
                  <>
                    <BackCover
                      style={{
                        backgroundImage: `url(${
                          imageURLs ? imageURLs : latestContentsData.groupPhoto
                        })`,
                      }}
                    ></BackCover>
                    <MainInfo>
                      <Divide
                        justifyContent="center"
                        marginBottom="12px"
                        mobile_justifyContent="flex-start"
                      >
                        <Text
                          fontSize="24px"
                          fontWeight="400"
                          tablet_fontSize="20px"
                          mobile_fontSize="16px"
                        >
                          團名：
                        </Text>
                        <Text
                          fontSize="20px"
                          tablet_fontSize="20px"
                          mobile_fontSize="16px"
                        >
                          {latestContentsData.groupName
                            ? latestContentsData.groupName
                            : contentData.groupName}
                        </Text>
                      </Divide>
                      <Divide marginBottom="12px">
                        <Text
                          margin="0px 0px 0px 0px"
                          fontSize="24px"
                          fontWeight="400"
                          tablet_fontSize="20px"
                          mobile_fontSize="16px"
                          mobile_margin="0 0 0 0"
                        >
                          地點：
                        </Text>
                        <Divide>
                          <Text
                            fontSize="20px"
                            margin="0 8px 0 0"
                            tablet_fontSize="20px"
                            mobile_fontSize="16px"
                          >
                            {latestContentsData.groupCity
                              ? latestContentsData.groupCity
                              : contentData.groupCity}
                            |
                            {latestContentsData.groupMountain
                              ? latestContentsData.groupMountain
                              : contentData.groupMountain}
                          </Text>
                        </Divide>
                      </Divide>
                      <Divide marginBottom="12px">
                        <Text
                          fontSize="24px"
                          fontWeight="400"
                          tablet_fontSize="20px"
                          mobile_fontSize="16px"
                        >
                          日期：
                        </Text>
                        <Text
                          fontSize="20px"
                          tablet_fontSize="16px"
                          mobile_fontSize="14px"
                        >
                          {latestContentsData.startDate
                            ? latestContentsData.startDate
                            : contentData.startDate}{' '}
                          ~{' '}
                          {latestContentsData.endDate
                            ? latestContentsData.endDate
                            : contentData.endDate}
                        </Text>
                      </Divide>
                      {ownerAuth !== null && (
                        <Divide marginBottom="12px">
                          <Text fontSize="16px" fontWeight="400">
                            群組密碼：
                          </Text>
                          <Text fontSize="16px" mobile_fontSize="14px">
                            {latestContentsData.groupPassword}
                          </Text>
                        </Divide>
                      )}
                      {ownerAuth !== null && !isEditable && (
                        <>
                          <ReactTooltip
                            id="owner"
                            place="bottom"
                            effect="solid"
                          >
                            團長專屬修改權限
                          </ReactTooltip>
                          <EditBtn
                            width="140px"
                            borderBottom="1px solid #F6EAD6"
                            mobile_fontSize="12px"
                            mobile_marginTop="10px"
                            onClick={() => {
                              setIsEditable(true)
                            }}
                            data-tip
                            data-for="owner"
                          >
                            【修改基本資訊】
                          </EditBtn>
                        </>
                      )}
                    </MainInfo>
                  </>
                )}
              </>
            )}
          </NewWrapper>
          <Wrapper>
            <ScrollDivide>
              <ReactTooltip id="contact" place="top" effect="solid">
                留言版
              </ReactTooltip>
              <Scroll
                data-tip
                data-for="contact"
                onClick={() => setOnline((current) => !current)}
              ></Scroll>
              {online && (
                <Divide
                  style={{
                    position: 'absolute',
                    right: '20px',
                    bottom: '60px',
                  }}
                >
                  <TodoList memberAuth={memberAuth} ownerAuth={ownerAuth} />
                </Divide>
              )}
            </ScrollDivide>
            <Divide
              alignItems="start"
              justiftContent="space-around"
              mobile_flexDirection="column"
            >
              <Divide
                width="20%"
                tablet_width="30%"
                flexDirection="column"
                mobile_width="100%"
                mobile_marginBottom="20px"
              >
                <NoteBox>
                  <Divide
                    width="100%"
                    marginBottom="24px"
                    mobile_marginBottom="16px"
                  >
                    <Text
                      textAlign="left"
                      mobile_fontSize="14px"
                      color="#B99362"
                    >
                      事項提醒/行程
                    </Text>
                    {ownerAuth !== null && (
                      <>
                        {isNote ? (
                          <Divide>
                            <Icon
                              style={{
                                backgroundImage: `url(${close})`,
                              }}
                              onClick={() => setIsNote(false)}
                            ></Icon>
                            <Icon
                              style={{
                                marginLeft: '16px',
                                backgroundImage: `url(${done})`,
                              }}
                              onClick={checkNote}
                            ></Icon>
                          </Divide>
                        ) : (
                          <Icon
                            style={{
                              backgroundImage: `url(${edit})`,
                              backgroundRepeat: 'no-repeat',
                            }}
                            onClick={() => setIsNote(true)}
                          ></Icon>
                        )}
                      </>
                    )}
                  </Divide>
                  {isNote ? (
                    <NewIntroWrapper
                      ref={newIntro}
                      defaultValue={introData ? introData : '目前尚無填寫事項'}
                    />
                  ) : (
                    <NewIntroWrapper
                      disabled
                      value={introData ? introData : '目前尚無填寫事項'}
                    />
                  )}
                </NoteBox>
              </Divide>
              <Divide
                width="75%"
                tablet_width="65%"
                flexDirection="column"
                alignItems="start"
                mobile_width="100%"
              >
                <Divide
                  width="100%"
                  justifyContent="flex-start"
                  mobile_justifyContent="space-between"
                >
                  {contentData?.groupOwner && (
                    <Divide
                      flexDirection="column"
                      width="15%"
                      alignItems="start"
                      tablet_width="20%"
                    >
                      <Text margin="0x 0x 8px 0px">團長</Text>
                      <Text margin="0x 0x 8px 0px" mobile_fontSize="12px">
                        {ownerProfile?.name}
                      </Text>
                      <MemberPic
                        src={ownerProfile?.photoURL}
                        onClick={() => setProfile()}
                      />
                    </Divide>
                  )}
                  <Divide
                    flexDirection="column"
                    alignItems="start"
                    width="100%"
                    mobile_width="75%"
                  >
                    <ReactTooltip id="defaultMember" place="top" effect="solid">
                      複製網址連結貼給團員，邀請加入，記得要提供邀請碼!
                    </ReactTooltip>
                    <Text
                      data-tip
                      data-for="defaultMember"
                      style={{ cursor: 'pointer' }}
                    >
                      團員
                    </Text>
                    <Bar>
                      {latestContentsData?.memberList &&
                      latestContentsData?.memberList.length > 0 ? (
                        Object.values(latestContentsData.memberList).map(
                          (item, index) => {
                            return (
                              <Divide
                                flexDirection="column"
                                tablet_flexDirection="column"
                                mobile_flexDirection="column"
                                marginRight="12px"
                                key={index}
                                id={index}
                              >
                                <ReactTooltip
                                  id={item.joinName}
                                  place="top"
                                  effect="solid"
                                >
                                  {item.joinName}
                                </ReactTooltip>
                                <MemberPic
                                  data-tip
                                  data-for={item.joinName}
                                  src={item.joinPic ? item.joinPic : logo}
                                  onClick={() => {
                                    seeTheProfile(index)
                                  }}
                                />
                              </Divide>
                            )
                          },
                        )
                      ) : (
                        <MemberDefault />
                      )}
                    </Bar>
                  </Divide>
                </Divide>
                <Divide
                  marginTop="24px"
                  width="auto"
                  flexDirection="column"
                  alignItems="start"
                  mobile_width="100%"
                  padding="12px 20px 12px 20px"
                  mobile_padding="12px 12px 12px 12px"
                  style={{
                    borderRadius: '24px',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    minHeight: '130px',
                  }}
                >
                  {!profile && (
                    <>
                      <Text
                        fontSize="16px"
                        tablet_fontSize="14px"
                        margin="0 0 12px 0"
                        color=" #B99362"
                      >
                        團長清單
                      </Text>
                      <BarDivide mobile_justifyContent="flex-start">
                        {ownerProfile?.equipment.length > 0 ? (
                          ownerProfile.equipment.map((item, index) => {
                            return (
                              <Divide
                                key={index}
                                flexDirection="column"
                                marginRight="12px"
                                style={{
                                  width: `calc(100% /${ownerProfile.equipment.length} + 10px )`,
                                }}
                              >
                                <Text tablet_fontSize="14px">{item}</Text>
                                <IconWrapper>
                                  <IconImage
                                    style={{
                                      backgroundImage: `url(${
                                        equipments[item]
                                          ? equipments[item]
                                          : logo
                                      })`,
                                    }}
                                  ></IconImage>
                                </IconWrapper>
                              </Divide>
                            )
                          })
                        ) : (
                          <Text>團主目前尚無清單</Text>
                        )}
                      </BarDivide>
                    </>
                  )}
                  {profile && (
                    <>
                      <Text
                        mobile_fontSize="14px"
                        margin="0px 0 12px 0"
                        color=" #B99362"
                      >
                        {profile.name}的清單
                      </Text>
                      <BarDivide mobile_justifyContent="flex-start">
                        {profile.equipment.length > 0 ? (
                          profile.equipment.map((item, index) => {
                            return (
                              <>
                                <Divide
                                  key={index}
                                  flexDirection="column"
                                  marginRight="12px"
                                  style={{
                                    width: `calc(100% /${profile.equipment.length} + 10px )`,
                                  }}
                                >
                                  <Text tablet_fontSize="14px">{item}</Text>
                                  <IconWrapper>
                                    <IconImage
                                      style={{
                                        backgroundImage: `url(${
                                          equipments[item]
                                            ? equipments[item]
                                            : logo
                                        })`,
                                      }}
                                    ></IconImage>
                                  </IconWrapper>
                                </Divide>
                              </>
                            )
                          })
                        ) : (
                          <Text mobile_fontSize="14px">
                            {profile.name}目前尚無清單
                          </Text>
                        )}
                      </BarDivide>
                    </>
                  )}
                </Divide>
              </Divide>
            </Divide>
            <Divide marginTop="50px" mobile_marginTop="20px">
              {['認領清單', '住宿分配', '車子分配'].map((text, index) => (
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
              ))}
            </Divide>
            {currentPage === 0 && <Itinerary />}
            {currentPage === 1 && <Accommodation SrcImage={SrcImage} />}
            {currentPage === 2 && <Cars SrcImage={SrcImage} />}
          </Wrapper>
        </>
      )}
    </>
  )
}

export default ActivityContent
