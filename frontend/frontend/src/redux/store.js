import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './features/authSlice';
import userReducer from './features/userSlice';
import categorieReducer from './features/categorieSlice'
import fraisReducer from './features/fraisSlice'
import paimentReducer from './features/paimentSlice'
import depenseReducer from './features/depenseSlice'
import caisseReducer from './features/caisseSlice'



export default configureStore({
  reducer: {
    auth: AuthReducer,
    user: userReducer,
    categorie : categorieReducer,
    frais : fraisReducer ,
    paiment : paimentReducer,
    depense : depenseReducer,
    caisse :caisseReducer

   
  },
});
