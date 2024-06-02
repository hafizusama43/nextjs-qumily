export const TEMPLATE_CATEGORY = {
    "sponsored_products_campaigns": "Sponsored Products Campaigns",
    "sponsored_display_campaigns": "Sponsored Display Campaigns",
    "sponsored_brands_campaigns": "Sponsored Brands Campaigns",
}

// Helper function to capitalize the first letter of the string
export const capitalizeFirstLetter = (string) => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
};