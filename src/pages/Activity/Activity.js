import React, { useState, useEffect, useRef, useContext } from 'react'
import styled, { keyframes } from 'styled-components'
import { db, storage } from '../../utils/firebase'
import { collection, setDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { UserContext } from '../../utils/userContext'
import { Link, useNavigate } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import Calendar from 'react-calendar'
import trekking from './Trekking.png'
import cover from './cover.jpg'
import back from './back.png'
import check from './check.png'
import share from './Share.png'
import logo from './Mountain.png'
import 'react-calendar/dist/Calendar.css'
import background from './南湖.jpg'
import top from './top.png'

const Background = styled.div`
  ${'' /* background-image: url(${background}); */}
  backdrop-filter: blur(5px);
  width: 400px;
  height: 300px;
  background-size: cover;
  position: absolute;
  z-index: -1;
  top: 50%;
  left: 40%;
  transform: translate(-40%, -50%);
`
const Wrapper = styled.div`
  ${'' /* max-width: calc(1320px - 40px); */}
  max-width:calc(800px - 40px);
  padding-left: 20px;
  padding-right: 20px;
  margin: 0 auto;
  font-family: Poppins;
`
const Divide = styled.div`
  display: flex;
  justify-content: ${(props) => props.justifyContent || 'space-between'};
  align-items: ${(props) => props.alignItems || 'center'};
  flex-direction: ${(props) => props.flexDirection || 'row'};
  margin-bottom: ${(props) => props.marginBottom || '0px'};
  margin-top: ${(props) => props.marginTop || '0px'};
  flex-wrap: ${(props) => props.flexWrap || 'no-wrap'};
  border: ${(props) => props.border || 'none'};
  padding: ${(props) => props.padding || 'none'};
  @media screen and (max-width: 767px) {
    flex-direction: ${(props) => props.mobile_flexDirection || 'row'};
  }
`
const FlexDivide = styled.div`
  display: flex;
  flex-direction: column;
  ${'' /* width: 45%; */}
  width: 100%;
  ${'' /* margin-left: 5%; */}
  @media screen and (max-width: 1279px) {
    ${'' /* margin-left: 3%; */}
  }
  @media screen and (max-width: 767px) {
    ${'' /* width: 100%; */}
    ${'' /* margin-left: 0%; */}
  }
`

const StepDivide = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  position: absolute;
  bottom: 40px;
  left: 0;
  transition: all 0.3s ease;
  color: #f6ead6;
  font-size: 24px;
  @media screen and (max-width: 1279px) {
    font-size: 20px;
  }
  @media screen and (max-width: 767px) {
    font-size: 16px;
    bottom: 30px;
  }
`
const Text = styled.div`
  color: #f6ead6;
  font-size: 24px;
  margin-top: -20px;
  margin-bottom: 12px;
  @media screen and (max-width: 1279px) {
    font-size: 20px;
  }
  @media screen and (max-width: 767px) {
    font-size: 16px;
  }
`
const SubText = styled.p`
  color: #b99362;
  margin: 0;
  font-weight: 300;
  font-size: 16px;
  margin-top: 8px;
  text-align: left;
  @media screen and (max-width: 767px) {
    font-size: 14px;
  }
`
const Underline = styled.div`
  position: absolute;
  bottom: 0px;
  height: 2px;
  width: 100%;
`
const InputData = styled.div`
  width: 100%;
  height: 40px;
  position: relative;
  margin-bottom: 80px;

  @media screen and (max-width: 1279px) {
    margin-bottom: 60px;
  }
  @media screen and (max-width: 767px) {
    margin-bottom: 30px;
  }
`
const InfoInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  border-bottom: 1px solid #f6ead6;
  font-size: 20px;

  padding: 0px 12px;
  color: #b99362;

  &:focus ~ label {
    transform: translateY(-10px);
    font-weight: bold;
  }
  @media screen and (max-width: 1279px) {
    font-size: 16px;
    &:focus ~ label {
      font-size: 20px;
    }
  }
  @media screen and (max-width: 767px) {
    &:focus ~ label {
      font-size: 16px;
    }
  }
`
const FileInput = styled.input``
const FileLabel = styled.label`
  display: inline-block;
  cursor: pointer;
  color: #f6ead6;
  text-align: center;
  font-size: 20px;
  margin: 12px auto;
  transition: all 0.4s;
  &:hover {
    border-bottom: 1px solid #f6ead6;
  }
  @media screen and (max-width: 1279px) {
    font-size: 14px;
  }
`

const UploadPic = styled.div`
  width: 100%;
  height: 320px;
  background-color: #d9d9d9;
  border-radius: 8px;
  @media screen and (max-width: 1279px) {
    height: 240px;
  }
`
const UploadPhoto = styled.img`
  width: 100%;
  height: 320px;
  background-color: #d9d9d9;
  border-radius: 8px;
  object-fit: cover;
  @media screen and (max-width: 1279px) {
    height: 240px;
  }
`
const AfterUpload = styled.div`
  width: 120px;
  aspect-ratio: 1/1;
  background-color: #d9d9d9;
  border-radius: 8px;
`
const TextInput = styled.textarea`
  resize: none;
  width: 100%;
  height: 300px;
  background-color: transparent;

  color: #f6ead6;
  font-size: 24px;
  line-height: 40px;
  padding: 20px;
  &:focus {
    outline: none;
  }
  @media screen and (max-width: 1279px) {
    font-size: 16px;
    height: 200px;
    line-height: 30px;
  }
  @media screen and (max-width: 576px) {
    padding: 10px;
    height: 200px;
  }
`

const Basic = styled.div`
  ${'' /* width: 45%; */}
  width:100%;
  margin-rigth: auto;
  margin-left: auto;
  margin-top: 30px;
  @media screen and (max-width: 767px) {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
  }
`
const FormDate = styled.div`
  width: 100%;
  ${'' /* height: 50%; */}
  margin-bottom:30px;
  margin-bottom: 50px;
  @media screen and (max-width: 767px) {
    margin-bottom: 20px;
  }
`
const Photo = styled.div`
  width: 100%;
`

const CalendarContainer = styled.div`
  margin: 0 auto;
  background-color: transparent;
  .react-calendar {
    width: 100%;
    background: transparent;
    border: 1px solid rgb(55, 137, 113);
  }
  .react-calendar__navigation {
    display: flex;
    .react-calendar__navigation__label {
      font-weight: bold;
      font-size: 18px;
    }
    .react-calendar__navigation__arrow {
      flex-grow: 0.333;
      font-size: 20px;
    }
    .react-calendar__month-view__weekdays {
      text-align: center;
      color: black;
    }
  }
  button {
    margin: 3px;
    background-color: #6f876f;
    border: 0;
    border-radius: 3px;
    color: white;
    &:hover {
      background-color: #a5c1a5;
    }

    &:active {
      background-color: #a5c1a5;
    }
  }
  .react-calendar__navigation {
    margin-bottom: 0;
  }
  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%;

    .react-calendar__tile {
      max-width: initial !important;
      height: 40px;
      font-size: 18px;
      @media screen and (max-width: 767px) {
        font-size: 14px;
      }
    }
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    opacity: 0.5;
  }
  .react-calendar__month-view__days__day--weekend {
    color: #dfdfdf;
  }
  .react-calendar__month-view__weekdays__weekday {
    color: white;
  }
  .react-calendar__tile--range {
    background-color: #b99362;
    ${'' /* box-shadow: 0 0 6px 2px #577d45;
    &:active {
      
    } */}
  }
  .react-calendar__year-view__months,
  .react-calendar__decade-view__years,
  .react-calendar__century-view__decades {
    display: grid !important;
    grid-template-columns: 20% 20% 20% 20% 20%;

    &.react-calendar__year-view__months {
      grid-template-columns: 33.3% 33.3% 33.3%;
    }

    .react-calendar__tile {
      max-width: initial !important;
    }
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #b99362;
  }
  .react-calendar--selectRange .react-calendar__tile--hover {
    background-color: #6f876f;
  }
`

const Btn = styled.button`
  display: block;
  color: ${(props) => props.color || '#F6EAD6'};
  width: ${(props) => props.width || '0px'};
  height: ${(props) => props.height || '40px'};
  font-size: ${(props) => props.fontSize || '16px'};
  border-radius: ${(props) => props.borderRadius || '0'};
  border: ${(props) => props.border || '1px solid #F6EAD6'};
  padding: ${(props) => props.padding || 'none'};
  margin: ${(props) => props.margin || '0px 0px 0px 0px'};
  position: ${(props) => props.position || 'none'};
  top: ${(props) => props.top || 'none'};
  left: ${(props) => props.left || 'none'};
  bottom: ${(props) => props.bottom || 'none'};
  line-height: ${(props) => props.lineHeight || 'none'};
  display: flex;
  justify-content: center;
  align-items: center;
  &:active {
    transform: translateY(0.2rem);
  }
  @media screen and (max-width: 1279px) {
    width: ${(props) => props.tablet_width || props.width};
    height: ${(props) => props.tablet_height || props.height};
    padding: ${(props) => props.tablet_padding || props.padding};
    margin: ${(props) => props.tablet_margin || props.margin};
    font-size: ${(props) => props.tablet_fontSize || props.fontSize};
    left: ${(props) => props.tablet_left || props.left};
  }
`
const Card = styled.div`
  background-size: cover;
  width: 400px;
  height: auto;
  background-position: center;
  background-repeat: no-repeat;
  ${'' /* position: relative; */}
  margin: 0 auto;
  padding: 20px;
`
const Contents = styled.div`
  width: 100%;
  height: 100%;
  color: #f6ead6;
  font-weight: 500;
  background-color: rgba(19, 31, 25, 0.5);
  padding: 14px;
`
const ContentInfo = styled.div`
  margin-top: 8px;
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
  ${'' /* @media */}
  @media screen and (max-width:576px) {
    width: 300px;
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
  &:first-child {
    color: #b99362;
  }
`
const ActiveBackground = styled.div`
  position: fixed;
  background-color: rgba(34, 35, 34, 0.8);
  width: 100vw;
  height: 100vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: ${(props) => (props.isActive ? 'block' : 'none')};
`
const ActivePost = styled.div`
  z-index: 100;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`
const LoadingBackground = styled.div`
  position: fixed;
  z-index: 999;
  background-color: rgba(34, 35, 34, 0.8);
  width: 100vw;
  height: 100vh;
  top: 0;
  ${'' /* left: 25%; */}
  ${'' /* transform: translate(-25%, -50%); */}
  display:${(props) => (props.loading ? 'block' : 'none')};
`
const move = keyframes`
  0%,
   {
    left: 0;
    transform:rotate(0deg)
  }
  25%{
    left:400px;
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
  top:50%;
  left:25%;
  color:#B99362;
  background-clip: text;
  &:before {
    content: '';
    z-index:99;
    width: 80px;
    height: 80px;
    ${'' /* background-color: rgba(34, 35, 34, 0.8); */}
    background-image:url(${logo});
    background-size:cover;
    ${'' /* background-color: white; */}
    border-radius: 50%;
    position: absolute;
    top: -30%;
    left: 0;
    mix-blend-mode: difference;
    animation: ${move} 3s ease-in-out infinite;
  }
`
const Icon = styled.img`
  cursor: pointer;
  display: block;
  width: 20px;
  height: 20px;
  margin-rigth: 8px;
  transition: all 0.2s;
  &:hover {
    border: 2px solid #b99362;
    width: 35px;
    height: 35px;
    border-radius: 50%;
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
  &:hover {
    border: 1px solid #b99362;
  }
  @media screen and (max-width: 1279px) {
    width: 40px;
    height: 40px;
  }
`
const Note = styled.div`
  color: #b99362;
  width: 100px;
  margin-left: auto;
  font-size: 14px;
`
const ScrollDivide = styled.div`
  position: fixed;
  right: 0;
  top: calc(90% - 40px);
  z-index: 3;
`
const Scroll = styled.div`
  background-image: url(${top});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 50px;
  height: 50px;

  cursor: pointer;
`

function Activity() {
  const nameRef = useRef()
  const groupPassword = useRef()
  const cityRef = useRef()
  const mountainRef = useRef()
  const textRef = useRef()
  const [images, setImages] = useState()
  const [imageURLs, setImageURLs] = useState()
  const [downloadUrl, setDownloadUrl] = useState([])
  const [group, setGroup] = useState()
  const [groupID, setGroupID] = useState()
  const [isInfo, setIsInfo] = useState(false)
  const [step, setStep] = useState(false)
  const [isPreview, setIsPreview] = useState(true)
  const [date, setDate] = useState(new Date())
  const [complete, setComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const navigate = useNavigate()
  const value = useContext(UserContext)
  function getPhotoInfo(e) {
    setImages([...e.target.files])
    const newImageUrls = URL.createObjectURL(e.target.files[0])
    setImageURLs(newImageUrls)
  }

  useEffect(() => {
    async function getMyGroup() {
      try {
        const docRef = doc(db, 'groupLists', groupID)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const mountainData = docSnap.data()
          setGroup(mountainData)
        }
      } catch {
        console.log('No such document!')
      }
    }
    getMyGroup()
  }, [])

  const settingCard = async () => {
    if (
      nameRef.current.value == '' ||
      groupPassword.current.value == ''
      // images == undefined
    ) {
      value.alertPopup()
      value.setAlertContent('密碼及團名為必填資訊')
      setIsInfo(false)
    } else {
      setIsActive(true)
      // setComplete((current) => !current)
      setLoading(true)
      const userdocRef = doc(db, 'users', value.userUid)
      const docRef = doc(collection(db, 'groupLists'))
      const docSnap = await getDoc(userdocRef)
      const id = docRef.id
      if (images == undefined) {
        let newGroup = {
          groupName: nameRef.current.value ? nameRef.current.value : null,
          groupID: id,
          groupOwner: value.userUid,
          groupPhoto: null,
          groupCity: cityRef.current.value ? cityRef.current.value : null,
          groupMountain: mountainRef.current.value
            ? mountainRef.current.value
            : null,
          groupPassword: groupPassword.current.value,
          startDate:
            date.length > 0
              ? `${date[0].getFullYear()} -
              ${date[0].getMonth() + 1}
               -
              ${date[0].getDate()}`
              : null,
          endDate:
            date.length > 0
              ? `${date[1].getFullYear()} -
              ${date[1].getMonth() + 1}
               -
              ${date[1].getDate()}`
              : null,
          groupIntro: textRef.current.value ? textRef.current.value : null,
        }
        const newDocRef = setDoc(doc(db, 'groupLists', id), newGroup)
        setGroup(newGroup)
        setLoading(false)
        setIsInfo(true)
        setGroupID(id)
      } else {
        setGroupID(id)
        const imageRef = ref(
          storage,
          `images/${nameRef.current.value}_${id}_登山團封面照`,
        )
        uploadBytes(imageRef, images[0]).then(() => {
          console.log('檔案上傳成功')
          getDownloadURL(imageRef).then((url) => {
            setDownloadUrl(url)
            let newGroup = {
              groupName: nameRef.current.value ? nameRef.current.value : null,
              groupID: id,
              groupOwner: value.userUid,
              groupPhoto: url,
              groupCity: cityRef.current.value ? cityRef.current.value : null,
              groupMountain: mountainRef.current.value
                ? mountainRef.current.value
                : null,
              groupPassword: groupPassword.current.value,
              startDate:
                date.length > 0
                  ? `${date[0].getFullYear()} -
              ${date[0].getMonth() + 1}
               -
              ${date[0].getDate()}`
                  : null,
              endDate:
                date.length > 0
                  ? `${date[1].getFullYear()} -
              ${date[1].getMonth() + 1}
               -
              ${date[1].getDate()}`
                  : null,
              groupIntro: textRef.current.value ? textRef.current.value : null,
            }
            const newDocRef = setDoc(doc(db, 'groupLists', id), newGroup)
            setGroup(newGroup)
            setLoading(false)
            setIsInfo(true)
          })
        })
      }
    }
  }

  function backToSet() {
    value.alertPopup()
    value.setAlertContent('關閉後請重新設定資訊')
    setComplete(false)
    setIsActive(false)
    setIsInfo(false)
  }
  async function getMyGroup() {
    try {
      const docRef = doc(db, 'groupLists', groupID)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const mountainData = docSnap.data()
        setGroup(mountainData)
      }
    } catch {
      console.log('No such document!')
    }
  }

  async function handleShareButton() {
    if (navigator.share) {
      const shareData = {
        url: `https://find-friends-to-mountain.web.app/activity/${groupID}`,
        title: '『找山遊』邀請連結',
        text: '來參加我的登山團',
      }
      try {
        await navigator.share(shareData)
      } catch (err) {
        const { name, message } = err
        if (name === 'AbortError') {
          value.alertPopup()
          value.setAlertContent('您已取消分享此訊息')
        } else {
          console.log('發生錯誤', err)
        }
      }
    }
  }
  async function sendTheInfo() {
    const userdocRef = doc(db, 'users', value.userUid)
    const docSnap = await getDoc(userdocRef)
    //放進那個人的leadgroup
    if (docSnap.exists()) {
      const leadPersonData = docSnap.data()
      const oldLeadList = leadPersonData.leadGroup
      let newLeadList = []
      const leadGroupInfo = {
        groupID: groupID,
        groupName: nameRef.current.value,
        groupPhoto: downloadUrl ? downloadUrl : null,
        startDate:
          date.length > 0
            ? `${date[0].getFullYear()} -
              ${date[0].getMonth() + 1}
               -
              ${date[0].getDate()}`
            : null,
        endDate:
          date.length > 0
            ? `${date[1].getFullYear()} -
              ${date[1].getMonth() + 1}
               -
              ${date[1].getDate()}`
            : null,
      }
      console.log(leadGroupInfo)
      newLeadList.push(leadGroupInfo, ...oldLeadList)
      const updateLeadGroup = updateDoc(userdocRef, {
        leadGroup: newLeadList,
      })
      navigate(`/activity/${groupID}`)
    }
  }

  async function setTheContent() {
    setComplete((current) => !current)
    const groupRef = setDoc(doc(db, 'groupContents', groupID), {
      bedLists: [],
      carLists: [],
      groupOwner: value.userUid,
      memberList: [],
      todoList: [],
      itineraryList: {
        ['事項清單']: {
          name: '事項清單',
          items: [],
        },
        ['未完成']: {
          name: '未完成',
          items: [],
        },
        ['已解決']: {
          name: '已解決',
          items: [],
        },
      },
    })
    console.log(groupRef)
  }

  return (
    <>
      <LoadingBackground loading={loading}>
        <LoadingStyle></LoadingStyle>
      </LoadingBackground>
      <NoteBtn
        onMouseEnter={() => setIsPreview(true)}
        onMouseLeave={() => setIsPreview(false)}
      >
        {isPreview && (
          <>
            <PreviewArea>
              <Lists>
                <List>√ 群組密碼為必填資料</List>
                <List>√ 資料可於下個階段做修改，可先填寫基本資訊</List>
                <List>√ 填寫完畢後按下「完成設定」就可分享群組連結給朋友</List>
              </Lists>
            </PreviewArea>
          </>
        )}
      </NoteBtn>
      <Wrapper
        style={{
          opacity: isPreview ? '0.2' : '1',
        }}
      >
        <ScrollDivide>
          <Text>Top</Text>
          <Scroll
            onClick={() => {
              window.scrollTo({
                top: 0,
                right: 0,
                behavior: 'smooth',
              })
            }}
            id="myBtn"
          ></Scroll>
        </ScrollDivide>
        <Background></Background>
        <Divide
          flexDirection="column"
          justifyContent="space-evenly"
          marginTop="50px"
          alignItems="start"
          border="1px solid #F6EAD6"
          padding="20px 12px 20px 12px"
          style={{
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 0, 0, .25)',
            // backdropFilter: 'invert(80%)',
          }}
        >
          <Basic id="basic">
            <InputData>
              <InfoInput type="text" ref={nameRef} />
              <Underline></Underline>
              <Label
                style={{
                  color: '#B99362',
                }}
              >
                登山團名稱
              </Label>
              <Note>*名稱為必填</Note>
            </InputData>
            <InputData>
              <InfoInput
                tablet_fontSize="16px"
                type="text"
                placeholder="請輸入密碼"
                ref={groupPassword}
              />
              <Underline></Underline>

              <Label
                style={{
                  color: '#B99362',
                }}
              >
                群組密碼
              </Label>
              <Note>*密碼為必填</Note>
            </InputData>
            <InputData>
              <InfoInput type="text" placeholder="縣市" ref={cityRef} />
              <Underline></Underline>
              <Label>開團縣市</Label>
            </InputData>
            <InputData>
              <InfoInput type="text" placeholder="山名" ref={mountainRef} />
              <Underline></Underline>
              <Label>開團山名</Label>
            </InputData>
            <Text>團主版規</Text>
            <TextInput type="text" placeholder="版規規定" ref={textRef} />
            <Btn
              width="100px"
              margin="12px auto 20px auto"
              onClick={() => setStep(true)}
            >
              下一步
            </Btn>
          </Basic>
          {step && (
            <>
              <FlexDivide>
                <FormDate id="formdate">
                  <Text>開團日期</Text>
                  <CalendarContainer>
                    <Calendar
                      calendarType="US"
                      onChange={setDate}
                      value={date}
                      selectRange={true}
                    />
                  </CalendarContainer>

                  {date.length > 0 ? (
                    <>
                      <SubText>
                        活動開始：{date[0].getFullYear()}-
                        {date[0].getMonth() + 1}-{date[0].getDate()}
                      </SubText>
                      <SubText>
                        活動結束：{date[1].getFullYear()}-
                        {date[1].getMonth() + 1}-{date[1].getDate()}
                      </SubText>
                    </>
                  ) : (
                    <SubText>Select Date:{date.toDateString()}</SubText>
                  )}
                </FormDate>
                <Photo id="photo">
                  <Text>封面照片</Text>
                  <UploadPic>
                    {imageURLs ? (
                      <UploadPhoto src={imageURLs} alt="uploadImage" />
                    ) : (
                      <AfterUpload></AfterUpload>
                    )}
                  </UploadPic>
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
                </Photo>
              </FlexDivide>
              <Btn
                width="20%"
                tablet_width="20%"
                margin="20px auto 0 auto"
                borderRadius="8px"
                onClick={settingCard}
              >
                完成設定
              </Btn>
            </>
          )}
        </Divide>

        {isActive && (
          <>
            <ActiveBackground isActive={isActive}>
              <ActivePost isActive={isActive}>
                {isInfo && (
                  <>
                    {!complete && (
                      <Divide justifyContent="flex-start">
                        <Icon src={back} onClick={backToSet} />
                        <Btn
                          width="150px"
                          border="none"
                          fontSize="14px"
                          onClick={backToSet}
                        >
                          回上一步修改資訊
                        </Btn>
                      </Divide>
                    )}
                    {complete ? (
                      <Divide justifyContent="flex-start">
                        <Icon src={back} onClick={backToSet} />
                        <Btn
                          fontSize="14px"
                          width="250px"
                          border="none"
                          onClick={backToSet}
                        >
                          似乎要再考慮一下，回到上一步
                        </Btn>
                      </Divide>
                    ) : (
                      <Divide justifyContent="flex-start">
                        <Icon src={check} onClick={setTheContent} />
                        <Btn
                          fontSize="14px"
                          width="120px"
                          border="none"
                          onClick={setTheContent}
                        >
                          確定資訊
                        </Btn>
                      </Divide>
                    )}
                    {group && (
                      <Card
                        style={{
                          backgroundImage: `url(${group.groupPhoto})`,
                        }}
                      >
                        <Contents>
                          <ContentInfo>團名：{group.groupName}</ContentInfo>
                          <ContentInfo>
                            {group.groupCity}｜{group.groupMountain}
                          </ContentInfo>
                          <Divide>
                            <ContentInfo>
                              日期：{group.startDate} ~ {group.endDate}
                            </ContentInfo>
                          </Divide>
                          <ContentInfo>
                            團內版規：{group.groupIntro}
                          </ContentInfo>
                        </Contents>
                      </Card>
                    )}

                    {complete && (
                      <>
                        <Divide justifyContent="flex-start" marginTop="12px">
                          <Icon src={share} onClick={handleShareButton} />
                          <Btn
                            fontSize="14px"
                            width="250px"
                            border="none"
                            onClick={handleShareButton}
                          >
                            分享連結，邀請朋友來加入登山團
                          </Btn>
                        </Divide>

                        <Btn
                          height="50px"
                          color="#B99362"
                          width="250px"
                          margin="12px auto 0px"
                          padding="8px"
                          onClick={sendTheInfo}
                          borderRadius="8px"
                        >
                          前往下一步輸入更多團內資訊
                        </Btn>
                      </>
                    )}
                  </>
                )}
              </ActivePost>
            </ActiveBackground>
          </>
        )}
      </Wrapper>
    </>
  )
}

export default Activity
