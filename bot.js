const { Client, Intents, MessageEmbed} = require('discord.js');
const client = new Client({ 
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ]
});
const fs = require('fs');
const prefix = '!'; 
const configFile = 'config.json';
let config = {};
if (fs.existsSync(configFile)) {
  config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
} else {
  console.error('Die Konfigurationsdatei konnte nicht gefunden werden.');
}
client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'help') {
    const helpEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Bot-Befehle')
      .setDescription('Hier sind die verfügbaren Befehle:')
      .addField('!kick', 'Kickt einen Benutzer vom Server')
      .addField('!ban', 'Bannt einen Benutzer vom Server')
      .addField('!mute', 'Muted einen Benutzer')
      .addField('!timeout', 'Muted einen Benutzer für eine bestimmte Zeit')
      .addField('!warn', 'Warnt einen Benutzer und vergibt entsprechende Rollen')
      .addField('!userinfo [Benutzer-ID]', 'Zeigt Informationen über einen Benutzer')
      .addField('!clear [Anzahl]', 'Löscht eine bestimmte Anzahl von Nachrichten')
      .addField('!welcome', 'Fügt den aktuellen Kanal als Willkommenskanal für den Server hinzu')
      .addField('!bye', 'Fügt den aktuellen Kanal als Abschieds-Kanal für den Server hinzu');

    message.channel.send({ embeds: [helpEmbed] });
  }

});


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

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    if (command === 'welcome' && message.member.permissions.has('ADMINISTRATOR')) {
      const welcomeChannel = message.channel;
      const guildId = message.guild.id;
  
      const configFile = 'config.json';
      let config = {};
      if (fs.existsSync(configFile)) {
        config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
      } else {
        console.error('Die Konfigurationsdatei konnte nicht gefunden werden.');
      }
  
      config.welcome_channels = config.welcome_channels || {};
  
      config.welcome_channels[guildId] = config.welcome_channels[guildId] || [];
  
      if (!config.welcome_channels[guildId].includes(welcomeChannel.name)) {
        config.welcome_channels[guildId].push(welcomeChannel.name);
  
        fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  
        message.channel.send(`Willkommenskanal ${welcomeChannel.name} wurde für diesen Server hinzugefügt.`);
      } else {
        message.channel.send(`Der Willkommenskanal ${welcomeChannel.name} ist bereits für diesen Server in der Liste.`);
      }
    }
  });
  
  client.on('guildMemberAdd', (member) => {
    const configFile = 'config.json';
    let config = {};
    if (fs.existsSync(configFile)) {
      config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    } else {
      console.error('Die Konfigurationsdatei konnte nicht gefunden werden.');
    }
  
    const guildId = member.guild.id;
    const welcomeChannels = config.welcome_channels?.[guildId] || [];
  
    welcomeChannels.forEach(channelName => {
      const welcomeChannel = member.guild.channels.cache.find((ch) => ch.name === channelName);
      if (welcomeChannel) {
        welcomeChannel.send(`Willkommen, ${member.user}!`);
      }
    });
  });

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    if (command === 'bye' && message.member.permissions.has('ADMINISTRATOR')) {
      const goodbyeChannel = message.channel;
      const guildId = message.guild.id;
  
      const configFile = 'config.json';
      let config = {};
      if (fs.existsSync(configFile)) {
        config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
      } else {
        console.error('Die Konfigurationsdatei konnte nicht gefunden werden.');
      }
  
      config.goodbye_channels = config.goodbye_channels || {};
  
      config.goodbye_channels[guildId] = config.goodbye_channels[guildId] || [];
  
      if (!config.goodbye_channels[guildId].includes(goodbyeChannel.name)) {
        config.goodbye_channels[guildId].push(goodbyeChannel.name);
  
        fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  
        message.channel.send(`Abschieds-Kanal ${goodbyeChannel.name} wurde für diesen Server hinzugefügt.`);
      } else {
        message.channel.send(`Der Abschieds-Kanal ${goodbyeChannel.name} ist bereits für diesen Server in der Liste.`);
      }
    }
  });
  
  client.on('guildMemberRemove', (member) => {
    const configFile = 'config.json';
    let config = {};
    if (fs.existsSync(configFile)) {
      config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    } else {
      console.error('Die Konfigurationsdatei konnte nicht gefunden werden.');
    }
  
    const guildId = member.guild.id;
    const goodbyeChannels = config.goodbye_channels?.[guildId] || [];
  
    goodbyeChannels.forEach(channelName => {
      const goodbyeChannel = member.guild.channels.cache.find((ch) => ch.name === channelName);
      if (goodbyeChannel) {
        goodbyeChannel.send(`${member.user.tag} hat den Server verlassen.`);
      }
    });
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

  if (command === 'userinfo') {
    const userId = args[0];

    if (!userId) {
      return message.reply('Bitte gib die Benutzer-ID an.');
    }

    message.guild.members.fetch(userId).then(targetUser => {
      const userEmbed = {
        color: '#0099ff',
        title: 'Benutzerinformationen',
        thumbnail: { url: targetUser.user.displayAvatarURL() },
        fields: [
          { name: 'Benutzername', value: targetUser.user.username, inline: true },
          { name: 'ID', value: targetUser.user.id },
          { name: 'Beigetreten am', value: targetUser.joinedAt.toLocaleDateString(), inline: true },
          { name: 'Account erstellt am', value: targetUser.user.createdAt.toLocaleDateString(), inline: true },
        ],
      };

      message.channel.send({ embeds: [userEmbed] });
    }).catch(error => {
      console.error(error);
      message.reply('Der Benutzer wurde nicht gefunden.');
    });
  }
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().includes('hi') || message.content.toLowerCase().includes('hey') || message.content.toLowerCase().includes('hallo') || message.content.toLowerCase().includes('hey')) {

    message.reply(`Hey ${message.author.username}!`);
  }
});
client.on('messageCreate', async (message) => {
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'clear') {
    if (!message.member.permissions.has('MANAGE_MESSAGES')) {
      return message.reply('Du hast nicht die Berechtigung, Nachrichten zu löschen.');
    }
    const deleteCount = parseInt(args[0], 10);

    if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
      return message.reply('Bitte gib eine Zahl zwischen 2 und 100 an, um Nachrichten zu löschen.');
    }

    const fetched = await message.channel.messages.fetch({ limit: deleteCount });
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Beim Löschen von Nachrichten ist ein Fehler aufgetreten: ${error}`));
  }
});

const token = '';
client.login(token);
