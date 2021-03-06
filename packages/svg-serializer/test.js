const test = require('ava')
const {CAG, CSG} = require('@jscad/csg')
const serializer = require('./index.js')

test('serialize CAG objects to SVG paths', function (t) {
  const cag1 = new CAG()

  const observed1 = serializer.serialize({}, cag1)
  t.deepEqual([expected1], observed1)

  const cag2 = CAG.rectangle({radius: [5, 10]})
  const observed2 = serializer.serialize({}, cag2)
  t.deepEqual([expected2], observed2)

  const cag3 = cag2.translate([-30, -30])
  const cag4 = cag2.translate([30, 30])
  const observed3 = serializer.serialize({}, [cag3, cag4])
  t.deepEqual([expected3], observed3)
})

const expected1 = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated by OpenJSCAD.org -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Tiny//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-tiny.dtd">
<svg width="0mm" height="0mm" viewBox="0 0 0 0" version="1.1" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"/>
`

const expected2 = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated by OpenJSCAD.org -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Tiny//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-tiny.dtd">
<svg width="10mm" height="20mm" viewBox="0 0 10 20" version="1.1" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g>
    <path d="M0 0L10 0L10 20L0 20L0 0"/>
  </g>
</svg>
`

const expected3 = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated by OpenJSCAD.org -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Tiny//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-tiny.dtd">
<svg width="70mm" height="80mm" viewBox="0 0 70 80" version="1.1" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g>
    <path d="M0 0L10 0L10 20L0 20L0 0"/>
  </g>
  <g>
    <path d="M60 60L70 60L70 80L60 80L60 60"/>
  </g>
</svg>
`

test('serialize cag objects to svg (path: simple)', function (t) {
  const source = function main (params) {
    var cag001 = new CSG.Path2D([[42.33333, 0]], false)
    cag001 = cag001.appendPoint([21.166665, -56.44443999999999])
    cag001 = cag001.appendPoint([63.49999499999999, -56.44443999999999])
    cag001 = cag001.close()
    cag001 = cag001.innerToCAG()
    return cag001
  }

  const object1 = source()
  const observed = serializer.serialize({output: 'jscad', addMetaData: false}, object1)
  t.deepEqual([expected], observed)
})

const expected = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated by OpenJSCAD.org -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Tiny//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-tiny.dtd">
<svg width="42.3333mm" height="56.4444mm" viewBox="0 0 42.3333 56.4444" version="1.1" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g>
    <path d="M21.1667 56.4444L0 0L42.3333 0L21.1667 56.4444"/>
  </g>
</svg>
`
