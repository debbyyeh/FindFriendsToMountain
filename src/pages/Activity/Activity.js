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
import 'react-calendar/dist/Calendar.css'
import { ProgressBar, Step } from 'react-step-progress-bar'

const Wrapper = styled.div`
  max-width: 1280px;
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
`
const FlexDivide = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
  margin-left: 5%;
  @media screen and (max-width: 1280px) {
    margin-left: 3%;
  }
`

const StepDivide = styled.div`
  display: flex;
  flex-direction: column;
`
// const Step = styled.div`
//   display: flex;
//   flex-direction: column;
//   position: relative;
//   &:actve {
//     ${((props) => props.complete && 'cursor:pointer', 'pointer-events: all')}
//   }
//   &:not(:last-child) {
//     &:before,
//     &:after {
//       display: block;
//       position: absolute;
//       top: 50%;
//       left: 50%;
//       height: 0.25rem;
//       content: '';
//       transform: translateY(-50%);
//       will-change: width;
//       z-index: -1;
//     }
//   }
//   &:before {
//     width: 100%;
//     background-color: gray;
//   }
//   &:after {
//     ${'' /* width: 0; */}
//     background-color: pink;
//     width: ${(props) => (props.complete ? '100% !important' : '0')};
//     opacity: ${(props) => (props.complete ? '1' : '0')};
//     transition: ${(props) =>
//       props.complete
//         ? 'width 0.6s ease-in-out, opacity 0.6s ease-in-out'
//         : 'none'};
//   }
// `
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
  font-size: 32px;
  @media screen and (max-width: 1280px) {
    font-size: 24px;
  }
`
const Text = styled.div`
  color: #f6ead6;
  font-size: 32px;
  margin-bottom: 12px;
  @media screen and (max-width: 1280px) {
    font-size: 24px;
  }
`
const SubText = styled.p`
  font-weight: 300;
  font-size: 20px;
  margin-top: 12px;
  text-align: center;
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
  margin-bottom: 100px;
  @media screen and (max-width: 1280px) {
    margin-bottom: 80px;
  }
`
const InfoInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  border-bottom: 1px solid #f6ead6;
  font-size: 28px;

  padding: 8px 12px;
  color: #875839;

  &:focus ~ label {
    transform: translateY(-30px);
    font-size: 32px;
    color: #ac6947;
    font-weight: bold;
  }
  @media screen and (max-width: 1280px) {
    &:focus ~ label {
      font-size: 28px;
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
`
const PrintArea = styled.div`
  width: 500px;
  margin: 0 auto;
  margin-top: 70px;
`
const Preview = styled.button`
  color: #f6ead6;
  margin: 0 auto;
  font-size: 24px;
  ${'' /* position: absolute;
  top: 110%;
  left: 50%; */}
  ${'' /* transform: translateX(-50%); */}
  width: 300px;
`
const UploadPic = styled.div`
  width: 100%;
  height: 320px;
  background-color: #d9d9d9;
  border-radius: 8px;
  ${'' /* @media screen and (max-width: 1280px) {
    margin-bottom: 60px;
  } */}
`
const UploadPhoto = styled.img`
  width: 100%;
  height: 320px;
  background-color: #d9d9d9;
  border-radius: 8px;
  object-fit: cover;
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
`

const Basic = styled.div`
  width: 45%;
  margin-top: 50px;
`
const FormDate = styled.div`
  width: 100%;
  height: 50%;
  margin-bottom: 50px;
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
      font-size: 24px;
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
  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%;

    .react-calendar__tile {
      max-width: initial !important;
      height: 40px;
      font-size: 20px;
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
const DownloadBtn = styled.button`
  color: #f6ead6;
  ${'' /* border: 1px solid #f6ead6; */}
  width: 30%;
  margin: 30px auto;
  padding: 30px;
  font-size: 24px;
  display: inherit;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) inset;

  ${'' /* position: relative; */}

  &:active {
    box-shadow: none;
  }

  @media screen and (max-width: 1280px) {
    padding: 18px;
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
  background-image: url(${cover});
  background-size: cover;
  width: 400px;
  height: 650px;
  background-position: center;
  background-repeat: no-repeat;
  ${'' /* position: relative; */}
  margin: 0 auto;
  padding: 20px;
  ${'' /* border-radius: 12px; */}
`
const Contents = styled.div`
  width: 100%;
  height: 100%;
  color: #f6ead6;
  font-weight: 700;
  background-color: rgba(19, 31, 25, 0.5);
  padding: 14px;
  ${'' /* border-radius: 12px; */}
  ${'' /* position: absolute; */}
  ${'' /* right: 0; */}
  ${'' /* top: 0; */}
`

const ContentInfo = styled.div`
  margin-top: 8px;
`

const slide = keyframes`
  0% {
    height: 0px;
  }
  
  33% {
    height: 20px;
  }
  55%{
    height:40px;
  }
  
  66% {
    height: 60px;
  }
  88% {
    height: 80px;
  }
  95% {
    height:90px;
  }
  100% {
    height: 100px;
  }
`
const SlideDown = styled.div`
  ${'' /* position: absolute; */}
  ${'' /* top: 120%;
  left: 50%; */}
  width: 2px;
  height: 200px;
  background-color: white;
  height: 200px;
  transition: height 2s ease-in-out;
  animation: ${slide} 2s linear;
`
const SlideDownDefault = styled.div`
  ${'' /* position: absolute; */}
  ${'' /* top: 120%; */}
  ${'' /* left: 50%; */}
  width: 2px;
  height: 400px;
  background-color: rgb(48, 61, 48);
  height: 200px;
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
      setComplete((current) => !current)
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

          if (docSnap.exists()) {
            setIsInfo(true)
            const leadPersonData = docSnap.data()
            const oldLeadList = leadPersonData.leadGroup
            let newLeadList = []
            const leadGroupInfo = {
              groupID: id,
              groupName: nameRef.current.value,
              groupPhoto: url,
              startDate: date[0].toDateString(),
              endDate: date[1].toDateString(),
            }

            newLeadList.push(leadGroupInfo, ...oldLeadList)
            const updateLeadGroup = updateDoc(userdocRef, {
              leadGroup: newLeadList,
            })
          }
        })
      })
    }
  }

  async function getMyGroup() {
    try {
      const docRef = doc(db, 'groupLists', groupID)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setIsPreview(true)
        const mountainData = docSnap.data()
        setGroup(mountainData)
      }
    } catch {
      console.log('No such document!')
    }
  }

  // async function printTheCard() {
  //   const element = printRef.current
  //   const canvas = await html2canvas(element)

  //   const data = canvas.toDataURL('image/jpg')
  //   const link = document.createElement('a')
  //   if (typeof link.download === 'string') {
  //     link.href = data
  //     link.download = 'image/jpg'

  //     document.body.appendChild(link)
  //     link.click()
  //     document.body.removeChild(link)
  //   } else {
  //     window.open(data)
  //   }
  // }

  function setTheContent() {
    const groupRef = setDoc(doc(db, 'groupContents', groupID), {
      bedLists: [],
      carLists: [],
      groupOwner: value.userUid,
      memberList: [],
      todoList: [],
      itinerary: [],
    })
    console.log(groupRef)
    navigate(`/activity/${groupID}`)
  }

  return (
    <>
      <Wrapper>
        <Divide>
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
                <span>Select Date:{date.toDateString()}</span>
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
        <Divide flexDirection="column">
          <DownloadBtn onClick={settingCard}>完成設定</DownloadBtn>
          {complete && <SlideDown></SlideDown>}
          {isInfo && <Preview onClick={getMyGroup}>預覽我的登山資訊</Preview>}
        </Divide>

        {isPreview && (
          <>
            <Card ref={printRef}>
              <Contents>
                <ContentInfo>團名：{group.groupName}</ContentInfo>
                <ContentInfo>
                  {group.groupCity}｜{group.groupMountain}
                </ContentInfo>
                <Divide>
                  <ContentInfo>
                    日期：{group.startDate} - {group.endDate}
                  </ContentInfo>
                </Divide>
                <ContentInfo>團長的話：{group.groupIntro}</ContentInfo>
              </Contents>
            </Card>
            <SubText>若需修改請更改資訊後再按一次完成設定!</SubText>
          </>
        )}

        {isPreview && (
          <Btn
            width="200px"
            margin="0px auto 0px"
            padding="32px"
            onClick={setTheContent}
            borderRadius="12px"
          >
            繼續編輯下一步
          </Btn>
        )}

        {/* <PrintArea>
          {isPreview && (
            <>
              <div ref={printRef}></div>
              
            </>
          )}
          
        </PrintArea> */}
      </Wrapper>
    </>
  )
}

export default Activity
