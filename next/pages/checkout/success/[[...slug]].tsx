import type { NextPage } from 'next'
import React, { useState, useEffect, useRef } from "react";
import Master from 'components/checkout/layout/master'
import Head from 'next/head'
import { useRouter } from 'next/router';
import { service } from 'services/service'
import { toast } from 'react-toastify';
import { useAuth } from 'context/auth-provider';

const Index: NextPage = () => {

    const [plan, setPlan] = useState<any>({});

    const mounted = useRef(false);

    const [action, setAction] = useState<any>({});

    const router: any = useRouter();

    const { slug } = router.query;

    const [time_left, setTimeLeft] = useState(9);

    const { user } = useAuth();

    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    useEffect(() => {
        if (slug?.[0] !== undefined) {
            getPlan(slug?.[0]);
        }
    }, [slug]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (time_left > 0) {
                setTimeLeft(time_left - 1);
            } else {
                router.push(`/user/dashboard`);
            }
        }, 1000);
        return () => clearTimeout(timer);
    });

    const getPlan = (plan_id: any) => {
        setAction({ type: 'load-plan' });
        service.get(`${process?.env?.NEXT_PUBLIC_API_URL}/user/plan/${plan_id}`)
            .then(
                response => {
                    if (mounted.current) {
                        if (response.success) {
                            setPlan(response?.data?.plan)
                        } else {
                            toast.error(response?.message, {
                                position: "bottom-right"
                            });
                        }
                        setAction({});
                    }
                },
                error => {
                    setAction({});
                    toast.error(error, {
                        position: "bottom-right"
                    });
                }
            );
    }

    return (
        <Master>

            <Head>
                <title>Payment Successful | SystemLimited</title>
                <link rel="canonical" href="https://SystemLimited.io/" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="SystemLimited" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Payment Successful | SystemLimited" />
                <meta property="og:url" content="https://SystemLimited.io/" />
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`}/>
                <meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`}/>
                <meta property="og:image:width" content="1720" />
                <meta property="og:image:height" content="1000" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SystemLimited_io" />
                <meta name="twitter:title" content="Payment Successful | SystemLimited" />
                <meta name="twitter:creator" content="@SystemLimited_io" />
                <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                
                <link rel='dns-prefetch' href='//js.stripe.com' />
                <link rel='dns-prefetch' href='//fonts.googleapis.com' />
            </Head>

            <div className="wf-split-page__heading mt-64">
                <div className="wf-split-page__heading__title">
                    Payment Successful
                </div>
                <div></div>
            </div>

            <div className="wf-split-page__form mt-32">

                <div className="wf-alert wf-alert--success wf-alert--fluid">
                    <div className="wf-alert__ribbon">
                        <span className="SystemLimited-icon SystemLimited-icon-circle-tick"></span>
                    </div>
                    <div className="wf-alert__content-wrapper">
                        <div className="wf-alert__heading">Payment Successful</div>
                            <div className="wf-alert__content">Thank you for your payment, You'r now subscribed to <b>{plan?.name} {Number(plan?.months) > 1 ? 'Yearly' : 'Monthly'} Plan</b>.</div>
                    </div>
                </div>

                <div className="wf-split-page__form__sub mt-8">You will be redirected automatically to dashboard in <b>{time_left} seconds</b>. </div>

                <button onClick={() => {
                    router.push(`/user/dashboard`);
                }} className="wf-button wf-button--large wf-button--fluid wf-button--primary mt-12">
                    <div className="wf-button__content">
                        <div className="wf-button__text">Continue to Dashboard</div>
                    </div>
                    <div className="wf-button__backdrop"></div>
                </button>
            </div>

        </Master>
    )
}

export default Index
