import { Link } from "react-router-dom";

export default function HomePage() {

  return (
    <>
      <h3>The human-run misinformation reporter</h3>
      <br />
      <Link to="/privacy">Privacy Policy</Link>
    </>
  );
}
