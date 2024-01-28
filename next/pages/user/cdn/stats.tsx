import type { NextPage } from 'next'
import React, { useEffect, useState, useRef } from "react";
import Master from 'components/user/layout/master'
import Head from 'next/head'
import { service } from 'services/service'
import { useRouter } from 'next/router';
import { useAuth } from 'context/auth-provider';
import { toast } from 'react-toastify';
import ReactECharts from 'echarts-for-react';

import { readableBytes } from 'helpers'
import moment from 'moment';

const Stats: NextPage = () => {

    const [stats, setStats] = useState<any>({});

    const mounted = useRef(false);

    const [_action, setAction] = useState<any>({});

    const [dates, setDates] = useState<any>([]);

    const [website_id, setWebsiteId] = useState<any>('');

    const [date, setDate] = useState('');

    const router: any = useRouter();

    const { action, id } = router.query;

    const { user, loadUser } = useAuth();

    const [bandwidth_chart_options, setBandwidthChartOptions] = useState({
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['Total Bandwidth', 'Cached Bandwidth', 'Uncached Bandwidth']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'time',
                boundaryGap: false,
                axisLabel: {
                    formatter: (function (value: any) {
                        return moment(value).format('LL');
                    }),
                    hideOverlap: true,
                    showMaxLabel: false
                },
                data: []
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: function (params: any) {
                        return readableBytes(params);
                    }
                }
            }
        ],
        series: [
            {
                name: 'Total Bandwidth',
                type: 'line',
                data: [],
                smooth: true
            },
            {
                name: 'Cached Bandwidth',
                type: 'line',
                data: [],
                smooth: true
            },
            {
                name: 'Uncached Bandwidth',
                type: 'line',
                data: [],
                smooth: true
            }
        ]
    });

    const [planBar, setPlanBar] = useState<any>((typeof window !== 'undefined' ? localStorage?.getItem('plan-bar') as any || '1' : '1'));

    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    useEffect(() => {
        if (action === "search-stats") {
            setWebsiteId(Number(id))
        }
    }, [action]);

    useEffect(() => {
        getStats(website_id, date);
    }, [website_id, date]);

    useEffect(() => {
        if (dates?.length > 0 && !date) {
            setDate(dates?.[0]?.value);
        }
    }, [dates, date]);

    const _calulate_series = (data: any): any => {
        var d = [];
        for (let i = 0; i < data.length; i++) {
            d.push([
                new Date(data?.[i].date),
                data?.[i].value
            ]);
        }
        return d;
    }

    const getStats = (website_id: any, date: any) => {
        setAction({ type: 'load-stats' });
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/website/cdn-stats`, { website_id: website_id, date: date })
            .then(
                response => {
                    if (mounted.current) {
                        if (response.success) {
                            setStats(response?.data?.stats);

                            let _bandwidth_chart_options = bandwidth_chart_options;
                            _bandwidth_chart_options['series'][0]['data'] = _calulate_series(response?.data?.stats?.stats?.total_bandwidth);
                            _bandwidth_chart_options['series'][1]['data'] = _calulate_series(response?.data?.stats?.stats?.cached_bandwidth);
                            _bandwidth_chart_options['series'][2]['data'] = _calulate_series(response?.data?.stats?.stats?.uncached_bandwidth);
                            setBandwidthChartOptions(_bandwidth_chart_options);

                            setDates(response?.data?.dates);
                        } else {
                            toast.error(response?.message, {
                                position: "bottom-right"
                            });
                        }
                        setAction({});
                    }
                },
                error => {
                    setAction({});
                    toast.error(error, {
                        position: "bottom-right"
                    });
                }
            );
    }

    useEffect(() => {
        document.addEventListener("click", documentClicked);
        return () => {
            document.removeEventListener("click", documentClicked);
        };
    }, [_action])

    //Document click
    const documentClicked = () => {
        if (_action?.type === "website-filter" || _action?.type === "date-filter") {
            setAction({});
        }
    }

    return (
        <Master>

            <Head>
                <title>CDN Stats | SystemLimited</title>
                <link rel="canonical" href="https://SystemLimited.io/" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="SystemLimited" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="CDN Stats | SystemLimited" />
                <meta property="og:url" content="https://SystemLimited.io/" />
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                <meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                <meta property="og:image:width" content="1720" />
                <meta property="og:image:height" content="1000" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SystemLimited_io" />
                <meta name="twitter:title" content="CDN Stats | SystemLimited" />
                <meta name="twitter:creator" content="@SystemLimited_io" />
                <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />

                <link rel='dns-prefetch' href='//js.stripe.com' />
                <link rel='dns-prefetch' href='//fonts.googleapis.com' />
            </Head>

            {_action?.type === 'load-stats' ? (
                <div className="wf-page wf-page--cdn">
                    <div className="wf-web-list wf-web-list--result">
                        <div className="wf-load-more">
                            <svg className="spinit" view-box="0 0 50 50">
                                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4"></circle>
                            </svg>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {(stats?.balance !== undefined || stats?.usage_amount !== undefined || stats?.cost !== undefined) && Number(user?.is_free) === 0 && (
                        <div className="wf-sub-header">
                            <div className="wf-sub-header__wrapper cdn-usage-blocks">
                                <div className="usage-block">
                                    <div className="usage-block__title">
                                        Balance
                                    </div>
                                    <div className="usage-block__details">
                                        <span className={`${stats?.balance && stats?.balance < 0 && 'text-color--critical'}`}>
                                            {stats?.balance && stats?.balance !== 0 ? (
                                                <>
                                                    {stats?.balance && stats?.balance > 0 ? `$${stats?.balance_display}` : ''}
                                                    {stats?.balance && stats?.balance < 0 ? `$${stats?.balance_display}` : ''}
                                                </>
                                            ) : (
                                                <>$0.00</>
                                            )}
                                        </span>
                                        <button className="wf-button wf-button--slim" onClick={() => {
                                            router.push({
                                                pathname: '/user/subscription',
                                                query: { action: 'recharge-balance' },
                                            })
                                        }}>
                                            <div className="wf-button__content">
                                                <span className="wf-button__text">Recharge</span>
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
                                <div className="usage-block">
                                    <div className="usage-block__title">
                                        Usage
                                    </div>
                                    <div className="usage-block__details">
                                        <span>${stats?.usage_amount_display}</span>
                                    </div>
                                </div>
                                <div className="usage-block">
                                    <div className="usage-block__title">
                                        Cost/GB
                                    </div>
                                    <div className="usage-block__details">
                                        <span>{stats?.cost ? `$${stats?.cost}` : ''}</span>
                                        <button className="wf-button wf-button--slim" onClick={() => {
                                            router.push('/cdn?action=cdn-pricing')
                                        }}>
                                            <div className="wf-button__content">
                                                <span className="wf-button__text">Pricing</span>
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
                            </div>
                        </div>
                    )}

                    {user?.subscription?.plan !== undefined && planBar === '1' && (
                        <div className="wf-hellobar wf-hellobar--relative wf-hellobar--success">
                            <div className='wf-hellobar__empty'></div>
                            <div className="wf-hellobar__content">
                                <span className="SystemLimited-icon SystemLimited-icon-info"></span>
                                You have {(user?.subscription?.plan?.cdn_premium_bandwidth + user?.subscription?.plan?.cdn_volume_bandwidth)}GBs/month Free CDN bandwidth included with your {user?.subscription?.plan?.name} Plan.
                            </div>

                            <div className="wf-hellobar__close" onClick={() => {
                                localStorage?.setItem('plan-bar', '0');
                                setPlanBar(false);
                            }}>
                                <span className="SystemLimited-icon SystemLimited-icon-cancel"></span>
                            </div>
                        </div>
                    )}

                    <div className="wf-page wf-page--cdn">

                        {Number(user?.is_free) === 1 ? (
                            <div className="wf-page--dashboard__wrapper wf-tabs mt-32">
                                <div className="wf-tabs__tab-content">
                                    <div className="wf-web-list wf-web-list--empty">
                                        <div className="wf-web-list--empty__image"><img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/empty-illustration.svg`} alt="" /></div>
                                        <div className="wf-web-list--empty__title">CDN is only available in Pro plan, up-grade to Pro Plan and sky-rocket your website speed.</div>
                                        <div className="wf-button-group">
                                            <button className="wf-button wf-button--primary wf-button--medium" onClick={() => {
                                                router.push('/pricing');
                                            }}>
                                                <div className="wf-button__content">
                                                    <span className="wf-button__text">Upgrade Plan</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {stats?.websites?.length > 0 && (
                                    <div className="wf-flex wf-flex--direction-row wf-flex--justify-space-between wf-flex--align-center mb-20 wf-page__title">
                                        <div className="wf-page--dashboard__title">Usage Stats</div>
                                        <div className="wf-button-group">
                                            {dates?.length > 0 && (
                                                <div className={`wf-dropdown ${_action?.type === 'date-filter' && 'wf-dropdown--active'}`}>
                                                    <button className="wf-button wf-button--medium" onClick={(e: any) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (_action?.type === "date-filter") {
                                                            setAction({});
                                                        } else {
                                                            setAction({ type: 'date-filter' })
                                                        }
                                                    }}>
                                                        <div className="wf-button__content">
                                                            <span className="SystemLimited-icon SystemLimited-icon-calendar mr-4"></span>
                                                            <span className="wf-button__text">
                                                                {dates?.find((dt: any) => dt.value === date)?.label}
                                                            </span>
                                                        </div>
                                                    </button>
                                                    <div className="wf-dropdown__menu wf-dropdown--right wf-dropdown--child-left wf-dropdown__menu--scroll">
                                                        <ul className="wf-dropdown-wrapper">
                                                            {dates?.map((dt: any, key: any) =>
                                                                <li className="wf-dropdown-wrapper__item-wrapper" key={key} onClick={() => {
                                                                    setDate(dt?.value);
                                                                    setAction({});
                                                                }}>
                                                                    <a className={`wf-dropdown__menu__item ${date === dt?.value && 'wf-dropdown__menu__item--active'}`}>
                                                                        <span className="wf-dropdown__menu__item__text">{dt?.label}</span>
                                                                    </a>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                                <div className={`wf-dropdown ${_action?.type === 'website-filter' && 'wf-dropdown--active'}`}>
                                                    <button className="wf-button wf-button--medium" onClick={(e: any) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (_action?.type === "website-filter") {
                                                            setAction({});
                                                        } else {
                                                            setAction({ type: 'website-filter' })
                                                        }
                                                    }}>
                                                        <div className="wf-button__content">
                                                            <span className="SystemLimited-icon SystemLimited-icon-filter mr-4"></span>
                                                            <span className="wf-button__text">Filter</span>
                                                        </div>
                                                    </button>
                                                    <div className="wf-dropdown__menu wf-dropdown--right wf-dropdown--child-left wf-dropdown__menu--scroll">
                                                        <ul className="wf-dropdown-wrapper">
                                                            <li className="wf-dropdown-wrapper__item-wrapper" onClick={() => {
                                                                setWebsiteId('');
                                                                setAction({});
                                                            }}>
                                                                <a className={`wf-dropdown__menu__item ${website_id === '' && 'wf-dropdown__menu__item--active'}`}>
                                                                    <span className="wf-dropdown__menu__item__text">All Websites</span>
                                                                </a>
                                                            </li>
                                                            <li className="wf-dropdown-wrapper__item-wrapper">
                                                                <div className="wf-dropdown__menu__divider"></div>
                                                            </li>
                                                            {stats?.websites?.map((website: any, key: any) =>
                                                                <li key={key} className="wf-dropdown-wrapper__item-wrapper" onClick={() => {
                                                                    setWebsiteId(website?.id);
                                                                    setAction({});
                                                                }}>
                                                                    <a className={`wf-dropdown__menu__item ${website_id === website?.id && 'wf-dropdown__menu__item--active'}`}>
                                                                        <span className="wf-dropdown__menu__item__text">{website?.domain}</span>
                                                                    </a>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                )}

                                <div className="wf-page--cdn__wrapper">
                                    {stats?.stats?.total_bandwidth?.length > 0 ? (
                                        <>
                                            <div className="wf-page--cdn__blocks">
                                                <div className="wf-page--dashboard__wrapper">
                                                    <div className="wf-page--cdn__blocks__details">
                                                        <div className="wf-page--cdn__blocks__title">
                                                            Bandwidth Used
                                                        </div>
                                                        {stats?.cdn?.bandwidth && (
                                                            <div className="wf-page--cdn__blocks__count">
                                                                {stats?.cdn?.bandwidth}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="wf-page--cdn__blocks__icon">
                                                        <span className="SystemLimited-icon SystemLimited-icon-stats"></span>
                                                    </div>
                                                </div>
                                                <div className="wf-page--dashboard__wrapper">
                                                    <div className="wf-page--cdn__blocks__details">
                                                        <div className="wf-page--cdn__blocks__title">
                                                            Requests Served
                                                        </div>
                                                        {stats?.cdn?.requests_served_chart && (
                                                            <div className="wf-page--cdn__blocks__count">
                                                                {stats?.cdn?.requests_served_chart}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="wf-page--cdn__blocks__icon">
                                                        <span className="SystemLimited-icon SystemLimited-icon-requests"></span>
                                                    </div>
                                                </div>
                                                <div className="wf-page--dashboard__wrapper">
                                                    <div className="wf-page--cdn__blocks__details">
                                                        <div className="wf-page--cdn__blocks__title">
                                                            Cache HIT Rate
                                                        </div>
                                                        <div className="wf-page--cdn__blocks__count">
                                                            {stats?.cdn?.cache_hit_rate_chart}%
                                                        </div>
                                                    </div>
                                                    <div className="wf-page--cdn__blocks__icon">
                                                        <span className="SystemLimited-icon SystemLimited-icon-goal"></span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="wf-page--dashboard__wrapper">
                                                <ReactECharts option={bandwidth_chart_options} />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="wf-page--dashboard__wrapper wf-tabs mt-32">
                                            <div className="wf-tabs__tab-content">
                                                <div className="wf-web-list wf-web-list--empty">
                                                    <div className="DisplayMedium mb-12 text-color--dark">No Data Available</div>
                                                    <div className="wf-web-list--empty__title mb-0">You haven't served any data from CDN during the specified time frame.</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

        </Master>
    )
}

export default Stats
