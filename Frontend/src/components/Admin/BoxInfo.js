import { useEffect, useState, useContext, memo } from 'react'
import { Container, Col, Row, Form, Table } from 'react-bootstrap';
import './BoxInfo.css';
import Swal from 'sweetalert2'
import { Box_Info } from '../../Contexs/Contex_BoxInfo'
import ApiRequest from '../../Services/Axios/config';
import Logger from '../../utils/logger';

const BoxInfo = memo(function BoxInfo(props) {
    const [Images_Movie, SetImages] = useState([]);
    let [Image_Moviez, SetImageMoviez] = useState([]);
    // let [TranslateText, SetTranslate] = useState('داستانی مشخص نشده است .')
    let [BackgroundImage, SetBackground] = useState('لینک مورد نظر را وارد کنید');
    let [downloadLinks, setDownloadLinks] = useState({
        '1080p': { dubbed: '', subtitle: '', audio: '' },
        '720p': { dubbed: '', subtitle: '', audio: '' },
        '480p': { dubbed: '', subtitle: '', audio: '' }
    });
    let shows = useContext(Box_Info);

    const BackSetter = (event) => {
        SetBackground(event.target.value)
    }

    const handleDownloadLinkChange = (quality, type, value) => {
        setDownloadLinks(prev => ({
            ...prev,
            [quality]: {
                ...prev[quality],
                [type]: value
            }
        }));
    }
    // const TranslatePlot = async (Plot) => {
    //     const TRANSLATE_API_TOKEN = process.env.REACT_APP_TRANSLATE_API_TOKEN;

    //     if (!TRANSLATE_API_TOKEN) {
    //         Logger.error('Translation API Token is not configured');
    //         SetTranslate('خطا: توکن ترجمه تنظیم نشده است');
    //         return;
    //     }

    //     if (!Plot || Plot.trim() === '') {
    //         SetTranslate('متن برای ترجمه موجود نیست');
    //         return;
    //     }

    //     try {
    //         const response = await fetch(`https://one-api.ir/translate/?token=${TRANSLATE_API_TOKEN}&action=google&lang=fa&q=${encodeURIComponent(Plot)}`);

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }

    //         const data = await response.json();

    //         if (data.result) {
    //             SetTranslate(data.result);
    //         } else {
    //             throw new Error('Translation result not found');
    //         }
    //     } catch (error) {
    //         Logger.error('Translation error:', error);
    //         SetTranslate('خطا در ترجمه. لطفاً دوباره تلاش کنید.');
    //     }
    // }
    function SubmitHandler() {
        console.log('Ok i get first request')
    }
    function ImgHandlerClick(event) {
        event.target.classList.toggle("IsSelectImg");
        const imgSrc = event.target.src;

        // Check if image is already selected
        const isSelected = Image_Moviez.includes(imgSrc);

        if (isSelected) {
            // Remove from selection
            SetImageMoviez(prevState => prevState.filter(img => img !== imgSrc));
        } else {
            // Add to selection
            SetImageMoviez(prevState => [...prevState, imgSrc]);
        }
    }
    function ImageGetter() {
        const TMDB_BEARER_TOKEN = process.env.REACT_APP_TMDB_BEARER_TOKEN;

        if (!TMDB_BEARER_TOKEN) {
            Logger.error('TMDB Bearer Token is not configured');
            return;
        }

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${TMDB_BEARER_TOKEN}`
            }
        };

        fetch(`https://api.themoviedb.org/3/movie/${props.id}/images`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(response => SetImages(response['backdrops']))
            .catch(err => {
                Logger.error('Error fetching images:', err);
                alert('خطا در دریافت تصاویر. لطفاً دوباره تلاش کنید.');
            });
    }


    useEffect(() => {
        let IMGSR = Images_Movie.filter(res => {
            return res['vote_average'] > 5.32
        })
        let FinIMSRC = IMGSR.map((img) => {
            return "https://image.tmdb.org/t/p/w500" + img.file_path

        })
        SetImageMoviez(FinIMSRC)

    }, [Images_Movie])



    return (
        <Row className='mb-5 boox-insert'>
            <div>
                <Container>
                    <Row className='mt-2'>
                        {/* <h1>{shows}</h1> */}

                        <form method='post' action='http://localhost:3001/content/new-content'>
                            <Col lg={9} className='justify-content-center'>
                                <Row className='mb-3'>
                                    <Form.Group as={Col} lg={2} controlId='formName'>
                                        <Form.Label>نام فیلم</Form.Label>
                                    </Form.Group>
                                    <Col lg={10}>
                                        <Form.Control name='title' type='text' placeholder='نام فیلم' />
                                    </Col>
                                </Row>
                                <Row className='mb-3 d-none'>
                                    <Form.Group as={Col} lg={2} controlId='formName'>
                                        <Form.Label>نام فیلم</Form.Label>
                                    </Form.Group>
                                    <Col lg={10}>
                                        <Form.Control name='type' type='text' placeholder='نام فیلم' value='movie' />
                                    </Col>
                                </Row>
                                <Row className='mb-3'>
                                    <Form.Group as={Col} lg={2} controlId='formYear'>
                                        <Form.Label>سال انتشار</Form.Label>
                                    </Form.Group>
                                    <Col lg={10}>
                                        <Form.Control name='year' type='text' placeholder='سال انتشار' />
                                    </Col>
                                </Row>
                                <Row className='mb-3'>
                                    <Form.Group as={Col} lg={2} controlId='formStars'>
                                        <Form.Label>بازیگران</Form.Label>
                                    </Form.Group>
                                    <Col lg={10}>
                                        <Form.Control name='actors' type='text' placeholder='بازیگران' />
                                    </Col>
                                </Row>
                                <Row className='mb-3'>
                                    <Form.Group as={Col} lg={2} controlId='formDirector'>
                                        <Form.Label>کارگردان</Form.Label>
                                    </Form.Group>
                                    <Col lg={10}>
                                        <Form.Control name='director' type='text' placeholder='کارگردان' />
                                    </Col>
                                </Row>
                                <Row className='mb-3'>
                                    <Form.Group as={Col} lg={2} controlId='formCountries'>
                                        <Form.Label>کشور</Form.Label>
                                    </Form.Group>
                                    <Col lg={10}>
                                        <Form.Control name='countries' type='text' placeholder='کشور' />
                                    </Col>
                                </Row>
                                <Row className='mb-3'>
                                    <Form.Group as={Col} lg={2} controlId='formWriters'>
                                        <Form.Label>نویسنده</Form.Label>
                                    </Form.Group>
                                    <Col lg={10}>
                                        <Form.Control name='writer' type='text' placeholder='نویسنده' />
                                    </Col>
                                </Row>
                                <Row className='mb-3'>
                                    <Form.Group as={Col} lg={2} controlId='formWriters'>
                                        <Form.Label>ژانر</Form.Label>
                                    </Form.Group>
                                    <Col lg={10}>
                                        <Form.Control name='genres' type='text' placeholder='نویسنده' />
                                    </Col>
                                </Row>
                                <Row className='mb-3'>
                                    <Form.Group as={Col} lg={2} controlId='formWriters'>
                                        <Form.Label>امتیاز</Form.Label>
                                    </Form.Group>
                                    <Col lg={10}>
                                        <Form.Control name='rate' type='text' placeholder='نویسنده' />
                                    </Col>
                                </Row>
                                <Row className='mb-3'>
                                    <Form.Group as={Col} lg={2} controlId='formWriters'>
                                        <Form.Label>مدت زمان</Form.Label>
                                    </Form.Group>
                                    <Col lg={10}>
                                        <Form.Control name='duration' type='text' placeholder='مدت زمان' value={props.time} />
                                    </Col>
                                </Row>
                                <Row className='mb-3'>
                                    <Form.Group as={Col} lg={2} controlId='formWriters'>
                                        <Form.Label>خلاصه داستان</Form.Label>
                                    </Form.Group>

                                    <Col lg={7}>
                                        <textarea name='description' style={{ resize: 'none' }} className='form-control mt-3' ></textarea>
                                    </Col>
                                    <Col lg={3}>
                                        {/* <button onClick={() => TranslatePlot(props.story)} className='btn btn-info mt-4 '>دریافت خلاصه داستان</button> */}

                                    </Col>
                                </Row>
                                <Row className='mb-3'>
                                    <Form.Group as={Col} lg={2} controlId='formWriters'>
                                        <Form.Label>بک گراند</Form.Label>
                                    </Form.Group>
                                    <Col lg={10}>
                                        <Form.Control onChange={BackSetter} type='text' placeholder='مدت زمان' />
                                    </Col>
                                </Row>

                                <Row className='mb-3 Bx_Dl mx-0'>
                                    <Col lg={2}>
                                        <input type='file' name='poster' />

                                    </Col>
                                    {/* <Col lg={10} className='list_Box'>
                                    <Table striped>
                                        <thead>
                                            <tr>
                                                <th>کیفیت</th>
                                                <th>دوبله فارسی</th>
                                                <th>زیرنویس فارسی</th>
                                                <th>صوت دوبله</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1080p</td>
                                                <td>
                                                    <input 
                                                        type='text' 
                                                        value={downloadLinks['1080p'].dubbed}
                                                        onChange={(e) => handleDownloadLinkChange('1080p', 'dubbed', e.target.value)}
                                                        placeholder="لینک دوبله"
                                                        aria-label="لینک دوبله 1080p"
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type='text' 
                                                        value={downloadLinks['1080p'].subtitle}
                                                        onChange={(e) => handleDownloadLinkChange('1080p', 'subtitle', e.target.value)}
                                                        placeholder="لینک زیرنویس"
                                                        aria-label="لینک زیرنویس 1080p"
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type='text' 
                                                        value={downloadLinks['1080p'].audio}
                                                        onChange={(e) => handleDownloadLinkChange('1080p', 'audio', e.target.value)}
                                                        placeholder="لینک صوت"
                                                        aria-label="لینک صوت 1080p"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>720p</td>
                                                <td>
                                                    <input 
                                                        type='text' 
                                                        value={downloadLinks['720p'].dubbed}
                                                        onChange={(e) => handleDownloadLinkChange('720p', 'dubbed', e.target.value)}
                                                        placeholder="لینک دوبله"
                                                        aria-label="لینک دوبله 720p"
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type='text' 
                                                        value={downloadLinks['720p'].subtitle}
                                                        onChange={(e) => handleDownloadLinkChange('720p', 'subtitle', e.target.value)}
                                                        placeholder="لینک زیرنویس"
                                                        aria-label="لینک زیرنویس 720p"
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type='text' 
                                                        value={downloadLinks['720p'].audio}
                                                        onChange={(e) => handleDownloadLinkChange('720p', 'audio', e.target.value)}
                                                        placeholder="لینک صوت"
                                                        aria-label="لینک صوت 720p"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>480p</td>
                                                <td>
                                                    <input 
                                                        type='text' 
                                                        value={downloadLinks['480p'].dubbed}
                                                        onChange={(e) => handleDownloadLinkChange('480p', 'dubbed', e.target.value)}
                                                        placeholder="لینک دوبله"
                                                        aria-label="لینک دوبله 480p"
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type='text' 
                                                        value={downloadLinks['480p'].subtitle}
                                                        onChange={(e) => handleDownloadLinkChange('480p', 'subtitle', e.target.value)}
                                                        placeholder="لینک زیرنویس"
                                                        aria-label="لینک زیرنویس 480p"
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type='text' 
                                                        value={downloadLinks['480p'].audio}
                                                        onChange={(e) => handleDownloadLinkChange('480p', 'audio', e.target.value)}
                                                        placeholder="لینک صوت"
                                                        aria-label="لینک صوت 480p"
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col> */}

                                </Row>
                                <Row className='mb-3'>
                                    <Form.Group as={Col} lg={2} controlId='formWriters'>
                                        <Form.Label></Form.Label>
                                    </Form.Group>
                                    {/* <Col lg={10}>
                                    <button onClick={ImageGetter} type="button" className="col-12 mt-3 btn-danger btn btn-primary">دریافت عکس </button>
                                </Col> */}
                                </Row>
                            </Col>
                            <button type='submit' onClick={SubmitHandler} className='btn btn-success mt-3 '>ذخیره و انتشار</button>
                        </form>

                        {/* <Col lg={3} className='mt-1'>
                            <img 
                                alt={`پوستر فیلم ${props.name || 'نامشخص'}`} 
                                style={{ borderRadius: '15px', height: '420px' }} 
                                src={props.poster} 
                                className='img-fluid' 
                            />
                        </Col> */}


                    </Row>



                </Container>

            </div>

        </Row>

    )
});

export default BoxInfo;
