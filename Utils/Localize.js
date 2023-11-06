import { getLocales,getCountry } from "react-native-localize";
import * as RNLocalize from "react-native-localize";

export default{
    countryCode : getLocales()[0].countryCode == 'GB' ? 'IN':getLocales()[0].countryCode,
    country : getCountry(),
    currency:RNLocalize.getCurrencies()[0].currency
}

// export default {
// countryCode: await getLocales().countryCode

// }