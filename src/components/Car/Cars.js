import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { UserContext } from '../../utils/userContext'
import carIcon from './Car.png'
import {
  collection,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../../utils/firebase'

const CarWrapper = styled.div`
  display: flex;
`
const Divide = styled.div`
  display: flex;
  align-items: center;
`
const Btn = styled.button`
  color: white;
  border: 1px solid white;
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
const CarContainer = styled.div`
  width: 20%;
  margin-right: 50px;
`
const SeatContainer = styled.div`
  display: flex;
  justify-content: center;
`
const CarOwner = styled.div`
  text-align: center;
  font-size: 20px;
`
const CarseatContainer = styled.input`
  border: 1px dashed white;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  margin: 8px 4px;
  text-align: center;
  color: white;
`
const DeleteBtn = styled.div`
  color: white;
  border: 1px solid white;

  cursor: pointer;
  margin-left: auto;
`

const LeftNum = styled.div``
const Cars = () => {
  let url = window.location.href
  const newUrl = url.split('/activity/')
  const groupID = newUrl[1]
  const [add, setAdd] = useState(false)
  const [num, setNum] = useState(0)
  const [seat, setSeat] = useState(0)
  const [member, setMember] = useState()
  const [chooseMember, setChooseMember] = useState([])

  const [maxSeat, setMaxSeat] = useState(0)
  const [carInfo, setCarInfo] = useState()
  const [getCar, setGetCar] = useState()
  const [latest, setLatest] = useState()
  const carGroupName = useRef()
  const seatNum = useRef()
  const passengerRef = useRef([])
  const value = useContext(UserContext)
  const docRef = doc(db, 'groupContents', groupID)
  const [passengerNames, setPassengerNames] = useState([])
  useEffect(() => {
    getMemberList()
    getCarArrangeLists()
    const unsub = onSnapshot(docRef, (doc) => {
      const data = doc.data()
      const latestData = data.carLists
      setLatest(latestData)
    })
  }, [])

  async function getMemberList() {
    try {
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        const memberData = data.memberList
        const carData = data.carLists
        setMember(memberData)
        setGetCar(carData)
      }
    } catch {
      console.log('No such document!')
    }
  }

  const CarListForm = ({ addCar }) => {
    function handleSubmit(e) {
      e.preventDefault()
      carGroupName.current.value &&
        seatNum.current.value &&
        addCar(carGroupName.current.value, seatNum.current.value)
      setPassengerNames(Array(Number(seatNum.current.value)).fill(undefined))
    }

    return (
      <>
        {add && (
          <>
            <input ref={carGroupName} placeholder="誰的車" />
            <input type="number" min="1" ref={seatNum} placeholder="幾個座位" />
            <button onClick={handleSubmit}>安排</button>
          </>
        )}
      </>
    )
  }

  const addCar = () => {
    let newCar = []
    const addCarInfo = {
      currentNum: 0,
      whoseCar: carGroupName.current.value,
      maxNum: Number(seatNum.current.value),
      seat: Number(seatNum.current.value),
      passengerArrange: [],
    }
    newCar.push(...latest, addCarInfo)
    console.log(addCarInfo)
    setCarInfo(newCar)
    updateCarList(newCar)
  }

  function findPassenger(carIndex, index, text) {
    console.log(passengerNames)
    console.log(carIndex) //先找到他的車子順序
    let passengerLists = latest[carIndex].passengerArrange
    passengerLists[index] = text

    setPassengerNames(passengerLists)
    updatePassengerList()
  }

  function deleteCar(carIndex) {
    const newCar = [...latest]
    newCar.splice(carIndex, 1)
    updateCarList(newCar)
    setCarInfo(newCar)
  }

  async function updateCarList(carInfo) {
    const newArr = [...carInfo]
    const updateCarsToData = await updateDoc(docRef, {
      carLists: newArr,
    })
  }
  async function updatePassengerList() {
    const newArr = [...latest]
    const updateCarsToData = await updateDoc(docRef, {
      carLists: newArr,
    })
  }
  //取出車子裡的資料
  async function getCarArrangeLists(carIndex) {
    let arrangeLists = latest[carIndex].passengerArrange //取到firebase的資料，所有人的
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
        <CategoryPhoto src={carIcon} />
        <Category>車子分配</Category>
        <AddOne onClick={showInput}>{add ? '-' : '+'}</AddOne>
      </AreaTitle>
      <CarListForm addCar={addCar} />
      <CarWrapper>
        {latest &&
          latest.map((car, carIndex) => {
            return (
              <>
                <CarContainer key={carIndex}>
                  <CarOwner>{car.whoseCar}的車子</CarOwner>
                  <Divide>
                    <CategoryPhoto src={carIcon} />
                    <LeftNum>
                      目前還有{' '}
                      {Number(
                        car.maxNum - latest[carIndex].passengerArrange.length,
                      )}
                      / {Number(car.maxNum)}位置
                    </LeftNum>
                    <DeleteBtn onClick={() => deleteCar(carIndex)}>x</DeleteBtn>
                  </Divide>
                  <SeatContainer>
                    {Array(car.maxNum)
                      .fill(undefined)
                      .map((_, index) => {
                        return (
                          <CarseatContainer
                            defaultValue={
                              latest[carIndex].passengerArrange[index]
                            }
                            type="text"
                            key={index}
                            placeholder="乘客"
                            onChange={(e) => {
                              findPassenger(carIndex, index, e.target.value)
                            }}
                          />
                        )
                      })}
                  </SeatContainer>
                  <Btn onClick={updatePassengerList}>儲存安排</Btn>
                </CarContainer>
              </>
            )
          })}
      </CarWrapper>
    </>
  )
}

export default Cars
