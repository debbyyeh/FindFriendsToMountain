import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../utils/userContext'
import { db, storage, auth } from '../../utils/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { setDoc, doc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useForm } from 'react-hook-form'
import backgroundImage from './background.jpg'

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
  width: 50%;
  height: 100vh;
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
  z-index: 100;
  height: 40px;
  padding: 12px;

  text-align: center;

  background-color: #222322;
  position: absolute;
  left: 55%;
  transform: ${(props) => {
    return props.toggle ? 'translateX(-55%) ' : 'translateX(-155%)'
  }};
  transition: 0.5s;
  @media screen and (max-width: 767px) {
    top: -50px;
    right: 0;
    left: 0;
    transform: none;
    background-color: transparent;
    text-align: right;
  }
`

const MainTitle = styled.h2`
  font-size: 32px;
  color: #b99362;
  margin-bottom: 100px;

  @media screen and (max-width: 1279px) {
    font-size: 24px;
    margin-bottom: 40px;
    margin-top: 0;
  }
  @media screen and (max-width: 767px) {
    font-size: 18px;
    margin-bottom: 20px;
  }
`
const Title = styled.div`
  font-size: 24px;
  color: #f6ead6;
  margin-top: -20px;

  @media screen and (max-width: 1279px) {
    font-size: 20px;
  }
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
    padding: 15px;
  }
`
const SignUpForm = styled.form`
  width: 100%;
  padding: 20px 30px;
  @media screen and (max-width: 1279px) {
    padding: 15px;
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

  &:active {
    transform: translateY(0.2rem);
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
const FileInput = styled.input``
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
  margin-left: 0;
  color: #b99362;
  font-size: 14px;
  margin-top: 0;
`
const Text = styled.div`
  color: #f6ead6;
  font-size: 14px;
`

function Login() {
  const [signUp, setSignUp] = useState(false)
  const [login, setLogin] = useState(true)
  const [images, setImages] = useState()
  const [imageURLs, setImageURLs] = useState()
  const [downloadUrl, setDownloadUrl] = useState([])
  const [jwtUid, setjwtUid] = useState()
  const value = useContext(UserContext)
  const [mode, setMode] = useState(true)
  const navigate = useNavigate()

  // useEffect(() => {
  //   if (value.userAuth !== null) {
  //     navigate('/profile')
  //   }
  // }, [value.userAuth])
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
        const user = userCredential.user
        if (user) {
          setjwtUid(user.uid)
          alert('登入成功')
          navigate('/profile')
        }
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
          onAuthStateChanged(auth, (currentUser) => {
            // const user = userCredential.user;
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
                    console.log('loading')
                    alert('註冊成功')
                    navigate('/profile')
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
          {/* <ChangeModeDiv
            toggle={mode}
            onClick={() => {
              setMode(!mode)
              setSignUp((current) => !current)
              setLogin((current) => !current)
            }}
          >
            {signUp ? <Text>我要登入</Text> : <Text>沒有帳號，註冊去!</Text>}
          </ChangeModeDiv> */}
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
                <ChangeModeDiv
                  toggle={mode}
                  onClick={() => {
                    setMode(!mode)
                    setSignUp((current) => !current)
                    setLogin((current) => !current)
                  }}
                >
                  {signUp ? (
                    <Text>我要登入</Text>
                  ) : (
                    <Text>沒有帳號，註冊去!</Text>
                  )}
                </ChangeModeDiv>
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
