'use strict';

export const getUrlQueries = () => {
  const result = {};
  const param = window.location.search.slice(1);

  if (!param) {
    return result;
  }

  const queries = param.split('&');
  queries.forEach((query) => {
    const [key, value] = query.split('=');
    result[key] = decodeURI(value);
  });

  return result;
};
