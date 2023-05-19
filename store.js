import { configureStore } from "@reduxjs/toolkit";
import distributionReducer from "./slices/distribution";
import giveawayReducer from "./slices/giveaway";
import transactionReducer from "./slices/transactions";
import referralReducer from "./slices/referral";
import userReducer from "./slices/users";
import discountReducer from "./slices/discount";

const reducer = {
  distribution: distributionReducer,
  giveaway: giveawayReducer,
  transactions: transactionReducer,
  referral: referralReducer,
  users: userReducer,
  discount: discountReducer
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;
