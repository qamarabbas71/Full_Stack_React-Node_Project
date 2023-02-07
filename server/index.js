import Express from "express";
import mysql2 from "mysql2";
import multer from "multer";
import cors from "cors";

const app = Express();

const db = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "1234567890",
    database: "imgcrud",
    multipleStatements: true,
})
app.use(Express.json())
app.use("/uploads",Express.static("./uploads"))
app.use(cors());

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null, "./uploads")
        },
        filename: (req, file, cb)=>{
            cb(null, file.fieldname + "-" + Date.now() + ".jpg")
        }
    })
}).single("photo")

app.get("/", (req, res) =>{
    res.json("Hello From backend....")
})

// register user
app.post("/register", upload, (req, res) =>{
    const {name}= req.body;
    const {email}= req.body;
    const {phone}= req.body;
    const {address}= req.body;
    const {filename}= req.file;
    const {detail}= req.body;
    try {
        db.query("INSERT INTO userdata SET ?",{username:name,useremail:email,userphone:phone,useraddress:address,userphoto:filename,userdetail:detail},(err,result)=>{
            if (err) {
                console.log("err")
            }else{
                console.log("data added succesfully...")
                res.status(201).json({status:201, data:result})
            }
        });
        } catch (err) {
            res.status(422).json({status:422,err})
        }
})
// get user
app.get("/data",(req, res)=>{
    const q = "SELECT * FROM userdata";
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
            return res.json(data) 
    })
})
// delete user
app.delete("/data/:id",(req, res)=>{
    const {id}= req.params;
    try {
    db.query(`DELETE FROM userdata WHERE id ='${id}'`, (err,result)=>{
        if (err) {
            console.log("err")
        }else{
            console.log("data deleted")
            res.status(201).json({status:201, data:result})
        }
    });
    } catch (err) {
        res.status(422).json({status:422,err})
    }
})

// get single user
app.get("/single/:id",(req, res)=>{
    const {id}= req.params;
    try {
    db.query(`SELECT * FROM userdata WHERE id ='${id}'`, (err,result)=>{
        if (err) {
            console.log("err")
        }else{
            console.log("data deleted")
            res.status(201).json({status:201, data:result})
        }
    });
    } catch (err) {
        res.status(422).json({status:422,err})
    }
})
// update user
app.put("/update/:id",(req, res)=>{
    const {name}= req.body;
    const {email}= req.body;
    const {phone}= req.body;
    const {address}= req.body;
    const {filename}= req.file;
    const {detail}= req.body;
    const {id}= req.params;
    try {
        db.query("UPDATE userdata SET ? WHERE id= ?",{username:name,useremail:email,userphone:phone,useraddress:address,userphoto:filename,userdetail:detail,id:id},(err,result)=>{
            if (err) {
                console.log("err")
            }else{
                console.log("data updated succesfully...")
                res.status(201).json({status:201, data:result})
            }
        });
    } catch (err) {
        res.status(422).json({status:422,err})
    }
})

// update user
// app.put("/update/:id",(req, res)=>{
//     const {id}= req.params;
//     const data = req.body;
//     try {
//     db.query("UPDATE userdata SET ? WHERE id = ?",[data,id],(err,result)=>{
//         if (err) {
//             console.log("err")
//         }else{
//             console.log("Data updates...")
//             res.status(201).json({status:201, data:result})
//         }
//     });
//     } catch (err) {
//         res.status(422).json({status:422,err})
//     }
// })




app.listen(8000, ()=>{

    console.log("Server Running......")

})