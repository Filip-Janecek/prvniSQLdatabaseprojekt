const getDbConnection = require("./db-mysql").getConnection;
//let t;
let test;
let editaceId;

exports.apiDb = function (req, res, obj) {
    let connection = getDbConnection();
    if (req.pathname.endsWith("/tridy")) {
        connection.query(
            `SELECT * FROM spaserverexample_tridy ORDER BY rocnik,oznaceni`,
            function(err, rows){
                if (err) {
                    console.error(JSON.stringify({status: "Error", error: err}));
                    obj.error = JSON.stringify(err);
                } else {
                    obj.tridy = rows;
                }
                res.end(JSON.stringify(obj));
            }
        );
    } else if (req.pathname.endsWith("/studenti")) {
        let qry = "SELECT s.id,s.jmeno,s.prijmeni,t.rocnik,t.oznaceni as 'oznaceni_tridy',s.cislo_podle_tridnice FROM spaserverexample_studenti s, spaserverexample_tridy t WHERE t.id=s.tridy_id";
        qry += " AND s.stav=1";
        if (req.parameters.trida) { //pokud je zadana trida, vybereme jen studenty z dane tridy
            qry += " AND t.id="+req.parameters.trida;
        }
        if (req.parameters.text) { //pokud je zadan vyhledavany text, vybereme jen studenty, jejichz jmeno nebo prijmeni obsahuje dany text
            qry += " AND (s.jmeno LIKE '%"+req.parameters.text+"%' OR s.prijmeni LIKE '%"+req.parameters.text+"%')";
        }
        qry += " ORDER BY prijmeni,jmeno,rocnik"; //setridime primarne podle prijmeni
        console.log(qry);
        connection.query(qry,
            function(err, rows){
                if (err) {
                    console.error(JSON.stringify({status: "Error", error: err}));
                    obj.error = JSON.stringify(err);
                } else {
                    obj.studenti = rows;
                }
                res.end(JSON.stringify(obj));
            }
        );
    } else if (req.pathname.endsWith("/detailStudenta")) {
        editaceId = req.parameters.id;

        let qry = "SELECT * FROM spaserverexample_studenti WHERE id=" + editaceId;
        connection.query(qry,
            function(err, rows){
                if (err) {
                    console.error(JSON.stringify({status: "Error", error: err}));
                    obj.error = JSON.stringify(err);
                } else {
                    obj.student = rows[0];
                    //delete(obj.student.jmeno);
                }
                res.end(JSON.stringify(obj));
            }
        );
    } else if (req.pathname.endsWith("/smazStudenta")) {
//        let qry = "DELETE FROM spaserverexample_studenti WHERE id="+req.parameters.id;
        let qry = "UPDATE spaserverexample_studenti SET stav = '2' WHERE id="+req.parameters.id;
        connection.query(qry,
            function(err, rows){
                if (err) {
                    console.error(JSON.stringify({status: "Error", error: err}));
                    obj.error = JSON.stringify(err);
                } else {
                }
                res.end(JSON.stringify(obj));
            }
        );
    } else if (req.pathname.endsWith("/kopirujStudenta")) {
        let j = req.parameters.jmeno;
        let p = req.parameters.prijmeni;
        let c = req.parameters.cislo;
        let t = req.parameters.trida;
//        let qry = "DELETE FROM spaserverexample_studenti WHERE id="+req.parameters.id;
        let qry = "INSERT INTO `spaserverexample_studenti` (`tridy_id`, `jmeno`, `prijmeni`, `cislo_podle_tridnice`, `stav`) VALUES ('"+t+"', '"+j+"', '"+p+"', '"+c+"', '1')";
        connection.query(qry,
            function(err, rows){
                if (err) {
                    console.error(JSON.stringify({status: "Error", error: err}));
                    obj.error = JSON.stringify(err);
                } else {
                }
                res.end(JSON.stringify(obj));
            }
        );
    } else if (req.pathname.endsWith("/ulozStudenta")) {
        let jmeno = req.parameters.jmeno;
        let pprijmeni = req.parameters.prijmeni;
        let cislo = req.parameters.cislo;
        let trida = req.parameters.trida;

        //let qry = "UPDATE FROM spaserverexample_studenti  SET tridy_id='"+t+"', jmeno='"+j+"', prijmeni='"+p+"', cislo_podle_tridnice='"+c+"' WHERE id="+req.parameters.id;
        let qry = "UPDATE spaserverexample_studenti SET tridy_id='"+trida+"', jmeno='"+jmeno+"', prijmeni='"+pprijmeni+"', cislo_podle_tridnice='"+cislo+"' WHERE id="+ editaceId;

        connection.query(qry,
            function(err, rows){
                if (err) {
                    console.error(JSON.stringify({status: "Error", error: err}));
                    obj.error = JSON.stringify(err);
                } else {
                }

                res.end(JSON.stringify(obj));
            }
        );
    } else if (req.pathname.endsWith("/cislotridnice")) {
        let t = req.parameters.trida;
        let qry = "SELECT MAX(cislo_podle_tridnice) AS max_cislo_v_tridnici FROM `spaserverexample_studenti` WHERE tridy_id="+t;
        connection.query(qry,
            function(err, rows){
                if (err) {
                    console.error(JSON.stringify({status: "Error", error: err}));
                    obj.error = JSON.stringify(err);
                } else {
                    /*sqlValues = rows[0].name;
                    obj.maxcislo = sqlValues;
                    test = "dvacet";*/
                    console.log(rows[0]);
                    obj.maxcislo = rows[0].max_cislo_v_tridnici;
                }
                res.end(JSON.stringify(obj));
            }
        );
    } else {
        obj.status = -1;
        obj.error = "API not found";
        res.end(JSON.stringify(obj));
    }
}

console.log(test);