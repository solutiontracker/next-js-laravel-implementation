import React, { ReactElement, FC, useEffect, useState, useRef } from "react";
import Slider from '@mui/material/Slider';
import { service } from 'services/service'
import { toast } from 'react-toastify';
import { useAuth } from 'context/auth-provider';
import { capitalize } from 'helpers';
import { useRouter } from 'next/router';
import ActiveLink from 'components/widgets/active-link';
import PaymentMethods from 'components/user/subscription/payment-methods';
import { confirmAlert } from 'react-confirm-alert'; // Import
import { in_array } from 'helpers/helper';

const ActiveSubscriptions: FC<any> = (props: any): ReactElement => {

    const _isMounted = useRef(true);

    const [recharge, setRecharge] = useState('');

    const [payment_method, setPaymentMethod] = useState('');

    const [balance, setBalance] = useState(10);

    const [_action, setAction] = useState<any>({});

    const { user, loadUser, updateAction, action } = useAuth();

    const router: any = useRouter();

    const { query } = router.query;

    const prices = [
        {
            value: 1,
            label: '$10',
        },
        {
            value: 2,
            label: '$25',
        },
        {
            value: 3,
            label: '$50',
        },
        {
            value: 4,
            label: '$100',
        },
        {
            value: 5,
            label: '$250',
        },
        {
            value: 6,
            label: '$500',
        },
        {
            value: 7,
            label: '$1000',
        },
        {
            value: 8,
            label: '$2000',
        },
        {
            value: 9,
            label: '$5000',
        }
    ];


    useEffect(() => {
        if (action?.name === 'payment-method') {
            setPaymentMethod(action?.id)
        }
    }, [action]);

    useEffect(() => {
        return () => {
            _isMounted.current = false;
        }
    }, []);

    const swapBalances: any = {
        1: 10,
        2: 25,
        3: 50,
        4: 100,
        5: 250,
        6: 500,
        7: 1000,
        8: 2000,
        9: 5000,
    };

    const onChangeBalance = (e: any) => {
        setBalance(swapBalances[e?.target?.value]);
    }

    const rechargeIt = (target: any) => {
        setAction({ type: 'recharge' });
        service.post(recharge === 'manual' ? `${process?.env?.NEXT_PUBLIC_API_URL}/user/subscription/recharge-balance` : `${process?.env?.NEXT_PUBLIC_API_URL}/user/account/update-auto-recharge`, { balance: balance, payment_method: payment_method })
            .then(
                response => {
                    if (_isMounted.current) {
                        if (response.success) {
                            toast.success(response?.message, {
                                position: "bottom-right"
                            });
                            loadUser();
                            setRecharge('');
                            if (props?.action === 'recharge-balance' || props?.action === 'auto-recharge') {
                                router.push('/user/subscription')
                            }
                        } else {
                            toast.error(response?.message, {
                                position: "bottom-right"
                            });
                            if (in_array(response.status_code, ["requires_action"])) {
                                loadUser();
                                setRecharge('');
                                router.push('/user/subscription');
                            }
                        }
                        setAction({});
                        if (target !== undefined && target !== null) {
                            target.classList.remove('wf-button--loading');
                            target.closest('.wf-button').classList.remove('wf-button--loading');
                        }
                    }
                },
                error => {
                    setAction({});
                    toast.error(error, {
                        position: "bottom-right"
                    });
                    if (target !== undefined && target !== null) {
                        target.classList.remove('wf-button--loading');
                        target.closest('.wf-button').classList.remove('wf-button--loading');
                    }
                }
            );
    }

    const updateSubscription = (plan_id: any) => {
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
                                <div className="wf-modal__head__main-name">Cancel Down-gradation</div>
                            </div>
                            <div className="wf-modal__content">
                                <div className="wf-form-group__title">Are you sure want to cancel your Down-gradation?</div>
                            </div>
                            <div className="wf-modal__actions">
                                <button className="wf-button wf-button--medium wf-button--primary" onClick={(e: any) => {
                                    e.target.classList.add('wf-button--loading');
                                    e.target.closest('.wf-button').classList.add('wf-button--loading');
                                    service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/subscription/update`, { plan_id: plan_id, swapOnly: 1 })
                                        .then(
                                            response => {
                                                if (_isMounted.current) {
                                                    onClose();
                                                    if (response.success) {
                                                        toast.success(response?.message, {
                                                            position: "bottom-right"
                                                        });
                                                        loadUser();
                                                    } else {
                                                        toast.error(response?.message, {
                                                            position: "bottom-right"
                                                        });
                                                    }
                                                    e.target.classList.remove('wf-button--loading');
                                                    e.target.closest('.wf-button').classList.remove('wf-button--loading');
                                                }
                                            },
                                            error => {
                                                onClose();
                                                e.target.classList.remove('wf-button--loading');
                                                e.target.closest('.wf-button').classList.remove('wf-button--loading');
                                                toast.error(error, {
                                                    position: "bottom-right"
                                                });
                                            }
                                        );
                                }}>
                                    <div className="wf-button__content">
                                        <span className="wf-button__text">Cancel down-gradation</span>
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
        if (balance === 0) {
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
                                    <div className="wf-modal__head__main-name">Auto-Recharge</div>
                                </div>
                                <div className="wf-modal__content">
                                    <div className="wf-form-group__title">Are you sure want to disable your auto recharge?</div>
                                </div>
                                <div className="wf-modal__actions">
                                    <button className="wf-button wf-button--medium wf-button--destructive" onClick={(e: any) => {
                                        e.target.classList.add('wf-button--loading');
                                        e.target.closest('.wf-button').classList.add('wf-button--loading');
                                        setRecharge('off');
                                        rechargeIt(e.target);
                                        setTimeout(() => {
                                            onClose();
                                        }, 3000);
                                    }}>
                                        <div className="wf-button__content">
                                            <span className="wf-button__text">Disable</span>
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
    }, [balance]);

    useEffect(() => {
        if (props?.action === 'recharge-balance') {
            setRecharge('manual');
        } else if (props?.action === 'auto-recharge') {
            setRecharge('auto');
        }
    }, [props]);

    useEffect(() => {
        if (action?.name === 'add-payment-method') {
            setRecharge('');
        } else if (action?.name === 'recharge-balance') {
            setRecharge('manual');
        }
    }, [action]);

    useEffect(() => {
        if (query === "cancel-down-degradation" && user?.subscription?.previous_subscription?.plan_from !== undefined) {
            updateSubscription(user?.subscription?.previous_subscription?.plan_from?.id)
        }
    }, [query, user]);

    return (
        <>
            <div className="wf-page--settings__wrapper__title" id="active-subscription">
                Subscriptions and Billing
            </div>
            {user?.subscription?.plan !== undefined ? (
                <>
                    <div className="wf-page--settings__wrapper__sub-title mt-20">
                        Active Subscriptions
                    </div>
                    <div className="wf-subscriptions mt-20">
                        <div className="wf-subscriptions__single">
                            {user?.subscription?.plan && (
                                <>
                                    <div className="wf-subscriptions__single__wrapper">
                                        <div className="wf-subscriptions__details">
                                            {user?.subscription?.plan?.ltd === 0 ? (
                                                <>
                                                    {user?.subscription?.previous_subscription?.plan_from !== undefined ? (
                                                        <div className="wf-subscriptions__title Heading">
                                                            {capitalize(user?.subscription?.previous_subscription?.plan_from?.alias)} Plan
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {user?.subscription?.plan?.alias && (
                                                                <div className="wf-subscriptions__title Heading">
                                                                    {capitalize(user?.subscription?.plan?.alias)} Plan
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                    <div className="wf-subscriptions__status mt-8">
                                                        {user?.subscription?.previous_subscription?.plan_from !== undefined ? (
                                                            <>
                                                                {Number(user?.subscription?.previous_subscription?.plan_from?.months) === 1 ? (
                                                                    <span className="wf-badge">${user?.subscription?.previous_subscription?.plan_from?.price} / Month</span>
                                                                ) : (
                                                                    <span className="wf-badge">${user?.subscription?.previous_subscription?.plan_from?.price} / Year</span>
                                                                )}
                                                                <span className="wf-badge wf-badge--success">Active</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {Number(user?.subscription?.plan?.months) === 1 ? (
                                                                    <span className="wf-badge">${user?.subscription?.plan?.price} / Month</span>
                                                                ) : (
                                                                    <span className="wf-badge">${user?.subscription?.plan?.price} / Year</span>
                                                                )}
                                                                {
                                                                    (() => {
                                                                        if (user?.subscription?.subscription?.stripe_status === 'trialing')
                                                                            return (
                                                                                <span className="wf-badge wf-badge--warning">
                                                                                    Trial
                                                                                </span>
                                                                            )
                                                                        else if (user?.subscription?.subscription?.stripe_status === 'past_due')
                                                                            return (
                                                                                <span className="wf-badge wf-badge--critical">
                                                                                    Past Due
                                                                                </span>
                                                                            )
                                                                        else
                                                                            return (
                                                                                <span className="wf-badge wf-badge--success">
                                                                                    {capitalize(user?.subscription?.subscription?.stripe_status)}
                                                                                </span>
                                                                            )
                                                                    })()
                                                                }
                                                            </>
                                                        )}
                                                    </div>

                                                    {user?.subscription?.previous_subscription?.plan_from !== undefined ? (
                                                        <div className="wf-subscriptions__sub mt-8">
                                                            <b>It lets you add </b>
                                                            {Number(user?.subscription?.previous_subscription?.plan_from?.websites) === 0 ? (
                                                                <>&infin; Unlimited pro Website.</>
                                                            ) : (
                                                                <>{user?.subscription?.previous_subscription?.plan_from?.websites} Pro Website.</>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="wf-subscriptions__sub mt-8">
                                                            <b>It lets you add </b>
                                                            {Number(user?.subscription?.plan?.websites) === 0 ? (
                                                                <>&infin; Unlimited pro Website.</>
                                                            ) : (
                                                                <>{user?.subscription?.plan?.websites} Pro Website.</>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="wf-subscriptions__sub text-color--subdued mt-4">
                                                        <b>Next Billing Date: {user?.subscription?.current_period_end}</b>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {user?.subscription?.plan?.name && (
                                                        <div className="wf-subscriptions__title Heading">
                                                            {capitalize(user?.subscription?.plan?.name)} Plan
                                                        </div>
                                                    )}
                                                    <div className="wf-subscriptions__status mt-8">
                                                        <span className="wf-badge wf-badge--success">Active</span>
                                                    </div>
                                                    <div className="wf-subscriptions__sub mt-8">
                                                        <b>It lets you add </b>
                                                        {Number(user?.subscription?.plan?.websites) === 0 ? (
                                                            <>&infin; Unlimited pro Website.</>
                                                        ) : (
                                                            <>{user?.subscription?.plan?.websites} Pro Website.</>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="wf-subscriptions__action">
                                            <button className="wf-button wf-button--medium" onClick={() => router.push('/pricing')}>
                                                <div className="wf-button__content">
                                                    <div className="wf-button__text">Change</div>
                                                </div>
                                                <div className="wf-button__backdrop"></div>
                                            </button>
                                        </div>

                                    </div>

                                    <div className="wf-subscriptions__single__wrapper">
                                        {user?.subscription?.previous_subscription?.plan_from !== undefined && (
                                            <div className="wf-alert wf-alert--informational wf-alert--fluid mt-12">
                                                <div className="wf-alert__ribbon">
                                                    <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                                </div>
                                                <div className="wf-alert__content-wrapper">
                                                    <div className="wf-alert__content">You're {capitalize(user?.subscription?.previous_subscription?.plan_from?.alias)} plan will be down-graded to Base ({capitalize(user?.subscription?.previous_subscription?.plan_to?.alias)} plan) on next billing cycle.  –&#160;
                                                        <button className={`wf-button wf-button--slim ${_action?.type === 'cancel-downgradation' && 'wf-button--loading'}`} onClick={() => {
                                                            updateSubscription(user?.subscription?.previous_subscription?.plan_from?.id)
                                                        }}>
                                                            <div className="wf-button__content">
                                                                <span className="wf-button__text">Cancel Down-gradation</span>
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
                                        )}
                                        {user?.subscription?.subscription?.ends_at !== null && user?.subscription?.subscription?.ends_at !== undefined && (
                                            <div className="wf-alert wf-alert--informational wf-alert--fluid mt-12">
                                                <div className="wf-alert__ribbon">
                                                    <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                                </div>
                                                <div className="wf-alert__content-wrapper">
                                                    <div className="wf-alert__content">You have cancelled your subscription, and resume it till <b>{user?.subscription?.current_period_end}</b>  –&#160;
                                                        <button className={`wf-button wf-button--slim`} onClick={() => {
                                                            updateAction({ name: 'resume-subscription', product_id: user?.subscription?.subscription?.name });
                                                        }}>
                                                            <div className="wf-button__content">
                                                                <span className="wf-button__text">Stop cancellation</span>
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
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="wf-subscriptions__single">
                            {user?.subscription?.plan && (
                                <>
                                    <div className="wf-subscriptions__single__wrapper">
                                        <div className="wf-subscriptions__details">
                                            <div className="wf-subscriptions__title Heading">
                                                SystemLimited CDN
                                            </div>
                                            <div className="wf-subscriptions__status mt-8">
                                                <span className="wf-badge">Current Balance: <b>${user?.balance}</b></span>
                                                <span className={`wf-badge ${Number(user?.cdn_active) === 1 ? 'wf-badge--success' : 'wf-badge--critical'}`}>{Number(user?.cdn_active) === 1 ? 'Active' : 'Suspended'}</span>
                                            </div>
                                            <div className="wf-subscriptions__sub mt-8">
                                                <b>{(user?.subscription?.plan?.cdn_premium_bandwidth + user?.subscription?.plan?.cdn_volume_bandwidth)} GBs/month</b> of Free CDN Bandwidth include with {capitalize(user?.subscription?.plan?.alias)} Plan.
                                            </div>
                                        </div>
                                        <div className="wf-subscriptions__action">
                                            <button className="wf-button wf-button--medium" onClick={() => {
                                                setRecharge('manual');
                                            }}>
                                                <div className="wf-button__content">
                                                    <div className="wf-button__text">Recharge</div>
                                                </div>
                                                <div className="wf-button__backdrop"></div>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="wf-subscriptions__single__footer">
                                        <div className="wf-toggler">
                                            <div className="wf-toggler__title wf-toggler__title--duo">
                                                <div className="wf-toggler__title__details">
                                                    {user?.auto_recharge > 0 ? (
                                                        <div className="HeadingSmall">Auto-Recharge is <b>Enabled</b></div>
                                                    ) : (
                                                        <div className="HeadingSmall">Auto-Recharge is <b>Disabled</b></div>
                                                    )}
                                                    <span className="text-color--subdued">Automatically recharge your account when your balance gets low and never worry about billing again.</span>
                                                </div>
                                            </div>
                                            {user?.auto_recharge > 0 ? (
                                                <button className="wf-button wf-button--slim" onClick={() => {
                                                    setBalance(0);
                                                }}>
                                                    <div className="wf-button__content">
                                                        <span className="wf-button__text">Disable</span>
                                                    </div>
                                                </button>
                                            ) : (
                                                <button className="wf-button wf-button--primary wf-button--slim" onClick={() => {
                                                    setRecharge('auto');
                                                }}>
                                                    <div className="wf-button__content">
                                                        <span className="wf-button__text">Enable</span>
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="wf-page--settings__wrapper__empty text-color--subdued mt-32">
                    You have no active subscriptions.
                    <ActiveLink activeClassName="" href="/pricing">
                        <a className="">Get started with a suitable plan.</a>
                    </ActiveLink>
                </div>
            )}

            {(recharge === 'auto' || recharge === 'manual') && (
                <div className="wf-modal">
                    <div className="wf-modal__modal-wrapper wf-modal--big-modal">
                        <div className="wf-modal__close" onClick={() => {
                            setRecharge('');
                            if (props?.action === 'recharge-balance' || props?.action === 'auto-recharge') {
                                router.push('/user/subscription')
                            }
                            if (action?.name === "recharge-balance") {
                                updateAction({});
                            }
                        }}>
                            <span className="SystemLimited-icon SystemLimited-icon-cancel"></span>
                        </div>
                        <div className="wf-modal__head">
                            <div className="wf-modal__head__main-name">
                                {recharge === 'auto' ? (
                                    <>Enable auto-recharge</>
                                ) : (
                                    <>Recharge CDN balance</>
                                )}
                            </div>
                        </div>
                        <div className="wf-modal__content">
                            <>
                                <div className='wf-modal__content__title mb-20'>
                                    1. Select amount
                                </div>
                                <Slider
                                    aria-label="Account recharge"
                                    defaultValue={1}
                                    step={null}
                                    min={1}
                                    max={9}
                                    marks={prices}
                                    onChange={onChangeBalance}
                                    sx={{
                                        width: 'calc(100% - 24px)',
                                        display: 'block',
                                        margin: '0px auto 20px',
                                        color: '#2C6ECB',
                                        '& .MuiSlider-mark': {
                                            height: '12px',
                                            width: '1px',
                                        },
                                        '& .MuiSlider-markActive': {
                                            backgroundColor: '#2C6ECB',
                                        },
                                        '& .MuiSlider-track': {
                                            borderRadius: '0px',
                                        },
                                        '& .MuiSlider-markLabel': {
                                            color: '#6D7175',
                                            fontSize: '13px',
                                        },
                                        '& .MuiSlider-markLabelActive': {
                                            color: '#2C6ECB',
                                        }
                                    }}
                                />

                                {recharge === 'auto' && (
                                    <>
                                        <div className="clearfix"></div>
                                        <div className="wf-modal__content__sub mt-12">Recharge <b>${balance}</b> when balance drops below <b>${(20 / 100) * balance}</b></div>
                                    </>
                                )}
                            </>
                        </div>
                        <div className="wf-modal__content">
                            <div className='wf-modal__content__title mb-20'>
                                2. Select payment method
                            </div>
                            <PaymentMethods screen={'cdn-recharge'} />
                        </div>
                        <div className="wf-modal__actions">
                            <div className="wf-button-group">
                                <button className={`wf-button wf-button--medium wf-button--primary ${_action?.type === 'recharge' && 'wf-button--loading'}`} onClick={(e: any) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    rechargeIt(e.target)
                                }}>
                                    <div className="wf-button__content">
                                        <span className="wf-button__text">
                                            {recharge === 'auto' ? (
                                                <>Enable auto-recharge</>
                                            ) : (
                                                <>Pay ${balance}</>
                                            )}
                                        </span>
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
                </div>
            )}
        </>
    )
}

export default ActiveSubscriptions
