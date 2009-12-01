/**
 * Tarpo.Data
 */
Ext.namespace('Tarpo.Data');

Tarpo.Data.row_limit = 60;

// Define the Visit data type
Tarpo.Data.Visit = Ext.data.Record.create([
    {name: 'id', type:'string'},
	{name: 'listId', type:'string'},
	{name: 'd', type:'date', dateFormat: Ext.sql.Proxy.DATE_FORMAT, defaultValue: ''},
    {name: 'loc', type:'string'},
    {name: 'house', type:'string'},
	{name: 'owner', type:'string'},
    {name: 'type', type:'string'},
    {name: 'name', type:'string'},
	{name: 'colour', type:'string'},
	{name: 'sex', type:'string'},
    {name: 'desexed', type:'boolean'},
	{name: 'bcs', type:'int'},
	{name: 'mange', type:'int'},
	{name: 'ticks', type:'int'},
	{name: 'fleas', type:'int'},
	{name: 'ivermectin', type:'boolean'},
	{name: 'covinan', type:'boolean'},
	{name: 'tvt', type:'boolean'},	
	{name: 'comments', type:'string'}
]);

// Define the Surg data type
Tarpo.Data.Surg = Ext.data.Record.create([
    {name: 'id', type:'string'},
	{name: 'listId', type:'string'},
	{name: 'd', type:'date', dateFormat: Ext.sql.Proxy.DATE_FORMAT, defaultValue: ''},
    {name: 'loc', type:'string'},
	{name: 'house', type:'string'},
	
	{name: 'balanda', type:'boolean'},
	{name: 'owner', type:'string'},
	{name: 'domicile', type:'string'},
	
	{name: 'type', type:'string'},
    {name: 'mc', type:'string'},
	{name: 'name', type:'string'},
    {name: 'breed', type:'string'},
    {name: 'colour', type:'string'},
	{name: 'sex', type:'string'},
	{name: 'desexed', type:'boolean'},
	{name: 'bcs', type:'int'},
	{name: 'mange', type:'int'},
	{name: 'charge', type:'string'},
	
	{name: 'desex', type:'string'},
	{name: 'other_procedures', type:'boolean'},
	{name: 'tvt', type:'string'},
	{name: 'vacc', type:'boolean'},
	{name: 'details', type:'string'},
]);

// Define the Med data type
Tarpo.Data.Med = Ext.data.Record.create([
    {name: 'id', type:'string'},
	{name: 'listId', type:'string'},
	{name: 'd', type:'date', dateFormat: Ext.sql.Proxy.DATE_FORMAT, defaultValue: ''},
    {name: 'loc', type:'string'},
	{name: 'house', type:'string'},
	
	{name: 'balanda', type:'boolean'},
	{name: 'owner', type:'string'},
	{name: 'domicile', type:'string'},
	
	{name: 'type', type:'string'},
    {name: 'mc', type:'string'},
	{name: 'name', type:'string'},
    {name: 'breed', type:'string'},
    {name: 'colour', type:'string'},
	{name: 'sex', type:'string'},
	{name: 'desexed', type:'boolean'},
	{name: 'bcs', type:'int'},
	{name: 'mange', type:'int'},
	{name: 'charge', type:'string'},
	
	{name: 'reason', type:'string'},
	{name: 'vacc', type:'boolean'},
	{name: 'euth', type:'string'},
	{name: 'details', type:'string'},
]);

// Define the List data type
Tarpo.Data.List = Ext.data.Record.create([
    {name: 'listId', type:'string'},
    {name: 'parentId', type:'string'},
    {name: 'listName', type:'string'},
    {name: 'isFolder', type:'boolean'}
]);

Tarpo.Data.demoData = function(){
    Tarpo.Data.getConnection().exec('delete from list');
    Tarpo.Data.getConnection().exec('delete from visit');
    Tarpo.Data.getConnection().exec('delete from surg');
    Tarpo.Data.getConnection().exec('delete from med');
    Tarpo.store.list.reload();
    Tarpo.store.visit.reload();
    Tarpo.store.surg.reload();
    Tarpo.store.med.reload();
    Tarpo.store.list.demoData();
    Tarpo.store.visit.demoData();
    Tarpo.store.surg.demoData();
    Tarpo.store.med.demoData();
}

/**
 * Return a singleton instance
 */
Tarpo.Data.getConnection = function() {
	var connection = Ext.sql.Connection.getInstance();
	Tarpo.Data.getConnection = function(){ return connection};
	return connection;
}