import { Outlet } from "react-router-dom";

export default function App() {

  return (
    <>
    <h1>GutCheck</h1>
      <Outlet />
      {/* add 'context = ' as an attribute if you want... */}
    </>
  );
}
