
# **CODE & DOCs NOT COMPLETED**
# **BitBurner**

This repo contains several pieces to making development easier inside the BitBurner game.

>**nodejs & npm are required**

---
### **TypeScript Requirements**

Download the typescript definitions for the in game objects. 
>Existing definitions may be outdated
1) Download: https://raw.githubusercontent.com/danielyxie/bitburner/dev/src/ScriptEditor/NetscriptDefinitions.d.ts
2) Save `NetscriptDefinitions.d.ts` into folder `BitBurner/game/utils`

>Only required for TypeScript Use
---
## **Setup**
---
>Replace { value } with your variables
1. Clone Repo https://github.com/Econis2/BitBurner-CICD
1. Copy the contents into your new code repo

        cp -R BitBurner-CICD/* { new_location_path }
1. Change into Directory

        cd { new_location }
1. Install Dependencies

        npm install
1. Initialize

        npm run start-ts
    >This should create the `BitBurner/dist` folder and place files: `update.js`, `updateConf.txt` and start the file server: http://localhost:9000/
1. In the BitBurner Game Terminal enter the following:

    -       wget http://localhost:9000/update.js update.js

    -       run update.js
1. When you make changes to your scripts:
    - **Coding in Typescript**
        
            npm run build
    - **Coding in Javascript**

            npm run pack
---
## **Components**
---
### **File Server**

location: `BitBurner/server/index.js`

This is a simple Express Node.js Static File Server running on port `9000` that serves the `BitBurner/dist` Directory

example: http://localhost:9000/file.js

This location will output the content of `BitBurner/dist/file.js`, you can use the `ns.wget(url, filename)` command to retrieve scripts or files located `dist/`.

### **Packager**

location: `BitBurner/server/build.js`

This takes any file in `BitBurner/game`, combines the modules required into single files outputed in `BitBurner/dist`. The game sees every script with an automatic 1.6GB RAM usage. This removes this limitation.
>**Note** Nested imports is not supported.
---
## NPM Commands
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