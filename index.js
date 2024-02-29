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
                taskRequirements: [50, 30, 7, 14],
                itemPrices: [27, 10, 15, 50, 100],
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
                    taskRequirements: [50, 30, 7, 14],
                    itemPrices: [27, 10, 15, 50, 100],
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
                    if(newData.msgCount % (guildData.taskRequirements[0] * newData.taskMultiply) == 0)
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
                        newData.reqTime += guildData.taskRequirements[1] * 86400000;
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
                            guildData.stockCosts = guildData.itemPrices[2];
                        }
                        await guildData.save();
                    }
                    else
                    {
                        if(stockRand <= 0.47)
                        {
                            guildData.stockCosts = Math.round(guildData.stockCosts * 0.8);
                        }
                        else if(guildData.stockCosts < 30)
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
                        if(newData.embedCount >= guildData.taskRequirements[3] * newData.taskMultiply)
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
                            if(newData.dailyTimer == 0)
                            {
                                newData.dailyStreak = 1;
                                newData.dailyTimer = Date.now() + 172800000;
                                interaction.channel.send("<@" + interaction.member.id + ">, daily streak at "
                                + newData.dailyStreak + ", " + (guildData.taskRequirements[2] * newData.taskMultiply) + " days and you'll fulfill a task!");
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
                                + newData.dailyStreak + ", " + (guildData.taskRequirements[2] * newData.taskMultiply) + " days and you'll fulfill a task!");
                            }
                            if(newData.dailyStreak % (guildData.taskRequirements[2] * newData.taskMultiply) == 0)
                            {
                                interaction.channel.send("<@" + interaction.member.id + ">, your daily streak \
                                is at " + (guildData.taskRequirements[2] * newData.taskMultiply) + " days, meaning you have completed the Streak task for " + (10 + newData.dailyAddon) + " cash!");
                                newData.completedTask[2] = true;
                                newData.taskMoney += 10 + newData.dailyAddon;
                                if(newData.dailyAddon != 20)
                                {
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
                {name: '/roles', value: 'Adds rich role if over 150 curry cash, adds spender role if \
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
                        await interaction.deferReply();
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
                            interaction.editReply('Account has been made, do /start again to learn more about the bot.');
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

                            interaction.editReply({embeds: [embed]});
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
                        await interaction.deferReply();
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
                                        if(newData.balance >= guildData.itemPrices[0])
                                        {
                                            interaction.editReply('The cash pass has been bought for ' + guildData.itemPrices[0] + ' curry cash!');
                                            newData.itemAmt++;
                                            newData.balance = newData.balance - guildData.itemPrices[0];
                                            newData.inventory.push("cashpass");
                                            await newData.save();
                                        }
                                        else{interaction.editReply('You do not have enough money!');}
                                    }
                                    else{interaction.editReply('That item has been removed');}
                                }
                                else if(interaction.options.get('item').value == 'invest')
                                {
                                    if(guildData.enableItems[1])
                                    {
                                        if(newData.balance >= guildData.itemPrices[1])
                                        {
                                            interaction.editReply('You payed ' + guildData.itemPrices[1] + ' curry cash to invest! Use item to get a random one...');
                                            newData.itemAmt++;
                                            newData.balance = newData.balance - guildData.itemPrices[1];
                                            newData.inventory.push("invest");
                                            await newData.save();
                                        }
                                        else{interaction.editReply('You do not have enough money!');}
                                    }
                                    else{interaction.editReply('That item has been removed');}
                                }
                                else if(interaction.options.get('item').value == 'stocks')
                                {
                                    if(guildData.enableItems[2])
                                    {
                                        if(newData.balance >= guildData.stockCosts)
                                        {
                                            interaction.editReply('You payed ' + guildData.stockCosts + ' curry cash for stocks! Lets see what the market thinks...');
                                            newData.itemAmt++;
                                            newData.balance = newData.balance - guildData.stockCosts;
                                            newData.stockTimer = Date.now() + 86400000;
                                            newData.inventory.push("stocks");
                                            await newData.save();
                                        }
                                        else{interaction.editReply('You do not have enough money!');}
                                    }
                                    else{interaction.editReply('That item has been removed');}
                                }
                                else if(interaction.options.get('item').value == 'taskify')
                                {
                                    if(guildData.enableItems[3])
                                    {
                                        if(newData.balance >= guildData.itemPrices[3])
                                        {
                                            interaction.editReply('You payed ' + guildData.itemPrices[3] + ' curry cash for a taskification! Easy money BOIII');
                                            newData.itemAmt++;
                                            newData.balance = newData.balance - guildData.itemPrices[3];
                                            newData.inventory.push("taskify");
                                            await newData.save();
                                        }
                                        else{interaction.editReply('You do not have enough money!');}
                                    }
                                    else{interaction.editReply('That item has been removed');}
                                }
                                else if(interaction.options.get('item').value == 'prestige')
                                {
                                    if(guildData.enableItems[4])
                                    {
                                        if(newData.balance >= guildData.itemPrices[4])
                                        {
                                            interaction.editReply('You payed ' + guildData.itemPrices[4] + ' curry cash for a prestige! Use it knowing the consequences...');
                                            newData.itemAmt++;
                                            newData.balance = newData.balance - guildData.itemPrices[4];
                                            newData.inventory.push("prestige");
                                            await newData.save();
                                        }
                                        else{interaction.editReply('You do not have enough money!');}
                                    }
                                    else{interaction.editReply('That item has been removed');}
                                }
                                else if(guildData.customItemnames.includes(interaction.options.get('item').value))
                                {
                                    let itemname = interaction.options.get('item').value;
                                    let itemdesc = guildData.customItemdescs[guildData.customItemnames.indexOf(itemname)];
                                    let itemprice = guildData.customItemprices[guildData.customItemnames.indexOf(itemname)];

                                    if(newData.balance >= itemprice)
                                    {
                                        interaction.editReply('You payed ' + itemprice + ' curry cash for ' + itemname + "!");
                                        newData.itemAmt++;
                                        newData.balance = newData.balance - itemprice;
                                        newData.inventory.push(itemname);
                                        await newData.save();
                                    }
                                    else{interaction.editReply('You do not have enough money!');}
                                }
                                else{interaction.editReply('That item does not exist! Maybe there was a mistake in capitalization or spacing?');}
                            }
                            else{interaction.editReply('Your inventory is too big! Use some items first');}
                        }
                        else{interaction.editReply('First do /start to create an account.');}
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
                        await interaction.deferReply();
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
                                ({name: 'Next possible higher value', value: 'Stocks may raise to ' + guildData.itemPrices[2] + ' curry cash'});

                                interaction.editReply({embeds: [embed]});
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

                                interaction.editReply({embeds: [embed]});
                            }
                        }
                        else{interaction.editReply('The stock item is disabled!');}
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
                        await interaction.deferReply();
                        guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                        const embed = new EmbedBuilder()
                        .setTitle('SHOP ITEMS')
                        .setDescription ('These are the items available to purchase')
                        .setColor('Random')
                        if(guildData.enableItems[0])
                        {
                            embed.addFields
                            ({name: 'Cash Pass (cashpass in commands)', value: 'Will multiply the values of task income by 2x for \
                            3 days (doesnt affect custom tasks). Can be stacked once to make a 4x multiplier that lasts 3 days but thats it. PRICE: ' + guildData.itemPrices[0] + ' CURRY CASH'})
                        }
                        else{embed.addFields({name: 'Cash Pass', value: 'REMOVED'});}
                        if(guildData.enableItems[1])
                        {
                            embed.addFields
                            ({name: 'Investment (invest in commands)', value: 'Will randomly choose an item from the shop (will not choose a custom item), more expensive \
                            = less chance. PRICE: ' + guildData.itemPrices[1] + ' CURRY CASH'})
                        }
                        else{embed.addFields({name: 'Investment', value: 'REMOVED'});}
                        if(guildData.enableItems[2])
                        {
                            embed.addFields
                            ({name: 'Stocks (stocks in commands)', value: 'An item that will fluctuate in price and can be sold a day after buying with /use. \
                            BASE PRICE: ' + guildData.itemPrices[2] + ' CURRY CASH - CURRENT PRICE: ' + guildData.stockCosts})
                        }
                        else{embed.addFields({name: 'Stocks', value: 'REMOVED'});}
                        if(guildData.enableItems[3])
                        {
                            embed.addFields
                            ({name: 'Taskification (taskify in commands)', value: 'Halves task requirements until reset or prestige (doesnt affect custom tasks), but can only be bought once. \
                            PRICE: ' + guildData.itemPrices[3] + ' CURRY CASH'})
                        }
                        else{embed.addFields({name: 'Taskification', value: 'REMOVED'});}
                        if(guildData.enableItems[4])
                        {
                            embed.addFields
                            ({name: 'Prestige (prestige in commands)', value: 'Resets progress, but adds an extra .2x multiplier to task income each time (doesnt affect custom tasks). \
                            PRICE: ' + guildData.itemPrices[4] + ' CURRY CASH'})
                        }
                        else{embed.addFields({name: 'Prestige', value: 'REMOVED'});}
                        for(var i = 0; i < guildData.customItemnames.length; i++)
                        {
                            let itemname = guildData.customItemnames[i];
                            let itemdesc = guildData.customItemdescs[i];
                            let itemprice = guildData.customItemprices[i];
                            embed.addFields
                            ({name: itemname, value: itemdesc + "...PRICE: " + itemprice});
                        }

                        interaction.editReply({embeds: [embed]});
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
                            await interaction.deferReply();
                            newData = await Economy.findOne({userId: interaction.member.id});
                            if (newData != null)
                            {
                                const embed = new EmbedBuilder()
                                .setTitle('CURRY CASH BALANCE')
                                .setDescription ('Your balance is: ' + newData.balance)
                                .setColor('Random');

                                interaction.editReply({embeds: [embed]});
                            }
                            else{interaction.editReply('First do /start to create an account.');}
                        }
                        else
                        {
                            await interaction.deferReply();
                            newData2 = await Economy.findOne({userId: interaction.options.get('user').value});
                            if(!newData2){interaction.editReply('That user does not have an account!');}
                            else
                            {
                                const embed = new EmbedBuilder()
                                .setTitle("CURRY CASH BALANCE")
                                .setDescription ('Their balance is: ' + newData2.balance)
                                .setColor('Random');

                                interaction.editReply({embeds: [embed]});
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
                        await interaction.deferReply();
                        newData = await Economy.findOne({userId: interaction.member.user.id});
                        guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                        if (newData != null)
                        {
                            if(guildData.enableRoles[0])
                            {
                                if(newData.balance > 150 && newData.roles[0] == false) 
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
                            interaction.editReply('Done checking roles');
                        }
                        else{interaction.editReply('First do /start to create an account.');}
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
                        await interaction.deferReply();
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
                                    {name: 'Speaking', value: 'Be active on the server with an extra ' + guildData.taskRequirements[0] + ' messages (' + (guildData.taskRequirements[0] / 2) + ' messages with taskification) \
                                    to gain 5 curry cash. Youve posted ' + newData.msgCount + ' messages!! \
                                    Every conpletion the reward goes up by one, the 2nd completion give 6 cash, the 3rd completion gives 7 cash, all \
                                    the way up to 10 cash, the 6th completion.'});
                                }
                                else{embed.addFields({name: 'Speaking', value: 'DISABLED'});}
                                if(guildData.enableTasks[1])
                                {
                                    embed.addFields(
                                    {name: 'OG member', value: 'Stay on the server for an extra ' + guildData.taskRequirements[1] + ' days (' + (guildData.taskRequirements[1] / 2) + ' days with taskification) \
                                    to gain 10 curry cash each time (the length of time that you stay on the server is checked every message). Youve been on the server for '
                                    + Math.round((Date.now() - interaction.member.joinedTimestamp) / 86400000) + ' days out of ' + Math.round(newData.reqTime * newData.taskMultiply / 86400000) + ' days!! \
                                    Every completion the amount will increase by 1, so 2nd completion gives 11 cash, 3rd completion gives 12 cash, all the \
                                    way to 15 cash, the 6th completions.'});
                                }
                                else{embed.addFields({name: 'OG member', value: 'DISABLED'});}
                                if(guildData.enableTasks[2])
                                {
                                    embed.addFields(
                                    {name: 'Streak', value: 'Use the bot every day for ' + guildData.taskRequirements[2] + ' days (' + (guildData.taskRequirements[2] / 2) + ' days with taskification) to get 10 curry cash. Your streak is at '
                                    + newData.dailyStreak + "!! Every extra completion gives \
                                    2 more curry cash, so 2nd completion gives 12 cash, 3rd completion gives 14 cash, all the way \
                                    up to 20 cash which is the 6th completion"});
                                }
                                if(guildData.enableTasks[3])
                                {
                                    embed.addFields(
                                    {name: 'Media', value: 'Are you keen sharing media that you or others made? Post ' + guildData.taskRequirements[3] + ' embeds (' + (guildData.taskRequirements[2] / 2) + ' embeds with taskification) to get 5 curry cash. Your embed count is at '
                                    + newData.embedCount + "!! Every completion increases the reward by 1 cash, so 2nd completion gives 6 cash, \
                                    3rd completion give 7 cash, all the way up to 10 cash which would need the 6th completion."});
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

                                interaction.editReply({embeds: [embed]});
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
                                interaction.editReply('You earned ' + newData.taskMoney + ' (x' + newData.modifier + ') (x' + newData.prestigeMultiply + ') from completed tasks!');
                                newData.balance += newData.taskMoney * newData.modifier * newData.prestigeMultiply;
                                newData.taskMoney = 0;
                                newData.completedTask = [false, false, false];
                                await newData.save();
                            }
                        }
                        else{interaction.editReply('First do /start to create an account.');}
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
                        await interaction.deferReply();
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
                                interaction.editReply({embeds: [embed]});
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
                                interaction.editReply({embeds: [embed]});
                            }
                        }
                        else{interaction.editReply('First do /start to create an account.');}
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
                        await interaction.deferReply();
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
                                        interaction.editReply('Your cash pass has been used, the modifier is at ' + newData.modifier + "x now");
                                        let index = newData.inventory.indexOf(interaction.options.get('item').value);
                                        newData.inventory.splice(index, 1);
                                    }
                                    else{interaction.editReply('Your modifier is at 4x already! Wait for it to expire');}
                                }
                                else if(interaction.options.get('item').value == "invest")
                                {
                                    randNum = Math.random();
                                    if (randNum < 0.3 && guildData.enableItems[0])
                                    {
                                        let index = newData.inventory.indexOf(interaction.options.get('item').value);
                                        newData.inventory.splice(index, 1);
                                        newData.inventory.push('cashpass');
                                        interaction.editReply('The investment became a Cash Pass!');
                                    }
                                    else if(randNum < 0.8 && guildData.enableItems[2])
                                    {
                                        let index = newData.inventory.indexOf(interaction.options.get('item').value);
                                        newData.inventory.splice(index, 1);
                                        newData.inventory.push('stocks');
                                        newData.stockTimer = Date.now() + 86400000;
                                        interaction.editReply('The investment became Stocks!');
                                    }
                                    else if(randNum < 0.95 && guildData.enableItems[3])
                                    {
                                        let index = newData.inventory.indexOf(interaction.options.get('item').value);
                                        newData.inventory.splice(index, 1);
                                        newData.inventory.push('taskify')
                                        interaction.editReply('The investment became Taskification!');
                                    }
                                    else if(randNum < 1 && guildData.enableItems[4])
                                    {
                                        let index = newData.inventory.indexOf(interaction.options.get('item').value);
                                        newData.inventory.splice(index, 1);
                                        newData.inventory.push('prestige')
                                        interaction.editReply('The investment became Prestige!');
                                    }
                                    else
                                    {
                                        interaction.editReply('The item rolled was disabled, roll again');
                                    }
                                }
                                else if(interaction.options.get('item').value == "stocks")
                                {
                                    if(newData - Date.now() <= 0)
                                    {
                                        newData.balance += guildData.stockCosts;
                                        interaction.editReply('You were able to resell the stocks for ' + guildData.stockCosts + 'curry cash!');
                                        let index = newData.inventory.indexOf(interaction.options.get('item').value);
                                        newData.inventory.splice(index, 1);
                                    }
                                    else{interaction.editReply('Not enough time has passed to use the stock!');}
                                }
                                else if(interaction.options.get('item').value == "taskify")
                                {
                                    if(newData.taskMultiply == 1)
                                    {
                                        newData.taskMultiply = 0.5;
                                        interaction.editReply('Task requirements have been permanently halved!');
                                    }
                                    else
                                    {
                                        interaction.editReply('Task requirements have already been halved');
                                    }
                                    let index = newData.inventory.indexOf(interaction.options.get('item').value);
                                    newData.inventory.splice(index, 1);
                                }
                                else if(interaction.options.get('item').value == "prestige")
                                {
                                    newData.prestigeMultiply += 0.2;
                                    interaction.editReply('Prestige has been applied!');
                                    newData.balance = 5;
                                    newData.itemAmt = 0;
                                    newData.inventory = [];
                                    newData.completedTask = [false, false, false];
                                    newData.roles = [false, false];
                                    newData.msgCount = 0;
                                    newData.reqTime = 2629746000;
                                    newData.dailyTimer = 0;
                                    newData.dailyStreak = 0;
                                    newData.taskMoney = 0;
                                    newData.modifier = 1;
                                    newData.taskMultiply = 1;
                                    newData.speakingAddon = 0;
                                    newData.ogAddon = 0;
                                    newData.dailyAddon = 0;
                                    newData.embedAddon = 0;
                                    newData.cashpassTimer = 0;
                                    newData.stockTimer = 0;
                                    newData.embedCount = 0;
                                }
                                else if(guildData.customItemnames.includes(interaction.options.get('item').value))
                                {
                                    let itemname = interaction.options.get('item').value;
                                    let itemdesc = guildData.customItemdescs[guildData.customItemnames.indexOf(itemname)];
                                    interaction.editReply('You used a custom item: ' + itemname + ', with a description of: ' + itemdesc + 
                                    "... Hopefully someone follows up on their promise.");

                                    let index = newData.inventory.indexOf(interaction.options.get('item').value);
                                    newData.inventory.splice(index, 1);
                                }

                                newData.save();
                            }
                            else{interaction.editReply('That item either does not exist or is not in your inventory! Maybe there was a mistake in capitalization or spacing?');}
                        }
                        else{interaction.editReply('First do /start to create an account.');}
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
                        await interaction.deferReply();
                        newData = await Economy.findOne({userId: interaction.options.get('user').value});
                        newData2 = await Economy.findOne({userId: interaction.member.id});
                        if(newData != null)
                        {
                            if(newData2 != null)
                            {
                                if(interaction.options.get('amount').value < 0)
                                {
                                    interaction.editReply('That is an invalid amount');
                                    return;
                                }
                                else if(interaction.options.get('amount').value > newData2.balance)
                                {
                                    interaction.editReply('You do not have enough money!');
                                    return;
                                }
                                newData.balance += interaction.options.get('amount').value;
                                newData2.balance -= interaction.options.get('amount').value;
                                interaction.editReply('(normal) Gave ' + interaction.options.get('amount').value + 
                                ' cash to <@' + interaction.options.get('user').value + '>');
                                newData.save();
                                newData2.save();
                            }
                            else{interaction.editReply('First do /start to create an account.');}
                        }
                        else{interaction.editReply('That user does not have an account!');}
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
                        await interaction.deferReply();
                        newData = await Economy.findOne({userId: interaction.member.id});
                        if(newData != null)
                        {
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
                            interaction.editReply('Your profile has been reset');
                        }
                        else{interaction.editReply("First do /start to create an account");}
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
                        await interaction.editReply({ files: ['./JUPITER.ogg'] });
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
                            await interaction.deferReply();
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
                            interaction.editReply('Tasks disabled');
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
                            await interaction.deferReply();
                            guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                            guildData.enableTasks[interaction.options.get('task').value] = true;
                            interaction.editReply('Tasks enabled');
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
                            await interaction.deferReply();
                            guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                            if(guildData.bonusTasknames.length == 10)
                            {
                                interaction.editReply('Too many bonus tasks!');
                            }
                            else
                            {
                                guildData.bonusTasknames.push(interaction.options.get('name').value);
                                guildData.bonusTaskdescriptions.push(interaction.options.get('description').value);
                                interaction.editReply('Bonus task added');
                                await guildData.save();
                            }
                        } 
                        catch (error) {console.log('Error: ' + error);}
                    })();
                }
                else if(interaction.commandName == "edit-task")
                {
                    module.exports = (async (client, discord) =>
                    {
                        let guildData;
                        try
                        {
                            await interaction.deferReply();
                            guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                            if(guildData.enableTasks[interaction.options.get('task').value])
                            {
                                if(interaction.options.get('amount').value % 2 == 0)
                                {
                                    guildData.taskRequirements[interaction.options.get('task').value] = interaction.options.get('amount').value;
                                    interaction.editReply('Set task ' + (interaction.options.get('task').value + 1) + ' requirement to ' + interaction.options.get('amount').value);
                                    await guildData.save();
                                }
                                else{interaction.editReply('The amount is not even and cannot work with taskification... choose a different amount');}
                            }
                            else{interaction.editReply('That task is disabled!');}
                        } catch (error) {console.log("Error: " + error);}
                    })();
                }
                else if(interaction.commandName == "admin-give-cash")
                {
                    module.exports = (async (client, discord) =>
                    {
                        let newData;
                        try
                        {
                            await interaction.deferReply();
                            newData = await Economy.findOne({userId: interaction.options.get('user').value});
                            if(newData != null)
                            {
                                if(interaction.options.get('amount').value < 0)
                                {
                                    interaction.editReply('That is an invalid amount');
                                    return;
                                }
                                newData.balance += interaction.options.get('amount').value;
                                interaction.editReply('(admin) Gave ' + interaction.options.get('amount').value + 
                                ' cash to <@' + interaction.options.get('user').value + '>');
                                newData.save();
                            }
                            else{interaction.editReply('That user does not have an account!');}
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
                            await interaction.deferReply();
                            newData = await Economy.findOne({userId: interaction.options.get('user').value});
                            if(newData != null)
                            {
                                if(interaction.options.get('amount').value < 0)
                                {
                                    interaction.editReply('That is an invalid amount');
                                    return;
                                }
                                newData.balance -= interaction.options.get('amount').value;
                                interaction.editReply('(normal) Took ' + interaction.options.get('amount').value + 
                                ' cash from <@' + interaction.options.get('user').value + '>');
                                newData.save();
                            }
                            else{interaction.editReply('That user does not have an account!');}
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
                            await interaction.deferReply();
                            guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                            guildData.enableRoles[interaction.options.get('role').value] = false;
                            interaction.editReply('Roles disabled');
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
                            await interaction.deferReply();
                            guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                            guildData.enableRoles[interaction.options.get('role').value] = true;
                            interaction.editReply('Roles enabled');
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
                            await interaction.deferReply();
                            guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                            if(interaction.options.get('item').value == "cashpass")
                            {
                                guildData.enableItems[0] = false;
                                interaction.editReply('Item removed');
                                await guildData.save();
                            }
                            else if(interaction.options.get('item').value == "invest")
                            {
                                guildData.enableItems[1] = false;
                                interaction.editReply('Item removed');
                                await guildData.save();
                            }
                            else if(interaction.options.get('item').value == "stocks")
                            {
                                guildData.enableItems[2] = false;
                                interaction.editReply('Item removed');
                                await guildData.save();
                            }
                            else if(interaction.options.get('item').value == "taskify")
                            {
                                guildData.enableItems[3] = false;
                                interaction.editReply('Item removed');
                                await guildData.save();
                            }
                            else if(interaction.options.get('item').value == "prestige")
                            {
                                guildData.enableItems[4] = false;
                                interaction.editReply('Item removed');
                                await guildData.save();
                            }
                            else if(guildData.customItemnames.includes(interaction.options.get('item').value))
                            {
                                let index = guildData.customItemnames.indexOf(interaction.options.get('item').value);
                                guildData.customItemnames.splice(index, index);
                                guildData.customItemdescs.splice(index, index);
                                guildData.customItemprices.splice(index, index);
                                interaction.editReply('Item removed');
                                await guildData.save();
                            }
                            else{interaction.editReply('That item does not exist! Maybe there was a mistake in capitalization or spacing?');}
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
                            await interaction.deferReply();
                            guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                            guildData.enableItems[interaction.options.get('item').value] = true;
                            interaction.editReply('Item remove undone');
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
                            await interaction.deferReply();
                            guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                            guildData.customItemnames.push(interaction.options.get('name').value);
                            guildData.customItemdescs.push(interaction.options.get('description').value);
                            guildData.customItemprices.push(interaction.options.get('price').value);
                            interaction.editReply('Custom item added');
                            await guildData.save();
                        } 
                        catch (error) {console.log('Error: ' + error);}
                    })();
                }
                else if(interaction.commandName == "edit-shop")
                {
                    module.exports = (async (client, discord) =>
                    {
                        let guildData;
                        try
                        {
                            await interaction.deferReply();
                            guildData = await guildInfo.findOne({guildId: interaction.guild.id});
                            if(guildData.enableItems[interaction.options.get('item').value])
                            {
                                guildData.itemPrices[interaction.options.get('item').value] = interaction.options.get('price').value;
                                interaction.editReply('Set price of item ' + (interaction.options.get('item').value + 1) + ' to ' + interaction.options.get('price').value);
                                await guildData.save();
                            }
                            else{interaction.editReply('That item is removed!');}
                        } catch (error) {console.log("Error: " + error);}
                    })();
                }
            }
            else{interaction.reply('To use admin commands, have the role "Admin"');}
        }
    }
);