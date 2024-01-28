import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useRef, useEffect, useState, useCallback } from "react";
import Master from 'components/auth/layout/master'
import { service } from 'services/service'
import { useAuth } from 'context/auth-provider';
import SocialLogin from 'components/auth/social-oauth/index';
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
interface MyFormValues {
    email: string;
    password: string;
}

const validationSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, 'Password length should minimum 6 characters!')
        .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
});

const Login: NextPage = () => {

    const initialValues: MyFormValues = { email: '', password: '' };

    const _isMounted = useRef(true);

    const [loading, setLoading] = useState(false);

    const [logged, setLogged] = useState(false);

    const [recaptcha, setRecaptcha] = useState('');

    const { updateToken, redirect_after_login, updateRedirectAfterLogin } = useAuth();

    const router: any = useRouter();

    const [password, setPassword] = useState(false);

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
    }, []);

    return (
        <Master>

            <Head>
                <title>Login to SystemLimited | SystemLimited</title>
                <link rel="canonical" href="https://SystemLimited.io/" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="SystemLimited" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Login to SystemLimited | SystemLimited" />
                <meta property="og:url" content="https://SystemLimited.io/" />
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                <meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                <meta property="og:image:width" content="1720" />
                <meta property="og:image:height" content="1000" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SystemLimited_io" />
                <meta name="twitter:title" content="Login to SystemLimited | SystemLimited" />
                <meta name="twitter:creator" content="@SystemLimited_io" />
                <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />

                <link rel='dns-prefetch' href='//js.stripe.com' />
                <link rel='dns-prefetch' href='//fonts.googleapis.com' />
            </Head>

            <div className="wf-split-page__heading mt-64">
                <div className="wf-split-page__heading__title">Login to your account</div>
                <div className="wf-split-page__heading__sub mt-8">Need a SystemLimited account? <a onClick={() => router.push('/auth/registration')} >Create an account</a>.</div>
            </div>

            <div className="wf-split-page__form mt-32">

                {redirect_after_login && (
                    <div className="wf-alert wf-alert--warning wf-alert--fluid mt-12">
                        <div className="wf-alert__ribbon">
                            <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                        </div>
                        <div className="wf-alert__content-wrapper">
                            <div className="wf-alert__content">Please Login first to continue.</div>
                        </div>
                        <span className="SystemLimited-icon SystemLimited-icon-cancel wf-alert__close" onClick={() => {
                            updateRedirectAfterLogin('');
                        }}></span>
                    </div>
                )}

                <SocialLogin />

                <div className="wf-split-page__form__divider">
                    <span>OR</span>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, actions) => {
                        setLoading(true);
                        actions.setSubmitting(false);
                        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/auth/login`, { email: values?.email, password: values?.password, remember: logged ? 1 : 0, recaptcha: recaptcha })
                            .then(
                                response => {
                                    if (_isMounted.current) {
                                        if (response.success && !response.logged) {
                                            updateToken(response?.data?.access_token)
                                        } else {
                                            toast.error(response?.message, {
                                                position: "bottom-right"
                                            });
                                            setRefreshReCaptcha(r => !r);
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
                                <div className="wf-textfield wf-textfield--large wf-textfield--fluid mr-4">
                                    <span className="SystemLimited-icon SystemLimited-icon-user wf-textfield__prefix-icon"></span>
                                    <Field
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
                                <div className="wf-form-group__title">Password</div>
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

                            {errors.password && touched.password ? (
                                <div className="wf-inline-error wf-inline-error--fluid">
                                    <div className="wf-inline-error__icon">
                                        <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                    </div>
                                    <div className="wf-inline-error__text">{errors.password}</div>
                                </div>
                            ) : null}

                            <div className="wf-form-group wf-form-group--fluid mb-0">
                                <label className="wf-checkbox" htmlFor="tos-policy">
                                    <span className="wf-checkbox__control">
                                        <span className="wf-checkbox__checkbox">
                                            <input id="tos-policy" checked={logged} type="checkbox" className="wf-checkbox__input" aria-invalid="false" role="checkbox" aria-checked="true" onChange={() => {
                                                setLogged(!logged);
                                            }} />
                                            <span className="wf-checkbox__backdrop"></span>
                                            <span className="wf-checkbox__icon">
                                                <span className="SystemLimited-icon SystemLimited-icon-tick-small"></span>
                                            </span>
                                        </span>
                                    </span>
                                    <span className="wf-checkbox__label">Keep me logged in</span>
                                </label>
                            </div>

                            <GoogleReCaptcha onVerify={onChange} refreshReCaptcha={refreshReCaptcha} />

                            <button className={`wf-button wf-button--large wf-button--fluid wf-button--primary ${((errors?.email || errors?.password) || (!values?.email || !values?.password)) && 'wf-button--disabled'} mt-12 ${loading && 'wf-button--loading'}`}>
                                <div className="wf-button__content">
                                    <React.Fragment>
                                        <div className="wf-button__text">Login</div>
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

                <div className="wf-split-page__heading__sub">Forgot password? <a onClick={() => router.push('/auth/password/email')}>Click here to reset</a>.</div>

                <div className="wf-split-page__heading__sub wf-split-page__heading__sub--recaptcha">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.
                </div>
            </div>

        </Master >
    )
}

export default Login