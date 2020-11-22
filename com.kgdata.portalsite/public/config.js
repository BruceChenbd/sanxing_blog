//登录及菜单控制开关, tableFlag=true:需要登录,展示所有菜单  tableFlag=false:关闭登录功能,关闭菜单,只留概览和可视化
//tableFlag=true时,需要修改components\instance\style.css文件中的advanced_search_input样式,将样式中的两行注释掉
//tableFlag=false时,需要修改components\instance\style.css文件中的advanced_search_input样式,将样式中的两行注释释放掉
export const tableFlag = false

//tableFlag=false时有效,默认登录账户密码
export const pwd = "827ccb0eea8a706c4c34a16891f84e7b"
//tableFlag=false时有效,默认登录账户名称
export const username = "root"

//本体对象过滤ID
export const  mainObjectIds = ['1b1aebe0aa5c4cfcadd80c01d837bfea','2bef5a7ff3ad457f84bb95464ef935f4','30cfdf92cffa4d2caec6dc82e2a40046','3eddbf0e763643a5882e1835c2ec06eb','495cca8999a8400ca83ece21679da8b2','5c64ecc9bac44a8eb41419f33a4e6c48','6d8112c992ce4306b2c772d51c88486f','982406de76274bde8ffc664d8ca8ec16']

//qb详情页地址
export const qbInfoAddr = "http://127.0.0.1:8080/qb/info/"

//单点登录失败跳转地址
export const loginAddr = "http://127.0.0.1:18080/login"
