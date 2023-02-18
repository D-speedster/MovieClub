import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header/Header'
import Latest_Trailers from './Latest_Trailers/Latest_Trailers'
import SliderMovie from './SliderMovie/SliderMovie'
import './Home.css';
import Footer from './Footer/Footer'

import Boxoffice from './Boxofiice/Boxoffice'
import { Container } from 'react-bootstrap'

export default function Home() {
  let [MoviesData, SetMovie] = useState(
    [
      { id: 1, namePer: 'پسر', nameEn: 'The Son', realase: '2022', poster: '/img/The Son_.jpg', rate: '', story: 'روایت فردی به نام پیتر که وقتی همسر سابقش کیت با پسر نوجوانشان، نیکلاس روبرو می شود، وی به عنوان زندگی پرمشغله خود با شریک زندگی جدید اما و کودکشان در هم آمیخته می شود.' },
      { id: 2, namePer: 'بابل', nameEn: 'Babylon', realase: '2022', poster: '/img/babylon.jpg', rate: '7.6', story: 'این فیلم داستان یک بازیگر جوان به نام «منی تورس» را روایت می کند که در دهه 1920 در هالیوود به دنبال شغل است و کارش را به عنوان دستیار شروع می کند' },
      { id: 3, namePer: '', nameEn: 'M3GAN', realase: '2022', poster: '/img/m3gan.jpg', rate: '6.6', story: 'یک مهندس رباتیک که در یک کمپانی اسباب بازی سازی کار می کند عروسکی انسان نما را می سازد که این عروسک کم کم شروع به پیدا کردن شخصیت می کند      ' },
      { id: 4, namePer: 'آلوده', nameEn: 'Infiesto ', realase: '2023', poster: '/img/infiesto-2943376.webp', rate: '5.6', story: 'به دو کارآگاه مأموریتی محول می‌شود تا به شهری کوچک معدن‌دار در کوه‌های آستوریاس بروند. چرا که زنی که چندین ماه مُرده بوده ناگهان زنده ظاهر می‌شود و حالا باید پی ببرند چه نیروهای تاریک و مرموزی در این کار دست داشته‌اند.' },
      { id: 5, namePer: 'در نیمه شب', nameEn: 'At Midnight ', realase: '2023', poster: '/img/At Midnight.jpg', rate: '5.6', story: 'روایتی عاشقانه و طنز از یک دختر و پسر که با خود تصمیم گرفته‌اند عاشق نشوند.      ' },
      { id: 6, namePer: 'پلنگ سیاه : واکاندا برای همیشه', nameEn: 'Black Panther: Wakanda Forever', realase: '2022', poster: '/img/wakanda_forever.jpg', rate: '7.2', story: 'در این فیلم رهبران پادشاهی واکاندا تلاش می کنند تا بعد از مرگ پادشاه تیچالا از ملت خود در برابر نیروهای متجاوز محافظت کنند.' },

    ]
  )
  let [MoviesData2, SetMovie2] = useState(
    [
      { id: 1, namePer: 'انتقام جویان : عصر التران', nameEn: 'Avengers: Age of Ultron', realase: '2015', poster: '/img/poster4.png', rate: '8.4' },
      { id: 2, namePer: 'انتفام جویان', nameEn: 'The Avengers', realase: '2012', poster: '/img/poster3.png', rate: '8' },
      { id: 3, namePer: 'انتفام جویان : جنگ بینهایت', nameEn: 'Avenger Infinity War', realase: '2019', poster: '/img/poster2.png', rate: '8.5' },
      { id: 4, namePer: 'مرذ آهنی', nameEn: 'Iron Man', realase: '2008', poster: '/img/poster5.png', rate: '7.6' },
      { id: 5, namePer: 'سپیادرمن : راهی به خانه نیست', nameEn: 'Spider-Man: No Way Home ', realase: '2021', poster: '/img/poster7.jpg', rate: '8.0' },
      { id: 6, namePer: 'کاپیتان مارول', nameEn: 'Captain Marvel ', realase: '2019', poster: '/img/poster6.png', rate: '7.7' },

    ])
  let [BoxOffice, SetBoxOffice] = useState();
  let [BoxOffice2, SetBoxOffice2] = useState();


  useEffect(() => {
    fetch('http://localhost:3000/MOVIEBOX').then(res => {
      return res.json()
    }).then(data => {

      SetBoxOffice(data[0])
    })
  }, [])
  // let Sender = () => {
  //   var requestOptions = {
  //     method: 'POST',
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(BoxOffice),
  //     redirect: 'follow'
  //   };
  //   fetch("http://localhost:3000/MOVIEBOX", requestOptions)
  //     .then(response => response.json())
  //     .then(result => console.log(result))
  //     .catch(error => console.log('error', error));
  //   console.log(BoxOffice2)
  // }

  return (
    <div className='body'>
      <Header />

      <SliderMovie {...MoviesData} Title={'جدیدترین ها '}></SliderMovie>

      <Latest_Trailers />

      <SliderMovie {...MoviesData2} Title={'برترین فیلم های تخیلی'}></SliderMovie>
      <Boxoffice {...BoxOffice}></Boxoffice>

      <Footer />
      {/* <Container>
        <button onClick={Sender} className='btn btn-danger btn-lg mt-5 mb-5'>Sended Data</button>
        <br />

      </Container> */}
    </div>
  )
}
