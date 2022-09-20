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
// import ContentEditable from 'react-contenteditable'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import done from './Done.png'
import edit from './Edit.png'

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
`
const Board = styled.div`
  background: transparent;
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
  color: black;
  border: 1px solid black;
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

const Itinerary = ({
  Text,
  DivideBorder,
  Divide,
  Btn,
  InfoInput,
  BackColor,
  SrcImage,
}) => {
  const [latest, setLatest] = useState()
  const [labelText, setLabelText] = useState()
  const [dayNum, setDayNum] = useState(0)

  let url = window.location.href
  const newUrl = url.split('/activity/')
  const groupID = newUrl[1]
  const docRef = doc(db, 'groupContents', groupID)
  const [visibleInput, setVisibleInput] = useState(false)
  const itineraryRef = useRef()
  const dayChoose = useRef()
  const addColumnRef = useRef()
  const cardInfoRef = useRef()
  const changeTextRef = useRef()

  useEffect(() => {
    getItineraryList()
    // updateItinerary()
    const unsub = onSnapshot(docRef, (doc) => {
      const data = doc.data()
      const latestData = data.itineraryList
      setLatest(latestData) //監聽
    })
  }, [])

  console.log(latest)

  async function getItineraryList() {
    try {
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const itineraryData = docSnap.data()
        const oldItinerary = itineraryData.itineraryList
      }
    } catch {
      console.log('No such document!')
    }
  }
  function onKeyDown(e) {
    if (e.key === 'Enter') {
      const dayCard = Number(dayChoose.current.value)
      setDayNum(dayCard)
      console.log(dayCard)
      dayChoose.current.value = ''
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
  const itineraryData = {
    [123456]: {
      name: '欲安排行程',
      items: itemsFromBackend,
    },
  }

  const [columns, setColumns] = useState(itineraryData)

  const [columnCounter, setColumnCounter] = useState(0)

  function addColumns(columns) {
    if (addColumnRef.current.value == '') {
      alert('請輸入日期')
    } else {
      setColumnCounter(columnCounter + 1)
      let currColumn = {
        name: `第${columnCounter + 1}天`,
        date: `日期${addColumnRef.current.value}`,
        items: [],
      }
      setColumns({
        ...columns,
        [uuidv4()]: currColumn,
      })
      updateItinerary({
        ...columns,
        [uuidv4()]: currColumn,
      })
      addColumnRef.current.value = ''
    }
  }
  function deleteBoard(columns, columnId) {
    console.log(columns, columnId)
    // setColumns({
    //   ...columns,
    //   [uuidv4()]: currColumn,
    // })
    // updateItinerary({
    //   ...columns,
    //   [uuidv4()]: currColumn,
    // })
  }

  function addCardInfo(column) {
    if (cardInfoRef.current.value !== '') {
      let oldCardItems = column.items
      let newItems = []
      let newCardItem = {
        id: uuidv4(),
        content: `${cardInfoRef.current.value}`,
      }
      newItems.push(...oldCardItems, newCardItem)
      setColumns({
        ...columns,
        [123456]: {
          name: '欲安排行程',
          items: newItems,
        },
      })
      console.log(newItems)
      updateItinerary({
        ...columns,
        [123456]: {
          name: '欲安排行程',
          items: newItems,
        },
      })
      cardInfoRef.current.value = ''
    }
  }

  function handleDelete(item, index, column, columnId) {
    const oldItems = column.items
    const newItems = [...oldItems]
    newItems.splice(index, 1)
    setColumns({
      ...columns,
      [columnId]: {
        name: column.name,
        items: newItems,
      },
    })
    updateItinerary({
      ...columns,
      [columnId]: {
        name: column.name,
        items: newItems,
      },
    })
  }

  const onDragEnd = (result, columns, setColumns) => {
    console.log(columns)
    const { source, destination } = result
    if (!result.destination) {
      return
    }
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]
      const sourceItems = [...sourceColumn.items]
      console.log(columns)
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

  const handleShowInput = (item) => {
    console.log(item.id, 'click')
    setVisibleInput((current) => !current)
  }

  const handleChangeText = (e) => {
    setLabelText(e.target.value)
  }

  const handleSubmit = (item, id, index) => {
    let changeText = labelText
    // item.id.content = changeText
  }

  const DivideBack = styled(DivideBorder)`
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3) inset;
  `

  return (
    <>
      <DivideBack width="100%" height="auto" border="none" marginTop="50px">
        <Text fontSize="32px" textAlign="left">
          行程安排
        </Text>
        <Divide justifyContent="flex-start" marginBottom="30px">
          <StepBorder>1</StepBorder>
          <InfoInput
            width="100px"
            marginLeft="12px"
            backgroundColor="transparent"
            boxShadow="none"
            color="#f6ead6"
            borderBottom="1px solid #f6ead6"
            placeholder="請輸入日期"
            ref={addColumnRef}
          />
          <Btn width="50px" onClick={() => addColumns(columns)}>
            加入
          </Btn>
        </Divide>

        <Kanban>
          {/* <Divide justifyContent="flex-start"> */}
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
          >
            {latest &&
              Object.entries(latest).map(([columnId, column], index) => {
                return (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    key={columnId}
                  >
                    <Divide>
                      <Text fontSize="20px">{column.name}</Text>
                      <Btn
                        width="20px"
                        height="20px"
                        padding="12px"
                        border="none"
                        onClick={deleteBoard(columns, columnId)}
                      >
                        x
                      </Btn>
                    </Divide>
                    {columnId == 123456 && (
                      <>
                        <Divide marginBottom="12px">
                          <InfoInput
                            width="200px"
                            marginTop="12px"
                            color="#f6ead6"
                            backgroundColor="transparent"
                            ref={cardInfoRef}
                            placeholder="行程內容"
                          />
                          <Btn
                            width="50px"
                            margin="12px auto 0"
                            lineHeight="4px"
                            fontSize="20px"
                            onClick={() => addCardInfo(column)}
                          >
                            ＋
                          </Btn>
                        </Divide>
                      </>
                    )}

                    <Droppable droppableId={columnId} key={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <Board
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: snapshot.isDraggingOver
                                ? 'rgba(34,35,34,0.2)'
                                : 'transparent',
                            }}
                          >
                            <Text
                              fontSize="20px"
                              marginTop="12px"
                              marginBottom="12px"
                              textAlign="start"
                              marginLeft="12px"
                            >
                              {column.date}
                            </Text>
                            {column.items.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <>
                                        <Divide
                                          flexDirection="column"
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={{
                                            userSelect: 'none',
                                            minHeight: '80px',
                                            padding: '8px 12px',
                                            margin: '12px',
                                            backgroundColor: snapshot.isDragging
                                              ? '#222322'
                                              : ' #AC6947',
                                            color: snapshot.isDragging
                                              ? ' #222322'
                                              : '#F6EAD6',
                                            ...provided.draggableProps.style,
                                          }}
                                        >
                                          <Text
                                            fontSize="20px"
                                            defaultValue={item.content}
                                            textAlign="start"
                                            onClick={handleSubmit(item, index)}
                                            ref={changeTextRef}
                                            onInput={(e) =>
                                              setLabelText(
                                                e.currentTarget.textContent,
                                              )
                                            }
                                          >
                                            {item.content}
                                          </Text>
                                          <Divide>
                                            <EditBtn></EditBtn>
                                            <Btn
                                              width="50px"
                                              margin="8px"
                                              border="none"
                                              fontSize="20px"
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
                                            </Btn>
                                          </Divide>

                                          {/* {item.id.labelText ==
                                                undefined ? (
                                                  <div
                                                    onClick={handleSubmit(
                                                      item,
                                                      index,
                                                    )}
                                                  >
                                                    完成設定
                                                  </div>
                                                ) : null} */}
                                        </Divide>
                                        {/* </Divide> */}
                                      </>
                                    )
                                  }}
                                </Draggable>
                              )
                            })}
                            {provided.placeholder}
                          </Board>
                        )
                      }}
                    </Droppable>
                    {/* </Divide> */}
                    {/* </Divide> */}
                  </div>
                )
              })}
          </DragDropContext>
        </Kanban>
      </DivideBack>
    </>
  )
}

export default Itinerary
