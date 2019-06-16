'use strict';
class MiddlewareResponseHelper {

    mdwFunction() {
        return (req, res, next) => {

            const message = (message, status) => {
                res.status(status||200).json({message});
            };

            const data = (message, data, status) => {
                res.status(status||200).json({message, data});
            };

            const error = (error, status) => {
                res.status(status||400).json({error});
            };

            res.replyMsg = message;
            res.replayData = data;
            res.replayErr = error;

            next();
        }
    }

}

module.exports = new MiddlewareResponseHelper().mdwFunction;
