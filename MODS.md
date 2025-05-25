# Creating Mods

This guide provides detailed instructions on creating mods for Bot Maker for Discord (BMD).

Also, please follow the general structure when creating mods. Therefore, add **\_MOD** after your mod name, don't include any additional dots or spaces, and make sure to include the info object within your modded action.
Feel free to add a short description for your action as seen in [**animeSearch_MOD.js**](https://github.com/RatWasHere/bmods/blob/master/Actions/animeSearch_MOD.js).

## Interface Components

- **Separators**: "-"
- **Variable Inputs**: [Pastebin Link](https://pastebin.com/WUmLP4p8)
- **Storage Inputs**: [Pastebin Link](https://pastebin.com/XxShh9px)
- **User Inputs**: [Pastebin Link](https://pastebin.com/X83hJSgH)
- **Channel Inputs**: [Pastebin Link](https://pastebin.com/1xqMaYkj)
- **Toggles**: [Pastebin Link](https://pastebin.com/6wcXr8wu)
- **Menus**: [Pastebin Link](https://pastebin.com/XHUV83Ez)
- **Classic Dropdowns**: [Pastebin Link](https://pastebin.com/65ridJs7)
- **Typed Dropdowns**: [Pastebin Link](https://pastebin.com/AgnnSRv3)
- **Input Groups**: [Pastebin Link](https://pastebin.com/UK537p64)
- **Inputs**: [Pastebin Link](https://pastebin.com/K3XVipSZ)

## Action Elements

- **Actions**:
  ```json
  {
    "element": "actions",
    "storeAs": "string"
  }
  ```
- **Conditional Actions & Additional Options**:
  ```json
  {
    "element": "condition",
    "storeAs": "string_pointing_to_object",
    "storeActionsAs": "string_pointing_to_array"
  }
  ```
- **Image Inputs**:
  ```json
  {
    "element": "image",
    "storeAs": "string_pointing_to_object"
  }
  ```
- **Message Inputs**:
  ```json
  {
    "element": "message",
    "storeAs": "string_pointing_to_object"
  }
  ```
- **Role Inputs**:
  ```json
  {
    "element": "role",
    "storeAs": "string_pointing_to_object"
  }
  ```
- **Interaction Inputs**:
  ```json
  {
    "element": "interaction",
    "storeAs": "string_pointing_to_object"
  }
  ```
- **Text**:
  ```json
  {
    "element": "text",
    "text": "string"
  }
  ```
- **Large Inputs**:
  ```json
  {
    "element": "largeInput",
    "storeAs": "string_pointing_to_string"
  }
  ```

---

## Bridge Controls

### `bridge.get(Object)` ⇒ `Any`

```javascript
// Retrieves a stored variable value
bridge.get(Object);
```

- **Object**: The result of how you stored the variable input.

---

### `bridge.store(Object, value)` ⇒ `Any`

```javascript
// Stores a value into a variable
bridge.store(Object, value);
```

- **Object**: The result of how you stored the variable input.
- **value**: The value you want to store.

---

### `bridge.getUser(Object)` ⇒ `Promise<User>`

```javascript
// Retrieves a user or member object
bridge.getUser(Object);
```

- **Object**: The result of how you stored the user/member input.

---

### `bridge.getChannel(Object)` ⇒ `Promise<Channel>`

```javascript
// Retrieves a channel object
bridge.getChannel(Object);
```

- **Object**: The result of how you stored the channel input.

---

### `bridge.getInteraction(Object)` ⇒ `Promise<Interaction>`

```javascript
// Retrieves an interaction object
bridge.getInteraction(Object);
```

- **Object**: The result of how you stored the interaction input.

---

### `bridge.getImage(Object)` ⇒ `Promise<Buffer>`

```javascript
// Retrieves an image buffer
bridge.getImage(Object);
```

- **Object**: The result of how you stored the image input.

---

### `bridge.getRole(Object)` ⇒ `Promise<Role>`

```javascript
// Retrieves a role object
bridge.getRole(Object);
```

- **Object**: The result of how you stored the role input.

---

### `bridge.runner(Array)` ⇒ `Promise<null>`

```javascript
// Runs an array of actions
bridge.runner(Array);
```

- **Array**: Array of actions to run.

---

### `bridge.call(Object, Array)` ⇒ `Promise<null>`

```javascript
// Conditionally runs actions
bridge.call(Object, Array);
```

- **Object**: The stored condition input.
- **Array**: The stored actions to run if the condition is met.

---

### `bridge.callActions(Object)` ⇒ `Promise<null>`

```javascript
// Performs flow control with actions
bridge.callActions({
  stop: false, // Optional: whether to stop further execution
  jump: 2, // Optional: jump to a specific action number
  skip: 1, // Optional: number of actions to skip
  actions: [], // Optional: array of actions to run
});
```

- **Object**: Contains control logic for actions.

---

### `bridge.transf(String)` ⇒ `String`

```javascript
// Transfers text to bridge form
bridge.transf("some text");
```

- **String**: Text to transfer.

---

### `bridge.generateCustomID()` ⇒ `Number`

```javascript
// Generates a custom numeric ID
bridge.generateCustomID();
```

---

### `bridge.createTemporary(Object)` ⇒ `null`

```javascript
// Creates a temporary variable
bridge.createTemporary({
  class: "myClass", // Optional
  name: "tempName", // Required
  value: "some value", // Required
});
```

---

### `bridge.getTemporary(Object)` ⇒ `Any`

```javascript
// Retrieves a temporary variable
bridge.getTemporary({
  class: "myClass", // Optional
  name: "tempName", // Required
});
```

---

### `bridge.createGlobal(Object)` ⇒ `null`

```javascript
// Creates a global variable
bridge.createGlobal({
  class: "myClass", // Optional
  name: "globalName", // Required
  value: "some value", // Required
});
```

---

### `bridge.getGlobal(Object)` ⇒ `Any`

```javascript
// Retrieves a global variable
bridge.getGlobal({
  class: "myClass", // Optional
  name: "globalName", // Required
});
```

---

## Data Structure

- **data**:
  ```json
  {
    "ranAt": "string", // source command index
    "nodeName": "string", // source command name
    "IO": {
      "get": "function",
      "write": "function(JSON)"
    },
    "commandID": "string|number" // source command id
  }
  ```

## Still Got Questions?

Feel free to ask any questions in our [Discord server](https://discord.gg/n9PWrxFQFF).
