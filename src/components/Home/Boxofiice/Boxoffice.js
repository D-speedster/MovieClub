import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './Boxoffice.css';
export default function Boxoffice(props) {
    return (
        <div className='BoxOffice'>
            <div>
                <h4 className='mt-2'>فروش هفتگی سینمای جهان</h4>
                <Row className='justify-content-start'>
                    {Object.entries(props).map(item => (
                        <Col key={Math.random(10, 1000)} lg={3} sm={6} xs={6}>
                            <div className='d-lg-flex justify-content-end Item-Box-Office'>

                                <Col lg={2} className='dd-lx'>
                                    <h1 className='mt-3 me-2'>{item[1].rank}</h1>
                                </Col>
                                <Col lg={3} className='dd-lx'>
                                    <img src={item[1].image} />
                                </Col>
                                <Col className='dd-lx'>
                                    <h6>{item[1].title}</h6>
                                    <h6>فروش هفتگی : {item[1].weekend}</h6>
                                    <h6>فروش کلی : {item[1].gross}</h6>
                                </Col>


                            </div>
                        </Col>
                    ))}

                </Row>
            </div>
        </div>
    )
}
