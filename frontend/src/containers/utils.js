import React from 'react';
import {
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam,
} from 'use-query-params';

// withQueryParams.jsx
export const withQueryParams = (paramConfigMap, mapParamsToProps) => (WrappedComponent) => {
  const Component = (props) => {
    const [query, setQuery] = useQueryParams(paramConfigMap);
    return <WrappedComponent {...mapParamsToProps(query, setQuery, props)} {...props} />;
  };
  Component.displayName = `withQueryParams(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'})`;
  return Component;
};
