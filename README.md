# Zod_typing.js
Nice way to handle strict typing in JS.

**Principle**: "Single definition to handle all use-cases"

## Use Cases
Here all use-cases are:
- strong typing directly in your IDE with live error detection
- strong typing in your code with a offline error detection
- strong typing in your json files with a live error detection
- strong typing in your json files with a offline error detection

- it defines jsdoc to keep your javascript strong typed in your editor.
  - you see immediatly if you are using the wrong type because your editor underline it in red
- you ensure all your JSON files are conform to a given json-schema
  - you can check existing files, for example, as part of a test procedure.
  - you can check it as read-time, thus you ensure you detect discrepency as soon as possible


## Features
- define all the jsdoc thus you can have strict typing within your code
- define all the json-schema thus you can have strict typing within your json files
- single definition to product JsDoc and json-schema definition
  - **PRO** so they are always in sync

**Benefits**
- can generate json-schema file if needed, e.g. for inter operability with another software
- easy tools to check the json-schema of the file within your project
- strict parsing when reading json file thanks to Zod.parse
  - **PRO** if the file are invalid, it is detect are read-time, so you are always sure not to have invalid data without knowing it