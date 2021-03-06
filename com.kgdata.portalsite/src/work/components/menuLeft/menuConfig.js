// const menuList = [
//     {
//         title:'首页',
//         key:'/home',
//         type: 'appstore'
//     },
//     {
//         title:'UI',
//         key:'/ui',
//         type: 'highlight',
//         children:[
//             {
//                 title:'按钮',
//                 key:'/ui/buttons',
//             },
//             {
//                 title:'弹框',
//                 key:'/ui/modals',
//             },
//             {
//                 title:'Loading',
//                 key:'/ui/loadings',
//             },
//             {
//                 title:'通知提醒',
//                 key:'/ui/notification',
//             },
//             {
//                 title:'全局Message',
//                 key:'/ui/messages',
//             },
//             {
//                 title:'Tab页签',
//                 key:'/ui/tabs',
//             },
//             {
//                 title:'图片画廊',
//                 key:'/ui/gallery',
//             },
//             {
//                 title:'轮播图',
//                 key:'/ui/carousel',
//             }
//         ]
//     },
//     {
//         title:'表单',
//         key:'/form',
//         type:'form',
//         children:[
//             {
//                 title:'登录',
//                 key:'/form/login',
//             },
//             {
//                 title:'注册',
//                 key:'/form/reg',
//             }
//         ]
//     },
//     {
//         title:'表格',
//         key:'/table',
//         type:'table',
//         children:[
//             {
//                 title:'基础表格',
//                 key:'/table/basic',
//             },
//             {
//                 title:'高级表格',
//                 key:'/table/high',
//             }
//         ]
//     },
//     {
//         title:'富文本',
//         key:'/rich',
//         type:'edit'
//     },
//     {
//         title:'城市管理',
//         key:'/city',
//         type:'tool'
//     },
//     {
//         title:'订单管理',
//         key:'/order',
//         type:'reload',
//         btnList:[
//             {
//                 title:'订单详情',
//                 key:'/order/detail'
//             },
//             {
//                 title:'结束订单',
//                 key:'/order/finish'
//             }
//         ]
//     },
//     {
//         title:'员工管理',
//         key:'/user',
//         type:'inbox'
//     },
//     {
//         title:'车辆地图',
//         key:'/bikeMap',
//         type:'eye'
//     },
//     {
//         title:'图标',
//         key:'/charts',
//         type:'code',
//         children:[
//             {
//                 title:'柱形图',
//                 key:'/charts/bar'
//             },
//             {
//                 title:'饼图',
//                 key:'/charts/pie'
//             },
//             {
//                 title:'折线图',
//                 key:'/charts/line'
//             },
//         ]
//     },
//     {
//         title:'权限设置',
//         type:'setting',
//         key:'/permission'
//     },
//   ];
const menuList = [
    {
        title:'网站统计',
        key: '/Dashboard',
        type: 'dashboard',
    },{
        title:'我的剪辑',
        key: '/DemoVideo',
        type: 'dashboard',
    },{
        title:'文章管理',
        key: '/ProductIndex',
        type: 'file-markdown',
        child: false,
        children: [
           {
               title: '添加文章',
               key: '/ProductIndex-add'
           },{
               title: '编辑文章',
               key: '/ProductIndex-edit'
           }
        ]
    },{
        title: '图说生活',
        key: '/JobIndex',
        type: 'linkedin',
        child: false,
        children: [
            {
                title: '',
                key: '/JobIndex-add'
            },{
                title: '智能推荐日志',
                key: '/JobIndex-edit'
            }
        ]
    }
    // ,{
    //     title: '用户管理',
    //     key: '/GuestIndex',
    //     type: 'linkedin'
    // }
]
  export default menuList;