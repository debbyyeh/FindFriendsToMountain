import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { db, storage } from '../../utils/firebase'
import { collection, setDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import html2canvas from 'html2canvas'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const Wrapper = styled.div`
  width: calc(1280px - 30px);
  margin: 0 auto;
`
const Divide = styled.div`
  display: flex;
  justify-content: space-between;
`
const Card = styled.div`
  border: 1px solid white;
`
const PrintArea = styled.div`
  width: 500px;
  margin: 0 auto;
  margin-top: 70px;
`
const Preview = styled.button`
  color: white;
  margin: 0 auto;
`
const UploadPic = styled.div`
  margin-top: 20px;
  width: 100px;
  height: 100px;
  background-color: #d9d9d9;
  border-radius: 8px;
`
const UploadPhoto = styled.img`
  width: 100%;
  aspect-ratio: 1/1;
  background-color: #d9d9d9;
  border-radius: 8px;
  object-fit: cover;
`
const AfterUpload = styled.div`
  width: 100px;
  aspect-ratio: 1/1;
  background-color: #d9d9d9;
  border-radius: 8px;
`
const FormLabel = styled.label`
  display: block;
  font-size: 20px;
  color: white;
`
const InfoInput = styled.input`
  border: 1px solid white;
  height: 30px;
  color: white;
  font-size: 24px;
  width: 100%;
`
const Cover = styled.img`
  width: 150px;
  height: 200px;
  object-fit: cover;
`
const Next = styled.button`
  color: white;
  cursor: pointer;
`

const Basic = styled.div`
  width: 20%;
`
const FormDate = styled.div`
  width: 40%;
`
const Photo = styled.div`
  width: 30%;
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
    padding: 5px 0;
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
    background-color: #b99362;
  }
`

function Activity() {
  const nameRef = useRef()
  const groupPassword = useRef()
  const cityRef = useRef()
  const mountainRef = useRef()
  const textRef = useRef()
  const startDateRef = useRef()
  const endDateRef = useRef()
  const printRef = useRef()
  const [images, setImages] = useState()
  const [imageURLs, setImageURLs] = useState()
  const [downloadUrl, setDownloadUrl] = useState([])
  const [group, setGroup] = useState()
  const [groupID, setGroupID] = useState()
  const [isInfo, setIsInfo] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [date, setDate] = useState(new Date())
  const navigate = useNavigate()
  const makeLogin = JSON.parse(window.localStorage.getItem('token'))
  const jwtToken = makeLogin.uid
  function getPhotoInfo(e) {
    setImages([...e.target.files])
    console.log(e.target.files[0])
    const newImageUrls = URL.createObjectURL(e.target.files[0])
    setImageURLs(newImageUrls)
  }

  useEffect(() => {
    async function getMyGroup() {
      console.log('取得登山資訊')
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
      textRef.current.value == ''
    ) {
      alert('表格不可為空')
      setIsInfo(false)
    } else {
      setIsInfo(true)
      const userdocRef = doc(db, 'users', jwtToken)
      const docRef = doc(collection(db, 'groupLists'))
      const docSnap = await getDoc(userdocRef)
      const id = docRef.id
      setGroupID(id)

      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data())
        const leadPersonData = docSnap.data()
        const oldLeadList = leadPersonData.leadGroup
        let newLeadList = []
        const leadGroupInfo = {
          groupID: id,
          groupName: nameRef.current.value,
        }

        newLeadList.push(leadGroupInfo, ...oldLeadList)
        const updateLeadGroup = await updateDoc(userdocRef, {
          leadGroup: newLeadList,
        })
      }
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
            groupOwner: makeLogin.uid,
            groupPhoto: url,
            groupCity: cityRef.current.value,
            groupMountain: mountainRef.current.value,
            groupPassword: groupPassword.current.value,
            startDate: date[0].toDateString(),
            endDate: date[1].toDateString(),
            groupIntro: textRef.current.value,
          })
          console.log(newDocRef)
          setGroup(newDocRef)
        })
      })
    }
  }

  async function getMyGroup() {
    setIsPreview(true)
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

  async function printTheCard() {
    const element = printRef.current
    console.log(element)
    const canvas = await html2canvas(element)

    const data = canvas.toDataURL('image/jpg')
    const link = document.createElement('a')
    console.log(canvas, data)
    if (typeof link.download === 'string') {
      link.href = data
      link.download = 'image/jpg'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      window.open(data)
    }
  }

  function setTheContent() {
    const groupRef = setDoc(doc(db, 'groupContents', groupID), {
      bedLists: [],
      carLists: [],
      groupOwner: makeLogin.uid,
      memberList: [],
      todoList: [],
    })
    navigate(`/activity/${groupID}`)
  }
  console.log(group)
  return (
    <>
      <Wrapper>
        <Divide>
          <Basic>
            <div>這是活動頁面1</div>
            <FormLabel>登山團名稱</FormLabel>
            <InfoInput type="text" ref={nameRef} />
            <FormLabel>群組密碼</FormLabel>
            <InfoInput type="text" ref={groupPassword} />
            <FormLabel>開團路線</FormLabel>
            <InfoInput type="text" placeholder="縣市" ref={cityRef} />
            <FormLabel>開團山名</FormLabel>
            <InfoInput type="text" placeholder="山名" ref={mountainRef} />
            <FormLabel>路線介紹</FormLabel>
            <InfoInput type="text" placeholder="簡介" ref={textRef} />
          </Basic>
          <FormDate>
            <FormLabel>開團日期</FormLabel>
            <CalendarContainer>
              <Calendar
                // calendarType="US"
                onChange={setDate}
                value={date}
                selectRange={true}
              />
            </CalendarContainer>

            {date.length > 0 ? (
              <>
                <div>startDate:{date[0].toDateString()}</div>
                <div>EndDate:{date[1].toDateString()}</div>
              </>
            ) : (
              <span>Select Date:{date.toDateString()}</span>
            )}
          </FormDate>
          <Photo>
            {/* <p>startDate</p>
            <InfoInput type="date" ref={startDateRef} />
            <p>endDate</p>
            <InfoInput type="date" ref={endDateRef} /> */}
            <FormLabel>封面照片</FormLabel>
            <UploadPic>
              {imageURLs ? (
                <UploadPhoto src={imageURLs} alt="uploadImage" />
              ) : (
                <AfterUpload></AfterUpload>
              )}
            </UploadPic>
            <InfoInput
              type="file"
              accept="image/*"
              multiple
              onChange={getPhotoInfo}
            />
            <button onClick={settingCard}>完成設定</button>
          </Photo>
        </Divide>
        <PrintArea>
          {isInfo && <Preview onClick={getMyGroup}>預覽我的登山資訊</Preview>}
          {isPreview && (
            <>
              <div ref={printRef}>
                <div>{group.groupName}</div>
                <div>
                  {group.groupCity}
                  <span>{group.groupMountain}</span>
                </div>
                <div>{group.startDate}</div>
                <div>{group.endDate}</div>
                {/* <Cover src={group.groupPhoto} /> */}
                <div>{group.groupIntro}</div>
              </div>
              <button onClick={printTheCard}>下載成圖片分享</button>
            </>
          )}
          {isPreview && <Next onClick={setTheContent}>繼續編輯下一步</Next>}
        </PrintArea>
      </Wrapper>
    </>
  )
}

export default Activity
