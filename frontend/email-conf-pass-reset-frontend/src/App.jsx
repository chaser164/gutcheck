import { Outlet, useNavigate } from "react-router-dom";

export default function App() {

  const navigate = useNavigate();

  return (
    <>
      <h1 className="title" onClick={() => navigate("/")}>GutCheck</h1>
      <Outlet />
    </>
  );
}
