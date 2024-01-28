import type { NextPage } from 'next'
import React, { useCallback, useEffect, useRef, useState } from "react";
import Master from 'components/layout/master'
import Head from 'next/head'
import { in_array } from 'helpers/helper';
import { useRouter } from 'next/router';
import {
    Formik,
    Form,
    Field,
} from 'formik';
import * as Yup from 'yup';
import { service } from 'services/service'
import {
    GoogleReCaptcha
} from 'react-google-recaptcha-v3';
import { useAuth } from 'context/auth-provider';

interface MyFormValues {
    option: number;
    name: string;
    email: string;
    subject: string;
    message?: string;
}

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .when(['option'], {
            is: (option: any) => in_array(Number(option), [1, 2, 3, 4]),
            then: Yup.string().email('Invalid email').required('Required')
        }),
    name: Yup.string()
        .when(['option'], {
            is: (option: any) => in_array(Number(option), [1, 2, 3, 4]),
            then: Yup.string().required('Field is required')
        }),
    subject: Yup.string()
        .when(['option'], {
            is: (option: any) => in_array(Number(option), [1, 2, 3, 4]),
            then: Yup.string().required('Field is required')
        }),
    message: Yup.string()
        .when(['option'], {
            is: (option: any) => in_array(Number(option), [1, 2, 3, 4]),
            then: Yup.string().required('Field is required')
        }),
});

const ContactUs: NextPage = () => {

    const _isMounted = useRef(true);

    const router: any = useRouter();

    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);

    const [recaptcha, setRecaptcha] = useState('');

    const options: any = ["What would you like to talk to us about?", "I have a pre-sale question", "I have a support question", "I have a billing question", "I have a different question", "I want to suggest a feature"];

    const initialValues: MyFormValues = { name: '', email: '', subject: '', message: '', option: 0 };

    const [server_errors, setServerErrors] = useState<any>();

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState(false);

    const { trial_days } = useAuth();
    
    useEffect(() => {
        return () => {
            _isMounted.current = false;
        }
    }, []);

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
                <title>Get In Touch | SystemLimited</title>
                <meta name="description" content="Have a question in mind? or need assistance with something get in touch with us." />
                <link rel="canonical" href="https://SystemLimited.io/" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="SystemLimited" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Get In Touch | SystemLimited" />
                <meta property="og:description" content="Have a question in mind? or need assistance with something get in touch with us." />
                <meta property="og:url" content="https://SystemLimited.io/" />
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`}/>
                <meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`}/>
                <meta property="og:image:width" content="1720" />
                <meta property="og:image:height" content="1000" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SystemLimited_io" />
                <meta name="twitter:title" content="Get In Touch | SystemLimited" />
                <meta name="twitter:description" content="Have a question in mind? or need assistance with something get in touch with us." />
                <meta name="twitter:creator" content="@SystemLimited_io" />
                <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                
                <link rel='dns-prefetch' href='//js.stripe.com' />
                <link rel='dns-prefetch' href='//fonts.googleapis.com' />
            </Head>

            <div className="wf-hero wf-hero--other-pages">
                <div className="wf-hero__content">
                    <div className="wf-hero__title mt-64">Get in touch with us</div>
                    <div className="wf-hero__sub mt-8"><span>We'd love to hear from you</span></div>
                </div>
            </div>

            <div className="wf-page--contact">
                <div className="wf-page--contact__contact-form mt-32">
                    {message ? (
                        <div className="wf-alert wf-alert--success wf-alert--fluid">
                            <div className="wf-alert__ribbon">
                                <span className="SystemLimited-icon SystemLimited-icon-circle-tick"></span>
                            </div>
                            <div className="wf-alert__content-wrapper">
                                <div className="wf-alert__heading">Thank you for getting in touch!</div>
                                <div className="wf-alert__content">We appreciate you contacting us. One of our team member will get back in touch with you soon! Have a great day!</div>
                            </div>
                        </div>
                    ) : (
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={(values, actions) => {
                                actions.setSubmitting(false);
                                setLoading(true);
                                service.post(`${process?.env?.NEXT_PUBLIC_SystemLimited_API_URL}/submit-contact-request`, { ...values, recaptcha: recaptcha })
                                    .then(
                                        response => {
                                            if (_isMounted.current) {
                                                if (response.success) {
                                                    actions?.resetForm({});
                                                    setMessage(true);
                                                } else {
                                                    if (response?.errors) {
                                                        setServerErrors(response?.errors)
                                                    }
                                                    setMessage(false);
                                                    setRefreshReCaptcha(r => !r);
                                                }
                                                setLoading(false);
                                            }
                                        },
                                        error => {
                                            setLoading(false);
                                            setMessage(false);
                                        }
                                    );
                            }}
                        >
                            {({ errors, touched, isValidating, values }: any) => (
                                <Form>
                                    <div className="wf-form-group wf-form-group--fluid mb-0">
                                        <div className="wf-select wf-select--fluid wf-select--large">
                                            <Field as="select" name="option" className="wf-select__input">
                                                {options?.map((value: any, key: any) =>
                                                    <option selected={key === values?.option} key={key} value={key}>{value}</option>
                                                )}
                                            </Field>
                                            <div className="wf-select__content">
                                                <span className="wf-select__value">{options[values?.option]}</span>
                                                <span className="wf-select__postfix-icon">
                                                    <span className="SystemLimited-icon SystemLimited-icon-chevron-down"></span>
                                                </span>
                                            </div>
                                            <div className="wf-select__backdrop"></div>
                                        </div>
                                    </div>
                                    {in_array(Number(values?.option), [1, 3, 4]) && (
                                        <>
                                            <div className="wf-form-group wf-form-group--fluid mt-12">
                                                <div className="wf-form-group__title">Name</div>
                                                <div className="wf-textfield wf-textfield--large wf-textfield--fluid">
                                                    <Field type="text" name="name" className="wf-textfield__input" placeholder="Your name" />
                                                    <div className="wf-textfield__backdrop"></div>
                                                </div>
                                            </div>
                                            {(errors.name && touched.name) || (server_errors?.name?.length > 0) ? (
                                                <div className="wf-inline-error wf-inline-error--fluid">
                                                    <div className="wf-inline-error__icon">
                                                        <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                                    </div>
                                                    <div className="wf-inline-error__text">{errors.name ? errors.name : server_errors?.name[0]}</div>
                                                    <br></br>
                                                    <br></br>
                                                </div>
                                            ) : null}

                                            <div className="wf-form-group wf-form-group--fluid">
                                                <div className="wf-form-group__title">Email</div>
                                                <div className="wf-textfield wf-textfield--large wf-textfield--fluid">
                                                    <Field type="email" name="email" className="wf-textfield__input" placeholder="Your email address" />
                                                    <div className="wf-textfield__backdrop"></div>
                                                </div>
                                                <div className="wf-form-group__sub">This email will be used to get in-touch with you by our support team.</div>
                                            </div>
                                            {(errors.email && touched.email) || (server_errors?.email?.length > 0) ? (
                                                <div className="wf-inline-error wf-inline-error--fluid">
                                                    <div className="wf-inline-error__icon">
                                                        <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                                    </div>
                                                    <div className="wf-inline-error__text">{errors.email ? errors.email : server_errors?.email[0]}</div>
                                                    <br></br>
                                                    <br></br>
                                                </div>
                                            ) : null}

                                            <div className="wf-form-group wf-form-group--fluid">
                                                <div className="wf-form-group__title">Subject</div>
                                                <div className="wf-textfield wf-textfield--large wf-textfield--fluid">
                                                    <Field type="text" name="subject" className="wf-textfield__input" placeholder="Reason for contacting" />
                                                    <div className="wf-textfield__backdrop"></div>
                                                </div>
                                            </div>
                                            {(errors.subject && touched.subject) || (server_errors?.subject?.length > 0) ? (
                                                <div className="wf-inline-error wf-inline-error--fluid">
                                                    <div className="wf-inline-error__icon">
                                                        <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                                    </div>
                                                    <div className="wf-inline-error__text">{errors.subject ? errors.subject : server_errors?.subject[0]}</div>
                                                    <br></br>
                                                    <br></br>
                                                </div>
                                            ) : null}

                                            <div className="wf-form-group wf-form-group--fluid mt-12">
                                                <div className="wf-form-group__title">Message</div>
                                                <div className="wf-textfield wf-textfield--textarea wf-textfield--fluid">
                                                    <Field as="textarea" name="message" className="wf-textfield__input" placeholder="Your message in details" rows={8}></Field>
                                                    <div className="wf-textfield__backdrop"></div>
                                                </div>
                                            </div>
                                            {(errors.message && touched.message) || (server_errors?.message?.length > 0) ? (
                                                <div className="wf-inline-error wf-inline-error--fluid">
                                                    <div className="wf-inline-error__icon">
                                                        <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                                    </div>
                                                    <div className="wf-inline-error__text">{errors.message ? errors.message : server_errors?.message[0]}</div>
                                                    <br></br>
                                                    <br></br>
                                                </div>
                                            ) : null}

                                            <GoogleReCaptcha onVerify={onChange} refreshReCaptcha={refreshReCaptcha} />
                                        </>
                                    )}
                                    {in_array(Number(values?.option), [0, 1, 3, 4]) && (
                                        <div className="wf-flex wf-flex--direction-row wf-flex--align-center wf-flex--justify-space-between mt-24">
                                            <span className="Caption text-color text-color--subdued">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.</span>

                                            <button className={`wf-button wf-button--large wf-button--primary ${((errors?.email || errors?.name || errors?.subject || errors?.message) || (!values?.email || !values?.name || !values?.subject || !values?.message)) && 'wf-button--disabled'} ${loading && 'wf-button--loading'}`}>
                                                <div className="wf-button__content">
                                                    <span className="wf-button__text">Send</span>
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
                                    )}
                                    {in_array(Number(values?.option), [2, 5]) && (
                                        <div className="wf-flex wf-flex--direction-row wf-flex--align-center wf-flex--justify-space-between mt-24">
                                            <span className="mr-16">
                                                {
                                                    (() => {
                                                        if (Number(values?.option) === 2)
                                                            return "For support queries please open a support ticket from dashboard."
                                                        else if (Number(values?.option) === 5)
                                                            return "To suggest a new feature, please head over to our feature request page."
                                                    })()
                                                }
                                            </span>

                                            <button className={`wf-button wf-button--large wf-button--primary`} onClick={() => {
                                                if (Number(values?.option) === 2)
                                                    router.push('/user/support')
                                                else if (Number(values?.option) === 5)
                                                    window.open("https://go.SystemLimited.io/submit-feature", "_blank")
                                            }}>
                                                <div className="wf-button__content">
                                                    <span className="wf-button__text">
                                                        {
                                                            (() => {
                                                                if (Number(values?.option) === 2)
                                                                    return "Open support ticket"
                                                                else if (Number(values?.option) === 5)
                                                                    return "Suggest a feature"
                                                            })()
                                                        }
                                                    </span>
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
                                    )}
                                </Form>
                            )}
                        </Formik>
                    )}
                </div>
            </div>

            <div className="clearfix"></div>

            <div className="wf-cta-section wf-cta-section--white">
                <div className="wf-cta-section__wrapper">
                    <div className="wf-heading-section">
                        <div className="wf-heading-section__title">Ready? Get started with {trial_days}-Days FREE trial.</div>
                        <div className="wf-heading-section__sub wf-heading-section__sub--max-700 mt-8">{trial_days} days money back guarantee &#8226; Cancel anytime &#8226; No lock-in, no risk</div>
                        <button className="wf-button wf-button--primary wf-button--x-large mt-32">
                            <div className="wf-button__content">
                                <div className="wf-button__text">Start {trial_days}-Days free trial</div>
                            </div>
                            <div className="wf-button__backdrop"></div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="clearfix"></div>

        </Master>
    )
}

export default ContactUs
