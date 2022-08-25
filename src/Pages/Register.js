import React, { useRef, useState, useEffect } from "react";
import * as FaIcons from "react-icons/fa";
import { Link } from "react-router-dom";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSucess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    console.log(result);
    console.log(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    console.log(result);
    console.log(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //button hacking? hmm...
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    console.log("You submitted a new account!", user , pwd);
    setSucess(true);
  };

  return (
    <section className="registrationForm">
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1>Register</h1>
      <form className="registrationForm" onSubmit={handleSubmit}>
        <label htmlFor="username">
          Username:
          <span className={validName ? "valid" : "hide"}>
            <FaIcons.FaCheckCircle />
          </span>
          <span className={validName || !user ? "hide" : "invalid"}>
            <FaIcons.FaTimesCircle />
          </span>
        </label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          autoCapitalize="off"
          onChange={(e) => setUser(e.target.value)}
          required
          aria-invalid={validName ? "false" : "true"}
          aria-describedby="uidnote"
          onFocus={() => setUserFocus(true)}
          onBlur={() => setUserFocus(false)}
        />
        <p
          id="uidnote"
          className={
            userFocus && user && !validName ? "instructions" : "offscreen"
          }
        >
          <FaIcons.FaInfoCircle />
          4 to 24 characters. <br />
          Must begin with a letter. <br />
          Letters, Numbers, underscores, hypens are allowed.
        </p>
        <label htmlFor="password">
          Password:
          <span className={validPwd ? "valid" : "hide"}>
            <FaIcons.FaCheckCircle />
          </span>
          <span className={validPwd || !pwd ? "hide" : "invalid"}>
            <FaIcons.FaTimesCircle />
          </span>
        </label>
        <input
          autoComplete="new-password"
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          required
          aria-invalid={validPwd ? "false" : "true"}
          aria-describedby="pwdnote"
          onFocus={() => setPwdFocus(true)}
          onBlur={() => setPwdFocus(false)}
        />
        <p
          id="pwdnote"
          className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
        >
          <FaIcons.FaInfoCircle />
          8 to 24 characters. <br />
          Must include at least one uppercase and lowercase letter, one number,
          and one symbol.
          <br />
          Allowed special characters
          <span aria-label="exclamation mark">!</span>
          <span aria-label="at symbol">@</span>
          <span aria-label="hashtag">#</span>
          <span aria-label="dollar sign">$</span>
          <span aria-label="percent symbol">%</span>
        </p>

        <label htmlFor="confirm_pwd">
          Confirm Password:
          <span className={validMatch && matchPwd ? "valid" : "hide"}>
            <FaIcons.FaCheckCircle />
          </span>
          <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
            <FaIcons.FaTimesCircle />
          </span>
        </label>
        <input
          autoComplete="new-password"
          type="password"
          id="confirm_pwd"
          onChange={(e) => setMatchPwd(e.target.value)}
          required
          aria-invalid={validMatch ? "false" : "true"}
          aria-describedby="confirmnote"
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
        />
        <p
          id="confirmnote"
          className={matchFocus && !validMatch ? "instructions" : "offscreen"}
        >
          <FaIcons.FaInfoCircle />
          Passwords must match.
        </p>
        <button
          disabled={!validName || !validPwd || !validMatch ? true : false}
        >
          Create Account
        </button>
      </form>
      <p>
        Already registered?
        <br />
        <span className="line">
          <Link to="/login">
            <u>Sign In</u>
          </Link>
        </span>
      </p>
    </section>
  );
};
