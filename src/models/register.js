const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    confirmpassword:{
        type:String
    },
    number:{
        type:Number
    },
    tokens:[{
        token:{
            type:String
        }
    }]
})

//creating a token 
employeeSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()}, "mynameissahilpunjabicomputerengineer");
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        res.send("error is" + error);
        console.log("error is"+ error);
    }
}

//hasing the password

employeeSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
    }

    next();
})

//creating a collection
const Register = new mongoose.model("Register",employeeSchema);
module.exports = Register;
