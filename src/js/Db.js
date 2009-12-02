/**
 * Singleton for communicating with the currently open database
 * (per-window singleton, that is)
 * 
 * This object is an instance of Ext.sql.AirConnection (see below), 
 * so refer to the docs for that class for more information on methods 
 * that can be called.
 * 
 * Usage:
 *  Tarpo.Db.open(file);
 *  Tarpo.Db.exec('delete from visit');
 *  Tarpo.Db.query('select * from visit');
 *  Tarpo.Db.queryBy('select * from visit where id = ?', [ "710663999ZKAA" ]); 
 *  Tarpo.Db.queryBy('select * from visit where id = :id', { id : "710663999ZKAA" });
 *  Tarpo.Db.close();
 *  
 *  // Lower level API access
 *  var stmt = Tarpo.Db.createStatement('query');
 *  stmt.text = 'select * from visit where id = ?';
 *  Tarpo.Db.addParams(stmt, [ "710663999ZKAA" ]);
 *  stmt.execute(Tarpo.Db.maxResults);
 *  var rs = stmt.getResult(); // SQLResult object, has rowsAffected, etc..
 *  var regularArray = Tarpo.Db.readResults(rs);
 */

/**
 * Tarpo only needs a single database connection, so we use
 * the return result of Ext.sql.Connection.getInstance (an
 * instance of Ext.sql.AirConnection) as a singleton.
 * 
 * This instance must be open()'d before it can be used,
 * and can be close()'d to change databases.
 * 
 * Each native window that includes this class will have its own database connection
 */
Tarpo.Db = Ext.sql.Connection.getInstance();

/**
 * Override Ext.sql.AirConnection.open() so that it works with
 * general air.File instances, rather than assuming that the sqlite
 * file lives in air.File.applicationStorageDirectory
 */
Ext.apply(Tarpo.Db, {
	open: function(file){
    	this.conn = new air.SQLConnection();
		this.conn.open(file);
    	this.openState = true;
		this.fireEvent('open', this);
	},
});
