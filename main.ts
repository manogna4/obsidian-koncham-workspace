import {Plugin} from 'obsidian';

const plugin_name = 'koncham-workspace'

export default class MyPlugin extends Plugin {

	async onunload() {
		console.log('unloading plugin: ' + plugin_name);
	}

	async onload() {
		console.log('loading plugin: ' + plugin_name);

		this.addCommand({
			id: 'leaves-pin-on',
			name: 'pin all leaves',
			callback: () => this.leavesPinOn(),
		});

		this.addCommand({
			id: 'leaves-pin-off',
			name: 'unpin all leaves',
			callback: () => this.leavesPinOff(),
		});

		this.addCommand({
			id: 'reveal-tag-pane',
			name: 'reveal tag pane',
			callback: () => this.revealTagPane(),
		});

		this.addCommand({
			id: 'reveal-recent-files',
			name: 'reveal recent files',
			callback: () => this.revealRecentFiles(),
		});

		this.addCommand({
			id: 'reveal-starred',
			name: 'reveal starred',
			callback: () => this.revealStarred(),
		});

		this.addCommand({
			id: 'reveal-backlinks',
			name: 'reveal backlinks',
			callback: () => this.revealBacklinks(),
		});

		this.addCommand({
			id: 'reveal-outline',
			name: 'reveal outline',
			callback: () => this.revealOutline(),
		});

		this.addCommand({
			id: 'reveal-search',
			name: 'reveal file search',
			callback: () => this.revealSearch(),
		});

		this.addCommand({
			id: 'reveal-file-explorer',
			name: 'reveal file explorer',
			callback: () => this.revealFileExplorer(),
		});

		this.addCommand({
			id: 'reveal-calendar',
			name: 'reveal calendar',
			callback: () => this.revealCalendar(),
		});

	}

	leavesPinOn(){
		this.app.workspace.iterateRootLeaves((leaf: any) => {
			leaf.setPinned(true);
		});
	}

	leavesPinOff() {
		this.app.workspace.iterateRootLeaves((leaf: any) => {
			leaf.setPinned(false);
		});
	}

	revealTagPane(){
		this.app.workspace.iterateAllLeaves((leaf: any) => {
			if (leaf.getDisplayText() == "Tag pane"){
				this.app.workspace.revealLeaf(leaf);
			}
		});
	}

	revealRecentFiles() {
		this.app.workspace.iterateAllLeaves((leaf: any) => {
			if (leaf.getDisplayText() == "Recent Files") {
				this.app.workspace.revealLeaf(leaf);
			}
		});
	}

	revealStarred() {
		this.app.workspace.iterateAllLeaves((leaf: any) => {
			if (leaf.getDisplayText() == "Starred") {
				this.app.workspace.revealLeaf(leaf);
			}
		});
	}

	revealSearch() {
		this.app.workspace.iterateAllLeaves((leaf: any) => {
			if (leaf.getDisplayText() == "Search") {
				this.app.workspace.revealLeaf(leaf);
			}
		});
	}

	revealFileExplorer() {
		this.app.workspace.iterateAllLeaves((leaf: any) => {
			if (leaf.getDisplayText() == "File explorer") {
				this.app.workspace.revealLeaf(leaf);
			}
		});
	}

	revealBacklinks() {
		let note_curr = this.app.workspace.activeLeaf.getDisplayText();
		this.app.workspace.iterateAllLeaves((leaf: any) => {
			if (leaf.getDisplayText() == "Backlinks for " + note_curr) {
				this.app.workspace.revealLeaf(leaf);
			}
		});
	}

	revealOutline() {
		let note_curr = this.app.workspace.activeLeaf.getDisplayText();
		this.app.workspace.iterateAllLeaves((leaf: any) => {
			if (leaf.getDisplayText() == "Outline of " + note_curr) {
				this.app.workspace.revealLeaf(leaf);
			}
		});
	}

	revealCalendar() {
		let note_curr = this.app.workspace.activeLeaf.getDisplayText();
		this.app.workspace.iterateAllLeaves((leaf: any) => {
			if (leaf.getDisplayText() == "Calendar") {
				this.app.workspace.revealLeaf(leaf);
			}
		});
	}

	

}