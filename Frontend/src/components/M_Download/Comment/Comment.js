import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Container } from 'react-bootstrap'
import './Comment.css'
import { BiLike } from 'react-icons/bi';
import { BiDislike } from 'react-icons/bi';
import { ImForward } from 'react-icons/im';
import ApiRequest from '../../../Services/Axios/config';
import LoadingSpinner from '../../Loading/LoadingSpinner';
import Logger from '../../../utils/logger';
import { handleApiError, showErrorToUser } from '../../../utils/errorHandler';
import { validateComment, validateEmail, sanitizeInput } from '../../../utils/validation';

export default function Comment(props) {
    let [LoadComment, SetComments] = useState('');
    let [comment, Setcomment] = useState('');
    let [nameMember, SetnameMember] = useState('');
    let [EmailComment, SetnEmailComment] = useState('');
    let [selectedAvatar, setSelectedAvatar] = useState(null);
    let [likes, setLikes] = useState({});
    let [dislikes, setDislikes] = useState({});
    let [loading, setLoading] = useState(true);
    let [submitting, setSubmitting] = useState(false);
    let [error, setError] = useState(null);
    let [validationErrors, setValidationErrors] = useState({});
    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await ApiRequest.get('/Comments');
                const matchingData = Object.values(response.data).filter(i => i.idMovie === props.id);
                SetComments(matchingData);
                Logger.log('Comments loaded successfully:', matchingData.length, 'comments');
            } catch (err) {
                const handledError = handleApiError(err, 'Comments API');
                setError(handledError.message);
                Logger.error('Error fetching comments:', handledError);
            } finally {
                setLoading(false);
            }
        };

        if (props.id) {
            fetchComments();
        }
    }, [props.id]);

    const CommentHandlr = async () => {
        // Validation
        const errors = {};
        
        const commentValidation = validateComment(comment);
        if (!commentValidation.isValid) {
            if (commentValidation.errors.empty) {
                errors.comment = 'لطفا نظر خود را وارد کنید';
            } else if (commentValidation.errors.tooLong) {
                errors.comment = 'نظر شما بیش از حد طولانی است (حداکثر 500 کاراکتر)';
            }
        }

        const sanitizedName = sanitizeInput(nameMember.trim());
        if (!sanitizedName) {
            errors.name = 'لطفا نام خود را وارد کنید';
        } else if (sanitizedName.length < 2) {
            errors.name = 'نام باید حداقل 2 کاراکتر باشد';
        }

        if (!validateEmail(EmailComment.trim())) {
            errors.email = 'لطفا ایمیل معتبر وارد کنید';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            setSubmitting(true);
            setValidationErrors({});
            
            let obj = {
                idMovie: props.id,
                member: sanitizedName,
                email: sanitizeInput(EmailComment.trim()),
                data: new Date().toISOString().slice(0, 10),
                comment: commentValidation.sanitized,
                avatar: selectedAvatar || Avatars[0].src,
                likes: 0,
                dislikes: 0
            };

            await ApiRequest.post('/Comments', obj);
            
            // Reset form
            Setcomment('');
            SetnameMember('');
            SetnEmailComment('');
            setSelectedAvatar(null);
            
            // Refresh comments
            const response = await ApiRequest.get('/Comments');
            const matchingData = Object.values(response.data).filter(i => i.idMovie === props.id);
            SetComments(matchingData);
            
            Logger.log('Comment posted successfully');
            // می‌توانید از toast notification استفاده کنید
            alert('نظر شما با موفقیت ثبت شد');
            
        } catch (err) {
            const handledError = handleApiError(err, 'Post Comment');
            Logger.error('Error posting comment:', handledError);
            showErrorToUser(handledError);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = (commentId) => {
        setLikes(prev => ({
            ...prev,
            [commentId]: (prev[commentId] || 0) + 1
        }));
    }

    const handleDislike = (commentId) => {
        setDislikes(prev => ({
            ...prev,
            [commentId]: (prev[commentId] || 0) + 1
        }));
    }

    const handleAvatarSelect = (avatarSrc) => {
        setSelectedAvatar(avatarSrc);
    }
    const CommentText = (event) => {
        const value = event.target.value;
        Setcomment(value);
        // پاک کردن خطای validation
        if (validationErrors.comment) {
            setValidationErrors(prev => ({ ...prev, comment: null }));
        }
    }
    
    const NameHandler = (event) => {
        const value = sanitizeInput(event.target.value);
        SetnameMember(value);
        if (validationErrors.name) {
            setValidationErrors(prev => ({ ...prev, name: null }));
        }
    }
    
    const EmailCommentFun = (event) => {
        const value = sanitizeInput(event.target.value);
        SetnEmailComment(value);
        if (validationErrors.email) {
            setValidationErrors(prev => ({ ...prev, email: null }));
        }
    }
    let [Avatars, SetAvatars] = useState([
        { name: 'Boy1', src: '/img/avatar/boy_2.png' },
        { name: 'Boy2', src: '/img/avatar/boy_3.png' },
        { name: 'Boy3', src: '/img/avatar/boy_4.png' },
        { name: 'Girl1', src: '/img/avatar/girl_3.jpg' },
        { name: 'Girl2', src: '/img/avatar/girl_2.png' },
        { name: 'Girl3', src: '/img/avatar/girl_1.jpg' }
    ])
    return (
        <div className='section_Comment mt-5' style={{ color: 'white' }}>
            <Container>
                <Row>
                    <Col lg={4} md={4} xs={12} sm={12} className="Info_Comment me-lg-3 me-md-3">
                        <h6>Send a Comment</h6>
                        <textarea 
                            onChange={CommentText} 
                            value={comment}
                            className={`form-control ${validationErrors.comment ? 'is-invalid' : ''}`}
                            placeholder='نظر شما'
                            maxLength="500"
                            disabled={submitting}
                        ></textarea>
                        {validationErrors.comment && (
                            <div className="invalid-feedback">{validationErrors.comment}</div>
                        )}
                        <small className="text-muted">{comment.length}/500 کاراکتر</small>
                        <br />
                        <label>Name</label>
                        <input 
                            onChange={NameHandler} 
                            value={nameMember}
                            placeholder='نام' 
                            className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                            disabled={submitting}
                        />
                        {validationErrors.name && (
                            <div className="invalid-feedback">{validationErrors.name}</div>
                        )}
                        <br />
                        <label>Email</label>
                        <input 
                            onChange={EmailCommentFun} 
                            value={EmailComment}
                            placeholder='ایمیل ...' 
                            type="email"
                            className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                            disabled={submitting}
                        />
                        {validationErrors.email && (
                            <div className="invalid-feedback">{validationErrors.email}</div>
                        )}
                        <hr />
                        <Row>
                            {Avatars.map((item, index) => {
                                return (
                                    <Col lg={4} xs={2} sm={2} key={index}>
                                        <img 
                                            src={item.src} 
                                            alt={`آواتار ${item.name}`}
                                            onClick={() => handleAvatarSelect(item.src)}
                                            style={{
                                                cursor: 'pointer',
                                                border: selectedAvatar === item.src ? '3px solid #17a2b8' : 'none',
                                                borderRadius: '50%',
                                                transition: 'all 0.3s'
                                            }}
                                        />
                                    </Col>
                                )
                            })}
                        </Row>

                        <br />
                        <button 
                            onClick={CommentHandlr} 
                            className='btn btn-info'
                            disabled={submitting || !comment.trim() || !nameMember.trim() || !EmailComment.trim()}
                        >
                            {submitting ? 'در حال ارسال...' : 'انتشار کامنت'}
                        </button>

                    </Col>
                    <Col lg={7} md={8} xs={12} sm={12} className="Comments mx-lg-3 mx-md-3">
                        {loading ? (
                            <LoadingSpinner size="medium" message="در حال بارگذاری نظرات..." />
                        ) : error ? (
                            <div className="alert alert-danger">
                                خطا در بارگذاری نظرات: {error}
                            </div>
                        ) : (
                            <>
                                <br /><br /><br />
                                {Object.values(LoadComment).length === 0 ? (
                                    <div className="text-center text-muted">
                                        <p>هنوز نظری ثبت نشده است. اولین نفر باشید!</p>
                                    </div>
                                ) : (
                                    Object.values(LoadComment).map((b, index) => (
                                        <Card key={index} className='mb-3'>
                                            <Card.Header>
                                                <div className='d-flex justify-content-between'>
                                                    <div className='d-flex'>
                                                        <img 
                                                            width='60px' 
                                                            height='60px' 
                                                            src={b.avatar || Avatars[2].src} 
                                                            alt={`آواتار ${b.member}`}
                                                            style={{ borderRadius: '50%' }}
                                                        />
                                                        <span className='mt-3 me-2' style={{ fontSize: '19px' }}>
                                                            {sanitizeInput(b.member)}
                                                        </span>
                                                    </div>

                                                    <div className='d-flex mt-3 '>
                                                        <div className='me-2'>
                                                            <button 
                                                                onClick={() => handleLike(index)}
                                                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                                                aria-label="لایک"
                                                            >
                                                                <BiLike style={{ color: 'green', fontSize: '24px' }} />
                                                                <span style={{ fontSize: '14px', marginLeft: '5px' }}>
                                                                    {(b.likes || 0) + (likes[index] || 0)}
                                                                </span>
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDislike(index)}
                                                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                                                aria-label="دیسلایک"
                                                            >
                                                                <BiDislike style={{ color: 'red', fontSize: '24px' }} />
                                                                <span style={{ fontSize: '14px', marginLeft: '5px' }}>
                                                                    {(b.dislikes || 0) + (dislikes[index] || 0)}
                                                                </span>
                                                            </button>
                                                        </div>
                                                        <span>{b.data}</span>
                                                    </div>
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <p>{sanitizeInput(b.comment)}</p>
                                                <button 
                                                    style={{ 
                                                        background: 'none', 
                                                        border: 'none', 
                                                        color: '#17a2b8', 
                                                        cursor: 'pointer' 
                                                    }}
                                                    aria-label="پاسخ به نظر"
                                                >
                                                    <ImForward /><span> پاسخ</span>
                                                </button>
                                            </Card.Body>
                                        </Card>
                                    ))
                                )}
                            </>
                        )}
                    </Col>
                </Row>
            </Container>

        </div>
    )
}
