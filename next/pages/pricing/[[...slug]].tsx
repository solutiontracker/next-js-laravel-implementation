import type { NextPage } from 'next'
import React, { useEffect, useState, useRef } from "react";
import Master from 'components/layout/master'
import { service } from 'services/service'
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useAuth } from 'context/auth-provider';

const Pricing: NextPage = () => {

    const [plans, setPlans] = useState<any>([]);

    const _isMounted = useRef(true);

    const [loading, setLoading] = useState(false);

    const [months, setMonths] = useState(12);

    const router: any = useRouter();

    const { slug, action } = router.query;

    const { user, trial_days } = useAuth();

    useEffect(() => {
        return () => {
            _isMounted.current = false;
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/plan/plans`, { months: months, is_active: 1 })
            .then(
                response => {
                    if (_isMounted.current) {
                        if (response.success) {
                            setPlans(response?.data?.plans);
                        }
                        setLoading(false);
                    }
                },
                error => {
                    setLoading(false);
                }
            );
    }, [months]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (action !== undefined) {
                setTimeout(() => {
                    const target: any = document.getElementById(action);
                    if (target !== undefined) {
                        target?.scrollIntoView({ block: "start", behavior: 'smooth' })
                    }
                }, 500);
            }
        }
    }, [action])

    return (
        <Master>

            <Head>
                <title>Plans and Pricing | SystemLimited</title>
                <meta name="description" content="The Most Powerful All-in-One WordPress Media Library Folders and Image Optimization Plugin... Without the High Costs Over 5,000+ Professionals use SystemLimited." />
                <link rel="canonical" href="https://SystemLimited.io/" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="SystemLimited" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Plans and Pricing | SystemLimited" />
                <meta property="og:description" content="The Most Powerful All-in-One WordPress Media Library Folders and Image Optimization Plugin... Without the High Costs Over 5,000+ Professionals use SystemLimited." />
                <meta property="og:url" content="https://SystemLimited.io/" />
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`}/>
                <meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`}/>
                <meta property="og:image:width" content="1720" />
                <meta property="og:image:height" content="1000" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SystemLimited_io" />
                <meta name="twitter:title" content="Plans and Pricing | SystemLimited" />
                <meta name="twitter:description" content="The Most Powerful All-in-One WordPress Media Library Folders and Image Optimization Plugin... Without the High Costs Over 5,000+ Professionals use SystemLimited." />
                <meta name="twitter:creator" content="@SystemLimited_io" />
                <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                
                <link rel='dns-prefetch' href='//js.stripe.com' />
                <link rel='dns-prefetch' href='//fonts.googleapis.com' />
            </Head>

            <div className="wf-hero wf-hero--other-pages wf-hero--other-pages--pricing" id="pricing-plans">
                <div className="wf-hero__content">
                    <div className="wf-hero__title mt-64">Choose the plan that fits your needs</div>
                    <div className="wf-hero__sub mt-8"><span>{trial_days} days money back guarantee</span> &#8226; <span>Cancel anytime</span> &#8226; <span>No lock-in, no risk</span></div>
                </div>
            </div>

            {plans?.length > 0 && (
                <div className="wf-page wf-page--pricing">
                    <div className="wf-pricing">
                        <div className="wf-pricing__details">
                            <div className="wf-pricing__switch">
                                <div className="wf-pricing__switch__wrapper">
                                    <div className="wf-pricing__switch__duration">Monthly</div>
                                    <div className="wf-switch wf-switch--saving" onClick={() => {
                                        setMonths(months === 1 ? 12 : 1)
                                    }}>
                                        <input type="checkbox" checked={months === 12} />
                                        <label>Monthly/yearly switch</label>
                                    </div>
                                    <div className="wf-pricing__switch__duration">Yearly</div>
                                    <div className="wf-pricing__switch__saving">
                                        2 months FREE <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/plan-arrow.svg`} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="wf-pricing__features">
                                <div className="wf-pricing__features__single_feature">
                                    <div className="wf-pricing__features__single_feature__title">
                                        Number of Pro Websites
                                    </div>
                                </div>
                                <div className="wf-pricing__features__single_feature">
                                    <div className="wf-pricing__features__single_feature__title">
                                        SystemLimited CDN Monthly Bandwidth
                                    </div>
                                </div>
                                <div className="wf-pricing__features__single_feature">
                                    <div className="wf-pricing__features__single_feature__title">
                                        On the fly compression & WebP
                                    </div>
                                </div>
                                <div className="wf-pricing__features__single_feature">
                                    <div className="wf-pricing__features__single_feature__title">
                                        Media Library Pro Features
                                    </div>
                                </div>
                                <div className="wf-pricing__features__single_feature">
                                    <div className="wf-pricing__features__single_feature__title">
                                        SystemLimited Pro Modules
                                    </div>
                                </div>
                                <div className="wf-pricing__features__single_feature">
                                    <div className="wf-pricing__features__single_feature__title">
                                        Number of Free Websites
                                    </div>
                                </div>
                                <div className="wf-pricing__features__single_feature">
                                    <div className="wf-pricing__features__single_feature__title">
                                        Support
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="wf-pricing__plans-wrapper">
                            <div className="wf-pricing__plans">
                                {plans?.map((plan: any, key: any) =>
                                    <div className={`wf-pricing__single-plan ${plan?.alias === 'pro' && 'wf-pricing__single-plan--one '} ${plan?.alias === 'business' && 'wf-pricing__single-plan--two wf-pricing__single-plan--high-lighted'} ${plan?.alias === 'agency' && 'wf-pricing__single-plan--three'}`} key={key}>
                                        <div className="wf-pricing__single-plan__wrapper wf-pricing__single-plan__wrapper--both">
                                            <div className="wf-pricing__single-plan__name-details">
                                                <div className="wf-pricing__single-plan__title">
                                                    {
                                                        (() => {
                                                            if (plan?.alias === 'pro')
                                                                return (
                                                                    <span className="SystemLimited-icon SystemLimited-icon-pro-plan-one"></span>
                                                                )
                                                            else if (plan?.alias === 'business')
                                                                return (
                                                                    <span className="SystemLimited-icon SystemLimited-icon-pro-plan-two"></span>
                                                                )
                                                            else if (plan?.alias === 'agency')
                                                                return (
                                                                    <span className="SystemLimited-icon SystemLimited-icon-pro-plan-three"></span>
                                                                )
                                                        })()
                                                    }
                                                    {plan?.name}
                                                </div>
                                                <div className="wf-pricing__single-plan__sub">
                                                    {plan?.description}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="wf-pricing__single-plan__all-details">

                                            {Number(plan?.months) > 1 ? (
                                                <>
                                                    <div className="wf-pricing__single-plan__price">
                                                        <span className="wf-pricing__single-plan__price__currency">$</span>
                                                        <span className="wf-pricing__single-plan__price__amount">{(plan?.price / 12)?.toFixed(2)?.toString()?.split('.').shift()}.</span>
                                                        <span className="wf-pricing__single-plan__price__sub">{(plan?.price / 12)?.toFixed(2)?.toString()?.split('.').pop()}/month</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="wf-pricing__single-plan__price">
                                                    <span className="wf-pricing__single-plan__price__currency">$</span>
                                                    <span className="wf-pricing__single-plan__price__amount">{plan?.price.split('.').shift()}.</span>
                                                    <span className="wf-pricing__single-plan__price__sub">{plan?.price.split('.').pop()}/month</span>
                                                </div>
                                            )}

                                            {Number(plan?.months) > 1 ? (
                                                <>
                                                    <div className="wf-pricing__single-plan__total-price">
                                                        Billed at $ {plan?.price}/year
                                                    </div>
                                                    {plan?.saving && (
                                                        <div className="wf-pricing__single-plan__saving-details">
                                                            <span className="wf-pricing__single-plan__saving-details__block">
                                                                Saving ${plan?.saving}/year
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <div className="wf-pricing__single-plan__saving-details wf-pricing__single-plan__saving-details--single">
                                                        <span className="wf-pricing__single-plan__saving-details__block">
                                                            Save ${plan?.saving}
                                                        </span> with yearly pricing
                                                    </div>
                                                </>
                                            )}

                                            <div className="wf-pricing__single-plan__wrapper">
                                                <button className={`wf-button wf-button--primary wf-button--large wf-button--fluid ${(plan?.stripe_price_id === user?.subscription?.plan?.stripe_price_id && Number(user?.subscription?.total_subscriptions) > 0) && 'wf-button--disabled'} `} onClick={() => {
                                                    if (plan?.stripe_price_id !== user?.subscription?.plan?.stripe_price_id) {
                                                        router.push('/checkout/' + plan?.id);
                                                    }
                                                }}>
                                                    <div className="wf-button__content">
                                                        <div className="wf-button__text">
                                                            {
                                                                (() => {
                                                                    if ((user === null || user === undefined) || (user?.subscription?.plan?.id === undefined && Number(user?.subscription?.total_subscriptions) === 0))
                                                                        return `Start ${trial_days}-Days free trial`;
                                                                    else if (plan?.stripe_price_id === user?.subscription?.plan?.stripe_price_id && Number(user?.subscription?.total_subscriptions) > 0)
                                                                        return 'Current'
                                                                    else if (user?.subscription?.plan?.id === undefined && Number(user?.subscription?.total_subscriptions) > 0)
                                                                        return 'Upgrade'
                                                                    else
                                                                        return 'Change'
                                                                })()
                                                            }
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>

                                            <div className="wf-pricing__single-plan__features-list">
                                                <div className="wf-pricing__single-plan__single_feature">
                                                    <div className="wf-pricing__single-plan__single_feature__title">
                                                        Number of Pro Websites
                                                    </div>
                                                    {
                                                        (() => {
                                                            if (Number(plan?.websites) === 0)
                                                                return (
                                                                    <div className="wf-pricing__single-plan__single_feature__details">
                                                                        Unlimited
                                                                    </div>
                                                                )
                                                            else if (Number(plan?.websites) === 1)
                                                                return (
                                                                    <div className="wf-pricing__single-plan__single_feature__details">
                                                                        Just {Number(plan?.websites)}
                                                                    </div>
                                                                )
                                                            else if (Number(plan?.websites) > 1)
                                                                return (
                                                                    <div className="wf-pricing__single-plan__single_feature__details">
                                                                        Upto {Number(plan?.websites)}
                                                                    </div>
                                                                )
                                                        })()
                                                    }
                                                </div>
                                                <div className="wf-pricing__single-plan__single_feature">
                                                    <div className="wf-pricing__single-plan__single_feature__title">
                                                        SystemLimited CDN Monthly Bandwidth
                                                    </div>
                                                    <div className="wf-pricing__single-plan__single_feature__details" wf-tooltip={`${plan?.cdn_premium_bandwidth} GBs premium & ${plan?.cdn_volume_bandwidth} GBs volume`}>
                                                        {Number(plan?.cdn_premium_bandwidth + plan?.cdn_volume_bandwidth)} GBs <span className="SystemLimited-icon SystemLimited-icon SystemLimited-icon-question-mark"></span>
                                                    </div>
                                                </div>
                                                <div className="wf-pricing__single-plan__single_feature">
                                                    <div className="wf-pricing__single-plan__single_feature__title">
                                                        Media Library Pro Features
                                                    </div>
                                                    <div className="wf-pricing__single-plan__single_feature__details">
                                                        <span className="SystemLimited-icon SystemLimited-icon-tick"></span>
                                                    </div>
                                                </div>
                                                <div className="wf-pricing__single-plan__single_feature">
                                                    <div className="wf-pricing__single-plan__single_feature__title">
                                                        SystemLimited Pro Modules
                                                    </div>
                                                    <div className="wf-pricing__single-plan__single_feature__details">
                                                        <span className="SystemLimited-icon SystemLimited-icon-tick"></span>
                                                    </div>
                                                </div>
                                                <div className="wf-pricing__single-plan__single_feature">
                                                    <div className="wf-pricing__single-plan__single_feature__title">
                                                        On the fly compression & WebP
                                                    </div>
                                                    <div className="wf-pricing__single-plan__single_feature__details">
                                                        <span className="SystemLimited-icon SystemLimited-icon-tick"></span>
                                                    </div>
                                                </div>
                                                <div className="wf-pricing__single-plan__single_feature">
                                                    <div className="wf-pricing__single-plan__single_feature__title">
                                                        Number of Free Websites
                                                    </div>
                                                    <div className="wf-pricing__single-plan__single_feature__details">
                                                        Unlimited
                                                    </div>
                                                </div>
                                                <div className="wf-pricing__single-plan__single_feature">
                                                    <div className="wf-pricing__single-plan__single_feature__title">
                                                        Support
                                                    </div>
                                                    <div className="wf-pricing__single-plan__single_feature__details">
                                                        Priority Support
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="wf-pricing__plans__footer">
                                Not yet satisfied? <a onClick={(e: any) => {
                                    const target: any = document.getElementById('features');
                                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}>Compare features</a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="clearfix"></div>

            {/* <div className="wf-heading-section Container mt-64">
                <div className="wf-heading-section__title DisplaySmall">Trusted by the world most famous brands & companies.</div>
            </div>

            <div className="Container">
                <div className="wf-brands ">
                    <div className="wf-brands__wrapper">
                        <div className="wf-brands__single">
                            <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/brands/yahoo.png`} alt="" />
                        </div>
                        <div className="wf-brands__single">
                            <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/brands/yc.png`} alt="" />
                        </div>
                        <div className="wf-brands__single">
                            <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/brands/producthunt.png`} alt="" />
                        </div>
                        <div className="wf-brands__single">
                            <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/brands/radio.png`} alt="" />
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="wf-heading-section Container mt-128" id="features">
                <div className="wf-heading-section__title">Let's compare Free with Pro</div>
                <div className="wf-heading-section__sub wf-heading-section__sub--max-700 mt-8">Below you can see some in-depth difference between all plans of SystemLimited</div>
            </div>


            <div className="Container mt-64">
                <div className="wf-table-wrapper wf-table-wrapper--features">
                    <table className="wf-index-table wf-index-table--fluid wf-index-table--head-sticky wf-index-table--features">
                        <tr className="wf-index-table__head">
                            <th>Features list</th>
                            <th>Free</th>
                            <th>Pro</th>
                            <th>Business</th>
                            <th>Agency</th>
                        </tr>
                        <tr className="wf-index-table__body-row">
                            <td>Number of Pro Websites</td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-cancel"></span></td>
                            <td>Just 1</td>
                            <td>Upto 10</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr className="wf-index-table__body-row">
                            <td>CDN Monthly Free Bandwidth</td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-cancel"></span></td>
                            <td><span wf-tooltip="20 GBs premium & 80 GBs volume">100 GBs</span></td>
                            <td><span wf-tooltip="40 GBs premium & 160 GBs volume">200 GBs</span></td>
                            <td><span wf-tooltip="60 GBs premium & 240 GBs volume">300 GBs</span></td>
                        </tr>
                        <tr className="wf-index-table__body-row">
                            <td>Number of Free websites</td>
                            <td>Unlimited</td>
                            <td>Unlimited</td>
                            <td>Unlimited</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr className="wf-index-table__body-row">
                            <td>Priority Support</td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-cancel"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                        </tr>
                        <tr className="wf-index-table__body-row">
                            <td>Media Library Features</td>
                            <td><span wf-tooltip="Limited number of features."><span className="SystemLimited-icon SystemLimited-icon-alert"></span></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                        </tr>
                        <tr className="wf-index-table__body-row">
                            <td>SystemLimited Modules</td>
                            <td><span wf-tooltip="Limited number of modules."><span className="SystemLimited-icon SystemLimited-icon-alert"></span></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                        </tr>
                        <tr className="wf-index-table__body-row">
                            <td>SystemLimited CDN</td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-cancel"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                        </tr>
                        <tr className="wf-index-table__body-row">
                            <td>Image Compression</td>
                            <td><span wf-tooltip="Limited number of features."><span className="SystemLimited-icon SystemLimited-icon-alert"></span></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                        </tr>
                        <tr className="wf-index-table__body-row">
                            <td>Lazy Load</td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                        </tr>
                        <tr className="wf-index-table__body-row">
                            <td>Image Watermark</td>
                            <td><span wf-tooltip="Limited number of features."><span className="SystemLimited-icon SystemLimited-icon-alert"></span></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                        </tr>
                        <tr className="wf-index-table__body-row">
                            <td>Media Download</td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-cancel"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                        </tr>
                        <tr className="wf-index-table__body-row">
                            <td>Folders Color</td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-cancel"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                        </tr>
                        <tr className="wf-index-table__body-row">
                            <td>Starred Media & Folders</td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-cancel"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                        </tr>
                        <tr className="wf-index-table__body-row">
                            <td>Trash Bin</td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                        </tr>
                        <tr className="wf-index-table__body-row">
                            <td>WooCommerce Folders</td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-cancel"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                        </tr>
                        <tr className="wf-index-table__body-row">
                            <td>3rd Party Support</td>
                            <td><span wf-tooltip="Limited number of integrations."><span className="SystemLimited-icon SystemLimited-icon-alert"></span></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                        </tr>
                        <tr className="wf-index-table__body-row">
                            <td>Gutenberg Gallery</td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-cancel"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                            <td><span className="SystemLimited-icon SystemLimited-icon-tick"></span></td>
                        </tr>
                    </table>
                </div>
            </div>

            <div className="clearfix"></div>

            <div className="wf-cta-section wf-cta-section--white mt-64">
                <div className="wf-cta-section__wrapper">
                    <div className="wf-heading-section">
                        <div className="wf-heading-section__title">Ready? Get started with {trial_days}-Days FREE trial</div>
                        <div className="wf-heading-section__sub wf-heading-section__sub--max-700 mt-8">{trial_days} days money back guarantee &#8226; Cancel anytime &#8226; No lock-in, no risk</div>
                        <div className="wf-cta-section__wrapper__buttons">
                            <button className="wf-button wf-button--x-large mt-32" onClick={() => router.push('/features')}>
                                <div className="wf-button__content">
                                    <div className="wf-button__text">See all features</div>
                                </div>
                                <div className="wf-button__backdrop"></div>
                            </button>
                            <button className="wf-button wf-button--primary wf-button--x-large mt-32" onClick={(e: any) => {
                                const target: any = document.getElementById('pricing-plans');
                                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}>
                                <div className="wf-button__content">
                                    <div className="wf-button__text">Start {trial_days}-Days free trial</div>
                                </div>
                                <div className="wf-button__backdrop"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Master>
    )
}

export default Pricing
