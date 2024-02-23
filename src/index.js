require('dotenv').config();
const { REST, Client, IntentsBitField, EmbedBuilder, Embed, GatewayIntentBits, Routes} = require('discord.js');
const mongoose = require('mongoose');
const Economy = require('./schema/economy');
const guildInfo = require('./schema/servers');
const client = new Client
({
    intents: 
    [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ],
});

(async() => 
{
    try 
    {
        client.login(process.env.TOKEN);
        await mongoose.connect(process.env.MONGOOSE_CONNECT);
        console.log('Connected to database');
    }
    catch (error) {console.log('Error: ' + error);}
}
)();

module.exports = (async (client, discord) =>
{
    let guildData;
    try
    {
        guildData = await guildInfo.findOne({guildId: process.env.GUILD_ID});
        if (Object.is(guildData, null))
        {
            let newGuildinfo = await guildInfo.create
            ({
                guildId: process.env.GUILD_ID,
                enabledTasks: [true, true, true, true],
                bonusTasknames: [],
                bonusTaskdescriptions: [],
                enableRoles: [true, true],
                enableItems: [true, true, true, true, true],
                customItemnames: [],
                customItemdescs: [],
                customItemprices: [],
                stockCosts: 15,
            });
            newGuildinfo.save();
            console.log('Main server logged');
        }
    } 
    catch (error) {console.log('Error: ' + error);}
})();

client.on('ready', (c) => {console.log('# Currybot has been activated #')});
client.on('guildCreate', (g) =>
{
    module.exports = (async (client, discord) =>
    {
        let guildData;
        try
        {
            guildData = await guildInfo.findOne({guildId: g.id});
            (!guildData)
            {
                let newGuildinfo = await guildInfo.create
                ({
                    guildId: g.id,
                    enabledTasks: [true, true, true],
                    bonusTasknames: [],
                    bonusTaskdescriptions: [],
                    enableRoles: [true, true],
                    enableItems: [true, true, true, true, true],
                    customItemnames: [],
                    customItemdescs: [],
                    customItemprices: [],
                    stockCosts: 15,
                });
                newGuildinfo.save();
                console.log('New server logged');
            }
        } 
        catch (error) {console.log('Error: ' + error);}
    })();
});

client.on('messageCreate', (msg) => 
{
    if(msg.author.bot)
    {return;}
    if(msg.content.includes('<@1206726598401851412>'))
    {msg.reply(`SHUT UP IM PLAYING MINECRAFT HERE!!!`);}
    else if(msg.content.includes('breakfast') || msg.content.includes('lunch') ||msg.content.includes('dinner'))
    {msg.reply(`Personally, I would have curry for breakfast, lunch and dinner, every day.`);}
    else if(msg.content.includes('curry'))
    {msg.reply(`Do you love curry? Because I sure do love curry!`);}
    else if(msg.content.includes('money'))
    {msg.reply(`MONEY`);}

    module.exports = (async (client, discord) =>
    {
        let newData;
        let guildData;
        try
        {
            newData = await Economy.findOne({userId: msg.author.id});
            guildData = await guildInfo.findOne({guildId: msg.guild.id});
            if (newData != null)
            {
                if(guildData.enableTasks[0])
                {
                    newData.msgCount++;
                    if(newData.msgCount % (50 * newData.taskMultiply) == 0)
                    {
                        newData.taskMoney += 5 + newData.speakingAddon;
                        msg.channel.send("<@" + msg.member.id + ">, you have completed the Speaking task for " + (newData.speakingAddon + 5) + " cash!");
                        if(newData.speakingAddon != 10)
                        {
                            newData.speakingAddon++;
                        }
                        newData.completedTask[0] = true;
                    }
                    await newData.save();
                }
                if(guildData.enableTasks[1])
                {
                    if(Date.now() - msg.member.joinedTimestamp >= newData.reqTime * newData.taskMultiply)
                    {
                        newData.reqTime += 2629746000;
                        newData.taskMoney += 10 + newData.ogAddon;
                        if(newData.ogAddon != 15)
                        {
                            newData.ogAddon++;
                        }
                        msg.channel.send("<@" + msg.member.id + ">, you have completed the OG member task for " + (10 + newData.ogAddon) + " cash!");
                        newData.completedTask[1] = true;
                    }
                    await newData.save();
                }
                if(guildData.enableItems[2])
                {
                    let stockRand = Math.random();
                    if(guildData.stockCosts == 2)
                    {
                        if(stockRand <= 0.47)
                        {
                            guildData.stockCosts = 2;
                        }
                        else
                        {
                            guildData.stockCosts = 4;
                        }
                        await guildData.save();
                    }
                    else
                    {
                        if(stockRand <= 0.47)
                        {
                            guildData.stockCosts = Math.round(guildData.stockCosts * 0.8);
                        }
                        else
                        {
                            guildData.stockCosts = Math.round(guildData.stockCosts * 1.2);
                        }
                        await guildData.save();
                    }
                }
                if(guildData.enableTasks[3])
                {
                    if(msg.embeds.length > 0)
                    {
                        newData.embedCount++;
                        if(newData.embedCount == 14 * newData.taskMultiply)
                        {
                            newData.taskMoney += 5 + newData.embedAddon;
                            msg.channel.send("<@" + msg.member.id + ">, you have completed the Media task for " + (newData.embedAddon + 5) + " cash!");
                            if(newData.embedAddon != 10)
                            {
                                newData.embedAddon++;
                            }
                            newData.completedTask[3] = true;
                        }
                    }
                }
            }
        } 
        catch (error) {console.log('Error: ' + error);}
    })();
});
client.on('interactionCreate', (interaction) => 
    {
        if(interaction.isChatInputCommand())
        {
            module.exports = (async (client, discord) =>
            {
                let newData;
                let guildData;
                try
                {
                    newData = await Economy.findOne({userId: interaction.member.id});
                    guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                    if (newData != null)
                    {
                        if(guildData.enableTasks[2])
                        {
                            if(newData.taskMultiply == 1)
                            {
                                if(newData.dailyTimer == 0)
                                {
                                    newData.dailyStreak = 1;
                                    newData.dailyTimer = Date.now() + 172800000;
                                    interaction.channel.send("<@" + interaction.member.id + ">, daily streak at "
                                    + newData.dailyStreak + ", a week and you'll fulfill a task!");
                                }
                                else if(newData.dailyTimer - Date.now() <= 0)
                                {
                                    interaction.channel.send("<@" + interaction.member.id + ">, your daily streak has expired, \
                                    so has reset back to one.");
                                    newData.dailyStreak = 1;
                                    newData.dailyTimer = Date.now() + 172800000;
                                }
                                else if(newData.dailyTimer - Date.now() <= 86400000)
                                {
                                    newData.dailyStreak++;
                                    newData.dailyTimer = Date.now() + 172800000;
                                    interaction.channel.send("<@" + interaction.member.id + ">, daily streak at "
                                    + newData.dailyStreak + ", a week and you'll fulfill a task!");
                                }
                                if(newData.dailyStreak % 7 == 0)
                                {
                                    interaction.channel.send("<@" + interaction.member.id + ">, your daily streak \
                                    is at a week, meaning you have completed the Streak task for " + (10 + newData.dailyAddon) + " cash!");
                                    newData.completedTask[2] = true;
                                    newData.taskMoney += 10 + newData.dailyAddon;
                                    if(newData.dailyAddon != 20)
                                    {
                                        newData.dailyAddon += 2;
                                    }
                                }
                            }
                            else
                            {
                                if(newData.dailyTimer == 0)
                                {
                                    newData.dailyStreak = 1;
                                    newData.dailyTimer = Date.now() + 172800000;
                                    interaction.channel.send("<@" + interaction.member.id + ">, daily streak at "
                                    + newData.dailyStreak + ", 4 days and you'll fulfill a task!");
                                }
                                else if(newData.dailyTimer - Date.now() <= 0)
                                {
                                    interaction.channel.send("<@" + interaction.member.id + ">, your daily streak has expired, \
                                    so has reset back to one.");
                                    newData.dailyStreak = 1;
                                    newData.dailyTimer = Date.now() + 172800000;
                                }
                                else if(newData.dailyTimer - Date.now() <= 86400000)
                                {
                                    newData.dailyStreak++;
                                    newData.dailyTimer = Date.now() + 172800000;
                                    interaction.channel.send("<@" + interaction.member.id + ">, daily streak at "
                                    + newData.dailyStreak + ", 4 days and you'll fulfill a task!");
                                }
                                if(newData.dailyStreak % 4 == 0)
                                {
                                    interaction.channel.send("<@" + interaction.member.id + ">, your daily streak \
                                    is at 4 days, meaning you have completed the Streak task!");
                                    newData.completedTask[2] = true;
                                    newData.taskMoney += 10 + newData.dailyAddon;
                                    newData.dailyAddon += 2;
                                }
                            }
                            await newData.save();
                        }
                    }
                } 
                catch (error) {console.log('Error: ' + error);}
            })();
            if(interaction.commandName == "help")
            {
                const embed = new EmbedBuilder()
                .setTitle('HELP')
                .setDescription ('This is the list of commands and what they do')
                .setColor('Random')
                .addFields(
                {name: '/help', value: '...Youre on it',},
                {name: '/roles', value: 'Adds rich role if over 40 curry cash, adds spender role if \
                more than 10 items bought. Will not be removed',},
                {name: '/start', value: 'Used to create your account and learn what commands to try',},
                {name: '/shop', value: 'The two commands for shop is /shop-buy and /shop-view. Viewing \
                items from the shop and seeing what they do is from /shop-view and buying them is from \
                /shop-buy.',},
                {name: '/balance', value: 'Checks the amount of curry cash you or another user has accumulated.',},
                {name: '/inventory', value: 'Shows your items. Has a capacity of 15',},
                {name: '/tasks', value: 'These are where tasks can be read. Complete them to \
                earn curry cash by doing as it says then typing /tasks again for the rewards (bonus tasks do not give rewards automatically though)',},
                {name: '/stocks', value: 'Shows current stock value and estimated future values (beware the estimates are innacurate)',},
                {name: '/give-cash', value: 'Shows your items. Has a capacity of 15',},
                {name: '/use', value: 'Uses items in your inventory, like using cash pass for x2 income',},
                {name: '/reset', value: 'Completely resets your account, prestige and all',},
                {name: '/anime', value: 'Sends a random anime phrase',},
                {name: '/curry', value: 'Replaces "i", "me" and "you" pronouns with "curry"',},
                {name: '/say', value: 'Makes the bot say your message',},
                {name: '/music', value: 'Sends a random music file',},
                {name: 'COMMANDS NOT LISTED', value: 'Commands not listed here are admin commands, which cannot be used by regular users and have their own help page /adminhelp',});

                interaction.reply({embeds: [embed]});
            }
            else if(interaction.commandName == "start")
            {
                module.exports = (async (client, discord) =>
                {
                    let newData;
                    try
                    {
                        newData = await Economy.findOne({userId: interaction.member.user.id});
                        if (!newData)
                        {
                            let newBalance = await Economy.create
                            ({
                                userId: interaction.member.user.id,
                                guildId: interaction.guild.id,
                                balance: 5,
                                itemAmt: 0,
                                inventory: [],
                                completedTask: [false, false, false, false, false],
                                roles: [false, false],
                                msgCount: 0,
                                reqTime: 2629746000,
                                dailyTimer: 0,
                                dailyStreak: 0,
                                modifier: 1,
                                taskMultiply: 1,
                                prestigeMultiply: 1,
                                speakingAddon: 0,
                                ogAddon: 0,
                                dailyAddon: 0,
                                embedAddon: 0,
                                cashpassTimer: 0,
                                stockTimer: 0,
                                embedCount: 0,
                            });
                            newBalance.save();
                            console.log('profile created');
                            interaction.reply('Account has been made, do /start again to learn more about the bot.');
                        }
                        else
                        {
                            const embed = new EmbedBuilder()
                            .setTitle('STARTER')
                            .setDescription ('This guide will help you to get to use this bot better')
                            .setColor('Random')
                            .addFields(
                            {name: 'Starter account', value: 'Now that youre a beginner, you need some \
                            money to start with, so your account has been created with 5 curry cash.\
                            To gain even more admins will set tasks for you to complete, which can buy items \
                            that increase profit in some way.',},
                            {name: 'Commands to start using', value: 'The first commands to use should be /task \
                            to complete and earn cash (balance can be checked in /balance), and with this \
                            newfound money, view shop items with /shop-view before buying them with /shop-buy. \
                            You can view them in /inventory and use them with /use. The stock item should also \
                            be used stragetically, using the /stocks command to check their value each time. \
                            If you are doing well with lots of cash to spare, you could donate some of it with /give-cash \
                            or you could buy the prestige item from the shop and start anew! Beware, some commands are admin-only \
                            like "shop-add", so if you arent sure which are which, its best to use /help'},
                            {name: 'Fun commands', value: 'No one wants a boring work bot so there are \
                            4 extra commands just for having fun. /anime sends a random anime phrase, /curry \
                            messes around with sentences, /say makes the bot say any funny phrase you add into it, and \
                            /music will send a music file, calming or uh.. *earrape music intensifies*.',});

                            interaction.reply({embeds: [embed]});
                        }
                    } 
                    catch (error) {console.log('Error: ' + error);}
                })();
            }
            else if(interaction.commandName == "shop-buy")
            {
                module.exports = (async (client, discord) =>
                {
                    let newData;
                    let guildData;
                    try
                    {
                        newData = await Economy.findOne({userId: interaction.member.user.id});
                        guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                        if (newData != null)
                        {
                            if(newData.inventory.length < 15)
                            {
                                if(interaction.options.get('item').value == 'cashpass')
                                {
                                    if(guildData.enableItems[0])
                                    {
                                        if(newData.balance >= 27)
                                        {
                                            interaction.reply('The cash pass has been bought for 27 curry cash!');
                                            newData.itemAmt++;
                                            newData.balance = newData.balance - 27;
                                            newData.inventory.push("cashpass");
                                            await newData.save();
                                        }
                                        else{interaction.reply('You do not have enough money!');}
                                    }
                                    else{interaction.reply('That item has been removed');}
                                }
                                else if(interaction.options.get('item').value == 'invest')
                                {
                                    if(guildData.enableItems[1])
                                    {
                                        if(newData.balance >= 10)
                                        {
                                            interaction.reply('You payed 10 curry cash to invest! Outcome calculating...');
                                            newData.itemAmt++;
                                            newData.balance = newData.balance - 10;
                                            newData.inventory.push("invest");
                                            await newData.save();
                                        }
                                        else{interaction.reply('You do not have enough money!');}
                                    }
                                    else{interaction.reply('That item has been removed');}
                                }
                                else if(interaction.options.get('item').value == 'stocks')
                                {
                                    if(guildData.enableItems[2])
                                    {
                                        if(newData.balance >= guildData.stockCosts)
                                        {
                                            interaction.reply('You payed ' + guildData.stockCosts + ' curry cash for stocks! Lets see what the market thinks...');
                                            newData.itemAmt++;
                                            newData.balance = newData.balance - guildData.stockCosts;
                                            newData.stockTimer = Date.now() + 86400000;
                                            newData.inventory.push("stocks");
                                            await newData.save();
                                        }
                                        else{interaction.reply('You do not have enough money!');}
                                    }
                                    else{interaction.reply('That item has been removed');}
                                }
                                else if(interaction.options.get('item').value == 'taskify')
                                {
                                    if(guildData.enableItems[3])
                                    {
                                        if(newData.balance >= 50)
                                        {
                                            interaction.reply('You payed 50 curry cash for a taskification! Easy money BOIII');
                                            newData.itemAmt++;
                                            newData.balance = newData.balance - 50;
                                            newData.inventory.push("taskify");
                                            await newData.save();
                                        }
                                        else{interaction.reply('You do not have enough money!');}
                                    }
                                    else{interaction.reply('That item has been removed');}
                                }
                                else if(interaction.options.get('item').value == 'prestige')
                                {
                                    if(guildData.enableItems[4])
                                    {
                                        if(newData.balance >= 100)
                                        {
                                            interaction.reply('You payed 100 curry cash for a prestige! Use it knowing the consequences...');
                                            newData.itemAmt++;
                                            newData.balance = newData.balance - 100;
                                            newData.inventory.push("prestige");
                                            await newData.save();
                                        }
                                        else{interaction.reply('You do not have enough money!');}
                                    }
                                    else{interaction.reply('That item has been removed');}
                                }
                                else if(guildData.customItemnames.includes(interaction.options.get('item').value))
                                {
                                    let itemname = interaction.options.get('item').value;
                                    let itemdesc = guildData.customItemdescs[guildData.customItemnames.indexOf(itemname)];
                                    let itemprice = guildData.customItemprices[guildData.customItemnames.indexOf(itemname)];

                                    if(newData.balance >= itemprice)
                                    {
                                        interaction.reply('You payed ' + itemprice + ' curry cash for ' + itemname + "!");
                                        newData.itemAmt++;
                                        newData.balance = newData.balance - itemprice;
                                        newData.inventory.push(itemname);
                                        await newData.save();
                                    }
                                    else{interaction.reply('You do not have enough money!');}
                                }
                                else{interaction.reply('That item does not exist! Maybe there was a mistake in capitalization or spacing?');}
                            }
                            else{interaction.reply('Your inventory is too big! Use some items first');}
                        }
                        else{interaction.reply('First do /start to create an account.');}
                    } 
                    catch (error) {console.log('Error: ' + error);}
                })();
            }
            else if(interaction.commandName == "stocks")
            {
                module.exports = (async (client, discord) =>
                {
                    let guildData;
                    try
                    {
                        guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                        if(guildData.enableItems[2])
                        {
                            if(guildData.stockCosts == 2)
                            {
                                const embed = new EmbedBuilder()
                                .setTitle('Stock values')
                                .setDescription ('Current value of stocks')
                                .setColor('Random')
                                .addFields
                                ({name: 'Current value', value: 'Stocks are currently at 2 curry cash'})
                                .addFields
                                ({name: 'Next possible lower value', value: 'Stocks may drop to 2 curry cash'})
                                .addFields
                                ({name: 'Next possible higher value', value: 'Stocks may raise to 4 curry cash'});

                                interaction.reply({embeds: [embed]});
                            }
                            else
                            {
                                const embed = new EmbedBuilder()
                                .setTitle('Stock values')
                                .setDescription ('Current value of stocks')
                                .setColor('Random')
                                .addFields
                                ({name: 'Current value', value: 'Stocks are currently at ' + guildData.stockCosts + ' curry cash'})
                                .addFields
                                ({name: 'Next possible lower value', value: 'Stocks may drop to ' + Math.round(guildData.stockCosts * 0.8) + ' curry cash'})
                                .addFields
                                ({name: 'Next possible higher value', value: 'Stocks may raise to ' + Math.round(guildData.stockCosts * 1.2) + ' curry cash'});

                                interaction.reply({embeds: [embed]});
                            }
                        }
                        else{interaction.reply('The stock item is disabled!');}
                    }
                    catch (error) {console.log('Error: ' + error);}
                })();
            }
            else if(interaction.commandName == "shop-view")
            {
                module.exports = (async (client, discord) =>
                {
                    let guildData;
                    try
                    {
                        guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                        const embed = new EmbedBuilder()
                        .setTitle('SHOP ITEMS')
                        .setDescription ('These are the items available to purchase')
                        .setColor('Random')
                        if(guildData.enableItems[0])
                        {
                            embed.addFields
                            ({name: 'Cash Pass (cashpass in commands)', value: 'Will multiply the values of task income by 2x for \
                            3 days. Can be stacked once to make a 4x multiplier that lasts 3 days but thats it. PRICE: 27 CURRY CASH'})
                        }
                        else{embed.addFields({name: 'Cash Pass', value: 'REMOVED'});}
                        if(guildData.enableItems[1])
                        {
                            embed.addFields
                            ({name: 'Investment (invest in commands)', value: 'Will randomly choose an item from the shop, more expensive \
                            = less chance. PRICE: 10 CURRY CASH'})
                        }
                        else{embed.addFields({name: 'Investment', value: 'REMOVED'});}
                        if(guildData.enableItems[2])
                        {
                            embed.addFields
                            ({name: 'Stocks (stocks in commands)', value: 'An item that will fluctuate in price and can be sold a day after buying with /use. \
                            BASE PRICE: 15 CURRY CASH - CURRENT PRICE: ' + guildData.stockCosts})
                        }
                        else{embed.addFields({name: 'Stocks', value: 'REMOVED'});}
                        if(guildData.enableItems[3])
                        {
                            embed.addFields
                            ({name: 'Taskification (taskify in commands)', value: 'Halves task requirements until reset or prestige, but can only be bought once. \
                            PRICE: 50 CURRY CASH'})
                        }
                        else{embed.addFields({name: 'Taskification', value: 'REMOVED'});}
                        if(guildData.enableItems[4])
                        {
                            embed.addFields
                            ({name: 'Prestige (prestige in commands)', value: 'Resets progress, but adds an extra .2x multiplier to task income each time. \
                            PRICE: 100 CURRY CASH'})
                        }
                        else{embed.addFields({name: 'Stocks', value: 'REMOVED'});}
                        for(var i = 0; i < guildData.customItemnames.length; i++)
                        {
                            let itemname = guildData.customItemnames[i];
                            let itemdesc = guildData.customItemdescs[i];
                            let itemprice = guildData.customItemprices[i];
                            embed.addFields
                            ({name: itemname, value: itemdesc + "...PRICE: " + itemprice});
                        }

                        interaction.reply({embeds: [embed]});
                    }
                    catch (error) {console.log('Error: ' + error);}
                })();
            }
            else if(interaction.commandName == "balance")
            {
                module.exports = (async (client, discord) =>
                {
                    let newData;
                    let newData2;
                    try
                    {
                        if (Object.is(interaction.options.get('user'), null))
                        {
                            newData = await Economy.findOne({userId: interaction.member.id});
                            if (newData != null)
                            {
                                const embed = new EmbedBuilder()
                                .setTitle('CURRY CASH BALANCE')
                                .setDescription ('Your balance is: ' + newData.balance)
                                .setColor('Random');

                                interaction.reply({embeds: [embed]});
                            }
                            else{interaction.reply('First do /start to create an account.');}
                        }
                        else
                        {
                            newData2 = await Economy.findOne({userId: interaction.options.get('user').value});
                            if(!newData2){interaction.reply('That user does not have an account!');}
                            else
                            {
                                const embed = new EmbedBuilder()
                                .setTitle("CURRY CASH BALANCE")
                                .setDescription ('Their balance is: ' + newData2.balance)
                                .setColor('Random');

                                interaction.reply({embeds: [embed]});
                            }
                        }
                    } 
                    catch (error) {console.log('Error: ' + error);}
                })();
            }
            else if(interaction.commandName == "roles")
            {
                module.exports = (async (client, discord) =>
                {
                    let newData;
                    let guildData;
                    try
                    {
                        newData = await Economy.findOne({userId: interaction.member.user.id});
                        guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                        if (newData != null)
                        {
                            if(guildData.enableRoles[0])
                            {
                                if(newData.balance > 40 && newData.roles[0] == false) 
                                {
                                    if(interaction.guild.roles.cache.find(r => r.name === "Rich"))
                                    {
                                        interaction.channel.send('Rich role added');
                                        const role = interaction.guild.roles.cache.find(r => r.name === "Rich");
                                        interaction.member.roles.add(role);
                                        newData.roles[0] = true;
                                        await newData.save();
                                    }
                                    else{interaction.channel.send('Could not find "Rich" role');}
                                }
                                else {interaction.channel.send('Rich role not added');}
                            }
                            else {interaction.channel.send('Rich role is disabled');}

                            if(guildData.enableRoles[1])
                            {
                                if(newData.itemAmt > 10 && newData.roles[1] == false) 
                                {
                                    if(interaction.guild.roles.cache.find(r => r.name === "Spender"))
                                    {
                                        interaction.channel.send('Spender role added');
                                        const role = interaction.guild.roles.cache.find(r => r.name === "Spender");
                                        interaction.member.roles.add(role);
                                        newData.roles[1] = true;
                                        await newData.save();
                                    }
                                    else{interaction.channel.send('Could not find "Spender" role');}
                                }
                                else {interaction.channel.send('Spender role not added');}
                            }
                            else {interaction.channel.send('Spender role is disabled');}
                            interaction.reply('Done checking roles');
                        }
                        else{interaction.reply('First do /start to create an account.');}
                    } 
                    catch (error) {console.log('Error: ' + error);}
                })();
            }
            else if(interaction.commandName == "tasks")
            {
                module.exports = (async (client, discord) =>
                {
                    let newData;
                    let guildData;
                    try
                    {
                        newData = await Economy.findOne({userId: interaction.member.id});
                        guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                        if (newData != null)
                        {
                            if(!newData.completedTask[0] && !newData.completedTask[1] && !newData.completedTask[2] && !newData.completedTask[3])
                            {
                                const embed = new EmbedBuilder()
                                .setTitle('TASKS')
                                .setDescription ('Tasks that give curry cash')
                                .setColor('Random');
                                if(guildData.enableTasks[0])
                                {
                                    embed.addFields(
                                    {name: 'Speaking', value: 'Be active on the server with 50 messages (25 messages with taskification), \
                                    then 100, then 150 etc. to gain 5 curry cash. Youve posted ' + newData.msgCount + ' messages!! \
                                    Every 50 messages the reward goes up by one, 100 = 6 cash, 150 = 7 cash, all \
                                    the way up to 10 cash: 300 messages. Every 50 messages after that give 10 cash.'});
                                }
                                else{embed.addFields({name: 'Speaking', value: 'DISABLED'});}
                                if(guildData.enableTasks[1])
                                {
                                    embed.addFields(
                                    {name: 'OG member', value: 'Stay on the server for a month (15 days with taskification), then two, \
                                    then three etc. to gain 10 curry cash each time (time checked every message). Youve been on the server for '
                                    + Math.round((Date.now() - interaction.member.joinedTimestamp) / 86400000) + ' days out of ' + Math.round(newData.reqTime * newData.taskMultiply / 86400000) + ' days!! \
                                    Every month the amount will increase by 1, so 2 months = 11 cash, 3 months = 12 cash, all the \
                                    way to 15 cash: 6 months. Every month after that gives 15 cash'});
                                }
                                else{embed.addFields({name: 'OG member', value: 'DISABLED'});}
                                if(guildData.enableTasks[2])
                                {
                                    embed.addFields(
                                    {name: 'Streak', value: 'Use the bot every day for a week (4 days with taskification) to get 10 curry cash. Your streak is at '
                                    + newData.dailyStreak + "!! Every extra week in the streak gives \
                                    2 more curry cash, so 2 week streak gives 12 cash, 3 weeks give 14 cash, all the way \
                                    up to 20 cash which is a 6 week streak"});
                                }
                                if(guildData.enableTasks[3])
                                {
                                    embed.addFields(
                                    {name: 'Media', value: 'Are you keen sharing media that you or others made? Post 12 embeds (6 embeds with taskification) to get 5 curry cash. Your embed count is at '
                                    + newData.embedCount + "!! Every 12 embeds increases the reward by 2 cash, so 24 embeds gives 6 cash, \
                                    36 embeds give 7 cash, all the way up to 10 cash which would need you to post 72 embeds."});
                                }
                                else{embed.addFields({name: 'Media', value: 'DISABLED'});}
                                embed.addFields(
                                {name: 'Bonus', value: 'If you deserve bonus points, admins will give them out. Examples \
                                are contributing in creating, helping others out, or in friend servers silly \
                                little ideas.'});
                                for(var i = 0; i < guildData.bonusTasknames.length; i++)
                                {
                                    embed.addFields({name: "CUSTOM TASK: " + guildData.bonusTasknames[i], value: guildData.bonusTaskdescriptions[i]});
                                }
                                embed.addFields({name: 'Modifier', value: 'Task requirements are at a x' + newData.taskMultiply + ' multiplier, prestige is at a x' + newData.prestigeMultiply + ' multiplier and cash pass is at a x' + newData.modifier + ' multiplier.'});

                                interaction.reply({embeds: [embed]});
                            }
                            else
                            {
                                if(newData.cashpassTimer != 0)
                                {
                                    if(Date.now() - newData.cashpassTimer > 0)
                                    {
                                        interaction.channel.send('Your cash pass has expired');
                                        newData.modifier = 1;
                                        newData.cashpassTimer = 0;
                                    }
                                }
                                interaction.reply('You earned ' + newData.taskMoney + ' (x' + newData.modifier + ') (x' + newData.prestigeMultiply + ') from completed tasks!');
                                newData.balance += newData.taskMoney * newData.modifier * newData.prestigeMultiply;
                                newData.taskMoney = 0;
                                newData.completedTask = [false, false, false];
                                await newData.save();
                            }
                        }
                        else{interaction.reply('First do /start to create an account.');}
                    } 
                    catch (error) {console.log('Error: ' + error);}
                })();
            }
            else if(interaction.commandName == "inventory")
            {
                module.exports = (async (client, discord) =>
                {
                    let newData;
                    try
                    {
                        newData = await Economy.findOne({userId: interaction.member.user.id});
                        if (newData != null)
                        {
                            if(newData.inventory[0] == undefined)
                            {
                                const embed = new EmbedBuilder()
                                .setTitle('INVENTORY')
                                .setDescription ('Items that you have accumulated')
                                .setColor('Random')
                                .addFields(
                                {name: 'You have no items', value: 'Empty inventory'});
                                interaction.reply({embeds: [embed]});
                            }
                            else
                            {
                                const embed = new EmbedBuilder()
                                .setTitle('INVENTORY')
                                .setDescription ('Items that you have accumulated')
                                .setColor('Random')
                                for(var i = 0; i < newData.inventory.length; i++)
                                {
                                    embed.addFields(
                                    {name: newData.inventory[i], value: ' ', inline: true});
                                }
                                interaction.reply({embeds: [embed]});
                            }
                        }
                        else{interaction.reply('First do /start to create an account.');}
                    } 
                    catch (error) {console.log('Error: ' + error);}
                })();
            }
            else if(interaction.commandName == "use")
            {
                module.exports = (async (client, discord) =>
                {
                    let newData;
                    let guildData;
                    try
                    {
                        newData = await Economy.findOne({userId: interaction.member.id});
                        guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                        if(newData != null)
                        {
                            if(newData.inventory.includes(interaction.options.get('item').value))
                            {
                                if(interaction.options.get('item').value == "cashpass")
                                {
                                    if(newData.modifier != 4)
                                    {
                                        newData.cashpassTimer = Date.now() + 259200000;
                                        newData.modifier = newData.modifier * 2;
                                        interaction.reply('Your cash pass has been used, the modifier is at ' + newData.modifier + "x now");
                                        let index = newData.inventory.indexOf(interaction.options.get('item').value);
                                        newData.inventory.splice(index, 1);
                                    }
                                    else{interaction.reply('Your modifier is at 4x already! Wait for it to expire');}
                                }
                                else if(interaction.options.get('item').value == "invest")
                                {
                                    randNum = Math.random();
                                    if (randNum < 0.3 && guildData.enableItems[0])
                                    {
                                        newData.inventory.push('cashpass');
                                        interaction.reply('The investment became a Cash Pass!');
                                    }
                                    else if(randNum < 0.8 && guildData.enableItems[2])
                                    {
                                        newData.inventory.push('stocks');
                                        newData.stockTimer = Date.now() + 86400000;
                                        interaction.reply('The investment became Stocks!');
                                    }
                                    else if(randNum < 0.95 && guildData.enableItems[3])
                                    {
                                        newData.inventory.push('taskify')
                                        interaction.reply('The investment became Taskification!');
                                    }
                                    else if(randNum < 1 && guildData.enableItems[4])
                                    {
                                        newData.inventory.push('prestige')
                                        interaction.reply('The investment became Prestige!');
                                    }
                                    else
                                    {
                                        newData.balance += 10;
                                        interaction.reply('All items except this are disabled, so heres your money back.');
                                    }
                                    let index = newData.inventory.indexOf(interaction.options.get('item').value);
                                    newData.inventory.splice(index, 1);
                                }
                                else if(interaction.options.get('item').value == "stocks")
                                {
                                    if(Date.now() - newData.stockTimer < 0)
                                    {
                                        newData.balance += guildData.stockCosts;
                                        interaction.reply('You were able to resell the stocks for ' + guildData.stockCosts + 'curry cash!');
                                        let index = newData.inventory.indexOf(interaction.options.get('item').value);
                                        newData.inventory.splice(index, 1);
                                    }
                                    else{interaction.reply('Not enough time has passed to use the stock!');}
                                }
                                else if(interaction.options.get('item').value == "taskify")
                                {
                                    if(newData.taskMultiply == 1)
                                    {
                                        newData.taskMultiply = 0.5;
                                        interaction.reply('Task requirements have been permanently halved!');
                                    }
                                    else
                                    {
                                        interaction.reply('Task requirements have already been halved');
                                    }
                                    let index = newData.inventory.indexOf(interaction.options.get('item').value);
                                    newData.inventory.splice(index, 1);
                                }
                                else if(interaction.options.get('item').value == "prestige")
                                {
                                    newData.prestigeMultiply += 0.2;
                                    interaction.reply('Prestige has been applied!');
                                    newData.balance = 5;
                                    newData.itemAmt = 0;
                                    newData.inventory = [];
                                    newData.completedTask = [false, false, false];
                                    newData.roles = [false, false];
                                    newData.msgCount = 0;
                                    newData.reqTime = 2629746000;
                                    newData.dailyTimer = 0;
                                    newData.dailyStreak = 0;
                                    newData.modifier = 1;
                                    newData.taskMultiply = 1;
                                    newData.speakingAddon = 0;
                                    newData.ogAddon = 0;
                                    newData.dailyAddon = 0;
                                }
                                else if(guildData.customItemnames.includes(interaction.options.get('item').value))
                                {
                                    let itemname = interaction.options.get('item').value;
                                    let itemdesc = guildData.customItemdescs[guildData.customItemnames.indexOf(itemname)];
                                    interaction.reply('You used a custom item: ' + itemname + ', with a description of: ' + itemdesc + 
                                    "... Hopefully someone follows up on their promise.");

                                    let index = newData.inventory.indexOf(interaction.options.get('item').value);
                                    newData.inventory.splice(index, 1);
                                }

                                newData.save();
                            }
                            else{interaction.reply('That item either does not exist or is not in your inventory! Maybe there was a mistake in capitalization or spacing?');}
                        }
                        else{interaction.reply('First do /start to create an account.');}
                    }
                    catch (error) {console.log('Error: ' + error);}
                })();
            }
            else if(interaction.commandName == "give-cash")
            {
                module.exports = (async (client, discord) =>
                {
                    let newData;
                    let newData2;
                    try
                    {
                        newData = await Economy.findOne({userId: interaction.options.get('user').value});
                        newData2 = await Economy.findOne({userId: interaction.member.id});
                        if(newData != null)
                        {
                            if(newData2 != null)
                            {
                                if(interaction.options.get('amount').value < 0)
                                {
                                    interaction.reply('That is an invalid amount');
                                    return;
                                }
                                else if(interaction.options.get('amount').value > newData2.balance)
                                {
                                    interaction.reply('You do not have enough money!');
                                    return;
                                }
                                newData.balance += interaction.options.get('amount').value;
                                newData2.balance -= interaction.options.get('amount').value;
                                interaction.reply('(normal) Gave ' + interaction.options.get('amount').value + 
                                ' cash to <@' + interaction.options.get('user').value + '>');
                                newData.save();
                                newData2.save();
                            }
                            else{interaction.reply('First do /start to create an account.');}
                        }
                        else{interaction.reply('That user does not have an account!');}
                    }
                    catch (error) {console.log('Error: ' + error);}
                })();
            }
            else if(interaction.commandName == "reset")
            {
                module.exports = (async (client, discord) =>
                {
                    let newData
                    try
                    {
                        newData = await Economy.findOne({userId: interaction.member.id});

                        newData.balance = 5;
                        newData.itemAmt = 0;
                        newData.inventory = [];
                        newData.completedTask = [false, false, false, false];
                        newData.roles = [false, false];
                        newData.msgCount = 0;
                        newData.reqTime = 2629746000;
                        newData.dailyTimer = 0;
                        newData.dailyStreak = 0;
                        newData.modifier = 1;
                        newData.taskMultiply = 1;
                        newData.prestigeMultiply = 1;
                        newData.speakingAddon = 0;
                        newData.ogAddon = 0;
                        newData.dailyAddon = 0;
                        newData.embedCount = 0;
                        newData.cashpassTimer = 0;
                        newData.stockTimer = 0;
                        newData.embedCount = 0;

                        if(interaction.guild.roles.cache.find(r => r.name === "Rich"))
                        {
                            interaction.member.roles.remove(interaction.guild.roles.cache.find(r => r.name === "Rich"));
                        }
                        if(interaction.guild.roles.cache.find(r => r.name === "Spender"))
                        {
                            interaction.member.roles.remove(interaction.guild.roles.cache.find(r => r.name === "Spender"));
                        }

                        newData.save();
                        console.log('profile reset');
                        interaction.reply('Your profile has been reset');
                    }
                    catch (error) {console.log('Error: ' + error);}
                })();
            }
            else if(interaction.commandName == "anime")
            {
                let randNum = Math.random();
                if(randNum < 0.2)
                {
                    interaction.reply('ka... me... hA... ME... HAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                }
                else if(randNum < 0.4)
                {
                    interaction.reply('MAN GET YO 🫸 🔴 🔵 🫷 🫴 🟣 ASS OUTTA HERE');
                }
                else if(randNum < 0.6)
                {
                    interaction.reply('(╯°□°)╯︵ ┻━┻     SERIOUS TABLE FLIP');
                }
                else if(randNum < 0.8)
                {
                    interaction.reply('https://media.discordapp.net/attachments/1209514905271795732/1210335044066086912/cover6.png?ex=65ea2f59&is=65d7ba59&hm=67e470deddb68fd139a7e7aa9b7c8852c45f6b872045dd6f5ce1d5821223a52b&=&format=webp&quality=lossless&width=954&height=537');
                }
                else
                {
                    interaction.reply('https://tenor.com/view/saitama-genos-one-punch-man-incinerate-gif-25814228');
                }
            }
            else if(interaction.commandName == "curry")
            {
                let message = interaction.options.get('message').value;
                message = message.replaceAll("i","curry");
                message = message.replaceAll("I","curry");
                message = message.replaceAll("Me","curry");
                message = message.replaceAll("me","curry");
                message = message.replaceAll("You","curry");
                message = message.replaceAll("you","curry");
                interaction.reply(message);
            }
            else if(interaction.commandName == "say"){interaction.channel.send(interaction.options.get('message').value);}
            else if(interaction.commandName == "music")
            {
                (async(client, discord) =>
                {
                    let randNum = Math.random();
                    await interaction.deferReply();

                    if(randNum < 0.33)
                    {
                        await interaction.editReply({ files: ['./src/JUPITER.ogg'] });
                    }
                    else if(randNum < 0.67)
                    {
                        await interaction.editReply('https://www.youtube.com/watch?v=H12firDcRMI');
                    }
                    else
                    {
                        await interaction.editReply('https://www.youtube.com/watch?v=NCMlHAj0TW4');
                    }
                })();
            }
            else if(interaction.member.roles.cache.find(r => r.name === "Admin"))
            {
                if(interaction.commandName == "adminhelp")
                {
                    const embed = new EmbedBuilder()
                    .setTitle('ADMINHELP')
                    .setDescription ('This will show what the bot uses and how to manage commands')
                    .setColor('Random')
                    .addFields(
                    {name: 'What the bot uses', value: 'The bot tries to find roles named "Rich" or "Spender" when the \
                    roles command is used, and also uses message count and member join times for tasks.',},
                    {name: 'Managing commands', value: 'You can enable and disable the "Rich" and "Spender" roles, as \
                    well as tasks, and bonus tasks can be added too, though they will not be automatically redeemed and \
                    the points must be given manually through use of /admin-give-cash.  Shop items can also be removed and added, \
                    though extra items will not have a /use function. If any tasks were completed before being disabled \
                    then the rewards will still be redeemed. If items were bought before being removed, they will still persist'});

                    interaction.reply({embeds: [embed]});
                }
                else if(interaction.commandName == "disable-tasks")
                {
                    module.exports = (async (client, discord) =>
                    {
                        let guildData;
                        try
                        {
                            guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                            if(interaction.options.get('task').value != 4)
                            {
                                guildData.enableTasks[interaction.options.get('task').value] = false;
                            }
                            else
                            {
                                guildData.bonusTasknames = [];
                                guildData.bonusTaskdescriptions = [];
                            }
                            interaction.reply('Tasks disabled');
                            await guildData.save();
                        } 
                        catch (error) {console.log('Error: ' + error);}
                    })();
                }
                else if(interaction.commandName == "enable-tasks")
                {
                    module.exports = (async (client, discord) =>
                    {
                        let guildData;
                        try
                        {
                            guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                            guildData.enableTasks[interaction.options.get('task').value] = true;
                            interaction.reply('Tasks enabled');
                            await guildData.save();
                        } 
                        catch (error) {console.log('Error: ' + error);}
                    })();
                }
                else if(interaction.commandName == "add-bonus-task")
                {
                    module.exports = (async (client, discord) =>
                    {
                        let guildData;
                        try
                        {
                            guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                            if(guildData.bonusTasknames.length == 5)
                            {
                                interaction.reply('Too many bonus tasks!');
                            }
                            else
                            {
                                guildData.bonusTasknames.push(interaction.options.get('name').value);
                                guildData.bonusTaskdescriptions.push(interaction.options.get('description').value);
                                interaction.reply('Bonus task added');
                                await guildData.save();
                            }
                        } 
                        catch (error) {console.log('Error: ' + error);}
                    })();
                }
                else if(interaction.commandName == "admin-give-cash")
                {
                    module.exports = (async (client, discord) =>
                    {
                        let newData;
                        try
                        {
                            newData = await Economy.findOne({userId: interaction.options.get('user').value});
                            if(newData != null)
                            {
                                if(interaction.options.get('amount').value < 0)
                                {
                                    interaction.reply('That is an invalid amount');
                                    return;
                                }
                                newData.balance += interaction.options.get('amount').value;
                                interaction.reply('(admin) Gave ' + interaction.options.get('amount').value + 
                                ' cash to <@' + interaction.options.get('user').value + '>');
                                newData.save();
                            }
                            else{interaction.reply('That user does not have an account!');}
                        }
                        catch (error) {console.log('Error: ' + error);}
                    })();
                }
                else if(interaction.commandName == "admin-take-cash")
                {
                    module.exports = (async (client, discord) =>
                    {
                        let newData;
                        try
                        {
                            newData = await Economy.findOne({userId: interaction.options.get('user').value});
                            if(newData != null)
                            {
                                if(interaction.options.get('amount').value < 0)
                                {
                                    interaction.reply('That is an invalid amount');
                                    return;
                                }
                                newData.balance -= interaction.options.get('amount').value;
                                interaction.reply('(normal) Took ' + interaction.options.get('amount').value + 
                                ' cash from <@' + interaction.options.get('user').value + '>');
                                newData.save();
                            }
                            else{interaction.reply('That user does not have an account!');}
                        }
                        catch (error) {console.log('Error: ' + error);}
                    })();
                }
                else if(interaction.commandName == "disable-roles")
                {
                    module.exports = (async (client, discord) =>
                    {
                        let guildData;
                        try
                        {
                            guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                            guildData.enableRoles[interaction.options.get('role').value] = false;
                            interaction.reply('Roles disabled');
                            await guildData.save();
                        } 
                        catch (error) {console.log('Error: ' + error);}
                    })();
                }
                else if(interaction.commandName == "enable-roles")
                {
                    module.exports = (async (client, discord) =>
                    {
                        let guildData;
                        try
                        {
                            guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                            guildData.enableRoles[interaction.options.get('role').value] = true;
                            interaction.reply('Roles enabled');
                            await guildData.save();
                        } 
                        catch (error) {console.log('Error: ' + error);}
                    })();
                }
                else if(interaction.commandName == "shop-remove")
                {
                    module.exports = (async (client, discord) =>
                    {
                        let guildData;
                        try
                        {
                            guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                            if(interaction.options.get('item').value == "cashpass")
                            {
                                guildData.enableItems[0] = false;
                                interaction.reply('Item removed');
                                await guildData.save();
                            }
                            else if(interaction.options.get('item').value == "invest")
                            {
                                guildData.enableItems[1] = false;
                                interaction.reply('Item removed');
                                await guildData.save();
                            }
                            else if(interaction.options.get('item').value == "stocks")
                            {
                                guildData.enableItems[2] = false;
                                interaction.reply('Item removed');
                                await guildData.save();
                            }
                            else if(interaction.options.get('item').value == "taskify")
                            {
                                guildData.enableItems[3] = false;
                                interaction.reply('Item removed');
                                await guildData.save();
                            }
                            else if(interaction.options.get('item').value == "prestige")
                            {
                                guildData.enableItems[4] = false;
                                interaction.reply('Item removed');
                                await guildData.save();
                            }
                            else if(guildData.customItemnames.includes(interaction.options.get('item').value))
                            {
                                let index = guildData.customItemnames.indexOf(interaction.options.get('item').value);
                                guildData.customItemnames.splice(index, index);
                                guildData.customItemdescs.splice(index, index);
                                guildData.customItemprices.splice(index, index);
                            }
                            else{interaction.reply('That item does not exist! Maybe there was a mistake in capitalization or spacing?');}
                        } 
                        catch (error) {console.log('Error: ' + error);}
                    })();
                }
                else if(interaction.commandName == "shop-remove-undo")
                {
                    module.exports = (async (client, discord) =>
                    {
                        let guildData;
                        try
                        {
                            guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                            guildData.enableItems[interaction.options.get('item').value] = true;
                            interaction.reply('Item remove undone');
                            await guildData.save();
                        } 
                        catch (error) {console.log('Error: ' + error);}
                    })();
                }
                else if(interaction.commandName == "shop-add")
                {
                    module.exports = (async (client, discord) =>
                    {
                        let guildData;
                        try
                        {
                            guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                            guildData.customItemnames.push(interaction.options.get('name').value);
                            guildData.customItemdescs.push(interaction.options.get('description').value);
                            guildData.customItemprices.push(interaction.options.get('price').value);
                            interaction.reply('Custom item added');
                            await guildData.save();
                        } 
                        catch (error) {console.log('Error: ' + error);}
                    })();
                }
            }
            else{interaction.reply('To use admin commands, have the role "Admin"');}
        }
    }
);