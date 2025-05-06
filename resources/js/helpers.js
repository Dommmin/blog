import { format } from 'date-fns';
import { enUS, pl, de } from 'date-fns/locale';

function formatDate(date, locale = 'en') {
    let formatString = 'yyyy-MM-dd';

    switch(locale) {
        case 'en':
            locale = enUS;
            break;
        case 'pl':
            locale = pl;
            formatString = 'dd.MM.yyyy';
            break;
        case 'de':
            locale = de;
            formatString = 'dd.MM.yyyy';
            break;
        default:
            locale = enUS;
    }

    return format(new Date(date), formatString, { locale: locale });
}

function ucFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export { formatDate, ucFirst };
