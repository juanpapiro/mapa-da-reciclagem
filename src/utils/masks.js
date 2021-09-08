
export const cpfMask = value => {
    return value
      .replace(/\D/g, '') // substitui qualquer caractere diferente de numérico por vazio
      .replace(/(\d{3})(\d)/, '$1.$2') // captura 3 números e insere ponto após o terceiro número
      .replace(/(\d{3})(\d)/, '$1.$2') // captura 3 números e insere ponto após o terceiro número
      .replace(/(\d{3})(\d{1,2})/, '$1-$2') // captura 3 números e insere hífen após o terceiro número
      .replace(/(-\d{2})\d+?$/, '$1') // captura 2 últimos numeros
  }

  export const cnpjMask = value => {
    return value
      .replace(/\D/g, '') // substitui qualquer caractere diferente de numérico por vazio
      .replace(/(\d{2})(\d)/, '$1.$2') // captura 2 números e insere ponto após o segundo número
      .replace(/(\d{3})(\d)/, '$1.$2') // captura 3 números e insere ponto após o terceiro número
      .replace(/(\d{3})(\d)/, '$1/$2') // captura 3 números e insere barra após o terceiro número
      .replace(/(\d{4})(\d{1,2})/, '$1-$2') // captura 4 números e insere hífen após o quarto número
      .replace(/(-\d{2})\d+?$/, '$1') // captura 2 últimos numeros
  }

  export const cellMask = value => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  export const phoneMask = value => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  export const zipMask = value => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{1})(\d)/, '$1$2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')
  }

  export const numMask = value => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{6})(\d)/, '$1')
      .replace(/(-\d{1})\d+?$/, '$1')
  }

  export const moneyMask = value => {
    if(value.length > 6){
      return value.slice(0,value.indexOf(',')+3)
    } else {
      return value
        .replace(/\D/g, '')
        .replace(/(\d{1})(\d)/, '$1$2')
        .replace(/(\d{1})(\d{1,2})$/,"$1,$2")
    }
  }