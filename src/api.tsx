import { dest_api } from "./target_config";

export const getFiltersByTitle = async (title = '') => {
  return fetch(dest_api + '/filters?' + new URLSearchParams({ title }), {
    method: "GET",
    credentials: "include",
  }).then((res) => res.json());
};
