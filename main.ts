import {Plugin, ItemView, WorkspaceLeaf, Menu} from 'obsidian';

const plugin_name = 'koncham-workspace'
const view_type = 'root-leaves-list'

export default class konchamWorkspace extends Plugin {
	public view: RootLeavesListView;

	async onunload() {
		console.log('unloading plugin: ' + plugin_name);
	}

	async onload() {
		console.log('loading plugin: ' + plugin_name);

		this.registerView(
			view_type,
			(leaf) => (this.view = new RootLeavesListView(leaf, this))
		);

		this.registerEvent(this.app.workspace.on('active-leaf-change', this.handleChange));
		this.registerEvent(this.app.workspace.on('layout-change', this.handleChange));
		this.registerEvent(this.app.vault.on('rename', this.handleChange));

		if (this.app.workspace.layoutReady) {
			this.initView();
		} else {
			this.registerEvent(this.app.workspace.on('layout-ready', this.initView));
		}

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
			id: 'show-leaves-list',
			name: 'show leaves list',
			hotkeys: [{ "modifiers": [], "key": "F23" }],
			callback: () => this.showRootLeavesList(),
		});

	}

	private readonly initView = (): void => {
		if (this.app.workspace.getLeavesOfType(view_type).length) {
			return;
		}
		this.app.workspace.getLeftLeaf(false).setViewState({
			type: view_type,
			active: true,
		});
	};

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

	showRootLeavesList() {
		this.app.workspace.iterateAllLeaves((leaf: any) => {
			if (leaf.getViewState()['type'] == view_type) {
				this.app.workspace.revealLeaf(leaf);
			}
		});
	}

	private readonly handleChange = async () => {
		this.view.initialize();
	}

}


class RootLeavesListView extends ItemView {
	private readonly plugin: konchamWorkspace

	constructor(
		leaf: WorkspaceLeaf,
		plugin: konchamWorkspace,
	) {
		super(leaf);

		this.plugin = plugin;
		this.initialize();
	}

	public readonly initialize = (): void => {
		let leaf_active = this.app.workspace.activeLeaf;
		const rootEl = createDiv({ cls: 'nav-folder mod-root' });
		const childrenEl = rootEl.createDiv({ cls: 'nav-folder-children' });
		this.app.workspace.iterateRootLeaves((leaf: any) => {
			const navFile = childrenEl.createDiv({ cls: 'nav-file' });
			const navFileTitle = navFile.createDiv({ cls: 'nav-file-title' });

			if (leaf === leaf_active) {
				navFileTitle.addClass('is-active');
			}

			navFileTitle.createDiv({
				cls: 'nav-file-title-content',
				text: leaf.getDisplayText(),
			});
			const contentEl = this.containerEl.children[1];
			contentEl.empty();
			contentEl.appendChild(rootEl);
		});
	}

	public getViewType(): string {
		return view_type;
	}

	public getDisplayText(): string {
		return 'Root Leaves';
	}

	public getIcon(): string {
		return 'double-down-arrow-glyph';
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
			});
	}
}