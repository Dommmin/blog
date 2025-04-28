import { format } from 'date-fns';

function formatDate(date, formatString = 'MMMM d, yyyy') {
    return format(new Date(date), formatString);
}

function ucFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export { formatDate, ucFirst };
