

const mongoose = require('mongoose');

mongodb://<dbteam>:<dbpassword>@ds016118.mlab.com:16118/tft
//mongoose.connect('mongodb://ds016118.mlab.com:16118/tft');
mongoose.connect('mongodb://tft:tft@ds016118.mlab.com:16118/tft');
mongoose.Promise = global.Promise;

var cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'tftfullstack', 
    api_key: '825618299169144', 
    api_secret: 'h0eeOMCpOo7BegNlq_8mpvmeSuQ' 
  });

const NewsSchema = mongoose.Schema({
    id: String,
    title: String,
    photo: String,
    subtitle: String,
    reporter: String,
    date: Date,
    text: String,
    link: String
});


const News = mongoose.model('News', NewsSchema);

//Inserta el modelo en base de datos
exports.saveNews = (data) =>{
    cloudinary.v2.uploader.upload("data:image/png;base64,"+ data.photo, 
    function(error, result) {
        if(error){
            console.log('Noticia no creada: fallo al subir foto a la nube');   
            process.exit();
        }else{
            console.log("foto de la noticia subido a la nube");
            data.date = new Date();
            data.photo = result.url;

            return (new News(data)).save();
        }
    });
};

//obtienen el listado de todos los jugadores de la BD.
exports.getAllNews = ()=>{

    let listNews = News.find().exec();

    return listNews;
};

//obtienen el listado de todos los jugadores pertenecientes a un equipo.
exports.getNewsAfterDate = (dateFrom)=>{

    //formamos el json con el cual realizar la búsqueda.
    let jsonBusqueda= {date:{"$gte": dateFrom}};

    let listNews = News.find(jsonBusqueda).exec();

    return listNews;
};


