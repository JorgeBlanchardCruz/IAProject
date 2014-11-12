
/**
 * @author Jorge O. Blanchard Cruz
 * 
 */

var CMothership = function (Params) {
    "use strict";

    var _Agent;

    //INITIALIZE
    init();

    //PROCEDURES
    function init() {
        _Agent = new CCartographerAgent(Params, 0.05, 0, 10);
    }

    //METHODS
    this.Agent = function () { return _Agent };
    

};