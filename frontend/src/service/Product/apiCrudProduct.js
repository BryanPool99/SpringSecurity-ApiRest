const BASE_URL = "http://localhost:8081/admin/product";


export const apiCrudProducts = {
  addProducto: async (newProduct,token) => {
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("file", newProduct.image, newProduct.image.name);
  
      const response = await fetch(`${BASE_URL}/save`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      console.log('Add Product Response:', response);
  
      if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const createdProduct = await response.json();
      console.log('Created Product:', createdProduct);
  
      return createdProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  updateProduct: async (productId, updatedProduct,token) => {
    try {
      const formData = new FormData();
      
      // Verifica si hay un archivo seleccionado antes de adjuntarlo
      if (updatedProduct.image instanceof File) {
        formData.append("file", updatedProduct.image, updatedProduct.image.name);
      }
      
      formData.append("name", updatedProduct.name);
  
      const response = await fetch(`${BASE_URL}/edit/${productId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const updatedProductData = await response.json();
      return updatedProductData;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  deleteProduct: async (productId,token) => {
    try {
      const response = await fetch(`${BASE_URL}/delete/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      return response.text(); // Devuelve el texto de la respuesta
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },
};
export default apiCrudProducts;
