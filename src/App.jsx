import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import Header from "./Components/Header";
import Home from "./Pages/Home";
import Cart from "./Pages/Cart";
import shoes1 from "./assets/shoes1.png";
import shoes2 from "./assets/shoes2.png";
import watch1 from "./assets/watch1.jpg";
import watch2 from "./assets/watch2.png";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart")
      return saved ? JSON.parse(saved) : []
    } catch {
      return [];
    }
  });

  const resetCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  const productsData = [
    { name: "Shoes 1", price: 2000, image: shoes1 },
    { name: "Shoes 2", price: 2500, image: shoes2 },
    { name: "Watch 1", price: 3000, image: watch1 },
    { name: "Watch 2", price: 3500, image: watch2 },
  ];

  // Fetch products and auto-add missing ones
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        let fetched = res.data.map((p) => ({
          ...p,
          id: p._id,
          originalPrice: p.price,
          currentPrice: p.price,
          toggleIndex: 0,
        }));

        setProducts(fetched);

        // Add missing products if DB has less than 4
        if (fetched.length < productsData.length) {
          const missing = productsData.slice(fetched.length);
          for (let p of missing) {
            const resAdd = await axios.post("http://localhost:5000/api/products", p);
            const newP = {
              ...resAdd.data,
              id: resAdd.data._id,
              originalPrice: resAdd.data.price,
              currentPrice: resAdd.data.price,
              toggleIndex: 0,
            };
            fetched.push(newP);
          }
          setProducts(fetched);
        }
      } catch (err) {
        console.error("Fetch products error:", err.message);
      }
    };

    fetchProducts();
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
// useEffect(() => {
//   setCart((prev) =>
//     prev.filter((item) =>
//       products.some((p) => p.id === item.id)
//     )
//   );
// }, [products]);
  // Save cart to localStorage
  

  // Toggle price (normal / discounted)
  const togglePrice = (id) => {
    setProducts((prevProducts) => {
      let updatedPrice = null;

      const updated = prevProducts.map((p) => {
        if (p.id === id) {
          const discount = Math.round(p.originalPrice * 0.9);
          const steps = [p.originalPrice, discount]
          let nextIndex = (p.toggleIndex || 0) + 1;
          if (nextIndex >= steps.length) nextIndex = 0;

          updatedPrice = steps[nextIndex];

          return { ...p, toggleIndex: nextIndex, currentPrice: updatedPrice };
        }
        return p;
      });

      // Update cart if item exists
      if (updatedPrice !== null) {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === id ? { ...item, currentPrice: updatedPrice } : item
          )
        );
      }

      return updated;
    });
  };

  // Update price (set discount)
  const updatePrice = (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const discount = Math.round(product.originalPrice * 0.9);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, currentPrice: discount, toggleIndex: 1 } : p
      )
    );

    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, currentPrice: discount } : item
      )
    );
  };

  // Add to cart
  const addToCart = (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const price = product.currentPrice || product.originalPrice;

    setCart((prevCart) => {
      const exist = prevCart.find((item) => item.id === id);

      if (exist) {
        return prevCart.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prevCart, { id: id, qty: 1, currentPrice: price }];
      }
    });
  };
// console.log(cart)
  const updateQuantity = (id, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: qty < 1 ? 1 : qty } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Delete product from backend + frontend
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (! confirmDelete ) return

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setCart((prev) => prev.filter((item) => item.id !== id));
      //  return [...updatedCart];
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  return (
    <Router>
      <Header cartCount={cart.reduce((acc, item) => acc + item.qty, 0)} />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              products={products}
              addToCart={addToCart}
              setProducts={setProducts}
              togglePrice={togglePrice}
              updatePrice={updatePrice}
              deleteProduct={deleteProduct}
              resetCart={resetCart}
              productsData={productsData}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              products={products}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              togglePrice={togglePrice}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;































// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState, useEffect } from "react";
// import axios from "axios";

// import Header from "./Components/Header";
// import Home from "./Pages/Home";
// import Cart from "./Pages/Cart";
// import shoes1 from "./assets/shoes1.png";
// import shoes2 from "./assets/shoes2.png";
// import watch1 from "./assets/watch1.jpg";
// import watch2 from "./assets/watch2.png"; 
// import "./App.css";

// function App() {
//   const [products, setProducts] = useState([]);
//   const [nextIndex, setNextIndex] = useState(0)
//   const [cart, setCart] = useState(()=>{
//   try {
//     const saved = localStorage.getItem("cart");
//     return saved ? JSON.parse(saved) : [];
//   } catch {
//     return [];
//   }
// });
//  const resetCart = () => {
//   localStorage.removeItem("cart");
//   setCart([]); 
// };
// const productsData = [
//   { name: "Shoes 1", price: 2000, image: shoes1 },
//   { name: "Shoes 2", price: 2500, image: shoes2 },
//   { name: "Watch 1", price: 3000, image: watch1 },
//   { name: "Watch 2", price: 3500, image: watch2 },
// ];
//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/products")
//       .then((res) => {
//         const data = res.data.map((p) => ({
//           ...p,
//           id: p._id,
//           originalPrice: p.price,
//           currentPrice: p.price,
//           toggleIndex: 0,
//         }));
//         setProducts(data);
//       })
//       .catch((err) => console.log(err));
//   }, []);





// useEffect(() => {
//   const saved = JSON.parse(localStorage.getItem("cart"));

//   if (saved && Array.isArray(saved)) {
//     const valid = saved.every(item => item.id && item.qty);
//     if (!valid) {
//       localStorage.removeItem("cart");
//     }
//   }
// }, []);



// useEffect(() => {
//   axios.get("http://localhost:5000/api/products")
//     .then(res => {
//       const fetched = res.data;
//       setProducts(fetched);

//       // check for missing products
//       if(fetched.length < 4) {
//         const missing = productsData.slice(fetched.length);
//         missing.forEach(p => axios.post("http://localhost:5000/api/products", p));
//       }
//     });
// }, []);


//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);


//   const togglePrice = (id) => {
//     setProducts((prevProducts) => {
//       let updatedPrice = null;

//       const updated = prevProducts.map((p) => {
//         if (p.id === id) {
//           const discount = Math.round(p.originalPrice * 0.9);
//           const steps = [p.originalPrice, discount];

//           let nextIndex = (p.toggleIndex || 0) + 1;
//           if (nextIndex >= steps.length) nextIndex = 0;

//           updatedPrice = steps[nextIndex];

//           return {
//             ...p,
//             toggleIndex: nextIndex,
//             currentPrice: updatedPrice,
//           };
//         }
//         return p;
//       });

  
//       if (updatedPrice !== null) {
//         setCart((prevCart) =>
//           prevCart.map((item) =>
//             item.id === id
//               ? { ...item, currentPrice: updatedPrice }
//               : item
//           )
//         );
//       }

//       return updated;
//     });
//   };


//   const updatePrice = (id) => {
//     const product = products.find((p) => p.id === id);
//     if (!product) return;

//     const discount = Math.round(product.originalPrice * 0.9);

//     setProducts((prev) =>
//       prev.map((p) =>
//         p.id === id
//           ? { ...p, currentPrice: discount, toggleIndex: 1 }
//           : p
//       )
//     );

//     setCart((prev) =>
//       prev.map((item) =>
//         item.id === id
//           ? { ...item, currentPrice: discount }
//           : item
//       )
//     );
//   };


//  const addToCart = (id) => {
//   const product = products.find((p) => p.id === id);
//   if (!product) return;

//   const price = product.currentPrice || product.originalPrice;

//   setCart((prevCart) => {
//     const exist = prevCart.find((item) => item.id === id);

//     if (exist) {
//       return prevCart.map((item) =>
//         item.id === id
//           ? { ...item, qty: item.qty + 1 }
//           : item
//       );
//     } else {
//       return [
//         ...prevCart,
//         { id: id, qty: 1, currentPrice: price },
//       ];
//     }
//   });
// };

//   const updateQuantity = (id, qty) => {
//     setCart((prev) =>
//       prev.map((item) =>
//         item.id === id
//           ? { ...item, qty: qty < 1 ? 1 : qty }
//           : item
//       )
//     );
//   };

//   const removeFromCart = (id) => {
//     setCart((prev) => prev.filter((item) => item.id !== id));
//   };

//   const deleteProduct = async (id) => {
//     const confirmDelete = window.confirm("Delete this product?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(
//         `http://localhost:5000/api/products/${id}`
//       );

//       setProducts((prev) => prev.filter((p) => p.id !== id));

//       setCart((prev) => prev.filter((item) => item.id !== id));
//     } catch (err) {
//       console.error("Delete error:", err.message);
//     }
//   };

//   const handleAddProduct = async () => {
//   if (nextIndex >= productsData.length) {
//     alert("All products added!");
//     return;
//   }

//   const p = productsData[nextIndex];

//   try {
//     const res = await axios.post("http://localhost:5000/api/products", p);
//     const newProduct = {
//       ...res.data,
//       id: res.data._id,
//       originalPrice: res.data.price,
//       currentPrice: res.data.price,
//     };
//     setProducts(prev => [...prev, newProduct]);
//     setNextIndex(prev => prev + 1); 
//     console.log("Product added ✅", newProduct.name);
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//   }
// };
//   return (
//     <Router>
      
//       <Header
//         cartCount={cart.reduce(
//           (acc, item) => acc + item.qty,
//           0
//         )}
        
//       />
      
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <Home
//               products={products}
//               addToCart={addToCart}
//                setProducts={setProducts} 
//               togglePrice={togglePrice}
//               updatePrice={updatePrice}
//               deleteProduct={deleteProduct}
//                resetCart={resetCart}
//                handleAddProduct={handleAddProduct}
//                productsData={productsData}
//             />
//           }
//         />

//         <Route
//           path="/cart"
//           element={
//             <Cart
//               cart={cart}
//               products={products}
//               updateQuantity={updateQuantity}
//               removeFromCart={removeFromCart}
//               togglePrice={togglePrice}
//             />
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;






























// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Header from "./Components/Header";
// import Home from "./Pages/Home";
// import Cart from "./Pages/Cart";
// import "./App.css";


// // 🔹 Images (frontend display only)


// function App() {
//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState(() => {
//     const saved = localStorage.getItem("cart");
//     return saved ? JSON.parse(saved) : [];
//   });

//   // 🔥 Load products from backend
//   useEffect(() => {
//     axios.get("http://localhost:5000/api/products")
//       .then(res => {
//         const data = res.data.map(p => ({
//           ...p,
//           id: p._id,
//           originalPrice: p.price,
//           currentPrice: p.price
//         }));
//         setProducts(data);
//       })
//       .catch(err => console.log(err));
//   }, []);

//   // ✅ Cart save to localStorage
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   // ===== Product Functions =====
//   const togglePrice = (id) => {
//     let newPrice;
//     setProducts(prev =>
//       prev.map(p => {
//         if (p.id === id) {
//           const options = p.priceOptions || [];
//           const discountPrice = Math.round(p.originalPrice * 0.9);
//           const steps = [p.originalPrice, discountPrice, ...options];
//           let nextIndex = (p.toggleIndex ?? -1) + 1;
//           if (nextIndex >= steps.length) nextIndex = 0;
//           newPrice = steps[nextIndex];
//           return { ...p, toggleIndex: nextIndex, currentPrice: newPrice };
//         }
//         return p;
//       })
//     );
//     setCart(prev =>
//       prev.map(item =>
//         item.id === id ? { ...item, currentPrice: newPrice } : item
//       )
//     );
//   };

//   const updatePrice = (id) => {
//     const product = products.find(p => p.id === id);
//     if (!product) return;
//     const discountPrice = Math.round(product.originalPrice * 0.9);
//     setProducts(prev =>
//       prev.map(p =>
//         p.id === id
//           ? { ...p, currentPrice: discountPrice, toggleIndex: 1 }
//           : p
//       )
//     );
//     setCart(prev =>
//       prev.map(item =>
//         item.id === id ? { ...item, currentPrice: discountPrice } : item
//       )
//     );
//   };

//   const addToCart = (id) => {
//     const product = products.find(p => p.id === id);
//     if (!product) return;
//     const price = product.currentPrice ?? product.originalPrice;
//     const exist = cart.find(item => item.id === id);
//     if (exist) {
//       setCart(prev =>
//         prev.map(item =>
//           item.id === id ? { ...item, qty: item.qty + 1 } : item
//         )
//       );
//     } else {
//       setCart(prev => [
//         ...prev,
//         { id: id, qty: 1, currentPrice: price }
//       ]);
//     }
//   };

//   const updateQuantity = (id, qty) => {
//     setCart(prev =>
//       prev.map(item =>
//         item.id === id ? { ...item, qty: qty < 1 ? 1 : qty } : item
//       )
//     );
//   };

//   const removeFromCart = (id) => {
//     setCart(prev => prev.filter(item => item.id !== id));
//   };

//   // ===== Add Products Once =====
//   const addProduct = async () => {
//     if (products.length > 0) {
//       alert("Products already added!");
//       return;
//     }

//     // const productsData = [
//     //   { name: "Shoes 1", price: 2000, image: shoes1 },
//     //   { name: "Shoes 2", price: 2500, image: watch1 },
//     //   { name: "watch 1", price: 3000, image: shoes2 },
//     //   { name: "Watch 2", price: 3500, image: watch2 },
//     // ];

//     try {
//       const newProducts = [];
//       for (let product of productsData) {
//         const res = await axios.post("http://localhost:5000/api/products", product);
//         newProducts.push({
//           ...res.data,
//           id: res.data._id,
//           originalPrice: res.data.price,
//           currentPrice: res.data.price
//         });
//       }
//       setProducts(prev => [...prev, ...newProducts]);
//       console.log("4 Products Added ✅");
//     } catch (err) {
//       console.error("POST error:", err.response?.data || err.message);
//     }
//   };

//   // ===== Delete Product with Confirmation =====
//   const deleteProduct = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this product?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`http://localhost:5000/api/products/${id}`);
//       setProducts(prev => prev.filter(p => p.id !== id));
//     } catch (err) {
//       console.error("Delete error:", err.message);
//     }
//   };

//   return (
//     <Router>
//       <Header cartCount={cart.reduce((acc, item) => acc + item.qty, 0)} />

//       {/* <div style={{ margin: "20px" }}>
//         <button onClick={addProduct}>Add Products to Backend</button>
//       </div> */}

//       <Routes>
//         <Route
//           path="/"
//           element={
//             <Home
//               products={products}
//               addToCart={addToCart}
//               togglePrice={togglePrice}
//               updatePrice={updatePrice}
//               deleteProduct={deleteProduct}
//             />
//           }
//         />
//         <Route
//           path="/cart"
//           element={
//             <Cart
//               cart={cart}
//               products={products}
//               updateQuantity={updateQuantity}
//               removeFromCart={removeFromCart}
//               togglePrice={togglePrice}
//             />
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Header from "./Components/Header";
// import Home from "./Pages/Home";
// import Cart from "./Pages/Cart";
// import "./App.css";
// import shoes1 from "./assets/shoes1.png";
// import shoes2 from "./assets/shoes2.png";
// import watch1 from "./assets/watch1.jpg";
// import watch2 from "./assets/watch2.png";

// function App() {

//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState(() => {
//     const saved = localStorage.getItem("cart");
//     return saved ? JSON.parse(saved) : [];
//   });

//   // 🔥 Load products from backend
//   useEffect(() => {
//     axios.get("http://localhost:5000/api/products")
//       .then(res => {
//         const data = res.data.map(p => ({
//           ...p,
//           id: p._id,
//           originalPrice: p.price,
//           currentPrice: p.price
//         }));
//         setProducts(data);
//       })
//       .catch(err => console.log(err));
//   }, []);

//   // ✅ Cart save to localStorage
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   // 🔥 Product functions (togglePrice, updatePrice, addToCart...) unchanged
//   function togglePrice(id) {
//     let newPrice;
//     setProducts(prev =>
//       prev.map(p => {
//         if (p.id === id) {
//           const options = p.priceOptions || [];
//           const discountPrice = Math.round(p.originalPrice * 0.9);
//           const steps = [p.originalPrice, discountPrice, ...options];
//           let nextIndex = (p.toggleIndex ?? -1) + 1;
//           if (nextIndex >= steps.length) nextIndex = 0;
//           newPrice = steps[nextIndex];
//           return { ...p, toggleIndex: nextIndex, currentPrice: newPrice };
//         }
//         return p;
//       })
//     );
//     setCart(prev =>
//       prev.map(item =>
//         item.id === id ? { ...item, currentPrice: newPrice } : item
//       )
//     );
//   }

//   function updatePrice(id) {
//     const product = products.find(p => p.id === id);
//     if (!product) return;
//     const discountPrice = Math.round(product.originalPrice * 0.9);
//     setProducts(prev =>
//       prev.map(p =>
//         p.id === id
//           ? { ...p, currentPrice: discountPrice, toggleIndex: 1 }
//           : p
//       )
//     );
//     setCart(prev =>
//       prev.map(item =>
//         item.id === id ? { ...item, currentPrice: discountPrice } : item
//       )
//     );
//   }

//   function addToCart(id) {
//     const product = products.find(p => p.id === id);
//     if (!product) return;
//     const price = product.currentPrice ?? product.originalPrice;
//     const exist = cart.find(item => item.id === id);
//     if (exist) {
//       setCart(prev =>
//         prev.map(item =>
//           item.id === id ? { ...item, qty: item.qty + 1 } : item
//         )
//       );
//     } else {
//       setCart(prev => [
//         ...prev,
//         { id: id, qty: 1, currentPrice: price }
//       ]);
//     }
//   }

//   function updateQuantity(id, qty) {
//     setCart(prev =>
//       prev.map(item =>
//         item.id === id ? { ...item, qty: qty < 1 ? 1 : qty } : item
//       )
//     );
//   }

//   function removeFromCart(id) {
//     setCart(prev => prev.filter(item => item.id !== id));
//   }


//   const addProduct = async () => {
//   const productsData = [
//     { name: "Shoes 1", price: 2000, image: shoes1 },
//     { name: "Shoes 2", price: 2500, image: shoes2 },
//     { name: "Shoes 3", price: 3000, image: watch1 }, // temporary reuse
//     { name: "Shoes 4", price: 3500, image: watch2 }  // temporary reuse
//   ];

//   try {
//     for (let product of productsData) {
//       const res = await axios.post("http://localhost:5000/api/products", product);

//       setProducts(prev => [
//         ...prev,
//         {
//           ...res.data,
//           id: res.data._id,
//           originalPrice: res.data.price,
//           currentPrice: res.data.price
//         }
//       ]);
//     }

//     console.log("4 Products Added ✅");

//   } catch (err) {
//     console.error("POST error:", err.response?.data || err.message);
//   }
// };
// const deleteProduct = async (id) => {
//   try {
//     await axios.delete(`http://localhost:5000/api/products/${id}`);

//     // UI se remove
//     setProducts(prev => prev.filter(p => p.id !== id));

//   } catch (err) {
//     console.error("Delete error:", err.message);
//   }
// };
//   return (
//     <Router>
//       <Header cartCount={cart.reduce((acc, item) => acc + item.qty, 0)} />

//       <div style={{ margin: "20px" }}>
//         {/* 🔹 Button to test adding product */}
//         <button onClick={addProduct}>Add Product to Backend</button>
//       </div>

//       <Routes>
//         <Route
//           path="/"
//           element={
//             <Home
//               products={products}
//               addToCart={addToCart}
//               togglePrice={togglePrice}
//               updatePrice={updatePrice}
//               deleteProduct={deleteProduct}
//             />
//           }
//         />
//         <Route
//           path="/cart"
//           element={
//             <Cart
//               cart={cart}
//               products={products}
//               updateQuantity={updateQuantity}
//               removeFromCart={removeFromCart}
//               togglePrice={togglePrice}
//             />
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Header from "./Components/Header";
// import Home from "./Pages/Home";
// import Cart from "./Pages/Cart";
// import "./App.css";

// function App() {


//   const [products, setProducts] = useState([]);

//   const [cart, setCart] = useState(() => {
//     const saved = localStorage.getItem("cart");
//     return saved ? JSON.parse(saved) : [];
//   });

//   // 🔥 Backend se products load karo
//   useEffect(() => {
//     axios.get("http://localhost:5000/api/products")
//       .then(res => {
//         // IMPORTANT: backend data ko adjust karo
//         const data = res.data.map(p => ({
//           ...p,
//           id: p._id, // 👈 fix id issue
//           originalPrice: p.price,
//           currentPrice: p.price
//         }));

//         setProducts(data);
//       })
//       .catch(err => console.log(err));
//   }, []);

//   // ❌ products localStorage remove (ab backend handle karega)

//   // ✅ Cart save
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   // 🔥 SAME FUNCTIONS (no change needed mostly)

//   function togglePrice(id) {
//     let newPrice;

//     setProducts(prev =>
//       prev.map(p => {
//         if (p.id === id) {
//           const options = p.priceOptions || [];
//           const discountPrice = Math.round(p.originalPrice * 0.9);
//           const steps = [p.originalPrice, discountPrice, ...options];

//           let nextIndex = (p.toggleIndex ?? -1) + 1;
//           if (nextIndex >= steps.length) nextIndex = 0;

//           newPrice = steps[nextIndex];

//           return {
//             ...p,
//             toggleIndex: nextIndex,
//             currentPrice: newPrice
//           };
//         }
//         return p;
//       })
//     );

//     setCart(prev =>
//       prev.map(item =>
//         item.id === id ? { ...item, currentPrice: newPrice } : item
//       )
//     );
//   }

//   function updatePrice(id) {
//     const product = products.find(p => p.id === id);
//     if (!product) return;

//     const discountPrice = Math.round(product.originalPrice * 0.9);

//     setProducts(prev =>
//       prev.map(p =>
//         p.id === id
//           ? { ...p, currentPrice: discountPrice, toggleIndex: 1 }
//           : p
//       )
//     );

//     setCart(prev =>
//       prev.map(item =>
//         item.id === id ? { ...item, currentPrice: discountPrice } : item
//       )
//     );
//   }

//   function addToCart(id) {
//     const product = products.find(p => p.id === id);
//     if (!product) return;

//     const price = product.currentPrice ?? product.originalPrice;

//     const exist = cart.find(item => item.id === id);

//     if (exist) {
//       setCart(prev =>
//         prev.map(item =>
//           item.id === id ? { ...item, qty: item.qty + 1 } : item
//         )
//       );
//     } else {
//       setCart(prev => [
//         ...prev,
//         { id: id, qty: 1, currentPrice: price }
//       ]);
//     }
//   }

//   function updateQuantity(id, qty) {
//     setCart(prev =>
//       prev.map(item =>
//         item.id === id ? { ...item, qty: qty < 1 ? 1 : qty } : item
//       )
//     );
//   }

//   function removeFromCart(id) {
//     setCart(prev => prev.filter(item => item.id !== id));
//   }

//   return (
//     <Router>
//       <Header cartCount={cart.reduce((acc, item) => acc + item.qty, 0)} />

//       <Routes>
//         <Route
//           path="/"
//           element={
//             <Home
//               products={products}
//               addToCart={addToCart}
//               togglePrice={togglePrice}
//               updatePrice={updatePrice}
//             />
//           }
//         />

//         <Route
//           path="/cart"
//           element={
//             <Cart
//               cart={cart}
//               products={products}
//               updateQuantity={updateQuantity}
//               removeFromCart={removeFromCart}
//               togglePrice={togglePrice}
//             />
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState, useEffect } from "react";
// import productsData from "./Data/Product";
// import Header from "./Components/Header";
// import Home from "./Pages/Home";
// import Cart from "./Pages/Cart";
// import "./App.css";

// function App() {
//   const [products, setProducts] = useState(() => {
//     const saved = localStorage.getItem("products");
//     return saved ? JSON.parse(saved) : productsData
//   });

//   const [cart, setCart] = useState(() => {
//     const saved = localStorage.getItem("cart");
//     return saved ? JSON.parse(saved) : []
//   });

//   useEffect(() => {
//     localStorage.setItem("products", JSON.stringify(products));
//   }, [products]);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);


//   function togglePrice(id) {
//     let newPrice;

//     setProducts(prev =>
//       prev.map(p => {
//         if (p.id === id) {
//           const options = p.priceOptions || [];
//           const discountPrice = Math.round(p.originalPrice * 0.9);
//           const steps = [p.originalPrice, discountPrice, ...options];

//           let nextIndex = (p.toggleIndex ?? -1) + 1;
//           if (nextIndex >= steps.length) nextIndex = 0;

//           newPrice = steps[nextIndex];

//           return {
//             ...p,
//             toggleIndex: nextIndex,
//             currentPrice: newPrice
//           };
//         }
//         return p;
//       })
//     );


//     setCart(prev =>
//       prev.map(item =>
//         item.id === id ? { ...item, currentPrice: newPrice } : item
//       )
//     );
//   }

//   function updatePrice(id) {
//     const product = products.find(p => p.id === id);
//     if (!product) return;

//     const discountPrice = Math.round(product.originalPrice * 0.9);

//     setProducts(prev =>
//       prev.map(p =>
//         p.id === id
//           ? { ...p, currentPrice: discountPrice, toggleIndex: 1 }
//           : p
//       )
//     );


//     setCart(prev =>
//       prev.map(item =>
//         item.id === id ? { ...item, currentPrice: discountPrice } : item
//       )
//     );
//   }
// function addToCart(id) {
//   const product = products.find(p => p.id === Number(id));
//   if (!product) return;

//   const price = product.currentPrice ?? product.originalPrice;

//   const exist = cart.find(item => item.id === id);

//   if (exist) {
//    setCart(prev =>
//     prev.map(item =>
   
//         item.id === id ? {...item, qty: item.qty + 1} : item
//       )
//     );
//   } else {
//     setCart(prev => [
//       ...prev,
//       {id: Number(id), qty: 1, currentPrice: price}
//     ]);
//   }
// }



//   function updateQuantity(id, qty) {

//     setCart(prev =>
//       prev.map(item =>
//         item.id === id ? {...item, qty: qty < 1 ? 1 : qty} : item
//       )
//     );
  
//   }


//   function removeFromCart(id) {

//     setCart(prev => prev.filter(item => item.id !== id));
//   }

//   return (
//     <Router>
//       <Header cartCount={cart.reduce((acc, item) => acc + item.qty, 0)} />

//       <Routes>
//         <Route
//           path="/"
//           element={
//             <Home
//               products={products}
//               addToCart={addToCart}
//               togglePrice={togglePrice}
//               updatePrice={updatePrice}
//             />
//           }
//         />

//         <Route
//           path="/cart"
//           element={
//             <Cart
//               cart={cart}
//               products={products}
//               updateQuantity={updateQuantity}
//               removeFromCart={removeFromCart}
//               togglePrice={togglePrice}
//             />
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;








