

const mongoose = require('mongoose');

mongodb://<dbteam>:<dbpassword>@ds016118.mlab.com:16118/tft
//mongoose.connect('mongodb://ds016118.mlab.com:16118/tft');
mongoose.connect('mongodb://tft:tft@ds016118.mlab.com:16118/tft');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

const PlayerSchema = mongoose.Schema({
    id: String,
    name: {type:String, default:""},
    secondname: {type:String, default:""},
    characteristics: {
        age: {type:Number, default:0},
        weight: {type:Number, default:0},
        height: {type:Number, default:0}
    },
    nationality: {type:String, default:""},
    position: {type:String, default:""},
    team: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
    photo: {type:String, default:""},
    statistics:{
        goals: {type:Number, default:0},
        titles: {type:Number, default:0}
    },
    strengths:{type:String, default:""},
    weaknesses:{type:String, default:""},
    comments: {type:String, default:""}
});


const Player = mongoose.model('Player', PlayerSchema);

//Inserta el modelo en base de datos
exports.savePlayer = (data) =>{
    return (new Player(data)).save();
};

//obtienen el listado de todos los jugadores de la BD.
exports.getAllPlayers = ()=>{

    let listPlayers = Player.find({}).populate('team', 'name').exec();

    return listPlayers;
};

//obtienen el listado de todos los jugadores pertenecientes a un equipo.
exports.getPlayersByTeamId = (teamId)=>{

    //formamos el json con el cual realizar la búsqueda.
    let jsonBusqueda= {team:teamId};

    let listPlayers = Player.find(jsonBusqueda).exec();

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

