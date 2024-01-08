import axios from "axios";

export const api = axios.create({
  baseURL: "https://gutcheck-chaser164.pythonanywhere.com/api/v1/",
});


// for deploying:
// https://gutcheck-chaser164.pythonanywhere.com/api/v1/
// for dev:
// http://127.0.0.1:8000/api/v1/