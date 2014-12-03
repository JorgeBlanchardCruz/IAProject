using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GeneradorMapa
{
   
    enum Direcciones{NORTE  = 0, SUR = 1, ESTE = 2, OESTE = 3};
    public struct Posicion {
        public int x, y; 
        public Posicion (int a, int b) {x = a; y = b;}
    }
    public class Robot
    {
       private int[] sensores_;
       private Method metodo_;
       private Posicion pos_;
       private Trayectoria trayectoria_;
       private Form1 parent_;
       private Posicion meta_;
 
       public Robot(int a, int b, int x, int y, Form1 p)
       {
           sensores_ = new int[4];     
           pos_ = new Posicion(x, y);
           meta_ = new Posicion(a, b);
           parent_ = p;
           trayectoria_ = new Trayectoria();
           actualizarSensores();
           metodo_ = new A_Star(this);
       }
       
       public void actualizarSensores()
       {
        
           try
           {
               sensores_[(int)Direcciones.NORTE] = parent_.get_tab().get_Celda(pos_.x , pos_.y - 1).get_index();
           }
           catch (IndexOutOfRangeException)
           {
               sensores_[(int)Direcciones.NORTE] = -1;
           }
           try
           {
               sensores_[(int)Direcciones.SUR] = parent_.get_tab().get_Celda(pos_.x, pos_.y + 1).get_index();
           }
           catch (IndexOutOfRangeException)
           {
               sensores_[(int)Direcciones.SUR] = -1;
           }
           try
           {
               sensores_[(int)Direcciones.ESTE] = parent_.get_tab().get_Celda(pos_.x + 1, pos_.y).get_index();
           }
           catch (IndexOutOfRangeException)
           {
               sensores_[(int)Direcciones.ESTE] = -1;
           }
           try
           {
               sensores_[(int)Direcciones.OESTE] = parent_.get_tab().get_Celda(pos_.x - 1, pos_.y).get_index();
           }
           catch (IndexOutOfRangeException)
           {
               sensores_[(int)Direcciones.OESTE] = -1;
           }
       }

       public Posicion get_pos() { return pos_; }
       public void set_pos(Posicion p) { pos_ = p; }
       public Trayectoria get_trayectoria() { return trayectoria_; }
       public int[] get_sensores() { return sensores_; }
       public Form1 get_parent() { return parent_; }

       public Method get_method() { return metodo_; }
       public Posicion get_meta() { return meta_; }
       public void set_meta(Posicion p) { meta_ = p; }

    }
}
