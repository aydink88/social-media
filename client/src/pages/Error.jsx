import { Link } from "react-router-dom";

function Error() {
  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-6 text-center">
          <h1 className="display-1">ಥ﹏ಥ</h1>
          <p className="lead">404 Page not found.</p>
          <Link to="/">Back to HomePage</Link>
        </div>
      </div>
    </div>
  );
}

export default Error;
