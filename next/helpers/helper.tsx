import UAParser from 'ua-parser-js'

const parser = new UAParser()

const userAgentInfo = parser.getResult()

const formatString = (fmt: string, ...args: any[]): any => {
    if (!fmt.match(/^(?:(?:(?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{[0-9]+\}))+$/)) {
        throw new Error('invalid format string.');
    }
    return fmt.replace(/((?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{([0-9]+)\})/g, (m, str, index) => {
        if (str) {
            return str.replace(/(?:{{)|(?:}})/g, (m: any) => m[0]);
        } else {
            if (index >= args.length) {
                throw new Error('argument index is out of range in format');
            }
            return args[index];
        }
    });
}

const ltrim = (str: string, chr: string): any => {
    const rgxtrim = (!chr) ? new RegExp('^\\s+') : new RegExp('^' + chr + '+');
    return str.replace(rgxtrim, '');
}

const isSafari = (): any => {
    return (
        userAgentInfo.browser.name === 'Safari' ||
        userAgentInfo.browser.name === 'Mobile Safari'
    )
}

const isFirefox = (): any => {
    return userAgentInfo.browser.name === 'Firefox'
}

const number_format = (number: any, decimals: any, dec_point: any, thousands_point: any): any => {
    if (number == null || !isFinite(number)) {
        throw new TypeError("number is not valid");
    }

    if (!decimals) {
        const len = number.toString().split('.').length;
        decimals = len > 1 ? len : 0;
    }

    if (!dec_point) {
        dec_point = '.';
    }

    if (!thousands_point) {
        thousands_point = ',';
    }

    number = parseFloat(number).toFixed(decimals);

    number = number.replace(".", dec_point);

    const splitNum = number.split(dec_point);
    splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_point);
    number = splitNum.join(dec_point);

    return number;
}

const getCurrency = (floatcurr: number, _curr = 'USD'): any => {

    const currencies: any = {
        'ARS': [2, ',', '.'],         //  Argentine Peso
        'AMD': [2, '.', ','],         //  Armenian Dram
        'AWG': [2, '.', ','],         //  Aruban Guilder
        'AUD': [2, '.', ' '],         //  Australian Dollar
        'BSD': [2, '.', ','],         //  Bahamian Dollar
        'BHD': [3, '.', ','],         //  Bahraini Dinar
        'BDT': [2, '.', ','],         //  Bangladesh, Taka
        'BZD': [2, '.', ','],         //  Belize Dollar
        'BMD': [2, '.', ','],          //  Bermudian Dollar
        'BOB': [2, '.', ','],          //  Bolivia, Boliviano
        'BAM': [2, '.', ','],          //  Bosnia and Herzegovina, Convertible Marks
        'BWP': [2, '.', ','],          //  Botswana, Pula
        'BRL': [2, ',', '.'],          //  Brazilian Real
        'BND': [2, '.', ','],          //  Brunei Dollar
        'CAD': [2, '.', ','],          //  Canadian Dollar
        'KYD': [2, '.', ','],          //  Cayman Islands Dollar
        'CLP': [0, '', '.'],           //  Chilean Peso
        'CNY': [2, '.', ','],          //  China Yuan Renminbi
        'COP': [2, ',', '.'],          //  Colombian Peso
        'CRC': [2, ',', '.'],          //  Costa Rican Colon
        'HRK': [2, ',', '.'],          //  Croatian Kuna
        'CUC': [2, '.', ','],          //  Cuban Convertible Peso
        'CUP': [2, '.', ','],          //  Cuban Peso
        'CYP': [2, '.', ','],          //  Cyprus Pound
        'CZK': [2, '.', ','],          //  Czech Koruna
        'DKK': [2, ',', '.'],          //  Danish Krone
        'DOP': [2, '.', ','],          //  Dominican Peso
        'XCD': [2, '.', ','],          //  East Caribbean Dollar
        'EGP': [2, '.', ','],          //  Egyptian Pound
        'SVC': [2, '.', ','],          //  El Salvador Colon
        'ATS': [2, ',', '.'],          //  Euro
        'BEF': [2, ',', '.'],          //  Euro
        'DEM': [2, ',', '.'],          //  Euro
        'EEK': [2, ',', '.'],          //  Euro
        'ESP': [2, ',', '.'],          //  Euro
        'EUR': [2, ',', '.'],          //  Euro
        'FIM': [2, ',', '.'],          //  Euro
        'FRF': [2, ',', '.'],          //  Euro
        'GRD': [2, ',', '.'],          //  Euro
        'IEP': [2, ',', '.'],          //  Euro
        'ITL': [2, ',', '.'],          //  Euro
        'LUF': [2, ',', '.'],          //  Euro
        'NLG': [2, ',', '.'],          //  Euro
        'PTE': [2, ',', '.'],          //  Euro
        'GHC': [2, '.', ','],          //  Ghana, Cedi
        'GIP': [2, '.', ','],          //  Gibraltar Pound
        'GTQ': [2, '.', ','],          //  Guatemala, Quetzal
        'HNL': [2, '.', ','],          //  Honduras, Lempira
        'HKD': [2, '.', ','],          //  Hong Kong Dollar
        'HUF': [0, '', '.'],           //  Hungary, Forint
        'ISK': [0, '', '.'],           //  Iceland Krona
        'INR': [2, '.', ','],          //  Indian Rupee
        'IDR': [2, ',', '.'],          //  Indonesia, Rupiah
        'IRR': [2, '.', ','],          //  Iranian Rial
        'JMD': [2, '.', ','],          //  Jamaican Dollar
        'JPY': [0, '', ','],           //  Japan, Yen
        'JOD': [3, '.', ','],          //  Jordanian Dinar
        'KES': [2, '.', ','],          //  Kenyan Shilling
        'KWD': [3, '.', ','],          //  Kuwaiti Dinar
        'LVL': [2, '.', ','],          //  Latvian Lats
        'LBP': [0, '', ' '],           //  Lebanese Pound
        'LTL': [2, ',', ' '],          //  Lithuanian Litas
        'MKD': [2, '.', ','],          //  Macedonia, Denar
        'MYR': [2, '.', ','],          //  Malaysian Ringgit
        'MTL': [2, '.', ','],          //  Maltese Lira
        'MUR': [0, '', ','],           //  Mauritius Rupee
        'MXN': [2, '.', ','],          //  Mexican Peso
        'MZM': [2, ',', '.'],          //  Mozambique Metical
        'NPR': [2, '.', ','],          //  Nepalese Rupee
        'ANG': [2, '.', ','],          //  Netherlands Antillian Guilder
        'ILS': [2, '.', ','],          //  New Israeli Shekel
        'TRY': [2, '.', ','],          //  New Turkish Lira
        'NZD': [2, '.', ','],          //  New Zealand Dollar
        'NOK': [2, ',', '.'],          //  Norwegian Krone
        'PKR': [2, '.', ','],          //  Pakistan Rupee
        'PEN': [2, '.', ','],          //  Peru, Nuevo Sol
        'UYU': [2, ',', '.'],          //  Peso Uruguayo
        'PHP': [2, '.', ','],          //  Philippine Peso
        'PLN': [2, '.', ' '],          //  Poland, Zloty
        'GBP': [2, '.', ','],          //  Pound Sterling
        'OMR': [3, '.', ','],          //  Rial Omani
        'RON': [2, ',', '.'],          //  Romania, New Leu
        'ROL': [2, ',', '.'],          //  Romania, Old Leu
        'RUB': [2, ',', '.'],          //  Russian Ruble
        'SAR': [2, '.', ','],          //  Saudi Riyal
        'SGD': [2, '.', ','],          //  Singapore Dollar
        'SKK': [2, ',', ' '],          //  Slovak Koruna
        'SIT': [2, ',', '.'],          //  Slovenia, Tolar
        'ZAR': [2, '.', ' '],          //  South Africa, Rand
        'KRW': [0, '', ','],           //  South Korea, Won
        'SZL': [2, '.', ', '],         //  Swaziland, Lilangeni
        'SEK': [2, ',', '.'],          //  Swedish Krona
        'CHF': [2, '.', '\''],         //  Swiss Franc
        'TZS': [2, '.', ','],          //  Tanzanian Shilling
        'THB': [2, '.', ','],          //  Thailand, Baht
        'TOP': [2, '.', ','],          //  Tonga, Paanga
        'AED': [2, '.', ','],          //  UAE Dirham
        'UAH': [2, ',', ' '],          //  Ukraine, Hryvnia
        'USD': [2, '.', ','],          //  US Dollar
        'VUV': [0, '', ','],           //  Vanuatu, Vatu
        'VEF': [2, ',', '.'],          //  Venezuela Bolivares Fuertes
        'VEB': [2, ',', '.'],          //  Venezuela, Bolivar
        'VND': [0, '', '.'],           //  Viet Nam, Dong
        'ZWD': [2, '.', ' '],          //  Zimbabwe Dollar
    };

    return number_format(floatcurr, currencies[_curr][0], currencies[_curr][1], currencies[_curr][2])
}

const capitalize = (string: any): any => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const readableBytes = (x: any): any => {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l) {
        n = n / 1024;
    }
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

function isBrowser() {
    return typeof window !== 'undefined';
}

const in_array = function (value: any, needle: Array<any>): boolean {
    const count = needle?.filter((item: any) => item === value)?.length;
    if (count > 0) {
        return true;
    } else {
        return false;
    }
}

export {
    formatString,
    ltrim,
    isSafari,
    isFirefox,
    getCurrency,
    number_format,
    capitalize,
    readableBytes,
    isBrowser,
    in_array,
};