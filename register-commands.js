require('dotenv').config();
const {REST, Routes, ApplicationCommandOptionType} = require('discord.js');

const commands = 
[
    {
        name: 'help',
        description: 'Gives a help message on how to use the bot'
    },
    {
        name: 'adminhelp',
        description: 'Gives admins a help message on how to manage bot functions and roles'
    },
    {
        name: 'balance',
        description: "Shows yours or someone else's current balance",
        options:
        [
            {
                name: 'user',
                description: 'The user to check the balance',
                type: ApplicationCommandOptionType.User
            },
        ]
    },
    {
        name: 'start',
        description: 'Creates a starter account and gives guides on commands'
    },
    {
        name: 'tasks',
        description: 'Earn money from completing'
    },
    {
        name: 'disable-tasks',
        description: 'Allows admins to disable tasks',
        options: 
        [
            {
                name: 'task',
                description: 'The task that should be removed',
                type: ApplicationCommandOptionType.Number,
                choices: 
                [
                    {name: "Speaking", value: 0},
                    {name: "OG member", value: 1},
                    {name: "Streak", value: 2},
                    {name: "Media", value: 3},
                    {name: "(clear) All bonus tasks", value: 4},
                ],
                required: true
            }
        ]
    },
    {
        name: 'enable-tasks',
        description: 'Allows admins to enable tasks',
        options: 
        [
            {
                name: 'task',
                description: 'The task that should be enabled',
                type: ApplicationCommandOptionType.Number,
                choices: 
                [
                    {name: "Speaking", value: 0},
                    {name: "OG member", value: 1},
                    {name: "Streak", value: 2},
                    {name: "Media", value: 3},
                ],
                required: true
            }
        ]
    },
    {
        name: 'add-bonus-task',
        description: 'Allows admins to specify bonus tasks and add them to the list (MAX 5)',
        options:
        [
            {
                name: 'name',
                description: 'The name of the added task',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'description',
                description: 'The description of the added task (including reward)',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'give-cash',
        description: 'Gift cash to users with your own money',
        options:
        [
            {
                name: 'user',
                description: 'The user to gift cash to',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'amount',
                description: 'The amount of currycash to gift',
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    {
        name: 'admin-give-cash',
        description: 'Allows admins to gift cash to users for completing bonus tasks without subtracting from balance',
        options:
        [
            {
                name: 'user',
                description: 'The user to gift cash to',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'amount',
                description: 'The amount of currycash to gift (does not affect your own balance)',
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    {
        name: 'admin-take-cash',
        description: 'Allows admins to take cash from other users for server reasons',
        options:
        [
            {
                name: 'user',
                description: 'The user to take cash from',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'amount',
                description: 'The amount of currycash to take',
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    {
        name: 'roles',
        description: 'Checks if you meet the requirements for rich or spender'
    },
    {
        name: 'disable-roles',
        description: 'Allows admins to disable roles',
        options:
        [
            {
                name: 'role',
                description: 'The name of the role to be disabled',
                type: ApplicationCommandOptionType.Number,
                choices: 
                [
                    {name: "Rich", value: 0},
                    {name: "Spender", value: 1}
                ],
                required: true
            }
        ]
    },
    {
        name: 'stocks',
        description: 'Checks the price of stocks'
    },
    {
        name: 'enable-roles',
        description: 'Allows admins to enable roles',
        options:
        [
            {
                name: 'role',
                description: 'The name of the role to be enabled',
                type: ApplicationCommandOptionType.Number,
                choices: 
                [
                    {name: "Rich", value: 0},
                    {name: "Spender", value: 1}
                ],
                required: true
            }
        ]
    },
    {
        name: 'inventory',
        description: 'Checks your inventory'
    },
    {
        name: 'shop-buy',
        description: 'Buy items available in the shop',
        options: 
        [
            {
                name: 'item',
                description: 'The item wanted to buy from the shop (cashpass, stocks, any added items etc.)',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'shop-remove',
        description: 'Allows admins to remove items from the shop',
        options:
        [
            {
                name: 'item',
                description: 'The name of the item to be removed (cashpass, stocks, any added items etc.)',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'shop-remove-undo',
        description: 'Allows admins to add removed original items back to the shop, custom ones must be remade',
        options:
        [
            {
                name: 'item',
                description: 'The name of the item to be added back',
                type: ApplicationCommandOptionType.Number,
                choices: 
                [
                    {name: 'cash-pass', value: 0},
                    {name: 'investment', value: 1},
                    {name: 'stocks', value: 2},
                    {name: 'taskify', value: 3},
                    {name: 'prestige', value: 4},
                ],
                required: true
            }
        ]
    },
    {
        name: 'shop-add',
        description: 'Allows admins to add items to the shop',
        options:
        [
            {
                name: 'name',
                description: 'The name of the added item',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'description',
                description: 'The description of the added item',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'price',
                description: 'The price of the added item',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'shop-view',
        description: 'Allows viewing the shop'
    },
    {
        name: 'use',
        description: 'Uses an item, custom items must be "used" manually as this just removes them from inventory',
        options:
        [
            {
                name: 'item',
                description: 'The name of the item to be used (cashpass, stocks, any added items etc.)',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'reset',
        description: 'Resets your account, including prestige'
    },
    {
        name: 'anime',
        description: 'Random anime phrase go brrrr'
    },
    {
        name: 'curry',
        description: 'Replaces "i", "me" and "you" with "curry"',
        options:
        [
            {
                name: 'message',
                description: 'The message wished to be curry-fied',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'say',
        description: 'Make the bot say something',
        options:
        [
            {
                name: 'message',
                description: 'The message wished to be said',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'music',
        description: 'Sends music'
    },
];

const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

(async() => 
{
    try 
    {
        console.log('Registering slash commands');
        await rest.put
        (
            Routes.applicationCommands(process.env.CLIENT_ID),
            {body: commands}
        )
        console.log('Slash commands registered');
    }
    catch (error)
    {
       console.log('There was an error: ' + error); 
    }
})();