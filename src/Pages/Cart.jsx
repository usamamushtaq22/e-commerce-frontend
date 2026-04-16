import "./Cart.css";
import axios from "axios";

function Cart({ cart, products, updateQuantity, removeFromCart, togglePrice }) {

  const cartWithDetails = cart.reduce((acc, item) => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      acc.push({
        ...product,
        ...item
      });
    }
    return acc;
  }, []);

  const totalPrice = cartWithDetails.reduce(
    (acc, item) => acc + (item.currentPrice ?? item.price) * item.qty,
    0
  );

  const totalItems = cartWithDetails.reduce((acc, item) => acc + item.qty, 0);

  const placeOrder = async () => {
    if (cartWithDetails.length === 0) {
      alert("Cart is empty ❌");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // optional

      const orderData = {
        items: cartWithDetails.map(item => ({
          productId: item.id,
          qty: item.qty,
          price: item.currentPrice ?? item.price
        })),
        total: totalPrice
      };

      await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        {
          headers: {
            Authorization: token // optional, backend may ignore
          }
        }
      );

      // ✅ Clear cart after order
      setCart([]);
      localStorage.removeItem("cart");
      alert("Order placed successfully 🔥");

    } catch (err) {
      console.log(err);
      alert("Order failed ❌");
    }
  };

  return (
    
    <div className="cart-container">
     
      <h2>Your Cart</h2>

      {cartWithDetails.length === 0 && (
        <p className="empty">Cart is empty</p>
      )}

      {cartWithDetails.map(item => {
        const price = item.currentPrice ?? item.price;
        const itemTotal = price * item.qty;

        return (
          <div key={item.id} className="cart-item">

            <div className="cart-image">
              <img src={item.image} alt={item.name} className="slide-img" />
            </div>

            <div className="cart-details">
              <span className="cart-name">{item.name}</span>
              <span className="cart-price">${price}</span>
              <span className="cart-qty">
                Qty: <span className="qty-number">{item.qty}</span>
              </span>

              <div className="cart-item-total-container">
                <span>Total: </span>
                <span>${itemTotal}</span>
              </div>
            </div>

            <div className="qty-buttons">
              <button onClick={() => updateQuantity(item.id, item.qty + 1)}>+</button>
              <span className="qty-number">{item.qty}</span>
              <button onClick={() => updateQuantity(item.id, item.qty - 1)}>-</button>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>

              <button
                className="toggle-btn"
                onClick={() => togglePrice(item.id)}
              >
                Toggle
              </button>
            </div>

          </div>
        );
      })}

      {cartWithDetails.length > 0 && (
        <div className="cart-summary">
          <span>Total Items: {totalItems}</span>
        
          <span>Total Price: ${totalPrice}</span>

          {/* 🔥 NEW BUTTON */}
          <button className="order-btn" onClick={placeOrder}>
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
// import "./Cart.css";
// import axios from "axios"; // 👈 future use

// function Cart({ cart, products, updateQuantity, removeFromCart, togglePrice }) {

//   // 🔥 Merge cart + backend products
//   const cartWithDetails = cart.reduce((acc, item) => {
//     const product = products.find(p => p.id === item.id);

//     if (product) {
//       acc.push({
//         ...product,
//         ...item
//       });
//     }

//     return acc;
//   }, []);

//   // ✅ Total Price
//   const totalPrice = cartWithDetails.reduce(
//     (acc, item) => acc + (item.currentPrice ?? item.price) * item.qty,
//     0
//   );

//   // ✅ Total Items
//   const totalItems = cartWithDetails.reduce(
//     (acc, item) => acc + item.qty,
//     0
//   );

//   // 🔥 FUTURE: Order Place (Backend)
//   const placeOrder = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const orderData = {
//         items: cartWithDetails.map(item => ({
//           productId: item.id,
//           qty: item.qty,
//           price: item.currentPrice ?? item.price
//         })),
//         total: totalPrice
//       };

//       const res = await axios.post(
//         "http://localhost:5000/api/orders",
//         orderData,
//         {
//           headers: {
//             Authorization: token
//           }
//         }
//       );

//       alert("Order placed successfully 🔥");

//       // 🧹 Clear cart after order
//       // localStorage.removeItem("cart");
//       // window.location.reload();
// setCart([]);                       // Cart state empty kar do
// localStorage.removeItem("cart");    // LocalStorage se remove
// alert("Order placed successfully 🔥");
//     } catch (err) {
//       console.log(err);
//       alert("Order failed ❌");
//     }
//   };

//   return (
//     <div className="cart-container">
//       <h2>Your Cart</h2>

//       {cartWithDetails.length === 0 && (
//         <p className="empty">Cart is empty</p>
//       )}

//       {cartWithDetails.map(item => {
//         const price = item.currentPrice ?? item.price;
//         const itemTotal = price * item.qty;

//         return (
//           <div key={item.id} className="cart-item">

//             <div className="cart-image">
//               <img src={item.image} alt={item.name} className="slide-img" />
//             </div>

//             <div className="cart-details">
//               <span className="cart-name">{item.name}</span>
//               <span className="cart-price">${price}</span>
//               <span className="cart-qty">
//                 Qty: <span className="qty-number">{item.qty}</span>
//               </span>

//               <div className="cart-item-total-container">
//                 <span>Total: </span>
//                 <span>${itemTotal}</span>
//               </div>
//             </div>

//             <div className="qty-buttons">
//               <button onClick={() => updateQuantity(item.id, item.qty + 1)}>+</button>
//               <span className="qty-number">{item.qty}</span>
//               <button onClick={() => updateQuantity(item.id, item.qty - 1)}>-</button>

//               <button
//                 className="remove-btn"
//                 onClick={() => removeFromCart(item.id)}
//               >
//                 Remove
//               </button>

//               <button
//                 className="toggle-btn"
//                 onClick={() => togglePrice(item.id)}
//               >
//                 Toggle
//               </button>
//               <button className="order-btn" onClick={placeOrder} disabled={cartWithDetails.length === 0}>
//   Place Order
// </button>
//             </div>

//           </div>
//         );
//       })}

//       {cartWithDetails.length > 0 && (
//         <div className="cart-summary">
//           <span>Total Items: {totalItems}</span>
//           <span>Total Price: ${totalPrice}</span>

//           {/* 🔥 NEW BUTTON */}
//           <button className="order-btn" onClick={placeOrder}>
//             Place Order
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Cart;

// import "./Cart.css";

// function Cart({ cart, products, updateQuantity, removeFromCart, togglePrice }) {

//   const cartWithDetails = cart.reduce((acc, item) => {
//     const product = products.find(p => p.id === item.id);

//     if (product) {
//       acc.push({
//         ...product,
//         ...item
//       });
//     }

//     return acc;
//   }, [])

//   const totalPrice = cartWithDetails.reduce(
//     (acc, item) => acc + (item.currentPrice ?? item.price) * item.qty,
//     0
//   );

//   const totalItems = cartWithDetails.reduce(
//     (acc, item) => acc + item.qty,
//     0
//   );

//   return (
//     <div className="cart-container">
//       <h2>Your Cart</h2>

//       {cartWithDetails.length === 0 && (
//         <p className="empty">Cart is empty</p>
//       )}

//       {cartWithDetails.map(item => {
//         const price = item.currentPrice ?? item.price;
//         const itemTotal = price * item.qty;

//         return (
//           <div key={item.id} className="cart-item">

//             <div className="cart-image">
//               <img src={item.image} alt={item.name} className="slide-img" />
//             </div>

//             <div className="cart-details">
//               <span className="cart-name">{item.name}</span>
//               <span className="cart-price">${price}</span>
//               <span className="cart-qty">
//                 Qty: <span className="qty-number">{item.qty}</span>
//               </span>
//               <div className="cart-item-total-container">
//                 <span className="cart-item-total">Total: </span>
//                 <span className="cart-item-total-span">${itemTotal}</span>
//               </div>
//             </div>

//             <div className="qty-buttons">
//               <button onClick={() => updateQuantity(item.id, item.qty + 1)}>+</button>
//               <span className="qty-number">{item.qty}</span>
//               <button onClick={() => updateQuantity(item.id, item.qty - 1)}>-</button>
//               <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
//               <button className="toggle-btn" onClick={() => togglePrice(item.id)}>Toggle</button>
//             </div>

//           </div>
//         );
//       })}

//       {cartWithDetails.length > 0 && (
//         <div className="cart-summary">
//           <span>Total Items: {totalItems}</span>
//           <span>Total Price: ${totalPrice}</span>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Cart;

