import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	// 注册定义跳转的功能
	context.subscriptions.push(
		vscode.languages.registerDefinitionProvider({ language: 'vue' }, {
			provideDefinition(document, position, token) {
				const range = document.getWordRangeAtPosition(position);
				if (!range) return;

				const methodName = document.getText(range);
				console.log(`Attempting to jump to definition for method: ${methodName}`);

				// 解析 <script> 中的方法
				const { content: scriptText, lineOffset } = extractScriptContent(document.getText());
				const methodPosition = findMethodPosition(scriptText, methodName);

				if (methodPosition) {
					const targetPosition = new vscode.Position(methodPosition.line + lineOffset, methodPosition.character);
					console.log(`Jumping to line ${methodPosition.line + lineOffset}, character ${methodPosition.character}`);
					return new vscode.Location(document.uri, targetPosition);
				}

			}
		})
	);

	// 绑定命令到Ctrl+Click
	context.subscriptions.push(
		vscode.commands.registerCommand('extension.goToMethodDefinition', () => {
			vscode.commands.executeCommand('editor.action.revealDefinition');
		})
	);
}

// Helper functions
function extractScriptContent(text: string): { content: string, lineOffset: number } {
	const scriptMatch = text.match(/<script[^>]*>([\s\S]*?)<\/script>/);
	if (scriptMatch) {
		const beforeScript = text.slice(0, scriptMatch.index);
		const lineOffset = (beforeScript.match(/\n/g) || []).length;
		return { content: scriptMatch[1], lineOffset };
	}
	return { content: '', lineOffset: 0 };
}



function findMethodPosition(scriptText: string, methodName: string): { line: number, character: number } | null {
	const lines = scriptText.split('\n');
	const methodPattern = new RegExp(`\\b${methodName}\\b\\s*[:=]?\\s*\\(`);

	for (let i = 0; i < lines.length; i++) {
		if (methodPattern.test(lines[i])) {
			const character = lines[i].indexOf(methodName);
			console.log(`Found method "${methodName}" at line ${i}, character ${character}`);
			return { line: i, character };
		}
	}
	console.log(`Method "${methodName}" not found in <script> block.`);
	return null;
}


