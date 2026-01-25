import React, { useState, useEffect, useRef, useId, useLayoutEffect } from 'react'
import { Container } from 'react-bootstrap';
import BoxInfo from '../BoxInfo';
import './AddMovie.css'
import { Genre_List } from '../Utils/Variables';
import { Convertor } from '../Utils/Functions';
import UseUpdateLogger from '../../../Hooks/UseUpdateLogger';
import axios from 'axios';
import ApiRequest from '../../../Services/Axios/config';
import Title_Admin from '../TitleAdmin/TitleAdmin';
import { Box_Info } from '../../../Contexs/Contex_BoxInfo';
import {Profiler} from 'react'
import LoadingSpinner from '../../../components/Loading/LoadingSpinner';
import Logger from '../../../utils/logger';
import { handleApiError, showErrorToUser } from '../../../utils/errorHandler';
import { validateImdbId, sanitizeInput } from '../../../utils/validation';

export default function AddMovie() {
    let [box, setBox] = useState('');
    let [Movie, SetMovie] = useState([]);
    let [GenreSelect, SetGenreSelect] = useState('')
    let [IDKey, SetIDKey] = useState('');
    let [EditImages, SetEditImages] = useState('');
    let [status, Setstatus] = useState(false);
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState(null);
    let [IsMovie, SetIsMovie] = useState([]);

    // استفاده از environment variable برای API key
    const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;
    function Convertor(genres) {
        const genresArr = genres.split(", ");
        const translatedGenres = genresArr.map((genre) => {
            const backs = Genre_List.filter((back) => {
                return back.en === genre;
            });
            return backs[0].fa;
        });
        return translatedGenres

    }


    UseUpdateLogger(box);
    UseUpdateLogger(IDKey);
    UseUpdateLogger(EditImages)
    let SelectGenre = (event) => {
        SetGenreSelect(event.target.value)
    }

    useEffect(() => {
        const fetchMovieData = async () => {
            if (status === false) {
                Logger.log('Waiting for movie ID...');
                return;
            }

            try {
                setLoading(true);
                setError(null);

                if (!OMDB_API_KEY) {
                    throw new Error('OMDB API key is not configured');
                }

                const response = await axios.get(`https://www.omdbapi.com/?i=${box}&plot=full&apikey=${OMDB_API_KEY}`);
                
                if (response.data.Error) {
                    throw new Error(response.data.Error);
                }

                let Genre_Moviez = Convertor(response.data['Genre']);

                let newMovie2 = InfoFunction(
                    response.data['Title'], 
                    response.data['Year'],
                    Genre_Moviez, 
                    response.data['imdbRating'], 
                    response.data['Poster'],
                    response.data['Runtime'], 
                    response.data['Plot'], 
                    response.data['Awards'],
                    response.data['Director'], 
                    response.data['Actors'], 
                    response.data['Country'], 
                    response.data['Writer'], 
                    response.data['similars']
                );

                SetMovie(newMovie2);
                Logger.log("Movie data fetched successfully");
            } catch (err) {
                const handledError = handleApiError(err, 'OMDB API');
                setError(handledError.message);
                Logger.error('Error fetching movie data:', handledError);
                showErrorToUser(handledError);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieData();
    }, [IsMovie, status, box, OMDB_API_KEY]);

    function InfoFunction(title, year, genres, imDbRating, image, runtimeMins, plot, awards, directors, stars, countries, writers, similars) {
        const newMovie = {
            id: sanitizeInput(box),
            name: sanitizeInput(title),
            year: sanitizeInput(year),
            genre: genres,
            rate: sanitizeInput(imDbRating),
            poster: sanitizeInput(image),
            time: sanitizeInput(runtimeMins),
            story: sanitizeInput(plot),
            awards: sanitizeInput(awards),
            director: sanitizeInput(directors),
            stars: sanitizeInput(stars),
            countries: sanitizeInput(countries),
            writers: sanitizeInput(writers),
            CreatedAt: new Date().toISOString().slice(0, 10),
            similars: similars,
            idUniq: Date.now().toString() // استفاده از timestamp به جای متغیر خالی
        };
        return newMovie
    }

    useEffect(() => {
        // IsMovie ?
        //     alert("در دیتابیس موجوده")
        //     :
        //     fetch(`https://imdb-api.com/fa/API/Title/k_709yvj7w/${box}`).then(res => (
        //         res.json()
        //     )).then(data => {
        //         let newMovie2 = InfoFunction(data['title'], data['year'],
        //             data['genres'], data['imDbRating'], data['image'],
        //             data['runtimeMins'], data['plotLocal'], data['awards'],
        //             data['directors'], data['stars'], data['countries'],
        //         )

        //         SetMovie(newMovie2);
        //         console.log("END PROCESS GET", Movie);
        //         Setstatus(true)
        //     })
        // console.log(IsMovie)
    })
    let ADD_Handler = async (event) => {
        event.preventDefault();
        
        const sanitizedBox = sanitizeInput(box.trim());
        
        if (!sanitizedBox) {
            setError("لطفا آیدی فیلم مورد نظر را وارد کنید");
            return;
        }

        if (!validateImdbId(sanitizedBox)) {
            setError("فرمت آیدی IMDB صحیح نیست. مثال: tt1234567");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            Logger.log("Starting movie fetch process");
            
            const response = await ApiRequest.get('/Moviez');
            let isAre = Object.entries(response.data).filter((i) => {
                return i['1'].id === sanitizedBox;
            });
            
            if (isAre.length === 0) {
                SetIsMovie(true);
                Setstatus(true);
            } else {
                SetIsMovie(false);
                setError("این فیلم قبلاً در دیتابیس موجود است");
            }
        } catch (err) {
            const handledError = handleApiError(err, 'Check Movie Existence');
            setError(handledError.message);
            Logger.error('Error checking movie existence:', handledError);
        } finally {
            setLoading(false);
        }
    };
    let Change_Handler = (event) => {
        const value = sanitizeInput(event.target.value);
        setBox(value);
        // پاک کردن خطا هنگام تغییر input
        if (error) {
            setError(null);
        }
    }

    return (
        <Box_Info.Provider value={{
            movieData: Movie,
            setMovieData: SetMovie,
            isLoading: loading,
            setIsLoading: setLoading
        }}>
            <div className='ADD_MOVIE'>
                <Title_Admin Title={'افزودن فیلم جدید'}></Title_Admin>
                <Container fluid>
                    <div className='IMDB pe-4 ps-4'>
                        <div className='IMDB_HEADER'>
                            <h5 className='IMDB_HEADER_TEXT'>دریافت اطلاعات فیلم از سایت IMDB</h5>
                        </div>
                        <div className='IMDB_ID'>
                            <input 
                                className='form-control' 
                                onChange={Change_Handler} 
                                type='text'
                                value={box}
                                placeholder='آِیدی IMDB فیلم مورد نظر را وارد کنید (مثال: tt1234567)' 
                                disabled={loading}
                            />
                            <button 
                                className='btn btn-primary' 
                                onClick={ADD_Handler}
                                disabled={loading || !box.trim()}
                            >
                                {loading ? 'در حال پردازش...' : 'دریافت اطلاعات'}
                            </button>
                        </div>
                        
                        {error && (
                            <div className="alert alert-danger mt-3" role="alert">
                                {error}
                            </div>
                        )}
                        
                        {loading && (
                            <div className="mt-3">
                                <LoadingSpinner size="medium" message="در حال دریافت اطلاعات فیلم..." />
                            </div>
                        )}
                        
                        <hr></hr>
                        {
                            status && !loading && !error ? (
                                <BoxInfo {...Movie} />
                            ) : (
                                null
                            )
                        }
                    </div>
                </Container>
            </div>
        </Box_Info.Provider>
    )
}
