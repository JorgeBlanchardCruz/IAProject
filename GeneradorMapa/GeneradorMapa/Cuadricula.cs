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
       public  Cuadricula(int a, int b, int c, Form1 p)
        {
            parent_ = p;
            rows_ = a;
            columns_ = b;
            Celdas_ = new Celda[a,b];
            int obs = 0;
            Random al = new Random();
         
            for (int i = 0; i < a; i++)
            {
                for (int j = 0; j < b; j++)
                {
                    if (i == 0 || i == a - 1)
                        Celdas_[i, j] = new Celda(i, j, 3, parent_);
                    else if (j == 0 || j == b - 1)
                        Celdas_[i, j] = new Celda(i, j, 3, parent_);
                    else if (obs < c)
                    {
                        if ((al.Next(100)/(float)100) <= (float)((float)c / ((float)a * (float)b)))
                        {

                            Celdas_[i, j] = new Celda(i, j, 3, parent_);
                        }
                        else
                            Celdas_[i, j] = new Celda(i, j, 0, parent_);
                    }
                    else
                        Celdas_[i, j] = new Celda(i, j, 0, parent_);
                }

            }
        }

       public Celda get_Celda(int i, int j) { return Celdas_[i,j]; }
       public int get_rows() { return rows_; }
       public int get_columns() { return columns_; }
    }
}
