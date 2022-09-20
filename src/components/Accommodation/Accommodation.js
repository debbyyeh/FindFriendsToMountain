import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { UserContext } from '../../utils/userContext'
import accommodationIcon from './accommodation.png'
import { useMediaQuery } from 'react-responsive'

import {
  collection,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../../utils/firebase'

const Wrapper = styled.div`
  max-width: calc(1320px - 40px);
  padding-left: 20px;
  padding-right: 20px;
  margin: 0 auto;
  font-family: Poppins;
`

const AreaTitle = styled.div`
  position: absolute;
  top: -30px;
  display: flex;
  width: 200px;
  align-items: center;
  background-color: rgb(48, 61, 48);
`

const AddOne = styled.div`
  font-size: 18px;
  border-radius: 50%;
  border: 1px solid #f6ead6;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
`
const BedContainer = styled.div`
  width: 45%;
  margin-right: 5px;
  margin-top: 30px;

  @media screen and (max-width: 1279px) {
    width: 100%;
    margin-right: 0;
  }
`

const BedPillowContainer = styled.input`
  border-radius: 8px;
  width: 50px;
  height: 40px;
  margin: 8px 4px;
  text-align: center;
  color: white;
  border: 1px dashed white;
`

const Accommodation = ({
  Text,
  DivideBorder,
  Divide,
  Btn,
  InfoInput,
  BackColor,
  SrcImage,
}) => {
  let url = window.location.href
  const newUrl = url.split('/activity/')
  const groupID = newUrl[1]
  const [add, setAdd] = useState(false)
  const [num, setNum] = useState(0)
  const [member, setMember] = useState()
  const [chooseMember, setChooseMember] = useState()

  const [maxBed, setMaxBed] = useState(0)
  const [bedInfo, setBedInfo] = useState()
  const [getBed, setGetBed] = useState()
  const [roommate, setRoommate] = useState(false)
  const [latest, setLatest] = useState()
  const bedGroupName = useRef()
  const seatNum = useRef()
  const value = useContext(UserContext)
  const docRef = doc(db, 'groupContents', groupID)
  const [roommateNames, setRoommateNames] = useState([])
  useEffect(() => {
    getMemberList()
    getBedArrangeLists()
    const unsub = onSnapshot(docRef, (doc) => {
      const data = doc.data()
      const latestData = data.bedLists
      setLatest(latestData)
    })
  }, [])
  const BedDivide = styled(DivideBorder)`
    ${'' /* @media screen and (max-width: 1279px) {
      ${'' /* width: 100%; */}
  `
  async function getMemberList() {
    try {
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        const memberData = data.memberList
        const bedData = data.bedLists
        setMember(memberData)
      }
    } catch {
      console.log('No such document!')
    }
  }

  const BedListForm = ({ addBed }) => {
    function bedSubmit(e) {
      e.preventDefault()
      bedGroupName.current.value &&
        seatNum.current.value &&
        addBed(bedGroupName.current.value, seatNum.current.value)
    }

    return (
      <>
        {add && (
          <>
            <Divide justifyContent="center" marginTop="20px">
              <InfoInput
                width="120px"
                ref={bedGroupName}
                placeholder="誰的床"
              />
              <InfoInput
                type="number"
                min="1"
                width="120px"
                ref={seatNum}
                placeholder="幾個床位"
              />
              <Btn marginLeft="12px" width="60px" onClick={bedSubmit}>
                安排
              </Btn>
            </Divide>
          </>
        )}
      </>
    )
  }

  const addBed = () => {
    let newBed = []
    const addBedInfo = {
      whoseBed: bedGroupName.current.value,
      maxNum: Number(seatNum.current.value),
      bed: Number(seatNum.current.value),
      bedArrange: [],
    }
    newBed.push(...latest, addBedInfo)
    console.log(addBedInfo)
    setBedInfo(newBed)
    updateBedList(newBed)
  }

  function findRoomate(bedIndex, index, text) {
    let roommateLists = latest[bedIndex].bedArrange
    roommateLists[index] = text
  }
  function deleteBed(bedIndex) {
    const newBed = [...latest]
    newBed.splice(bedIndex, 1)
    updateBedList(newBed)
    setBedInfo(newBed)
  }
  async function updateBedList(bedInfo) {
    const newArr = [...bedInfo]
    const updateBedsToData = await updateDoc(docRef, {
      bedLists: newArr,
    })
  }

  async function updateRoommateList() {
    const newArr = [...latest]
    const updateCarsToData = await updateDoc(docRef, {
      bedLists: newArr,
    })
    window.alert('更新成功')
  }

  async function getBedArrangeLists(bedIndex) {
    let arrangeLists = latest[bedIndex].bedArrange
    setChooseMember(arrangeLists)
  }
  function showInput() {
    setAdd((current) => !current)
  }

  const isTablet = useMediaQuery({
    query: '(max-width: 1279px)',
  })
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  })
  const isCellPhone = useMediaQuery({
    query: '(max-width: 567px)',
  })

  return (
    <>
      <BedDivide
        width="50%"
        height="800px"
        position="relative"
        marginTop="50px"
      >
        <AreaTitle>
          <Text fontSize="32px" marginRight="12px" marginLeft="12px">
            住宿分配
          </Text>

          <AddOne onClick={showInput}>{add ? '-' : '+'}</AddOne>
        </AreaTitle>

        <Text textAlign="left" position="relative">
          請按＋輸入相關資訊
          <BackColor
            width="185px"
            height="10px"
            top="20px"
            left="2px"
          ></BackColor>
        </Text>

        <BedListForm addBed={addBed} />
        {/* <Divide flexDirection="column"> */}
        <Divide flexWrap="wrap" justifyContent="center" marginTop="30px">
          {latest &&
            latest.map((bed, bedIndex) => {
              return (
                <>
                  <BedContainer key={bedIndex}>
                    <Divide justifyContent="center" marginBottom="12px">
                      <Text fontSize="20px">{bed.whoseBed}房間</Text>
                      <Btn
                        borderRadius="50%"
                        margin="0px 0px 0px 12px"
                        width="20px"
                        height="20px"
                        padding="0px"
                        onClick={() => deleteBed(bedIndex)}
                      >
                        x
                      </Btn>
                    </Divide>

                    <Divide flexDirection="column">
                      <SrcImage
                        width="70px"
                        height="60px"
                        src={accommodationIcon}
                      />
                      <Text marginTop="8px">
                        目前還有{' '}
                        {Number(
                          bed.maxNum - latest[bedIndex].bedArrange.length,
                        )}
                        / {Number(bed.maxNum)}床位
                      </Text>
                    </Divide>
                    <Divide justifyContent="center" flexWrap="wrap">
                      {Array(bed.maxNum)
                        .fill(undefined)
                        .map((_, index) => (
                          <BedPillowContainer
                            defaultValue={latest[bedIndex].bedArrange[index]}
                            type="text"
                            key={index}
                            placeholder="室友"
                            onChange={(e) => {
                              findRoomate(bedIndex, index, e.target.value)
                            }}
                          />
                        ))}
                    </Divide>
                  </BedContainer>
                </>
              )
            })}
        </Divide>
        {/* </Divide> */}
        <Btn
          width="150px"
          margin="20px auto 0px auto"
          position="absolute"
          left="40%"
          bottom="30px"
          top="none"
          onClick={updateRoommateList}
        >
          儲存送出
        </Btn>
      </BedDivide>
    </>
  )
}

export default Accommodation
