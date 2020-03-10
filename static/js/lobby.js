$(function(){
    var socket = io.connect();//initiate socket connection
    var user = $('#user').val();
    //page loads up, users join to lobby
    socket.on('connect',function(){
        socket.emit('join_lobby',user)
    })
    //update online lists
    socket.on('updateLobby',function(rooms,user){
        $("#listOnline").empty();
        $('#list').empty();
        for(var key in rooms){
            if(key=='lobby')
            {
                for(var user in rooms[key])
                {
                    $("#listOnline").append('<li>'+rooms[key][user]+'</li>')
                }
            }
            else
            {
                $('#list').append('<tr><th>'+key+' game</th><th><form action="/ingame"><input type=hidden name=username value='+user+' /><input type=hidden name=roomname value='+key+' /><input type=hidden name=cls value= client /><button id= join value='+key+' name='+rooms[key].online+'>Join</button></form></th><th>'+rooms[key].online+'</th></tr>')
            }
        }
        $('#join').click(function(){
            var roomname = $(this).val();
            var people = $(this).attr('name');
            if(people==2)
            {
                event.preventDefault();
                alert('Room is full !!!');
            }
            else
            {
                socket.emit('join_room',user,roomname);
            }
            
        })
    })
    
    //sned created room info to server side
    $('form').submit(function(){
        var roomname = user;
        socket.emit('createRoom',user,roomname)
    });
    //receive from server side and update chat to all in lobby
    socket.on('updateMsg', function (username, data) {
        $('#chat').append('<b>'+username + ':</b> ' + data + '<br>');
    });
    //send msg data to server side
    $('#datasend').click(function(){
        let msg = $('#msg').val();
        socket.emit('sendMsg',msg);
    })
})