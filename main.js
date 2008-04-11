// Initialize the state provider
Ext.state.Manager.setProvider(new Ext.air.FileProvider({
	file: 'app.state',
	// if first time running
	defaultState : {
		mainWindow : {
			width:780,
			height:580,
			x:10,
			y:10
		}
	}
}));

Ext.onReady(function(){
    Ext.QuickTips.init();

	// maintain window state automatically
	var win = new Ext.air.NativeWindow({
		id: 'mainWindow',
		instance: window.nativeWindow,
		minimizeToTray: true,
		trayIcon: 'ext-air/resources/icons/extlogo16.png',
		trayTip: 'Tarpo',
		trayMenu : [{
			text: 'Open Tarpo',
			handler: function(){
				win.activate();
			}
		}, '-', {
			text: 'Exit',
			handler: function(){
				air.NativeApplication.nativeApplication.exit();
			}
		}]
	});
	
    tx.data.conn.open('db');
    
    var visitsGrid = new VisitGrid();
	var surgGrid = new SurgGrid();
	var visitsSelections = visitsGrid.getSelectionModel();
	var surgSelections = surgGrid.getSelectionModel();
	
	// single col, single result
	function querySingle(sql) {
		var instance = Ext.sql.Connection.getInstance();
		instance.open('db');
		var result = instance.query(sql)[0];
		var results = new Array();
		for (p in result) {
			return result[p]; // return first
		}
	}
	
	function sigFigs(x) {
		return Math.round(x*100)/100;
	}
	
	// Shared actions used by Ext toolbars, menus, etc.
	var actions = {
		newVisit: new Ext.Action({
			text: 'New Entry',
			iconCls: 'icon-active',
			tooltip: 'New House Visit',
			handler: function(){
				Ext.air.NativeWindowManager.getVisitWindow();
			}
		}),
		
		newSurg: new Ext.Action({
			text: 'New Entry',
			iconCls: 'icon-active',
			tooltip: 'New Surgery',
			handler: function(){
				Ext.air.NativeWindowManager.getSurgWindow();
			}
		}),
		
		report: new Ext.Action({
			text: 'Report on All Data',
			iconCls: 'icon-active',
			tooltip: 'Report on All Data (right-click on individual list for more specific Report)',
			handler: function(listId){
				
				var xF, filter_for;
				if (listId && typeof listId === 'string' && querySingle('select isFolder from list where listId = "' + listId + '"') == 0) {
					xF = ' AND listId="' + listId + '"';
					filter_for = tx.data.lists.getName(listId);
				} else {
					xF = '';
					filter_for = 'All Data';
				}
				
				var houses_with_dogs = querySingle('select count(distinct house) from visit where type="DOG"' + xF);
				var dogs = querySingle('select count(*) from visit where type="DOG"' + xF);
				
				var report_data = {
					houses: querySingle('select count(distinct house) from visit where 1' + xF),
					houses_with_dogs: houses_with_dogs,
					dogs: dogs,
					cats: querySingle('select count(*) from visit where type="CAT"' + xF),
					puppies: querySingle('select count(*) from visit where type="PUPPY"' + xF),
					kittens: querySingle('select count(*) from visit where type="KITTEN"' + xF),
					pigs: querySingle('select count(*) from visit where type="PIG"' + xF),
					other: querySingle('select count(*) from visit where type="OTHER"' + xF),
					covinan: querySingle('select count(*) from visit where covinan=1' + xF),
					
					avg_bcs: sigFigs(querySingle('select avg(bcs) from visit where type="DOG"' + xF)),
					avg_mange: sigFigs(querySingle('select avg(mange) from visit where type="DOG"' + xF)),
					avg_dogs_per_house: sigFigs(dogs / houses_with_dogs ),
					
					speys: querySingle('select count(*) from surg where spey=1' + xF),
					castrations: querySingle('select count(*) from surg where castration=1' + xF),
					vaccinations: querySingle('select count(*) from surg where vacc=1' + xF),
					other_procedures: querySingle('select count(*) from surg where other_procedures != ""' + xF),
					
					euth_unwanted: querySingle('select count(*) from surg where euth="Unwanted"' + xF),
					euth_humane: querySingle('select count(*) from surg where euth="Humane"' + xF),
					euth_cheeky: querySingle('select count(*) from surg where euth="Cheeky"' + xF),
				};
				
				Ext.Msg.show({
					title: 'Report: ' + filter_for,
					msg: Templates.report.apply(report_data),
					minWidth: 400,
				});
			}
		}),
		
		deleteVisit: new Ext.Action({
			itemText: 'Delete',
			text: 'Delete',
			iconCls: 'icon-delete-visit',
			tooltip: 'Delete Visit',
			disabled: true,
			handler: function(){
				Ext.Msg.confirm('Confirm', 'Are you sure you want to delete the selected visit(s)?', function(btn){
					if (btn == 'yes') {
						visitsSelections.each(function(s){
							tx.data.visits.remove(s);
						});
					}
				});
			}
		}),
		
		deleteSurg: new Ext.Action({
			itemText: 'Delete Surg',
			text: 'Delete Surg',
			iconCls: 'icon-delete-visit',
			tooltip: 'Delete Surg',
			disabled: true,
			handler: function(){
				Ext.Msg.confirm('Confirm', 'Are you sure you want to delete the selected surg(s)?', function(btn){
					if (btn == 'yes') {
						surgSelections.each(function(s){
							tx.data.surg.remove(s);
						});
					}
				});
			}
		}),
		
		newList: new Ext.Action({
			itemText: 'New List',
			tooltip: 'New List',
			iconCls: 'icon-list-new',
			handler: function(){
				var id = tx.data.lists.newList(false, tree.getActiveFolderId()).id;
				tree.startEdit(id, true);
			}
		}),
		
		deleteList: new Ext.Action({
			itemText: 'Delete',
			tooltip: 'Delete List',
			iconCls: 'icon-list-delete',
			disabled: true,
			handler: function(){
				tree.removeList(tree.getSelectionModel().getSelectedNode());
			}
		}),
		
		newFolder: new Ext.Action({
			itemText: 'New Folder',
			tooltip: 'New Folder',
			iconCls: 'icon-folder-new',
			handler: function(){
				var id = tx.data.lists.newList(true, tree.getActiveFolderId()).id;
				tree.startEdit(id, true);
			}
		}),
		
		deleteFolder: new Ext.Action({
			itemText: 'Delete',
			tooltip: 'Delete Folder',
			iconCls: 'icon-folder-delete',
			disabled: true,
			handler: function(s){
				tree.removeList(tree.getSelectionModel().getSelectedNode());
			}
		}),
		
		quit : new Ext.Action({
			text: 'Exit',
			handler: function(){
				air.NativeApplication.nativeApplication.exit();
			}
		}),
		
		demoData: new Ext.Action({
			itemText: 'Load Demo Data',
			tooltip: 'Re-populate database with demo data',
			iconCls: 'icon-list-delete',
			handler: function(){
				tx.data.demoData();
			}
		}),
		
		resetDefaults: new Ext.Action({
			itemText: 'Reset Program Defaults',
			tooltip: 'Reset program defaults such as column widths',
			iconCls: 'icon-list-delete',
			handler: function(){
				air.NativeApplication.nativeApplication.addEventListener('exiting', function(){
					Ext.state.Manager.getProvider().clearAllState();
				});
				Ext.Msg.alert('Restart Required', 'Please restart to apply this change')
			}
		})
	};
    tx.actions = actions;

    var menus = Ext.air.SystemMenu;
	
	menus.add('File', [
		actions.newVisit, 
		actions.newSurg,
		actions.newList, 
		actions.newFolder,
		actions.demoData,
		actions.report,
		actions.resetDefaults,
		'-',
		actions.quit
	]);

    menus.add('Help', [{
        text: 'About',
        handler: function(){
            Ext.air.NativeWindowManager.getAboutWindow().activate();
        }
    }]);
	
	var tree = new ListTree({
		actions: actions,
		store: tx.data.lists
	});

	var root = tree.getRootNode();	

	var listSm = tree.getSelectionModel();
	
    tx.data.lists.bindTree(tree);
	tx.data.lists.on('update', function(){
		tx.data.visits.applyGrouping();
		tx.data.surg.applyGrouping();
		if(visitsGrid.titleNode){
			visitsGrid.setTitle(visitsGrid.titleNode.text);
		}
		if(surgGrid.titleNode){
			surgGrid.setTitle(surgGrid.titleNode.text);
		}
	});

    var tb = new Ext.Toolbar({
		region:'north',
		id:'main-tb',
		height:26,
		items: [{
				xtype:'splitbutton',
				iconCls:'icon-edit',
				text:'New House Visit',
				handler: actions.newVisit.initialConfig.handler,
				menu: [actions.newVisit, actions.newList, actions.newFolder]
			},{
				xtype:'splitbutton',
				iconCls:'icon-edit',
				text:'New Surg',
				handler: actions.newSurg.initialConfig.handler,
				menu: [actions.newSurg, actions.newList, actions.newFolder]
			},'-',
			actions.deleteVisit,
			actions.deleteSurg,
			actions.report,
            '->', ' ', ' ', ' '		
		]
	});
	
	var tab = new Ext.TabPanel({
        region:'center',
		id: 'tab-panel',
        activeTab: 0,
//        defaults:{autoScroll: true},
		deferredRender: false, // to avoid eval()!
        items:[

			new Ext.Panel({
				title: 'House Visits',
				layout: 'fit',
				items: visitsGrid,
				
			}), 
			new Ext.Panel({
				title: 'Surgeries',
				layout: 'fit',
				items: surgGrid,
				listeners: {'activate': function(){
					tx.data.surg.init();
				}}
			}), 
		],
			
    });

	var viewport = new Ext.Viewport({
        layout:'border',
        items: [tb, tree, tab]
    });
	
	visitsGrid.on('keydown', function(e){
         if(e.getKey() == e.DELETE && !visitsGrid.editing){
             actions.deleteVisit.execute();
         }
    });
	surgGrid.on('keydown', function(e){
         if(e.getKey() == e.DELETE && !surgGrid.editing){
             actions.deleteSurg.execute();
         }
    });
	
	tree.el.on('keydown', function(e){
         if(e.getKey() == e.DELETE && !tree.editor.editing){
             actions.deleteList.execute();
         }
    });

    visitsSelections.on('selectionchange', function(sm){
    	var disabled = sm.getCount() < 1;
    	actions.deleteVisit.setDisabled(disabled);
    });
	surgSelections.on('selectionchange', function(sm){
    	var disabled = sm.getCount() < 1;
    	actions.deleteSurg.setDisabled(disabled);
    });

	win.show();
	win.instance.activate();
	
	tx.data.visits.init();
	tx.data.surg.init();
	
	tree.root.select();
	
	// fix bug where surg doesn't show initially
	tx.data.surg.reload();
	
	var loadList = function(listId){
		var node = tree.getNodeById(listId);
		if(node && !node.isSelected()){
			node.select();
			return;
		}
		actions.deleteList.setDisabled(!node || !node.attributes.editable);
		actions.deleteFolder.setDisabled(!node || node.attributes.editable === false || !node.attributes.isFolder);
		if(node){
			if (node.attributes.isFolder) {
				var lists = [];
				node.cascade(function(n){
					if (!n.attributes.isFolder) {
						lists.push(n.attributes.id);
					}
				});
				tx.data.visits.loadList(lists);
				tx.data.surg.loadList(lists);
			}
			else {
				tx.data.visits.loadList(node.id);
				tx.data.surg.loadList(node.id);
			}
			visitsGrid.titleNode = node;
			surgGrid.titleNode = node;
			visitsGrid.setTitle(node.text);
			surgGrid.setTitle(node.text);
			visitsGrid.setIconClass(node.attributes.iconCls);
			surgGrid.setIconClass(node.attributes.iconCls);
		}
	}

	listSm.on('selectionchange', function(t, node){
		loadList(node ? node.id : null);
	});
	
	root.reload();
	
	win.on('closing', function(){
		Ext.air.NativeWindowManager.closeAll();
	});
});

    

