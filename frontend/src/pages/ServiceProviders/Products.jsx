import React, { useState } from "react";
import ProductList from "./ProductList"; // Path to your ProductList component
import AllProducts from "./AllProducts"; // Path to your AllProducts component
import ProductUpdate from "./ProductUpdate"; // Path to your ProductUpdate component
// import { Modal } from "react-bootstrap";
import Navigation from "./Navigation";

const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Function to handle closing the modal
  const handleModalClose = () => {  
    setShowModal(false);
    setSelectedProduct(null);
  };

  // Function to handle clicking the "Update Product" button
  const handleUpdateProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <div className="">

      <Navigation />

      {/* Create Product Section */}
      <section className="ml-[6%] ">
        <ProductList />
      </section>

      {/* All Products Section */}
      <section className="mt-10">
        <AllProducts onUpdateProductClick={handleUpdateProductClick} />
      </section>

      {/* Update Product Modal */}
      {/* {showModal && (
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ProductUpdate product={selectedProduct} onClose={handleModalClose} />
          </Modal.Body>
        </Modal>
      )} */}
    </div>
  );
};

export default Products;