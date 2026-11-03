export function parseUpiQr(value) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "upi:" || url.hostname !== "pay")
      throw new Error("This QR is not a UPI payment QR.");
    const params = url.searchParams;
    const vpa = params.get("pa") || "";
    if (!vpa) throw new Error("No demo UPI-style ID was found in this QR.");
    return {
      vpa,
      name: params.get("pn") || vpa,
      amount: params.get("am") || "",
      note: params.get("tn") || "",
    };
  } catch (issue) {
    throw new Error(issue.message || "Could not read the QR contents.", {
      cause: issue,
    });
  }
}
