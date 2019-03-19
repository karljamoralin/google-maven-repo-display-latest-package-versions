const fs = require('fs')
const util = require('util')
const request = require('request')
const convert = require('xml-js')

const requestPromisify = util.promisify(request)

const BASE_URL = 'https://dl.google.com/dl/android/maven2/'

const main = async () => {
    const { error, response, body } = await requestPromisify(`${BASE_URL}master-index.xml`)

    const groupIds = getGroupIds(body)

    const packages = await getPackages(groupIds)
    fs.writeFileSync('packages.txt', JSON.stringify(packages, null, 0))
}

const getGroupIds = (body) => {
    const json = JSON.parse(convert.xml2json(body))
    return json.elements[0].elements.map(element => element.name)
}

const getPackages = async (groupIds) => {
    const promises = [], packages = []
    
    groupIds.forEach(id => {
        const path = id.split('.').join('/')
        const url = `${BASE_URL}${path}/group-index.xml` 

        const promise = requestPromisify(url)
        promises.push(promise)
    })

    await Promise.all(promises).then((results) => {
        results.forEach((result) => {
            const json = JSON.parse(convert.xml2json(result.body))
            const groupId = json.elements[0].name
            
            json.elements[0].elements.forEach(artifact => {
                const artifactId = artifact.name
                const version = artifact.attributes.versions.split(',').slice(-1)[0]
                
                packages.push(`${groupId}:${artifactId}:$${version}`)
            })
        })
    })

    return packages.sort() // sort alphabetically
}

main()