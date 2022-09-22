import React, { useState, useEffect, useRef, useContext } from 'react'
import styled, { keyframes } from 'styled-components'
import { db, storage } from '../../utils/firebase'
import { collection, setDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import html2canvas from 'html2canvas'
import { UserContext } from '../../utils/userContext'
import { Link, useNavigate } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import Calendar from 'react-calendar'
import cover from './cover.jpg'
import back from './back.png'
import check from './check.png'
import share from './Share.png'
import 'react-calendar/dist/Calendar.css'
// import { ProgressBar, Step } from 'react-step-progress-bar'

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
  @media screen and (max-width: 767px) {
    flex-direction: ${(props) => props.mobile_flexDirection || 'row'};
  }
`
const FlexDivide = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
  margin-left: 5%;
  @media screen and (max-width: 1279px) {
    margin-left: 3%;
  }
  @media screen and (max-width: 767px) {
    width: 100%;
    margin-left: 0%;
  }
`

const StepDivide = styled.div`
  display: flex;
  flex-direction: column;
`
const Step = styled.button`
  color: #f6ead6;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
  border-radius: 50px;
  width: 16px;
  height: 16px;
  position: fixed;
  font-size: 14px;
  &:actve {
    ${((props) => props.complete && 'cursor:pointer', 'pointer-events: all')}
  }
  &:not(:last-child) {
    &:before,
    &:after {
      display: block;
      position: absolute;
      top: 100%;
      height: auto;
      left: 50%;
      width: 2px;
      content: '';
      ${'' /* transform: translateY(-50%); */}
      ${'' /* z-index: -1; */}
    }
  }
  &:before {
    width: 100%;
    background-color: gray;
  }
  &:after {
    ${'' /* width: 0; */}
    background-color: pink;
    width: ${(props) => (props.complete ? '100% !important' : '0')};
    opacity: ${(props) => (props.complete ? '1' : '0')};
    transition: ${(props) =>
      props.complete
        ? 'width 0.6s ease-in-out, opacity 0.6s ease-in-out'
        : 'none'};
  }
`
const StepIcon = styled.span`
  position: relative;
  width: 3rem;
  height: 3rem;
  background-color: transparent;
  border: 0.25rem solid gray;
  border-radius: 50%;
  color: white;
  font-size: 2rem;
  &:before {
    display: block;
    color: white;
  }
`
const StepLabel = styled.div`
  position: absolute;
  bottom: -2rem;
  left: 50%;
  margin-top: 1rem;
  font-size: 0.8rem;
  transform: translateX(-50%);
  width: 200px;
  color: ${(props) => (props.complete ? 'gray' : 'none')};
  transition: ${(props) =>
    props.complete ? 'color 0.3s ease-in-out' : 'none'};
  transition-delay: ${(props) => (props.complete ? '0.5s' : 'none')};
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
    &:focus ~ label {
      font-size: 20px;
    }
  }
  @media screen and (max-width: 767px) {
    font-size: 16px;
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
  @media screen and (max-width: 767px) {
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
  width: 45%;
  margin-top: 50px;
  @media screen and (max-width: 767px) {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
  }
`
const FormDate = styled.div`
  width: 100%;
  height: 50%;
  margin-bottom: 50px;
  @media screen and (max-width: 767px) {
    margin-bottom: 20px;
  }
`
const Photo = styled.div`
  width: 100%;
  height: 45%;
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
      height: 30px;
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
const move = keyframes`
  0%,
  100% {
    left: 0;
  }
  50% {
    left: 75%;
  }
`
const LoadingStyle = styled.span`
  font-family: 'Rubik Moonrocks', cursive;
  font-size: 60px;
  text-transform: uppercase;
  letter-spacing: 5px;
  position: relative;
  ${'' /* color: transparent;
  background-image: linear-gradient(#b99362, #e4e4d9);
  -webkit-background-clip: text; */}
  color:orange;
  background-clip: text;
  &:before {
    content: '';
    width: 25%;
    height: 100%;
    ${'' /* background-color: rgba(34, 35, 34, 0.8); */}
    background-color:white;
    position: absolute;
    top: 0;
    left: 0;
    mix-blend-mode: difference;
    animation: ${move} 3s linear infinite;
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

function Activity() {
  const nameRef = useRef()
  const groupPassword = useRef()
  const cityRef = useRef()
  const mountainRef = useRef()
  const textRef = useRef()
  const printRef = useRef()
  const [images, setImages] = useState()
  const [imageURLs, setImageURLs] = useState()
  const [downloadUrl, setDownloadUrl] = useState([])
  const [group, setGroup] = useState()
  const [groupID, setGroupID] = useState()
  const [isInfo, setIsInfo] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
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
      groupPassword.current.value == '' ||
      cityRef.current.value == '' ||
      mountainRef.current.value == '' ||
      textRef.current.value == '' ||
      images == undefined
    ) {
      alert('表格不可為空')
      setIsInfo(false)
    } else {
      setIsPreview(true)
      setIsActive(true)
      // setComplete((current) => !current)
      setLoading(true)
      const userdocRef = doc(db, 'users', value.userUid)
      const docRef = doc(collection(db, 'groupLists'))
      const docSnap = await getDoc(userdocRef)
      const id = docRef.id
      setGroupID(id)
      const imageRef = ref(
        storage,
        `images/${nameRef.current.value}_${id}_登山團封面照`,
      )
      uploadBytes(imageRef, images[0]).then(() => {
        console.log('檔案上傳成功')
        getDownloadURL(imageRef).then((url) => {
          setDownloadUrl(url)
          const newDocRef = setDoc(doc(db, 'groupLists', id), {
            groupName: nameRef.current.value,
            groupID: id,
            groupOwner: value.userUid,
            groupPhoto: url,
            groupCity: cityRef.current.value,
            groupMountain: mountainRef.current.value,
            groupPassword: groupPassword.current.value,
            startDate: `${date[0].getFullYear()} -
              ${date[0].getMonth() + 1}
               -
              ${date[0].getDate()}`,

            endDate: `${date[1].getFullYear()} -
              ${date[1].getMonth() + 1}
               -
              ${date[1].getDate()}`,
            groupIntro: textRef.current.value,
          })
          setGroup(newDocRef)
          setLoading(false)
          setIsInfo(true)
          //團的資訊
        })
      })
    }
  }
  console.log(group)

  function backToSet() {
    window.alert('關閉後請重新設定資訊!')
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
    const shareData = {
      url: `https://find-friends-to-mountain.web.app/activity/${groupID}`,
      title: '『找山遊』邀請連結',
      text: '來參加我的登山團',
    }
    try {
      await navigator.share(shareData)
      // window.alert('已複製連結')
    } catch (err) {
      const { name, message } = err
      if (name === 'AbortError') {
        window.alert('您已取消分享此訊息')
      } else {
        console.log('發生錯誤', err)
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
        groupName: group.groupName,
        groupPhoto: downloadUrl,
        startDate: group.startDate,
        endDate: group.endDate,
      }

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
      itinerary: [],
    })
    console.log(groupRef)
  }

  return (
    <>
      <Wrapper>
        <Divide mobile_flexDirection="column">
          <Basic id="basic">
            <InputData>
              <InfoInput type="text" ref={nameRef} />
              <Underline></Underline>
              <Label>登山團名稱</Label>
            </InputData>
            <InputData>
              <InfoInput
                type="text"
                placeholder="請輸入密碼"
                ref={groupPassword}
              />
              <Underline></Underline>
              <Label>群組密碼</Label>
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
          </Basic>
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
                    活動開始：{date[0].getFullYear()}-{date[0].getMonth() + 1}-
                    {date[0].getDate()}
                  </SubText>
                  <SubText>
                    活動結束：{date[1].getFullYear()}-{date[1].getMonth() + 1}-
                    {date[1].getDate()}
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
        </Divide>
        <Divide flexDirection="column" mobile_flexDirection="column">
          <Btn
            width="30%"
            margin="20px auto 0 auto"
            borderRadius="8px"
            onClick={settingCard}
          >
            完成設定
          </Btn>
        </Divide>

        {isActive && (
          <>
            <ActiveBackground isActive={isActive}>
              <ActivePost isActive={isActive}>
                {loading && <LoadingStyle>Mountain</LoadingStyle>}

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
                        style={{ backgroundImage: `url(${group.groupPhoto})` }}
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
                          <Btn fontSize="14px" width="250px" border="none">
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
