import React from 'react'
import { Nav, Navbar, Container, Offcanvas, Button, NavDropdown, Form } from 'react-bootstrap'
import './Header.css';
import { FcHome } from "react-icons/fc";
import { RiMovie2Fill } from "react-icons/ri";
import { BiMoviePlay } from "react-icons/bi";
import { GiPerspectiveDiceFour } from "react-icons/gi";
import { AiFillPhone } from "react-icons/ai";
import { MdHome } from "react-icons/md"


export default function Header() {
    return (
        // <div className='Header_Nav'>
        //     <Container>

        //     </Container>
        // </div>
        <>
            <>
                {['lg'].map((expand) => (
                    <Navbar key={expand} bg="light" expand={expand} className=" bg-dark">
                        <Container >
                            <Navbar.Brand className='' href="#">
                                <img style={{ height: '65px', marginTop: '7px', width: '120px' }} className='img-fluid' src='/img/MOVIECLUBLOGO.png' />
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                            <Navbar.Offcanvas
                                id={`offcanvasNavbar-expand-${expand}`}
                                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                                placement="end"
                            >
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                        Offcanvas
                                    </Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    <Nav>
                                        <Nav.Link href='#Home' className=''>
                                            <MdHome style={{ color: '#db3163', fontSize: '26px' }}></MdHome>

                                            خانه
                                        </Nav.Link>
                                        <Nav.Link>
                                            <RiMovie2Fill style={{ color: '#db3163', fontSize: '26px' }}></RiMovie2Fill>
                                            دانلود فیلم
                                        </Nav.Link>
                                        <Nav.Link>
                                            <BiMoviePlay style={{ color: '#db3163', fontSize: '26px' }}></BiMoviePlay>
                                            دانلود سریال
                                        </Nav.Link>
                                        <Nav.Link>
                                            <GiPerspectiveDiceFour style={{ color: '#db3163', fontSize: '26px' }}></GiPerspectiveDiceFour>
                                            دانلود انیمیشن
                                        </Nav.Link>
                                        <Nav.Link>

                                            <AiFillPhone style={{ color: '#db3163', fontSize: '26px' }}></AiFillPhone>
                                            تماس با ما

                                        </Nav.Link>



                                    </Nav>

                                </Offcanvas.Body>
                            </Navbar.Offcanvas>
                        </Container>
                    </Navbar>
                ))}
            </>
        </>
    )
}
