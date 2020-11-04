const express = require('express')
const { nanoid } = require('nanoid')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

/*
GET - получение данных
POST - создание данных
UPDATE - обновление данных
PATCH - мелкое обновление данных 
DELETE - удаление
*/

let events = []

class Storage {
    _memory = {}

    add(event) {
        const id = nanoid()
        if (this._memory[id]) {
            return false
        }
        this._memory[id] = {
            id,
            ...event
        }
        return true
    }

    toArray() {
        return Object.values(this._memory)
    }

    delete(id) {
        delete this._memory[id]
    }

    get(id) {
        return this._memory[id]
    }
}

const storage = new Storage();

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json(storage.toArray())
})

app.post('/', (req, res) => {
    const success = storage.add({
        ...req.body,
    })
    res.json({
        "success": success
    }).status(200)
})

app.get('/:id', (req, res) => {
    const id = req.params.id
    const item = storage.get(id)
    if (!id || !item) {
        res.status(404).json({
            success: false
        })
        return;
    }  
    res.json(item)
})

app.delete('/:id', (req, res) => {
    const id = req.params.id
    storage.delete(id)
    res.json({
        "success": true
    }).status(200)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})