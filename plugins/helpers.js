// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
const Filesize = require('filesize')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ========================================================== SetProjectDefaults
/*
 * Set default project JSON file values
 *
 * Checking for:
 *  - special: isArray, Number(), Number.isFinite()
 *  - typeof: object, string, boolean
 *  - empty strings, empty arrays
 *
 */
const SetProjectDefaults = (store) => (project) => {
  const projectSchema = store.getters['global/siteContent']['project-schema']
  const check = (schema, field) => {
    for (const key in schema) {
      if (field.hasOwnProperty(key)) {
        console.log(key)
        const schemaValue = schema[key]
        const fieldValue = field[key]
        const schemaType = typeof schemaValue
        const fieldType = typeof fieldValue
        // Check for: booleans, strings, empty string values, and numbers
        if ((fieldValue === '') || // empty string value
            (schemaValue === 'boolean' && fieldType !== 'boolean') || // booleans
            (schemaValue === 'string' && fieldType !== 'string') || // strings
            (schemaValue === 'number' && fieldType !== 'number' && fieldValue === Number(fieldValue) && !Number.isFinite(fieldValue))) { // numbers
          field[key] = null
        // Check for: array and associative array
        } else if (schemaType === 'object' && fieldType === 'object') {
          if (!Array.isArray(fieldValue)) { // associative array
            check(schemaValue, fieldValue)
          } else { // regular array
            if (fieldValue.length === 0) { // empty array
              field[key] = null
            } else {
              fieldValue.forEach((item) => {
                if (item !== null && typeof item === 'object' && !Array.isArray(item)) { // array of objects
                  check(schemaValue[0], item)
                }
              })
            }
          }
        }
      } else {
        field[key] = null
      }
    }
  }; check(projectSchema, project)
  return project
}

// ///////////////////////////////////////////////////////////////////// Exports
// -----------------------------------------------------------------------------
const methods = module.exports = ({ store, app }, inject) => {
  inject('setProjectDefaults', SetProjectDefaults(store))
}

methods.SetProjectDefaults = SetProjectDefaults
