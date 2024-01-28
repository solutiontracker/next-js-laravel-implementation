import React, { useEffect } from "react";
import Header from 'components/auth/layout/header'
import SideBar from 'components/auth/layout/sidebar'
import App from 'components/app'
import { useAuth } from 'context/auth-provider';
import { useRouter } from 'next/router';
import {
    GoogleReCaptchaProvider
} from 'react-google-recaptcha-v3';

const Master = ({ children }: any) => {

    const router: any = useRouter();

    const { token, redirect_after_login, user } = useAuth();

    const { redirect } = router.query;

    useEffect(() => {
        if (token !== null && token !== undefined && user?.id !== undefined && user?.id !== null) {
            if (redirect && redirect?.includes('roadmap.SystemLimited.io') && user?.frill_token) {
                window.location.href = `${redirect}?ssoToken=${user?.frill_token}`
            } else if (redirect_after_login) {
                router.push(redirect_after_login);
            } else {
                router.push('/user/dashboard');
            }
        }
    }, [token, user, redirect]);

    if (token !== undefined && token !== null) {
        return null
    }

    return (
        <App>
            <div className="wf-split-page" >
                <div className="wf-split-page__default">
                    <div className="wf-split-page__wrapper">
                        <Header />
                        <GoogleReCaptchaProvider reCaptchaKey={`${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}>
                            {children}
                        </GoogleReCaptchaProvider>
                    </div>
                </div>
                <SideBar />
            </div>
        </App>
    )
}

export default Master
