import crypto from "crypto"

export const getRandomNumber = ()=>{
    const max = Math.pow(10, 6);
    let code = crypto.randomInt(0,max).toString();

    while (code.length<6){
        code = "0"+code;
    }
    return code;
}