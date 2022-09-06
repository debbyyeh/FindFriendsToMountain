// import getFirebaseData from '../utils/getFirebaseData'
import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { UserContext } from '../utils/userContext'
import { uuidv4 } from '@firebase/util'

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
const CategoryLabel = styled.div`
  width: calc(100% / 3);
  cursor: pointer;

  color: ${(props) => (props.$isActive ? '#B99362' : 'white')};
  font-weight: ${(props) => (props.$isActive ? 'bold' : 'normal')};
`
const ToDoTag = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const TodoList = () => {
  const [isActive, setIsActive] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState()
  const [todoList, setTodoList] = useState([])
  const value = useContext(UserContext)
  const userName = useContext(UserContext)
  console.log(value.userUid)
  const listRef = useRef()

  function addList(e) {
    if (listRef.current.value !== '') {
      setTodoList([
        ...todoList,
        {
          id: uuidv4(),
          text: listRef.current.value,
          checked: false,
          post: value.userName,
        },
      ])
      listRef.current.value = ''
    }
  }
  console.log(todoList, value.userName)

  function TodoListItem({
    item: { id, text, post, checked },
    onChecked,
    onDelete,
  }) {
    return (
      <ToDoTag>
        <label>
          <input
            type="checkbox"
            value="true"
            checked={checked}
            onChange={(e) => {
              onChecked(id, e.target.checked)
            }}
          />
        </label>
        <p>
          {post}:{text}
        </p>
        <a
          onClick={(e) => {
            e.preventDefault()
            onDelete(id)
          }}
        >
          x
        </a>
      </ToDoTag>
    )
  }
  return (
    <>
      <Divide>
        <ListInput placeholder="請輸入代辦清單" ref={listRef} />
        <AddBtn onClick={addList}>+</AddBtn>
      </Divide>

      <ListWrapper>
        <Divide>
          {['全部', '待完成', '已完成'].map((category, index) => (
            <CategoryLabel
              key={index}
              $isActive={index === tabIndex}
              onClick={() => {
                setTabIndex(index)
                setCurrentPage(index)
              }}
            >
              {category}
            </CategoryLabel>
          ))}
        </Divide>

        {todoList &&
          todoList.map((item, index) => {
            return (
              <TodoListItem
                item={item}
                key={index}
                // onChecked={onChecked}
                // onDelete={onDelete}
              />
            )
          })}

        {currentPage == 0 && <div>完成</div>}

        {currentPage == 1 && <div>待完成</div>}
        {currentPage == 2 && <div>已完成</div>}
      </ListWrapper>
    </>
  )
}

export default TodoList
