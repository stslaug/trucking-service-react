import fetch from 'node-fetch';

// eBay API URLs and credentials
const EBAY_API_BASE_URL = 'https://api.ebay.com';
const EBAY_TAXONOMY_API_URL = `${EBAY_API_BASE_URL}/commerce/taxonomy/v1`;
const EBAY_API_OAUTH_URL = `${EBAY_API_BASE_URL}/identity/v1/oauth2/token`;

// Environment variables for eBay credentials
const EBAY_CLIENT_ID = process.env.EBAY_CLIENT_ID;
const EBAY_CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;

// Function to fetch OAuth token from eBay
async function fetchOAuthToken() {
  const auth = Buffer.from(`${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`).toString('base64');
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('scope', 'https://api.ebay.com/oauth/api_scope/commerce.taxonomy.readonly');

  const response = await fetch(EBAY_API_OAUTH_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (response.ok) {
    return data.access_token;
  } else {
    console.error('OAuth token fetch error:', data);
    throw new Error(`Failed to fetch OAuth token: ${data.error_description || data.error}`);
  }
}

// Function to get the default category tree ID
async function getDefaultCategoryTreeId(EBAY_ACCESS_TOKEN) {
  const url = `${EBAY_TAXONOMY_API_URL}/get_default_category_tree_id?marketplace_id=EBAY_US`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${EBAY_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (response.ok) {
    return data.categoryTreeId;
  } else {
    console.error('Error fetching default category tree ID:', data);
    throw new Error(`Failed to get default category tree ID: ${data.errors[0].message}`);
  }
}

// Function to fetch categories from eBay Taxonomy API
async function fetchCategories() {
  const EBAY_ACCESS_TOKEN = await fetchOAuthToken();
  const categoryTreeId = await getDefaultCategoryTreeId(EBAY_ACCESS_TOKEN);

  const url = `${EBAY_TAXONOMY_API_URL}/category_tree/${categoryTreeId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${EBAY_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (response.ok) {
    // Extract top-level categories
    const categories = data.rootCategoryNode.childCategoryTreeNodes.map((node) => ({
      id: node.category.categoryId,
      name: node.category.categoryName,
    }));
    return categories;
  } else {
    console.error('Error fetching categories:', data);
    throw new Error(`Failed to fetch categories: ${data.errors[0].message}`);
  }
}

// Lambda handler function
export const handler = async (event) => {
  try {
    const categories = await fetchCategories();
    return {
      statusCode: 200,
      body: JSON.stringify(categories),
    };
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch categories', details: error.message }),
    };
  }
};
