

$(function(event){
	var tb = $('.board');
	var socket = io.connect();
	var username = $('#sessionId').val();
	var room = $('#roomname').val();
	var cls = $('#cls').val();

	socket.on('connect',function(){
		socket.emit('in_room',username,room);
	})


	socket.on('connected',function(rooms,mesg){
		$('#host').empty();
		$('#client').empty();
		//if host left the room visitor will be new host
		if(mesg=="hostleft")
		{
			alert("Room host has left the room. Your a host for this room!");
		}
		//if visitor left
		else if(mesg !="hostleft"&&mesg!=null){
			alert(mesg+" has left the room");
		}
		//determine visitor and host and render on player board
		for(var key in rooms)
		{
			if(key==room)
			{
				for(var user in rooms[key])
				{
					if(rooms[key][user]=='host')
					{
						$('#host').text(user);
					}
					else if(rooms[key][user]=='client')
					{
						$('#client').text(user);
					}
				}
			}
		}
	})



	socket.on('drawboard',function(rooms){
		tb.empty();
		//draw board
		$('body').append(function(){
			var count=1;
			for(var r = 1;r<10;r++)
			{
				var row = document.createElement("tr");
				tb.append(row);
				for(var c = 1;c<10;c++)
				{
					var cell = document.createElement("td");
					row.appendChild(cell);
					cell.width = "40px";
					cell.height = "40px";
					var img = document.createElement("img");
					cell.appendChild(img);
					img.id=count;
					
					img.setAttribute('row',r);
					img.setAttribute('col',c);
					//if host placed stone
					if(rooms[room]['board'][r][c]==1)
						img.setAttribute('src','../img/wstone.png');
					//if visitor placed stone
					if(rooms[room]['board'][r][c]==2)
						img.setAttribute('src','../img/bstone.png');
				}
			}
		})
		//when board is clicked
		$("img").click(function(){
			var row = parseInt($(this).attr('row'),10);
			var col = parseInt($(this).attr('col'),10);
			socket.emit('onboard',row,col,username,room);
			socket.emit('checkwin',username,room);
		})
		//determine winner on server-side
		socket.on('winner',function(user,bang){
			alert(user+' win!'); //alert message
			//add 'restart' button
			var but = $('<input/>').attr({
				type:'button',
				id: 'regame',
				value:'start'
			});
			//append 'start' button to body element
			$('body').append(but);
			//when 'start' button clicked will disappear and board will be cleard
			$(document).ready(function()
			{
				$('#regame').click(function(){
					socket.emit('clear',user,room);
					$('#regame').remove();
				});
			});
			//prevent page reloading
			event.preventDefault();
		})
			
	})
	
	
})
