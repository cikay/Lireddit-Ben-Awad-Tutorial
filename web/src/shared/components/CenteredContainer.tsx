import React from 'react'
import { Container } from 'react-bootstrap'
type Props = React.PropsWithChildren<{}>
export default function CenteredContainer({ children }: Props) {
  return (
    <Container
      className='d-flex align-items-center justify-content-center'
      style={{ minHeight: '70vh' }}
    >
      <div className='w-100' style={{ maxWidth: '400px' }}>
        {children}
      </div>
    </Container>
  )
}
