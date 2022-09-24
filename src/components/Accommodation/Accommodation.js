import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { UserContext } from '../../utils/userContext'
import accommodationIcon from './accommodation.png'

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
  top: -20px;
  display: flex;
  width: 140px;
  align-items: center;
  justify-content: center;
  background-color: rgb(48, 61, 48);
  @media screen and (max-width: 767px) {
    top: -15px;
  }
`

const AddOne = styled.div`
  font-size: 18px;
  border-radius: 50%;
  border: 1px solid #f6ead6;
  margin-left: 8px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  @media screen and (max-width: 1279px) {
    width: 20px;
    height: 20px;
    font-size: 14px;
  }
`
const BedDivide = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 30px;
  margin-bottom: 70px;
  @media screen and (max-width: 1279px) {
    max-height: 500px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      ${'' /* display: none; */}
      background: transparent;
      border-radius: 4px;
      width: 2px;
    }
    &::-webkit-scrollbar-track-piece {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: #f6ead6;
      border: 1px solid #f6ead6;
    }
    &::-webkit-scrollbar-track {
      box-shadow: transparent;
    }
  }
  @media screen and (max-width: 767px) {
    flex-wrap: nowrap;
    flex-direction: row;
    ${'' /* display: initial; */}
    max-height: 400px;
    overflow-x: scroll;
    &::-webkit-scrollbar {
      ${'' /* display: none; */}
      background: transparent;
      border-radius: 4px;
      width: 1px;
    }
  }
`

const BedContainer = styled.div`
  width: 45%;
  min-height: 200px;
  margin-bottom: 30px;

  @media screen and (max-width: 1279px) {
    width: 30%;
    ${'' /* &:last-child {
      margin-right: auto;
    } */}
  }
  @media screen and (max-width: 767px) {
    width: 100%;
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
  @media screen and (max-width: 1279px) {
    width: 40%;
    ${'' /* &:last-child {
      margin-right: auto;
    } */}
  }
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
  const [add, setAdd] = useState(true)
  const [num, setNum] = useState(0)
  const [member, setMember] = useState()
  const [chooseMember, setChooseMember] = useState()

  const [maxBed, setMaxBed] = useState(0)
  const [bedInfo, setBedInfo] = useState()
  const [latest, setLatest] = useState()
  const bedGroupName = useRef()
  const seatNum = useRef()
  const value = useContext(UserContext)
  const docRef = doc(db, 'groupContents', groupID)

  useEffect(() => {
    getMemberList()
    getBedArrangeLists()
    const unsub = onSnapshot(docRef, (doc) => {
      const data = doc.data()
      const latestData = data.bedLists
      setLatest(latestData)
    })
  }, [])

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
            <Divide
              justifyContent="center"
              marginTop="20px"
              mobile_justifyContent="flex-start"
            >
              <InfoInput
                width="120px"
                mobile_height="30px"
                mobile_fontSize="14px"
                ref={bedGroupName}
                placeholder="誰的床"
              />
              <InfoInput
                type="number"
                min="1"
                width="120px"
                mobile_width="100px"
                mobile_height="30px"
                mobile_fontSize="14px"
                ref={seatNum}
                placeholder="幾個床位"
              />
              <Btn
                marginLeft="12px"
                width="60px"
                mobile_height="30px"
                tablet_fontSize="14px"
                onClick={bedSubmit}
              >
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

  return (
    <>
      <DivideBorder
        width="45%"
        minHeight="300px"
        position="relative"
        marginTop="50px"
        padding="20px"
        tablet_width="100%"
        border={add ? '4px solid #ac6947' : 'none'}
      >
        <AreaTitle>
          <Text
            fontSize="24px"
            marginRight="12px"
            marginLeft="12px"
            tablet_fontSize="20px"
            mobile_fontSize="16px"
          >
            住宿分配
          </Text>
          <AddOne onClick={() => setAdd((current) => !current)}>
            {add ? '-' : '+'}
          </AddOne>
        </AreaTitle>
        <Text
          textAlign="left"
          position="relative"
          tablet_fontSize="14px"
          margin="12px 0 20px 0"
        >
          請按＋輸入相關資訊
          <BackColor
            width="160px"
            height="5px"
            top="100%"
            left="0"
            tablet_width="140px"
          ></BackColor>
        </Text>
        <BedListForm addBed={addBed} />
        <BedDivide>
          {latest &&
            latest.map((bed, bedIndex) => {
              return (
                <>
                  <BedContainer key={bedIndex}>
                    <Divide justifyContent="center" marginBottom="12px">
                      <Text fontSize="20px" mobile_fontSize="14px">
                        {bed.whoseBed}房間
                      </Text>
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
                      <Text marginTop="8px" mobile_fontSize="14px">
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
        </BedDivide>
        {add && (
          <Btn
            width="150px"
            margin="0px auto 0px auto"
            tablet_fontSize="14px"
            mobile_width="100px"
            position="absolute"
            left="50%"
            top="calc(100% - 20px)"
            style={{
              transform: 'translate(-50%,-100%)',
            }}
            onClick={updateRoommateList}
          >
            儲存送出
          </Btn>
        )}
      </DivideBorder>
    </>
  )
}

export default Accommodation
