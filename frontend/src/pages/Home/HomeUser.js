import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Header } from "../../components/Header";
import { apiPublicProduct } from "../../service/Product/apiPublicProduct";
import { CardGroup, Card, CardImg, CardBody, CardTitle } from "reactstrap";
export const HomeUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const decodedToken = jwtDecode(token);
        setUser(decodedToken);

        const productsData = await apiPublicProduct.getProducts();
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);
  return (
    <div>
      <Header />
      <h1>Bienvenido al home</h1>
      {user && (
        <div>
          <p>
            Name: {user.name} <br />
            Lastname: {user.lastname}
            <br />
            Tipo de usuario: {user.rol[0].authority}
          </p>
          <div>
            <h2>Contenido para Usuarios</h2>
            <h2>Lista de Productos:</h2>
            {loading ? (
              <p>Cargando productos...</p>
            ) : (
              <CardGroup>
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardImg
                      src={`http://localhost:8081${product.imageUrl}`}
                      alt={product.name}
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                    <CardBody>
                      <CardTitle tag="h5">{product.name}</CardTitle>
                    </CardBody>
                  </Card>
                ))}
              </CardGroup>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
