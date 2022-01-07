const p = require('./color-pigments.json');
const v = require('./color-values.json');

const res = {};

p.forEach((color) => {
    res[color.Color] = {};
    res[color.Color].pigments = Object.keys(color)
        .filter((c) => color[c] === 'Yes')
        .map((d) => d.replace('C.I. # ', ''));
    res[color.Color].hex = v.find((value) => value.Color === color.Color)['Hex Value'];
});

console.log(JSON.stringify(res, null, 4));
