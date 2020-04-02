import { ALObjectCollectorCache } from './ALObjectCollectorCache';
'use strict';

import * as vscode from 'vscode';
import { ALPanel } from './ALPanel';
import { ALObjectDesigner } from './ALModules';
import querystring = require('querystring');
import { ALTableGenerator } from './ALTableGenerator';
import { DalDocumentProvider } from './DalDocumentProvider';

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('alObjectDesigner.openALWindow', async () => {
        try {
            await ALPanel.open(context.extensionPath, ALObjectDesigner.PanelMode.List);
        } catch (e) {
            console.error(e);
            vscode.window.showErrorMessage(`AL Object Designer could not be opened. Error: '${e.message}'`);
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('alObjectDesigner.openALDesignWindow', async () => {
        try {
            await ALPanel.openDesigner(context.extensionPath);
        } catch (e) {
            console.error(e);
            vscode.window.showErrorMessage(`AL Page Designer could not be opened. Error: '${e.message}'`);
        }
    }));

    context.subscriptions.push(vscode.window.registerUriHandler(<vscode.UriHandler>{
        async handleUri(uri: vscode.Uri) {
            let q = querystring.parse(uri.query);
            q.FsPath = "";
            await ALPanel.command(context.extensionPath, q);
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('alObjectDesigner.generateALTables', async () => {
        try {
            let generator = new ALTableGenerator();
            await generator.generate();
        } catch (e) {
            console.error(e);
            vscode.window.showErrorMessage(`AL Table Generator could not be opened. Error: '${e.message}'`);
        }
    }));

    
    context.subscriptions.push(vscode.commands.registerCommand('alObjectDesigner.clearCache', async () => {
        try {
            let collectorCache = new ALObjectCollectorCache();
            await collectorCache.clearCache();
            vscode.window.showInformationMessage(`AL Object Designer cache deleted.`);
        } catch (e) {
            console.error(e);
            vscode.window.showErrorMessage(`AL Object Designer Cache cannot be deleted: ${e.message}`);
        }
    }));

    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('alObjectDesignerDal', new DalDocumentProvider()));
}

// this method is called when your extension is deactivated
export function deactivate() {
    (ALPanel.currentPanel as ALPanel).dispose();
}