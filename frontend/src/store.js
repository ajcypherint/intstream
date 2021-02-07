import storage from 'redux-persist/es/storage'
import { applyMiddleware, createStore, compose } from 'redux'
import { createFilter } from 'redux-persist-transform-filter'
import { persistReducer, persistStore } from 'redux-persist'
import thunk from 'redux-thunk'

import apiMiddleware from './middleware'
import rootReducer from './reducers'

export default (history) => {
  const persistedFilter = createFilter(
    'auth', ['access', 'refresh', 'username', 'isIntegrator', 'isStaff', 'isSuperuser']
  )

  const reducer = persistReducer(
    {
      key: 'polls',
      storage: storage,
      whitelist: ['auth'],
      transforms: [persistedFilter]
    },
    rootReducer
  )

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const store = createStore(
    reducer, {},
    composeEnhancers(applyMiddleware(thunk, apiMiddleware))

  )

  const persistor = persistStore(store)

  return { store, persistor }
}
