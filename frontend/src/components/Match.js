import React from 'react'
import {createParent} from "../reducers/children"

export default ({level,article,showChildren}) => {
  //level: int
  //article: {title:str,id:int,match:list}
  let match = article.match || [] //home page is the only page with match
  let id = article.id
  let title = article.title
  if (level > 0){
    return (
      null
    )

  }
  if (level===0 ){
    return (
        <div>
        { match.length > 0  ?
          <font className="hover" 
              data-parent={JSON.stringify(createParent(id,match))} 
              data-level={level}
              onClick={showChildren}>{match.length}</font>:

           <font >{match.length}</font>
      }
    </div>)
  }
}
