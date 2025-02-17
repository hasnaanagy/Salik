import React, { useState } from "react";
import { useDispatch } from "react-redux";
import authService from "./authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Signup = () => {
  const [userData, setUserData] = useState({
    phoneNumber: "",
    nationalId: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.password !== userData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }


    try {
      const data = await authService.registerUser(userData);
      alert(data.message);
    } catch (error) {
      alert(error); // عرض الرسالة القادمة من الـ API

    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={userData.phoneNumber}
        onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
        placeholder="Phone Number"
      />
      <input
        type="text"
        value={userData.nationalId}
        onChange={(e) => setUserData({ ...userData, nationalId: e.target.value })}
        placeholder="National ID"
      />

      {/* حقل كلمة المرور */}
      <div className="passwordContainer">
        <input
          type={showPassword ? "text" : "password"}
          value={userData.password}
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          placeholder="Password"
        />
        <FontAwesomeIcon
          icon={showPassword ? faEyeSlash : faEye}
          onClick={() => setShowPassword(!showPassword)}
          className="eyeIcon"
        />
      </div>

      {/* حقل تأكيد كلمة المرور */}
      <div className="passwordContainer">
        <input
          type={showConfirmPassword ? "text" : "password"}
          value={userData.confirmPassword}
          onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
          placeholder="Confirm Password"
        />
        <FontAwesomeIcon
          icon={showConfirmPassword ? faEyeSlash : faEye}
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="eyeIcon"
        />
      </div>

      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;