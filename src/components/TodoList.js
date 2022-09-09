// import getFirebaseData from '../utils/getFirebaseData'
import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { UserContext } from '../utils/userContext'
import {
  collection,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../utils/firebase'

const ListInput = styled.input`
  width: 100%;
  border: 1px solid white;
  height: 40px;
  padding-left: 12px;
  color: white;
  font-size: 18px;
`
const ListWrapper = styled.div`
  border: 1px solid white;
  border-radius: 8px;
  margin-top: 24px;
  height: 400px;
  padding: 16px;
  overflow: hidden;
`
const Divide = styled.div`
  display: flex;
`
const AddBtn = styled.button`
  color: white;
  border: none;
  font-size: 24px;
`
const ToDoTag = styled.div`
  display: flex;
  align-items: center;
`
const DeleteTodo = styled.button`
  color: white;
  border: 1px solid white;
`
const Poster = styled.span`
  width: 20%;
`
const PostMsg = styled.span`
  flex-grow: 1;
`
const CheckedInput = styled.div`
  width: 80%;
  margin-top: 12px;
  margin-bottom: 12px;
  font-size: 18px;
`
const Complete = styled.p`
  width: 20%;
  color: #b99362;
`
const DeleteAll = styled.div`
  cursor: pointer;
  opacity: 0.7;
  width: 145px;
  font-size: 14px;
  margin-left: auto;
`
const TodoList = () => {
  useEffect(() => {
    getToDoList()
    const unsub = onSnapshot(docRef, (doc) => {
      const data = doc.data()
      const latestData = data.todoList
      setLastest(latestData)
    })
  }, [])

  const [getToDo, setGetTodo] = useState([])
  const [todoList, setTodoList] = useState([])
  const [lastest, setLastest] = useState()

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
      listRef.current.value && addTodo(listRef.current.value)
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
          <AddBtn onClick={handleSubmit}>+</AddBtn>
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
    newArr.push(newAdd, ...lastest)
    setTodoList(newArr)
    updateToDoList(newArr)
  }

  const removeTodo = (index) => {
    const newTodo = [...todoList]
    newTodo.splice(index, 1)
    setTodoList(newTodo)
    updateToDoList(newTodo)
  }
  const stateTask = (index) => {
    console.log('clicked')
    const newTodo = [...todoList]
    newTodo[index].checked = !newTodo[index].checked
    setTodoList(newTodo)
    updateToDoList(newTodo)
  }

  async function updateToDoList(todoList) {
    const newArr = [...todoList]
    const updatetodoList = await updateDoc(docRef, {
      todoList: newArr,
    })
  }

  function deleteCompletedItems(event) {
    event.preventDefault()
    setTodoList(lastest.filter((item) => item.checked == false))
    const leftTodo = lastest.filter((item) => item.checked == false)
    updateToDoList(leftTodo)
  }
  return (
    <>
      <ToDoListForm addTodo={addTodo} />
      {lastest &&
        lastest.map((list, index) => {
          return (
            <>
              <ToDoTag key={index}>
                <CheckedInput
                  onClick={() => stateTask(index)}
                  style={{
                    textDecoration: list.checked ? 'line-through' : 'none',
                  }}
                >
                  <Poster>{list.post}:</Poster>
                  <PostMsg>{list.text}</PostMsg>
                </CheckedInput>
                {list.checked ? <Complete>已完成</Complete> : null}
                <DeleteTodo onClick={() => removeTodo(index)}>x</DeleteTodo>
              </ToDoTag>
            </>
          )
        })}
      <DeleteAll onClick={deleteCompletedItems}>清除所有已完成項目</DeleteAll>
    </>
  )
}

export default TodoList
