const pg = require("pg");
const settings = require("./settings");

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

const name = process.argv.slice(2).join();
const printFound = (people) => {
	console.log(`Found ${people.length} person(s) by the name '${name}':`);
};
const printDetails = (people) => {
	people.forEach((person) => {
		console.log(`- ${person.id}: ${person.first_name} ${person.last_name}, born '${person.birthdate.toString().slice(4, 15)}'`);
	});
}

client.connect((err) => {
	console.log('Searching...');
	if (err) {
		return console.error("Connection Error", err);
	}
	client.query("SELECT * FROM famous_people WHERE first_name = $1::text or last_name = $1::text", [name], (err, result) => {
		if (err) {
			return console.error("error running query", err);
		}
		printFound(result.rows);
		printDetails(result.rows);
		client.end();
	});
});