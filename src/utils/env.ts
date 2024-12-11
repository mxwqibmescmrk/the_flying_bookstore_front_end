export const SITE_NAME = "The Flying Bookstore 📚"
export const port = (process.env.NEXT_PUBLIC_API_URL ?  process.env.NEXT_PUBLIC_API_URL : "http://localhost:8080");
export const headerAxios = {
  'ngrok-skip-browser-warning': '1',
}
// export const port =  "http://localhost:8080"; // TODO undo thí