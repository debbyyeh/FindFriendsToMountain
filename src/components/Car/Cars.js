import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { UserContext } from '../../utils/userContext'
import { useParams } from 'react-router-dom'
import carIcon from './Car.png'
import cancel from './CancelNormal.png'
import cancelHover from './Cancel.png'
import {
  collection,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../../utils/firebase'

const CarContainer = styled.div`
  width: calc(100% / 3);
  padding: 20px;
  @media screen and (max-width: 767px) {
    width: 100%;
    padding: 0;
    margin-bottom: 20px;
  }
`

const CarseatContainer = styled.input`
  border-radius: 8px;
  width: 47%;
  height: 40px;
  margin: 8px 4px;
  text-align: center;
  color: #f6ead6;
  border: 1px dashed #f6ead6;
  font-size: 16px;
  color: #222322;
  @media screen and (max-width: 1279px) {
    width: 40%;
  }
`
const CarDivide = styled.div`
  width: 100%;
  border-radius: 12px;
  margin-top: 30px;
  margin-bottom: 30px;
`
const SeatDivide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`
const ScrollDivide = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  @media screen and (max-width: 767px) {
    max-height: 500px;
    overflow-y: scroll;
    margin: 0 auto;
    &::-webkit-scrollbar {
      width: 1px;
    }
    &::-webkit-scrollbar-button {
      display: none;
    }
    &::-webkit-scrollbar-track-piece {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: rgba(0, 0, 0, 0.2);
      border: 1px solid #f6ead6;
    }
    &::-webkit-scrollbar-track {
      box-shadow: transparent;
    }
  }
`
const CancelBtn = styled.div`
  cursor: pointer;
  background-image: url(${cancel});
  background-size: cover;
  width: 30px;
  height: 30px;
  margin-left: 12px;
  transition: all 0.3s;
  &:hover {
    background-image: url(${cancelHover});
  }
  @media screen and (max-width: 1279px) {
    width: 20px;
    height: 20px;
  }
`

const Cars = ({ Text, Divide, Btn, InfoInput, BackColor, SrcImage }) => {
  const urlID = useParams()
  const [latest, setLatest] = useState()
  const [leftNum, setLeftNum] = useState(0)
  const carGroupName = useRef()
  const seatNum = useRef()
  const value = useContext(UserContext)
  const docRef = doc(db, 'groupContents', urlID.id)
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
    updateCarSeatList(latest)
  }

  async function updateCarSeatList(latest) {
    const newArr = [...latest]
    const updateCarsToData = await updateDoc(docRef, {
      carLists: newArr,
    })
    value.alertPopup()
    value.setAlertContent('更新成功')
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

  return (
    <>
      <Divide
        width="100%"
        minHeight="300px"
        flexDirection="column"
        tablet_width="100%"
        padding="20px 60px 20px 60px"
        tablet_padding="20px 20px 20px 20px"
        style={{
          margin: '50px auto',
          border: '1px solid white',
          borderRadius: '24px',
        }}
      >
        <Divide flexDirection="column">
          <Text textAlign="center">【請輸入下方相關資訊】</Text>
          <CarListForm addCar={addCar} />
        </Divide>
        <CarDivide>
          <ScrollDivide>
            {latest && latest.length > 0 ? (
              latest.map((car, carIndex) => {
                return (
                  <>
                    <CarContainer key={carIndex}>
                      <Divide justifyContent="center" marginBottom="12px">
                        <Text fontSize="20px" mobile_fontSize="14px">
                          {car.whoseCar}的車子
                        </Text>
                        <CancelBtn
                          onClick={() => deleteCar(carIndex)}
                        ></CancelBtn>
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
                            car.maxNum -
                              latest[carIndex].passengerArrange.length,
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
                                    ? '#B99362'
                                    : 'transparent',
                                  border: latest[carIndex].passengerArrange[
                                    index
                                  ]
                                    ? '1px solid #B99362'
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
              <>
                <SrcImage
                  width="150px"
                  height="125px"
                  style={{
                    objectFit: 'contain',
                    margin: '0 auto',
                  }}
                  src={carIcon}
                />
              </>
            )}
          </ScrollDivide>
        </CarDivide>
        {latest && latest.length > 0 && (
          <Btn
            width="150px"
            tablet_fontSize="14px"
            mobile_width="100px"
            borderRadius="24px"
            mobile_height="30px"
            onClick={updateCarSeatList}
          >
            儲存送出
          </Btn>
        )}
      </Divide>
    </>
  )
}

export default Cars
