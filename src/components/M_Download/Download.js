import React from 'react'
import Header from '../Home/Header/Header';
import Movie from './Movie/Movie';
import InfoMovie from './InfoMovie/InfoMovie';
import BoxDownload from './BoxDownload/BoxDownload';
import Suggestion from './Suggestion/Suggestion';
import Comment from './/Comment/Comment';
import Footer from '../Home/Footer/Footer';
export default function Download() {
    return (
        <div>

            <Header />
            <Movie></Movie>
            <InfoMovie><BoxDownload></BoxDownload><Suggestion></Suggestion><Comment /></InfoMovie>
            <Footer></Footer>

        </div>
    )
}
