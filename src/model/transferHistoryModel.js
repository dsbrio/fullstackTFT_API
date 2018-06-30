const mongoose = require('mongoose');

mongodb://<dbteam>:<dbpassword>@ds016118.mlab.com:16118/tft
//mongoose.connect('mongodb://ds016118.mlab.com:16118/tft');
mongoose.connect('mongodb://tft:tft@ds016118.mlab.com:16118/tft');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

//Indicamos el esquema de usuario
const TransferHistorySchema = mongoose.Schema({
    id : String,
	playerId : { type: Schema.Types.ObjectId, ref: 'Player' },
    teamId : { type: Schema.Types.ObjectId, ref: 'Team' },
    startDate:String,
    endDate:String
});

//conectamos con la colección de base de datos user.
const TransferHistory = mongoose.model('TransferHistory', TransferHistorySchema);

//Inserta el modelo en base de datos
exports.saveTransferHistory = (data) =>{
    return (new TransferHistory(data)).save();
};

exports.findTransferHistory = (jsonBusqueda) => {
    return TransferHistory.find(jsonBusqueda).exec();
};

exports.updateEndDateTransferHistory = (jsonBusqueda, date) => {

    var newValue = {$set: {endDate:date}};
    return TransferHistory.findOneAndUpdate(jsonBusqueda,newValue);

};

exports.findTransferHistoryWithData = (jsonBusqueda) => {


    return TransferHistory.find(jsonBusqueda)
    .populate('teamId', ['name','shield'])
    .populate('playerId', ['name','secondname'])
    .exec();
};