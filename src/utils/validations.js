function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarTelefone(celular) {
  const regex = /^(\(?\d{2}\)?\s?)?(9\d{4})[-.\s]?(\d{4})$/;
  return regex.test(celular);
}

function validarCEP(cep) {
    if (typeof cep !== 'string') return false
    
    const regex = /^\d{5}-?\d{3}$/
    return regex.test(cep)
}

module.exports = {
    validarEmail,
    validarTelefone,
    validarCEP
}