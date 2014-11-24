
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
        _Agent = new CAgent(Params, 0.05, true, Params.posAgent[0], Params.posAgent[1]);
        _Agent.SetPath(Params.path); //esto es una ruta de prueba
    }

    //METHODS
    this.Agent = function () { return _Agent };
    

};