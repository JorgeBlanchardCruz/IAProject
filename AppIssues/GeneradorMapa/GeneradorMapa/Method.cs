using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GeneradorMapa
{
    public class Method
    {
        protected Robot robot_;
        public Method(Robot r)
        {
            robot_ = r;
        }

        protected int toNodo(int i, int j) { return (i * robot_.get_parent().get_tab().get_columns() + j); }
        protected int toNodo(Posicion pos) { return (pos.x * robot_.get_parent().get_tab().get_columns() + pos.y); }
        protected Posicion toPosicion(int nodo)
        {
            //Probar esto

            int i = (int) Math.Floor((double) ((double)nodo / (double)robot_.get_parent().get_tab().get_columns()) );
            int j = nodo % robot_.get_parent().get_tab().get_columns();

            return (new Posicion(i, j));
        }
        public virtual void run() {}

    }
}
