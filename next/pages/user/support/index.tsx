import type { NextPage } from 'next'
import React, { useCallback, useEffect, useRef, useState } from "react";
import Head from 'next/head'
import { in_array } from 'helpers/helper';
import { useAuth } from 'context/auth-provider';
import Master from 'components/user/layout/master'
import {
    Formik,
    Form,
    Field,
} from 'formik';
import * as Yup from 'yup';
import { service } from 'services/service'
import { useRouter } from 'next/router';

interface MyFormValues {
    website_id: number;
    reason?: string;
    message?: string;
}
const validationSchema = Yup.object().shape({
    reason: Yup.string().required('Field is required'),
    message: Yup.string().required('Field is required'),
});

const Support: NextPage = () => {

    const router: any = useRouter();

    const _isMounted = useRef(true);

    const initialValues: MyFormValues = { website_id: -1, reason: '', message: '' };

    const [websites, setWebsites] = useState<any>([]);

    const [articles, setArticles] = useState<any>([]);

    const [server_errors, setServerErrors] = useState<any>();

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState(false);

    const [searchWrapper, setSearchWrapper] = useState(false);

    const [_action, setAction] = useState('');

    const { user } = useAuth();

    const [search, setSearch] = useState('');

    const initialRender = useRef(false);

    useEffect(() => {
        if (initialRender.current && search !== "#") {
            const timeoutId = setTimeout(() => searchArticles(search), 1000);
            return () => clearTimeout(timeoutId);
        }
        initialRender.current = true;
    }, [search]);

    useEffect(() => {
        return () => {
            _isMounted.current = false;
            initialRender.current = false;
        }
    }, []);

    const searchArticles = (keyword: any) => {
        setAction('search-articles');
        setSearchWrapper(true)
        service.post(`${process?.env?.NEXT_PUBLIC_SystemLimited_API_URL}/search-articles`, { keyword: keyword })
            .then(
                response => {
                    if (_isMounted.current) {
                        if (response.success) {
                            setArticles(response?.data)
                        }
                        setAction('');
                    }
                },
                error => {
                    setAction('');
                }
            );
    }

    useEffect(() => {
        setLoading(true);
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/website/listing/1`, { limit: 100, type: 'all' })
            .then(
                response => {
                    if (_isMounted.current) {
                        if (response.success) {
                            setWebsites(response?.data?.websites?.data)
                        }
                        setLoading(false);
                    }
                },
                error => {
                    setLoading(false);
                }
            );
    }, []);

    useEffect(() => {
        document.addEventListener("click", documentClicked);
        return () => {
            // unsubscribe event
            document.removeEventListener("click", documentClicked);
        };
    }, [])

    //Document click
    const documentClicked = () => {
        setSearchWrapper(false)
    }

    return (
        <Master>

            <Head>
                <title>Support | SystemLimited</title>
                <link rel="canonical" href="https://SystemLimited.io/" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="SystemLimited" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Support | SystemLimited" />
                <meta property="og:url" content="https://SystemLimited.io/" />
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`}/>
                <meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`}/>
                <meta property="og:image:width" content="1720" />
                <meta property="og:image:height" content="1000" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SystemLimited_io" />
                <meta name="twitter:title" content="Support | SystemLimited" />
                <meta name="twitter:creator" content="@SystemLimited_io" />
                <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                
                <link rel='dns-prefetch' href='//js.stripe.com' />
                <link rel='dns-prefetch' href='//fonts.googleapis.com' />
            </Head>

            <div className="wf-page wf-page--dashboard">
                
                {Number(user?.is_free) === 1 ? (
                    <div className="wf-page--dashboard__wrapper wf-tabs mt-32">
                        <div className="wf-tabs__tab-content">
                            <div className="wf-web-list wf-web-list--empty">
                                <div className="wf-web-list--empty__image"><img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/empty-illustration.svg`} alt="" /></div>
                                <div className="wf-web-list--empty__title">Support is only available in PRO Plan, We’ve put together some great resources to help you fix many common issues with your SystemLimited. Make sure to check out our Helpful Docs as well, because they may have the answer you are looking for.</div>
                                <div className="wf-button-group">
                                    <button className="wf-button wf-button--primary wf-button--medium" onClick={() => {
                                        router.push('/pricing');
                                    }}>
                                        <div className="wf-button__content">
                                            <span className="wf-button__text">Upgrade Plan</span>
                                        </div>
                                    </button>
                                    <button className="wf-button wf-button--medium" onClick={(e: any) => {
                                        window.open('https://help.SystemLimited.io/help', '_blank');
                                    }}>
                                        <div className="wf-button__content">
                                            <span className="wf-button__text">Helpful Docs</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="wf-flex mb-20">
                            <div className="wf-page--dashboard__title">Get help straight from the team</div>
                        </div>
                        <div className="wf-page--support">

                            <div className="wf-page--support__wrapper">
                                <div className="wf-page--dashboard__wrapper wf-page--support__wrapper__docs">
                                    <div className="wf-page--support__wrapper__docs__details">
                                        <div className="Heading">Browse through our Helpful Docs</div>
                                        <div className="Body mt-4">We’ve put together some great resources to help you fix many common issues with your SystemLimited. Make sure to check out our Helpful Docs as well, because they may have the answer you are looking for.</div>
                                        <button className="wf-button wf-button--medium mt-12" onClick={(e: any) => {
                                            window.open('https://help.SystemLimited.io/help', '_blank');
                                        }}>
                                            <div className="wf-button__content">
                                                <span className="wf-button__text">Helpful Docs</span>
                                            </div>
                                        </button>
                                    </div>
                                    <div className="wf-page--support__wrapper__docs__image">
                                        <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/support-illustration.svg`} alt="" />
                                    </div>
                                </div>
                            </div>

                            <div className="wf-page--support__wrapper">
                                {message ? (
                                    <div className="wf-alert wf-alert--success wf-alert--fluid">
                                        <div className="wf-alert__ribbon">
                                            <span className="SystemLimited-icon SystemLimited-icon-circle-tick"></span>
                                        </div>
                                        <div className="wf-alert__content-wrapper">
                                            <div className="wf-alert__heading">Support ticket created successfully!</div>
                                            <div className="wf-alert__content">We appreciate you contacting us. One of our team member will get back in touch with you as soon as possible! Have a great day!</div>
                                        </div>
                                    </div>
                                ) : (
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={validationSchema}
                                        onSubmit={(values, actions) => {
                                            actions.setSubmitting(false);
                                            setLoading(true);
                                            service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/support/create-ticket`, { ...values })
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
                                        {({ errors, touched, isValidating, values, setFieldValue }: any) => (
                                            <Form>
                                                <div className="wf-page--dashboard__wrapper">
                                                    <div className="wf-form-group wf-form-group--fluid">
                                                        <div className="wf-form-group__title">Your Email</div>
                                                        <div className="wf-textfield wf-textfield--fluid wf-textfield--disabled mr-4">
                                                            <input type="text" className="wf-textfield__input" value={user?.email} placeholder="Email Address" disabled />
                                                            <div className="wf-textfield__backdrop"></div>
                                                        </div>
                                                        <div className="wf-form-group__sub">This email will be used to get in-touch with you by our support team.</div>
                                                    </div>
                                                    <div className="wf-form-group wf-form-group--fluid mt-12">
                                                        <div className="wf-form-group__title">Website</div>
                                                        <div className="wf-select wf-select--fluid">
                                                            <Field as="select" name="website_id" className="wf-select__input">
                                                                <option selected={Number(values?.website_id) === -1} value={'-1'}>Select your website which you are facing issue</option>
                                                                <option selected={Number(values?.website_id) === 0} value={'0'}>My issues is not website related</option>
                                                                {websites?.map((website: any, key: any) =>
                                                                    <option selected={website?.id === Number(values?.website_id)} key={key} value={website?.id}>{website?.url}</option>
                                                                )}
                                                            </Field>
                                                            <div className="wf-select__content">
                                                                <span className="wf-select__value">
                                                                    {
                                                                        (() => {
                                                                            if (websites?.find((website: any) => website?.id === Number(values?.website_id))?.id !== undefined)
                                                                                return websites?.find((website: any) => website?.id === Number(values?.website_id))?.url
                                                                            else if (Number(values?.website_id) === 0)
                                                                                return "My issues is not website related"
                                                                            else
                                                                                return "Select your website which you are facing issue";
                                                                        })()
                                                                    }
                                                                </span>
                                                                <span className="wf-select__postfix-icon">
                                                                    <span className="SystemLimited-icon SystemLimited-icon-chevron-down"></span>
                                                                </span>
                                                            </div>
                                                            <div className="wf-select__backdrop"></div>
                                                        </div>
                                                    </div>
                                                    <div className="wf-form-group wf-form-group--fluid mt-12">
                                                        <div className="wf-form-group__title">Reason</div>
                                                        <div className="wf-dropdown wf-dropdown--active">
                                                            <div onClick={(e: any) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setSearchWrapper(true);
                                                            }} className="wf-textfield wf-textfield--fluid mr-4">
                                                                <input type="text" name="reason" onChange={(e: any) => {
                                                                    setFieldValue('reason', e?.target?.value);
                                                                    setSearch(e?.target?.value);

                                                                }} value={values?.reason} className="wf-textfield__input" placeholder="Summarize the issue you are facing in a single line." />
                                                                <div className="wf-textfield__backdrop"></div>
                                                            </div>

                                                            {(errors.reason && touched.reason) || (server_errors?.reason?.length > 0) ? (
                                                                <div className="wf-inline-error wf-inline-error--fluid">
                                                                    <div className="wf-inline-error__icon">
                                                                        <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                                                    </div>
                                                                    <div className="wf-inline-error__text">{errors.reason ? errors.reason : server_errors?.reason[0]}</div>
                                                                    <br></br>
                                                                    <br></br>
                                                                </div>
                                                            ) : null}

                                                            {(articles?.length > 0 || _action === "search-articles") && searchWrapper && (
                                                                <div className="wf-dropdown__menu wf-dropdown__menu--fluid wf-dropdown--right wf-dropdown--child-left wf-dropdown__menu--scroll">
                                                                    <ul className="wf-dropdown-wrapper">
                                                                        {_action !== "search-articles" && articles?.map((article: any, key: any) =>
                                                                            <li onClick={() => {
                                                                                window.open(`https://help.SystemLimited.io/help/${article?.slug}`, '_blank');
                                                                            }} key={key} className="wf-dropdown-wrapper__item-wrapper">
                                                                                <a className="wf-dropdown__menu__item">
                                                                                    <span className="wf-dropdown__menu__item__text">{article?.title}</span>
                                                                                </a>
                                                                            </li>
                                                                        )}
                                                                        {_action === "search-articles" && (
                                                                            <li className="wf-dropdown-wrapper__item-wrapper">
                                                                                <div className="wf-load-more">
                                                                                    <svg className="spinit" view-box="0 0 50 50">
                                                                                        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4"></circle>
                                                                                    </svg>
                                                                                </div>
                                                                            </li>
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="wf-form-group wf-form-group--fluid mt-12">
                                                        <div className="wf-form-group__title">Explain issue you're facing</div>
                                                        <div className="wf-textfield wf-textfield--textarea wf-textfield--fluid">
                                                            <Field as="textarea" name="message" className="wf-textfield__input" placeholder="Your message" rows={8}></Field>
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
                                                    <div className="wf-flex wf-flex--direction-row wf-flex--justify-flex-end mt-16">
                                                        <button className={`wf-button wf-button--large wf-button--primary ${((errors?.website_id || errors?.message || errors?.reason) || (!values?.website_id || !values?.message || !values?.reason)) && 'wf-button--disabled'} mt-12 ${loading && 'wf-button--loading'}`}>
                                                            <div className="wf-button__content">
                                                                <span className="wf-button__text">Submit</span>
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
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Master>
    )
}

export default Support
