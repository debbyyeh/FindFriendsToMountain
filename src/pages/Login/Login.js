import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../utils/userContext'
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
import styled, { keyframes } from 'styled-components'
import { useForm } from 'react-hook-form'
import backgroundImage from './background.jpg'

const Wrapper = styled.div`
  max-width: calc(1280px - 30px);
  margin: 0 auto;
`
const PhotoWrapper = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  width: 40%;
  height: 80vh;
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -55%);

  display: flex;

  @media screen and (max-width: 1280px) {
    width: calc(100% - 30px);
    height: 80vh;
  }
  @media screen and (max-width: 576px) {
    width: 100%;
  }
`

const InfoWrapper = styled.div`
  background-color: #222322;
  height: 100%;
  width: 50%;
  position: absolute;
  transform: translateY(-50%);
  transform: ${(props) => {
    return props.toggle ? 'translateX(0)' : 'translateX(100%)'
  }};
  transition: 0.5s;
`
const ChangeModeDiv = styled.div`
  cursor: pointer;
  color: #f6ead6;
  font-weight: 700;
  z-index: 100;
  height: 60px;

  text-align: center;

  background-color: #222322;
  position: absolute;
  left: 58%;
  transform: ${(props) => {
    return props.toggle ? 'translateX(-57%) ' : 'translateX(-157%)'
  }};
  transition: 0.5s;
`
const Divide = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 100px;
`
const MainTitle = styled.h2`
  font-size: 36px;
  color: #f6ead6;
  margin-bottom: 150px;

  @media screen and (max-width: 1280px) {
    font-size: 28px;
    margin-bottom: 80px;
  }
  @media screen and (max-width: 767px) {
    font-size: 20px;
    margin-bottom: 40px;
  }
`
const Title = styled.div`
  font-size: 32px;
  color: #f6ead6;
  margin-top: -40px;

  @media screen and (max-width: 1280px) {
    font-size: 24px;
  }
`
const Label = styled.label`
  position: absolute;
  bottom: 35px;
  left: 0;
  transition: all 0.3s ease;
  color: #f6ead6;
  font-size: 32px;
  @media screen and (max-width: 1280px) {
    font-size: 24px;
    bottom: 10px;
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
const SignUp = styled.div`
  width: 50%;
  z-index: 10;
  position: absolute;
  left: 100%;
  transform: translateX(-100%);
`
const LoginForm = styled.form`
  width: 50%;
  z-index: 10;
  padding: 20px 50px;
`
const SignUpForm = styled.form`
  width: 100%;
  padding: 20px 50px;
`

const Btn = styled.button`
  color: #f6ead6;
  border: 1px solid #f6ead6;
  width: 50%;
  margin: 0 auto;
  padding: 30px;
  font-size: 24px;
  display: inherit;

  &:active {
    transform: translateY(0.2rem);
  }

  @media screen and (max-width: 1280px) {
    padding: 18px;
  }
`
const UploadPic = styled.div`
  margin: 20px auto 100px auto;
  width: 180px;
  height: 180px;
  background-color: #d9d9d9;
  border-radius: 8px;
  @media screen and (max-width: 1280px) {
    margin-bottom: 60px;
  }
`
const UploadPhoto = styled.img`
  width: 180px;
  aspect-ratio: 1/1;
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
const FileInput = styled.input``
const FileLabel = styled.label`
  display: inline-block;
  cursor: pointer;

  width: 180px;
  height: 50px;
  margin-top: 16px;
  color: white;
  text-align: center;
  font-size: 24px;
`
const Note = styled.p`
  margin-left: 0;
  color: #5e7e68;
  font-size: 20px;
  margin-top: 0;
`
const Text = styled.div`
  color: #f6ead6;
  font-size: 24px;
  padding: 16px;
  @media screen and (max-width: 1280px) {
    font-size: 20px;
    padding: 12px 0;
  }
`

function Login() {
  const [signUp, setSignUp] = useState(false)
  const [login, setLogin] = useState(true)
  const [images, setImages] = useState()
  const [imageURLs, setImageURLs] = useState()
  const [downloadUrl, setDownloadUrl] = useState([])
  // const [jwtUid, setjwtUid] = useState()
  const userName = useContext(UserContext)
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
  let categoryContent = {
    trail: [],
    highMountain: [],
  }

  const onSubmit = async (data) => {
    if (images.length < 1) {
      alert('照片不得為空')
    } else {
      JSON.stringify(data)
      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
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
                    mountainLists: [],
                    joinGroup: [],
                    leadGroup: [],
                    equipment: [],
                  })
                  console.log(newDocRef)
                  if (downloadUrl !== undefined) {
                    let userInfo = {
                      accessToken: getjwtToken,
                      uid: jwtUid,
                      name: userName,
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
            alert('無效Email')
          }
        })
    }
  }

  return (
    <>
      <Wrapper>
        <PhotoWrapper>
          <InfoWrapper toggle={mode}></InfoWrapper>
          <ChangeModeDiv
            toggle={mode}
            onClick={() => {
              setMode(!mode)
              setSignUp((current) => !current)
              setLogin((current) => !current)
            }}
          >
            {signUp ? <Text>我要登入</Text> : <Text>沒有帳號，註冊去!</Text>}
          </ChangeModeDiv>
          {login && (
            <>
              <LoginForm onSubmit={handleSubmit(signInCheck)}>
                <MainTitle>登入帳號</MainTitle>
                <InputData>
                  <InfoInput
                    name="email"
                    type="text"
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
                  <Underline></Underline>
                  <Label htmlFor="email">Email</Label>
                  <Note>{errors.email?.message}</Note>
                </InputData>
                <InputData>
                  <InfoInput
                    type="password"
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
                  <Underline></Underline>
                  <Label htmlFor="pwd">密碼</Label>
                  <Note>{errors.password?.message}</Note>
                </InputData>
                <Btn type="submit" value="登入">
                  登入
                </Btn>
              </LoginForm>
            </>
          )}
          {signUp && (
            <SignUp>
              <SignUpForm onSubmit={handleSubmit(onSubmit)}>
                <MainTitle>註冊帳號</MainTitle>
                <InputData>
                  <InfoInput
                    name="email"
                    type="text"
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
                  <Underline></Underline>
                  <Label htmlFor="email">Email</Label>
                  <Note>{errors.email?.message}</Note>
                </InputData>
                <InputData>
                  <InfoInput
                    type="text"
                    name="name"
                    {...register('nickname', {
                      required: {
                        value: true,
                        message: '欄位必填',
                      },
                    })}
                  />
                  <Underline></Underline>
                  <Label htmlFor="name">使用者暱稱</Label>
                  <Note>{errors.nickname?.message}</Note>
                </InputData>
                <InputData>
                  <InfoInput
                    type="password"
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
                  <Underline></Underline>
                  <Label htmlFor="pwd">密碼</Label>
                  <Note>{errors.password?.message}</Note>
                </InputData>
                <Title>照片</Title>
                {/* <Divide> */}
                <UploadPic>
                  {imageURLs ? (
                    <UploadPhoto src={imageURLs} alt="uploadImage" />
                  ) : (
                    <AfterUpload></AfterUpload>
                  )}
                  <FileLabel>
                    上傳照片
                    <FileInput
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={getPhotoInfo}
                    />
                  </FileLabel>
                </UploadPic>
                {/* </Divide> */}
                <Btn type="submit" value="註冊帳號">
                  註冊帳號
                </Btn>
              </SignUpForm>
            </SignUp>
          )}
        </PhotoWrapper>
      </Wrapper>
    </>
  )
}
export default Login
