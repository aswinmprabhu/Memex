import React from 'react'
import PropTypes from 'prop-types'

const styles = require('./layout.css')

export default function NotificationLayout({
    title,
    icon,
    children,
    onCloseRequested,
    thirdRowImage,
    closeIcon,
}) {
    return (
        <div className={styles.container}>
            {icon && (
                <div className={styles.left}>
                    <img className={styles.notifIcon} src={icon} />
                </div>
            )}
            <div className={styles.middle}>
                <div className={styles.title}>{title}</div>
                <div className={styles.body}>{children}</div>
            </div>
            <div className={styles.right}>
                {thirdRowImage && (
                    <img className={styles.thirdRowImage} src={thirdRowImage} />
                )}
                <img
                    className={styles.close}
                    src={closeIcon}
                    width={'15px'}
                    height={'15px'}
                    onClick={() => onCloseRequested()}
                />
            </div>
        </div>
    )
}

NotificationLayout['propTypes'] = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
    children: PropTypes.node.isRequired,
    onCloseRequested: PropTypes.func.isRequired,
}
