import React from 'react'
import { Card, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { AiOutlineArrowLeft } from 'react-icons/ai'


import './SliderMovie.css';
export default function SliderMovie(props) {

    return (
        <div className='Slider_Movie mt-5'>
            <div className='d-flex justify-content-between'>
                <h5 style={{ paddingRight: '24px', color: '#FFF', fontSize: '24px' }}>{props.Title}</h5>
                <h5 style={{ paddingLeft: '24px', color: '#FFF' }}>
                    مشاهده کامل
                    <AiOutlineArrowLeft className='me-1' />

                </h5>
            </div>
            <Container fluid>
                <Swiper

                    slidesPerView={1}
                    spaceBetween={10}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                    breakpoints={{
                        "@0.00": {
                            slidesPerView: 3,
                            spaceBetween: 10,
                        },
                        "@0.75": {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        "@1.00": {
                            slidesPerView: 2,
                            spaceBetween: 40,
                        },
                        "@1.50": {
                            slidesPerView: 6,
                            spaceBetween: 5
                        },
                    }}
                >

                    {Object.entries(props).map(item => (
                        <div key={Math.random(10 , 1000)}>

                            <SwiperSlide key={Math.random(10 , 1000)} >
                                <Link to='/Movie'>
                                    <Card>
                                        <div className='info_Sliders'>

                                            {item[1].nameEn}
                                        </div>
                                        <Card.Header>

                                            <img src={item[1].poster} />
                                            <p className='Rate_Movie'>{item[1].rate}</p>
                                            <div className='Story' style={{ color: 'white' }}>
                                                <h5>خلاصه داستان</h5>
                                                {item[1].story}
                                            </div>
                                        </Card.Header>

                                        <Card.Body>
                                            {/* 
                                         <p>{item[1].nameEn}</p>
                                        <p>{item[1].namePer}</p> * */}

                                            <p>

                                            </p>

                                        </Card.Body>
                                    </Card>
                                </Link>
                            </SwiperSlide> 

                        </div>
                    ))}




                </Swiper>
            </Container>
        </div>
    )
}
