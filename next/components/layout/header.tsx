import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useAuth } from 'context/auth-provider';
import ActiveLink from 'components/widgets/active-link';

const Header = (props: any) => {

    const router: any = useRouter();

    const { token, user, updateAction, action } = useAuth();

    const [top, setTop] = useState(0);

    const handleScroll = () => {
        setTop(window.scrollY)
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    });

    useEffect(() => {
        const closeMenu = () => {
            updateAction({});
        };
        router.events.on("routeChangeStart", closeMenu);
        return () => router.events.off("routeChangeStart", closeMenu);
    }, [router.events]);

    useEffect(() => {
        document.addEventListener("click", documentClicked);
        return () => {
            // unsubscribe event
            document.removeEventListener("click", documentClicked);
        };
    }, [])

    //Document click
    const documentClicked = () => {
        updateAction({});
    }

    return (
        <div className={`wf-header wf-header--background-yellow ${top > 140 && 'wf-header--is-sticky'} ${action?.name === 'open-menu' && 'wf-header--nav-open'}`}>
            <div className="wf-header__content">
                <div className="wf-header__logo">
                    <a onClick={() => router.push('/')}>
                        <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/SystemLimited-logo.svg`} alt="" sizes="" />
                    </a>
                </div>
                <div className="wf-header__navigation">
                    <ul>
                        <li>
                            <ActiveLink activeClassName="wf-header__navigation__link--active" href="/pricing" wildcard={true}>
                                <a className="wf-header__navigation__link" >Pricing</a>
                            </ActiveLink>
                        </li>
                        {/* <li>
                            <ActiveLink activeClassName="wf-header__navigation__link--active" href="/lifetime-deal">
                                <a className="wf-header__navigation__link">Lifetime Deal</a>
                            </ActiveLink>
                        </li> */}
                        <li>
                            <ActiveLink activeClassName="wf-header__navigation__link--active" href="/features">
                                <a className="wf-header__navigation__link" >Features</a>
                            </ActiveLink>
                        </li>
                        <li>
                            <ActiveLink activeClassName="wf-header__navigation__link--active" href="/cdn">
                                <a className="wf-header__navigation__link" >CDN</a>
                            </ActiveLink>
                        </li>
                        <li>
                            <a onClick={(e: any) => {
                                e.preventDefault();
                                props.triggerDownload(true)
                            }} className="wf-header__navigation__link" >Download</a>
                        </li>
                        <li>
                            <ActiveLink activeClassName="wf-header__navigation__link--active" href="/user/support" wildcard={true}>
                                <a className="wf-header__navigation__link" >Support</a>
                            </ActiveLink>
                        </li>
                        {user !== undefined && user !== null && (
                            <>
                                <li>
                                    <ActiveLink activeClassName="wf-header__navigation__link--active" href="/user/dashboard" wildcard={true}>
                                        <a className="wf-header__navigation__link" >Dashboard</a>
                                    </ActiveLink>
                                </li>
                                {Number(user?.is_free) === 1 && (
                                    <li>
                                        <button onClick={() => router.push('/pricing')} className="wf-button wf-button--primary wf-button--medium">
                                            <div className="wf-button__content">
                                                <div className="wf-button__text">Upgrade</div>
                                            </div>
                                            <div className="wf-button__backdrop"></div>
                                        </button>
                                    </li>
                                )}
                            </>
                        )}
                        {(user === undefined || user === null) && (
                            <>
                                <li>
                                    <ActiveLink activeClassName="wf-header__navigation__link--active" href="/auth/login" wildcard={true}>
                                        <a className="wf-header__navigation__link" >Login</a>
                                    </ActiveLink>
                                </li>
                                <li>
                                    <button onClick={() => router.push('/pricing')} className="wf-button wf-button--primary wf-button--medium">
                                        <div className="wf-button__content">
                                            <div className="wf-button__text">Start free trial</div>
                                        </div>
                                        <div className="wf-button__backdrop"></div>
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
                <div className="wf-header__menu-toggle" onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (action?.name === 'open-menu') {
                        updateAction({});
                    } else {
                        updateAction({ name: 'open-menu' });
                    }
                }}></div>
            </div>
        </div>
    )
}

export default Header
