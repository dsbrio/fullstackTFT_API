

const mongoose = require('mongoose');

mongodb://<dbteam>:<dbpassword>@ds016118.mlab.com:16118/tft
//mongoose.connect('mongodb://ds016118.mlab.com:16118/tft');
mongoose.connect('mongodb://tft:tft@ds016118.mlab.com:16118/tft');
mongoose.Promise = global.Promise;

const PlayerSchema = mongoose.Schema({
    id: String,
    name: String,
    secondname: String,
    characteristics: {
        age: Number,
        weight: Number,
        height: Number
    },
    nationality: String,
    team: String
});


const Player = mongoose.model('Player', PlayerSchema);

//Inserta el modelo en base de datos
exports.savePlayer = (data) =>{
    return (new Player(data)).save();
};

//obtienen el listado de todos los jugadores de la BD.
exports.getAllPlayers = ()=>{
    let listPlayers = Player.find().exec();

    return listPlayers;
};

//obtienen el listado de todos los jugadores pertenecientes a un equipo.
exports.getPlayersByTeamId = (teamId)=>{

    //formamos el json con el cual realizar la búsqueda.
    let jsonBusqueda= {team:teamId};
    let listPlayers = Player.find(jsonBusqueda).exec();

    return listPlayers;
};

//obtiene el equipo por su id.
exports.getPlayerById = (playerId)=>{

    //formamos el json con el cual realizar la búsqueda.
    let jsonBusqueda= {_id:playerId};

    //obtenemos el listado de equipos por busqueda, en este caso solo saldra uno.
    let listPlayers = Player.find(jsonBusqueda).exec();

    return listPlayers;
};

//Actualiza el modelo en base de datos
exports.updatePlayer = (data) =>{

    let jsonBusqueda= {_id:data.id};

    var newvalues ={$set: {name: data.name, secondname:data.secondname, nationality:data.nationality, 
        colors: data.colors, team:data.team, characteristics:data.characteristics} };

   return Player.findOneAndUpdate(jsonBusqueda,newvalues);

};

//Borrado de un equipo por id.
exports.deletePlayer = (data) =>{
    let jsonBusqueda= {_id:data.id};
    return Player.remove(jsonBusqueda);
};

//Borrado de todos los equipos.
exports.deleteAll = () =>{
    return Player.remove({});
};

