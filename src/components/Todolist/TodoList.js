import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { UserContext } from '../../utils/userContext'

import {
  collection,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../../utils/firebase'

const ListInput = styled.input`
  width: 70%;
  border-bottom: dashed 3px #222322;
  margin-top: 12px;
  margin-bottom: 14px;
  height: 40px;
  padding-left: 12px;
  color: #222322;
  font-size: 18px;
  &:focus {
    border: solid 2px #222322;
  }
  @media screen and (max-width: 1279px) {
    font-size: 14px;
  }
`

const AddBtn = styled.button`
  color: #222322;
  padding: 0px;
  border: none;
  font-size: 20px;
  transform: rotate(4deg);
  transform-origin: center;
  border-radius: 5px;
  ${'' /* background-color: rgba(172, 105, 71, 0.8); */}
  padding-bottom: 3px;
  box-shadow: 0 2px 0 rgb(135, 88, 57);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  span {
    display: block;
    padding: 8px 12px;
    border-radius: 5px;
    border: 2px solid rgb(135, 88, 57);
  }
  &:active,
  &:focus {
    transform: translateY(4px);
    padding-bottom: 0px;
    outline: 0;
  }
  @media screen and (max-width: 1279px) {
    font-size: 16px;
    span {
      padding: 8px;
    }
  }
  @media screen and (max-width: 767px) {
    font-size: 16px;
    span {
      padding: 4px;
    }
  }
`

const CheckedInput = styled.div`
  width: 100%;
  font-size: 18px;
`
const Complete = styled.p`
  width: 20%;
  color: #ac6947;
  font-weight: 900;
  margin: 0;
  @media screen and (max-width: 1279px) {
    font-size: 14px;
  }
`

const ToDoContainer = styled.div`
  width: 100%;
  height: auto;
  min-height: 500px;
  min-width: 250px;
  background: #f1f5f8;
  background-image: radial-gradient(#bfc0c1 7.2%, transparent 0);
  background-size: 25px 25px;
  border-radius: 20px;
  box-shadow: 4px 3px 7px 2px #00000040;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
`

const ToDoTitle = styled.div`
  width: 250px;
  color: #F6EAD;
  transform: rotate(2deg);
  padding: 8px 16px;
  border-radius: 20% 5% 20% 5%/5% 20% 25% 20%;
  background-color: #ac6947;
  font-size: 24px;
  @media screen and (max-width: 1279px) {
    font-size: 20px;
    width: 100px;
    padding: 4px 8px;
  }
  @media screen and (max-width: 767px) {
    font-size: 16px;
    width: 50%;
    padding: 4px 8px;
  }
`
const TodoList = ({
  Text,
  DivideBorder,
  Divide,
  Btn,
  InfoInput,
  BackColor,
  SrcImage,
}) => {
  useEffect(() => {
    getToDoList()
    const unsub = onSnapshot(docRef, (doc) => {
      const data = doc.data()
      const todotData = data.todoList
      setLatest(todotData)
    })
  }, [])

  const [getToDo, setGetTodo] = useState([])
  const [todoList, setTodoList] = useState([])
  const [latest, setLatest] = useState()

  const value = useContext(UserContext)
  let url = window.location.href
  const newUrl = url.split('/activity/')
  const groupID = newUrl[1]
  const listRef = useRef()
  const docRef = doc(db, 'groupContents', groupID)
  //取得group的todolist

  async function getToDoList() {
    console.log('取得TODOLIST資訊')
    try {
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const todoListData = docSnap.data()
        const oldToDo = todoListData.todoList
        setGetTodo(oldToDo)
      }
    } catch {
      console.log('No such document!')
    }
  }

  function onKeyDown(e) {
    if (e.key == 'Enter') {
      addTodo()
    }
  }
  const ToDoListForm = ({ addTodo }) => {
    function handleSubmit(e) {
      e.preventDefault()
      if (listRef.current.value == '') {
        window.alert('不可為空')
      } else {
        listRef.current.value && addTodo(listRef.current.value)
      }
    }

    return (
      <>
        <Divide>
          <ListInput
            type="text"
            onKeyDown={onKeyDown}
            ref={listRef}
            placeholder="enter the text"
          />
          <AddBtn onClick={handleSubmit}>
            <span>Submit</span>
          </AddBtn>
        </Divide>
      </>
    )
  }

  const addTodo = () => {
    let newArr = []
    const newAdd = {
      text: listRef.current.value,
      checked: false,
      post: value.userName,
    }
    newArr.push(newAdd, ...latest)
    setTodoList(newArr)
    updateToDoList(newArr)
  }

  const removeTodo = (index) => {
    const newTodo = [...latest]
    newTodo.splice(index, 1)
    setTodoList(newTodo)
    updateToDoList(newTodo)
  }
  const stateTask = (index) => {
    const newTodo = [...latest]
    newTodo[index].checked = !newTodo[index].checked
    setTodoList(newTodo)
    updateToDoList(newTodo)
  }

  async function updateToDoList(latest) {
    const newArr = [...latest]
    const updatetodoList = await updateDoc(docRef, {
      todoList: newArr,
    })
  }

  function deleteCompletedItems(event) {
    event.preventDefault()
    // setTodoList(latest.filter((item) => item.checked == false))
    // const leftTodo = latest.filter((item) => item.checked == false)
    setTodoList([])
    // updateToDoList(leftTodo)
    updateToDoList([])
  }
  return (
    <>
      <DivideBorder
        width="50%"
        height="auto"
        border="none"
        mobile_width="100%"
        mobile_marginTop="20px"
      >
        <ToDoContainer>
          <ToDoTitle>留言板</ToDoTitle>
          <ToDoListForm addTodo={addTodo} />
          {/* <Text
            textAlign="left"
            color="#222322"
            fontSize="14px"
            tablet_fontSize="12px"
            mobile_fontSize="12px"
          >
            輸入需協助事項，完成後點選訊息更改狀態即可
          </Text> */}
          {latest &&
            latest.map((list, index) => {
              return (
                <>
                  <Divide
                    marginTop="12px"
                    marginBottom="12px"
                    alignItmes="center"
                    key={index}
                  >
                    <Divide justifyContent="flex-start">
                      <Text
                        fontSize="20px"
                        tablet_fontSize="16px"
                        mobile_fontSize="14px"
                        color="#B99362"
                      >
                        {list.post}:
                      </Text>
                      <CheckedInput
                        onClick={() => stateTask(index)}
                        style={{
                          color: '#AC6947',
                          textDecoration: list.checked
                            ? 'line-through'
                            : 'none',
                        }}
                      >
                        <Text
                          color="#222322"
                          margin="0 0 0 8px"
                          mobile_fontSize="14px"
                          style={{
                            cursor: 'pointer',
                          }}
                        >
                          {list.text}
                        </Text>
                      </CheckedInput>
                    </Divide>
                    {list.checked ? <Complete>已完成</Complete> : null}
                    <Btn
                      color="#222322"
                      width="30px"
                      height="30px"
                      border="1px solid #222322"
                      borderRadius="50%"
                      padding="0px"
                      tablet_width="0"
                      tablet_height="0"
                      onClick={() => removeTodo(index)}
                    >
                      x
                    </Btn>
                  </Divide>
                </>
              )
            })}
          <Btn
            marginLeft="auto"
            color="#222322"
            width="200px"
            height="40px"
            border="1px solid #222322"
            position="absolute"
            bottom="30px"
            left="90%"
            tablet_width="140px"
            tablet_fontSize="12px"
            tablet_height="30px"
            style={{
              transform: 'translateX(-90%)',
            }}
            onClick={deleteCompletedItems}
          >
            清除所有留言
          </Btn>
        </ToDoContainer>
      </DivideBorder>
    </>
  )
}

export default TodoList
