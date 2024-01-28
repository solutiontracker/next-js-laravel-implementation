import React from 'react'
import { useAuth } from 'context/auth-provider';

const CookiesConsent = () => {

    const { cookie_consent, updateCookieConsent } = useAuth();

    return (
        <>
            {!cookie_consent && typeof window !== 'undefined' && (
                <div className="wf-cookie-ballon">
                    <div className="wf-cookie-ballon__icon"></div>
                    <div className="wf-cookie-ballon__details">
                        We us cookies to improve your experience on our website.
                    </div>
                    <button className="wf-button wf-button--outline wf-button--on-background wf-button--medium" onClick={() => {
                        updateCookieConsent('1');
                    }}>
                        <div className="wf-button__content">
                            <div className="wf-button__text">I understand</div>
                        </div>
                        <div className="wf-button__backdrop"></div>
                    </button>
                </div>
            )}
        </>
    )
}

export default CookiesConsent