import { configureStore } from "@reduxjs/toolkit";
import useReducer from "./userSlice";
import conversationReducer from "./consversationSlice";

export const store = configureStore({
  reducer: {
    user: useReducer,
    conversation: conversationReducer,
  },
});
