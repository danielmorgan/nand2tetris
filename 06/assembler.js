const fs = require('fs');

class Parser {
    constructor (text) {
        this.commandTypes = [
            Symbol('A_COMMAND'),
            Symbol('C_COMMAND'),
        ];

        this.lines = this.cleanup(text);
        this.ptr = 0;

        while (this.hasMoreCommands) {
            this.advance();
        }
    }

    cleanup (text) {
        const allLines = text.split(/\r?\n/);
        const lines = [];

        for (let i = 0; i < allLines.length; i++) {
            if (allLines[i] === '') continue;
            if (allLines[i].slice(0, 2) === '//') continue;
            lines.push(allLines[i]);
        }

        return lines;
    }

    get line () {
        return this.lines[this.ptr];
    }

    get commandType () {
        if (this.line[0] === '@') {
            return this.commandTypes[0];
        }

        return this.commandTypes[1];
    }

    get isAInstruction () {
        return this.commandType === this.commandTypes[0];
    }

    get isCInstruction () {
        return this.commandType === this.commandTypes[1];
    }

    get symbol () {
        if (this.isAInstruction) {
            return this.line.slice(1);
        }
    }

    get dest () {

    }

    get comp () {

    }

    get jmp () {

    }

    get hasMoreCommands () {
        return this.ptr < this.lines.length;
    }

    advance () {
        console.log(this.line);

        this.ptr++;
    }
}

function main () {
    const argv = process.argv.splice(process.execArgv.length + 2);

    if (argv.length < 1) {
        console.info("Usage: node assembler.js [file]");
        process.exit();
    }

    const text = fs.readFileSync(argv[0], 'ascii');
    const parser = new Parser(text);
}

main();
