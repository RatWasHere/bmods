module.exports = {
    data: {
        name: "Start OAuth Authorization Server",
    },
    category: "OAuth",
    modules: ["express", "passport-discord-auth", "passport", "express-session"],
    UI: [
        {
            element: "input",
            storeAs: "port",
            name: "Port",
            placeholder: "8080"
        },
        "-",
        {
            element: "input",
            storeAs: "host",
            name: "Host",
            placeholder: "localhost"
        },
        "-",
        {
            name: "Discord Client ID",
            element: "input",
            storeAs: "clientId",
            placeholder: "123456789012345678",
        },
        "-",
        {
            name: "Discord Client Secret",
            element: "input",
            storeAs: "clientSecret",
            placeholder: "abcdefghijklmnopqrstuvwxyz123456",
        },
        "-",
        {
            element: "input",
            storeAs: "redirectUri",
            name: "Redirect URI",
            placeholder: "http://localhost:8080/auth/discord/callback",
        },
        "-",
        {
            element: "input",
            storeAs: "verifyUrl",
            name: "Linked Roles Verification URL",
            placeholder: "http://localhost:8080/verify",
        },
        "-",
        {
            element: "text",
            text: "Scopes",
            header: true,
        },
        {
            element: "toggleGroup",
            storeAs: ["activitiesRead", "activitiesWrite"],
            nameSchemes: ["Activities.read", "Activities.write"],
        },
        {
            element: "toggleGroup",
            storeAs: ["applicationsBuildsRead", "applicationsBuildsUpload"],
            nameSchemes: ["Applications.builds.read", "Applications.builds.upload"],
        },
        {
            element: "toggleGroup",
            storeAs: ["applicationsCommands", "applicationsCommandsUpdate"],
            nameSchemes: ["Applications.commands", "Applications.commands.update"],
        },
        {
            element: "toggleGroup",
            storeAs: ["applicationsCommandsPermissionsUpdate", "applicationsEntitlements"],
            nameSchemes: ["Applications.commands.permissions.update", "Applications.entitlements"],
        },
        {
            element: "toggleGroup",
            storeAs: ["applicationsStoreUpdate", "bot"],
            nameSchemes: ["Applications.store.update", "Bot"],
        },
        {
            element: "toggleGroup",
            storeAs: ["connections", "dmChannelsRead"],
            nameSchemes: ["Connections", "Dm_channels.read"],
        },
        {
            element: "toggleGroup",
            storeAs: ["email", "gdmJoin"],
            nameSchemes: ["Email", "Gdm.join"],
        },
        {
            element: "toggleGroup",
            storeAs: ["guilds", "guildsJoin"],
            nameSchemes: ["Guilds", "Guilds.join"],
        },
        {
            element: "toggleGroup",
            storeAs: ["guildsMembersRead", "identify"],
            nameSchemes: ["Guilds.members.read", "Identify"],
        },
        {
            element: "toggleGroup",
            storeAs: ["messagesRead", "relationshipsRead"],
            nameSchemes: ["Messages.read", "Relationships.read"],
        },
        {
            element: "toggleGroup",
            storeAs: ["roleConnectionsWrite", "rpc"],
            nameSchemes: ["Role_connections.write", "Rpc"],
        },
        {
            element: "toggleGroup",
            storeAs: ["rpcActivitiesWrite", "rpcNotificationsRead"],
            nameSchemes: ["Rpc.activities.write", "Rpc.notifications.read"],
        },
        {
            element: "toggleGroup",
            storeAs: ["rpcVoiceRead", "rpcVoiceWrite"],
            nameSchemes: ["Rpc.voice.read", "Rpc.voice.write"],
        },
    ],

    subtitle: (values) => {
        return `Running server at ${values.host || "localhost"}:${values.port || "8080"}`;
    },
    async run(values, message, client, bridge) {
        const {
            port = 8080,
            host = "localhost",
            redirectUri,
            clientId,
            clientSecret,
            verifyUrl
        } = values;

        if (!clientId || !clientSecret || !redirectUri || !verifyUrl) {
            console.error("Missing required OAuth configuration");
            return;
        }

        try {
            const express = await client.getMods().require("express");
            const session = await client.getMods().require("express-session");
            const passport = await client.getMods().require("passport");
            const { Strategy } = await client.getMods().require("passport-discord-auth");

            const app = express();

            app.set('trust proxy', 1);
            app.use(session({
                secret: crypto.getRandomValues(new Uint8Array(32)).toString('hex'),
                resave: false,
                saveUninitialized: true,
                cookie: { secure: true }
            }))

            passport.serializeUser((user, done) => {
                done(null, user);
            });

            passport.deserializeUser((obj, done) => {
                done(null, obj);
            });

            app.use(passport.initialize());
            app.use(passport.session());

            const excludedKeys = ["port", "host", "redirectUri", "clientId", "clientSecret", "verifyUrl"];
            const scopes = Object.entries(values)
                .filter(([key, value]) => !excludedKeys.includes(key) && value === true)
                .map(([key]) => {
                    if (key === "roleConnectionsWrite") return "role_connections.write";
                    if (key === "dmChannelsRead") return "dm_channels.read";
                    return key.replace(/([a-z])([A-Z])/g, '$1.$2').toLowerCase();
                });

            passport.use(new Strategy({
                clientId: clientId,
                clientSecret: clientSecret,
                callbackUrl: redirectUri,
                scope: scopes,
            }, (accessToken, refreshToken, profile, done) => {
                profile.accessToken = accessToken;
                profile.refreshToken = refreshToken;
                return done(null, profile);
            }));

            const getPath = (url) => {
                try {
                    return new URL(url).pathname;
                } catch (e) {
                    return url.startsWith('/') ? url : `/${url}`;
                }
            };

            const verifyPath = getPath(verifyUrl);
            const redirectPath = getPath(redirectUri);

            app.get(verifyPath, passport.authenticate('discord'));

            app.get(redirectPath, passport.authenticate('discord', {
                failureRedirect: '/'
            }), (req, res) => {
                if (client.server && client.server.events) {
                    client.server.events.oauthSuccess(req.user);
                }
                res.status(200).send(`
                    <html>
                    <head>
                    <title>OAuth Successful</title>
                    <style>
                    body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background: #f5f7fa;
                    font-family: Arial, sans-serif;
                    color: #333;
                    }
                    .message {
                    text-align: center;
                    padding: 2rem;
                    border-radius: 10px;
                    background: #ffffff;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    }
                    p {
                    font-size: 1rem;
                    color: #666;
                    }
                    </style>
                    </head>
                    <body>
                    <div class="message">
                    <h1>OAuth successful!</h1>
                    <p>You can now close this window.</p>
                    </div>
                    </body>
                    </html>
                    `);
                });

                const server = app.listen(port, host, () => {
                    console.log(`Discord OAuth server running at http://${host}:${port}`);
            });

            return server;
        } catch (error) {
            console.error("Failed to start HTTP server:", error);
        }
    }
}