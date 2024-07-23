const mongoose = require("mongoose");

const ImageDetailsSchema = new mongoose.Schema (
    {
        image:String
    },
    {
        colection: "ImageDetails",
    }
);

mongoose.model("ImageDetails", ImageDetailsSchema);