import React, { useEffect, useState, useRef } from "react";
import { useAuth } from 'context/auth-provider';
import { service } from 'services/service'
import { toast } from 'react-toastify';

const Verification = () => {

    const _isMounted = useRef(true);

    const { user, loadUser } = useAuth();

    const [action, setAction] = useState<any>({});

    const [counter, setCounter] = React.useState(0);

    const resend = () => {
        setAction({ type: 'resend' });
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/auth/email/verify/resend`, {})
            .then(
                response => {
                    if (_isMounted.current) {
                        if (response.success) {
                            toast.success(response?.message, {
                                position: "bottom-right"
                            });
                            loadUser();
                            setCounter(60);
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

    useEffect(() => {
        return () => {
            _isMounted.current = false;
        }
    }, []);

    React.useEffect(() => {
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }, [counter]);

    if (user?.email_verified_at !== null) return null;

    return (

        <div className="wf-hellobar wf-hellobar--relative wf-hellobar--warning">
            <div className='wf-hellobar__empty'></div>
            <div className="wf-hellobar__content">
                <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                Your email isn't verified yet –&#160;<a onClick={() => {
                    if (counter === 0) {
                        resend();
                    } else {
                        toast.error(`Please wait ${counter}s before requesting a new link`, {
                            position: "bottom-right"
                        });
                    }
                }}>{counter > 0 ? (`Request new in ${counter}s`) : (`Resend verification email`)}</a>
            </div>
            <div className='wf-hellobar__empty'></div>
        </div>
    )
}

export default Verification
