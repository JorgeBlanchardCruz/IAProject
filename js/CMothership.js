
/**
 * @author Jorge O. Blanchard Cruz
 * 
 */
"use strict";

var CMothership = function (Params) {

    var _Agent;
    var Pathjs, PathCSHarp;

    //INITIALIZE
    init();

    //PROCEDURES
    function init() {
        _Agent = new CAgent(Params, 0.05, true);

        PathCSHarp = Params.path;

        _Agent.setPath("CSharp", PathCSHarp);
    }

    //METHODS
    this.Agent = function () { return _Agent };

    this.CalculateASTAR = function (Mapcalculation) {
        if (_Agent == null) return;

        Pathjs = _Agent.Searchstrategy_ASTAR(Params.NodeSTART, Params.NodeOBJETIVE, Mapcalculation);

        _Agent.setPath("javascript", Pathjs);

        alert("Se ha terminado el proceso de calculo A*");
    }
    

};