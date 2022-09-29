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
  width: 100%;
  border-radius: 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 70px;
  ${'' /* max-height: 450px; */}
  ${'' /* overflow-y: scroll; */}
  &::-webkit-scrollbar {
    display: none;
    ${'' /* background: #f6ead6;
    border-radius: 4px;
    width: 1px; */}
  }
  &::-webkit-scrollbar-track-piece {
    background: #f6ead6;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.2);
    border: 1px solid #f6ead6;
  }
  &::-webkit-scrollbar-track {
    box-shadow: transparent;
  }
  @media screen and (max-width: 1279px) {
  }
  @media screen and (max-width: 767px) {
    flex-wrap: nowrap;
    flex-direction: row;
  }
`

const BedContainer = styled.div`
  width: calc(100% / 3);
  ${'' /* box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3) inset; */}
  padding: 20px;
  ${'' /* &:last-child {
    margin-right: auto;
  } */}
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
  color: #f6ead6;
  border: 1px dashed #f6ead6;
  @media screen and (max-width: 1279px) {
    width: 40%;
    ${'' /* &:last-child {
      margin-right: auto;
    } */}
  }
`
const RoomDivide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  ${'' /* max-height: 60px;
  overflow-y: scroll; */}
  &::-webkit-scrollbar {
    display: none;
    ${'' /* background: #f6ead6;
    border-radius: 4px;
    width: 1px; */}
  }
  &::-webkit-scrollbar-track-piece {
    background: #f6ead6;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.2);
    border: 1px solid #f6ead6;
  }
  &::-webkit-scrollbar-track {
    box-shadow: transparent;
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
  const [member, setMember] = useState()
  const [latest, setLatest] = useState()
  const [roommate, setRoommate] = useState([])
  const bedGroupName = useRef()
  const seatNum = useRef()
  const value = useContext(UserContext)
  const docRef = doc(db, 'groupContents', groupID)

  useEffect(() => {
    const unsub = onSnapshot(docRef, (doc) => {
      const data = doc.data()
      const latestData = data.bedLists
      setLatest(latestData)
    })
  }, [])

  const BedListForm = ({ addBed }) => {
    function bedSubmit(e) {
      e.preventDefault()
      bedGroupName.current.value &&
        seatNum.current.value &&
        addBed(bedGroupName.current.value, seatNum.current.value)
      setRoommate(Array(Number(seatNum.current.value)).fill(undefined))
    }

    return (
      <>
        <Divide
          justifyContent="center"
          mobile_justifyContent="flex-start"
          marginTop="30px"
        >
          <InfoInput
            width="120px"
            color="#f6ead6"
            backgroundColor="transparent"
            boxShadow="none"
            borderBottom="1px solid #f6ead6"
            mobile_height="30px"
            mobile_width="100px"
            mobile_fontSize="14px"
            ref={bedGroupName}
            placeholder="誰的帳篷"
          />
          <InfoInput
            type="number"
            min="1"
            width="120px"
            color="#f6ead6"
            backgroundColor="transparent"
            boxShadow="none"
            borderBottom="1px solid #f6ead6"
            mobile_width="80px"
            mobile_height="30px"
            mobile_fontSize="14px"
            ref={seatNum}
            placeholder="幾張床"
          />
          <Btn
            borderRadius="24px"
            width="60px"
            mobile_height="30px"
            tablet_fontSize="14px"
            onClick={bedSubmit}
          >
            安排
          </Btn>
        </Divide>
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
    updateBedList(newBed)
  }

  function findRoomate(bedIndex, index, text) {
    let roommateLists = latest[bedIndex].bedArrange
    roommateLists[index] = text
    const newarr = latest[bedIndex].bedArrange.filter((name) => {
      return name !== ''
    })
    latest[bedIndex].bedArrange = newarr
    setRoommate(newarr)
    updateRoommateList()
  }

  function deleteBed(bedIndex) {
    const newBed = [...latest]
    newBed.splice(bedIndex, 1)
    updateBedList(newBed)
  }
  async function updateBedList(latest) {
    const newArr = [...latest]
    const updateBedsToData = await updateDoc(docRef, {
      bedLists: newArr,
    })
  }

  async function updateRoommateList() {
    const newArr = [...latest]
    const updateCarsToData = await updateDoc(docRef, {
      bedLists: newArr,
    })
    value.alertPopup()
    value.setAlertContent('更新成功')
  }

  return (
    <>
      <Divide
        width="80%"
        minHeight="300px"
        flexDirection="column"
        tablet_width="100%"
        style={{
          margin: '50px auto',
        }}
      >
        <Divide flexDirection="column">
          <Text textAlign="center" tablet_fontSize="14px">
            【請輸入下方相關資訊】
          </Text>
          <BedListForm addBed={addBed} />
        </Divide>
        <BedDivide>
          {latest && latest.length > 0 ? (
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
                    <RoomDivide justifyContent="center" flexWrap="wrap">
                      {Array(bed.maxNum)
                        .fill(undefined)
                        .map((_, index) => (
                          <BedPillowContainer
                            style={{
                              backgroundColor: latest[bedIndex].bedArrange[
                                index
                              ]
                                ? '#AC6947'
                                : 'transparent',
                              border: latest[bedIndex].bedArrange[index]
                                ? '1px solid #AC6947 '
                                : '1px dashed #F6EAD6',
                            }}
                            defaultValue={latest[bedIndex].bedArrange[index]}
                            type="text"
                            key={index}
                            placeholder="室友"
                            onChange={(e) => {
                              findRoomate(bedIndex, index, e.target.value)
                            }}
                          />
                        ))}
                    </RoomDivide>
                  </BedContainer>
                </>
              )
            })
          ) : (
            <Divide width="100%" justifyContent="center">
              <SrcImage width="150px" height="120px" src={accommodationIcon} />
            </Divide>
          )}
        </BedDivide>
        {latest && latest.length > 0 && (
          <Btn
            width="150px"
            borderRadius="24px"
            margin="0px auto 0px auto"
            tablet_fontSize="14px"
            mobile_width="100px"
            mobile_height="30px"
            onClick={updateRoommateList}
          >
            儲存送出
          </Btn>
        )}
      </Divide>
    </>
  )
}

export default Accommodation
