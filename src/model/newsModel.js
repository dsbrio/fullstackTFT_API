

const mongoose = require('mongoose');

mongodb://<dbteam>:<dbpassword>@ds016118.mlab.com:16118/tft
//mongoose.connect('mongodb://ds016118.mlab.com:16118/tft');
mongoose.connect('mongodb://tft:tft@ds016118.mlab.com:16118/tft');
mongoose.Promise = global.Promise;

var cloudinary = require('cloudinary');
var moment = require('moment');

cloudinary.config({ 
    cloud_name: 'tftfullstack', 
    api_key: '825618299169144', 
    api_secret: 'h0eeOMCpOo7BegNlq_8mpvmeSuQ' 
  });

const NewsSchema = mongoose.Schema({
    id: String,
    title: {type:String, default:""},
    photo: {type:String, default:""},
    subtitle: {type:String, default:""},
    reporter: {type:String, default:""},
    date: {type:Date, default:new Date()},
    text: {type:String, default:""},
    link: {type:String, default:""}
});


const News = mongoose.model('News', NewsSchema);

//Inserta el modelo en base de datos
exports.saveNews = (data) =>{
    
    var dateMoment = moment(data.date, "DD-MM-YYYY");

    if(!dateMoment.isValid()){
        data.date = new Date();
    }else{
        data.date = dateMoment.toDate();
    }
    
    return (new News(data)).save();
};

//obtienen el listado de todos los jugadores de la BD.
exports.getAllNews = ()=>{

    let listNews = News.find().exec();

    return listNews;
};

//obtiene el equipo por su id.
exports.getNewsById = (newsId)=>{

    let jsonBusqueda= {_id:newsId};
    let listNews = News.findOne(jsonBusqueda).exec();

    return listNews;
};

//obtienen el listado de todos los jugadores pertenecientes a un equipo.
exports.getNewsAfterDate = (dateFrom)=>{

    //formamos el json con el cual realizar la búsqueda.
    let jsonBusqueda= {date:{"$gte": dateFrom}};

    let listNews = News.find(jsonBusqueda).exec();

    return listNews;
};

//Actualiza el modelo en base de datos
exports.updateNews = (data) =>{

    var dateMoment = moment(data.date, "DD-MM-YYYY");
    if(dateMoment.isValid()){
        data.date = dateMoment.toDate();
    }

    let jsonBusqueda= {_id:data.id};

   return News.findOneAndUpdate(jsonBusqueda,data);

};

//Borrado por id.
exports.deleteNews = (data) =>{
    let jsonBusqueda= {_id:data.id};
    return News.remove(jsonBusqueda);
};

//obtienen el listado de todos los jugadores pertenecientes a un equipo.
exports.deleteAllNews = ()=>{

    return News.remove({});
};


