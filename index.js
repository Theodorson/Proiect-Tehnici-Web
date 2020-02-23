var  express 	=  require("express");
var app 		=  express();
var bodyParser =  require("body-parser");
var mongoose 	=  require("mongoose");
var passport   = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var mongooselocal= require("passport-local-mongoose");
var Strategy = require('passport-local').Strategy;
mongoose.connect("mongodb://localhost/leviathan_site",{ useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true,useNewUrlParser: true}));
app.use(methodOverride("_method"));

var SchemaUser = new mongoose.Schema({
    username: String,
    password: String
});


var ProdusSchema = new mongoose.Schema({
    name: String,
    pret: Number,
    image: String,
    descriere: String,
    activare: Boolean,
    adauga_cos: Boolean,
    promotie: Boolean,
    nr_bucati: Number
});

var RecenzieSchema = new mongoose.Schema(
    {
    I_1: String,
    I_2: String,
    I_3: String,
    I_4: String,
    I_5: String
    });

var ComandaSchema = new mongoose.Schema(
    {
     nume_utilizator: String,
     localitate: String,
     nr_produse: Number,
     suma: Number
    });

var cantitati={};
var pret_total=0;
var admin = false;
var comenzi = mongoose.model ("comenzi", ComandaSchema);
var recenzii = mongoose.model ("recenzii", RecenzieSchema);
var produs = mongoose.model("produs", ProdusSchema);


SchemaUser.plugin(mongooselocal);
var users = mongoose.model("User",SchemaUser);

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Jaxana",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(users.authenticate()));
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());

/* users.create(
{
    username: "admin",
    password: "1234"
}, function(err,x) {
    console.log(x);
}); */


exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}


passport.use(new Strategy(
    function(username, password, cb) {
      users.findByUsername(username, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
      });
    }));


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});

/*
produs.create(
    {
     name: "Super Sword",
     pret: 1200,
     descriere: "KAI",
     image: "http://www.heavenlyswords.com/images/D/25_in_WAR_BLADE_Short_Sword_TR0393.jpg",
     promotie: false
    },function(err,product){
        console.log(product);
    });


produs.create(
    {
     name: "Viking Axe",
     pret: 699,
     descriere: "Sweden",
     image: "https://i.etsystatic.com/15267489/r/il/da29e1/1747297120/il_570xN.1747297120_7bhb.jpg",
     promotie: true
    },function(err,product){
        console.log(product);
    });



    produs.create(
        {
         name: "Maceta",
         pret: 899,
         descriere: "Brazilia",
         image: "http://cutitedeabatoare.ro/userfiles/productlargeimages/product_3903.jpg",
         promotie: true
        },function(err,product){
            console.log(product);
        });



 produs.create(
     {
      name: "Katana",
      pret: 500,
      descriere: "Lion Heart",
      image: "https://ae01.alicdn.com/kf/HTB17Mv4OFXXXXcoXXXXq6xXFXXXV/Hot-handmade-katanas-swords-katanas-samurai-japanese-swords-real-katana-swords-for-sale-Sharp-write.jpg",

     },function(err,product){
         console.log(product);
     });

 produs.create(
     {
      name: "Katana",
      pret: 450,
      descriere: "Lion Heart",
      image: "https://img3.sellerbooster.com/f5/1476220463535.jpg",
      promotie: true
     },function(err,product){
         console.log(product);
     });
 produs.create(
     {
      name: "Katana",
      pret: 550,
      descriere: "Lion Heart",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpZOvN5vqLYFf5omThly4BWhI5xgiYS8s98APcHArlu7ykywSo&s",

     },function(err,product){
         console.log(product);
     });          

*/

/*
produs.deleteOne({},function (err) {
    if (err) return handleError(err);
    // deleted at most one tank document
  });
*/

    




produs.find({},function(err,xd){
        console.log(xd);
        for (var i=0; i<xd.length; i++)
        produs.findByIdAndUpdate(xd[i].id, {adauga_cos: false, activare: true} ,function (err, x) {
       });
    });

app.get ("/StergeProdusCos/:id", function(req, res)
{
        produs.findByIdAndUpdate(req.params.id, {adauga_cos: false} ,function (err, x) {
          res.redirect("/CosulMeu"); 
        });
});


 app.get("/", function(req, res){
    produs.find({promotie: true, activare: true},function(err,xd){
        res.render("HomePage.ejs", {product:xd, admin: admin});
    }); 
});

app.get("/Administrare", function(req, res){
        res.render("Administrare.ejs", {admin: admin});
    }); 

app.get("/ManagementProduse", function(req, res){
        produs.find({},function(err,xd){
            res.render("Management.ejs", {product:xd, admin: admin});    
        }); 
    });

app.get("/Activare/:id", function(req, res){
        produs.findByIdAndUpdate(req.params.id,{activare: true} ,function (err, x) {
            res.redirect("/ManagementProduse"); 
        });
        });

app.get("/Dezactivare/:id", function(req, res){
            produs.findByIdAndUpdate(req.params.id,{activare: false} ,function (err, x) {
                res.redirect("/ManagementProduse"); 
            });
            });

app.get("/ToateProdusele", function(req, res){
      produs.find({activare: true},function(err,xd){
          res.render("ToateProdusele.ejs", {product:xd,  admin: admin});
      }); 
});


app.get("/Promotii", function(req, res){
    produs.find({promotie: true, activare: true},function(err,xd){
        res.render("Promotii.ejs", {product:xd,  admin: admin});
    }); 
});





app.get("/Produs/:id", function(req, res){
    produs.findById(req.params.id, function (err, adventure) {
        res.render("Produs.ejs", {product:adventure,  admin: admin});
    });
    }); 



///Sortari 
app.get("/SortareNumeAsc", function(req, res){
    produs.find({}).sort({name:'asc'}).exec(function(err, xd) { 
        res.render("ToateProdusele.ejs", {product: xd, admin: admin});
     });
    });  
 

app.get("/SortareNumeDesc", function(req, res){
    produs.find({}).sort({name:'desc'}).exec(function(err, xd) { 
        res.render("ToateProdusele.ejs", {product:xd, admin: admin});
     });  
}); 
app.get("/SortarePretAsc", function(req, res){
    produs.find({}).sort({pret:"asc"}).exec(function(err, xd) { 
        res.render("ToateProdusele.ejs", {product:xd, admin: admin});
     });  
});

app.get("/SortarePretDesc", function(req, res){
    produs.find({}).sort({pret:"desc"}).exec(function(err, xd) { 
        res.render("ToateProdusele.ejs", {product:xd, admin: admin});
     });  
});


app.get("/Produs/:id", function(req, res){
    produs.findById(req.params.id, function (err, adventure) {
        res.render("Produs.ejs", {product:adventure, admin: admin });
    });
    });

app.get("/AdaugareCos/:id", function(req, res){
    produs.findByIdAndUpdate(req.params.id,{adauga_cos: true} ,function (err, x) {
        res.render("Produs.ejs", {product:x, admin: admin});
    });
    });


app.get('/CosulMeu', function (req, res) {
    produs.find({adauga_cos: true}, function (err,v) {
      res.render("CosulMeu.ejs", { product: v, cantitate: {} , admin: admin});
    });
  });
  
  app.post('/CosulMeu', function (req, res) {
     cantitati = req.body.cantitate;
    produs.find({adauga_cos: true}, function (err,v) {
      res.render("CosulMeu.ejs", { product: v, cantitate: cantitati , admin:admin});
      console.log(pret_total);
    });
    produs.find({adauga_cos: true}, function (err,v) {
        if (cantitati.length!=0)
       { for (var i=0; i<v.length; i++)
             pret_total+=Number(v[i].pret*cantitati[i]);
        pret_total+=Number(20);
       }
       else pret_total=0;
      });
  });



  app.get("/Recenzii", function(req, res){
    res.render("Recenzii.ejs",{ admin: admin});
});



  app.post("/AdaugareRecenzie", function (req, res) {
  var recenzie = req.body;
  if (!(recenzie.I1 || recenzie.I1_) || !(recenzie.I2 || recenzie.I2_) ||
    !(recenzie.I3 || recenzie.I3_) || !(recenzie.I4 || recenzie.I4_) || !(recenzie.I5 || recenzie.I5_)) 
    {
        res.render("Recenzii.ejs",{ admin: admin});
    }
   else {
    var q1,q2,q3,q4,q5;
    if (recenzie.I1)
    q1 = "da"
    else q1= "nu"
    if (recenzie.I2)
    q2 = "da"
    else q2= "nu"
    if (recenzie.I3)
    q3 = "da"
    else q3= "nu"
    if (recenzie.I4)
    q4 = "da"
    else q4= "nu"
    if (recenzie.I5)
    q5 = "da"
    else q5= "nu"

    recenzii.create(
     {  
        I_1: q1,
        I_2: q2,
        I_3: q3,
        I_4: q4,
        I_5: q5
     },function (err, r)
     {
         if (err) console.log(Eroare);
         console.log(r);
     }
    );
    res.render("Recenzii.ejs",{ admin: admin});
  }
});


app.get("/AdaugareProdus", function(req, res){    
    res.render("AdaugareProdus.ejs",{admin: admin});
});


app.post("/AdaugareProdus", function(req, res){    
    var obiect=req.body;
    if ( !obiect.Nume || !obiect.Descriere || !obiect.Pret || !obiect.Imagine  )
    {
        console.log(obiect.Nume);
     res.render("AdaugareProdus.ejs",{admin:admin});   
    }
    else {
    produs.create(
    {
        name: obiect.Nume,
        pret: obiect.Pret,
        descriere: obiect.Descriere,
        image: obiect.Imagine,
        promotie: false,
        activare: true
       },function(err,product){
           console.log(product);
    });
    

    res.render("Administrare.ejs",{admin: admin});
    }
});



app.post("/AdaugareComanda", function(req, res){    
    var obiect=req.body;
    if ( !obiect.Nume || !obiect.Localitate)
    {
        console.log(obiect.Nume);
     res.render("FinalizareComanda.ejs",{admin:admin});   
    }
    else {
        var nr=0;
        for (i=0; i<cantitati.length; i++)
             nr += Number(cantitati[i]);
    comenzi.create(
    {
        nume_utilizator: obiect.Nume,
        localitate: obiect.Localitate,
        nr_produse: nr,
        suma: pret_total      
       },function(err,a){
           console.log(a);
    });
    produs.find({},function(err,xd){
        for (var i=0; i<xd.length; i++)
        produs.findByIdAndUpdate(xd[i].id, {adauga_cos: false} ,function (err, x) {
       });
    });
    cantitati={};
    pret_total=0;
    res.redirect("/");
    }
});

app.get("/IstoricComenzi", function(req, res){   
    comenzi.find({},function(err,v)
    {    
        res.render("IstoricComenzi.ejs", {comenzi: v,  admin: admin});
    });
    
});


app.get("/IstoricRecenzii", function(req, res){   
    recenzii.find({},function(err,v)
    {    
        res.render("IstoricRecenzii.ejs", {recenzii: v,  admin: admin});
    });
    
});



app.get("/FinalizeazaComanda", function(req, res){    
            res.render("FinalizareComanda.ejs", {admin: admin});
    });
    

   

    
app.get("/Login", function(req, res){
        res.render("Login.ejs", { admin: admin}); 
});
    
  app.post('/Login', 
    passport.authenticate('local', { failureRedirect: '/Login' }),
    function(req, res) {
      admin = true;
      res.redirect("/");
    }, );
    
  app.get('/Logout',
    function(req, res){
        admin = false;
      req.logout();
      res.redirect('/');
    });
  
         





