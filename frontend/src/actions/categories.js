import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'

export const ADD_CATEGORIES_REQUEST = '@@categories/ADD_CATEGORIES_REQUEST';
export const ADD_CATEGORIES_SUCCESS = '@@categories/ADD_CATEGORIES_SUCCESS';
export const ADD_CATEGORIES_FAILURE = '@@categories/ADD_CATEGORIES_FAILURE';

export const CATEGORIES_REQUEST = '@@categories/CATEGORIES_REQUEST';
export const CATEGORIES_SUCCESS = '@@categories/CATEGORIES_SUCCESS';
export const CATEGORIES_FAILURE = '@@categories/CATEGORIES_FAILURE';

export const CATEGORIES_CHANGED = "CATEGORIES_CHANGED"

export const add_category = (category) => ({
  [RSAA]: {
    endpoint: '/api/categories/',
      method: 'POST',
      body: JSON.stringify({category:category}),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        ADD_CATEGORIES_REQUEST, ADD_CATEGORIES_SUCCESS, ADD_CATEGORIES_FAILURE
      ]
  }
})

export const get_categories= () =>({
  [RSAA]:{
   endpoint: '/api/categories/',
      method: 'GET',
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       CATEGORIES_REQUEST, CATEGORIES_SUCCESS, CATEGORIES_FAILURE
      ]

  }
})

export const setCategoriesChanged= (bool) =>({
  type:CATEGORIES_CHANGED,
  bool
 }
)
