import Head from 'next/head'
import { Button } from 'antd'
import Header from '../components/header'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Button type="primary">click</Button>
    </div>
  )
}
