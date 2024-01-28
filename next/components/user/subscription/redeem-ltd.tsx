import React, { useEffect, useRef } from "react";
import { service } from 'services/service'
import { toast } from 'react-toastify';
import { useAuth } from 'context/auth-provider';
import { confirmAlert } from 'react-confirm-alert'; // Import

const RedeemLtd = () => {

    const _isMounted = useRef(true);

    const { loadUser } = useAuth();

    useEffect(() => {
        return () => {
            _isMounted.current = false;
        }
    }, []);

    const redeemCode = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="wf-modal">
                        <div className="wf-modal__modal-wrapper">
                            <div className="wf-modal__close">
                                <span className="SystemLimited-icon SystemLimited-icon-cancel"></span>
                            </div>
                            <div className="wf-modal__head">
                                <div className="wf-modal__head__main-name">Redeem LTD Code</div>
                                <div className="wf-modal__head__sub">If you have any Lifetime deal code you can redeem that code here</div>
                            </div>
                            <div className="wf-modal__content">
                                <div className="wf-textfield wf-textfield--fluid mr-4">
                                    <input type="text" className="wf-textfield__input" id="coupon-code" autoFocus placeholder="Enter coupon code..." />
                                    <div className="wf-textfield__backdrop"></div>
                                </div>
                            </div>
                            <div className="wf-modal__actions">
                                <div className="wf-button-group">
                                    <button className={`wf-button wf-button--medium wf-button--primary`} onClick={(e: any) => {
                                        e.target.classList.add('wf-button--loading');
                                        e.target.closest('.wf-button').classList.add('wf-button--loading');
                                        const code = (document.getElementById("coupon-code") as HTMLInputElement).value
                                        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/subscription/redeem-ltd-code`, { code: code })
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
                                            <span className="wf-button__text">Redeem</span>
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
                );
            }
        });
    }

    return (
        <>

            <div id="redeem-ltd-code">
                <div className="wf-toggler mt-16">
                    <div className="wf-toggler__title wf-toggler__title--duo">
                        <div className="wf-toggler__title__details">
                            <div className="Heading">Redeem LTD Code</div>
                            <span className="text-color--subdued">If you have any Lifetime deal code you can redeem that code here.</span>
                        </div>
                    </div>
                    <button className={`wf-button wf-button--medium`} onClick={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        redeemCode();
                    }}>
                        <div className="wf-button__content">
                            <span className="wf-button__text">Redeem</span>
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
        </>
    )
}

export default RedeemLtd
