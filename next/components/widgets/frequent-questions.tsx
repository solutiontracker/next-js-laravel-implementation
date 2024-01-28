import React, { useState } from 'react'
import { useRouter } from 'next/router';
import { in_array } from 'helpers/helper';
import { useAuth } from 'context/auth-provider';

const FrequentQuestions = () => {

    const { trial_days } = useAuth();
    
    const router: any = useRouter();

    const [tab, setTab] = useState('install');

    const [block, setBlock] = useState<any>([]);

    const updateBlock = (value: any) => {
        const count = block?.filter((bl: any) => bl === value)?.length;
        if (count > 0) {
            setBlock(block?.filter((bl: any) => bl !== value));
        } else {
            setBlock([...block, value]);
        }
    }

    return (
        <>
            <div className="wf-heading-section Container mt-64">
                <div className="wf-heading-section__title">Frequently Asked Questions</div>
                <div className="wf-heading-section__sub wf-heading-section__sub--max-700 mt-8">Do you have a question about SystemLimited? See the list below for our most frequently asked questions. If your question is not listed here, then please <a onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push('/contact-us');
                }}>contact us</a></div>
            </div>

            <div className="wf-button-group wf-button-group--fluid wf-button-group--align-center Container mt-64">
                <button className={`wf-button wf-button--medium ${tab === 'install' && 'wf-button--active'}`} onClick={(e: any) => {
                    if (tab !== 'install') {
                        setTab('install');
                    }
                }}>
                    <div className="wf-button__content">
                        <div className="wf-button__text">Install & setup</div>
                    </div>
                    <div className="wf-button__backdrop"></div>
                </button>
                <button className={`wf-button wf-button--medium ${tab === 'license' && 'wf-button--active'}`} onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (tab !== 'license') {
                        setTab('license');
                    }
                }}>
                    <div className="wf-button__content">
                        <div className="wf-button__text">License & terms</div>
                    </div>
                    <div className="wf-button__backdrop"></div>
                </button>
                <button className={`wf-button wf-button--medium ${tab === 'free_version' && 'wf-button--active'}`} onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (tab !== 'free_version') {
                        setTab('free_version');
                    }
                }}>
                    <div className="wf-button__content">
                        <div className="wf-button__text">Free version</div>
                    </div>
                    <div className="wf-button__backdrop"></div>
                </button>
                <button className={`wf-button wf-button--medium ${tab === 'pro_version' && 'wf-button--active'}`} onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (tab !== 'pro_version') {
                        setTab('pro_version');
                    }
                }}>
                    <div className="wf-button__content">
                        <div className="wf-button__text">Pro version</div>
                    </div>
                    <div className="wf-button__backdrop"></div>
                </button>
            </div>

            <div className="wf-accordion mt-32 text-center Container">

                {tab === 'install' && (
                    <>
                        <div className={`wf-accordion__block ${in_array(1, block) && 'wf-accordion__block--active'}`}>
                            <div className="wf-accordion__header-section" onClick={(e: any) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateBlock(1);
                            }}>
                                <div className="wf-accordion__title">
                                    Who should use SystemLimited?
                                </div>
                                <div className="wf-accordion__collapsible-icon">
                                    <span className="SystemLimited-icon SystemLimited-icon-chevron-down"></span>
                                </div>
                            </div>
                            <div className="wf-accordion__body-section">
                                <div className="wf-accordion__content">SystemLimited is perfect for freelancers, agencies, business owners, bloggers, designers, developers, photographers, and basically everyone else. If you want to organize your WordPress Media Library, Compress images, apply watermark on images and speed up your website by serving images directly form a fast and powerful CDN network then you need to use SystemLimited — SystemLimited has a lot to offer.</div>
                            </div>
                        </div>
                        <div className={`wf-accordion__block ${in_array(2, block) && 'wf-accordion__block--active'}`} onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateBlock(2);
                        }}>
                            <div className="wf-accordion__header-section">
                                <div className="wf-accordion__title">
                                    Do I need coding skills to use SystemLimited?
                                </div>
                                <div className="wf-accordion__collapsible-icon">
                                    <span className="SystemLimited-icon SystemLimited-icon-chevron-down"></span>
                                </div>
                            </div>
                            <div className="wf-accordion__body-section">
                                <div className="wf-accordion__content">SystemLimited is built with beginners in mind. Anyone without any coding background can easily use SystemLimited for every needs. It's all plug and play.</div>
                            </div>
                        </div>
                        <div className={`wf-accordion__block ${in_array(3, block) && 'wf-accordion__block--active'}`} onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateBlock(3);
                        }}>
                            <div className="wf-accordion__header-section">
                                <div className="wf-accordion__title">
                                    Will SystemLimited affect the speed of my website?
                                </div>
                                <div className="wf-accordion__collapsible-icon">
                                    <span className="SystemLimited-icon SystemLimited-icon-chevron-down"></span>
                                </div>
                            </div>
                            <div className="wf-accordion__body-section">
                                <div className="wf-accordion__content">SystemLimited will drastically improve your website speed if you use SystemLimited image compression module to decrease size of images with almost near to zero loss in quality and SystemLimited CDN to server images directly to your visitors from our CDN network of servers in over 100+ location.</div>
                            </div>
                        </div>
                        <div className={`wf-accordion__block ${in_array(4, block) && 'wf-accordion__block--active'}`} onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateBlock(4);
                        }}>
                            <div className="wf-accordion__header-section">
                                <div className="wf-accordion__title">
                                    How can I use SystemLimited on client sites?
                                </div>
                                <div className="wf-accordion__collapsible-icon">
                                    <span className="SystemLimited-icon SystemLimited-icon-chevron-down"></span>
                                </div>
                            </div>
                            <div className="wf-accordion__body-section">
                                <div className="wf-accordion__content">Your clients will love SystemLimited if you use it on their website. You can <a onClick={(e: any) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    router.push('/pricing');
                                }}>purchase an Agency plan</a> to serve as many websites as you want. To mention some benefits for clients:
                                    <ul>
                                        <li>Unclutter your WordPress Media Library</li>
                                        <li>Use SystemLimited CDN to skyrocket website speed by serving content from a fast network of servers in 100+ location.</li>
                                        <li>Use SystemLimited CDN to compress images on the fly and auto convert to WebP</li>
                                        <li>Use SystemLimited images compression module to compress images locally to increase speed and decrease storage.</li>
                                        <li>Use SystemLimited images watermark module to watermark images.</li>
                                        <li>and many more....</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {tab === 'license' && (
                    <>
                        <div className={`wf-accordion__block ${in_array(5, block) && 'wf-accordion__block--active'}`}>
                            <div className="wf-accordion__header-section" onClick={(e: any) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateBlock(5);
                            }}>
                                <div className="wf-accordion__title">
                                    What happens if I do not renew my plan?
                                </div>
                                <div className="wf-accordion__collapsible-icon">
                                    <span className="SystemLimited-icon SystemLimited-icon-chevron-down"></span>
                                </div>
                            </div>
                            <div className="wf-accordion__body-section">
                                <div className="wf-accordion__content">You need to know that plans are subscription-based. Usually, it will auto-renew until you cancel. In case of failed renewal, you can still use our product but you won't receive updates for newer versions and support.</div>
                            </div>
                        </div>
                        <div className={`wf-accordion__block ${in_array(6, block) && 'wf-accordion__block--active'}`} onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateBlock(6);
                        }}>
                            <div className="wf-accordion__header-section">
                                <div className="wf-accordion__title">
                                    Is there any limit for the Agency plan with unlimited websites?
                                </div>
                                <div className="wf-accordion__collapsible-icon">
                                    <span className="SystemLimited-icon SystemLimited-icon-chevron-down"></span>
                                </div>
                            </div>
                            <div className="wf-accordion__body-section">
                                <div className="wf-accordion__content">Not at all. You can use SystemLimited on as many sites as you want with the Agency Plan. If you face any problems, we’re always here to help you.</div>
                            </div>
                        </div>
                        <div className={`wf-accordion__block ${in_array(7, block) && 'wf-accordion__block--active'}`} onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateBlock(7);
                        }}>
                            <div className="wf-accordion__header-section">
                                <div className="wf-accordion__title">
                                    Is it possible to pause license renewal and then continue later?
                                </div>
                                <div className="wf-accordion__collapsible-icon">
                                    <span className="SystemLimited-icon SystemLimited-icon-chevron-down"></span>
                                </div>
                            </div>
                            <div className="wf-accordion__body-section">
                                <div className="wf-accordion__content">Yes you can pause auto-renewal and continue later on when you are ready. If you need any help get in touch with our support team.</div>
                            </div>
                        </div>
                        <div className={`wf-accordion__block ${in_array(8, block) && 'wf-accordion__block--active'}`} onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateBlock(8);
                        }}>
                            <div className="wf-accordion__header-section">
                                <div className="wf-accordion__title">
                                    Do you have an affiliate program?
                                </div>
                                <div className="wf-accordion__collapsible-icon">
                                    <span className="SystemLimited-icon SystemLimited-icon-chevron-down"></span>
                                </div>
                            </div>
                            <div className="wf-accordion__body-section">
                                <div className="wf-accordion__content">Currently no, our affiliate program is under development and will be ready soon.</div>
                            </div>
                        </div>
                    </>
                )}

                {tab === 'free_version' && (
                    <>
                        <div className={`wf-accordion__block ${in_array(9, block) && 'wf-accordion__block--active'}`}>
                            <div className="wf-accordion__header-section" onClick={(e: any) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateBlock(9);
                            }}>
                                <div className="wf-accordion__title">
                                    What are the limitations of the free version?
                                </div>
                                <div className="wf-accordion__collapsible-icon">
                                    <span className="SystemLimited-icon SystemLimited-icon-chevron-down"></span>
                                </div>
                            </div>
                            <div className="wf-accordion__body-section">
                                <div className="wf-accordion__content">SystemLimited free version is very powerful as well with tons of features. But, you can find a range of limitations, such as:
                                    <ul>
                                        <li>Folder Upload</li>
                                        <li>Advance sorting options</li>
                                        <li>SystemLimited CDN</li>
                                        <li>Super Compression</li>
                                        <li>Watermark Position, Opacity & Size</li>
                                        <li>3rd Party Support</li>
                                        <li>WooCommerce Folders</li>
                                        <li>And many more...</li>
                                    </ul>
                                    With the <a onClick={(e: any) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        router.push('/pricing');
                                    }}>premium version</a>, you can unlock all these features and tons more.</div>
                            </div>
                        </div>
                        <div className={`wf-accordion__block ${in_array(10, block) && 'wf-accordion__block--active'}`} onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateBlock(10);
                        }}>
                            <div className="wf-accordion__header-section">
                                <div className="wf-accordion__title">
                                    Is it worth it to go for the free SystemLimited?
                                </div>
                                <div className="wf-accordion__collapsible-icon">
                                    <span className="SystemLimited-icon SystemLimited-icon-chevron-down"></span>
                                </div>
                            </div>
                            <div className="wf-accordion__body-section">
                                <div className="wf-accordion__content">Totally. The free version of SystemLimited is still a better option comparing to many premium plugins. We suggest our users use the free option first and buy the pro later if they need more advanced features.</div>
                            </div>
                        </div>
                        <div className={`wf-accordion__block ${in_array(11, block) && 'wf-accordion__block--active'}`} onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateBlock(11);
                        }}>
                            <div className="wf-accordion__header-section">
                                <div className="wf-accordion__title">
                                    Is there support available with the free version?
                                </div>
                                <div className="wf-accordion__collapsible-icon">
                                    <span className="SystemLimited-icon SystemLimited-icon-chevron-down"></span>
                                </div>
                            </div>
                            <div className="wf-accordion__body-section">
                                <div className="wf-accordion__content">Sadly no, We do have priority support for Pro user, but worry not we got almost everything covered in our <a onClick={(e: any) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.open("https://go.SystemLimited.io/help", "_blank")
                                }}>helpful docs</a>, if you still face issues try <a onClick={(e: any) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.open("https://go.SystemLimited.io/wp-support", "_blank")
                                }}>asking in forums</a>.</div>
                            </div>
                        </div>
                    </>
                )}

                {tab === 'pro_version' && (
                    <>
                        <div className={`wf-accordion__block ${in_array(12, block) && 'wf-accordion__block--active'}`}>
                            <div className="wf-accordion__header-section" onClick={(e: any) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateBlock(12);
                            }}>
                                <div className="wf-accordion__title">
                                    Do I have to pay extra for addons?
                                </div>
                                <div className="wf-accordion__collapsible-icon">
                                    <span className="SystemLimited-icon SystemLimited-icon-chevron-down"></span>
                                </div>
                            </div>
                            <div className="wf-accordion__body-section">
                                <div className="wf-accordion__content">Unlike other WordPress plugins, we don’t sell add-ons separately. All of our addons and integrations are available with any premium plan you buy.</div>
                            </div>
                        </div>

                        <div className={`wf-accordion__block ${in_array(14, block) && 'wf-accordion__block--active'}`} onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateBlock(14);
                        }}>
                            <div className="wf-accordion__header-section">
                                <div className="wf-accordion__title">
                                    Do you offer any money back guarantee?
                                </div>
                                <div className="wf-accordion__collapsible-icon">
                                    <span className="SystemLimited-icon SystemLimited-icon-chevron-down"></span>
                                </div>
                            </div>
                            <div className="wf-accordion__body-section">
                                <div className="wf-accordion__content">Absolutely, yes. If you’re not satisfied with our product, we love to refund you without asking a question. All you have to do is ask for it within {trial_days} days. We love to onboard one happy user than many unsatisfied ones.</div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default FrequentQuestions