const generateReferralCode = (nameOrId) => {
  return `${nameOrId.slice(0, 5)}-${Math.floor(1000 + Math.random() * 9000)}`;
};

module.exports = {generateReferralCode}