import React, { useState, useEffect, useRef, useContext } from 'react'
import styled, { keyframes } from 'styled-components'
import firebaseConfig, { db, storage } from '../../utils/firebase'
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  setDoc,
  getDocs,
  arrayRemove,
} from 'firebase/firestore'
import ReactTooltip from 'react-tooltip'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Link, useNavigate } from 'react-router-dom'
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
import alert from './alert.png'
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
    ${'' /* ${(props) => props.hideOnMobile && 'display: none;'} */}
  }
  @media screen and (max-width: 767px) {
    height: 360px;
    ${'' /* ${(props) => props.hideOnMobile && 'display: none;'} */}
  }
`
const MainInfo = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 24px;
  padding: 14px;
  position: absolute;
  left: 50%;
  ${'' /* bottom: 0; */}
  top:90%;
  transform: translate(-50%, -90%);
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 1279px) {
  }
  @media screen and (max-width: 576px) {
  }
`
const BackColor = styled.div`
  background-color: ${(props) => props.backgroundColor || '#ac6947'};
  width: ${(props) => props.width || '0px'};
  height: ${(props) => props.height || '0px'};
  z-index: ${(props) => props.zIndex || '-1'};
  position: ${(props) => props.position || 'absolute'};
  top: ${(props) => props.top || '0px'};
  left: ${(props) => props.left || '0px'};
  right: ${(props) => props.right || '0px'};
  @media screen and (max-width: 1279px) {
    background-color: ${(props) => props.tablet_backgroundColor || '#ac6947'};
    width: ${(props) => props.tablet_width || props.width};
    height: ${(props) => props.tablet_height || props.height};
    z-index: ${(props) => props.tablet_zIndex || '-1'};
    position: ${(props) => props.tablet_position || props.position};
    top: ${(props) => props.tablet_top || props.top};
    left: ${(props) => props.tablet_left || props.left};
    right: ${(props) => props.tablet_right || props.right};
  }
`
const Wrapper = styled.div`
  max-width: calc(1320px - 40px);
  ${'' /* padding-left: 20px;
  padding-right: 20px; */}
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
  ${'' /* position: absolute;
  top: 0;
  left: 0; */}
  position:relative;
  width: 100%;
  height: 560px;
  @media screen and (max-width: 1279px) {
    height: 480px;
  }
  @media screen and (max-width: 767px) {
    height: 360px;
  }
`
const Divide = styled.div`
  display: flex;
  position: ${(props) => props.position || 'none'};
  justify-content: ${(props) => props.justifyContent || 'space-between'};
  align-items: ${(props) => props.alignItems || 'center'};
  flex-direction: ${(props) => props.flexDirection || 'row'};
  margin-bottom: ${(props) => props.marginBottom || '0px'};
  margin-top: ${(props) => props.marginTop || '0px'};
  margin-left: ${(props) => props.marginLeft || '0px'};
  padding: ${(props) => props.padding || '0 0 0 0'};
  margin-right: ${(props) => props.marginRight || '0px'};
  flex-wrap: ${(props) => props.flexWrap || 'no-wrap'};
  width: ${(props) => props.width || 'none'};
  min-height: ${(props) => props.minHeight || 'none'};
  @media screen and (max-width: 1279px) {
    flex-direction: ${(props) =>
      props.tablet_flexDirection || props.flexDirection};
    width: ${(props) => props.tablet_width || props.width};
    justify-content: ${(props) =>
      props.tablet_justifyContent || props.justiftContent};
    align-items: ${(props) => props.tablet_alignItems || props.alignItems};
    margin-top: ${(props) => props.tablet_marginTop || props.marginTop};
    min-height: ${(props) => props.minHeight || props.minHeight};
    margin-left: ${(props) => props.tablet_marginLeft || props.marginLeft};
    margin-right: ${(props) => props.tablet_marginRight || props.marginRight};
  }
  @media screen and (max-width: 767px) {
    flex-direction: ${(props) =>
      props.mobile_flexDirection || props.tablet_flexDirection};
    width: ${(props) => props.mobile_width || props.tablet_width};
    justify-content: ${(props) =>
      props.mobile_justifyContent || props.tablet_justifyContent};
    align-items: ${(props) =>
      props.mobile_alignItems || props.tablet_alignItems};
    margin-top: ${(props) => props.mobile_marginTop || props.tablet_marginTop};
    margin-bottom: ${(props) =>
      props.mobile_marginBottom || props.tablet_marginBottom};
  }
`
const DivideBorder = styled.div`
  position: ${(props) => props.position || 'none'};
  width: ${(props) => props.width || '0px'};
  height: ${(props) => props.height || 'auto'};
  ${'' /* border: ${(props) => props.border || '4px solid #ac6947'}; */}
  margin-top: ${(props) => props.marginTop || '0px'};
  margin-left: ${(props) => props.marginLeft || '0px'};
  border-radius: 24px;
  padding: ${(props) => props.padding || '0 0 0 0'};
  min-height: ${(props) => props.minHeight || '0px'};
  @media screen and (max-width: 1279px) {
    width: ${(props) => props.tablet_width || props.width};
    margin-top: ${(props) => props.tablet_marginTop || props.marginTop};
  }
  @media screen and (max-width: 767px) {
    width: ${(props) => props.mobile_width || props.tablet_width};
    margin-top: ${(props) => props.mobile_marginTop || props.tablet_marginTop};
  }
`
const Text = styled.div`
  color: ${(props) => props.color || '#f6ead6'};
  font-size: ${(props) => props.fontSize || '16px'};
  font-weight: ${(props) => props.fontWeight || '400'};
  margin: ${(props) => props.margin || '0px 0px 0px 0px'};
  text-align: ${(props) => props.textAlign || 'center'};
  position: ${(props) => props.position || 'none'};
  top: ${(props) => props.top || 'none'};
  left: ${(props) => props.left || 'none'};
  @media screen and (max-width: 1279px) {
    font-size: ${(props) => props.tablet_fontSize || props.fontSize};
    text-align: ${(props) => props.tablet_textAlign || props.textAlign};
    margin: ${(props) => props.tablet_margin || props.margin};
    top: ${(props) => props.tablet_top || props.top};
    left: ${(props) => props.tablet_left || props.left};
  }
  @media screen and (max-width: 767px) {
    font-size: ${(props) => props.mobile_fontSize || props.tablet_fontSize};
    margin: ${(props) => props.mobile_margin || props.tablet_margin};
    top: ${(props) => props.mobile_top || props.tablet_top};
    left: ${(props) => props.mobile_left || props.tablet_left};
    text-align: ${(props) => props.mobile_textAlign || props.tablet_textAlign};
  }
`
const MemberDefault = styled.div`
  background-image: url(${memberDefault});
  background-size: cover;
  border-radius: 50%;
  width: 60px;
  height: 60px;
`
const MemberPic = styled.img`
  cursor: pointer;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin: 8px;
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
const Btn = styled.button`
  color: ${(props) => props.color || '#F6EAD6'};
  width: ${(props) => props.width || '0px'};
  height: ${(props) => props.height || '40px'};
  border-radius: ${(props) => props.borderRadius || '0'};
  border: ${(props) => props.border || '1px solid #F6EAD6'};
  padding: ${(props) => props.padding || 'none'};
  margin: ${(props) => props.margin || '0px 0px 0px 0px'};
  position: ${(props) => props.position || 'none'};
  top: ${(props) => props.top || 'none'};
  left: ${(props) => props.left || 'none'};
  right: ${(props) => props.right || 'none'};
  bottom: ${(props) => props.bottom || 'none'};
  line-height: ${(props) => props.lineHeight || 'none'};
  font-size: ${(props) => props.fontSize || '16px'};
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
    border: ${(props) => props.tablet_border || props.border};
  }
  @media screen and (max-width: 767px) {
    width: ${(props) => props.mobile_width || props.tablet_width};
    height: ${(props) => props.mobile_height || props.tablet_height};
    padding: ${(props) => props.mobile_padding || props.tablet_padding};
    margin: ${(props) => props.mobile_margin || props.tablet_margin};
    font-size: ${(props) => props.mobile_fontSize || props.tablet_fontSize};
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
const InfoInput = styled.input`
  width: ${(props) => props.width || '0px'};
  height: ${(props) => props.height || '40px'};
  background-color: ${(props) => props.backgroundColor || '#f6ead6'};
  margin-top: ${(props) => props.marginTop || '0px'};
  margin-left: ${(props) => props.marginLeft || '0px'};
  padding: ${(props) => props.padding || '8px'};
  color: ${(props) => props.color || '#222322'};
  font-size: ${(props) => props.fontSize || '16px'};
  border-bottom: ${(props) => props.borderBottom || 'none'};

  box-shadow: ${(props) => props.boxShadow || '0 0 10px rgba(0, 0, 0, 0.6)'};
  @media screen and (max-width: 1279px) {
    font-size: ${(props) => props.tablet_fontSize || props.fontSize};
    width: ${(props) => props.tablet_width || props.width};
    height: ${(props) => props.tablet_height || props.height};
  }
  @media screen and (max-width: 767px) {
    font-size: ${(props) => props.mobile_fontSize || props.tablet_fontSize};
    width: ${(props) => props.mobile_width || props.tablet_width};
    height: ${(props) => props.mobile_height || props.tablet_height};
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
const FileLabel = styled.label`
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -10%);
  display: inline-block;
  cursor: pointer;
  color: #f6ead6;
  text-align: center;
  font-size: 20px;
  margin: 12px auto;
  @media screen and (max-width: 767px) {
    font-size: 14px;
  }
`
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
const SrcImage = styled.img`
  width: ${(props) => props.width || '0px'};
  height: ${(props) => props.height || '0px'};
  object-fit: ${(props) => props.objectFit || 'cover'};
`
const Intro = styled.div`
  text-align: left;
  color: #f6ead6;
  width: 100%;
  max-height: 200px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
    ${'' /* background: #f6ead6;
    border-radius: 4px;
    width: 1px; */}
  }
  &::-webkit-scrollbar-track-piece {
    background: #f6ead6;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.2);
    border: 1px solid #f6ead6;
  }
  &::-webkit-scrollbar-track {
    box-shadow: transparent;
  }
  @media screen and (max-width: 767px);
`
const NewIntroWrapper = styled.textarea`
  width: 100%;
  height: 200px;
  resize: none;
  text-align: left;
  color: #f6ead6;
  background: transparent;
`
const NoteBox = styled.div`
  position: relative;
  margin: 0 5px 10px 5px;
  padding: 20px;
  max-width: 100%;
  min-height: 240px;
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
const ScrollBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  max-height: 200px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    ${'' /* display: none; */}
    background: transparent;
    border-radius: 4px;
    width: 1px;
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
`
const Category = styled.div`
  width: calc(100% / 3);
  text-align: center;
  padding: 12px;
  font-size: 20px;
  letter-spacing: 2px;
  cursor: pointer;
  padding-bottom: 4px;
  border-bottom: 2px solid #875839;
  transition: all 0.3s;

  opacity: ${(props) => (props.$isActive ? 1 : 0.2)};
  text-shadow: ${(props) =>
    props.$isActive ? '1px 1px 20px #F6EAD6' : 'none'};
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
`
const ActivityContent = () => {
  let url = window.location.href
  const newUrl = url.split('/activity/')
  const groupID = newUrl[1]
  const [contentID, setContentID] = useState()
  const [groupData, setGroupData] = useState()
  const [contentData, setContentData] = useState()
  const authRef = useRef()
  const [auth, setAuth] = useState(false)
  const [content, setContent] = useState(false)
  const [ownerName, setOwnerName] = useState()
  const [clickID, setClickID] = useState()
  const [join, setJoin] = useState()
  const [member, setMember] = useState()
  const [profile, setProfile] = useState()
  const [ownerAuth, setOwnerAuth] = useState() //ownerID
  const [memberAuth, setMemberAuth] = useState() //不是owner的id
  const [online, setOnline] = useState(false)
  const [ownerProfile, setOwnerProfile] = useState()
  const [isHovering, setIsHovering] = useState(false)
  const [isEditable, setIsEditable] = useState(false)
  const [isNote, setIsNote] = useState(false)
  const [comment, setComment] = useState()
  const newNameRef = useRef()
  const newCityRef = useRef()
  const newMountainRef = useRef()
  const newIntro = useRef()
  const [newStart, setNewStart] = useState()
  const [newEnd, setNewEnd] = useState()
  const [images, setImages] = useState()
  const [imageURLs, setImageURLs] = useState()
  const [downloadUrl, setDownloadUrl] = useState([])
  const [loading, setLoading] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const navigate = useNavigate()
  const value = useContext(UserContext)

  useEffect(() => {
    if (value.userAuth === null) {
      value.alertPopup()
      value.setAlertContent('您尚未登入會員')
      navigate('/login')
    } else {
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
          const data = docSnap.data()
          const memberData = data.memberList
          setContentData(data)
          setMember(memberData)
        }
      } catch {
        console.log('No such document!')
      }
    }
    let newGetPromise = [getGroupInfo(), getContentInfo(), getOwnerProfile()]
    async function getPromise() {
      await Promise.all(newGetPromise)
    }

    getPromise()
    const unsub = onSnapshot(doc(db, 'groupContents', groupID), (doc) => {
      const data = doc.data()
      if (data == undefined) {
        return //404 not
      }
      const memberData = data.memberList
      const ownerData = data.groupOwner
      const todotData = data.todoList
      if (todotData !== undefined) {
        console.log('有人留言')
      }

      setMember(memberData)
      setComment(todotData)
      //   if (memberID.isLogged == true) {
      //     setOnline(true)
    })
  }, [value.userAuth, groupID, contentID])

  async function testAuth() {
    // setLoading(true)
    const groupContent = doc(db, 'groupContents', groupID)
    const groupDoc = await getDoc(groupContent)
    if (groupDoc.exists()) {
      const groupOwnerInfo = groupDoc.data()
      const currgroupOwner = groupOwnerInfo.groupOwner
      const currMember = groupOwnerInfo.memberList
      if (value.userUid == currgroupOwner) {
        setAuth(false)
        setContent(true)
        setOwnerAuth(value.userUid)
        getOwnerProfile(currgroupOwner)
      } else if (value.userUid !== currgroupOwner) {
        setOwnerAuth(null)
        if (currMember.length == 0) {
          console.log(123)
          setAuth(true)
          setContent(false)
          setMemberAuth(value.userUid)
          getOwnerProfile(currgroupOwner)
        } else if (currMember.length !== 0) {
          function isSecondTime(person) {
            return person.joinID == value.userUid
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
    // setTimeout(() => setLoading(false), 3000)
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
    if (authRef.current.value !== groupData.groupPassword) {
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
        setJoin(getjoinData)
        let newjoinList = []
        const joinInfo = {
          groupID: groupID,
          groupName: groupData.groupName,
          groupPhoto: groupData.groupPhoto,
          startDate: groupData.startDate,
          endDate: groupData.endDate,
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

    const groupContent = doc(db, 'groupContents', groupID)
    const memberSnap = await getDoc(groupContent)
    if (memberSnap.exists() && joinSnap.exists()) {
      const joinPic = joinSnap.data()
      const joinPicURL = joinPic.photoURL
      let newMember = []
      const newMemberInfo = {
        joinName: value.userName,
        joinPic: joinPicURL,
        joinID: value.userUid,
        isLogged: true,
        isEditableAuth: false,
      }
      newMember.push(newMemberInfo, ...member)
      const updateMember = await updateDoc(groupContent, {
        memberList: newMember,
      })
      setMember(newMember)
    }
  }

  async function updateTheGroup() {
    let newPromise = [getJoinerData(), updateMemberList()]
    await Promise.all(newPromise)
  }
  async function seeTheProfile(index) {
    const profileID = member[index].joinID
    setClickID(profileID)
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
  async function seeOwnerProfile() {
    setProfile()
  }
  function getPhotoInfo(e) {
    setImages([...e.target.files])
    const newImageUrls = URL.createObjectURL(e.target.files[0])
    setImageURLs(newImageUrls)
  }
  async function editFunction() {
    // setLoading(true)
    let newPromise = [sendUpdateInfo(), editGroupInfo(), findMemberData()]
    // Promise.all(newPromise).then(() => setTimeout(setLoading(false), 5000))
  }
  async function sendUpdateInfo() {
    const imageRef = ref(
      storage,
      `images/${newNameRef.current.value}_${groupID}_登山團封面照`,
    )
    uploadBytes(imageRef, images[0]).then(() => {
      getDownloadURL(imageRef).then((url) => {
        setDownloadUrl(url)
        let newFile = {
          groupID: groupID,
          groupName: newNameRef.current.value,
          groupCity: newCityRef.current.value,
          groupPhoto: images[0] == undefined ? groupData.groupPhoto : url,
          startDate: newStart == undefined ? groupData.startDate : newStart,
          endDate: newEnd == undefined ? groupData.endDate : newEnd,
          groupMountain: newMountainRef.current.value,
          groupIntro: groupData.groupIntro,
          groupOwner: value.userUid,
          groupPassword: groupData.groupPassword,
        }
        console.log(newFile)
        const newDocRef = updateDoc(doc(db, 'groupLists', groupID), newFile)
        setGroupData(newFile)
        setIsEditable(false)
      })
    })
  }
  async function editGroupInfo() {
    try {
      const docRef = doc(db, 'users', ownerAuth)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const userData = docSnap.data()
        const oldLeadGroup = userData.leadGroup
        let index = oldLeadGroup.findIndex((c) => c.groupID === groupID)
        const leadGroupInfo = {
          groupID: groupID,
          groupName: newNameRef.current.value,
          groupPhoto: groupData.groupPhoto,
          startDate: newStart == undefined ? groupData.startDate : newStart,
          endDate: newEnd == undefined ? groupData.endDate : newEnd,
        }
        oldLeadGroup.splice(index, 1, leadGroupInfo)
        const updateLeadGroup = updateDoc(docRef, {
          leadGroup: oldLeadGroup,
        })
      }
    } catch {
      console.log('No such document!')
    }
  }
  async function findMemberData() {
    try {
      let thisID
      member.map((list, index) => {
        thisID = member[index].joinID
      })
      const thisIDRef = doc(db, 'users', thisID)
      const getRef = await getDoc(thisIDRef)
      if (getRef.exists()) {
        const getRefData = getRef.data()
        const getJoinData = getRefData.joinGroup
        let eachIndex = getJoinData.findIndex((c) => c.groupID === groupID)
        const joinGroupInfo = {
          groupID: groupID,
          groupName: newNameRef.current.value,
          groupPhoto: downloadUrl,
          startDate: newStart == undefined ? groupData.startDate : newStart,
          endDate: newEnd == undefined ? groupData.endDate : newEnd,
        }
        getJoinData.splice(eachIndex, 1, joinGroupInfo)
        console.log(getJoinData)
        const updatejoinGroup = updateDoc(thisIDRef, {
          joinGroup: getJoinData,
        })
      }
    } catch {
      console.log('No such document!')
    }
  }

  async function checkNote() {
    try {
      const docRef = doc(db, 'groupLists', groupID)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const updateLeadGroup = setDoc(
          docRef,
          {
            groupIntro: newIntro.current.value,
          },
          { merge: true },
        )
      }
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
              <PopImage></PopImage>
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
            {groupData && (
              <>
                {isEditable ? (
                  <>
                    <BackCover
                      // hideOnMobile
                      style={{
                        border: '1px solid white',
                        backgroundImage: imageURLs ? `url(${imageURLs})` : null,
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
                          // color="#AC6947"
                          fontWeight="400"
                          tablet_fontSize="20px"
                          mobile_fontSize="16px"
                        >
                          團名：
                        </Text>
                        {isEditable ? (
                          <InfoInput
                            backgroundColor="transparent"
                            width="150px"
                            fontSize="20px"
                            tablet_fontSize="20px"
                            mobile_fontSize="16px"
                            boxShadow="none"
                            color="#F6EAD6"
                            borderBottom="1px solid #F6EAD6"
                            ref={newNameRef}
                            style={{
                              opacity: 0.5,
                            }}
                            defaultValue={
                              groupData.groupName ? groupData.groupName : '團名'
                            }
                          />
                        ) : (
                          <Text
                            fontSize="20px"
                            tablet_fontSize="20px"
                            mobile_fontSize="16px"
                          >
                            {groupData.groupName ? groupData.groupName : '團名'}
                          </Text>
                        )}
                      </Divide>
                      <Divide marginBottom="12px">
                        <Text
                          margin="0px 0px 0px 0px"
                          fontSize="24px"
                          // color="#AC6947"
                          fontWeight="400"
                          tablet_fontSize="20px"
                          mobile_fontSize="16px"
                          mobile_margin="0 0 0 0"
                        >
                          地點：
                        </Text>
                        {isEditable ? (
                          <Divide>
                            <InfoInput
                              backgroundColor="transparent"
                              width="80px"
                              fontSize="20px"
                              tablet_fontSize="20px"
                              mobile_fontSize="16px"
                              boxShadow="none"
                              color="#F6EAD6"
                              borderBottom="1px solid #F6EAD6"
                              style={{
                                opacity: 0.5,
                              }}
                              ref={newCityRef}
                              defaultValue={
                                groupData.groupCity
                                  ? groupData.groupCity
                                  : '城市'
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
                              style={{
                                opacity: 0.5,
                              }}
                              ref={newMountainRef}
                              defaultValue={
                                groupData.groupMountain
                                  ? groupData.groupMountain
                                  : '山名'
                              }
                            />
                          </Divide>
                        ) : (
                          <Text
                            fontSize="20px"
                            margin="0 8px 0 0"
                            tablet_fontSize="20px"
                            mobile_fontSize="16px"
                          >
                            {groupData.groupCity ? groupData.groupCity : '城市'}
                            |
                            {groupData.groupMountain
                              ? groupData.groupMountain
                              : '山名'}
                          </Text>
                        )}
                      </Divide>
                      <Divide mobile_marginBottom="12px">
                        <Text
                          fontSize="24px"
                          // color="#AC6947"
                          fontWeight="400"
                          margin="0 0 0 0px"
                          tablet_fontSize="20px"
                          mobile_fontSize="16px"
                          tablet_margin="0 0px 0 0px"
                          mobile_margin="0 0 0 0"
                        >
                          日期：
                        </Text>
                        {isEditable ? (
                          <>
                            <DateInput
                              type="date"
                              onChange={(e) => setNewStart(e.target.value)}
                              defaultValue={groupData.startDate}
                              style={{
                                opacity: 0.5,
                              }}
                            />
                            <DateInput
                              type="date"
                              onChange={(e) => setNewEnd(e.target.value)}
                              defaultValue={groupData.endDate}
                              style={{
                                opacity: 0.5,
                              }}
                            />
                          </>
                        ) : (
                          <Text
                            fontSize="20px"
                            tablet_fontSize="16px"
                            mobile_fontSize="14px"
                          >
                            {groupData.startDate} ~ {groupData.endDate}
                          </Text>
                        )}
                      </Divide>
                      {ownerAuth !== null && (
                        <>
                          {isEditable && (
                            <Divide marginTop="20px" flexDirection="column">
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
                          )}
                        </>
                      )}
                    </MainInfo>
                  </>
                ) : (
                  <>
                    <BackCover
                      style={{
                        backgroundImage: `url(${groupData.groupPhoto})`,
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
                          // color="#AC6947"
                          fontWeight="400"
                          tablet_fontSize="20px"
                          mobile_fontSize="16px"
                        >
                          團名：
                        </Text>
                        {isEditable ? (
                          <InfoInput
                            backgroundColor="transparent"
                            width="150px"
                            fontSize="20px"
                            tablet_fontSize="20px"
                            mobile_fontSize="16px"
                            boxShadow="none"
                            // color="#F6EAD6"
                            borderBottom="1px solid #F6EAD6"
                            ref={newNameRef}
                            style={{
                              opacity: 0.5,
                            }}
                            defaultValue={
                              groupData.groupName ? groupData.groupName : '團名'
                            }
                          />
                        ) : (
                          <Text
                            fontSize="20px"
                            tablet_fontSize="20px"
                            mobile_fontSize="16px"
                          >
                            {groupData.groupName ? groupData.groupName : '團名'}
                          </Text>
                        )}
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
                        {isEditable ? (
                          <Divide>
                            <InfoInput
                              backgroundColor="transparent"
                              width="80px"
                              fontSize="20px"
                              tablet_fontSize="20px"
                              mobile_fontSize="16px"
                              boxShadow="none"
                              color="#F6EAD6"
                              borderBottom="1px solid #F6EAD6"
                              style={{
                                opacity: 0.5,
                              }}
                              ref={newCityRef}
                              defaultValue={
                                groupData.groupCity
                                  ? groupData.groupCity
                                  : '城市'
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
                              style={{
                                opacity: 0.5,
                              }}
                              ref={newMountainRef}
                              defaultValue={
                                groupData.groupMountain
                                  ? groupData.groupMountain
                                  : '山名'
                              }
                            />
                          </Divide>
                        ) : (
                          <Text
                            fontSize="20px"
                            margin="0 8px 0 0"
                            tablet_fontSize="20px"
                            mobile_fontSize="16px"
                          >
                            {groupData.groupCity ? groupData.groupCity : '城市'}
                            |
                            {groupData.groupMountain
                              ? groupData.groupMountain
                              : '山名'}
                          </Text>
                        )}
                      </Divide>
                      <Divide mobile_marginBottom="12px">
                        <Text
                          fontSize="24px"
                          fontWeight="400"
                          margin="0 0 0 0px"
                          tablet_fontSize="20px"
                          mobile_fontSize="16px"
                          tablet_margin="0 0px 0 0px"
                          mobile_margin="0 0 0 0"
                        >
                          日期：
                        </Text>
                        {isEditable ? (
                          <>
                            <DateInput
                              type="date"
                              onChange={(e) => setNewStart(e.target.value)}
                              defaultValue={groupData.startDate}
                              style={{
                                opacity: 0.5,
                              }}
                            />
                            <DateInput
                              type="date"
                              onChange={(e) => setNewEnd(e.target.value)}
                              defaultValue={groupData.endDate}
                              style={{
                                opacity: 0.5,
                              }}
                            />
                          </>
                        ) : (
                          <Text
                            fontSize="20px"
                            tablet_fontSize="16px"
                            mobile_fontSize="14px"
                          >
                            {groupData.startDate} ~ {groupData.endDate}
                          </Text>
                        )}
                      </Divide>
                      {ownerAuth !== null && !isEditable && (
                        <EditBtn
                          width="140px"
                          borderBottom="1px solid #F6EAD6"
                          padding="8px 12px"
                          marginTop="20px"
                          mobile_fontSize="12px"
                          mobile_width="100px"
                          mobile_padding="8px"
                          mobile_marginTop="10px"
                          onClick={() => {
                            setIsEditable(true)
                            setIsHovering(false)
                          }}
                          onMouseEnter={() => setIsHovering(true)}
                          onMouseLeave={() => setIsHovering(false)}
                        >
                          【修改基本資訊】
                        </EditBtn>
                      )}
                    </MainInfo>
                  </>
                )}
              </>
            )}
          </NewWrapper>
          <Wrapper>
            <ScrollDivide>
              {comment && (
                <Icon
                  style={{
                    position: 'absolute',
                    backgroundImage: `url(${alert})`,
                    width: '30px',
                    height: '30px',
                    top: '-35px',
                  }}
                ></Icon>
              )}

              <Scroll onClick={() => setOnline((current) => !current)}></Scroll>
              {online && (
                <Divide
                  style={{
                    position: 'absolute',
                    right: '20px',
                    bottom: '80px',
                  }}
                >
                  <TodoList
                    Text={Text}
                    DivideBorder={DivideBorder}
                    Divide={Divide}
                    InfoInput={InfoInput}
                    Btn={Btn}
                    BackColor={BackColor}
                    SrcImage={SrcImage}
                  />
                </Divide>
              )}
            </ScrollDivide>
            <Divide alignItems="start" justiftContent="space-around">
              <Divide marginBottom="12px" width="20%" flexDirection="column">
                <NoteBox>
                  <Divide width="100%" marginBottom="24px">
                    <Text
                      textAlign="left"
                      mobile_fontSize="14px"
                      color="#B99362"
                    >
                      團長提醒
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
                  <Divide>
                    {groupData && (
                      <>
                        {isNote ? (
                          <>
                            <NewIntroWrapper
                              ref={newIntro}
                              defaultValue={groupData.groupIntro}
                            ></NewIntroWrapper>
                          </>
                        ) : (
                          <>
                            <Intro>{groupData.groupIntro}</Intro>
                          </>
                        )}
                      </>
                    )}
                  </Divide>
                </NoteBox>
              </Divide>
              <Divide width="75%" flexDirection="column" alignItems="start">
                <Divide
                  width="100%"
                  justifyContent="flex-start"
                  alignItems="end"
                >
                  {ownerProfile && (
                    <Divide
                      flexDirection="column"
                      width="20%"
                      alignItems="start"
                    >
                      <Text margin="0x 0x 8px 0px">{ownerProfile.name}</Text>
                      <MemberPic
                        src={ownerProfile.photoURL}
                        onClick={seeOwnerProfile}
                      />
                    </Divide>
                  )}
                  {member && member.length > 0 ? (
                    Object.values(member).map((item, index) => {
                      return (
                        <Divide
                          width="10%"
                          flexDirection="column"
                          tablet_flexDirection="column"
                          mobile_flexDirection="column"
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
                    })
                  ) : (
                    <>
                      <MemberDefault></MemberDefault>
                    </>
                  )}
                </Divide>
                <Divide
                  marginTop="24px"
                  width="auto"
                  flexDirection="column"
                  alignItems="start"
                  style={{
                    minWidth: '300px',
                    minHeight: '100px',
                    padding: '12px 20px',
                    borderRadius: '24px',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                  }}
                >
                  {!profile && (
                    <>
                      <Text
                        fontSize="20px"
                        tablet_fontSize="14px"
                        margin="0 0 12px 0"
                        color=" #B99362"
                      >
                        團長清單
                      </Text>
                      <Divide>
                        {ownerProfile?.equipment.length > 0 ? (
                          ownerProfile.equipment.map((item, index) => {
                            return (
                              <>
                                <Divide
                                  key={index}
                                  flexDirection="column"
                                  style={{
                                    Width: 'calc(100% / 3)',
                                    margin: 'auto 6px',
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
                          <Text>團主目前尚無清單</Text>
                        )}
                      </Divide>
                    </>
                  )}
                  {profile && (
                    <>
                      <Text
                        tablet_fontSize="14px"
                        margin="0px 0 12px 0"
                        color=" #B99362"
                      >
                        {profile.name}的清單
                      </Text>
                      <Divide>
                        {profile.equipment.length > 0 ? (
                          profile.equipment.map((item, index) => {
                            return (
                              <>
                                <Divide
                                  key={index}
                                  flexDirection="column"
                                  style={{
                                    Width: 'calc(100% / 3)',
                                    margin: 'auto 6px',
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
                          <Text>{profile.name}目前尚無清單</Text>
                        )}
                      </Divide>
                    </>
                  )}
                </Divide>
              </Divide>
            </Divide>
            <Divide marginTop="50px">
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
            {currentPage == 0 && (
              <Itinerary
                Text={Text}
                DivideBorder={DivideBorder}
                Divide={Divide}
                InfoInput={InfoInput}
                Btn={Btn}
                BackColor={BackColor}
                SrcImage={SrcImage}
              />
            )}
            {currentPage == 1 && (
              <Accommodation
                Text={Text}
                DivideBorder={DivideBorder}
                Divide={Divide}
                InfoInput={InfoInput}
                Btn={Btn}
                BackColor={BackColor}
                SrcImage={SrcImage}
              />
            )}
            {currentPage == 2 && (
              <Cars
                Text={Text}
                DivideBorder={DivideBorder}
                Divide={Divide}
                InfoInput={InfoInput}
                Btn={Btn}
                BackColor={BackColor}
                SrcImage={SrcImage}
              />
            )}
          </Wrapper>
        </>
      )}
    </>
  )
}

export default ActivityContent
