import * as vscode from "vscode";
import simpleGit from "simple-git";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.undoCommit",
    async () => {
      try {
        // Get the root path of the workspace
        const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

        // If there is no workspace open, show an error message
        if (!rootPath) {
          vscode.window.showErrorMessage("No workspace open.");
          return;
        }

        // Initialize simple-git
        const git = simpleGit(rootPath);

        // Get the commit hash of the last commit
        const logSummary = await git.log({ n: 1 });
        const lastCommitHash = logSummary.latest?.hash;

        // Perform a hard reset to undo the last commit
        await git.raw(["reset", "--hard", `${lastCommitHash}^`]);

        // Show a success message
        vscode.window.showInformationMessage("Undo Commit successful!");
      } catch (error) {
        // Handle errors
        vscode.window.showErrorMessage(
          `Error undoing commit: ${(error as Error).message}`
        );
      }
    }
  );

  // Create a button in the UI
  let button = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );
  button.text = "$(discard) Undo Commit";
  button.command = "extension.undoCommit";
  button.tooltip = "Undo the last commit";
  button.show();

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
