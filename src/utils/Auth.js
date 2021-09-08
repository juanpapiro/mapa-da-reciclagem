
export const auth = () => {
    if(localStorage.getItem('idUser') ||
       localStorage.getItem('email') ||
       localStorage.getItem('token')) {
           return true;
       } else {
           return false;
       }
}

export const logout = () => {
    localStorage.removeItem('idUser');
    localStorage.removeItem('email');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.replace('/');
}