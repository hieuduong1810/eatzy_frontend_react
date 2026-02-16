import { useEffect } from 'react';

function RestaurantNavItem({ icon, text, expanded, active, onClick, className = '' }) {
    useEffect(() => {
        // console.log('NavItem rendered');
    }, []);

    return (
        <div
            className={`flex items-center px-4 py-3 my-1 cursor-pointer transition-all duration-300 rounded-xl
        ${active
                    ? "bg-white/20 backdrop-blur-sm text-gray-900 shadow-[inset_0_0_24px_16px_rgba(255,255,255,0.9)]"
                    : "text-gray-600 hover:bg-white/10 hover:text-gray-900 hover:shadow-[inset_0_0_18px_12px_rgba(255,255,255,0.7)]"
                } 
        ${className}`}
            onClick={onClick}
        >
            <div className={`${expanded ? "" : "mx-auto"}`}>
                {icon}
            </div>
            {expanded && <span className="ml-3 text-sm font-semibold whitespace-nowrap overflow-hidden">{text}</span>}
        </div>
    );
}

export default RestaurantNavItem;
