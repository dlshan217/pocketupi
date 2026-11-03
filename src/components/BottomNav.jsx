import { CircleUserRound, House, Banknote } from "lucide-react";
import Brand from "./Brand";

function BottomNav({ active, onNavigate, firstName, profileImage }) {
return ( <nav className="bottom-nav gpay-nav" aria-label="Main navigation">


  <button
    className={`nav-item ${active === "home" ? "active" : ""}`}
    onClick={() => onNavigate("home")}
    type="button"
  >
    <House size={21} />
    <span>Home</span>
  </button>

  <button
    className={`nav-item ${active === "money" ? "active" : ""}`}
    onClick={() => onNavigate("money")}
    type="button"
  >
    <Banknote size={21} />
    <span>Money</span>
  </button>

  <button
    className={`nav-item ${["you", "profile"].includes(active) ? "active" : ""}`}
    onClick={() => onNavigate("you")}
    type="button"
  >
    <span className="nav-avatar">
      {profileImage ? (
        <img src={profileImage} alt="" />
      ) : firstName?.slice(0, 1) ? (
        firstName.slice(0, 1).toUpperCase()
      ) : (
        <CircleUserRound size={21} />
      )}
    </span>
    <span>You</span>
  </button>

</nav>


);
}

export default BottomNav;
