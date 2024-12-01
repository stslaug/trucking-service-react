import axios from 'axios';

export const handler = async (event) => {
    const clientId = process.env.EBAY_CLIENT_ID;
    const clientSecret = process.env.EBAY_CLIENT_SECRET;
    const tokenEndpoint = 'https://api.ebay.com/identity/v1/oauth2/token';

    try {
        // Step 1: Get OAuth token
        const authToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const tokenResponse = await axios.post(tokenEndpoint, 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${authToken}`,
            },
        });
        
        const accessToken = tokenResponse.data.access_token;

        // Check if request is for categories or items based on a parameter (e.g., "type")
        const requestType = event.queryStringParameters?.type || 'items';

        if (requestType === 'categories') {
            // Handle categories request
            const categoryEndpoint = 'https://api.ebay.com/commerce/taxonomy/v1/get_default_category_tree_id';
            const categoryResponse = await axios.get(categoryEndpoint, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const categories = categoryResponse.data.categoryTreeNodes.map((node) => ({
                id: node.category.categoryId,
                name: node.category.categoryName,
            }));

            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify(categories),
            };
        } else {
            // Handle item search request
            const searchTerm = event.queryStringParameters?.q || '';
            const page = parseInt(event.queryStringParameters?.page) || 1;
            const limit = parseInt(event.queryStringParameters?.limit) || 20;
            const offset = (page - 1) * limit;
            const categoryId = event.queryStringParameters?.categoryId || '';

            // Construct eBay API endpoint with category and search term
            let eBayEP = `https://api.ebay.com/buy/browse/v1/item_summary/search?limit=${limit}&offset=${offset}`;
            if (searchTerm) {
                eBayEP += `&q=${encodeURIComponent(searchTerm)}`;
            }
            if (categoryId) {
                eBayEP += `&category_ids=${categoryId}`;
            }

            // Step 3: Make GET request to eBay Browse API
            const response = await axios.get(eBayEP, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`, 
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            });

            // Map item summaries if available
            const items = response.data.itemSummaries?.map((item) => ({
                itemId: item.itemId,
                title: item.title,
                price: item.price,
                condition: item.condition,
                image: { imageUrl: item.image?.imageUrl || '' },
                itemWebUrl: item.itemWebUrl,
                categoryPath: item.categoryPath,
                seller: {
                    username: item.seller.username,
                    feedbackPercentage: item.seller.feedbackPercentage,
                    feedbackScore: item.seller.feedbackScore,
                },
                location: item.location,
                shippingOptions: item.shippingOptions || [],
            })) || [];

            // Return results with CORS headers
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify(items),
            };
        }

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);

        return {
            statusCode: error.response?.status || 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ message: 'Failed to fetch data', error: error.message }),
        };
    }
};
