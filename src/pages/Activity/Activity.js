import React, { useState, useRef, useContext } from 'react'
import styled from 'styled-components'
import { db, storage } from '../../utils/firebase'
import { collection, setDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { UserContext } from '../../utils/userContext'
import { useNavigate } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import { Btn, Divide, LoadingStyle } from '../../css/style'
import Calendar from 'react-calendar'
import trekking from './Trekking.png'
import back from './back.png'
import check from './check.png'
import share from './Share.png'
import 'react-calendar/dist/Calendar.css'
import top from './top.png'

const Background = styled.div`
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
  max-width: calc(600px - 40px);
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
  margin-top: -30px;
  margin-bottom: 12px;
  @media screen and (max-width: 1279px) {
    font-size: 20px;
  }
  @media screen and (max-width: 767px) {
    font-size: 16px;
    margin-top: -10px;
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
  display: block;
  cursor: pointer;
  color: #f6ead6;
  text-align: center;
  font-size: 16px;
  margin: 12px auto;
  transition: all 0.4s;
  @media screen and (max-width: 1279px) {
    font-size: 14px;
  }
  &:after {
    content: '';
    border-bottom: 2px solid #ac6947;
    margin: auto;
    position: relative;
    top: 5px;
    width: 0;
    display: block;
    transition: all 0.3s;
  }
  &:hover {
    opacity: 1;
    &:after {
      width: 100px;
    }
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
  min-height: 100px;
  background-color: transparent;

  color: #f6ead6;
  font-size: 20px;
  line-height: 40px;
  padding: 16px;
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
  width: 100%;
  margin-right: auto;
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
  margin-bottom: 50px;
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

const Card = styled.div`
  background-size: cover;
  width: 400px;
  height: auto;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0 auto;
  padding: 20px;
  @media screen and (max-width: 576px) {
    width: 300px;
  }
`
const Contents = styled.div`
  width: 100%;
  height: 100%;
  color: #f6ead6;
  font-weight: 500;
  background-color: rgba(19, 31, 25, 0.8);
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
  background-color: rgba(34, 35, 34, 0.9);
  width: 400px;
  height: auto;
  border-radius: 24px;
  @media screen and (max-width: 576px) {
    right: 10%;
    transform: translateX(-10%);
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
  display: ${(props) => (props.loading ? 'block' : 'none')};
`

const Icon = styled.img`
  cursor: pointer;
  display: block;
  width: 20px;
  height: 20px;
  margin-rigth: 8px;
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
  top: 50px;
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
const HoverBtn = styled(Btn)`
  &:hover {
    background-color: #ac6947;
    border: 1px solid #ac6947;
  }
`

function Activity() {
  const nameRef = useRef()
  const groupPassword = useRef()
  const cityRef = useRef()
  const mountainRef = useRef()
  const textRef = useRef()
  const [images, setImages] = useState()
  const [imageURLs, setImageURLs] = useState()
  const [group, setGroup] = useState()
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

  const settingCard = async () => {
    if (nameRef.current.value === '' || groupPassword.current.value === '') {
      value.alertPopup()
      value.setAlertContent('密碼及團名為必填資訊')
      setIsInfo(false)
    } else {
      setIsActive(true)
      setLoading(true)
      const docRef = doc(collection(db, 'groupContents'))
      const id = docRef.id
      if (images === undefined) {
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
        setDoc(doc(db, 'groupContents', id), newGroup)
        setGroup(newGroup)
        setLoading(false)
        setIsInfo(true)
      } else {
        const imageRef = ref(
          storage,
          `images/${nameRef.current.value}_${id}_登山團封面照`,
        )
        uploadBytes(imageRef, images[0]).then(() => {
          getDownloadURL(imageRef).then((url) => {
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
            setDoc(doc(db, 'groupContents', id), newGroup)
            setLoading(false)
            setGroup(newGroup)
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

  async function handleShareButton() {
    if (navigator.share) {
      const shareData = {
        url: `https://find-friends-to-mountain.web.app/activity/${group.groupID}`,
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
    if (docSnap.exists()) {
      const leadPersonData = docSnap.data()
      const oldLeadList = leadPersonData.leadGroup
      let newLeadList = []
      const leadGroupInfo = {
        groupID: group.groupID,
        groupName: group.groupName,
        groupPhoto: group.groupPhoto,
        startDate: group.startDate,
        endDate: group.endDate,
      }
      newLeadList.push(leadGroupInfo, ...oldLeadList)
      updateDoc(userdocRef, { leadGroup: newLeadList })
      navigate(`/activity/${group.groupID}`)
    }
  }

  async function setTheContent() {
    setComplete((current) => !current)
    const docRef = doc(db, 'groupContents', group.groupID)
    setDoc(
      docRef,
      {
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
          ['已解決']: {
            name: '已解決',
            items: [],
          },
        },
      },
      { merge: true },
    )
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
          <PreviewArea>
            <Lists>
              <List>√ 群組密碼為必填資料</List>
              <List>√ 資料可於下個階段做修改，可先填寫基本資訊</List>
              <List>√ 填寫完畢後按下「完成設定」就可分享群組連結給朋友</List>
            </Lists>
          </PreviewArea>
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
          tablet_marginTop="70px"
          alignItems="start"
          border="1px solid #F6EAD6"
          padding="20px 12px 20px 12px"
          style={{
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 0, 0, .25)',
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
            <HashLink
              style={{
                textAlign: 'center',
                height: '40px',
                lineHeight: '40px',
                borderRadius: '8px',
                color: '#F6EAD6',
                width: '100px',
                border: '1px solid #F6EAD6',
                margin: '12px auto 30px auto',
              }}
              onClick={() => setStep(true)}
              smooth
              to="#form"
            >
              下一步
            </HashLink>
          </Basic>
          {step && (
            <>
              <FlexDivide id="form">
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
                tablet_width="30%"
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
                        <Icon src={back} onClick={backToSet} alt="last step" />
                        <Btn
                          width="auto"
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
                        <Icon
                          src={back}
                          onClick={backToSet}
                          alt="go back to last step"
                        />
                        <Btn
                          fontSize="14px"
                          width="auto"
                          border="none"
                          onClick={backToSet}
                        >
                          似乎要再考慮一下，回到上一步
                        </Btn>
                      </Divide>
                    ) : (
                      <Divide justifyContent="flex-start">
                        <Icon src={check} onClick={setTheContent} alt="check" />
                        <Btn
                          fontSize="14px"
                          width="auto"
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
                          <Icon
                            src={share}
                            onClick={handleShareButton}
                            alt="share link"
                          />
                          <Btn
                            fontSize="14px"
                            width="auto"
                            border="none"
                            onClick={handleShareButton}
                          >
                            分享連結，邀請朋友來加入登山團
                          </Btn>
                        </Divide>
                        <HoverBtn
                          height="50px"
                          color="#F6EAD6"
                          width="250px"
                          margin="12px auto 0px"
                          padding="8px"
                          onClick={sendTheInfo}
                          borderRadius="8px"
                        >
                          前往下一步輸入更多團內資訊
                        </HoverBtn>
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
