import React, { useState, useContext } from 'react'
import { UserContext } from '../../utils/userContext'
import { db, storage, auth } from '../../utils/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { setDoc, doc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useForm } from 'react-hook-form'
import backgroundImage from './background.jpg'
import logo from './Mountain.png'
import mountainMapLists from '../Map/mountainMapLists'

const Wrapper = styled.div`
  max-width: calc(1320px - 40px);
  min-height: 100vh;
  padding-left: 20px;
  padding-right: 20px;
  font-family: Poppins;
  margin: 0 auto;
  position: relative;
`
const PhotoWrapper = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  width: 80%;
  min-height: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;

  @media screen and (max-width: 1280px) {
    width: calc(80% - 30px);
  }
  @media screen and (max-width: 767px) {
    width: 100%;
    margin-top: 50px;
    align-items: start;
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
  color: #b99362;
  font-weight: 700;
  height: 40px;
  padding: 12px;
  width: 155px;
  text-align: center;
  margin: 10px auto;
  opacity: 0.6;
  transition: all 0.3s;
  &:hover {
    opacity: 1;
    border-bottom: 2px solid #b99362;
  }
`
const Divide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 50px;
  @media screen and (max-width: 1279px) {
    margin-bottom: 30px;
  }
`

const MainTitle = styled.div`
  font-size: 28px;
  color: #b99362;

  @media screen and (max-width: 1279px) {
    font-size: 24px;
    margin-top: 0;
  }
  @media screen and (max-width: 767px) {
    font-size: 18px;
  }
`

const Title = styled.div`
  font-size: 20px;
  color: #f6ead6;
  margin-top: -20px;

  @media screen and (max-width: 767px) {
    font-size: 16px;
  }
`
const Label = styled.label`
  position: absolute;
  bottom: 35px;
  left: 0;
  transition: all 0.3s ease;
  color: #f6ead6;
  font-size: 24px;
  @media screen and (max-width: 1279px) {
    font-size: 20px;
    bottom: 30px;
  }
  @media screen and (max-width: 767px) {
    font-size: 16px;
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
  margin-bottom: 60px;
  @media screen and (max-width: 1280px) {
    margin-bottom: 40px;
  }
`
const InfoInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  border-bottom: 1px solid #f6ead6;
  font-size: 20px;

  padding: 8px;
  color: #b99362;

  &:focus ~ label {
    transform: translateY(-15px);
    font-size: 24px;
    color: #ac6947;
    font-weight: bold;
  }
  @media screen and (max-width: 1280px) {
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
  padding: 20px 30px;
  @media screen and (max-width: 1279px) {
    padding: 20px;
  }
`
const SignUpForm = styled.form`
  width: 100%;
  padding: 20px 30px;
  @media screen and (max-width: 1279px) {
    padding: 20px;
  }
`

const Btn = styled.button`
  color: #f6ead6;
  border: 1px solid #f6ead6;
  width: 50%;
  margin: 20px auto 0;
  padding: 8px 12px;
  font-size: 20px;
  display: inherit;
  border-radius: 8px;

  &:active {
    transform: translateY(0.2rem);
  }
  &:hover {
    background-color: #b99362;
  }

  @media screen and (max-width: 1279px) {
    padding: 12px;
    font-size: 16px;
  }
  @media screen and (max-width: 767px) {
    padding: 8px;
    font-size: 14px;
    width: 100%;
  }
`
const UploadPic = styled.div`
  margin: 20px auto 40px auto;
  width: 80px;
  height: 80px;
  background-color: #d9d9d9;
  border-radius: 8px;
  @media screen and (max-width: 1280px) {
    margin-bottom: 40px;
  }
`
const UploadPhoto = styled.img`
  width: 80px;
  aspect-ratio: 1/1;
  background-color: #d9d9d9;
  border-radius: 8px;
  object-fit: cover;
`
const AfterUpload = styled.div`
  width: 80px;
  aspect-ratio: 1/1;
  background-color: #d9d9d9;
  border-radius: 8px;
`
const FileInput = styled.input`
  display: none;
`
const FileLabel = styled.label`
  display: inline-block;
  cursor: pointer;
  width: 180px;
  color: white;
  text-align: center;
  font-size: 14px;
  @media screen and (max-width: 1279px) {
    width: 100px;
  }
`
const Note = styled.p`
  width: 80px;
  margin-left: auto;
  color: #b99362;
  font-size: 14px;
  margin-top: 8px;
`
const Text = styled.div`
  color: #f6ead6;
  font-size: 14px;
`
const LoadingBackground = styled.div`
  position: fixed;
  z-index: 99;
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
    left:400px;
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
const LoadingStyle = styled.span`
  position: absolute;
  top: 50%;
  left: 25%;
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
  }
`

function Login() {
  const [signUp, setSignUp] = useState(false)
  const [login, setLogin] = useState(true)
  const [images, setImages] = useState()
  const [imageURLs, setImageURLs] = useState()
  const [downloadUrl, setDownloadUrl] = useState([])
  const [loading, setLoading] = useState(false)
  const value = useContext(UserContext)
  const [mode, setMode] = useState(true)
  const navigate = useNavigate()

  function getPhotoInfo(e) {
    setImages([...e.target.files])
    const newImageUrls = URL.createObjectURL(e.target.files[0])
    setImageURLs(newImageUrls)
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  async function signInCheck(data) {
    JSON.stringify(data)
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user
        if (user) {
          value.alertPopup()
          value.setAlertContent('登入成功')
          navigate('/profile')
        }
      })
      .catch((error) => {
        if (error.code === 'auth/wrong-password') {
          value.alertPopup()
          value.setAlertContent('帳號或密碼有誤')
        }
      })
  }

  const onSubmit = async (data) => {
    if (images === undefined) {
      value.alertPopup()
      value.setAlertContent('照片不得為空')
    } else {
      setLoading(true)
      JSON.stringify(data)
      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
          onAuthStateChanged(auth, (currentUser) => {
            const jwtUid = currentUser.uid
            if (jwtUid !== undefined) {
              const imageRef = ref(storage, `images/${jwtUid}`)
              uploadBytes(imageRef, images[0]).then(() => {
                getDownloadURL(imageRef).then((url) => {
                  setDownloadUrl(url)
                  setDoc(doc(db, 'users', jwtUid), {
                    id: jwtUid,
                    name: data.nickname,
                    photoURL: url,
                    mountainLists: mountainMapLists,
                    joinGroup: [],
                    leadGroup: [],
                    equipment: [],
                  })
                  if (downloadUrl !== undefined) {
                    setLoading(false)
                    value.alertPopup()
                    value.setAlertContent('註冊成功')
                    navigate('/profile')
                  }
                })
              })
            }
          })
        })
        .catch((error) => {
          const errorCode = error.code
          if (errorCode === 'auth/email-already-in-use') {
            value.alertPopup()
            value.setAlertContent('帳號重複註冊')
            setLoading(false)
          } else if (errorCode === 'auth/invalid-email') {
            value.alertPopup()
            value.setAlertContent('無效Email')
            setLoading(false)
          }
        })
    }
  }

  return (
    <>
      <LoadingBackground loading={loading}>
        <LoadingStyle></LoadingStyle>
      </LoadingBackground>
      <Wrapper>
        <PhotoWrapper>
          <InfoWrapper toggle={mode}></InfoWrapper>
          {login && (
            <>
              <LoginForm onSubmit={handleSubmit(signInCheck)}>
                <Divide>
                  <MainTitle>登入帳號</MainTitle>
                </Divide>
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
                <ChangeModeDiv
                  toggle={mode}
                  onClick={() => {
                    setMode(!mode)
                    setSignUp(true)
                    setLogin(false)
                  }}
                >
                  <Text>沒有帳號，註冊去!</Text>
                </ChangeModeDiv>
                <Text>測試帳號:AppWorks@gmail.com</Text>
                <Text>測試密碼:appworks</Text>
                <Text>另一個測試帳號:frontend@gmail.com</Text>
                <Text>另一個測試密碼:frontend</Text>
                <Text>可以任選一組密碼當團主，開啟團後再邀請另一位加入</Text>
              </LoginForm>
            </>
          )}
          {signUp && (
            <SignUp>
              <SignUpForm onSubmit={handleSubmit(onSubmit)}>
                <Divide>
                  <MainTitle>註冊帳號</MainTitle>
                </Divide>
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
                      onChange={getPhotoInfo}
                    />
                  </FileLabel>
                </UploadPic>
                <Btn type="submit" value="註冊帳號">
                  註冊帳號
                </Btn>
                <ChangeModeDiv
                  toggle={mode}
                  onClick={() => {
                    setMode(!mode)
                    setSignUp(false)
                    setLogin(true)
                  }}
                >
                  <Text>有帳號了，登入去</Text>
                </ChangeModeDiv>
              </SignUpForm>
            </SignUp>
          )}
        </PhotoWrapper>
      </Wrapper>
    </>
  )
}
export default Login
