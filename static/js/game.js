

//game function
/*function event(i){
    var event = i;
    var t=turn;
    var r = parseInt(i.getAttribute('row'),10),
        c = parseInt(i.getAttribute('col'),10);
    
    //check for empty spot
    
    if(arr[r][c]!=-1)
    {
        alert("You can't place stone there!");
        return;
    }  
   
    if(t==0)
    {
        arr[r][c] = t;
        event.src = "../img/wstone.png";
        event.className = "white";
        who = "user";
        turn++;
        
    }
    else{
        AI(arr);
        who="computer"
        turn--;
    }
    //winner check for horizontally and vertically
    for(var i = 3;i<8;i++)
    {
        for(var j = 1;j<10;j++)
        {
            if(arr[j][i-2]==t&&arr[j][i-1]==t&&arr[j][i]==t&&arr[j][i+1]==t&&arr[j][i+2]==t)
            {
                if(who=="user")
                {
                    alert(who+ " win!");
                    userWon();
                }
                else
                {
                    alert(who+" win!");
                }
            }
            if(arr[i-2][j]==t&&arr[i-1][j]==t&&arr[i][j]==t&&arr[i+1][j]==t&&arr[i+2][j]==t)
            {
                if(who=="user")
                {
                    alert(who+ " win!");
                    userWon();
                }
                else
                {
                    alert(who+" win!");
                }
            }
        }
    }
    //winner check for diagonally (left to right && right to left)
    for(var i = 3;i<8;i++)
    {
        for(var j = 3;j<8;j++)
        {
            if(arr[i-2][j-2]==t&&arr[i-1][j-1]==t&&arr[i][j]==t&&arr[i+1][j+1]==t&&arr[i+2][j+2]==t)
            {
                if(who=="user")
                {
                    alert(who+ " win!");
                    userWon();
                }
                else
                {
                    alert(who+" win!");
                }
            }
            if(arr[i+2][j-2]==t&&arr[i+1][j-1]==t&&arr[i][j]==t&&arr[i-1][j+1]==t&&arr[i-2][j+2]==t)
            {
                if(who=="user")
                {
                    alert(who+ " win!");
                    userWon();
                }
                else
                {
                    alert(who+" win!");
                }
            }
        }
    }

}

function AI(arr){
    
    var r = randomInt(1,10);
        c = randomInt(1,10);
    if(arr[r][c]!=-1)
    {
        alert("You can't place stone there!");
        return;
    }
    else{
        var loc = r+"-"+c;
        $('#'+loc).attr('src','../img/bstone.png')
        arr[r][c] = 1;
    }
    
}

function randomInt(min,max)
{
    return Math.floor(Math.random()*(max-min))+min;
}

function userWon()
{
    $('form').append('<input type="submit" name="re" value=re-game/>Or<input type="submit" name="lobby" value="quit"/>')
}
function compWon()
{
    $('form').append('<input type="submit" name="relost" value=re-game/>Or<input type="submit" name="relobby" value="quit"/>')
}

} */