import { combineReducers, configureStore } from '@reduxjs/toolkit'
import productReducer from './slides/productSlide'
import teacherReducer from './slides/teacherSlide'
import courseReducer from './slides/courseSlide'
import userReducer from './slides/userSlide'
import orderReducer from './slides/orderSlide'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: ['product', 'user'],
}

const rootReducer = combineReducers({
    product: productReducer,
    teacher: teacherReducer,
    course: courseReducer,
    user: userReducer,
    order: orderReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export let persistor = persistStore(store)