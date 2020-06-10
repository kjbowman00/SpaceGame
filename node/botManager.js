const BOT_NAMES = [
	"Underwear", "Bite", "Produce", "Bomb", "Bandit", "Pickle", "Pet", "Governor", "Master",
	"King", "Queen", "Miss", "Mr", "Volcano", "Time", "Killer", "Slayer", "Boss", "The",
	"Professional", "Yeet", "Yote", "UwU", "Square", "Round", "Hexagon", "Hexagonal", "Circle",
	"Pointy", "Point", "Strong", "Weak", "Ultra", "Zoom", "Speedster", "Speedy", "Rick", "Apex",
	"Alpha", "Beta", "Omega", "Pie", "Pi", "360", "NoScope", "Boy", "Girl", "Lad", "Chad", "Brad",
	"Flying", "Bath", "Waffle", "Pancake", "Flag", "Hour", "Pizza", "Dough", "Cheese", "Cucumber",
	"Eater", "Muncher", "Chonker", "Chungus", "Big", "Small", "Little", "Tiny", "Massive", "Chunky",
	"Yeetus", "Deletus", "AHHHH", "XX", "Rain", "Cloud", "Soft", "Fluffy", "Bouncy", "Marshmallow",
	"Smores", "Crackers", "Dill", "Chill", "Heated", "Tilted", "Always", "Sometimes", "Im", "Its",
	"Maybe", "Lucky", "Ground", "Beef", "Toad", "Frog", "Mario", "Nick", "Cage", "Jelly", "Earth",
	"Quake", "Toe", "Bottle", "Ink", "Sleet", "Fog", "Iron", "Rock", "One", "Hammer", "Zesty",
	"Crabby", "Dusty", "Upset", "Curvy", "Creepy", "Violent", "Greasy", "Omniscient", "Selective",
	"Sad", "Gifted", "Goofy", "Eager", "Silly", "Early", "Jean", "Stick", "Wood", "Beaver", "Blood",
	"Sucker", "Dinosaur", "Cow", "Cat", "Dog", "Whale", "Seal", "Fox", "Trot", "Gamer", "Not",
	"Why", "Help", "Me", "Meat", "Chicken", "Farm", "Animal", "Baby", "Shark", "Sink", "Grinder",
	"Engine", "Sock", "Shirt", "Pants", "Door", "Key", "Lock", "Microwave", "Fridge", "Tile",
	"Protein", "Shake", "Calorie", "Dense", "Long", "Short", "Cable", "Internet", "Web",
	"Land", "Apple", "Orange", "Kiwi", "Blowhole", "Bumpkin", "Cabbage", "Egg", "Troglodyte",
	"EEEEEE", "Jeroo", "Jerboa", "Upgrade", "Stealer"
];
const colorPalette = [
	"#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#9900ff", "#ff00ff",
	"#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79",
	"#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47",
	"#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"
];

var addPlayerFunc;
var bots = []; // Stores the id to retrieve from player map
var players;
let startingBots = 20;

const NORMAL_LAST_TIME = 900; // 15 minutes to delete bot
const LAST_TIME_RANDOMNESS = 600; // 10 minutes random change

var botNum = 0;


function addBot() {
	//Get random color
	let color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

	//Get random name
	let name1 = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
	let name2 = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
	let name = name1 + name2;

	addPlayerFunc(botNum, name, color);
	bots.push(botNum);
	botNum++;
}

function updateBot(botNum, bot) {
	//If near position to head to, find new position
	//otherwise move

	//other player nearby, target them and shoot at them

}

function generateStartingBots(addPlayerFunc2, players2) {
	addPlayerFunc = addPlayerFunc2;
	players = players2;
	for (let i = 0; i < startingBots; i++) {
		addBot();
	}
}

exports.generateStartingBots = generateStartingBots;
exports.updateBot = updateBot;