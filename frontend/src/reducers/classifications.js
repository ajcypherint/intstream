import * as classif from "actions/classifications"

const createEntry = (id,data={})=>{
  
  return {
    id:id,
    data:data
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
const initialState = {

  classif:{},
  loading:false,
  errors: {},

}

export default (state=initialState, action) => {
  switch(action.type) {
    case classif.GET_CLASSIFICATIONS_REQUEST:
      {
        return {
          ...state,
          loading:true
        }
      }

    case classif.GET_TOTAL_CLASSIFICATIONS:
      {
        return {
          classif:action.payload,
          loading:false,
          errors:{}
        }

      }
    case classif.GET_CLASSIFICATIONS_SUCCESS:
      {
        let new_classif={}
        for(let i = 0;i<action.payload.results.length;i++){
          let entry = createEntry(action.payload.results[i].id,
                                       action.payload.results[i])
          new_classif= add(action.payload.results[i].id,
                                action.payload.results[i],
                                   state.classif)
        }
        
        return {
          classif:new_classif,
          loading:false,
          errors:{},
        }
      }
    case classif.GET_CLASSIFICATIONS_FAILURE:
      {
        return {
          classif:{},
          loading:false,
          errors: action.payload.response || {'non_field_errors': action.payload.statusText},
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


