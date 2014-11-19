using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GeneradorMapa
{
    class DFS : Method
    {
        private bool[] visitado_;
       public DFS(Robot r):base(r) {
           visitado_ = new bool[robot_.get_parent().get_tab().get_rows() * robot_.get_parent().get_tab().get_columns()];
           for (int i = 0; i < visitado_.Length; i++)
               visitado_[i] = false;
       }
       private int toNodo(int i, int j) { return (i * robot_.get_parent().get_tab().get_columns() + j); }
       public override void run()
       {
           runDfs(new Posicion(robot_.get_pos().x, robot_.get_pos().y));
       }
       private void runDfs(Posicion pos)
       {
           visitado_[toNodo(pos.x, pos.y)] = true;

           if (pos.y - 1 >= 0 && !visitado_[toNodo(pos.x, pos.y - 1)] && robot_.get_sensores()[(int)Direcciones.NORTE] == 0)
           {
               robot_.set_pos(new Posicion (pos.x, pos.y - 1));
               robot_.actualizarSensores();
               robot_.get_trayectoria().move_Norte();

               runDfs(new Posicion (pos.x, pos.y - 1));

               robot_.set_pos(new Posicion(pos.x, pos.y));
               robot_.actualizarSensores();
               robot_.get_trayectoria().move_Sur();
           }
           if (pos.y + 1 < robot_.get_parent().get_tab().get_columns() && !visitado_[toNodo(pos.x, pos.y + 1)] && robot_.get_sensores()[(int)Direcciones.SUR] == 0)
           {
               robot_.set_pos(new Posicion(pos.x, pos.y + 1));
               robot_.actualizarSensores();
               robot_.get_trayectoria().move_Sur();

               runDfs(new Posicion(pos.x, pos.y + 1));

               robot_.set_pos(new Posicion(pos.x, pos.y));
               robot_.actualizarSensores();
               robot_.get_trayectoria().move_Norte();
           }
           if (pos.x + 1 < robot_.get_parent().get_tab().get_rows() && !visitado_[toNodo(pos.x + 1, pos.y)] && robot_.get_sensores()[(int)Direcciones.ESTE] == 0)
           {
               robot_.set_pos(new Posicion(pos.x + 1, pos.y));
               robot_.actualizarSensores();
               robot_.get_trayectoria().move_Este();

               runDfs(new Posicion(pos.x + 1, pos.y));

               robot_.set_pos(new Posicion(pos.x, pos.y));
               robot_.actualizarSensores();
               robot_.get_trayectoria().move_Oeste();
           }
           if (pos.x - 1 >= 0 && !visitado_[toNodo(pos.x - 1, pos.y)] && robot_.get_sensores()[(int)Direcciones.OESTE] == 0)
           {
               robot_.set_pos(new Posicion(pos.x - 1, pos.y));
               robot_.actualizarSensores();
               robot_.get_trayectoria().move_Oeste();

               runDfs(new Posicion(pos.x - 1, pos.y));

               robot_.set_pos(new Posicion(pos.x, pos.y));
               robot_.actualizarSensores();
               robot_.get_trayectoria().move_Este();
           }
       }
    }
}
