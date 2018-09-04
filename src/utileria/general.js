
//This function will return you the date and time in the following format: YYYY:MM:DD:HH:MM:SS. It also works in Node.js.
//var crypto = require("crypto");
var path = require("path");
var fs = require("file-system");
const NodeRSA = require('node-rsa');

exports.getDateTime = () => {

    var date = new Date();
    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day; //+ ":" + hour + ":" + min + ":" + sec;

};


exports.decrypt = (encryptedPass, callback) => {

    //obtenemos la clave privada
    var rutaAbsolutaClavePrivada = path.resolve("./src/utileria/clavePrivada.key");

    //tenemos la clave en base64
    var clavePrivadaBase64 = fs.readFileSync(rutaAbsolutaClavePrivada, "utf8");
   
    //pasamos a byte la pass que nos llega
    var bufferUsesPass = new Buffer(encryptedPass, "base64");

    var  key = new NodeRSA(clavePrivadaBase64); //.decrypt(value, 'utf8');
    key.setOptions({encryptionScheme: 'pkcs1'});
    var decript = key.decrypt(bufferUsesPass,'utf8');
    
   console.log('decript',decript);

    callback(decript);
};


