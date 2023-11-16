const { Client, Intents } = require('discord.js');
const client = new Client({ 
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ]
});
const prefix = '!'; 


client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'kick') {
    if (!message.member.permissions.has('KICK_MEMBERS')) {
      return message.channel.send('Du hast keine Berechtigung, Benutzer zu kicken.');
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.channel.send('Bitte erwähne den Benutzer, den du kicken möchtest.');
    }

    member.kick()
      .then(() => message.channel.send(`${member.user.tag} wurde gekickt.`))
      .catch(console.error);
  } else if (command === 'ban') {
    if (!message.member.permissions.has('BAN_MEMBERS')) {
      return message.channel.send('Du hast keine Berechtigung, Benutzer zu bannen.');
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.channel.send('Bitte erwähne den Benutzer, den du bannen möchtest.');
    }

    member.ban()
      .then(() => message.channel.send(`${member.user.tag} wurde gebannt.`))
      .catch(console.error);
  } else if (command === 'mute') {
    if (!message.member.permissions.has('MUTE_MEMBERS')) {
      return message.channel.send('Du hast keine Berechtigung, Benutzer zu muten.');
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.channel.send('Bitte erwähne den Benutzer, den du muten möchtest.');
    }

    const muteRole = message.guild.roles.cache.find((role) => role.name === 'Muted'); 
    if (!muteRole) {
      return message.channel.send('Die "Muted"-Rolle wurde nicht gefunden. Bitte lege sie an.');
    }

    member.roles.add(muteRole)
      .then(() => message.channel.send(`${member.user.tag} wurde gemuted.`))
      .catch(console.error);
  }

});
client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    if (command === 'timeout') {
      if (!message.member.permissions.has('MUTE_MEMBERS')) {
        return message.channel.send('Du hast keine Berechtigung, Benutzer zu muten.');
      }
  
      const member = message.mentions.members.first();
      if (!member) {
        return message.channel.send('Bitte erwähne den Benutzer, den du muten möchtest.');
      }
  
      const muteRole = message.guild.roles.cache.find((role) => role.name === 'Muted'); 
      if (!muteRole) {
        return message.channel.send('Die "Muted"-Rolle wurde nicht gefunden. Bitte lege sie an.');
      }
  
      const duration = parseInt(args[0]); 
  
      if (isNaN(duration)) {
        return message.channel.send('Ungültige Dauer. Verwende !timeout [Dauer in Minuten] @Benutzer.');
      }
  
      member.roles.add(muteRole)
        .then(() => {
          message.channel.send(`${member.user.tag} wurde für ${duration} Minuten gemuted.`);
          setTimeout(() => {
            member.roles.remove(muteRole)
              .then(() => message.channel.send(`${member.user.tag} wurde nach ${duration} Minuten entmutet.`))
              .catch(console.error);
          }, duration * 60000); 
        })
        .catch(console.error);
    }
  });

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    if (command === 'warn') {
      if (!message.member.permissions.has('KICK_MEMBERS')) {
        return message.channel.send('Du hast keine Berechtigung, Benutzer zu warnen.');
      }
  
      const member = message.mentions.members.first();
      if (!member) {
        return message.channel.send('Bitte erwähne den Benutzer, den du warnen möchtest.');
      }
  
      const reason = args.slice(1).join(' ');
      if (!reason) {
        return message.channel.send('Bitte gib einen Grund für die Warnung an.');
      }
  
      if (!warnings.has(member.id)) {
        warnings.set(member.id, { count: 1, reasons: [reason] });
      } else {
        const userWarnings = warnings.get(member.id);
        userWarnings.count++;
        userWarnings.reasons.push(reason);
        warnings.set(member.id, userWarnings);
      }
  
      const warnCount = warnings.get(member.id).count;
      let warnRoleName = `Warn${warnCount}`;
      if (warnCount > 3) {
        warnRoleName = 'Warn3+';
      }
  
      const warnRole = message.guild.roles.cache.find((role) => role.name === warnRoleName);
  
      if (!warnRole) {
        
        message.guild.roles.create({
          name: warnRoleName,
          color: 'ORANGE', 
        }).then((role) => {
          member.roles.add(role);
          message.channel.send(`${member.user.tag} wurde gewarnt und hat die Rolle ${role.name} erhalten. Grund: ${reason}`);
        }).catch(console.error);
      } else {
       
        member.roles.add(warnRole);
        message.channel.send(`${member.user.tag} wurde gewarnt und hat die Rolle ${warnRole.name} erhalten. Grund: ${reason}`);
      }
    }
  });

client.on('guildMemberAdd', (member) => {
  const welcomeChannel = member.guild.channels.cache.find((ch) => ch.name === '👋willkommen-tschüss👋'); 

  if (welcomeChannel) {
    welcomeChannel.send(`Willkommen, ${member.user}!`);
  }
});


client.on('guildMemberRemove', (member) => {
  const goodbyeChannel = member.guild.channels.cache.find((ch) => ch.name === 'willkommen-tschüss'); 

  if (goodbyeChannel) {
    goodbyeChannel.send(`${member.user.tag} hat den Server verlassen.`);
  }
});


client.once('ready', () => {
  console.log(`Eingeloggt als ${client.user.tag}`);
  client.user.setActivity('Pixel', { type: 'PLAYING' });
});
const levels = new Map(); 
const levelUpMessages = [
  'Glückwunsch! Du bist jetzt Level 1!',
  'Herzlichen Glückwunsch zum Level 2!',
  'Du bist jetzt Level 3!'

];

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;

 
  if (!levels.has(userId)) {
    levels.set(userId, {
      messages: 0,
      level: 1,
    });
  }

  const userData = levels.get(userId);
  userData.messages++;
  levels.set(userId, userData);

  if (userData.messages >= 200) {
    userData.level++;
    userData.messages = 0; 
    levels.set(userId, userData);

    message.channel.send(`Glückwunsch, ${message.author.username}! Du bist jetzt Level ${userData.level}!`);
  }

  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
});
const token = '';
client.login(token);
