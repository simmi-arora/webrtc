/* ***************************************************************
Admin
******************************************************************/

var socket ;
var webrtcdevDataObj;
var usersDataObj;
var channelsFeed= document.getElementById("channelsFeed");

var WebRTCdevadmin= function(signaller){
    socket= io.connect(signaller);
    socket.on('response_to_admin_enquire', function(message) {

        switch (message.response){
            case "channels":
                webrtcdevDataObj=message.channels;
                if(message.format=="list"){
                    clearList("channellistArea");
                    for (i in Object.keys(webrtcdevDataObj)) { 
                        /*drawList("channellistArea" , Object.keys(webrtcdevDataObj)[i]);*/
                        drawList("channellistArea" , webrtcdevDataObj[i]);
                    }
                }else if(message.format=="table"){
                    drawTable("webrtcdevTableBody",webrtcdevDataObj);
                }else{
                    webrtcdev.error("format not specified ");
                }
            break;
        
            case "users":
                usersDataObj=message.users;
                if(message.format=="list"){
                    clearList("userslistArea");
                    for (i in usersDataObj) { 
                        drawList("userslistArea" , usersDataObj[i]);
                    }
                }
            break;

            case "all":
                channelsFeed.innerHTML=JSON.stringify(message.channels, null, 4);
            break;

            default :
                webrtcdev.log("unrecognizable response from signaller " , message);
        }
    });
};

function onLoadAdmin(){
    socket.emit('admin_enquire', {
        ask:'channels',
        format: 'list'
    });
}

$('#channels_list').click(function () {
    socket.emit('admin_enquire', {
        ask:'channels',
        format: 'list'
    });
});

$("#channelFindBtn").click(function(){
    socket.emit('admin_enquire', {
        ask:'channels',
        find: $("#channelFindInput").val(),
        format: 'list'
    });
});

$('#users_list').click(function () {
    socket.emit('admin_enquire', {
        ask:'users',
        format: 'list'
    });
});

$('#channels_table').click(function () {
    socket.emit('admin_enquire', {
        ask:'channels',
        format: 'table'
    });
});

$('#channels_json').click(function () {
    socket.emit('admin_enquire', {
        ask:'all',
        format: 'json'
    });
});

$('#channel_clients').click(function () {
    socket.emit('admin_enquire', 
        {
            ask:'channel_clients',
            channel: 'https172162010780841524489749781952'
        });
});

function clearList(element){
    $("#"+element).empty();
}

function drawList(element , listitem){
    $("#"+element).append("<li class='list-group-item'>"+listitem+"</li>");
}

function drawTable(tablebody , data) {
    for (i in Object.keys(data)) { 
        var key=Object.keys(data)[i];
        
        drawTableRow(tablebody ,i , data[key].channel , data[key].timestamp, data[key].users , 
            data[key].status , data[key].endtimestamp , 0 );
        /*                    
        for (j in data[key].users) {
            users.push(data[key].users[j]);
        }*/
    }
}

function drawTableRow(tablebody ,i ,  channel , timestamp , users , 
    status , endtimestamp , duration) {

    var row = $("<tr class='success' />");
    row.append($("<td>" + i + "</td>"));
    row.append($("<td>" + channel + "</td>"));
    row.append($("<td>" + timestamp + "</td>"));
    row.append($("<td>" + JSON.stringify(users, null, 4) + "</td>"));
    row.append($("<td>" + status + "</td>"));
    row.append($("<td>" + endtimestamp + "</td>"));
    row.append($("<td>" + duration + "</td>"));
    $("#"+tablebody).append(row);
    /*row.append($("<td id='usersRow'>" + drawUsersTable("usersRow" , rowData.users) + "</td>"));*/
}

function drawUsersTable(users) {
    var usersTable=document.createElement("table");
    $("#usersRow").append(usersTable);
    for (var i = 0; i < users.length; i++) {
        drawUsersRow(usersTable , data[i]);
    }
}

function drawUsersRow(userData) {
    var row = $("<tr />")
    $("#table").append(row);
    row.append($("<td>" + userData + "</td>"));
}