const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


http.listen(3000, function() {
    console.log('Server corriendo en el puerto 3000');
});

app.get('/', function(req, res){
	res.sendFile((__dirname + '/cliente.html'));
})

var usersList = [];

io.emit('connection');

io.on('connection', function(socket){
  //console.log('a user connected');
  socket.on('new user', (name) => {
		usersList.push(name);
		socket.user = name;
		refreshUsers();
		//console.log('El nuevo usuario ' + name + ' se unio');
	});

  function refreshUsers(){
  	io.emit('refreshUsers', usersList);
  };

  socket.on('disconnect', function(){
  	usersList.splice(usersList.indexOf(socket.user), 1);
  	refreshUsers();
  	//console.log('a user has disconnect' + socket.id);
  });
});


io.on('connection', (socket) => {
	socket.on('chat message', (msg, user) => {
		io.emit('chat message', {msg:msg, user:user});
	});
});



