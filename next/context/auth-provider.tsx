import React, { createContext, useState, FC, ReactElement, useEffect, useRef, useContext } from "react";
import AuthContextState from 'context/auth-context-state';
import { service } from 'services/service';
import { ToastContainer } from 'react-toastify';
import { in_array } from 'helpers'

const token: any = (typeof window !== 'undefined' ? localStorage?.getItem('token') as any : null);

const contextDefaultValues: AuthContextState = {
    user: null,
    updateUser: () => { },
    loadUser: () => { },

    token: token !== undefined && token !== null ? token : null,
    updateToken: () => { },

    action: (typeof window !== 'undefined' ? localStorage?.getItem('action') !== null ? JSON.parse(localStorage?.getItem('action') as any) : {} : null),
    updateAction: () => { },

    redirect_after_login: (typeof window !== 'undefined' ? localStorage?.getItem('redirect_after_login') : null),
    updateRedirectAfterLogin: () => { },

    invoice: {},
    updateInvoice: () => { },

    plan: {},
    updatePlan: () => { },

    cookie_consent: (typeof window !== 'undefined' ? localStorage?.getItem('cookie_consent') : null),
    updateCookieConsent: () => { },

    video_baloon: (typeof window !== 'undefined' ? localStorage?.getItem('video_baloon') : null),
    updateVideoBaloon: () => { },

    trial_days: 14,
    updateTrialDays: () => { },
};

export const AuthContext = createContext<AuthContextState>(
    contextDefaultValues
);

export function useAuth() {
    return useContext(AuthContext);
}

const AuthProvider: FC<any> = (props): ReactElement => {

    const _isMounted = useRef(true);

    const [user, setUser] = useState<any>(contextDefaultValues.user);
    const updateUser = (payload: any) => setUser(payload);

    const loadUser = () => {
        fetchUser();
    };

    const [token, setToken] = useState<any>(contextDefaultValues.token);
    const updateToken = (token: any) => {
        setToken(token);
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage?.removeItem('token');
        }
    };

    const [action, setAction] = useState<any>(contextDefaultValues.action);
    const updateAction = (action: any) => {
        setAction(action);
        if (!in_array(action?.name, ['resume-subscription', 'payment-method', 'add-payment-method', 'recharge-balance'])) {
            localStorage.setItem('action', JSON.stringify(action));
        }
    };

    const [redirect_after_login, setRedirectAfterLogin] = useState<any>(contextDefaultValues.redirect_after_login);
    const updateRedirectAfterLogin = (url: any) => {
        setRedirectAfterLogin(url);
        if (url) {
            localStorage.setItem('redirect_after_login', url);
        } else {
            localStorage.removeItem('redirect_after_login');
        }
    };

    const [invoice, setInvoice] = useState<any>(contextDefaultValues.invoice);
    const updateInvoice = (invoice: any) => {
        setInvoice(invoice);
    };

    const [plan, setPlan] = useState<any>(contextDefaultValues.plan);
    const updatePlan = (plan: any) => {
        setPlan(plan);
    };

    const [cookie_consent, setCookieConsent] = useState<any>(contextDefaultValues.cookie_consent);
    const updateCookieConsent = (value: any) => {
        setCookieConsent(value);
        localStorage.setItem('cookie_consent', value);
    };

    const [video_baloon, setVideoBaloon] = useState<any>(contextDefaultValues.video_baloon);
    const updateVideoBaloon = (value: any) => {
        setVideoBaloon(value);
        localStorage.setItem('video_baloon', value);
    };

    useEffect(() => {
        getTrialDays(); //Fetch trial days
        return () => {
            _isMounted.current = false;
        }
    }, []);

    useEffect(() => {
        if (token !== undefined && token !== null) {
            fetchUser();
        }
    }, [token]);

    const [trial_days, setTrialDays] = useState<any>(contextDefaultValues.trial_days);
    const updateTrialDays = (trial_days: any) => {
        setTrialDays(trial_days);
    };

    const fetchUser = async () => {
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/account/profile`, {})
            .then(
                response => {
                    if (_isMounted.current) {
                        if (response.success && response.data) {
                            setUser(response.data);
                        } else {
                            setUser(null);
                        }
                    }
                },
                error => { }
            );
    };

    const getTrialDays = async () => {
        service.get(`${process?.env?.NEXT_PUBLIC_SystemLimited_API_URL}/subscription/trial-days`)
            .then(
                response => {
                    if (_isMounted.current) {
                        if (response.success && response.data) {
                            updateTrialDays(response.data.trial_days);
                        }
                    }
                }
            );
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                updateUser,
                loadUser,

                token,
                updateToken,

                action,
                updateAction,

                redirect_after_login,
                updateRedirectAfterLogin,

                invoice,
                updateInvoice,

                plan,
                updatePlan,

                cookie_consent,
                updateCookieConsent,

                video_baloon,
                updateVideoBaloon,

                trial_days,
                updateTrialDays
            }}
        >
            <ToastContainer />
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;