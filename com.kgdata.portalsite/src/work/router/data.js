import React, {Fragment, Component, PureComponent} from 'react';
import loginAndRegist from '../page/loginAndRegist/index';
import sysIndex from '../page/sysIndex/index';
import history from '@components/public/history';
import {qus} from 'esn';

let get_token = () => qus('token');

export let url_data = [{
    name: 'loginAndRegist',
    url: '/',
    comp: loginAndRegist,
    auth: false,
    children: null
},{
    name: 'sysIndex',
    url: '/sysIndex',
    comp: sysIndex,
    auth: false,
    children: [
        {
            name: 'sysIndex',
            url: '/sysIndex',
            comp: null,
            auth: false,
            children: null
        }, {
            name: '首页',
            url: '/neiye_2',
            comp: null,
            auth: false,
            children: null
        }
    ]
}
];
