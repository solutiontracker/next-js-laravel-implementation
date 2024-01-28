import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router';
import { useAuth } from 'context/auth-provider';
import ActiveLink from 'components/widgets/active-link';
import { service } from 'services/service'
import { toast } from 'react-toastify';

const Header = (props: any) => {

    const router: any = useRouter();

    const { updateToken, user, updateAction, action } = useAuth();

    const [menu, setMenu] = useState(false);

    const _isMounted = useRef(true);

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
        setMenu(false);
        updateAction({});
    }

    useEffect(() => {
        return () => {
            _isMounted.current = false;
        }
    }, []);

    const logout = () => {
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/auth/logout`, {})
            .then(
                response => {
                    if (_isMounted.current) {
                        if (response.success) {
                            updateToken(null)
                        }
                    }
                },
                error => {
                    toast.error(error, {
                        position: "bottom-right"
                    });
                }
            );
    }

    return (
        <div className={`wf-header wf-header--relative wf-header--background-dark ${action?.name === 'open-menu' && 'wf-header--nav-open'}`}>
            <div className="wf-header__content">
                <div style={{ cursor: 'pointer' }} onClick={() => router.push('/user/dashboard')} className="wf-header__logo">
                    <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/SystemLimited-logo-white.svg`} alt="" sizes="" />
                </div>
                <div className="wf-header__navigation">
                    <ul>
                        <li>
                            <ActiveLink activeClassName="wf-header__navigation__link--active" href="/user/dashboard" wildcard={true}>
                                <a className="wf-header__navigation__link" >My Websites</a>
                            </ActiveLink>
                        </li>
                        <li>
                            <ActiveLink activeClassName="wf-header__navigation__link--active" href="/user/cdn/stats" wildcard={true}>
                                <a className="wf-header__navigation__link" >
                                    CDN
                                    {user?.id !== undefined && (
                                        <>
                                            {user?.balance && user?.balance !== 0 ? (
                                                <>
                                                    {user?.balance && user?.balance > 0 ? (
                                                        <span className="wf-badge wf-badge--success ml-4">${user?.balance_display}</span>
                                                    ) : ''}
                                                    {user?.balance && user?.balance < 0 ? (
                                                        <span className="wf-badge wf-badge--critical ml-4">$-{user?.balance_display}</span>
                                                    ) : ''}
                                                </>
                                            ) : ''}
                                        </>
                                    )}
                                </a>
                            </ActiveLink>
                        </li>
                        <li><a onClick={(e: any) => {
                            e.preventDefault();
                            updateAction({});
                            props.triggerDownload(true)
                        }} className="wf-header__navigation__link" >Download</a></li>
                        <li>
                            <ActiveLink activeClassName="wf-header__navigation__link--active" href="/user/support" wildcard={true}>
                                <a className="wf-header__navigation__link" >Support</a>
                            </ActiveLink>
                        </li>
                        <li className="wf-header__navigation__link">
                            <a href="https://roadmap.SystemLimited.io/" target={'_blank'} className="wf-header__navigation__link" >Roadmap</a>
                        </li>
                        <li className="wf-header__navigation__link wf-header__navigation__link--notification">
                            <i className="SystemLimited-icon SystemLimited-icon-notification"></i>
                            <span>Announcements</span>
                        </li>

                        {Number(user?.is_free) === 1 && (
                            <li>
                                <button onClick={() => {
                                    router.push('/pricing');
                                }} className="wf-button wf-button--upgrade wf-button--medium">
                                    <div className="wf-button__content">
                                        <span className="SystemLimited-icon SystemLimited-icon-star-outline mr-4"></span>
                                        <div className="wf-button__text">Upgrade Subscription</div>
                                    </div>
                                    <div className="wf-button__backdrop"></div>
                                </button>
                            </li>
                        )}
                        <li className="wf-header__navigation__divider wf-header__navigation--small-only">

                        </li>
                        <li className="wf-header__navigation--small-only">
                            <ActiveLink activeClassName="wf-header__navigation__link--active" href="/user/account" wildcard={true}>
                                <a className="wf-header__navigation__link" >My account</a>
                            </ActiveLink>
                        </li>
                        <li className="wf-header__navigation--small-only">
                            <ActiveLink activeClassName="wf-header__navigation__link--active" href="/user/subscription" wildcard={true}>
                                <a className="wf-header__navigation__link" >Subscriptions</a>
                            </ActiveLink>
                        </li>
                        <li className="wf-header__navigation--small-only">
                            <a className="wf-header__navigation__link" onClick={() => {
                                logout();
                            }}>Logout</a>
                        </li>
                        <li>
                            <div className={`wf-dropdown ${menu && 'wf-dropdown--active'}`}>
                                <div style={{ backgroundImage: `url(${user?.image})` }} className="wf-header__user-thumb" onClick={(e: any) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setMenu(!menu);
                                }}>
                                </div>
                                <div className="wf-dropdown__menu wf-dropdown--right wf-dropdown--child-left">
                                    <ul className="wf-dropdown-wrapper">
                                        <ActiveLink activeClassName="wf-dropdown__menu__item--active" href="/user/account" wildcard={true}>
                                            <li className="wf-dropdown-wrapper__item-wrapper">
                                                <a className="wf-dropdown__menu__item">
                                                    <span className="SystemLimited-icon SystemLimited-icon-user mr-4"></span>
                                                    <span className="wf-dropdown__menu__item__text">My account</span>
                                                </a>
                                            </li>
                                        </ActiveLink>
                                        <ActiveLink activeClassName="wf-dropdown__menu__item--active" href="/user/subscription" wildcard={true}>
                                            <li className="wf-dropdown-wrapper__item-wrapper">
                                                <a className="wf-dropdown__menu__item">
                                                    <span className="SystemLimited-icon SystemLimited-icon-subscription mr-4"></span>
                                                    <span className="wf-dropdown__menu__item__text">Subscriptions</span>
                                                </a>
                                            </li>
                                        </ActiveLink>
                                        <li className="wf-dropdown-wrapper__item-wrapper">
                                            <div className="wf-dropdown__menu__divider"></div>
                                        </li>
                                        <li className="wf-dropdown-wrapper__item-wrapper">
                                            <a className="wf-dropdown__menu__item" onClick={() => {
                                                logout();
                                            }}>
                                                <span className="SystemLimited-icon SystemLimited-icon-log-out mr-4"></span>
                                                <span className="wf-dropdown__menu__item__text">Logout</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>
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
