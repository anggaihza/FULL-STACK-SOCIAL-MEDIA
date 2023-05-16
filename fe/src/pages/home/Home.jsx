import {useContext} from "react";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";
import {AuthContext} from "../../context/authContext";

const Home = () => {
  const {currentUser} = useContext(AuthContext);
  const access = currentUser.status === "verified";
  return (
    <div className="home">
      <Share />
      {access ? <Posts /> : null}
    </div>
  );
};

export default Home;
