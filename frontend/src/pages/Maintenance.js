import React, { useEffect, useState, useRef } from "react";
import { Header } from "../components/Header";
import apiPublicProduct from "../service/Product/apiPublicProduct";
import apiCrudProducts from "../service/Product/apiCrudProduct";
import Swal from "sweetalert2"; // Importa SweetAlert2
import authApi from "../service/apiAuth";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

export const MaintenancePage = () => {
  const [products, setProducts] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    name: "", // Agrega un valor por defecto para evitar problemas con undefined
    image: null,
  });
  const hasMounted = useRef(false);
  const toggleAddModal = () => {
    setSelectedProduct({}); // Limpia el selectedProduct al cerrar el modal de agregar
    setAddModal(!addModal);
  };
  const toggleEditModal = () => {
    setEditModal(!editModal);
  };

  const fetchProducts = async () => {
    try {
      const productsData = await apiPublicProduct.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (!hasMounted.current) {
      console.log("Inside useEffect - fetching products...");
      fetchProducts();
      hasMounted.current = true;
    }
  }, []);
  const token = authApi.getToken();
  const handleEdit = async (productId) => {
    try {
      const productData = await apiPublicProduct.getProductById(productId);
      console.log("Edit product data:", productData);

      setSelectedProduct({
        id: productData.id,
        name: productData.name,
        // image ahora es la URL de la imagen
        image: productData.imageUrl,
      });

      toggleEditModal();
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };
  const handleDeleteProduct = async (productId) => {
    try {
      // Muestra una alerta de confirmación antes de eliminar el producto
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You are about to delete this product. This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      // Si el usuario confirma la eliminación, procede con la eliminación
      if (result.isConfirmed) {
        const deletedProductMessage = await apiCrudProducts.deleteProduct(
          productId,
          token
        );
        console.log("Server response:", deletedProductMessage);
        fetchProducts();

        // Muestra una alerta de éxito después de eliminar el producto
        Swal.fire({
          icon: "success",
          title: "Product Deleted",
          text: "The product has been successfully deleted.",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);

      // Muestra una alerta de error en caso de problemas con la eliminación
      Swal.fire({
        icon: "error",
        title: "Error Deleting Product",
        text: "An error occurred while deleting the product.",
      });
    }
  };

  const handleSaveProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", selectedProduct.name);

      // Si hay una imagen seleccionada, y es una URL, simplemente mantenla como URL
      if (selectedProduct.image && typeof selectedProduct.image === "string") {
        console.log("Selected image is a URL:", selectedProduct.image);
        formData.append("file", selectedProduct.image);
      } else if (selectedProduct.image instanceof File) {
        console.log("Selected image is a File:", selectedProduct.image);
        // Si es un archivo, adjunta el nuevo archivo
        formData.append(
          "file",
          selectedProduct.image,
          selectedProduct.image.name
        );
      }

      // Verifica si el nombre está presente
      if (!selectedProduct.name) {
        // Muestra SweetAlert para indicar que el nombre es un campo obligatorio
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Name is a required field.",
        });
        return; // Sale de la función si falta el nombre
      }

      // Verifica si la imagen está presente
      if (!formData.get("file")) {
        // Muestra SweetAlert para indicar que la imagen es un campo obligatorio
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Image is a required field.",
        });
        return; // Sale de la función si falta la imagen
      }

      console.log("Form Data before sending:", formData);

      if (!selectedProduct.id) {
        await apiCrudProducts.addProducto(
          {
            name: selectedProduct.name,
            image: formData.get("file"),
          },
          token
        );
        Swal.fire({
          icon: "success",
          title: "Product Added Successfully!",
          text: "Your product has been added successfully.",
        });
      } else {
        await apiCrudProducts.updateProduct(
          selectedProduct.id,
          {
            name: selectedProduct.name,
            image: formData.get("file"),
          },
          token
        );
        // Muestra el SweetAlert para éxito
        Swal.fire({
          icon: "success",
          title: "Product Updated Successfully!",
          text: "Your product has been updated successfully.",
        });
      }

      fetchProducts();
      selectedProduct.id ? toggleEditModal() : toggleAddModal();
    } catch (error) {
      // Muestra el SweetAlert para error
      Swal.fire({
        icon: "error",
        title: "Error Saving Product",
        text: "An error occurred while saving the product.",
      });
    }
  };

  return (
    <div>
      <Header />
      <Button color="success" onClick={toggleAddModal}>
        Add Product
      </Button>
      <Table size="sm" hover responsive striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Product ID</th>
            <th>Name Product</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>
                {product.imageUrl && (
                  <img
                    src={`http://localhost:8081${product.imageUrl}`}
                    alt={product.name}
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                )}
              </td>
              <td>
                <Button color="info" onClick={() => handleEdit(product.id)}>
                  Edit
                </Button>
                <Button
                  color="danger"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal isOpen={addModal} toggle={toggleAddModal}>
        <ModalHeader toggle={toggleAddModal}>Add Product</ModalHeader>
        <ModalBody>
          <Form encType="multipart/form-data">
            <FormGroup>
              <Label htmlFor="name">Product Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={selectedProduct.name || ""}
                onChange={(e) => {
                  setSelectedProduct((prevProduct) => ({
                    ...prevProduct,
                    name: e.target.value,
                  }));
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="image">Product Image</Label>
              <Input
                type="file"
                name="file"
                id="image"
                accept=".png, .jpg, .jpeg"
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    image: e.target.files[0],
                  })
                }
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSaveProduct}>
            Save
          </Button>
          <Button color="secondary" onClick={toggleAddModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal para editar productos */}
      <Modal isOpen={editModal} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>
          {selectedProduct && selectedProduct.id
            ? `Edit Product (ID: ${selectedProduct.id})`
            : ""}
        </ModalHeader>
        <ModalBody>
          <Form encType="multipart/form-data">
            <FormGroup>
              <Label htmlFor="name">Product Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={selectedProduct.name || ""}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    name: e.target.value,
                  })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="image">Product Image</Label>
              <Input
                type="file"
                name="file"
                id="image"
                accept=".png, .jpg, .jpeg"
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    image: e.target.files[0],
                  })
                }
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSaveProduct}>
            Save
          </Button>
          <Button color="secondary" onClick={toggleEditModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
