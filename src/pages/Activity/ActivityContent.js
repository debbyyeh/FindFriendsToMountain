import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { db } from '../../utils/firebase'
import { Divide, Text, InfoInput, SrcImage, Btn } from '../../css/style'
import { doc, getDoc, updateDoc, onSnapshot, setDoc } from 'firebase/firestore'
import ReactTooltip from 'react-tooltip'
import { useNavigate, useParams } from 'react-router-dom'
import memberDefault from './memberDefault.png'
import logo from './Mountain.png'
import lock from './Lock.png'
import edit from './Edit.png'
import done from './done.png'
import close from './Close.png'
import BannerInfo from './BannerInfo'
import equipments from '../../equipments/equipments'
import TodoList from '../../components/Todolist/TodoList'
import Itinerary from '../../components/Itinerary/Itinerary'
import Cars from '../../components/Car/Cars'
import Accommodation from '../../components/Accommodation/Accommodation'
import { UserContext } from '../../utils/userContext'

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
  const [ownerProfile, setOwnerProfile] = useState()
  const [isNote, setIsNote] = useState(false)
  const newIntro = useRef()
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
    const unsub = onSnapshot(groupContentRef, (doc) => {
      const data = doc.data()
      if (data === undefined) {
        value.alertPopup()
        value.setAlertContent('網址頁面不存在，將導回首頁')
        setTimeout(() => navigate('/'), 1500)
      } else {
        setLatestContentsData(data)
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
          startDate: latestContentsData
            ? latestContentsData.startDate
            : contentData.startDate,
          endDate: latestContentsData
            ? latestContentsData.newEnd
            : contentData.endDate,
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
      {content && (
        <>
          <BannerInfo
            setLatestContentsData={setLatestContentsData}
            latestContentsData={latestContentsData}
            setContentData={setContentData}
            contentData={contentData}
            setOwnerAuth={setOwnerAuth}
            ownerAuth={ownerAuth}
          />
          <Wrapper>
            <TodoList memberAuth={memberAuth} ownerAuth={ownerAuth} />
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
                      defaultValue={
                        latestContentsData
                          ? latestContentsData.groupIntro
                          : '目前尚無填寫事項'
                      }
                    />
                  ) : (
                    <NewIntroWrapper
                      disabled
                      value={
                        latestContentsData
                          ? latestContentsData.groupIntro
                          : '目前尚無填寫事項'
                      }
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
