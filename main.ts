import {Plugin, ItemView, WorkspaceLeaf, Menu} from 'obsidian';

const plugin_name = 'koncham-workspace'
const view_type = 'root-leaves'
const view_name = 'Open Panes'

export default class konchamWorkspace extends Plugin {
	public view: RootLeavesListView;

	async onunload() {
		console.log('unloading plugin: ' + plugin_name);
	}

	async onload() {
		console.log('loading plugin: ' + plugin_name);

		// this.registerView(
		// 	view_type,
		// 	(leaf) => (this.view = new RootLeavesListView(leaf, this))
		// );

		this.registerView(view_type, (leaf) => (new RootLeavesListView(leaf, this)));
		

		// this.registerEvent(this.app.workspace.on('active-leaf-change', this.handleChange));
		// this.registerEvent(this.app.workspace.on('layout-change', this.handleChange));
		// this.registerEvent(this.app.workspace.on('layout-ready', this.handleChange));
		// this.registerEvent(this.app.vault.on('delete', this.handleDelete));
		// this.registerEvent(this.app.vault.on('rename', this.handleChange));

		this.app.workspace.onLayoutReady(this.initView);

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
			id: 'show-root-leaves-view',
			name: 'show open-panes',
			callback: () => this.showRootLeavesView(),
		});

		// this.addCommand({
		// 	id: 'handle-change',
		// 	name: 'refresh Open Panes',
		// 	callback: () => this.handleChange(),
		// });

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

	activateRootLeafbyNumber(n:number){
		let counter = 1
		this.app.workspace.iterateRootLeaves((leaf: WorkspaceLeaf) => {
			if (counter == n){
				this.app.workspace.setActiveLeaf(leaf, true, true);
			}
			counter += 1;
		});
	}

	// private readonly handleChange = async () => {
	// 	this.view.initialize();
	// }

	// private readonly handleDelete = async () => {
	// 	// console.log(plugin_name + ': delete event detected');
	// 	this.view.initialize();
	// }

}

// I've used large parts of the code from (recent-files plugin)[https://github.com/tgrosinger/recent-files-obsidian]
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

	onload(){
		console.log(view_name + ' loaded');

		this.registerEvent(this.app.workspace.on('active-leaf-change', this.handleChange));
		this.registerEvent(this.app.workspace.on('layout-change', this.handleChange));
		this.registerEvent(this.app.workspace.on('layout-ready', this.handleChange));
	}

	private readonly handleChange = async () => {
		this.initialize();
	}

	public readonly initialize = (): void => {
		let leaf_active = this.app.workspace.activeLeaf;
		const rootEl = createDiv({ cls: 'nav-folder mod-root koncham-workspace' });
		const childrenEl = rootEl.createDiv({ cls: 'nav-folder-children' });
		let n = 1
		this.app.workspace.iterateRootLeaves((leaf: WorkspaceLeaf) => {
			const navFile = childrenEl.createDiv({ cls: 'nav-file' });
			const navFileTitle = navFile.createDiv({ cls: 'nav-file-title' });

			if (leaf === leaf_active) {
				navFileTitle.addClass('is-active');
			}

			let displaytext = leaf.getDisplayText() + " || " + leaf.view.getViewType()
			if (leaf.view.getViewType() == "empty"){
				displaytext = "[empty]"
			} else {
				displaytext = leaf.getDisplayText()
			}

			navFileTitle.createDiv({
				cls: 'nav-file-title-content',
				text: displaytext,
			});
			navFileTitle.setAttr("data-nleaf", n)
			const contentEl = this.containerEl.children[1];
			contentEl.empty();
			contentEl.appendChild(rootEl);

			navFileTitle.onClickEvent(() => {
				let nleaf = navFileTitle.getAttr('data-nleaf')
				this.plugin.activateRootLeafbyNumber(parseInt(nleaf));
			});
			
			
			n += 1;
		});
	}

	public getViewType(): string {
		return view_type;
	}

	public getDisplayText(): string {
		return view_name;
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