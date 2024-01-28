import React, { useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react"
import { service } from 'services/service'
import { useAuth } from 'context/auth-provider';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const Index = () => {

    const _isMounted = useRef(true);

    const [action, setAction] = useState<any>({});

    const { updateToken } = useAuth();

    const router: any = useRouter();

    const { data, status } = useSession({
        required: true,
        onUnauthenticated() {
            // The user is not authenticated, handle it here.
        },
    });

    useEffect(() => {
        if (status === "authenticated" && typeof window !== 'undefined') {
            setAction({ provider: localStorage?.getItem('provider') });
            service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/auth/social-login`, { email: data?.user?.email, provider_id: data?.user?.id, provider: localStorage?.getItem('provider'), name: data?.user?.name, remember: 0 })
                .then(
                    response => {
                        if (_isMounted.current) {
                            if (response.success && !response.logged) {
                                updateToken(response?.data?.access_token);
                                signOut({ redirect: false });
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

    useEffect(() => {
        return () => {
            _isMounted.current = false;
        }
    }, []);

    return (
        <>
            <button
                onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    localStorage?.setItem('provider', 'google');
                    signIn('google');
                }}
                className={`wf-button wf-button--large wf-button--fluid wf-button--content-left ${action?.provider === 'google' && 'wf-button--loading'}`}
            >
                <div className="wf-button__content">
                    <span className="social-icon mr-4"><img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/social/google.svg`} alt="" /></span>
                    <div className="wf-button__text">Login with Google</div>
                </div>
                <div className="wf-button__loading">
                    <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 19 17">
                        <circle className="loading__circle" cx="2.2" y="10" r="1.6" ></circle>
                        <circle className="loading__circle" cx="9.5" cy="10" r="1.6" ></circle>
                        <circle className="loading__circle" cx="16.8" y="10" r="1.6"></circle>
                    </svg>
                </div>
                <div className="wf-button__backdrop"></div>
            </button>

            <button
                onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    localStorage?.setItem('provider', 'facebook');
                    signIn('facebook');
                }}
                className={`wf-button wf-button--large wf-button--fluid wf-button--content-left ${action?.provider === 'facebook' && 'wf-button--loading'}`}
            >
                <div className="wf-button__content">
                    <span className="social-icon mr-4"><img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/social/facebook.svg`} alt="" /></span>
                    <div className="wf-button__text">Login with Facebook</div>
                </div>
                <div className="wf-button__backdrop"></div>
            </button>

            <button onClick={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                localStorage?.setItem('provider', 'wordpress');
                signIn('wordpress');
            }} className={`wf-button wf-button--large wf-button--fluid wf-button--content-left ${action?.provider === 'wordpress' && 'wf-button--loading'}`}>
                <div className="wf-button__content">
                    <span className="social-icon mr-4">
                        <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/social/wordpress.svg`} alt="" /></span>
                    <div className="wf-button__text">Login with WordPress</div>
                </div>
                <div className="wf-button__backdrop"></div>
            </button>
        </>
    )
}

export default Index
