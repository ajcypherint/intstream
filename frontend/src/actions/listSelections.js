
export const CLEAR = '@@sourceSelections/CLEAR';
export const PAGE = '@@sourceSelections/PAGE';
export const ORDER_COL = '@@sourceSelections/ORDER_COL';
export const ORDER_DIR = '@@sourceSelections/ORDER_DIR';

export const clear = ()=>{
  return {
    type:CLEAR,
  }
}

export const setPage = (data)=>{
  return {
    type:PAGE,
    payload:data
  }
}

export const setOrderCol = (data)=>{
  return {
    type:ORDER_COL,
    payload:data
  }
}

export const setOrderDir= (data)=>{
  return {
    type:ORDER_DIR,
    payload:data
  }
}


