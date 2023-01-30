class JSTOKENS {
    constructor() {
        this.keywords = ['new', 'undefined', 'null', 'if', 'for', 'continue', 'break', 'switch', 'case', 'else', 'return',
            'do', 'while', 'void', 'export', 'import', 'async', 'await',
            'return', 'try'
        ]
        this.operators = ['=', '+', '-', '*', '/', '.', ',', '<', '>', ':']
        this.types = ['var', 'const', 'let', 'function', 'class', 'constructor']
        this.inBuilt = ['console', 'this']
    }
}
export { JSTOKENS }