'use strict';
class ObjectHelper {

    removeKeys(obj) {
        if (!obj instanceof Object) throw new Error("ObjectHelper => obj argument value reference is required");
        for (let key of arguments) {
            if (typeof key === "string")
                delete obj[key];
        }
    }

}

module.exports = new ObjectHelper();
