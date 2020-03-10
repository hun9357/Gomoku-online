//import models
const{User,Stat} = require('./models');

const express = require('express');
const path = require('path');
var hbs = require('express-handlebars');
const session = require('express-session');
const bcrypt = require('bcrypt');

app = express();

const http = require('http').createServer(app);
const io = require('socket.io').listen(http);

app.io = io;

//set up handlebars
app.set('view engine','html');
app.engine('html',hbs({
    helpers:{
        ifeq: function(a,b,options){
            if(a==b){return options.fn(this);}
        },
        ifnoteq:function(a,b,options){
            if(a!=b){return options.fn(this);}
        }
    },
    extname: 'html',
    defaultLayout: 'main',
    layoutsDir:__dirname + '/views/layouts/',
    partialsDir:__dirname+'/views/partials/'
}));

//setup body parsing 
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//setup session
app.use(session({secret:"asjkcascjas"}));

//setup static file service
app.use(express.static(path.join(__dirname,'static')));

//route to home page
app.get('/home',(req,res)=>{
    if(req.session.login)
    {
        res.render('home',{usr:req.session.login});
    }
    else{
        res.render('home',{usr:new User({username: "none"})});
    }
})

//if session is exist then render to mypage
//else render login page
app.get('/login',(req,res)=>{
    if(req.session.login)
    {
        res.render('mypage');
    }
    else{    
        res.render('login');
    }
})
//check login requirements
app.post('/login',(req,res)=>{
    let errors = [];
    let username = req.body.username.trim();
    let pw = req.body.password.trim();
    //if register button clicked on login page
    if(req.body.toregister)
    {
        res.redirect("/register");
        return;
    }
    else
    {
        if(username.length == 0)
        {
            errors.push({msg:"Please enter username"});
        }
        User.findOne({where:{username:username}}).then(user=>{
            //if user is exist in db
            if(user)
            {
                //compare pw hash
               bcrypt.compare(pw,user.pwhash,(err,match)=>{
                   if(match)
                   {
                       if(user.username == "admin")
                       {
                           req.session.login = user;
                           res.redirect('/mypage');
                       }
                       //need to add user to session
                       else{
                           req.session.login = user;
                           res.redirect('/mypage');
                        }
                   }
                   //when passwor is incorrect
                   else{
                       errors.push({msg:"Username and Password is incorrect"});
                       res.render('login',{
                           errors:errors
                       })
                   }
               })
            }
            //if there is no user info in db
            else
            {
                errors.push({msg:"Username and password is incorrect"});
                res.render("login",{
                    errors:errors
                })
            }
        })
    }
})


//get to register page
app.get('/register',(req,res)=>{
    res.render('register');
})
//post method for login and register page
app.post('/register',(req,res)=>{
    let errors = [];
    let username = req.body.username.trim();
    let pw = req.body.password.trim();
    let nick = req.body.nickname.trim();
    //if back is clicked
    if(req.body.back)
    {
        res.redirect("/home");
        return;
    }
    
    //if register button clicked in reigster page//
    //check for username and nickname redundacny//
    else
    {
        
        if(username.length==0)
        {
            errors.push({msg: "Please enter username"});
        }
        //async check username redundancy
        User.findOne({where:{username:username}}).then(user=>{
            if(user)
            {
                errors.push({msg:"This username is already taken"});
            }
            if(pw.length<6)
            {
                errors.push({msg:"Password must be at least 6 characters"});
            }
            //async check nickname redundancy 
            User.findOne({where:{nickname:nick}}).then(nickN=>{
                if(nickN)
                    {
                        errors.push({msg:"Nickname is already been used"});
                    }
                    if(errors.length !=0)
                    {
                        res.render('register',{
                        errors:errors,
                        usr:username,
                        nick:nick
                        })
                    }
                    else{
                        //async create new user in db
                        User.create({
                            username: username,
                            pwhash:bcrypt.hashSync(pw,10),
                            nickname:nick,
                            win:'0',
                            lose:'0'
                        }).then(user=>{
                            req.session.login = user;
                            res.redirect('/mypage')
                        });
                    }
            })
        })
    }
});

//mypage
app.get('/mypage',(req,res)=>{
    if(req.session.login)
    {
        let admin = req.session.login['username'].trim();
        if(admin == "admin")
        {
            User.findAll().then(allusr=>{
                res.render('mypage',{
                    user:req.session.login,
                    allusr:allusr
                })
            })
        }
        else
        {
            let user = req.session.login['username'];
            User.findOne({where:{username:user}}).then(user=>{
                let won = user.win;
                let lost = user.lose
                let total = won+lost;
                let rate = ((won/total)*100).toFixed(2);
                res.render('mypage',{
                    user:user,
                    win:won,
                    lose:lost,
                    rating:rate,
                    total:total
                });
            })
        }
    }
    else{
        res.render('home');
    }
})

//game route
app.get('/ingame',(req,res)=>{
    if(req.session.login)
    {
        res.render('ingame',{
            username:req.query.username,
            roomname:req.query.roomname
        });
    }
    else{
        res.render('home');
    }
})
//game result update
app.post('/ingame',(req,res)=>{
    let user=req.session.login['username'].trim();
    if(req.body.lobby)
    {
        User.increment({win:1},{where:{username:user}});
        res.redirect('lobby');
    }
    else if(req.body.re)
    {
        User.increment({win:1},{where:{username:user}});
        res.render('ingame');
    }
    else if(req.body.relobby)
    {
        User.increment({lose:1},{where:{username:user}});
        res.render('ingame');
    }
    else
    {
        User.increment({lose:1},{where:{username:user}});
        res.redirect('lobby');
    }
    
})
//lobby route
app.get('/lobby',(req,res)=>{
    if(req.session.login)
    {
        res.render('lobby',{
            usr:req.session.login
        });
    }
    else{
        res.render('home')
    }
})

//logout
app.get('/logout',(req,res)=>{
    delete req.session.login;
    res.redirect('/login');
});


//socket part//
var room = {'lobby':{}};
/*
var arr = new Array(9);
for(var i=1;i<10;i++)
{
    arr[i] = new Array();
    for(var j=1;j<10;j++)
    {
        arr[i][j] = -1;
    }
}*/
io.sockets.on("connection",function(socket){
    //join lobby
    socket.on("join_lobby",function(username){
        socket.username = username; //set socket username 
        socket.room = 'lobby'; //set socket room to lobby
        socket.join('lobby');  //join lobby in socket session
        room['lobby'][username]=username//assign user to the hash
        console.log('-----lobby----\n');
        console.log(room);
        console.log('\n---------------\n');
        io.emit('updateLobby',room,username);//update client side lobby list including sender
    })
    //create room
    socket.on('createRoom',function(username,roomname){
        room[roomname]={};
        room[roomname][username]='host';
        room[roomname]['online']=1;
        //create 2d array for board indication
        var arr = new Array(9);
        for(var i=1;i<10;i++)
        {
            arr[i] = new Array();
            for(var j=1;j<10;j++)
            {
                arr[i][j] = -1;
            }
        }
        room[roomname]['board'] = arr;
        io.in('lobby').emit('updateLobby',room,username); //send to client newRoom function with username params
    });
    //when user clicked created room
    socket.on('join_room',function(username,roomname){
        room[roomname][username] = 'client';
        
        if(room[roomname]['online']<2)
        {
            room[roomname]['online']++;
            io.emit('updateLobby',username,room);
        }
        
    })
    //users join game room
    socket.on('in_room',function(username,roomname){
        socket.username = username;
        socket.room = roomname;
        socket.join(roomname);
        io.emit('connected',room);
        io.emit('drawboard',room);
    })
    //send msg to all client
    socket.on('sendMsg',function(data){
        io.sockets.in(socket.room).emit('updateMsg',socket.username,data);
    })
    //game part
    socket.on('onboard',function(row,col,user,roomname)
    {
        if(room[roomname][user]=='host')
        {
            if(room[roomname]['board'][row][col]==-1)
            {
                room[roomname]['board'][row][col] = 1;
                console.log(user+' placed on '+row + 'x'+col);
            }
            else
            {
                console.log("You can't place there!");
            }
        }
        else
        {
            if(room[roomname]['board'][row][col] == -1)
            {
                room[roomname]['board'][row][col] = 2;
                console.log(user+' placed on '+row + 'x'+col);
            }
            else
            {
                console.log("You can't place there!");
            }
            
        }
        io.emit('drawboard',room);
    })
    //check winner
    socket.on('checkwin',function(username,roomtitle){
        var who = 0;
        if(room[roomtitle][username]=='host') {who = 1;}
        else {who = 2;}

        for(var i=3;i<8;i++)
        {
            for(var j=1;j<10;j++)
            {
                if(room[roomtitle]['board'][j][i-2]==who&&room[roomtitle]['board'][j][i-1]==who&&room[roomtitle]['board'][j][i]==who&&room[roomtitle]['board'][j][i+1]==who&&room[roomtitle]['board'][j][i+2]==who)
                {
                    io.in(socket.room).emit('winner',username,room);
                }
                if(room[roomtitle]['board'][i-2][j]==who&&room[roomtitle]['board'][i-1][j]==who&&room[roomtitle]['board'][i][j]==who&&room[roomtitle]['board'][i+1][j]==who&&room[roomtitle]['board'][i+2][j]==who)
                {
                    io.in(socket.room).emit('winner',username,room);
                }
            }
        }
        for(var i=3;i<8;i++)
        {
            for(var j=3;j<8;j++)
            {
                if(room[roomtitle]['board'][i-2][j-2]==who&&room[roomtitle]['board'][i-1][j-1]==who&&room[roomtitle]['board'][i][j]==who&&room[roomtitle]['board'][i+1][j+1]==who&&room[roomtitle]['board'][i+2][j+2]==who)
                {
                    io.in(socket.room).emit('winner',username,room);
                }
                if(room[roomtitle]['board'][i+2][j-2]==who&&room[roomtitle]['board'][i+1][j-1]==who&&room[roomtitle]['board'][i][j]==who&&room[roomtitle]['board'][i-1][j+1]==who&&room[roomtitle]['board'][i-2][j+2]==who)
                    io.in(socket.room).emit('winner',username,room);
            }
        }
    })

    //clear the board after game
    socket.on('clear',function(username,roomtitle){
        for(var i=1;i<10;i++)
        {
            for(var j=1;j<10;j++)
                room[roomtitle]['board'][i][j]=-1;
        }
        io.in(socket.room).emit('drawboard',room);
    })

    //when user disconnects
    socket.on('disconnect',function(){
        //if users is not in lobby
        if(socket.room !='lobby')
        {
            var mesg = ""
            //decrement size of people
            room[socket.room]['online']-=1;
            //if left user is host then visitor will be host
            if(room[socket.room][socket.username]=='host')
            {
                //linear search to find client in hash and update to host
                for(var user in room[socket.room])
                {
                    if(room[socket.room][user]=='client')
                    {
                        room[socket.room][user] = 'host';
                    }
                }
                mesg = "hostleft"
                io.in(socket.room).emit('connected',room,mesg);
            }
            else{
                mesg = socket.username
                io.in(socket.room).emit('connected',room,mesg);
            }
            //delete user from hash map 
            delete room[socket.room][socket.username];
            //update room member 
            //destroy room when no one is there
            if(room[socket.room]['online']==0)
            {
                delete room[socket.room];
            }
            //update lobby for other players to see whether room is full or not
            io.in('lobby').emit('updateLobby',room,socket.username);
        }
        else
        {
            delete room[socket.room][socket.username];
            io.sockets.emit('updateLobby',room,socket.username); //update online list in lobby client page
        }
        console.log(room);
        socket.leave(socket.room); //leave lobby room
    })
})


http.listen(3002,function(){
    console.log("server is running");
})
