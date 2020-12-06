import '../asserts/styles.less'
import '../styles/globals.less'
import '../styles/hover.less'

function MyApp({ Component, pageProps }) {
  return <div className="container">
     <Component {...pageProps} />
  </div>
}

export default MyApp
