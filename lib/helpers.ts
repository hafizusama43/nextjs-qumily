export const TEMPLATE_CATEGORY = {
    "sponsored-products-campaigns": "Sponsored Products Campaigns",
    "sponsored-display-campaigns": "Sponsored Display Campaigns",
    "sponsored-brands-campaigns": "Sponsored Brands Campaigns",
}

export const TARGETING_TYPE = {
    "Manual": "Manual",
    "Auto": "Auto",
}

export const TARGETING_EXPRESSION_TYPE = {
    "Enabled": "Enabled",
    "Paused": "Paused",
}

export const CAMPAIGN_STATE = {
    "Enabled": "Enabled",
    "Disabled": "Disabled",
}

export const MATCH_TYPE = {
    "Negative exact": "Negative exact",
    "Negative phrase": "Negative phrase",
}

export const MATCH_TYPE_KEYWORD_TARGETING = {
    "exact": "Exact",
    "broad": "Broad",
    "phrase": "phrase",
}

export const BIDDING_STRATEGY = {
    "Fixed bid": "Fixed bid",
    "Dynamic bids - down only": "Dynamic bids - down only",
    "Dynamic bids - up and down": " Dynamic bids - up and down"
}

export const TARGETING_STRATEGY = {
    "keyword": "Keyword targeting",
    "product": "Product targeting",
}

export const PRODUCT_TARGETING_CATEGORY = {
    "individual": "Individual products",
    "categories": "Categories",
}

export const PLACEMENT = {
    "Placement Product Page": "Placement Product Page",
    "Placement Top": "Placement Top",
}

export const SPONSORED_PRODUCTS_CAMPAIGNS = {
    product: 'Product',
    entity: 'Entity',
    operation: 'Operation',
    campaign_id: 'Campaign Id',
    ad_group_id: 'Ad Group Id',
    portfolio_id: 'Portfolio Id',
    ad_id: 'Ad Id',
    keyword_id: 'Keyword Id',
    product_targeting_id: 'Product Targeting Id',
    campaign_name: 'Campaign Name',
    ad_group_name: 'Ad Group Name',
    start_date: 'Start Date',
    end_date: 'End Date',
    targeting_type: 'Targeting Type',
    state: 'State',
    daily_budget: 'Daily Budget',
    sku: 'SKU',
    ad_group_default_bid: 'Ad Group Default Bid',
    bid: 'Bid',
    keyword_text: 'Keyword Text',
    match_type: 'Match Type',
    bidding_strategy: 'Bidding Strategy',
    placement: 'Placement',
    percentage: 'Percentage',
    product_targeting_expression: 'Product Targeting Expression'
};

const STEPS_DEFAULT = {
    1: "Campaign (Required)",
    2: "Bidding Adjustment (Optional)",
    3: "Ad Group (Required)",
    4: "Product Ad (Required)",
};

const STEPS_CAMPAIGN_AUTO = {
    1: "Campaign (Required)",
    2: "Bidding Adjustment (Optional)",
    3: "Ad Group (Required)",
    4: "Product Ad (Required)",
    5: "Product targeting (Required)",
    6: "Campaign negative keyword (Optional)",
    7: "Negative keyword (Optional)",
    8: "Negative product targeting (Optional)",
}

export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];


const STEPS_CAMPAIGN_MANUAL = {
    1: "Campaign (Required)",
    2: "Bidding Adjustment (Optional)",
    3: "Ad Group (Required)",
    4: "Product Ad (Required)",
    5: "Campaign negative keyword (Optional)",
}

export const SPC_HELP_TEXT = {
    'campaign_id': "For new campaigns, you should type a text-based name to identify your campaign. You will enter this exact Campaign ID for each entity you create underneath this parent campaign. NOTE: When you upload your bulksheets file, the Campaign ID will become the actual unique identifier associated with the campaign and all of its \"child\" entities. So if you want to update this campaign later, you would enter the actual Campaign ID into this field.",
    'campaign_name': "Enter the same campaign name that you entered in the \"Campaign ID\" column.",
    'start_date': " You can start on today's date or a future date, but the date cannot be in the past. So if you set the date for today, be sure you create and upload the file on today's date. If you leave this field blank, the start date will be set for today's date",
    'end_date': "You can leave this field blank if you don't want to set an end date. Otherwise, the format must be yyyyMMdd.",
    'state': "Options are enabled or paused. Enter enabled to create a new campaign.",
    "budget": "Do not include symbols such as dollar signs. For example, a daily budget of $100 would be written as 100. If the figure isn't a whole number, use a decimal point and not a comma",
    "bidding_strategy": "Similar to what you'd see in the UI, you can choose a bidding strategy: Enter Dynamic bids - down only, Dynamic bids - up and down, or Fixed bid.",
    "placement": "Enter either placement top or placement product page or placement rest of search(BETA). These values are not case sensitive.",
    "percentage": "Enter a figure using digits only, up to a maximum of 900. For example, a 35% increase should be entered as 35. This will define the percentage increase applied to your base bid, up to 900% max.",
    "ad_group_id": "For new ad groups, you should type a text-based name to identify the ad group. You will also type this exact same name into the “Entity Name” column for this row.NOTE: When you upload your bulksheets file, the Ad Group ID will become the actual unique identifier associated with this ad group.",
    "ad_group_name": "Enter the same name that you entered in the \"Ad Group ID\" column",
    "sku": "For sellers, you should enter the product sku. For vendors, leave the sku field blank",
    "ad_group_default_bid": "Enter an exact figure with no money symbols, and use a decimal point (not a comma). For example, if you want to set this to 75 cents, enter 0.75 NOTE: This default bid amount will apply to all child entities of this ad group if you don't define bids for the child entities explicitly. For instance, if a keyword child entity doesn't include a defined bid, this default amount would apply.",
    "asin": "For vendors, you should enter the product asin. For sellers, leave the asin field blank.NOTE: You can see asin eligibility statuses, along with reasons for ineligibility, when you download a Sponsored Products bulksheets file. This information is available in two informational-only columns: Eligibility Status and Reason for Ineligibility.",
    "pt_state": "Enter enabled to create and bid on the product target. Enter paused if you don't want to bid on the product target.",
    "pt_bid": "Enter a value if you want to bid on the product targeting entity. Otherwise, the ad group default bid will apply. If you are setting the \"State\" to be paused, you can leave this field blank.",
    "pt_expression": "Enter a value—you'll need one row for each: close-match, loose-match, substitutes, complements"
}


// Function to get the appropriate steps object based on a condition
export const GET_SP_STEPS = (condition: string, targeting: string) => {
    if (condition.toLocaleLowerCase() === 'auto') {
        return STEPS_CAMPAIGN_AUTO;
    } else if (condition.toLocaleLowerCase() === 'manual') {
        console.log(targeting)
        // Build the steps dynamically for manual campaigns
        var stepsManual = {}
        if (targeting === 'keyword') {
            stepsManual = {
                ...STEPS_CAMPAIGN_MANUAL,
                6: "Negative keyword (Optional)",
                7: "Keyword (Required)"
            };
        } else {
            stepsManual = {
                ...STEPS_CAMPAIGN_MANUAL,
                6: "Product targeting (Required)",
                7: "Negative product targeting (Optional)"
            };
        }
        return stepsManual;
    } else {
        return STEPS_DEFAULT; // Default steps object if condition is neither 'auto' nor 'manual'
    }
};

export const GET_SB_STEPS = (targeting: string) => {
    console.log(targeting)
    // Build the steps dynamically for manual campaigns
    var stepsManual = {}
    if (targeting === 'keyword') {
        stepsManual = {
            ...STEPS_CAMPAIGN_MANUAL,
            6: "Negative keyword (Optional)",
            7: "Keyword (Required)"
        };
    } else {
        stepsManual = {
            ...STEPS_CAMPAIGN_MANUAL,
            6: "Product targeting (Required)",
            7: "Negative product targeting (Optional)"
        };
    }
    return stepsManual;
};


// Helper function to capitalize the first letter of the string
export const capitalizeFirstLetter = (string) => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Function to fetch specific key values from an object
export const getSpecificKeyValues = (obj, keys) => {
    const result = {};
    keys.forEach(key => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
};

export const getStepName = (str: string) => {
    var stepStr = str.replace(/\(.*?\)/g, '').trim();
    stepStr = stepStr.trim()
    return stepStr
}

export const formatDateToYYYYMMDD = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
}