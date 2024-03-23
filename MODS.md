## Creating Mods

### Interface Components

- Separators: "-"
- Variable Inputs: https://pastebin.com/WUmLP4p8
- Storage Inputs: https://pastebin.com/XxShh9px
- User Inputs: https://pastebin.com/X83hJSgH
- Channel Inputs: https://pastebin.com/1xqMaYkj
- Toggles: https://pastebin.com/6wcXr8wu
- Menus: https://pastebin.com/XHUV83Ez
- Classic Dropdowns: https://pastebin.com/65ridJs7
- Typed Dropdowns: https://pastebin.com/AgnnSRv3
- Input Groups: https://pastebin.com/UK537p64
- Inputs: https://pastebin.com/K3XVipSZ

I assume you understood everything well-enough. Stuff should be self-explanatory from here;

- Actions: `element: "actions"` - `storeAs: string`
- Conditional Actions & Additional Options: `element: "condition"` - `storeAs: (string pointing to object)` - `storeActionsAs: (string pointing to array)`
- Image Inputs: `element: "image"` - `storeAs: (string pointing to object)`
- Message Inputs: `element: "message"` - `storeAs: (string pointing to object)`
- Role Inputs: `element: "role"` - `storeAs: (string pointing to object)`
- Role Inputs: `element: "interaction"` - `storeAs: (string pointing to object)`
- Text: `element: "text"` - `storeAs: (string pointing to string)`
- Large Inputs: `element: "largeInput"` - `storeAs: (string pointing to string)`

### Bridge Controls

- get: (blob) :: Blob: variableInput generated object :: Value of variable
- store: (blob) :: Blob: storageInput generated Object :: Void
- getUser: (blob) :: \[ASYNC] Blob: userInput generated Object :: https://docs.oceanic.ws/v1.9.0/classes/User.html with a `member` \[OPTIONAL] property.
- getChannel: (blob) :: \[ASYNC] Blob: channelInput generated Object :: https://docs.oceanic.ws/v1.9.0/classes/Channel.html
- getInteraction: (blob) :: \[ASYNC] Blob: interaction Input generated Object :: https://docs.oceanic.ws/v1.9.0/classes/Interaction.html
- getImage: (blob) :: \[ASYNC] Blob: image (input) generated Object :: Image Buffer
- getRole: (blob) :: \[ASYNC] Blob: role Input generated Object :: https://docs.oceanic.ws/v1.9.0/classes/Role.html
- runner: (actions) :: \[ASYNC] Blob: actions generated Array :: Promise
- call: (blob, actions) :: \[ASYNC] Blob: Condition generated Object | Actions: Condition generated array :: Promise
- callActions: (blob) :: \[ASYNC] Blob: Object with any of these properties: [`stop`, `jump`, `skip`, `actions`] - Stop: Boolean, Jump: Number, Skip: Number, Actions: Array :: Promise
- transf: (inputText) :: inputText: text to transform variables from ${...} to their values :: String
- generateCustomID() :: null :: Number
- createTemporary: (blob) :: Blob: Object with these properties: [`class`, `name`, `value`] - Class: String (Optional) - Name: String - Value: Any; Creates temporary values in storage for sharing between a group's actions for context, inaccessible to the user. See joinVoiceChannel actions for examples :: Void
- getTemporary: (blob) :: Blob: Object with these properties: [`class`, `name`] - Class: String (Optional) - Name: String :: Any
- createGlobal: (blob) :: Blob: Object with these properties: [`class`, `name`, `value`] - Class: String (Optional) - Name: String - Value: Any; Creates global values in storage for sharing between a group's actions for context, inaccessible to the user. See createAnchor for examples :: Void
- getGlobal: (blob) :: Blob: Object with these properties: [`class`, `name`] - Class: String (Optional) - Name: String :: Any
- data: {
  ranAt: string, // source command index
  nodeName: string, // source command name
  IO: {get(), write(JSON)},
  commandID: string|number, // source command id
  }

## Still questions?

Feel free to ask any questions in our [Discord server](https://discord.gg/whtjS7BW3u).
