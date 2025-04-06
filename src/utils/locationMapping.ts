
export interface CityToRegionMapping {
  city: string;
  region: string;
}

// Regions as defined by the user
export const regions = [
  'צפון',
  'דרום',
  'מרכז',
  'שומרון',
  'ירושלים והסביבה',
  'אילת',
  'שפלה',
  'השרון'
];

// Mapping of cities to their respective regions
export const cityToRegionMap: Record<string, string> = {
  // צפון - North
  'חיפה': 'צפון',
  'נהריה': 'צפון',
  'עכו': 'צפון',
  'כרמיאל': 'צפון',
  'טבריה': 'צפון',
  'צפת': 'צפון',
  'קריית שמונה': 'צפון',
  'עפולה': 'צפון',
  'נצרת': 'צפון',
  'בית שאן': 'צפון',
  
  // דרום - South
  'באר שבע': 'דרום',
  'אשדוד': 'דרום',
  'אשקלון': 'דרום',
  'דימונה': 'דרום',
  'שדרות': 'דרום',
  'נתיבות': 'דרום',
  'אופקים': 'דרום',
  'ערד': 'דרום',
  'ירוחם': 'דרום',
  'מצפה רמון': 'דרום',
  
  // מרכז - Center
  'תל אביב': 'מרכז',
  'רמת גן': 'מרכז',
  'גבעתיים': 'מרכז',
  'בני ברק': 'מרכז',
  'חולון': 'מרכז',
  'בת ים': 'מרכז',
  'פתח תקווה': 'מרכז',
  'ראשון לציון': 'מרכז',
  'לוד': 'מרכז',
  'רמלה': 'מרכז',
  
  // שומרון - Samaria
  'אריאל': 'שומרון',
  'קדומים': 'שומרון',
  'אלקנה': 'שומרון',
  'קרני שומרון': 'שומרון',
  'עמנואל': 'שומרון',
  'ברקן': 'שומרון',
  
  // ירושלים והסביבה - Jerusalem and surroundings
  'ירושלים': 'ירושלים והסביבה',
  'מעלה אדומים': 'ירושלים והסביבה',
  'גבעת זאב': 'ירושלים והסביבה',
  'בית שמש': 'ירושלים והסביבה',
  'מבשרת ציון': 'ירושלים והסביבה',
  
  // אילת - Eilat
  'אילת': 'אילת',
  
  // שפלה - Shfela
  'רחובות': 'שפלה',
  'נס ציונה': 'שפלה',
  'יבנה': 'שפלה',
  'גדרה': 'שפלה',
  'קרית גת': 'שפלה',
  'קרית מלאכי': 'שפלה',
  
  // השרון - HaSharon
  'הרצליה': 'השרון',
  'רעננה': 'השרון',
  'כפר סבא': 'השרון',
  'רמת השרון': 'השרון',
  'הוד השרון': 'השרון',
  'נתניה': 'השרון'
};

// Function to get region by city
export function getRegionByCity(city: string): string | undefined {
  return cityToRegionMap[city];
}

// Function to get all cities in a region
export function getCitiesByRegion(region: string): string[] {
  return Object.entries(cityToRegionMap)
    .filter(([_, cityRegion]) => cityRegion === region)
    .map(([city, _]) => city);
}

// Get all available cities
export function getAllCities(): string[] {
  return Object.keys(cityToRegionMap).sort();
}

// Get all available regions
export function getAllRegions(): string[] {
  return regions;
}
