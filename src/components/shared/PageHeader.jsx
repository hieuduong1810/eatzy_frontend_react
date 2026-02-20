import React from 'react';
import { Tag } from 'lucide-react';

const PageHeader = ({ title, subtitle, badge, badgeColor = "green", action, BadgeIcon = Tag }) => {
    return (
        <div className="page-header-modern">
            {badge && (
                <div className={`header-badge-pill ${badgeColor}`}>
                    <BadgeIcon size={12} />
                    <span>{badge}</span>
                </div>
            )}

            <div className="header-content-row">
                <div className="header-title-group">
                    <h1 className="header-title-modern">{title}</h1>
                    {subtitle && <p className="header-subtitle-modern">{subtitle}</p>}
                </div>

                {action && (
                    <div className="header-action-wrapper">
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
