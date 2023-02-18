import React from 'react'
import { Col, Container, Pagination, Row } from 'react-bootstrap'
import './InfoMovie.css';
export default function InfoMovie({ children }) {

    return (
        <div className='Info_Movie'>
            <Container>
                <Row >
                    <Col className='Info_Movie_Section' lg={5} md={6} xs={12} sm={12}>
                        <ul>

                            <li>

                                <span>🥇 امتیاز : 7.8 از 10</span>

                            </li>
                            <li>
                                <span>🎭 ژانر : اکشن , درام , علمی تخیلی , فانتزی , ماجراجویی </span>
                            </li>

                            <li>
                                <span>🗿 بازیگران : robert downey jr.,chris evans,mark ruffalo </span>


                            </li>
                            <li>
                                <span>📣 کشور سازنده : آمریکا</span>

                            </li>
                            <li>
                                <span>⛱ زبان فیلم : اصلی + دوبله فارسی</span>
                            </li>
                            <li>
                                <span>🎦 کارگردان : anthony russo , joe russo</span>
                            </li>
                            <li>
                                <span>📆 سال انتشار : 2019</span>
                            </li>
                            <li>
                                <span>⏰ مدت زمان : 181 دقیقه</span>
                            </li>
                            <li>
                                <span>⏰ رده سنی : R</span>
                            </li>


                            <li>

                                <span>🎬 خلاصه داستان : </span>
                                پس از حوادث "انتقام‌جویان: جنگ ابدیت"، جهان ویرانه شده و انتقام‌جویان به کمک متحدان باقیمانده‌ی خود بار دیگر گرد هم می‌آیند تا اعمال تانوس را خنثی کرده و نظم را به دنیا بازگردانند...

                            </li>



                        </ul>

                    </Col>
                    <Col className='mt-5 gallery_Pic' lg={7} md={6} xs={12} sm={12} >
                        <Row>
                            <Col lg={6} md={6} xs={6} sm={6}>
                                <img src='/img/Capture.PNG' />
                            </Col>
                            <Col lg={6} md={6} xs={6} sm={6} >
                                <img src='/img/Capture2.PNG' />
                            </Col>
                            <Col lg={6} md={6} xs={6} sm={6} >
                                <img src='/img/Capture3.PNG' />
                            </Col>
                            <Col lg={6} md={6} xs={6} sm={6} >
                                <img src='/img/Capture4.PNG' />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {children}
            </Container>
     

        </div>
    )
}
