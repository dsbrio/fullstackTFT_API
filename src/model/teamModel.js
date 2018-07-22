

const mongoose = require('mongoose');

mongodb://<dbteam>:<dbpassword>@ds016118.mlab.com:16118/tft
//mongoose.connect('mongodb://ds016118.mlab.com:16118/tft');
mongoose.connect('mongodb://tft:tft@ds016118.mlab.com:16118/tft');
mongoose.Promise = global.Promise;

const TeamSchema = mongoose.Schema({
    id : String,
    name :{type:String, default:""},
	shield: {type:String, default:""},
    stadium : {type:String, default:""},
    history: {
        goals: {type:Number, default:0},
		titles: {type:Number, default:0}
    },
    coach: {type:String, default:""},
    president: {type:String, default:""}
});


const Team = mongoose.model('Team', TeamSchema);

//Inserta el modelo en base de datos
exports.saveTeam = (data) =>{
    return (new Team(data)).save();
};

//obtienen el listado de todos los equipos.
exports.getTeams = ()=>{

    //realizamos la búsqueda de todos los equipos.
    let listTeams = Team.find({}).exec();
    return listTeams;
};

//obtiene el equipo por su id.
exports.getTeamById = (teamId)=>{

    //formamos el json con el cual realizar la búsqueda.
    let jsonBusqueda= {_id:teamId};
    //obtenemos el listado de equipos por busqueda, en este caso solo saldra uno.
    let listTeams = Team.findOne(jsonBusqueda).exec();

    return listTeams;
};

//Actualiza el modelo en base de datos
exports.updateTeam = (data) =>{

    let jsonBusqueda= {_id:data.id};

    return Team.findOneAndUpdate(jsonBusqueda,data);
};

//Borrado de un equipo por id.
exports.deleteTeam = (data) =>{
    let jsonBusqueda= {_id:data.id};
    return Team.remove(jsonBusqueda);
};

//Borrado de todos los equipos.
exports.deleteAll = () =>{
    return Team.remove({});
};

