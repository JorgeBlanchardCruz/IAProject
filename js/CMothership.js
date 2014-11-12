
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
        _Agent = new CCartographerAgent(Params, 0.02, 0, 5);
    }

    //METHODS
    this.Agent = function () { return _Agent };
    

};