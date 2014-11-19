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
        public virtual void run() {}
    }
}
