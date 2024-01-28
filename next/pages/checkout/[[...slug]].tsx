import type { NextPage } from 'next'
import React, { ReactElement, FC, useState, useEffect, useRef } from "react";
import Head from 'next/head'
import Master from 'components/checkout/layout/master'
import { loadStripe } from '@stripe/stripe-js';
import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
import { service } from 'services/service'
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import PaymentMethods from 'components/user/subscription/payment-methods';
import { useAuth } from 'context/auth-provider';
import { in_array } from 'helpers/helper';

const CardForm: FC<any> = (props: any): ReactElement => {

    const [clientSecret, setClientSecret] = useState("");

    const [succeeded, setSucceeded] = useState(false);

    const [processing, setProcessing] = useState(false);

    const stripe: any = useStripe();

    const elements = useElements();

    const element_options = {
        classes: {
            base: 'wf-cardfield',
            focus: 'wf-cardfield--focus',
            invalid: 'wf-cardfield--invalid',
        },
        style: {
            base: {
                color: '#202223',
                iconColor: '#2C6ECB',

                '::placeholder': {
                    color: '#6D7175',
                },
            },
            invalid: {
                iconColor: '#D72C0D',
                color: '#D72C0D'
            },
        },
    };

    const mounted = useRef(false);

    const router: any = useRouter();

    const [name, setName] = useState('');

    const [card, setCard] = useState(false);

    const { action, loadUser, user } = useAuth();

    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    useEffect(() => {
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/subscription/create-setup-payment`, {})
            .then(
                response => {
                    if (response.success && mounted.current) {
                        setClientSecret(response?.data?.intent.client_secret);
                    } else {
                        toast.error(response?.message, {
                            position: "bottom-right"
                        });
                    }
                },
                error => {
                    toast.error(error, {
                        position: "bottom-right"
                    });
                }
            );
    }, []);

    const handleSubmit = async () => {
        setProcessing(true);

        // Confirm card setup
        const cardElement = elements?.getElement(CardElement);

        const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: name
                }
            }
        })

        if (setupIntent && setupIntent.status === 'succeeded') {
            createSubscription(setupIntent.payment_method);
        } else {
            toast.error(`Payment failed: ${error?.message}`, {
                position: "bottom-right"
            });
            setSucceeded(false);
            setProcessing(false);
            setTimeout(() => {
                router.reload(window.location.pathname)
            }, 2000);
        }
    };

    const createSubscription = async (paymentMethodId: any) => {
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/subscription/create`, { paymentMethodId: paymentMethodId, plan_id: props?.plan_id })
            .then(
                response => {
                    if (response.success && mounted.current) {
                        setSucceeded(true);
                        loadUser();
                        router.push(`/checkout/success/${props?.plan_id}`);
                    } else {
                        toast.error(response?.message, {
                            position: "bottom-right"
                        });
                    }
                    setProcessing(false);
                },
                error => {
                    toast.error(error, {
                        position: "bottom-right"
                    });
                }
            );
    };

    const updateSubscription = (paymentMethodId: any, plan_id: any) => {
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/subscription/update`, { paymentMethodId: paymentMethodId, plan_id: plan_id })
            .then(
                response => {
                    if (response.success && mounted.current) {
                        toast.success(response?.message, {
                            position: "bottom-right"
                        });
                        loadUser();
                        router.push(`/checkout/success/${plan_id}`)
                    } else {
                        toast.error(response?.message, {
                            position: "bottom-right"
                        });
                        if (in_array(response?.status_code, ["requires_action", "requires_payment_method"])) {
                            loadUser();
                            router.push('/user/subscription');
                        }
                    }
                    setProcessing(false);
                },
                error => {
                    toast.error(error, {
                        position: "bottom-right"
                    });
                    setProcessing(false);
                }
            );
    }

    return (
        <>
            {props?.payment_methods?.length > 0 && (
                <PaymentMethods screen={'checkout-page'} />
            )}

            <form onSubmit={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                if (props?.payment_methods?.length === 0) {
                    if (card && name) {
                        handleSubmit();
                    }
                } else {
                    setProcessing(true);
                    if (action?.name === 'payment-method' && action?.id !== undefined && user?.subscription?.plan?.id !== undefined && user?.subscription?.plan?.ltd === 0) {
                        updateSubscription(action?.id, props?.plan_id)
                    } else if (action?.name === 'payment-method' && action?.id !== undefined) {
                        createSubscription(action?.id);
                    }
                }
            }} style={{ width: '100%' }}>

                {props?.payment_methods?.length === 0 && (
                    <>
                        <div className="wf-form-group wf-form-group--fluid mb-0">
                            <div className="wf-form-group__title">Cardholder name</div>
                            <div className="wf-textfield wf-textfield--large wf-textfield--fluid mr-4">
                                <input type="text" className="wf-textfield__input" placeholder="Enter card holder full name..." onChange={(e: any) => {
                                    setName(e?.target?.value);
                                }} />
                                <div className="wf-textfield__backdrop"></div>
                            </div>
                        </div>

                        <div className="wf-form-group wf-form-group--fluid mb-0">
                            <div className="wf-form-group__title">Card details</div>
                            <CardElement
                                onReady={() => {
                                    console.log("CardElement [ready]");
                                }}
                                onChange={event => {
                                    setCard(event?.complete);
                                    console.log("CardElement [change]", event);
                                }}
                                onBlur={() => {
                                    console.log("CardElement [blur]");
                                }}
                                onFocus={() => {
                                    console.log("CardElement [focus]");
                                }}
                                options={element_options}

                            />
                        </div>
                    </>
                )}

                {user?.subscription?.plan?.id === undefined && Number(user?.subscription?.total_subscriptions) === 0 ? (
                    <button disabled={!stripe} className={`wf-button wf-button--large wf-button--fluid wf-button--primary ${(!card || !name) && 'wf-button--disabled'} ${processing && 'wf-button--loading'} mt-12`}>
                        <div className="wf-button__content">
                            <div className="wf-button__text">Start {user?.subscription?.trial_days} Day Free Trial</div>
                        </div>
                        <div className="wf-button__loading">
                            <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 19 17">
                                <circle className="loading__circle" cx="2.2" y="10" r="1.6" ></circle>
                                <circle className="loading__circle" cx="9.5" cy="10" r="1.6" ></circle>
                                <circle className="loading__circle" cx="16.8" y="10" r="1.6"></circle>
                            </svg>
                        </div>
                        <div className="wf-button__backdrop"></div>
                        <div className="wf-button__backdrop"></div>
                    </button>
                ) : (
                    <button className={`wf-button wf-button--large wf-button--fluid wf-button--primary ${processing && 'wf-button--loading'} mt-12`}>
                        <div className="wf-button__content">
                            <div className="wf-button__text">{user?.subscription?.plan?.id === undefined && Number(user?.subscription?.total_subscriptions) > 0 ? 'Upgrade my plan' : 'Change my plan'}</div>
                        </div>
                        <div className="wf-button__loading">
                            <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 19 17">
                                <circle className="loading__circle" cx="2.2" y="10" r="1.6" ></circle>
                                <circle className="loading__circle" cx="9.5" cy="10" r="1.6" ></circle>
                                <circle className="loading__circle" cx="16.8" y="10" r="1.6"></circle>
                            </svg>
                        </div>
                        <div className="wf-button__backdrop"></div>
                        <div className="wf-button__backdrop"></div>
                    </button>
                )}
            </form>

        </>
    );
};

const Index: NextPage = () => {

    const mounted = useRef(false);

    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || '');

    const [action, setAction] = useState<any>({});

    const router: any = useRouter();

    const { slug } = router.query;

    const { user, invoice, plan, updateAction } = useAuth();

    const [payment_methods, setPaymentMethods] = useState([]);

    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    useEffect(() => {
        loadPaymentMethods();
    }, []);

    const loadPaymentMethods = () => {
        setAction({ type: 'load' });
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/subscription/payment-methods`, {})
            .then(
                response => {
                    if (response.success && mounted.current) {
                        setPaymentMethods(response?.data?.payment_methods);
                    }
                    setAction({});
                },
                error => { }
            );
    }

    return (
        <Master>

            <Head>
                <title>Checkout | SystemLimited</title>
                <link rel="canonical" href="https://SystemLimited.io/" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="SystemLimited" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Checkout | SystemLimited" />
                <meta property="og:url" content="https://SystemLimited.io/" />
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`}/>
                <meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`}/>
                <meta property="og:image:width" content="1720" />
                <meta property="og:image:height" content="1000" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SystemLimited_io" />
                <meta name="twitter:title" content="Checkout | SystemLimited" />
                <meta name="twitter:creator" content="@SystemLimited_io" />
                <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                
                <link rel='dns-prefetch' href='//js.stripe.com' />
                <link rel='dns-prefetch' href='//fonts.googleapis.com' />
            </Head>

            <div className="wf-split-page__summary-btn" onClick={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                updateAction({ name: 'split-sidebar-page' });
            }}>
                {
                    (() => {
                        if ((user?.subscription?.plan?.id === undefined && Number(user?.subscription?.total_subscriptions) === 0) || user?.subscription?.subscription?.stripe_status === 'trialing')
                            return `Summary ($0)`
                        else if (user?.subscription?.plan?.id === undefined && Number(user?.subscription?.total_subscriptions) > 0)
                            return `Summary ($${plan?.months > 1 ? `${plan?.price}` : `${plan?.price}`})`
                        else if (user?.subscription?.plan?.id !== undefined && user?.subscription?.subscription?.stripe_status !== 'trialing' && Number(user?.subscription?.total_subscriptions) > 0 && invoice?.current_date !== undefined)
                            return `Summary ($${invoice?.current_date === invoice?.next_bill_at ? `${invoice?.amount}` : 0})`
                    })()
                }
            </div>

            <div className="wf-split-page__heading mt-64">
                <div className="wf-split-page__heading__title">Card details</div>
                <div></div>
            </div>

            <div className="wf-split-page__form mt-32">

                {action?.type === 'load' ? (
                    <div className="wf-web-list wf-web-list--result">
                        <div className="wf-load-more">
                            <svg className="spinit" view-box="0 0 50 50">
                                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4"></circle>
                            </svg>
                        </div>
                    </div>
                ) : (
                    <>
                        <Elements stripe={stripePromise}>
                            <CardForm plan_id={slug?.[0]} payment_methods={payment_methods} />
                        </Elements>

                        {
                            (() => {
                                if ((user?.subscription?.plan?.id === undefined && Number(user?.subscription?.total_subscriptions) === 0) || user?.subscription?.subscription?.stripe_status === 'trialing')
                                    return <div className="wf-split-page__heading__sub"><span className="SystemLimited-icon SystemLimited-icon-tick"></span> Easily cancel before {user?.subscription?.trial_days_end} and you won't be charged at all!.</div>
                                else if (user?.subscription?.plan?.id === undefined && Number(user?.subscription?.total_subscriptions) > 0)
                                    return <div className="wf-split-page__heading__sub"><span className="SystemLimited-icon SystemLimited-icon-tick"></span> You are reactivating your account at {plan?.months > 1 ? `$${plan?.price}/year` : `$${plan?.price}/month`} starting from today.</div>
                                else if (user?.subscription?.plan?.id !== undefined && user?.subscription?.subscription?.stripe_status !== 'trialing' && Object.keys(invoice)?.length > 0)
                                    return <div className="wf-split-page__heading__sub"><span className="SystemLimited-icon SystemLimited-icon-tick"></span> You will be charged ${invoice?.current_date === invoice?.next_bill_at ? `${invoice?.amount}` : 0} now for changing to {invoice?.plan?.name} plan, and {invoice?.plan?.months > 1 ? `$${invoice?.plan?.price}/year` : `$${invoice?.plan?.price}/month`} for next billing cycle.</div>
                            })()
                        }

                        <div className="wf-split-page__form__security">
                            <div className="wf-split-page__form__cards">
                                <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/cards/mastercard.svg`} alt="" />
                                <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/cards/visa.svg`} alt="" />
                                <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/cards/amex.svg`} alt="" />
                                <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/cards/unionpay.svg`} alt="" />
                            </div>
                            <div className="wf-split-page__form__secure">
                                <span className="SystemLimited-icon SystemLimited-icon-secure"></span>
                                Your details are secure
                            </div>
                        </div>
                    </>
                )}
            </div>

        </Master>
    )
}

export default Index

export async function getServerSideProps({ query }: any) {

    if (query.slug?.[0] === undefined) {
        return {
            notFound: true,
        };
    }

    return {
        props: {},
    };
}