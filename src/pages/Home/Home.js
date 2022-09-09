import { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { UserContext } from '../../utils/userContext'

const LoginClick = styled(Link)`
  color: white;
`

function Home() {
  const value = useContext(UserContext)
  const [isLogged, setIsLogged] = useState(false)
  useEffect(() => {
    if (value.userUid !== undefined) {
      setIsLogged(true)
    }
  }, [value.userUid])

  return (
    <>
      <div>Find Friends to Mountain</div>
      {!isLogged && <LoginClick to="login">登入頁面</LoginClick>}
    </>
  )
}

export default Home
