require('./config')

const fs = require('fs')
const express = require('express')

const app = express()

app.use(express.static(__dirname + '/public'));

app.get('*', (req, res) => {
    const packages = JSON.parse(fs.readFileSync('packages.txt', 'utf8'))
    var out = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Latest Versions of Google Packages</title></head><body>'
    
    packages.forEach(package => out += `<p>${package}</p>`)
    out += '</body></html>'

    res.send(out)
})

app.listen(process.env.PORT, () => {
    console.log(`Started on port ${process.env.PORT}`)
})