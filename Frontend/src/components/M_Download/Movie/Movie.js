import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import './Movie.css'
import Logger from '../../../utils/logger'

export default function Movie(props) {
    useEffect(() => {
        // Component mounted - can be used for analytics or other side effects
        Logger.log('Movie component mounted with info:', props.info?.[2]);
    }, [props.info]); // اضافه کردن dependency array

    return (
        <div className='Movie'>
            <div className='Movie_Head' style={{
                background: `url(${props.info?.[3] || ''})`
            }}>
                <Container>
                    <Row className='justify-content-between'>
                        <Col className='Poster' lg={4} md={5} xs={12} sm={12} onDragStart={(event) => event.preventDefault()}>
                            <img alt="Mobile preview" className='img-mobile' src='../img/mobile2-removebg-preview.png' />
                            <img alt={`پوستر ${props.info?.[2] || 'فیلم'}`} className='img-poster' src={props.info?.['0'] || ''}></img>
                        </Col>
                        <Col className='INFO_HEAD' lg={6}>
                            <ul>
                                <h4 style={{ color: '#fff', display: 'block' }}>فیلم : {props.info?.[2] || 'نامشخص'}</h4>
                                <li>فروش کلی : 248 میلیون دلار</li>
                                <li>افتخارات : برنده 2 اسکار و نامزد 3 اسکار دیگر</li>
                                <li>دوبله فارسی + زیرنویس چسبیده</li>
                                <li>جزو 250 فیلم برتر جهان</li>
                                <li>دوبله فارسی + زیرنویس چسبیده</li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}
