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

        public virtual void run() {}

    }
}
