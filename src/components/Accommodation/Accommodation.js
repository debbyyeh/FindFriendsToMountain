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

const AccommodationWrapper = styled.div`
  display: flex;
`
const Divide = styled.div`
  display: flex;
  align-items: center;
`
const AreaTitle = styled.div`
  display: flex;
  align-items: center;
`
const CategoryPhoto = styled.img``
const Category = styled.div``

const AddOne = styled.div`
  font-size: 18px;
  border-radius: 50%;
  border: 1px solid white;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
`
const BedContainer = styled.div`
  width: 20%;
  margin-right: 50px;
`

const DeleteBtn = styled.div`
  color: white;
  border: 1px solid white;

  cursor: pointer;
  margin-left: auto;
`
const LeftNum = styled.div``

const BedOwner = styled.div`
  text-align: center;
  font-size: 20px;
`
const BedArrangeContainer = styled.div`
  display: flex;
  justify-content: center;
`
const BedPillowContainer = styled.input`
  border: 1px dashed white;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  margin: 8px 4px;
  text-align: center;
  color: white;
`

const Accommodation = () => {
  let url = window.location.href
  const newUrl = url.split('/activity/')
  const groupID = newUrl[1]
  const [add, setAdd] = useState(false)
  const [num, setNum] = useState(0)
  // const [seat, setSeat] = useState(0)
  const [member, setMember] = useState()
  const [chooseMember, setChooseMember] = useState()

  const [maxBed, setMaxBed] = useState(0)
  const [bedInfo, setBedInfo] = useState()
  const [getBed, setGetBed] = useState()
  const [roommate, setRoommate] = useState()
  const [latest, setLatest] = useState()
  const bedGroupName = useRef()
  const seatNum = useRef()
  const bedRef = useRef([])
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
            <input ref={bedGroupName} placeholder="誰的床" />
            <input type="number" min="1" ref={seatNum} placeholder="幾個床位" />
            <button onClick={bedSubmit}>安排</button>
          </>
        )}
      </>
    )
  }

  const addBed = () => {
    let newBed = []
    const addBedInfo = {
      whoseBed: bedGroupName.current.value,
      currentNumber: 0,
      maxNum: Number(seatNum.current.value),
      seat: Number(seatNum.current.value),
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
    setRoommateNames(roommateLists)
    console.log(roommateLists)
    console.log(roommateNames)
  }

  function deleteBed(bedIndex) {
    const newBed = [...latest]
    console.log(newBed)
    newBed.splice(bedIndex, 1)
    updateBedList(newBed)
    setBedInfo(newBed)
  }
  console.log(bedInfo)
  async function updateBedList(bedInfo) {
    // bedInfo[bedInfo.length - 1].passengerArrange = passengerNames
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
    console.log('更改床位名單')
  }

  async function getBedArrangeLists(bedIndex) {
    let arrangeLists = latest[bedIndex].bedArrange //取到firebase的資料，所有人的
    // let eachMember = arrangeLists[carIndex]
    console.log(arrangeLists)
    setChooseMember(arrangeLists)
  }
  function showInput() {
    setAdd((current) => !current)
  }
  return (
    <>
      <AreaTitle>
        <CategoryPhoto src={accommodationIcon} />
        <Category>住宿分配</Category>
        <AddOne onClick={showInput}>{add ? '-' : '+'}</AddOne>
      </AreaTitle>

      <BedListForm addBed={addBed} />
      <AccommodationWrapper>
        {latest &&
          latest.map((bed, bedIndex) => {
            return (
              <>
                <BedContainer key={bedIndex}>
                  <BedOwner>{bed.whoseBed}房間</BedOwner>
                  <Divide>
                    <CategoryPhoto src={accommodationIcon} />
                    <LeftNum>
                      目前還有 {Number(bed.maxNum)}/ {Number(bed.maxNum)}床位
                    </LeftNum>
                    <DeleteBtn onClick={() => deleteBed(bedIndex)}>x</DeleteBtn>
                  </Divide>
                  <BedArrangeContainer>
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
                  </BedArrangeContainer>

                  <button onClick={updateRoommateList}>Save</button>
                </BedContainer>
              </>
            )
          })}
      </AccommodationWrapper>
    </>
  )
}

export default Accommodation
