import React from 'react'
import { Col, Row, Container } from 'react-bootstrap'
import './Latest_Trailers.css';
import { BsPlayCircleFill } from 'react-icons/bs'

const images = require.context("/public/img/Last_Trailer/", true)
const defaultImage = images.keys()[0].split('/')[1];
console.log(`/img/${defaultImage}`)

export default function Latest_Trailers() {
  let ChangeBackTrailer = (event) => {
    console.log(event.target.dataset.img)
    console.log(event.target.parentNode.parentNode.parentNode.style.background = `url(${event.target.dataset.img})`)
    console.log(event.target.parentElement)
  }


  return (
    <div className='Latest_Trailers'>
      <div className='Latest_Trailers_Box' style={{ background: `url(/img/Last_Trailer/${defaultImage})` }}>
        <h4>آخرین تریلر ها
        </h4>
        <Row>
          <Col lg={3} md={3} sm={6} xs={6} className='Last_Trailer_Item'>
            <img src='/img/Last_Trailer/Trailer_Background.jpg' data-img='/img/Last_Trailer/Trailer_Background.jpg' onMouseOverCapture={ChangeBackTrailer}></img>
            <BsPlayCircleFill></BsPlayCircleFill>
          </Col>
          <Col lg={3} md={3} sm={6} xs={6} className='Last_Trailer_Item'>
            <img src='/img/Last_Trailer/t_poster1.jpg' data-img='/img/Last_Trailer/t_poster1.jpg' onMouseOverCapture={ChangeBackTrailer}></img>
            <BsPlayCircleFill></BsPlayCircleFill>
          </Col>
          <Col lg={3} md={3} sm={6} xs={6} className='Last_Trailer_Item'>
            <img src='/img/Last_Trailer/t_poster2.jpg' data-img='/img/Last_Trailer/t_poster2.jpg' onMouseOverCapture={ChangeBackTrailer}></img>
            <BsPlayCircleFill></BsPlayCircleFill>
          </Col>
          <Col lg={3} md={3} sm={6} xs={6} className='Last_Trailer_Item'>
            <img src='/img/Last_Trailer/t_poster3.jpg' data-img='/img/Last_Trailer/t_poster3.jpg' onMouseOverCapture={ChangeBackTrailer}></img>
            <BsPlayCircleFill></BsPlayCircleFill>
          </Col>
        </Row>

      </div>
    </div>
  )
}
