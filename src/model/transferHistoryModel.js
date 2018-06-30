const mongoose = require('mongoose');

mongodb://<dbteam>:<dbpassword>@ds016118.mlab.com:16118/tft
//mongoose.connect('mongodb://ds016118.mlab.com:16118/tft');
mongoose.connect('mongodb://tft:tft@ds016118.mlab.com:16118/tft');
mongoose.Promise = global.Promise;

//Indicamos el esquema de usuario
const TransferHistorySchema = mongoose.Schema({
    id : String,
	userId : String,
    teamId :String,
    startDate:String,
    endDate:String
});

//conectamos con la colección de base de datos user.
const TransferHistory = mongoose.model('TransferHistory', TransferHistorySchema);

//Inserta el modelo en base de datos
exports.saveTransferHistory = (data) =>{
    return (new TransferHistory(data)).save();
};