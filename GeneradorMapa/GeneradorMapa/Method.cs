using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GeneradorMapa
{
    class Method
    {
        protected Robot robot_;
        public Method(Robot r)
        {
            robot_ = r;
        }
        public virtual void run() { 
        }

        protected int toNodo(int i, int j) { return (i * robot_.get_parent().get_tab().get_columns() + j); }
        protected int toNodo(Posicion pos) { return (pos.x * robot_.get_parent().get_tab().get_columns() + pos.y); }
    }
}
