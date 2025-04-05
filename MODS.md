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

## Bridge Controls

- **bridge.get(Object)** => [Any]
```javascript
  Object: Storage result of the variable input (how you stored the variable input)
```
- **bridge.store(Object, value)** => [Any]
```javascript
  Object: Storage result of the storage input (how you stored the storage input)
  value: Value of the variable desired to be stored
```
- **bridge.getUser(Object)** => [Promise (User with a member property if possible)] 
```javascript
  Object: Storage result of the user or member input (how you stored the user or member input)
```
- **bridge.getChannel(Object)** => [Promise (Channel)] 
```javascript
  Object: Storage result of the channel input (how you stored the channel input)
```
- **bridge.getInteraction(Object)** => [Promise (Interaction)] 
```javascript
  Object: Storage result of the interaction input (how you stored the interaction input)
```
- **bridge.getImage(Object)** => [Promise (Image Buffer)] 
```javascript
  Object: Storage result of the image input (how you stored the image input)
```
- **bridge.getRole(Object)** => [Promise (Role)] 
```javascript
  Object: Storage result of the role input (how you stored the role input)
```
- **bridge.runner(Array)** => [Promise (Null)] 
```javascript
  Array: Array of actions to run
```
- **bridge.call(Object, Array)** => [Promise (Null)] 
```javascript
  Object: Storage result of the condition input (how you stored the condition input)
  Array: Action storage result of the condition input (how you stored the actions of the condition input)
```
- **bridge.callActions(Object)** => [Promise (Null)] 
```javascript
  Object: Object containing any of the following properties: stop, jump, skip, actions
  stop: boolean; jump: number of the action you want to jump to; skip: number of actions you want to skip; actions: array of actions you want to run
```
- **bridge.transf(String)** => [String] 
```javascript
  String: Text you want to transfer to the bridge form.
```
- **bridge.generateCustomID()** => [Number] 
```javascript
  No parameters
```
- **bridge.createTemporary(Object)** => [Null] 
```javascript
  Object: An object with the following properties: class, name, value
    class: String (optional, the category of this temporary)
    name: String (value you'll need to use to access the temporary) 
    value: Any (value of the temporary)
```
- **bridge.getTemporary(Object)** => [Any] 
```javascript
  Object: An object with the following properties: class, name
    class: String (optional, the category of this temporary)
    name: String (name of the temporary) 
```
- **bridge.createGlobal(Object)** => [Null] 
```javascript
  Object: An object with the following properties: class, name, value
    class: String (optional, the category of this global)
    name: String (value you'll need to use to access the global) 
    value: Any (value of the global)
```
- **bridge.getGlobal(Object)** => [Any] 
```javascript
  Object: An object with the following properties: class, name
    class: String (optional, the category of this global)
    name: String (name of the global) 
```


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

Feel free to ask any questions in our [Discord server](https://discord.gg/whtjS7BW3u).
