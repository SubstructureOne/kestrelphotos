import { Session } from '@supabase/supabase-js'
import { LogoutButton } from "./auth"
import { Dispatch, FunctionComponent, SetStateAction } from 'react'
import { slide as Menu } from 'react-burger-menu'

type NavigationProps = {
    session: Session | null
    setSession: Dispatch<SetStateAction<Session|null>>
}

const Navigation: FunctionComponent<NavigationProps> = ({
        session, setSession
}) => {
    const navlinks = <>
        <a href="/" className="navigation-link w-nav-link">
            Album List
        </a>
        <a href="/createalbum" className="navigation-link w-nav-link">
            New Album
        </a>
        <a href="/managekeys" className="navigation-link w-nav-link">
            Manage Keys
        </a>
        {session
            ?
            <LogoutButton setSession={setSession} hamburger={false}/>
            :
            <a href="#" className="navigation-link w-nav-link">Login</a>
        }
    </>
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
                <h1 className="brand-text">Kestrel Photos</h1>
            </a>
            <nav role="navigation" className="navigation-menu w-nav-menu">
                {navlinks}
            </nav>
            <div className="hamburger-button w-nav-button">
                <div className="w-icon-nav-menu"/>
                    <Menu right={true} width="300px">
                        <a href="/" className="navigation-link w-nav-link">
                            Album List
                        </a>
                        <a href="/createalbum" className="navigation-link w-nav-link">
                            New Album
                        </a>
                        <a href="/managekeys" className="navigation-link w-nav-link">
                            Manage Keys
                        </a>
                        {session
                            ?
                            <LogoutButton setSession={setSession} hamburger={true}/>
                            :
                            <a
                                href="#"
                                className="navigation-link w-nav-link bm-item"
                                style={{display: "block"}}
                            >
                                Login
                            </a>
                        }
                    </Menu>
                {/*</div>*/}
            </div>
        </div>
    </div>
}

export default Navigation
