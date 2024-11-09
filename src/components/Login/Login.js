import { useState, useEffect } from "react";
import Logo from "../../assests/Images/imly-logo-new.jpg";
import image from "../../assests/Images/imly-two.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { jwtDecode } from "jwt-decode";
import {
  CITIES_API,
  COUNTRIES_API,
  GETALLSTORES_API,
  LOGIN,
  STATES_API,
} from "../../Constants/apiRoutes";
import LoadingAnimation from "../Loading/LoadingAnimation";

const Login = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [isStoreDataLoading, setIsStoreDataLoading] = useState(false);

  // Fetch data from the APIs if not present in local storage
  const fetchApiData = async () => {
    const storedCitiesData = localStorage.getItem("citiesData");
    const storedStatesData = localStorage.getItem("statesData");
    const storedCountriesData = localStorage.getItem("countriesData");

    if (!storedCitiesData || !storedStatesData || !storedCountriesData) {
      try {
        const resCities = storedCitiesData
          ? JSON.parse(storedCitiesData)
          : await fetch(CITIES_API).then((res) => res.json());
        const resStates = storedStatesData
          ? JSON.parse(storedStatesData)
          : await fetch(STATES_API).then((res) => res.json());
        const resCountries = storedCountriesData
          ? JSON.parse(storedCountriesData)
          : await fetch(COUNTRIES_API).then((res) => res.json());

        // Store in localStorage
        localStorage.setItem("citiesData", JSON.stringify(resCities));
        localStorage.setItem("statesData", JSON.stringify(resStates));
        localStorage.setItem("countriesData", JSON.stringify(resCountries));
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    }
  };
  const fetchAndStoreStoresData = async () => {
    setIsStoreDataLoading(true);
    const params = {
      pageNumber: 1,
      pageSize: 1000,
    };
  
    try {
      const storeResponse = await fetch(
        `${GETALLSTORES_API}?${new URLSearchParams(params).toString()}`
      );
      const storesData = await storeResponse.json();
      const stores = storesData.Stores || [];
      localStorage.setItem("storesData", JSON.stringify(stores));
      
      // Dispatch an event to notify that store data is ready
      window.dispatchEvent(new Event('storeDataReady'));
      
      return stores;
    } catch (error) {
      console.error("Error fetching store data:", error);
      return [];
    } finally {
      setIsStoreDataLoading(false);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: userName, Password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        const { token } = data;

        const decodedToken = jwtDecode(token);
        const roleID = decodedToken.RoleID;
        const userID = decodedToken.UserID;

        localStorage.setItem("UserID", userID);

        login(token, roleID, userID);

        // Wait for both data fetching operations to complete
        await Promise.all([fetchApiData(), fetchAndStoreStoresData()]);

        // Now that all data is loaded, navigate to the dashboard
        navigate("/dashboard");
      } else {
        console.error("Login failed:", data.message);
        setError(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="flex min-h-full p-0 m-0 flex-1 bg-white">
        {(isLoading || isStoreDataLoading) && <LoadingAnimation />}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <img alt="Your Company" src={Logo} className="h-20 w-auto" />
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Admin Login
              </h2>
            </div>

            <div className="mt-10">
              <div>
                <form className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      User Name
                    </label>
                    <div className="mt-2">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        onChange={(e) => setUserName(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-4"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-4"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 pl-4"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-3 block text-sm leading-6 text-gray-700"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm leading-6"></div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-custom-darkblue hover:bg-custom-lightblue hover:text-gray-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={(e) => handleLogin(e)}
                      // Disable the button when loading
                    >
                      {isLoading || isStoreDataLoading
                        ? "Please wait..."
                        : "Sign in"}
                    </button>
                    {error && <p className="p-2 text-red-500">{error}</p>}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block h-screen">
          <img
            alt=""
            src={image}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </>
  );
};

export default Login;
