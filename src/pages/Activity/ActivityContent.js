import React, { useState, useEffect, useRef } from 'react'
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
  deleteField,
  arrayRemove,
} from 'firebase/firestore'
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

const BackCover = styled.img`
  width: 100%;
  height: 560px;
  object-fit: cover;
  @media screen and (max-width: 1279px) {
    ${(props) => props.hideOnMobile && 'display: none;'}
  }
`
const BackCoverMB = styled(BackCover)`
  ${(props) => props.hideOnDesktop && 'display: none;'}

  @media screen and (max-width: 1279px) {
    display: block;
    height: 360px;
    padding-left: -20px;
    padding-right: -20px;
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
    background-color: ${(props) => props.backgroundColor || '#ac6947'};
    width: ${(props) => props.width || '0px'};
    height: ${(props) => props.height || '0px'};
    z-index: ${(props) => props.zIndex || '-1'};
    position: ${(props) => props.position || 'absolute'};
    top: ${(props) => props.top || '0px'};
    left: ${(props) => props.left || '0px'};
    right: ${(props) => props.right || '0px'};
  }
`
const WidthContainer = styled.div`
  height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @media screen and (max-width: 767px) {
    flex-wrap: no-wrap;
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
  justify-content: ${(props) => props.justifyContent || 'space-between'};
  align-items: ${(props) => props.alignItems || 'center'};
  flex-direction: ${(props) => props.flexDirection || 'row'};
  margin-bottom: ${(props) => props.marginBottom || '0px'};
  margin-top: ${(props) => props.marginTop || '0px'};
  flex-wrap: ${(props) => props.flexWrap || 'no-wrap'};
  @media screen and (max-width: 1279px) {
    flex-direction: ${(props) => props.flexDirection || 'row'};
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
  padding: 20px;
`

const Text = styled.div`
  color: ${(props) => props.color || '#f6ead6'};
  font-size: ${(props) => props.fontSize || '16px'};
  margin-top: ${(props) => props.marginTop || '0px'};
  margin-bottom: ${(props) => props.marginBottom || '0px'};
  margin-right: ${(props) => props.marginRight || '0px'};
  margin-left: ${(props) => props.marginLeft || '0px'};
  text-align: ${(props) => props.textAlign || 'center'};
  position: ${(props) => props.position || 'none'};
  top: ${(props) => props.top || 'none'};
  left: ${(props) => props.left || 'none'};
`

const UnderCover = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 24px;
  padding: 16px;

  position: relative;
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
const Intro = styled.div`
  position: relative;
  padding: 15px;
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

const Scroll = styled.div`
  position: fixed;
  z-index: 3;
  right: 0;
  bottom: 20px;
  background-image: url(${top});
  background-size: contain;
  background-repeat: no-repeat;
  width: 80px;
  height: 80px;

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
`

const IconWrapper = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #222322;
`

const ActiveBackground = styled.div`
  position: absolute;
  top: 0;
  left: -50%;
  width: 200px;
  height: auto;
  padding: 20px;
  border-radius: 24px;
  background-color: rgba(34, 35, 3, 0.2);

  display: ${(props) => (props.isActive ? 'block' : 'none')};
`
const OwnerBackground = styled(ActiveBackground)`
  left: 70%;
  display: ${(props) => (props.rule ? 'block' : 'none')};
`

const ActivePost = styled.div`
  z-index: 100;
  max-height: 200px;
  overflow: scroll;
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
`

const PopupWrapper = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 3;
`
const PopContent = styled.div`
  position: absolute;
  z-index: 10;
  top: 30%;
  left: 50%;
  width: 500px;
  height: 500px;
  transofrm: translate(-50%, -30%);
  display: flex;
  flex-direction: column;
  align-items: center;
`
const PopImage = styled.div`
  background-image: url(${lock});
  background-size: cover;
  width: 90px;
  height: 90px;
`

const SrcImage = styled.img`
  width: ${(props) => props.width || '0px'};
  height: ${(props) => props.height || '0px'};
  object-fit: ${(props) => props.objectFit || 'cover'};
`

const ActivityContent = () => {
  let url = window.location.href
  const newUrl = url.split('/activity/')
  const groupID = newUrl[1]
  const [isActive, setIsActive] = useState(false)
  const [contentID, setContentID] = useState()
  const makeLogin = JSON.parse(window.localStorage.getItem('token'))
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
  const [ownerAuth, setOwnerAuth] = useState(false)
  const [online, setOnline] = useState(false)
  const [rule, setRule] = useState(false)
  const [ownerProfile, setOwnerProfile] = useState()
  const [showBtn, setShowBtn] = useState('myBtn noen')
  const navigate = useNavigate()

  useEffect(() => {
    if (makeLogin == undefined) {
      alert('您尚未登入會員')
      navigate('/login')
    } else {
      getGroupInfo()
      getContentInfo()
      getOwnerProfile()
      testAuth()
    }

    //groupList
    //改成promiseall
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

    const unsub = onSnapshot(doc(db, 'groupContents', groupID), (doc) => {
      const data = doc.data()
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

    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [groupID, contentID])

  async function testAuth() {
    const groupContent = doc(db, 'groupContents', groupID)
    const groupDoc = await getDoc(groupContent)
    const groupOwnerInfo = groupDoc.data()
    const currgroupOwner = groupOwnerInfo.groupOwner
    const currMember = groupOwnerInfo.memberList

    if (makeLogin.uid == currgroupOwner) {
      setAuth(false)
      setContent(true)
      setOwnerAuth(true)
      getOwnerProfile(currgroupOwner)
    } else if (makeLogin.uid !== currgroupOwner) {
      console.log(currMember)
      if (currMember.length == 0) {
        setAuth(true)
        setContent(false)
      } else {
        currMember.filter((memberID, index) => {
          if (memberID.joinID.includes(makeLogin.uid)) {
            setAuth(false)
            setContent(true)
            setOnline(true)
            getOwnerProfile(currgroupOwner)
          }
        })
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
  //FIXME
  async function testBtn() {
    if (authRef.current.value !== groupData.groupPassword) {
      alert('驗證碼錯誤')
    } else {
      alert('驗證成功')
      setAuth(false)
      setContent(true)
      const joinData = doc(db, 'users', makeLogin.uid)
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
  async function removeMember() {
    console.log(clickID)

    // window.confirm('確定刪除嗎')
    // if (window.confirm('確定刪除嗎') == true) {
    //   window.alert('已刪除團員')
    //   try {
    //     const docRef = doc(db, 'users', clickID)
    //     const docSnap = await getDoc(docRef)
    //     if (docSnap.exists()) {
    //       const userData = docSnap.data()
    //       const joinIDList = userData.joinGroup
    //       console.log(joinIDList)
    //       // let deleteRef = doc(db, `/users/${clickID}/joinGroup`)
    //       let deleteRef = db.collection('users').doc(`${clickID}`)
    //       joinIDList.filter((list, index) => {
    //         //刪除他的joinID 群組的member
    //         console.log(list)
    //         deleteRef.update({
    //           joinGroup: arrayRemove(list),
    //         })
    //       })
    //     }
    //   } catch {
    //     console.log('No such document!')
    //   }
    // } else {
    //   window.alert('已取消刪除')
    // }
  }

  return (
    <>
      {/* <Wrapper> */}
      {auth && (
        <>
          <PopupWrapper>
            <PopContent>
              <PopImage></PopImage>
              <Text fontSize="36px" marginBottom="30px">
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
      {/* </Wrapper> */}
      {content && (
        <>
          {groupData && (
            <BackCoverMB hideOnDesktop src={groupData.groupPhoto} />
          )}
          <Wrapper>
            {groupData && <BackCover hideOnMobile src={groupData.groupPhoto} />}
            {groupData && (
              <>
                <Text></Text>
                <Scroll
                  onClick={() => {
                    window.scrollTo({ top: 0, right: 0, behavior: 'smooth' })
                  }}
                  id="myBtn"
                >
                  Top
                </Scroll>
                <Text fontSize="32px" marginBottom="8px" marginTop="12px">
                  團名：{groupData.groupName}
                </Text>
                <Divide justifyContent="center" marginTop="20px">
                  <Text marginRight="20px" fontSize="24px" position="relative">
                    <BackColor
                      backgroundColor="#F6EAD6"
                      width="180px"
                      height="2px"
                      position="absolute"
                      top="50%"
                      left="-220px"
                    ></BackColor>
                    地點：
                    {groupData.groupCity}|<span>{groupData.groupMountain}</span>
                  </Text>
                  <Text fontSize="24px" position="relative">
                    日期：
                    {groupData.startDate} ~ {groupData.endDate}
                    <BackColor
                      backgroundColor="#F6EAD6"
                      width="180px"
                      height="2px"
                      position="absolute"
                      top="50%"
                      left="none"
                      right="-220px"
                      style={{
                        '@media (max-width:1279px)': {
                          display: 'none',
                        },
                      }}
                    ></BackColor>
                  </Text>
                </Divide>
              </>
            )}

            <Divide alignItems="flex-start" marginTop="50px">
              <DivideBorder width="40%" border="none" position="relative">
                {groupData && (
                  <>
                    <Text
                      position="absolute"
                      textAlign="left"
                      left="-10%"
                      top="-10%"
                      style={{
                        '@media (max-width:1279px)': {
                          left: '65%',
                        },
                      }}
                    >
                      團長的話
                      <Intro>{groupData.groupIntro}</Intro>
                    </Text>
                  </>
                )}
                {ownerProfile && (
                  <>
                    <Divide flexDirection="column" marginBottom="12px">
                      <Text fontSize="24px" position="relative">
                        團長
                      </Text>

                      <Text fontSize="20px" marginBottom="8px">
                        {ownerProfile.name}
                      </Text>
                      <MemberPic
                        src={ownerProfile.photoURL}
                        onClick={seeOwnerProfile}
                      />
                      <Text fontSize="14px" position="relative">
                        點擊頭像可查看裝備清單
                        <BackColor
                          backgroundColor="#F6EAD6"
                          width="100%"
                          height="2px"
                          top="90%"
                        ></BackColor>
                      </Text>
                    </Divide>
                  </>
                )}
                <OwnerBackground rule={rule}>
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
                            <Divide key={index}>
                              <Text>{item}</Text>
                              <IconWrapper>
                                <IconImage
                                  style={{
                                    backgroundImage: `url(${
                                      equipments[item] ? equipments[item] : logo
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
                <UnderCover>
                  <Text fontSize="20px">團員名單</Text>
                  <WidthContainer>
                    {member.length > 0 ? (
                      Object.values(member).map((item, index) => {
                        return (
                          <Divide flexDirection="column" key={index} id={index}>
                            <Text>{item.joinName}</Text>
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

                  <ActiveBackground isActive={isActive}>
                    <ActivePost
                      onClick={(e) => {
                        setIsActive((current) => !current)
                      }}
                      isActive={isActive}
                    >
                      {profile && (
                        <Text marginBottom="12px">
                          這是{profile.name}的清單
                        </Text>
                      )}
                      {isActive && profile && profile.equipment.length > 0 ? (
                        profile.equipment.map((item, index) => {
                          return (
                            <>
                              <Divide key={index}>
                                <Text>{item}</Text>
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
                      {ownerAuth && (
                        <>
                          <Divide flexDirection="column">
                            <Btn
                              width="80px"
                              margin="16px 0 16px 0"
                              onClick={() => removeMember()}
                            >
                              剔除團員
                            </Btn>
                            <Btn width="80px">開放權限</Btn>
                          </Divide>
                        </>
                      )}
                    </ActivePost>
                  </ActiveBackground>
                </UnderCover>
              </DivideBorder>
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
            <Divide>
              <Itinerary
                Text={Text}
                DivideBorder={DivideBorder}
                Divide={Divide}
                InfoInput={InfoInput}
                Btn={Btn}
                BackColor={BackColor}
                SrcImage={SrcImage}
              />
            </Divide>
            <Divide
              style={{
                '@media (max-width:1279px)': {
                  flexDirection: 'column',
                },
              }}
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
