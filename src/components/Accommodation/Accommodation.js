import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { Text, Divide, Btn, InfoInput, SrcImage } from '../../css/style'
import { UserContext } from '../../utils/userContext'
import { useParams } from 'react-router-dom'
import accommodationIcon from './accommodation.png'
import cancel from '../../images/CancelNormal.png'
import cancelHover from '../../images/Cancel.png'

import { doc, updateDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../utils/firebase'

const BedDivide = styled.div`
  width: 100%;
  border-radius: 12px;
  margin-top: 30px;
  margin-bottom: 30px;
`

const BedContainer = styled.div`
  width: calc(100% / 3);
  padding: 20px;
  @media screen and (max-width: 767px) {
    width: 100%;
    padding: 0;
    margin-bottom: 20px;
  }
`

const BedPillowContainer = styled.input`
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
const RoomDivide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`
const ScrollDivide = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  @media screen and (max-width: 767px) {
    max-height: 500px;
    overflow-y: scroll;
    margin: 0 auto;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #f6ead6;
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
const BedImage = styled.img`
  width: 70px;
  height: 60px;
  object-fit: cover;
`
const DefaultImage = styled(BedImage)`
  width: 150px;
  height: 125px;
  margin: 0 auto;
`

const Accommodation = () => {
  const urlID = useParams()
  const [latest, setLatest] = useState()
  const bedGroupName = useRef()
  const bedNum = useRef()
  const value = useContext(UserContext)
  const docRef = doc(db, 'groupContents', urlID.id)

  useEffect(() => {
    onSnapshot(docRef, (doc) => {
      const data = doc.data()
      const latestData = data.bedLists
      setLatest(latestData)
    })
  }, [])

  const BedListForm = ({ addBed }) => {
    function bedSubmit(e) {
      e.preventDefault()
      bedGroupName.current.value &&
        bedNum.current.value &&
        addBed(bedGroupName.current.value, bedNum.current.value)
    }

    return (
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
          ref={bedNum}
          placeholder="幾個床位"
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
    )
  }

  const addBed = () => {
    let newBed = []
    const addBedInfo = {
      whoseBed: bedGroupName.current.value,
      maxNum: Number(bedNum.current.value),
      bed: Number(bedNum.current.value),
      bedArrange: Array(Number(bedNum.current.value)).fill(null),
    }
    newBed.push(...latest, addBedInfo)
    updateBedList(newBed)
  }

  function findRoomate(bedIndex, index, text) {
    latest[bedIndex].bedArrange[index] = text
    const newarr = latest[bedIndex].bedArrange.filter((name) => {
      return name !== null && name !== ''
    })
    latest[bedIndex].bed = newarr.length
    updateRoommateList(latest)
  }

  function deleteBed(bedIndex) {
    const newBed = [...latest]
    newBed.splice(bedIndex, 1)
    updateBedList(newBed)
  }
  async function updateBedList(latest) {
    const newArr = [...latest]
    await updateDoc(docRef, {
      bedLists: newArr,
    })
  }

  async function updateRoommateList(latest) {
    await updateDoc(docRef, { bedLists: latest })
    value.alertPopup()
    value.setAlertContent('更新成功')
  }

  return (
    <Divide
      width="100%"
      minHeight="300px"
      flexDirection="column"
      padding="20px 60px 20px 60px"
      tablet_padding="20px 20px 20px 20px"
      style={{
        margin: '50px auto',
        border: '1px solid white',
        borderRadius: '24px',
      }}
    >
      <Divide flexDirection="column">
        <Text textAlign="center" tablet_fontSize="14px">
          【請輸入下方相關資訊】
        </Text>
        <BedListForm addBed={addBed} />
      </Divide>
      <BedDivide>
        <ScrollDivide>
          {latest && latest.length > 0 ? (
            latest.map((bed, bedIndex) => {
              return (
                <>
                  <BedContainer key={bedIndex}>
                    <Divide justifyContent="center" marginBottom="12px">
                      <Text fontSize="20px" mobile_fontSize="14px">
                        {bed.whoseBed}房間
                      </Text>
                      <CancelBtn
                        onClick={() => deleteBed(bedIndex)}
                      ></CancelBtn>
                    </Divide>
                    <Divide flexDirection="column">
                      <BedImage src={accommodationIcon} alt="bed" />
                      <Text marginTop="8px" mobile_fontSize="14px">
                        目前還有{' '}
                        {Number(latest[bedIndex].bed < bed.maxNum)
                          ? Number(bed.maxNum - latest[bedIndex].bed)
                          : Number(latest[bedIndex].bed)}
                        /{Number(bed.maxNum)}床位
                      </Text>
                    </Divide>
                    <RoomDivide>
                      {Array(bed.maxNum)
                        .fill(undefined)
                        .map((_, index) => (
                          <BedPillowContainer
                            style={{
                              backgroundColor: latest[bedIndex].bedArrange[
                                index
                              ]
                                ? ' #B99362'
                                : 'transparent',
                              border: latest[bedIndex].bedArrange[index]
                                ? '1px solid #B99362 '
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
            <DefaultImage src={accommodationIcon} alt="bed" />
          )}
        </ScrollDivide>
      </BedDivide>
    </Divide>
  )
}

export default Accommodation
