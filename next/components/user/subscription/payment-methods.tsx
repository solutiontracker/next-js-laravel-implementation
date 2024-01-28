import { loadStripe } from '@stripe/stripe-js';
import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
import React, { ReactElement, FC, useEffect, useState, useRef } from "react";
import { service } from 'services/service'
import { useAuth } from 'context/auth-provider';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert'; // Import
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

    const [name, setName] = useState('');

    const [card, setCard] = useState(false);

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
                error => { }
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
            createPaymentMethod(setupIntent.payment_method);
        } else {
            toast.error(`Payment failed: ${error?.message}`, {
                position: "bottom-right"
            });
            setSucceeded(false);
            setProcessing(false);
        }
    };

    const createPaymentMethod = async (paymentMethodId: any) => {
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/subscription/create-payment-method`, { paymentMethodId: paymentMethodId })
            .then(
                response => {
                    if (response.success && mounted.current) {
                        setSucceeded(true);
                        props?.cancel();
                    } else {
                        toast.error(response?.message, {
                            position: "bottom-right"
                        });
                    }
                    setProcessing(false);
                },
                error => { }
            );
    };

    return (
        <div style={{ width: '100%' }}>
            <div className="wf-modal__content" onClick={(ev: any) => { ev.stopPropagation(); }}>
                <h1>
                    {props?.order?.order_detail?.order?.grand_total_display}
                </h1>

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
            </div>

            <div className="wf-modal__actions">
                <div className="wf-button-group">
                    <button onClick={(ev: any) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        if (card && name) {
                            handleSubmit();
                        }
                    }} disabled={!stripe} className={`wf-button wf-button--medium wf-button--primary ${(!card || !name) && 'wf-button--disabled'} ${processing && 'wf-button--loading'}`}>
                        <div className="wf-button__content">
                            <div className="wf-button__text">Add card</div>
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
                </div>
            </div>

        </div>
    );
};

const PaymentMethods: FC<any> = (props: any): ReactElement => {

    const mounted = useRef(false);

    const { updateAction, action } = useAuth();

    const [payment_methods, setPaymentMethods] = useState([]);

    const [default_payment_method, setDefaultPaymentMethod] = useState<any>({});

    const [popup, setPopup] = useState(false);

    const [selected, setSelected] = useState('');

    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || '');

    const [counter, setCounter] = useState<number>(0);

    const [_action, setAction] = useState<any>({});

    const router: any = useRouter();

    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    useEffect(() => {
        setAction({ type: 'load' });
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/subscription/payment-methods`, {})
            .then(
                response => {
                    if (response.success && mounted.current) {
                        setPaymentMethods(response?.data?.payment_methods);
                        setDefaultPaymentMethod(response?.data?.default_payment_method);
                        setSelected(response?.data?.default_payment_method?.id);
                    } else {
                        toast.error(response?.message, {
                            position: "bottom-right"
                        });
                    }
                    setAction({});
                },
                error => {
                    toast.error(error, {
                        position: "bottom-right"
                    });
                    setAction({});
                }
            );
    }, [counter]);

    const cancel = () => {
        setPopup(false);
        setCounter(counter + 1);
        if (action?.name === "add-payment-method" && action?.screen === "cdn-recharge") {
            updateAction({ name: 'recharge-balance' });
        }
        if (props?.action === 'add-payment-method') {
            router.push('/user/subscription')
        }
    }

    const _delete = (paymentMethodId: any) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="wf-modal">
                        <div className="wf-modal__modal-wrapper">
                            <div className="wf-modal__close" onClick={() => {
                                onClose();
                            }}>
                                <span className="SystemLimited-icon SystemLimited-icon-cancel"></span>
                            </div>
                            <div className="wf-modal__head">
                                <div className="wf-modal__head__main-name">Delete payment method</div>
                            </div>
                            <div className="wf-modal__content">
                                <div className="wf-form-group__title">Are you sure want to delete this payment method?</div>
                            </div>
                            <div className="wf-modal__actions">
                                <button className="wf-button wf-button--medium wf-button--destructive" onClick={(e: any) => {
                                    e.target.classList.add('wf-button--loading');
                                    e.target.closest('.wf-button').classList.add('wf-button--loading');
                                    service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/subscription/delete-payment-method`, { paymentMethodId: paymentMethodId })
                                        .then(
                                            response => {
                                                onClose();
                                                if (response.success && mounted.current) {
                                                    setCounter(counter + 1);
                                                } else {
                                                    toast.error(response?.message, {
                                                        position: "bottom-right"
                                                    });
                                                }
                                                e.target.classList.remove('wf-button--loading');
                                                e.target.closest('.wf-button').classList.remove('wf-button--loading');
                                            },
                                            error => {
                                                e.target.classList.remove('wf-button--loading');
                                                e.target.closest('.wf-button').classList.remove('wf-button--loading');
                                                toast.error(error, {
                                                    position: "bottom-right"
                                                });
                                            }
                                        );
                                }}>
                                    <div className="wf-button__content">
                                        <span className="wf-button__text">Delete</span>
                                    </div>
                                    <div className="wf-button__loading">
                                        <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 19 17">
                                            <circle className="loading__circle" cx="2.2" cy="10" r="1.6" />
                                            <circle className="loading__circle" cx="9.5" cy="10" r="1.6" />
                                            <circle className="loading__circle" cx="16.8" cy="10" r="1.6" />
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }
        });
    }

    const _makeDefault = (paymentMethodId: any) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="wf-modal">
                        <div className="wf-modal__modal-wrapper">
                            <div className="wf-modal__close" onClick={() => {
                                onClose();
                            }}>
                                <span className="SystemLimited-icon SystemLimited-icon-cancel"></span>
                            </div>
                            <div className="wf-modal__head">
                                <div className="wf-modal__head__main-name">Make default payment method</div>
                            </div>
                            <div className="wf-modal__content">
                                <div className="wf-form-group__title">Are you sure want to make this default payment method?</div>
                            </div>
                            <div className="wf-modal__actions">
                                <button className="wf-button wf-button--medium wf-button--primary" onClick={(e: any) => {
                                    e.target.classList.add('wf-button--loading');
                                    e.target.closest('.wf-button').classList.add('wf-button--loading');
                                    service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/subscription/make-default-payment-method`, { paymentMethodId: paymentMethodId })
                                        .then(
                                            response => {
                                                onClose();
                                                if (response.success && mounted.current) {
                                                    setCounter(counter + 1);
                                                } else {
                                                    toast.error(response?.message, {
                                                        position: "bottom-right"
                                                    });
                                                }
                                                e.target.classList.remove('wf-button--loading');
                                                e.target.closest('.wf-button').classList.remove('wf-button--loading');
                                            },
                                            error => {
                                                e.target.classList.remove('wf-button--loading');
                                                e.target.closest('.wf-button').classList.remove('wf-button--loading');
                                                toast.error(error, {
                                                    position: "bottom-right"
                                                });
                                            }
                                        );
                                }}>
                                    <div className="wf-button__content">
                                        <span className="wf-button__text">Confirm</span>
                                    </div>
                                    <div className="wf-button__loading">
                                        <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 19 17">
                                            <circle className="loading__circle" cx="2.2" cy="10" r="1.6" />
                                            <circle className="loading__circle" cx="9.5" cy="10" r="1.6" />
                                            <circle className="loading__circle" cx="16.8" cy="10" r="1.6" />
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }
        });
    }

    useEffect(() => {
        updateAction({ name: 'payment-method', id: selected });
    }, [selected]);

    useEffect(() => {
        if (action?.name === "add-payment-method") {
            setPopup(true);
        }
    }, [action]);

    return (
        <>
            {in_array(props?.screen, ['cdn-recharge', 'checkout-page']) ? (
                <div className="wf-cards-list">
                    {_action?.type === 'load' ? (
                        <div className="wf-web-list wf-web-list--result">
                            <div className="wf-load-more">
                                <svg className="spinit" view-box="0 0 50 50">
                                    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4"></circle>
                                </svg>
                            </div>
                        </div>
                    ) : (
                        <>
                            {payment_methods?.map((payment_method: any, key: any) =>
                                <div onClick={() => {
                                    setSelected(payment_method?.id);
                                }} className={`wf-cards-list__single ${selected === payment_method?.id && 'wf-cards-list__single--active'}`} key={key}>
                                    <div className="wf-cards-list__details">
                                        <div className="wf-cards-list__icon">
                                            <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/cards/${payment_method?.card?.brand}.svg`} alt="" />
                                        </div>
                                        <div className="wf-cards-list__title">
                                            <div className="wf-cards-list__main-title">
                                                Ending in {payment_method?.card?.last4}
                                                {default_payment_method?.id != payment_method?.id}
                                                {default_payment_method?.id === payment_method?.id && (
                                                    <span className="wf-badge wf-badge--success">default</span>
                                                )}
                                            </div>
                                            <div className="wf-cards-list__sub-title">
                                                {payment_method?.card?.brand.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="SystemLimited-icon SystemLimited-icon-circle-tick"></span>
                                </div>
                            )}
                            <div className="wf-button-group">
                                <button className="wf-button wf-button--large wf-button--fluid" onClick={(e: any) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateAction({ name: 'add-payment-method', screen: props?.screen });
                                }}>
                                    <div className="wf-button__content">
                                        <span className="wf-button__text">Add a new card</span>
                                    </div>
                                    <div className="wf-button__loading">
                                        <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 19 17">
                                            <circle className="loading__circle" cx="2.2" cy="10" r="1.6" />
                                            <circle className="loading__circle" cx="9.5" cy="10" r="1.6" />
                                            <circle className="loading__circle" cx="16.8" cy="10" r="1.6" />
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <>
                    <div className="wf-toggler mt-20" id="payment-methods">
                        <div className="wf-toggler__title wf-toggler__title--duo">
                            <div className="wf-toggler__title__details">
                                <div className="Heading">Payment Methods</div>
                            </div>
                        </div>
                        <div className="wf-button-group">
                            <button className="wf-button wf-button--medium" onClick={() => {
                                setPopup(true);
                            }}>
                                <div className="wf-button__content">
                                    <span className="SystemLimited-icon SystemLimited-icon-plus mr-4"></span>
                                    <span className="wf-button__text">Add New</span>
                                </div>
                                <div className="wf-button__loading">
                                    <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 19 17">
                                        <circle className="loading__circle" cx="2.2" cy="10" r="1.6" />
                                        <circle className="loading__circle" cx="9.5" cy="10" r="1.6" />
                                        <circle className="loading__circle" cx="16.8" cy="10" r="1.6" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>

                    {_action?.type === 'load' ? (
                        <div className="wf-web-list wf-web-list--result">
                            <div className="wf-load-more">
                                <svg className="spinit" view-box="0 0 50 50">
                                    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4"></circle>
                                </svg>
                            </div>
                        </div>
                    ) : (
                        payment_methods?.map((payment_method: any, key: any) =>
                            <div className="wf-toggler mt-16">
                                <div className="wf-toggler__title wf-toggler__title--duo">
                                    <div className="wf-toggler__image wf-toggler__image--cards"><img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/cards/${payment_method?.card?.brand}.svg`} alt="" /></div>
                                    <div className="wf-toggler__title__details">
                                        <div className="Heading">{payment_method?.card?.brand.toUpperCase()} ending in {payment_method?.card?.last4}</div>
                                        <span className="text-color--subdued">Expires {payment_method?.card?.exp_month}/{payment_method?.card?.exp_year}</span>
                                    </div>
                                </div>
                                <div className="wf-button-group">
                                    {default_payment_method?.id != payment_method?.id && (
                                        <button className={`wf-button wf-button--slim wf-button--slim ${_action?.type === 'make-default' && _action?.id === payment_method?.id && 'wf-button--loading'}`} onClick={() => {
                                            _makeDefault(payment_method?.id)
                                        }}>
                                            <div className="wf-button__content">
                                                <span className="wf-button__text">Make Default</span>
                                            </div>
                                            <div className="wf-button__loading">
                                                <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 19 17">
                                                    <circle className="loading__circle" cx="2.2" cy="10" r="1.6" />
                                                    <circle className="loading__circle" cx="9.5" cy="10" r="1.6" />
                                                    <circle className="loading__circle" cx="16.8" cy="10" r="1.6" />
                                                </svg>
                                            </div>
                                        </button>
                                    )}
                                    <button className={`wf-button wf-button--slim wf-button--destructive-outline ${_action?.type === 'delete' && _action?.id === payment_method?.id && 'wf-button--loading'}`} onClick={() => {
                                        _delete(payment_method?.id)
                                    }}>
                                        <div className="wf-button__content">
                                            <span className="wf-button__text">Delete</span>
                                        </div>
                                        <div className="wf-button__loading">
                                            <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 19 17">
                                                <circle className="loading__circle" cx="2.2" cy="10" r="1.6" />
                                                <circle className="loading__circle" cx="9.5" cy="10" r="1.6" />
                                                <circle className="loading__circle" cx="16.8" cy="10" r="1.6" />
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </>
            )}

            {popup && (
                <div className="wf-modal" style={{ zIndex: 9999999 }}>
                    <div className="wf-modal__modal-wrapper wf-modal--big-modal">
                        <div className="wf-modal__close" onClick={() => {
                            cancel();
                        }}>
                            <span className="SystemLimited-icon SystemLimited-icon-cancel"></span>
                        </div>
                        <div className="wf-modal__head">
                            <div className="wf-modal__head__main-name">Add a new card</div>
                        </div>

                        <Elements stripe={stripePromise}>
                            <CardForm cancel={cancel} />
                        </Elements>
                    </div>
                </div>
            )}

        </>
    )
}

export default PaymentMethods
