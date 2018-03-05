const bcrypt = require('bcrypt')

async function getSalt() {
    return await bcrypt.genSalt(10);
}

async function hash(clearText) {
    return await bcrypt.hash(clearText, await getSalt());
}

module.exports.getHash = hash;
module.exports.getSalt = getSalt;