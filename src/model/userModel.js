
//importamos la libreria de mongo
const mongoose = require('mongoose');

//conectamos con nuestra base de datos
mongodb://<dbteam>:<dbpassword>@ds016118.mlab.com:16118/tft
//mongoose.connect('mongodb://ds016118.mlab.com:16118/tft');
mongoose.connect('mongodb://tft:tft@ds016118.mlab.com:16118/tft');
mongoose.Promise = global.Promise;

//Indicamos el esquema de usuario
const UserSchema = mongoose.Schema({
    id : String,
	name : String,
    surname :String,
    username : String,
    password : String,
    email:String,
    token: String
});

//conectamos con la colección de base de datos user.
const User = mongoose.model('User', UserSchema);

//Buscamos el usuario por username y password
exports.getUserByUsernamePassword = (u, p) => {
  
    let jsonBusqueda= {username:u, password:p};
    return User.find(jsonBusqueda).exec();
};

//actualizamos el token del usuario cuando hace login.
exports.updateToken = (userInfo, token) => { 

    let jsonBusqueda= {_id:userInfo._id};

    var newvalues ={$set: {token: token} };

    return User.findOneAndUpdate(jsonBusqueda,newvalues);
   
};


//Busca el usuario por token.
exports.getUserByToken = (token) => {
  
    let jsonBusqueda= {token:token};
    return User.find(jsonBusqueda).exec();
};

