export const setParams = function(url, params){
  if ( typeof params !== 'undefined'){
    url+='?'+params;
  }
  return url;
}
 
