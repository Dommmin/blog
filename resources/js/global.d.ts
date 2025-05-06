declare namespace JSX {
    type Element = React.ReactNode;
}

// Extend Inertia's FormDataType to allow our form types
import '@inertiajs/react';

declare module '@inertiajs/react' {
    interface FormDataType {
        [key: string]: string | number | boolean | File | null | undefined | FormDataType | FormDataType[];
    }
}
