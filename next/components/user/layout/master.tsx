import React, { useRef, useEffect, useState } from "react";
import Header from 'components/user/layout/header'
import Footer from 'components/user/layout/footer'
import Verification from 'components/user/layout/verification'
import ActivateSubscription from 'components/user/layout/activate-subscription'
import App from 'components/app'
import { useAuth } from 'context/auth-provider';
import { useRouter } from 'next/router';
import DownloadPlugin from 'components/alerts/DownloadPlugin'
import Roadmap from 'components/widgets/roadmap'

const Master = ({ children }: any) => {

    const { token, updateRedirectAfterLogin, updateAction, user } = useAuth();

    const initialRender = useRef(false);

    const router: any = useRouter();

    const { redirect, action } = router.query;

    const [download, setDownload] = useState(false);

    const triggerDownload = (value: boolean) => {
        updateAction({});
        setDownload(value);
    }

    useEffect(() => {
        if (action === "download") {
            setDownload(true);
        }
    }, [action]);

    useEffect(() => {
        if (token === null || token === undefined) {
            router.push('/auth/login');
        }
    }, [token]);

    useEffect(() => {
        return () => {
            initialRender.current = false;
        }
    }, []);

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

    if (token === undefined || token === null) {
        return null
    }

    return (
        <App >
            <Header triggerDownload={triggerDownload} />
            <Verification />
            <ActivateSubscription />
            {children}
            {download && (
                <DownloadPlugin triggerDownload={triggerDownload} />
            )}
            <Footer />
            <Roadmap />
        </App>
    )
}

export default Master
