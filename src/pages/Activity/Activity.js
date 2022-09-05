import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { db, storage } from '../../utils/firebase'
import { collection, setDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import html2canvas from 'html2canvas'
import { Link, useNavigate, useParams } from 'react-router-dom'
const Divide = styled.div`
  display: flex;
  justify-content: space-between;
  width: 1200px;
  margin: 0 auto;
`
const Card = styled.div`
  border: 1px solid white;
`
const UploadPic = styled.div`
  margin-top: 20px;
  width: 100px;
  height: 100px;
  background-color: #d9d9d9;
  border-radius: 8px;
`
const UploadPhoto = styled.img`
  width: 100px;
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
const Cover = styled.img`
  width: 150px;
  height: 200px;
  object-fit: cover;
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
    const docRef = doc(collection(db, 'groupLists'))
    const userdocRef = doc(db, 'users', jwtToken)
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
          startDate: startDateRef.current.value,
          endDate: endDateRef.current.value,
          groupIntro: textRef.current.value,
        })
        setGroup(newDocRef)
      })
    })
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
  }
  return (
    <>
      <Divide>
        <div>
          <div>這是活動頁面1</div>
          <div>登山團名稱</div>
          <input type="text" ref={nameRef} />
          <div>封面照片</div>
          <UploadPic>
            {imageURLs ? (
              <UploadPhoto src={imageURLs} alt="uploadImage" />
            ) : (
              <AfterUpload></AfterUpload>
            )}
          </UploadPic>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={getPhotoInfo}
          />
          <div>群組密碼</div>
          <input type="text" ref={groupPassword} />
        </div>
        <div>
          <div>開團日期</div>
          <p>startDate</p>
          <input type="date" ref={startDateRef} />
          <p>endDate</p>
          <input type="date" ref={endDateRef} />
          <div>開團路線</div>
          <input type="text" placeholder="縣市" ref={cityRef} />
          <input type="text" placeholder="山名" ref={mountainRef} />

          <div>路線介紹</div>
          <input type="text" placeholder="縣市" ref={textRef} />
          <button onClick={settingCard}>完成設定</button>
        </div>
        <div>
          {group && (
            <>
              <button>預覽我的登山資訊</button>
              <Card>
                <div>{group.groupName}</div>
                <div>
                  {group.groupCity}
                  <span>{group.groupMountain}</span>
                </div>
                <div>{group.startDate}</div>
                <div>{group.endDate}</div>
                <Cover src={group.groupPhoto} ref={printRef} />
                <div>{group.groupIntro}</div>
              </Card>
              <button onClick={printTheCard}>下載成圖片分享</button>
            </>
          )}
          {groupID && (
            <Link onClick={setTheContent} to={`Activity/${groupID}`}>
              繼續編輯下一步
            </Link>
          )}
        </div>
      </Divide>
    </>
  )
}

export default Activity
