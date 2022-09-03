import React, { useState } from 'react'
import './App.css'
import { createGlobalStyle } from 'styled-components'
import Header from './components/Header'

import { Link, Routes, Route, Outlet, BrowserRouter } from 'react-router-dom'
import { UserContext } from './utils/userContext'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  #root{
    min-height:100vh;
  }
`
const App = () => {
  // const [state, setState] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: new Date(),
  //     key: 'selection',
  //   },
  // ])

  return (
    <>
      <UserContext.Provider>
        <GlobalStyle />
        <Header />
        <Outlet />
      </UserContext.Provider>

      {/* <DateRange
        editableDateInputs={true}
        onChange={(item) => setState([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={state}
        dateDisplayFormat="yyyy/MM/dd"
        rangeColors={['#577D45']}
      /> */}
    </>
  )
}

export default App
