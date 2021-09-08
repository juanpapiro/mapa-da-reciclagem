export const notNull = form => {
    let errors = [];
    if(form.nmFantazy === '' || form.nmFantazy === null){
        errors.push(['nmFantazy','Nome fantazia deve ser preenchido.']);     
    }
    if(form.doc === '' || form.doc === null){
        errors.push(['doc','Documento deve ser preenchido.']);     
    }
    if(form.zip === '' || form.zip === null){
        errors.push(['zip','Cep deve ser preenchido.']);     
    }
    if(form.street === '' || form.street == null){
        errors.push(['street','Nome da rua deve ser preenchido.']);     
    }
    if(form.number === '' || form.number == null){
        errors.push(['number','Número deve ser preenchido.']);     
    }
    if(form.neighborhood === '' || form.neighborhood == null){
        errors.push(['neighborhood','Bairro deve ser preenchido.']);     
    }
    if(form.city === '' || form.city === null){
        errors.push(['city','Cidade deve ser preenchido.']);     
    }
    if(form.state === '' || form.state === null){
        errors.push(['state','Estado deve ser preenchido.']);     
    }
    return errors;
}

export const validCpf = (cpf) => {
    debugger;
    let verify = [];
    cpf = cpf.replace(/\D/g, '');
    let arrayVerifyDig1 = [10, 9, 8, 7, 6, 5, 4, 3, 2];
    let arrayVerifyDig2 = [11, ...arrayVerifyDig1];
    let arrayMultiply = [];
    let arrayCpf = Array.from(cpf);
    if(arrayCpf.filter((num) => num === arrayCpf[0]).length === 11) return ['doc','Cpf inválido!'];
    arrayVerifyDig1.forEach((num, i) => arrayMultiply.push(num * arrayCpf[i]));
    let mod1 = (arrayMultiply.reduce((sum, num) => sum + num, 0) * 10) % 11 ;
    if ((mod1 === 10 || mod1 === 11) && parseInt(arrayCpf[9]) !== 0) return ['doc','Cpf inválido!'];
    arrayMultiply = [];
    arrayVerifyDig2.forEach((num, i) => arrayMultiply.push(num * arrayCpf[i]));
    let mod2 = (arrayMultiply.reduce((sum, num) => sum + num, 0) * 10) % 11;
    if ((mod2 === 10 || mod2 === 11) && parseInt(arrayCpf[10]) === 0) return verify;
    verify = (mod2 === parseInt(arrayCpf[10])) ? verify : ['doc','Cpf inválido!'];
    return verify;
}

export const validCnpj = (cnpj) => {
    debugger;
    let verify = []; //14.572.457/0001-85
    cnpj = cnpj.replace(/\D/g, '');
    let arrayCnpj = Array.from(cnpj);
    let arrayCnpjRevDv1 = Array.from(cnpj).reverse().splice(2, Array.from(cnpj).length);
    let arrayVerifyDv1 = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
    let arrayMultiply = arrayVerifyDv1.map((num, index) => num * arrayCnpjRevDv1[index])
    let modDv1 = (arrayMultiply.reduce((sum, num) => sum + num, 0)) % 11;
    if((modDv1 === 0 || modDv1 === 1) && parseInt(arrayCnpj[12]) !== 0) return ['doc', 'Cnpj inválido!'];
    if((11 - modDv1 !== parseInt(arrayCnpj[12]))) return ['doc', 'Cnpj inválido!'];
    let arrayVerifyDv2 = [...arrayVerifyDv1, 6];
    let arrayCnpjRevDv2 = Array.from(cnpj).reverse().splice(1, Array.from(cnpj).length);
    arrayMultiply = arrayVerifyDv2.map((num, index) => num * arrayCnpjRevDv2[index]);
    let modDv2 = (arrayMultiply.reduce((sum, num) => sum + num, 0)) % 11;
    if((modDv2 === 0 || modDv2 === 1) && parseInt(arrayCnpj[13]) !== 0) return ['doc', 'Cnpj inválido!'];
    verify = ((11 - modDv2 === parseInt(arrayCnpj[13]))) ? verify : ['doc', 'Cnpj inválido!'];
    return verify;
}

export const notNullLabels = (labels) => {
    let errors = [];
    labels.forEach(label => {
        if (label[1] === null || label[1] ==='') {
            errors.push([label[0], `Preenchimento obrigatório!`])
        }
    })
    return errors;
}

export const length = (labels) => {
    debugger;
    let errors = [];
    labels.forEach(label => {
        if (label[1].length < label[2]) {
            errors.push([label[0], 'Deve ter ao menos 6 dígitos.'])
        }
    })
    return errors;
}

export const equalsCredentials = (values) => {
    let errors = [];
    debugger;
    if(values[0][1] !== values[1][1]) {
        errors.push([values[0][0], values[0][2]])
        errors.push([values[1][0], values[0][2]])
    }
    return errors;
}

export const isEmail = (email) => {
    let errors = [];
    debugger;
    if(!(email[0][1].includes('@') && email[0][1].includes('.')) ||
       !((email[0][1].includes('.')) && (email[0][1].indexOf('.') < email[0][1].length -2))) {
        errors.push([email[0][0], 'Ops... não parece ser um e-mail.'])
    }
    return errors;
}