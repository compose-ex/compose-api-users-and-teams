#!/usr/bin/env node
const yargs = require('yargs'); 
const fetch = require('node-fetch');

let apibase = 'https://api.compose.io/2016-07';  
let apitoken = process.env.COMPOSEAPITOKEN;  

let apiheaders = {  
    "Authorization": "Bearer " + apitoken,
    "Content-Type": "application/json"
};

// get all accounts for which the user is a member of
let userAccounts = () => {
    fetch(`${apibase}/accounts/`, { headers: apiheaders })
    .then(res => {
        return res.json();
    })
    .then(json => {
        let accounts = json["_embedded"].accounts;
        for (let account of accounts) {
            console.log(`Account id: ${account.id}`)
        }
    })
    .catch(err => {
        console.log(err);
    });
}

// list all users of an account
let listUsers = (accountid) => {
    fetch(`${apibase}/accounts/${accountid}/users`, { headers: apiheaders })
    .then(res => {
        return res.json();
    })
    .then(json => {
        let users = json["_embedded"].users;
        for (let user of users) {
            console.log(`${user.id} ${user.name}`);
        }
    })
    .catch(err => {
        console.log(err);
    });
};

// creates a new user on the account
let createUser = (accountid, name, email, phone) => {
    let userInfo = JSON.stringify({"name": name, "email": email, "phone": phone});
    fetch(`${apibase}/accounts/${accountid}/users`, { headers: apiheaders, method: 'POST', body: userInfo })
    .then(res => {
        return res.json();
    })
    .then(json => {
        console.log(`Added user: ${json.id} ${json.name}`);
    })
    .catch(err => {
        console.log(err);
    });
}

// removes a user
let removeUser = (accountid, userid) => {
    fetch(`${apibase}/accounts/${accountid}/users/${userid}`, { headers: apiheaders, method: 'DELETE' })
    .then(res => {
        return res.json();
    })
    .then(json => {
        console.log(`Removed user: ${json.id} ${json.name}`);
    })
    .catch(err => {
        console.log(err);
    });
}

// list all teams on account
let listTeams = () => {
    fetch(`${apibase}/teams`, { headers: apiheaders })
    .then(res => {
        return res.json();
    })
    .then(json => {
        let teams = json["_embedded"].teams;
        for (let team of teams) {
            console.log(`${team.id} ${team.name} ${JSON.stringify(team.users)}`)
        }
    })
    .catch(err => {
        console.log(err);
    });
}

// create new teams
let createTeam = (teamName) => {
    let team = JSON.stringify({"team": {"name": teamName}});
    fetch(`${apibase}/teams`, { headers: apiheaders, method: 'POST', body: team })
    .then(res => {
        return res.json();
    })
    .then(json => {
        console.log(`Team Created: ${json.id} ${json.name}`)
    })
    .catch(err => {
        console.log(err);
    });
}

// update a team name
let updateTeam = (teamid, teamName) => {
    let team = JSON.stringify({"team": {"name": teamName}});    
    fetch(`${apibase}/teams/${teamid}`, { headers: apiheaders, method: 'PATCH', body: team })
    .then(res => {
        return res.json();
    })
    .then(json => {
        console.log(`Team updated: ${json.id} ${json.name} ${JSON.stringify(json.users)}`)
    })
    .catch(err => {
        console.log(err);
    });
}

// removes a team
let removeTeam = (teamid) => {
    fetch(`${apibase}/teams/${teamid}`, { headers: apiheaders, method: 'DELETE' })
    .then(res => {
        return res.json();
    })
    .then(json => {
        console.log(`Removed Team: ${json.id} ${json.name}`)
    })
    .catch(err => {
        console.log(err);
    });
}

// add users to teams
let addTeamUser = (teamid, userids) => {
    let users = JSON.stringify({"user_ids": userids});
    fetch(`${apibase}/teams/${teamid}/users`, { headers: apiheaders, method: 'PUT', body: users })
    .then(res => {
        return res.json();
    })
    .then(json => {
        console.log(`${json.id} ${json.name} ${JSON.stringify(json.users)}`);
    })
    .catch(err => {
        console.log(err);
    });
}

yargs.version("0.0.1") 
    .usage("Usage: ./createUsers.js <command>")
    .command("accounts", "List user account numbers", {}, (argv) => userAccounts())
    .command("users <accountid>", "Get users of an account", {}, (argv) => listUsers(argv.accountid))
    .command("add-user <accountid> <name> <email> <phone>", "Add user to an account", {}, (argv) => createUser(argv.accountid, argv.name, argv.email, argv.phone))
    .command("remove-user <accountid> <userid>", "Remove user of an account", {}, (argv) => removeUser(argv.accountid, argv.userid))
    .command("teams", "List teams", {}, (argv) => listTeams())
    .command("add-team <name>", "Create a team", {}, (argv) => createTeam(argv.name))
    .command("update-team <teamid> <name>", "Update a team", {}, (argv) => updateTeam(argv.teamid, argv.name))
    .command("remove-team <teamid>", "Remove a team", {}, (argv) => removeTeam(argv.teamid))
    .command("add-team-users <teamid> <userids..>", "Add users to a team", {}, (argv) => addTeamUser(argv.teamid, argv.userids))
    .help()
    .argv;