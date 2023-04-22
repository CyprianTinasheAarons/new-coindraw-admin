import { configureStore } from "@reduxjs/toolkit";
import distributionReducer from "./slices/distribution";
import giveawayReducer from "./slices/giveaway";
import transactionReducer from "./slices/transactions";

const reducer = {
  distribution: distributionReducer,
  giveaway: giveawayReducer,
  transactions: transactionReducer,
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;
