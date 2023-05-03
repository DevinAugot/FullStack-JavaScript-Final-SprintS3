function validatePassword(password){
    const validLength = password.length >= 8
    const containsLetter = /[a-zA-z]/g.test(password)
    const containsNumber = /[0-9]/g.test(password)
    return validLength && containsLetter && containsNumber
}
function validateUser(user){
    const validLength = user.length >=3   
    return validLength
}
function validateEmail(email){
    const validFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    return validFormat
}
function validateSearch(test){
    const validQuery = /^[a-zA-Z0-9.,_ \-]*$(?![^*]*\*)/.test(test);
    return validQuery
}
module.exports = {validatePassword,validateUser,validateEmail,validateSearch}