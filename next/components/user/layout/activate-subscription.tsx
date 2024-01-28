import React, { ReactElement, FC, useEffect, useState, useRef } from "react";
import { useAuth } from 'context/auth-provider';
import { service } from 'services/service';
import ActiveLink from 'components/widgets/active-link';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
import { useRouter } from 'next/router';
import { in_array } from 'helpers/helper';

const CardForm: FC<any> = (props: any): ReactElement => {

    const { loadUser } = useAuth();

    const [paymentIntent, setPaymentIntent] = useState<any>({});

    const [processing, setProcessing] = useState(false);

    const stripe: any = useStripe();

    const elements = useElements();

    const [form, setForm] = useState(false);

    const [card, setCard] = useState(false);

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

    const [name, setName] = useState('');

    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    useEffect(() => {
        if (props?.action === "requires_payment_method") {
            setForm(true);
        } else {
            setForm(false);
        }
    }, [props]);

    //Incase of 3ds action required when using same card when payment failed
    useEffect(() => {
        if (Object.keys(paymentIntent)?.length > 0 && props?.action === 'requires_action') {
            handleSubmit(paymentIntent, form);
        }
    }, [paymentIntent]);

    useEffect(() => {
        service.get(`${process?.env?.NEXT_PUBLIC_API_URL}/user/subscription/payment-confirm/${props?.paymentIntent}`)
            .then(
                response => {
                    if (response.success && mounted.current) {
                        setPaymentIntent(response?.data);
                    } else {
                        toast.error(response?.message, {
                            position: "bottom-right"
                        });
                    }
                },
                error => { }
            );
    }, []);


    const handleSubmit = async (paymentIntent: any, form: any) => {

        setProcessing(true);

        // Confirm card setup
        const cardElement = elements?.getElement(CardElement);

        const { error, setupIntent } = await stripe.confirmCardPayment(paymentIntent?.paymentIntent?.client_secret, {
            payment_method: form ? {
                card: cardElement,
                billing_details: {
                    name: name
                }
            } : paymentIntent?.paymentIntent?.paymentIntent?.payment_method?.id
        })

        if (error) {
            toast.error(`Payment failed: ${error?.message}`, {
                position: "bottom-right"
            });
        } else {
            toast.success("Payment successfully", {
                position: "bottom-right"
            });
        }

        loadUser();

        props?.cancel();

        setProcessing(false);
    };

    return (
        <form onSubmit={(e: any) => {
            e.preventDefault();
            e.stopPropagation();
            if ((card && name && form) || !form) {
                if (Object.keys(paymentIntent)?.length > 0) {
                    handleSubmit(paymentIntent, form);
                }
            }
        }} style={{ width: '100%' }}>
            <div>
                {form && (
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
                        <div className="wf-form-group wf-form-group--fluid mt-12">
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
            </div>

            <button className={`wf-button wf-button--large wf-button--fluid wf-button--primary ${(!card || !name) && form && 'wf-button--disabled'} mt-12 ${processing && 'wf-button--loading'}`}>
                <div className="wf-button__content">
                    <div className="wf-button__text">Pay {paymentIntent?.amount}</div>
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

        </form>
    );
};

const ActivateSubscription = () => {

    const _isMounted = useRef(true);

    const { user, action, updateAction } = useAuth();

    const [popup, setPopup] = useState('');

    const router: any = useRouter();

    const { page } = router.query;

    useEffect(() => {
        if (in_array(page, ['confirm-cdn-payments', 'complete-cdn-payments', 'confirm-subscription-payments', 'complete-subscription-payments'])) {
            setPopup(page);
        }
    }, [page]);

    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || '');

    const cancel = () => {
        setPopup('');
    }

    useEffect(() => {
        return () => {
            _isMounted.current = false;
        }
    }, []);

    return (
        <>

            {user?.subscription?.last_payment_intent && (

                <>
                    <div className="wf-hellobar wf-hellobar--relative wf-hellobar--critical">
                        <div className='wf-hellobar__empty'></div>
                        <div className="wf-hellobar__content">
                            <span className="SystemLimited-icon SystemLimited-icon-risk"></span>
                            Our last attempted charge of ${(user?.subscription?.last_payment_intent?.amount / 100).toFixed(2)} for {user?.subscription?.plan?.name} ({user?.subscription?.plan?.months > 1 ? 'Yearly' : 'Monthly'}) was unsuccessful. Please pay as soon as possible to prevent from suspension –&#160;<a onClick={() => {
                                setPopup('confirm-subscription-payments');
                            }}>Pay now</a>&nbsp;or&nbsp;
                            <a onClick={() => {
                                setPopup('complete-subscription-payments');
                            }}>Update payment method</a>
                        </div>
                        <div className='wf-hellobar__empty'></div>
                    </div>
                    {in_array(popup, ['confirm-subscription-payments', 'complete-subscription-payments']) && (
                        <div className="wf-modal">
                            <div className="wf-modal__modal-wrapper wf-modal--big-modal">
                                <div className="wf-modal__close" onClick={(e: any) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setPopup('');
                                    updateAction({});
                                }}>
                                    <span className="SystemLimited-icon SystemLimited-icon-cancel"></span>
                                </div>
                                <div className="wf-modal__head">
                                    <div className="wf-modal__head__main-name">Make a payment</div>
                                </div>
                                <div className="wf-modal__content">
                                    <Elements stripe={stripePromise}>
                                        <CardForm cancel={cancel} paymentIntent={user?.subscription?.last_payment_intent?.id} action={popup === 'complete-subscription-payments' ? 'requires_payment_method' : user?.subscription?.last_payment_intent?.status} />
                                    </Elements>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {user?.last_cdn_payment_intent && (

                <>
                    <div className="wf-hellobar wf-hellobar--relative wf-hellobar--critical">
                        <div className='wf-hellobar__empty'></div>
                        <div className="wf-hellobar__content">
                            <span className="SystemLimited-icon SystemLimited-icon-risk"></span>
                            Our last attempted CDN charge ${(user?.last_cdn_payment_intent?.amount / 100).toFixed(2)} of was unsuccessful. Please pay as soon as possible to recharge your account –&#160;<a onClick={() => {
                                setPopup('confirm-cdn-payments');
                            }}>Pay now</a>&nbsp;or&nbsp;
                            <a onClick={() => {
                                setPopup('complete-cdn-payments');
                            }}>Update payment method</a>
                        </div>
                        <div className='wf-hellobar__empty'></div>
                    </div>
                    {in_array(popup, ['confirm-cdn-payments', 'complete-cdn-payments']) && (
                        <div className="wf-modal">
                            <div className="wf-modal__modal-wrapper wf-modal--big-modal">
                                <div className="wf-modal__close" onClick={(e: any) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setPopup('');
                                    updateAction({});
                                }}>
                                    <span className="SystemLimited-icon SystemLimited-icon-cancel"></span>
                                </div>
                                <div className="wf-modal__head">
                                    <div className="wf-modal__head__main-name">Make a payment</div>
                                </div>
                                <div className="wf-modal__content">
                                    <Elements stripe={stripePromise}>
                                        <CardForm cancel={cancel} paymentIntent={user?.last_cdn_payment_intent?.id} action={popup === 'complete-cdn-payments' ? 'requires_payment_method' : user?.last_cdn_payment_intent?.status} />
                                    </Elements>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {Number(user?.cdn_active) === 0 && user?.balance < 0 && (
                <div className="wf-hellobar wf-hellobar--relative wf-hellobar--critical">
                    <div className='wf-hellobar__empty'></div>
                    <div className="wf-hellobar__content">
                        <span className="SystemLimited-icon SystemLimited-icon-risk"></span>
                        CDN suspended due to negative balance –&#160;
                        <ActiveLink activeClassName="wf-footer__navigation__link--active" href="/user/subscription?action=recharge-balance">
                            <a>Recharge now</a>
                        </ActiveLink>
                    </div>
                    <div className='wf-hellobar__empty'></div>
                </div>
            )}
        </>
    )
}

export default ActivateSubscription
