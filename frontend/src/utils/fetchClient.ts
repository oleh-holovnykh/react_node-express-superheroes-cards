/* eslint-disable @typescript-eslint/no-explicit-any */

import { HeroData } from 'types/hero';

const PRODUCTION_URL = 'https://superheroes-18i0.onrender.com/heroes';
const LOCAL_URL = 'http://localhost:5500/heroes';

const RENDER_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_URL : LOCAL_URL;

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data: any = null,
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  return fetch(RENDER_URL + url, options)
    .then(response => response.json())
    .catch((error) => `some error ${error.message}`);
}

export const client = {
  get: (url: string) => request<HeroData[]>(url),
  post: <T>(url: string, data: any) => request<T>(url, 'POST', data),
  patch: <T>(url: string, data: any) => request<T>(url, 'PATCH', data),
  delete: (url: string) => request(url, 'DELETE'),
};
