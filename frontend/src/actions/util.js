import {PAGINATION} from "../util/util"

export const setParamsParent = function(url, params, parent){
  url+="?article_match_id="+parent
  if ( typeof params !== 'undefined'){
    url+=params;
  }
  return url;
}
 
export const setParams = function(url, params){
  if ( typeof params !== 'undefined'){
    url+='?'+params;
  }
  return url;
}
export const  getAll = (get)=>(putAll)=>(url, params) =>{
  return async(dispatch, getState) => {
      let extra_params = params || ''
      let totalresp = await dispatch(get(url,extra_params))
      if (totalresp.error) {
      //  // the last dispatched action has errored, break out of the promise chain.
        throw new Error("Promise flow received action error", totalresp);
       }
      let allModels = []
      let total = totalresp.payload.count
      let pages = Math.ceil(total / PAGINATION)
      //ACTIVE, duh time for bed.
      for ( let i=1; i <= pages; i++){
       let actionResponse = await dispatch(get(url,extra_params+'&page='+i));
      //
       if (actionResponse.error) {
         // the last dispatched action has errored, break out of the promise chain.
         throw new Error("Promise flow received action error", actionResponse);
       }

       allModels = allModels.concat(actionResponse.payload.results)
        
      }

      // OR resolve another asyncAction here directly and pass the previous received payload value as argument...
      return await dispatch(putAll(allModels, total));
    }
}


