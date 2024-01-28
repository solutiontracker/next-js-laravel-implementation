import React, { ReactElement, FC, useEffect, useRef, useState } from "react";
import { useAuth } from 'context/auth-provider';
import { service } from 'services/service';
import { toast } from 'react-toastify';

import {
    Formik,
    Form,
    Field,
} from 'formik';
import * as Yup from 'yup';

interface MyFormValues {
    url: string;
    type: string;
    cdn: number;
}

const re = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/

const validationSchema = Yup.object().shape({
    url: Yup.string().matches(re, 'URL is not valid').required('Required'),
    cdn: Yup.number().required('Required'),
    type: Yup.string().required('Required'),
});

const UpgradeCdn: FC<any> = (props: any): ReactElement => {

    const { user } = useAuth();

    const initialValues: MyFormValues = { url: props?.data?.url, cdn: Number(user?.is_free) === 1 ? 0 : props?.data?.cdn, type: Number(user?.is_free) === 1 ? 'free' : props?.data?.type };

    const _isMounted = useRef(true);

    const [loading, setLoading] = useState(false);

    const [server_errors, setServerErrors] = useState<any>({});

    useEffect(() => {
        return () => {
            _isMounted.current = false;
        }
    }, []);

    return (
        <div className="wf-modal">
            <div className="wf-modal__modal-wrapper wf-modal--big-modal">
                <div className="wf-modal__close" onClick={() => {
                    props?.cancel();
                }}>
                    <span className="SystemLimited-icon SystemLimited-icon-cancel"></span>
                </div>
                <div className="wf-modal__head">
                    <div className="wf-modal__head__main-name">Upgrade CDN Plan</div>
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, actions) => {
                        actions.setSubmitting(false);
                        setLoading(true);
                        service.post(props?.data?.id !== undefined ? `${process?.env?.NEXT_PUBLIC_API_URL}/user/website/update/${props?.data?.id}` : `${process?.env?.NEXT_PUBLIC_API_URL}/user/website/store`, { ...values })
                            .then(
                                response => {
                                    if (response.success) {
                                        props?.cancel(true);
                                    } else {
                                        setServerErrors(response?.errors)
                                    }
                                    setLoading(false);
                                },
                                error => {
                                    setLoading(false);
                                }
                            );
                    }}
                >
                    {({ errors, touched, isValidating, values, setFieldValue }) => (
                        <Form>
                            <div className="wf-modal__content">
                                <div className="slider">-- Slider Here -- </div>

                                <div className="wf-form-group wf-form-group--fluid mb-0 mt-16">
                                    <div className="wf-form-group__title">Customized Monthly Bandwidth</div>
                                    <div className="wf-textfield wf-textfield--fluid wf-textfield--fluid mr-4">
                                        <input type="text" className="wf-textfield__input" value="" placeholder="1000" />
                                            <span className="wf-textfield__postfix-content">
                                                GBs
                                            </span>
                                            <div className="wf-textfield__backdrop"></div>
                                    </div>
                                    <div className="wf-form-group__sub">Bandwidth should be in intervals of 100 and can't be less than 1000 GBs.</div>
                                </div>

                                <div className="wf-form-group wf-form-group--fluid mb-0 mt-16">
                                    <div className="wf-form-group__title">Zones</div>
                                    <div className="wf-form-group__sub mt-0">
                                        Select the zones where you want your data to be served from. If a zone is disabled, the traffic from that region will be routed to the next closest region.
                                    </div>
                                    <div className="wf-accordion wf-accordion--plans mt-8 text-center">
                                        <div className="wf-accordion__block wf-accordion__block--active">
                                            <div className="wf-accordion__header-section">
                                                <div className="wf-accordion__title">
                                                    2 Zone
                                                </div>
                                                <div className="wf-accordion__collapsible-icon">
                                                    <span className="SystemLimited-icon SystemLimited-icon-circle-tick"></span>
                                                </div>
                                            </div>
                                            <div className="wf-accordion__body-section">
                                                <div className="wf-accordion__content">Zones Included: Europe & North America</div>
                                            </div>
                                        </div>
                                        <div className="wf-accordion__block">
                                            <div className="wf-accordion__header-section">
                                                <div className="wf-accordion__title">
                                                    4 Zones
                                                </div>
                                                <div className="wf-accordion__collapsible-icon">
                                                    <span className="SystemLimited-icon SystemLimited-icon-circle-tick"></span>
                                                </div>
                                            </div>
                                            <div className="wf-accordion__body-section">
                                                <div className="wf-accordion__content">Zones Included: Europe, North America, Asia & Oceania</div>
                                            </div>
                                        </div>
                                        <div className="wf-accordion__block">
                                            <div className="wf-accordion__header-section">
                                                <div className="wf-accordion__title">
                                                    5 Zones
                                                </div>
                                                <div className="wf-accordion__collapsible-icon">
                                                    <span className="SystemLimited-icon SystemLimited-icon-circle-tick"></span>
                                                </div>
                                            </div>
                                            <div className="wf-accordion__body-section">
                                                <div className="wf-accordion__content">Zones Included: Europe, North America, Asia, Oceania & South America</div>
                                            </div>
                                        </div>
                                        <div className="wf-accordion__block">
                                            <div className="wf-accordion__header-section">
                                                <div className="wf-accordion__title">
                                                    6 Zones
                                                </div>
                                                <div className="wf-accordion__collapsible-icon">
                                                    <span className="SystemLimited-icon SystemLimited-icon-circle-tick"></span>
                                                </div>
                                            </div>
                                            <div className="wf-accordion__body-section">
                                                <div className="wf-accordion__content">Zones Included: Europe, North America, Asia, Oceania, South America & South Africa</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="wf-modal__actions">
                                <div className="wf-button-group wf-button-group--space-between">
                                    <div className="wf-modal__actions__price">
                                        <span className="wf-modal__actions__price__currency">$</span>
                                        <span className="wf-modal__actions__price__amount">6.</span>
                                        <span className="wf-modal__actions__price__sub">66/month</span>
                                        <div className="wf-modal__actions__price__overusage" wf-tooltip="Over-usage is only charged if your bandwidth exceeds the monthly quota.">
                                            + $0.12 / GB (over-usage) <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                        </div>
                                    </div>
                                    <button className="wf-button wf-button--medium wf-button--primary">
                                        <div className="wf-button__content">
                                            <span className="wf-button__text">Upgrade</span>
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
            </div>
        </div>
    )
}

export default UpgradeCdn
