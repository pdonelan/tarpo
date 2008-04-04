Ext.onReady(function(){

    Ext.QuickTips.init();
	
	var win = window.nativeWindow;
	
	var opener = Ext.air.NativeWindow.getRootHtmlWindow();
	var visitId = String(window.location).split('=')[1];
	var isNew = visitId == 'New';
	if (isNew) {
		visitId = '270981421JBPW';
		win.title = 'New Visit';
	} else {
		win.title = 'House Visit - ' + Ext.util.Format.ellipsis(getView().data.title, 40);
	}	
	
	var tb = new Ext.Toolbar({
		region: 'north',
		height:26,
		id:'main-tb',
		items:[
			{iconCls: 'icon-delete-visit', text: 'Delete', handler: function(){
				Ext.Msg.confirm('Confirm Delete', 'Are you sure you want to delete this visit?', function(btn){
					if(btn == 'yes'){
						opener.tx.data.visits.remove(getView());
						win.close();
					}
				});
			}}
		]
	});
	
	var d = new Ext.form.DateField({
		fieldLabel: 'Date',
		name: 'd',
		width: 135,
		format: 'm/d/Y'
	});
	
	var addr = new Ext.form.TextField({
		fieldLabel: 'House',
        name: 'addr',
        anchor: '100%'
    });
	
	var loc = new Ext.form.TextField({
		fieldLabel: 'Location',
        name: 'loc',
        anchor: '100%'
    });
	
	var type = new Ext.form.TextField({
		fieldLabel: 'Type',
        name: 'type',
        anchor: '100%'
    });
	
	var name = new Ext.form.TextField({
		fieldLabel: 'Name',
        name: 'name',
        anchor: '100%'
    });
	
	var colour = new Ext.form.TextField({
		fieldLabel: 'Colour',
        name: 'colour',
        anchor: '100%'
    });
	
	var sex = new Ext.form.TextField({
		fieldLabel: 'Sex',
        name: 'sex',
        anchor: '100%'
    });
	
	var desexed = new Ext.form.TextField({
		fieldLabel: 'Desexed',
        name: 'desexed',
        anchor: '100%'
    });
	
	var bcs = new Ext.form.TextField({
		fieldLabel: 'BCS',
        name: 'bcs',
        anchor: '100%'
    });
	
	var mange = new Ext.form.TextField({
		fieldLabel: 'Mange',
        name: 'mange',
        anchor: '100%'
    });	
	
	var ticks = new Ext.form.TextField({
		fieldLabel: 'ticks',
        name: 'ticks',
        anchor: '100%'
    });	
	
	var fleas = new Ext.form.TextField({
		fieldLabel: 'fleas',
        name: 'fleas',
        anchor: '100%'
    });	
	
	var covinan = new Ext.form.TextField({
		fieldLabel: 'covinan',
        name: 'covinan',
        anchor: '100%'
    });	
	
	var tvt = new Ext.form.TextField({
		fieldLabel: 'tvt',
        name: 'tvt',
        anchor: '100%'
    });	
	
	var comments = new Ext.form.TextField({
		fieldLabel: 'Comments',
        name: 'comments',
        anchor: '100%'
    });
	
//	var description = new Ext.form.HtmlEditor({
//        hideLabel: true,
//        name: 'description',
//        anchor: '100% -95',  // anchor width by percentage and height by raw adjustment
//        onEditorEvent : function(e){
//	        var t;
//	        if(e.browserEvent.type == 'mousedown' && (t = e.getTarget('a', 3))){
//	            t.target = '_blank';
//	        }
//	        this.updateToolbar();
//	    }
//    });
	
	var form = new Ext.form.FormPanel({
		region:'center',
        baseCls: 'x-plain',
        labelWidth: 75,
        margins:'10 10 5 10',
		
		buttonAlign: 'right',
		minButtonWidth: 80,
		buttons:[{
			text: 'OK',
			handler: function(){
				if(validate()) {
					saveData();
					window.nativeWindow.close();
				}
			}
		},{
			text: 'Cancel',
			handler: function(){ window.nativeWindow.close(); }
		}],
				
		
        items: [
		d,
		addr,
		loc,
		type,
		name,
		colour,
		sex,
		desexed,
		bcs,
		mange,
		ticks,
		fleas,
		covinan,
		tvt,
		comments]
    });
	
	var viewport = new Ext.Viewport({
		layout:'border',
		items:[tb, form]
	});
	
	var msg = Ext.get('msg');
	
	refreshData.defer(10);

	win.visible = true;
	win.activate();
	
	addr.focus();
		
	function refreshData(){
		if(!isNew){
			var view = getView();
			form.getForm().loadRecord(view);
		}
	}
	
	function saveData(){
		var view;
		if(isNew){
			view = opener.tx.data.visits.createVisit(
				d.getValue(), 
				addr.getValue(), 
				loc.getValue(),
				type.getValue()
			);
		}else{
			view = getView();
			// should all happen automagically
		}
		form.getForm().updateRecord(view);
	}
	
	function setMsg(msgText){
		var last;
		if(!msgText) {
			msg.setDisplayed(false);
		} else {
			msg.setDisplayed('');
			msg.update(msgText);
		}
//		description.anchorSpec.bottom = function(v){
//            if(v !== last){
//                last = v;
//				var h = msg.getHeight();
//                return v - 95 - (h ? h + 8 : 0);
//            }
//        };
		form.doLayout();
	}
	
	function validate(){
		if(Ext.isEmpty(addr.getValue(), false)){
			Ext.Msg.alert('Warning', 'Unable to save changes. Address is required.', function(){
				addr.focus();
			});
			return false;
		}
		return true;
	}
	
	function getView(){
		if (visitId == 'New') {
			return null;
		}
		var t = opener.tx.data.visits.lookup(visitId);
		if(t){
			//workaround WebKit cross-frame date issue
			fixDateMember(t.data, 'd');
		}
		return t;
	}
});   

