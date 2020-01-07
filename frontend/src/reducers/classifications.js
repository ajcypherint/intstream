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
  let new_classif={}
  for(let i = 0;i<payloadResults.length;i++){
    let entry = {...payloadResults[i]}
    new_classif= add(payloadResults[i].article,
                          entry,
                             classif)
  }
  return new_classif

}
const initialState = {

  classif:{},
  loading:false,
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
          classif:{},
          loading:false,
          totalLoading:false,
          errors: action.payload.response || {'non_field_errors': action.payload.statusText},
        }
      }

    case classif.SET_CLASSIFICATION_REQUEST:
      {
        //todo
        return state
        
      }
    case classif.SET_CLASSIFICATION_SUCCESS:
      {
        //todo
        return state
        
      }
    case classif.SET_CLASSIFICATION_FAILURE:
      {
        //todo
        return state
        
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

