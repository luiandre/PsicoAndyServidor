const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('BD conectada');

    } catch (error) {
        throw new Error('Error al conectar a la BD');
    }


};

module.exports = {
    dbConnection: dbConnection
};