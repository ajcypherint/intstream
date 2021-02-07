import React from 'react'
import { createParent } from '../reducers/children'

export default ({ level, article, showChildren, field = 'match' }) => {
  // level: int
  // article: {title:str,id:int,match:list}
  const match = article[field] || [] // home page is the only page with match
  const id = article.id
  const title = article.title
  if (level > 0) {
    return (
      null
    )
  }
  if (level === 0) {
    return (
        <div>
        { match.length > 0
          ? <font className="hover"
              data-parent={JSON.stringify(createParent(id, match))}
              data-level={level}
              onClick={showChildren}>{match.length}</font>

          : <font >{match.length}</font>
      }
    </div>)
  }
}
