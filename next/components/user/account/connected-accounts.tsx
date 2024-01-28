import React, { useEffect, useState, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react"
import { service } from 'services/service'
import { toast } from 'react-toastify';
import { useAuth } from 'context/auth-provider';

const ConnectedAccounts = () => {

    const { user, updateUser } = useAuth();

    const _isMounted = useRef(true);

    const { data, status } = useSession();

    const [action, setAction] = useState<any>({});

    useEffect(() => {
        return () => {
            _isMounted.current = false;
        }
    }, []);

    useEffect(() => {
        if (status === "authenticated" && typeof window !== 'undefined') {
            setAction({ provider: localStorage?.getItem('provider') });
            service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/account/connect-account`, { provider_id: data?.user?.id, provider: localStorage?.getItem('provider') })
                .then(
                    response => {
                        if (_isMounted.current) {
                            if (response.success && !response.logged) {
                                toast.success(response?.message, {
                                    position: "bottom-right"
                                });
                                updateUser(response?.data);
                                signOut();
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
    }, [data, status])

    const disconnect = (provider: any) => {
        setAction({ provider: provider });
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/account/disconnect-account`, { provider: provider })
            .then(
                response => {
                    if (_isMounted.current) {
                        if (response.success && !response.logged) {
                            toast.success(response?.message, {
                                position: "bottom-right"
                            });
                            updateUser(response?.data);
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
        <>
            <div className="wf-page--settings__wrapper__sub-title" id="connected-accounts">
                Connected Accounts
            </div>

            <div className="wf-toggler mt-20">
                <div className="wf-toggler__title wf-toggler__title--duo">
                    <div className="wf-toggler__image">
                        <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/social/google.svg`} alt="" />
                    </div>
                    <div className="wf-toggler__title__details">
                        <div className="Heading">Google</div>
                        <span className="text-color--subdued">Account is <b>{!user?.google_id ? (`not connected`) : (`Connected`)}</b>.</span>
                    </div>
                </div>
                {!user?.google_id ? (
                    <button className="wf-button wf-button--medium wf-button--primary" onClick={() => {
                        localStorage?.setItem('provider', 'google');
                        signIn('google');
                    }}>
                        <div className="wf-button__content">
                            <span className="wf-button__text">Connect</span>
                        </div>
                    </button>
                ) : (
                    <button className="wf-button wf-button--medium wf-button--destructive-outline" onClick={() => {
                        disconnect('google');
                    }}>
                        <div className="wf-button__content">
                            <span className="wf-button__text">Disconnect</span>
                        </div>
                    </button>
                )}

            </div>
            <div className="wf-toggler mt-20">
                <div className="wf-toggler__title wf-toggler__title--duo">
                    <div className="wf-toggler__image">
                        <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/social/facebook.svg`} alt="" />
                    </div>
                    <div className="wf-toggler__title__details">
                        <div className="Heading">Facebook</div>
                        <span className="text-color--subdued">Account is <b>{!user?.facebook_id ? (`not connected`) : (`Connected`)}</b>.</span>
                    </div>
                </div>
                {!user?.facebook_id ? (
                    <button className="wf-button wf-button--medium wf-button--primary" onClick={() => {
                        localStorage?.setItem('provider', 'facebook');
                        signIn('facebook');
                    }}>
                        <div className="wf-button__content">
                            <span className="wf-button__text">Connect</span>
                        </div>
                    </button>
                ) : (
                    <button className="wf-button wf-button--medium wf-button--destructive-outline" onClick={() => {
                        disconnect('facebook');
                    }}>
                        <div className="wf-button__content">
                            <span className="wf-button__text">Disconnect</span>
                        </div>
                    </button>
                )}
            </div>
            <div className="wf-toggler mt-20">
                <div className="wf-toggler__title wf-toggler__title--duo">
                    <div className="wf-toggler__image">
                        <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/social/wordpress.svg`} alt="" />
                    </div>
                    <div className="wf-toggler__title__details">
                        <div className="Heading">WordPress</div>
                        <span className="text-color--subdued">Account is <b> {!user?.wordpress_id ? (`not connected`) : (`Connected`)}</b>.</span>
                    </div>
                </div>
                {!user?.wordpress_id ? (
                    <button className="wf-button wf-button--medium wf-button--primary" onClick={() => {
                        localStorage?.setItem('provider', 'wordpress');
                        signIn('wordpress');
                    }}>
                        <div className="wf-button__content">
                            <span className="wf-button__text">Connect</span>
                        </div>
                    </button>
                ) : (
                    <button className="wf-button wf-button--medium wf-button--destructive-outline" onClick={() => {
                        disconnect('wordpress');
                    }}>
                        <div className="wf-button__content">
                            <span className="wf-button__text">Disconnect</span>
                        </div>
                    </button>
                )}
            </div>
        </>
    )
}

export default ConnectedAccounts
