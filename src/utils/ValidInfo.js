
export const existParam = (param) => {
    if (param !== null && param !== '') {
        return true;
    }
    return false;
}

export const length = (param, size) => {
    if (param.length >= size) {
       return true;
    }
    return false;
}

export const isEmail = (email) => {
    debugger;
    if(email.includes('@') && email.includes('.') &&
      ((email.includes('.')) && (email.indexOf('.') < email.length -2))) {
        return true
    }
    return false;
}