import type { NextPage } from 'next'
import React from "react";
import Master from 'components/layout/master'
import Head from 'next/head'
import { useAuth } from 'context/auth-provider';

const LtdDeal: NextPage = () => {

    const { trial_days } = useAuth();

    return (
        <Master>

            {/* <Head>
                <title>Life time deal | SystemLimited</title>
                <meta name="description" content="Description" />
                <link rel="canonical" href="https://SystemLimited.io/" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="SystemLimited" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Life time deal | SystemLimited" />
                <meta property="og:description" content="description" />
                <meta property="og:url" content="https://SystemLimited.io/" />
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`}/>
                <meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`}/>
                <meta property="og:image:width" content="1720" />
                <meta property="og:image:height" content="1000" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SystemLimited_io" />
                <meta name="twitter:title" content="Life time deal | SystemLimited" />
                <meta name="twitter:description" content="description" />
                <meta name="twitter:creator" content="@SystemLimited_io" />
                <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                
                <link rel='dns-prefetch' href='//js.stripe.com' />
                <link rel='dns-prefetch' href='//fonts.googleapis.com' />
            </Head>

            

            <div className="wf-hero wf-hero--other-pages">
                <div className="wf-hero__duo-wrapper">
                    <div className="wf-hero__content wf-hero__content--action-section">
                        <div className="wf-hero__title">SystemLimited LTD Giveaway.</div>
                        <div className="wf-hero__sub mt-8">SystemLimited is a high performance content delivery network that has been built for the future. It only takes a few minutes to start delivering content to your users at a blazing fast speed.</div>
                        <div className="wf-form-group wf-form-group--fluid mt-16">
                            <div className="wf-textfield wf-textfield--large wf-textfield--fluid">
                                <input type="text" className="wf-textfield__input" placeholder="Enter your full name" />
                                <div className="wf-textfield__backdrop"></div>
                            </div>
                        </div>
                        <div className="wf-form-group wf-form-group--fluid">
                            <div className="wf-textfield wf-textfield--large wf-textfield--fluid">
                                <input type="email" className="wf-textfield__input" placeholder="Enter your email address" />
                                <div className="wf-textfield__backdrop"></div>
                            </div>
                        </div>
                        <button className="wf-button wf-button--fluid wf-button--primary wf-button--large mt-4">
                            <div className="wf-button__content">
                                <div className="wf-button__text">I am feeling lucky</div>
                            </div>
                        </button>
                    </div>
                    <div className="wf-hero__content wf-hero__content--image-section">
                        <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/deal/hero-promo.svg`} alt="SystemLimited CDN" />
                    </div>
                </div>
                <div className="wf-hero__duo-wrapper">
                    <div className="wf-hero__content wf-hero__content--action-section">
                        <div className="wf-hero__title">Welcome, Ali</div>
                        <div className="wf-hero__sub mt-8">Thank you for participating in SystemLimited giveaway.</div>
                        <div className="wf-hero__sub">10 lucky contestants will be chosen randomly.</div>
                        <div className="wf-hero__sub mt-8">You can increase your chances of wining by inviting more friends in this giveaway which will earn you more entries thus increasing you chances.</div>
                        <div className="wf-form-group wf-form-group--fluid mt-16">
                            <div className="wf-textfield wf-textfield--large wf-textfield--fluid">
                                <span className="SystemLimited-icon SystemLimited-icon-clipboard wf-textfield__prefix-icon"></span>
                                <input type="text" className="wf-textfield__input" placeholder="Your affiliates link" value="https://SystemLimited.io/lifetime-deal?ref=2345435"/>
                                <button className={`wf-button wf-button--primary wf-button--slim wf-textfield__postfix-button`} >
                                    <div className="wf-button__content">
                                        <span className="wf-button__text">Copy</span>
                                    </div>
                                </button>
                                <div className="wf-textfield__backdrop"></div>
                            </div>
                        </div>

                        <div className="wf-hero__sub mt-4">You currently have <b>2 entries</b> and <b>1 friend refereed</b>.</div>
                        <div className="wf-hero__sub-alt mt-8">not Ali? click here logout.</div>
                    </div>
                    <div className="wf-hero__content wf-hero__content--image-section">
                        <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/deal/hero-promo.svg`} alt="SystemLimited CDN" />
                    </div>
                </div>
            </div>

            <div className="clearfix"></div>
            <div className="wf-deal-section">
                <div className="wf-deal-section__wrapper">
                    <div className="wf-deal-section__stat-blocks">
                        <div className="wf-deal-section__stat-blocks__block">
                            <div className="wf-deal-section__stat-blocks__title">
                                24
                            </div>
                            <div className="wf-deal-section__stat-blocks__sub">
                                Days Left
                            </div>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="wf-deal-section__wrapper__inner">
                        <div className="wf-deal-section__features">
                            <div className="wf-deal-section__features__block">
                                <div className="wf-deal-section__features__single">
                                    <div className="wf-deal-section__features__title">
                                        30+
                                    </div>
                                    <div className="wf-deal-section__features__sub">
                                        Pro Modules
                                    </div>
                                </div>
                                <div className="wf-deal-section__features__single">
                                    <div className="wf-deal-section__features__title">
                                        Lifetime
                                    </div>
                                    <div className="wf-deal-section__features__sub">
                                        Pro Updates
                                    </div>
                                </div>
                            </div>
                            <div className="wf-deal-section__features__block">
                                <div className="wf-deal-section__features__single">
                                    <div className="wf-deal-section__features__title">
                                        Upto 100 GBs
                                    </div>
                                    <div className="wf-deal-section__features__sub">
                                        CDN Bandwidth Included
                                    </div>
                                </div>
                                <div className="wf-deal-section__features__single">
                                    <div className="wf-deal-section__features__title">
                                        Upto 10
                                    </div>
                                    <div className="wf-deal-section__features__sub">
                                        Pro Websites
                                    </div>
                                </div>
                            </div>
                            <div className="wf-deal-section__features__block">
                                <div className="wf-deal-section__features__single">
                                    <div className="wf-deal-section__features__title">
                                        Priority Support
                                    </div>
                                    <div className="wf-deal-section__features__sub">
                                        Your tickets will be prioritized
                                    </div>
                                </div>
                                <div className="wf-deal-section__features__single">
                                    <div className="wf-deal-section__features__title">
                                        More +
                                    </div>
                                    <div className="wf-deal-section__features__sub">
                                        Alot of more perks and features
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="wf-deal-section__deal-details">
                            <div className="wf-deal-section__deal-details__title">
                                Lifetime Deals
                            </div>
                            <div className="wf-deal-section__deal-details__blocks-wrapper">
                                <div className="wf-deal-section__deal-details__block">
                                    <div className="wf-deal-section__deal-details__block__title">
                                        Pro LTD
                                    </div>
                                    <div className="wf-deal-section__deal-details__block__sub">
                                        <span className="line-through">$300</span> $90
                                    </div>
                                </div>
                                <div className="wf-deal-section__deal-details__block">
                                    <div className="wf-deal-section__deal-details__block__title">
                                        Business LTD
                                    </div>
                                    <div className="wf-deal-section__deal-details__block__sub">
                                    <span className="line-through">$600</span> $180
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="wf-flex-section">
                    <div className="wf-flex-section__title">
                        Empowering thousands of websites from all over the world
                    </div>
                    <div className="wf-flex-section__counters">
                        <div className="wf-flex-section__counters__block">
                            <div className="wf-flex-section__counters__block__title">
                                35.82 Billion
                            </div>
                            <div className="wf-flex-section__counters__block__description">
                                Images Optimized
                            </div>
                        </div>
                        <div className="wf-flex-section__counters__block">
                            <div className="wf-flex-section__counters__block__title">
                               200,000
                            </div>
                            <div className="wf-flex-section__counters__block__description">
                                Websites Optimized
                            </div>
                        </div>
                        <div className="wf-flex-section__counters__block">
                            <div className="wf-flex-section__counters__block__title">
                                200 TB
                            </div>
                            <div className="wf-flex-section__counters__block__description">
                                Monthly CDN Bandwidth
                            </div>
                        </div>
                        <div className="wf-flex-section__counters__block">
                            <div className="wf-flex-section__counters__block__title">
                                100,000
                            </div>
                            <div className="wf-flex-section__counters__block__description">
                                Active Users
                            </div>
                        </div>
                    </div>
                    <div className="wf-flex-section__reviews">
                        <div className="wf-flex-section__reviews__block">
                            <div className="wf-flex-section__reviews__block__review">
                                We can’t stress this enough: our outstanding WordPress support is available with live chat 24/7, and we’ll help you with absolutely any WordPress issue. 
                            </div>
                            <div className="wf-flex-section__reviews__user">
                                <div className="wf-flex-section__reviews__block__avatar" style={{backgroundImage: "url('https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200')"}}>
                                </div>
                                <div className="wf-flex-section__reviews__block__name">
                                    Johyn Doe
                                </div>
                                <div className="wf-flex-section__reviews__block__job">
                                    CEO at Alphabets INC
                                </div>
                            </div>
                        </div>
                        <div className="wf-flex-section__reviews__block">
                            <div className="wf-flex-section__reviews__block__review">
                                We can’t stress this enough: our outstanding WordPress support is available with live chat 24/7, and we’ll help you with absolutely any WordPress issue. 
                            </div>
                            <div className="wf-flex-section__reviews__user">
                                <div className="wf-flex-section__reviews__block__avatar" style={{backgroundImage: "url('https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200')"}}>
                                </div>
                                <div className="wf-flex-section__reviews__block__name">
                                    Johyn Doe
                                </div>
                                <div className="wf-flex-section__reviews__block__job">
                                    CEO at Alphabets INC
                                </div>
                            </div>
                        </div>
                        <div className="wf-flex-section__reviews__block">
                            <div className="wf-flex-section__reviews__block__review">
                                We can’t stress this enough: our outstanding WordPress support is available with live chat 24/7, and we’ll help you with absolutely any WordPress issue. 
                            </div>
                            <div className="wf-flex-section__reviews__user">
                                <div className="wf-flex-section__reviews__block__avatar" style={{backgroundImage: "url('https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200')"}}>
                                </div>
                                <div className="wf-flex-section__reviews__block__name">
                                    Johyn Doe
                                </div>
                                <div className="wf-flex-section__reviews__block__job">
                                    CEO at Alphabets INC
                                </div>
                            </div>
                        </div>
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
            </div> */}

        </Master>
    )
}

export default LtdDeal
