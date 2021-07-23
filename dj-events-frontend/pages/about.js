import Link from 'next/link'
import Layout from '../components/Layout'

const AboutPage = () => {
    return (
        <Layout title='About DJ Events'>
            <h1>About</h1>
            <Link href='/'>Home</Link>
        </Layout>
    )
}

export default AboutPage
