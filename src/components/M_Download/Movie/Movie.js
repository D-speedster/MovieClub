import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import './Movie.css'
export default function Movie() {
    return (
        <div className='Movie'>
            <div className='Movie_Head '>
                <Container>
                    <Row className='pt-5 justify-content-between'>

                        <Col className='Poster' lg={4} md={5} xs={12} sm={12} onDragStart={(event) => event.preventDefault()}>
                            <img className='img-mobile' src='/img/mobile2-removebg-preview.png' />
                            <img className='img-poster' src='/img/poster.jpg'></img>

                        </Col>
                        <Col className='trailer' lg={7} md={5} xs={12} sm={12}>
                            <img className='img-fluid img-tablet ' src='/img/tablet.png'></img>
                            <video poster='/img/video.jpg' className='img-video' controls>
                                <source src='/img/Marvel.mp4' type="video/mp4"></source>
                            </video>


                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}
