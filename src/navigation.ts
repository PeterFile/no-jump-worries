import * as vscode from 'vscode';

/**
 * Registers the Vue method navigation feature, allowing Ctrl+Click to jump from template to script method definitions.
 * @param context - The extension context to register subscriptions.
 */
export function registerVueNavigation(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider({ language: 'vue' }, {
            provideDefinition(document, position, token) {
                const range = document.getWordRangeAtPosition(position);
                if (!range) return;

                const methodName = document.getText(range);
                console.log(`Attempting to jump to definition for method: ${methodName}`);

                // Extract <script> content and calculate line offset
                const { content: scriptText, lineOffset } = extractScriptContent(document.getText());
                const methodPosition = findMethodPosition(scriptText, methodName);

                if (methodPosition) {
                    const targetPosition = new vscode.Position(methodPosition.line + lineOffset, methodPosition.character);
                    return new vscode.Location(document.uri, targetPosition);
                }
            }
        })
    );
}

/**
 * Extracts the content within the <script> block and calculates its line offset.
 * @param text - The full text of the Vue document.
 * @returns The content of the <script> block and its starting line number.
 */
function extractScriptContent(text: string): { content: string, lineOffset: number } {
    const scriptMatch = text.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    if (scriptMatch) {
        const beforeScript = text.slice(0, scriptMatch.index);
        const lineOffset = (beforeScript.match(/\n/g) || []).length;
        return { content: scriptMatch[1], lineOffset };
    }
    return { content: '', lineOffset: 0 };
}

/**
 * Finds the position of the method in the script content.
 * @param scriptText - The extracted <script> content.
 * @param methodName - The name of the method to find.
 * @returns The line and character position of the method, or null if not found.
 */
function findMethodPosition(scriptText: string, methodName: string): { line: number, character: number } | null {
    const lines = scriptText.split('\n');
    const methodPattern = new RegExp(`\\b${methodName}\\b\\s*[:=]?\\s*\\(`);

    for (let i = 0; i < lines.length; i++) {
        if (methodPattern.test(lines[i])) {
            const character = lines[i].indexOf(methodName);
            return { line: i, character };
        }
    }
    return null;
}
