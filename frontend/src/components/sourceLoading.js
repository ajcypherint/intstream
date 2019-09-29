import React, { Component } from 'react';
export const SourceLoading = ({heading})=>{
  return (<div className="row" >
        <div className="col-sm-4"/>
        <div className="col-sm-4">
          <div className="container">
          <h1>{heading}</h1>
          <h3>Loading...</h3>
          </div> 
        </div> 
        <div className="col-sm-4"/>
      </div>
  )
}

