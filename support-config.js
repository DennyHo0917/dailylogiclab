// Public receiving wallets, verified against API Route's /api/dist/topup/info.
// Donations are direct transfers. No API Route account or recharge order is created.
// Add the Daily Logic Lab account's hosted Stripe Payment Link to stripeUrl.
// Keep API keys and webhook secrets outside this public repository.
window.DailyLogicSupportConfig = {
  stripeCheckoutEnabled: true,
  stripeUrl: "https://buy.stripe.com/14AbJ1bNNff46Vjgti8Zq00",
  stripeAmounts: [
    {
      "amount": 1,
      "url": "https://buy.stripe.com/bJe6oH9FFaYOgvTela8Zq01"
    },
    {
      "amount": 3,
      "url": "https://buy.stripe.com/aFa9ATg43d6WfrPcd28Zq02"
    },
    {
      "amount": 5,
      "url": "https://buy.stripe.com/14AbJ1bNNff46Vjgti8Zq00"
    },
    {
      "amount": 10,
      "url": "https://buy.stripe.com/14A8wPaJJeb00wVb8Y8Zq03"
    },
    {
      "amount": 20,
      "url": "https://buy.stripe.com/8x28wPcRR9UK2F30uk8Zq04"
    }
  ],
  networks: [
    {
      id: "tron",
      name: "TRON (TRC20)",
      address: "TV8FyJ72SmYr8zJVvhWKqFKEa1yDLgVBgv",
      tokens: ["USDT"]
    },
    {
      id: "arb",
      name: "Arbitrum One",
      address: "0x56a3ff56e79394e34834188a6e83a5d219984eb2",
      tokens: ["USDT", "USDC"]
    }
  ]
};
