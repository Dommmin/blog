import React from 'react';

export default function AppLogoIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <picture>
            <source
                srcSet="/logo.avif"
                type="image/avif"
            />
            <source
                srcSet="/logo.webp"
                type="image/webp"
            />
            <img
                src="/logo.svg"
                alt="logo"
                {...props}
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                width="32"
                height="32"
            />
        </picture>
    );
}
