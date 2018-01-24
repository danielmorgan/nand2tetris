const fs = require('fs');

class Parser {
    constructor (text) {
        this.commandTypes = [
            Symbol('A_COMMAND'),
            Symbol('C_COMMAND'),
        ];

        this.lines = this.cleanup(text);
        this.ptr = 0;
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
        if (! this.isAInstruction) {
            throw new Error('Only A instructions can contain symbols');
        }

        return this.line.slice(1);
    }

    get dest () {
        if (! this.isCInstruction) {
            throw new Error('Only C instructions can contain destinations');
        }

        if (this.line.indexOf('=') === -1) {
            return 'null';
        }

        return this.line.substr(0, this.line.indexOf('='));
    }

    get comp () {
        if (! this.isCInstruction) {
            throw new Error('Only C instructions can contain destinations');
        }

        if (this.line.match('=')) {
            return this.line.substring(this.line.indexOf('=') + 1);
        }

        if (this.line.match(';')) {
            return this.line.substring(0, this.line.indexOf(';'));
        }
    }

    get jmp () {
        if (! this.isCInstruction) {
            throw new Error('Only C instructions can contain destinations');
        }

        if (this.line.indexOf(';') === -1) {
            return 'null';
        }

        return this.line.substr(this.line.indexOf(';') + 1);
    }

    get hasMoreCommands () {
        return this.ptr < this.lines.length;
    }

    advance () {
        this.ptr++;
    }
}


class Code {
    static address (symbol) {
        return Number(symbol).toString(2).padStart(15, 0);
    }

    static dest (mnemonic) {
        const destTable = new Map([
            ['null',    '000'],
            ['M',       '001'],
            ['D',       '010'],
            ['MD',      '011'],
            ['A',       '100'],
            ['AM',      '101'],
            ['AD',      '110'],
            ['AMD',     '111'],
        ]);

        return destTable.get(mnemonic);
    }

    static comp (mnemonic) {
        const compTable = new Map([
            ['0',   '0101010'],
            ['1',   '0111111'],
            ['-1',  '0111010'],
            ['D',   '0001100'],
            ['A',   '0110000'],
            ['!D',  '0001101'],
            ['!A',  '0110001'],
            ['-D',  '0001111'],
            ['-A',  '0110011'],
            ['D+1', '0011111'],
            ['A+1', '0110111'],
            ['D-1', '0001110'],
            ['A-1', '0110010'],
            ['D+A', '0000010'],
            ['D-A', '0010011'],
            ['A-D', '0000111'],
            ['D&A', '0000000'],
            ['D|A', '0010101'],
            ['M',   '1110000'],
            ['!M',  '1110001'],
            ['-M',  '1110011'],
            ['M+1', '1110111'],
            ['M-1', '1110010'],
            ['D+M', '1000010'],
            ['D-M', '1010011'],
            ['M-D', '1000111'],
            ['D&M', '1000000'],
            ['D|M', '1010101'],

        ]);

        const binary = compTable.get(mnemonic);

        if (typeof binary === 'undefined') {
            throw new Error(`Comp mnemonic [${mnemonic}] not recognised.`);
        }

        return binary;
    }

    static jmp (mnemonic) {
        const jmpTable = new Map([
            ['null',    '000'],
            ['JGT',     '001'],
            ['JEQ',     '010'],
            ['JGE',     '011'],
            ['JLT',     '100'],
            ['JNE',     '101'],
            ['JLE',     '110'],
            ['JMP',     '111'],
        ]);

        return jmpTable.get(mnemonic);
    }
}

function main () {
    const argv = process.argv.splice(process.execArgv.length + 2);

    if (argv.length < 1) {
        console.info("Usage: node assembler.js [file] > [outputFile]");
        process.exit();
    }

    const text = fs.readFileSync(argv[0], 'ascii');
    const parser = new Parser(text);

    while (parser.hasMoreCommands) {
        if (parser.isAInstruction) {
            console.log('0' + Code.address(parser.symbol));
        }

        if (parser.isCInstruction) {
            console.log('111' + Code.comp(parser.comp) + Code.dest(parser.dest) + Code.jmp(parser.jmp));
        }

        parser.advance();
    }
}

main();
