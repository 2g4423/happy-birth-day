'use strict';

import { CONFIG } from './config.js';

export function getWindowSize() {
  return {
    width: document.body.clientWidth,
    height: document.body.clientHeight
  };
}

export function getFontSize() {
  return document.body.clientWidth < CONFIG.breakPoint ? CONFIG.fontSize.sp : CONFIG.fontSize.pc;
}

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
