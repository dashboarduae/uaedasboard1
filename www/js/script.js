var curCountry;
var countryList;
var countrySelectedFromMap = true;
var countryMap = null;



function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();

      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }
  return obj;
}

var isoCountries = {
    'AF' : 'Afghanistan',
    'AX' : 'Aland Islands',
    'AL' : 'Albania',
    'DZ' : 'Algeria',
    'AS' : 'American Samoa',
    'AD' : 'Andorra',
    'AO' : 'Angola',
    'AI' : 'Anguilla',
    'AQ' : 'Antarctica',
    'AG' : 'Antigua And Barbuda',
    'AR' : 'Argentina',
    'AM' : 'Armenia',
    'AW' : 'Aruba',
    'AU' : 'Australia',
    'AT' : 'Austria',
    'AZ' : 'Azerbaijan',
    'BS' : 'Bahamas',
    'BH' : 'Bahrain',
    'BD' : 'Bangladesh',
    'BB' : 'Barbados',
    'BY' : 'Belarus',
    'BE' : 'Belgium',
    'BZ' : 'Belize',
    'BJ' : 'Benin',
    'BM' : 'Bermuda',
    'BT' : 'Bhutan',
    'BO' : 'Bolivia',
    'BA' : 'Bosnia And Herzegovina',
    'BW' : 'Botswana',
    'BV' : 'Bouvet Island',
    'BR' : 'Brazil',
    'IO' : 'British Indian Ocean Territory',
    'BN' : 'Brunei Darussalam',
    'BG' : 'Bulgaria',
    'BF' : 'Burkina Faso',
    'BI' : 'Burundi',
    'KH' : 'Cambodia',
    'CM' : 'Cameroon',
    'CA' : 'Canada',
    'CV' : 'Cape Verde',
    'KY' : 'Cayman Islands',
    'CF' : 'Central African Republic',
    'TD' : 'Chad',
    'CL' : 'Chile',
    'CN' : 'China',
    'CX' : 'Christmas Island',
    'CC' : 'Cocos (Keeling) Islands',
    'CO' : 'Colombia',
    'KM' : 'Comoros',
    'CG' : 'Congo',
    'CD' : 'Congo, Democratic Republic',
    'CK' : 'Cook Islands',
    'CR' : 'Costa Rica',
    'CI' : 'Cote D\'Ivoire',
    'HR' : 'Croatia',
    'CU' : 'Cuba',
    'CY' : 'Cyprus',
    'CZ' : 'Czech Republic',
    'DK' : 'Denmark',
    'DJ' : 'Djibouti',
    'DM' : 'Dominica',
    'DO' : 'Dominican Republic',
    'EC' : 'Ecuador',
    'EG' : 'Egypt',
    'SV' : 'El Salvador',
    'GQ' : 'Equatorial Guinea',
    'ER' : 'Eritrea',
    'EE' : 'Estonia',
    'ET' : 'Ethiopia',
    'FK' : 'Falkland Islands (Malvinas)',
    'FO' : 'Faroe Islands',
    'FJ' : 'Fiji',
    'FI' : 'Finland',
    'FR' : 'France',
    'GF' : 'French Guiana',
    'PF' : 'French Polynesia',
    'TF' : 'French Southern Territories',
    'GA' : 'Gabon',
    'GM' : 'Gambia',
    'GE' : 'Georgia',
    'DE' : 'Germany',
    'GH' : 'Ghana',
    'GI' : 'Gibraltar',
    'GR' : 'Greece',
    'GL' : 'Greenland',
    'GD' : 'Grenada',
    'GP' : 'Guadeloupe',
    'GU' : 'Guam',
    'GT' : 'Guatemala',
    'GG' : 'Guernsey',
    'GN' : 'Guinea',
    'GW' : 'Guinea-Bissau',
    'GY' : 'Guyana',
    'HT' : 'Haiti',
    'HM' : 'Heard Island & Mcdonald Islands',
    'VA' : 'Holy See (Vatican City State)',
    'HN' : 'Honduras',
    'HK' : 'Hong Kong',
    'HU' : 'Hungary',
    'IS' : 'Iceland',
    'IN' : 'India',
    'ID' : 'Indonesia',
    'IR' : 'Iran, Islamic Republic Of',
    'IQ' : 'Iraq',
    'IE' : 'Ireland',
    'IM' : 'Isle Of Man',
    'IL' : 'Israel',
    'IT' : 'Italy',
    'JM' : 'Jamaica',
    'JP' : 'Japan',
    'JE' : 'Jersey',
    'JO' : 'Jordan',
    'KZ' : 'Kazakhstan',
    'KE' : 'Kenya',
    'KI' : 'Kiribati',
    'KR' : 'Korea',
    'KW' : 'Kuwait',
    'KG' : 'Kyrgyzstan',
    'LA' : 'Lao People\'s Democratic Republic',
    'LV' : 'Latvia',
    'LB' : 'Lebanon',
    'LS' : 'Lesotho',
    'LR' : 'Liberia',
    'LY' : 'Libyan Arab Jamahiriya',
    'LI' : 'Liechtenstein',
    'LT' : 'Lithuania',
    'LU' : 'Luxembourg',
    'MO' : 'Macao',
    'MK' : 'Macedonia',
    'MG' : 'Madagascar',
    'MW' : 'Malawi',
    'MY' : 'Malaysia',
    'MV' : 'Maldives',
    'ML' : 'Mali',
    'MT' : 'Malta',
    'MH' : 'Marshall Islands',
    'MQ' : 'Martinique',
    'MR' : 'Mauritania',
    'MU' : 'Mauritius',
    'YT' : 'Mayotte',
    'MX' : 'Mexico',
    'FM' : 'Micronesia, Federated States Of',
    'MD' : 'Moldova',
    'MC' : 'Monaco',
    'MN' : 'Mongolia',
    'ME' : 'Montenegro',
    'MS' : 'Montserrat',
    'MA' : 'Morocco',
    'MZ' : 'Mozambique',
    'MM' : 'Myanmar',
    'NA' : 'Namibia',
    'NR' : 'Nauru',
    'NP' : 'Nepal',
    'NL' : 'Netherlands',
    'AN' : 'Netherlands Antilles',
    'NC' : 'New Caledonia',
    'NZ' : 'New Zealand',
    'NI' : 'Nicaragua',
    'NE' : 'Niger',
    'NG' : 'Nigeria',
    'NU' : 'Niue',
    'NF' : 'Norfolk Island',
    'MP' : 'Northern Mariana Islands',
    'NO' : 'Norway',
    'OM' : 'Oman',
    'PK' : 'Pakistan',
    'PW' : 'Palau',
    'PS' : 'Palestinian Territory, Occupied',
    'PA' : 'Panama',
    'PG' : 'Papua New Guinea',
    'PY' : 'Paraguay',
    'PE' : 'Peru',
    'PH' : 'Philippines',
    'PN' : 'Pitcairn',
    'PL' : 'Poland',
    'PT' : 'Portugal',
    'PR' : 'Puerto Rico',
    'QA' : 'Qatar',
    'RE' : 'Reunion',
    'RO' : 'Romania',
    'RU' : 'Russian Federation',
    'RW' : 'Rwanda',
    'BL' : 'Saint Barthelemy',
    'SH' : 'Saint Helena',
    'KN' : 'Saint Kitts And Nevis',
    'LC' : 'Saint Lucia',
    'MF' : 'Saint Martin',
    'PM' : 'Saint Pierre And Miquelon',
    'VC' : 'Saint Vincent And Grenadines',
    'WS' : 'Samoa',
    'SM' : 'San Marino',
    'ST' : 'Sao Tome And Principe',
    'SA' : 'Saudi Arabia',
    'SN' : 'Senegal',
    'RS' : 'Serbia',
    'SC' : 'Seychelles',
    'SL' : 'Sierra Leone',
    'SG' : 'Singapore',
    'SK' : 'Slovakia',
    'SI' : 'Slovenia',
    'SB' : 'Solomon Islands',
    'SO' : 'Somalia',
    'ZA' : 'South Africa',
    'GS' : 'South Georgia And Sandwich Isl.',
    'ES' : 'Spain',
    'LK' : 'Sri Lanka',
    'SD' : 'Sudan',
    'SR' : 'Suriname',
    'SJ' : 'Svalbard And Jan Mayen',
    'SZ' : 'Swaziland',
    'SE' : 'Sweden',
    'CH' : 'Switzerland',
    'SY' : 'Syrian Arab Republic',
    'TW' : 'Taiwan',
    'TJ' : 'Tajikistan',
    'TZ' : 'Tanzania',
    'TH' : 'Thailand',
    'TL' : 'Timor-Leste',
    'TG' : 'Togo',
    'TK' : 'Tokelau',
    'TO' : 'Tonga',
    'TT' : 'Trinidad And Tobago',
    'TN' : 'Tunisia',
    'TR' : 'Turkey',
    'TM' : 'Turkmenistan',
    'TC' : 'Turks And Caicos Islands',
    'TV' : 'Tuvalu',
    'UG' : 'Uganda',
    'UA' : 'Ukraine',
    'AE' : 'United Arab Emirates',
    'GB' : 'United Kingdom',
    'US' : 'United States',
    'UM' : 'United States Outlying Islands',
    'UY' : 'Uruguay',
    'UZ' : 'Uzbekistan',
    'VU' : 'Vanuatu',
    'VE' : 'Venezuela',
    'VN' : 'Viet Nam',
    'VG' : 'Virgin Islands, British',
    'VI' : 'Virgin Islands, U.S.',
    'WF' : 'Wallis And Futuna',
    'EH' : 'Western Sahara',
    'YE' : 'Yemen',
    'ZM' : 'Zambia',
    'ZW' : 'Zimbabwe'
};

function getCountryName (countryCode) {
    if (isoCountries.hasOwnProperty(countryCode)) {
        return isoCountries[countryCode];
    } else {
        return countryCode;
    }
}


function showLoadingScreen(){
	$('#loadingscreen').show();
}

function hideLoadingScreen(){
	$('#loadingscreen').hide();
}

function getCountries(lang){
	return {"language":"EN","status":0,"type":1,"data":[{"id":4,"name":"Afghanistan","officialName":"Afghanistan, Islamic Republic of ","region":"Southern Asia","continent":"Asia","capital":"Kabul","iso2":"AF","iso3":"AFG","globalCode":null},{"id":8,"name":"Albania","officialName":"Albaniam, Republic of","region":"Southern Europe","continent":"Europe","capital":"Tirana","iso2":"AL","iso3":"ALB","globalCode":null},{"id":12,"name":"Algeria","officialName":"Algeria, People's Democratic Republic of","region":"Northern Africa","continent":"Africa","capital":"Algeria","iso2":"DZ","iso3":"DZA","globalCode":null},{"id":16,"name":"American Samoa","officialName":"American Samoa","region":"Polynesia","continent":"Oceania","capital":"Pago Pago","iso2":"AS","iso3":"ASM","globalCode":null},{"id":20,"name":"Andorra","officialName":"Andorra, Republic of","region":"Southern Europe","continent":"Europe","capital":"Andorra la Vella","iso2":"AD","iso3":"AND","globalCode":null},{"id":24,"name":"Angola","officialName":"Angola, Republic of","region":"Middle Africa ","continent":"Africa","capital":"Luanda","iso2":"AO","iso3":"AGO","globalCode":null},{"id":28,"name":"Antigua and Barbuda","officialName":"Antigua and Barbuda","region":"The Caribbean","continent":"Americas","capital":"St. John's","iso2":"AG","iso3":"ATG","globalCode":null},{"id":31,"name":"Azerbaijan","officialName":"Azerbaijan, Republic of","region":"Western Asia","continent":"Asia","capital":"Baku","iso2":"AZ","iso3":"AZE","globalCode":null},{"id":32,"name":"Argentina","officialName":"Argentina, Republic of","region":"South America","continent":"Americas","capital":"BUENOS AIRES","iso2":"AR","iso3":"ARG","globalCode":null},{"id":36,"name":"Australia","officialName":"Australia, Republic of","region":"Australia and New Zealand","continent":"Oceania","capital":"Canberra","iso2":"AU","iso3":"AUS","globalCode":null},{"id":40,"name":"Austria","officialName":"Austria, Republic of","region":"Western Europe","continent":"Europe","capital":"vienna","iso2":"AT","iso3":"AUT","globalCode":null},{"id":44,"name":"Bahamas","officialName":"Bahamas, Republic of","region":"The Caribbean","continent":"Americas","capital":"Nassau","iso2":"BS","iso3":"BHS","globalCode":null},{"id":48,"name":"Bahrain","officialName":"Bahrain, Republic of","region":"Western Asia","continent":"Asia","capital":"Manama","iso2":"BH","iso3":"BHR","globalCode":null},{"id":50,"name":"Bangladesh","officialName":"Bangladesh, Republic of","region":"Southern Asia","continent":"Asia","capital":"dhaka","iso2":"BD","iso3":"BGD","globalCode":null},{"id":51,"name":"Armenia","officialName":"Armenia, Republic of","region":"Western Asia","continent":"Asia","capital":"Yerevan","iso2":"AM","iso3":"ARM","globalCode":null},{"id":52,"name":"Barbados","officialName":"Barbados, Republic of","region":"The Caribbean","continent":"Americas","capital":"Bridgetown","iso2":"BB","iso3":"BRB","globalCode":null},{"id":56,"name":"Belgium","officialName":"Belgium, Republic of","region":"Western Europe","continent":"Europe","capital":"Brussels","iso2":"BE","iso3":"BEL","globalCode":null},{"id":60,"name":"Bermuda","officialName":"Bermuda","region":"Northern America","continent":"Americas","capital":"Hamilton","iso2":"BM","iso3":"BMU","globalCode":null},{"id":64,"name":"Bhutan","officialName":"Bhutan, Republic of","region":"Southern Asia","continent":"Asia","capital":"Thimphu","iso2":"BT","iso3":"BTN","globalCode":null},{"id":68,"name":"Bolivia","officialName":"Bolivia, Plurinational State of","region":"South America","continent":"Americas","capital":"Sucre","iso2":"BO","iso3":"BOL","globalCode":null},{"id":70,"name":"Bosnia and Herzegovina","officialName":"Bosnia and Herzegovina, Republic of","region":"Southern Europe","continent":"Europe","capital":"Sarajevo","iso2":"BA","iso3":"BIH","globalCode":null},{"id":72,"name":"Botswana","officialName":"Botswana, Republic of","region":"Southern Africa","continent":"Africa","capital":"Gaborone","iso2":"BW","iso3":"BWA","globalCode":null},{"id":76,"name":"Brazil","officialName":"Brazil, Republic of","region":"South America","continent":"Americas","capital":"Brasilia","iso2":"BR","iso3":"BRA","globalCode":null},{"id":84,"name":"Belize","officialName":"Belize, Republic of","region":"Central America","continent":"Americas","capital":"Belmopan","iso2":"BZ","iso3":"BLZ","globalCode":null},{"id":90,"name":"Solomon Islands","officialName":"Solomon Islands","region":"Melanesia","continent":"Oceania","capital":"Honiara","iso2":"SB","iso3":"SLB","globalCode":null},{"id":92,"name":"British Virgin Islands","officialName":"British Virgin Islands","region":"The Caribbean","continent":"Americas","capital":"Road Town","iso2":"VG","iso3":"VGB","globalCode":null},{"id":96,"name":"Brunei","officialName":"Brunei Darussalam, Republic of","region":"South-Eastern Asia","continent":"Asia","capital":"Bandar Seri Begawan","iso2":"BN","iso3":"BRN","globalCode":null},{"id":100,"name":"Bulgaria","officialName":"Bulgaria, Republic of","region":"Eastern Europe","continent":"Europe","capital":"Sofia","iso2":"BG","iso3":"BGR","globalCode":null},{"id":104,"name":"Myanmar","officialName":"Myanmar, Republic of","region":"South-Eastern Asia","continent":"Asia","capital":"Naypyidaw","iso2":"MM","iso3":"MMR","globalCode":null},{"id":108,"name":"Burundi","officialName":"Burundi, Republic of","region":"Eastern Africa","continent":"Africa","capital":"Bujumbura","iso2":"BI","iso3":"BDI","globalCode":null},{"id":112,"name":"Belarus","officialName":"Belarus, Republic of","region":"Eastern Europe","continent":"Europe","capital":"Minsk","iso2":"BY","iso3":"BLR","globalCode":null},{"id":116,"name":"Cambodia","officialName":"Cambodia, Republic of","region":"South-Eastern Asia","continent":"Asia","capital":"Phnom Penh","iso2":"KH","iso3":"KHM","globalCode":null},{"id":120,"name":"Cameroon","officialName":"Cameroon, Republic of","region":"Middle Africa ","continent":"Africa","capital":"Yaounde","iso2":"CM","iso3":"CMR","globalCode":null},{"id":124,"name":"Canada","officialName":"Canada, Republic of","region":"Northern America","continent":"Americas","capital":"Ottawa","iso2":"CA","iso3":"CAN","globalCode":null},{"id":132,"name":"Cape Verde","officialName":"Cape Verde, Republic of","region":"Western Africa","continent":"Africa","capital":"Praia","iso2":"CV","iso3":"CPV","globalCode":null},{"id":136,"name":"Cayman Islands","officialName":"Cayman Islands","region":"The Caribbean","continent":"Americas","capital":"George Town","iso2":"KY","iso3":"CYM","globalCode":null},{"id":140,"name":"Central African Republic","officialName":"Central African Republic","region":"Middle Africa ","continent":"Africa","capital":"Panji","iso2":"CF","iso3":"CAF","globalCode":null},{"id":144,"name":"Sri Lanka","officialName":"Sri Lanka, Republic of","region":"Southern Asia","continent":"Asia","capital":"Colombo","iso2":"LK","iso3":"LKA","globalCode":null},{"id":148,"name":"Chad","officialName":"Chad, Republic of","region":"Middle Africa ","continent":"Africa","capital":"N'djamena","iso2":"TD","iso3":"TCD","globalCode":null},{"id":152,"name":"Chile","officialName":"Chile, Republic of","region":"South America","continent":"Americas","capital":"Santiago","iso2":"CL","iso3":"CHL","globalCode":null},{"id":156,"name":"China","officialName":"China, People's Republic of","region":"Eastern Asia","continent":"Asia","capital":"Beijing","iso2":"CN","iso3":"CHN","globalCode":null},{"id":162,"name":"Christmas Island","officialName":"Christmas Island","region":"South-Eastern Asia","continent":"Asia","capital":"Flying Fish Cove","iso2":null,"iso3":"CXR","globalCode":null},{"id":166,"name":"Cocos Islands","officialName":"Cocos (Keeling) Islands","region":"South-Eastern Asia","continent":"Asia","capital":null,"iso2":null,"iso3":"CCK","globalCode":null},{"id":170,"name":"Colombia","officialName":"Colombia, Republic of","region":"South America","continent":"Americas","capital":"Bogota","iso2":"CO","iso3":"COL","globalCode":null},{"id":174,"name":"Comoros","officialName":"Comoros, Union of the","region":"Eastern Africa","continent":"Africa","capital":"Moroney","iso2":"KM","iso3":"COM","globalCode":null},{"id":175,"name":"Mayotte","officialName":"Mayotte","region":"Eastern Africa","continent":"Africa","capital":"Mamoudzou","iso2":"YT","iso3":"MYT","globalCode":null},{"id":178,"name":"Congo","officialName":"Congo, Republic of","region":"Middle Africa ","continent":"Africa","capital":"Brazzaville","iso2":"CG","iso3":"COG","globalCode":null},{"id":180,"name":"DR Congo","officialName":"Congo, Democratic Republic of","region":"Middle Africa ","continent":"Africa","capital":"Kinshasa","iso2":"CD","iso3":"COD","globalCode":null},{"id":184,"name":"Cook Islands","officialName":"Cook Islands","region":"Polynesia","continent":"Oceania","capital":"Aoaroa","iso2":"CK","iso3":"COK","globalCode":null},{"id":188,"name":"Costa Rica","officialName":"Costa Rica, Republic of","region":"Central America","continent":"Americas","capital":"San Jose","iso2":"CR","iso3":"CRI","globalCode":null},{"id":191,"name":"Croatia","officialName":"Croatia, Republic of","region":"Southern Europe","continent":"Europe","capital":"Zagreb","iso2":"HR","iso3":"HRV","globalCode":null},{"id":192,"name":"Cuba","officialName":"Cuba, Republic of","region":"The Caribbean","continent":"Americas","capital":"Havana","iso2":"CU","iso3":"CUB","globalCode":null},{"id":196,"name":"Cyprus","officialName":"Cyprus, Republic of","region":"Western Asia","continent":"Asia","capital":"Nicosia","iso2":"CY","iso3":"CYP","globalCode":null},{"id":203,"name":"Czech Republic","officialName":"Czech Republic","region":"Eastern Europe","continent":"Europe","capital":"Prague","iso2":"CZ","iso3":"CZE","globalCode":null},{"id":204,"name":"Benin","officialName":"Benin, Republic of","region":"Western Africa","continent":"Africa","capital":"Porto Novo","iso2":"BJ","iso3":"BEN","globalCode":null},{"id":208,"name":"Denmark","officialName":"Denmark, Republic of","region":"Northern Europe","continent":"Europe","capital":"Copenhagen","iso2":"DK","iso3":"DNK","globalCode":null},{"id":212,"name":"Dominica","officialName":"Dominica, Republic of","region":"The Caribbean","continent":"Americas","capital":"Rousseau","iso2":"DM","iso3":"DMA","globalCode":null},{"id":214,"name":"Dominican Republic","officialName":"Dominican Republic","region":"The Caribbean","continent":"Americas","capital":"Santo Domingo","iso2":"DO","iso3":"DOM","globalCode":null},{"id":218,"name":"Ecuador","officialName":"Ecuador, Republic of","region":"South America","continent":"Americas","capital":"Quito","iso2":"EC","iso3":"ECU","globalCode":null},{"id":222,"name":"El Salvador","officialName":"El Salvador, Republic of","region":"Central America","continent":"Americas","capital":"San Salvador","iso2":"SV","iso3":"SLV","globalCode":null},{"id":226,"name":"Equatorial Guinea","officialName":"Equatorial Guinea, Republic of","region":"Middle Africa ","continent":"Africa","capital":"Malabo","iso2":"GQ","iso3":"GNQ","globalCode":null},{"id":231,"name":"Ethiopia","officialName":"Ethiopia, Federal Democratic Republic of","region":"Eastern Africa","continent":"Africa","capital":"Addis Ababa","iso2":"ET","iso3":"ETH","globalCode":null},{"id":232,"name":"Eritrea","officialName":"Eritrea, State of","region":"Eastern Africa","continent":"Africa","capital":"Asmara","iso2":"ER","iso3":"ERI","globalCode":null},{"id":233,"name":"Estonia","officialName":"Estonia, Republic of","region":"Northern Europe","continent":"Europe","capital":"Tallinn","iso2":"EE","iso3":"EST","globalCode":null},{"id":234,"name":"Faeroe Islands","officialName":"Faeroe Islands","region":"Northern Europe","continent":"Europe","capital":"Tórshavn","iso2":"FO","iso3":"FRO","globalCode":null},{"id":238,"name":"Falkland Islands","officialName":"Falkland Islands (Malvinas)","region":"South America","continent":"Americas","capital":"Stanley","iso2":"FK","iso3":"FLK","globalCode":null},{"id":239,"name":"S. Georgia and S. Sandwich Islands","officialName":"South Georgia and the South Sandwich Islands","region":"South America","continent":"Americas","capital":"King Edward Point","iso2":null,"iso3":"SGS","globalCode":null},{"id":242,"name":"Fiji","officialName":"Fiji, Republic of","region":"Melanesia","continent":"Oceania","capital":"Suva","iso2":"FJ","iso3":"FJI","globalCode":null},{"id":246,"name":"Finland","officialName":"Finland, Republic of","region":"Northern Europe","continent":"Europe","capital":"Helsinki","iso2":"FI","iso3":"FIN","globalCode":null},{"id":248,"name":"Aland Islands","officialName":"Aland Islands","region":"Northern Europe","continent":"Europe","capital":"Mariehamn","iso2":"AX","iso3":"ALA","globalCode":null},{"id":250,"name":"France","officialName":"France, Republic of","region":"Western Europe","continent":"Europe","capital":"Paris","iso2":"FR","iso3":"FRA","globalCode":null},{"id":254,"name":"French Guiana","officialName":"French Guiana","region":"South America","continent":"Americas","capital":"Cayenne","iso2":"GF","iso3":"GUF","globalCode":null},{"id":258,"name":"French Polynesia","officialName":"French Polynesia","region":"Polynesia","continent":"Oceania","capital":"Papeete","iso2":"PF","iso3":"PYF","globalCode":null},{"id":260,"name":"French Southern Territories","officialName":"French Southern and Antarctic Lands","region":"Antarctica","continent":"Antarctica","capital":null,"iso2":"AT","iso3":"ATF","globalCode":null},{"id":262,"name":"Djibouti","officialName":"Djibouti, Republic of","region":"Eastern Africa","continent":"Africa","capital":"Djibouti","iso2":"DJ","iso3":"DJI","globalCode":null},{"id":266,"name":"Gabon","officialName":"Gabon, Republic of","region":"Middle Africa ","continent":"Africa","capital":"Libreville","iso2":"GA","iso3":"GAB","globalCode":null},{"id":268,"name":"Georgia","officialName":"Georgia, Republic of","region":"Western Asia","continent":"Asia","capital":"Tbilisi","iso2":"GE","iso3":"GEO","globalCode":null},{"id":270,"name":"Gambia","officialName":"Gambia, Republic of","region":"Western Africa","continent":"Africa","capital":"Banjul","iso2":"GM","iso3":"GMB","globalCode":null},{"id":275,"name":"Palestine","officialName":"Palestine","region":"Western Asia","continent":"Asia","capital":"Panama City","iso2":"PS","iso3":"PSE","globalCode":null},{"id":276,"name":"Germany","officialName":"Germany, Republic of","region":"Western Europe","continent":"Europe","capital":"Berlin","iso2":"DE","iso3":"DEU","globalCode":null},{"id":288,"name":"Ghana","officialName":"Ghana, Republic of","region":"Western Africa","continent":"Africa","capital":"Accra","iso2":"GH","iso3":"GHA","globalCode":null},{"id":292,"name":"Gibraltar","officialName":"Gibraltar","region":"Southern Europe","continent":"Europe","capital":null,"iso2":"GI","iso3":"GIB","globalCode":null},{"id":296,"name":"Kiribati","officialName":"Kiribati, Republic of","region":"Micronesia","continent":"Oceania","capital":"South Tarawa","iso2":"KI","iso3":"KIR","globalCode":null},{"id":300,"name":"Greece","officialName":"Greece, Republic of","region":"Southern Europe","continent":"Europe","capital":"Athens","iso2":"GR","iso3":"GRC","globalCode":null},{"id":304,"name":"Greenland","officialName":"Greenland","region":"Northern America","continent":"Americas","capital":"Nuuk","iso2":"GL","iso3":"GRL","globalCode":null},{"id":308,"name":"Grenada","officialName":"Grenada, Republic of","region":"The Caribbean","continent":"Americas","capital":"St Georges","iso2":"GD","iso3":"GRD","globalCode":null},{"id":312,"name":"Guadeloupe","officialName":"Guadeloupe","region":"The Caribbean","continent":"Americas","capital":"Basse-Terre","iso2":"GP","iso3":"GLP","globalCode":null},{"id":316,"name":"Guam","officialName":"Guam","region":"Micronesia","continent":"Oceania","capital":"Hagatnea","iso2":"GU","iso3":"GUM","globalCode":null},{"id":320,"name":"Guatemala","officialName":"Guatemala, Republic of","region":"Central America","continent":"Americas","capital":"Guatemala","iso2":"GT","iso3":"GTM","globalCode":null},{"id":324,"name":"Guinea","officialName":"Guinea, Republic of","region":"Western Africa","continent":"Africa","capital":"Conakry","iso2":"GN","iso3":"GIN","globalCode":null},{"id":328,"name":"Guyana","officialName":"Guyana, Republic of","region":"South America","continent":"Americas","capital":"Georgetown","iso2":"GY","iso3":"GUY","globalCode":null},{"id":332,"name":"Haiti","officialName":"Haiti, Republic of","region":"The Caribbean","continent":"Americas","capital":"Prince","iso2":"HT","iso3":"HTI","globalCode":null},{"id":336,"name":"Vatican City","officialName":"Vatican City","region":"Southern Europe","continent":"Europe","capital":"Vatican","iso2":null,"iso3":"VAT","globalCode":null},{"id":340,"name":"Honduras","officialName":"Honduras, Republic of","region":"Central America","continent":"Americas","capital":"Tegucigalpa","iso2":"HN","iso3":"HND","globalCode":null},{"id":344,"name":"China, Hong Kong SAR","officialName":"China, Hong Kong Special Administrative Region","region":"Eastern Asia","continent":"Asia","capital":"Beijing","iso2":"HK","iso3":"HKG","globalCode":null},{"id":348,"name":"Hungary","officialName":"Hungary, Republic of","region":"Eastern Europe","continent":"Europe","capital":"Budapest","iso2":"HU","iso3":"HUN","globalCode":null},{"id":352,"name":"Iceland","officialName":"Iceland, Republic of","region":"Northern Europe","continent":"Europe","capital":"Reykjavik","iso2":"IS","iso3":"ISL","globalCode":null},{"id":356,"name":"India","officialName":"India, Republic of","region":"Southern Asia","continent":"Asia","capital":"New Delhi","iso2":"IN","iso3":"IND","globalCode":null},{"id":360,"name":"Indonesia","officialName":"Indonesia, Republic of","region":"South-Eastern Asia","continent":"Asia","capital":"Jakarta","iso2":"ID","iso3":"IDN","globalCode":null},{"id":364,"name":"Iran","officialName":"Iran, Islamic Republic of","region":"Southern Asia","continent":"Asia","capital":"Tehran","iso2":"IR","iso3":"IRN","globalCode":null},{"id":368,"name":"Iraq","officialName":"Iraq, Republic of","region":"Western Asia","continent":"Asia","capital":"Baghdad","iso2":"IQ","iso3":"IRQ","globalCode":null},{"id":372,"name":"Ireland","officialName":"Ireland, Republic of","region":"Northern Europe","continent":"Europe","capital":"Dublin","iso2":"IE","iso3":"IRL","globalCode":null},{"id":380,"name":"Italy","officialName":"Italy, Republic of","region":"Southern Europe","continent":"Europe","capital":"Rome","iso2":"IT","iso3":"ITA","globalCode":null},{"id":384,"name":"Côte d'Ivoire","officialName":"Côte d'Ivoire, Republic of","region":"Western Africa","continent":"Africa","capital":"Yamoussoukro","iso2":"CI","iso3":"CIV","globalCode":null},{"id":388,"name":"Jamaica","officialName":"Jamaica, Republic of","region":"The Caribbean","continent":"Americas","capital":"Kingston","iso2":"JM","iso3":"JAM","globalCode":null},{"id":392,"name":"Japan","officialName":"Japan, Republic of","region":"Eastern Asia","continent":"Asia","capital":"Tokyo","iso2":"JP","iso3":"JPN","globalCode":null},{"id":398,"name":"Kazakhstan","officialName":"Kazakhstan, Republic of","region":"Central Asia","continent":"Asia","capital":"ASTANA","iso2":"KZ","iso3":"KAZ","globalCode":null},{"id":400,"name":"Jordan","officialName":"Jordan, Republic of","region":"Western Asia","continent":"Asia","capital":"Amman","iso2":"JO","iso3":"JOR","globalCode":null},{"id":404,"name":"Kenya","officialName":"Kenya, Republic of","region":"Eastern Africa","continent":"Africa","capital":"Nairobi","iso2":"KE","iso3":"KEN","globalCode":null},{"id":408,"name":"North Korea","officialName":"Korea, Democratic People's Republic of","region":"Eastern Asia","continent":"Asia","capital":"Pyongyang","iso2":"KP","iso3":"PRK","globalCode":null},{"id":410,"name":"South Korea","officialName":"Korea, Republic of","region":"Eastern Asia","continent":"Asia","capital":"Seoul","iso2":"KR","iso3":"KOR","globalCode":null},{"id":414,"name":"Kuwait","officialName":"Kuwait, Republic of","region":"Western Asia","continent":"Asia","capital":"Kuwait","iso2":"KW","iso3":"KWT","globalCode":null},{"id":417,"name":"Kyrgyzstan","officialName":"Kyrgyzstan, Republic of","region":"Central Asia","continent":"Asia","capital":"Bishkek","iso2":"KG","iso3":"KGZ","globalCode":null},{"id":418,"name":"Lao","officialName":"Lao, People’s Democratic Republic","region":"South-Eastern Asia","continent":"Asia","capital":"Vientiane","iso2":"LA","iso3":"LAO","globalCode":null},{"id":422,"name":"Lebanon","officialName":"Lebanon, Republic of","region":"Western Asia","continent":"Asia","capital":"Beirut","iso2":"LB","iso3":"LBN","globalCode":null},{"id":426,"name":"Lesotho","officialName":"Lesotho, Republic of","region":"Southern Africa","continent":"Africa","capital":"Maseru","iso2":"LS","iso3":"LSO","globalCode":null},{"id":428,"name":"Latvia","officialName":"Latvia, Republic of","region":"Northern Europe","continent":"Europe","capital":"Riga","iso2":"LV","iso3":"LVA","globalCode":null},{"id":430,"name":"Liberia","officialName":"Liberia, Republic of","region":"Western Africa","continent":"Africa","capital":"Monrovia","iso2":"LR","iso3":"LBR","globalCode":null},{"id":434,"name":"Libya","officialName":"Libya, Arab Jamahiriya","region":"Northern Africa","continent":"Africa","capital":"Tripoli","iso2":"LY","iso3":"LBY","globalCode":null},{"id":438,"name":"Liechtenstein","officialName":"Liechtenstein, Republic of","region":"Western Europe","continent":"Europe","capital":"Vaduz","iso2":"LI","iso3":"LIE","globalCode":null},{"id":440,"name":"Lithuania","officialName":"Lithuania, Republic of","region":"Northern Europe","continent":"Europe","capital":"Vilnius","iso2":"LT","iso3":"LTU","globalCode":null},{"id":442,"name":"Luxembourg","officialName":"Luxembourg, Republic of","region":"Western Europe","continent":"Europe","capital":"Luxembourg","iso2":"LU","iso3":"LUX","globalCode":null},{"id":446,"name":"Macau","officialName":"China, Macau SAR","region":"Eastern Asia","continent":"Asia","capital":"Macau","iso2":"MO","iso3":"MAC","globalCode":null},{"id":450,"name":"Madagascar","officialName":"Madagascar, Republic of","region":"Eastern Africa","continent":"Africa","capital":"Antananarivo","iso2":"MG","iso3":"MDG","globalCode":null},{"id":454,"name":"Malawi","officialName":"Malawi, Republic of","region":"Eastern Africa","continent":"Africa","capital":"Lilongwe","iso2":"MW","iso3":"MWI","globalCode":null},{"id":458,"name":"Malaysia","officialName":"Malaysia, Republic of","region":"South-Eastern Asia","continent":"Asia","capital":"kuala lumpur","iso2":"MY","iso3":"MYS","globalCode":null},{"id":462,"name":"Maldives","officialName":"Maldives, Republic of","region":"Southern Asia","continent":"Asia","capital":"Malé","iso2":"MV","iso3":"MDV","globalCode":null},{"id":466,"name":"Mali","officialName":"Mali, Republic of","region":"Western Africa","continent":"Africa","capital":"Bamako","iso2":"ML","iso3":"MLI","globalCode":null},{"id":470,"name":"Malta","officialName":"Malta, Republic of","region":"Southern Europe","continent":"Europe","capital":"Valletta","iso2":"MT","iso3":"MLT","globalCode":null},{"id":474,"name":"Martinique","officialName":"Martinique","region":"The Caribbean","continent":"Americas","capital":"Fort-de-France","iso2":"MQ","iso3":"MTQ","globalCode":null},{"id":478,"name":"Mauritania","officialName":"Mauritania, Republic of","region":"Western Africa","continent":"Africa","capital":"Nouakchott","iso2":"MR","iso3":"MRT","globalCode":null},{"id":480,"name":"Mauritius","officialName":"Mauritius, Republic of","region":"Eastern Africa","continent":"Africa","capital":"Port Louis","iso2":"MU","iso3":"MUS","globalCode":null},{"id":484,"name":"Mexico","officialName":"Mexico, Republic of","region":"Central America","continent":"Americas","capital":"Mexico City","iso2":"MX","iso3":"MEX","globalCode":null},{"id":492,"name":"Monaco","officialName":"Monaco, Republic of","region":"Western Europe","continent":"Europe","capital":"Monaco","iso2":"MC","iso3":"MCO","globalCode":null},{"id":496,"name":"Mongolia","officialName":"Mongolia, Republic of","region":"Eastern Asia","continent":"Asia","capital":"Ulan Bator","iso2":"MN","iso3":"MNG","globalCode":null},{"id":498,"name":"Moldova","officialName":"Moldova, Republic of","region":"Eastern Europe","continent":"Europe","capital":"Chisinau","iso2":"MD","iso3":"MDA","globalCode":null},{"id":499,"name":"Montenegro","officialName":"Montenegro, Republic of","region":"Southern Europe","continent":"Europe","capital":"Podgorica","iso2":"ME","iso3":"MNE","globalCode":null},{"id":500,"name":"Montserrat","officialName":"Montserrat","region":"The Caribbean","continent":"Americas","capital":"Plymouth","iso2":"MS","iso3":"MSR","globalCode":null},{"id":504,"name":"Morocco","officialName":"Morocco, Kingdom of","region":"Northern Africa","continent":"Africa","capital":"Rabat","iso2":"MA","iso3":"MAR","globalCode":null},{"id":508,"name":"Mozambique","officialName":"Mozambique, Republic of","region":"Eastern Africa","continent":"Africa","capital":"Maputo","iso2":"MZ","iso3":"MOZ","globalCode":null},{"id":512,"name":"Oman","officialName":"Oman, Sultanate of","region":"Western Asia","continent":"Asia","capital":"Muscat","iso2":"OM","iso3":"OMN","globalCode":null},{"id":516,"name":"Namibia","officialName":"Namibia, Republic of","region":"Southern Africa","continent":"Africa","capital":"Windhoek","iso2":"NA","iso3":"NAM","globalCode":null},{"id":520,"name":"Nauru","officialName":"Nauru, Republic of","region":"Micronesia","continent":"Oceania","capital":"Suburb Yarin","iso2":"NR","iso3":"NRU","globalCode":null},{"id":524,"name":"Nepal","officialName":"Nepal, Republic of","region":"Southern Asia","continent":"Asia","capital":"Kathmandu","iso2":"NP","iso3":"NPL","globalCode":null},{"id":528,"name":"Netherlands","officialName":"Netherlands, Republic of","region":"Western Europe","continent":"Europe","capital":"Amsterdam","iso2":"NL","iso3":"NLD","globalCode":null},{"id":530,"name":"Netherlands antilles","officialName":"Netherlands antilles","region":"The Caribbean","continent":"Americas","capital":"Willemstad","iso2":null,"iso3":"ANT","globalCode":null},{"id":531,"name":"Curacao","officialName":"Curacao","region":"The Caribbean","continent":"Americas","capital":"Willemstad","iso2":null,"iso3":"CUW","globalCode":null},{"id":533,"name":"Aruba","officialName":"Aruba","region":"The Caribbean","continent":"Americas","capital":"Oranjestad","iso2":"AW","iso3":"ABW","globalCode":null},{"id":535,"name":"Bonaire, Saint Eustatius and Saba","officialName":"Bonaire, Saint Eustatius and Saba","region":"The Caribbean","continent":"Americas","capital":"Kralendijk","iso2":null,"iso3":"BES","globalCode":null},{"id":540,"name":"New Caledonia","officialName":"New Caledonia","region":"Melanesia","continent":"Oceania","capital":"Noumea","iso2":"NC","iso3":"NCL","globalCode":null},{"id":548,"name":"Vanuatu","officialName":"Vanuatu, Republic of","region":"Melanesia","continent":"Oceania","capital":"Port Vila","iso2":"VU","iso3":"VUT","globalCode":null},{"id":554,"name":"New Zealand","officialName":"New Zealand, Republic of","region":"Australia and New Zealand","continent":"Oceania","capital":"Wellington","iso2":"NZ","iso3":"NZL","globalCode":null},{"id":558,"name":"Nicaragua","officialName":"Nicaragua, Republic of","region":"Central America","continent":"Americas","capital":"Managua","iso2":"NI","iso3":"NIC","globalCode":null},{"id":562,"name":"Niger","officialName":"Niger, Republic of","region":"Western Africa","continent":"Africa","capital":"Niamey","iso2":"NE","iso3":"NER","globalCode":null},{"id":566,"name":"Nigeria","officialName":"Nigeria, Republic of","region":"Western Africa","continent":"Africa","capital":"Abuja","iso2":"NG","iso3":"NGA","globalCode":null},{"id":570,"name":"Niue","officialName":"Niue","region":"Polynesia","continent":"Oceania","capital":"Loyal","iso2":"NU","iso3":"NIU","globalCode":null},{"id":574,"name":"Norfolk Island","officialName":"Norfolk Island","region":"Australia and New Zealand","continent":"Oceania","capital":"Kingston","iso2":"NF","iso3":"NFK","globalCode":null},{"id":578,"name":"Norway","officialName":"Norway, Republic of","region":"Northern Europe","continent":"Europe","capital":"Oslo","iso2":"NO","iso3":"NOR","globalCode":null},{"id":580,"name":"Northern Mariana Islands","officialName":"Northern Mariana Islands","region":"Micronesia","continent":"Oceania","capital":"Saipan","iso2":"MP","iso3":"MNP","globalCode":null},{"id":583,"name":"Micronesia","officialName":"Micronesia, Federated States of","region":"Micronesia","continent":"Oceania","capital":"Palikir","iso2":"FM","iso3":"FSM","globalCode":null},{"id":584,"name":"Marshall Islands","officialName":"Marshall Islands, Republic of","region":"Micronesia","continent":"Oceania","capital":"Majuro","iso2":"MH","iso3":"MHL","globalCode":null},{"id":585,"name":"Palau","officialName":"Palau, Republic of","region":"Micronesia","continent":"Oceania","capital":"Ngerulmud","iso2":"PW","iso3":"PLW","globalCode":null},{"id":586,"name":"Pakistan","officialName":"Pakistan, Republic of","region":"Southern Asia","continent":"Asia","capital":"Islamabad","iso2":"PK","iso3":"PAK","globalCode":null},{"id":591,"name":"Panama","officialName":"Panama, Republic of","region":"Central America","continent":"Americas","capital":"Panama","iso2":"PA","iso3":"PAN","globalCode":null},{"id":598,"name":"Papua New Guinea","officialName":"Papua New Guinea, Republic of","region":"Melanesia","continent":"Oceania","capital":"Port Moresby","iso2":"PG","iso3":"PNG","globalCode":null},{"id":600,"name":"Paraguay","officialName":"Paraguay, Republic of","region":"South America","continent":"Americas","capital":"Asuncion","iso2":"PY","iso3":"PRY","globalCode":null},{"id":604,"name":"Peru","officialName":"Peru, Republic of","region":"South America","continent":"Americas","capital":"Lima","iso2":"PE","iso3":"PER","globalCode":null},{"id":608,"name":"Philippines","officialName":"Philippines, Republic of","region":"South-Eastern Asia","continent":"Asia","capital":"Manila","iso2":"PH","iso3":"PHL","globalCode":null},{"id":612,"name":"Pitcairn Islands","officialName":"Pitcairn Islands","region":"Polynesia","continent":"Oceania","capital":"Adamstown","iso2":"PN","iso3":"PCN","globalCode":null},{"id":616,"name":"Poland","officialName":"Poland, Republic of","region":"Eastern Europe","continent":"Europe","capital":"Warsaw","iso2":"PL","iso3":"POL","globalCode":null},{"id":620,"name":"Portugal","officialName":"Portugal, Republic of","region":"Southern Europe","continent":"Europe","capital":"Lisbon","iso2":"PT","iso3":"PRT","globalCode":null},{"id":624,"name":"Guinea-Bissau","officialName":"Guinea-Bissau, Republic of","region":"Western Africa","continent":"Africa","capital":"Bissau","iso2":"GW","iso3":"GNB","globalCode":null},{"id":626,"name":"Timor-Leste","officialName":"Timor-Leste, Republic of","region":"South-Eastern Asia","continent":"Asia","capital":"Dili","iso2":"TL","iso3":"TLS","globalCode":null},{"id":630,"name":"Puerto Rico","officialName":"Puerto Rico","region":"The Caribbean","continent":"Americas","capital":"San Juan","iso2":"PR","iso3":"PRI","globalCode":null},{"id":634,"name":"Qatar","officialName":"Qatar, Republic of","region":"Western Asia","continent":"Asia","capital":"Doha","iso2":"QA","iso3":"QAT","globalCode":null},{"id":638,"name":"Reunion","officialName":"Reunion","region":"Eastern Africa","continent":"Africa","capital":"Saint-Denis","iso2":"RE","iso3":"REU","globalCode":null},{"id":642,"name":"Romania","officialName":"Romania, Republic of","region":"Eastern Europe","continent":"Europe","capital":"Bucharest","iso2":"RO","iso3":"ROU","globalCode":null},{"id":643,"name":"Russian Federation","officialName":"Russian Federation","region":"Eastern Europe","continent":"Europe","capital":"Moscow","iso2":"RU","iso3":"RUS","globalCode":null},{"id":646,"name":"Rwanda","officialName":"Rwanda, Republic of","region":"Eastern Africa","continent":"Africa","capital":"Kigali","iso2":"RW","iso3":"RWA","globalCode":null},{"id":652,"name":"Saint-Barthélemy","officialName":"Saint-Barthélemy","region":"The Caribbean","continent":"Americas","capital":"Gustavia","iso2":null,"iso3":"BLM","globalCode":null},{"id":654,"name":"Saint Helena","officialName":"Saint Helena","region":"Western Africa","continent":"Africa","capital":"Jamestown","iso2":"SH","iso3":"SHN","globalCode":null},{"id":659,"name":"Saint Kitts and Nevis","officialName":"Saint Kitts and Nevis","region":"The Caribbean","continent":"Americas","capital":"Pasteur","iso2":"KN","iso3":"KNA","globalCode":null},{"id":660,"name":"Anguilla","officialName":"Anguilla","region":"The Caribbean","continent":"Americas","capital":"The Valley","iso2":"AI","iso3":"AIA","globalCode":null},{"id":662,"name":"Saint Lucia","officialName":"Saint Lucia","region":"The Caribbean","continent":"Americas","capital":"Castries","iso2":"LC","iso3":"LCA","globalCode":null},{"id":663,"name":"Saint Martin (French part)","officialName":"Saint Martin (French part)","region":"The Caribbean","continent":"Americas","capital":"Marigot","iso2":null,"iso3":"MAF","globalCode":null},{"id":666,"name":"Saint Pierre and Miquelon","officialName":"Saint Pierre and Miquelon","region":"Northern America","continent":"Americas","capital":"Saint-Pierre","iso2":"PM","iso3":"SPM","globalCode":null},{"id":670,"name":"Saint Vincent and the Grenadines","officialName":"Saint Vincent and the Grenadines","region":"The Caribbean","continent":"Americas","capital":"Kingstown","iso2":"VC","iso3":"VCT","globalCode":null},{"id":674,"name":"San Marino","officialName":"San Marino","region":"Southern Europe","continent":"Europe","capital":"San Marino","iso2":"SM","iso3":"SMR","globalCode":null},{"id":678,"name":"Sao Tome and Principe","officialName":"São Tomé and Príncipe, Democratic Republic of","region":"Middle Africa ","continent":"Africa","capital":"Sao Tome","iso2":"ST","iso3":"STP","globalCode":null},{"id":682,"name":"Saudi Arabia","officialName":"Saudi Arabia, Kingdom of","region":"Western Asia","continent":"Asia","capital":"Riyadh","iso2":"SA","iso3":"SAU","globalCode":null},{"id":686,"name":"Senegal","officialName":"Senegal","region":"Western Africa","continent":"Africa","capital":"Dakar","iso2":"SN","iso3":"SEN","globalCode":null},{"id":688,"name":"Serbia","officialName":"Serbia","region":"Southern Europe","continent":"Europe","capital":"Belgrade","iso2":"RS","iso3":"SRB","globalCode":null},{"id":690,"name":"Seychelles","officialName":"Seychelles, Republic of","region":"Eastern Africa","continent":"Africa","capital":"Victoria","iso2":"SC","iso3":"SYC","globalCode":null},{"id":694,"name":"Sierra Leone","officialName":"Sierra Leone","region":"Western Africa","continent":"Africa","capital":"Freetown","iso2":"SL","iso3":"SLE","globalCode":null},{"id":702,"name":"Singapore","officialName":"Singapore","region":"South-Eastern Asia","continent":"Asia","capital":"Singapore","iso2":"SG","iso3":"SGP","globalCode":null},{"id":703,"name":"Slovakia","officialName":"Slovakia","region":"Eastern Europe","continent":"Europe","capital":"Bratislava","iso2":"SK","iso3":"SVK","globalCode":null},{"id":704,"name":"Viet Nam","officialName":"Viet Nam, Republic of","region":"South-Eastern Asia","continent":"Asia","capital":"Hanoi","iso2":"VN","iso3":"VNM","globalCode":null},{"id":705,"name":"Slovenia","officialName":"Slovenia","region":"Southern Europe","continent":"Europe","capital":"Ljubljana","iso2":"SI","iso3":"SVN","globalCode":null},{"id":706,"name":"Somalia","officialName":"Somalia, Federal Republic of","region":"Eastern Africa","continent":"Africa","capital":"Mogadishu","iso2":"SO","iso3":"SOM","globalCode":null},{"id":710,"name":"South Africa","officialName":"South Africa","region":"Southern Africa","continent":"Africa","capital":"Pretoria","iso2":"ZA","iso3":"ZAF","globalCode":null},{"id":716,"name":"Zimbabwe","officialName":"Zimbabwe, Republic of","region":"Eastern Africa","continent":"Africa","capital":"Harare","iso2":"ZW","iso3":"ZWE","globalCode":null},{"id":724,"name":"Spain","officialName":"Spain, Republic of","region":"Southern Europe","continent":"Europe","capital":"Madrid","iso2":"ES","iso3":"ESP","globalCode":null},{"id":728,"name":"South Sudan","officialName":"South Sudan, Republic of","region":"Eastern Africa","continent":"Africa","capital":"Juba","iso2":"SS","iso3":"SSD","globalCode":null},{"id":736,"name":"Sudan","officialName":"Sudan, Republic of","region":"Northern Africa","continent":"Africa","capital":"Khartoum","iso2":"SD","iso3":"SDN","globalCode":null},{"id":740,"name":"Suriname","officialName":"Suriname, Republic of","region":"South America","continent":"Americas","capital":"Paramaribo","iso2":"SR","iso3":"SUR","globalCode":null},{"id":744,"name":"Svalbard and Jan Mayen Islands","officialName":"Svalbard and Jan Mayen Islands","region":"Northern Europe","continent":"Europe","capital":null,"iso2":"SJ","iso3":"SJM","globalCode":null},{"id":748,"name":"Swaziland","officialName":"Swaziland, Republic of","region":"Southern Africa","continent":"Africa","capital":"Mbabane","iso2":"SZ","iso3":"SWZ","globalCode":null},{"id":752,"name":"Sweden","officialName":"Sweden, Republic of","region":"Northern Europe","continent":"Europe","capital":"Stockholm","iso2":"SE","iso3":"SWE","globalCode":null},{"id":756,"name":"Switzerland","officialName":"Switzerland, Republic of","region":"Western Europe","continent":"Europe","capital":"Geneva","iso2":"CH","iso3":"CHE","globalCode":null},{"id":760,"name":"Syria","officialName":"Syria, Arab Republic","region":"Western Asia","continent":"Asia","capital":"Damascus","iso2":"SY","iso3":"SYR","globalCode":null},{"id":762,"name":"Tajikistan","officialName":"Tajikistan, Republic of","region":"Central Asia","continent":"Asia","capital":"Dushanbe","iso2":"TJ","iso3":"TJK","globalCode":null},{"id":764,"name":"Thailand","officialName":"Thailand, Republic of","region":"South-Eastern Asia","continent":"Asia","capital":"Bangkok","iso2":"TH","iso3":"THA","globalCode":null},{"id":768,"name":"Togo","officialName":"Togo, Republic of","region":"Western Africa","continent":"Africa","capital":"Lome","iso2":"TG","iso3":"TGO","globalCode":null},{"id":772,"name":"Tokelau","officialName":"Tokelau","region":"Polynesia","continent":"Oceania","capital":"Nukunonu ","iso2":"TK","iso3":"TKL","globalCode":null},{"id":776,"name":"Tonga","officialName":"Tonga, Kingdom of","region":"Polynesia","continent":"Oceania","capital":"Nuku'alofa","iso2":"TO","iso3":"TON","globalCode":null},{"id":780,"name":"Trinidad and Tobago","officialName":"Trinidad and Tobago","region":"The Caribbean","continent":"Americas","capital":"Port of Spain","iso2":"TT","iso3":"TTO","globalCode":null},{"id":784,"name":"UAE","officialName":"United Arab Emirates","region":"Western Asia","continent":"Asia","capital":"Abu Dhabi","iso2":null,"iso3":"ARE","globalCode":null},{"id":788,"name":"Tunisia","officialName":"Tunisia, Republic of","region":"Northern Africa","continent":"Africa","capital":"Tunisia","iso2":"TN","iso3":"TUN","globalCode":null},{"id":792,"name":"Turkey","officialName":"Turkey, Republic of","region":"Western Asia","continent":"Asia","capital":"Ankara","iso2":"TR","iso3":"TUR","globalCode":null},{"id":795,"name":"Turkmenistan","officialName":"Turkmenistan, Republic of","region":"Central Asia","continent":"Asia","capital":"ASHGABAT","iso2":"TM","iso3":"TKM","globalCode":null},{"id":796,"name":"Turks and Caicos Islands","officialName":"Turks and Caicos Islands","region":"The Caribbean","continent":"Americas","capital":"Cockburn Town","iso2":"TC","iso3":"TCA","globalCode":null},{"id":798,"name":"Tuvalu","officialName":"Tuvalu, Republic of","region":"Polynesia","continent":"Oceania","capital":"Funafuti","iso2":"TV","iso3":"TUV","globalCode":null},{"id":800,"name":"Uganda","officialName":"Uganda, Republic of","region":"Eastern Africa","continent":"Africa","capital":"Kampala","iso2":"UG","iso3":"UGA","globalCode":null},{"id":804,"name":"Ukraine","officialName":"Ukraine, Republic of","region":"Eastern Europe","continent":"Europe","capital":"Kiev","iso2":"UA","iso3":"UKR","globalCode":null},{"id":807,"name":"F.Y.R. Macedonia","officialName":"Macedonia, The former Yugoslav Republic of","region":"Southern Europe","continent":"Europe","capital":"Skopje","iso2":"MK","iso3":"MKD","globalCode":null},{"id":818,"name":"Egypt","officialName":"Egypt, Arab Republic of","region":"Northern Africa","continent":"Africa","capital":"Cairo","iso2":"EG","iso3":"EGY","globalCode":null},{"id":826,"name":"United Kingdom","officialName":"United Kingdom of Great Britain and Northern Ireland","region":"Northern Europe","continent":"Europe","capital":"London","iso2":"GB","iso3":"GBR","globalCode":null},{"id":830,"name":"Channel Islands","officialName":"Channel Islands","region":"Northern Europe","continent":"Europe","capital":null,"iso2":null,"iso3":null,"globalCode":null},{"id":831,"name":"Guernsey","officialName":"Guernsey, Bailiwick of","region":"Northern Europe","continent":"Europe","capital":"Saint Peter Port","iso2":null,"iso3":"GGY","globalCode":null},{"id":832,"name":"Jersey","officialName":"Jersey","region":"Northern Europe","continent":"Europe","capital":"St Hilaire","iso2":null,"iso3":"JEY","globalCode":null},{"id":833,"name":"Isle of Man","officialName":"Isle of Man","region":"Northern Europe","continent":"Europe","capital":"Douglas","iso2":null,"iso3":"IMN","globalCode":null},{"id":834,"name":"Tanzania","officialName":"Tanzania, United Republic of","region":"Eastern Africa","continent":"Africa","capital":"Dodoma","iso2":"TZ","iso3":"TZA","globalCode":null},{"id":840,"name":"United States of America","officialName":"United States of America","region":"Northern America","continent":"Americas","capital":"Washington","iso2":"US","iso3":"USA","globalCode":null},{"id":850,"name":"United States Virgin Islands","officialName":"United States Virgin Islands","region":"The Caribbean","continent":"Americas","capital":"Charlotte Amalie","iso2":"VI","iso3":"VIR","globalCode":null},{"id":854,"name":"Burkina Faso","officialName":"Burkina Faso, Republic of","region":"Western Africa","continent":"Africa","capital":"Ouagadougou","iso2":"BF","iso3":"BFA","globalCode":null},{"id":858,"name":"Uruguay","officialName":"Uruguay, Republic of","region":"South America","continent":"Americas","capital":"Montevideo","iso2":"UY","iso3":"URY","globalCode":null},{"id":860,"name":"Uzbekistan","officialName":"Uzbekistan, Republic of","region":"Central Asia","continent":"Asia","capital":"Tashkent","iso2":"UZ","iso3":"UZB","globalCode":null},{"id":862,"name":"Venezuela","officialName":"Venezuela, Bolivarian Republic of","region":"South America","continent":"Americas","capital":"Caracas","iso2":"VE","iso3":"VEN","globalCode":null},{"id":876,"name":"Wallis and Futuna Islands","officialName":"Wallis and Futuna Islands","region":"Polynesia","continent":"Oceania","capital":"Mata-Otto","iso2":"WF","iso3":"WLF","globalCode":null},{"id":882,"name":"Samoa","officialName":"Samoa","region":"Polynesia","continent":"Oceania","capital":"Appiah","iso2":"WS","iso3":"WSM","globalCode":null},{"id":887,"name":"Yemen","officialName":"Yemen, Republic of","region":"Western Asia","continent":"Asia","capital":"Sana'a","iso2":"YE","iso3":"YEM","globalCode":null},{"id":894,"name":"Zambia","officialName":"Zambia, Republic of","region":"Eastern Africa","continent":"Africa","capital":"Lusaka","iso2":"ZM","iso3":"ZMB","globalCode":null},{"id":902,"name":"Taiwan","officialName":"Taiwan, Republic of China","region":"Eastern Asia","continent":"Asia","capital":"Taipei","iso2":null,"iso3":"TWN","globalCode":null},{"id":999,"name":"Others","officialName":"Others","region":"Multi-country (Global)","continent":"Multi-region (Global)","capital":null,"iso2":null,"iso3":null,"globalCode":null},{"id":1000,"name":"UAE Group of Free Zones","officialName":"UAE Group of Free Zones","region":"Western Asia","continent":"Asia","capital":"Abu Dhabi","iso2":null,"iso3":null,"globalCode":null},{"id":1001,"name":"Kosovo","officialName":"Kosovo, Republic of","region":"Southern Europe","continent":"Europe","capital":"Pristina","iso2":"KV","iso3":"UNK","globalCode":null},{"id":1002,"name":"Kordstan","officialName":"Kordstan, Iraq","region":"Western Asia","continent":"Asia","capital":null,"iso2":null,"iso3":null,"globalCode":null},{"id":1004,"name":"West indies","officialName":"West indies","region":"The Caribbean","continent":"Americas","capital":null,"iso2":null,"iso3":null,"globalCode":null},{"id":1006,"name":"Tahiti","officialName":"Tahiti","region":"Polynesia","continent":"Oceania","capital":"Papeete","iso2":null,"iso3":null,"globalCode":null},{"id":1007,"name":"Tuamotu island","officialName":"Tuamotu island","region":"Polynesia","continent":"Oceania","capital":"Tuamotus","iso2":null,"iso3":null,"globalCode":null},{"id":1008,"name":"Chechnia","officialName":"Chechnia","region":"Western Asia","continent":"Asia","capital":"Grozny","iso2":null,"iso3":null,"globalCode":null},{"id":1009,"name":"Windward island","officialName":"Windward island","region":"Polynesia","continent":"Oceania","capital":null,"iso2":null,"iso3":null,"globalCode":null},{"id":1011,"name":"Pacific islands","officialName":null,"region":null,"continent":null,"capital":null,"iso2":null,"iso3":null,"globalCode":null},{"id":1012,"name":"Canton islands","officialName":"Canton islands","region":"Micronesia","continent":"Oceania","capital":null,"iso2":null,"iso3":null,"globalCode":null},{"id":1013,"name":"Gambier Island ","officialName":"Gambier Island ","region":"Northern America","continent":"Americas","capital":null,"iso2":null,"iso3":null,"globalCode":null},{"id":1014,"name":"Scotland","officialName":"Scotland","region":"Northern Europe","continent":"Europe","capital":"Edinburgh","iso2":null,"iso3":null,"globalCode":null},{"id":1020,"name":"Sint Maarten (Dutch part)","officialName":"Sint Maarten (Dutch part)","region":"The Caribbean","continent":"Americas","capital":"Philipsburg","iso2":null,"iso3":"SMX","globalCode":null},{"id":1021,"name":"Sark","officialName":"Sark","region":"Northern Europe","continent":"Europe","capital":null,"iso2":null,"iso3":"SRK","globalCode":null},{"id":1022,"name":"Antarctica","officialName":"Antarctica","region":"Antarctica","continent":"Antarctica","capital":null,"iso2":null,"iso3":null,"globalCode":null},{"id":1023,"name":"Canary Islands","officialName":"Canary Islands","region":"Western Africa","continent":"Africa","capital":null,"iso2":null,"iso3":null,"globalCode":null},{"id":1024,"name":"Madeira Island","officialName":"Madeira Island","region":"Western Africa","continent":"Africa","capital":null,"iso2":null,"iso3":null,"globalCode":null},{"id":1025,"name":"Marquesas Island","officialName":"Marquesas Island","region":"Melanesia","continent":"Oceania","capital":null,"iso2":null,"iso3":null,"globalCode":null},{"id":1026,"name":"Dagestan","officialName":"Dagestan","region":"Western Asia","continent":"Asia","capital":"Makhachkala","iso2":null,"iso3":null,"globalCode":null},{"id":1027,"name":"Azores","officialName":"Azores","region":"Western Africa","continent":"Africa","capital":null,"iso2":null,"iso3":null,"globalCode":null},{"id":1028,"name":"Leeward Islands","officialName":"Leeward Islands","region":"The Caribbean","continent":"Americas","capital":null,"iso2":null,"iso3":null,"globalCode":null},{"id":1029,"name":"Yugoslavia","officialName":"Yugoslavia","region":"Southern Europe","continent":"Europe","capital":null,"iso2":null,"iso3":null,"globalCode":null},{"id":1030,"name":"Virgin Islands","officialName":"Virgin Islands","region":"The Caribbean","continent":"Americas","capital":null,"iso2":null,"iso3":null,"globalCode":null},{"id":1031,"name":"Western Sahara","officialName":"Western Sahara","region":"Western Africa","continent":"Africa","capital":null,"iso2":null,"iso3":null,"globalCode":null},{"id":1032,"name":"Bermuda","officialName":"Bermuda","region":"The Caribbean","continent":"Americas","capital":"الكاريبي","iso2":null,"iso3":null,"globalCode":null},{"id":1124,"name":"Multi-country (Africa)","officialName":"Multi-country (Africa)","region":"Multi-region (Africa)","continent":"Africa","capital":null,"iso2":null,"iso3":"_AF","globalCode":null},{"id":1125,"name":"Multi-country (Americas)","officialName":"Multi-country (Americas)","region":"Multi-region (Americas)","continent":"Americas","capital":null,"iso2":null,"iso3":"_AM","globalCode":null},{"id":1126,"name":"Multi-country (Asia)","officialName":"Multi-country (Asia)","region":"Multi-region (Asia)","continent":"Asia","capital":null,"iso2":null,"iso3":"_AS","globalCode":null},{"id":1127,"name":"Multi-country (Europe)","officialName":"Multi-country (Europe)","region":"Multi-region (Europe)","continent":"Europe","capital":null,"iso2":null,"iso3":"_EU","globalCode":null},{"id":1128,"name":"Multi-country (Global)","officialName":"Multi-country (Global)","region":"Multi-region (Global)","continent":"Global","capital":null,"iso2":null,"iso3":"_GL","globalCode":null},{"id":1129,"name":"Multi-country (Oceania)","officialName":"Multi-country (Oceania)","region":"Multi-region (Oceania)","continent":"Oceania","capital":null,"iso2":null,"iso3":"_OC","globalCode":null},{"id":1130,"name":"TEMPDATA","officialName":null,"region":null,"continent":null,"capital":null,"iso2":null,"iso3":null,"globalCode":null}]};
}

function getCountryFromList(cid){
	var res = null;
	countryList.data.forEach(function(el) {
			if(el.id == cid){
				res = el;
			}
	});

	return res;
}

function getCountryFromListISO2(ciso2){
	var res = null;
	countryList.data.forEach(function(el) {
			if(el.iso2 == ciso2){
				res = el;
			}
	});
	
	return res;
}

function setActiveCountry(id, fromMap){
	var res = getCountryFromList(id);
	if(res != null) {
		curCountry = res;
		$('#country_select #active_value').html(curCountry.name + " <span class=\"caret\"></span>");
	}
	
	countrySelectedFromMap = fromMap;
}

function updateMap(){
	if(!countrySelectedFromMap ) {

		countryMap.clearSelectedRegions()
		countryMap.setSelectedRegions(curCountry.iso2);
		$('#vector_world_map').vectorMap('set', 'focus',curCountry.iso2);
	}
	
	countrySelectedFromMap = true;
	
}

function updateGeneralInformation(){
	var info = getGeneralInformation("EN", 4);
	if(info.status == 0){
		var giWrapper  = $('#generalInfo table');
		giWrapper.html('');
		info.data.forEach(function(el) {
			var giEl = $('<tr><td>'+el.name+'</td><td>'+(isNaN(el.value)?el.value:Math.round((parseFloat(el.value))*10)/10)+'</td></tr>');
			giWrapper.append(giEl);
		});
	}
}

function getGeneralInformation(lang, countryId){
	return {"language":"EN","status":0,"type":0,"data":[{"id":3798,"countryId":4,"weight":1,"name":"Capital","value":"Kabul"},{"id":3797,"countryId":4,"weight":2,"name":"Area, Thousand Square Kilometre","value":"652.86"},{"id":3796,"countryId":4,"weight":3,"name":"Population, in Millions","value":"32.526562"},{"id":3795,"countryId":4,"weight":4,"name":"Annual Population Growth, %, 2015","value":"2.80298628268961"},{"id":3794,"countryId":4,"weight":5,"name":"The GDP, US$ billions, 2015","value":"19.3312865493323"},{"id":3793,"countryId":4,"weight":6,"name":"Annual GDP growth, %, 2015","value":"0.84071852799228"},{"id":3792,"countryId":4,"weight":7,"name":"Industry, Value Added (% of GDP), 2015","value":"23.2832848827386"},{"id":3791,"countryId":4,"weight":8,"name":"Services, etc., value added (% of GDP), 2015","value":"55.0012985505161"},{"id":3790,"countryId":4,"weight":9,"name":"Agriculture, value added (% of GDP),2015","value":"21.715416575352"},{"id":3789,"countryId":4,"weight":10,"name":"Imports of goods and services (BoP), US$ billions, 2015","value":"8.56783660302452"},{"id":3788,"countryId":4,"weight":11,"name":"Exports of Goods and Services, US$ billions, 2015","value":"1.38210989148521"},{"id":3787,"countryId":4,"weight":12,"name":"Goods Imports (BoP), US$ billions, 2015","value":"7.02014105539825"},{"id":3786,"countryId":4,"weight":13,"name":"Food imports (% of merchandise imports), 2015","value":"19.2271235944006"},{"id":3785,"countryId":4,"weight":14,"name":"Goods Exports (BoP), US$ billions, 2015","value":"0.585016129772758"},{"id":3784,"countryId":4,"weight":15,"name":"Food exports (% of merchandise exports), 2015","value":"48.4561085378175"},{"id":3783,"countryId":4,"weight":16,"name":"Inflation, Consumer Prices (annual %), 2015","value":"-1.53384658328173"},{"id":3782,"countryId":4,"weight":21,"name":"The Inflows FDI, US$ billions, 2015","value":"0.058"},{"id":3781,"countryId":4,"weight":22,"name":"The Outflows FDI, US$ billions, 2015","value":"-"},{"id":3780,"countryId":4,"weight":23,"name":"The FDI Inward Stock, US$ billions, 2015","value":"1.749705163"},{"id":3779,"countryId":4,"weight":24,"name":"The FDI Outward Stock, US$ billions, 2015","value":"-"}]};
}

