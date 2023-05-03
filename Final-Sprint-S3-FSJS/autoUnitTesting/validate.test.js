const validate = require('./validate')


//Password
test("return false given an empty string",()=>{
    expect(validate.validatePassword("")).toBe(false)
})
test("return true if a password is 8 characters or longer, a letter and a number",()=>{
    expect(validate.validatePassword("1234567a")).toBe(true)
    expect(validate.validatePassword("1234567A")).toBe(true)
    expect(validate.validatePassword("1234567aA")).toBe(true)
})
test("return false if a password is 8 characters or longer but no letters",()=>{
    expect(validate.validatePassword("12345678")).toBe(false)
})
test("return false if a password is 8 characters or longer but no number",()=>{
    expect(validate.validatePassword("abcdefgh")).toBe(false)
})
test("return false if a password is 8 uppercase characters but no number",()=>{
    expect(validate.validatePassword("ABCDEFGH")).toBe(false)
})
test("return false if a password contains a number and a letter",()=>{
    expect(validate.validatePassword("a2")).toBe(false)
})

//user
test("return false given an empty string",()=>{
    expect(validate.validateUser("")).toBe(false)
})
test("return true given a username with more than 3 characters",()=>{
    expect(validate.validateUser("luke")).toBe(true)
})
test("return false given a string with less than 3 characaters",()=>{
    expect(validate.validateUser("ab")).toBe(false)
})

//email
test("return false given an empty string",()=>{
    expect(validate.validateEmail("")).toBe(false)
})
test("return false given an string without an @",()=>{
    expect(validate.validateEmail("lukejonesgmail.com")).toBe(false)
})
test("return false given an string with multiple @",()=>{
    expect(validate.validateEmail("lukejones@@gmail.com")).toBe(false)
})
test("return false given an string without a .",()=>{
    expect(validate.validateEmail("lukejones@gmail")).toBe(false)
})
test("return true given an string that follows format",()=>{
    expect(validate.validateEmail("lukejones@gmail.com")).toBe(true)
})
//search
test("return false given an *",()=>{
    expect(validate.validateSearch("*")).toBe(false)
})

