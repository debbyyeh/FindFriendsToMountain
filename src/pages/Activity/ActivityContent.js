import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
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
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Link, useNavigate } from 'react-router-dom'
import memberDefault from './memberDefault.png'
import logo from './Mountain.png'
import top from './top.png'
import lock from './Lock.png'
import equipments from '../../equipments/equipments'
import TodoList from '../../components/Todolist/TodoList'
import Itinerary from '../../components/Itinerary/Itinerary'
import Cars from '../../components/Car/Cars'
import Accommodation from '../../components/Accommodation/Accommodation'
import { UserContext } from '../../utils/userContext'

const BackCover = styled.div`
  width: 100%;
  height: 560px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  top: 0;
  left: 0;
  border-radius: 0 0 0 100px;
  ${'' /* margin-bottom: 30px; */}
  opacity: 0.7;
  @media screen and (max-width: 1279px) {
    height: 480px;
    ${'' /* ${(props) => props.hideOnMobile && 'display: none;'} */}
  }
`
// const BackCoverMB = styled(BackCover)`
//   ${(props) => props.hideOnDesktop && 'display: none;'}

//   @media screen and (max-width: 1279px) {
//     display: block;
//     height: 480px;
//     ${'' /* padding-left: -20px;
//     padding-right: -20px; */}
//     ${'' /* margin-bottom: 30px; */}
//   }
// `

const MainInfo = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 24px;
  padding: 14px;
  position: absolute;
  left: 50%;
  top: 80%;
  transform: translate(-50%, -80%);
  width: calc(100% - 200px);
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 767px) {
    top: 90%;
    transform: translate(-50%, -90%);
  }
  @media screen and (max-width: 576px) {
    width: 90%;
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
const WidthContainer = styled.div`
  height: auto;
  max-width: 150px;
  overflow-x: scroll;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
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

  @media screen and (max-width: 767px) {
    ${'' /* flex-wrap: no-wrap; */}
    over-flow: scroll;
  }
`
const Wrapper = styled.div`
  max-width: calc(1320px - 40px);
  padding-left: 20px;
  padding-right: 20px;
  margin: 0 auto;
  font-family: Poppins;
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
  border: ${(props) => props.border || '4px solid #ac6947'};
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
const OwnerText = styled.span``
const UnderCover = styled.div`
  width: 100%;
  min-height: 150px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 24px;
  padding: 16px;

  ${'' /* position: relative; */}
  @media screen and (max-width: 1279px) {
    ${'' /* width: 100%; */}
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
  border-radius: 50%;
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin: 8px;
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

const ActiveBackground = styled.div`
  ${'' /* position: absolute; */}
  ${'' /* top: 50%; */}
  ${'' /* left: 80%; */}
  width: 200px;
  height: auto;
  ${'' /* padding: 20px; */}
  border-radius: 24px;
  ${'' /* background-color: rgba(34, 35, 3, 0.2); */}
  ${'' /* transform: translate(-80%, -50%); */}
  display: ${(props) => (props.isActive ? 'block' : 'none')};
  @media screen and (max-width: 1279px) {
    ${'' /* width: 100%; */}
    width:120px;
    min-height: 200px;
    ${'' /* top: 90%;
    left: 120%;
    transform: translate(-120%, -90%); */}
  }
`
const OwnerBackground = styled(ActiveBackground)`
  position: absolute;
  left: 120%;
  top: 0%;
  ${'' /* transform: translate(-120%, 0%); */}
  display: ${(props) => (props.rule ? 'block' : 'none')};
  @media screen and (max-width: 1279px) {
    width: 120px;
    top: -80%;
    right: 0;
    transform:translateY(80%);
  }
`
const ActivePost = styled.div`
  display: flex;
  flex-wrap: wrap;
  z-index: 100;
  max-height: 150px;
  overflow: scroll;
  ${'' /* width: calc(100% / 3); */}
  flex-wrap: wrap;
  &::-webkit-scrollbar {
    display: none;
    ${'' /* background: transparent;
    border-radius: 4px;
    width: 3px; */}
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
  }
`
const EditBtn = styled.button`
  font-size: ${(props) => props.fontSize || '14px'};
  width: ${(props) => props.width || '120px'};
  color: ${(props) => props.color || '#F6EAD6'};
  border: ${(props) => props.border || 'none'};
  padding: ${(props) => props.padding || 'none'};
  margin-top: ${(props) => props.marginTop || 'none'};
  margin-bottom: ${(props) => props.marginBottom || 'none'};
  @media screen and (max-width: 767px) {
    width: ${(props) => props.mobile_width || props.width};
    font-size: ${(props) => props.mobile_fontSize || props.fontSize};
    padding: ${(props) => props.mobile_padding || props.padding};
    margin-top: ${(props) => props.mobile_marginTop || props.marginTop};
    margin-bottom: ${(props) =>
      props.mobile_marginBottom || props.marginBottom};
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  background-color: rgba(0, 0, 0, 0.5);

  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
`
const PopContent = styled.div`
  z-index: 10;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;

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
  ${'' /* position: relative; */}
  padding: 16px;
  border: 1px solid #ac6947;
  text-align: left;
  color: #f6ead6;
  background: transparent;
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
  width: 100%;
  min-height: 150px;

  @media screen and (max-width: 1279px) {
    font-size: 14px;
  }
`
const NewIntroWrapper = styled.input`
  ${'' /* position: relative; */}
  font-size: 16px;
  padding: 12px;
  margin: 4px 0 20px;
  border: 1px solid #ac6947;
  text-align: left;
  color: #f6ead6;
  background: transparent;
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
  width: 200px;
  height: auto;
  &:after {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    left: auto;
    right: 38px;
    bottom: -23px;
    border: 11px solid;
    border-color: #ac6947 transparent transparent;
  }
`

const ActivityContent = () => {
  let url = window.location.href
  const newUrl = url.split('/activity/')
  const groupID = newUrl[1]
  const [isActive, setIsActive] = useState(false)
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
  const [rule, setRule] = useState(false)
  const [ownerProfile, setOwnerProfile] = useState()
  const [isHovering, setIsHovering] = useState(false)
  const [isEditable, setIsEditable] = useState(false)
  const newNameRef = useRef()
  const newCityRef = useRef()
  const newMountainRef = useRef()
  const newIntro = useRef()
  const [newStart, setNewStart] = useState()
  const [newEnd, setNewEnd] = useState()
  const [images, setImages] = useState()
  const [imageURLs, setImageURLs] = useState()
  const [downloadUrl, setDownloadUrl] = useState([])
  const navigate = useNavigate()
  const value = useContext(UserContext)

  useEffect(() => {
    console.log(value.userAuth)
    if (value.userAuth === null) {
      console.log(456)
      window.alert('您尚未登入會員')
      navigate('/login')
    } else {
      console.log(789)
      testAuth()
      getOwnerProfile()
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
    let newGetPromise = [getGroupInfo(), getContentInfo()]
    async function getPromise() {
      await Promise.all(newGetPromise)
    }

    getPromise()
    const unsub = onSnapshot(doc(db, 'groupContents', groupID), (doc) => {
      const data = doc.data()
      if (data == undefined) {
        return
      }
      const memberData = data.memberList
      const ownerData = data.groupOwner
      setMember(memberData)
      setOwnerName(ownerData)
      memberData.filter((memberID, index) => {
        if (memberID.isLogged == true) {
          setOnline(true)
        }
      })
    })

    // window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [value.userAuth, groupID, contentID])

  async function testAuth() {
    console.log(123)
    const groupContent = doc(db, 'groupContents', groupID)
    const groupDoc = await getDoc(groupContent)
    if (groupDoc.exists()) {
      const groupOwnerInfo = groupDoc.data()
      const currgroupOwner = groupOwnerInfo.groupOwner
      const currMember = groupOwnerInfo.memberList
      console.log(currgroupOwner, value.userUid)
      if (value.userUid == currgroupOwner) {
        setAuth(false)
        setContent(true)
        setOwnerAuth(value.userUid)
        getOwnerProfile(currgroupOwner)
      } else if (value.userUid !== currgroupOwner) {
        console.log('非團主')
      }

      // else if (value.userUid !== currgroupOwner) {
      //   if (currMember.length == 0) {
      //     setAuth(true)
      //     setContent(false)
      //   } else {
      //     currMember.filter((memberID, index) => {
      //       console.log(memberID)
      //       if (memberID.joinID.includes(value.userUid)) {
      //         setAuth(false)
      //         setContent(true)
      //         setMemberAuth(value.userUid)
      //         setOnline(true)
      //         getOwnerProfile(currgroupOwner)
      //       }
      //     })
      //   }
      // }
    }
  }

  async function getOwnerProfile(currgroupOwner) {
    console.log(currgroupOwner)
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
  //FIXME
  async function testBtn() {
    if (authRef.current.value !== groupData.groupPassword) {
      alert('驗證碼錯誤')
    } else {
      alert('驗證成功')
      setAuth(false)
      setContent(true)
      setMemberAuth(value.userUid)
      const joinData = doc(db, 'users', value.userUid)
      const joinSnap = await getDoc(joinData)
      console.log(joinSnap)
      if (joinSnap.exists()) {
        console.log('取得個人資料')
        const getjoinData = joinSnap.data()
        const oldjoinList = await getjoinData.joinGroup
        setJoin(getjoinData)
        let newjoinList = []
        const joinInfo = {
          groupID: groupData.groupID,
          groupName: groupData.groupName,
          groupPhoto: groupData.groupPhoto,
          startDate: groupData.startDate,
          endDate: groupData.endDate,
        }
        newjoinList.push(joinInfo, ...oldjoinList)
        const updatejoinGroup = await updateDoc(joinData, {
          joinGroup: newjoinList,
        })
        const groupContent = doc(db, 'groupContents', groupData.groupID)
        let newMember = []
        const newMemberInfo = {
          joinName: getjoinData.name,
          joinPic: getjoinData.photoURL,
          joinID: getjoinData.id,
          isLogged: true,
          isEditableAuth: false,
        }

        newMember.push(newMemberInfo, ...member)
        const updateMember = await updateDoc(groupContent, {
          memberList: newMember,
        })
        console.log(newMemberInfo, '更新團體資料')
        setMember(newMember)
      }
    }
  }

  async function seeTheProfile(index) {
    setIsActive((current) => !current)
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
    setRule((current) => !current)
  }
  function getPhotoInfo(e) {
    setImages([...e.target.files])
    const newImageUrls = URL.createObjectURL(e.target.files[0])
    setImageURLs(newImageUrls)
  }

  async function editFunction() {
    let newPromise = [sendUpdateInfo(), editGroupInfo(), findMemberData()]
    await Promise.all(newPromise)
  }
  async function sendUpdateInfo() {
    const imageRef = ref(
      storage,
      `images/${newNameRef.current.value}_${groupID}_登山團封面照`,
    )
    uploadBytes(imageRef, images[0]).then(() => {
      console.log('檔案上傳成功')
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
          groupIntro: newIntro.current.value,
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
        console.log('取到資料')
        const getRefData = getRef.data()
        console.log(getRefData)
        const getJoinData = getRefData.joinGroup
        let eachIndex = getJoinData.findIndex((c) => c.groupID === groupID)
        console.log(eachIndex)
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

      console.log('改好參加者資料了')
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
                fontSize="36px"
                tablet_fontSize="24px"
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
      {content && (
        <>
          <Wrapper>
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
                  </>
                ) : (
                  <BackCover
                    style={{ backgroundImage: `url(${groupData.groupPhoto})` }}
                  ></BackCover>
                )}
                {groupData && (
                  <>
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
                    <MainInfo>
                      <Divide
                        justifyContent="center"
                        marginBottom="12px"
                        mobile_justifyContent="flex-start"
                      >
                        <Text
                          fontSize="24px"
                          color="#AC6947"
                          fontWeight="800"
                          tablet_fontSize="20px"
                          mobile_fontSize="16px"
                        >
                          團名：
                        </Text>
                        {isEditable ? (
                          <InfoInput
                            backgroundColor="transparent"
                            width="150px"
                            fontSize="24px"
                            tablet_fontSize="20px"
                            mobile_fontSize="16px"
                            boxShadow="none"
                            color="#F6EAD6"
                            borderBottom="1px solid #F6EAD6"
                            ref={newNameRef}
                            defaultValue={groupData.groupName}
                          />
                        ) : (
                          <Text
                            fontSize="24px"
                            tablet_fontSize="20px"
                            mobile_fontSize="16px"
                          >
                            {groupData.groupName}
                          </Text>
                        )}
                      </Divide>
                      <Divide
                        justifyContent="center"
                        mobile_flexDirection="column"
                        mobile_justifyContent="flex-start"
                        mobile_alignItems="start"
                      >
                        <Divide mobile_marginBottom="12px">
                          <Text
                            margin="0px 4px 0px 0px"
                            fontSize="24px"
                            color="#AC6947"
                            fontWeight="800"
                            tablet_fontSize="20px"
                            mobile_fontSize="16px"
                            mobile_margin="0 12px 0 0"
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
                                ref={newCityRef}
                                defaultValue={groupData.groupCity}
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
                                ref={newMountainRef}
                                defaultValue={groupData.groupMountain}
                              />
                            </Divide>
                          ) : (
                            <Text
                              fontSize="20px"
                              margin="0 8px 0 0"
                              tablet_fontSize="20px"
                              mobile_fontSize="16px"
                            >
                              {groupData.groupCity}|{groupData.groupMountain}
                            </Text>
                          )}
                        </Divide>
                        <Divide mobile_marginBottom="12px">
                          <Text
                            fontSize="24px"
                            color="#AC6947"
                            fontWeight="800"
                            margin="0 0 0 20px"
                            tablet_fontSize="20px"
                            mobile_fontSize="16px"
                            tablet_margin="0 12px 0 20px"
                            mobile_margin="0 12px 0 0"
                          >
                            日期：
                          </Text>
                          {isEditable ? (
                            <>
                              <DateInput
                                type="date"
                                onChange={(e) => setNewStart(e.target.value)}
                                defaultValue={groupData.startDate}
                              />
                              <DateInput
                                type="date"
                                onChange={(e) => setNewEnd(e.target.value)}
                                defaultValue={groupData.endDate}
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
                      </Divide>
                      {isEditable ? (
                        <Divide marginTop="20px">
                          <EditBtn
                            width="120px"
                            mobile_width="80px"
                            border="1px solid #B99362"
                            padding="8px 12px"
                            mobile_padding="8px"
                            mobile_fontSize="12px"
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
                            border="1px solid #B99362"
                            onClick={editFunction}
                          >
                            確認修改
                          </EditBtn>
                        </Divide>
                      ) : (
                        <EditBtn
                          width="140px"
                          mobile_fontSize="12px"
                          border="1px solid #F6EAD6"
                          padding="8px 12px"
                          marginTop="20px"
                          // marginBottom="20px"
                          mobile_padding="8px"
                          mobile_marginTop="10px"
                          onClick={() => {
                            setIsEditable(true)
                            setIsHovering(false)
                          }}
                          onMouseEnter={() => setIsHovering(true)}
                          onMouseLeave={() => setIsHovering(false)}
                        >
                          修改基本資訊
                        </EditBtn>
                      )}
                    </MainInfo>
                  </>
                )}
              </>
            )}
            <Divide
              alignItems="start"
              marginTop="50px"
              mobile_flexDirection="column"
              mobile_marginTop="20px"
            >
              {ownerProfile && (
                <>
                  <Divide
                    width="45%"
                    justiftContent="center"
                    alignItems="center"
                    flexDirection="column"
                    // tablet_flexDirection="column"
                    marginBottom="12px"
                    mobile_alignItems="end"
                    minHeight="200px"
                  >
                    {groupData && (
                      <>
                        <Divide position="relative" minHeight="180px">
                          <Divide flexDirection="column">
                            <Text fontSize="24px" tablet_fontSize="16px">
                              團長
                            </Text>
                            <Text
                              fontSize="20px"
                              tablet_fontSize="16px"
                              margin="0x 0x 8px 0px"
                            >
                              {ownerProfile.name}
                            </Text>
                            <MemberPic
                              src={ownerProfile.photoURL}
                              onClick={seeOwnerProfile}
                            />{' '}
                          </Divide>
                          <OwnerBackground rule={rule}>
                            <Text
                              tablet_fontSize="14px"
                              margin="0 0 12px 0px"
                              color=" #B99362"
                            >
                              團長清單
                            </Text>
                            <ActivePost
                              onClick={() => {
                                setRule((current) => !current)
                              }}
                              rule={rule}
                            >
                              {rule && ownerProfile.equipment.length > 0 ? (
                                ownerProfile.equipment.map((item, index) => {
                                  return (
                                    <>
                                      <Divide
                                        key={index}
                                        tablet_flexDirection="column"
                                        mobile_flexDirection="column"
                                      >
                                        <Text tablet_fontSize="14px">
                                          {item}
                                        </Text>
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
                            </ActivePost>
                          </OwnerBackground>
                        </Divide>
                      </>
                    )}
                    {groupData && (
                      <Divide margin="12px 0 20px 0">
                        <Divide width="48%">
                          <Text textAlign="left" tablet_fontSize="14px">
                            團長的話
                            {isEditable ? (
                              <NewIntroWrapper
                                ref={newIntro}
                                defaultValue={groupData.groupIntro}
                              />
                            ) : (
                              <Intro>{groupData.groupIntro}</Intro>
                            )}
                          </Text>
                        </Divide>
                        <Divide
                          flexDirection="column"
                          alignItems="start"
                          width="48%"
                        >
                          <Text fontSize="20px" tablet_fontSize="14px">
                            團員名單
                          </Text>
                          <UnderCover>
                            <WidthContainer>
                              {member.length > 0 ? (
                                Object.values(member).map((item, index) => {
                                  return (
                                    <Divide
                                      flexDirection="column"
                                      tablet_flexDirection="column"
                                      mobile_flexDirection="column"
                                      key={index}
                                      id={index}
                                    >
                                      <Text tablet_fontSize="14px">
                                        {item.joinName}
                                      </Text>
                                      {/* {online && <div>上線中</div>} */}
                                      <MemberPic
                                        src={item.joinPic}
                                        onClick={() => seeTheProfile(index)}
                                      />
                                    </Divide>
                                  )
                                })
                              ) : (
                                <>
                                  <MemberDefault></MemberDefault>
                                </>
                              )}
                            </WidthContainer>
                          </UnderCover>
                        </Divide>
                      </Divide>
                    )}
                    <Text
                      fontSize="14px"
                      tablet_fontSize="12px"
                      tablet_margin="12px auto 0 auto"
                    >
                      【點擊頭像可查看裝備清單】
                    </Text>
                    <ActiveBackground isActive={isActive}>
                      {profile && (
                        <Text
                          tablet_fontSize="14px"
                          margin="0 0 12px 0"
                          color=" #B99362"
                        >
                          {profile.name}的清單
                        </Text>
                      )}
                      <ActivePost
                        onClick={(e) => {
                          setIsActive((current) => !current)
                        }}
                        isActive={isActive}
                      >
                        {isActive && profile && profile.equipment.length > 0 ? (
                          profile.equipment.map((item, index) => {
                            return (
                              <>
                                <Divide
                                  key={index}
                                  tablet_flexDirection="column"
                                  mobile_flexDirection="column"
                                  flexWrap="wrap"
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
                          <Text>目前尚無清單</Text>
                        )}
                        {ownerAuth !== undefined && (
                          <>
                            <Divide
                              marginTop="12px"
                              flexDirection="column"
                              tablet_flexDirection="column"
                            >
                              {/* <Btn
                              fontSize="14px"
                              width="120px"
                              margin="12px 0 12px 0"
                              tablet_fontSize="14px"
                              tablet_width="80px"
                              tablet_height="20px"
                              tablet_margin="8px 0 8px 0"
                              onClick={() => removeMember()}
                            >
                              剔除團員
                            </Btn> */}
                              <Btn
                                fontSize="14px"
                                width="120px"
                                margin="12px 0 16px 0"
                                tablet_fontSize="14px"
                                tablet_width="80px"
                                tablet_height="20px"
                              >
                                開放權限
                              </Btn>
                            </Divide>
                          </>
                        )}
                      </ActivePost>
                    </ActiveBackground>
                  </Divide>
                </>
              )}
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
            {/* <Divide> */}
            <Itinerary
              Text={Text}
              DivideBorder={DivideBorder}
              Divide={Divide}
              InfoInput={InfoInput}
              Btn={Btn}
              BackColor={BackColor}
              SrcImage={SrcImage}
              setOwnerAuth={setOwnerAuth}
              ownerAuth={ownerAuth}
              setMemberAuth={setMemberAuth}
              memberAuth={memberAuth}
            />
            {/* </Divide> */}
            <Divide
              alignItems="start"
              tablet_flexDirection="column"
              justifyContent="space-around"
            >
              <Accommodation
                Text={Text}
                DivideBorder={DivideBorder}
                Divide={Divide}
                InfoInput={InfoInput}
                Btn={Btn}
                BackColor={BackColor}
                SrcImage={SrcImage}
              />
              <Cars
                Text={Text}
                DivideBorder={DivideBorder}
                Divide={Divide}
                InfoInput={InfoInput}
                Btn={Btn}
                BackColor={BackColor}
                SrcImage={SrcImage}
              />
            </Divide>
          </Wrapper>
        </>
      )}
    </>
  )
}

export default ActivityContent
