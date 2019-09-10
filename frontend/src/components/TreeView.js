import React from 'react'
import { Tree, SampleTree } from 'react-lazy-paginated-tree';


export default (props) =>{

    return  <Tree nodes={SampleTree} usLocalState={true} />;
  
}
