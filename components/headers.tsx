import React, { FunctionComponent } from 'react'

type HeadersProps = {
    title: string
}

export const Headers: FunctionComponent<HeadersProps> = ({title}) => {
    return <>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="Webflow" name="generator" />
        <link href="/css/normalize.css" rel="stylesheet" type="text/css" />
        <link href="/css/webflow.css" rel="stylesheet" type="text/css" />
        <link href="/css/kestrelphotos.webflow.css" rel="stylesheet" type="text/css" />
        <link href="/images/favicon.ico" rel="shortcut icon" type="image/x-icon" />
        <link href="/images/webclip.png" rel="apple-touch-icon" />
    </>
}
