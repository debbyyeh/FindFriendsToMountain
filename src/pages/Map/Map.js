import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { Divide, Text } from '../../css/style'
import { db } from '../../utils/firebase'
import { doc, updateDoc, onSnapshot } from 'firebase/firestore'
import { UserContext } from '../../utils/userContext'
import { useMediaQuery } from 'react-responsive'
import complete from './Mission.png'
import MapSvg from './MapSvg'
import highMountainComplete from './highMountain.png'
import add from './Add.png'
import minus from './Minus.png'
import ReactTooltip from 'react-tooltip'

const Wrapper = styled.div`
  position: relative;
`
const CityWrap = styled.div`
  position: absolute;
  top: ${(props) => props.top || 'none'};
  left: ${(props) => props.left || 'none'};
  right: ${(props) => props.right || 'none'};
  height: 300px;
  z-index: 10;

  @media (max-width: 1279px) {
    left: ${(props) => props.tablet_left || props.left};
  }

  @media screen and (max-width: 767px) {
    display: none;
  }
`
const CityName = styled.ul`
  font-size: 20px;
  color: #f6ead6;
  padding-left: 0;
  margin: 0;
  margin-bottom: 12px;
  border-radius: 8px;
  width: 80px;
  height: auto;
  text-align: center;
  border: 1px solid #f6ead6;
  @media screen and (max-width: 1279px) {
    font-size: 16px;
  }
  @media screen and (max-width: 767px) {
    width: 60px;
    font-size: 14px;
  }
`
const Scroll = styled.div`
  max-height: 120px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #f6ead6;
  }
  &::-webkit-scrollbar-track {
    box-shadow: transparent;
  }
`
const CityMountainList = styled.li`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  width: 150px;
  font-size: 20px;
  color: #f6ead6;
  padding: 4px 0;
  font-size: 14px;
  @media screen and (max-width: 767px) {
    width: 100px;
  }
`
const HighMountainList = styled(CityMountainList)``

const HighMountain = styled.div`
  color: rgb(227, 102, 52);
  margin: 6px 0 6px 12px;
  @media screen and (max-width: 767px) {
    font-size: 12px;
  }
`
const WalkingPlace = styled(HighMountain)`
  color: #f6ead6;
`

const Signature = styled.div`
  position: absolute;
  margin: 30px 0 30px;
  @media screen and (max-width: 767px) {
    font-size: 14px;
    margin: 10px 0 10px;
    width: 120px;
  }
`
const MobileMap = styled.div`
  ${(props) => props.hideOnDesktop && 'display: none;'}

  @media screen and (max-width: 767px) {
    display: block;
    position: absolute;
    bottom: 20px;
    right: 0;
  }
`
const MobileCityWrap = styled.div``

const ListItem = styled.option`
  cursor: pointer;
  margin-bottom: 8px;
  color: #f6ead6;
  background-color: rgb(48, 61, 48);
  &:hover {
    border-bottom: 1px solid #ac6947;
  }
`
const DropDownHeader = styled.select`
  cursor: pointer;
  width: 120px;
  color: #f6ead6;
  border: none;
  margin-bottom: 12px;
  padding: 12px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 130%);
  font-weight: 500;
  background: transparent;
  &:focus {
    outline: none;
  }
  @media screen and (max-width: 1279px) {
    width: 80px;
    padding: 8px;
    font-size: 14px;
  }
  @media screen and (max-width: 767px) {
    width: 60px;
    font-size: 12px;
  }
`
const InputData = styled.div`
  width: 50%;
  height: 40px;
  position: relative;
  margin: 20px 0;
  @media screen and (max-width: 1279px) {
    margin: 12px 0;
  }
`
const InfoInput = styled.input`
  width: 100%;
  height: 100%;
  text-align: center;
  border: none;
  border-bottom: 1px solid #f6ead6;
  font-size: 20px;

  margin-top: 12px;
  color: #f6ead6;

  &:focus ~ label {
    transform: translateY(-10px);
    font-size: 20px;
    color: #ac6947;
    font-weight: bold;
  }
  @media screen and (max-width: 1279px) {
    font-size: 16px;
    &:focus ~ label {
      font-size: 16px;
    }
  }
`
const Label = styled.label`
  position: absolute;
  bottom: 25px;
  left: 0;
  transition: all 0.3s ease;
  color: #f6ead6;
  font-size: 16px;
  @media screen and (max-width: 767px) {
    font-size: 14px;
    bottom: 10px;
  }
`

const Btn = styled.button`
  color: #f6ead6;
  border: 1px solid #f6ead6;
  margin-top: 16px;
  width: 50%;
  padding: 8px;
  font-size: 16px;

  &:active {
    transform: translateY(0.2rem);
  }
  @media screen and (max-width: 1279px) {
    width: auto;
    font-size: 14px;
  }
  @media screen and (max-width: 767px) {
    font-size: 12px;
    padding: 4px;
  }
`
const Icon = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 8px;
  background-size: cover;
  cursor: pointer;
`
const Dot = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #f6ead6;
`
const HighDot = styled(Dot)`
  background-color: rgb(227, 102, 52);
`
const Complete = styled.img`
  width: 20px;
  height: 20px;
  object-fit: cover;
`
const Map = () => {
  const value = useContext(UserContext)
  const [clickCity, setClickCity] = useState('')
  const [clickMountainList, setClickMountainList] = useState()
  const [highMountainList, setHighMountainList] = useState([])
  const [trailList, setTrailList] = useState([])
  const [position, setPosition] = useState('')
  const [latestMountainList, setLatestMountainList] = useState([])
  const mountainNameRef = useRef()
  const [choose, setChoose] = useState('?????????')
  const [categoryChoose, setCategoryChoose] = useState('trail')
  const [isOpen, setIsOpen] = useState(false)
  const toggling = () => setIsOpen(!isOpen)
  const [isAdd, setIsAdd] = useState(false)
  const adding = () => setIsAdd(!isAdd)

  useEffect(() => {
    const docRef = doc(db, 'users', value.userUid)
    onSnapshot(docRef, (doc) => {
      const data = doc.data()
      const latestData = data.mountainLists
      setLatestMountainList(latestData)
    })

    let northwest = ['?????????', '?????????', '?????????']
    let middle = ['?????????', '?????????', '?????????', '?????????']
    let north = ['?????????', '?????????', '?????????', '?????????']
    let east = ['?????????', '?????????']
    let eastTaitung = ['?????????']
    let south = ['?????????', '?????????', '?????????', '?????????', '?????????']

    if (middle.includes(clickCity)) {
      setPosition('middle')
    } else if (north.includes(clickCity)) {
      setPosition('north')
    } else if (northwest.includes(clickCity)) {
      setPosition('northwest')
    } else if (east.includes(clickCity)) {
      setPosition('east')
    } else if (eastTaitung.includes(clickCity)) {
      setPosition('eastTaitung')
    } else if (south.includes(clickCity)) {
      setPosition('south')
    } else if (clickCity === '?????????') {
      setPosition('pintung')
    } else {
      setPosition('')
    }
  }, [clickCity])

  const cities = [
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
    {
      label: '?????????',
      value: '?????????',
    },
  ]
  const isDesktop = useMediaQuery({
    query: '(min-width: 768px)',
  })
  const getMountainLists = (e) => {
    let tagname = e.target.getAttribute('data-name-zh')
    let result = latestMountainList.filter((obj) => {
      return obj.tag === tagname
    })
    setClickCity(result[0].tag)
    const placeList = result[0].category
    const highMountainLists = placeList.highMountain
    const trailLists = placeList.trail

    if (highMountainLists || trailLists) {
      setHighMountainList(highMountainLists)
      setTrailList(trailLists)
    } else {
      setHighMountainList([])
    }
  }
  const stateTrail = (item, index) => {
    let chooseIndex = latestMountainList.findIndex((c) => c.tag === clickCity)
    latestMountainList[chooseIndex].category.trail[
      index
    ].checked = !latestMountainList[chooseIndex].category.trail[index].checked
    setTrailList(latestMountainList[chooseIndex].category.trail)
    updateMountainList(latestMountainList)
  }
  const stateHighMountain = (index) => {
    let chooseIndex = latestMountainList.findIndex((c) => c.tag === clickCity)
    latestMountainList[chooseIndex].category.highMountain[
      index
    ].checked = !latestMountainList[chooseIndex].category.highMountain[index]
      .checked
    setHighMountainList(latestMountainList[chooseIndex].category.highMountain)
    updateMountainList(latestMountainList)
  }
  async function updateMountainList() {
    const docRef = doc(db, 'users', value.userUid)
    const newData = [...latestMountainList]
    await updateDoc(docRef, { mountainLists: newData })
  }

  function MountainNumberOfCity({ targetCity }) {
    return (
      <>
        <CityName>{targetCity}</CityName>
        <Scroll>
          {trailList &&
            trailList.map((item, index) => {
              return (
                <CityMountainList
                  key={index}
                  onClick={() => {
                    stateTrail(item, index)
                  }}
                >
                  <Text
                    textAlign="left"
                    mobile_fontSize="12px"
                    style={{
                      color: item.checked ? '#B99362' : '#F6EAD6',
                    }}
                  >
                    {item.name}
                  </Text>
                  <Complete
                    src={complete}
                    alt="complete"
                    style={{ display: item.checked ? 'block' : 'none' }}
                  />
                </CityMountainList>
              )
            })}
          {highMountainList &&
            highMountainList.map((item, index) => {
              return (
                <HighMountainList
                  onClick={() => stateHighMountain(index)}
                  key={index}
                >
                  <Text textAlign="left" mobile_fontSize="12px" color="#E36634">
                    {item.name}
                  </Text>
                  <Complete
                    style={{
                      display: item.checked ? 'block' : 'none',
                    }}
                    src={highMountainComplete}
                  />
                </HighMountainList>
              )
            })}
        </Scroll>
      </>
    )
  }

  async function addToMap() {
    if (
      choose !== undefined &&
      categoryChoose !== undefined &&
      mountainNameRef.current.value !== ''
    ) {
      value.alertPopup()
      value.setAlertContent('????????????')
      let index = latestMountainList.findIndex((c) => c.tag === choose)
      if (categoryChoose === 'trail') {
        let newData = {
          tag: choose,
          category: {
            highMountain: latestMountainList[index].category.highMountain,
            trail: [
              { name: mountainNameRef.current.value, checked: false },
              ...latestMountainList[index].category.trail,
            ],
          },
        }
        latestMountainList.splice(index, 1, newData)
        const newDocRef = updateDoc(doc(db, 'users', value.userUid), {
          mountainLists: latestMountainList,
        })
      } else {
        let newData = {
          tag: choose,
          checked: false,
          category: {
            highMountain: [
              { name: mountainNameRef.current.value, checked: false },
              ...latestMountainList[index].category.highMountain,
            ],
            trail: latestMountainList[index].category.trail,
          },
        }
        latestMountainList.splice(index, 1, newData)
        const newDocRef = updateDoc(doc(db, 'users', value.userUid), {
          mountainLists: latestMountainList,
        })
      }
      mountainNameRef.current.value = ''
    } else {
      value.alertPopup()
      value.setAlertContent('??????????????????')
    }
  }

  return (
    <Wrapper>
      {isDesktop && (
        <>
          {position === 'north' && (
            <CityWrap top="10%" left="80%">
              <MountainNumberOfCity
                targetCity={clickCity}
                item={clickMountainList}
              />
            </CityWrap>
          )}
          {position === 'northwest' && (
            <CityWrap top="25%" left="20%" tablet_left="25%">
              <MountainNumberOfCity
                targetCity={clickCity}
                item={clickMountainList}
              />
            </CityWrap>
          )}
          {position === 'east' && (
            <CityWrap top="40%" left="80%">
              <MountainNumberOfCity
                targetCity={clickCity}
                item={clickMountainList}
              />
            </CityWrap>
          )}
          {position === 'eastTaitung' && (
            <CityWrap top="60%" left="70%" tablet_left="70%">
              <MountainNumberOfCity
                targetCity={clickCity}
                item={clickMountainList}
              />
            </CityWrap>
          )}
          {position === 'pintung' && (
            <CityWrap top="75%" left="20%">
              <MountainNumberOfCity
                targetCity={clickCity}
                item={clickMountainList}
              />
            </CityWrap>
          )}
          {position === 'south' && (
            <CityWrap top="60%" left="20%" tablet_left="15%">
              <MountainNumberOfCity
                targetCity={clickCity}
                item={clickMountainList}
              />
            </CityWrap>
          )}
          {position === 'middle' && (
            <CityWrap top="30%" left="20%" tablet_left="20%">
              <MountainNumberOfCity
                targetCity={clickCity}
                item={clickMountainList}
              />
            </CityWrap>
          )}
        </>
      )}

      <Signature>
        <Divide justifyContent="flex-start">
          <ReactTooltip id="trail" place="top" effect="solid">
            ??????????????????????????????
          </ReactTooltip>
          <Dot></Dot>
          <WalkingPlace data-tip data-for="trail">
            ??????
          </WalkingPlace>
        </Divide>
        <Divide justifyContent="flex-start">
          <ReactTooltip id="mountain" place="top" effect="solid">
            ??????????????????????????????
          </ReactTooltip>
          <HighDot></HighDot>
          <HighMountain data-tip data-for="mountain">
            ??????
          </HighMountain>
        </Divide>
        {!isAdd ? (
          <Divide justifyContent="flex-start" marginTop="10px">
            <Icon
              style={{
                backgroundImage: `url(${add})`,
              }}
              onClick={adding}
            ></Icon>
            <Text tablet_fontSize="14px" mobile_fontSize="12px">
              ?????????
            </Text>
          </Divide>
        ) : (
          <Divide justifyContent="flex-start">
            <Icon
              style={{
                backgroundImage: `url(${minus})`,
              }}
              onClick={adding}
            ></Icon>
            <Text tablet_fontSize="14px" mobile_fontSize="12px">
              ????????????????????????
            </Text>
          </Divide>
        )}
        {isAdd && (
          <Divide
            flexDirection="column"
            alignItems="start"
            marginTop="12px"
            style={{
              maxWidth: '300px',
            }}
          >
            <DropDownHeader onChange={(e) => setChoose(e.target.value)}>
              ????????????
              <ListItem disabled>??????</ListItem>
              {cities.map((city) => {
                return <ListItem value={city.value}>{city.label}</ListItem>
              })}
            </DropDownHeader>
            <DropDownHeader
              onClick={toggling}
              onChange={(e) => setCategoryChoose(e.target.value)}
            >
              ??????
              <ListItem disabled>??????</ListItem>
              <ListItem value="trail">??????</ListItem>
              <ListItem value="highMountain">??????</ListItem>
            </DropDownHeader>
            <InputData>
              <InfoInput type="text" ref={mountainNameRef} />
              <Label htmlFor="pwd">?????????</Label>
            </InputData>
            <Btn onClick={addToMap}>????????????</Btn>
          </Divide>
        )}
      </Signature>
      <MobileMap hideOnDesktop>
        <MobileCityWrap>
          <MountainNumberOfCity
            targetCity={clickCity}
            item={clickMountainList}
          />
        </MobileCityWrap>
      </MobileMap>
      <MapSvg clickCity={clickCity} getMountainLists={getMountainLists} />
    </Wrapper>
  )
}

export default Map
