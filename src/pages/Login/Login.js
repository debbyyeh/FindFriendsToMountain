import React, { useState, useEffect, useRef } from 'react'

import { db, storage, auth } from '../../utils/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import {
  getDocs,
  collection,
  query,
  where,
  addDoc,
  setDoc,
  doc,
  getDoc,
} from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import Map from '../Map/Map'
import backgroundImage from './background.jpg'

const Wrapper = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  margin: 0 auto;
  width: 1200px;
  height: 900px;
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -60%);

  display: flex;
`
const InfoWrapper = styled.div`
  background-color: rgb(0, 0, 0, 0.9);
  height: 100%;
  width: 600px;
  position: absolute;
  transform: translateY(-50%);
  transform: ${(props) => {
    return props.toggle ? 'translateX(0)' : 'translateX(100%)'
  }};
  transition: 0.5s;
`
const ChangeModeDiv = styled.div`
  color: white;
  z-index: 100;
  width: 150px;
  height: 50px;
  background-color: rgb(200, 229, 207);
  position: absolute;
  left: 57%;
  transform: ${(props) => {
    return props.toggle ? 'translateX(-57%) ' : 'translateX(-157%)'
  }};
  transition: 0.5s;
`
const Divide = styled.div`
  display: flex;
`
const SignUp = styled.div`
  width: 50%;
  z-index: 10;
  position: absolute;
  left: 100%;
  transform: translateX(-100%);
`
const LoginForm = styled.form`
  width: 100%;
  z-index: 10;
  padding: 20px 30px;
`
const InfoInput = styled.input`
  border: 1px solid white;
  height: 30px;
  padding: 4px 12px;
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
function Login() {
  const [signUp, setSignUp] = useState(false)
  const [login, setLogin] = useState(true)
  const [images, setImages] = useState()
  const [imageURLs, setImageURLs] = useState()
  const [downloadUrl, setDownloadUrl] = useState([])
  // const [jwtUid, setjwtUid] = useState()
  const [photoNote, setPhotoNote] = useState(true)
  const [mode, setMode] = useState(true)
  const navigate = useNavigate()

  const makeLogin = JSON.parse(window.localStorage.getItem('token'))
  useEffect(() => {
    if (makeLogin !== null) {
      navigate('/profile')
    }
  }, [])
  function signUpUse() {
    setSignUp(true)
  }
  function getPhotoInfo(e) {
    setImages([...e.target.files])
    console.log(e.target.files[0])
    const newImageUrls = URL.createObjectURL(e.target.files[0])
    setImageURLs(newImageUrls)
  }
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  async function signInCheck(data) {
    JSON.stringify(data)
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        console.log(userCredential)
        let userInfo = {
          accessToken: userCredential.user.accessToken,
          uid: userCredential.user.uid,
        }
        console.log(userCredential.user.accessToken, userCredential.user.uid)
        window.localStorage.setItem('token', JSON.stringify(userInfo))
        alert('登入成功')
        navigate('/profile')
      })
      .catch((error) => {
        console.log(error.code)
        if (error.code == 'auth/wrong-password') {
          alert('帳號或密碼有誤')
          const errorMessage = error.message
        }
      })
  }

  const onSubmit = async (data) => {
    if (images.length < 1) {
      alert('照片不得為空')
    } else {
      JSON.stringify(data)
      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
          console.log(userCredential)
          onAuthStateChanged(auth, (currentUser) => {
            const getjwtToken = currentUser.accessToken
            const jwtUid = currentUser.uid
            if (jwtUid !== undefined) {
              const imageRef = ref(storage, `images/${jwtUid}`)
              uploadBytes(imageRef, images[0]).then(() => {
                console.log('檔案上傳成功')
                getDownloadURL(imageRef).then((url) => {
                  setDownloadUrl(url)
                  const newDocRef = setDoc(doc(db, 'users', jwtUid), {
                    id: jwtUid,
                    name: data.nickname,
                    photoURL: url,
                    joinGroup: [],
                    leadGroup: [],
                    equipment: [],
                  })
                  console.log(newDocRef)
                  if (downloadUrl !== undefined) {
                    let userInfo = {
                      accessToken: getjwtToken,
                      uid: jwtUid,
                    }
                    window.localStorage.setItem(
                      'token',
                      JSON.stringify(userInfo),
                    )
                    const makeLogin = JSON.parse(
                      window.localStorage.getItem('token'),
                    )
                    alert('註冊成功')
                    if (makeLogin !== null) {
                      navigate('/profile')
                    }
                  }
                })
              })
            }
          })
        })
        .catch((error) => {
          const errorCode = error.code
          console.log(error.code)
          if (errorCode == 'auth/email-already-in-use') {
            alert('帳號重複註冊')
          } else if (errorCode == 'auth/invalid-email') {
            alert('無效網址')
          }
        })
    }
  }

  return (
    <>
      <div>這是登入頁</div>

      <Wrapper>
        <InfoWrapper toggle={mode}></InfoWrapper>
        <ChangeModeDiv
          toggle={mode}
          onClick={() => {
            setMode(!mode)
            setSignUp((current) => !current)
            setLogin((current) => !current)
          }}
        >
          {signUp ? <p>我要登入</p> : <p>沒有帳號，註冊去!</p>}
        </ChangeModeDiv>
        {login && (
          <>
            {/* <LoginForm> */}
            <LoginForm onSubmit={handleSubmit(signInCheck)}>
              <h2>登入帳號</h2>
              <label htmlFor="email">Email</label>
              <InfoInput
                name="email"
                type="text"
                placeholder="請輸入 email"
                {...register('email', {
                  required: {
                    value: true,
                    message: '欄位必填',
                  },
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: '格式有誤!',
                  },
                })}
              />
              <p>{errors.email?.message}</p>
              <label htmlFor="pwd">密碼</label>
              <InfoInput
                type="password"
                placeholder="password"
                {...register('password', {
                  required: {
                    value: true,
                    message: '請輸入資料內容!',
                  },
                  minLength: {
                    value: 6,
                    message: '密碼長度至少6位元',
                  },
                })}
              />
              <p>{errors.password?.message}</p>
              <input type="submit" value="登入" />
            </LoginForm>
            <div onClick={signUpUse}>還沒有帳號，註冊去</div>
            {/* </LoginForm> */}
          </>
        )}
        {signUp && (
          <SignUp>
            <LoginForm onSubmit={handleSubmit(onSubmit)}>
              <h2>註冊帳號</h2>
              <label htmlFor="email">Email</label>
              <InfoInput
                name="email"
                type="text"
                placeholder="請輸入 email"
                {...register('email', {
                  required: {
                    value: true,
                    message: '欄位必填',
                  },
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: '格式有誤!',
                  },
                })}
              />
              <p>{errors.email?.message}</p>
              <label htmlFor="name">使用者暱稱</label>
              <InfoInput
                type="text"
                placeholder="Nnickname"
                {...register('nickname', {})}
              />
              <p>{errors.Nickname?.message}</p>
              <label htmlFor="pwd">密碼</label>
              <InfoInput
                type="password"
                placeholder="password"
                {...register('password', {
                  required: {
                    value: true,
                    message: '請輸入資料內容!',
                  },
                  minLength: {
                    value: 6,
                    message: '密碼長度至少6位元',
                  },
                })}
              />
              <p>{errors.password?.message}</p>
              <UploadPic>
                {imageURLs ? (
                  <UploadPhoto src={imageURLs} alt="uploadImage" />
                ) : (
                  <AfterUpload></AfterUpload>
                )}
              </UploadPic>
              {!photoNote && <span>照片不得為空</span>}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={getPhotoInfo}
              />
              <input type="submit" value="註冊帳號" />
              <br />
            </LoginForm>
          </SignUp>
        )}

        {/* <Map /> */}
      </Wrapper>
    </>
  )
}
export default Login
