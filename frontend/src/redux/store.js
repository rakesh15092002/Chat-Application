// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice'
import userThemeReducer from './slices/userThemeSlice';
import userChatReducer from './slices/userChatSlice'
// import chatReducer from './slices/userSlice'
// import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
   user:userReducer,
   userTheme :userThemeReducer,
   userChat: userChatReducer,
  //  chat:chatReducer,
  //  conversation :conversationReducer,
  },
});


export default store;