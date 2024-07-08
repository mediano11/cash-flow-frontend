import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';

//slices
import MonthPickerSlice from '@UI_store/MonthPickerSlice/MonthPickerSlice';
import ThemeSlice from '@UI_store/ThemeSlice/ThemeSlice';
import UserSlice from '@store/User/UserSlice';
import CurrencySlice from '@UI_store/CurrencySlice/CurrencySlice';

import { api } from './api';

export const persistConfig = {
    key: 'root',
    storage,
}

//Theme

const persistedThemeSlice = persistReducer(persistConfig, ThemeSlice);
const persistedUserSlice = persistReducer(persistConfig, UserSlice);
const persistedCurrencySlice = persistReducer(persistConfig, CurrencySlice);

const devToolsCompose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
export const store = configureStore({
    reducer: {
        persistedThemeSlice,
        persistedUserSlice,
        persistedCurrencySlice,
        MonthPickerSlice,
        [api.reducerPath]: api.reducer,
    },
    devTools: devToolsCompose,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(api.middleware)
})

export const persistedStore = persistStore(store);
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export default store;