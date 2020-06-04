import * as classif from "../actions/classification"


const createEntry = (mlmodel,target,articleId)=>{
  return {
    mlmodel:mlmodel,
    target:target,
    article:articleId
  }

}

const add = (id, Entry,mapping)=>{
  let new_mapping = {
    ...mapping,
    [id]:{
      ...Entry
    }
  }
  return new_mapping
}

const remove = (id, mapping) => {
  let new_mapping = {
    ...mapping
  }
  delete new_mapping[id]
  return new_mapping

}

const addResults = (payloadResults, classif)=>{
  //payloadResults: list[createEntry]
  //classif original state
  // does not change state
  let new_classif={...classif}
  for(let i = 0;i<payloadResults.length;i++){
    let entry = {...payloadResults[i]}
    new_classif= add(payloadResults[i].article_id,
                          entry,
                             new_classif)
  }
  return new_classif

}
export const initialState = {

  classif:{},
  counts:{total:0,true_count:0,false_count:0},
  totalLoading:false,
  errors: {},

}

export default (state=initialState, action) => {
  switch(action.type) {
    case classif.GET_TOTAL_CLASSIFICATIONS_REQUEST:
      {
        return {
          ...state,
          totalLoading:true,
          errors:{}
        }
      }
 
    case classif.GET_TOTAL_CLASSIFICATIONS:
      {
        let new_classif = addResults(action.payload.classif, state.classif)       
        return {
          ...state,
          classif:new_classif,
          totalLoading:false,
          errors:{}
        }

      }
    case classif.GET_CLASSIFICATIONS_FAILURE:
      {
        return {
          ...state,
          classif:{},
          totalLoading:false,
          errors: action.payload.response || {'non_field_errors': action.payload.statusText},
        }
      }

    case classif.DEL_CLASSIFICATION_SUCCESS:
      {
        let new_classif = remove(action.meta.id, state.classif)
        return {
          ...state,
          classif:new_classif,
          errors:{}
        }

      }
    case classif.SET_CLASSIFICATION_SUCCESS:
      {
        //todo
        let new_classif = addResults([action.payload], state.classif)       
        return {
          ...state,
          classif:new_classif,
          totalLoading:false,
          errors:{}
        }
        return state
        
      }
    case classif.SET_CLASSIFICATION_FAILURE:
    case classif.DEL_CLASSIFICATION_FAILURE:
      {
        //todo
        return {
          ...state,
          errors:action.payload.response || {'non_field_errors': action.payload.statusText}
        }
        
      }
    case classif.SET_COUNTS:
      {
        return {
          ...state,
          counts:{...action.payload},
          errors:{}
        }

      }
    case classif.CLEAR:
      {
        return {
          ...initialState
        }

      }
 
    default:
      return state

  }
}

export function classifications(state) {
    return  state.classif
}

export function errors(state) {
  return state.errors
}

export function counts(state){
  return state.counts
}
