import React from 'react'
import { useState, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { FileLabel, Divide, InfoInput, EditBtn, Text } from '../../css/style'
import { db, storage } from '../../utils/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { useParams } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import logo from './Mountain.png'

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
const FileInput = styled.input``
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
const LabelText = styled.div`
  font-size: 24px;
  font-weight: 400;
  @media (max-width: 1279px) {
    font-size: 20px;
  }
  @media (max-wdith: 767px) {
    font-size: 16px;
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
  0%
   {
    left: 0;
    transform:rotate(0deg);
  }
  25%{
    left:600px;
    transform:rotate(20deg);
  }
  50% {
    transform:rotate(0deg);
    left: 80%;
  }
  55%{
    transform:rotate(0deg);
    left: 90%;
  }
  70%{
    transform:rotate(0deg);
    left: 75%;
  }
  100%{
    left: 0%;
    transform:rotate(-360deg);
  }
`
const MBmove = keyframes`
  0%
   {
    left: 0;
    transform:rotate(0deg);
  }
  25%{
    left:300px;
    transform:rotate(20deg);
  }
  50% {
    transform:rotate(0deg);
    left: 80%;
  }
  55% {
    transform:rotate(0deg);
    left: 90%;
  }
  70% {
    transform:rotate(0deg);
    left: 75%;
  }
  100% {
    left: 0%;
    transform:rotate(-360deg);
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
const BannerInfo = ({ contentData, latestContentsData, ownerAuth }) => {
  const [images, setImages] = useState()
  const [imageURLs, setImageURLs] = useState()
  const [downloadUrl, setDownloadUrl] = useState()
  const [isEditable, setIsEditable] = useState(false)
  const [newStart, setNewStart] = useState()
  const [newEnd, setNewEnd] = useState()
  const [loading, setLoading] = useState(false)

  const urlID = useParams()
  const groupContentRef = doc(db, 'groupContents', urlID.id)
  const newNameRef = useRef()
  const newCityRef = useRef()
  const newMountainRef = useRef()
  const newPassword = useRef()
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
  return (
    <>
      <LoadingBackground loading={loading}>
        <LoadingStyle></LoadingStyle>
      </LoadingBackground>
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
                    <LabelText>團名：</LabelText>
                    <InfoInput
                      backgroundColor="transparent"
                      width="300px"
                      mobile_width="200px"
                      fontSize="20px"
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
                    <LabelText>地點：</LabelText>
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
                        placeholder="城市"
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
                        placeholder="山名"
                        defaultValue={
                          latestContentsData.groupMountain
                            ? latestContentsData.groupMountain
                            : contentData.groupMountain
                        }
                      />
                    </Divide>
                  </Divide>
                  <Divide marginBottom="12px">
                    <LabelText>日期：</LabelText>
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
                    <LabelText>團名：</LabelText>
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
                    <LabelText>地點：</LabelText>
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
                    <LabelText>日期：</LabelText>
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
                      <ReactTooltip id="owner" place="bottom" effect="solid">
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
    </>
  )
}

export default BannerInfo
