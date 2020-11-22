import ReactDOM from 'react-dom';
import React from 'react';
import Router from './routes';
import "./index.scss"
import {configure} from 'mobx';
import {Provider} from 'mobx-react';
import UserStore from '@mobx/userStore';
import userPictureStore from '@mobx/userPicture';
import test from '@mobx/tests';
import locales from '@mobx/locales';
import {is_mock} from '@config';
const stores = {
    UserStore,test,locales,userPictureStore
};

if(is_mock){
    require("@mock")

}
// localStorage.setItem('sign','blue')
// if(localStorage.getItem('sign') == 'green' || localStorage.getItem('sign') == null) {
//     document.getElementsByTagName('body')[0].style.setProperty('--mainColor','#0C9C6E','important');
//     document.getElementsByTagName('body')[0].style.setProperty('--borderColor','#339900','important');
//     document.getElementsByTagName('body')[0].style.setProperty('--dialogBgColor','#003300', 'important');
//     document.getElementsByTagName('body')[0].style.setProperty('--headerBgColor','#002200','important');
//     document.getElementsByTagName('body')[0].style.setProperty('--menuBgColor','#001100','important');
//     document.getElementsByTagName('body')[0].style.setProperty('--tableBgColor','rgba(12,156,110,0.32)','important');
//     document.getElementsByTagName('body')[0].style.setProperty('--dialogHeadBgColor','rgb(26, 72, 26)', 'important');
// } else {
//     document.getElementsByTagName('body')[0].style.setProperty('--mainColor','#29CCB1','important');
//     document.getElementsByTagName('body')[0].style.setProperty('--borderColor','rgba(255,255,255,0.3)','important');
//     document.getElementsByTagName('body')[0].style.setProperty('--dialogBgColor','#262B49', 'important');
//     document.getElementsByTagName('body')[0].style.setProperty('--headerBgColor','#051535','important');
//     document.getElementsByTagName('body')[0].style.setProperty('--menuBgColor','#000A1E','important');
//     document.getElementsByTagName('body')[0].style.setProperty('--tableBgColor','#171C3B');
//     document.getElementsByTagName('body')[0].style.setProperty('--dialogHeadBgColor','#262B49', 'important');
// }
configure({'enforceActions': 'always'});

ReactDOM.render(
        <Provider {...stores}>
            <Router/>
        </Provider>,
    document.getElementById('root')
);
