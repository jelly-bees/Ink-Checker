const p = require('./pigment-names.json');

const res = {};

p.forEach((pigment) => {
    const pignum = pigment.Pigment.replace('C.I. # ', '');

    res[pignum] = {};
    res[pignum] = pigment['Alternate Names'].split('; ');
});

console.log(JSON.stringify(res, null, 4));
