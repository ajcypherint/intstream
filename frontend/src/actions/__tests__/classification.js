import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../classification'
import {getAllClassifications} from '../classification'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware';
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('classification actions', () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })
  it('getarticles', () => {
    const store = mockStore({auth:{access:"xxx"}})
    fetchMock.get('/api', {
      body: { articles: 1 },
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.GET_ARTICLES_REQUEST},
      { type: actions.GET_ARTICLES_SUCCESS, payload: { articles: 1 } }
    ]

    return store.dispatch(actions.getArticles("/api")).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('clear', () => {
    let RET =  {
        type:actions.CLEAR,
      }

    let resp = actions.clear()
    expect(resp).toEqual(RET)
  })

  it('set counts', () => {
    let total = 1
    let trueCount = 1
    let falseCount = 1
    let RET =  {
      type:actions.SET_COUNTS,
      payload:{true_count:trueCount,
        false_count:falseCount,
        total:total
        }
    }

    let resp = actions.setCounts(total, trueCount, falseCount)
    expect(resp).toEqual(RET)
  })

  it('get classifications', () => {
    const store = mockStore({auth:{access:"xxx"}})
    fetchMock.get('/api', {
      body: { classif: 1 },
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.GET_CLASSIFICATIONS_REQUEST},
      { type: actions.GET_CLASSIFICATIONS_SUCCESS, payload: { classif: 1 } }
    ]

    return store.dispatch(actions.getClassifications("/api")).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it("get counts", () => {
    const store = mockStore({auth:{access:"xxx"}})
    let mlmodel = 1
    let tapi = actions.BASE_URL+"?mlmodel_id="+mlmodel+"&target=true"

    fetchMock.getOnce("/api/classifications/?mlmodel_id=1&target=true", {
      body: { count: 1 },
      headers: { 'content-type': 'application/json' }
    })

    fetchMock.getOnce("/api/classifications/?mlmodel_id=1&target=false", {
      body: { count: 1 },
      headers: { 'content-type': 'application/json' }
    })
 
    const expectedActions = [
      { type: actions.GET_CLASSIFICATIONS_REQUEST},
      { type: actions.GET_CLASSIFICATIONS_SUCCESS, payload:{count:1} },
      { type: actions.GET_CLASSIFICATIONS_REQUEST},
      { type: actions.GET_CLASSIFICATIONS_SUCCESS, payload:{count:1} },
       {
        type:actions.SET_COUNTS,
        payload:{true_count:1,
          false_count:1,
          total:2
          }
       }

    ]

    return store.dispatch(actions.getCounts(mlmodel)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    }) 
  })
  it('delete classifications', () => {
    const store = mockStore({auth:{access:"xxx"}})
    const id = 1
    const article_id = 1
    fetchMock.deleteOnce("/api/classifications/1/", {
      body: { page:1},
      headers: { 'content-type': 'application/json' }
     })

    const expectedActions = [
        { type: actions.DEL_CLASSIFICATION_REQUEST, meta:{id:article_id}},
        { type: actions.DEL_CLASSIFICATION_SUCCESS, meta:{id:article_id}, payload: {page:1} }
     ]

    return store.dispatch(actions.deleteClassification(id, article_id)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it("delete classification load counts", () => {
    const store = mockStore({auth:{access:"xxx"}})
    let mlmodel = 1
    let article_id = 1
    let id = 1

    fetchMock.deleteOnce("/api/classifications/1/", {
      body: { page: 1 },
      headers: { 'content-type': 'application/json' }
    })
    fetchMock.getOnce("/api/classifications/?mlmodel_id=1&target=true", {
      body: { count: 1 },
      headers: { 'content-type': 'application/json' }
    })

    fetchMock.getOnce("/api/classifications/?mlmodel_id=1&target=false", {
      body: { count: 1 },
      headers: { 'content-type': 'application/json' }
    })
 
    const expectedActions = [
      { type: actions.DEL_CLASSIFICATION_REQUEST, meta:{id:article_id}},
      { type: actions.DEL_CLASSIFICATION_SUCCESS, meta:{id:article_id}, payload: {page:1} },
      { type: actions.GET_CLASSIFICATIONS_REQUEST},
      { type: actions.GET_CLASSIFICATIONS_SUCCESS, payload:{count:1} },
      { type: actions.GET_CLASSIFICATIONS_REQUEST},
      { type: actions.GET_CLASSIFICATIONS_SUCCESS, payload:{count:1} },
       {
        type:actions.SET_COUNTS,
        payload:{true_count:1,
          false_count:1,
          total:2
          }
       }

    ]

    return store.dispatch(actions.deleteClassificationLoadCounts(id, article_id, mlmodel)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    }) 
  })

  it('set classifications', () => {
    const store = mockStore({auth:{access:"xxx"}})
    let mlmodel = 1
    let article = 1
    let target = true
    fetchMock.postOnce("/api/classifications/", {
      body:{
        article_id:article,
        mlmodel_id:mlmodel,
        target:target
        },
      headers: { 'content-type': 'application/json' }
     })

    const expectedActions = [
        { type: actions.SET_CLASSIFICATION_REQUEST },
        { type: actions.SET_CLASSIFICATION_SUCCESS,  payload: {
          article_id:article,
          mlmodel_id:mlmodel,
          target:target
          }}
     ]

    return store.dispatch(actions.setClassification(mlmodel, article, target)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it("set classification load counts", () => {
    const store = mockStore({auth:{access:"xxx"}})
    let mlmodel = 1
    let article = 1
    let target = true
    
    fetchMock.postOnce("/api/classifications/", {
      body:{
        article_id:article,
        mlmodel_id:mlmodel,
        target:target
        },
      headers: { 'content-type': 'application/json' }
     })
    fetchMock.getOnce("/api/classifications/?mlmodel_id=1&target=true", {
      body: { count: 1 },
      headers: { 'content-type': 'application/json' }
    })

    fetchMock.getOnce("/api/classifications/?mlmodel_id=1&target=false", {
      body: { count: 1 },
      headers: { 'content-type': 'application/json' }
    })
 
    const expectedActions = [
      { type: actions.SET_CLASSIFICATION_REQUEST },
      { type: actions.SET_CLASSIFICATION_SUCCESS,  payload: {
        article_id:article,
        mlmodel_id:mlmodel,
        target:target
        }},
      { type: actions.GET_CLASSIFICATIONS_REQUEST},
      { type: actions.GET_CLASSIFICATIONS_SUCCESS, payload:{count:1} },
      { type: actions.GET_CLASSIFICATIONS_REQUEST},
      { type: actions.GET_CLASSIFICATIONS_SUCCESS, payload:{count:1} },
       {
        type:actions.SET_COUNTS,
        payload:{true_count:1,
          false_count:1,
          total:2
          }
       }
     ]

    return store.dispatch(actions.setClassificationLoadCounts(mlmodel, article, target)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })

  })
  it('total Classifications', () => {
    let data = {test:1}
    let total = 1
    let payload= {classif:data,totalCount:total}
    let RET =  {
      type:actions.GET_TOTAL_CLASSIFICATIONS,
      payload:payload
      }
    let resp = actions.totalClassifications(data, total)
    expect(resp).toEqual(RET)
  })

  it('total Classification request', () => {
    let RET =  {
      type:actions.GET_TOTAL_CLASSIFICATIONS_REQUEST,
      }
    let resp = actions.totalClassificationsRequest()
    expect(resp).toEqual(RET)
  })

 
  it("get article params", () => {
    let articles = [1]
    let model = 1
    let resp = actions.getArticleParams(articles, model)
    expect(resp).toBe("mlmodel_id=1&article_id_in=1")
  })

  it("getarticlesClassif", () => {
    const store = mockStore({auth:{access:"xxx"}})
    fetchMock.get('/api/articles', {
      body: { results:[{id: 1}], count:1},
      headers: { 'content-type': 'application/json' }
    })
    fetchMock.get("/api/classifications/?mlmodel_id=1&target=true", {
      body: { results:[{id: 1}], count:1},
      headers: { 'content-type': 'application/json' }
    })

    fetchMock.get("/api/classifications/?mlmodel_id=1&target=false", {
      body: { results:[{id: 1}], count:1},
      headers: { 'content-type': 'application/json' }
    })
    fetchMock.get('/api/classifications/?mlmodel_id=1&article_id_in=1', {
      body: { results:[{id: 1}], count:1},
      headers: { 'content-type': 'application/json' }
    })
    fetchMock.get('/api/classifications/?mlmodel_id=1&article_id_in=1&page=1', {
      body: { results:[{id: 1}], count:1},
      headers: { 'content-type': 'application/json' }
    })



    const expectedActions = [
      { type: actions.GET_ARTICLES_REQUEST},
      { type: actions.GET_ARTICLES_SUCCESS, payload: { count:1,results:[{id:1}] } },
      { type: actions.GET_CLASSIFICATIONS_REQUEST},
      { type: actions.GET_CLASSIFICATIONS_SUCCESS, payload:{count:1,results:[{id:1}]} },
      { type: actions.GET_CLASSIFICATIONS_REQUEST},
      { type: actions.GET_CLASSIFICATIONS_SUCCESS, payload:{count:1, results:[{id:1}]} },
       {
        type:actions.SET_COUNTS,
        payload:{true_count:1,
          false_count:1,
          total:2
          }
       },
      {
        type:actions.GET_TOTAL_CLASSIFICATIONS_REQUEST,
      },
      { type: actions.GET_CLASSIFICATIONS_REQUEST},
      { type: actions.GET_CLASSIFICATIONS_SUCCESS, payload:{count:1,results:[{id:1}] }},
      { type: actions.GET_CLASSIFICATIONS_REQUEST},
      { type: actions.GET_CLASSIFICATIONS_SUCCESS, payload:{count:1,results:[{id:1}] }},
 
      {
          type:actions.GET_TOTAL_CLASSIFICATIONS,
          payload:{classif:[{id:1}],totalCount:1}
        }
    ]
    return store.dispatch(actions.getArticlesClassif(1)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })



  })
})
