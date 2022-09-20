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
  border: 1px solid white;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
`
const CarContainer = styled.div`
  width: 45%;
  margin-right: 5px;
  margin-top: 30px;
  @media screen and (max-width: 1279px) {
    width: 100%;
    margin-right: 0;
  }
`

const CarseatContainer = styled.input`
  border: 1px dashed white;
  border-radius: 8px;
  width: 50px;
  height: 40px;
  margin: 8px 4px;
  text-align: center;
  color: white;
`

const Cars = ({
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
  const CarDivide = styled(DivideBorder)`
    @media screen and (max-width: 1279px) {
      ${'' /* width: 100%; */}
    }
  `
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
          <Divide justifyContent="center" marginTop="20px">
            <InfoInput width="120px" ref={carGroupName} placeholder="誰的車" />
            <InfoInput
              width="120px"
              type="number"
              min="1"
              ref={seatNum}
              placeholder="幾個座位"
            />
            <Btn marginLeft="12px" width="60px" onClick={handleSubmit}>
              安排
            </Btn>
          </Divide>
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
  async function getCarArrangeLists(carIndex) {
    let arrangeLists = latest[carIndex].passengerArrange
    setChooseMember(arrangeLists)
  }

  function showInput() {
    setAdd((current) => !current)
  }
  return (
    <>
      <CarDivide
        width="50%"
        height="800px"
        position="relative"
        marginTop="50px"
      >
        <AreaTitle>
          <Text fontSize="32px" marginRight="12px" marginLeft="12px">
            車子分配
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

        <CarListForm addCar={addCar} />
        <Divide flexWrap="wrap" justifyContent="center" marginTop="30px">
          {latest &&
            latest.map((car, carIndex) => {
              return (
                <>
                  <CarContainer key={carIndex}>
                    <Divide justifyContent="center">
                      <Text fontSize="20px">{car.whoseCar}的車子</Text>
                      <Btn
                        borderRadius="50%"
                        margin="0px 0px 0px 12px"
                        width="20px"
                        height="20px"
                        padding="0px"
                        onClick={() => deleteCar(carIndex)}
                      >
                        x
                      </Btn>
                    </Divide>
                    <Divide flexDirection="column">
                      <SrcImage
                        src={carIcon}
                        width="70px"
                        height="60px"
                        objectFit="contain"
                      />
                      <Text marginTop="8px">
                        目前還有{' '}
                        {Number(
                          car.maxNum - latest[carIndex].passengerArrange.length,
                        )}
                        / {Number(car.maxNum)}位置
                      </Text>
                    </Divide>
                    <Divide justifyContent="center">
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
                    </Divide>
                  </CarContainer>
                </>
              )
            })}
        </Divide>
        <Btn
          width="150px"
          margin="20px auto 0px auto"
          position="absolute"
          left="40%"
          bottom="30px"
          top="none"
          onClick={updatePassengerList}
        >
          儲存安排
        </Btn>
      </CarDivide>
    </>
  )
}

export default Cars
