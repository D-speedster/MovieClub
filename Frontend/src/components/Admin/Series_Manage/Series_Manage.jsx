import React, { useEffect, useState } from 'react'
import { Col, Modal, Button, Container, Row } from 'react-bootstrap';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsTrash3 } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import TitleAdmin from '../TitleAdmin/TitleAdmin';
import ApiRequest from '../../../Services/Axios/config';

export default function Movie_Series() {
    const [result, SetResult] = useState([]);
    const [show, setShow] = useState(false);
    const [seriesToRemove, setSeriesToRemove] = useState('');
    const [TextSearch, SetSearch] = useState('');

    const handleClose = () => setShow(false);

    const Remover = () => {
        setShow(false);
        ApiRequest.delete(`/content/${seriesToRemove}`).then(() => setSeriesToRemove(''));
    };

    const DeleteSeries = (id) => {
        setShow(true);
        setSeriesToRemove(id);
    };

    useEffect(() => {
        ApiRequest.get('/content/seriesList').then(data => {
            const series = Array.isArray(data.data) ? data.data : Object.values(data.data);
            SetResult(series);
        });
    }, [seriesToRemove]);

    useEffect(() => {
        if (TextSearch.length >= 3) {
            ApiRequest.get('/content/seriesList').then(data => {
                const series = Array.isArray(data.data) ? data.data : Object.values(data.data);
                SetResult(series.filter(s =>
                    (s.title || s.name || '').toLowerCase().includes(TextSearch.toLowerCase())
                ));
            });
        } else {
            ApiRequest.get('/content/seriesList').then(data => {
                const series = Array.isArray(data.data) ? data.data : Object.values(data.data);
                SetResult(series);
            });
        }
    }, [TextSearch]);

    return (
        <Container>
            <div dir='rtl' className='row justify-content-between'>
                <Row className='d-flex justify-content-between mt-3'>
                    <Col lg={6}>
                        <TitleAdmin Title={'مدیریت سریال ها  : '} />
                    </Col>
                    <Col lg={6}>
                        <input onChange={(e) => SetSearch(e.target.value)} className='form-control me-4 mt-3' placeholder='سریال مورد نظر ...' />
                    </Col>
                </Row>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>حذف سریال</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>آیا میخواهید این سریال را حذف کنید؟</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>خیر</Button>
                        <Button variant="danger" onClick={Remover}>بله، حذف شود</Button>
                    </Modal.Footer>
                </Modal>

                <Container>
                    <div className='row pe-3 ps-3 justify-content-between'>
                        {result && result.length > 0 ? (
                            [...result].reverse().map((series) => {
                                const posterUrl = series.poster
                                    ? `http://localhost:3001/uploads/${series.poster}`
                                    : '';
                                const title = series.title || series.name || 'بدون عنوان';
                                const id = series._id || series.id;
                                return (
                                    <Col key={id} lg={3} sm={6} md={3} xs={6} className='movie_data' style={{ width: '22%', marginTop: '25px', backgroundImage: `url(${posterUrl})` }}>
                                        <div className='info_onMovie'>
                                            <h4>{title}</h4>
                                        </div>
                                        <div className='Setting_Footer'>
                                            <br />
                                            <Row>
                                                <Col style={{ marginTop: '-12px' }}>
                                                    <Link to={id}>
                                                        <AiOutlineEdit style={{ color: 'green', fontSize: '22px' }} />
                                                    </Link>
                                                    <BsTrash3 onClick={() => DeleteSeries(id)} style={{ color: 'red', fontSize: '22px' }} />
                                                </Col>
                                                <Col style={{ marginTop: '-12px' }}>
                                                    {series.createdAt ? new Date(series.createdAt).toLocaleDateString('fa-IR') : 'نامشخص'}
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                );
                            })
                        ) : (
                            <Col xs={12} className="text-center mt-5">
                                <p style={{ color: '#aaa' }}>هیچ سریالی یافت نشد</p>
                            </Col>
                        )}
                    </div>
                </Container>
            </div>
        </Container>
    );
}
