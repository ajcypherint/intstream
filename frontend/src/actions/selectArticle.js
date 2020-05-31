import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import  URL  from  'url-parse'
import {setParams} from './util'

export const GET_ARTICLES_REQUEST = '@@selectArticles/GET_ARTICLES_REQUEST';
export const GET_ARTICLES_SUCCESS = '@@selectArticles/GET_ARTICLES_SUCCESS';
export const GET_ARTICLES_FAILURE = '@@selectArticles/GET_ARTICLES_FAILURE';

export const CLEAR = '@@selectArticles/CLEAR';

export const clearArticles= ()=>{
  return {
    type:CLEAR,

  }
}

export const getArticle= (url, id)=>{
  // filters - list[string]
  url = url+"?id="+id
  return {
  [RSAA]:{
   endpoint: url,
    fetch:fetch,
      method: 'GET',
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        {type:GET_ARTICLES_REQUEST,
          meta:{id:id}
        },
        {type:GET_ARTICLES_SUCCESS, 
          meta:{id:id}
        },
        {type:GET_ARTICLES_FAILURE,
          meta:{id:id}
        }
      ]

  }
}
}


