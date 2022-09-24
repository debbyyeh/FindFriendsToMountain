import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { uuidv4 } from '@firebase/util'
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

const Wrapper = styled.div`
  max-width: calc(1320px - 40px);
  ${'' /* padding-left: 20px;
  padding-right: 20px; */}
  margin: 0 auto;
  font-family: Poppins;
`
const BackgroundStyle = styled.div`
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3) inset;
  margin-top: 50px;
  padding: 20px;
  border-radius: 24px;
`

const EditBtn = styled.div`
  background-image: url(${edit});
  background-size: cover;
  width: 20px;
  height: 20px;

  cursor: pointer;
`

const CheckBtn = styled.div`
  background-size: cover;
  width: 20px;
  height: 20px;

  cursor: pointer;
  background-image: url(${done});
`

const Kanban = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 400px;
  border: 1px solid white;
`
const Board = styled.div`
  background: white;
  border: 1px solid white;
  width: 300px;
  min-height: 400px;
  margin: 8px 20px;
`
const SetDate = styled.div`
  color: black;
  font-size: 24px;
  text-align: center;
`
const DeleteBoard = styled.button`
  ${'' /* color: black;
  border: 1px solid black; */}
`

const StepBorder = styled.div`
  border: 1px solid #f6ead6;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
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
const DeleteBtn = styled.button`
  width: 120px;
  border: 1px solid #222322;
  color: #222322;
`

const Itinerary = ({
  ownerAuth,
  setOwnerAuth,
  memberAuth,
  setMemberAuth,
  Text,
  DivideBorder,
  Divide,
  Btn,
  InfoInput,
  BackColor,
  SrcImage,
}) => {
  const [latest, setLatest] = useState()
  const [dayNum, setDayNum] = useState(0)

  let url = window.location.href
  const newUrl = url.split('/activity/')
  const groupID = newUrl[1]
  const docRef = doc(db, 'groupContents', groupID)
  const [personTake, setPersonTake] = useState()
  const [newItinerary, setNewItinerary] = useState()
  const dayChoose = useRef()
  const cardInfoRef = useRef()
  const helpMsg = useRef()
  const [personTakePhoto, setPersonTakePhoto] = useState()
  const value = useContext(UserContext)

  useEffect(() => {
    getItineraryList()
    // updateItinerary()
    const unsub = onSnapshot(docRef, (doc) => {
      const data = doc.data()
      const latestData = data.itineraryList
      setLatest(latestData) //監聽
    })
  }, [])

  async function getItineraryList() {
    try {
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const itineraryData = docSnap.data()
        const oldItinerary = itineraryData.itineraryList
        setNewItinerary(oldItinerary)
      }
    } catch {
      console.log('No such document!')
    }
  }
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
    console.log('update')
  }

  const itemsFromBackend = []
  const columnsFromBackend = {
    ['事項清單']: {
      name: '事項清單',
      items: latest ? latest.事項清單.items : itemsFromBackend,
    },
    ['未完成']: {
      name: '未完成',
      items: latest ? latest.未完成.items : [],
    },
    ['已解決']: {
      name: '已解決',
      items: latest ? latest.已解決.items : [],
    },
  }

  const [columns, setColumns] = useState(columnsFromBackend)

  function addCardInfo(column) {
    if (cardInfoRef.current.value !== '') {
      let oldCardItems = column.items
      let newItems = []
      let newCardItem = {
        id: `${cardInfoRef.current.value}`,
        person: value.userName,
        content: `${cardInfoRef.current.value}`,
        takePersonPhoto: null,
        takePerson: null,
      }
      console.log(newCardItem)
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
          const clickItem = latest.事項清單.items
          clickItem[index].takePerson = value.userName
          clickItem[index].takePersonPhoto = userData.photoURL
        } else if (columnId == '未完成') {
          const clickItem = latest.未完成.items
          clickItem[index].takePerson = value.userName
          clickItem[index].takePersonPhoto = userData.photoURL
        }
      }
    } catch {
      console.log('No such document!')
    }

    setColumns({
      ['事項清單']: {
        name: '事項清單',
        items: latest.事項清單.items,
      },
      ['未完成']: {
        name: '未完成',
        items: latest.未完成.items,
      },
      ['已解決']: {
        name: '已解決',
        items: latest.已解決.items,
      },
    })
    updateItinerary({
      ['事項清單']: {
        name: '事項清單',
        items: latest.事項清單.items,
      },
      ['未完成']: {
        name: '未完成',
        items: latest.未完成.items,
      },
      ['已解決']: {
        name: '已解決',
        items: latest.已解決.items,
      },
    })
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
      <Wrapper>
        <BackgroundStyle>
          <Text tablet_fontSize="20px" textAlign="left" margin="0 0 20px 0">
            待討論事項
          </Text>
          <Divide justifyContent="space-between">
            <DragDropContext
              onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
            >
              {latest && (
                <>
                  {Object.entries(latest).map(([columnId, column], index) => {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                        key={columnId}
                      >
                        <Text fontSize="20px" color=" #F6EAD6">
                          {column.name}
                        </Text>
                        {columnId == '事項清單' && (
                          <>
                            <Divide marginBottom="12px">
                              <InfoInput
                                width="200px"
                                marginTop="12px"
                                color="#f6ead6"
                                backgroundColor="transparent"
                                ref={cardInfoRef}
                                tablet_fontSize="14px"
                                onKeyDown={onKeyDown}
                                placeholder="新增清單內容，可左右拖拉"
                              />
                              <Btn
                                border="none"
                                width="30px"
                                margin="12px auto 0"
                                lineHeight="2px"
                                fontSize="16px"
                                onClick={() => addCardInfo(column)}
                              >
                                ＋
                              </Btn>
                            </Divide>
                          </>
                        )}
                        <div>
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
                                    width: 250,
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
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                userSelect: 'none',
                                                padding: '0px 8px',
                                                margin: '12px 0',
                                                minHeight: '20px',
                                                backgroundColor: snapshot.isDragging
                                                  ? '#222322'
                                                  : '#AC6947',
                                                background:
                                                  columnId == '已解決'
                                                    ? 'rgba(34,35,34,0.2)'
                                                    : '#AC6947',
                                                color: snapshot.isDragging
                                                  ? '#222322'
                                                  : '#F6EAD6',
                                                opacity:
                                                  columnId == '已解決'
                                                    ? 0.2
                                                    : 1,
                                                ...provided.draggableProps
                                                  .style,
                                              }}
                                            >
                                              <Divide
                                                flexDirection="column"
                                                alignItems="start"
                                              >
                                                <Divide>
                                                  <Text tablet_fontSize="14px">
                                                    {item.person}：
                                                  </Text>
                                                  <Text
                                                    tablet_fontSize="14px"
                                                    style={{
                                                      textDecoration:
                                                        columnId == '已解決'
                                                          ? 'line-through'
                                                          : 'none',
                                                    }}
                                                  >
                                                    {item.content}
                                                  </Text>
                                                </Divide>
                                                <Divide>
                                                  <Text fontSize="14px">
                                                    認領:
                                                  </Text>
                                                  <IconImage
                                                    style={{
                                                      backgroundImage: `url(${item.takePersonPhoto})`,
                                                    }}
                                                  ></IconImage>
                                                  <Text>{item.takePerson}</Text>
                                                  <Btn
                                                    borderRadius="50%"
                                                    width="40px"
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
                                              </Divide>
                                              <DeleteBtn
                                                width="120px"
                                                margin="8px"
                                                border="none"
                                                fontSize="20px"
                                                color="#F6EAD6"
                                                onClick={() =>
                                                  handleDelete(
                                                    item,
                                                    index,
                                                    column,
                                                    columnId,
                                                  )
                                                }
                                              >
                                                delete
                                              </DeleteBtn>
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
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </DragDropContext>
          </Divide>
        </BackgroundStyle>
      </Wrapper>
    </>
  )
}

export default Itinerary
