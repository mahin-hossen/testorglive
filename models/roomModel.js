const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userModel = require("./userModel")

const roomSchema = new mongoose.Schema({
    teacherName:{type:String},
    teacherId:{type: mongoose.Schema.Types.ObjectId},
    courseName:{type: String},
    questions:{type:[]},
    student:{type:[]},
    startTime : {type: Date},
    endTime : {type: Date},
    createdAt : {type: Date},
    totalMarks : {type: Number}
})

roomSchema.statics.createRoom = async function (userDoc,room){
    console.log("userDoc", userDoc)
    console.log("room",room)
    const newRoom = await this.create({ 
        teacherId : userDoc._id,
        teacherName : userDoc.username,
        courseName : room.courseName,
        questions : room.question,
        startTime : room.startTime,
        endTime : room.endTime,
        createdAt : room.createdAt,
        totalMarks : room.totalMarks   
    })
    const result = await userModel.updateOne({_id:userDoc._id},{$push : {
        myRooms:
        {
            "roomID" :newRoom._id,
            "teacherName" : userDoc.username,
            "startTime" : room.startTime,
            "endTime" : room.endTime,
            "CourseName" : room.courseName,
            "CreatedAt" : room.createdAt,
            "participated" : false,
            "totalMarks":room.totalMarks,
            "gotMarks":0
        },
        
    },$inc:{totalRooms:1}})//increment totalrooms by 1
    return [result.acknowledged,newRoom._id.toString()]
}

roomSchema.statics.myRoom = async function(id){
    const roomData = await userModel.find({_id:id},{myRooms:1})
    return roomData;
}

roomSchema.statics.roomInfo = async function(roomID)
{
    const room = await this.findById(roomID);
    return room;
}

roomSchema.statics.insertAsStudent = async function(roomID,userID)
{
    const result = await this.updateOne({_id:roomID},{$push : {
        student:
        {            
            "student" : userID,

        },
        
    },$inc:{totalRooms:1}})//increment totalrooms by 1
    return [result.acknowledged,newRoom._id.toString()]
}
module.exports = mongoose.model("Room",roomSchema);