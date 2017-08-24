class Connection {
	constructor(a, b) {
		this.id = a.id + ',' + b.id;
		this.a = a; 
		this.b = b;
	}
}

module.exports = Connection;