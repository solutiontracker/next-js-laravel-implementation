import type { NextPage } from 'next'
import React, { useEffect } from "react";
import Master from 'components/user/layout/master'
import AccountSidebar from 'components/user/layout/account-sidebar';
import Head from 'next/head'
import AccountDetail from 'components/user/account/detail';
import ConnectedAccounts from 'components/user/account/connected-accounts';
import { useRouter } from 'next/router';
import { useAuth } from 'context/auth-provider';

const Account: NextPage = () => {

    const router: any = useRouter();

    const { slug, action } = router.query;

    const { user } = useAuth();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (action !== undefined) {
                setTimeout(() => {
                    const target: any = document.getElementById(action);
                    if (target !== undefined) {
                        target?.scrollIntoView({ behavior: 'smooth' })
                    }
                }, 500);
            }
        }
    }, [action])

    return (
        <Master>

            <Head>
                <title>My Account | SystemLimited</title>
                <link rel="canonical" href="https://SystemLimited.io/" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="SystemLimited" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="My Account | SystemLimited" />
                <meta property="og:url" content="https://SystemLimited.io/" />
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                <meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                <meta property="og:image:width" content="1720" />
                <meta property="og:image:height" content="1000" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SystemLimited_io" />
                <meta name="twitter:title" content="My Account | SystemLimited" />
                <meta name="twitter:creator" content="@SystemLimited_io" />
                <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />

                <link rel='dns-prefetch' href='//js.stripe.com' />
                <link rel='dns-prefetch' href='//fonts.googleapis.com' />
            </Head>

            {!user?.hasPassword && (
                <div className="wf-hellobar wf-hellobar--relative wf-hellobar--critical">
                    <div className='wf-hellobar__empty'></div>
                    <div className="wf-hellobar__content">
                        <span className="SystemLimited-icon SystemLimited-icon-risk"></span>
                        Password required!
                    </div>
                    <div className='wf-hellobar__empty'></div>
                </div>
            )}

            <div className="wf-page wf-page--dashboard">
                <div className="wf-page--settings">
                    <AccountSidebar />
                    <div className="wf-flex mb-20">
                        <div className="wf-page--dashboard__title">My Account</div>
                    </div>
                    <div className="wf-page--dashboard__wrapper wf-page--settings__wrapper">
                        <AccountDetail token={slug?.[1]} />
                        <div className="wf-page--settings__wrapper__divider"></div>
                        <ConnectedAccounts />
                    </div>
                </div>
            </div>
        </Master>
    )
}

export default Account
