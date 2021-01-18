# Woocomerce import script

Basic script for import dta from CSV and JSON files to Woocommerce, using the woocommerce API

```

### Install and use🔧

npm install

node index.js




```

### Notes

You can map the CSV columns to Woocommerce product's fields:

    const  mapToWoocommerceStructure = (file, mappingSchema, schemaTypes) => {

    mappingSchema = Object with map to csv headers
    schemaTypes = Object with types including functions




## License 📄

This project is under license GPL-3.0-or-later - look the file [LICENSE.md](LICENSE.md) for details
