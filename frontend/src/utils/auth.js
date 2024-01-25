export const saveTokenToLocalStorage = (token) => {
    localStorage.setItem('token', token);
  };
  
  export const getTokenFromLocalStorage = () => {
    return localStorage.getItem('token');
  };