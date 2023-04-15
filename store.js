import { configureStore } from "@reduxjs/toolkit";
import distributionReducer from "./slices/distribution";
import giveawayReducer from "./slices/giveaway";

const reducer = {
  distribution: distributionReducer,
  giveaway: giveawayReducer,
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;
