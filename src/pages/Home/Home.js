import { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { UserContext } from '../../utils/userContext'

const LoginClick = styled(Link)`
  color: white;
`

function Home() {
  const userUid = useContext(UserContext)
  const [isLogged, setIsLogged] = useState()
  useEffect(() => {
    if (userUid !== undefined) {
      setIsLogged(true)
    }
  }, [])

  return (
    <>
      <div>Find Friends to Mountain</div>
      {!isLogged && <LoginClick to="login">登入頁面</LoginClick>}
    </>
  )
}

export default Home
