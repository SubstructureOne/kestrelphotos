import { Session } from '@supabase/supabase-js'
import { LogoutButton } from "./auth"
import { Dispatch, FunctionComponent, SetStateAction } from 'react'

type NavigationProps = {
    session: Session | null
    setSession: Dispatch<SetStateAction<Session|null>>
}

const Navigation: FunctionComponent<NavigationProps> = ({
        session, setSession
}) => {
    return <div
        data-collapse="medium"
        data-animation="default"
        data-duration={400}
        data-easing="ease"
        data-easing2="ease"
        role="banner"
        className="navigation-bar w-nav"
    >
        <div className="w-container">
            <a
                href="/"
                aria-current="page"
                className="brand-link w-nav-brand w--current"
            >
                <h1 className="brand-text">NEWPORT</h1>
            </a>
            <nav role="navigation" className="navigation-menu w-nav-menu">
                <a
                    href="/"
                    aria-current="page"
                    className="navigation-link w-nav-link w--current"
                >
                    Gallery
                </a>
                <a href="blog.html" className="navigation-link w-nav-link">
                    Blog
                </a>
                <a href="about.html" className="navigation-link w-nav-link">
                    About
                </a>
                {session
                    ?
                    <LogoutButton setSession={setSession}/>
                    :
                    <a href="#" className="navigation-link w-nav-link">Login</a>
                }
            </nav>
            <div className="hamburger-button w-nav-button">
                <div className="w-icon-nav-menu" />
            </div>
        </div>
    </div>
}

export default Navigation
