import type { NextPage } from 'next'
import Head from 'next/head'
import React from "react";
import Master from 'components/layout/master'
import { useRouter } from 'next/router';
import { ImgComparisonSlider } from '@img-comparison-slider/react';
import { useAuth } from 'context/auth-provider';
import FrequentQuestions from 'components/widgets/frequent-questions';

const Index: NextPage = () => {

    const router: any = useRouter();

    const { updateAction, trial_days } = useAuth();

    return (
        <Master>

            <Head>
                <title>SystemLimited - Your All-in-One WordPress Media Library Folders and Image Optimization Plugin</title>
                <meta name="description" content="Best WordPress media plugin to organize media files into folders, increase website speed by compressing and lazy loading images, advanced automatic watermarking and much more!" />
                <link rel="canonical" href="https://SystemLimited.io/" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="SystemLimited" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="SystemLimited - Your All-in-One WordPress Media Library Folders and Image Optimization Plugin" />
                <meta property="og:description" content="Best WordPress media plugin to organize media files into folders, increase website speed by compressing and lazy loading images, advanced automatic watermarking and much more!" />
                <meta property="og:url" content="https://SystemLimited.io/" />
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                <meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                <meta property="og:image:width" content="1720" />
                <meta property="og:image:height" content="1000" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SystemLimited_io" />
                <meta name="twitter:title" content="SystemLimited - Your All-in-One WordPress Media Library Folders and Image Optimization Plugin" />
                <meta name="twitter:description" content="Best WordPress media plugin to organize media files into folders, increase website speed by compressing and lazy loading images, advanced automatic watermarking and much more!" />
                <meta name="twitter:creator" content="@SystemLimited_io" />
                <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />

                <link rel='dns-prefetch' href='//js.stripe.com' />
                <link rel='dns-prefetch' href='//fonts.googleapis.com' />
            </Head>

            <div className="wf-hero">
                <div className="wf-hero__content">
                    <div className="wf-hero__title">All-in-One WordPress Media Library Folders and Image Optimization Plugin</div>
                    <div className="wf-hero__sub mt-8">Join thousands of professionals who uses SystemLimited to unclutter their Media Library and speed up their websites</div>
                    <button onClick={() => router.push('/pricing')} className="wf-button wf-button--primary wf-button--x-large mt-32">
                        <div className="wf-button__content">
                            <div className="wf-button__text">Start {trial_days}-Days free trial</div>
                        </div>
                    </button>
                    <div className="mt-12">Starting from $6<small>.25</small>/month after free trial. <a onClick={() => router.push('/pricing')}>View Plans</a></div>

                    <div className="wf-hero__sub"></div>
                    <div className="wf-hero__features mt-32">
                        <div className="features__block">
                            <div className="features__block__icon">
                                <span className="SystemLimited-icon SystemLimited-icon-module-folder"></span>
                            </div>
                            <div className="features__block__title">
                                Powerful Media Library
                            </div>
                        </div>
                        <div className="features__block">
                            <div className="features__block__icon">
                                <span className="SystemLimited-icon SystemLimited-icon-module-compress"></span>
                            </div>
                            <div className="features__block__title">
                                Image Compression
                            </div>
                        </div>
                        <div className="features__block">
                            <div className="features__block__icon">
                                <span className="SystemLimited-icon SystemLimited-icon-module-cdn"></span>
                            </div>
                            <div className="features__block__title">
                                Content Delivery Network (CDN)
                            </div>
                        </div>
                        <div className="features__block">
                            <div className="features__block__icon">
                                <span className="SystemLimited-icon SystemLimited-icon-module-lazyload"></span>
                            </div>
                            <div className="features__block__title">
                                Media Lazy Loading
                            </div>
                        </div>
                        <div className="features__block">
                            <div className="features__block__icon">
                                <span className="SystemLimited-icon SystemLimited-icon-module-watermark"></span>
                            </div>
                            <div className="features__block__title">
                                Image Watermark
                            </div>
                        </div>
                        <div className="features__block">
                            <div className="features__block__icon">
                                <span className="SystemLimited-icon SystemLimited-icon-module-woocommerce"></span>
                            </div>
                            <div className="features__block__title">
                                Woocommerce Support
                            </div>
                        </div>

                    </div>
                    <div className="wf-hero__before-after mt-64">
                        <div className="wf-hero__before-after__play" onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateAction("play-video");
                        }}>
                        </div>
                        <ImgComparisonSlider value="40" className="wf-hero__before-after__content" hover>
                            <figure slot="first" className="before">
                                <img slot="first" src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-before.png`} />
                                <figcaption>Before 😩</figcaption>
                            </figure>
                            <figure slot="second" className="after">
                                <img slot="second" src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-after.png`} />
                                <figcaption>After 😍</figcaption>
                            </figure>
                        </ImgComparisonSlider>
                    </div>
                </div>
            </div>

            <div className="clearfix"></div>
            <div className="Container">
                <div className="wf-heading-section mt-64">
                    <div className="wf-heading-section__title">Last Media Plugin you will ever need for WordPress</div>
                    <div className="wf-heading-section__sub mt-8">Just don’t take our words for it, see for yourself</div>
                </div>
            </div>

            <div className="wf-detail-blocks">
                <div className="wf-detail-block">
                    <div className="wf-detail-block__img-wrapper">
                        <div className="wf-detail-block__img-wrapper__image">
                            <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/powerful-media-library.png`} alt="Powerful Media Library SystemLimited" />
                        </div>
                    </div>
                    <div className="wf-detail-block__content">
                        <div className="wf-detail-block__content__sub">Media Library</div>
                        <div className="wf-detail-block__content__title">Powerful and Fast Media Library</div>
                        <div className="wf-detail-block__content__details mt-8">
                            Let’s face it: WordPress default media library is not easy to maintain. It doesn’t make sense to take thousands of images and store them in one folder – you end up with thousands of files, some of which are duplicates! SystemLimited is going to ease up your life by helping you organize your media library.</div>
                        <a className="wf-detail-block__content__cta mt-8" onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push('/features')
                        }}>
                            See all features
                            <span className="SystemLimited-icon SystemLimited-icon-arrow-right"></span>
                        </a>
                    </div>
                </div>
                <div className="wf-detail-block">
                    <div className="wf-detail-block__content">
                        <div className="wf-detail-block__content__sub">Image Compression</div>
                        <div className="wf-detail-block__content__title">Automatically compress images</div>
                        <div className="wf-detail-block__content__details mt-8">
                            SystemLimited allows you to automatically compress your images before you upload them. This reduces their size, which means that your website will perform better and load faster.</div>
                        <a className="wf-detail-block__content__cta mt-8" onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push('/features')
                        }}>
                            See all features
                            <span className="SystemLimited-icon SystemLimited-icon-arrow-right"></span>
                        </a>
                    </div>
                    <div className="wf-detail-block__img-wrapper">
                        <div className="wf-detail-block__img-wrapper__image">
                            <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/auto-image-compress.png`} alt="Automatically Compress Images SystemLimited" />
                        </div>
                    </div>
                </div>
                <div className="wf-detail-block">
                    <div className="wf-detail-block__img-wrapper">
                        <div className="wf-detail-block__img-wrapper__image">
                            <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/increase-speed-and-cdn.svg`} alt="SystemLimited CDN" />
                        </div>
                    </div>
                    <div className="wf-detail-block__content">
                        <div className="wf-detail-block__content__sub">Lightning Fast CDN</div>
                        <div className="wf-detail-block__content__title">Increase website speed, serve images via CDN</div>
                        <div className="wf-detail-block__content__details mt-8">
                            Even if you have the best web hosting in the world, your site will still be slowed down because of inefficient images. SystemLimited allows you to compress images on the fly and serve from a global network of servers geographically located near your website visitors. This means that people viewing your site will see higher optimized images and faster load times.</div>
                        <a className="wf-detail-block__content__cta mt-8" onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push('/features')
                        }}>
                            See all features
                            <span className="SystemLimited-icon SystemLimited-icon-arrow-right"></span>
                        </a>
                    </div>
                </div>
                <div className="wf-detail-block">
                    <div className="wf-detail-block__content">
                        <div className="wf-detail-block__content__sub">Auto Watermark</div>
                        <div className="wf-detail-block__content__title">Automatically watermark images</div>
                        <div className="wf-detail-block__content__details mt-8">
                            SystemLimited also allows you to automatically watermark all your images with a unique logo or text. Set up the watermark size, position, and strength. Preview your custom watermark before applying it to all the images and files in Media Library.</div>
                        <a className="wf-detail-block__content__cta mt-8" onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push('/features')
                        }}>
                            See all features
                            <span className="SystemLimited-icon SystemLimited-icon-arrow-right"></span>
                        </a>
                    </div>
                    <div className="wf-detail-block__img-wrapper">
                        <div className="wf-detail-block__img-wrapper__image">
                            <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/auto-image-watermark.png`} alt="Automatically Watermark Images SystemLimited" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="wf-milestones mt-128">
                <div className="wf-milestones__wrapper">
                    <div className="wf-heading-section">
                        <div className="wf-heading-section__title">Just a few numbers</div>
                        <div className="wf-heading-section__sub mt-8">Because they say number speaks louder than anything else</div>
                    </div>
                    <div className="wf-milestones__blocks mt-32">
                        <div className="wf-milestones__block">
                            <div className="wf-milestones__block__icon">
                                <span className="SystemLimited-icon SystemLimited-icon-module-user-folders"></span>
                            </div>
                            <div className="wf-milestones__block__title">
                                5,000+
                            </div>
                            <div className="wf-milestones__block__sub">
                                Happy Users
                            </div>
                        </div>
                        <div className="wf-milestones__block">
                            <div className="wf-milestones__block__icon">
                                <span className="SystemLimited-icon SystemLimited-icon-sidebar-support"></span>
                            </div>
                            <div className="wf-milestones__block__title">
                                24/7/365
                            </div>
                            <div className="wf-milestones__block__sub">
                                Customer Support
                            </div>
                        </div>
                        <div className="wf-milestones__block">
                            <div className="wf-milestones__block__icon">
                                <span className="SystemLimited-icon SystemLimited-icon-module-compress"></span>
                            </div>
                            <div className="wf-milestones__block__title">
                                10 Million
                            </div>
                            <div className="wf-milestones__block__sub">
                                Images compressed
                            </div>
                        </div>
                        <div className="wf-milestones__block">
                            <div className="wf-milestones__block__icon">
                                <span className="SystemLimited-icon SystemLimited-icon-module-star"></span>
                            </div>
                            <div className="wf-milestones__block__title">
                                4.9 Stars
                            </div>
                            <div className="wf-milestones__block__sub">
                                on WordPress
                            </div>
                        </div>
                    </div>
                    <div className="wf-milestones__cta mt-64">
                        <div className="wf-milestones__cta__content">
                            <div className="wf-milestones__cta__title">Get the #1 Most Powerful Wordpress Media Plugin Today</div>
                            <div className="wf-milestones__cta__sub">Join thousands of professionals who uses SystemLimited to upgrade their Media Library and speed up their websites.</div>
                        </div>
                        <div className="wf-milestones__cta__button">
                            <button onClick={() => router.push('/pricing')} className="wf-button wf-button--primary wf-button--x-large">
                                <div className="wf-button__content">
                                    <div className="wf-button__text">Start {trial_days}-Days free trial</div>
                                </div>
                                <div className="wf-button__backdrop"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="clearfix"></div>

            <FrequentQuestions />

            <div className="clearfix"></div>

            <div className="wf-cta-section mt-128">
                <div className="wf-cta-section__wrapper">
                    <div className="wf-heading-section">
                        <div className="wf-heading-section__title">Unlock full power of SystemLimited</div>
                        <div className="wf-heading-section__sub wf-heading-section__sub--max-700 mt-8">Setup takes less than 3 minutes. What are you waiting for?</div>
                        <button onClick={() => router.push('/pricing')} className="wf-button wf-button--primary wf-button--x-large mt-32">
                            <div className="wf-button__content">
                                <div className="wf-button__text">Start {trial_days}-Days free trial</div>
                            </div>
                            <div className="wf-button__backdrop"></div>
                        </button>
                    </div>
                </div>
            </div>

        </Master >
    )
}

export default Index