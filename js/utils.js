'use strict';

import { CONFIG } from './config.js';

export function getScreenSize() {
  return {
    width: document.body.clientWidth,
    height: document.body.clientHeight
  };
}

export function getFontSize() {
  return document.body.clientWidth < CONFIG.breakPoint.pc ? CONFIG.fontSize.sp : CONFIG.fontSize.pc;
}

export function getConfettiProps() {
  const width = document.body.clientWidth;

  const angle = width < 800 ? 80 : 60;

  const x = width < CONFIG.breakPoint.pc ? 0 : 0.2;
  const y = 0.5;

  return {
    angle,
    origin: { x, y }
  };
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
