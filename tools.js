var fs = require('fs');
module.exports = {
	include: function (filepath) {
		eval(fs.readFileSync(filepath)+'');
	}
};