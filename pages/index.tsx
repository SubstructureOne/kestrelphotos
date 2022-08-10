import { NextPage } from 'next'
import AlbumList from '../components/albumlist'
import Navigation from '../components/navigation'
import Footer from '../components/footer'

const Home: NextPage = () => {
    return <>
        <meta charSet="utf-8" />
        <title>Kestrel Photos</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="Webflow" name="generator" />
        <link href="css/normalize.css" rel="stylesheet" type="text/css" />
        <link href="css/webflow.css" rel="stylesheet" type="text/css" />
        <link href="css/kestrelphotos.webflow.css" rel="stylesheet" type="text/css" />
        <link href="images/favicon.ico" rel="shortcut icon" type="image/x-icon" />
        <link href="images/webclip.png" rel="apple-touch-icon" />
        <Navigation/>
        <div className="section wf-section">
            <div className="w-container">
                <div className="w-dyn-list">
                    <AlbumList/>
                </div>
            </div>
        </div>
        <Footer/>
    </>
}

export default Home