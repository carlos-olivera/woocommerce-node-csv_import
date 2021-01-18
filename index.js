/**
 * Load, parse csv file, and prepare to send to Woocommerce aPI
 * 
 * @carlos-olivera
 */

const csv = require('csv-parser')
const fs = require('fs')



const changeSlug = (input) => {
    return input.toLowerCase().split(' ').join('_')
}

const setStaus = (input) => {
    if (input === 'disponible') 
        return 'publish' 
    else return 'draft'
}

const setVisibility = (input) => {
    if (input === '1') 
        return 'visible' 
    else return 'hidden'
}

const types = {
    sku: "string",
    name: "string",
    short_description: "string",
    regular_price: "string",
    sale_price: "string",
    status: setStaus,
    catalog_visibility: setVisibility,
    categories: "number",
    shipping_class: changeSlug,
    default_attributes: "string"
}

const mapping = {
    sku: "codigo",
    name: "nombre",
    short_description: "detalle",
    regular_price: "precioVenta",
    sale_price: "precioRebajado",
    status: "disponibilidad",
    catalog_visibility: "habilitado",
    categories: ["id", "categoria1", "categoria2"],
    shipping_class: "almacen",
    default_attributes: [{ id: 4, option: "estado" }]
}


const mapToWoocommerceStructure = (file, mappingSchema, schemaTypes) => {
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(file)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('error', (err) => reject(err))
            .on('end', () => {
                resolve(results.map(result => {
                    const record = {}
                    Object.keys(mappingSchema).forEach(key => {
                        if (typeof mappingSchema[key] === 'string') {
                            if (typeof schemaTypes[key] === 'function')
                                record[key] = schemaTypes[[key]](result[mappingSchema[key]])
                            else
                                record[key] = result[mappingSchema[key]]
                        }
                        if ((typeof mappingSchema[key] === 'object') && (Array.isArray(mappingSchema[key]))) {
                            if (typeof mappingSchema[key][0] === 'string') {
                                record[key] = mappingSchema[key].map((record, index) => {
                                    const id = mappingSchema[key][0]
                                    if (index !== 0) {
                                        const newRecord = {}
                                        newRecord[id] = schemaTypes[key] === 'number' ? parseInt(result[record], 10) : result[record]
                                        if (isNaN(newRecord[id])) return undefined
                                        return newRecord
                                    }
                                }).filter(rec => (rec !== undefined))
                            }
                            if (typeof mappingSchema[key][0] === 'object') {
                                record[key] = mappingSchema[key].map(record => {
                                    const newRecord = {}
                                    Object.keys(record).forEach(rc => {
                                        if (typeof record[rc] === 'number')
                                            newRecord[rc] = record[rc]
                                        else
                                            newRecord[rc] = result[record[rc]]
                                    })
                                    return newRecord
                                })
                            }
                        }
                    })
                    return record
                })
                )
            })
    })
}


mapToWoocommerceStructure('input/crazystore02.csv',mapping, types).then(arreglo => {
    console.log(arreglo)
}).catch( err => {
    console.log(err)
})

