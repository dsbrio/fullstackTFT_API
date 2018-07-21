

const mongoose = require('mongoose');

mongodb://<dbteam>:<dbpassword>@ds016118.mlab.com:16118/tft
//mongoose.connect('mongodb://ds016118.mlab.com:16118/tft');
mongoose.connect('mongodb://tft:tft@ds016118.mlab.com:16118/tft');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

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
    position: String,
    team: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
    photo: String,
    statistics:{
        goals: Number,
        titles: Number
    },
    strengths:String,
    weaknesses:String,
    comments: String
});


const Player = mongoose.model('Player', PlayerSchema);

//Inserta el modelo en base de datos
exports.savePlayer = (data) =>{
    return (new Player(data)).save();
};

//obtienen el listado de todos los jugadores de la BD.
exports.getAllPlayers = ()=>{

    //proyección para no obtener todos los atributos
    let proyection = "id name secondname characteristics.age characteristics.weight characteristics.height nationality position team photo"

    let listPlayers = Player.find({}, proyection).populate('team', 'name').exec();

    return listPlayers;
};

//obtienen el listado de todos los jugadores pertenecientes a un equipo.
exports.getPlayersByTeamId = (teamId)=>{

    //formamos el json con el cual realizar la búsqueda.
    let jsonBusqueda= {team:teamId};

    //proyección para no obtener todos los atributos
    let proyection = "id name secondname characteristics.age characteristics.weight characteristics.height nationality position team photo"

    let listPlayers = Player.find(jsonBusqueda, proyection).exec();

    return listPlayers;
};

//obtiene todos los datos del jugadro por su id.
exports.getPlayerById = (playerId)=>{

    //formamos el json con el cual realizar la búsqueda.
    let jsonBusqueda= {_id:playerId};
    
    //obtenemos el listado de equipos por busqueda, en este caso solo saldra uno.
    let listPlayers = Player.find(jsonBusqueda).populate('team', 'name').exec();

    return listPlayers;
};

//Actualiza el modelo en base de datos
exports.updatePlayer = (data) =>{

    let jsonBusqueda= {_id:data.id};

   return Player.findOneAndUpdate(jsonBusqueda,data);

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

//obtienen el listado de todos los jugadores de la BD.
exports.getAllPlayersByTeamId = (teamId)=>{
    
    let jsonBusqueda= {team:teamId};

    let listPlayers = Player.find(jsonBusqueda).exec();

    return listPlayers;
};

//borra los jugadores pertenecientes a un equipo
exports.deleteAllPlayersByTeamId = (teamId)=>{
    
    let jsonBusqueda= {team:teamId};

    let listPlayers = Player.remove(jsonBusqueda).exec();

    return listPlayers;
};

