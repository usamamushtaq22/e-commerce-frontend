import React, { useState} from "react";
import "./Home.css";
import axios from "axios";
import shoes1 from "../assets/shoes1.png";
import shoes2 from "../assets/shoes2.png";
import watch1 from "../assets/watch1.jpg";
import watch2 from "../assets/watch2.png";

function Home({ products, addToCart, updatePrice, togglePrice, resetCart, setProducts }) {
  // const [products, setProducts] = useState(initialProducts);
  const [nextIndex, setNextIndex] = useState(0); // 🔹 track next product to add

  const productsData = [
    { name: "Shoes 1", price: 2000, image: shoes1 },
    { name: "Shoes 2", price: 2500, image: shoes2 },
    { name: "Watch 1", price: 3000, image: watch1 },
    { name: "Watch 2", price: 3500, image: watch2 },
  ];

  // 🔹 Add one product at a time
  const handleAddProduct = async () => {
    if (nextIndex > productsData.length - 1) {
      alert("All products added!");
      return;
      
    }

    const p = productsData[nextIndex];
    const exists = products.find(prod => prod.name === p.name);

if (exists) {
  alert("Product already added!");
  setNextIndex(prev => prev + 1);
  return;
}
    try {
      const res = await axios.post("http://localhost:5000/api/products", p);
      const newProduct = {
        ...res.data,
        // id: res.data._id,

        originalPrice: res.data.price,
        currentPrice: res.data.price,
      
      };
      console.log("Index:", nextIndex);
console.log("Length:", productsData.length);
      setProducts(prev => [...prev, newProduct]);
      setNextIndex(prev => prev + 1); // 🔹 increment for next product
      console.log("Product added ✅", newProduct.name);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // 🔹 Delete product immediately
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(prev => prev.filter(product => product.id !== id));
      console.log("Deleted ✅");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };
  

  // useEffect(() => {
  //   setProducts(initialProducts);
  // }, [initialProducts]);

  return (
    <div className="home-wrapper">
      <h2>Our Products</h2>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        {/* <button onClick={handleAddProduct}>Add Product to Backend</button> */}
        <button onClick={resetCart} className="reset-btn">Reset Cart</button>
        {/* <button onClick={handleAddProduct}>Add Product</button> */}
      </div>

      <div className="home-container">
        {products.map((product, index) => {
          const current = product.currentPrice ?? product.price ?? 0
          const original = product.originalPrice ?? product.price ?? 0
          const productKey = product._id ?? index;

          return (
            <div key={productKey} className="product-card">
              {product.name.toLowerCase().includes("premium") && <span className="badge-premium"></span>}
              {current < original && (
                <span className="badge-discount" style={{ top: "10px", right: "10px" }}>
                  {Math.round(((original - current) / original) * 100)}% OFF
                </span>
              )}

              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  className="slide-img"
                  style={{ width: "150px", height: "150px" }}
                />
              </div>

              <h3 className="product-name">{product.name}</h3>

              <div className="product-price">
                {current < original ? (
                  <>
                    <span style={{ textDecoration: "line-through", color: "#999", marginRight: "8px" }}>
                      ${original}
                    </span>
                    <span>${current}</span>
                  </>
                ) : (
                  <span>${original}</span>
                )}
              </div>

              {current < original && (
                <p style={{ color: "#27ae60", fontSize: "13px" }}>
                  You saved ${original - current}
                </p>
              )}

              <div className="button-group">
                <button onClick={handleAddProduct}>Add Product</button>
                <button className="add-btn" onClick={() => addToCart(product._id)}>Add To Cart</button>
                <button className="price-btn" onClick={() => updatePrice(product._id)}>Update Price</button>
                <button className="toggle-btn" onClick={() => togglePrice(product._id)}>Toggle Price</button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(product._id)}
                  style={{ backgroundColor: "red", color: "white" }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;




























// import React, { useState, useEffect } from "react";
// import "./Home.css";
// import axios from "axios";
// import shoes1 from '../assets/shoes1.png';
// import shoes2 from '../assets/shoes2.png';
// import watch1 from '../assets/watch1.jpg';
// import watch2 from '../assets/watch2.png'; 

// function Home({ products: initialProducts, addToCart, updatePrice, togglePrice }) {
//   // ✅ Local state for instant UI update
//   const [products, setProducts] = useState(initialProducts);

//   // 🔹 Default products data for Add Products button
//   const productsData = [
//     { name: "Shoes 1", price: 2000, image: shoes1 },
//     { name: "Shoes 2", price: 2500, image: shoes2 },
//     { name: "Watch 1", price: 3000, image: watch1 },
//     { name: "Watch 2", price: 3500, image: watch2 },
//   ];

//   // 🔹 Add product to backend & frontend
//   const handleAddProduct = async () => {
//     try {
//       const newProducts = [];
//       for (let p of productsData) {
//         const res = await axios.post("http://localhost:5000/api/products", p);
//         newProducts.push({
//           ...res.data,
//           id: res.data._id,
//           originalPrice: res.data.price,
//           currentPrice: res.data.price,
//         });
//       }
//       setProducts(prev => [...prev, ...newProducts]);
//       console.log("Products added ✅");
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//     }
//   };

//   // 🔹 Delete product immediately
//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this product?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`http://localhost:5000/api/products/${id}`);
//       setProducts(prev => prev.filter(product => product._id !== id));
//       console.log("Deleted ✅");
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//     }
//   };

//   // 🔹 Sync if initialProducts change from parent
//   useEffect(() => {
//     setProducts(initialProducts);
//   }, [initialProducts]);

//   return (
//     <div className="home-wrapper">
//       <h2>Our Products</h2>

//       {/* Add Products Button */}
//       <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
//         <button onClick={handleAddProduct}>Add Products to Backend</button>
//       </div>

//       <div className="home-container">
//         {products.map((product, index) => {
//           const current = product.currentPrice ?? product.price;
//           const original = product.originalPrice;
//           const productKey = product._id ?? index;

//           return (
//             <div key={productKey} className="product-card">
//               {product.name.toLowerCase().includes("premium") && <span className="badge-premium"></span>}
//               {current < original && (
//                 <span className="badge-discount" style={{ top: "10px", right: "10px" }}>
//                   {Math.round(((original - current) / original) * 100)}% OFF
//                 </span>
//               )}

//               <div className="product-image">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="slide-img"
//                   style={{ width: "150px", height: "150px" }}
//                 />
//               </div>

//               <h3 className="product-name">{product.name}</h3>

//               <div className="product-price">
//                 {current < original ? (
//                   <>
//                     <span style={{ textDecoration: "line-through", color: "#999", marginRight: "8px" }}>
//                       ${original}
//                     </span>
//                     <span>${current}</span>
//                   </>
//                 ) : (
//                   <span>${original}</span>
//                 )}
//               </div>

//               {current < original && (
//                 <p style={{ color: "#27ae60", fontSize: "13px" }}>
//                   You saved ${original - current}
//                 </p>
//               )}

//               <div className="button-group">
//                 <button className="add-btn" onClick={() => addToCart(product._id)}>Add to Cart</button>
//                 <button className="price-btn" onClick={() => updatePrice(product._id)}>Update Price</button>
//                 <button className="toggle-btn" onClick={() => togglePrice(product._id)}>Toggle Price</button>
//                 <button
//                   className="delete-btn"
//                   onClick={() => handleDelete(product._id)}
//                   style={{ backgroundColor: "red", color: "white" }}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default Home;

// import React, { useState, useEffect } from "react";
// import "./Home.css";
// import axios from "axios";
// import shoes1 from './assets/shoes1.png'
// import shoes2 from './assets/shoes2.png'
// import watch1 from './assets/watch1.jpg'
// import watch2 from './assets/watch2.png' 
// function Home({ products: initialProducts, addToCart, updatePrice, togglePrice }) {
//   // ✅ Local state for instant UI update
//   const [products, setProducts] = useState(initialProducts);
//   const productsData = [
//       { name: "Shoes 1", price: 2000, image: shoes1 },
//       { name: "Shoes 2", price: 2500, image: watch1 },
//       { name: "watch 1", price: 3000, image: shoes2 },
//       { name: "Watch 2", price: 3500, image: watch2 },
//     ];
//   // 🔹 Delete product
//   const handleDelete = async (id) => {
//     try {
//       // optional: loading indicator
//       await axios.delete(`http://localhost:5000/api/products/${id}`);
//       console.log("Deleted");

//       // 🔹 Remove from local state immediately
//       setProducts((prev) => prev.filter((product) => product._id !== id));
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//     }
//   };
// const handleAddProduct = async () => {
//   try {
//     const newProduct = {
//       name: "New Product",
//       price: 1000,
//       originalPrice: 1200,
//       image: "",
//     };

//     // 🔹 Add to backend
//     const res = await axios.post("http://localhost:5000/api/products", newProduct);

//     // 🔹 Update frontend state immediately
//     setProducts((prev) => [...prev, res.data]); 
//     console.log("Product added", res.data);
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//   }
// };  
//   // 🔹 Sync if initialProducts change from parent
//   useEffect(() => {
//     setProducts(initialProducts);
//   }, [initialProducts]);

//   return (
//     <div className="home-wrapper">
//       <h2>Our Products</h2>
//       <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
//   <button onClick={handleAddProduct}>Add Products to Backend</button>
// </div>
//       <div className="home-container">
        
//         {products.map((product, index) => {
//           const current = product.currentPrice ?? product.price;
//           const original = product.originalPrice;

//           const productKey = product._id ?? index;
           

//           return (

//             <div key={productKey} className="product-card">
//               {product.name.toLowerCase().includes("premium") && (
//                 <span className="badge-premium"></span>
//               )}
//               {current < original && (
//                 <span
//                   className="badge-discount"
//                   style={{ top: "10px", right: "10px" }}
//                 >
//                   {Math.round(((original - current) / original) * 100)}% OFF
//                 </span>
//               )}

//               <div className="product-image">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="slide-img"
//                   style={{ width: "150px", height: "150px" }}
//                 />
//               </div>

//               <h3 className="product-name">{product.name}</h3>
             

//               <div className="product-price">
//                 {current < original ? (
//                   <>
//                     <span
//                       style={{
//                         textDecoration: "line-through",
//                         color: "#999",
//                         marginRight: "8px",
//                       }}
//                     >
//                       ${original}
//                     </span>
//                     <span>${current}</span>
//                   </>
//                 ) : (
//                   <span>${original}</span>
//                 )}
//               </div>

//               {current < original && (
//                 <p style={{ color: "#27ae60", fontSize: "13px" }}>
//                   You saved ${original - current}
//                 </p>
//               )}

//               <div className="button-group">
//                 <button className="add-btn" onClick={() => addToCart(product._id)}>
//                   Add to Cart
//                 </button>

//                 <button className="price-btn" onClick={() => updatePrice(product._id)}>
//                   Update Price
//                 </button>

//                 <button className="toggle-btn" onClick={() => togglePrice(product._id)}>
//                   Toggle Price
//                 </button>

//                 <button
//                   className="delete-btn"
//                   onClick={() => handleDelete(product._id)}
//                   style={{ backgroundColor: "red", color: "white" }}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default Home;











// import "./Home.css";
// import axios from 'axios'


// function Home({ products, addToCart, updatePrice, togglePrice, deleteProduct }) {
//    const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/products/${id}`);
//       console.log("Deleted");
//       deleteProduct(id); // ✅ now works
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//     }
//   };
//   return (
//     <div className="home-wrapper">
//       <h2>Our Products</h2>
//       <div className="home-container">
//         {products.map((product, index) => {
//           const current = product.currentPrice ?? product.price;
//           const original = product.originalPrice;

//           // Fully safe unique key: id/_id if exists, otherwise index
//           const productKey = product.id ?? product._id ?? index;

//           return (
//             <div key={productKey} className="product-card">
//               {product.name.toLowerCase().includes("premium") && (
//                 <span className="badge-premium"></span>
//               )}
//               {current < original && (
//                 <span
//                   className="badge-discount"
//                   style={{ top: "10px", right: "10px" }}
//                 >
//                   {Math.round(((original - current) / original) * 100)}% OFF
//                 </span>
//               )}

//               <div className="product-image">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="slide-img"
//                   style={{ width: "150px", height: "150px" }}
//                 />
//               </div>

//               <h3 className="product-name">{product.name}</h3>

//               <div className="product-price">
//                 {current < original ? (
//                   <>
//                     <span
//                       style={{
//                         textDecoration: "line-through",
//                         color: "#999",
//                         marginRight: "8px",
//                       }}
//                     >
//                       ${original}
//                     </span>
//                     <span>${current}</span>
//                   </>
//                 ) : (
//                   <span>${original}</span>
//                 )}
//               </div>

//               {current < original && (
//                 <p style={{ color: "#27ae60", fontSize: "13px" }}>
//                   You saved ${original - current}
//                 </p>
//               )}

//               <div className="button-group">
//                 <button
//                   className="add-btn"
//                   onClick={() => addToCart(product._id)}
//                 >
//                   Add to Cart
//                 </button>
                
//                 <button
//                   className="price-btn"
//                   onClick={() => updatePrice(product._id)}
//                 >
//                   Update Price
//                 </button>
//                 <button
//                   className="toggle-btn"
//                   onClick={() => togglePrice(product._id)}
//                 >
//                   Toggle Price
//                 </button>
//                 <button
//                   className="delete-btn"
//                   onClick={() => handleDelete(product._id)}
//                   style={{ backgroundColor: "red", color: "white" }}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default Home;

// import "./Home.css";

// function Home({ products, addToCart, updatePrice, togglePrice, deleteProduct }) {
//   return (
//     <div className="home-wrapper">
//       <h2>Our Products</h2>

//       <div className="home-container">
//         {products.map((product, key)=> {
//           const current = product.currentPrice ?? product.price;
//           const original = product.originalPrice;

//           return (
//             <div key={product.id || product._id} className="product-card">
//               {product.name.toLowerCase().includes("premium") && (
//                 <span className="badge-premium"></span>
//               )}

//               {current < original && (
//                 <span className="badge-discount" style={{ top: "10px", right: "10px" }}>
//                   {Math.round(((original - current) / original) * 100)}% OFF
//                 </span>
//               )}

//               <div className="product-image">
//                 <img src={product.image} alt={product.name} className="slide-img" style={{ width: "150px", height: "150px" }}/>
//               </div>

//               <h3 className="product-name">{product.name}</h3>

//               <div className="product-price">
//                 {current < original ? (
//                   <>
//                     <span style={{ textDecoration: "line-through", color: "#999", marginRight: "8px" }}>
//                       ${original}
//                     </span>
//                     <span>${current}</span>
//                   </>
//                 ) : (
//                   <span>${original}</span>
//                 )}
//               </div>

//               {current < original && (
//                 <p style={{ color: "#27ae60", fontSize: "13px" }}>
//                   You saved ${original - current}
//                 </p>
//               )}

//               <div className="button-group">
//                 <button className="add-btn" onClick={() => addToCart(product.id)}>Add to Cart</button>
//                 <button className="delete-btn" onClick={() => deleteProduct(product.id)} style={{ backgroundColor: "red", color: "white" }}>Delete</button>
//                 <button className="price-btn" onClick={() => updatePrice(product.id)}>Update Price</button>
//                 <button className="toggle-btn" onClick={() => togglePrice(product.id)}>Toggle Price</button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default Home;
// import "./Home.css";

// function Home({ products, addToCart, updatePrice, togglePrice, deleteProduct }) {
//   return (
//     <div className="home-wrapper">
//       <h2>Our Products</h2>

//       <div className="home-container">
//         {products.map(product => {
//           const current = product.currentPrice ?? product.price;
//           const original = product.originalPrice;

//           return (
//             <div key={product.id} className="product-card">
//               {product.name.toLowerCase().includes("premium") && (
//                 <span className="badge-premium"></span>
//               )}

//               {current < original && (
//                 <span className="badge-discount" style={{ top: "10px", right: "10px" }}>
//                   {Math.round(((original - current) / original) * 100)}% OFF
//                 </span>
//               )}

//               <div className="product-image">
//                 <img src={product.image} alt={product.name} className="slide-img" style={{ width: "150px", height: "150px" }}/>
//               </div>

//               <h3 className="product-name">{product.name}</h3>

//               <div className="product-price">
//                 {current < original ? (
//                   <>
//                     <span style={{ textDecoration: "line-through", color: "#999", marginRight: "8px" }}>
//                       ${original}
//                     </span>
//                     <span>${current}</span>
//                   </>
//                 ) : (
//                   <span>${original}</span>
//                 )}
//               </div>

//               {current < original && (
//                 <p style={{ color: "#27ae60", fontSize: "13px" }}>
//                   You saved ${original - current}
//                 </p>
//               )}

//               <div className="button-group">
//                 <button className="add-btn" onClick={() => addToCart(product.id)}>Add to Cart</button>
//                 <button className="delete-btn" onClick={() => deleteProduct(product.id)} style={{ backgroundColor: "red", color: "white" }}>Delete</button>
//                 <button className="price-btn" onClick={() => updatePrice(product.id)}>Update Price</button>
//                 <button className="toggle-btn" onClick={() => togglePrice(product.id)}>Toggle Price</button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default Home;
// import "./Home.css";

// function Home({ products, addToCart, updatePrice, togglePrice,  deleteProduct}){
//   return (
//     <div className="home-wrapper">
//       <h2>Our Products</h2>


//       <div className="home-container">
//         {products.map(product => {
//           const current = product.currentPrice ?? product.price;
//           const original = product.originalPrice;

//           return (
//             <div key={product.id} className="product-card">


//               {product.name.toLowerCase().includes("premium") && (
//                 <span className="badge-premium"></span>
                
//               )}


//              {current < original &&( 
//                 <span className="badge-discount" style={{ top: "10px", right: "10px" }}>
//                   {Math.round(((original - current) / original) * 100)}% OFF
//                 </span>
//               )}


//               <div className="product-image">
//                 <img src={product.image} alt={product.name} className="slide-img"   style={{ width: "150px", height: "150px" }}/>
//               </div>


//               <h3 className="product-name">{product.name}</h3>

//               <div className="product-price">
//                 {current < original ? (
//                   <>
//                     <span style={{ textDecoration: "line-through", color: "#999", marginRight: "8px" }}>
//                       ${original}
//                     </span>
//                     <span>${current}</span>
//                   </>
//                 ) : (
//                   <span>${original}</span>
//                 )}
//               </div>

//               {current < original && (
//                 <p style={{ color: "#27ae60", fontSize: "13px" }}>
//                   You saved ${original - current}
//                 </p>
//               )}


//               <div className="button-group">

//                 <button
//                   className="add-btn"
//                   onClick={() => addToCart(product.id)}
//                 >
//                   Add to Cart
//                 </button>
//                 <button onClick={() => deleteProduct(product.id)}>
//                   Delete
//                 </button>
//                 <button
//                   className="price-btn"
//                   onClick={() => updatePrice(product.id)}
//                 >
//                   Update Price
//                 </button>
//                 <button
//                   className="toggle-btn"
//                   onClick={() => togglePrice(product.id)}
//                 >
//                   Toggle Price
//                 </button>



//               </div>

//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default Home;
