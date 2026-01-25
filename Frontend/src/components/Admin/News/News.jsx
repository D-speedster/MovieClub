import React from 'react'
import Title_Admin from '../TitleAdmin/TitleAdmin'
import axios from "axios";
import { Button } from 'react-bootstrap'
import Logger from '../../../utils/logger';
export default function News() {
  let GetSession = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    axios.get('https://bsecurity.ir/session.php', requestOptions)
      .then(response => {
        Logger.log(response.data);
      })
      .catch(error => {
        Logger.error(error);
      });

  }
  return (
    <div>
      <Title_Admin Title={'افزودن خبر جدید : '}></Title_Admin>
      <Button onClick={GetSession}>تست بازی</Button>
    </div>
  )
}
