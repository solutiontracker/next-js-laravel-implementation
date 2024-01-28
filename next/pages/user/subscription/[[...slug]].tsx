import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect } from "react";
import Master from 'components/user/layout/master'
import AccountSidebar from 'components/user/layout/account-sidebar';
import ActiveSubscription from 'components/user/subscription/active-subscription';
import PaymentMethods from 'components/user/subscription/payment-methods';
import BillingHistory from 'components/user/subscription/billing-history';
import CancelSubscription from 'components/user/subscription/cancel-subscription';
import { useRouter } from 'next/router';
import RedeemLtd from 'components/user/subscription/redeem-ltd';
import { useAuth } from 'context/auth-provider';

const Subscriptions: NextPage = () => {

    const router: any = useRouter();

    const { action } = router.query;

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
                <title>Subscriptions and Billing | SystemLimited</title>
                <link rel="canonical" href="https://SystemLimited.io/" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="SystemLimited" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Subscriptions and Billing | SystemLimited" />
                <meta property="og:url" content="https://SystemLimited.io/" />
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                <meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                <meta property="og:image:width" content="1720" />
                <meta property="og:image:height" content="1000" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SystemLimited_io" />
                <meta name="twitter:title" content="Subscriptions and Billing | SystemLimited" />
                <meta name="twitter:creator" content="@SystemLimited_io" />
                <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />

                <link rel='dns-prefetch' href='//js.stripe.com' />
                <link rel='dns-prefetch' href='//fonts.googleapis.com' />
            </Head>

            <div className="wf-page wf-page--dashboard">
                <div className="wf-page--settings">
                    <AccountSidebar />
                    <div className="wf-flex mb-20">
                        <div className="wf-page--dashboard__title">Subscriptions and Billing</div>
                    </div>
                    <div className="wf-page--dashboard__wrapper wf-page--settings__wrapper">
                        <ActiveSubscription action={action} />
                        <div className="wf-page--settings__wrapper__divider"></div>
                        <PaymentMethods action={action} />
                        <div className="wf-page--settings__wrapper__divider"></div>
                        <BillingHistory />
                        <div className="wf-page--settings__wrapper__divider"></div>
                        <RedeemLtd />
                        <div className="wf-page--settings__wrapper__divider"></div>
                        <CancelSubscription />
                    </div>
                </div>
            </div>

            {/* <UpgradeCdn /> */}

        </Master>
    )
}

export default Subscriptions
