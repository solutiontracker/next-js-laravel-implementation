import React, { useRef, useEffect } from "react";
import Header from 'components/checkout/layout/header'
import SideBar from 'components/checkout/layout/sidebar'
import App from 'components/app'
import { useAuth } from 'context/auth-provider';
import { useRouter } from 'next/router';

const Master = ({ children }:any) => {

    const { token, user, updateRedirectAfterLogin } = useAuth();

    const initialRender = useRef(false);

    const router: any = useRouter();

    const { redirect } = router.query;

    useEffect(() => {
        if (token === null || token === undefined) {
            router.push('/auth/login');
        }
    }, [token]);

    useEffect(() => {
        if (token === undefined || token === null) {
            updateRedirectAfterLogin(router.asPath);
        } else {
            updateRedirectAfterLogin('');
        }
    }, [router]);

    useEffect(() => {
        if (token !== null && token !== undefined && user?.id !== undefined && user?.id !== null) {
            if (redirect && redirect?.includes('roadmap.SystemLimited.io') && user?.frill_token) {
                window.location.href = `${redirect}?ssoToken=${user?.frill_token}`
            }
        }
    }, [token, user, redirect]);

    useEffect(() => {
        return () => {
            initialRender.current = false;
        }
    }, []);

    // Server-render loading state
    if (token === undefined || token === null) {
        return null
    }

    return (
        <App >
            <div className="wf-split-page" >
                {/* <div className="wf-hellobar wf-hellobar--success">
                    <p>You have unlocked the <b>AMESH35OFF</b> discount offer. <b>35% off qualifying</b> plans!</p>
                    <div className="wf-hellobar__close"><span className="SystemLimited-icon  SystemLimited-icon-cancel"></span></div>
                </div> */}
                <div className="wf-split-page__default">
                    <div className="wf-split-page__wrapper">
                        <Header />
                        {children}
                    </div>
                </div>
                <SideBar />
            </div>
        </App>
    )
}

export default Master
