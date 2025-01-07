import { isValidObjectId } from "mongoose";

function checkId(req,res,next) {

    if (!isValidObjectId(req.params.id)) {
        return res.status(404);
        throw new Error("Invalid Object of: " + req.params.id);
        return;
    }
    next();

}

module.exports = checkId; 