import type { NextPage } from 'next'
import React, { useEffect } from "react";
import Master from 'components/layout/master'
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useAuth } from 'context/auth-provider';

const Cdn: NextPage = () => {

    const router: any = useRouter();

    const { slug, action } = router.query;

    const { trial_days } = useAuth();
    
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
                <title>CDN for WordPress| SystemLimited</title>
                <meta name="description" content="SystemLimited CDN has been built specifically for WordPress. It only takes a few minutes to start delivering content to your users at blazing-fast speeds!" />
                <link rel="canonical" href="https://SystemLimited.io/" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="SystemLimited" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="CDN for WordPress| SystemLimited" />
                <meta property="og:description" content="SystemLimited CDN has been built specifically for WordPress. It only takes a few minutes to start delivering content to your users at blazing-fast speeds!" />
                <meta property="og:url" content="https://SystemLimited.io/" />
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`}/>
                <meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`}/>
                <meta property="og:image:width" content="1720" />
                <meta property="og:image:height" content="1000" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SystemLimited_io" />
                <meta name="twitter:title" content="CDN for WordPress| SystemLimited" />
                <meta name="twitter:description" content="SystemLimited CDN has been built specifically for WordPress. It only takes a few minutes to start delivering content to your users at blazing-fast speeds!" />
                <meta name="twitter:creator" content="@SystemLimited_io" />
                <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                
                <link rel='dns-prefetch' href='//js.stripe.com' />
                <link rel='dns-prefetch' href='//fonts.googleapis.com' />
            </Head>

            <div className="wf-hero wf-hero--other-pages">
                <div className="wf-hero__duo-wrapper">
                    <div className="wf-hero__content wf-hero__content--action-section">
                        <div className="wf-hero__title">CDN tailored for WordPress</div>
                        <div className="wf-hero__sub mt-8">SystemLimited CDN has been built specifically for WordPress. It will help you to start delivering content to your users at blazing-fast speeds by placing your files on a network of high-performance servers around the world, improving page load speeds and reducing bandwidth costs.</div>
                        <button className="wf-button wf-button--primary wf-button--x-large mt-32">
                            <div className="wf-button__content">
                                <div className="wf-button__text">Start {trial_days}-Days free trial</div>
                            </div>
                        </button>
                    </div>
                    <div className="wf-hero__content wf-hero__content--image-section">
                        <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/cdn/cdn-hero.svg`} alt="SystemLimited CDN" />
                    </div>
                </div>
                <div className="wf-cdn-map-section__stat-blocks__spacer"></div>
            </div>

            <div className="clearfix"></div>

            <div className="wf-cdn-map-section">
                <div className="wf-cdn-map-section__wrapper">
                    <div className="wf-cdn-map-section__stat-blocks">
                        <div className="wf-cdn-map-section__stat-blocks__wrapper">
                            <div className="wf-cdn-map-section__stat-blocks__block">
                                <div className="wf-cdn-map-section__stat-blocks__title">
                                    107
                                </div>
                                <div className="wf-cdn-map-section__stat-blocks__sub">
                                    Location
                                </div>
                            </div>
                            <div className="wf-cdn-map-section__stat-blocks__block">
                                <div className="wf-cdn-map-section__stat-blocks__title">
                                    80 Tbps+
                                </div>
                                <div className="wf-cdn-map-section__stat-blocks__sub">
                                    Network Backbone
                                </div>
                            </div>
                            <div className="wf-cdn-map-section__stat-blocks__block">
                                <div className="wf-cdn-map-section__stat-blocks__title">
                                    Under 28ms
                                </div>
                                <div className="wf-cdn-map-section__stat-blocks__sub">
                                    Average Global Latency
                                </div>
                            </div>
                            <div className="wf-cdn-map-section__stat-blocks__block">
                                <div className="wf-cdn-map-section__stat-blocks__title">
                                    10-80 Gbit
                                </div>
                                <div className="wf-cdn-map-section__stat-blocks__sub">
                                    Uplink per Server
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="wf-cdn-map-section__title">Serve users from a worldwide fast network of servers</div>
                    <div className="wf-cdn-map-section__sub mt-8">Our network spans across 6 continents and 70 countries</div>
                    <div className="wf-cdn-map-section__map mt-64">
                        <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/cdn/cdn-nodes-map.svg`} alt="SystemLimited CDN Network" />
                    </div>
                    <div className="wf-cdn-map-section__stat-blocks wf-cdn-map-section__stat-blocks--end" id="cdn-pricing">
                        <div className="wf-cdn-map-section__stat-blocks__head">
                            <div className="wf-cdn-map-section__stat-blocks__title">
                                Premium Network <span className="wf-badge wf-badge--success ml-4">107 PoPs</span>
                            </div>
                            <div className="wf-cdn-map-section__stat-blocks__sub">
                                Region based pricing and access to our full network.
                            </div>
                        </div>
                        <div className="wf-cdn-map-section__stat-blocks__wrapper">
                            <div className="wf-cdn-map-section__stat-blocks__block">
                                <div className="wf-cdn-map-section__stat-blocks__title">
                                    $0.04/GB
                                </div>
                                <div className="wf-cdn-map-section__stat-blocks__sub">
                                    Europe & North America
                                </div>
                            </div>
                            <div className="wf-cdn-map-section__stat-blocks__block">
                                <div className="wf-cdn-map-section__stat-blocks__title">
                                    $0.06/GB
                                </div>
                                <div className="wf-cdn-map-section__stat-blocks__sub">
                                    Asia & Oceania
                                </div>
                            </div>
                            <div className="wf-cdn-map-section__stat-blocks__block">
                                <div className="wf-cdn-map-section__stat-blocks__title">
                                    $0.075/GB
                                </div>
                                <div className="wf-cdn-map-section__stat-blocks__sub">
                                    South America
                                </div>
                            </div>
                            <div className="wf-cdn-map-section__stat-blocks__block">
                                <div className="wf-cdn-map-section__stat-blocks__title">
                                    $0.09/GB
                                </div>
                                <div className="wf-cdn-map-section__stat-blocks__sub">
                                    Middle East & Africa
                                </div>
                            </div>
                        </div>
                        <div className="wf-cdn-map-section__stat-blocks__head mt-32">
                            <div className="wf-cdn-map-section__stat-blocks__title">
                                Volume Network <span className="wf-badge wf-badge--success ml-4">8 PoPs</span>
                            </div>
                            <div className="wf-cdn-map-section__stat-blocks__sub">
                                For high bandwidth websites with a single global rate.
                            </div>
                        </div>
                        <div className="wf-cdn-map-section__stat-blocks__wrapper">
                            <div className="wf-cdn-map-section__stat-blocks__block">
                                <div className="wf-cdn-map-section__stat-blocks__title">
                                    $0.02/GB
                                </div>
                                <div className="wf-cdn-map-section__stat-blocks__sub">
                                    North America
                                </div>
                            </div>
                            <div className="wf-cdn-map-section__stat-blocks__block">
                                <div className="wf-cdn-map-section__stat-blocks__title">
                                    $0.02/GB
                                </div>
                                <div className="wf-cdn-map-section__stat-blocks__sub">
                                    Europe
                                </div>
                            </div>
                            <div className="wf-cdn-map-section__stat-blocks__block">
                                <div className="wf-cdn-map-section__stat-blocks__title">
                                    $0.02/GB
                                </div>
                                <div className="wf-cdn-map-section__stat-blocks__sub">
                                    Asia
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="clearfix"></div>

            <div className="wf-cdn-highlights-section">
                <div className="wf-cdn-map-section__stat-blocks__spacer wf-cdn-map-section__stat-blocks__spacer--end"></div>
                <div className="wf-cdn-highlights-section__wrapper">
                    <div className="wf-cdn-highlights-section__title">Built for WordPress, to speed up your website</div>
                    <div className="wf-cdn-highlights-section__sub mt-8">Speed up you website, get started with SystemLimited CDN</div>
                    <div className="wf-cdn-highlights-section__feature-blocks">
                        <div className="wf-cdn-highlights-section__feature-blocks__block">
                            <div className="wf-cdn-highlights-section__feature-blocks__icon">
                                <div className="SystemLimited-icon SystemLimited-icon-goal"></div>
                            </div>
                            <div className="wf-cdn-highlights-section__feature-blocks__title">
                                Tier 1 Network Partners
                            </div>
                            <div className="wf-cdn-highlights-section__feature-blocks__sub">
                                We use only carefully selected network providers in top tier data centers for the best reliability and performance.
                            </div>
                        </div>
                        <div className="wf-cdn-highlights-section__feature-blocks__block">
                            <div className="wf-cdn-highlights-section__feature-blocks__icon">
                                <div className="SystemLimited-icon SystemLimited-icon-secure"></div>
                            </div>
                            <div className="wf-cdn-highlights-section__feature-blocks__title">
                                NVMe + SSD Powered Servers
                            </div>
                            <div className="wf-cdn-highlights-section__feature-blocks__sub">
                                All of our CDN servers are powered by NVMe and SSD technology to ensure millisecond latencies when serving your files.
                            </div>
                        </div>
                        <div className="wf-cdn-highlights-section__feature-blocks__block">
                            <div className="wf-cdn-highlights-section__feature-blocks__icon">
                                <div className="SystemLimited-icon SystemLimited-icon-requests"></div>
                            </div>
                            <div className="wf-cdn-highlights-section__feature-blocks__title">
                                1 click setup
                            </div>
                            <div className="wf-cdn-highlights-section__feature-blocks__sub">
                                To start delivering your content via SystemLimited CDN hardly take a few minutes. Just install the plugin and you're ready to go.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="clearfix"></div>

            <div className="wf-cta-section wf-cta-section--white">
                <div className="wf-cta-section__wrapper">
                    <div className="wf-heading-section">
                        <div className="wf-heading-section__title">Ready? Get started with {trial_days}-Days FREE trial</div>
                        <div className="wf-heading-section__sub wf-heading-section__sub--max-700 mt-8">{trial_days} days money back guarantee &#8226; Cancel anytime &#8226; No lock-in, no risk</div>
                        <button className="wf-button wf-button--primary wf-button--x-large mt-32">
                            <div className="wf-button__content">
                                <div className="wf-button__text">Start {trial_days}-Day free trial</div>
                            </div>
                            <div className="wf-button__backdrop"></div>
                        </button>
                    </div>
                </div>
            </div>
        </Master>
    )
}

export default Cdn
