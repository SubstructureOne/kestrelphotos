import type { NextPage } from 'next'
import Navigation from '../components/navigation'
import Footer from '../components/footer'
import React, {useState} from "react";


const CreateAlbum: NextPage = () => {
    const [albumName, setAlbumName] = useState('')
    const [fileinfo, setFileinfo] = useState<FileList|null>(null)
    const onSubmitHanlder = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const files = Array.from(fileinfo??[])
        const filehandler = async (file: File) => {
            await fetch(
                ""
            )
        }
    }
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
        <div className="w-container">
            <h1>Create Album</h1>
            <div className="w-form">
                <form
                    id="createalbum-form"
                    name="createalbum-form"
                    data-name="Create Album"
                    method="get"
                    onSubmit={onSubmitHanlder}
                >
                    <label htmlFor="name">Album Name</label>
                    <input type="text"
                           className="w-input"
                           maxLength={256}
                           name="name"
                           data-name="Name"
                           placeholder=""
                           id="name"
                           value={albumName}
                           onChange={e=>setAlbumName(e.target.value)}
                    />
                    <label htmlFor="photos">Photos:</label>
                    <input
                        type="file"
                        id="photos"
                        className="w-input"
                        multiple={true}
                        onChange={(e) => {setFileinfo(e.target.files)}}
                    />
                    <input type="submit" value="Submit" data-wait="Please wait..." className="w-button"/>
                </form>
            </div>
        </div>
        <Footer/>
    </>
}

export default CreateAlbum
