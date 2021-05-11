import React from 'react'
import { Button, Dropdown, Navbar } from 'react-bootstrap'
import { FaUser } from 'react-icons/fa'
import { Link, useHistory } from 'react-router-dom'
import { useMeQuery, useLogoutMutation } from '../../generated/graphql'

export default function NavbarComponent() {
  const [{ data }] = useMeQuery()
  const [, logout] = useLogoutMutation()
  const history = useHistory()
  console.log('data', data)
  let body = null
  if (!data?.me) {
    body = (
      <div className='w-25 align-items-center'>
        <Link to='/login'>Giriş Yap</Link>
        <Link className='ml-2' to='/register'>
          Kaydol
        </Link>
      </div>
    )
  } else {
    body = (
      <div className='ml-auto d-flex justify-content-between align-items-center'>
        <Button className='mr-5' onClick={() => history.push('/create-post')}>
          Create
        </Button>
        <Dropdown drop='left' className='ml-7'>
          <Dropdown.Toggle
            as='aside'
            variant='success'
            id='dropdown-menu-align-left'
          >
            <FaUser
              style={{ height: '20px', width: '20px', cursor: 'pointer' }}
            />
            <Dropdown.Menu>
              {`Logged In as ${data?.me?.username}`}
              <Dropdown.Item
                onClick={async () => {
                  await logout()
                  console.log('history logout', history)
                  window.location.reload()
                }}
              >
                Logout
              </Dropdown.Item>
              <Dropdown.Item href='/profile'>Profile</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Toggle>
        </Dropdown>
      </div>
    )
  }
  return (
    <Navbar bg='light' expand='lg' className='w-100'>
      <div className='d-flex m-auto flex-grow-1 justify-content-between align-items-center'>
        <Navbar.Brand href='/'>Reddit clone</Navbar.Brand>
        <div className='ml-auto'>{body}</div>
      </div>
    </Navbar>
  )
}
