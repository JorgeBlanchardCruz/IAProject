
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
        _Agent = new CAgent(Params, 0.05, true, 0, 10);
    }

    //METHODS
    this.Agent = function () { return _Agent };
    

};