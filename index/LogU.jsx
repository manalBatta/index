import { useState } from "react";
import "./App.css";
import { supabase } from "./App";
import { useNavigate } from "react-router-dom";
import { MySwal } from "./Profile";

export default function LogU() {
  const [signin, setSingin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //new user
  const signup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      error.message == "User already registered"
        ? setSingin(true)
        : alert(error);

      console.log(error.message);
    } else {
      console.log("new user created");
      console.log(data);
      insertNewUser(data.user.id, data.user.email);
      setSingin(true);
    }
  };

  const insertNewUser = async (id, email) => {
    const { data, error } = await supabase.from("users").insert({
      id: id,
      email: email,
    });
    if (error) {
      alert(error);
      console.log(error);
    } else {
      console.log("new user inserted");
      MySwal.fire({ title: "Happy to see a new Member" });
      console.log(data);
    }
  };
  const signinusign = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      alert(error);
    } else {
      console.log("signed in successfully ");

      console.log(data);
      setSingin(false);
      navigate("/profile");
    }
  };

  return (
    <>
      {/* <form
        onSubmit={(e) => {
          e.preventDefault();

          signin ? signinusign() : signup();
        }}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <br></br>
        <input type="submit" value={signin ? "signin" : "sign up"} />
      </form> */}

      <form
        className="bg text-center"
        onSubmit={(e) => {
          e.preventDefault();

          signin ? signinusign() : signup();
        }}>
        <div className="centered">
          <p className="firstLine">
            {" "}
            C&nbsp; H &nbsp; A &nbsp; T &nbsp; Y &nbsp; . &nbsp; S &nbsp; C{" "}
          </p>

          <p className="secondLine">The Simplest Comunecation Ever</p>

          <p>
            {" "}
            <input
              className="InputStyle"
              placeholder="Email When you are ready..        
                          "
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />{" "}
          </p>
          <p>
            {" "}
            <input
              className="InputStyle"
              placeholder="Password        
                          "
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />{" "}
          </p>
          <p>
            {" "}
            <input
              className="btn-sign"
              type="submit"
              value={signin ? "sign in" : "sign up"}
            />{" "}
          </p>
        </div>

        <div className="social-btn">
          <a href="#" title="Facebook">
            <i className="fa fa-facebook"></i>
          </a>
          <a href="#" title="Twitter">
            <i className="fa fa-twitter"></i>
          </a>
        </div>
      </form>
    </>
  );
}
