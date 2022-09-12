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
import ContentEditable from 'react-contenteditable'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import done from './Done.png'
import edit from './Edit.png'

const DiscussionArea = styled.div`
  width: 45%;
  margin-left: 40px;
`
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
const AddBtn = styled.button`
  color: white;
  border: none;
  font-size: 16px;
  margin-left: auto;
`
const Planner = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: white;
  margin: 12px 8px;
`
const OpenDate = styled.button`
  border: 1px solid white;
  width: 16px;
  height: 16px;
  font-size: 8px;
  color: white;
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
const DatePicker = styled.input`
  width: 30%;
  border: 1px solid white;
  margin-left: auto;
`
const DayWrapper = styled.div`
  display: flex;
`
const DayContainer = styled.div`
  border: 1px solid white;
  padding: 12px 20px;
  height: 500px;
`
const DayTitle = styled.div`
  font-size: 20px;
`
const DayInput = styled.input`
  border: none;
  ${'' /* border-bottom: 1px solid white; */}
  color: white;
`
const AddCardBtn = styled.div`
  border: 1px solid black;
  color: black;
  margin-top: 12px;
  padding: 8px 4px;
`

const Kanban = styled.div`
  display: flex;
  flex-direction: column;
`
const Board = styled.div``
const SetDate = styled.div`
  color: black;
  font-size: 24px;
  text-align: center;
`
const DeleteBoard = styled.button`
  color: black;
  border: 1px solid black;
`
const DeleteCard = styled.button`
  color: black;
  border: 1px solid black;
  &:hover {
    color: red;
  }
`

const Step = styled.div`
  background-color: white;
  color: black;
  width: 16px;
  height: 16px;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  ${'' /* & + &::after {
    content: '';
    width: 120px;
    height: 2px;
    background-color: white;
    position: absolute;
    left: 0;
    right: 0;
  } */}
`
const TextArea = styled.input``

const Itinerary = () => {
  const [getItinerary, setGetItinerary] = useState([])
  const [lastest, setLastest] = useState()
  const [labelText, setLabelText] = useState()
  console.log(labelText)
  const [dayNum, setDayNum] = useState(0)

  let url = window.location.href
  const newUrl = url.split('/activity/')
  const groupID = newUrl[1]
  const docRef = doc(db, 'groupContents', groupID)
  const [allItinerary, setAllItinerary] = useState([]) //儲存所有剛剛的資料
  const [visibleInput, setVisibleInput] = useState(false)
  const itineraryRef = useRef()
  const dayChoose = useRef()
  const addColumnRef = useRef()
  const cardInfoRef = useRef()
  const changeTextRef = useRef()

  useEffect(() => {
    getItineraryList()
    const unsub = onSnapshot(docRef, (doc) => {
      const data = doc.data()
      const latestData = data.itinerary
      setLastest(latestData)
    })
  }, [])

  async function getItineraryList() {
    console.log('取得TODOLIST資訊')
    try {
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const itineraryData = docSnap.data()
        const oldItinerary = itineraryData.itinerary
        setGetItinerary(oldItinerary)
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
      // completeInfo()
      dayChoose.current.value = ''
    }
  }

  const updateItinerary = async (allItinerary) => {
    const newArr = [...allItinerary]
    const updateitinerary = await updateDoc(docRef, {
      itinerary: newArr,
    })
  }

  const itemsFromBackend = [
    { id: uuidv4(), content: '9:00 711集合，最後購買機會!' },
    { id: uuidv4(), content: '10:00 武陵農場' },
  ]

  const columnsFromDayNum = {
    [123456]: {
      name: '欲安排行程',
      items: itemsFromBackend,
    },
  }
  const [columns, setColumns] = useState(columnsFromDayNum)

  const [columnCounter, setColumnCounter] = useState(0)
  function addColumns(columns) {
    console.log(addColumnRef.current.value)
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
      addColumnRef.current.value = ''
    }
  }
  function deleteBoard(columns) {
    console.log(123)
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
      console.log(newItems)
      setColumns({
        ...columns,
        [123456]: {
          name: '欲安排行程',
          items: newItems,
        },
      })
    }
  }

  function handleDelete(item, columns, columnId, index) {
    let oldItems = columns.items
    console.log(index)
    console.log(Object.entries(columns))
    const newItems = oldItems.filter((oldItem) => oldItem.id !== item.id)
    console.log(newItems)
    // setColumns({
    //   ...columns,
    //   [source.droppableId]: {
    //     items: newItems,
    //   },
    // })
  }

  const onDragEnd = (result, columns, setColumns) => {
    const { source, destination } = result
    if (!result.destination) return

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
    console.log(item, item.id, index)
    let changeText = labelText
    // item.id.content = changeText
    console.log(changeText)
  }

  return (
    <>
      <div>
        <button onClick={() => addColumns(columns)}>新增加一個column</button>
        <input placeholder="請輸入日期" ref={addColumnRef} />
        <Kanban>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <DragDropContext
              onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
            >
              {Object.entries(columns).map(([columnId, column], index) => {
                return (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                    key={columnId}
                  >
                    <h2 contentEditable="true">{column.name}</h2>
                    <div style={{ margin: 8 }}>
                      {columnId == 123456 && (
                        <AddCardBtn>
                          新增一個卡片
                          <input
                            ref={cardInfoRef}
                            placeholder="請輸入行程內容"
                          />
                          <button onClick={() => addCardInfo(column)}>
                            新增行程
                          </button>
                        </AddCardBtn>
                      )}
                      <DeleteBoard onClick={deleteBoard(columns)}>
                        x
                      </DeleteBoard>
                      <Droppable droppableId={columnId} key={columnId}>
                        {(provided, snapshot) => {
                          return (
                            <>
                              <Board
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{
                                  background: snapshot.isDraggingOver
                                    ? 'rgb(200,229,207)'
                                    : 'white',
                                  padding: 4,
                                  width: 250,
                                  minHeight: 500,
                                }}
                              >
                                <SetDate>{column.date}</SetDate>
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
                                            <Divide>
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                  userSelect: 'none',
                                                  padding: 16,
                                                  margin: '0 0 8px 0',
                                                  minHeight: '50px',
                                                  width: '100%',
                                                  backgroundColor: snapshot.isDragging
                                                    ? '#263B4A'
                                                    : '#456C86',
                                                  color: 'white',
                                                  ...provided.draggableProps
                                                    .style,
                                                }}
                                              >
                                                <input
                                                  contentEditable="true"
                                                  html={item}
                                                  disable={false}
                                                  defaultValue={item.content}
                                                  onClick={handleSubmit(
                                                    item,
                                                    index,
                                                  )}
                                                  ref={changeTextRef}
                                                  onInput={(e) =>
                                                    setLabelText(
                                                      e.currentTarget
                                                        .textContent,
                                                    )
                                                  }
                                                />

                                                <EditBtn
                                                // onClick={handleSubmit}
                                                ></EditBtn>
                                                <DeleteCard
                                                  onClick={() =>
                                                    handleDelete(
                                                      (index = { index }),
                                                      item,
                                                      index,
                                                      column,
                                                    )
                                                  }
                                                >
                                                  delete
                                                </DeleteCard>
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
                                              </div>
                                            </Divide>
                                          </>
                                        )
                                      }}
                                    </Draggable>
                                  )
                                })}
                                {provided.placeholder}
                              </Board>
                            </>
                          )
                        }}
                      </Droppable>
                    </div>
                  </div>
                )
              })}
            </DragDropContext>
          </div>
        </Kanban>
      </div>
    </>
  )
}

export default Itinerary
