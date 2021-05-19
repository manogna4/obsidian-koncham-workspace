import {Plugin, ItemView, WorkspaceLeaf, Menu} from 'obsidian';

const plugin_name = 'koncham-workspace'
const view_type = 'center-panes'
const view_name = 'Center Panes'

export default class KonchamWorkspace extends Plugin {

	async onunload() {
		console.log('unloading plugin: ' + plugin_name);
	}

	async onload() {
		console.log('loading plugin: ' + plugin_name);

		this.registerView(view_type, (leaf) => (new RootLeavesListView(leaf, this)));
		
		this.app.workspace.onLayoutReady(this.initializeRootLeavesView);

		this.addCommand({
			id: 'leaves-pin-on',
			name: 'Pin all panes',
			callback: () => this.leavesPinOn(),
		});

		this.addCommand({
			id: 'leaves-pin-off',
			name: 'Unpin all panes',
			callback: () => this.leavesPinOff(),
		});

		this.addCommand({
			id: 'show-center-panes-view',
			name: 'Show center-panes',
			callback: () => this.showRootLeavesView(),
		});

		this.addCommand({
			id: 'open-center-panes-view',
			name: 'Reopen center-panes',
			callback: () => this.initializeRootLeavesView(),
		});

	}

	private readonly initializeRootLeavesView = (): void => {
		if (this.app.workspace.getLeavesOfType(view_type).length) {
			return;
		}
		this.app.workspace.getLeftLeaf(false).setViewState({
			type: view_type,
		});
	};

	leavesPinOn(){
		this.app.workspace.iterateRootLeaves((leaf: WorkspaceLeaf) => {
			leaf.setPinned(true);
		});
	}

	leavesPinOff() {
		this.app.workspace.iterateRootLeaves((leaf: WorkspaceLeaf) => {
			leaf.setPinned(false);
		});
	}

	showRootLeavesView() {
		this.app.workspace.iterateAllLeaves((leaf: WorkspaceLeaf) => {
			if (leaf.view.getViewType() == view_type) {
				this.app.workspace.revealLeaf(leaf);
			}
		});
	}

}

class RootLeavesListView extends ItemView {
	private readonly plugin: KonchamWorkspace

	constructor(
		leaf: WorkspaceLeaf,
		plugin: KonchamWorkspace,
	) {
		super(leaf);

		this.plugin = plugin;
		this.refreshView();
	}

	onload(){
		this.registerEvent(this.app.workspace.on('active-leaf-change', this.refreshView));
		this.registerEvent(this.app.workspace.on('layout-change', this.refreshView));
		this.registerEvent(this.app.workspace.on('layout-ready', this.refreshView));
	}

	public readonly refreshView = (): void => {
		let leaf_active = this.app.workspace.activeLeaf;
		const rootEl = createDiv({ cls: 'nav-folder mod-root koncham-workspace koncham-workspace-root-panes' });
		this.contentEl.empty();
		this.contentEl.appendChild(rootEl);
		const childrenEl = rootEl.createDiv({ cls: 'nav-folder-children' });
		this.app.workspace.iterateRootLeaves((leaf: WorkspaceLeaf) => {
			const navFile = childrenEl.createDiv({ cls: 'nav-file' });
			const navFileTitle = navFile.createDiv({ cls: 'nav-file-title' });

			if (leaf === leaf_active) {
				navFileTitle.addClass('is-active');
			}

			let displaytext
			if (leaf.view.getViewType() == "empty"){
				displaytext = "[empty]"
			} else {
				displaytext = leaf.getDisplayText()
			}

			navFileTitle.createDiv({
				cls: 'nav-file-title-content',
				text: displaytext,
			});

			navFileTitle.onClickEvent(() => {
				this.app.workspace.setActiveLeaf(leaf);
			});
		});
	}

	public getViewType(): string {
		return view_type;
	}

	public getDisplayText(): string {
		return view_name;
	}

	public getIcon(): string {
		return 'three-horizontal-bars';
	}

	public onHeaderMenu(menu: Menu): void {
		menu
			.addItem((item) => {
				item
					.setTitle('close')
					.setIcon('cross')
					.onClick(() => {
						this.app.workspace.detachLeavesOfType(view_type);
					});
			})
			.addItem((item) => {
				item
					.setTitle('pin leaves')
					.setIcon('pin')
					.onClick(() => {
						this.plugin.leavesPinOn();
					});
			})
			.addItem((item) => {
				item
					.setTitle('unpin leaves')
					.setIcon('cross-in-box')
					.onClick(() => {
						this.plugin.leavesPinOff();
					});
			})
	}
}