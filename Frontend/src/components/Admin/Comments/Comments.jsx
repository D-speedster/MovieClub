import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import './Comments.css';
import ApiRequest from '../../../Services/Axios/config';
import Title_Admin from '../TitleAdmin/TitleAdmin';

export default function Comments() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        ApiRequest.get('/comments')
            .then(res => {
                const data = res.data;
                if (Array.isArray(data)) {
                    setComments(data);
                } else if (data && typeof data === 'object') {
                    setComments(Object.values(data));
                } else {
                    setComments([]);
                }
            })
            .catch(() => {
                setError('خطا در دریافت کامنت‌ها یا این قابلیت هنوز پیاده‌سازی نشده');
                setComments([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <Container>
                <Row className='d-flex justify-content-between mt-3'>
                    <Title_Admin Title={'مدیریت کامنت‌ها :'} />
                </Row>

                {loading && <p className="text-center mt-4">در حال بارگذاری...</p>}

                {error && (
                    <div className="alert alert-warning mt-4 text-center">
                        {error}
                    </div>
                )}

                {!loading && !error && comments.length === 0 && (
                    <p className="text-center mt-4 text-muted">هیچ کامنتی وجود ندارد</p>
                )}

                {!loading && comments.length > 0 && (
                    <Table responsive className='mt-3'>
                        <thead>
                            <tr>
                                <th>نویسنده</th>
                                <th>نظر</th>
                                <th>تاریخ</th>
                                <th>پست</th>
                                <th>وضعیت</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.map((comment, index) => (
                                <tr key={comment._id || index}>
                                    <td>{comment.member}</td>
                                    <td>{comment.comment}</td>
                                    <td>{comment.data}</td>
                                    <td>
                                        <a href={`/movie/${comment.idMovie}`}>مشاهده پست</a>
                                    </td>
                                    <td>مشخص نشده</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Container>
        </div>
    );
}
