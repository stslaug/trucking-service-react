import axios from 'axios';

export const handler = async (event) => {
    const clientId = process.env.EBAY_CLIENT_ID;
    const clientSecret = process.env.EBAY_CLIENT_SECRET;
    const tokenEndpoint = 'https://api.ebay.com/identity/v1/oauth2/token';

    try {
        // Step 1: Get OAuth token
        const authToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const tokenResponse = await axios.post(
            tokenEndpoint,
            'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${authToken}`,
                },
            }
        );

        const accessToken = tokenResponse.data.access_token;

        // Step 2: Check for itemId in query parameters
        const itemId = event.queryStringParameters?.itemId;
        if (!itemId) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS, GET',
                },
                body: JSON.stringify({ message: "Missing required parameter: itemId" }),
            };
        }

        // Step 3: Fetch item details using the correct eBay API endpoint
        const itemDetailsEndpoint = `https://api.ebay.com/buy/browse/v1/item/get_item?item_id=${itemId}`;
        const itemResponse = await axios.get(itemDetailsEndpoint, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            timeout: 15000,  // Increased timeout to handle potential latency
        });

        // Map the response data to match the component's structure
        const item = {
            itemId: itemResponse.data.itemId,
            title: itemResponse.data.title || "No title available",
            price: itemResponse.data.price || { value: "N/A" },
            condition: itemResponse.data.condition || "Unknown",
            description: itemResponse.data.description || "No description available",
            image: { imageUrl: itemResponse.data.image?.imageUrl || 'placeholder.jpg' },
            seller: {
                username: itemResponse.data.seller?.username || 'Unknown',
                feedbackPercentage: itemResponse.data.seller?.feedbackPercentage || 'N/A',
            },
            location: itemResponse.data.location || "Location not available",
            shippingOptions: itemResponse.data.shippingOptions || [],
        };

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, GET',
            },
            body: JSON.stringify(item),
        };

    } catch (error) {
        console.error('Error fetching item details:', {
            message: error.message,
            responseData: error.response?.data,
            status: error.response?.status,
            config: error.config,
        });

        return {
            statusCode: error.response?.status || 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, GET',
            },
            body: JSON.stringify({
                message: 'Failed to fetch item details',
                error: error.message,
                details: error.response?.data || null,
            }),
        };
    }
};