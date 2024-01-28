import React, { useEffect, useState, useRef } from "react";
import { service } from 'services/service'
import { toast } from 'react-toastify';
import { useAuth } from 'context/auth-provider';
import { useRouter } from 'next/router';
import { confirmAlert } from 'react-confirm-alert'; // Import

const CancelSubscription = () => {

    const _isMounted = useRef(true);

    const [_action, setAction] = useState<any>({});

    const [counter, setCounter] = useState(0);

    const [subscriptions, setSubscriptions] = useState<any>([]);

    const router: any = useRouter();

    const { product } = router.query;

    const { action, loadUser } = useAuth();

    useEffect(() => {
        return () => {
            _isMounted.current = false;
        }
    }, []);

    useEffect(() => {
        if (action?.name === 'resume-subscription') {
            doAction('resume', action?.product_id, '', 0);
        }
    }, [action]);

    useEffect(() => {
        if (product !== undefined && product !== null) {
            doAction('resume', product, '', 0);
        }
    }, [product]);

    useEffect(() => {
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/subscription/get-all-subscriptions`, {})
            .then(
                response => {
                    if (_isMounted.current) {
                        if (response.success) {
                            setSubscriptions(response?.data?.subscriptions)
                        }
                    }
                },
                error => {
                    toast.error(error, {
                        position: "bottom-right"
                    });
                }
            );
    }, [counter])

    const doAction = (action: any, name: any, stripe_price: any, key: any) => {
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
                                {action === 'cancel' ? (
                                    <div className="wf-modal__head__main-name">Cancel subscription</div>
                                ) : (
                                    <div className="wf-modal__head__main-name">Resume subscription</div>
                                )}
                            </div>
                            <div className="wf-modal__content">
                                {action === 'cancel' ? (
                                    <div className="wf-form-group__title">Are you sure want to cancel your subscription?</div>
                                ) : (
                                    <div className="wf-form-group__title">Are you sure want to resume your subscription?</div>
                                )}
                            </div>
                            <div className="wf-modal__actions">
                                <button className={`wf-button wf-button--medium wf-button--primary ${action === 'cancel' ? 'wf-button--destructive' : 'wf-button--primary'}`} onClick={(e: any) => {
                                    e.target.classList.add('wf-button--loading');
                                    e.target.closest('.wf-button').classList.add('wf-button--loading');
                                    service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/subscription/${action}`, { name: name, stripe_price: stripe_price })
                                        .then(
                                            response => {
                                                if (_isMounted.current) {
                                                    onClose();
                                                    if (response.success) {
                                                        toast.success(response?.message, {
                                                            position: "bottom-right"
                                                        });
                                                        setCounter(counter + 1);
                                                        loadUser();
                                                        router.push('/user/subscription?action=cancel-subscription')
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
                                        <span className="wf-button__text">{action === 'cancel' ? 'Cancel' : 'Resume'}</span>
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

    return (
        <>
            <div id="cancel-subscription">
                {subscriptions?.map((subscription: any, key: any) =>
                    <div className="wf-toggler mt-16" key={key}>
                        <div className="wf-toggler__title wf-toggler__title--duo">
                            <div className="wf-toggler__title__details">
                                <div className="Heading">Cancel Subscription</div>
                                <span className="text-color--subdued">By canceling your account you will lose all your data and currently active subscriptions as well.</span>
                            </div>
                        </div>
                        {subscription?.ends_at ? (
                            <button className={`wf-button wf-button--medium wf-button--destructive-outline ${_action?.type === 'resume' && _action?.key === key && 'wf-button--loading'}`} onClick={(e: any) => {
                                e.preventDefault();
                                e.stopPropagation();
                                doAction('resume', subscription?.name, subscription?.stripe_price, key)
                            }}>
                                <div className="wf-button__content">
                                    <span className="wf-button__text">Resume</span>
                                </div>
                                <div className="wf-button__loading">
                                    <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 19 17">
                                        <circle className="loading__circle" cx="2.2" cy="10" r="1.6" />
                                        <circle className="loading__circle" cx="9.5" cy="10" r="1.6" />
                                        <circle className="loading__circle" cx="16.8" cy="10" r="1.6" />
                                    </svg>
                                </div>
                            </button>
                        ) : (
                            <button className={`wf-button wf-button--medium wf-button--destructive-outline ${_action?.type === 'cancel' && _action?.key === key && 'wf-button--loading'}`} onClick={(e: any) => {
                                e.preventDefault();
                                e.stopPropagation();
                                doAction('cancel', subscription?.name, subscription?.stripe_price, key)
                            }}>
                                <div className="wf-button__content">
                                    <span className="wf-button__text">Cancel</span>
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
                    </div>
                )}
            </div>
        </>
    )
}

export default CancelSubscription
