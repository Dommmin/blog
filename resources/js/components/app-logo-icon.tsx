import React from 'react';

export default function AppLogoIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <>
            <img src="/logo.png" alt="logo" {...props} />
        </>
    );
}
