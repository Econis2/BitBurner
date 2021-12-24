
# **CODE & DOCs NOT COMPLETED**
# **BitBurner**

This repo contains several pieces to making development easier inside the BitBurner game.

>**nodejs & npm are required**

---
### **TypeScript Requirements**

Download the typescript definitions for the in game objects. 

1) Download: https://raw.githubusercontent.com/danielyxie/bitburner/dev/src/ScriptEditor/NetscriptDefinitions.d.ts
2) Save `NetscriptDefinitions.d.ts` into folder `BitBurner/game/utils`

>Only required for TypeScript Use
---
## **Components**
---
### **File Server**

location: `BitBurner/server/index.js`

This is a simple Express Node.js Static File Server running on port `9000` that serves the `BitBurner/dist` Directory

example: http://localhost:9000/file.js

This location will output the content of `BitBurner/dist/file.js`, you can use the `ns.wget(url, filename)` command to retrieve scripts or files located `dist/`.

### **WebPack**

location: `BitBurner/webpack.config.js`

This takes any file in `BitBurner/game`, combines the modules required into single files outputed in `BitBurner/dist`. The game sees every script with an automatic 1.6GB RAM usage. This removes this limitation, but allows the develope enviornment stay organized.

---
## **Setup**
---
1. Clone Repo https://github.com/Econis2/BitBurner
1. Change into Directory

        cd BitBurner
1. Install Dependencies

        npm install
1. Initialize
    - **Typescript**

            npm run start-ts
    - **Javascript Only**

            npm run start
---
## Development
---
### **TypeScript: NPM Commnads**

Run after every time you finalize your changes:

    npm run build

>Transpiles the Typescript into Javascript and runs WebPack to compile the required imports and modules into singular files.  **There are npm libraries that will watch and run this for you automatically.**
---

Run when you start your game or development:

    npm run start-ts

>Does all the same commands as `npm run build` but starts the File Server as well. 
---
### **Javascript: NPM Commnads**

Run after every time you finalize your changes:

    npm run pack

>Runs WebPack to compile the required imports and modules into singular files.  **There are npm libraries that will watch and run this for you automatically.**
---
Run when you start your game or development:

    npm run start

>Does all the same commands as `npm run pack` but starts the File Server as well. 

---
## ToDo
---
- Determine how update.js has a list of files
    - index.js does some of this already, problably modify
- Change update.js to TypeScript
    - Update to the latest Repo Changes