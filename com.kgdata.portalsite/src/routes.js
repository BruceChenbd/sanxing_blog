import React from 'react'
import {HashRouter, Route, Switch} from 'react-router-dom';
import loadable from './utils/loadable';
const createHistory = require('history').createBrowserHistory;
const Admin = loadable(() => import('./work/container/index'));
const Login = loadable(() => import('./work/page/loginAndRegist/index'));
const Dashboard = loadable(() => import('../src/work/page/dashBoard/index'));
const ProductIndex = loadable(() => import('../src/work/page/Product/index'));
const AddProduct = loadable(() => import('../src/work/page/Product/addProduct'));
const ResolveIndex = loadable(() => import('../src/work/page/Resolve/index'));
const AddResolve = loadable(() => import('../src/work/page/Resolve/addResolve'));
const KnowledegIndex = loadable(() => import('../src/work/page/Knowledge/index'));
const AddKnowledeg = loadable(() => import('../src/work/page/Knowledge/addKnowledge'));
const JobIndex = loadable(() => import('../src/work/page/Job/index'));
const AddJob = loadable(() => import('../src/work/page/Job/addJob'));
const GuestIndex = loadable(() => import('../src/work/page/Guest/index'));
const DemoVideo = loadable(() => import('../src/work/page/DemoVideo/index'));
const addIframe = loadable(() => import('../src/work/page/DemoVideo/addIframe'));
const NewsIndex = loadable(()=> import ('../src/work/page/News/index'));
const AddNews = loadable(() => import('../src/work/page/News/addNews'));

const history = createHistory();
export default class Router extends React.Component{
    render () {
       return (
           <HashRouter history={history}>
                   <Switch>
                       <Route path="/" exact component={Login}></Route>
                       <Admin>
                            <Switch>
                                <Route path="/Dashboard" component={Dashboard} ></Route>
                                <Route path="/DemoVideo" component={DemoVideo}></Route>
                                <Route path="/DemoVideo-add" component={addIframe}></Route>
                                <Route path="/DemoVideo-edit/:id" component={addIframe}></Route>
                                <Route path="/ProductIndex" component={ProductIndex}></Route>
                                <Route path="/ProductIndex-add" component={AddProduct}></Route>
                                <Route path="/ProductIndex-edit/:id" component={AddProduct}></Route>
                                <Route path="/ResolveIndex" component={ResolveIndex}></Route>
                                <Route path="/ResolveIndex-add" component={AddResolve}></Route>
                                <Route path="/ResolveIndex-edit" component={AddResolve}></Route>
                                <Route path="/NewsIndex" component={NewsIndex}></Route>
                                <Route path="/NewsIndex-add" component={AddNews}></Route>
                                <Route path="/NewsIndex-edit" component={AddNews}></Route>
                                <Route path="/KnowledgeIndex" component={KnowledegIndex}></Route>
                                <Route path="/KnowledgeIndex-add" component={AddKnowledeg}></Route>
                                <Route path="/KnowledgeIndex-edit" component={AddKnowledeg}></Route>
                                <Route path="/JobIndex" component={JobIndex}></Route>
                                <Route path="/JobIndex-add" component={AddJob}></Route>
                                <Route path="/JobIndex-edit" component={AddJob}></Route>
                                <Route path="/GuestIndex" component={GuestIndex}></Route>
                            </Switch>
                       </Admin>
                   </Switch>
           </HashRouter>
       )
    }
}