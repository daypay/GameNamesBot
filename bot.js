//TODO
//1. Add help with information on commands
//  --- to remove a username, just do the command with the last argument blank
//2. Add ability to remove user completely

var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var userdata = {
    "user": "",
    "psn": "",
    "nintendo": "",
    "xbox": "",
    "steam": ""
};

var userArray = [];
let userCount = 0;

// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

function addUsername(user, type, username) {
    let userExists = false;
    userArray[userCount] = {
        "user": "",
        "psn": "",
        "nintendo": "",
        "xbox": "",
        "steam": ""
    };

    for (let i = 0; i < userCount; ++i) {
        console.log(userArray[i].user);
        if (user === userArray[i].user) {
            userArray[i][type] = username;
            console.log("User " + type + " saved");
            userExists = true;
        }
    }

    if (!userExists) {
        console.log("Created new user");
        userArray[userCount]['user'] = user;
        userArray[userCount][type] = username;
        ++userCount;
    }
}

bot.on('message', function (user, userID, channelID, message, evt) {
    var fs = require('fs');
    var buf = Buffer.alloc(1024);

    /*fs.open(channelID + '.txt', 'w+', function (err, file) {
        if (err) throw err;
        console.log(channelID + 'File Found/Created!');
    });*/
    let filename = channelID + '.txt';

    // If the userArray hasn't been filled, fill with file data
    if (!userArray.length) {
        fs.open(filename, 'a+', function (err, fd) {
            if (err) {
                return console.error(err);
            }
            console.log("File created/opened successfully!");
        });

        let data = fs.readFileSync(filename);
        userArray = JSON.parse(data);
        userCount = userArray.length;
    }

    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        console.log("User Count: " + userCount);

        user = args[0] + " " + args[1];

        switch (cmd) {
            case 'psn':
                {
                    addUsername(user, "psn", args[2]);
                    break;
                }
            case 'nintendo':
                {
                    addUsername(user, "nintendo", args[2]);
                    break;
                }
            case 'xbox':
                {
                    addUsername(user, "xbox", args[2]);
                    break;
                }
            case 'steam':
                {
                    addUsername(user, "steam", args[2]);
                    break;
                }
            case 'adduser':
                {
                    for (let i = 2; i < args.length; ++i) {
                        if (args[i] === "psn" || args[i] === "nintendo" ||
                            args[i] === "xbox" || args[i] === "steam") {
                            addUsername(user, args[i], args[i + 1]);
                        }
                    }
                    break;
                }
            case 'userinfo':
                {
                    for (let i = 0; i < userCount; ++i) {
                        if (userArray[i].user === user) {
                            bot.sendMessage({
                                to: channelID,
                                message: "\n--------------------\n" + userArray[i].user +
                                    "\n--------------------\npsn: " +
                                    userArray[i].psn + "\nnintendo: " + userArray[i].nintendo + "\nxbox: " +
                                    userArray[i].xbox + "\nsteam: " + userArray[i].steam
                            });
                            break;
                        }
                    }
                    break;
                }
            case 'all':
                {
                    for (let i = 0; i < userCount; ++i) {
                        bot.sendMessage({
                            to: channelID,
                            message: "\n--------------------\n" + userArray[i].user +
                                "\n--------------------\npsn: " +
                                userArray[i].psn + "\nnintendo: " + userArray[i].nintendo + "\nxbox: " +
                                userArray[i].xbox + "\nsteam: " + userArray[i].steam + "\n\n"
                        });
                    }
                    break;
                }
            case 'allpsn':
                {
                    let displayed = false;

                    for (let i = 0; i < userCount; ++i) {
                        if (userArray[i].psn != "") {
                            bot.sendMessage({
                                to: channelID,
                                message: userArray[i].user + ": " + userArray[i].psn + "\n"
                            });
                            displayed = true;
                        }
                    }

                    if (!displayed) {
                        bot.sendMessage({
                            to: channelID,
                            message: "No Users to Display"
                        });
                    }
                    break;
                }
            case 'allnintendo':
                {
                    let displayed = false;

                    for (let i = 0; i < userCount; ++i) {
                        if (userArray[i].nintendo != "") {
                            bot.sendMessage({
                                to: channelID,
                                message: userArray[i].user + ": " + userArray[i].nintendo + "\n"
                            });
                            displayed = true;
                        }
                    }

                    if (!displayed) {
                        bot.sendMessage({
                            to: channelID,
                            message: "No Users to Display"
                        });
                    }
                    break;
                }
            case 'allxbox':
                {
                    let displayed = false;

                    for (let i = 0; i < userCount; ++i) {
                        if (userArray[i].xbox != "") {
                            bot.sendMessage({
                                to: channelID,
                                message: userArray[i].user + ": " + userArray[i].xbox + "\n"
                            });
                            displayed = true;
                        }
                    }

                    if (!displayed) {
                        bot.sendMessage({
                            to: channelID,
                            message: "No Users to Display"
                        });
                    }
                    break;
                }
            case 'allsteam':
                {
                    let displayed = false;

                    for (let i = 0; i < userCount; ++i) {
                        if (userArray[i].steam != "") {
                            bot.sendMessage({
                                to: channelID,
                                message: userArray[i].user + ": " + userArray[i].steam + "\n"
                            });
                            displayed = true;
                        }
                    }

                    if (!displayed) {
                        bot.sendMessage({
                            to: channelID,
                            message: "No Users to Display"
                        });
                    }
                    break;
                }

        }
    }

    fs.writeFile(filename, JSON.stringify(userArray, null, 2), 'utf-8', function (err, file) {
        if (err) {
            console.log(channelID + ' Issue Writing File');
            throw err;
        }
    });
});