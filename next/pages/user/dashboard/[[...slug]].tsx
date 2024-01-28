import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState, useRef } from "react";
import Master from 'components/user/layout/master'
import AddWebsite from 'components/user/website/add';
import { useAuth } from 'context/auth-provider';
import { service } from 'services/service';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { confirmAlert } from 'react-confirm-alert'; // Import
import useInfiniteScroll from 'components/widgets/useInfinite-scroll';

const Index: NextPage = () => {

    const [data, setData] = useState<any>({});

    const [websites, setWebsites] = useState<any>([]);

    const limit = 10;

    const { user } = useAuth();

    const _isMounted = useRef(true);

    const [modal, setModal] = useState(false);

    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false);

    const [type, setType] = useState('all');

    const [_action, setAction] = useState<any>({});

    const [counter, setCounter] = useState<number>(0);

    //we need to know if there is more data
    const [HasMore, setHasMore] = useState(true);

    const [isFetching, setIsFetching] = useState(false);

    const router: any = useRouter();

    const { action, redirect, id } = router.query;

    const [lastElementRef] = useInfiniteScroll(
        HasMore ? () => {
            setPage((prevPageNumber) => prevPageNumber + 1);
            // setCounter(counter + 1)
            //No load more
        } : () => {
            //No load more
        },
        isFetching
    );

    const cancelModal = (load = false) => {
        setModal(false);
        if (load) {
            setCounter(counter + 1);
        }
        if (action === 'add-website' || action === 'edit-website') {
            router.push('/user/dashboard')
        }
        setAction({});
    }

    useEffect(() => {
        return () => {
            _isMounted.current = false;
        }
    }, []);

    useEffect(() => {
        if (action === 'add-website') {
            service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/website/fetch-by-url`, { url: redirect })
                .then(
                    response => {
                        if (response.success) {
                            if (redirect !== undefined && redirect !== null && response?.data?.website?.token !== undefined && response?.data?.website?.token !== null) {
                                window.location.href = `${redirect}&token=${response?.data?.website?.token}`;
                            } else {
                                setAction(response?.data?.website);
                            }
                        }
                        setModal(true);
                    },
                    error => { }
                );

        } else if (action === 'edit-website') {
            service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/website/fetch/${id}`, {})
                .then(
                    response => {
                        if (response.success) {
                            if (response?.data?.website?.id !== undefined && response?.data?.website?.id !== null && response?.data?.website?.cdn_status !== "pending") {
                                setAction(response?.data?.website);
                                setModal(true);
                            }
                        }
                    },
                    error => { }
                );
        }
    }, [action]);

    useEffect(() => {
        setLoading(true);
        setIsFetching(true);
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/website/listing/${page}`, { limit: limit, type: type })
            .then(
                response => {
                    if (_isMounted.current) {
                        if (response.success) {
                            setData(response?.data);
                            if (page === 1) {
                                setWebsites(response?.data?.websites?.data)
                            } else {
                                setWebsites([...websites, ...response?.data?.websites?.data?.map((b: any) => b)]);
                            }
                        }
                        setHasMore(response?.data?.websites?.next_page_url === null ? false : true);
                        setLoading(false);
                        setIsFetching(false);
                    }
                },
                error => {
                    setLoading(false);
                    setIsFetching(false);
                }
            );
    }, [page, type, counter]);

    const _delete = (id: any) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="wf-modal">
                        <div className="wf-modal__modal-wrapper">
                            <div className="wf-modal__close" onClick={() => {
                                onClose();
                            }}>
                                <span className="SystemLimited-icon SystemLimited-icon-cancel"></span>
                            </div>
                            <div className="wf-modal__head">
                                <div className="wf-modal__head__main-name">Delete website</div>
                            </div>
                            <div className="wf-modal__content">
                                <div className="wf-form-group__title">Are you sure want to delete this website?</div>
                            </div>
                            <div className="wf-modal__actions">
                                <button className="wf-button wf-button--medium wf-button--destructive" onClick={(e: any) => {
                                    e.target.classList.add('wf-button--loading');
                                    e.target.closest('.wf-button').classList.add('wf-button--loading');
                                    service.destroy(`${process?.env?.NEXT_PUBLIC_API_URL}/user/website/destroy/${id}`)
                                        .then(
                                            response => {
                                                if (response.success && _isMounted.current) {
                                                    setCounter(counter + 1);
                                                    onClose();
                                                } else {
                                                    toast.error(response?.message, {
                                                        position: "bottom-right"
                                                    });
                                                }
                                                e.target.classList.remove('wf-button--loading');
                                                e.target.closest('.wf-button').classList.remove('wf-button--loading');
                                            },
                                            error => {
                                                e.target.classList.remove('wf-button--loading');
                                                e.target.closest('.wf-button').classList.remove('wf-button--loading');
                                                toast.error(error, {
                                                    position: "bottom-right"
                                                });
                                            }
                                        );
                                }}>
                                    <div className="wf-button__content">
                                        <span className="wf-button__text">Delete</span>
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
                );
            }
        });
    }

    useEffect(() => {
        document.addEventListener("click", documentClicked);
        return () => {
            // unsubscribe event
            document.removeEventListener("click", documentClicked);
        };
    }, [_action])

    //Document click
    const documentClicked = () => {
        if (_action?.type === "menu") {
            setAction({});
        }
    }

    return (
        <Master>

            <Head>
                <title>Dashboard | SystemLimited</title>
                <link rel="canonical" href="https://SystemLimited.io/" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="SystemLimited" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Dashboard | SystemLimited" />
                <meta property="og:url" content="https://SystemLimited.io/" />
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                <meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                <meta property="og:image:width" content="1720" />
                <meta property="og:image:height" content="1000" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SystemLimited_io" />
                <meta name="twitter:title" content="Dashboard | SystemLimited" />
                <meta name="twitter:creator" content="@SystemLimited_io" />
                <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />

                <link rel='dns-prefetch' href='//js.stripe.com' />
                <link rel='dns-prefetch' href='//fonts.googleapis.com' />
            </Head>

            <div className="wf-page wf-page--dashboard">
                <>
                    {websites?.length > 0 || ((type === 'free' || type === 'pro') && !loading) ? (
                        <>
                            <div className="wf-flex wf-flex--justify-space-between wf-flex--align-center mb-20">
                                <div className="wf-page--dashboard__title">My Websites</div>
                                <button className="wf-button wf-button--medium" onClick={() => {
                                    setModal(true);
                                }}>
                                    <div className="wf-button__content">
                                        <span className="SystemLimited-icon SystemLimited-icon-plus mr-4"></span>
                                        <span className="wf-button__text">Add New Website</span>
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
                            <div className="wf-page--dashboard__wrapper wf-tabs">
                                <div className="wf-web-list wf-web-list--head">
                                    <div className="wf-tabs__tab-head">
                                        <div onClick={() => {
                                            setType('all');
                                            setPage(1);
                                        }} className={`wf-tabs__tab-head__single-tab ${type === 'all' && 'wf-tabs__tab-head__single-tab--active'}`}>All ({data?.total})</div>
                                        <div onClick={() => {
                                            setType('pro');
                                            setPage(1);
                                        }} className={`wf-tabs__tab-head__single-tab ${type === 'pro' && 'wf-tabs__tab-head__single-tab--active'}`}>Pro ({data?.pro})</div>
                                        <div onClick={() => {
                                            setType('free');
                                            setPage(1);
                                        }} className={`wf-tabs__tab-head__single-tab ${type === 'free' && 'wf-tabs__tab-head__single-tab--active'}`}>Free ({data?.free})</div>
                                    </div>
                                    <div className="wf-web-list__action">
                                        <div className="wf-web-list__action__single">CDN</div>
                                        <div className="wf-web-list__action__single">Actions</div>
                                    </div>
                                </div>
                                <div className="wf-tabs__tab-content">
                                    {websites?.map((website: any, key: any) =>
                                        <div className="wf-web-list" key={key} ref={(websites?.length === key + 1 ? lastElementRef : null)}>
                                            <div className="wf-web-list__details">
                                                <div className="wf-web-list__details__thumb">
                                                    <img src={website?.favicon} alt="" />
                                                </div>
                                                <div className="wf-web-list__details__info">
                                                    <div className="wf-web-list__details__title">
                                                        <span className="wf-badge mr-8">{website?.protocol}</span>
                                                        {website?.domain}
                                                    </div>
                                                    <div className="wf-web-list__details__sub-info">
                                                        {
                                                            (() => {
                                                                if (website?.is_stage === 1)
                                                                    return (
                                                                        <div className="wf-badge">Staging</div>
                                                                    )
                                                            })()
                                                        }
                                                        {
                                                            (() => {
                                                                if (website?.type === 'free')
                                                                    return (
                                                                        <div className="wf-badge">Free</div>
                                                                    )
                                                                else if (website?.type === 'pro')
                                                                    return (
                                                                        <div className="wf-badge wf-badge--warning">Pro</div>
                                                                    )
                                                            })()
                                                        }
                                                        <div className="wf-web-list__details__date">added {website?.created_ago}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="wf-web-list__action">
                                                <div className={`wf-web-list__action__single`}>
                                                    {
                                                        (() => {
                                                            if (website?.cdn_status === "active" && Number(website?.cdn) === 1)
                                                                return <div className="wf-badge wf-badge--success">Active</div>
                                                            else if (website?.cdn_status === "pending")
                                                                return <div className="wf-badge">
                                                                    <span className="wf-badge__loader">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 17">
                                                                            <circle className="loading__circle" cx="2.2" cy="10" r="1.6"></circle>
                                                                            <circle className="loading__circle" cx="9.5" cy="10" r="1.6"></circle>
                                                                            <circle className="loading__circle" cx="16.8" cy="10" r="1.6"></circle>
                                                                        </svg>
                                                                    </span>
                                                                    Deploying</div>
                                                            else if (website?.cdn_status === "suspended")
                                                                return <div className="wf-badge wf-badge--critical">Suspended</div>
                                                            else
                                                                return <div className="wf-badge">Inactive</div>
                                                        })()
                                                    }
                                                </div>
                                                <div className={`wf-web-list__action__single ${website?.cdn_status === "pending" && 'wf-web-list__action__single--disabled'}`}>
                                                    <div className={`wf-dropdown ${(_action?.id === website?.id && _action?.type === 'menu') && 'wf-dropdown--active'}`}>
                                                        <div className="SystemLimited-icon SystemLimited-icon-horizontal-dots wf-web-list__action__single__trigger" onClick={(e: any) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            if (website?.id === _action?.id) {
                                                                setAction({});
                                                            } else {
                                                                setAction({ id: website?.id, type: 'menu' })
                                                            }
                                                        }}></div>
                                                        {website?.cdn_status != "pending" && (
                                                            <div className="wf-dropdown__menu wf-dropdown--right wf-dropdown--child-left">
                                                                <ul className="wf-dropdown-wrapper">
                                                                    <li className={`wf-dropdown-wrapper__item-wrapper`} onClick={(e: any) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        if (website?.cdn_status !== "pending") {
                                                                            setAction(website);
                                                                            setModal(true);
                                                                        }
                                                                    }}>
                                                                        <a className="wf-dropdown__menu__item">
                                                                            <span className="SystemLimited-icon SystemLimited-icon-edit mr-4"></span>
                                                                            <span className="wf-dropdown__menu__item__text">Manage</span>
                                                                        </a>
                                                                    </li>
                                                                    {
                                                                        (() => {
                                                                            if (website?.type === 'pro')
                                                                                return <li className={`wf-dropdown-wrapper__item-wrapper`} onClick={() => router.push(`/user/cdn/stats?action=search-stats&id=${website?.id}`)}>
                                                                                    <a className="wf-dropdown__menu__item">
                                                                                        <span className="SystemLimited-icon SystemLimited-icon-stats mr-4"></span>
                                                                                        <span className="wf-dropdown__menu__item__text">CDN Stats</span>
                                                                                    </a>
                                                                                </li>
                                                                        })()
                                                                    }
                                                                    <li className={`wf-dropdown-wrapper__item-wrapper`} onClick={(e: any) => {
                                                                        e.stopPropagation();
                                                                        if (website?.cdn_status !== "pending") {
                                                                            _delete(website?.id);
                                                                        }
                                                                    }}>
                                                                        <a className="wf-dropdown__menu__item">
                                                                            <span className="SystemLimited-icon SystemLimited-icon-delete mr-4"></span>
                                                                            <span className="wf-dropdown__menu__item__text">Delete</span>
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {data?.websites?.next_page_url === null && data?.websites?.current_page > 1 && (
                                        <div className="wf-web-list wf-web-list--result">
                                            End of list, no more websites to display.
                                        </div>
                                    )}
                                    {websites?.length === 0 && data?.websites?.current_page === 1 && (
                                        <div className="wf-web-list wf-web-list--result">
                                            {type === 'free' ? 'There is no free websites to display.' : 'There is no pro websites to display.'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        !loading && (
                            <div className="wf-page--dashboard__wrapper wf-tabs">
                                <div className="wf-tabs__tab-content">
                                    <div className="wf-web-list wf-web-list--empty">
                                        <div className="wf-web-list--empty__image"><img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/empty-illustration.svg`} alt="" /></div>
                                        <div className="wf-web-list--empty__title">Currently you don't have any connected website, click on button below to connect your website.</div>
                                        <button className="wf-button wf-button--primary wf-button--medium" onClick={() => {
                                            setModal(true);
                                        }}>
                                            <div className="wf-button__content">
                                                <span className="SystemLimited-icon SystemLimited-icon-plus mr-4"></span>
                                                <span className="wf-button__text">Add New Website</span>
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
                        )
                    )}

                    {loading && (
                        <div className="wf-web-list wf-web-list--result">
                            <div className="wf-load-more">
                                <svg className="spinit" view-box="0 0 50 50">
                                    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4"></circle>
                                </svg>
                            </div>
                        </div>
                    )}
                </>
            </div>

            {modal && (
                <AddWebsite cancel={cancelModal} data={_action} redirect={redirect} />
            )}
        </Master>
    )
}

export default Index
