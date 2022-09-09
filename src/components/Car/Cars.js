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
const CarContainer = styled.div`
  width: 100%;
`
const SeatContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
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
  const [chooseMember, setChooseMember] = useState()

  const [maxSeat, setMaxSeat] = useState(0)
  const [getAllTent, setGetAllTent] = useState()
  const [carInfo, setCarInfo] = useState()
  const [getCar, setGetCar] = useState()
  const [passenger, setPassenger] = useState()
  const [latest, setLatest] = useState()
  const carGroupName = useRef()
  const seatNum = useRef()
  const passengerRef = useRef([])
  const value = useContext(UserContext)
  const docRef = doc(db, 'groupContents', groupID)
  const [passengerNames, setPassengerNames] = useState([])
  useEffect(() => {
    getMemberList()
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
      // console.log()
    }

    return (
      <>
        <input ref={carGroupName} placeholder="誰的車" />
        <input type="number" min="1" ref={seatNum} placeholder="幾個座位" />
        <button onClick={handleSubmit}>安排</button>
      </>
    )
  }

  const addCar = () => {
    let newCar = []
    const addCarInfo = {
      whoseCar: carGroupName.current.value,
      currentNumber: 0,
      maxNum: Number(seatNum.current.value),
      seat: Number(seatNum.current.value),
      passengerArrange: [],
    }
    newCar.push(...latest, addCarInfo)
    console.log(addCarInfo)
    setCarInfo(newCar)
    updateCarList(newCar)
  }

  function findPassenger(index, text) {
    let passengerLists = passengerNames
    passengerLists[index] = text
    setPassengerNames(passengerLists)
    console.log(passengerLists)
    console.log(passengerNames)
  }

  function deleteCar(index) {
    const newCar = [...carInfo]
    console.log(newCar)
    newCar.splice(index, 1)
    updateCarList(newCar)
    setCarInfo(newCar)
  }
  async function updateCarList(carInfo) {
    console.log(carInfo)
    carInfo[carInfo.length - 1].passengerArrange = passengerNames

    console.log(passengerNames)
    const newArr = [...carInfo]
    const updateCarsToData = await updateDoc(docRef, {
      carLists: newArr,
    })
  }

  function showInput() {
    setAdd((current) => !current)
  }
  return (
    <>
      <AreaTitle>
        <CategoryPhoto src={carIcon} />
        <Category>車子分配</Category>
        <AddOne onClick={showInput}>+</AddOne>
      </AreaTitle>
      <CarListForm addCar={addCar} />
      {latest &&
        latest.map((car, index) => {
          return (
            <>
              <CarContainer key={index}>
                <CarOwner>{car.whoseCar}的車子</CarOwner>
                <Divide>
                  <CategoryPhoto src={carIcon} />
                  <LeftNum>
                    目前還有 {Number(car.maxNum)}/ {Number(car.maxNum)}位置
                  </LeftNum>
                  <DeleteBtn onClick={() => deleteCar(index)}>x</DeleteBtn>
                </Divide>
                <SeatContainer>
                  {Array(car.maxNum)
                    .fill(undefined)
                    .map((_, index) => (
                      <CarseatContainer
                        type="text"
                        key={index}
                        placeholder="乘客"
                        onChange={(e) => {
                          findPassenger(index, e.target.value)
                        }}
                      />
                    ))}
                </SeatContainer>
                <button onClick={() => updateCarList(carInfo)}>Save</button>
              </CarContainer>
            </>
          )
        })}
    </>
  )
}

export default Cars
