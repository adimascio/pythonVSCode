import { OnTypeFormattingEditProvider, TextEdit, TextDocument, FormattingOptions, CancellationToken, Position } from 'vscode';

export class ParenNewLineFormatProvider implements OnTypeFormattingEditProvider {
    provideOnTypeFormattingEdits(document: TextDocument, position: Position, ch: string,
        options: FormattingOptions, token: CancellationToken): TextEdit[] {
        if (position.line === 0) {
            return [];
        }
        const previousLine = document.lineAt(position.line - 1).text;
        const lastParenIndex = previousLine.lastIndexOf('(');
        if (lastParenIndex === -1) {  // no opening paren on previous line
            return [];
        }
        let indent = 0;
        if (/^[a-z0-9_][^)]*$/i.test(previousLine.slice(lastParenIndex + 1).trim())) {
            // if there's a symbol after last paren, align right after opening paren
            indent = lastParenIndex + 1;
        } else {
            indent = Math.ceil(lastParenIndex / options.tabSize);
        }
        // XXX handle tab-indentation mode
        return [
            TextEdit.insert(position, ' '.repeat(indent))
        ];
    }
}