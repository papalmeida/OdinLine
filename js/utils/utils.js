/**
 * @returns {User}
 */
function getUser() {
    if (localStorage.getItem('user')) 
        return JSON.parse(localStorage.getItem('user'));
    else 
        return null;
}