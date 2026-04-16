
import "./Header.css";
import { Link } from "react-router-dom";
function Header({ cartCount}) {
  return (
    <header>
      <Link className="logo" to="/">MyStore</Link>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/cart" className="cart-link">
          Cart
          <span className="badge">{cartCount}</span>
          
        </Link>
      </nav>
    </header>
  );
}
export default Header




//   return (
//     <header>
//       <Link className="logo" to="/">MyStore</Link>
//       <nav>
//         <Link to="/">Home</Link>
//         <Link to="/cart" className="cart-link">
//           Cart {displayCount > 0 && <span className="badge">{displayCount}</span>}
//         </Link>
//       </nav>
//     </header>
//   );
// }

// export default Header;