# Discord Moderations- und Leveling-Bot

Dies ist ein Discord-Bot, der verschiedene Moderationsbefehle und Leveling-Funktionen bietet. Der Bot ist in JavaScript geschrieben und verwendet die discord.js-Bibliothek.

## Moderationsbefehle

### 1. Kick
- Befehl: `!kick @Benutzer`
- Berechtigung: `KICK_MEMBERS`
- Kickt den erwähnten Benutzer aus dem Server.

### 2. Ban

- Befehl: `!ban @Benutzer`
- Berechtigung: `BAN_MEMBERS`
- Verbannt den erwähnten Benutzer vom Server.

### 3. Mute

- Befehl: `!mute @Benutzer`
- Berechtigung: `MUTE_MEMBERS`
- Muted den erwähnten Benutzer und weist ihm die Rolle "Muted" zu.

### 4. Timeout

- Befehl: `!timeout [Dauer in Minuten] @Benutzer`
- Berechtigung: `MUTE_MEMBERS`
- Muted den Benutzer für die angegebene Dauer und entmuted ihn nach Ablauf.

### 5. Warn

- Befehl: `!warn @Benutzer Grund`
- Berechtigung: `KICK_MEMBERS`
- Warnt den erwähnten Benutzer und weist ihm eine Warnrolle zu.

## Benachrichtigungen

- Willkommensnachricht bei Serverbeitritt im Channel "👋willkommen-tschüss👋".
- Abschiedsnachricht bei Serververlassen im Channel "willkommen-tschüss".

## Leveling-System

- Benutzer sammeln Erfahrungspunkte basierend auf gesendeten Nachrichten.
- Bei Erreichen bestimmter Erfahrungspunkte-Level gibt es Benachrichtigungen.

## Benutzerinformation

- Befehl: `!userinfo [Benutzer-ID]`
- Zeigt Informationen über den angegebenen Benutzer an.

## Nachrichtenlöschung

- Befehl: `!clear [Anzahl]`
- Berechtigung: `MANAGE_MESSAGES`
- Löscht eine bestimmte Anzahl von Nachrichten im aktuellen Channel.

## Konfiguration

1. Installiere die erforderlichen Abhängigkeiten mit `npm install discord.js dotenv`.

2. Erstelle eine `.env`-Datei im gleichen Verzeichnis wie dein Bot-Code und füge deinen Discord-Bot-Token hinzu:

3. Passe die Bot-Befehle und Channelnamen nach Bedarf an.

4. Führe den Bot mit `node bot.js` aus.

## Hinweis

Dieser Bot dient als Beispiel und kann nach Bedarf erweitert oder angepasst werden. Beachte Sicherheitsaspekte wie die Verwaltung von Bot-Token und Berechtigungen.
