import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useRef, useEffect, useState, useCallback } from "react";
import Master from 'components/auth/layout/master'
import { service } from 'services/service'
import { toast } from 'react-toastify';
import {
    Formik,
    Form,
    Field,
} from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import {
    GoogleReCaptcha
} from 'react-google-recaptcha-v3';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
        .min(6, 'Too Short!')
        .required('Required'),
    password_confirmation: Yup.string().required('Required').when("password", {
        is: (val: any) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
            [Yup.ref("password")],
            "Both password need to be the same"
        )
    }),
    token: Yup.string().required('Required'),
});

const Reset: NextPage = () => {

    const router: any = useRouter();

    const _isMounted = useRef(true);

    const [loading, setLoading] = useState(false);

    const [server_errors, setServerErrors] = useState<any>();

    const [password, setPassword] = useState(false);

    const [c_password, setCPassword] = useState(false);

    const [recaptcha, setRecaptcha] = useState('');

    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setRefreshReCaptcha(r => !r);
        }, 100);
        return () => {
            _isMounted.current = false;
        }
    }, []);

    const onChange = useCallback((value) => {
        setRecaptcha(value);
    }, [refreshReCaptcha]);

    return (
        <Master>

            <Head>
                <title>Reset your password | SystemLimited</title>
                <link rel="canonical" href="https://SystemLimited.io/" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="SystemLimited" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Reset your password | SystemLimited" />
                <meta property="og:url" content="https://SystemLimited.io/" />
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`}/>
                <meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`}/>
                <meta property="og:image:width" content="1720" />
                <meta property="og:image:height" content="1000" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SystemLimited_io" />
                <meta name="twitter:title" content="Reset your password | SystemLimited" />
                <meta name="twitter:creator" content="@SystemLimited_io" />
                <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                
                <link rel='dns-prefetch' href='//js.stripe.com' />
                <link rel='dns-prefetch' href='//fonts.googleapis.com' />
            </Head>

            <div className="wf-split-page__heading mt-64">
                <div className="wf-split-page__heading__title">Enter your new password</div>
                <div className="wf-split-page__heading__sub mt-8">Need a SystemLimited account? <a onClick={() => router.push('/auth/registration')}>Create an account</a>.</div>
            </div>

            <div className="wf-split-page__form mt-32">
                <Formik
                    enableReinitialize={true}
                    initialValues={{ email: router.query?.slug?.[1], password: '', password_confirmation: '', token: router.query?.slug?.[0] || '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values, actions) => {
                        actions.setSubmitting(false);
                        setLoading(true);
                        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/auth/password/reset`, { ...values, recaptcha: recaptcha })
                            .then(
                                response => {
                                    if (_isMounted.current) {
                                        if (response.success) {
                                            toast.success("Password changed successfully.", {
                                                position: "bottom-right"
                                            });
                                            router.push('/auth/login');
                                        } else {
                                            if (response?.errors) {
                                                setServerErrors(response?.errors)
                                            } else {
                                                toast.error(response?.message, {
                                                    position: "bottom-right"
                                                });
                                                setRefreshReCaptcha(r => !r);
                                            }
                                        }
                                        setLoading(false);
                                    }
                                },
                                error => {
                                    setLoading(false);
                                    toast.error(error, {
                                        position: "bottom-right"
                                    });
                                }
                            );


                    }}
                >
                    {({ values, errors, touched, isValidating }) => (
                        <Form>

                            <div className="wf-form-group wf-form-group--fluid mb-0">
                                <div className="wf-form-group__title">Email</div>
                                <div className="wf-textfield wf-textfield--large wf-textfield--fluid wf-textfield--disabled mr-4">
                                    <span className="SystemLimited-icon SystemLimited-icon-user wf-textfield__prefix-icon"></span>
                                    <Field
                                        disabled
                                        id="email"
                                        name="email"
                                        type="text"
                                        className="wf-textfield__input"
                                        placeholder="Your email address..." />
                                    <div className="wf-textfield__backdrop"></div>
                                </div>
                            </div>

                            {errors.email && touched.email ? (
                                <div className="wf-inline-error wf-inline-error--fluid">
                                    <div className="wf-inline-error__icon">
                                        <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                    </div>
                                    <div className="wf-inline-error__text">{errors.email}</div>
                                </div>
                            ) : null}

                            <div className="wf-form-group wf-form-group--fluid mb-0">
                                <div className="wf-form-group__title">Token</div>
                                <div className="wf-textfield wf-textfield--large wf-textfield--fluid wf-textfield--disabled mr-4">
                                    <span className="SystemLimited-icon SystemLimited-icon-user wf-textfield__prefix-icon"></span>
                                    <Field
                                        disabled
                                        id="token"
                                        name="token"
                                        type="text"
                                        className="wf-textfield__input"
                                        placeholder="Enter your token..." />
                                    <div className="wf-textfield__backdrop"></div>
                                </div>
                            </div>

                            {errors.token && touched.token ? (
                                <div className="wf-inline-error wf-inline-error--fluid">
                                    <div className="wf-inline-error__icon">
                                        <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                    </div>
                                    <div className="wf-inline-error__text">{errors.token}</div>
                                </div>
                            ) : null}

                            <div className="wf-form-group wf-form-group--fluid mb-0">
                                <div className="wf-form-group__title">New password</div>
                                <div className="wf-textfield wf-textfield--large wf-textfield--fluid mr-4 wf-textfield--show-post-icon">
                                    <span className="SystemLimited-icon SystemLimited-icon-lock wf-textfield__prefix-icon"></span>
                                    <Field
                                        id="password"
                                        name="password"
                                        type={password ? 'text' : 'password'}
                                        className="wf-textfield__input"
                                        placeholder="Your desired password..." />
                                    <span className={`SystemLimited-icon wf-textfield__postfix-icon ${!password ? 'SystemLimited-icon-hide' : 'SystemLimited-icon-view'}`} onClick={() => {
                                        setPassword(!password);
                                    }}></span>
                                    <div className="wf-textfield__backdrop"></div>
                                </div>
                            </div>

                            {(errors.password && touched.password) || (server_errors?.password?.length > 0) ? (
                                <div className="wf-inline-error wf-inline-error--fluid">
                                    <div className="wf-inline-error__icon">
                                        <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                    </div>
                                    <div className="wf-inline-error__text">{errors.password ? errors.password : server_errors?.password[0]}</div>
                                </div>
                            ) : null}

                            <div className="wf-form-group wf-form-group--fluid mb-0">
                                <div className="wf-form-group__title">Confirm new password</div>
                                <div className="wf-textfield wf-textfield--large wf-textfield--fluid mr-4 wf-textfield--show-post-icon">
                                    <span className="SystemLimited-icon SystemLimited-icon-lock wf-textfield__prefix-icon"></span>
                                    <Field
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={c_password ? 'text' : 'password'}
                                        className="wf-textfield__input"
                                        placeholder="Your confirm password..." />
                                    <span className={`SystemLimited-icon wf-textfield__postfix-icon ${!c_password ? 'SystemLimited-icon-hide' : 'SystemLimited-icon-view'}`} onClick={() => {
                                        setCPassword(!c_password);
                                    }}></span>
                                    <div className="wf-textfield__backdrop"></div>
                                </div>
                            </div>

                            {(errors.password_confirmation && touched.password_confirmation) || (server_errors?.password_confirmation?.length > 0) ? (
                                <div className="wf-inline-error wf-inline-error--fluid">
                                    <div className="wf-inline-error__icon">
                                        <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                    </div>
                                    <div className="wf-inline-error__text">{errors.password_confirmation ? errors.password_confirmation : server_errors?.password_confirmation[0]}</div>
                                </div>
                            ) : null}

                            <GoogleReCaptcha onVerify={onChange} refreshReCaptcha={refreshReCaptcha} />

                            <button className={`wf-button wf-button--large wf-button--fluid wf-button--primary ${(errors?.email || !values?.email) && 'wf-button--disabled'} mt-12 ${loading && 'wf-button--loading'}`}>
                                <div className="wf-button__content">
                                    <React.Fragment>
                                        <div className="wf-button__text">Update my password</div>
                                    </React.Fragment>
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
                        </Form>
                    )}
                </Formik>

                <div className="wf-split-page__heading__sub">Want to go back to Login? <a onClick={() => router.push('/auth/login')}> click here</a>.</div>

                <div className="wf-split-page__heading__sub wf-split-page__heading__sub--recaptcha">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.</div>

            </div>
        </Master >
    )
}

export default Reset