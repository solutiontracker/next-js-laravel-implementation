import React, { useState, useEffect } from "react";
import Header from 'components/layout/header'
import Footer from 'components/layout/footer'
import App from 'components/app'
import DownloadPlugin from 'components/alerts/DownloadPlugin'
import { useRouter } from 'next/router';
import { useAuth } from 'context/auth-provider';
import CookiesConsent from 'components/widgets/cookies-consent';
import VideoBaloon from 'components/widgets/video-baloon';
import VideoIframe from 'components/widgets/video-iframe';
import {
    GoogleReCaptchaProvider
} from 'react-google-recaptcha-v3';

const Master = ({ children }: any) => {

    const { token, updateAction, user } = useAuth();

    const [download, setDownload] = useState(false);

    const router: any = useRouter();

    const { action, redirect } = router.query;

    const triggerDownload = (value: boolean) => {
        updateAction({});
        setDownload(value);
    }

    useEffect(() => {
        if (token !== null && token !== undefined && user?.id !== undefined && user?.id !== null) {
            if (redirect && redirect?.includes('roadmap.SystemLimited.io') && user?.frill_token) {
                window.location.href = `${redirect}?ssoToken=${user?.frill_token}`
            }
        }
    }, [token, user, redirect]);

    useEffect(() => {
        if (action === "download") {
            setDownload(true);
        }
    }, [action]);

    return (
        <App >
            <Header triggerDownload={triggerDownload} />
            <GoogleReCaptchaProvider reCaptchaKey={`${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}>
                {children}
            </GoogleReCaptchaProvider>
            {download && (
                <DownloadPlugin triggerDownload={triggerDownload} />
            )}
            <Footer triggerDownload={triggerDownload} />
            <CookiesConsent />
            <VideoBaloon />
            <VideoIframe />
        </App>
    )
}

export default Master
