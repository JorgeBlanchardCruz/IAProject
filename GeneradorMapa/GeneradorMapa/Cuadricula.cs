using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GeneradorMapa
{
    class Cuadricula
    {
        private Celda[,] Celdas_;
        private int rows_;
        private int columns_;
        private Form1 parent_;
       public  Cuadricula(int a, int b, Form1 p)
        {
            parent_ = p;
            rows_ = a;
            columns_ = b;
            Celdas_ = new Celda[a,b];
            

            for (int i = 0; i < a; i++)
                for (int j = 0; j < b; j++)
                    Celdas_[i,j] = new Celda(i, j, 0, parent_);      
        }

       public Celda get_Celda(int i, int j) { return Celdas_[i,j]; }
       public int get_rows() { return rows_; }
       public int get_columns() { return columns_; }
    }
}
