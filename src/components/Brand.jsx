import { Wallet } from "lucide-react";

function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark">
        <Wallet size={21} strokeWidth={2.4} />
      </div>
      <span>
        Pocket<span className="brand-accent">UPI</span>
      </span>
    </div>
  );
}

export default Brand;
