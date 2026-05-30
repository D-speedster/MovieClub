
import React, { useEffect, useState } from 'react'
import { Figure, Col, Modal, Button, Container, Row } from 'react-bootstrap';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsTrash3 } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import './Movie_mange.css';
import ApiRequest from '../../../Services/Axios/config';
import { getPosterUrl } from '../../../utils/posterUrl';


export default function Movie_mange() {
    let [result, SetResult] = useState([]);
    const [show, setShow] = useState(false);
    const [movieToRemove, setMovieToRemove] = useState('');
    const [TextSearch, SetSearch] = useState('');


    const handleClose = () => { setShow(false) }

    const Remover = () => {
        setShow(false);
        ApiRequest.delete(`/content/${movieToRemove}`).then(() => setMovieToRemove(''))
    }
    const DeleteMovie = (id) => {
        setShow(true)
        setMovieToRemove(id)

    }
    const EditMovie = (id) => {

    }

    useEffect(() => {
        ApiRequest.get('/content/movieList').then(data => {
            const movies = Array.isArray(data.data) ? data.data : Object.values(data.data);
            SetResult(movies);
        })
    }, [movieToRemove]);

    const SearchAllMovie = (event) => {

        SetSearch(event.target.value);

    }
    useEffect(() => {
        if (TextSearch.length >= 3) {
            ApiRequest.get('/content/movieList').then(data => {
                const movies = Array.isArray(data.data) ? data.data : Object.values(data.data);
                SetResult(movies.filter(m =>
                    (m.title || m.name || '').toLowerCase().includes(TextSearch.toLowerCase())
                ));
            })
        } else {
            ApiRequest.get('/content/movieList').then(data => {
                const movies = Array.isArray(data.data) ? data.data : Object.values(data.data);
                SetResult(movies);
            })
        }
    }, [TextSearch]);


    return (
        <div className='container'>
            <Container>
                <Row className='d-flex justify-content-between mt-3' flex-wrap='wrap'>
                    <Row className='d-flex justify-content-between mt-3'>
                        <Col lg={6}> <h3 className='title_admin'>مدیریت فیلم ها</h3></Col>
                        <Col lg={6}>
                            <input onChange={SearchAllMovie} className='form-control me-4' placeholder='فیلم مورد نظر ...' />
                        </Col>
                    </Row>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Modal heading</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>آیا میخواهید این فیلم را حذف کنید ؟ </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                خیر نیازی نیست
                            </Button>
                            <Button variant="primary" onClick={() => Remover()}>
                                بله انجام شود
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    {result && result.length > 0 ? (
                        [...result].reverse().map((movie) => {
                            const posterUrl = getPosterUrl(movie.poster);
                            const title = movie.title || movie.name || 'بدون عنوان';
                            const id = movie._id || movie.id;
                            return (
                                <Col key={id} lg={3} sm={6} md={3} xs={6} className='movie_data' style={{ width: '22%', marginTop: '25px', backgroundImage: `url(${posterUrl})` }}>
                                    <div className='info_onMovie p-2'>
                                        <h4>{title}</h4>
                                    </div>
                                    <div className='Setting_Footer'>
                                        <br />
                                        <Row>
                                            <Col style={{ marginTop: '-12px' }}>
                                                <Link to={`/admin/movies/${id}`}>
                                                    <AiOutlineEdit style={{ color: 'green', fontSize: '22px' }} />
                                                </Link>
                                                <BsTrash3 onClick={() => DeleteMovie(id)} style={{ color: 'red', fontSize: '22px' }} />
                                            </Col>
                                            <Col style={{ marginTop: '-12px' }}>
                                                {movie.createdAt ? new Date(movie.createdAt).toLocaleDateString('fa-IR') : 'نامشخص'}
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            );
                        })
                    ) : (
                        <Col xs={12} className="text-center mt-5">
                            <p style={{ color: '#aaa' }}>هیچ فیلمی یافت نشد</p>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    )
}
