module.exports = class command {

    static parse (message, config) {
        if (this.match(message, config)) {
            this.action(message, config)
            return true
        }
        return false
    }

    static match (message, config) {
        return false;
    }

    static action (message, config) {
        return false;
    }

}
