import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import {
  collection,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../../utils/firebase'
import itineraryIcon from './itinerary.png'
import { UserContext } from '../../utils/userContext'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import done from './Done.png'
import edit from './Edit.png'
import add from './Add.png'
import dot from './dot.png'

const BackgroundStyle = styled.div`
  ${'' /* box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3) inset; */}
  position:relative;
  border: 1px solid white;
  margin: 50px auto;
  padding: 20px 60px;
  border-radius: 24px;
  min-height: 300px;
  @media screen and (max-width: 1279px) {
    padding: 20px 30px;
  }
  @media screen and (max-width: 767px) {
    padding: 20px;
  }
`
const IconImage = styled.div`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  @media screen and (max-width: 1279px) {
    width: 30px;
    height: 30px;
  }
`
const DroppableContainer = styled.div`
  max-height: 400px;
  overflow-y: scroll;
  width: 80%;
  @media screen and (max-width: 1279px) {
    width: 100%;
  }
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
const Icon = styled.div`
  cursor: pointer;
  width: 30px;
  height: 30px;
  background-size: contain;
  border-radius: 50%;
  transition: all 0.3s;
  &:hover {
    border: 1px solid #b99362;
  }
  &:active {
    border: 1px solid #b99362;
  }
`
const Dot = styled(Icon)`
  background-image: url(${dot});
  width: 20px;
  height: 20px;
`
const ChooseBtn = styled.button`
  display: ${(props) => (props.$isActive ? 'block' : 'none')};
  transition: all 0.3s;
  color: #f6ead6;
  fontsize: 14px;
  border: 1px solid #f6ead6;
  cursor: pointer;
  position: absolute;
  top: 30px;
  right: 0;
  width: 100px;
  height: 30px;
  font-weight: 900;
  &:hover {
    background-color: #f6ead6;
    color: #222322;
  }
`

const Itinerary = ({ Text, Divide, Btn, InfoInput, BackColor, SrcImage }) => {
  const urlID = useParams()
  const docRef = doc(db, 'groupContents', urlID.id)
  const [personTake, setPersonTake] = useState()
  const [isActive, setIsActive] = useState()
  const [tabIndex, setTabIndex] = useState(undefined)
  const cardInfoRef = useRef()
  const [personTakePhoto, setPersonTakePhoto] = useState()
  const value = useContext(UserContext)
  const [columns, setColumns] = useState({
    ['事項清單']: {
      name: '事項清單',
      items: [],
    },
    ['已解決']: {
      name: '已解決',
      items: [],
    },
  })
  useEffect(() => {
    getItineraryList()
    const unsub = onSnapshot(docRef, (doc) => {
      const data = doc.data()
      const latestData = data.itineraryList
      setColumns(latestData) //監聽
    })
  }, [urlID.id])

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      addCardInfo()
    }
  }

  //updateDoc
  const updateItinerary = async (columns) => {
    const updateitinerary = await updateDoc(docRef, {
      itineraryList: columns,
    })
  }

  async function getItineraryList() {
    try {
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const itineraryData = docSnap.data()
        const oldItinerary = itineraryData.itineraryList
        setColumns(oldItinerary)
      }
    } catch {
      console.log('No such document!')
    }
  }

  function addCardInfo(column) {
    if (cardInfoRef.current.value == '') {
      value.alertPopup()
      value.setWarning(true)
      console.log(value.warning)
      value.setAlertContent('格內不可為空')
    } else if (cardInfoRef.current.value !== '') {
      let oldCardItems = column.items
      let newItems = []
      let newCardItem = {
        id: `${cardInfoRef.current.value}`,
        person: value.userName,
        personID: value.userUid,
        content: `${cardInfoRef.current.value}`,
        takePersonPhoto: null,
        takePerson: null,
        takePersonID: null,
      }
      newItems.push(...oldCardItems, newCardItem)
      setColumns({
        ...columns,
        ['事項清單']: {
          name: '事項清單',
          items: newItems,
        },
      })
      updateItinerary({
        ...columns,
        ['事項清單']: {
          name: '事項清單',
          items: newItems,
        },
      })
      cardInfoRef.current.value = ''
    }
  }

  async function personWhoTake(index, column, columnId) {
    try {
      const docRef = doc(db, 'users', value.userUid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const userData = docSnap.data()
        setPersonTakePhoto(userData.photoURL)
        if (columnId == '事項清單') {
          const clickItem = columns.事項清單.items
          clickItem[index].takePerson = value.userName
          clickItem[index].takePersonID = value.userUid
          clickItem[index].takePersonPhoto = userData.photoURL
        }
      }
    } catch {
      console.log('No such document!')
    }
    setColumns({
      ['事項清單']: {
        name: '事項清單',
        items: columns.事項清單.items,
      },
      ['已解決']: {
        name: '已解決',
        items: columns.已解決.items,
      },
    })
    updateItinerary({
      ['事項清單']: {
        name: '事項清單',
        items: columns.事項清單.items,
      },
      ['已解決']: {
        name: '已解決',
        items: columns.已解決.items,
      },
    })
  }

  async function notTake(index, column, columnId) {
    try {
      const docRef = doc(db, 'groupContents', urlID.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const itineraryData = docSnap.data()
        const oldItinerary = itineraryData.itineraryList
        if (columnId == '事項清單') {
          const returnItem = oldItinerary.事項清單.items
          returnItem[index].takePerson = null
          returnItem[index].takePersonID = null
          returnItem[index].takePersonPhoto = null
          setColumns({
            ['事項清單']: {
              name: '事項清單',
              items: returnItem,
            },
            ['已解決']: {
              name: '已解決',
              items: columns.已解決.items,
            },
          })
          updateItinerary({
            ['事項清單']: {
              name: '事項清單',
              items: returnItem,
            },
            ['已解決']: {
              name: '已解決',
              items: columns.已解決.items,
            },
          })
        } else {
          const returnItem = oldItinerary.已解決.items
          returnItem[index].takePerson = null
          returnItem[index].takePersonID = null
          returnItem[index].takePersonPhoto = null
          setColumns({
            ['事項清單']: {
              name: '事項清單',
              items: columns.事項清單.items,
            },
            ['已解決']: {
              name: '已解決',
              items: returnItem,
            },
          })
          updateItinerary({
            ['事項清單']: {
              name: '事項清單',
              items: columns.事項清單.items,
            },
            ['已解決']: {
              name: '已解決',
              items: returnItem,
            },
          })
        }
      }
    } catch {
      console.log('No such document!')
    }
  }

  function handleDelete(item, index, column, columnId) {
    const oldItems = column.items
    const newItems = [...oldItems]
    newItems.splice(index, 1)
    setColumns({
      ...columns,
      [columnId]: {
        name: columnId,
        items: newItems,
      },
    })
    updateItinerary({
      ...columns,
      [columnId]: {
        name: columnId,
        items: newItems,
      },
    })
  }

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return
    const { source, destination } = result
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]
      const sourceItems = [...sourceColumn.items]
      const destItems = [...destColumn.items]
      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)
      if (source.droppableId == '事項清單') {
        columns['事項清單'].items.map((item, index) => {
          if (item.takePerson == null) {
            return
          } else {
            setColumns({
              ...columns,
              [source.droppableId]: {
                ...sourceColumn,
                items: sourceItems,
              },
              [destination.droppableId]: {
                ...destColumn,
                items: destItems,
              },
            })
            updateItinerary({
              ...columns,
              [source.droppableId]: {
                ...sourceColumn,
                items: sourceItems,
              },
              [destination.droppableId]: {
                ...destColumn,
                items: destItems,
              },
            })
          }
        })
      } else {
        setColumns({
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
          [destination.droppableId]: {
            ...destColumn,
            items: destItems,
          },
        })
        updateItinerary({
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
          [destination.droppableId]: {
            ...destColumn,
            items: destItems,
          },
        })
      }
    } else {
      const column = columns[source.droppableId]
      const copiedItems = [...column.items]
      const [removed] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      })
      updateItinerary({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      })
    }
  }

  return (
    <>
      <BackgroundStyle>
        <Divide
          alignItems="start"
          marginTop="20px"
          mobile_flexDirection="column"
          mobile_marginTop="0"
        >
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
          >
            {columns && (
              <>
                {['事項清單', '已解決'].map((columnId, index) => {
                  const column = columns[columnId]
                  return (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                      }}
                      key={columnId}
                    >
                      <Text
                        fontSize="20px"
                        color=" #F6EAD6"
                        mobile_fontSize="16px"
                      >
                        {column.name}
                      </Text>
                      {columnId == '事項清單' && (
                        <>
                          <Divide
                            marginBottom="12px"
                            marginTop="12px"
                            position="relative"
                            width="80%"
                          >
                            <InfoInput
                              width="100%"
                              color="#f6ead6"
                              backgroundColor="transparent"
                              ref={cardInfoRef}
                              tablet_fontSize="14px"
                              onKeyDown={onKeyDown}
                              boxShadow="none"
                              borderBottom="1px solid #f6ead6"
                              placeholder="新增認領內容，可左右拖拉"
                            />
                            <Icon
                              style={{
                                position: 'absolute',
                                right: '0',
                                backgroundImage: `url(${add})`,
                              }}
                              onClick={() => addCardInfo(column)}
                            ></Icon>
                          </Divide>
                          <Text fontSize="14px">
                            【若無人認領，則不可拖拉】
                          </Text>
                        </>
                      )}
                      <DroppableContainer>
                        <Droppable droppableId={columnId} key={columnId}>
                          {(provided, snapshot) => {
                            return (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{
                                  background: snapshot.isDraggingOver
                                    ? 'rgba(34,35,34,0.2)'
                                    : 'transparent',
                                  padding: 4,
                                  width: '100%',
                                  height: 300,
                                }}
                              >
                                {column.items.map((item, index) => {
                                  return (
                                    <Draggable
                                      key={item.id}
                                      draggableId={item.id}
                                      index={index}
                                    >
                                      {(provided, snapshot) => {
                                        return (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                              userSelect: 'none',
                                              padding: '16px',
                                              margin: '12px 0',
                                              minHeight: '20px',
                                              // border: '1px solid white',
                                              borderRadius: '12px',
                                              backgroundColor: snapshot.isDragging
                                                ? '#222322'
                                                : '#AC6947',
                                              backgroundColor:
                                                columnId == '已解決'
                                                  ? 'rgba(34,35,34,0.2)'
                                                  : ' rgba(34,35,34,0.5)',
                                              color: snapshot.isDragging
                                                ? '#222322'
                                                : '#F6EAD6',
                                              opacity:
                                                columnId == '已解決' ? 0.6 : 1,
                                              ...provided.draggableProps.style,
                                            }}
                                          >
                                            <Divide
                                              flexDirection="column"
                                              alignItems="start"
                                            >
                                              <Divide
                                                width="100%"
                                                marginBottom="12px"
                                              >
                                                <Divide alignItems="start">
                                                  <Text
                                                    tablet_fontSize="14px"
                                                    style={{
                                                      color:
                                                        columnId == '事項清單'
                                                          ? '#B99362'
                                                          : '#F6EAD6',
                                                    }}
                                                  >
                                                    {item.person}：
                                                  </Text>
                                                  <Text
                                                    tablet_fontSize="14px"
                                                    style={{
                                                      textDecoration:
                                                        columnId == '已解決'
                                                          ? 'line-through'
                                                          : 'none',
                                                      color:
                                                        columnId == '事項清單'
                                                          ? '#B99362'
                                                          : ' #F6EAD6',
                                                    }}
                                                  >
                                                    {item.content}
                                                  </Text>
                                                </Divide>
                                                <Divide
                                                  flexDirection="column"
                                                  position="relative"
                                                >
                                                  {value.userUid ==
                                                    item.personID && (
                                                    <Dot
                                                      onClick={() => {
                                                        setTabIndex(
                                                          (index) => undefined,
                                                        )
                                                        setTabIndex(
                                                          (undefined) => index,
                                                        )
                                                      }}
                                                    >
                                                      <ChooseBtn
                                                        $isActive={
                                                          index === tabIndex
                                                        }
                                                        onClick={() =>
                                                          handleDelete(
                                                            item,
                                                            index,
                                                            column,
                                                            columnId,
                                                          )
                                                        }
                                                      >
                                                        刪除卡片
                                                      </ChooseBtn>
                                                    </Dot>
                                                  )}
                                                </Divide>
                                              </Divide>
                                              <Divide
                                                alignItems="center"
                                                width="100%"
                                              >
                                                <Divide>
                                                  <Text
                                                    fontSize="14px"
                                                    mobile_textAlign="left"
                                                    style={{
                                                      whiteSpace: 'nowrap',
                                                    }}
                                                  >
                                                    認領人：
                                                  </Text>
                                                  <Divide>
                                                    <IconImage
                                                      style={{
                                                        backgroundImage: `url(${item.takePersonPhoto})`,
                                                        display:
                                                          item.takePersonPhoto ==
                                                          null
                                                            ? 'none'
                                                            : 'block',
                                                      }}
                                                    ></IconImage>
                                                    <Text
                                                      fontSize="14px"
                                                      tablet_fontSize="12px"
                                                      margin="0 0 0 8px"
                                                    >
                                                      {item.takePerson}
                                                    </Text>
                                                  </Divide>
                                                  <Btn
                                                    borderRadius="50%"
                                                    width="30px"
                                                    height="30px"
                                                    onClick={() =>
                                                      personWhoTake(
                                                        index,
                                                        column,
                                                        columnId,
                                                      )
                                                    }
                                                    style={{
                                                      display: item.takePerson
                                                        ? 'none'
                                                        : 'block',
                                                    }}
                                                  >
                                                    +
                                                  </Btn>
                                                </Divide>
                                                {item.takePerson &&
                                                  item.takePersonID ==
                                                    value.userUid && (
                                                    <Btn
                                                      width="80px"
                                                      height="30px"
                                                      $isActive={
                                                        index === tabIndex
                                                      }
                                                      fontSize="14px"
                                                      mobile_fontSize="12px"
                                                      mobile_height="20px"
                                                      onClick={() =>
                                                        notTake(
                                                          index,
                                                          column,
                                                          columnId,
                                                        )
                                                      }
                                                    >
                                                      取消認領
                                                    </Btn>
                                                  )}
                                              </Divide>
                                            </Divide>
                                          </div>
                                        )
                                      }}
                                    </Draggable>
                                  )
                                })}
                                {provided.placeholder}
                              </div>
                            )
                          }}
                        </Droppable>
                      </DroppableContainer>
                    </div>
                  )
                })}
              </>
            )}
          </DragDropContext>
        </Divide>
      </BackgroundStyle>
    </>
  )
}

export default Itinerary
