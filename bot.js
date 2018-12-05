//TODO
//1. Add ability to remove user completely

var Discord = require('discord.js');
var logger = require('winston');
const config = require("./config.json");

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
var userHelp = "Below are the list of commands for Game Names Bot\n \
    +all\n \
            Display all users and usernames in system\n \
    +allpsn  +allnintendo   +allxbox   +allsteam\n \
            Displays all users and corresponding usernames for the specified system\n \
    +psn    +nintendo   +xbox   +steam\n \
            Adds your username for the specified system to the database for the user typing the command\n \
            Ex.:  +psn johnnydoe\n \
    +userinfo\n \
            Displays the information of the specified user (using nickanme in the server)\n \
            Ex.:  +userinfo John Doe\n \
    +whois\n \
            Displays the discord user nickname (in this channel) that matches the given game system name\n";

function addUsername(user, type, username) {
    let userExists = false;

    for (let i = 0; i < userCount; ++i) {
        if (user === userArray[i].user) {
            userArray[i][type] = username;
            userExists = true;
        }
    }

    if (!userExists) {
        userArray[userCount] = {
            "user": "",
            "psn": "",
            "nintendo": "",
            "xbox": "",
            "steam": ""
        };

        userArray[userCount]['user'] = user;
        userArray[userCount][type] = username;
        ++userCount;
    }
}

const client = new Discord.Client();

client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("message", async message => {
    // This event will run on every single message received, from any channel or DM.

    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if (message.author.bot) return;

    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    if (message.content.indexOf(config.prefix) !== 0) return;

    // Here we separate our "command" name, and our "arguments" for the command. 
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    var fs = require('fs');
    var buf = Buffer.alloc(1024);

    let filename = message.channel + '.txt';

    if (fs.existsSync(filename)) {
        let data = fs.readFileSync(filename);
        if (data.length) {
            userArray = JSON.parse(data);
            userCount = userArray.length;
        }
    } else {
        fs.writeFile(filename, JSON.stringify(userArray, null, 2), 'utf-8', function (err, file) {
            if (err) {
                console.log('Issue Writing File for channel: ' + message.channel);
                throw err;
            }
        });
    }

    //User ID will never change even when nicknames and usernames change
    //use this to identify the personal data
    user = message.author.id;

    switch (command) {
        case 'gnbhelp':
            {
                message.channel.send(userHelp);
                break;
            }
        case 'psn':
            {
                if (args.length > 0) {
                    addUsername(user, "psn", args[0]);
                } else {
                    message.channel.send("Incorrect use of command.");
                    message.channel.send("Type +gnbhelp for a list of Game Names Bots commands");
                }
                break;
            }
        case 'nintendo':
            {
                if (args.length > 0) {
                    addUsername(user, "nintendo", args[0]);
                } else {
                    message.channel.send("Incorrect use of command.");
                    message.channel.send("Type +gnbhelp for a list of Game Names Bots commands");
                }
                break;
            }
        case 'xbox':
            {
                if (args.length > 0) {
                    addUsername(user, "xbox", args[0]);
                } else {
                    message.channel.send("Incorrect use of command.");
                    message.channel.send("Type +gnbhelp for a list of Game Names Bots commands");
                }
                break;
            }
        case 'steam':
            {
                if (args.length > 0) {
                    addUsername(user, "steam", args[0]);
                } else {
                    message.channel.send("Incorrect use of command.");
                    message.channel.send("Type +gnbhelp for a list of Game Names Bots commands");
                }
                break;
            }
        case 'userinfo':
            {
                let userFound = false;
                for (let i = 0; i < userCount; ++i) {
                    let userNickname = "";
                    if (args.length > 0) {
                        userNickname = args[0];
                    }
                    for (let x = 1; x < args.length; ++x) {
                        userNickname = userNickname + " " + args[x];
                    }
                    if (message.guild.members.get(userArray[i].user).displayName === userNickname) {
                        userFound = true;
                        message.channel.send(
                            "\n--------------------\n" + message.guild.members.get(userArray[i].user).displayName +
                            "\n--------------------\npsn: " +
                            userArray[i].psn + "\nnintendo: " + userArray[i].nintendo + "\nxbox: " +
                            userArray[i].xbox + "\nsteam: " + userArray[i].steam
                        );
                    }
                }

                if (!userFound) {
                    message.channel.send("User info not found");
                }
                break;
            }
        case 'all':
            {
                for (let i = 0; i < userCount; ++i) {
                    message.channel.send(
                        "\n--------------------\n" + message.guild.members.get(userArray[i].user).displayName +
                        "\n--------------------\npsn: " +
                        userArray[i].psn + "\nnintendo: " + userArray[i].nintendo + "\nxbox: " +
                        userArray[i].xbox + "\nsteam: " + userArray[i].steam + "\n\n"
                    );
                }
                break;
            }
        case 'allpsn':
            {
                let displayed = false;

                for (let i = 0; i < userCount; ++i) {
                    if (userArray[i].psn != "") {
                        message.channel.send(message.guild.members.get(userArray[i].user).displayName + ": " + userArray[i].psn + "\n");
                        displayed = true;
                    }
                }

                if (!displayed) {
                    message.channel.send("No Users to Display");
                }
                break;
            }
        case 'allnintendo':
            {
                let displayed = false;

                for (let i = 0; i < userCount; ++i) {
                    if (userArray[i].nintendo != "") {
                        message.channel.send(message.guild.members.get(userArray[i].user).displayName + ": " + userArray[i].nintendo + "\n");
                        displayed = true;
                    }
                }

                if (!displayed) {
                    message.channel.send("No Users to Display");
                }
                break;
            }
        case 'allxbox':
            {
                let displayed = false;

                for (let i = 0; i < userCount; ++i) {
                    if (userArray[i].xbox != "") {
                        message.channel.send(message.guild.members.get(userArray[i].user).displayName + ": " + userArray[i].xbox + "\n");
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
                        message.channel.send(message.guild.members.get(userArray[i].user).displayName + ": " + userArray[i].steam + "\n");
                        displayed = true;
                    }
                }

                if (!displayed) {
                    message.channel.send("No Users to Display");
                }
                break;
            }
        case 'whois':
            {
                let userFound = false;

                for (let i = 0; i < userCount; ++i) {
                    let userGameName = "";
                    if (args.length > 0) {
                        userGameName = args[0];
                    }
                    for (let x = 1; x < args.length; ++x) {
                        userGameName = userGameName + " " + args[x];
                    }

                    if (userArray[i].psn === userGameName) {
                        userFound = true;
                        message.channel.send(message.guild.members.get(userArray[i].user).displayName +
                            " (psn): " + userArray[i].psn + "\n");
                    }

                    if (userArray[i].nintendo === userGameName) {
                        userFound = true;
                        message.channel.send(message.guild.members.get(userArray[i].user).displayName +
                            " (nintendo): " + userArray[i].nintendo + "\n");
                    }

                    if (userArray[i].xbox === userGameName) {
                        userFound = true;
                        message.channel.send(message.guild.members.get(userArray[i].user).displayName +
                            " (xbox): " + userArray[i].xbox + "\n");
                    }

                    if (userArray[i].steam === userGameName) {
                        userFound = true;
                        message.channel.send(message.guild.members.get(userArray[i].user).displayName +
                            " (steam): " + userArray[i].steam + "\n");
                    }
                }

                if (!userFound) {
                    message.channel.send("User info not found");
                }
                break;
            }
        default:
            {
                message.channel.send("Type +gnbhelp for a list of Game Names Bots commands");
            }

    }

    fs.writeFile(filename, JSON.stringify(userArray, null, 2), 'utf-8', function (err, file) {
        if (err) {
            console.log('Issue Writing File for channel: ' + message.channel);
            throw err;
        }
    });
});

client.login(config.token);