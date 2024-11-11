import * as path from 'path';
import * as vscode from 'vscode';
import * as assert from 'assert';

describe('Definition Provider Tests', () => {
    const vueFilePath = path.join(__dirname, '..', '..', 'testFixture', 'test.vue');

    test('Go to method definition in Vue file', async () => {
        // 打开测试用的Vue文件
        const document = await vscode.workspace.openTextDocument(vueFilePath);
        const editor = await vscode.window.showTextDocument(document);

        // 找到template部分中的方法引用并定位到该位置
        const methodPosition = new vscode.Position(3, 20); // 假设方法名在第4行的某个位置
        editor.selection = new vscode.Selection(methodPosition, methodPosition);

        // 执行定义跳转命令
        await vscode.commands.executeCommand('editor.action.revealDefinition');

        // 获取跳转后的光标位置，验证它跳转到了预期的方法定义行
        const newPosition = editor.selection.active;
        assert.strictEqual(newPosition.line, 10); // 假设方法定义在第11行
    });
});
