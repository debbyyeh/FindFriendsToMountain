import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { UserContext } from '../../utils/userContext'
import { useParams } from 'react-router-dom'

import { doc, updateDoc, onSnapshot } from 'firebase/firestore'
import { Text, Divide, Btn } from '../../css/style'
import { db } from '../../utils/firebase'
import send from './send.png'

const ListInput = styled.input`
  width: 100%;
  border-bottom: solid 2px #222322;
  margin-bottom: 6px;
  height: 40px;
  color: #222322;
  font-size: 14px;
  @media screen and (max-width: 1279px) {
    font-size: 14px;
  }
`

const ToDoContainer = styled.div`
  min-height: 300px;
  min-width: 250px;
  max-width: 300px;
  background: #f1f5f8;
  background-image: radial-gradient(#bfc0c1 4.2%, transparent 0);
  background-size: 25px 25px;
  border-radius: 20px;
  box-shadow: 4px 3px 7px 2px #00000040;
  padding: 20px;
`

const CommentContainer = styled.div`
  max-height: 300px;
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
const Comment = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 6px auto;
  @media screen and (max-width: 1279px) {
    margin: 6px auto;
  }
`

const TodoList = ({ ownerAuth, memberAuth }) => {
  useEffect(() => {
    const unsub = onSnapshot(docRef, (doc) => {
      const data = doc.data()
      const todotData = data.todoList
      setLatest(todotData)
    })
  }, [])

  const [latest, setLatest] = useState()
  const urlID = useParams()
  const value = useContext(UserContext)

  const listRef = useRef()
  const docRef = doc(db, 'groupContents', urlID.id)

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      addTodo()
    }
  }
  const ToDoListForm = ({ addTodo }) => {
    function handleSubmit(e) {
      e.preventDefault()
      if (listRef.current.value === '') {
        value.alertPopup()
        value.setAlertContent('格內不可為空')
      } else {
        listRef.current.value && addTodo(listRef.current.value)
      }
    }

    return (
      <>
        <Divide
          style={{
            position: 'relative',
          }}
        >
          <ListInput
            type="text"
            onKeyDown={onKeyDown}
            ref={listRef}
            placeholder="enter the text"
          />
          <Btn
            position="absolute"
            right="10px"
            top="10px"
            border="1px solid #222322"
            color="#222322"
            fontSize="14px"
            onClick={handleSubmit}
            style={{
              backgroundImage: `url(${send})`,
              backgroundSize: 'contain',
              width: '20px',
              height: '20px',
              backgroundRepeat: 'no-repeat',
            }}
          ></Btn>
        </Divide>
      </>
    )
  }

  const addTodo = () => {
    let newArr = []
    const newAdd = {
      text: listRef.current.value,
      post: value.userName,
      postID: memberAuth ? memberAuth : ownerAuth,
    }
    newArr.push(newAdd, ...latest)
    updateToDoList(newArr)
  }

  const removeTodo = (index) => {
    const newTodo = [...latest]
    newTodo.splice(index, 1)
    updateToDoList(newTodo)
  }

  async function updateToDoList(latest) {
    const newArr = [...latest]
    const updatetodoList = await updateDoc(docRef, {
      todoList: newArr,
    })
  }
  return (
    <>
      <ToDoContainer>
        <ToDoListForm addTodo={addTodo} />
        <CommentContainer>
          {latest &&
            latest.map((list, index) => {
              return (
                <>
                  <Comment key={index}>
                    <Divide
                      justifyContent="flex-start"
                      flexDirection="column"
                      alignItems="start"
                    >
                      <Text
                        fontSize="14px"
                        mobile_fontSize="14px"
                        color="#222322"
                      >
                        {list.post}:
                      </Text>
                      <Text fontSize="12px" color="#222322">
                        {list.text}
                      </Text>
                    </Divide>
                    {(value.userUid === ownerAuth ||
                      value.userUid === latest[index].postID) && (
                      <Btn
                        margin="0 2px 0 0"
                        color="#222322"
                        width="20px"
                        height="20px"
                        border="1px solid #222322"
                        borderRadius="50%"
                        padding="0px"
                        tablet_width="20px"
                        tablet_border="none"
                        onClick={() => removeTodo(index)}
                      >
                        x
                      </Btn>
                    )}
                  </Comment>
                </>
              )
            })}
        </CommentContainer>
      </ToDoContainer>
    </>
  )
}

export default TodoList
