import React, { ReactElement, FC, useMemo, useContext, useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from 'context/auth-provider';
import { service } from 'services/service'
import {
    Formik,
    Form,
    Field,
} from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

interface MyFormValues {
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    old_password?: string;
}

const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('Required'),
    password_confirmation: Yup.string().when("password", {
        is: (val: any) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
            [Yup.ref("password")],
            "Both password need to be the same"
        )
    }),
    email: Yup.string().email('Invalid email').required('Required'),
});

const AccountDetail: FC<any> = (props: any): ReactElement => {

    const { user, updateUser } = useAuth();

    const _isMounted = useRef(true);

    const [loading, setLoading] = useState(false);

    const [server_errors, setServerErrors] = useState<any>();

    const [token, setToken] = useState('');

    const inputFileRef = useRef<any>(null);

    const [image, setImage] = useState('');

    const [selectedImage, setSelectedImage] = useState('');

    const router: any = useRouter();

    const [password, setPassword] = useState(false);

    const [c_password, setCPassword] = useState(false);

    const [new_password, setNewPassword] = useState(false);

    const [action, setAction] = useState('');

    const inputFileClick = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        inputFileRef?.current?.click();
    };

    const inputFileChange = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        const selectedFiles = event.target.files;
        if (selectedFiles?.length > 0) {
            setImage(selectedFiles[0]);
            setSelectedImage(URL.createObjectURL(selectedFiles[0]));
        }
    };

    useEffect(() => {
        setToken(props?.token);
        return () => {
            _isMounted.current = false;
        }
    }, [props]);

    useEffect(() => {
        if (token !== undefined && token) {
            service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/account/update-email`, { token: token })
                .then(
                    response => {
                        if (_isMounted.current) {
                            if (response.success) {
                                updateUser(response?.data);
                                router.push('/user/account/detail')
                            } else {
                                toast.error(response?.message, {
                                    position: "bottom-right"
                                });
                            }
                            setLoading(false);
                        }
                    },
                    error => {
                        setLoading(false);
                        toast.error(error, {
                            position: "bottom-right"
                        });
                    }
                );
        }
    }, [token]);

    const discard = () => {
        setLoading(true);
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/account/discard-new-email`, {})
            .then(
                response => {
                    if (response.success) {
                        updateUser(response?.data);
                        if (response?.message) {
                            toast.success(response?.message, {
                                position: "bottom-right"
                            });
                        }
                    } else {
                        toast.error(response?.message, {
                            position: "bottom-right"
                        });
                    }
                    setLoading(false);
                },
                error => {
                    setLoading(false);
                    toast.error(error, {
                        position: "bottom-right"
                    });
                }
            );
    }

    const removeAvatar = () => {
        setLoading(true);
        setAction('remove-avatar');
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/account/remove-avatar`, {})
            .then(
                response => {
                    if (response.success) {
                        updateUser(response?.data);
                        if (response?.message) {
                            toast.success(response?.message, {
                                position: "bottom-right"
                            });
                        }
                        setSelectedImage('');
                    } else {
                        toast.error(response?.message, {
                            position: "bottom-right"
                        });
                    }
                    setLoading(false);
                    setAction('');
                },
                error => {
                    setLoading(false);
                    toast.error(error, {
                        position: "bottom-right"
                    });
                    setAction('');
                }
            );
    }

    const resendEmail = () => {
        setLoading(true);
        setAction('resend-verification-email');
        service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/account/resend-verification-email`, {})
            .then(
                response => {
                    if (response.success) {
                        if (response?.message) {
                            toast.success(response?.message, {
                                position: "bottom-right"
                            });
                        }
                    } else {
                        toast.error(response?.message, {
                            position: "bottom-right"
                        });
                    }
                    setLoading(false);
                    setAction('');
                },
                error => {
                    setLoading(false);
                    toast.error(error, {
                        position: "bottom-right"
                    });
                    setAction('');
                }
            );
    }

    if (user !== null && user !== undefined) {
        return (
            <>
                <div className="wf-page--settings__wrapper__title" id="detail">
                    My Account
                </div>
                <div className="wf-page--settings__wrapper__sub-title mt-20">
                    Account Details
                </div>
                <div className="wf-page--settings__wrapper__form mt-16">
                    <Formik
                        initialValues={user === undefined || user === null ? {} : user}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        onSubmit={(values, actions) => {
                            actions.setSubmitting(false);
                            setLoading(true);
                            setAction('update-profile');
                            service.post(`${process?.env?.NEXT_PUBLIC_API_URL}/user/account/update-profile`, { ...values, image: image })
                                .then(
                                    response => {
                                        if (response.success) {
                                            actions?.resetForm({});
                                            updateUser(response?.data);
                                            if (response?.message) {
                                                toast.success(response?.message, {
                                                    position: "bottom-right"
                                                });
                                            }
                                            setAction('');
                                        } else {
                                            if (response?.errors) {
                                                setServerErrors(response?.errors)
                                            } else {
                                                toast.error(response?.message, {
                                                    position: "bottom-right"
                                                });
                                            }
                                            setAction('');
                                        }
                                        setLoading(false);
                                    },
                                    error => {
                                        setLoading(false);
                                        toast.error(error, {
                                            position: "bottom-right"
                                        });
                                    }
                                );
                        }}
                    >
                        {({ errors, touched, isValidating, values }) => (
                            <Form>
                                <div className="wf-form-group wf-form-group--fluid">
                                    <div className="wf-form-group__title">Avatar</div>
                                    <div className="wf-page--settings__wrapper__avatar">
                                        <div className="wf-page--settings__wrapper__avatar__thumb">
                                            {(user?.image || selectedImage) && (
                                                <img src={selectedImage ? selectedImage : user?.image} alt="User Thumbnail" />
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            multiple={true}
                                            ref={inputFileRef}
                                            onChange={inputFileChange}
                                            style={{ display: 'none' }}
                                        />
                                        {user?.image.includes("gravatar.com") && (
                                            <button className={`wf-button wf-button--slim`} onClick={(e: any) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                inputFileClick(e);
                                            }}>
                                                <div className="wf-button__content">
                                                    <span className="wf-button__text">Upload</span>
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

                                        {!user?.image.includes("gravatar.com") && (
                                            <button className={`wf-button wf-button--slim wf-button--destructive-outline ${action === "remove-avatar" && 'wf-button--loading'}`} onClick={(e: any) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                removeAvatar();
                                            }}>
                                                <div className="wf-button__content">
                                                    <span className="wf-button__text">Remove</span>
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

                                </div>

                                {(errors.image && touched.image) || (server_errors?.image?.length > 0) ? (
                                    <div className="wf-inline-error wf-inline-error--fluid">
                                        <div className="wf-inline-error__icon">
                                            <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                        </div>
                                        <div className="wf-inline-error__text">{errors.image ? errors.image : server_errors?.image[0]}</div>
                                        <br></br>
                                        <br></br>
                                    </div>
                                ) : null}

                                <div className="wf-page--settings__wrapper__form__duo">
                                    <div className="wf-form-group wf-form-group--fluid">
                                        <div className="wf-form-group__title">First Name</div>
                                        <div className="wf-textfield wf-textfield--fluid mr-4">
                                            <Field
                                                id="first_name"
                                                name="first_name"
                                                type="text"
                                                className="wf-textfield__input"
                                                placeholder="Your first name..."
                                                value={values?.first_name}
                                            />
                                            <div className="wf-textfield__backdrop"></div>
                                        </div>
                                    </div>

                                    <div className="wf-form-group wf-form-group--fluid">
                                        <div className="wf-form-group__title">Last Name</div>
                                        <div className="wf-textfield wf-textfield--fluid mr-4">
                                            <Field
                                                id="last_name"
                                                name="last_name"
                                                type="text"
                                                className="wf-textfield__input"
                                                placeholder="Your last name..."
                                                value={values?.last_name}
                                            />
                                            <div className="wf-textfield__backdrop"></div>
                                        </div>
                                    </div>
                                </div>

                                {(errors.first_name && touched.first_name) || (server_errors?.first_name?.length > 0) ? (
                                    <div className="wf-inline-error wf-inline-error--fluid">
                                        <div className="wf-inline-error__icon">
                                            <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                        </div>
                                        <div className="wf-inline-error__text">{errors.first_name ? errors.first_name : server_errors?.first_name[0]}</div>
                                    </div>
                                ) : null}

                                <div className="wf-form-group wf-form-group--fluid">
                                    <div className="wf-form-group__title">Email Address</div>
                                    <div className="wf-textfield wf-textfield--fluid mr-4">
                                        <Field
                                            id="email"
                                            name="email"
                                            type="text"
                                            className="wf-textfield__input"
                                            placeholder="Your email address..."
                                            value={values?.email}
                                        />
                                        <div className="wf-textfield__backdrop"></div>
                                    </div>
                                </div>

                                {(errors.email && touched.email) || (server_errors?.email?.length > 0) ? (
                                    <div className="wf-inline-error wf-inline-error--fluid">
                                        <div className="wf-inline-error__icon">
                                            <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                        </div>
                                        <div className="wf-inline-error__text">{errors.email ? errors.email : server_errors?.email[0]}</div>
                                    </div>
                                ) : null}

                                <div className="wf-page--settings__wrapper__form__duo">
                                    <div className="wf-form-group wf-form-group--fluid">
                                        <div className="wf-form-group__title">New Password</div>
                                        <div className="wf-textfield wf-textfield--fluid mr-4 wf-textfield--show-post-icon">
                                            <Field
                                                id="password"
                                                name="password"
                                                type={password ? 'text' : 'password'}
                                                className="wf-textfield__input"
                                                placeholder="Your desired password..."
                                                autoComplete="off"
                                            />
                                            <span className={`SystemLimited-icon wf-textfield__postfix-icon ${!password ? 'SystemLimited-icon-hide' : 'SystemLimited-icon-view'}`} onClick={() => {
                                                setPassword(!password);
                                            }}></span>
                                            <div className="wf-textfield__backdrop"></div>
                                        </div>
                                    </div>

                                    <div className="wf-form-group wf-form-group--fluid">
                                        <div className="wf-form-group__title">Confirm New Password</div>
                                        <div className="wf-textfield wf-textfield--fluid mr-4 wf-textfield--show-post-icon">
                                            <Field
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                type={c_password ? 'text' : 'password'}
                                                className="wf-textfield__input"
                                                placeholder="Your confirm password..."
                                                autoComplete="off"
                                            />
                                            <span className={`SystemLimited-icon wf-textfield__postfix-icon ${!c_password ? 'SystemLimited-icon-hide' : 'SystemLimited-icon-view'}`} onClick={() => {
                                                setCPassword(!c_password);
                                            }}></span>
                                            <div className="wf-textfield__backdrop"></div>
                                        </div>
                                    </div>
                                </div>

                                {(errors.password && touched.password) || (server_errors?.password?.length > 0) ? (
                                    <div className="wf-inline-error wf-inline-error--fluid">
                                        <div className="wf-inline-error__icon">
                                            <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                        </div>
                                        <div className="wf-inline-error__text">{errors.password ? errors.password : server_errors?.password[0]}</div>
                                    </div>
                                ) : null}

                                {(errors.password_confirmation && touched.password_confirmation) || (server_errors?.password_confirmation?.length > 0) ? (
                                    <div className="wf-inline-error wf-inline-error--fluid">
                                        <div className="wf-inline-error__icon">
                                            <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                        </div>
                                        <div className="wf-inline-error__text">{errors.password_confirmation ? errors.password_confirmation : server_errors?.password_confirmation[0]}</div>
                                    </div>
                                ) : null}

                                <div className="wf-form-group wf-form-group--fluid">
                                    <div className="wf-form-group__title">Old Password</div>
                                    <div className="wf-textfield wf-textfield--fluid mr-4 wf-textfield--show-post-icon">
                                        <Field
                                            id="old_password"
                                            name="old_password"
                                            type={new_password ? 'text' : 'password'}
                                            className="wf-textfield__input"
                                            placeholder="Your old password..."
                                            autoComplete="off"
                                        />
                                        <span className={`SystemLimited-icon wf-textfield__postfix-icon ${!new_password ? 'SystemLimited-icon-hide' : 'SystemLimited-icon-view'}`} onClick={() => {
                                            setNewPassword(!new_password);
                                        }}></span>
                                        <div className="wf-textfield__backdrop"></div>
                                    </div>
                                    <div className="wf-form-group__sub">Old password is required to change password or email, leave blank if you don't wish to change password.</div>
                                </div>

                                {server_errors?.old_password?.length > 0 ? (
                                    <div className="wf-inline-error wf-inline-error--fluid">
                                        <div className="wf-inline-error__icon">
                                            <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                        </div>
                                        <div className="wf-inline-error__text">{server_errors?.old_password[0]}</div>
                                    </div>
                                ) : null}

                                {user?.updated_email && (
                                    <div className="wf-alert wf-alert--informational wf-alert--fluid">
                                        <div className="wf-alert__ribbon">
                                            <span className="SystemLimited-icon SystemLimited-icon-alert"></span>
                                        </div>
                                        <div className="wf-alert__content-wrapper">
                                            <div className="wf-alert__heading">Email change verification pending.</div>
                                            <div className="wf-alert__content">Email verification link was sent to your new email: <b>{user?.updated_email}</b>, if you can't find the email make sure to check spam/junk folder as well. <a onClick={resendEmail}>Resend Email</a> –&#160; <a className="text-color--critical" style={{ cursor: 'pointer' }} onClick={(e: any) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                discard();
                                            }}>Discard Change</a></div>
                                        </div>
                                    </div>
                                )}

                                <button className={`wf-button wf-button--large wf-button--fluid wf-button--primary mt-12 ${action === 'update-profile' && 'wf-button--loading'}`}>
                                    <div className="wf-button__content">
                                        <React.Fragment>
                                            <div className="wf-button__text">Update</div>
                                        </React.Fragment>
                                    </div>
                                    <div className="wf-button__loading">
                                        <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 19 17">
                                            <circle className="loading__circle" cx="2.2" y="10" r="1.6" ></circle>
                                            <circle className="loading__circle" cx="9.5" cy="10" r="1.6" ></circle>
                                            <circle className="loading__circle" cx="16.8" y="10" r="1.6"></circle>
                                        </svg>
                                    </div>
                                    <div className="wf-button__backdrop"></div>
                                </button>

                            </Form>
                        )}
                    </Formik>
                </div>
            </>
        )
    } else {
        return <></>
    }

}

export default AccountDetail
