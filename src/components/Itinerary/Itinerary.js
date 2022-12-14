import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { Text, Divide, Btn, InfoInput } from '../../css/style'
import { useParams } from 'react-router-dom'
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { UserContext } from '../../utils/userContext'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import ReactTooltip from 'react-tooltip'
import remove from './Remove.png'
import removeHover from './Remove_hover.png'
import add from './Add.png'

const ColumnDivide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`
const BackgroundStyle = styled.div`
  position: relative;
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
  width: 50px;
  height: 50px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  @media screen and (max-width: 1279px) {
    width: 40px;
    height: 40px;
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
`
const Dot = styled(Icon)`
  background-image: url(${remove});
  width: 20px;
  height: 20px;
  transition: all 0.2s;
  &:hover {
    border: none;
    background-image: url(${removeHover});
  }
`

const Itinerary = () => {
  const urlID = useParams()
  const docRef = doc(db, 'groupContents', urlID.id)
  const cardInfoRef = useRef()
  const value = useContext(UserContext)
  const [columns, setColumns] = useState({
    ['????????????']: {
      name: '????????????',
      items: [],
    },
    ['?????????']: {
      name: '?????????',
      items: [],
    },
  })
  useEffect(() => {
    getItineraryList()
    onSnapshot(docRef, (doc) => {
      const data = doc.data()
      const latestData = data.itineraryList
      setColumns(latestData)
    })
  }, [urlID.id])

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      addCardInfo()
    }
  }

  const updateItinerary = async (columns) => {
    await updateDoc(docRef, { itineraryList: columns })
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
    if (cardInfoRef.current.value === '') {
      value.alertPopup()
      value.setWarning(true)
      value.setAlertContent('??????????????????')
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
        ['????????????']: {
          name: '????????????',
          items: newItems,
        },
      })
      updateItinerary({
        ...columns,
        ['????????????']: {
          name: '????????????',
          items: newItems,
        },
      })
      cardInfoRef.current.value = ''
    }
  }

  async function personWhoTake(index, column, columnId) {
    if (value.userUid === columns.????????????.items[index].personID) {
      value.alertPopup()
      value.setAlertContent('???????????????????????????')
      return
    }
    try {
      const docRef = doc(db, 'users', value.userUid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const userData = docSnap.data()
        if (columnId === '????????????') {
          const clickItem = columns.????????????.items
          clickItem[index].takePerson = value.userName
          clickItem[index].takePersonID = value.userUid
          clickItem[index].takePersonPhoto = userData.photoURL
        }
      }
    } catch {
      console.log('No such document!')
    }
    setColumns({
      ['????????????']: {
        name: '????????????',
        items: columns.????????????.items,
      },
      ['?????????']: {
        name: '?????????',
        items: columns.?????????.items,
      },
    })
    updateItinerary({
      ['????????????']: {
        name: '????????????',
        items: columns.????????????.items,
      },
      ['?????????']: {
        name: '?????????',
        items: columns.?????????.items,
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
        if (columnId === '????????????') {
          const returnItem = oldItinerary.????????????.items
          returnItem[index].takePerson = null
          returnItem[index].takePersonID = null
          returnItem[index].takePersonPhoto = null
          setColumns({
            ['????????????']: {
              name: '????????????',
              items: returnItem,
            },
            ['?????????']: {
              name: '?????????',
              items: columns.?????????.items,
            },
          })
          updateItinerary({
            ['????????????']: {
              name: '????????????',
              items: returnItem,
            },
            ['?????????']: {
              name: '?????????',
              items: columns.?????????.items,
            },
          })
        } else {
          const returnItem = oldItinerary.?????????.items
          returnItem[index].takePerson = null
          returnItem[index].takePersonID = null
          returnItem[index].takePersonPhoto = null
          setColumns({
            ['????????????']: {
              name: '????????????',
              items: columns.????????????.items,
            },
            ['?????????']: {
              name: '?????????',
              items: returnItem,
            },
          })
          updateItinerary({
            ['????????????']: {
              name: '????????????',
              items: columns.????????????.items,
            },
            ['?????????']: {
              name: '?????????',
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
      if (source.droppableId === '????????????') {
        columns['????????????'].items.map((item, index) => {
          if (item.takePerson === null) {
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
              {['????????????', '?????????'].map((columnId, index) => {
                const column = columns[columnId]
                return (
                  <ColumnDivide key={columnId}>
                    <Text
                      fontSize="20px"
                      color=" #F6EAD6"
                      mobile_fontSize="16px"
                    >
                      {column.name}
                    </Text>
                    {columnId === '????????????' && (
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
                            placeholder="??????????????????????????????????????????"
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
                        <Text fontSize="14px">???????????????????????????????????????</Text>
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
                                            borderRadius: '12px',
                                            backgroundColor: snapshot.isDragging
                                              ? '#222322'
                                              : '#AC6947',
                                            backgroundColor:
                                              columnId === '?????????'
                                                ? 'rgba(34,35,34,0.2)'
                                                : ' rgba(34,35,34,0.5)',
                                            color: snapshot.isDragging
                                              ? '#222322'
                                              : '#F6EAD6',
                                            opacity:
                                              columnId === '?????????' ? 0.6 : 1,
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
                                                      columnId === '????????????'
                                                        ? '#B99362'
                                                        : '#F6EAD6',
                                                  }}
                                                >
                                                  {item.person}???
                                                </Text>
                                                <Text
                                                  tablet_fontSize="14px"
                                                  style={{
                                                    textDecoration:
                                                      columnId === '?????????'
                                                        ? 'line-through'
                                                        : 'none',
                                                    color:
                                                      columnId === '????????????'
                                                        ? '#B99362'
                                                        : ' #F6EAD6',
                                                  }}
                                                >
                                                  {item.content}
                                                </Text>
                                              </Divide>
                                              <Divide flexDirection="column">
                                                {value.userUid ===
                                                  item.personID && (
                                                  <>
                                                    <ReactTooltip
                                                      id="cardDelete"
                                                      place="bottom"
                                                      effect="solid"
                                                    >
                                                      ????????????
                                                    </ReactTooltip>
                                                    <Dot
                                                      data-tip
                                                      data-for="cardDelete"
                                                      onClick={() =>
                                                        handleDelete(
                                                          item,
                                                          index,
                                                          column,
                                                          columnId,
                                                        )
                                                      }
                                                    ></Dot>
                                                  </>
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
                                                  ????????????
                                                </Text>
                                                <Divide>
                                                  <IconImage
                                                    style={{
                                                      backgroundImage: `url(${item.takePersonPhoto})`,
                                                      display:
                                                        item.takePersonPhoto ===
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
                                                <Icon
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
                                                    backgroundImage: `url(${add})`,
                                                  }}
                                                ></Icon>
                                              </Divide>
                                              {item.takePerson &&
                                                item.takePersonID ===
                                                  value.userUid && (
                                                  <Btn
                                                    width="80px"
                                                    height="30px"
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
                                                    ????????????
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
                  </ColumnDivide>
                )
              })}
            </>
          )}
        </DragDropContext>
      </Divide>
    </BackgroundStyle>
  )
}

export default Itinerary
