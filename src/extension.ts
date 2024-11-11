import * as vscode from 'vscode';
import { registerVueNavigation } from './navigation';

export function activate(context: vscode.ExtensionContext) {
  console.log('Vue Navigation Extension Activated');
  registerVueNavigation(context);
}

export function deactivate() {}
