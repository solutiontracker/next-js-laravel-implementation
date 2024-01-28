import { useState } from 'react'

const Sidebar = () => {

    const [sliders, setSliders] = useState([{
        title: 'Sacha Abrams',
        heading: 'Project Manager',
        description: 'SystemLimited has helped me make a couple of great websites, much appreciated by my clients. As a non-coder/programmer I also value their excellent support!',
        active: true,
        src: `${process.env.NEXT_PUBLIC_CDN_URL}/web/images/302058504/original.jpg?t=1511579073`,
        left: '-100%'
    }, {
        title: 'Rueben Zobel',
        heading: 'Blogger',
        description: 'SystemLimited Pro is a must-have WordPress plugin that every web developer, designer and publisher should have in their arsenal. The fact that you can use it as a lite plugin or choose PRO features make SystemLimited Pro incredibly versatile.',
        active: false,
        src: `${process.env.NEXT_PUBLIC_CDN_URL}/web/images/302058504/original.jpg?t=1511579073`,
        left: '0%'
    }, {
        title: 'Amaar chisti',
        heading: 'Web Developer',
        description: "SystemLimited Pro is a must-have WordPress plugin that every web developer, designer and publisher should have in their arsenal. The fact that you can use it as a lite plugin or choose PRO features make SystemLimited Pro incredibly versatile.",
        active: false,
        src: `${process.env.NEXT_PUBLIC_CDN_URL}/web/images/302058504/original.jpg?t=1511579073`,
        left: '100%'
    }]);

    return (
        <div className="wf-split-page__alt">
            <div className="wf-split-page__wrapper">
                <div className="wf-split-page__slider">

                    <div className="wf-split-page__slider__wrapper">
                        {sliders?.map((slider: any, key: number) =>
                            <div key={key} className={`wf-split-page__slider__single ${slider.active && 'wf-split-page__slider__single--active'}`} style={{ left: slider.left }}>
                                <div className="wf-split-page__slider__user">
                                    <div className="wf-split-page__slider__user__image"
                                        style={{ backgroundImage: `url('${slider.src}')` }}></div>
                                    <div className="wf-split-page__slider__user__name">
                                        {slider?.title}
                                    </div>
                                    <div className="wf-split-page__slider__user__position">
                                        {slider?.heading}
                                    </div>
                                </div>
                                <div className="wf-split-page__slider__review">
                                    <span>{slider?.description}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="wf-split-page__slider__nav">
                        {sliders?.map((slider: any, key: number) =>
                            <div onClick={() => {
                                const newArray = sliders.map((slider: any, index: number) => {
                                    return { ...slider, active: key === index ? true : false };
                                });
                                setSliders(newArray);
                            }} key={key} className={`wf-split-page__slider__nav__dot ${slider.active && 'wf-split-page__slider__nav__dot--active'}`}></div>
                        )}
                    </div>

                    <div className="wf-milestones__wrapper mt-32">
                        <div className="wf-milestones__blocks">
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
