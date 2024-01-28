type AuthContextState = {
    user: any;
    updateUser: (payload: any) => void;
    loadUser: () => void;

    token: any;
    updateToken: (token: any) => void;

    action: any;
    updateAction: (action: any) => void;

    invoice: any;
    updateInvoice: (payload: any) => void;

    plan: any;
    updatePlan: (payload: any) => void;

    redirect_after_login: any;
    updateRedirectAfterLogin: (url: any) => void;

    cookie_consent: any;
    updateCookieConsent: (value: any) => void;

    video_baloon: any;
    updateVideoBaloon: (value: any) => void;

    trial_days: any;
    updateTrialDays: (days: any) => void;
};

export default AuthContextState;