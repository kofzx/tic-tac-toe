var player = { 
	score: 1,
	name: 'Jeff'
};

// var newPlayer = Object.assign({}, player, {score: 2});

var newPlayer = {...player, score: 2};

console.log(newPlayer);