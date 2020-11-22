import React , { useState,useEffect,useRef,useContext  } from 'react';
import useWindowSize from './personalHook';
import Counter from './reducer';

const themes = {
    light: {
        background: 'lightblue'
    },
    dark: {
        background: 'black'
    }
}

const ThemeContext = React.createContext(themes.light);
function State (props) {
    /***
     * useState(arg)
     * 该函数只有一个参数 参数可以是任意值
     * 并且返回一个数组，数组中有两个对象
     * 第一个是state变量并且把参数值赋予它，
     * 第二个是设置这个state变量值的方法，这两个对象的名称可自定义
     */
    const [count, setCount] = useState(0);
    const windowSize = useWindowSize();
    const el = useRef(null);

    /***
     * userEffect(fn,arr)
     * 该函数有两个参数
     * 参数1： 副作用函数 用来编写可能具有副作用的代码。
     * 副作用函数还可以返回一个函数对象，这个函数对象用来清除副作用，
     * 不用清除副作用则不用返回。
     * 清除阶段对应class生命周期中的卸载componentWillUnmount，更新componentWillUpdate
     * 参数2： 数组 （可选） 传入副作用代码可能用到的数据变量，并且该变量具有一定的变化性。
     * 作用是 优化 防止重复渲染
     * 若前后两次传入的参数一样，则不会渲染
     * 利用此参数也可以实现只在挂载的时候渲染一次，
     * 而后更新的时候不再渲染
     * 相当于把挂载时只执行一次的代码写在componentDidMount ，
     * 然后在componentWillUnmount清除代码副作用。
     * 实现这个功能并不需要像class组件必须在不同生命周期函数中编写代码，
     * 在这里你只需把第二个参数改为一个空数组即可。
     */
    useEffect(() => {
        // 要操作的内容 产生的副作用
        document.title = `你点击了${count}次按钮`
        return () => {
            // 清除副作用
            document.title = '清除副作用'
        }
    }, [count])

    useEffect(() => {
        const oDiv = document.createElement('div');
        oDiv.innerHTML = '我只执行一次';
        document.getElementById('test-hook').append(oDiv);
    },[])
    return (
        <div id="test-hook">
            <p ref={el}></p>
            <p>你点击了{count}次</p>
            <button onClick={() => setCount(count + 1)}>
                click me
            </button>
            <button onClick={() =>console.log(el.current)}>
                click get el
            </button>
            <div>
                {
                    windowSize.innerHeight
                }
            </div>
            {/* <ThemeContext.Provider value={themes.dark}> */}
               <Toolbar />
            {/* </ThemeContext.Provider > */}
            <Counter />
        </div>
    )
}

function Toolbar (props) {
    return (
        <ThemeBtn />
    )
}

function ThemeBtn () {
    const theme = useContext(ThemeContext);
    console.log(theme)
    return (
        <button style={{ background: theme.background }}>
            I am styled by theme context!
        </button>
    )
}
export default State