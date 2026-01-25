const calculateTrustScore = (vendor) => {
  let score = 0;

  if (vendor.email) score += 10;
  if (vendor.companyName) score += 10;
  if (vendor.gstNumber) score += 20;
  if (vendor.panNumber) score += 10;

  if (
    vendor.address?.street &&
    vendor.address?.city &&
    vendor.address?.state &&
    vendor.address?.pincode
  ) score += 10;

  if (
    vendor.bankDetails?.accountNumber &&
    vendor.bankDetails?.ifsc
  ) score += 20;

  if (
    vendor.documents?.gstCert &&
    vendor.documents?.panCard
  ) score += 20;

  if (vendor.isVerified) score += 20;

  return Math.min(score, 100);
};

export default calculateTrustScore ;