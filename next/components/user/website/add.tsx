import React, { ReactElement, FC, useEffect, useRef, useState } from "react";
import { useAuth } from 'context/auth-provider';
import { service } from 'services/service';
import { toast } from 'react-toastify';
import {
    Formik,
    Form,
    Field,
} from 'formik';
import * as Yup from 'yup';

interface MyFormValues {
    url: string;
    type: string;
    cdn: number;
    volume: number;
}

const re = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/

const validationSchema = Yup.object().shape({
    url: Yup.string().matches(re, 'URL is not valid').required('Required'),
    cdn: Yup.number().required('Required'),
    type: Yup.string().required('Required'),
});

const AddWebsite: FC<any> = (props: any): ReactElement => {

    const { user, loadUser } = useAuth();

    const [initialValue,] = useState<MyFormValues>({ url: props?.data?.url, cdn: Number(user?.is_free) === 1 ? 0 : (props?.data?.cdn || 0), type: Number(user?.is_free) === 1 ? 'free' : (props?.data?.type || 'free'), volume: props?.data?.volume | 0 });

    const _isMounted = useRef(true);

    const [loading, setLoading] = useState(false);

    const [server_errors, setServerErrors] = useState<any>({});

    useEffect(() => {
        return () => {
            _isMounted.current = false;
        }
    }, []);

    return (
        <div className="wf-modal">
            <div className="wf-modal__modal-wrapper">
                <div className="wf-modal__close" onClick={() => {
                    props?.cancel();
                }}>
                    <span className="SystemLimited-icon SystemLimited-icon-cancel"></span>
                </div>
                <div className="wf-modal__head">
                    <div className="wf-modal__head__main-name">{props?.data?.id !== undefined ? 'Update website' : 'Add new website'}</div>
                </div>
                <Formik
                    initialValues={initialValue}
                    validationSchema={validationSchema}
                    onSubmit={(values, actions) => {
                        actions.setSubmitting(false);
                        setLoading(true);
                        service.post(props?.data?.id !== undefined ? `${process?.env?.NEXT_PUBLIC_API_URL}/user/website/update/${props?.data?.id}` : `${process?.env?.NEXT_PUBLIC_API_URL}/user/website/store`, { ...values })
                            .then(
                                response => {
                                    if (response.success) {
                                        toast.success(response?.message, {
                                            position: "bottom-right"
                                        });
                                        loadUser();
                                        props?.cancel(true);
                                        setTimeout(() => {
                                            if (props?.redirect !== undefined && props?.redirect !== null && response?.data?.website?.token !== undefined && response?.data?.website?.token !== null) {
                                                window.location.href = `${props?.redirect}&token=${response?.data?.website?.token}`;
                                            }
                                        }, 500);
                                    } else {
                                        if (response?.message !== undefined) {
                                            toast.success(response?.message, {
                                                position: "bottom-right"
                                            });
                                            props?.cancel(true);
                                        } else {
                                            setServerErrors(response?.errors)
                                        }
                                        setTimeout(() => {
                                            if (props?.redirect !== undefined && props?.redirect !== null && response?.data?.website?.token !== undefined && response?.data?.website?.token !== null) {
                                                window.location.href = `${props?.redirect}&token=${response?.data?.website?.token}`;
                                            }
                                        }, 500);
                                    }
                                    setLoading(false);
                                },
                                error => {
                                    setLoading(false);
                                    toast.error(error, {
                                        position: "bottom-right"
                                    });
                                    props?.cancel(true);
                                }
                            );
                    }}
                >
                    {({ errors, touched, isValidating, values, setFieldValue }) => (
                        <Form>
                            <div className="wf-modal__content">

                                <div className="wf-form-group wf-form-group--fluid">
                                    <div className="wf-form-group__title">Website URL</div>
                                    <div className={`wf-textfield wf-textfield--fluid mr-4 ${((errors.url && touched.url) || (server_errors?.domain?.length > 0 || server_errors?.url?.length)) && 'wf-textfield--error'}`}>
                                        <Field
                                            id="url"
                                            name="url"
                                            type="text"
                                            className="wf-textfield__input"
                                            placeholder="Enter complete website url..."
                                        />
                                        <div className="wf-textfield__backdrop"></div>
                                    </div>
                                    <div className="wf-form-group__sub">This should be the <a >Base URL</a> of your website.</div>
                                </div>

                                {(errors.url && touched.url) || (server_errors?.domain?.length > 0) ? (
                                    <div className="wf-inline-error wf-inline-error--fluid">
                                        <div className="wf-inline-error__icon">
                                            <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                        </div>
                                        <div className="wf-inline-error__text">{errors.url ? errors.url : server_errors?.domain[0]}</div>
                                    </div>
                                ) : null}

                                {server_errors?.url?.length > 0 ? (
                                    <div className="wf-inline-error wf-inline-error--fluid">
                                        <div className="wf-inline-error__icon">
                                            <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                        </div>
                                        <div className="wf-inline-error__text">{server_errors?.url[0]}</div>
                                    </div>
                                ) : null}

                                {Number(user?.is_free) === 1 ? (
                                    <div className="wf-toggler">
                                        <div className="wf-toggler__title">This website will be <b>Free </b>
                                            <span className="wf-badge" wf-tooltip={user?.subscription?.remaining_websites_tooltip}>{user?.subscription?.remaining_websites} used</span>
                                        </div>
                                        <div className="wf-button-group wf-button-group--packed wf-button-group--no-shrink">
                                            <a className="wf-button wf-button--medium wf-button--disabled" >
                                                <div className="wf-button__content">
                                                    <span className="wf-button__text">Pro</span>
                                                </div>
                                            </a>
                                            <a className={`wf-button wf-button--medium ${values?.type === 'free' && 'wf-button--primary'}`} onClick={() => {
                                                setFieldValue('type', 'free');
                                            }}>
                                                <div className="wf-button__content">
                                                    <span className="wf-button__text">Free</span>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="wf-toggler mt-12">
                                            {values?.type === 'pro' ? (
                                                <div className="wf-toggler__title">This website will be <b>{Number(user?.is_free) === 1 ? 'Free' : 'Pro'}</b> <span className="wf-badge wf-badge--warning" wf-tooltip={user?.subscription?.remaining_websites_tooltip}>
                                                    {user?.subscription?.remaining_websites} used
                                                </span></div>
                                            ) : (
                                                <div className="wf-toggler__title">This website will be <b>Free</b>. <span className="wf-badge" wf-tooltip={user?.subscription?.free_websites_tooltip}>{user?.subscription?.free_websites} / &infin; used</span></div>
                                            )}
                                            <div className="wf-button-group wf-button-group--packed wf-button-group--no-shrink">
                                                <a className={`wf-button wf-button--medium ${values?.type === 'pro' && 'wf-button--primary'}`} onClick={() => {
                                                    setFieldValue('type', 'pro');
                                                }}>
                                                    <div className="wf-button__content">
                                                        <span className="wf-button__text">Pro</span>
                                                    </div>
                                                </a>
                                                <a className={`wf-button wf-button--medium ${values?.type === 'free' && 'wf-button--primary'}`} onClick={() => {
                                                    setFieldValue('type', 'free');
                                                    setFieldValue('cdn', 0);
                                                }}>
                                                    <div className="wf-button__content">
                                                        <span className="wf-button__text">Free</span>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                        {values?.type === 'pro' && (
                                            <>
                                                <div className="wf-toggler mt-12">
                                                    <div className="wf-toggler__title">CDN for this website will be <b>{Number(values?.cdn) === 1 ? 'Enabled' : 'Disabled'}</b></div>
                                                    <a className={`wf-button wf-button--medium ${Number(values?.cdn) === 0 && 'wf-button--primary'}`} onClick={() => {
                                                        setFieldValue('cdn', Number(values?.cdn) === 0 ? 1 : 0);
                                                        if (values?.cdn === 0) {
                                                            setFieldValue('volume', 0);
                                                        }
                                                    }}>
                                                        <div className="wf-button__content">
                                                            <span className="wf-button__text">{Number(values?.cdn) === 0 ? 'Activate' : 'Deactivate'}</span>
                                                        </div>
                                                    </a>
                                                </div>
                                                {Number(values?.cdn) === 1 && (
                                                    <div className="wf-toggler mt-12">
                                                        <div className="wf-toggler__title">CDN pricing & routing tire will be <b>{Number(values?.volume) === 0 ? 'Premium' : 'Volume'}</b></div>
                                                        <div className="wf-button-group wf-button-group--packed wf-button-group--no-shrink">
                                                            <a className={`wf-button wf-button--medium ${Number(values?.volume) === 0 && 'wf-button--primary'}`} onClick={() => {
                                                                setFieldValue('volume', '0');
                                                            }}>
                                                                <div className="wf-button__content">
                                                                    <span className="wf-button__text">Premium</span>
                                                                </div>
                                                            </a>
                                                            <a className={`wf-button wf-button--medium ${Number(values?.volume) === 1 && 'wf-button--primary'}`} onClick={() => {
                                                                setFieldValue('volume', '1');
                                                            }}>
                                                                <div className="wf-button__content">
                                                                    <span className="wf-button__text">Volume</span>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}

                                {server_errors?.limit?.length > 0 ? (
                                    <div className="wf-inline-error wf-inline-error--fluid mt-12">
                                        <div className="wf-inline-error__icon">
                                            <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                        </div>
                                        <div className="wf-inline-error__text">{server_errors?.limit[0]}</div>
                                    </div>
                                ) : null}
                            </div>

                            <div className="wf-modal__actions">
                                <div className="wf-button-group">
                                    <button className={`wf-button wf-button--medium wf-button--primary ${!values?.url && 'wf-button--disabled'} ${loading && 'wf-button--loading'}`}>
                                        <div className="wf-button__content">
                                            <span className="wf-button__text">{props?.data?.id !== undefined ? 'Update website' : 'Add website'}</span>
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
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default AddWebsite
