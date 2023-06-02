// let timeSection = document.querySelector("#time-section");
// let button = document.querySelector("#offerBtn");
// let element = document.querySelector("#offerValue");
// var totalseconds = 10;
// var clearInterval;
// var CURRENTROOM="";


// const connection = new signalR.HubConnectionBuilder()
//     .withUrl("https://localhost:7115/offers")
//     .configureLogging(signalR.LogLevel.Information)
//     .build();
// async function start() {
//     try {
//         await connection.start();

//         $.get("https://localhost:7115/api/Offer", function (data, status) {
//             console.log(data);
//             element.innerHTML = 'Begin PRICE $ ' + data;
//         });

//         console.log("SignalR Connected");
//     }
//     catch (err) {
//         console.log(err);
//         setTimeout(() => {
//             start();
//         }, 5000);
//     }
// }
// var lastOffer = 0;
// connection.on("ReceiveMessage", (message, data) => {
//     let element2 = document.querySelector("#offerValue2");
//     data += 100;
//     element2.innerHTML = message + data;
//     button.disabled = false;
//     totalseconds = 0;
//     clearTimeout(clearInterval);
//     timeSection.style.display = "none";

// })


// connection.on("ReceiveInfo", (message, data) => {
//     let element2 = document.querySelector("#offerValue2");
//     element2.innerHTML = message+"\n with this offer : "+data+"$";
//     button.disabled = true;
//     timeSection.style.display = "none";
// })

// connection.onclose(async () => {
//     await start();
// })


// async function IncreaseOffer() {
//     timeSection.style.display = "block";
//     totalseconds = 10;
//     let result = document.querySelector("#user");
//     $.get("https://localhost:7115/Increase?number=100", function (data, status) {
//         element.innerHTML = data;
//         $.get("https://localhost:7115/api/Offer", function (data, status) {
//             lastOffer = data;
//             let element2 = document.querySelector("#offerValue2");
//             element2.innerHTML = lastOffer;
//         });
//     });

//     await connection.invoke("SendMessage", result.value);
//     button.disabled = true;

//     clearInterval = setInterval(async () => {
//         let time = document.querySelector("#time");
//         --totalseconds;
//         time.innerHTML = totalseconds;
//         if (totalseconds == 0) {
//             button.disabled = false;
//             clearTimeout(clearInterval);
//             let result = document.querySelector("#user");
//             button.disabled = true;
//             await connection.invoke("SendWinnerMessage", "Game Over\n" + result.value + " is winner");
//         }
//     }, 1000);

// }

// start();


/////////////////////////////////////////////////////
////////////////////////////////////////////////////

let timeSection = document.querySelector("#time-section");
let button = document.querySelector("#offerBtn");
let element = document.querySelector("#offerValue");
var totalseconds = 10;
var clearInterval;
var CURRENTROOM = "";
let room = document.getElementById("room");
let currentUser = "";
let Rooms;
let Menu = document.querySelector("#rooms");
let CurrentRoom2;
let Rooms2;
let refreshFlag = true;

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7115/offers")
    .configureLogging(signalR.LogLevel.Information)
    .build();

function GetAllRooms() {
    $.get("https://localhost:7115/Rooms", function (data, status) {
        console.log("Rooms: ", data);
        data = JSON.parse(data);
        Rooms2 = data;
        let table = `<tr>
        <th>Car Name</th>
        <th>Current Price</th>
        <th>Begin Price</th>
        <th>Current Users</th>
        <th></th>
      </tr>`;
        for (let i = 0; i < data.length; i++) {
            table += `<tr>
            <td>${Rooms2[i].name}</td>
            <td>${Rooms2[i].currentData}</td>
            <td>${Rooms2[i].beginData}</td>
            <td>${Rooms2[i].currentUser}</td>
            <td style="display:flex;justify-content: center;"><button id="${Rooms2[i].name}" onclick="Join2(${i})" style="width:50%">Join</button></td>
          </tr>`

        }
        document.querySelector("#roomsTable").innerHTML = table;
    });
}
GetAllRooms();
//OLD-----------------------------------------------------------------
// async function start() {
//     try {
//         await connection.start();
//         $.get("https://localhost:7115/Room?room=" + CURRENTROOM, function (data, status) {
//             console.log(data);
//             element.innerHTML = 'Begin PRICE $ ' + data;
//         });

//         console.log("SignalR Connected");
//         Menu.style.display = "none";
//     }
//     catch (err) {
//         console.log(err);
//         setTimeout(() => {
//             start();
//         }, 5000);
//     }
// }
//-----------------------------------------------------------------

async function start() {
    try {
        await connection.start();
        refreshFlag = false;
        $.get("https://localhost:7115/Room?room=" + CurrentRoom2.name, function (data, status) {
            console.log(data);
            element.innerHTML = 'Begin PRICE $ ' + data;
        });

        console.log("SignalR Connected");
        Menu.style.display = "none";
    }
    catch (err) {
        console.log(err);
        setTimeout(() => {
            start();
        }, 5000);
    }
}
var lastOffer = 0;
connection.on("ReceiveMessageRoom", (message, data) => {
    let element2 = document.querySelector("#offerValue2");
    data += 100;
    element2.innerHTML = message + data;
    button.disabled = false;
    totalseconds = 0;
    clearTimeout(clearInterval);
    timeSection.style.display = "none";

})


connection.on("ReceiveInfoRoom", (message, data) => {
    let element2 = document.querySelector("#offerValue2");
    element2.innerHTML = message + "\n with this offer : " + data + "$";
    button.disabled = true;
    timeSection.style.display = "none";
})

connection.on("ReceiveJoinInfo", (user) => {
    let infoUser = document.querySelector("#info");
    infoUser.innerHTML = user + " connected to our Room";
})
connection.on("ReceiveDisconnectInfo", (user) => {
    let infoUser = document.querySelector("#info");
    infoUser.innerHTML = user + " disconnected from Room";
})
connection.on("RefreshDatas", (user) => {
    alert();
    if (refreshFlag) {
        alert("Refresh");
        GetAllRooms();
    }
})

connection.on("GetMessage", (user, message) => {
    addMessage(user, message)
})

async function IncreaseOffer() {
    timeSection.style.display = "block";
    totalseconds = 10;
    let result = document.querySelector("#user");
    $.get(`https://localhost:7115/IncreaseRoom2?room=${CurrentRoom2}&number=100`, function (data, status) {
        element.innerHTML = data;
        $.get("https://localhost:7115/Room?room=" + CurrentRoom2.name, function (data, status) {
            lastOffer = data;
            let element2 = document.querySelector("#offerValue2");
            element2.innerHTML = lastOffer;
        });
    });

    await connection.invoke("SendMessageRoom", CurrentRoom2.name, result.value);
    button.disabled = true;

    clearInterval = setInterval(async () => {
        let time = document.querySelector("#time");
        --totalseconds;
        time.innerHTML = totalseconds;
        if (totalseconds == 0) {
            button.disabled = false;
            clearTimeout(clearInterval);
            let result = document.querySelector("#user");
            button.disabled = true;
            await connection.invoke("SendWinnerMessageRoom", CurrentRoom2.name, "Game Over\n" + result.value + " is winner");
        }
    }, 1000);

}

async function Join(roomName) {
    CURRENTROOM = roomName;
    room.style.display = "block";
    await start();
    currentUser = document.getElementById("user").value
    await connection.invoke("JoinRoom", CURRENTROOM, currentUser);
}
async function Join2(Current_room) {

    CurrentRoom2 = Rooms2[Current_room];
    if (CurrentRoom2.currentUser < 3) {

        room.style.display = "block";
        await start();
        currentUser = document.getElementById("user").value
        await connection.invoke("JoinRoom2", CurrentRoom2, currentUser);
    }
}
async function Exit() {
    await connection.invoke("DisconnectedUser", CurrentRoom2.name, currentUser);
    connection.stop();
    refreshFlag = true;
    room.style.display = "none";
    Menu.style.display = "block";
}
// MINI CHAT


async function sendMessage() {
    var userInput = document.getElementById("userInput");
    var message = userInput.value;

    if (message) {
        await connection.invoke("SendChat", CurrentRoom2.name, currentUser, message);
        userInput.value = "";
    }
}


function addMessage(user, message) {
    var chatContainer = document.getElementById("chatContainer");
    var newMessage = document.createElement("div");
    if (user == currentUser) {
        user = "me"
    }
    newMessage.textContent = user + ": " + message;
    chatContainer.appendChild(newMessage);
}
