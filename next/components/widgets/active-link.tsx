import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Link from 'next/link'
import React, { Children } from 'react'

interface Props {
    children: any;
    activeClassName: any;
    href: any;
    as?: any;
    wildcard?: any;
}

const ActiveLink = ({ children, activeClassName, ...props }: Props) => {
    const { asPath } = useRouter()
    const child = Children.only(children)
    const childClassName = child.props.className || ''

    // pages/index.js will be matched via props.href
    // pages/about.js will be matched via props.href
    // pages/[slug].js will be matched via props.as

    if (props.wildcard === true) {
        //remove querystrings from asPath
        const asPathWithoutQuery = asPath.split('?')[0];

        //return true if asPathWithoutQuery starts with props.href
        const className = asPathWithoutQuery === props.href || asPath === props.as
        ? `${childClassName} ${activeClassName}`.trim()
                : childClassName;

        return (
            <Link scroll={false} {...props}>
                {React.cloneElement(child, {
                    className: className || null,
                })}
            </Link>
        )
    } else {
        const className = asPath === props.href || asPath === props.as
                ? `${childClassName} ${activeClassName}`.trim()
                : childClassName;

        return (
            <Link scroll={false} {...props}>
                {React.cloneElement(child, {
                    className: className || null,
                })}
            </Link>
        )
    }
}

ActiveLink.propTypes = {
    activeClassName: PropTypes.string.isRequired,
}

export default ActiveLink