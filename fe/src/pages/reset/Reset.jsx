import {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "./reset.scss";
import axios from "axios";

const Reset = () => {
  const [input, setInput] = useState({
    email: "",
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput((prev) => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      let res = await axios.post(
        "http://localhost:2000/auth/forgot-password",
        input
      );
      alert(res.data.msg);
      console.log(res);
    } catch (error) {
      console.log(error.response.data.msg);
      setError(error.response.data.msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="right">
          <h1>Reset password</h1>
          <form>
            <input
              type="text"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />

            {error && error}
            <button disabled={isSubmitting} onClick={handleClick}>
              Send Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;
