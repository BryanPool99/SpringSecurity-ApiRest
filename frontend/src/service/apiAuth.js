const BASE_URL = "http://localhost:8081";
export const apiAuth = {
  getToken : () => {
    // Obtener el token del localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      // Manejar la situación si el token no está presente
      throw new Error("Token not found in localStorage");
    }
    return token;
  },
  signUp: async (signUpData) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during sign up:", error);
      throw error;
    }
  },

  signIn: async (signInData) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signInData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during sign in:", error);
      throw error;
    }
  },
};
export default apiAuth;