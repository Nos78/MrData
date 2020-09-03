/*
 * @Author: BanderDragon 
 * @Date: 2020-08-30 06:18:57 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-03 22:25:50
 */

// push.js - web push server module
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebPush = void 0;

// set up libraries
const express = require('express');
//const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const library = require('../library');
const db = require('../db');

// Configure firebase
const firebase = require("firebase-admin");

// Load Secret Keys
const configSecret = require('../config-secret.json');
const config = require('../config.json');

const logger = require('winston');

// Global constants
const clientPort = configSecret.webPush.clientPort; // the port of the web app
const displayPort = config.webPush.clientDisplayPort; // the port the user sees; may be different than the app port, for example, if behind an nginx reverse proxy

const payload = {
    notification: {
      title: '@SERVERNAME Notification Title',
      body: 'This is an example notification',
    }
};

const options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24, // 1 day
};

class WebPush {

    constructor() {
        this._app = null;
        this._server = null;
        this._serviceAccount = null;
        this._firebaseAdmin = null;
        this._userId = null;
        this._defaultPort = clientPort;
    }
    // GETTERS
    get app() {
        return this._app;
    }
    get Server() {
        return this._server;
    }

    get defaultPort() {
        return this._defaultPort;
    }

    get serviceAccount() {
        return this._serviceAccount;
    }

    get firebaseAdmin() {
        return this._firebaseAdmin;
    }

    get userId() {
        return this._userId;
    }
    // SETTERS
    set app(app) {
        logger.info("Setter (app)");
        this._app = app;
    }
    set server(server) {
        logger.info("Setter (server)");
        this._server = server;
    }
    
    set serviceAccount(serviceAccount) {
        this._serviceAccount = serviceAccount;
    }

    set firebaseAdmin(firebaseAdmin) {
        this._firebaseAdmin = firebaseAdmin;
    }

    set defaultPort(portNumber) {
        this._defaultPort = portNumber;
    }

    set userId(userId) {
        logger.info("Setter (userId)");
        this._userId = userId;
    }

    initialise() {
        const app = express();

        app.use(bodyParser.json());

//        app.use(express.static(path.join(__dirname, 'client')));        
        app.use(express.static(path.join(__dirname, 'client')));
        
        // Firebase secret key credentials
        this._serviceAccount = configSecret.webPush.credentials;

        this._firebaseAdmin = firebase.initializeApp({
            credential: firebase.credential.cert(this._serviceAccount),
            databaseURL: `${configSecret.webPush.databaseURL}`
        });

        //webPush.setVapidDetails('mailto:support@thebotfactory.net', configSecret.webPush.vapid.public, configSecret.webPush.vapid.private);
        
        // app.post('/subscribe', (req, res) => {
        //     const subscription = req.body
        //     res.status(201).json({});
        //     const payload = JSON.stringify({
        //         title: `${library.Config.botName()} Push notifications with Service Workers`,
        //     });
        //     webPush.sendNotification(subscription, payload)
        //     .catch(error => console.error(error));
        //});

        app.post('/subscribe', (req, res) => {
            res.status(200).json({"success": true});
            const userId = req.query.userId;
            if(userId) {
                const guildId = req.query.guildId;
                var settings = null;
                if(guildId) {
                    db.userGuildSettings.findUserSettingsById(userId, guildId)
                        .then(userGuildSettings => {
                            try {
                                settings = library.Settings.addPushTokenToSettings(
                                    library.Settings.getSettingsFromRecord(userGuildSettings),
                                    req.body.token)
                            }
                            catch(err) {
                                logger.error("app.post: /subscribe - failed to add pushToken to user guild settings");
                                settings = null;
                            }
                            if(settings) {
                                db.userGuildSettings.upsert(userId, guildId, settings);
                            }
                        });
                } else {
                    db.userGlobalSettings.findUserSettingsById(userId)
                        .then(userGlobalSettings => {
                            settings = library.Settings.addPushTokenToSettings(
                                    library.Settings.getSettingsFromRecord(userGlobalSettings),
                                    req.body.token)
                                .catch(err => {
                                    logger.error("app.post: /subscribe - failed to add pushToken to user global settings");
                                    settings = null;
                                });
                            if(settings) {
                                db.userGlobalSettings.upsert(userId, settings);
                            }
                        });
                }
            }/* TODO Add db.userGlobalSettings */
        });

        app.set('port', this._defaultPort);

        const server = app.listen(app.get('port'), () => {
            logger.info(`Express webPush app running → PORT ${server.address().port}`);
        });
        this._server =server;
        this._app = app;
    }

    sendToDevice(token, payload, options) {
        return firebase.messaging().sendToDevice(token, payload, options)
            .then(function(response) {
                logger.info("Successfully sent message: ", response);
            })
            .catch(function(error) {
                logger.error("Error sending message: ", error);
            });
    }

    sendTest() {
        logger.info("testing firebase...");
        logger.info(this.sendToDevice('cDhcRox2gJ4:APA91bFT4vh1ItCKpLsZ90cWvPJJJZo2IMmMO5UCr0mmElFhHlr4Z3gK9jQLQRpchg8jZ-U2Wa3BPfADWz1yuIY2jHh2IOtP4W3xrds6VlE53Pne4V3U6A12AKzC7oU1hKu6hYW0XPmy',
        payload,
        options));
        logger.info("... and done, apparently...");
    }
}

exports.WebPush = WebPush;