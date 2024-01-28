import React, { ReactElement, FC, useRef, useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useAuth } from 'context/auth-provider';
import { service } from 'services/service'

const DownloadPlugin: FC<any> = (props: any): ReactElement => {

    const router: any = useRouter();

    const { user } = useAuth();

    const _isMounted = useRef(true);

    const [loading, setLoading] = useState(true);

    const [url, setUrl] = useState('');

    useEffect(() => {
        return () => {
            _isMounted.current = false;
        }
    }, []);

    useEffect(() => {
        if (user !== undefined && user !== null && Object.keys(user).length > 0 && Number(user?.is_free) === 0) {
            service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/website/download-plugin`, {})
                .then(
                    response => {
                        if (_isMounted.current) {
                            if (response.success) {
                                setUrl(response.data.downloadUrl);
                                setLoading(false);
                            }
                        }
                    },
                    error => {
                        setLoading(false);
                    }
                );
        } else {
            setLoading(false);
        }
    }, [user])

    return (
        <div className="wf-modal">
            <div className="wf-modal__modal-wrapper">
                <div className="wf-modal__close" onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    props.triggerDownload(false);
                }}>
                    <span className="SystemLimited-icon SystemLimited-icon-cancel"></span>
                </div>
                <div className="wf-modal__head">
                    <div className="wf-modal__head__main-name">Download SystemLimited</div>
                </div>
                <div className="wf-modal__content">
                    <div className="wf-toggler" wf-tooltip-bottom={(user === null || user === undefined || Object.keys(user).length === 0) ? 'Login to download Pro version' : (Number(user?.is_free) === 1 && 'You need to upgrade to Pro Plan')}>
                        <div className="wf-toggler__title wf-toggler__title--duo">
                            <div className="wf-toggler__title__details">
                                <div className="Heading">SystemLimited Pro</div>
                                <span className="text-color--subdued Caption">Current version 1.1.1 - Last updated on Dec 20, 2022</span>
                            </div>
                        </div>
                        <div className="wf-button-group">
                            <a onClick={(e: any) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (url) {
                                    window.location.href = url;
                                }
                            }} className={`wf-button wf-button--medium wf-button--primary ${!url && 'wf-button--disabled'} ${loading && 'wf-button--loading'}`}>
                                <div className="wf-button__content">
                                    <span className="SystemLimited-icon SystemLimited-icon-download mr-4"></span>
                                    <span className="wf-button__text">Download</span>
                                </div>
                                <div className="wf-button__loading">
                                    <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 19 17">
                                        <circle className="loading__circle" cx="2.2" cy="10" r="1.6"></circle>
                                        <circle className="loading__circle" cx="9.5" cy="10" r="1.6"></circle>
                                        <circle className="loading__circle" cx="16.8" cy="10" r="1.6"></circle>
                                    </svg>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="wf-toggler mt-16">
                        <div className="wf-toggler__title wf-toggler__title--duo">
                            <div className="wf-toggler__title__details">
                                <div className="Heading">SystemLimited Lite</div>
                                <span className="text-color--subdued Caption">Current version 1.1.1 - Last updated on Dec 20, 2022</span>
                            </div>
                        </div>
                        <div className="wf-button-group">
                            <button onClick={(e: any) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open("https://go.SystemLimited.io/wp-download", "_blank")
                            }} className="wf-button wf-button--medium false">
                                <div className="wf-button__content">
                                    <span className="SystemLimited-icon SystemLimited-icon-wordpress mr-4"></span>
                                    <span className="wf-button__text">Download</span>
                                </div>
                                <div className="wf-button__loading">
                                    <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 19 17">
                                        <circle className="loading__circle" cx="2.2" cy="10" r="1.6"></circle>
                                        <circle className="loading__circle" cx="9.5" cy="10" r="1.6"></circle>
                                        <circle className="loading__circle" cx="16.8" cy="10" r="1.6"></circle>
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default DownloadPlugin;