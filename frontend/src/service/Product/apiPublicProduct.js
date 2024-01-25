// apiPublicProduct.js

const BASE_URL = "http://localhost:8081/public";

export const apiPublicProduct = {
  getProducts: async () => {
    try {
      const response = await fetch(`${BASE_URL}/product`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
  getProductById: async (productId) => {
    try {
      const response = await fetch(`${BASE_URL}/product/${productId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const productData = await response.json();
      return productData;
    } catch (error) {
      console.error(`Error fetching product with ID ${productId}:`, error);
      throw error;
    }
  },
};

export default apiPublicProduct;
