import React, { useState, useEffect, useRef } from "react";
import { service } from 'services/service'
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useAuth } from 'context/auth-provider';

const Sidebar = () => {

    const [plan, setPlan] = useState<any>({});

    const mounted = useRef(false);

    const [_action, setAction] = useState<any>({ type: 'load-plan' });

    const router: any = useRouter();

    const [invoice, setInvoice] = useState<any>({});

    const { user, updateInvoice, updatePlan, action, updateAction, trial_days } = useAuth();

    const { slug } = router.query;

    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    useEffect(() => {
        if (router.asPath?.includes('checkout/success')) {
            subscriptionInvoice();
        } else if (slug?.[0] !== undefined && user?.subscription?.plan !== undefined && user?.subscription?.plan?.ltd === 0) {
            preview(slug?.[0]);
        }
    }, [slug, user]);

    useEffect(() => {
        if (slug?.[0] !== undefined) {
            getPlan(slug?.[0]);
        }
    }, [slug]);

    const getPlan = (plan_id: any) => {
        service.get(`${process?.env?.NEXT_PUBLIC_API_URL}/user/plan/${plan_id}`)
            .then(
                response => {
                    if (mounted.current) {
                        if (response.success) {
                            if (response?.data?.plan !== null) {
                                setPlan(response?.data?.plan);
                                updatePlan(response?.data?.plan);
                            } else {
                                router.push('/');
                            }
                        } else {
                            toast.error(response?.message, {
                                position: "bottom-right"
                            });
                        }
                        setAction({});
                    }
                },
                error => {
                    toast.error(error, {
                        position: "bottom-right"
                    });
                    setAction({});
                }
            );
    }

    const preview = (plan_id: any) => {
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/subscription/preview-invoice`, { plan_id: plan_id })
            .then(
                response => {
                    if (mounted.current) {
                        if (response.success) {
                            setInvoice(response?.data?.invoice);
                            updateInvoice(response?.data?.invoice);
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

    const subscriptionInvoice = () => {
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/subscription/latest-invoice`, {})
            .then(
                response => {
                    if (mounted.current) {
                        if (response.success) {
                            setInvoice(response?.data?.invoice);
                            updateInvoice(response?.data?.invoice);
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
        <div className={`wf-split-page__alt ${action?.name === 'split-sidebar-page' && 'wf-split-page__alt--show'}`}>
            <div className="wf-split-page__alt__close" onClick={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                updateAction({});
            }}>
                <span className="SystemLimited-icon SystemLimited-icon-mobile-cancel"></span>
            </div>
            {_action?.type !== 'load-plan' && (
                <div className="wf-split-page__wrapper">
                    {plan?.price !== undefined && (
                        <div className="wf-split-page__plan">
                            <div className="wf-split-page__plan__heading">
                                Summary
                            </div>
                            <div className="wf-split-page__plan__amount-wrapper">
                                {
                                    (() => {
                                        if ((user?.subscription?.plan?.id === undefined && Number(user?.subscription?.total_subscriptions) === 0) || user?.subscription?.subscription?.stripe_status === 'trialing')
                                            return (
                                                <>
                                                    <div className="wf-split-page__plan__amount">
                                                        $0
                                                    </div>
                                                    <div className="wf-split-page__plan__amount-sub">{trial_days} days free trial</div>
                                                </>
                                            )
                                        else if ((user?.subscription?.plan?.id === undefined && Number(user?.subscription?.total_subscriptions) > 0) || user?.subscription?.plan?.ltd === 1)
                                            return (
                                                <>
                                                    <div className="wf-split-page__plan__amount">
                                                        ${plan?.months > 1 ? `${plan?.price}` : `${plan?.price}`}
                                                    </div>
                                                </>
                                            )
                                        else if (user?.subscription?.plan?.id !== undefined && user?.subscription?.subscription?.stripe_status !== 'trialing' && Number(user?.subscription?.total_subscriptions) > 0 && invoice?.current_date !== undefined)
                                            return (
                                                <div className="wf-split-page__plan__amount">
                                                    ${invoice?.current_date === invoice?.next_bill_at ? `${invoice?.amount}` : 0}
                                                </div>
                                            )
                                    })()
                                }
                            </div>

                            <div className="wf-split-page__plan__divider"></div>
                            <div className="wf-split-page__plan__sub">
                                Your selected plan
                            </div>
                            <div className="wf-split-page__plan__title">
                                {plan?.name}
                            </div>
                            <div className="wf-split-page__plan__amount-sub">
                                {plan?.months > 1 ? `$${plan?.price}/year` : `$${plan?.price}/month`}&nbsp;
                                {((user?.subscription?.plan?.id === undefined && Number(user?.subscription?.total_subscriptions) === 0) || user?.subscription?.subscription?.stripe_status === 'trialing') && 'after trial period'}
                                {plan?.saving && plan?.months > 1 && (
                                    <>
                                        <br></br>
                                        Saving <b>${plan?.saving}</b> per year
                                    </>
                                )}
                            </div>
                            <div className="wf-split-page__plan__change">
                                <a onClick={(e: any) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    router.push('/pricing');
                                }}>Change plan</a>
                            </div>
                            <ul className="wf-split-page__plan__features">
                                <li>{`${plan?.websites === 0 ? 'Unlimited' : plan?.websites} ${plan?.websites === 1 ? 'Pro website' : 'Pro websites'}`}</li>
                                <li>All Pro Modules</li>
                                <li>{(plan?.cdn_premium_bandwidth + plan?.cdn_volume_bandwidth)} GBs CDN bandwidth</li>
                                <li>On the Fly Compression & WebP</li>
                                <li>24/7 Priority Support</li>
                                <li>Unlimited Free websites</li>
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Sidebar