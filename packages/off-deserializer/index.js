const { vt2jscad } = require('./vt2jscad')
const {CSG} = require('@jscad/csg')

/**
 * Parse the given obj data and return either a JSCAD script or a CSG/CAG object
 * @param  {string} input obj data
 * @param {string} filename (optional) original filename of OFF source
 * @param {object} options options (optional) anonymous object with:
 * @param {string} [options.version='0.0.0'] version number to add to the metadata
 * @param {boolean} [options.addMetadata=true] toggle injection of metadata (producer, date, source) at the start of the file
 * @param {string} [options.output='jscad'] {String} either jscad or csg to set desired output
 * @return {CSG/string} either a CAG/CSG object or a string (jscad script)
 */
function deserialize (input, filename, options) { https://en.wikipedia.org/wiki/OFF_(file_format)
  options && options.statusCallback && options.statusCallback({progress: 0})
  const defaults = {version: '0.0.0', addMetaData: false, output: 'jscad'}
  options = Object.assign({}, defaults, options)
  const {output} = options

  const {positions, faces} = getPositionsAndFaces(input, options)
  const result = output === 'jscad' ? stringify({positions, faces, options}) : objectify({positions, faces, options})
  options && options.statusCallback && options.statusCallback({progress: 100})
  return result
}

const getPositionsAndFaces = (data, options) => {
  let lines = data.split(/\n/)
  
  if (lines[0].startsWith("OFF")){ // remove 1st line if OFF present
    lines.shift()
  }
  let counts = lines.shift().split(' ') // positions and faces count
  let positionsCount = Number(counts[0])
  let facesCount = Number(counts[1])
  
  let positions = []
  for(let i = 0; i < positionsCount; i++) {
    let s = lines[i]
    let a = s.trim().split(/\s+/)
    positions.push([a[0], a[1], a[2]])
  }

  let faces = []
  for (let i = 0; i < facesCount; i++) {
    let s = lines[positionsCount + i]
    let a = s.trim().split(/\s+/)
    //faceCount = Number(a[0]) //not needed
    a.shift()
    // a must be reordered : 1st -> at the last position, then reversed
    a.push(a.shift())
    faces.push(a.reverse())
  }
  
  options && options.statusCallback && options.statusCallback({progress: 90 * i / lines.length})  //getPositionsAndFaces is 90% of total
  
  return {positions, faces}
}

const objectify = ({positions, faces}) => {
  return CSG.polyhedron({points: positions, faces})
}

const stringify = ({positions, faces, addMetaData, filename, version}) => {
  let code = addMetaData ? `//
  // producer: OpenJSCAD.org Compatibility${version} OFF deserializer
  // date: ${new Date()}
  // source: ${filename}
  //
  ` : ''
  // if(err) src += "// WARNING: import errors: "+err+" (some triangles might be misaligned or missing)\n";
  code += `// objects: 1
// object #1: polygons: ${faces.length}
function main() { return
${vt2jscad(positions, faces)}
}
  `
  return code
}

module.exports = {
  deserialize
}
