
/*
GET - получение данных
POST - создание данных
UPDATE - обновление данных
PATCH - мелкое обновление данных 
DELETE - удаление
*/

const { createApplication } = require('./src/api')
const { Storage } = require('./src/storages/storage')
const { FileStorage } = require('./src/storages/fileStorage')

const fileStorage = new FileStorage('./data')
const memoryStorage = new Storage()

createApplication(fileStorage)