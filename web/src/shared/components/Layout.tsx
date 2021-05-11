import React from 'react'
import { Col, Row } from 'react-bootstrap'
import Navbar from './Navbar'
type Props = React.PropsWithChildren<{}>

export default function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      <Row>
        <Col xs={12} sm={2}></Col>
        <Col xs={12} sm={6}>
          <div className='mt-1'>{children}</div>
        </Col>
        <Col xs={12} sm={4}></Col>
      </Row>
    </>
  )
}
