/**
 * Tarpo.Store.List
 */
Ext.namespace('Tarpo.Store.List');
Tarpo.Store.List = Ext.extend(Ext.data.Store, {
	constructor: function(){
		Tarpo.Store.List.superclass.constructor.call(this, {
	        sortInfo:{field: 'listName', direction: "ASC"},
	        reader: new Ext.data.JsonReader({
	            id: 'listId',
				fields: Tarpo.Data.List
	        })
	    });
		
	    this.conn = Tarpo.Db;
	    this.proxy = new Ext.sql.Proxy(Tarpo.Db, 'list', 'listId', this);
	},
	
    getName : function(id){
		var l = this.data.map[id];
		return l ? l.data.listName : '';
	},
	
	addList : function(name, id, isFolder, parentId){
		var l = this.findList(name);
		if(!l){
			var id = id || Ext.uniqueId();
			l = new Tarpo.Data.List({listId: id, listName: name, isFolder: isFolder === true, parentId: parentId || 'root'}, id);
			this.add(l);
		}
		return l;
	},
	
	newList : function(isFolder, parentId){
		var i = 1;
		var text = isFolder ? 'New Folder ' : 'New List '; 
		while(this.findList(text + i)){
			i++;
		}
		return this.addList(text + i, undefined, isFolder, parentId);
	},
	
	findList : function(name){
		var d = this.data;
		for(var i = 0, len = d.length; i < len; i++){
			if(d.items[i].data.listName === name){
				return d.items[i];
			}
		}
		return null;
	},
	
	demoData: function(){
		this.addList('2007', '2007', true, 'root');
		this.addList('2007 Trip 1 (Start of dry season)', '2007-dry-start', false, '2007');
		this.addList('2007 Trip 2 (End of dry season)', '2007-dry-end', false, '2007');
		
		this.addList('2008', '2008', true, 'root');
		this.addList('2008 Trip 1 (Start of dry season)', '2008-dry-start', false, '2008');
	},
	
	bindTree : function(tree){
		this.tree = tree;
		
		this.on({
			add: function(ls, records){
				var pnode = tree.getNodeById(records[0].data.parentId);
				if(pnode){
					pnode.reload();
				}
			},
			
			remove: function(ls, record){
				var node = tree.getNodeById(record.id);
				if(node && node.parentNode){
					node.parentNode.removeChild(node);
				}
			},
			
			update: function(ls, record){
				var node = tree.getNodeById(record.id);
				if(node){
					node.setText(record.data.listName);
				}
			}
		});
	},
	
	prepareTable : function(){
        try{
        this.createTable({
            name: 'list',
            key: 'listId',
            fields: Tarpo.Data.List.prototype.fields
        });
        }catch(e){Tarpo.log(e);}
    }
});
