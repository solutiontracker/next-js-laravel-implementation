import React, { useEffect, useState, useRef } from "react";
import { service } from 'services/service'
import { useRouter } from 'next/router';
import moment from 'moment';
import { useAuth } from 'context/auth-provider';

const BillingHistory = () => {

    const _isMounted = useRef(true);

    const limit = 10;

    const [action, setAction] = useState<any>({});

    const [page, setPage] = useState(1);

    const [billing_history, setBillingHistory] = useState<any>([]);

    const { user } = useAuth();

    const router: any = useRouter();

    useEffect(() => {
        setAction({ type: "load" });
        return () => {
            _isMounted.current = false;
        }
    }, []);

    useEffect(() => {
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/subscription/billing-history`, { page: page, limit: limit })
            .then(
                response => {
                    if (_isMounted.current) {
                        if (response.success) {
                            setBillingHistory(response?.data?.billing_history)
                        }
                        setAction({});
                    }
                },
                error => {
                    setAction({});
                }
            );
    }, [page])

    return (
        <>
            <div className="wf-page--settings__wrapper__sub-title mt-20" id="billing-history">
                Billing History
            </div>
            {billing_history?.total > 0 ? (
                action?.type === 'load' ? (
                    <div className="wf-web-list wf-web-list--result">
                        <div className="wf-load-more">
                            <svg className="spinit" view-box="0 0 50 50">
                                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4"></circle>
                            </svg>
                        </div>
                    </div>
                ) : (
                    <div className="wf-table-wrapper wf-table-wrapper--billing mt-20">
                        <table className="wf-index-table wf-index-table--fluid wf-index-table--head-sticky wf-index-table--billing">
                            <tbody>
                                <tr className="wf-index-table__head">
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Paid amount</th>
                                    <th>Invoice</th>
                                </tr>
                                {billing_history?.data?.map((row: any, key: any) =>
                                    <tr className="wf-index-table__body-row" key={key}>
                                        <td>{moment(row?.created_at).format('MMMM Do, YYYY')}</td>
                                        <td>
                                            {row?.type === 'subscription' ? (
                                                row?.start_date && row?.start_date && (
                                                    <>
                                                        Invoice for {moment(row?.start_date).format('MMMM Do, YYYY')} - {moment(row?.end_date).format('MMMM Do, YYYY')}
                                                    </>
                                                )
                                            ) : (
                                                row?.plan_title
                                            )}
                                        </td>
                                        <td>{row?.amount_paid && '$' + row?.amount_paid}</td>
                                        <td>
                                            <div className="wf-button-group">
                                                {row?.invoice_id && (
                                                    <button className="wf-button wf-button--slim wf-button--outline" onClick={() => {
                                                        window.open(`${process?.env?.NEXT_PUBLIC_API_URL}/user/subscription/download-invoice/${user?.id}/${row?.invoice_id}`, '_blank');
                                                    }}>
                                                        <div className="wf-button__content">
                                                            <span className="wf-button__text">Download</span>
                                                        </div>
                                                        <div className="wf-button__loading">
                                                            <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 19 17">
                                                                <circle className="loading__circle" cx="2.2" cy="10" r="1.6" />
                                                                <circle className="loading__circle" cx="9.5" cy="10" r="1.6" />
                                                                <circle className="loading__circle" cx="16.8" cy="10" r="1.6" />
                                                            </svg>
                                                        </div>
                                                    </button>
                                                )}
                                                {row?.amount_remaining > 0 && (
                                                    <button className="wf-button wf-button--slim wf-button--primary">
                                                        <div className="wf-button__content">
                                                            <span className="wf-button__text">Make Payment</span>
                                                        </div>
                                                        <div className="wf-button__loading">
                                                            <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 19 17">
                                                                <circle className="loading__circle" cx="2.2" cy="10" r="1.6" />
                                                                <circle className="loading__circle" cx="9.5" cy="10" r="1.6" />
                                                                <circle className="loading__circle" cx="16.8" cy="10" r="1.6" />
                                                            </svg>
                                                        </div>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                            <tfoot>
                                <tr className="wf-index-table__footer">
                                    <td colSpan={100}>
                                        <div className="wf-pagination wf-pagination--table">
                                            <button onClick={(e: any) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (billing_history?.prev_page_url) {
                                                    setAction({ type: "prev" });
                                                    setPage(page - 1);
                                                }
                                            }} className={`wf-button wf-button--medium ${!billing_history?.prev_page_url && 'wf-button--disabled'} ${action?.type === 'prev' && 'wf-button--loading'}`}>
                                                <div className="wf-button__content">
                                                    <span className="SystemLimited-icon SystemLimited-icon-chevron-left"></span>
                                                </div>
                                                <div className="wf-button__loading">
                                                    <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 19 17">
                                                        <circle className="loading__circle" cx="2.2" cy="10" r="1.6" />
                                                        <circle className="loading__circle" cx="9.5" cy="10" r="1.6" />
                                                        <circle className="loading__circle" cx="16.8" cy="10" r="1.6" />
                                                    </svg>
                                                </div>
                                                <div className="wf-button__backdrop"></div>
                                            </button>

                                            <div className="wf-pagination__details">
                                                {billing_history?.from} &#8211; {billing_history?.to} of {billing_history?.total}
                                            </div>

                                            <button onClick={(e: any) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (billing_history?.next_page_url) {
                                                    setAction({ type: "next" });
                                                    setPage(page + 1);
                                                }
                                            }} className={`wf-button wf-button--medium ${!billing_history?.next_page_url && 'wf-button--disabled'} ${action?.type === 'next' && 'wf-button--loading'}`}>
                                                <div className="wf-button__content">
                                                    <span className="SystemLimited-icon SystemLimited-icon-chevron-right"></span>
                                                </div>
                                                <div className="wf-button__loading">
                                                    <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 19 17">
                                                        <circle className="loading__circle" cx="2.2" cy="10" r="1.6" />
                                                        <circle className="loading__circle" cx="9.5" cy="10" r="1.6" />
                                                        <circle className="loading__circle" cx="16.8" cy="10" r="1.6" />
                                                    </svg>
                                                </div>
                                                <div className="wf-button__backdrop"></div>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )
            ) : (
                <div className="wf-page--settings__wrapper__empty text-color--subdued mt-32">
                    No orders has been made yet. <a onClick={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push('/pricing')
                    }}>Get started with a suitable plan.</a>
                </div>
            )}
        </>
    )
}

export default BillingHistory
