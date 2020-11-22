import Loadable from 'react-loadable';
import Loading from '../work/components/loading/index';
import React from 'react';

export default function withLoadable (comp) {
   return Loadable({
       loader: comp,
       loading: (props) => {
           return <Loading />
       },
       timeout: 10000
   })
}