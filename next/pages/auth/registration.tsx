import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useRef, useEffect, useState, useCallback } from "react";
import Master from 'components/auth/layout/master'
import { service } from 'services/service'
import { useAuth } from 'context/auth-provider';
import { toast } from 'react-toastify';
import {
    Formik,
    Form,
    Field,
} from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import SocialLogin from 'components/auth/social-oauth/index';
import {
    GoogleReCaptcha
} from 'react-google-recaptcha-v3';
interface MyFormValues {
    first_name: string;
    last_name: string;
    email: string;
    profession: string;
    password: string;
    password_confirmation: string;
    tos: boolean;
}

const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('Required'),
    password: Yup.string()
        .min(6, 'Password length should minimum 6 characters!')
        .required('Required'),
    password_confirmation: Yup.string().required('Required').when("password", {
        is: (val: any) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
            [Yup.ref("password")],
            "Both password need to be the same"
        )
    }),
    profession: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    tos: Yup.bool().oneOf([true], "Must agree to TOS & Privacy Policy"),
});

const Registration: NextPage = () => {

    const initialValues: MyFormValues = { first_name: '', last_name: '', email: '', profession: '', password: '', password_confirmation: '', tos: false };

    const _isMounted = useRef(true);

    const [loading, setLoading] = useState(false);

    const [server_errors, setServerErrors] = useState<any>();

    const { updateToken } = useAuth();

    const router: any = useRouter();

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
                <title>Register for SystemLimited | SystemLimited</title>
                <link rel="canonical" href="https://SystemLimited.io/" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="SystemLimited" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Register for SystemLimited | SystemLimited" />
                <meta property="og:url" content="https://SystemLimited.io/" />
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                <meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                <meta property="og:image:width" content="1720" />
                <meta property="og:image:height" content="1000" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SystemLimited_io" />
                <meta name="twitter:title" content="Register for SystemLimited | SystemLimited" />
                <meta name="twitter:creator" content="@SystemLimited_io" />
                <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />

                <link rel='dns-prefetch' href='//js.stripe.com' />
                <link rel='dns-prefetch' href='//fonts.googleapis.com' />
            </Head>

            <div className="wf-split-page__heading mt-64">
                <div className="wf-split-page__heading__title">Create an account</div>
                <div className="wf-split-page__heading__sub mt-8">Already have a SystemLimited account? <a onClick={() => router.push('/auth/login')}>Login here</a>.</div>
            </div>
            <div className="wf-split-page__form mt-32">

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
                        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/auth/registration`, { ...values, recaptcha: recaptcha })
                            .then(
                                response => {
                                    if (_isMounted.current) {
                                        if (response.success) {
                                            updateToken(response?.data?.access_token)
                                        } else {
                                            if (response?.errors) {
                                                setServerErrors(response?.errors)
                                            } else {
                                                toast.error(response?.message, {
                                                    position: "bottom-right"
                                                });
                                            }
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
                    {({ errors, touched, isValidating, values }) => (
                        <Form>
                            <div className="wf-split-page__form__duo">
                                <div className="wf-form-group wf-form-group--fluid mb-0">
                                    <div className="wf-form-group__title">First name</div>
                                    <div className="wf-textfield wf-textfield--large wf-textfield--fluid mr-4">
                                        <Field
                                            id="first_name"
                                            name="first_name"
                                            type="text"
                                            className="wf-textfield__input"
                                            placeholder="Your first name..."
                                        />
                                        <div className="wf-textfield__backdrop"></div>
                                    </div>
                                </div>

                                <div className="wf-form-group wf-form-group--fluid mb-0">
                                    <div className="wf-form-group__title">Last name</div>
                                    <div className="wf-textfield wf-textfield--large wf-textfield--fluid mr-4">
                                        <Field
                                            id="last_name"
                                            name="last_name"
                                            type="text"
                                            className="wf-textfield__input"
                                            placeholder="Your last name..."
                                        />
                                        <div className="wf-textfield__backdrop"></div>
                                    </div>
                                </div>
                            </div>

                            {(errors.first_name && touched.first_name) || (server_errors?.first_name?.length > 0) ? (
                                <div className="wf-inline-error wf-inline-error--fluid">
                                    <div className="wf-inline-error__icon">
                                        <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                    </div>
                                    <div className="wf-inline-error__text">{errors.first_name ? errors.first_name : server_errors?.first_name[0]}</div>
                                </div>
                            ) : null}

                            <div className="wf-form-group wf-form-group--fluid mb-0">
                                <div className="wf-form-group__title">Email</div>
                                <div className="wf-textfield wf-textfield--large wf-textfield--fluid mr-4">
                                    <span className="SystemLimited-icon SystemLimited-icon-user wf-textfield__prefix-icon"></span>
                                    <Field
                                        id="email"
                                        name="email"
                                        type="text"
                                        className="wf-textfield__input"
                                        placeholder="Your email address..."
                                    />
                                    <div className="wf-textfield__backdrop"></div>
                                </div>
                            </div>

                            {(errors.email && touched.email) || (server_errors?.email?.length > 0) ? (
                                <div className="wf-inline-error wf-inline-error--fluid">
                                    <div className="wf-inline-error__icon">
                                        <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                    </div>
                                    <div className="wf-inline-error__text">{errors.email ? errors.email : server_errors?.email[0]}</div>
                                </div>
                            ) : null}

                            <div className="wf-form-group wf-form-group--fluid mb-0">
                                <div className="wf-form-group__title">I would describe myself as a</div>
                                <div className="wf-select wf-select--large wf-select--fluid">
                                    <Field as="select" name="profession" className="wf-select__input">
                                        <option value="Agency">Agency</option>
                                        <option value="Freelancer">Freelancer</option>
                                        <option value="Designer">Designer</option>
                                        <option value="Developer">Developer</option>
                                        <option value="Blogger">Blogger</option>
                                        <option value="Single">Single site owner</option>
                                        <option value="Other">Other</option>
                                    </Field>
                                    <div className="wf-select__content">
                                        <span className="wf-select__value">{values?.profession || 'Choose which describes you best'}</span>
                                        <span className="wf-select__postfix-icon">
                                            <span className="SystemLimited-icon SystemLimited-icon-chevron-down"></span>
                                        </span>
                                    </div>
                                    <div className="wf-select__backdrop"></div>
                                </div>
                            </div>

                            {(errors.profession && touched.profession) || (server_errors?.profession?.length > 0) ? (
                                <div className="wf-inline-error wf-inline-error--fluid">
                                    <div className="wf-inline-error__icon">
                                        <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                    </div>
                                    <div className="wf-inline-error__text">{errors.profession ? errors.profession : server_errors?.profession[0]}</div>
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

                            {(errors.password && touched.password) || (server_errors?.password?.length > 0) ? (
                                <div className="wf-inline-error wf-inline-error--fluid">
                                    <div className="wf-inline-error__icon">
                                        <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                    </div>
                                    <div className="wf-inline-error__text">{errors.password ? errors.password : server_errors?.password[0]}</div>
                                </div>
                            ) : null}

                            <div className="wf-form-group wf-form-group--fluid mb-0">
                                <div className="wf-form-group__title">Confirm password</div>
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

                            <div className="wf-form-group wf-form-group--fluid mb-0">
                                <label className="wf-checkbox" htmlFor="tos">
                                    <span className="wf-checkbox__control">
                                        <span className="wf-checkbox__checkbox">
                                            <Field type="checkbox" checked={values?.tos} name="tos" id="tos" className="wf-checkbox__input" />
                                            <span className="wf-checkbox__backdrop"></span>
                                            <span className="wf-checkbox__icon">
                                                <span className="SystemLimited-icon SystemLimited-icon-tick-small"></span>
                                            </span>
                                        </span>
                                    </span>
                                    <span className="wf-checkbox__label">I agree to SystemLimited <a onClick={(e: any) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        router.push('/terms-of-service')
                                    }}>TOS</a> & <a onClick={(e: any) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        router.push('/terms-of-service')
                                    }}>Privacy Policy</a>.</span>
                                </label>
                            </div>

                            {
                                errors.tos && touched.tos ? (
                                    <div className="wf-inline-error wf-inline-error--fluid">
                                        <div className="wf-inline-error__icon">
                                            <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                        </div>
                                        <div className="wf-inline-error__text">{errors.tos}</div>
                                    </div>
                                ) : null
                            }

                            <GoogleReCaptcha onVerify={onChange} refreshReCaptcha={refreshReCaptcha} />

                            <button className={`wf-button wf-button--large wf-button--fluid wf-button--primary mt-12 ${((errors?.first_name || errors?.password || errors?.password_confirmation || errors?.profession || errors?.email) || (!values?.first_name || !values?.password || !values?.password_confirmation || !values?.profession || !values?.email)) && 'wf-button--disabled'} ${loading && 'wf-button--loading'}`}>
                                <div className="wf-button__content">
                                    <React.Fragment>
                                        <div className="wf-button__text">Sign up</div>
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

                            <div className="wf-split-page__heading__sub wf-split-page__heading__sub--recaptcha">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.</div>
                        </Form>
                    )}
                </Formik>

            </div>
        </Master>
    )
}

export default Registration
