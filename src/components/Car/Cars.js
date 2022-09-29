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
  ${'' /* position: absolute; */}
  ${'' /* top: -20px; */}
  margin:0 auto;
  display: flex;
  width: 140px;
  align-items: center;
  justify-content: center;
  background-color: rgb(48, 61, 48);
  @media screen and (max-width: 767px) {
    ${'' /* top: -15px; */}
  }
`
const AddOne = styled.div`
  font-size: 18px;
  border-radius: 50%;
  border: 1px solid #f6ead6;
  margin-left: 8px;
  width: 25px;
  height: 25px;
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
const CarContainer = styled.div`
  ${'' /* box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3) inset; */}
  width: calc(100% / 3);
  padding: 20px;
  @media screen and (max-width: 1279px) {
    width: 33%;
  }
  @media screen and (max-width: 767px) {
    width: 100%;
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
const CarDivide = styled.div`
  width: 100%;
  border-radius: 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 70px;
  ${'' /* max-height: 450px;
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
  @media screen and (max-width: 1279px) {
  }
  @media screen and (max-width: 767px) {
    flex-wrap: nowrap;
    flex-direction: row;
    ${'' /* display: initial; */}
  }
`
const SeatDivide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  max-height: 60px;
  overflow-y: scroll;
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
  const [getCar, setGetCar] = useState()
  const [latest, setLatest] = useState()
  const carGroupName = useRef()
  const seatNum = useRef()
  const value = useContext(UserContext)
  const docRef = doc(db, 'groupContents', groupID)
  const [passengerNames, setPassengerNames] = useState([])

  useEffect(() => {
    const unsub = onSnapshot(docRef, (doc) => {
      const data = doc.data()
      const latestData = data.carLists
      setLatest(latestData)
    })
  }, [])

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
            ref={carGroupName}
            mobile_height="30px"
            mobile_width="100px"
            mobile_fontSize="14px"
            placeholder="誰的車"
          />
          <InfoInput
            width="120px"
            color="#f6ead6"
            backgroundColor="transparent"
            boxShadow="none"
            borderBottom="1px solid #f6ead6"
            mobile_width="80px"
            mobile_height="30px"
            mobile_fontSize="14px"
            type="number"
            min="1"
            ref={seatNum}
            placeholder="幾個座位"
          />
          <Btn
            borderRadius="24px"
            width="60px"
            mobile_height="30px"
            tablet_fontSize="14px"
            onClick={handleSubmit}
          >
            安排
          </Btn>
        </Divide>
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
    updateCarList(newCar)
  }

  function findPassenger(carIndex, index, text) {
    let passengerLists = latest[carIndex].passengerArrange
    passengerLists[index] = text
    const newarr = latest[carIndex].passengerArrange.filter((name) => {
      return name !== ''
    })
    latest[carIndex].passengerArrange = newarr
    setPassengerNames(newarr)
    updatePassengerList()
  }

  function deleteCar(carIndex) {
    const newCar = [...latest]
    newCar.splice(carIndex, 1)
    updateCarList(newCar)
  }

  async function updateCarList(latest) {
    const newArr = [...latest]
    const updateCarsToData = await updateDoc(docRef, {
      carLists: newArr,
    })
  }
  async function updatePassengerList() {
    const newArr = [...latest]
    const updateCarsToData = await updateDoc(docRef, {
      carLists: newArr,
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
          <Text textAlign="center">【請輸入下方相關資訊】</Text>
          <CarListForm addCar={addCar} />
        </Divide>
        <CarDivide>
          {latest && latest.length > 0 ? (
            latest.map((car, carIndex) => {
              return (
                <>
                  <CarContainer key={carIndex}>
                    <Divide justifyContent="center" marginBottom="12px">
                      <Text fontSize="20px" mobile_fontSize="14px">
                        {car.whoseCar}的車子
                      </Text>
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
                      <Text marginTop="8px" mobile_fontSize="14px">
                        目前還有{' '}
                        {Number(
                          car.maxNum - latest[carIndex].passengerArrange.length,
                        )}
                        / {Number(car.maxNum)}位置
                      </Text>
                    </Divide>
                    <SeatDivide>
                      {Array(car.maxNum)
                        .fill(undefined)
                        .map((_, index) => {
                          return (
                            <CarseatContainer
                              style={{
                                backgroundColor: latest[carIndex]
                                  .passengerArrange[index]
                                  ? '#AC6947'
                                  : 'transparent',
                                border: latest[carIndex].passengerArrange[index]
                                  ? '1px solid #AC6947 '
                                  : '1px dashed #F6EAD6',
                              }}
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
                    </SeatDivide>
                  </CarContainer>
                </>
              )
            })
          ) : (
            <Divide width="100%" justifyContent="center">
              <SrcImage width="150px" height="75px" src={carIcon} />
            </Divide>
          )}
        </CarDivide>
        {latest && latest.length > 0 && (
          <Btn
            width="150px"
            tablet_fontSize="14px"
            mobile_width="100px"
            borderRadius="24px"
            mobile_height="30px"
            onClick={updatePassengerList}
          >
            儲存送出
          </Btn>
        )}
      </Divide>
    </>
  )
}

export default Cars
