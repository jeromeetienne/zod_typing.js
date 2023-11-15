const toolInvocationGood = /** @type {import("./type.d").ToolInvocation} */({
        toolName: 'tool name',
        inputObject: {},
})


// good: detection of misnamed property
const toolInvocationBad0 = /** @type {import("./type.d").ToolInvocation} */({
        toolName2: 'tool name',
        inputObject: {},
})

// issue: no detection of additional property
const toolInvocationBad1 = /** @type {import("./type.d").ToolInvocation} */({
        toolName: 'tool name',
        inputObject: {},
        bla: 'bla',
})

// issue: no detection of missing property
const toolInvocationBad2 = /** @type {import("./type.d").ToolInvocation} */({
        toolName: 'tool name',
        // inputObject: {},
})