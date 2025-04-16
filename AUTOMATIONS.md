Automations are funky. They are basically extensions but since they were initially created for automating tedious task, they were called automations!

This is how automations are structured in their folder:

```
└── Bot Maker for Discord/
    └── Automations/
        └── Your Automation/
            ├── data.json
            ├── main.json
            ├── startup_info.json (OPTIONAL)
            └── startup.js (OPTIONAL)
```

## data.json

The information from this is used when it's searched via ActionPallete

```json
{
  "author": "N/A",
  "name": "Your Automation"
}
```

## main.js

This runs when the automation is ran from ActionPallete

```js
module.exports = {
  run: async (options) => {
    options.burstInform("AAA"); // display information without running an animation on the popup
    options.showInterface(ActionUI); // display a modal with the interface of an action
    options.result("BBB"); // display the result of an automation in text form
    options.eval("CCC"); // run javascript from the location in which the automation is ran
  },
};
```

## startup_info.json

Information that shows up in Settings > Behaviour

```json
{
  "name": "Your Automation (And what it does when it gets toggled on)"
}
```

## startup.js

Runs on every window open if the automation is toggled on in Settings > Behaviour

````js
module.exports = {
    run: async (options) => {
        options.eval('AAAA') / run javascript code from the window the user is currently on
    }
}```
````
